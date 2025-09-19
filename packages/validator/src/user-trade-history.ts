import { z } from "zod";

// ============================================================================
// USER TRADE HISTORY METADATA SCHEMAS
// ============================================================================

/**
 * Schema for trade item snapshot - what was given or received
 */
export const TradeItemSnapshotSchema = z.object({
  itemId: z.string(),
  itemName: z.string(),
  itemType: z.enum(["REQUIRED", "REWARD"]),
  quantity: z.number().int().min(1),
  itemCategory: z.string().optional(),
  itemRarity: z.string().optional(),
  itemValue: z.number().min(0).optional(),
  estimatedMarketValue: z.number().min(0).optional(),
  itemMetadata: z.record(z.string(), z.unknown()).optional(),
});

export type TradeItemSnapshot = z.infer<typeof TradeItemSnapshotSchema>;

/**
 * Schema for user trade history analytics and insights
 */
export const UserTradeHistoryAnalyticsSchema = z.object({
  trading: z
    .object({
      totalTrades: z.number().int().min(0).default(0),
      totalValue: z.number().min(0).default(0),
      averageTradeValue: z.number().min(0).default(0),
      tradingFrequency: z.number().min(0).default(0), // trades per day
      tradingVelocity: z.number().min(0).default(0), // trades per hour during active periods
      preferredTradingTimes: z
        .array(z.number().int().min(0).max(23))
        .optional(),
    })
    .optional(),
  behavior: z
    .object({
      favoriteTradingEvents: z.array(z.string()).optional(),
      preferredOfferTypes: z.array(z.string()).optional(),
      tradingPatterns: z.record(z.string(), z.number()).optional(),
      riskProfile: z
        .enum(["conservative", "moderate", "aggressive"])
        .optional(),
      tradingConsistency: z.number().min(0).max(1).default(0),
      engagementLevel: z.enum(["low", "medium", "high"]).optional(),
    })
    .optional(),
  items: z
    .object({
      mostGivenItems: z
        .array(
          z.object({
            itemId: z.string(),
            itemName: z.string(),
            totalQuantity: z.number().int().min(0),
            tradeCount: z.number().int().min(0),
          })
        )
        .optional(),
      mostReceivedItems: z
        .array(
          z.object({
            itemId: z.string(),
            itemName: z.string(),
            totalQuantity: z.number().int().min(0),
            tradeCount: z.number().int().min(0),
          })
        )
        .optional(),
      netItemFlow: z.record(z.string(), z.number().int()).optional(), // positive = net received
      itemPreferences: z.record(z.string(), z.number()).optional(),
    })
    .optional(),
  progression: z
    .object({
      levelProgression: z
        .array(
          z.object({
            level: z.number().int().min(1),
            tradesAtLevel: z.number().int().min(0),
            averageTradeValue: z.number().min(0),
          })
        )
        .optional(),
      experienceGained: z.number().min(0).default(0),
      tradingSkillImprovement: z.number().min(0).max(1).default(0),
      learningCurve: z.enum(["steep", "moderate", "flat"]).optional(),
    })
    .optional(),
  performance: z
    .object({
      successRate: z.number().min(0).max(1).default(0),
      satisfactionScore: z.number().min(0).max(5).default(0),
      repeatTradeRate: z.number().min(0).max(1).default(0),
      tradingEfficiency: z.number().min(0).max(1).default(0),
      portfolioPerformance: z.number().default(0), // Can be negative
    })
    .optional(),
  social: z
    .object({
      tradingPartners: z.number().int().min(0).default(0),
      communityRank: z.number().int().min(1).optional(),
      reputationScore: z.number().min(0).max(1).default(0),
      tradingInfluence: z.number().min(0).max(1).default(0),
      networkEffect: z.number().min(0).max(1).default(0),
    })
    .optional(),
});

export type UserTradeHistoryAnalytics = z.infer<
  typeof UserTradeHistoryAnalyticsSchema
>;

/**
 * Schema for trade history metadata and context
 */
export const TradeHistoryMetadataSchema = z.object({
  transaction: z
    .object({
      transactionId: z.string().optional(),
      sessionId: z.string().optional(),
      clientVersion: z.string().optional(),
      platformInfo: z.string().optional(),
      locationInfo: z.string().optional(),
      deviceInfo: z.string().optional(),
    })
    .optional(),
  timing: z
    .object({
      processingTime: z.number().min(0).optional(), // milliseconds
      queueTime: z.number().min(0).optional(), // milliseconds
      validationTime: z.number().min(0).optional(), // milliseconds
      executionTime: z.number().min(0).optional(), // milliseconds
      timeZone: z.string().optional(),
    })
    .optional(),
  validation: z
    .object({
      checksPerformed: z.array(z.string()).optional(),
      warningsIssued: z.array(z.string()).optional(),
      verificationMethods: z.array(z.string()).optional(),
      securityLevel: z.enum(["low", "medium", "high"]).optional(),
    })
    .optional(),
  context: z
    .object({
      tradingReason: z.string().optional(),
      userComment: z.string().max(500).optional(),
      referrerSource: z.string().optional(),
      campaignId: z.string().optional(),
      abTestVariant: z.string().optional(),
      userExperiment: z.string().optional(),
    })
    .optional(),
  economics: z
    .object({
      marketConditions: z.record(z.string(), z.unknown()).optional(),
      priceImpact: z.number().optional(),
      marketVolume: z.number().min(0).optional(),
      liquidityScore: z.number().min(0).max(1).optional(),
      economicIndicators: z.record(z.string(), z.number()).optional(),
    })
    .optional(),
  support: z
    .object({
      supportTickets: z.array(z.string()).optional(),
      disputeStatus: z
        .enum(["none", "pending", "resolved", "escalated"])
        .optional(),
      qualityScore: z.number().min(0).max(1).optional(),
      satisfactionRating: z.number().min(1).max(5).optional(),
      followUpRequired: z.boolean().default(false),
    })
    .optional(),
});

export type TradeHistoryMetadata = z.infer<typeof TradeHistoryMetadataSchema>;

// ============================================================================
// BASE SCHEMAS
// ============================================================================

/**
 * Base UserTradeHistory model schema - represents the complete UserTradeHistory entity
 */
export const UserTradeHistorySchema = z
  .object({
    id: z.string(),
    userId: z.string(),
    tradingEventId: z.string(),
    tradeOfferId: z.string(),
    executedAt: z.date(),
    itemsGiven: z.unknown(), // JSON field
    itemsReceived: z.unknown(), // JSON field
    userLevel: z.number().int().nullable(),
    metadata: z.unknown().nullable(), // JSON field
  })
  .strict();

export type UserTradeHistory = z.infer<typeof UserTradeHistorySchema>;

/**
 * UserTradeHistory input schema for forms and API inputs (without auto-generated fields)
 */
export const UserTradeHistoryInputSchema = z
  .object({
    userId: z.string().min(1, "User ID is required"),
    tradingEventId: z.string().min(1, "Trading event ID is required"),
    tradeOfferId: z.string().min(1, "Trade offer ID is required"),
    executedAt: z.coerce.date().optional(),
    itemsGiven: z
      .array(TradeItemSnapshotSchema)
      .min(1, "At least one given item is required"),
    itemsReceived: z
      .array(TradeItemSnapshotSchema)
      .min(1, "At least one received item is required"),
    userLevel: z
      .number()
      .int()
      .min(1, "User level must be at least 1")
      .max(1000, "User level too high")
      .nullable()
      .optional(),
    metadata: TradeHistoryMetadataSchema.nullable().optional(),
  })
  .strict()
  .refine(
    (data) => {
      // Ensure items given and received have different types
      const givenTypes = data.itemsGiven.map((item) => item.itemType);
      const receivedTypes = data.itemsReceived.map((item) => item.itemType);

      // Given items should typically be REQUIRED, received should be REWARD
      const hasProperGivenTypes = givenTypes.every(
        (type) => type === "REQUIRED"
      );
      const hasProperReceivedTypes = receivedTypes.every(
        (type) => type === "REWARD"
      );

      return hasProperGivenTypes && hasProperReceivedTypes;
    },
    {
      message:
        "Given items should be REQUIRED type, received items should be REWARD type",
      path: ["itemsGiven"],
    }
  )
  .refine(
    (data) => {
      // Validate total value balance (basic sanity check)
      const givenValue = data.itemsGiven.reduce(
        (sum, item) => sum + (item.itemValue || 0) * item.quantity,
        0
      );
      const receivedValue = data.itemsReceived.reduce(
        (sum, item) => sum + (item.itemValue || 0) * item.quantity,
        0
      );

      // Allow some imbalance but flag extreme cases
      if (givenValue > 0 && receivedValue > 0) {
        const ratio =
          Math.max(givenValue, receivedValue) /
          Math.min(givenValue, receivedValue);
        return ratio <= 10; // Max 10:1 ratio
      }

      return true;
    },
    {
      message: "Trade value appears severely imbalanced",
      path: ["itemsReceived"],
    }
  );

export type UserTradeHistoryInput = z.infer<typeof UserTradeHistoryInputSchema>;

// ============================================================================
// CREATE SCHEMAS
// ============================================================================

/**
 * Schema for creating a new UserTradeHistory record
 * Compatible with Prisma UserTradeHistoryCreateInput
 */
export const CreateUserTradeHistorySchema = z
  .object({
    id: z.string().optional(),
    userId: z.string().min(1, "User ID is required"),
    tradingEventId: z.string().min(1, "Trading event ID is required"),
    tradeOfferId: z.string().min(1, "Trade offer ID is required"),
    executedAt: z.coerce.date().optional(),
    itemsGiven: z
      .array(TradeItemSnapshotSchema)
      .min(1, "At least one given item is required"),
    itemsReceived: z
      .array(TradeItemSnapshotSchema)
      .min(1, "At least one received item is required"),
    userLevel: z
      .number()
      .int()
      .min(1, "User level must be at least 1")
      .max(1000, "User level too high")
      .nullable()
      .optional(),
    metadata: TradeHistoryMetadataSchema.nullable().optional(),
  })
  .strict();

export type CreateUserTradeHistoryInput = z.infer<
  typeof CreateUserTradeHistorySchema
>;

/**
 * Simplified create schema for API endpoints with trade execution
 */
export const ExecuteTradeSchema = z
  .object({
    userId: z.string().min(1, "User ID is required"),
    tradeOfferId: z.string().min(1, "Trade offer ID is required"),
    quantity: z.number().int().min(1).default(1),
    execution: z
      .object({
        validateInventory: z.boolean().default(true),
        validateLimits: z.boolean().default(true),
        validateAvailability: z.boolean().default(true),
        validateTiming: z.boolean().default(true),
        dryRun: z.boolean().default(false), // Don't actually execute
        forceExecution: z.boolean().default(false), // Skip some validations
      })
      .optional(),
    context: z
      .object({
        clientVersion: z.string().optional(),
        platform: z.string().optional(),
        location: z.string().optional(),
        referrer: z.string().optional(),
        campaignId: z.string().optional(),
        userComment: z.string().max(500).optional(),
        tradingReason: z
          .enum([
            "progression",
            "collection",
            "investment",
            "social",
            "experiment",
            "other",
          ])
          .optional(),
      })
      .optional(),
    preferences: z
      .object({
        notifyOnCompletion: z.boolean().default(true),
        trackAnalytics: z.boolean().default(true),
        shareWithFriends: z.boolean().default(false),
        recordDemographic: z.boolean().default(true),
      })
      .optional(),
    validation: z
      .object({
        requireConfirmation: z.boolean().default(false),
        skipDuplicateCheck: z.boolean().default(false),
        allowPartialExecution: z.boolean().default(false),
        timeoutSeconds: z.number().int().min(1).max(300).default(30),
      })
      .optional(),
  })
  .strict();

export type ExecuteTrade = z.infer<typeof ExecuteTradeSchema>;

/**
 * Schema for bulk trade history creation (for data migration or batch processing)
 */
export const BulkCreateTradeHistorySchema = z
  .object({
    trades: z
      .array(CreateUserTradeHistorySchema)
      .min(1, "At least one trade is required")
      .max(1000, "Too many trades for bulk creation"),
    options: z
      .object({
        validateEach: z.boolean().default(true),
        stopOnError: z.boolean().default(false),
        skipDuplicates: z.boolean().default(true),
        preserveTimestamps: z.boolean().default(true),
        updateAnalytics: z.boolean().default(true),
      })
      .optional(),
    migration: z
      .object({
        sourceSystem: z.string().optional(),
        migrationId: z.string().optional(),
        dataVersion: z.string().optional(),
        preserveIds: z.boolean().default(false),
      })
      .optional(),
    validation: z
      .object({
        requireUniqueUsers: z.boolean().default(false),
        requireValidEvents: z.boolean().default(true),
        requireValidOffers: z.boolean().default(true),
        allowFutureDates: z.boolean().default(false),
      })
      .optional(),
    recordActivity: z.boolean().default(true),
    operationNotes: z.string().max(500).optional(),
  })
  .strict();

export type BulkCreateTradeHistory = z.infer<
  typeof BulkCreateTradeHistorySchema
>;

// ============================================================================
// UPDATE SCHEMAS
// ============================================================================

/**
 * Schema for updating a UserTradeHistory record
 * Compatible with Prisma UserTradeHistoryUpdateInput
 */
export const UpdateUserTradeHistorySchema = z
  .object({
    id: z.string().optional(),
    userId: z.string().min(1, "User ID is required").optional(),
    tradingEventId: z
      .string()
      .min(1, "Trading event ID is required")
      .optional(),
    tradeOfferId: z.string().min(1, "Trade offer ID is required").optional(),
    executedAt: z.coerce.date().optional(),
    itemsGiven: z
      .array(TradeItemSnapshotSchema)
      .min(1, "At least one given item is required")
      .optional(),
    itemsReceived: z
      .array(TradeItemSnapshotSchema)
      .min(1, "At least one received item is required")
      .optional(),
    userLevel: z
      .number()
      .int()
      .min(1, "User level must be at least 1")
      .max(1000, "User level too high")
      .nullable()
      .optional(),
    metadata: TradeHistoryMetadataSchema.nullable().optional(),
  })
  .strict();

export type UpdateUserTradeHistoryInput = z.infer<
  typeof UpdateUserTradeHistorySchema
>;

/**
 * Schema for updating trade metadata
 */
export const UpdateTradeMetadataSchema = z
  .object({
    tradeId: z.string().min(1, "Trade ID is required"),
    metadata: z
      .object({
        supportTickets: z.array(z.string()).optional(),
        disputeStatus: z
          .enum(["none", "pending", "resolved", "escalated"])
          .optional(),
        qualityScore: z.number().min(0).max(1).optional(),
        satisfactionRating: z.number().min(1).max(5).optional(),
        followUpRequired: z.boolean().optional(),
        userFeedback: z.string().max(1000).optional(),
        adminNotes: z.string().max(1000).optional(),
        resolutionDetails: z.string().max(2000).optional(),
      })
      .strict(),
    reason: z
      .enum([
        "dispute_resolution",
        "quality_update",
        "support_case",
        "data_correction",
        "audit_update",
        "user_feedback",
        "admin_action",
      ])
      .optional(),
    updateBy: z.string().min(1, "Updater ID is required").optional(),
    recordActivity: z.boolean().default(true),
    updateNotes: z.string().max(500).optional(),
  })
  .strict();

export type UpdateTradeMetadata = z.infer<typeof UpdateTradeMetadataSchema>;

/**
 * Partial update schema - all fields optional
 */
export const PartialUpdateUserTradeHistorySchema =
  UserTradeHistoryInputSchema.partial();

export type PartialUpdateUserTradeHistory = z.infer<
  typeof PartialUpdateUserTradeHistorySchema
>;

// ============================================================================
// TRADE HISTORY MANAGEMENT SCHEMAS
// ============================================================================

/**
 * Schema for analyzing user trading patterns
 */
export const AnalyzeUserTradingPatternsSchema = z
  .object({
    userId: z.string().min(1, "User ID is required"),
    analysisType: z
      .enum([
        "trading_behavior",
        "item_preferences",
        "economic_impact",
        "social_patterns",
        "progression_analysis",
        "risk_assessment",
        "all",
      ])
      .default("all"),
    timeRange: z
      .object({
        startDate: z.coerce.date(),
        endDate: z.coerce.date(),
      })
      .refine((data) => data.endDate > data.startDate, {
        message: "End date must be after start date",
        path: ["endDate"],
      })
      .optional(),
    filters: z
      .object({
        eventIds: z.array(z.string()).optional(),
        offerIds: z.array(z.string()).optional(),
        minTradeValue: z.number().min(0).optional(),
        maxTradeValue: z.number().min(0).optional(),
        itemCategories: z.array(z.string()).optional(),
        levelRange: z
          .object({
            minLevel: z.number().int().min(1),
            maxLevel: z.number().int().min(1),
          })
          .optional(),
      })
      .optional(),
    options: z
      .object({
        includeComparisons: z.boolean().default(true),
        includePredictions: z.boolean().default(false),
        includeRecommendations: z.boolean().default(true),
        includeAnomalies: z.boolean().default(true),
        granularity: z
          .enum(["hourly", "daily", "weekly", "monthly"])
          .default("daily"),
      })
      .optional(),
    reportFormat: z.enum(["json", "csv", "pdf"]).default("json"),
  })
  .strict();

export type AnalyzeUserTradingPatterns = z.infer<
  typeof AnalyzeUserTradingPatternsSchema
>;

/**
 * Schema for generating trade reports
 */
export const GenerateTradeReportSchema = z
  .object({
    reportType: z.enum([
      "user_summary",
      "event_summary",
      "offer_performance",
      "economic_impact",
      "fraud_detection",
      "compliance_audit",
      "trend_analysis",
      "custom",
    ]),
    scope: z
      .object({
        userIds: z.array(z.string()).optional(),
        eventIds: z.array(z.string()).optional(),
        offerIds: z.array(z.string()).optional(),
        timeRange: z
          .object({
            startDate: z.coerce.date(),
            endDate: z.coerce.date(),
          })
          .optional(),
        filters: z.record(z.string(), z.unknown()).optional(),
      })
      .optional(),
    options: z
      .object({
        includeDetails: z.boolean().default(true),
        includeAnalytics: z.boolean().default(true),
        includeCharts: z.boolean().default(false),
        includeRecommendations: z.boolean().default(true),
        anonymizeData: z.boolean().default(false),
        aggregationLevel: z
          .enum(["individual", "group", "summary"])
          .default("summary"),
      })
      .optional(),
    customFields: z.array(z.string()).optional(),
    outputFormat: z.enum(["json", "csv", "xlsx", "pdf"]).default("json"),
    deliveryMethod: z
      .enum(["immediate", "email", "download", "api"])
      .default("immediate"),
    recipientEmail: z.string().email().optional(),
  })
  .strict();

export type GenerateTradeReport = z.infer<typeof GenerateTradeReportSchema>;

/**
 * Schema for bulk trade history operations
 */
export const BulkTradeHistoryOperationSchema = z
  .object({
    operation: z.enum([
      "export_data",
      "update_metadata",
      "recalculate_analytics",
      "data_cleanup",
      "dispute_resolution",
      "audit_trades",
      "migrate_data",
      "archive_old_trades",
    ]),
    scope: z
      .object({
        tradeIds: z.array(z.string()).optional(),
        userIds: z.array(z.string()).optional(),
        eventIds: z.array(z.string()).optional(),
        dateRange: z
          .object({
            startDate: z.coerce.date(),
            endDate: z.coerce.date(),
          })
          .optional(),
        filters: z.record(z.string(), z.unknown()).optional(),
      })
      .optional(),
    operationData: z
      .object({
        metadataUpdates: z.record(z.string(), z.unknown()).optional(),
        archiveLocation: z.string().optional(),
        auditCriteria: z.record(z.string(), z.unknown()).optional(),
        migrationSettings: z.record(z.string(), z.unknown()).optional(),
      })
      .optional(),
    options: z
      .object({
        validateEach: z.boolean().default(true),
        stopOnError: z.boolean().default(false),
        createBackups: z.boolean().default(true),
        notifyUsers: z.boolean().default(false),
        recordActivity: z.boolean().default(true),
        dryRun: z.boolean().default(false),
      })
      .optional(),
    operationNotes: z.string().max(1000).optional(),
  })
  .strict();

export type BulkTradeHistoryOperation = z.infer<
  typeof BulkTradeHistoryOperationSchema
>;

/**
 * Schema for trade fraud detection
 */
export const DetectTradeFraudSchema = z
  .object({
    scope: z
      .object({
        userId: z.string().optional(),
        tradeId: z.string().optional(),
        timeRange: z
          .object({
            startDate: z.coerce.date(),
            endDate: z.coerce.date(),
          })
          .optional(),
        suspiciousPatterns: z.array(z.string()).optional(),
      })
      .optional(),
    detectionRules: z
      .object({
        velocityThreshold: z.number().min(0).default(10), // trades per hour
        valueThreshold: z.number().min(0).default(10000), // suspicious value
        repetitionThreshold: z.number().int().min(1).default(5), // same trade repeat
        anomalyThreshold: z.number().min(0).max(1).default(0.95), // deviation score
        patternMatching: z.boolean().default(true),
        crossReferenceChecks: z.boolean().default(true),
      })
      .optional(),
    analysis: z
      .object({
        includeNetworkAnalysis: z.boolean().default(true),
        includeTimingAnalysis: z.boolean().default(true),
        includeValueAnalysis: z.boolean().default(true),
        includeBehaviorAnalysis: z.boolean().default(true),
        confidenceThreshold: z.number().min(0).max(1).default(0.7),
      })
      .optional(),
    reporting: z
      .object({
        generateReport: z.boolean().default(true),
        notifyAdmins: z.boolean().default(true),
        escalateHighRisk: z.boolean().default(true),
        reportFormat: z.enum(["json", "pdf"]).default("json"),
      })
      .optional(),
  })
  .strict();

export type DetectTradeFraud = z.infer<typeof DetectTradeFraudSchema>;

// ============================================================================
// QUERY SCHEMAS
// ============================================================================

/**
 * Schema for finding a unique UserTradeHistory
 */
export const FindUniqueUserTradeHistorySchema = z
  .object({
    id: z.string().optional(),
  })
  .strict();

export type FindUniqueUserTradeHistoryInput = z.infer<
  typeof FindUniqueUserTradeHistorySchema
>;

/**
 * Schema for filtering UserTradeHistory records
 */
export const UserTradeHistoryWhereSchema: z.ZodType<any> = z.lazy(() =>
  z
    .object({
      id: z.string().optional(),
      userId: z.string().optional(),
      tradingEventId: z.string().optional(),
      tradeOfferId: z.string().optional(),
      executedAt: z.date().optional(),
      userLevel: z.number().int().nullable().optional(),
      AND: z.array(UserTradeHistoryWhereSchema).optional(),
      OR: z.array(UserTradeHistoryWhereSchema).optional(),
      NOT: UserTradeHistoryWhereSchema.optional(),
    })
    .strict()
);

export type UserTradeHistoryWhere = z.infer<typeof UserTradeHistoryWhereSchema>;

/**
 * Schema for ordering UserTradeHistory records
 */
export const UserTradeHistoryOrderBySchema = z
  .object({
    id: z.enum(["asc", "desc"]).optional(),
    userId: z.enum(["asc", "desc"]).optional(),
    tradingEventId: z.enum(["asc", "desc"]).optional(),
    tradeOfferId: z.enum(["asc", "desc"]).optional(),
    executedAt: z.enum(["asc", "desc"]).optional(),
    userLevel: z.enum(["asc", "desc"]).optional(),
  })
  .strict();

export type UserTradeHistoryOrderBy = z.infer<
  typeof UserTradeHistoryOrderBySchema
>;

/**
 * Schema for selecting UserTradeHistory fields
 */
export const UserTradeHistorySelectSchema = z
  .object({
    id: z.boolean().optional(),
    userId: z.boolean().optional(),
    tradingEventId: z.boolean().optional(),
    tradeOfferId: z.boolean().optional(),
    executedAt: z.boolean().optional(),
    itemsGiven: z.boolean().optional(),
    itemsReceived: z.boolean().optional(),
    userLevel: z.boolean().optional(),
    metadata: z.boolean().optional(),
    user: z.boolean().optional(),
    tradingEvent: z.boolean().optional(),
    tradeOffer: z.boolean().optional(),
  })
  .strict();

export type UserTradeHistorySelect = z.infer<
  typeof UserTradeHistorySelectSchema
>;

/**
 * Schema for including UserTradeHistory relations
 */
export const UserTradeHistoryIncludeSchema = z
  .object({
    user: z.boolean().optional(),
    tradingEvent: z.boolean().optional(),
    tradeOffer: z.boolean().optional(),
  })
  .strict();

export type UserTradeHistoryInclude = z.infer<
  typeof UserTradeHistoryIncludeSchema
>;

// ============================================================================
// PAGINATION SCHEMAS
// ============================================================================

/**
 * Schema for paginated UserTradeHistory queries
 */
export const FindManyUserTradeHistoriesSchema = z
  .object({
    where: UserTradeHistoryWhereSchema.optional(),
    orderBy: z
      .union([
        UserTradeHistoryOrderBySchema,
        z.array(UserTradeHistoryOrderBySchema),
      ])
      .optional(),
    select: UserTradeHistorySelectSchema.optional(),
    include: UserTradeHistoryIncludeSchema.optional(),
    skip: z.number().int().min(0).optional(),
    take: z.number().int().min(1).max(1000).optional(),
    cursor: FindUniqueUserTradeHistorySchema.optional(),
  })
  .strict();

export type FindManyUserTradeHistoriesInput = z.infer<
  typeof FindManyUserTradeHistoriesSchema
>;

// ============================================================================
// VALIDATION HELPERS
// ============================================================================

/**
 * Schema for searching user trade histories
 */
export const SearchUserTradeHistoriesSchema = z
  .object({
    query: z.string().max(200).optional(),
    userId: z.string().optional(),
    eventId: z.string().optional(),
    offerId: z.string().optional(),
    executedAfter: z.coerce.date().optional(),
    executedBefore: z.coerce.date().optional(),
    minUserLevel: z.number().int().min(1).optional(),
    maxUserLevel: z.number().int().min(1).optional(),
    minTradeValue: z.number().min(0).optional(),
    maxTradeValue: z.number().min(0).optional(),
    itemsInvolved: z.array(z.string()).optional(),
    hasDispute: z.boolean().optional(),
    hasSupport: z.boolean().optional(),
    qualityScore: z
      .object({
        min: z.number().min(0).max(1),
        max: z.number().min(0).max(1),
      })
      .optional(),
    includeAnalytics: z.boolean().default(false),
    includeRelations: z.boolean().default(false),
    includeMetadata: z.boolean().default(false),
    sortBy: z
      .enum([
        "executed_date",
        "trade_value",
        "user_level",
        "quality_score",
        "items_count",
        "relevance",
      ])
      .default("executed_date"),
    sortOrder: z.enum(["asc", "desc"]).default("desc"),
    limit: z.number().int().min(1).max(100).default(20),
  })
  .strict();

export type SearchUserTradeHistories = z.infer<
  typeof SearchUserTradeHistoriesSchema
>;

/**
 * Schema for validating trade execution eligibility
 */
export const ValidateTradeEligibilitySchema = z
  .object({
    userId: z.string().min(1, "User ID is required"),
    tradeOfferId: z.string().min(1, "Trade offer ID is required"),
    quantity: z.number().int().min(1).default(1),
    validations: z
      .object({
        checkInventory: z.boolean().default(true),
        checkUserLimits: z.boolean().default(true),
        checkOfferAvailability: z.boolean().default(true),
        checkEventStatus: z.boolean().default(true),
        checkUserLevel: z.boolean().default(true),
        checkCooldowns: z.boolean().default(true),
        checkBlacklist: z.boolean().default(true),
      })
      .optional(),
    context: z
      .object({
        skipCooldowns: z.boolean().default(false),
        adminOverride: z.boolean().default(false),
        testMode: z.boolean().default(false),
        simulationMode: z.boolean().default(false),
      })
      .optional(),
    includeReasons: z.boolean().default(true),
    includeAlternatives: z.boolean().default(false),
  })
  .strict();

export type ValidateTradeEligibility = z.infer<
  typeof ValidateTradeEligibilitySchema
>;

/**
 * Schema for getting user trade statistics
 */
export const GetUserTradeStatsSchema = z
  .object({
    userId: z.string().min(1, "User ID is required"),
    timeRange: z
      .object({
        startDate: z.coerce.date(),
        endDate: z.coerce.date(),
      })
      .optional(),
    metrics: z
      .array(
        z.enum([
          "total_trades",
          "total_value",
          "average_value",
          "trading_frequency",
          "success_rate",
          "satisfaction_score",
          "progression_rate",
          "social_score",
        ])
      )
      .optional(),
    segmentation: z
      .object({
        byEvent: z.boolean().default(false),
        byOffer: z.boolean().default(false),
        byLevel: z.boolean().default(false),
        byTimeOfDay: z.boolean().default(false),
        byDayOfWeek: z.boolean().default(false),
      })
      .optional(),
    comparison: z
      .object({
        compareToAverage: z.boolean().default(false),
        compareToLevel: z.boolean().default(false),
        compareToRegion: z.boolean().default(false),
        compareToPrevious: z.boolean().default(false),
      })
      .optional(),
    includeProjections: z.boolean().default(false),
    granularity: z
      .enum(["hourly", "daily", "weekly", "monthly"])
      .default("daily"),
  })
  .strict();

export type GetUserTradeStats = z.infer<typeof GetUserTradeStatsSchema>;

// ============================================================================
// RESPONSE SCHEMAS
// ============================================================================

/**
 * Schema for UserTradeHistory API responses
 */
export const UserTradeHistoryResponseSchema = UserTradeHistorySchema.safeExtend({
  itemsGiven: z.array(TradeItemSnapshotSchema),
  itemsReceived: z.array(TradeItemSnapshotSchema),
  metadata: TradeHistoryMetadataSchema.nullable(),
});

export type UserTradeHistoryResponse = z.infer<
  typeof UserTradeHistoryResponseSchema
>;

/**
 * Schema for UserTradeHistory with related data
 */
export const UserTradeHistoryWithRelationsSchema =
  UserTradeHistoryResponseSchema.safeExtend({
    user: z
      .object({
        id: z.string(),
        name: z.string().nullable(),
        email: z.string(),
        level: z.number().int().optional(),
      })
      .optional(),
    tradingEvent: z
      .object({
        id: z.string(),
        name: z.string(),
        status: z.string(),
        startDate: z.date().nullable(),
        endDate: z.date().nullable(),
      })
      .optional(),
    tradeOffer: z
      .object({
        id: z.string(),
        name: z.string(),
        status: z.string(),
        maxTotalTrades: z.number().int().nullable(),
        currentTrades: z.number().int(),
      })
      .optional(),
  });

export type UserTradeHistoryWithRelations = z.infer<
  typeof UserTradeHistoryWithRelationsSchema
>;

/**
 * Schema for UserTradeHistory summary (minimal info)
 */
export const UserTradeHistorySummarySchema = z
  .object({
    id: z.string(),
    userId: z.string(),
    userName: z.string().nullable(),
    tradingEventName: z.string(),
    tradeOfferName: z.string(),
    executedAt: z.date(),
    userLevel: z.number().int().nullable(),
    itemsGivenCount: z.number().int().min(0),
    itemsReceivedCount: z.number().int().min(0),
    estimatedTradeValue: z.number().min(0),
    tradeBalance: z.number(), // positive = user gained value
    qualityScore: z.number().min(0).max(1).nullable(),
    hasDispute: z.boolean(),
    hasSupport: z.boolean(),
  })
  .strict();

export type UserTradeHistorySummary = z.infer<
  typeof UserTradeHistorySummarySchema
>;

/**
 * Schema for trade execution result
 */
export const TradeExecutionResultSchema = z
  .object({
    tradeId: z.string(),
    userId: z.string(),
    offerId: z.string(),
    success: z.boolean(),
    executedAt: z.date(),
    transaction: z.object({
      itemsGiven: z.array(TradeItemSnapshotSchema),
      itemsReceived: z.array(TradeItemSnapshotSchema),
      netValue: z.number(),
      transactionId: z.string(),
    }),
    validation: z.object({
      passed: z.boolean(),
      warnings: z.array(z.string()).optional(),
      errors: z.array(z.string()).optional(),
      checksPerformed: z.array(z.string()),
    }),
    impact: z.object({
      userLevelChange: z.number().int().default(0),
      experienceGained: z.number().min(0).default(0),
      inventoryChanges: z.record(z.string(), z.number().int()),
      economicImpact: z.number().default(0),
    }),
    analytics: z.object({
      tradingStreak: z.number().int().min(0).default(0),
      totalTrades: z.number().int().min(1),
      totalValue: z.number().min(0),
      performanceScore: z.number().min(0).max(1).default(0),
    }),
    timing: z.object({
      processingTime: z.number().min(0), // milliseconds
      queueTime: z.number().min(0).optional(), // milliseconds
      executionTime: z.number().min(0), // milliseconds
    }),
    recommendations: z.array(z.string()).optional(),
    followUpActions: z.array(z.string()).optional(),
  })
  .strict();

export type TradeExecutionResult = z.infer<typeof TradeExecutionResultSchema>;

/**
 * Schema for user trading pattern analysis result
 */
export const UserTradingPatternAnalysisSchema = z
  .object({
    userId: z.string(),
    userName: z.string().nullable(),
    analysisDate: z.date(),
    timeRange: z.object({
      startDate: z.date(),
      endDate: z.date(),
    }),
    summary: z.object({
      totalTrades: z.number().int().min(0),
      totalValue: z.number().min(0),
      averageTradeValue: z.number().min(0),
      tradingDays: z.number().int().min(0),
      tradingFrequency: z.number().min(0), // trades per day
    }),
    behavior: z.object({
      tradingStyle: z.enum([
        "casual",
        "regular",
        "intensive",
        "strategic",
        "opportunistic",
      ]),
      riskProfile: z.enum(["conservative", "moderate", "aggressive"]),
      preferredTimes: z.array(z.number().int().min(0).max(23)),
      tradingConsistency: z.number().min(0).max(1),
      socialInfluence: z.number().min(0).max(1),
    }),
    items: z.object({
      mostTradedCategories: z.array(z.string()),
      favoriteItems: z.array(
        z.object({
          itemId: z.string(),
          itemName: z.string(),
          tradeCount: z.number().int().min(0),
        })
      ),
      tradingBalance: z.object({
        totalGiven: z.number().min(0),
        totalReceived: z.number().min(0),
        netBalance: z.number(),
      }),
    }),
    progression: z.object({
      levelProgression: z.array(
        z.object({
          level: z.number().int().min(1),
          tradesAtLevel: z.number().int().min(0),
          valueAtLevel: z.number().min(0),
        })
      ),
      skillImprovement: z.number().min(0).max(1),
      experienceGained: z.number().min(0),
      tradingEvolution: z.enum(["improving", "stable", "declining"]),
    }),
    performance: z.object({
      successRate: z.number().min(0).max(1),
      satisfactionScore: z.number().min(0).max(5),
      efficiencyScore: z.number().min(0).max(1),
      profitabilityScore: z.number().min(0).max(1),
      socialScore: z.number().min(0).max(1),
    }),
    insights: z.object({
      strengths: z.array(z.string()),
      weaknesses: z.array(z.string()),
      opportunities: z.array(z.string()),
      risks: z.array(z.string()),
    }),
    recommendations: z.array(
      z.object({
        category: z.enum([
          "trading_strategy",
          "item_selection",
          "timing_optimization",
          "risk_management",
          "social_engagement",
          "skill_development",
        ]),
        priority: z.enum(["low", "medium", "high", "urgent"]),
        description: z.string(),
        expectedImpact: z.enum(["low", "medium", "high"]),
        implementation: z.enum(["easy", "medium", "hard"]),
      })
    ),
  })
  .strict();

export type UserTradingPatternAnalysis = z.infer<
  typeof UserTradingPatternAnalysisSchema
>;

// ============================================================================
// ADMIN SCHEMAS
// ============================================================================

/**
 * Schema for admin user trade history management
 */
export const AdminUserTradeHistoryManagementSchema = z
  .object({
    action: z.enum([
      "list_all_trades",
      "audit_trades",
      "generate_reports",
      "detect_fraud",
      "resolve_disputes",
      "data_cleanup",
      "analytics_update",
      "compliance_check",
      "export_data",
    ]),
    filters: z
      .object({
        userIds: z.array(z.string()).optional(),
        eventIds: z.array(z.string()).optional(),
        offerIds: z.array(z.string()).optional(),
        dateRange: z
          .object({
            startDate: z.coerce.date(),
            endDate: z.coerce.date(),
          })
          .optional(),
        valueRange: z
          .object({
            minValue: z.number().min(0),
            maxValue: z.number().min(0),
          })
          .optional(),
        hasDisputes: z.boolean().optional(),
        hasSupport: z.boolean().optional(),
        suspiciousActivity: z.boolean().optional(),
        qualityThreshold: z.number().min(0).max(1).optional(),
      })
      .optional(),
    operationOptions: z
      .object({
        includeDetails: z.boolean().default(true),
        includeAnalytics: z.boolean().default(true),
        includeRelations: z.boolean().default(false),
        anonymizeData: z.boolean().default(false),
        validateChanges: z.boolean().default(true),
        createBackups: z.boolean().default(true),
        recordActivity: z.boolean().default(true),
      })
      .optional(),
    reportOptions: z
      .object({
        format: z.enum(["json", "csv", "xlsx", "pdf"]).default("json"),
        includeCharts: z.boolean().default(false),
        includeRecommendations: z.boolean().default(true),
        deliveryMethod: z
          .enum(["immediate", "email", "download"])
          .default("immediate"),
        recipientEmail: z.string().email().optional(),
      })
      .optional(),
  })
  .strict();

export type AdminUserTradeHistoryManagement = z.infer<
  typeof AdminUserTradeHistoryManagementSchema
>;

// ============================================================================
// EXPORTS
// ============================================================================

// All schemas are defined above and exported individually

// Export all validation functions
export const UserTradeHistoryValidation = {
  // Base schemas
  model: UserTradeHistorySchema,
  input: UserTradeHistoryInputSchema,

  // CRUD schemas
  create: CreateUserTradeHistorySchema,
  execute: ExecuteTradeSchema,
  bulkCreate: BulkCreateTradeHistorySchema,
  update: UpdateUserTradeHistorySchema,
  updateMetadata: UpdateTradeMetadataSchema,
  partialUpdate: PartialUpdateUserTradeHistorySchema,

  // History management schemas
  analyzePatterns: AnalyzeUserTradingPatternsSchema,
  generateReport: GenerateTradeReportSchema,
  bulkOperation: BulkTradeHistoryOperationSchema,
  detectFraud: DetectTradeFraudSchema,

  // Query schemas
  findUnique: FindUniqueUserTradeHistorySchema,
  findMany: FindManyUserTradeHistoriesSchema,
  where: UserTradeHistoryWhereSchema,
  orderBy: UserTradeHistoryOrderBySchema,
  select: UserTradeHistorySelectSchema,
  include: UserTradeHistoryIncludeSchema,

  // Helpers
  search: SearchUserTradeHistoriesSchema,
  validateEligibility: ValidateTradeEligibilitySchema,
  getStats: GetUserTradeStatsSchema,

  // Response schemas
  response: UserTradeHistoryResponseSchema,
  withRelations: UserTradeHistoryWithRelationsSchema,
  summary: UserTradeHistorySummarySchema,
  executionResult: TradeExecutionResultSchema,
  patternAnalysis: UserTradingPatternAnalysisSchema,

  // Admin schemas
  adminManagement: AdminUserTradeHistoryManagementSchema,

  // Component schemas
  analytics: UserTradeHistoryAnalyticsSchema,
  metadata: TradeHistoryMetadataSchema,
  itemSnapshot: TradeItemSnapshotSchema,
} as const;
