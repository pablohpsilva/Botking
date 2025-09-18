import { MonitoringEvent, PerformanceMetrics, LogEntry } from "../types";
import {
  BaseMonitoringPlugin,
  BasePluginConfig,
} from "./base-monitoring-plugin";

/**
 * Console monitoring plugin configuration
 */
export interface ConsolePluginConfig extends BasePluginConfig {
  logLevels?: string[]; // Which log levels to output
  colorize?: boolean;
  includeTimestamp?: boolean;
  includeMetadata?: boolean;
}

/**
 * Enhanced console monitoring plugin for development/testing
 * Now extends BaseMonitoringPlugin for better OOP structure
 */
export class ConsoleMonitoringPlugin extends BaseMonitoringPlugin {
  public readonly name = "console-monitoring";
  public readonly version = "2.0.0";

  private consoleConfig: ConsolePluginConfig;

  constructor(config: ConsolePluginConfig = { enabled: true }) {
    super(config);

    this.consoleConfig = {
      logLevels: ["error", "warn", "info"],
      colorize: true,
      includeTimestamp: true,
      includeMetadata: true,
      ...config,
    };
  }

  /**
   * Plugin-specific initialization
   */
  protected async onInitialize(config: Record<string, any>): Promise<void> {
    this.consoleConfig = { ...this.consoleConfig, ...config };

    if (this.consoleConfig.enabled) {
      this.logToConsole(
        "info",
        `[${this.name}] Monitoring plugin initialized`,
        {
          version: this.version,
          config: this.consoleConfig,
        }
      );
    }
  }

  /**
   * Plugin-specific destruction
   */
  protected async onDestroy(): Promise<void> {
    if (this.consoleConfig.enabled) {
      this.logToConsole("info", `[${this.name}] Monitoring plugin destroyed`);
    }
  }

  /**
   * Send single event immediately
   */
  protected async sendEventImmediate(event: MonitoringEvent): Promise<void> {
    if (!this.consoleConfig.enabled) return;

    this.logToConsole("info", `[${this.name}] EVENT:`, {
      type: event.type,
      name: event.name,
      severity: event.severity,
      timestamp: this.consoleConfig.includeTimestamp
        ? event.timestamp.toISOString()
        : undefined,
      userId: event.userId,
      tags: event.tags,
      data: this.consoleConfig.includeMetadata ? event.data : undefined,
    });
  }

  /**
   * Send single metrics immediately
   */
  protected async sendMetricsImmediate(
    metrics: PerformanceMetrics
  ): Promise<void> {
    if (!this.consoleConfig.enabled) return;

    this.logToConsole("info", `[${this.name}] METRICS:`, {
      operation: metrics.operation,
      duration: `${metrics.duration}ms`,
      success: metrics.success,
      timestamp: this.consoleConfig.includeTimestamp
        ? metrics.timestamp.toISOString()
        : undefined,
      metadata: this.consoleConfig.includeMetadata
        ? metrics.metadata
        : undefined,
    });
  }

  /**
   * Send single log entry immediately
   */
  protected async sendLogImmediate(entry: LogEntry): Promise<void> {
    if (!this.consoleConfig.enabled) return;

    // Check if this log level should be output
    if (!this.consoleConfig.logLevels?.includes(entry.level)) {
      return;
    }

    this.logToConsole(entry.level as any, `[${this.name}] LOG:`, {
      level: entry.level,
      message: entry.message,
      context: this.consoleConfig.includeMetadata ? entry.context : undefined,
      error: entry.error?.message,
      timestamp: this.consoleConfig.includeTimestamp
        ? entry.timestamp.toISOString()
        : undefined,
    });
  }

  /**
   * Optimized batch sending for events
   */
  protected async sendEventsBatch(events: MonitoringEvent[]): Promise<void> {
    if (!this.consoleConfig.enabled || events.length === 0) return;

    this.logToConsole(
      "info",
      `[${this.name}] BATCH EVENTS (${events.length}):`,
      events.map((event) => ({
        type: event.type,
        name: event.name,
        severity: event.severity,
        timestamp: this.consoleConfig.includeTimestamp
          ? event.timestamp.toISOString()
          : undefined,
        data: this.consoleConfig.includeMetadata ? event.data : undefined,
      }))
    );
  }

  /**
   * Optimized batch sending for metrics
   */
  protected async sendMetricsBatch(
    metrics: PerformanceMetrics[]
  ): Promise<void> {
    if (!this.consoleConfig.enabled || metrics.length === 0) return;

    this.logToConsole(
      "info",
      `[${this.name}] BATCH METRICS (${metrics.length}):`,
      metrics.map((metric) => ({
        operation: metric.operation,
        duration: `${metric.duration}ms`,
        success: metric.success,
        timestamp: this.consoleConfig.includeTimestamp
          ? metric.timestamp.toISOString()
          : undefined,
      }))
    );
  }

  /**
   * Optimized batch sending for logs
   */
  protected async sendLogsBatch(logs: LogEntry[]): Promise<void> {
    if (!this.consoleConfig.enabled || logs.length === 0) return;

    // Filter logs by level
    const filteredLogs = logs.filter((log) =>
      this.consoleConfig.logLevels?.includes(log.level)
    );

    if (filteredLogs.length === 0) return;

    this.logToConsole(
      "info",
      `[${this.name}] BATCH LOGS (${filteredLogs.length}):`,
      filteredLogs.map((log) => ({
        level: log.level,
        message: log.message,
        context: this.consoleConfig.includeMetadata ? log.context : undefined,
        error: log.error?.message,
        timestamp: this.consoleConfig.includeTimestamp
          ? log.timestamp.toISOString()
          : undefined,
      }))
    );
  }

  /**
   * Health check implementation
   */
  protected async performHealthCheck(): Promise<boolean> {
    // Console plugin is always healthy if enabled
    return this.consoleConfig.enabled;
  }

  /**
   * Enhanced console logging with colorization
   */
  private logToConsole(
    level: "info" | "warn" | "error",
    message: string,
    data?: any
  ): void {
    const timestamp = this.consoleConfig.includeTimestamp
      ? `[${new Date().toISOString()}] `
      : "";

    if (this.consoleConfig.colorize) {
      switch (level) {
        case "error":
          console.error(`\x1b[31m${timestamp}${message}\x1b[0m`, data || "");
          break;
        case "warn":
          console.warn(`\x1b[33m${timestamp}${message}\x1b[0m`, data || "");
          break;
        default:
          console.log(`\x1b[36m${timestamp}${message}\x1b[0m`, data || "");
      }
    } else {
      switch (level) {
        case "error":
          console.error(`${timestamp}${message}`, data || "");
          break;
        case "warn":
          console.warn(`${timestamp}${message}`, data || "");
          break;
        default:
          console.log(`${timestamp}${message}`, data || "");
      }
    }
  }
}
