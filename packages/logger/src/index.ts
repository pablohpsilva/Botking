/**
 * @botking/logger - Centralized logging system with monitoring plugin support
 */

// Core exports
export { Logger } from "./logger";
export { LoggerFactory, LoggerConfigBuilder } from "./factory";

// Types and interfaces
export type {
  ILogger,
  IMonitoringPlugin,
  LoggerConfig,
  LogContext,
  LogEntry,
  MonitoringEvent,
  PerformanceMetrics,
} from "./types";

export { LogLevel, MonitoringEventType } from "./types";

// Plugins
export * from "./plugins";

// Convenience exports for common use cases - using import to avoid hoisting issues
import { LoggerFactory, LoggerConfigBuilder } from "./factory";
export const createLogger = LoggerFactory.createLogger.bind(LoggerFactory);
export const getLogger = LoggerFactory.getLogger.bind(LoggerFactory);
export const createPackageLogger =
  LoggerFactory.createPackageLogger.bind(LoggerFactory);
export const createDevelopmentLogger =
  LoggerFactory.createDevelopmentLogger.bind(LoggerFactory);
export const createProductionLogger =
  LoggerFactory.createProductionLogger.bind(LoggerFactory);

// Default instance for quick usage
export const logger = LoggerFactory.createDevelopmentLogger("botking");

/**
 * Quick setup function for common configurations
 */
import { LogLevel, IMonitoringPlugin } from "./types";

export function setupLogging(options: {
  service: string;
  level?: LogLevel;
  enableFile?: boolean;
  enableMonitoring?: boolean;
  plugins?: IMonitoringPlugin[];
}) {
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

  return logger;
}
