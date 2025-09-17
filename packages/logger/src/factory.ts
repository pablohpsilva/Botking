import { Logger } from "./logger";
import {
  ILogger,
  IMonitoringPlugin,
  LoggerConfig,
  LogLevel,
  LogContext,
} from "./types";
import { ConsoleMonitoringPlugin } from "./plugins/console-monitoring-plugin";

/**
 * Logger factory for creating and managing logger instances
 */
export class LoggerFactory {
  private static instances: Map<string, ILogger> = new Map();
  private static defaultConfig: Partial<LoggerConfig> = {
    level: LogLevel.INFO,
    environment: "development",
    enableConsole: true,
    enableFile: false,
    enableMonitoring: false,
    consoleConfig: {
      colorize: true,
      timestamp: true,
    },
  };

  /**
   * Create a new logger instance
   */
  static createLogger(
    service: string,
    config: Partial<LoggerConfig> = {},
    context: LogContext = {}
  ): ILogger {
    const fullConfig: LoggerConfig = {
      ...this.defaultConfig,
      ...config,
      service,
      level: config.level || this.getLogLevelFromEnv(),
      environment: config.environment || this.getEnvironmentFromEnv(),
    } as LoggerConfig;

    const logger = new Logger(fullConfig, context);

    // Auto-add console monitoring plugin in development
    if (
      fullConfig.environment === "development" &&
      fullConfig.enableMonitoring
    ) {
      const consolePlugin = new ConsoleMonitoringPlugin();
      consolePlugin.initialize({ enabled: true });
      logger.addPlugin(consolePlugin);
    }

    return logger;
  }

  /**
   * Get or create a singleton logger instance for a service
   */
  static getLogger(
    service: string,
    config: Partial<LoggerConfig> = {},
    context: LogContext = {}
  ): ILogger {
    const key = `${service}_${JSON.stringify(config)}_${JSON.stringify(context)}`;

    if (!this.instances.has(key)) {
      const logger = this.createLogger(service, config, context);
      this.instances.set(key, logger);
    }

    return this.instances.get(key)!;
  }

  /**
   * Create a logger for a specific package
   */
  static createPackageLogger(
    packageName: string,
    config: Partial<LoggerConfig> = {}
  ): ILogger {
    return this.createLogger(
      `botking-${packageName}`,
      {
        ...config,
        metadata: {
          package: packageName,
          ...config.metadata,
        },
      },
      {
        package: packageName,
      }
    );
  }

  /**
   * Create a logger for development with sensible defaults
   */
  static createDevelopmentLogger(service: string): ILogger {
    return this.createLogger(service, {
      level: LogLevel.DEBUG,
      environment: "development",
      enableConsole: true,
      enableFile: false,
      enableMonitoring: true,
      consoleConfig: {
        colorize: true,
        timestamp: true,
      },
    });
  }

  /**
   * Create a logger for production with sensible defaults
   */
  static createProductionLogger(
    service: string,
    plugins: IMonitoringPlugin[] = []
  ): ILogger {
    const logger = this.createLogger(service, {
      level: LogLevel.INFO,
      environment: "production",
      enableConsole: false,
      enableFile: true,
      enableMonitoring: true,
      fileConfig: {
        filename: `logs/${service}-%DATE%.log`,
        datePattern: "YYYY-MM-DD",
        maxFiles: "30d",
        maxSize: "20m",
      },
    });

    // Add monitoring plugins
    plugins.forEach((plugin) => {
      logger.addPlugin(plugin);
    });

    return logger;
  }

  /**
   * Set default configuration for all new loggers
   */
  static setDefaultConfig(config: Partial<LoggerConfig>): void {
    this.defaultConfig = { ...this.defaultConfig, ...config };
  }

  /**
   * Clear all cached logger instances
   */
  static clearCache(): void {
    this.instances.clear();
  }

  /**
   * Get log level from environment variable
   */
  private static getLogLevelFromEnv(): LogLevel {
    const envLevel = process.env.LOG_LEVEL?.toLowerCase();

    switch (envLevel) {
      case "error":
        return LogLevel.ERROR;
      case "warn":
        return LogLevel.WARN;
      case "info":
        return LogLevel.INFO;
      case "http":
        return LogLevel.HTTP;
      case "verbose":
        return LogLevel.VERBOSE;
      case "debug":
        return LogLevel.DEBUG;
      case "silly":
        return LogLevel.SILLY;
      default:
        return LogLevel.INFO;
    }
  }

  /**
   * Get environment from environment variable
   */
  private static getEnvironmentFromEnv():
    | "development"
    | "staging"
    | "production"
    | "test" {
    const env = process.env.NODE_ENV?.toLowerCase();

    switch (env) {
      case "development":
      case "dev":
        return "development";
      case "staging":
      case "stage":
        return "staging";
      case "production":
      case "prod":
        return "production";
      case "test":
        return "test";
      default:
        return "development";
    }
  }
}

/**
 * Configuration builder for fluent API
 */
export class LoggerConfigBuilder {
  private config: Partial<LoggerConfig> = {};

  service(service: string): LoggerConfigBuilder {
    this.config.service = service;
    return this;
  }

  level(level: LogLevel): LoggerConfigBuilder {
    this.config.level = level;
    return this;
  }

  environment(
    env: "development" | "staging" | "production" | "test"
  ): LoggerConfigBuilder {
    this.config.environment = env;
    return this;
  }

  enableConsole(
    enabled: boolean = true,
    options?: { colorize?: boolean; timestamp?: boolean }
  ): LoggerConfigBuilder {
    this.config.enableConsole = enabled;
    if (options) {
      this.config.consoleConfig = {
        colorize: options.colorize ?? true,
        timestamp: options.timestamp ?? true,
        ...this.config.consoleConfig,
      };
    }
    return this;
  }

  enableFile(
    enabled: boolean = true,
    options?: {
      filename?: string;
      maxFiles?: string;
      maxSize?: string;
      datePattern?: string;
    }
  ): LoggerConfigBuilder {
    this.config.enableFile = enabled;
    if (options) {
      this.config.fileConfig = {
        filename: options.filename || "logs/app-%DATE%.log",
        maxFiles: options.maxFiles,
        maxSize: options.maxSize,
        datePattern: options.datePattern,
        ...this.config.fileConfig,
      };
    }
    return this;
  }

  enableMonitoring(enabled: boolean = true): LoggerConfigBuilder {
    this.config.enableMonitoring = enabled;
    return this;
  }

  metadata(metadata: Record<string, any>): LoggerConfigBuilder {
    this.config.metadata = { ...this.config.metadata, ...metadata };
    return this;
  }

  build(): LoggerConfig {
    if (!this.config.service) {
      throw new Error("Service name is required");
    }

    return {
      level: LogLevel.INFO,
      environment: "development",
      enableConsole: true,
      enableFile: false,
      enableMonitoring: false,
      ...this.config,
    } as LoggerConfig;
  }

  createLogger(context?: LogContext): ILogger {
    const config = this.build();
    return LoggerFactory.createLogger(config.service, config, context);
  }
}
