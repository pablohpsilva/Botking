import { describe, it, expect } from "vitest";
import { ExpansionSlot } from "../expansion-slot";
import {
  generateTestId,
  generateTestNumber,
  generateTestDates,
} from "./test-utils";

describe("ExpansionSlot", () => {
  describe("Constructor", () => {
    it("should create an ExpansionSlot instance with all required properties", () => {
      const { createdAt, updatedAt } = generateTestDates();
      const props = {
        robotId: generateTestId(),
        slotIx: generateTestNumber(),
        itemInstId: generateTestId(),
        createdAt,
        updatedAt,
      };

      const expansionSlot = new ExpansionSlot(props);

      expect(expansionSlot.robotId).toBe(props.robotId);
      expect(expansionSlot.slotIx).toBe(props.slotIx);
      expect(expansionSlot.itemInstId).toBe(props.itemInstId);
      expect(expansionSlot.createdAt).toBe(props.createdAt);
      expect(expansionSlot.updatedAt).toBe(props.updatedAt);
    });
  });

  describe("CRUD Operations", () => {
    it("should support Create operation", () => {
      const { createdAt, updatedAt } = generateTestDates();
      const expansionSlotData = {
        robotId: generateTestId(),
        slotIx: 0,
        itemInstId: generateTestId(),
        createdAt,
        updatedAt,
      };

      const expansionSlot = new ExpansionSlot(expansionSlotData);

      expect(expansionSlot).toBeInstanceOf(ExpansionSlot);
      expect(expansionSlot.robotId).toBe(expansionSlotData.robotId);
      expect(expansionSlot.slotIx).toBe(expansionSlotData.slotIx);
      expect(expansionSlot.itemInstId).toBe(expansionSlotData.itemInstId);
    });

    it("should support Read operation by accessing properties", () => {
      const { createdAt, updatedAt } = generateTestDates();
      const robotId = generateTestId();
      const slotIx = 1;
      const itemInstId = generateTestId();
      const expansionSlot = new ExpansionSlot({
        robotId,
        slotIx,
        itemInstId,
        createdAt,
        updatedAt,
      });

      // Read operations
      expect(expansionSlot.robotId).toBe(robotId);
      expect(expansionSlot.slotIx).toBe(slotIx);
      expect(expansionSlot.itemInstId).toBe(itemInstId);
      expect(expansionSlot.createdAt).toBe(createdAt);
      expect(expansionSlot.updatedAt).toBe(updatedAt);
    });

    it("should support Update operation by modifying properties", () => {
      const { createdAt, updatedAt } = generateTestDates();
      const expansionSlot = new ExpansionSlot({
        robotId: generateTestId(),
        slotIx: 0,
        itemInstId: generateTestId(),
        createdAt,
        updatedAt,
      });

      // Update operations
      const newItemInstId = generateTestId();
      const newUpdatedAt = new Date();

      expansionSlot.itemInstId = newItemInstId;
      expansionSlot.updatedAt = newUpdatedAt;

      expect(expansionSlot.itemInstId).toBe(newItemInstId);
      expect(expansionSlot.updatedAt).toBe(newUpdatedAt);
    });

    it("should support Delete operation by clearing item instance", () => {
      const { createdAt, updatedAt } = generateTestDates();
      const expansionSlot = new ExpansionSlot({
        robotId: generateTestId(),
        slotIx: 2,
        itemInstId: generateTestId(),
        createdAt,
        updatedAt,
      });

      // Simulate delete by clearing item instance (unequip)
      expansionSlot.itemInstId = "";

      expect(expansionSlot.itemInstId).toBe("");
      // Other properties should remain
      expect(expansionSlot.robotId).toBeTruthy();
      expect(expansionSlot.slotIx).toBe(2);
      expect(expansionSlot.createdAt).toBe(createdAt);
      expect(expansionSlot.updatedAt).toBe(updatedAt);
    });
  });

  describe("Slot Index Handling", () => {
    it("should handle various slot index values", () => {
      const { createdAt, updatedAt } = generateTestDates();
      const slotIndices = [0, 1, 2, 3, 4, 5, 10, 99, 255];

      slotIndices.forEach((slotIx) => {
        const expansionSlot = new ExpansionSlot({
          robotId: generateTestId(),
          slotIx,
          itemInstId: generateTestId(),
          createdAt,
          updatedAt,
        });

        expect(expansionSlot.slotIx).toBe(slotIx);
        expect(typeof expansionSlot.slotIx).toBe("number");
        expect(Number.isInteger(expansionSlot.slotIx)).toBe(true);
      });
    });

    it("should handle negative slot indices", () => {
      const { createdAt, updatedAt } = generateTestDates();
      const expansionSlot = new ExpansionSlot({
        robotId: generateTestId(),
        slotIx: -1,
        itemInstId: generateTestId(),
        createdAt,
        updatedAt,
      });

      expect(expansionSlot.slotIx).toBe(-1);
    });

    it("should handle very large slot indices", () => {
      const { createdAt, updatedAt } = generateTestDates();
      const largeSlotIx = Number.MAX_SAFE_INTEGER;
      const expansionSlot = new ExpansionSlot({
        robotId: generateTestId(),
        slotIx: largeSlotIx,
        itemInstId: generateTestId(),
        createdAt,
        updatedAt,
      });

      expect(expansionSlot.slotIx).toBe(largeSlotIx);
    });
  });

  describe("Edge Cases", () => {
    it("should handle empty string IDs", () => {
      const { createdAt, updatedAt } = generateTestDates();
      const expansionSlot = new ExpansionSlot({
        robotId: "",
        slotIx: 0,
        itemInstId: "",
        createdAt,
        updatedAt,
      });

      expect(expansionSlot.robotId).toBe("");
      expect(expansionSlot.itemInstId).toBe("");
    });

    it("should handle very long IDs", () => {
      const { createdAt, updatedAt } = generateTestDates();
      const veryLongId = "a".repeat(1000);
      const expansionSlot = new ExpansionSlot({
        robotId: veryLongId,
        slotIx: 0,
        itemInstId: veryLongId,
        createdAt,
        updatedAt,
      });

      expect(expansionSlot.robotId).toBe(veryLongId);
      expect(expansionSlot.itemInstId).toBe(veryLongId);
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

      specialIds.forEach((id, index) => {
        const expansionSlot = new ExpansionSlot({
          robotId: id,
          slotIx: index,
          itemInstId: id,
          createdAt: generateTestDates().createdAt,
          updatedAt: generateTestDates().updatedAt,
        });

        expect(expansionSlot.robotId).toBe(id);
        expect(expansionSlot.itemInstId).toBe(id);
        expect(expansionSlot.slotIx).toBe(index);
      });
    });
  });

  describe("Data Integrity", () => {
    it("should maintain data integrity after multiple updates", () => {
      const { createdAt, updatedAt } = generateTestDates();
      const originalRobotId = generateTestId();
      const originalSlotIx = 3;

      const expansionSlot = new ExpansionSlot({
        robotId: originalRobotId,
        slotIx: originalSlotIx,
        itemInstId: generateTestId(),
        createdAt,
        updatedAt,
      });

      // Multiple updates
      expansionSlot.itemInstId = generateTestId();
      expansionSlot.itemInstId = generateTestId();
      const finalItemInstId = generateTestId();
      expansionSlot.itemInstId = finalItemInstId;

      // Core identifiers should typically not change
      expect(expansionSlot.robotId).toBe(originalRobotId);
      expect(expansionSlot.slotIx).toBe(originalSlotIx);
      expect(expansionSlot.itemInstId).toBe(finalItemInstId);
      expect(expansionSlot.createdAt).toBe(createdAt);
    });

    it("should handle concurrent-like updates", () => {
      const { createdAt, updatedAt } = generateTestDates();
      const expansionSlot = new ExpansionSlot({
        robotId: generateTestId(),
        slotIx: 1,
        itemInstId: generateTestId(),
        createdAt,
        updatedAt,
      });

      const update1 = new Date();
      const update2 = new Date(update1.getTime() + 1000);
      const item1 = generateTestId();
      const item2 = generateTestId();

      expansionSlot.updatedAt = update1;
      expansionSlot.itemInstId = item1;

      expansionSlot.updatedAt = update2;
      expansionSlot.itemInstId = item2;

      expect(expansionSlot.itemInstId).toBe(item2);
      expect(expansionSlot.updatedAt).toBe(update2);
    });
  });

  describe("Business Logic", () => {
    it("should support slot filtering by robot", () => {
      const { createdAt, updatedAt } = generateTestDates();
      const robot1Id = generateTestId();
      const robot2Id = generateTestId();

      const expansionSlots = [
        new ExpansionSlot({
          robotId: robot1Id,
          slotIx: 0,
          itemInstId: generateTestId(),
          createdAt,
          updatedAt,
        }),
        new ExpansionSlot({
          robotId: robot2Id,
          slotIx: 0,
          itemInstId: generateTestId(),
          createdAt,
          updatedAt,
        }),
        new ExpansionSlot({
          robotId: robot1Id,
          slotIx: 1,
          itemInstId: generateTestId(),
          createdAt,
          updatedAt,
        }),
      ];

      const robot1Slots = expansionSlots.filter((s) => s.robotId === robot1Id);
      const robot2Slots = expansionSlots.filter((s) => s.robotId === robot2Id);

      expect(robot1Slots).toHaveLength(2);
      expect(robot2Slots).toHaveLength(1);
    });

    it("should support slot filtering by index", () => {
      const { createdAt, updatedAt } = generateTestDates();
      const expansionSlots = [
        new ExpansionSlot({
          robotId: generateTestId(),
          slotIx: 0,
          itemInstId: generateTestId(),
          createdAt,
          updatedAt,
        }),
        new ExpansionSlot({
          robotId: generateTestId(),
          slotIx: 1,
          itemInstId: generateTestId(),
          createdAt,
          updatedAt,
        }),
        new ExpansionSlot({
          robotId: generateTestId(),
          slotIx: 0,
          itemInstId: generateTestId(),
          createdAt,
          updatedAt,
        }),
        new ExpansionSlot({
          robotId: generateTestId(),
          slotIx: 2,
          itemInstId: generateTestId(),
          createdAt,
          updatedAt,
        }),
      ];

      const slot0 = expansionSlots.filter((s) => s.slotIx === 0);
      const slot1 = expansionSlots.filter((s) => s.slotIx === 1);
      const slot2 = expansionSlots.filter((s) => s.slotIx === 2);

      expect(slot0).toHaveLength(2);
      expect(slot1).toHaveLength(1);
      expect(slot2).toHaveLength(1);
    });

    it("should support equipped item queries", () => {
      const { createdAt, updatedAt } = generateTestDates();
      const itemId = generateTestId();

      const expansionSlots = [
        new ExpansionSlot({
          robotId: generateTestId(),
          slotIx: 0,
          itemInstId: itemId,
          createdAt,
          updatedAt,
        }),
        new ExpansionSlot({
          robotId: generateTestId(),
          slotIx: 1,
          itemInstId: generateTestId(),
          createdAt,
          updatedAt,
        }),
        new ExpansionSlot({
          robotId: generateTestId(),
          slotIx: 2,
          itemInstId: generateTestId(),
          createdAt,
          updatedAt,
        }),
      ];

      const slotsWithItem = expansionSlots.filter(
        (s) => s.itemInstId === itemId
      );

      expect(slotsWithItem).toHaveLength(1);
      expect(slotsWithItem[0].slotIx).toBe(0);
    });

    it("should support empty slot detection", () => {
      const { createdAt, updatedAt } = generateTestDates();
      const expansionSlots = [
        new ExpansionSlot({
          robotId: generateTestId(),
          slotIx: 0,
          itemInstId: generateTestId(),
          createdAt,
          updatedAt,
        }),
        new ExpansionSlot({
          robotId: generateTestId(),
          slotIx: 1,
          itemInstId: "",
          createdAt,
          updatedAt,
        }),
        new ExpansionSlot({
          robotId: generateTestId(),
          slotIx: 2,
          itemInstId: generateTestId(),
          createdAt,
          updatedAt,
        }),
      ];

      const emptySlots = expansionSlots.filter((s) => s.itemInstId === "");
      const occupiedSlots = expansionSlots.filter((s) => s.itemInstId !== "");

      expect(emptySlots).toHaveLength(1);
      expect(occupiedSlots).toHaveLength(2);
      expect(emptySlots[0].slotIx).toBe(1);
    });

    it("should support robot expansion validation", () => {
      const { createdAt, updatedAt } = generateTestDates();
      const robotId = generateTestId();

      const expansionSlots = [
        new ExpansionSlot({
          robotId,
          slotIx: 0,
          itemInstId: generateTestId(),
          createdAt,
          updatedAt,
        }),
        new ExpansionSlot({
          robotId,
          slotIx: 1,
          itemInstId: generateTestId(),
          createdAt,
          updatedAt,
        }),
        new ExpansionSlot({
          robotId,
          slotIx: 2,
          itemInstId: generateTestId(),
          createdAt,
          updatedAt,
        }),
      ];

      const robotSlots = expansionSlots.filter((s) => s.robotId === robotId);
      const slotIndices = robotSlots.map((s) => s.slotIx).sort((a, b) => a - b);

      expect(robotSlots).toHaveLength(3);
      expect(slotIndices).toEqual([0, 1, 2]);
    });

    it("should support expansion chip swapping", () => {
      const { createdAt, updatedAt } = generateTestDates();
      const robotId = generateTestId();
      const slotIx = 0;
      const oldChip = generateTestId();
      const newChip = generateTestId();

      const expansionSlot = new ExpansionSlot({
        robotId,
        slotIx,
        itemInstId: oldChip,
        createdAt,
        updatedAt,
      });

      expect(expansionSlot.itemInstId).toBe(oldChip);

      // Swap expansion chip
      expansionSlot.itemInstId = newChip;
      expansionSlot.updatedAt = new Date();

      expect(expansionSlot.itemInstId).toBe(newChip);
      expect(expansionSlot.itemInstId).not.toBe(oldChip);
    });

    it("should support expansion chip removal", () => {
      const { createdAt, updatedAt } = generateTestDates();
      const expansionSlot = new ExpansionSlot({
        robotId: generateTestId(),
        slotIx: 0,
        itemInstId: generateTestId(),
        createdAt,
        updatedAt,
      });

      expect(expansionSlot.itemInstId).toBeTruthy();

      // Remove expansion chip
      expansionSlot.itemInstId = "";
      expansionSlot.updatedAt = new Date();

      expect(expansionSlot.itemInstId).toBe("");
    });

    it("should support slot ordering", () => {
      const { createdAt, updatedAt } = generateTestDates();
      const robotId = generateTestId();

      const expansionSlots = [
        new ExpansionSlot({
          robotId,
          slotIx: 2,
          itemInstId: generateTestId(),
          createdAt,
          updatedAt,
        }),
        new ExpansionSlot({
          robotId,
          slotIx: 0,
          itemInstId: generateTestId(),
          createdAt,
          updatedAt,
        }),
        new ExpansionSlot({
          robotId,
          slotIx: 1,
          itemInstId: generateTestId(),
          createdAt,
          updatedAt,
        }),
      ];

      const robotSlots = expansionSlots.filter((s) => s.robotId === robotId);
      robotSlots.sort((a, b) => a.slotIx - b.slotIx);

      expect(robotSlots[0].slotIx).toBe(0);
      expect(robotSlots[1].slotIx).toBe(1);
      expect(robotSlots[2].slotIx).toBe(2);
    });

    it("should support unique robot-slot constraint simulation", () => {
      const { createdAt, updatedAt } = generateTestDates();
      const expansionSlots = [
        new ExpansionSlot({
          robotId: "robot-1",
          slotIx: 0,
          itemInstId: generateTestId(),
          createdAt,
          updatedAt,
        }),
        new ExpansionSlot({
          robotId: "robot-1",
          slotIx: 1,
          itemInstId: generateTestId(),
          createdAt,
          updatedAt,
        }),
        new ExpansionSlot({
          robotId: "robot-2",
          slotIx: 0,
          itemInstId: generateTestId(),
          createdAt,
          updatedAt,
        }),
      ];

      const robotSlotKeys = expansionSlots.map(
        (s) => `${s.robotId}-${s.slotIx}`
      );
      const uniqueKeys = [...new Set(robotSlotKeys)];

      // Each robot-slot combination should be unique
      expect(robotSlotKeys).toHaveLength(3);
      expect(uniqueKeys).toHaveLength(3);
      expect(robotSlotKeys).toEqual(uniqueKeys);
    });
  });
});
