/**
 * User Management Routes
 * Demonstrates production usage of @botking/dto User package
 */

import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { LoggerFactory } from "@botking/logger";
import { UserRepository, UserService } from "@botking/dto";
import {
  CreateUserSchema,
  UpdateUserSchema,
  UserProfileUpdateSchema,
} from "@botking/db";
import { dtoService } from "../services/dto-service";

// Type declaration for Hono context to fix requestId typing
declare module "hono" {
  interface ContextVariableMap {
    requestId: string;
  }
}

const logger = LoggerFactory.createPackageLogger("cmd-botking", {
  service: "user-routes",
});

const userRoutes = new Hono();

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
  query: z.string().optional(),
  emailVerified: z
    .string()
    .transform((val) => val === "true")
    .optional(),
  orderBy: z.enum(["createdAt", "updatedAt", "email", "name"]).optional(),
  orderDirection: z.enum(["asc", "desc"]).optional().default("desc"),
});

const createUserRequestSchema = CreateUserSchema;
const updateUserRequestSchema = UpdateUserSchema;
const updateProfileRequestSchema = UserProfileUpdateSchema;

// Get user repository and service
async function getUserService(): Promise<UserService> {
  await dtoService.initialize();
  const prismaClient = dtoService.getPrismaClient();
  const userRepository = new UserRepository(prismaClient);
  return new UserService(userRepository);
}

/**
 * GET /api/v1/users
 * List users with pagination and filtering
 */
userRoutes.get("/", zValidator("query", querySchema), async (c) => {
  const requestId = c.get("requestId");
  const query = c.req.valid("query");

  try {
    logger.info("Listing users", { requestId, query });

    const userService = await getUserService();

    // Build order by object
    const orderBy = query.orderBy
      ? { [query.orderBy]: query.orderDirection }
      : { createdAt: "desc" };

    const result = await userService.searchUsers({
      query: query.query,
      emailVerified: query.emailVerified,
      orderBy,
      page: query.page,
      limit: query.limit,
    });

    if (!result.success) {
      logger.warn("Failed to list users", { requestId, errors: result.errors });
      return c.json(
        {
          success: false,
          error: {
            message: "Failed to retrieve users",
            details: result.errors,
          },
          requestId,
        },
        500
      );
    }

    logger.info("Users listed successfully", {
      requestId,
      count: result.users?.length || 0,
      pagination: result.pagination,
    });

    return c.json({
      success: true,
      data: {
        users: result.users,
        pagination: result.pagination,
      },
      requestId,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    logger.error("Error listing users", { error, requestId });
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
 * GET /api/v1/users/:id
 * Get user by ID with insights
 */
userRoutes.get("/:id", async (c) => {
  const requestId = c.get("requestId");
  const userId = c.req.param("id");

  try {
    logger.info("Getting user by ID", { requestId, userId });

    const userService = await getUserService();
    const result = await userService.getUserInsights(userId);

    if (!result.success) {
      const status = result.errors.includes("User not found") ? 404 : 500;
      logger.warn("Failed to get user", {
        requestId,
        userId,
        errors: result.errors,
      });

      return c.json(
        {
          success: false,
          error: {
            message: result.errors.includes("User not found")
              ? "User not found"
              : "Failed to retrieve user",
            details: result.errors,
          },
          requestId,
        },
        status
      );
    }

    logger.info("User retrieved successfully", {
      requestId,
      userId,
      validationLevel: result.insights?.validation.summary.validationLevel,
    });

    return c.json({
      success: true,
      data: {
        user: result.insights?.user,
        validation: result.insights?.validation,
        statistics: result.insights?.statistics,
        recommendations: result.insights?.recommendations,
      },
      requestId,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    logger.error("Error getting user", { error, requestId, userId });
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
 * POST /api/v1/users
 * Create new user
 */
userRoutes.post("/", zValidator("json", createUserRequestSchema), async (c) => {
  const requestId = c.get("requestId");
  const body = c.req.valid("json");

  try {
    logger.info("Creating user", { requestId, email: body.email });

    const userService = await getUserService();
    const result = await userService.createUser(body);

    if (!result.success) {
      logger.warn("Failed to create user", {
        requestId,
        errors: result.errors,
      });
      return c.json(
        {
          success: false,
          error: {
            message: "Failed to create user",
            details: result.errors,
          },
          requestId,
        },
        400
      );
    }

    logger.info("User created successfully", {
      requestId,
      userId: result.user?.id,
      email: result.user?.email,
    });

    return c.json(
      {
        success: true,
        data: {
          user: result.user,
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
    logger.error("Error creating user", { error, requestId });
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
 * PUT /api/v1/users/:id
 * Update user
 */
userRoutes.put(
  "/:id",
  zValidator("json", updateUserRequestSchema),
  async (c) => {
    const requestId = c.get("requestId");
    const userId = c.req.param("id");
    const body = c.req.valid("json");

    try {
      logger.info("Updating user", { requestId, userId });

      const userService = await getUserService();

      // For general user updates, we'll use the updateUserProfile method
      // since the DTO doesn't allow email updates through the regular update
      const result = await userService.updateUserProfile(userId, body);

      if (!result.success) {
        const status = result.errors.includes("User not found") ? 404 : 400;
        logger.warn("Failed to update user", {
          requestId,
          userId,
          errors: result.errors,
        });

        return c.json(
          {
            success: false,
            error: {
              message: result.errors.includes("User not found")
                ? "User not found"
                : "Failed to update user",
              details: result.errors,
            },
            requestId,
          },
          status
        );
      }

      logger.info("User updated successfully", {
        requestId,
        userId,
        changes: Object.keys(body),
      });

      return c.json({
        success: true,
        data: {
          user: result.user,
          validation: {
            errors: result.errors,
            warnings: result.warnings,
          },
        },
        requestId,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      logger.error("Error updating user", { error, requestId, userId });
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
 * PATCH /api/v1/users/:id/profile
 * Update user profile specifically
 */
userRoutes.patch(
  "/:id/profile",
  zValidator("json", updateProfileRequestSchema),
  async (c) => {
    const requestId = c.get("requestId");
    const userId = c.req.param("id");
    const body = c.req.valid("json");

    try {
      logger.info("Updating user profile", { requestId, userId });

      const userService = await getUserService();
      const result = await userService.updateUserProfile(userId, body);

      if (!result.success) {
        const status = result.errors.includes("User not found") ? 404 : 400;
        logger.warn("Failed to update user profile", {
          requestId,
          userId,
          errors: result.errors,
        });

        return c.json(
          {
            success: false,
            error: {
              message: result.errors.includes("User not found")
                ? "User not found"
                : "Failed to update user profile",
              details: result.errors,
            },
            requestId,
          },
          status
        );
      }

      logger.info("User profile updated successfully", {
        requestId,
        userId,
        changes: Object.keys(body),
      });

      return c.json({
        success: true,
        data: {
          user: result.user,
          validation: {
            errors: result.errors,
            warnings: result.warnings,
          },
        },
        requestId,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      logger.error("Error updating user profile", { error, requestId, userId });
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
 * POST /api/v1/users/:id/verify-email
 * Verify user email
 */
userRoutes.post("/:id/verify-email", async (c) => {
  const requestId = c.get("requestId");
  const userId = c.req.param("id");

  try {
    logger.info("Verifying user email", { requestId, userId });

    const userService = await getUserService();
    const result = await userService.verifyUserEmail(userId);

    if (!result.success) {
      const status = result.errors.includes("User not found") ? 404 : 400;
      logger.warn("Failed to verify user email", {
        requestId,
        userId,
        errors: result.errors,
      });

      return c.json(
        {
          success: false,
          error: {
            message: result.errors.includes("User not found")
              ? "User not found"
              : "Failed to verify email",
            details: result.errors,
          },
          requestId,
        },
        status
      );
    }

    logger.info("User email verified successfully", { requestId, userId });

    return c.json({
      success: true,
      data: {
        user: result.user,
        message: "Email verified successfully",
      },
      requestId,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    logger.error("Error verifying user email", { error, requestId, userId });
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
 * DELETE /api/v1/users/:id
 * Delete user
 */
userRoutes.delete("/:id", async (c) => {
  const requestId = c.get("requestId");
  const userId = c.req.param("id");

  try {
    logger.info("Deleting user", { requestId, userId });

    const userService = await getUserService();
    const result = await userService.deleteUser(userId);

    if (!result.success) {
      const status = result.errors.includes("User not found") ? 404 : 400;
      logger.warn("Failed to delete user", {
        requestId,
        userId,
        errors: result.errors,
      });

      return c.json(
        {
          success: false,
          error: {
            message: result.errors.includes("User not found")
              ? "User not found"
              : "Failed to delete user",
            details: result.errors,
          },
          requestId,
        },
        status
      );
    }

    logger.info("User deleted successfully", { requestId, userId });

    return c.json({
      success: true,
      data: {
        message: "User deleted successfully",
        userId,
      },
      requestId,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    logger.error("Error deleting user", { error, requestId, userId });
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
 * GET /api/v1/users/email/:email
 * Get user by email
 */
userRoutes.get("/email/:email", async (c) => {
  const requestId = c.get("requestId");
  const email = c.req.param("email");

  try {
    logger.info("Getting user by email", { requestId, email });

    await dtoService.initialize();
    const prismaClient = dtoService.getPrismaClient();
    const userRepository = new UserRepository(prismaClient);

    const user = await userRepository.findByEmail(email);

    if (!user) {
      logger.warn("User not found by email", { requestId, email });
      return c.json(
        {
          success: false,
          error: {
            message: "User not found",
          },
          requestId,
        },
        404
      );
    }

    logger.info("User found by email", { requestId, email, userId: user.id });

    return c.json({
      success: true,
      data: {
        user,
      },
      requestId,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    logger.error("Error getting user by email", { error, requestId, email });
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

export { userRoutes };
