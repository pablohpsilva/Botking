/**
 * Account artifact interface based on schema.prisma Account model
 */

import type { Account as PrismaAccount } from "@botking/db";

/**
 * Interface for Account artifact - directly based on database schema
 */
export interface IAccount {
  // Database fields from PrismaAccount schema
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
  // Relations: user (handled by Prisma)

  // Artifact methods for business logic
  updateTokens(tokens: TokenUpdate): Promise<boolean>;
  updatePassword(newPassword: string): Promise<boolean>;
  isTokenExpired(tokenType: "access" | "refresh"): boolean;

  // Serialization
  toJSON(): Record<string, any>;
  serialize(): string;
  clone(): IAccount;
}

/**
 * Account creation configuration - matches database requirements
 */
export interface AccountConfiguration {
  id?: string;
  userId: string;
  providerId: string;
  accountId: string;
  password?: string | null;
  accessToken?: string | null;
  refreshToken?: string | null;
  idToken?: string | null;
  accessTokenExpiresAt?: Date | null;
  refreshTokenExpiresAt?: Date | null;
}

/**
 * Token update interface
 */
export interface TokenUpdate {
  accessToken?: string | null;
  refreshToken?: string | null;
  idToken?: string | null;
  accessTokenExpiresAt?: Date | null;
  refreshTokenExpiresAt?: Date | null;
}

/**
 * Account creation result interface
 */
export interface AccountCreationResult {
  success: boolean;
  account?: IAccount;
  errors: string[];
  warnings: string[];
}

/**
 * Account update result interface
 */
export interface AccountUpdateResult {
  success: boolean;
  changes: string[];
  errors: string[];
  warnings: string[];
}
