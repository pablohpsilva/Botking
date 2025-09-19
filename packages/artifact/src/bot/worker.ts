import {
  CreateWorkerBotSchema,
  UpdateWorkerBotSchema,
} from "@botking/validator";
import { BotType, type Bot as PrismaBot } from "@botking/db";

import { Bot } from ".";

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
    return CreateWorkerBotSchema.safeParse(prismaBot).success;
  }

  override validateCreation(prismaBot: PrismaBot | Bot): boolean {
    return this.validate(prismaBot);
  }

  override validateUpdate(prismaBot: PrismaBot | Bot): boolean {
    return UpdateWorkerBotSchema.safeParse(prismaBot).success;
  }
}
