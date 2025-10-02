/**
 * Test utilities for artifact package
 */

import {
  asset_kind,
  item_class,
  instance_state,
  robot_part_slot,
} from "@botking/db";

/**
 * Generate a random UUID-like string for testing
 */
export function generateTestId(): string {
  return `test-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Generate a random bigint for testing
 */
export function generateTestBigInt(): bigint {
  return BigInt(Math.floor(Math.random() * 1000000));
}

/**
 * Generate a random number for testing
 */
export function generateTestNumber(): number {
  return Math.floor(Math.random() * 1000);
}

/**
 * Generate test dates
 */
export function generateTestDates(): { createdAt: Date; updatedAt: Date } {
  const now = new Date();
  const createdAt = new Date(now.getTime() - Math.random() * 86400000); // Random time in last 24h
  const updatedAt = new Date(createdAt.getTime() + Math.random() * 86400000); // After createdAt
  return { createdAt, updatedAt };
}

/**
 * Enum values for testing
 */
export const TEST_ENUMS = {
  asset_kind: {
    ICON: "ICON" as asset_kind,
    CARD: "CARD" as asset_kind,
    SPRITE: "SPRITE" as asset_kind,
    THREE_D: "THREE_D" as asset_kind,
  },
  item_class: {
    SOUL_CHIP: "SOUL_CHIP" as item_class,
    SKELETON: "SKELETON" as item_class,
    PART: "PART" as item_class,
    EXPANSION_CHIP: "EXPANSION_CHIP" as item_class,
    MISC: "MISC" as item_class,
  },
  instance_state: {
    NEW: "NEW" as instance_state,
    USED: "USED" as instance_state,
    EQUIPPED: "EQUIPPED" as instance_state,
  },
  robot_part_slot: {
    TORSO: "TORSO" as robot_part_slot,
    ARM_R: "ARM_R" as robot_part_slot,
    ARM_L: "ARM_L" as robot_part_slot,
    LEGS: "LEGS" as robot_part_slot,
  },
};

/**
 * Get random enum value
 */
export function getRandomEnumValue<T>(enumObj: Record<string, T>): T {
  const values = Object.values(enumObj);
  return values[Math.floor(Math.random() * values.length)];
}

/**
 * Generate test email
 */
export function generateTestEmail(): string {
  return `test-${Math.random().toString(36).substr(2, 9)}@example.com`;
}

/**
 * Generate test URL
 */
export function generateTestUrl(): string {
  return `https://example.com/asset-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Generate test meta object
 */
export function generateTestMeta(): Record<string, any> {
  return {
    testProperty: `test-value-${Math.random().toString(36).substr(2, 9)}`,
    numericProperty: Math.floor(Math.random() * 100),
    booleanProperty: Math.random() > 0.5,
  };
}
