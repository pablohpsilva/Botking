import { Bot } from ".";

import { BotType, type Bot as PrismaBot } from "@botking/db";
import { WorkerBot } from "./worker";
import { RogueBot } from "./rogue";
import { GovBot } from "./govbot";
import { KingBot } from "./king";
import { PlayableBot } from "./playable";

export class BotFactory {
  static createBot(prismaBot: PrismaBot | Bot): Bot {
    switch (prismaBot.botType) {
      case BotType.WORKER:
        return new WorkerBot(prismaBot);
      case BotType.ROGUE:
        return new RogueBot(prismaBot);
      case BotType.GOVBOT:
        return new GovBot(prismaBot);
      case BotType.KING:
        return new KingBot(prismaBot);
      case BotType.PLAYABLE:
        return new PlayableBot(prismaBot);
      default:
        return new Bot(prismaBot);
    }
  }
}
