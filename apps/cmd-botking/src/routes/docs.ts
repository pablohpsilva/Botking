/**
 * Documentation Routes
 * Provides OpenAPI specification and API documentation
 */

import { Hono } from "hono";
import { LoggerFactory } from "@botking/logger";

// Type declaration for Hono context to fix requestId typing
declare module "hono" {
  interface ContextVariableMap {
    requestId: string;
  }
}

const logger = LoggerFactory.createPackageLogger("cmd-botking", {
  service: "docs-routes",
});

const docsRoutes = new Hono();

// OpenAPI specification
docsRoutes.get("/openapi.json", async (c) => {
  const requestId = c.get("requestId");

  logger.info("OpenAPI spec requested", { requestId });

  const spec = {
    openapi: "3.0.0",
    info: {
      title: "cmd-botking API",
      version: "1.0.0",
      description: "Production Botking API demonstrating the complete system",
      contact: {
        name: "Botking Team",
        email: "api@botking.dev",
      },
      license: {
        name: "MIT",
        url: "https://opensource.org/licenses/MIT",
      },
    },
    servers: [
      {
        url: "/api/v1",
        description: "API v1",
      },
    ],
    paths: {
      "/bots": {
        get: {
          summary: "List bots",
          description: "Get a paginated list of bots with optional filtering",
          parameters: [
            {
              name: "page",
              in: "query",
              schema: { type: "integer", minimum: 1, default: 1 },
              description: "Page number",
            },
            {
              name: "limit",
              in: "query",
              schema: {
                type: "integer",
                minimum: 1,
                maximum: 100,
                default: 10,
              },
              description: "Items per page",
            },
            {
              name: "botType",
              in: "query",
              schema: {
                type: "string",
                enum: ["WORKER", "PLAYABLE", "KING", "ROGUE", "GOVBOT"],
              },
              description: "Filter by bot type",
            },
            {
              name: "userId",
              in: "query",
              schema: { type: "string", format: "uuid" },
              description: "Filter by user ID",
            },
          ],
          responses: {
            "200": {
              description: "Successful response",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      success: { type: "boolean" },
                      data: {
                        type: "object",
                        properties: {
                          bots: {
                            type: "array",
                            items: { $ref: "#/components/schemas/Bot" },
                          },
                          pagination: {
                            $ref: "#/components/schemas/Pagination",
                          },
                        },
                      },
                      meta: { $ref: "#/components/schemas/Meta" },
                    },
                  },
                },
              },
            },
          },
          tags: ["Bots"],
        },
        post: {
          summary: "Create a bot",
          description: "Create a new bot using artifact factories",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/CreateBotRequest" },
              },
            },
          },
          responses: {
            "201": {
              description: "Bot created successfully",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      success: { type: "boolean" },
                      data: {
                        type: "object",
                        properties: {
                          bot: { $ref: "#/components/schemas/Bot" },
                          validation: {
                            $ref: "#/components/schemas/ValidationResult",
                          },
                        },
                      },
                      meta: { $ref: "#/components/schemas/Meta" },
                    },
                  },
                },
              },
            },
            "400": {
              description: "Validation failed",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Error" },
                },
              },
            },
          },
          tags: ["Bots"],
        },
      },
      "/bots/{id}": {
        get: {
          summary: "Get a bot",
          description: "Get a specific bot by ID",
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "string", format: "uuid" },
              description: "Bot ID",
            },
          ],
          responses: {
            "200": {
              description: "Successful response",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      success: { type: "boolean" },
                      data: {
                        type: "object",
                        properties: {
                          bot: { $ref: "#/components/schemas/Bot" },
                        },
                      },
                      meta: { $ref: "#/components/schemas/Meta" },
                    },
                  },
                },
              },
            },
            "404": {
              description: "Bot not found",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Error" },
                },
              },
            },
          },
          tags: ["Bots"],
        },
      },
      "/items": {
        get: {
          summary: "List items",
          description: "Get a paginated list of items with optional filtering",
          parameters: [
            {
              name: "page",
              in: "query",
              schema: { type: "integer", minimum: 1, default: 1 },
            },
            {
              name: "limit",
              in: "query",
              schema: {
                type: "integer",
                minimum: 1,
                maximum: 100,
                default: 10,
              },
            },
            {
              name: "category",
              in: "query",
              schema: {
                type: "string",
                enum: ["SPEED_UP", "RESOURCE", "TRADEABLE", "GEMS"],
              },
            },
          ],
          responses: {
            "200": {
              description: "Successful response",
            },
          },
          tags: ["Items"],
        },
        post: {
          summary: "Create an item",
          description: "Create a new item using artifact factories",
          responses: {
            "201": {
              description: "Item created successfully",
            },
          },
          tags: ["Items"],
        },
      },
      "/soul-chips": {
        get: {
          summary: "List soul chips",
          description: "Get a paginated list of soul chips",
          responses: {
            "200": {
              description: "Successful response",
            },
          },
          tags: ["Soul Chips"],
        },
        post: {
          summary: "Create a soul chip",
          description: "Create a new soul chip using artifact factories",
          responses: {
            "201": {
              description: "Soul chip created successfully",
            },
          },
          tags: ["Soul Chips"],
        },
      },
      "/trading/events": {
        get: {
          summary: "List trading events",
          description: "Get a paginated list of trading events",
          responses: {
            "200": {
              description: "Successful response",
            },
          },
          tags: ["Trading"],
        },
        post: {
          summary: "Create a trading event",
          description: "Create a new trading event",
          responses: {
            "201": {
              description: "Trading event created successfully",
            },
          },
          tags: ["Trading"],
        },
      },
    },
    components: {
      schemas: {
        Bot: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
            name: { type: "string" },
            userId: { type: "string", format: "uuid" },
            botType: {
              type: "string",
              enum: ["WORKER", "PLAYABLE", "KING", "ROGUE", "GOVBOT"],
            },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        CreateBotRequest: {
          type: "object",
          required: ["name", "userId", "botType"],
          properties: {
            name: { type: "string", minLength: 1, maxLength: 100 },
            userId: { type: "string", format: "uuid" },
            botType: {
              type: "string",
              enum: ["WORKER", "PLAYABLE", "KING", "ROGUE", "GOVBOT"],
            },
            skeletonType: {
              type: "string",
              enum: ["BALANCED", "LIGHT", "HEAVY", "FLYING"],
            },
            autoConfig: { type: "boolean", default: true },
          },
        },
        ValidationResult: {
          type: "object",
          properties: {
            score: { type: "number", minimum: 0, maximum: 100 },
            warnings: {
              type: "array",
              items: { type: "string" },
            },
          },
        },
        Pagination: {
          type: "object",
          properties: {
            page: { type: "integer" },
            limit: { type: "integer" },
            total: { type: "integer" },
            totalPages: { type: "integer" },
            hasNext: { type: "boolean" },
            hasPrev: { type: "boolean" },
          },
        },
        Meta: {
          type: "object",
          properties: {
            timestamp: { type: "string", format: "date-time" },
            requestId: { type: "string", format: "uuid" },
          },
        },
        Error: {
          type: "object",
          properties: {
            success: { type: "boolean", default: false },
            error: {
              type: "object",
              properties: {
                code: { type: "integer" },
                message: { type: "string" },
                timestamp: { type: "string", format: "date-time" },
                requestId: { type: "string", format: "uuid" },
                details: { type: "object" },
              },
            },
          },
        },
      },
    },
    tags: [
      { name: "Bots", description: "Bot management operations" },
      { name: "Items", description: "Item management operations" },
      { name: "Soul Chips", description: "Soul chip management operations" },
      { name: "Trading", description: "Trading system operations" },
      { name: "Health", description: "Health check endpoints" },
    ],
  };

  return c.json(spec);
});

// API documentation index
docsRoutes.get("/", async (c) => {
  const requestId = c.get("requestId");

  logger.info("API docs index requested", { requestId });

  return c.json({
    name: "cmd-botking API Documentation",
    version: "1.0.0",
    description: "Production Botking API demonstrating the complete system",
    endpoints: {
      openapi: "/docs/openapi.json",
      swagger: "/swagger",
      postman: "/docs/postman.json",
    },
    features: [
      "Bot management using @botking/artifact factories",
      "Item creation and validation",
      "Soul chip personality system",
      "Trading system with events and offers",
      "Comprehensive health monitoring",
      "Structured logging with @botking/logger",
      "Database integration with @botking/db",
      "Domain rules validation with @botking/domain",
    ],
    meta: {
      timestamp: new Date().toISOString(),
      requestId,
    },
  });
});

export { docsRoutes };
