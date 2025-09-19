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
      botType: BotType.WORKER,
      combatRole: null,
      soulChipId: null,
    });
  }

  validate(): boolean {
    return CreateWorkerBotSchema.safeParse(this._shalowClone()).success;
  }

  validateCreation(): boolean {
    return this.validate();
  }

  validateUpdate(): boolean {
    return UpdateWorkerBotSchema.safeParse(this._shalowClone()).success;
  }
}
