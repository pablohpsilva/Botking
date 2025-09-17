import { UserOwnedDTO, MetadataDTO } from "./base-dto";

/**
 * Enums for artifact properties (mirroring the artifact package)
 */
export enum RarityDTO {
  COMMON = "common",
  UNCOMMON = "uncommon",
  RARE = "rare",
  EPIC = "epic",
  LEGENDARY = "legendary",
  ULTRA_RARE = "ultra_rare",
  PROTOTYPE = "prototype",
}

export enum SkeletonTypeDTO {
  LIGHT = "light",
  BALANCED = "balanced",
  HEAVY = "heavy",
  FLYING = "flying",
  MODULAR = "modular",
}

export enum MobilityTypeDTO {
  WHEELED = "wheeled",
  BIPEDAL = "bipedal",
  WINGED = "winged",
  TRACKED = "tracked",
  HYBRID = "hybrid",
}

export enum PartCategoryDTO {
  ARM = "arm",
  LEG = "leg",
  TORSO = "torso",
  HEAD = "head",
  ACCESSORY = "accessory",
}

export enum ExpansionChipEffectDTO {
  ATTACK_BUFF = "attack_buff",
  DEFENSE_BUFF = "defense_buff",
  SPEED_BUFF = "speed_buff",
  AI_UPGRADE = "ai_upgrade",
  ENERGY_EFFICIENCY = "energy_efficiency",
  SPECIAL_ABILITY = "special_ability",
  STAT_BOOST = "stat_boost",
  RESISTANCE = "resistance",
}

export enum BotLocationDTO {
  STORAGE = "storage",
  TRAINING = "training",
  MISSION = "mission",
  MAINTENANCE = "maintenance",
  COMBAT = "combat",
}

export enum BotTypeDTO {
  WORKER = "worker",
  PLAYABLE = "playable",
  KING = "king",
  ROGUE = "rogue",
  GOVBOT = "govbot",
}

export enum CombatRoleDTO {
  ASSAULT = "assault",
  TANK = "tank",
  SNIPER = "sniper",
  SCOUT = "scout",
}

export enum UtilitySpecializationDTO {
  CONSTRUCTION = "construction",
  MINING = "mining",
  REPAIR = "repair",
  TRANSPORT = "transport",
}

export enum GovernmentTypeDTO {
  SECURITY = "security",
  ADMIN = "admin",
  MAINTENANCE = "maintenance",
}

export enum ItemCategoryDTO {
  SPEED_UP = "SPEED_UP",
  RESOURCE = "RESOURCE",
  TRADEABLE = "TRADEABLE",
  GEMS = "GEMS",
}

export enum ResourceTypeDTO {
  ENERGY = "ENERGY",
  SCRAP_PARTS = "SCRAP_PARTS",
  MICROCHIPS = "MICROCHIPS",
  STAMINA = "STAMINA",
  PARTS_ENHANCER = "PARTS_ENHANCER",
  BOT_ENHANCER = "BOT_ENHANCER",
  SKELETON_ENHANCER = "SKELETON_ENHANCER",
  EXPANSION_CHIP_ENHANCER = "EXPANSION_CHIP_ENHANCER",
}

export enum EnhancementDurationDTO {
  TEMPORARY = "TEMPORARY",
  PERMANENT = "PERMANENT",
}

export enum SpeedUpTargetDTO {
  BOT_CONSTRUCTION = "BOT_CONSTRUCTION",
  PART_MANUFACTURING = "PART_MANUFACTURING",
  TRAINING = "TRAINING",
  MISSION = "MISSION",
  RESEARCH = "RESEARCH",
  REPAIR = "REPAIR",
}

export enum GemTypeDTO {
  COMMON = "COMMON",
  RARE = "RARE",
  EPIC = "EPIC",
  LEGENDARY = "LEGENDARY",
}

/**
 * Combat stats DTO
 */
export interface CombatStatsDTO {
  attack: number;
  defense: number;
  speed: number;
  perception: number;
  energyConsumption: number;
}

/**
 * Ability DTO
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
 * Soul Chip DTO
 */
export interface SoulChipDTO extends UserOwnedDTO, MetadataDTO {
  name: string;
  personality: string;
  rarity: RarityDTO;
  baseStats: {
    intelligence: number;
    resilience: number;
    adaptability: number;
  };
  specialTrait: string;
  experiences: string[];
  learningRate: number;
  metadata?: Record<string, any>;
}

/**
 * Skeleton DTO
 */
export interface SkeletonDTO extends UserOwnedDTO, MetadataDTO {
  name: string;
  type: SkeletonTypeDTO;
  rarity: RarityDTO;
  slots: number;
  baseDurability: number;
  mobilityType: MobilityTypeDTO;
  specialAbilities: string[];
  upgradeLevel: number;
  currentDurability: number;
  maxDurability: number;
  metadata?: Record<string, any>;
}

/**
 * Part DTO
 */
export interface PartDTO extends UserOwnedDTO, MetadataDTO {
  name: string;
  category: PartCategoryDTO;
  rarity: RarityDTO;
  stats: CombatStatsDTO;
  abilities: AbilityDTO[];
  upgradeLevel: number;
  currentDurability: number;
  maxDurability: number;
  metadata?: Record<string, any>;
}

/**
 * Expansion Chip DTO
 */
export interface ExpansionChipDTO extends UserOwnedDTO, MetadataDTO {
  name: string;
  effect: ExpansionChipEffectDTO;
  rarity: RarityDTO;
  upgradeLevel: number;
  effectMagnitude: number;
  energyCost: number;
  metadata?: Record<string, any>;
}

/**
 * Base Bot State DTO
 */
export interface BaseBotStateDTO extends UserOwnedDTO, MetadataDTO {
  name: string;
  stateType: "worker" | "non-worker";

  // Core properties (all bot types)
  energyLevel: number;
  maintenanceLevel: number;
  currentLocation: BotLocationDTO;
  experience: number;
  statusEffects: string[];
  customizations: Record<string, any>;

  // Legacy fields (for backward compatibility)
  energy: number; // Maps to energyLevel
  maxEnergy: number;
  health: number; // Maps to maintenanceLevel
  maxHealth: number;
  location: BotLocationDTO; // Maps to currentLocation
  level: number;
  missionStats: {
    missionsCompleted: number;
    successRate: number;
    totalCombatTime: number;
    damageDealt: number;
    damageTaken: number;
  };
  lastActiveAt: Date;
  metadata?: Record<string, any>;
}

/**
 * Worker Bot State DTO
 */
export interface WorkerBotStateDTO extends BaseBotStateDTO {
  stateType: "worker";
  // Worker bots don't have additional properties beyond base
}

/**
 * Non-Worker Bot State DTO
 */
export interface NonWorkerBotStateDTO extends BaseBotStateDTO {
  stateType: "non-worker";

  // Non-worker specific properties
  bondLevel: number;
  lastActivity: Date;
  battlesWon: number;
  battlesLost: number;
  totalBattles: number;
}

// Type alias for easier factory usage

/**
 * Union type for all bot state DTOs
 */
export type BotStateDTO = WorkerBotStateDTO | NonWorkerBotStateDTO;

/**
 * Complete Bot DTO (composition of all parts)
 */
export interface BotDTO extends MetadataDTO {
  id: string;
  name: string;
  botType: BotTypeDTO;
  userId: string | null; // User ID - can be null for autonomous bots
  combatRole: CombatRoleDTO | null; // Combat specialization (null for non-combat bots)
  utilitySpec: UtilitySpecializationDTO | null; // Utility specialization (null for non-utility bots)
  governmentType: GovernmentTypeDTO | null; // Government type (null for non-government bots)
  soulChipId: string | null; // Optional - Worker bots don't have soul chips
  skeletonId: string;
  partIds: string[];
  expansionChipIds: string[];
  stateId: string;
  assemblyVersion: number;
  assemblyDate: Date;
  lastModified: Date;
  createdAt: Date;
  updatedAt: Date;

  // Populated relations
  soulChip?: SoulChipDTO;
  skeleton?: SkeletonDTO;
  parts?: PartDTO[];
  expansionChips?: ExpansionChipDTO[];
  state?: BotStateDTO;

  // Computed fields
  totalStats?: CombatStatsDTO;
  overallRating?: number;
  buildType?: string;

  metadata?: Record<string, any>;
}

/**
 * Bot Template DTO (for sharing bot configurations)
 */
export interface BotTemplateDTO extends UserOwnedDTO, MetadataDTO {
  name: string;
  description: string;
  buildType: string;
  templateData: {
    soulChipTemplate: Partial<SoulChipDTO>;
    skeletonTemplate: Partial<SkeletonDTO>;
    partTemplates: Partial<PartDTO>[];
    expansionChipTemplates: Partial<ExpansionChipDTO>[];
  };
  rating: number;
  downloads: number;
  isPublic: boolean;
  metadata?: Record<string, any>;
}

/**
 * Collection DTO (for organizing artifacts)
 */
export interface CollectionDTO extends UserOwnedDTO, MetadataDTO {
  name: string;
  description: string;
  type: "bots" | "parts" | "chips" | "skeletons" | "mixed";
  itemIds: string[];
  isPublic: boolean;
  shareCode?: string;
  metadata?: Record<string, any>;
}

/**
 * UserInventory DTO interfaces
 */
export interface UserInventoryDTO {
  id: string;
  userId: string;
  itemId: string;
  quantity: number;
  acquiredAt: Date;
  expiresAt?: Date | null;
  metadata?: Record<string, any> | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserInventoryDTO {
  userId: string;
  itemId: string;
  quantity?: number;
  expiresAt?: Date;
  metadata?: Record<string, any>;
}

export interface UpdateUserInventoryDTO {
  quantity?: number;
  expiresAt?: Date | null;
  metadata?: Record<string, any> | null;
}

export interface UserInventoryWithItemDTO extends UserInventoryDTO {
  item: ItemDTO;
}

export interface UserInventoryWithUserDTO extends UserInventoryDTO {
  user: {
    id: string;
    name?: string;
    email: string;
  };
}

/**
 * Item DTO interfaces
 */
export interface ItemDTO {
  id: string;
  userId?: string | null;
  name: string;
  category: ItemCategoryDTO;
  rarity: RarityDTO;
  description: string;
  consumable: boolean;
  tradeable: boolean;
  stackable: boolean;
  maxStackSize: number;
  value: number;
  cooldownTime: number;
  requirements: string[];
  source?: string | null;
  tags: string[];
  effects?: any[] | null; // JSON array of item effects
  isProtected?: boolean; // Whether the item is protected from deletion/trading

  // Item-specific fields based on category
  speedUpTarget?: SpeedUpTargetDTO | null;
  speedMultiplier?: number | null;
  timeReduction?: number | null;
  resourceType?: ResourceTypeDTO | null;
  resourceAmount?: number | null;
  enhancementType?: ResourceTypeDTO | null;
  enhancementDuration?: EnhancementDurationDTO | null;
  statModifiers?: Record<string, any> | null;
  gemType?: GemTypeDTO | null;
  gemValue?: number | null;
  tradeHistory?: any[] | null;

  // Metadata
  version: number;
  metadata?: Record<string, any> | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateItemDTO {
  userId?: string;
  name: string;
  category: ItemCategoryDTO;
  rarity?: RarityDTO;
  description: string;
  consumable?: boolean;
  tradeable?: boolean;
  stackable?: boolean;
  maxStackSize?: number;
  value?: number;
  cooldownTime?: number;
  requirements?: string[];
  source?: string;
  tags?: string[];
  effects?: any[];
  isProtected?: boolean; // Whether the item is protected from deletion/trading

  // Category-specific fields
  speedUpTarget?: SpeedUpTargetDTO;
  speedMultiplier?: number;
  timeReduction?: number;
  resourceType?: ResourceTypeDTO;
  resourceAmount?: number;
  enhancementType?: ResourceTypeDTO;
  enhancementDuration?: EnhancementDurationDTO;
  statModifiers?: Record<string, any>;
  gemType?: GemTypeDTO;
  gemValue?: number;

  metadata?: Record<string, any>;
}

export interface UpdateItemDTO {
  name?: string;
  description?: string;
  consumable?: boolean;
  tradeable?: boolean;
  stackable?: boolean;
  maxStackSize?: number;
  value?: number;
  cooldownTime?: number;
  requirements?: string[];
  source?: string | null;
  tags?: string[];
  effects?: any[] | null;
  isProtected?: boolean | null; // Whether the item is protected from deletion/trading

  // Category-specific fields
  speedUpTarget?: SpeedUpTargetDTO | null;
  speedMultiplier?: number | null;
  timeReduction?: number | null;
  resourceType?: ResourceTypeDTO | null;
  resourceAmount?: number | null;
  enhancementType?: ResourceTypeDTO | null;
  enhancementDuration?: EnhancementDurationDTO | null;
  statModifiers?: Record<string, any> | null;
  gemType?: GemTypeDTO | null;
  gemValue?: number | null;
  tradeHistory?: any[] | null;

  metadata?: Record<string, any> | null;
}

export interface ItemWithUserInventoriesDTO extends ItemDTO {
  userInventories: UserInventoryDTO[];
}

// Trading System DTOs

export enum TradingEventStatusDTO {
  DRAFT = "draft",
  ACTIVE = "active",
  PAUSED = "paused",
  ENDED = "ended",
  CANCELLED = "cancelled",
}

export enum TradeOfferStatusDTO {
  ACTIVE = "active",
  PAUSED = "paused",
  SOLD_OUT = "sold_out",
  EXPIRED = "expired",
}

export enum TradeItemTypeDTO {
  REQUIRED = "required",
  REWARD = "reward",
}

export interface TradingEventDTO {
  id: string;
  name: string;
  description?: string;
  status: TradingEventStatusDTO;
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
  description?: string | null;
  status?: TradingEventStatusDTO;
  startDate?: string | null; // ISO string
  endDate?: string | null; // ISO string
  isRepeatable?: boolean;
  maxTradesPerUser?: number | null;
  priority?: number;
  tags?: string[];
  imageUrl?: string | null;
  createdBy?: string | null;
  isPublic?: boolean;
  metadata?: Record<string, any> | null;
}

export interface UpdateTradingEventDTO {
  name?: string | null;
  description?: string | null;
  status?: TradingEventStatusDTO | null;
  startDate?: string | null; // ISO string
  endDate?: string | null; // ISO string
  isRepeatable?: boolean | null;
  maxTradesPerUser?: number | null;
  priority?: number | null;
  tags?: string[] | null;
  imageUrl?: string | null;
  createdBy?: string | null;
  isPublic?: boolean | null;
  metadata?: Record<string, any> | null;
}

export interface TradeOfferDTO {
  id: string;
  tradingEventId: string;
  name: string;
  description?: string;
  status: TradeOfferStatusDTO;
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
  description?: string | null;
  status?: TradeOfferStatusDTO;
  maxTotalTrades?: number | null;
  currentTrades?: number;
  maxPerUser?: number | null;
  startDate?: string | null; // ISO string
  endDate?: string | null; // ISO string
  displayOrder?: number;
  isHighlighted?: boolean;
  tags?: string[];
  metadata?: Record<string, any> | null;
}

export interface UpdateTradeOfferDTO {
  tradingEventId?: string | null;
  name?: string | null;
  description?: string | null;
  status?: TradeOfferStatusDTO | null;
  maxTotalTrades?: number | null;
  currentTrades?: number | null;
  maxPerUser?: number | null;
  startDate?: string | null; // ISO string
  endDate?: string | null; // ISO string
  displayOrder?: number | null;
  isHighlighted?: boolean | null;
  tags?: string[] | null;
  metadata?: Record<string, any> | null;
}

export interface TradeOfferItemDTO {
  id: string;
  tradeOfferId: string;
  itemId: string;
  itemType: TradeItemTypeDTO;
  quantity: number;
  minLevel?: number | null;
  version: number;
  source?: string;
  metadata?: Record<string, any>;
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
}

export interface CreateTradeOfferItemDTO {
  tradeOfferId: string;
  itemId: string;
  itemType: TradeItemTypeDTO;
  quantity: number;
  minLevel?: number | null;
  metadata?: Record<string, any> | null;
}

export interface UpdateTradeOfferItemDTO {
  tradeOfferId?: string | null;
  itemId?: string | null;
  itemType?: TradeItemTypeDTO | null;
  quantity?: number | null;
  minLevel?: number | null;
  metadata?: Record<string, any> | null;
}

export interface UserTradeHistoryDTO {
  id: string;
  userId: string;
  tradingEventId: string;
  tradeOfferId: string;
  executedAt: string; // ISO string
  itemsGiven: any; // JSON snapshot
  itemsReceived: any; // JSON snapshot
  userLevel?: number | null;
  version: number;
  source?: string;
  metadata?: Record<string, any>;
}

export interface CreateUserTradeHistoryDTO {
  userId: string;
  tradingEventId: string;
  tradeOfferId: string;
  executedAt?: string; // ISO string
  itemsGiven: any; // JSON snapshot
  itemsReceived: any; // JSON snapshot
  userLevel?: number | null;
  metadata?: Record<string, any> | null;
}

export interface UpdateUserTradeHistoryDTO {
  userId?: string | null;
  tradingEventId?: string | null;
  tradeOfferId?: string | null;
  executedAt?: string | null; // ISO string
  itemsGiven?: any | null; // JSON snapshot
  itemsReceived?: any | null; // JSON snapshot
  userLevel?: number | null;
  metadata?: Record<string, any> | null;
}

// Trading DTOs with relations
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
}
