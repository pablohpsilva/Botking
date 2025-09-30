import { z } from "zod";

// Base schema for AssetPack
export const AssetPackSchema = z.object({
  id: z.string(),
  name: z.string(),
  version: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// Create schema (id is optional - auto-generated)
export const CreateAssetPackSchema = z.object({
  name: z.string().min(1, "Name is required"),
  version: z.string().min(1, "Version is required"),
});

// Update schema (all fields optional except id)
export const UpdateAssetPackSchema = z.object({
  id: z.string().min(1, "ID is required"),
  name: z.string().min(1, "Name is required").optional(),
  version: z.string().min(1, "Version is required").optional(),
});

// Read/Query schema (for filtering)
export const ReadAssetPackSchema = z.object({
  id: z.string().optional(),
  name: z.string().optional(),
  version: z.string().optional(),
});

// Delete schema (just needs id)
export const DeleteAssetPackSchema = z.object({
  id: z.string().min(1, "ID is required"),
});

// Type exports
export type AssetPack = z.infer<typeof AssetPackSchema>;
export type CreateAssetPack = z.infer<typeof CreateAssetPackSchema>;
export type UpdateAssetPack = z.infer<typeof UpdateAssetPackSchema>;
export type ReadAssetPack = z.infer<typeof ReadAssetPackSchema>;
export type DeleteAssetPack = z.infer<typeof DeleteAssetPackSchema>;
