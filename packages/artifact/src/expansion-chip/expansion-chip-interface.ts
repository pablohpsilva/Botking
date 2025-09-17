import { Rarity, ExpansionChipEffect } from "../types";

/**
 * Interface defining the contract for all expansion chip implementations
 */
export interface IExpansionChip {
  readonly id: string;
  readonly name: string;
  readonly effect: ExpansionChipEffect;
  readonly rarity: Rarity;
  readonly description: string;
  upgradeLevel: number;

  // Base functionality
  getBaseEffectMagnitude(): number;
  getUpgradeBonus(): number;
  getEffectMagnitude(): number;
  getMaxUpgradeLevel(): number;
  upgrade(): boolean;
  canUpgrade(): boolean;

  // Effect-specific methods
  getEffectDetails(): {
    type: string;
    magnitude: number;
    description: string;
    applicableStats: string[];
  };

  // Interaction methods
  conflictsWith(otherChip: IExpansionChip): boolean;
  getSynergyBonus(otherChip: IExpansionChip): number;

  // Cost and energy methods
  getUpgradeCost(): number;
  getEnergyCost(): number;

  // Effect-specific advanced methods that each chip type can override
  getAdvancedEffects(): { [key: string]: any };
  getOptimalUsageScenarios(): string[];
  getCompatibleSkeletonTypes(): string[];
  getPerformanceMetrics(): { [key: string]: number };

  // Serialization
  toJSON(): object;
}

/**
 * Effect application result interface
 */
export interface EffectApplication {
  success: boolean;
  appliedMagnitude: number;
  duration: number;
  energyCost: number;
  side_effects?: string[];
}

/**
 * Chip optimization suggestion interface
 */
export interface ChipOptimization {
  recommendedUpgradeLevel: number;
  optimalSynergies: string[];
  usageRecommendations: string[];
  performanceScore: number;
}
