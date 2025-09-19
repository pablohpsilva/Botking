import { BotType, GovernmentType, UtilitySpecialization } from "@botking/db";
import z from "zod";

import { CreateBotSchema } from "./types";

/**
 * Base schema for Worker bots
 */

const WorkerBotBaseSchema = CreateBotSchema.safeExtend({
  botType: BotType.WORKER,
  userId: z.string().min(1, "User ID is required").optional(),
  skeletonId: z.string().min(1, "Skeleton ID is required"),
  soulChipId: z.string().min(1, "Soul chip ID is required"),
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name must be 100 characters or less"),
  combatRole: z.null().optional(),
  governmentType: z.enum(GovernmentType).optional(),
  description: z.string().optional(),
  utilitySpec: z.enum(UtilitySpecialization),
});

/**
 * Create and Update schemas for WorkerBot bots
 */

export const CreateWorkerBotSchema = WorkerBotBaseSchema;

export type CreateWorkerBot = z.infer<typeof CreateWorkerBotSchema>;

export const UpdateWorkerBotSchema = WorkerBotBaseSchema.safeExtend({
  id: z.string().min(1, "ID is required"),
});

export type UpdateWorkerBot = z.infer<typeof UpdateWorkerBotSchema>;

export const DeleteWorkerBotSchema = z.object({
  id: z.string().min(1, "ID is required"),
  userId: z.string().min(1, "User ID is required").optional(),
});

export type DeleteWorkerBot = z.infer<typeof DeleteWorkerBotSchema>;
