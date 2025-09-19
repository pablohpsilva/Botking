import { z } from "zod";

// ============================================================================
// INVENTORY METADATA SCHEMAS
// ============================================================================

/**
 * Schema for inventory item metadata (JSON field)
 */
export const InventoryItemMetadataSchema = z.object({
  condition: z
    .enum(["pristine", "excellent", "good", "fair", "poor", "broken"])
    .optional(),
  source: z
    .enum([
      "purchase",
      "craft",
      "reward",
      "trade",
      "quest",
      "event",
      "drop",
      "gift",
      "admin",
    ])
    .optional(),
  customizations: z
    .object({
      name: z.string().max(100).optional(),
      description: z.string().max(500).optional(),
      color: z.string().optional(),
      texture: z.string().optional(),
      enchantments: z.array(z.string()).optional(),
    })
    .optional(),
  usage: z
    .object({
      timesUsed: z.number().int().min(0).optional(),
      lastUsed: z.coerce.date().optional(),
      usageHistory: z
        .array(
          z.object({
            usedAt: z.coerce.date(),
            context: z.string().optional(),
            result: z.enum(["success", "failure", "partial"]).optional(),
          })
        )
        .optional(),
    })
    .optional(),
  acquisition: z
    .object({
      acquiredFrom: z.string().optional(), // User ID or system
      acquiredVia: z.string().optional(), // Method details
      originalValue: z.number().optional(),
      acquiredAt: z.coerce.date().optional(),
    })
    .optional(),
  restrictions: z
    .object({
      tradeable: z.boolean().optional(),
      consumable: z.boolean().optional(),
      transferable: z.boolean().optional(),
      expires: z.boolean().optional(),
    })
    .optional(),
  enhancement: z
    .object({
      level: z.number().int().min(0).max(10).optional(),
      experience: z.number().min(0).optional(),
      upgrades: z.array(z.string()).optional(),
    })
    .optional(),
  notes: z.string().max(1000).optional(),
  tags: z.array(z.string().max(50)).max(20).optional(),
});

export type InventoryItemMetadata = z.infer<typeof InventoryItemMetadataSchema>;

// ============================================================================
// BASE SCHEMAS
// ============================================================================

/**
 * Base UserInventory model schema - represents the complete UserInventory entity
 */
export const UserInventorySchema = z
  .object({
    id: z.string(),
    userId: z.string(),
    itemId: z.string(),
    quantity: z.number().int(),
    acquiredAt: z.date(),
    expiresAt: z.date().nullable(),
    metadata: InventoryItemMetadataSchema.nullable(),
    createdAt: z.date(),
    updatedAt: z.date(),
  })
  .strict();

export type UserInventory = z.infer<typeof UserInventorySchema>;

/**
 * UserInventory input schema for forms and API inputs (without auto-generated fields)
 */
export const UserInventoryInputSchema = z
  .object({
    userId: z.string().min(1, "User ID is required"),
    itemId: z.string().min(1, "Item ID is required"),
    quantity: z
      .number()
      .int()
      .min(1, "Quantity must be at least 1")
      .max(999999999, "Quantity too large")
      .default(1),
    acquiredAt: z.coerce
      .date()
      .optional()
      .default(() => new Date()),
    expiresAt: z.coerce.date().nullable().optional(),
    metadata: InventoryItemMetadataSchema.nullable().optional(),
  })
  .strict()
  .refine(
    (data) => {
      // If expiration is set, it must be in the future
      if (data.expiresAt && data.acquiredAt) {
        return data.expiresAt > data.acquiredAt;
      }
      return true;
    },
    {
      message: "Expiration date must be after acquisition date",
      path: ["expiresAt"],
    }
  );

export type UserInventoryInput = z.infer<typeof UserInventoryInputSchema>;

// ============================================================================
// CREATE SCHEMAS
// ============================================================================

/**
 * Schema for creating a new UserInventory
 * Compatible with Prisma UserInventoryCreateInput
 */
export const CreateUserInventorySchema = z
  .object({
    id: z.string().optional(),
    userId: z.string().min(1, "User ID is required"),
    itemId: z.string().min(1, "Item ID is required"),
    quantity: z
      .number()
      .int()
      .min(1, "Quantity must be at least 1")
      .max(999999999, "Quantity too large")
      .default(1),
    acquiredAt: z.coerce
      .date()
      .optional()
      .default(() => new Date()),
    expiresAt: z.coerce.date().nullable().optional(),
    metadata: InventoryItemMetadataSchema.nullable().optional(),
    createdAt: z.coerce.date().optional(),
    updatedAt: z.coerce.date().optional(),
  })
  .strict()
  .refine(
    (data) => {
      if (data.expiresAt && data.acquiredAt) {
        return data.expiresAt > data.acquiredAt;
      }
      return true;
    },
    {
      message: "Expiration date must be after acquisition date",
      path: ["expiresAt"],
    }
  );

export type CreateUserInventoryInput = z.infer<
  typeof CreateUserInventorySchema
>;

/**
 * Simplified create schema for API endpoints
 */
export const CreateUserInventoryApiSchema = z
  .object({
    userId: z.string().min(1, "User ID is required"),
    itemId: z.string().min(1, "Item ID is required"),
    quantity: z
      .number()
      .int()
      .min(1, "Quantity must be at least 1")
      .max(999999999, "Quantity too large")
      .default(1),
    source: z
      .enum([
        "purchase",
        "craft",
        "reward",
        "trade",
        "quest",
        "event",
        "drop",
        "gift",
        "admin",
      ])
      .optional(),
    expirationHours: z.number().min(1).max(8760).optional(), // Max 1 year
    condition: z
      .enum(["pristine", "excellent", "good", "fair", "poor", "broken"])
      .default("good"),
    customizations: z
      .object({
        name: z.string().max(100).optional(),
        description: z.string().max(500).optional(),
        color: z.string().optional(),
        texture: z.string().optional(),
      })
      .optional(),
    validateStackLimit: z.boolean().default(true),
    mergeWithExisting: z.boolean().default(true),
    recordAcquisition: z.boolean().default(true),
  })
  .strict();

export type CreateUserInventoryApi = z.infer<
  typeof CreateUserInventoryApiSchema
>;

// ============================================================================
// UPDATE SCHEMAS
// ============================================================================

/**
 * Schema for updating a UserInventory
 * Compatible with Prisma UserInventoryUpdateInput
 */
export const UpdateUserInventorySchema = z
  .object({
    id: z.string().optional(),
    userId: z.string().min(1, "User ID is required").optional(),
    itemId: z.string().min(1, "Item ID is required").optional(),
    quantity: z
      .number()
      .int()
      .min(0, "Quantity cannot be negative")
      .max(999999999, "Quantity too large")
      .optional(),
    acquiredAt: z.coerce.date().optional(),
    expiresAt: z.coerce.date().nullable().optional(),
    metadata: InventoryItemMetadataSchema.nullable().optional(),
    createdAt: z.coerce.date().optional(),
    updatedAt: z.coerce.date().optional(),
  })
  .strict();

export type UpdateUserInventoryInput = z.infer<
  typeof UpdateUserInventorySchema
>;

/**
 * Simplified update schema for API endpoints
 */
export const UpdateUserInventoryApiSchema = z
  .object({
    quantity: z
      .number()
      .int()
      .min(0, "Quantity cannot be negative")
      .max(999999999, "Quantity too large")
      .optional(),
    addQuantity: z
      .number()
      .int()
      .min(1, "Add quantity must be positive")
      .max(999999999, "Add quantity too large")
      .optional(),
    removeQuantity: z
      .number()
      .int()
      .min(1, "Remove quantity must be positive")
      .max(999999999, "Remove quantity too large")
      .optional(),
    updateCondition: z
      .enum(["pristine", "excellent", "good", "fair", "poor", "broken"])
      .optional(),
    updateCustomizations: z
      .object({
        name: z.string().max(100).optional(),
        description: z.string().max(500).optional(),
        color: z.string().optional(),
        texture: z.string().optional(),
      })
      .optional(),
    addTags: z.array(z.string().max(50)).optional(),
    removeTags: z.array(z.string().max(50)).optional(),
    updateExpiration: z.coerce.date().nullable().optional(),
    recordUsage: z.boolean().default(false),
    validateStackLimit: z.boolean().default(true),
  })
  .strict();

export type UpdateUserInventoryApi = z.infer<
  typeof UpdateUserInventoryApiSchema
>;

/**
 * Partial update schema - all fields optional
 */
export const PartialUpdateUserInventorySchema =
  UserInventoryInputSchema.partial();

export type PartialUpdateUserInventory = z.infer<
  typeof PartialUpdateUserInventorySchema
>;

// ============================================================================
// INVENTORY MANAGEMENT SCHEMAS
// ============================================================================

/**
 * Schema for adding items to inventory
 */
export const AddItemToInventorySchema = z
  .object({
    userId: z.string().min(1, "User ID is required"),
    itemId: z.string().min(1, "Item ID is required"),
    quantity: z
      .number()
      .int()
      .min(1, "Quantity must be positive")
      .max(999999999, "Quantity too large"),
    source: z
      .enum([
        "purchase",
        "craft",
        "reward",
        "trade",
        "quest",
        "event",
        "drop",
        "gift",
        "admin",
      ])
      .optional(),
    condition: z
      .enum(["pristine", "excellent", "good", "fair", "poor", "broken"])
      .default("good"),
    expirationTime: z
      .object({
        hours: z.number().min(1).max(8760).optional(),
        days: z.number().min(1).max(365).optional(),
        absoluteDate: z.coerce.date().optional(),
      })
      .optional(),
    metadata: z
      .object({
        customizations: z.record(z.string(), z.unknown()).optional(),
        acquisition: z.record(z.string(), z.unknown()).optional(),
        notes: z.string().max(1000).optional(),
        tags: z.array(z.string().max(50)).max(20).optional(),
      })
      .optional(),
    stackingBehavior: z.enum(["merge", "separate", "auto"]).default("auto"),
    validateCapacity: z.boolean().default(true),
    recordTransaction: z.boolean().default(true),
  })
  .strict();

export type AddItemToInventory = z.infer<typeof AddItemToInventorySchema>;

/**
 * Schema for removing items from inventory
 */
export const RemoveItemFromInventorySchema = z
  .object({
    userId: z.string().min(1, "User ID is required"),
    itemId: z.string().min(1, "Item ID is required"),
    quantity: z
      .number()
      .int()
      .min(1, "Quantity must be positive")
      .max(999999999, "Quantity too large"),
    removeReason: z
      .enum([
        "consumption",
        "trade",
        "sell",
        "craft",
        "gift",
        "expiration",
        "admin",
        "loss",
      ])
      .optional(),
    validateAvailability: z.boolean().default(true),
    allowPartialRemoval: z.boolean().default(true),
    recordTransaction: z.boolean().default(true),
    returnToSystem: z.boolean().default(false),
  })
  .strict();

export type RemoveItemFromInventory = z.infer<
  typeof RemoveItemFromInventorySchema
>;

/**
 * Schema for transferring items between users
 */
export const TransferItemSchema = z
  .object({
    fromUserId: z.string().min(1, "From user ID is required"),
    toUserId: z.string().min(1, "To user ID is required"),
    itemId: z.string().min(1, "Item ID is required"),
    quantity: z
      .number()
      .int()
      .min(1, "Quantity must be positive")
      .max(999999999, "Quantity too large"),
    transferType: z
      .enum(["trade", "gift", "admin", "quest_reward", "system"])
      .default("trade"),
    preserveMetadata: z.boolean().default(true),
    preserveCondition: z.boolean().default(true),
    validateTradeable: z.boolean().default(true),
    validateCapacity: z.boolean().default(true),
    recordTransaction: z.boolean().default(true),
    transferNotes: z.string().max(500).optional(),
  })
  .strict()
  .refine((data) => data.fromUserId !== data.toUserId, {
    message: "Cannot transfer items to the same user",
    path: ["toUserId"],
  });

export type TransferItem = z.infer<typeof TransferItemSchema>;

/**
 * Schema for bulk inventory operations
 */
export const BulkInventoryOperationSchema = z
  .object({
    userId: z.string().min(1, "User ID is required"),
    operation: z.enum([
      "add_multiple",
      "remove_multiple",
      "update_multiple",
      "cleanup_expired",
      "merge_stacks",
      "organize",
    ]),
    items: z
      .array(
        z.object({
          itemId: z.string().min(1, "Item ID is required"),
          quantity: z.number().int().min(1, "Quantity must be positive"),
          metadata: z.record(z.string(), z.unknown()).optional(),
        })
      )
      .min(1, "At least one item is required")
      .max(100, "Too many items for bulk operation"),
    options: z
      .object({
        validateEach: z.boolean().default(true),
        stopOnError: z.boolean().default(false),
        recordTransactions: z.boolean().default(true),
        source: z.string().optional(),
        reason: z.string().optional(),
      })
      .optional(),
  })
  .strict();

export type BulkInventoryOperation = z.infer<
  typeof BulkInventoryOperationSchema
>;

/**
 * Schema for inventory cleanup operations
 */
export const CleanupInventorySchema = z
  .object({
    userId: z.string().min(1, "User ID is required"),
    cleanupType: z.enum([
      "expired_items",
      "zero_quantity",
      "duplicate_stacks",
      "corrupted_metadata",
      "orphaned_entries",
      "all",
    ]),
    options: z
      .object({
        dryRun: z.boolean().default(false),
        createBackup: z.boolean().default(true),
        notifyUser: z.boolean().default(true),
        recordActivity: z.boolean().default(true),
      })
      .optional(),
  })
  .strict();

export type CleanupInventory = z.infer<typeof CleanupInventorySchema>;

// ============================================================================
// QUERY SCHEMAS
// ============================================================================

/**
 * Schema for finding a unique UserInventory
 */
export const FindUniqueUserInventorySchema = z
  .object({
    id: z.string().optional(),
    userId_itemId: z
      .object({
        userId: z.string(),
        itemId: z.string(),
      })
      .optional(),
  })
  .strict();

export type FindUniqueUserInventoryInput = z.infer<
  typeof FindUniqueUserInventorySchema
>;

/**
 * Schema for filtering UserInventories
 */
export const UserInventoryWhereSchema: z.ZodType<any> = z.lazy(() =>
  z
    .object({
      id: z.string().optional(),
      userId: z.string().optional(),
      itemId: z.string().optional(),
      quantity: z.number().int().optional(),
      acquiredAt: z.date().optional(),
      expiresAt: z.date().nullable().optional(),
      createdAt: z.date().optional(),
      updatedAt: z.date().optional(),
      AND: z.array(UserInventoryWhereSchema).optional(),
      OR: z.array(UserInventoryWhereSchema).optional(),
      NOT: UserInventoryWhereSchema.optional(),
    })
    .strict()
);

export type UserInventoryWhere = z.infer<typeof UserInventoryWhereSchema>;

/**
 * Schema for ordering UserInventories
 */
export const UserInventoryOrderBySchema = z
  .object({
    id: z.enum(["asc", "desc"]).optional(),
    userId: z.enum(["asc", "desc"]).optional(),
    itemId: z.enum(["asc", "desc"]).optional(),
    quantity: z.enum(["asc", "desc"]).optional(),
    acquiredAt: z.enum(["asc", "desc"]).optional(),
    expiresAt: z.enum(["asc", "desc"]).optional(),
    createdAt: z.enum(["asc", "desc"]).optional(),
    updatedAt: z.enum(["asc", "desc"]).optional(),
  })
  .strict();

export type UserInventoryOrderBy = z.infer<typeof UserInventoryOrderBySchema>;

/**
 * Schema for selecting UserInventory fields
 */
export const UserInventorySelectSchema = z
  .object({
    id: z.boolean().optional(),
    userId: z.boolean().optional(),
    itemId: z.boolean().optional(),
    quantity: z.boolean().optional(),
    acquiredAt: z.boolean().optional(),
    expiresAt: z.boolean().optional(),
    metadata: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    updatedAt: z.boolean().optional(),
    user: z.boolean().optional(),
    item: z.boolean().optional(),
  })
  .strict();

export type UserInventorySelect = z.infer<typeof UserInventorySelectSchema>;

/**
 * Schema for including UserInventory relations
 */
export const UserInventoryIncludeSchema = z
  .object({
    user: z.boolean().optional(),
    item: z.boolean().optional(),
  })
  .strict();

export type UserInventoryInclude = z.infer<typeof UserInventoryIncludeSchema>;

// ============================================================================
// PAGINATION SCHEMAS
// ============================================================================

/**
 * Schema for paginated UserInventory queries
 */
export const FindManyUserInventoriesSchema = z
  .object({
    where: UserInventoryWhereSchema.optional(),
    orderBy: z
      .union([UserInventoryOrderBySchema, z.array(UserInventoryOrderBySchema)])
      .optional(),
    select: UserInventorySelectSchema.optional(),
    include: UserInventoryIncludeSchema.optional(),
    skip: z.number().int().min(0).optional(),
    take: z.number().int().min(1).max(1000).optional(),
    cursor: FindUniqueUserInventorySchema.optional(),
  })
  .strict();

export type FindManyUserInventoriesInput = z.infer<
  typeof FindManyUserInventoriesSchema
>;

// ============================================================================
// VALIDATION HELPERS
// ============================================================================

/**
 * Schema for searching and filtering inventory
 */
export const SearchInventorySchema = z
  .object({
    userId: z.string().min(1, "User ID is required"),
    query: z.string().optional(),
    category: z.string().optional(),
    rarity: z.string().optional(),
    tags: z.array(z.string()).optional(),
    minQuantity: z.number().int().min(0).optional(),
    maxQuantity: z.number().int().min(0).optional(),
    condition: z
      .enum(["pristine", "excellent", "good", "fair", "poor", "broken"])
      .optional(),
    acquiredAfter: z.coerce.date().optional(),
    acquiredBefore: z.coerce.date().optional(),
    expiringSoon: z.boolean().optional(),
    expiredItems: z.boolean().optional(),
    hasMetadata: z.boolean().optional(),
    source: z
      .enum([
        "purchase",
        "craft",
        "reward",
        "trade",
        "quest",
        "event",
        "drop",
        "gift",
        "admin",
      ])
      .optional(),
    sortBy: z
      .enum([
        "name",
        "quantity",
        "value",
        "rarity",
        "acquiredAt",
        "expiresAt",
        "condition",
      ])
      .default("acquiredAt"),
    sortOrder: z.enum(["asc", "desc"]).default("desc"),
    includeItemDetails: z.boolean().default(true),
    limit: z.number().int().min(1).max(100).default(20),
  })
  .strict();

export type SearchInventory = z.infer<typeof SearchInventorySchema>;

/**
 * Schema for inventory capacity analysis
 */
export const AnalyzeInventoryCapacitySchema = z
  .object({
    userId: z.string().min(1, "User ID is required"),
    includeItemDetails: z.boolean().default(true),
    analyzeStacking: z.boolean().default(true),
    analyzeExpiration: z.boolean().default(true),
    analyzeValue: z.boolean().default(true),
    includeRecommendations: z.boolean().default(true),
  })
  .strict();

export type AnalyzeInventoryCapacity = z.infer<
  typeof AnalyzeInventoryCapacitySchema
>;

/**
 * Schema for inventory validation
 */
export const ValidateInventorySchema = z
  .object({
    userId: z.string().min(1, "User ID is required"),
    validationType: z.enum([
      "data_integrity",
      "expiration_dates",
      "stack_limits",
      "metadata_structure",
      "item_references",
      "capacity_limits",
      "all",
    ]),
    fixIssues: z.boolean().default(false),
    generateReport: z.boolean().default(true),
  })
  .strict();

export type ValidateInventory = z.infer<typeof ValidateInventorySchema>;

// ============================================================================
// RESPONSE SCHEMAS
// ============================================================================

/**
 * Schema for UserInventory API responses
 */
export const UserInventoryResponseSchema = UserInventorySchema;

export type UserInventoryResponse = z.infer<typeof UserInventoryResponseSchema>;

/**
 * Schema for UserInventory with User and Item information
 */
export const UserInventoryWithRelationsSchema =
  UserInventoryResponseSchema.safeExtend({
    user: z.object({
      id: z.string(),
      name: z.string().nullable(),
      email: z.string(),
    }),
    item: z.object({
      id: z.string(),
      name: z.string(),
      category: z.string(),
      rarity: z.string(),
      value: z.number().int(),
      consumable: z.boolean(),
      tradeable: z.boolean(),
      stackable: z.boolean(),
      maxStackSize: z.number().int(),
    }),
  });

export type UserInventoryWithRelations = z.infer<
  typeof UserInventoryWithRelationsSchema
>;

/**
 * Schema for UserInventory summary (minimal info)
 */
export const UserInventorySummarySchema = z
  .object({
    id: z.string(),
    userId: z.string(),
    itemId: z.string(),
    itemName: z.string(),
    quantity: z.number().int(),
    condition: z.string().optional(),
    expiresAt: z.date().nullable(),
    isExpired: z.boolean(),
    totalValue: z.number(),
  })
  .strict();

export type UserInventorySummary = z.infer<typeof UserInventorySummarySchema>;

/**
 * Schema for inventory operation result
 */
export const InventoryOperationResultSchema = z
  .object({
    operation: z.string(),
    success: z.boolean(),
    affectedItems: z.array(
      z.object({
        itemId: z.string(),
        itemName: z.string(),
        quantityBefore: z.number().int(),
        quantityAfter: z.number().int(),
        quantityChanged: z.number().int(),
      })
    ),
    errors: z.array(z.string()).optional(),
    warnings: z.array(z.string()).optional(),
    transactionId: z.string().optional(),
    metadata: z.record(z.string(), z.unknown()).optional(),
  })
  .strict();

export type InventoryOperationResult = z.infer<
  typeof InventoryOperationResultSchema
>;

/**
 * Schema for inventory analysis result
 */
export const InventoryAnalysisResultSchema = z
  .object({
    userId: z.string(),
    summary: z.object({
      totalItems: z.number().int().min(0),
      totalQuantity: z.number().int().min(0),
      totalValue: z.number(),
      uniqueItems: z.number().int().min(0),
      averageItemValue: z.number(),
    }),
    categoryBreakdown: z.record(
      z.string(),
      z.object({
        itemCount: z.number().int().min(0),
        totalQuantity: z.number().int().min(0),
        totalValue: z.number(),
      })
    ),
    rarityBreakdown: z.record(
      z.string(),
      z.object({
        itemCount: z.number().int().min(0),
        totalQuantity: z.number().int().min(0),
        totalValue: z.number(),
      })
    ),
    conditionAnalysis: z.object({
      pristine: z.number().int().min(0),
      excellent: z.number().int().min(0),
      good: z.number().int().min(0),
      fair: z.number().int().min(0),
      poor: z.number().int().min(0),
      broken: z.number().int().min(0),
      averageCondition: z.string(),
    }),
    expirationAnalysis: z.object({
      itemsWithExpiration: z.number().int().min(0),
      expiredItems: z.number().int().min(0),
      expiringSoon: z.number().int().min(0), // Within 24 hours
      averageTimeToExpiry: z.number().optional(),
    }),
    stackingAnalysis: z.object({
      stackableItems: z.number().int().min(0),
      nonStackableItems: z.number().int().min(0),
      underutilizedStacks: z.number().int().min(0),
      fullStacks: z.number().int().min(0),
      stackingEfficiency: z.number().min(0).max(1),
    }),
    capacityAnalysis: z.object({
      theoreticalCapacity: z.number().int().min(0),
      usedCapacity: z.number().int().min(0),
      utilizationRate: z.number().min(0).max(1),
      capacityByCategory: z.record(z.string(), z.number().int().min(0)),
    }),
    recommendations: z.array(
      z.object({
        type: z.enum([
          "cleanup_expired",
          "merge_stacks",
          "sell_excess",
          "use_items",
          "organize_categories",
          "upgrade_capacity",
        ]),
        description: z.string(),
        priority: z.enum(["low", "medium", "high", "urgent"]),
        estimatedBenefit: z.string(),
        affectedItems: z.array(z.string()).optional(),
      })
    ),
  })
  .strict();

export type InventoryAnalysisResult = z.infer<
  typeof InventoryAnalysisResultSchema
>;

/**
 * Schema for inventory transfer result
 */
export const InventoryTransferResultSchema = z
  .object({
    transferId: z.string(),
    fromUserId: z.string(),
    toUserId: z.string(),
    itemId: z.string(),
    itemName: z.string(),
    quantityTransferred: z.number().int().min(1),
    transferType: z.string(),
    success: z.boolean(),
    fromInventoryBefore: z.number().int(),
    fromInventoryAfter: z.number().int(),
    toInventoryBefore: z.number().int(),
    toInventoryAfter: z.number().int(),
    metadata: z.record(z.string(), z.unknown()).optional(),
    errors: z.array(z.string()).optional(),
    warnings: z.array(z.string()).optional(),
    transactionRecorded: z.boolean(),
    timestamp: z.date(),
  })
  .strict();

export type InventoryTransferResult = z.infer<
  typeof InventoryTransferResultSchema
>;

// ============================================================================
// ADMIN SCHEMAS
// ============================================================================

/**
 * Schema for admin inventory management
 */
export const AdminInventoryManagementSchema = z
  .object({
    action: z.enum([
      "list_all_inventories",
      "cleanup_expired_items",
      "fix_data_integrity",
      "rebalance_stacks",
      "generate_inventory_report",
      "bulk_add_items",
      "bulk_remove_items",
      "audit_inventories",
    ]),
    filters: z
      .object({
        userId: z.string().optional(),
        itemCategory: z.string().optional(),
        hasExpiredItems: z.boolean().optional(),
        hasDataIssues: z.boolean().optional(),
        lastUpdatedBefore: z.coerce.date().optional(),
      })
      .optional(),
    bulkOperationData: z
      .object({
        items: z
          .array(
            z.object({
              itemId: z.string(),
              quantity: z.number().int(),
              targetUsers: z.array(z.string()).optional(),
            })
          )
          .optional(),
        reason: z.string().optional(),
        source: z.string().optional(),
      })
      .optional(),
    cleanupOptions: z
      .object({
        removeExpired: z.boolean().default(true),
        removeZeroQuantity: z.boolean().default(true),
        mergeStacks: z.boolean().default(true),
        fixCorruptedMetadata: z.boolean().default(true),
        createBackups: z.boolean().default(true),
      })
      .optional(),
  })
  .strict();

export type AdminInventoryManagement = z.infer<
  typeof AdminInventoryManagementSchema
>;

/**
 * Schema for inventory system statistics
 */
export const InventoryStatsSchema = z
  .object({
    totalInventories: z.number().int().min(0),
    totalUsers: z.number().int().min(0),
    totalItems: z.number().int().min(0),
    totalQuantity: z.number().int().min(0),
    totalValue: z.number(),
    averageItemsPerUser: z.number(),
    averageValuePerUser: z.number(),
    itemDistribution: z.object({
      byCategory: z.record(z.string(), z.number().int().min(0)),
      byRarity: z.record(z.string(), z.number().int().min(0)),
      byCondition: z.record(z.string(), z.number().int().min(0)),
    }),
    expirationMetrics: z.object({
      itemsWithExpiration: z.number().int().min(0),
      expiredItems: z.number().int().min(0),
      expiringSoon: z.number().int().min(0),
      averageExpirationTime: z.number().optional(),
    }),
    stackingMetrics: z.object({
      stackableItems: z.number().int().min(0),
      averageStackUtilization: z.number().min(0).max(1),
      underutilizedStacks: z.number().int().min(0),
      optimizationPotential: z.number().min(0).max(1),
    }),
    healthMetrics: z.object({
      dataIntegrityScore: z.number().min(0).max(1),
      corruptedEntries: z.number().int().min(0),
      orphanedEntries: z.number().int().min(0),
      inconsistentStacks: z.number().int().min(0),
    }),
    activityMetrics: z.object({
      inventoriesModifiedLast24h: z.number().int().min(0),
      inventoriesModifiedLast7d: z.number().int().min(0),
      mostActiveUsers: z.array(
        z.object({
          userId: z.string(),
          userName: z.string().nullable(),
          itemCount: z.number().int().min(0),
          totalValue: z.number(),
        })
      ),
      mostPopularItems: z.array(
        z.object({
          itemId: z.string(),
          itemName: z.string(),
          userCount: z.number().int().min(0),
          totalQuantity: z.number().int().min(0),
        })
      ),
    }),
  })
  .strict();

export type InventoryStats = z.infer<typeof InventoryStatsSchema>;

// ============================================================================
// EXPORTS
// ============================================================================

// All schemas are defined above and exported individually

// Export all validation functions
export const UserInventoryValidation = {
  // Base schemas
  model: UserInventorySchema,
  input: UserInventoryInputSchema,

  // CRUD schemas
  create: CreateUserInventorySchema,
  createApi: CreateUserInventoryApiSchema,
  update: UpdateUserInventorySchema,
  updateApi: UpdateUserInventoryApiSchema,
  partialUpdate: PartialUpdateUserInventorySchema,

  // Inventory management schemas
  addItem: AddItemToInventorySchema,
  removeItem: RemoveItemFromInventorySchema,
  transferItem: TransferItemSchema,
  bulkOperation: BulkInventoryOperationSchema,
  cleanup: CleanupInventorySchema,

  // Query schemas
  findUnique: FindUniqueUserInventorySchema,
  findMany: FindManyUserInventoriesSchema,
  where: UserInventoryWhereSchema,
  orderBy: UserInventoryOrderBySchema,
  select: UserInventorySelectSchema,
  include: UserInventoryIncludeSchema,

  // Helpers
  search: SearchInventorySchema,
  analyzeCapacity: AnalyzeInventoryCapacitySchema,
  validate: ValidateInventorySchema,

  // Response schemas
  response: UserInventoryResponseSchema,
  withRelations: UserInventoryWithRelationsSchema,
  summary: UserInventorySummarySchema,
  operationResult: InventoryOperationResultSchema,
  analysisResult: InventoryAnalysisResultSchema,
  transferResult: InventoryTransferResultSchema,

  // Admin schemas
  adminManagement: AdminInventoryManagementSchema,
  stats: InventoryStatsSchema,

  // Component schemas
  metadata: InventoryItemMetadataSchema,
} as const;
