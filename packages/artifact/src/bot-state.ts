import { BotLocation, ActiveStatusEffect } from "./types";

/**
 * BotState - Dynamic runtime state that makes the bot feel alive in gameplay
 */
export class BotState {
  public energyLevel: number;
  public maintenanceLevel: number;
  public statusEffects: ActiveStatusEffect[];
  public bondLevel: number;
  public currentLocation: BotLocation;
  public lastActivity: Date;

  // Additional state properties
  public experience: number;
  public battlesWon: number;
  public battlesLost: number;
  public totalBattles: number;
  public customizations: Map<string, any>;

  constructor(
    energyLevel: number = 100,
    maintenanceLevel: number = 100,
    statusEffects: ActiveStatusEffect[] = [],
    bondLevel: number = 0,
    currentLocation: BotLocation = BotLocation.IDLE,
    experience: number = 0
  ) {
    this.energyLevel = Math.max(0, Math.min(100, energyLevel));
    this.maintenanceLevel = Math.max(0, Math.min(100, maintenanceLevel));
    this.statusEffects = statusEffects;
    this.bondLevel = Math.max(0, Math.min(100, bondLevel));
    this.currentLocation = currentLocation;
    this.lastActivity = new Date();
    this.experience = Math.max(0, experience);
    this.battlesWon = 0;
    this.battlesLost = 0;
    this.totalBattles = 0;
    this.customizations = new Map();
  }

  /**
   * Update energy level within bounds
   */
  public updateEnergy(amount: number): void {
    this.energyLevel = Math.max(0, Math.min(100, this.energyLevel + amount));
    this.lastActivity = new Date();
  }

  /**
   * Update maintenance level within bounds
   */
  public updateMaintenance(amount: number): void {
    this.maintenanceLevel = Math.max(
      0,
      Math.min(100, this.maintenanceLevel + amount)
    );
    this.lastActivity = new Date();
  }

  /**
   * Update bond level within bounds
   */
  public updateBond(amount: number): void {
    this.bondLevel = Math.max(0, Math.min(100, this.bondLevel + amount));
    this.lastActivity = new Date();
  }

  /**
   * Add experience and check for level-ups or bond improvements
   */
  public addExperience(amount: number): {
    leveledUp: boolean;
    bondImproved: boolean;
  } {
    const oldLevel = this.getLevel();
    const oldBondTier = this.getBondTier();

    this.experience += Math.max(0, amount);
    this.lastActivity = new Date();

    const newLevel = this.getLevel();
    const newBondTier = this.getBondTier();

    return {
      leveledUp: newLevel > oldLevel,
      bondImproved: newBondTier > oldBondTier,
    };
  }

  /**
   * Get current level based on experience
   */
  public getLevel(): number {
    return Math.floor(Math.sqrt(this.experience / 100)) + 1;
  }

  /**
   * Get bond tier based on bond level
   */
  public getBondTier(): number {
    if (this.bondLevel >= 90) return 5; // Master
    if (this.bondLevel >= 70) return 4; // Expert
    if (this.bondLevel >= 50) return 3; // Skilled
    if (this.bondLevel >= 25) return 2; // Novice
    return 1; // Beginner
  }

  /**
   * Get bond tier name
   */
  public getBondTierName(): string {
    const tier = this.getBondTier();
    const names = [
      "Unknown",
      "Beginner",
      "Novice",
      "Skilled",
      "Expert",
      "Master",
    ];
    return names[tier] || "Unknown";
  }

  /**
   * Add a status effect
   */
  public addStatusEffect(effect: ActiveStatusEffect): void {
    // Remove existing effect of the same type first
    this.removeStatusEffect(effect.effect);
    this.statusEffects.push(effect);
    this.lastActivity = new Date();
  }

  /**
   * Remove a status effect by type
   */
  public removeStatusEffect(effectType: string): void {
    this.statusEffects = this.statusEffects.filter(
      (effect) => effect.effect !== effectType
    );
    this.lastActivity = new Date();
  }

  /**
   * Update all status effects (reduce duration, remove expired ones)
   */
  public updateStatusEffects(deltaTime: number): void {
    this.statusEffects = this.statusEffects
      .map((effect) => ({
        ...effect,
        duration: effect.duration - deltaTime,
      }))
      .filter((effect) => effect.duration > 0);

    this.lastActivity = new Date();
  }

  /**
   * Check if bot has a specific status effect
   */
  public hasStatusEffect(effectType: string): boolean {
    return this.statusEffects.some((effect) => effect.effect === effectType);
  }

  /**
   * Get the magnitude of a specific status effect
   */
  public getStatusEffectMagnitude(effectType: string): number {
    const effect = this.statusEffects.find(
      (effect) => effect.effect === effectType
    );
    return effect ? effect.magnitude : 0;
  }

  /**
   * Update location
   */
  public updateLocation(newLocation: BotLocation): void {
    this.currentLocation = newLocation;
    this.lastActivity = new Date();
  }

  /**
   * Record battle result
   */
  public recordBattleResult(won: boolean, experienceGained: number = 0): void {
    this.totalBattles++;
    if (won) {
      this.battlesWon++;
      this.updateBond(2); // Win gives bond bonus
    } else {
      this.battlesLost++;
      this.updateBond(1); // Even losses give small bond bonus for trying
    }

    this.addExperience(experienceGained);
    this.updateMaintenance(-10); // Battles cause wear
    this.updateEnergy(-20); // Battles consume energy
  }

  /**
   * Get win rate percentage
   */
  public getWinRate(): number {
    if (this.totalBattles === 0) return 0;
    return (this.battlesWon / this.totalBattles) * 100;
  }

  /**
   * Check if bot needs maintenance
   */
  public needsMaintenance(): boolean {
    return this.maintenanceLevel < 30;
  }

  /**
   * Check if bot needs energy
   */
  public needsEnergy(): boolean {
    return this.energyLevel < 20;
  }

  /**
   * Check if bot is battle ready
   */
  public isBattleReady(): boolean {
    return (
      this.energyLevel >= 30 &&
      this.maintenanceLevel >= 20 &&
      !this.hasStatusEffect("maintenance_penalty")
    );
  }

  /**
   * Get overall condition rating
   */
  public getConditionRating(): {
    overall: number;
    energy: string;
    maintenance: string;
    bond: string;
    status: string;
  } {
    const energyStatus =
      this.energyLevel >= 70
        ? "excellent"
        : this.energyLevel >= 40
          ? "good"
          : this.energyLevel >= 20
            ? "poor"
            : "critical";

    const maintenanceStatus =
      this.maintenanceLevel >= 70
        ? "excellent"
        : this.maintenanceLevel >= 40
          ? "good"
          : this.maintenanceLevel >= 20
            ? "poor"
            : "critical";

    const bondStatus =
      this.bondLevel >= 70
        ? "strong"
        : this.bondLevel >= 40
          ? "developing"
          : this.bondLevel >= 20
            ? "weak"
            : "distant";

    const statusCondition =
      this.statusEffects.length === 0
        ? "normal"
        : this.statusEffects.some((e) => e.magnitude < 0)
          ? "impaired"
          : "enhanced";

    const overall =
      (this.energyLevel + this.maintenanceLevel + this.bondLevel) / 3;

    return {
      overall: Math.round(overall),
      energy: energyStatus,
      maintenance: maintenanceStatus,
      bond: bondStatus,
      status: statusCondition,
    };
  }

  /**
   * Perform maintenance to restore condition
   */
  public performMaintenance(qualityLevel: number = 1.0): {
    maintenanceRestored: number;
    energyRestored: number;
    statusEffectsRemoved: string[];
  } {
    const maintenanceRestored = Math.min(
      100 - this.maintenanceLevel,
      30 * qualityLevel
    );
    const energyRestored = Math.min(100 - this.energyLevel, 15 * qualityLevel);

    this.updateMaintenance(maintenanceRestored);
    this.updateEnergy(energyRestored);

    // Remove negative status effects with maintenance
    const removedEffects: string[] = [];
    if (qualityLevel >= 0.8) {
      this.statusEffects = this.statusEffects.filter((effect) => {
        if (effect.magnitude < 0) {
          removedEffects.push(effect.effect);
          return false;
        }
        return true;
      });
    }

    return {
      maintenanceRestored,
      energyRestored,
      statusEffectsRemoved: removedEffects,
    };
  }

  /**
   * Rest to restore energy
   */
  public rest(hours: number): number {
    const energyRestored = Math.min(100 - this.energyLevel, hours * 10);
    this.updateEnergy(energyRestored);
    return energyRestored;
  }

  /**
   * Set a customization
   */
  public setCustomization(key: string, value: any): void {
    this.customizations.set(key, value);
    this.lastActivity = new Date();
  }

  /**
   * Get a customization
   */
  public getCustomization(key: string): any {
    return this.customizations.get(key);
  }

  /**
   * Serialize the bot state to JSON
   */
  public toJSON(): object {
    return {
      energyLevel: this.energyLevel,
      maintenanceLevel: this.maintenanceLevel,
      statusEffects: this.statusEffects,
      bondLevel: this.bondLevel,
      currentLocation: this.currentLocation,
      lastActivity: this.lastActivity.toISOString(),
      experience: this.experience,
      battlesWon: this.battlesWon,
      battlesLost: this.battlesLost,
      totalBattles: this.totalBattles,
      customizations: Object.fromEntries(this.customizations),
    };
  }

  /**
   * Create a BotState from JSON data
   */
  public static fromJSON(data: any): BotState {
    const state = new BotState(
      data.energyLevel,
      data.maintenanceLevel,
      data.statusEffects || [],
      data.bondLevel,
      data.currentLocation,
      data.experience || 0
    );

    state.battlesWon = data.battlesWon || 0;
    state.battlesLost = data.battlesLost || 0;
    state.totalBattles = data.totalBattles || 0;
    state.lastActivity = data.lastActivity
      ? new Date(data.lastActivity)
      : new Date();

    if (data.customizations) {
      state.customizations = new Map(Object.entries(data.customizations));
    }

    return state;
  }
}
