import { z } from "zod";

// ============================================================================
// SLOT IDENTIFIER ENUM SCHEMA
// ============================================================================

/**
 * SlotIdentifier enum values based on skeleton types and slot positions
 * These represent specific slots available on different skeleton types
 */
export const SlotIdentifierSchema = z.enum([
  // Universal slots (available on all skeletons)
  "HEAD_PRIMARY",
  "TORSO_PRIMARY",
  "ARM_LEFT",
  "ARM_RIGHT",
  "LEG_LEFT",
  "LEG_RIGHT",

  // Secondary slots (available on some skeletons)
  "HEAD_SECONDARY",
  "TORSO_SECONDARY",
  "ARM_LEFT_SECONDARY",
  "ARM_RIGHT_SECONDARY",
  "LEG_LEFT_SECONDARY",
  "LEG_RIGHT_SECONDARY",

  // Accessory slots
  "ACCESSORY_1",
  "ACCESSORY_2",
  "ACCESSORY_3",
  "ACCESSORY_4",

  // Expansion chip slots
  "EXPANSION_1",
  "EXPANSION_2",
  "EXPANSION_3",
  "EXPANSION_4",
  "EXPANSION_5",
  "EXPANSION_6",

  // Special slots
  "SOUL_CHIP",
  "CORE_MODULE",
  "POWER_SOURCE",
  "SENSOR_ARRAY",

  // Heavy skeleton exclusive slots
  "HEAVY_ARMOR_FRONT",
  "HEAVY_ARMOR_BACK",
  "HEAVY_WEAPON_MOUNT",

  // Flying skeleton exclusive slots
  "WING_LEFT",
  "WING_RIGHT",
  "PROPULSION_PRIMARY",
  "PROPULSION_SECONDARY",

  // Modular skeleton exclusive slots
  "MODULE_1",
  "MODULE_2",
  "MODULE_3",
  "MODULE_4",
  "MODULE_5",
  "MODULE_6",
]);

export type SlotIdentifier = z.infer<typeof SlotIdentifierSchema>;

/**
 * Part category including special categories for slot assignments
 */
export const SlotPartCategorySchema = z.enum([
  // Standard part categories
  "ARM",
  "LEG",
  "TORSO",
  "HEAD",
  "ACCESSORY",

  // Special categories for slot assignments
  "EXPANSION_CHIP",
  "SOUL_CHIP",

  // Additional special categories
  "CORE_MODULE",
  "SENSOR",
  "WEAPON",
  "ARMOR",
  "PROPULSION",
]);

export type SlotPartCategory = z.infer<typeof SlotPartCategorySchema>;

// ============================================================================
// BASE SCHEMAS
// ============================================================================

/**
 * Base SlotAssignment model schema - represents the complete SlotAssignment entity
 */
export const SlotAssignmentSchema = z
  .object({
    id: z.string(),
    slotId: z.string(),
    partId: z.string(),
    partName: z.string(),
    partCategory: z.string(),
    assignedAt: z.date(),
    metadata: z.record(z.string(), z.unknown()).nullable(),
    configurationId: z.string(),
    createdAt: z.date(),
    updatedAt: z.date(),
  })
  .strict();

export type SlotAssignment = z.infer<typeof SlotAssignmentSchema>;

/**
 * SlotAssignment input schema for forms and API inputs (without auto-generated fields)
 */
export const SlotAssignmentInputSchema = z
  .object({
    slotId: SlotIdentifierSchema,
    partId: z.string().min(1, "Part ID is required"),
    partName: z
      .string()
      .min(1, "Part name is required")
      .max(100, "Part name too long"),
    partCategory: SlotPartCategorySchema,
    assignedAt: z.coerce.date().optional(),
    metadata: z.record(z.string(), z.unknown()).nullable().optional(),
    configurationId: z.string().min(1, "Configuration ID is required"),
  })
  .strict()
  .refine(
    (data) => {
      // Validate slot-category compatibility
      const slotCategoryRules = {
        HEAD_PRIMARY: ["HEAD", "ACCESSORY"],
        HEAD_SECONDARY: ["HEAD", "ACCESSORY", "SENSOR"],
        TORSO_PRIMARY: ["TORSO", "CORE_MODULE"],
        TORSO_SECONDARY: ["TORSO", "ARMOR"],
        ARM_LEFT: ["ARM", "WEAPON"],
        ARM_RIGHT: ["ARM", "WEAPON"],
        LEG_LEFT: ["LEG"],
        LEG_RIGHT: ["LEG"],
        SOUL_CHIP: ["SOUL_CHIP"],
        EXPANSION_1: ["EXPANSION_CHIP"],
        EXPANSION_2: ["EXPANSION_CHIP"],
        EXPANSION_3: ["EXPANSION_CHIP"],
        EXPANSION_4: ["EXPANSION_CHIP"],
        EXPANSION_5: ["EXPANSION_CHIP"],
        EXPANSION_6: ["EXPANSION_CHIP"],
      };

      const allowedCategories =
        slotCategoryRules[data.slotId as keyof typeof slotCategoryRules];
      if (allowedCategories && !allowedCategories.includes(data.partCategory)) {
        return false;
      }

      return true;
    },
    {
      message: "Part category is not compatible with the selected slot",
      path: ["partCategory"],
    }
  );

export type SlotAssignmentInput = z.infer<typeof SlotAssignmentInputSchema>;

// ============================================================================
// CREATE SCHEMAS
// ============================================================================

/**
 * Schema for creating a new SlotAssignment
 * Compatible with Prisma SlotAssignmentCreateInput
 */
export const CreateSlotAssignmentSchema = z
  .object({
    id: z.string().optional(),
    slotId: SlotIdentifierSchema,
    partId: z.string().min(1, "Part ID is required"),
    partName: z
      .string()
      .min(1, "Part name is required")
      .max(100, "Part name too long"),
    partCategory: SlotPartCategorySchema,
    assignedAt: z.coerce
      .date()
      .optional()
      .default(() => new Date()),
    metadata: z.record(z.string(), z.unknown()).nullable().optional(),
    configurationId: z.string().min(1, "Configuration ID is required"),
    createdAt: z.coerce.date().optional(),
    updatedAt: z.coerce.date().optional(),
  })
  .strict()
  .refine(
    (data) => {
      // Same slot-category compatibility validation
      const slotCategoryRules = {
        HEAD_PRIMARY: ["HEAD", "ACCESSORY"],
        HEAD_SECONDARY: ["HEAD", "ACCESSORY", "SENSOR"],
        TORSO_PRIMARY: ["TORSO", "CORE_MODULE"],
        TORSO_SECONDARY: ["TORSO", "ARMOR"],
        ARM_LEFT: ["ARM", "WEAPON"],
        ARM_RIGHT: ["ARM", "WEAPON"],
        LEG_LEFT: ["LEG"],
        LEG_RIGHT: ["LEG"],
        SOUL_CHIP: ["SOUL_CHIP"],
        EXPANSION_1: ["EXPANSION_CHIP"],
        EXPANSION_2: ["EXPANSION_CHIP"],
        EXPANSION_3: ["EXPANSION_CHIP"],
        EXPANSION_4: ["EXPANSION_CHIP"],
        EXPANSION_5: ["EXPANSION_CHIP"],
        EXPANSION_6: ["EXPANSION_CHIP"],
      };

      const allowedCategories =
        slotCategoryRules[data.slotId as keyof typeof slotCategoryRules];
      if (allowedCategories && !allowedCategories.includes(data.partCategory)) {
        return false;
      }

      return true;
    },
    {
      message: "Part category is not compatible with the selected slot",
      path: ["partCategory"],
    }
  );

export type CreateSlotAssignmentInput = z.infer<
  typeof CreateSlotAssignmentSchema
>;

/**
 * Simplified create schema for API endpoints
 */
export const CreateSlotAssignmentApiSchema = z
  .object({
    configurationId: z.string().min(1, "Configuration ID is required"),
    slotId: SlotIdentifierSchema,
    partId: z.string().min(1, "Part ID is required"),
    validateCompatibility: z.boolean().default(true),
    allowOverwrite: z.boolean().default(false),
    metadata: z
      .object({
        rotation: z.number().optional(),
        scale: z.number().min(0.1).max(5.0).optional(),
        position: z
          .object({
            x: z.number(),
            y: z.number(),
            z: z.number(),
          })
          .optional(),
        customization: z
          .object({
            color: z.string().optional(),
            texture: z.string().optional(),
            effects: z.array(z.string()).optional(),
          })
          .optional(),
      })
      .optional(),
  })
  .strict();

export type CreateSlotAssignmentApi = z.infer<
  typeof CreateSlotAssignmentApiSchema
>;

// ============================================================================
// UPDATE SCHEMAS
// ============================================================================

/**
 * Schema for updating a SlotAssignment
 * Compatible with Prisma SlotAssignmentUpdateInput
 */
export const UpdateSlotAssignmentSchema = z
  .object({
    id: z.string().optional(),
    slotId: SlotIdentifierSchema.optional(),
    partId: z.string().min(1, "Part ID is required").optional(),
    partName: z
      .string()
      .min(1, "Part name is required")
      .max(100, "Part name too long")
      .optional(),
    partCategory: SlotPartCategorySchema.optional(),
    assignedAt: z.coerce.date().optional(),
    metadata: z.record(z.string(), z.unknown()).nullable().optional(),
    configurationId: z
      .string()
      .min(1, "Configuration ID is required")
      .optional(),
    createdAt: z.coerce.date().optional(),
    updatedAt: z.coerce.date().optional(),
  })
  .strict();

export type UpdateSlotAssignmentInput = z.infer<
  typeof UpdateSlotAssignmentSchema
>;

/**
 * Simplified update schema for API endpoints
 */
export const UpdateSlotAssignmentApiSchema = z
  .object({
    partId: z.string().min(1, "Part ID is required").optional(),
    metadata: z
      .object({
        rotation: z.number().optional(),
        scale: z.number().min(0.1).max(5.0).optional(),
        position: z
          .object({
            x: z.number(),
            y: z.number(),
            z: z.number(),
          })
          .optional(),
        customization: z
          .object({
            color: z.string().optional(),
            texture: z.string().optional(),
            effects: z.array(z.string()).optional(),
          })
          .optional(),
      })
      .optional(),
    validateCompatibility: z.boolean().default(true),
  })
  .strict();

export type UpdateSlotAssignmentApi = z.infer<
  typeof UpdateSlotAssignmentApiSchema
>;

/**
 * Partial update schema - all fields optional
 */
export const PartialUpdateSlotAssignmentSchema =
  SlotAssignmentInputSchema.partial();
export type PartialUpdateSlotAssignment = z.infer<
  typeof PartialUpdateSlotAssignmentSchema
>;

// ============================================================================
// SLOT MANAGEMENT SCHEMAS
// ============================================================================

/**
 * Schema for assigning a part to a slot
 */
export const AssignPartToSlotSchema = z
  .object({
    configurationId: z.string().min(1, "Configuration ID is required"),
    slotId: SlotIdentifierSchema,
    partId: z.string().min(1, "Part ID is required"),
    partType: z.enum(["part", "expansion_chip", "soul_chip"]),
    allowOverwrite: z.boolean().default(false),
    validateCompatibility: z.boolean().default(true),
    preserveMetadata: z.boolean().default(false),
    metadata: z
      .object({
        rotation: z.number().optional(),
        scale: z.number().min(0.1).max(5.0).optional(),
        position: z
          .object({
            x: z.number(),
            y: z.number(),
            z: z.number(),
          })
          .optional(),
        customization: z
          .object({
            color: z.string().optional(),
            texture: z.string().optional(),
            effects: z.array(z.string()).optional(),
          })
          .optional(),
        notes: z.string().max(500).optional(),
      })
      .optional(),
  })
  .strict();

export type AssignPartToSlot = z.infer<typeof AssignPartToSlotSchema>;

/**
 * Schema for unassigning a part from a slot
 */
export const UnassignPartFromSlotSchema = z
  .object({
    configurationId: z.string().min(1, "Configuration ID is required"),
    slotId: SlotIdentifierSchema,
    returnToInventory: z.boolean().default(true),
    recordHistory: z.boolean().default(true),
    reason: z
      .enum([
        "user_request",
        "part_upgrade",
        "skeleton_change",
        "maintenance",
        "system_cleanup",
      ])
      .optional(),
  })
  .strict();

export type UnassignPartFromSlot = z.infer<typeof UnassignPartFromSlotSchema>;

/**
 * Schema for swapping parts between slots
 */
export const SwapSlotAssignmentsSchema = z
  .object({
    configurationId: z.string().min(1, "Configuration ID is required"),
    slotId1: SlotIdentifierSchema,
    slotId2: SlotIdentifierSchema,
    validateCompatibility: z.boolean().default(true),
    preserveMetadata: z.boolean().default(true),
    recordHistory: z.boolean().default(true),
  })
  .strict()
  .refine((data) => data.slotId1 !== data.slotId2, {
    message: "Cannot swap a slot with itself",
    path: ["slotId2"],
  });

export type SwapSlotAssignments = z.infer<typeof SwapSlotAssignmentsSchema>;

/**
 * Schema for moving a part from one slot to another
 */
export const MoveSlotAssignmentSchema = z
  .object({
    configurationId: z.string().min(1, "Configuration ID is required"),
    fromSlotId: SlotIdentifierSchema,
    toSlotId: SlotIdentifierSchema,
    allowOverwrite: z.boolean().default(false),
    validateCompatibility: z.boolean().default(true),
    preserveMetadata: z.boolean().default(true),
    recordHistory: z.boolean().default(true),
  })
  .strict()
  .refine((data) => data.fromSlotId !== data.toSlotId, {
    message: "Cannot move a part to the same slot",
    path: ["toSlotId"],
  });

export type MoveSlotAssignment = z.infer<typeof MoveSlotAssignmentSchema>;

/**
 * Schema for bulk slot assignment operations
 */
export const BulkSlotAssignmentSchema = z
  .object({
    configurationId: z.string().min(1, "Configuration ID is required"),
    assignments: z
      .array(
        z.object({
          slotId: SlotIdentifierSchema,
          partId: z.string().min(1, "Part ID is required"),
          partType: z.enum(["part", "expansion_chip", "soul_chip"]),
          metadata: z
            .object({
              rotation: z.number().optional(),
              scale: z.number().min(0.1).max(5.0).optional(),
              position: z
                .object({
                  x: z.number(),
                  y: z.number(),
                  z: z.number(),
                })
                .optional(),
              customization: z
                .object({
                  color: z.string().optional(),
                  texture: z.string().optional(),
                  effects: z.array(z.string()).optional(),
                })
                .optional(),
            })
            .optional(),
        })
      )
      .min(1, "At least one assignment is required")
      .max(50, "Too many assignments"),
    allowOverwrite: z.boolean().default(false),
    validateCompatibility: z.boolean().default(true),
    stopOnError: z.boolean().default(true),
    recordHistory: z.boolean().default(true),
  })
  .strict()
  .refine(
    (data) => {
      // Check for duplicate slot assignments
      const slotIds = data.assignments.map((a) => a.slotId);
      const uniqueSlotIds = new Set(slotIds);
      return slotIds.length === uniqueSlotIds.size;
    },
    {
      message: "Cannot assign multiple parts to the same slot",
      path: ["assignments"],
    }
  );

export type BulkSlotAssignment = z.infer<typeof BulkSlotAssignmentSchema>;

// ============================================================================
// QUERY SCHEMAS
// ============================================================================

/**
 * Schema for finding a unique SlotAssignment
 */
export const FindUniqueSlotAssignmentSchema = z
  .object({
    id: z.string().optional(),
    configurationId_slotId: z
      .object({
        configurationId: z.string(),
        slotId: z.string(),
      })
      .optional(),
  })
  .strict();

export type FindUniqueSlotAssignmentInput = z.infer<
  typeof FindUniqueSlotAssignmentSchema
>;

/**
 * Schema for filtering SlotAssignments
 */
export const SlotAssignmentWhereSchema: z.ZodType<any> = z.lazy(() =>
  z
    .object({
      id: z.string().optional(),
      slotId: z.string().optional(),
      partId: z.string().optional(),
      partName: z.string().optional(),
      partCategory: z.string().optional(),
      assignedAt: z.date().optional(),
      configurationId: z.string().optional(),
      createdAt: z.date().optional(),
      updatedAt: z.date().optional(),
      AND: z.array(SlotAssignmentWhereSchema).optional(),
      OR: z.array(SlotAssignmentWhereSchema).optional(),
      NOT: SlotAssignmentWhereSchema.optional(),
    })
    .strict()
);

export type SlotAssignmentWhere = z.infer<typeof SlotAssignmentWhereSchema>;

/**
 * Schema for ordering SlotAssignments
 */
export const SlotAssignmentOrderBySchema = z
  .object({
    id: z.enum(["asc", "desc"]).optional(),
    slotId: z.enum(["asc", "desc"]).optional(),
    partId: z.enum(["asc", "desc"]).optional(),
    partName: z.enum(["asc", "desc"]).optional(),
    partCategory: z.enum(["asc", "desc"]).optional(),
    assignedAt: z.enum(["asc", "desc"]).optional(),
    configurationId: z.enum(["asc", "desc"]).optional(),
    createdAt: z.enum(["asc", "desc"]).optional(),
    updatedAt: z.enum(["asc", "desc"]).optional(),
  })
  .strict();

export type SlotAssignmentOrderBy = z.infer<typeof SlotAssignmentOrderBySchema>;

/**
 * Schema for selecting SlotAssignment fields
 */
export const SlotAssignmentSelectSchema = z
  .object({
    id: z.boolean().optional(),
    slotId: z.boolean().optional(),
    partId: z.boolean().optional(),
    partName: z.boolean().optional(),
    partCategory: z.boolean().optional(),
    assignedAt: z.boolean().optional(),
    metadata: z.boolean().optional(),
    configurationId: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    updatedAt: z.boolean().optional(),
    configuration: z.boolean().optional(),
  })
  .strict();

export type SlotAssignmentSelect = z.infer<typeof SlotAssignmentSelectSchema>;

/**
 * Schema for including SlotAssignment relations
 */
export const SlotAssignmentIncludeSchema = z
  .object({
    configuration: z.boolean().optional(),
  })
  .strict();

export type SlotAssignmentInclude = z.infer<typeof SlotAssignmentIncludeSchema>;

// ============================================================================
// PAGINATION SCHEMAS
// ============================================================================

/**
 * Schema for paginated SlotAssignment queries
 */
export const FindManySlotAssignmentsSchema = z
  .object({
    where: SlotAssignmentWhereSchema.optional(),
    orderBy: z
      .union([
        SlotAssignmentOrderBySchema,
        z.array(SlotAssignmentOrderBySchema),
      ])
      .optional(),
    select: SlotAssignmentSelectSchema.optional(),
    include: SlotAssignmentIncludeSchema.optional(),
    skip: z.number().int().min(0).optional(),
    take: z.number().int().min(1).max(1000).optional(),
    cursor: FindUniqueSlotAssignmentSchema.optional(),
  })
  .strict();

export type FindManySlotAssignmentsInput = z.infer<
  typeof FindManySlotAssignmentsSchema
>;

// ============================================================================
// VALIDATION HELPERS
// ============================================================================

/**
 * Schema for validating slot configuration consistency
 */
export const ValidateSlotConfigurationSchema = z
  .object({
    configurationId: z.string().min(1, "Configuration ID is required"),
    checkSlotCompatibility: z.boolean().default(true),
    checkPartCompatibility: z.boolean().default(true),
    checkDuplicateSlots: z.boolean().default(true),
    fixInconsistencies: z.boolean().default(false),
    removeInvalidAssignments: z.boolean().default(false),
  })
  .strict();

export type ValidateSlotConfiguration = z.infer<
  typeof ValidateSlotConfigurationSchema
>;

/**
 * Schema for slot assignment analysis
 */
export const AnalyzeSlotAssignmentsSchema = z
  .object({
    configurationId: z.string().min(1, "Configuration ID is required"),
    analyzeUtilization: z.boolean().default(true),
    analyzeCompatibility: z.boolean().default(true),
    analyzePerformance: z.boolean().default(true),
    includeRecommendations: z.boolean().default(true),
    includeOptimizations: z.boolean().default(true),
  })
  .strict();

export type AnalyzeSlotAssignments = z.infer<
  typeof AnalyzeSlotAssignmentsSchema
>;

/**
 * Schema for slot assignment search and filtering
 */
export const SearchSlotAssignmentsSchema = z
  .object({
    configurationId: z.string().optional(),
    partCategory: SlotPartCategorySchema.optional(),
    slotType: z
      .enum([
        "primary",
        "secondary",
        "accessory",
        "expansion",
        "special",
        "weapon",
        "armor",
      ])
      .optional(),
    partName: z.string().optional(),
    hasMetadata: z.boolean().optional(),
    assignedAfter: z.coerce.date().optional(),
    assignedBefore: z.coerce.date().optional(),
    slotIds: z.array(SlotIdentifierSchema).optional(),
    partIds: z.array(z.string()).optional(),
    includeEmpty: z.boolean().default(false),
    limit: z.number().int().min(1).max(100).default(20),
  })
  .strict();

export type SearchSlotAssignments = z.infer<typeof SearchSlotAssignmentsSchema>;

/**
 * Schema for slot compatibility checking
 */
export const CheckSlotCompatibilitySchema = z
  .object({
    slotId: SlotIdentifierSchema,
    partId: z.string().min(1, "Part ID is required"),
    partType: z.enum(["part", "expansion_chip", "soul_chip"]),
    skeletonType: z
      .enum(["LIGHT", "BALANCED", "HEAVY", "FLYING", "MODULAR"])
      .optional(),
    checkRequirements: z.boolean().default(true),
    checkConflicts: z.boolean().default(true),
    checkCapacity: z.boolean().default(true),
  })
  .strict();

export type CheckSlotCompatibility = z.infer<
  typeof CheckSlotCompatibilitySchema
>;

// ============================================================================
// RESPONSE SCHEMAS
// ============================================================================

/**
 * Schema for SlotAssignment API responses
 */
export const SlotAssignmentResponseSchema = SlotAssignmentSchema;

export type SlotAssignmentResponse = z.infer<
  typeof SlotAssignmentResponseSchema
>;

/**
 * Schema for SlotAssignment with Configuration information
 */
export const SlotAssignmentWithConfigurationSchema =
  SlotAssignmentResponseSchema.safeExtend({
    configuration: z.object({
      id: z.string(),
      botId: z.string(),
      skeletonType: z.string(),
      lastModified: z.date(),
    }),
  });

export type SlotAssignmentWithConfiguration = z.infer<
  typeof SlotAssignmentWithConfigurationSchema
>;

/**
 * Schema for SlotAssignment summary (minimal info)
 */
export const SlotAssignmentSummarySchema = z
  .object({
    id: z.string(),
    slotId: z.string(),
    partId: z.string(),
    partName: z.string(),
    partCategory: z.string(),
    assignedAt: z.date(),
    hasMetadata: z.boolean(),
  })
  .strict();

export type SlotAssignmentSummary = z.infer<typeof SlotAssignmentSummarySchema>;

/**
 * Schema for slot configuration overview
 */
export const SlotConfigurationOverviewSchema = z
  .object({
    configurationId: z.string(),
    botId: z.string(),
    skeletonType: z.string(),
    totalSlots: z.number().int().min(0),
    assignedSlots: z.number().int().min(0),
    emptySlots: z.number().int().min(0),
    utilizationRate: z.number().min(0).max(1),
    assignments: z.array(SlotAssignmentSummarySchema),
    lastModified: z.date(),
  })
  .strict();

export type SlotConfigurationOverview = z.infer<
  typeof SlotConfigurationOverviewSchema
>;

/**
 * Schema for slot assignment with part details
 */
export const SlotAssignmentWithPartDetailsSchema =
  SlotAssignmentResponseSchema.safeExtend({
    partDetails: z.object({
      id: z.string(),
      name: z.string(),
      category: z.string(),
      rarity: z.string().optional(),
      stats: z
        .object({
          attack: z.number().optional(),
          defense: z.number().optional(),
          speed: z.number().optional(),
          perception: z.number().optional(),
        })
        .optional(),
      durability: z
        .object({
          current: z.number().optional(),
          max: z.number().optional(),
        })
        .optional(),
      version: z.number().optional(),
    }),
    slotInfo: z.object({
      type: z.string(),
      category: z.string(),
      position: z.string(),
      allowedPartCategories: z.array(z.string()),
      isSpecialSlot: z.boolean(),
    }),
  });

export type SlotAssignmentWithPartDetails = z.infer<
  typeof SlotAssignmentWithPartDetailsSchema
>;

/**
 * Schema for slot assignment validation result
 */
export const SlotAssignmentValidationResultSchema = z
  .object({
    isValid: z.boolean(),
    errors: z.array(
      z.object({
        field: z.string(),
        message: z.string(),
        code: z.string(),
        severity: z.enum(["error", "warning", "info"]),
      })
    ),
    warnings: z.array(
      z.object({
        field: z.string(),
        message: z.string(),
        code: z.string(),
        recommendation: z.string().optional(),
      })
    ),
    compatibility: z.object({
      slotCompatible: z.boolean(),
      categoryCompatible: z.boolean(),
      requirementsMet: z.boolean(),
      conflictsFound: z.boolean(),
    }),
    suggestions: z.array(
      z.object({
        type: z.enum(["alternative_slot", "compatible_part", "optimization"]),
        description: z.string(),
        priority: z.enum(["low", "medium", "high"]),
        data: z.record(z.string(), z.unknown()).optional(),
      })
    ),
  })
  .strict();

export type SlotAssignmentValidationResult = z.infer<
  typeof SlotAssignmentValidationResultSchema
>;

/**
 * Schema for bulk slot assignment result
 */
export const BulkSlotAssignmentResultSchema = z
  .object({
    totalAttempted: z.number().int().min(0),
    successful: z.number().int().min(0),
    failed: z.number().int().min(0),
    results: z.array(
      z.object({
        slotId: z.string(),
        partId: z.string(),
        success: z.boolean(),
        assignmentId: z.string().optional(),
        error: z.string().optional(),
        warnings: z.array(z.string()).optional(),
      })
    ),
    rollbackPerformed: z.boolean(),
    configurationUpdated: z.boolean(),
    historyRecorded: z.boolean(),
  })
  .strict();

export type BulkSlotAssignmentResult = z.infer<
  typeof BulkSlotAssignmentResultSchema
>;

// ============================================================================
// ADMIN SCHEMAS
// ============================================================================

/**
 * Schema for admin slot assignment management
 */
export const AdminSlotAssignmentManagementSchema = z
  .object({
    action: z.enum([
      "list_all",
      "clear_assignments",
      "reset_configuration",
      "fix_inconsistencies",
      "bulk_reassign",
      "generate_report",
      "optimize_assignments",
    ]),
    configurationId: z.string().optional(),
    clearOptions: z
      .object({
        preserveMetadata: z.boolean().default(false),
        returnToInventory: z.boolean().default(true),
        recordHistory: z.boolean().default(true),
      })
      .optional(),
    fixOptions: z
      .object({
        removeInvalid: z.boolean().default(false),
        fixCompatibility: z.boolean().default(true),
        updateMetadata: z.boolean().default(false),
      })
      .optional(),
    optimizeOptions: z
      .object({
        prioritizePerformance: z.boolean().default(true),
        balanceStats: z.boolean().default(true),
        minimizeConflicts: z.boolean().default(true),
        preserveUserPreferences: z.boolean().default(true),
      })
      .optional(),
  })
  .strict();

export type AdminSlotAssignmentManagement = z.infer<
  typeof AdminSlotAssignmentManagementSchema
>;

/**
 * Schema for slot assignment statistics
 */
export const SlotAssignmentStatsSchema = z
  .object({
    totalAssignments: z.number().int().min(0),
    totalConfigurations: z.number().int().min(0),
    averageUtilization: z.number().min(0).max(1),
    categoryDistribution: z.record(z.string(), z.number().int().min(0)),
    slotUtilization: z.record(z.string(), z.number().int().min(0)),
    skeletonTypeStats: z.record(
      z.string(),
      z.object({
        configurations: z.number().int().min(0),
        averageUtilization: z.number().min(0).max(1),
        commonAssignments: z.array(
          z.object({
            slotId: z.string(),
            partCategory: z.string(),
            count: z.number().int().min(0),
          })
        ),
      })
    ),
    recentActivity: z.object({
      assignmentsLast24h: z.number().int().min(0),
      assignmentsLast7d: z.number().int().min(0),
      topAssignedParts: z.array(
        z.object({
          partId: z.string(),
          partName: z.string(),
          assignmentCount: z.number().int().min(0),
        })
      ),
      mostUtilizedSlots: z.array(
        z.object({
          slotId: z.string(),
          utilizationCount: z.number().int().min(0),
        })
      ),
    }),
    performanceMetrics: z.object({
      averageAssignmentTime: z.number(),
      conflictRate: z.number().min(0).max(1),
      validationFailureRate: z.number().min(0).max(1),
      userSatisfactionRate: z.number().min(0).max(1),
    }),
  })
  .strict();

export type SlotAssignmentStats = z.infer<typeof SlotAssignmentStatsSchema>;

// ============================================================================
// EXPORTS
// ============================================================================

// All schemas are defined above and exported individually

// Export all validation functions
export const SlotAssignmentValidation = {
  // Base schemas
  model: SlotAssignmentSchema,
  input: SlotAssignmentInputSchema,

  // CRUD schemas
  create: CreateSlotAssignmentSchema,
  createApi: CreateSlotAssignmentApiSchema,
  update: UpdateSlotAssignmentSchema,
  updateApi: UpdateSlotAssignmentApiSchema,
  partialUpdate: PartialUpdateSlotAssignmentSchema,

  // Slot management schemas
  assign: AssignPartToSlotSchema,
  unassign: UnassignPartFromSlotSchema,
  swap: SwapSlotAssignmentsSchema,
  move: MoveSlotAssignmentSchema,
  bulkAssign: BulkSlotAssignmentSchema,

  // Query schemas
  findUnique: FindUniqueSlotAssignmentSchema,
  findMany: FindManySlotAssignmentsSchema,
  where: SlotAssignmentWhereSchema,
  orderBy: SlotAssignmentOrderBySchema,
  select: SlotAssignmentSelectSchema,
  include: SlotAssignmentIncludeSchema,

  // Helpers
  validateConfiguration: ValidateSlotConfigurationSchema,
  analyze: AnalyzeSlotAssignmentsSchema,
  search: SearchSlotAssignmentsSchema,
  checkCompatibility: CheckSlotCompatibilitySchema,

  // Response schemas
  response: SlotAssignmentResponseSchema,
  withConfiguration: SlotAssignmentWithConfigurationSchema,
  summary: SlotAssignmentSummarySchema,
  configurationOverview: SlotConfigurationOverviewSchema,
  withPartDetails: SlotAssignmentWithPartDetailsSchema,
  validationResult: SlotAssignmentValidationResultSchema,
  bulkResult: BulkSlotAssignmentResultSchema,

  // Admin schemas
  adminManagement: AdminSlotAssignmentManagementSchema,
  stats: SlotAssignmentStatsSchema,

  // Enum schemas
  slotIdentifier: SlotIdentifierSchema,
  partCategory: SlotPartCategorySchema,
} as const;
