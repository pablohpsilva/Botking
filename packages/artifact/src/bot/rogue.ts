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
    return this._validate(CreateRogueBotSchema, UpdateRogueBotSchema);
  }

  validateCreation(): void {
    this._validateCreation(CreateRogueBotSchema);
  }

  validateUpdate(): void {
    this._validateUpdate(UpdateRogueBotSchema);
  }
}
