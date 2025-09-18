/**
 * @botking/logger - Object-Oriented logging system with enhanced monitoring
 *
 * Enhanced OOP architecture with:
 * - LoggerManager: Centralized logger management
 * - PluginManager: Advanced plugin lifecycle management
 * - BaseMonitoringPlugin: Abstract base class for plugins
 * - Enhanced plugin system with batching, health checks, and statistics
 */

// Main OOP exports
export { LoggerManager, loggerManager } from "./logger-manager";
export { PluginManager } from "./plugin-manager";
export type {
  PluginConfig,
  PluginExecutionResult,
  PluginStats,
} from "./plugin-manager";

// Core exports
export { Logger } from "./logger";
export { LoggerFactory, LoggerConfigBuilder } from "./factory";

// Enhanced plugin system
export { BaseMonitoringPlugin } from "./plugins/base-monitoring-plugin";
export type { BasePluginConfig } from "./plugins/base-monitoring-plugin";

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

// Singleton instances for convenience
import { loggerManager } from "./logger-manager";

// Backward compatibility - deprecated utility functions (now use OOP methods)
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
