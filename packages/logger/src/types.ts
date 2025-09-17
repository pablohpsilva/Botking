/**
 * Log levels following standard logging conventions
 */
export enum LogLevel {
  ERROR = "error",
  WARN = "warn",
  INFO = "info",
  HTTP = "http",
  VERBOSE = "verbose",
  DEBUG = "debug",
  SILLY = "silly",
}

/**
 * Log context for additional metadata
 */
export interface LogContext {
  userId?: string;
  sessionId?: string;
  requestId?: string;
  botId?: string;
  action?: string;
  component?: string;
  service?: string;
  [key: string]: any;
}

/**
 * Log entry structure
 */
export interface LogEntry {
  timestamp: Date;
  level: LogLevel;
  message: string;
  context?: LogContext;
  error?: Error;
  metadata?: Record<string, any>;
  source?: string;
}

/**
 * Monitoring event types for external integrations
 */
export enum MonitoringEventType {
  ERROR = "error",
  PERFORMANCE = "performance",
  BUSINESS = "business",
  SECURITY = "security",
  USER_ACTION = "user_action",
  SYSTEM = "system",
}

/**
 * Monitoring event structure
 */
export interface MonitoringEvent {
  type: MonitoringEventType;
  name: string;
  data: Record<string, any>;
  timestamp: Date;
  userId?: string;
  sessionId?: string;
  severity?: "low" | "medium" | "high" | "critical";
  tags?: string[];
}

/**
 * Performance metrics structure
 */
export interface PerformanceMetrics {
  operation: string;
  duration: number;
  success: boolean;
  timestamp: Date;
  metadata?: Record<string, any>;
}

/**
 * Logger configuration
 */
export interface LoggerConfig {
  level: LogLevel;
  service: string;
  environment: "development" | "staging" | "production" | "test";
  enableConsole: boolean;
  enableFile: boolean;
  enableMonitoring: boolean;
  fileConfig?: {
    filename: string;
    maxFiles?: string;
    maxSize?: string;
    datePattern?: string;
  };
  consoleConfig?: {
    colorize: boolean;
    timestamp: boolean;
  };
  metadata?: Record<string, any>;
}

/**
 * Monitoring plugin interface for external integrations
 */
export interface IMonitoringPlugin {
  name: string;
  version: string;
  initialize(config: Record<string, any>): Promise<void>;
  sendEvent(event: MonitoringEvent): Promise<void>;
  sendMetrics(metrics: PerformanceMetrics): Promise<void>;
  sendLog(entry: LogEntry): Promise<void>;
  destroy(): Promise<void>;
}

/**
 * Main logger interface
 */
export interface ILogger {
  // Basic logging methods
  error(message: string, context?: LogContext, error?: Error): void;
  warn(message: string, context?: LogContext): void;
  info(message: string, context?: LogContext): void;
  http(message: string, context?: LogContext): void;
  verbose(message: string, context?: LogContext): void;
  debug(message: string, context?: LogContext): void;
  silly(message: string, context?: LogContext): void;

  // Generic log method
  log(
    level: LogLevel,
    message: string,
    context?: LogContext,
    error?: Error
  ): void;

  // Monitoring and metrics
  trackEvent(event: MonitoringEvent): void;
  trackPerformance(metrics: PerformanceMetrics): void;

  // Performance timing helpers
  startTimer(operation: string, context?: LogContext): () => void;
  timeAsync<T>(
    operation: string,
    fn: () => Promise<T>,
    context?: LogContext
  ): Promise<T>;

  // Child logger with additional context
  child(context: LogContext): ILogger;

  // Plugin management
  addPlugin(plugin: IMonitoringPlugin): void;
  removePlugin(pluginName: string): void;

  // Configuration
  setLevel(level: LogLevel): void;
  getLevel(): LogLevel;
}
