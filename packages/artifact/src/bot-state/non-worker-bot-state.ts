import { BotLocation, ActiveStatusEffect, StatusEffect } from "../types";
import { BaseBotState } from "./base-bot-state";
import { INonWorkerBotState, BotStateConfig } from "./bot-state-interface";

/**
 * Non-Worker Bot State
 * Extended state management for playable, combat, and social bots
 *
 * Properties (in addition to worker properties):
 * - bondLevel: Social bond with owner/player (0-100)
 * - lastActivity: Last time the bot was active
 * - battlesWon: Number of battles won
 * - battlesLost: Number of battles lost
 * - totalBattles: Total number of battles participated in
 */
export class NonWorkerBotState
  extends BaseBotState
  implements INonWorkerBotState
{
  protected _bondLevel: number;
  protected _lastActivity: Date;
  protected _battlesWon: number;
  protected _battlesLost: number;
  protected _totalBattles: number;

  constructor(config: BotStateConfig = {}) {
    super(config);
    this._bondLevel = Math.max(0, Math.min(100, config.bondLevel ?? 0));
    this._lastActivity = config.lastActivity ?? new Date();
    this._battlesWon = Math.max(0, config.battlesWon ?? 0);
    this._battlesLost = Math.max(0, config.battlesLost ?? 0);
    this._totalBattles = Math.max(0, config.totalBattles ?? 0);

    // Ensure battle counts are consistent
    if (this._totalBattles < this._battlesWon + this._battlesLost) {
      this._totalBattles = this._battlesWon + this._battlesLost;
    }
  }

  // Additional getters for non-worker properties
  get bondLevel(): number {
    return this._bondLevel;
  }

  set bondLevel(value: number) {
    this._bondLevel = Math.max(0, Math.min(100, value));
  }

  get lastActivity(): Date {
    return new Date(this._lastActivity);
  }

  set lastActivity(date: Date) {
    this._lastActivity = new Date(date);
  }

  get battlesWon(): number {
    return this._battlesWon;
  }

  set battlesWon(value: number) {
    this._battlesWon = Math.max(0, Math.floor(value));
    this._totalBattles = this._battlesWon + this._battlesLost;
  }

  get battlesLost(): number {
    return this._battlesLost;
  }

  set battlesLost(value: number) {
    this._battlesLost = Math.max(0, Math.floor(value));
    this._totalBattles = this._battlesWon + this._battlesLost;
  }

  get totalBattles(): number {
    return this._totalBattles;
  }

  set totalBattles(value: number) {
    // Only allow setting if it's consistent with won + lost
    const expectedTotal = this._battlesWon + this._battlesLost;
    if (value >= expectedTotal) {
      this._totalBattles = Math.max(0, Math.floor(value));
    }
  }

  public getStateType(): string {
    return "non-worker";
  }

  // Social and combat methods
  public updateBondLevel(amount: number): void {
    this._bondLevel = Math.max(0, Math.min(100, this._bondLevel + amount));
    this.updateLastActivity();
  }

  public updateLastActivity(): void {
    this._lastActivity = new Date();
  }

  public recordBattleResult(won: boolean): void {
    if (won) {
      this._battlesWon++;
    } else {
      this._battlesLost++;
    }
    this._totalBattles++;
    this.updateLastActivity();

    // Battle experience
    const experienceGained = won ? 50 : 25;
    this.addExperience(experienceGained);

    // Bond level changes based on performance
    if (won) {
      this.updateBondLevel(2); // Winning increases bond
    } else {
      this.updateBondLevel(-1); // Losing decreases bond slightly
    }

    // Battle fatigue
    this.updateEnergy(-15);
    this.updateMaintenance(-5);

    // Add battle effects
    if (won) {
      this.addStatusEffect({
        id: `victory_high_${Date.now()}`,
        effect: StatusEffect.MORALE_BOOST,
        magnitude: 10,
        duration: 1800, // 30 minutes
        source: "battle_victory",
      });
    } else {
      this.addStatusEffect({
        id: `defeat_fatigue_${Date.now()}`,
        effect: StatusEffect.MORALE_PENALTY,
        magnitude: 5,
        duration: 3600, // 1 hour
        source: "battle_defeat",
      });
    }
  }

  public getBattleStats(): {
    won: number;
    lost: number;
    total: number;
    winRate: number;
  } {
    const winRate =
      this._totalBattles > 0
        ? (this._battlesWon / this._totalBattles) * 100
        : 0;

    return {
      won: this._battlesWon,
      lost: this._battlesLost,
      total: this._totalBattles,
      winRate: Math.round(winRate * 100) / 100, // Round to 2 decimal places
    };
  }

  public calculateSocialStatus(): {
    bondLevel: number;
    activityLevel: string;
    combatRating: string;
  } {
    // Calculate activity level
    const timeSinceActivity = Date.now() - this._lastActivity.getTime();
    const hoursSinceActivity = timeSinceActivity / (1000 * 60 * 60);

    let activityLevel: string;
    if (hoursSinceActivity < 1) {
      activityLevel = "Very Active";
    } else if (hoursSinceActivity < 6) {
      activityLevel = "Active";
    } else if (hoursSinceActivity < 24) {
      activityLevel = "Moderate";
    } else if (hoursSinceActivity < 72) {
      activityLevel = "Inactive";
    } else {
      activityLevel = "Dormant";
    }

    // Calculate combat rating
    const battleStats = this.getBattleStats();
    let combatRating: string;

    if (battleStats.total === 0) {
      combatRating = "Untested";
    } else if (battleStats.winRate >= 80) {
      combatRating = "Elite";
    } else if (battleStats.winRate >= 65) {
      combatRating = "Veteran";
    } else if (battleStats.winRate >= 50) {
      combatRating = "Competent";
    } else if (battleStats.winRate >= 30) {
      combatRating = "Developing";
    } else {
      combatRating = "Struggling";
    }

    return {
      bondLevel: this._bondLevel,
      activityLevel,
      combatRating,
    };
  }

  /**
   * Calculate combat readiness based on all factors
   */
  public calculateCombatReadiness(): {
    readiness: number;
    factors: Record<string, number>;
    status: string;
    recommendations: string[];
  } {
    const factors = {
      energy: this._energyLevel,
      maintenance: this._maintenanceLevel,
      bond: this._bondLevel,
      experience: Math.min(100, this._experience / 10), // Scale experience to 0-100
      morale: this.calculateMorale(),
    };

    // Weighted average for readiness
    const readiness = Math.round(
      factors.energy * 0.3 +
        factors.maintenance * 0.25 +
        factors.bond * 0.2 +
        factors.experience * 0.15 +
        factors.morale * 0.1
    );

    let status: string;
    const recommendations: string[] = [];

    if (readiness >= 85) {
      status = "Battle Ready";
    } else if (readiness >= 70) {
      status = "Combat Capable";
    } else if (readiness >= 50) {
      status = "Needs Preparation";
      if (factors.energy < 60) recommendations.push("Restore energy");
      if (factors.maintenance < 60) recommendations.push("Perform maintenance");
      if (factors.bond < 50) recommendations.push("Improve bond level");
    } else {
      status = "Not Combat Ready";
      if (factors.energy < 40) recommendations.push("Critical: Restore energy");
      if (factors.maintenance < 40)
        recommendations.push("Critical: Repair required");
      if (factors.bond < 30) recommendations.push("Build trust with owner");
      if (factors.morale < 30) recommendations.push("Address morale issues");
    }

    return {
      readiness,
      factors,
      status,
      recommendations,
    };
  }

  /**
   * Calculate current morale based on recent events and bond level
   */
  private calculateMorale(): number {
    let morale = this._bondLevel;

    // Recent battle performance affects morale
    if (this._totalBattles > 0) {
      const recentWinRate = this.getBattleStats().winRate;
      if (recentWinRate > 70) {
        morale += 15;
      } else if (recentWinRate < 30) {
        morale -= 15;
      }
    }

    // Status effects affect morale
    for (const effect of this._statusEffects) {
      if (effect.effect === StatusEffect.MORALE_BOOST) {
        morale += effect.magnitude;
      } else if (effect.effect === StatusEffect.MORALE_PENALTY) {
        morale -= effect.magnitude;
      }
    }

    return Math.max(0, Math.min(100, morale));
  }

  /**
   * Simulate training activity
   */
  public train(
    intensity: number = 1.0,
    duration: number = 1
  ): {
    success: boolean;
    experienceGained: number;
    bondIncrease: number;
    energyConsumed: number;
  } {
    if (!this.isOperational()) {
      return {
        success: false,
        experienceGained: 0,
        bondIncrease: 0,
        energyConsumed: 0,
      };
    }

    const energyConsumed = Math.min(
      this._energyLevel,
      intensity * duration * 8
    );
    const experienceGained = Math.round(intensity * duration * 10);
    const bondIncrease = Math.round(intensity * duration * 1.5);

    // Update state
    this.updateEnergy(-energyConsumed);
    this.addExperience(experienceGained);
    this.updateBondLevel(bondIncrease);
    this.updateLastActivity();

    // Training gives positive effects
    this.addStatusEffect({
      id: `training_boost_${Date.now()}`,
      effect: StatusEffect.SKILL_IMPROVEMENT,
      magnitude: intensity * 5,
      duration: 7200, // 2 hours
      source: "training_session",
    });

    return {
      success: true,
      experienceGained,
      bondIncrease,
      energyConsumed: Math.round(energyConsumed),
    };
  }

  /**
   * Enhanced JSON output for non-worker state
   */
  public toJSON(): Record<string, any> {
    const baseJson = super.toJSON();
    const battleStats = this.getBattleStats();
    const socialStatus = this.calculateSocialStatus();
    const combatReadiness = this.calculateCombatReadiness();

    return {
      ...baseJson,
      stateType: this.getStateType(),
      bondLevel: this._bondLevel,
      lastActivity: this._lastActivity.toISOString(),
      battlesWon: this._battlesWon,
      battlesLost: this._battlesLost,
      totalBattles: this._totalBattles,
      battleStats,
      socialStatus,
      combatReadiness,
    };
  }
}
