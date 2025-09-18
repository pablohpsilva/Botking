# cmd-botking

A production-ready Hono-based application demonstrating the complete Botking system in action.

## 🚀 Features

This application showcases the full Botking ecosystem:

- **🤖 Bot Management**: Create, validate, and manage bots using `@botking/artifact` factories
- **🎯 Item System**: Handle all item types (Speed-up, Resource, Tradeable, Gems) with validation
- **💫 Soul Chips**: Personality system with dialogue generation and trait management
- **💱 Trading System**: Complete trading events and offer management
- **📊 Health Monitoring**: Comprehensive health checks for all system components
- **📚 API Documentation**: OpenAPI specification with Swagger UI
- **🔒 Production Ready**: Error handling, logging, validation, and monitoring

## 📦 Architecture

The application demonstrates the complete Botking package ecosystem:

```
cmd-botking (Hono App)
├── @botking/db          # Database & Prisma integration
├── @botking/domain      # Business rules & validation
├── @botking/artifact    # Game objects & factories
├── @botking/dto         # Data persistence layer
├── @botking/logger      # Structured logging
└── @botking/time-chain  # Time management
```

## 🛠️ Installation

### Prerequisites

- Node.js 20+
- pnpm
- PostgreSQL database
- Docker (optional, for database)

### Setup

1. **Install dependencies:**

   ```bash
   cd apps/cmd-botking
   pnpm install
   ```

2. **Setup environment:**

   ```bash
   cp env.example .env
   # Edit .env with your database configuration
   ```

3. **Setup database:**

   ```bash
   # Option 1: Use Docker Compose (from project root)
   cd ../../
   docker-compose up -d

   # Option 2: Use your own PostgreSQL instance
   # Update DATABASE_URL in .env
   ```

4. **Generate Prisma client and push schema:**

   ```bash
   pnpm db:generate
   pnpm db:push
   ```

5. **Seed database (optional):**
   ```bash
   pnpm db:seed
   ```

## 🚀 Usage

### Development

```bash
# Start development server with hot reload
pnpm dev
```

The server will start on `http://localhost:3001`

### Production

```bash
# Build the application
pnpm build

# Start production server
pnpm start
```

### Testing

```bash
# Run tests
pnpm test

# Run tests once
pnpm test:run
```

## 📚 API Documentation

Once the server is running, access:

- **API Documentation**: `http://localhost:3001/docs`
- **Swagger UI**: `http://localhost:3001/swagger`
- **Health Check**: `http://localhost:3001/health`

## 🔗 API Endpoints

### Core Routes

- `GET /` - API information and available endpoints
- `GET /health` - Application health check

### Demo Routes (Artifact Showcase)

- `POST /demo/bot` - Create a bot using @botking/artifact factories
- `POST /demo/item` - Create an item using @botking/artifact factories
- `POST /demo/soul-chip` - Create a soul chip using @botking/artifact
- `GET /demo/workflow` - Run complete workflow demonstration

## 🎯 Example Usage

### Check API Information

```bash
curl http://localhost:3001/
```

### Create a Demo Bot

```bash
curl -X POST http://localhost:3001/demo/bot
```

### Create a Demo Soul Chip

```bash
curl -X POST http://localhost:3001/demo/soul-chip
```

### Create a Demo Item

```bash
curl -X POST http://localhost:3001/demo/item
```

### Run Full Workflow Demo

```bash
curl http://localhost:3001/demo/workflow
```

### Check Application Health

```bash
curl http://localhost:3001/health
```

## 🏗️ Package Integration Examples

### Artifact Factory Usage

```typescript
import { BotDTOFactory, BotType, SkeletonType } from '@botking/dto';

const botFactory = new BotDTOFactory();

// Create worker bot using artifact factory
const workerBot = botFactory.createWorkerArtifact(
  "Mining Bot",
  "user-123",
  "MINING"
);

// Validate using domain rules
const validation = botFactory.validateArtifact(workerBot);
console.log(\`Bot quality score: \${validation.score}/100\`);
```

### Domain Rules Integration

```typescript
import { slotCompatibilityService } from "@botking/domain";

// Check part compatibility
const compatibility = slotCompatibilityService.checkCompatibility(
  skeleton,
  part,
  "LEFT_ARM"
);
```

### Logging Integration

```typescript
import { createPackageLogger } from "@botking/logger";

const logger = createPackageLogger("cmd-botking", {
  service: "bot-service",
});

logger.info("Bot created successfully", {
  botId: bot.id,
  userId: bot.userId,
});
```

## 🔧 Configuration

### Environment Variables

See `env.example` for all available configuration options.

### Logging Configuration

The application uses `@botking/logger` for structured logging:

- **Development**: Pretty console output
- **Production**: JSON structured logs
- **Levels**: error, warn, info, debug

### Database Configuration

Uses `@botking/db` with Prisma for database operations:

- **Development**: Local PostgreSQL
- **Production**: Configure via `DATABASE_URL`
- **Migrations**: Handled via Prisma

## 🚀 Deployment

### Docker

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
RUN npm run build
EXPOSE 3001
CMD ["npm", "start"]
```

### Environment

Ensure the following environment variables are set:

- `DATABASE_URL` - PostgreSQL connection string
- `NODE_ENV=production`
- `PORT` - Server port (default: 3001)

## 🔍 Monitoring

The application includes comprehensive monitoring:

- **Health Checks**: Multiple endpoints for system health
- **Structured Logging**: All operations logged with context
- **Error Tracking**: Centralized error handling
- **Performance Metrics**: Request timing and resource usage

## 🤝 Contributing

This application serves as a reference implementation. To contribute:

1. Follow the established patterns for new endpoints
2. Use artifact factories for all object creation
3. Implement proper validation using domain rules
4. Add comprehensive logging and error handling
5. Update API documentation

## 📄 License

MIT License - see LICENSE file for details.
