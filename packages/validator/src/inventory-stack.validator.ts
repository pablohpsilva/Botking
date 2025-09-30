import { z } from "zod";

// Base schema for InventoryStack
export const InventoryStackSchema = z.object({
  id: z.string(),
  shardId: z.number(),
  playerId: z.bigint(),
  templateId: z.string(),
  quantity: z.bigint(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// Create schema (id is optional - auto-generated)
export const CreateInventoryStackSchema = z.object({
  shardId: z.number().int().min(0, "Shard ID must be non-negative"),
  playerId: z.bigint().positive("Player ID must be positive"),
  templateId: z.string().min(1, "Template ID is required"),
  quantity: z.bigint().positive("Quantity must be positive"),
});

// Update schema (all fields optional except id)
export const UpdateInventoryStackSchema = z.object({
  id: z.string().min(1, "ID is required"),
  shardId: z.number().int().min(0, "Shard ID must be non-negative").optional(),
  playerId: z.bigint().positive("Player ID must be positive").optional(),
  templateId: z.string().min(1, "Template ID is required").optional(),
  quantity: z.bigint().positive("Quantity must be positive").optional(),
});

// Read/Query schema (for filtering)
export const ReadInventoryStackSchema = z.object({
  id: z.string().optional(),
  shardId: z.number().int().min(0).optional(),
  playerId: z.bigint().optional(),
  templateId: z.string().optional(),
});

// Delete schema (just needs id)
export const DeleteInventoryStackSchema = z.object({
  id: z.string().min(1, "ID is required"),
});

// Type exports
export type InventoryStack = z.infer<typeof InventoryStackSchema>;
export type CreateInventoryStack = z.infer<typeof CreateInventoryStackSchema>;
export type UpdateInventoryStack = z.infer<typeof UpdateInventoryStackSchema>;
export type ReadInventoryStack = z.infer<typeof ReadInventoryStackSchema>;
export type DeleteInventoryStack = z.infer<typeof DeleteInventoryStackSchema>;
