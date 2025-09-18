import { PrismaClient, Prisma } from "@prisma/client";
import { createPackageLogger } from "@botking/logger";
import type { SchemaValidator, ValidationResult } from "../schema-validator";

/**
 * Base repository interface
 */
export interface IRepository<T> {
  findById(id: string): Promise<T | null>;
  findMany(options?: FindManyOptions): Promise<T[]>;
  create(data: Partial<T>): Promise<T>;
  update(id: string, data: Partial<T>): Promise<T>;
  delete(id: string): Promise<void>;
  count(where?: any): Promise<number>;
}

/**
 * Find many options interface
 */
export interface FindManyOptions {
  where?: any;
  orderBy?: any;
  skip?: number;
  take?: number;
  include?: any;
  select?: any;
}

/**
 * Repository configuration
 */
export interface RepositoryConfig {
  enableSoftDelete?: boolean;
  enableAuditLog?: boolean;
  enableCache?: boolean;
  cacheTTL?: number; // in seconds
}

/**
 * Abstract base repository class
 * Provides common CRUD operations and validation
 */
export abstract class BaseRepository<T> implements IRepository<T> {
  protected prisma: PrismaClient;
  protected validator: SchemaValidator;
  protected logger: ReturnType<typeof createPackageLogger>;
  protected config: RepositoryConfig;
  protected cache: Map<string, { data: T; expiry: number }> = new Map();

  constructor(
    prisma: PrismaClient,
    validator: SchemaValidator,
    protected entityName: string,
    config: RepositoryConfig = {}
  ) {
    this.prisma = prisma;
    this.validator = validator;
    this.logger = createPackageLogger("db", {
      service: `${entityName}-repository`,
    });
    this.config = {
      enableSoftDelete: false,
      enableAuditLog: false,
      enableCache: false,
      cacheTTL: 300, // 5 minutes default
      ...config,
    };
  }

  /**
   * Get the Prisma model delegate for this entity
   */
  protected abstract getModel(): any;

  /**
   * Validate data before create/update operations
   */
  protected abstract validateData(
    data: any,
    operation: "create" | "update"
  ): ValidationResult;

  /**
   * Transform data before saving to database
   */
  protected transformForSave(data: Partial<T>): any {
    return data;
  }

  /**
   * Transform data after loading from database
   */
  protected transformFromDatabase(data: any): T {
    return data as T;
  }

  /**
   * Find entity by ID
   */
  public async findById(id: string, include?: any): Promise<T | null> {
    try {
      // Check cache first
      if (this.config.enableCache) {
        const cached = this.getCachedItem(id);
        if (cached) {
          this.logger.debug(`Cache hit for ${this.entityName}`, { id });
          return cached;
        }
      }

      this.logger.debug(`Finding ${this.entityName} by ID`, { id });

      const model = this.getModel();
      const result = await model.findUnique({
        where: { id },
        ...(include && { include }),
      });

      if (!result) {
        this.logger.debug(`${this.entityName} not found`, { id });
        return null;
      }

      const transformed = this.transformFromDatabase(result);

      // Cache the result
      if (this.config.enableCache) {
        this.setCachedItem(id, transformed);
      }

      return transformed;
    } catch (error) {
      this.logger.error(`Error finding ${this.entityName} by ID`, {
        id,
        error,
      });
      throw error;
    }
  }

  /**
   * Find multiple entities
   */
  public async findMany(options: FindManyOptions = {}): Promise<T[]> {
    try {
      this.logger.debug(`Finding multiple ${this.entityName}`, { options });

      const model = this.getModel();
      const results = await model.findMany({
        where: options.where,
        orderBy: options.orderBy,
        skip: options.skip,
        take: options.take,
        include: options.include,
        select: options.select,
      });

      return results.map((result: any) => this.transformFromDatabase(result));
    } catch (error) {
      this.logger.error(`Error finding multiple ${this.entityName}`, {
        options,
        error,
      });
      throw error;
    }
  }

  /**
   * Create new entity
   */
  public async create(data: Partial<T>): Promise<T> {
    try {
      this.logger.debug(`Creating ${this.entityName}`, { data });

      // Validate data
      const validation = this.validateData(data, "create");
      if (!validation.isValid) {
        const error = new Error(
          `Validation failed for ${this.entityName} creation`
        );
        this.logger.error("Validation failed", { errors: validation.errors });
        throw error;
      }

      // Transform data for saving
      const transformedData = this.transformForSave(data);

      // Add audit fields if enabled
      if (this.config.enableAuditLog) {
        transformedData.createdAt = new Date();
        transformedData.updatedAt = new Date();
      }

      const model = this.getModel();
      const result = await model.create({
        data: transformedData,
      });

      const transformed = this.transformFromDatabase(result);

      // Cache the result
      if (this.config.enableCache && result.id) {
        this.setCachedItem(result.id, transformed);
      }

      this.logger.info(`${this.entityName} created successfully`, {
        id: result.id,
      });
      return transformed;
    } catch (error) {
      this.logger.error(`Error creating ${this.entityName}`, { data, error });
      throw error;
    }
  }

  /**
   * Update existing entity
   */
  public async update(id: string, data: Partial<T>): Promise<T> {
    try {
      this.logger.debug(`Updating ${this.entityName}`, { id, data });

      // Validate data
      const validation = this.validateData(data, "update");
      if (!validation.isValid) {
        const error = new Error(
          `Validation failed for ${this.entityName} update`
        );
        this.logger.error("Validation failed", { errors: validation.errors });
        throw error;
      }

      // Transform data for saving
      const transformedData = this.transformForSave(data);

      // Add audit fields if enabled
      if (this.config.enableAuditLog) {
        transformedData.updatedAt = new Date();
      }

      const model = this.getModel();
      const result = await model.update({
        where: { id },
        data: transformedData,
      });

      const transformed = this.transformFromDatabase(result);

      // Update cache
      if (this.config.enableCache) {
        this.setCachedItem(id, transformed);
      }

      this.logger.info(`${this.entityName} updated successfully`, { id });
      return transformed;
    } catch (error) {
      this.logger.error(`Error updating ${this.entityName}`, {
        id,
        data,
        error,
      });
      throw error;
    }
  }

  /**
   * Delete entity
   */
  public async delete(id: string): Promise<void> {
    try {
      this.logger.debug(`Deleting ${this.entityName}`, { id });

      const model = this.getModel();

      if (this.config.enableSoftDelete) {
        // Soft delete
        await model.update({
          where: { id },
          data: {
            deletedAt: new Date(),
            ...(this.config.enableAuditLog && { updatedAt: new Date() }),
          },
        });
      } else {
        // Hard delete
        await model.delete({
          where: { id },
        });
      }

      // Remove from cache
      if (this.config.enableCache) {
        this.cache.delete(id);
      }

      this.logger.info(`${this.entityName} deleted successfully`, { id });
    } catch (error) {
      this.logger.error(`Error deleting ${this.entityName}`, { id, error });
      throw error;
    }
  }

  /**
   * Count entities
   */
  public async count(where?: any): Promise<number> {
    try {
      this.logger.debug(`Counting ${this.entityName}`, { where });

      const model = this.getModel();
      const count = await model.count({ where });

      return count;
    } catch (error) {
      this.logger.error(`Error counting ${this.entityName}`, { where, error });
      throw error;
    }
  }

  /**
   * Check if entity exists
   */
  public async exists(id: string): Promise<boolean> {
    try {
      const result = await this.findById(id);
      return result !== null;
    } catch (error) {
      this.logger.error(`Error checking if ${this.entityName} exists`, {
        id,
        error,
      });
      return false;
    }
  }

  /**
   * Batch create entities
   */
  public async createMany(data: Partial<T>[]): Promise<{ count: number }> {
    try {
      this.logger.debug(`Batch creating ${this.entityName}`, {
        count: data.length,
      });

      // Validate all data
      for (const item of data) {
        const validation = this.validateData(item, "create");
        if (!validation.isValid) {
          const error = new Error(
            `Validation failed for batch ${this.entityName} creation`
          );
          this.logger.error("Batch validation failed", {
            errors: validation.errors,
          });
          throw error;
        }
      }

      // Transform all data
      const transformedData = data.map((item) => {
        const transformed = this.transformForSave(item);
        if (this.config.enableAuditLog) {
          transformed.createdAt = new Date();
          transformed.updatedAt = new Date();
        }
        return transformed;
      });

      const model = this.getModel();
      const result = await model.createMany({
        data: transformedData,
      });

      this.logger.info(`Batch ${this.entityName} creation completed`, {
        count: result.count,
      });
      return result;
    } catch (error) {
      this.logger.error(`Error batch creating ${this.entityName}`, {
        count: data.length,
        error,
      });
      throw error;
    }
  }

  /**
   * Get cached item
   */
  private getCachedItem(id: string): T | null {
    const cached = this.cache.get(id);
    if (!cached) return null;

    // Check if expired
    if (Date.now() > cached.expiry) {
      this.cache.delete(id);
      return null;
    }

    return cached.data;
  }

  /**
   * Set cached item
   */
  private setCachedItem(id: string, data: T): void {
    const expiry = Date.now() + this.config.cacheTTL! * 1000;
    this.cache.set(id, { data, expiry });
  }

  /**
   * Clear cache
   */
  public clearCache(): void {
    this.cache.clear();
    this.logger.debug(`Cache cleared for ${this.entityName}`);
  }

  /**
   * Get repository statistics
   */
  public getStats(): {
    entityName: string;
    cacheSize: number;
    config: RepositoryConfig;
  } {
    return {
      entityName: this.entityName,
      cacheSize: this.cache.size,
      config: this.config,
    };
  }
}
