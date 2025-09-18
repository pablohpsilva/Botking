import { BotLocation, ActiveStatusEffect } from "../types";

/**
 * Base interface for all bot states
 * Contains the essential properties that all bots need
 */
export interface IBotState {
  // Core state properties
  readonly id: string;
  energyLevel: number;
  maintenanceLevel: number;
  statusEffects: ActiveStatusEffect[];
  currentLocation: BotLocation;
  experience: number;
  customizations: Map<string, any>;

  // State management methods
  updateEnergy(amount: number): void;
  updateMaintenance(amount: number): void;
  addStatusEffect(effect: ActiveStatusEffect): void;
  removeStatusEffect(effectId: string): void;
  updateLocation(location: BotLocation): void;
  addExperience(amount: number): void;
  setCustomization(key: string, value: any): void;
  getCustomization(key: string): any;
  removeCustomization(key: string): void;

  // Utility methods
  isOperational(): boolean;
  needsMaintenance(): boolean;
  getActiveEffectsByType(type: string): ActiveStatusEffect[];
  calculateEffectiveEnergy(): number;
  getStateType(): string;

  // Serialization
  toJSON(): Record<string, any>;
  serialize(): string;
}

/**
 * Interface for Worker bot states
 * Simple state management for utility and work bots
 */
export interface IWorkerBotState extends IBotState {
  // Worker bots only have the base properties
  // No additional properties beyond IBotState
}

/**
 * Interface for Non-Worker bot states
 * Extended state management for playable, combat, and social bots
 */
export interface INonWorkerBotState extends IBotState {
  // Social and combat properties
  bondLevel: number;
  lastActivity: Date;
  battlesWon: number;
  battlesLost: number;
  totalBattles: number;

  // Social and combat methods
  updateBondLevel(amount: number): void;
  updateLastActivity(): void;
  recordBattleResult(won: boolean): void;
  getBattleStats(): {
    won: number;
    lost: number;
    total: number;
    winRate: number;
  };
  calculateSocialStatus(): {
    bondLevel: number;
    activityLevel: string;
    combatRating: string;
  };
}

/**
 * Factory function type for creating appropriate bot states
 */
export type BotStateFactory<T extends IBotState> = (
  config?: Partial<BotStateConfig>
) => T;

/**
 * Configuration interface for bot state creation
 */
export interface BotStateConfig {
  id?: string;
  energyLevel?: number;
  maintenanceLevel?: number;
  statusEffects?: ActiveStatusEffect[];
  currentLocation?: BotLocation;
  experience?: number;
  customizations?: Map<string, any>;

  // Non-worker specific
  bondLevel?: number;
  lastActivity?: Date;
  battlesWon?: number;
  battlesLost?: number;
  totalBattles?: number;
}
