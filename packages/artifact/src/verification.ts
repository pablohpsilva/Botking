/**
 * Verification artifact implementation based on schema.prisma Verification model
 */

import type { Verification as PrismaVerification } from "@botking/db";
import { IGenericArtifact } from "./types";

export interface IVerification
  extends PrismaVerification,
    IGenericArtifact<IVerification, Record<string, any>> {}

export abstract class BaseVerification {
  public readonly id: string;
  public readonly identifier: string;
  public readonly value: string;
  public readonly expiresAt: Date;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  constructor(prismaVerification: PrismaVerification) {
    this.id = prismaVerification.id;
    this.identifier = prismaVerification.identifier;
    this.value = prismaVerification.value;
    this.expiresAt = prismaVerification.expiresAt;
    this.createdAt = prismaVerification.createdAt;
    this.updatedAt = prismaVerification.updatedAt;
  }
}

/**
 * Verification artifact implementation - directly based on database schema
 */
export class Verification extends BaseVerification implements IVerification {
  constructor(prismaVerification: PrismaVerification) {
    super(prismaVerification);
  }

  // Serialization
  toJSON(): Record<string, any> {
    return {
      id: this.id,
      identifier: this.identifier,
      value: this.value,
      expiresAt: this.expiresAt.toISOString(),
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
    };
  }

  serialize(): string {
    return JSON.stringify(this.toJSON());
  }

  clone(): IVerification {
    const prismaVerificationData: PrismaVerification = {
      id: this.id,
      identifier: this.identifier,
      value: this.value,
      expiresAt: this.expiresAt,
      createdAt: new Date(this.createdAt),
      updatedAt: new Date(this.updatedAt),
    };

    return new Verification(prismaVerificationData);
  }
}
