/**
 * @botking/dto - Data Transfer Objects and database abstraction layer
 *
 * This package provides:
 * - DTO interfaces for all artifact entities (legacy)
 * - Factory classes for DTO creation and validation (legacy)
 * - Base service types and validation
 * - Example implementations
 *
 * 🚀 NEW: Auto-sync DTOs powered by Prisma + Zod integration!
 * - Always in sync with database schema
 * - Runtime validation with Zod
 * - TypeScript type safety
 * - Business logic validation
 * - Zero manual maintenance
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

// 🚀 NEW: Export auto-sync DTO factory (Prisma + Zod integration)
export * from "./auto-sync-dto-factory";
export * from "./auto-sync-example";

// Re-export database schemas and types for convenience
export {
  // Create schemas (verified available)
  CreateSoulChipSchema,
  CreateSkeletonSchema,
  CreatePartSchema,
  CreateExpansionChipSchema,
  CreateBotStateSchema,
  CreateBotSchema,
  CreateCollectionSchema,
  CreateItemSchema,

  // Update schemas (verified available)
  UpdateSoulChipSchema,
  UpdateSkeletonSchema,
  UpdatePartSchema,
  UpdateExpansionChipSchema,
  UpdateBotStateSchema,
  UpdateBotSchema,
  UpdateCollectionSchema,

  // Business validation schemas (verified available)
  SoulChipStatsSchema,
  PartStatsSchema,
  BotAssemblySchema,
  BotTypeValidationSchema,

  // Enum schemas (verified available)
  RaritySchema,
  SkeletonTypeSchema,
  MobilityTypeSchema,
  PartCategorySchema,
  ExpansionChipEffectSchema,
  BotLocationSchema,
  CollectionTypeSchema,
  BotTypeSchema,
  CombatRoleSchema,
  UtilitySpecializationSchema,
  GovernmentTypeSchema,
  ItemCategorySchema,
  ResourceTypeSchema,
  EnhancementDurationSchema,
  SpeedUpTargetSchema,
  GemTypeSchema,

  // Prisma enums
  type Rarity,
  type SkeletonType,
  type MobilityType,
  type PartCategory,
  type ExpansionChipEffect,
  type BotLocation,
  type CollectionType,
  type BotType,
  type CombatRole,
  type UtilitySpecialization,
  type GovernmentType,
  type ItemCategory,
  type ResourceType,
  type EnhancementDuration,
  type SpeedUpTarget,
  type GemType,
} from "@botking/db";

// Re-export key types for convenience
export type {
  // Core Artifact DTOs (with factories)
  SoulChipDTO,
  SkeletonDTO,
  PartDTO,
  BotDTO,

  // Additional Artifact DTOs (no factories but still used)
  ExpansionChipDTO,
  BotStateDTO,
  BotTemplateDTO,
  CollectionDTO,
  CombatStatsDTO,
  AbilityDTO,

  // New DTOs (with factories)
  UserInventoryDTO,
  CreateUserInventoryDTO,
  UpdateUserInventoryDTO,
  UserInventoryWithItemDTO,
  UserInventoryWithUserDTO,
  ItemDTO,
  CreateItemDTO,
  UpdateItemDTO,
  ItemWithUserInventoriesDTO,

  // Enums (commonly used)
  RarityDTO,
  SkeletonTypeDTO,
  MobilityTypeDTO,
  PartCategoryDTO,
  ExpansionChipEffectDTO,
  BotLocationDTO,
  ItemCategoryDTO,
  ResourceTypeDTO,
  EnhancementDurationDTO,
  SpeedUpTargetDTO,
  GemTypeDTO,
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
  ExpansionChipDTOFactory,
  BotStateDTOFactory,
  BotDTOFactory,
  BotTemplateDTOFactory,
  CollectionDTOFactory,
  UserInventoryDTOFactory,
  ItemDTOFactory,
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
  ExpansionChipDTOFactory,
  BotStateDTOFactory,
  BotDTOFactory,
  BotTemplateDTOFactory,
  CollectionDTOFactory,
  UserInventoryDTOFactory,
  ItemDTOFactory,
  DTOFactoryRegistry,
} from "./factories/dto-factory";
import { DTOExample } from "./simple-example";
import { BotDTO } from "./interfaces/artifact-dto";
import { AutoSyncExample } from "./auto-sync-example";

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
    expansionChip: ExpansionChipDTOFactory;
    botState: BotStateDTOFactory;
    bot: BotDTOFactory;
    botTemplate: BotTemplateDTOFactory;
    collection: CollectionDTOFactory;
    userInventory: UserInventoryDTOFactory;
    item: ItemDTOFactory;
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
      expansionChip: new ExpansionChipDTOFactory(),
      botState: new BotStateDTOFactory(),
      bot: new BotDTOFactory(),
      botTemplate: new BotTemplateDTOFactory(),
      collection: new CollectionDTOFactory(),
      userInventory: new UserInventoryDTOFactory(),
      item: new ItemDTOFactory(),
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

  /**
   * 🚀 NEW: Demonstrate auto-sync DTO capabilities
   * Shows how DTOs stay automatically in sync with database schema
   */
  public demonstrateAutoSyncDTOs(): void {
    AutoSyncExample.runAllExamples();
  }
}
