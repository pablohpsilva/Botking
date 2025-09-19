import { z } from "zod";

// ============================================================================
// BOT EXPANSION CHIP CONFIGURATION SCHEMAS
// ============================================================================

/**
 * Schema for expansion chip installation metadata
 */
export const BotExpansionChipMetadataSchema = z.object({
  installationDate: z.coerce.date().optional(),
  installedBy: z.string().optional(), // User ID who installed this chip
  installationContext: z
    .enum([
      "initial_installation",
      "upgrade",
      "optimization",
      "replacement",
      "repair",
      "admin",
    ])
    .optional(),
  installationNotes: z.string().max(500).optional(),
  configuration: z
    .object({
      isActive: z.boolean().default(true),
      powerLevel: z.number().min(0).max(1).default(1), // 0-100% power
      priority: z.number().int().min(0).max(10).default(5),
      autoActivate: z.boolean().default(true),
      activationConditions: z
        .array(
          z.enum([
            "combat",
            "mission",
            "low_health",
            "low_energy",
            "high_performance_demand",
            "manual",
          ])
        )
        .optional(),
    })
    .optional(),
  performance: z
    .object({
      effectMagnitude: z.number().min(0).optional(),
      energyConsumption: z.number().min(0).optional(),
      heatGeneration: z.number().min(0).optional(),
      efficiency: z.number().min(0).max(1).optional(),
      uptime: z.number().min(0).max(1).optional(), // Percentage of time active
      activationCount: z.number().int().min(0).optional(),
      averageActivationDuration: z.number().min(0).optional(), // seconds
    })
    .optional(),
  compatibility: z
    .object({
      compatibilityScore: z.number().min(0).max(1).optional(),
      synergies: z.array(z.string()).optional(), // IDs of other chips with synergy
      conflicts: z.array(z.string()).optional(), // IDs of conflicting chips
      recommendations: z.array(z.string()).optional(),
    })
    .optional(),
  customization: z
    .object({
      nickname: z.string().max(50).optional(),
      description: z.string().max(200).optional(),
      visualSettings: z.record(z.string(), z.unknown()).optional(),
      functionalMods: z.record(z.string(), z.unknown()).optional(),
      tuningParameters: z.record(z.string(), z.number()).optional(),
    })
    .optional(),
  maintenance: z
    .object({
      lastMaintenance: z.coerce.date().optional(),
      maintenanceInterval: z.number().int().min(1).optional(), // hours
      condition: z
        .enum(["excellent", "good", "fair", "poor", "critical"])
        .default("good"),
      maintenanceHistory: z
        .array(
          z.object({
            date: z.coerce.date(),
            type: z.enum(["routine", "repair", "calibration", "upgrade"]),
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
      totalActivationTime: z.number().min(0).optional(), // hours
      battlesParticipated: z.number().int().min(0).optional(),
      missionsCompleted: z.number().int().min(0).optional(),
      performanceImpact: z.number().optional(), // Can be negative or positive
      energyEfficiencyGain: z.number().optional(),
      averageEffectiveness: z.number().min(0).max(1).optional(),
    })
    .optional(),
});

export type BotExpansionChipMetadata = z.infer<
  typeof BotExpansionChipMetadataSchema
>;

/**
 * Schema for expansion chip slot configuration
 */
export const ExpansionChipSlotConfigurationSchema = z.object({
  slotType: z.enum([
    "primary",
    "secondary",
    "utility",
    "combat",
    "defensive",
    "offensive",
    "support",
    "specialized",
  ]),
  isRequired: z.boolean().default(false),
  allowedEffects: z
    .array(
      z.enum([
        "ATTACK_BUFF",
        "DEFENSE_BUFF",
        "SPEED_BUFF",
        "AI_UPGRADE",
        "ENERGY_EFFICIENCY",
        "SPECIAL_ABILITY",
        "STAT_BOOST",
        "RESISTANCE",
      ])
    )
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
  slotRestrictions: z
    .object({
      maxEnergyCost: z.number().min(0).optional(),
      maxEffectMagnitude: z.number().min(0).optional(),
      exclusiveEffects: z.array(z.string()).optional(),
      requiredUpgradeLevel: z.number().int().min(0).optional(),
    })
    .optional(),
  conflictSlots: z.array(z.number().int()).optional(),
  synergySlots: z.array(z.number().int()).optional(),
  priority: z.number().int().min(0).max(10).optional(),
});

export type ExpansionChipSlotConfiguration = z.infer<
  typeof ExpansionChipSlotConfigurationSchema
>;

// ============================================================================
// BASE SCHEMAS
// ============================================================================

/**
 * Base BotExpansionChip model schema - represents the complete BotExpansionChip entity
 */
export const BotExpansionChipSchema = z
  .object({
    id: z.string(),
    botId: z.string(),
    expansionChipId: z.string(),
    slotIndex: z.number().int(),
    createdAt: z.date(),
  })
  .strict();

export type BotExpansionChip = z.infer<typeof BotExpansionChipSchema>;

/**
 * BotExpansionChip input schema for forms and API inputs (without auto-generated fields)
 */
export const BotExpansionChipInputSchema = z
  .object({
    botId: z.string().min(1, "Bot ID is required"),
    expansionChipId: z.string().min(1, "Expansion chip ID is required"),
    slotIndex: z
      .number()
      .int()
      .min(0, "Slot index must be non-negative")
      .max(99, "Slot index too large"),
  })
  .strict()
  .refine(
    (data) => {
      // Basic slot index validation for expansion chips
      return data.slotIndex >= 0;
    },
    {
      message: "Invalid expansion chip slot index",
      path: ["slotIndex"],
    }
  );

export type BotExpansionChipInput = z.infer<typeof BotExpansionChipInputSchema>;

// ============================================================================
// CREATE SCHEMAS
// ============================================================================

/**
 * Schema for creating a new BotExpansionChip
 * Compatible with Prisma BotExpansionChipCreateInput
 */
export const CreateBotExpansionChipSchema = z
  .object({
    id: z.string().optional(),
    botId: z.string().min(1, "Bot ID is required"),
    expansionChipId: z.string().min(1, "Expansion chip ID is required"),
    slotIndex: z
      .number()
      .int()
      .min(0, "Slot index must be non-negative")
      .max(99, "Slot index too large"),
    createdAt: z.coerce.date().optional(),
  })
  .strict();

export type CreateBotExpansionChipInput = z.infer<
  typeof CreateBotExpansionChipSchema
>;

/**
 * Simplified create schema for API endpoints with validation
 */
export const CreateBotExpansionChipApiSchema = z
  .object({
    botId: z.string().min(1, "Bot ID is required"),
    expansionChipId: z.string().min(1, "Expansion chip ID is required"),
    slotIndex: z
      .number()
      .int()
      .min(0, "Slot index must be non-negative")
      .max(99, "Slot index too large"),
    validateCompatibility: z.boolean().default(true),
    validateSlotAvailability: z.boolean().default(true),
    validateChipOwnership: z.boolean().default(true),
    validateBotOwnership: z.boolean().default(true),
    validatePowerRequirements: z.boolean().default(true),
    forceInstall: z.boolean().default(false),
    autoActivate: z.boolean().default(true),
    powerLevel: z.number().min(0).max(1).default(1),
    priority: z.number().int().min(0).max(10).default(5),
    chipMetadata: BotExpansionChipMetadataSchema.optional(),
    installationNotes: z.string().max(500).optional(),
    recordActivity: z.boolean().default(true),
  })
  .strict();

export type CreateBotExpansionChipApi = z.infer<
  typeof CreateBotExpansionChipApiSchema
>;

/**
 * Schema for installing an expansion chip with advanced options
 */
export const InstallExpansionChipSchema = z
  .object({
    botId: z.string().min(1, "Bot ID is required"),
    expansionChipId: z.string().min(1, "Expansion chip ID is required"),
    targetSlotIndex: z
      .number()
      .int()
      .min(0, "Slot index must be non-negative")
      .max(99, "Slot index too large"),
    installationStrategy: z
      .enum(["replace", "swap", "find_best_slot", "optimize", "force"])
      .default("replace"),
    swapWithSlotIndex: z.number().int().min(0).max(99).optional(),
    priority: z
      .enum(["low", "normal", "high", "critical", "emergency"])
      .default("normal"),
    validationRules: z
      .object({
        checkCompatibility: z.boolean().default(true),
        checkPowerRequirements: z.boolean().default(true),
        checkEffectLimits: z.boolean().default(true),
        checkConflicts: z.boolean().default(true),
        checkSynergies: z.boolean().default(true),
        allowDuplicateEffects: z.boolean().default(false),
      })
      .optional(),
    configurationOptions: z
      .object({
        autoActivate: z.boolean().default(true),
        powerLevel: z.number().min(0).max(1).default(1),
        activationConditions: z
          .array(
            z.enum([
              "combat",
              "mission",
              "low_health",
              "low_energy",
              "high_performance_demand",
              "manual",
            ])
          )
          .optional(),
        autoTune: z.boolean().default(false),
        optimizeForPerformance: z.boolean().default(true),
        optimizeForEfficiency: z.boolean().default(false),
      })
      .optional(),
    metadata: BotExpansionChipMetadataSchema.optional(),
    installationNotes: z.string().max(1000).optional(),
  })
  .strict();

export type InstallExpansionChip = z.infer<typeof InstallExpansionChipSchema>;

// ============================================================================
// UPDATE SCHEMAS
// ============================================================================

/**
 * Schema for updating a BotExpansionChip
 * Compatible with Prisma BotExpansionChipUpdateInput
 */
export const UpdateBotExpansionChipSchema = z
  .object({
    id: z.string().optional(),
    botId: z.string().min(1, "Bot ID is required").optional(),
    expansionChipId: z
      .string()
      .min(1, "Expansion chip ID is required")
      .optional(),
    slotIndex: z
      .number()
      .int()
      .min(0, "Slot index must be non-negative")
      .max(99, "Slot index too large")
      .optional(),
    createdAt: z.coerce.date().optional(),
  })
  .strict();

export type UpdateBotExpansionChipInput = z.infer<
  typeof UpdateBotExpansionChipSchema
>;

/**
 * Schema for moving an expansion chip to a different slot
 */
export const MoveExpansionChipToSlotSchema = z
  .object({
    botExpansionChipId: z.string().min(1, "BotExpansionChip ID is required"),
    newSlotIndex: z
      .number()
      .int()
      .min(0, "Slot index must be non-negative")
      .max(99, "Slot index too large"),
    moveStrategy: z
      .enum(["replace", "swap", "find_empty", "optimize", "force"])
      .default("replace"),
    swapWithChipId: z.string().optional(),
    validateMove: z.boolean().default(true),
    preserveConfiguration: z.boolean().default(true),
    recordActivity: z.boolean().default(true),
    moveReason: z
      .enum([
        "optimization",
        "performance",
        "compatibility",
        "user_preference",
        "system_maintenance",
        "repair",
      ])
      .optional(),
    moveNotes: z.string().max(500).optional(),
  })
  .strict();

export type MoveExpansionChipToSlot = z.infer<
  typeof MoveExpansionChipToSlotSchema
>;

/**
 * Schema for configuring expansion chip settings
 */
export const ConfigureExpansionChipSchema = z
  .object({
    botExpansionChipId: z.string().min(1, "BotExpansionChip ID is required"),
    configuration: z
      .object({
        isActive: z.boolean().optional(),
        powerLevel: z.number().min(0).max(1).optional(),
        priority: z.number().int().min(0).max(10).optional(),
        autoActivate: z.boolean().optional(),
        activationConditions: z
          .array(
            z.enum([
              "combat",
              "mission",
              "low_health",
              "low_energy",
              "high_performance_demand",
              "manual",
            ])
          )
          .optional(),
      })
      .optional(),
    customization: z
      .object({
        nickname: z.string().max(50).optional(),
        description: z.string().max(200).optional(),
        tuningParameters: z.record(z.string(), z.number()).optional(),
      })
      .optional(),
    validateConfiguration: z.boolean().default(true),
    applyImmediately: z.boolean().default(true),
    recordActivity: z.boolean().default(true),
    configurationNotes: z.string().max(500).optional(),
  })
  .strict();

export type ConfigureExpansionChip = z.infer<
  typeof ConfigureExpansionChipSchema
>;

/**
 * Partial update schema - all fields optional
 */
export const PartialUpdateBotExpansionChipSchema =
  BotExpansionChipInputSchema.partial();

export type PartialUpdateBotExpansionChip = z.infer<
  typeof PartialUpdateBotExpansionChipSchema
>;

// ============================================================================
// EXPANSION CHIP MANAGEMENT SCHEMAS
// ============================================================================

/**
 * Schema for uninstalling an expansion chip from a bot
 */
export const UninstallExpansionChipSchema = z
  .object({
    botExpansionChipId: z.string().min(1, "BotExpansionChip ID is required"),
    uninstallReason: z
      .enum([
        "upgrade",
        "replacement",
        "maintenance",
        "optimization",
        "user_request",
        "system_requirement",
        "compatibility_issue",
        "malfunction",
      ])
      .optional(),
    preserveChip: z.boolean().default(true),
    returnToInventory: z.boolean().default(true),
    deactivateFirst: z.boolean().default(true),
    recordActivity: z.boolean().default(true),
    forceUninstall: z.boolean().default(false),
    uninstallNotes: z.string().max(500).optional(),
    maintenanceSchedule: z
      .object({
        scheduleRepair: z.boolean().default(false),
        scheduleUpgrade: z.boolean().default(false),
        scheduleCalibration: z.boolean().default(false),
        maintenanceDate: z.coerce.date().optional(),
        technician: z.string().optional(),
      })
      .optional(),
  })
  .strict();

export type UninstallExpansionChip = z.infer<
  typeof UninstallExpansionChipSchema
>;

/**
 * Schema for swapping expansion chips between slots
 */
export const SwapExpansionChipsSchema = z
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
    checkPerformanceImpact: z.boolean().default(true),
    preserveConfigurations: z.boolean().default(true),
    recordActivity: z.boolean().default(true),
    swapReason: z
      .enum([
        "optimization",
        "performance",
        "user_preference",
        "maintenance",
        "testing",
        "synergy",
      ])
      .optional(),
    swapNotes: z.string().max(500).optional(),
  })
  .strict()
  .refine((data) => data.firstSlotIndex !== data.secondSlotIndex, {
    message: "Cannot swap a slot with itself",
    path: ["secondSlotIndex"],
  });

export type SwapExpansionChips = z.infer<typeof SwapExpansionChipsSchema>;

/**
 * Schema for bulk expansion chip operations
 */
export const BulkExpansionChipOperationSchema = z
  .object({
    botId: z.string().min(1, "Bot ID is required"),
    operation: z.enum([
      "install_multiple",
      "uninstall_multiple",
      "configure_multiple",
      "optimize_loadout",
      "validate_loadout",
      "repair_loadout",
      "reset_loadout",
      "activate_all",
      "deactivate_all",
    ]),
    chips: z
      .array(
        z.object({
          expansionChipId: z.string().min(1, "Expansion chip ID is required"),
          slotIndex: z.number().int().min(0).max(99),
          priority: z.enum(["low", "normal", "high"]).default("normal"),
          powerLevel: z.number().min(0).max(1).default(1),
          autoActivate: z.boolean().default(true),
          metadata: BotExpansionChipMetadataSchema.optional(),
        })
      )
      .min(1, "At least one chip is required")
      .max(50, "Too many chips for bulk operation"),
    operationOptions: z
      .object({
        validateEach: z.boolean().default(true),
        stopOnError: z.boolean().default(false),
        optimizeSlots: z.boolean().default(true),
        recordActivities: z.boolean().default(true),
        runDiagnostics: z.boolean().default(true),
        balanceLoad: z.boolean().default(true),
      })
      .optional(),
    loadoutStrategy: z
      .enum(["sequential", "parallel", "optimal", "balanced", "manual"])
      .default("optimal"),
    operationNotes: z.string().max(1000).optional(),
  })
  .strict();

export type BulkExpansionChipOperation = z.infer<
  typeof BulkExpansionChipOperationSchema
>;

/**
 * Schema for optimizing expansion chip loadout
 */
export const OptimizeExpansionChipLoadoutSchema = z
  .object({
    botId: z.string().min(1, "Bot ID is required"),
    optimizationGoals: z
      .array(
        z.enum([
          "performance",
          "power_efficiency",
          "versatility",
          "combat_effectiveness",
          "utility_enhancement",
          "synergy_maximization",
          "balanced",
        ])
      )
      .min(1, "At least one optimization goal is required"),
    constraints: z
      .object({
        maxPowerConsumption: z.number().min(0).optional(),
        maxEnergyCost: z.number().min(0).optional(),
        minPerformanceGain: z.number().min(0).optional(),
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
        effectRestrictions: z
          .array(
            z.enum([
              "ATTACK_BUFF",
              "DEFENSE_BUFF",
              "SPEED_BUFF",
              "AI_UPGRADE",
              "ENERGY_EFFICIENCY",
              "SPECIAL_ABILITY",
              "STAT_BOOST",
              "RESISTANCE",
            ])
          )
          .optional(),
        preserveSlots: z.array(z.number().int().min(0).max(99)).optional(),
        preserveChips: z.array(z.string()).optional(),
      })
      .optional(),
    optimizationOptions: z
      .object({
        allowChipUpgrades: z.boolean().default(true),
        allowChipReplacements: z.boolean().default(true),
        allowSlotReorganization: z.boolean().default(true),
        considerChipSynergies: z.boolean().default(true),
        maximizeUniqueEffects: z.boolean().default(true),
        balancePowerConsumption: z.boolean().default(true),
        optimizeForCombat: z.boolean().default(false),
        optimizeForUtility: z.boolean().default(false),
      })
      .optional(),
    generateReport: z.boolean().default(true),
    applyOptimizations: z.boolean().default(false),
    previewChanges: z.boolean().default(true),
  })
  .strict();

export type OptimizeExpansionChipLoadout = z.infer<
  typeof OptimizeExpansionChipLoadoutSchema
>;

// ============================================================================
// QUERY SCHEMAS
// ============================================================================

/**
 * Schema for finding a unique BotExpansionChip
 */
export const FindUniqueBotExpansionChipSchema = z
  .object({
    id: z.string().optional(),
    botId_expansionChipId: z
      .object({
        botId: z.string(),
        expansionChipId: z.string(),
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

export type FindUniqueBotExpansionChipInput = z.infer<
  typeof FindUniqueBotExpansionChipSchema
>;

/**
 * Schema for filtering BotExpansionChips
 */
export const BotExpansionChipWhereSchema: z.ZodType<any> = z.lazy(() =>
  z
    .object({
      id: z.string().optional(),
      botId: z.string().optional(),
      expansionChipId: z.string().optional(),
      slotIndex: z.number().int().optional(),
      createdAt: z.date().optional(),
      AND: z.array(BotExpansionChipWhereSchema).optional(),
      OR: z.array(BotExpansionChipWhereSchema).optional(),
      NOT: BotExpansionChipWhereSchema.optional(),
    })
    .strict()
);

export type BotExpansionChipWhere = z.infer<typeof BotExpansionChipWhereSchema>;

/**
 * Schema for ordering BotExpansionChips
 */
export const BotExpansionChipOrderBySchema = z
  .object({
    id: z.enum(["asc", "desc"]).optional(),
    botId: z.enum(["asc", "desc"]).optional(),
    expansionChipId: z.enum(["asc", "desc"]).optional(),
    slotIndex: z.enum(["asc", "desc"]).optional(),
    createdAt: z.enum(["asc", "desc"]).optional(),
  })
  .strict();

export type BotExpansionChipOrderBy = z.infer<
  typeof BotExpansionChipOrderBySchema
>;

/**
 * Schema for selecting BotExpansionChip fields
 */
export const BotExpansionChipSelectSchema = z
  .object({
    id: z.boolean().optional(),
    botId: z.boolean().optional(),
    expansionChipId: z.boolean().optional(),
    slotIndex: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    bot: z.boolean().optional(),
    expansionChip: z.boolean().optional(),
  })
  .strict();

export type BotExpansionChipSelect = z.infer<
  typeof BotExpansionChipSelectSchema
>;

/**
 * Schema for including BotExpansionChip relations
 */
export const BotExpansionChipIncludeSchema = z
  .object({
    bot: z.boolean().optional(),
    expansionChip: z.boolean().optional(),
  })
  .strict();

export type BotExpansionChipInclude = z.infer<
  typeof BotExpansionChipIncludeSchema
>;

// ============================================================================
// PAGINATION SCHEMAS
// ============================================================================

/**
 * Schema for paginated BotExpansionChip queries
 */
export const FindManyBotExpansionChipsSchema = z
  .object({
    where: BotExpansionChipWhereSchema.optional(),
    orderBy: z
      .union([
        BotExpansionChipOrderBySchema,
        z.array(BotExpansionChipOrderBySchema),
      ])
      .optional(),
    select: BotExpansionChipSelectSchema.optional(),
    include: BotExpansionChipIncludeSchema.optional(),
    skip: z.number().int().min(0).optional(),
    take: z.number().int().min(1).max(1000).optional(),
    cursor: FindUniqueBotExpansionChipSchema.optional(),
  })
  .strict();

export type FindManyBotExpansionChipsInput = z.infer<
  typeof FindManyBotExpansionChipsSchema
>;

// ============================================================================
// VALIDATION HELPERS
// ============================================================================

/**
 * Schema for analyzing expansion chip loadout
 */
export const AnalyzeExpansionChipLoadoutSchema = z
  .object({
    botId: z.string().min(1, "Bot ID is required"),
    analysisType: z
      .enum([
        "compatibility",
        "performance",
        "synergy",
        "efficiency",
        "optimization",
        "diagnostics",
        "all",
      ])
      .default("all"),
    includeMetrics: z.boolean().default(true),
    includeRecommendations: z.boolean().default(true),
    includeSynergyAnalysis: z.boolean().default(true),
    includeOptimizations: z.boolean().default(true),
    performanceGoals: z
      .array(
        z.enum([
          "attack",
          "defense",
          "speed",
          "efficiency",
          "versatility",
          "specialization",
        ])
      )
      .optional(),
    generateDetailedReport: z.boolean().default(false),
  })
  .strict();

export type AnalyzeExpansionChipLoadout = z.infer<
  typeof AnalyzeExpansionChipLoadoutSchema
>;

/**
 * Schema for validating expansion chip compatibility
 */
export const ValidateBotExpansionChipCompatibilitySchema = z
  .object({
    botId: z.string().min(1, "Bot ID is required"),
    expansionChipId: z.string().min(1, "Expansion chip ID is required"),
    targetSlotIndex: z
      .number()
      .int()
      .min(0, "Slot index must be non-negative")
      .max(99, "Slot index too large"),
    validationLevel: z
      .enum(["basic", "standard", "strict", "comprehensive"])
      .default("standard"),
    checkConflicts: z.boolean().default(true),
    checkSynergies: z.boolean().default(true),
    checkPowerRequirements: z.boolean().default(true),
    checkEffectLimits: z.boolean().default(true),
    checkPerformanceImpact: z.boolean().default(true),
    generateCompatibilityScore: z.boolean().default(true),
    analyzeSynergyPotential: z.boolean().default(true),
  })
  .strict();

export type ValidateBotExpansionChipCompatibility = z.infer<
  typeof ValidateBotExpansionChipCompatibilitySchema
>;

/**
 * Schema for getting expansion chip loadout configuration
 */
export const GetExpansionChipLoadoutConfigSchema = z
  .object({
    botId: z.string().min(1, "Bot ID is required"),
    includeChipDetails: z.boolean().default(true),
    includePerformanceMetrics: z.boolean().default(true),
    includeLoadoutMetadata: z.boolean().default(true),
    includeCompatibilityInfo: z.boolean().default(true),
    includeSynergyAnalysis: z.boolean().default(true),
    slotRange: z
      .object({
        startSlot: z.number().int().min(0).max(99),
        endSlot: z.number().int().min(0).max(99),
      })
      .optional(),
    filterByEffect: z
      .array(
        z.enum([
          "ATTACK_BUFF",
          "DEFENSE_BUFF",
          "SPEED_BUFF",
          "AI_UPGRADE",
          "ENERGY_EFFICIENCY",
          "SPECIAL_ABILITY",
          "STAT_BOOST",
          "RESISTANCE",
        ])
      )
      .optional(),
    filterByRarity: z
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
    sortBy: z
      .enum([
        "slotIndex",
        "chipName",
        "rarity",
        "effect",
        "performance",
        "installDate",
        "priority",
      ])
      .default("slotIndex"),
  })
  .strict();

export type GetExpansionChipLoadoutConfig = z.infer<
  typeof GetExpansionChipLoadoutConfigSchema
>;

/**
 * Schema for expansion chip search and filtering
 */
export const SearchBotExpansionChipsSchema = z
  .object({
    botId: z.string().optional(),
    chipEffect: z
      .enum([
        "ATTACK_BUFF",
        "DEFENSE_BUFF",
        "SPEED_BUFF",
        "AI_UPGRADE",
        "ENERGY_EFFICIENCY",
        "SPECIAL_ABILITY",
        "STAT_BOOST",
        "RESISTANCE",
      ])
      .optional(),
    chipRarity: z
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
    energyEfficiencyThreshold: z.number().min(0).optional(),
    isActive: z.boolean().optional(),
    hasMetadata: z.boolean().optional(),
    needsMaintenance: z.boolean().optional(),
    includeChipDetails: z.boolean().default(true),
    includeBotDetails: z.boolean().default(false),
    includePerformanceData: z.boolean().default(false),
    includeSynergyData: z.boolean().default(false),
    sortBy: z
      .enum([
        "slotIndex",
        "chipName",
        "installDate",
        "performance",
        "rarity",
        "effect",
        "priority",
      ])
      .default("slotIndex"),
    sortOrder: z.enum(["asc", "desc"]).default("asc"),
    limit: z.number().int().min(1).max(100).default(20),
  })
  .strict();

export type SearchBotExpansionChips = z.infer<
  typeof SearchBotExpansionChipsSchema
>;

// ============================================================================
// RESPONSE SCHEMAS
// ============================================================================

/**
 * Schema for BotExpansionChip API responses
 */
export const BotExpansionChipResponseSchema = BotExpansionChipSchema;

export type BotExpansionChipResponse = z.infer<
  typeof BotExpansionChipResponseSchema
>;

/**
 * Schema for BotExpansionChip with Bot and ExpansionChip information
 */
export const BotExpansionChipWithRelationsSchema =
  BotExpansionChipResponseSchema.safeExtend({
    bot: z.object({
      id: z.string(),
      name: z.string(),
      botType: z.string(),
      description: z.string().nullable(),
    }),
    expansionChip: z.object({
      id: z.string(),
      name: z.string(),
      effect: z.string(),
      rarity: z.string(),
      upgradeLevel: z.number().int(),
      effectMagnitude: z.number(),
      energyCost: z.number().int(),
      description: z.string().nullable(),
    }),
  });

export type BotExpansionChipWithRelations = z.infer<
  typeof BotExpansionChipWithRelationsSchema
>;

/**
 * Schema for BotExpansionChip summary (minimal info)
 */
export const BotExpansionChipSummarySchema = z
  .object({
    id: z.string(),
    botId: z.string(),
    botName: z.string(),
    expansionChipId: z.string(),
    chipName: z.string(),
    chipEffect: z.string(),
    chipRarity: z.string(),
    slotIndex: z.number().int(),
    installDate: z.date(),
    isActive: z.boolean(),
    performance: z.number().min(0).max(1),
    powerLevel: z.number().min(0).max(1),
    needsMaintenance: z.boolean(),
  })
  .strict();

export type BotExpansionChipSummary = z.infer<
  typeof BotExpansionChipSummarySchema
>;

/**
 * Schema for expansion chip operation result
 */
export const ExpansionChipOperationResultSchema = z
  .object({
    operation: z.string(),
    botId: z.string(),
    success: z.boolean(),
    affectedChips: z.array(
      z.object({
        expansionChipId: z.string(),
        chipName: z.string(),
        chipEffect: z.string(),
        slotIndexBefore: z.number().int().nullable(),
        slotIndexAfter: z.number().int().nullable(),
        action: z.enum([
          "installed",
          "uninstalled",
          "moved",
          "swapped",
          "configured",
          "activated",
          "deactivated",
        ]),
      })
    ),
    performanceChange: z
      .object({
        before: z.number().min(0).max(1),
        after: z.number().min(0).max(1),
        improvement: z.number(),
        efficiencyChange: z.number(),
      })
      .optional(),
    synergyChanges: z
      .array(
        z.object({
          chipPair: z.array(z.string()),
          synergyType: z.enum(["positive", "negative", "neutral"]),
          synergyStrength: z.number().min(0).max(1),
          description: z.string(),
        })
      )
      .optional(),
    warnings: z.array(z.string()).optional(),
    errors: z.array(z.string()).optional(),
    recommendations: z.array(z.string()).optional(),
    transactionId: z.string().optional(),
    metadata: z.record(z.string(), z.unknown()).optional(),
  })
  .strict();

export type ExpansionChipOperationResult = z.infer<
  typeof ExpansionChipOperationResultSchema
>;

/**
 * Schema for expansion chip loadout analysis result
 */
export const ExpansionChipLoadoutAnalysisSchema = z
  .object({
    botId: z.string(),
    botName: z.string(),
    analysisDate: z.date(),
    overallScore: z.number().min(0).max(1),
    loadoutSummary: z.object({
      totalChips: z.number().int().min(0),
      activeChips: z.number().int().min(0),
      inactiveChips: z.number().int().min(0),
      emptySlots: z.number().int().min(0),
      utilizationRate: z.number().min(0).max(1),
      averageChipRarity: z.string(),
      totalEnergyCost: z.number().min(0),
      totalEffectMagnitude: z.number().min(0),
      estimatedPerformanceGain: z.number().min(0).max(1),
    }),
    effectBreakdown: z.record(
      z.string(),
      z.object({
        count: z.number().int().min(0),
        totalMagnitude: z.number(),
        averageLevel: z.number(),
        averageRarity: z.string(),
        combinedEffect: z.number(),
      })
    ),
    slotAnalysis: z.array(
      z.object({
        slotIndex: z.number().int(),
        isOccupied: z.boolean(),
        expansionChipId: z.string().nullable(),
        chipName: z.string().nullable(),
        chipEffect: z.string().nullable(),
        chipRarity: z.string().nullable(),
        isActive: z.boolean().nullable(),
        powerLevel: z.number().min(0).max(1).nullable(),
        performance: z.number().min(0).max(1).nullable(),
        energyCost: z.number().nullable(),
        recommendations: z.array(z.string()).optional(),
      })
    ),
    synergyMatrix: z.record(
      z.string(),
      z.object({
        synergyScore: z.number().min(0).max(1),
        synergyType: z.enum(["positive", "negative", "neutral"]),
        synergyChips: z.array(z.string()),
        conflictChips: z.array(z.string()),
        recommendations: z.array(z.string()),
      })
    ),
    performanceMetrics: z.object({
      combat: z.object({
        attackBoost: z.number(),
        defenseBoost: z.number(),
        speedBoost: z.number(),
        overall: z.number().min(0).max(1),
      }),
      utility: z.object({
        aiUpgrade: z.number(),
        energyEfficiency: z.number().min(0).max(1),
        specialAbilities: z.number().int().min(0),
        overall: z.number().min(0).max(1),
      }),
      overall: z.number().min(0).max(1),
    }),
    efficiencyMetrics: z.object({
      powerEfficiency: z.number().min(0).max(1),
      costEffectiveness: z.number().min(0).max(1),
      performancePerWatt: z.number(),
      optimizationPotential: z.number().min(0).max(1),
    }),
    maintenanceStatus: z.object({
      chipsNeedingMaintenance: z.number().int().min(0),
      averageCondition: z.number().min(0).max(1),
      nextMaintenanceDate: z.date().nullable(),
      maintenanceCost: z.number().min(0),
      urgentRepairs: z.array(z.string()),
    }),
    optimizationOpportunities: z.array(
      z.object({
        type: z.enum([
          "slot_optimization",
          "chip_upgrade",
          "synergy_improvement",
          "performance_boost",
          "efficiency_gain",
          "maintenance_reduction",
          "loadout_rebalance",
        ]),
        description: z.string(),
        priority: z.enum(["low", "medium", "high", "critical"]),
        estimatedImprovement: z.number().min(0).max(1),
        estimatedCost: z.number().min(0).optional(),
        affectedSlots: z.array(z.number().int()),
        recommendedChips: z.array(z.string()).optional(),
      })
    ),
    recommendations: z.array(
      z.object({
        category: z.enum([
          "performance",
          "efficiency",
          "synergy",
          "maintenance",
          "optimization",
          "loadout",
        ]),
        description: z.string(),
        priority: z.enum(["low", "medium", "high", "urgent"]),
        actionRequired: z.boolean(),
        estimatedBenefit: z.string(),
      })
    ),
  })
  .strict();

export type ExpansionChipLoadoutAnalysis = z.infer<
  typeof ExpansionChipLoadoutAnalysisSchema
>;

/**
 * Schema for expansion chip compatibility result
 */
export const ExpansionChipCompatibilityResultSchema = z
  .object({
    isCompatible: z.boolean(),
    compatibilityScore: z.number().min(0).max(1),
    botId: z.string(),
    expansionChipId: z.string(),
    targetSlotIndex: z.number().int(),
    validationResults: z.object({
      basicCompatibility: z.boolean(),
      powerRequirements: z.boolean(),
      effectLimits: z.boolean(),
      conflictCheck: z.boolean(),
      synergyCheck: z.boolean(),
      performanceImpact: z.boolean(),
    }),
    synergyAnalysis: z.object({
      positivesynergies: z.array(
        z.object({
          chipId: z.string(),
          chipName: z.string(),
          synergyType: z.string(),
          synergyStrength: z.number().min(0).max(1),
          description: z.string(),
        })
      ),
      negativeConflicts: z.array(
        z.object({
          chipId: z.string(),
          chipName: z.string(),
          conflictType: z.string(),
          conflictSeverity: z.enum(["low", "medium", "high", "critical"]),
          description: z.string(),
        })
      ),
      overallSynergyScore: z.number().min(0).max(1),
    }),
    issues: z.array(
      z.object({
        type: z.enum([
          "incompatible_effect",
          "insufficient_power",
          "effect_limit_exceeded",
          "slot_conflict",
          "negative_synergy",
          "performance_degradation",
          "energy_overload",
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
    estimatedSynergyGain: z.number().optional(),
  })
  .strict();

export type ExpansionChipCompatibilityResult = z.infer<
  typeof ExpansionChipCompatibilityResultSchema
>;

// ============================================================================
// ADMIN SCHEMAS
// ============================================================================

/**
 * Schema for admin expansion chip management
 */
export const AdminBotExpansionChipManagementSchema = z
  .object({
    action: z.enum([
      "list_all_loadouts",
      "validate_all_loadouts",
      "optimize_all_loadouts",
      "repair_corrupted_loadouts",
      "generate_loadout_report",
      "cleanup_orphaned_chips",
      "rebalance_loadouts",
      "audit_loadouts",
      "analyze_synergy_patterns",
    ]),
    filters: z
      .object({
        botId: z.string().optional(),
        userId: z.string().optional(),
        botType: z.string().optional(),
        chipEffect: z.string().optional(),
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
        analyzeSynergies: z.boolean().default(true),
        generateBackups: z.boolean().default(true),
        recordActivity: z.boolean().default(true),
      })
      .optional(),
    reportOptions: z
      .object({
        includeDetails: z.boolean().default(true),
        includeMetrics: z.boolean().default(true),
        includeSynergyAnalysis: z.boolean().default(true),
        includeRecommendations: z.boolean().default(true),
        format: z.enum(["json", "csv", "pdf"]).default("json"),
      })
      .optional(),
  })
  .strict();

export type AdminBotExpansionChipManagement = z.infer<
  typeof AdminBotExpansionChipManagementSchema
>;

/**
 * Schema for expansion chip system statistics
 */
export const BotExpansionChipStatsSchema = z
  .object({
    totalLoadouts: z.number().int().min(0),
    totalBots: z.number().int().min(0),
    totalChipsInstalled: z.number().int().min(0),
    averageChipsPerBot: z.number(),
    loadoutUtilization: z.number().min(0).max(1),
    chipDistribution: z.object({
      byEffect: z.record(z.string(), z.number().int().min(0)),
      byRarity: z.record(z.string(), z.number().int().min(0)),
      bySlot: z.record(z.string(), z.number().int().min(0)),
      byUpgradeLevel: z.record(z.string(), z.number().int().min(0)),
    }),
    performanceMetrics: z.object({
      averageLoadoutScore: z.number().min(0).max(1),
      topPerformingBots: z.array(
        z.object({
          botId: z.string(),
          botName: z.string(),
          score: z.number().min(0).max(1),
          chipsCount: z.number().int().min(0),
          uniqueEffects: z.number().int().min(0),
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
    synergyMetrics: z.object({
      totalSynergies: z.number().int().min(0),
      positivesynergies: z.number().int().min(0),
      negativeConflicts: z.number().int().min(0),
      averageSynergyScore: z.number().min(0).max(1),
      commonSynergyPairs: z.array(
        z.object({
          chipPair: z.array(z.string()),
          synergyType: z.string(),
          frequency: z.number().int().min(0),
          averageScore: z.number().min(0).max(1),
        })
      ),
    }),
    healthMetrics: z.object({
      loadoutsWithIssues: z.number().int().min(0),
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
      loadoutsModifiedLast24h: z.number().int().min(0),
      loadoutsModifiedLast7d: z.number().int().min(0),
      mostActiveUsers: z.array(
        z.object({
          userId: z.string(),
          userName: z.string().nullable(),
          modificationsCount: z.number().int().min(0),
          botsOwned: z.number().int().min(0),
        })
      ),
      popularChips: z.array(
        z.object({
          expansionChipId: z.string(),
          chipName: z.string(),
          installCount: z.number().int().min(0),
          effect: z.string(),
          rarity: z.string(),
        })
      ),
    }),
  })
  .strict();

export type BotExpansionChipStats = z.infer<typeof BotExpansionChipStatsSchema>;

// ============================================================================
// EXPORTS
// ============================================================================

// All schemas are defined above and exported individually

// Export all validation functions
export const BotExpansionChipValidation = {
  // Base schemas
  model: BotExpansionChipSchema,
  input: BotExpansionChipInputSchema,

  // CRUD schemas
  create: CreateBotExpansionChipSchema,
  createApi: CreateBotExpansionChipApiSchema,
  update: UpdateBotExpansionChipSchema,
  partialUpdate: PartialUpdateBotExpansionChipSchema,

  // Expansion chip management schemas
  install: InstallExpansionChipSchema,
  uninstall: UninstallExpansionChipSchema,
  moveToSlot: MoveExpansionChipToSlotSchema,
  configure: ConfigureExpansionChipSchema,
  swapChips: SwapExpansionChipsSchema,
  bulkOperation: BulkExpansionChipOperationSchema,
  optimizeLoadout: OptimizeExpansionChipLoadoutSchema,

  // Query schemas
  findUnique: FindUniqueBotExpansionChipSchema,
  findMany: FindManyBotExpansionChipsSchema,
  where: BotExpansionChipWhereSchema,
  orderBy: BotExpansionChipOrderBySchema,
  select: BotExpansionChipSelectSchema,
  include: BotExpansionChipIncludeSchema,

  // Helpers
  analyzeLoadout: AnalyzeExpansionChipLoadoutSchema,
  validateCompatibility: ValidateBotExpansionChipCompatibilitySchema,
  getLoadoutConfig: GetExpansionChipLoadoutConfigSchema,
  search: SearchBotExpansionChipsSchema,

  // Response schemas
  response: BotExpansionChipResponseSchema,
  withRelations: BotExpansionChipWithRelationsSchema,
  summary: BotExpansionChipSummarySchema,
  operationResult: ExpansionChipOperationResultSchema,
  loadoutAnalysis: ExpansionChipLoadoutAnalysisSchema,
  compatibilityResult: ExpansionChipCompatibilityResultSchema,

  // Admin schemas
  adminManagement: AdminBotExpansionChipManagementSchema,
  stats: BotExpansionChipStatsSchema,

  // Component schemas
  chipMetadata: BotExpansionChipMetadataSchema,
  slotConfiguration: ExpansionChipSlotConfigurationSchema,
} as const;
