import {
  CreatePlayableBotSchema,
  UpdatePlayableBotSchema,
} from "@botking/validator";
import { BotType, type Bot as PrismaBot } from "@botking/db";

import { Bot } from ".";

export class PlayableBot extends Bot {
  constructor(prismaBot: PrismaBot) {
    super({
      ...prismaBot,
      utilitySpec: null,
      botType: BotType.PLAYABLE,
    });
  }

  validate(): boolean {
    return this._validate(CreatePlayableBotSchema, UpdatePlayableBotSchema);
  }

  validateCreation(): void {
    this._validateCreation(CreatePlayableBotSchema);
  }

  validateUpdate(): void {
    this._validateUpdate(UpdatePlayableBotSchema);
  }
}
