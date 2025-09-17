import {
  IMonitoringPlugin,
  MonitoringEvent,
  PerformanceMetrics,
  LogEntry,
} from "../types";

/**
 * Simple console monitoring plugin for development/testing
 */
export class ConsoleMonitoringPlugin implements IMonitoringPlugin {
  name = "console-monitoring";
  version = "1.0.0";

  private config: Record<string, any> = {};
  private enabled = true;

  async initialize(config: Record<string, any>): Promise<void> {
    this.config = { ...config };
    this.enabled = config.enabled !== false;

    if (this.enabled) {
      console.log(`[${this.name}] Monitoring plugin initialized`);
    }
  }

  async sendEvent(event: MonitoringEvent): Promise<void> {
    if (!this.enabled) return;

    console.log(`[${this.name}] EVENT:`, {
      type: event.type,
      name: event.name,
      severity: event.severity,
      timestamp: event.timestamp.toISOString(),
      userId: event.userId,
      tags: event.tags,
      data: event.data,
    });
  }

  async sendMetrics(metrics: PerformanceMetrics): Promise<void> {
    if (!this.enabled) return;

    console.log(`[${this.name}] METRICS:`, {
      operation: metrics.operation,
      duration: `${metrics.duration}ms`,
      success: metrics.success,
      timestamp: metrics.timestamp.toISOString(),
      metadata: metrics.metadata,
    });
  }

  async sendLog(entry: LogEntry): Promise<void> {
    if (!this.enabled) return;

    // Only log errors and warnings to avoid noise
    if (entry.level === "error" || entry.level === "warn") {
      console.log(`[${this.name}] LOG:`, {
        level: entry.level,
        message: entry.message,
        context: entry.context,
        error: entry.error?.message,
        timestamp: entry.timestamp.toISOString(),
      });
    }
  }

  async destroy(): Promise<void> {
    this.enabled = false;
    console.log(`[${this.name}] Monitoring plugin destroyed`);
  }
}
