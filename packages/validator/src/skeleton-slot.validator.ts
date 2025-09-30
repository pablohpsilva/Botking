import { z } from "zod";

// Base schema for SkeletonSlot
export const SkeletonSlotSchema = z.object({
  robotId: z.string(),
  itemInstId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// Create schema
export const CreateSkeletonSlotSchema = z.object({
  robotId: z.string().min(1, "Robot ID is required"),
  itemInstId: z.string().min(1, "Item instance ID is required"),
});

// Update schema (all fields optional except robotId)
export const UpdateSkeletonSlotSchema = z.object({
  robotId: z.string().min(1, "Robot ID is required"),
  itemInstId: z.string().min(1, "Item instance ID is required").optional(),
});

// Read/Query schema (for filtering)
export const ReadSkeletonSlotSchema = z.object({
  robotId: z.string().optional(),
  itemInstId: z.string().optional(),
});

// Delete schema (needs robotId)
export const DeleteSkeletonSlotSchema = z.object({
  robotId: z.string().min(1, "Robot ID is required"),
});

// Type exports
export type SkeletonSlot = z.infer<typeof SkeletonSlotSchema>;
export type CreateSkeletonSlot = z.infer<typeof CreateSkeletonSlotSchema>;
export type UpdateSkeletonSlot = z.infer<typeof UpdateSkeletonSlotSchema>;
export type ReadSkeletonSlot = z.infer<typeof ReadSkeletonSlotSchema>;
export type DeleteSkeletonSlot = z.infer<typeof DeleteSkeletonSlotSchema>;
