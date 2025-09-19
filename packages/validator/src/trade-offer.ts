import { z } from "zod";

// ============================================================================
// TRADE OFFER METADATA SCHEMAS
// ============================================================================

/**
 * Schema for trade offer analytics and performance metrics
 */
export const TradeOfferAnalyticsSchema = z.object({
  trading: z
    .object({
      totalTrades: z.number().int().min(0).default(0),
      successfulTrades: z.number().int().min(0).default(0),
      failedTrades: z.number().int().min(0).default(0),
      successRate: z.number().min(0).max(1).default(0),
      averageTradesPerDay: z.number().min(0).default(0),
      peakTradingTime: z.string().optional(), // "14:30" format
      tradingVelocity: z.number().min(0).default(0), // trades per hour
    })
    .optional(),
  participation: z
    .object({
      uniqueTraders: z.number().int().min(0).default(0),
      repeatTraders: z.number().int().min(0).default(0),
      newTraders: z.number().int().min(0).default(0),
      averageTradesPerUser: z.number().min(0).default(0),
      topTraders: z
        .array(
          z.object({
            userId: z.string(),
            username: z.string().optional(),
            tradeCount: z.number().int().min(0),
            totalValue: z.number().min(0).optional(),
          })
        )
        .optional(),
    })
    .optional(),
  economy: z
    .object({
      totalValue: z.number().min(0).default(0),
      averageTradeValue: z.number().min(0).default(0),
      itemsGiven: z
        .array(
          z.object({
            itemId: z.string(),
            itemName: z.string(),
            totalQuantity: z.number().int().min(0),
            totalValue: z.number().min(0),
          })
        )
        .optional(),
      itemsReceived: z
        .array(
          z.object({
            itemId: z.string(),
            itemName: z.string(),
            totalQuantity: z.number().int().min(0),
            totalValue: z.number().min(0),
          })
        )
        .optional(),
      conversionRate: z.number().min(0).optional(), // Views to trades
      popularityScore: z.number().min(0).max(1).default(0),
    })
    .optional(),
  availability: z
    .object({
      remainingTrades: z.number().int().min(0).optional(),
      utilizationRate: z.number().min(0).max(1).default(0), // current/max
      estimatedDepleted: z.coerce.date().optional(),
      demandScore: z.number().min(0).max(1).default(0),
      scarcityMultiplier: z.number().min(0).default(1),
    })
    .optional(),
  performance: z
    .object({
      engagementScore: z.number().min(0).max(1).default(0),
      retentionRate: z.number().min(0).max(1).default(0),
      satisfactionScore: z.number().min(0).max(5).default(0),
      competitiveIndex: z.number().min(0).max(1).default(0),
      trendingScore: z.number().min(0).max(1).default(0),
    })
    .optional(),
  timeline: z
    .object({
      dailyTrades: z
        .array(
          z.object({
            date: z.coerce.date(),
            trades: z.number().int().min(0),
            uniqueTraders: z.number().int().min(0),
          })
        )
        .optional(),
      hourlyDistribution: z
        .array(
          z.object({
            hour: z.number().int().min(0).max(23),
            tradeCount: z.number().int().min(0),
            averageValue: z.number().min(0).optional(),
          })
        )
        .optional(),
    })
    .optional(),
});

export type TradeOfferAnalytics = z.infer<typeof TradeOfferAnalyticsSchema>;

/**
 * Schema for trade offer configuration and behavioral settings
 */
export const TradeOfferConfigurationSchema = z.object({
  availability: z
    .object({
      restockSchedule: z
        .object({
          enabled: z.boolean().default(false),
          frequency: z.enum(["hourly", "daily", "weekly"]).optional(),
          amount: z.number().int().min(1).optional(),
          maxCapacity: z.number().int().min(1).optional(),
        })
        .optional(),
      dynamicPricing: z
        .object({
          enabled: z.boolean().default(false),
          basePriceMultiplier: z.number().min(0.1).max(10).default(1),
          demandMultiplier: z.number().min(0.1).max(5).default(1),
          scarcityMultiplier: z.number().min(0.1).max(5).default(1),
        })
        .optional(),
      rateLimiting: z
        .object({
          cooldownMinutes: z.number().int().min(0).max(1440).optional(),
          burstLimit: z.number().int().min(1).max(100).optional(),
          dailyLimit: z.number().int().min(1).optional(),
        })
        .optional(),
    })
    .optional(),
  targeting: z
    .object({
      userSegments: z
        .array(
          z.enum([
            "new_players",
            "veterans",
            "high_spenders",
            "casual_players",
            "collectors",
            "traders",
          ])
        )
        .optional(),
      levelRequirements: z
        .object({
          minLevel: z.number().int().min(1).optional(),
          maxLevel: z.number().int().min(1).optional(),
        })
        .optional(),
      achievementRequirements: z.array(z.string()).optional(),
      exclusionCriteria: z
        .object({
          bannedUsers: z.array(z.string()).optional(),
          restrictedRegions: z.array(z.string()).optional(),
          excludeSegments: z.array(z.string()).optional(),
        })
        .optional(),
    })
    .optional(),
  behavior: z
    .object({
      autoDisable: z
        .object({
          onSoldOut: z.boolean().default(true),
          onExpiry: z.boolean().default(true),
          onLowDemand: z.boolean().default(false),
          demandThreshold: z.number().min(0).max(1).optional(),
        })
        .optional(),
      notifications: z
        .object({
          onLowStock: z.boolean().default(true),
          stockThreshold: z.number().int().min(1).optional(),
          onHighDemand: z.boolean().default(true),
          demandThreshold: z.number().min(0).max(1).optional(),
        })
        .optional(),
      optimization: z
        .object({
          autoAdjustPricing: z.boolean().default(false),
          autoPromote: z.boolean().default(false),
          promotionThreshold: z.number().min(0).max(1).optional(),
        })
        .optional(),
    })
    .optional(),
  display: z
    .object({
      promotion: z
        .object({
          badge: z
            .enum(["hot", "new", "limited", "popular", "featured"])
            .optional(),
          highlightColor: z.string().optional(),
          flashSale: z.boolean().default(false),
          urgencyText: z.string().max(100).optional(),
        })
        .optional(),
      sorting: z
        .object({
          boostFactor: z.number().min(0).max(10).default(1),
          stickyDuration: z.number().int().min(0).optional(), // minutes
          categoryPriority: z.number().int().min(0).max(100).default(50),
        })
        .optional(),
    })
    .optional(),
});

export type TradeOfferConfiguration = z.infer<
  typeof TradeOfferConfigurationSchema
>;

// ============================================================================
// BASE SCHEMAS
// ============================================================================

/**
 * Base TradeOffer model schema - represents the complete TradeOffer entity
 */
export const TradeOfferSchema = z
  .object({
    id: z.string(),
    tradingEventId: z.string(),
    name: z.string(),
    description: z.string().nullable(),
    status: z.enum(["ACTIVE", "PAUSED", "SOLD_OUT", "EXPIRED"]),
    maxTotalTrades: z.number().int().nullable(),
    currentTrades: z.number().int(),
    maxPerUser: z.number().int().nullable(),
    startDate: z.date().nullable(),
    endDate: z.date().nullable(),
    displayOrder: z.number().int(),
    isHighlighted: z.boolean(),
    tags: z.array(z.string()),
    createdAt: z.date(),
    updatedAt: z.date(),
  })
  .strict();

export type TradeOffer = z.infer<typeof TradeOfferSchema>;

/**
 * TradeOffer input schema for forms and API inputs (without auto-generated fields)
 */
export const TradeOfferInputSchema = z
  .object({
    tradingEventId: z.string().min(1, "Trading event ID is required"),
    name: z
      .string()
      .min(1, "Offer name is required")
      .max(100, "Offer name too long"),
    description: z
      .string()
      .max(2000, "Description too long")
      .nullable()
      .optional(),
    status: z
      .enum(["ACTIVE", "PAUSED", "SOLD_OUT", "EXPIRED"])
      .default("ACTIVE"),
    maxTotalTrades: z
      .number()
      .int()
      .min(1, "Max total trades must be at least 1")
      .max(1000000, "Max total trades too high")
      .nullable()
      .optional(),
    currentTrades: z.number().int().min(0).default(0),
    maxPerUser: z
      .number()
      .int()
      .min(1, "Max per user must be at least 1")
      .max(1000, "Max per user too high")
      .nullable()
      .optional(),
    startDate: z.coerce.date().nullable().optional(),
    endDate: z.coerce.date().nullable().optional(),
    displayOrder: z
      .number()
      .int()
      .min(-1000, "Display order too low")
      .max(1000, "Display order too high")
      .default(0),
    isHighlighted: z.boolean().default(false),
    tags: z
      .array(z.string().max(50, "Tag too long"))
      .max(20, "Too many tags")
      .default([]),
  })
  .strict()
  .refine(
    (data) => {
      // Validate date ranges if both are provided
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
      // If max per user is set, it should be <= max total trades (if set)
      if (data.maxPerUser && data.maxTotalTrades) {
        return data.maxPerUser <= data.maxTotalTrades;
      }
      return true;
    },
    {
      message: "Max per user cannot exceed max total trades",
      path: ["maxPerUser"],
    }
  )
  .refine(
    (data) => {
      // Current trades should not exceed max total trades
      if (data.maxTotalTrades && data.currentTrades > data.maxTotalTrades) {
        return false;
      }
      return true;
    },
    {
      message: "Current trades cannot exceed max total trades",
      path: ["currentTrades"],
    }
  );

export type TradeOfferInput = z.infer<typeof TradeOfferInputSchema>;

// ============================================================================
// CREATE SCHEMAS
// ============================================================================

/**
 * Schema for creating a new TradeOffer
 * Compatible with Prisma TradeOfferCreateInput
 */
export const CreateTradeOfferSchema = z
  .object({
    id: z.string().optional(),
    tradingEventId: z.string().min(1, "Trading event ID is required"),
    name: z
      .string()
      .min(1, "Offer name is required")
      .max(100, "Offer name too long"),
    description: z
      .string()
      .max(2000, "Description too long")
      .nullable()
      .optional(),
    status: z
      .enum(["ACTIVE", "PAUSED", "SOLD_OUT", "EXPIRED"])
      .default("ACTIVE"),
    maxTotalTrades: z
      .number()
      .int()
      .min(1, "Max total trades must be at least 1")
      .max(1000000, "Max total trades too high")
      .nullable()
      .optional(),
    currentTrades: z.number().int().min(0).default(0),
    maxPerUser: z
      .number()
      .int()
      .min(1, "Max per user must be at least 1")
      .max(1000, "Max per user too high")
      .nullable()
      .optional(),
    startDate: z.coerce.date().nullable().optional(),
    endDate: z.coerce.date().nullable().optional(),
    displayOrder: z
      .number()
      .int()
      .min(-1000, "Display order too low")
      .max(1000, "Display order too high")
      .default(0),
    isHighlighted: z.boolean().default(false),
    tags: z
      .array(z.string().max(50, "Tag too long"))
      .max(20, "Too many tags")
      .default([]),
    createdAt: z.coerce.date().optional(),
    updatedAt: z.coerce.date().optional(),
  })
  .strict();

export type CreateTradeOfferInput = z.infer<typeof CreateTradeOfferSchema>;

/**
 * Simplified create schema for API endpoints with trade items
 */
export const CreateTradeOfferApiSchema = z
  .object({
    tradingEventId: z.string().min(1, "Trading event ID is required"),
    name: z
      .string()
      .min(1, "Offer name is required")
      .max(100, "Offer name too long"),
    description: z.string().max(2000, "Description too long").optional(),
    offerType: z
      .enum([
        "item_exchange",
        "currency_purchase",
        "resource_trade",
        "bundle_deal",
        "limited_time",
        "flash_sale",
      ])
      .default("item_exchange"),
    tradeItems: z
      .object({
        required: z
          .array(
            z.object({
              itemId: z.string().min(1, "Item ID is required"),
              quantity: z.number().int().min(1, "Quantity must be at least 1"),
              itemType: z
                .enum(["item", "currency", "resource"])
                .default("item"),
              minLevel: z.number().int().min(1).optional(),
            })
          )
          .min(1, "At least one required item must be specified"),
        rewards: z
          .array(
            z.object({
              itemId: z.string().min(1, "Item ID is required"),
              quantity: z.number().int().min(1, "Quantity must be at least 1"),
              itemType: z
                .enum(["item", "currency", "resource"])
                .default("item"),
              bonusChance: z.number().min(0).max(1).optional(), // For bonus rewards
            })
          )
          .min(1, "At least one reward item must be specified"),
      })
      .strict(),
    availability: z
      .object({
        maxTotalTrades: z.number().int().min(1).max(1000000).optional(),
        maxPerUser: z.number().int().min(1).max(1000).optional(),
        duration: z
          .object({
            hours: z.number().int().min(1).max(8760).optional(), // Max 1 year
            days: z.number().int().min(1).max(365).optional(),
            startDate: z.coerce.date().optional(),
            endDate: z.coerce.date().optional(),
          })
          .optional(),
        restockable: z.boolean().default(false),
        restockAmount: z.number().int().min(1).optional(),
      })
      .optional(),
    display: z
      .object({
        isHighlighted: z.boolean().default(false),
        displayOrder: z.number().int().min(-1000).max(1000).default(0),
        promotionBadge: z
          .enum(["hot", "new", "limited", "popular", "featured"])
          .optional(),
        urgencyText: z.string().max(100).optional(),
      })
      .optional(),
    targeting: z
      .object({
        minUserLevel: z.number().int().min(1).optional(),
        maxUserLevel: z.number().int().min(1).optional(),
        requiredAchievements: z.array(z.string()).optional(),
        excludedUsers: z.array(z.string()).optional(),
      })
      .optional(),
    tags: z
      .array(z.string().max(50, "Tag too long"))
      .max(20, "Too many tags")
      .default([]),
    autoActivate: z.boolean().default(true),
    validateItems: z.boolean().default(true),
    recordActivity: z.boolean().default(true),
  })
  .strict();

export type CreateTradeOfferApi = z.infer<typeof CreateTradeOfferApiSchema>;

/**
 * Schema for cloning/duplicating a trade offer
 */
export const CloneTradeOfferSchema = z
  .object({
    sourceOfferId: z.string().min(1, "Source offer ID is required"),
    targetEventId: z.string().min(1, "Target event ID is required"),
    newName: z
      .string()
      .min(1, "Offer name is required")
      .max(100, "Offer name too long")
      .optional(),
    newDescription: z.string().max(2000, "Description too long").optional(),
    copyItems: z.boolean().default(true),
    copyAvailability: z.boolean().default(true),
    copyDisplaySettings: z.boolean().default(true),
    copyTags: z.boolean().default(true),
    adjustments: z
      .object({
        availabilityMultiplier: z.number().min(0.1).max(10).default(1),
        displayOrderOffset: z.number().int().min(-1000).max(1000).default(0),
        statusOverride: z.enum(["ACTIVE", "PAUSED"]).optional(),
        highlightOverride: z.boolean().optional(),
      })
      .optional(),
    cloneReason: z
      .enum([
        "template_reuse",
        "event_migration",
        "testing",
        "variation_creation",
        "backup",
        "seasonal_repeat",
        "other",
      ])
      .optional(),
    recordActivity: z.boolean().default(true),
  })
  .strict();

export type CloneTradeOffer = z.infer<typeof CloneTradeOfferSchema>;

// ============================================================================
// UPDATE SCHEMAS
// ============================================================================

/**
 * Schema for updating a TradeOffer
 * Compatible with Prisma TradeOfferUpdateInput
 */
export const UpdateTradeOfferSchema = z
  .object({
    id: z.string().optional(),
    tradingEventId: z
      .string()
      .min(1, "Trading event ID is required")
      .optional(),
    name: z
      .string()
      .min(1, "Offer name is required")
      .max(100, "Offer name too long")
      .optional(),
    description: z
      .string()
      .max(2000, "Description too long")
      .nullable()
      .optional(),
    status: z.enum(["ACTIVE", "PAUSED", "SOLD_OUT", "EXPIRED"]).optional(),
    maxTotalTrades: z
      .number()
      .int()
      .min(1, "Max total trades must be at least 1")
      .max(1000000, "Max total trades too high")
      .nullable()
      .optional(),
    currentTrades: z.number().int().min(0).optional(),
    maxPerUser: z
      .number()
      .int()
      .min(1, "Max per user must be at least 1")
      .max(1000, "Max per user too high")
      .nullable()
      .optional(),
    startDate: z.coerce.date().nullable().optional(),
    endDate: z.coerce.date().nullable().optional(),
    displayOrder: z
      .number()
      .int()
      .min(-1000, "Display order too low")
      .max(1000, "Display order too high")
      .optional(),
    isHighlighted: z.boolean().optional(),
    tags: z
      .array(z.string().max(50, "Tag too long"))
      .max(20, "Too many tags")
      .optional(),
    createdAt: z.coerce.date().optional(),
    updatedAt: z.coerce.date().optional(),
  })
  .strict();

export type UpdateTradeOfferInput = z.infer<typeof UpdateTradeOfferSchema>;

/**
 * Schema for updating offer status with validation
 */
export const UpdateOfferStatusSchema = z
  .object({
    offerId: z.string().min(1, "Offer ID is required"),
    newStatus: z.enum(["ACTIVE", "PAUSED", "SOLD_OUT", "EXPIRED"]),
    reason: z
      .enum([
        "manual",
        "automatic",
        "sold_out",
        "expired",
        "admin_action",
        "system_maintenance",
        "event_ended",
        "low_demand",
        "high_demand",
      ])
      .optional(),
    notes: z.string().max(500).optional(),
    notifyUsers: z.boolean().default(false),
    validateTransition: z.boolean().default(true),
    recordActivity: z.boolean().default(true),
    forceUpdate: z.boolean().default(false),
  })
  .strict();

export type UpdateOfferStatus = z.infer<typeof UpdateOfferStatusSchema>;

/**
 * Schema for updating offer availability
 */
export const UpdateOfferAvailabilitySchema = z
  .object({
    offerId: z.string().min(1, "Offer ID is required"),
    availability: z
      .object({
        maxTotalTrades: z.number().int().min(0).optional(),
        maxPerUser: z.number().int().min(0).optional(),
        additionalStock: z.number().int().min(0).optional(), // Add to current max
        resetCurrentTrades: z.boolean().default(false),
      })
      .refine(
        (data) => {
          if (data.maxPerUser && data.maxTotalTrades) {
            return data.maxPerUser <= data.maxTotalTrades;
          }
          return true;
        },
        {
          message: "Max per user cannot exceed max total trades",
          path: ["maxPerUser"],
        }
      ),
    reason: z
      .enum([
        "restock",
        "adjustment",
        "promotion",
        "demand_response",
        "admin_action",
        "system_correction",
      ])
      .optional(),
    notifyUsers: z.boolean().default(false),
    recordActivity: z.boolean().default(true),
    updateNotes: z.string().max(500).optional(),
  })
  .strict();

export type UpdateOfferAvailability = z.infer<
  typeof UpdateOfferAvailabilitySchema
>;

/**
 * Schema for reordering trade offers
 */
export const ReorderTradeOffersSchema = z
  .object({
    eventId: z.string().min(1, "Event ID is required"),
    offerOrder: z
      .array(
        z.object({
          offerId: z.string().min(1, "Offer ID is required"),
          newDisplayOrder: z.number().int().min(-1000).max(1000),
        })
      )
      .min(1, "At least one offer must be specified"),
    reorderReason: z
      .enum([
        "manual_sort",
        "performance_optimization",
        "promotional_boost",
        "seasonal_adjustment",
        "admin_decision",
        "algorithm_optimization",
      ])
      .optional(),
    validateOffers: z.boolean().default(true),
    recordActivity: z.boolean().default(true),
  })
  .strict();

export type ReorderTradeOffers = z.infer<typeof ReorderTradeOffersSchema>;

/**
 * Partial update schema - all fields optional
 */
export const PartialUpdateTradeOfferSchema = TradeOfferInputSchema.partial();

export type PartialUpdateTradeOffer = z.infer<
  typeof PartialUpdateTradeOfferSchema
>;

// ============================================================================
// TRADE OFFER MANAGEMENT SCHEMAS
// ============================================================================

/**
 * Schema for bulk trade offer operations
 */
export const BulkTradeOfferOperationSchema = z
  .object({
    operation: z.enum([
      "create_multiple",
      "update_multiple",
      "delete_multiple",
      "activate_multiple",
      "pause_multiple",
      "highlight_multiple",
      "restock_multiple",
      "migrate_multiple",
    ]),
    offerIds: z
      .array(z.string().min(1))
      .min(1, "At least one offer is required")
      .max(100, "Too many offers for bulk operation"),
    operationData: z
      .object({
        updateData: z.record(z.string(), z.unknown()).optional(),
        statusChange: z
          .object({
            newStatus: z.enum(["ACTIVE", "PAUSED", "SOLD_OUT", "EXPIRED"]),
            reason: z.string().optional(),
          })
          .optional(),
        availabilityChange: z
          .object({
            stockMultiplier: z.number().min(0.1).max(10).optional(),
            additionalStock: z.number().int().min(0).optional(),
            newMaxPerUser: z.number().int().min(1).optional(),
          })
          .optional(),
        migrationTarget: z
          .object({
            targetEventId: z.string().min(1).optional(),
            preserveStats: z.boolean().default(true),
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

export type BulkTradeOfferOperation = z.infer<
  typeof BulkTradeOfferOperationSchema
>;

/**
 * Schema for analyzing trade offer performance
 */
export const AnalyzeOfferPerformanceSchema = z
  .object({
    offerId: z.string().min(1, "Offer ID is required"),
    analysisType: z
      .enum([
        "trading_activity",
        "user_engagement",
        "economic_impact",
        "competitive_analysis",
        "optimization_suggestions",
        "trend_analysis",
        "all",
      ])
      .default("all"),
    timeRange: z
      .object({
        startDate: z.coerce.date(),
        endDate: z.coerce.date(),
      })
      .optional(),
    compareWith: z
      .array(z.string())
      .max(5, "Too many offers for comparison")
      .optional(),
    includeUserSegmentation: z.boolean().default(true),
    includeRecommendations: z.boolean().default(true),
    generateReport: z.boolean().default(false),
    reportFormat: z.enum(["json", "csv", "pdf"]).default("json"),
  })
  .strict();

export type AnalyzeOfferPerformance = z.infer<
  typeof AnalyzeOfferPerformanceSchema
>;

/**
 * Schema for offer promotion and marketing
 */
export const PromoteOfferSchema = z
  .object({
    offerId: z.string().min(1, "Offer ID is required"),
    promotion: z
      .object({
        type: z.enum([
          "highlight",
          "flash_sale",
          "limited_time",
          "featured",
          "trending",
          "bonus_rewards",
        ]),
        duration: z
          .object({
            hours: z.number().int().min(1).max(168).optional(), // Max 1 week
            endDate: z.coerce.date().optional(),
          })
          .optional(),
        settings: z
          .object({
            highlightColor: z.string().optional(),
            badge: z
              .enum(["hot", "new", "limited", "popular", "featured"])
              .optional(),
            urgencyText: z.string().max(100).optional(),
            flashSaleDiscount: z.number().min(0).max(0.9).optional(), // Max 90% off
            bonusMultiplier: z.number().min(1).max(5).optional(),
          })
          .optional(),
      })
      .strict(),
    targeting: z
      .object({
        userSegments: z.array(z.string()).optional(),
        notificationChannels: z
          .array(z.enum(["email", "push", "in_game", "social"]))
          .optional(),
        excludeUsers: z.array(z.string()).optional(),
      })
      .optional(),
    validation: z
      .object({
        checkAvailability: z.boolean().default(true),
        checkEventStatus: z.boolean().default(true),
        checkUserLimits: z.boolean().default(true),
      })
      .optional(),
    recordActivity: z.boolean().default(true),
    promotionNotes: z.string().max(500).optional(),
  })
  .strict();

export type PromoteOffer = z.infer<typeof PromoteOfferSchema>;

// ============================================================================
// QUERY SCHEMAS
// ============================================================================

/**
 * Schema for finding a unique TradeOffer
 */
export const FindUniqueTradeOfferSchema = z
  .object({
    id: z.string().optional(),
  })
  .strict();

export type FindUniqueTradeOfferInput = z.infer<
  typeof FindUniqueTradeOfferSchema
>;

/**
 * Schema for filtering TradeOffers
 */
export const TradeOfferWhereSchema: z.ZodType<any> = z.lazy(() =>
  z
    .object({
      id: z.string().optional(),
      tradingEventId: z.string().optional(),
      name: z.string().optional(),
      description: z.string().nullable().optional(),
      status: z.enum(["ACTIVE", "PAUSED", "SOLD_OUT", "EXPIRED"]).optional(),
      maxTotalTrades: z.number().int().nullable().optional(),
      currentTrades: z.number().int().optional(),
      maxPerUser: z.number().int().nullable().optional(),
      startDate: z.date().nullable().optional(),
      endDate: z.date().nullable().optional(),
      displayOrder: z.number().int().optional(),
      isHighlighted: z.boolean().optional(),
      createdAt: z.date().optional(),
      updatedAt: z.date().optional(),
      AND: z.array(TradeOfferWhereSchema).optional(),
      OR: z.array(TradeOfferWhereSchema).optional(),
      NOT: TradeOfferWhereSchema.optional(),
    })
    .strict()
);

export type TradeOfferWhere = z.infer<typeof TradeOfferWhereSchema>;

/**
 * Schema for ordering TradeOffers
 */
export const TradeOfferOrderBySchema = z
  .object({
    id: z.enum(["asc", "desc"]).optional(),
    tradingEventId: z.enum(["asc", "desc"]).optional(),
    name: z.enum(["asc", "desc"]).optional(),
    description: z.enum(["asc", "desc"]).optional(),
    status: z.enum(["asc", "desc"]).optional(),
    maxTotalTrades: z.enum(["asc", "desc"]).optional(),
    currentTrades: z.enum(["asc", "desc"]).optional(),
    maxPerUser: z.enum(["asc", "desc"]).optional(),
    startDate: z.enum(["asc", "desc"]).optional(),
    endDate: z.enum(["asc", "desc"]).optional(),
    displayOrder: z.enum(["asc", "desc"]).optional(),
    isHighlighted: z.enum(["asc", "desc"]).optional(),
    createdAt: z.enum(["asc", "desc"]).optional(),
    updatedAt: z.enum(["asc", "desc"]).optional(),
  })
  .strict();

export type TradeOfferOrderBy = z.infer<typeof TradeOfferOrderBySchema>;

/**
 * Schema for selecting TradeOffer fields
 */
export const TradeOfferSelectSchema = z
  .object({
    id: z.boolean().optional(),
    tradingEventId: z.boolean().optional(),
    name: z.boolean().optional(),
    description: z.boolean().optional(),
    status: z.boolean().optional(),
    maxTotalTrades: z.boolean().optional(),
    currentTrades: z.boolean().optional(),
    maxPerUser: z.boolean().optional(),
    startDate: z.boolean().optional(),
    endDate: z.boolean().optional(),
    displayOrder: z.boolean().optional(),
    isHighlighted: z.boolean().optional(),
    tags: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    updatedAt: z.boolean().optional(),
    tradingEvent: z.boolean().optional(),
    tradeItems: z.boolean().optional(),
    userTrades: z.boolean().optional(),
  })
  .strict();

export type TradeOfferSelect = z.infer<typeof TradeOfferSelectSchema>;

/**
 * Schema for including TradeOffer relations
 */
export const TradeOfferIncludeSchema = z
  .object({
    tradingEvent: z.boolean().optional(),
    tradeItems: z.boolean().optional(),
    userTrades: z.boolean().optional(),
  })
  .strict();

export type TradeOfferInclude = z.infer<typeof TradeOfferIncludeSchema>;

// ============================================================================
// PAGINATION SCHEMAS
// ============================================================================

/**
 * Schema for paginated TradeOffer queries
 */
export const FindManyTradeOffersSchema = z
  .object({
    where: TradeOfferWhereSchema.optional(),
    orderBy: z
      .union([TradeOfferOrderBySchema, z.array(TradeOfferOrderBySchema)])
      .optional(),
    select: TradeOfferSelectSchema.optional(),
    include: TradeOfferIncludeSchema.optional(),
    skip: z.number().int().min(0).optional(),
    take: z.number().int().min(1).max(1000).optional(),
    cursor: FindUniqueTradeOfferSchema.optional(),
  })
  .strict();

export type FindManyTradeOffersInput = z.infer<
  typeof FindManyTradeOffersSchema
>;

// ============================================================================
// VALIDATION HELPERS
// ============================================================================

/**
 * Schema for searching trade offers
 */
export const SearchTradeOffersSchema = z
  .object({
    query: z.string().max(200).optional(),
    eventId: z.string().optional(),
    status: z.enum(["ACTIVE", "PAUSED", "SOLD_OUT", "EXPIRED"]).optional(),
    isHighlighted: z.boolean().optional(),
    isAvailable: z.boolean().optional(), // Has remaining trades
    tags: z.array(z.string()).max(10).optional(),
    startingAfter: z.coerce.date().optional(),
    startingBefore: z.coerce.date().optional(),
    endingAfter: z.coerce.date().optional(),
    endingBefore: z.coerce.date().optional(),
    createdAfter: z.coerce.date().optional(),
    createdBefore: z.coerce.date().optional(),
    minTradesRemaining: z.number().int().min(0).optional(),
    maxTradesRemaining: z.number().int().min(0).optional(),
    minDisplayOrder: z.number().int().optional(),
    maxDisplayOrder: z.number().int().optional(),
    includeAnalytics: z.boolean().default(false),
    includeItemCount: z.boolean().default(true),
    includeTradeCount: z.boolean().default(true),
    sortBy: z
      .enum([
        "relevance",
        "name",
        "status",
        "availability",
        "popularity",
        "start_date",
        "end_date",
        "display_order",
        "created_date",
        "trade_count",
      ])
      .default("display_order"),
    sortOrder: z.enum(["asc", "desc"]).default("asc"),
    limit: z.number().int().min(1).max(100).default(20),
  })
  .strict();

export type SearchTradeOffers = z.infer<typeof SearchTradeOffersSchema>;

/**
 * Schema for validating trade execution
 */
export const ValidateTradeExecutionSchema = z
  .object({
    offerId: z.string().min(1, "Offer ID is required"),
    userId: z.string().min(1, "User ID is required"),
    quantity: z.number().int().min(1).default(1),
    checkAvailability: z.boolean().default(true),
    checkUserLimits: z.boolean().default(true),
    checkUserInventory: z.boolean().default(true),
    checkTiming: z.boolean().default(true),
    checkEventStatus: z.boolean().default(true),
    includeReasons: z.boolean().default(true),
    dryRun: z.boolean().default(false), // Don't actually execute
  })
  .strict();

export type ValidateTradeExecution = z.infer<
  typeof ValidateTradeExecutionSchema
>;

/**
 * Schema for getting offer statistics
 */
export const GetOfferStatsSchema = z
  .object({
    offerId: z.string().min(1, "Offer ID is required"),
    includeRealTime: z.boolean().default(true),
    includeHistorical: z.boolean().default(false),
    includeUserSegmentation: z.boolean().default(false),
    timeRange: z
      .object({
        startDate: z.coerce.date(),
        endDate: z.coerce.date(),
      })
      .optional(),
    granularity: z.enum(["hourly", "daily", "weekly"]).default("daily"),
    compareWithSimilar: z.boolean().default(false),
  })
  .strict();

export type GetOfferStats = z.infer<typeof GetOfferStatsSchema>;

// ============================================================================
// RESPONSE SCHEMAS
// ============================================================================

/**
 * Schema for TradeOffer API responses
 */
export const TradeOfferResponseSchema = TradeOfferSchema;

export type TradeOfferResponse = z.infer<typeof TradeOfferResponseSchema>;

/**
 * Schema for TradeOffer with related data
 */
export const TradeOfferWithRelationsSchema = TradeOfferResponseSchema.extend({
  tradingEvent: z
    .object({
      id: z.string(),
      name: z.string(),
      status: z.string(),
      startDate: z.date().nullable(),
      endDate: z.date().nullable(),
      isPublic: z.boolean(),
    })
    .optional(),
  tradeItems: z
    .array(
      z.object({
        id: z.string(),
        itemId: z.string(),
        itemType: z.string(),
        quantity: z.number().int(),
        minLevel: z.number().int().nullable(),
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

export type TradeOfferWithRelations = z.infer<
  typeof TradeOfferWithRelationsSchema
>;

/**
 * Schema for TradeOffer summary (minimal info)
 */
export const TradeOfferSummarySchema = z
  .object({
    id: z.string(),
    name: z.string(),
    description: z.string().nullable(),
    status: z.string(),
    startDate: z.date().nullable(),
    endDate: z.date().nullable(),
    maxTotalTrades: z.number().int().nullable(),
    currentTrades: z.number().int(),
    maxPerUser: z.number().int().nullable(),
    displayOrder: z.number().int(),
    isHighlighted: z.boolean(),
    tags: z.array(z.string()),
    tradesRemaining: z.number().int().nullable(),
    isAvailable: z.boolean(),
    itemCount: z.number().int().min(0),
    participantCount: z.number().int().min(0),
    popularityScore: z.number().min(0).max(1),
    createdAt: z.date(),
  })
  .strict();

export type TradeOfferSummary = z.infer<typeof TradeOfferSummarySchema>;

/**
 * Schema for trade offer operation result
 */
export const TradeOfferOperationResultSchema = z
  .object({
    operation: z.string(),
    offerId: z.string(),
    success: z.boolean(),
    changes: z.object({
      statusBefore: z.string().optional(),
      statusAfter: z.string().optional(),
      availabilityBefore: z
        .object({
          maxTotal: z.number().int().nullable(),
          current: z.number().int(),
          maxPerUser: z.number().int().nullable(),
        })
        .optional(),
      availabilityAfter: z
        .object({
          maxTotal: z.number().int().nullable(),
          current: z.number().int(),
          maxPerUser: z.number().int().nullable(),
        })
        .optional(),
      fieldChanges: z.record(z.string(), z.unknown()).optional(),
      itemsAffected: z.number().int().min(0).optional(),
      tradesAffected: z.number().int().min(0).optional(),
    }),
    timing: z.object({
      executedAt: z.date(),
      executionTime: z.number().min(0), // milliseconds
      scheduledFor: z.date().optional(),
    }),
    validation: z.object({
      passed: z.boolean(),
      warnings: z.array(z.string()).optional(),
      errors: z.array(z.string()).optional(),
    }),
    impact: z.object({
      usersAffected: z.number().int().min(0).optional(),
      economicImpact: z.number().optional(),
      availabilityChange: z.number().optional(),
    }),
    recommendations: z.array(z.string()).optional(),
    transactionId: z.string().optional(),
    metadata: z.record(z.string(), z.unknown()).optional(),
  })
  .strict();

export type TradeOfferOperationResult = z.infer<
  typeof TradeOfferOperationResultSchema
>;

/**
 * Schema for trade offer analytics result
 */
export const TradeOfferAnalyticsResultSchema = z
  .object({
    offerId: z.string(),
    offerName: z.string(),
    analysisDate: z.date(),
    timeRange: z.object({
      startDate: z.date(),
      endDate: z.date(),
    }),
    summary: z.object({
      status: z.string(),
      availability: z.object({
        maxTotal: z.number().int().nullable(),
        current: z.number().int(),
        remaining: z.number().int().nullable(),
        utilizationRate: z.number().min(0).max(1),
      }),
      activity: z.object({
        totalTrades: z.number().int().min(0),
        uniqueTraders: z.number().int().min(0),
        averageTradesPerUser: z.number().min(0),
        tradingVelocity: z.number().min(0), // trades per hour
      }),
    }),
    performance: z.object({
      popularityScore: z.number().min(0).max(1),
      engagementScore: z.number().min(0).max(1),
      conversionRate: z.number().min(0).max(1),
      retentionRate: z.number().min(0).max(1),
      competitiveIndex: z.number().min(0).max(1),
      trendingScore: z.number().min(0).max(1),
    }),
    economy: z.object({
      totalValue: z.number().min(0),
      averageTradeValue: z.number().min(0),
      economicImpact: z.number(),
      itemFlow: z.object({
        itemsGiven: z.record(z.string(), z.number().int().min(0)),
        itemsReceived: z.record(z.string(), z.number().int().min(0)),
        netFlow: z.record(z.string(), z.number().int()),
      }),
    }),
    users: z.object({
      segments: z.record(z.string(), z.number().int().min(0)),
      topTraders: z.array(
        z.object({
          userId: z.string(),
          username: z.string().optional(),
          tradeCount: z.number().int().min(0),
          totalValue: z.number().min(0),
        })
      ),
      behaviorPatterns: z.record(z.string(), z.unknown()),
    }),
    timeline: z.object({
      dailyTrades: z.array(
        z.object({
          date: z.date(),
          trades: z.number().int().min(0),
          uniqueTraders: z.number().int().min(0),
          value: z.number().min(0),
        })
      ),
      hourlyDistribution: z.array(
        z.object({
          hour: z.number().int().min(0).max(23),
          tradeCount: z.number().int().min(0),
          averageValue: z.number().min(0),
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
          "availability",
          "pricing",
          "promotion",
          "timing",
          "targeting",
          "items",
        ]),
        priority: z.enum(["low", "medium", "high", "urgent"]),
        description: z.string(),
        expectedImpact: z.enum(["low", "medium", "high"]),
        implementation: z.enum(["easy", "medium", "hard"]),
      })
    ),
  })
  .strict();

export type TradeOfferAnalyticsResult = z.infer<
  typeof TradeOfferAnalyticsResultSchema
>;

// ============================================================================
// ADMIN SCHEMAS
// ============================================================================

/**
 * Schema for admin trade offer management
 */
export const AdminTradeOfferManagementSchema = z
  .object({
    action: z.enum([
      "list_all_offers",
      "moderate_offers",
      "generate_offer_report",
      "cleanup_expired_offers",
      "analyze_offer_trends",
      "bulk_update_offers",
      "audit_offers",
      "optimize_offers",
    ]),
    filters: z
      .object({
        eventId: z.string().optional(),
        status: z.enum(["ACTIVE", "PAUSED", "SOLD_OUT", "EXPIRED"]).optional(),
        isHighlighted: z.boolean().optional(),
        createdAfter: z.coerce.date().optional(),
        createdBefore: z.coerce.date().optional(),
        hasAvailability: z.boolean().optional(),
        lowPerformance: z.boolean().optional(),
        needsModeration: z.boolean().optional(),
      })
      .optional(),
    operationOptions: z
      .object({
        validateChanges: z.boolean().default(true),
        notifyEventCreators: z.boolean().default(false),
        notifyTraders: z.boolean().default(false),
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

export type AdminTradeOfferManagement = z.infer<
  typeof AdminTradeOfferManagementSchema
>;

// ============================================================================
// EXPORTS
// ============================================================================

// All schemas are defined above and exported individually

// Export all validation functions
export const TradeOfferValidation = {
  // Base schemas
  model: TradeOfferSchema,
  input: TradeOfferInputSchema,

  // CRUD schemas
  create: CreateTradeOfferSchema,
  createApi: CreateTradeOfferApiSchema,
  clone: CloneTradeOfferSchema,
  update: UpdateTradeOfferSchema,
  partialUpdate: PartialUpdateTradeOfferSchema,

  // Offer management schemas
  updateStatus: UpdateOfferStatusSchema,
  updateAvailability: UpdateOfferAvailabilitySchema,
  reorder: ReorderTradeOffersSchema,
  promote: PromoteOfferSchema,
  bulkOperation: BulkTradeOfferOperationSchema,
  analyzePerformance: AnalyzeOfferPerformanceSchema,

  // Query schemas
  findUnique: FindUniqueTradeOfferSchema,
  findMany: FindManyTradeOffersSchema,
  where: TradeOfferWhereSchema,
  orderBy: TradeOfferOrderBySchema,
  select: TradeOfferSelectSchema,
  include: TradeOfferIncludeSchema,

  // Helpers
  search: SearchTradeOffersSchema,
  validateExecution: ValidateTradeExecutionSchema,
  getStats: GetOfferStatsSchema,

  // Response schemas
  response: TradeOfferResponseSchema,
  withRelations: TradeOfferWithRelationsSchema,
  summary: TradeOfferSummarySchema,
  operationResult: TradeOfferOperationResultSchema,
  analyticsResult: TradeOfferAnalyticsResultSchema,

  // Admin schemas
  adminManagement: AdminTradeOfferManagementSchema,

  // Component schemas
  analytics: TradeOfferAnalyticsSchema,
  configuration: TradeOfferConfigurationSchema,
} as const;
