/**
 * Account DTO Factory - Database-first approach
 * Creates DTOs for Account artifacts based on schema.prisma Account model
 */

import type { Account as PrismaAccount } from "@botking/db";
import { Account, AccountFactory, type IAccount } from "@botking/artifact";
import { LoggerFactory } from "@botking/logger";

/**
 * Account DTO factory for converting between database records and artifacts
 */
export class AccountDTOFactory {
  private static logger = LoggerFactory.createPackageLogger("dto", {
    service: "account-dto-factory",
  });

  /**
   * Create Account artifact from Prisma Account record
   */
  static fromPrismaAccount(prismaAccount: PrismaAccount): IAccount {
    try {
      this.logger.debug("Converting Prisma Account to artifact", {
        accountId: prismaAccount.id,
        userId: prismaAccount.userId,
        providerId: prismaAccount.providerId,
      });

      return new Account(prismaAccount);
    } catch (error) {
      this.logger.error("Failed to convert Prisma Account to artifact", {
        error,
        accountId: prismaAccount.id,
      });
      throw error;
    }
  }

  /**
   * Convert Account artifact to Prisma Account format
   */
  static toPrismaAccount(accountArtifact: IAccount): PrismaAccount {
    try {
      this.logger.debug("Converting Account artifact to Prisma format", {
        accountId: accountArtifact.id,
        userId: accountArtifact.userId,
        providerId: accountArtifact.providerId,
      });

      return {
        id: accountArtifact.id,
        userId: accountArtifact.userId,
        providerId: accountArtifact.providerId,
        accountId: accountArtifact.accountId,
        password: accountArtifact.password,
        accessToken: accountArtifact.accessToken,
        refreshToken: accountArtifact.refreshToken,
        idToken: accountArtifact.idToken,
        accessTokenExpiresAt: accountArtifact.accessTokenExpiresAt,
        refreshTokenExpiresAt: accountArtifact.refreshTokenExpiresAt,
        createdAt: accountArtifact.createdAt,
        updatedAt: accountArtifact.updatedAt,
      };
    } catch (error) {
      this.logger.error("Failed to convert Account artifact to Prisma format", {
        error,
        accountId: accountArtifact.id,
      });
      throw error;
    }
  }

  /**
   * Batch convert Prisma Accounts to artifacts
   */
  static fromPrismaAccounts(prismaAccounts: PrismaAccount[]): IAccount[] {
    this.logger.debug("Batch converting Prisma Accounts to artifacts", {
      count: prismaAccounts.length,
    });

    return prismaAccounts.map((prismaAccount) =>
      this.fromPrismaAccount(prismaAccount)
    );
  }

  /**
   * Batch convert Account artifacts to Prisma format
   */
  static toPrismaAccounts(accountArtifacts: IAccount[]): PrismaAccount[] {
    this.logger.debug("Batch converting Account artifacts to Prisma format", {
      count: accountArtifacts.length,
    });

    return accountArtifacts.map((accountArtifact) =>
      this.toPrismaAccount(accountArtifact)
    );
  }

  /**
   * Create Account artifact from partial Prisma data (for creation scenarios)
   */
  static fromPartialPrismaAccount(
    partialData: Partial<PrismaAccount> &
      Pick<PrismaAccount, "userId" | "providerId" | "accountId">
  ): IAccount {
    try {
      this.logger.debug("Creating Account artifact from partial data", {
        userId: partialData.userId,
        providerId: partialData.providerId,
        accountId: partialData.accountId,
      });

      // Use AccountFactory to create with proper defaults
      const result = AccountFactory.createAccount({
        id: partialData.id,
        userId: partialData.userId,
        providerId: partialData.providerId,
        accountId: partialData.accountId,
        password: partialData.password,
        accessToken: partialData.accessToken,
        refreshToken: partialData.refreshToken,
        idToken: partialData.idToken,
        accessTokenExpiresAt: partialData.accessTokenExpiresAt,
        refreshTokenExpiresAt: partialData.refreshTokenExpiresAt,
      });

      if (!result.success || !result.account) {
        throw new Error(
          `Failed to create account: ${result.errors.join(", ")}`
        );
      }

      return result.account;
    } catch (error) {
      this.logger.error("Failed to create Account artifact from partial data", {
        error,
        userId: partialData.userId,
        providerId: partialData.providerId,
      });
      throw error;
    }
  }

  /**
   * Create OAuth Account artifact
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
  ): IAccount {
    this.logger.debug("Creating OAuth Account artifact", {
      userId,
      providerId,
      accountId,
    });

    const result = AccountFactory.createOAuthAccount(
      userId,
      providerId,
      accountId,
      tokens
    );

    if (!result.success || !result.account) {
      throw new Error(
        `Failed to create OAuth account: ${result.errors.join(", ")}`
      );
    }

    return result.account;
  }

  /**
   * Create password-based Account artifact
   */
  static createPasswordAccount(
    userId: string,
    providerId: string,
    accountId: string,
    password: string
  ): IAccount {
    this.logger.debug("Creating password Account artifact", {
      userId,
      providerId,
      accountId,
    });

    const result = AccountFactory.createPasswordAccount(
      userId,
      providerId,
      accountId,
      password
    );

    if (!result.success || !result.account) {
      throw new Error(
        `Failed to create password account: ${result.errors.join(", ")}`
      );
    }

    return result.account;
  }

  /**
   * Validate and normalize account data before conversion
   */
  private static validatePrismaAccount(prismaAccount: PrismaAccount): void {
    if (!prismaAccount.id) {
      throw new Error("Account ID is required");
    }
    if (!prismaAccount.userId) {
      throw new Error("User ID is required");
    }
    if (!prismaAccount.providerId) {
      throw new Error("Provider ID is required");
    }
    if (!prismaAccount.accountId) {
      throw new Error("Account ID is required");
    }
  }

  /**
   * Safe conversion with validation
   */
  static safeFromPrismaAccount(prismaAccount: PrismaAccount): {
    success: boolean;
    account?: IAccount;
    error?: string;
  } {
    try {
      this.validatePrismaAccount(prismaAccount);
      const account = this.fromPrismaAccount(prismaAccount);
      return { success: true, account };
    } catch (error) {
      this.logger.warn("Safe conversion failed", {
        error,
        accountId: prismaAccount.id,
        userId: prismaAccount.userId,
        providerId: prismaAccount.providerId,
      });
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  /**
   * Extract sensitive data for logging (redacts tokens and passwords)
   */
  static getSafeLogData(
    account: IAccount | PrismaAccount
  ): Record<string, any> {
    return {
      id: account.id,
      userId: account.userId,
      providerId: account.providerId,
      accountId: account.accountId,
      hasPassword: !!account.password,
      hasAccessToken: !!account.accessToken,
      hasRefreshToken: !!account.refreshToken,
      hasIdToken: !!account.idToken,
      accessTokenExpired: account.accessTokenExpiresAt
        ? account.accessTokenExpiresAt <= new Date()
        : null,
      refreshTokenExpired: account.refreshTokenExpiresAt
        ? account.refreshTokenExpiresAt <= new Date()
        : null,
    };
  }
}
