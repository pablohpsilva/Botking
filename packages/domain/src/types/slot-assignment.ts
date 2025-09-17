/**
 * Slot assignment types for precise bot part placement
 */

import { SkeletonType, PartCategory } from "@botking/db";

/**
 * Specific slot identifiers for different skeleton types
 */
export enum SlotIdentifier {
  // Head slots
  HEAD_1 = "HEAD_1",
  HEAD_2 = "HEAD_2", // For multi-head skeletons
  HEAD_3 = "HEAD_3",

  // Torso slots (always single)
  TORSO_1 = "TORSO_1",

  // Arm slots
  ARM_LEFT = "ARM_LEFT",
  ARM_RIGHT = "ARM_RIGHT",
  ARM_LEFT_2 = "ARM_LEFT_2", // For multi-arm skeletons
  ARM_RIGHT_2 = "ARM_RIGHT_2",
  ARM_LEFT_3 = "ARM_LEFT_3",
  ARM_RIGHT_3 = "ARM_RIGHT_3",

  // Leg slots
  LEG_LEFT = "LEG_LEFT",
  LEG_RIGHT = "LEG_RIGHT",
  LEG_LEFT_2 = "LEG_LEFT_2", // For multi-leg skeletons
  LEG_RIGHT_2 = "LEG_RIGHT_2",
  LEG_CENTER = "LEG_CENTER", // For odd-numbered leg configurations

  // Accessory slots
  ACCESSORY_1 = "ACCESSORY_1",
  ACCESSORY_2 = "ACCESSORY_2",
  ACCESSORY_3 = "ACCESSORY_3",
  ACCESSORY_4 = "ACCESSORY_4",

  // Expansion chip slots
  EXPANSION_1 = "EXPANSION_1",
  EXPANSION_2 = "EXPANSION_2",
  EXPANSION_3 = "EXPANSION_3",
  EXPANSION_4 = "EXPANSION_4",

  // Soul chip slot (always single)
  SOUL_CHIP = "SOUL_CHIP",
}

/**
 * Slot information with metadata
 */
export interface ISlotInfo {
  slotId: SlotIdentifier;
  category: PartCategory | "expansionChip" | "soulChip";
  position: string; // "left", "right", "center", "primary", etc.
  index: number; // 1, 2, 3 for multiple slots of same type
  isRequired: boolean; // Whether this slot must be filled for valid assembly
  constraints?: {
    compatiblePartTypes?: string[]; // Specific part type restrictions
    maxPartSize?: string; // "small", "medium", "large"
    visualPosition?: { x: number; y: number; z: number }; // For 3D positioning
  };
}

/**
 * Part assignment to a specific slot
 */
export interface ISlotAssignment {
  slotId: SlotIdentifier;
  partId: string;
  partName: string;
  partCategory: PartCategory;
  assignedAt: Date;
  metadata?: {
    visualRotation?: { x: number; y: number; z: number };
    visualScale?: number;
    customizations?: Record<string, any>;
  };
}

/**
 * Complete slot configuration for a skeleton
 */
export interface ISkeletonSlotConfiguration {
  skeletonType: SkeletonType;
  availableSlots: ISlotInfo[];
  assignments: Map<SlotIdentifier, ISlotAssignment>;
  lastModified: Date;
}

/**
 * Slot assignment validation result
 */
export interface ISlotAssignmentValidation {
  isValid: boolean;
  slotId: SlotIdentifier;
  partId?: string;
  errors: string[];
  warnings: string[];
  suggestions?: string[];
}

/**
 * Bulk slot assignment validation
 */
export interface ISlotAssignmentResults {
  isValid: boolean;
  assignments: ISlotAssignmentValidation[];
  conflictingSlots: SlotIdentifier[];
  unassignedRequiredSlots: SlotIdentifier[];
  summary: {
    totalSlots: number;
    assignedSlots: number;
    requiredSlots: number;
    optionalSlots: number;
    conflicts: number;
  };
}

/**
 * Slot assignment operation types
 */
export enum SlotAssignmentOperation {
  ASSIGN = "assign",
  UNASSIGN = "unassign",
  SWAP = "swap",
  MOVE = "move",
}

/**
 * Slot assignment command
 */
export interface ISlotAssignmentCommand {
  operation: SlotAssignmentOperation;
  slotId: SlotIdentifier;
  partId?: string;
  targetSlotId?: SlotIdentifier; // For move operations
  swapWithSlotId?: SlotIdentifier; // For swap operations
  metadata?: Record<string, any>;
}

/**
 * Slot assignment history for undo/redo
 */
export interface ISlotAssignmentHistory {
  id: string;
  timestamp: Date;
  operation: SlotAssignmentOperation;
  previousState: ISlotAssignment | null;
  newState: ISlotAssignment | null;
  userId: string;
}

/**
 * Default slot configurations for each skeleton type
 */
export type SkeletonSlotConfigurationMap = {
  [K in SkeletonType]: SlotIdentifier[];
};

/**
 * Slot compatibility matrix
 */
export interface ISlotCompatibility {
  slotId: SlotIdentifier;
  compatibleCategories: (PartCategory | "expansionChip" | "soulChip")[];
  restrictions?: {
    maxParts: number;
    requiredParts: number;
    mutuallyExclusive?: SlotIdentifier[]; // Slots that can't be used together
  };
}
