/**
 * Soul Chip Management Routes
 * Demonstrates production usage of @botking/artifact SoulChip
 */

import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { LoggerFactory } from "@botking/logger";
import { Rarity } from "@botking/dto";
import { dtoService } from "../services/dto-service";

// Type declaration for Hono context to fix requestId typing
declare module "hono" {
  interface ContextVariableMap {
    requestId: string;
  }
}

const logger = LoggerFactory.createPackageLogger("cmd-botking", {
  service: "soul-chip-routes",
});

const soulChipRoutes = new Hono();

// Validation schemas
const createSoulChipSchema = z.object({
  name: z.string().min(1).max(100),
  rarity: z.nativeEnum(Rarity).optional().default(Rarity.COMMON),
  type: z
    .enum(["empathetic", "intelligent", "loyal", "default"])
    .optional()
    .default("default"),
  personality: z
    .object({
      aggressiveness: z.number().min(0).max(100).optional(),
      curiosity: z.number().min(0).max(100).optional(),
      loyalty: z.number().min(0).max(100).optional(),
      empathy: z.number().min(0).max(100).optional(),
      independence: z.number().min(0).max(100).optional(),
      dialogueStyle: z.enum(["formal", "casual", "quirky", "stoic"]).optional(),
    })
    .optional(),
  baseStats: z
    .object({
      intelligence: z.number().min(0).max(100).optional(),
      resilience: z.number().min(0).max(100).optional(),
      adaptability: z.number().min(0).max(100).optional(),
    })
    .optional(),
  specialTrait: z.string().max(200).optional(),
});

const updateSoulChipSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  rarity: z.nativeEnum(Rarity).optional(),
  personality: z
    .object({
      aggressiveness: z.number().min(0).max(100).optional(),
      curiosity: z.number().min(0).max(100).optional(),
      loyalty: z.number().min(0).max(100).optional(),
      empathy: z.number().min(0).max(100).optional(),
      independence: z.number().min(0).max(100).optional(),
      dialogueStyle: z.enum(["formal", "casual", "quirky", "stoic"]).optional(),
    })
    .optional(),
  baseStats: z
    .object({
      intelligence: z.number().min(0).max(100).optional(),
      resilience: z.number().min(0).max(100).optional(),
      adaptability: z.number().min(0).max(100).optional(),
    })
    .optional(),
  specialTrait: z.string().max(200).optional(),
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
  rarity: z.nativeEnum(Rarity).optional(),
});

// GET /api/v1/soul-chips - List soul chips with pagination
soulChipRoutes.get("/", zValidator("query", querySchema), async (c) => {
  const requestId = c.get("requestId");
  const { page, limit, rarity } = c.req.valid("query");

  try {
    logger.info("Fetching soul chips list", {
      requestId,
      page,
      limit,
      filters: { rarity },
    });

    await dtoService.initialize();
    const repositories = dtoService.getPrismaClient();

    // Use repository pattern for database operations
    const soulChips = await repositories.soulChip.findMany({
      page,
      limit,
      filters: { rarity },
    });

    const total = await repositories.soulChip.count({
      rarity,
    });

    const totalPages = Math.ceil(total / limit);

    logger.info("Soul chips fetched successfully", {
      requestId,
      count: soulChips.length,
      total,
    });

    return c.json({
      success: true,
      data: {
        soulChips,
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
    logger.error("Failed to fetch soul chips", { requestId, error });
    throw error;
  }
});

// POST /api/v1/soul-chips - Create a new soul chip
soulChipRoutes.post(
  "/",
  zValidator("json", createSoulChipSchema),
  async (c) => {
    const requestId = c.get("requestId");
    const body = c.req.valid("json");

    try {
      logger.info("Creating new soul chip", {
        requestId,
        soulChipData: { ...body, personality: "[REDACTED]" },
      });

      // Create soul chip data directly (simplified approach)
      const soulChipData: any = {
        name: body.name,
        rarity: body.rarity,
        userId: "system", // Default system user for now
        personality: JSON.stringify(
          body.personality || {
            aggressiveness: 50,
            curiosity: 50,
            loyalty: 50,
            empathy: 50,
            independence: 50,
            dialogueStyle: "casual",
          }
        ),
        intelligence: body.baseStats?.intelligence || 50,
        resilience: body.baseStats?.resilience || 50,
        adaptability: body.baseStats?.adaptability || 50,
        specialTrait: body.specialTrait || "Default personality",
      };

      // Adjust stats based on type
      switch (body.type) {
        case "empathetic":
          soulChipData.intelligence = 40;
          soulChipData.resilience = 70;
          soulChipData.adaptability = 60;
          soulChipData.specialTrait = "High empathy and emotional intelligence";
          break;
        case "intelligent":
          soulChipData.intelligence = 85;
          soulChipData.resilience = 50;
          soulChipData.adaptability = 75;
          soulChipData.specialTrait =
            "Enhanced processing and learning capabilities";
          break;
        case "loyal":
          soulChipData.intelligence = 55;
          soulChipData.resilience = 80;
          soulChipData.adaptability = 45;
          soulChipData.specialTrait = "Unwavering loyalty and dedication";
          break;
      }

      await dtoService.initialize();
      const repositories = dtoService.getPrismaClient();

      const savedSoulChip = await repositories.soulChip.create(soulChipData);

      logger.info("Soul chip created successfully", {
        requestId,
        soulChipId: savedSoulChip.id,
      });

      return c.json(
        {
          success: true,
          data: {
            soulChip: savedSoulChip,
          },
          meta: {
            timestamp: new Date().toISOString(),
            requestId,
          },
        },
        201
      );
    } catch (error) {
      logger.error("Failed to create soul chip", { requestId, error });
      throw error;
    }
  }
);

// GET /api/v1/soul-chips/:id - Get specific soul chip
soulChipRoutes.get("/:id", async (c) => {
  const requestId = c.get("requestId");
  const soulChipId = c.req.param("id");

  try {
    logger.info("Fetching soul chip by ID", { requestId, soulChipId });

    await dtoService.initialize();
    const repositories = dtoService.getPrismaClient();

    const soulChip = await repositories.soulChip.findById(soulChipId);

    if (!soulChip) {
      logger.warn("Soul chip not found", { requestId, soulChipId });
      return c.json(
        {
          success: false,
          error: {
            code: 404,
            message: "Soul chip not found",
            requestId,
          },
        },
        404
      );
    }

    logger.info("Soul chip fetched successfully", { requestId, soulChipId });

    return c.json({
      success: true,
      data: { soulChip },
      meta: {
        timestamp: new Date().toISOString(),
        requestId,
      },
    });
  } catch (error) {
    logger.error("Failed to fetch soul chip", { requestId, soulChipId, error });
    throw error;
  }
});

// PUT /api/v1/soul-chips/:id - Update soul chip
soulChipRoutes.put(
  "/:id",
  zValidator("json", updateSoulChipSchema),
  async (c) => {
    const requestId = c.get("requestId");
    const soulChipId = c.req.param("id");
    const body = c.req.valid("json");

    try {
      logger.info("Updating soul chip", {
        requestId,
        soulChipId,
        updates: body,
      });

      await dtoService.initialize();
      const repositories = dtoService.getPrismaClient();

      const updatedSoulChip = await repositories.soulChip.update(soulChipId, {
        ...body,
        updatedAt: new Date(),
      });

      if (!updatedSoulChip) {
        logger.warn("Soul chip not found for update", {
          requestId,
          soulChipId,
        });
        return c.json(
          {
            success: false,
            error: {
              code: 404,
              message: "Soul chip not found",
              requestId,
            },
          },
          404
        );
      }

      logger.info("Soul chip updated successfully", { requestId, soulChipId });

      return c.json({
        success: true,
        data: { soulChip: updatedSoulChip },
        meta: {
          timestamp: new Date().toISOString(),
          requestId,
        },
      });
    } catch (error) {
      logger.error("Failed to update soul chip", {
        requestId,
        soulChipId,
        error,
      });
      throw error;
    }
  }
);

// DELETE /api/v1/soul-chips/:id - Delete soul chip
soulChipRoutes.delete("/:id", async (c) => {
  const requestId = c.get("requestId");
  const soulChipId = c.req.param("id");

  try {
    logger.info("Deleting soul chip", { requestId, soulChipId });

    await dtoService.initialize();
    const repositories = dtoService.getPrismaClient();

    const success = await repositories.soulChip.delete(soulChipId);

    if (!success) {
      logger.warn("Soul chip not found for deletion", {
        requestId,
        soulChipId,
      });
      return c.json(
        {
          success: false,
          error: {
            code: 404,
            message: "Soul chip not found",
            requestId,
          },
        },
        404
      );
    }

    logger.info("Soul chip deleted successfully", { requestId, soulChipId });

    return c.json({
      success: true,
      data: { deleted: true },
      meta: {
        timestamp: new Date().toISOString(),
        requestId,
      },
    });
  } catch (error) {
    logger.error("Failed to delete soul chip", {
      requestId,
      soulChipId,
      error,
    });
    throw error;
  }
});

// POST /api/v1/soul-chips/:id/validate - Validate soul chip configuration
soulChipRoutes.post("/:id/validate", async (c) => {
  const requestId = c.get("requestId");
  const soulChipId = c.req.param("id");

  try {
    logger.info("Validating soul chip configuration", {
      requestId,
      soulChipId,
    });

    // Fetch soul chip from database
    await dtoService.initialize();
    const repositories = dtoService.getPrismaClient();

    const soulChipDTO = await repositories.soulChip.findById(soulChipId);

    if (!soulChipDTO) {
      return c.json(
        {
          success: false,
          error: {
            code: 404,
            message: "Soul chip not found",
            requestId,
          },
        },
        404
      );
    }

    // Basic validation (simplified)
    const validation = {
      isValid: true,
      errors: [] as string[],
      warnings: [] as string[],
    };

    // Basic soul chip validation logic
    if (!soulChipDTO.name || soulChipDTO.name.trim().length === 0) {
      validation.isValid = false;
      validation.errors.push("Soul chip name is required");
    }

    if (soulChipDTO.intelligence < 0 || soulChipDTO.intelligence > 100) {
      validation.isValid = false;
      validation.errors.push("Intelligence must be between 0 and 100");
    }

    if (soulChipDTO.resilience < 0 || soulChipDTO.resilience > 100) {
      validation.isValid = false;
      validation.errors.push("Resilience must be between 0 and 100");
    }

    if (soulChipDTO.adaptability < 0 || soulChipDTO.adaptability > 100) {
      validation.isValid = false;
      validation.errors.push("Adaptability must be between 0 and 100");
    }

    const totalStats =
      soulChipDTO.intelligence +
      soulChipDTO.resilience +
      soulChipDTO.adaptability;
    if (totalStats > 300) {
      validation.warnings.push("Total stats exceed recommended maximum of 300");
    }

    logger.info("Soul chip validation completed", {
      requestId,
      soulChipId,
      isValid: validation.isValid,
    });

    return c.json({
      success: true,
      data: {
        validation,
      },
      meta: {
        timestamp: new Date().toISOString(),
        requestId,
      },
    });
  } catch (error) {
    logger.error("Failed to validate soul chip", {
      requestId,
      soulChipId,
      error,
    });
    throw error;
  }
});

// POST /api/v1/soul-chips/:id/dialogue - Generate dialogue from soul chip
soulChipRoutes.post(
  "/:id/dialogue",
  zValidator(
    "json",
    z.object({
      context: z.string().min(1).max(500),
    })
  ),
  async (c) => {
    const requestId = c.get("requestId");
    const soulChipId = c.req.param("id");
    const { context } = c.req.valid("json");

    try {
      logger.info("Generating dialogue from soul chip", {
        requestId,
        soulChipId,
        context,
      });

      // Fetch soul chip from database
      await dtoService.initialize();
      const repositories = dtoService.getPrismaClient();

      const soulChipDTO = await repositories.soulChip.findById(soulChipId);

      if (!soulChipDTO) {
        return c.json(
          {
            success: false,
            error: {
              code: 404,
              message: "Soul chip not found",
              requestId,
            },
          },
          404
        );
      }

      // Generate dialogue based on personality (simplified)
      const personality = JSON.parse(soulChipDTO.personality || "{}");

      // Simple dialogue generation based on soul chip stats and personality
      let dialogue = "";
      if (soulChipDTO.intelligence > 70) {
        dialogue = `Based on my analysis of "${context}", I believe the optimal approach would be to consider multiple variables...`;
      } else if (soulChipDTO.resilience > 70) {
        dialogue = `"${context}" seems challenging, but I'm prepared to handle whatever comes our way.`;
      } else if (soulChipDTO.adaptability > 70) {
        dialogue = `Interesting context: "${context}". Let me adjust my approach accordingly...`;
      } else {
        dialogue = `I understand you're asking about "${context}". Let me think about this...`;
      }

      // Add personality flavor
      if (personality.dialogueStyle === "formal") {
        dialogue = dialogue
          .replace(/I'm/g, "I am")
          .replace(/Let me/g, "Allow me to");
      } else if (personality.dialogueStyle === "quirky") {
        dialogue += " *processing with enthusiasm* ⚡";
      }

      logger.info("Dialogue generated successfully", { requestId, soulChipId });

      return c.json({
        success: true,
        data: {
          dialogue,
          context,
          soulChipName: soulChipDTO.name,
          personality,
        },
        meta: {
          timestamp: new Date().toISOString(),
          requestId,
        },
      });
    } catch (error) {
      logger.error("Failed to generate dialogue", {
        requestId,
        soulChipId,
        error,
      });
      throw error;
    }
  }
);

export { soulChipRoutes };
