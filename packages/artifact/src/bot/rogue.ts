import { Bot } from ".";
import { BotType, type Bot as PrismaBot } from "@botking/db";

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
    return (
      prismaBot.botType === BotType.ROGUE && prismaBot.utilitySpec === null
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
