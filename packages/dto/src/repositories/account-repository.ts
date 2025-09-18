/**
 * Account Repository - Database-first approach
 * Repository for Account entities with artifact integration
 */

import type {
  Account as PrismaAccount,
  CreateAccountDTO,
  UpdateAccountDTO,
} from "@botking/db";
import type { IAccount, TokenUpdate } from "@botking/artifact";
import { AccountDTOFactory } from "../factories/account-dto-factory";
import { LoggerFactory } from "@botking/logger";

/**
 * Account repository interface for database operations
 */
export interface IAccountRepository {
  // Basic CRUD operations
  findById(id: string): Promise<IAccount | null>;
  findByUserId(userId: string): Promise<IAccount[]>;
  findByProvider(userId: string, providerId: string): Promise<IAccount[]>;
  findByProviderAccount(
    providerId: string,
    accountId: string
  ): Promise<IAccount | null>;
  findMany(options?: {
    where?: any;
    orderBy?: any;
    take?: number;
    skip?: number;
  }): Promise<IAccount[]>;

  create(data: CreateAccountDTO): Promise<IAccount>;
  update(id: string, data: UpdateAccountDTO): Promise<IAccount | null>;
  delete(id: string): Promise<boolean>;

  // Account-specific operations
  updateTokens(id: string, tokens: TokenUpdate): Promise<IAccount | null>;
  updatePassword(id: string, password: string): Promise<IAccount | null>;
  findExpiredTokens(tokenType: "access" | "refresh"): Promise<IAccount[]>;
  count(where?: any): Promise<number>;

  // Provider-specific queries
  findOAuthAccounts(): Promise<IAccount[]>;
  findCredentialAccounts(): Promise<IAccount[]>;
}

/**
 * Account repository implementation
 */
export class AccountRepository implements IAccountRepository {
  private static logger = LoggerFactory.createPackageLogger("dto", {
    service: "account-repository",
  });

  constructor(private prismaClient: any) {}

  /**
   * Find account by ID
   */
  async findById(id: string): Promise<IAccount | null> {
    try {
      AccountRepository.logger.debug("Finding account by ID", {
        accountId: id,
      });

      const prismaAccount = await this.prismaClient.account.findUnique({
        where: { id },
      });

      if (!prismaAccount) {
        AccountRepository.logger.debug("Account not found", { accountId: id });
        return null;
      }

      return AccountDTOFactory.fromPrismaAccount(prismaAccount);
    } catch (error) {
      AccountRepository.logger.error("Failed to find account by ID", {
        error,
        accountId: id,
      });
      throw error;
    }
  }

  /**
   * Find accounts by user ID
   */
  async findByUserId(userId: string): Promise<IAccount[]> {
    try {
      AccountRepository.logger.debug("Finding accounts by user ID", { userId });

      const prismaAccounts = await this.prismaClient.account.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
      });

      return AccountDTOFactory.fromPrismaAccounts(prismaAccounts);
    } catch (error) {
      AccountRepository.logger.error("Failed to find accounts by user ID", {
        error,
        userId,
      });
      throw error;
    }
  }

  /**
   * Find accounts by user and provider
   */
  async findByProvider(
    userId: string,
    providerId: string
  ): Promise<IAccount[]> {
    try {
      AccountRepository.logger.debug("Finding accounts by provider", {
        userId,
        providerId,
      });

      const prismaAccounts = await this.prismaClient.account.findMany({
        where: { userId, providerId },
        orderBy: { createdAt: "desc" },
      });

      return AccountDTOFactory.fromPrismaAccounts(prismaAccounts);
    } catch (error) {
      AccountRepository.logger.error("Failed to find accounts by provider", {
        error,
        userId,
        providerId,
      });
      throw error;
    }
  }

  /**
   * Find account by provider and account ID (unique combination)
   */
  async findByProviderAccount(
    providerId: string,
    accountId: string
  ): Promise<IAccount | null> {
    try {
      AccountRepository.logger.debug(
        "Finding account by provider and account ID",
        {
          providerId,
          accountId,
        }
      );

      const prismaAccount = await this.prismaClient.account.findUnique({
        where: {
          providerId_accountId: {
            providerId,
            accountId,
          },
        },
      });

      if (!prismaAccount) {
        AccountRepository.logger.debug("Account not found", {
          providerId,
          accountId,
        });
        return null;
      }

      return AccountDTOFactory.fromPrismaAccount(prismaAccount);
    } catch (error) {
      AccountRepository.logger.error(
        "Failed to find account by provider and account ID",
        {
          error,
          providerId,
          accountId,
        }
      );
      throw error;
    }
  }

  /**
   * Find multiple accounts with options
   */
  async findMany(
    options: {
      where?: any;
      orderBy?: any;
      take?: number;
      skip?: number;
    } = {}
  ): Promise<IAccount[]> {
    try {
      AccountRepository.logger.debug("Finding multiple accounts", { options });

      const prismaAccounts = await this.prismaClient.account.findMany({
        where: options.where,
        orderBy: options.orderBy || { createdAt: "desc" },
        take: options.take,
        skip: options.skip,
      });

      return AccountDTOFactory.fromPrismaAccounts(prismaAccounts);
    } catch (error) {
      AccountRepository.logger.error("Failed to find multiple accounts", {
        error,
        options,
      });
      throw error;
    }
  }

  /**
   * Create new account
   */
  async create(data: CreateAccountDTO): Promise<IAccount> {
    try {
      AccountRepository.logger.debug(
        "Creating account",
        AccountDTOFactory.getSafeLogData(data as any)
      );

      const prismaAccount = await this.prismaClient.account.create({
        data: {
          userId: data.userId,
          providerId: data.providerId,
          accountId: data.accountId,
          password: data.password,
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
          idToken: data.idToken,
          accessTokenExpiresAt: data.accessTokenExpiresAt,
          refreshTokenExpiresAt: data.refreshTokenExpiresAt,
        },
      });

      AccountRepository.logger.info(
        "Account created successfully",
        AccountDTOFactory.getSafeLogData(prismaAccount)
      );

      return AccountDTOFactory.fromPrismaAccount(prismaAccount);
    } catch (error) {
      AccountRepository.logger.error("Failed to create account", {
        error,
        userId: data.userId,
        providerId: data.providerId,
      });
      throw error;
    }
  }

  /**
   * Update account
   */
  async update(id: string, data: UpdateAccountDTO): Promise<IAccount | null> {
    try {
      AccountRepository.logger.debug("Updating account", { accountId: id });

      const prismaAccount = await this.prismaClient.account.update({
        where: { id },
        data: {
          password: data.password,
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
          idToken: data.idToken,
          accessTokenExpiresAt: data.accessTokenExpiresAt,
          refreshTokenExpiresAt: data.refreshTokenExpiresAt,
          updatedAt: new Date(),
        },
      });

      AccountRepository.logger.info(
        "Account updated successfully",
        AccountDTOFactory.getSafeLogData(prismaAccount)
      );

      return AccountDTOFactory.fromPrismaAccount(prismaAccount);
    } catch (error) {
      AccountRepository.logger.error("Failed to update account", {
        error,
        accountId: id,
      });

      if ((error as any).code === "P2025") {
        // Prisma record not found
        return null;
      }

      throw error;
    }
  }

  /**
   * Delete account
   */
  async delete(id: string): Promise<boolean> {
    try {
      AccountRepository.logger.debug("Deleting account", { accountId: id });

      await this.prismaClient.account.delete({
        where: { id },
      });

      AccountRepository.logger.info("Account deleted successfully", {
        accountId: id,
      });
      return true;
    } catch (error) {
      AccountRepository.logger.error("Failed to delete account", {
        error,
        accountId: id,
      });

      if ((error as any).code === "P2025") {
        // Record not found
        return false;
      }

      throw error;
    }
  }

  /**
   * Update account tokens
   */
  async updateTokens(
    id: string,
    tokens: TokenUpdate
  ): Promise<IAccount | null> {
    try {
      AccountRepository.logger.debug("Updating account tokens", {
        accountId: id,
      });

      const prismaAccount = await this.prismaClient.account.update({
        where: { id },
        data: {
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
          idToken: tokens.idToken,
          accessTokenExpiresAt: tokens.accessTokenExpiresAt,
          refreshTokenExpiresAt: tokens.refreshTokenExpiresAt,
          updatedAt: new Date(),
        },
      });

      AccountRepository.logger.info(
        "Account tokens updated successfully",
        AccountDTOFactory.getSafeLogData(prismaAccount)
      );

      return AccountDTOFactory.fromPrismaAccount(prismaAccount);
    } catch (error) {
      AccountRepository.logger.error("Failed to update account tokens", {
        error,
        accountId: id,
      });

      if ((error as any).code === "P2025") {
        return null;
      }

      throw error;
    }
  }

  /**
   * Update account password
   */
  async updatePassword(id: string, password: string): Promise<IAccount | null> {
    try {
      AccountRepository.logger.debug("Updating account password", {
        accountId: id,
      });

      const prismaAccount = await this.prismaClient.account.update({
        where: { id },
        data: {
          password,
          updatedAt: new Date(),
        },
      });

      AccountRepository.logger.info("Account password updated successfully", {
        accountId: id,
      });

      return AccountDTOFactory.fromPrismaAccount(prismaAccount);
    } catch (error) {
      AccountRepository.logger.error("Failed to update account password", {
        error,
        accountId: id,
      });

      if ((error as any).code === "P2025") {
        return null;
      }

      throw error;
    }
  }

  /**
   * Find accounts with expired tokens
   */
  async findExpiredTokens(
    tokenType: "access" | "refresh"
  ): Promise<IAccount[]> {
    try {
      AccountRepository.logger.debug("Finding accounts with expired tokens", {
        tokenType,
      });

      const now = new Date();
      const where =
        tokenType === "access"
          ? { accessTokenExpiresAt: { lte: now } }
          : { refreshTokenExpiresAt: { lte: now } };

      return this.findMany({ where });
    } catch (error) {
      AccountRepository.logger.error(
        "Failed to find accounts with expired tokens",
        {
          error,
          tokenType,
        }
      );
      throw error;
    }
  }

  /**
   * Count accounts with optional filter
   */
  async count(where?: any): Promise<number> {
    try {
      AccountRepository.logger.debug("Counting accounts", { where });

      return await this.prismaClient.account.count({ where });
    } catch (error) {
      AccountRepository.logger.error("Failed to count accounts", {
        error,
        where,
      });
      throw error;
    }
  }

  /**
   * Find OAuth accounts (non-credential providers)
   */
  async findOAuthAccounts(): Promise<IAccount[]> {
    return this.findMany({
      where: { providerId: { not: "credentials" } },
      orderBy: { createdAt: "desc" },
    });
  }

  /**
   * Find credential-based accounts
   */
  async findCredentialAccounts(): Promise<IAccount[]> {
    return this.findMany({
      where: { providerId: "credentials" },
      orderBy: { createdAt: "desc" },
    });
  }
}
