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
    return CreatePlayableBotSchema.safeParse(this._shalowClone()).success;
  }

  validateCreation(): boolean {
    return this.validate();
  }

  validateUpdate(): boolean {
    return UpdatePlayableBotSchema.safeParse(this._shalowClone()).success;
  }
}
