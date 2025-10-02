import { describe, it, expect } from "vitest";
import { Shard } from "../shard";
import { generateTestNumber, generateTestDates } from "./test-utils";

describe("Shard", () => {
  describe("Constructor", () => {
    it("should create a Shard instance with all required properties", () => {
      const { createdAt, updatedAt } = generateTestDates();
      const shardId = generateTestNumber();
      const props = {
        shardId,
        createdAt,
        updatedAt,
      };

      const shard = new Shard(props);

      expect(shard.shardId).toBe(shardId);
      expect(shard.createdAt).toBe(props.createdAt);
      expect(shard.updatedAt).toBe(props.updatedAt);
    });

    it("should handle shardId of 0", () => {
      const { createdAt, updatedAt } = generateTestDates();
      const props = {
        shardId: 0,
        createdAt,
        updatedAt,
      };

      const shard = new Shard(props);

      expect(shard.shardId).toBe(0);
    });
  });

  describe("CRUD Operations", () => {
    it("should support Create operation", () => {
      const { createdAt, updatedAt } = generateTestDates();
      const shardData = {
        shardId: generateTestNumber(),
        createdAt,
        updatedAt,
      };

      const shard = new Shard(shardData);

      expect(shard).toBeInstanceOf(Shard);
      expect(shard.shardId).toBe(shardData.shardId);
      expect(shard.createdAt).toBe(shardData.createdAt);
      expect(shard.updatedAt).toBe(shardData.updatedAt);
    });

    it("should support Read operation by accessing properties", () => {
      const { createdAt, updatedAt } = generateTestDates();
      const shardId = generateTestNumber();
      const shard = new Shard({
        shardId,
        createdAt,
        updatedAt,
      });

      // Read operations
      expect(shard.shardId).toBe(shardId);
      expect(shard.createdAt).toBe(createdAt);
      expect(shard.updatedAt).toBe(updatedAt);
    });

    it("should support Update operation by modifying properties", () => {
      const { createdAt, updatedAt } = generateTestDates();
      const shard = new Shard({
        shardId: generateTestNumber(),
        createdAt,
        updatedAt,
      });

      // Update operations
      const newShardId = generateTestNumber();
      const newUpdatedAt = new Date();

      shard.shardId = newShardId;
      shard.updatedAt = newUpdatedAt;

      expect(shard.shardId).toBe(newShardId);
      expect(shard.updatedAt).toBe(newUpdatedAt);
    });

    it("should support Delete operation by setting to default values", () => {
      const { createdAt, updatedAt } = generateTestDates();
      const shard = new Shard({
        shardId: generateTestNumber(),
        createdAt,
        updatedAt,
      });

      // Simulate delete by setting to default/invalid state
      shard.shardId = -1; // Invalid shard ID to indicate deletion

      expect(shard.shardId).toBe(-1);
      // Timestamps should remain for audit purposes
      expect(shard.createdAt).toBe(createdAt);
      expect(shard.updatedAt).toBe(updatedAt);
    });
  });

  describe("Edge Cases", () => {
    it("should handle negative shard IDs", () => {
      const { createdAt, updatedAt } = generateTestDates();
      const shard = new Shard({
        shardId: -1,
        createdAt,
        updatedAt,
      });

      expect(shard.shardId).toBe(-1);
    });

    it("should handle very large shard IDs", () => {
      const { createdAt, updatedAt } = generateTestDates();
      const largeShardId = Number.MAX_SAFE_INTEGER;
      const shard = new Shard({
        shardId: largeShardId,
        createdAt,
        updatedAt,
      });

      expect(shard.shardId).toBe(largeShardId);
    });

    it("should handle date edge cases", () => {
      const veryOldDate = new Date("1970-01-01");
      const futureDate = new Date("2099-12-31");

      const shard = new Shard({
        shardId: generateTestNumber(),
        createdAt: veryOldDate,
        updatedAt: futureDate,
      });

      expect(shard.createdAt).toBe(veryOldDate);
      expect(shard.updatedAt).toBe(futureDate);
    });
  });

  describe("Data Integrity", () => {
    it("should maintain data integrity after multiple updates", () => {
      const { createdAt, updatedAt } = generateTestDates();
      const originalShardId = generateTestNumber();
      const shard = new Shard({
        shardId: originalShardId,
        createdAt,
        updatedAt,
      });

      // Multiple updates
      shard.shardId = generateTestNumber();
      shard.shardId = generateTestNumber();
      const finalShardId = generateTestNumber();
      shard.shardId = finalShardId;

      expect(shard.shardId).toBe(finalShardId);
      expect(shard.createdAt).toBe(createdAt); // Created date should not change
    });

    it("should handle concurrent-like updates", () => {
      const { createdAt, updatedAt } = generateTestDates();
      const shard = new Shard({
        shardId: generateTestNumber(),
        createdAt,
        updatedAt,
      });

      const update1 = new Date();
      const update2 = new Date(update1.getTime() + 1000);

      shard.updatedAt = update1;
      shard.shardId = 100;

      shard.updatedAt = update2;
      shard.shardId = 200;

      expect(shard.shardId).toBe(200);
      expect(shard.updatedAt).toBe(update2);
    });

    it("should preserve type safety for shardId", () => {
      const { createdAt, updatedAt } = generateTestDates();
      const shard = new Shard({
        shardId: 42,
        createdAt,
        updatedAt,
      });

      expect(typeof shard.shardId).toBe("number");
      expect(Number.isInteger(shard.shardId)).toBe(true);
    });
  });

  describe("Business Logic", () => {
    it("should support shard comparison", () => {
      const { createdAt, updatedAt } = generateTestDates();
      const shard1 = new Shard({ shardId: 1, createdAt, updatedAt });
      const shard2 = new Shard({ shardId: 2, createdAt, updatedAt });
      const shard3 = new Shard({ shardId: 1, createdAt, updatedAt });

      expect(shard1.shardId).toBeLessThan(shard2.shardId);
      expect(shard1.shardId).toBe(shard3.shardId);
    });

    it("should support shard ordering", () => {
      const { createdAt, updatedAt } = generateTestDates();
      const shards = [
        new Shard({ shardId: 3, createdAt, updatedAt }),
        new Shard({ shardId: 1, createdAt, updatedAt }),
        new Shard({ shardId: 2, createdAt, updatedAt }),
      ];

      shards.sort((a, b) => a.shardId - b.shardId);

      expect(shards[0].shardId).toBe(1);
      expect(shards[1].shardId).toBe(2);
      expect(shards[2].shardId).toBe(3);
    });
  });
});
