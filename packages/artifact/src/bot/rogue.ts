import { CreateRogueBotSchema, UpdateRogueBotSchema } from "@botking/validator";
import { BotType, type Bot as PrismaBot } from "@botking/db";

import { Bot } from ".";

export class RogueBot extends Bot {
  constructor(prismaBot: PrismaBot) {
    super({
      ...prismaBot,
      utilitySpec: null,
      botType: BotType.ROGUE,
    });
  }

  validate(): boolean {
    return CreateRogueBotSchema.safeParse(this._shalowClone()).success;
  }

  validateCreation(): boolean {
    return this.validate();
  }

  validateUpdate(): boolean {
    return UpdateRogueBotSchema.safeParse(this._shalowClone()).success;
  }
}
