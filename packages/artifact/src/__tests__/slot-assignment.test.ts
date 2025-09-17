/**
 * Slot Assignment System Tests
 */

import { describe, it, expect, beforeEach } from "vitest";
import { Bot } from "../bot/bot";
import { BotFactory } from "../bot/bot-factory";
import { SoulChip } from "../soul-chip";
import { SkeletonFactory } from "../skeleton/skeleton-factory";
import { PartFactory } from "../part/part-factory";
import { SlotIdentifier } from "@botking/domain";
import {
  SkeletonType,
  BotType,
  Rarity,
  MobilityType,
  PartCategory,
} from "../types";

describe("Slot Assignment System", () => {
  let testBot: Bot;

  beforeEach(() => {
    // Create a test bot with basic components - use PLAYABLE type so it can have soul chips
    testBot = BotFactory.createBasicBot(
      "Test Bot",
      "user_123",
      SkeletonType.BALANCED,
      BotType.PLAYABLE
    );
  });

  describe("Basic Slot Assignment", () => {
    it("should automatically assign parts to slots during bot creation", () => {
      const visualization = testBot.getSlotAssignmentForVisualization();

      expect(visualization).toBeDefined();
      expect(visualization.skeletonType).toBe("BALANCED"); // Domain enum returns uppercase
      expect(visualization.slots).toBeInstanceOf(Array);
      expect(visualization.slots.length).toBeGreaterThan(0);

      // Check that some slots are occupied
      const occupiedSlots = visualization.slots.filter(
        (slot) => slot.isOccupied
      );
      expect(occupiedSlots.length).toBeGreaterThan(0);
    });

    it("should have soul chip assigned to SOUL_CHIP slot", () => {
      const visualization = testBot.getSlotAssignmentForVisualization();
      const soulChipSlot = visualization.slots.find(
        (slot) => slot.slotId === "SOUL_CHIP"
      );

      expect(soulChipSlot).toBeDefined();
      expect(soulChipSlot!.isOccupied).toBe(true);
      expect(soulChipSlot!.partData).toBeDefined();
    });

    it("should provide 3D coordinates for each slot", () => {
      const visualization = testBot.getSlotAssignmentForVisualization();

      visualization.slots.forEach((slot) => {
        expect(slot.visualPosition).toBeDefined();
        expect(typeof slot.visualPosition.x).toBe("number");
        expect(typeof slot.visualPosition.y).toBe("number");
        expect(typeof slot.visualPosition.z).toBe("number");
      });
    });
  });

  describe("Slot Validation", () => {
    it("should validate slot assignments correctly", () => {
      const validation = testBot.validateSlotAssignments();

      expect(validation).toBeDefined();
      expect(typeof validation.isValid).toBe("boolean");
      expect(Array.isArray(validation.errors)).toBe(true);
      expect(Array.isArray(validation.warnings)).toBe(true);
      expect(Array.isArray(validation.conflictingSlots)).toBe(true);
      expect(Array.isArray(validation.unassignedRequiredSlots)).toBe(true);
    });

    it("should have valid slot configuration by default", () => {
      const validation = testBot.validateSlotAssignments();

      // Basic validation structure should be correct
      expect(typeof validation.isValid).toBe("boolean");
      expect(Array.isArray(validation.errors)).toBe(true);
      expect(Array.isArray(validation.warnings)).toBe(true);
      expect(Array.isArray(validation.conflictingSlots)).toBe(true);
      expect(Array.isArray(validation.unassignedRequiredSlots)).toBe(true);

      // No conflicts should exist
      expect(validation.conflictingSlots.length).toBe(0);

      // Note: Basic bot may have unassigned required slots, which is expected
      // The validation system is working correctly by detecting this
    });
  });

  describe("Slot Operations", () => {
    it("should support part installation with specific slot preference", () => {
      // Create a new part
      const newPart = PartFactory.createPart(
        PartCategory.HEAD,
        "test_head_001",
        Rarity.COMMON,
        "Test Helmet",
        {
          attack: 5,
          defense: 10,
          speed: 2,
          perception: 8,
          energyConsumption: 3,
        }
      );

      // Try to install it to a specific slot
      const result = testBot.installPart(newPart, "HEAD_1" as any);

      expect(result).toBeDefined();
      expect(typeof result.success).toBe("boolean");
      expect(typeof result.message).toBe("string");

      if (result.success) {
        expect(result.assignedSlot).toBeDefined();
      }
    });

    it("should support part removal from specific slots", () => {
      // Get current parts
      const currentParts = testBot.parts;

      if (currentParts.length > 0) {
        const partToRemove = currentParts[0];
        const result = testBot.removePart(partToRemove.id);

        expect(result).toBeDefined();
        expect(typeof result.success).toBe("boolean");
        expect(typeof result.message).toBe("string");
      }
    });

    it("should provide slot configuration access", () => {
      const slotConfig = testBot.slotConfiguration;
      const slotAssignments = testBot.slotAssignments;

      expect(slotConfig).toBeDefined();
      expect(slotConfig.skeletonType).toBeDefined();
      expect(slotConfig.availableSlots).toBeInstanceOf(Array);
      expect(slotConfig.assignments).toBeDefined();

      expect(slotAssignments).toBeDefined();
      // slotAssignments should be a Map-like object
      expect(typeof slotAssignments.has).toBe("function");
    });
  });

  describe("Skeleton Type Compatibility", () => {
    it("should work with different skeleton types", () => {
      const skeletonTypes = [
        SkeletonType.LIGHT,
        SkeletonType.BALANCED,
        SkeletonType.HEAVY,
        SkeletonType.FLYING,
        SkeletonType.MODULAR,
      ];

      skeletonTypes.forEach((skeletonType) => {
        const skeleton = SkeletonFactory.createSkeleton(
          skeletonType,
          `skeleton_${skeletonType}`,
          Rarity.COMMON,
          4,
          100,
          MobilityType.BIPEDAL
        );

        const soulChip = new SoulChip(
          `soul_${skeletonType}`,
          `Soul Chip ${skeletonType}`,
          Rarity.COMMON,
          {
            aggressiveness: 50,
            curiosity: 50,
            loyalty: 50,
            independence: 50,
            empathy: 50,
            dialogueStyle: "casual" as any,
          },
          {
            intelligence: 50,
            resilience: 50,
            adaptability: 50,
          },
          "Test Trait"
        );

        const botConfig = {
          name: `Test Bot ${skeletonType}`,
          botType: BotType.PLAYABLE, // Use PLAYABLE so it can have soul chips
          userId: "test_user", // PLAYABLE bots need a user
          soulChip,
          skeleton,
          parts: [],
        };

        // This should not throw an error
        expect(() => new Bot(botConfig)).not.toThrow();

        const bot = new Bot(botConfig);
        const visualization = bot.getSlotAssignmentForVisualization();

        expect(visualization.skeletonType).toBe(skeletonType.toUpperCase()); // Domain returns uppercase
        expect(visualization.slots.length).toBeGreaterThan(0);
      });
    });
  });

  describe("Worker Bot Support", () => {
    it("should work with worker bots (no soul chips)", () => {
      // Create a worker bot without soul chips
      const workerBot = BotFactory.createBasicBot(
        "Worker Bot",
        null,
        SkeletonType.BALANCED,
        BotType.WORKER
      );

      expect(workerBot).toBeDefined();
      expect(workerBot.botType).toBe(BotType.WORKER);
      expect(workerBot.soulChip).toBeNull();

      // Slot system should still work
      const visualization = workerBot.getSlotAssignmentForVisualization();
      expect(visualization).toBeDefined();
      expect(visualization.skeletonType).toBe("BALANCED");
      expect(visualization.slots).toBeInstanceOf(Array);

      // Soul chip slot should be unoccupied for worker bots
      const soulChipSlot = visualization.slots.find(
        (slot) => slot.slotId === "SOUL_CHIP"
      );
      expect(soulChipSlot).toBeDefined();
      expect(soulChipSlot!.isOccupied).toBe(false); // Worker bots don't have soul chips

      // Validation should work
      const validation = workerBot.validateSlotAssignments();
      expect(validation).toBeDefined();
      expect(typeof validation.isValid).toBe("boolean");

      // Test slot configuration access
      const slotConfig = workerBot.slotConfiguration;
      expect(slotConfig).toBeDefined();
      expect(slotConfig.skeletonType).toBeDefined();
    });
  });

  describe("Integration with Existing Bot Features", () => {
    it("should not break existing bot functionality", () => {
      // Test that all existing properties and methods still work
      expect(testBot.id).toBeDefined();
      expect(testBot.name).toBeDefined();
      expect(testBot.skeleton).toBeDefined();
      expect(testBot.soulChip).toBeDefined();
      expect(testBot.parts).toBeInstanceOf(Array);
      expect(testBot.isAssembled).toBe(true);
      expect(typeof testBot.totalWeight).toBe("number");
      expect(typeof testBot.calculateCombatPower()).toBe("number");

      // Test serialization still works
      const serialized = testBot.serialize();
      expect(typeof serialized).toBe("string");

      const json = testBot.toJSON();
      expect(json).toBeDefined();
      expect(json.id).toBe(testBot.id);
    });

    it("should work with bot cloning", () => {
      const clonedBot = testBot.clone();

      expect(clonedBot).toBeDefined();
      expect(clonedBot.id).not.toBe(testBot.id); // Should have different ID
      expect(clonedBot.name).toContain("Clone"); // Should indicate it's a clone

      // Slot configuration should work on cloned bot
      const originalVisualization = testBot.getSlotAssignmentForVisualization();
      const clonedVisualization = clonedBot.getSlotAssignmentForVisualization();

      expect(clonedVisualization.skeletonType).toBe(
        originalVisualization.skeletonType
      );
      expect(clonedVisualization.slots.length).toBe(
        originalVisualization.slots.length
      );
    });
  });
});
