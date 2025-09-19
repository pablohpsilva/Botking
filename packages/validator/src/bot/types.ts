import {
  BotType,
  CombatRole,
  UtilitySpecialization,
  GovernmentType,
} from "@botking/db";
import { z } from "zod";

// Import enum schemas from Prisma types
export const BotTypeSchema = z.enum(BotType);
export const CombatRoleSchema = z.enum(CombatRole);
export const UtilitySpecializationSchema = z.enum(UtilitySpecialization);
export const GovernmentTypeSchema = z.enum(GovernmentType);

// ============================================================================
// BASE SCHEMAS
// ============================================================================

/**
 * Base Bot model schema - represents the complete Bot entity
 */
export const BotSchema = z
  .object({
    id: z.string(),
    userId: z.string().nullable(),
    soulChipId: z.string().nullable(),
    skeletonId: z.string(),
    stateId: z.string(),
    name: z.string(),
    botType: BotTypeSchema,
    combatRole: CombatRoleSchema.nullable(),
    utilitySpec: UtilitySpecializationSchema.nullable(),
    governmentType: GovernmentTypeSchema.nullable(),
    description: z.string().nullable(),
    createdAt: z.date(),
    updatedAt: z.date(),
  })
  .strict();

export type Bot = z.infer<typeof BotSchema>;

/**
 * Bot input schema for forms and API inputs (without auto-generated fields)
 */
export const BotInputSchema = z
  .object({
    userId: z.string().min(1, "User ID is required").nullable(),
    soulChipId: z.string().min(1, "Soul chip ID is required").nullable(),
    skeletonId: z.string().min(1, "Skeleton ID is required"),
    name: z
      .string()
      .min(1, "Name is required")
      .max(100, "Name must be 100 characters or less"),
    botType: BotTypeSchema.default("WORKER"),
    combatRole: CombatRoleSchema.nullable().optional(),
    utilitySpec: UtilitySpecializationSchema.nullable().optional(),
    governmentType: GovernmentTypeSchema.nullable().optional(),
    description: z.string().optional().nullable(),
  })
  .strict()
  .refine(
    (data) => {
      // Combat role should only be set for PLAYABLE, KING, or ROGUE bots
      if (
        data.combatRole &&
        !["PLAYABLE", "KING", "ROGUE"].includes(data.botType)
      ) {
        return false;
      }
      return true;
    },
    {
      message: "Combat role can only be set for PLAYABLE, KING, or ROGUE bots",
      path: ["combatRole"],
    }
  )
  .refine(
    (data) => {
      // Utility specialization should only be set for WORKER bots
      if (data.utilitySpec && data.botType !== "WORKER") {
        return false;
      }
      return true;
    },
    {
      message: "Utility specialization can only be set for WORKER bots",
      path: ["utilitySpec"],
    }
  )
  .refine(
    (data) => {
      // Government type should only be set for GOVBOT bots
      if (data.governmentType && data.botType !== "GOVBOT") {
        return false;
      }
      return true;
    },
    {
      message: "Government type can only be set for GOVBOT bots",
      path: ["governmentType"],
    }
  );

export type BotInput = z.infer<typeof BotInputSchema>;

// ============================================================================
// CREATE SCHEMAS
// ============================================================================

/**
 * Schema for creating a new Bot
 * Compatible with Prisma BotCreateInput
 */
export const CreateBotSchema = z.object({
  id: z.string().optional(),
  userId: z.string().min(1, "User ID is required").nullable().optional(),
  soulChipId: z
    .string()
    .min(1, "Soul chip ID is required")
    .nullable()
    .optional(),
  skeletonId: z.string().min(1, "Skeleton ID is required"),
  stateId: z.string().min(1, "State ID is required").optional(),
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name must be 100 characters or less"),
  combatRole: CombatRoleSchema.nullable().optional(),
  utilitySpec: UtilitySpecializationSchema.nullable().optional(),
  governmentType: GovernmentTypeSchema.nullable().optional(),
  description: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
});
// .strict()
// .refine(
//   (data) => {
//     if (
//       data.combatRole &&
//       !["PLAYABLE", "KING", "ROGUE"].includes(data.botType)
//     ) {
//       return false;
//     }
//     return true;
//   },
//   {
//     message: "Combat role can only be set for PLAYABLE, KING, or ROGUE bots",
//     path: ["combatRole"],
//   }
// )
// .refine(
//   (data) => {
//     if (data.utilitySpec && data.botType !== "WORKER") {
//       return false;
//     }
//     return true;
//   },
//   {
//     message: "Utility specialization can only be set for WORKER bots",
//     path: ["utilitySpec"],
//   }
// )
// .refine(
//   (data) => {
//     if (data.governmentType && data.botType !== "GOVBOT") {
//       return false;
//     }
//     return true;
//   },
//   {
//     message: "Government type can only be set for GOVBOT bots",
//     path: ["governmentType"],
//   }
// );

export type CreateBotInput = z.infer<typeof CreateBotSchema>;

/**
 * Simplified create schema for API endpoints
 */
export const CreateBotApiSchema = z
  .object({
    name: z
      .string()
      .min(1, "Name is required")
      .max(100, "Name must be 100 characters or less"),
    skeletonId: z.string().min(1, "Skeleton ID is required"),
    soulChipId: z.string().min(1, "Soul chip ID is required").optional(),
    botType: BotTypeSchema.optional(),
    combatRole: CombatRoleSchema.optional(),
    utilitySpec: UtilitySpecializationSchema.optional(),
    governmentType: GovernmentTypeSchema.optional(),
    description: z.string().optional(),
  })
  .strict();

export type CreateBotApi = z.infer<typeof CreateBotApiSchema>;

/**
 * Schema for bot assembly (creating bot with parts)
 */
export const AssembleBotSchema = z
  .object({
    userId: z.string().min(1, "User ID is required").nullable(),
    name: z
      .string()
      .min(1, "Name is required")
      .max(100, "Name must be 100 characters or less"),
    skeletonId: z.string().min(1, "Skeleton ID is required"),
    soulChipId: z.string().min(1, "Soul chip ID is required").optional(),
    botType: BotTypeSchema.default("WORKER"),
    combatRole: CombatRoleSchema.optional(),
    utilitySpec: UtilitySpecializationSchema.optional(),
    governmentType: GovernmentTypeSchema.optional(),
    description: z.string().optional(),
    partAssignments: z
      .array(
        z.object({
          partId: z.string().min(1, "Part ID is required"),
          slotIndex: z.number().int().min(0).max(19),
        })
      )
      .optional(),
    expansionChipAssignments: z
      .array(
        z.object({
          expansionChipId: z.string().min(1, "Expansion chip ID is required"),
          slotIndex: z.number().int().min(0).max(19),
        })
      )
      .optional(),
    validateCompatibility: z.boolean().default(true),
  })
  .strict();

export type AssembleBot = z.infer<typeof AssembleBotSchema>;

// ============================================================================
// UPDATE SCHEMAS
// ============================================================================

/**
 * Schema for updating a Bot
 * Compatible with Prisma BotUpdateInput
 */
export const UpdateBotSchema = z
  .object({
    id: z.string().optional(),
    userId: z.string().min(1, "User ID is required").nullable().optional(),
    soulChipId: z
      .string()
      .min(1, "Soul chip ID is required")
      .nullable()
      .optional(),
    skeletonId: z.string().min(1, "Skeleton ID is required").optional(),
    stateId: z.string().min(1, "State ID is required").optional(),
    name: z
      .string()
      .min(1, "Name is required")
      .max(100, "Name must be 100 characters or less")
      .optional(),
    botType: BotTypeSchema.optional(),
    combatRole: CombatRoleSchema.nullable().optional(),
    utilitySpec: UtilitySpecializationSchema.nullable().optional(),
    governmentType: GovernmentTypeSchema.nullable().optional(),
    description: z.string().optional().nullable(),
    createdAt: z.coerce.date().optional(),
    updatedAt: z.coerce.date().optional(),
  })
  .strict();

export type UpdateBotInput = z.infer<typeof UpdateBotSchema>;

/**
 * Simplified update schema for API endpoints
 */
export const UpdateBotApiSchema = z
  .object({
    name: z
      .string()
      .min(1, "Name is required")
      .max(100, "Name must be 100 characters or less")
      .optional(),
    description: z.string().optional().nullable(),
    combatRole: CombatRoleSchema.nullable().optional(),
    utilitySpec: UtilitySpecializationSchema.nullable().optional(),
    governmentType: GovernmentTypeSchema.nullable().optional(),
  })
  .strict();

export type UpdateBotApi = z.infer<typeof UpdateBotApiSchema>;

/**
 * Partial update schema - all fields optional
 */
export const PartialUpdateBotSchema = BotInputSchema.partial();
export type PartialUpdateBot = z.infer<typeof PartialUpdateBotSchema>;

/**
 * Schema for bot configuration updates
 */
export const UpdateBotConfigurationSchema = z
  .object({
    soulChipId: z
      .string()
      .min(1, "Soul chip ID is required")
      .nullable()
      .optional(),
    combatRole: CombatRoleSchema.nullable().optional(),
    utilitySpec: UtilitySpecializationSchema.nullable().optional(),
    governmentType: GovernmentTypeSchema.nullable().optional(),
  })
  .strict();

export type UpdateBotConfiguration = z.infer<
  typeof UpdateBotConfigurationSchema
>;

/**
 * Schema for bot part assignment
 */
export const AssignBotPartsSchema = z
  .object({
    assignments: z.array(
      z.object({
        partId: z.string().min(1, "Part ID is required"),
        slotIndex: z.number().int().min(0).max(19),
        forceAssignment: z.boolean().default(false),
      })
    ),
    removeExisting: z.boolean().default(false),
    validateCompatibility: z.boolean().default(true),
    autoOptimizeSlots: z.boolean().default(false),
  })
  .strict();

export type AssignBotParts = z.infer<typeof AssignBotPartsSchema>;

// ============================================================================
// QUERY SCHEMAS
// ============================================================================

/**
 * Schema for finding a unique Bot
 */
export const FindUniqueBotSchema = z
  .object({
    id: z.string().optional(),
    stateId: z.string().optional(),
  })
  .strict();

export type FindUniqueBotInput = z.infer<typeof FindUniqueBotSchema>;

/**
 * Schema for filtering Bots
 */
export const BotWhereSchema: z.ZodType<any> = z.lazy(() =>
  z
    .object({
      id: z.string().optional(),
      userId: z.string().nullable().optional(),
      soulChipId: z.string().nullable().optional(),
      skeletonId: z.string().optional(),
      stateId: z.string().optional(),
      name: z.string().optional(),
      botType: BotTypeSchema.optional(),
      combatRole: CombatRoleSchema.nullable().optional(),
      utilitySpec: UtilitySpecializationSchema.nullable().optional(),
      governmentType: GovernmentTypeSchema.nullable().optional(),
      description: z.string().nullable().optional(),
      createdAt: z.date().optional(),
      updatedAt: z.date().optional(),
      AND: z.array(BotWhereSchema).optional(),
      OR: z.array(BotWhereSchema).optional(),
      NOT: BotWhereSchema.optional(),
    })
    .strict()
);

export type BotWhere = z.infer<typeof BotWhereSchema>;

/**
 * Schema for ordering Bots
 */
export const BotOrderBySchema = z
  .object({
    id: z.enum(["asc", "desc"]).optional(),
    userId: z.enum(["asc", "desc"]).optional(),
    soulChipId: z.enum(["asc", "desc"]).optional(),
    skeletonId: z.enum(["asc", "desc"]).optional(),
    stateId: z.enum(["asc", "desc"]).optional(),
    name: z.enum(["asc", "desc"]).optional(),
    botType: z.enum(["asc", "desc"]).optional(),
    combatRole: z.enum(["asc", "desc"]).optional(),
    utilitySpec: z.enum(["asc", "desc"]).optional(),
    governmentType: z.enum(["asc", "desc"]).optional(),
    createdAt: z.enum(["asc", "desc"]).optional(),
    updatedAt: z.enum(["asc", "desc"]).optional(),
  })
  .strict();

export type BotOrderBy = z.infer<typeof BotOrderBySchema>;

/**
 * Schema for selecting Bot fields
 */
export const BotSelectSchema = z
  .object({
    id: z.boolean().optional(),
    userId: z.boolean().optional(),
    soulChipId: z.boolean().optional(),
    skeletonId: z.boolean().optional(),
    stateId: z.boolean().optional(),
    name: z.boolean().optional(),
    botType: z.boolean().optional(),
    combatRole: z.boolean().optional(),
    utilitySpec: z.boolean().optional(),
    governmentType: z.boolean().optional(),
    description: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    updatedAt: z.boolean().optional(),
    user: z.boolean().optional(),
    soulChip: z.boolean().optional(),
    skeleton: z.boolean().optional(),
    metrics: z.boolean().optional(),
    parts: z.boolean().optional(),
    expansionChips: z.boolean().optional(),
    slotConfiguration: z.boolean().optional(),
    slotHistory: z.boolean().optional(),
    state: z.boolean().optional(),
  })
  .strict();

export type BotSelect = z.infer<typeof BotSelectSchema>;

/**
 * Schema for including Bot relations
 */
export const BotIncludeSchema = z
  .object({
    user: z.boolean().optional(),
    soulChip: z.boolean().optional(),
    skeleton: z.boolean().optional(),
    metrics: z.boolean().optional(),
    parts: z.boolean().optional(),
    expansionChips: z.boolean().optional(),
    slotConfiguration: z.boolean().optional(),
    slotHistory: z.boolean().optional(),
    state: z.boolean().optional(),
  })
  .strict();

export type BotInclude = z.infer<typeof BotIncludeSchema>;

// ============================================================================
// PAGINATION SCHEMAS
// ============================================================================

/**
 * Schema for paginated Bot queries
 */
export const FindManyBotsSchema = z
  .object({
    where: BotWhereSchema.optional(),
    orderBy: z.union([BotOrderBySchema, z.array(BotOrderBySchema)]).optional(),
    select: BotSelectSchema.optional(),
    include: BotIncludeSchema.optional(),
    skip: z.number().int().min(0).optional(),
    take: z.number().int().min(1).max(1000).optional(),
    cursor: FindUniqueBotSchema.optional(),
  })
  .strict();

export type FindManyBotsInput = z.infer<typeof FindManyBotsSchema>;

// ============================================================================
// VALIDATION HELPERS
// ============================================================================

/**
 * Schema for validating bot assembly
 */
export const ValidateBotAssemblySchema = z
  .object({
    skeletonId: z.string().min(1, "Skeleton ID is required"),
    soulChipId: z.string().min(1, "Soul chip ID is required").optional(),
    partIds: z.array(z.string()).optional(),
    expansionChipIds: z.array(z.string()).optional(),
    botType: BotTypeSchema,
    checkCompatibility: z.boolean().default(true),
    checkEnergyRequirements: z.boolean().default(true),
    checkSlotCapacity: z.boolean().default(true),
    validateRoleRequirements: z.boolean().default(true),
  })
  .strict();

export type ValidateBotAssembly = z.infer<typeof ValidateBotAssemblySchema>;

/**
 * Schema for bot performance calculation
 */
export const CalculateBotPerformanceSchema = z
  .object({
    botType: BotTypeSchema,
    combatRole: CombatRoleSchema.optional(),
    utilitySpec: UtilitySpecializationSchema.optional(),
    skeletonStats: z.object({
      type: z.string(),
      slots: z.number().int(),
      durability: z.number().int(),
      mobility: z.string(),
    }),
    soulChipStats: z
      .object({
        intelligence: z.number().int(),
        resilience: z.number().int(),
        adaptability: z.number().int(),
        learningRate: z.number(),
      })
      .optional(),
    partStats: z.array(
      z.object({
        category: z.string(),
        attack: z.number().int(),
        defense: z.number().int(),
        speed: z.number().int(),
        perception: z.number().int(),
        energyConsumption: z.number().int(),
      })
    ),
    expansionChipEffects: z
      .array(
        z.object({
          effect: z.string(),
          magnitude: z.number(),
        })
      )
      .optional(),
    environmentFactors: z
      .object({
        terrain: z.string().optional(),
        conditions: z.string().optional(),
        threats: z.array(z.string()).optional(),
      })
      .optional(),
  })
  .strict();

export type CalculateBotPerformance = z.infer<
  typeof CalculateBotPerformanceSchema
>;

/**
 * Schema for bot search and filtering
 */
export const SearchBotsSchema = z
  .object({
    query: z
      .string()
      .min(1, "Search query is required")
      .max(100, "Search query too long"),
    botType: z.array(BotTypeSchema).optional(),
    combatRole: z.array(CombatRoleSchema).optional(),
    utilitySpec: z.array(UtilitySpecializationSchema).optional(),
    governmentType: z.array(GovernmentTypeSchema).optional(),
    hasUserId: z.boolean().optional(),
    hasSoulChip: z.boolean().optional(),
    minPerformanceRating: z.number().min(0).max(100).optional(),
    maxPerformanceRating: z.number().min(0).max(100).optional(),
    deploymentStatus: z
      .array(z.enum(["available", "deployed", "maintenance", "training"]))
      .optional(),
    tags: z.array(z.string()).optional(),
    userId: z.string().optional(),
    limit: z.number().int().min(1).max(100).default(20),
  })
  .strict();

export type SearchBots = z.infer<typeof SearchBotsSchema>;

// ============================================================================
// RESPONSE SCHEMAS
// ============================================================================

/**
 * Schema for Bot API responses
 */
export const BotResponseSchema = BotSchema;

export type BotResponse = z.infer<typeof BotResponseSchema>;

/**
 * Schema for Bot with User information
 */
export const BotWithUserSchema = BotResponseSchema.safeExtend({
  user: z
    .object({
      id: z.string(),
      name: z.string().nullable(),
      email: z.string(),
    })
    .nullable(),
});

export type BotWithUser = z.infer<typeof BotWithUserSchema>;

/**
 * Schema for Bot summary (minimal info)
 */
export const BotSummarySchema = z
  .object({
    id: z.string(),
    name: z.string(),
    botType: BotTypeSchema,
    combatRole: CombatRoleSchema.nullable(),
    utilitySpec: UtilitySpecializationSchema.nullable(),
    governmentType: GovernmentTypeSchema.nullable(),
    skeletonId: z.string(),
    soulChipId: z.string().nullable(),
    createdAt: z.date(),
  })
  .strict();

export type BotSummary = z.infer<typeof BotSummarySchema>;

/**
 * Schema for Bot with complete assembly information
 */
export const BotWithAssemblySchema = BotResponseSchema.safeExtend({
  skeleton: z.object({
    id: z.string(),
    name: z.string(),
    type: z.string(),
    slots: z.number().int(),
    currentDurability: z.number().int(),
    maxDurability: z.number().int(),
  }),
  soulChip: z
    .object({
      id: z.string(),
      name: z.string(),
      intelligence: z.number().int(),
      resilience: z.number().int(),
      adaptability: z.number().int(),
    })
    .nullable(),
  parts: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      category: z.string(),
      attack: z.number().int(),
      defense: z.number().int(),
      speed: z.number().int(),
      perception: z.number().int(),
      slotIndex: z.number().int(),
    })
  ),
  expansionChips: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      effect: z.string(),
      magnitude: z.number(),
      slotIndex: z.number().int(),
    })
  ),
  state: z
    .object({
      energyLevel: z.number().int(),
      healthLevel: z.number().int(),
      currentLocation: z.string(),
      level: z.number().int(),
    })
    .nullable(),
});

export type BotWithAssembly = z.infer<typeof BotWithAssemblySchema>;

/**
 * Schema for bot performance metrics
 */
export const BotPerformanceMetricsSchema = z
  .object({
    overallRating: z.number().min(0).max(100),
    combatPower: z.number().min(0),
    energyEfficiency: z.number().min(0).max(100),
    durabilityScore: z.number().min(0).max(100),
    utilityRating: z.number().min(0).max(100),
    roleCompatibility: z.number().min(0).max(100),
    upgradeProgress: z.number().min(0).max(100),
    totalStats: z.object({
      attack: z.number().int(),
      defense: z.number().int(),
      speed: z.number().int(),
      perception: z.number().int(),
      totalEnergyConsumption: z.number().int(),
    }),
    recommendations: z.array(
      z.object({
        type: z.enum(["upgrade", "replace", "optimize", "repair"]),
        component: z.string(),
        reason: z.string(),
        priority: z.enum(["low", "medium", "high", "critical"]),
      })
    ),
  })
  .strict();

export type BotPerformanceMetrics = z.infer<typeof BotPerformanceMetricsSchema>;

/**
 * Schema for bot deployment status
 */
export const BotDeploymentStatusSchema = z
  .object({
    status: z.enum([
      "available",
      "deployed",
      "maintenance",
      "training",
      "disabled",
    ]),
    currentMission: z
      .object({
        id: z.string(),
        type: z.string(),
        location: z.string(),
        startTime: z.date(),
        estimatedEndTime: z.date(),
        progress: z.number().min(0).max(100),
      })
      .nullable(),
    lastMaintenance: z.date().nullable(),
    nextMaintenanceDue: z.date().nullable(),
    alertLevel: z.enum(["none", "info", "warning", "critical"]).default("none"),
    alerts: z.array(
      z.object({
        type: z.string(),
        message: z.string(),
        severity: z.enum(["info", "warning", "error", "critical"]),
        timestamp: z.date(),
      })
    ),
  })
  .strict();

export type BotDeploymentStatus = z.infer<typeof BotDeploymentStatusSchema>;

// ============================================================================
// ADMIN SCHEMAS
// ============================================================================

/**
 * Schema for admin bot management
 */
export const AdminBotManagementSchema = z
  .object({
    action: z.enum([
      "list_all",
      "force_recall",
      "emergency_shutdown",
      "reset_state",
      "assign_owner",
      "change_type",
      "bulk_maintenance",
      "generate_report",
    ]),
    targetBotType: BotTypeSchema.optional(),
    newBotType: BotTypeSchema.optional(),
    newUserId: z.string().optional(),
    maintenanceConfig: z
      .object({
        type: z.enum(["routine", "repair", "upgrade", "diagnostic"]),
        components: z.array(z.string()),
      })
      .optional(),
    reportConfig: z
      .object({
        includePerformance: z.boolean().default(true),
        includeDeployment: z.boolean().default(true),
        includeMaintenanceHistory: z.boolean().default(true),
        timeRange: z.enum(["day", "week", "month", "quarter"]).default("week"),
      })
      .optional(),
  })
  .strict();

export type AdminBotManagement = z.infer<typeof AdminBotManagementSchema>;

/**
 * Schema for bot statistics
 */
export const BotStatsSchema = z
  .object({
    totalBots: z.number().int().min(0),
    typeDistribution: z.record(z.string(), z.number().int().min(0)),
    roleDistribution: z.record(z.string(), z.number().int().min(0)),
    deploymentStats: z.object({
      available: z.number().int().min(0),
      deployed: z.number().int().min(0),
      maintenance: z.number().int().min(0),
      training: z.number().int().min(0),
      disabled: z.number().int().min(0),
    }),
    performanceStats: z.object({
      averageRating: z.number(),
      topPerformers: z.array(
        z.object({
          id: z.string(),
          name: z.string(),
          rating: z.number(),
          type: BotTypeSchema,
        })
      ),
      lowPerformers: z.array(
        z.object({
          id: z.string(),
          name: z.string(),
          rating: z.number(),
          issues: z.array(z.string()),
        })
      ),
    }),
    maintenanceStats: z.object({
      needingMaintenance: z.number().int().min(0),
      overdueMaintenance: z.number().int().min(0),
      averageMaintenanceInterval: z.number(),
    }),
    utilizationStats: z.object({
      dailyActiveUsers: z.number().int().min(0),
      averageDeploymentTime: z.number(),
      missionSuccessRate: z.number().min(0).max(1),
    }),
  })
  .strict();

export type BotStats = z.infer<typeof BotStatsSchema>;

// ============================================================================
// EXPORTS
// ============================================================================

// All schemas are defined above and exported individually

// Export all validation functions
export const BotValidation = {
  // Base schemas
  model: BotSchema,
  input: BotInputSchema,
  botType: BotTypeSchema,
  combatRole: CombatRoleSchema,
  utilitySpecialization: UtilitySpecializationSchema,
  governmentType: GovernmentTypeSchema,

  // CRUD schemas
  create: CreateBotSchema,
  createApi: CreateBotApiSchema,
  assemble: AssembleBotSchema,
  update: UpdateBotSchema,
  updateApi: UpdateBotApiSchema,
  partialUpdate: PartialUpdateBotSchema,
  updateConfiguration: UpdateBotConfigurationSchema,
  assignParts: AssignBotPartsSchema,

  // Query schemas
  findUnique: FindUniqueBotSchema,
  findMany: FindManyBotsSchema,
  where: BotWhereSchema,
  orderBy: BotOrderBySchema,
  select: BotSelectSchema,
  include: BotIncludeSchema,

  // Helpers
  validateAssembly: ValidateBotAssemblySchema,
  calculatePerformance: CalculateBotPerformanceSchema,
  search: SearchBotsSchema,

  // Response schemas
  response: BotResponseSchema,
  withUser: BotWithUserSchema,
  summary: BotSummarySchema,
  withAssembly: BotWithAssemblySchema,
  performanceMetrics: BotPerformanceMetricsSchema,
  deploymentStatus: BotDeploymentStatusSchema,

  // Admin schemas
  adminManagement: AdminBotManagementSchema,
  stats: BotStatsSchema,
} as const;
