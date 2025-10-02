import { describe, it, expect } from "vitest";
import { PartSlot } from "../parts-slot";
import {
  generateTestId,
  generateTestDates,
  TEST_ENUMS,
  getRandomEnumValue,
} from "./test-utils";

describe("PartSlot", () => {
  describe("Constructor", () => {
    it("should create a PartSlot instance with all required properties", () => {
      const { createdAt, updatedAt } = generateTestDates();
      const props = {
        robotId: generateTestId(),
        slotType: TEST_ENUMS.robot_part_slot.TORSO,
        itemInstId: generateTestId(),
        createdAt,
        updatedAt,
      };

      const partSlot = new PartSlot(props);

      expect(partSlot.robotId).toBe(props.robotId);
      expect(partSlot.slotType).toBe(props.slotType);
      expect(partSlot.itemInstId).toBe(props.itemInstId);
      expect(partSlot.createdAt).toBe(props.createdAt);
      expect(partSlot.updatedAt).toBe(props.updatedAt);
    });
  });

  describe("CRUD Operations", () => {
    it("should support Create operation", () => {
      const { createdAt, updatedAt } = generateTestDates();
      const partSlotData = {
        robotId: generateTestId(),
        slotType: TEST_ENUMS.robot_part_slot.ARM_R,
        itemInstId: generateTestId(),
        createdAt,
        updatedAt,
      };

      const partSlot = new PartSlot(partSlotData);

      expect(partSlot).toBeInstanceOf(PartSlot);
      expect(partSlot.robotId).toBe(partSlotData.robotId);
      expect(partSlot.slotType).toBe(partSlotData.slotType);
      expect(partSlot.itemInstId).toBe(partSlotData.itemInstId);
    });

    it("should support Read operation by accessing properties", () => {
      const { createdAt, updatedAt } = generateTestDates();
      const robotId = generateTestId();
      const itemInstId = generateTestId();
      const partSlot = new PartSlot({
        robotId,
        slotType: TEST_ENUMS.robot_part_slot.ARM_L,
        itemInstId,
        createdAt,
        updatedAt,
      });

      // Read operations
      expect(partSlot.robotId).toBe(robotId);
      expect(partSlot.slotType).toBe(TEST_ENUMS.robot_part_slot.ARM_L);
      expect(partSlot.itemInstId).toBe(itemInstId);
      expect(partSlot.createdAt).toBe(createdAt);
      expect(partSlot.updatedAt).toBe(updatedAt);
    });

    it("should support Update operation by modifying properties", () => {
      const { createdAt, updatedAt } = generateTestDates();
      const partSlot = new PartSlot({
        robotId: generateTestId(),
        slotType: TEST_ENUMS.robot_part_slot.TORSO,
        itemInstId: generateTestId(),
        createdAt,
        updatedAt,
      });

      // Update operations
      const newItemInstId = generateTestId();
      const newUpdatedAt = new Date();

      partSlot.itemInstId = newItemInstId;
      partSlot.updatedAt = newUpdatedAt;

      expect(partSlot.itemInstId).toBe(newItemInstId);
      expect(partSlot.updatedAt).toBe(newUpdatedAt);
    });

    it("should support Delete operation by clearing item instance", () => {
      const { createdAt, updatedAt } = generateTestDates();
      const partSlot = new PartSlot({
        robotId: generateTestId(),
        slotType: TEST_ENUMS.robot_part_slot.LEGS,
        itemInstId: generateTestId(),
        createdAt,
        updatedAt,
      });

      // Simulate delete by clearing item instance (unequip)
      partSlot.itemInstId = "";

      expect(partSlot.itemInstId).toBe("");
      // Other properties should remain
      expect(partSlot.robotId).toBeTruthy();
      expect(partSlot.slotType).toBe(TEST_ENUMS.robot_part_slot.LEGS);
      expect(partSlot.createdAt).toBe(createdAt);
      expect(partSlot.updatedAt).toBe(updatedAt);
    });
  });

  describe("Robot Part Slot Enum", () => {
    it("should support all robot_part_slot enum values", () => {
      const { createdAt, updatedAt } = generateTestDates();
      const baseProps = {
        robotId: generateTestId(),
        itemInstId: generateTestId(),
        createdAt,
        updatedAt,
      };

      Object.values(TEST_ENUMS.robot_part_slot).forEach((slotType) => {
        const partSlot = new PartSlot({ ...baseProps, slotType });
        expect(partSlot.slotType).toBe(slotType);
      });
    });

    it("should handle slot type changes", () => {
      const { createdAt, updatedAt } = generateTestDates();
      const partSlot = new PartSlot({
        robotId: generateTestId(),
        slotType: TEST_ENUMS.robot_part_slot.TORSO,
        itemInstId: generateTestId(),
        createdAt,
        updatedAt,
      });

      // Change slot types
      partSlot.slotType = TEST_ENUMS.robot_part_slot.ARM_R;
      expect(partSlot.slotType).toBe(TEST_ENUMS.robot_part_slot.ARM_R);

      partSlot.slotType = TEST_ENUMS.robot_part_slot.ARM_L;
      expect(partSlot.slotType).toBe(TEST_ENUMS.robot_part_slot.ARM_L);

      partSlot.slotType = TEST_ENUMS.robot_part_slot.LEGS;
      expect(partSlot.slotType).toBe(TEST_ENUMS.robot_part_slot.LEGS);
    });
  });

  describe("Edge Cases", () => {
    it("should handle empty string IDs", () => {
      const { createdAt, updatedAt } = generateTestDates();
      const partSlot = new PartSlot({
        robotId: "",
        slotType: TEST_ENUMS.robot_part_slot.TORSO,
        itemInstId: "",
        createdAt,
        updatedAt,
      });

      expect(partSlot.robotId).toBe("");
      expect(partSlot.itemInstId).toBe("");
    });

    it("should handle very long IDs", () => {
      const { createdAt, updatedAt } = generateTestDates();
      const veryLongId = "a".repeat(1000);
      const partSlot = new PartSlot({
        robotId: veryLongId,
        slotType: TEST_ENUMS.robot_part_slot.ARM_R,
        itemInstId: veryLongId,
        createdAt,
        updatedAt,
      });

      expect(partSlot.robotId).toBe(veryLongId);
      expect(partSlot.itemInstId).toBe(veryLongId);
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
        const partSlot = new PartSlot({
          robotId: id,
          slotType: getRandomEnumValue(TEST_ENUMS.robot_part_slot),
          itemInstId: id,
          createdAt: generateTestDates().createdAt,
          updatedAt: generateTestDates().updatedAt,
        });

        expect(partSlot.robotId).toBe(id);
        expect(partSlot.itemInstId).toBe(id);
      });
    });
  });

  describe("Data Integrity", () => {
    it("should maintain data integrity after multiple updates", () => {
      const { createdAt, updatedAt } = generateTestDates();
      const originalRobotId = generateTestId();
      const originalSlotType = TEST_ENUMS.robot_part_slot.TORSO;

      const partSlot = new PartSlot({
        robotId: originalRobotId,
        slotType: originalSlotType,
        itemInstId: generateTestId(),
        createdAt,
        updatedAt,
      });

      // Multiple updates
      partSlot.itemInstId = generateTestId();
      partSlot.itemInstId = generateTestId();
      const finalItemInstId = generateTestId();
      partSlot.itemInstId = finalItemInstId;

      // Core identifiers should typically not change
      expect(partSlot.robotId).toBe(originalRobotId);
      expect(partSlot.slotType).toBe(originalSlotType);
      expect(partSlot.itemInstId).toBe(finalItemInstId);
      expect(partSlot.createdAt).toBe(createdAt);
    });

    it("should handle concurrent-like updates", () => {
      const { createdAt, updatedAt } = generateTestDates();
      const partSlot = new PartSlot({
        robotId: generateTestId(),
        slotType: TEST_ENUMS.robot_part_slot.ARM_R,
        itemInstId: generateTestId(),
        createdAt,
        updatedAt,
      });

      const update1 = new Date();
      const update2 = new Date(update1.getTime() + 1000);
      const item1 = generateTestId();
      const item2 = generateTestId();

      partSlot.updatedAt = update1;
      partSlot.itemInstId = item1;

      partSlot.updatedAt = update2;
      partSlot.itemInstId = item2;

      expect(partSlot.itemInstId).toBe(item2);
      expect(partSlot.updatedAt).toBe(update2);
    });
  });

  describe("Business Logic", () => {
    it("should support slot filtering by robot", () => {
      const { createdAt, updatedAt } = generateTestDates();
      const robot1Id = generateTestId();
      const robot2Id = generateTestId();

      const partSlots = [
        new PartSlot({
          robotId: robot1Id,
          slotType: TEST_ENUMS.robot_part_slot.TORSO,
          itemInstId: generateTestId(),
          createdAt,
          updatedAt,
        }),
        new PartSlot({
          robotId: robot2Id,
          slotType: TEST_ENUMS.robot_part_slot.ARM_R,
          itemInstId: generateTestId(),
          createdAt,
          updatedAt,
        }),
        new PartSlot({
          robotId: robot1Id,
          slotType: TEST_ENUMS.robot_part_slot.ARM_L,
          itemInstId: generateTestId(),
          createdAt,
          updatedAt,
        }),
      ];

      const robot1Slots = partSlots.filter((s) => s.robotId === robot1Id);
      const robot2Slots = partSlots.filter((s) => s.robotId === robot2Id);

      expect(robot1Slots).toHaveLength(2);
      expect(robot2Slots).toHaveLength(1);
    });

    it("should support slot filtering by type", () => {
      const { createdAt, updatedAt } = generateTestDates();
      const partSlots = [
        new PartSlot({
          robotId: generateTestId(),
          slotType: TEST_ENUMS.robot_part_slot.TORSO,
          itemInstId: generateTestId(),
          createdAt,
          updatedAt,
        }),
        new PartSlot({
          robotId: generateTestId(),
          slotType: TEST_ENUMS.robot_part_slot.ARM_R,
          itemInstId: generateTestId(),
          createdAt,
          updatedAt,
        }),
        new PartSlot({
          robotId: generateTestId(),
          slotType: TEST_ENUMS.robot_part_slot.ARM_L,
          itemInstId: generateTestId(),
          createdAt,
          updatedAt,
        }),
        new PartSlot({
          robotId: generateTestId(),
          slotType: TEST_ENUMS.robot_part_slot.ARM_R,
          itemInstId: generateTestId(),
          createdAt,
          updatedAt,
        }),
      ];

      const torsoSlots = partSlots.filter(
        (s) => s.slotType === TEST_ENUMS.robot_part_slot.TORSO
      );
      const armRSlots = partSlots.filter(
        (s) => s.slotType === TEST_ENUMS.robot_part_slot.ARM_R
      );
      const armLSlots = partSlots.filter(
        (s) => s.slotType === TEST_ENUMS.robot_part_slot.ARM_L
      );

      expect(torsoSlots).toHaveLength(1);
      expect(armRSlots).toHaveLength(2);
      expect(armLSlots).toHaveLength(1);
    });

    it("should support equipped item queries", () => {
      const { createdAt, updatedAt } = generateTestDates();
      const itemId = generateTestId();

      const partSlots = [
        new PartSlot({
          robotId: generateTestId(),
          slotType: TEST_ENUMS.robot_part_slot.TORSO,
          itemInstId: itemId,
          createdAt,
          updatedAt,
        }),
        new PartSlot({
          robotId: generateTestId(),
          slotType: TEST_ENUMS.robot_part_slot.ARM_R,
          itemInstId: generateTestId(),
          createdAt,
          updatedAt,
        }),
        new PartSlot({
          robotId: generateTestId(),
          slotType: TEST_ENUMS.robot_part_slot.ARM_L,
          itemInstId: generateTestId(),
          createdAt,
          updatedAt,
        }),
      ];

      const slotsWithItem = partSlots.filter((s) => s.itemInstId === itemId);

      expect(slotsWithItem).toHaveLength(1);
      expect(slotsWithItem[0].slotType).toBe(TEST_ENUMS.robot_part_slot.TORSO);
    });

    it("should support empty slot detection", () => {
      const { createdAt, updatedAt } = generateTestDates();
      const partSlots = [
        new PartSlot({
          robotId: generateTestId(),
          slotType: TEST_ENUMS.robot_part_slot.TORSO,
          itemInstId: generateTestId(),
          createdAt,
          updatedAt,
        }),
        new PartSlot({
          robotId: generateTestId(),
          slotType: TEST_ENUMS.robot_part_slot.ARM_R,
          itemInstId: "",
          createdAt,
          updatedAt,
        }),
        new PartSlot({
          robotId: generateTestId(),
          slotType: TEST_ENUMS.robot_part_slot.ARM_L,
          itemInstId: generateTestId(),
          createdAt,
          updatedAt,
        }),
      ];

      const emptySlots = partSlots.filter((s) => s.itemInstId === "");
      const occupiedSlots = partSlots.filter((s) => s.itemInstId !== "");

      expect(emptySlots).toHaveLength(1);
      expect(occupiedSlots).toHaveLength(2);
      expect(emptySlots[0].slotType).toBe(TEST_ENUMS.robot_part_slot.ARM_R);
    });

    it("should support robot loadout validation", () => {
      const { createdAt, updatedAt } = generateTestDates();
      const robotId = generateTestId();

      const partSlots = [
        new PartSlot({
          robotId,
          slotType: TEST_ENUMS.robot_part_slot.TORSO,
          itemInstId: generateTestId(),
          createdAt,
          updatedAt,
        }),
        new PartSlot({
          robotId,
          slotType: TEST_ENUMS.robot_part_slot.ARM_R,
          itemInstId: generateTestId(),
          createdAt,
          updatedAt,
        }),
        new PartSlot({
          robotId,
          slotType: TEST_ENUMS.robot_part_slot.ARM_L,
          itemInstId: generateTestId(),
          createdAt,
          updatedAt,
        }),
        new PartSlot({
          robotId,
          slotType: TEST_ENUMS.robot_part_slot.LEGS,
          itemInstId: generateTestId(),
          createdAt,
          updatedAt,
        }),
      ];

      const robotSlots = partSlots.filter((s) => s.robotId === robotId);
      const slotTypes = robotSlots.map((s) => s.slotType);
      const uniqueSlotTypes = [...new Set(slotTypes)];

      expect(robotSlots).toHaveLength(4);
      expect(uniqueSlotTypes).toHaveLength(4); // All slots should be unique
      expect(uniqueSlotTypes).toContain(TEST_ENUMS.robot_part_slot.TORSO);
      expect(uniqueSlotTypes).toContain(TEST_ENUMS.robot_part_slot.ARM_R);
      expect(uniqueSlotTypes).toContain(TEST_ENUMS.robot_part_slot.ARM_L);
      expect(uniqueSlotTypes).toContain(TEST_ENUMS.robot_part_slot.LEGS);
    });

    it("should support slot type grouping", () => {
      const { createdAt, updatedAt } = generateTestDates();
      const partSlots = [
        new PartSlot({
          robotId: generateTestId(),
          slotType: TEST_ENUMS.robot_part_slot.ARM_R,
          itemInstId: generateTestId(),
          createdAt,
          updatedAt,
        }),
        new PartSlot({
          robotId: generateTestId(),
          slotType: TEST_ENUMS.robot_part_slot.ARM_L,
          itemInstId: generateTestId(),
          createdAt,
          updatedAt,
        }),
        new PartSlot({
          robotId: generateTestId(),
          slotType: TEST_ENUMS.robot_part_slot.ARM_R,
          itemInstId: generateTestId(),
          createdAt,
          updatedAt,
        }),
        new PartSlot({
          robotId: generateTestId(),
          slotType: TEST_ENUMS.robot_part_slot.TORSO,
          itemInstId: generateTestId(),
          createdAt,
          updatedAt,
        }),
      ];

      const armSlots = partSlots.filter(
        (s) =>
          s.slotType === TEST_ENUMS.robot_part_slot.ARM_R ||
          s.slotType === TEST_ENUMS.robot_part_slot.ARM_L
      );
      const bodySlots = partSlots.filter(
        (s) =>
          s.slotType === TEST_ENUMS.robot_part_slot.TORSO ||
          s.slotType === TEST_ENUMS.robot_part_slot.LEGS
      );

      expect(armSlots).toHaveLength(3);
      expect(bodySlots).toHaveLength(1);
    });
  });
});
