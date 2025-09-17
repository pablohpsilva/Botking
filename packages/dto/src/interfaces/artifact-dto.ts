/**
 * Artifact DTO Interfaces
 *
 * This file now imports from artifacts instead of duplicating types.
 * DTOs are database-focused interfaces that reference artifact types.
 */

import { UserOwnedDTO, MetadataDTO } from "./base-dto";

// Import artifact types and enums (eliminating duplication)
import type {
  IBot,
  IItem,
  ITradingEvent,
  ITradeOffer,
} from "@botking/artifact";
import {
  // Artifact enums
  SkeletonType,
  MobilityType,
  PartCategory,
  StatusEffect,
  BotLocation,
  ExpansionChipEffect,

  // Database enums (re-exported through artifacts)
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

import {
  CollectionType,
  TradingEventStatus,
  TradeOfferStatus,
  TradeItemType,
} from "@botking/db";

// Re-export artifact types for DTO consumption (removing DTO suffix)
export {
  // Artifact enums
  SkeletonType,
  MobilityType,
  PartCategory,
  StatusEffect,
  BotLocation,
  ExpansionChipEffect,
  CollectionType,

  // Database enums
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
  TradingEventStatus,
  TradeOfferStatus,
  TradeItemType,
};

// Export artifact interfaces for type safety
export type { IBot, IItem, ITradingEvent, ITradeOffer };

/**
 * Combat stats interface (shared between artifacts and DTOs)
 */
export interface CombatStatsDTO {
  attack: number;
  defense: number;
  speed: number;
  perception: number;
  energyConsumption: number;
}

/**
 * Ability interface (shared between artifacts and DTOs)
 */
export interface AbilityDTO {
  id: string;
  name: string;
  description: string;
  energyCost: number;
  cooldown: number;
  metadata?: Record<string, any>;
}

/**
 * Database-specific DTO interfaces
 * These represent the actual database structure, referencing artifacts for business logic
 */

/**
 * Soul Chip DTO - Database representation
 */
export interface SoulChipDTO extends UserOwnedDTO, MetadataDTO {
  id: string;
  name: string;
  userId: string;
  personality: string;
  rarity: Rarity;
  baseStats: {
    intelligence: number;
    resilience: number;
    adaptability: number;
  };
  specialTrait: string;
  learningRate: number;
  createdAt: Date;
  updatedAt: Date;
  version: number;
  source?: string;
  metadata?: Record<string, any>;
}

/**
 * Skeleton DTO - Database representation
 */
export interface SkeletonDTO extends UserOwnedDTO, MetadataDTO {
  id: string;
  name: string;
  userId: string;
  type: SkeletonType;
  rarity: Rarity;
  slots: number;
  baseDurability: number;
  mobilityType: MobilityType;
  createdAt: Date;
  updatedAt: Date;
  version: number;
  source?: string;
  metadata?: Record<string, any>;
}

/**
 * Part DTO - Database representation
 */
export interface PartDTO extends UserOwnedDTO, MetadataDTO {
  id: string;
  name: string;
  userId: string;
  category: PartCategory;
  rarity: Rarity;
  stats: CombatStatsDTO;
  createdAt: Date;
  updatedAt: Date;
  version: number;
  source?: string;
  metadata?: Record<string, any>;
}

/**
 * Expansion Chip DTO - Database representation
 */
export interface ExpansionChipDTO extends UserOwnedDTO, MetadataDTO {
  id: string;
  name: string;
  userId: string;
  effect: ExpansionChipEffect;
  rarity: Rarity;
  createdAt: Date;
  updatedAt: Date;
  version: number;
  source?: string;
  metadata?: Record<string, any>;
}

/**
 * Bot State DTOs - Database representation
 */
export interface WorkerBotStateDTO extends MetadataDTO {
  id: string;
  stateType: "worker";
  energy: number;
  maxEnergy: number;
  location: BotLocation;
  lastActiveAt: Date;

  // Worker-specific fields
  productivity: number;
  efficiency: number;
  taskQueue: string[];

  createdAt: Date;
  updatedAt: Date;
  version: number;
  source?: string;
  metadata?: Record<string, any>;
}

export interface NonWorkerBotStateDTO extends MetadataDTO {
  id: string;
  stateType: "non-worker";
  energy: number;
  maxEnergy: number;
  location: BotLocation;
  lastActiveAt: Date;

  // Non-worker specific fields
  experience: number;
  level: number;
  combatStats: {
    wins: number;
    losses: number;
    draws: number;
  };

  createdAt: Date;
  updatedAt: Date;
  version: number;
  source?: string;
  metadata?: Record<string, any>;
}

export type BotStateDTO = WorkerBotStateDTO | NonWorkerBotStateDTO;

/**
 * Bot DTO - Database representation with artifact references
 */
export interface BotDTO extends MetadataDTO {
  id: string;
  name: string;
  userId: string;
  botType: BotType;

  // Component references (IDs)
  soulChipId: string | null; // Optional - Worker bots don't have soul chips
  skeletonId: string;
  partIds: string[];
  expansionChipIds: string[];
  stateId: string;

  // Specializations
  combatRole: CombatRole | null;
  utilitySpec: UtilitySpecialization | null;
  governmentType: GovernmentType | null;

  createdAt: Date;
  updatedAt: Date;
  version: number;
  source?: string;
  metadata?: Record<string, any>;
}

/**
 * Bot Template DTO - Database representation
 */
export interface BotTemplateDTO extends UserOwnedDTO, MetadataDTO {
  id: string;
  name: string;
  description: string;
  userId: string;
  botType: BotType;
  templateData: {
    skeletonType: SkeletonType;
    requiredParts: PartCategory[];
    recommendedParts: string[];
    expansionChips: string[];
  };
  isPublic: boolean;
  popularity: number;
  createdAt: Date;
  updatedAt: Date;
  version: number;
  source?: string;
  metadata?: Record<string, any>;
}

/**
 * Collection DTO - Database representation
 */
export interface CollectionDTO extends UserOwnedDTO, MetadataDTO {
  id: string;
  name: string;
  description: string;
  userId: string;
  type: CollectionType;
  itemIds: string[];
  isComplete: boolean;
  completionReward?: string;
  createdAt: Date;
  updatedAt: Date;
  version: number;
  source?: string;
  metadata?: Record<string, any>;
}

/**
 * User Inventory DTOs - Database representation
 */
export interface UserInventoryDTO {
  id: string;
  userId: string;
  itemId: string;
  quantity: number;
  acquiredAt: Date;
  lastUsedAt?: Date;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserInventoryDTO {
  userId: string;
  itemId: string;
  quantity: number;
  acquiredAt?: Date;
  metadata?: Record<string, any>;
}

export interface UpdateUserInventoryDTO {
  quantity?: number;
  lastUsedAt?: Date | null;
  metadata?: Record<string, any> | null;
}

export interface UserInventoryWithItemDTO extends UserInventoryDTO {
  item: ItemDTO;
}

export interface UserInventoryWithUserDTO extends UserInventoryDTO {
  user: {
    id: string;
    username: string;
    email: string;
  };
}

/**
 * Item DTOs - Database representation
 */
export interface ItemDTO {
  id: string;
  name: string;
  description: string;
  category: ItemCategory;
  rarity: Rarity;
  value: number;
  isProtected: boolean; // Whether the item is protected from deletion/trading
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateItemDTO {
  name: string;
  description: string;
  category: ItemCategory;
  rarity: Rarity;
  value: number;
  isProtected?: boolean;
}

export interface UpdateItemDTO {
  name?: string | null;
  description?: string | null;
  category?: ItemCategory | null;
  rarity?: Rarity | null;
  value?: number | null;
  isProtected?: boolean | null;
}

export interface ItemWithUserInventoriesDTO extends ItemDTO {
  userInventories: UserInventoryDTO[];
}

/**
 * Trading System DTOs - Database representation
 */
export interface TradingEventDTO {
  id: string;
  name: string;
  description?: string;
  status: TradingEventStatus;
  startDate?: string | null; // ISO string
  endDate?: string | null; // ISO string
  isRepeatable: boolean;
  maxTradesPerUser?: number | null;
  priority: number;
  tags: string[];
  imageUrl?: string | null;
  createdBy?: string | null;
  isPublic: boolean;
  version: number;
  source?: string;
  metadata?: Record<string, any>;
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
}

export interface CreateTradingEventDTO {
  name: string;
  description?: string;
  status?: TradingEventStatus;
  startDate?: Date | null;
  endDate?: Date | null;
  isRepeatable?: boolean;
  maxTradesPerUser?: number | null;
  priority?: number;
  tags?: string[];
  imageUrl?: string | null;
  createdBy?: string | null;
  isPublic?: boolean;
  version?: number;
  source?: string;
  metadata?: Record<string, any>;
}

export interface UpdateTradingEventDTO {
  name?: string | null;
  description?: string | null;
  status?: TradingEventStatus | null;
  startDate?: Date | null;
  endDate?: Date | null;
  isRepeatable?: boolean | null;
  maxTradesPerUser?: number | null;
  priority?: number | null;
  tags?: string[] | null;
  imageUrl?: string | null;
  createdBy?: string | null;
  isPublic?: boolean | null;
  version?: number | null;
  source?: string | null;
  metadata?: Record<string, any> | null;
}

export interface TradeOfferDTO {
  id: string;
  tradingEventId: string;
  name: string;
  description?: string;
  status: TradeOfferStatus;
  maxTotalTrades?: number | null;
  currentTrades: number;
  maxPerUser?: number | null;
  startDate?: string | null; // ISO string
  endDate?: string | null; // ISO string
  displayOrder: number;
  isHighlighted: boolean;
  tags: string[];
  version: number;
  source?: string;
  metadata?: Record<string, any>;
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
}

export interface CreateTradeOfferDTO {
  tradingEventId: string;
  name: string;
  description?: string;
  status?: TradeOfferStatus;
  maxTotalTrades?: number | null;
  currentTrades?: number;
  maxPerUser?: number | null;
  startDate?: Date | null;
  endDate?: Date | null;
  displayOrder?: number;
  isHighlighted?: boolean;
  tags?: string[];
  version?: number;
  source?: string;
  metadata?: Record<string, any>;
}

export interface UpdateTradeOfferDTO {
  tradingEventId?: string | null;
  name?: string | null;
  description?: string | null;
  status?: TradeOfferStatus | null;
  maxTotalTrades?: number | null;
  currentTrades?: number | null;
  maxPerUser?: number | null;
  startDate?: Date | null;
  endDate?: Date | null;
  displayOrder?: number | null;
  isHighlighted?: boolean | null;
  tags?: string[] | null;
  version?: number | null;
  source?: string | null;
  metadata?: Record<string, any> | null;
}

export interface TradeOfferItemDTO {
  id: string;
  tradeOfferId: string;
  itemId: string;
  itemType: TradeItemType;
  quantity: number;
  minLevel?: number | null;
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
}

export interface CreateTradeOfferItemDTO {
  tradeOfferId: string;
  itemId: string;
  itemType: TradeItemType;
  quantity: number;
  minLevel?: number | null;
}

export interface UpdateTradeOfferItemDTO {
  tradeOfferId?: string | null;
  itemId?: string | null;
  itemType?: TradeItemType | null;
  quantity?: number | null;
  minLevel?: number | null;
}

export interface UserTradeHistoryDTO {
  id: string;
  userId: string;
  tradingEventId: string;
  tradeOfferId: string;
  executedAt: any; // JSON
  itemsGiven: any; // JSON
  itemsReceived: any; // JSON
  userLevel?: number | null;
  metadata?: any; // JSON
}

export interface CreateUserTradeHistoryDTO {
  userId: string;
  tradingEventId: string;
  tradeOfferId: string;
  executedAt: any; // JSON
  itemsGiven: any; // JSON
  itemsReceived: any; // JSON
  userLevel?: number | null;
  metadata?: any; // JSON
}

export interface UpdateUserTradeHistoryDTO {
  userId?: string | null;
  tradingEventId?: string | null;
  tradeOfferId?: string | null;
  executedAt?: any | null; // JSON
  itemsGiven?: any | null; // JSON
  itemsReceived?: any | null; // JSON
  userLevel?: number | null;
  metadata?: any | null; // JSON
}

// Extended DTOs with relations
export interface TradingEventWithOffersDTO extends TradingEventDTO {
  tradeOffers: TradeOfferDTO[];
}

export interface TradeOfferWithItemsDTO extends TradeOfferDTO {
  tradeItems: TradeOfferItemDTO[];
}

export interface TradeOfferItemWithItemDTO extends TradeOfferItemDTO {
  item: ItemDTO;
}

export interface UserTradeHistoryWithDetailsDTO extends UserTradeHistoryDTO {
  tradingEvent: TradingEventDTO;
  tradeOffer: TradeOfferDTO;
  user: {
    id: string;
    username: string;
    email: string;
  };
}

// ==========================================
// BACKWARDS COMPATIBILITY EXPORTS
// For existing factory code that expects DTO suffix
// ==========================================

export {
  Rarity as RarityDTO,
  SkeletonType as SkeletonTypeDTO,
  MobilityType as MobilityTypeDTO,
  PartCategory as PartCategoryDTO,
  ExpansionChipEffect as ExpansionChipEffectDTO,
  BotLocation as BotLocationDTO,
  ItemCategory as ItemCategoryDTO,
  ResourceType as ResourceTypeDTO,
  EnhancementDuration as EnhancementDurationDTO,
  SpeedUpTarget as SpeedUpTargetDTO,
  GemType as GemTypeDTO,
  TradingEventStatus as TradingEventStatusDTO,
  TradeOfferStatus as TradeOfferStatusDTO,
  TradeItemType as TradeItemTypeDTO,
};
