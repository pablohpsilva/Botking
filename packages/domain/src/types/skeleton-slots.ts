/**
 * Skeleton slot definitions and types for domain validation
 */

import { SkeletonType, PartCategory } from "@botking/db";

/**
 * Represents the slot configuration for a skeleton
 */
export interface ISkeletonSlots {
  /** Number of head slots available */
  headSlots: number;
  /** Number of torso slots available (always 1) */
  torsoSlots: number;
  /** Number of arm slots available */
  armSlots: number;
  /** Number of leg slots available */
  legSlots: number;
  /** Number of accessory slots available */
  accessorySlots: number;
  /** Number of expansion chip slots available */
  expansionSlots: number;
  /** Maximum number of soul chips (always 1) */
  soulChipSlots: number;
}

/**
 * Represents slot constraints for a skeleton type
 */
export interface ISkeletonSlotConstraints {
  /** Minimum number of slots required */
  min: number;
  /** Maximum number of slots allowed (or null for unlimited) */
  max: number | null;
  /** Default number of slots */
  default: number;
}

/**
 * Skeleton slot constraints by part category
 */
export interface ISkeletonTypeConstraints {
  [PartCategory.HEAD]: ISkeletonSlotConstraints;
  [PartCategory.TORSO]: ISkeletonSlotConstraints;
  [PartCategory.ARM]: ISkeletonSlotConstraints;
  [PartCategory.LEG]: ISkeletonSlotConstraints;
  [PartCategory.ACCESSORY]: ISkeletonSlotConstraints;
  expansionChips: ISkeletonSlotConstraints;
  soulChips: ISkeletonSlotConstraints;
}

/**
 * Part slot usage for validation
 */
export interface IPartSlotUsage {
  [PartCategory.HEAD]: number;
  [PartCategory.TORSO]: number;
  [PartCategory.ARM]: number;
  [PartCategory.LEG]: number;
  [PartCategory.ACCESSORY]: number;
  expansionChips: number;
  soulChips: number;
}

/**
 * Slot validation result for a specific category
 */
export interface ISlotValidationResult {
  category: PartCategory | "expansionChips" | "soulChips";
  isValid: boolean;
  currentCount: number;
  maxAllowed: number;
  minRequired: number;
  message?: string;
}

/**
 * Complete slot validation result
 */
export interface ISlotValidationResults {
  isValid: boolean;
  results: ISlotValidationResult[];
  errors: string[];
  warnings: string[];
}

/**
 * Skeleton slot configuration lookup by skeleton type
 */
export type SkeletonSlotConfig = {
  [K in SkeletonType]: ISkeletonTypeConstraints;
};
