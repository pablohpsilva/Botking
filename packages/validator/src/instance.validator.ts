import { z } from "zod";
import { instance_state } from "@botking/db";

// Enum for instance_state (from Prisma schema)
export const InstanceStateSchema = z.nativeEnum(instance_state);

// Base schema for Instance
export const InstanceSchema = z.object({
  id: z.string(),
  shardId: z.number(),
  playerId: z.bigint(),
  templateId: z.string(),
  state: InstanceStateSchema,
  boundToPlayer: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// Create schema (id is optional - auto-generated)
export const CreateInstanceSchema = z.object({
  shardId: z.number().int().min(0, "Shard ID must be non-negative"),
  playerId: z.bigint().positive("Player ID must be positive"),
  templateId: z.string().min(1, "Template ID is required"),
  state: InstanceStateSchema.default("NEW"),
  boundToPlayer: z.string().min(1, "Bound to player is required"),
});

// Update schema (all fields optional except id)
export const UpdateInstanceSchema = z.object({
  id: z.string().min(1, "ID is required"),
  shardId: z.number().int().min(0, "Shard ID must be non-negative").optional(),
  playerId: z.bigint().positive("Player ID must be positive").optional(),
  templateId: z.string().min(1, "Template ID is required").optional(),
  state: InstanceStateSchema.optional(),
  boundToPlayer: z.string().min(1, "Bound to player is required").optional(),
});

// Read/Query schema (for filtering)
export const ReadInstanceSchema = z.object({
  id: z.string().optional(),
  shardId: z.number().int().min(0).optional(),
  playerId: z.bigint().optional(),
  templateId: z.string().optional(),
  state: InstanceStateSchema.optional(),
  boundToPlayer: z.string().optional(),
});

// Delete schema (just needs id)
export const DeleteInstanceSchema = z.object({
  id: z.string().min(1, "ID is required"),
});

// Type exports
export type Instance = z.infer<typeof InstanceSchema>;
export type CreateInstance = z.infer<typeof CreateInstanceSchema>;
export type UpdateInstance = z.infer<typeof UpdateInstanceSchema>;
export type ReadInstance = z.infer<typeof ReadInstanceSchema>;
export type DeleteInstance = z.infer<typeof DeleteInstanceSchema>;
export type InstanceState = z.infer<typeof InstanceStateSchema>;
