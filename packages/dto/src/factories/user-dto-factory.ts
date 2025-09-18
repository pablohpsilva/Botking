/**
 * User DTO Factory - Database-first approach
 * Creates DTOs for User artifacts based on schema.prisma User model
 */

import type { User as PrismaUser } from "@botking/db";
import { User, UserFactory, type IUser } from "@botking/artifact";
import { LoggerFactory } from "@botking/logger";

/**
 * User DTO factory for converting between database records and artifacts
 */
export class UserDTOFactory {
  private static logger = LoggerFactory.createPackageLogger("dto", {
    service: "user-dto-factory",
  });

  /**
   * Create User artifact from Prisma User record
   */
  static fromPrismaUser(prismaUser: PrismaUser): IUser {
    try {
      this.logger.debug("Converting Prisma User to artifact", {
        userId: prismaUser.id,
        email: prismaUser.email,
      });

      return new User(prismaUser);
    } catch (error) {
      this.logger.error("Failed to convert Prisma User to artifact", {
        error,
        userId: prismaUser.id,
      });
      throw error;
    }
  }

  /**
   * Convert User artifact to Prisma User format
   */
  static toPrismaUser(userArtifact: IUser): PrismaUser {
    try {
      this.logger.debug("Converting User artifact to Prisma format", {
        userId: userArtifact.id,
        email: userArtifact.email,
      });

      return {
        id: userArtifact.id,
        email: userArtifact.email,
        emailVerified: userArtifact.emailVerified,
        name: userArtifact.name,
        image: userArtifact.image,
        createdAt: userArtifact.createdAt,
        updatedAt: userArtifact.updatedAt,
      };
    } catch (error) {
      this.logger.error("Failed to convert User artifact to Prisma format", {
        error,
        userId: userArtifact.id,
      });
      throw error;
    }
  }

  /**
   * Batch convert Prisma Users to artifacts
   */
  static fromPrismaUsers(prismaUsers: PrismaUser[]): IUser[] {
    this.logger.debug("Batch converting Prisma Users to artifacts", {
      count: prismaUsers.length,
    });

    return prismaUsers.map((prismaUser) => this.fromPrismaUser(prismaUser));
  }

  /**
   * Batch convert User artifacts to Prisma format
   */
  static toPrismaUsers(userArtifacts: IUser[]): PrismaUser[] {
    this.logger.debug("Batch converting User artifacts to Prisma format", {
      count: userArtifacts.length,
    });

    return userArtifacts.map((userArtifact) => this.toPrismaUser(userArtifact));
  }

  /**
   * Create User artifact from partial Prisma data (for creation scenarios)
   */
  static fromPartialPrismaUser(
    partialData: Partial<PrismaUser> & Pick<PrismaUser, "email">
  ): IUser {
    try {
      this.logger.debug("Creating User artifact from partial data", {
        email: partialData.email,
        hasId: !!partialData.id,
      });

      // Use UserFactory to create with proper defaults
      const result = UserFactory.createUser({
        id: partialData.id,
        email: partialData.email,
        emailVerified: partialData.emailVerified ?? false,
        name: partialData.name ?? null,
        image: partialData.image ?? null,
      });

      if (!result.success || !result.user) {
        throw new Error(`Failed to create user: ${result.errors.join(", ")}`);
      }

      return result.user;
    } catch (error) {
      this.logger.error("Failed to create User artifact from partial data", {
        error,
        email: partialData.email,
      });
      throw error;
    }
  }

  /**
   * Create demo User artifact for testing
   */
  static createDemoUser(identifier?: string): IUser {
    this.logger.debug("Creating demo User artifact", { identifier });

    const result = UserFactory.createDemoUser(identifier);

    if (!result.success || !result.user) {
      throw new Error(
        `Failed to create demo user: ${result.errors.join(", ")}`
      );
    }

    return result.user;
  }

  /**
   * Validate and normalize user data before conversion
   */
  private static validatePrismaUser(prismaUser: PrismaUser): void {
    if (!prismaUser.id) {
      throw new Error("User ID is required");
    }
    if (!prismaUser.email) {
      throw new Error("User email is required");
    }
    if (typeof prismaUser.emailVerified !== "boolean") {
      throw new Error("User emailVerified must be a boolean");
    }
  }

  /**
   * Safe conversion with validation
   */
  static safeFromPrismaUser(prismaUser: PrismaUser): {
    success: boolean;
    user?: IUser;
    error?: string;
  } {
    try {
      this.validatePrismaUser(prismaUser);
      const user = this.fromPrismaUser(prismaUser);
      return { success: true, user };
    } catch (error) {
      this.logger.warn("Safe conversion failed", {
        error,
        userId: prismaUser.id,
        email: prismaUser.email,
      });
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }
}
