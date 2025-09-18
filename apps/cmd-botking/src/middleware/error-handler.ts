/**
 * Global Error Handler
 * Handles all uncaught errors with structured logging
 */

import { Context } from "hono";
import { HTTPException } from "hono/http-exception";
import { LoggerFactory } from "@botking/logger";

const logger = LoggerFactory.createPackageLogger("cmd-botking", {
  service: "error-handler",
  enableConsole: true,
  environment: "development",
});

export function errorHandler(error: Error, c: Context) {
  const requestId = c.get("requestId") || "unknown";

  // Handle HTTP exceptions (expected errors)
  if (error instanceof HTTPException) {
    logger.warn("HTTP Exception occurred", {
      requestId,
      status: error.status,
      message: error.message,
      path: c.req.path,
      method: c.req.method,
    });

    return c.json(
      {
        success: false,
        error: {
          code: error.status,
          message: error.message,
          timestamp: new Date().toISOString(),
          requestId,
        },
      },
      error.status
    );
  }

  // Handle validation errors
  if (error.name === "ZodError") {
    logger.warn("Validation error occurred", {
      requestId,
      error: error.message,
      path: c.req.path,
      method: c.req.method,
    });

    return c.json(
      {
        success: false,
        error: {
          code: 400,
          message: "Validation failed",
          details: error.message,
          timestamp: new Date().toISOString(),
          requestId,
        },
      },
      400
    );
  }

  // Handle database errors
  if (error.message.includes("Prisma") || error.message.includes("Database")) {
    logger.error("Database error occurred", {
      requestId,
      error: error.message,
      stack: error.stack,
      path: c.req.path,
      method: c.req.method,
    });

    return c.json(
      {
        success: false,
        error: {
          code: 500,
          message: "Database operation failed",
          timestamp: new Date().toISOString(),
          requestId,
        },
      },
      500
    );
  }

  // Handle all other errors (unexpected)
  logger.error("Unexpected error occurred", {
    requestId,
    error: error.message,
    stack: error.stack,
    path: c.req.path,
    method: c.req.method,
    name: error.name,
  });

  return c.json(
    {
      success: false,
      error: {
        code: 500,
        message: "Internal server error",
        timestamp: new Date().toISOString(),
        requestId,
      },
    },
    500
  );
}
