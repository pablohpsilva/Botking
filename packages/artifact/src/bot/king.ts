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
    return this._validate(CreateKingBotSchema, UpdateKingBotSchema);
  }

  validateCreation(): void {
    this._validateCreation(CreateKingBotSchema);
  }

  validateUpdate(): void {
    this._validateUpdate(UpdateKingBotSchema);
  }
}
