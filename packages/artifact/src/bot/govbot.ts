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
    return this._validate(CreateGovBotSchema, UpdateGovBotSchema);
  }

  validateCreation(): void {
    this._validateCreation(CreateGovBotSchema);
  }

  validateUpdate(): void {
    this._validateUpdate(UpdateGovBotSchema);
  }
}
