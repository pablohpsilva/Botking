/**
 * BotExpansionChip artifact implementation based on schema.prisma BotExpansionChip model
 */

import type { BotExpansionChip as PrismaBotExpansionChip } from "@botking/db";
import { IGenericArtifact } from "./types";

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

  // Serialization
  toJSON(): Record<string, any> {
    return {
      id: this.id,
      botId: this.botId,
      expansionChipId: this.expansionChipId,
      slotIndex: this.slotIndex,
      createdAt: this.createdAt.toISOString(),
    };
  }

  serialize(): string {
    return JSON.stringify(this.toJSON());
  }

  clone(): IBotExpansionChip {
    const prismaBotExpansionChipData: PrismaBotExpansionChip = {
      id: this.id,
      botId: this.botId,
      expansionChipId: this.expansionChipId,
      slotIndex: this.slotIndex,
      createdAt: new Date(this.createdAt),
    };

    return new BotExpansionChip(prismaBotExpansionChipData);
  }
}
