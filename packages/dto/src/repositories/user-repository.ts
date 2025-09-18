/**
 * User Repository - Database-first approach
 * Repository for User entities with artifact integration
 */

import type {
  User as PrismaUser,
  CreateUserDTO,
  UpdateUserDTO,
  UserProfileUpdateDTO,
} from "@botking/db";
import type { IUser } from "@botking/artifact";
import { UserDTOFactory } from "../factories/user-dto-factory";
import { LoggerFactory } from "@botking/logger";

/**
 * User repository interface for database operations
 */
export interface IUserRepository {
  // Basic CRUD operations
  findById(id: string): Promise<IUser | null>;
  findByEmail(email: string): Promise<IUser | null>;
  findMany(options?: {
    where?: any;
    orderBy?: any;
    take?: number;
    skip?: number;
  }): Promise<IUser[]>;

  create(data: CreateUserDTO): Promise<IUser>;
  update(id: string, data: UpdateUserDTO): Promise<IUser | null>;
  updateProfile(id: string, data: UserProfileUpdateDTO): Promise<IUser | null>;
  delete(id: string): Promise<boolean>;

  // User-specific queries
  findVerifiedUsers(): Promise<IUser[]>;
  findByIds(ids: string[]): Promise<IUser[]>;
  count(where?: any): Promise<number>;

  // Email operations
  verifyEmail(id: string): Promise<IUser | null>;
  updateEmail(id: string, newEmail: string): Promise<IUser | null>;
}

/**
 * User repository implementation
 */
export class UserRepository implements IUserRepository {
  private static logger = LoggerFactory.createPackageLogger("dto", {
    service: "user-repository",
  });

  constructor(private prismaClient: any) {}

  /**
   * Find user by ID
   */
  async findById(id: string): Promise<IUser | null> {
    try {
      UserRepository.logger.debug("Finding user by ID", { userId: id });

      const prismaUser = await this.prismaClient.user.findUnique({
        where: { id },
      });

      if (!prismaUser) {
        UserRepository.logger.debug("User not found", { userId: id });
        return null;
      }

      return UserDTOFactory.fromPrismaUser(prismaUser);
    } catch (error) {
      UserRepository.logger.error("Failed to find user by ID", {
        error,
        userId: id,
      });
      throw error;
    }
  }

  /**
   * Find user by email
   */
  async findByEmail(email: string): Promise<IUser | null> {
    try {
      UserRepository.logger.debug("Finding user by email", { email });

      const prismaUser = await this.prismaClient.user.findUnique({
        where: { email },
      });

      if (!prismaUser) {
        UserRepository.logger.debug("User not found", { email });
        return null;
      }

      return UserDTOFactory.fromPrismaUser(prismaUser);
    } catch (error) {
      UserRepository.logger.error("Failed to find user by email", {
        error,
        email,
      });
      throw error;
    }
  }

  /**
   * Find multiple users with options
   */
  async findMany(
    options: {
      where?: any;
      orderBy?: any;
      take?: number;
      skip?: number;
    } = {}
  ): Promise<IUser[]> {
    try {
      UserRepository.logger.debug("Finding multiple users", { options });

      const prismaUsers = await this.prismaClient.user.findMany({
        where: options.where,
        orderBy: options.orderBy || { createdAt: "desc" },
        take: options.take,
        skip: options.skip,
      });

      return UserDTOFactory.fromPrismaUsers(prismaUsers);
    } catch (error) {
      UserRepository.logger.error("Failed to find multiple users", {
        error,
        options,
      });
      throw error;
    }
  }

  /**
   * Create new user
   */
  async create(data: CreateUserDTO): Promise<IUser> {
    try {
      UserRepository.logger.debug("Creating user", { email: data.email });

      const prismaUser = await this.prismaClient.user.create({
        data: {
          email: data.email,
          emailVerified: data.emailVerified ?? false,
          name: data.name,
          image: data.image,
          // preferences and settings would be stored as JSON if added to schema
        },
      });

      UserRepository.logger.info("User created successfully", {
        userId: prismaUser.id,
        email: prismaUser.email,
      });

      return UserDTOFactory.fromPrismaUser(prismaUser);
    } catch (error) {
      UserRepository.logger.error("Failed to create user", {
        error,
        email: data.email,
      });
      throw error;
    }
  }

  /**
   * Update user
   */
  async update(id: string, data: UpdateUserDTO): Promise<IUser | null> {
    try {
      UserRepository.logger.debug("Updating user", { userId: id });

      const prismaUser = await this.prismaClient.user.update({
        where: { id },
        data: {
          emailVerified: data.emailVerified,
          name: data.name,
          image: data.image,
          updatedAt: new Date(),
          // preferences and settings would be updated as JSON if added to schema
        },
      });

      UserRepository.logger.info("User updated successfully", {
        userId: id,
        changes: Object.keys(data),
      });

      return UserDTOFactory.fromPrismaUser(prismaUser);
    } catch (error) {
      UserRepository.logger.error("Failed to update user", {
        error,
        userId: id,
      });

      if ((error as any).code === "P2025") {
        // Prisma record not found
        return null;
      }

      throw error;
    }
  }

  /**
   * Update user profile
   */
  async updateProfile(
    id: string,
    data: UserProfileUpdateDTO
  ): Promise<IUser | null> {
    try {
      UserRepository.logger.debug("Updating user profile", { userId: id });

      const prismaUser = await this.prismaClient.user.update({
        where: { id },
        data: {
          name: data.name,
          image: data.image,
          updatedAt: new Date(),
        },
      });

      UserRepository.logger.info("User profile updated successfully", {
        userId: id,
        changes: Object.keys(data),
      });

      return UserDTOFactory.fromPrismaUser(prismaUser);
    } catch (error) {
      UserRepository.logger.error("Failed to update user profile", {
        error,
        userId: id,
      });

      if ((error as any).code === "P2025") {
        return null;
      }

      throw error;
    }
  }

  /**
   * Delete user
   */
  async delete(id: string): Promise<boolean> {
    try {
      UserRepository.logger.debug("Deleting user", { userId: id });

      await this.prismaClient.user.delete({
        where: { id },
      });

      UserRepository.logger.info("User deleted successfully", { userId: id });
      return true;
    } catch (error) {
      UserRepository.logger.error("Failed to delete user", {
        error,
        userId: id,
      });

      if ((error as any).code === "P2025") {
        // Record not found
        return false;
      }

      throw error;
    }
  }

  /**
   * Find verified users
   */
  async findVerifiedUsers(): Promise<IUser[]> {
    return this.findMany({
      where: { emailVerified: true },
      orderBy: { createdAt: "desc" },
    });
  }

  /**
   * Find users by multiple IDs
   */
  async findByIds(ids: string[]): Promise<IUser[]> {
    try {
      UserRepository.logger.debug("Finding users by IDs", {
        count: ids.length,
      });

      const prismaUsers = await this.prismaClient.user.findMany({
        where: { id: { in: ids } },
        orderBy: { createdAt: "desc" },
      });

      return UserDTOFactory.fromPrismaUsers(prismaUsers);
    } catch (error) {
      UserRepository.logger.error("Failed to find users by IDs", {
        error,
        idsCount: ids.length,
      });
      throw error;
    }
  }

  /**
   * Count users with optional filter
   */
  async count(where?: any): Promise<number> {
    try {
      UserRepository.logger.debug("Counting users", { where });

      return await this.prismaClient.user.count({ where });
    } catch (error) {
      UserRepository.logger.error("Failed to count users", { error, where });
      throw error;
    }
  }

  /**
   * Verify user email
   */
  async verifyEmail(id: string): Promise<IUser | null> {
    return this.update(id, { emailVerified: true });
  }

  /**
   * Update user email and reset verification
   */
  async updateEmail(id: string, newEmail: string): Promise<IUser | null> {
    try {
      UserRepository.logger.debug("Updating user email", { userId: id });

      const prismaUser = await this.prismaClient.user.update({
        where: { id },
        data: {
          email: newEmail,
          emailVerified: false, // Reset verification when email changes
          updatedAt: new Date(),
        },
      });

      UserRepository.logger.info("User email updated successfully", {
        userId: id,
        newEmail,
      });

      return UserDTOFactory.fromPrismaUser(prismaUser);
    } catch (error) {
      UserRepository.logger.error("Failed to update user email", {
        error,
        userId: id,
      });

      if ((error as any).code === "P2025") {
        return null;
      }

      throw error;
    }
  }
}
