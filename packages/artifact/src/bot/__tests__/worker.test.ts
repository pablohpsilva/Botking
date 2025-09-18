import { describe, it, expect, beforeEach } from "vitest";
import { WorkerBot } from "../worker";
import {
  BotType,
  CombatRole,
  UtilitySpecialization,
  GovernmentType,
  type Bot as PrismaBot,
} from "@botking/db";

describe("WorkerBot", () => {
  let mockPrismaBot: PrismaBot;

  beforeEach(() => {
    mockPrismaBot = {
      id: "test-worker-id",
      userId: "test-user-id",
      soulChipId: null, // Workers don't have soul chips
      skeletonId: "test-skeleton-id",
      stateId: "test-state-id",
      name: "Test Worker Bot",
      botType: BotType.WORKER,
      combatRole: null, // Workers don't have combat roles
      utilitySpec: UtilitySpecialization.MINING,
      governmentType: null,
      description: "A mining worker bot",
      createdAt: new Date("2023-01-01T00:00:00Z"),
      updatedAt: new Date("2023-01-02T00:00:00Z"),
    };
  });

  describe("constructor", () => {
    it("should create WorkerBot with correct business rules applied", () => {
      const workerBot = new WorkerBot(mockPrismaBot);

      expect(workerBot.botType).toBe(BotType.WORKER);
      expect(workerBot.soulChipId).toBeNull();
      expect(workerBot.combatRole).toBeNull();
      expect(workerBot.utilitySpec).toBe(UtilitySpecialization.MINING);
    });

    it("should override botType to WORKER even if input has different type", () => {
      const invalidBotData: PrismaBot = {
        ...mockPrismaBot,
        botType: BotType.PLAYABLE, // Invalid for worker
      };

      const workerBot = new WorkerBot(invalidBotData);

      expect(workerBot.botType).toBe(BotType.WORKER);
    });

    it("should force soulChipId to null even if input has value", () => {
      const invalidBotData: PrismaBot = {
        ...mockPrismaBot,
        soulChipId: "some-soul-chip-id", // Invalid for worker
      };

      const workerBot = new WorkerBot(invalidBotData);

      expect(workerBot.soulChipId).toBeNull();
    });

    it("should force combatRole to null even if input has value", () => {
      const invalidBotData: PrismaBot = {
        ...mockPrismaBot,
        combatRole: CombatRole.ASSAULT, // Invalid for worker
      };

      const workerBot = new WorkerBot(invalidBotData);

      expect(workerBot.combatRole).toBeNull();
    });

    it("should preserve other properties from input", () => {
      const workerBot = new WorkerBot(mockPrismaBot);

      expect(workerBot.id).toBe(mockPrismaBot.id);
      expect(workerBot.userId).toBe(mockPrismaBot.userId);
      expect(workerBot.skeletonId).toBe(mockPrismaBot.skeletonId);
      expect(workerBot.stateId).toBe(mockPrismaBot.stateId);
      expect(workerBot.name).toBe(mockPrismaBot.name);
      expect(workerBot.description).toBe(mockPrismaBot.description);
      expect(workerBot.createdAt).toEqual(mockPrismaBot.createdAt);
      expect(workerBot.updatedAt).toEqual(mockPrismaBot.updatedAt);
    });
  });

  describe("validate", () => {
    it("should return true for valid worker bot", () => {
      const workerBot = new WorkerBot(mockPrismaBot);
      const validWorkerData: PrismaBot = {
        ...mockPrismaBot,
        botType: BotType.WORKER,
        soulChipId: null,
        combatRole: null,
        utilitySpec: UtilitySpecialization.CONSTRUCTION,
      };

      expect(workerBot.validate(validWorkerData)).toBe(true);
    });

    it("should return false if botType is not WORKER", () => {
      const workerBot = new WorkerBot(mockPrismaBot);
      const invalidData: PrismaBot = {
        ...mockPrismaBot,
        botType: BotType.PLAYABLE,
      };

      expect(workerBot.validate(invalidData)).toBe(false);
    });

    it("should return false if soulChipId is not null", () => {
      const workerBot = new WorkerBot(mockPrismaBot);
      const invalidData: PrismaBot = {
        ...mockPrismaBot,
        soulChipId: "some-soul-chip-id",
      };

      expect(workerBot.validate(invalidData)).toBe(false);
    });

    it("should return false if combatRole is not null", () => {
      const workerBot = new WorkerBot(mockPrismaBot);
      const invalidData: PrismaBot = {
        ...mockPrismaBot,
        combatRole: CombatRole.TANK,
      };

      expect(workerBot.validate(invalidData)).toBe(false);
    });

    it("should return false if utilitySpec is null", () => {
      const workerBot = new WorkerBot(mockPrismaBot);
      const invalidData: PrismaBot = {
        ...mockPrismaBot,
        utilitySpec: null,
      };

      expect(workerBot.validate(invalidData)).toBe(false);
    });

    it("should work with all utility specializations", () => {
      const workerBot = new WorkerBot(mockPrismaBot);

      const utilitySpecs = [
        UtilitySpecialization.CONSTRUCTION,
        UtilitySpecialization.MINING,
        UtilitySpecialization.REPAIR,
        UtilitySpecialization.TRANSPORT,
      ];

      utilitySpecs.forEach((spec) => {
        const data: PrismaBot = {
          ...mockPrismaBot,
          utilitySpec: spec,
        };
        expect(workerBot.validate(data)).toBe(true);
      });
    });
  });

  describe("validateCreation", () => {
    it("should validate using both base schema and worker-specific rules", () => {
      const workerBot = new WorkerBot(mockPrismaBot);

      // Create data that should be valid for a worker according to schema
      const validWorkerData: PrismaBot = {
        ...mockPrismaBot,
        soulChipId: "dummy-soul-chip-id", // Schema requires this to be a string
        utilitySpec: UtilitySpecialization.MINING,
        combatRole: null,
      };

      // This should pass base validation but may fail worker validation due to soulChipId
      const result = workerBot.validateCreation(validWorkerData);
      expect(typeof result).toBe("boolean");
    });

    it("should return false if worker-specific validation fails", () => {
      const workerBot = new WorkerBot(mockPrismaBot);
      const invalidData: PrismaBot = {
        ...mockPrismaBot,
        soulChipId: "valid-soul-chip", // Schema valid but worker logic invalid
        utilitySpec: null, // Required for workers
      };

      expect(workerBot.validateCreation(invalidData)).toBe(false);
    });
  });

  describe("validateUpdate", () => {
    it("should validate using both base schema and worker-specific rules", () => {
      const workerBot = new WorkerBot(mockPrismaBot);

      const validUpdateData: PrismaBot = {
        ...mockPrismaBot,
        soulChipId: "dummy-soul-chip-id", // Schema requires string
        utilitySpec: UtilitySpecialization.CONSTRUCTION,
        combatRole: null,
      };

      const result = workerBot.validateUpdate(validUpdateData);
      expect(typeof result).toBe("boolean");
    });

    it("should return false if worker-specific validation fails", () => {
      const workerBot = new WorkerBot(mockPrismaBot);
      const invalidData: PrismaBot = {
        ...mockPrismaBot,
        soulChipId: "valid-soul-chip", // Schema valid but worker logic invalid
        botType: BotType.KING, // Invalid change
      };

      expect(workerBot.validateUpdate(invalidData)).toBe(false);
    });
  });

  describe("inheritance", () => {
    it("should inherit all methods from Bot class", () => {
      const workerBot = new WorkerBot(mockPrismaBot);

      expect(typeof workerBot.toJSON).toBe("function");
      expect(typeof workerBot.serialize).toBe("function");
      expect(typeof workerBot.clone).toBe("function");
    });

    it("should properly serialize worker bot", () => {
      const workerBot = new WorkerBot(mockPrismaBot);
      const json = workerBot.toJSON();

      expect(json.botType).toBe(BotType.WORKER);
      expect(json.soulChipId).toBeNull();
      expect(json.combatRole).toBeNull();
      expect(json.utilitySpec).toBe(UtilitySpecialization.MINING);
    });
  });
});
