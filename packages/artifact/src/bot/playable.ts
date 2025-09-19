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
      /**
       * Business rules
       * - Playable bots don't have a utility specialization
       * - Playable bots must have a combat role
       * - Playable bots must have a soul chip
       * - Playable bots must have a user id
       */
      botType: BotType.PLAYABLE,
    });
  }

  override validate(prismaBot: PrismaBot | Bot): boolean {
    return CreatePlayableBotSchema.safeParse(prismaBot).success;
  }

  override validateCreation(prismaBot: PrismaBot | Bot): boolean {
    return this.validate(prismaBot);
  }

  override validateUpdate(prismaBot: PrismaBot | Bot): boolean {
    return UpdatePlayableBotSchema.safeParse(prismaBot).success;
  }
}
