/**
 * Zod schemas for database validation
 * These schemas are designed to work with Prisma models and provide validation
 */

import { z } from "zod";

// Export Prisma enums as types for compatibility
export type {
  Rarity,
  SkeletonType,
  MobilityType,
  PartCategory,
  ExpansionChipEffect,
  BotLocation,
  BotType,
  CollectionType,
} from "@prisma/client";

// Define enum schemas that match Prisma enums
export const RaritySchema = z.enum([
  "COMMON",
  "UNCOMMON",
  "RARE",
  "EPIC",
  "LEGENDARY",
  "ULTRA_RARE",
  "PROTOTYPE",
]);

export const SkeletonTypeSchema = z.enum([
  "LIGHT",
  "BALANCED",
  "HEAVY",
  "FLYING",
  "MODULAR",
]);

export const MobilityTypeSchema = z.enum([
  "WHEELED",
  "BIPEDAL",
  "WINGED",
  "TRACKED",
  "HYBRID",
]);

export const PartCategorySchema = z.enum([
  "ARM",
  "LEG",
  "TORSO",
  "HEAD",
  "ACCESSORY",
]);

export const ExpansionChipEffectSchema = z.enum([
  "ATTACK_BUFF",
  "DEFENSE_BUFF",
  "SPEED_BUFF",
  "AI_UPGRADE",
  "ENERGY_EFFICIENCY",
  "SPECIAL_ABILITY",
  "STAT_BOOST",
  "RESISTANCE",
]);

export const BotLocationSchema = z.enum([
  "STORAGE",
  "TRAINING",
  "MISSION",
  "MAINTENANCE",
  "COMBAT",
]);

export const BotTypeSchema = z.enum([
  "WORKER",
  "PLAYABLE",
  "KING",
  "ROGUE",
  "GOVBOT",
]);

export const CollectionTypeSchema = z.enum([
  "BOTS",
  "PARTS",
  "CHIPS",
  "SKELETONS",
  "MIXED",
]);

/**
 * Create schemas for DTO validation
 * These are perfect for API validation and form processing
 */

export const CreateSoulChipSchema = z.object({
  userId: z.string(),
  name: z.string().min(1).max(100),
  personality: z.string().min(1).max(200),
  rarity: RaritySchema,
  intelligence: z.number().int().min(0).max(100).optional().default(50),
  resilience: z.number().int().min(0).max(100).optional().default(50),
  adaptability: z.number().int().min(0).max(100).optional().default(50),
  specialTrait: z.string(),
  experiences: z.array(z.string()).optional().default([]),
  learningRate: z.number().min(0).max(1).optional().default(0.5),
  version: z.number().int().optional().default(1),
  source: z.string().optional(),
  tags: z.array(z.string()).optional().default([]),
  description: z.string().optional(),
  metadata: z.record(z.string(), z.any()).optional(),
});

export const CreateSkeletonSchema = z.object({
  userId: z.string(),
  name: z.string().min(1).max(100),
  type: SkeletonTypeSchema,
  rarity: RaritySchema,
  slots: z.number().int().min(1).max(20).optional().default(4),
  baseDurability: z.number().int().min(1).optional().default(100),
  currentDurability: z.number().int().min(0).optional().default(100),
  maxDurability: z.number().int().min(1).optional().default(100),
  mobilityType: MobilityTypeSchema,
  upgradeLevel: z.number().int().min(0).max(25).optional().default(0),
  specialAbilities: z.array(z.string()).optional().default([]),
  version: z.number().int().optional().default(1),
  source: z.string().optional(),
  tags: z.array(z.string()).optional().default([]),
  description: z.string().optional(),
  metadata: z.record(z.string(), z.any()).optional(),
});

export const CreatePartSchema = z.object({
  userId: z.string(),
  name: z.string().min(1).max(100),
  category: PartCategorySchema,
  rarity: RaritySchema,
  attack: z.number().int().min(0).optional().default(0),
  defense: z.number().int().min(0).optional().default(0),
  speed: z.number().int().min(0).optional().default(0),
  perception: z.number().int().min(0).optional().default(0),
  energyConsumption: z.number().int().min(0).optional().default(5),
  upgradeLevel: z.number().int().min(0).max(25).optional().default(0),
  currentDurability: z.number().int().min(0).optional().default(100),
  maxDurability: z.number().int().min(1).optional().default(100),
  abilities: z.array(z.record(z.string(), z.any())).optional().default([]),
  version: z.number().int().optional().default(1),
  source: z.string().optional(),
  tags: z.array(z.string()).optional().default([]),
  description: z.string().optional(),
  metadata: z.record(z.string(), z.any()).optional(),
});

export const CreateExpansionChipSchema = z.object({
  userId: z.string(),
  name: z.string().min(1).max(100),
  effect: ExpansionChipEffectSchema,
  rarity: RaritySchema,
  upgradeLevel: z.number().int().min(0).max(20).optional().default(0),
  effectMagnitude: z.number().min(0).max(10).optional().default(1.0),
  energyCost: z.number().int().min(0).optional().default(5),
  version: z.number().int().optional().default(1),
  source: z.string().optional(),
  tags: z.array(z.string()).optional().default([]),
  description: z.string().optional(),
  metadata: z.record(z.string(), z.any()).optional(),
});

export const CreateBotStateSchema = z.object({
  userId: z.string(),
  name: z.string().min(1).max(100),
  stateType: z.enum(["worker", "non-worker"]).optional().default("worker"),

  // Core properties (all bot types)
  energyLevel: z.number().int().min(0).max(100).optional().default(100),
  maintenanceLevel: z.number().int().min(0).max(100).optional().default(100),
  currentLocation: BotLocationSchema.optional().default("STORAGE"),
  experience: z.number().int().min(0).optional().default(0),
  statusEffects: z.array(z.string()).optional().default([]),
  customizations: z.record(z.string(), z.any()).optional().default({}),

  // Non-worker specific properties (optional/null for worker bots)
  bondLevel: z.number().int().min(0).max(100).optional(),
  lastActivity: z.date().optional(),
  battlesWon: z.number().int().min(0).optional(),
  battlesLost: z.number().int().min(0).optional(),
  totalBattles: z.number().int().min(0).optional(),

  // Legacy fields (for backward compatibility)
  location: BotLocationSchema.optional().default("STORAGE"), // Maps to currentLocation
  energy: z.number().int().min(0).optional().default(100), // Maps to energyLevel
  maxEnergy: z.number().int().min(1).optional().default(100),
  health: z.number().int().min(0).optional().default(100), // Maps to maintenanceLevel
  maxHealth: z.number().int().min(1).optional().default(100),
  level: z.number().int().min(1).optional().default(1),
  missionsCompleted: z.number().int().min(0).optional().default(0),
  successRate: z.number().min(0).max(1).optional().default(0.0),
  totalCombatTime: z.number().int().min(0).optional().default(0),
  damageDealt: z.number().int().min(0).optional().default(0),
  damageTaken: z.number().int().min(0).optional().default(0),
  lastActiveAt: z.date().optional(),

  // Metadata
  version: z.number().int().optional().default(1),
  source: z.string().optional(),
  tags: z.array(z.string()).optional().default([]),
  description: z.string().optional(),
  metadata: z.record(z.string(), z.any()).optional(),
});

export const CreateBotSchema = z.object({
  userId: z.string().optional(), // Optional for autonomous bots (ROGUE, GOVBOT)
  playerId: z.string().optional(), // Optional player assignment
  name: z.string().min(1).max(100),
  botType: BotTypeSchema.optional().default("WORKER"),
  soulChipId: z.string(),
  skeletonId: z.string(),
  stateId: z.string(),
  overallRating: z.number().min(0).max(100).optional(),
  buildType: z.string().optional(),
  version: z.number().int().optional().default(1),
  assemblyVersion: z.number().int().optional().default(1),
  assemblyDate: z.date().optional(),
  lastModified: z.date().optional(),
  source: z.string().optional(),
  tags: z.array(z.string()).optional().default([]),
  description: z.string().optional(),
  metadata: z.record(z.string(), z.any()).optional(),
});

export const CreateCollectionSchema = z.object({
  userId: z.string(),
  name: z.string().min(1).max(100),
  description: z.string().optional(),
  type: CollectionTypeSchema,
  itemIds: z.array(z.string()).optional().default([]),
  isPublic: z.boolean().optional().default(false),
  shareCode: z.string().optional(),
  version: z.number().int().optional().default(1),
  source: z.string().optional(),
  tags: z.array(z.string()).optional().default([]),
  metadata: z.record(z.string(), z.any()).optional(),
});

// Update schemas (partial)
export const UpdateSoulChipSchema = CreateSoulChipSchema.partial().omit({
  userId: true,
});
export const UpdateSkeletonSchema = CreateSkeletonSchema.partial().omit({
  userId: true,
});
export const UpdatePartSchema = CreatePartSchema.partial().omit({
  userId: true,
});
export const UpdateExpansionChipSchema =
  CreateExpansionChipSchema.partial().omit({ userId: true });
export const UpdateBotStateSchema = CreateBotStateSchema.partial().omit({
  userId: true,
});
export const UpdateBotSchema = CreateBotSchema.partial().omit({ userId: true });
export const UpdateCollectionSchema = CreateCollectionSchema.partial().omit({
  userId: true,
});

// Export the inferred types
export type CreateSoulChipDTO = z.infer<typeof CreateSoulChipSchema>;
export type CreateSkeletonDTO = z.infer<typeof CreateSkeletonSchema>;
export type CreatePartDTO = z.infer<typeof CreatePartSchema>;
export type CreateExpansionChipDTO = z.infer<typeof CreateExpansionChipSchema>;
export type CreateBotStateDTO = z.infer<typeof CreateBotStateSchema>;
export type CreateBotDTO = z.infer<typeof CreateBotSchema>;
export type CreateCollectionDTO = z.infer<typeof CreateCollectionSchema>;

export type UpdateSoulChipDTO = z.infer<typeof UpdateSoulChipSchema>;
export type UpdateSkeletonDTO = z.infer<typeof UpdateSkeletonSchema>;
export type UpdatePartDTO = z.infer<typeof UpdatePartSchema>;
export type UpdateExpansionChipDTO = z.infer<typeof UpdateExpansionChipSchema>;
export type UpdateBotStateDTO = z.infer<typeof UpdateBotStateSchema>;
export type UpdateBotDTO = z.infer<typeof UpdateBotSchema>;
export type UpdateCollectionDTO = z.infer<typeof UpdateCollectionSchema>;

// Helper schemas for business logic validation
export const SoulChipStatsSchema = z
  .object({
    intelligence: z.number().int().min(0).max(100),
    resilience: z.number().int().min(0).max(100),
    adaptability: z.number().int().min(0).max(100),
  })
  .refine(
    (data) => data.intelligence + data.resilience + data.adaptability <= 300,
    { message: "Total soul chip stats cannot exceed 300 points" }
  );

export const PartStatsSchema = z
  .object({
    attack: z.number().int().min(0),
    defense: z.number().int().min(0),
    speed: z.number().int().min(0),
    perception: z.number().int().min(0),
  })
  .refine(
    (data) => data.attack + data.defense + data.speed + data.perception <= 1000,
    { message: "Total part stats cannot exceed 1000 points" }
  );

export const BotAssemblySchema = z
  .object({
    soulChip: CreateSoulChipSchema,
    skeleton: CreateSkeletonSchema,
    state: CreateBotStateSchema,
    parts: z.array(CreatePartSchema).max(20), // Max 20 parts per bot
  })
  .refine(
    (data) => {
      // Check if parts fit in skeleton slots
      return data.parts.length <= data.skeleton.slots;
    },
    { message: "Cannot equip more parts than skeleton slots allow" }
  );

// Bot type validation schemas
export const BotTypeValidationSchema = z
  .object({
    botType: BotTypeSchema,
    userId: z.string().nullable().optional(),
    playerId: z.string().nullable().optional(),
  })
  .superRefine((data, ctx) => {
    switch (data.botType) {
      case "PLAYABLE":
      case "KING":
        // These types must have an owner
        if (!data.userId) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `${data.botType} bots must have an owner assigned`,
            path: ["userId"],
          });
        }
        break;

      case "ROGUE":
      case "GOVBOT":
        // These types cannot have owners or players
        if (data.userId) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `${data.botType} bots cannot have an owner assigned`,
            path: ["userId"],
          });
        }
        if (data.playerId) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `${data.botType} bots cannot have a player assigned`,
            path: ["playerId"],
          });
        }
        break;

      case "WORKER":
        // Workers can optionally have owners but must have one if they have a player
        if (data.playerId && !data.userId) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Worker bots with a player must have an owner",
            path: ["userId"],
          });
        }
        break;
    }
  });

// Bot state type validation
export const BotStateTypeValidationSchema = z
  .object({
    stateType: z.enum(["worker", "non-worker"]),
    bondLevel: z.number().optional(),
    lastActivity: z.date().optional(),
    battlesWon: z.number().optional(),
    battlesLost: z.number().optional(),
    totalBattles: z.number().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.stateType === "worker") {
      // Worker bots should not have non-worker specific properties
      if (data.bondLevel !== undefined) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Worker bots cannot have bond level",
          path: ["bondLevel"],
        });
      }
      if (data.lastActivity !== undefined) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Worker bots do not track last activity",
          path: ["lastActivity"],
        });
      }
      if (
        data.battlesWon !== undefined ||
        data.battlesLost !== undefined ||
        data.totalBattles !== undefined
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Worker bots do not track battle statistics",
          path: ["battlesWon"],
        });
      }
    } else if (data.stateType === "non-worker") {
      // Non-worker bots should have battle stats consistency
      if (
        data.battlesWon !== undefined &&
        data.battlesLost !== undefined &&
        data.totalBattles !== undefined
      ) {
        if (data.totalBattles < data.battlesWon + data.battlesLost) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message:
              "Total battles must be greater than or equal to won + lost battles",
            path: ["totalBattles"],
          });
        }
      }
    }
  });

export type BotAssemblyDTO = z.infer<typeof BotAssemblySchema>;
export type BotTypeValidationDTO = z.infer<typeof BotTypeValidationSchema>;
export type BotStateTypeValidationDTO = z.infer<
  typeof BotStateTypeValidationSchema
>;
