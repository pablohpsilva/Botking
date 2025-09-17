import { Rarity, PartCategory, CombatStats, Ability } from "../types";

/**
 * Interface defining the contract for all part implementations
 */
export interface IPart {
  readonly id: string;
  readonly category: PartCategory;
  readonly rarity: Rarity;
  readonly name: string;
  readonly stats: CombatStats;
  readonly abilities: Ability[];
  upgradeLevel: number;

  // Base functionality
  getRarityMultiplier(): number;
  getUpgradeMultiplier(): number;
  getEffectiveStats(): CombatStats;
  getMaxUpgradeLevel(): number;
  upgrade(): boolean;
  canUpgrade(): boolean;

  // Category-specific methods
  getCategoryBonuses(): { [key: string]: number };
  getAvailableAbilities(): Ability[];
  getUpgradeCost(): number;

  // Interaction methods
  isCompatibleWith(otherPart: IPart): boolean;
  getSynergyBonus(otherPart: IPart): number;

  // Part-specific advanced methods that each part type can override
  getSpecializedCapabilities(): { [key: string]: any };
  getOptimalUsageScenarios(): string[];
  getCompatibleSkeletonTypes(): string[];
  getPerformanceMetrics(): { [key: string]: number };

  // Maintenance and durability
  getCurrentDurability(): number;
  getMaintenanceRequirements(): { [key: string]: any };
  performMaintenance(quality: number): { restored: number; cost: number };

  // Serialization
  toJSON(): object;
}

/**
 * Part installation result interface
 */
export interface PartInstallation {
  success: boolean;
  compatibilityScore: number;
  warnings: string[];
  performanceImpact: { [key: string]: number };
}

/**
 * Part optimization suggestion interface
 */
export interface PartOptimization {
  recommendedUpgradeLevel: number;
  optimalSynergies: string[];
  usageRecommendations: string[];
  performanceScore: number;
  maintenanceSchedule: string[];
}

/**
 * Combat effectiveness analysis interface
 */
export interface CombatEffectiveness {
  offensiveRating: number;
  defensiveRating: number;
  mobilityRating: number;
  utilityRating: number;
  overallRating: number;
  specializations: string[];
}
