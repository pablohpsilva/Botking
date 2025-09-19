import { describe, it, expect, beforeEach } from "vitest";
import { BotType, CombatRole, type Bot as PrismaBot } from "@botking/db";
import { KingBot } from "../king";

describe("KingBot", () => {
  let validKingBotData: PrismaBot;
  let kingBot: KingBot;

  beforeEach(() => {
    validKingBotData = {
      id: "king-bot-1",
      userId: "king-user-1",
      soulChipId: "legendary-soul-chip-1", // King bots have powerful soul chips
      skeletonId: "royal-skeleton-1",
      stateId: "state-1",
      name: "Supreme King Bot",
      botType: BotType.KING,
      combatRole: CombatRole.ASSAULT, // King bots have combat roles
      utilitySpec: null, // King bots don't have utility specs
      governmentType: null,
      description: "Ultimate leader bot with supreme authority",
      createdAt: new Date("2023-01-01"),
      updatedAt: new Date("2023-01-01"),
    };

    kingBot = new KingBot(validKingBotData);
  });

  describe("constructor", () => {
    it("should create a KingBot instance with correct properties", () => {
      expect(kingBot.id).toBe("king-bot-1");
      expect(kingBot.name).toBe("Supreme King Bot");
      expect(kingBot.botType).toBe(BotType.KING);
      expect(kingBot.combatRole).toBe(CombatRole.ASSAULT);
      expect(kingBot.soulChipId).toBe("legendary-soul-chip-1");
      expect(kingBot.userId).toBe("king-user-1");
      expect(kingBot.utilitySpec).toBeNull();
      expect(kingBot.skeletonId).toBe("royal-skeleton-1");
      expect(kingBot.stateId).toBe("state-1");
    });

    it("should enforce business rules - no utility specialization", () => {
      const dataWithUtilitySpec = {
        ...validKingBotData,
        utilitySpec: "CONSTRUCTION" as any,
      };

      const bot = new KingBot(dataWithUtilitySpec);
      expect(bot.utilitySpec).toBeNull();
    });

    it("should enforce business rules - botType is always KING", () => {
      const dataWithDifferentType = {
        ...validKingBotData,
        botType: BotType.WORKER,
      };

      const bot = new KingBot(dataWithDifferentType);
      expect(bot.botType).toBe(BotType.KING);
    });
  });

  describe("validate", () => {
    it("should validate a valid king bot instance", () => {
      expect(kingBot.validate()).toBe(true);
    });
  });

  describe("validateCreation", () => {
    it("should not throw for valid king bot creation", () => {
      expect(() => kingBot.validateCreation()).not.toThrow();
    });
  });

  describe("validateUpdate", () => {
    it("should not throw for valid king bot update", () => {
      expect(() => kingBot.validateUpdate()).not.toThrow();
    });
  });

  describe("combat roles", () => {
    it("should accept ASSAULT combat role", () => {
      const data = {
        ...validKingBotData,
        combatRole: CombatRole.ASSAULT,
      };

      const bot = new KingBot(data);
      expect(bot.validate()).toBe(true);
      expect(bot.combatRole).toBe(CombatRole.ASSAULT);
    });

    it("should accept TANK combat role", () => {
      const data = {
        ...validKingBotData,
        combatRole: CombatRole.TANK,
      };

      const bot = new KingBot(data);
      expect(bot.validate()).toBe(true);
      expect(bot.combatRole).toBe(CombatRole.TANK);
    });

    it("should accept SNIPER combat role", () => {
      const data = {
        ...validKingBotData,
        combatRole: CombatRole.SNIPER,
      };

      const bot = new KingBot(data);
      expect(bot.validate()).toBe(true);
      expect(bot.combatRole).toBe(CombatRole.SNIPER);
    });

    it("should accept SCOUT combat role", () => {
      const data = {
        ...validKingBotData,
        combatRole: CombatRole.SCOUT,
      };

      const bot = new KingBot(data);
      expect(bot.validate()).toBe(true);
      expect(bot.combatRole).toBe(CombatRole.SCOUT);
    });
  });

  describe("inheritance from Bot class", () => {
    it("should inherit all Bot class methods", () => {
      expect(kingBot.toJSON).toBeDefined();
      expect(kingBot.serialize).toBeDefined();
      expect(kingBot.clone).toBeDefined();
    });

    it("should be able to serialize king bot data", () => {
      const json = kingBot.toJSON();

      expect(json.id).toBe("king-bot-1");
      expect(json.botType).toBe(BotType.KING);
      expect(json.combatRole).toBe(CombatRole.ASSAULT);
      expect(json.utilitySpec).toBeNull();
      expect(json.soulChipId).toBe("legendary-soul-chip-1");
    });

    it("should be able to clone king bot", () => {
      const cloned = kingBot.clone();

      expect(cloned.id).toBe(kingBot.id);
      expect(cloned.botType).toBe(kingBot.botType);
      expect(cloned.combatRole).toBe(kingBot.combatRole);
      expect(cloned.soulChipId).toBe(kingBot.soulChipId);
      expect(cloned).not.toBe(kingBot); // Different instances
    });
  });

  describe("validation exceptions", () => {
    it("should throw error for validateCreation with missing required fields", () => {
      const invalidData: PrismaBot = {
        ...validKingBotData,
        name: "", // Invalid: empty name
      };

      const invalidBot = new KingBot(invalidData);
      expect(() => invalidBot.validateCreation()).toThrow();
    });

    it("should throw error for validateCreation with missing soul chip", () => {
      const invalidData: PrismaBot = {
        ...validKingBotData,
        soulChipId: "", // Invalid: empty soul chip ID
      };

      const invalidBot = new KingBot(invalidData);
      expect(() => invalidBot.validateCreation()).toThrow();
    });

    it("should throw error for validateUpdate with missing ID", () => {
      const invalidData: PrismaBot = {
        ...validKingBotData,
        id: "", // Invalid: empty ID for update
      };

      const invalidBot = new KingBot(invalidData);
      expect(() => invalidBot.validateUpdate()).toThrow();
    });

    it("should throw error for validateCreation with missing skeleton ID", () => {
      const invalidData: PrismaBot = {
        ...validKingBotData,
        skeletonId: "", // Invalid: empty skeleton ID
      };

      const invalidBot = new KingBot(invalidData);
      expect(() => invalidBot.validateCreation()).toThrow();
    });

    it("should throw error for validateCreation with missing combat role", () => {
      const invalidData: PrismaBot = {
        ...validKingBotData,
        combatRole: null as any, // Invalid: king bots need combat role
      };

      const invalidBot = new KingBot(invalidData);
      expect(() => invalidBot.validateCreation()).toThrow();
    });

    it("should throw error for validateCreation with name too long", () => {
      const invalidData: PrismaBot = {
        ...validKingBotData,
        name: "A".repeat(101), // Invalid: name too long (max 100 chars)
      };

      const invalidBot = new KingBot(invalidData);
      expect(() => invalidBot.validateCreation()).toThrow();
    });

    it("should throw error for validateUpdate with name too long", () => {
      const invalidData: PrismaBot = {
        ...validKingBotData,
        name: "B".repeat(101), // Invalid: name too long (max 100 chars)
      };

      const invalidBot = new KingBot(invalidData);
      expect(() => invalidBot.validateUpdate()).toThrow();
    });

    it("should throw error for validateCreation with invalid combat role", () => {
      const invalidData: PrismaBot = {
        ...validKingBotData,
        combatRole: "INVALID_ROLE" as any, // Invalid: not a valid combat role
      };

      const invalidBot = new KingBot(invalidData);
      expect(() => invalidBot.validateCreation()).toThrow();
    });

    it("should throw error for validateCreation with missing user ID when required", () => {
      const invalidData: PrismaBot = {
        ...validKingBotData,
        userId: "", // Invalid: empty user ID when king bot requires user
      };

      const invalidBot = new KingBot(invalidData);
      expect(() => invalidBot.validateCreation()).toThrow();
    });
  });

  describe("business rules enforcement", () => {
    it("should ensure king bots cannot have utility specialization", () => {
      const dataWithUtilitySpec = {
        ...validKingBotData,
        utilitySpec: "MINING" as any,
      };

      const bot = new KingBot(dataWithUtilitySpec);
      expect(bot.utilitySpec).toBeNull();
      expect(bot.validate()).toBe(true);
    });

    it("should ensure botType is always KING", () => {
      const dataWithWrongType = {
        ...validKingBotData,
        botType: BotType.PLAYABLE,
      };

      const bot = new KingBot(dataWithWrongType);
      expect(bot.botType).toBe(BotType.KING);
      expect(bot.validate()).toBe(true);
    });

    it("should handle powerful soul chips for king bots", () => {
      const dataWithPowerfulSoulChip = {
        ...validKingBotData,
        soulChipId: "ultimate-power-chip",
      };

      const bot = new KingBot(dataWithPowerfulSoulChip);
      expect(bot.soulChipId).toBe("ultimate-power-chip");
      expect(bot.validate()).toBe(true);
    });

    it("should handle combat roles for king bots", () => {
      const dataWithCombatRole = {
        ...validKingBotData,
        combatRole: CombatRole.TANK,
      };

      const bot = new KingBot(dataWithCombatRole);
      expect(bot.combatRole).toBe(CombatRole.TANK);
      expect(bot.validate()).toBe(true);
    });
  });
});
