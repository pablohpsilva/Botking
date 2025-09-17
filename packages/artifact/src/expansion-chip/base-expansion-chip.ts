import { Rarity, ExpansionChipEffect } from "../types";
import {
  IExpansionChip,
  EffectApplication,
  ChipOptimization,
} from "./expansion-chip-interface";

/**
 * Abstract base class providing common expansion chip functionality
 */
export abstract class BaseExpansionChip implements IExpansionChip {
  public readonly id: string;
  public readonly name: string;
  public readonly effect: ExpansionChipEffect;
  public readonly rarity: Rarity;
  public readonly description: string;
  public upgradeLevel: number;

  constructor(
    id: string,
    name: string,
    effect: ExpansionChipEffect,
    rarity: Rarity,
    description: string,
    upgradeLevel: number = 0
  ) {
    this.id = id;
    this.name = name;
    this.effect = effect;
    this.rarity = rarity;
    this.description = description;
    this.upgradeLevel = Math.max(0, upgradeLevel);
  }

  /**
   * Get the base effect magnitude based on rarity
   */
  public getBaseEffectMagnitude(): number {
    switch (this.rarity) {
      case Rarity.UNCOMMON:
        return 0.08; // 8% effect
      case Rarity.RARE:
        return 0.12; // 12% effect
      case Rarity.EPIC:
        return 0.18; // 18% effect
      case Rarity.LEGENDARY:
        return 0.25; // 25% effect
      case Rarity.ULTRA_RARE:
        return 0.35; // 35% effect
      case Rarity.PROTOTYPE:
        return 0.5; // 50% effect
      case Rarity.COMMON:
      default:
        return 0.05;
    }
  }

  /**
   * Get upgrade bonus per level
   */
  public getUpgradeBonus(): number {
    return this.upgradeLevel * 0.02; // 2% additional effect per upgrade level
  }

  /**
   * Get total effect magnitude with upgrades
   */
  public getEffectMagnitude(): number {
    return this.getBaseEffectMagnitude() + this.getUpgradeBonus();
  }

  /**
   * Get maximum upgrade level based on rarity
   */
  public getMaxUpgradeLevel(): number {
    switch (this.rarity) {
      case Rarity.UNCOMMON:
        return 7;
      case Rarity.RARE:
        return 10;
      case Rarity.EPIC:
        return 12;
      case Rarity.LEGENDARY:
        return 15;
      case Rarity.ULTRA_RARE:
        return 18;
      case Rarity.PROTOTYPE:
        return 20;
      case Rarity.COMMON:
      default:
        return 5;
    }
  }

  /**
   * Upgrade the chip if possible
   */
  public upgrade(): boolean {
    if (this.upgradeLevel < this.getMaxUpgradeLevel()) {
      this.upgradeLevel++;
      return true;
    }
    return false;
  }

  /**
   * Check if the chip can be upgraded
   */
  public canUpgrade(): boolean {
    return this.upgradeLevel < this.getMaxUpgradeLevel();
  }

  /**
   * Get upgrade cost
   */
  public getUpgradeCost(): number {
    const baseCost = 50;
    const rarityMultiplier = Math.pow(
      1.5,
      Object.values(Rarity).indexOf(this.rarity)
    );
    const levelMultiplier = Math.pow(1.3, this.upgradeLevel);

    return Math.floor(baseCost * rarityMultiplier * levelMultiplier);
  }

  /**
   * Get energy cost to maintain this chip's effect
   */
  public getEnergyCost(): number {
    const baseEnergy = 1;
    const effectMultiplier = this.getEffectMagnitude() * 10;
    const upgradeMultiplier = 1 + this.upgradeLevel * 0.1;

    return Math.ceil(baseEnergy + effectMultiplier * upgradeMultiplier);
  }

  /**
   * Basic conflict checking - can be overridden by specific chip types
   */
  public conflictsWith(otherChip: IExpansionChip): boolean {
    // Same effect types might conflict or stack depending on game rules
    if (this.effect === otherChip.effect) {
      // For now, assume same effects can stack but with diminishing returns
      return false;
    }
    return false;
  }

  /**
   * Basic synergy calculation - can be overridden by specific chip types
   */
  public getSynergyBonus(otherChip: IExpansionChip): number {
    return 0; // Default no synergy, specific chips can override
  }

  /**
   * Get default compatible skeleton types - can be overridden
   */
  public getCompatibleSkeletonTypes(): string[] {
    return ["light", "balanced", "heavy", "flying", "modular"]; // All by default
  }

  /**
   * Get default performance metrics - can be overridden
   */
  public getPerformanceMetrics(): { [key: string]: number } {
    return {
      effectiveness: this.getEffectMagnitude(),
      efficiency: 1.0 / this.getEnergyCost(),
      versatility: 0.5,
      reliability: 0.8 + (this.rarity === Rarity.PROTOTYPE ? 0.2 : 0),
    };
  }

  /**
   * Serialize the expansion chip to JSON
   */
  public toJSON(): object {
    return {
      id: this.id,
      name: this.name,
      effect: this.effect,
      rarity: this.rarity,
      description: this.description,
      upgradeLevel: this.upgradeLevel,
      className: this.constructor.name,
    };
  }

  // Abstract methods that must be implemented by concrete chip classes

  /**
   * Get effect details specific to this chip type
   */
  public abstract getEffectDetails(): {
    type: string;
    magnitude: number;
    description: string;
    applicableStats: string[];
  };

  /**
   * Get advanced effects specific to this chip type
   */
  public abstract getAdvancedEffects(): { [key: string]: any };

  /**
   * Get optimal usage scenarios for this chip type
   */
  public abstract getOptimalUsageScenarios(): string[];

  /**
   * Apply the chip's effect to a target with specific parameters
   */
  public applyEffect(
    target: any,
    duration: number = 60,
    conditions: { [key: string]: any } = {}
  ): EffectApplication {
    const magnitude = this.getEffectMagnitude();
    const energyCost = this.getEnergyCost();

    return {
      success: true,
      appliedMagnitude: magnitude,
      duration,
      energyCost,
    };
  }

  /**
   * Get optimization suggestions for this chip
   */
  public getOptimizationSuggestions(currentSetup: {
    [key: string]: any;
  }): ChipOptimization {
    const currentPerformance = this.getPerformanceMetrics();

    return {
      recommendedUpgradeLevel: Math.min(
        this.getMaxUpgradeLevel(),
        this.upgradeLevel + 2
      ),
      optimalSynergies: [],
      usageRecommendations: this.getOptimalUsageScenarios(),
      performanceScore:
        Object.values(currentPerformance).reduce((sum, val) => sum + val, 0) /
        Object.keys(currentPerformance).length,
    };
  }
}
