import { Bot } from ".";
import { BotType, type Bot as PrismaBot } from "@botking/db";

export class WorkerBot extends Bot {
  constructor(prismaBot: PrismaBot) {
    super({
      ...prismaBot,
      /**
       * Business rules
       * - Worker bots don't have a soul chip
       * - Worker bots don't have a combat role
       * - Worker bots must have a utility specialization
       */
      botType: BotType.WORKER,
      combatRole: null,
      soulChipId: null,
    });
  }

  override validate(prismaBot: PrismaBot | Bot): boolean {
    return (
      prismaBot.botType === BotType.WORKER &&
      prismaBot.soulChipId === null &&
      prismaBot.combatRole === null &&
      prismaBot.utilitySpec !== null
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
