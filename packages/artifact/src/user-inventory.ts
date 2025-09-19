/**
 * UserInventory artifact implementation based on schema.prisma UserInventory model
 */

import type { UserInventory as PrismaUserInventory } from "@botking/db";
import { IGenericArtifact } from "./types";

export interface IUserInventory
  extends PrismaUserInventory,
    IGenericArtifact<IUserInventory, Record<string, any>> {}

export abstract class BaseUserInventory {
  public readonly id: string;
  public readonly userId: string;
  public readonly itemId: string;
  public readonly quantity: number;
  public readonly acquiredAt: Date;
  public readonly expiresAt: Date | null;
  public readonly metadata: Record<string, any> | null;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  constructor(prismaUserInventory: PrismaUserInventory) {
    this.id = prismaUserInventory.id;
    this.userId = prismaUserInventory.userId;
    this.itemId = prismaUserInventory.itemId;
    this.quantity = prismaUserInventory.quantity;
    this.acquiredAt = prismaUserInventory.acquiredAt;
    this.expiresAt = prismaUserInventory.expiresAt;
    this.metadata = prismaUserInventory.metadata as Record<string, any> | null;
    this.createdAt = prismaUserInventory.createdAt;
    this.updatedAt = prismaUserInventory.updatedAt;
  }

  protected _shalowClone(): PrismaUserInventory {
    return {
      id: this.id,
      userId: this.userId,
      itemId: this.itemId,
      quantity: this.quantity,
      acquiredAt: new Date(this.acquiredAt),
      metadata: this.metadata,
      expiresAt: this.expiresAt ? new Date(this.expiresAt) : null,
      createdAt: new Date(this.createdAt),
      updatedAt: new Date(this.updatedAt),
    };
  }

  // Serialization
  toJSON(): Record<string, any> {
    return {
      ...this._shalowClone(),
      acquiredAt: this.acquiredAt.toISOString(),
      expiresAt: this.expiresAt?.toISOString(),
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
    };
  }

  serialize(): string {
    return JSON.stringify(this.toJSON());
  }

  clone(): IUserInventory {
    return new UserInventory(this._shalowClone());
  }
}

/**
 * UserInventory artifact implementation - directly based on database schema
 */
export class UserInventory extends BaseUserInventory implements IUserInventory {
  constructor(prismaUserInventory: PrismaUserInventory) {
    super(prismaUserInventory);
  }
}
