/**
 * cmd-botking - Simplified Production Hono Application
 *
 * This application demonstrates the core Botking system functionality:
 * - Artifact creation via @botking/artifact
 * - DTO persistence via @botking/dto
 * - Structured logging via @botking/logger
 * - Database integration via @botking/db
 */

import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { prettyJSON } from "hono/pretty-json";

// Import our packages
import { LoggerFactory } from "@botking/logger";
import {
  BotDTOFactory,
  ItemDTOFactory,
  SoulChipDTOFactory,
  Rarity,
} from "@botking/dto";
import { DTOExample } from "@botking/dto";

// Import middleware
import { errorHandler } from "./middleware/error-handler";
import { setupLogging } from "./middleware/logging";
import { requestId } from "./middleware/request-id";

// Import routes
import { botRoutes } from "./routes/bots";
import { itemRoutes } from "./routes/items";
import { soulChipRoutes } from "./routes/soul-chips";
import { tradingRoutes } from "./routes/trading";
import { userRoutes } from "./routes/users";
import { accountRoutes } from "./routes/accounts";
import { healthRoutes } from "./routes/health";
import { docsRoutes } from "./routes/docs";

const logger = LoggerFactory.createPackageLogger("cmd-botking", {
  service: "main",
});

// Create Hono app
const app = new Hono();

// Setup middleware
app.use("*", cors());
app.use("*", requestId);
app.use("*", setupLogging);
app.use("*", prettyJSON());

// Setup custom error handler
app.onError(errorHandler);

// Root route
app.get("/", (c) => {
  logger.info("Root endpoint accessed");

  return c.json({
    name: "cmd-botking",
    version: "1.0.0",
    description:
      "Production Botking API demonstrating artifact-first architecture",
    packages: {
      "@botking/artifact": "Object creation and business logic",
      "@botking/dto": "Data persistence and validation",
      "@botking/logger": "Structured logging",
      "@botking/db": "Database integration",
      "@botking/domain": "Business rules",
      "@botking/time-chain": "Time management",
    },
    endpoints: {
      "/": "This endpoint",
      "/health": "Health check",
      "/docs": "API documentation",
      "/api/v1/bots": "Bot management CRUD",
      "/api/v1/items": "Item management CRUD",
      "/api/v1/soul-chips": "Soul chip management CRUD",
      "/api/v1/trading": "Trading system CRUD",
      "/api/v1/users": "User management CRUD",
      "/api/v1/accounts": "Account management CRUD",
      "/demo/bot": "Create demo bot using artifacts",
      "/demo/item": "Create demo item using artifacts",
      "/demo/soul-chip": "Create demo soul chip using artifacts",
      "/demo/workflow": "Full workflow demonstration",
    },
    timestamp: new Date().toISOString(),
  });
});

// Mount API routes
app.route("/api/v1/bots", botRoutes);
app.route("/api/v1/items", itemRoutes);
app.route("/api/v1/soul-chips", soulChipRoutes);
app.route("/api/v1/trading", tradingRoutes);
app.route("/api/v1/users", userRoutes);
app.route("/api/v1/accounts", accountRoutes);

// Mount health and docs routes
app.route("/health", healthRoutes);
app.route("/docs", docsRoutes);

// Note: Health routes are now handled by the dedicated health router

// Demo: Create bot using artifacts
app.post("/demo/bot", async (c) => {
  try {
    logger.info("Creating demo bot using artifacts");

    const botFactory = new BotDTOFactory();

    // Create worker bot using artifact factory
    const workerBot = botFactory.createWorkerArtifact(
      "Demo Mining Bot",
      "demo-user-123",
      "MINING"
    );

    // Validate using domain logic
    const validation = botFactory.validateArtifact(workerBot);

    // Convert to DTO for "persistence"
    const botDTO = botFactory.artifactToDTO(workerBot);

    logger.info("Demo bot created successfully", {
      botId: workerBot.id,
      validationScore: validation.isValid ? 100 : 0,
    });

    return c.json({
      success: true,
      message: "Bot created using @botking/artifact factory",
      data: {
        artifact: {
          id: workerBot.id,
          name: workerBot.name,
          botType: workerBot.botType,
          assemblyDate: workerBot.assemblyDate,
        },
        dto: {
          id: botDTO.id,
          name: botDTO.name,
          botType: botDTO.botType,
        },
        validation: {
          isValid: validation.isValid,
          warnings: validation.warnings,
        },
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    logger.error("Failed to create demo bot", { error });
    throw error;
  }
});

// Demo: Create item using artifacts
app.post("/demo/item", async (c) => {
  try {
    logger.info("Creating demo item using artifacts");

    const itemFactory = new ItemDTOFactory();

    // Create speed-up item using artifact factory
    const speedUpItem = itemFactory.createSpeedUpArtifact(
      "Turbo Boost",
      "BOT_CONSTRUCTION" as any,
      2.0,
      3600
    );

    // Validate
    const validation = itemFactory.validateArtifact(speedUpItem);

    // Convert to DTO
    const itemDTO = itemFactory.artifactToDTO(speedUpItem);

    logger.info("Demo item created successfully", {
      itemId: speedUpItem.id,
      category: speedUpItem.category,
    });

    return c.json({
      success: true,
      message: "Item created using @botking/artifact factory",
      data: {
        artifact: {
          id: speedUpItem.id,
          name: speedUpItem.name,
          category: speedUpItem.category,
          rarity: speedUpItem.rarity,
        },
        dto: {
          id: itemDTO.id,
          name: itemDTO.name,
          category: itemDTO.category,
        },
        validation: {
          isValid: validation.isValid,
          warnings: validation.warnings,
        },
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    logger.error("Failed to create demo item", { error });
    throw error;
  }
});

// Demo: Create soul chip using artifacts
app.post("/demo/soul-chip", async (c) => {
  try {
    logger.info("Creating demo soul chip using artifacts");

    const soulChipFactory = new SoulChipDTOFactory();

    // Create empathetic soul chip
    const soulChip = soulChipFactory.createEmpatheticArtifact(
      "Friendly Companion",
      Rarity.UNCOMMON
    );

    // Validate
    const validation = soulChipFactory.validateArtifact(soulChip);

    // Convert to DTO
    const soulChipDTO = soulChipFactory.artifactToDTO(soulChip);

    // Generate sample dialogue
    const dialogue = soulChip.generateDialogue("Hello, how are you today?");

    logger.info("Demo soul chip created successfully", {
      soulChipId: soulChip.id,
      rarity: soulChip.rarity,
    });

    return c.json({
      success: true,
      message: "Soul chip created using @botking/artifact",
      data: {
        artifact: {
          id: soulChip.id,
          name: soulChip.name,
          rarity: soulChip.rarity,
          specialTrait: soulChip.specialTrait,
          personality: soulChip.personality,
        },
        dto: {
          id: soulChipDTO.id,
          name: soulChipDTO.name,
          rarity: soulChipDTO.rarity,
        },
        dialogue: dialogue,
        validation: {
          isValid: validation.isValid,
          warnings: validation.warnings,
        },
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    logger.error("Failed to create demo soul chip", { error });
    throw error;
  }
});

// Demo: Full workflow
app.get("/demo/workflow", async (c) => {
  try {
    logger.info("Running full workflow demonstration");

    // Run the DTO example workflow
    DTOExample.demonstrateWorkflow();

    logger.info("Workflow demonstration completed");

    return c.json({
      success: true,
      message: "Full workflow demonstration completed",
      description:
        "This demonstrates the complete artifact-first architecture with all packages working together",
      workflow: [
        "1. Create artifacts using @botking/artifact factories",
        "2. Validate using domain logic from @botking/artifact",
        "3. Convert to DTOs using @botking/dto for persistence",
        "4. Log all operations with @botking/logger",
        "5. Demonstrate clean separation of concerns",
      ],
      packages_used: [
        "@botking/artifact - Object creation and business logic",
        "@botking/dto - Data persistence layer",
        "@botking/logger - Structured logging",
      ],
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    logger.error("Workflow demonstration failed", { error });
    throw error;
  }
});

// 404 handler
app.notFound((c) => {
  logger.warn("Route not found", { path: c.req.path });

  return c.json(
    {
      success: false,
      error: {
        message: "Route not found",
        path: c.req.path,
        availableEndpoints: [
          "/",
          "/health",
          "/docs",
          "/api/v1/bots",
          "/api/v1/items",
          "/api/v1/soul-chips",
          "/api/v1/trading",
          "/api/v1/users",
          "/api/v1/accounts",
          "/demo/bot",
          "/demo/item",
          "/demo/soul-chip",
          "/demo/workflow",
        ],
      },
    },
    404
  );
});

// Start server
async function startServer() {
  const port = Number(process.env.PORT) || 3001;

  try {
    logger.info("Starting cmd-botking application", { port });

    serve({
      fetch: app.fetch,
      port,
    });

    console.log(`🚀 cmd-botking server running on http://localhost:${port}`);
    console.log(`🎯 API Endpoints:`);
    console.log(`   • GET  http://localhost:${port}/               - API info`);
    console.log(
      `   • GET  http://localhost:${port}/health         - Health check`
    );
    console.log(
      `   • GET  http://localhost:${port}/docs           - API documentation`
    );
    console.log(
      `   • CRUD http://localhost:${port}/api/v1/bots    - Bot management`
    );
    console.log(
      `   • CRUD http://localhost:${port}/api/v1/items   - Item management`
    );
    console.log(
      `   • CRUD http://localhost:${port}/api/v1/soul-chips - Soul chip management`
    );
    console.log(
      `   • CRUD http://localhost:${port}/api/v1/trading - Trading system`
    );
    console.log(
      `   • CRUD http://localhost:${port}/api/v1/users   - User management`
    );
    console.log(
      `   • CRUD http://localhost:${port}/api/v1/accounts - Account management`
    );
    console.log(`🧪 Demo Endpoints:`);
    console.log(
      `   • POST http://localhost:${port}/demo/bot       - Create demo bot`
    );
    console.log(
      `   • POST http://localhost:${port}/demo/item      - Create demo item`
    );
    console.log(
      `   • POST http://localhost:${port}/demo/soul-chip - Create demo soul chip`
    );
    console.log(
      `   • GET  http://localhost:${port}/demo/workflow  - Full workflow demo`
    );
  } catch (error) {
    logger.error("Failed to start server", { error });
    process.exit(1);
  }
}

// Graceful shutdown
process.on("SIGINT", () => {
  logger.info("Received SIGINT, shutting down gracefully");
  process.exit(0);
});

process.on("SIGTERM", () => {
  logger.info("Received SIGTERM, shutting down gracefully");
  process.exit(0);
});

// Start the server
startServer().catch((error) => {
  console.error("💥 Fatal error during startup:", error);
  process.exit(1);
});
