import { Rarity, SkeletonType, MobilityType } from "../types";
import { BaseSkeleton } from "./base-skeleton";

/**
 * Balanced Skeleton - Versatile and adaptable, good at everything
 */
export class BalancedSkeleton extends BaseSkeleton {
  constructor(
    id: string,
    rarity: Rarity,
    slots: number,
    baseDurability: number,
    mobilityType: MobilityType
  ) {
    super(
      id,
      SkeletonType.BALANCED,
      rarity,
      slots,
      baseDurability,
      mobilityType
    );
  }

  public getTypeCharacteristics(): {
    speedModifier: number;
    defenseModifier: number;
    energyEfficiency: number;
    specialAbilities: string[];
  } {
    return {
      speedModifier: 1.0,
      defenseModifier: 1.0,
      energyEfficiency: 1.0,
      specialAbilities: ["adaptive_tactics"],
    };
  }

  public getUniqueAbilities(): string[] {
    return [
      "tactical_adaptation",
      "balanced_combat",
      "resource_optimization",
      "situation_analysis",
      "multi_role_capability",
    ];
  }

  public getCombatBonuses(): { [key: string]: number } {
    return {
      adaptabilityBonus: 0.15, // 15% bonus to adapting to situations
      versatilityBonus: 0.1, // 10% bonus when using different weapon types
      learningRate: 0.2, // 20% faster learning from combat
      balancedStats: 0.05, // 5% bonus to all stats
      tacticalAwareness: 0.15, // 15% better tactical positioning
    };
  }

  public getSpecialMechanics(): { [key: string]: any } {
    return {
      canAdaptToSituation: true,
      multiRoleEfficiency: 0.9, // 90% efficiency in any role
      learningFromExperience: true,
      tacticalModeAvailable: true,
      adaptationCooldown: 15, // Tactical adaptation cooldown in seconds
      analysisTime: 3, // Time needed to analyze situation in seconds
      memorySlots: 5, // Number of tactical situations remembered
      roleSwapTime: 2, // Time to swap between roles in seconds
    };
  }

  public isCompatibleWithPart(partCategory: string): boolean {
    // Balanced skeletons are compatible with all part types
    return true;
  }

  public getEnergyEfficiencyModifier(): number {
    // Balanced skeletons maintain consistent efficiency
    return super.getEnergyEfficiencyModifier();
  }

  /**
   * Calculate optimal loadout suggestions for balanced skeleton
   */
  public getOptimalLoadout(): {
    recommendedParts: string[];
    avoidParts: string[];
    playstyle: string;
  } {
    return {
      recommendedParts: [
        "adaptive_armor",
        "multi_purpose_weapons",
        "tactical_modules",
        "balanced_enhancers",
        "utility_systems",
      ],
      avoidParts: [], // Balanced skeletons can use anything
      playstyle: "adaptive_tactical",
    };
  }

  /**
   * Adapt to a specific combat situation
   */
  public adaptToSituation(
    situationType: "offensive" | "defensive" | "support" | "stealth"
  ): { bonuses: { [key: string]: number }; duration: number } {
    const adaptationBonuses = {
      offensive: {
        attackPower: 0.15,
        criticalChance: 0.1,
        energyEfficiency: -0.05,
      },
      defensive: {
        defenseRating: 0.2,
        damageReduction: 0.1,
        counterAttackChance: 0.05,
      },
      support: {
        healingEfficiency: 0.25,
        buffDuration: 0.15,
        resourceSharing: 0.2,
      },
      stealth: {
        stealthEffectiveness: 0.15,
        movementSpeed: 0.1,
        detectionResistance: 0.2,
      },
    };

    return {
      bonuses: adaptationBonuses[situationType],
      duration: 60, // Adaptation lasts 60 seconds
    };
  }

  /**
   * Analyze tactical situation and provide recommendations
   */
  public analyzeSituation(
    enemies: number,
    allies: number,
    terrain: "open" | "urban" | "confined" | "elevated",
    threat: "low" | "medium" | "high"
  ): {
    recommendedTactics: string[];
    priorityTargets: string[];
    riskAssessment: string;
  } {
    const tactics: string[] = [];
    const targets: string[] = [];
    let risk = "medium";

    // Analyze based on numbers
    if (enemies > allies * 2) {
      tactics.push("defensive_positioning", "use_cover", "coordinated_retreat");
      risk = "high";
    } else if (allies > enemies * 1.5) {
      tactics.push(
        "aggressive_advance",
        "flanking_maneuvers",
        "suppress_enemies"
      );
      risk = "low";
    } else {
      tactics.push(
        "balanced_approach",
        "opportunity_seeking",
        "adaptive_positioning"
      );
    }

    // Analyze based on terrain
    switch (terrain) {
      case "open":
        tactics.push("long_range_engagement", "mobility_focus");
        targets.push("heavy_units", "support_units");
        break;
      case "urban":
        tactics.push("close_quarters_combat", "building_clearing");
        targets.push("defensive_positions", "chokepoints");
        break;
      case "confined":
        tactics.push("breakthrough_tactics", "concentrated_firepower");
        targets.push("blocking_units", "weak_points");
        break;
      case "elevated":
        tactics.push("vertical_advantage", "overwatch_positions");
        targets.push("climbers", "aerial_units");
        break;
    }

    return {
      recommendedTactics: tactics,
      priorityTargets: targets,
      riskAssessment: risk,
    };
  }

  /**
   * Learn from combat experience and improve performance
   */
  public learnFromCombat(
    combatResult: "victory" | "defeat" | "draw",
    enemyTypes: string[],
    tacticsUsed: string[]
  ): { experienceGained: number; newTactics: string[] } {
    const baseExperience =
      combatResult === "victory" ? 100 : combatResult === "draw" ? 50 : 25;
    const learningBonus = this.getCombatBonuses().learningRate;
    const experienceGained = Math.floor(baseExperience * (1 + learningBonus));

    // Learn new tactics based on enemy types encountered
    const newTactics: string[] = [];
    enemyTypes.forEach((enemyType) => {
      if (enemyType.includes("heavy") && !tacticsUsed.includes("anti_armor")) {
        newTactics.push("anti_armor_tactics");
      }
      if (enemyType.includes("fast") && !tacticsUsed.includes("prediction")) {
        newTactics.push("predictive_targeting");
      }
      if (enemyType.includes("stealth") && !tacticsUsed.includes("detection")) {
        newTactics.push("enhanced_detection");
      }
    });

    return { experienceGained, newTactics };
  }
}
