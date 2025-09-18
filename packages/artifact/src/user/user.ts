/**
 * User artifact implementation based on schema.prisma User model
 */

import type { User as PrismaUser } from "@botking/db";
import type { IUser, UserProfileUpdate } from "./user-interface";
import { LoggerFactory } from "@botking/logger";

/**
 * User artifact implementation - directly based on database schema
 */
export class User implements IUser {
  private static logger = LoggerFactory.createPackageLogger("artifact", {
    service: "user",
  });

  // Prisma User properties (copied from database)
  readonly id: string;
  readonly email: string;
  readonly emailVerified: boolean;
  readonly name: string | null;
  readonly image: string | null;
  readonly createdAt: Date;
  readonly updatedAt: Date;

  constructor(prismaUser: PrismaUser) {
    this.id = prismaUser.id;
    this.email = prismaUser.email;
    this.emailVerified = prismaUser.emailVerified;
    this.name = prismaUser.name;
    this.image = prismaUser.image;
    this.createdAt = prismaUser.createdAt;
    this.updatedAt = prismaUser.updatedAt;

    User.logger.debug("User artifact created from database data", {
      id: this.id,
      email: this.email,
      name: this.name,
    });
  }

  // Profile management
  async updateProfile(updates: UserProfileUpdate): Promise<boolean> {
    try {
      // In real implementation, this would update the database via repository
      User.logger.info("User profile update requested", {
        userId: this.id,
        changes: Object.keys(updates),
      });

      return true;
    } catch (error) {
      User.logger.error("Failed to update user profile", {
        userId: this.id,
        error,
      });
      return false;
    }
  }

  async updateEmail(newEmail: string): Promise<boolean> {
    try {
      // In real implementation, this would update the database and reset emailVerified
      User.logger.info("User email update requested", {
        userId: this.id,
        oldEmail: this.email,
        newEmail,
      });

      return true;
    } catch (error) {
      User.logger.error("Failed to update user email", {
        userId: this.id,
        error,
      });
      return false;
    }
  }

  async verifyEmail(): Promise<boolean> {
    try {
      // In real implementation, this would update emailVerified = true in database
      User.logger.info("User email verification requested", {
        userId: this.id,
        email: this.email,
      });

      return true;
    } catch (error) {
      User.logger.error("Failed to verify user email", {
        userId: this.id,
        error,
      });
      return false;
    }
  }

  // Serialization
  toJSON(): Record<string, any> {
    return {
      id: this.id,
      email: this.email,
      emailVerified: this.emailVerified,
      name: this.name,
      image: this.image,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
    };
  }

  serialize(): string {
    return JSON.stringify(this.toJSON());
  }

  clone(): IUser {
    const prismaUserData: PrismaUser = {
      id: this.id,
      email: this.email,
      emailVerified: this.emailVerified,
      name: this.name,
      image: this.image,
      createdAt: new Date(this.createdAt),
      updatedAt: new Date(this.updatedAt),
    };

    return new User(prismaUserData);
  }

  // Static factory method for creating from Prisma User
  static fromPrismaUser(prismaUser: PrismaUser): User {
    return new User(prismaUser);
  }
}
