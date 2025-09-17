/**
 * @botking/dto - Data Transfer Objects and database abstraction layer
 *
 * This package provides:
 * - DTO interfaces for all artifact entities
 * - Factory classes for DTO creation and validation
 * - Base service types and validation
 * - Example implementations
 */

// Export DTO interfaces
export * from "./interfaces/base-dto";
export * from "./interfaces/artifact-dto";

// Export factories
export * from "./factories/dto-factory";

// Export services
export * from "./services";

// Export example
export * from "./simple-example";

// Re-export key types for convenience
export type {
  // Artifact DTOs
  SoulChipDTO,
  SkeletonDTO,
  PartDTO,
  ExpansionChipDTO,
  BotStateDTO,
  BotDTO,
  BotTemplateDTO,
  CollectionDTO,
  CombatStatsDTO,
  AbilityDTO,

  // Enums
  RarityDTO,
  SkeletonTypeDTO,
  MobilityTypeDTO,
  PartCategoryDTO,
  ExpansionChipEffectDTO,
  BotLocationDTO,
} from "./interfaces/artifact-dto";

export type {
  // Base types
  BaseDTO,
  SoftDeletableDTO,
  UserOwnedDTO,
  MetadataDTO,
  ValidationResult,
  ValidationError,
  PaginationOptions,
  PaginatedResponse,
  FilterOptions,
  SearchOptions,
} from "./interfaces/base-dto";

// Export main classes
export {
  // Services
  DTOValidationError,
  NotFoundError,
  ConflictError,
  UnauthorizedError,
} from "./services";

export {
  // Factories
  BaseDTOFactory,
  SoulChipDTOFactory,
  SkeletonDTOFactory,
  PartDTOFactory,
  BotDTOFactory,
  DTOFactoryRegistry,
} from "./factories/dto-factory";

export {
  // Example
  DTOExample,
} from "./simple-example";

// Import types for the class
import {
  SoulChipDTOFactory,
  SkeletonDTOFactory,
  PartDTOFactory,
  BotDTOFactory,
  DTOFactoryRegistry,
} from "./factories/dto-factory";
import { DTOExample } from "./simple-example";
import { BotDTO } from "./interfaces/artifact-dto";

/**
 * DTO Package configuration
 */
export interface DTOPackageConfig {
  enableValidation?: boolean;
  enableCaching?: boolean;
  cacheConfig?: {
    ttl: number;
    maxSize: number;
  };
}

/**
 * Main DTO package class for basic functionality
 */
export class DTOPackage {
  private config: DTOPackageConfig;
  private isInitialized = false;

  public factories: {
    soulChip: SoulChipDTOFactory;
    skeleton: SkeletonDTOFactory;
    part: PartDTOFactory;
    bot: BotDTOFactory;
  };

  constructor(config: DTOPackageConfig = {}) {
    this.config = {
      enableValidation: true,
      enableCaching: false,
      ...config,
    };

    this.factories = {
      soulChip: new SoulChipDTOFactory(),
      skeleton: new SkeletonDTOFactory(),
      part: new PartDTOFactory(),
      bot: new BotDTOFactory(),
    };
  }

  /**
   * Initialize the package
   */
  public initialize() {
    if (this.isInitialized) {
      throw new Error("DTO Package is already initialized");
    }

    // Initialize factory registry
    DTOFactoryRegistry.initialize();

    this.isInitialized = true;

    return this;
  }

  /**
   * Check if package is initialized
   */
  public get initialized(): boolean {
    return this.isInitialized;
  }

  /**
   * Get package configuration
   */
  public getConfig(): DTOPackageConfig {
    return { ...this.config };
  }

  /**
   * Create example bot
   */
  public createExampleBot(): BotDTO {
    return DTOExample.createExampleBot();
  }

  /**
   * Demonstrate validation
   */
  public demonstrateValidation(): { valid: any; invalid: any } {
    return DTOExample.demonstrateValidation();
  }
}
