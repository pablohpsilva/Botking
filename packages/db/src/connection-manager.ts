import { PrismaClient } from "@prisma/client";
import { LoggerFactory } from "@botking/logger";

/**
 * ConnectionManager - Singleton class for managing database connections
 * Handles connection pooling, reconnection, and connection lifecycle
 */
export class ConnectionManager {
  private static instance: ConnectionManager;
  private prisma: PrismaClient | null = null;
  private logger: ReturnType<typeof LoggerFactory.createPackageLogger>;
  private isConnectedFlag: boolean = false;
  private connectionAttempts: number = 0;
  private maxRetries: number = 3;
  private retryDelay: number = 1000; // 1 second

  private constructor() {
    this.logger = LoggerFactory.createPackageLogger("db", {
      service: "connection-manager",
    });
  }

  /**
   * Get singleton instance of ConnectionManager
   */
  public static getInstance(): ConnectionManager {
    if (!ConnectionManager.instance) {
      ConnectionManager.instance = new ConnectionManager();
    }
    return ConnectionManager.instance;
  }

  /**
   * Get or create Prisma client instance
   */
  public getClient(): PrismaClient {
    if (!this.prisma) {
      this.createClient();
    }
    return this.prisma!;
  }

  /**
   * Create new Prisma client with optimal configuration
   */
  private createClient(): void {
    try {
      this.logger.debug("Creating new Prisma client...");

      // Prevent multiple instances in development
      if (
        process.env.NODE_ENV === "development" &&
        (globalThis as any).__prisma
      ) {
        this.prisma = (globalThis as any).__prisma;
        this.logger.debug("Reusing existing Prisma client from global");
        return;
      }

      this.prisma = new PrismaClient({
        log: this.getLogLevel(),
        errorFormat: "pretty",
        datasources: {
          db: {
            url: this.getDatabaseUrl(),
          },
        },
      });

      // Store in global for development
      if (process.env.NODE_ENV === "development") {
        (globalThis as any).__prisma = this.prisma;
      }

      this.logger.debug("Prisma client created successfully");
    } catch (error) {
      this.logger.error("Failed to create Prisma client", { error });
      throw error;
    }
  }

  /**
   * Connect to database with retry logic
   */
  public async connect(): Promise<void> {
    if (this.isConnectedFlag) {
      this.logger.debug("Already connected to database");
      return;
    }

    for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
      try {
        this.logger.info(
          `Connecting to database (attempt ${attempt}/${this.maxRetries})...`
        );

        if (!this.prisma) {
          this.createClient();
        }

        await this.prisma!.$connect();
        this.isConnectedFlag = true;
        this.connectionAttempts = 0;

        this.logger.info("Successfully connected to database");
        return;
      } catch (error) {
        this.connectionAttempts = attempt;
        this.logger.error(`Connection attempt ${attempt} failed`, { error });

        if (attempt === this.maxRetries) {
          this.logger.error("Max connection attempts reached, giving up");
          throw new Error(
            `Failed to connect to database after ${this.maxRetries} attempts`
          );
        }

        // Wait before retrying
        await this.delay(this.retryDelay * attempt);
      }
    }
  }

  /**
   * Disconnect from database
   */
  public async disconnect(): Promise<void> {
    if (!this.isConnectedFlag || !this.prisma) {
      this.logger.debug("Already disconnected from database");
      return;
    }

    try {
      this.logger.info("Disconnecting from database...");
      await this.prisma.$disconnect();
      this.isConnectedFlag = false;
      this.logger.info("Successfully disconnected from database");
    } catch (error) {
      this.logger.error("Error during database disconnection", { error });
      throw error;
    }
  }

  /**
   * Check if currently connected to database
   */
  public isConnected(): boolean {
    return this.isConnectedFlag;
  }

  /**
   * Get database URL (with sensitive info masked for logging)
   */
  public getDatabaseUrl(): string {
    const url =
      process.env.DATABASE_URL || "postgresql://localhost:5432/botking";
    return url;
  }

  /**
   * Get masked database URL for logging
   */
  public getMaskedDatabaseUrl(): string {
    const url = this.getDatabaseUrl();
    return url.replace(/:\/\/([^:]+):([^@]+)@/, "://***:***@");
  }

  /**
   * Reconnect to database
   */
  public async reconnect(): Promise<void> {
    this.logger.info("Reconnecting to database...");
    await this.disconnect();
    await this.connect();
  }

  /**
   * Get connection statistics
   */
  public getConnectionStats(): {
    isConnected: boolean;
    connectionAttempts: number;
    databaseUrl: string;
    environment: string;
  } {
    return {
      isConnected: this.isConnectedFlag,
      connectionAttempts: this.connectionAttempts,
      databaseUrl: this.getMaskedDatabaseUrl(),
      environment: process.env.NODE_ENV || "development",
    };
  }

  /**
   * Test database connection
   */
  public async testConnection(): Promise<boolean> {
    try {
      if (!this.prisma) {
        return false;
      }
      await this.prisma.$queryRaw`SELECT 1`;
      return true;
    } catch (error) {
      this.logger.error("Connection test failed", { error });
      return false;
    }
  }

  /**
   * Get appropriate log level based on environment
   */
  private getLogLevel(): Array<"query" | "info" | "warn" | "error"> {
    const env = process.env.NODE_ENV;

    if (env === "development") {
      return ["query", "info", "warn", "error"];
    } else if (env === "test") {
      return ["warn", "error"];
    } else {
      return ["error"];
    }
  }

  /**
   * Utility method for delays
   */
  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Cleanup resources and reset instance
   */
  public async cleanup(): Promise<void> {
    await this.disconnect();
    this.prisma = null;
    this.isConnectedFlag = false;
    this.connectionAttempts = 0;

    // Clear global reference in development
    if (process.env.NODE_ENV === "development") {
      delete (globalThis as any).__prisma;
    }
  }
}

// Export singleton instance for convenience
export const connectionManager = ConnectionManager.getInstance();
