import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";
import {
  ILogger,
  IMonitoringPlugin,
  LogLevel,
  LogContext,
  LogEntry,
  MonitoringEvent,
  PerformanceMetrics,
  LoggerConfig,
} from "./types";

/**
 * Main logger implementation using Winston with monitoring plugin support
 */
export class Logger implements ILogger {
  private winston: winston.Logger;
  private plugins: Map<string, IMonitoringPlugin>;
  private config: LoggerConfig;
  private baseContext: LogContext;

  constructor(config: LoggerConfig, baseContext: LogContext = {}) {
    this.config = config;
    this.baseContext = baseContext;
    this.plugins = new Map();
    this.winston = this.createWinstonLogger();
  }

  private createWinstonLogger(): winston.Logger {
    const transports: winston.transport[] = [];

    // Console transport
    if (this.config.enableConsole) {
      transports.push(
        new winston.transports.Console({
          level: this.config.level,
          format: winston.format.combine(
            winston.format.colorize({
              all: this.config.consoleConfig?.colorize ?? true,
            }),
            winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
            winston.format.errors({ stack: true }),
            winston.format.printf(
              ({ timestamp, level, message, service, ...meta }) => {
                let output = `${timestamp} [${service || this.config.service}] ${level}: ${message}`;

                // Cast meta to any to access dynamic properties
                const metaAny = meta as any;

                // Add context information
                if (
                  metaAny.context &&
                  Object.keys(metaAny.context).length > 0
                ) {
                  output += ` | Context: ${JSON.stringify(metaAny.context)}`;
                }

                // Add error stack if present
                if (metaAny.error && metaAny.error.stack) {
                  output += `\n${metaAny.error.stack}`;
                }

                // Add additional metadata
                const otherMeta = { ...metaAny };
                delete otherMeta.context;
                delete otherMeta.error;
                if (Object.keys(otherMeta).length > 0) {
                  output += ` | Meta: ${JSON.stringify(otherMeta)}`;
                }

                return output;
              }
            )
          ),
        })
      );
    }

    // File transport with rotation
    if (this.config.enableFile && this.config.fileConfig) {
      transports.push(
        new DailyRotateFile({
          level: this.config.level,
          filename: this.config.fileConfig.filename,
          datePattern: this.config.fileConfig.datePattern || "YYYY-MM-DD",
          maxFiles: this.config.fileConfig.maxFiles || "30d",
          maxSize: this.config.fileConfig.maxSize || "20m",
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.errors({ stack: true }),
            winston.format.json()
          ),
        })
      );
    }

    return winston.createLogger({
      level: this.config.level,
      defaultMeta: {
        service: this.config.service,
        environment: this.config.environment,
        ...this.config.metadata,
      },
      transports,
      exitOnError: false,
    });
  }

  private async notifyPlugins(entry: LogEntry): Promise<void> {
    if (!this.config.enableMonitoring || this.plugins.size === 0) {
      return;
    }

    const promises = Array.from(this.plugins.values()).map(async (plugin) => {
      try {
        await plugin.sendLog(entry);
      } catch (error) {
        // Log plugin errors to winston but don't throw
        this.winston.error("Plugin error", {
          plugin: plugin.name,
          error: error instanceof Error ? error.message : String(error),
        });
      }
    });

    await Promise.allSettled(promises);
  }

  private createLogEntry(
    level: LogLevel,
    message: string,
    context?: LogContext,
    error?: Error
  ): LogEntry {
    return {
      timestamp: new Date(),
      level,
      message,
      context: { ...this.baseContext, ...context },
      error,
      source: this.config.service,
      metadata: this.config.metadata,
    };
  }

  // Basic logging methods
  error(message: string, context?: LogContext, error?: Error): void {
    this.log(LogLevel.ERROR, message, context, error);
  }

  warn(message: string, context?: LogContext): void {
    this.log(LogLevel.WARN, message, context);
  }

  info(message: string, context?: LogContext): void {
    this.log(LogLevel.INFO, message, context);
  }

  http(message: string, context?: LogContext): void {
    this.log(LogLevel.HTTP, message, context);
  }

  verbose(message: string, context?: LogContext): void {
    this.log(LogLevel.VERBOSE, message, context);
  }

  debug(message: string, context?: LogContext): void {
    this.log(LogLevel.DEBUG, message, context);
  }

  silly(message: string, context?: LogContext): void {
    this.log(LogLevel.SILLY, message, context);
  }

  // Generic log method
  log(
    level: LogLevel,
    message: string,
    context?: LogContext,
    error?: Error
  ): void {
    const entry = this.createLogEntry(level, message, context, error);

    // Log to Winston
    this.winston.log(level, message, {
      context: entry.context,
      error: entry.error,
      metadata: entry.metadata,
    });

    // Notify plugins asynchronously
    this.notifyPlugins(entry).catch((error) => {
      this.winston.error("Failed to notify plugins", { error: error.message });
    });
  }

  // Monitoring and metrics
  trackEvent(event: MonitoringEvent): void {
    this.info("Event tracked", {
      eventType: event.type,
      eventName: event.name,
      userId: event.userId,
      sessionId: event.sessionId,
      severity: event.severity,
      tags: event.tags,
    });

    if (this.config.enableMonitoring) {
      this.plugins.forEach(async (plugin) => {
        try {
          await plugin.sendEvent(event);
        } catch (error) {
          this.winston.error("Plugin event tracking error", {
            plugin: plugin.name,
            error: error instanceof Error ? error.message : String(error),
          });
        }
      });
    }
  }

  trackPerformance(metrics: PerformanceMetrics): void {
    this.info("Performance tracked", {
      operation: metrics.operation,
      duration: metrics.duration,
      success: metrics.success,
    });

    if (this.config.enableMonitoring) {
      this.plugins.forEach(async (plugin) => {
        try {
          await plugin.sendMetrics(metrics);
        } catch (error) {
          this.winston.error("Plugin metrics tracking error", {
            plugin: plugin.name,
            error: error instanceof Error ? error.message : String(error),
          });
        }
      });
    }
  }

  // Performance timing helpers
  startTimer(operation: string, context?: LogContext): () => void {
    const startTime = Date.now();
    const timerContext = { ...this.baseContext, ...context, operation };

    this.debug(`Started operation: ${operation}`, timerContext);

    return () => {
      const duration = Date.now() - startTime;
      this.info(`Completed operation: ${operation}`, {
        ...timerContext,
        duration: `${duration}ms`,
      });

      this.trackPerformance({
        operation,
        duration,
        success: true,
        timestamp: new Date(),
        metadata: context,
      });
    };
  }

  async timeAsync<T>(
    operation: string,
    fn: () => Promise<T>,
    context?: LogContext
  ): Promise<T> {
    const startTime = Date.now();
    const timerContext = { ...this.baseContext, ...context, operation };

    this.debug(`Started async operation: ${operation}`, timerContext);

    try {
      const result = await fn();
      const duration = Date.now() - startTime;

      this.info(`Completed async operation: ${operation}`, {
        ...timerContext,
        duration: `${duration}ms`,
      });

      this.trackPerformance({
        operation,
        duration,
        success: true,
        timestamp: new Date(),
        metadata: context,
      });

      return result;
    } catch (error) {
      const duration = Date.now() - startTime;

      this.error(
        `Failed async operation: ${operation}`,
        {
          ...timerContext,
          duration: `${duration}ms`,
        },
        error instanceof Error ? error : new Error(String(error))
      );

      this.trackPerformance({
        operation,
        duration,
        success: false,
        timestamp: new Date(),
        metadata: {
          ...context,
          error: error instanceof Error ? error.message : String(error),
        },
      });

      throw error;
    }
  }

  // Child logger with additional context
  child(context: LogContext): ILogger {
    return new Logger(this.config, { ...this.baseContext, ...context });
  }

  // Plugin management
  addPlugin(plugin: IMonitoringPlugin): void {
    this.plugins.set(plugin.name, plugin);
    this.info("Monitoring plugin added", {
      pluginName: plugin.name,
      version: plugin.version,
    });
  }

  removePlugin(pluginName: string): void {
    const plugin = this.plugins.get(pluginName);
    if (plugin) {
      this.plugins.delete(pluginName);
      this.info("Monitoring plugin removed", { pluginName });

      // Clean up plugin resources
      plugin.destroy().catch((error) => {
        this.winston.error("Plugin cleanup error", {
          plugin: pluginName,
          error: error instanceof Error ? error.message : String(error),
        });
      });
    }
  }

  // Configuration
  setLevel(level: LogLevel): void {
    this.config.level = level;
    this.winston.level = level;
    this.info("Log level changed", { newLevel: level });
  }

  getLevel(): LogLevel {
    return this.config.level;
  }

  // Cleanup method
  async destroy(): Promise<void> {
    this.info("Logger shutting down");

    // Cleanup all plugins
    const pluginCleanups = Array.from(this.plugins.values()).map((plugin) =>
      plugin.destroy()
    );
    await Promise.allSettled(pluginCleanups);

    // Close Winston transports
    this.winston.end();
  }
}
