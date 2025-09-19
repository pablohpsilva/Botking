import { Rarity, PartCategory } from "@botking/db";
import { z } from "zod";

// Import enum schemas from Prisma types
const RaritySchema = z.enum(Rarity);
const PartCategorySchema = z.enum(PartCategory);

// ============================================================================
// BASE SCHEMAS
// ============================================================================

/**
 * Base Part model schema - represents the complete Part entity
 */
export const PartSchema = z
  .object({
    id: z.string(),
    userId: z.string(),
    name: z.string(),
    category: PartCategorySchema,
    rarity: RaritySchema,
    attack: z.number().int(),
    defense: z.number().int(),
    speed: z.number().int(),
    perception: z.number().int(),
    energyConsumption: z.number().int(),
    upgradeLevel: z.number().int(),
    currentDurability: z.number().int(),
    maxDurability: z.number().int(),
    abilities: z.array(z.unknown()),
    version: z.number().int(),
    source: z.string().nullable(),
    tags: z.array(z.string()),
    description: z.string().nullable(),
    metadata: z.unknown().nullable(),
    createdAt: z.date(),
    updatedAt: z.date(),
  })
  .strict();

export type Part = z.infer<typeof PartSchema>;

/**
 * Part ability schema for JSON abilities array
 */
export const PartAbilitySchema = z
  .object({
    id: z.string().optional(),
    name: z.string().min(1, "Ability name is required"),
    type: z.enum(["passive", "active", "triggered", "enhancement", "special"]),
    description: z.string().min(1, "Ability description is required"),
    effects: z.array(
      z.object({
        stat: z.enum(["attack", "defense", "speed", "perception", "energy"]),
        modifier: z.number(),
        type: z.enum(["flat", "percentage", "multiplier"]),
      })
    ),
    cooldown: z.number().int().min(0).optional(),
    energyCost: z.number().int().min(0).optional(),
    conditions: z.array(z.string()).optional(),
    level: z.number().int().min(1).max(10).default(1),
  })
  .strict();

export type PartAbility = z.infer<typeof PartAbilitySchema>;

/**
 * Part input schema for forms and API inputs (without auto-generated fields)
 */
export const PartInputSchema = z
  .object({
    userId: z.string().min(1, "User ID is required"),
    name: z
      .string()
      .min(1, "Name is required")
      .max(100, "Name must be 100 characters or less"),
    category: PartCategorySchema,
    rarity: RaritySchema,
    attack: z
      .number()
      .int()
      .min(0, "Attack cannot be negative")
      .max(1000, "Attack cannot exceed 1000")
      .default(0),
    defense: z
      .number()
      .int()
      .min(0, "Defense cannot be negative")
      .max(1000, "Defense cannot exceed 1000")
      .default(0),
    speed: z
      .number()
      .int()
      .min(0, "Speed cannot be negative")
      .max(1000, "Speed cannot exceed 1000")
      .default(0),
    perception: z
      .number()
      .int()
      .min(0, "Perception cannot be negative")
      .max(1000, "Perception cannot exceed 1000")
      .default(0),
    energyConsumption: z
      .number()
      .int()
      .min(1, "Energy consumption must be at least 1")
      .max(100, "Energy consumption cannot exceed 100")
      .default(5),
    upgradeLevel: z
      .number()
      .int()
      .min(0, "Upgrade level cannot be negative")
      .max(25, "Upgrade level cannot exceed 25")
      .default(0),
    currentDurability: z
      .number()
      .int()
      .min(0, "Current durability cannot be negative")
      .default(100),
    maxDurability: z
      .number()
      .int()
      .min(1, "Max durability must be at least 1")
      .max(5000, "Max durability cannot exceed 5000")
      .default(100),
    abilities: z.array(PartAbilitySchema).default([]),
    source: z.string().optional().nullable(),
    tags: z.array(z.string()).default([]),
    description: z.string().optional().nullable(),
    metadata: z.unknown().optional().nullable(),
  })
  .strict()
  .refine((data) => data.currentDurability <= data.maxDurability, {
    message: "Current durability cannot exceed max durability",
    path: ["currentDurability"],
  });

export type PartInput = z.infer<typeof PartInputSchema>;

// ============================================================================
// CREATE SCHEMAS
// ============================================================================

/**
 * Schema for creating a new Part
 * Compatible with Prisma PartCreateInput
 */
export const CreatePartSchema = z
  .object({
    id: z.string().optional(),
    userId: z.string().min(1, "User ID is required"),
    name: z
      .string()
      .min(1, "Name is required")
      .max(100, "Name must be 100 characters or less"),
    category: PartCategorySchema,
    rarity: RaritySchema,
    attack: z
      .number()
      .int()
      .min(0, "Attack cannot be negative")
      .max(1000, "Attack cannot exceed 1000")
      .default(0),
    defense: z
      .number()
      .int()
      .min(0, "Defense cannot be negative")
      .max(1000, "Defense cannot exceed 1000")
      .default(0),
    speed: z
      .number()
      .int()
      .min(0, "Speed cannot be negative")
      .max(1000, "Speed cannot exceed 1000")
      .default(0),
    perception: z
      .number()
      .int()
      .min(0, "Perception cannot be negative")
      .max(1000, "Perception cannot exceed 1000")
      .default(0),
    energyConsumption: z
      .number()
      .int()
      .min(1, "Energy consumption must be at least 1")
      .max(100, "Energy consumption cannot exceed 100")
      .default(5),
    upgradeLevel: z
      .number()
      .int()
      .min(0, "Upgrade level cannot be negative")
      .max(25, "Upgrade level cannot exceed 25")
      .default(0),
    currentDurability: z
      .number()
      .int()
      .min(0, "Current durability cannot be negative")
      .default(100),
    maxDurability: z
      .number()
      .int()
      .min(1, "Max durability must be at least 1")
      .max(5000, "Max durability cannot exceed 5000")
      .default(100),
    abilities: z.array(PartAbilitySchema).default([]),
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
  });

export type CreatePartInput = z.infer<typeof CreatePartSchema>;

/**
 * Simplified create schema for API endpoints
 */
export const CreatePartApiSchema = z
  .object({
    name: z
      .string()
      .min(1, "Name is required")
      .max(100, "Name must be 100 characters or less"),
    category: PartCategorySchema,
    rarity: RaritySchema,
    attack: z
      .number()
      .int()
      .min(0, "Attack cannot be negative")
      .max(1000, "Attack cannot exceed 1000")
      .optional(),
    defense: z
      .number()
      .int()
      .min(0, "Defense cannot be negative")
      .max(1000, "Defense cannot exceed 1000")
      .optional(),
    speed: z
      .number()
      .int()
      .min(0, "Speed cannot be negative")
      .max(1000, "Speed cannot exceed 1000")
      .optional(),
    perception: z
      .number()
      .int()
      .min(0, "Perception cannot be negative")
      .max(1000, "Perception cannot exceed 1000")
      .optional(),
    energyConsumption: z
      .number()
      .int()
      .min(1, "Energy consumption must be at least 1")
      .max(100, "Energy consumption cannot exceed 100")
      .optional(),
    abilities: z.array(PartAbilitySchema).optional(),
    source: z.string().optional(),
    tags: z.array(z.string()).optional(),
    description: z.string().optional(),
  })
  .strict();

export type CreatePartApi = z.infer<typeof CreatePartApiSchema>;

// ============================================================================
// UPDATE SCHEMAS
// ============================================================================

/**
 * Schema for updating a Part
 * Compatible with Prisma PartUpdateInput
 */
export const UpdatePartSchema = z
  .object({
    id: z.string().optional(),
    userId: z.string().min(1, "User ID is required").optional(),
    name: z
      .string()
      .min(1, "Name is required")
      .max(100, "Name must be 100 characters or less")
      .optional(),
    category: PartCategorySchema.optional(),
    rarity: RaritySchema.optional(),
    attack: z
      .number()
      .int()
      .min(0, "Attack cannot be negative")
      .max(1000, "Attack cannot exceed 1000")
      .optional(),
    defense: z
      .number()
      .int()
      .min(0, "Defense cannot be negative")
      .max(1000, "Defense cannot exceed 1000")
      .optional(),
    speed: z
      .number()
      .int()
      .min(0, "Speed cannot be negative")
      .max(1000, "Speed cannot exceed 1000")
      .optional(),
    perception: z
      .number()
      .int()
      .min(0, "Perception cannot be negative")
      .max(1000, "Perception cannot exceed 1000")
      .optional(),
    energyConsumption: z
      .number()
      .int()
      .min(1, "Energy consumption must be at least 1")
      .max(100, "Energy consumption cannot exceed 100")
      .optional(),
    upgradeLevel: z
      .number()
      .int()
      .min(0, "Upgrade level cannot be negative")
      .max(25, "Upgrade level cannot exceed 25")
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
      .max(5000, "Max durability cannot exceed 5000")
      .optional(),
    abilities: z.array(PartAbilitySchema).optional(),
    version: z.number().int().min(1).optional(),
    source: z.string().optional().nullable(),
    tags: z.array(z.string()).optional(),
    description: z.string().optional().nullable(),
    metadata: z.unknown().optional().nullable(),
    createdAt: z.coerce.date().optional(),
    updatedAt: z.coerce.date().optional(),
  })
  .strict();

export type UpdatePartInput = z.infer<typeof UpdatePartSchema>;

/**
 * Simplified update schema for API endpoints
 */
export const UpdatePartApiSchema = z
  .object({
    name: z
      .string()
      .min(1, "Name is required")
      .max(100, "Name must be 100 characters or less")
      .optional(),
    abilities: z.array(PartAbilitySchema).optional(),
    tags: z.array(z.string()).optional(),
    description: z.string().optional().nullable(),
  })
  .strict();

export type UpdatePartApi = z.infer<typeof UpdatePartApiSchema>;

/**
 * Partial update schema - all fields optional
 */
export const PartialUpdatePartSchema = PartInputSchema.partial();
export type PartialUpdatePart = z.infer<typeof PartialUpdatePartSchema>;

/**
 * Schema for stat modifications
 */
export const UpdatePartStatsSchema = z
  .object({
    attack: z
      .number()
      .int()
      .min(0, "Attack cannot be negative")
      .max(1000, "Attack cannot exceed 1000")
      .optional(),
    defense: z
      .number()
      .int()
      .min(0, "Defense cannot be negative")
      .max(1000, "Defense cannot exceed 1000")
      .optional(),
    speed: z
      .number()
      .int()
      .min(0, "Speed cannot be negative")
      .max(1000, "Speed cannot exceed 1000")
      .optional(),
    perception: z
      .number()
      .int()
      .min(0, "Perception cannot be negative")
      .max(1000, "Perception cannot exceed 1000")
      .optional(),
    energyConsumption: z
      .number()
      .int()
      .min(1, "Energy consumption must be at least 1")
      .max(100, "Energy consumption cannot exceed 100")
      .optional(),
  })
  .strict()
  .refine(
    (data) => Object.keys(data).length > 0,
    "At least one stat must be provided"
  );

export type UpdatePartStats = z.infer<typeof UpdatePartStatsSchema>;

/**
 * Schema for durability modifications
 */
export const UpdatePartDurabilitySchema = z
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
      .max(5000, "Max durability cannot exceed 5000")
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

export type UpdatePartDurability = z.infer<typeof UpdatePartDurabilitySchema>;

/**
 * Schema for upgrade operations
 */
export const UpgradePartSchema = z
  .object({
    targetLevel: z
      .number()
      .int()
      .min(1, "Target level must be at least 1")
      .max(25, "Target level cannot exceed 25"),
    upgradeType: z.enum(["stats", "durability", "abilities", "efficiency"]),
    statBoosts: z
      .object({
        attack: z.number().int().min(0).max(50).optional(),
        defense: z.number().int().min(0).max(50).optional(),
        speed: z.number().int().min(0).max(50).optional(),
        perception: z.number().int().min(0).max(50).optional(),
      })
      .optional(),
    durabilityIncrease: z
      .number()
      .int()
      .min(0, "Durability increase cannot be negative")
      .max(1000, "Durability increase too large")
      .optional(),
    newAbilities: z.array(PartAbilitySchema).optional(),
    efficiencyImprovement: z
      .number()
      .min(0, "Efficiency improvement cannot be negative")
      .max(50, "Efficiency improvement too large")
      .optional(),
  })
  .strict();

export type UpgradePart = z.infer<typeof UpgradePartSchema>;

// ============================================================================
// QUERY SCHEMAS
// ============================================================================

/**
 * Schema for finding a unique Part
 */
export const FindUniquePartSchema = z
  .object({
    id: z.string().optional(),
  })
  .strict();

export type FindUniquePartInput = z.infer<typeof FindUniquePartSchema>;

/**
 * Schema for filtering Parts
 */
export const PartWhereSchema: z.ZodType<any> = z.lazy(() =>
  z
    .object({
      id: z.string().optional(),
      userId: z.string().optional(),
      name: z.string().optional(),
      category: PartCategorySchema.optional(),
      rarity: RaritySchema.optional(),
      attack: z.number().int().optional(),
      defense: z.number().int().optional(),
      speed: z.number().int().optional(),
      perception: z.number().int().optional(),
      energyConsumption: z.number().int().optional(),
      upgradeLevel: z.number().int().optional(),
      currentDurability: z.number().int().optional(),
      maxDurability: z.number().int().optional(),
      version: z.number().int().optional(),
      source: z.string().nullable().optional(),
      tags: z.array(z.string()).optional(),
      description: z.string().nullable().optional(),
      createdAt: z.date().optional(),
      updatedAt: z.date().optional(),
      AND: z.array(PartWhereSchema).optional(),
      OR: z.array(PartWhereSchema).optional(),
      NOT: PartWhereSchema.optional(),
    })
    .strict()
);

export type PartWhere = z.infer<typeof PartWhereSchema>;

/**
 * Schema for ordering Parts
 */
export const PartOrderBySchema = z
  .object({
    id: z.enum(["asc", "desc"]).optional(),
    userId: z.enum(["asc", "desc"]).optional(),
    name: z.enum(["asc", "desc"]).optional(),
    category: z.enum(["asc", "desc"]).optional(),
    rarity: z.enum(["asc", "desc"]).optional(),
    attack: z.enum(["asc", "desc"]).optional(),
    defense: z.enum(["asc", "desc"]).optional(),
    speed: z.enum(["asc", "desc"]).optional(),
    perception: z.enum(["asc", "desc"]).optional(),
    energyConsumption: z.enum(["asc", "desc"]).optional(),
    upgradeLevel: z.enum(["asc", "desc"]).optional(),
    currentDurability: z.enum(["asc", "desc"]).optional(),
    maxDurability: z.enum(["asc", "desc"]).optional(),
    version: z.enum(["asc", "desc"]).optional(),
    createdAt: z.enum(["asc", "desc"]).optional(),
    updatedAt: z.enum(["asc", "desc"]).optional(),
  })
  .strict();

export type PartOrderBy = z.infer<typeof PartOrderBySchema>;

/**
 * Schema for selecting Part fields
 */
export const PartSelectSchema = z
  .object({
    id: z.boolean().optional(),
    userId: z.boolean().optional(),
    name: z.boolean().optional(),
    category: z.boolean().optional(),
    rarity: z.boolean().optional(),
    attack: z.boolean().optional(),
    defense: z.boolean().optional(),
    speed: z.boolean().optional(),
    perception: z.boolean().optional(),
    energyConsumption: z.boolean().optional(),
    upgradeLevel: z.boolean().optional(),
    currentDurability: z.boolean().optional(),
    maxDurability: z.boolean().optional(),
    abilities: z.boolean().optional(),
    version: z.boolean().optional(),
    source: z.boolean().optional(),
    tags: z.boolean().optional(),
    description: z.boolean().optional(),
    metadata: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    updatedAt: z.boolean().optional(),
    user: z.boolean().optional(),
    botParts: z.boolean().optional(),
  })
  .strict();

export type PartSelect = z.infer<typeof PartSelectSchema>;

/**
 * Schema for including Part relations
 */
export const PartIncludeSchema = z
  .object({
    user: z.boolean().optional(),
    botParts: z.boolean().optional(),
  })
  .strict();

export type PartInclude = z.infer<typeof PartIncludeSchema>;

// ============================================================================
// PAGINATION SCHEMAS
// ============================================================================

/**
 * Schema for paginated Part queries
 */
export const FindManyPartsSchema = z
  .object({
    where: PartWhereSchema.optional(),
    orderBy: z
      .union([PartOrderBySchema, z.array(PartOrderBySchema)])
      .optional(),
    select: PartSelectSchema.optional(),
    include: PartIncludeSchema.optional(),
    skip: z.number().int().min(0).optional(),
    take: z.number().int().min(1).max(1000).optional(),
    cursor: FindUniquePartSchema.optional(),
  })
  .strict();

export type FindManyPartsInput = z.infer<typeof FindManyPartsSchema>;

// ============================================================================
// PART SPECIFIC SCHEMAS
// ============================================================================

/**
 * Schema for part repair operations
 */
export const RepairPartSchema = z
  .object({
    repairType: z.enum(["partial", "full", "emergency", "field_repair"]),
    repairAmount: z
      .number()
      .int()
      .min(1, "Repair amount must be positive")
      .optional(),
    useMaterials: z.boolean().default(true),
    materialIds: z.array(z.string()).optional(),
    upgradeWhileRepairing: z.boolean().default(false),
    preserveAbilities: z.boolean().default(true),
  })
  .strict();

export type RepairPart = z.infer<typeof RepairPartSchema>;

/**
 * Schema for part enhancement
 */
export const EnhancePartSchema = z
  .object({
    enhancementType: z.enum([
      "stat_boost",
      "ability_enhancement",
      "efficiency_upgrade",
      "durability_enhancement",
      "rarity_upgrade",
    ]),
    targetStats: z
      .object({
        attack: z.number().int().min(0).max(100).optional(),
        defense: z.number().int().min(0).max(100).optional(),
        speed: z.number().int().min(0).max(100).optional(),
        perception: z.number().int().min(0).max(100).optional(),
      })
      .optional(),
    abilityEnhancements: z
      .array(
        z.object({
          abilityId: z.string(),
          enhancement: z.enum([
            "level_up",
            "effect_boost",
            "cooldown_reduction",
          ]),
          value: z.number().min(0).max(5),
        })
      )
      .optional(),
    targetRarity: RaritySchema.optional(),
    preserveExistingStats: z.boolean().default(true),
  })
  .strict();

export type EnhancePart = z.infer<typeof EnhancePartSchema>;

/**
 * Schema for part fusion
 */
export const FusePartsSchema = z
  .object({
    primaryPartId: z.string().min(1, "Primary part ID is required"),
    secondaryPartId: z.string().min(1, "Secondary part ID is required"),
    fusionStyle: z.enum(["additive", "dominant_primary", "balanced", "hybrid"]),
    targetCategory: PartCategorySchema.optional(),
    statDistribution: z
      .object({
        primaryWeight: z.number().min(0).max(1).default(0.7),
        secondaryWeight: z.number().min(0).max(1).default(0.3),
      })
      .optional(),
    preserveAbilities: z.boolean().default(true),
    abilityMergeStrategy: z
      .enum(["combine_all", "best_of_each", "primary_only", "custom"])
      .default("best_of_each"),
  })
  .strict();

export type FuseParts = z.infer<typeof FusePartsSchema>;

/**
 * Schema for part ability management
 */
export const ManagePartAbilitiesSchema = z
  .object({
    operation: z.enum(["add", "remove", "modify", "reorder"]),
    abilityId: z.string().optional(),
    newAbility: PartAbilitySchema.optional(),
    modifications: z
      .object({
        name: z.string().optional(),
        description: z.string().optional(),
        effects: z
          .array(
            z.object({
              stat: z.enum([
                "attack",
                "defense",
                "speed",
                "perception",
                "energy",
              ]),
              modifier: z.number(),
              type: z.enum(["flat", "percentage", "multiplier"]),
            })
          )
          .optional(),
        level: z.number().int().min(1).max(10).optional(),
      })
      .optional(),
    newOrder: z.array(z.string()).optional(),
  })
  .strict();

export type ManagePartAbilities = z.infer<typeof ManagePartAbilitiesSchema>;

// ============================================================================
// VALIDATION HELPERS
// ============================================================================

/**
 * Schema for validating part compatibility with skeleton/bot
 */
export const ValidatePartCompatibilitySchema = z
  .object({
    partId: z.string().min(1, "Part ID is required"),
    skeletonId: z.string().min(1, "Skeleton ID is required").optional(),
    botId: z.string().min(1, "Bot ID is required").optional(),
    slotType: z.enum(["standard", "specialized", "expansion"]).optional(),
    checkEnergyRequirements: z.boolean().default(true),
    checkCategoryCompatibility: z.boolean().default(true),
    checkStatRequirements: z.boolean().default(false),
  })
  .strict()
  .refine(
    (data) => data.skeletonId || data.botId,
    "Either skeleton ID or bot ID must be provided"
  );

export type ValidatePartCompatibility = z.infer<
  typeof ValidatePartCompatibilitySchema
>;

/**
 * Schema for part performance calculation
 */
export const CalculatePartPerformanceSchema = z
  .object({
    category: PartCategorySchema,
    attack: z.number().int().min(0).max(1000),
    defense: z.number().int().min(0).max(1000),
    speed: z.number().int().min(0).max(1000),
    perception: z.number().int().min(0).max(1000),
    energyConsumption: z.number().int().min(1).max(100),
    upgradeLevel: z.number().int().min(0).max(25),
    currentDurability: z.number().int().min(0),
    maxDurability: z.number().int().min(1),
    abilities: z.array(PartAbilitySchema),
    contextFactors: z
      .object({
        botType: z
          .enum(["WORKER", "PLAYABLE", "KING", "ROGUE", "GOVBOT"])
          .optional(),
        combatRole: z.enum(["ASSAULT", "TANK", "SNIPER", "SCOUT"]).optional(),
        environment: z
          .enum(["urban", "desert", "forest", "arctic", "space"])
          .optional(),
      })
      .optional(),
  })
  .strict();

export type CalculatePartPerformance = z.infer<
  typeof CalculatePartPerformanceSchema
>;

/**
 * Schema for part search and filtering
 */
export const SearchPartsSchema = z
  .object({
    query: z
      .string()
      .min(1, "Search query is required")
      .max(100, "Search query too long"),
    category: z.array(PartCategorySchema).optional(),
    rarity: z.array(RaritySchema).optional(),
    minAttack: z.number().int().min(0).max(1000).optional(),
    maxAttack: z.number().int().min(0).max(1000).optional(),
    minDefense: z.number().int().min(0).max(1000).optional(),
    maxDefense: z.number().int().min(0).max(1000).optional(),
    minSpeed: z.number().int().min(0).max(1000).optional(),
    maxSpeed: z.number().int().min(0).max(1000).optional(),
    minPerception: z.number().int().min(0).max(1000).optional(),
    maxPerception: z.number().int().min(0).max(1000).optional(),
    minEnergyConsumption: z.number().int().min(1).max(100).optional(),
    maxEnergyConsumption: z.number().int().min(1).max(100).optional(),
    minUpgradeLevel: z.number().int().min(0).max(25).optional(),
    maxUpgradeLevel: z.number().int().min(0).max(25).optional(),
    hasAbilities: z.boolean().optional(),
    tags: z.array(z.string()).optional(),
    userId: z.string().optional(),
    limit: z.number().int().min(1).max(100).default(20),
  })
  .strict();

export type SearchParts = z.infer<typeof SearchPartsSchema>;

// ============================================================================
// RESPONSE SCHEMAS
// ============================================================================

/**
 * Schema for Part API responses
 */
export const PartResponseSchema = PartSchema.omit({
  metadata: true,
});

export type PartResponse = z.infer<typeof PartResponseSchema>;

/**
 * Schema for Part with User information
 */
export const PartWithUserSchema = PartResponseSchema.safeExtend({
  user: z.object({
    id: z.string(),
    name: z.string().nullable(),
    email: z.string(),
  }),
});

export type PartWithUser = z.infer<typeof PartWithUserSchema>;

/**
 * Schema for Part summary (minimal info)
 */
export const PartSummarySchema = z
  .object({
    id: z.string(),
    name: z.string(),
    category: PartCategorySchema,
    rarity: RaritySchema,
    attack: z.number().int(),
    defense: z.number().int(),
    speed: z.number().int(),
    perception: z.number().int(),
    energyConsumption: z.number().int(),
    upgradeLevel: z.number().int(),
    currentDurability: z.number().int(),
    maxDurability: z.number().int(),
    createdAt: z.date(),
  })
  .strict();

export type PartSummary = z.infer<typeof PartSummarySchema>;

/**
 * Schema for Part with performance metrics
 */
export const PartWithPerformanceSchema = PartResponseSchema.safeExtend({
  performanceMetrics: z.object({
    totalPower: z.number(),
    efficiency: z.number(),
    durabilityRatio: z.number(),
    abilityCount: z.number().int(),
    upgradeProgress: z.number(),
    overallRating: z.number(),
  }),
  compatibleBots: z.number().int().min(0),
  estimatedValue: z.number().int().min(0),
  repairCost: z.number().int().min(0),
});

export type PartWithPerformance = z.infer<typeof PartWithPerformanceSchema>;

/**
 * Schema for part upgrade preview
 */
export const PartUpgradePreviewSchema = z
  .object({
    currentLevel: z.number().int(),
    targetLevel: z.number().int(),
    currentStats: z.object({
      attack: z.number().int(),
      defense: z.number().int(),
      speed: z.number().int(),
      perception: z.number().int(),
      energyConsumption: z.number().int(),
      maxDurability: z.number().int(),
    }),
    projectedStats: z.object({
      attack: z.number().int(),
      defense: z.number().int(),
      speed: z.number().int(),
      perception: z.number().int(),
      energyConsumption: z.number().int(),
      maxDurability: z.number().int(),
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
    potentialAbilities: z.array(PartAbilitySchema),
    risks: z.array(z.string()),
  })
  .strict();

export type PartUpgradePreview = z.infer<typeof PartUpgradePreviewSchema>;

// ============================================================================
// ADMIN SCHEMAS
// ============================================================================

/**
 * Schema for admin part management
 */
export const AdminPartManagementSchema = z
  .object({
    action: z.enum([
      "list_all",
      "force_upgrade",
      "reset_durability",
      "modify_stats",
      "change_rarity",
      "bulk_repair",
      "add_abilities",
    ]),
    targetRarity: RaritySchema.optional(),
    statModifications: z
      .object({
        attack: z.number().int().min(0).max(1000).optional(),
        defense: z.number().int().min(0).max(1000).optional(),
        speed: z.number().int().min(0).max(1000).optional(),
        perception: z.number().int().min(0).max(1000).optional(),
        energyConsumption: z.number().int().min(1).max(100).optional(),
      })
      .optional(),
    durabilityOperation: z
      .object({
        type: z.enum(["set", "add", "reset"]),
        value: z.number().int().min(0).optional(),
      })
      .optional(),
    upgradeModification: z
      .object({
        targetLevel: z.number().int().min(0).max(25),
        upgradeType: z.enum(["stats", "durability", "abilities", "efficiency"]),
      })
      .optional(),
    newAbilities: z.array(PartAbilitySchema).optional(),
  })
  .strict();

export type AdminPartManagement = z.infer<typeof AdminPartManagementSchema>;

/**
 * Schema for part statistics
 */
export const PartStatsSchema = z
  .object({
    totalParts: z.number().int().min(0),
    categoryDistribution: z.record(z.string(), z.number().int().min(0)),
    rarityDistribution: z.record(z.string(), z.number().int().min(0)),
    averageStats: z.object({
      attack: z.number(),
      defense: z.number(),
      speed: z.number(),
      perception: z.number(),
      energyConsumption: z.number(),
      upgradeLevel: z.number(),
    }),
    durabilityStats: z.object({
      averageCondition: z.number(),
      needingRepair: z.number().int().min(0),
      fullyUpgraded: z.number().int().min(0),
    }),
    abilityStats: z.object({
      averageAbilitiesPerPart: z.number(),
      mostCommonAbilities: z.array(
        z.object({
          name: z.string(),
          count: z.number().int().min(0),
        })
      ),
    }),
    topPerformers: z.array(
      z.object({
        id: z.string(),
        name: z.string(),
        performanceScore: z.number(),
        category: PartCategorySchema,
        rarity: RaritySchema,
      })
    ),
  })
  .strict();

export type PartStats = z.infer<typeof PartStatsSchema>;

// ============================================================================
// EXPORTS
// ============================================================================

// All schemas are defined above and exported individually

// Export all validation functions
export const PartValidation = {
  // Base schemas
  model: PartSchema,
  input: PartInputSchema,
  ability: PartAbilitySchema,
  category: PartCategorySchema,
  rarity: RaritySchema,

  // CRUD schemas
  create: CreatePartSchema,
  createApi: CreatePartApiSchema,
  update: UpdatePartSchema,
  updateApi: UpdatePartApiSchema,
  partialUpdate: PartialUpdatePartSchema,
  updateStats: UpdatePartStatsSchema,
  updateDurability: UpdatePartDurabilitySchema,
  upgrade: UpgradePartSchema,

  // Query schemas
  findUnique: FindUniquePartSchema,
  findMany: FindManyPartsSchema,
  where: PartWhereSchema,
  orderBy: PartOrderBySchema,
  select: PartSelectSchema,
  include: PartIncludeSchema,

  // Part operations
  repair: RepairPartSchema,
  enhance: EnhancePartSchema,
  fuse: FusePartsSchema,
  manageAbilities: ManagePartAbilitiesSchema,

  // Helpers
  compatibility: ValidatePartCompatibilitySchema,
  calculatePerformance: CalculatePartPerformanceSchema,
  search: SearchPartsSchema,

  // Response schemas
  response: PartResponseSchema,
  withUser: PartWithUserSchema,
  summary: PartSummarySchema,
  withPerformance: PartWithPerformanceSchema,
  upgradePreview: PartUpgradePreviewSchema,

  // Admin schemas
  adminManagement: AdminPartManagementSchema,
  stats: PartStatsSchema,
} as const;
