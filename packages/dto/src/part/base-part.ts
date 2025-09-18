import { Rarity, PartCategory, CombatStats, Ability } from "../types";
import {
  IPart,
  PartInstallation,
  PartOptimization,
  CombatEffectiveness,
} from "./part-interface";

/**
 * Abstract base class providing common part functionality
 */
export abstract class BasePart implements IPart {
  public readonly id: string;
  public readonly category: PartCategory;
  public readonly rarity: Rarity;
  public readonly name: string;
  public readonly stats: CombatStats;
  public readonly abilities: Ability[];
  public upgradeLevel: number;
  private currentDurability: number;
  private maxDurability: number;

  constructor(
    id: string,
    category: PartCategory,
    rarity: Rarity,
    name: string,
    stats: CombatStats,
    abilities: Ability[] = [],
    upgradeLevel: number = 0
  ) {
    this.id = id;
    this.category = category;
    this.rarity = rarity;
    this.name = name;
    this.stats = stats;
    this.abilities = abilities;
    this.upgradeLevel = Math.max(0, upgradeLevel);

    // Initialize durability based on rarity and stats
    this.maxDurability = this.calculateMaxDurability();
    this.currentDurability = this.maxDurability;
  }

  /**
   * Get rarity multiplier for stats
   */
  public getRarityMultiplier(): number {
    switch (this.rarity) {
      case Rarity.UNCOMMON:
        return 1.2;
      case Rarity.RARE:
        return 1.4;
      case Rarity.EPIC:
        return 1.7;
      case Rarity.LEGENDARY:
        return 2.0;
      case Rarity.ULTRA_RARE:
        return 2.5;
      case Rarity.PROTOTYPE:
        return 3.0;
      case Rarity.COMMON:
      default:
        return 1.0;
    }
  }

  /**
   * Get upgrade multiplier based on upgrade level
   */
  public getUpgradeMultiplier(): number {
    return 1.0 + this.upgradeLevel * 0.1; // 10% bonus per upgrade level
  }

  /**
   * Get effective stats with rarity and upgrade bonuses applied
   */
  public getEffectiveStats(): CombatStats {
    const rarityMultiplier = this.getRarityMultiplier();
    const upgradeMultiplier = this.getUpgradeMultiplier();
    const durabilityFactor = this.currentDurability / this.maxDurability;
    const totalMultiplier =
      rarityMultiplier * upgradeMultiplier * durabilityFactor;

    return {
      attack: Math.floor(this.stats.attack * totalMultiplier),
      defense: Math.floor(this.stats.defense * totalMultiplier),
      speed: Math.floor(this.stats.speed * totalMultiplier),
      perception: Math.floor(this.stats.perception * totalMultiplier),
      energyConsumption: Math.ceil(
        this.stats.energyConsumption * (1 + this.upgradeLevel * 0.05)
      ), // Energy consumption increases slightly with upgrades
    };
  }

  /**
   * Get maximum upgrade level based on rarity
   */
  public getMaxUpgradeLevel(): number {
    switch (this.rarity) {
      case Rarity.UNCOMMON:
        return 5;
      case Rarity.RARE:
        return 7;
      case Rarity.EPIC:
        return 10;
      case Rarity.LEGENDARY:
        return 15;
      case Rarity.ULTRA_RARE:
        return 20;
      case Rarity.PROTOTYPE:
        return 25;
      case Rarity.COMMON:
      default:
        return 3;
    }
  }

  /**
   * Upgrade the part if possible
   */
  public upgrade(): boolean {
    if (this.upgradeLevel < this.getMaxUpgradeLevel()) {
      this.upgradeLevel++;
      // Upgrading also restores some durability
      this.currentDurability = Math.min(
        this.maxDurability,
        this.currentDurability + this.maxDurability * 0.1
      );
      return true;
    }
    return false;
  }

  /**
   * Check if the part can be upgraded
   */
  public canUpgrade(): boolean {
    return this.upgradeLevel < this.getMaxUpgradeLevel();
  }

  /**
   * Get available abilities for this part
   */
  public getAvailableAbilities(): Ability[] {
    return this.abilities.filter((ability) => {
      const requiredLevel = this.getRequiredUpgradeLevelForAbility(ability.id);
      return this.upgradeLevel >= requiredLevel;
    });
  }

  /**
   * Get required upgrade level for a specific ability
   */
  private getRequiredUpgradeLevelForAbility(abilityId: string): number {
    if (abilityId.includes("advanced")) return 5;
    if (abilityId.includes("master")) return 10;
    if (abilityId.includes("legendary")) return 15;
    return 0;
  }

  /**
   * Get upgrade cost
   */
  public getUpgradeCost(): number {
    const baseCost = 100;
    const rarityMultiplier = this.getRarityMultiplier();
    const levelMultiplier = Math.pow(1.5, this.upgradeLevel);

    return Math.floor(baseCost * rarityMultiplier * levelMultiplier);
  }

  /**
   * Basic compatibility checking - can be overridden by specific part types
   */
  public isCompatibleWith(otherPart: IPart): boolean {
    // Same category parts cannot be used together
    if (this.category === otherPart.category) {
      return false;
    }

    // Ultra rare parts might not be compatible with common parts
    if (
      this.rarity === Rarity.ULTRA_RARE &&
      otherPart.rarity === Rarity.COMMON
    ) {
      return false;
    }

    return true;
  }

  /**
   * Basic synergy calculation - can be overridden by specific part types
   */
  public getSynergyBonus(otherPart: IPart): number {
    return 0; // Default no synergy, specific parts can override
  }

  /**
   * Get current durability
   */
  public getCurrentDurability(): number {
    return this.currentDurability;
  }

  /**
   * Get maintenance requirements
   */
  public getMaintenanceRequirements(): { [key: string]: any } {
    const durabilityRatio = this.currentDurability / this.maxDurability;

    return {
      urgency:
        durabilityRatio < 0.3
          ? "critical"
          : durabilityRatio < 0.6
            ? "moderate"
            : "low",
      estimatedCost: Math.floor(
        this.getUpgradeCost() * 0.3 * (1 - durabilityRatio)
      ),
      timeRequired: Math.ceil(10 * (1 - durabilityRatio)), // Hours
      materialsNeeded: this.getMaintenanceMaterials(),
      frequency: this.getMaintenanceFrequency(),
    };
  }

  /**
   * Perform maintenance on the part
   */
  public performMaintenance(quality: number = 1.0): {
    restored: number;
    cost: number;
  } {
    const maxRestoration = this.maxDurability - this.currentDurability;
    const restorationAmount = maxRestoration * Math.min(1.0, quality);
    const cost = Math.floor(this.getUpgradeCost() * 0.2 * quality);

    this.currentDurability += restorationAmount;

    return {
      restored: restorationAmount,
      cost,
    };
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
    const effectiveStats = this.getEffectiveStats();
    const durabilityFactor = this.currentDurability / this.maxDurability;

    return {
      offensivePower: (effectiveStats.attack / 100) * durabilityFactor,
      defensivePower: (effectiveStats.defense / 100) * durabilityFactor,
      mobility: (effectiveStats.speed / 100) * durabilityFactor,
      efficiency: 1.0 / (effectiveStats.energyConsumption || 1),
      reliability: durabilityFactor,
      versatility: 0.5 + this.upgradeLevel * 0.02,
    };
  }

  /**
   * Calculate maximum durability based on stats and rarity
   */
  private calculateMaxDurability(): number {
    const baseStats = this.stats.defense + this.stats.attack + this.stats.speed;
    const rarityMultiplier = this.getRarityMultiplier();
    return Math.floor(100 + baseStats * 2 + rarityMultiplier * 50);
  }

  /**
   * Get maintenance materials needed
   */
  private getMaintenanceMaterials(): string[] {
    const materials = ["basic_components"];

    if (this.rarity >= Rarity.RARE) {
      materials.push("advanced_alloys");
    }

    if (this.rarity >= Rarity.LEGENDARY) {
      materials.push("quantum_circuits");
    }

    return materials;
  }

  /**
   * Get recommended maintenance frequency in hours
   */
  private getMaintenanceFrequency(): number {
    const baseFrequency = 100; // Hours
    const rarityBonus = this.getRarityMultiplier() * 20;
    return baseFrequency + rarityBonus;
  }

  /**
   * Serialize the part to JSON
   */
  public toJSON(): object {
    return {
      id: this.id,
      category: this.category,
      rarity: this.rarity,
      name: this.name,
      stats: this.stats,
      abilities: this.abilities,
      upgradeLevel: this.upgradeLevel,
      currentDurability: this.currentDurability,
      maxDurability: this.maxDurability,
      className: this.constructor.name,
    };
  }

  // Abstract methods that must be implemented by concrete part classes

  /**
   * Get category-specific bonuses
   */
  public abstract getCategoryBonuses(): { [key: string]: number };

  /**
   * Get specialized capabilities specific to this part type
   */
  public abstract getSpecializedCapabilities(): { [key: string]: any };

  /**
   * Get optimal usage scenarios for this part type
   */
  public abstract getOptimalUsageScenarios(): string[];

  /**
   * Install this part with another part and get compatibility analysis
   */
  public installWith(otherPart: IPart): PartInstallation {
    const isCompatible = this.isCompatibleWith(otherPart);
    const synergyBonus = this.getSynergyBonus(otherPart);

    const warnings: string[] = [];
    if (!isCompatible) {
      warnings.push(
        `${this.category} and ${otherPart.category} may have compatibility issues`
      );
    }

    if (Math.abs(this.upgradeLevel - otherPart.upgradeLevel) > 5) {
      warnings.push("Large upgrade level difference may cause imbalances");
    }

    const compatibilityScore = isCompatible ? 0.8 + synergyBonus * 0.2 : 0.3;

    return {
      success: isCompatible,
      compatibilityScore,
      warnings,
      performanceImpact: {
        efficiency: synergyBonus,
        reliability: isCompatible ? 0 : -0.2,
        maintenance: isCompatible ? 0 : 0.3,
      },
    };
  }

  /**
   * Get optimization suggestions for this part
   */
  public getOptimizationSuggestions(currentSetup: {
    [key: string]: any;
  }): PartOptimization {
    const currentPerformance = this.getPerformanceMetrics();
    const maintenance = this.getMaintenanceRequirements();

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
      maintenanceSchedule: [
        `Maintenance ${maintenance.urgency} priority`,
        `Check every ${maintenance.frequency} hours`,
        "Monitor durability regularly",
      ],
    };
  }

  /**
   * Analyze combat effectiveness
   */
  public analyzeCombatEffectiveness(): CombatEffectiveness {
    const stats = this.getEffectiveStats();
    const capabilities = this.getSpecializedCapabilities();

    const offensiveRating = Math.min(10, stats.attack / 10);
    const defensiveRating = Math.min(10, stats.defense / 10);
    const mobilityRating = Math.min(10, stats.speed / 10);
    const utilityRating = Math.min(10, stats.perception / 10);

    const overallRating =
      (offensiveRating + defensiveRating + mobilityRating + utilityRating) / 4;

    return {
      offensiveRating,
      defensiveRating,
      mobilityRating,
      utilityRating,
      overallRating,
      specializations: Object.keys(capabilities),
    };
  }
}
