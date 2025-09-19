import { z } from "zod";

// ============================================================================
// BOT PART CONFIGURATION SCHEMAS
// ============================================================================

/**
 * Schema for bot part assembly metadata
 */
export const BotPartAssemblyMetadataSchema = z.object({
  installationDate: z.coerce.date().optional(),
  installedBy: z.string().optional(), // User ID who installed this part
  installationContext: z
    .enum(["initial_assembly", "upgrade", "repair", "modification", "admin"])
    .optional(),
  assemblyNotes: z.string().max(500).optional(),
  compatibility: z
    .object({
      isCompatible: z.boolean(),
      compatibilityScore: z.number().min(0).max(1).optional(),
      warnings: z.array(z.string()).optional(),
      restrictions: z.array(z.string()).optional(),
    })
    .optional(),
  performance: z
    .object({
      efficiency: z.number().min(0).max(1).optional(),
      powerConsumption: z.number().min(0).optional(),
      heatGeneration: z.number().min(0).optional(),
      wearRate: z.number().min(0).max(1).optional(),
    })
    .optional(),
  customization: z
    .object({
      visualMods: z.record(z.string(), z.unknown()).optional(),
      functionalMods: z.record(z.string(), z.unknown()).optional(),
      tuning: z.record(z.string(), z.number()).optional(),
    })
    .optional(),
  maintenance: z
    .object({
      lastMaintenance: z.coerce.date().optional(),
      maintenanceInterval: z.number().int().min(1).optional(), // hours
      maintenanceHistory: z
        .array(
          z.object({
            date: z.coerce.date(),
            type: z.enum(["routine", "repair", "upgrade", "emergency"]),
            technician: z.string().optional(),
            notes: z.string().max(200).optional(),
            cost: z.number().min(0).optional(),
          })
        )
        .optional(),
    })
    .optional(),
  analytics: z
    .object({
      usageTime: z.number().min(0).optional(), // hours
      battlesParticipated: z.number().int().min(0).optional(),
      missionsCompleted: z.number().int().min(0).optional(),
      damageDealt: z.number().min(0).optional(),
      damageTaken: z.number().min(0).optional(),
      averagePerformance: z.number().min(0).max(1).optional(),
    })
    .optional(),
});

export type BotPartAssemblyMetadata = z.infer<
  typeof BotPartAssemblyMetadataSchema
>;

/**
 * Schema for slot configuration rules and constraints
 */
export const SlotConfigurationSchema = z.object({
  slotType: z.enum([
    "primary",
    "secondary",
    "accessory",
    "utility",
    "weapon",
    "armor",
    "support",
  ]),
  isRequired: z.boolean().default(false),
  allowedCategories: z
    .array(z.enum(["ARM", "LEG", "TORSO", "HEAD", "ACCESSORY"]))
    .optional(),
  minRarity: z
    .enum([
      "COMMON",
      "UNCOMMON",
      "RARE",
      "EPIC",
      "LEGENDARY",
      "ULTRA_RARE",
      "PROTOTYPE",
    ])
    .optional(),
  maxRarity: z
    .enum([
      "COMMON",
      "UNCOMMON",
      "RARE",
      "EPIC",
      "LEGENDARY",
      "ULTRA_RARE",
      "PROTOTYPE",
    ])
    .optional(),
  powerRequirement: z.number().min(0).optional(),
  sizeRestriction: z.enum(["small", "medium", "large", "any"]).optional(),
  conflictSlots: z.array(z.number().int()).optional(), // Slots that conflict with this one
  dependentSlots: z.array(z.number().int()).optional(), // Slots that require this one
  weight: z.number().min(0).optional(),
  priority: z.number().int().min(0).max(10).optional(),
});

export type SlotConfiguration = z.infer<typeof SlotConfigurationSchema>;

// ============================================================================
// BASE SCHEMAS
// ============================================================================

/**
 * Base BotPart model schema - represents the complete BotPart entity
 */
export const BotPartSchema = z
  .object({
    id: z.string(),
    botId: z.string(),
    partId: z.string(),
    slotIndex: z.number().int(),
    createdAt: z.date(),
  })
  .strict();

export type BotPart = z.infer<typeof BotPartSchema>;

/**
 * BotPart input schema for forms and API inputs (without auto-generated fields)
 */
export const BotPartInputSchema = z
  .object({
    botId: z.string().min(1, "Bot ID is required"),
    partId: z.string().min(1, "Part ID is required"),
    slotIndex: z
      .number()
      .int()
      .min(0, "Slot index must be non-negative")
      .max(99, "Slot index too large"),
  })
  .strict()
  .refine(
    (data) => {
      // Basic slot index validation - can be extended with bot-specific rules
      return data.slotIndex >= 0;
    },
    {
      message: "Invalid slot index for bot configuration",
      path: ["slotIndex"],
    }
  );

export type BotPartInput = z.infer<typeof BotPartInputSchema>;

// ============================================================================
// CREATE SCHEMAS
// ============================================================================

/**
 * Schema for creating a new BotPart
 * Compatible with Prisma BotPartCreateInput
 */
export const CreateBotPartSchema = z
  .object({
    id: z.string().optional(),
    botId: z.string().min(1, "Bot ID is required"),
    partId: z.string().min(1, "Part ID is required"),
    slotIndex: z
      .number()
      .int()
      .min(0, "Slot index must be non-negative")
      .max(99, "Slot index too large"),
    createdAt: z.coerce.date().optional(),
  })
  .strict();

export type CreateBotPartInput = z.infer<typeof CreateBotPartSchema>;

/**
 * Simplified create schema for API endpoints with validation
 */
export const CreateBotPartApiSchema = z
  .object({
    botId: z.string().min(1, "Bot ID is required"),
    partId: z.string().min(1, "Part ID is required"),
    slotIndex: z
      .number()
      .int()
      .min(0, "Slot index must be non-negative")
      .max(99, "Slot index too large"),
    validateCompatibility: z.boolean().default(true),
    validateSlotAvailability: z.boolean().default(true),
    validatePartOwnership: z.boolean().default(true),
    validateBotOwnership: z.boolean().default(true),
    forceInstall: z.boolean().default(false),
    assemblyMetadata: BotPartAssemblyMetadataSchema.optional(),
    installationNotes: z.string().max(500).optional(),
    recordActivity: z.boolean().default(true),
  })
  .strict();

export type CreateBotPartApi = z.infer<typeof CreateBotPartApiSchema>;

/**
 * Schema for installing a part with advanced options
 */
export const InstallPartSchema = z
  .object({
    botId: z.string().min(1, "Bot ID is required"),
    partId: z.string().min(1, "Part ID is required"),
    targetSlotIndex: z
      .number()
      .int()
      .min(0, "Slot index must be non-negative")
      .max(99, "Slot index too large"),
    installationStrategy: z
      .enum(["replace", "swap", "find_best_slot", "force"])
      .default("replace"),
    swapWithSlotIndex: z.number().int().min(0).max(99).optional(),
    priority: z.enum(["low", "normal", "high", "critical"]).default("normal"),
    validationRules: z
      .object({
        checkCompatibility: z.boolean().default(true),
        checkPowerRequirements: z.boolean().default(true),
        checkSizeConstraints: z.boolean().default(true),
        checkConflicts: z.boolean().default(true),
        checkDependencies: z.boolean().default(true),
        allowDowngrade: z.boolean().default(false),
      })
      .optional(),
    assemblyOptions: z
      .object({
        autoTune: z.boolean().default(false),
        applyOptimalSettings: z.boolean().default(true),
        runDiagnostics: z.boolean().default(true),
        recordMetrics: z.boolean().default(true),
      })
      .optional(),
    metadata: BotPartAssemblyMetadataSchema.optional(),
    installationNotes: z.string().max(1000).optional(),
  })
  .strict();

export type InstallPart = z.infer<typeof InstallPartSchema>;

// ============================================================================
// UPDATE SCHEMAS
// ============================================================================

/**
 * Schema for updating a BotPart
 * Compatible with Prisma BotPartUpdateInput
 */
export const UpdateBotPartSchema = z
  .object({
    id: z.string().optional(),
    botId: z.string().min(1, "Bot ID is required").optional(),
    partId: z.string().min(1, "Part ID is required").optional(),
    slotIndex: z
      .number()
      .int()
      .min(0, "Slot index must be non-negative")
      .max(99, "Slot index too large")
      .optional(),
    createdAt: z.coerce.date().optional(),
  })
  .strict();

export type UpdateBotPartInput = z.infer<typeof UpdateBotPartSchema>;

/**
 * Schema for moving a part to a different slot
 */
export const MovePartToSlotSchema = z
  .object({
    botPartId: z.string().min(1, "BotPart ID is required"),
    newSlotIndex: z
      .number()
      .int()
      .min(0, "Slot index must be non-negative")
      .max(99, "Slot index too large"),
    moveStrategy: z
      .enum(["replace", "swap", "find_empty", "force"])
      .default("replace"),
    swapWithPartId: z.string().optional(),
    validateMove: z.boolean().default(true),
    preserveMetadata: z.boolean().default(true),
    recordActivity: z.boolean().default(true),
    moveReason: z
      .enum([
        "optimization",
        "repair",
        "upgrade",
        "user_preference",
        "system_maintenance",
        "compatibility",
      ])
      .optional(),
    moveNotes: z.string().max(500).optional(),
  })
  .strict();

export type MovePartToSlot = z.infer<typeof MovePartToSlotSchema>;

/**
 * Partial update schema - all fields optional
 */
export const PartialUpdateBotPartSchema = BotPartInputSchema.partial();

export type PartialUpdateBotPart = z.infer<typeof PartialUpdateBotPartSchema>;

// ============================================================================
// BOT ASSEMBLY MANAGEMENT SCHEMAS
// ============================================================================

/**
 * Schema for uninstalling a part from a bot
 */
export const UninstallPartSchema = z
  .object({
    botPartId: z.string().min(1, "BotPart ID is required"),
    uninstallReason: z
      .enum([
        "upgrade",
        "repair",
        "maintenance",
        "optimization",
        "user_request",
        "system_requirement",
        "compatibility_issue",
      ])
      .optional(),
    preservePart: z.boolean().default(true),
    returnToInventory: z.boolean().default(true),
    recordActivity: z.boolean().default(true),
    forceUninstall: z.boolean().default(false),
    uninstallNotes: z.string().max(500).optional(),
    maintenanceSchedule: z
      .object({
        scheduleRepair: z.boolean().default(false),
        scheduleUpgrade: z.boolean().default(false),
        maintenanceDate: z.coerce.date().optional(),
        technician: z.string().optional(),
      })
      .optional(),
  })
  .strict();

export type UninstallPart = z.infer<typeof UninstallPartSchema>;

/**
 * Schema for swapping parts between slots
 */
export const SwapPartsSchema = z
  .object({
    botId: z.string().min(1, "Bot ID is required"),
    firstSlotIndex: z
      .number()
      .int()
      .min(0, "Slot index must be non-negative")
      .max(99, "Slot index too large"),
    secondSlotIndex: z
      .number()
      .int()
      .min(0, "Slot index must be non-negative")
      .max(99, "Slot index too large"),
    validateSwap: z.boolean().default(true),
    checkCompatibility: z.boolean().default(true),
    preserveMetadata: z.boolean().default(true),
    recordActivity: z.boolean().default(true),
    swapReason: z
      .enum([
        "optimization",
        "performance",
        "user_preference",
        "maintenance",
        "testing",
      ])
      .optional(),
    swapNotes: z.string().max(500).optional(),
  })
  .strict()
  .refine((data) => data.firstSlotIndex !== data.secondSlotIndex, {
    message: "Cannot swap a slot with itself",
    path: ["secondSlotIndex"],
  });

export type SwapParts = z.infer<typeof SwapPartsSchema>;

/**
 * Schema for bulk part operations
 */
export const BulkPartOperationSchema = z
  .object({
    botId: z.string().min(1, "Bot ID is required"),
    operation: z.enum([
      "install_multiple",
      "uninstall_multiple",
      "move_multiple",
      "optimize_assembly",
      "validate_assembly",
      "repair_assembly",
      "reset_assembly",
    ]),
    parts: z
      .array(
        z.object({
          partId: z.string().min(1, "Part ID is required"),
          slotIndex: z.number().int().min(0).max(99),
          priority: z.enum(["low", "normal", "high"]).default("normal"),
          metadata: BotPartAssemblyMetadataSchema.optional(),
        })
      )
      .min(1, "At least one part is required")
      .max(50, "Too many parts for bulk operation"),
    operationOptions: z
      .object({
        validateEach: z.boolean().default(true),
        stopOnError: z.boolean().default(false),
        optimizeSlots: z.boolean().default(true),
        recordActivities: z.boolean().default(true),
        runDiagnostics: z.boolean().default(true),
      })
      .optional(),
    assemblyStrategy: z
      .enum(["sequential", "parallel", "optimal", "manual"])
      .default("optimal"),
    operationNotes: z.string().max(1000).optional(),
  })
  .strict();

export type BulkPartOperation = z.infer<typeof BulkPartOperationSchema>;

/**
 * Schema for optimizing bot assembly
 */
export const OptimizeBotAssemblySchema = z
  .object({
    botId: z.string().min(1, "Bot ID is required"),
    optimizationGoals: z
      .array(
        z.enum([
          "performance",
          "power_efficiency",
          "durability",
          "speed",
          "defense",
          "attack",
          "balanced",
        ])
      )
      .min(1, "At least one optimization goal is required"),
    constraints: z
      .object({
        maxPowerConsumption: z.number().min(0).optional(),
        minPerformanceThreshold: z.number().min(0).max(1).optional(),
        budgetLimit: z.number().min(0).optional(),
        rarityRestrictions: z
          .array(
            z.enum([
              "COMMON",
              "UNCOMMON",
              "RARE",
              "EPIC",
              "LEGENDARY",
              "ULTRA_RARE",
              "PROTOTYPE",
            ])
          )
          .optional(),
        categoryRestrictions: z
          .array(z.enum(["ARM", "LEG", "TORSO", "HEAD", "ACCESSORY"]))
          .optional(),
        preserveSlots: z.array(z.number().int().min(0).max(99)).optional(),
      })
      .optional(),
    optimizationOptions: z
      .object({
        allowPartUpgrades: z.boolean().default(true),
        allowPartDowngrades: z.boolean().default(false),
        allowSlotReorganization: z.boolean().default(true),
        considerPartSynergies: z.boolean().default(true),
        optimizeForCombat: z.boolean().default(false),
        optimizeForUtility: z.boolean().default(false),
      })
      .optional(),
    generateReport: z.boolean().default(true),
    applyOptimizations: z.boolean().default(false),
    previewChanges: z.boolean().default(true),
  })
  .strict();

export type OptimizeBotAssembly = z.infer<typeof OptimizeBotAssemblySchema>;

// ============================================================================
// QUERY SCHEMAS
// ============================================================================

/**
 * Schema for finding a unique BotPart
 */
export const FindUniqueBotPartSchema = z
  .object({
    id: z.string().optional(),
    botId_partId: z
      .object({
        botId: z.string(),
        partId: z.string(),
      })
      .optional(),
    botId_slotIndex: z
      .object({
        botId: z.string(),
        slotIndex: z.number().int(),
      })
      .optional(),
  })
  .strict();

export type FindUniqueBotPartInput = z.infer<typeof FindUniqueBotPartSchema>;

/**
 * Schema for filtering BotParts
 */
export const BotPartWhereSchema: z.ZodType<any> = z.lazy(() =>
  z
    .object({
      id: z.string().optional(),
      botId: z.string().optional(),
      partId: z.string().optional(),
      slotIndex: z.number().int().optional(),
      createdAt: z.date().optional(),
      AND: z.array(BotPartWhereSchema).optional(),
      OR: z.array(BotPartWhereSchema).optional(),
      NOT: BotPartWhereSchema.optional(),
    })
    .strict()
);

export type BotPartWhere = z.infer<typeof BotPartWhereSchema>;

/**
 * Schema for ordering BotParts
 */
export const BotPartOrderBySchema = z
  .object({
    id: z.enum(["asc", "desc"]).optional(),
    botId: z.enum(["asc", "desc"]).optional(),
    partId: z.enum(["asc", "desc"]).optional(),
    slotIndex: z.enum(["asc", "desc"]).optional(),
    createdAt: z.enum(["asc", "desc"]).optional(),
  })
  .strict();

export type BotPartOrderBy = z.infer<typeof BotPartOrderBySchema>;

/**
 * Schema for selecting BotPart fields
 */
export const BotPartSelectSchema = z
  .object({
    id: z.boolean().optional(),
    botId: z.boolean().optional(),
    partId: z.boolean().optional(),
    slotIndex: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    bot: z.boolean().optional(),
    part: z.boolean().optional(),
  })
  .strict();

export type BotPartSelect = z.infer<typeof BotPartSelectSchema>;

/**
 * Schema for including BotPart relations
 */
export const BotPartIncludeSchema = z
  .object({
    bot: z.boolean().optional(),
    part: z.boolean().optional(),
  })
  .strict();

export type BotPartInclude = z.infer<typeof BotPartIncludeSchema>;

// ============================================================================
// PAGINATION SCHEMAS
// ============================================================================

/**
 * Schema for paginated BotPart queries
 */
export const FindManyBotPartsSchema = z
  .object({
    where: BotPartWhereSchema.optional(),
    orderBy: z
      .union([BotPartOrderBySchema, z.array(BotPartOrderBySchema)])
      .optional(),
    select: BotPartSelectSchema.optional(),
    include: BotPartIncludeSchema.optional(),
    skip: z.number().int().min(0).optional(),
    take: z.number().int().min(1).max(1000).optional(),
    cursor: FindUniqueBotPartSchema.optional(),
  })
  .strict();

export type FindManyBotPartsInput = z.infer<typeof FindManyBotPartsSchema>;

// ============================================================================
// VALIDATION HELPERS
// ============================================================================

/**
 * Schema for analyzing bot assembly
 */
export const AnalyzeBotAssemblySchema = z
  .object({
    botId: z.string().min(1, "Bot ID is required"),
    analysisType: z
      .enum([
        "compatibility",
        "performance",
        "optimization",
        "diagnostics",
        "health",
        "recommendations",
        "all",
      ])
      .default("all"),
    includeMetrics: z.boolean().default(true),
    includeRecommendations: z.boolean().default(true),
    includeOptimizations: z.boolean().default(true),
    performanceGoals: z
      .array(
        z.enum([
          "attack",
          "defense",
          "speed",
          "efficiency",
          "durability",
          "versatility",
        ])
      )
      .optional(),
    generateDetailedReport: z.boolean().default(false),
  })
  .strict();

export type AnalyzeBotAssembly = z.infer<typeof AnalyzeBotAssemblySchema>;

/**
 * Schema for validating bot part compatibility
 */
export const ValidateBotPartCompatibilitySchema = z
  .object({
    botId: z.string().min(1, "Bot ID is required"),
    partId: z.string().min(1, "Part ID is required"),
    targetSlotIndex: z
      .number()
      .int()
      .min(0, "Slot index must be non-negative")
      .max(99, "Slot index too large"),
    validationLevel: z
      .enum(["basic", "standard", "strict", "comprehensive"])
      .default("standard"),
    checkConflicts: z.boolean().default(true),
    checkDependencies: z.boolean().default(true),
    checkPowerRequirements: z.boolean().default(true),
    checkSizeConstraints: z.boolean().default(true),
    checkPerformanceImpact: z.boolean().default(true),
    generateCompatibilityScore: z.boolean().default(true),
  })
  .strict();

export type ValidateBotPartCompatibility = z.infer<
  typeof ValidateBotPartCompatibilitySchema
>;

/**
 * Schema for getting bot assembly configuration
 */
export const GetBotAssemblyConfigSchema = z
  .object({
    botId: z.string().min(1, "Bot ID is required"),
    includePartDetails: z.boolean().default(true),
    includePerformanceMetrics: z.boolean().default(true),
    includeAssemblyMetadata: z.boolean().default(true),
    includeCompatibilityInfo: z.boolean().default(true),
    slotRange: z
      .object({
        startSlot: z.number().int().min(0).max(99),
        endSlot: z.number().int().min(0).max(99),
      })
      .optional(),
    filterByCategory: z
      .array(z.enum(["ARM", "LEG", "TORSO", "HEAD", "ACCESSORY"]))
      .optional(),
    sortBy: z
      .enum(["slotIndex", "partName", "rarity", "performance", "installDate"])
      .default("slotIndex"),
  })
  .strict();

export type GetBotAssemblyConfig = z.infer<typeof GetBotAssemblyConfigSchema>;

/**
 * Schema for part search and filtering
 */
export const SearchBotPartsSchema = z
  .object({
    botId: z.string().optional(),
    partCategory: z
      .enum(["ARM", "LEG", "TORSO", "HEAD", "ACCESSORY"])
      .optional(),
    partRarity: z
      .enum([
        "COMMON",
        "UNCOMMON",
        "RARE",
        "EPIC",
        "LEGENDARY",
        "ULTRA_RARE",
        "PROTOTYPE",
      ])
      .optional(),
    slotRange: z
      .object({
        min: z.number().int().min(0).max(99),
        max: z.number().int().min(0).max(99),
      })
      .optional(),
    installedAfter: z.coerce.date().optional(),
    installedBefore: z.coerce.date().optional(),
    performanceThreshold: z.number().min(0).max(1).optional(),
    hasMetadata: z.boolean().optional(),
    needsMaintenance: z.boolean().optional(),
    includePartDetails: z.boolean().default(true),
    includeBotDetails: z.boolean().default(false),
    includePerformanceData: z.boolean().default(false),
    sortBy: z
      .enum([
        "slotIndex",
        "partName",
        "installDate",
        "performance",
        "rarity",
        "category",
      ])
      .default("slotIndex"),
    sortOrder: z.enum(["asc", "desc"]).default("asc"),
    limit: z.number().int().min(1).max(100).default(20),
  })
  .strict();

export type SearchBotParts = z.infer<typeof SearchBotPartsSchema>;

// ============================================================================
// RESPONSE SCHEMAS
// ============================================================================

/**
 * Schema for BotPart API responses
 */
export const BotPartResponseSchema = BotPartSchema;

export type BotPartResponse = z.infer<typeof BotPartResponseSchema>;

/**
 * Schema for BotPart with Bot and Part information
 */
export const BotPartWithRelationsSchema = BotPartResponseSchema.extend({
  bot: z.object({
    id: z.string(),
    name: z.string(),
    botType: z.string(),
    description: z.string().nullable(),
  }),
  part: z.object({
    id: z.string(),
    name: z.string(),
    category: z.string(),
    rarity: z.string(),
    attack: z.number().int(),
    defense: z.number().int(),
    speed: z.number().int(),
    perception: z.number().int(),
    energyConsumption: z.number().int(),
    upgradeLevel: z.number().int(),
    currentDurability: z.number().int(),
    maxDurability: z.number().int(),
  }),
});

export type BotPartWithRelations = z.infer<typeof BotPartWithRelationsSchema>;

/**
 * Schema for BotPart summary (minimal info)
 */
export const BotPartSummarySchema = z
  .object({
    id: z.string(),
    botId: z.string(),
    botName: z.string(),
    partId: z.string(),
    partName: z.string(),
    partCategory: z.string(),
    partRarity: z.string(),
    slotIndex: z.number().int(),
    installDate: z.date(),
    performance: z.number().min(0).max(1),
    needsMaintenance: z.boolean(),
  })
  .strict();

export type BotPartSummary = z.infer<typeof BotPartSummarySchema>;

/**
 * Schema for assembly operation result
 */
export const AssemblyOperationResultSchema = z
  .object({
    operation: z.string(),
    botId: z.string(),
    success: z.boolean(),
    affectedParts: z.array(
      z.object({
        partId: z.string(),
        partName: z.string(),
        slotIndexBefore: z.number().int().nullable(),
        slotIndexAfter: z.number().int().nullable(),
        action: z.enum(["installed", "uninstalled", "moved", "swapped"]),
      })
    ),
    performanceChange: z
      .object({
        before: z.number().min(0).max(1),
        after: z.number().min(0).max(1),
        improvement: z.number(),
      })
      .optional(),
    warnings: z.array(z.string()).optional(),
    errors: z.array(z.string()).optional(),
    recommendations: z.array(z.string()).optional(),
    transactionId: z.string().optional(),
    metadata: z.record(z.string(), z.unknown()).optional(),
  })
  .strict();

export type AssemblyOperationResult = z.infer<
  typeof AssemblyOperationResultSchema
>;

/**
 * Schema for bot assembly analysis result
 */
export const BotAssemblyAnalysisSchema = z
  .object({
    botId: z.string(),
    botName: z.string(),
    analysisDate: z.date(),
    overallScore: z.number().min(0).max(1),
    summary: z.object({
      totalParts: z.number().int().min(0),
      filledSlots: z.number().int().min(0),
      emptySlots: z.number().int().min(0),
      utilizationRate: z.number().min(0).max(1),
      averagePartRarity: z.string(),
      totalPowerConsumption: z.number().min(0),
      estimatedPerformance: z.number().min(0).max(1),
    }),
    categoryBreakdown: z.record(
      z.string(),
      z.object({
        count: z.number().int().min(0),
        averageLevel: z.number(),
        averageRarity: z.string(),
        totalStats: z.object({
          attack: z.number(),
          defense: z.number(),
          speed: z.number(),
          perception: z.number(),
        }),
      })
    ),
    slotAnalysis: z.array(
      z.object({
        slotIndex: z.number().int(),
        isOccupied: z.boolean(),
        partId: z.string().nullable(),
        partName: z.string().nullable(),
        partCategory: z.string().nullable(),
        partRarity: z.string().nullable(),
        compatibility: z.number().min(0).max(1).nullable(),
        performance: z.number().min(0).max(1).nullable(),
        recommendations: z.array(z.string()).optional(),
      })
    ),
    compatibilityMatrix: z.record(
      z.string(),
      z.object({
        compatibility: z.number().min(0).max(1),
        conflicts: z.array(z.string()),
        synergies: z.array(z.string()),
        recommendations: z.array(z.string()),
      })
    ),
    performanceMetrics: z.object({
      combat: z.object({
        attack: z.number(),
        defense: z.number(),
        speed: z.number(),
        overall: z.number().min(0).max(1),
      }),
      utility: z.object({
        perception: z.number(),
        energyEfficiency: z.number().min(0).max(1),
        durability: z.number().min(0).max(1),
        overall: z.number().min(0).max(1),
      }),
      overall: z.number().min(0).max(1),
    }),
    maintenanceStatus: z.object({
      partsNeedingMaintenance: z.number().int().min(0),
      averageCondition: z.number().min(0).max(1),
      nextMaintenanceDate: z.date().nullable(),
      maintenanceCost: z.number().min(0),
      urgentRepairs: z.array(z.string()),
    }),
    optimizationOpportunities: z.array(
      z.object({
        type: z.enum([
          "slot_optimization",
          "part_upgrade",
          "compatibility_improvement",
          "performance_boost",
          "efficiency_gain",
          "maintenance_reduction",
        ]),
        description: z.string(),
        priority: z.enum(["low", "medium", "high", "critical"]),
        estimatedImprovement: z.number().min(0).max(1),
        estimatedCost: z.number().min(0).optional(),
        affectedSlots: z.array(z.number().int()),
        recommendedParts: z.array(z.string()).optional(),
      })
    ),
    recommendations: z.array(
      z.object({
        category: z.enum([
          "performance",
          "efficiency",
          "maintenance",
          "compatibility",
          "optimization",
        ]),
        description: z.string(),
        priority: z.enum(["low", "medium", "high", "urgent"]),
        actionRequired: z.boolean(),
        estimatedBenefit: z.string(),
      })
    ),
  })
  .strict();

export type BotAssemblyAnalysis = z.infer<typeof BotAssemblyAnalysisSchema>;

/**
 * Schema for part compatibility result
 */
export const PartCompatibilityResultSchema = z
  .object({
    isCompatible: z.boolean(),
    compatibilityScore: z.number().min(0).max(1),
    botId: z.string(),
    partId: z.string(),
    targetSlotIndex: z.number().int(),
    validationResults: z.object({
      basicCompatibility: z.boolean(),
      powerRequirements: z.boolean(),
      sizeConstraints: z.boolean(),
      conflictCheck: z.boolean(),
      dependencyCheck: z.boolean(),
      performanceImpact: z.boolean(),
    }),
    issues: z.array(
      z.object({
        type: z.enum([
          "incompatible_category",
          "insufficient_power",
          "size_mismatch",
          "slot_conflict",
          "missing_dependency",
          "performance_degradation",
          "other",
        ]),
        severity: z.enum(["warning", "error", "critical"]),
        description: z.string(),
        suggestions: z.array(z.string()).optional(),
      })
    ),
    recommendations: z.array(z.string()),
    alternativeSlots: z.array(z.number().int()).optional(),
    requiredModifications: z.array(z.string()).optional(),
    estimatedPerformanceImpact: z.number().optional(),
  })
  .strict();

export type PartCompatibilityResult = z.infer<
  typeof PartCompatibilityResultSchema
>;

// ============================================================================
// ADMIN SCHEMAS
// ============================================================================

/**
 * Schema for admin bot part management
 */
export const AdminBotPartManagementSchema = z
  .object({
    action: z.enum([
      "list_all_assemblies",
      "validate_all_assemblies",
      "optimize_all_assemblies",
      "repair_corrupted_assemblies",
      "generate_assembly_report",
      "cleanup_orphaned_parts",
      "rebalance_assemblies",
      "audit_assemblies",
    ]),
    filters: z
      .object({
        botId: z.string().optional(),
        userId: z.string().optional(),
        botType: z.string().optional(),
        hasIssues: z.boolean().optional(),
        needsOptimization: z.boolean().optional(),
        lastModifiedBefore: z.coerce.date().optional(),
      })
      .optional(),
    operationOptions: z
      .object({
        validateIntegrity: z.boolean().default(true),
        fixIssues: z.boolean().default(false),
        optimizePerformance: z.boolean().default(false),
        generateBackups: z.boolean().default(true),
        recordActivity: z.boolean().default(true),
      })
      .optional(),
    reportOptions: z
      .object({
        includeDetails: z.boolean().default(true),
        includeMetrics: z.boolean().default(true),
        includeRecommendations: z.boolean().default(true),
        format: z.enum(["json", "csv", "pdf"]).default("json"),
      })
      .optional(),
  })
  .strict();

export type AdminBotPartManagement = z.infer<
  typeof AdminBotPartManagementSchema
>;

/**
 * Schema for assembly system statistics
 */
export const AssemblyStatsSchema = z
  .object({
    totalAssemblies: z.number().int().min(0),
    totalBots: z.number().int().min(0),
    totalPartsInstalled: z.number().int().min(0),
    averagePartsPerBot: z.number(),
    assemblyUtilization: z.number().min(0).max(1),
    partDistribution: z.object({
      byCategory: z.record(z.string(), z.number().int().min(0)),
      byRarity: z.record(z.string(), z.number().int().min(0)),
      bySlot: z.record(z.string(), z.number().int().min(0)),
    }),
    performanceMetrics: z.object({
      averageAssemblyScore: z.number().min(0).max(1),
      topPerformingBots: z.array(
        z.object({
          botId: z.string(),
          botName: z.string(),
          score: z.number().min(0).max(1),
          partsCount: z.number().int().min(0),
        })
      ),
      underperformingBots: z.array(
        z.object({
          botId: z.string(),
          botName: z.string(),
          score: z.number().min(0).max(1),
          issues: z.array(z.string()),
        })
      ),
    }),
    healthMetrics: z.object({
      assembliesWithIssues: z.number().int().min(0),
      commonIssues: z.array(
        z.object({
          issue: z.string(),
          count: z.number().int().min(0),
          severity: z.enum(["low", "medium", "high", "critical"]),
        })
      ),
      maintenanceBacklog: z.number().int().min(0),
      optimizationOpportunities: z.number().int().min(0),
    }),
    usageMetrics: z.object({
      assembliesModifiedLast24h: z.number().int().min(0),
      assembliesModifiedLast7d: z.number().int().min(0),
      mostActiveUsers: z.array(
        z.object({
          userId: z.string(),
          userName: z.string().nullable(),
          modificationsCount: z.number().int().min(0),
          botsOwned: z.number().int().min(0),
        })
      ),
      popularParts: z.array(
        z.object({
          partId: z.string(),
          partName: z.string(),
          installCount: z.number().int().min(0),
          category: z.string(),
          rarity: z.string(),
        })
      ),
    }),
  })
  .strict();

export type AssemblyStats = z.infer<typeof AssemblyStatsSchema>;

// ============================================================================
// EXPORTS
// ============================================================================

// All schemas are defined above and exported individually

// Export all validation functions
export const BotPartValidation = {
  // Base schemas
  model: BotPartSchema,
  input: BotPartInputSchema,

  // CRUD schemas
  create: CreateBotPartSchema,
  createApi: CreateBotPartApiSchema,
  update: UpdateBotPartSchema,
  partialUpdate: PartialUpdateBotPartSchema,

  // Assembly management schemas
  install: InstallPartSchema,
  uninstall: UninstallPartSchema,
  moveToSlot: MovePartToSlotSchema,
  swapParts: SwapPartsSchema,
  bulkOperation: BulkPartOperationSchema,
  optimizeAssembly: OptimizeBotAssemblySchema,

  // Query schemas
  findUnique: FindUniqueBotPartSchema,
  findMany: FindManyBotPartsSchema,
  where: BotPartWhereSchema,
  orderBy: BotPartOrderBySchema,
  select: BotPartSelectSchema,
  include: BotPartIncludeSchema,

  // Helpers
  analyzeAssembly: AnalyzeBotAssemblySchema,
  validateCompatibility: ValidateBotPartCompatibilitySchema,
  getAssemblyConfig: GetBotAssemblyConfigSchema,
  search: SearchBotPartsSchema,

  // Response schemas
  response: BotPartResponseSchema,
  withRelations: BotPartWithRelationsSchema,
  summary: BotPartSummarySchema,
  operationResult: AssemblyOperationResultSchema,
  assemblyAnalysis: BotAssemblyAnalysisSchema,
  compatibilityResult: PartCompatibilityResultSchema,

  // Admin schemas
  adminManagement: AdminBotPartManagementSchema,
  stats: AssemblyStatsSchema,

  // Component schemas
  assemblyMetadata: BotPartAssemblyMetadataSchema,
  slotConfiguration: SlotConfigurationSchema,
} as const;
