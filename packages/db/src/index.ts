/**
 * Botking Database Package
 *
 * Object-Oriented database layer with:
 * - DatabaseManager: Central database operations
 * - ConnectionManager: Connection lifecycle management
 * - SchemaValidator: Type-safe validation
 * - BaseRepository: CRUD operations with caching
 * - Generated Zod schemas: Type-safe validation schemas
 */

// Export main OOP classes
export * from "./connection-manager";

// Export Prisma types and client (for advanced usage)
export * from "@prisma/client";

// Note: Zod schemas and helpers are available via separate export paths in package.json
// Import them using:
// - import { ... } from '@botking/db/schemas' for Zod schemas
// - import { ... } from '@botking/db/schemas/helpers' for JSON helpers
