/**
 * Account artifact implementation based on schema.prisma Account model
 */

import type { Account as PrismaAccount } from "@botking/db";
import { IGenericArtifact } from "./types";

/**
 * Interface for Account artifact - directly based on database schema
 */
export interface IAccount
  extends PrismaAccount,
    IGenericArtifact<IAccount, Record<string, any>> {}

export abstract class BaseAccount {
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
  }
}

/**
 * Account artifact implementation - directly based on database schema
 */
export class Account extends BaseAccount implements IAccount {
  constructor(prismaAccount: PrismaAccount) {
    super(prismaAccount);
  }

  protected _shalowClone(): PrismaAccount {
    return {
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
  }

  // Serialization
  toJSON(): Record<string, any> {
    return {
      ...this._shalowClone(),
      // password: this.password ? "[REDACTED]" : null, // Don't expose password
      // accessToken: this.accessToken ? "[REDACTED]" : null, // Don't expose tokens
      // refreshToken: this.refreshToken ? "[REDACTED]" : null,
      // idToken: this.idToken ? "[REDACTED]" : null,
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
    return new Account(this._shalowClone());
  }
}
