/**
 * Shared types and enums for the Botking artifact system
 */

// Rarity levels for all artifacts
export enum Rarity {
  COMMON = "common",
  UNCOMMON = "uncommon",
  RARE = "rare",
  EPIC = "epic",
  LEGENDARY = "legendary",
  ULTRA_RARE = "ultra-rare",
  PROTOTYPE = "prototype",
}

// Skeleton types
export enum SkeletonType {
  LIGHT = "light",
  BALANCED = "balanced",
  HEAVY = "heavy",
  FLYING = "flying",
  MODULAR = "modular",
}

// Mobility types for skeletons
export enum MobilityType {
  WHEELED = "wheeled",
  BIPEDAL = "bipedal",
  WINGED = "winged",
  TRACKED = "tracked",
  HYBRID = "hybrid",
}

// Part categories
export enum PartCategory {
  ARM = "arm",
  LEG = "leg",
  TORSO = "torso",
  HEAD = "head",
  ACCESSORY = "accessory",
}

// Status effects
export enum StatusEffect {
  DAMAGE_BOOST = "damage_boost",
  DEFENSE_BOOST = "defense_boost",
  SPEED_BOOST = "speed_boost",
  ENERGY_DRAIN = "energy_drain",
  MAINTENANCE_PENALTY = "maintenance_penalty",
  SHIELD_ACTIVE = "shield_active",
  STEALTH_MODE = "stealth_mode",
  OVERCHARGE = "overcharge",
}

// Bot locations
export enum BotLocation {
  ARENA = "arena",
  FACTORY = "factory",
  IDLE = "idle",
  REPAIR_BAY = "repair_bay",
  TRAINING = "training",
  STORAGE = "storage",
}

// Base stats interface
export interface BaseStats {
  intelligence: number;
  resilience: number;
  adaptability: number;
}

// Combat stats interface
export interface CombatStats {
  attack: number;
  defense: number;
  speed: number;
  perception: number;
  energyConsumption: number;
}

// Status effect with duration
export interface ActiveStatusEffect {
  effect: StatusEffect;
  magnitude: number;
  duration: number; // in turns/seconds
  source: string; // what caused this effect
}

// Personality traits
export interface PersonalityTraits {
  aggressiveness: number; // 0-100
  curiosity: number; // 0-100
  loyalty: number; // 0-100
  independence: number; // 0-100
  empathy: number; // 0-100
  dialogueStyle: string; // e.g., "formal", "casual", "quirky", "stoic"
}

// Special abilities
export interface Ability {
  id: string;
  name: string;
  description: string;
  cooldown: number;
  energyCost: number;
  effect: string; // JSON string describing the effect
}

// Expansion chip effects
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
