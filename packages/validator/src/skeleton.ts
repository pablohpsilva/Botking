import { Rarity, SkeletonType, MobilityType } from "@botking/db";
import { z } from "zod";

// Import enum schemas from Prisma types
const RaritySchema = z.enum(Rarity);
const SkeletonTypeSchema = z.enum(SkeletonType);
const MobilityTypeSchema = z.enum(MobilityType);

// ============================================================================
// BASE SCHEMAS
// ============================================================================

/**
 * Base Skeleton model schema - represents the complete Skeleton entity
 */
export const SkeletonSchema = z
  .object({
    id: z.string(),
    userId: z.string(),
    name: z.string(),
    type: SkeletonTypeSchema,
    rarity: RaritySchema,
    slots: z.number().int(),
    baseDurability: z.number().int(),
    currentDurability: z.number().int(),
    maxDurability: z.number().int(),
    mobilityType: MobilityTypeSchema,
    upgradeLevel: z.number().int(),
    specialAbilities: z.array(z.string()),
    version: z.number().int(),
    source: z.string().nullable(),
    tags: z.array(z.string()),
    description: z.string().nullable(),
    metadata: z.unknown().nullable(),
    createdAt: z.date(),
    updatedAt: z.date(),
  })
  .strict();

export type Skeleton = z.infer<typeof SkeletonSchema>;

/**
 * Skeleton input schema for forms and API inputs (without auto-generated fields)
 */
export const SkeletonInputSchema = z
  .object({
    userId: z.string().min(1, "User ID is required"),
    name: z
      .string()
      .min(1, "Name is required")
      .max(100, "Name must be 100 characters or less"),
    type: SkeletonTypeSchema,
    rarity: RaritySchema,
    slots: z
      .number()
      .int()
      .min(1, "Must have at least 1 slot")
      .max(20, "Cannot exceed 20 slots")
      .default(4),
    baseDurability: z
      .number()
      .int()
      .min(1, "Base durability must be at least 1")
      .max(10000, "Base durability cannot exceed 10000")
      .default(100),
    currentDurability: z
      .number()
      .int()
      .min(0, "Current durability cannot be negative")
      .default(100),
    maxDurability: z
      .number()
      .int()
      .min(1, "Max durability must be at least 1")
      .max(10000, "Max durability cannot exceed 10000")
      .default(100),
    mobilityType: MobilityTypeSchema,
    upgradeLevel: z
      .number()
      .int()
      .min(0, "Upgrade level cannot be negative")
      .max(50, "Upgrade level cannot exceed 50")
      .default(0),
    specialAbilities: z.array(z.string()).default([]),
    source: z.string().optional().nullable(),
    tags: z.array(z.string()).default([]),
    description: z.string().optional().nullable(),
    metadata: z.unknown().optional().nullable(),
  })
  .strict()
  .refine((data) => data.currentDurability <= data.maxDurability, {
    message: "Current durability cannot exceed max durability",
    path: ["currentDurability"],
  })
  .refine((data) => data.maxDurability >= data.baseDurability, {
    message: "Max durability cannot be less than base durability",
    path: ["maxDurability"],
  });

export type SkeletonInput = z.infer<typeof SkeletonInputSchema>;

// ============================================================================
// CREATE SCHEMAS
// ============================================================================

/**
 * Schema for creating a new Skeleton
 * Compatible with Prisma SkeletonCreateInput
 */
export const CreateSkeletonSchema = z
  .object({
    id: z.string().optional(),
    userId: z.string().min(1, "User ID is required"),
    name: z
      .string()
      .min(1, "Name is required")
      .max(100, "Name must be 100 characters or less"),
    type: SkeletonTypeSchema,
    rarity: RaritySchema,
    slots: z
      .number()
      .int()
      .min(1, "Must have at least 1 slot")
      .max(20, "Cannot exceed 20 slots")
      .default(4),
    baseDurability: z
      .number()
      .int()
      .min(1, "Base durability must be at least 1")
      .max(10000, "Base durability cannot exceed 10000")
      .default(100),
    currentDurability: z
      .number()
      .int()
      .min(0, "Current durability cannot be negative")
      .default(100),
    maxDurability: z
      .number()
      .int()
      .min(1, "Max durability must be at least 1")
      .max(10000, "Max durability cannot exceed 10000")
      .default(100),
    mobilityType: MobilityTypeSchema,
    upgradeLevel: z
      .number()
      .int()
      .min(0, "Upgrade level cannot be negative")
      .max(50, "Upgrade level cannot exceed 50")
      .default(0),
    specialAbilities: z.array(z.string()).default([]),
    version: z.number().int().min(1).default(1),
    source: z.string().optional().nullable(),
    tags: z.array(z.string()).default([]),
    description: z.string().optional().nullable(),
    metadata: z.unknown().optional().nullable(),
    createdAt: z.coerce.date().optional(),
    updatedAt: z.coerce.date().optional(),
  })
  .strict()
  .refine((data) => data.currentDurability <= data.maxDurability, {
    message: "Current durability cannot exceed max durability",
    path: ["currentDurability"],
  })
  .refine((data) => data.maxDurability >= data.baseDurability, {
    message: "Max durability cannot be less than base durability",
    path: ["maxDurability"],
  });

export type CreateSkeletonInput = z.infer<typeof CreateSkeletonSchema>;

/**
 * Simplified create schema for API endpoints
 */
export const CreateSkeletonApiSchema = z
  .object({
    name: z
      .string()
      .min(1, "Name is required")
      .max(100, "Name must be 100 characters or less"),
    type: SkeletonTypeSchema,
    rarity: RaritySchema,
    mobilityType: MobilityTypeSchema,
    slots: z
      .number()
      .int()
      .min(1, "Must have at least 1 slot")
      .max(20, "Cannot exceed 20 slots")
      .optional(),
    baseDurability: z
      .number()
      .int()
      .min(1, "Base durability must be at least 1")
      .max(10000, "Base durability cannot exceed 10000")
      .optional(),
    specialAbilities: z.array(z.string()).optional(),
    source: z.string().optional(),
    tags: z.array(z.string()).optional(),
    description: z.string().optional(),
  })
  .strict();

export type CreateSkeletonApi = z.infer<typeof CreateSkeletonApiSchema>;

/**
 * Schema for blueprint-based skeleton creation
 */
export const CreateSkeletonFromBlueprintSchema = z
  .object({
    userId: z.string().min(1, "User ID is required"),
    blueprintId: z.string().min(1, "Blueprint ID is required"),
    customizations: z
      .object({
        name: z.string().optional(),
        tags: z.array(z.string()).optional(),
        description: z.string().optional(),
      })
      .optional(),
    applyUpgrades: z.boolean().default(false),
  })
  .strict();

export type CreateSkeletonFromBlueprint = z.infer<
  typeof CreateSkeletonFromBlueprintSchema
>;

// ============================================================================
// UPDATE SCHEMAS
// ============================================================================

/**
 * Schema for updating a Skeleton
 * Compatible with Prisma SkeletonUpdateInput
 */
export const UpdateSkeletonSchema = z
  .object({
    id: z.string().optional(),
    userId: z.string().min(1, "User ID is required").optional(),
    name: z
      .string()
      .min(1, "Name is required")
      .max(100, "Name must be 100 characters or less")
      .optional(),
    type: SkeletonTypeSchema.optional(),
    rarity: RaritySchema.optional(),
    slots: z
      .number()
      .int()
      .min(1, "Must have at least 1 slot")
      .max(20, "Cannot exceed 20 slots")
      .optional(),
    baseDurability: z
      .number()
      .int()
      .min(1, "Base durability must be at least 1")
      .max(10000, "Base durability cannot exceed 10000")
      .optional(),
    currentDurability: z
      .number()
      .int()
      .min(0, "Current durability cannot be negative")
      .optional(),
    maxDurability: z
      .number()
      .int()
      .min(1, "Max durability must be at least 1")
      .max(10000, "Max durability cannot exceed 10000")
      .optional(),
    mobilityType: MobilityTypeSchema.optional(),
    upgradeLevel: z
      .number()
      .int()
      .min(0, "Upgrade level cannot be negative")
      .max(50, "Upgrade level cannot exceed 50")
      .optional(),
    specialAbilities: z.array(z.string()).optional(),
    version: z.number().int().min(1).optional(),
    source: z.string().optional().nullable(),
    tags: z.array(z.string()).optional(),
    description: z.string().optional().nullable(),
    metadata: z.unknown().optional().nullable(),
    createdAt: z.coerce.date().optional(),
    updatedAt: z.coerce.date().optional(),
  })
  .strict();

export type UpdateSkeletonInput = z.infer<typeof UpdateSkeletonSchema>;

/**
 * Simplified update schema for API endpoints
 */
export const UpdateSkeletonApiSchema = z
  .object({
    name: z
      .string()
      .min(1, "Name is required")
      .max(100, "Name must be 100 characters or less")
      .optional(),
    specialAbilities: z.array(z.string()).optional(),
    tags: z.array(z.string()).optional(),
    description: z.string().optional().nullable(),
  })
  .strict();

export type UpdateSkeletonApi = z.infer<typeof UpdateSkeletonApiSchema>;

/**
 * Partial update schema - all fields optional
 */
export const PartialUpdateSkeletonSchema = SkeletonInputSchema.partial();
export type PartialUpdateSkeleton = z.infer<typeof PartialUpdateSkeletonSchema>;

/**
 * Schema for durability modifications
 */
export const UpdateSkeletonDurabilitySchema = z
  .object({
    currentDurability: z
      .number()
      .int()
      .min(0, "Current durability cannot be negative")
      .optional(),
    maxDurability: z
      .number()
      .int()
      .min(1, "Max durability must be at least 1")
      .max(10000, "Max durability cannot exceed 10000")
      .optional(),
    repairAmount: z
      .number()
      .int()
      .min(1, "Repair amount must be positive")
      .optional(),
    damageAmount: z
      .number()
      .int()
      .min(1, "Damage amount must be positive")
      .optional(),
  })
  .strict()
  .refine(
    (data) => {
      // Must have at least one operation
      return (
        data.currentDurability !== undefined ||
        data.maxDurability !== undefined ||
        data.repairAmount !== undefined ||
        data.damageAmount !== undefined
      );
    },
    {
      message: "At least one durability operation must be specified",
    }
  );

export type UpdateSkeletonDurability = z.infer<
  typeof UpdateSkeletonDurabilitySchema
>;

/**
 * Schema for upgrade operations
 */
export const UpgradeSkeletonSchema = z
  .object({
    targetLevel: z
      .number()
      .int()
      .min(1, "Target level must be at least 1")
      .max(50, "Target level cannot exceed 50"),
    upgradeType: z.enum(["slots", "durability", "abilities", "hybrid"]),
    slotIncrease: z
      .number()
      .int()
      .min(0, "Slot increase cannot be negative")
      .max(10, "Cannot increase slots by more than 10")
      .optional(),
    durabilityIncrease: z
      .number()
      .int()
      .min(0, "Durability increase cannot be negative")
      .max(5000, "Durability increase too large")
      .optional(),
    newAbilities: z.array(z.string()).optional(),
  })
  .strict();

export type UpgradeSkeleton = z.infer<typeof UpgradeSkeletonSchema>;

// ============================================================================
// QUERY SCHEMAS
// ============================================================================

/**
 * Schema for finding a unique Skeleton
 */
export const FindUniqueSkeletonSchema = z
  .object({
    id: z.string().optional(),
  })
  .strict();

export type FindUniqueSkeletonInput = z.infer<typeof FindUniqueSkeletonSchema>;

/**
 * Schema for filtering Skeletons
 */
export const SkeletonWhereSchema: z.ZodType<any> = z.lazy(() =>
  z
    .object({
      id: z.string().optional(),
      userId: z.string().optional(),
      name: z.string().optional(),
      type: SkeletonTypeSchema.optional(),
      rarity: RaritySchema.optional(),
      slots: z.number().int().optional(),
      baseDurability: z.number().int().optional(),
      currentDurability: z.number().int().optional(),
      maxDurability: z.number().int().optional(),
      mobilityType: MobilityTypeSchema.optional(),
      upgradeLevel: z.number().int().optional(),
      version: z.number().int().optional(),
      source: z.string().nullable().optional(),
      tags: z.array(z.string()).optional(),
      description: z.string().nullable().optional(),
      createdAt: z.date().optional(),
      updatedAt: z.date().optional(),
      AND: z.array(SkeletonWhereSchema).optional(),
      OR: z.array(SkeletonWhereSchema).optional(),
      NOT: SkeletonWhereSchema.optional(),
    })
    .strict()
);

export type SkeletonWhere = z.infer<typeof SkeletonWhereSchema>;

/**
 * Schema for ordering Skeletons
 */
export const SkeletonOrderBySchema = z
  .object({
    id: z.enum(["asc", "desc"]).optional(),
    userId: z.enum(["asc", "desc"]).optional(),
    name: z.enum(["asc", "desc"]).optional(),
    type: z.enum(["asc", "desc"]).optional(),
    rarity: z.enum(["asc", "desc"]).optional(),
    slots: z.enum(["asc", "desc"]).optional(),
    baseDurability: z.enum(["asc", "desc"]).optional(),
    currentDurability: z.enum(["asc", "desc"]).optional(),
    maxDurability: z.enum(["asc", "desc"]).optional(),
    mobilityType: z.enum(["asc", "desc"]).optional(),
    upgradeLevel: z.enum(["asc", "desc"]).optional(),
    version: z.enum(["asc", "desc"]).optional(),
    createdAt: z.enum(["asc", "desc"]).optional(),
    updatedAt: z.enum(["asc", "desc"]).optional(),
  })
  .strict();

export type SkeletonOrderBy = z.infer<typeof SkeletonOrderBySchema>;

/**
 * Schema for selecting Skeleton fields
 */
export const SkeletonSelectSchema = z
  .object({
    id: z.boolean().optional(),
    userId: z.boolean().optional(),
    name: z.boolean().optional(),
    type: z.boolean().optional(),
    rarity: z.boolean().optional(),
    slots: z.boolean().optional(),
    baseDurability: z.boolean().optional(),
    currentDurability: z.boolean().optional(),
    maxDurability: z.boolean().optional(),
    mobilityType: z.boolean().optional(),
    upgradeLevel: z.boolean().optional(),
    specialAbilities: z.boolean().optional(),
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

export type SkeletonSelect = z.infer<typeof SkeletonSelectSchema>;

/**
 * Schema for including Skeleton relations
 */
export const SkeletonIncludeSchema = z
  .object({
    user: z.boolean().optional(),
    bots: z.boolean().optional(),
  })
  .strict();

export type SkeletonInclude = z.infer<typeof SkeletonIncludeSchema>;

// ============================================================================
// PAGINATION SCHEMAS
// ============================================================================

/**
 * Schema for paginated Skeleton queries
 */
export const FindManySkeletonsSchema = z
  .object({
    where: SkeletonWhereSchema.optional(),
    orderBy: z
      .union([SkeletonOrderBySchema, z.array(SkeletonOrderBySchema)])
      .optional(),
    select: SkeletonSelectSchema.optional(),
    include: SkeletonIncludeSchema.optional(),
    skip: z.number().int().min(0).optional(),
    take: z.number().int().min(1).max(1000).optional(),
    cursor: FindUniqueSkeletonSchema.optional(),
  })
  .strict();

export type FindManySkeletonsInput = z.infer<typeof FindManySkeletonsSchema>;

// ============================================================================
// SKELETON SPECIFIC SCHEMAS
// ============================================================================

/**
 * Schema for skeleton repair operations
 */
export const RepairSkeletonSchema = z
  .object({
    repairType: z.enum(["partial", "full", "emergency"]),
    repairAmount: z
      .number()
      .int()
      .min(1, "Repair amount must be positive")
      .optional(),
    useMaterials: z.boolean().default(true),
    materialIds: z.array(z.string()).optional(),
    upgradeWhileRepairing: z.boolean().default(false),
  })
  .strict();

export type RepairSkeleton = z.infer<typeof RepairSkeletonSchema>;

/**
 * Schema for skeleton modification
 */
export const ModifySkeletonSchema = z
  .object({
    modificationType: z.enum([
      "add_slot",
      "remove_slot",
      "change_mobility",
      "add_ability",
      "remove_ability",
      "structural_change",
    ]),
    newMobilityType: MobilityTypeSchema.optional(),
    slotModification: z
      .object({
        count: z.number().int().min(-10).max(10),
        slotType: z.enum(["standard", "specialized", "expansion"]).optional(),
      })
      .optional(),
    abilityChanges: z
      .object({
        add: z.array(z.string()).optional(),
        remove: z.array(z.string()).optional(),
      })
      .optional(),
    preserveUpgrades: z.boolean().default(true),
  })
  .strict();

export type ModifySkeleton = z.infer<typeof ModifySkeletonSchema>;

/**
 * Schema for skeleton fusion
 */
export const FuseSkeletonsSchema = z
  .object({
    primarySkeletonId: z.string().min(1, "Primary skeleton ID is required"),
    secondarySkeletonId: z.string().min(1, "Secondary skeleton ID is required"),
    fusionStyle: z.enum(["balanced", "dominant_primary", "hybrid", "custom"]),
    targetType: SkeletonTypeSchema.optional(),
    targetMobilityType: MobilityTypeSchema.optional(),
    preserveAbilities: z.boolean().default(true),
    slotDistribution: z
      .object({
        fromPrimary: z.number().int().min(0).max(1).default(0.7),
        fromSecondary: z.number().int().min(0).max(1).default(0.3),
      })
      .optional(),
  })
  .strict();

export type FuseSkeletons = z.infer<typeof FuseSkeletonsSchema>;

/**
 * Schema for skeleton blueprinting
 */
export const CreateSkeletonBlueprintSchema = z
  .object({
    name: z.string().min(1, "Blueprint name is required"),
    basedOnSkeletonId: z.string().min(1, "Base skeleton ID is required"),
    includeUpgrades: z.boolean().default(false),
    includeAbilities: z.boolean().default(true),
    modifications: z
      .object({
        slotAdjustment: z.number().int().min(-5).max(5).optional(),
        durabilityModifier: z.number().min(0.5).max(2.0).optional(),
        typeOverride: SkeletonTypeSchema.optional(),
        mobilityOverride: MobilityTypeSchema.optional(),
      })
      .optional(),
    isPublic: z.boolean().default(false),
    tags: z.array(z.string()).default([]),
    description: z.string().optional(),
  })
  .strict();

export type CreateSkeletonBlueprint = z.infer<
  typeof CreateSkeletonBlueprintSchema
>;

// ============================================================================
// VALIDATION HELPERS
// ============================================================================

/**
 * Schema for validating skeleton compatibility with parts
 */
export const ValidateSkeletonCompatibilitySchema = z
  .object({
    skeletonId: z.string().min(1, "Skeleton ID is required"),
    partIds: z.array(z.string()).min(1, "At least one part ID is required"),
    checkSlotAvailability: z.boolean().default(true),
    checkMobilityRequirements: z.boolean().default(true),
    checkDurabilityRequirements: z.boolean().default(false),
  })
  .strict();

export type ValidateSkeletonCompatibility = z.infer<
  typeof ValidateSkeletonCompatibilitySchema
>;

/**
 * Schema for skeleton performance calculation
 */
export const CalculateSkeletonPerformanceSchema = z
  .object({
    type: SkeletonTypeSchema,
    mobilityType: MobilityTypeSchema,
    slots: z.number().int().min(1).max(20),
    currentDurability: z.number().int().min(0),
    maxDurability: z.number().int().min(1),
    upgradeLevel: z.number().int().min(0).max(50),
    specialAbilities: z.array(z.string()),
    attachedPartsCount: z.number().int().min(0).optional(),
    environmentFactors: z
      .object({
        terrain: z
          .enum(["urban", "desert", "forest", "arctic", "space"])
          .optional(),
        conditions: z.enum(["normal", "harsh", "extreme"]).optional(),
      })
      .optional(),
  })
  .strict();

export type CalculateSkeletonPerformance = z.infer<
  typeof CalculateSkeletonPerformanceSchema
>;

/**
 * Schema for skeleton search and filtering
 */
export const SearchSkeletonsSchema = z
  .object({
    query: z
      .string()
      .min(1, "Search query is required")
      .max(100, "Search query too long"),
    type: z.array(SkeletonTypeSchema).optional(),
    rarity: z.array(RaritySchema).optional(),
    mobilityType: z.array(MobilityTypeSchema).optional(),
    minSlots: z.number().int().min(1).max(20).optional(),
    maxSlots: z.number().int().min(1).max(20).optional(),
    minDurability: z.number().int().min(0).optional(),
    maxDurability: z.number().int().max(10000).optional(),
    minUpgradeLevel: z.number().int().min(0).max(50).optional(),
    maxUpgradeLevel: z.number().int().min(0).max(50).optional(),
    hasAbilities: z.boolean().optional(),
    tags: z.array(z.string()).optional(),
    userId: z.string().optional(),
    limit: z.number().int().min(1).max(100).default(20),
  })
  .strict();

export type SearchSkeletons = z.infer<typeof SearchSkeletonsSchema>;

// ============================================================================
// RESPONSE SCHEMAS
// ============================================================================

/**
 * Schema for Skeleton API responses
 */
export const SkeletonResponseSchema = SkeletonSchema.omit({
  metadata: true,
});

export type SkeletonResponse = z.infer<typeof SkeletonResponseSchema>;

/**
 * Schema for Skeleton with User information
 */
export const SkeletonWithUserSchema = SkeletonResponseSchema.extend({
  user: z.object({
    id: z.string(),
    name: z.string().nullable(),
    email: z.string(),
  }),
});

export type SkeletonWithUser = z.infer<typeof SkeletonWithUserSchema>;

/**
 * Schema for Skeleton summary (minimal info)
 */
export const SkeletonSummarySchema = z
  .object({
    id: z.string(),
    name: z.string(),
    type: SkeletonTypeSchema,
    rarity: RaritySchema,
    slots: z.number().int(),
    currentDurability: z.number().int(),
    maxDurability: z.number().int(),
    mobilityType: MobilityTypeSchema,
    upgradeLevel: z.number().int(),
    createdAt: z.date(),
  })
  .strict();

export type SkeletonSummary = z.infer<typeof SkeletonSummarySchema>;

/**
 * Schema for Skeleton with performance metrics
 */
export const SkeletonWithPerformanceSchema = SkeletonResponseSchema.extend({
  performanceMetrics: z.object({
    mobilityScore: z.number(),
    durabilityRatio: z.number(),
    slotEfficiency: z.number(),
    upgradeProgress: z.number(),
    overallRating: z.number(),
  }),
  botCount: z.number().int().min(0),
  availableSlots: z.number().int().min(0),
  repairCost: z.number().int().min(0),
});

export type SkeletonWithPerformance = z.infer<
  typeof SkeletonWithPerformanceSchema
>;

/**
 * Schema for skeleton upgrade preview
 */
export const SkeletonUpgradePreviewSchema = z
  .object({
    currentLevel: z.number().int(),
    targetLevel: z.number().int(),
    currentStats: z.object({
      slots: z.number().int(),
      maxDurability: z.number().int(),
      abilities: z.array(z.string()),
    }),
    projectedStats: z.object({
      slots: z.number().int(),
      maxDurability: z.number().int(),
      abilities: z.array(z.string()),
    }),
    upgradeCost: z.object({
      currency: z.number().int().min(0),
      materials: z.array(
        z.object({
          itemId: z.string(),
          quantity: z.number().int().min(1),
        })
      ),
      timeRequired: z.number().int().min(0), // in seconds
    }),
    successRate: z.number().min(0).max(1),
    risks: z.array(z.string()),
  })
  .strict();

export type SkeletonUpgradePreview = z.infer<
  typeof SkeletonUpgradePreviewSchema
>;

// ============================================================================
// ADMIN SCHEMAS
// ============================================================================

/**
 * Schema for admin skeleton management
 */
export const AdminSkeletonManagementSchema = z
  .object({
    action: z.enum([
      "list_all",
      "force_upgrade",
      "reset_durability",
      "modify_slots",
      "change_rarity",
      "bulk_repair",
    ]),
    targetRarity: RaritySchema.optional(),
    slotModification: z.number().int().min(-10).max(10).optional(),
    durabilityOperation: z
      .object({
        type: z.enum(["set", "add", "reset"]),
        value: z.number().int().min(0).optional(),
      })
      .optional(),
    upgradeModification: z
      .object({
        targetLevel: z.number().int().min(0).max(50),
        preserveAbilities: z.boolean().default(true),
      })
      .optional(),
  })
  .strict();

export type AdminSkeletonManagement = z.infer<
  typeof AdminSkeletonManagementSchema
>;

/**
 * Schema for skeleton statistics
 */
export const SkeletonStatsSchema = z
  .object({
    totalSkeletons: z.number().int().min(0),
    typeDistribution: z.record(z.string(), z.number().int().min(0)),
    rarityDistribution: z.record(z.string(), z.number().int().min(0)),
    mobilityDistribution: z.record(z.string(), z.number().int().min(0)),
    averageStats: z.object({
      slots: z.number(),
      durability: z.number(),
      upgradeLevel: z.number(),
    }),
    durabilityStats: z.object({
      averageCondition: z.number(),
      needingRepair: z.number().int().min(0),
      fullyUpgraded: z.number().int().min(0),
    }),
    topPerformers: z.array(
      z.object({
        id: z.string(),
        name: z.string(),
        performanceScore: z.number(),
        type: SkeletonTypeSchema,
        rarity: RaritySchema,
      })
    ),
  })
  .strict();

export type SkeletonStats = z.infer<typeof SkeletonStatsSchema>;

// ============================================================================
// EXPORTS
// ============================================================================

// All schemas are defined above and exported individually

// Export all validation functions
export const SkeletonValidation = {
  // Base schemas
  model: SkeletonSchema,
  input: SkeletonInputSchema,
  type: SkeletonTypeSchema,
  rarity: RaritySchema,
  mobilityType: MobilityTypeSchema,

  // CRUD schemas
  create: CreateSkeletonSchema,
  createApi: CreateSkeletonApiSchema,
  createFromBlueprint: CreateSkeletonFromBlueprintSchema,
  update: UpdateSkeletonSchema,
  updateApi: UpdateSkeletonApiSchema,
  partialUpdate: PartialUpdateSkeletonSchema,
  updateDurability: UpdateSkeletonDurabilitySchema,
  upgrade: UpgradeSkeletonSchema,

  // Query schemas
  findUnique: FindUniqueSkeletonSchema,
  findMany: FindManySkeletonsSchema,
  where: SkeletonWhereSchema,
  orderBy: SkeletonOrderBySchema,
  select: SkeletonSelectSchema,
  include: SkeletonIncludeSchema,

  // Skeleton operations
  repair: RepairSkeletonSchema,
  modify: ModifySkeletonSchema,
  fuse: FuseSkeletonsSchema,
  createBlueprint: CreateSkeletonBlueprintSchema,

  // Helpers
  compatibility: ValidateSkeletonCompatibilitySchema,
  calculatePerformance: CalculateSkeletonPerformanceSchema,
  search: SearchSkeletonsSchema,

  // Response schemas
  response: SkeletonResponseSchema,
  withUser: SkeletonWithUserSchema,
  summary: SkeletonSummarySchema,
  withPerformance: SkeletonWithPerformanceSchema,
  upgradePreview: SkeletonUpgradePreviewSchema,

  // Admin schemas
  adminManagement: AdminSkeletonManagementSchema,
  stats: SkeletonStatsSchema,
} as const;
