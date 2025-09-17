import { Rarity, ExpansionChipEffect } from "../types";
import { IExpansionChip } from "./expansion-chip-interface";
import { AttackBuffChip } from "./attack-buff-chip";
import { DefenseBuffChip } from "./defense-buff-chip";
import { SpeedBuffChip } from "./speed-buff-chip";
import { AIUpgradeChip } from "./ai-upgrade-chip";

// For unimplemented effects, we'll create a generic chip

/**
 * Factory class for creating different types of expansion chips
 */
export class ExpansionChipFactory {
  /**
   * Create an expansion chip of the specified effect type
   */
  public static createExpansionChip(
    effect: ExpansionChipEffect,
    id: string,
    name: string,
    rarity: Rarity,
    description: string,
    upgradeLevel: number = 0
  ): IExpansionChip {
    switch (effect) {
      case ExpansionChipEffect.ATTACK_BUFF:
        return new AttackBuffChip(id, name, rarity, description, upgradeLevel);

      case ExpansionChipEffect.DEFENSE_BUFF:
        return new DefenseBuffChip(id, name, rarity, description, upgradeLevel);

      case ExpansionChipEffect.SPEED_BUFF:
        return new SpeedBuffChip(id, name, rarity, description, upgradeLevel);

      case ExpansionChipEffect.AI_UPGRADE:
        return new AIUpgradeChip(id, name, rarity, description, upgradeLevel);

      // For effects not yet implemented, use a generic attack buff as placeholder
      case ExpansionChipEffect.ENERGY_EFFICIENCY:
      case ExpansionChipEffect.SPECIAL_ABILITY:
      case ExpansionChipEffect.STAT_BOOST:
      case ExpansionChipEffect.RESISTANCE:
        // TODO: Implement specific chips for these effects
        return new AttackBuffChip(id, name, rarity, description, upgradeLevel);

      default:
        throw new Error(`Unknown expansion chip effect: ${effect}`);
    }
  }

  /**
   * Create an expansion chip from JSON data
   */
  public static fromJSON(data: any): IExpansionChip {
    const effect = data.effect as ExpansionChipEffect;

    switch (effect) {
      case ExpansionChipEffect.ATTACK_BUFF:
        return new AttackBuffChip(
          data.id,
          data.name,
          data.rarity,
          data.description,
          data.upgradeLevel || 0
        );

      case ExpansionChipEffect.DEFENSE_BUFF:
        return new DefenseBuffChip(
          data.id,
          data.name,
          data.rarity,
          data.description,
          data.upgradeLevel || 0
        );

      case ExpansionChipEffect.SPEED_BUFF:
        return new SpeedBuffChip(
          data.id,
          data.name,
          data.rarity,
          data.description,
          data.upgradeLevel || 0
        );

      case ExpansionChipEffect.AI_UPGRADE:
        return new AIUpgradeChip(
          data.id,
          data.name,
          data.rarity,
          data.description,
          data.upgradeLevel || 0
        );

      // For effects not yet implemented, use attack buff as placeholder
      default:
        return new AttackBuffChip(
          data.id,
          data.name,
          data.rarity,
          data.description,
          data.upgradeLevel || 0
        );
    }
  }

  /**
   * Create a default expansion chip of each implemented type for testing/examples
   */
  public static createDefaultExpansionChips(): {
    [key: string]: IExpansionChip;
  } {
    const baseId = Date.now().toString();

    return {
      attack: ExpansionChipFactory.createExpansionChip(
        ExpansionChipEffect.ATTACK_BUFF,
        `attack_${baseId}`,
        "Basic Attack Enhancer",
        Rarity.COMMON,
        "Increases attack power through combat optimization"
      ),

      defense: ExpansionChipFactory.createExpansionChip(
        ExpansionChipEffect.DEFENSE_BUFF,
        `defense_${baseId}`,
        "Basic Defense Booster",
        Rarity.COMMON,
        "Enhances defensive capabilities and damage mitigation"
      ),

      speed: ExpansionChipFactory.createExpansionChip(
        ExpansionChipEffect.SPEED_BUFF,
        `speed_${baseId}`,
        "Basic Speed Amplifier",
        Rarity.COMMON,
        "Improves movement speed and agility"
      ),

      ai: ExpansionChipFactory.createExpansionChip(
        ExpansionChipEffect.AI_UPGRADE,
        `ai_${baseId}`,
        "Basic Neural Processor",
        Rarity.COMMON,
        "Enhances AI processing and decision-making capabilities"
      ),
    };
  }

  /**
   * Get recommended expansion chip for specific playstyles
   */
  public static getRecommendedExpansionChip(
    playstyle:
      | "aggressive"
      | "defensive"
      | "balanced"
      | "speed"
      | "tactical"
      | "support"
  ): {
    primaryEffect: ExpansionChipEffect;
    secondaryEffects: ExpansionChipEffect[];
    reasoning: string;
  } {
    const recommendations = {
      aggressive: {
        primaryEffect: ExpansionChipEffect.ATTACK_BUFF,
        secondaryEffects: [
          ExpansionChipEffect.SPEED_BUFF,
          ExpansionChipEffect.AI_UPGRADE,
        ],
        reasoning:
          "Attack buffs maximize damage output, with speed for positioning and AI for targeting",
      },

      defensive: {
        primaryEffect: ExpansionChipEffect.DEFENSE_BUFF,
        secondaryEffects: [
          ExpansionChipEffect.RESISTANCE,
          ExpansionChipEffect.ENERGY_EFFICIENCY,
        ],
        reasoning:
          "Defense buffs provide survivability, with resistance for status protection and energy efficiency for sustained operations",
      },

      balanced: {
        primaryEffect: ExpansionChipEffect.STAT_BOOST,
        secondaryEffects: [
          ExpansionChipEffect.AI_UPGRADE,
          ExpansionChipEffect.ENERGY_EFFICIENCY,
        ],
        reasoning:
          "Stat boosts provide versatility, with AI upgrades for decision-making and energy efficiency for sustained performance",
      },

      speed: {
        primaryEffect: ExpansionChipEffect.SPEED_BUFF,
        secondaryEffects: [
          ExpansionChipEffect.ATTACK_BUFF,
          ExpansionChipEffect.ENERGY_EFFICIENCY,
        ],
        reasoning:
          "Speed buffs enable hit-and-run tactics, with attack buffs for strike effectiveness and energy efficiency for sustained mobility",
      },

      tactical: {
        primaryEffect: ExpansionChipEffect.AI_UPGRADE,
        secondaryEffects: [
          ExpansionChipEffect.STAT_BOOST,
          ExpansionChipEffect.SPECIAL_ABILITY,
        ],
        reasoning:
          "AI upgrades enhance tactical decision-making, with stat boosts for versatility and special abilities for unique tactical options",
      },

      support: {
        primaryEffect: ExpansionChipEffect.ENERGY_EFFICIENCY,
        secondaryEffects: [
          ExpansionChipEffect.AI_UPGRADE,
          ExpansionChipEffect.DEFENSE_BUFF,
        ],
        reasoning:
          "Energy efficiency enables extended support operations, with AI upgrades for team coordination and defense for survivability",
      },
    };

    return recommendations[playstyle];
  }

  /**
   * Create optimized expansion chips for specific roles
   */
  public static createRoleOptimizedExpansionChip(
    role: "assassin" | "tank" | "scout" | "support" | "specialist",
    rarity: Rarity = Rarity.COMMON
  ): IExpansionChip {
    const baseId = `${role}_${Date.now()}`;

    switch (role) {
      case "assassin":
        return ExpansionChipFactory.createExpansionChip(
          ExpansionChipEffect.ATTACK_BUFF,
          baseId,
          "Assassin's Edge",
          rarity,
          "Specialized for high-damage elimination tactics"
        );

      case "tank":
        return ExpansionChipFactory.createExpansionChip(
          ExpansionChipEffect.DEFENSE_BUFF,
          baseId,
          "Guardian's Shield",
          rarity,
          "Optimized for damage absorption and team protection"
        );

      case "scout":
        return ExpansionChipFactory.createExpansionChip(
          ExpansionChipEffect.SPEED_BUFF,
          baseId,
          "Pathfinder's Grace",
          rarity,
          "Enhanced for reconnaissance and rapid movement"
        );

      case "support":
        return ExpansionChipFactory.createExpansionChip(
          ExpansionChipEffect.AI_UPGRADE,
          baseId,
          "Coordinator's Mind",
          rarity,
          "Designed for team coordination and tactical support"
        );

      case "specialist":
        return ExpansionChipFactory.createExpansionChip(
          ExpansionChipEffect.SPECIAL_ABILITY,
          baseId,
          "Specialist's Tool",
          rarity,
          "Unique capabilities for specialized operations"
        );

      default:
        throw new Error(`Unknown role: ${role}`);
    }
  }

  /**
   * Validate expansion chip configuration for balance
   */
  public static validateExpansionChipConfiguration(chips: IExpansionChip[]): {
    isBalanced: boolean;
    conflicts: string[];
    synergies: string[];
    recommendations: string[];
  } {
    const conflicts: string[] = [];
    const synergies: string[] = [];
    const recommendations: string[] = [];

    // Check for conflicts between chips
    for (let i = 0; i < chips.length; i++) {
      for (let j = i + 1; j < chips.length; j++) {
        if (chips[i].conflictsWith(chips[j])) {
          conflicts.push(`${chips[i].name} conflicts with ${chips[j].name}`);
        }

        const synergyBonus = chips[i].getSynergyBonus(chips[j]);
        if (synergyBonus > 0) {
          synergies.push(
            `${chips[i].name} synergizes with ${chips[j].name} (+${(synergyBonus * 100).toFixed(1)}%)`
          );
        }
      }
    }

    // Check for missing coverage
    const effects = chips.map((chip) => chip.effect);
    const hasOffensive = effects.includes(ExpansionChipEffect.ATTACK_BUFF);
    const hasDefensive = effects.includes(ExpansionChipEffect.DEFENSE_BUFF);
    const hasMobility = effects.includes(ExpansionChipEffect.SPEED_BUFF);
    const hasIntelligence = effects.includes(ExpansionChipEffect.AI_UPGRADE);

    if (!hasOffensive && !hasDefensive) {
      recommendations.push(
        "Consider adding offensive or defensive capabilities"
      );
    }

    if (!hasMobility && chips.length >= 3) {
      recommendations.push(
        "Speed enhancement could improve tactical flexibility"
      );
    }

    if (!hasIntelligence && chips.length >= 4) {
      recommendations.push(
        "AI upgrades could optimize other chip effectiveness"
      );
    }

    return {
      isBalanced: conflicts.length === 0,
      conflicts,
      synergies,
      recommendations,
    };
  }

  /**
   * Get optimal chip combinations for specific strategies
   */
  public static getOptimalChipCombinations(): {
    [strategy: string]: {
      chips: ExpansionChipEffect[];
      description: string;
      effectiveness: number;
    };
  } {
    return {
      berserker_build: {
        chips: [
          ExpansionChipEffect.ATTACK_BUFF,
          ExpansionChipEffect.SPEED_BUFF,
        ],
        description: "Maximum damage output with high mobility",
        effectiveness: 0.9,
      },

      fortress_build: {
        chips: [
          ExpansionChipEffect.DEFENSE_BUFF,
          ExpansionChipEffect.RESISTANCE,
        ],
        description: "Ultimate survivability and damage mitigation",
        effectiveness: 0.85,
      },

      tactical_build: {
        chips: [ExpansionChipEffect.AI_UPGRADE, ExpansionChipEffect.STAT_BOOST],
        description: "Balanced capabilities with enhanced decision-making",
        effectiveness: 0.8,
      },

      hit_and_run: {
        chips: [
          ExpansionChipEffect.SPEED_BUFF,
          ExpansionChipEffect.ATTACK_BUFF,
          ExpansionChipEffect.ENERGY_EFFICIENCY,
        ],
        description: "Fast strikes with sustained mobility",
        effectiveness: 0.88,
      },

      support_specialist: {
        chips: [
          ExpansionChipEffect.AI_UPGRADE,
          ExpansionChipEffect.ENERGY_EFFICIENCY,
          ExpansionChipEffect.SPECIAL_ABILITY,
        ],
        description: "Enhanced team coordination and utility",
        effectiveness: 0.75,
      },
    };
  }
}
