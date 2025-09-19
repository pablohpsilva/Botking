import {
  Rarity,
  ItemCategory,
  ResourceType,
  EnhancementDuration,
  SpeedUpTarget,
  GemType,
} from "@botking/db";
import { z } from "zod";

// Import enum schemas from Prisma types
const RaritySchema = z.enum(Rarity);
const ItemCategorySchema = z.enum(ItemCategory);
const ResourceTypeSchema = z.enum(ResourceType);
const EnhancementDurationSchema = z.enum(EnhancementDuration);
const SpeedUpTargetSchema = z.enum(SpeedUpTarget);
const GemTypeSchema = z.enum(GemType);

// ============================================================================
// ITEM EFFECT SCHEMAS
// ============================================================================

/**
 * Schema for item effects (JSON field)
 */
export const ItemEffectSchema = z.object({
  id: z.string().optional(),
  type: z.enum([
    "stat_boost",
    "heal",
    "energy_restore",
    "buff",
    "debuff",
    "instant",
    "over_time",
    "conditional",
  ]),
  name: z.string().min(1, "Effect name is required"),
  description: z.string().min(1, "Effect description is required"),
  value: z.number().optional(),
  duration: z.number().int().min(0).optional(), // seconds, 0 = instant
  target: z
    .enum(["self", "bot", "party", "all_bots", "specific_bot"])
    .default("self"),
  conditions: z
    .array(
      z.object({
        type: z.enum(["health_below", "energy_below", "in_combat", "location"]),
        value: z.union([z.string(), z.number()]),
      })
    )
    .optional(),
  stackable: z.boolean().default(false),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

export type ItemEffect = z.infer<typeof ItemEffectSchema>;

/**
 * Schema for stat modifiers (JSON field)
 */
export const StatModifierSchema = z.object({
  stat: z.enum([
    "attack",
    "defense",
    "speed",
    "perception",
    "energy",
    "health",
    "experience_gain",
    "success_rate",
  ]),
  type: z.enum(["flat", "percentage", "multiplier"]),
  value: z.number(),
  duration: z.number().int().min(0).optional(), // seconds, 0 = permanent
  conditions: z
    .array(
      z.object({
        type: z.enum(["combat", "mission", "training", "always"]),
        value: z.string().optional(),
      })
    )
    .optional(),
});

export type StatModifier = z.infer<typeof StatModifierSchema>;

/**
 * Schema for trade history (JSON field)
 */
export const TradeHistoryEntrySchema = z.object({
  tradeId: z.string(),
  tradedAt: z.coerce.date(),
  tradedWith: z.string().optional(), // User ID
  tradedFor: z
    .array(
      z.object({
        itemId: z.string(),
        itemName: z.string(),
        quantity: z.number().int().min(1),
      })
    )
    .optional(),
  tradeValue: z.number().optional(),
  tradeType: z.enum(["player_trade", "npc_trade", "market_trade"]),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

export type TradeHistoryEntry = z.infer<typeof TradeHistoryEntrySchema>;

// ============================================================================
// BASE SCHEMAS
// ============================================================================

/**
 * Base Item model schema - represents the complete Item entity
 */
export const ItemSchema = z
  .object({
    id: z.string(),
    userId: z.string().nullable(),
    name: z.string(),
    category: ItemCategorySchema,
    rarity: RaritySchema,
    description: z.string(),
    consumable: z.boolean(),
    tradeable: z.boolean(),
    stackable: z.boolean(),
    maxStackSize: z.number().int(),
    value: z.number().int(),
    cooldownTime: z.number().int(),
    requirements: z.array(z.string()),
    source: z.string().nullable(),
    tags: z.array(z.string()),
    effects: z.array(ItemEffectSchema).nullable(),
    isProtected: z.boolean().nullable(),

    // Category-specific fields
    speedUpTarget: SpeedUpTargetSchema.nullable(),
    speedMultiplier: z.number().nullable(),
    timeReduction: z.number().int().nullable(),
    resourceType: ResourceTypeSchema.nullable(),
    resourceAmount: z.number().int().nullable(),
    enhancementType: ResourceTypeSchema.nullable(),
    enhancementDuration: EnhancementDurationSchema.nullable(),
    statModifiers: z.array(StatModifierSchema).nullable(),
    gemType: GemTypeSchema.nullable(),
    gemValue: z.number().int().nullable(),
    tradeHistory: z.array(TradeHistoryEntrySchema).nullable(),

    // Metadata
    version: z.number().int(),
    metadata: z.record(z.string(), z.unknown()).nullable(),
    createdAt: z.date(),
    updatedAt: z.date(),
  })
  .strict();

export type Item = z.infer<typeof ItemSchema>;

/**
 * Item input schema for forms and API inputs (without auto-generated fields)
 */
export const ItemInputSchema = z
  .object({
    userId: z.string().min(1).nullable().optional(),
    name: z.string().min(1, "Item name is required").max(100, "Name too long"),
    category: ItemCategorySchema,
    rarity: RaritySchema.default("COMMON"),
    description: z.string().min(1, "Description is required"),
    consumable: z.boolean().default(true),
    tradeable: z.boolean().default(false),
    stackable: z.boolean().default(true),
    maxStackSize: z
      .number()
      .int()
      .min(1, "Max stack size must be at least 1")
      .max(999999999, "Max stack size too large")
      .default(999999999),
    value: z
      .number()
      .int()
      .min(0, "Value cannot be negative")
      .max(1000000000, "Value too large")
      .default(1),
    cooldownTime: z
      .number()
      .int()
      .min(0, "Cooldown time cannot be negative")
      .max(86400, "Cooldown time too long") // 24 hours max
      .default(0),
    requirements: z.array(z.string().max(100)).default([]),
    source: z.string().max(200).nullable().optional(),
    tags: z
      .array(z.string().min(1).max(50))
      .max(20, "Too many tags")
      .default([]),
    effects: z.array(ItemEffectSchema).nullable().default([]),
    isProtected: z.boolean().nullable().default(false),

    // Category-specific fields
    speedUpTarget: SpeedUpTargetSchema.nullable().optional(),
    speedMultiplier: z
      .number()
      .min(0.1, "Speed multiplier too low")
      .max(100, "Speed multiplier too high")
      .nullable()
      .optional(),
    timeReduction: z
      .number()
      .int()
      .min(1, "Time reduction must be positive")
      .max(86400, "Time reduction too large") // 24 hours max
      .nullable()
      .optional(),
    resourceType: ResourceTypeSchema.nullable().optional(),
    resourceAmount: z
      .number()
      .int()
      .min(1, "Resource amount must be positive")
      .max(1000000, "Resource amount too large")
      .nullable()
      .optional(),
    enhancementType: ResourceTypeSchema.nullable().optional(),
    enhancementDuration: EnhancementDurationSchema.nullable().optional(),
    statModifiers: z.array(StatModifierSchema).nullable().optional(),
    gemType: GemTypeSchema.nullable().optional(),
    gemValue: z
      .number()
      .int()
      .min(1, "Gem value must be positive")
      .max(1000000, "Gem value too large")
      .nullable()
      .optional(),
    tradeHistory: z.array(TradeHistoryEntrySchema).nullable().default([]),

    // Metadata
    version: z.number().int().min(1).default(1),
    metadata: z.record(z.string(), z.unknown()).nullable().optional(),
  })
  .strict()
  .refine(
    (data) => {
      // SPEED_UP items must have speed-related fields
      if (data.category === "SPEED_UP") {
        return (
          data.speedUpTarget && (data.speedMultiplier || data.timeReduction)
        );
      }
      return true;
    },
    {
      message:
        "SPEED_UP items must have speedUpTarget and either speedMultiplier or timeReduction",
      path: ["category"],
    }
  )
  .refine(
    (data) => {
      // RESOURCE items must have resource-related fields
      if (data.category === "RESOURCE") {
        return data.resourceType && data.resourceAmount;
      }
      return true;
    },
    {
      message: "RESOURCE items must have resourceType and resourceAmount",
      path: ["category"],
    }
  )
  .refine(
    (data) => {
      // GEMS items must have gem-related fields
      if (data.category === "GEMS") {
        return data.gemType && data.gemValue;
      }
      return true;
    },
    {
      message: "GEMS items must have gemType and gemValue",
      path: ["category"],
    }
  );

export type ItemInput = z.infer<typeof ItemInputSchema>;

// ============================================================================
// CREATE SCHEMAS
// ============================================================================

/**
 * Schema for creating a new Item
 * Compatible with Prisma ItemCreateInput
 */
export const CreateItemSchema = z
  .object({
    id: z.string().optional(),
    userId: z.string().min(1).nullable().optional(),
    name: z.string().min(1, "Item name is required").max(100, "Name too long"),
    category: ItemCategorySchema,
    rarity: RaritySchema.default("COMMON"),
    description: z.string().min(1, "Description is required"),
    consumable: z.boolean().default(true),
    tradeable: z.boolean().default(false),
    stackable: z.boolean().default(true),
    maxStackSize: z.number().int().min(1).max(999999999).default(999999999),
    value: z.number().int().min(0).max(1000000000).default(1),
    cooldownTime: z.number().int().min(0).max(86400).default(0),
    requirements: z.array(z.string().max(100)).default([]),
    source: z.string().max(200).nullable().optional(),
    tags: z.array(z.string().min(1).max(50)).max(20).default([]),
    effects: z.array(ItemEffectSchema).nullable().default([]),
    isProtected: z.boolean().nullable().default(false),

    // Category-specific fields
    speedUpTarget: SpeedUpTargetSchema.nullable().optional(),
    speedMultiplier: z.number().min(0.1).max(100).nullable().optional(),
    timeReduction: z.number().int().min(1).max(86400).nullable().optional(),
    resourceType: ResourceTypeSchema.nullable().optional(),
    resourceAmount: z.number().int().min(1).max(1000000).nullable().optional(),
    enhancementType: ResourceTypeSchema.nullable().optional(),
    enhancementDuration: EnhancementDurationSchema.nullable().optional(),
    statModifiers: z.array(StatModifierSchema).nullable().optional(),
    gemType: GemTypeSchema.nullable().optional(),
    gemValue: z.number().int().min(1).max(1000000).nullable().optional(),
    tradeHistory: z.array(TradeHistoryEntrySchema).nullable().default([]),

    // Metadata
    version: z.number().int().min(1).default(1),
    metadata: z.record(z.string(), z.unknown()).nullable().optional(),
    createdAt: z.coerce.date().optional(),
    updatedAt: z.coerce.date().optional(),
  })
  .strict()
  .refine(
    (data) => {
      if (data.category === "SPEED_UP") {
        return (
          data.speedUpTarget && (data.speedMultiplier || data.timeReduction)
        );
      }
      if (data.category === "RESOURCE") {
        return data.resourceType && data.resourceAmount;
      }
      if (data.category === "GEMS") {
        return data.gemType && data.gemValue;
      }
      return true;
    },
    {
      message: "Category-specific fields are required",
      path: ["category"],
    }
  );

export type CreateItemInput = z.infer<typeof CreateItemSchema>;

/**
 * Simplified create schema for API endpoints
 */
export const CreateItemApiSchema = z
  .object({
    name: z.string().min(1, "Item name is required").max(100, "Name too long"),
    category: ItemCategorySchema,
    rarity: RaritySchema.default("COMMON"),
    description: z.string().min(1, "Description is required"),
    generateId: z.boolean().default(true),
    setDefaults: z.boolean().default(true),
    validateCategory: z.boolean().default(true),

    // Optional overrides
    consumable: z.boolean().optional(),
    tradeable: z.boolean().optional(),
    stackable: z.boolean().optional(),
    maxStackSize: z.number().int().min(1).max(999999999).optional(),
    value: z.number().int().min(0).max(1000000000).optional(),
    cooldownTime: z.number().int().min(0).max(86400).optional(),
    tags: z.array(z.string().min(1).max(50)).max(20).optional(),
    effects: z.array(ItemEffectSchema).optional(),

    // Category-specific fields (simplified)
    speedUpConfig: z
      .object({
        target: SpeedUpTargetSchema,
        multiplier: z.number().min(0.1).max(100).optional(),
        timeReduction: z.number().int().min(1).max(86400).optional(),
      })
      .optional(),
    resourceConfig: z
      .object({
        type: ResourceTypeSchema,
        amount: z.number().int().min(1).max(1000000),
        enhancementType: ResourceTypeSchema.optional(),
        enhancementDuration: EnhancementDurationSchema.optional(),
      })
      .optional(),
    gemConfig: z
      .object({
        type: GemTypeSchema,
        value: z.number().int().min(1).max(1000000),
      })
      .optional(),
  })
  .strict()
  .refine(
    (data) => {
      if (data.category === "SPEED_UP" && !data.speedUpConfig) {
        return false;
      }
      if (data.category === "RESOURCE" && !data.resourceConfig) {
        return false;
      }
      if (data.category === "GEMS" && !data.gemConfig) {
        return false;
      }
      return true;
    },
    {
      message: "Category-specific configuration is required",
      path: ["category"],
    }
  );

export type CreateItemApi = z.infer<typeof CreateItemApiSchema>;

// ============================================================================
// UPDATE SCHEMAS
// ============================================================================

/**
 * Schema for updating an Item
 * Compatible with Prisma ItemUpdateInput
 */
export const UpdateItemSchema = z
  .object({
    id: z.string().optional(),
    userId: z.string().min(1).nullable().optional(),
    name: z.string().min(1).max(100).optional(),
    category: ItemCategorySchema.optional(),
    rarity: RaritySchema.optional(),
    description: z.string().min(1).optional(),
    consumable: z.boolean().optional(),
    tradeable: z.boolean().optional(),
    stackable: z.boolean().optional(),
    maxStackSize: z.number().int().min(1).max(999999999).optional(),
    value: z.number().int().min(0).max(1000000000).optional(),
    cooldownTime: z.number().int().min(0).max(86400).optional(),
    requirements: z.array(z.string().max(100)).optional(),
    source: z.string().max(200).nullable().optional(),
    tags: z.array(z.string().min(1).max(50)).max(20).optional(),
    effects: z.array(ItemEffectSchema).nullable().optional(),
    isProtected: z.boolean().nullable().optional(),

    // Category-specific fields
    speedUpTarget: SpeedUpTargetSchema.nullable().optional(),
    speedMultiplier: z.number().min(0.1).max(100).nullable().optional(),
    timeReduction: z.number().int().min(1).max(86400).nullable().optional(),
    resourceType: ResourceTypeSchema.nullable().optional(),
    resourceAmount: z.number().int().min(1).max(1000000).nullable().optional(),
    enhancementType: ResourceTypeSchema.nullable().optional(),
    enhancementDuration: EnhancementDurationSchema.nullable().optional(),
    statModifiers: z.array(StatModifierSchema).nullable().optional(),
    gemType: GemTypeSchema.nullable().optional(),
    gemValue: z.number().int().min(1).max(1000000).nullable().optional(),
    tradeHistory: z.array(TradeHistoryEntrySchema).nullable().optional(),

    // Metadata
    version: z.number().int().min(1).optional(),
    metadata: z.record(z.string(), z.unknown()).nullable().optional(),
    createdAt: z.coerce.date().optional(),
    updatedAt: z.coerce.date().optional(),
  })
  .strict();

export type UpdateItemInput = z.infer<typeof UpdateItemSchema>;

/**
 * Simplified update schema for API endpoints
 */
export const UpdateItemApiSchema = z
  .object({
    name: z.string().min(1).max(100).optional(),
    description: z.string().min(1).optional(),
    rarity: RaritySchema.optional(),
    value: z.number().int().min(0).max(1000000000).optional(),
    cooldownTime: z.number().int().min(0).max(86400).optional(),
    tags: z.array(z.string().min(1).max(50)).max(20).optional(),
    addTags: z.array(z.string().min(1).max(50)).optional(),
    removeTags: z.array(z.string().min(1).max(50)).optional(),
    effects: z.array(ItemEffectSchema).optional(),
    addEffects: z.array(ItemEffectSchema).optional(),
    removeEffects: z.array(z.string()).optional(), // Effect IDs
    metadata: z.record(z.string(), z.unknown()).optional(),
    incrementVersion: z.boolean().default(false),
  })
  .strict();

export type UpdateItemApi = z.infer<typeof UpdateItemApiSchema>;

/**
 * Partial update schema - all fields optional
 */
export const PartialUpdateItemSchema = ItemInputSchema.partial();

export type PartialUpdateItem = z.infer<typeof PartialUpdateItemSchema>;

// ============================================================================
// ITEM USAGE SCHEMAS
// ============================================================================

/**
 * Schema for using/consuming an item
 */
export const UseItemSchema = z
  .object({
    itemId: z.string().min(1, "Item ID is required"),
    userId: z.string().min(1, "User ID is required"),
    targetId: z.string().optional(), // Bot ID, etc.
    quantity: z.number().int().min(1, "Quantity must be positive").default(1),
    context: z
      .object({
        location: z.enum(["inventory", "combat", "mission", "training"]),
        source: z.enum(["user_action", "auto_use", "quest_reward"]),
        metadata: z.record(z.string(), z.unknown()).optional(),
      })
      .optional(),
    validateCooldown: z.boolean().default(true),
    validateRequirements: z.boolean().default(true),
    recordUsage: z.boolean().default(true),
  })
  .strict();

export type UseItem = z.infer<typeof UseItemSchema>;

/**
 * Schema for crafting an item
 */
export const CraftItemSchema = z
  .object({
    recipeId: z.string().min(1, "Recipe ID is required"),
    userId: z.string().min(1, "User ID is required"),
    ingredients: z
      .array(
        z.object({
          itemId: z.string().min(1, "Item ID is required"),
          quantity: z.number().int().min(1, "Quantity must be positive"),
        })
      )
      .min(1, "At least one ingredient is required"),
    quantity: z.number().int().min(1, "Quantity must be positive").default(1),
    validateIngredients: z.boolean().default(true),
    consumeIngredients: z.boolean().default(true),
    addToInventory: z.boolean().default(true),
  })
  .strict();

export type CraftItem = z.infer<typeof CraftItemSchema>;

/**
 * Schema for trading an item
 */
export const TradeItemSchema = z
  .object({
    itemId: z.string().min(1, "Item ID is required"),
    fromUserId: z.string().min(1, "From user ID is required"),
    toUserId: z.string().min(1, "To user ID is required").optional(),
    quantity: z.number().int().min(1, "Quantity must be positive"),
    tradeType: z.enum(["player_trade", "npc_trade", "market_trade"]),
    tradeValue: z.number().min(0, "Trade value cannot be negative").optional(),
    tradedForItems: z
      .array(
        z.object({
          itemId: z.string().min(1, "Item ID is required"),
          quantity: z.number().int().min(1, "Quantity must be positive"),
        })
      )
      .optional(),
    validateTradeable: z.boolean().default(true),
    recordTradeHistory: z.boolean().default(true),
    transferOwnership: z.boolean().default(true),
  })
  .strict();

export type TradeItem = z.infer<typeof TradeItemSchema>;

// ============================================================================
// QUERY SCHEMAS
// ============================================================================

/**
 * Schema for finding a unique Item
 */
export const FindUniqueItemSchema = z
  .object({
    id: z.string().optional(),
  })
  .strict();

export type FindUniqueItemInput = z.infer<typeof FindUniqueItemSchema>;

/**
 * Schema for filtering Items
 */
export const ItemWhereSchema: z.ZodType<any> = z.lazy(() =>
  z
    .object({
      id: z.string().optional(),
      userId: z.string().nullable().optional(),
      name: z.string().optional(),
      category: ItemCategorySchema.optional(),
      rarity: RaritySchema.optional(),
      consumable: z.boolean().optional(),
      tradeable: z.boolean().optional(),
      stackable: z.boolean().optional(),
      value: z.number().int().optional(),
      cooldownTime: z.number().int().optional(),
      tags: z.array(z.string()).optional(),
      isProtected: z.boolean().nullable().optional(),
      speedUpTarget: SpeedUpTargetSchema.nullable().optional(),
      resourceType: ResourceTypeSchema.nullable().optional(),
      enhancementType: ResourceTypeSchema.nullable().optional(),
      enhancementDuration: EnhancementDurationSchema.nullable().optional(),
      gemType: GemTypeSchema.nullable().optional(),
      version: z.number().int().optional(),
      createdAt: z.date().optional(),
      updatedAt: z.date().optional(),
      AND: z.array(ItemWhereSchema).optional(),
      OR: z.array(ItemWhereSchema).optional(),
      NOT: ItemWhereSchema.optional(),
    })
    .strict()
);

export type ItemWhere = z.infer<typeof ItemWhereSchema>;

/**
 * Schema for ordering Items
 */
export const ItemOrderBySchema = z
  .object({
    id: z.enum(["asc", "desc"]).optional(),
    userId: z.enum(["asc", "desc"]).optional(),
    name: z.enum(["asc", "desc"]).optional(),
    category: z.enum(["asc", "desc"]).optional(),
    rarity: z.enum(["asc", "desc"]).optional(),
    value: z.enum(["asc", "desc"]).optional(),
    cooldownTime: z.enum(["asc", "desc"]).optional(),
    version: z.enum(["asc", "desc"]).optional(),
    createdAt: z.enum(["asc", "desc"]).optional(),
    updatedAt: z.enum(["asc", "desc"]).optional(),
  })
  .strict();

export type ItemOrderBy = z.infer<typeof ItemOrderBySchema>;

/**
 * Schema for selecting Item fields
 */
export const ItemSelectSchema = z
  .object({
    id: z.boolean().optional(),
    userId: z.boolean().optional(),
    name: z.boolean().optional(),
    category: z.boolean().optional(),
    rarity: z.boolean().optional(),
    description: z.boolean().optional(),
    consumable: z.boolean().optional(),
    tradeable: z.boolean().optional(),
    stackable: z.boolean().optional(),
    maxStackSize: z.boolean().optional(),
    value: z.boolean().optional(),
    cooldownTime: z.boolean().optional(),
    requirements: z.boolean().optional(),
    source: z.boolean().optional(),
    tags: z.boolean().optional(),
    effects: z.boolean().optional(),
    isProtected: z.boolean().optional(),
    speedUpTarget: z.boolean().optional(),
    speedMultiplier: z.boolean().optional(),
    timeReduction: z.boolean().optional(),
    resourceType: z.boolean().optional(),
    resourceAmount: z.boolean().optional(),
    enhancementType: z.boolean().optional(),
    enhancementDuration: z.boolean().optional(),
    statModifiers: z.boolean().optional(),
    gemType: z.boolean().optional(),
    gemValue: z.boolean().optional(),
    tradeHistory: z.boolean().optional(),
    version: z.boolean().optional(),
    metadata: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    updatedAt: z.boolean().optional(),
    user: z.boolean().optional(),
    userInventories: z.boolean().optional(),
    tradeOfferItems: z.boolean().optional(),
  })
  .strict();

export type ItemSelect = z.infer<typeof ItemSelectSchema>;

/**
 * Schema for including Item relations
 */
export const ItemIncludeSchema = z
  .object({
    user: z.boolean().optional(),
    userInventories: z.boolean().optional(),
    tradeOfferItems: z.boolean().optional(),
  })
  .strict();

export type ItemInclude = z.infer<typeof ItemIncludeSchema>;

// ============================================================================
// PAGINATION SCHEMAS
// ============================================================================

/**
 * Schema for paginated Item queries
 */
export const FindManyItemsSchema = z
  .object({
    where: ItemWhereSchema.optional(),
    orderBy: z
      .union([ItemOrderBySchema, z.array(ItemOrderBySchema)])
      .optional(),
    select: ItemSelectSchema.optional(),
    include: ItemIncludeSchema.optional(),
    skip: z.number().int().min(0).optional(),
    take: z.number().int().min(1).max(1000).optional(),
    cursor: FindUniqueItemSchema.optional(),
  })
  .strict();

export type FindManyItemsInput = z.infer<typeof FindManyItemsSchema>;

// ============================================================================
// VALIDATION HELPERS
// ============================================================================

/**
 * Schema for searching and filtering items
 */
export const SearchItemsSchema = z
  .object({
    query: z.string().optional(),
    category: ItemCategorySchema.optional(),
    rarity: RaritySchema.optional(),
    tags: z.array(z.string()).optional(),
    minValue: z.number().int().min(0).optional(),
    maxValue: z.number().int().min(0).optional(),
    consumable: z.boolean().optional(),
    tradeable: z.boolean().optional(),
    stackable: z.boolean().optional(),
    hasEffects: z.boolean().optional(),
    requirementsMet: z.boolean().optional(),
    userId: z.string().optional(),
    includeSystemItems: z.boolean().default(true),
    sortBy: z
      .enum(["name", "value", "rarity", "category", "createdAt", "updatedAt"])
      .default("name"),
    sortOrder: z.enum(["asc", "desc"]).default("asc"),
    limit: z.number().int().min(1).max(100).default(20),
  })
  .strict();

export type SearchItems = z.infer<typeof SearchItemsSchema>;

/**
 * Schema for item validation
 */
export const ValidateItemSchema = z
  .object({
    itemId: z.string().min(1, "Item ID is required"),
    validationType: z.enum([
      "category_consistency",
      "effect_validity",
      "requirements_check",
      "trade_history_integrity",
      "metadata_structure",
    ]),
    fixIssues: z.boolean().default(false),
    generateReport: z.boolean().default(true),
  })
  .strict();

export type ValidateItem = z.infer<typeof ValidateItemSchema>;

/**
 * Schema for analyzing item usage
 */
export const AnalyzeItemUsageSchema = z
  .object({
    itemId: z.string().min(1, "Item ID is required").optional(),
    category: ItemCategorySchema.optional(),
    timeRange: z
      .object({
        startDate: z.coerce.date(),
        endDate: z.coerce.date(),
      })
      .refine((data) => data.startDate < data.endDate, {
        message: "Start date must be before end date",
        path: ["endDate"],
      })
      .optional(),
    includeUsagePatterns: z.boolean().default(true),
    includePopularityMetrics: z.boolean().default(true),
    includeEffectivenessMetrics: z.boolean().default(true),
    includeRecommendations: z.boolean().default(true),
  })
  .strict();

export type AnalyzeItemUsage = z.infer<typeof AnalyzeItemUsageSchema>;

// ============================================================================
// RESPONSE SCHEMAS
// ============================================================================

/**
 * Schema for Item API responses
 */
export const ItemResponseSchema = ItemSchema;

export type ItemResponse = z.infer<typeof ItemResponseSchema>;

/**
 * Schema for Item with User information
 */
export const ItemWithUserSchema = ItemResponseSchema.extend({
  user: z
    .object({
      id: z.string(),
      name: z.string().nullable(),
      email: z.string(),
    })
    .nullable(),
});

export type ItemWithUser = z.infer<typeof ItemWithUserSchema>;

/**
 * Schema for Item summary (minimal info)
 */
export const ItemSummarySchema = z
  .object({
    id: z.string(),
    name: z.string(),
    category: z.string(),
    rarity: z.string(),
    value: z.number().int(),
    consumable: z.boolean(),
    tradeable: z.boolean(),
    stackable: z.boolean(),
    hasEffects: z.boolean(),
    updatedAt: z.date(),
  })
  .strict();

export type ItemSummary = z.infer<typeof ItemSummarySchema>;

/**
 * Schema for item usage result
 */
export const ItemUsageResultSchema = z
  .object({
    itemId: z.string(),
    userId: z.string(),
    targetId: z.string().optional(),
    quantityUsed: z.number().int().min(1),
    effectsApplied: z.array(
      z.object({
        effectId: z.string(),
        effectName: z.string(),
        success: z.boolean(),
        value: z.number().optional(),
        duration: z.number().optional(),
        error: z.string().optional(),
      })
    ),
    remainingQuantity: z.number().int().min(0),
    cooldownUntil: z.date().optional(),
    success: z.boolean(),
    errors: z.array(z.string()).optional(),
    metadata: z.record(z.string(), z.unknown()).optional(),
  })
  .strict();

export type ItemUsageResult = z.infer<typeof ItemUsageResultSchema>;

/**
 * Schema for item analysis result
 */
export const ItemAnalysisResultSchema = z
  .object({
    itemId: z.string().optional(),
    category: z.string().optional(),
    timeRange: z
      .object({
        startDate: z.date(),
        endDate: z.date(),
      })
      .optional(),
    usageStatistics: z.object({
      totalUsages: z.number().int().min(0),
      uniqueUsers: z.number().int().min(0),
      averageUsagePerUser: z.number(),
      popularityRank: z.number().int().min(1).optional(),
      usageTrends: z.array(
        z.object({
          date: z.date(),
          usageCount: z.number().int().min(0),
        })
      ),
    }),
    effectivenessMetrics: z.object({
      successRate: z.number().min(0).max(1),
      averageEffectValue: z.number().optional(),
      userSatisfactionScore: z.number().min(0).max(5).optional(),
      repeatUsageRate: z.number().min(0).max(1),
    }),
    economicMetrics: z.object({
      averageTradeValue: z.number().optional(),
      marketDemand: z.enum(["low", "medium", "high"]).optional(),
      priceStability: z.number().min(0).max(1).optional(),
      totalTradeVolume: z.number().int().min(0).optional(),
    }),
    recommendations: z.array(
      z.object({
        type: z.enum([
          "balance_adjustment",
          "effect_modification",
          "economy_adjustment",
          "availability_change",
        ]),
        description: z.string(),
        priority: z.enum(["low", "medium", "high"]),
        estimatedImpact: z.number().min(0).max(1),
      })
    ),
  })
  .strict();

export type ItemAnalysisResult = z.infer<typeof ItemAnalysisResultSchema>;

// ============================================================================
// ADMIN SCHEMAS
// ============================================================================

/**
 * Schema for admin item management
 */
export const AdminItemManagementSchema = z
  .object({
    action: z.enum([
      "list_all",
      "validate_all",
      "fix_inconsistencies",
      "update_values",
      "rebalance_economy",
      "generate_report",
      "cleanup_orphaned",
      "bulk_update",
    ]),
    filters: z
      .object({
        category: ItemCategorySchema.optional(),
        rarity: RaritySchema.optional(),
        hasIssues: z.boolean().optional(),
        isOrphaned: z.boolean().optional(),
        lastUpdatedBefore: z.coerce.date().optional(),
      })
      .optional(),
    updateOptions: z
      .object({
        rebalanceValues: z.boolean().default(false),
        updateCooldowns: z.boolean().default(false),
        normalizeEffects: z.boolean().default(false),
        validateCategories: z.boolean().default(true),
      })
      .optional(),
    bulkUpdateData: z
      .object({
        valueMultiplier: z.number().min(0.1).max(10).optional(),
        cooldownAdjustment: z.number().int().optional(),
        addTags: z.array(z.string()).optional(),
        removeTags: z.array(z.string()).optional(),
      })
      .optional(),
  })
  .strict();

export type AdminItemManagement = z.infer<typeof AdminItemManagementSchema>;

/**
 * Schema for item statistics
 */
export const ItemStatsSchema = z
  .object({
    totalItems: z.number().int().min(0),
    itemsByCategory: z.record(z.string(), z.number().int().min(0)),
    itemsByRarity: z.record(z.string(), z.number().int().min(0)),
    averageValue: z.number(),
    totalValue: z.number(),
    usageStatistics: z.object({
      totalUsages: z.number().int().min(0),
      mostUsedItems: z.array(
        z.object({
          itemId: z.string(),
          itemName: z.string(),
          usageCount: z.number().int().min(0),
        })
      ),
      usageByCategory: z.record(z.string(), z.number().int().min(0)),
    }),
    economicMetrics: z.object({
      totalTradeVolume: z.number().int().min(0),
      averageTradeValue: z.number(),
      mostTradedItems: z.array(
        z.object({
          itemId: z.string(),
          itemName: z.string(),
          tradeCount: z.number().int().min(0),
        })
      ),
      marketStability: z.number().min(0).max(1),
    }),
    qualityMetrics: z.object({
      itemsWithIssues: z.number().int().min(0),
      orphanedItems: z.number().int().min(0),
      averageEffectCount: z.number(),
      itemsWithEffects: z.number().int().min(0),
    }),
  })
  .strict();

export type ItemStats = z.infer<typeof ItemStatsSchema>;

// ============================================================================
// EXPORTS
// ============================================================================

// All schemas are defined above and exported individually

// Export all validation functions
export const ItemValidation = {
  // Base schemas
  model: ItemSchema,
  input: ItemInputSchema,

  // CRUD schemas
  create: CreateItemSchema,
  createApi: CreateItemApiSchema,
  update: UpdateItemSchema,
  updateApi: UpdateItemApiSchema,
  partialUpdate: PartialUpdateItemSchema,

  // Item operation schemas
  use: UseItemSchema,
  craft: CraftItemSchema,
  trade: TradeItemSchema,

  // Query schemas
  findUnique: FindUniqueItemSchema,
  findMany: FindManyItemsSchema,
  where: ItemWhereSchema,
  orderBy: ItemOrderBySchema,
  select: ItemSelectSchema,
  include: ItemIncludeSchema,

  // Helpers
  search: SearchItemsSchema,
  validate: ValidateItemSchema,
  analyzeUsage: AnalyzeItemUsageSchema,

  // Response schemas
  response: ItemResponseSchema,
  withUser: ItemWithUserSchema,
  summary: ItemSummarySchema,
  usageResult: ItemUsageResultSchema,
  analysisResult: ItemAnalysisResultSchema,

  // Admin schemas
  adminManagement: AdminItemManagementSchema,
  stats: ItemStatsSchema,

  // Component schemas
  effect: ItemEffectSchema,
  statModifier: StatModifierSchema,
  tradeHistoryEntry: TradeHistoryEntrySchema,

  // Enum schemas
  category: ItemCategorySchema,
  rarity: RaritySchema,
  resourceType: ResourceTypeSchema,
  enhancementDuration: EnhancementDurationSchema,
  speedUpTarget: SpeedUpTargetSchema,
  gemType: GemTypeSchema,
} as const;
