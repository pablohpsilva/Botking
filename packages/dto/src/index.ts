/**
 * @botking/dto - Lean Data Transfer Objects and database abstraction layer
 *
 * LEAN ARCHITECTURE: Artifact-First Approach
 * - Artifacts are primary objects (from @botking/artifact)
 * - DTOs only for database persistence
 * - Auto-sync DTOs powered by Prisma + Zod integration
 * - Clean, modern, artifact-first approach
 */

// Export DTO interfaces (avoiding conflicts)
export type { ValidationResult, ValidationError } from "./interfaces/base-dto";
export * from "./interfaces/artifact-dto";
export * from "./interfaces/slot-assignment-dto";

// Export core factories (lean approach)
export * from "./factories";

// Export artifact bridge (artifact integration)
export * from "./artifact-bridge";

// Export auto-sync DTO factory (Prisma + Zod integration)
export * from "./auto-sync-dto-factory";

// Export example
export * from "./simple-example";

// Re-export essential database schemas for convenience
export {
  // Bot-related schemas
  CreateBotSchema,
  UpdateBotSchema,
} from "@botking/db";

// Re-export database enums for convenience
export {
  BotType,
  CombatRole,
  UtilitySpecialization,
  GovernmentType,
  ItemCategory,
  ResourceType,
  GemType,
  CollectionType,
  TradingEventStatus,
  TradeOfferStatus,
  TradeItemType,
  Rarity,
} from "@botking/db";

// Re-export backwards-compatible enums with DTO suffix
export {
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
  TradingEventStatusDTO,
  TradeOfferStatusDTO,
  TradeItemTypeDTO,
} from "./interfaces/artifact-dto";
