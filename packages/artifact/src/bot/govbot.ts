import { BotType, type Bot as PrismaBot } from "@botking/db";
import { CreateGovBotSchema, UpdateGovBotSchema } from "@botking/validator";

import { Bot } from ".";

export class GovBot extends Bot {
  constructor(prismaBot: PrismaBot) {
    super({
      ...prismaBot,
      /**
       * Business rules
       * - Gov bots don't have a utility specialization
       * - Gov bots must have a combat role
       * - Gov bots must have a soul chip
       * - Gov bots don't have a user id
       */
      botType: BotType.GOVBOT,
    });
  }

  override validate(prismaBot: PrismaBot | Bot): boolean {
    return CreateGovBotSchema.safeParse(prismaBot).success;
    // return (
    //   prismaBot.botType === BotType.GOVBOT &&
    //   prismaBot.utilitySpec === null &&
    //   prismaBot.userId === null &&
    //   prismaBot.combatRole !== null &&
    //   prismaBot.soulChipId !== null
    // );
  }

  override validateCreation(prismaBot: PrismaBot | Bot): boolean {
    return this.validate(prismaBot);
  }

  override validateUpdate(prismaBot: PrismaBot | Bot): boolean {
    return UpdateGovBotSchema.safeParse(prismaBot).success;
  }
}
