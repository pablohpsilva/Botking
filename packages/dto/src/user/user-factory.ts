/**
 * User factory for creating User artifacts based on schema.prisma User model
 */

import type { User as PrismaUser } from "@botking/db";
import { User } from "./user";
import type { UserConfiguration, UserCreationResult } from "./user-interface";
import { LoggerFactory } from "@botking/logger";

/**
 * Factory for creating User artifacts
 */
export class UserFactory {
  private static logger = LoggerFactory.createPackageLogger("artifact", {
    service: "user-factory",
  });

  /**
   * Create a User artifact from configuration
   */
  static createUser(config: UserConfiguration): UserCreationResult {
    try {
      this.logger.debug("Creating user artifact", { email: config.email });

      // Validate required fields
      const errors: string[] = [];
      if (!config.email || config.email.trim().length === 0) {
        errors.push("Email is required");
      }

      if (errors.length > 0) {
        this.logger.warn("User creation failed due to validation errors", {
          errors,
        });

        return {
          success: false,
          errors,
          warnings: [],
        };
      }

      // Create Prisma User-like object
      const prismaUser: PrismaUser = {
        id:
          config.id ||
          `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        email: config.email,
        emailVerified: config.emailVerified ?? false,
        name: config.name ?? null,
        image: config.image ?? null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const user = new User(prismaUser);

      return {
        success: true,
        user,
        errors: [],
        warnings: [],
      };
    } catch (error) {
      this.logger.error("Failed to create user artifact", { error });

      return {
        success: false,
        errors: [
          error instanceof Error ? error.message : "Unknown error occurred",
        ],
        warnings: [],
      };
    }
  }

  /**
   * Create a User artifact from Prisma User data
   */
  static fromPrismaUser(prismaUser: PrismaUser): UserCreationResult {
    try {
      const user = User.fromPrismaUser(prismaUser);

      return {
        success: true,
        user,
        errors: [],
        warnings: [],
      };
    } catch (error) {
      this.logger.error("Failed to create user artifact from Prisma data", {
        error,
      });

      return {
        success: false,
        errors: [
          error instanceof Error ? error.message : "Unknown error occurred",
        ],
        warnings: [],
      };
    }
  }

  /**
   * Create a demo user for testing
   */
  static createDemoUser(identifier?: string): UserCreationResult {
    const demoId = identifier || `demo_${Date.now()}`;
    const email = `demo_${demoId}@demo.botking.dev`;

    return this.createUser({
      email,
      name: `Demo User ${demoId}`,
      emailVerified: false,
    });
  }

  /**
   * Create an admin user
   */
  static createAdminUser(email: string, name?: string): UserCreationResult {
    return this.createUser({
      email,
      name: name || "Admin User",
      emailVerified: true,
    });
  }

  /**
   * Batch create users
   */
  static createMultipleUsers(configurations: UserConfiguration[]): {
    successful: User[];
    failed: Array<{ config: UserConfiguration; errors: string[] }>;
  } {
    const successful: User[] = [];
    const failed: Array<{ config: UserConfiguration; errors: string[] }> = [];

    for (const config of configurations) {
      const result = this.createUser(config);

      if (result.success && result.user) {
        successful.push(result.user);
      } else {
        failed.push({ config, errors: result.errors });
      }
    }

    return { successful, failed };
  }

  /**
   * Create user from JSON data
   */
  static fromJSON(jsonData: string | Record<string, any>): UserCreationResult {
    try {
      const data =
        typeof jsonData === "string" ? JSON.parse(jsonData) : jsonData;

      return this.createUser({
        id: data.id,
        email: data.email,
        emailVerified: data.emailVerified,
        name: data.name,
        image: data.image,
      });
    } catch (error) {
      this.logger.error("Failed to create user from JSON", { error });

      return {
        success: false,
        errors: [
          `Failed to parse JSON data: ${error instanceof Error ? error.message : "Unknown error"}`,
        ],
        warnings: [],
      };
    }
  }
}
