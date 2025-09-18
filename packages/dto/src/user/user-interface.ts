/**
 * User artifact interface based on schema.prisma User model
 */

import type { User as PrismaUser } from "@botking/db";

/**
 * Interface for User artifact - directly based on database schema
 */
export interface IUser {
  // Database fields from PrismaUser schema
  readonly id: string;
  readonly email: string;
  readonly emailVerified: boolean;
  readonly name: string | null;
  readonly image: string | null;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  // Relations are handled by Prisma (sessions, accounts, soulChips, etc.)

  // Artifact methods for business logic
  updateProfile(updates: UserProfileUpdate): Promise<boolean>;
  updateEmail(newEmail: string): Promise<boolean>;
  verifyEmail(): Promise<boolean>;

  // Serialization
  toJSON(): Record<string, any>;
  serialize(): string;
  clone(): IUser;
}

/**
 * User creation configuration - matches database requirements
 */
export interface UserConfiguration {
  id?: string;
  email: string;
  emailVerified?: boolean;
  name?: string | null;
  image?: string | null;
}

/**
 * User profile update interface
 */
export interface UserProfileUpdate {
  name?: string | null;
  image?: string | null;
}

/**
 * User creation result interface
 */
export interface UserCreationResult {
  success: boolean;
  user?: IUser;
  errors: string[];
  warnings: string[];
}

/**
 * User update result interface
 */
export interface UserUpdateResult {
  success: boolean;
  changes: string[];
  errors: string[];
  warnings: string[];
}
