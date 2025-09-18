/**
 * User artifact implementation based on schema.prisma User model
 */

import type { PartCategory, Part as PrismaPart, Rarity } from "@botking/db";
import { IGenericArtifact } from "./types";

export interface IPart
  extends PrismaPart,
    IGenericArtifact<IPart, Record<string, any>> {}

export abstract class BasePart {
  public readonly name: string;
  public readonly id: string;
  public readonly userId: string;
  public readonly category: PartCategory;
  public readonly rarity: Rarity;
  public readonly attack: number;
  public readonly defense: number;
  public readonly speed: number;
  public readonly perception: number;
  public readonly energyConsumption: number;
  public readonly upgradeLevel: number;
  public readonly currentDurability: number;
  public readonly maxDurability: number;
  public readonly abilities: Record<string, any>[];
  public readonly version: number;
  public readonly source: string | null;
  public readonly tags: string[];
  public readonly description: string | null;
  public readonly metadata: Record<string, any> | null;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  constructor(prismaPart: PrismaPart) {
    this.name = prismaPart.name;
    this.id = prismaPart.id;
    this.userId = prismaPart.userId;
    this.category = prismaPart.category;
    this.rarity = prismaPart.rarity;
    this.attack = prismaPart.attack;
    this.defense = prismaPart.defense;
    this.speed = prismaPart.speed;
    this.perception = prismaPart.perception;
    this.energyConsumption = prismaPart.energyConsumption;
    this.upgradeLevel = prismaPart.upgradeLevel;
    this.currentDurability = prismaPart.currentDurability;
    this.maxDurability = prismaPart.maxDurability;
    this.abilities = prismaPart.abilities as Record<string, any>[];
    this.version = prismaPart.version;
    this.source = prismaPart.source;
    this.tags = prismaPart.tags;
    this.description = prismaPart.description;
    this.metadata = prismaPart.metadata as Record<string, any> | null;
    this.createdAt = prismaPart.createdAt;
    this.updatedAt = prismaPart.updatedAt;
  }
}

/**
 * User artifact implementation - directly based on database schema
 */
export class Part extends BasePart implements IPart {
  constructor(prismaPart: PrismaPart) {
    super(prismaPart);
  }

  // Serialization
  toJSON(): Record<string, any> {
    return {
      id: this.id,
      userId: this.userId,
      category: this.category,
      rarity: this.rarity,
      attack: this.attack,
      defense: this.defense,
      speed: this.speed,
      perception: this.perception,
      energyConsumption: this.energyConsumption,
      upgradeLevel: this.upgradeLevel,
      currentDurability: this.currentDurability,
      maxDurability: this.maxDurability,
      abilities: this.abilities,
      version: this.version,
      source: this.source,
      tags: this.tags,
      description: this.description,
      metadata: this.metadata,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
    };
  }

  serialize(): string {
    return JSON.stringify(this.toJSON());
  }

  clone(): IPart {
    const prismaPartData: PrismaPart = {
      name: this.name,
      userId: this.userId,
      id: this.id,
      category: this.category,
      rarity: this.rarity,
      attack: this.attack,
      defense: this.defense,
      speed: this.speed,
      perception: this.perception,
      energyConsumption: this.energyConsumption,
      upgradeLevel: this.upgradeLevel,
      currentDurability: this.currentDurability,
      maxDurability: this.maxDurability,
      abilities: this.abilities,
      version: this.version,
      source: this.source,
      tags: this.tags,
      description: this.description,
      metadata: this.metadata,
      createdAt: new Date(this.createdAt),
      updatedAt: new Date(this.updatedAt),
    };

    return new Part(prismaPartData);
  }
}
