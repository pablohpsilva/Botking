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
export { DatabaseManager, databaseManager } from "./database-manager";
export { ConnectionManager, connectionManager } from "./connection-manager";
export { SchemaValidator, schemaValidator } from "./schema-validator";
export type {
  ValidationResult,
  ValidationError,
  ValidationWarning,
} from "./schema-validator";

// Export repository base classes
export { BaseRepository } from "./repositories/base-repository";
export type {
  IRepository,
  FindManyOptions,
  RepositoryConfig,
} from "./repositories/base-repository";

// Export Prisma types and client (for advanced usage)
export * from "@prisma/client";

// Export our curated Zod schemas and validation DTOs
export * from "./schemas";

// Backward compatibility - export singleton instances
import { databaseManager } from "./database-manager";

/**
 * @deprecated Use DatabaseManager.getInstance().getClient() instead
 * Kept for backward compatibility
 */
export const prisma = databaseManager.getClient();
