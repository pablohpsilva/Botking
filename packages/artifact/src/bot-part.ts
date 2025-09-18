/**
 * BotPart artifact implementation based on schema.prisma BotPart model
 */

import type { BotPart as PrismaBotPart } from "@botking/db";
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
}

/**
 * BotPart artifact implementation - directly based on database schema
 */
export class BotPart extends BaseBotPart implements IBotPart {
  constructor(prismaBotPart: PrismaBotPart) {
    super(prismaBotPart);
  }

  // Serialization
  toJSON(): Record<string, any> {
    return {
      id: this.id,
      botId: this.botId,
      partId: this.partId,
      slotIndex: this.slotIndex,
      createdAt: this.createdAt.toISOString(),
    };
  }

  serialize(): string {
    return JSON.stringify(this.toJSON());
  }

  clone(): IBotPart {
    const prismaBotPartData: PrismaBotPart = {
      id: this.id,
      botId: this.botId,
      partId: this.partId,
      slotIndex: this.slotIndex,
      createdAt: new Date(this.createdAt),
    };

    return new BotPart(prismaBotPartData);
  }
}
