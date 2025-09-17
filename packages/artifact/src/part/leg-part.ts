import { Rarity, PartCategory, CombatStats, Ability } from "../types";
import { BasePart } from "./base-part";
import { IPart } from "./part-interface";

/**
 * LegPart - Specialized for mobility, stability, and traversal capabilities
 */
export class LegPart extends BasePart {
  constructor(
    id: string,
    rarity: Rarity,
    name: string,
    stats: CombatStats,
    abilities: Ability[] = [],
    upgradeLevel: number = 0
  ) {
    super(id, PartCategory.LEG, rarity, name, stats, abilities, upgradeLevel);
  }

  public getCategoryBonuses(): { [key: string]: number } {
    return {
      speedBonus: 1.3,
      stabilityBonus: 1.1,
      jumpBonus: 1.2,
      kickPower: 1.25,
      terrainAdaptation: 1.15,
    };
  }

  public getSpecializedCapabilities(): { [key: string]: any } {
    const bonuses = this.getCategoryBonuses();
    const upgradeLevel = this.upgradeLevel;

    return {
      locomotion: {
        maxSpeed: this.stats.speed * bonuses.speedBonus + upgradeLevel * 5,
        acceleration: 1 + upgradeLevel * 0.1,
        agility: bonuses.speedBonus + upgradeLevel * 0.05,
        endurance: 1 + upgradeLevel * 0.08,
      },

      jumpingAbilities: {
        jumpHeight: bonuses.jumpBonus + upgradeLevel * 0.1,
        jumpDistance: bonuses.jumpBonus * 1.2 + upgradeLevel * 0.12,
        doubleJump: upgradeLevel >= 6,
        wallJump: upgradeLevel >= 8,
        jumpKickDamage: this.stats.attack * bonuses.kickPower,
      },

      stability: {
        balanceRating: bonuses.stabilityBonus + upgradeLevel * 0.05,
        knockdownResistance: 0.5 + upgradeLevel * 0.04,
        groundingForce: this.stats.defense * bonuses.stabilityBonus,
        recoilCompensation: 1 + upgradeLevel * 0.03,
      },

      terrainMastery: {
        roughTerrainSpeed: bonuses.terrainAdaptation + upgradeLevel * 0.03,
        climbingAbility: 0.7 + upgradeLevel * 0.04,
        swimmingSpeed: 0.6 + upgradeLevel * 0.02,
        slipperyResistance: 0.8 + upgradeLevel * 0.02,
      },

      turboBoost:
        upgradeLevel >= 9
          ? {
              enabled: true,
              speedMultiplier: 2.5,
              duration: 8,
              cooldown: 45,
              energyCost: 30,
            }
          : { enabled: false },

      earthShaker:
        upgradeLevel >= 12
          ? {
              enabled: true,
              aoeRadius: 5,
              stunDuration: 3,
              damage: this.stats.attack * 1.5,
              cooldown: 60,
            }
          : { enabled: false },
    };
  }

  public getOptimalUsageScenarios(): string[] {
    const scenarios = [
      "high_mobility_combat",
      "pursuit_missions",
      "escape_scenarios",
      "terrain_traversal",
      "parkour_movements",
    ];

    if (this.upgradeLevel >= 5) {
      scenarios.push("advanced_acrobatics", "wall_running");
    }

    if (this.upgradeLevel >= 6) {
      scenarios.push("double_jump_combat", "aerial_maneuvers");
    }

    if (this.upgradeLevel >= 9) {
      scenarios.push("turbo_boost_scenarios", "chase_sequences");
    }

    if (this.upgradeLevel >= 12) {
      scenarios.push("ground_slam_attacks", "area_control");
    }

    if (this.rarity >= Rarity.LEGENDARY) {
      scenarios.push("superhuman_athletics", "dimensional_jumping");
    }

    return scenarios;
  }

  public getCompatibleSkeletonTypes(): string[] {
    return ["light", "balanced", "heavy", "flying", "modular"]; // All skeleton types benefit
  }

  public getSynergyBonus(otherPart: IPart): number {
    // Legs synergize well with other legs for stability and speed
    if (otherPart.category === PartCategory.LEG) {
      return 0.18; // 18% synergy bonus for paired legs
    }

    // Good synergy with torso for core stability
    if (otherPart.category === PartCategory.TORSO) {
      return 0.12; // 12% synergy bonus for core support
    }

    // Minor synergy with head for balance and coordination
    if (otherPart.category === PartCategory.HEAD) {
      return 0.08; // 8% synergy bonus for spatial awareness
    }

    return super.getSynergyBonus(otherPart);
  }

  public getPerformanceMetrics(): { [key: string]: number } {
    const baseMetrics = super.getPerformanceMetrics();
    const capabilities = this.getSpecializedCapabilities();

    return {
      ...baseMetrics,
      mobilityRating: capabilities.locomotion.maxSpeed / 100,
      stabilityRating: capabilities.stability.balanceRating,
      agilityRating: capabilities.locomotion.agility,
      terrainAdaptation: capabilities.terrainMastery.roughTerrainSpeed,
    };
  }

  /**
   * Calculate movement speed for different movement types
   */
  public calculateMovementSpeed(
    movementType: "walking" | "running" | "sprinting" | "jumping"
  ): {
    speed: number;
    energyConsumption: number;
    stability: number;
  } {
    const capabilities = this.getSpecializedCapabilities();
    const baseSpeed = capabilities.locomotion.maxSpeed;

    switch (movementType) {
      case "walking":
        return {
          speed: baseSpeed * 0.4,
          energyConsumption: 0.5,
          stability: capabilities.stability.balanceRating,
        };

      case "running":
        return {
          speed: baseSpeed * 0.8,
          energyConsumption: 1.0,
          stability: capabilities.stability.balanceRating * 0.9,
        };

      case "sprinting":
        return {
          speed: baseSpeed,
          energyConsumption: 2.0,
          stability: capabilities.stability.balanceRating * 0.7,
        };

      case "jumping":
        return {
          speed: baseSpeed * 0.6,
          energyConsumption: 1.5,
          stability: capabilities.stability.balanceRating * 0.5,
        };

      default:
        return {
          speed: baseSpeed * 0.5,
          energyConsumption: 1.0,
          stability: 1.0,
        };
    }
  }

  /**
   * Perform a jump attack
   */
  public performJumpAttack(
    target: { defense: number },
    attackType: "kick" | "stomp" | "aerial"
  ): {
    damage: number;
    knockdown: boolean;
    energyUsed: number;
    accuracy: number;
  } {
    const capabilities = this.getSpecializedCapabilities();
    const jumping = capabilities.jumpingAbilities;

    let baseDamage = 0;
    let knockdownChance = 0;
    let energyCost = 10;
    let accuracy = 0.8;

    switch (attackType) {
      case "kick":
        baseDamage = jumping.jumpKickDamage;
        knockdownChance = 0.3;
        accuracy = 0.85;
        break;

      case "stomp":
        baseDamage = jumping.jumpKickDamage * 1.3;
        knockdownChance = 0.5;
        accuracy = 0.7;
        energyCost = 15;
        break;

      case "aerial":
        baseDamage = jumping.jumpKickDamage * 0.8;
        knockdownChance = 0.2;
        accuracy = 0.9;
        energyCost = 8;
        break;
    }

    const finalDamage = Math.floor(
      baseDamage * Math.max(0.3, 1 - target.defense / (baseDamage * 1.5))
    );

    const knockdown = Math.random() < knockdownChance;

    return {
      damage: finalDamage,
      knockdown,
      energyUsed: energyCost,
      accuracy,
    };
  }

  /**
   * Check if turbo boost is available
   */
  public canActivateTurboBoost(): {
    available: boolean;
    speedIncrease: number;
    duration: number;
    energyCost: number;
  } {
    const capabilities = this.getSpecializedCapabilities();
    const turbo = capabilities.turboBoost;

    return {
      available: turbo.enabled,
      speedIncrease: turbo.enabled ? turbo.speedMultiplier : 0,
      duration: turbo.enabled ? turbo.duration : 0,
      energyCost: turbo.enabled ? turbo.energyCost : 0,
    };
  }

  /**
   * Perform earth shaker attack
   */
  public performEarthShaker(): {
    damage: number;
    aoeRadius: number;
    stunDuration: number;
    affectedTargets: number;
    energyUsed: number;
  } {
    const capabilities = this.getSpecializedCapabilities();
    const earthShaker = capabilities.earthShaker;

    if (!earthShaker.enabled) {
      return {
        damage: 0,
        aoeRadius: 0,
        stunDuration: 0,
        affectedTargets: 0,
        energyUsed: 0,
      };
    }

    const estimatedTargets = Math.floor(
      (Math.PI * Math.pow(earthShaker.aoeRadius, 2)) / 10
    );

    return {
      damage: earthShaker.damage,
      aoeRadius: earthShaker.aoeRadius,
      stunDuration: earthShaker.stunDuration,
      affectedTargets: estimatedTargets,
      energyUsed: 40,
    };
  }

  /**
   * Calculate terrain traversal efficiency
   */
  public calculateTerrainTraversal(
    terrainType: "flat" | "rough" | "steep" | "slippery" | "water"
  ): {
    speedModifier: number;
    energyModifier: number;
    stabilityModifier: number;
    feasible: boolean;
  } {
    const capabilities = this.getSpecializedCapabilities();
    const terrain = capabilities.terrainMastery;

    switch (terrainType) {
      case "flat":
        return {
          speedModifier: 1.0,
          energyModifier: 1.0,
          stabilityModifier: 1.0,
          feasible: true,
        };

      case "rough":
        return {
          speedModifier: terrain.roughTerrainSpeed,
          energyModifier: 1.2,
          stabilityModifier: capabilities.stability.balanceRating,
          feasible: true,
        };

      case "steep":
        return {
          speedModifier: terrain.climbingAbility,
          energyModifier: 1.8,
          stabilityModifier: capabilities.stability.balanceRating * 0.8,
          feasible: terrain.climbingAbility > 0.5,
        };

      case "slippery":
        return {
          speedModifier: terrain.slipperyResistance,
          energyModifier: 1.3,
          stabilityModifier: terrain.slipperyResistance,
          feasible: terrain.slipperyResistance > 0.6,
        };

      case "water":
        return {
          speedModifier: terrain.swimmingSpeed,
          energyModifier: 2.0,
          stabilityModifier: 0.7,
          feasible: terrain.swimmingSpeed > 0.3,
        };

      default:
        return {
          speedModifier: 1.0,
          energyModifier: 1.0,
          stabilityModifier: 1.0,
          feasible: true,
        };
    }
  }

  /**
   * Get recommended movement equipment
   */
  public getRecommendedEquipment(): {
    primary: string[];
    secondary: string[];
    avoid: string[];
  } {
    const capabilities = this.getSpecializedCapabilities();

    const recommendations = {
      primary: ["speed_boosters", "shock_absorbers", "grip_enhancers"],
      secondary: ["jump_jets", "stabilizers", "energy_cells"],
      avoid: ["heavy_armor_legs", "restrictive_equipment"],
    };

    if (capabilities.locomotion.maxSpeed > 150) {
      recommendations.primary.push("aerodynamic_plating", "friction_reducers");
    }

    if (capabilities.jumpingAbilities.doubleJump) {
      recommendations.primary.push(
        "aerial_control_systems",
        "landing_dampeners"
      );
    }

    if (capabilities.turboBoost.enabled) {
      recommendations.primary.push("turbo_systems", "heat_dissipators");
    }

    if (this.rarity >= Rarity.LEGENDARY) {
      recommendations.primary.push(
        "quantum_propulsion",
        "gravity_manipulators"
      );
    }

    return recommendations;
  }

  /**
   * Calculate optimal upgrade path for leg specialization
   */
  public getOptimalUpgradePath(): {
    nextUpgrade: number;
    reasoning: string;
    expectedImprovement: string;
  } {
    if (this.upgradeLevel < 6) {
      return {
        nextUpgrade: 6,
        reasoning: "Unlock double jump for enhanced mobility",
        expectedImprovement:
          "Access to aerial maneuvers and extended jump capabilities",
      };
    }

    if (this.upgradeLevel < 9) {
      return {
        nextUpgrade: 9,
        reasoning: "Unlock turbo boost for maximum speed",
        expectedImprovement:
          "2.5x speed multiplier for chase and escape scenarios",
      };
    }

    if (this.upgradeLevel < 12) {
      return {
        nextUpgrade: 12,
        reasoning: "Unlock earth shaker for area control",
        expectedImprovement: "Powerful AOE ground slam with stun effects",
      };
    }

    if (this.upgradeLevel < this.getMaxUpgradeLevel()) {
      return {
        nextUpgrade: Math.min(this.upgradeLevel + 2, this.getMaxUpgradeLevel()),
        reasoning: "Enhance speed and stability bonuses",
        expectedImprovement: `${((this.upgradeLevel + 2) * 0.05 * 100).toFixed(1)}% additional mobility bonus`,
      };
    }

    return {
      nextUpgrade: this.upgradeLevel,
      reasoning: "Already at maximum upgrade level",
      expectedImprovement:
        "Consider gravity defiance modules or teleportation systems",
    };
  }
}

