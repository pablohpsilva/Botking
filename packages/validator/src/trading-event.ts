import { z } from "zod";

// ============================================================================
// TRADING EVENT METADATA SCHEMAS
// ============================================================================

/**
 * Schema for trading event analytics and metrics
 */
export const TradingEventAnalyticsSchema = z.object({
  participation: z
    .object({
      totalParticipants: z.number().int().min(0).default(0),
      uniqueTraders: z.number().int().min(0).default(0),
      returningTraders: z.number().int().min(0).default(0),
      newTraders: z.number().int().min(0).default(0),
      participationRate: z.number().min(0).max(1).optional(),
    })
    .optional(),
  activity: z
    .object({
      totalTrades: z.number().int().min(0).default(0),
      successfulTrades: z.number().int().min(0).default(0),
      failedTrades: z.number().int().min(0).default(0),
      averageTradesPerUser: z.number().min(0).optional(),
      peakTradingHour: z.number().int().min(0).max(23).optional(),
      busyDays: z.array(z.string()).optional(),
    })
    .optional(),
  economy: z
    .object({
      totalValue: z.number().min(0).default(0),
      averageTradeValue: z.number().min(0).optional(),
      mostTradedItems: z
        .array(
          z.object({
            itemId: z.string(),
            itemName: z.string(),
            tradeCount: z.number().int().min(0),
          })
        )
        .optional(),
      rarityDistribution: z
        .record(z.string(), z.number().int().min(0))
        .optional(),
    })
    .optional(),
  performance: z
    .object({
      conversionRate: z.number().min(0).max(1).optional(), // Views to trades
      retentionRate: z.number().min(0).max(1).optional(), // Users coming back
      satisfactionScore: z.number().min(0).max(5).optional(),
      popularityRank: z.number().int().min(1).optional(),
      engagementScore: z.number().min(0).max(1).optional(),
    })
    .optional(),
  timeline: z
    .object({
      dailyStats: z
        .array(
          z.object({
            date: z.coerce.date(),
            trades: z.number().int().min(0),
            participants: z.number().int().min(0),
            value: z.number().min(0),
          })
        )
        .optional(),
      hourlyStats: z
        .array(
          z.object({
            hour: z.number().int().min(0).max(23),
            trades: z.number().int().min(0),
            participants: z.number().int().min(0),
          })
        )
        .optional(),
    })
    .optional(),
});

export type TradingEventAnalytics = z.infer<typeof TradingEventAnalyticsSchema>;

/**
 * Schema for trading event configuration and settings
 */
export const TradingEventConfigurationSchema = z.object({
  restrictions: z
    .object({
      minUserLevel: z.number().int().min(1).optional(),
      maxUserLevel: z.number().int().min(1).optional(),
      requiredAchievements: z.array(z.string()).optional(),
      bannedUsers: z.array(z.string()).optional(),
      allowedRegions: z.array(z.string()).optional(),
      blockedRegions: z.array(z.string()).optional(),
    })
    .optional(),
  rewards: z
    .object({
      participationRewards: z
        .array(
          z.object({
            itemId: z.string(),
            quantity: z.number().int().min(1),
            condition: z.string().optional(),
          })
        )
        .optional(),
      milestoneRewards: z
        .array(
          z.object({
            threshold: z.number().int().min(1),
            itemId: z.string(),
            quantity: z.number().int().min(1),
            description: z.string().optional(),
          })
        )
        .optional(),
      completionBonus: z
        .object({
          itemId: z.string(),
          quantity: z.number().int().min(1),
          description: z.string().optional(),
        })
        .optional(),
    })
    .optional(),
  notifications: z
    .object({
      sendReminders: z.boolean().default(true),
      reminderHours: z.array(z.number().int().min(1).max(168)).optional(), // Hours before end
      sendUpdates: z.boolean().default(true),
      notifyStart: z.boolean().default(true),
      notifyEnd: z.boolean().default(true),
      customMessages: z
        .array(
          z.object({
            trigger: z.enum([
              "event_start",
              "event_end",
              "trade_complete",
              "milestone_reached",
            ]),
            message: z.string().max(500),
            channels: z.array(z.enum(["email", "push", "in_game"])),
          })
        )
        .optional(),
    })
    .optional(),
  display: z
    .object({
      featuredOrder: z.number().int().min(0).optional(),
      highlightColor: z.string().optional(),
      bannerStyle: z.enum(["standard", "premium", "special"]).optional(),
      showCountdown: z.boolean().default(true),
      showParticipantCount: z.boolean().default(true),
      showProgress: z.boolean().default(true),
      customBadges: z.array(z.string()).optional(),
    })
    .optional(),
  automation: z
    .object({
      autoStart: z.boolean().default(false),
      autoEnd: z.boolean().default(true),
      autoPause: z
        .object({
          enabled: z.boolean().default(false),
          conditions: z.array(z.string()).optional(),
        })
        .optional(),
      autoExtend: z
        .object({
          enabled: z.boolean().default(false),
          maxExtensions: z.number().int().min(1).max(5).optional(),
          extensionHours: z.number().int().min(1).max(72).optional(),
          conditions: z.array(z.string()).optional(),
        })
        .optional(),
    })
    .optional(),
});

export type TradingEventConfiguration = z.infer<
  typeof TradingEventConfigurationSchema
>;

// ============================================================================
// BASE SCHEMAS
// ============================================================================

/**
 * Base TradingEvent model schema - represents the complete TradingEvent entity
 */
export const TradingEventSchema = z
  .object({
    id: z.string(),
    name: z.string(),
    description: z.string().nullable(),
    status: z.enum(["DRAFT", "ACTIVE", "PAUSED", "ENDED", "CANCELLED"]),
    startDate: z.date().nullable(),
    endDate: z.date().nullable(),
    isRepeatable: z.boolean(),
    maxTradesPerUser: z.number().int().nullable(),
    priority: z.number().int(),
    tags: z.array(z.string()),
    imageUrl: z.string().nullable(),
    createdBy: z.string().nullable(),
    isPublic: z.boolean(),
    createdAt: z.date(),
    updatedAt: z.date(),
  })
  .strict();

export type TradingEvent = z.infer<typeof TradingEventSchema>;

/**
 * TradingEvent input schema for forms and API inputs (without auto-generated fields)
 */
export const TradingEventInputSchema = z
  .object({
    name: z
      .string()
      .min(1, "Event name is required")
      .max(100, "Event name too long"),
    description: z
      .string()
      .max(2000, "Description too long")
      .nullable()
      .optional(),
    status: z
      .enum(["DRAFT", "ACTIVE", "PAUSED", "ENDED", "CANCELLED"])
      .default("DRAFT"),
    startDate: z.coerce.date().nullable().optional(),
    endDate: z.coerce.date().nullable().optional(),
    isRepeatable: z.boolean().default(false),
    maxTradesPerUser: z
      .number()
      .int()
      .min(1, "Max trades must be at least 1")
      .max(1000, "Max trades too high")
      .nullable()
      .optional(),
    priority: z
      .number()
      .int()
      .min(-100, "Priority too low")
      .max(100, "Priority too high")
      .default(0),
    tags: z
      .array(z.string().max(50, "Tag too long"))
      .max(20, "Too many tags")
      .default([]),
    imageUrl: z.string().url("Invalid image URL").nullable().optional(),
    createdBy: z.string().nullable().optional(),
    isPublic: z.boolean().default(true),
  })
  .strict()
  .refine(
    (data) => {
      // Validate date ranges
      if (data.startDate && data.endDate) {
        return data.endDate > data.startDate;
      }
      return true;
    },
    {
      message: "End date must be after start date",
      path: ["endDate"],
    }
  )
  .refine(
    (data) => {
      // Active events must have dates
      if (data.status === "ACTIVE" && (!data.startDate || !data.endDate)) {
        return false;
      }
      return true;
    },
    {
      message: "Active events must have start and end dates",
      path: ["status"],
    }
  );

export type TradingEventInput = z.infer<typeof TradingEventInputSchema>;

// ============================================================================
// CREATE SCHEMAS
// ============================================================================

/**
 * Schema for creating a new TradingEvent
 * Compatible with Prisma TradingEventCreateInput
 */
export const CreateTradingEventSchema = z
  .object({
    id: z.string().optional(),
    name: z
      .string()
      .min(1, "Event name is required")
      .max(100, "Event name too long"),
    description: z
      .string()
      .max(2000, "Description too long")
      .nullable()
      .optional(),
    status: z
      .enum(["DRAFT", "ACTIVE", "PAUSED", "ENDED", "CANCELLED"])
      .default("DRAFT"),
    startDate: z.coerce.date().nullable().optional(),
    endDate: z.coerce.date().nullable().optional(),
    isRepeatable: z.boolean().default(false),
    maxTradesPerUser: z
      .number()
      .int()
      .min(1, "Max trades must be at least 1")
      .max(1000, "Max trades too high")
      .nullable()
      .optional(),
    priority: z
      .number()
      .int()
      .min(-100, "Priority too low")
      .max(100, "Priority too high")
      .default(0),
    tags: z
      .array(z.string().max(50, "Tag too long"))
      .max(20, "Too many tags")
      .default([]),
    imageUrl: z.string().url("Invalid image URL").nullable().optional(),
    createdBy: z.string().nullable().optional(),
    isPublic: z.boolean().default(true),
    createdAt: z.coerce.date().optional(),
    updatedAt: z.coerce.date().optional(),
  })
  .strict();

export type CreateTradingEventInput = z.infer<typeof CreateTradingEventSchema>;

/**
 * Simplified create schema for API endpoints
 */
export const CreateTradingEventApiSchema = z
  .object({
    name: z
      .string()
      .min(1, "Event name is required")
      .max(100, "Event name too long"),
    description: z.string().max(2000, "Description too long").optional(),
    eventType: z
      .enum([
        "seasonal",
        "weekly",
        "flash",
        "special",
        "community",
        "tournament",
        "limited",
      ])
      .optional(),
    duration: z
      .object({
        hours: z.number().int().min(1).max(8760).optional(), // Max 1 year
        days: z.number().int().min(1).max(365).optional(),
        startDate: z.coerce.date().optional(),
        endDate: z.coerce.date().optional(),
      })
      .optional(),
    settings: z
      .object({
        isRepeatable: z.boolean().default(false),
        maxTradesPerUser: z.number().int().min(1).max(1000).optional(),
        isPublic: z.boolean().default(true),
        autoStart: z.boolean().default(false),
        autoEnd: z.boolean().default(true),
      })
      .optional(),
    restrictions: z
      .object({
        minUserLevel: z.number().int().min(1).optional(),
        maxUserLevel: z.number().int().min(1).optional(),
        requiredAchievements: z.array(z.string()).optional(),
      })
      .optional(),
    tags: z
      .array(z.string().max(50, "Tag too long"))
      .max(20, "Too many tags")
      .default([]),
    imageUrl: z.string().url("Invalid image URL").optional(),
    priority: z
      .number()
      .int()
      .min(-100, "Priority too low")
      .max(100, "Priority too high")
      .default(0),
    generateTemplate: z.boolean().default(false),
    validateDates: z.boolean().default(true),
    recordActivity: z.boolean().default(true),
  })
  .strict();

export type CreateTradingEventApi = z.infer<typeof CreateTradingEventApiSchema>;

/**
 * Schema for cloning/duplicating a trading event
 */
export const CloneTradingEventSchema = z
  .object({
    sourceEventId: z.string().min(1, "Source event ID is required"),
    newName: z
      .string()
      .min(1, "Event name is required")
      .max(100, "Event name too long"),
    newDescription: z.string().max(2000, "Description too long").optional(),
    copyTradeOffers: z.boolean().default(true),
    copySettings: z.boolean().default(true),
    copyRestrictions: z.boolean().default(true),
    copyRewards: z.boolean().default(false),
    adjustDates: z
      .object({
        startDate: z.coerce.date().optional(),
        endDate: z.coerce.date().optional(),
        offsetDays: z.number().int().optional(),
      })
      .optional(),
    newStatus: z.enum(["DRAFT", "ACTIVE", "PAUSED"]).default("DRAFT"),
    newPriority: z.number().int().min(-100).max(100).optional(),
    newTags: z.array(z.string().max(50)).max(20).optional(),
    cloneReason: z
      .enum([
        "seasonal_repeat",
        "template_creation",
        "testing",
        "modification",
        "backup",
        "other",
      ])
      .optional(),
    recordActivity: z.boolean().default(true),
  })
  .strict();

export type CloneTradingEvent = z.infer<typeof CloneTradingEventSchema>;

// ============================================================================
// UPDATE SCHEMAS
// ============================================================================

/**
 * Schema for updating a TradingEvent
 * Compatible with Prisma TradingEventUpdateInput
 */
export const UpdateTradingEventSchema = z
  .object({
    id: z.string().optional(),
    name: z
      .string()
      .min(1, "Event name is required")
      .max(100, "Event name too long")
      .optional(),
    description: z
      .string()
      .max(2000, "Description too long")
      .nullable()
      .optional(),
    status: z
      .enum(["DRAFT", "ACTIVE", "PAUSED", "ENDED", "CANCELLED"])
      .optional(),
    startDate: z.coerce.date().nullable().optional(),
    endDate: z.coerce.date().nullable().optional(),
    isRepeatable: z.boolean().optional(),
    maxTradesPerUser: z
      .number()
      .int()
      .min(1, "Max trades must be at least 1")
      .max(1000, "Max trades too high")
      .nullable()
      .optional(),
    priority: z
      .number()
      .int()
      .min(-100, "Priority too low")
      .max(100, "Priority too high")
      .optional(),
    tags: z
      .array(z.string().max(50, "Tag too long"))
      .max(20, "Too many tags")
      .optional(),
    imageUrl: z.string().url("Invalid image URL").nullable().optional(),
    createdBy: z.string().nullable().optional(),
    isPublic: z.boolean().optional(),
    createdAt: z.coerce.date().optional(),
    updatedAt: z.coerce.date().optional(),
  })
  .strict();

export type UpdateTradingEventInput = z.infer<typeof UpdateTradingEventSchema>;

/**
 * Schema for updating event status with validation
 */
export const UpdateEventStatusSchema = z
  .object({
    eventId: z.string().min(1, "Event ID is required"),
    newStatus: z.enum(["DRAFT", "ACTIVE", "PAUSED", "ENDED", "CANCELLED"]),
    reason: z
      .enum([
        "scheduled",
        "manual",
        "automatic",
        "error",
        "admin_action",
        "system_maintenance",
        "user_request",
      ])
      .optional(),
    notes: z.string().max(500).optional(),
    notifyUsers: z.boolean().default(true),
    validateTransition: z.boolean().default(true),
    recordActivity: z.boolean().default(true),
    forceUpdate: z.boolean().default(false),
  })
  .strict();

export type UpdateEventStatus = z.infer<typeof UpdateEventStatusSchema>;

/**
 * Schema for extending event duration
 */
export const ExtendEventSchema = z
  .object({
    eventId: z.string().min(1, "Event ID is required"),
    extension: z
      .object({
        hours: z.number().int().min(1).max(168).optional(), // Max 1 week
        days: z.number().int().min(1).max(30).optional(), // Max 1 month
        newEndDate: z.coerce.date().optional(),
      })
      .refine((data) => data.hours || data.days || data.newEndDate, {
        message: "At least one extension method must be provided",
      }),
    reason: z
      .enum([
        "high_demand",
        "technical_issues",
        "community_request",
        "admin_decision",
        "automatic",
        "testing",
      ])
      .optional(),
    maxExtensions: z.number().int().min(1).max(5).default(3),
    notifyUsers: z.boolean().default(true),
    validateExtension: z.boolean().default(true),
    recordActivity: z.boolean().default(true),
    extensionNotes: z.string().max(500).optional(),
  })
  .strict();

export type ExtendEvent = z.infer<typeof ExtendEventSchema>;

/**
 * Partial update schema - all fields optional
 */
export const PartialUpdateTradingEventSchema =
  TradingEventInputSchema.partial();

export type PartialUpdateTradingEvent = z.infer<
  typeof PartialUpdateTradingEventSchema
>;

// ============================================================================
// TRADING EVENT MANAGEMENT SCHEMAS
// ============================================================================

/**
 * Schema for bulk trading event operations
 */
export const BulkTradingEventOperationSchema = z
  .object({
    operation: z.enum([
      "create_multiple",
      "update_multiple",
      "delete_multiple",
      "start_multiple",
      "pause_multiple",
      "end_multiple",
      "clone_multiple",
      "archive_multiple",
    ]),
    eventIds: z
      .array(z.string().min(1))
      .min(1, "At least one event is required")
      .max(50, "Too many events for bulk operation"),
    operationData: z
      .object({
        updateData: z.record(z.string(), z.unknown()).optional(),
        statusChange: z
          .object({
            newStatus: z.enum([
              "DRAFT",
              "ACTIVE",
              "PAUSED",
              "ENDED",
              "CANCELLED",
            ]),
            reason: z.string().optional(),
          })
          .optional(),
        cloneSettings: z
          .object({
            namePrefix: z.string().optional(),
            nameSuffix: z.string().optional(),
            adjustDatesBy: z.number().int().optional(), // Days to offset
          })
          .optional(),
      })
      .optional(),
    operationOptions: z
      .object({
        validateEach: z.boolean().default(true),
        stopOnError: z.boolean().default(false),
        notifyUsers: z.boolean().default(false),
        recordActivities: z.boolean().default(true),
        createBackups: z.boolean().default(true),
      })
      .optional(),
    operationNotes: z.string().max(1000).optional(),
  })
  .strict();

export type BulkTradingEventOperation = z.infer<
  typeof BulkTradingEventOperationSchema
>;

/**
 * Schema for analyzing trading event performance
 */
export const AnalyzeTradingEventPerformanceSchema = z
  .object({
    eventId: z.string().min(1, "Event ID is required"),
    analysisType: z
      .enum([
        "participation",
        "engagement",
        "economy",
        "trends",
        "comparison",
        "performance",
        "all",
      ])
      .default("all"),
    timeGranularity: z.enum(["hourly", "daily", "weekly"]).default("daily"),
    compareWith: z
      .array(z.string())
      .max(5, "Too many events for comparison")
      .optional(),
    includeForecasting: z.boolean().default(false),
    includeRecommendations: z.boolean().default(true),
    generateReport: z.boolean().default(false),
    reportFormat: z.enum(["json", "csv", "pdf"]).default("json"),
  })
  .strict();

export type AnalyzeTradingEventPerformance = z.infer<
  typeof AnalyzeTradingEventPerformanceSchema
>;

/**
 * Schema for event scheduling and automation
 */
export const ScheduleEventSchema = z
  .object({
    eventId: z.string().min(1, "Event ID is required"),
    schedule: z
      .object({
        startDate: z.coerce.date(),
        endDate: z.coerce.date(),
        timeZone: z.string().default("UTC"),
        recurrence: z
          .object({
            type: z.enum(["none", "daily", "weekly", "monthly", "yearly"]),
            interval: z.number().int().min(1).max(365).default(1),
            endAfter: z.number().int().min(1).max(100).optional(),
            endDate: z.coerce.date().optional(),
            daysOfWeek: z.array(z.number().int().min(0).max(6)).optional(),
            daysOfMonth: z.array(z.number().int().min(1).max(31)).optional(),
          })
          .optional(),
      })
      .refine((data) => data.endDate > data.startDate, {
        message: "End date must be after start date",
        path: ["endDate"],
      }),
    automation: z
      .object({
        autoStart: z.boolean().default(true),
        autoEnd: z.boolean().default(true),
        preStartActions: z.array(z.string()).optional(),
        postEndActions: z.array(z.string()).optional(),
        notifications: z
          .object({
            beforeStart: z.array(z.number().int().min(1)).optional(), // Hours
            beforeEnd: z.array(z.number().int().min(1)).optional(), // Hours
            channels: z.array(z.enum(["email", "push", "in_game"])).optional(),
          })
          .optional(),
      })
      .optional(),
    validateSchedule: z.boolean().default(true),
    recordActivity: z.boolean().default(true),
    scheduleNotes: z.string().max(500).optional(),
  })
  .strict();

export type ScheduleEvent = z.infer<typeof ScheduleEventSchema>;

// ============================================================================
// QUERY SCHEMAS
// ============================================================================

/**
 * Schema for finding a unique TradingEvent
 */
export const FindUniqueTradingEventSchema = z
  .object({
    id: z.string().optional(),
  })
  .strict();

export type FindUniqueTradingEventInput = z.infer<
  typeof FindUniqueTradingEventSchema
>;

/**
 * Schema for filtering TradingEvents
 */
export const TradingEventWhereSchema: z.ZodType<any> = z.lazy(() =>
  z
    .object({
      id: z.string().optional(),
      name: z.string().optional(),
      description: z.string().nullable().optional(),
      status: z
        .enum(["DRAFT", "ACTIVE", "PAUSED", "ENDED", "CANCELLED"])
        .optional(),
      startDate: z.date().nullable().optional(),
      endDate: z.date().nullable().optional(),
      isRepeatable: z.boolean().optional(),
      maxTradesPerUser: z.number().int().nullable().optional(),
      priority: z.number().int().optional(),
      imageUrl: z.string().nullable().optional(),
      createdBy: z.string().nullable().optional(),
      isPublic: z.boolean().optional(),
      createdAt: z.date().optional(),
      updatedAt: z.date().optional(),
      AND: z.array(TradingEventWhereSchema).optional(),
      OR: z.array(TradingEventWhereSchema).optional(),
      NOT: TradingEventWhereSchema.optional(),
    })
    .strict()
);

export type TradingEventWhere = z.infer<typeof TradingEventWhereSchema>;

/**
 * Schema for ordering TradingEvents
 */
export const TradingEventOrderBySchema = z
  .object({
    id: z.enum(["asc", "desc"]).optional(),
    name: z.enum(["asc", "desc"]).optional(),
    description: z.enum(["asc", "desc"]).optional(),
    status: z.enum(["asc", "desc"]).optional(),
    startDate: z.enum(["asc", "desc"]).optional(),
    endDate: z.enum(["asc", "desc"]).optional(),
    isRepeatable: z.enum(["asc", "desc"]).optional(),
    maxTradesPerUser: z.enum(["asc", "desc"]).optional(),
    priority: z.enum(["asc", "desc"]).optional(),
    imageUrl: z.enum(["asc", "desc"]).optional(),
    createdBy: z.enum(["asc", "desc"]).optional(),
    isPublic: z.enum(["asc", "desc"]).optional(),
    createdAt: z.enum(["asc", "desc"]).optional(),
    updatedAt: z.enum(["asc", "desc"]).optional(),
  })
  .strict();

export type TradingEventOrderBy = z.infer<typeof TradingEventOrderBySchema>;

/**
 * Schema for selecting TradingEvent fields
 */
export const TradingEventSelectSchema = z
  .object({
    id: z.boolean().optional(),
    name: z.boolean().optional(),
    description: z.boolean().optional(),
    status: z.boolean().optional(),
    startDate: z.boolean().optional(),
    endDate: z.boolean().optional(),
    isRepeatable: z.boolean().optional(),
    maxTradesPerUser: z.boolean().optional(),
    priority: z.boolean().optional(),
    tags: z.boolean().optional(),
    imageUrl: z.boolean().optional(),
    createdBy: z.boolean().optional(),
    isPublic: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    updatedAt: z.boolean().optional(),
    tradeOffers: z.boolean().optional(),
    userTrades: z.boolean().optional(),
  })
  .strict();

export type TradingEventSelect = z.infer<typeof TradingEventSelectSchema>;

/**
 * Schema for including TradingEvent relations
 */
export const TradingEventIncludeSchema = z
  .object({
    tradeOffers: z.boolean().optional(),
    userTrades: z.boolean().optional(),
  })
  .strict();

export type TradingEventInclude = z.infer<typeof TradingEventIncludeSchema>;

// ============================================================================
// PAGINATION SCHEMAS
// ============================================================================

/**
 * Schema for paginated TradingEvent queries
 */
export const FindManyTradingEventsSchema = z
  .object({
    where: TradingEventWhereSchema.optional(),
    orderBy: z
      .union([TradingEventOrderBySchema, z.array(TradingEventOrderBySchema)])
      .optional(),
    select: TradingEventSelectSchema.optional(),
    include: TradingEventIncludeSchema.optional(),
    skip: z.number().int().min(0).optional(),
    take: z.number().int().min(1).max(1000).optional(),
    cursor: FindUniqueTradingEventSchema.optional(),
  })
  .strict();

export type FindManyTradingEventsInput = z.infer<
  typeof FindManyTradingEventsSchema
>;

// ============================================================================
// VALIDATION HELPERS
// ============================================================================

/**
 * Schema for searching trading events
 */
export const SearchTradingEventsSchema = z
  .object({
    query: z.string().max(200).optional(),
    status: z
      .enum(["DRAFT", "ACTIVE", "PAUSED", "ENDED", "CANCELLED"])
      .optional(),
    isPublic: z.boolean().optional(),
    tags: z.array(z.string()).max(10).optional(),
    startingAfter: z.coerce.date().optional(),
    startingBefore: z.coerce.date().optional(),
    endingAfter: z.coerce.date().optional(),
    endingBefore: z.coerce.date().optional(),
    createdAfter: z.coerce.date().optional(),
    createdBefore: z.coerce.date().optional(),
    createdBy: z.string().optional(),
    isRepeatable: z.boolean().optional(),
    hasTradeLimit: z.boolean().optional(),
    minPriority: z.number().int().optional(),
    maxPriority: z.number().int().optional(),
    hasImage: z.boolean().optional(),
    includeAnalytics: z.boolean().default(false),
    includeOfferCount: z.boolean().default(true),
    includeParticipantCount: z.boolean().default(true),
    sortBy: z
      .enum([
        "relevance",
        "name",
        "status",
        "start_date",
        "end_date",
        "priority",
        "created_date",
        "participant_count",
        "offer_count",
      ])
      .default("priority"),
    sortOrder: z.enum(["asc", "desc"]).default("desc"),
    limit: z.number().int().min(1).max(100).default(20),
  })
  .strict();

export type SearchTradingEvents = z.infer<typeof SearchTradingEventsSchema>;

/**
 * Schema for validating event participation
 */
export const ValidateEventParticipationSchema = z
  .object({
    eventId: z.string().min(1, "Event ID is required"),
    userId: z.string().min(1, "User ID is required"),
    tradeOfferId: z.string().optional(),
    checkEligibility: z.boolean().default(true),
    checkLimits: z.boolean().default(true),
    checkTiming: z.boolean().default(true),
    checkStatus: z.boolean().default(true),
    includeReasons: z.boolean().default(true),
  })
  .strict();

export type ValidateEventParticipation = z.infer<
  typeof ValidateEventParticipationSchema
>;

/**
 * Schema for getting event statistics
 */
export const GetEventStatsSchema = z
  .object({
    eventId: z.string().min(1, "Event ID is required"),
    includeRealTime: z.boolean().default(true),
    includeHistorical: z.boolean().default(false),
    includeProjections: z.boolean().default(false),
    timeRange: z
      .object({
        startDate: z.coerce.date(),
        endDate: z.coerce.date(),
      })
      .optional(),
    granularity: z.enum(["hourly", "daily", "weekly"]).default("daily"),
    compareWithPrevious: z.boolean().default(false),
  })
  .strict();

export type GetEventStats = z.infer<typeof GetEventStatsSchema>;

// ============================================================================
// RESPONSE SCHEMAS
// ============================================================================

/**
 * Schema for TradingEvent API responses
 */
export const TradingEventResponseSchema = TradingEventSchema;

export type TradingEventResponse = z.infer<typeof TradingEventResponseSchema>;

/**
 * Schema for TradingEvent with related data
 */
export const TradingEventWithRelationsSchema =
  TradingEventResponseSchema.extend({
    tradeOffers: z
      .array(
        z.object({
          id: z.string(),
          name: z.string(),
          status: z.string(),
          maxTotalTrades: z.number().int().nullable(),
          currentTrades: z.number().int(),
          maxPerUser: z.number().int().nullable(),
        })
      )
      .optional(),
    userTrades: z
      .array(
        z.object({
          id: z.string(),
          userId: z.string(),
          executedAt: z.date(),
          itemsGiven: z.unknown(),
          itemsReceived: z.unknown(),
        })
      )
      .optional(),
  });

export type TradingEventWithRelations = z.infer<
  typeof TradingEventWithRelationsSchema
>;

/**
 * Schema for TradingEvent summary (minimal info)
 */
export const TradingEventSummarySchema = z
  .object({
    id: z.string(),
    name: z.string(),
    description: z.string().nullable(),
    status: z.string(),
    startDate: z.date().nullable(),
    endDate: z.date().nullable(),
    isRepeatable: z.boolean(),
    maxTradesPerUser: z.number().int().nullable(),
    priority: z.number().int(),
    tags: z.array(z.string()),
    imageUrl: z.string().nullable(),
    isPublic: z.boolean(),
    offerCount: z.number().int().min(0),
    participantCount: z.number().int().min(0),
    totalTrades: z.number().int().min(0),
    isActive: z.boolean(),
    timeRemaining: z.string().nullable(), // Human readable
    createdAt: z.date(),
  })
  .strict();

export type TradingEventSummary = z.infer<typeof TradingEventSummarySchema>;

/**
 * Schema for trading event operation result
 */
export const TradingEventOperationResultSchema = z
  .object({
    operation: z.string(),
    eventId: z.string(),
    success: z.boolean(),
    changes: z.object({
      statusBefore: z.string().optional(),
      statusAfter: z.string().optional(),
      fieldChanges: z.record(z.string(), z.unknown()).optional(),
      offersAffected: z.number().int().min(0).optional(),
      participantsAffected: z.number().int().min(0).optional(),
    }),
    timing: z.object({
      executedAt: z.date(),
      executionTime: z.number().min(0), // milliseconds
      scheduledFor: z.date().optional(),
    }),
    warnings: z.array(z.string()).optional(),
    errors: z.array(z.string()).optional(),
    recommendations: z.array(z.string()).optional(),
    transactionId: z.string().optional(),
    metadata: z.record(z.string(), z.unknown()).optional(),
  })
  .strict();

export type TradingEventOperationResult = z.infer<
  typeof TradingEventOperationResultSchema
>;

/**
 * Schema for trading event analytics result
 */
export const TradingEventAnalyticsResultSchema = z
  .object({
    eventId: z.string(),
    eventName: z.string(),
    analysisDate: z.date(),
    timeRange: z.object({
      startDate: z.date(),
      endDate: z.date(),
    }),
    summary: z.object({
      status: z.string(),
      duration: z.object({
        planned: z.number().int(), // hours
        actual: z.number().int().optional(), // hours
        remaining: z.number().int().optional(), // hours
      }),
      participation: z.object({
        totalParticipants: z.number().int().min(0),
        uniqueTraders: z.number().int().min(0),
        returningTraders: z.number().int().min(0),
        participationRate: z.number().min(0).max(1),
      }),
      trading: z.object({
        totalTrades: z.number().int().min(0),
        successfulTrades: z.number().int().min(0),
        failedTrades: z.number().int().min(0),
        successRate: z.number().min(0).max(1),
        averageTradesPerUser: z.number().min(0),
      }),
    }),
    performance: z.object({
      engagementScore: z.number().min(0).max(1),
      conversionRate: z.number().min(0).max(1),
      retentionRate: z.number().min(0).max(1),
      satisfactionScore: z.number().min(0).max(5),
      popularityRank: z.number().int().min(1).optional(),
      trendingScore: z.number().min(0).max(1),
    }),
    economy: z.object({
      totalValue: z.number().min(0),
      averageTradeValue: z.number().min(0),
      valueDistribution: z.record(z.string(), z.number().min(0)),
      mostTradedItems: z.array(
        z.object({
          itemId: z.string(),
          itemName: z.string(),
          tradeCount: z.number().int().min(0),
          totalValue: z.number().min(0),
        })
      ),
    }),
    timeline: z.object({
      dailyStats: z.array(
        z.object({
          date: z.date(),
          trades: z.number().int().min(0),
          participants: z.number().int().min(0),
          value: z.number().min(0),
        })
      ),
      peakActivity: z.object({
        date: z.date(),
        hour: z.number().int().min(0).max(23),
        trades: z.number().int().min(0),
      }),
    }),
    insights: z.object({
      strengths: z.array(z.string()),
      weaknesses: z.array(z.string()),
      opportunities: z.array(z.string()),
      threats: z.array(z.string()),
    }),
    recommendations: z.array(
      z.object({
        category: z.enum([
          "timing",
          "promotion",
          "offers",
          "rewards",
          "user_experience",
          "economics",
        ]),
        priority: z.enum(["low", "medium", "high", "urgent"]),
        description: z.string(),
        expectedImpact: z.enum(["low", "medium", "high"]),
        implementation: z.enum(["easy", "medium", "hard"]),
      })
    ),
  })
  .strict();

export type TradingEventAnalyticsResult = z.infer<
  typeof TradingEventAnalyticsResultSchema
>;

// ============================================================================
// ADMIN SCHEMAS
// ============================================================================

/**
 * Schema for admin trading event management
 */
export const AdminTradingEventManagementSchema = z
  .object({
    action: z.enum([
      "list_all_events",
      "moderate_events",
      "generate_event_report",
      "cleanup_expired_events",
      "analyze_event_trends",
      "bulk_update_events",
      "audit_events",
      "manage_schedules",
    ]),
    filters: z
      .object({
        status: z
          .enum(["DRAFT", "ACTIVE", "PAUSED", "ENDED", "CANCELLED"])
          .optional(),
        createdBy: z.string().optional(),
        isPublic: z.boolean().optional(),
        createdAfter: z.coerce.date().optional(),
        createdBefore: z.coerce.date().optional(),
        hasIssues: z.boolean().optional(),
        needsModeration: z.boolean().optional(),
      })
      .optional(),
    operationOptions: z
      .object({
        validateChanges: z.boolean().default(true),
        notifyCreators: z.boolean().default(false),
        notifyParticipants: z.boolean().default(false),
        createBackups: z.boolean().default(true),
        recordActivity: z.boolean().default(true),
      })
      .optional(),
    reportOptions: z
      .object({
        includeDetails: z.boolean().default(true),
        includeAnalytics: z.boolean().default(true),
        includeTrends: z.boolean().default(true),
        includeRecommendations: z.boolean().default(true),
        format: z.enum(["json", "csv", "pdf"]).default("json"),
        dateRange: z
          .object({
            startDate: z.coerce.date(),
            endDate: z.coerce.date(),
          })
          .optional(),
      })
      .optional(),
  })
  .strict();

export type AdminTradingEventManagement = z.infer<
  typeof AdminTradingEventManagementSchema
>;

/**
 * Schema for trading event system statistics
 */
export const TradingEventSystemStatsSchema = z
  .object({
    totalEvents: z.number().int().min(0),
    activeEvents: z.number().int().min(0),
    totalTrades: z.number().int().min(0),
    totalParticipants: z.number().int().min(0),
    averageParticipantsPerEvent: z.number(),
    eventDistribution: z.object({
      byStatus: z.record(z.string(), z.number().int().min(0)),
      byType: z.record(z.string(), z.number().int().min(0)),
      byCreator: z.record(z.string(), z.number().int().min(0)),
    }),
    participationMetrics: z.object({
      totalUsers: z.number().int().min(0),
      activeTraders: z.number().int().min(0),
      averageTradesPerUser: z.number(),
      userRetentionRate: z.number().min(0).max(1),
      newUsersLast30d: z.number().int().min(0),
    }),
    economicMetrics: z.object({
      totalTradeValue: z.number().min(0),
      averageTradeValue: z.number().min(0),
      economicActivity: z.number().min(0).max(1),
      marketHealth: z.number().min(0).max(1),
      inflationRate: z.number(),
    }),
    performanceMetrics: z.object({
      averageEventDuration: z.number(), // hours
      averageSuccessRate: z.number().min(0).max(1),
      averageEngagementRate: z.number().min(0).max(1),
      systemReliability: z.number().min(0).max(1),
      userSatisfaction: z.number().min(0).max(5),
    }),
    trendsAndInsights: z.object({
      popularEventTypes: z.array(z.string()),
      seasonalPatterns: z.record(z.string(), z.number()),
      userBehaviorTrends: z.record(z.string(), z.unknown()),
      economicTrends: z.record(z.string(), z.number()),
      growthPredictions: z.record(z.string(), z.number()),
    }),
    healthMetrics: z.object({
      eventSuccessRate: z.number().min(0).max(1),
      userComplaintRate: z.number().min(0).max(1),
      systemErrorRate: z.number().min(0).max(1),
      dataIntegrityScore: z.number().min(0).max(1),
      operationalEfficiency: z.number().min(0).max(1),
    }),
  })
  .strict();

export type TradingEventSystemStats = z.infer<
  typeof TradingEventSystemStatsSchema
>;

// ============================================================================
// EXPORTS
// ============================================================================

// All schemas are defined above and exported individually

// Export all validation functions
export const TradingEventValidation = {
  // Base schemas
  model: TradingEventSchema,
  input: TradingEventInputSchema,

  // CRUD schemas
  create: CreateTradingEventSchema,
  createApi: CreateTradingEventApiSchema,
  clone: CloneTradingEventSchema,
  update: UpdateTradingEventSchema,
  partialUpdate: PartialUpdateTradingEventSchema,

  // Event management schemas
  updateStatus: UpdateEventStatusSchema,
  extend: ExtendEventSchema,
  schedule: ScheduleEventSchema,
  bulkOperation: BulkTradingEventOperationSchema,
  analyzePerformance: AnalyzeTradingEventPerformanceSchema,

  // Query schemas
  findUnique: FindUniqueTradingEventSchema,
  findMany: FindManyTradingEventsSchema,
  where: TradingEventWhereSchema,
  orderBy: TradingEventOrderBySchema,
  select: TradingEventSelectSchema,
  include: TradingEventIncludeSchema,

  // Helpers
  search: SearchTradingEventsSchema,
  validateParticipation: ValidateEventParticipationSchema,
  getStats: GetEventStatsSchema,

  // Response schemas
  response: TradingEventResponseSchema,
  withRelations: TradingEventWithRelationsSchema,
  summary: TradingEventSummarySchema,
  operationResult: TradingEventOperationResultSchema,
  analyticsResult: TradingEventAnalyticsResultSchema,

  // Admin schemas
  adminManagement: AdminTradingEventManagementSchema,
  systemStats: TradingEventSystemStatsSchema,

  // Component schemas
  analytics: TradingEventAnalyticsSchema,
  configuration: TradingEventConfigurationSchema,
} as const;
