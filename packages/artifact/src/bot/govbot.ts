import { BotType, type Bot as PrismaBot } from "@botking/db";
import { CreateGovBotSchema, UpdateGovBotSchema } from "@botking/validator";

import { Bot } from ".";

export class GovBot extends Bot {
  constructor(prismaBot: PrismaBot) {
    super({
      ...prismaBot,
      utilitySpec: null,
      userId: null,
      botType: BotType.GOVBOT,
    });
  }

  validate(): boolean {
    return CreateGovBotSchema.safeParse(this._shalowClone()).success;
  }

  validateCreation(): boolean {
    return this.validate();
  }

  validateUpdate(): boolean {
    return UpdateGovBotSchema.safeParse(this._shalowClone()).success;
  }
}
