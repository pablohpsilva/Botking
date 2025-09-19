import { describe, it, expect, beforeEach } from "vitest";
import {
  BotType,
  UtilitySpecialization,
  type Bot as PrismaBot,
} from "@botking/db";
import { WorkerBot } from "../worker";

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
    it("should validate a valid worker bot instance", () => {
      expect(workerBot.validate()).toBe(true);
    });
  });

  describe("validateCreation", () => {
    it("should not throw for valid worker bot creation", () => {
      expect(() => workerBot.validateCreation()).not.toThrow();
    });
  });

  describe("validateUpdate", () => {
    it("should not throw for valid worker bot update", () => {
      expect(() => workerBot.validateUpdate()).not.toThrow();
    });
  });

  describe("utility specializations", () => {
    it("should accept CONSTRUCTION specialization", () => {
      const data = {
        ...validWorkerBotData,
        utilitySpec: UtilitySpecialization.CONSTRUCTION,
      };

      const bot = new WorkerBot(data);
      expect(bot.validate()).toBe(true);
      expect(bot.utilitySpec).toBe(UtilitySpecialization.CONSTRUCTION);
    });

    it("should accept MINING specialization", () => {
      const data = {
        ...validWorkerBotData,
        utilitySpec: UtilitySpecialization.MINING,
      };

      const bot = new WorkerBot(data);
      expect(bot.validate()).toBe(true);
      expect(bot.utilitySpec).toBe(UtilitySpecialization.MINING);
    });

    it("should accept REPAIR specialization", () => {
      const data = {
        ...validWorkerBotData,
        utilitySpec: UtilitySpecialization.REPAIR,
      };

      const bot = new WorkerBot(data);
      expect(bot.validate()).toBe(true);
      expect(bot.utilitySpec).toBe(UtilitySpecialization.REPAIR);
    });

    it("should accept TRANSPORT specialization", () => {
      const data = {
        ...validWorkerBotData,
        utilitySpec: UtilitySpecialization.TRANSPORT,
      };

      const bot = new WorkerBot(data);
      expect(bot.validate()).toBe(true);
      expect(bot.utilitySpec).toBe(UtilitySpecialization.TRANSPORT);
    });
  });

  describe("inheritance from Bot class", () => {
    it("should inherit all Bot class methods", () => {
      expect(workerBot.toJSON).toBeDefined();
      expect(workerBot.serialize).toBeDefined();
      expect(workerBot.clone).toBeDefined();
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

  describe("validation exceptions", () => {
    it("should throw error for validateCreation with missing required fields", () => {
      const invalidData: PrismaBot = {
        ...validWorkerBotData,
        name: "", // Invalid: empty name
      };

      const invalidBot = new WorkerBot(invalidData);
      expect(() => invalidBot.validateCreation()).toThrow();
    });

    it("should throw error for validateCreation with missing utility specialization", () => {
      const invalidData: PrismaBot = {
        ...validWorkerBotData,
        utilitySpec: null as any, // Invalid: worker bots need utility spec
      };

      const invalidBot = new WorkerBot(invalidData);
      expect(() => invalidBot.validateCreation()).toThrow();
    });

    it("should throw error for validateUpdate with missing ID", () => {
      const invalidData: PrismaBot = {
        ...validWorkerBotData,
        id: "", // Invalid: empty ID for update
      };

      const invalidBot = new WorkerBot(invalidData);
      expect(() => invalidBot.validateUpdate()).toThrow();
    });

    it("should throw error for validateCreation with missing user ID", () => {
      const invalidData: PrismaBot = {
        ...validWorkerBotData,
        userId: "", // Invalid: empty user ID
      };

      const invalidBot = new WorkerBot(invalidData);
      expect(() => invalidBot.validateCreation()).toThrow();
    });

    it("should throw error for validateCreation with missing skeleton ID", () => {
      const invalidData: PrismaBot = {
        ...validWorkerBotData,
        skeletonId: "", // Invalid: empty skeleton ID
      };

      const invalidBot = new WorkerBot(invalidData);
      expect(() => invalidBot.validateCreation()).toThrow();
    });

    it("should throw error for validateCreation with name too long", () => {
      const invalidData: PrismaBot = {
        ...validWorkerBotData,
        name: "A".repeat(101), // Invalid: name too long (max 100 chars)
      };

      const invalidBot = new WorkerBot(invalidData);
      expect(() => invalidBot.validateCreation()).toThrow();
    });

    it("should throw error for validateUpdate with name too long", () => {
      const invalidData: PrismaBot = {
        ...validWorkerBotData,
        name: "B".repeat(101), // Invalid: name too long (max 100 chars)
      };

      const invalidBot = new WorkerBot(invalidData);
      expect(() => invalidBot.validateUpdate()).toThrow();
    });
  });
});
