import { describe, it, expect } from "vitest";
import { SoulChipSlot } from "../soul-chip-slot";
import { generateTestId, generateTestDates } from "./test-utils";

describe("SoulChipSlot", () => {
  describe("Constructor", () => {
    it("should create a SoulChipSlot instance with all required properties", () => {
      const { createdAt, updatedAt } = generateTestDates();
      const props = {
        robotId: generateTestId(),
        itemInstId: generateTestId(),
        createdAt,
        updatedAt,
      };

      const soulChipSlot = new SoulChipSlot(props);

      expect(soulChipSlot.robotId).toBe(props.robotId);
      expect(soulChipSlot.itemInstId).toBe(props.itemInstId);
      expect(soulChipSlot.createdAt).toBe(props.createdAt);
      expect(soulChipSlot.updatedAt).toBe(props.updatedAt);
    });
  });

  describe("CRUD Operations", () => {
    it("should support Create operation", () => {
      const { createdAt, updatedAt } = generateTestDates();
      const soulChipSlotData = {
        robotId: generateTestId(),
        itemInstId: generateTestId(),
        createdAt,
        updatedAt,
      };

      const soulChipSlot = new SoulChipSlot(soulChipSlotData);

      expect(soulChipSlot).toBeInstanceOf(SoulChipSlot);
      expect(soulChipSlot.robotId).toBe(soulChipSlotData.robotId);
      expect(soulChipSlot.itemInstId).toBe(soulChipSlotData.itemInstId);
    });

    it("should support Read operation by accessing properties", () => {
      const { createdAt, updatedAt } = generateTestDates();
      const robotId = generateTestId();
      const itemInstId = generateTestId();
      const soulChipSlot = new SoulChipSlot({
        robotId,
        itemInstId,
        createdAt,
        updatedAt,
      });

      // Read operations
      expect(soulChipSlot.robotId).toBe(robotId);
      expect(soulChipSlot.itemInstId).toBe(itemInstId);
      expect(soulChipSlot.createdAt).toBe(createdAt);
      expect(soulChipSlot.updatedAt).toBe(updatedAt);
    });

    it("should support Update operation by modifying properties", () => {
      const { createdAt, updatedAt } = generateTestDates();
      const soulChipSlot = new SoulChipSlot({
        robotId: generateTestId(),
        itemInstId: generateTestId(),
        createdAt,
        updatedAt,
      });

      // Update operations
      const newItemInstId = generateTestId();
      const newUpdatedAt = new Date();

      soulChipSlot.itemInstId = newItemInstId;
      soulChipSlot.updatedAt = newUpdatedAt;

      expect(soulChipSlot.itemInstId).toBe(newItemInstId);
      expect(soulChipSlot.updatedAt).toBe(newUpdatedAt);
    });

    it("should support Delete operation by clearing item instance", () => {
      const { createdAt, updatedAt } = generateTestDates();
      const soulChipSlot = new SoulChipSlot({
        robotId: generateTestId(),
        itemInstId: generateTestId(),
        createdAt,
        updatedAt,
      });

      // Simulate delete by clearing item instance (unequip)
      soulChipSlot.itemInstId = "";

      expect(soulChipSlot.itemInstId).toBe("");
      // Other properties should remain
      expect(soulChipSlot.robotId).toBeTruthy();
      expect(soulChipSlot.createdAt).toBe(createdAt);
      expect(soulChipSlot.updatedAt).toBe(updatedAt);
    });
  });

  describe("Edge Cases", () => {
    it("should handle empty string IDs", () => {
      const { createdAt, updatedAt } = generateTestDates();
      const soulChipSlot = new SoulChipSlot({
        robotId: "",
        itemInstId: "",
        createdAt,
        updatedAt,
      });

      expect(soulChipSlot.robotId).toBe("");
      expect(soulChipSlot.itemInstId).toBe("");
    });

    it("should handle very long IDs", () => {
      const { createdAt, updatedAt } = generateTestDates();
      const veryLongId = "a".repeat(1000);
      const soulChipSlot = new SoulChipSlot({
        robotId: veryLongId,
        itemInstId: veryLongId,
        createdAt,
        updatedAt,
      });

      expect(soulChipSlot.robotId).toBe(veryLongId);
      expect(soulChipSlot.itemInstId).toBe(veryLongId);
    });

    it("should handle special character IDs", () => {
      const { createdAt, updatedAt } = generateTestDates();
      const specialIds = [
        "id-with-dashes",
        "id_with_underscores",
        "id.with.dots",
        "id123with456numbers",
        "ID-WITH-CAPS",
        "id with spaces",
        "id@with#special$chars",
      ];

      specialIds.forEach((id) => {
        const soulChipSlot = new SoulChipSlot({
          robotId: id,
          itemInstId: id,
          createdAt: generateTestDates().createdAt,
          updatedAt: generateTestDates().updatedAt,
        });

        expect(soulChipSlot.robotId).toBe(id);
        expect(soulChipSlot.itemInstId).toBe(id);
      });
    });
  });

  describe("Data Integrity", () => {
    it("should maintain data integrity after multiple updates", () => {
      const { createdAt, updatedAt } = generateTestDates();
      const originalRobotId = generateTestId();

      const soulChipSlot = new SoulChipSlot({
        robotId: originalRobotId,
        itemInstId: generateTestId(),
        createdAt,
        updatedAt,
      });

      // Multiple updates
      soulChipSlot.itemInstId = generateTestId();
      soulChipSlot.itemInstId = generateTestId();
      const finalItemInstId = generateTestId();
      soulChipSlot.itemInstId = finalItemInstId;

      // Robot ID should typically not change
      expect(soulChipSlot.robotId).toBe(originalRobotId);
      expect(soulChipSlot.itemInstId).toBe(finalItemInstId);
      expect(soulChipSlot.createdAt).toBe(createdAt);
    });

    it("should handle concurrent-like updates", () => {
      const { createdAt, updatedAt } = generateTestDates();
      const soulChipSlot = new SoulChipSlot({
        robotId: generateTestId(),
        itemInstId: generateTestId(),
        createdAt,
        updatedAt,
      });

      const update1 = new Date();
      const update2 = new Date(update1.getTime() + 1000);
      const item1 = generateTestId();
      const item2 = generateTestId();

      soulChipSlot.updatedAt = update1;
      soulChipSlot.itemInstId = item1;

      soulChipSlot.updatedAt = update2;
      soulChipSlot.itemInstId = item2;

      expect(soulChipSlot.itemInstId).toBe(item2);
      expect(soulChipSlot.updatedAt).toBe(update2);
    });
  });

  describe("Business Logic", () => {
    it("should support slot filtering by robot", () => {
      const { createdAt, updatedAt } = generateTestDates();
      const robot1Id = generateTestId();
      const robot2Id = generateTestId();

      const soulChipSlots = [
        new SoulChipSlot({
          robotId: robot1Id,
          itemInstId: generateTestId(),
          createdAt,
          updatedAt,
        }),
        new SoulChipSlot({
          robotId: robot2Id,
          itemInstId: generateTestId(),
          createdAt,
          updatedAt,
        }),
        new SoulChipSlot({
          robotId: robot1Id,
          itemInstId: generateTestId(),
          createdAt,
          updatedAt,
        }),
      ];

      const robot1Slots = soulChipSlots.filter((s) => s.robotId === robot1Id);
      const robot2Slots = soulChipSlots.filter((s) => s.robotId === robot2Id);

      expect(robot1Slots).toHaveLength(2);
      expect(robot2Slots).toHaveLength(1);
    });

    it("should support equipped item queries", () => {
      const { createdAt, updatedAt } = generateTestDates();
      const itemId = generateTestId();

      const soulChipSlots = [
        new SoulChipSlot({
          robotId: generateTestId(),
          itemInstId: itemId,
          createdAt,
          updatedAt,
        }),
        new SoulChipSlot({
          robotId: generateTestId(),
          itemInstId: generateTestId(),
          createdAt,
          updatedAt,
        }),
        new SoulChipSlot({
          robotId: generateTestId(),
          itemInstId: generateTestId(),
          createdAt,
          updatedAt,
        }),
      ];

      const slotsWithItem = soulChipSlots.filter(
        (s) => s.itemInstId === itemId
      );

      expect(slotsWithItem).toHaveLength(1);
    });

    it("should support empty slot detection", () => {
      const { createdAt, updatedAt } = generateTestDates();
      const soulChipSlots = [
        new SoulChipSlot({
          robotId: generateTestId(),
          itemInstId: generateTestId(),
          createdAt,
          updatedAt,
        }),
        new SoulChipSlot({
          robotId: generateTestId(),
          itemInstId: "",
          createdAt,
          updatedAt,
        }),
        new SoulChipSlot({
          robotId: generateTestId(),
          itemInstId: generateTestId(),
          createdAt,
          updatedAt,
        }),
      ];

      const emptySlots = soulChipSlots.filter((s) => s.itemInstId === "");
      const occupiedSlots = soulChipSlots.filter((s) => s.itemInstId !== "");

      expect(emptySlots).toHaveLength(1);
      expect(occupiedSlots).toHaveLength(2);
    });

    it("should support robot soul chip validation", () => {
      const { createdAt, updatedAt } = generateTestDates();
      const robotId = generateTestId();

      const soulChipSlots = [
        new SoulChipSlot({
          robotId,
          itemInstId: generateTestId(),
          createdAt,
          updatedAt,
        }),
      ];

      const robotSlots = soulChipSlots.filter((s) => s.robotId === robotId);

      expect(robotSlots).toHaveLength(1);
      expect(robotSlots[0].itemInstId).toBeTruthy();
    });

    it("should support soul chip swapping", () => {
      const { createdAt, updatedAt } = generateTestDates();
      const robotId = generateTestId();
      const oldSoulChip = generateTestId();
      const newSoulChip = generateTestId();

      const soulChipSlot = new SoulChipSlot({
        robotId,
        itemInstId: oldSoulChip,
        createdAt,
        updatedAt,
      });

      expect(soulChipSlot.itemInstId).toBe(oldSoulChip);

      // Swap soul chip
      soulChipSlot.itemInstId = newSoulChip;
      soulChipSlot.updatedAt = new Date();

      expect(soulChipSlot.itemInstId).toBe(newSoulChip);
      expect(soulChipSlot.itemInstId).not.toBe(oldSoulChip);
    });

    it("should support soul chip removal", () => {
      const { createdAt, updatedAt } = generateTestDates();
      const soulChipSlot = new SoulChipSlot({
        robotId: generateTestId(),
        itemInstId: generateTestId(),
        createdAt,
        updatedAt,
      });

      expect(soulChipSlot.itemInstId).toBeTruthy();

      // Remove soul chip
      soulChipSlot.itemInstId = "";
      soulChipSlot.updatedAt = new Date();

      expect(soulChipSlot.itemInstId).toBe("");
    });

    it("should support unique robot constraint simulation", () => {
      const { createdAt, updatedAt } = generateTestDates();
      const soulChipSlots = [
        new SoulChipSlot({
          robotId: "robot-1",
          itemInstId: generateTestId(),
          createdAt,
          updatedAt,
        }),
        new SoulChipSlot({
          robotId: "robot-2",
          itemInstId: generateTestId(),
          createdAt,
          updatedAt,
        }),
        new SoulChipSlot({
          robotId: "robot-3",
          itemInstId: generateTestId(),
          createdAt,
          updatedAt,
        }),
      ];

      const robotIds = soulChipSlots.map((s) => s.robotId);
      const uniqueRobotIds = [...new Set(robotIds)];

      // Each robot should have only one soul chip slot
      expect(robotIds).toHaveLength(3);
      expect(uniqueRobotIds).toHaveLength(3);
      expect(robotIds).toEqual(uniqueRobotIds);
    });
  });
});
