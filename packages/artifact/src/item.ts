/**
 * User artifact implementation based on schema.prisma User model
 */

import type {
  ItemCategory,
  Item as PrismaItem,
  Rarity,
  SpeedUpTarget,
  ResourceType,
  EnhancementDuration,
  GemType,
} from "@botking/db";
import { IGenericArtifact } from "./types";

export interface IItem
  extends PrismaItem,
    IGenericArtifact<IItem, Record<string, any>> {}

export abstract class BaseItem {
  public readonly id: string;
  public readonly userId: string | null;
  public readonly name: string;
  public readonly category: ItemCategory;
  public readonly rarity: Rarity;
  public readonly description: string;
  public readonly consumable: boolean;
  public readonly tradeable: boolean;
  public readonly stackable: boolean;
  public readonly maxStackSize: number;
  public readonly value: number;
  public readonly cooldownTime: number;
  public readonly requirements: string[];
  public readonly source: string | null;
  public readonly tags: string[];
  public readonly effects: Record<string, any> | null;
  public readonly isProtected: boolean | null;
  public readonly speedUpTarget: SpeedUpTarget | null;
  public readonly speedMultiplier: number | null;
  public readonly timeReduction: number | null;
  public readonly resourceType: ResourceType | null;
  public readonly resourceAmount: number | null;
  public readonly enhancementType: ResourceType | null;
  public readonly enhancementDuration: EnhancementDuration | null;
  public readonly statModifiers: Record<string, any> | null;
  public readonly gemType: GemType | null;
  public readonly gemValue: number | null;
  public readonly tradeHistory: Record<string, any> | null;
  public readonly version: number;
  public readonly metadata: Record<string, any> | null;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  constructor(prismaItem: PrismaItem) {
    this.id = prismaItem.id;
    this.userId = prismaItem.userId;
    this.name = prismaItem.name;
    this.category = prismaItem.category;
    this.rarity = prismaItem.rarity;
    this.description = prismaItem.description;
    this.consumable = prismaItem.consumable;
    this.tradeable = prismaItem.tradeable;
    this.stackable = prismaItem.stackable;
    this.maxStackSize = prismaItem.maxStackSize;
    this.value = prismaItem.value;
    this.cooldownTime = prismaItem.cooldownTime;
    this.requirements = prismaItem.requirements;
    this.source = prismaItem.source;
    this.tags = prismaItem.tags;
    this.effects = prismaItem.effects as Record<string, any> | null;
    this.isProtected = prismaItem.isProtected;
    this.speedUpTarget = prismaItem.speedUpTarget;
    this.speedMultiplier = prismaItem.speedMultiplier;
    this.timeReduction = prismaItem.timeReduction;
    this.resourceType = prismaItem.resourceType;
    this.resourceAmount = prismaItem.resourceAmount;
    this.enhancementType = prismaItem.enhancementType;
    this.enhancementDuration = prismaItem.enhancementDuration;
    this.statModifiers = prismaItem.statModifiers as Record<string, any> | null;
    this.gemType = prismaItem.gemType;
    this.gemValue = prismaItem.gemValue;
    this.tradeHistory = prismaItem.tradeHistory as Record<string, any> | null;
    this.version = prismaItem.version;
    this.metadata = prismaItem.metadata as Record<string, any> | null;
    this.createdAt = prismaItem.createdAt;
    this.updatedAt = prismaItem.updatedAt;
  }

  protected _shalowClone(): PrismaItem {
    return {
      name: this.name,
      userId: this.userId,
      id: this.id,
      category: this.category,
      rarity: this.rarity,
      description: this.description,
      consumable: this.consumable,
      tradeable: this.tradeable,
      stackable: this.stackable,
      maxStackSize: this.maxStackSize,
      value: this.value,
      cooldownTime: this.cooldownTime,
      requirements: this.requirements,
      source: this.source,
      tags: this.tags,
      effects: this.effects,
      isProtected: this.isProtected,
      speedUpTarget: this.speedUpTarget,
      speedMultiplier: this.speedMultiplier,
      timeReduction: this.timeReduction,
      resourceType: this.resourceType,
      resourceAmount: this.resourceAmount,
      enhancementType: this.enhancementType,
      enhancementDuration: this.enhancementDuration,
      statModifiers: this.statModifiers,
      gemType: this.gemType,
      gemValue: this.gemValue,
      tradeHistory: this.tradeHistory,
      version: this.version,
      metadata: this.metadata,
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

  clone(): IItem {
    return new Item(this._shalowClone());
  }
}

/**
 * User artifact implementation - directly based on database schema
 */
export class Item extends BaseItem implements IItem {
  constructor(prismaItem: PrismaItem) {
    super(prismaItem);
  }
}
