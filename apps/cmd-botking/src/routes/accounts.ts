/**
 * Account Management Routes
 * Demonstrates production usage of @botking/dto Account package
 */

import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { LoggerFactory } from "@botking/logger";
import { AccountRepository, AccountService } from "@botking/dto";
import { CreateAccountSchema, UpdateAccountSchema } from "@botking/db";
import { dtoService } from "../services/dto-service";

// Type declaration for Hono context to fix requestId typing
declare module "hono" {
  interface ContextVariableMap {
    requestId: string;
  }
}

const logger = LoggerFactory.createPackageLogger("cmd-botking", {
  service: "account-routes",
});

const accountRoutes = new Hono();

// Validation schemas for API
const querySchema = z.object({
  page: z
    .string()
    .transform(Number)
    .pipe(z.number().min(1))
    .optional()
    .default(1),
  limit: z
    .string()
    .transform(Number)
    .pipe(z.number().min(1).max(100))
    .optional()
    .default(20),
  userId: z.string().uuid().optional(),
  providerId: z.string().optional(),
  tokenType: z.enum(["access", "refresh"]).optional(),
  expired: z
    .string()
    .transform((val) => val === "true")
    .optional(),
});

const createAccountRequestSchema = CreateAccountSchema;
const updateAccountRequestSchema = UpdateAccountSchema;

const updateTokensSchema = z.object({
  accessToken: z.string().optional(),
  refreshToken: z.string().optional(),
  idToken: z.string().optional(),
  accessTokenExpiresAt: z
    .string()
    .datetime()
    .transform((date) => new Date(date))
    .optional(),
  refreshTokenExpiresAt: z
    .string()
    .datetime()
    .transform((date) => new Date(date))
    .optional(),
});

const createOAuthAccountSchema = z.object({
  userId: z.string().uuid(),
  providerId: z.string().min(1),
  accountId: z.string().min(1),
  accessToken: z.string().optional(),
  refreshToken: z.string().optional(),
  idToken: z.string().optional(),
  accessTokenExpiresAt: z
    .string()
    .datetime()
    .transform((date) => new Date(date))
    .optional(),
  refreshTokenExpiresAt: z
    .string()
    .datetime()
    .transform((date) => new Date(date))
    .optional(),
});

const createCredentialAccountSchema = z.object({
  userId: z.string().uuid(),
  accountId: z.string().min(1),
  password: z.string().min(1),
});

// Get account repository and service
async function getAccountService(): Promise<AccountService> {
  await dtoService.initialize();
  const prismaClient = dtoService.getPrismaClient();
  const accountRepository = new AccountRepository(prismaClient);
  return new AccountService(accountRepository);
}

/**
 * GET /api/v1/accounts
 * List accounts with pagination and filtering
 */
accountRoutes.get("/", zValidator("query", querySchema), async (c) => {
  const requestId = c.get("requestId");
  const query = c.req.valid("query");

  try {
    logger.info("Listing accounts", { requestId, query });

    await dtoService.initialize();
    const prismaClient = dtoService.getPrismaClient();
    const accountRepository = new AccountRepository(prismaClient);

    // Build where clause based on filters
    const where: any = {};
    if (query.userId) where.userId = query.userId;
    if (query.providerId) where.providerId = query.providerId;

    // Handle expired token filter
    if (query.expired !== undefined && query.tokenType) {
      const now = new Date();
      const tokenField =
        query.tokenType === "access"
          ? "accessTokenExpiresAt"
          : "refreshTokenExpiresAt";

      if (query.expired) {
        where[tokenField] = { lte: now };
      } else {
        where[tokenField] = { gt: now };
      }
    }

    const skip = (query.page - 1) * query.limit;
    const [accounts, total] = await Promise.all([
      accountRepository.findMany({
        where,
        take: query.limit,
        skip,
        orderBy: { createdAt: "desc" },
      }),
      accountRepository.count(where),
    ]);

    const totalPages = Math.ceil(total / query.limit);

    logger.info("Accounts listed successfully", {
      requestId,
      count: accounts.length,
      total,
      page: query.page,
      totalPages,
    });

    return c.json({
      success: true,
      data: {
        accounts,
        pagination: {
          page: query.page,
          limit: query.limit,
          total,
          totalPages,
        },
      },
      requestId,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    logger.error("Error listing accounts", { error, requestId });
    return c.json(
      {
        success: false,
        error: {
          message: "Internal server error",
          details: error instanceof Error ? error.message : "Unknown error",
        },
        requestId,
      },
      500
    );
  }
});

/**
 * GET /api/v1/accounts/:id
 * Get account by ID with validation
 */
accountRoutes.get("/:id", async (c) => {
  const requestId = c.get("requestId");
  const accountId = c.req.param("id");

  try {
    logger.info("Getting account by ID", { requestId, accountId });

    const accountService = await getAccountService();
    const result = await accountService.getAccountById(accountId);

    if (!result.success) {
      const status = result.errors.includes("Account not found") ? 404 : 500;
      logger.warn("Failed to get account", {
        requestId,
        accountId,
        errors: result.errors,
      });

      return c.json(
        {
          success: false,
          error: {
            message: result.errors.includes("Account not found")
              ? "Account not found"
              : "Failed to retrieve account",
            details: result.errors,
          },
          requestId,
        },
        status
      );
    }

    logger.info("Account retrieved successfully", {
      requestId,
      accountId,
      providerId: result.account?.providerId,
      validationLevel: result.validation?.summary.validationLevel,
    });

    return c.json({
      success: true,
      data: {
        account: result.account,
        validation: result.validation,
      },
      requestId,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    logger.error("Error getting account", { error, requestId, accountId });
    return c.json(
      {
        success: false,
        error: {
          message: "Internal server error",
          details: error instanceof Error ? error.message : "Unknown error",
        },
        requestId,
      },
      500
    );
  }
});

/**
 * GET /api/v1/accounts/user/:userId
 * Get user's accounts with summary
 */
accountRoutes.get("/user/:userId", async (c) => {
  const requestId = c.get("requestId");
  const userId = c.req.param("userId");

  try {
    logger.info("Getting user accounts", { requestId, userId });

    const accountService = await getAccountService();
    const result = await accountService.getUserAccounts(userId);

    if (!result.success) {
      logger.warn("Failed to get user accounts", {
        requestId,
        userId,
        errors: result.errors,
      });
      return c.json(
        {
          success: false,
          error: {
            message: "Failed to retrieve user accounts",
            details: result.errors,
          },
          requestId,
        },
        500
      );
    }

    logger.info("User accounts retrieved successfully", {
      requestId,
      userId,
      accountCount: result.accounts?.length || 0,
      summary: result.summary,
    });

    return c.json({
      success: true,
      data: {
        accounts: result.accounts,
        summary: result.summary,
      },
      requestId,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    logger.error("Error getting user accounts", { error, requestId, userId });
    return c.json(
      {
        success: false,
        error: {
          message: "Internal server error",
          details: error instanceof Error ? error.message : "Unknown error",
        },
        requestId,
      },
      500
    );
  }
});

/**
 * POST /api/v1/accounts
 * Create new account
 */
accountRoutes.post(
  "/",
  zValidator("json", createAccountRequestSchema),
  async (c) => {
    const requestId = c.get("requestId");
    const body = c.req.valid("json");

    try {
      logger.info("Creating account", {
        requestId,
        userId: body.userId,
        providerId: body.providerId,
      });

      const accountService = await getAccountService();
      const result = await accountService.createAccount(body);

      if (!result.success) {
        logger.warn("Failed to create account", {
          requestId,
          errors: result.errors,
        });
        return c.json(
          {
            success: false,
            error: {
              message: "Failed to create account",
              details: result.errors,
            },
            requestId,
          },
          400
        );
      }

      logger.info("Account created successfully", {
        requestId,
        accountId: result.account?.id,
        userId: result.account?.userId,
        providerId: result.account?.providerId,
      });

      return c.json(
        {
          success: true,
          data: {
            account: result.account,
            validation: {
              errors: result.errors,
              warnings: result.warnings,
            },
          },
          requestId,
          timestamp: new Date().toISOString(),
        },
        201
      );
    } catch (error) {
      logger.error("Error creating account", { error, requestId });
      return c.json(
        {
          success: false,
          error: {
            message: "Internal server error",
            details: error instanceof Error ? error.message : "Unknown error",
          },
          requestId,
        },
        500
      );
    }
  }
);

/**
 * POST /api/v1/accounts/oauth
 * Create OAuth account
 */
accountRoutes.post(
  "/oauth",
  zValidator("json", createOAuthAccountSchema),
  async (c) => {
    const requestId = c.get("requestId");
    const body = c.req.valid("json");

    try {
      logger.info("Creating OAuth account", {
        requestId,
        userId: body.userId,
        providerId: body.providerId,
      });

      const accountService = await getAccountService();
      const result = await accountService.createOAuthAccount(
        body.userId,
        body.providerId,
        body.accountId,
        {
          accessToken: body.accessToken,
          refreshToken: body.refreshToken,
          idToken: body.idToken,
          accessTokenExpiresAt: body.accessTokenExpiresAt,
          refreshTokenExpiresAt: body.refreshTokenExpiresAt,
        }
      );

      if (!result.success) {
        logger.warn("Failed to create OAuth account", {
          requestId,
          errors: result.errors,
        });
        return c.json(
          {
            success: false,
            error: {
              message: "Failed to create OAuth account",
              details: result.errors,
            },
            requestId,
          },
          400
        );
      }

      logger.info("OAuth account created successfully", {
        requestId,
        accountId: result.account?.id,
        userId: result.account?.userId,
        providerId: result.account?.providerId,
      });

      return c.json(
        {
          success: true,
          data: {
            account: result.account,
            validation: {
              errors: result.errors,
              warnings: result.warnings,
            },
          },
          requestId,
          timestamp: new Date().toISOString(),
        },
        201
      );
    } catch (error) {
      logger.error("Error creating OAuth account", { error, requestId });
      return c.json(
        {
          success: false,
          error: {
            message: "Internal server error",
            details: error instanceof Error ? error.message : "Unknown error",
          },
          requestId,
        },
        500
      );
    }
  }
);

/**
 * POST /api/v1/accounts/credentials
 * Create credential account
 */
accountRoutes.post(
  "/credentials",
  zValidator("json", createCredentialAccountSchema),
  async (c) => {
    const requestId = c.get("requestId");
    const body = c.req.valid("json");

    try {
      logger.info("Creating credential account", {
        requestId,
        userId: body.userId,
      });

      const accountService = await getAccountService();
      const result = await accountService.createCredentialAccount(
        body.userId,
        body.accountId,
        body.password
      );

      if (!result.success) {
        logger.warn("Failed to create credential account", {
          requestId,
          errors: result.errors,
        });
        return c.json(
          {
            success: false,
            error: {
              message: "Failed to create credential account",
              details: result.errors,
            },
            requestId,
          },
          400
        );
      }

      logger.info("Credential account created successfully", {
        requestId,
        accountId: result.account?.id,
        userId: result.account?.userId,
      });

      return c.json(
        {
          success: true,
          data: {
            account: result.account,
            validation: {
              errors: result.errors,
              warnings: result.warnings,
            },
          },
          requestId,
          timestamp: new Date().toISOString(),
        },
        201
      );
    } catch (error) {
      logger.error("Error creating credential account", { error, requestId });
      return c.json(
        {
          success: false,
          error: {
            message: "Internal server error",
            details: error instanceof Error ? error.message : "Unknown error",
          },
          requestId,
        },
        500
      );
    }
  }
);

/**
 * PUT /api/v1/accounts/:id
 * Update account
 */
accountRoutes.put(
  "/:id",
  zValidator("json", updateAccountRequestSchema),
  async (c) => {
    const requestId = c.get("requestId");
    const accountId = c.req.param("id");
    const body = c.req.valid("json");

    try {
      logger.info("Updating account", { requestId, accountId });

      await dtoService.initialize();
      const prismaClient = dtoService.getPrismaClient();
      const accountRepository = new AccountRepository(prismaClient);

      const account = await accountRepository.update(accountId, body);

      if (!account) {
        logger.warn("Account not found for update", { requestId, accountId });
        return c.json(
          {
            success: false,
            error: {
              message: "Account not found",
            },
            requestId,
          },
          404
        );
      }

      logger.info("Account updated successfully", {
        requestId,
        accountId,
        changes: Object.keys(body),
      });

      return c.json({
        success: true,
        data: {
          account,
        },
        requestId,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      logger.error("Error updating account", { error, requestId, accountId });
      return c.json(
        {
          success: false,
          error: {
            message: "Internal server error",
            details: error instanceof Error ? error.message : "Unknown error",
          },
          requestId,
        },
        500
      );
    }
  }
);

/**
 * PATCH /api/v1/accounts/:id/tokens
 * Update account tokens
 */
accountRoutes.patch(
  "/:id/tokens",
  zValidator("json", updateTokensSchema),
  async (c) => {
    const requestId = c.get("requestId");
    const accountId = c.req.param("id");
    const body = c.req.valid("json");

    try {
      logger.info("Updating account tokens", { requestId, accountId });

      const accountService = await getAccountService();
      const result = await accountService.updateAccountTokens(accountId, body);

      if (!result.success) {
        const status = result.errors.includes("Account not found") ? 404 : 400;
        logger.warn("Failed to update account tokens", {
          requestId,
          accountId,
          errors: result.errors,
        });

        return c.json(
          {
            success: false,
            error: {
              message: result.errors.includes("Account not found")
                ? "Account not found"
                : "Failed to update tokens",
              details: result.errors,
            },
            requestId,
          },
          status
        );
      }

      logger.info("Account tokens updated successfully", {
        requestId,
        accountId,
        tokenTypes: Object.keys(body),
      });

      return c.json({
        success: true,
        data: {
          account: result.account,
          validation: {
            errors: result.errors,
            warnings: result.warnings,
          },
        },
        requestId,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      logger.error("Error updating account tokens", {
        error,
        requestId,
        accountId,
      });
      return c.json(
        {
          success: false,
          error: {
            message: "Internal server error",
            details: error instanceof Error ? error.message : "Unknown error",
          },
          requestId,
        },
        500
      );
    }
  }
);

/**
 * DELETE /api/v1/accounts/:id
 * Delete account
 */
accountRoutes.delete("/:id", async (c) => {
  const requestId = c.get("requestId");
  const accountId = c.req.param("id");

  try {
    logger.info("Deleting account", { requestId, accountId });

    const accountService = await getAccountService();
    const result = await accountService.deleteAccount(accountId);

    if (!result.success) {
      const status = result.errors.includes("Account not found") ? 404 : 400;
      logger.warn("Failed to delete account", {
        requestId,
        accountId,
        errors: result.errors,
      });

      return c.json(
        {
          success: false,
          error: {
            message: result.errors.includes("Account not found")
              ? "Account not found"
              : "Failed to delete account",
            details: result.errors,
          },
          requestId,
        },
        status
      );
    }

    logger.info("Account deleted successfully", { requestId, accountId });

    return c.json({
      success: true,
      data: {
        message: "Account deleted successfully",
        accountId,
      },
      requestId,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    logger.error("Error deleting account", { error, requestId, accountId });
    return c.json(
      {
        success: false,
        error: {
          message: "Internal server error",
          details: error instanceof Error ? error.message : "Unknown error",
        },
        requestId,
      },
      500
    );
  }
});

/**
 * GET /api/v1/accounts/expired/:tokenType
 * Find accounts with expired tokens for cleanup
 */
accountRoutes.get("/expired/:tokenType", async (c) => {
  const requestId = c.get("requestId");
  const tokenType = c.req.param("tokenType") as "access" | "refresh";

  if (!["access", "refresh"].includes(tokenType)) {
    return c.json(
      {
        success: false,
        error: {
          message: "Invalid token type. Must be 'access' or 'refresh'",
        },
        requestId,
      },
      400
    );
  }

  try {
    logger.info("Finding expired token accounts", { requestId, tokenType });

    const accountService = await getAccountService();
    const result = await accountService.findExpiredTokenAccounts(tokenType);

    if (!result.success) {
      logger.warn("Failed to find expired token accounts", {
        requestId,
        tokenType,
        errors: result.errors,
      });
      return c.json(
        {
          success: false,
          error: {
            message: "Failed to find expired token accounts",
            details: result.errors,
          },
          requestId,
        },
        500
      );
    }

    logger.info("Expired token accounts found", {
      requestId,
      tokenType,
      count: result.accounts?.length || 0,
      summary: result.summary,
    });

    return c.json({
      success: true,
      data: {
        accounts: result.accounts,
        summary: result.summary,
        tokenType,
      },
      requestId,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    logger.error("Error finding expired token accounts", {
      error,
      requestId,
      tokenType,
    });
    return c.json(
      {
        success: false,
        error: {
          message: "Internal server error",
          details: error instanceof Error ? error.message : "Unknown error",
        },
        requestId,
      },
      500
    );
  }
});

export { accountRoutes };
