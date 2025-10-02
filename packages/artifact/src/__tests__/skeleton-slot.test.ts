import { describe, it, expect } from "vitest";
import { SkeletonSlot } from "../skeleton-slot";
import { generateTestId, generateTestDates } from "./test-utils";

describe("SkeletonSlot", () => {
  describe("Constructor", () => {
    it("should create a SkeletonSlot instance with all required properties", () => {
      const { createdAt, updatedAt } = generateTestDates();
      const props = {
        robotId: generateTestId(),
        itemInstId: generateTestId(),
        createdAt,
        updatedAt,
      };

      const skeletonSlot = new SkeletonSlot(props);

      expect(skeletonSlot.robotId).toBe(props.robotId);
      expect(skeletonSlot.itemInstId).toBe(props.itemInstId);
      expect(skeletonSlot.createdAt).toBe(props.createdAt);
      expect(skeletonSlot.updatedAt).toBe(props.updatedAt);
    });
  });

  describe("CRUD Operations", () => {
    it("should support Create operation", () => {
      const { createdAt, updatedAt } = generateTestDates();
      const skeletonSlotData = {
        robotId: generateTestId(),
        itemInstId: generateTestId(),
        createdAt,
        updatedAt,
      };

      const skeletonSlot = new SkeletonSlot(skeletonSlotData);

      expect(skeletonSlot).toBeInstanceOf(SkeletonSlot);
      expect(skeletonSlot.robotId).toBe(skeletonSlotData.robotId);
      expect(skeletonSlot.itemInstId).toBe(skeletonSlotData.itemInstId);
    });

    it("should support Read operation by accessing properties", () => {
      const { createdAt, updatedAt } = generateTestDates();
      const robotId = generateTestId();
      const itemInstId = generateTestId();
      const skeletonSlot = new SkeletonSlot({
        robotId,
        itemInstId,
        createdAt,
        updatedAt,
      });

      // Read operations
      expect(skeletonSlot.robotId).toBe(robotId);
      expect(skeletonSlot.itemInstId).toBe(itemInstId);
      expect(skeletonSlot.createdAt).toBe(createdAt);
      expect(skeletonSlot.updatedAt).toBe(updatedAt);
    });

    it("should support Update operation by modifying properties", () => {
      const { createdAt, updatedAt } = generateTestDates();
      const skeletonSlot = new SkeletonSlot({
        robotId: generateTestId(),
        itemInstId: generateTestId(),
        createdAt,
        updatedAt,
      });

      // Update operations
      const newItemInstId = generateTestId();
      const newUpdatedAt = new Date();

      skeletonSlot.itemInstId = newItemInstId;
      skeletonSlot.updatedAt = newUpdatedAt;

      expect(skeletonSlot.itemInstId).toBe(newItemInstId);
      expect(skeletonSlot.updatedAt).toBe(newUpdatedAt);
    });

    it("should support Delete operation by clearing item instance", () => {
      const { createdAt, updatedAt } = generateTestDates();
      const skeletonSlot = new SkeletonSlot({
        robotId: generateTestId(),
        itemInstId: generateTestId(),
        createdAt,
        updatedAt,
      });

      // Simulate delete by clearing item instance (unequip)
      skeletonSlot.itemInstId = "";

      expect(skeletonSlot.itemInstId).toBe("");
      // Other properties should remain
      expect(skeletonSlot.robotId).toBeTruthy();
      expect(skeletonSlot.createdAt).toBe(createdAt);
      expect(skeletonSlot.updatedAt).toBe(updatedAt);
    });
  });

  describe("Edge Cases", () => {
    it("should handle empty string IDs", () => {
      const { createdAt, updatedAt } = generateTestDates();
      const skeletonSlot = new SkeletonSlot({
        robotId: "",
        itemInstId: "",
        createdAt,
        updatedAt,
      });

      expect(skeletonSlot.robotId).toBe("");
      expect(skeletonSlot.itemInstId).toBe("");
    });

    it("should handle very long IDs", () => {
      const { createdAt, updatedAt } = generateTestDates();
      const veryLongId = "a".repeat(1000);
      const skeletonSlot = new SkeletonSlot({
        robotId: veryLongId,
        itemInstId: veryLongId,
        createdAt,
        updatedAt,
      });

      expect(skeletonSlot.robotId).toBe(veryLongId);
      expect(skeletonSlot.itemInstId).toBe(veryLongId);
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
        const skeletonSlot = new SkeletonSlot({
          robotId: id,
          itemInstId: id,
          createdAt: generateTestDates().createdAt,
          updatedAt: generateTestDates().updatedAt,
        });

        expect(skeletonSlot.robotId).toBe(id);
        expect(skeletonSlot.itemInstId).toBe(id);
      });
    });
  });

  describe("Data Integrity", () => {
    it("should maintain data integrity after multiple updates", () => {
      const { createdAt, updatedAt } = generateTestDates();
      const originalRobotId = generateTestId();

      const skeletonSlot = new SkeletonSlot({
        robotId: originalRobotId,
        itemInstId: generateTestId(),
        createdAt,
        updatedAt,
      });

      // Multiple updates
      skeletonSlot.itemInstId = generateTestId();
      skeletonSlot.itemInstId = generateTestId();
      const finalItemInstId = generateTestId();
      skeletonSlot.itemInstId = finalItemInstId;

      // Robot ID should typically not change
      expect(skeletonSlot.robotId).toBe(originalRobotId);
      expect(skeletonSlot.itemInstId).toBe(finalItemInstId);
      expect(skeletonSlot.createdAt).toBe(createdAt);
    });

    it("should handle concurrent-like updates", () => {
      const { createdAt, updatedAt } = generateTestDates();
      const skeletonSlot = new SkeletonSlot({
        robotId: generateTestId(),
        itemInstId: generateTestId(),
        createdAt,
        updatedAt,
      });

      const update1 = new Date();
      const update2 = new Date(update1.getTime() + 1000);
      const item1 = generateTestId();
      const item2 = generateTestId();

      skeletonSlot.updatedAt = update1;
      skeletonSlot.itemInstId = item1;

      skeletonSlot.updatedAt = update2;
      skeletonSlot.itemInstId = item2;

      expect(skeletonSlot.itemInstId).toBe(item2);
      expect(skeletonSlot.updatedAt).toBe(update2);
    });
  });

  describe("Business Logic", () => {
    it("should support slot filtering by robot", () => {
      const { createdAt, updatedAt } = generateTestDates();
      const robot1Id = generateTestId();
      const robot2Id = generateTestId();

      const skeletonSlots = [
        new SkeletonSlot({
          robotId: robot1Id,
          itemInstId: generateTestId(),
          createdAt,
          updatedAt,
        }),
        new SkeletonSlot({
          robotId: robot2Id,
          itemInstId: generateTestId(),
          createdAt,
          updatedAt,
        }),
        new SkeletonSlot({
          robotId: robot1Id,
          itemInstId: generateTestId(),
          createdAt,
          updatedAt,
        }),
      ];

      const robot1Slots = skeletonSlots.filter((s) => s.robotId === robot1Id);
      const robot2Slots = skeletonSlots.filter((s) => s.robotId === robot2Id);

      expect(robot1Slots).toHaveLength(2);
      expect(robot2Slots).toHaveLength(1);
    });

    it("should support equipped item queries", () => {
      const { createdAt, updatedAt } = generateTestDates();
      const itemId = generateTestId();

      const skeletonSlots = [
        new SkeletonSlot({
          robotId: generateTestId(),
          itemInstId: itemId,
          createdAt,
          updatedAt,
        }),
        new SkeletonSlot({
          robotId: generateTestId(),
          itemInstId: generateTestId(),
          createdAt,
          updatedAt,
        }),
        new SkeletonSlot({
          robotId: generateTestId(),
          itemInstId: generateTestId(),
          createdAt,
          updatedAt,
        }),
      ];

      const slotsWithItem = skeletonSlots.filter(
        (s) => s.itemInstId === itemId
      );

      expect(slotsWithItem).toHaveLength(1);
    });

    it("should support empty slot detection", () => {
      const { createdAt, updatedAt } = generateTestDates();
      const skeletonSlots = [
        new SkeletonSlot({
          robotId: generateTestId(),
          itemInstId: generateTestId(),
          createdAt,
          updatedAt,
        }),
        new SkeletonSlot({
          robotId: generateTestId(),
          itemInstId: "",
          createdAt,
          updatedAt,
        }),
        new SkeletonSlot({
          robotId: generateTestId(),
          itemInstId: generateTestId(),
          createdAt,
          updatedAt,
        }),
      ];

      const emptySlots = skeletonSlots.filter((s) => s.itemInstId === "");
      const occupiedSlots = skeletonSlots.filter((s) => s.itemInstId !== "");

      expect(emptySlots).toHaveLength(1);
      expect(occupiedSlots).toHaveLength(2);
    });

    it("should support robot skeleton validation", () => {
      const { createdAt, updatedAt } = generateTestDates();
      const robotId = generateTestId();

      const skeletonSlots = [
        new SkeletonSlot({
          robotId,
          itemInstId: generateTestId(),
          createdAt,
          updatedAt,
        }),
      ];

      const robotSlots = skeletonSlots.filter((s) => s.robotId === robotId);

      expect(robotSlots).toHaveLength(1);
      expect(robotSlots[0].itemInstId).toBeTruthy();
    });

    it("should support skeleton swapping", () => {
      const { createdAt, updatedAt } = generateTestDates();
      const robotId = generateTestId();
      const oldSkeleton = generateTestId();
      const newSkeleton = generateTestId();

      const skeletonSlot = new SkeletonSlot({
        robotId,
        itemInstId: oldSkeleton,
        createdAt,
        updatedAt,
      });

      expect(skeletonSlot.itemInstId).toBe(oldSkeleton);

      // Swap skeleton
      skeletonSlot.itemInstId = newSkeleton;
      skeletonSlot.updatedAt = new Date();

      expect(skeletonSlot.itemInstId).toBe(newSkeleton);
      expect(skeletonSlot.itemInstId).not.toBe(oldSkeleton);
    });

    it("should support skeleton removal", () => {
      const { createdAt, updatedAt } = generateTestDates();
      const skeletonSlot = new SkeletonSlot({
        robotId: generateTestId(),
        itemInstId: generateTestId(),
        createdAt,
        updatedAt,
      });

      expect(skeletonSlot.itemInstId).toBeTruthy();

      // Remove skeleton
      skeletonSlot.itemInstId = "";
      skeletonSlot.updatedAt = new Date();

      expect(skeletonSlot.itemInstId).toBe("");
    });

    it("should support unique robot constraint simulation", () => {
      const { createdAt, updatedAt } = generateTestDates();
      const skeletonSlots = [
        new SkeletonSlot({
          robotId: "robot-1",
          itemInstId: generateTestId(),
          createdAt,
          updatedAt,
        }),
        new SkeletonSlot({
          robotId: "robot-2",
          itemInstId: generateTestId(),
          createdAt,
          updatedAt,
        }),
        new SkeletonSlot({
          robotId: "robot-3",
          itemInstId: generateTestId(),
          createdAt,
          updatedAt,
        }),
      ];

      const robotIds = skeletonSlots.map((s) => s.robotId);
      const uniqueRobotIds = [...new Set(robotIds)];

      // Each robot should have only one skeleton slot
      expect(robotIds).toHaveLength(3);
      expect(uniqueRobotIds).toHaveLength(3);
      expect(robotIds).toEqual(uniqueRobotIds);
    });
  });
});
