import { describe, it, expect, beforeEach, vi } from "vitest";
import { Logger } from "../logger";
import { LogLevel, LoggerConfig, MonitoringEventType } from "../types";
import { ConsoleMonitoringPlugin } from "../plugins/console-monitoring-plugin";

describe("Logger", () => {
  let mockConfig: LoggerConfig;
  let logger: Logger;

  beforeEach(() => {
    mockConfig = {
      level: LogLevel.DEBUG,
      service: "test-service",
      environment: "test",
      enableConsole: false, // Disable console output in tests
      enableFile: false,
      enableMonitoring: true,
    };

    logger = new Logger(mockConfig);
  });

  describe("Basic Logging", () => {
    it("should create logger instance", () => {
      expect(logger).toBeInstanceOf(Logger);
      expect(logger.getLevel()).toBe(LogLevel.DEBUG);
    });

    it("should log messages at different levels", () => {
      // These won't output to console in test mode
      expect(() => {
        logger.error("Test error");
        logger.warn("Test warning");
        logger.info("Test info");
        logger.debug("Test debug");
      }).not.toThrow();
    });

    it("should log with context", () => {
      const context = { userId: "test123", action: "login" };

      expect(() => {
        logger.info("User logged in", context);
      }).not.toThrow();
    });

    it("should log errors with stack traces", () => {
      const error = new Error("Test error");

      expect(() => {
        logger.error("Something went wrong", { action: "test" }, error);
      }).not.toThrow();
    });
  });

  describe("Child Loggers", () => {
    it("should create child logger with additional context", () => {
      const childLogger = logger.child({ userId: "test123" });

      expect(childLogger).toBeDefined();
      expect(() => {
        childLogger.info("Child log message");
      }).not.toThrow();
    });
  });

  describe("Performance Tracking", () => {
    it("should track performance with timer", () => {
      const stopTimer = logger.startTimer("test-operation");

      // Simulate some work
      setTimeout(() => {
        stopTimer();
      }, 10);

      expect(stopTimer).toBeInstanceOf(Function);
    });

    it("should track async operations", async () => {
      const asyncOperation = async () => {
        await new Promise((resolve) => setTimeout(resolve, 10));
        return "result";
      };

      const result = await logger.timeAsync("async-test", asyncOperation);
      expect(result).toBe("result");
    });

    it("should track failed async operations", async () => {
      const failingOperation = async () => {
        throw new Error("Operation failed");
      };

      await expect(
        logger.timeAsync("failing-test", failingOperation)
      ).rejects.toThrow("Operation failed");
    });
  });

  describe("Monitoring Events", () => {
    it("should track monitoring events", () => {
      const event = {
        type: MonitoringEventType.USER_ACTION,
        name: "user-login",
        data: { method: "oauth" },
        timestamp: new Date(),
        userId: "test123",
        severity: "medium" as const,
      };

      expect(() => {
        logger.trackEvent(event);
      }).not.toThrow();
    });

    it("should track performance metrics", () => {
      const metrics = {
        operation: "database-query",
        duration: 150,
        success: true,
        timestamp: new Date(),
        metadata: { table: "users" },
      };

      expect(() => {
        logger.trackPerformance(metrics);
      }).not.toThrow();
    });
  });

  describe("Plugin Management", () => {
    it("should add and remove plugins", async () => {
      const plugin = new ConsoleMonitoringPlugin();
      await plugin.initialize({ enabled: false }); // Don't spam console

      logger.addPlugin(plugin);
      expect(() => {
        logger.info("Test with plugin");
      }).not.toThrow();

      logger.removePlugin(plugin.name);
      expect(() => {
        logger.info("Test without plugin");
      }).not.toThrow();
    });
  });

  describe("Configuration", () => {
    it("should change log level", () => {
      logger.setLevel(LogLevel.ERROR);
      expect(logger.getLevel()).toBe(LogLevel.ERROR);
    });

    it("should handle different environments", () => {
      const prodConfig = {
        ...mockConfig,
        environment: "production" as const,
        enableFile: true,
      };

      const prodLogger = new Logger(prodConfig);
      expect(() => {
        prodLogger.info("Production log");
      }).not.toThrow();
    });
  });
});
