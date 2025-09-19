import { BotType } from "@botking/db";
import { CreateBotSchema, CombatRoleSchema } from "./types";
import z from "zod";

/**
 * Base schema for King bots
 */

const KingBotBaseSchema = CreateBotSchema.safeExtend({
  botType: BotType.KING,
  userId: z.string().min(1, "User ID is required").optional(),
  skeletonId: z.string().min(1, "Skeleton ID is required"),
  soulChipId: z.string().min(1, "Soul chip ID is required"),
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name must be 100 characters or less"),
  combatRole: CombatRoleSchema,
  governmentType: z.null().optional(),
  description: z.string().optional(),
  utilitySpec: z.null().optional(),
});

/**
 * Create and Update schemas for KingBot bots
 */

export const CreateKingBotSchema = KingBotBaseSchema;

export type CreateKingBot = z.infer<typeof CreateKingBotSchema>;

export const UpdateKingBotSchema = KingBotBaseSchema.safeExtend({
  id: z.string().min(1, "ID is required"),
});

export type UpdateKingBot = z.infer<typeof UpdateKingBotSchema>;

export const DeleteKingBotSchema = z.object({
  id: z.string().min(1, "ID is required"),
  userId: z.string().min(1, "ID is required").optional(),
});

export type DeleteKingBot = z.infer<typeof DeleteKingBotSchema>;
