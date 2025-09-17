import { Rarity, ExpansionChipEffect } from "../types";
import { BaseExpansionChip } from "./base-expansion-chip";
import { EffectApplication, IExpansionChip } from "./expansion-chip-interface";

/**
 * DefenseBuffChip - Enhances defensive capabilities and damage mitigation
 */
export class DefenseBuffChip extends BaseExpansionChip {
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
      ExpansionChipEffect.DEFENSE_BUFF,
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
      description: `Increases defense by ${(magnitude * 100).toFixed(1)}%`,
      applicableStats: ["defense"],
    };
  }

  public getAdvancedEffects(): { [key: string]: any } {
    const magnitude = this.getEffectMagnitude();
    return {
      damageReduction: magnitude * 0.8, // 80% of defense bonus as flat damage reduction
      shieldStrength: magnitude * 1.2, // 120% bonus to shield effectiveness
      armorPenetrationResistance: magnitude * 0.6, // 60% resistance to armor penetration
      reflectiveDamage: magnitude * 0.15, // 15% chance to reflect damage
      adaptiveArmor: magnitude * 0.4, // 40% bonus that adapts to damage types
      fortressMode:
        this.upgradeLevel >= 6
          ? {
              enabled: true,
              defenseMultiplier: 2.5,
              duration: 20,
              cooldown: 90,
              movementPenalty: 0.8, // 80% reduced movement
            }
          : { enabled: false },
    };
  }

  public getOptimalUsageScenarios(): string[] {
    const scenarios = [
      "tank_builds",
      "prolonged_combat",
      "survival_scenarios",
      "team_protection_roles",
      "area_denial",
    ];

    if (this.upgradeLevel >= 3) {
      scenarios.push("boss_tanking", "damage_mitigation_specialist");
    }

    if (this.upgradeLevel >= 6) {
      scenarios.push("fortress_defender", "chokepoint_control");
    }

    if (this.rarity === Rarity.LEGENDARY || this.rarity === Rarity.PROTOTYPE) {
      scenarios.push("elite_tank_operations", "damage_immunity_builds");
    }

    return scenarios;
  }

  public getCompatibleSkeletonTypes(): string[] {
    return ["balanced", "heavy", "modular"]; // Defensive focus, less compatible with light/flying
  }

  public getSynergyBonus(otherChip: IExpansionChip): number {
    // Defense buffs synergize well with energy efficiency and resistance
    if (otherChip.effect === ExpansionChipEffect.ENERGY_EFFICIENCY) {
      return 0.12; // 12% synergy bonus for defense + energy efficiency
    }

    if (otherChip.effect === ExpansionChipEffect.RESISTANCE) {
      return 0.18; // 18% synergy bonus for defense + resistance
    }

    // Good synergy with stat boosts
    if (otherChip.effect === ExpansionChipEffect.STAT_BOOST) {
      return 0.1; // 10% synergy bonus
    }

    // Minor synergy with AI upgrades for tactical defense
    if (otherChip.effect === ExpansionChipEffect.AI_UPGRADE) {
      return 0.06; // 6% synergy bonus
    }

    return super.getSynergyBonus(otherChip);
  }

  public conflictsWith(otherChip: IExpansionChip): boolean {
    // Defense buffs might conflict with speed at very high levels
    if (
      otherChip.effect === ExpansionChipEffect.SPEED_BUFF &&
      this.upgradeLevel >= 7
    ) {
      return true; // Heavy defense reduces mobility
    }

    return super.conflictsWith(otherChip);
  }

  public getPerformanceMetrics(): { [key: string]: number } {
    const baseMetrics = super.getPerformanceMetrics();
    const magnitude = this.getEffectMagnitude();

    return {
      ...baseMetrics,
      defensivePower: magnitude * 1.3,
      survivability: magnitude * 1.4,
      damageAbsorption: 0.7 + this.upgradeLevel * 0.04,
      strategicValue: magnitude * 1.1,
    };
  }

  /**
   * Apply defense buff effect to a target
   */
  public applyEffect(
    target: any,
    duration: number = 60,
    conditions: { [key: string]: any } = {}
  ): EffectApplication {
    const magnitude = this.getEffectMagnitude();
    const energyCost = this.getEnergyCost();
    const advancedEffects = this.getAdvancedEffects();

    // Check if fortress mode is triggered
    const isFortressMode =
      conditions.underHeavyFire && advancedEffects.fortressMode.enabled;
    const finalMagnitude = isFortressMode
      ? magnitude * advancedEffects.fortressMode.defenseMultiplier
      : magnitude;

    const sideEffects: string[] = [];
    if (isFortressMode) {
      sideEffects.push("fortress_mode_active", "movement_severely_reduced");
    }
    if (magnitude > 0.25) {
      sideEffects.push("slight_speed_reduction");
    }

    return {
      success: true,
      appliedMagnitude: finalMagnitude,
      duration: isFortressMode
        ? advancedEffects.fortressMode.duration
        : duration,
      energyCost: isFortressMode ? energyCost * 1.3 : energyCost,
      side_effects: sideEffects,
    };
  }

  /**
   * Calculate damage reduction for specific damage types
   */
  public calculateDamageReduction(
    damageType: "physical" | "energy" | "explosive" | "piercing"
  ): number {
    const baseMagnitude = this.getEffectMagnitude();
    const advancedEffects = this.getAdvancedEffects();

    switch (damageType) {
      case "physical":
        return baseMagnitude + advancedEffects.damageReduction;
      case "energy":
        return baseMagnitude * 0.8 + advancedEffects.adaptiveArmor;
      case "explosive":
        return baseMagnitude * 1.2; // Better against explosive damage
      case "piercing":
        return baseMagnitude * 0.6 + advancedEffects.armorPenetrationResistance;
      default:
        return baseMagnitude;
    }
  }

  /**
   * Check if fortress mode can be activated
   */
  public canActivateFortressMode(
    incomingDamageRate: number,
    thresholdMultiplier: number = 1.0
  ): boolean {
    const advancedEffects = this.getAdvancedEffects();
    const activationThreshold = 50 * thresholdMultiplier; // Base threshold for incoming damage per second

    return (
      advancedEffects.fortressMode.enabled &&
      incomingDamageRate >= activationThreshold
    );
  }

  /**
   * Calculate shield effectiveness bonus
   */
  public calculateShieldBonus(baseShieldStrength: number): {
    enhancedStrength: number;
    rechargeRate: number;
    efficiency: number;
  } {
    const advancedEffects = this.getAdvancedEffects();
    const shieldBonus = advancedEffects.shieldStrength;

    return {
      enhancedStrength: baseShieldStrength * (1 + shieldBonus),
      rechargeRate: 1 + shieldBonus * 0.5, // 50% of shield bonus applies to recharge rate
      efficiency: 1 + shieldBonus * 0.3, // 30% energy efficiency bonus for shields
    };
  }

  /**
   * Get armor type recommendations
   */
  public getRecommendedArmorTypes(): {
    primary: string[];
    secondary: string[];
    avoid: string[];
  } {
    const magnitude = this.getEffectMagnitude();

    const recommendations = {
      primary: ["heavy_armor", "composite_plating", "reactive_armor"],
      secondary: ["shield_generators", "deflector_arrays", "ablative_coating"],
      avoid: ["lightweight_armor", "stealth_coating"],
    };

    if (magnitude > 0.2) {
      recommendations.primary.push("power_armor", "adaptive_plating");
    }

    if (this.upgradeLevel >= 6) {
      recommendations.primary.push("fortress_grade_armor", "siege_protection");
    }

    return recommendations;
  }

  /**
   * Calculate reflective damage chance and amount
   */
  public calculateReflectiveDamage(incomingDamage: number): {
    willReflect: boolean;
    reflectedAmount: number;
    reflectionType: string;
  } {
    const advancedEffects = this.getAdvancedEffects();
    const reflectChance = advancedEffects.reflectiveDamage;

    const willReflect = Math.random() < reflectChance;
    const reflectedAmount = willReflect ? incomingDamage * 0.3 : 0; // Reflect 30% of damage

    return {
      willReflect,
      reflectedAmount,
      reflectionType: willReflect ? "kinetic_feedback" : "none",
    };
  }

  /**
   * Get optimal positioning recommendations
   */
  public getPositioningRecommendations(battleContext: {
    enemyCount: number;
    allyCount: number;
    terrainType: string;
  }): {
    position: string;
    tactics: string[];
    priorityTargets: string[];
  } {
    const recommendations = {
      position: "front_line",
      tactics: ["damage_absorption", "ally_protection"],
      priorityTargets: ["high_damage_dealers", "area_effect_enemies"],
    };

    if (battleContext.enemyCount > battleContext.allyCount) {
      recommendations.position = "chokepoint_control";
      recommendations.tactics.push("area_denial", "defensive_positioning");
    }

    if (this.upgradeLevel >= 6) {
      recommendations.tactics.push("fortress_mode_deployment");
      recommendations.position = "strategic_strongpoint";
    }

    return recommendations;
  }

  /**
   * Calculate optimal upgrade path for defense specialization
   */
  public getOptimalUpgradePath(): {
    nextUpgrade: number;
    reasoning: string;
    expectedImprovement: string;
  } {
    if (this.upgradeLevel < 6) {
      return {
        nextUpgrade: 6,
        reasoning: "Unlock fortress mode for maximum defensive capability",
        expectedImprovement:
          "2.5x defense multiplier during heavy combat situations",
      };
    }

    if (this.upgradeLevel < this.getMaxUpgradeLevel()) {
      return {
        nextUpgrade: Math.min(this.upgradeLevel + 2, this.getMaxUpgradeLevel()),
        reasoning: "Increase damage reduction and defensive effectiveness",
        expectedImprovement: `${((this.upgradeLevel + 2) * 0.02 * 100).toFixed(1)}% additional defense bonus`,
      };
    }

    return {
      nextUpgrade: this.upgradeLevel,
      reasoning: "Already at maximum upgrade level",
      expectedImprovement: "Consider synergistic chips for hybrid tank builds",
    };
  }
}
