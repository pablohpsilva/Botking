import { CreateRogueBotSchema, UpdateRogueBotSchema } from "@botking/validator";
import { BotType, type Bot as PrismaBot } from "@botking/db";

import { Bot } from ".";

export class RogueBot extends Bot {
  constructor(prismaBot: PrismaBot) {
    super({
      ...prismaBot,
      /**
       * Business rules
       * - Rogue bots don't have a utility specialization
       */
      botType: BotType.ROGUE,
    });
  }

  override validate(prismaBot: PrismaBot | Bot): boolean {
    return CreateRogueBotSchema.safeParse(prismaBot).success;
  }

  override validateCreation(prismaBot: PrismaBot | Bot): boolean {
    return this.validate(prismaBot);
  }

  override validateUpdate(prismaBot: PrismaBot | Bot): boolean {
    return UpdateRogueBotSchema.safeParse(prismaBot).success;
  }
}
