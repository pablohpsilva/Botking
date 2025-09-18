import { Bot } from ".";
import { BotType, type Bot as PrismaBot } from "@botking/db";

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
    return (
      prismaBot.botType === BotType.GOVBOT &&
      prismaBot.utilitySpec === null &&
      prismaBot.userId === null &&
      prismaBot.combatRole !== null &&
      prismaBot.soulChipId !== null
    );
  }

  override validateCreation(prismaBot: PrismaBot | Bot): boolean {
    const result = super.validateCreation(prismaBot);
    return result && this.validate(prismaBot);
  }

  override validateUpdate(prismaBot: PrismaBot | Bot): boolean {
    const result = super.validateUpdate(prismaBot);
    return result && this.validate(prismaBot);
  }
}
