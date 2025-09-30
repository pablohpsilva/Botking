import { z } from "zod";

// Base schema for ItemTemplateAsset
export const ItemTemplateAssetSchema = z.object({
  id: z.string(),
  itemTplId: z.string(),
  assetId: z.string(),
  primary: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// Create schema (without id, createdAt, updatedAt - auto-generated)
export const CreateItemTemplateAssetSchema = z.object({
  itemTplId: z.string().min(1, "Item template ID is required"),
  assetId: z.string().min(1, "Asset ID is required"),
  primary: z.boolean().default(false),
});

// Update schema (all fields optional except id)
export const UpdateItemTemplateAssetSchema = z.object({
  id: z.string().min(1, "ID is required"),
  itemTplId: z.string().min(1, "Item template ID is required").optional(),
  assetId: z.string().min(1, "Asset ID is required").optional(),
  primary: z.boolean().optional(),
});

// Read/Query schema (for filtering)
export const ReadItemTemplateAssetSchema = z.object({
  id: z.string().optional(),
  itemTplId: z.string().optional(),
  assetId: z.string().optional(),
  primary: z.boolean().optional(),
});

// Delete schema (just needs id)
export const DeleteItemTemplateAssetSchema = z.object({
  id: z.string().min(1, "ID is required"),
});

// Type exports
export type ItemTemplateAsset = z.infer<typeof ItemTemplateAssetSchema>;
export type CreateItemTemplateAsset = z.infer<
  typeof CreateItemTemplateAssetSchema
>;
export type UpdateItemTemplateAsset = z.infer<
  typeof UpdateItemTemplateAssetSchema
>;
export type ReadItemTemplateAsset = z.infer<typeof ReadItemTemplateAssetSchema>;
export type DeleteItemTemplateAsset = z.infer<
  typeof DeleteItemTemplateAssetSchema
>;
