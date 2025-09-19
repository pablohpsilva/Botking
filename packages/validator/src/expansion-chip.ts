import { Rarity, ExpansionChipEffect } from "@botking/db";
import { z } from "zod";

// Import enum schemas from Prisma types
const RaritySchema = z.enum(Rarity);
const ExpansionChipEffectSchema = z.enum(ExpansionChipEffect);

// ============================================================================
// BASE SCHEMAS
// ============================================================================

/**
 * Base ExpansionChip model schema - represents the complete ExpansionChip entity
 */
export const ExpansionChipSchema = z
  .object({
    id: z.string(),
    userId: z.string(),
    name: z.string(),
    effect: ExpansionChipEffectSchema,
    rarity: RaritySchema,
    upgradeLevel: z.number().int(),
    effectMagnitude: z.number(),
    energyCost: z.number().int(),
    version: z.number().int(),
    source: z.string().nullable(),
    tags: z.array(z.string()),
    description: z.string().nullable(),
    metadata: z.unknown().nullable(),
    createdAt: z.date(),
    updatedAt: z.date(),
  })
  .strict();

export type ExpansionChip = z.infer<typeof ExpansionChipSchema>;

/**
 * ExpansionChip input schema for forms and API inputs (without auto-generated fields)
 */
export const ExpansionChipInputSchema = z
  .object({
    userId: z.string().min(1, "User ID is required"),
    name: z
      .string()
      .min(1, "Name is required")
      .max(100, "Name must be 100 characters or less"),
    effect: ExpansionChipEffectSchema,
    rarity: RaritySchema,
    upgradeLevel: z
      .number()
      .int()
      .min(0, "Upgrade level cannot be negative")
      .max(50, "Upgrade level cannot exceed 50")
      .default(0),
    effectMagnitude: z
      .number()
      .min(0.1, "Effect magnitude must be at least 0.1")
      .max(10.0, "Effect magnitude cannot exceed 10.0")
      .default(1.0),
    energyCost: z
      .number()
      .int()
      .min(1, "Energy cost must be at least 1")
      .max(100, "Energy cost cannot exceed 100")
      .default(5),
    source: z.string().optional().nullable(),
    tags: z.array(z.string()).default([]),
    description: z.string().optional().nullable(),
    metadata: z.unknown().optional().nullable(),
  })
  .strict()
  .refine(
    (data) => {
      // Validate effect magnitude based on effect type
      if (data.effect === "ENERGY_EFFICIENCY" && data.effectMagnitude > 5.0) {
        return false;
      }
      if (
        ["ATTACK_BUFF", "DEFENSE_BUFF", "SPEED_BUFF"].includes(data.effect) &&
        data.effectMagnitude > 3.0
      ) {
        return false;
      }
      return true;
    },
    {
      message: "Effect magnitude exceeds maximum for this effect type",
      path: ["effectMagnitude"],
    }
  );

export type ExpansionChipInput = z.infer<typeof ExpansionChipInputSchema>;

// ============================================================================
// CREATE SCHEMAS
// ============================================================================

/**
 * Schema for creating a new ExpansionChip
 * Compatible with Prisma ExpansionChipCreateInput
 */
export const CreateExpansionChipSchema = z
  .object({
    id: z.string().optional(),
    userId: z.string().min(1, "User ID is required"),
    name: z
      .string()
      .min(1, "Name is required")
      .max(100, "Name must be 100 characters or less"),
    effect: ExpansionChipEffectSchema,
    rarity: RaritySchema,
    upgradeLevel: z
      .number()
      .int()
      .min(0, "Upgrade level cannot be negative")
      .max(50, "Upgrade level cannot exceed 50")
      .default(0),
    effectMagnitude: z
      .number()
      .min(0.1, "Effect magnitude must be at least 0.1")
      .max(10.0, "Effect magnitude cannot exceed 10.0")
      .default(1.0),
    energyCost: z
      .number()
      .int()
      .min(1, "Energy cost must be at least 1")
      .max(100, "Energy cost cannot exceed 100")
      .default(5),
    version: z.number().int().min(1).default(1),
    source: z.string().optional().nullable(),
    tags: z.array(z.string()).default([]),
    description: z.string().optional().nullable(),
    metadata: z.unknown().optional().nullable(),
    createdAt: z.coerce.date().optional(),
    updatedAt: z.coerce.date().optional(),
  })
  .strict()
  .refine(
    (data) => {
      if (data.effect === "ENERGY_EFFICIENCY" && data.effectMagnitude > 5.0) {
        return false;
      }
      if (
        ["ATTACK_BUFF", "DEFENSE_BUFF", "SPEED_BUFF"].includes(data.effect) &&
        data.effectMagnitude > 3.0
      ) {
        return false;
      }
      return true;
    },
    {
      message: "Effect magnitude exceeds maximum for this effect type",
      path: ["effectMagnitude"],
    }
  );

export type CreateExpansionChipInput = z.infer<
  typeof CreateExpansionChipSchema
>;

/**
 * Simplified create schema for API endpoints
 */
export const CreateExpansionChipApiSchema = z
  .object({
    name: z
      .string()
      .min(1, "Name is required")
      .max(100, "Name must be 100 characters or less"),
    effect: ExpansionChipEffectSchema,
    rarity: RaritySchema,
    effectMagnitude: z
      .number()
      .min(0.1, "Effect magnitude must be at least 0.1")
      .max(10.0, "Effect magnitude cannot exceed 10.0")
      .optional(),
    energyCost: z
      .number()
      .int()
      .min(1, "Energy cost must be at least 1")
      .max(100, "Energy cost cannot exceed 100")
      .optional(),
    source: z.string().optional(),
    tags: z.array(z.string()).optional(),
    description: z.string().optional(),
  })
  .strict();

export type CreateExpansionChipApi = z.infer<
  typeof CreateExpansionChipApiSchema
>;

// ============================================================================
// UPDATE SCHEMAS
// ============================================================================

/**
 * Schema for updating an ExpansionChip
 * Compatible with Prisma ExpansionChipUpdateInput
 */
export const UpdateExpansionChipSchema = z
  .object({
    id: z.string().optional(),
    userId: z.string().min(1, "User ID is required").optional(),
    name: z
      .string()
      .min(1, "Name is required")
      .max(100, "Name must be 100 characters or less")
      .optional(),
    effect: ExpansionChipEffectSchema.optional(),
    rarity: RaritySchema.optional(),
    upgradeLevel: z
      .number()
      .int()
      .min(0, "Upgrade level cannot be negative")
      .max(50, "Upgrade level cannot exceed 50")
      .optional(),
    effectMagnitude: z
      .number()
      .min(0.1, "Effect magnitude must be at least 0.1")
      .max(10.0, "Effect magnitude cannot exceed 10.0")
      .optional(),
    energyCost: z
      .number()
      .int()
      .min(1, "Energy cost must be at least 1")
      .max(100, "Energy cost cannot exceed 100")
      .optional(),
    version: z.number().int().min(1).optional(),
    source: z.string().optional().nullable(),
    tags: z.array(z.string()).optional(),
    description: z.string().optional().nullable(),
    metadata: z.unknown().optional().nullable(),
    createdAt: z.coerce.date().optional(),
    updatedAt: z.coerce.date().optional(),
  })
  .strict();

export type UpdateExpansionChipInput = z.infer<
  typeof UpdateExpansionChipSchema
>;

/**
 * Simplified update schema for API endpoints
 */
export const UpdateExpansionChipApiSchema = z
  .object({
    name: z
      .string()
      .min(1, "Name is required")
      .max(100, "Name must be 100 characters or less")
      .optional(),
    tags: z.array(z.string()).optional(),
    description: z.string().optional().nullable(),
  })
  .strict();

export type UpdateExpansionChipApi = z.infer<
  typeof UpdateExpansionChipApiSchema
>;

/**
 * Partial update schema - all fields optional
 */
export const PartialUpdateExpansionChipSchema =
  ExpansionChipInputSchema.partial();
export type PartialUpdateExpansionChip = z.infer<
  typeof PartialUpdateExpansionChipSchema
>;

/**
 * Schema for effect modifications
 */
export const UpdateExpansionChipEffectSchema = z
  .object({
    effect: ExpansionChipEffectSchema.optional(),
    effectMagnitude: z
      .number()
      .min(0.1, "Effect magnitude must be at least 0.1")
      .max(10.0, "Effect magnitude cannot exceed 10.0")
      .optional(),
    energyCost: z
      .number()
      .int()
      .min(1, "Energy cost must be at least 1")
      .max(100, "Energy cost cannot exceed 100")
      .optional(),
  })
  .strict()
  .refine(
    (data) => Object.keys(data).length > 0,
    "At least one effect property must be provided"
  );

export type UpdateExpansionChipEffect = z.infer<
  typeof UpdateExpansionChipEffectSchema
>;

/**
 * Schema for upgrade operations
 */
export const UpgradeExpansionChipSchema = z
  .object({
    targetLevel: z
      .number()
      .int()
      .min(1, "Target level must be at least 1")
      .max(50, "Target level cannot exceed 50"),
    upgradeType: z.enum([
      "magnitude_boost",
      "energy_efficiency",
      "effect_enhancement",
      "combination",
    ]),
    magnitudeIncrease: z
      .number()
      .min(0.1, "Magnitude increase must be positive")
      .max(2.0, "Magnitude increase too large")
      .optional(),
    energyReduction: z
      .number()
      .int()
      .min(1, "Energy reduction must be positive")
      .max(20, "Energy reduction too large")
      .optional(),
    effectEnhancements: z.array(z.string()).optional(),
  })
  .strict();

export type UpgradeExpansionChip = z.infer<typeof UpgradeExpansionChipSchema>;

// ============================================================================
// QUERY SCHEMAS
// ============================================================================

/**
 * Schema for finding a unique ExpansionChip
 */
export const FindUniqueExpansionChipSchema = z
  .object({
    id: z.string().optional(),
  })
  .strict();

export type FindUniqueExpansionChipInput = z.infer<
  typeof FindUniqueExpansionChipSchema
>;

/**
 * Schema for filtering ExpansionChips
 */
export const ExpansionChipWhereSchema: z.ZodType<any> = z.lazy(() =>
  z
    .object({
      id: z.string().optional(),
      userId: z.string().optional(),
      name: z.string().optional(),
      effect: ExpansionChipEffectSchema.optional(),
      rarity: RaritySchema.optional(),
      upgradeLevel: z.number().int().optional(),
      effectMagnitude: z.number().optional(),
      energyCost: z.number().int().optional(),
      version: z.number().int().optional(),
      source: z.string().nullable().optional(),
      tags: z.array(z.string()).optional(),
      description: z.string().nullable().optional(),
      createdAt: z.date().optional(),
      updatedAt: z.date().optional(),
      AND: z.array(ExpansionChipWhereSchema).optional(),
      OR: z.array(ExpansionChipWhereSchema).optional(),
      NOT: ExpansionChipWhereSchema.optional(),
    })
    .strict()
);

export type ExpansionChipWhere = z.infer<typeof ExpansionChipWhereSchema>;

/**
 * Schema for ordering ExpansionChips
 */
export const ExpansionChipOrderBySchema = z
  .object({
    id: z.enum(["asc", "desc"]).optional(),
    userId: z.enum(["asc", "desc"]).optional(),
    name: z.enum(["asc", "desc"]).optional(),
    effect: z.enum(["asc", "desc"]).optional(),
    rarity: z.enum(["asc", "desc"]).optional(),
    upgradeLevel: z.enum(["asc", "desc"]).optional(),
    effectMagnitude: z.enum(["asc", "desc"]).optional(),
    energyCost: z.enum(["asc", "desc"]).optional(),
    version: z.enum(["asc", "desc"]).optional(),
    createdAt: z.enum(["asc", "desc"]).optional(),
    updatedAt: z.enum(["asc", "desc"]).optional(),
  })
  .strict();

export type ExpansionChipOrderBy = z.infer<typeof ExpansionChipOrderBySchema>;

/**
 * Schema for selecting ExpansionChip fields
 */
export const ExpansionChipSelectSchema = z
  .object({
    id: z.boolean().optional(),
    userId: z.boolean().optional(),
    name: z.boolean().optional(),
    effect: z.boolean().optional(),
    rarity: z.boolean().optional(),
    upgradeLevel: z.boolean().optional(),
    effectMagnitude: z.boolean().optional(),
    energyCost: z.boolean().optional(),
    version: z.boolean().optional(),
    source: z.boolean().optional(),
    tags: z.boolean().optional(),
    description: z.boolean().optional(),
    metadata: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    updatedAt: z.boolean().optional(),
    user: z.boolean().optional(),
    botChips: z.boolean().optional(),
  })
  .strict();

export type ExpansionChipSelect = z.infer<typeof ExpansionChipSelectSchema>;

/**
 * Schema for including ExpansionChip relations
 */
export const ExpansionChipIncludeSchema = z
  .object({
    user: z.boolean().optional(),
    botChips: z.boolean().optional(),
  })
  .strict();

export type ExpansionChipInclude = z.infer<typeof ExpansionChipIncludeSchema>;

// ============================================================================
// PAGINATION SCHEMAS
// ============================================================================

/**
 * Schema for paginated ExpansionChip queries
 */
export const FindManyExpansionChipsSchema = z
  .object({
    where: ExpansionChipWhereSchema.optional(),
    orderBy: z
      .union([ExpansionChipOrderBySchema, z.array(ExpansionChipOrderBySchema)])
      .optional(),
    select: ExpansionChipSelectSchema.optional(),
    include: ExpansionChipIncludeSchema.optional(),
    skip: z.number().int().min(0).optional(),
    take: z.number().int().min(1).max(1000).optional(),
    cursor: FindUniqueExpansionChipSchema.optional(),
  })
  .strict();

export type FindManyExpansionChipsInput = z.infer<
  typeof FindManyExpansionChipsSchema
>;

// ============================================================================
// VALIDATION HELPERS
// ============================================================================

/**
 * Schema for validating expansion chip compatibility with bot
 */
export const ValidateExpansionChipCompatibilitySchema = z
  .object({
    expansionChipId: z.string().min(1, "Expansion chip ID is required"),
    botId: z.string().min(1, "Bot ID is required").optional(),
    skeletonId: z.string().min(1, "Skeleton ID is required").optional(),
    checkEnergyRequirements: z.boolean().default(true),
    checkEffectCompatibility: z.boolean().default(true),
    checkSlotAvailability: z.boolean().default(true),
    existingChips: z.array(z.string()).optional(),
  })
  .strict()
  .refine(
    (data) => data.botId || data.skeletonId,
    "Either bot ID or skeleton ID must be provided"
  );

export type ValidateExpansionChipCompatibility = z.infer<
  typeof ValidateExpansionChipCompatibilitySchema
>;

/**
 * Schema for expansion chip effect calculation
 */
export const CalculateExpansionChipEffectSchema = z
  .object({
    effect: ExpansionChipEffectSchema,
    effectMagnitude: z.number().min(0.1).max(10.0),
    upgradeLevel: z.number().int().min(0).max(50),
    rarity: RaritySchema,
    targetStats: z
      .object({
        attack: z.number().int().min(0),
        defense: z.number().int().min(0),
        speed: z.number().int().min(0),
        perception: z.number().int().min(0),
        energy: z.number().int().min(0),
      })
      .optional(),
    synergyChips: z
      .array(
        z.object({
          effect: ExpansionChipEffectSchema,
          magnitude: z.number().min(0.1).max(10.0),
        })
      )
      .optional(),
    environmentFactors: z
      .object({
        botType: z
          .enum(["WORKER", "PLAYABLE", "KING", "ROGUE", "GOVBOT"])
          .optional(),
        combatSituation: z.boolean().optional(),
        energyEfficiencyMode: z.boolean().optional(),
      })
      .optional(),
  })
  .strict();

export type CalculateExpansionChipEffect = z.infer<
  typeof CalculateExpansionChipEffectSchema
>;

/**
 * Schema for expansion chip search and filtering
 */
export const SearchExpansionChipsSchema = z
  .object({
    query: z
      .string()
      .min(1, "Search query is required")
      .max(100, "Search query too long"),
    effect: z.array(ExpansionChipEffectSchema).optional(),
    rarity: z.array(RaritySchema).optional(),
    minEffectMagnitude: z.number().min(0.1).max(10.0).optional(),
    maxEffectMagnitude: z.number().min(0.1).max(10.0).optional(),
    minEnergyCost: z.number().int().min(1).max(100).optional(),
    maxEnergyCost: z.number().int().min(1).max(100).optional(),
    minUpgradeLevel: z.number().int().min(0).max(50).optional(),
    maxUpgradeLevel: z.number().int().min(0).max(50).optional(),
    tags: z.array(z.string()).optional(),
    compatibleWithBot: z.string().optional(),
    userId: z.string().optional(),
    limit: z.number().int().min(1).max(100).default(20),
  })
  .strict();

export type SearchExpansionChips = z.infer<typeof SearchExpansionChipsSchema>;

// ============================================================================
// RESPONSE SCHEMAS
// ============================================================================

/**
 * Schema for ExpansionChip API responses
 */
export const ExpansionChipResponseSchema = ExpansionChipSchema.omit({
  metadata: true,
});

export type ExpansionChipResponse = z.infer<typeof ExpansionChipResponseSchema>;

/**
 * Schema for ExpansionChip with User information
 */
export const ExpansionChipWithUserSchema = ExpansionChipResponseSchema.extend({
  user: z.object({
    id: z.string(),
    name: z.string().nullable(),
    email: z.string(),
  }),
});

export type ExpansionChipWithUser = z.infer<typeof ExpansionChipWithUserSchema>;

/**
 * Schema for ExpansionChip summary (minimal info)
 */
export const ExpansionChipSummarySchema = z
  .object({
    id: z.string(),
    name: z.string(),
    effect: ExpansionChipEffectSchema,
    rarity: RaritySchema,
    effectMagnitude: z.number(),
    energyCost: z.number().int(),
    upgradeLevel: z.number().int(),
    createdAt: z.date(),
  })
  .strict();

export type ExpansionChipSummary = z.infer<typeof ExpansionChipSummarySchema>;

/**
 * Schema for ExpansionChip with effect calculations
 */
export const ExpansionChipWithEffectsSchema =
  ExpansionChipResponseSchema.extend({
    effectCalculations: z.object({
      actualMagnitude: z.number(),
      energyEfficiency: z.number(),
      upgradeBonus: z.number(),
      rarityMultiplier: z.number(),
      totalEffectiveness: z.number(),
    }),
    compatibilityRating: z.number().min(0).max(100),
    botCount: z.number().int().min(0),
    upgradeProgress: z.number().min(0).max(100),
  });

export type ExpansionChipWithEffects = z.infer<
  typeof ExpansionChipWithEffectsSchema
>;

/**
 * Schema for expansion chip upgrade preview
 */
export const ExpansionChipUpgradePreviewSchema = z
  .object({
    currentLevel: z.number().int(),
    targetLevel: z.number().int(),
    currentEffect: z.object({
      magnitude: z.number(),
      energyCost: z.number().int(),
      effectiveness: z.number(),
    }),
    projectedEffect: z.object({
      magnitude: z.number(),
      energyCost: z.number().int(),
      effectiveness: z.number(),
    }),
    upgradeCost: z.object({
      currency: z.number().int().min(0),
      materials: z.array(
        z.object({
          itemId: z.string(),
          quantity: z.number().int().min(1),
        })
      ),
      timeRequired: z.number().int().min(0),
    }),
    successRate: z.number().min(0).max(1),
    risks: z.array(z.string()),
    benefits: z.array(z.string()),
  })
  .strict();

export type ExpansionChipUpgradePreview = z.infer<
  typeof ExpansionChipUpgradePreviewSchema
>;

// ============================================================================
// ADMIN SCHEMAS
// ============================================================================

/**
 * Schema for admin expansion chip management
 */
export const AdminExpansionChipManagementSchema = z
  .object({
    action: z.enum([
      "list_all",
      "force_upgrade",
      "modify_effect",
      "change_rarity",
      "bulk_calibrate",
      "reset_upgrades",
    ]),
    targetRarity: RaritySchema.optional(),
    effectModifications: z
      .object({
        newEffect: ExpansionChipEffectSchema.optional(),
        magnitudeAdjustment: z.number().min(-5.0).max(5.0).optional(),
        energyCostAdjustment: z.number().int().min(-50).max(50).optional(),
      })
      .optional(),
    upgradeModification: z
      .object({
        targetLevel: z.number().int().min(0).max(50),
        preserveEffect: z.boolean().default(true),
      })
      .optional(),
    calibrationConfig: z
      .object({
        optimizationGoal: z.enum([
          "maximize_effect",
          "minimize_energy",
          "balance_performance",
        ]),
        targetBotTypes: z
          .array(z.enum(["WORKER", "PLAYABLE", "KING", "ROGUE", "GOVBOT"]))
          .optional(),
      })
      .optional(),
  })
  .strict();

export type AdminExpansionChipManagement = z.infer<
  typeof AdminExpansionChipManagementSchema
>;

/**
 * Schema for expansion chip statistics
 */
export const ExpansionChipStatsSchema = z
  .object({
    totalExpansionChips: z.number().int().min(0),
    effectDistribution: z.record(z.string(), z.number().int().min(0)),
    rarityDistribution: z.record(z.string(), z.number().int().min(0)),
    averageStats: z.object({
      effectMagnitude: z.number(),
      energyCost: z.number(),
      upgradeLevel: z.number(),
    }),
    upgradeStats: z.object({
      averageUpgradeLevel: z.number(),
      fullyUpgraded: z.number().int().min(0),
      needingUpgrade: z.number().int().min(0),
    }),
    usageStats: z.object({
      mostPopularEffects: z.array(
        z.object({
          effect: ExpansionChipEffectSchema,
          count: z.number().int().min(0),
          averageRating: z.number(),
        })
      ),
      energyEfficiencyRanking: z.array(
        z.object({
          id: z.string(),
          name: z.string(),
          efficiencyRatio: z.number(),
        })
      ),
    }),
    topPerformers: z.array(
      z.object({
        id: z.string(),
        name: z.string(),
        effectivenessScore: z.number(),
        effect: ExpansionChipEffectSchema,
        rarity: RaritySchema,
      })
    ),
  })
  .strict();

export type ExpansionChipStats = z.infer<typeof ExpansionChipStatsSchema>;

// ============================================================================
// EXPORTS
// ============================================================================

// All schemas are defined above and exported individually

// Export all validation functions
export const ExpansionChipValidation = {
  // Base schemas
  model: ExpansionChipSchema,
  input: ExpansionChipInputSchema,
  effect: ExpansionChipEffectSchema,
  rarity: RaritySchema,

  // CRUD schemas
  create: CreateExpansionChipSchema,
  createApi: CreateExpansionChipApiSchema,
  update: UpdateExpansionChipSchema,
  updateApi: UpdateExpansionChipApiSchema,
  partialUpdate: PartialUpdateExpansionChipSchema,
  updateEffect: UpdateExpansionChipEffectSchema,
  upgrade: UpgradeExpansionChipSchema,

  // Query schemas
  findUnique: FindUniqueExpansionChipSchema,
  findMany: FindManyExpansionChipsSchema,
  where: ExpansionChipWhereSchema,
  orderBy: ExpansionChipOrderBySchema,
  select: ExpansionChipSelectSchema,
  include: ExpansionChipIncludeSchema,

  // Helpers
  compatibility: ValidateExpansionChipCompatibilitySchema,
  calculateEffect: CalculateExpansionChipEffectSchema,
  search: SearchExpansionChipsSchema,

  // Response schemas
  response: ExpansionChipResponseSchema,
  withUser: ExpansionChipWithUserSchema,
  summary: ExpansionChipSummarySchema,
  withEffects: ExpansionChipWithEffectsSchema,
  upgradePreview: ExpansionChipUpgradePreviewSchema,

  // Admin schemas
  adminManagement: AdminExpansionChipManagementSchema,
  stats: ExpansionChipStatsSchema,
} as const;
