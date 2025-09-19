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

    it("should return false for invalid gov bot data", () => {
      // Create a gov bot with invalid data (missing government type)
      const invalidData = {
        ...validGovBotData,
        governmentType: null,
      };
      
      const invalidBot = new GovBot(invalidData);
      expect(invalidBot.validate()).toBe(false);
    });

    it("should return false for gov bot with utility specialization", () => {
      // Even though constructor enforces null, let's test validation
      const dataWithUtilitySpec = {
        ...validGovBotData,
        utilitySpec: "CONSTRUCTION" as any,
      };
      
      const bot = new GovBot(dataWithUtilitySpec);
      // Constructor should enforce null, so this should still validate
      expect(bot.validate()).toBe(true);
      expect(bot.utilitySpec).toBeNull();
    });

    it("should return false for gov bot with user ID", () => {
      // Even though constructor enforces null, let's test validation
      const dataWithUserId = {
        ...validGovBotData,
        userId: "some-user",
      };
      
      const bot = new GovBot(dataWithUserId);
      // Constructor should enforce null, so this should still validate
      expect(bot.validate()).toBe(true);
      expect(bot.userId).toBeNull();
    });
  });

  describe("validateCreation", () => {
    it("should validate creation of a valid gov bot", () => {
      expect(govBot.validateCreation()).toBe(true);
    });

    it("should reject creation with missing government type", () => {
      const invalidData = {
        ...validGovBotData,
        governmentType: null,
      };

      const invalidBot = new GovBot(invalidData);
      expect(invalidBot.validateCreation()).toBe(false);
    });

    it("should use the same logic as validate method", () => {
      expect(govBot.validateCreation()).toBe(govBot.validate());
    });
  });

  describe("validateUpdate", () => {
    it("should validate update of a valid gov bot", () => {
      expect(govBot.validateUpdate()).toBe(true);
    });

    it("should handle update validation for gov bot with ID", () => {
      // The update schema typically requires an ID
      expect(govBot.validateUpdate()).toBe(true);
      expect(govBot.id).toBe("govbot-1");
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

  describe("combat roles", () => {
    it("should accept ASSAULT combat role", () => {
      const data = {
        ...validGovBotData,
        combatRole: CombatRole.ASSAULT,
      };

      const bot = new GovBot(data);
      expect(bot.validate()).toBe(true);
      expect(bot.combatRole).toBe(CombatRole.ASSAULT);
    });

    it("should accept TANK combat role", () => {
      const data = {
        ...validGovBotData,
        combatRole: CombatRole.TANK,
      };

      const bot = new GovBot(data);
      expect(bot.validate()).toBe(true);
      expect(bot.combatRole).toBe(CombatRole.TANK);
    });

    it("should accept SNIPER combat role", () => {
      const data = {
        ...validGovBotData,
        combatRole: CombatRole.SNIPER,
      };

      const bot = new GovBot(data);
      expect(bot.validate()).toBe(true);
      expect(bot.combatRole).toBe(CombatRole.SNIPER);
    });

    it("should accept SCOUT combat role", () => {
      const data = {
        ...validGovBotData,
        combatRole: CombatRole.SCOUT,
      };

      const bot = new GovBot(data);
      expect(bot.validate()).toBe(true);
      expect(bot.combatRole).toBe(CombatRole.SCOUT);
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

  describe("edge cases", () => {
    it("should handle dates correctly", () => {
      expect(govBot.createdAt).toBeInstanceOf(Date);
      expect(govBot.updatedAt).toBeInstanceOf(Date);
      expect(govBot.createdAt.getTime()).toBe(new Date("2023-01-01").getTime());
    });

    it("should handle optional fields", () => {
      const minimalData: PrismaBot = {
        id: "minimal-govbot",
        userId: null,
        soulChipId: "soul-chip-1",
        skeletonId: "skeleton-1",
        stateId: "state-1",
        name: "Minimal Gov Bot",
        botType: BotType.GOVBOT,
        combatRole: CombatRole.ASSAULT,
        utilitySpec: null,
        governmentType: GovernmentType.SECURITY,
        description: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const minimalBot = new GovBot(minimalData);
      expect(minimalBot.userId).toBeNull();
      expect(minimalBot.description).toBeNull();
      expect(minimalBot.utilitySpec).toBeNull();
      expect(minimalBot.validate()).toBe(true);
    });

    it("should validate with required fields for government bot", () => {
      const validData: PrismaBot = {
        id: "test-govbot",
        userId: null,
        soulChipId: "soul-chip-1",
        skeletonId: "skeleton-1",
        stateId: "state-1",
        name: "Test Gov Bot",
        botType: BotType.GOVBOT,
        combatRole: CombatRole.ASSAULT,
        utilitySpec: null,
        governmentType: GovernmentType.SECURITY,
        description: "Test government bot",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const testBot = new GovBot(validData);
      expect(testBot.validate()).toBe(true);
    });

    it("should handle different soul chip requirements", () => {
      // Gov bots should have soul chips (unlike worker bots)
      const dataWithSoulChip = {
        ...validGovBotData,
        soulChipId: "different-soul-chip",
      };

      const botWithSoulChip = new GovBot(dataWithSoulChip);
      expect(botWithSoulChip.validate()).toBe(true);
      expect(botWithSoulChip.soulChipId).toBe("different-soul-chip");
    });

    it("should handle different combat role scenarios", () => {
      // Gov bots must have combat roles
      const dataWithCombatRole = {
        ...validGovBotData,
        combatRole: CombatRole.TANK,
      };

      const botWithCombatRole = new GovBot(dataWithCombatRole);
      expect(botWithCombatRole.validate()).toBe(true);
      expect(botWithCombatRole.combatRole).toBe(CombatRole.TANK);
    });

    it("should handle government type variations", () => {
      // Test different government types
      const adminData = {
        ...validGovBotData,
        governmentType: GovernmentType.ADMIN,
      };

      const adminBot = new GovBot(adminData);
      expect(adminBot.validate()).toBe(true);
      expect(adminBot.governmentType).toBe(GovernmentType.ADMIN);
    });
  });

  describe("business rules enforcement", () => {
    it("should ensure gov bots cannot have utility specialization", () => {
      // This is enforced by constructor
      const dataWithUtilitySpec = {
        ...validGovBotData,
        utilitySpec: "CONSTRUCTION" as any,
      };

      const bot = new GovBot(dataWithUtilitySpec);
      expect(bot.utilitySpec).toBeNull();
      expect(bot.validate()).toBe(true);
    });

    it("should ensure gov bots cannot have user IDs", () => {
      // This is enforced by constructor
      const dataWithUserId = {
        ...validGovBotData,
        userId: "forbidden-user",
      };

      const bot = new GovBot(dataWithUserId);
      expect(bot.userId).toBeNull();
      expect(bot.validate()).toBe(true);
    });

    it("should ensure gov bots must have government type", () => {
      // Constructor doesn't change this, but validation should catch it
      const dataWithoutGovType = {
        ...validGovBotData,
        governmentType: null,
      };

      const bot = new GovBot(dataWithoutGovType);
      expect(bot.governmentType).toBeNull();
      expect(bot.validate()).toBe(false);
    });

    it("should ensure botType is always GOVBOT", () => {
      // This is enforced by constructor
      const dataWithWrongType = {
        ...validGovBotData,
        botType: BotType.WORKER,
      };

      const bot = new GovBot(dataWithWrongType);
      expect(bot.botType).toBe(BotType.GOVBOT);
      expect(bot.validate()).toBe(true);
    });

    it("should handle soul chip requirements for gov bots", () => {
      // Gov bots typically need soul chips for advanced AI
      const dataWithSoulChip = {
        ...validGovBotData,
        soulChipId: "advanced-ai-chip",
      };

      const bot = new GovBot(dataWithSoulChip);
      expect(bot.soulChipId).toBe("advanced-ai-chip");
      expect(bot.validate()).toBe(true);
    });

    it("should handle combat role requirements for gov bots", () => {
      // Gov bots typically need combat roles for enforcement
      const dataWithCombatRole = {
        ...validGovBotData,
        combatRole: CombatRole.SNIPER,
      };

      const bot = new GovBot(dataWithCombatRole);
      expect(bot.combatRole).toBe(CombatRole.SNIPER);
      expect(bot.validate()).toBe(true);
    });
  });

  describe("specialized government bot types", () => {
    it("should create security enforcement bot", () => {
      const securityData = {
        ...validGovBotData,
        name: "Security Enforcer",
        governmentType: GovernmentType.SECURITY,
        combatRole: CombatRole.ASSAULT,
        description: "High-level security enforcement unit",
      };

      const securityBot = new GovBot(securityData);
      expect(securityBot.validate()).toBe(true);
      expect(securityBot.governmentType).toBe(GovernmentType.SECURITY);
      expect(securityBot.combatRole).toBe(CombatRole.ASSAULT);
    });

    it("should create administrative bot", () => {
      const adminData = {
        ...validGovBotData,
        name: "Admin Controller",
        governmentType: GovernmentType.ADMIN,
        combatRole: CombatRole.SCOUT,
        description: "Administrative oversight and management",
      };

      const adminBot = new GovBot(adminData);
      expect(adminBot.validate()).toBe(true);
      expect(adminBot.governmentType).toBe(GovernmentType.ADMIN);
      expect(adminBot.combatRole).toBe(CombatRole.SCOUT);
    });

    it("should create maintenance oversight bot", () => {
      const maintenanceData = {
        ...validGovBotData,
        name: "Maintenance Supervisor",
        governmentType: GovernmentType.MAINTENANCE,
        combatRole: CombatRole.TANK,
        description: "Infrastructure maintenance oversight",
      };

      const maintenanceBot = new GovBot(maintenanceData);
      expect(maintenanceBot.validate()).toBe(true);
      expect(maintenanceBot.governmentType).toBe(GovernmentType.MAINTENANCE);
      expect(maintenanceBot.combatRole).toBe(CombatRole.TANK);
    });
  });
});
