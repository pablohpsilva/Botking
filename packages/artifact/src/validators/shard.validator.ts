import { z } from "zod";

// Base schema for Shard
export const ShardSchema = z.object({
  id: z.number(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// Create schema
export const CreateShardSchema = z.object({
  id: z.number().int().min(0, "Shard ID must be non-negative"),
});

// Update schema (all fields optional except id)
export const UpdateShardSchema = z.object({
  id: z.number().int().min(0, "Shard ID must be non-negative"),
});

// Read/Query schema (for filtering)
export const ReadShardSchema = z.object({
  id: z.number().int().min(0).optional(),
});

// Delete schema (just needs id)
export const DeleteShardSchema = z.object({
  id: z.number().int().min(0, "Shard ID must be non-negative"),
});

// Type exports
export type Shard = z.infer<typeof ShardSchema>;
export type CreateShard = z.infer<typeof CreateShardSchema>;
export type UpdateShard = z.infer<typeof UpdateShardSchema>;
export type ReadShard = z.infer<typeof ReadShardSchema>;
export type DeleteShard = z.infer<typeof DeleteShardSchema>;
