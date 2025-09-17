import { getTimeService } from "./time-service";
import type { SystemTime } from "./types";

/**
 * System Clock - Simple interface for getting consistent time across the system
 * This is the main API that other services should use
 */
export class SystemClock {
  private static instance: SystemClock | null = null;

  /**
   * Gets the singleton instance of the system clock
   */
  static getInstance(): SystemClock {
    if (!SystemClock.instance) {
      SystemClock.instance = new SystemClock();
    }
    return SystemClock.instance;
  }

  /**
   * Gets the current system time
   */
  now(): SystemTime {
    return getTimeService().now();
  }

  /**
   * Gets current timestamp in milliseconds
   */
  timestamp(): number {
    return getTimeService().getTimestamp();
  }

  /**
   * Gets current Unix timestamp in seconds
   */
  unix(): number {
    return getTimeService().getUnixTimestamp();
  }

  /**
   * Gets current ISO string (UTC)
   */
  iso(): string {
    return getTimeService().getISOString();
  }

  /**
   * Gets current Date object (UTC)
   */
  date(): Date {
    return getTimeService().getDate();
  }

  /**
   * Measures execution time
   */
  async measure<T>(
    fn: () => T | Promise<T>
  ): Promise<{ result: T; duration: number }> {
    return getTimeService().measure(fn);
  }

  /**
   * Sleeps for specified milliseconds
   */
  sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Creates a timer that tracks elapsed time
   */
  createTimer(): Timer {
    return new Timer();
  }

  /**
   * Syncs with time server and returns drift info
   */
  async sync() {
    return getTimeService().syncTime();
  }

  /**
   * Gets current time drift information
   */
  getDrift() {
    return getTimeService().getDrift();
  }
}

/**
 * Timer utility for tracking elapsed time
 */
export class Timer {
  private startTime: number;

  constructor() {
    this.startTime = getTimeService().getTimestamp();
  }

  /**
   * Gets elapsed time in milliseconds
   */
  elapsed(): number {
    return getTimeService().getTimestamp() - this.startTime;
  }

  /**
   * Resets the timer
   */
  reset(): void {
    this.startTime = getTimeService().getTimestamp();
  }

  /**
   * Gets elapsed time and resets
   */
  lap(): number {
    const elapsed = this.elapsed();
    this.reset();
    return elapsed;
  }
}

// Export singleton instance
export const clock = SystemClock.getInstance();
