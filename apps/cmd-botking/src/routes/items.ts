/**
 * Item Management Routes
 * Demonstrates production usage of @botking/artifact ItemFactory
 */

import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { LoggerFactory } from "@botking/logger";
import {
  ItemCategory,
  Rarity,
  ResourceType,
  SpeedUpTarget,
  GemType,
} from "@botking/dto";
import { dtoService } from "@/services/dto-service";

// Type declaration for Hono context to fix requestId typing
declare module "hono" {
  interface ContextVariableMap {
    requestId: string;
  }
}

const logger = LoggerFactory.createPackageLogger("cmd-botking", {
  service: "item-routes",
});

const itemRoutes = new Hono();

// Validation schemas
const createItemSchema = z.object({
  name: z.string().min(1).max(100),
  category: z.nativeEnum(ItemCategory),
  rarity: z.nativeEnum(Rarity).optional().default(Rarity.COMMON),
  description: z.string().max(500).optional(),
  // Category-specific fields
  resourceType: z.nativeEnum(ResourceType).optional(),
  resourceAmount: z.number().positive().optional(),
  speedUpTarget: z.nativeEnum(SpeedUpTarget).optional(),
  speedMultiplier: z.number().positive().optional(),
  timeReduction: z.number().positive().optional(),
  gemType: z.nativeEnum(GemType).optional(),
  gemValue: z.number().positive().optional(),
  baseValue: z.number().positive().optional(),
});

const updateItemSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  description: z.string().max(500).optional(),
  rarity: z.nativeEnum(Rarity).optional(),
  // Category-specific fields (optional for updates)
  resourceAmount: z.number().positive().optional(),
  speedMultiplier: z.number().positive().optional(),
  timeReduction: z.number().positive().optional(),
  gemValue: z.number().positive().optional(),
  baseValue: z.number().positive().optional(),
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
  category: z.nativeEnum(ItemCategory).optional(),
  rarity: z.nativeEnum(Rarity).optional(),
  isProtected: z
    .string()
    .transform((val) => val === "true")
    .optional(),
});

// GET /api/v1/items - List items with pagination
itemRoutes.get("/", zValidator("query", querySchema), async (c) => {
  const requestId = c.get("requestId");
  const { page, limit, category, rarity, isProtected } = c.req.valid("query");

  try {
    logger.info("Fetching items list", {
      requestId,
      page,
      limit,
      filters: { category, rarity, isProtected },
    });

    await dtoService.initialize();
    const repositories = dtoService.getPrismaClient();

    // Use repository pattern for database operations
    const items = await repositories.item.findMany({
      page,
      limit,
      filters: { category, rarity, isProtected },
    });

    const total = await repositories.item.count({
      category,
      rarity,
      isProtected,
    });

    const totalPages = Math.ceil(total / limit);

    logger.info("Items fetched successfully", {
      requestId,
      count: items.length,
      total,
    });

    return c.json({
      success: true,
      data: {
        items,
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
    logger.error("Failed to fetch items", { requestId, error });
    throw error;
  }
});

// POST /api/v1/items - Create a new item
itemRoutes.post("/", zValidator("json", createItemSchema), async (c) => {
  const requestId = c.get("requestId");
  const body = c.req.valid("json");

  try {
    logger.info("Creating new item", {
      requestId,
      itemData: body,
    });

    // Create item directly for database (simplified approach)
    const itemData: any = {
      name: body.name,
      category: body.category,
      rarity: body.rarity,
      description: body.description || `${body.name} - ${body.category}`,
      value: body.baseValue || 100,
      userId: "system", // Default system user for now
    };

    // Add category-specific fields
    switch (body.category) {
      case ItemCategory.SPEED_UP:
        if (
          !body.speedUpTarget ||
          !body.speedMultiplier ||
          !body.timeReduction
        ) {
          return c.json(
            {
              success: false,
              error: {
                code: 400,
                message:
                  "Speed up items require speedUpTarget, speedMultiplier, and timeReduction",
                requestId,
              },
            },
            400
          );
        }
        itemData.speedUpTarget = body.speedUpTarget;
        itemData.speedMultiplier = body.speedMultiplier;
        itemData.timeReduction = body.timeReduction;
        break;

      case ItemCategory.RESOURCE:
        if (!body.resourceType) {
          return c.json(
            {
              success: false,
              error: {
                code: 400,
                message: "Resource items require resourceType",
                requestId,
              },
            },
            400
          );
        }
        itemData.resourceType = body.resourceType;
        itemData.resourceAmount = body.resourceAmount || 1;
        break;

      case ItemCategory.GEMS:
        if (!body.gemType) {
          return c.json(
            {
              success: false,
              error: {
                code: 400,
                message: "Gem items require gemType",
                requestId,
              },
            },
            400
          );
        }
        itemData.gemType = body.gemType;
        itemData.gemValue = body.gemValue;
        break;

      case ItemCategory.TRADEABLE:
        itemData.tradeable = true;
        break;
    }

    await dtoService.initialize();
    const repositories = dtoService.getPrismaClient();

    const savedItem = await repositories.item.create(itemData);

    logger.info("Item created successfully", {
      requestId,
      itemId: savedItem.id,
    });

    return c.json(
      {
        success: true,
        data: {
          item: savedItem,
        },
        meta: {
          timestamp: new Date().toISOString(),
          requestId,
        },
      },
      201
    );
  } catch (error) {
    logger.error("Failed to create item", { requestId, error });
    throw error;
  }
});

// GET /api/v1/items/:id - Get specific item
itemRoutes.get("/:id", async (c) => {
  const requestId = c.get("requestId");
  const itemId = c.req.param("id");

  try {
    logger.info("Fetching item by ID", { requestId, itemId });

    await dtoService.initialize();
    const repositories = dtoService.getPrismaClient();

    const item = await repositories.item.findById(itemId);

    if (!item) {
      logger.warn("Item not found", { requestId, itemId });
      return c.json(
        {
          success: false,
          error: {
            code: 404,
            message: "Item not found",
            requestId,
          },
        },
        404
      );
    }

    logger.info("Item fetched successfully", { requestId, itemId });

    return c.json({
      success: true,
      data: { item },
      meta: {
        timestamp: new Date().toISOString(),
        requestId,
      },
    });
  } catch (error) {
    logger.error("Failed to fetch item", { requestId, itemId, error });
    throw error;
  }
});

// PUT /api/v1/items/:id - Update item
itemRoutes.put("/:id", zValidator("json", updateItemSchema), async (c) => {
  const requestId = c.get("requestId");
  const itemId = c.req.param("id");
  const body = c.req.valid("json");

  try {
    logger.info("Updating item", { requestId, itemId, updates: body });

    await dtoService.initialize();
    const repositories = dtoService.getPrismaClient();

    const updatedItem = await repositories.item.update(itemId, {
      ...body,
      updatedAt: new Date(),
    });

    if (!updatedItem) {
      logger.warn("Item not found for update", { requestId, itemId });
      return c.json(
        {
          success: false,
          error: {
            code: 404,
            message: "Item not found",
            requestId,
          },
        },
        404
      );
    }

    logger.info("Item updated successfully", { requestId, itemId });

    return c.json({
      success: true,
      data: { item: updatedItem },
      meta: {
        timestamp: new Date().toISOString(),
        requestId,
      },
    });
  } catch (error) {
    logger.error("Failed to update item", { requestId, itemId, error });
    throw error;
  }
});

// DELETE /api/v1/items/:id - Delete item
itemRoutes.delete("/:id", async (c) => {
  const requestId = c.get("requestId");
  const itemId = c.req.param("id");

  try {
    logger.info("Deleting item", { requestId, itemId });

    await dtoService.initialize();
    const repositories = dtoService.getPrismaClient();

    const success = await repositories.item.delete(itemId);

    if (!success) {
      logger.warn("Item not found for deletion", { requestId, itemId });
      return c.json(
        {
          success: false,
          error: {
            code: 404,
            message: "Item not found",
            requestId,
          },
        },
        404
      );
    }

    logger.info("Item deleted successfully", { requestId, itemId });

    return c.json({
      success: true,
      data: { deleted: true },
      meta: {
        timestamp: new Date().toISOString(),
        requestId,
      },
    });
  } catch (error) {
    logger.error("Failed to delete item", { requestId, itemId, error });
    throw error;
  }
});

// POST /api/v1/items/:id/validate - Validate item configuration
itemRoutes.post("/:id/validate", async (c) => {
  const requestId = c.get("requestId");
  const itemId = c.req.param("id");

  try {
    logger.info("Validating item configuration", { requestId, itemId });

    // Fetch item from database
    await dtoService.initialize();
    const repositories = dtoService.getPrismaClient();

    const itemDTO = await repositories.item.findById(itemId);

    if (!itemDTO) {
      return c.json(
        {
          success: false,
          error: {
            code: 404,
            message: "Item not found",
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

    // Basic item validation logic
    if (!itemDTO.name || itemDTO.name.trim().length === 0) {
      validation.isValid = false;
      validation.errors.push("Item name is required");
    }

    if (!itemDTO.category) {
      validation.isValid = false;
      validation.errors.push("Item category is required");
    }

    if (itemDTO.value && itemDTO.value < 0) {
      validation.warnings.push("Item value should not be negative");
    }

    logger.info("Item validation completed", {
      requestId,
      itemId,
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
    logger.error("Failed to validate item", { requestId, itemId, error });
    throw error;
  }
});

export { itemRoutes };
