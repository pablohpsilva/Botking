import { describe, it, expect, beforeEach } from "vitest";
import {
  BotType,
  UtilitySpecialization,
  type Bot as PrismaBot,
} from "@botking/db";
import { WorkerBot } from "../worker";
import { Bot } from "../index";

describe("WorkerBot", () => {
  let validWorkerBotData: PrismaBot;
  let workerBot: WorkerBot;

  beforeEach(() => {
    validWorkerBotData = {
      id: "worker-bot-1",
      userId: "user-1",
      soulChipId: null, // Worker bots don't have soul chips
      skeletonId: "skeleton-1",
      stateId: "state-1",
      name: "Test Worker Bot",
      botType: BotType.WORKER,
      combatRole: null, // Worker bots don't have combat roles
      utilitySpec: UtilitySpecialization.CONSTRUCTION,
      governmentType: null,
      description: "A hardworking construction bot",
      createdAt: new Date("2023-01-01"),
      updatedAt: new Date("2023-01-01"),
    };

    workerBot = new WorkerBot(validWorkerBotData);
  });

  describe("constructor", () => {
    it("should create a WorkerBot instance with correct properties", () => {
      expect(workerBot.id).toBe("worker-bot-1");
      expect(workerBot.name).toBe("Test Worker Bot");
      expect(workerBot.botType).toBe(BotType.WORKER);
      expect(workerBot.utilitySpec).toBe(UtilitySpecialization.CONSTRUCTION);
      expect(workerBot.combatRole).toBeNull();
      expect(workerBot.soulChipId).toBeNull();
      expect(workerBot.userId).toBe("user-1");
      expect(workerBot.skeletonId).toBe("skeleton-1");
      expect(workerBot.stateId).toBe("state-1");
    });

    it("should enforce business rules - no soul chip", () => {
      const dataWithSoulChip = {
        ...validWorkerBotData,
        soulChipId: "some-soul-chip",
      };

      const bot = new WorkerBot(dataWithSoulChip);
      expect(bot.soulChipId).toBeNull();
    });

    it("should enforce business rules - no combat role", () => {
      const dataWithCombatRole = {
        ...validWorkerBotData,
        combatRole: "ASSAULT" as any,
      };

      const bot = new WorkerBot(dataWithCombatRole);
      expect(bot.combatRole).toBeNull();
    });

    it("should enforce business rules - botType is always WORKER", () => {
      const dataWithDifferentType = {
        ...validWorkerBotData,
        botType: BotType.PLAYABLE,
      };

      const bot = new WorkerBot(dataWithDifferentType);
      expect(bot.botType).toBe(BotType.WORKER);
    });
  });

  describe("validate", () => {
    it("should validate a valid worker bot", () => {
      expect(workerBot.validate(validWorkerBotData)).toBe(true);
    });

    it("should validate a Bot instance", () => {
      const botInstance = new Bot(validWorkerBotData);
      expect(workerBot.validate(botInstance)).toBe(true);
    });

    it("should reject worker bot without utility specialization", () => {
      const invalidData = {
        ...validWorkerBotData,
        utilitySpec: null,
      };

      expect(workerBot.validate(invalidData)).toBe(false);
    });

    it("should reject worker bot with invalid botType", () => {
      const invalidData = {
        ...validWorkerBotData,
        botType: BotType.KING,
      };

      expect(workerBot.validate(invalidData)).toBe(false);
    });

    it("should reject worker bot without required fields", () => {
      const invalidData = {
        ...validWorkerBotData,
        name: "",
      };

      expect(workerBot.validate(invalidData)).toBe(false);
    });

    it("should reject worker bot with soul chip", () => {
      const invalidData = {
        ...validWorkerBotData,
        soulChipId: "some-soul-chip",
      };

      expect(workerBot.validate(invalidData)).toBe(false);
    });
  });

  describe("validateCreation", () => {
    it("should validate creation of a valid worker bot", () => {
      expect(workerBot.validateCreation(validWorkerBotData)).toBe(true);
    });

    it("should reject creation with missing required fields", () => {
      const invalidData = {
        ...validWorkerBotData,
        skeletonId: "",
      };

      expect(workerBot.validateCreation(invalidData)).toBe(false);
    });

    it("should use the same logic as validate method", () => {
      const testData = validWorkerBotData;
      expect(workerBot.validateCreation(testData)).toBe(
        workerBot.validate(testData)
      );
    });
  });

  describe("validateUpdate", () => {
    it("should validate update of a valid worker bot", () => {
      const updateData = {
        ...validWorkerBotData,
        id: "worker-bot-1", // Update schema requires ID
      };

      expect(workerBot.validateUpdate(updateData)).toBe(true);
    });

    it("should reject update without ID", () => {
      const invalidData = {
        ...validWorkerBotData,
        id: "",
      };

      expect(workerBot.validateUpdate(invalidData)).toBe(false);
    });

    it("should reject update with invalid utility specialization", () => {
      const invalidData = {
        ...validWorkerBotData,
        id: "worker-bot-1",
        utilitySpec: "INVALID_SPEC" as any,
      };

      expect(workerBot.validateUpdate(invalidData)).toBe(false);
    });
  });

  describe("utility specializations", () => {
    it("should accept CONSTRUCTION specialization", () => {
      const data = {
        ...validWorkerBotData,
        utilitySpec: UtilitySpecialization.CONSTRUCTION,
      };

      expect(workerBot.validate(data)).toBe(true);
    });

    it("should accept MINING specialization", () => {
      const data = {
        ...validWorkerBotData,
        utilitySpec: UtilitySpecialization.MINING,
      };

      expect(workerBot.validate(data)).toBe(true);
    });

    it("should accept REPAIR specialization", () => {
      const data = {
        ...validWorkerBotData,
        utilitySpec: UtilitySpecialization.REPAIR,
      };

      expect(workerBot.validate(data)).toBe(true);
    });

    it("should accept TRANSPORT specialization", () => {
      const data = {
        ...validWorkerBotData,
        utilitySpec: UtilitySpecialization.TRANSPORT,
      };

      expect(workerBot.validate(data)).toBe(true);
    });
  });

  describe("inheritance from Bot class", () => {
    it("should inherit all Bot class methods", () => {
      expect(workerBot.toJSON).toBeDefined();
      expect(workerBot.serialize).toBeDefined();
      expect(workerBot.clone).toBeDefined();
    });

    it("should override validate method", () => {
      const baseBot = new Bot(validWorkerBotData);

      // Base Bot validate method should return true for any data
      expect(baseBot.validate(validWorkerBotData)).toBe(true);

      // WorkerBot validate should be more strict
      const invalidWorkerData = {
        ...validWorkerBotData,
        utilitySpec: null,
      };
      expect(baseBot.validate(invalidWorkerData)).toBe(true);
      expect(workerBot.validate(invalidWorkerData)).toBe(false);
    });

    it("should be able to serialize worker bot data", () => {
      const json = workerBot.toJSON();

      expect(json.id).toBe("worker-bot-1");
      expect(json.botType).toBe(BotType.WORKER);
      expect(json.utilitySpec).toBe(UtilitySpecialization.CONSTRUCTION);
      expect(json.combatRole).toBeNull();
      expect(json.soulChipId).toBeNull();
    });

    it("should be able to clone worker bot", () => {
      const cloned = workerBot.clone();

      expect(cloned.id).toBe(workerBot.id);
      expect(cloned.botType).toBe(workerBot.botType);
      expect(cloned.utilitySpec).toBe(workerBot.utilitySpec);
      expect(cloned).not.toBe(workerBot); // Different instances
    });
  });

  describe("edge cases", () => {
    it("should handle dates correctly", () => {
      expect(workerBot.createdAt).toBeInstanceOf(Date);
      expect(workerBot.updatedAt).toBeInstanceOf(Date);
      expect(workerBot.createdAt.getTime()).toBe(
        new Date("2023-01-01").getTime()
      );
    });

    it("should handle optional fields", () => {
      const minimalData: PrismaBot = {
        id: "minimal-bot",
        userId: null,
        soulChipId: null,
        skeletonId: "skeleton-1",
        stateId: "state-1",
        name: "Minimal Bot",
        botType: BotType.WORKER,
        combatRole: null,
        utilitySpec: UtilitySpecialization.MINING,
        governmentType: null,
        description: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const minimalBot = new WorkerBot(minimalData);
      expect(minimalBot.userId).toBeNull();
      expect(minimalBot.description).toBeNull();
      expect(minimalBot.governmentType).toBeNull();
    });

    it("should validate with minimal required fields", () => {
      const minimalValidData: PrismaBot = {
        id: "minimal-bot-2",
        userId: null,
        skeletonId: "skeleton-1",
        stateId: "state-1",
        name: "Test Bot",
        botType: BotType.WORKER,
        combatRole: null,
        utilitySpec: UtilitySpecialization.CONSTRUCTION,
        governmentType: null,
        description: null,
        soulChipId: "chip-1", // This should be overridden to null by business rules
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      expect(workerBot.validate(minimalValidData)).toBe(true);
    });
  });
});
