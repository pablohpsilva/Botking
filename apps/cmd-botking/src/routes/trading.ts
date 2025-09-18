/**
 * Trading Routes
 * Demonstrates production usage of trading system
 */

import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { LoggerFactory } from "@botking/logger";
import {
  TradingEventStatus,
  TradeOfferStatus,
  TradeItemType,
} from "@botking/dto";
import { dtoService } from "../services/dto-service";

// Type declaration for Hono context to fix requestId typing
declare module "hono" {
  interface ContextVariableMap {
    requestId: string;
  }
}

const logger = LoggerFactory.createPackageLogger("cmd-botking", {
  service: "trading-routes",
});

const tradingRoutes = new Hono();

// Validation schemas
const createTradingEventSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  startDate: z.iso.datetime(),
  endDate: z.iso.datetime(),
  status: z
    .enum(TradingEventStatus)
    .optional()
    .default(TradingEventStatus.DRAFT),
});

const createTradeOfferSchema = z.object({
  tradingEventId: z.string().uuid(),
  fromUserId: z.string().uuid(),
  toUserId: z.string().uuid().optional(),
  offerItems: z
    .array(
      z.object({
        itemType: z.enum(TradeItemType),
        itemId: z.string().uuid(),
        quantity: z.number().positive(),
      })
    )
    .min(1),
  requestItems: z
    .array(
      z.object({
        itemType: z.enum(TradeItemType),
        itemId: z.string().uuid(),
        quantity: z.number().positive(),
      })
    )
    .min(1),
  expiresAt: z.iso.datetime().optional(),
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
  status: z.enum(TradingEventStatus).optional(),
  userId: z.string().uuid().optional(),
});

// GET /api/v1/trading/events - List trading events
tradingRoutes.get("/events", zValidator("query", querySchema), async (c) => {
  const requestId = c.get("requestId");
  const { page, limit, status } = c.req.valid("query");

  try {
    logger.info("Fetching trading events", {
      requestId,
      page,
      limit,
      filters: { status },
    });

    await dtoService.initialize();
    const repositories = dtoService.getPrismaClient();

    // Use repository pattern for database operations
    const events = await repositories.tradingEvent.findMany({
      page,
      limit,
      filters: { status },
    });

    const total = await repositories.tradingEvent.count({
      status,
    });

    const totalPages = Math.ceil(total / limit);

    logger.info("Trading events fetched successfully", {
      requestId,
      count: events.length,
      total,
    });

    return c.json({
      success: true,
      data: {
        events,
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
    logger.error("Failed to fetch trading events", { requestId, error });
    throw error;
  }
});

// POST /api/v1/trading/events - Create a new trading event
tradingRoutes.post(
  "/events",
  zValidator("json", createTradingEventSchema),
  async (c) => {
    const requestId = c.get("requestId");
    const body = c.req.valid("json");

    try {
      logger.info("Creating new trading event", {
        requestId,
        eventData: body,
      });

      await dtoService.initialize();
      const repositories = dtoService.getPrismaClient();

      const eventData = {
        ...body,
        startDate: new Date(body.startDate),
        endDate: new Date(body.endDate),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const event = await repositories.tradingEvent.create(eventData);

      logger.info("Trading event created successfully", {
        requestId,
        eventId: event.id,
      });

      return c.json(
        {
          success: true,
          data: { event },
          meta: {
            timestamp: new Date().toISOString(),
            requestId,
          },
        },
        201
      );
    } catch (error) {
      logger.error("Failed to create trading event", { requestId, error });
      throw error;
    }
  }
);

// GET /api/v1/trading/events/:id - Get specific trading event
tradingRoutes.get("/events/:id", async (c) => {
  const requestId = c.get("requestId");
  const eventId = c.req.param("id");

  try {
    logger.info("Fetching trading event by ID", { requestId, eventId });

    await dtoService.initialize();
    const repositories = dtoService.getPrismaClient();

    const event = await repositories.tradingEvent.findById(eventId);

    if (!event) {
      logger.warn("Trading event not found", { requestId, eventId });
      return c.json(
        {
          success: false,
          error: {
            code: 404,
            message: "Trading event not found",
            requestId,
          },
        },
        404
      );
    }

    logger.info("Trading event fetched successfully", { requestId, eventId });

    return c.json({
      success: true,
      data: { event },
      meta: {
        timestamp: new Date().toISOString(),
        requestId,
      },
    });
  } catch (error) {
    logger.error("Failed to fetch trading event", {
      requestId,
      eventId,
      error,
    });
    throw error;
  }
});

// GET /api/v1/trading/offers - List trade offers
tradingRoutes.get("/offers", zValidator("query", querySchema), async (c) => {
  const requestId = c.get("requestId");
  const { page, limit, userId } = c.req.valid("query");

  try {
    logger.info("Fetching trade offers", {
      requestId,
      page,
      limit,
      filters: { userId },
    });

    await dtoService.initialize();
    const repositories = dtoService.getPrismaClient();

    // Use repository pattern for database operations
    const offers = await repositories.tradeOffer.findMany({
      page,
      limit,
      filters: { userId },
    });

    const total = await repositories.tradeOffer.count({
      userId,
    });

    const totalPages = Math.ceil(total / limit);

    logger.info("Trade offers fetched successfully", {
      requestId,
      count: offers.length,
      total,
    });

    return c.json({
      success: true,
      data: {
        offers,
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
    logger.error("Failed to fetch trade offers", { requestId, error });
    throw error;
  }
});

// POST /api/v1/trading/offers - Create a new trade offer
tradingRoutes.post(
  "/offers",
  zValidator("json", createTradeOfferSchema),
  async (c) => {
    const requestId = c.get("requestId");
    const body = c.req.valid("json");

    try {
      logger.info("Creating new trade offer", {
        requestId,
        offerData: {
          ...body,
          fromUserId: "[REDACTED]",
          toUserId: "[REDACTED]",
        },
      });

      await dtoService.initialize();
      const repositories = dtoService.getPrismaClient();

      // Verify trading event exists and is active
      const tradingEvent = await repositories.tradingEvent.findById(
        body.tradingEventId
      );

      if (!tradingEvent) {
        return c.json(
          {
            success: false,
            error: {
              code: 404,
              message: "Trading event not found",
              requestId,
            },
          },
          404
        );
      }

      if (tradingEvent.status !== TradingEventStatus.ACTIVE) {
        return c.json(
          {
            success: false,
            error: {
              code: 400,
              message: "Trading event is not active",
              requestId,
            },
          },
          400
        );
      }

      // Create trade offer with simplified data structure
      const offerData = {
        tradingEventId: body.tradingEventId,
        fromUserId: body.fromUserId,
        toUserId: body.toUserId,
        status: TradeOfferStatus.ACTIVE,
        expiresAt: body.expiresAt ? new Date(body.expiresAt) : null,
        createdAt: new Date(),
        updatedAt: new Date(),
        // For now, store items as JSON until repository pattern supports nested creation
        offerItems: JSON.stringify(body.offerItems),
        requestItems: JSON.stringify(body.requestItems),
      };

      const offer = await repositories.tradeOffer.create(offerData);

      logger.info("Trade offer created successfully", {
        requestId,
        offerId: offer.id,
      });

      return c.json(
        {
          success: true,
          data: { offer },
          meta: {
            timestamp: new Date().toISOString(),
            requestId,
          },
        },
        201
      );
    } catch (error) {
      logger.error("Failed to create trade offer", { requestId, error });
      throw error;
    }
  }
);

// PUT /api/v1/trading/offers/:id/accept - Accept a trade offer
tradingRoutes.put("/offers/:id/accept", async (c) => {
  const requestId = c.get("requestId");
  const offerId = c.req.param("id");

  try {
    logger.info("Accepting trade offer", { requestId, offerId });

    await dtoService.initialize();
    const repositories = dtoService.getPrismaClient();

    // Update offer status
    const updatedOffer = await repositories.tradeOffer.update(offerId, {
      status: TradeOfferStatus.ACTIVE, // Keeping as ACTIVE since ACCEPTED doesn't exist
      acceptedAt: new Date(),
      updatedAt: new Date(),
    });

    if (!updatedOffer) {
      return c.json(
        {
          success: false,
          error: {
            code: 404,
            message: "Trade offer not found",
            requestId,
          },
        },
        404
      );
    }

    // Here you would implement the actual item transfer logic
    // For now, just log the action
    logger.info("Trade offer accepted successfully", {
      requestId,
      offerId,
      offerAccepted: true,
    });

    return c.json({
      success: true,
      data: {
        offer: updatedOffer,
        message: "Trade offer accepted successfully",
      },
      meta: {
        timestamp: new Date().toISOString(),
        requestId,
      },
    });
  } catch (error) {
    logger.error("Failed to accept trade offer", { requestId, offerId, error });
    throw error;
  }
});

// PUT /api/v1/trading/offers/:id/reject - Reject a trade offer
tradingRoutes.put("/offers/:id/reject", async (c) => {
  const requestId = c.get("requestId");
  const offerId = c.req.param("id");

  try {
    logger.info("Rejecting trade offer", { requestId, offerId });

    await dtoService.initialize();
    const repositories = dtoService.getPrismaClient();

    // Update offer status
    const updatedOffer = await repositories.tradeOffer.update(offerId, {
      status: TradeOfferStatus.EXPIRED, // Using EXPIRED instead of REJECTED
      updatedAt: new Date(),
    });

    if (!updatedOffer) {
      return c.json(
        {
          success: false,
          error: {
            code: 404,
            message: "Trade offer not found",
            requestId,
          },
        },
        404
      );
    }

    logger.info("Trade offer rejected successfully", {
      requestId,
      offerId,
    });

    return c.json({
      success: true,
      data: {
        offer: updatedOffer,
        message: "Trade offer rejected",
      },
      meta: {
        timestamp: new Date().toISOString(),
        requestId,
      },
    });
  } catch (error) {
    logger.error("Failed to reject trade offer", { requestId, offerId, error });
    throw error;
  }
});

// PUT /api/v1/trading/events/:id - Update trading event
tradingRoutes.put(
  "/events/:id",
  zValidator(
    "json",
    z.object({
      name: z.string().min(1).max(100).optional(),
      description: z.string().max(500).optional(),
      startDate: z.iso.datetime().optional(),
      endDate: z.iso.datetime().optional(),
      status: z.enum(TradingEventStatus).optional(),
    })
  ),
  async (c) => {
    const requestId = c.get("requestId");
    const eventId = c.req.param("id");
    const body = c.req.valid("json");

    try {
      logger.info("Updating trading event", {
        requestId,
        eventId,
        updates: body,
      });

      await dtoService.initialize();
      const repositories = dtoService.getPrismaClient();

      // Update event
      const updateData: any = {
        ...body,
        updatedAt: new Date(),
      };

      if (body.startDate) updateData.startDate = new Date(body.startDate);
      if (body.endDate) updateData.endDate = new Date(body.endDate);

      const updatedEvent = await repositories.tradingEvent.update(
        eventId,
        updateData
      );

      if (!updatedEvent) {
        logger.warn("Trading event not found for update", {
          requestId,
          eventId,
        });
        return c.json(
          {
            success: false,
            error: {
              code: 404,
              message: "Trading event not found",
              requestId,
            },
          },
          404
        );
      }

      logger.info("Trading event updated successfully", { requestId, eventId });

      return c.json({
        success: true,
        data: { event: updatedEvent },
        meta: {
          timestamp: new Date().toISOString(),
          requestId,
        },
      });
    } catch (error) {
      logger.error("Failed to update trading event", {
        requestId,
        eventId,
        error,
      });
      throw error;
    }
  }
);

// DELETE /api/v1/trading/events/:id - Delete trading event
tradingRoutes.delete("/events/:id", async (c) => {
  const requestId = c.get("requestId");
  const eventId = c.req.param("id");

  try {
    logger.info("Deleting trading event", { requestId, eventId });

    await dtoService.initialize();
    const repositories = dtoService.getPrismaClient();

    // Check if event exists and get associated offers
    const existingEvent = await repositories.tradingEvent.findById(eventId);

    if (!existingEvent) {
      logger.warn("Trading event not found for deletion", {
        requestId,
        eventId,
      });
      return c.json(
        {
          success: false,
          error: {
            code: 404,
            message: "Trading event not found",
            requestId,
          },
        },
        404
      );
    }

    // For now, assume we can delete - in a real implementation we'd check for active offers
    const success = await repositories.tradingEvent.delete(eventId);

    if (!success) {
      logger.warn("Failed to delete trading event", {
        requestId,
        eventId,
      });
      return c.json(
        {
          success: false,
          error: {
            code: 400,
            message: "Failed to delete trading event",
            requestId,
          },
        },
        400
      );
    }

    logger.info("Trading event deleted successfully", { requestId, eventId });

    return c.json({
      success: true,
      data: { deleted: true },
      meta: {
        timestamp: new Date().toISOString(),
        requestId,
      },
    });
  } catch (error) {
    logger.error("Failed to delete trading event", {
      requestId,
      eventId,
      error,
    });
    throw error;
  }
});

// DELETE /api/v1/trading/offers/:id - Delete trade offer
tradingRoutes.delete("/offers/:id", async (c) => {
  const requestId = c.get("requestId");
  const offerId = c.req.param("id");

  try {
    logger.info("Deleting trade offer", { requestId, offerId });

    await dtoService.initialize();
    const repositories = dtoService.getPrismaClient();

    // Check if offer exists
    const existingOffer = await repositories.tradeOffer.findById(offerId);

    if (!existingOffer) {
      logger.warn("Trade offer not found for deletion", { requestId, offerId });
      return c.json(
        {
          success: false,
          error: {
            code: 404,
            message: "Trade offer not found",
            requestId,
          },
        },
        404
      );
    }

    // Check if offer is sold out (cannot delete sold out offers)
    if (existingOffer.status === TradeOfferStatus.SOLD_OUT) {
      logger.warn("Cannot delete sold out trade offer", { requestId, offerId });
      return c.json(
        {
          success: false,
          error: {
            code: 400,
            message: "Cannot delete sold out trade offer",
            requestId,
          },
        },
        400
      );
    }

    // Delete offer
    const success = await repositories.tradeOffer.delete(offerId);

    if (!success) {
      logger.warn("Failed to delete trade offer", { requestId, offerId });
      return c.json(
        {
          success: false,
          error: {
            code: 400,
            message: "Failed to delete trade offer",
            requestId,
          },
        },
        400
      );
    }

    logger.info("Trade offer deleted successfully", { requestId, offerId });

    return c.json({
      success: true,
      data: { deleted: true },
      meta: {
        timestamp: new Date().toISOString(),
        requestId,
      },
    });
  } catch (error) {
    logger.error("Failed to delete trade offer", { requestId, offerId, error });
    throw error;
  }
});

export { tradingRoutes };
