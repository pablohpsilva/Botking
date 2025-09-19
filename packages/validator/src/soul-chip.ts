import { Rarity } from "@botking/db";
import { z } from "zod";

// Import Rarity enum schema from generated types
const RaritySchema = z.enum(Rarity);

// ============================================================================
// BASE SCHEMAS
// ============================================================================

/**
 * Base SoulChip model schema - represents the complete SoulChip entity
 */
export const SoulChipSchema = z
  .object({
    id: z.string(),
    userId: z.string(),
    name: z.string(),
    personality: z.string(),
    rarity: RaritySchema,
    intelligence: z.number().int(),
    resilience: z.number().int(),
    adaptability: z.number().int(),
    specialTrait: z.string(),
    experiences: z.array(z.string()),
    learningRate: z.number(),
    version: z.number().int(),
    source: z.string().nullable(),
    tags: z.array(z.string()),
    description: z.string().nullable(),
    metadata: z.unknown().nullable(),
    createdAt: z.date(),
    updatedAt: z.date(),
  })
  .strict();

export type SoulChip = z.infer<typeof SoulChipSchema>;

/**
 * SoulChip input schema for forms and API inputs (without auto-generated fields)
 */
export const SoulChipInputSchema = z
  .object({
    userId: z.string().min(1, "User ID is required"),
    name: z
      .string()
      .min(1, "Name is required")
      .max(100, "Name must be 100 characters or less"),
    personality: z
      .string()
      .min(1, "Personality is required")
      .max(200, "Personality must be 200 characters or less"),
    rarity: RaritySchema,
    intelligence: z
      .number()
      .int()
      .min(1, "Intelligence must be at least 1")
      .max(100, "Intelligence cannot exceed 100")
      .default(50),
    resilience: z
      .number()
      .int()
      .min(1, "Resilience must be at least 1")
      .max(100, "Resilience cannot exceed 100")
      .default(50),
    adaptability: z
      .number()
      .int()
      .min(1, "Adaptability must be at least 1")
      .max(100, "Adaptability cannot exceed 100")
      .default(50),
    specialTrait: z.string().min(1, "Special trait is required"),
    experiences: z.array(z.string()).default([]),
    learningRate: z
      .number()
      .min(0.1, "Learning rate must be at least 0.1")
      .max(2.0, "Learning rate cannot exceed 2.0")
      .default(0.5),
    source: z.string().optional().nullable(),
    tags: z.array(z.string()).default([]),
    description: z.string().optional().nullable(),
    metadata: z.unknown().optional().nullable(),
  })
  .strict();

export type SoulChipInput = z.infer<typeof SoulChipInputSchema>;

// ============================================================================
// CREATE SCHEMAS
// ============================================================================

/**
 * Schema for creating a new SoulChip
 * Compatible with Prisma SoulChipCreateInput
 */
export const CreateSoulChipSchema = z
  .object({
    id: z.string().optional(),
    userId: z.string().min(1, "User ID is required"),
    name: z
      .string()
      .min(1, "Name is required")
      .max(100, "Name must be 100 characters or less"),
    personality: z
      .string()
      .min(1, "Personality is required")
      .max(200, "Personality must be 200 characters or less"),
    rarity: RaritySchema,
    intelligence: z
      .number()
      .int()
      .min(1, "Intelligence must be at least 1")
      .max(100, "Intelligence cannot exceed 100")
      .default(50),
    resilience: z
      .number()
      .int()
      .min(1, "Resilience must be at least 1")
      .max(100, "Resilience cannot exceed 100")
      .default(50),
    adaptability: z
      .number()
      .int()
      .min(1, "Adaptability must be at least 1")
      .max(100, "Adaptability cannot exceed 100")
      .default(50),
    specialTrait: z.string().min(1, "Special trait is required"),
    experiences: z.array(z.string()).default([]),
    learningRate: z
      .number()
      .min(0.1, "Learning rate must be at least 0.1")
      .max(2.0, "Learning rate cannot exceed 2.0")
      .default(0.5),
    version: z.number().int().min(1).default(1),
    source: z.string().optional().nullable(),
    tags: z.array(z.string()).default([]),
    description: z.string().optional().nullable(),
    metadata: z.unknown().optional().nullable(),
    createdAt: z.coerce.date().optional(),
    updatedAt: z.coerce.date().optional(),
  })
  .strict();

export type CreateSoulChipInput = z.infer<typeof CreateSoulChipSchema>;

/**
 * Simplified create schema for API endpoints
 */
export const CreateSoulChipApiSchema = z
  .object({
    name: z
      .string()
      .min(1, "Name is required")
      .max(100, "Name must be 100 characters or less"),
    personality: z
      .string()
      .min(1, "Personality is required")
      .max(200, "Personality must be 200 characters or less"),
    rarity: RaritySchema,
    intelligence: z
      .number()
      .int()
      .min(1, "Intelligence must be at least 1")
      .max(100, "Intelligence cannot exceed 100")
      .optional(),
    resilience: z
      .number()
      .int()
      .min(1, "Resilience must be at least 1")
      .max(100, "Resilience cannot exceed 100")
      .optional(),
    adaptability: z
      .number()
      .int()
      .min(1, "Adaptability must be at least 1")
      .max(100, "Adaptability cannot exceed 100")
      .optional(),
    specialTrait: z.string().min(1, "Special trait is required"),
    learningRate: z
      .number()
      .min(0.1, "Learning rate must be at least 0.1")
      .max(2.0, "Learning rate cannot exceed 2.0")
      .optional(),
    source: z.string().optional(),
    tags: z.array(z.string()).optional(),
    description: z.string().optional(),
  })
  .strict();

export type CreateSoulChipApi = z.infer<typeof CreateSoulChipApiSchema>;

// ============================================================================
// UPDATE SCHEMAS
// ============================================================================

/**
 * Schema for updating a SoulChip
 * Compatible with Prisma SoulChipUpdateInput
 */
export const UpdateSoulChipSchema = z
  .object({
    id: z.string().optional(),
    userId: z.string().min(1, "User ID is required").optional(),
    name: z
      .string()
      .min(1, "Name is required")
      .max(100, "Name must be 100 characters or less")
      .optional(),
    personality: z
      .string()
      .min(1, "Personality is required")
      .max(200, "Personality must be 200 characters or less")
      .optional(),
    rarity: RaritySchema.optional(),
    intelligence: z
      .number()
      .int()
      .min(1, "Intelligence must be at least 1")
      .max(100, "Intelligence cannot exceed 100")
      .optional(),
    resilience: z
      .number()
      .int()
      .min(1, "Resilience must be at least 1")
      .max(100, "Resilience cannot exceed 100")
      .optional(),
    adaptability: z
      .number()
      .int()
      .min(1, "Adaptability must be at least 1")
      .max(100, "Adaptability cannot exceed 100")
      .optional(),
    specialTrait: z.string().min(1, "Special trait is required").optional(),
    experiences: z.array(z.string()).optional(),
    learningRate: z
      .number()
      .min(0.1, "Learning rate must be at least 0.1")
      .max(2.0, "Learning rate cannot exceed 2.0")
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

export type UpdateSoulChipInput = z.infer<typeof UpdateSoulChipSchema>;

/**
 * Simplified update schema for API endpoints
 */
export const UpdateSoulChipApiSchema = z
  .object({
    name: z
      .string()
      .min(1, "Name is required")
      .max(100, "Name must be 100 characters or less")
      .optional(),
    personality: z
      .string()
      .min(1, "Personality is required")
      .max(200, "Personality must be 200 characters or less")
      .optional(),
    specialTrait: z.string().min(1, "Special trait is required").optional(),
    tags: z.array(z.string()).optional(),
    description: z.string().optional().nullable(),
  })
  .strict();

export type UpdateSoulChipApi = z.infer<typeof UpdateSoulChipApiSchema>;

/**
 * Partial update schema - all fields optional
 */
export const PartialUpdateSoulChipSchema = SoulChipInputSchema.partial();
export type PartialUpdateSoulChip = z.infer<typeof PartialUpdateSoulChipSchema>;

/**
 * Schema for stat modifications
 */
export const UpdateSoulChipStatsSchema = z
  .object({
    intelligence: z
      .number()
      .int()
      .min(1, "Intelligence must be at least 1")
      .max(100, "Intelligence cannot exceed 100")
      .optional(),
    resilience: z
      .number()
      .int()
      .min(1, "Resilience must be at least 1")
      .max(100, "Resilience cannot exceed 100")
      .optional(),
    adaptability: z
      .number()
      .int()
      .min(1, "Adaptability must be at least 1")
      .max(100, "Adaptability cannot exceed 100")
      .optional(),
    learningRate: z
      .number()
      .min(0.1, "Learning rate must be at least 0.1")
      .max(2.0, "Learning rate cannot exceed 2.0")
      .optional(),
  })
  .strict();

export type UpdateSoulChipStats = z.infer<typeof UpdateSoulChipStatsSchema>;

/**
 * Schema for adding experience
 */
export const AddExperienceSchema = z
  .object({
    experience: z.string().min(1, "Experience description is required"),
    applyLearning: z.boolean().default(true),
  })
  .strict();

export type AddExperience = z.infer<typeof AddExperienceSchema>;

// ============================================================================
// QUERY SCHEMAS
// ============================================================================

/**
 * Schema for finding a unique SoulChip
 */
export const FindUniqueSoulChipSchema = z
  .object({
    id: z.string().optional(),
  })
  .strict();

export type FindUniqueSoulChipInput = z.infer<typeof FindUniqueSoulChipSchema>;

/**
 * Schema for filtering SoulChips
 */
export const SoulChipWhereSchema: z.ZodType<any> = z.lazy(() =>
  z
    .object({
      id: z.string().optional(),
      userId: z.string().optional(),
      name: z.string().optional(),
      personality: z.string().optional(),
      rarity: RaritySchema.optional(),
      intelligence: z.number().int().optional(),
      resilience: z.number().int().optional(),
      adaptability: z.number().int().optional(),
      specialTrait: z.string().optional(),
      learningRate: z.number().optional(),
      version: z.number().int().optional(),
      source: z.string().nullable().optional(),
      tags: z.array(z.string()).optional(),
      description: z.string().nullable().optional(),
      createdAt: z.date().optional(),
      updatedAt: z.date().optional(),
      AND: z.array(SoulChipWhereSchema).optional(),
      OR: z.array(SoulChipWhereSchema).optional(),
      NOT: SoulChipWhereSchema.optional(),
    })
    .strict()
);

export type SoulChipWhere = z.infer<typeof SoulChipWhereSchema>;

/**
 * Schema for ordering SoulChips
 */
export const SoulChipOrderBySchema = z
  .object({
    id: z.enum(["asc", "desc"]).optional(),
    userId: z.enum(["asc", "desc"]).optional(),
    name: z.enum(["asc", "desc"]).optional(),
    rarity: z.enum(["asc", "desc"]).optional(),
    intelligence: z.enum(["asc", "desc"]).optional(),
    resilience: z.enum(["asc", "desc"]).optional(),
    adaptability: z.enum(["asc", "desc"]).optional(),
    learningRate: z.enum(["asc", "desc"]).optional(),
    version: z.enum(["asc", "desc"]).optional(),
    createdAt: z.enum(["asc", "desc"]).optional(),
    updatedAt: z.enum(["asc", "desc"]).optional(),
  })
  .strict();

export type SoulChipOrderBy = z.infer<typeof SoulChipOrderBySchema>;

/**
 * Schema for selecting SoulChip fields
 */
export const SoulChipSelectSchema = z
  .object({
    id: z.boolean().optional(),
    userId: z.boolean().optional(),
    name: z.boolean().optional(),
    personality: z.boolean().optional(),
    rarity: z.boolean().optional(),
    intelligence: z.boolean().optional(),
    resilience: z.boolean().optional(),
    adaptability: z.boolean().optional(),
    specialTrait: z.boolean().optional(),
    experiences: z.boolean().optional(),
    learningRate: z.boolean().optional(),
    version: z.boolean().optional(),
    source: z.boolean().optional(),
    tags: z.boolean().optional(),
    description: z.boolean().optional(),
    metadata: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    updatedAt: z.boolean().optional(),
    user: z.boolean().optional(),
    bots: z.boolean().optional(),
  })
  .strict();

export type SoulChipSelect = z.infer<typeof SoulChipSelectSchema>;

/**
 * Schema for including SoulChip relations
 */
export const SoulChipIncludeSchema = z
  .object({
    user: z.boolean().optional(),
    bots: z.boolean().optional(),
  })
  .strict();

export type SoulChipInclude = z.infer<typeof SoulChipIncludeSchema>;

// ============================================================================
// PAGINATION SCHEMAS
// ============================================================================

/**
 * Schema for paginated SoulChip queries
 */
export const FindManySoulChipsSchema = z
  .object({
    where: SoulChipWhereSchema.optional(),
    orderBy: z
      .union([SoulChipOrderBySchema, z.array(SoulChipOrderBySchema)])
      .optional(),
    select: SoulChipSelectSchema.optional(),
    include: SoulChipIncludeSchema.optional(),
    skip: z.number().int().min(0).optional(),
    take: z.number().int().min(1).max(1000).optional(),
    cursor: FindUniqueSoulChipSchema.optional(),
  })
  .strict();

export type FindManySoulChipsInput = z.infer<typeof FindManySoulChipsSchema>;

// ============================================================================
// SOULCHIP SPECIFIC SCHEMAS
// ============================================================================

/**
 * Schema for SoulChip evolution/upgrade
 */
export const EvolveSoulChipSchema = z
  .object({
    targetRarity: RaritySchema,
    preservePersonality: z.boolean().default(true),
    statBonus: z
      .object({
        intelligence: z.number().int().min(0).max(20).default(0),
        resilience: z.number().int().min(0).max(20).default(0),
        adaptability: z.number().int().min(0).max(20).default(0),
      })
      .optional(),
  })
  .strict();

export type EvolveSoulChip = z.infer<typeof EvolveSoulChipSchema>;

/**
 * Schema for SoulChip fusion
 */
export const FuseSoulChipsSchema = z
  .object({
    primarySoulChipId: z.string().min(1, "Primary SoulChip ID is required"),
    secondarySoulChipId: z.string().min(1, "Secondary SoulChip ID is required"),
    fusionType: z.enum(["balanced", "dominant_primary", "hybrid"]),
    preserveExperiences: z.boolean().default(true),
  })
  .strict();

export type FuseSoulChips = z.infer<typeof FuseSoulChipsSchema>;

/**
 * Schema for SoulChip learning simulation
 */
export const SimulateLearningSchema = z
  .object({
    scenario: z.string().min(1, "Learning scenario is required"),
    iterations: z.number().int().min(1).max(1000).default(100),
    adaptationFactor: z.number().min(0.1).max(2.0).default(1.0),
  })
  .strict();

export type SimulateLearning = z.infer<typeof SimulateLearningSchema>;

// ============================================================================
// VALIDATION HELPERS
// ============================================================================

/**
 * Schema for validating SoulChip compatibility with Bot
 */
export const ValidateSoulChipCompatibilitySchema = z
  .object({
    soulChipId: z.string().min(1, "SoulChip ID is required"),
    botType: z.enum(["WORKER", "PLAYABLE", "KING", "ROGUE", "GOVBOT"]),
    minimumStats: z
      .object({
        intelligence: z.number().int().min(1).max(100).optional(),
        resilience: z.number().int().min(1).max(100).optional(),
        adaptability: z.number().int().min(1).max(100).optional(),
      })
      .optional(),
  })
  .strict();

export type ValidateSoulChipCompatibility = z.infer<
  typeof ValidateSoulChipCompatibilitySchema
>;

/**
 * Schema for SoulChip stat calculation
 */
export const CalculateEffectiveStatsSchema = z
  .object({
    baseIntelligence: z.number().int().min(1).max(100),
    baseResilience: z.number().int().min(1).max(100),
    baseAdaptability: z.number().int().min(1).max(100),
    learningRate: z.number().min(0.1).max(2.0),
    experienceCount: z.number().int().min(0),
    version: z.number().int().min(1),
    rarityBonus: z.number().min(0).max(2.0).default(1.0),
  })
  .strict();

export type CalculateEffectiveStats = z.infer<
  typeof CalculateEffectiveStatsSchema
>;

/**
 * Schema for SoulChip search and filtering
 */
export const SearchSoulChipsSchema = z
  .object({
    query: z
      .string()
      .min(1, "Search query is required")
      .max(100, "Search query too long"),
    rarity: z.array(RaritySchema).optional(),
    minIntelligence: z.number().int().min(1).max(100).optional(),
    maxIntelligence: z.number().int().min(1).max(100).optional(),
    minResilience: z.number().int().min(1).max(100).optional(),
    maxResilience: z.number().int().min(1).max(100).optional(),
    minAdaptability: z.number().int().min(1).max(100).optional(),
    maxAdaptability: z.number().int().min(1).max(100).optional(),
    tags: z.array(z.string()).optional(),
    userId: z.string().optional(),
    limit: z.number().int().min(1).max(100).default(20),
  })
  .strict();

export type SearchSoulChips = z.infer<typeof SearchSoulChipsSchema>;

// ============================================================================
// RESPONSE SCHEMAS
// ============================================================================

/**
 * Schema for SoulChip API responses
 */
export const SoulChipResponseSchema = SoulChipSchema.omit({
  metadata: true,
});

export type SoulChipResponse = z.infer<typeof SoulChipResponseSchema>;

/**
 * Schema for SoulChip with User information
 */
export const SoulChipWithUserSchema = SoulChipResponseSchema.safeExtend({
  user: z.object({
    id: z.string(),
    name: z.string().nullable(),
    email: z.string(),
  }),
});

export type SoulChipWithUser = z.infer<typeof SoulChipWithUserSchema>;

/**
 * Schema for SoulChip summary (minimal info)
 */
export const SoulChipSummarySchema = z
  .object({
    id: z.string(),
    name: z.string(),
    rarity: RaritySchema,
    intelligence: z.number().int(),
    resilience: z.number().int(),
    adaptability: z.number().int(),
    specialTrait: z.string(),
    version: z.number().int(),
    createdAt: z.date(),
  })
  .strict();

export type SoulChipSummary = z.infer<typeof SoulChipSummarySchema>;

/**
 * Schema for SoulChip with stats and calculations
 */
export const SoulChipWithStatsSchema = SoulChipResponseSchema.safeExtend({
  effectiveStats: z.object({
    totalPower: z.number(),
    balanceScore: z.number(),
    experienceBonus: z.number(),
    rarityMultiplier: z.number(),
  }),
  botCount: z.number().int().min(0),
  experienceCount: z.number().int().min(0),
});

export type SoulChipWithStats = z.infer<typeof SoulChipWithStatsSchema>;

/**
 * Schema for SoulChip evolution preview
 */
export const SoulChipEvolutionPreviewSchema = z
  .object({
    currentRarity: RaritySchema,
    targetRarity: RaritySchema,
    currentStats: z.object({
      intelligence: z.number().int(),
      resilience: z.number().int(),
      adaptability: z.number().int(),
    }),
    projectedStats: z.object({
      intelligence: z.number().int(),
      resilience: z.number().int(),
      adaptability: z.number().int(),
    }),
    evolutionCost: z.object({
      currency: z.number().int().min(0),
      materials: z.array(
        z.object({
          itemId: z.string(),
          quantity: z.number().int().min(1),
        })
      ),
    }),
    successRate: z.number().min(0).max(1),
  })
  .strict();

export type SoulChipEvolutionPreview = z.infer<
  typeof SoulChipEvolutionPreviewSchema
>;

// ============================================================================
// ADMIN SCHEMAS
// ============================================================================

/**
 * Schema for admin SoulChip management
 */
export const AdminSoulChipManagementSchema = z
  .object({
    action: z.enum([
      "list_all",
      "force_evolve",
      "reset_stats",
      "add_experience_bulk",
      "modify_rarity",
    ]),
    targetRarity: RaritySchema.optional(),
    statModifications: z
      .object({
        intelligence: z.number().int().min(1).max(100).optional(),
        resilience: z.number().int().min(1).max(100).optional(),
        adaptability: z.number().int().min(1).max(100).optional(),
      })
      .optional(),
    experienceToAdd: z.array(z.string()).optional(),
  })
  .strict();

export type AdminSoulChipManagement = z.infer<
  typeof AdminSoulChipManagementSchema
>;

/**
 * Schema for SoulChip statistics
 */
export const SoulChipStatsSchema = z
  .object({
    totalSoulChips: z.number().int().min(0),
    rarityDistribution: z.record(z.string(), z.number().int().min(0)),
    averageStats: z.object({
      intelligence: z.number(),
      resilience: z.number(),
      adaptability: z.number(),
      learningRate: z.number(),
    }),
    topPerformers: z.array(
      z.object({
        id: z.string(),
        name: z.string(),
        totalPower: z.number(),
        rarity: RaritySchema,
      })
    ),
    experienceDistribution: z.object({
      noExperience: z.number().int().min(0),
      lowExperience: z.number().int().min(0),
      mediumExperience: z.number().int().min(0),
      highExperience: z.number().int().min(0),
    }),
  })
  .strict();

export type SoulChipStats = z.infer<typeof SoulChipStatsSchema>;

// ============================================================================
// EXPORTS
// ============================================================================

// All schemas are defined above and exported individually

// Export all validation functions
export const SoulChipValidation = {
  // Base schemas
  model: SoulChipSchema,
  input: SoulChipInputSchema,
  rarity: RaritySchema,

  // CRUD schemas
  create: CreateSoulChipSchema,
  createApi: CreateSoulChipApiSchema,
  update: UpdateSoulChipSchema,
  updateApi: UpdateSoulChipApiSchema,
  partialUpdate: PartialUpdateSoulChipSchema,
  updateStats: UpdateSoulChipStatsSchema,
  addExperience: AddExperienceSchema,

  // Query schemas
  findUnique: FindUniqueSoulChipSchema,
  findMany: FindManySoulChipsSchema,
  where: SoulChipWhereSchema,
  orderBy: SoulChipOrderBySchema,
  select: SoulChipSelectSchema,
  include: SoulChipIncludeSchema,

  // SoulChip operations
  evolve: EvolveSoulChipSchema,
  fuse: FuseSoulChipsSchema,
  simulateLearning: SimulateLearningSchema,

  // Helpers
  compatibility: ValidateSoulChipCompatibilitySchema,
  calculateStats: CalculateEffectiveStatsSchema,
  search: SearchSoulChipsSchema,

  // Response schemas
  response: SoulChipResponseSchema,
  withUser: SoulChipWithUserSchema,
  summary: SoulChipSummarySchema,
  withStats: SoulChipWithStatsSchema,
  evolutionPreview: SoulChipEvolutionPreviewSchema,

  // Admin schemas
  adminManagement: AdminSoulChipManagementSchema,
  stats: SoulChipStatsSchema,
} as const;
