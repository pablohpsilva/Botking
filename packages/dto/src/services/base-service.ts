import {
  BaseDTO,
  ValidationResult,
  PaginatedResponse,
  SearchOptions,
  FilterOptions,
} from "../interfaces/base-dto";

/**
 * Base repository interface for database operations
 */
export interface IRepository<T extends BaseDTO> {
  create(data: Omit<T, "id" | "createdAt" | "updatedAt">): Promise<T>;
  findById(id: string): Promise<T | null>;
  findMany(options?: SearchOptions): Promise<PaginatedResponse<T>>;
  update(id: string, data: Partial<T>): Promise<T>;
  delete(id: string): Promise<boolean>;
  exists(id: string): Promise<boolean>;
  count(filters?: FilterOptions): Promise<number>;
}

/**
 * Base service class with common CRUD operations
 */
export abstract class BaseService<T extends BaseDTO> {
  constructor(protected repository: IRepository<T>) {}

  /**
   * Create a new entity
   */
  public async create(
    data: Omit<T, "id" | "createdAt" | "updatedAt">
  ): Promise<T> {
    const validation = await this.validateCreate(data);
    if (!validation.isValid) {
      throw new ValidationError("Invalid data", validation.errors);
    }

    const entity = await this.repository.create(data);
    await this.afterCreate(entity);
    return entity;
  }

  /**
   * Find entity by ID
   */
  public async findById(id: string): Promise<T | null> {
    if (!id) {
      throw new Error("ID is required");
    }

    return await this.repository.findById(id);
  }

  /**
   * Find entity by ID or throw error
   */
  public async findByIdOrThrow(id: string): Promise<T> {
    const entity = await this.findById(id);
    if (!entity) {
      throw new NotFoundError(`Entity with ID ${id} not found`);
    }
    return entity;
  }

  /**
   * Find multiple entities with pagination
   */
  public async findMany(
    options?: SearchOptions
  ): Promise<PaginatedResponse<T>> {
    const searchOptions = this.normalizeSearchOptions(options);
    return await this.repository.findMany(searchOptions);
  }

  /**
   * Update an entity
   */
  public async update(id: string, data: Partial<T>): Promise<T> {
    await this.findByIdOrThrow(id); // Ensure entity exists

    const validation = await this.validateUpdate(id, data);
    if (!validation.isValid) {
      throw new ValidationError("Invalid update data", validation.errors);
    }

    const entity = await this.repository.update(id, data);
    await this.afterUpdate(entity);
    return entity;
  }

  /**
   * Delete an entity
   */
  public async delete(id: string): Promise<boolean> {
    await this.findByIdOrThrow(id); // Ensure entity exists

    const canDelete = await this.canDelete(id);
    if (!canDelete) {
      throw new Error("Entity cannot be deleted");
    }

    const result = await this.repository.delete(id);
    if (result) {
      await this.afterDelete(id);
    }
    return result;
  }

  /**
   * Check if entity exists
   */
  public async exists(id: string): Promise<boolean> {
    return await this.repository.exists(id);
  }

  /**
   * Get count of entities
   */
  public async count(filters?: FilterOptions): Promise<number> {
    return await this.repository.count(filters);
  }

  /**
   * Bulk create entities
   */
  public async bulkCreate(
    dataArray: Array<Omit<T, "id" | "createdAt" | "updatedAt">>
  ): Promise<T[]> {
    const results: T[] = [];

    for (const data of dataArray) {
      const entity = await this.create(data);
      results.push(entity);
    }

    return results;
  }

  /**
   * Bulk update entities
   */
  public async bulkUpdate(
    updates: Array<{ id: string; data: Partial<T> }>
  ): Promise<T[]> {
    const results: T[] = [];

    for (const update of updates) {
      const entity = await this.update(update.id, update.data);
      results.push(entity);
    }

    return results;
  }

  /**
   * Bulk delete entities
   */
  public async bulkDelete(ids: string[]): Promise<boolean[]> {
    const results: boolean[] = [];

    for (const id of ids) {
      const result = await this.delete(id);
      results.push(result);
    }

    return results;
  }

  // Abstract methods for customization

  /**
   * Validate data before creation
   */
  protected async validateCreate(
    data: Omit<T, "id" | "createdAt" | "updatedAt">
  ): Promise<ValidationResult> {
    return { isValid: true, errors: [] };
  }

  /**
   * Validate data before update
   */
  protected async validateUpdate(
    id: string,
    data: Partial<T>
  ): Promise<ValidationResult> {
    return { isValid: true, errors: [] };
  }

  /**
   * Check if entity can be deleted
   */
  protected async canDelete(id: string): Promise<boolean> {
    return true;
  }

  /**
   * Hook called after entity creation
   */
  protected async afterCreate(entity: T): Promise<void> {
    // Override in subclasses
  }

  /**
   * Hook called after entity update
   */
  protected async afterUpdate(entity: T): Promise<void> {
    // Override in subclasses
  }

  /**
   * Hook called after entity deletion
   */
  protected async afterDelete(id: string): Promise<void> {
    // Override in subclasses
  }

  /**
   * Normalize search options with defaults
   */
  protected normalizeSearchOptions(options?: SearchOptions): SearchOptions {
    return {
      page: 1,
      limit: 20,
      sortBy: "createdAt",
      sortOrder: "desc",
      ...options,
    };
  }
}

/**
 * Custom error classes
 */
export class ValidationError extends Error {
  constructor(
    message: string,
    public errors: any[]
  ) {
    super(message);
    this.name = "ValidationError";
  }
}

export class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "NotFoundError";
  }
}

export class ConflictError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ConflictError";
  }
}

export class UnauthorizedError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "UnauthorizedError";
  }
}

/**
 * Service registry for managing all services
 */
export class ServiceRegistry {
  private static services = new Map<string, BaseService<any>>();

  /**
   * Register a service
   */
  public static register<T extends BaseDTO>(
    key: string,
    service: BaseService<T>
  ): void {
    this.services.set(key, service);
  }

  /**
   * Get a registered service
   */
  public static get<T extends BaseDTO>(
    key: string
  ): BaseService<T> | undefined {
    return this.services.get(key);
  }

  /**
   * Check if a service is registered
   */
  public static has(key: string): boolean {
    return this.services.has(key);
  }

  /**
   * Get all registered service keys
   */
  public static getKeys(): string[] {
    return Array.from(this.services.keys());
  }

  /**
   * Clear all registered services
   */
  public static clear(): void {
    this.services.clear();
  }
}
