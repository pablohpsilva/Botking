import { z } from "zod";

// ============================================================================
// BASE SCHEMAS
// ============================================================================

/**
 * Base Session model schema - represents the complete Session entity
 */
export const SessionSchema = z
  .object({
    id: z.string(),
    token: z.string(),
    expiresAt: z.date(),
    userId: z.string(),
    createdAt: z.date(),
    updatedAt: z.date(),
  })
  .strict();

export type Session = z.infer<typeof SessionSchema>;

/**
 * Session input schema for forms and API inputs (without auto-generated fields)
 */
export const SessionInputSchema = z
  .object({
    token: z.string().min(1, "Token is required"),
    expiresAt: z.coerce.date(),
    userId: z.string().min(1, "User ID is required"),
  })
  .strict();

export type SessionInput = z.infer<typeof SessionInputSchema>;

// ============================================================================
// CREATE SCHEMAS
// ============================================================================

/**
 * Schema for creating a new Session
 * Compatible with Prisma SessionCreateInput
 */
export const CreateSessionSchema = z
  .object({
    id: z.string().optional(),
    token: z.string().min(1, "Token is required"),
    expiresAt: z.coerce.date(),
    userId: z.string().min(1, "User ID is required"),
    createdAt: z.coerce.date().optional(),
    updatedAt: z.coerce.date().optional(),
  })
  .strict();

export type CreateSessionInput = z.infer<typeof CreateSessionSchema>;

/**
 * Simplified create schema for API endpoints
 */
export const CreateSessionApiSchema = z
  .object({
    token: z.string().min(1, "Token is required"),
    expiresAt: z.coerce.date(),
    userId: z.string().min(1, "User ID is required"),
  })
  .strict();

export type CreateSessionApi = z.infer<typeof CreateSessionApiSchema>;

/**
 * Schema for session creation with duration
 */
export const CreateSessionWithDurationSchema = z
  .object({
    token: z.string().min(1, "Token is required"),
    userId: z.string().min(1, "User ID is required"),
    durationInSeconds: z
      .number()
      .int()
      .min(60, "Session must last at least 1 minute")
      .max(2592000, "Session cannot last more than 30 days")
      .default(86400), // 24 hours default
  })
  .strict();

export type CreateSessionWithDuration = z.infer<
  typeof CreateSessionWithDurationSchema
>;

// ============================================================================
// UPDATE SCHEMAS
// ============================================================================

/**
 * Schema for updating a Session
 * Compatible with Prisma SessionUpdateInput
 */
export const UpdateSessionSchema = z
  .object({
    id: z.string().optional(),
    token: z.string().min(1, "Token is required").optional(),
    expiresAt: z.coerce.date().optional(),
    userId: z.string().min(1, "User ID is required").optional(),
    createdAt: z.coerce.date().optional(),
    updatedAt: z.coerce.date().optional(),
  })
  .strict();

export type UpdateSessionInput = z.infer<typeof UpdateSessionSchema>;

/**
 * Simplified update schema for API endpoints
 */
export const UpdateSessionApiSchema = z
  .object({
    expiresAt: z.coerce.date().optional(),
  })
  .strict();

export type UpdateSessionApi = z.infer<typeof UpdateSessionApiSchema>;

/**
 * Partial update schema - all fields optional
 */
export const PartialUpdateSessionSchema = SessionInputSchema.partial();
export type PartialUpdateSession = z.infer<typeof PartialUpdateSessionSchema>;

/**
 * Schema for extending session expiration
 */
export const ExtendSessionSchema = z
  .object({
    durationInSeconds: z
      .number()
      .int()
      .min(60, "Extension must be at least 1 minute")
      .max(2592000, "Extension cannot be more than 30 days"),
  })
  .strict();

export type ExtendSession = z.infer<typeof ExtendSessionSchema>;

// ============================================================================
// QUERY SCHEMAS
// ============================================================================

/**
 * Schema for finding a unique Session
 */
export const FindUniqueSessionSchema = z
  .object({
    id: z.string().optional(),
    token: z.string().optional(),
  })
  .strict();

export type FindUniqueSessionInput = z.infer<typeof FindUniqueSessionSchema>;

/**
 * Schema for filtering Sessions
 */
export const SessionWhereSchema: z.ZodType<any> = z.lazy(() =>
  z
    .object({
      id: z.string().optional(),
      token: z.string().optional(),
      expiresAt: z.date().optional(),
      userId: z.string().optional(),
      createdAt: z.date().optional(),
      updatedAt: z.date().optional(),
      AND: z.array(SessionWhereSchema).optional(),
      OR: z.array(SessionWhereSchema).optional(),
      NOT: SessionWhereSchema.optional(),
    })
    .strict()
);

export type SessionWhere = z.infer<typeof SessionWhereSchema>;

/**
 * Schema for ordering Sessions
 */
export const SessionOrderBySchema = z
  .object({
    id: z.enum(["asc", "desc"]).optional(),
    token: z.enum(["asc", "desc"]).optional(),
    expiresAt: z.enum(["asc", "desc"]).optional(),
    userId: z.enum(["asc", "desc"]).optional(),
    createdAt: z.enum(["asc", "desc"]).optional(),
    updatedAt: z.enum(["asc", "desc"]).optional(),
  })
  .strict();

export type SessionOrderBy = z.infer<typeof SessionOrderBySchema>;

/**
 * Schema for selecting Session fields
 */
export const SessionSelectSchema = z
  .object({
    id: z.boolean().optional(),
    token: z.boolean().optional(),
    expiresAt: z.boolean().optional(),
    userId: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    updatedAt: z.boolean().optional(),
    user: z.boolean().optional(),
  })
  .strict();

export type SessionSelect = z.infer<typeof SessionSelectSchema>;

/**
 * Schema for including Session relations
 */
export const SessionIncludeSchema = z
  .object({
    user: z.boolean().optional(),
  })
  .strict();

export type SessionInclude = z.infer<typeof SessionIncludeSchema>;

// ============================================================================
// PAGINATION SCHEMAS
// ============================================================================

/**
 * Schema for paginated Session queries
 */
export const FindManySessionsSchema = z
  .object({
    where: SessionWhereSchema.optional(),
    orderBy: z
      .union([SessionOrderBySchema, z.array(SessionOrderBySchema)])
      .optional(),
    select: SessionSelectSchema.optional(),
    include: SessionIncludeSchema.optional(),
    skip: z.number().int().min(0).optional(),
    take: z.number().int().min(1).max(1000).optional(),
    cursor: FindUniqueSessionSchema.optional(),
  })
  .strict();

export type FindManySessionsInput = z.infer<typeof FindManySessionsSchema>;

// ============================================================================
// SESSION MANAGEMENT SPECIFIC SCHEMAS
// ============================================================================

/**
 * Schema for session validation
 */
export const ValidateSessionSchema = z
  .object({
    token: z.string().min(1, "Token is required"),
  })
  .strict();

export type ValidateSession = z.infer<typeof ValidateSessionSchema>;

/**
 * Schema for session refresh
 */
export const RefreshSessionSchema = z
  .object({
    currentToken: z.string().min(1, "Current token is required"),
    newToken: z.string().min(1, "New token is required"),
    durationInSeconds: z
      .number()
      .int()
      .min(60, "Session must last at least 1 minute")
      .max(2592000, "Session cannot last more than 30 days")
      .optional()
      .default(86400), // 24 hours default
  })
  .strict();

export type RefreshSession = z.infer<typeof RefreshSessionSchema>;

/**
 * Schema for session revocation
 */
export const RevokeSessionSchema = z
  .object({
    token: z.string().min(1, "Token is required"),
    reason: z
      .string()
      .max(200, "Reason too long")
      .optional()
      .default("User logout"),
  })
  .strict();

export type RevokeSession = z.infer<typeof RevokeSessionSchema>;

/**
 * Schema for bulk session operations
 */
export const BulkSessionOperationSchema = z
  .object({
    userId: z.string().min(1, "User ID is required"),
    operation: z.enum(["revoke_all", "revoke_except_current"]),
    currentToken: z.string().optional(), // Required for revoke_except_current
  })
  .strict()
  .refine(
    (data) => {
      if (data.operation === "revoke_except_current") {
        return !!data.currentToken;
      }
      return true;
    },
    {
      message: "Current token is required for revoke_except_current operation",
      path: ["currentToken"],
    }
  );

export type BulkSessionOperation = z.infer<typeof BulkSessionOperationSchema>;

// ============================================================================
// VALIDATION HELPERS
// ============================================================================

/**
 * Schema for checking session expiration
 */
export const CheckSessionExpirationSchema = z
  .object({
    token: z.string().min(1, "Token is required"),
    currentTime: z.coerce
      .date()
      .optional()
      .default(() => new Date()),
  })
  .strict();

export type CheckSessionExpiration = z.infer<
  typeof CheckSessionExpirationSchema
>;

/**
 * Schema for user session count validation
 */
export const ValidateUserSessionCountSchema = z
  .object({
    userId: z.string().min(1, "User ID is required"),
    maxSessions: z.number().int().min(1).max(100).default(10),
  })
  .strict();

export type ValidateUserSessionCount = z.infer<
  typeof ValidateUserSessionCountSchema
>;

/**
 * Schema for session cleanup
 */
export const SessionCleanupSchema = z
  .object({
    olderThan: z.coerce.date(),
    batchSize: z.number().int().min(1).max(10000).default(1000),
  })
  .strict();

export type SessionCleanup = z.infer<typeof SessionCleanupSchema>;

// ============================================================================
// RESPONSE SCHEMAS
// ============================================================================

/**
 * Schema for Session API responses (excludes sensitive token)
 */
export const SessionResponseSchema = SessionSchema.omit({
  token: true,
});

export type SessionResponse = z.infer<typeof SessionResponseSchema>;

/**
 * Schema for Session with User information
 */
export const SessionWithUserSchema = SessionResponseSchema.safeExtend({
  user: z.object({
    id: z.string(),
    email: z.string(),
    name: z.string().nullable(),
    emailVerified: z.boolean(),
  }),
});

export type SessionWithUser = z.infer<typeof SessionWithUserSchema>;

/**
 * Schema for Session info (minimal data for client)
 */
export const SessionInfoSchema = z
  .object({
    id: z.string(),
    expiresAt: z.date(),
    createdAt: z.date(),
    isExpired: z.boolean(),
    timeUntilExpiry: z.number().int(), // seconds
  })
  .strict();

export type SessionInfo = z.infer<typeof SessionInfoSchema>;

/**
 * Schema for active sessions list
 */
export const ActiveSessionsSchema = z
  .object({
    sessions: z.array(
      z.object({
        id: z.string(),
        createdAt: z.date(),
        expiresAt: z.date(),
        isCurrent: z.boolean(),
        userAgent: z.string().optional(),
        ipAddress: z.string().optional(),
      })
    ),
    total: z.number().int().min(0),
  })
  .strict();

export type ActiveSessions = z.infer<typeof ActiveSessionsSchema>;

// ============================================================================
// ADMIN SCHEMAS
// ============================================================================

/**
 * Schema for admin session management
 */
export const AdminSessionManagementSchema = z
  .object({
    userId: z.string().min(1, "User ID is required").optional(),
    action: z.enum([
      "list_all",
      "revoke_user_sessions",
      "revoke_expired",
      "cleanup_old",
    ]),
    olderThanDays: z.number().int().min(1).max(365).optional(),
  })
  .strict();

export type AdminSessionManagement = z.infer<
  typeof AdminSessionManagementSchema
>;

/**
 * Schema for session statistics
 */
export const SessionStatsSchema = z
  .object({
    totalSessions: z.number().int().min(0),
    activeSessions: z.number().int().min(0),
    expiredSessions: z.number().int().min(0),
    averageSessionDuration: z.number().min(0), // in hours
    uniqueUsers: z.number().int().min(0),
  })
  .strict();

export type SessionStats = z.infer<typeof SessionStatsSchema>;

// ============================================================================
// EXPORTS
// ============================================================================

// All schemas are defined above and exported individually

// Export all validation functions
export const SessionValidation = {
  // Base schemas
  model: SessionSchema,
  input: SessionInputSchema,

  // CRUD schemas
  create: CreateSessionSchema,
  createApi: CreateSessionApiSchema,
  createWithDuration: CreateSessionWithDurationSchema,
  update: UpdateSessionSchema,
  updateApi: UpdateSessionApiSchema,
  partialUpdate: PartialUpdateSessionSchema,
  extend: ExtendSessionSchema,

  // Query schemas
  findUnique: FindUniqueSessionSchema,
  findMany: FindManySessionsSchema,
  where: SessionWhereSchema,
  orderBy: SessionOrderBySchema,
  select: SessionSelectSchema,
  include: SessionIncludeSchema,

  // Session management
  validate: ValidateSessionSchema,
  refresh: RefreshSessionSchema,
  revoke: RevokeSessionSchema,
  bulkOperation: BulkSessionOperationSchema,

  // Helpers
  checkExpiration: CheckSessionExpirationSchema,
  validateUserSessionCount: ValidateUserSessionCountSchema,
  cleanup: SessionCleanupSchema,

  // Response schemas
  response: SessionResponseSchema,
  withUser: SessionWithUserSchema,
  info: SessionInfoSchema,
  activeSessions: ActiveSessionsSchema,

  // Admin schemas
  adminManagement: AdminSessionManagementSchema,
  stats: SessionStatsSchema,
} as const;
