export interface SystemTime {
  /** UTC timestamp in milliseconds */
  timestamp: number;
  /** UTC Date object */
  utc: Date;
  /** ISO 8601 string (always UTC) */
  iso: string;
  /** Unix timestamp in seconds */
  unix: number;
  /** High-resolution timestamp (if available) */
  highRes?: number;
}

export interface TimeServiceConfig {
  /** Enable high-resolution timing */
  useHighResolution?: boolean;
  /** Custom time server URL for synchronization */
  timeServerUrl?: string;
  /** Sync interval in milliseconds */
  syncInterval?: number;
  /** Maximum allowed time drift in milliseconds */
  maxDrift?: number;
}

export interface TimeDrift {
  /** Local time minus server time in milliseconds */
  drift: number;
  /** Last sync timestamp */
  lastSync: number;
  /** Whether drift is within acceptable limits */
  isAcceptable: boolean;
}
