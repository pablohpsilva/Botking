import { z } from "zod";

// ============================================================================
// BASE SCHEMAS
// ============================================================================

/**
 * Base User model schema - represents the complete User entity
 */
export const UserSchema = z
  .object({
    id: z.string(),
    email: z.email(),
    emailVerified: z.boolean(),
    name: z.string().nullable(),
    image: z.url().nullable(),
    createdAt: z.date(),
    updatedAt: z.date(),
  })
  .strict();

export type User = z.infer<typeof UserSchema>;

/**
 * User input schema for forms and API inputs (without auto-generated fields)
 */
export const UserInputSchema = z
  .object({
    email: z.email("Invalid email address"),
    emailVerified: z.boolean().optional().default(false),
    name: z
      .string()
      .min(1, "Name cannot be empty")
      .max(100, "Name too long")
      .optional()
      .nullable(),
    image: z.url("Invalid image URL").optional().nullable(),
  })
  .strict();

export type UserInput = z.infer<typeof UserInputSchema>;

// ============================================================================
// CREATE SCHEMAS
// ============================================================================

/**
 * Schema for creating a new User
 * Compatible with Prisma UserCreateInput
 */
export const CreateUserSchema = z
  .object({
    id: z.string().optional(),
    email: z.email("Invalid email address"),
    emailVerified: z.boolean().optional().default(false),
    name: z
      .string()
      .min(1, "Name cannot be empty")
      .max(100, "Name too long")
      .optional()
      .nullable(),
    image: z.url("Invalid image URL").optional().nullable(),
    createdAt: z.coerce.date().optional(),
    updatedAt: z.coerce.date().optional(),
  })
  .strict();

export type CreateUserInput = z.infer<typeof CreateUserSchema>;

/**
 * Simplified create schema for API endpoints
 */
export const CreateUserApiSchema = z
  .object({
    email: z.email("Invalid email address"),
    name: z
      .string()
      .min(1, "Name cannot be empty")
      .max(100, "Name too long")
      .optional()
      .nullable(),
    image: z.url("Invalid image URL").optional().nullable(),
  })
  .strict();

export type CreateUserApi = z.infer<typeof CreateUserApiSchema>;

/**
 * Schema for user registration
 */
export const RegisterUserSchema = z
  .object({
    email: z.email("Invalid email address"),
    name: z
      .string()
      .min(2, "Name must be at least 2 characters")
      .max(100, "Name too long")
      .optional(),
  })
  .strict();

export type RegisterUser = z.infer<typeof RegisterUserSchema>;

// ============================================================================
// UPDATE SCHEMAS
// ============================================================================

/**
 * Schema for updating a User
 * Compatible with Prisma UserUpdateInput
 */
export const UpdateUserSchema = z
  .object({
    id: z.string().optional(),
    email: z.email("Invalid email address").optional(),
    emailVerified: z.boolean().optional(),
    name: z
      .string()
      .min(1, "Name cannot be empty")
      .max(100, "Name too long")
      .optional()
      .nullable(),
    image: z.url("Invalid image URL").optional().nullable(),
    createdAt: z.coerce.date().optional(),
    updatedAt: z.coerce.date().optional(),
  })
  .strict();

export type UpdateUserInput = z.infer<typeof UpdateUserSchema>;

/**
 * Simplified update schema for API endpoints
 */
export const UpdateUserApiSchema = z
  .object({
    email: z.email("Invalid email address").optional(),
    name: z
      .string()
      .min(1, "Name cannot be empty")
      .max(100, "Name too long")
      .optional()
      .nullable(),
    image: z.url("Invalid image URL").optional().nullable(),
  })
  .strict();

export type UpdateUserApi = z.infer<typeof UpdateUserApiSchema>;

/**
 * Partial update schema - all fields optional
 */
export const PartialUpdateUserSchema = UserInputSchema.partial();
export type PartialUpdateUser = z.infer<typeof PartialUpdateUserSchema>;

/**
 * Schema for updating user profile
 */
export const UpdateUserProfileSchema = z
  .object({
    name: z
      .string()
      .min(1, "Name cannot be empty")
      .max(100, "Name too long")
      .optional()
      .nullable(),
    image: z.url("Invalid image URL").optional().nullable(),
  })
  .strict();

export type UpdateUserProfile = z.infer<typeof UpdateUserProfileSchema>;

/**
 * Schema for email verification
 */
export const VerifyEmailSchema = z
  .object({
    emailVerified: z.literal(true),
  })
  .strict();

export type VerifyEmail = z.infer<typeof VerifyEmailSchema>;

// ============================================================================
// QUERY SCHEMAS
// ============================================================================

/**
 * Schema for finding a unique User
 */
export const FindUniqueUserSchema = z
  .object({
    id: z.string().optional(),
    email: z.email().optional(),
  })
  .strict();

export type FindUniqueUserInput = z.infer<typeof FindUniqueUserSchema>;

/**
 * Schema for filtering Users
 */
export const UserWhereSchema: z.ZodType<any> = z.lazy(() =>
  z
    .object({
      id: z.string().optional(),
      email: z.string().optional(),
      emailVerified: z.boolean().optional(),
      name: z.string().nullable().optional(),
      image: z.string().nullable().optional(),
      createdAt: z.date().optional(),
      updatedAt: z.date().optional(),
      AND: z.array(UserWhereSchema).optional(),
      OR: z.array(UserWhereSchema).optional(),
      NOT: UserWhereSchema.optional(),
    })
    .strict()
);

export type UserWhere = z.infer<typeof UserWhereSchema>;

/**
 * Schema for ordering Users
 */
export const UserOrderBySchema = z
  .object({
    id: z.enum(["asc", "desc"]).optional(),
    email: z.enum(["asc", "desc"]).optional(),
    emailVerified: z.enum(["asc", "desc"]).optional(),
    name: z.enum(["asc", "desc"]).optional(),
    createdAt: z.enum(["asc", "desc"]).optional(),
    updatedAt: z.enum(["asc", "desc"]).optional(),
  })
  .strict();

export type UserOrderBy = z.infer<typeof UserOrderBySchema>;

/**
 * Schema for selecting User fields
 */
export const UserSelectSchema = z
  .object({
    id: z.boolean().optional(),
    email: z.boolean().optional(),
    emailVerified: z.boolean().optional(),
    name: z.boolean().optional(),
    image: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    updatedAt: z.boolean().optional(),
    sessions: z.boolean().optional(),
    accounts: z.boolean().optional(),
    soulChips: z.boolean().optional(),
    skeletons: z.boolean().optional(),
    parts: z.boolean().optional(),
    expansionChips: z.boolean().optional(),
    bots: z.boolean().optional(),
    botStates: z.boolean().optional(),
    botMetrics: z.boolean().optional(),
    collections: z.boolean().optional(),
    items: z.boolean().optional(),
    inventory: z.boolean().optional(),
    slotHistory: z.boolean().optional(),
    tradeHistory: z.boolean().optional(),
  })
  .strict();

export type UserSelect = z.infer<typeof UserSelectSchema>;

/**
 * Schema for including User relations
 */
export const UserIncludeSchema = z
  .object({
    sessions: z.boolean().optional(),
    accounts: z.boolean().optional(),
    soulChips: z.boolean().optional(),
    skeletons: z.boolean().optional(),
    parts: z.boolean().optional(),
    expansionChips: z.boolean().optional(),
    bots: z.boolean().optional(),
    botStates: z.boolean().optional(),
    botMetrics: z.boolean().optional(),
    collections: z.boolean().optional(),
    items: z.boolean().optional(),
    inventory: z.boolean().optional(),
    slotHistory: z.boolean().optional(),
    tradeHistory: z.boolean().optional(),
  })
  .strict();

export type UserInclude = z.infer<typeof UserIncludeSchema>;

// ============================================================================
// PAGINATION SCHEMAS
// ============================================================================

/**
 * Schema for paginated User queries
 */
export const FindManyUsersSchema = z
  .object({
    where: UserWhereSchema.optional(),
    orderBy: z
      .union([UserOrderBySchema, z.array(UserOrderBySchema)])
      .optional(),
    select: UserSelectSchema.optional(),
    include: UserIncludeSchema.optional(),
    skip: z.number().int().min(0).optional(),
    take: z.number().int().min(1).max(1000).optional(),
    cursor: FindUniqueUserSchema.optional(),
  })
  .strict();

export type FindManyUsersInput = z.infer<typeof FindManyUsersSchema>;

// ============================================================================
// AUTHENTICATION SPECIFIC SCHEMAS
// ============================================================================

/**
 * Schema for user login validation
 */
export const LoginUserSchema = z
  .object({
    email: z.email("Invalid email address"),
  })
  .strict();

export type LoginUser = z.infer<typeof LoginUserSchema>;

/**
 * Schema for OAuth user creation/update
 */
export const OAuthUserSchema = z
  .object({
    email: z.email("Invalid email address"),
    name: z
      .string()
      .min(1, "Name cannot be empty")
      .max(100, "Name too long")
      .optional()
      .nullable(),
    image: z.url("Invalid image URL").optional().nullable(),
    emailVerified: z.boolean().optional().default(true), // OAuth users are typically pre-verified
  })
  .strict();

export type OAuthUser = z.infer<typeof OAuthUserSchema>;

/**
 * Schema for email change request
 */
export const ChangeEmailSchema = z
  .object({
    newEmail: z.email("Invalid email address"),
    currentEmail: z.email("Invalid current email address"),
  })
  .strict();

export type ChangeEmail = z.infer<typeof ChangeEmailSchema>;

// ============================================================================
// VALIDATION HELPERS
// ============================================================================

/**
 * Schema for validating user existence
 */
export const ValidateUserExistenceSchema = z
  .object({
    userId: z.string().min(1, "User ID is required"),
  })
  .strict();

export type ValidateUserExistence = z.infer<typeof ValidateUserExistenceSchema>;

/**
 * Schema for email uniqueness validation
 */
export const ValidateEmailUniquenessSchema = z
  .object({
    email: z.email("Invalid email address"),
    excludeUserId: z.string().optional(), // Exclude current user when updating
  })
  .strict();

export type ValidateEmailUniqueness = z.infer<
  typeof ValidateEmailUniquenessSchema
>;

/**
 * Schema for user search
 */
export const SearchUsersSchema = z
  .object({
    query: z
      .string()
      .min(1, "Search query is required")
      .max(100, "Search query too long"),
    emailVerifiedOnly: z.boolean().optional().default(false),
    limit: z.number().int().min(1).max(50).optional().default(10),
  })
  .strict();

export type SearchUsers = z.infer<typeof SearchUsersSchema>;

// ============================================================================
// RESPONSE SCHEMAS
// ============================================================================

/**
 * Schema for User API responses (safe for public consumption)
 */
export const UserResponseSchema = UserSchema.pick({
  id: true,
  email: true,
  emailVerified: true,
  name: true,
  image: true,
  createdAt: true,
});

export type UserResponse = z.infer<typeof UserResponseSchema>;

/**
 * Schema for public user profile (minimal info)
 */
export const UserPublicProfileSchema = UserSchema.pick({
  id: true,
  name: true,
  image: true,
});

export type UserPublicProfile = z.infer<typeof UserPublicProfileSchema>;

/**
 * Schema for User with basic stats
 */
export const UserWithStatsSchema = UserResponseSchema.safeExtend({
  stats: z.object({
    totalBots: z.number().int().min(0),
    totalParts: z.number().int().min(0),
    totalCollections: z.number().int().min(0),
    joinedDaysAgo: z.number().int().min(0),
  }),
});

export type UserWithStats = z.infer<typeof UserWithStatsSchema>;

/**
 * Schema for User with accounts (for admin/auth purposes)
 */
export const UserWithAccountsSchema = UserResponseSchema.safeExtend({
  accounts: z.array(
    z.object({
      id: z.string(),
      providerId: z.string(),
      accountId: z.string(),
      createdAt: z.date(),
    })
  ),
});

export type UserWithAccounts = z.infer<typeof UserWithAccountsSchema>;

// ============================================================================
// ADMIN SCHEMAS
// ============================================================================

/**
 * Schema for admin user management
 */
export const AdminUpdateUserSchema = z
  .object({
    email: z.email("Invalid email address").optional(),
    emailVerified: z.boolean().optional(),
    name: z
      .string()
      .min(1, "Name cannot be empty")
      .max(100, "Name too long")
      .optional()
      .nullable(),
    image: z.url("Invalid image URL").optional().nullable(),
  })
  .strict();

export type AdminUpdateUser = z.infer<typeof AdminUpdateUserSchema>;

/**
 * Schema for user deletion (admin only)
 */
export const DeleteUserSchema = z
  .object({
    userId: z.string().min(1, "User ID is required"),
    reason: z
      .string()
      .min(1, "Deletion reason is required")
      .max(500, "Reason too long")
      .optional(),
  })
  .strict();

export type DeleteUser = z.infer<typeof DeleteUserSchema>;

// ============================================================================
// EXPORTS
// ============================================================================

// All schemas are defined above and exported individually

// Export all validation functions
export const UserValidation = {
  // Base schemas
  model: UserSchema,
  input: UserInputSchema,

  // CRUD schemas
  create: CreateUserSchema,
  createApi: CreateUserApiSchema,
  register: RegisterUserSchema,
  update: UpdateUserSchema,
  updateApi: UpdateUserApiSchema,
  partialUpdate: PartialUpdateUserSchema,
  updateProfile: UpdateUserProfileSchema,
  verifyEmail: VerifyEmailSchema,

  // Query schemas
  findUnique: FindUniqueUserSchema,
  findMany: FindManyUsersSchema,
  where: UserWhereSchema,
  orderBy: UserOrderBySchema,
  select: UserSelectSchema,
  include: UserIncludeSchema,

  // Auth specific
  login: LoginUserSchema,
  oauth: OAuthUserSchema,
  changeEmail: ChangeEmailSchema,

  // Helpers
  existence: ValidateUserExistenceSchema,
  emailUniqueness: ValidateEmailUniquenessSchema,
  search: SearchUsersSchema,

  // Response schemas
  response: UserResponseSchema,
  publicProfile: UserPublicProfileSchema,
  withStats: UserWithStatsSchema,
  withAccounts: UserWithAccountsSchema,

  // Admin schemas
  adminUpdate: AdminUpdateUserSchema,
  delete: DeleteUserSchema,
} as const;
