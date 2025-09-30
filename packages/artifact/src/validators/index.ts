/**
 * Zod Validators for Artifact Objects
 *
 * This module exports all Zod validation schemas for CRUD operations
 * on artifact objects. Each validator includes schemas for:
 * - Create: For creating new records (excludes auto-generated fields)
 * - Read: For querying/filtering records (all fields optional)
 * - Update: For updating existing records (requires ID, other fields optional)
 * - Delete: For deleting records (requires ID or composite key)
 * - Base: Complete schema with all fields (for type inference)
 */

// Asset Pack validators
export * from "./asset-pack.validator";

// Asset validators
export * from "./asset.validator";

// Expansion Slot validators
export * from "./expansion-slot.validator";

// Identity Link validators
export * from "./identity-link.validator";

// Instance validators
export * from "./instance.validator";

// Inventory Stack validators
export * from "./inventory-stack.validator";

// Item Template Asset validators
export * from "./item-template-asset.validator";

// Parts Slot validators
export * from "./parts-slot.validator";

// Player Account validators
export * from "./player-account.validator";

// Robot validators
export * from "./robot.validator";

// Shard validators
export * from "./shard.validator";

// Skeleton Slot validators
export * from "./skeleton-slot.validator";

// Soul Chip Slot validators
export * from "./soul-chip-slot.validator";

// Template validators
export * from "./template.validator";

// User validators
export * from "./user.validator";

/**
 * Validation utility functions
 */

/**
 * Validates data against a schema and returns the result with proper error handling
 */
export function validateData<T>(
  schema: any,
  data: unknown
): { success: true; data: T } | { success: false; error: string } {
  try {
    const result = schema.parse(data);
    return { success: true, data: result };
  } catch (error: any) {
    return {
      success: false,
      error:
        error.errors
          ?.map((e: any) => `${e.path.join(".")}: ${e.message}`)
          .join(", ") || error.message,
    };
  }
}

/**
 * Safely validates data and returns the parsed result or undefined
 */
export function safeValidate<T>(schema: any, data: unknown): T | undefined {
  const result = schema.safeParse(data);
  return result.success ? result.data : undefined;
}
