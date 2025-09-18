import { Logger } from "./logger";
import { LoggerFactory, LoggerConfigBuilder } from "./factory";
import {
  ILogger,
  IMonitoringPlugin,
  LoggerConfig,
  LogLevel,
  LogContext,
  MonitoringEvent,
  PerformanceMetrics,
} from "./types";

/**
 * LoggerManager - Centralized logger management with OOP patterns
 * Replaces utility functions with proper class-based management
 */
export class LoggerManager {
  private static instance: LoggerManager;
  private loggers: Map<string, ILogger> = new Map();
  private globalConfig: Partial<LoggerConfig> = {};
  private globalPlugins: IMonitoringPlugin[] = [];
  private isInitialized: boolean = false;

  private constructor() {
    this.setDefaultGlobalConfig();
  }

  /**
   * Get singleton instance of LoggerManager
   */
  public static getInstance(): LoggerManager {
    if (!LoggerManager.instance) {
      LoggerManager.instance = new LoggerManager();
    }
    return LoggerManager.instance;
  }

  /**
   * Initialize the logger manager with global configuration
   */
  public initialize(config: Partial<LoggerConfig> = {}): void {
    this.globalConfig = { ...this.globalConfig, ...config };
    this.isInitialized = true;

    // Apply global config to existing loggers
    for (const [name, logger] of this.loggers) {
      this.applyGlobalConfigToLogger(logger);
    }
  }

  /**
   * Create a new logger instance with enhanced management
   */
  public createLogger(
    service: string,
    config: Partial<LoggerConfig> = {},
    context: LogContext = {}
  ): ILogger {
    const mergedConfig = { ...this.globalConfig, ...config };
    const logger = LoggerFactory.createLogger(service, mergedConfig, context);

    // Add global plugins
    this.globalPlugins.forEach((plugin) => {
      logger.addPlugin(plugin);
    });

    // Store logger for management
    this.loggers.set(service, logger);

    return logger;
  }

  /**
   * Get an existing logger by service name
   */
  public getLogger(service: string): ILogger | null {
    return this.loggers.get(service) || null;
  }

  /**
   * Get or create a logger (convenience method)
   */
  public getOrCreateLogger(
    service: string,
    config: Partial<LoggerConfig> = {},
    context: LogContext = {}
  ): ILogger {
    const existing = this.getLogger(service);
    if (existing) {
      return existing;
    }
    return this.createLogger(service, config, context);
  }

  /**
   * Create a package-specific logger with standardized naming
   */
  public createPackageLogger(
    packageName: string,
    context: LogContext = {}
  ): ILogger {
    const service = `@botking/${packageName}`;
    return this.getOrCreateLogger(service, {}, context);
  }

  /**
   * Create a development logger with appropriate settings
   */
  public createDevelopmentLogger(service: string): ILogger {
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
   * Create a production logger with appropriate settings
   */
  public createProductionLogger(service: string): ILogger {
    return this.createLogger(service, {
      level: LogLevel.INFO,
      environment: "production",
      enableConsole: false,
      enableFile: true,
      enableMonitoring: true,
      fileConfig: {
        filename: `logs/${service}.log`,
        maxSize: "10MB",
        maxFiles: "5",
      },
    });
  }

  /**
   * Setup logging with common configurations (replaces utility function)
   */
  public setupLogging(options: {
    service: string;
    level?: LogLevel;
    enableFile?: boolean;
    enableMonitoring?: boolean;
    plugins?: IMonitoringPlugin[];
  }): ILogger {
    const logger = new LoggerConfigBuilder()
      .service(options.service)
      .level(options.level || LogLevel.INFO)
      .enableConsole(true)
      .enableFile(options.enableFile || false)
      .enableMonitoring(options.enableMonitoring || false)
      .createLogger();

    // Add plugins if provided
    if (options.plugins) {
      options.plugins.forEach((plugin) => logger.addPlugin(plugin));
    }

    // Store logger for management
    this.loggers.set(options.service, logger);

    return logger;
  }

  /**
   * Add a global plugin that will be applied to all new loggers
   */
  public addGlobalPlugin(plugin: IMonitoringPlugin): void {
    this.globalPlugins.push(plugin);

    // Apply to existing loggers
    for (const logger of this.loggers.values()) {
      logger.addPlugin(plugin);
    }
  }

  /**
   * Remove a global plugin
   */
  public removeGlobalPlugin(pluginName: string): boolean {
    const index = this.globalPlugins.findIndex((p) => p.name === pluginName);
    if (index === -1) return false;

    this.globalPlugins.splice(index, 1);

    // Remove from existing loggers
    for (const logger of this.loggers.values()) {
      logger.removePlugin(pluginName);
    }

    return true;
  }

  /**
   * Set global configuration that applies to all new loggers
   */
  public setGlobalConfig(config: Partial<LoggerConfig>): void {
    this.globalConfig = { ...this.globalConfig, ...config };

    // Apply to existing loggers
    for (const logger of this.loggers.values()) {
      this.applyGlobalConfigToLogger(logger);
    }
  }

  /**
   * Get list of all managed logger service names
   */
  public getLoggerNames(): string[] {
    return Array.from(this.loggers.keys());
  }

  /**
   * Get count of managed loggers
   */
  public getLoggerCount(): number {
    return this.loggers.size;
  }

  /**
   * Check if a logger exists
   */
  public hasLogger(service: string): boolean {
    return this.loggers.has(service);
  }

  /**
   * Remove a logger from management
   */
  public removeLogger(service: string): boolean {
    return this.loggers.delete(service);
  }

  /**
   * Clear all managed loggers
   */
  public clearAllLoggers(): void {
    this.loggers.clear();
  }

  /**
   * Send event to all loggers with monitoring enabled
   */
  public async broadcastEvent(event: MonitoringEvent): Promise<void> {
    const promises: Promise<void>[] = [];

    for (const logger of this.loggers.values()) {
      if (
        logger instanceof Logger &&
        (logger as any).config?.enableMonitoring
      ) {
        // Use info log for events since Logger doesn't have event method
        promises.push(
          Promise.resolve(logger.info(`Event: ${event.name}`, event.data))
        );
      }
    }

    await Promise.all(promises);
  }

  /**
   * Send metrics to all loggers with monitoring enabled
   */
  public async broadcastMetrics(metrics: PerformanceMetrics): Promise<void> {
    const promises: Promise<void>[] = [];

    for (const logger of this.loggers.values()) {
      if (
        logger instanceof Logger &&
        (logger as any).config?.enableMonitoring
      ) {
        // Use info log for metrics since Logger doesn't have performance method
        promises.push(
          Promise.resolve(
            logger.info(
              `Metrics: ${metrics.operation} (${metrics.duration}ms)`,
              {
                success: metrics.success,
                ...metrics.metadata,
              }
            )
          )
        );
      }
    }

    await Promise.all(promises);
  }

  /**
   * Get manager statistics
   */
  public getStats(): {
    totalLoggers: number;
    loggerNames: string[];
    globalPlugins: number;
    isInitialized: boolean;
    globalConfig: Partial<LoggerConfig>;
  } {
    return {
      totalLoggers: this.loggers.size,
      loggerNames: this.getLoggerNames(),
      globalPlugins: this.globalPlugins.length,
      isInitialized: this.isInitialized,
      globalConfig: { ...this.globalConfig },
    };
  }

  /**
   * Health check for all loggers
   */
  public async healthCheck(): Promise<{
    healthy: string[];
    unhealthy: string[];
    details: Map<string, { responsive: boolean; pluginCount: number }>;
  }> {
    const healthy: string[] = [];
    const unhealthy: string[] = [];
    const details = new Map<
      string,
      { responsive: boolean; pluginCount: number }
    >();

    for (const [name, logger] of this.loggers) {
      try {
        // Test logger responsiveness
        const startTime = Date.now();
        logger.debug("Health check test");
        const responseTime = Date.now() - startTime;

        const isResponsive = responseTime < 50; // 50ms threshold
        const pluginCount =
          logger instanceof Logger ? (logger as any).plugins?.length || 0 : 0;

        details.set(name, {
          responsive: isResponsive,
          pluginCount,
        });

        if (isResponsive) {
          healthy.push(name);
        } else {
          unhealthy.push(name);
        }
      } catch (error) {
        unhealthy.push(name);
        details.set(name, {
          responsive: false,
          pluginCount: 0,
        });
      }
    }

    return { healthy, unhealthy, details };
  }

  /**
   * Reset manager state (for testing)
   */
  public reset(): void {
    this.loggers.clear();
    this.globalPlugins = [];
    this.setDefaultGlobalConfig();
    this.isInitialized = false;
  }

  /**
   * Set default global configuration
   */
  private setDefaultGlobalConfig(): void {
    this.globalConfig = {
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
  }

  /**
   * Apply global configuration to a specific logger
   */
  private applyGlobalConfigToLogger(logger: ILogger): void {
    // This would require extending the Logger interface to support config updates
    // For now, we'll just ensure new loggers get the global config
    // In a full implementation, we'd add updateConfig method to ILogger
  }
}

// Export singleton instance for convenience
export const loggerManager = LoggerManager.getInstance();
