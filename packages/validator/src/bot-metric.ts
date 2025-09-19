import { z } from "zod";

// ============================================================================
// BASE SCHEMAS
// ============================================================================

/**
 * Base BotMetric model schema - represents the complete BotMetric entity
 */
export const BotMetricSchema = z
  .object({
    id: z.string(),
    userId: z.string(),
    botId: z.string(),
    battlesWon: z.number().int().nullable(),
    battlesLost: z.number().int().nullable(),
    totalBattles: z.number().int().nullable(),
    missionsCompleted: z.number().int(),
    successRate: z.number(),
    totalCombatTime: z.number().int(),
    damageDealt: z.number().int(),
    damageTaken: z.number().int(),
    createdAt: z.date(),
    updatedAt: z.date(),
  })
  .strict();

export type BotMetric = z.infer<typeof BotMetricSchema>;

/**
 * BotMetric input schema for forms and API inputs (without auto-generated fields)
 */
export const BotMetricInputSchema = z
  .object({
    userId: z.string().min(1, "User ID is required"),
    botId: z.string().min(1, "Bot ID is required"),
    battlesWon: z
      .number()
      .int()
      .min(0, "Battles won cannot be negative")
      .max(1000000, "Battles won too large")
      .nullable()
      .default(0),
    battlesLost: z
      .number()
      .int()
      .min(0, "Battles lost cannot be negative")
      .max(1000000, "Battles lost too large")
      .nullable()
      .default(0),
    totalBattles: z
      .number()
      .int()
      .min(0, "Total battles cannot be negative")
      .max(1000000, "Total battles too large")
      .nullable()
      .default(0),
    missionsCompleted: z
      .number()
      .int()
      .min(0, "Missions completed cannot be negative")
      .max(1000000, "Missions completed too large")
      .default(0),
    successRate: z
      .number()
      .min(0, "Success rate cannot be negative")
      .max(1, "Success rate cannot exceed 1.0")
      .default(0.0),
    totalCombatTime: z
      .number()
      .int()
      .min(0, "Total combat time cannot be negative")
      .max(100000000, "Total combat time too large")
      .default(0),
    damageDealt: z
      .number()
      .int()
      .min(0, "Damage dealt cannot be negative")
      .max(2147483647, "Damage dealt too large")
      .default(0),
    damageTaken: z
      .number()
      .int()
      .min(0, "Damage taken cannot be negative")
      .max(2147483647, "Damage taken too large")
      .default(0),
  })
  .strict()
  .refine(
    (data) => {
      // If battle stats are provided, they should be consistent
      if (
        data.battlesWon !== null &&
        data.battlesLost !== null &&
        data.totalBattles !== null
      ) {
        return data.totalBattles === data.battlesWon + data.battlesLost;
      }
      return true;
    },
    {
      message: "Total battles must equal battles won plus battles lost",
      path: ["totalBattles"],
    }
  )
  .refine(
    (data) => {
      // Success rate should be consistent with missions completed
      if (data.missionsCompleted === 0) {
        return data.successRate === 0.0;
      }
      return true;
    },
    {
      message: "Success rate should be 0.0 when no missions completed",
      path: ["successRate"],
    }
  );

export type BotMetricInput = z.infer<typeof BotMetricInputSchema>;

// ============================================================================
// CREATE SCHEMAS
// ============================================================================

/**
 * Schema for creating a new BotMetric
 * Compatible with Prisma BotMetricCreateInput
 */
export const CreateBotMetricSchema = z
  .object({
    id: z.string().optional(),
    userId: z.string().min(1, "User ID is required"),
    botId: z.string().min(1, "Bot ID is required"),
    battlesWon: z
      .number()
      .int()
      .min(0, "Battles won cannot be negative")
      .max(1000000, "Battles won too large")
      .nullable()
      .default(0),
    battlesLost: z
      .number()
      .int()
      .min(0, "Battles lost cannot be negative")
      .max(1000000, "Battles lost too large")
      .nullable()
      .default(0),
    totalBattles: z
      .number()
      .int()
      .min(0, "Total battles cannot be negative")
      .max(1000000, "Total battles too large")
      .nullable()
      .default(0),
    missionsCompleted: z
      .number()
      .int()
      .min(0, "Missions completed cannot be negative")
      .max(1000000, "Missions completed too large")
      .default(0),
    successRate: z
      .number()
      .min(0, "Success rate cannot be negative")
      .max(1, "Success rate cannot exceed 1.0")
      .default(0.0),
    totalCombatTime: z
      .number()
      .int()
      .min(0, "Total combat time cannot be negative")
      .max(100000000, "Total combat time too large")
      .default(0),
    damageDealt: z
      .number()
      .int()
      .min(0, "Damage dealt cannot be negative")
      .max(2147483647, "Damage dealt too large")
      .default(0),
    damageTaken: z
      .number()
      .int()
      .min(0, "Damage taken cannot be negative")
      .max(2147483647, "Damage taken too large")
      .default(0),
    createdAt: z.coerce.date().optional(),
    updatedAt: z.coerce.date().optional(),
  })
  .strict()
  .refine(
    (data) => {
      if (
        data.battlesWon !== null &&
        data.battlesLost !== null &&
        data.totalBattles !== null
      ) {
        return data.totalBattles === data.battlesWon + data.battlesLost;
      }
      return true;
    },
    {
      message: "Total battles must equal battles won plus battles lost",
      path: ["totalBattles"],
    }
  );

export type CreateBotMetricInput = z.infer<typeof CreateBotMetricSchema>;

/**
 * Simplified create schema for API endpoints
 */
export const CreateBotMetricApiSchema = z
  .object({
    userId: z.string().min(1, "User ID is required"),
    botId: z.string().min(1, "Bot ID is required"),
    isCombatBot: z.boolean().default(true),
    initializeWithDefaults: z.boolean().default(true),
  })
  .strict();

export type CreateBotMetricApi = z.infer<typeof CreateBotMetricApiSchema>;

// ============================================================================
// UPDATE SCHEMAS
// ============================================================================

/**
 * Schema for updating a BotMetric
 * Compatible with Prisma BotMetricUpdateInput
 */
export const UpdateBotMetricSchema = z
  .object({
    id: z.string().optional(),
    userId: z.string().min(1, "User ID is required").optional(),
    botId: z.string().min(1, "Bot ID is required").optional(),
    battlesWon: z
      .number()
      .int()
      .min(0, "Battles won cannot be negative")
      .max(1000000, "Battles won too large")
      .nullable()
      .optional(),
    battlesLost: z
      .number()
      .int()
      .min(0, "Battles lost cannot be negative")
      .max(1000000, "Battles lost too large")
      .nullable()
      .optional(),
    totalBattles: z
      .number()
      .int()
      .min(0, "Total battles cannot be negative")
      .max(1000000, "Total battles too large")
      .nullable()
      .optional(),
    missionsCompleted: z
      .number()
      .int()
      .min(0, "Missions completed cannot be negative")
      .max(1000000, "Missions completed too large")
      .optional(),
    successRate: z
      .number()
      .min(0, "Success rate cannot be negative")
      .max(1, "Success rate cannot exceed 1.0")
      .optional(),
    totalCombatTime: z
      .number()
      .int()
      .min(0, "Total combat time cannot be negative")
      .max(100000000, "Total combat time too large")
      .optional(),
    damageDealt: z
      .number()
      .int()
      .min(0, "Damage dealt cannot be negative")
      .max(2147483647, "Damage dealt too large")
      .optional(),
    damageTaken: z
      .number()
      .int()
      .min(0, "Damage taken cannot be negative")
      .max(2147483647, "Damage taken too large")
      .optional(),
    createdAt: z.coerce.date().optional(),
    updatedAt: z.coerce.date().optional(),
  })
  .strict();

export type UpdateBotMetricInput = z.infer<typeof UpdateBotMetricSchema>;

/**
 * Simplified update schema for API endpoints
 */
export const UpdateBotMetricApiSchema = z
  .object({
    recalculateSuccessRate: z.boolean().default(false),
    recalculateTotalBattles: z.boolean().default(false),
  })
  .strict();

export type UpdateBotMetricApi = z.infer<typeof UpdateBotMetricApiSchema>;

/**
 * Partial update schema - all fields optional
 */
export const PartialUpdateBotMetricSchema = BotMetricInputSchema.partial();
export type PartialUpdateBotMetric = z.infer<
  typeof PartialUpdateBotMetricSchema
>;

/**
 * Schema for battle result recording
 */
export const RecordBattleResultSchema = z
  .object({
    battleResult: z.enum(["won", "lost", "draw"]),
    battleDuration: z
      .number()
      .int()
      .min(1, "Battle duration must be positive")
      .max(86400, "Battle duration too long"), // 24 hours max
    damageDealt: z
      .number()
      .int()
      .min(0, "Damage dealt cannot be negative")
      .max(1000000, "Damage dealt too large"),
    damageTaken: z
      .number()
      .int()
      .min(0, "Damage taken cannot be negative")
      .max(1000000, "Damage taken too large"),
    experienceGained: z
      .number()
      .int()
      .min(0, "Experience gained cannot be negative")
      .max(10000, "Experience gained too large")
      .optional(),
    battleType: z
      .enum(["pvp", "pve", "tournament", "training", "arena"])
      .optional(),
    updateTotalBattles: z.boolean().default(true),
  })
  .strict();

export type RecordBattleResult = z.infer<typeof RecordBattleResultSchema>;

/**
 * Schema for mission completion recording
 */
export const RecordMissionCompletionSchema = z
  .object({
    missionResult: z.enum(["success", "failure", "partial"]),
    missionDuration: z
      .number()
      .int()
      .min(1, "Mission duration must be positive")
      .max(604800, "Mission duration too long"), // 1 week max
    damageDealt: z
      .number()
      .int()
      .min(0, "Damage dealt cannot be negative")
      .max(1000000, "Damage dealt too large")
      .default(0),
    damageTaken: z
      .number()
      .int()
      .min(0, "Damage taken cannot be negative")
      .max(1000000, "Damage taken too large")
      .default(0),
    experienceGained: z
      .number()
      .int()
      .min(0, "Experience gained cannot be negative")
      .max(10000, "Experience gained too large")
      .optional(),
    missionType: z
      .enum(["combat", "exploration", "construction", "transport", "mining"])
      .optional(),
    successWeight: z
      .number()
      .min(0, "Success weight cannot be negative")
      .max(1, "Success weight cannot exceed 1.0")
      .default(1.0),
    updateSuccessRate: z.boolean().default(true),
  })
  .strict();

export type RecordMissionCompletion = z.infer<
  typeof RecordMissionCompletionSchema
>;

// ============================================================================
// QUERY SCHEMAS
// ============================================================================

/**
 * Schema for finding a unique BotMetric
 */
export const FindUniqueBotMetricSchema = z
  .object({
    id: z.string().optional(),
    botId: z.string().optional(),
    userId_botId: z
      .object({
        userId: z.string(),
        botId: z.string(),
      })
      .optional(),
  })
  .strict();

export type FindUniqueBotMetricInput = z.infer<
  typeof FindUniqueBotMetricSchema
>;

/**
 * Schema for filtering BotMetrics
 */
export const BotMetricWhereSchema: z.ZodType<any> = z.lazy(() =>
  z
    .object({
      id: z.string().optional(),
      userId: z.string().optional(),
      botId: z.string().optional(),
      battlesWon: z.number().int().nullable().optional(),
      battlesLost: z.number().int().nullable().optional(),
      totalBattles: z.number().int().nullable().optional(),
      missionsCompleted: z.number().int().optional(),
      successRate: z.number().optional(),
      totalCombatTime: z.number().int().optional(),
      damageDealt: z.number().int().optional(),
      damageTaken: z.number().int().optional(),
      createdAt: z.date().optional(),
      updatedAt: z.date().optional(),
      AND: z.array(BotMetricWhereSchema).optional(),
      OR: z.array(BotMetricWhereSchema).optional(),
      NOT: BotMetricWhereSchema.optional(),
    })
    .strict()
);

export type BotMetricWhere = z.infer<typeof BotMetricWhereSchema>;

/**
 * Schema for ordering BotMetrics
 */
export const BotMetricOrderBySchema = z
  .object({
    id: z.enum(["asc", "desc"]).optional(),
    userId: z.enum(["asc", "desc"]).optional(),
    botId: z.enum(["asc", "desc"]).optional(),
    battlesWon: z.enum(["asc", "desc"]).optional(),
    battlesLost: z.enum(["asc", "desc"]).optional(),
    totalBattles: z.enum(["asc", "desc"]).optional(),
    missionsCompleted: z.enum(["asc", "desc"]).optional(),
    successRate: z.enum(["asc", "desc"]).optional(),
    totalCombatTime: z.enum(["asc", "desc"]).optional(),
    damageDealt: z.enum(["asc", "desc"]).optional(),
    damageTaken: z.enum(["asc", "desc"]).optional(),
    createdAt: z.enum(["asc", "desc"]).optional(),
    updatedAt: z.enum(["asc", "desc"]).optional(),
  })
  .strict();

export type BotMetricOrderBy = z.infer<typeof BotMetricOrderBySchema>;

/**
 * Schema for selecting BotMetric fields
 */
export const BotMetricSelectSchema = z
  .object({
    id: z.boolean().optional(),
    userId: z.boolean().optional(),
    botId: z.boolean().optional(),
    battlesWon: z.boolean().optional(),
    battlesLost: z.boolean().optional(),
    totalBattles: z.boolean().optional(),
    missionsCompleted: z.boolean().optional(),
    successRate: z.boolean().optional(),
    totalCombatTime: z.boolean().optional(),
    damageDealt: z.boolean().optional(),
    damageTaken: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    updatedAt: z.boolean().optional(),
    user: z.boolean().optional(),
    bot: z.boolean().optional(),
  })
  .strict();

export type BotMetricSelect = z.infer<typeof BotMetricSelectSchema>;

/**
 * Schema for including BotMetric relations
 */
export const BotMetricIncludeSchema = z
  .object({
    user: z.boolean().optional(),
    bot: z.boolean().optional(),
  })
  .strict();

export type BotMetricInclude = z.infer<typeof BotMetricIncludeSchema>;

// ============================================================================
// PAGINATION SCHEMAS
// ============================================================================

/**
 * Schema for paginated BotMetric queries
 */
export const FindManyBotMetricsSchema = z
  .object({
    where: BotMetricWhereSchema.optional(),
    orderBy: z
      .union([BotMetricOrderBySchema, z.array(BotMetricOrderBySchema)])
      .optional(),
    select: BotMetricSelectSchema.optional(),
    include: BotMetricIncludeSchema.optional(),
    skip: z.number().int().min(0).optional(),
    take: z.number().int().min(1).max(1000).optional(),
    cursor: FindUniqueBotMetricSchema.optional(),
  })
  .strict();

export type FindManyBotMetricsInput = z.infer<typeof FindManyBotMetricsSchema>;

// ============================================================================
// VALIDATION HELPERS
// ============================================================================

/**
 * Schema for validating bot metric consistency
 */
export const ValidateBotMetricConsistencySchema = z
  .object({
    botMetricId: z.string().min(1, "Bot metric ID is required"),
    checkBattleStats: z.boolean().default(true),
    checkSuccessRate: z.boolean().default(true),
    checkDamageConsistency: z.boolean().default(true),
    fixInconsistencies: z.boolean().default(false),
    recalculateRates: z.boolean().default(false),
  })
  .strict();

export type ValidateBotMetricConsistency = z.infer<
  typeof ValidateBotMetricConsistencySchema
>;

/**
 * Schema for bot metric analysis
 */
export const AnalyzeBotMetricSchema = z
  .object({
    battlesWon: z.number().int().min(0).nullable(),
    battlesLost: z.number().int().min(0).nullable(),
    totalBattles: z.number().int().min(0).nullable(),
    missionsCompleted: z.number().int().min(0),
    successRate: z.number().min(0).max(1),
    totalCombatTime: z.number().int().min(0),
    damageDealt: z.number().int().min(0),
    damageTaken: z.number().int().min(0),
    botType: z
      .enum(["WORKER", "PLAYABLE", "KING", "ROGUE", "GOVBOT"])
      .optional(),
    combatRole: z.enum(["ASSAULT", "TANK", "SNIPER", "SCOUT"]).optional(),
    includeComparisons: z.boolean().default(true),
    includeRecommendations: z.boolean().default(true),
  })
  .strict();

export type AnalyzeBotMetric = z.infer<typeof AnalyzeBotMetricSchema>;

/**
 * Schema for bot metric search and filtering
 */
export const SearchBotMetricsSchema = z
  .object({
    userId: z.string().optional(),
    minBattlesWon: z.number().int().min(0).optional(),
    maxBattlesWon: z.number().int().min(0).optional(),
    minTotalBattles: z.number().int().min(0).optional(),
    maxTotalBattles: z.number().int().min(0).optional(),
    minMissionsCompleted: z.number().int().min(0).optional(),
    maxMissionsCompleted: z.number().int().min(0).optional(),
    minSuccessRate: z.number().min(0).max(1).optional(),
    maxSuccessRate: z.number().min(0).max(1).optional(),
    minWinRate: z.number().min(0).max(1).optional(),
    maxWinRate: z.number().min(0).max(1).optional(),
    minDamageDealt: z.number().int().min(0).optional(),
    maxDamageDealt: z.number().int().min(0).optional(),
    minCombatTime: z.number().int().min(0).optional(),
    maxCombatTime: z.number().int().min(0).optional(),
    hasBattleStats: z.boolean().optional(),
    isTopPerformer: z.boolean().optional(),
    needsImprovement: z.boolean().optional(),
    limit: z.number().int().min(1).max(100).default(20),
  })
  .strict();

export type SearchBotMetrics = z.infer<typeof SearchBotMetricsSchema>;

// ============================================================================
// RESPONSE SCHEMAS
// ============================================================================

/**
 * Schema for BotMetric API responses
 */
export const BotMetricResponseSchema = BotMetricSchema;

export type BotMetricResponse = z.infer<typeof BotMetricResponseSchema>;

/**
 * Schema for BotMetric with User and Bot information
 */
export const BotMetricWithRelationsSchema = BotMetricResponseSchema.extend({
  user: z.object({
    id: z.string(),
    name: z.string().nullable(),
    email: z.string(),
  }),
  bot: z.object({
    id: z.string(),
    name: z.string(),
    botType: z.string(),
    combatRole: z.string().nullable(),
  }),
});

export type BotMetricWithRelations = z.infer<
  typeof BotMetricWithRelationsSchema
>;

/**
 * Schema for BotMetric summary (minimal info)
 */
export const BotMetricSummarySchema = z
  .object({
    id: z.string(),
    botId: z.string(),
    battlesWon: z.number().int().nullable(),
    battlesLost: z.number().int().nullable(),
    totalBattles: z.number().int().nullable(),
    missionsCompleted: z.number().int(),
    successRate: z.number(),
    damageDealt: z.number().int(),
    damageTaken: z.number().int(),
    updatedAt: z.date(),
  })
  .strict();

export type BotMetricSummary = z.infer<typeof BotMetricSummarySchema>;

/**
 * Schema for BotMetric with calculated stats
 */
export const BotMetricWithStatsSchema = BotMetricResponseSchema.extend({
  calculatedStats: z.object({
    winRate: z.number().min(0).max(1).nullable(),
    lossRate: z.number().min(0).max(1).nullable(),
    averageDamagePerBattle: z.number().nullable(),
    averageDamagePerMission: z.number(),
    damageEfficiency: z.number(),
    survivalRate: z.number().min(0).max(1),
    combatEffectiveness: z.number(),
    averageCombatTimePerBattle: z.number().nullable(),
    performanceGrade: z.enum(["F", "D", "C", "B", "A", "S"]),
  }),
  rankings: z.object({
    winRateRank: z.number().int().nullable(),
    successRateRank: z.number().int(),
    damageDealtRank: z.number().int(),
    missionsCompletedRank: z.number().int(),
    overallRank: z.number().int(),
  }),
  improvements: z.array(
    z.object({
      category: z.enum([
        "battle_performance",
        "mission_success",
        "damage_efficiency",
        "survival",
        "combat_time",
      ]),
      current: z.number(),
      target: z.number(),
      recommendation: z.string(),
      priority: z.enum(["low", "medium", "high", "critical"]),
    })
  ),
});

export type BotMetricWithStats = z.infer<typeof BotMetricWithStatsSchema>;

/**
 * Schema for bot metric comparison
 */
export const BotMetricComparisonSchema = z
  .object({
    baseBot: BotMetricSummarySchema,
    comparisonBot: BotMetricSummarySchema,
    differences: z.object({
      battlesWonDiff: z.number().int().nullable(),
      winRateDiff: z.number().nullable(),
      successRateDiff: z.number(),
      damageDealtDiff: z.number().int(),
      damageEfficiencyDiff: z.number(),
      missionsDiff: z.number().int(),
    }),
    winner: z.object({
      overall: z.enum(["base", "comparison", "tie"]),
      categories: z.object({
        battles: z.enum(["base", "comparison", "tie"]).nullable(),
        missions: z.enum(["base", "comparison", "tie"]),
        damage: z.enum(["base", "comparison", "tie"]),
        efficiency: z.enum(["base", "comparison", "tie"]),
      }),
    }),
  })
  .strict();

export type BotMetricComparison = z.infer<typeof BotMetricComparisonSchema>;

// ============================================================================
// ADMIN SCHEMAS
// ============================================================================

/**
 * Schema for admin bot metric management
 */
export const AdminBotMetricManagementSchema = z
  .object({
    action: z.enum([
      "list_all",
      "reset_metrics",
      "recalculate_rates",
      "fix_inconsistencies",
      "bulk_update",
      "generate_report",
    ]),
    resetOptions: z
      .object({
        resetBattleStats: z.boolean().default(true),
        resetMissionStats: z.boolean().default(true),
        resetDamageStats: z.boolean().default(true),
        resetCombatTime: z.boolean().default(true),
        preserveHistory: z.boolean().default(false),
      })
      .optional(),
    recalculateOptions: z
      .object({
        recalculateSuccessRate: z.boolean().default(true),
        recalculateBattleTotals: z.boolean().default(true),
        validateConsistency: z.boolean().default(true),
      })
      .optional(),
    bulkUpdateOptions: z
      .object({
        addMissions: z.number().int().min(0).optional(),
        addBattlesWon: z.number().int().min(0).optional(),
        addBattlesLost: z.number().int().min(0).optional(),
        addDamageDealt: z.number().int().min(0).optional(),
        addDamageTaken: z.number().int().min(0).optional(),
        multiplySuccessRate: z.number().min(0).max(2).optional(),
      })
      .optional(),
  })
  .strict();

export type AdminBotMetricManagement = z.infer<
  typeof AdminBotMetricManagementSchema
>;

/**
 * Schema for bot metric statistics
 */
export const BotMetricStatsSchema = z
  .object({
    totalBotMetrics: z.number().int().min(0),
    combatBots: z.number().int().min(0),
    workerBots: z.number().int().min(0),
    battleStats: z.object({
      totalBattles: z.number().int().min(0),
      totalWins: z.number().int().min(0),
      totalLosses: z.number().int().min(0),
      averageWinRate: z.number().nullable(),
      topWinRate: z.number().nullable(),
    }),
    missionStats: z.object({
      totalMissions: z.number().int().min(0),
      averageSuccessRate: z.number(),
      topSuccessRate: z.number(),
      botsWithPerfectRate: z.number().int().min(0),
    }),
    damageStats: z.object({
      totalDamageDealt: z.number().int().min(0),
      totalDamageTaken: z.number().int().min(0),
      averageDamageRatio: z.number(),
      topDamageDealer: z.object({
        botId: z.string(),
        damage: z.number().int(),
      }),
    }),
    combatTimeStats: z.object({
      totalCombatTime: z.number().int().min(0),
      averageCombatTime: z.number(),
      mostActiveCombatBot: z.object({
        botId: z.string(),
        combatTime: z.number().int(),
      }),
    }),
    performanceDistribution: z.object({
      gradeS: z.number().int().min(0),
      gradeA: z.number().int().min(0),
      gradeB: z.number().int().min(0),
      gradeC: z.number().int().min(0),
      gradeD: z.number().int().min(0),
      gradeF: z.number().int().min(0),
    }),
    topPerformers: z.array(
      z.object({
        botId: z.string(),
        botName: z.string(),
        overallScore: z.number(),
        category: z.enum([
          "battles",
          "missions",
          "damage",
          "efficiency",
          "overall",
        ]),
      })
    ),
  })
  .strict();

export type BotMetricStats = z.infer<typeof BotMetricStatsSchema>;

// ============================================================================
// EXPORTS
// ============================================================================

// All schemas are defined above and exported individually

// Export all validation functions
export const BotMetricValidation = {
  // Base schemas
  model: BotMetricSchema,
  input: BotMetricInputSchema,

  // CRUD schemas
  create: CreateBotMetricSchema,
  createApi: CreateBotMetricApiSchema,
  update: UpdateBotMetricSchema,
  updateApi: UpdateBotMetricApiSchema,
  partialUpdate: PartialUpdateBotMetricSchema,
  recordBattle: RecordBattleResultSchema,
  recordMission: RecordMissionCompletionSchema,

  // Query schemas
  findUnique: FindUniqueBotMetricSchema,
  findMany: FindManyBotMetricsSchema,
  where: BotMetricWhereSchema,
  orderBy: BotMetricOrderBySchema,
  select: BotMetricSelectSchema,
  include: BotMetricIncludeSchema,

  // Helpers
  validateConsistency: ValidateBotMetricConsistencySchema,
  analyze: AnalyzeBotMetricSchema,
  search: SearchBotMetricsSchema,

  // Response schemas
  response: BotMetricResponseSchema,
  withRelations: BotMetricWithRelationsSchema,
  summary: BotMetricSummarySchema,
  withStats: BotMetricWithStatsSchema,
  comparison: BotMetricComparisonSchema,

  // Admin schemas
  adminManagement: AdminBotMetricManagementSchema,
  stats: BotMetricStatsSchema,
} as const;
