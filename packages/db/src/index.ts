/**
 * Botking Database Package
 *
 * Object-Oriented database layer with:
 * - DatabaseManager: Central database operations
 * - ConnectionManager: Connection lifecycle management
 * - SchemaValidator: Type-safe validation
 * - BaseRepository: CRUD operations with caching
 */

// Export main OOP classes
export * from "./database-manager";
export * from "./connection-manager";
export * from "./schema-validator";

// Export repository base classes
export * from "./repositories/base-repository";

// Export Prisma types and client (for advanced usage)
export * from "@prisma/client";

// Export our curated Zod schemas and validation DTOs
export * from "./schemas";
