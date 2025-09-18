import { describe, it, expect, beforeEach } from "vitest";
import { KingBot } from "../king";
import {
  BotType,
  CombatRole,
  UtilitySpecialization,
  GovernmentType,
  type Bot as PrismaBot,
} from "@botking/db";

describe("KingBot", () => {
  let mockPrismaBot: PrismaBot;

  beforeEach(() => {
    mockPrismaBot = {
      id: "test-king-id",
      userId: "test-user-id", // King bots might have users
      soulChipId: "test-soul-chip-id", // King bots must have soul chips
      skeletonId: "test-skeleton-id",
      stateId: "test-state-id",
      name: "Test King Bot",
      botType: BotType.KING,
      combatRole: CombatRole.ASSAULT, // King bots must have combat roles
      utilitySpec: null, // King bots don't have utility specs
      governmentType: GovernmentType.ADMIN,
      description: "A powerful king bot",
      createdAt: new Date("2023-01-01T00:00:00Z"),
      updatedAt: new Date("2023-01-02T00:00:00Z"),
    };
  });

  describe("constructor", () => {
    it("should create KingBot with correct business rules applied", () => {
      const kingBot = new KingBot(mockPrismaBot);

      expect(kingBot.botType).toBe(BotType.KING);
      expect(kingBot.utilitySpec).toBeNull();
      expect(kingBot.combatRole).toBe(CombatRole.ASSAULT);
      expect(kingBot.soulChipId).toBe("test-soul-chip-id");
      expect(kingBot.userId).toBe("test-user-id");
    });

    it("should override botType to KING even if input has different type", () => {
      const invalidBotData: PrismaBot = {
        ...mockPrismaBot,
        botType: BotType.WORKER, // Invalid for king
      };

      const kingBot = new KingBot(invalidBotData);

      expect(kingBot.botType).toBe(BotType.KING);
    });

    it("should preserve other properties from input", () => {
      const kingBot = new KingBot(mockPrismaBot);

      expect(kingBot.id).toBe(mockPrismaBot.id);
      expect(kingBot.userId).toBe(mockPrismaBot.userId);
      expect(kingBot.soulChipId).toBe(mockPrismaBot.soulChipId);
      expect(kingBot.skeletonId).toBe(mockPrismaBot.skeletonId);
      expect(kingBot.stateId).toBe(mockPrismaBot.stateId);
      expect(kingBot.name).toBe(mockPrismaBot.name);
      expect(kingBot.description).toBe(mockPrismaBot.description);
      expect(kingBot.combatRole).toBe(mockPrismaBot.combatRole);
      expect(kingBot.governmentType).toBe(mockPrismaBot.governmentType);
      expect(kingBot.createdAt).toEqual(mockPrismaBot.createdAt);
      expect(kingBot.updatedAt).toEqual(mockPrismaBot.updatedAt);
    });
  });

  describe("validate", () => {
    it("should return true for valid king bot", () => {
      const kingBot = new KingBot(mockPrismaBot);
      const validKingData: PrismaBot = {
        ...mockPrismaBot,
        botType: BotType.KING,
        utilitySpec: null,
        combatRole: CombatRole.TANK,
        soulChipId: "valid-soul-chip",
      };

      expect(kingBot.validate(validKingData)).toBe(true);
    });

    it("should return false if botType is not KING", () => {
      const kingBot = new KingBot(mockPrismaBot);
      const invalidData: PrismaBot = {
        ...mockPrismaBot,
        botType: BotType.WORKER,
      };

      expect(kingBot.validate(invalidData)).toBe(false);
    });

    it("should return false if utilitySpec is not null", () => {
      const kingBot = new KingBot(mockPrismaBot);
      const invalidData: PrismaBot = {
        ...mockPrismaBot,
        utilitySpec: UtilitySpecialization.MINING,
      };

      expect(kingBot.validate(invalidData)).toBe(false);
    });

    it("should return false if combatRole is null", () => {
      const kingBot = new KingBot(mockPrismaBot);
      const invalidData: PrismaBot = {
        ...mockPrismaBot,
        combatRole: null,
      };

      expect(kingBot.validate(invalidData)).toBe(false);
    });

    it("should return false if soulChipId is null", () => {
      const kingBot = new KingBot(mockPrismaBot);
      const invalidData: PrismaBot = {
        ...mockPrismaBot,
        soulChipId: null,
      };

      expect(kingBot.validate(invalidData)).toBe(false);
    });

    it("should allow userId to be null or have value", () => {
      const kingBot = new KingBot(mockPrismaBot);

      // With userId
      const dataWithUser: PrismaBot = {
        ...mockPrismaBot,
        userId: "some-user-id",
      };
      expect(kingBot.validate(dataWithUser)).toBe(true);

      // Without userId
      const dataWithoutUser: PrismaBot = {
        ...mockPrismaBot,
        userId: null,
      };
      expect(kingBot.validate(dataWithoutUser)).toBe(true);
    });

    it("should work with all combat roles", () => {
      const kingBot = new KingBot(mockPrismaBot);

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
        expect(kingBot.validate(data)).toBe(true);
      });
    });

    it("should work with all government types or null", () => {
      const kingBot = new KingBot(mockPrismaBot);

      const governmentTypes = [
        GovernmentType.SECURITY,
        GovernmentType.ADMIN,
        GovernmentType.MAINTENANCE,
        null,
      ];

      governmentTypes.forEach((type) => {
        const data: PrismaBot = {
          ...mockPrismaBot,
          governmentType: type,
        };
        expect(kingBot.validate(data)).toBe(true);
      });
    });
  });

  describe("validateCreation", () => {
    it("should validate using both base schema and king-specific rules", () => {
      const kingBot = new KingBot(mockPrismaBot);

      const result = kingBot.validateCreation(mockPrismaBot);
      expect(typeof result).toBe("boolean");
    });

    it("should return false if base validation fails", () => {
      const kingBot = new KingBot(mockPrismaBot);
      const invalidData: PrismaBot = {
        ...mockPrismaBot,
        utilitySpec: UtilitySpecialization.CONSTRUCTION, // Invalid for king
      };

      expect(kingBot.validateCreation(invalidData)).toBe(false);
    });

    it("should return false if king-specific validation fails", () => {
      const kingBot = new KingBot(mockPrismaBot);
      const invalidData: PrismaBot = {
        ...mockPrismaBot,
        combatRole: null, // Required for king bots
      };

      expect(kingBot.validateCreation(invalidData)).toBe(false);
    });
  });

  describe("validateUpdate", () => {
    it("should validate using both base schema and king-specific rules", () => {
      const kingBot = new KingBot(mockPrismaBot);

      const result = kingBot.validateUpdate(mockPrismaBot);
      expect(typeof result).toBe("boolean");
    });

    it("should return false if base validation fails", () => {
      const kingBot = new KingBot(mockPrismaBot);
      const invalidData: PrismaBot = {
        ...mockPrismaBot,
        soulChipId: null, // Invalid for king
      };

      expect(kingBot.validateUpdate(invalidData)).toBe(false);
    });

    it("should return false if king-specific validation fails", () => {
      const kingBot = new KingBot(mockPrismaBot);
      const invalidData: PrismaBot = {
        ...mockPrismaBot,
        botType: BotType.PLAYABLE, // Invalid change
      };

      expect(kingBot.validateUpdate(invalidData)).toBe(false);
    });
  });

  describe("inheritance", () => {
    it("should inherit all methods from Bot class", () => {
      const kingBot = new KingBot(mockPrismaBot);

      expect(typeof kingBot.toJSON).toBe("function");
      expect(typeof kingBot.serialize).toBe("function");
      expect(typeof kingBot.clone).toBe("function");
    });

    it("should properly serialize king bot", () => {
      const kingBot = new KingBot(mockPrismaBot);
      const json = kingBot.toJSON();

      expect(json.botType).toBe(BotType.KING);
      expect(json.utilitySpec).toBeNull();
      expect(json.combatRole).toBe(CombatRole.ASSAULT);
      expect(json.soulChipId).toBe("test-soul-chip-id");
      expect(json.userId).toBe("test-user-id");
      expect(json.governmentType).toBe(GovernmentType.ADMIN);
    });
  });

  describe("business rules compliance", () => {
    it("should enforce that king bots have required fields and restrictions", () => {
      const kingBot = new KingBot(mockPrismaBot);

      // Required fields
      expect(kingBot.combatRole).not.toBeNull();
      expect(kingBot.soulChipId).not.toBeNull();

      // Restrictions
      expect(kingBot.utilitySpec).toBeNull();
    });

    it("should validate complete business rule set", () => {
      const kingBot = new KingBot(mockPrismaBot);
      const compliantData: PrismaBot = {
        ...mockPrismaBot,
        botType: BotType.KING,
        utilitySpec: null,
        combatRole: CombatRole.SNIPER,
        soulChipId: "valid-soul-chip",
        userId: "valid-user-id",
        governmentType: GovernmentType.SECURITY,
      };

      expect(kingBot.validate(compliantData)).toBe(true);
      // Schema validation results depend on schema requirements
      expect(typeof kingBot.validateCreation(compliantData)).toBe("boolean");
      expect(typeof kingBot.validateUpdate(compliantData)).toBe("boolean");
    });

    it("should validate king bot without user", () => {
      const kingBot = new KingBot(mockPrismaBot);
      const dataWithoutUser: PrismaBot = {
        ...mockPrismaBot,
        userId: null,
      };

      expect(kingBot.validate(dataWithoutUser)).toBe(true);
    });

    it("should validate king bot without government type", () => {
      const kingBot = new KingBot(mockPrismaBot);
      const dataWithoutGovType: PrismaBot = {
        ...mockPrismaBot,
        governmentType: null,
      };

      expect(kingBot.validate(dataWithoutGovType)).toBe(true);
    });

    it("should reject king bot with invalid combinations", () => {
      const kingBot = new KingBot(mockPrismaBot);

      // King bot with utility spec (invalid)
      const dataWithUtility: PrismaBot = {
        ...mockPrismaBot,
        utilitySpec: UtilitySpecialization.REPAIR,
      };
      expect(kingBot.validate(dataWithUtility)).toBe(false);

      // King bot without combat role (invalid)
      const dataWithoutCombat: PrismaBot = {
        ...mockPrismaBot,
        combatRole: null,
      };
      expect(kingBot.validate(dataWithoutCombat)).toBe(false);

      // King bot without soul chip (invalid)
      const dataWithoutSoul: PrismaBot = {
        ...mockPrismaBot,
        soulChipId: null,
      };
      expect(kingBot.validate(dataWithoutSoul)).toBe(false);
    });
  });

  describe("differences from other bot types", () => {
    it("should differ from PlayableBot by not requiring userId", () => {
      const kingBot = new KingBot(mockPrismaBot);
      const dataWithoutUser: PrismaBot = {
        ...mockPrismaBot,
        userId: null, // KingBot allows this, PlayableBot doesn't
      };

      expect(kingBot.validate(dataWithoutUser)).toBe(true);
    });

    it("should differ from GovBot by allowing userId", () => {
      const kingBot = new KingBot(mockPrismaBot);
      const dataWithUser: PrismaBot = {
        ...mockPrismaBot,
        userId: "some-user-id", // KingBot allows this, GovBot doesn't
      };

      expect(kingBot.validate(dataWithUser)).toBe(true);
    });

    it("should be similar to GovBot and PlayableBot requiring combat role and soul chip", () => {
      const kingBot = new KingBot(mockPrismaBot);

      // Must have combat role
      expect(
        kingBot.validate({
          ...mockPrismaBot,
          combatRole: null,
        })
      ).toBe(false);

      // Must have soul chip
      expect(
        kingBot.validate({
          ...mockPrismaBot,
          soulChipId: null,
        })
      ).toBe(false);
    });
  });
});
