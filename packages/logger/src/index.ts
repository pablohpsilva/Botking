/**
 * @botking/logger - Object-Oriented logging system with enhanced monitoring
 *
 * Enhanced OOP architecture with:
 * - LoggerManager: Centralized logger management
 * - PluginManager: Advanced plugin lifecycle management
 * - BaseMonitoringPlugin: Abstract base class for plugins
 * - Enhanced plugin system with batching, health checks, and statistics
 */
import { LoggerFactory } from "./factory";

// Main OOP exports
export * from "./logger-manager";
export * from "./plugin-manager";
// Core exports
export * from "./logger";
export * from "./factory";
// Enhanced plugin system
export * from "./plugins/base-monitoring-plugin";
export * from "./types";
// Plugins
export * from "./plugins";

// Default instance for quick usage
export const logger = LoggerFactory.createDevelopmentLogger("botking");
