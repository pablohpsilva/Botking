import { z } from "zod";

// Base schema for IdentityLink
export const IdentityLinkSchema = z.object({
  id: z.string(),
  authUserId: z.string(),
  globalPlayerId: z.string(),
  linkedAt: z.date(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// Create schema (id is optional - auto-generated)
export const CreateIdentityLinkSchema = z.object({
  authUserId: z.string().min(1, "Auth user ID is required"),
  globalPlayerId: z.string().min(1, "Global player ID is required"),
  linkedAt: z.date().default(() => new Date()),
});

// Update schema (all fields optional except id)
export const UpdateIdentityLinkSchema = z.object({
  id: z.string().min(1, "ID is required"),
  authUserId: z.string().min(1, "Auth user ID is required").optional(),
  globalPlayerId: z.string().min(1, "Global player ID is required").optional(),
  linkedAt: z.date().optional(),
});

// Read/Query schema (for filtering)
export const ReadIdentityLinkSchema = z.object({
  id: z.string().optional(),
  authUserId: z.string().optional(),
  globalPlayerId: z.string().optional(),
});

// Delete schema (just needs id)
export const DeleteIdentityLinkSchema = z.object({
  id: z.string().min(1, "ID is required"),
});

// Type exports
export type IdentityLink = z.infer<typeof IdentityLinkSchema>;
export type CreateIdentityLink = z.infer<typeof CreateIdentityLinkSchema>;
export type UpdateIdentityLink = z.infer<typeof UpdateIdentityLinkSchema>;
export type ReadIdentityLink = z.infer<typeof ReadIdentityLinkSchema>;
export type DeleteIdentityLink = z.infer<typeof DeleteIdentityLinkSchema>;
