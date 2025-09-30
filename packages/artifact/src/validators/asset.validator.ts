import { z } from "zod";
import { asset_kind } from "@botking/db";

// Enum for asset_kind (from Prisma schema)
export const AssetKindSchema = z.nativeEnum(asset_kind);

// Base schema for Asset
export const AssetSchema = z.object({
  id: z.string(),
  packId: z.string(),
  kind: AssetKindSchema,
  url: z.string(),
  width: z.number(),
  height: z.number(),
  variant: z.string(),
  meta: z.record(z.any()),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// Create schema (id is optional - auto-generated)
export const CreateAssetSchema = z.object({
  packId: z.string().min(1, "Pack ID is required"),
  kind: AssetKindSchema,
  url: z.string().url("Must be a valid URL"),
  width: z.number().positive("Width must be positive"),
  height: z.number().positive("Height must be positive"),
  variant: z.string().min(1, "Variant is required"),
  meta: z.record(z.any()).default({}),
});

// Update schema (all fields optional except id)
export const UpdateAssetSchema = z.object({
  id: z.string().min(1, "ID is required"),
  packId: z.string().min(1, "Pack ID is required").optional(),
  kind: AssetKindSchema.optional(),
  url: z.string().url("Must be a valid URL").optional(),
  width: z.number().positive("Width must be positive").optional(),
  height: z.number().positive("Height must be positive").optional(),
  variant: z.string().min(1, "Variant is required").optional(),
  meta: z.record(z.any()).optional(),
});

// Read/Query schema (for filtering)
export const ReadAssetSchema = z.object({
  id: z.string().optional(),
  packId: z.string().optional(),
  kind: AssetKindSchema.optional(),
  url: z.string().optional(),
  variant: z.string().optional(),
});

// Delete schema (just needs id)
export const DeleteAssetSchema = z.object({
  id: z.string().min(1, "ID is required"),
});

// Type exports
export type Asset = z.infer<typeof AssetSchema>;
export type CreateAsset = z.infer<typeof CreateAssetSchema>;
export type UpdateAsset = z.infer<typeof UpdateAssetSchema>;
export type ReadAsset = z.infer<typeof ReadAssetSchema>;
export type DeleteAsset = z.infer<typeof DeleteAssetSchema>;
export type AssetKind = z.infer<typeof AssetKindSchema>;
