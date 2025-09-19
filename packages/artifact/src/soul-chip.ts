import { Rarity, SoulChip as PrismaSoulChip } from "@botking/db";
import { IGenericArtifact } from "./types";

export interface ISoulChip
  extends PrismaSoulChip,
    IGenericArtifact<ISoulChip, Record<string, any>> {}

export abstract class BaseSoulChip {
  public readonly intelligence: number;
  public readonly resilience: number;
  public readonly adaptability: number;
  public readonly name: string;
  public readonly id: string;
  public readonly userId: string;
  public readonly personality: string;
  public readonly rarity: Rarity;
  public readonly specialTrait: string;
  public readonly experiences: string[];
  public readonly learningRate: number;
  public readonly version: number;
  public readonly source: string | null;
  public readonly tags: string[];
  public readonly description: string | null;
  public readonly metadata: Record<string, any> | null;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  constructor(prismaSoulChip: PrismaSoulChip) {
    this.intelligence = prismaSoulChip.intelligence;
    this.resilience = prismaSoulChip.resilience;
    this.adaptability = prismaSoulChip.adaptability;
    this.name = prismaSoulChip.name;
    this.id = prismaSoulChip.id;
    this.userId = prismaSoulChip.userId;
    this.personality = prismaSoulChip.personality;
    this.rarity = prismaSoulChip.rarity;
    this.specialTrait = prismaSoulChip.specialTrait;
    this.experiences = prismaSoulChip.experiences;
    this.learningRate = prismaSoulChip.learningRate;
    this.version = prismaSoulChip.version;
    this.source = prismaSoulChip.source;
    this.tags = prismaSoulChip.tags;
    this.description = prismaSoulChip.description;
    this.metadata = prismaSoulChip.metadata as Record<string, any> | null;
    this.createdAt = prismaSoulChip.createdAt;
    this.updatedAt = prismaSoulChip.updatedAt;
  }

  protected _shalowClone(): PrismaSoulChip {
    return {
      id: this.id,
      userId: this.userId,
      name: this.name,
      intelligence: this.intelligence,
      resilience: this.resilience,
      adaptability: this.adaptability,
      personality: this.personality,
      rarity: this.rarity,
      specialTrait: this.specialTrait,
      experiences: this.experiences,
      learningRate: this.learningRate,
      version: this.version,
      tags: this.tags,
      source: this.source,
      description: this.description,
      metadata: this.metadata,
      createdAt: new Date(this.createdAt),
      updatedAt: new Date(this.updatedAt),
    };
  }

  /**
   * Serialize the soul chip to JSON
   */
  toJSON(): Record<string, any> {
    return {
      ...this._shalowClone(),
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  /**
   * Create a SoulChip from JSON data
   */
  serialize(): string {
    return JSON.stringify(this.toJSON());
  }

  clone(): ISoulChip {
    return new SoulChip(this._shalowClone());
  }
}

/**
 * Soul Chip - The core of the bot that defines individuality and emotional connection
 */
export class SoulChip extends BaseSoulChip implements ISoulChip {
  constructor(prismaSoulChip: PrismaSoulChip) {
    super(prismaSoulChip);
  }
}
