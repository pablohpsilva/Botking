import { Rarity, PartCategory, CombatStats, Ability } from "../types";
import { IPart } from "./part-interface";
import { ArmPart } from "./arm-part";
import { LegPart } from "./leg-part";
import { TorsoPart } from "./torso-part";
import { HeadPart } from "./head-part";

/**
 * Factory class for creating different types of parts
 */
export class PartFactory {
  /**
   * Create a part of the specified category
   */
  public static createPart(
    category: PartCategory,
    id: string,
    rarity: Rarity,
    name: string,
    stats: CombatStats,
    abilities: Ability[] = [],
    upgradeLevel: number = 0
  ): IPart {
    switch (category) {
      case PartCategory.ARM:
        return new ArmPart(id, rarity, name, stats, abilities, upgradeLevel);

      case PartCategory.LEG:
        return new LegPart(id, rarity, name, stats, abilities, upgradeLevel);

      case PartCategory.TORSO:
        return new TorsoPart(id, rarity, name, stats, abilities, upgradeLevel);

      case PartCategory.HEAD:
        return new HeadPart(id, rarity, name, stats, abilities, upgradeLevel);

      default:
        throw new Error(`Unknown part category: ${category}`);
    }
  }

  /**
   * Create a part from JSON data
   */
  public static fromJSON(data: any): IPart {
    const category = data.category as PartCategory;

    switch (category) {
      case PartCategory.ARM:
        return new ArmPart(
          data.id,
          data.rarity,
          data.name,
          data.stats,
          data.abilities || [],
          data.upgradeLevel || 0
        );

      case PartCategory.LEG:
        return new LegPart(
          data.id,
          data.rarity,
          data.name,
          data.stats,
          data.abilities || [],
          data.upgradeLevel || 0
        );

      case PartCategory.TORSO:
        return new TorsoPart(
          data.id,
          data.rarity,
          data.name,
          data.stats,
          data.abilities || [],
          data.upgradeLevel || 0
        );

      case PartCategory.HEAD:
        return new HeadPart(
          data.id,
          data.rarity,
          data.name,
          data.stats,
          data.abilities || [],
          data.upgradeLevel || 0
        );

      // For categories not yet implemented, use the legacy part
      default:
        throw new Error(`Unknown fromJSON part category: ${category}`);
    }
  }

  /**
   * Validate part configuration for balance and compatibility
   */
  public static validatePartConfiguration(parts: IPart[]): {
    isBalanced: boolean;
    conflicts: string[];
    synergies: string[];
    recommendations: string[];
    overallRating: number;
  } {
    const conflicts: string[] = [];
    const synergies: string[] = [];
    const recommendations: string[] = [];

    // Check for required parts
    const categories = parts.map((part) => part.category);
    const requiredCategories = [
      PartCategory.ARM,
      PartCategory.LEG,
      PartCategory.TORSO,
      PartCategory.HEAD,
    ];

    for (const required of requiredCategories) {
      if (!categories.includes(required)) {
        conflicts.push(`Missing required part: ${required}`);
      }
    }

    // Check for conflicts between parts
    for (let i = 0; i < parts.length; i++) {
      for (let j = i + 1; j < parts.length; j++) {
        if (!parts[i].isCompatibleWith(parts[j])) {
          conflicts.push(`${parts[i].name} conflicts with ${parts[j].name}`);
        }

        const synergyBonus = parts[i].getSynergyBonus(parts[j]);
        if (synergyBonus > 0) {
          synergies.push(
            `${parts[i].name} synergizes with ${parts[j].name} (+${(synergyBonus * 100).toFixed(1)}%)`
          );
        }
      }
    }

    // Check for upgrade level balance
    const upgradeLevels = parts.map((part) => part.upgradeLevel);
    const maxUpgrade = Math.max(...upgradeLevels);
    const minUpgrade = Math.min(...upgradeLevels);

    if (maxUpgrade - minUpgrade > 5) {
      recommendations.push(
        "Consider balancing upgrade levels across all parts"
      );
    }

    // Check for rarity balance
    const rarities = parts.map((part) =>
      Object.values(Rarity).indexOf(part.rarity)
    );
    const avgRarity =
      rarities.reduce((sum, val) => sum + val, 0) / rarities.length;
    const rarityVariance =
      rarities.reduce((sum, val) => sum + Math.pow(val - avgRarity, 2), 0) /
      rarities.length;

    if (rarityVariance > 4) {
      recommendations.push("Consider using parts of similar rarity levels");
    }

    // Calculate overall rating
    const performanceMetrics = parts.map((part) =>
      part.getPerformanceMetrics()
    );
    const avgPerformance =
      performanceMetrics.reduce((sum, metrics) => {
        const values = Object.values(metrics);
        return sum + values.reduce((s, v) => s + v, 0) / values.length;
      }, 0) / performanceMetrics.length;

    const synergyBonus = synergies.length * 0.1;
    const conflictPenalty = conflicts.length * 0.2;
    const overallRating = Math.max(
      0,
      Math.min(10, avgPerformance * 5 + synergyBonus - conflictPenalty)
    );

    return {
      isBalanced: conflicts.length === 0,
      conflicts,
      synergies,
      recommendations,
      overallRating,
    };
  }
}
