import { z } from "zod";

// ============================================================================
// COLLECTION METADATA SCHEMAS
// ============================================================================

/**
 * Schema for collection metadata (JSON field)
 */
export const CollectionMetadataSchema = z.object({
  creator: z
    .object({
      displayName: z.string().max(50).optional(),
      bio: z.string().max(500).optional(),
      avatar: z.string().optional(),
      socialLinks: z
        .object({
          website: z.string().url().optional(),
          twitter: z.string().optional(),
          discord: z.string().optional(),
          youtube: z.string().optional(),
        })
        .optional(),
    })
    .optional(),
  collectionInfo: z
    .object({
      theme: z.string().max(100).optional(),
      difficulty: z
        .enum(["beginner", "intermediate", "advanced", "expert", "master"])
        .optional(),
      estimatedValue: z.number().min(0).optional(),
      completionPercentage: z.number().min(0).max(100).optional(),
      lastUpdated: z.coerce.date().optional(),
      updateFrequency: z
        .enum(["daily", "weekly", "monthly", "rarely", "completed"])
        .optional(),
    })
    .optional(),
  presentation: z
    .object({
      coverImage: z.string().optional(),
      gallery: z.array(z.string()).max(20).optional(),
      layout: z.enum(["grid", "list", "showcase", "compact"]).optional(),
      sortOrder: z
        .enum([
          "added_date",
          "name",
          "rarity",
          "value",
          "type",
          "performance",
          "custom",
        ])
        .optional(),
      displaySettings: z
        .object({
          showDetails: z.boolean().default(true),
          showStats: z.boolean().default(true),
          showRarity: z.boolean().default(true),
          showValue: z.boolean().default(false),
          compactView: z.boolean().default(false),
        })
        .optional(),
    })
    .optional(),
  sharing: z
    .object({
      permissions: z
        .enum(["view_only", "suggest_items", "collaborate", "admin"])
        .default("view_only"),
      allowComments: z.boolean().default(true),
      allowRatings: z.boolean().default(true),
      allowForks: z.boolean().default(true),
      requireApproval: z.boolean().default(false),
      maxCollaborators: z.number().int().min(1).max(50).optional(),
    })
    .optional(),
  analytics: z
    .object({
      views: z.number().int().min(0).default(0),
      likes: z.number().int().min(0).default(0),
      forks: z.number().int().min(0).default(0),
      comments: z.number().int().min(0).default(0),
      shares: z.number().int().min(0).default(0),
      lastViewed: z.coerce.date().optional(),
      popularityScore: z.number().min(0).max(1).optional(),
      trendingScore: z.number().min(0).max(1).optional(),
    })
    .optional(),
  curation: z
    .object({
      featured: z.boolean().default(false),
      staffPick: z.boolean().default(false),
      qualityScore: z.number().min(0).max(10).optional(),
      moderationStatus: z
        .enum(["pending", "approved", "rejected", "flagged"])
        .default("pending"),
      moderationNotes: z.string().max(500).optional(),
      categories: z.array(z.string().max(50)).max(10).optional(),
      achievements: z.array(z.string()).optional(),
    })
    .optional(),
  collaboration: z
    .object({
      contributors: z
        .array(
          z.object({
            userId: z.string(),
            role: z.enum(["owner", "admin", "contributor", "viewer"]),
            permissions: z.array(z.string()).optional(),
            joinedAt: z.coerce.date(),
            contributionCount: z.number().int().min(0).default(0),
          })
        )
        .optional(),
      invitations: z
        .array(
          z.object({
            email: z.string().email().optional(),
            userId: z.string().optional(),
            role: z.enum(["admin", "contributor", "viewer"]),
            invitedAt: z.coerce.date(),
            expiresAt: z.coerce.date(),
            status: z.enum(["pending", "accepted", "rejected", "expired"]),
          })
        )
        .optional(),
      changeLog: z
        .array(
          z.object({
            timestamp: z.coerce.date(),
            userId: z.string(),
            action: z.enum([
              "item_added",
              "item_removed",
              "item_modified",
              "metadata_updated",
              "settings_changed",
            ]),
            details: z.string().max(200),
            itemId: z.string().optional(),
          })
        )
        .optional(),
    })
    .optional(),
  customFields: z.record(z.string(), z.unknown()).optional(),
});

export type CollectionMetadata = z.infer<typeof CollectionMetadataSchema>;

/**
 * Schema for collection sharing settings
 */
export const CollectionSharingSchema = z.object({
  visibility: z.enum(["private", "public", "unlisted", "friends_only"]),
  shareCode: z.string().optional(),
  allowComments: z.boolean().default(true),
  allowRatings: z.boolean().default(true),
  allowForks: z.boolean().default(true),
  expiresAt: z.coerce.date().optional(),
  passwordProtected: z.boolean().default(false),
  password: z.string().min(4).max(50).optional(),
  maxViews: z.number().int().min(1).optional(),
  viewCount: z.number().int().min(0).default(0),
  restrictions: z
    .object({
      requireLogin: z.boolean().default(false),
      allowedUsers: z.array(z.string()).optional(),
      blockedUsers: z.array(z.string()).optional(),
      allowedDomains: z.array(z.string()).optional(),
      geographicRestrictions: z.array(z.string()).optional(),
    })
    .optional(),
});

export type CollectionSharing = z.infer<typeof CollectionSharingSchema>;

// ============================================================================
// BASE SCHEMAS
// ============================================================================

/**
 * Base Collection model schema - represents the complete Collection entity
 */
export const CollectionSchema = z
  .object({
    id: z.string(),
    userId: z.string(),
    name: z.string(),
    description: z.string().nullable(),
    type: z.enum(["BOTS", "PARTS", "CHIPS", "SKELETONS", "MIXED"]),
    itemIds: z.array(z.string()),
    isPublic: z.boolean(),
    shareCode: z.string().nullable(),
    version: z.number().int(),
    source: z.string().nullable(),
    tags: z.array(z.string()),
    metadata: CollectionMetadataSchema.nullable(),
    createdAt: z.date(),
    updatedAt: z.date(),
  })
  .strict();

export type Collection = z.infer<typeof CollectionSchema>;

/**
 * Collection input schema for forms and API inputs (without auto-generated fields)
 */
export const CollectionInputSchema = z
  .object({
    userId: z.string().min(1, "User ID is required"),
    name: z
      .string()
      .min(1, "Collection name is required")
      .max(100, "Collection name too long"),
    description: z
      .string()
      .max(1000, "Description too long")
      .nullable()
      .optional(),
    type: z.enum(["BOTS", "PARTS", "CHIPS", "SKELETONS", "MIXED"]),
    itemIds: z
      .array(z.string())
      .max(1000, "Too many items in collection")
      .default([]),
    isPublic: z.boolean().default(false),
    shareCode: z.string().nullable().optional(),
    source: z.string().max(200, "Source too long").nullable().optional(),
    tags: z
      .array(z.string().max(50, "Tag too long"))
      .max(20, "Too many tags")
      .default([]),
    metadata: CollectionMetadataSchema.nullable().optional(),
  })
  .strict()
  .refine(
    (data) => {
      // Validate item consistency with collection type
      if (data.type !== "MIXED" && data.itemIds.length > 0) {
        // This would require additional validation against actual items
        // For now, we'll trust the application logic
        return true;
      }
      return true;
    },
    {
      message:
        "Items must match collection type (except for MIXED collections)",
      path: ["itemIds"],
    }
  );

export type CollectionInput = z.infer<typeof CollectionInputSchema>;

// ============================================================================
// CREATE SCHEMAS
// ============================================================================

/**
 * Schema for creating a new Collection
 * Compatible with Prisma CollectionCreateInput
 */
export const CreateCollectionSchema = z
  .object({
    id: z.string().optional(),
    userId: z.string().min(1, "User ID is required"),
    name: z
      .string()
      .min(1, "Collection name is required")
      .max(100, "Collection name too long"),
    description: z
      .string()
      .max(1000, "Description too long")
      .nullable()
      .optional(),
    type: z.enum(["BOTS", "PARTS", "CHIPS", "SKELETONS", "MIXED"]),
    itemIds: z
      .array(z.string())
      .max(1000, "Too many items in collection")
      .default([]),
    isPublic: z.boolean().default(false),
    shareCode: z.string().nullable().optional(),
    version: z.number().int().min(1).default(1),
    source: z.string().max(200, "Source too long").nullable().optional(),
    tags: z
      .array(z.string().max(50, "Tag too long"))
      .max(20, "Too many tags")
      .default([]),
    metadata: CollectionMetadataSchema.nullable().optional(),
    createdAt: z.coerce.date().optional(),
    updatedAt: z.coerce.date().optional(),
  })
  .strict();

export type CreateCollectionInput = z.infer<typeof CreateCollectionSchema>;

/**
 * Simplified create schema for API endpoints
 */
export const CreateCollectionApiSchema = z
  .object({
    userId: z.string().min(1, "User ID is required"),
    name: z
      .string()
      .min(1, "Collection name is required")
      .max(100, "Collection name too long"),
    description: z.string().max(1000, "Description too long").optional(),
    type: z.enum(["BOTS", "PARTS", "CHIPS", "SKELETONS", "MIXED"]),
    initialItems: z
      .array(z.string())
      .max(100, "Too many initial items")
      .default([]),
    isPublic: z.boolean().default(false),
    generateShareCode: z.boolean().default(false),
    source: z.string().max(200, "Source too long").optional(),
    tags: z
      .array(z.string().max(50, "Tag too long"))
      .max(20, "Too many tags")
      .default([]),
    theme: z.string().max(100, "Theme too long").optional(),
    difficulty: z
      .enum(["beginner", "intermediate", "advanced", "expert", "master"])
      .optional(),
    coverImage: z.string().optional(),
    validateItems: z.boolean().default(true),
    autoGenerateTags: z.boolean().default(false),
    recordActivity: z.boolean().default(true),
  })
  .strict();

export type CreateCollectionApi = z.infer<typeof CreateCollectionApiSchema>;

/**
 * Schema for forking/cloning a collection
 */
export const ForkCollectionSchema = z
  .object({
    sourceCollectionId: z.string().min(1, "Source collection ID is required"),
    newUserId: z.string().min(1, "New user ID is required"),
    newName: z
      .string()
      .min(1, "Collection name is required")
      .max(100, "Collection name too long")
      .optional(),
    copyDescription: z.boolean().default(true),
    copyTags: z.boolean().default(true),
    copyMetadata: z.boolean().default(false),
    includeItems: z.boolean().default(true),
    makePublic: z.boolean().default(false),
    generateShareCode: z.boolean().default(false),
    preserveSource: z.boolean().default(true),
    forkReason: z
      .enum([
        "personal_use",
        "modification",
        "collaboration",
        "backup",
        "other",
      ])
      .optional(),
    forkNotes: z.string().max(500).optional(),
  })
  .strict();

export type ForkCollection = z.infer<typeof ForkCollectionSchema>;

// ============================================================================
// UPDATE SCHEMAS
// ============================================================================

/**
 * Schema for updating a Collection
 * Compatible with Prisma CollectionUpdateInput
 */
export const UpdateCollectionSchema = z
  .object({
    id: z.string().optional(),
    userId: z.string().min(1, "User ID is required").optional(),
    name: z
      .string()
      .min(1, "Collection name is required")
      .max(100, "Collection name too long")
      .optional(),
    description: z
      .string()
      .max(1000, "Description too long")
      .nullable()
      .optional(),
    type: z.enum(["BOTS", "PARTS", "CHIPS", "SKELETONS", "MIXED"]).optional(),
    itemIds: z
      .array(z.string())
      .max(1000, "Too many items in collection")
      .optional(),
    isPublic: z.boolean().optional(),
    shareCode: z.string().nullable().optional(),
    version: z.number().int().min(1).optional(),
    source: z.string().max(200, "Source too long").nullable().optional(),
    tags: z
      .array(z.string().max(50, "Tag too long"))
      .max(20, "Too many tags")
      .optional(),
    metadata: CollectionMetadataSchema.nullable().optional(),
    createdAt: z.coerce.date().optional(),
    updatedAt: z.coerce.date().optional(),
  })
  .strict();

export type UpdateCollectionInput = z.infer<typeof UpdateCollectionSchema>;

/**
 * Schema for adding items to a collection
 */
export const AddItemsToCollectionSchema = z
  .object({
    collectionId: z.string().min(1, "Collection ID is required"),
    itemIds: z
      .array(z.string().min(1, "Item ID cannot be empty"))
      .min(1, "At least one item is required")
      .max(100, "Too many items to add at once"),
    validateItems: z.boolean().default(true),
    checkDuplicates: z.boolean().default(true),
    allowTypeChange: z.boolean().default(false),
    position: z.enum(["start", "end", "custom"]).default("end"),
    customPositions: z.array(z.number().int().min(0)).optional(),
    recordActivity: z.boolean().default(true),
    activityNotes: z.string().max(200).optional(),
  })
  .strict()
  .refine(
    (data) => {
      if (data.position === "custom" && !data.customPositions) {
        return false;
      }
      if (
        data.position === "custom" &&
        data.customPositions &&
        data.customPositions.length !== data.itemIds.length
      ) {
        return false;
      }
      return true;
    },
    {
      message:
        "Custom positions must be provided and match item count for custom positioning",
      path: ["customPositions"],
    }
  );

export type AddItemsToCollection = z.infer<typeof AddItemsToCollectionSchema>;

/**
 * Schema for removing items from a collection
 */
export const RemoveItemsFromCollectionSchema = z
  .object({
    collectionId: z.string().min(1, "Collection ID is required"),
    itemIds: z
      .array(z.string().min(1, "Item ID cannot be empty"))
      .min(1, "At least one item is required")
      .max(100, "Too many items to remove at once"),
    removeReason: z
      .enum([
        "user_request",
        "invalid_item",
        "duplicate",
        "type_mismatch",
        "quality_control",
        "bulk_cleanup",
        "other",
      ])
      .optional(),
    validateItems: z.boolean().default(true),
    recordActivity: z.boolean().default(true),
    activityNotes: z.string().max(200).optional(),
  })
  .strict();

export type RemoveItemsFromCollection = z.infer<
  typeof RemoveItemsFromCollectionSchema
>;

/**
 * Schema for reordering items in a collection
 */
export const ReorderCollectionItemsSchema = z
  .object({
    collectionId: z.string().min(1, "Collection ID is required"),
    newOrder: z
      .array(z.string().min(1, "Item ID cannot be empty"))
      .min(1, "At least one item is required"),
    validateItems: z.boolean().default(true),
    recordActivity: z.boolean().default(true),
    reorderReason: z
      .enum([
        "user_preference",
        "performance_order",
        "rarity_order",
        "alphabetical",
        "chronological",
        "custom_sort",
        "other",
      ])
      .optional(),
    activityNotes: z.string().max(200).optional(),
  })
  .strict();

export type ReorderCollectionItems = z.infer<
  typeof ReorderCollectionItemsSchema
>;

/**
 * Partial update schema - all fields optional
 */
export const PartialUpdateCollectionSchema = CollectionInputSchema.partial();

export type PartialUpdateCollection = z.infer<
  typeof PartialUpdateCollectionSchema
>;

// ============================================================================
// COLLECTION MANAGEMENT SCHEMAS
// ============================================================================

/**
 * Schema for sharing a collection
 */
export const ShareCollectionSchema = z
  .object({
    collectionId: z.string().min(1, "Collection ID is required"),
    sharingSettings: CollectionSharingSchema,
    generateNewCode: z.boolean().default(false),
    notifyCollaborators: z.boolean().default(true),
    customMessage: z.string().max(500).optional(),
    expirationDays: z.number().int().min(1).max(365).optional(),
    maxViews: z.number().int().min(1).max(10000).optional(),
    trackAnalytics: z.boolean().default(true),
  })
  .strict();

export type ShareCollection = z.infer<typeof ShareCollectionSchema>;

/**
 * Schema for managing collection collaborators
 */
export const ManageCollectionCollaboratorsSchema = z
  .object({
    collectionId: z.string().min(1, "Collection ID is required"),
    action: z.enum([
      "invite",
      "remove",
      "update_role",
      "accept_invitation",
      "reject_invitation",
      "leave",
    ]),
    targetUserId: z.string().optional(),
    targetEmail: z.string().email().optional(),
    role: z.enum(["admin", "contributor", "viewer"]).optional(),
    permissions: z.array(z.string()).optional(),
    invitationMessage: z.string().max(500).optional(),
    expirationDays: z.number().int().min(1).max(30).default(7),
    notifyUser: z.boolean().default(true),
    recordActivity: z.boolean().default(true),
  })
  .strict()
  .refine(
    (data) => {
      if (["invite", "update_role"].includes(data.action) && !data.role) {
        return false;
      }
      if (data.action === "invite" && !data.targetUserId && !data.targetEmail) {
        return false;
      }
      return true;
    },
    {
      message: "Required fields missing for the specified action",
      path: ["action"],
    }
  );

export type ManageCollectionCollaborators = z.infer<
  typeof ManageCollectionCollaboratorsSchema
>;

/**
 * Schema for bulk collection operations
 */
export const BulkCollectionOperationSchema = z
  .object({
    userId: z.string().min(1, "User ID is required"),
    operation: z.enum([
      "create_multiple",
      "update_multiple",
      "delete_multiple",
      "merge_collections",
      "split_collection",
      "duplicate_collections",
      "bulk_share",
      "bulk_privacy_update",
      "organize_collections",
    ]),
    collectionIds: z
      .array(z.string().min(1))
      .min(1, "At least one collection is required")
      .max(50, "Too many collections for bulk operation"),
    operationData: z
      .object({
        targetCollectionId: z.string().optional(), // For merge operations
        newCollectionNames: z.array(z.string()).optional(), // For split/duplicate
        updateData: z.record(z.string(), z.unknown()).optional(), // For updates
        sharingSettings: CollectionSharingSchema.optional(), // For sharing
        organizationRules: z
          .object({
            groupByType: z.boolean().default(false),
            sortBy: z
              .enum(["name", "created_date", "item_count", "last_updated"])
              .optional(),
            createFolders: z.boolean().default(false),
          })
          .optional(),
      })
      .optional(),
    operationOptions: z
      .object({
        validateEach: z.boolean().default(true),
        stopOnError: z.boolean().default(false),
        recordActivities: z.boolean().default(true),
        notifyUsers: z.boolean().default(false),
        createBackups: z.boolean().default(true),
      })
      .optional(),
    operationNotes: z.string().max(1000).optional(),
  })
  .strict();

export type BulkCollectionOperation = z.infer<
  typeof BulkCollectionOperationSchema
>;

/**
 * Schema for analyzing collection performance
 */
export const AnalyzeCollectionPerformanceSchema = z
  .object({
    collectionId: z.string().min(1, "Collection ID is required"),
    analysisType: z
      .enum([
        "engagement",
        "growth",
        "quality",
        "diversity",
        "completeness",
        "performance",
        "trends",
        "all",
      ])
      .default("all"),
    timeRange: z
      .object({
        startDate: z.coerce.date(),
        endDate: z.coerce.date(),
      })
      .optional(),
    compareWithPrevious: z.boolean().default(false),
    includeMetrics: z.boolean().default(true),
    includeRecommendations: z.boolean().default(true),
    includeBenchmarks: z.boolean().default(true),
    generateReport: z.boolean().default(false),
  })
  .strict();

export type AnalyzeCollectionPerformance = z.infer<
  typeof AnalyzeCollectionPerformanceSchema
>;

// ============================================================================
// QUERY SCHEMAS
// ============================================================================

/**
 * Schema for finding a unique Collection
 */
export const FindUniqueCollectionSchema = z
  .object({
    id: z.string().optional(),
    shareCode: z.string().optional(),
  })
  .strict();

export type FindUniqueCollectionInput = z.infer<
  typeof FindUniqueCollectionSchema
>;

/**
 * Schema for filtering Collections
 */
export const CollectionWhereSchema: z.ZodType<any> = z.lazy(() =>
  z
    .object({
      id: z.string().optional(),
      userId: z.string().optional(),
      name: z.string().optional(),
      description: z.string().nullable().optional(),
      type: z.enum(["BOTS", "PARTS", "CHIPS", "SKELETONS", "MIXED"]).optional(),
      isPublic: z.boolean().optional(),
      shareCode: z.string().nullable().optional(),
      version: z.number().int().optional(),
      source: z.string().nullable().optional(),
      createdAt: z.date().optional(),
      updatedAt: z.date().optional(),
      AND: z.array(CollectionWhereSchema).optional(),
      OR: z.array(CollectionWhereSchema).optional(),
      NOT: CollectionWhereSchema.optional(),
    })
    .strict()
);

export type CollectionWhere = z.infer<typeof CollectionWhereSchema>;

/**
 * Schema for ordering Collections
 */
export const CollectionOrderBySchema = z
  .object({
    id: z.enum(["asc", "desc"]).optional(),
    userId: z.enum(["asc", "desc"]).optional(),
    name: z.enum(["asc", "desc"]).optional(),
    description: z.enum(["asc", "desc"]).optional(),
    type: z.enum(["asc", "desc"]).optional(),
    isPublic: z.enum(["asc", "desc"]).optional(),
    shareCode: z.enum(["asc", "desc"]).optional(),
    version: z.enum(["asc", "desc"]).optional(),
    source: z.enum(["asc", "desc"]).optional(),
    createdAt: z.enum(["asc", "desc"]).optional(),
    updatedAt: z.enum(["asc", "desc"]).optional(),
  })
  .strict();

export type CollectionOrderBy = z.infer<typeof CollectionOrderBySchema>;

/**
 * Schema for selecting Collection fields
 */
export const CollectionSelectSchema = z
  .object({
    id: z.boolean().optional(),
    userId: z.boolean().optional(),
    name: z.boolean().optional(),
    description: z.boolean().optional(),
    type: z.boolean().optional(),
    itemIds: z.boolean().optional(),
    isPublic: z.boolean().optional(),
    shareCode: z.boolean().optional(),
    version: z.boolean().optional(),
    source: z.boolean().optional(),
    tags: z.boolean().optional(),
    metadata: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    updatedAt: z.boolean().optional(),
    user: z.boolean().optional(),
  })
  .strict();

export type CollectionSelect = z.infer<typeof CollectionSelectSchema>;

/**
 * Schema for including Collection relations
 */
export const CollectionIncludeSchema = z
  .object({
    user: z.boolean().optional(),
  })
  .strict();

export type CollectionInclude = z.infer<typeof CollectionIncludeSchema>;

// ============================================================================
// PAGINATION SCHEMAS
// ============================================================================

/**
 * Schema for paginated Collection queries
 */
export const FindManyCollectionsSchema = z
  .object({
    where: CollectionWhereSchema.optional(),
    orderBy: z
      .union([CollectionOrderBySchema, z.array(CollectionOrderBySchema)])
      .optional(),
    select: CollectionSelectSchema.optional(),
    include: CollectionIncludeSchema.optional(),
    skip: z.number().int().min(0).optional(),
    take: z.number().int().min(1).max(1000).optional(),
    cursor: FindUniqueCollectionSchema.optional(),
  })
  .strict();

export type FindManyCollectionsInput = z.infer<
  typeof FindManyCollectionsSchema
>;

// ============================================================================
// VALIDATION HELPERS
// ============================================================================

/**
 * Schema for searching collections
 */
export const SearchCollectionsSchema = z
  .object({
    query: z.string().max(200).optional(),
    userId: z.string().optional(),
    type: z.enum(["BOTS", "PARTS", "CHIPS", "SKELETONS", "MIXED"]).optional(),
    isPublic: z.boolean().optional(),
    tags: z.array(z.string()).max(10).optional(),
    minItems: z.number().int().min(0).optional(),
    maxItems: z.number().int().min(0).optional(),
    createdAfter: z.coerce.date().optional(),
    createdBefore: z.coerce.date().optional(),
    updatedAfter: z.coerce.date().optional(),
    updatedBefore: z.coerce.date().optional(),
    difficulty: z
      .enum(["beginner", "intermediate", "advanced", "expert", "master"])
      .optional(),
    minRating: z.number().min(0).max(5).optional(),
    featured: z.boolean().optional(),
    staffPick: z.boolean().optional(),
    hasShareCode: z.boolean().optional(),
    includeMetadata: z.boolean().default(false),
    includeUserDetails: z.boolean().default(false),
    includeItemCount: z.boolean().default(true),
    sortBy: z
      .enum([
        "relevance",
        "name",
        "created_date",
        "updated_date",
        "item_count",
        "popularity",
        "rating",
      ])
      .default("relevance"),
    sortOrder: z.enum(["asc", "desc"]).default("desc"),
    limit: z.number().int().min(1).max(100).default(20),
  })
  .strict();

export type SearchCollections = z.infer<typeof SearchCollectionsSchema>;

/**
 * Schema for validating collection access
 */
export const ValidateCollectionAccessSchema = z
  .object({
    collectionId: z.string().min(1, "Collection ID is required"),
    userId: z.string().optional(),
    shareCode: z.string().optional(),
    password: z.string().optional(),
    requestType: z
      .enum(["view", "edit", "delete", "share", "collaborate"])
      .default("view"),
    checkPermissions: z.boolean().default(true),
    validateShareCode: z.boolean().default(true),
    trackAccess: z.boolean().default(true),
  })
  .strict();

export type ValidateCollectionAccess = z.infer<
  typeof ValidateCollectionAccessSchema
>;

/**
 * Schema for getting collection statistics
 */
export const GetCollectionStatsSchema = z
  .object({
    collectionId: z.string().min(1, "Collection ID is required"),
    includeEngagement: z.boolean().default(true),
    includeGrowth: z.boolean().default(true),
    includeQuality: z.boolean().default(true),
    includeDiversity: z.boolean().default(true),
    includeComparisons: z.boolean().default(false),
    timeRange: z
      .object({
        startDate: z.coerce.date(),
        endDate: z.coerce.date(),
      })
      .optional(),
    granularity: z.enum(["daily", "weekly", "monthly"]).default("daily"),
  })
  .strict();

export type GetCollectionStats = z.infer<typeof GetCollectionStatsSchema>;

// ============================================================================
// RESPONSE SCHEMAS
// ============================================================================

/**
 * Schema for Collection API responses
 */
export const CollectionResponseSchema = CollectionSchema;

export type CollectionResponse = z.infer<typeof CollectionResponseSchema>;

/**
 * Schema for Collection with User information
 */
export const CollectionWithUserSchema = CollectionResponseSchema.extend({
  user: z.object({
    id: z.string(),
    name: z.string().nullable(),
    email: z.string(),
    image: z.string().nullable(),
  }),
});

export type CollectionWithUser = z.infer<typeof CollectionWithUserSchema>;

/**
 * Schema for Collection summary (minimal info)
 */
export const CollectionSummarySchema = z
  .object({
    id: z.string(),
    userId: z.string(),
    userName: z.string().nullable(),
    name: z.string(),
    description: z.string().nullable(),
    type: z.string(),
    itemCount: z.number().int().min(0),
    isPublic: z.boolean(),
    hasShareCode: z.boolean(),
    tags: z.array(z.string()),
    coverImage: z.string().nullable(),
    rating: z.number().min(0).max(5).nullable(),
    views: z.number().int().min(0),
    likes: z.number().int().min(0),
    createdAt: z.date(),
    updatedAt: z.date(),
  })
  .strict();

export type CollectionSummary = z.infer<typeof CollectionSummarySchema>;

/**
 * Schema for collection operation result
 */
export const CollectionOperationResultSchema = z
  .object({
    operation: z.string(),
    collectionId: z.string(),
    success: z.boolean(),
    affectedItems: z.array(
      z.object({
        itemId: z.string(),
        itemName: z.string().optional(),
        itemType: z.string().optional(),
        action: z.enum(["added", "removed", "moved", "updated"]),
        position: z.number().int().optional(),
      })
    ),
    summary: z.object({
      itemsBefore: z.number().int().min(0),
      itemsAfter: z.number().int().min(0),
      itemsChanged: z.number().int().min(0),
      newVersion: z.number().int().min(1),
    }),
    warnings: z.array(z.string()).optional(),
    errors: z.array(z.string()).optional(),
    recommendations: z.array(z.string()).optional(),
    transactionId: z.string().optional(),
    metadata: z.record(z.string(), z.unknown()).optional(),
  })
  .strict();

export type CollectionOperationResult = z.infer<
  typeof CollectionOperationResultSchema
>;

/**
 * Schema for collection analytics result
 */
export const CollectionAnalyticsSchema = z
  .object({
    collectionId: z.string(),
    collectionName: z.string(),
    analysisDate: z.date(),
    timeRange: z.object({
      startDate: z.date(),
      endDate: z.date(),
    }),
    summary: z.object({
      totalItems: z.number().int().min(0),
      uniqueItems: z.number().int().min(0),
      duplicateItems: z.number().int().min(0),
      itemsPerType: z.record(z.string(), z.number().int().min(0)),
      averageItemValue: z.number().min(0),
      totalEstimatedValue: z.number().min(0),
      completionPercentage: z.number().min(0).max(100),
    }),
    engagement: z.object({
      views: z.number().int().min(0),
      uniqueViewers: z.number().int().min(0),
      likes: z.number().int().min(0),
      comments: z.number().int().min(0),
      shares: z.number().int().min(0),
      forks: z.number().int().min(0),
      rating: z.number().min(0).max(5),
      ratingCount: z.number().int().min(0),
      engagementRate: z.number().min(0).max(1),
    }),
    growth: z.object({
      itemsAdded: z.number().int().min(0),
      itemsRemoved: z.number().int().min(0),
      netGrowth: z.number().int(),
      growthRate: z.number(),
      averageItemsPerDay: z.number(),
      growthTrend: z.enum(["increasing", "decreasing", "stable"]),
    }),
    quality: z.object({
      averageRarity: z.string(),
      rarityDistribution: z.record(z.string(), z.number().int().min(0)),
      qualityScore: z.number().min(0).max(10),
      duplicateRate: z.number().min(0).max(1),
      consistencyScore: z.number().min(0).max(1),
      curatedScore: z.number().min(0).max(1),
    }),
    diversity: z.object({
      typeDistribution: z.record(z.string(), z.number().int().min(0)),
      diversityIndex: z.number().min(0).max(1),
      specializationLevel: z.enum(["generalist", "specialist", "mixed"]),
      uniquenessScore: z.number().min(0).max(1),
    }),
    performance: z.object({
      popularityRank: z.number().int().min(1).optional(),
      trendingScore: z.number().min(0).max(1),
      viralityIndex: z.number().min(0).max(1),
      retentionRate: z.number().min(0).max(1),
      conversionRate: z.number().min(0).max(1),
    }),
    recommendations: z.array(
      z.object({
        category: z.enum([
          "content",
          "engagement",
          "quality",
          "growth",
          "optimization",
          "sharing",
        ]),
        priority: z.enum(["low", "medium", "high", "urgent"]),
        description: z.string(),
        actionRequired: z.boolean(),
        estimatedImpact: z.enum(["low", "medium", "high"]),
        estimatedEffort: z.enum(["low", "medium", "high"]),
      })
    ),
  })
  .strict();

export type CollectionAnalytics = z.infer<typeof CollectionAnalyticsSchema>;

// ============================================================================
// ADMIN SCHEMAS
// ============================================================================

/**
 * Schema for admin collection management
 */
export const AdminCollectionManagementSchema = z
  .object({
    action: z.enum([
      "list_all_collections",
      "moderate_collections",
      "feature_collections",
      "generate_collection_report",
      "cleanup_orphaned_collections",
      "analyze_collection_trends",
      "bulk_moderate",
      "audit_collections",
    ]),
    filters: z
      .object({
        userId: z.string().optional(),
        type: z
          .enum(["BOTS", "PARTS", "CHIPS", "SKELETONS", "MIXED"])
          .optional(),
        isPublic: z.boolean().optional(),
        featured: z.boolean().optional(),
        moderationStatus: z
          .enum(["pending", "approved", "rejected", "flagged"])
          .optional(),
        createdAfter: z.coerce.date().optional(),
        createdBefore: z.coerce.date().optional(),
        minViews: z.number().int().min(0).optional(),
        minItems: z.number().int().min(0).optional(),
      })
      .optional(),
    moderationOptions: z
      .object({
        autoApprove: z.boolean().default(false),
        flagSuspicious: z.boolean().default(true),
        generateReports: z.boolean().default(true),
        notifyUsers: z.boolean().default(true),
        createBackups: z.boolean().default(true),
      })
      .optional(),
    reportOptions: z
      .object({
        includeDetails: z.boolean().default(true),
        includeMetrics: z.boolean().default(true),
        includeAnalytics: z.boolean().default(true),
        includeTrends: z.boolean().default(true),
        format: z.enum(["json", "csv", "pdf"]).default("json"),
      })
      .optional(),
  })
  .strict();

export type AdminCollectionManagement = z.infer<
  typeof AdminCollectionManagementSchema
>;

/**
 * Schema for collection system statistics
 */
export const CollectionSystemStatsSchema = z
  .object({
    totalCollections: z.number().int().min(0),
    totalUsers: z.number().int().min(0),
    totalItems: z.number().int().min(0),
    averageItemsPerCollection: z.number(),
    averageCollectionsPerUser: z.number(),
    collectionDistribution: z.object({
      byType: z.record(z.string(), z.number().int().min(0)),
      byVisibility: z.object({
        public: z.number().int().min(0),
        private: z.number().int().min(0),
        shared: z.number().int().min(0),
      }),
      bySize: z.object({
        empty: z.number().int().min(0),
        small: z.number().int().min(0), // 1-10 items
        medium: z.number().int().min(0), // 11-50 items
        large: z.number().int().min(0), // 51-200 items
        xlarge: z.number().int().min(0), // 200+ items
      }),
    }),
    engagementMetrics: z.object({
      totalViews: z.number().int().min(0),
      totalLikes: z.number().int().min(0),
      totalShares: z.number().int().min(0),
      totalForks: z.number().int().min(0),
      averageEngagementRate: z.number().min(0).max(1),
      topCollections: z.array(
        z.object({
          collectionId: z.string(),
          collectionName: z.string(),
          views: z.number().int().min(0),
          likes: z.number().int().min(0),
          rating: z.number().min(0).max(5),
        })
      ),
    }),
    qualityMetrics: z.object({
      moderatedCollections: z.number().int().min(0),
      featuredCollections: z.number().int().min(0),
      averageQualityScore: z.number().min(0).max(10),
      pendingModeration: z.number().int().min(0),
      flaggedCollections: z.number().int().min(0),
    }),
    growthMetrics: z.object({
      collectionsCreatedLast24h: z.number().int().min(0),
      collectionsCreatedLast7d: z.number().int().min(0),
      collectionsCreatedLast30d: z.number().int().min(0),
      growthRate: z.number(),
      activeUsers: z.number().int().min(0),
      retentionRate: z.number().min(0).max(1),
    }),
    trendsAndInsights: z.object({
      popularTypes: z.array(z.string()),
      emergingTags: z.array(z.string()),
      seasonalTrends: z.record(z.string(), z.number()),
      userBehaviorPatterns: z.record(z.string(), z.unknown()),
      contentGaps: z.array(z.string()),
      opportunities: z.array(z.string()),
    }),
  })
  .strict();

export type CollectionSystemStats = z.infer<typeof CollectionSystemStatsSchema>;

// ============================================================================
// EXPORTS
// ============================================================================

// All schemas are defined above and exported individually

// Export all validation functions
export const CollectionValidation = {
  // Base schemas
  model: CollectionSchema,
  input: CollectionInputSchema,

  // CRUD schemas
  create: CreateCollectionSchema,
  createApi: CreateCollectionApiSchema,
  fork: ForkCollectionSchema,
  update: UpdateCollectionSchema,
  partialUpdate: PartialUpdateCollectionSchema,

  // Collection management schemas
  addItems: AddItemsToCollectionSchema,
  removeItems: RemoveItemsFromCollectionSchema,
  reorderItems: ReorderCollectionItemsSchema,
  share: ShareCollectionSchema,
  manageCollaborators: ManageCollectionCollaboratorsSchema,
  bulkOperation: BulkCollectionOperationSchema,
  analyzePerformance: AnalyzeCollectionPerformanceSchema,

  // Query schemas
  findUnique: FindUniqueCollectionSchema,
  findMany: FindManyCollectionsSchema,
  where: CollectionWhereSchema,
  orderBy: CollectionOrderBySchema,
  select: CollectionSelectSchema,
  include: CollectionIncludeSchema,

  // Helpers
  search: SearchCollectionsSchema,
  validateAccess: ValidateCollectionAccessSchema,
  getStats: GetCollectionStatsSchema,

  // Response schemas
  response: CollectionResponseSchema,
  withUser: CollectionWithUserSchema,
  summary: CollectionSummarySchema,
  operationResult: CollectionOperationResultSchema,
  analytics: CollectionAnalyticsSchema,

  // Admin schemas
  adminManagement: AdminCollectionManagementSchema,
  systemStats: CollectionSystemStatsSchema,

  // Component schemas
  metadata: CollectionMetadataSchema,
  sharing: CollectionSharingSchema,
} as const;
