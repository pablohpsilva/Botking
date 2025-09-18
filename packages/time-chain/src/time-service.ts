import type { SystemTime, TimeServiceConfig, TimeDrift } from "./types";
import { createPackageLogger } from "@botking/logger";

/**
 * TimeChain Service - Authoritative time source for the entire system
 * Provides consistent UTC time regardless of where it's running
 */
export class TimeChainService {
  private static logger = createPackageLogger("time-chain");
  private config: Required<TimeServiceConfig>;
  private timeOffset: number = 0; // Difference from server time
  private lastSyncTime: number = 0;
  private syncTimer?: ReturnType<typeof setInterval>;

  constructor(config: TimeServiceConfig = {}) {
    this.config = {
      useHighResolution: true,
      timeServerUrl: "https://worldtimeapi.org/api/timezone/UTC",
      syncInterval: 300000, // 5 minutes
      maxDrift: 1000, // 1 second
      ...config,
    };

    // Initial sync and start periodic sync
    this.syncTime();
    this.startPeriodicSync();
  }

  /**
   * Gets the current system time (authoritative UTC)
   */
  now(): SystemTime {
    const timestamp = this.getAccurateTimestamp();
    const utc = new Date(timestamp);

    return {
      timestamp,
      utc,
      iso: utc.toISOString(),
      unix: Math.floor(timestamp / 1000),
      highRes: this.config.useHighResolution
        ? this.getHighResTime()
        : undefined,
    };
  }

  /**
   * Gets current timestamp in milliseconds (corrected for drift)
   */
  getTimestamp(): number {
    return this.getAccurateTimestamp();
  }

  /**
   * Gets current Unix timestamp in seconds (corrected for drift)
   */
  getUnixTimestamp(): number {
    return Math.floor(this.getAccurateTimestamp() / 1000);
  }

  /**
   * Gets current ISO string (always UTC)
   */
  getISOString(): string {
    return new Date(this.getAccurateTimestamp()).toISOString();
  }

  /**
   * Creates a Date object with accurate time
   */
  getDate(): Date {
    return new Date(this.getAccurateTimestamp());
  }

  /**
   * Gets high-resolution time for performance measurements
   */
  getHighResTime(): number {
    if (typeof performance !== "undefined" && performance.now) {
      return performance.now();
    }
    return Date.now();
  }

  /**
   * Measures execution time of a function
   */
  async measure<T>(
    fn: () => T | Promise<T>
  ): Promise<{ result: T; duration: number }> {
    const start = this.getHighResTime();
    const result = await fn();
    const end = this.getHighResTime();

    return {
      result,
      duration: end - start,
    };
  }

  /**
   * Gets time drift information
   */
  getDrift(): TimeDrift {
    const drift = this.timeOffset;
    const isAcceptable = Math.abs(drift) <= this.config.maxDrift;

    return {
      drift,
      lastSync: this.lastSyncTime,
      isAcceptable,
    };
  }

  /**
   * Manually sync time with server
   */
  async syncTime(): Promise<TimeDrift> {
    try {
      const serverTime = await this.fetchServerTime();
      const localTime = Date.now();

      this.timeOffset = serverTime - localTime;
      this.lastSyncTime = localTime;

      return this.getDrift();
    } catch (error) {
      TimeChainService.logger.warn("Time sync failed", {
        error: error instanceof Error ? error.message : String(error),
        action: "time_sync_failed",
      });
      return this.getDrift();
    }
  }

  /**
   * Stops the time synchronization service
   */
  stop(): void {
    if (this.syncTimer) {
      clearInterval(this.syncTimer);
      this.syncTimer = undefined;
    }
  }

  /**
   * Starts periodic time synchronization
   */
  private startPeriodicSync(): void {
    this.syncTimer = setInterval(() => {
      this.syncTime();
    }, this.config.syncInterval);
  }

  /**
   * Gets accurate timestamp corrected for drift
   */
  private getAccurateTimestamp(): number {
    return Date.now() + this.timeOffset;
  }

  /**
   * Fetches time from external server
   */
  private async fetchServerTime(): Promise<number> {
    try {
      const response = await fetch(this.config.timeServerUrl);
      const data = await response.json();

      // WorldTimeAPI format
      if (data.unixtime) {
        return data.unixtime * 1000; // Convert to milliseconds
      }

      // Fallback to datetime field
      if (data.datetime) {
        return new Date(data.datetime).getTime();
      }

      throw new Error("Invalid response format");
    } catch (error) {
      // Fallback to local time if server is unavailable
      TimeChainService.logger.warn(
        "Server time fetch failed, using local time",
        {
          error: error instanceof Error ? error.message : String(error),
          action: "server_time_fetch_failed",
          fallback: "local_time",
        }
      );
      return Date.now();
    }
  }
}

import { timeServiceManager } from "./time-service-manager";

/**
 * @deprecated Use TimeServiceManager.getInstance().getGlobalService() instead
 * Gets the global TimeChain service instance
 */
export function getTimeService(config?: TimeServiceConfig): TimeChainService {
  return timeServiceManager.getGlobalService(config);
}

/**
 * @deprecated Use TimeServiceManager.getInstance().createIsolatedService() instead
 * Creates a new isolated TimeChain service instance
 */
export function createTimeService(
  config?: TimeServiceConfig
): TimeChainService {
  return timeServiceManager.createIsolatedService(config);
}

/**
 * @deprecated Use TimeServiceManager.getInstance().destroyGlobalService() instead
 * Destroys the global time service instance
 */
export function destroyGlobalTimeService(): void {
  timeServiceManager.destroyGlobalService();
}
