import { z } from "zod";

// ============================================================================
// BASE SCHEMAS
// ============================================================================

/**
 * Base Account model schema - represents the complete Account entity
 */
export const AccountSchema = z
  .object({
    id: z.string(),
    userId: z.string(),
    providerId: z.string(),
    accountId: z.string(),
    password: z.string().nullable(),
    accessToken: z.string().nullable(),
    refreshToken: z.string().nullable(),
    idToken: z.string().nullable(),
    accessTokenExpiresAt: z.date().nullable(),
    refreshTokenExpiresAt: z.date().nullable(),
    createdAt: z.date(),
    updatedAt: z.date(),
  })
  .strict();

export type Account = z.infer<typeof AccountSchema>;

/**
 * Account input schema for forms and API inputs (without auto-generated fields)
 */
export const AccountInputSchema = z
  .object({
    userId: z.string().min(1, "User ID is required"),
    providerId: z.string().min(1, "Provider ID is required"),
    accountId: z.string().min(1, "Account ID is required"),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .optional()
      .nullable(),
    accessToken: z.string().optional().nullable(),
    refreshToken: z.string().optional().nullable(),
    idToken: z.string().optional().nullable(),
    accessTokenExpiresAt: z.coerce.date().optional().nullable(),
    refreshTokenExpiresAt: z.coerce.date().optional().nullable(),
  })
  .strict();

export type AccountInput = z.infer<typeof AccountInputSchema>;

// ============================================================================
// CREATE SCHEMAS
// ============================================================================

/**
 * Schema for creating a new Account
 * Compatible with Prisma AccountCreateInput
 */
export const CreateAccountSchema = z
  .object({
    id: z.string().optional(),
    userId: z.string(),
    providerId: z.string(),
    accountId: z.string(),
    password: z.string().optional().nullable(),
    accessToken: z.string().optional().nullable(),
    refreshToken: z.string().optional().nullable(),
    idToken: z.string().optional().nullable(),
    accessTokenExpiresAt: z.coerce.date().optional().nullable(),
    refreshTokenExpiresAt: z.coerce.date().optional().nullable(),
    createdAt: z.coerce.date().optional(),
    updatedAt: z.coerce.date().optional(),
  })
  .strict();

export type CreateAccountInput = z.infer<typeof CreateAccountSchema>;

/**
 * Simplified create schema for API endpoints
 */
export const CreateAccountApiSchema = z
  .object({
    userId: z.string().min(1, "User ID is required"),
    providerId: z.string().min(1, "Provider ID is required"),
    accountId: z.string().min(1, "Account ID is required"),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .optional()
      .nullable(),
    accessToken: z.string().optional().nullable(),
    refreshToken: z.string().optional().nullable(),
    idToken: z.string().optional().nullable(),
    accessTokenExpiresAt: z.coerce.date().optional().nullable(),
    refreshTokenExpiresAt: z.coerce.date().optional().nullable(),
  })
  .strict();

export type CreateAccountApi = z.infer<typeof CreateAccountApiSchema>;

// ============================================================================
// UPDATE SCHEMAS
// ============================================================================

/**
 * Schema for updating an Account
 * Compatible with Prisma AccountUpdateInput
 */
export const UpdateAccountSchema = z
  .object({
    id: z.string().optional(),
    userId: z.string().optional(),
    providerId: z.string().optional(),
    accountId: z.string().optional(),
    password: z.string().optional().nullable(),
    accessToken: z.string().optional().nullable(),
    refreshToken: z.string().optional().nullable(),
    idToken: z.string().optional().nullable(),
    accessTokenExpiresAt: z.coerce.date().optional().nullable(),
    refreshTokenExpiresAt: z.coerce.date().optional().nullable(),
    createdAt: z.coerce.date().optional(),
    updatedAt: z.coerce.date().optional(),
  })
  .strict();

export type UpdateAccountInput = z.infer<typeof UpdateAccountSchema>;

/**
 * Simplified update schema for API endpoints
 */
export const UpdateAccountApiSchema = z
  .object({
    providerId: z.string().min(1, "Provider ID is required").optional(),
    accountId: z.string().min(1, "Account ID is required").optional(),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .optional()
      .nullable(),
    accessToken: z.string().optional().nullable(),
    refreshToken: z.string().optional().nullable(),
    idToken: z.string().optional().nullable(),
    accessTokenExpiresAt: z.coerce.date().optional().nullable(),
    refreshTokenExpiresAt: z.coerce.date().optional().nullable(),
  })
  .strict();

export type UpdateAccountApi = z.infer<typeof UpdateAccountApiSchema>;

/**
 * Partial update schema - all fields optional
 */
export const PartialUpdateAccountSchema = AccountInputSchema.partial();
export type PartialUpdateAccount = z.infer<typeof PartialUpdateAccountSchema>;

// ============================================================================
// QUERY SCHEMAS
// ============================================================================

/**
 * Schema for finding a unique Account
 */
export const FindUniqueAccountSchema = z
  .object({
    id: z.string().optional(),
    providerId_accountId: z
      .object({
        providerId: z.string(),
        accountId: z.string(),
      })
      .optional(),
  })
  .strict();

export type FindUniqueAccountInput = z.infer<typeof FindUniqueAccountSchema>;

/**
 * Schema for filtering Accounts
 */
export const AccountWhereSchema: z.ZodType<any> = z.lazy(() =>
  z
    .object({
      id: z.string().optional(),
      userId: z.string().optional(),
      providerId: z.string().optional(),
      accountId: z.string().optional(),
      password: z.string().nullable().optional(),
      accessToken: z.string().nullable().optional(),
      refreshToken: z.string().nullable().optional(),
      idToken: z.string().nullable().optional(),
      accessTokenExpiresAt: z.date().nullable().optional(),
      refreshTokenExpiresAt: z.date().nullable().optional(),
      createdAt: z.date().optional(),
      updatedAt: z.date().optional(),
      AND: z.array(AccountWhereSchema).optional(),
      OR: z.array(AccountWhereSchema).optional(),
      NOT: AccountWhereSchema.optional(),
    })
    .strict()
);

export type AccountWhere = z.infer<typeof AccountWhereSchema>;

/**
 * Schema for ordering Accounts
 */
export const AccountOrderBySchema = z
  .object({
    id: z.enum(["asc", "desc"]).optional(),
    userId: z.enum(["asc", "desc"]).optional(),
    providerId: z.enum(["asc", "desc"]).optional(),
    accountId: z.enum(["asc", "desc"]).optional(),
    createdAt: z.enum(["asc", "desc"]).optional(),
    updatedAt: z.enum(["asc", "desc"]).optional(),
  })
  .strict();

export type AccountOrderBy = z.infer<typeof AccountOrderBySchema>;

/**
 * Schema for selecting Account fields
 */
export const AccountSelectSchema = z
  .object({
    id: z.boolean().optional(),
    userId: z.boolean().optional(),
    providerId: z.boolean().optional(),
    accountId: z.boolean().optional(),
    password: z.boolean().optional(),
    accessToken: z.boolean().optional(),
    refreshToken: z.boolean().optional(),
    idToken: z.boolean().optional(),
    accessTokenExpiresAt: z.boolean().optional(),
    refreshTokenExpiresAt: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    updatedAt: z.boolean().optional(),
    user: z.boolean().optional(),
  })
  .strict();

export type AccountSelect = z.infer<typeof AccountSelectSchema>;

/**
 * Schema for including Account relations
 */
export const AccountIncludeSchema = z
  .object({
    user: z.boolean().optional(),
  })
  .strict();

export type AccountInclude = z.infer<typeof AccountIncludeSchema>;

// ============================================================================
// PAGINATION SCHEMAS
// ============================================================================

/**
 * Schema for paginated Account queries
 */
export const FindManyAccountsSchema = z
  .object({
    where: AccountWhereSchema.optional(),
    orderBy: z
      .union([AccountOrderBySchema, z.array(AccountOrderBySchema)])
      .optional(),
    select: AccountSelectSchema.optional(),
    include: AccountIncludeSchema.optional(),
    skip: z.number().int().min(0).optional(),
    take: z.number().int().min(1).max(1000).optional(),
    cursor: FindUniqueAccountSchema.optional(),
  })
  .strict();

export type FindManyAccountsInput = z.infer<typeof FindManyAccountsSchema>;

// ============================================================================
// AUTHENTICATION SPECIFIC SCHEMAS
// ============================================================================

/**
 * Schema for OAuth account creation
 */
export const CreateOAuthAccountSchema = z
  .object({
    userId: z.string().min(1, "User ID is required"),
    providerId: z.string().min(1, "Provider ID is required"),
    accountId: z.string().min(1, "Account ID is required"),
    accessToken: z.string().min(1, "Access token is required"),
    refreshToken: z.string().optional().nullable(),
    idToken: z.string().optional().nullable(),
    accessTokenExpiresAt: z.coerce.date().optional().nullable(),
    refreshTokenExpiresAt: z.coerce.date().optional().nullable(),
  })
  .strict();

export type CreateOAuthAccount = z.infer<typeof CreateOAuthAccountSchema>;

/**
 * Schema for password account creation
 */
export const CreatePasswordAccountSchema = z
  .object({
    userId: z.string().min(1, "User ID is required"),
    providerId: z.literal("password"),
    accountId: z.string().min(1, "Account ID is required"),
    password: z.string().min(6, "Password must be at least 6 characters"),
  })
  .strict();

export type CreatePasswordAccount = z.infer<typeof CreatePasswordAccountSchema>;

/**
 * Schema for updating OAuth tokens
 */
export const UpdateTokensSchema = z
  .object({
    accessToken: z.string().min(1, "Access token is required"),
    refreshToken: z.string().optional().nullable(),
    idToken: z.string().optional().nullable(),
    accessTokenExpiresAt: z.coerce.date().optional().nullable(),
    refreshTokenExpiresAt: z.coerce.date().optional().nullable(),
  })
  .strict();

export type UpdateTokens = z.infer<typeof UpdateTokensSchema>;

/**
 * Schema for password updates
 */
export const UpdatePasswordSchema = z
  .object({
    password: z.string().min(6, "Password must be at least 6 characters"),
  })
  .strict();

export type UpdatePassword = z.infer<typeof UpdatePasswordSchema>;

// ============================================================================
// VALIDATION HELPERS
// ============================================================================

/**
 * Validates if an account belongs to a specific user
 */
export const ValidateAccountOwnershipSchema = z
  .object({
    accountId: z.string().min(1, "Account ID is required"),
    userId: z.string().min(1, "User ID is required"),
  })
  .strict();

export type ValidateAccountOwnership = z.infer<
  typeof ValidateAccountOwnershipSchema
>;

/**
 * Schema for account provider validation
 */
export const AccountProviderSchema = z
  .object({
    providerId: z.string().min(1, "Provider ID is required"),
    accountId: z.string().min(1, "Account ID is required"),
  })
  .strict();

export type AccountProvider = z.infer<typeof AccountProviderSchema>;

// ============================================================================
// RESPONSE SCHEMAS
// ============================================================================

/**
 * Schema for Account API responses (excludes sensitive fields)
 */
export const AccountResponseSchema = AccountSchema.omit({
  password: true,
  accessToken: true,
  refreshToken: true,
  idToken: true,
});

export type AccountResponse = z.infer<typeof AccountResponseSchema>;

/**
 * Schema for Account with User relation
 */
export const AccountWithUserSchema = AccountResponseSchema.safeExtend({
  user: z.object({
    id: z.string(),
    email: z.string(),
    name: z.string().nullable(),
    image: z.string().nullable(),
  }),
});

export type AccountWithUser = z.infer<typeof AccountWithUserSchema>;

// ============================================================================
// EXPORTS
// ============================================================================

// All schemas are defined above and exported individually

// Export all validation functions
export const AccountValidation = {
  // Base schemas
  model: AccountSchema,
  input: AccountInputSchema,

  // CRUD schemas
  create: CreateAccountSchema,
  createApi: CreateAccountApiSchema,
  update: UpdateAccountSchema,
  updateApi: UpdateAccountApiSchema,
  partialUpdate: PartialUpdateAccountSchema,

  // Query schemas
  findUnique: FindUniqueAccountSchema,
  findMany: FindManyAccountsSchema,
  where: AccountWhereSchema,
  orderBy: AccountOrderBySchema,
  select: AccountSelectSchema,
  include: AccountIncludeSchema,

  // Auth specific
  createOAuth: CreateOAuthAccountSchema,
  createPassword: CreatePasswordAccountSchema,
  updateTokens: UpdateTokensSchema,
  updatePassword: UpdatePasswordSchema,

  // Helpers
  ownership: ValidateAccountOwnershipSchema,
  provider: AccountProviderSchema,

  // Response schemas
  response: AccountResponseSchema,
  withUser: AccountWithUserSchema,
} as const;
