/**
 * Enhanced monitoring plugins with OOP architecture
 */

// Base plugin class for custom plugin development
export { BaseMonitoringPlugin } from "./base-monitoring-plugin";
export type { BasePluginConfig } from "./base-monitoring-plugin";

// Concrete plugin implementations
export { ConsoleMonitoringPlugin } from "./console-monitoring-plugin";
export { DatadogMonitoringPlugin } from "./datadog-monitoring-plugin";
export { SentryMonitoringPlugin } from "./sentry-monitoring-plugin";

// Re-export the interface for custom plugin development
export type { IMonitoringPlugin } from "../types";
