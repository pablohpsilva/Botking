import { TimeChainService } from "./time-service";
import type { TimeServiceConfig, TimeDrift } from "./types";
import { createPackageLogger } from "@botking/logger";

/**
 * TimeServiceManager - Object-oriented manager for TimeChain services
 * Replaces utility functions with proper OOP patterns
 */
export class TimeServiceManager {
  private static instance: TimeServiceManager;
  private services: Map<string, TimeChainService> = new Map();
  private globalService: TimeChainService | null = null;
  private logger: ReturnType<typeof createPackageLogger>;

  private constructor() {
    this.logger = createPackageLogger("time-chain", {
      service: "time-service-manager",
    });
  }

  /**
   * Get singleton instance of TimeServiceManager
   */
  public static getInstance(): TimeServiceManager {
    if (!TimeServiceManager.instance) {
      TimeServiceManager.instance = new TimeServiceManager();
    }
    return TimeServiceManager.instance;
  }

  /**
   * Get or create the global TimeChain service instance
   */
  public getGlobalService(config?: TimeServiceConfig): TimeChainService {
    if (!this.globalService) {
      this.logger.info("Creating global TimeChain service");
      this.globalService = new TimeChainService(config);
      this.services.set("global", this.globalService);
    }
    return this.globalService;
  }

  /**
   * Create a new named TimeChain service instance
   */
  public createService(
    name: string,
    config?: TimeServiceConfig
  ): TimeChainService {
    if (this.services.has(name)) {
      this.logger.warn(
        `Service '${name}' already exists, returning existing instance`
      );
      return this.services.get(name)!;
    }

    this.logger.info(`Creating TimeChain service: ${name}`);
    const service = new TimeChainService(config);
    this.services.set(name, service);

    return service;
  }

  /**
   * Get an existing named service
   */
  public getService(name: string): TimeChainService | null {
    const service = this.services.get(name);
    if (!service) {
      this.logger.warn(`Service '${name}' not found`);
      return null;
    }
    return service;
  }

  /**
   * Create an isolated (unnamed) TimeChain service instance
   */
  public createIsolatedService(config?: TimeServiceConfig): TimeChainService {
    this.logger.debug("Creating isolated TimeChain service");
    return new TimeChainService(config);
  }

  /**
   * Destroy a named service
   */
  public destroyService(name: string): boolean {
    const service = this.services.get(name);
    if (!service) {
      this.logger.warn(`Cannot destroy service '${name}' - not found`);
      return false;
    }

    this.logger.info(`Destroying TimeChain service: ${name}`);
    service.stop();
    this.services.delete(name);

    // Clear global reference if this was the global service
    if (name === "global") {
      this.globalService = null;
    }

    return true;
  }

  /**
   * Destroy the global time service instance
   */
  public destroyGlobalService(): boolean {
    return this.destroyService("global");
  }

  /**
   * Destroy all services
   */
  public destroyAllServices(): void {
    this.logger.info(
      `Destroying all TimeChain services (${this.services.size} services)`
    );

    for (const [name, service] of this.services) {
      this.logger.debug(`Stopping service: ${name}`);
      service.stop();
    }

    this.services.clear();
    this.globalService = null;
  }

  /**
   * Get list of all active service names
   */
  public getActiveServices(): string[] {
    return Array.from(this.services.keys());
  }

  /**
   * Get service count
   */
  public getServiceCount(): number {
    return this.services.size;
  }

  /**
   * Check if a service exists
   */
  public hasService(name: string): boolean {
    return this.services.has(name);
  }

  /**
   * Sync all services with time server
   */
  public async syncAllServices(): Promise<Map<string, TimeDrift>> {
    this.logger.info(
      `Syncing all TimeChain services (${this.services.size} services)`
    );

    const results = new Map<string, TimeDrift>();
    const syncPromises = Array.from(this.services.entries()).map(
      async ([name, service]) => {
        try {
          const drift = await service.syncTime();
          results.set(name, drift);
          this.logger.debug(`Service '${name}' synced`, { drift: drift.drift });
        } catch (error) {
          this.logger.error(`Failed to sync service '${name}'`, { error });
          // Add error result
          results.set(name, {
            drift: 0,
            lastSync: 0,
            isAcceptable: false,
          });
        }
      }
    );

    await Promise.all(syncPromises);
    return results;
  }

  /**
   * Get drift information for all services
   */
  public getAllDrifts(): Map<string, TimeDrift> {
    const drifts = new Map<string, TimeDrift>();

    for (const [name, service] of this.services) {
      drifts.set(name, service.getDrift());
    }

    return drifts;
  }

  /**
   * Get services with unacceptable drift
   */
  public getServicesWithDrift(): string[] {
    const problematicServices: string[] = [];

    for (const [name, service] of this.services) {
      const drift = service.getDrift();
      if (!drift.isAcceptable) {
        problematicServices.push(name);
      }
    }

    return problematicServices;
  }

  /**
   * Get manager statistics
   */
  public getStats(): {
    totalServices: number;
    activeServices: string[];
    hasGlobalService: boolean;
    servicesWithDrift: string[];
    lastSyncTimes: Map<string, number>;
  } {
    const drifts = this.getAllDrifts();
    const lastSyncTimes = new Map<string, number>();

    for (const [name, drift] of drifts) {
      lastSyncTimes.set(name, drift.lastSync);
    }

    return {
      totalServices: this.services.size,
      activeServices: this.getActiveServices(),
      hasGlobalService: this.globalService !== null,
      servicesWithDrift: this.getServicesWithDrift(),
      lastSyncTimes,
    };
  }

  /**
   * Health check for all services
   */
  public async healthCheck(): Promise<{
    healthy: string[];
    unhealthy: string[];
    details: Map<string, { drift: TimeDrift; responsive: boolean }>;
  }> {
    this.logger.debug("Running health check on all TimeChain services");

    const healthy: string[] = [];
    const unhealthy: string[] = [];
    const details = new Map<
      string,
      { drift: TimeDrift; responsive: boolean }
    >();

    for (const [name, service] of this.services) {
      try {
        // Test responsiveness by getting current time
        const startTime = Date.now();
        service.now();
        const responseTime = Date.now() - startTime;

        const drift = service.getDrift();
        const isResponsive = responseTime < 100; // 100ms threshold

        details.set(name, {
          drift,
          responsive: isResponsive,
        });

        if (drift.isAcceptable && isResponsive) {
          healthy.push(name);
        } else {
          unhealthy.push(name);
        }
      } catch (error) {
        this.logger.error(`Health check failed for service '${name}'`, {
          error,
        });
        unhealthy.push(name);
        details.set(name, {
          drift: { drift: 0, lastSync: 0, isAcceptable: false },
          responsive: false,
        });
      }
    }

    this.logger.info("Health check completed", {
      healthy: healthy.length,
      unhealthy: unhealthy.length,
    });

    return { healthy, unhealthy, details };
  }

  /**
   * Reset manager state (for testing)
   */
  public reset(): void {
    this.logger.warn("Resetting TimeServiceManager state");
    this.destroyAllServices();
  }
}

// Export singleton instance for convenience
export const timeServiceManager = TimeServiceManager.getInstance();
