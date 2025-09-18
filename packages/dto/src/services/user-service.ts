/**
 * User Service - High-level service for User operations
 * Combines repository and artifact functionality
 */

import type {
  CreateUserDTO,
  UpdateUserDTO,
  UserProfileUpdateDTO,
} from "@botking/db";
import type { IUser } from "@botking/artifact";
import { UserValidator } from "@botking/artifact";
import { UserRepository } from "../repositories/user-repository";
import { UserDTOFactory } from "../factories/user-dto-factory";
import { LoggerFactory } from "@botking/logger";

/**
 * User service for high-level user operations
 */
export class UserService {
  private static logger = LoggerFactory.createPackageLogger("dto", {
    service: "user-service",
  });

  constructor(private userRepository: UserRepository) {}

  /**
   * Create a new user with validation
   */
  async createUser(data: CreateUserDTO): Promise<{
    success: boolean;
    user?: IUser;
    errors: string[];
    warnings: string[];
  }> {
    try {
      UserService.logger.debug("Creating user via service", {
        email: data.email,
      });

      // Create the user
      const user = await this.userRepository.create(data);

      // Validate the created user
      const validation = UserValidator.validate(user);

      UserService.logger.info("User created and validated", {
        userId: user.id,
        email: user.email,
        isValid: validation.isValid,
        validationLevel: validation.summary.validationLevel,
      });

      return {
        success: true,
        user,
        errors: validation.errors.map((e) => e.message),
        warnings: validation.warnings.map((w) => w.message),
      };
    } catch (error) {
      UserService.logger.error("Failed to create user via service", {
        error,
        email: data.email,
      });

      return {
        success: false,
        errors: [error instanceof Error ? error.message : "Unknown error"],
        warnings: [],
      };
    }
  }

  /**
   * Get user by ID with validation
   */
  async getUserById(id: string): Promise<{
    success: boolean;
    user?: IUser;
    validation?: any;
    errors: string[];
  }> {
    try {
      UserService.logger.debug("Getting user by ID via service", {
        userId: id,
      });

      const user = await this.userRepository.findById(id);

      if (!user) {
        return {
          success: false,
          errors: ["User not found"],
        };
      }

      // Validate the user
      const validation = UserValidator.validate(user);

      UserService.logger.debug("User retrieved and validated", {
        userId: id,
        isValid: validation.isValid,
        validationLevel: validation.summary.validationLevel,
      });

      return {
        success: true,
        user,
        validation,
        errors: [],
      };
    } catch (error) {
      UserService.logger.error("Failed to get user by ID via service", {
        error,
        userId: id,
      });

      return {
        success: false,
        errors: [error instanceof Error ? error.message : "Unknown error"],
      };
    }
  }

  /**
   * Update user profile with validation
   */
  async updateUserProfile(
    id: string,
    data: UserProfileUpdateDTO
  ): Promise<{
    success: boolean;
    user?: IUser;
    errors: string[];
    warnings: string[];
  }> {
    try {
      UserService.logger.debug("Updating user profile via service", {
        userId: id,
      });

      const user = await this.userRepository.updateProfile(id, data);

      if (!user) {
        return {
          success: false,
          errors: ["User not found"],
          warnings: [],
        };
      }

      // Validate the updated user
      const validation = UserValidator.validate(user);

      UserService.logger.info("User profile updated and validated", {
        userId: id,
        changes: Object.keys(data),
        isValid: validation.isValid,
        validationLevel: validation.summary.validationLevel,
      });

      return {
        success: true,
        user,
        errors: validation.errors.map((e) => e.message),
        warnings: validation.warnings.map((w) => w.message),
      };
    } catch (error) {
      UserService.logger.error("Failed to update user profile via service", {
        error,
        userId: id,
      });

      return {
        success: false,
        errors: [error instanceof Error ? error.message : "Unknown error"],
        warnings: [],
      };
    }
  }

  /**
   * Verify user email
   */
  async verifyUserEmail(id: string): Promise<{
    success: boolean;
    user?: IUser;
    errors: string[];
  }> {
    try {
      UserService.logger.debug("Verifying user email via service", {
        userId: id,
      });

      const user = await this.userRepository.verifyEmail(id);

      if (!user) {
        return {
          success: false,
          errors: ["User not found"],
        };
      }

      UserService.logger.info("User email verified", { userId: id });

      return {
        success: true,
        user,
        errors: [],
      };
    } catch (error) {
      UserService.logger.error("Failed to verify user email via service", {
        error,
        userId: id,
      });

      return {
        success: false,
        errors: [error instanceof Error ? error.message : "Unknown error"],
      };
    }
  }

  /**
   * Get user statistics and insights
   */
  async getUserInsights(id: string): Promise<{
    success: boolean;
    insights?: {
      user: IUser;
      validation: any;
      statistics: any;
      recommendations: string[];
    };
    errors: string[];
  }> {
    try {
      UserService.logger.debug("Getting user insights via service", {
        userId: id,
      });

      const user = await this.userRepository.findById(id);

      if (!user) {
        return {
          success: false,
          errors: ["User not found"],
        };
      }

      // Get validation and statistics
      const validation = UserValidator.validate(user);
      const statistics = user.toJSON(); // Basic stats from artifact

      const insights = {
        user,
        validation,
        statistics,
        recommendations: validation.summary.recommendations,
      };

      UserService.logger.debug("User insights generated", {
        userId: id,
        validationLevel: validation.summary.validationLevel,
        completeness: validation.summary.completeness,
        recommendationCount: validation.summary.recommendations.length,
      });

      return {
        success: true,
        insights,
        errors: [],
      };
    } catch (error) {
      UserService.logger.error("Failed to get user insights via service", {
        error,
        userId: id,
      });

      return {
        success: false,
        errors: [error instanceof Error ? error.message : "Unknown error"],
      };
    }
  }

  /**
   * Search users with pagination
   */
  async searchUsers(options: {
    query?: string;
    emailVerified?: boolean;
    orderBy?: any;
    page?: number;
    limit?: number;
  }): Promise<{
    success: boolean;
    users?: IUser[];
    pagination?: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
    errors: string[];
  }> {
    try {
      const page = options.page || 1;
      const limit = Math.min(options.limit || 20, 100); // Max 100 per page
      const skip = (page - 1) * limit;

      UserService.logger.debug("Searching users via service", {
        query: options.query,
        emailVerified: options.emailVerified,
        page,
        limit,
      });

      // Build where clause
      const where: any = {};

      if (options.emailVerified !== undefined) {
        where.emailVerified = options.emailVerified;
      }

      if (options.query) {
        where.OR = [
          { email: { contains: options.query, mode: "insensitive" } },
          { name: { contains: options.query, mode: "insensitive" } },
        ];
      }

      // Get users and total count
      const [users, total] = await Promise.all([
        this.userRepository.findMany({
          where,
          orderBy: options.orderBy || { createdAt: "desc" },
          take: limit,
          skip,
        }),
        this.userRepository.count(where),
      ]);

      const totalPages = Math.ceil(total / limit);

      UserService.logger.debug("Users search completed", {
        found: users.length,
        total,
        page,
        totalPages,
      });

      return {
        success: true,
        users,
        pagination: {
          page,
          limit,
          total,
          totalPages,
        },
        errors: [],
      };
    } catch (error) {
      UserService.logger.error("Failed to search users via service", {
        error,
        options,
      });

      return {
        success: false,
        errors: [error instanceof Error ? error.message : "Unknown error"],
      };
    }
  }

  /**
   * Delete user with safety checks
   */
  async deleteUser(id: string): Promise<{
    success: boolean;
    errors: string[];
  }> {
    try {
      UserService.logger.debug("Deleting user via service", { userId: id });

      // Check if user exists first
      const user = await this.userRepository.findById(id);
      if (!user) {
        return {
          success: false,
          errors: ["User not found"],
        };
      }

      // TODO: Add safety checks like:
      // - Check for existing bots/accounts
      // - Archive user data
      // - Send notifications

      const deleted = await this.userRepository.delete(id);

      if (!deleted) {
        return {
          success: false,
          errors: ["Failed to delete user"],
        };
      }

      UserService.logger.info("User deleted successfully", { userId: id });

      return {
        success: true,
        errors: [],
      };
    } catch (error) {
      UserService.logger.error("Failed to delete user via service", {
        error,
        userId: id,
      });

      return {
        success: false,
        errors: [error instanceof Error ? error.message : "Unknown error"],
      };
    }
  }
}
