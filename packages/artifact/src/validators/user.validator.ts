import { z } from "zod";

// Base schema for User
export const UserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// Create schema (id is optional - auto-generated)
export const CreateUserSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name must be 100 characters or less"),
  email: z.string().email("Must be a valid email address"),
});

// Update schema (all fields optional except id)
export const UpdateUserSchema = z.object({
  id: z.string().min(1, "ID is required"),
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name must be 100 characters or less")
    .optional(),
  email: z.string().email("Must be a valid email address").optional(),
});

// Read/Query schema (for filtering)
export const ReadUserSchema = z.object({
  id: z.string().optional(),
  name: z.string().optional(),
  email: z.string().optional(),
});

// Delete schema (just needs id)
export const DeleteUserSchema = z.object({
  id: z.string().min(1, "ID is required"),
});

// Type exports
export type User = z.infer<typeof UserSchema>;
export type CreateUser = z.infer<typeof CreateUserSchema>;
export type UpdateUser = z.infer<typeof UpdateUserSchema>;
export type ReadUser = z.infer<typeof ReadUserSchema>;
export type DeleteUser = z.infer<typeof DeleteUserSchema>;
