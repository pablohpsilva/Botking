/**
 * Shared types for the Botking artifact system
 *
 * This file imports enums from the database package to ensure single source of truth
 * and only defines interfaces that are specific to the artifact business logic.
 */

// Import enums from database for use in interfaces (with aliases to avoid conflicts)
import {
  EnhancementDuration as DBEnhancementDuration,
  ResourceType as DBResourceType,
  SpeedUpTarget as DBSpeedUpTarget,
  GemType as DBGemType,
} from "@botking/db";

// Re-export all enums from the database package
export {
  // Basic enums
  Rarity,

  // Bot-related enums
  BotType,
  CombatRole,
  UtilitySpecialization,
  GovernmentType,

  // Item-related enums
  ItemCategory,
  ResourceType,
  EnhancementDuration,
  SpeedUpTarget,
  GemType,
} from "@botking/db";

// Skeleton and part enums (these might not be in DB yet, keeping local for now)
export enum SkeletonType {
  LIGHT = "light",
  BALANCED = "balanced",
  HEAVY = "heavy",
  FLYING = "flying",
  MODULAR = "modular",
}

export enum MobilityType {
  WHEELED = "wheeled",
  BIPEDAL = "bipedal",
  WINGED = "winged",
  TRACKED = "tracked",
  HYBRID = "hybrid",
}

export enum PartCategory {
  ARM = "arm",
  LEG = "leg",
  TORSO = "torso",
  HEAD = "head",
  ACCESSORY = "accessory",
}

export enum StatusEffect {
  DAMAGE_BOOST = "damage_boost",
  DEFENSE_BOOST = "defense_boost",
  SPEED_BOOST = "speed_boost",
  ENERGY_DRAIN = "energy_drain",
  ENERGY_BOOST = "energy_boost",
  MAINTENANCE_PENALTY = "maintenance_penalty",
  SHIELD_ACTIVE = "shield_active",
  STEALTH_MODE = "stealth_mode",
  OVERCHARGE = "overcharge",

  // Worker-specific effects
  PRODUCTIVITY_BOOST = "productivity_boost",
  FATIGUE = "fatigue",
  MAINTENANCE_BONUS = "maintenance_bonus",

  // Non-worker specific effects
  MORALE_BOOST = "morale_boost",
  MORALE_PENALTY = "morale_penalty",
  SKILL_IMPROVEMENT = "skill_improvement",
}

export enum BotLocation {
  ARENA = "arena",
  FACTORY = "factory",
  IDLE = "idle",
  REPAIR_BAY = "repair_bay",
  TRAINING = "training",
  STORAGE = "storage",
}

export enum ExpansionChipEffect {
  ATTACK_BUFF = "attack_buff",
  DEFENSE_BUFF = "defense_buff",
  SPEED_BUFF = "speed_buff",
  AI_UPGRADE = "ai_upgrade",
  ENERGY_EFFICIENCY = "energy_efficiency",
  SPECIAL_ABILITY = "special_ability",
  STAT_BOOST = "stat_boost",
  RESISTANCE = "resistance",
}

// Interface definitions (these remain local as they define business logic)

export interface BaseStats {
  intelligence: number;
  resilience: number;
  adaptability: number;
}

export interface CombatStats {
  attack: number;
  defense: number;
  speed: number;
  perception: number;
  energyConsumption: number;
}

export interface ActiveStatusEffect {
  id: string;
  effect: StatusEffect;
  magnitude: number;
  duration: number; // in turns/seconds
  source: string; // what caused this effect
}

export interface PersonalityTraits {
  aggressiveness: number; // 0-100
  curiosity: number; // 0-100
  loyalty: number; // 0-100
  independence: number; // 0-100
  empathy: number; // 0-100
  dialogueStyle: string; // e.g., "formal", "casual", "quirky", "stoic"
}

export interface Ability {
  id: string;
  name: string;
  description: string;
  cooldown: number;
  energyCost: number;
  effect: string; // JSON string describing the effect
}

// Import enums from database for interfaces
import {
  EnhancementDuration,
  ResourceType,
  SpeedUpTarget,
  GemType,
} from "@botking/db";

// Item effect interfaces (specific to artifact business logic)
export interface ItemEffect {
  id: string;
  type: string;
  magnitude: number;
  duration?: number | DBEnhancementDuration;
  target?: string;
  description: string;
}

export interface EnhancementEffect extends ItemEffect {
  enhancementType: DBResourceType;
  duration: DBEnhancementDuration;
  statModifiers: Record<string, number>;
}

export interface SpeedUpEffect extends ItemEffect {
  speedUpTarget: DBSpeedUpTarget;
  speedMultiplier: number;
  timeReduction: number;
}

export interface ResourceEffect extends ItemEffect {
  resourceType: DBResourceType;
  amount: number;
}

export interface GemEffect extends ItemEffect {
  gemType: DBGemType;
  value: number;
}
