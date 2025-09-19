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
    return this._validate(CreateWorkerBotSchema, UpdateWorkerBotSchema);
  }

  validateCreation(): void {
    this._validateCreation(CreateWorkerBotSchema);
  }

  validateUpdate(): void {
    this._validateUpdate(UpdateWorkerBotSchema);
  }
}
