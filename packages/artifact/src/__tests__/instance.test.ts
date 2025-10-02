import { describe, it, expect } from "vitest";
import { Instance } from "../instance";
import {
  generateTestId,
  generateTestNumber,
  generateTestBigInt,
  generateTestDates,
  TEST_ENUMS,
  getRandomEnumValue,
} from "./test-utils";

describe("Instance", () => {
  describe("Constructor", () => {
    it("should create an Instance with all required properties", () => {
      const { createdAt, updatedAt } = generateTestDates();
      const props = {
        shardId: generateTestNumber(),
        playerId: generateTestBigInt(),
        templateId: generateTestId(),
        state: TEST_ENUMS.instance_state.NEW,
        boundToPlayer: generateTestId(),
        createdAt,
        updatedAt,
      };

      const instance = new Instance(props);

      expect(instance.shardId).toBe(props.shardId);
      expect(instance.playerId).toBe(props.playerId);
      expect(instance.templateId).toBe(props.templateId);
      expect(instance.state).toBe(props.state);
      expect(instance.boundToPlayer).toBe(props.boundToPlayer);
      expect(instance.createdAt).toBe(props.createdAt);
      expect(instance.updatedAt).toBe(props.updatedAt);
      expect(instance.id).toBe(""); // Default empty string when not provided
    });

    it("should create an Instance with provided id", () => {
      const { createdAt, updatedAt } = generateTestDates();
      const id = generateTestId();
      const props = {
        id,
        shardId: generateTestNumber(),
        playerId: generateTestBigInt(),
        templateId: generateTestId(),
        state: TEST_ENUMS.instance_state.USED,
        boundToPlayer: generateTestId(),
        createdAt,
        updatedAt,
      };

      const instance = new Instance(props);

      expect(instance.id).toBe(id);
      expect(instance.shardId).toBe(props.shardId);
      expect(instance.playerId).toBe(props.playerId);
      expect(instance.templateId).toBe(props.templateId);
      expect(instance.state).toBe(props.state);
      expect(instance.boundToPlayer).toBe(props.boundToPlayer);
    });
  });

  describe("CRUD Operations", () => {
    it("should support Create operation", () => {
      const { createdAt, updatedAt } = generateTestDates();
      const instanceData = {
        shardId: generateTestNumber(),
        playerId: generateTestBigInt(),
        templateId: generateTestId(),
        state: TEST_ENUMS.instance_state.NEW,
        boundToPlayer: generateTestId(),
        createdAt,
        updatedAt,
      };

      const instance = new Instance(instanceData);

      expect(instance).toBeInstanceOf(Instance);
      expect(instance.shardId).toBe(instanceData.shardId);
      expect(instance.playerId).toBe(instanceData.playerId);
      expect(instance.templateId).toBe(instanceData.templateId);
      expect(instance.state).toBe(instanceData.state);
    });

    it("should support Read operation by accessing properties", () => {
      const { createdAt, updatedAt } = generateTestDates();
      const id = generateTestId();
      const shardId = generateTestNumber();
      const playerId = generateTestBigInt();
      const templateId = generateTestId();
      const boundToPlayer = generateTestId();

      const instance = new Instance({
        id,
        shardId,
        playerId,
        templateId,
        state: TEST_ENUMS.instance_state.EQUIPPED,
        boundToPlayer,
        createdAt,
        updatedAt,
      });

      // Read operations
      expect(instance.id).toBe(id);
      expect(instance.shardId).toBe(shardId);
      expect(instance.playerId).toBe(playerId);
      expect(instance.templateId).toBe(templateId);
      expect(instance.state).toBe(TEST_ENUMS.instance_state.EQUIPPED);
      expect(instance.boundToPlayer).toBe(boundToPlayer);
      expect(instance.createdAt).toBe(createdAt);
      expect(instance.updatedAt).toBe(updatedAt);
    });

    it("should support Update operation by modifying properties", () => {
      const { createdAt, updatedAt } = generateTestDates();
      const instance = new Instance({
        id: generateTestId(),
        shardId: generateTestNumber(),
        playerId: generateTestBigInt(),
        templateId: generateTestId(),
        state: TEST_ENUMS.instance_state.NEW,
        boundToPlayer: generateTestId(),
        createdAt,
        updatedAt,
      });

      // Update operations
      const newState = TEST_ENUMS.instance_state.EQUIPPED;
      const newBoundToPlayer = generateTestId();
      const newUpdatedAt = new Date();

      instance.state = newState;
      instance.boundToPlayer = newBoundToPlayer;
      instance.updatedAt = newUpdatedAt;

      expect(instance.state).toBe(newState);
      expect(instance.boundToPlayer).toBe(newBoundToPlayer);
      expect(instance.updatedAt).toBe(newUpdatedAt);
    });

    it("should support Delete operation by setting to invalid state", () => {
      const { createdAt, updatedAt } = generateTestDates();
      const instance = new Instance({
        id: generateTestId(),
        shardId: generateTestNumber(),
        playerId: generateTestBigInt(),
        templateId: generateTestId(),
        state: TEST_ENUMS.instance_state.EQUIPPED,
        boundToPlayer: generateTestId(),
        createdAt,
        updatedAt,
      });

      // Simulate delete by clearing bound player (soft delete)
      instance.boundToPlayer = "";

      expect(instance.boundToPlayer).toBe("");
      // Other properties should remain for audit purposes
      expect(instance.id).toBeTruthy();
      expect(instance.shardId).toBeGreaterThanOrEqual(0);
      expect(instance.playerId).toBeGreaterThanOrEqual(0n);
      expect(instance.templateId).toBeTruthy();
      expect(instance.state).toBe(TEST_ENUMS.instance_state.EQUIPPED);
      expect(instance.createdAt).toBe(createdAt);
      expect(instance.updatedAt).toBe(updatedAt);
    });
  });

  describe("Instance State Enum", () => {
    it("should support all instance_state enum values", () => {
      const { createdAt, updatedAt } = generateTestDates();
      const baseProps = {
        shardId: generateTestNumber(),
        playerId: generateTestBigInt(),
        templateId: generateTestId(),
        boundToPlayer: generateTestId(),
        createdAt,
        updatedAt,
      };

      Object.values(TEST_ENUMS.instance_state).forEach((state) => {
        const instance = new Instance({ ...baseProps, state });
        expect(instance.state).toBe(state);
      });
    });

    it("should handle state transitions", () => {
      const { createdAt, updatedAt } = generateTestDates();
      const instance = new Instance({
        shardId: generateTestNumber(),
        playerId: generateTestBigInt(),
        templateId: generateTestId(),
        state: TEST_ENUMS.instance_state.NEW,
        boundToPlayer: generateTestId(),
        createdAt,
        updatedAt,
      });

      // Typical state progression: NEW -> USED -> EQUIPPED
      expect(instance.state).toBe(TEST_ENUMS.instance_state.NEW);

      instance.state = TEST_ENUMS.instance_state.USED;
      expect(instance.state).toBe(TEST_ENUMS.instance_state.USED);

      instance.state = TEST_ENUMS.instance_state.EQUIPPED;
      expect(instance.state).toBe(TEST_ENUMS.instance_state.EQUIPPED);

      // Can also go back
      instance.state = TEST_ENUMS.instance_state.USED;
      expect(instance.state).toBe(TEST_ENUMS.instance_state.USED);
    });
  });

  describe("Player and Shard Relationships", () => {
    it("should handle different shard IDs", () => {
      const { createdAt, updatedAt } = generateTestDates();
      const shardIds = [0, 1, 100, 999, Number.MAX_SAFE_INTEGER];

      shardIds.forEach((shardId) => {
        const instance = new Instance({
          shardId,
          playerId: generateTestBigInt(),
          templateId: generateTestId(),
          state: TEST_ENUMS.instance_state.NEW,
          boundToPlayer: generateTestId(),
          createdAt,
          updatedAt,
        });

        expect(instance.shardId).toBe(shardId);
      });
    });

    it("should handle different player IDs", () => {
      const { createdAt, updatedAt } = generateTestDates();
      const playerIds = [
        0n,
        1n,
        100n,
        999999999999n,
        BigInt(Number.MAX_SAFE_INTEGER),
      ];

      playerIds.forEach((playerId) => {
        const instance = new Instance({
          shardId: generateTestNumber(),
          playerId,
          templateId: generateTestId(),
          state: TEST_ENUMS.instance_state.NEW,
          boundToPlayer: generateTestId(),
          createdAt,
          updatedAt,
        });

        expect(instance.playerId).toBe(playerId);
      });
    });

    it("should handle player binding changes", () => {
      const { createdAt, updatedAt } = generateTestDates();
      const instance = new Instance({
        shardId: generateTestNumber(),
        playerId: generateTestBigInt(),
        templateId: generateTestId(),
        state: TEST_ENUMS.instance_state.NEW,
        boundToPlayer: generateTestId(),
        createdAt,
        updatedAt,
      });

      const originalBoundPlayer = instance.boundToPlayer;
      const newBoundPlayer = generateTestId();

      instance.boundToPlayer = newBoundPlayer;
      expect(instance.boundToPlayer).toBe(newBoundPlayer);
      expect(instance.boundToPlayer).not.toBe(originalBoundPlayer);

      // Can unbind
      instance.boundToPlayer = "";
      expect(instance.boundToPlayer).toBe("");
    });
  });

  describe("Edge Cases", () => {
    it("should handle zero values", () => {
      const { createdAt, updatedAt } = generateTestDates();
      const instance = new Instance({
        shardId: 0,
        playerId: 0n,
        templateId: generateTestId(),
        state: TEST_ENUMS.instance_state.NEW,
        boundToPlayer: "",
        createdAt,
        updatedAt,
      });

      expect(instance.shardId).toBe(0);
      expect(instance.playerId).toBe(0n);
      expect(instance.boundToPlayer).toBe("");
    });

    it("should handle negative shard IDs", () => {
      const { createdAt, updatedAt } = generateTestDates();
      const instance = new Instance({
        shardId: -1,
        playerId: generateTestBigInt(),
        templateId: generateTestId(),
        state: TEST_ENUMS.instance_state.NEW,
        boundToPlayer: generateTestId(),
        createdAt,
        updatedAt,
      });

      expect(instance.shardId).toBe(-1);
    });

    it("should handle empty template and bound player IDs", () => {
      const { createdAt, updatedAt } = generateTestDates();
      const instance = new Instance({
        shardId: generateTestNumber(),
        playerId: generateTestBigInt(),
        templateId: "",
        state: TEST_ENUMS.instance_state.NEW,
        boundToPlayer: "",
        createdAt,
        updatedAt,
      });

      expect(instance.templateId).toBe("");
      expect(instance.boundToPlayer).toBe("");
    });

    it("should handle very large BigInt player IDs", () => {
      const { createdAt, updatedAt } = generateTestDates();
      const veryLargePlayerId = BigInt("999999999999999999999999999999");
      const instance = new Instance({
        shardId: generateTestNumber(),
        playerId: veryLargePlayerId,
        templateId: generateTestId(),
        state: TEST_ENUMS.instance_state.NEW,
        boundToPlayer: generateTestId(),
        createdAt,
        updatedAt,
      });

      expect(instance.playerId).toBe(veryLargePlayerId);
      expect(typeof instance.playerId).toBe("bigint");
    });
  });

  describe("Data Integrity", () => {
    it("should maintain data integrity after multiple updates", () => {
      const { createdAt, updatedAt } = generateTestDates();
      const originalId = generateTestId();
      const originalShardId = generateTestNumber();
      const originalPlayerId = generateTestBigInt();
      const originalTemplateId = generateTestId();

      const instance = new Instance({
        id: originalId,
        shardId: originalShardId,
        playerId: originalPlayerId,
        templateId: originalTemplateId,
        state: TEST_ENUMS.instance_state.NEW,
        boundToPlayer: generateTestId(),
        createdAt,
        updatedAt,
      });

      // Multiple updates
      instance.state = TEST_ENUMS.instance_state.USED;
      instance.boundToPlayer = generateTestId();
      instance.state = TEST_ENUMS.instance_state.EQUIPPED;
      instance.boundToPlayer = generateTestId();

      // Core identifiers should not change
      expect(instance.id).toBe(originalId);
      expect(instance.shardId).toBe(originalShardId);
      expect(instance.playerId).toBe(originalPlayerId);
      expect(instance.templateId).toBe(originalTemplateId);
      expect(instance.state).toBe(TEST_ENUMS.instance_state.EQUIPPED);
      expect(instance.createdAt).toBe(createdAt);
    });

    it("should handle concurrent-like state changes", () => {
      const { createdAt, updatedAt } = generateTestDates();
      const instance = new Instance({
        shardId: generateTestNumber(),
        playerId: generateTestBigInt(),
        templateId: generateTestId(),
        state: TEST_ENUMS.instance_state.NEW,
        boundToPlayer: generateTestId(),
        createdAt,
        updatedAt,
      });

      const update1 = new Date();
      const update2 = new Date(update1.getTime() + 1000);

      instance.updatedAt = update1;
      instance.state = TEST_ENUMS.instance_state.USED;

      instance.updatedAt = update2;
      instance.state = TEST_ENUMS.instance_state.EQUIPPED;

      expect(instance.state).toBe(TEST_ENUMS.instance_state.EQUIPPED);
      expect(instance.updatedAt).toBe(update2);
    });
  });

  describe("Business Logic", () => {
    it("should support instance filtering by state", () => {
      const { createdAt, updatedAt } = generateTestDates();
      const instances = [
        new Instance({
          shardId: 1,
          playerId: 1n,
          templateId: generateTestId(),
          state: TEST_ENUMS.instance_state.NEW,
          boundToPlayer: generateTestId(),
          createdAt,
          updatedAt,
        }),
        new Instance({
          shardId: 1,
          playerId: 1n,
          templateId: generateTestId(),
          state: TEST_ENUMS.instance_state.USED,
          boundToPlayer: generateTestId(),
          createdAt,
          updatedAt,
        }),
        new Instance({
          shardId: 1,
          playerId: 1n,
          templateId: generateTestId(),
          state: TEST_ENUMS.instance_state.EQUIPPED,
          boundToPlayer: generateTestId(),
          createdAt,
          updatedAt,
        }),
        new Instance({
          shardId: 1,
          playerId: 1n,
          templateId: generateTestId(),
          state: TEST_ENUMS.instance_state.NEW,
          boundToPlayer: generateTestId(),
          createdAt,
          updatedAt,
        }),
      ];

      const newInstances = instances.filter(
        (i) => i.state === TEST_ENUMS.instance_state.NEW
      );
      const usedInstances = instances.filter(
        (i) => i.state === TEST_ENUMS.instance_state.USED
      );
      const equippedInstances = instances.filter(
        (i) => i.state === TEST_ENUMS.instance_state.EQUIPPED
      );

      expect(newInstances).toHaveLength(2);
      expect(usedInstances).toHaveLength(1);
      expect(equippedInstances).toHaveLength(1);
    });

    it("should support instance filtering by player", () => {
      const { createdAt, updatedAt } = generateTestDates();
      const player1Id = generateTestBigInt();
      const player2Id = generateTestBigInt();

      const instances = [
        new Instance({
          shardId: 1,
          playerId: player1Id,
          templateId: generateTestId(),
          state: TEST_ENUMS.instance_state.NEW,
          boundToPlayer: generateTestId(),
          createdAt,
          updatedAt,
        }),
        new Instance({
          shardId: 1,
          playerId: player2Id,
          templateId: generateTestId(),
          state: TEST_ENUMS.instance_state.NEW,
          boundToPlayer: generateTestId(),
          createdAt,
          updatedAt,
        }),
        new Instance({
          shardId: 1,
          playerId: player1Id,
          templateId: generateTestId(),
          state: TEST_ENUMS.instance_state.USED,
          boundToPlayer: generateTestId(),
          createdAt,
          updatedAt,
        }),
      ];

      const player1Instances = instances.filter(
        (i) => i.playerId === player1Id
      );
      const player2Instances = instances.filter(
        (i) => i.playerId === player2Id
      );

      expect(player1Instances).toHaveLength(2);
      expect(player2Instances).toHaveLength(1);
    });

    it("should support instance filtering by shard", () => {
      const { createdAt, updatedAt } = generateTestDates();
      const instances = [
        new Instance({
          shardId: 1,
          playerId: generateTestBigInt(),
          templateId: generateTestId(),
          state: TEST_ENUMS.instance_state.NEW,
          boundToPlayer: generateTestId(),
          createdAt,
          updatedAt,
        }),
        new Instance({
          shardId: 2,
          playerId: generateTestBigInt(),
          templateId: generateTestId(),
          state: TEST_ENUMS.instance_state.NEW,
          boundToPlayer: generateTestId(),
          createdAt,
          updatedAt,
        }),
        new Instance({
          shardId: 1,
          playerId: generateTestBigInt(),
          templateId: generateTestId(),
          state: TEST_ENUMS.instance_state.USED,
          boundToPlayer: generateTestId(),
          createdAt,
          updatedAt,
        }),
      ];

      const shard1Instances = instances.filter((i) => i.shardId === 1);
      const shard2Instances = instances.filter((i) => i.shardId === 2);

      expect(shard1Instances).toHaveLength(2);
      expect(shard2Instances).toHaveLength(1);
    });

    it("should support instance filtering by template", () => {
      const { createdAt, updatedAt } = generateTestDates();
      const template1Id = generateTestId();
      const template2Id = generateTestId();

      const instances = [
        new Instance({
          shardId: 1,
          playerId: generateTestBigInt(),
          templateId: template1Id,
          state: TEST_ENUMS.instance_state.NEW,
          boundToPlayer: generateTestId(),
          createdAt,
          updatedAt,
        }),
        new Instance({
          shardId: 1,
          playerId: generateTestBigInt(),
          templateId: template2Id,
          state: TEST_ENUMS.instance_state.NEW,
          boundToPlayer: generateTestId(),
          createdAt,
          updatedAt,
        }),
        new Instance({
          shardId: 1,
          playerId: generateTestBigInt(),
          templateId: template1Id,
          state: TEST_ENUMS.instance_state.USED,
          boundToPlayer: generateTestId(),
          createdAt,
          updatedAt,
        }),
      ];

      const template1Instances = instances.filter(
        (i) => i.templateId === template1Id
      );
      const template2Instances = instances.filter(
        (i) => i.templateId === template2Id
      );

      expect(template1Instances).toHaveLength(2);
      expect(template2Instances).toHaveLength(1);
    });

    it("should support equipped item queries", () => {
      const { createdAt, updatedAt } = generateTestDates();
      const playerId = generateTestBigInt();
      const boundPlayer = generateTestId();

      const instances = [
        new Instance({
          shardId: 1,
          playerId,
          templateId: generateTestId(),
          state: TEST_ENUMS.instance_state.EQUIPPED,
          boundToPlayer: boundPlayer,
          createdAt,
          updatedAt,
        }),
        new Instance({
          shardId: 1,
          playerId,
          templateId: generateTestId(),
          state: TEST_ENUMS.instance_state.USED,
          boundToPlayer: boundPlayer,
          createdAt,
          updatedAt,
        }),
        new Instance({
          shardId: 1,
          playerId,
          templateId: generateTestId(),
          state: TEST_ENUMS.instance_state.EQUIPPED,
          boundToPlayer: generateTestId(),
          createdAt,
          updatedAt,
        }),
      ];

      const equippedByPlayer = instances.filter(
        (i) =>
          i.state === TEST_ENUMS.instance_state.EQUIPPED &&
          i.boundToPlayer === boundPlayer
      );

      expect(equippedByPlayer).toHaveLength(1);
    });
  });
});
