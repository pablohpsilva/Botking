/**
 * Monitoring plugins for external integrations
 */

export { ConsoleMonitoringPlugin } from "./console-monitoring-plugin";
export { DatadogMonitoringPlugin } from "./datadog-monitoring-plugin";
export { SentryMonitoringPlugin } from "./sentry-monitoring-plugin";

// Re-export the interface for custom plugin development
export type { IMonitoringPlugin } from "../types";
