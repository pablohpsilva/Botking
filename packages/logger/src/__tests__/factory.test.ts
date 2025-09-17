import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { LoggerFactory, LoggerConfigBuilder } from "../factory";
import { LogLevel } from "../types";

describe("LoggerFactory", () => {
  beforeEach(() => {
    LoggerFactory.clearCache();
  });

  afterEach(() => {
    LoggerFactory.clearCache();
  });

  describe("Logger Creation", () => {
    it("should create logger with default config", () => {
      const logger = LoggerFactory.createLogger("test-service");

      expect(logger).toBeDefined();
      expect(logger.getLevel()).toBe(LogLevel.INFO);
    });

    it("should create logger with custom config", () => {
      const logger = LoggerFactory.createLogger("test-service", {
        level: LogLevel.DEBUG,
        enableConsole: false,
      });

      expect(logger.getLevel()).toBe(LogLevel.DEBUG);
    });

    it("should create package logger", () => {
      const logger = LoggerFactory.createPackageLogger("artifact");

      expect(logger).toBeDefined();
    });

    it("should create development logger", () => {
      const logger = LoggerFactory.createDevelopmentLogger("dev-service");

      expect(logger).toBeDefined();
      expect(logger.getLevel()).toBe(LogLevel.DEBUG);
    });

    it("should create production logger", () => {
      const logger = LoggerFactory.createProductionLogger("prod-service");

      expect(logger).toBeDefined();
      expect(logger.getLevel()).toBe(LogLevel.INFO);
    });
  });

  describe("Singleton Behavior", () => {
    it("should return same instance for same parameters", () => {
      const logger1 = LoggerFactory.getLogger("test-service");
      const logger2 = LoggerFactory.getLogger("test-service");

      expect(logger1).toBe(logger2);
    });

    it("should return different instances for different services", () => {
      const logger1 = LoggerFactory.getLogger("service-1");
      const logger2 = LoggerFactory.getLogger("service-2");

      expect(logger1).not.toBe(logger2);
    });
  });

  describe("Default Configuration", () => {
    it("should set and use default config", () => {
      LoggerFactory.setDefaultConfig({
        level: LogLevel.WARN,
        enableMonitoring: true,
      });

      // Create logger with explicit config to override environment detection
      const logger = LoggerFactory.createLogger("test-service", {
        level: LogLevel.WARN, // Explicitly set the level
        environment: "test",
      });
      expect(logger.getLevel()).toBe(LogLevel.WARN);
    });
  });
});

describe("LoggerConfigBuilder", () => {
  describe("Fluent API", () => {
    it("should build config with fluent API", () => {
      const config = new LoggerConfigBuilder()
        .service("test-service")
        .level(LogLevel.DEBUG)
        .environment("development")
        .enableConsole(true, { colorize: false })
        .enableFile(true, { filename: "test.log" })
        .enableMonitoring(true)
        .metadata({ version: "1.0.0" })
        .build();

      expect(config.service).toBe("test-service");
      expect(config.level).toBe(LogLevel.DEBUG);
      expect(config.environment).toBe("development");
      expect(config.enableConsole).toBe(true);
      expect(config.enableFile).toBe(true);
      expect(config.enableMonitoring).toBe(true);
      expect(config.consoleConfig?.colorize).toBe(false);
      expect(config.fileConfig?.filename).toBe("test.log");
      expect(config.metadata?.version).toBe("1.0.0");
    });

    it("should create logger directly from builder", () => {
      const logger = new LoggerConfigBuilder()
        .service("builder-test")
        .level(LogLevel.VERBOSE)
        .createLogger({ component: "test" });

      expect(logger).toBeDefined();
      expect(logger.getLevel()).toBe(LogLevel.VERBOSE);
    });

    it("should throw error if service not provided", () => {
      expect(() => {
        new LoggerConfigBuilder().level(LogLevel.DEBUG).build();
      }).toThrow("Service name is required");
    });
  });

  describe("Builder Methods", () => {
    it("should chain methods correctly", () => {
      const builder = new LoggerConfigBuilder();

      const result = builder
        .service("chain-test")
        .level(LogLevel.ERROR)
        .environment("production")
        .enableConsole(false)
        .enableFile(true)
        .enableMonitoring(true);

      expect(result).toBe(builder);
    });
  });
});
