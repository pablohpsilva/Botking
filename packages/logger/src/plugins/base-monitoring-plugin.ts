import {
  IMonitoringPlugin,
  MonitoringEvent,
  PerformanceMetrics,
  LogEntry,
} from "../types";

/**
 * Plugin health status
 */
export interface PluginHealth {
  isHealthy: boolean;
  lastCheck: Date;
  errorCount: number;
  lastError?: Error;
}

/**
 * Plugin configuration interface
 */
export interface BasePluginConfig {
  enabled: boolean;
  batchSize?: number;
  flushInterval?: number; // in milliseconds
  maxRetries?: number;
  retryDelay?: number; // in milliseconds
  healthCheckInterval?: number; // in milliseconds
}

/**
 * Abstract base class for monitoring plugins
 * Provides common functionality and enforces OOP patterns
 */
export abstract class BaseMonitoringPlugin implements IMonitoringPlugin {
  public abstract readonly name: string;
  public abstract readonly version: string;

  protected config: BasePluginConfig;
  protected isInitialized: boolean = false;
  protected health: PluginHealth;
  protected eventQueue: MonitoringEvent[] = [];
  protected metricsQueue: PerformanceMetrics[] = [];
  protected logQueue: LogEntry[] = [];
  protected flushTimer?: NodeJS.Timeout;
  protected healthCheckTimer?: NodeJS.Timeout;

  constructor(config: BasePluginConfig = { enabled: true }) {
    this.config = {
      batchSize: 10,
      flushInterval: 5000, // 5 seconds
      maxRetries: 3,
      retryDelay: 1000, // 1 second
      healthCheckInterval: 30000, // 30 seconds
      ...config,
    };

    this.health = {
      isHealthy: true,
      lastCheck: new Date(),
      errorCount: 0,
    };
  }

  /**
   * Initialize the plugin
   */
  public async initialize(config: Record<string, any>): Promise<void> {
    if (this.isInitialized) {
      return;
    }

    try {
      // Merge configuration
      this.config = { ...this.config, ...config };

      // Call abstract initialization method
      await this.onInitialize(config);

      // Start batch processing if enabled
      if (this.config.batchSize && this.config.batchSize > 1) {
        this.startBatchProcessing();
      }

      // Start health monitoring
      this.startHealthMonitoring();

      this.isInitialized = true;
      this.updateHealth(true);
    } catch (error) {
      this.updateHealth(false, error as Error);
      throw error;
    }
  }

  /**
   * Send monitoring event
   */
  public async sendEvent(event: MonitoringEvent): Promise<void> {
    if (!this.config.enabled || !this.isInitialized) {
      return;
    }

    try {
      if (this.config.batchSize && this.config.batchSize > 1) {
        // Add to queue for batch processing
        this.eventQueue.push(event);

        if (this.eventQueue.length >= this.config.batchSize) {
          await this.flushEvents();
        }
      } else {
        // Send immediately
        await this.sendEventImmediate(event);
      }
    } catch (error) {
      this.updateHealth(false, error as Error);
      throw error;
    }
  }

  /**
   * Send performance metrics
   */
  public async sendMetrics(metrics: PerformanceMetrics): Promise<void> {
    if (!this.config.enabled || !this.isInitialized) {
      return;
    }

    try {
      if (this.config.batchSize && this.config.batchSize > 1) {
        // Add to queue for batch processing
        this.metricsQueue.push(metrics);

        if (this.metricsQueue.length >= this.config.batchSize) {
          await this.flushMetrics();
        }
      } else {
        // Send immediately
        await this.sendMetricsImmediate(metrics);
      }
    } catch (error) {
      this.updateHealth(false, error as Error);
      throw error;
    }
  }

  /**
   * Send log entry
   */
  public async sendLog(entry: LogEntry): Promise<void> {
    if (!this.config.enabled || !this.isInitialized) {
      return;
    }

    try {
      if (this.config.batchSize && this.config.batchSize > 1) {
        // Add to queue for batch processing
        this.logQueue.push(entry);

        if (this.logQueue.length >= this.config.batchSize) {
          await this.flushLogs();
        }
      } else {
        // Send immediately
        await this.sendLogImmediate(entry);
      }
    } catch (error) {
      this.updateHealth(false, error as Error);
      throw error;
    }
  }

  /**
   * Destroy the plugin
   */
  public async destroy(): Promise<void> {
    if (!this.isInitialized) {
      return;
    }

    try {
      // Stop timers
      if (this.flushTimer) {
        clearInterval(this.flushTimer);
        this.flushTimer = undefined;
      }

      if (this.healthCheckTimer) {
        clearInterval(this.healthCheckTimer);
        this.healthCheckTimer = undefined;
      }

      // Flush remaining queued items
      await this.flushAll();

      // Call abstract destruction method
      await this.onDestroy();

      this.isInitialized = false;
    } catch (error) {
      this.updateHealth(false, error as Error);
      throw error;
    }
  }

  /**
   * Get plugin health status
   */
  public getHealth(): PluginHealth {
    return { ...this.health };
  }

  /**
   * Check if plugin is healthy
   */
  public isHealthy(): boolean {
    return this.health.isHealthy;
  }

  /**
   * Get plugin configuration
   */
  public getConfig(): BasePluginConfig {
    return { ...this.config };
  }

  /**
   * Update plugin configuration
   */
  public updateConfig(config: Partial<BasePluginConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Get queue sizes
   */
  public getQueueSizes(): {
    events: number;
    metrics: number;
    logs: number;
  } {
    return {
      events: this.eventQueue.length,
      metrics: this.metricsQueue.length,
      logs: this.logQueue.length,
    };
  }

  // Abstract methods that must be implemented by concrete plugins

  /**
   * Plugin-specific initialization logic
   */
  protected abstract onInitialize(config: Record<string, any>): Promise<void>;

  /**
   * Plugin-specific destruction logic
   */
  protected abstract onDestroy(): Promise<void>;

  /**
   * Send single event immediately
   */
  protected abstract sendEventImmediate(event: MonitoringEvent): Promise<void>;

  /**
   * Send single metrics immediately
   */
  protected abstract sendMetricsImmediate(
    metrics: PerformanceMetrics
  ): Promise<void>;

  /**
   * Send single log entry immediately
   */
  protected abstract sendLogImmediate(entry: LogEntry): Promise<void>;

  /**
   * Send batch of events (optional override for batch optimization)
   */
  protected async sendEventsBatch(events: MonitoringEvent[]): Promise<void> {
    // Default implementation: send individually
    for (const event of events) {
      await this.sendEventImmediate(event);
    }
  }

  /**
   * Send batch of metrics (optional override for batch optimization)
   */
  protected async sendMetricsBatch(
    metrics: PerformanceMetrics[]
  ): Promise<void> {
    // Default implementation: send individually
    for (const metric of metrics) {
      await this.sendMetricsImmediate(metric);
    }
  }

  /**
   * Send batch of logs (optional override for batch optimization)
   */
  protected async sendLogsBatch(logs: LogEntry[]): Promise<void> {
    // Default implementation: send individually
    for (const log of logs) {
      await this.sendLogImmediate(log);
    }
  }

  /**
   * Plugin-specific health check (optional override)
   */
  protected async performHealthCheck(): Promise<boolean> {
    // Default implementation: always healthy
    return true;
  }

  // Private methods

  /**
   * Start batch processing timer
   */
  private startBatchProcessing(): void {
    if (this.flushTimer) {
      return;
    }

    this.flushTimer = setInterval(async () => {
      try {
        await this.flushAll();
      } catch (error) {
        this.updateHealth(false, error as Error);
      }
    }, this.config.flushInterval);
  }

  /**
   * Start health monitoring timer
   */
  private startHealthMonitoring(): void {
    if (this.healthCheckTimer) {
      return;
    }

    this.healthCheckTimer = setInterval(async () => {
      try {
        const isHealthy = await this.performHealthCheck();
        this.updateHealth(isHealthy);
      } catch (error) {
        this.updateHealth(false, error as Error);
      }
    }, this.config.healthCheckInterval);
  }

  /**
   * Flush all queued items
   */
  private async flushAll(): Promise<void> {
    await Promise.all([
      this.flushEvents(),
      this.flushMetrics(),
      this.flushLogs(),
    ]);
  }

  /**
   * Flush queued events
   */
  private async flushEvents(): Promise<void> {
    if (this.eventQueue.length === 0) {
      return;
    }

    const events = this.eventQueue.splice(0);
    await this.sendEventsBatch(events);
  }

  /**
   * Flush queued metrics
   */
  private async flushMetrics(): Promise<void> {
    if (this.metricsQueue.length === 0) {
      return;
    }

    const metrics = this.metricsQueue.splice(0);
    await this.sendMetricsBatch(metrics);
  }

  /**
   * Flush queued logs
   */
  private async flushLogs(): Promise<void> {
    if (this.logQueue.length === 0) {
      return;
    }

    const logs = this.logQueue.splice(0);
    await this.sendLogsBatch(logs);
  }

  /**
   * Update plugin health status
   */
  private updateHealth(isHealthy: boolean, error?: Error): void {
    this.health.isHealthy = isHealthy;
    this.health.lastCheck = new Date();

    if (error) {
      this.health.lastError = error;
      this.health.errorCount++;
    } else if (isHealthy) {
      // Reset error count on successful health check
      this.health.errorCount = 0;
      this.health.lastError = undefined;
    }
  }
}
