import { describe, it, expect } from "vitest";
import {
  BotType,
  UtilitySpecialization,
  GovernmentType,
  CombatRole,
  type Bot as PrismaBot,
} from "@botking/db";
import { BotFactory } from "../factory";
import { Bot } from "../index";
import { WorkerBot } from "../worker";
import { GovBot } from "../govbot";
import { KingBot } from "../king";
import { PlayableBot } from "../playable";
import { RogueBot } from "../rogue";

describe("BotFactory", () => {
  describe("createBot", () => {
    it("should create a WorkerBot for WORKER type", () => {
      const workerData: PrismaBot = {
        id: "worker-1",
        userId: "user-1",
        soulChipId: null,
        skeletonId: "skeleton-1",
        stateId: "state-1",
        name: "Test Worker",
        botType: BotType.WORKER,
        combatRole: null,
        utilitySpec: UtilitySpecialization.CONSTRUCTION,
        governmentType: null,
        description: "Test worker bot",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const bot = BotFactory.createBot(workerData);
      expect(bot).toBeInstanceOf(WorkerBot);
      expect(bot.botType).toBe(BotType.WORKER);
    });

    it("should create a GovBot for GOVBOT type", () => {
      const govBotData: PrismaBot = {
        id: "govbot-1",
        userId: null,
        soulChipId: "soul-chip-1",
        skeletonId: "skeleton-1",
        stateId: "state-1",
        name: "Test GovBot",
        botType: BotType.GOVBOT,
        combatRole: CombatRole.ASSAULT,
        utilitySpec: null,
        governmentType: GovernmentType.SECURITY,
        description: "Test government bot",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const bot = BotFactory.createBot(govBotData);
      expect(bot).toBeInstanceOf(GovBot);
      expect(bot.botType).toBe(BotType.GOVBOT);
    });

    it("should create a KingBot for KING type", () => {
      const kingData: PrismaBot = {
        id: "king-1",
        userId: "king-user-1",
        soulChipId: "legendary-chip-1",
        skeletonId: "royal-skeleton-1",
        stateId: "state-1",
        name: "Test King",
        botType: BotType.KING,
        combatRole: CombatRole.ASSAULT,
        utilitySpec: null,
        governmentType: null,
        description: "Test king bot",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const bot = BotFactory.createBot(kingData);
      expect(bot).toBeInstanceOf(KingBot);
      expect(bot.botType).toBe(BotType.KING);
    });

    it("should create a PlayableBot for PLAYABLE type", () => {
      const playableData: PrismaBot = {
        id: "playable-1",
        userId: "player-1",
        soulChipId: "player-chip-1",
        skeletonId: "player-skeleton-1",
        stateId: "state-1",
        name: "Test Playable",
        botType: BotType.PLAYABLE,
        combatRole: CombatRole.ASSAULT,
        utilitySpec: null,
        governmentType: null,
        description: "Test playable bot",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const bot = BotFactory.createBot(playableData);
      expect(bot).toBeInstanceOf(PlayableBot);
      expect(bot.botType).toBe(BotType.PLAYABLE);
    });

    it("should create a RogueBot for ROGUE type", () => {
      const rogueData: PrismaBot = {
        id: "rogue-1",
        userId: "rogue-user-1",
        soulChipId: "stealth-chip-1",
        skeletonId: "stealth-skeleton-1",
        stateId: "state-1",
        name: "Test Rogue",
        botType: BotType.ROGUE,
        combatRole: CombatRole.SCOUT,
        utilitySpec: null,
        governmentType: null,
        description: "Test rogue bot",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const bot = BotFactory.createBot(rogueData);
      expect(bot).toBeInstanceOf(RogueBot);
      expect(bot.botType).toBe(BotType.ROGUE);
    });

    it("should create a base Bot for unknown types", () => {
      const unknownData: PrismaBot = {
        id: "unknown-1",
        userId: "user-1",
        soulChipId: "chip-1",
        skeletonId: "skeleton-1",
        stateId: "state-1",
        name: "Test Unknown",
        botType: "UNKNOWN" as any, // Invalid type
        combatRole: null,
        utilitySpec: null,
        governmentType: null,
        description: "Test unknown bot",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const bot = BotFactory.createBot(unknownData);
      expect(bot).toBeInstanceOf(Bot);
      expect(bot).not.toBeInstanceOf(WorkerBot);
      expect(bot).not.toBeInstanceOf(GovBot);
      expect(bot).not.toBeInstanceOf(KingBot);
      expect(bot).not.toBeInstanceOf(PlayableBot);
      expect(bot).not.toBeInstanceOf(RogueBot);
    });

    it("should handle Bot instances as input", () => {
      const botData: PrismaBot = {
        id: "bot-1",
        userId: "user-1",
        soulChipId: null,
        skeletonId: "skeleton-1",
        stateId: "state-1",
        name: "Test Bot Instance",
        botType: BotType.WORKER,
        combatRole: null,
        utilitySpec: UtilitySpecialization.MINING,
        governmentType: null,
        description: "Test bot instance",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const existingBot = new Bot(botData);
      const factoryBot = BotFactory.createBot(existingBot);

      expect(factoryBot).toBeInstanceOf(WorkerBot);
      expect(factoryBot.botType).toBe(BotType.WORKER);
      expect(factoryBot.id).toBe("bot-1");
    });

    it("should preserve all properties when creating specialized bots", () => {
      const workerData: PrismaBot = {
        id: "detailed-worker-1",
        userId: "detailed-user-1",
        soulChipId: null,
        skeletonId: "detailed-skeleton-1",
        stateId: "detailed-state-1",
        name: "Detailed Worker Bot",
        botType: BotType.WORKER,
        combatRole: null,
        utilitySpec: UtilitySpecialization.REPAIR,
        governmentType: null,
        description: "Detailed test worker bot with all properties",
        createdAt: new Date("2023-01-01"),
        updatedAt: new Date("2023-01-02"),
      };

      const bot = BotFactory.createBot(workerData) as WorkerBot;

      expect(bot.id).toBe("detailed-worker-1");
      expect(bot.userId).toBe("detailed-user-1");
      expect(bot.soulChipId).toBeNull(); // Enforced by WorkerBot
      expect(bot.skeletonId).toBe("detailed-skeleton-1");
      expect(bot.stateId).toBe("detailed-state-1");
      expect(bot.name).toBe("Detailed Worker Bot");
      expect(bot.botType).toBe(BotType.WORKER); // Enforced by WorkerBot
      expect(bot.combatRole).toBeNull(); // Enforced by WorkerBot
      expect(bot.utilitySpec).toBe(UtilitySpecialization.REPAIR);
      expect(bot.governmentType).toBeNull();
      expect(bot.description).toBe(
        "Detailed test worker bot with all properties"
      );
      expect(bot.createdAt).toEqual(new Date("2023-01-01"));
      expect(bot.updatedAt).toEqual(new Date("2023-01-02"));
    });
  });

  describe("business rule enforcement through factory", () => {
    it("should enforce WorkerBot business rules", () => {
      const workerData: PrismaBot = {
        id: "worker-with-invalid-data",
        userId: "user-1",
        soulChipId: "forbidden-soul-chip", // This should be nullified
        skeletonId: "skeleton-1",
        stateId: "state-1",
        name: "Worker with Invalid Data",
        botType: BotType.WORKER,
        combatRole: CombatRole.ASSAULT, // This should be nullified
        utilitySpec: UtilitySpecialization.CONSTRUCTION,
        governmentType: null,
        description: "Worker with invalid combat role and soul chip",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const bot = BotFactory.createBot(workerData) as WorkerBot;

      // Business rules should be enforced
      expect(bot.soulChipId).toBeNull();
      expect(bot.combatRole).toBeNull();
      expect(bot.botType).toBe(BotType.WORKER);
    });

    it("should enforce GovBot business rules", () => {
      const govBotData: PrismaBot = {
        id: "govbot-with-invalid-data",
        userId: "forbidden-user", // This should be nullified
        soulChipId: "soul-chip-1",
        skeletonId: "skeleton-1",
        stateId: "state-1",
        name: "GovBot with Invalid Data",
        botType: BotType.GOVBOT,
        combatRole: CombatRole.ASSAULT,
        utilitySpec: UtilitySpecialization.MINING, // This should be nullified
        governmentType: GovernmentType.SECURITY,
        description: "GovBot with invalid user and utility spec",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const bot = BotFactory.createBot(govBotData) as GovBot;

      // Business rules should be enforced
      expect(bot.userId).toBeNull();
      expect(bot.utilitySpec).toBeNull();
      expect(bot.botType).toBe(BotType.GOVBOT);
    });

    it("should enforce KingBot business rules", () => {
      const kingData: PrismaBot = {
        id: "king-with-invalid-data",
        userId: "king-user-1",
        soulChipId: "legendary-chip-1",
        skeletonId: "royal-skeleton-1",
        stateId: "state-1",
        name: "King with Invalid Data",
        botType: BotType.KING,
        combatRole: CombatRole.ASSAULT,
        utilitySpec: UtilitySpecialization.TRANSPORT, // This should be nullified
        governmentType: null,
        description: "King with invalid utility spec",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const bot = BotFactory.createBot(kingData) as KingBot;

      // Business rules should be enforced
      expect(bot.utilitySpec).toBeNull();
      expect(bot.botType).toBe(BotType.KING);
    });
  });

  describe("validation exception handling", () => {
    it("should handle validation exceptions for WorkerBot creation", () => {
      const invalidWorkerData: PrismaBot = {
        id: "invalid-worker",
        userId: "", // Invalid: empty user ID
        soulChipId: null,
        skeletonId: "skeleton-1",
        stateId: "state-1",
        name: "", // Invalid: empty name
        botType: BotType.WORKER,
        combatRole: null,
        utilitySpec: UtilitySpecialization.CONSTRUCTION,
        governmentType: null,
        description: "Invalid worker bot",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const bot = BotFactory.createBot(invalidWorkerData) as WorkerBot;
      expect(() => bot.validateCreation()).toThrow();
    });

    it("should handle validation exceptions for GovBot creation", () => {
      const invalidGovBotData: PrismaBot = {
        id: "invalid-govbot",
        userId: null,
        soulChipId: "", // Invalid: empty soul chip ID
        skeletonId: "skeleton-1",
        stateId: "state-1",
        name: "Invalid GovBot",
        botType: BotType.GOVBOT,
        combatRole: CombatRole.ASSAULT,
        utilitySpec: null,
        governmentType: GovernmentType.SECURITY,
        description: "Invalid government bot",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const bot = BotFactory.createBot(invalidGovBotData) as GovBot;
      expect(() => bot.validateCreation()).toThrow();
    });

    it("should handle validation exceptions for KingBot creation", () => {
      const invalidKingData: PrismaBot = {
        id: "invalid-king",
        userId: "", // Invalid: empty user ID
        soulChipId: "legendary-chip-1",
        skeletonId: "royal-skeleton-1",
        stateId: "state-1",
        name: "A".repeat(101), // Invalid: name too long
        botType: BotType.KING,
        combatRole: CombatRole.ASSAULT,
        utilitySpec: null,
        governmentType: null,
        description: "Invalid king bot",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const bot = BotFactory.createBot(invalidKingData) as KingBot;
      expect(() => bot.validateCreation()).toThrow();
    });

    it("should handle validation exceptions for PlayableBot creation", () => {
      const invalidPlayableData: PrismaBot = {
        id: "invalid-playable",
        userId: null, // Invalid: playable bots need user ID
        soulChipId: "player-chip-1",
        skeletonId: "player-skeleton-1",
        stateId: "state-1",
        name: "Invalid Playable",
        botType: BotType.PLAYABLE,
        combatRole: CombatRole.ASSAULT,
        utilitySpec: null,
        governmentType: null,
        description: "Invalid playable bot",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const bot = BotFactory.createBot(invalidPlayableData) as PlayableBot;
      expect(() => bot.validateCreation()).toThrow();
    });

    it("should handle validation exceptions for RogueBot creation", () => {
      const invalidRogueData: PrismaBot = {
        id: "invalid-rogue",
        userId: "rogue-user-1",
        soulChipId: "", // Invalid: empty soul chip ID
        skeletonId: "stealth-skeleton-1",
        stateId: "state-1",
        name: "Invalid Rogue",
        botType: BotType.ROGUE,
        combatRole: CombatRole.SCOUT,
        utilitySpec: null,
        governmentType: null,
        description: "Invalid rogue bot",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const bot = BotFactory.createBot(invalidRogueData) as RogueBot;
      expect(() => bot.validateCreation()).toThrow();
    });

    it("should handle validation exceptions for update operations", () => {
      const validData: PrismaBot = {
        id: "", // Invalid: empty ID for update
        userId: "user-1",
        soulChipId: null,
        skeletonId: "skeleton-1",
        stateId: "state-1",
        name: "Valid Worker",
        botType: BotType.WORKER,
        combatRole: null,
        utilitySpec: UtilitySpecialization.CONSTRUCTION,
        governmentType: null,
        description: "Worker for update test",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const bot = BotFactory.createBot(validData) as WorkerBot;
      expect(() => bot.validateUpdate()).toThrow();
    });

    it("should handle mixed validation scenarios", () => {
      const invalidData: PrismaBot = {
        id: "mixed-invalid",
        userId: "user-1",
        soulChipId: "chip-1",
        skeletonId: "", // Invalid: empty skeleton ID
        stateId: "state-1",
        name: "B".repeat(101), // Invalid: name too long
        botType: BotType.GOVBOT,
        combatRole: null, // Invalid: gov bots need combat role
        utilitySpec: null,
        governmentType: null, // Invalid: gov bots need government type
        description: "Multiple validation errors",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const bot = BotFactory.createBot(invalidData) as GovBot;
      // Should throw because of multiple validation errors
      expect(() => bot.validateCreation()).toThrow();
    });
  });
});
