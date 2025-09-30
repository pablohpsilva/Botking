import { z } from "zod";
import { robot_part_slot } from "@botking/db";

// Enum for robot_part_slot (from Prisma schema)
export const RobotPartSlotSchema = z.nativeEnum(robot_part_slot);

// Base schema for PartSlot
export const PartSlotSchema = z.object({
  robotId: z.string(),
  slotType: RobotPartSlotSchema,
  itemInstId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// Create schema
export const CreatePartSlotSchema = z.object({
  robotId: z.string().min(1, "Robot ID is required"),
  slotType: RobotPartSlotSchema,
  itemInstId: z.string().min(1, "Item instance ID is required"),
});

// Update schema (all fields optional except composite key)
export const UpdatePartSlotSchema = z.object({
  robotId: z.string().min(1, "Robot ID is required"),
  slotType: RobotPartSlotSchema,
  itemInstId: z.string().min(1, "Item instance ID is required").optional(),
});

// Read/Query schema (for filtering)
export const ReadPartSlotSchema = z.object({
  robotId: z.string().optional(),
  slotType: RobotPartSlotSchema.optional(),
  itemInstId: z.string().optional(),
});

// Delete schema (needs composite key)
export const DeletePartSlotSchema = z.object({
  robotId: z.string().min(1, "Robot ID is required"),
  slotType: RobotPartSlotSchema,
});

// Type exports
export type PartSlot = z.infer<typeof PartSlotSchema>;
export type CreatePartSlot = z.infer<typeof CreatePartSlotSchema>;
export type UpdatePartSlot = z.infer<typeof UpdatePartSlotSchema>;
export type ReadPartSlot = z.infer<typeof ReadPartSlotSchema>;
export type DeletePartSlot = z.infer<typeof DeletePartSlotSchema>;
export type RobotPartSlot = z.infer<typeof RobotPartSlotSchema>;
