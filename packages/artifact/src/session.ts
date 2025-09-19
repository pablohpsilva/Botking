/**
 * Session artifact implementation based on schema.prisma Session model
 */

import type { Session as PrismaSession } from "@botking/db";
import { IGenericArtifact } from "./types";

export interface ISession
  extends PrismaSession,
    IGenericArtifact<ISession, Record<string, any>> {}

export abstract class BaseSession {
  public readonly id: string;
  public readonly token: string;
  public readonly expiresAt: Date;
  public readonly userId: string;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  constructor(prismaSession: PrismaSession) {
    this.id = prismaSession.id;
    this.token = prismaSession.token;
    this.expiresAt = prismaSession.expiresAt;
    this.userId = prismaSession.userId;
    this.createdAt = prismaSession.createdAt;
    this.updatedAt = prismaSession.updatedAt;
  }

  protected _shalowClone(): PrismaSession {
    return {
      id: this.id,
      token: this.token,
      expiresAt: this.expiresAt,
      userId: this.userId,
      createdAt: new Date(this.createdAt),
      updatedAt: new Date(this.updatedAt),
    };
  }

  // Serialization
  toJSON(): Record<string, any> {
    return {
      ...this._shalowClone(),
      expiresAt: this.expiresAt.toISOString(),
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
    };
  }

  serialize(): string {
    return JSON.stringify(this.toJSON());
  }

  clone(): ISession {
    return new Session(this._shalowClone());
  }
}

/**
 * Session artifact implementation - directly based on database schema
 */
export class Session extends BaseSession implements ISession {
  constructor(prismaSession: PrismaSession) {
    super(prismaSession);
  }
}
