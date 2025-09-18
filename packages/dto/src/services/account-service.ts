/**
 * Account Service - High-level service for Account operations
 * Combines repository and artifact functionality
 */

import type { CreateAccountDTO, UpdateAccountDTO } from "@botking/db";
import type { IAccount, TokenUpdate } from "@botking/artifact";
import { AccountValidator } from "@botking/artifact";
import { AccountRepository } from "../repositories/account-repository";
import { AccountDTOFactory } from "../factories/account-dto-factory";
import { LoggerFactory } from "@botking/logger";

/**
 * Account service for high-level account operations
 */
export class AccountService {
  private static logger = LoggerFactory.createPackageLogger("dto", {
    service: "account-service",
  });

  constructor(private accountRepository: AccountRepository) {}

  /**
   * Create a new account with validation
   */
  async createAccount(data: CreateAccountDTO): Promise<{
    success: boolean;
    account?: IAccount;
    errors: string[];
    warnings: string[];
  }> {
    try {
      AccountService.logger.debug(
        "Creating account via service",
        AccountDTOFactory.getSafeLogData(data as any)
      );

      // Create the account
      const account = await this.accountRepository.create(data);

      // Validate the created account
      const validation = AccountValidator.validate(account);

      AccountService.logger.info("Account created and validated", {
        ...AccountDTOFactory.getSafeLogData(account),
        isValid: validation.isValid,
        validationLevel: validation.summary.validationLevel,
      });

      return {
        success: true,
        account,
        errors: validation.errors.map((e) => e.message),
        warnings: validation.warnings.map((w) => w.message),
      };
    } catch (error) {
      AccountService.logger.error("Failed to create account via service", {
        error,
        userId: data.userId,
        providerId: data.providerId,
      });

      return {
        success: false,
        errors: [error instanceof Error ? error.message : "Unknown error"],
        warnings: [],
      };
    }
  }

  /**
   * Get account by ID with validation
   */
  async getAccountById(id: string): Promise<{
    success: boolean;
    account?: IAccount;
    validation?: any;
    errors: string[];
  }> {
    try {
      AccountService.logger.debug("Getting account by ID via service", {
        accountId: id,
      });

      const account = await this.accountRepository.findById(id);

      if (!account) {
        return {
          success: false,
          errors: ["Account not found"],
        };
      }

      // Validate the account
      const validation = AccountValidator.validate(account);

      AccountService.logger.debug("Account retrieved and validated", {
        accountId: id,
        isValid: validation.isValid,
        validationLevel: validation.summary.validationLevel,
      });

      return {
        success: true,
        account,
        validation,
        errors: [],
      };
    } catch (error) {
      AccountService.logger.error("Failed to get account by ID via service", {
        error,
        accountId: id,
      });

      return {
        success: false,
        errors: [error instanceof Error ? error.message : "Unknown error"],
      };
    }
  }

  /**
   * Get user's accounts
   */
  async getUserAccounts(userId: string): Promise<{
    success: boolean;
    accounts?: IAccount[];
    summary?: {
      total: number;
      byProvider: Record<string, number>;
      expired: number;
      needsRefresh: number;
    };
    errors: string[];
  }> {
    try {
      AccountService.logger.debug("Getting user accounts via service", {
        userId,
      });

      const accounts = await this.accountRepository.findByUserId(userId);

      // Generate summary
      const summary = {
        total: accounts.length,
        byProvider: accounts.reduce(
          (acc, account) => {
            acc[account.providerId] = (acc[account.providerId] || 0) + 1;
            return acc;
          },
          {} as Record<string, number>
        ),
        expired: accounts.filter((a) => a.isTokenExpired("access")).length,
        needsRefresh: accounts.filter((a) => {
          if (!a.accessTokenExpiresAt) return false;
          const hoursToExpiry =
            (a.accessTokenExpiresAt.getTime() - Date.now()) / (1000 * 60 * 60);
          return hoursToExpiry < 1 && hoursToExpiry > 0;
        }).length,
      };

      AccountService.logger.debug("User accounts retrieved", {
        userId,
        summary,
      });

      return {
        success: true,
        accounts,
        summary,
        errors: [],
      };
    } catch (error) {
      AccountService.logger.error("Failed to get user accounts via service", {
        error,
        userId,
      });

      return {
        success: false,
        errors: [error instanceof Error ? error.message : "Unknown error"],
      };
    }
  }

  /**
   * Update account tokens with validation
   */
  async updateAccountTokens(
    id: string,
    tokens: TokenUpdate
  ): Promise<{
    success: boolean;
    account?: IAccount;
    errors: string[];
    warnings: string[];
  }> {
    try {
      AccountService.logger.debug("Updating account tokens via service", {
        accountId: id,
      });

      const account = await this.accountRepository.updateTokens(id, tokens);

      if (!account) {
        return {
          success: false,
          errors: ["Account not found"],
          warnings: [],
        };
      }

      // Validate the updated account
      const validation = AccountValidator.validate(account);

      AccountService.logger.info("Account tokens updated and validated", {
        ...AccountDTOFactory.getSafeLogData(account),
        isValid: validation.isValid,
        validationLevel: validation.summary.validationLevel,
      });

      return {
        success: true,
        account,
        errors: validation.errors.map((e) => e.message),
        warnings: validation.warnings.map((w) => w.message),
      };
    } catch (error) {
      AccountService.logger.error(
        "Failed to update account tokens via service",
        {
          error,
          accountId: id,
        }
      );

      return {
        success: false,
        errors: [error instanceof Error ? error.message : "Unknown error"],
        warnings: [],
      };
    }
  }

  /**
   * Create OAuth account
   */
  async createOAuthAccount(
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
  ): Promise<{
    success: boolean;
    account?: IAccount;
    errors: string[];
    warnings: string[];
  }> {
    try {
      AccountService.logger.debug("Creating OAuth account via service", {
        userId,
        providerId,
        accountId,
      });

      // Check if account already exists
      const existing = await this.accountRepository.findByProviderAccount(
        providerId,
        accountId
      );
      if (existing) {
        return {
          success: false,
          errors: ["Account already exists for this provider"],
          warnings: [],
        };
      }

      const createData: CreateAccountDTO = {
        userId,
        providerId,
        accountId,
        accessToken: tokens?.accessToken,
        refreshToken: tokens?.refreshToken,
        idToken: tokens?.idToken,
        accessTokenExpiresAt: tokens?.accessTokenExpiresAt,
        refreshTokenExpiresAt: tokens?.refreshTokenExpiresAt,
      };

      return await this.createAccount(createData);
    } catch (error) {
      AccountService.logger.error(
        "Failed to create OAuth account via service",
        {
          error,
          userId,
          providerId,
          accountId,
        }
      );

      return {
        success: false,
        errors: [error instanceof Error ? error.message : "Unknown error"],
        warnings: [],
      };
    }
  }

  /**
   * Create credential account
   */
  async createCredentialAccount(
    userId: string,
    accountId: string,
    password: string
  ): Promise<{
    success: boolean;
    account?: IAccount;
    errors: string[];
    warnings: string[];
  }> {
    try {
      AccountService.logger.debug("Creating credential account via service", {
        userId,
        accountId,
      });

      // Check if credential account already exists for user
      const existing = await this.accountRepository.findByProvider(
        userId,
        "credentials"
      );
      if (existing.length > 0) {
        return {
          success: false,
          errors: ["User already has a credential account"],
          warnings: [],
        };
      }

      const createData: CreateAccountDTO = {
        userId,
        providerId: "credentials",
        accountId,
        password,
      };

      return await this.createAccount(createData);
    } catch (error) {
      AccountService.logger.error(
        "Failed to create credential account via service",
        {
          error,
          userId,
          accountId,
        }
      );

      return {
        success: false,
        errors: [error instanceof Error ? error.message : "Unknown error"],
        warnings: [],
      };
    }
  }

  /**
   * Find accounts with expired tokens for cleanup
   */
  async findExpiredTokenAccounts(tokenType: "access" | "refresh"): Promise<{
    success: boolean;
    accounts?: IAccount[];
    summary?: {
      total: number;
      byProvider: Record<string, number>;
    };
    errors: string[];
  }> {
    try {
      AccountService.logger.debug(
        "Finding expired token accounts via service",
        { tokenType }
      );

      const accounts =
        await this.accountRepository.findExpiredTokens(tokenType);

      const summary = {
        total: accounts.length,
        byProvider: accounts.reduce(
          (acc, account) => {
            acc[account.providerId] = (acc[account.providerId] || 0) + 1;
            return acc;
          },
          {} as Record<string, number>
        ),
      };

      AccountService.logger.debug("Expired token accounts found", {
        tokenType,
        summary,
      });

      return {
        success: true,
        accounts,
        summary,
        errors: [],
      };
    } catch (error) {
      AccountService.logger.error(
        "Failed to find expired token accounts via service",
        {
          error,
          tokenType,
        }
      );

      return {
        success: false,
        errors: [error instanceof Error ? error.message : "Unknown error"],
      };
    }
  }

  /**
   * Delete account with safety checks
   */
  async deleteAccount(id: string): Promise<{
    success: boolean;
    errors: string[];
  }> {
    try {
      AccountService.logger.debug("Deleting account via service", {
        accountId: id,
      });

      // Check if account exists first
      const account = await this.accountRepository.findById(id);
      if (!account) {
        return {
          success: false,
          errors: ["Account not found"],
        };
      }

      // TODO: Add safety checks like:
      // - Ensure user has other authentication methods
      // - Archive account data
      // - Send notifications

      const deleted = await this.accountRepository.delete(id);

      if (!deleted) {
        return {
          success: false,
          errors: ["Failed to delete account"],
        };
      }

      AccountService.logger.info("Account deleted successfully", {
        accountId: id,
      });

      return {
        success: true,
        errors: [],
      };
    } catch (error) {
      AccountService.logger.error("Failed to delete account via service", {
        error,
        accountId: id,
      });

      return {
        success: false,
        errors: [error instanceof Error ? error.message : "Unknown error"],
      };
    }
  }
}
