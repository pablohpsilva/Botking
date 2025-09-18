/**
 * Skeleton-specific slot configurations
 */

import { SkeletonType, PartCategory } from "@botking/db";
import {
  SlotIdentifier,
  ISlotInfo,
  SkeletonSlotConfigurationMap,
  ISlotCompatibility,
} from "../types/slot-assignment";

/**
 * Default slot layouts for each skeleton type
 */
export const SKELETON_SLOT_LAYOUTS: SkeletonSlotConfigurationMap = {
  [SkeletonType.LIGHT]: [
    SlotIdentifier.HEAD_1,
    SlotIdentifier.TORSO_1,
    SlotIdentifier.ARM_LEFT,
    SlotIdentifier.ARM_RIGHT,
    SlotIdentifier.LEG_LEFT,
    SlotIdentifier.LEG_RIGHT,
    SlotIdentifier.EXPANSION_1,
    SlotIdentifier.SOUL_CHIP,
  ],

  [SkeletonType.BALANCED]: [
    SlotIdentifier.HEAD_1,
    SlotIdentifier.TORSO_1,
    SlotIdentifier.ARM_LEFT,
    SlotIdentifier.ARM_RIGHT,
    SlotIdentifier.LEG_LEFT,
    SlotIdentifier.LEG_RIGHT,
    SlotIdentifier.ACCESSORY_1,
    SlotIdentifier.EXPANSION_1,
    SlotIdentifier.EXPANSION_2,
    SlotIdentifier.SOUL_CHIP,
  ],

  [SkeletonType.HEAVY]: [
    SlotIdentifier.HEAD_1,
    SlotIdentifier.TORSO_1,
    SlotIdentifier.ARM_LEFT,
    SlotIdentifier.ARM_RIGHT,
    SlotIdentifier.ARM_LEFT_2, // Extra arms for heavy
    SlotIdentifier.ARM_RIGHT_2,
    SlotIdentifier.LEG_LEFT,
    SlotIdentifier.LEG_RIGHT,
    SlotIdentifier.LEG_LEFT_2, // Extra legs for heavy
    SlotIdentifier.LEG_RIGHT_2,
    SlotIdentifier.ACCESSORY_1,
    SlotIdentifier.EXPANSION_1,
    SlotIdentifier.SOUL_CHIP,
  ],

  [SkeletonType.FLYING]: [
    SlotIdentifier.HEAD_1,
    SlotIdentifier.HEAD_2, // Flying can have multiple heads
    SlotIdentifier.TORSO_1,
    SlotIdentifier.ARM_LEFT,
    SlotIdentifier.ARM_RIGHT,
    SlotIdentifier.LEG_LEFT,
    SlotIdentifier.LEG_RIGHT,
    SlotIdentifier.EXPANSION_1,
    SlotIdentifier.SOUL_CHIP,
  ],

  [SkeletonType.MODULAR]: [
    SlotIdentifier.HEAD_1,
    SlotIdentifier.HEAD_2, // Modular supports multiple of everything
    SlotIdentifier.TORSO_1,
    SlotIdentifier.ARM_LEFT,
    SlotIdentifier.ARM_RIGHT,
    SlotIdentifier.ARM_LEFT_2,
    SlotIdentifier.ARM_RIGHT_2,
    SlotIdentifier.LEG_LEFT,
    SlotIdentifier.LEG_RIGHT,
    SlotIdentifier.LEG_CENTER, // Optional center leg
    SlotIdentifier.ACCESSORY_1,
    SlotIdentifier.ACCESSORY_2,
    SlotIdentifier.EXPANSION_1,
    SlotIdentifier.EXPANSION_2,
    SlotIdentifier.SOUL_CHIP,
  ],
};

/**
 * Detailed slot information for each slot type
 */
export const SLOT_INFO_REGISTRY: Record<SlotIdentifier, ISlotInfo> = {
  // Head slots
  [SlotIdentifier.HEAD_1]: {
    slotId: SlotIdentifier.HEAD_1,
    category: PartCategory.HEAD,
    position: "primary",
    index: 1,
    isRequired: true,
    constraints: {
      visualPosition: { x: 0, y: 0, z: 1.8 },
    },
  },
  [SlotIdentifier.HEAD_2]: {
    slotId: SlotIdentifier.HEAD_2,
    category: PartCategory.HEAD,
    position: "secondary",
    index: 2,
    isRequired: false,
    constraints: {
      visualPosition: { x: 0.3, y: 0, z: 1.8 },
    },
  },
  [SlotIdentifier.HEAD_3]: {
    slotId: SlotIdentifier.HEAD_3,
    category: PartCategory.HEAD,
    position: "tertiary",
    index: 3,
    isRequired: false,
    constraints: {
      visualPosition: { x: -0.3, y: 0, z: 1.8 },
    },
  },

  // Torso slots
  [SlotIdentifier.TORSO_1]: {
    slotId: SlotIdentifier.TORSO_1,
    category: PartCategory.TORSO,
    position: "center",
    index: 1,
    isRequired: true,
    constraints: {
      visualPosition: { x: 0, y: 0, z: 1.0 },
    },
  },

  // Arm slots
  [SlotIdentifier.ARM_LEFT]: {
    slotId: SlotIdentifier.ARM_LEFT,
    category: PartCategory.ARM,
    position: "left",
    index: 1,
    isRequired: false,
    constraints: {
      visualPosition: { x: -0.6, y: 0, z: 1.2 },
    },
  },
  [SlotIdentifier.ARM_RIGHT]: {
    slotId: SlotIdentifier.ARM_RIGHT,
    category: PartCategory.ARM,
    position: "right",
    index: 1,
    isRequired: false,
    constraints: {
      visualPosition: { x: 0.6, y: 0, z: 1.2 },
    },
  },
  [SlotIdentifier.ARM_LEFT_2]: {
    slotId: SlotIdentifier.ARM_LEFT_2,
    category: PartCategory.ARM,
    position: "left",
    index: 2,
    isRequired: false,
    constraints: {
      visualPosition: { x: -0.8, y: 0, z: 1.0 },
    },
  },
  [SlotIdentifier.ARM_RIGHT_2]: {
    slotId: SlotIdentifier.ARM_RIGHT_2,
    category: PartCategory.ARM,
    position: "right",
    index: 2,
    isRequired: false,
    constraints: {
      visualPosition: { x: 0.8, y: 0, z: 1.0 },
    },
  },
  [SlotIdentifier.ARM_LEFT_3]: {
    slotId: SlotIdentifier.ARM_LEFT_3,
    category: PartCategory.ARM,
    position: "left",
    index: 3,
    isRequired: false,
    constraints: {
      visualPosition: { x: -1.0, y: 0, z: 0.8 },
    },
  },
  [SlotIdentifier.ARM_RIGHT_3]: {
    slotId: SlotIdentifier.ARM_RIGHT_3,
    category: PartCategory.ARM,
    position: "right",
    index: 3,
    isRequired: false,
    constraints: {
      visualPosition: { x: 1.0, y: 0, z: 0.8 },
    },
  },

  // Leg slots
  [SlotIdentifier.LEG_LEFT]: {
    slotId: SlotIdentifier.LEG_LEFT,
    category: PartCategory.LEG,
    position: "left",
    index: 1,
    isRequired: true,
    constraints: {
      visualPosition: { x: -0.2, y: 0, z: 0.0 },
    },
  },
  [SlotIdentifier.LEG_RIGHT]: {
    slotId: SlotIdentifier.LEG_RIGHT,
    category: PartCategory.LEG,
    position: "right",
    index: 1,
    isRequired: true,
    constraints: {
      visualPosition: { x: 0.2, y: 0, z: 0.0 },
    },
  },
  [SlotIdentifier.LEG_LEFT_2]: {
    slotId: SlotIdentifier.LEG_LEFT_2,
    category: PartCategory.LEG,
    position: "left",
    index: 2,
    isRequired: false,
    constraints: {
      visualPosition: { x: -0.4, y: 0, z: 0.0 },
    },
  },
  [SlotIdentifier.LEG_RIGHT_2]: {
    slotId: SlotIdentifier.LEG_RIGHT_2,
    category: PartCategory.LEG,
    position: "right",
    index: 2,
    isRequired: false,
    constraints: {
      visualPosition: { x: 0.4, y: 0, z: 0.0 },
    },
  },
  [SlotIdentifier.LEG_CENTER]: {
    slotId: SlotIdentifier.LEG_CENTER,
    category: PartCategory.LEG,
    position: "center",
    index: 1,
    isRequired: false,
    constraints: {
      visualPosition: { x: 0, y: 0, z: 0.0 },
    },
  },

  // Accessory slots
  [SlotIdentifier.ACCESSORY_1]: {
    slotId: SlotIdentifier.ACCESSORY_1,
    category: PartCategory.ACCESSORY,
    position: "primary",
    index: 1,
    isRequired: false,
    constraints: {
      visualPosition: { x: 0, y: 0.3, z: 1.0 },
    },
  },
  [SlotIdentifier.ACCESSORY_2]: {
    slotId: SlotIdentifier.ACCESSORY_2,
    category: PartCategory.ACCESSORY,
    position: "secondary",
    index: 2,
    isRequired: false,
    constraints: {
      visualPosition: { x: 0, y: -0.3, z: 1.0 },
    },
  },
  [SlotIdentifier.ACCESSORY_3]: {
    slotId: SlotIdentifier.ACCESSORY_3,
    category: PartCategory.ACCESSORY,
    position: "tertiary",
    index: 3,
    isRequired: false,
    constraints: {
      visualPosition: { x: 0.3, y: 0, z: 1.0 },
    },
  },
  [SlotIdentifier.ACCESSORY_4]: {
    slotId: SlotIdentifier.ACCESSORY_4,
    category: PartCategory.ACCESSORY,
    position: "quaternary",
    index: 4,
    isRequired: false,
    constraints: {
      visualPosition: { x: -0.3, y: 0, z: 1.0 },
    },
  },

  // Expansion slots
  [SlotIdentifier.EXPANSION_1]: {
    slotId: SlotIdentifier.EXPANSION_1,
    category: "expansionChip",
    position: "primary",
    index: 1,
    isRequired: false,
    constraints: {
      visualPosition: { x: 0.2, y: 0.2, z: 1.0 },
    },
  },
  [SlotIdentifier.EXPANSION_2]: {
    slotId: SlotIdentifier.EXPANSION_2,
    category: "expansionChip",
    position: "secondary",
    index: 2,
    isRequired: false,
    constraints: {
      visualPosition: { x: -0.2, y: 0.2, z: 1.0 },
    },
  },
  [SlotIdentifier.EXPANSION_3]: {
    slotId: SlotIdentifier.EXPANSION_3,
    category: "expansionChip",
    position: "tertiary",
    index: 3,
    isRequired: false,
    constraints: {
      visualPosition: { x: 0.2, y: -0.2, z: 1.0 },
    },
  },
  [SlotIdentifier.EXPANSION_4]: {
    slotId: SlotIdentifier.EXPANSION_4,
    category: "expansionChip",
    position: "quaternary",
    index: 4,
    isRequired: false,
    constraints: {
      visualPosition: { x: -0.2, y: -0.2, z: 1.0 },
    },
  },

  // Soul chip slot
  [SlotIdentifier.SOUL_CHIP]: {
    slotId: SlotIdentifier.SOUL_CHIP,
    category: "soulChip",
    position: "center",
    index: 1,
    isRequired: true,
    constraints: {
      visualPosition: { x: 0, y: 0, z: 1.1 },
    },
  },
};

/**
 * Slot compatibility rules
 */
export const SLOT_COMPATIBILITY: Record<SlotIdentifier, ISlotCompatibility> = {
  // Head slots - only accept head parts
  [SlotIdentifier.HEAD_1]: {
    slotId: SlotIdentifier.HEAD_1,
    compatibleCategories: [PartCategory.HEAD],
    restrictions: { maxParts: 1, requiredParts: 1 },
  },
  [SlotIdentifier.HEAD_2]: {
    slotId: SlotIdentifier.HEAD_2,
    compatibleCategories: [PartCategory.HEAD],
    restrictions: { maxParts: 1, requiredParts: 0 },
  },
  [SlotIdentifier.HEAD_3]: {
    slotId: SlotIdentifier.HEAD_3,
    compatibleCategories: [PartCategory.HEAD],
    restrictions: { maxParts: 1, requiredParts: 0 },
  },

  // Torso slots - only accept torso parts
  [SlotIdentifier.TORSO_1]: {
    slotId: SlotIdentifier.TORSO_1,
    compatibleCategories: [PartCategory.TORSO],
    restrictions: { maxParts: 1, requiredParts: 1 },
  },

  // Arm slots - only accept arm parts
  [SlotIdentifier.ARM_LEFT]: {
    slotId: SlotIdentifier.ARM_LEFT,
    compatibleCategories: [PartCategory.ARM],
    restrictions: { maxParts: 1, requiredParts: 0 },
  },
  [SlotIdentifier.ARM_RIGHT]: {
    slotId: SlotIdentifier.ARM_RIGHT,
    compatibleCategories: [PartCategory.ARM],
    restrictions: { maxParts: 1, requiredParts: 0 },
  },
  [SlotIdentifier.ARM_LEFT_2]: {
    slotId: SlotIdentifier.ARM_LEFT_2,
    compatibleCategories: [PartCategory.ARM],
    restrictions: { maxParts: 1, requiredParts: 0 },
  },
  [SlotIdentifier.ARM_RIGHT_2]: {
    slotId: SlotIdentifier.ARM_RIGHT_2,
    compatibleCategories: [PartCategory.ARM],
    restrictions: { maxParts: 1, requiredParts: 0 },
  },
  [SlotIdentifier.ARM_LEFT_3]: {
    slotId: SlotIdentifier.ARM_LEFT_3,
    compatibleCategories: [PartCategory.ARM],
    restrictions: { maxParts: 1, requiredParts: 0 },
  },
  [SlotIdentifier.ARM_RIGHT_3]: {
    slotId: SlotIdentifier.ARM_RIGHT_3,
    compatibleCategories: [PartCategory.ARM],
    restrictions: { maxParts: 1, requiredParts: 0 },
  },

  // Leg slots - only accept leg parts
  [SlotIdentifier.LEG_LEFT]: {
    slotId: SlotIdentifier.LEG_LEFT,
    compatibleCategories: [PartCategory.LEG],
    restrictions: { maxParts: 1, requiredParts: 1 },
  },
  [SlotIdentifier.LEG_RIGHT]: {
    slotId: SlotIdentifier.LEG_RIGHT,
    compatibleCategories: [PartCategory.LEG],
    restrictions: { maxParts: 1, requiredParts: 1 },
  },
  [SlotIdentifier.LEG_LEFT_2]: {
    slotId: SlotIdentifier.LEG_LEFT_2,
    compatibleCategories: [PartCategory.LEG],
    restrictions: { maxParts: 1, requiredParts: 0 },
  },
  [SlotIdentifier.LEG_RIGHT_2]: {
    slotId: SlotIdentifier.LEG_RIGHT_2,
    compatibleCategories: [PartCategory.LEG],
    restrictions: { maxParts: 1, requiredParts: 0 },
  },
  [SlotIdentifier.LEG_CENTER]: {
    slotId: SlotIdentifier.LEG_CENTER,
    compatibleCategories: [PartCategory.LEG],
    restrictions: { maxParts: 1, requiredParts: 0 },
  },

  // Accessory slots - only accept accessory parts
  [SlotIdentifier.ACCESSORY_1]: {
    slotId: SlotIdentifier.ACCESSORY_1,
    compatibleCategories: [PartCategory.ACCESSORY],
    restrictions: { maxParts: 1, requiredParts: 0 },
  },
  [SlotIdentifier.ACCESSORY_2]: {
    slotId: SlotIdentifier.ACCESSORY_2,
    compatibleCategories: [PartCategory.ACCESSORY],
    restrictions: { maxParts: 1, requiredParts: 0 },
  },
  [SlotIdentifier.ACCESSORY_3]: {
    slotId: SlotIdentifier.ACCESSORY_3,
    compatibleCategories: [PartCategory.ACCESSORY],
    restrictions: { maxParts: 1, requiredParts: 0 },
  },
  [SlotIdentifier.ACCESSORY_4]: {
    slotId: SlotIdentifier.ACCESSORY_4,
    compatibleCategories: [PartCategory.ACCESSORY],
    restrictions: { maxParts: 1, requiredParts: 0 },
  },

  // Expansion slots - only accept expansion chips
  [SlotIdentifier.EXPANSION_1]: {
    slotId: SlotIdentifier.EXPANSION_1,
    compatibleCategories: ["expansionChip"],
    restrictions: { maxParts: 1, requiredParts: 0 },
  },
  [SlotIdentifier.EXPANSION_2]: {
    slotId: SlotIdentifier.EXPANSION_2,
    compatibleCategories: ["expansionChip"],
    restrictions: { maxParts: 1, requiredParts: 0 },
  },
  [SlotIdentifier.EXPANSION_3]: {
    slotId: SlotIdentifier.EXPANSION_3,
    compatibleCategories: ["expansionChip"],
    restrictions: { maxParts: 1, requiredParts: 0 },
  },
  [SlotIdentifier.EXPANSION_4]: {
    slotId: SlotIdentifier.EXPANSION_4,
    compatibleCategories: ["expansionChip"],
    restrictions: { maxParts: 1, requiredParts: 0 },
  },

  // Soul chip slot - only accept soul chips
  [SlotIdentifier.SOUL_CHIP]: {
    slotId: SlotIdentifier.SOUL_CHIP,
    compatibleCategories: ["soulChip"],
    restrictions: { maxParts: 1, requiredParts: 1 },
  },
};

import { skeletonConfigurationService } from "../services/skeleton-configuration-service";

/**
 * @deprecated Use SkeletonConfigurationService.getInstance().getAvailableSlots() instead
 * Get available slots for a skeleton type
 */
export function getAvailableSlotsForSkeleton(
  skeletonType: SkeletonType
): ISlotInfo[] {
  return skeletonConfigurationService.getAvailableSlots(skeletonType);
}

/**
 * @deprecated Use SkeletonConfigurationService.getInstance().getSlotInfo() instead
 * Get slot information by slot ID
 */
export function getSlotInfo(slotId: SlotIdentifier): ISlotInfo {
  return skeletonConfigurationService.getSlotInfo(slotId);
}

/**
 * @deprecated Use SkeletonConfigurationService.getInstance().getSlotCompatibility() instead
 * Get slot compatibility rules
 */
export function getSlotCompatibility(
  slotId: SlotIdentifier
): ISlotCompatibility {
  return skeletonConfigurationService.getSlotCompatibility(slotId);
}

/**
 * @deprecated Use SlotCompatibilityService.getInstance().isPartCompatibleWithSlot() instead
 * Check if a part category is compatible with a slot
 */
export function isPartCompatibleWithSlot(
  slotId: SlotIdentifier,
  partCategory: PartCategory | "expansionChip" | "soulChip"
): boolean {
  // For backward compatibility, handle the extended types
  if (partCategory === "expansionChip" || partCategory === "soulChip") {
    const compatibility = getSlotCompatibility(slotId);
    return compatibility.compatibleCategories.includes(partCategory);
  }
  return skeletonConfigurationService.isPartCompatibleWithSlot(
    slotId,
    partCategory as PartCategory
  );
}
