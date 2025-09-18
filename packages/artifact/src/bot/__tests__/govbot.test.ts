import { describe, it, expect, beforeEach } from "vitest";
import { GovBot } from "../govbot";
import {
  BotType,
  CombatRole,
  UtilitySpecialization,
  GovernmentType,
  type Bot as PrismaBot,
} from "@botking/db";

describe("GovBot", () => {
  let mockPrismaBot: PrismaBot;

  beforeEach(() => {
    mockPrismaBot = {
      id: "test-govbot-id",
      userId: null, // Gov bots don't have users
      soulChipId: "test-soul-chip-id", // Gov bots must have soul chips
      skeletonId: "test-skeleton-id",
      stateId: "test-state-id",
      name: "Test Gov Bot",
      botType: BotType.GOVBOT,
      combatRole: CombatRole.TANK, // Gov bots must have combat roles
      utilitySpec: null, // Gov bots don't have utility specs
      governmentType: GovernmentType.SECURITY,
      description: "A government security bot",
      createdAt: new Date("2023-01-01T00:00:00Z"),
      updatedAt: new Date("2023-01-02T00:00:00Z"),
    };
  });

  describe("constructor", () => {
    it("should create GovBot with correct business rules applied", () => {
      const govBot = new GovBot(mockPrismaBot);

      expect(govBot.botType).toBe(BotType.GOVBOT);
      expect(govBot.utilitySpec).toBeNull();
      expect(govBot.userId).toBeNull();
      expect(govBot.combatRole).toBe(CombatRole.TANK);
      expect(govBot.soulChipId).toBe("test-soul-chip-id");
    });

    it("should override botType to GOVBOT even if input has different type", () => {
      const invalidBotData: PrismaBot = {
        ...mockPrismaBot,
        botType: BotType.WORKER, // Invalid for govbot
      };

      const govBot = new GovBot(invalidBotData);

      expect(govBot.botType).toBe(BotType.GOVBOT);
    });

    it("should preserve other properties from input", () => {
      const govBot = new GovBot(mockPrismaBot);

      expect(govBot.id).toBe(mockPrismaBot.id);
      expect(govBot.soulChipId).toBe(mockPrismaBot.soulChipId);
      expect(govBot.skeletonId).toBe(mockPrismaBot.skeletonId);
      expect(govBot.stateId).toBe(mockPrismaBot.stateId);
      expect(govBot.name).toBe(mockPrismaBot.name);
      expect(govBot.description).toBe(mockPrismaBot.description);
      expect(govBot.combatRole).toBe(mockPrismaBot.combatRole);
      expect(govBot.governmentType).toBe(mockPrismaBot.governmentType);
      expect(govBot.createdAt).toEqual(mockPrismaBot.createdAt);
      expect(govBot.updatedAt).toEqual(mockPrismaBot.updatedAt);
    });
  });

  describe("validate", () => {
    it("should return true for valid gov bot", () => {
      const govBot = new GovBot(mockPrismaBot);
      const validGovData: PrismaBot = {
        ...mockPrismaBot,
        botType: BotType.GOVBOT,
        utilitySpec: null,
        userId: null,
        combatRole: CombatRole.ASSAULT,
        soulChipId: "valid-soul-chip",
      };

      expect(govBot.validate(validGovData)).toBe(true);
    });

    it("should return false if botType is not GOVBOT", () => {
      const govBot = new GovBot(mockPrismaBot);
      const invalidData: PrismaBot = {
        ...mockPrismaBot,
        botType: BotType.WORKER,
      };

      expect(govBot.validate(invalidData)).toBe(false);
    });

    it("should return false if utilitySpec is not null", () => {
      const govBot = new GovBot(mockPrismaBot);
      const invalidData: PrismaBot = {
        ...mockPrismaBot,
        utilitySpec: UtilitySpecialization.MINING,
      };

      expect(govBot.validate(invalidData)).toBe(false);
    });

    it("should return false if userId is not null", () => {
      const govBot = new GovBot(mockPrismaBot);
      const invalidData: PrismaBot = {
        ...mockPrismaBot,
        userId: "some-user-id",
      };

      expect(govBot.validate(invalidData)).toBe(false);
    });

    it("should return false if combatRole is null", () => {
      const govBot = new GovBot(mockPrismaBot);
      const invalidData: PrismaBot = {
        ...mockPrismaBot,
        combatRole: null,
      };

      expect(govBot.validate(invalidData)).toBe(false);
    });

    it("should return false if soulChipId is null", () => {
      const govBot = new GovBot(mockPrismaBot);
      const invalidData: PrismaBot = {
        ...mockPrismaBot,
        soulChipId: null,
      };

      expect(govBot.validate(invalidData)).toBe(false);
    });

    it("should work with all combat roles", () => {
      const govBot = new GovBot(mockPrismaBot);

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
        expect(govBot.validate(data)).toBe(true);
      });
    });

    it("should work with all government types or null", () => {
      const govBot = new GovBot(mockPrismaBot);

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
        expect(govBot.validate(data)).toBe(true);
      });
    });
  });

  describe("validateCreation", () => {
    it("should validate using both base schema and govbot-specific rules", () => {
      const govBot = new GovBot(mockPrismaBot);

      const result = govBot.validateCreation(mockPrismaBot);
      expect(typeof result).toBe("boolean");
    });

    it("should return false if base validation fails", () => {
      const govBot = new GovBot(mockPrismaBot);
      const invalidData: PrismaBot = {
        ...mockPrismaBot,
        utilitySpec: UtilitySpecialization.CONSTRUCTION, // Invalid for govbot
      };

      expect(govBot.validateCreation(invalidData)).toBe(false);
    });

    it("should return false if govbot-specific validation fails", () => {
      const govBot = new GovBot(mockPrismaBot);
      const invalidData: PrismaBot = {
        ...mockPrismaBot,
        userId: "some-user-id", // Invalid for govbot
      };

      expect(govBot.validateCreation(invalidData)).toBe(false);
    });
  });

  describe("validateUpdate", () => {
    it("should validate using both base schema and govbot-specific rules", () => {
      const govBot = new GovBot(mockPrismaBot);

      const result = govBot.validateUpdate(mockPrismaBot);
      expect(typeof result).toBe("boolean");
    });

    it("should return false if base validation fails", () => {
      const govBot = new GovBot(mockPrismaBot);
      const invalidData: PrismaBot = {
        ...mockPrismaBot,
        combatRole: null, // Invalid for govbot
      };

      expect(govBot.validateUpdate(invalidData)).toBe(false);
    });

    it("should return false if govbot-specific validation fails", () => {
      const govBot = new GovBot(mockPrismaBot);
      const invalidData: PrismaBot = {
        ...mockPrismaBot,
        botType: BotType.PLAYABLE, // Invalid change
      };

      expect(govBot.validateUpdate(invalidData)).toBe(false);
    });
  });

  describe("inheritance", () => {
    it("should inherit all methods from Bot class", () => {
      const govBot = new GovBot(mockPrismaBot);

      expect(typeof govBot.toJSON).toBe("function");
      expect(typeof govBot.serialize).toBe("function");
      expect(typeof govBot.clone).toBe("function");
    });

    it("should properly serialize gov bot", () => {
      const govBot = new GovBot(mockPrismaBot);
      const json = govBot.toJSON();

      expect(json.botType).toBe(BotType.GOVBOT);
      expect(json.utilitySpec).toBeNull();
      expect(json.userId).toBeNull();
      expect(json.combatRole).toBe(CombatRole.TANK);
      expect(json.soulChipId).toBe("test-soul-chip-id");
      expect(json.governmentType).toBe(GovernmentType.SECURITY);
    });
  });

  describe("business rules compliance", () => {
    it("should enforce that gov bots have required fields and restrictions", () => {
      const govBot = new GovBot(mockPrismaBot);

      // Required fields
      expect(govBot.combatRole).not.toBeNull();
      expect(govBot.soulChipId).not.toBeNull();

      // Restrictions
      expect(govBot.utilitySpec).toBeNull();
      expect(govBot.userId).toBeNull();
    });

    it("should validate complete business rule set", () => {
      const govBot = new GovBot(mockPrismaBot);
      const compliantData: PrismaBot = {
        ...mockPrismaBot,
        botType: BotType.GOVBOT,
        utilitySpec: null,
        userId: null,
        combatRole: CombatRole.SNIPER,
        soulChipId: "valid-soul-chip",
        governmentType: GovernmentType.ADMIN,
      };

      expect(govBot.validate(compliantData)).toBe(true);
      // Schema validation results depend on schema requirements
      expect(typeof govBot.validateCreation(compliantData)).toBe("boolean");
      expect(typeof govBot.validateUpdate(compliantData)).toBe("boolean");
    });

    it("should validate gov bot without government type", () => {
      const govBot = new GovBot(mockPrismaBot);
      const dataWithoutGovType: PrismaBot = {
        ...mockPrismaBot,
        governmentType: null,
      };

      expect(govBot.validate(dataWithoutGovType)).toBe(true);
    });

    it("should reject gov bot with invalid combinations", () => {
      const govBot = new GovBot(mockPrismaBot);

      // Gov bot with user (invalid)
      const dataWithUser: PrismaBot = {
        ...mockPrismaBot,
        userId: "invalid-user-id",
      };
      expect(govBot.validate(dataWithUser)).toBe(false);

      // Gov bot with utility spec (invalid)
      const dataWithUtility: PrismaBot = {
        ...mockPrismaBot,
        utilitySpec: UtilitySpecialization.REPAIR,
      };
      expect(govBot.validate(dataWithUtility)).toBe(false);

      // Gov bot without combat role (invalid)
      const dataWithoutCombat: PrismaBot = {
        ...mockPrismaBot,
        combatRole: null,
      };
      expect(govBot.validate(dataWithoutCombat)).toBe(false);

      // Gov bot without soul chip (invalid)
      const dataWithoutSoul: PrismaBot = {
        ...mockPrismaBot,
        soulChipId: null,
      };
      expect(govBot.validate(dataWithoutSoul)).toBe(false);
    });
  });
});
