import { BotType } from "@botking/db";
import {
  CreateBotSchema,
  CombatRoleSchema,
  GovernmentTypeSchema,
} from "./types";
import z from "zod";

/**
 * Base schema for GOVBOT bots
 */

const GovBotBaseSchema = CreateBotSchema.safeExtend({
  botType: BotType.GOVBOT,
  userId: z.null().optional(),
  skeletonId: z.string().min(1, "Skeleton ID is required"),
  soulChipId: z.string().min(1, "Soul chip ID is required").optional(),
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name must be 100 characters or less"),
  combatRole: CombatRoleSchema.optional(),
  governmentType: GovernmentTypeSchema,
  description: z.string().optional(),
  utilitySpec: z.null().optional(),
});

/**
 * Create and Update schemas for GOVBOT bots
 */

export const CreateGovBotSchema = GovBotBaseSchema;

export type CreateGovBot = z.infer<typeof CreateGovBotSchema>;

export const UpdateGovBotSchema = GovBotBaseSchema.safeExtend({
  id: z.string().min(1, "ID is required"),
});

export type UpdateGovBot = z.infer<typeof UpdateGovBotSchema>;

export const DeleteGovBotSchema = z.object({
  id: z.string().min(1, "ID is required"),
});

export type DeleteGovBot = z.infer<typeof DeleteGovBotSchema>;
