import { BotLocation } from "@botking/db";
import { z } from "zod";

// Import enum schemas from Prisma types
const BotLocationSchema = z.enum(BotLocation);

// ============================================================================
// BASE SCHEMAS
// ============================================================================

/**
 * Base BotState model schema - represents the complete BotState entity
 */
export const BotStateSchema = z
  .object({
    id: z.string(),
    userId: z.string(),
    botId: z.string(),
    energyLevel: z.number().int(),
    healthLevel: z.number().int(),
    currentLocation: BotLocationSchema,
    experience: z.number().int(),
    bondLevel: z.number().int().nullable(),
    level: z.number().int(),
    energy: z.number().int(),
    maxEnergy: z.number().int(),
    health: z.number().int(),
    maxHealth: z.number().int(),
    createdAt: z.date(),
    updatedAt: z.date(),
  })
  .strict();

export type BotState = z.infer<typeof BotStateSchema>;

/**
 * BotState input schema for forms and API inputs (without auto-generated fields)
 */
export const BotStateInputSchema = z
  .object({
    userId: z.string().min(1, "User ID is required"),
    botId: z.string().min(1, "Bot ID is required"),
    energyLevel: z
      .number()
      .int()
      .min(0, "Energy level cannot be negative")
      .max(10000, "Energy level cannot exceed 10000")
      .default(100),
    healthLevel: z
      .number()
      .int()
      .min(0, "Health level cannot be negative")
      .max(10000, "Health level cannot exceed 10000")
      .default(100),
    currentLocation: BotLocationSchema.default("STORAGE"),
    experience: z
      .number()
      .int()
      .min(0, "Experience cannot be negative")
      .max(1000000, "Experience cannot exceed 1000000")
      .default(0),
    bondLevel: z
      .number()
      .int()
      .min(0, "Bond level cannot be negative")
      .max(100, "Bond level cannot exceed 100")
      .nullable()
      .default(0),
    level: z
      .number()
      .int()
      .min(1, "Level must be at least 1")
      .max(100, "Level cannot exceed 100")
      .default(1),
    energy: z
      .number()
      .int()
      .min(0, "Energy cannot be negative")
      .max(10000, "Energy cannot exceed 10000")
      .default(100),
    maxEnergy: z
      .number()
      .int()
      .min(1, "Max energy must be at least 1")
      .max(10000, "Max energy cannot exceed 10000")
      .default(100),
    health: z
      .number()
      .int()
      .min(0, "Health cannot be negative")
      .max(10000, "Health cannot exceed 10000")
      .default(100),
    maxHealth: z
      .number()
      .int()
      .min(1, "Max health must be at least 1")
      .max(10000, "Max health cannot exceed 10000")
      .default(100),
  })
  .strict()
  .refine((data) => data.energyLevel <= data.maxEnergy, {
    message: "Energy level cannot exceed max energy",
    path: ["energyLevel"],
  })
  .refine((data) => data.energy <= data.maxEnergy, {
    message: "Energy cannot exceed max energy",
    path: ["energy"],
  })
  .refine((data) => data.healthLevel <= data.maxHealth, {
    message: "Health level cannot exceed max health",
    path: ["healthLevel"],
  })
  .refine((data) => data.health <= data.maxHealth, {
    message: "Health cannot exceed max health",
    path: ["health"],
  });

export type BotStateInput = z.infer<typeof BotStateInputSchema>;

// ============================================================================
// CREATE SCHEMAS
// ============================================================================

/**
 * Schema for creating a new BotState
 * Compatible with Prisma BotStateCreateInput
 */
export const CreateBotStateSchema = z
  .object({
    id: z.string().optional(),
    userId: z.string().min(1, "User ID is required"),
    botId: z.string().min(1, "Bot ID is required"),
    energyLevel: z
      .number()
      .int()
      .min(0, "Energy level cannot be negative")
      .max(10000, "Energy level cannot exceed 10000")
      .default(100),
    healthLevel: z
      .number()
      .int()
      .min(0, "Health level cannot be negative")
      .max(10000, "Health level cannot exceed 10000")
      .default(100),
    currentLocation: BotLocationSchema.default("STORAGE"),
    experience: z
      .number()
      .int()
      .min(0, "Experience cannot be negative")
      .max(1000000, "Experience cannot exceed 1000000")
      .default(0),
    bondLevel: z
      .number()
      .int()
      .min(0, "Bond level cannot be negative")
      .max(100, "Bond level cannot exceed 100")
      .nullable()
      .default(0),
    level: z
      .number()
      .int()
      .min(1, "Level must be at least 1")
      .max(100, "Level cannot exceed 100")
      .default(1),
    energy: z
      .number()
      .int()
      .min(0, "Energy cannot be negative")
      .max(10000, "Energy cannot exceed 10000")
      .default(100),
    maxEnergy: z
      .number()
      .int()
      .min(1, "Max energy must be at least 1")
      .max(10000, "Max energy cannot exceed 10000")
      .default(100),
    health: z
      .number()
      .int()
      .min(0, "Health cannot be negative")
      .max(10000, "Health cannot exceed 10000")
      .default(100),
    maxHealth: z
      .number()
      .int()
      .min(1, "Max health must be at least 1")
      .max(10000, "Max health cannot exceed 10000")
      .default(100),
    createdAt: z.coerce.date().optional(),
    updatedAt: z.coerce.date().optional(),
  })
  .strict()
  .refine((data) => data.energyLevel <= data.maxEnergy, {
    message: "Energy level cannot exceed max energy",
    path: ["energyLevel"],
  })
  .refine((data) => data.energy <= data.maxEnergy, {
    message: "Energy cannot exceed max energy",
    path: ["energy"],
  })
  .refine((data) => data.healthLevel <= data.maxHealth, {
    message: "Health level cannot exceed max health",
    path: ["healthLevel"],
  })
  .refine((data) => data.health <= data.maxHealth, {
    message: "Health cannot exceed max health",
    path: ["health"],
  });

export type CreateBotStateInput = z.infer<typeof CreateBotStateSchema>;

/**
 * Simplified create schema for API endpoints
 */
export const CreateBotStateApiSchema = z
  .object({
    userId: z.string().min(1, "User ID is required"),
    botId: z.string().min(1, "Bot ID is required"),
    initialLocation: BotLocationSchema.optional(),
    customMaxEnergy: z
      .number()
      .int()
      .min(1, "Max energy must be at least 1")
      .max(10000, "Max energy cannot exceed 10000")
      .optional(),
    customMaxHealth: z
      .number()
      .int()
      .min(1, "Max health must be at least 1")
      .max(10000, "Max health cannot exceed 10000")
      .optional(),
    enableBondLevel: z.boolean().default(true),
  })
  .strict();

export type CreateBotStateApi = z.infer<typeof CreateBotStateApiSchema>;

// ============================================================================
// UPDATE SCHEMAS
// ============================================================================

/**
 * Schema for updating a BotState
 * Compatible with Prisma BotStateUpdateInput
 */
export const UpdateBotStateSchema = z
  .object({
    id: z.string().optional(),
    userId: z.string().min(1, "User ID is required").optional(),
    botId: z.string().min(1, "Bot ID is required").optional(),
    energyLevel: z
      .number()
      .int()
      .min(0, "Energy level cannot be negative")
      .max(10000, "Energy level cannot exceed 10000")
      .optional(),
    healthLevel: z
      .number()
      .int()
      .min(0, "Health level cannot be negative")
      .max(10000, "Health level cannot exceed 10000")
      .optional(),
    currentLocation: BotLocationSchema.optional(),
    experience: z
      .number()
      .int()
      .min(0, "Experience cannot be negative")
      .max(1000000, "Experience cannot exceed 1000000")
      .optional(),
    bondLevel: z
      .number()
      .int()
      .min(0, "Bond level cannot be negative")
      .max(100, "Bond level cannot exceed 100")
      .nullable()
      .optional(),
    level: z
      .number()
      .int()
      .min(1, "Level must be at least 1")
      .max(100, "Level cannot exceed 100")
      .optional(),
    energy: z
      .number()
      .int()
      .min(0, "Energy cannot be negative")
      .max(10000, "Energy cannot exceed 10000")
      .optional(),
    maxEnergy: z
      .number()
      .int()
      .min(1, "Max energy must be at least 1")
      .max(10000, "Max energy cannot exceed 10000")
      .optional(),
    health: z
      .number()
      .int()
      .min(0, "Health cannot be negative")
      .max(10000, "Health cannot exceed 10000")
      .optional(),
    maxHealth: z
      .number()
      .int()
      .min(1, "Max health must be at least 1")
      .max(10000, "Max health cannot exceed 10000")
      .optional(),
    createdAt: z.coerce.date().optional(),
    updatedAt: z.coerce.date().optional(),
  })
  .strict();

export type UpdateBotStateInput = z.infer<typeof UpdateBotStateSchema>;

/**
 * Simplified update schema for API endpoints
 */
export const UpdateBotStateApiSchema = z
  .object({
    currentLocation: BotLocationSchema.optional(),
  })
  .strict();

export type UpdateBotStateApi = z.infer<typeof UpdateBotStateApiSchema>;

/**
 * Partial update schema - all fields optional
 */
export const PartialUpdateBotStateSchema = BotStateInputSchema.partial();
export type PartialUpdateBotState = z.infer<typeof PartialUpdateBotStateSchema>;

/**
 * Schema for energy modifications
 */
export const UpdateBotStateEnergySchema = z
  .object({
    energyLevel: z
      .number()
      .int()
      .min(0, "Energy level cannot be negative")
      .max(10000, "Energy level cannot exceed 10000")
      .optional(),
    energy: z
      .number()
      .int()
      .min(0, "Energy cannot be negative")
      .max(10000, "Energy cannot exceed 10000")
      .optional(),
    maxEnergy: z
      .number()
      .int()
      .min(1, "Max energy must be at least 1")
      .max(10000, "Max energy cannot exceed 10000")
      .optional(),
    energyChange: z
      .number()
      .int()
      .min(-1000, "Energy change too negative")
      .max(1000, "Energy change too positive")
      .optional(),
    syncLegacyFields: z.boolean().default(true),
  })
  .strict()
  .refine(
    (data) => {
      return (
        data.energyLevel !== undefined ||
        data.energy !== undefined ||
        data.maxEnergy !== undefined ||
        data.energyChange !== undefined
      );
    },
    {
      message: "At least one energy operation must be specified",
    }
  );

export type UpdateBotStateEnergy = z.infer<typeof UpdateBotStateEnergySchema>;

/**
 * Schema for health modifications
 */
export const UpdateBotStateHealthSchema = z
  .object({
    healthLevel: z
      .number()
      .int()
      .min(0, "Health level cannot be negative")
      .max(10000, "Health level cannot exceed 10000")
      .optional(),
    health: z
      .number()
      .int()
      .min(0, "Health cannot be negative")
      .max(10000, "Health cannot exceed 10000")
      .optional(),
    maxHealth: z
      .number()
      .int()
      .min(1, "Max health must be at least 1")
      .max(10000, "Max health cannot exceed 10000")
      .optional(),
    healthChange: z
      .number()
      .int()
      .min(-1000, "Health change too negative")
      .max(1000, "Health change too positive")
      .optional(),
    healingType: z
      .enum(["natural", "repair", "upgrade", "emergency"])
      .optional(),
    syncLegacyFields: z.boolean().default(true),
  })
  .strict()
  .refine(
    (data) => {
      return (
        data.healthLevel !== undefined ||
        data.health !== undefined ||
        data.maxHealth !== undefined ||
        data.healthChange !== undefined
      );
    },
    {
      message: "At least one health operation must be specified",
    }
  );

export type UpdateBotStateHealth = z.infer<typeof UpdateBotStateHealthSchema>;

/**
 * Schema for experience and leveling
 */
export const UpdateBotStateExperienceSchema = z
  .object({
    experienceGain: z
      .number()
      .int()
      .min(1, "Experience gain must be positive")
      .max(10000, "Experience gain too large"),
    experienceSource: z.enum([
      "mission",
      "combat",
      "training",
      "crafting",
      "exploration",
      "bonus",
    ]),
    autoLevelUp: z.boolean().default(true),
    levelUpBonuses: z
      .object({
        energyBonus: z.number().int().min(0).max(100).default(10),
        healthBonus: z.number().int().min(0).max(100).default(10),
        bondBonus: z.number().int().min(0).max(5).default(1),
      })
      .optional(),
  })
  .strict();

export type UpdateBotStateExperience = z.infer<
  typeof UpdateBotStateExperienceSchema
>;

// ============================================================================
// QUERY SCHEMAS
// ============================================================================

/**
 * Schema for finding a unique BotState
 */
export const FindUniqueBotStateSchema = z
  .object({
    id: z.string().optional(),
    userId: z.string().optional(),
    botId: z.string().optional(),
    userId_botId: z
      .object({
        userId: z.string(),
        botId: z.string(),
      })
      .optional(),
  })
  .strict();

export type FindUniqueBotStateInput = z.infer<typeof FindUniqueBotStateSchema>;

/**
 * Schema for filtering BotStates
 */
export const BotStateWhereSchema: z.ZodType<any> = z.lazy(() =>
  z
    .object({
      id: z.string().optional(),
      userId: z.string().optional(),
      botId: z.string().optional(),
      energyLevel: z.number().int().optional(),
      healthLevel: z.number().int().optional(),
      currentLocation: BotLocationSchema.optional(),
      experience: z.number().int().optional(),
      bondLevel: z.number().int().nullable().optional(),
      level: z.number().int().optional(),
      energy: z.number().int().optional(),
      maxEnergy: z.number().int().optional(),
      health: z.number().int().optional(),
      maxHealth: z.number().int().optional(),
      createdAt: z.date().optional(),
      updatedAt: z.date().optional(),
      AND: z.array(BotStateWhereSchema).optional(),
      OR: z.array(BotStateWhereSchema).optional(),
      NOT: BotStateWhereSchema.optional(),
    })
    .strict()
);

export type BotStateWhere = z.infer<typeof BotStateWhereSchema>;

/**
 * Schema for ordering BotStates
 */
export const BotStateOrderBySchema = z
  .object({
    id: z.enum(["asc", "desc"]).optional(),
    userId: z.enum(["asc", "desc"]).optional(),
    botId: z.enum(["asc", "desc"]).optional(),
    energyLevel: z.enum(["asc", "desc"]).optional(),
    healthLevel: z.enum(["asc", "desc"]).optional(),
    currentLocation: z.enum(["asc", "desc"]).optional(),
    experience: z.enum(["asc", "desc"]).optional(),
    bondLevel: z.enum(["asc", "desc"]).optional(),
    level: z.enum(["asc", "desc"]).optional(),
    energy: z.enum(["asc", "desc"]).optional(),
    maxEnergy: z.enum(["asc", "desc"]).optional(),
    health: z.enum(["asc", "desc"]).optional(),
    maxHealth: z.enum(["asc", "desc"]).optional(),
    createdAt: z.enum(["asc", "desc"]).optional(),
    updatedAt: z.enum(["asc", "desc"]).optional(),
  })
  .strict();

export type BotStateOrderBy = z.infer<typeof BotStateOrderBySchema>;

/**
 * Schema for selecting BotState fields
 */
export const BotStateSelectSchema = z
  .object({
    id: z.boolean().optional(),
    userId: z.boolean().optional(),
    botId: z.boolean().optional(),
    energyLevel: z.boolean().optional(),
    healthLevel: z.boolean().optional(),
    currentLocation: z.boolean().optional(),
    experience: z.boolean().optional(),
    bondLevel: z.boolean().optional(),
    level: z.boolean().optional(),
    energy: z.boolean().optional(),
    maxEnergy: z.boolean().optional(),
    health: z.boolean().optional(),
    maxHealth: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    updatedAt: z.boolean().optional(),
    user: z.boolean().optional(),
    bot: z.boolean().optional(),
  })
  .strict();

export type BotStateSelect = z.infer<typeof BotStateSelectSchema>;

/**
 * Schema for including BotState relations
 */
export const BotStateIncludeSchema = z
  .object({
    user: z.boolean().optional(),
    bot: z.boolean().optional(),
  })
  .strict();

export type BotStateInclude = z.infer<typeof BotStateIncludeSchema>;

// ============================================================================
// PAGINATION SCHEMAS
// ============================================================================

/**
 * Schema for paginated BotState queries
 */
export const FindManyBotStatesSchema = z
  .object({
    where: BotStateWhereSchema.optional(),
    orderBy: z
      .union([BotStateOrderBySchema, z.array(BotStateOrderBySchema)])
      .optional(),
    select: BotStateSelectSchema.optional(),
    include: BotStateIncludeSchema.optional(),
    skip: z.number().int().min(0).optional(),
    take: z.number().int().min(1).max(1000).optional(),
    cursor: FindUniqueBotStateSchema.optional(),
  })
  .strict();

export type FindManyBotStatesInput = z.infer<typeof FindManyBotStatesSchema>;

// ============================================================================
// VALIDATION HELPERS
// ============================================================================

/**
 * Schema for validating bot state consistency
 */
export const ValidateBotStateConsistencySchema = z
  .object({
    botStateId: z.string().min(1, "Bot state ID is required"),
    checkEnergyLimits: z.boolean().default(true),
    checkHealthLimits: z.boolean().default(true),
    checkLevelProgression: z.boolean().default(true),
    checkLocationValidation: z.boolean().default(true),
    syncLegacyFields: z.boolean().default(true),
  })
  .strict();

export type ValidateBotStateConsistency = z.infer<
  typeof ValidateBotStateConsistencySchema
>;

/**
 * Schema for bot state analysis
 */
export const AnalyzeBotStateSchema = z
  .object({
    energyLevel: z.number().int().min(0).max(10000),
    healthLevel: z.number().int().min(0).max(10000),
    maxEnergy: z.number().int().min(1).max(10000),
    maxHealth: z.number().int().min(1).max(10000),
    experience: z.number().int().min(0),
    level: z.number().int().min(1).max(100),
    bondLevel: z.number().int().min(0).max(100).nullable(),
    currentLocation: BotLocationSchema,
    botType: z
      .enum(["WORKER", "PLAYABLE", "KING", "ROGUE", "GOVBOT"])
      .optional(),
    includeRecommendations: z.boolean().default(true),
    includePredictions: z.boolean().default(false),
  })
  .strict();

export type AnalyzeBotState = z.infer<typeof AnalyzeBotStateSchema>;

/**
 * Schema for bot state search and filtering
 */
export const SearchBotStatesSchema = z
  .object({
    userId: z.string().optional(),
    currentLocation: z.array(BotLocationSchema).optional(),
    minEnergyLevel: z.number().int().min(0).max(10000).optional(),
    maxEnergyLevel: z.number().int().min(0).max(10000).optional(),
    minHealthLevel: z.number().int().min(0).max(10000).optional(),
    maxHealthLevel: z.number().int().min(0).max(10000).optional(),
    minLevel: z.number().int().min(1).max(100).optional(),
    maxLevel: z.number().int().min(1).max(100).optional(),
    minExperience: z.number().int().min(0).optional(),
    maxExperience: z.number().int().max(1000000).optional(),
    hasBondLevel: z.boolean().optional(),
    minBondLevel: z.number().int().min(0).max(100).optional(),
    maxBondLevel: z.number().int().min(0).max(100).optional(),
    needsMaintenance: z.boolean().optional(),
    lowEnergy: z.boolean().optional(),
    lowHealth: z.boolean().optional(),
    limit: z.number().int().min(1).max(100).default(20),
  })
  .strict();

export type SearchBotStates = z.infer<typeof SearchBotStatesSchema>;

// ============================================================================
// RESPONSE SCHEMAS
// ============================================================================

/**
 * Schema for BotState API responses
 */
export const BotStateResponseSchema = BotStateSchema;

export type BotStateResponse = z.infer<typeof BotStateResponseSchema>;

/**
 * Schema for BotState with User and Bot information
 */
export const BotStateWithRelationsSchema = BotStateResponseSchema.extend({
  user: z.object({
    id: z.string(),
    name: z.string().nullable(),
    email: z.string(),
  }),
  bot: z.object({
    id: z.string(),
    name: z.string(),
    botType: z.string(),
  }),
});

export type BotStateWithRelations = z.infer<typeof BotStateWithRelationsSchema>;

/**
 * Schema for BotState summary (minimal info)
 */
export const BotStateSummarySchema = z
  .object({
    id: z.string(),
    botId: z.string(),
    energyLevel: z.number().int(),
    healthLevel: z.number().int(),
    currentLocation: BotLocationSchema,
    level: z.number().int(),
    experience: z.number().int(),
    bondLevel: z.number().int().nullable(),
    updatedAt: z.date(),
  })
  .strict();

export type BotStateSummary = z.infer<typeof BotStateSummarySchema>;

/**
 * Schema for BotState with analysis
 */
export const BotStateWithAnalysisSchema = BotStateResponseSchema.extend({
  analysis: z.object({
    energyPercentage: z.number().min(0).max(100),
    healthPercentage: z.number().min(0).max(100),
    experienceToNextLevel: z.number().int().min(0),
    experienceProgress: z.number().min(0).max(100),
    bondLevelCategory: z
      .enum(["none", "low", "medium", "high", "maximum"])
      .nullable(),
    statusFlags: z.array(
      z.enum([
        "low_energy",
        "low_health",
        "needs_maintenance",
        "ready_to_level",
        "high_bond",
        "in_mission",
        "in_combat",
        "in_training",
      ])
    ),
    recommendations: z.array(
      z.object({
        type: z.enum(["energy", "health", "location", "experience", "bond"]),
        priority: z.enum(["low", "medium", "high", "critical"]),
        action: z.string(),
        description: z.string(),
      })
    ),
  }),
  legacyFieldsSync: z.object({
    energyMatches: z.boolean(),
    healthMatches: z.boolean(),
    suggestedFixes: z.array(z.string()),
  }),
});

export type BotStateWithAnalysis = z.infer<typeof BotStateWithAnalysisSchema>;

/**
 * Schema for bot state history entry
 */
export const BotStateHistoryEntrySchema = z
  .object({
    timestamp: z.date(),
    energyLevel: z.number().int(),
    healthLevel: z.number().int(),
    currentLocation: BotLocationSchema,
    level: z.number().int(),
    experience: z.number().int(),
    bondLevel: z.number().int().nullable(),
    changeReason: z.enum([
      "mission_completion",
      "combat_damage",
      "training_session",
      "maintenance",
      "level_up",
      "manual_update",
      "system_correction",
    ]),
    changeDetails: z.string().optional(),
  })
  .strict();

export type BotStateHistoryEntry = z.infer<typeof BotStateHistoryEntrySchema>;

// ============================================================================
// ADMIN SCHEMAS
// ============================================================================

/**
 * Schema for admin bot state management
 */
export const AdminBotStateManagementSchema = z
  .object({
    action: z.enum([
      "list_all",
      "reset_state",
      "sync_legacy_fields",
      "bulk_heal",
      "bulk_energize",
      "force_location_change",
      "recalculate_levels",
    ]),
    targetLocation: BotLocationSchema.optional(),
    energyOperation: z
      .object({
        type: z.enum(["set", "add", "restore"]),
        value: z.number().int().min(0).max(10000).optional(),
      })
      .optional(),
    healthOperation: z
      .object({
        type: z.enum(["set", "add", "heal"]),
        value: z.number().int().min(0).max(10000).optional(),
      })
      .optional(),
    levelOperation: z
      .object({
        type: z.enum(["set", "reset", "recalculate"]),
        targetLevel: z.number().int().min(1).max(100).optional(),
        preserveExperience: z.boolean().default(true),
      })
      .optional(),
    syncOptions: z
      .object({
        syncEnergyFields: z.boolean().default(true),
        syncHealthFields: z.boolean().default(true),
        fixInconsistencies: z.boolean().default(true),
      })
      .optional(),
  })
  .strict();

export type AdminBotStateManagement = z.infer<
  typeof AdminBotStateManagementSchema
>;

/**
 * Schema for bot state statistics
 */
export const BotStateStatsSchema = z
  .object({
    totalBotStates: z.number().int().min(0),
    locationDistribution: z.record(z.string(), z.number().int().min(0)),
    averageStats: z.object({
      energyLevel: z.number(),
      healthLevel: z.number(),
      level: z.number(),
      experience: z.number(),
      bondLevel: z.number().nullable(),
    }),
    healthStats: z.object({
      averageEnergyPercentage: z.number(),
      averageHealthPercentage: z.number(),
      lowEnergyCount: z.number().int().min(0),
      lowHealthCount: z.number().int().min(0),
      needingMaintenanceCount: z.number().int().min(0),
    }),
    levelStats: z.object({
      levelDistribution: z.record(z.string(), z.number().int().min(0)),
      readyToLevelUpCount: z.number().int().min(0),
      maxLevelCount: z.number().int().min(0),
    }),
    bondStats: z.object({
      withBondLevelCount: z.number().int().min(0),
      averageBondLevel: z.number().nullable(),
      highBondCount: z.number().int().min(0),
    }),
    maintenanceStats: z.object({
      criticalStates: z.number().int().min(0),
      warningStates: z.number().int().min(0),
      healthyStates: z.number().int().min(0),
    }),
  })
  .strict();

export type BotStateStats = z.infer<typeof BotStateStatsSchema>;

// ============================================================================
// EXPORTS
// ============================================================================

// All schemas are defined above and exported individually

// Export all validation functions
export const BotStateValidation = {
  // Base schemas
  model: BotStateSchema,
  input: BotStateInputSchema,
  location: BotLocationSchema,

  // CRUD schemas
  create: CreateBotStateSchema,
  createApi: CreateBotStateApiSchema,
  update: UpdateBotStateSchema,
  updateApi: UpdateBotStateApiSchema,
  partialUpdate: PartialUpdateBotStateSchema,
  updateEnergy: UpdateBotStateEnergySchema,
  updateHealth: UpdateBotStateHealthSchema,
  updateExperience: UpdateBotStateExperienceSchema,

  // Query schemas
  findUnique: FindUniqueBotStateSchema,
  findMany: FindManyBotStatesSchema,
  where: BotStateWhereSchema,
  orderBy: BotStateOrderBySchema,
  select: BotStateSelectSchema,
  include: BotStateIncludeSchema,

  // Helpers
  validateConsistency: ValidateBotStateConsistencySchema,
  analyze: AnalyzeBotStateSchema,
  search: SearchBotStatesSchema,

  // Response schemas
  response: BotStateResponseSchema,
  withRelations: BotStateWithRelationsSchema,
  summary: BotStateSummarySchema,
  withAnalysis: BotStateWithAnalysisSchema,
  historyEntry: BotStateHistoryEntrySchema,

  // Admin schemas
  adminManagement: AdminBotStateManagementSchema,
  stats: BotStateStatsSchema,
} as const;
