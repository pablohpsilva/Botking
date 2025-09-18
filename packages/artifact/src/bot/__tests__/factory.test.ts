import { describe, it, expect, beforeEach } from "vitest";
import { BotFactory } from "../factory";
import { Bot } from "../index";
import { WorkerBot } from "../worker";
import { RogueBot } from "../rogue";
import { GovBot } from "../govbot";
import { KingBot } from "../king";
import { PlayableBot } from "../playable";
import {
  BotType,
  CombatRole,
  UtilitySpecialization,
  GovernmentType,
  type Bot as PrismaBot,
} from "@botking/db";

describe("BotFactory", () => {
  let basePrismaBot: PrismaBot;

  beforeEach(() => {
    basePrismaBot = {
      id: "test-bot-id",
      userId: "test-user-id",
      soulChipId: "test-soul-chip-id",
      skeletonId: "test-skeleton-id",
      stateId: "test-state-id",
      name: "Test Bot",
      botType: BotType.WORKER,
      combatRole: CombatRole.ASSAULT,
      utilitySpec: UtilitySpecialization.MINING,
      governmentType: GovernmentType.SECURITY,
      description: "A test bot",
      createdAt: new Date("2023-01-01T00:00:00Z"),
      updatedAt: new Date("2023-01-02T00:00:00Z"),
    };
  });

  describe("createBot", () => {
    it("should create WorkerBot for WORKER type", () => {
      const workerBotData: PrismaBot = {
        ...basePrismaBot,
        botType: BotType.WORKER,
      };

      const bot = BotFactory.createBot(workerBotData);

      expect(bot).toBeInstanceOf(WorkerBot);
      expect(bot.botType).toBe(BotType.WORKER);
    });

    it("should create RogueBot for ROGUE type", () => {
      const rogueBotData: PrismaBot = {
        ...basePrismaBot,
        botType: BotType.ROGUE,
      };

      const bot = BotFactory.createBot(rogueBotData);

      expect(bot).toBeInstanceOf(RogueBot);
      expect(bot.botType).toBe(BotType.ROGUE);
    });

    it("should create GovBot for GOVBOT type", () => {
      const govBotData: PrismaBot = {
        ...basePrismaBot,
        botType: BotType.GOVBOT,
      };

      const bot = BotFactory.createBot(govBotData);

      expect(bot).toBeInstanceOf(GovBot);
      expect(bot.botType).toBe(BotType.GOVBOT);
    });

    it("should create KingBot for KING type", () => {
      const kingBotData: PrismaBot = {
        ...basePrismaBot,
        botType: BotType.KING,
      };

      const bot = BotFactory.createBot(kingBotData);

      expect(bot).toBeInstanceOf(KingBot);
      expect(bot.botType).toBe(BotType.KING);
    });

    it("should create PlayableBot for PLAYABLE type", () => {
      const playableBotData: PrismaBot = {
        ...basePrismaBot,
        botType: BotType.PLAYABLE,
      };

      const bot = BotFactory.createBot(playableBotData);

      expect(bot).toBeInstanceOf(PlayableBot);
      expect(bot.botType).toBe(BotType.PLAYABLE);
    });

    it("should create base Bot for unknown type", () => {
      // Create a bot with an unknown type by using type assertion
      const unknownBotData = {
        ...basePrismaBot,
        botType: "UNKNOWN" as BotType,
      };

      const bot = BotFactory.createBot(unknownBotData);

      expect(bot).toBeInstanceOf(Bot);
      expect(bot).not.toBeInstanceOf(WorkerBot);
      expect(bot).not.toBeInstanceOf(RogueBot);
      expect(bot).not.toBeInstanceOf(GovBot);
      expect(bot).not.toBeInstanceOf(KingBot);
      expect(bot).not.toBeInstanceOf(PlayableBot);
    });

    it("should accept Bot instance as input", () => {
      const existingBot = new Bot(basePrismaBot);
      const createdBot = BotFactory.createBot(existingBot);

      expect(createdBot).toBeInstanceOf(Bot);
      expect(createdBot.id).toBe(existingBot.id);
      expect(createdBot.botType).toBe(existingBot.botType);
    });

    it("should preserve all bot properties during creation", () => {
      const botData: PrismaBot = {
        ...basePrismaBot,
        botType: BotType.WORKER,
        name: "Specialized Worker",
        description: "A mining specialist",
        utilitySpec: UtilitySpecialization.MINING,
        soulChipId: null, // Workers don't have soul chips
        combatRole: null, // Workers don't have combat roles
      };

      const bot = BotFactory.createBot(botData);

      expect(bot.id).toBe(botData.id);
      expect(bot.name).toBe(botData.name);
      expect(bot.description).toBe(botData.description);
      expect(bot.utilitySpec).toBe(botData.utilitySpec);
      expect(bot.userId).toBe(botData.userId);
      expect(bot.soulChipId).toBeNull(); // WorkerBot enforces this to be null
      expect(bot.skeletonId).toBe(botData.skeletonId);
      expect(bot.stateId).toBe(botData.stateId);
      expect(bot.combatRole).toBeNull(); // WorkerBot enforces this to be null
      expect(bot.governmentType).toBe(botData.governmentType);
      expect(bot.createdAt).toEqual(botData.createdAt);
      expect(bot.updatedAt).toEqual(botData.updatedAt);
    });
  });
});
