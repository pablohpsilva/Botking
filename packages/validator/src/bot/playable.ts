import { BotType } from "@botking/db";
import z from "zod";

import { CreateBotSchema, CombatRoleSchema } from "./types";

/**
 * Base schema for PLAYABLE bots
 */

const PlayableBotBaseSchema = CreateBotSchema.safeExtend({
  botType: z.literal(BotType.PLAYABLE),
  userId: z.string().min(1, "User ID is required"),
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
 * Create and Update schemas for PlayableBot bots
 */

export const CreatePlayableBotSchema = PlayableBotBaseSchema;

export type CreatePlayableBot = z.infer<typeof CreatePlayableBotSchema>;

export const UpdatePlayableBotSchema = PlayableBotBaseSchema.safeExtend({
  id: z.string().min(1, "ID is required"),
});

export type UpdatePlayableBot = z.infer<typeof UpdatePlayableBotSchema>;

export const DeletePlayableBotSchema = z.object({
  id: z.string().min(1, "ID is required"),
  userId: z.string().min(1, "ID is required"),
});

export type DeletePlayableBot = z.infer<typeof DeletePlayableBotSchema>;
