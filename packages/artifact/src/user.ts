/**
 * User artifact implementation based on schema.prisma User model
 */

import type { User as PrismaUser } from "@botking/db";
import { IGenericArtifact } from "./types";

export interface IUser
  extends PrismaUser,
    IGenericArtifact<IUser, Record<string, any>> {}

export abstract class BaseUser {
  // Prisma User properties (copied from database)
  readonly id: string;
  readonly email: string;
  readonly emailVerified: boolean;
  readonly name: string | null;
  readonly image: string | null;
  readonly createdAt: Date;
  readonly updatedAt: Date;

  constructor(prismaUser: PrismaUser) {
    this.id = prismaUser.id;
    this.email = prismaUser.email;
    this.emailVerified = prismaUser.emailVerified;
    this.name = prismaUser.name;
    this.image = prismaUser.image;
    this.createdAt = prismaUser.createdAt;
    this.updatedAt = prismaUser.updatedAt;
  }
}

/**
 * User artifact implementation - directly based on database schema
 */
export class User extends BaseUser implements IUser {
  constructor(prismaUser: PrismaUser) {
    super(prismaUser);
  }

  // Serialization
  toJSON(): Record<string, any> {
    return {
      id: this.id,
      email: this.email,
      emailVerified: this.emailVerified,
      name: this.name,
      image: this.image,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
    };
  }

  serialize(): string {
    return JSON.stringify(this.toJSON());
  }

  clone(): IUser {
    const prismaUserData: PrismaUser = {
      id: this.id,
      email: this.email,
      emailVerified: this.emailVerified,
      name: this.name,
      image: this.image,
      createdAt: new Date(this.createdAt),
      updatedAt: new Date(this.updatedAt),
    };

    return new User(prismaUserData);
  }
}
