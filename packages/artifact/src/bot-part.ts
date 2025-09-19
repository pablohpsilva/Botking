/**
 * BotPart artifact implementation based on schema.prisma BotPart model
 */

import type { BotPart as PrismaBotPart } from "@botking/db";
import { CreateBotPartSchema, UpdateBotPartSchema } from "@botking/validator";

import { IGenericArtifact } from "./types";

export interface IBotPart
  extends PrismaBotPart,
    IGenericArtifact<IBotPart, Record<string, any>> {}

export abstract class BaseBotPart {
  public readonly id: string;
  public readonly botId: string;
  public readonly partId: string;
  public readonly slotIndex: number;
  public readonly createdAt: Date;

  constructor(prismaBotPart: PrismaBotPart) {
    this.id = prismaBotPart.id;
    this.botId = prismaBotPart.botId;
    this.partId = prismaBotPart.partId;
    this.slotIndex = prismaBotPart.slotIndex;
    this.createdAt = prismaBotPart.createdAt;
  }

  protected _shalowClone(): PrismaBotPart {
    return {
      id: this.id,
      botId: this.botId,
      partId: this.partId,
      slotIndex: this.slotIndex,
      createdAt: new Date(this.createdAt),
    };
  }

  // Serialization
  toJSON(): Record<string, any> {
    return {
      ...this._shalowClone(),
      createdAt: this.createdAt.toISOString(),
    };
  }

  serialize(): string {
    return JSON.stringify(this.toJSON());
  }

  clone(): IBotPart {
    return new BotPart(this._shalowClone());
  }
}

/**
 * BotPart artifact implementation - directly based on database schema
 */
export class BotPart extends BaseBotPart implements IBotPart {
  constructor(prismaBotPart: PrismaBotPart) {
    super(prismaBotPart);
  }

  validate(): boolean {
    return true;
  }

  validateCreation(): boolean {
    return CreateBotPartSchema.safeParse(this._shalowClone()).success;
  }

  validateUpdate(): boolean {
    return UpdateBotPartSchema.safeParse(this._shalowClone()).success;
  }
}
