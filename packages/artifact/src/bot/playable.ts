import { Bot } from ".";
import { BotType, type Bot as PrismaBot } from "@botking/db";

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
    return (
      prismaBot.botType === BotType.PLAYABLE &&
      prismaBot.utilitySpec === null &&
      prismaBot.combatRole !== null &&
      prismaBot.soulChipId !== null &&
      prismaBot.userId !== null
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
