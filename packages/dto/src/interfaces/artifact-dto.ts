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
  soulChipId: string;
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
