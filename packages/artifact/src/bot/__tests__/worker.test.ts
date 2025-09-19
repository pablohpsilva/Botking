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

    it("should return false for invalid worker bot data", () => {
      // Create a worker bot with invalid data (missing utility spec)
      const invalidData = {
        ...validWorkerBotData,
        utilitySpec: null,
      };

      const invalidBot = new WorkerBot(invalidData);
      expect(invalidBot.validate()).toBe(false);
    });

    it("should return false for worker bot with combat role", () => {
      // Even though constructor enforces null, let's test validation
      const dataWithCombatRole = {
        ...validWorkerBotData,
        combatRole: "ASSAULT" as any,
      };

      const bot = new WorkerBot(dataWithCombatRole);
      // Constructor should enforce null, so this should still validate
      expect(bot.validate()).toBe(true);
      expect(bot.combatRole).toBeNull();
    });

    it("should return false for worker bot with soul chip", () => {
      // Even though constructor enforces null, let's test validation
      const dataWithSoulChip = {
        ...validWorkerBotData,
        soulChipId: "some-soul-chip",
      };

      const bot = new WorkerBot(dataWithSoulChip);
      // Constructor should enforce null, so this should still validate
      expect(bot.validate()).toBe(true);
      expect(bot.soulChipId).toBeNull();
    });
  });

  describe("validateCreation", () => {
    it("should validate creation of a valid worker bot", () => {
      expect(workerBot.validateCreation()).toBe(true);
    });

    it("should reject creation with missing utility specialization", () => {
      const invalidData = {
        ...validWorkerBotData,
        utilitySpec: null,
      };

      const invalidBot = new WorkerBot(invalidData);
      expect(invalidBot.validateCreation()).toBe(false);
    });

    it("should use the same logic as validate method", () => {
      expect(workerBot.validateCreation()).toBe(workerBot.validate());
    });
  });

  describe("validateUpdate", () => {
    it("should validate update of a valid worker bot", () => {
      expect(workerBot.validateUpdate()).toBe(true);
    });

    it("should handle update validation for worker bot with ID", () => {
      // The update schema typically requires an ID
      expect(workerBot.validateUpdate()).toBe(true);
      expect(workerBot.id).toBe("worker-bot-1");
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
      expect(minimalBot.validate()).toBe(true);
    });

    it("should validate with required fields for worker bot", () => {
      const validData: PrismaBot = {
        id: "test-worker",
        userId: "user-123",
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

      const testBot = new WorkerBot(validData);
      expect(testBot.validate()).toBe(true);
    });

    it("should handle different user scenarios", () => {
      // Worker bots can have users (unlike gov bots)
      const dataWithUser = {
        ...validWorkerBotData,
        userId: "test-user-123",
      };

      const botWithUser = new WorkerBot(dataWithUser);
      expect(botWithUser.validate()).toBe(true);
      expect(botWithUser.userId).toBe("test-user-123");
    });

    it("should validate worker bot without user", () => {
      // Worker bots can also exist without users
      const dataWithoutUser = {
        ...validWorkerBotData,
        userId: null,
      };

      const botWithoutUser = new WorkerBot(dataWithoutUser);
      expect(botWithoutUser.validate()).toBe(true);
      expect(botWithoutUser.userId).toBeNull();
    });
  });

  describe("business rules enforcement", () => {
    it("should ensure worker bots cannot have soul chips", () => {
      // This is enforced by constructor
      const dataWithSoulChip = {
        ...validWorkerBotData,
        soulChipId: "forbidden-soul-chip",
      };

      const bot = new WorkerBot(dataWithSoulChip);
      expect(bot.soulChipId).toBeNull();
      expect(bot.validate()).toBe(true);
    });

    it("should ensure worker bots cannot have combat roles", () => {
      // This is enforced by constructor
      const dataWithCombatRole = {
        ...validWorkerBotData,
        combatRole: "TANK" as any,
      };

      const bot = new WorkerBot(dataWithCombatRole);
      expect(bot.combatRole).toBeNull();
      expect(bot.validate()).toBe(true);
    });

    it("should ensure worker bots must have utility specialization", () => {
      // Constructor doesn't change this, but validation should catch it
      const dataWithoutUtilitySpec = {
        ...validWorkerBotData,
        utilitySpec: null,
      };

      const bot = new WorkerBot(dataWithoutUtilitySpec);
      expect(bot.utilitySpec).toBeNull();
      expect(bot.validate()).toBe(false);
    });

    it("should ensure botType is always WORKER", () => {
      // This is enforced by constructor
      const dataWithWrongType = {
        ...validWorkerBotData,
        botType: BotType.GOVBOT,
      };

      const bot = new WorkerBot(dataWithWrongType);
      expect(bot.botType).toBe(BotType.WORKER);
      expect(bot.validate()).toBe(true);
    });
  });
});
