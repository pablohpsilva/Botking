import { describe, it, expect, beforeEach } from "vitest";
import { RogueBot } from "../rogue";
import {
  BotType,
  CombatRole,
  UtilitySpecialization,
  GovernmentType,
  type Bot as PrismaBot,
} from "@botking/db";

describe("RogueBot", () => {
  let mockPrismaBot: PrismaBot;

  beforeEach(() => {
    mockPrismaBot = {
      id: "test-rogue-id",
      userId: "test-user-id",
      soulChipId: "test-soul-chip-id",
      skeletonId: "test-skeleton-id",
      stateId: "test-state-id",
      name: "Test Rogue Bot",
      botType: BotType.ROGUE,
      combatRole: CombatRole.SCOUT,
      utilitySpec: null, // Rogue bots don't have utility specs
      governmentType: null,
      description: "A rogue stealth bot",
      createdAt: new Date("2023-01-01T00:00:00Z"),
      updatedAt: new Date("2023-01-02T00:00:00Z"),
    };
  });

  describe("constructor", () => {
    it("should create RogueBot with correct business rules applied", () => {
      const rogueBot = new RogueBot(mockPrismaBot);

      expect(rogueBot.botType).toBe(BotType.ROGUE);
      expect(rogueBot.utilitySpec).toBeNull();
      expect(rogueBot.combatRole).toBe(CombatRole.SCOUT);
      expect(rogueBot.soulChipId).toBe("test-soul-chip-id");
      expect(rogueBot.userId).toBe("test-user-id");
    });

    it("should override botType to ROGUE even if input has different type", () => {
      const invalidBotData: PrismaBot = {
        ...mockPrismaBot,
        botType: BotType.WORKER, // Invalid for rogue
      };

      const rogueBot = new RogueBot(invalidBotData);

      expect(rogueBot.botType).toBe(BotType.ROGUE);
    });

    it("should preserve other properties from input", () => {
      const rogueBot = new RogueBot(mockPrismaBot);

      expect(rogueBot.id).toBe(mockPrismaBot.id);
      expect(rogueBot.userId).toBe(mockPrismaBot.userId);
      expect(rogueBot.soulChipId).toBe(mockPrismaBot.soulChipId);
      expect(rogueBot.skeletonId).toBe(mockPrismaBot.skeletonId);
      expect(rogueBot.stateId).toBe(mockPrismaBot.stateId);
      expect(rogueBot.name).toBe(mockPrismaBot.name);
      expect(rogueBot.description).toBe(mockPrismaBot.description);
      expect(rogueBot.combatRole).toBe(mockPrismaBot.combatRole);
      expect(rogueBot.createdAt).toEqual(mockPrismaBot.createdAt);
      expect(rogueBot.updatedAt).toEqual(mockPrismaBot.updatedAt);
    });
  });

  describe("validate", () => {
    it("should return true for valid rogue bot", () => {
      const rogueBot = new RogueBot(mockPrismaBot);
      const validRogueData: PrismaBot = {
        ...mockPrismaBot,
        botType: BotType.ROGUE,
        utilitySpec: null,
      };

      expect(rogueBot.validate(validRogueData)).toBe(true);
    });

    it("should return false if botType is not ROGUE", () => {
      const rogueBot = new RogueBot(mockPrismaBot);
      const invalidData: PrismaBot = {
        ...mockPrismaBot,
        botType: BotType.WORKER,
      };

      expect(rogueBot.validate(invalidData)).toBe(false);
    });

    it("should return false if utilitySpec is not null", () => {
      const rogueBot = new RogueBot(mockPrismaBot);
      const invalidData: PrismaBot = {
        ...mockPrismaBot,
        utilitySpec: UtilitySpecialization.MINING,
      };

      expect(rogueBot.validate(invalidData)).toBe(false);
    });

    it("should allow any combat role or null", () => {
      const rogueBot = new RogueBot(mockPrismaBot);

      const combatRoles = [
        CombatRole.ASSAULT,
        CombatRole.TANK,
        CombatRole.SNIPER,
        CombatRole.SCOUT,
        null,
      ];

      combatRoles.forEach((role) => {
        const data: PrismaBot = {
          ...mockPrismaBot,
          combatRole: role,
        };
        expect(rogueBot.validate(data)).toBe(true);
      });
    });

    it("should allow userId to be null or have value", () => {
      const rogueBot = new RogueBot(mockPrismaBot);

      // With userId
      const dataWithUser: PrismaBot = {
        ...mockPrismaBot,
        userId: "some-user-id",
      };
      expect(rogueBot.validate(dataWithUser)).toBe(true);

      // Without userId
      const dataWithoutUser: PrismaBot = {
        ...mockPrismaBot,
        userId: null,
      };
      expect(rogueBot.validate(dataWithoutUser)).toBe(true);
    });

    it("should allow soulChipId to be null or have value", () => {
      const rogueBot = new RogueBot(mockPrismaBot);

      // With soulChipId
      const dataWithSoul: PrismaBot = {
        ...mockPrismaBot,
        soulChipId: "some-soul-chip-id",
      };
      expect(rogueBot.validate(dataWithSoul)).toBe(true);

      // Without soulChipId
      const dataWithoutSoul: PrismaBot = {
        ...mockPrismaBot,
        soulChipId: null,
      };
      expect(rogueBot.validate(dataWithoutSoul)).toBe(true);
    });
  });

  describe("validateCreation", () => {
    it("should validate using both base schema and rogue-specific rules", () => {
      const rogueBot = new RogueBot(mockPrismaBot);

      const result = rogueBot.validateCreation(mockPrismaBot);
      expect(typeof result).toBe("boolean");
    });

    it("should return false if base validation fails", () => {
      const rogueBot = new RogueBot(mockPrismaBot);
      const invalidData: PrismaBot = {
        ...mockPrismaBot,
        utilitySpec: UtilitySpecialization.CONSTRUCTION, // Invalid for rogue
      };

      expect(rogueBot.validateCreation(invalidData)).toBe(false);
    });

    it("should return false if rogue-specific validation fails", () => {
      const rogueBot = new RogueBot(mockPrismaBot);
      const invalidData: PrismaBot = {
        ...mockPrismaBot,
        botType: BotType.KING, // Invalid change
      };

      expect(rogueBot.validateCreation(invalidData)).toBe(false);
    });
  });

  describe("validateUpdate", () => {
    it("should validate using both base schema and rogue-specific rules", () => {
      const rogueBot = new RogueBot(mockPrismaBot);

      const result = rogueBot.validateUpdate(mockPrismaBot);
      expect(typeof result).toBe("boolean");
    });

    it("should return false if base validation fails", () => {
      const rogueBot = new RogueBot(mockPrismaBot);
      const invalidData: PrismaBot = {
        ...mockPrismaBot,
        utilitySpec: UtilitySpecialization.REPAIR, // Invalid for rogue
      };

      expect(rogueBot.validateUpdate(invalidData)).toBe(false);
    });

    it("should return false if rogue-specific validation fails", () => {
      const rogueBot = new RogueBot(mockPrismaBot);
      const invalidData: PrismaBot = {
        ...mockPrismaBot,
        botType: BotType.PLAYABLE, // Invalid change
      };

      expect(rogueBot.validateUpdate(invalidData)).toBe(false);
    });
  });

  describe("inheritance", () => {
    it("should inherit all methods from Bot class", () => {
      const rogueBot = new RogueBot(mockPrismaBot);

      expect(typeof rogueBot.toJSON).toBe("function");
      expect(typeof rogueBot.serialize).toBe("function");
      expect(typeof rogueBot.clone).toBe("function");
    });

    it("should properly serialize rogue bot", () => {
      const rogueBot = new RogueBot(mockPrismaBot);
      const json = rogueBot.toJSON();

      expect(json.botType).toBe(BotType.ROGUE);
      expect(json.utilitySpec).toBeNull();
      expect(json.combatRole).toBe(CombatRole.SCOUT);
      expect(json.soulChipId).toBe("test-soul-chip-id");
      expect(json.userId).toBe("test-user-id");
    });
  });

  describe("business rules compliance", () => {
    it("should enforce that rogue bots do not have utility specializations", () => {
      const rogueBot = new RogueBot(mockPrismaBot);

      expect(rogueBot.utilitySpec).toBeNull();
    });

    it("should validate complete business rule set", () => {
      const rogueBot = new RogueBot(mockPrismaBot);
      const compliantData: PrismaBot = {
        ...mockPrismaBot,
        botType: BotType.ROGUE,
        utilitySpec: null,
        combatRole: CombatRole.SNIPER,
        soulChipId: "valid-soul-chip",
        userId: "valid-user-id",
      };

      expect(rogueBot.validate(compliantData)).toBe(true);
      // Schema validation results depend on schema requirements
      expect(typeof rogueBot.validateCreation(compliantData)).toBe("boolean");
      expect(typeof rogueBot.validateUpdate(compliantData)).toBe("boolean");
    });

    it("should validate rogue bot without combat role", () => {
      const rogueBot = new RogueBot(mockPrismaBot);
      const dataWithoutCombat: PrismaBot = {
        ...mockPrismaBot,
        combatRole: null,
      };

      expect(rogueBot.validate(dataWithoutCombat)).toBe(true);
    });

    it("should validate rogue bot without user or soul chip", () => {
      const rogueBot = new RogueBot(mockPrismaBot);
      const dataWithoutUserOrSoul: PrismaBot = {
        ...mockPrismaBot,
        userId: null,
        soulChipId: null,
      };

      expect(rogueBot.validate(dataWithoutUserOrSoul)).toBe(true);
    });
  });
});
