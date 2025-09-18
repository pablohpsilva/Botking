import {
  IMonitoringPlugin,
  MonitoringEvent,
  PerformanceMetrics,
  LogEntry,
  MonitoringEventType,
} from "./types";

/**
 * Plugin configuration interface
 */
export interface PluginConfig {
  enabled: boolean;
  priority: number; // Higher priority plugins execute first
  retryAttempts: number;
  retryDelay: number; // in milliseconds
  timeout: number; // in milliseconds
  config: Record<string, any>;
}

/**
 * Plugin execution result
 */
export interface PluginExecutionResult {
  pluginName: string;
  success: boolean;
  duration: number;
  error?: Error;
  retryCount: number;
}

/**
 * Plugin statistics
 */
export interface PluginStats {
  name: string;
  version: string;
  totalExecutions: number;
  successfulExecutions: number;
  failedExecutions: number;
  averageExecutionTime: number;
  lastExecutionTime: number;
  isEnabled: boolean;
}

/**
 * PluginManager - Enhanced plugin system with OOP patterns
 * Provides plugin lifecycle management, error handling, and statistics
 */
export class PluginManager {
  private plugins: Map<string, IMonitoringPlugin> = new Map();
  private pluginConfigs: Map<string, PluginConfig> = new Map();
  private pluginStats: Map<string, PluginStats> = new Map();
  private isInitialized: boolean = false;

  constructor() {}

  /**
   * Initialize the plugin manager
   */
  public async initialize(): Promise<void> {
    if (this.isInitialized) {
      return;
    }

    // Initialize all registered plugins
    const initPromises = Array.from(this.plugins.entries()).map(
      async ([name, plugin]) => {
        try {
          const config = this.pluginConfigs.get(name)?.config || {};
          await plugin.initialize(config);
          this.updatePluginStats(name, { lastExecutionTime: Date.now() });
        } catch (error) {
          console.error(`Failed to initialize plugin ${name}:`, error);
          this.updatePluginStats(name, {
            failedExecutions: this.getPluginStats(name).failedExecutions + 1,
          });
        }
      }
    );

    await Promise.all(initPromises);
    this.isInitialized = true;
  }

  /**
   * Register a plugin with configuration
   */
  public registerPlugin(
    plugin: IMonitoringPlugin,
    config: Partial<PluginConfig> = {}
  ): void {
    const fullConfig: PluginConfig = {
      enabled: true,
      priority: 0,
      retryAttempts: 3,
      retryDelay: 1000,
      timeout: 5000,
      config: {},
      ...config,
    };

    this.plugins.set(plugin.name, plugin);
    this.pluginConfigs.set(plugin.name, fullConfig);

    // Initialize plugin stats
    this.pluginStats.set(plugin.name, {
      name: plugin.name,
      version: plugin.version,
      totalExecutions: 0,
      successfulExecutions: 0,
      failedExecutions: 0,
      averageExecutionTime: 0,
      lastExecutionTime: 0,
      isEnabled: fullConfig.enabled,
    });
  }

  /**
   * Unregister a plugin
   */
  public async unregisterPlugin(pluginName: string): Promise<boolean> {
    const plugin = this.plugins.get(pluginName);
    if (!plugin) {
      return false;
    }

    try {
      await plugin.destroy();
    } catch (error) {
      console.error(`Error destroying plugin ${pluginName}:`, error);
    }

    this.plugins.delete(pluginName);
    this.pluginConfigs.delete(pluginName);
    this.pluginStats.delete(pluginName);

    return true;
  }

  /**
   * Enable or disable a plugin
   */
  public setPluginEnabled(pluginName: string, enabled: boolean): boolean {
    const config = this.pluginConfigs.get(pluginName);
    if (!config) {
      return false;
    }

    config.enabled = enabled;
    this.updatePluginStats(pluginName, { isEnabled: enabled });
    return true;
  }

  /**
   * Update plugin configuration
   */
  public updatePluginConfig(
    pluginName: string,
    config: Partial<PluginConfig>
  ): boolean {
    const existingConfig = this.pluginConfigs.get(pluginName);
    if (!existingConfig) {
      return false;
    }

    const updatedConfig = { ...existingConfig, ...config };
    this.pluginConfigs.set(pluginName, updatedConfig);
    this.updatePluginStats(pluginName, { isEnabled: updatedConfig.enabled });

    return true;
  }

  /**
   * Send event to all enabled plugins
   */
  public async sendEvent(
    event: MonitoringEvent
  ): Promise<PluginExecutionResult[]> {
    return this.executePluginMethod("sendEvent", event);
  }

  /**
   * Send metrics to all enabled plugins
   */
  public async sendMetrics(
    metrics: PerformanceMetrics
  ): Promise<PluginExecutionResult[]> {
    return this.executePluginMethod("sendMetrics", metrics);
  }

  /**
   * Send log entry to all enabled plugins
   */
  public async sendLog(entry: LogEntry): Promise<PluginExecutionResult[]> {
    return this.executePluginMethod("sendLog", entry);
  }

  /**
   * Get plugin by name
   */
  public getPlugin(name: string): IMonitoringPlugin | null {
    return this.plugins.get(name) || null;
  }

  /**
   * Get all plugin names
   */
  public getPluginNames(): string[] {
    return Array.from(this.plugins.keys());
  }

  /**
   * Get enabled plugin names
   */
  public getEnabledPluginNames(): string[] {
    return Array.from(this.pluginConfigs.entries())
      .filter(([_, config]) => config.enabled)
      .map(([name, _]) => name);
  }

  /**
   * Get plugin count
   */
  public getPluginCount(): number {
    return this.plugins.size;
  }

  /**
   * Get enabled plugin count
   */
  public getEnabledPluginCount(): number {
    return this.getEnabledPluginNames().length;
  }

  /**
   * Check if plugin exists
   */
  public hasPlugin(name: string): boolean {
    return this.plugins.has(name);
  }

  /**
   * Get plugin statistics
   */
  public getPluginStats(name: string): PluginStats {
    return (
      this.pluginStats.get(name) || {
        name,
        version: "unknown",
        totalExecutions: 0,
        successfulExecutions: 0,
        failedExecutions: 0,
        averageExecutionTime: 0,
        lastExecutionTime: 0,
        isEnabled: false,
      }
    );
  }

  /**
   * Get all plugin statistics
   */
  public getAllPluginStats(): PluginStats[] {
    return Array.from(this.pluginStats.values());
  }

  /**
   * Get plugin configuration
   */
  public getPluginConfig(name: string): PluginConfig | null {
    return this.pluginConfigs.get(name) || null;
  }

  /**
   * Health check for all plugins
   */
  public async healthCheck(): Promise<{
    healthy: string[];
    unhealthy: string[];
    details: Map<string, { responsive: boolean; lastExecution: number }>;
  }> {
    const healthy: string[] = [];
    const unhealthy: string[] = [];
    const details = new Map<
      string,
      { responsive: boolean; lastExecution: number }
    >();

    for (const [name, plugin] of this.plugins) {
      const config = this.pluginConfigs.get(name);
      if (!config?.enabled) {
        continue; // Skip disabled plugins
      }

      try {
        // Test plugin responsiveness with a simple event
        const testEvent: MonitoringEvent = {
          type: MonitoringEventType.SYSTEM,
          name: "health_check",
          severity: "low",
          timestamp: new Date(),
          data: { test: true },
        };

        const startTime = Date.now();
        await this.executeWithTimeout(
          () => plugin.sendEvent(testEvent),
          config.timeout
        );
        const responseTime = Date.now() - startTime;

        const isResponsive = responseTime < config.timeout;
        const stats = this.getPluginStats(name);

        details.set(name, {
          responsive: isResponsive,
          lastExecution: stats.lastExecutionTime,
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
          lastExecution: this.getPluginStats(name).lastExecutionTime,
        });
      }
    }

    return { healthy, unhealthy, details };
  }

  /**
   * Destroy all plugins
   */
  public async destroy(): Promise<void> {
    const destroyPromises = Array.from(this.plugins.values()).map(
      async (plugin) => {
        try {
          await plugin.destroy();
        } catch (error) {
          console.error(`Error destroying plugin ${plugin.name}:`, error);
        }
      }
    );

    await Promise.all(destroyPromises);

    this.plugins.clear();
    this.pluginConfigs.clear();
    this.pluginStats.clear();
    this.isInitialized = false;
  }

  /**
   * Reset plugin manager state
   */
  public async reset(): Promise<void> {
    await this.destroy();
  }

  /**
   * Execute a plugin method with error handling and retries
   */
  private async executePluginMethod(
    methodName: keyof IMonitoringPlugin,
    data: any
  ): Promise<PluginExecutionResult[]> {
    const results: PluginExecutionResult[] = [];

    // Get enabled plugins sorted by priority
    const enabledPlugins = Array.from(this.plugins.entries())
      .filter(([name, _]) => this.pluginConfigs.get(name)?.enabled)
      .sort(([nameA, _], [nameB, __]) => {
        const priorityA = this.pluginConfigs.get(nameA)?.priority || 0;
        const priorityB = this.pluginConfigs.get(nameB)?.priority || 0;
        return priorityB - priorityA; // Higher priority first
      });

    const executePromises = enabledPlugins.map(async ([name, plugin]) => {
      const config = this.pluginConfigs.get(name)!;
      let retryCount = 0;
      let lastError: Error | undefined;
      const overallStartTime = Date.now();

      while (retryCount <= config.retryAttempts) {
        const startTime = Date.now();

        try {
          const method = plugin[methodName] as Function;
          if (typeof method === "function") {
            await this.executeWithTimeout(
              () => method.call(plugin, data),
              config.timeout
            );
          }

          const duration = Date.now() - startTime;

          // Update stats
          this.updatePluginStats(name, {
            totalExecutions: this.getPluginStats(name).totalExecutions + 1,
            successfulExecutions:
              this.getPluginStats(name).successfulExecutions + 1,
            lastExecutionTime: Date.now(),
          });

          results.push({
            pluginName: name,
            success: true,
            duration,
            retryCount,
          });

          return; // Success, exit retry loop
        } catch (error) {
          lastError = error as Error;
          retryCount++;

          if (retryCount <= config.retryAttempts) {
            await this.delay(config.retryDelay);
          }
        }
      }

      // All retries failed
      const duration = Date.now() - overallStartTime;

      this.updatePluginStats(name, {
        totalExecutions: this.getPluginStats(name).totalExecutions + 1,
        failedExecutions: this.getPluginStats(name).failedExecutions + 1,
        lastExecutionTime: Date.now(),
      });

      results.push({
        pluginName: name,
        success: false,
        duration,
        error: lastError,
        retryCount: retryCount - 1,
      });
    });

    await Promise.all(executePromises);
    return results;
  }

  /**
   * Execute function with timeout
   */
  private async executeWithTimeout<T>(
    fn: () => Promise<T>,
    timeout: number
  ): Promise<T> {
    return Promise.race([
      fn(),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error("Plugin execution timeout")), timeout)
      ),
    ]);
  }

  /**
   * Delay utility
   */
  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Update plugin statistics
   */
  private updatePluginStats(name: string, updates: Partial<PluginStats>): void {
    const current = this.getPluginStats(name);
    const updated = { ...current, ...updates };

    // Recalculate average execution time
    if (updated.totalExecutions > 0) {
      const totalTime =
        current.averageExecutionTime * (current.totalExecutions - 1);
      updated.averageExecutionTime = totalTime / updated.totalExecutions;
    }

    this.pluginStats.set(name, updated);
  }
}
