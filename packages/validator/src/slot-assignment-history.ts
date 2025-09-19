import { z } from "zod";

// ============================================================================
// OPERATION TYPES AND ENUMS
// ============================================================================

/**
 * Slot assignment operation types
 */
export const SlotAssignmentOperationSchema = z.enum([
  "assign",
  "unassign",
  "swap",
  "move",
  "bulk_assign",
  "bulk_unassign",
  "configuration_reset",
  "skeleton_migration",
  "optimization",
  "clone",
]);

export type SlotAssignmentOperation = z.infer<
  typeof SlotAssignmentOperationSchema
>;

/**
 * SlotIdentifier enum values for history tracking
 */
export const HistorySlotIdentifierSchema = z
  .string()
  .min(1, "Slot ID is required");

// ============================================================================
// BASE SCHEMAS
// ============================================================================

/**
 * Base SlotAssignmentHistory model schema - represents the complete SlotAssignmentHistory entity
 */
export const SlotAssignmentHistorySchema = z
  .object({
    id: z.string(),
    botId: z.string(),
    operation: z.string(),
    slotId: z.string(),
    partId: z.string().nullable(),
    targetSlotId: z.string().nullable(),
    swapWithSlotId: z.string().nullable(),
    previousState: z.record(z.string(), z.unknown()).nullable(),
    newState: z.record(z.string(), z.unknown()).nullable(),
    userId: z.string(),
    timestamp: z.date(),
    metadata: z.record(z.string(), z.unknown()).nullable(),
    createdAt: z.date(),
  })
  .strict();

export type SlotAssignmentHistory = z.infer<typeof SlotAssignmentHistorySchema>;

/**
 * SlotAssignmentHistory input schema for forms and API inputs (without auto-generated fields)
 */
export const SlotAssignmentHistoryInputSchema = z
  .object({
    botId: z.string().min(1, "Bot ID is required"),
    operation: SlotAssignmentOperationSchema,
    slotId: HistorySlotIdentifierSchema,
    partId: z.string().min(1).nullable().optional(),
    targetSlotId: HistorySlotIdentifierSchema.nullable().optional(),
    swapWithSlotId: HistorySlotIdentifierSchema.nullable().optional(),
    previousState: z.record(z.string(), z.unknown()).nullable().optional(),
    newState: z.record(z.string(), z.unknown()).nullable().optional(),
    userId: z.string().min(1, "User ID is required"),
    timestamp: z.coerce
      .date()
      .optional()
      .default(() => new Date()),
    metadata: z.record(z.string(), z.unknown()).nullable().optional(),
  })
  .strict()
  .refine(
    (data) => {
      // Move operations must have targetSlotId
      if (data.operation === "move" && !data.targetSlotId) {
        return false;
      }
      return true;
    },
    {
      message: "Move operations must specify a target slot ID",
      path: ["targetSlotId"],
    }
  )
  .refine(
    (data) => {
      // Swap operations must have swapWithSlotId
      if (data.operation === "swap" && !data.swapWithSlotId) {
        return false;
      }
      return true;
    },
    {
      message: "Swap operations must specify a swap slot ID",
      path: ["swapWithSlotId"],
    }
  )
  .refine(
    (data) => {
      // Assign operations should have partId
      if (data.operation === "assign" && !data.partId) {
        return false;
      }
      return true;
    },
    {
      message: "Assign operations should specify a part ID",
      path: ["partId"],
    }
  );

export type SlotAssignmentHistoryInput = z.infer<
  typeof SlotAssignmentHistoryInputSchema
>;

// ============================================================================
// CREATE SCHEMAS
// ============================================================================

/**
 * Schema for creating a new SlotAssignmentHistory
 * Compatible with Prisma SlotAssignmentHistoryCreateInput
 */
export const CreateSlotAssignmentHistorySchema = z
  .object({
    id: z.string().optional(),
    botId: z.string().min(1, "Bot ID is required"),
    operation: SlotAssignmentOperationSchema,
    slotId: HistorySlotIdentifierSchema,
    partId: z.string().min(1).nullable().optional(),
    targetSlotId: HistorySlotIdentifierSchema.nullable().optional(),
    swapWithSlotId: HistorySlotIdentifierSchema.nullable().optional(),
    previousState: z.record(z.string(), z.unknown()).nullable().optional(),
    newState: z.record(z.string(), z.unknown()).nullable().optional(),
    userId: z.string().min(1, "User ID is required"),
    timestamp: z.coerce
      .date()
      .optional()
      .default(() => new Date()),
    metadata: z.record(z.string(), z.unknown()).nullable().optional(),
    createdAt: z.coerce.date().optional(),
  })
  .strict()
  .refine(
    (data) => {
      if (data.operation === "move" && !data.targetSlotId) {
        return false;
      }
      if (data.operation === "swap" && !data.swapWithSlotId) {
        return false;
      }
      if (data.operation === "assign" && !data.partId) {
        return false;
      }
      return true;
    },
    {
      message: "Operation-specific fields are required",
      path: ["operation"],
    }
  );

export type CreateSlotAssignmentHistoryInput = z.infer<
  typeof CreateSlotAssignmentHistorySchema
>;

/**
 * Simplified create schema for API endpoints
 */
export const CreateSlotAssignmentHistoryApiSchema = z
  .object({
    botId: z.string().min(1, "Bot ID is required"),
    operation: SlotAssignmentOperationSchema,
    slotId: HistorySlotIdentifierSchema,
    partId: z.string().min(1).nullable().optional(),
    targetSlotId: HistorySlotIdentifierSchema.nullable().optional(),
    swapWithSlotId: HistorySlotIdentifierSchema.nullable().optional(),
    autoCapturePreviousState: z.boolean().default(true),
    autoCaptureNewState: z.boolean().default(true),
    includeMetadata: z.boolean().default(true),
    operationContext: z
      .object({
        source: z.enum([
          "user_action",
          "system_optimization",
          "batch_operation",
          "migration",
          "admin_action",
        ]),
        reason: z.string().max(200).optional(),
        sessionId: z.string().optional(),
        deviceInfo: z.string().optional(),
      })
      .optional(),
  })
  .strict();

export type CreateSlotAssignmentHistoryApi = z.infer<
  typeof CreateSlotAssignmentHistoryApiSchema
>;

// ============================================================================
// UPDATE SCHEMAS
// ============================================================================

/**
 * Schema for updating a SlotAssignmentHistory
 * Compatible with Prisma SlotAssignmentHistoryUpdateInput
 */
export const UpdateSlotAssignmentHistorySchema = z
  .object({
    id: z.string().optional(),
    botId: z.string().min(1, "Bot ID is required").optional(),
    operation: SlotAssignmentOperationSchema.optional(),
    slotId: HistorySlotIdentifierSchema.optional(),
    partId: z.string().min(1).nullable().optional(),
    targetSlotId: HistorySlotIdentifierSchema.nullable().optional(),
    swapWithSlotId: HistorySlotIdentifierSchema.nullable().optional(),
    previousState: z.record(z.string(), z.unknown()).nullable().optional(),
    newState: z.record(z.string(), z.unknown()).nullable().optional(),
    userId: z.string().min(1, "User ID is required").optional(),
    timestamp: z.coerce.date().optional(),
    metadata: z.record(z.string(), z.unknown()).nullable().optional(),
    createdAt: z.coerce.date().optional(),
  })
  .strict();

export type UpdateSlotAssignmentHistoryInput = z.infer<
  typeof UpdateSlotAssignmentHistorySchema
>;

/**
 * Simplified update schema for API endpoints (mainly for metadata updates)
 */
export const UpdateSlotAssignmentHistoryApiSchema = z
  .object({
    addMetadata: z.record(z.string(), z.unknown()).optional(),
    updateMetadata: z.record(z.string(), z.unknown()).optional(),
    addTags: z.array(z.string()).optional(),
    removeTags: z.array(z.string()).optional(),
    updateContext: z
      .object({
        notes: z.string().max(500).optional(),
        category: z
          .enum(["optimization", "customization", "maintenance", "error_fix"])
          .optional(),
        priority: z.enum(["low", "medium", "high", "urgent"]).optional(),
      })
      .optional(),
  })
  .strict();

export type UpdateSlotAssignmentHistoryApi = z.infer<
  typeof UpdateSlotAssignmentHistoryApiSchema
>;

/**
 * Partial update schema - all fields optional
 */
export const PartialUpdateSlotAssignmentHistorySchema =
  SlotAssignmentHistoryInputSchema.partial();

export type PartialUpdateSlotAssignmentHistory = z.infer<
  typeof PartialUpdateSlotAssignmentHistorySchema
>;

// ============================================================================
// HISTORY TRACKING SCHEMAS
// ============================================================================

/**
 * Schema for recording an assignment operation
 */
export const RecordAssignmentOperationSchema = z
  .object({
    botId: z.string().min(1, "Bot ID is required"),
    operation: SlotAssignmentOperationSchema,
    operationDetails: z
      .object({
        slotId: HistorySlotIdentifierSchema,
        partId: z.string().min(1).optional(),
        targetSlotId: HistorySlotIdentifierSchema.optional(),
        swapWithSlotId: HistorySlotIdentifierSchema.optional(),
        previousPartId: z.string().optional(),
        newPartId: z.string().optional(),
      })
      .strict(),
    userId: z.string().min(1, "User ID is required"),
    captureStates: z.boolean().default(true),
    operationMetadata: z
      .object({
        source: z.enum([
          "manual",
          "optimization",
          "migration",
          "bulk_operation",
          "system",
        ]),
        reason: z.string().max(200).optional(),
        batchId: z.string().optional(),
        sessionId: z.string().optional(),
        performance: z
          .object({
            executionTime: z.number().min(0).optional(),
            complexity: z.enum(["simple", "medium", "complex"]).optional(),
          })
          .optional(),
      })
      .optional(),
  })
  .strict();

export type RecordAssignmentOperation = z.infer<
  typeof RecordAssignmentOperationSchema
>;

/**
 * Schema for recording bulk operations
 */
export const RecordBulkOperationSchema = z
  .object({
    batchId: z.string().min(1, "Batch ID is required"),
    botId: z.string().min(1, "Bot ID is required"),
    operations: z
      .array(
        z.object({
          operation: SlotAssignmentOperationSchema,
          slotId: HistorySlotIdentifierSchema,
          partId: z.string().optional(),
          targetSlotId: HistorySlotIdentifierSchema.optional(),
          success: z.boolean(),
          error: z.string().optional(),
        })
      )
      .min(1, "At least one operation is required"),
    userId: z.string().min(1, "User ID is required"),
    batchMetadata: z
      .object({
        totalOperations: z.number().int().min(1),
        successfulOperations: z.number().int().min(0),
        failedOperations: z.number().int().min(0),
        executionTime: z.number().min(0).optional(),
        source: z.enum(["user", "system", "optimization", "migration"]),
        reason: z.string().max(300).optional(),
      })
      .strict(),
    recordIndividualOperations: z.boolean().default(true),
  })
  .strict();

export type RecordBulkOperation = z.infer<typeof RecordBulkOperationSchema>;

/**
 * Schema for recording configuration changes
 */
export const RecordConfigurationChangeSchema = z
  .object({
    botId: z.string().min(1, "Bot ID is required"),
    changeType: z.enum([
      "skeleton_change",
      "configuration_reset",
      "optimization",
      "migration",
      "template_application",
    ]),
    previousConfiguration: z.record(z.string(), z.unknown()).optional(),
    newConfiguration: z.record(z.string(), z.unknown()).optional(),
    affectedSlots: z.array(HistorySlotIdentifierSchema),
    userId: z.string().min(1, "User ID is required"),
    changeMetadata: z
      .object({
        reason: z.string().max(300).optional(),
        source: z.enum([
          "user_request",
          "system_optimization",
          "performance_improvement",
          "skeleton_upgrade",
          "admin_action",
        ]),
        previousSkeletonType: z.string().optional(),
        newSkeletonType: z.string().optional(),
        performanceImpact: z
          .object({
            attackChange: z.number().optional(),
            defenseChange: z.number().optional(),
            speedChange: z.number().optional(),
            perceptionChange: z.number().optional(),
          })
          .optional(),
      })
      .optional(),
  })
  .strict();

export type RecordConfigurationChange = z.infer<
  typeof RecordConfigurationChangeSchema
>;

// ============================================================================
// QUERY SCHEMAS
// ============================================================================

/**
 * Schema for finding a unique SlotAssignmentHistory
 */
export const FindUniqueSlotAssignmentHistorySchema = z
  .object({
    id: z.string().optional(),
  })
  .strict();

export type FindUniqueSlotAssignmentHistoryInput = z.infer<
  typeof FindUniqueSlotAssignmentHistorySchema
>;

/**
 * Schema for filtering SlotAssignmentHistories
 */
export const SlotAssignmentHistoryWhereSchema: z.ZodType<any> = z.lazy(() =>
  z
    .object({
      id: z.string().optional(),
      botId: z.string().optional(),
      operation: z.string().optional(),
      slotId: z.string().optional(),
      partId: z.string().nullable().optional(),
      targetSlotId: z.string().nullable().optional(),
      swapWithSlotId: z.string().nullable().optional(),
      userId: z.string().optional(),
      timestamp: z.date().optional(),
      createdAt: z.date().optional(),
      AND: z.array(SlotAssignmentHistoryWhereSchema).optional(),
      OR: z.array(SlotAssignmentHistoryWhereSchema).optional(),
      NOT: SlotAssignmentHistoryWhereSchema.optional(),
    })
    .strict()
);

export type SlotAssignmentHistoryWhere = z.infer<
  typeof SlotAssignmentHistoryWhereSchema
>;

/**
 * Schema for ordering SlotAssignmentHistories
 */
export const SlotAssignmentHistoryOrderBySchema = z
  .object({
    id: z.enum(["asc", "desc"]).optional(),
    botId: z.enum(["asc", "desc"]).optional(),
    operation: z.enum(["asc", "desc"]).optional(),
    slotId: z.enum(["asc", "desc"]).optional(),
    partId: z.enum(["asc", "desc"]).optional(),
    targetSlotId: z.enum(["asc", "desc"]).optional(),
    swapWithSlotId: z.enum(["asc", "desc"]).optional(),
    userId: z.enum(["asc", "desc"]).optional(),
    timestamp: z.enum(["asc", "desc"]).optional(),
    createdAt: z.enum(["asc", "desc"]).optional(),
  })
  .strict();

export type SlotAssignmentHistoryOrderBy = z.infer<
  typeof SlotAssignmentHistoryOrderBySchema
>;

/**
 * Schema for selecting SlotAssignmentHistory fields
 */
export const SlotAssignmentHistorySelectSchema = z
  .object({
    id: z.boolean().optional(),
    botId: z.boolean().optional(),
    operation: z.boolean().optional(),
    slotId: z.boolean().optional(),
    partId: z.boolean().optional(),
    targetSlotId: z.boolean().optional(),
    swapWithSlotId: z.boolean().optional(),
    previousState: z.boolean().optional(),
    newState: z.boolean().optional(),
    userId: z.boolean().optional(),
    timestamp: z.boolean().optional(),
    metadata: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    bot: z.boolean().optional(),
    user: z.boolean().optional(),
  })
  .strict();

export type SlotAssignmentHistorySelect = z.infer<
  typeof SlotAssignmentHistorySelectSchema
>;

/**
 * Schema for including SlotAssignmentHistory relations
 */
export const SlotAssignmentHistoryIncludeSchema = z
  .object({
    bot: z.boolean().optional(),
    user: z.boolean().optional(),
  })
  .strict();

export type SlotAssignmentHistoryInclude = z.infer<
  typeof SlotAssignmentHistoryIncludeSchema
>;

// ============================================================================
// PAGINATION SCHEMAS
// ============================================================================

/**
 * Schema for paginated SlotAssignmentHistory queries
 */
export const FindManySlotAssignmentHistoriesSchema = z
  .object({
    where: SlotAssignmentHistoryWhereSchema.optional(),
    orderBy: z
      .union([
        SlotAssignmentHistoryOrderBySchema,
        z.array(SlotAssignmentHistoryOrderBySchema),
      ])
      .optional(),
    select: SlotAssignmentHistorySelectSchema.optional(),
    include: SlotAssignmentHistoryIncludeSchema.optional(),
    skip: z.number().int().min(0).optional(),
    take: z.number().int().min(1).max(1000).optional(),
    cursor: FindUniqueSlotAssignmentHistorySchema.optional(),
  })
  .strict();

export type FindManySlotAssignmentHistoriesInput = z.infer<
  typeof FindManySlotAssignmentHistoriesSchema
>;

// ============================================================================
// VALIDATION HELPERS
// ============================================================================

/**
 * Schema for analyzing slot assignment history
 */
export const AnalyzeSlotAssignmentHistorySchema = z
  .object({
    botId: z.string().min(1, "Bot ID is required").optional(),
    userId: z.string().optional(),
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
    operationTypes: z.array(SlotAssignmentOperationSchema).optional(),
    analyzePatterns: z.boolean().default(true),
    analyzePerformance: z.boolean().default(true),
    analyzeUserBehavior: z.boolean().default(false),
    includeTrends: z.boolean().default(true),
    includeRecommendations: z.boolean().default(true),
  })
  .strict();

export type AnalyzeSlotAssignmentHistory = z.infer<
  typeof AnalyzeSlotAssignmentHistorySchema
>;

/**
 * Schema for slot assignment history search and filtering
 */
export const SearchSlotAssignmentHistorySchema = z
  .object({
    botId: z.string().optional(),
    userId: z.string().optional(),
    operation: SlotAssignmentOperationSchema.optional(),
    slotId: HistorySlotIdentifierSchema.optional(),
    partId: z.string().optional(),
    dateRange: z
      .object({
        from: z.coerce.date(),
        to: z.coerce.date(),
      })
      .optional(),
    hasMetadata: z.boolean().optional(),
    operationSource: z
      .enum(["user", "system", "optimization", "migration", "admin"])
      .optional(),
    includeStates: z.boolean().default(false),
    includeMetadata: z.boolean().default(true),
    groupByOperation: z.boolean().default(false),
    groupByBot: z.boolean().default(false),
    groupByUser: z.boolean().default(false),
    limit: z.number().int().min(1).max(1000).default(50),
  })
  .strict();

export type SearchSlotAssignmentHistory = z.infer<
  typeof SearchSlotAssignmentHistorySchema
>;

/**
 * Schema for history audit operations
 */
export const AuditSlotAssignmentHistorySchema = z
  .object({
    auditType: z.enum([
      "integrity_check",
      "performance_analysis",
      "user_activity",
      "system_operations",
      "error_detection",
    ]),
    timeRange: z
      .object({
        startDate: z.coerce.date(),
        endDate: z.coerce.date(),
      })
      .optional(),
    targetBot: z.string().optional(),
    targetUser: z.string().optional(),
    includeDetailedReport: z.boolean().default(true),
    checkDataIntegrity: z.boolean().default(true),
    validateStates: z.boolean().default(false),
    generateMetrics: z.boolean().default(true),
  })
  .strict();

export type AuditSlotAssignmentHistory = z.infer<
  typeof AuditSlotAssignmentHistorySchema
>;

// ============================================================================
// RESPONSE SCHEMAS
// ============================================================================

/**
 * Schema for SlotAssignmentHistory API responses
 */
export const SlotAssignmentHistoryResponseSchema = SlotAssignmentHistorySchema;

export type SlotAssignmentHistoryResponse = z.infer<
  typeof SlotAssignmentHistoryResponseSchema
>;

/**
 * Schema for SlotAssignmentHistory with User and Bot information
 */
export const SlotAssignmentHistoryWithRelationsSchema =
  SlotAssignmentHistoryResponseSchema.safeExtend({
    bot: z.object({
      id: z.string(),
      name: z.string(),
      botType: z.string(),
    }),
    user: z.object({
      id: z.string(),
      name: z.string().nullable(),
      email: z.string(),
    }),
  });

export type SlotAssignmentHistoryWithRelations = z.infer<
  typeof SlotAssignmentHistoryWithRelationsSchema
>;

/**
 * Schema for SlotAssignmentHistory summary (minimal info)
 */
export const SlotAssignmentHistorySummarySchema = z
  .object({
    id: z.string(),
    botId: z.string(),
    operation: z.string(),
    slotId: z.string(),
    partId: z.string().nullable(),
    userId: z.string(),
    timestamp: z.date(),
    hasMetadata: z.boolean(),
  })
  .strict();

export type SlotAssignmentHistorySummary = z.infer<
  typeof SlotAssignmentHistorySummarySchema
>;

/**
 * Schema for history analysis result
 */
export const HistoryAnalysisResultSchema = z
  .object({
    timeRange: z.object({
      startDate: z.date(),
      endDate: z.date(),
    }),
    totalOperations: z.number().int().min(0),
    operationBreakdown: z.record(z.string(), z.number().int().min(0)),
    userActivity: z.array(
      z.object({
        userId: z.string(),
        userName: z.string().nullable(),
        operationCount: z.number().int().min(0),
        mostCommonOperation: z.string(),
        lastActivity: z.date(),
      })
    ),
    botActivity: z.array(
      z.object({
        botId: z.string(),
        botName: z.string(),
        operationCount: z.number().int().min(0),
        mostActiveSlot: z.string(),
        lastModified: z.date(),
      })
    ),
    trends: z.object({
      dailyOperations: z.array(
        z.object({
          date: z.date(),
          operationCount: z.number().int().min(0),
          operationTypes: z.record(z.string(), z.number().int().min(0)),
        })
      ),
      popularSlots: z.array(
        z.object({
          slotId: z.string(),
          operationCount: z.number().int().min(0),
          operationTypes: z.record(z.string(), z.number().int().min(0)),
        })
      ),
      operationPatterns: z.array(
        z.object({
          pattern: z.string(),
          frequency: z.number().int().min(0),
          confidence: z.number().min(0).max(1),
        })
      ),
    }),
    performance: z.object({
      averageOperationsPerDay: z.number(),
      peakOperationTime: z.string().optional(),
      mostActiveUser: z.string().optional(),
      mostModifiedBot: z.string().optional(),
      operationSuccessRate: z.number().min(0).max(1),
    }),
    recommendations: z.array(
      z.object({
        type: z.enum([
          "optimization",
          "user_training",
          "system_improvement",
          "performance_enhancement",
        ]),
        description: z.string(),
        priority: z.enum(["low", "medium", "high"]),
        estimatedImpact: z.number().min(0).max(1),
      })
    ),
  })
  .strict();

export type HistoryAnalysisResult = z.infer<typeof HistoryAnalysisResultSchema>;

/**
 * Schema for history audit result
 */
export const HistoryAuditResultSchema = z
  .object({
    auditId: z.string(),
    auditType: z.string(),
    auditDate: z.date(),
    timeRange: z
      .object({
        startDate: z.date(),
        endDate: z.date(),
      })
      .optional(),
    summary: z.object({
      totalRecords: z.number().int().min(0),
      validRecords: z.number().int().min(0),
      invalidRecords: z.number().int().min(0),
      suspiciousRecords: z.number().int().min(0),
      dataIntegrityScore: z.number().min(0).max(1),
    }),
    findings: z.array(
      z.object({
        type: z.enum([
          "data_integrity",
          "performance_issue",
          "unusual_activity",
          "error_pattern",
          "security_concern",
        ]),
        severity: z.enum(["low", "medium", "high", "critical"]),
        description: z.string(),
        affectedRecords: z.array(z.string()),
        recommendedAction: z.string(),
        evidence: z.record(z.string(), z.unknown()).optional(),
      })
    ),
    metrics: z.object({
      operationFrequency: z.record(z.string(), z.number().int().min(0)),
      userActivityDistribution: z.record(z.string(), z.number().int().min(0)),
      botModificationFrequency: z.record(z.string(), z.number().int().min(0)),
      timeDistribution: z.record(z.string(), z.number().int().min(0)),
      errorRate: z.number().min(0).max(1),
    }),
    recommendations: z.array(
      z.object({
        category: z.enum([
          "data_quality",
          "security",
          "performance",
          "user_experience",
          "system_maintenance",
        ]),
        description: z.string(),
        priority: z.enum(["low", "medium", "high", "urgent"]),
        estimatedEffort: z.enum([
          "minimal",
          "moderate",
          "significant",
          "major",
        ]),
        expectedBenefit: z.string(),
      })
    ),
    nextAuditRecommendation: z.date().optional(),
  })
  .strict();

export type HistoryAuditResult = z.infer<typeof HistoryAuditResultSchema>;

/**
 * Schema for operation timeline
 */
export const OperationTimelineSchema = z
  .object({
    botId: z.string(),
    botName: z.string(),
    timelineEvents: z.array(
      z.object({
        id: z.string(),
        timestamp: z.date(),
        operation: z.string(),
        slotId: z.string(),
        partId: z.string().nullable(),
        description: z.string(),
        performedBy: z.object({
          userId: z.string(),
          userName: z.string().nullable(),
        }),
        impact: z
          .object({
            performanceChange: z.number().optional(),
            utilizationChange: z.number().optional(),
            balanceChange: z.number().optional(),
          })
          .optional(),
        metadata: z.record(z.string(), z.unknown()).optional(),
      })
    ),
    summary: z.object({
      totalOperations: z.number().int().min(0),
      timeSpan: z.object({
        startDate: z.date(),
        endDate: z.date(),
        durationDays: z.number().min(0),
      }),
      operationTypes: z.record(z.string(), z.number().int().min(0)),
      mostActiveUser: z.string().optional(),
      configurationsCount: z.number().int().min(0),
    }),
  })
  .strict();

export type OperationTimeline = z.infer<typeof OperationTimelineSchema>;

// ============================================================================
// ADMIN SCHEMAS
// ============================================================================

/**
 * Schema for admin history management
 */
export const AdminHistoryManagementSchema = z
  .object({
    action: z.enum([
      "cleanup_old_records",
      "export_history",
      "analyze_patterns",
      "validate_integrity",
      "archive_records",
      "generate_report",
      "optimize_storage",
    ]),
    filters: z
      .object({
        olderThan: z.coerce.date().optional(),
        botId: z.string().optional(),
        userId: z.string().optional(),
        operation: SlotAssignmentOperationSchema.optional(),
      })
      .optional(),
    cleanupOptions: z
      .object({
        retentionDays: z.number().int().min(1).default(365),
        preserveImportantOperations: z.boolean().default(true),
        createArchive: z.boolean().default(true),
        batchSize: z.number().int().min(1).max(10000).default(1000),
      })
      .optional(),
    exportOptions: z
      .object({
        format: z.enum(["json", "csv", "xml"]).default("json"),
        includeMetadata: z.boolean().default(true),
        includeStates: z.boolean().default(false),
        dateRange: z
          .object({
            startDate: z.coerce.date(),
            endDate: z.coerce.date(),
          })
          .optional(),
      })
      .optional(),
    analysisOptions: z
      .object({
        analyzeUserPatterns: z.boolean().default(true),
        analyzeBotPatterns: z.boolean().default(true),
        analyzePerformance: z.boolean().default(true),
        generatePredictions: z.boolean().default(false),
      })
      .optional(),
  })
  .strict();

export type AdminHistoryManagement = z.infer<
  typeof AdminHistoryManagementSchema
>;

/**
 * Schema for history statistics
 */
export const HistoryStatsSchema = z
  .object({
    totalRecords: z.number().int().min(0),
    recordsByOperation: z.record(z.string(), z.number().int().min(0)),
    recordsByPeriod: z.object({
      last24Hours: z.number().int().min(0),
      last7Days: z.number().int().min(0),
      last30Days: z.number().int().min(0),
      last12Months: z.number().int().min(0),
    }),
    userActivity: z.object({
      totalActiveUsers: z.number().int().min(0),
      mostActiveUser: z
        .object({
          userId: z.string(),
          userName: z.string().nullable(),
          operationCount: z.number().int().min(0),
        })
        .optional(),
      averageOperationsPerUser: z.number(),
      userActivityDistribution: z.record(z.string(), z.number().int().min(0)),
    }),
    botActivity: z.object({
      totalActiveBots: z.number().int().min(0),
      mostModifiedBot: z
        .object({
          botId: z.string(),
          botName: z.string(),
          modificationCount: z.number().int().min(0),
        })
        .optional(),
      averageModificationsPerBot: z.number(),
      botActivityDistribution: z.record(z.string(), z.number().int().min(0)),
    }),
    operationPatterns: z.object({
      peakOperationHours: z.array(z.number().int().min(0).max(23)),
      operationTrends: z.array(
        z.object({
          date: z.date(),
          operationCount: z.number().int().min(0),
        })
      ),
      commonOperationSequences: z.array(
        z.object({
          sequence: z.array(z.string()),
          frequency: z.number().int().min(0),
        })
      ),
    }),
    dataQuality: z.object({
      recordsWithMetadata: z.number().int().min(0),
      recordsWithStates: z.number().int().min(0),
      incompleteRecords: z.number().int().min(0),
      dataIntegrityScore: z.number().min(0).max(1),
    }),
    performance: z.object({
      averageOperationComplexity: z.number(),
      operationSuccessRate: z.number().min(0).max(1),
      systemPerformanceImpact: z.number().min(0).max(1),
      storageUtilization: z.object({
        totalSizeBytes: z.number().int().min(0),
        averageRecordSize: z.number(),
        compressionRatio: z.number().optional(),
      }),
    }),
  })
  .strict();

export type HistoryStats = z.infer<typeof HistoryStatsSchema>;

// ============================================================================
// EXPORTS
// ============================================================================

// All schemas are defined above and exported individually

// Export all validation functions
export const SlotAssignmentHistoryValidation = {
  // Base schemas
  model: SlotAssignmentHistorySchema,
  input: SlotAssignmentHistoryInputSchema,

  // CRUD schemas
  create: CreateSlotAssignmentHistorySchema,
  createApi: CreateSlotAssignmentHistoryApiSchema,
  update: UpdateSlotAssignmentHistorySchema,
  updateApi: UpdateSlotAssignmentHistoryApiSchema,
  partialUpdate: PartialUpdateSlotAssignmentHistorySchema,

  // History tracking schemas
  recordOperation: RecordAssignmentOperationSchema,
  recordBulkOperation: RecordBulkOperationSchema,
  recordConfigurationChange: RecordConfigurationChangeSchema,

  // Query schemas
  findUnique: FindUniqueSlotAssignmentHistorySchema,
  findMany: FindManySlotAssignmentHistoriesSchema,
  where: SlotAssignmentHistoryWhereSchema,
  orderBy: SlotAssignmentHistoryOrderBySchema,
  select: SlotAssignmentHistorySelectSchema,
  include: SlotAssignmentHistoryIncludeSchema,

  // Helpers
  analyze: AnalyzeSlotAssignmentHistorySchema,
  search: SearchSlotAssignmentHistorySchema,
  audit: AuditSlotAssignmentHistorySchema,

  // Response schemas
  response: SlotAssignmentHistoryResponseSchema,
  withRelations: SlotAssignmentHistoryWithRelationsSchema,
  summary: SlotAssignmentHistorySummarySchema,
  analysisResult: HistoryAnalysisResultSchema,
  auditResult: HistoryAuditResultSchema,
  timeline: OperationTimelineSchema,

  // Admin schemas
  adminManagement: AdminHistoryManagementSchema,
  stats: HistoryStatsSchema,

  // Enum schemas
  operation: SlotAssignmentOperationSchema,
  slotIdentifier: HistorySlotIdentifierSchema,
} as const;
