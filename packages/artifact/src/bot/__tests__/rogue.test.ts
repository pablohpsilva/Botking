import { describe, it, expect, beforeEach } from "vitest";
import { BotType, CombatRole, type Bot as PrismaBot } from "@botking/db";
import { RogueBot } from "../rogue";

describe("RogueBot", () => {
  let validRogueBotData: PrismaBot;
  let rogueBot: RogueBot;

  beforeEach(() => {
    validRogueBotData = {
      id: "rogue-bot-1",
      userId: "rogue-user-1",
      soulChipId: "stealth-soul-chip-1", // Rogue bots have specialized soul chips
      skeletonId: "stealth-skeleton-1",
      stateId: "state-1",
      name: "Shadow Rogue Bot",
      botType: BotType.ROGUE,
      combatRole: CombatRole.SCOUT, // Rogue bots typically have scout roles
      utilitySpec: null, // Rogue bots don't have utility specs
      governmentType: null,
      description: "Stealth and infiltration specialist bot",
      createdAt: new Date("2023-01-01"),
      updatedAt: new Date("2023-01-01"),
    };

    rogueBot = new RogueBot(validRogueBotData);
  });

  describe("constructor", () => {
    it("should create a RogueBot instance with correct properties", () => {
      expect(rogueBot.id).toBe("rogue-bot-1");
      expect(rogueBot.name).toBe("Shadow Rogue Bot");
      expect(rogueBot.botType).toBe(BotType.ROGUE);
      expect(rogueBot.combatRole).toBe(CombatRole.SCOUT);
      expect(rogueBot.soulChipId).toBe("stealth-soul-chip-1");
      expect(rogueBot.userId).toBe("rogue-user-1");
      expect(rogueBot.utilitySpec).toBeNull();
      expect(rogueBot.skeletonId).toBe("stealth-skeleton-1");
      expect(rogueBot.stateId).toBe("state-1");
    });

    it("should enforce business rules - no utility specialization", () => {
      const dataWithUtilitySpec = {
        ...validRogueBotData,
        utilitySpec: "MINING" as any,
      };

      const bot = new RogueBot(dataWithUtilitySpec);
      expect(bot.utilitySpec).toBeNull();
    });

    it("should enforce business rules - botType is always ROGUE", () => {
      const dataWithDifferentType = {
        ...validRogueBotData,
        botType: BotType.GOVBOT,
      };

      const bot = new RogueBot(dataWithDifferentType);
      expect(bot.botType).toBe(BotType.ROGUE);
    });
  });

  describe("validate", () => {
    it("should validate a valid rogue bot instance", () => {
      expect(rogueBot.validate()).toBe(true);
    });
  });

  describe("validateCreation", () => {
    it("should not throw for valid rogue bot creation", () => {
      expect(() => rogueBot.validateCreation()).not.toThrow();
    });
  });

  describe("validateUpdate", () => {
    it("should not throw for valid rogue bot update", () => {
      expect(() => rogueBot.validateUpdate()).not.toThrow();
    });
  });

  describe("combat roles", () => {
    it("should accept SCOUT combat role", () => {
      const data = {
        ...validRogueBotData,
        combatRole: CombatRole.SCOUT,
      };

      const bot = new RogueBot(data);
      expect(bot.validate()).toBe(true);
      expect(bot.combatRole).toBe(CombatRole.SCOUT);
    });

    it("should accept SNIPER combat role", () => {
      const data = {
        ...validRogueBotData,
        combatRole: CombatRole.SNIPER,
      };

      const bot = new RogueBot(data);
      expect(bot.validate()).toBe(true);
      expect(bot.combatRole).toBe(CombatRole.SNIPER);
    });

    it("should accept ASSAULT combat role", () => {
      const data = {
        ...validRogueBotData,
        combatRole: CombatRole.ASSAULT,
      };

      const bot = new RogueBot(data);
      expect(bot.validate()).toBe(true);
      expect(bot.combatRole).toBe(CombatRole.ASSAULT);
    });

    it("should accept TANK combat role", () => {
      const data = {
        ...validRogueBotData,
        combatRole: CombatRole.TANK,
      };

      const bot = new RogueBot(data);
      expect(bot.validate()).toBe(true);
      expect(bot.combatRole).toBe(CombatRole.TANK);
    });
  });

  describe("inheritance from Bot class", () => {
    it("should inherit all Bot class methods", () => {
      expect(rogueBot.toJSON).toBeDefined();
      expect(rogueBot.serialize).toBeDefined();
      expect(rogueBot.clone).toBeDefined();
    });

    it("should be able to serialize rogue bot data", () => {
      const json = rogueBot.toJSON();

      expect(json.id).toBe("rogue-bot-1");
      expect(json.botType).toBe(BotType.ROGUE);
      expect(json.combatRole).toBe(CombatRole.SCOUT);
      expect(json.utilitySpec).toBeNull();
      expect(json.soulChipId).toBe("stealth-soul-chip-1");
    });

    it("should be able to clone rogue bot", () => {
      const cloned = rogueBot.clone();

      expect(cloned.id).toBe(rogueBot.id);
      expect(cloned.botType).toBe(rogueBot.botType);
      expect(cloned.combatRole).toBe(rogueBot.combatRole);
      expect(cloned.soulChipId).toBe(rogueBot.soulChipId);
      expect(cloned).not.toBe(rogueBot); // Different instances
    });
  });

  describe("validation exceptions", () => {
    it("should throw error for validateCreation with missing required fields", () => {
      const invalidData: PrismaBot = {
        ...validRogueBotData,
        name: "", // Invalid: empty name
      };

      const invalidBot = new RogueBot(invalidData);
      expect(() => invalidBot.validateCreation()).toThrow();
    });

    it("should throw error for validateCreation with missing soul chip", () => {
      const invalidData: PrismaBot = {
        ...validRogueBotData,
        soulChipId: "", // Invalid: empty soul chip ID
      };

      const invalidBot = new RogueBot(invalidData);
      expect(() => invalidBot.validateCreation()).toThrow();
    });

    it("should throw error for validateUpdate with missing ID", () => {
      const invalidData: PrismaBot = {
        ...validRogueBotData,
        id: "", // Invalid: empty ID for update
      };

      const invalidBot = new RogueBot(invalidData);
      expect(() => invalidBot.validateUpdate()).toThrow();
    });

    it("should throw error for validateCreation with missing skeleton ID", () => {
      const invalidData: PrismaBot = {
        ...validRogueBotData,
        skeletonId: "", // Invalid: empty skeleton ID
      };

      const invalidBot = new RogueBot(invalidData);
      expect(() => invalidBot.validateCreation()).toThrow();
    });

    it("should throw error for validateCreation with missing combat role", () => {
      const invalidData: PrismaBot = {
        ...validRogueBotData,
        combatRole: null as any, // Invalid: rogue bots need combat role
      };

      const invalidBot = new RogueBot(invalidData);
      expect(() => invalidBot.validateCreation()).toThrow();
    });

    it("should throw error for validateCreation with name too long", () => {
      const invalidData: PrismaBot = {
        ...validRogueBotData,
        name: "A".repeat(101), // Invalid: name too long (max 100 chars)
      };

      const invalidBot = new RogueBot(invalidData);
      expect(() => invalidBot.validateCreation()).toThrow();
    });

    it("should throw error for validateUpdate with name too long", () => {
      const invalidData: PrismaBot = {
        ...validRogueBotData,
        name: "B".repeat(101), // Invalid: name too long (max 100 chars)
      };

      const invalidBot = new RogueBot(invalidData);
      expect(() => invalidBot.validateUpdate()).toThrow();
    });

    it("should throw error for validateCreation with invalid combat role", () => {
      const invalidData: PrismaBot = {
        ...validRogueBotData,
        combatRole: "INVALID_ROLE" as any, // Invalid: not a valid combat role
      };

      const invalidBot = new RogueBot(invalidData);
      expect(() => invalidBot.validateCreation()).toThrow();
    });

    it("should throw error for validateCreation with missing user ID when required", () => {
      const invalidData: PrismaBot = {
        ...validRogueBotData,
        userId: "", // Invalid: empty user ID
      };

      const invalidBot = new RogueBot(invalidData);
      expect(() => invalidBot.validateCreation()).toThrow();
    });

    it("should throw error for validateCreation when user ID is null but required", () => {
      const invalidData: PrismaBot = {
        ...validRogueBotData,
        userId: null as any, // Invalid: rogue bots may require user ID
      };

      const invalidBot = new RogueBot(invalidData);
      expect(() => invalidBot.validateCreation()).toThrow();
    });
  });

  describe("business rules enforcement", () => {
    it("should ensure rogue bots cannot have utility specialization", () => {
      const dataWithUtilitySpec = {
        ...validRogueBotData,
        utilitySpec: "CONSTRUCTION" as any,
      };

      const bot = new RogueBot(dataWithUtilitySpec);
      expect(bot.utilitySpec).toBeNull();
      expect(bot.validate()).toBe(true);
    });

    it("should ensure botType is always ROGUE", () => {
      const dataWithWrongType = {
        ...validRogueBotData,
        botType: BotType.WORKER,
      };

      const bot = new RogueBot(dataWithWrongType);
      expect(bot.botType).toBe(BotType.ROGUE);
      expect(bot.validate()).toBe(true);
    });

    it("should handle stealth capabilities", () => {
      const dataWithStealthChip = {
        ...validRogueBotData,
        soulChipId: "advanced-stealth-chip",
      };

      const bot = new RogueBot(dataWithStealthChip);
      expect(bot.soulChipId).toBe("advanced-stealth-chip");
      expect(bot.validate()).toBe(true);
    });

    it("should handle combat roles for rogue bots", () => {
      const dataWithCombatRole = {
        ...validRogueBotData,
        combatRole: CombatRole.SNIPER,
      };

      const bot = new RogueBot(dataWithCombatRole);
      expect(bot.combatRole).toBe(CombatRole.SNIPER);
      expect(bot.validate()).toBe(true);
    });

    it("should handle user ownership for rogue bots", () => {
      const dataWithUser = {
        ...validRogueBotData,
        userId: "shadow-master",
      };

      const bot = new RogueBot(dataWithUser);
      expect(bot.userId).toBe("shadow-master");
      expect(bot.validate()).toBe(true);
    });
  });

  describe("stealth and infiltration capabilities", () => {
    it("should create scout-type rogue bot", () => {
      const scoutData = {
        ...validRogueBotData,
        name: "Scout Infiltrator",
        combatRole: CombatRole.SCOUT,
        description: "Advanced reconnaissance and infiltration",
      };

      const scoutBot = new RogueBot(scoutData);
      expect(scoutBot.validate()).toBe(true);
      expect(scoutBot.combatRole).toBe(CombatRole.SCOUT);
    });

    it("should create sniper-type rogue bot", () => {
      const sniperData = {
        ...validRogueBotData,
        name: "Shadow Sniper",
        combatRole: CombatRole.SNIPER,
        description: "Long-range elimination specialist",
      };

      const sniperBot = new RogueBot(sniperData);
      expect(sniperBot.validate()).toBe(true);
      expect(sniperBot.combatRole).toBe(CombatRole.SNIPER);
    });
  });
});
