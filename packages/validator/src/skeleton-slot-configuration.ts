import { SkeletonType } from "@botking/db";
import { z } from "zod";

// Import enum schemas from Prisma types
const SkeletonTypeSchema = z.enum(SkeletonType);

// ============================================================================
// BASE SCHEMAS
// ============================================================================

/**
 * Base SkeletonSlotConfiguration model schema - represents the complete SkeletonSlotConfiguration entity
 */
export const SkeletonSlotConfigurationSchema = z
  .object({
    id: z.string(),
    botId: z.string(),
    skeletonType: SkeletonTypeSchema,
    lastModified: z.date(),
    createdAt: z.date(),
    updatedAt: z.date(),
  })
  .strict();

export type SkeletonSlotConfiguration = z.infer<
  typeof SkeletonSlotConfigurationSchema
>;

/**
 * SkeletonSlotConfiguration input schema for forms and API inputs (without auto-generated fields)
 */
export const SkeletonSlotConfigurationInputSchema = z
  .object({
    botId: z.string().min(1, "Bot ID is required"),
    skeletonType: SkeletonTypeSchema,
    lastModified: z.coerce
      .date()
      .optional()
      .default(() => new Date()),
  })
  .strict();

export type SkeletonSlotConfigurationInput = z.infer<
  typeof SkeletonSlotConfigurationInputSchema
>;

// ============================================================================
// CREATE SCHEMAS
// ============================================================================

/**
 * Schema for creating a new SkeletonSlotConfiguration
 * Compatible with Prisma SkeletonSlotConfigurationCreateInput
 */
export const CreateSkeletonSlotConfigurationSchema = z
  .object({
    id: z.string().optional(),
    botId: z.string().min(1, "Bot ID is required"),
    skeletonType: SkeletonTypeSchema,
    lastModified: z.coerce
      .date()
      .optional()
      .default(() => new Date()),
    createdAt: z.coerce.date().optional(),
    updatedAt: z.coerce.date().optional(),
  })
  .strict();

export type CreateSkeletonSlotConfigurationInput = z.infer<
  typeof CreateSkeletonSlotConfigurationSchema
>;

/**
 * Simplified create schema for API endpoints
 */
export const CreateSkeletonSlotConfigurationApiSchema = z
  .object({
    botId: z.string().min(1, "Bot ID is required"),
    skeletonId: z.string().min(1, "Skeleton ID is required"),
    initializeSlots: z.boolean().default(true),
    copyFromTemplate: z.string().optional(), // Template configuration ID
    preserveExistingAssignments: z.boolean().default(false),
    validateCompatibility: z.boolean().default(true),
  })
  .strict();

export type CreateSkeletonSlotConfigurationApi = z.infer<
  typeof CreateSkeletonSlotConfigurationApiSchema
>;

// ============================================================================
// UPDATE SCHEMAS
// ============================================================================

/**
 * Schema for updating a SkeletonSlotConfiguration
 * Compatible with Prisma SkeletonSlotConfigurationUpdateInput
 */
export const UpdateSkeletonSlotConfigurationSchema = z
  .object({
    id: z.string().optional(),
    botId: z.string().min(1, "Bot ID is required").optional(),
    skeletonType: SkeletonTypeSchema.optional(),
    lastModified: z.coerce.date().optional(),
    createdAt: z.coerce.date().optional(),
    updatedAt: z.coerce.date().optional(),
  })
  .strict();

export type UpdateSkeletonSlotConfigurationInput = z.infer<
  typeof UpdateSkeletonSlotConfigurationSchema
>;

/**
 * Simplified update schema for API endpoints
 */
export const UpdateSkeletonSlotConfigurationApiSchema = z
  .object({
    updateLastModified: z.boolean().default(true),
    validateChanges: z.boolean().default(true),
    preserveAssignments: z.boolean().default(true),
    reason: z
      .enum([
        "skeleton_change",
        "optimization",
        "user_preference",
        "system_update",
        "maintenance",
      ])
      .optional(),
  })
  .strict();

export type UpdateSkeletonSlotConfigurationApi = z.infer<
  typeof UpdateSkeletonSlotConfigurationApiSchema
>;

/**
 * Partial update schema - all fields optional
 */
export const PartialUpdateSkeletonSlotConfigurationSchema =
  SkeletonSlotConfigurationInputSchema.partial();

export type PartialUpdateSkeletonSlotConfiguration = z.infer<
  typeof PartialUpdateSkeletonSlotConfigurationSchema
>;

// ============================================================================
// CONFIGURATION MANAGEMENT SCHEMAS
// ============================================================================

/**
 * Schema for initializing a new slot configuration
 */
export const InitializeSlotConfigurationSchema = z
  .object({
    botId: z.string().min(1, "Bot ID is required"),
    skeletonId: z.string().min(1, "Skeleton ID is required"),
    templateId: z.string().optional(), // Predefined template ID
    customSlotLayout: z
      .array(
        z.object({
          slotId: z.string(),
          slotType: z.enum([
            "primary",
            "secondary",
            "accessory",
            "expansion",
            "special",
          ]),
          required: z.boolean().default(false),
          priority: z.number().int().min(0).max(10).default(5),
        })
      )
      .optional(),
    autoAssignDefaults: z.boolean().default(false),
    validateSlotCompatibility: z.boolean().default(true),
  })
  .strict();

export type InitializeSlotConfiguration = z.infer<
  typeof InitializeSlotConfigurationSchema
>;

/**
 * Schema for updating skeleton type (with slot migration)
 */
export const UpdateSkeletonTypeSchema = z
  .object({
    configurationId: z.string().min(1, "Configuration ID is required"),
    newSkeletonId: z.string().min(1, "New skeleton ID is required"),
    migrationStrategy: z
      .enum([
        "preserve_compatible",
        "auto_reassign",
        "manual_reassign",
        "clear_all",
      ])
      .default("preserve_compatible"),
    preserveMetadata: z.boolean().default(true),
    allowDataLoss: z.boolean().default(false),
    backupConfiguration: z.boolean().default(true),
    validateAfterMigration: z.boolean().default(true),
  })
  .strict();

export type UpdateSkeletonType = z.infer<typeof UpdateSkeletonTypeSchema>;

/**
 * Schema for cloning a slot configuration
 */
export const CloneSlotConfigurationSchema = z
  .object({
    sourceConfigurationId: z
      .string()
      .min(1, "Source configuration ID is required"),
    targetBotId: z.string().min(1, "Target bot ID is required"),
    includeSlotAssignments: z.boolean().default(true),
    includeMetadata: z.boolean().default(true),
    adaptToTargetSkeleton: z.boolean().default(true),
    overwriteExisting: z.boolean().default(false),
    validateCompatibility: z.boolean().default(true),
  })
  .strict();

export type CloneSlotConfiguration = z.infer<
  typeof CloneSlotConfigurationSchema
>;

/**
 * Schema for optimizing a slot configuration
 */
export const OptimizeSlotConfigurationSchema = z
  .object({
    configurationId: z.string().min(1, "Configuration ID is required"),
    optimizationGoals: z
      .array(
        z.enum([
          "performance",
          "balance",
          "specialization",
          "efficiency",
          "durability",
        ])
      )
      .min(1, "At least one optimization goal is required"),
    priorityWeights: z
      .object({
        attack: z.number().min(0).max(1).optional(),
        defense: z.number().min(0).max(1).optional(),
        speed: z.number().min(0).max(1).optional(),
        perception: z.number().min(0).max(1).optional(),
        energy: z.number().min(0).max(1).optional(),
      })
      .optional(),
    preserveUserPreferences: z.boolean().default(true),
    allowSlotReassignment: z.boolean().default(true),
    maxChanges: z.number().int().min(1).max(50).default(10),
    simulateOnly: z.boolean().default(false),
  })
  .strict();

export type OptimizeSlotConfiguration = z.infer<
  typeof OptimizeSlotConfigurationSchema
>;

/**
 * Schema for validating a skeleton slot configuration
 */
export const ValidateSkeletonSlotConfigurationSchema = z
  .object({
    configurationId: z.string().min(1, "Configuration ID is required"),
    checkSlotCompatibility: z.boolean().default(true),
    checkPartCompatibility: z.boolean().default(true),
    checkSkeletonLimits: z.boolean().default(true),
    checkPerformanceBalance: z.boolean().default(false),
    fixIssues: z.boolean().default(false),
    generateReport: z.boolean().default(true),
  })
  .strict();

export type ValidateSkeletonSlotConfiguration = z.infer<
  typeof ValidateSkeletonSlotConfigurationSchema
>;

/**
 * Schema for resetting a slot configuration
 */
export const ResetSlotConfigurationSchema = z
  .object({
    configurationId: z.string().min(1, "Configuration ID is required"),
    resetType: z
      .enum(["clear_all", "restore_defaults", "skeleton_defaults"])
      .default("clear_all"),
    preserveSpecialSlots: z.boolean().default(false),
    returnPartsToInventory: z.boolean().default(true),
    createBackup: z.boolean().default(true),
    reason: z.string().max(200).optional(),
  })
  .strict();

export type ResetSlotConfiguration = z.infer<
  typeof ResetSlotConfigurationSchema
>;

// ============================================================================
// QUERY SCHEMAS
// ============================================================================

/**
 * Schema for finding a unique SkeletonSlotConfiguration
 */
export const FindUniqueSkeletonSlotConfigurationSchema = z
  .object({
    id: z.string().optional(),
    botId: z.string().optional(),
  })
  .strict();

export type FindUniqueSkeletonSlotConfigurationInput = z.infer<
  typeof FindUniqueSkeletonSlotConfigurationSchema
>;

/**
 * Schema for filtering SkeletonSlotConfigurations
 */
export const SkeletonSlotConfigurationWhereSchema: z.ZodType<any> = z.lazy(() =>
  z
    .object({
      id: z.string().optional(),
      botId: z.string().optional(),
      skeletonType: SkeletonTypeSchema.optional(),
      lastModified: z.date().optional(),
      createdAt: z.date().optional(),
      updatedAt: z.date().optional(),
      AND: z.array(SkeletonSlotConfigurationWhereSchema).optional(),
      OR: z.array(SkeletonSlotConfigurationWhereSchema).optional(),
      NOT: SkeletonSlotConfigurationWhereSchema.optional(),
    })
    .strict()
);

export type SkeletonSlotConfigurationWhere = z.infer<
  typeof SkeletonSlotConfigurationWhereSchema
>;

/**
 * Schema for ordering SkeletonSlotConfigurations
 */
export const SkeletonSlotConfigurationOrderBySchema = z
  .object({
    id: z.enum(["asc", "desc"]).optional(),
    botId: z.enum(["asc", "desc"]).optional(),
    skeletonType: z.enum(["asc", "desc"]).optional(),
    lastModified: z.enum(["asc", "desc"]).optional(),
    createdAt: z.enum(["asc", "desc"]).optional(),
    updatedAt: z.enum(["asc", "desc"]).optional(),
  })
  .strict();

export type SkeletonSlotConfigurationOrderBy = z.infer<
  typeof SkeletonSlotConfigurationOrderBySchema
>;

/**
 * Schema for selecting SkeletonSlotConfiguration fields
 */
export const SkeletonSlotConfigurationSelectSchema = z
  .object({
    id: z.boolean().optional(),
    botId: z.boolean().optional(),
    skeletonType: z.boolean().optional(),
    lastModified: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    updatedAt: z.boolean().optional(),
    bot: z.boolean().optional(),
    slotAssignments: z.boolean().optional(),
  })
  .strict();

export type SkeletonSlotConfigurationSelect = z.infer<
  typeof SkeletonSlotConfigurationSelectSchema
>;

/**
 * Schema for including SkeletonSlotConfiguration relations
 */
export const SkeletonSlotConfigurationIncludeSchema = z
  .object({
    bot: z.boolean().optional(),
    slotAssignments: z.boolean().optional(),
  })
  .strict();

export type SkeletonSlotConfigurationInclude = z.infer<
  typeof SkeletonSlotConfigurationIncludeSchema
>;

// ============================================================================
// PAGINATION SCHEMAS
// ============================================================================

/**
 * Schema for paginated SkeletonSlotConfiguration queries
 */
export const FindManySkeletonSlotConfigurationsSchema = z
  .object({
    where: SkeletonSlotConfigurationWhereSchema.optional(),
    orderBy: z
      .union([
        SkeletonSlotConfigurationOrderBySchema,
        z.array(SkeletonSlotConfigurationOrderBySchema),
      ])
      .optional(),
    select: SkeletonSlotConfigurationSelectSchema.optional(),
    include: SkeletonSlotConfigurationIncludeSchema.optional(),
    skip: z.number().int().min(0).optional(),
    take: z.number().int().min(1).max(1000).optional(),
    cursor: FindUniqueSkeletonSlotConfigurationSchema.optional(),
  })
  .strict();

export type FindManySkeletonSlotConfigurationsInput = z.infer<
  typeof FindManySkeletonSlotConfigurationsSchema
>;

// ============================================================================
// VALIDATION HELPERS
// ============================================================================

/**
 * Schema for analyzing slot configuration performance
 */
export const AnalyzeSlotConfigurationSchema = z
  .object({
    configurationId: z.string().min(1, "Configuration ID is required"),
    analyzePerformance: z.boolean().default(true),
    analyzeBalance: z.boolean().default(true),
    analyzeUtilization: z.boolean().default(true),
    analyzeCompatibility: z.boolean().default(true),
    includeRecommendations: z.boolean().default(true),
    includeOptimizations: z.boolean().default(true),
    compareToOptimal: z.boolean().default(false),
  })
  .strict();

export type AnalyzeSlotConfiguration = z.infer<
  typeof AnalyzeSlotConfigurationSchema
>;

/**
 * Schema for slot configuration search and filtering
 */
export const SearchSlotConfigurationsSchema = z
  .object({
    skeletonType: SkeletonTypeSchema.optional(),
    userId: z.string().optional(),
    hasSlotAssignments: z.boolean().optional(),
    utilizationRate: z
      .object({
        min: z.number().min(0).max(1).optional(),
        max: z.number().min(0).max(1).optional(),
      })
      .optional(),
    lastModifiedAfter: z.coerce.date().optional(),
    lastModifiedBefore: z.coerce.date().optional(),
    botName: z.string().optional(),
    isOptimized: z.boolean().optional(),
    hasCustomizations: z.boolean().optional(),
    performanceGrade: z.enum(["F", "D", "C", "B", "A", "S"]).optional(),
    limit: z.number().int().min(1).max(100).default(20),
  })
  .strict();

export type SearchSlotConfigurations = z.infer<
  typeof SearchSlotConfigurationsSchema
>;

/**
 * Schema for slot configuration comparison
 */
export const CompareSlotConfigurationsSchema = z
  .object({
    baseConfigurationId: z.string().min(1, "Base configuration ID is required"),
    compareConfigurationIds: z
      .array(z.string().min(1))
      .min(1, "At least one comparison configuration required")
      .max(5, "Too many configurations to compare"),
    comparisonMetrics: z
      .array(
        z.enum([
          "performance",
          "balance",
          "utilization",
          "compatibility",
          "optimization",
        ])
      )
      .default(["performance", "balance", "utilization"]),
    includeRecommendations: z.boolean().default(true),
    generateReport: z.boolean().default(false),
  })
  .strict();

export type CompareSlotConfigurations = z.infer<
  typeof CompareSlotConfigurationsSchema
>;

// ============================================================================
// RESPONSE SCHEMAS
// ============================================================================

/**
 * Schema for SkeletonSlotConfiguration API responses
 */
export const SkeletonSlotConfigurationResponseSchema =
  SkeletonSlotConfigurationSchema;

export type SkeletonSlotConfigurationResponse = z.infer<
  typeof SkeletonSlotConfigurationResponseSchema
>;

/**
 * Schema for SkeletonSlotConfiguration with Bot information
 */
export const SkeletonSlotConfigurationWithBotSchema =
  SkeletonSlotConfigurationResponseSchema.safeExtend({
    bot: z.object({
      id: z.string(),
      name: z.string(),
      botType: z.string(),
      userId: z.string().nullable(),
    }),
  });

export type SkeletonSlotConfigurationWithBot = z.infer<
  typeof SkeletonSlotConfigurationWithBotSchema
>;

/**
 * Schema for SkeletonSlotConfiguration summary (minimal info)
 */
export const SkeletonSlotConfigurationSummarySchema = z
  .object({
    id: z.string(),
    botId: z.string(),
    skeletonType: z.string(),
    assignmentCount: z.number().int().min(0),
    utilizationRate: z.number().min(0).max(1),
    lastModified: z.date(),
  })
  .strict();

export type SkeletonSlotConfigurationSummary = z.infer<
  typeof SkeletonSlotConfigurationSummarySchema
>;

/**
 * Schema for SkeletonSlotConfiguration with complete slot details
 */
export const SkeletonSlotConfigurationWithSlotsSchema =
  SkeletonSlotConfigurationResponseSchema.safeExtend({
    slotAssignments: z.array(
      z.object({
        id: z.string(),
        slotId: z.string(),
        partId: z.string(),
        partName: z.string(),
        partCategory: z.string(),
        assignedAt: z.date(),
        hasMetadata: z.boolean(),
      })
    ),
    slotCapacity: z.object({
      totalSlots: z.number().int().min(0),
      assignedSlots: z.number().int().min(0),
      emptySlots: z.number().int().min(0),
      utilizationRate: z.number().min(0).max(1),
    }),
    performanceMetrics: z.object({
      totalAttack: z.number(),
      totalDefense: z.number(),
      totalSpeed: z.number(),
      totalPerception: z.number(),
      balanceScore: z.number().min(0).max(1),
      efficiencyScore: z.number().min(0).max(1),
      overallGrade: z.enum(["F", "D", "C", "B", "A", "S"]),
    }),
  });

export type SkeletonSlotConfigurationWithSlots = z.infer<
  typeof SkeletonSlotConfigurationWithSlotsSchema
>;

/**
 * Schema for slot configuration validation result
 */
export const SlotConfigurationValidationResultSchema = z
  .object({
    configurationId: z.string(),
    isValid: z.boolean(),
    validationScore: z.number().min(0).max(1),
    issues: z.array(
      z.object({
        type: z.enum(["error", "warning", "info"]),
        category: z.enum([
          "compatibility",
          "balance",
          "performance",
          "utilization",
          "optimization",
        ]),
        message: z.string(),
        slotId: z.string().optional(),
        severity: z.enum(["critical", "high", "medium", "low"]),
        fixable: z.boolean(),
        recommendation: z.string().optional(),
      })
    ),
    performance: z.object({
      attackRating: z.number(),
      defenseRating: z.number(),
      speedRating: z.number(),
      perceptionRating: z.number(),
      balanceRating: z.number().min(0).max(1),
      efficiencyRating: z.number().min(0).max(1),
      overallRating: z.number().min(0).max(1),
      grade: z.enum(["F", "D", "C", "B", "A", "S"]),
    }),
    utilization: z.object({
      totalSlots: z.number().int().min(0),
      usedSlots: z.number().int().min(0),
      emptySlots: z.number().int().min(0),
      utilizationRate: z.number().min(0).max(1),
      optimalUtilization: z.number().min(0).max(1),
    }),
    recommendations: z.array(
      z.object({
        type: z.enum([
          "slot_assignment",
          "part_upgrade",
          "balance_adjustment",
          "performance_optimization",
        ]),
        priority: z.enum(["low", "medium", "high", "critical"]),
        description: z.string(),
        estimatedImpact: z.number().min(0).max(1),
        requiredActions: z.array(z.string()),
      })
    ),
  })
  .strict();

export type SlotConfigurationValidationResult = z.infer<
  typeof SlotConfigurationValidationResultSchema
>;

/**
 * Schema for slot configuration optimization result
 */
export const SlotConfigurationOptimizationResultSchema = z
  .object({
    configurationId: z.string(),
    originalPerformance: z.object({
      attack: z.number(),
      defense: z.number(),
      speed: z.number(),
      perception: z.number(),
      balance: z.number().min(0).max(1),
      efficiency: z.number().min(0).max(1),
      grade: z.enum(["F", "D", "C", "B", "A", "S"]),
    }),
    optimizedPerformance: z.object({
      attack: z.number(),
      defense: z.number(),
      speed: z.number(),
      perception: z.number(),
      balance: z.number().min(0).max(1),
      efficiency: z.number().min(0).max(1),
      grade: z.enum(["F", "D", "C", "B", "A", "S"]),
    }),
    improvements: z.object({
      attackImprovement: z.number(),
      defenseImprovement: z.number(),
      speedImprovement: z.number(),
      perceptionImprovement: z.number(),
      balanceImprovement: z.number(),
      efficiencyImprovement: z.number(),
      overallImprovement: z.number(),
    }),
    changes: z.array(
      z.object({
        slotId: z.string(),
        action: z.enum(["assign", "unassign", "swap", "move"]),
        fromPartId: z.string().optional(),
        toPartId: z.string().optional(),
        targetSlotId: z.string().optional(),
        reason: z.string(),
        impact: z.number().min(0).max(1),
      })
    ),
    simulationOnly: z.boolean(),
    applied: z.boolean(),
    applicableChanges: z.number().int().min(0),
    totalChanges: z.number().int().min(0),
  })
  .strict();

export type SlotConfigurationOptimizationResult = z.infer<
  typeof SlotConfigurationOptimizationResultSchema
>;

/**
 * Schema for slot configuration comparison result
 */
export const SlotConfigurationComparisonResultSchema = z
  .object({
    baseConfiguration: SkeletonSlotConfigurationSummarySchema,
    comparisonConfigurations: z.array(SkeletonSlotConfigurationSummarySchema),
    metrics: z.object({
      performanceComparison: z.record(
        z.string(),
        z.object({
          attack: z.number(),
          defense: z.number(),
          speed: z.number(),
          perception: z.number(),
          overall: z.number(),
          rank: z.number().int().min(1),
        })
      ),
      utilizationComparison: z.record(
        z.string(),
        z.object({
          rate: z.number().min(0).max(1),
          efficiency: z.number().min(0).max(1),
          rank: z.number().int().min(1),
        })
      ),
      balanceComparison: z.record(
        z.string(),
        z.object({
          score: z.number().min(0).max(1),
          grade: z.enum(["F", "D", "C", "B", "A", "S"]),
          rank: z.number().int().min(1),
        })
      ),
    }),
    winner: z.object({
      overall: z.string(),
      performance: z.string(),
      utilization: z.string(),
      balance: z.string(),
    }),
    recommendations: z.array(
      z.object({
        configurationId: z.string(),
        improvements: z.array(z.string()),
        priority: z.enum(["low", "medium", "high"]),
      })
    ),
  })
  .strict();

export type SlotConfigurationComparisonResult = z.infer<
  typeof SlotConfigurationComparisonResultSchema
>;

// ============================================================================
// ADMIN SCHEMAS
// ============================================================================

/**
 * Schema for admin slot configuration management
 */
export const AdminSlotConfigurationManagementSchema = z
  .object({
    action: z.enum([
      "list_all",
      "validate_all",
      "optimize_all",
      "reset_configurations",
      "fix_inconsistencies",
      "generate_report",
      "create_templates",
      "backup_configurations",
    ]),
    filters: z
      .object({
        skeletonType: SkeletonTypeSchema.optional(),
        userId: z.string().optional(),
        lastModifiedAfter: z.coerce.date().optional(),
        hasIssues: z.boolean().optional(),
        needsOptimization: z.boolean().optional(),
      })
      .optional(),
    validationOptions: z
      .object({
        checkPerformance: z.boolean().default(true),
        checkBalance: z.boolean().default(true),
        fixIssues: z.boolean().default(false),
        generateReports: z.boolean().default(true),
      })
      .optional(),
    optimizationOptions: z
      .object({
        goals: z
          .array(z.enum(["performance", "balance", "efficiency"]))
          .default(["performance"]),
        preserveUserPreferences: z.boolean().default(true),
        simulateOnly: z.boolean().default(true),
      })
      .optional(),
    resetOptions: z
      .object({
        resetType: z
          .enum(["clear_all", "restore_defaults"])
          .default("clear_all"),
        createBackups: z.boolean().default(true),
        preserveSpecialSlots: z.boolean().default(false),
      })
      .optional(),
  })
  .strict();

export type AdminSlotConfigurationManagement = z.infer<
  typeof AdminSlotConfigurationManagementSchema
>;

/**
 * Schema for slot configuration statistics
 */
export const SlotConfigurationStatsSchema = z
  .object({
    totalConfigurations: z.number().int().min(0),
    configurationsBySkeletonType: z.record(z.string(), z.number().int().min(0)),
    averageUtilizationRate: z.number().min(0).max(1),
    utilizationDistribution: z.object({
      underutilized: z.number().int().min(0), // < 50%
      wellUtilized: z.number().int().min(0), // 50-80%
      fullyUtilized: z.number().int().min(0), // 80-100%
    }),
    performanceDistribution: z.object({
      gradeS: z.number().int().min(0),
      gradeA: z.number().int().min(0),
      gradeB: z.number().int().min(0),
      gradeC: z.number().int().min(0),
      gradeD: z.number().int().min(0),
      gradeF: z.number().int().min(0),
    }),
    recentActivity: z.object({
      configurationsCreatedLast24h: z.number().int().min(0),
      configurationsModifiedLast24h: z.number().int().min(0),
      configurationsOptimizedLast7d: z.number().int().min(0),
      mostActiveSkeletonType: z.string().optional(),
    }),
    topPerformers: z.array(
      z.object({
        configurationId: z.string(),
        botId: z.string(),
        botName: z.string(),
        skeletonType: z.string(),
        performanceScore: z.number(),
        category: z.enum(["overall", "attack", "defense", "speed", "balance"]),
      })
    ),
    commonIssues: z.array(
      z.object({
        issue: z.string(),
        count: z.number().int().min(0),
        severity: z.enum(["low", "medium", "high", "critical"]),
        recommendedAction: z.string(),
      })
    ),
    optimizationOpportunities: z.object({
      configurationsNeedingOptimization: z.number().int().min(0),
      averageOptimizationPotential: z.number().min(0).max(1),
      topOptimizationTargets: z.array(
        z.object({
          configurationId: z.string(),
          botName: z.string(),
          currentGrade: z.enum(["F", "D", "C", "B", "A", "S"]),
          potentialGrade: z.enum(["F", "D", "C", "B", "A", "S"]),
          improvementPotential: z.number().min(0).max(1),
        })
      ),
    }),
  })
  .strict();

export type SlotConfigurationStats = z.infer<
  typeof SlotConfigurationStatsSchema
>;

// ============================================================================
// EXPORTS
// ============================================================================

// All schemas are defined above and exported individually

// Export all validation functions
export const SkeletonSlotConfigurationValidation = {
  // Base schemas
  model: SkeletonSlotConfigurationSchema,
  input: SkeletonSlotConfigurationInputSchema,

  // CRUD schemas
  create: CreateSkeletonSlotConfigurationSchema,
  createApi: CreateSkeletonSlotConfigurationApiSchema,
  update: UpdateSkeletonSlotConfigurationSchema,
  updateApi: UpdateSkeletonSlotConfigurationApiSchema,
  partialUpdate: PartialUpdateSkeletonSlotConfigurationSchema,

  // Configuration management schemas
  initialize: InitializeSlotConfigurationSchema,
  updateSkeletonType: UpdateSkeletonTypeSchema,
  clone: CloneSlotConfigurationSchema,
  optimize: OptimizeSlotConfigurationSchema,
  reset: ResetSlotConfigurationSchema,

  // Query schemas
  findUnique: FindUniqueSkeletonSlotConfigurationSchema,
  findMany: FindManySkeletonSlotConfigurationsSchema,
  where: SkeletonSlotConfigurationWhereSchema,
  orderBy: SkeletonSlotConfigurationOrderBySchema,
  select: SkeletonSlotConfigurationSelectSchema,
  include: SkeletonSlotConfigurationIncludeSchema,

  // Helpers
  analyze: AnalyzeSlotConfigurationSchema,
  search: SearchSlotConfigurationsSchema,
  compare: CompareSlotConfigurationsSchema,
  validateConfiguration: ValidateSkeletonSlotConfigurationSchema,

  // Response schemas
  response: SkeletonSlotConfigurationResponseSchema,
  withBot: SkeletonSlotConfigurationWithBotSchema,
  summary: SkeletonSlotConfigurationSummarySchema,
  withSlots: SkeletonSlotConfigurationWithSlotsSchema,
  validationResult: SlotConfigurationValidationResultSchema,
  optimizationResult: SlotConfigurationOptimizationResultSchema,
  comparisonResult: SlotConfigurationComparisonResultSchema,

  // Admin schemas
  adminManagement: AdminSlotConfigurationManagementSchema,
  stats: SlotConfigurationStatsSchema,

  // Enum schemas
  skeletonType: SkeletonTypeSchema,
} as const;
