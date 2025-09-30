import { z } from "zod";

// Base schema for SoulChipSlot
export const SoulChipSlotSchema = z.object({
  robotId: z.string(),
  itemInstId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// Create schema
export const CreateSoulChipSlotSchema = z.object({
  robotId: z.string().min(1, "Robot ID is required"),
  itemInstId: z.string().min(1, "Item instance ID is required"),
});

// Update schema (all fields optional except robotId)
export const UpdateSoulChipSlotSchema = z.object({
  robotId: z.string().min(1, "Robot ID is required"),
  itemInstId: z.string().min(1, "Item instance ID is required").optional(),
});

// Read/Query schema (for filtering)
export const ReadSoulChipSlotSchema = z.object({
  robotId: z.string().optional(),
  itemInstId: z.string().optional(),
});

// Delete schema (needs robotId)
export const DeleteSoulChipSlotSchema = z.object({
  robotId: z.string().min(1, "Robot ID is required"),
});

// Type exports
export type SoulChipSlot = z.infer<typeof SoulChipSlotSchema>;
export type CreateSoulChipSlot = z.infer<typeof CreateSoulChipSlotSchema>;
export type UpdateSoulChipSlot = z.infer<typeof UpdateSoulChipSlotSchema>;
export type ReadSoulChipSlot = z.infer<typeof ReadSoulChipSlotSchema>;
export type DeleteSoulChipSlot = z.infer<typeof DeleteSoulChipSlotSchema>;
