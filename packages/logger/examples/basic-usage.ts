/**
 * Basic usage examples for @botking/logger
 */

import {
  createLogger,
  createPackageLogger,
  LogLevel,
  LoggerConfigBuilder,
  MonitoringEventType,
  ConsoleMonitoringPlugin,
  SentryMonitoringPlugin,
} from "../src";

// Example 1: Simple logger creation
console.log("=== Basic Logger Usage ===");

const basicLogger = createLogger("my-service", {
  level: LogLevel.DEBUG,
  enableConsole: true,
  enableMonitoring: true,
});

basicLogger.info("Application started");
basicLogger.debug("Debug information", { userId: "123", action: "login" });
basicLogger.warn("This is a warning");
basicLogger.error(
  "An error occurred",
  { errorCode: "AUTH_001" },
  new Error("Authentication failed")
);

// Example 2: Package-specific logger
console.log("\n=== Package Logger ===");

const packageLogger = createPackageLogger("artifact");
packageLogger.info("Artifact package initialized");

// Example 3: Child logger with context
console.log("\n=== Child Logger ===");

const userLogger = basicLogger.child({
  userId: "user123",
  sessionId: "session456",
});
userLogger.info("User performed action", { action: "create_bot" });
userLogger.info("User performed another action", { action: "update_bot" });

// Example 4: Performance tracking
console.log("\n=== Performance Tracking ===");

// Manual timing
const stopTimer = basicLogger.startTimer("data-processing");
setTimeout(() => {
  stopTimer(); // This will log the duration
}, 100);

// Async operation timing
async function simulateAsyncWork() {
  await new Promise((resolve) => setTimeout(resolve, 50));
  return "work completed";
}

basicLogger.timeAsync("async-operation", simulateAsyncWork).then((result) => {
  console.log("Async result:", result);
});

// Example 5: Monitoring events
console.log("\n=== Monitoring Events ===");

basicLogger.trackEvent({
  type: MonitoringEventType.USER_ACTION,
  name: "bot_created",
  data: {
    botType: "worker",
    skeletonType: "balanced",
  },
  timestamp: new Date(),
  userId: "user123",
  severity: "medium",
  tags: ["bot", "creation"],
});

basicLogger.trackEvent({
  type: MonitoringEventType.PERFORMANCE,
  name: "slow_query",
  data: {
    query: "SELECT * FROM bots",
    duration: 2500,
  },
  timestamp: new Date(),
  severity: "high",
});

// Example 6: Using LoggerConfigBuilder
console.log("\n=== Config Builder ===");

const advancedLogger = new LoggerConfigBuilder()
  .service("advanced-service")
  .level(LogLevel.VERBOSE)
  .environment("development")
  .enableConsole(true, { colorize: true, timestamp: true })
  .enableFile(false)
  .enableMonitoring(true)
  .metadata({ version: "2.0.0", component: "bot-engine" })
  .createLogger({ feature: "slot-assignment" });

advancedLogger.verbose("Advanced logger created");
advancedLogger.info("Processing bot assembly", {
  botId: "bot_123",
  operation: "install_part",
});

// Example 7: Adding monitoring plugins
console.log("\n=== Monitoring Plugins ===");

const monitoredLogger = createLogger("monitored-service", {
  level: LogLevel.INFO,
  enableMonitoring: true,
});

// Add console monitoring plugin
const consolePlugin = new ConsoleMonitoringPlugin();
consolePlugin.initialize({ enabled: true });
monitoredLogger.addPlugin(consolePlugin);

// Add Sentry plugin (mock implementation)
const sentryPlugin = new SentryMonitoringPlugin();
try {
  sentryPlugin.initialize({
    dsn: "your-sentry-dsn",
    environment: "development",
  });
  monitoredLogger.addPlugin(sentryPlugin);
} catch (error) {
  console.log("Sentry plugin not available (mock implementation)");
}

// Log some events that will be sent to plugins
monitoredLogger.error(
  "Critical error",
  { service: "payment" },
  new Error("Payment processing failed")
);
monitoredLogger.warn("Resource usage high", { memory: "85%", cpu: "92%" });

monitoredLogger.trackEvent({
  type: MonitoringEventType.ERROR,
  name: "payment_failure",
  data: {
    userId: "user456",
    amount: 99.99,
    currency: "USD",
  },
  timestamp: new Date(),
  severity: "critical",
});

// Example 8: Environment-based configuration
console.log("\n=== Environment Configuration ===");

function createEnvironmentLogger(env: string) {
  if (env === "production") {
    return new LoggerConfigBuilder()
      .service("bot-service")
      .level(LogLevel.WARN)
      .environment("production")
      .enableConsole(false)
      .enableFile(true, {
        filename: "logs/application-%DATE%.log",
        maxFiles: "30d",
        maxSize: "20m",
      })
      .enableMonitoring(true)
      .createLogger();
  } else {
    return new LoggerConfigBuilder()
      .service("bot-service")
      .level(LogLevel.DEBUG)
      .environment("development")
      .enableConsole(true, { colorize: true })
      .enableMonitoring(true)
      .createLogger();
  }
}

const envLogger = createEnvironmentLogger(
  process.env.NODE_ENV || "development"
);
envLogger.info("Environment-specific logger created");

console.log("\n=== Examples completed ===");
