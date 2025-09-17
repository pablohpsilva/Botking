# @botking/db

Database package with Prisma ORM for the Botking Turborepo.

## Features

- 🗄️ Prisma ORM with PostgreSQL
- 🔄 TypeScript support
- 🌱 Database seeding
- 🏗️ Singleton Prisma client pattern
- 📦 Monorepo ready
- 🔐 Better Auth ready schema

## Setup

1. **Environment Variables**
   Create a `.env` file in the package root:

   ```bash
   DATABASE_URL="postgresql://username:password@localhost:5432/database_name"
   ```

2. **Install Dependencies**

   ```bash
   pnpm install
   ```

3. **Generate Prisma Client**

   ```bash
   pnpm db:generate
   ```

4. **Push Schema to Database**
   ```bash
   pnpm db:push
   ```

## Scripts

- `pnpm build` - Build the TypeScript package
- `pnpm dev` - Watch mode for development
- `pnpm db:generate` - Generate Prisma client
- `pnpm db:push` - Push schema to database (development)
- `pnpm db:migrate` - Create and apply migrations
- `pnpm db:studio` - Open Prisma Studio
- `pnpm db:seed` - Seed the database

## Usage

```typescript
import { prisma } from "@botking/db";

// Create a user with Better Auth compatible fields
const user = await prisma.user.create({
  data: {
    email: "user@example.com",
    name: "John Doe",
    emailVerified: true,
  },
});

// Create a post
const post = await prisma.post.create({
  data: {
    title: "Hello World",
    content: "This is my first post!",
    authorId: user.id,
  },
});

// Create a session for the user
const session = await prisma.session.create({
  data: {
    token: "unique-session-token",
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    userId: user.id,
  },
});
```

## Schema

The package includes Better Auth compatible models:

### Authentication Models

- **User** - User accounts with email, email verification, name, and avatar
- **Session** - User sessions with tokens and expiration
- **Account** - Authentication provider accounts (OAuth, credentials, etc.)
- **Verification** - Email/token verification records

### Application Models

- **Post** - Example blog posts with title, content, and author relationship

The schema is fully compatible with [Better Auth](https://better-auth.com) and includes all required tables for authentication. You can modify the schema in `prisma/schema.prisma` to fit your needs.

## Development

The package uses a singleton pattern for the Prisma client to prevent multiple instances in development. This is automatically handled when you import from `@botking/db`.
