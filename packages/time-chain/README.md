# @botking/time-chain

A centralized time service that provides consistent, authoritative UTC time across your entire system. Think of it as a master clock that all your services can rely on for accurate timing.

## 🎯 Purpose

This package is designed to be the **single source of truth** for time in your system. It eliminates time inconsistencies between different services, environments, and timezones by providing one authoritative UTC clock.

## 🌟 Features

- ⏰ **Authoritative Time Source** - Single source of truth for system time
- 🌍 **Always UTC** - No timezone confusion, always consistent
- 🔄 **Auto-Sync** - Automatically syncs with time servers to prevent drift
- 🚀 **High Performance** - High-resolution timing for measurements
- 📦 **Zero Config** - Works out of the box with sensible defaults
- 🎯 **TypeScript Native** - Full type safety and excellent IDE support
- 🔧 **Simple API** - Easy to use across your entire system

## 📦 Installation

```bash
pnpm install @botking/time-chain
```

## 🚀 Quick Start

```typescript
import { timeChain } from "@botking/time-chain";

// Get current system time (always UTC)
const now = timeChain.now();
console.log(now);
// {
//   timestamp: 1726509000000,
//   utc: 2024-09-16T18:30:00.000Z,
//   iso: '2024-09-16T18:30:00.000Z',
//   unix: 1726509000,
//   highRes: 12345.678
// }

// Quick access to different formats
console.log(timeChain.timestamp()); // 1726509000000
console.log(timeChain.unix()); // 1726509000
console.log(timeChain.iso()); // '2024-09-16T18:30:00.000Z'
console.log(timeChain.date()); // Date object (UTC)

// Measure execution time
const { result, duration } = await timeChain.measure(async () => {
  // Your code here
  return await someOperation();
});
console.log(`Operation took ${duration}ms`);

// Sleep utility
await timeChain.sleep(1000); // Wait 1 second

// Check time synchronization
const drift = timeChain.drift();
console.log(`Time drift: ${drift.drift}ms`);
```

## 📖 API Reference

### Main Clock API

#### `timeChain.now(): SystemTime`

Gets complete system time information (always UTC).

```typescript
const time = timeChain.now();
// {
//   timestamp: 1726509000000,  // milliseconds
//   utc: Date,                 // UTC Date object
//   iso: '2024-09-16T18:30:00.000Z',
//   unix: 1726509000,          // seconds
//   highRes: 12345.678         // high-res timestamp
// }
```

#### `timeChain.timestamp(): number`

Gets current timestamp in milliseconds.

#### `timeChain.unix(): number`

Gets current Unix timestamp in seconds.

#### `timeChain.iso(): string`

Gets current time as ISO string (UTC).

#### `timeChain.date(): Date`

Gets current time as Date object (UTC).

### Utilities

#### `timeChain.measure<T>(fn: () => T | Promise<T>): Promise<{ result: T; duration: number }>`

Measures execution time with high precision.

```typescript
const { result, duration } = await timeChain.measure(async () => {
  return await heavyOperation();
});
console.log(`Took ${duration}ms`);
```

#### `timeChain.sleep(ms: number): Promise<void>`

Async sleep utility.

```typescript
await timeChain.sleep(1000); // Wait 1 second
```

#### `timeChain.timer(): Timer`

Creates a high-precision timer.

```typescript
const timer = timeChain.timer();
// ... do work ...
console.log(`Elapsed: ${timer.elapsed()}ms`);
```

### Time Synchronization

#### `timeChain.sync(): Promise<TimeDrift>`

Manually sync with time server.

```typescript
const drift = await timeChain.sync();
console.log(`Drift corrected: ${drift.drift}ms`);
```

#### `timeChain.drift(): TimeDrift`

Gets current time drift information.

```typescript
const drift = timeChain.drift();
if (!drift.isAcceptable) {
  console.warn(`High time drift: ${drift.drift}ms`);
}
```

## 🎯 Why Use TimeChain?

### Problem: Time Inconsistencies

Different parts of your system might have:

- Different local times
- Timezone confusion
- Clock drift between servers
- Inconsistent timestamp formats

### Solution: Centralized Time Authority

TimeChain provides:

- **Single source of truth** - All services use the same time
- **Always UTC** - No timezone ambiguity
- **Auto-sync** - Prevents clock drift
- **High precision** - Accurate timing for all operations

### Use Cases

#### Database Operations

```typescript
import { timeChain } from "@botking/time-chain";

// All timestamps are consistent across your system
const user = await prisma.user.create({
  data: {
    email: "user@example.com",
    createdAt: timeChain.date(), // Always UTC
  },
});
```

#### Logging

```typescript
// Consistent log timestamps across all services
console.log(`[${timeChain.iso()}] Operation completed`);
```

#### Event Scheduling

```typescript
// Schedule events with precise timing
const scheduledFor = timeChain.timestamp() + 60 * 60 * 1000; // 1 hour from now
await scheduleJob(jobId, scheduledFor);
```

#### Performance Monitoring

```typescript
// Accurate performance measurements
const { result, duration } = await timeChain.measure(() => {
  return processLargeDataset();
});
metrics.recordDuration("dataset_processing", duration);
```

## 🌍 Environment Support

- ✅ **Browser** - Works with fetch API for time sync
- ✅ **Node.js** - Server-side time service
- ✅ **Edge Runtime** - Cloudflare Workers, Vercel Edge
- ✅ **React Native** - Mobile app support
- ✅ **Electron** - Desktop app support

## 🔧 Configuration

You can configure the time service behavior:

```typescript
import { createTimeService } from "@botking/time-chain";

const timeService = createTimeService({
  useHighResolution: true,
  timeServerUrl: "https://worldtimeapi.org/api/timezone/UTC",
  syncInterval: 300000, // 5 minutes
  maxDrift: 1000, // 1 second
});
```

## 🧪 Testing

```bash
# Run tests
pnpm test

# Watch mode
pnpm test:watch

# Coverage
pnpm test:coverage
```

## 🛠️ Best Practices

### 1. Use Throughout Your System

```typescript
// In your services, always use timeChain
import { timeChain } from "@botking/time-chain";

export class UserService {
  async createUser(data: CreateUserData) {
    return prisma.user.create({
      data: {
        ...data,
        createdAt: timeChain.date(), // Consistent time
      },
    });
  }
}
```

### 2. Monitor Time Drift

```typescript
// Set up monitoring
setInterval(() => {
  const drift = timeChain.drift();
  if (!drift.isAcceptable) {
    logger.warn(`High time drift detected: ${drift.drift}ms`);
    // Alert your monitoring system
  }
}, 60000); // Check every minute
```

### 3. Use for Scheduling

```typescript
// Schedule tasks using system time
const runAt = timeChain.timestamp() + delay;
scheduler.schedule(taskId, runAt);
```

## 📄 License

MIT License - see LICENSE file for details.

## 🤝 Contributing

Contributions are welcome! Please read our contributing guidelines and submit pull requests.

## 🔗 Related Packages

- `@botking/db` - Database utilities with timezone-aware timestamps
- More packages coming soon...

---

Made with ❤️ for the Botking monorepo
