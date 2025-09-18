/**
 * Health Check Routes
 * Provides comprehensive system health monitoring
 */

import { Hono } from "hono";
import { LoggerFactory } from "@botking/logger";
import { dtoService } from "../services/dto-service";
import { ApplicationService } from "../services/application-service";

const logger = LoggerFactory.createPackageLogger("cmd-botking", {
  service: "health-routes",
});

const healthRoutes = new Hono();

// Basic health check
healthRoutes.get("/", async (c) => {
  const requestId = c.get("requestId");

  try {
    logger.info("Health check requested", { requestId });

    const checks = await Promise.allSettled([
      dtoService.getHealthStatus(),
      ApplicationService.getHealthStatus(),
    ]);

    const [dbHealth, appHealth] = checks;

    const overallHealth =
      dbHealth.status === "fulfilled" &&
      dbHealth.value.isHealthy &&
      appHealth.status === "fulfilled" &&
      appHealth.value.isHealthy;

    const healthData = {
      status: overallHealth ? "healthy" : "unhealthy",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      version: "1.0.0",
      environment: process.env.NODE_ENV || "development",
      requestId,
      services: {
        database:
          dbHealth.status === "fulfilled"
            ? dbHealth.value
            : {
                isHealthy: false,
                error: "Service check failed",
              },
        application:
          appHealth.status === "fulfilled"
            ? appHealth.value
            : {
                isHealthy: false,
                error: "Service check failed",
              },
      },
      system: {
        memory: {
          used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
          total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
          limit: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
        },
        cpu: {
          usage: process.cpuUsage(),
        },
        node: {
          version: process.version,
          platform: process.platform,
          arch: process.arch,
        },
      },
    };

    logger.info("Health check completed", {
      requestId,
      status: healthData.status,
      dbHealthy: healthData.services.database.isHealthy,
      appHealthy: healthData.services.application.isHealthy,
    });

    return c.json(healthData, overallHealth ? 200 : 503);
  } catch (error) {
    logger.error("Health check failed", { requestId, error });

    return c.json(
      {
        status: "error",
        timestamp: new Date().toISOString(),
        error: "Health check failed",
        requestId,
      },
      500
    );
  }
});

// Detailed health check
healthRoutes.get("/detailed", async (c) => {
  const requestId = c.get("requestId");

  try {
    logger.info("Detailed health check requested", { requestId });

    // Get detailed health information
    const [dbHealth, appHealth] = await Promise.allSettled([
      dtoService.getHealthStatus(),
      ApplicationService.getHealthStatus(),
    ]);

    const healthData = {
      status: "healthy",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      version: "1.0.0",
      environment: process.env.NODE_ENV || "development",
      requestId,
      services: {
        database:
          dbHealth.status === "fulfilled"
            ? dbHealth.value
            : {
                isHealthy: false,
                error: "Database check failed",
                details: dbHealth.reason,
              },
        application:
          appHealth.status === "fulfilled"
            ? appHealth.value
            : {
                isHealthy: false,
                error: "Application check failed",
                details: appHealth.reason,
              },
      },
      system: {
        memory: {
          rss: Math.round(process.memoryUsage().rss / 1024 / 1024),
          heapTotal: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
          heapUsed: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
          external: Math.round(process.memoryUsage().external / 1024 / 1024),
          arrayBuffers: Math.round(
            process.memoryUsage().arrayBuffers / 1024 / 1024
          ),
        },
        cpu: process.cpuUsage(),
        node: {
          version: process.version,
          platform: process.platform,
          arch: process.arch,
          pid: process.pid,
          ppid: process.ppid,
        },
        env: {
          nodeEnv: process.env.NODE_ENV,
          port: process.env.PORT,
          // Add other safe environment variables
        },
      },
      packages: {
        "@botking/db": "workspace:*",
        "@botking/domain": "workspace:*",
        "@botking/artifact": "workspace:*",
        "@botking/dto": "workspace:*",
        "@botking/logger": "workspace:*",
        "@botking/time-chain": "workspace:*",
      },
    };

    logger.info("Detailed health check completed", { requestId });

    return c.json(healthData);
  } catch (error) {
    logger.error("Detailed health check failed", { requestId, error });

    return c.json(
      {
        status: "error",
        timestamp: new Date().toISOString(),
        error: "Detailed health check failed",
        requestId,
      },
      500
    );
  }
});

// Readiness probe (for Kubernetes)
healthRoutes.get("/ready", async (c) => {
  const requestId = c.get("requestId");

  try {
    // Check if all critical services are ready
    const dbHealth = await dtoService.getHealthStatus();
    const appHealth = await ApplicationService.getHealthStatus();

    const isReady = dbHealth.isHealthy && appHealth.isHealthy;

    logger.info("Readiness check", {
      requestId,
      ready: isReady,
      dbReady: dbHealth.isHealthy,
      appReady: appHealth.isHealthy,
    });

    return c.json(
      {
        ready: isReady,
        timestamp: new Date().toISOString(),
        requestId,
      },
      isReady ? 200 : 503
    );
  } catch (error) {
    logger.error("Readiness check failed", { requestId, error });

    return c.json(
      {
        ready: false,
        timestamp: new Date().toISOString(),
        error: "Readiness check failed",
        requestId,
      },
      503
    );
  }
});

// Liveness probe (for Kubernetes)
healthRoutes.get("/live", async (c) => {
  const requestId = c.get("requestId");

  try {
    // Basic liveness check - just verify the application is responding
    logger.info("Liveness check", { requestId });

    return c.json({
      alive: true,
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      requestId,
    });
  } catch (error) {
    logger.error("Liveness check failed", { requestId, error });

    return c.json(
      {
        alive: false,
        timestamp: new Date().toISOString(),
        error: "Liveness check failed",
        requestId,
      },
      500
    );
  }
});

export { healthRoutes };
