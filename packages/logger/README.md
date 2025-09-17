# @botking/logger

A comprehensive logging system for the Botking project with monitoring plugin support and structured logging capabilities.

## Features

- 🎯 **Structured Logging**: Rich context and metadata support
- 🔌 **Plugin Architecture**: Easy integration with monitoring tools (Sentry, Datadog, etc.)
- ⚡ **Performance Tracking**: Built-in timing and metrics collection
- 🎨 **Flexible Configuration**: Environment-based setup with fluent API
- 📊 **Multiple Transports**: Console, file rotation, and custom outputs
- 🧩 **Package Integration**: Designed for use across all Botking packages
- 🎛️ **Child Loggers**: Contextual logging with inheritance

## Installation

```bash
pnpm add @botking/logger
```

## Quick Start

```typescript
import { createLogger, LogLevel } from "@botking/logger";

// Create a basic logger
const logger = createLogger("my-service", {
  level: LogLevel.INFO,
  enableConsole: true,
  enableMonitoring: true,
});

// Log messages
logger.info("Application started");
logger.error("Something went wrong", { userId: "123" }, new Error("Oops"));

// Track performance
const result = await logger.timeAsync("database-query", async () => {
  return await database.findUsers();
});
```

## Core Concepts

### Logger Levels

```typescript
enum LogLevel {
  ERROR = "error",
  WARN = "warn",
  INFO = "info",
  HTTP = "http",
  VERBOSE = "verbose",
  DEBUG = "debug",
  SILLY = "silly",
}
```

### Log Context

Add structured metadata to your logs:

```typescript
const context = {
  userId: "user123",
  sessionId: "session456",
  action: "create_bot",
  botType: "WORKER",
};

logger.info("Bot created successfully", context);
```

## Configuration

### Using LoggerConfigBuilder

```typescript
import { LoggerConfigBuilder, LogLevel } from "@botking/logger";

const logger = new LoggerConfigBuilder()
  .service("bot-service")
  .level(LogLevel.DEBUG)
  .environment("development")
  .enableConsole(true, { colorize: true })
  .enableFile(true, {
    filename: "logs/app-%DATE%.log",
    maxFiles: "30d",
  })
  .enableMonitoring(true)
  .metadata({ version: "1.0.0" })
  .createLogger();
```

### Factory Methods

```typescript
import {
  createLogger,
  createPackageLogger,
  createDevelopmentLogger,
  createProductionLogger,
} from "@botking/logger";

// Basic logger
const logger = createLogger("my-service");

// Package-specific logger
const artifactLogger = createPackageLogger("artifact");

// Environment-specific loggers
const devLogger = createDevelopmentLogger("dev-service");
const prodLogger = createProductionLogger("prod-service", [sentryPlugin]);
```

## Child Loggers

Create contextual loggers that inherit configuration:

```typescript
const userLogger = logger.child({
  userId: "user123",
  sessionId: "session456",
});

// All logs from userLogger will include userId and sessionId
userLogger.info("User performed action", { action: "login" });
userLogger.warn("Rate limit approaching");
```

## Performance Tracking

### Timer Functions

```typescript
// Manual timing
const stopTimer = logger.startTimer("data-processing", { recordCount: 1000 });
// ... do work ...
stopTimer(); // Logs duration and sends metrics

// Async timing
const result = await logger.timeAsync(
  "api-call",
  async () => {
    return await fetchExternalAPI();
  },
  { endpoint: "/users" }
);
```

### Custom Metrics

```typescript
logger.trackPerformance({
  operation: "bot-assembly",
  duration: 150,
  success: true,
  timestamp: new Date(),
  metadata: { botType: "WORKER", partCount: 5 },
});
```

## Monitoring Events

Track business and system events:

```typescript
import { MonitoringEventType } from "@botking/logger";

logger.trackEvent({
  type: MonitoringEventType.USER_ACTION,
  name: "bot_created",
  data: {
    botId: "bot_123",
    botType: "WORKER",
    userId: "user456",
  },
  timestamp: new Date(),
  severity: "medium",
  tags: ["bot", "creation"],
});
```

## Monitoring Plugins

### Built-in Plugins

- **ConsoleMonitoringPlugin**: Development debugging
- **SentryMonitoringPlugin**: Error tracking and performance monitoring
- **DatadogMonitoringPlugin**: Metrics and logging

### Using Plugins

```typescript
import {
  SentryMonitoringPlugin,
  DatadogMonitoringPlugin,
} from "@botking/logger";

// Add Sentry for error tracking
const sentryPlugin = new SentryMonitoringPlugin();
await sentryPlugin.initialize({
  dsn: "your-sentry-dsn",
  environment: "production",
});
logger.addPlugin(sentryPlugin);

// Add Datadog for metrics
const datadogPlugin = new DatadogMonitoringPlugin();
await datadogPlugin.initialize({
  serviceName: "bot-service",
  environment: "production",
});
logger.addPlugin(datadogPlugin);
```

### Custom Plugins

```typescript
import { IMonitoringPlugin } from "@botking/logger";

class CustomMonitoringPlugin implements IMonitoringPlugin {
  name = "custom-monitoring";
  version = "1.0.0";

  async initialize(config: Record<string, any>): Promise<void> {
    // Initialize your monitoring service
  }

  async sendEvent(event: MonitoringEvent): Promise<void> {
    // Send event to your monitoring service
  }

  async sendMetrics(metrics: PerformanceMetrics): Promise<void> {
    // Send metrics to your monitoring service
  }

  async sendLog(entry: LogEntry): Promise<void> {
    // Send log to your monitoring service
  }

  async destroy(): Promise<void> {
    // Cleanup resources
  }
}
```

## Package Integration

### Using in Botking Packages

```typescript
// In packages/artifact/src/bot/bot.ts
import { createPackageLogger } from "@botking/logger";

class Bot {
  private logger = createPackageLogger("artifact");

  assemblePart(part: IPart): void {
    this.logger.info("Assembling part", {
      botId: this.id,
      partId: part.id,
      partCategory: part.category,
    });

    try {
      // Assembly logic
      this.logger.trackEvent({
        type: MonitoringEventType.BUSINESS,
        name: "part_assembled",
        data: { botId: this.id, partId: part.id },
      });
    } catch (error) {
      this.logger.error(
        "Part assembly failed",
        {
          botId: this.id,
          partId: part.id,
        },
        error
      );
      throw error;
    }
  }
}
```

### Cross-Package Context

```typescript
// Pass context between packages
const context = {
  requestId: "req_123",
  userId: "user_456",
};

// In artifact package
const artifactLogger = createPackageLogger("artifact").child(context);

// In domain package
const domainLogger = createPackageLogger("domain").child(context);

// Both loggers will include requestId and userId in all logs
```

## Environment Configuration

### Development

```typescript
const logger = createDevelopmentLogger("my-service");
// - Level: DEBUG
// - Console: enabled with colors
// - File: disabled
// - Monitoring: enabled with console plugin
```

### Production

```typescript
const logger = createProductionLogger("my-service", [
  sentryPlugin,
  datadogPlugin,
]);
// - Level: INFO
// - Console: disabled
// - File: enabled with rotation
// - Monitoring: enabled with provided plugins
```

### Environment Variables

```bash
# Override log level
LOG_LEVEL=debug

# Set environment
NODE_ENV=production
```

## File Logging

Configure file output with automatic rotation:

```typescript
const logger = createLogger("my-service", {
  enableFile: true,
  fileConfig: {
    filename: "logs/application-%DATE%.log",
    datePattern: "YYYY-MM-DD",
    maxFiles: "30d", // Keep 30 days
    maxSize: "20m", // Rotate at 20MB
  },
});
```

## Best Practices

### 1. Use Package Loggers

```typescript
// ✅ Good - package-specific logger
const logger = createPackageLogger("artifact");

// ❌ Avoid - generic logger
const logger = createLogger("app");
```

### 2. Include Relevant Context

```typescript
// ✅ Good - structured context
logger.info("User action", {
  userId: "123",
  action: "create_bot",
  botType: "WORKER",
});

// ❌ Avoid - unstructured messages
logger.info("User 123 created a WORKER bot");
```

### 3. Use Appropriate Log Levels

```typescript
logger.error("Critical system failure", context, error); // System issues
logger.warn("Rate limit approaching", context); // Warnings
logger.info("User logged in", context); // Business events
logger.debug("Processing step completed", context); // Debug info
```

### 4. Track Performance

```typescript
// ✅ Good - track important operations
const result = await logger.timeAsync("database-query", queryFn);

// ✅ Good - track business metrics
logger.trackEvent({
  type: MonitoringEventType.PERFORMANCE,
  name: "slow_operation",
  data: { duration: 2000 },
});
```

## Examples

See the [examples](./examples/) directory for complete usage examples:

- [basic-usage.ts](./examples/basic-usage.ts) - Basic logging features
- [package-integration.ts](./examples/package-integration.ts) - Cross-package integration

## API Reference

### Core Classes

- `Logger` - Main logger implementation
- `LoggerFactory` - Factory for creating loggers
- `LoggerConfigBuilder` - Fluent configuration API

### Types

- `ILogger` - Logger interface
- `LoggerConfig` - Configuration structure
- `LogContext` - Context metadata
- `LogEntry` - Log entry structure
- `MonitoringEvent` - Event tracking structure
- `PerformanceMetrics` - Performance data structure

### Plugins

- `IMonitoringPlugin` - Plugin interface
- `ConsoleMonitoringPlugin` - Development plugin
- `SentryMonitoringPlugin` - Sentry integration
- `DatadogMonitoringPlugin` - Datadog integration

## License

MIT
