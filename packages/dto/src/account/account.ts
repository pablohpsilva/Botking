/**
 * Account artifact implementation based on schema.prisma Account model
 */

import type { Account as PrismaAccount } from "@botking/db";
import type {
  IAccount,
  AccountConfiguration,
  TokenUpdate,
} from "./account-interface";
import { LoggerFactory } from "@botking/logger";

/**
 * Account artifact implementation - directly based on database schema
 */
export class Account implements IAccount {
  private static logger = LoggerFactory.createPackageLogger("artifact", {
    service: "account",
  });

  // Prisma Account properties (copied from database)
  readonly id: string;
  readonly userId: string;
  readonly providerId: string;
  readonly accountId: string;
  readonly password: string | null;
  readonly accessToken: string | null;
  readonly refreshToken: string | null;
  readonly idToken: string | null;
  readonly accessTokenExpiresAt: Date | null;
  readonly refreshTokenExpiresAt: Date | null;
  readonly createdAt: Date;
  readonly updatedAt: Date;

  constructor(prismaAccount: PrismaAccount) {
    this.id = prismaAccount.id;
    this.userId = prismaAccount.userId;
    this.providerId = prismaAccount.providerId;
    this.accountId = prismaAccount.accountId;
    this.password = prismaAccount.password;
    this.accessToken = prismaAccount.accessToken;
    this.refreshToken = prismaAccount.refreshToken;
    this.idToken = prismaAccount.idToken;
    this.accessTokenExpiresAt = prismaAccount.accessTokenExpiresAt;
    this.refreshTokenExpiresAt = prismaAccount.refreshTokenExpiresAt;
    this.createdAt = prismaAccount.createdAt;
    this.updatedAt = prismaAccount.updatedAt;

    Account.logger.debug("Account artifact created from database data", {
      id: this.id,
      userId: this.userId,
      providerId: this.providerId,
      accountId: this.accountId,
    });
  }

  // Token management
  async updateTokens(tokens: TokenUpdate): Promise<boolean> {
    try {
      // In real implementation, this would update the database via repository
      Account.logger.info("Account tokens update requested", {
        accountId: this.id,
        userId: this.userId,
        tokensUpdated: Object.keys(tokens),
      });

      return true;
    } catch (error) {
      Account.logger.error("Failed to update account tokens", {
        accountId: this.id,
        userId: this.userId,
        error,
      });
      return false;
    }
  }

  async updatePassword(newPassword: string): Promise<boolean> {
    try {
      // In real implementation, this would hash and update the password in database
      Account.logger.info("Account password update requested", {
        accountId: this.id,
        userId: this.userId,
        providerId: this.providerId,
      });

      return true;
    } catch (error) {
      Account.logger.error("Failed to update account password", {
        accountId: this.id,
        userId: this.userId,
        error,
      });
      return false;
    }
  }

  // Token validation
  isTokenExpired(tokenType: "access" | "refresh"): boolean {
    const now = new Date();

    switch (tokenType) {
      case "access":
        return this.accessTokenExpiresAt
          ? this.accessTokenExpiresAt <= now
          : false;
      case "refresh":
        return this.refreshTokenExpiresAt
          ? this.refreshTokenExpiresAt <= now
          : false;
      default:
        return false;
    }
  }

  // Serialization
  toJSON(): Record<string, any> {
    return {
      id: this.id,
      userId: this.userId,
      providerId: this.providerId,
      accountId: this.accountId,
      password: this.password ? "[REDACTED]" : null, // Don't expose password
      accessToken: this.accessToken ? "[REDACTED]" : null, // Don't expose tokens
      refreshToken: this.refreshToken ? "[REDACTED]" : null,
      idToken: this.idToken ? "[REDACTED]" : null,
      accessTokenExpiresAt: this.accessTokenExpiresAt?.toISOString() || null,
      refreshTokenExpiresAt: this.refreshTokenExpiresAt?.toISOString() || null,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
    };
  }

  serialize(): string {
    return JSON.stringify(this.toJSON());
  }

  clone(): IAccount {
    const prismaAccountData: PrismaAccount = {
      id: this.id,
      userId: this.userId,
      providerId: this.providerId,
      accountId: this.accountId,
      password: this.password,
      accessToken: this.accessToken,
      refreshToken: this.refreshToken,
      idToken: this.idToken,
      accessTokenExpiresAt: this.accessTokenExpiresAt
        ? new Date(this.accessTokenExpiresAt)
        : null,
      refreshTokenExpiresAt: this.refreshTokenExpiresAt
        ? new Date(this.refreshTokenExpiresAt)
        : null,
      createdAt: new Date(this.createdAt),
      updatedAt: new Date(this.updatedAt),
    };

    return new Account(prismaAccountData);
  }

  // Static factory method for creating from Prisma Account
  static fromPrismaAccount(prismaAccount: PrismaAccount): Account {
    return new Account(prismaAccount);
  }
}
