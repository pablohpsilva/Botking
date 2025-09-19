import { CreateKingBotSchema, UpdateKingBotSchema } from "@botking/validator";
import { BotType, type Bot as PrismaBot } from "@botking/db";

import { Bot } from ".";

export class KingBot extends Bot {
  constructor(prismaBot: PrismaBot) {
    super({
      ...prismaBot,
      utilitySpec: null,
      botType: BotType.KING,
    });
  }

  validate(): boolean {
    return CreateKingBotSchema.safeParse(this._shalowClone()).success;
  }

  validateCreation(): boolean {
    return this.validate();
  }

  validateUpdate(): boolean {
    return UpdateKingBotSchema.safeParse(this._shalowClone()).success;
  }
}
