import { z } from "zod";
import { item_class } from "@botking/db";

// Enum for item_class (from Prisma schema)
export const ItemClassSchema = z.nativeEnum(item_class);

// Base schema for Template
export const TemplateSchema = z.object({
  id: z.string(),
  itemClass: ItemClassSchema,
  name: z.string(),
  slug: z.string(),
  meta: z.record(z.any()),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// Create schema (id is optional - auto-generated)
export const CreateTemplateSchema = z.object({
  itemClass: ItemClassSchema,
  name: z.string().min(1, "Name is required"),
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(
      /^[a-z0-9-]+$/,
      "Slug must contain only lowercase letters, numbers, and hyphens"
    ),
  meta: z.record(z.any()).default({}),
});

// Update schema (all fields optional except id)
export const UpdateTemplateSchema = z.object({
  id: z.string().min(1, "ID is required"),
  itemClass: ItemClassSchema.optional(),
  name: z.string().min(1, "Name is required").optional(),
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(
      /^[a-z0-9-]+$/,
      "Slug must contain only lowercase letters, numbers, and hyphens"
    )
    .optional(),
  meta: z.record(z.any()).optional(),
});

// Read/Query schema (for filtering)
export const ReadTemplateSchema = z.object({
  id: z.string().optional(),
  itemClass: ItemClassSchema.optional(),
  name: z.string().optional(),
  slug: z.string().optional(),
});

// Delete schema (just needs id)
export const DeleteTemplateSchema = z.object({
  id: z.string().min(1, "ID is required"),
});

// Type exports
export type Template = z.infer<typeof TemplateSchema>;
export type CreateTemplate = z.infer<typeof CreateTemplateSchema>;
export type UpdateTemplate = z.infer<typeof UpdateTemplateSchema>;
export type ReadTemplate = z.infer<typeof ReadTemplateSchema>;
export type DeleteTemplate = z.infer<typeof DeleteTemplateSchema>;
export type ItemClass = z.infer<typeof ItemClassSchema>;
