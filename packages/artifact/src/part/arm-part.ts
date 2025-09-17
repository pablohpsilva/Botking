import { Rarity, PartCategory, CombatStats, Ability } from "../types";
import { BasePart } from "./base-part";
import { IPart } from "./part-interface";

/**
 * ArmPart - Specialized for offensive capabilities, tool usage, and manipulation
 */
export class ArmPart extends BasePart {
  constructor(
    id: string,
    rarity: Rarity,
    name: string,
    stats: CombatStats,
    abilities: Ability[] = [],
    upgradeLevel: number = 0
  ) {
    super(id, PartCategory.ARM, rarity, name, stats, abilities, upgradeLevel);
  }

  public getCategoryBonuses(): { [key: string]: number } {
    return {
      attackBonus: 1.2,
      grapplingBonus: 1.1,
      toolUsageBonus: 1.0,
      manipulationSpeed: 1.15,
      weaponProficiency: 1.3,
    };
  }

  public getSpecializedCapabilities(): { [key: string]: any } {
    const bonuses = this.getCategoryBonuses();
    const upgradeLevel = this.upgradeLevel;

    return {
      weaponMastery: {
        meleeProficiency: bonuses.weaponProficiency + upgradeLevel * 0.1,
        rangedAccuracy: bonuses.attackBonus + upgradeLevel * 0.08,
        reloadSpeed: 1 + upgradeLevel * 0.05,
        weaponSwapSpeed: 1 + upgradeLevel * 0.1,
      },

      combatTechniques: {
        punchDamage: this.stats.attack * bonuses.attackBonus,
        grapplingStrength: this.stats.attack * bonuses.grapplingBonus,
        blockingEfficiency: this.stats.defense * 0.8,
        counterAttackChance: Math.min(0.3, upgradeLevel * 0.02),
      },

      toolOperations: {
        repairEfficiency: bonuses.toolUsageBonus + upgradeLevel * 0.05,
        constructionSpeed: bonuses.manipulationSpeed + upgradeLevel * 0.03,
        hackingCapability: this.stats.perception * 0.6,
        lockpickingSkill: this.stats.perception * 0.7,
      },

      dualWielding:
        upgradeLevel >= 7
          ? {
              enabled: true,
              attackBonus: 1.5,
              accuracyPenalty: 0.15,
              energyCost: 1.3,
            }
          : { enabled: false },

      powerStrike:
        upgradeLevel >= 10
          ? {
              enabled: true,
              damageMultiplier: 2.5,
              criticalChance: 0.4,
              cooldown: 15,
              energyCost: 25,
            }
          : { enabled: false },
    };
  }

  public getOptimalUsageScenarios(): string[] {
    const scenarios = [
      "melee_combat",
      "weapon_handling",
      "construction_tasks",
      "repair_operations",
      "precision_work",
    ];

    if (this.upgradeLevel >= 5) {
      scenarios.push("advanced_weapon_techniques", "complex_manipulations");
    }

    if (this.upgradeLevel >= 7) {
      scenarios.push("dual_wielding_combat", "simultaneous_operations");
    }

    if (this.upgradeLevel >= 10) {
      scenarios.push("power_strike_scenarios", "heavy_lifting");
    }

    if (this.rarity >= Rarity.LEGENDARY) {
      scenarios.push("master_craftsmanship", "surgical_precision");
    }

    return scenarios;
  }

  public getCompatibleSkeletonTypes(): string[] {
    return ["light", "balanced", "heavy", "modular"]; // All except flying for practical reasons
  }

  public getSynergyBonus(otherPart: IPart): number {
    // Arms synergize well with torso (for stability) and head (for coordination)
    if (otherPart.category === PartCategory.TORSO) {
      return 0.15; // 15% synergy bonus for core stability
    }

    if (otherPart.category === PartCategory.HEAD) {
      return 0.12; // 12% synergy bonus for hand-eye coordination
    }

    // Good synergy with other arms for dual-wielding
    if (otherPart.category === PartCategory.ARM && this.upgradeLevel >= 7) {
      return 0.2; // 20% synergy bonus for dual arms
    }

    return super.getSynergyBonus(otherPart);
  }

  public getPerformanceMetrics(): { [key: string]: number } {
    const baseMetrics = super.getPerformanceMetrics();
    const capabilities = this.getSpecializedCapabilities();

    return {
      ...baseMetrics,
      combatEffectiveness: capabilities.combatTechniques.punchDamage / 100,
      weaponHandling: capabilities.weaponMastery.meleeProficiency,
      dexterity: capabilities.toolOperations.repairEfficiency,
      coordination: 0.7 + this.upgradeLevel * 0.03,
    };
  }

  /**
   * Calculate weapon damage bonus for different weapon types
   */
  public calculateWeaponDamage(
    weaponType: "melee" | "ranged" | "heavy" | "precision"
  ): {
    damageMultiplier: number;
    accuracyBonus: number;
    speedPenalty: number;
  } {
    const capabilities = this.getSpecializedCapabilities();

    switch (weaponType) {
      case "melee":
        return {
          damageMultiplier: capabilities.weaponMastery.meleeProficiency,
          accuracyBonus: 0.9,
          speedPenalty: 0,
        };

      case "ranged":
        return {
          damageMultiplier: capabilities.weaponMastery.rangedAccuracy * 0.9,
          accuracyBonus: capabilities.weaponMastery.rangedAccuracy,
          speedPenalty: 0.1,
        };

      case "heavy":
        return {
          damageMultiplier: capabilities.weaponMastery.meleeProficiency * 1.2,
          accuracyBonus: 0.7,
          speedPenalty: 0.3,
        };

      case "precision":
        return {
          damageMultiplier: capabilities.weaponMastery.rangedAccuracy * 0.8,
          accuracyBonus: capabilities.weaponMastery.rangedAccuracy * 1.3,
          speedPenalty: 0.2,
        };

      default:
        return { damageMultiplier: 1.0, accuracyBonus: 1.0, speedPenalty: 0 };
    }
  }

  /**
   * Check if dual wielding is available and effective
   */
  public canDualWield(secondArm: ArmPart): {
    capable: boolean;
    effectiveness: number;
    requirements: string[];
  } {
    const capabilities = this.getSpecializedCapabilities();
    const requirements: string[] = [];

    if (!capabilities.dualWielding.enabled) {
      requirements.push("Upgrade to level 7 or higher");
    }

    if (Math.abs(this.upgradeLevel - secondArm.upgradeLevel) > 3) {
      requirements.push("Arms should have similar upgrade levels");
    }

    const capable =
      capabilities.dualWielding.enabled && requirements.length === 0;
    const effectiveness = capable
      ? capabilities.dualWielding.attackBonus -
        capabilities.dualWielding.accuracyPenalty
      : 0;

    return { capable, effectiveness, requirements };
  }

  /**
   * Perform a power strike attack
   */
  public performPowerStrike(target: { defense: number }): {
    damage: number;
    critical: boolean;
    energyUsed: number;
    cooldownTime: number;
  } {
    const capabilities = this.getSpecializedCapabilities();

    if (!capabilities.powerStrike.enabled) {
      return { damage: 0, critical: false, energyUsed: 0, cooldownTime: 0 };
    }

    const baseDamage = this.getEffectiveStats().attack;
    const damage = Math.floor(
      baseDamage *
        capabilities.powerStrike.damageMultiplier *
        Math.max(0.5, 1 - target.defense / (baseDamage * 2))
    );

    const critical = Math.random() < capabilities.powerStrike.criticalChance;
    const finalDamage = critical ? damage * 1.5 : damage;

    return {
      damage: Math.floor(finalDamage),
      critical,
      energyUsed: capabilities.powerStrike.energyCost,
      cooldownTime: capabilities.powerStrike.cooldown,
    };
  }

  /**
   * Calculate tool operation efficiency
   */
  public calculateToolEfficiency(
    toolType: "repair" | "construction" | "hacking" | "lockpicking"
  ): {
    speedBonus: number;
    qualityBonus: number;
    energyEfficiency: number;
  } {
    const capabilities = this.getSpecializedCapabilities();
    const tools = capabilities.toolOperations;

    switch (toolType) {
      case "repair":
        return {
          speedBonus: tools.repairEfficiency,
          qualityBonus: tools.repairEfficiency * 0.8,
          energyEfficiency: 1.2,
        };

      case "construction":
        return {
          speedBonus: tools.constructionSpeed,
          qualityBonus: tools.constructionSpeed * 0.9,
          energyEfficiency: 1.1,
        };

      case "hacking":
        return {
          speedBonus: tools.hackingCapability / 50,
          qualityBonus: tools.hackingCapability / 40,
          energyEfficiency: 1.0,
        };

      case "lockpicking":
        return {
          speedBonus: tools.lockpickingSkill / 50,
          qualityBonus: tools.lockpickingSkill / 30,
          energyEfficiency: 1.1,
        };

      default:
        return { speedBonus: 1.0, qualityBonus: 1.0, energyEfficiency: 1.0 };
    }
  }

  /**
   * Get recommended weapons for this arm configuration
   */
  public getRecommendedWeapons(): {
    primary: string[];
    secondary: string[];
    avoid: string[];
  } {
    const capabilities = this.getSpecializedCapabilities();

    const recommendations = {
      primary: ["swords", "axes", "hammers", "pistols", "rifles"],
      secondary: ["knives", "tools", "grenades"],
      avoid: ["extremely_heavy_weapons"],
    };

    if (capabilities.weaponMastery.meleeProficiency > 1.5) {
      recommendations.primary.push("advanced_melee_weapons", "exotic_blades");
    }

    if (capabilities.weaponMastery.rangedAccuracy > 1.3) {
      recommendations.primary.push("precision_rifles", "energy_weapons");
    }

    if (capabilities.dualWielding.enabled) {
      recommendations.primary.push("dual_swords", "twin_pistols");
    }

    if (this.rarity >= Rarity.LEGENDARY) {
      recommendations.primary.push("legendary_artifacts", "plasma_weapons");
    }

    return recommendations;
  }

  /**
   * Calculate optimal upgrade path for arm specialization
   */
  public getOptimalUpgradePath(): {
    nextUpgrade: number;
    reasoning: string;
    expectedImprovement: string;
  } {
    if (this.upgradeLevel < 7) {
      return {
        nextUpgrade: 7,
        reasoning: "Unlock dual wielding capabilities",
        expectedImprovement:
          "Access to dual weapon combat with 50% attack bonus",
      };
    }

    if (this.upgradeLevel < 10) {
      return {
        nextUpgrade: 10,
        reasoning: "Unlock power strike for maximum damage output",
        expectedImprovement:
          "2.5x damage power attacks with high critical chance",
      };
    }

    if (this.upgradeLevel < this.getMaxUpgradeLevel()) {
      return {
        nextUpgrade: Math.min(this.upgradeLevel + 2, this.getMaxUpgradeLevel()),
        reasoning: "Enhance weapon proficiency and manipulation speed",
        expectedImprovement: `${((this.upgradeLevel + 2) * 0.1 * 100).toFixed(1)}% additional weapon proficiency`,
      };
    }

    return {
      nextUpgrade: this.upgradeLevel,
      reasoning: "Already at maximum upgrade level",
      expectedImprovement:
        "Consider legendary weapon attachments or cybernetic enhancements",
    };
  }
}
