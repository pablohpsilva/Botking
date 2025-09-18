/**
 * Request ID Middleware
 * Generates unique request IDs for tracing
 */

import { Context, Next } from "hono";
import { randomUUID } from "crypto";

export async function requestId(c: Context, next: Next) {
  // Generate or use existing request ID
  const id = c.req.header("x-request-id") || randomUUID();

  // Store in context for use by other middleware/handlers
  c.set("requestId", id);

  // Add to response headers
  c.res.headers.set("x-request-id", id);

  await next();
}
