import { z } from "zod";

// ============================================================================
// TRADE OFFER ITEM METADATA SCHEMAS
// ============================================================================

/**
 * Schema for trade offer item analytics and tracking
 */
export const TradeOfferItemAnalyticsSchema = z.object({
  usage: z
    .object({
      timesTraded: z.number().int().min(0).default(0),
      totalQuantityTraded: z.number().int().min(0).default(0),
      uniqueTraders: z.number().int().min(0).default(0),
      averageQuantityPerTrade: z.number().min(0).default(0),
      tradingFrequency: z.number().min(0).default(0), // trades per day
    })
    .optional(),
  popularity: z
    .object({
      demandScore: z.number().min(0).max(1).default(0),
      popularityRank: z.number().int().min(1).optional(),
      trendingScore: z.number().min(0).max(1).default(0),
      userPreferenceScore: z.number().min(0).max(1).default(0),
      competitiveIndex: z.number().min(0).max(1).default(0),
    })
    .optional(),
  economics: z
    .object({
      totalValue: z.number().min(0).default(0),
      averageValuePerUnit: z.number().min(0).default(0),
      marketImpact: z.number().default(0), // Can be negative
      inflationEffect: z.number().default(0),
      scarcityMultiplier: z.number().min(0).default(1),
    })
    .optional(),
  distribution: z
    .object({
      byUserLevel: z.record(z.string(), z.number().int().min(0)).optional(),
      byRegion: z.record(z.string(), z.number().int().min(0)).optional(),
      byTimeOfDay: z.record(z.string(), z.number().int().min(0)).optional(),
      byTradeType: z.record(z.string(), z.number().int().min(0)).optional(),
    })
    .optional(),
  efficiency: z
    .object({
      conversionRate: z.number().min(0).max(1).default(0),
      completionRate: z.number().min(0).max(1).default(0),
      userSatisfactionScore: z.number().min(0).max(5).default(0),
      tradeVelocity: z.number().min(0).default(0), // trades per hour
    })
    .optional(),
});

export type TradeOfferItemAnalytics = z.infer<
  typeof TradeOfferItemAnalyticsSchema
>;

/**
 * Schema for trade offer item configuration and behavior
 */
export const TradeOfferItemConfigurationSchema = z.object({
  requirements: z
    .object({
      levelRequirements: z
        .object({
          minLevel: z.number().int().min(1).optional(),
          maxLevel: z.number().int().min(1).optional(),
          strictEnforcement: z.boolean().default(true),
        })
        .optional(),
      itemRequirements: z
        .object({
          minQuantityInInventory: z.number().int().min(0).optional(),
          requireExactMatch: z.boolean().default(true),
          allowSubstitutes: z.boolean().default(false),
          substituteItems: z.array(z.string()).optional(),
        })
        .optional(),
      temporalRequirements: z
        .object({
          availableAfter: z.coerce.date().optional(),
          availableUntil: z.coerce.date().optional(),
          timeZoneRestrictions: z.array(z.string()).optional(),
          dayOfWeekRestrictions: z
            .array(z.number().int().min(0).max(6))
            .optional(),
        })
        .optional(),
    })
    .optional(),
  behavior: z
    .object({
      quantityRules: z
        .object({
          allowPartialQuantity: z.boolean().default(false),
          minQuantityPerTrade: z.number().int().min(1).optional(),
          maxQuantityPerTrade: z.number().int().min(1).optional(),
          quantitySteps: z.number().int().min(1).default(1), // increment steps
        })
        .optional(),
      validation: z
        .object({
          validateItemExistence: z.boolean().default(true),
          validateUserOwnership: z.boolean().default(true),
          validateQuantityAvailability: z.boolean().default(true),
          allowBackorders: z.boolean().default(false),
        })
        .optional(),
      automation: z
        .object({
          autoAdjustQuantity: z.boolean().default(false),
          autoSubstitute: z.boolean().default(false),
          autoDisableOnUnavailable: z.boolean().default(true),
          notifyOnLowStock: z.boolean().default(true),
        })
        .optional(),
    })
    .optional(),
  display: z
    .object({
      presentation: z
        .object({
          showItemDetails: z.boolean().default(true),
          showQuantityRemaining: z.boolean().default(true),
          showValueEstimate: z.boolean().default(false),
          customDisplayName: z.string().max(100).optional(),
          customDescription: z.string().max(500).optional(),
        })
        .optional(),
      highlighting: z
        .object({
          isHighValue: z.boolean().default(false),
          isRare: z.boolean().default(false),
          isLimited: z.boolean().default(false),
          badgeText: z.string().max(20).optional(),
          highlightColor: z.string().optional(),
        })
        .optional(),
    })
    .optional(),
  rewards: z
    .object({
      bonusChances: z
        .object({
          bonusQuantityChance: z.number().min(0).max(1).default(0),
          bonusQuantityMultiplier: z.number().min(1).max(10).default(1),
          rareBonusChance: z.number().min(0).max(1).default(0),
          rareBonusItems: z.array(z.string()).optional(),
        })
        .optional(),
      conditions: z
        .object({
          streakBonus: z
            .object({
              enabled: z.boolean().default(false),
              streakThreshold: z.number().int().min(2).default(3),
              bonusMultiplier: z.number().min(1).max(5).default(1.5),
            })
            .optional(),
          firstTimeBonus: z
            .object({
              enabled: z.boolean().default(false),
              bonusMultiplier: z.number().min(1).max(3).default(1.2),
            })
            .optional(),
        })
        .optional(),
    })
    .optional(),
});

export type TradeOfferItemConfiguration = z.infer<
  typeof TradeOfferItemConfigurationSchema
>;

// ============================================================================
// BASE SCHEMAS
// ============================================================================

/**
 * Base TradeOfferItem model schema - represents the complete TradeOfferItem entity
 */
export const TradeOfferItemSchema = z
  .object({
    id: z.string(),
    tradeOfferId: z.string(),
    itemId: z.string(),
    itemType: z.enum(["REQUIRED", "REWARD"]),
    quantity: z.number().int(),
    minLevel: z.number().int().nullable(),
    createdAt: z.date(),
    updatedAt: z.date(),
  })
  .strict();

export type TradeOfferItem = z.infer<typeof TradeOfferItemSchema>;

/**
 * TradeOfferItem input schema for forms and API inputs (without auto-generated fields)
 */
export const TradeOfferItemInputSchema = z
  .object({
    tradeOfferId: z.string().min(1, "Trade offer ID is required"),
    itemId: z.string().min(1, "Item ID is required"),
    itemType: z.enum(["REQUIRED", "REWARD"]),
    quantity: z
      .number()
      .int()
      .min(1, "Quantity must be at least 1")
      .max(999999999, "Quantity too high"),
    minLevel: z
      .number()
      .int()
      .min(1, "Minimum level must be at least 1")
      .max(1000, "Minimum level too high")
      .nullable()
      .optional(),
  })
  .strict()
  .refine(
    (data) => {
      // Required items should generally have reasonable quantities
      if (data.itemType === "REQUIRED" && data.quantity > 1000000) {
        return false;
      }
      return true;
    },
    {
      message: "Required item quantities should be reasonable",
      path: ["quantity"],
    }
  )
  .refine(
    (data) => {
      // Reward items should have positive quantities
      if (data.itemType === "REWARD" && data.quantity <= 0) {
        return false;
      }
      return true;
    },
    {
      message: "Reward quantities must be positive",
      path: ["quantity"],
    }
  );

export type TradeOfferItemInput = z.infer<typeof TradeOfferItemInputSchema>;

// ============================================================================
// CREATE SCHEMAS
// ============================================================================

/**
 * Schema for creating a new TradeOfferItem
 * Compatible with Prisma TradeOfferItemCreateInput
 */
export const CreateTradeOfferItemSchema = z
  .object({
    id: z.string().optional(),
    tradeOfferId: z.string().min(1, "Trade offer ID is required"),
    itemId: z.string().min(1, "Item ID is required"),
    itemType: z.enum(["REQUIRED", "REWARD"]),
    quantity: z
      .number()
      .int()
      .min(1, "Quantity must be at least 1")
      .max(999999999, "Quantity too high"),
    minLevel: z
      .number()
      .int()
      .min(1, "Minimum level must be at least 1")
      .max(1000, "Minimum level too high")
      .nullable()
      .optional(),
    createdAt: z.coerce.date().optional(),
    updatedAt: z.coerce.date().optional(),
  })
  .strict();

export type CreateTradeOfferItemInput = z.infer<
  typeof CreateTradeOfferItemSchema
>;

/**
 * Simplified create schema for API endpoints with enhanced validation
 */
export const CreateTradeOfferItemApiSchema = z
  .object({
    tradeOfferId: z.string().min(1, "Trade offer ID is required"),
    itemId: z.string().min(1, "Item ID is required"),
    itemType: z.enum(["REQUIRED", "REWARD"]),
    quantity: z
      .number()
      .int()
      .min(1, "Quantity must be at least 1")
      .max(999999999, "Quantity too high"),
    itemDetails: z
      .object({
        validateExistence: z.boolean().default(true),
        validateCompatibility: z.boolean().default(true),
        allowSubstitutes: z.boolean().default(false),
        substituteItems: z.array(z.string()).optional(),
      })
      .optional(),
    requirements: z
      .object({
        minLevel: z
          .number()
          .int()
          .min(1, "Minimum level must be at least 1")
          .max(1000, "Minimum level too high")
          .optional(),
        maxLevel: z
          .number()
          .int()
          .min(1, "Maximum level must be at least 1")
          .max(1000, "Maximum level too high")
          .optional(),
        requiredAchievements: z.array(z.string()).optional(),
        blacklistedUsers: z.array(z.string()).optional(),
      })
      .optional()
      .refine(
        (data) => {
          if (data?.minLevel && data?.maxLevel) {
            return data.maxLevel >= data.minLevel;
          }
          return true;
        },
        {
          message:
            "Maximum level must be greater than or equal to minimum level",
          path: ["maxLevel"],
        }
      ),
    behavior: z
      .object({
        allowPartialQuantity: z.boolean().default(false),
        requireExactQuantity: z.boolean().default(true),
        allowOverQuantity: z.boolean().default(false),
        stackingBehavior: z
          .enum(["stack", "separate", "replace"])
          .default("stack"),
      })
      .optional(),
    rewards: z
      .object({
        bonusChance: z.number().min(0).max(1).default(0),
        bonusQuantity: z.number().int().min(0).default(0),
        bonusItems: z.array(z.string()).optional(),
        guaranteedBonus: z.boolean().default(false),
      })
      .optional(),
    validation: z
      .object({
        validateOfferExists: z.boolean().default(true),
        validateItemExists: z.boolean().default(true),
        validateDuplicates: z.boolean().default(true),
        allowDuplicateTypes: z.boolean().default(true),
      })
      .optional(),
    recordActivity: z.boolean().default(true),
  })
  .strict();

export type CreateTradeOfferItemApi = z.infer<
  typeof CreateTradeOfferItemApiSchema
>;

/**
 * Schema for bulk creating trade offer items
 */
export const BulkCreateTradeOfferItemsSchema = z
  .object({
    tradeOfferId: z.string().min(1, "Trade offer ID is required"),
    items: z
      .array(
        z.object({
          itemId: z.string().min(1, "Item ID is required"),
          itemType: z.enum(["REQUIRED", "REWARD"]),
          quantity: z.number().int().min(1, "Quantity must be at least 1"),
          minLevel: z.number().int().min(1).max(1000).optional(),
          customConfig: z.record(z.string(), z.unknown()).optional(),
        })
      )
      .min(1, "At least one item must be specified")
      .max(100, "Too many items for bulk creation"),
    options: z
      .object({
        validateEach: z.boolean().default(true),
        stopOnError: z.boolean().default(false),
        replaceDuplicates: z.boolean().default(false),
        validateOfferCapacity: z.boolean().default(true),
        maintainBalance: z.boolean().default(true), // Equal required vs reward value
      })
      .optional(),
    validation: z
      .object({
        requireMinimumRewards: z.boolean().default(true),
        requireMinimumRequired: z.boolean().default(true),
        validateItemExistence: z.boolean().default(true),
        validateQuantityLimits: z.boolean().default(true),
      })
      .optional(),
    recordActivity: z.boolean().default(true),
    operationNotes: z.string().max(500).optional(),
  })
  .strict()
  .refine(
    (data) => {
      // Must have at least one required and one reward item
      const requiredItems = data.items.filter(
        (item) => item.itemType === "REQUIRED"
      );
      const rewardItems = data.items.filter(
        (item) => item.itemType === "REWARD"
      );
      return requiredItems.length > 0 && rewardItems.length > 0;
    },
    {
      message: "Must have at least one required item and one reward item",
      path: ["items"],
    }
  );

export type BulkCreateTradeOfferItems = z.infer<
  typeof BulkCreateTradeOfferItemsSchema
>;

// ============================================================================
// UPDATE SCHEMAS
// ============================================================================

/**
 * Schema for updating a TradeOfferItem
 * Compatible with Prisma TradeOfferItemUpdateInput
 */
export const UpdateTradeOfferItemSchema = z
  .object({
    id: z.string().optional(),
    tradeOfferId: z.string().min(1, "Trade offer ID is required").optional(),
    itemId: z.string().min(1, "Item ID is required").optional(),
    itemType: z.enum(["REQUIRED", "REWARD"]).optional(),
    quantity: z
      .number()
      .int()
      .min(1, "Quantity must be at least 1")
      .max(999999999, "Quantity too high")
      .optional(),
    minLevel: z
      .number()
      .int()
      .min(1, "Minimum level must be at least 1")
      .max(1000, "Minimum level too high")
      .nullable()
      .optional(),
    createdAt: z.coerce.date().optional(),
    updatedAt: z.coerce.date().optional(),
  })
  .strict();

export type UpdateTradeOfferItemInput = z.infer<
  typeof UpdateTradeOfferItemSchema
>;

/**
 * Schema for updating item quantity with validation
 */
export const UpdateItemQuantitySchema = z
  .object({
    itemId: z.string().min(1, "Item ID is required"),
    newQuantity: z
      .number()
      .int()
      .min(1, "Quantity must be at least 1")
      .max(999999999, "Quantity too high"),
    reason: z
      .enum([
        "adjustment",
        "rebalancing",
        "user_feedback",
        "market_demand",
        "admin_decision",
        "system_optimization",
        "error_correction",
      ])
      .optional(),
    validateImpact: z.boolean().default(true),
    notifyUsers: z.boolean().default(false),
    recordActivity: z.boolean().default(true),
    adjustmentNotes: z.string().max(500).optional(),
  })
  .strict();

export type UpdateItemQuantity = z.infer<typeof UpdateItemQuantitySchema>;

/**
 * Schema for updating item requirements
 */
export const UpdateItemRequirementsSchema = z
  .object({
    itemId: z.string().min(1, "Item ID is required"),
    requirements: z
      .object({
        minLevel: z
          .number()
          .int()
          .min(1, "Minimum level must be at least 1")
          .max(1000, "Minimum level too high")
          .nullable()
          .optional(),
        maxLevel: z
          .number()
          .int()
          .min(1, "Maximum level must be at least 1")
          .max(1000, "Maximum level too high")
          .nullable()
          .optional(),
        requiredAchievements: z.array(z.string()).optional(),
        blacklistedUsers: z.array(z.string()).optional(),
      })
      .optional()
      .refine(
        (data) => {
          if (data?.minLevel && data?.maxLevel) {
            return data.maxLevel >= data.minLevel;
          }
          return true;
        },
        {
          message:
            "Maximum level must be greater than or equal to minimum level",
          path: ["maxLevel"],
        }
      ),
    reason: z
      .enum([
        "game_balance",
        "user_feedback",
        "data_analysis",
        "admin_decision",
        "system_update",
        "bug_fix",
      ])
      .optional(),
    validateChanges: z.boolean().default(true),
    notifyAffectedUsers: z.boolean().default(false),
    recordActivity: z.boolean().default(true),
    changeNotes: z.string().max(500).optional(),
  })
  .strict();

export type UpdateItemRequirements = z.infer<
  typeof UpdateItemRequirementsSchema
>;

/**
 * Partial update schema - all fields optional
 */
export const PartialUpdateTradeOfferItemSchema =
  TradeOfferItemInputSchema.partial();

export type PartialUpdateTradeOfferItem = z.infer<
  typeof PartialUpdateTradeOfferItemSchema
>;

// ============================================================================
// TRADE OFFER ITEM MANAGEMENT SCHEMAS
// ============================================================================

/**
 * Schema for bulk trade offer item operations
 */
export const BulkTradeOfferItemOperationSchema = z
  .object({
    operation: z.enum([
      "update_quantities",
      "update_requirements",
      "change_types",
      "delete_multiple",
      "duplicate_multiple",
      "rebalance_offer",
      "validate_multiple",
      "optimize_quantities",
    ]),
    itemIds: z
      .array(z.string().min(1))
      .min(1, "At least one item is required")
      .max(100, "Too many items for bulk operation"),
    operationData: z
      .object({
        quantityChanges: z
          .array(
            z.object({
              itemId: z.string().min(1),
              newQuantity: z.number().int().min(1),
              reason: z.string().optional(),
            })
          )
          .optional(),
        requirementChanges: z
          .object({
            minLevel: z.number().int().min(1).max(1000).optional(),
            maxLevel: z.number().int().min(1).max(1000).optional(),
            applyToAll: z.boolean().default(false),
          })
          .optional(),
        typeChanges: z
          .array(
            z.object({
              itemId: z.string().min(1),
              newType: z.enum(["REQUIRED", "REWARD"]),
            })
          )
          .optional(),
        rebalancingStrategy: z
          .enum([
            "maintain_ratio",
            "equal_value",
            "market_based",
            "user_feedback",
            "admin_defined",
          ])
          .optional(),
      })
      .optional(),
    operationOptions: z
      .object({
        validateEach: z.boolean().default(true),
        stopOnError: z.boolean().default(false),
        maintainOfferBalance: z.boolean().default(true),
        notifyUsers: z.boolean().default(false),
        recordActivities: z.boolean().default(true),
        createBackups: z.boolean().default(true),
      })
      .optional(),
    operationNotes: z.string().max(1000).optional(),
  })
  .strict();

export type BulkTradeOfferItemOperation = z.infer<
  typeof BulkTradeOfferItemOperationSchema
>;

/**
 * Schema for analyzing trade offer item performance
 */
export const AnalyzeItemPerformanceSchema = z
  .object({
    itemId: z.string().min(1, "Item ID is required"),
    analysisType: z
      .enum([
        "usage_patterns",
        "economic_impact",
        "user_satisfaction",
        "market_trends",
        "optimization_opportunities",
        "comparative_analysis",
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
      .max(10, "Too many items for comparison")
      .optional(),
    segmentBy: z
      .array(
        z.enum([
          "user_level",
          "item_type",
          "trade_frequency",
          "time_of_day",
          "region",
          "user_behavior",
        ])
      )
      .optional(),
    includeRecommendations: z.boolean().default(true),
    includeForecasting: z.boolean().default(false),
    generateReport: z.boolean().default(false),
    reportFormat: z.enum(["json", "csv", "pdf"]).default("json"),
  })
  .strict();

export type AnalyzeItemPerformance = z.infer<
  typeof AnalyzeItemPerformanceSchema
>;

/**
 * Schema for validating trade offer balance
 */
export const ValidateOfferBalanceSchema = z
  .object({
    tradeOfferId: z.string().min(1, "Trade offer ID is required"),
    balanceStrategy: z
      .enum([
        "value_based",
        "quantity_based",
        "rarity_weighted",
        "market_value",
        "user_preference",
        "custom",
      ])
      .default("value_based"),
    customWeights: z
      .object({
        valueWeight: z.number().min(0).max(1).default(0.6),
        rarityWeight: z.number().min(0).max(1).default(0.3),
        popularityWeight: z.number().min(0).max(1).default(0.1),
      })
      .optional()
      .refine(
        (data) => {
          if (data) {
            const total =
              data.valueWeight + data.rarityWeight + data.popularityWeight;
            return Math.abs(total - 1.0) < 0.01; // Allow small floating point errors
          }
          return true;
        },
        {
          message: "Weights must sum to 1.0",
        }
      ),
    tolerances: z
      .object({
        maxImbalance: z.number().min(0).max(1).default(0.2), // 20% imbalance allowed
        minRequiredValue: z.number().min(0).optional(),
        maxRequiredValue: z.number().min(0).optional(),
        minRewardValue: z.number().min(0).optional(),
        maxRewardValue: z.number().min(0).optional(),
      })
      .optional(),
    includeAnalysis: z.boolean().default(true),
    includeRecommendations: z.boolean().default(true),
    recordResults: z.boolean().default(true),
  })
  .strict();

export type ValidateOfferBalance = z.infer<typeof ValidateOfferBalanceSchema>;

/**
 * Schema for optimizing trade offer items
 */
export const OptimizeOfferItemsSchema = z
  .object({
    tradeOfferId: z.string().min(1, "Trade offer ID is required"),
    optimizationGoals: z
      .array(
        z.enum([
          "maximize_trades",
          "balance_economy",
          "improve_satisfaction",
          "reduce_complexity",
          "increase_variety",
          "match_market_demand",
        ])
      )
      .min(1, "At least one optimization goal is required"),
    constraints: z
      .object({
        preserveItemTypes: z.boolean().default(true),
        maintainMinimumValue: z.boolean().default(true),
        limitQuantityChanges: z.boolean().default(true),
        maxQuantityIncrease: z.number().min(1).max(10).default(2),
        maxQuantityDecrease: z.number().min(0.1).max(1).default(0.5),
      })
      .optional(),
    preferences: z
      .object({
        favorPopularItems: z.boolean().default(true),
        balanceRarity: z.boolean().default(true),
        considerSeasonality: z.boolean().default(false),
        adaptToUserBehavior: z.boolean().default(true),
      })
      .optional(),
    validation: z
      .object({
        validateChanges: z.boolean().default(true),
        requireApproval: z.boolean().default(false),
        testMode: z.boolean().default(false), // Don't actually apply changes
        rollbackOnFailure: z.boolean().default(true),
      })
      .optional(),
    recordActivity: z.boolean().default(true),
    optimizationNotes: z.string().max(500).optional(),
  })
  .strict();

export type OptimizeOfferItems = z.infer<typeof OptimizeOfferItemsSchema>;

// ============================================================================
// QUERY SCHEMAS
// ============================================================================

/**
 * Schema for finding a unique TradeOfferItem
 */
export const FindUniqueTradeOfferItemSchema = z
  .object({
    id: z.string().optional(),
    tradeOfferId_itemId_itemType: z
      .object({
        tradeOfferId: z.string(),
        itemId: z.string(),
        itemType: z.enum(["REQUIRED", "REWARD"]),
      })
      .optional(),
  })
  .strict();

export type FindUniqueTradeOfferItemInput = z.infer<
  typeof FindUniqueTradeOfferItemSchema
>;

/**
 * Schema for filtering TradeOfferItems
 */
export const TradeOfferItemWhereSchema: z.ZodType<any> = z.lazy(() =>
  z
    .object({
      id: z.string().optional(),
      tradeOfferId: z.string().optional(),
      itemId: z.string().optional(),
      itemType: z.enum(["REQUIRED", "REWARD"]).optional(),
      quantity: z.number().int().optional(),
      minLevel: z.number().int().nullable().optional(),
      createdAt: z.date().optional(),
      updatedAt: z.date().optional(),
      AND: z.array(TradeOfferItemWhereSchema).optional(),
      OR: z.array(TradeOfferItemWhereSchema).optional(),
      NOT: TradeOfferItemWhereSchema.optional(),
    })
    .strict()
);

export type TradeOfferItemWhere = z.infer<typeof TradeOfferItemWhereSchema>;

/**
 * Schema for ordering TradeOfferItems
 */
export const TradeOfferItemOrderBySchema = z
  .object({
    id: z.enum(["asc", "desc"]).optional(),
    tradeOfferId: z.enum(["asc", "desc"]).optional(),
    itemId: z.enum(["asc", "desc"]).optional(),
    itemType: z.enum(["asc", "desc"]).optional(),
    quantity: z.enum(["asc", "desc"]).optional(),
    minLevel: z.enum(["asc", "desc"]).optional(),
    createdAt: z.enum(["asc", "desc"]).optional(),
    updatedAt: z.enum(["asc", "desc"]).optional(),
  })
  .strict();

export type TradeOfferItemOrderBy = z.infer<typeof TradeOfferItemOrderBySchema>;

/**
 * Schema for selecting TradeOfferItem fields
 */
export const TradeOfferItemSelectSchema = z
  .object({
    id: z.boolean().optional(),
    tradeOfferId: z.boolean().optional(),
    itemId: z.boolean().optional(),
    itemType: z.boolean().optional(),
    quantity: z.boolean().optional(),
    minLevel: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    updatedAt: z.boolean().optional(),
    tradeOffer: z.boolean().optional(),
    item: z.boolean().optional(),
  })
  .strict();

export type TradeOfferItemSelect = z.infer<typeof TradeOfferItemSelectSchema>;

/**
 * Schema for including TradeOfferItem relations
 */
export const TradeOfferItemIncludeSchema = z
  .object({
    tradeOffer: z.boolean().optional(),
    item: z.boolean().optional(),
  })
  .strict();

export type TradeOfferItemInclude = z.infer<typeof TradeOfferItemIncludeSchema>;

// ============================================================================
// PAGINATION SCHEMAS
// ============================================================================

/**
 * Schema for paginated TradeOfferItem queries
 */
export const FindManyTradeOfferItemsSchema = z
  .object({
    where: TradeOfferItemWhereSchema.optional(),
    orderBy: z
      .union([
        TradeOfferItemOrderBySchema,
        z.array(TradeOfferItemOrderBySchema),
      ])
      .optional(),
    select: TradeOfferItemSelectSchema.optional(),
    include: TradeOfferItemIncludeSchema.optional(),
    skip: z.number().int().min(0).optional(),
    take: z.number().int().min(1).max(1000).optional(),
    cursor: FindUniqueTradeOfferItemSchema.optional(),
  })
  .strict();

export type FindManyTradeOfferItemsInput = z.infer<
  typeof FindManyTradeOfferItemsSchema
>;

// ============================================================================
// VALIDATION HELPERS
// ============================================================================

/**
 * Schema for searching trade offer items
 */
export const SearchTradeOfferItemsSchema = z
  .object({
    query: z.string().max(200).optional(),
    tradeOfferId: z.string().optional(),
    itemId: z.string().optional(),
    itemType: z.enum(["REQUIRED", "REWARD"]).optional(),
    minQuantity: z.number().int().min(0).optional(),
    maxQuantity: z.number().int().min(0).optional(),
    minLevel: z.number().int().min(1).optional(),
    maxLevel: z.number().int().min(1).optional(),
    hasLevelRequirement: z.boolean().optional(),
    createdAfter: z.coerce.date().optional(),
    createdBefore: z.coerce.date().optional(),
    includeItemDetails: z.boolean().default(true),
    includeOfferDetails: z.boolean().default(false),
    includeAnalytics: z.boolean().default(false),
    sortBy: z
      .enum([
        "item_name",
        "quantity",
        "level_requirement",
        "item_type",
        "created_date",
        "popularity",
        "value",
      ])
      .default("created_date"),
    sortOrder: z.enum(["asc", "desc"]).default("desc"),
    limit: z.number().int().min(1).max(100).default(20),
  })
  .strict();

export type SearchTradeOfferItems = z.infer<typeof SearchTradeOfferItemsSchema>;

/**
 * Schema for validating item compatibility
 */
export const ValidateItemCompatibilitySchema = z
  .object({
    tradeOfferId: z.string().min(1, "Trade offer ID is required"),
    itemId: z.string().min(1, "Item ID is required"),
    itemType: z.enum(["REQUIRED", "REWARD"]),
    quantity: z.number().int().min(1, "Quantity must be at least 1"),
    userId: z.string().min(1, "User ID is required").optional(),
    checkInventory: z.boolean().default(true),
    checkLevelRequirements: z.boolean().default(true),
    checkItemExistence: z.boolean().default(true),
    checkOfferCapacity: z.boolean().default(true),
    checkDuplicates: z.boolean().default(true),
    includeReasons: z.boolean().default(true),
    suggestAlternatives: z.boolean().default(false),
  })
  .strict();

export type ValidateItemCompatibility = z.infer<
  typeof ValidateItemCompatibilitySchema
>;

/**
 * Schema for getting item statistics
 */
export const GetItemStatsSchema = z
  .object({
    itemId: z.string().min(1, "Item ID is required"),
    context: z
      .enum(["offer_specific", "global", "user_specific", "time_range"])
      .default("offer_specific"),
    tradeOfferId: z.string().optional(),
    userId: z.string().optional(),
    timeRange: z
      .object({
        startDate: z.coerce.date(),
        endDate: z.coerce.date(),
      })
      .optional(),
    includeComparisons: z.boolean().default(false),
    includeProjections: z.boolean().default(false),
    includeRecommendations: z.boolean().default(false),
    granularity: z.enum(["hourly", "daily", "weekly"]).default("daily"),
  })
  .strict();

export type GetItemStats = z.infer<typeof GetItemStatsSchema>;

// ============================================================================
// RESPONSE SCHEMAS
// ============================================================================

/**
 * Schema for TradeOfferItem API responses
 */
export const TradeOfferItemResponseSchema = TradeOfferItemSchema;

export type TradeOfferItemResponse = z.infer<
  typeof TradeOfferItemResponseSchema
>;

/**
 * Schema for TradeOfferItem with related data
 */
export const TradeOfferItemWithRelationsSchema =
  TradeOfferItemResponseSchema.safeExtend({
    tradeOffer: z
      .object({
        id: z.string(),
        name: z.string(),
        status: z.string(),
        maxTotalTrades: z.number().int().nullable(),
        currentTrades: z.number().int(),
      })
      .optional(),
    item: z
      .object({
        id: z.string(),
        name: z.string(),
        category: z.string(),
        rarity: z.string(),
        value: z.number().int(),
        description: z.string(),
      })
      .optional(),
  });

export type TradeOfferItemWithRelations = z.infer<
  typeof TradeOfferItemWithRelationsSchema
>;

/**
 * Schema for TradeOfferItem summary (minimal info)
 */
export const TradeOfferItemSummarySchema = z
  .object({
    id: z.string(),
    itemId: z.string(),
    itemName: z.string(),
    itemType: z.string(),
    quantity: z.number().int(),
    minLevel: z.number().int().nullable(),
    itemRarity: z.string(),
    itemValue: z.number().int(),
    estimatedTotalValue: z.number().int(),
    isHighValue: z.boolean(),
    isRare: z.boolean(),
    popularityScore: z.number().min(0).max(1),
    createdAt: z.date(),
  })
  .strict();

export type TradeOfferItemSummary = z.infer<typeof TradeOfferItemSummarySchema>;

/**
 * Schema for trade offer item operation result
 */
export const TradeOfferItemOperationResultSchema = z
  .object({
    operation: z.string(),
    itemId: z.string(),
    success: z.boolean(),
    changes: z.object({
      quantityBefore: z.number().int().optional(),
      quantityAfter: z.number().int().optional(),
      typeBefore: z.string().optional(),
      typeAfter: z.string().optional(),
      requirementsBefore: z.record(z.string(), z.unknown()).optional(),
      requirementsAfter: z.record(z.string(), z.unknown()).optional(),
      fieldChanges: z.record(z.string(), z.unknown()).optional(),
    }),
    impact: z.object({
      offerBalanceChange: z.number().optional(),
      estimatedValueChange: z.number().optional(),
      userAccessibilityChange: z.number().int().optional(),
      marketImpact: z.enum(["low", "medium", "high"]).optional(),
    }),
    validation: z.object({
      passed: z.boolean(),
      warnings: z.array(z.string()).optional(),
      errors: z.array(z.string()).optional(),
    }),
    timing: z.object({
      executedAt: z.date(),
      executionTime: z.number().min(0), // milliseconds
    }),
    recommendations: z.array(z.string()).optional(),
    transactionId: z.string().optional(),
    metadata: z.record(z.string(), z.unknown()).optional(),
  })
  .strict();

export type TradeOfferItemOperationResult = z.infer<
  typeof TradeOfferItemOperationResultSchema
>;

/**
 * Schema for trade offer item analytics result
 */
export const TradeOfferItemAnalyticsResultSchema = z
  .object({
    itemId: z.string(),
    itemName: z.string(),
    analysisDate: z.date(),
    timeRange: z.object({
      startDate: z.date(),
      endDate: z.date(),
    }),
    summary: z.object({
      itemType: z.string(),
      totalQuantityTraded: z.number().int().min(0),
      uniqueTraders: z.number().int().min(0),
      averageQuantityPerTrade: z.number().min(0),
      tradingFrequency: z.number().min(0), // trades per day
    }),
    performance: z.object({
      popularityScore: z.number().min(0).max(1),
      demandScore: z.number().min(0).max(1),
      conversionRate: z.number().min(0).max(1),
      userSatisfactionScore: z.number().min(0).max(5),
      competitiveIndex: z.number().min(0).max(1),
      trendingScore: z.number().min(0).max(1),
    }),
    economics: z.object({
      totalValue: z.number().min(0),
      averageValuePerUnit: z.number().min(0),
      marketImpact: z.number(),
      priceStability: z.number().min(0).max(1),
      inflationEffect: z.number(),
    }),
    usage: z.object({
      byUserLevel: z.record(z.string(), z.number().int().min(0)),
      byTimeOfDay: z.record(z.string(), z.number().int().min(0)),
      byRegion: z.record(z.string(), z.number().int().min(0)),
      conversionPatterns: z.record(z.string(), z.unknown()),
    }),
    trends: z.object({
      dailyUsage: z.array(
        z.object({
          date: z.date(),
          trades: z.number().int().min(0),
          uniqueUsers: z.number().int().min(0),
          averageQuantity: z.number().min(0),
        })
      ),
      seasonalPatterns: z.record(z.string(), z.number()),
      growthRate: z.number(),
      volatility: z.number().min(0),
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
          "quantity_adjustment",
          "requirement_tuning",
          "promotion",
          "market_positioning",
          "user_targeting",
          "balance_optimization",
        ]),
        priority: z.enum(["low", "medium", "high", "urgent"]),
        description: z.string(),
        expectedImpact: z.enum(["low", "medium", "high"]),
        implementation: z.enum(["easy", "medium", "hard"]),
      })
    ),
  })
  .strict();

export type TradeOfferItemAnalyticsResult = z.infer<
  typeof TradeOfferItemAnalyticsResultSchema
>;

// ============================================================================
// ADMIN SCHEMAS
// ============================================================================

/**
 * Schema for admin trade offer item management
 */
export const AdminTradeOfferItemManagementSchema = z
  .object({
    action: z.enum([
      "list_all_items",
      "moderate_items",
      "generate_item_report",
      "cleanup_unused_items",
      "analyze_item_trends",
      "bulk_update_items",
      "audit_items",
      "optimize_items",
      "rebalance_offers",
    ]),
    filters: z
      .object({
        tradeOfferId: z.string().optional(),
        itemType: z.enum(["REQUIRED", "REWARD"]).optional(),
        itemCategory: z.string().optional(),
        minQuantity: z.number().int().min(0).optional(),
        maxQuantity: z.number().int().min(0).optional(),
        hasLevelRequirement: z.boolean().optional(),
        createdAfter: z.coerce.date().optional(),
        createdBefore: z.coerce.date().optional(),
        lowPerformance: z.boolean().optional(),
        highDemand: z.boolean().optional(),
        needsRebalancing: z.boolean().optional(),
      })
      .optional(),
    operationOptions: z
      .object({
        validateChanges: z.boolean().default(true),
        notifyOfferCreators: z.boolean().default(false),
        notifyTraders: z.boolean().default(false),
        createBackups: z.boolean().default(true),
        recordActivity: z.boolean().default(true),
        maintainBalance: z.boolean().default(true),
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

export type AdminTradeOfferItemManagement = z.infer<
  typeof AdminTradeOfferItemManagementSchema
>;

// ============================================================================
// EXPORTS
// ============================================================================

// All schemas are defined above and exported individually

// Export all validation functions
export const TradeOfferItemValidation = {
  // Base schemas
  model: TradeOfferItemSchema,
  input: TradeOfferItemInputSchema,

  // CRUD schemas
  create: CreateTradeOfferItemSchema,
  createApi: CreateTradeOfferItemApiSchema,
  bulkCreate: BulkCreateTradeOfferItemsSchema,
  update: UpdateTradeOfferItemSchema,
  partialUpdate: PartialUpdateTradeOfferItemSchema,

  // Item management schemas
  updateQuantity: UpdateItemQuantitySchema,
  updateRequirements: UpdateItemRequirementsSchema,
  bulkOperation: BulkTradeOfferItemOperationSchema,
  analyzePerformance: AnalyzeItemPerformanceSchema,
  validateBalance: ValidateOfferBalanceSchema,
  optimize: OptimizeOfferItemsSchema,

  // Query schemas
  findUnique: FindUniqueTradeOfferItemSchema,
  findMany: FindManyTradeOfferItemsSchema,
  where: TradeOfferItemWhereSchema,
  orderBy: TradeOfferItemOrderBySchema,
  select: TradeOfferItemSelectSchema,
  include: TradeOfferItemIncludeSchema,

  // Helpers
  search: SearchTradeOfferItemsSchema,
  validateCompatibility: ValidateItemCompatibilitySchema,
  getStats: GetItemStatsSchema,

  // Response schemas
  response: TradeOfferItemResponseSchema,
  withRelations: TradeOfferItemWithRelationsSchema,
  summary: TradeOfferItemSummarySchema,
  operationResult: TradeOfferItemOperationResultSchema,
  analyticsResult: TradeOfferItemAnalyticsResultSchema,

  // Admin schemas
  adminManagement: AdminTradeOfferItemManagementSchema,

  // Component schemas
  analytics: TradeOfferItemAnalyticsSchema,
  configuration: TradeOfferItemConfigurationSchema,
} as const;
