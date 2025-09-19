import { z } from "zod";

// ============================================================================
// BASE SCHEMAS
// ============================================================================

/**
 * Base Verification model schema - represents the complete Verification entity
 */
export const VerificationSchema = z
  .object({
    id: z.string(),
    identifier: z.string(),
    value: z.string(),
    expiresAt: z.date(),
    createdAt: z.date(),
    updatedAt: z.date(),
  })
  .strict();

export type Verification = z.infer<typeof VerificationSchema>;

/**
 * Verification input schema for forms and API inputs (without auto-generated fields)
 */
export const VerificationInputSchema = z
  .object({
    identifier: z.string().min(1, "Identifier is required"),
    value: z.string().min(1, "Verification value is required"),
    expiresAt: z.coerce.date(),
  })
  .strict();

export type VerificationInput = z.infer<typeof VerificationInputSchema>;

// ============================================================================
// CREATE SCHEMAS
// ============================================================================

/**
 * Schema for creating a new Verification
 * Compatible with Prisma VerificationCreateInput
 */
export const CreateVerificationSchema = z
  .object({
    id: z.string().optional(),
    identifier: z.string().min(1, "Identifier is required"),
    value: z.string().min(1, "Verification value is required"),
    expiresAt: z.coerce.date(),
    createdAt: z.coerce.date().optional(),
    updatedAt: z.coerce.date().optional(),
  })
  .strict();

export type CreateVerificationInput = z.infer<typeof CreateVerificationSchema>;

/**
 * Simplified create schema for API endpoints
 */
export const CreateVerificationApiSchema = z
  .object({
    identifier: z.string().min(1, "Identifier is required"),
    value: z.string().min(1, "Verification value is required"),
    expiresAt: z.coerce.date(),
  })
  .strict();

export type CreateVerificationApi = z.infer<typeof CreateVerificationApiSchema>;

/**
 * Schema for creating email verification
 */
export const CreateEmailVerificationSchema = z
  .object({
    email: z.email("Invalid email address"),
    code: z
      .string()
      .length(6, "Verification code must be 6 digits")
      .regex(/^\d{6}$/, "Verification code must contain only digits"),
    expiresInMinutes: z
      .number()
      .int()
      .min(1, "Expiration must be at least 1 minute")
      .max(1440, "Expiration cannot exceed 24 hours")
      .default(15), // 15 minutes default
  })
  .strict();

export type CreateEmailVerification = z.infer<
  typeof CreateEmailVerificationSchema
>;

/**
 * Schema for creating password reset verification
 */
export const CreatePasswordResetSchema = z
  .object({
    email: z.email("Invalid email address"),
    token: z
      .string()
      .min(32, "Reset token must be at least 32 characters")
      .max(128, "Reset token too long"),
    expiresInMinutes: z
      .number()
      .int()
      .min(1, "Expiration must be at least 1 minute")
      .max(1440, "Expiration cannot exceed 24 hours")
      .default(60), // 1 hour default
  })
  .strict();

export type CreatePasswordReset = z.infer<typeof CreatePasswordResetSchema>;

/**
 * Schema for creating generic verification with duration
 */
export const CreateVerificationWithDurationSchema = z
  .object({
    identifier: z.string().min(1, "Identifier is required"),
    value: z.string().min(1, "Verification value is required"),
    durationInMinutes: z
      .number()
      .int()
      .min(1, "Duration must be at least 1 minute")
      .max(10080, "Duration cannot exceed 7 days")
      .default(15), // 15 minutes default
  })
  .strict();

export type CreateVerificationWithDuration = z.infer<
  typeof CreateVerificationWithDurationSchema
>;

// ============================================================================
// UPDATE SCHEMAS
// ============================================================================

/**
 * Schema for updating a Verification
 * Compatible with Prisma VerificationUpdateInput
 */
export const UpdateVerificationSchema = z
  .object({
    id: z.string().optional(),
    identifier: z.string().min(1, "Identifier is required").optional(),
    value: z.string().min(1, "Verification value is required").optional(),
    expiresAt: z.coerce.date().optional(),
    createdAt: z.coerce.date().optional(),
    updatedAt: z.coerce.date().optional(),
  })
  .strict();

export type UpdateVerificationInput = z.infer<typeof UpdateVerificationSchema>;

/**
 * Simplified update schema for API endpoints
 */
export const UpdateVerificationApiSchema = z
  .object({
    expiresAt: z.coerce.date().optional(),
  })
  .strict();

export type UpdateVerificationApi = z.infer<typeof UpdateVerificationApiSchema>;

/**
 * Partial update schema - all fields optional
 */
export const PartialUpdateVerificationSchema =
  VerificationInputSchema.partial();
export type PartialUpdateVerification = z.infer<
  typeof PartialUpdateVerificationSchema
>;

/**
 * Schema for extending verification expiration
 */
export const ExtendVerificationSchema = z
  .object({
    durationInMinutes: z
      .number()
      .int()
      .min(1, "Extension must be at least 1 minute")
      .max(1440, "Extension cannot exceed 24 hours"),
  })
  .strict();

export type ExtendVerification = z.infer<typeof ExtendVerificationSchema>;

// ============================================================================
// QUERY SCHEMAS
// ============================================================================

/**
 * Schema for finding a unique Verification
 */
export const FindUniqueVerificationSchema = z
  .object({
    id: z.string().optional(),
    identifier_value: z
      .object({
        identifier: z.string(),
        value: z.string(),
      })
      .optional(),
  })
  .strict();

export type FindUniqueVerificationInput = z.infer<
  typeof FindUniqueVerificationSchema
>;

/**
 * Schema for filtering Verifications
 */
export const VerificationWhereSchema: z.ZodType<any> = z.lazy(() =>
  z
    .object({
      id: z.string().optional(),
      identifier: z.string().optional(),
      value: z.string().optional(),
      expiresAt: z.date().optional(),
      createdAt: z.date().optional(),
      updatedAt: z.date().optional(),
      AND: z.array(VerificationWhereSchema).optional(),
      OR: z.array(VerificationWhereSchema).optional(),
      NOT: VerificationWhereSchema.optional(),
    })
    .strict()
);

export type VerificationWhere = z.infer<typeof VerificationWhereSchema>;

/**
 * Schema for ordering Verifications
 */
export const VerificationOrderBySchema = z
  .object({
    id: z.enum(["asc", "desc"]).optional(),
    identifier: z.enum(["asc", "desc"]).optional(),
    value: z.enum(["asc", "desc"]).optional(),
    expiresAt: z.enum(["asc", "desc"]).optional(),
    createdAt: z.enum(["asc", "desc"]).optional(),
    updatedAt: z.enum(["asc", "desc"]).optional(),
  })
  .strict();

export type VerificationOrderBy = z.infer<typeof VerificationOrderBySchema>;

/**
 * Schema for selecting Verification fields
 */
export const VerificationSelectSchema = z
  .object({
    id: z.boolean().optional(),
    identifier: z.boolean().optional(),
    value: z.boolean().optional(),
    expiresAt: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    updatedAt: z.boolean().optional(),
  })
  .strict();

export type VerificationSelect = z.infer<typeof VerificationSelectSchema>;

// ============================================================================
// PAGINATION SCHEMAS
// ============================================================================

/**
 * Schema for paginated Verification queries
 */
export const FindManyVerificationsSchema = z
  .object({
    where: VerificationWhereSchema.optional(),
    orderBy: z
      .union([VerificationOrderBySchema, z.array(VerificationOrderBySchema)])
      .optional(),
    select: VerificationSelectSchema.optional(),
    skip: z.number().int().min(0).optional(),
    take: z.number().int().min(1).max(1000).optional(),
    cursor: FindUniqueVerificationSchema.optional(),
  })
  .strict();

export type FindManyVerificationsInput = z.infer<
  typeof FindManyVerificationsSchema
>;

// ============================================================================
// VERIFICATION SPECIFIC SCHEMAS
// ============================================================================

/**
 * Schema for verifying a code/token
 */
export const VerifyCodeSchema = z
  .object({
    identifier: z.string().min(1, "Identifier is required"),
    value: z.string().min(1, "Verification value is required"),
  })
  .strict();

export type VerifyCode = z.infer<typeof VerifyCodeSchema>;

/**
 * Schema for email verification
 */
export const VerifyEmailCodeSchema = z
  .object({
    email: z.email("Invalid email address"),
    code: z
      .string()
      .length(6, "Verification code must be 6 digits")
      .regex(/^\d{6}$/, "Verification code must contain only digits"),
  })
  .strict();

export type VerifyEmailCode = z.infer<typeof VerifyEmailCodeSchema>;

/**
 * Schema for password reset verification
 */
export const VerifyPasswordResetSchema = z
  .object({
    email: z.email("Invalid email address"),
    token: z.string().min(1, "Reset token is required"),
  })
  .strict();

export type VerifyPasswordReset = z.infer<typeof VerifyPasswordResetSchema>;

/**
 * Schema for resending verification
 */
export const ResendVerificationSchema = z
  .object({
    identifier: z.string().min(1, "Identifier is required"),
    type: z.enum(["email_verification", "password_reset", "generic"]),
    expiresInMinutes: z
      .number()
      .int()
      .min(1, "Expiration must be at least 1 minute")
      .max(1440, "Expiration cannot exceed 24 hours")
      .optional(),
  })
  .strict();

export type ResendVerification = z.infer<typeof ResendVerificationSchema>;

// ============================================================================
// VALIDATION HELPERS
// ============================================================================

/**
 * Schema for checking verification expiration
 */
export const CheckVerificationExpirationSchema = z
  .object({
    identifier: z.string().min(1, "Identifier is required"),
    value: z.string().min(1, "Verification value is required"),
    currentTime: z.coerce
      .date()
      .optional()
      .default(() => new Date()),
  })
  .strict();

export type CheckVerificationExpiration = z.infer<
  typeof CheckVerificationExpirationSchema
>;

/**
 * Schema for verification cleanup
 */
export const VerificationCleanupSchema = z
  .object({
    olderThan: z.coerce.date(),
    batchSize: z.number().int().min(1).max(10000).default(1000),
    identifierPattern: z.string().optional(), // Optional pattern to match identifiers
  })
  .strict();

export type VerificationCleanup = z.infer<typeof VerificationCleanupSchema>;

/**
 * Schema for rate limiting verification requests
 */
export const VerificationRateLimitSchema = z
  .object({
    identifier: z.string().min(1, "Identifier is required"),
    maxAttempts: z.number().int().min(1).max(100).default(5),
    windowInMinutes: z.number().int().min(1).max(1440).default(60), // 1 hour window
  })
  .strict();

export type VerificationRateLimit = z.infer<typeof VerificationRateLimitSchema>;

/**
 * Schema for generating verification codes
 */
export const GenerateVerificationCodeSchema = z
  .object({
    type: z.enum(["numeric", "alphanumeric", "token"]),
    length: z.number().int().min(4).max(128).default(6),
    uppercase: z.boolean().default(false),
    excludeSimilar: z.boolean().default(true), // Exclude 0, O, 1, I, l
  })
  .strict();

export type GenerateVerificationCode = z.infer<
  typeof GenerateVerificationCodeSchema
>;

// ============================================================================
// RESPONSE SCHEMAS
// ============================================================================

/**
 * Schema for Verification API responses (excludes sensitive value)
 */
export const VerificationResponseSchema = VerificationSchema.omit({
  value: true,
});

export type VerificationResponse = z.infer<typeof VerificationResponseSchema>;

/**
 * Schema for verification status
 */
export const VerificationStatusSchema = z
  .object({
    id: z.string(),
    identifier: z.string(),
    expiresAt: z.date(),
    isExpired: z.boolean(),
    timeUntilExpiry: z.number().int(), // seconds
    attemptsRemaining: z.number().int().min(0).optional(),
  })
  .strict();

export type VerificationStatus = z.infer<typeof VerificationStatusSchema>;

/**
 * Schema for verification result
 */
export const VerificationResultSchema = z
  .object({
    success: z.boolean(),
    message: z.string(),
    identifier: z.string().optional(),
    expiresAt: z.date().optional(),
    attemptsRemaining: z.number().int().min(0).optional(),
  })
  .strict();

export type VerificationResult = z.infer<typeof VerificationResultSchema>;

/**
 * Schema for verification statistics
 */
export const VerificationStatsSchema = z
  .object({
    totalVerifications: z.number().int().min(0),
    activeVerifications: z.number().int().min(0),
    expiredVerifications: z.number().int().min(0),
    verificationsByType: z.record(z.string(), z.number().int().min(0)),
    successRate: z.number().min(0).max(1), // 0-1 percentage
    averageVerificationTime: z.number().min(0), // in minutes
  })
  .strict();

export type VerificationStats = z.infer<typeof VerificationStatsSchema>;

// ============================================================================
// ADMIN SCHEMAS
// ============================================================================

/**
 * Schema for admin verification management
 */
export const AdminVerificationManagementSchema = z
  .object({
    action: z.enum([
      "list_all",
      "cleanup_expired",
      "revoke_by_identifier",
      "extend_expiration",
      "force_verify",
    ]),
    identifier: z.string().optional(),
    olderThanHours: z.number().int().min(1).max(8760).optional(), // Up to 1 year
    batchSize: z.number().int().min(1).max(10000).optional(),
  })
  .strict();

export type AdminVerificationManagement = z.infer<
  typeof AdminVerificationManagementSchema
>;

/**
 * Schema for verification audit log
 */
export const VerificationAuditSchema = z
  .object({
    verificationId: z.string(),
    action: z.enum([
      "created",
      "verified",
      "expired",
      "revoked",
      "extended",
      "failed_attempt",
    ]),
    identifier: z.string(),
    timestamp: z.date(),
    ipAddress: z.string().optional(),
    userAgent: z.string().optional(),
    metadata: z.record(z.string(), z.unknown()).optional(),
  })
  .strict();

export type VerificationAudit = z.infer<typeof VerificationAuditSchema>;

// ============================================================================
// EXPORTS
// ============================================================================

// All schemas are defined above and exported individually

// Export all validation functions
export const VerificationValidation = {
  // Base schemas
  model: VerificationSchema,
  input: VerificationInputSchema,

  // CRUD schemas
  create: CreateVerificationSchema,
  createApi: CreateVerificationApiSchema,
  createEmail: CreateEmailVerificationSchema,
  createPasswordReset: CreatePasswordResetSchema,
  createWithDuration: CreateVerificationWithDurationSchema,
  update: UpdateVerificationSchema,
  updateApi: UpdateVerificationApiSchema,
  partialUpdate: PartialUpdateVerificationSchema,
  extend: ExtendVerificationSchema,

  // Query schemas
  findUnique: FindUniqueVerificationSchema,
  findMany: FindManyVerificationsSchema,
  where: VerificationWhereSchema,
  orderBy: VerificationOrderBySchema,
  select: VerificationSelectSchema,

  // Verification operations
  verify: VerifyCodeSchema,
  verifyEmail: VerifyEmailCodeSchema,
  verifyPasswordReset: VerifyPasswordResetSchema,
  resend: ResendVerificationSchema,

  // Helpers
  checkExpiration: CheckVerificationExpirationSchema,
  cleanup: VerificationCleanupSchema,
  rateLimit: VerificationRateLimitSchema,
  generateCode: GenerateVerificationCodeSchema,

  // Response schemas
  response: VerificationResponseSchema,
  status: VerificationStatusSchema,
  result: VerificationResultSchema,
  stats: VerificationStatsSchema,

  // Admin schemas
  adminManagement: AdminVerificationManagementSchema,
  audit: VerificationAuditSchema,
} as const;
