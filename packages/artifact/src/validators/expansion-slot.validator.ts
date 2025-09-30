import { z } from "zod";

// Base schema for ExpansionSlot
export const ExpansionSlotSchema = z.object({
  robotId: z.string(),
  slotIx: z.number(),
  itemInstId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// Create schema
export const CreateExpansionSlotSchema = z.object({
  robotId: z.string().min(1, "Robot ID is required"),
  slotIx: z.number().int().min(0, "Slot index must be non-negative"),
  itemInstId: z.string().min(1, "Item instance ID is required"),
});

// Update schema (all fields optional except composite key)
export const UpdateExpansionSlotSchema = z.object({
  robotId: z.string().min(1, "Robot ID is required"),
  slotIx: z.number().int().min(0, "Slot index must be non-negative"),
  itemInstId: z.string().min(1, "Item instance ID is required").optional(),
});

// Read/Query schema (for filtering)
export const ReadExpansionSlotSchema = z.object({
  robotId: z.string().optional(),
  slotIx: z.number().int().min(0).optional(),
  itemInstId: z.string().optional(),
});

// Delete schema (needs composite key)
export const DeleteExpansionSlotSchema = z.object({
  robotId: z.string().min(1, "Robot ID is required"),
  slotIx: z.number().int().min(0, "Slot index must be non-negative"),
});

// Type exports
export type ExpansionSlot = z.infer<typeof ExpansionSlotSchema>;
export type CreateExpansionSlot = z.infer<typeof CreateExpansionSlotSchema>;
export type UpdateExpansionSlot = z.infer<typeof UpdateExpansionSlotSchema>;
export type ReadExpansionSlot = z.infer<typeof ReadExpansionSlotSchema>;
export type DeleteExpansionSlot = z.infer<typeof DeleteExpansionSlotSchema>;
