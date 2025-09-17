/**
 * Artifact-DTO Bridge
 *
 * This module provides the bridge between artifact domain objects and DTOs
 * for database persistence. It replaces duplicate interfaces with artifact consumption.
 */

// Re-export artifact types for DTO usage
export type {
  // Core Interfaces
  IBot,
  IItem,
  ITradingEvent,
  ITradeOffer,
} from "@botking/artifact";

// Re-export artifact enums (eliminating DTO duplicates)
export {
  // From artifact package
  SkeletonType,
  MobilityType,
  PartCategory,
  StatusEffect,
  BotLocation,
  ExpansionChipEffect,

  // From database (via artifact re-exports)
  Rarity,
  BotType,
  CombatRole,
  UtilitySpecialization,
  GovernmentType,
  ItemCategory,
  ResourceType,
  EnhancementDuration,
  SpeedUpTarget,
  GemType,
} from "@botking/artifact";

// Re-export database types that DTOs need
export {
  CollectionType,
  TradingEventStatus,
  TradeOfferStatus,
  TradeItemType,
} from "@botking/db";

/**
 * Artifact to DTO conversion utilities
 */
export interface ArtifactToDTO {
  /**
   * Convert an artifact to database-compatible data
   */
  toDBData<T>(artifact: any): T;

  /**
   * Extract create data from artifact
   */
  toCreateData<T>(artifact: any): Omit<T, "id" | "createdAt" | "updatedAt">;

  /**
   * Extract update data from artifact
   */
  toUpdateData<T>(
    artifact: any
  ): Partial<Omit<T, "id" | "createdAt" | "updatedAt">>;
}

/**
 * DTO to Artifact conversion utilities
 */
export interface DTOToArtifact {
  /**
   * Convert database data to artifact
   */
  fromDBData<T>(dbData: any): T;

  /**
   * Create artifact from DTO with dependencies
   */
  createWithDependencies<T>(dto: any, dependencies: Record<string, any>): T;
}

/**
 * Artifact persistence interface for DTOs
 */
export interface ArtifactPersistence {
  /**
   * Save artifact to database
   */
  save<T>(artifact: any): Promise<T>;

  /**
   * Load artifact from database
   */
  load<T>(id: string): Promise<T | null>;

  /**
   * Update artifact in database
   */
  update<T>(id: string, updates: any): Promise<T>;

  /**
   * Delete artifact from database
   */
  delete(id: string): Promise<void>;
}
