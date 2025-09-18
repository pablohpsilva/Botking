/**
 * Skeleton slot configuration definitions
 */

import { SkeletonType, PartCategory } from "@botking/db";
import {
  SkeletonSlotConfig,
  ISkeletonTypeConstraints,
} from "../types/skeleton-slots";

/**
 * Slot constraints configuration for each skeleton type
 */
export const SKELETON_SLOT_CONFIG: SkeletonSlotConfig = {
  [SkeletonType.FLYING]: {
    [PartCategory.HEAD]: {
      min: 1,
      max: null, // 1..n heads
      default: 1,
    },
    [PartCategory.TORSO]: {
      min: 1,
      max: 1, // exactly 1 torso
      default: 1,
    },
    [PartCategory.LEG]: {
      min: 1,
      max: null, // 1..n legs
      default: 2,
    },
    [PartCategory.ARM]: {
      min: 0,
      max: null, // 0..n arms
      default: 2,
    },
    [PartCategory.ACCESSORY]: {
      min: 0,
      max: null, // 0..n accessories
      default: 0,
    },
    expansionChips: {
      min: 0,
      max: null, // 0..n expansion chips
      default: 1,
    },
    soulChips: {
      min: 1,
      max: 1, // exactly 1 soul chip
      default: 1,
    },
  },

  [SkeletonType.LIGHT]: {
    [PartCategory.HEAD]: {
      min: 1,
      max: 1, // exactly 1 head
      default: 1,
    },
    [PartCategory.TORSO]: {
      min: 1,
      max: 1, // exactly 1 torso
      default: 1,
    },
    [PartCategory.LEG]: {
      min: 1,
      max: 2, // 1..2 legs
      default: 2,
    },
    [PartCategory.ARM]: {
      min: 0,
      max: null, // 0..n arms
      default: 2,
    },
    [PartCategory.ACCESSORY]: {
      min: 0,
      max: 2, // 0..2 accessories
      default: 0,
    },
    expansionChips: {
      min: 0,
      max: null, // 0..n expansion chips
      default: 1,
    },
    soulChips: {
      min: 1,
      max: 1, // exactly 1 soul chip
      default: 1,
    },
  },

  [SkeletonType.HEAVY]: {
    [PartCategory.HEAD]: {
      min: 1,
      max: null, // 1..n heads
      default: 1,
    },
    [PartCategory.TORSO]: {
      min: 1,
      max: 1, // exactly 1 torso
      default: 1,
    },
    [PartCategory.LEG]: {
      min: 2,
      max: null, // 2..n legs
      default: 2,
    },
    [PartCategory.ARM]: {
      min: 2,
      max: null, // 2..n arms
      default: 2,
    },
    [PartCategory.ACCESSORY]: {
      min: 0,
      max: null, // 0..n accessories
      default: 1,
    },
    expansionChips: {
      min: 0,
      max: null, // 0..n expansion chips
      default: 1,
    },
    soulChips: {
      min: 1,
      max: 1, // exactly 1 soul chip
      default: 1,
    },
  },

  [SkeletonType.BALANCED]: {
    [PartCategory.HEAD]: {
      min: 1,
      max: 1, // exactly 1 head
      default: 1,
    },
    [PartCategory.TORSO]: {
      min: 1,
      max: 1, // exactly 1 torso
      default: 1,
    },
    [PartCategory.LEG]: {
      min: 2,
      max: 2, // 1..2 legs
      default: 2,
    },
    [PartCategory.ARM]: {
      min: 2,
      max: 2, // 2..2 arms
      default: 2,
    },
    [PartCategory.ACCESSORY]: {
      min: 0,
      max: 1, // 0..1 accessories
      default: 0,
    },
    expansionChips: {
      min: 0,
      max: null, // 0..2 expansion chips
      default: 1,
    },
    soulChips: {
      min: 1,
      max: 1, // exactly 1 soul chip
      default: 1,
    },
  },

  [SkeletonType.MODULAR]: {
    [PartCategory.HEAD]: {
      min: 1,
      max: null, // 1..n heads
      default: 1,
    },
    [PartCategory.TORSO]: {
      min: 1,
      max: 1, // exactly 1 torso
      default: 1,
    },
    [PartCategory.LEG]: {
      min: 0,
      max: null, // 0..n legs
      default: 2,
    },
    [PartCategory.ARM]: {
      min: 0,
      max: null, // 0..n arms
      default: 2,
    },
    [PartCategory.ACCESSORY]: {
      min: 0,
      max: null, // 0..n accessories
      default: 2,
    },
    expansionChips: {
      min: 0,
      max: null, // 0..n expansion chips
      default: 2,
    },
    soulChips: {
      min: 1,
      max: 1, // exactly 1 soul chip
      default: 1,
    },
  },
};

/**
 * Note: SWIMMER skeleton type was mentioned in the requirements but doesn't exist in the database enum.
 * Adding it here for completeness - you may need to add it to the database schema.
 */
// Uncomment and add to database if needed:
/*
SWIMMER: {
  [PartCategory.HEAD]: {
    min: 1,
    max: null, // 1..n heads
    default: 1,
  },
  [PartCategory.TORSO]: {
    min: 1,
    max: 1, // exactly 1 torso
    default: 1,
  },
  [PartCategory.LEG]: {
    min: 1,
    max: null, // 1..n legs
    default: 2,
  },
  [PartCategory.ARM]: {
    min: 0,
    max: null, // 0..n arms
    default: 2,
  },
  expansionChips: {
    min: 0,
    max: null, // 0..n expansion chips
    default: 1,
  },
  soulChips: {
    min: 1,
    max: 1, // exactly 1 soul chip
    default: 1,
  },
},
*/

import { skeletonConfigurationService } from "../services/skeleton-configuration-service";

/**
 * @deprecated Use SkeletonConfigurationService.getInstance().getSlotConstraints() instead
 * Helper function to get slot constraints for a skeleton type
 */
export function getSkeletonSlotConstraints(
  skeletonType: SkeletonType
): ISkeletonTypeConstraints {
  return skeletonConfigurationService.getSlotConstraints(skeletonType);
}

/**
 * @deprecated Use SkeletonConfigurationService.getInstance().getDefaultSlots() instead
 * Helper function to get default slots for a skeleton type
 */
export function getDefaultSlotsForSkeleton(skeletonType: SkeletonType) {
  // For backward compatibility, get base slots and add extension slots
  const baseSlots = skeletonConfigurationService.getDefaultSlots(skeletonType);
  const constraints = getSkeletonSlotConstraints(skeletonType);

  return {
    ...baseSlots,
    expansionSlots: (constraints as any).expansionChips?.default || 0,
    soulChipSlots: (constraints as any).soulChips?.default || 0,
  };
}
