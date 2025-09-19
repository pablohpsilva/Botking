import { describe, it, expect, beforeEach } from "vitest";
import {
  BotType,
  GovernmentType,
  CombatRole,
  type Bot as PrismaBot,
} from "@botking/db";
import { GovBot } from "../govbot";

describe("GovBot", () => {
  let validGovBotData: PrismaBot;
  let govBot: GovBot;

  beforeEach(() => {
    validGovBotData = {
      id: "govbot-1",
      userId: null, // Gov bots don't have users
      soulChipId: "soul-chip-1", // Gov bots must have soul chips
      skeletonId: "skeleton-1",
      stateId: "state-1",
      name: "Security Chief Bot",
      botType: BotType.GOVBOT,
      combatRole: CombatRole.ASSAULT, // Gov bots must have combat roles
      utilitySpec: null, // Gov bots don't have utility specs
      governmentType: GovernmentType.SECURITY,
      description: "Elite security enforcement bot",
      createdAt: new Date("2023-01-01"),
      updatedAt: new Date("2023-01-01"),
    };

    govBot = new GovBot(validGovBotData);
  });

  describe("constructor", () => {
    it("should create a GovBot instance with correct properties", () => {
      expect(govBot.id).toBe("govbot-1");
      expect(govBot.name).toBe("Security Chief Bot");
      expect(govBot.botType).toBe(BotType.GOVBOT);
      expect(govBot.governmentType).toBe(GovernmentType.SECURITY);
      expect(govBot.combatRole).toBe(CombatRole.ASSAULT);
      expect(govBot.soulChipId).toBe("soul-chip-1");
      expect(govBot.userId).toBeNull();
      expect(govBot.utilitySpec).toBeNull();
      expect(govBot.skeletonId).toBe("skeleton-1");
      expect(govBot.stateId).toBe("state-1");
    });

    it("should enforce business rules - no utility specialization", () => {
      const dataWithUtilitySpec = {
        ...validGovBotData,
        utilitySpec: "CONSTRUCTION" as any,
      };

      const bot = new GovBot(dataWithUtilitySpec);
      expect(bot.utilitySpec).toBeNull();
    });

    it("should enforce business rules - no user ID", () => {
      const dataWithUserId = {
        ...validGovBotData,
        userId: "some-user",
      };

      const bot = new GovBot(dataWithUserId);
      expect(bot.userId).toBeNull();
    });

    it("should enforce business rules - botType is always GOVBOT", () => {
      const dataWithDifferentType = {
        ...validGovBotData,
        botType: BotType.WORKER,
      };

      const bot = new GovBot(dataWithDifferentType);
      expect(bot.botType).toBe(BotType.GOVBOT);
    });
  });

  describe("validate", () => {
    it("should validate a valid gov bot instance", () => {
      expect(govBot.validate()).toBe(true);
    });
  });

  describe("validateCreation", () => {
    it("should not throw for valid gov bot creation", () => {
      expect(() => govBot.validateCreation()).not.toThrow();
    });
  });

  describe("validateUpdate", () => {
    it("should not throw for valid gov bot update", () => {
      expect(() => govBot.validateUpdate()).not.toThrow();
    });
  });

  describe("government types", () => {
    it("should accept SECURITY government type", () => {
      const data = {
        ...validGovBotData,
        governmentType: GovernmentType.SECURITY,
      };

      const bot = new GovBot(data);
      expect(bot.validate()).toBe(true);
      expect(bot.governmentType).toBe(GovernmentType.SECURITY);
    });

    it("should accept ADMIN government type", () => {
      const data = {
        ...validGovBotData,
        governmentType: GovernmentType.ADMIN,
      };

      const bot = new GovBot(data);
      expect(bot.validate()).toBe(true);
      expect(bot.governmentType).toBe(GovernmentType.ADMIN);
    });

    it("should accept MAINTENANCE government type", () => {
      const data = {
        ...validGovBotData,
        governmentType: GovernmentType.MAINTENANCE,
      };

      const bot = new GovBot(data);
      expect(bot.validate()).toBe(true);
      expect(bot.governmentType).toBe(GovernmentType.MAINTENANCE);
    });
  });

  describe("inheritance from Bot class", () => {
    it("should inherit all Bot class methods", () => {
      expect(govBot.toJSON).toBeDefined();
      expect(govBot.serialize).toBeDefined();
      expect(govBot.clone).toBeDefined();
    });

    it("should be able to serialize gov bot data", () => {
      const json = govBot.toJSON();
      
      expect(json.id).toBe("govbot-1");
      expect(json.botType).toBe(BotType.GOVBOT);
      expect(json.governmentType).toBe(GovernmentType.SECURITY);
      expect(json.combatRole).toBe(CombatRole.ASSAULT);
      expect(json.utilitySpec).toBeNull();
      expect(json.userId).toBeNull();
    });

    it("should be able to clone gov bot", () => {
      const cloned = govBot.clone();
      
      expect(cloned.id).toBe(govBot.id);
      expect(cloned.botType).toBe(govBot.botType);
      expect(cloned.governmentType).toBe(govBot.governmentType);
      expect(cloned.combatRole).toBe(govBot.combatRole);
      expect(cloned).not.toBe(govBot); // Different instances
    });
  });

  describe("validation exceptions", () => {
    it("should throw error for validateCreation with missing required fields", () => {
      const invalidData: PrismaBot = {
        ...validGovBotData,
        name: "", // Invalid: empty name
      };

      const invalidBot = new GovBot(invalidData);
      expect(() => invalidBot.validateCreation()).toThrow();
    });

    it("should throw error for validateCreation with missing government type", () => {
      const invalidData: PrismaBot = {
        ...validGovBotData,
        governmentType: null as any, // Invalid: gov bots need government type
      };

      const invalidBot = new GovBot(invalidData);
      expect(() => invalidBot.validateCreation()).toThrow();
    });

    it("should throw error for validateCreation with missing soul chip", () => {
      const invalidData: PrismaBot = {
        ...validGovBotData,
        soulChipId: "", // Invalid: empty soul chip ID
      };

      const invalidBot = new GovBot(invalidData);
      expect(() => invalidBot.validateCreation()).toThrow();
    });

    it("should throw error for validateUpdate with missing ID", () => {
      const invalidData: PrismaBot = {
        ...validGovBotData,
        id: "", // Invalid: empty ID for update
      };

      const invalidBot = new GovBot(invalidData);
      expect(() => invalidBot.validateUpdate()).toThrow();
    });

    it("should throw error for validateCreation with missing skeleton ID", () => {
      const invalidData: PrismaBot = {
        ...validGovBotData,
        skeletonId: "", // Invalid: empty skeleton ID
      };

      const invalidBot = new GovBot(invalidData);
      expect(() => invalidBot.validateCreation()).toThrow();
    });

    it("should throw error for validateCreation with missing combat role", () => {
      const invalidData: PrismaBot = {
        ...validGovBotData,
        combatRole: null as any, // Invalid: gov bots need combat role
      };

      const invalidBot = new GovBot(invalidData);
      expect(() => invalidBot.validateCreation()).toThrow();
    });

    it("should throw error for validateCreation with name too long", () => {
      const invalidData: PrismaBot = {
        ...validGovBotData,
        name: "A".repeat(101), // Invalid: name too long (max 100 chars)
      };

      const invalidBot = new GovBot(invalidData);
      expect(() => invalidBot.validateCreation()).toThrow();
    });

    it("should throw error for validateUpdate with name too long", () => {
      const invalidData: PrismaBot = {
        ...validGovBotData,
        name: "B".repeat(101), // Invalid: name too long (max 100 chars)
      };

      const invalidBot = new GovBot(invalidData);
      expect(() => invalidBot.validateUpdate()).toThrow();
    });

    it("should throw error for validateCreation with invalid government type", () => {
      const invalidData: PrismaBot = {
        ...validGovBotData,
        governmentType: "INVALID_TYPE" as any, // Invalid: not a valid government type
      };

      const invalidBot = new GovBot(invalidData);
      expect(() => invalidBot.validateCreation()).toThrow();
    });

    it("should throw error for validateCreation with invalid combat role", () => {
      const invalidData: PrismaBot = {
        ...validGovBotData,
        combatRole: "INVALID_ROLE" as any, // Invalid: not a valid combat role
      };

      const invalidBot = new GovBot(invalidData);
      expect(() => invalidBot.validateCreation()).toThrow();
    });
  });
});
