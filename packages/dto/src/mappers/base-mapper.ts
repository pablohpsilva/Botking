/**
 * Base mapper interface for converting between entities and DTOs
 */
export interface IMapper<TEntity, TDTO> {
  toDTO(entity: TEntity, options?: MapperOptions): TDTO;
  fromDTO(dto: TDTO, options?: MapperOptions): TEntity;
  toDTOs(entities: TEntity[], options?: MapperOptions): TDTO[];
  fromDTOs(dtos: TDTO[], options?: MapperOptions): TEntity[];
}

/**
 * Mapper options for controlling conversion behavior
 */
export interface MapperOptions {
  includeRelations?: boolean;
  includeMetadata?: boolean;
  validateInput?: boolean;
  userId?: string;
  [key: string]: any;
}

/**
 * Abstract base mapper class with common functionality
 */
export abstract class BaseMapper<TEntity, TDTO>
  implements IMapper<TEntity, TDTO>
{
  /**
   * Convert entity to DTO
   */
  public abstract toDTO(entity: TEntity, options?: MapperOptions): TDTO;

  /**
   * Convert DTO to entity
   */
  public abstract fromDTO(dto: TDTO, options?: MapperOptions): TEntity;

  /**
   * Convert multiple entities to DTOs
   */
  public toDTOs(entities: TEntity[], options?: MapperOptions): TDTO[] {
    return entities.map((entity) => this.toDTO(entity, options));
  }

  /**
   * Convert multiple DTOs to entities
   */
  public fromDTOs(dtos: TDTO[], options?: MapperOptions): TEntity[] {
    return dtos.map((dto) => this.fromDTO(dto, options));
  }

  /**
   * Get default mapper options
   */
  protected getDefaultOptions(): MapperOptions {
    return {
      includeRelations: false,
      includeMetadata: true,
      validateInput: true,
    };
  }

  /**
   * Merge options with defaults
   */
  protected mergeOptions(options?: MapperOptions): MapperOptions {
    return { ...this.getDefaultOptions(), ...options };
  }

  /**
   * Validate entity before conversion
   */
  protected validateEntity(entity: TEntity): void {
    if (!entity) {
      throw new Error("Entity cannot be null or undefined");
    }
  }

  /**
   * Validate DTO before conversion
   */
  protected validateDTO(dto: TDTO): void {
    if (!dto) {
      throw new Error("DTO cannot be null or undefined");
    }
  }

  /**
   * Generate current timestamp
   */
  protected getCurrentTimestamp(): Date {
    return new Date();
  }

  /**
   * Generate unique ID
   */
  protected generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Deep clone an object
   */
  protected deepClone<T>(obj: T): T {
    return JSON.parse(JSON.stringify(obj));
  }

  /**
   * Extract metadata from entity
   */
  protected extractMetadata(entity: any): Record<string, any> {
    const metadata: Record<string, any> = {};

    // Extract common metadata fields
    if (entity.version !== undefined) metadata.version = entity.version;
    if (entity.source !== undefined) metadata.source = entity.source;
    if (entity.tags !== undefined) metadata.tags = entity.tags;
    if (entity.description !== undefined)
      metadata.description = entity.description;

    return metadata;
  }

  /**
   * Apply metadata to entity
   */
  protected applyMetadata(entity: any, metadata?: Record<string, any>): void {
    if (!metadata) return;

    Object.keys(metadata).forEach((key) => {
      if (metadata[key] !== undefined) {
        entity[key] = metadata[key];
      }
    });
  }
}

/**
 * Mapper registry for managing all mappers
 */
export class MapperRegistry {
  private static mappers = new Map<string, BaseMapper<any, any>>();

  /**
   * Register a mapper
   */
  public static register<TEntity, TDTO>(
    key: string,
    mapper: BaseMapper<TEntity, TDTO>
  ): void {
    this.mappers.set(key, mapper);
  }

  /**
   * Get a registered mapper
   */
  public static get<TEntity, TDTO>(
    key: string
  ): BaseMapper<TEntity, TDTO> | undefined {
    return this.mappers.get(key);
  }

  /**
   * Check if a mapper is registered
   */
  public static has(key: string): boolean {
    return this.mappers.has(key);
  }

  /**
   * Get all registered mapper keys
   */
  public static getKeys(): string[] {
    return Array.from(this.mappers.keys());
  }

  /**
   * Clear all registered mappers
   */
  public static clear(): void {
    this.mappers.clear();
  }
}
