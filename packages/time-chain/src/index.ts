// Main exports - System Clock API
export { SystemClock, Timer } from "./clock";
import { clock as _clock } from "./clock";
export { _clock as clock };

// Time Service (for advanced usage)
export {
  TimeChainService,
  getTimeService,
  createTimeService,
  destroyGlobalTimeService,
} from "./time-service";

// Types
export type { SystemTime, TimeServiceConfig, TimeDrift } from "./types";

// Simple API for quick access
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

  // Service management
  sync: () => _clock.sync(),
  drift: () => _clock.getDrift(),
};
