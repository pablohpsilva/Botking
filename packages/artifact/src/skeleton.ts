import {
  MobilityType,
  Skeleton as PrismaSkeleton,
  Rarity,
  SkeletonType,
} from "@botking/db";
import { IGenericArtifact } from "./types";

export interface ISkeleton
  extends PrismaSkeleton,
    IGenericArtifact<ISkeleton, Record<string, any>> {}

export abstract class BaseSkeleton {
  public readonly name: string;
  public readonly id: string;
  public readonly userId: string;
  public readonly type: SkeletonType;
  public readonly rarity: Rarity;
  public readonly slots: number;
  public readonly baseDurability: number;
  public readonly currentDurability: number;
  public readonly maxDurability: number;
  public readonly mobilityType: MobilityType;
  public readonly upgradeLevel: number;
  public readonly specialAbilities: string[];
  public readonly version: number;
  public readonly source: string | null;
  public readonly tags: string[];
  public readonly description: string | null;
  public readonly metadata: Record<string, any> | null;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  constructor(prismaSkeleton: PrismaSkeleton) {
    this.name = prismaSkeleton.name;
    this.id = prismaSkeleton.id;
    this.userId = prismaSkeleton.userId;
    this.type = prismaSkeleton.type;
    this.rarity = prismaSkeleton.rarity;
    this.slots = prismaSkeleton.slots;
    this.baseDurability = prismaSkeleton.baseDurability;
    this.currentDurability = prismaSkeleton.currentDurability;
    this.maxDurability = prismaSkeleton.maxDurability;
    this.mobilityType = prismaSkeleton.mobilityType;
    this.upgradeLevel = prismaSkeleton.upgradeLevel;
    this.specialAbilities = prismaSkeleton.specialAbilities;
    this.version = prismaSkeleton.version;
    this.source = prismaSkeleton.source;
    this.tags = prismaSkeleton.tags;
    this.description = prismaSkeleton.description;
    this.metadata = prismaSkeleton.metadata as Record<string, any> | null;
    this.createdAt = prismaSkeleton.createdAt;
    this.updatedAt = prismaSkeleton.updatedAt;
  }

  protected _shalowClone(): PrismaSkeleton {
    return {
      id: this.id,
      userId: this.userId,
      name: this.name,
      type: this.type,
      rarity: this.rarity,
      slots: this.slots,
      baseDurability: this.baseDurability,
      currentDurability: this.currentDurability,
      maxDurability: this.maxDurability,
      mobilityType: this.mobilityType,
      upgradeLevel: this.upgradeLevel,
      specialAbilities: this.specialAbilities,
      version: this.version,
      source: this.source,
      tags: this.tags,
      description: this.description,
      metadata: this.metadata,
      createdAt: new Date(this.createdAt),
      updatedAt: new Date(this.updatedAt),
    };
  }

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

  clone(): ISkeleton {
    return new Skeleton(this._shalowClone());
  }
}

export class Skeleton extends BaseSkeleton implements ISkeleton {
  constructor(prismaSkeleton: PrismaSkeleton) {
    super(prismaSkeleton);
  }
}
