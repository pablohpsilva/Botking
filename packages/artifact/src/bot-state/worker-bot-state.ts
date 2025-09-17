import { BotLocation, ActiveStatusEffect, StatusEffect } from "../types";
import { BaseBotState } from "./base-bot-state";
import { IWorkerBotState, BotStateConfig } from "./bot-state-interface";

/**
 * Worker Bot State
 * Simple state management for utility and work bots
 *
 * Properties:
 * - energyLevel: Current energy (0-100)
 * - maintenanceLevel: Current maintenance condition (0-100)
 * - statusEffects: Active status effects
 * - currentLocation: Where the bot is currently located
 * - experience: Total experience points earned
 * - customizations: Key-value store for custom properties
 */
export class WorkerBotState extends BaseBotState implements IWorkerBotState {
  constructor(config: BotStateConfig = {}) {
    super(config);
  }

  public getStateType(): string {
    return "worker";
  }

  /**
   * Calculate work efficiency based on current state
   */
  public calculateWorkEfficiency(): number {
    let efficiency = this._energyLevel / 100;

    // Maintenance affects efficiency
    if (this._maintenanceLevel < 50) {
      efficiency *= this._maintenanceLevel / 50;
    }

    // Status effects affect efficiency
    for (const effect of this._statusEffects) {
      switch (effect.effect) {
        case StatusEffect.PRODUCTIVITY_BOOST:
          efficiency += effect.magnitude / 100;
          break;
        case StatusEffect.FATIGUE:
          efficiency -= effect.magnitude / 100;
          break;
        case StatusEffect.MAINTENANCE_BONUS:
          efficiency += effect.magnitude / 200; // Smaller impact
          break;
      }
    }

    return Math.max(0, Math.min(2.0, efficiency)); // Cap at 200% efficiency
  }

  /**
   * Get work-specific status information
   */
  public getWorkStatus(): {
    efficiency: number;
    condition: string;
    readyForWork: boolean;
    recommendedAction: string;
  } {
    const efficiency = this.calculateWorkEfficiency();
    let condition: string;
    let readyForWork = true;
    let recommendedAction = "Ready for assignment";

    if (this._energyLevel < 20) {
      condition = "Exhausted";
      readyForWork = false;
      recommendedAction = "Requires energy restoration";
    } else if (this._maintenanceLevel < 30) {
      condition = "Needs Maintenance";
      readyForWork = false;
      recommendedAction = "Schedule maintenance";
    } else if (this._energyLevel < 50) {
      condition = "Low Energy";
      recommendedAction = "Consider energy boost";
    } else if (efficiency > 1.2) {
      condition = "High Performance";
      recommendedAction = "Optimal work conditions";
    } else {
      condition = "Normal";
    }

    return {
      efficiency: Math.round(efficiency * 100),
      condition,
      readyForWork,
      recommendedAction,
    };
  }

  /**
   * Simulate work activity and update state accordingly
   */
  public performWork(
    workIntensity: number = 1.0,
    duration: number = 1
  ): {
    success: boolean;
    outputQuality: number;
    energyConsumed: number;
    experienceGained: number;
  } {
    if (!this.isOperational()) {
      return {
        success: false,
        outputQuality: 0,
        energyConsumed: 0,
        experienceGained: 0,
      };
    }

    const efficiency = this.calculateWorkEfficiency();
    const energyConsumed = Math.min(
      this._energyLevel,
      workIntensity * duration * 10
    );
    const outputQuality = efficiency * (this._energyLevel / 100);
    const experienceGained = Math.round(workIntensity * duration * 5);

    // Update state
    this.updateEnergy(-energyConsumed);
    this.updateMaintenance(-workIntensity * duration * 2); // Work causes wear
    this.addExperience(experienceGained);

    // Add fatigue if working at high intensity
    if (workIntensity > 1.5) {
      this.addStatusEffect({
        id: `fatigue_${Date.now()}`,
        effect: StatusEffect.FATIGUE,
        magnitude: workIntensity * 5,
        duration: 3600, // 1 hour
        source: "intensive_work",
      });
    }

    return {
      success: true,
      outputQuality: Math.round(outputQuality * 100),
      energyConsumed: Math.round(energyConsumed),
      experienceGained,
    };
  }

  /**
   * Specialized rest/recharge for worker bots
   */
  public rest(duration: number = 1): {
    energyRestored: number;
    statusEffectsRemoved: string[];
  } {
    const energyRestored = Math.min(100 - this._energyLevel, duration * 20);
    this.updateEnergy(energyRestored);

    // Remove some negative effects during rest
    const removedEffects: string[] = [];
    this._statusEffects = this._statusEffects.filter((effect) => {
      if (effect.effect === StatusEffect.FATIGUE && Math.random() < 0.3) {
        removedEffects.push(effect.id);
        return false;
      }
      return true;
    });

    return {
      energyRestored: Math.round(energyRestored),
      statusEffectsRemoved: removedEffects,
    };
  }

  /**
   * Enhanced JSON output for worker state
   */
  public toJSON(): Record<string, any> {
    const baseJson = super.toJSON();
    const workStatus = this.getWorkStatus();

    return {
      ...baseJson,
      stateType: this.getStateType(),
      workEfficiency: this.calculateWorkEfficiency(),
      workStatus,
    };
  }
}
