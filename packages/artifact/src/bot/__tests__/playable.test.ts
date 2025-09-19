import { describe, it, expect, beforeEach } from "vitest";
import { BotType, CombatRole, type Bot as PrismaBot } from "@botking/db";
import { PlayableBot } from "../playable";

describe("PlayableBot", () => {
  let validPlayableBotData: PrismaBot;
  let playableBot: PlayableBot;

  beforeEach(() => {
    validPlayableBotData = {
      id: "playable-bot-1",
      userId: "player-user-1",
      soulChipId: "player-soul-chip-1", // Playable bots have soul chips
      skeletonId: "player-skeleton-1",
      stateId: "state-1",
      name: "Player Champion Bot",
      botType: BotType.PLAYABLE,
      combatRole: CombatRole.ASSAULT, // Playable bots have combat roles
      utilitySpec: null, // Playable bots don't have utility specs
      governmentType: null,
      description: "Player-controlled combat bot",
      createdAt: new Date("2023-01-01"),
      updatedAt: new Date("2023-01-01"),
    };

    playableBot = new PlayableBot(validPlayableBotData);
  });

  describe("constructor", () => {
    it("should create a PlayableBot instance with correct properties", () => {
      expect(playableBot.id).toBe("playable-bot-1");
      expect(playableBot.name).toBe("Player Champion Bot");
      expect(playableBot.botType).toBe(BotType.PLAYABLE);
      expect(playableBot.combatRole).toBe(CombatRole.ASSAULT);
      expect(playableBot.soulChipId).toBe("player-soul-chip-1");
      expect(playableBot.userId).toBe("player-user-1");
      expect(playableBot.utilitySpec).toBeNull();
      expect(playableBot.skeletonId).toBe("player-skeleton-1");
      expect(playableBot.stateId).toBe("state-1");
    });

    it("should enforce business rules - no utility specialization", () => {
      const dataWithUtilitySpec = {
        ...validPlayableBotData,
        utilitySpec: "REPAIR" as any,
      };

      const bot = new PlayableBot(dataWithUtilitySpec);
      expect(bot.utilitySpec).toBeNull();
    });

    it("should enforce business rules - botType is always PLAYABLE", () => {
      const dataWithDifferentType = {
        ...validPlayableBotData,
        botType: BotType.ROGUE,
      };

      const bot = new PlayableBot(dataWithDifferentType);
      expect(bot.botType).toBe(BotType.PLAYABLE);
    });
  });

  describe("validate", () => {
    it("should validate a valid playable bot instance", () => {
      expect(playableBot.validate()).toBe(true);
    });
  });

  describe("validateCreation", () => {
    it("should not throw for valid playable bot creation", () => {
      expect(() => playableBot.validateCreation()).not.toThrow();
    });
  });

  describe("validateUpdate", () => {
    it("should not throw for valid playable bot update", () => {
      expect(() => playableBot.validateUpdate()).not.toThrow();
    });
  });

  describe("combat roles", () => {
    it("should accept ASSAULT combat role", () => {
      const data = {
        ...validPlayableBotData,
        combatRole: CombatRole.ASSAULT,
      };

      const bot = new PlayableBot(data);
      expect(bot.validate()).toBe(true);
      expect(bot.combatRole).toBe(CombatRole.ASSAULT);
    });

    it("should accept TANK combat role", () => {
      const data = {
        ...validPlayableBotData,
        combatRole: CombatRole.TANK,
      };

      const bot = new PlayableBot(data);
      expect(bot.validate()).toBe(true);
      expect(bot.combatRole).toBe(CombatRole.TANK);
    });

    it("should accept SNIPER combat role", () => {
      const data = {
        ...validPlayableBotData,
        combatRole: CombatRole.SNIPER,
      };

      const bot = new PlayableBot(data);
      expect(bot.validate()).toBe(true);
      expect(bot.combatRole).toBe(CombatRole.SNIPER);
    });

    it("should accept SCOUT combat role", () => {
      const data = {
        ...validPlayableBotData,
        combatRole: CombatRole.SCOUT,
      };

      const bot = new PlayableBot(data);
      expect(bot.validate()).toBe(true);
      expect(bot.combatRole).toBe(CombatRole.SCOUT);
    });
  });

  describe("inheritance from Bot class", () => {
    it("should inherit all Bot class methods", () => {
      expect(playableBot.toJSON).toBeDefined();
      expect(playableBot.serialize).toBeDefined();
      expect(playableBot.clone).toBeDefined();
    });

    it("should be able to serialize playable bot data", () => {
      const json = playableBot.toJSON();

      expect(json.id).toBe("playable-bot-1");
      expect(json.botType).toBe(BotType.PLAYABLE);
      expect(json.combatRole).toBe(CombatRole.ASSAULT);
      expect(json.utilitySpec).toBeNull();
      expect(json.soulChipId).toBe("player-soul-chip-1");
    });

    it("should be able to clone playable bot", () => {
      const cloned = playableBot.clone();

      expect(cloned.id).toBe(playableBot.id);
      expect(cloned.botType).toBe(playableBot.botType);
      expect(cloned.combatRole).toBe(playableBot.combatRole);
      expect(cloned.soulChipId).toBe(playableBot.soulChipId);
      expect(cloned).not.toBe(playableBot); // Different instances
    });
  });

  describe("validation exceptions", () => {
    it("should throw error for validateCreation with missing required fields", () => {
      const invalidData: PrismaBot = {
        ...validPlayableBotData,
        name: "", // Invalid: empty name
      };

      const invalidBot = new PlayableBot(invalidData);
      expect(() => invalidBot.validateCreation()).toThrow();
    });

    it("should throw error for validateCreation with missing user ID", () => {
      const invalidData: PrismaBot = {
        ...validPlayableBotData,
        userId: "", // Invalid: empty user ID for playable bot
      };

      const invalidBot = new PlayableBot(invalidData);
      expect(() => invalidBot.validateCreation()).toThrow();
    });

    it("should throw error for validateCreation with missing soul chip", () => {
      const invalidData: PrismaBot = {
        ...validPlayableBotData,
        soulChipId: "", // Invalid: empty soul chip ID
      };

      const invalidBot = new PlayableBot(invalidData);
      expect(() => invalidBot.validateCreation()).toThrow();
    });

    it("should throw error for validateUpdate with missing ID", () => {
      const invalidData: PrismaBot = {
        ...validPlayableBotData,
        id: "", // Invalid: empty ID for update
      };

      const invalidBot = new PlayableBot(invalidData);
      expect(() => invalidBot.validateUpdate()).toThrow();
    });

    it("should throw error for validateCreation with missing skeleton ID", () => {
      const invalidData: PrismaBot = {
        ...validPlayableBotData,
        skeletonId: "", // Invalid: empty skeleton ID
      };

      const invalidBot = new PlayableBot(invalidData);
      expect(() => invalidBot.validateCreation()).toThrow();
    });

    it("should throw error for validateCreation with missing combat role", () => {
      const invalidData: PrismaBot = {
        ...validPlayableBotData,
        combatRole: null as any, // Invalid: playable bots need combat role
      };

      const invalidBot = new PlayableBot(invalidData);
      expect(() => invalidBot.validateCreation()).toThrow();
    });

    it("should throw error for validateCreation with name too long", () => {
      const invalidData: PrismaBot = {
        ...validPlayableBotData,
        name: "A".repeat(101), // Invalid: name too long (max 100 chars)
      };

      const invalidBot = new PlayableBot(invalidData);
      expect(() => invalidBot.validateCreation()).toThrow();
    });

    it("should throw error for validateUpdate with name too long", () => {
      const invalidData: PrismaBot = {
        ...validPlayableBotData,
        name: "B".repeat(101), // Invalid: name too long (max 100 chars)
      };

      const invalidBot = new PlayableBot(invalidData);
      expect(() => invalidBot.validateUpdate()).toThrow();
    });

    it("should throw error for validateCreation with invalid combat role", () => {
      const invalidData: PrismaBot = {
        ...validPlayableBotData,
        combatRole: "INVALID_ROLE" as any, // Invalid: not a valid combat role
      };

      const invalidBot = new PlayableBot(invalidData);
      expect(() => invalidBot.validateCreation()).toThrow();
    });

    it("should throw error for validateCreation when user ID is null", () => {
      const invalidData: PrismaBot = {
        ...validPlayableBotData,
        userId: null as any, // Invalid: playable bots require user ID
      };

      const invalidBot = new PlayableBot(invalidData);
      expect(() => invalidBot.validateCreation()).toThrow();
    });
  });

  describe("business rules enforcement", () => {
    it("should ensure playable bots cannot have utility specialization", () => {
      const dataWithUtilitySpec = {
        ...validPlayableBotData,
        utilitySpec: "TRANSPORT" as any,
      };

      const bot = new PlayableBot(dataWithUtilitySpec);
      expect(bot.utilitySpec).toBeNull();
      expect(bot.validate()).toBe(true);
    });

    it("should ensure botType is always PLAYABLE", () => {
      const dataWithWrongType = {
        ...validPlayableBotData,
        botType: BotType.KING,
      };

      const bot = new PlayableBot(dataWithWrongType);
      expect(bot.botType).toBe(BotType.PLAYABLE);
      expect(bot.validate()).toBe(true);
    });

    it("should handle player ownership", () => {
      const dataWithPlayer = {
        ...validPlayableBotData,
        userId: "different-player",
      };

      const bot = new PlayableBot(dataWithPlayer);
      expect(bot.userId).toBe("different-player");
      expect(bot.validate()).toBe(true);
    });

    it("should handle soul chips for playable bots", () => {
      const dataWithSoulChip = {
        ...validPlayableBotData,
        soulChipId: "enhanced-player-chip",
      };

      const bot = new PlayableBot(dataWithSoulChip);
      expect(bot.soulChipId).toBe("enhanced-player-chip");
      expect(bot.validate()).toBe(true);
    });

    it("should handle combat roles for playable bots", () => {
      const dataWithCombatRole = {
        ...validPlayableBotData,
        combatRole: CombatRole.SNIPER,
      };

      const bot = new PlayableBot(dataWithCombatRole);
      expect(bot.combatRole).toBe(CombatRole.SNIPER);
      expect(bot.validate()).toBe(true);
    });
  });
});
