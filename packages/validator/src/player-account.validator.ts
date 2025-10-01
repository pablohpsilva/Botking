import { z } from "zod";

// Base schema for PlayerAccount
export const PlayerAccountSchema = z.object({
  shardId: z.number(),
  playerId: z.string(),
  globalPlayerId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// Create schema
export const CreatePlayerAccountSchema = z.object({
  shardId: z.number().int().min(0, "Shard ID must be non-negative"),
  playerId: z.string().min(1, "Player ID is required"),
  globalPlayerId: z.string().min(1, "Global player ID is required"),
});

// Update schema (all fields optional except composite key)
export const UpdatePlayerAccountSchema = z.object({
  shardId: z.number().int().min(0, "Shard ID must be non-negative"),
  playerId: z.string().min(1, "Player ID is required"),
  globalPlayerId: z.string().min(1, "Global player ID is required").optional(),
});

// Read/Query schema (for filtering)
export const ReadPlayerAccountSchema = z.object({
  shardId: z.number().int().min(0).optional(),
  playerId: z.string().optional(),
  globalPlayerId: z.string().optional(),
});

// Delete schema (needs composite key)
export const DeletePlayerAccountSchema = z.object({
  shardId: z.number().int().min(0, "Shard ID must be non-negative"),
  playerId: z.string().min(1, "Player ID is required"),
});

// Type exports
export type PlayerAccount = z.infer<typeof PlayerAccountSchema>;
export type CreatePlayerAccount = z.infer<typeof CreatePlayerAccountSchema>;
export type UpdatePlayerAccount = z.infer<typeof UpdatePlayerAccountSchema>;
export type ReadPlayerAccount = z.infer<typeof ReadPlayerAccountSchema>;
export type DeletePlayerAccount = z.infer<typeof DeletePlayerAccountSchema>;
