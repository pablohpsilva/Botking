import { Rarity, ExpansionChipEffect } from "../types";
import { BaseExpansionChip } from "./base-expansion-chip";
import { EffectApplication, IExpansionChip } from "./expansion-chip-interface";

/**
 * SpeedBuffChip - Enhances movement speed and agility
 */
export class SpeedBuffChip extends BaseExpansionChip {
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
      ExpansionChipEffect.SPEED_BUFF,
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
      description: `Increases speed by ${(magnitude * 100).toFixed(1)}%`,
      applicableStats: ["speed"],
    };
  }

  public getAdvancedEffects(): { [key: string]: any } {
    const magnitude = this.getEffectMagnitude();
    return {
      accelerationBonus: magnitude * 1.5, // 150% bonus to acceleration
      evasionChance: magnitude * 0.4, // 40% of speed bonus as evasion chance
      reactionTime: magnitude * 0.8, // 80% improvement in reaction time
      staminaEfficiency: magnitude * 0.6, // 60% less stamina consumption
      dashAbility: magnitude * 0.3, // 30% bonus to dash distance/frequency
      timeDialation:
        this.upgradeLevel >= 8
          ? {
              enabled: true,
              slowMotionFactor: 0.3, // Time appears 70% slower
              duration: 5,
              cooldown: 45,
            }
          : { enabled: false },
    };
  }

  public getOptimalUsageScenarios(): string[] {
    const scenarios = [
      "hit_and_run_tactics",
      "reconnaissance_missions",
      "evasive_maneuvers",
      "quick_strikes",
      "pursuit_scenarios",
    ];

    if (this.upgradeLevel >= 4) {
      scenarios.push("speed_blitz_attacks", "flanking_maneuvers");
    }

    if (this.upgradeLevel >= 8) {
      scenarios.push("bullet_time_combat", "precision_timing_missions");
    }

    if (this.rarity === Rarity.LEGENDARY || this.rarity === Rarity.PROTOTYPE) {
      scenarios.push("supersonic_operations", "time_critical_missions");
    }

    return scenarios;
  }

  public getCompatibleSkeletonTypes(): string[] {
    return ["light", "balanced", "flying", "modular"]; // Best with mobile skeletons
  }

  public getSynergyBonus(otherChip: IExpansionChip): number {
    // Speed buffs synergize excellently with attack and AI upgrades
    if (otherChip.effect === ExpansionChipEffect.ATTACK_BUFF) {
      return 0.15; // 15% synergy bonus for speed + attack
    }

    if (otherChip.effect === ExpansionChipEffect.AI_UPGRADE) {
      return 0.12; // 12% synergy bonus for speed + AI (better reflexes)
    }

    // Good synergy with energy efficiency
    if (otherChip.effect === ExpansionChipEffect.ENERGY_EFFICIENCY) {
      return 0.1; // 10% synergy bonus
    }

    return super.getSynergyBonus(otherChip);
  }

  public conflictsWith(otherChip: IExpansionChip): boolean {
    // Speed buffs conflict with high-level defense buffs
    if (
      otherChip.effect === ExpansionChipEffect.DEFENSE_BUFF &&
      otherChip.upgradeLevel >= 7
    ) {
      return true; // Heavy defense impedes speed
    }

    return super.conflictsWith(otherChip);
  }

  public getPerformanceMetrics(): { [key: string]: number } {
    const baseMetrics = super.getPerformanceMetrics();
    const magnitude = this.getEffectMagnitude();

    return {
      ...baseMetrics,
      mobility: magnitude * 1.4,
      agility: magnitude * 1.3,
      tacticalAdvantage: magnitude * 1.2,
      survivalRating: magnitude * 1.1,
    };
  }

  /**
   * Apply speed buff effect to a target
   */
  public applyEffect(
    target: any,
    duration: number = 60,
    conditions: { [key: string]: any } = {}
  ): EffectApplication {
    const magnitude = this.getEffectMagnitude();
    const energyCost = this.getEnergyCost();
    const advancedEffects = this.getAdvancedEffects();

    // Check if time dilation is triggered
    const isTimeDilation =
      conditions.precisionMode && advancedEffects.timeDialation.enabled;
    const finalMagnitude = isTimeDilation
      ? magnitude * 2.0 // Double effectiveness in time dilation
      : magnitude;

    const sideEffects: string[] = [];
    if (isTimeDilation) {
      sideEffects.push("time_dilation_active", "enhanced_perception");
    }
    if (magnitude > 0.3) {
      sideEffects.push("increased_stamina_drain");
    }

    return {
      success: true,
      appliedMagnitude: finalMagnitude,
      duration: isTimeDilation
        ? advancedEffects.timeDialation.duration
        : duration,
      energyCost: isTimeDilation ? energyCost * 2.0 : energyCost,
      side_effects: sideEffects,
    };
  }

  /**
   * Calculate movement bonuses for different movement types
   */
  public calculateMovementBonus(
    movementType: "walking" | "running" | "sprinting" | "dashing"
  ): {
    speedMultiplier: number;
    energyEfficiency: number;
    distance: number;
  } {
    const magnitude = this.getEffectMagnitude();
    const advancedEffects = this.getAdvancedEffects();

    const baseMultiplier = 1 + magnitude;
    const baseEfficiency = 1 + advancedEffects.staminaEfficiency;

    switch (movementType) {
      case "walking":
        return {
          speedMultiplier: baseMultiplier,
          energyEfficiency: baseEfficiency * 1.2,
          distance: 1.0,
        };
      case "running":
        return {
          speedMultiplier: baseMultiplier * 1.1,
          energyEfficiency: baseEfficiency,
          distance: 1.0,
        };
      case "sprinting":
        return {
          speedMultiplier: baseMultiplier * 1.3,
          energyEfficiency: baseEfficiency * 0.8,
          distance: 1.0,
        };
      case "dashing":
        return {
          speedMultiplier: baseMultiplier * 2.0,
          energyEfficiency: baseEfficiency * 0.6,
          distance: 1 + advancedEffects.dashAbility,
        };
      default:
        return {
          speedMultiplier: baseMultiplier,
          energyEfficiency: baseEfficiency,
          distance: 1.0,
        };
    }
  }

  /**
   * Check if time dilation can be activated
   */
  public canActivateTimeDilation(focusLevel: number): boolean {
    const advancedEffects = this.getAdvancedEffects();
    return advancedEffects.timeDialation.enabled && focusLevel >= 0.8; // Requires 80% focus
  }

  /**
   * Calculate evasion effectiveness
   */
  public calculateEvasionBonus(
    attackType: "projectile" | "melee" | "area_effect"
  ): number {
    const advancedEffects = this.getAdvancedEffects();
    const baseEvasion = advancedEffects.evasionChance;

    switch (attackType) {
      case "projectile":
        return baseEvasion * 1.2; // 20% better against projectiles
      case "melee":
        return baseEvasion * 0.8; // 20% less effective against melee
      case "area_effect":
        return baseEvasion * 1.5; // 50% better at escaping AOE
      default:
        return baseEvasion;
    }
  }

  /**
   * Get optimal movement patterns for different scenarios
   */
  public getMovementPatterns(
    scenario: "combat" | "stealth" | "pursuit" | "escape"
  ): {
    pattern: string;
    techniques: string[];
    energyConsumption: number;
  } {
    const magnitude = this.getEffectMagnitude();

    const patterns = {
      combat: {
        pattern: "unpredictable_weaving",
        techniques: ["strafe_running", "quick_stops", "direction_changes"],
        energyConsumption: 1.2,
      },
      stealth: {
        pattern: "controlled_movement",
        techniques: ["silent_steps", "minimal_acceleration", "cover_to_cover"],
        energyConsumption: 0.8,
      },
      pursuit: {
        pattern: "sustained_sprint",
        techniques: [
          "efficient_gait",
          "momentum_conservation",
          "optimal_pathing",
        ],
        energyConsumption: 1.0,
      },
      escape: {
        pattern: "maximum_acceleration",
        techniques: [
          "burst_sprints",
          "evasive_maneuvers",
          "obstacle_utilization",
        ],
        energyConsumption: 1.5,
      },
    };

    const pattern = patterns[scenario];

    if (magnitude > 0.25) {
      pattern.techniques.push("advanced_maneuvers");
    }

    if (this.upgradeLevel >= 8) {
      pattern.techniques.push("time_dilation_integration");
    }

    return pattern;
  }

  /**
   * Calculate optimal upgrade path for speed specialization
   */
  public getOptimalUpgradePath(): {
    nextUpgrade: number;
    reasoning: string;
    expectedImprovement: string;
  } {
    if (this.upgradeLevel < 8) {
      return {
        nextUpgrade: 8,
        reasoning: "Unlock time dilation for tactical advantage",
        expectedImprovement:
          "Access to bullet-time mode for precise timing and evasion",
      };
    }

    if (this.upgradeLevel < this.getMaxUpgradeLevel()) {
      return {
        nextUpgrade: Math.min(this.upgradeLevel + 2, this.getMaxUpgradeLevel()),
        reasoning: "Maximize speed and agility bonuses",
        expectedImprovement: `${((this.upgradeLevel + 2) * 0.02 * 100).toFixed(1)}% additional speed bonus`,
      };
    }

    return {
      nextUpgrade: this.upgradeLevel,
      reasoning: "Already at maximum upgrade level",
      expectedImprovement: "Consider synergistic chips for hit-and-run builds",
    };
  }

  /**
   * Get speed equipment recommendations
   */
  public getRecommendedEquipment(): {
    primary: string[];
    secondary: string[];
    avoid: string[];
  } {
    const magnitude = this.getEffectMagnitude();

    const recommendations = {
      primary: ["lightweight_armor", "speed_boosters", "agility_enhancers"],
      secondary: ["dash_modules", "momentum_converters", "friction_reducers"],
      avoid: ["heavy_armor", "bulky_equipment", "movement_restrictors"],
    };

    if (magnitude > 0.2) {
      recommendations.primary.push("velocity_amplifiers", "inertia_dampeners");
    }

    if (this.upgradeLevel >= 8) {
      recommendations.primary.push(
        "time_field_generators",
        "quantum_accelerators"
      );
    }

    return recommendations;
  }
}
