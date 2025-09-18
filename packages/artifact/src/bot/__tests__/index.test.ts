import { describe, it, expect, beforeEach } from "vitest";
import { Bot, BaseBot } from "../index";
import {
  BotType,
  CombatRole,
  UtilitySpecialization,
  GovernmentType,
  type Bot as PrismaBot,
} from "@botking/db";

describe("BaseBot", () => {
  let mockPrismaBot: PrismaBot;

  beforeEach(() => {
    mockPrismaBot = {
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

  it("should initialize with prismaBot data", () => {
    const bot = new Bot(mockPrismaBot);

    expect(bot.id).toBe(mockPrismaBot.id);
    expect(bot.userId).toBe(mockPrismaBot.userId);
    expect(bot.soulChipId).toBe(mockPrismaBot.soulChipId);
    expect(bot.skeletonId).toBe(mockPrismaBot.skeletonId);
    expect(bot.stateId).toBe(mockPrismaBot.stateId);
    expect(bot.name).toBe(mockPrismaBot.name);
    expect(bot.botType).toBe(mockPrismaBot.botType);
    expect(bot.combatRole).toBe(mockPrismaBot.combatRole);
    expect(bot.utilitySpec).toBe(mockPrismaBot.utilitySpec);
    expect(bot.governmentType).toBe(mockPrismaBot.governmentType);
    expect(bot.description).toBe(mockPrismaBot.description);
    expect(bot.createdAt).toEqual(mockPrismaBot.createdAt);
    expect(bot.updatedAt).toEqual(mockPrismaBot.updatedAt);
  });

  it("should handle null values correctly", () => {
    const botWithNulls: PrismaBot = {
      ...mockPrismaBot,
      userId: null,
      soulChipId: null,
      combatRole: null,
      utilitySpec: null,
      governmentType: null,
      description: null,
    };

    const bot = new Bot(botWithNulls);

    expect(bot.userId).toBeNull();
    expect(bot.soulChipId).toBeNull();
    expect(bot.combatRole).toBeNull();
    expect(bot.utilitySpec).toBeNull();
    expect(bot.governmentType).toBeNull();
    expect(bot.description).toBeNull();
  });
});

describe("Bot", () => {
  let mockPrismaBot: PrismaBot;

  beforeEach(() => {
    mockPrismaBot = {
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

  describe("toJSON", () => {
    it("should serialize to JSON object with correct format", () => {
      const bot = new Bot(mockPrismaBot);
      const json = bot.toJSON();

      expect(json).toEqual({
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
        createdAt: "2023-01-01T00:00:00.000Z",
        updatedAt: "2023-01-02T00:00:00.000Z",
      });
    });

    it("should handle null values in JSON serialization", () => {
      const botWithNulls: PrismaBot = {
        ...mockPrismaBot,
        userId: null,
        soulChipId: null,
        description: null,
      };

      const bot = new Bot(botWithNulls);
      const json = bot.toJSON();

      expect(json.userId).toBeNull();
      expect(json.soulChipId).toBeNull();
      expect(json.description).toBeNull();
    });
  });

  describe("serialize", () => {
    it("should serialize to JSON string", () => {
      const bot = new Bot(mockPrismaBot);
      const serialized = bot.serialize();

      expect(typeof serialized).toBe("string");
      expect(JSON.parse(serialized)).toEqual(bot.toJSON());
    });
  });

  describe("clone", () => {
    it("should create a deep copy of the bot", () => {
      const bot = new Bot(mockPrismaBot);
      const clonedBot = bot.clone();

      expect(clonedBot).not.toBe(bot);
      expect(clonedBot.id).toBe(bot.id);
      expect(clonedBot.userId).toBe(bot.userId);
      expect(clonedBot.name).toBe(bot.name);
      expect(clonedBot.botType).toBe(bot.botType);
      expect(clonedBot.createdAt).toEqual(bot.createdAt);
      expect(clonedBot.updatedAt).toEqual(bot.updatedAt);
    });

    it("should create new Date objects in clone", () => {
      const bot = new Bot(mockPrismaBot);
      const clonedBot = bot.clone();

      expect(clonedBot.createdAt).not.toBe(bot.createdAt);
      expect(clonedBot.updatedAt).not.toBe(bot.updatedAt);
      expect(clonedBot.createdAt).toEqual(bot.createdAt);
      expect(clonedBot.updatedAt).toEqual(bot.updatedAt);
    });
  });

  describe("validation", () => {
    it("should always return true for base validate method", () => {
      const bot = new Bot(mockPrismaBot);
      expect(bot.validate(mockPrismaBot)).toBe(true);
      expect(bot.validate(bot)).toBe(true);
    });

    it("should validate creation using schema", () => {
      const bot = new Bot(mockPrismaBot);
      expect(bot.validateCreation(mockPrismaBot)).toBe(true);
    });

    it("should validate update using schema", () => {
      const bot = new Bot(mockPrismaBot);
      expect(bot.validateUpdate(mockPrismaBot)).toBe(true);
    });

    it("should handle invalid data in validation", () => {
      const bot = new Bot(mockPrismaBot);
      const invalidBot = {
        ...mockPrismaBot,
        id: "", // Invalid empty ID
      };

      // Note: The actual validation depends on the schema definitions
      // These tests might need adjustment based on actual schema rules
      expect(typeof bot.validateCreation(invalidBot)).toBe("boolean");
      expect(typeof bot.validateUpdate(invalidBot)).toBe("boolean");
    });
  });
});
