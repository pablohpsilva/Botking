/**
 * Bot Management Routes
 * Demonstrates production usage of @botking/artifact and @botking/dto
 */

import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { LoggerFactory } from "@botking/logger";
import { BotDTOFactory } from "@botking/dto";
import { BotTypeSchema, SkeletonTypeSchema } from "@botking/db";
import { dtoService } from "@/services/dto-service";
import { BotValidator, SkeletonType } from "@botking/artifact";

// Type declaration for Hono context to fix requestId typing
declare module "hono" {
  interface ContextVariableMap {
    requestId: string;
  }
}

const logger = LoggerFactory.createPackageLogger("cmd-botking", {
  service: "bot-routes",
});

const botRoutes = new Hono();

// Validation schemas
const createBotSchema = z.object({
  name: z.string().min(1).max(100),
  userId: z.string().uuid(),
  botType: BotTypeSchema,
  skeletonType: SkeletonTypeSchema.optional(),
  autoConfig: z.boolean().optional().default(true),
});

const updateBotSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  // Add other updatable fields
});

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
    .default(10),
  botType: BotTypeSchema.optional(),
  userId: z.string().uuid().optional(),
});

// GET /api/v1/bots - List bots with pagination
botRoutes.get("/", zValidator("query", querySchema), async (c) => {
  const requestId = c.get("requestId");
  const { page, limit, botType, userId } = c.req.valid("query");

  try {
    logger.info("Fetching bots list", {
      requestId,
      page,
      limit,
      filters: { botType, userId },
    });

    await dtoService.initialize();
    const repositories = dtoService.getPrismaClient();

    // Build the where clause for filtering
    const where: any = {};
    if (botType) where.botType = botType;
    if (userId) where.userId = userId;

    // Use repository pattern for database operations with proper Prisma parameters
    const bots = await repositories.bot.findMany({
      where,
      take: limit,
      skip: (page - 1) * limit,
      orderBy: { createdAt: "desc" },
    });

    const total = await repositories.bot.count({
      where,
    });

    const totalPages = Math.ceil(total / limit);

    logger.info("Bots fetched successfully", {
      requestId,
      count: bots.length,
      total,
    });

    return c.json({
      success: true,
      data: {
        bots,
        pagination: {
          page,
          limit,
          total,
          totalPages,
          hasNext: page < totalPages,
          hasPrev: page > 1,
        },
      },
      meta: {
        timestamp: new Date().toISOString(),
        requestId,
      },
    });
  } catch (error) {
    logger.error("Failed to fetch bots", { requestId, error });
    throw error;
  }
});

// POST /api/v1/bots - Create a new bot
botRoutes.post("/", zValidator("json", createBotSchema), async (c) => {
  const requestId = c.get("requestId");
  const body = c.req.valid("json");

  try {
    logger.info("Creating new bot", {
      requestId,
      botData: { ...body, userId: "[REDACTED]" },
    });

    // Create bot using artifact factory
    const botFactory = new BotDTOFactory();

    let bot;
    if (body.botType === "WORKER") {
      bot = botFactory.createWorkerArtifact(
        body.name,
        body.userId,
        "GENERAL" // Default specialization
      );
    } else {
      bot = botFactory.createPlayableArtifact(
        body.name,
        body.userId,
        (body.skeletonType as SkeletonType) || SkeletonType.BALANCED
      );
    }

    // Validate the created bot
    const validator = new BotValidator();
    const validation = validator.validate(bot);

    if (!validation.isValid) {
      logger.warn("Bot validation failed", {
        requestId,
        issues: validation.issues,
      });
      return c.json(
        {
          success: false,
          error: {
            code: 400,
            message: "Bot validation failed",
            details: validation.issues || [],
            requestId,
          },
        },
        400
      );
    }

    // Save using AutoSyncDTOFactory
    await dtoService.initialize();
    const autoSyncFactory = dtoService.getAutoSyncFactory();
    const savedBot = await autoSyncFactory.saveBotArtifact(bot);

    logger.info("Bot created successfully", {
      requestId,
      botId: savedBot.id,
      validationScore: validation.score,
    });

    return c.json(
      {
        success: true,
        data: {
          bot: savedBot,
          validation: {
            score: validation.score || 100,
            warnings: validation.summary.warnings,
          },
        },
        meta: {
          timestamp: new Date().toISOString(),
          requestId,
        },
      },
      201
    );
  } catch (error) {
    logger.error("Failed to create bot", { requestId, error });
    throw error;
  }
});

// GET /api/v1/bots/:id - Get specific bot
botRoutes.get("/:id", async (c) => {
  const requestId = c.get("requestId");
  const botId = c.req.param("id");

  try {
    logger.info("Fetching bot by ID", { requestId, botId });

    await dtoService.initialize();
    const autoSyncFactory = dtoService.getAutoSyncFactory();

    // Load the bot artifact from database
    const bot = await autoSyncFactory.loadBotArtifact(botId);

    if (!bot) {
      logger.warn("Bot not found", { requestId, botId });
      return c.json(
        {
          success: false,
          error: {
            code: 404,
            message: "Bot not found",
            requestId,
          },
        },
        404
      );
    }

    logger.info("Bot fetched successfully", { requestId, botId });

    return c.json({
      success: true,
      data: { bot },
      meta: {
        timestamp: new Date().toISOString(),
        requestId,
      },
    });
  } catch (error) {
    logger.error("Failed to fetch bot", { requestId, botId, error });
    throw error;
  }
});

// PUT /api/v1/bots/:id - Update bot
botRoutes.put("/:id", zValidator("json", updateBotSchema), async (c) => {
  const requestId = c.get("requestId");
  const botId = c.req.param("id");
  const body = c.req.valid("json");

  try {
    logger.info("Updating bot", { requestId, botId, updates: body });

    await dtoService.initialize();
    const autoSyncFactory = dtoService.getAutoSyncFactory();

    // Load existing bot artifact
    const existingBot = await autoSyncFactory.loadBotArtifact(botId);
    if (!existingBot) {
      return c.json(
        {
          success: false,
          error: {
            code: 404,
            message: "Bot not found",
            requestId,
          },
        },
        404
      );
    }

    // Create updated bot artifact with new properties
    const updatedBotData = {
      ...existingBot,
      name: body.name || existingBot.name,
      lastModified: new Date(),
      // Add other updateable fields as needed
    };

    // Convert to artifact and save
    const updatedBot = await autoSyncFactory.updateBotArtifact(
      updatedBotData as any
    );

    logger.info("Bot updated successfully", { requestId, botId });

    return c.json({
      success: true,
      data: { bot: updatedBot },
      meta: {
        timestamp: new Date().toISOString(),
        requestId,
      },
    });
  } catch (error) {
    logger.error("Failed to update bot", { requestId, botId, error });
    throw error;
  }
});

// DELETE /api/v1/bots/:id - Delete bot
botRoutes.delete("/:id", async (c) => {
  const requestId = c.get("requestId");
  const botId = c.req.param("id");

  try {
    logger.info("Deleting bot", { requestId, botId });

    await dtoService.initialize();
    const repositories = dtoService.getPrismaClient();

    // Check if bot exists
    const existingBot = await repositories.bot.findUnique({
      where: { id: botId },
    });
    if (!existingBot) {
      return c.json(
        {
          success: false,
          error: {
            code: 404,
            message: "Bot not found",
            requestId,
          },
        },
        404
      );
    }

    // Delete bot
    await repositories.bot.delete({
      where: { id: botId },
    });

    logger.info("Bot deleted successfully", { requestId, botId });

    return c.json({
      success: true,
      data: { deleted: true },
      meta: {
        timestamp: new Date().toISOString(),
        requestId,
      },
    });
  } catch (error) {
    logger.error("Failed to delete bot", { requestId, botId, error });
    throw error;
  }
});

// POST /api/v1/bots/:id/validate - Validate bot configuration
botRoutes.post("/:id/validate", async (c) => {
  const requestId = c.get("requestId");
  const botId = c.req.param("id");

  try {
    logger.info("Validating bot configuration", { requestId, botId });

    await dtoService.initialize();
    const autoSyncFactory = dtoService.getAutoSyncFactory();

    // Load bot artifact from database
    const bot = await autoSyncFactory.loadBotArtifact(botId);

    if (!bot) {
      return c.json(
        {
          success: false,
          error: {
            code: 404,
            message: "Bot not found",
            requestId,
          },
        },
        404
      );
    }

    const validator = new BotValidator();
    const validation = validator.validate(bot);

    logger.info("Bot validation completed", {
      requestId,
      botId,
      isValid: validation.isValid,
      score: validation.score || 100,
    });

    return c.json({
      success: true,
      data: {
        validation: {
          isValid: validation.isValid,
          score: validation.score || 100,
          issues: validation.issues,
          warnings: validation.summary.warnings,
          summary: validation.summary,
        },
      },
      meta: {
        timestamp: new Date().toISOString(),
        requestId,
      },
    });
  } catch (error) {
    logger.error("Failed to validate bot", { requestId, botId, error });
    throw error;
  }
});

export { botRoutes };
