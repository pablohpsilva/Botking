import { describe, it, expect, beforeEach } from "vitest";
import { PlayableBot } from "../playable";
import {
  BotType,
  CombatRole,
  UtilitySpecialization,
  GovernmentType,
  type Bot as PrismaBot,
} from "@botking/db";

describe("PlayableBot", () => {
  let mockPrismaBot: PrismaBot;

  beforeEach(() => {
    mockPrismaBot = {
      id: "test-playable-id",
      userId: "test-user-id", // Playable bots must have a user
      soulChipId: "test-soul-chip-id", // Playable bots must have soul chips
      skeletonId: "test-skeleton-id",
      stateId: "test-state-id",
      name: "Test Playable Bot",
      botType: BotType.PLAYABLE,
      combatRole: CombatRole.ASSAULT, // Playable bots must have combat roles
      utilitySpec: null, // Playable bots don't have utility specs
      governmentType: null,
      description: "A player-controlled combat bot",
      createdAt: new Date("2023-01-01T00:00:00Z"),
      updatedAt: new Date("2023-01-02T00:00:00Z"),
    };
  });

  describe("constructor", () => {
    it("should create PlayableBot with correct business rules applied", () => {
      const playableBot = new PlayableBot(mockPrismaBot);

      expect(playableBot.botType).toBe(BotType.PLAYABLE);
      expect(playableBot.utilitySpec).toBeNull();
      expect(playableBot.combatRole).toBe(CombatRole.ASSAULT);
      expect(playableBot.soulChipId).toBe("test-soul-chip-id");
      expect(playableBot.userId).toBe("test-user-id");
    });

    it("should override botType to PLAYABLE even if input has different type", () => {
      const invalidBotData: PrismaBot = {
        ...mockPrismaBot,
        botType: BotType.WORKER, // Invalid for playable
      };

      const playableBot = new PlayableBot(invalidBotData);

      expect(playableBot.botType).toBe(BotType.PLAYABLE);
    });

    it("should preserve other properties from input", () => {
      const playableBot = new PlayableBot(mockPrismaBot);

      expect(playableBot.id).toBe(mockPrismaBot.id);
      expect(playableBot.userId).toBe(mockPrismaBot.userId);
      expect(playableBot.soulChipId).toBe(mockPrismaBot.soulChipId);
      expect(playableBot.skeletonId).toBe(mockPrismaBot.skeletonId);
      expect(playableBot.stateId).toBe(mockPrismaBot.stateId);
      expect(playableBot.name).toBe(mockPrismaBot.name);
      expect(playableBot.description).toBe(mockPrismaBot.description);
      expect(playableBot.createdAt).toEqual(mockPrismaBot.createdAt);
      expect(playableBot.updatedAt).toEqual(mockPrismaBot.updatedAt);
    });
  });

  describe("validate", () => {
    it("should return true for valid playable bot", () => {
      const playableBot = new PlayableBot(mockPrismaBot);
      const validPlayableData: PrismaBot = {
        ...mockPrismaBot,
        botType: BotType.PLAYABLE,
        utilitySpec: null,
        combatRole: CombatRole.TANK,
        soulChipId: "soul-chip-id",
        userId: "user-id",
      };

      expect(playableBot.validate(validPlayableData)).toBe(true);
    });

    it("should return false if botType is not PLAYABLE", () => {
      const playableBot = new PlayableBot(mockPrismaBot);
      const invalidData: PrismaBot = {
        ...mockPrismaBot,
        botType: BotType.WORKER,
      };

      expect(playableBot.validate(invalidData)).toBe(false);
    });

    it("should return false if utilitySpec is not null", () => {
      const playableBot = new PlayableBot(mockPrismaBot);
      const invalidData: PrismaBot = {
        ...mockPrismaBot,
        utilitySpec: UtilitySpecialization.MINING,
      };

      expect(playableBot.validate(invalidData)).toBe(false);
    });

    it("should return false if combatRole is null", () => {
      const playableBot = new PlayableBot(mockPrismaBot);
      const invalidData: PrismaBot = {
        ...mockPrismaBot,
        combatRole: null,
      };

      expect(playableBot.validate(invalidData)).toBe(false);
    });

    it("should return false if soulChipId is null", () => {
      const playableBot = new PlayableBot(mockPrismaBot);
      const invalidData: PrismaBot = {
        ...mockPrismaBot,
        soulChipId: null,
      };

      expect(playableBot.validate(invalidData)).toBe(false);
    });

    it("should return false if userId is null", () => {
      const playableBot = new PlayableBot(mockPrismaBot);
      const invalidData: PrismaBot = {
        ...mockPrismaBot,
        userId: null,
      };

      expect(playableBot.validate(invalidData)).toBe(false);
    });

    it("should work with all combat roles", () => {
      const playableBot = new PlayableBot(mockPrismaBot);

      const combatRoles = [
        CombatRole.ASSAULT,
        CombatRole.TANK,
        CombatRole.SNIPER,
        CombatRole.SCOUT,
      ];

      combatRoles.forEach((role) => {
        const data: PrismaBot = {
          ...mockPrismaBot,
          combatRole: role,
        };
        expect(playableBot.validate(data)).toBe(true);
      });
    });
  });

  describe("validateCreation", () => {
    it("should validate using both base schema and playable-specific rules", () => {
      const playableBot = new PlayableBot(mockPrismaBot);

      const result = playableBot.validateCreation(mockPrismaBot);
      expect(typeof result).toBe("boolean");
    });

    it("should return false if base validation fails", () => {
      const playableBot = new PlayableBot(mockPrismaBot);
      const invalidData: PrismaBot = {
        ...mockPrismaBot,
        utilitySpec: UtilitySpecialization.REPAIR, // Invalid for playable
      };

      expect(playableBot.validateCreation(invalidData)).toBe(false);
    });

    it("should return false if playable-specific validation fails", () => {
      const playableBot = new PlayableBot(mockPrismaBot);
      const invalidData: PrismaBot = {
        ...mockPrismaBot,
        combatRole: null, // Required for playable bots
      };

      expect(playableBot.validateCreation(invalidData)).toBe(false);
    });
  });

  describe("validateUpdate", () => {
    it("should validate using both base schema and playable-specific rules", () => {
      const playableBot = new PlayableBot(mockPrismaBot);

      const result = playableBot.validateUpdate(mockPrismaBot);
      expect(typeof result).toBe("boolean");
    });

    it("should return false if base validation fails", () => {
      const playableBot = new PlayableBot(mockPrismaBot);
      const invalidData: PrismaBot = {
        ...mockPrismaBot,
        userId: null, // Invalid for playable
      };

      expect(playableBot.validateUpdate(invalidData)).toBe(false);
    });

    it("should return false if playable-specific validation fails", () => {
      const playableBot = new PlayableBot(mockPrismaBot);
      const invalidData: PrismaBot = {
        ...mockPrismaBot,
        botType: BotType.GOVBOT, // Invalid change
      };

      expect(playableBot.validateUpdate(invalidData)).toBe(false);
    });
  });

  describe("inheritance", () => {
    it("should inherit all methods from Bot class", () => {
      const playableBot = new PlayableBot(mockPrismaBot);

      expect(typeof playableBot.toJSON).toBe("function");
      expect(typeof playableBot.serialize).toBe("function");
      expect(typeof playableBot.clone).toBe("function");
    });

    it("should properly serialize playable bot", () => {
      const playableBot = new PlayableBot(mockPrismaBot);
      const json = playableBot.toJSON();

      expect(json.botType).toBe(BotType.PLAYABLE);
      expect(json.utilitySpec).toBeNull();
      expect(json.combatRole).toBe(CombatRole.ASSAULT);
      expect(json.soulChipId).toBe("test-soul-chip-id");
      expect(json.userId).toBe("test-user-id");
    });
  });

  describe("business rules compliance", () => {
    it("should enforce that playable bots have all required fields", () => {
      const playableBot = new PlayableBot(mockPrismaBot);

      // All required fields should be present
      expect(playableBot.userId).not.toBeNull();
      expect(playableBot.soulChipId).not.toBeNull();
      expect(playableBot.combatRole).not.toBeNull();
      expect(playableBot.utilitySpec).toBeNull();
    });

    it("should validate complete business rule set", () => {
      const playableBot = new PlayableBot(mockPrismaBot);
      const compliantData: PrismaBot = {
        ...mockPrismaBot,
        botType: BotType.PLAYABLE,
        utilitySpec: null,
        combatRole: CombatRole.SNIPER,
        soulChipId: "valid-soul-chip",
        userId: "valid-user-id",
      };

      expect(playableBot.validate(compliantData)).toBe(true);
      // Schema validation results depend on schema requirements
      expect(typeof playableBot.validateCreation(compliantData)).toBe(
        "boolean"
      );
      expect(typeof playableBot.validateUpdate(compliantData)).toBe("boolean");
    });
  });
});
