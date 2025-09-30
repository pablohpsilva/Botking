import { z } from "zod";

// Base schema for Robot
export const RobotSchema = z.object({
  id: z.string(),
  shardId: z.number(),
  playerId: z.bigint(),
  nickname: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// Create schema (id is required in constructor but can be empty string)
export const CreateRobotSchema = z.object({
  id: z.string().min(1, "ID is required"),
  shardId: z.number().int().min(0, "Shard ID must be non-negative"),
  playerId: z.bigint().positive("Player ID must be positive"),
  nickname: z
    .string()
    .min(1, "Nickname is required")
    .max(50, "Nickname must be 50 characters or less"),
});

// Update schema (all fields optional except id)
export const UpdateRobotSchema = z.object({
  id: z.string().min(1, "ID is required"),
  shardId: z.number().int().min(0, "Shard ID must be non-negative").optional(),
  playerId: z.bigint().positive("Player ID must be positive").optional(),
  nickname: z
    .string()
    .min(1, "Nickname is required")
    .max(50, "Nickname must be 50 characters or less")
    .optional(),
});

// Read/Query schema (for filtering)
export const ReadRobotSchema = z.object({
  id: z.string().optional(),
  shardId: z.number().int().min(0).optional(),
  playerId: z.bigint().optional(),
  nickname: z.string().optional(),
});

// Delete schema (just needs id)
export const DeleteRobotSchema = z.object({
  id: z.string().min(1, "ID is required"),
});

// Type exports
export type Robot = z.infer<typeof RobotSchema>;
export type CreateRobot = z.infer<typeof CreateRobotSchema>;
export type UpdateRobot = z.infer<typeof UpdateRobotSchema>;
export type ReadRobot = z.infer<typeof ReadRobotSchema>;
export type DeleteRobot = z.infer<typeof DeleteRobotSchema>;
