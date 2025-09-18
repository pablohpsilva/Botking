import { Bot } from ".";
import { BotType, type Bot as PrismaBot } from "@botking/db";

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
    return (
      prismaBot.botType === BotType.KING &&
      prismaBot.utilitySpec === null &&
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
