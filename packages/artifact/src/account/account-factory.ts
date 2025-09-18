/**
 * Account factory for creating Account artifacts based on schema.prisma Account model
 */

import type { Account as PrismaAccount } from "@botking/db";
import { Account } from "./account";
import type {
  AccountConfiguration,
  AccountCreationResult,
} from "./account-interface";
import { LoggerFactory } from "@botking/logger";

/**
 * Factory for creating Account artifacts
 */
export class AccountFactory {
  private static logger = LoggerFactory.createPackageLogger("artifact", {
    service: "account-factory",
  });

  /**
   * Create an Account artifact from configuration
   */
  static createAccount(config: AccountConfiguration): AccountCreationResult {
    try {
      this.logger.debug("Creating account artifact", {
        userId: config.userId,
        providerId: config.providerId,
        accountId: config.accountId,
      });

      // Validate required fields
      const errors: string[] = [];
      if (!config.userId || config.userId.trim().length === 0) {
        errors.push("User ID is required");
      }
      if (!config.providerId || config.providerId.trim().length === 0) {
        errors.push("Provider ID is required");
      }
      if (!config.accountId || config.accountId.trim().length === 0) {
        errors.push("Account ID is required");
      }

      if (errors.length > 0) {
        this.logger.warn("Account creation failed due to validation errors", {
          errors,
        });

        return {
          success: false,
          errors,
          warnings: [],
        };
      }

      // Create Prisma Account-like object
      const prismaAccount: PrismaAccount = {
        id:
          config.id ||
          `account_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        userId: config.userId,
        providerId: config.providerId,
        accountId: config.accountId,
        password: config.password ?? null,
        accessToken: config.accessToken ?? null,
        refreshToken: config.refreshToken ?? null,
        idToken: config.idToken ?? null,
        accessTokenExpiresAt: config.accessTokenExpiresAt ?? null,
        refreshTokenExpiresAt: config.refreshTokenExpiresAt ?? null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const account = new Account(prismaAccount);

      return {
        success: true,
        account,
        errors: [],
        warnings: [],
      };
    } catch (error) {
      this.logger.error("Failed to create account artifact", { error });

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
   * Create an Account artifact from Prisma Account data
   */
  static fromPrismaAccount(
    prismaAccount: PrismaAccount
  ): AccountCreationResult {
    try {
      const account = Account.fromPrismaAccount(prismaAccount);

      return {
        success: true,
        account,
        errors: [],
        warnings: [],
      };
    } catch (error) {
      this.logger.error("Failed to create account artifact from Prisma data", {
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
   * Create an OAuth account
   */
  static createOAuthAccount(
    userId: string,
    providerId: string,
    accountId: string,
    tokens?: {
      accessToken?: string;
      refreshToken?: string;
      idToken?: string;
      accessTokenExpiresAt?: Date;
      refreshTokenExpiresAt?: Date;
    }
  ): AccountCreationResult {
    return this.createAccount({
      userId,
      providerId,
      accountId,
      accessToken: tokens?.accessToken,
      refreshToken: tokens?.refreshToken,
      idToken: tokens?.idToken,
      accessTokenExpiresAt: tokens?.accessTokenExpiresAt,
      refreshTokenExpiresAt: tokens?.refreshTokenExpiresAt,
    });
  }

  /**
   * Create a password-based account
   */
  static createPasswordAccount(
    userId: string,
    providerId: string,
    accountId: string,
    password: string
  ): AccountCreationResult {
    return this.createAccount({
      userId,
      providerId,
      accountId,
      password,
    });
  }

  /**
   * Batch create accounts
   */
  static createMultipleAccounts(configurations: AccountConfiguration[]): {
    successful: Account[];
    failed: Array<{ config: AccountConfiguration; errors: string[] }>;
  } {
    const successful: Account[] = [];
    const failed: Array<{ config: AccountConfiguration; errors: string[] }> =
      [];

    for (const config of configurations) {
      const result = this.createAccount(config);

      if (result.success && result.account) {
        successful.push(result.account);
      } else {
        failed.push({ config, errors: result.errors });
      }
    }

    return { successful, failed };
  }

  /**
   * Create account from JSON data
   */
  static fromJSON(
    jsonData: string | Record<string, any>
  ): AccountCreationResult {
    try {
      const data =
        typeof jsonData === "string" ? JSON.parse(jsonData) : jsonData;

      return this.createAccount({
        id: data.id,
        userId: data.userId,
        providerId: data.providerId,
        accountId: data.accountId,
        password: data.password,
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        idToken: data.idToken,
        accessTokenExpiresAt: data.accessTokenExpiresAt
          ? new Date(data.accessTokenExpiresAt)
          : undefined,
        refreshTokenExpiresAt: data.refreshTokenExpiresAt
          ? new Date(data.refreshTokenExpiresAt)
          : undefined,
      });
    } catch (error) {
      this.logger.error("Failed to create account from JSON", { error });

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
