import { BotType } from "../types";
import {
  IBotState,
  IWorkerBotState,
  INonWorkerBotState,
  BotStateConfig,
} from "./bot-state-interface";
import { WorkerBotState } from "./worker-bot-state";
import { NonWorkerBotState } from "./non-worker-bot-state";

/**
 * Factory for creating appropriate bot states based on bot type
 */
export class BotStateFactory {
  /**
   * Create the appropriate bot state based on bot type
   */
  static createState(botType: BotType, config: BotStateConfig = {}): IBotState {
    switch (botType) {
      case BotType.WORKER:
        return new WorkerBotState(config);

      case BotType.PLAYABLE:
      case BotType.KING:
      case BotType.ROGUE:
      case BotType.GOVBOT:
        return new NonWorkerBotState(config);

      default:
        throw new Error(`Unknown bot type: ${botType}`);
    }
  }

  /**
   * Create a worker bot state
   */
  static createWorkerState(config: BotStateConfig = {}): IWorkerBotState {
    return new WorkerBotState(config);
  }

  /**
   * Create a non-worker bot state
   */
  static createNonWorkerState(config: BotStateConfig = {}): INonWorkerBotState {
    return new NonWorkerBotState(config);
  }

  /**
   * Check if a bot type requires worker state
   */
  static isWorkerType(botType: BotType): boolean {
    return botType === BotType.WORKER;
  }

  /**
   * Check if a bot type requires non-worker state
   */
  static isNonWorkerType(botType: BotType): boolean {
    return !this.isWorkerType(botType);
  }

  /**
   * Get the default configuration for a bot type
   */
  static getDefaultConfig(botType: BotType): BotStateConfig {
    const baseConfig: BotStateConfig = {
      energyLevel: 100,
      maintenanceLevel: 100,
      experience: 0,
    };

    switch (botType) {
      case BotType.WORKER:
        return {
          ...baseConfig,
          // Workers start in factory
          currentLocation: "STORAGE" as any,
        };

      case BotType.PLAYABLE:
        return {
          ...baseConfig,
          bondLevel: 20, // Start with some bond
          battlesWon: 0,
          battlesLost: 0,
          totalBattles: 0,
          currentLocation: "TRAINING" as any,
        };

      case BotType.KING:
        return {
          ...baseConfig,
          bondLevel: 100, // Kings start with maximum bond
          battlesWon: 10, // Kings have some battle history
          battlesLost: 1,
          totalBattles: 11,
          experience: 5000, // Kings start with high experience
          currentLocation: "TRAINING" as any,
        };

      case BotType.ROGUE:
        return {
          ...baseConfig,
          bondLevel: 0, // Rogues have no bond
          battlesWon: 15, // Rogues are experienced fighters
          battlesLost: 5,
          totalBattles: 20,
          experience: 3000,
          currentLocation: "MISSION" as any,
        };

      case BotType.GOVBOT:
        return {
          ...baseConfig,
          bondLevel: 50, // GovBots have moderate loyalty to system
          battlesWon: 5,
          battlesLost: 1,
          totalBattles: 6,
          experience: 2000,
          currentLocation: "MAINTENANCE" as any,
        };

      default:
        return baseConfig;
    }
  }

  /**
   * Create a bot state with appropriate defaults for the bot type
   */
  static createDefaultState(
    botType: BotType,
    overrides: Partial<BotStateConfig> = {}
  ): IBotState {
    const defaultConfig = this.getDefaultConfig(botType);
    const finalConfig = { ...defaultConfig, ...overrides };
    return this.createState(botType, finalConfig);
  }

  /**
   * Validate that a state is appropriate for a bot type
   */
  static validateStateForBotType(
    state: IBotState,
    botType: BotType
  ): {
    valid: boolean;
    errors: string[];
    warnings: string[];
  } {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Check if state type matches bot type requirements
    if (this.isWorkerType(botType)) {
      if (state.getStateType() !== "worker") {
        errors.push(
          `Worker bot type requires worker state, got ${state.getStateType()}`
        );
      }
    } else {
      if (state.getStateType() !== "non-worker") {
        errors.push(
          `Non-worker bot type requires non-worker state, got ${state.getStateType()}`
        );
      }

      // Additional validation for non-worker states
      const nonWorkerState = state as INonWorkerBotState;
      if (botType === BotType.KING && nonWorkerState.bondLevel < 80) {
        warnings.push("King bots should have high bond levels");
      }
      if (botType === BotType.ROGUE && nonWorkerState.bondLevel > 20) {
        warnings.push("Rogue bots should have low bond levels");
      }
    }

    // General validation
    if (state.energyLevel < 0 || state.energyLevel > 100) {
      errors.push("Energy level must be between 0 and 100");
    }
    if (state.maintenanceLevel < 0 || state.maintenanceLevel > 100) {
      errors.push("Maintenance level must be between 0 and 100");
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
    };
  }

  /**
   * Convert a legacy BotState to the new system
   */
  static fromLegacyState(legacyState: any, botType: BotType): IBotState {
    const config: BotStateConfig = {
      energyLevel: legacyState.energyLevel || 100,
      maintenanceLevel: legacyState.maintenanceLevel || 100,
      statusEffects: legacyState.statusEffects || [],
      currentLocation: legacyState.currentLocation || "STORAGE",
      experience: legacyState.experience || 0,
      customizations: legacyState.customizations || new Map(),
    };

    // Add non-worker specific properties if needed
    if (this.isNonWorkerType(botType)) {
      config.bondLevel = legacyState.bondLevel || 0;
      config.lastActivity = legacyState.lastActivity || new Date();
      config.battlesWon = legacyState.battlesWon || 0;
      config.battlesLost = legacyState.battlesLost || 0;
      config.totalBattles = legacyState.totalBattles || 0;
    }

    return this.createState(botType, config);
  }
}
