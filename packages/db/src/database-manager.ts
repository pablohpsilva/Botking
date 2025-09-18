import { PrismaClient, Prisma } from "@prisma/client";
import { LoggerFactory } from "@botking/logger";
import { SchemaValidator } from "./schema-validator";
import { ConnectionManager } from "./connection-manager";
import type { BaseRepository } from "./repositories/base-repository";

/**
 * DatabaseManager - Central class for all database operations
 * Encapsulates Prisma client and provides high-level database operations
 */
export class DatabaseManager {
  private static instance: DatabaseManager;
  private prisma: PrismaClient;
  private schemaValidator: SchemaValidator;
  private connectionManager: ConnectionManager;
  private logger: ReturnType<typeof LoggerFactory.createPackageLogger>;
  private repositories: Map<string, BaseRepository<any>> = new Map();

  private constructor() {
    this.logger = LoggerFactory.createPackageLogger("db", {
      service: "database-manager",
    });
    this.connectionManager = ConnectionManager.getInstance();
    this.prisma = this.connectionManager.getClient();
    this.schemaValidator = new SchemaValidator();
  }

  /**
   * Get singleton instance of DatabaseManager
   */
  public static getInstance(): DatabaseManager {
    if (!DatabaseManager.instance) {
      DatabaseManager.instance = new DatabaseManager();
    }
    return DatabaseManager.instance;
  }

  /**
   * Initialize database connection and run migrations if needed
   */
  public async initialize(): Promise<void> {
    try {
      this.logger.info("Initializing database connection...");
      await this.connectionManager.connect();
      await this.runHealthCheck();
      this.logger.info("Database initialized successfully");
    } catch (error) {
      this.logger.error("Failed to initialize database", { error });
      throw error;
    }
  }

  /**
   * Gracefully disconnect from database
   */
  public async disconnect(): Promise<void> {
    try {
      this.logger.info("Disconnecting from database...");
      await this.connectionManager.disconnect();
      this.repositories.clear();
      this.logger.info("Database disconnected successfully");
    } catch (error) {
      this.logger.error("Error during database disconnection", { error });
      throw error;
    }
  }

  /**
   * Get Prisma client instance (for advanced operations)
   */
  public getClient(): PrismaClient {
    return this.prisma;
  }

  /**
   * Get schema validator instance
   */
  public getValidator(): SchemaValidator {
    return this.schemaValidator;
  }

  /**
   * Get repository for a specific entity
   */
  public getRepository<T>(entityName: string): BaseRepository<T> {
    if (!this.repositories.has(entityName)) {
      throw new Error(`Repository for entity '${entityName}' not registered`);
    }
    return this.repositories.get(entityName) as BaseRepository<T>;
  }

  /**
   * Register a repository for an entity
   */
  public registerRepository<T>(
    entityName: string,
    repository: BaseRepository<T>
  ): void {
    this.repositories.set(entityName, repository);
    this.logger.debug(`Registered repository for entity: ${entityName}`);
  }

  /**
   * Execute a transaction with automatic rollback on error
   */
  public async executeTransaction<T>(
    operation: (tx: Prisma.TransactionClient) => Promise<T>
  ): Promise<T> {
    try {
      this.logger.debug("Starting database transaction");
      const result = await this.prisma.$transaction(operation);
      this.logger.debug("Transaction completed successfully");
      return result;
    } catch (error) {
      this.logger.error("Transaction failed, rolling back", { error });
      throw error;
    }
  }

  /**
   * Run database health check
   */
  public async runHealthCheck(): Promise<boolean> {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      this.logger.debug("Database health check passed");
      return true;
    } catch (error) {
      this.logger.error("Database health check failed", { error });
      return false;
    }
  }

  /**
   * Get database connection info
   */
  public getConnectionInfo(): {
    isConnected: boolean;
    databaseUrl: string;
    repositoryCount: number;
  } {
    return {
      isConnected: this.connectionManager.isConnected(),
      databaseUrl: this.connectionManager.getDatabaseUrl(),
      repositoryCount: this.repositories.size,
    };
  }

  /**
   * Clear all cached data and reset connections
   */
  public async reset(): Promise<void> {
    this.logger.info("Resetting database manager...");
    await this.disconnect();
    this.repositories.clear();
    await this.initialize();
    this.logger.info("Database manager reset completed");
  }

  /**
   * Execute raw SQL query (use with caution)
   */
  public async executeRawQuery<T = any>(
    query: string,
    params?: any[]
  ): Promise<T[]> {
    try {
      this.logger.debug("Executing raw query", { query });
      const result = await this.prisma.$queryRawUnsafe<T[]>(
        query,
        ...(params || [])
      );
      return result;
    } catch (error) {
      this.logger.error("Raw query execution failed", { query, error });
      throw error;
    }
  }

  /**
   * Get database statistics
   */
  public async getDatabaseStats(): Promise<{
    totalTables: number;
    connectionCount: number;
    lastHealthCheck: Date;
  }> {
    const tables = await this.prisma.$queryRaw<Array<{ count: number }>>`
      SELECT COUNT(*) as count FROM information_schema.tables 
      WHERE table_schema = 'public'
    `;

    return {
      totalTables: Number(tables[0]?.count || 0),
      connectionCount: 1, // Prisma manages connection pooling internally
      lastHealthCheck: new Date(),
    };
  }
}

// Export singleton instance for convenience
export const databaseManager = DatabaseManager.getInstance();
