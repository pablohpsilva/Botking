/**
 * Logging Middleware
 * Integrates @botking/logger with Hono for structured request logging
 */

import { Context, Next } from "hono";
import { LoggerFactory } from "@botking/logger";

const logger = LoggerFactory.createPackageLogger("cmd-botking", {
  service: "http-middleware",
  enableConsole: true,
  environment: "development",
});

export async function setupLogging(c: Context, next: Next) {
  const start = Date.now();
  const requestId = c.get("requestId") || "unknown";

  // Log incoming request
  logger.info("Incoming request", {
    requestId,
    method: c.req.method,
    path: c.req.path,
    userAgent: c.req.header("user-agent"),
    ip: c.req.header("x-forwarded-for") || c.req.header("x-real-ip"),
  });

  try {
    await next();

    // Log successful response
    const duration = Date.now() - start;
    logger.info("Request completed", {
      requestId,
      method: c.req.method,
      path: c.req.path,
      status: c.res.status,
      duration: `${duration}ms`,
    });
  } catch (error) {
    // Log error
    const duration = Date.now() - start;
    logger.error("Request failed", {
      requestId,
      method: c.req.method,
      path: c.req.path,
      duration: `${duration}ms`,
      error: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
    });

    throw error; // Re-throw for error handler
  }
}
