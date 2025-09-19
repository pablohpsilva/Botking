import type { BotExpansionChip as PrismaBotExpansionChip } from "@botking/db";

import { IGenericArtifact } from "./types";
import {
  CreateBotExpansionChipSchema,
  UpdateBotExpansionChipSchema,
} from "@botking/validator";

export interface IBotExpansionChip
  extends PrismaBotExpansionChip,
    IGenericArtifact<IBotExpansionChip, Record<string, any>> {}

export abstract class BaseBotExpansionChip {
  public readonly id: string;
  public readonly botId: string;
  public readonly expansionChipId: string;
  public readonly slotIndex: number;
  public readonly createdAt: Date;

  constructor(prismaBotExpansionChip: PrismaBotExpansionChip) {
    this.id = prismaBotExpansionChip.id;
    this.botId = prismaBotExpansionChip.botId;
    this.expansionChipId = prismaBotExpansionChip.expansionChipId;
    this.slotIndex = prismaBotExpansionChip.slotIndex;
    this.createdAt = prismaBotExpansionChip.createdAt;
  }

  protected _shalowClone(): PrismaBotExpansionChip {
    return {
      id: this.id,
      botId: this.botId,
      expansionChipId: this.expansionChipId,
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

  clone(): IBotExpansionChip {
    return new BotExpansionChip(this._shalowClone());
  }
}

/**
 * BotExpansionChip artifact implementation - directly based on database schema
 */
export class BotExpansionChip
  extends BaseBotExpansionChip
  implements IBotExpansionChip
{
  constructor(prismaBotExpansionChip: PrismaBotExpansionChip) {
    super(prismaBotExpansionChip);
  }

  validate(): boolean {
    return true;
  }

  validateCreation(): boolean {
    return CreateBotExpansionChipSchema.safeParse(this._shalowClone()).success;
  }

  validateUpdate(): boolean {
    return UpdateBotExpansionChipSchema.safeParse(this._shalowClone()).success;
  }
}
