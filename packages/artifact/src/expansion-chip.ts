/**
 * User artifact implementation based on schema.prisma User model
 */

import type {
  ExpansionChipEffect,
  ExpansionChip as PrismaExpansionChip,
  Rarity,
} from "@botking/db";
import { IGenericArtifact } from "./types";

export interface IExpansionChip
  extends PrismaExpansionChip,
    IGenericArtifact<IExpansionChip, Record<string, any>> {}

export abstract class BaseExpansionChip {
  public readonly name: string;
  public readonly id: string;
  public readonly userId: string;
  public readonly effect: ExpansionChipEffect;
  public readonly rarity: Rarity;
  public readonly upgradeLevel: number;
  public readonly effectMagnitude: number;
  public readonly energyCost: number;
  public readonly version: number;
  public readonly source: string | null;
  public readonly tags: string[];
  public readonly description: string | null;
  public readonly metadata: Record<string, any> | null;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  constructor(prismaExpansionChip: PrismaExpansionChip) {
    this.name = prismaExpansionChip.name;
    this.id = prismaExpansionChip.id;
    this.userId = prismaExpansionChip.userId;
    this.effect = prismaExpansionChip.effect;
    this.rarity = prismaExpansionChip.rarity;
    this.upgradeLevel = prismaExpansionChip.upgradeLevel;
    this.effectMagnitude = prismaExpansionChip.effectMagnitude;
    this.energyCost = prismaExpansionChip.energyCost;
    this.version = prismaExpansionChip.version;
    this.source = prismaExpansionChip.source;
    this.tags = prismaExpansionChip.tags;
    this.description = prismaExpansionChip.description;
    this.metadata = prismaExpansionChip.metadata as Record<string, any> | null;
    this.createdAt = prismaExpansionChip.createdAt;
    this.updatedAt = prismaExpansionChip.updatedAt;
  }

  protected _shalowClone(): PrismaExpansionChip {
    return {
      name: this.name,
      userId: this.userId,
      id: this.id,
      effect: this.effect,
      rarity: this.rarity,
      upgradeLevel: this.upgradeLevel,
      effectMagnitude: this.effectMagnitude,
      energyCost: this.energyCost,
      version: this.version,
      source: this.source,
      tags: this.tags,
      description: this.description,
      metadata: this.metadata as Record<string, any> | null,
      createdAt: new Date(this.createdAt),
      updatedAt: new Date(this.updatedAt),
    };
  }

  // Serialization
  toJSON(): Record<string, any> {
    return {
      ...this._shalowClone(),
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
    };
  }

  serialize(): string {
    return JSON.stringify(this.toJSON());
  }

  clone(): IExpansionChip {
    return new ExpansionChip(this._shalowClone());
  }
}

/**
 * User artifact implementation - directly based on database schema
 */
export class ExpansionChip extends BaseExpansionChip implements IExpansionChip {
  constructor(prismaExpansionChip: PrismaExpansionChip) {
    super(prismaExpansionChip);
  }
}
