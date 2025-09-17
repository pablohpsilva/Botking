/**
 * Botking Artifact System
 *
 * A comprehensive system for managing bot components including:
 * - Soul Chips: Core personality and AI traits
 * - Skeletons: Structural frames with slots and mobility
 * - Parts: Modular equipment for combat roles
 * - Expansion Chips: Slot-based enhancers
 * - Bot State: Dynamic runtime state management
 */

// Export all types and enums
export type {
  BaseStats,
  CombatStats,
  ActiveStatusEffect,
  PersonalityTraits,
  Ability,
} from "./types";

export {
  Rarity,
  SkeletonType,
  MobilityType,
  PartCategory,
  StatusEffect,
  BotLocation,
  ExpansionChipEffect,
} from "./types";

// Export all classes
export { SoulChip } from "./soul-chip";
export { BotState } from "./bot-state";

// Legacy exports - use new factory system

// Export skeleton system
export {
  ISkeleton,
  SkeletonCharacteristics,
  BaseSkeleton,
  LightSkeleton,
  BalancedSkeleton,
  HeavySkeleton,
  FlyingSkeleton,
  ModularSkeleton,
  SkeletonFactory,
  AnySkeleton,
} from "./skeleton";

// Keep the old Skeleton export for backward compatibility
export { BaseSkeleton as Skeleton } from "./skeleton";

// Export expansion chip system
export {
  IExpansionChip,
  EffectApplication,
  ChipOptimization,
  BaseExpansionChip,
  AttackBuffChip,
  DefenseBuffChip,
  SpeedBuffChip,
  AIUpgradeChip,
  ExpansionChipFactory,
  AnySpecializedExpansionChip,
} from "./expansion-chip";

// Export part system
export {
  IPart,
  PartInstallation,
  PartOptimization,
  CombatEffectiveness,
  BasePart,
  ArmPart,
  LegPart,
  TorsoPart,
  HeadPart,
  PartFactory,
  AnySpecializedPart,
} from "./part";

// Import for internal use
import { SoulChip } from "./soul-chip";
import { BalancedSkeleton, SkeletonFactory, ISkeleton } from "./skeleton";
import { PartFactory, IPart, ArmPart } from "./part";
import {
  ExpansionChipFactory,
  IExpansionChip,
  AttackBuffChip,
} from "./expansion-chip";
import { BotState } from "./bot-state";
import {
  Rarity,
  SkeletonType,
  MobilityType,
  PartCategory,
  BotLocation,
  ExpansionChipEffect,
} from "./types";

// Export version info
export const VERSION = "1.0.0";

// Export utility functions for creating artifacts
export class ArtifactFactory {
  /**
   * Create a basic soul chip with common rarity
   */
  static createBasicSoulChip(name: string): SoulChip {
    return new SoulChip(
      `soul_${Date.now()}`,
      name,
      Rarity.COMMON,
      {
        aggressiveness: 50,
        curiosity: 50,
        loyalty: 70,
        independence: 40,
        empathy: 60,
        dialogueStyle: "casual",
      },
      {
        intelligence: 10,
        resilience: 10,
        adaptability: 10,
      },
      "Basic AI Learning"
    );
  }

  /**
   * Create a balanced skeleton
   */
  static createBalancedSkeleton(): BalancedSkeleton {
    return SkeletonFactory.createSkeleton(
      SkeletonType.BALANCED,
      `skeleton_${Date.now()}`,
      Rarity.COMMON,
      4, // 4 slots
      100, // base durability
      MobilityType.BIPEDAL
    ) as BalancedSkeleton;
  }

  /**
   * Create a basic arm part
   */
  static createBasicArmPart(): IPart {
    return PartFactory.createPart(
      PartCategory.ARM,
      `arm_${Date.now()}`,
      Rarity.COMMON,
      "Basic Manipulator Arm",
      {
        attack: 15,
        defense: 5,
        speed: 10,
        perception: 5,
        energyConsumption: 8,
      },
      [],
      0
    );
  }

  /**
   * Create a basic expansion chip
   */
  static createBasicExpansionChip(effect: ExpansionChipEffect): IExpansionChip {
    const effectNames = {
      [ExpansionChipEffect.ATTACK_BUFF]: "Attack Enhancer",
      [ExpansionChipEffect.DEFENSE_BUFF]: "Defense Booster",
      [ExpansionChipEffect.SPEED_BUFF]: "Speed Amplifier",
      [ExpansionChipEffect.AI_UPGRADE]: "Neural Processor",
      [ExpansionChipEffect.ENERGY_EFFICIENCY]: "Power Optimizer",
      [ExpansionChipEffect.SPECIAL_ABILITY]: "Special Function Unit",
      [ExpansionChipEffect.STAT_BOOST]: "Universal Enhancer",
      [ExpansionChipEffect.RESISTANCE]: "Hardening Module",
    };

    return ExpansionChipFactory.createExpansionChip(
      effect,
      `chip_${Date.now()}`,
      effectNames[effect] || "Unknown Chip",
      Rarity.COMMON,
      `A basic expansion chip that provides ${effect} enhancement`,
      0
    );
  }

  /**
   * Create a new bot state
   */
  static createNewBotState(): BotState {
    return new BotState(
      100, // full energy
      100, // perfect maintenance
      [], // no status effects
      0, // no bond yet
      BotLocation.FACTORY, // starts in factory
      0 // no experience
    );
  }
}

// Export bot assembly utilities
export class BotAssembler {
  /**
   * Create a complete basic bot configuration
   */
  static createBasicBot(name: string): {
    soulChip: SoulChip;
    skeleton: BalancedSkeleton;
    parts: IPart[];
    expansionChips: IExpansionChip[];
    state: BotState;
  } {
    return {
      soulChip: ArtifactFactory.createBasicSoulChip(name),
      skeleton: ArtifactFactory.createBalancedSkeleton(),
      parts: [
        ArtifactFactory.createBasicArmPart(),
        // Add more basic parts as needed
      ],
      expansionChips: [
        ArtifactFactory.createBasicExpansionChip(
          ExpansionChipEffect.STAT_BOOST
        ),
      ],
      state: ArtifactFactory.createNewBotState(),
    };
  }

  /**
   * Validate if parts are compatible with skeleton
   */
  static validateConfiguration(
    skeleton: ISkeleton,
    parts: IPart[],
    expansionChips: IExpansionChip[]
  ): {
    valid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    // Check if we have too many parts for available slots
    if (parts.length > skeleton.getTotalSlots()) {
      errors.push(
        `Too many parts (${parts.length}) for available slots (${skeleton.getTotalSlots()})`
      );
    }

    // Check if we have too many expansion chips
    const expansionSlots = Math.max(0, skeleton.getTotalSlots() - parts.length);
    if (expansionChips.length > expansionSlots) {
      errors.push(
        `Too many expansion chips (${expansionChips.length}) for available expansion slots (${expansionSlots})`
      );
    }

    // Check part compatibility with skeleton
    parts.forEach((part) => {
      if (!skeleton.isCompatibleWithPart(part.category)) {
        errors.push(
          `Part ${part.name} (${part.category}) is not compatible with skeleton type ${skeleton.type}`
        );
      }
    });

    // Check for duplicate part categories (assuming only one per category)
    const categories = parts.map((part) => part.category);
    const duplicates = categories.filter(
      (category, index) => categories.indexOf(category) !== index
    );
    if (duplicates.length > 0) {
      errors.push(
        `Duplicate part categories detected: ${duplicates.join(", ")}`
      );
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }
}
