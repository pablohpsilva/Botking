import { Rarity, ExpansionChipEffect } from "../types";
import { BaseExpansionChip } from "./base-expansion-chip";
import { EffectApplication, IExpansionChip } from "./expansion-chip-interface";

/**
 * AttackBuffChip - Enhances offensive capabilities and damage output
 */
export class AttackBuffChip extends BaseExpansionChip {
  constructor(
    id: string,
    name: string,
    rarity: Rarity,
    description: string,
    upgradeLevel: number = 0
  ) {
    super(
      id,
      name,
      ExpansionChipEffect.ATTACK_BUFF,
      rarity,
      description,
      upgradeLevel
    );
  }

  public getEffectDetails(): {
    type: string;
    magnitude: number;
    description: string;
    applicableStats: string[];
  } {
    const magnitude = this.getEffectMagnitude();
    return {
      type: "multiplicative",
      magnitude,
      description: `Increases attack power by ${(magnitude * 100).toFixed(1)}%`,
      applicableStats: ["attack"],
    };
  }

  public getAdvancedEffects(): { [key: string]: any } {
    const magnitude = this.getEffectMagnitude();
    return {
      criticalHitChance: magnitude * 0.3, // 30% of attack bonus applies to crit chance
      weaponProficiency: magnitude * 0.5, // 50% bonus to weapon handling
      damagePenetration: magnitude * 0.2, // 20% armor penetration bonus
      chargeAttackBonus: magnitude * 1.5, // 150% bonus for charge attacks
      comboMultiplier: 1 + magnitude * 0.4, // 40% combo damage multiplier
      berserkerMode:
        this.upgradeLevel >= 5
          ? {
              enabled: true,
              damageBonus: magnitude * 2.0,
              duration: 15,
              cooldown: 60,
            }
          : { enabled: false },
    };
  }

  public getOptimalUsageScenarios(): string[] {
    const scenarios = [
      "high_damage_builds",
      "dps_focused_combat",
      "boss_battles",
      "quick_elimination_tactics",
    ];

    if (this.upgradeLevel >= 3) {
      scenarios.push("extended_combat_scenarios");
    }

    if (this.upgradeLevel >= 7) {
      scenarios.push("siege_operations", "heavy_armor_penetration");
    }

    if (this.rarity === Rarity.LEGENDARY || this.rarity === Rarity.PROTOTYPE) {
      scenarios.push("elite_enemy_encounters", "raid_boss_fights");
    }

    return scenarios;
  }

  public getCompatibleSkeletonTypes(): string[] {
    return ["light", "balanced", "heavy", "modular"]; // All except flying (focused on melee/close combat)
  }

  public getSynergyBonus(otherChip: IExpansionChip): number {
    // Attack buffs synergize well with speed and AI upgrades
    if (otherChip.effect === ExpansionChipEffect.SPEED_BUFF) {
      return 0.15; // 15% synergy bonus for speed + attack
    }

    if (otherChip.effect === ExpansionChipEffect.AI_UPGRADE) {
      return 0.1; // 10% synergy bonus for AI + attack (better targeting)
    }

    // Slight synergy with stat boosts
    if (otherChip.effect === ExpansionChipEffect.STAT_BOOST) {
      return 0.08; // 8% synergy bonus
    }

    return super.getSynergyBonus(otherChip);
  }

  public conflictsWith(otherChip: IExpansionChip): boolean {
    // Attack buffs might conflict with energy efficiency at very high levels
    if (
      otherChip.effect === ExpansionChipEffect.ENERGY_EFFICIENCY &&
      this.upgradeLevel >= 8
    ) {
      return true; // High-level attack buffs consume too much energy
    }

    return super.conflictsWith(otherChip);
  }

  public getPerformanceMetrics(): { [key: string]: number } {
    const baseMetrics = super.getPerformanceMetrics();
    const magnitude = this.getEffectMagnitude();

    return {
      ...baseMetrics,
      offensivePower: magnitude * 1.2,
      combatEffectiveness: magnitude * 1.1,
      weaponMastery: 0.6 + this.upgradeLevel * 0.05,
      tacticalAdvantage: magnitude * 0.8,
    };
  }

  /**
   * Apply attack buff effect to a target
   */
  public applyEffect(
    target: any,
    duration: number = 60,
    conditions: { [key: string]: any } = {}
  ): EffectApplication {
    const magnitude = this.getEffectMagnitude();
    const energyCost = this.getEnergyCost();
    const advancedEffects = this.getAdvancedEffects();

    // Check if berserker mode is triggered
    const isBerserkerMode =
      conditions.lowHealth && advancedEffects.berserkerMode.enabled;
    const finalMagnitude = isBerserkerMode
      ? magnitude * advancedEffects.berserkerMode.damageBonus
      : magnitude;

    const sideEffects: string[] = [];
    if (isBerserkerMode) {
      sideEffects.push("berserker_mode_active");
    }
    if (magnitude > 0.3) {
      sideEffects.push("increased_energy_consumption");
    }

    return {
      success: true,
      appliedMagnitude: finalMagnitude,
      duration: isBerserkerMode
        ? advancedEffects.berserkerMode.duration
        : duration,
      energyCost: isBerserkerMode ? energyCost * 1.5 : energyCost,
      side_effects: sideEffects,
    };
  }

  /**
   * Calculate damage bonus for specific attack types
   */
  public calculateAttackTypeBonus(
    attackType: "melee" | "ranged" | "charge" | "combo"
  ): number {
    const baseMagnitude = this.getEffectMagnitude();
    const advancedEffects = this.getAdvancedEffects();

    switch (attackType) {
      case "melee":
        return baseMagnitude;
      case "ranged":
        return baseMagnitude * 0.8; // 20% less effective for ranged
      case "charge":
        return baseMagnitude * advancedEffects.chargeAttackBonus;
      case "combo":
        return baseMagnitude * advancedEffects.comboMultiplier;
      default:
        return baseMagnitude;
    }
  }

  /**
   * Check if berserker mode is available and can be activated
   */
  public canActivateBerserkerMode(
    currentHealth: number,
    maxHealth: number
  ): boolean {
    const advancedEffects = this.getAdvancedEffects();
    return (
      advancedEffects.berserkerMode.enabled && currentHealth / maxHealth <= 0.3
    ); // Activates at 30% health or below
  }

  /**
   * Get weapon type recommendations based on this chip's bonuses
   */
  public getRecommendedWeaponTypes(): {
    primary: string[];
    secondary: string[];
    avoid: string[];
  } {
    const magnitude = this.getEffectMagnitude();

    const recommendations = {
      primary: ["assault_rifles", "shotguns", "melee_weapons"],
      secondary: ["pistols", "knives", "grenades"],
      avoid: ["support_tools", "defensive_equipment"],
    };

    if (magnitude > 0.2) {
      recommendations.primary.push("heavy_weapons", "explosive_weapons");
    }

    if (this.upgradeLevel >= 5) {
      recommendations.primary.push("experimental_weapons", "energy_weapons");
    }

    return recommendations;
  }

  /**
   * Calculate optimal upgrade path for maximum effectiveness
   */
  public getOptimalUpgradePath(): {
    nextUpgrade: number;
    reasoning: string;
    expectedImprovement: string;
  } {
    if (this.upgradeLevel < 5) {
      return {
        nextUpgrade: 5,
        reasoning: "Unlock berserker mode for emergency situations",
        expectedImprovement:
          "Access to powerful damage boost when at low health",
      };
    }

    if (this.upgradeLevel < this.getMaxUpgradeLevel()) {
      return {
        nextUpgrade: Math.min(this.upgradeLevel + 2, this.getMaxUpgradeLevel()),
        reasoning: "Increase base damage output and effect magnitude",
        expectedImprovement: `${((this.upgradeLevel + 2) * 0.02 * 100).toFixed(1)}% additional damage bonus`,
      };
    }

    return {
      nextUpgrade: this.upgradeLevel,
      reasoning: "Already at maximum upgrade level",
      expectedImprovement: "Consider synergistic chips or rarity upgrades",
    };
  }
}
