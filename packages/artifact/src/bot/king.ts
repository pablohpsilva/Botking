import { CreateKingBotSchema, UpdateKingBotSchema } from "@botking/validator";
import { BotType, type Bot as PrismaBot } from "@botking/db";

import { Bot } from ".";

export class KingBot extends Bot {
  constructor(prismaBot: PrismaBot) {
    super({
      ...prismaBot,
      /**
       * Business rules
       * - King bots don't have a utility specialization
       * - King bots must have a combat role
       * - King bots must have a soul chip
       * - King bots might have a user id
       */
      botType: BotType.KING,
    });
  }

  override validate(prismaBot: PrismaBot | Bot): boolean {
    return CreateKingBotSchema.safeParse(prismaBot).success;
  }

  override validateCreation(prismaBot: PrismaBot | Bot): boolean {
    return this.validate(prismaBot);
  }

  override validateUpdate(prismaBot: PrismaBot | Bot): boolean {
    return UpdateKingBotSchema.safeParse(prismaBot).success;
  }
}
