/**
 * Botking Time-Chain Package
 *
 * Object-Oriented time management with:
 * - TimeServiceManager: Centralized service management
 * - SystemClock: Simple time API
 * - TimeChainService: Advanced time operations
 * - Timer: Elapsed time tracking
 */

// Main OOP exports
export { TimeServiceManager, timeServiceManager } from "./time-service-manager";
export { SystemClock, Timer } from "./clock";
export { TimeChainService } from "./time-service";

// Singleton instances for convenience
import { clock as _clock } from "./clock";
import { timeServiceManager } from "./time-service-manager";
export { _clock as clock };

// Backward compatibility - deprecated utility functions
export {
  getTimeService,
  createTimeService,
  destroyGlobalTimeService,
} from "./time-service";

// Types
export type { SystemTime, TimeServiceConfig, TimeDrift } from "./types";

// Simple API for quick access (now using OOP internally)
export const timeChain = {
  // Current time (UTC always)
  now: () => _clock.now(),
  timestamp: () => _clock.timestamp(),
  unix: () => _clock.unix(),
  iso: () => _clock.iso(),
  date: () => _clock.date(),

  // Utilities
  sleep: (ms: number) => _clock.sleep(ms),
  measure: <T>(fn: () => T | Promise<T>) => _clock.measure(fn),
  timer: () => _clock.createTimer(),

  // Service management (now OOP)
  sync: () => _clock.sync(),
  drift: () => _clock.getDrift(),

  // Advanced OOP management
  manager: () => timeServiceManager,
};
