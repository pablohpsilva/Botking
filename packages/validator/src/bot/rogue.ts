import { BotType } from "@botking/db";
import z from "zod";

import { CombatRoleSchema, CreateBotSchema } from "./types";

/**
 * Base schema for Rogue bots
 */

const RogueBotBaseSchema = CreateBotSchema.safeExtend({
  botType: BotType.ROGUE,
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
 * Create and Update schemas for RogueBot bots
 */

export const CreateRogueBotSchema = RogueBotBaseSchema;

export type CreateRogueBot = z.infer<typeof CreateRogueBotSchema>;

export const UpdateRogueBotSchema = RogueBotBaseSchema.safeExtend({
  id: z.string().min(1, "ID is required"),
});

export type UpdateRogueBot = z.infer<typeof UpdateRogueBotSchema>;

export const DeleteRogueBotSchema = z.object({
  id: z.string().min(1, "ID is required"),
  userId: z.string().min(1, "User ID is required").optional(),
});

export type DeleteRogueBot = z.infer<typeof DeleteRogueBotSchema>;
