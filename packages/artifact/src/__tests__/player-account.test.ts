import { describe, it, expect } from "vitest";
import { PlayerAccount } from "../player-account";
import {
  generateTestId,
  generateTestNumber,
  generateTestDates,
} from "./test-utils";

describe("PlayerAccount", () => {
  describe("Constructor", () => {
    it("should create a PlayerAccount instance with all required properties", () => {
      const { createdAt, updatedAt } = generateTestDates();
      const props = {
        id: generateTestId(),
        shardId: generateTestNumber(),
        globalPlayerId: generateTestId(),
        createdAt,
        updatedAt,
      };

      const playerAccount = new PlayerAccount(props);

      expect(playerAccount.id).toBe(props.id);
      expect(playerAccount.shardId).toBe(props.shardId);
      expect(playerAccount.globalPlayerId).toBe(props.globalPlayerId);
      expect(playerAccount.createdAt).toBe(props.createdAt);
      expect(playerAccount.updatedAt).toBe(props.updatedAt);
    });
  });

  describe("CRUD Operations", () => {
    it("should support Create operation", () => {
      const { createdAt, updatedAt } = generateTestDates();
      const playerAccountData = {
        id: generateTestId(),
        shardId: generateTestNumber(),
        globalPlayerId: generateTestId(),
        createdAt,
        updatedAt,
      };

      const playerAccount = new PlayerAccount(playerAccountData);

      expect(playerAccount).toBeInstanceOf(PlayerAccount);
      expect(playerAccount.id).toBe(playerAccountData.id);
      expect(playerAccount.shardId).toBe(playerAccountData.shardId);
      expect(playerAccount.globalPlayerId).toBe(
        playerAccountData.globalPlayerId
      );
    });

    it("should support Read operation by accessing properties", () => {
      const { createdAt, updatedAt } = generateTestDates();
      const id = generateTestId();
      const shardId = generateTestNumber();
      const globalPlayerId = generateTestId();

      const playerAccount = new PlayerAccount({
        id,
        shardId,
        globalPlayerId,
        createdAt,
        updatedAt,
      });

      // Read operations
      expect(playerAccount.id).toBe(id);
      expect(playerAccount.shardId).toBe(shardId);
      expect(playerAccount.globalPlayerId).toBe(globalPlayerId);
      expect(playerAccount.createdAt).toBe(createdAt);
      expect(playerAccount.updatedAt).toBe(updatedAt);
    });

    it("should support Update operation by modifying properties", () => {
      const { createdAt, updatedAt } = generateTestDates();
      const playerAccount = new PlayerAccount({
        id: generateTestId(),
        shardId: generateTestNumber(),
        globalPlayerId: generateTestId(),
        createdAt,
        updatedAt,
      });

      // Update operations (typically only updatedAt would change)
      const newUpdatedAt = new Date();

      playerAccount.updatedAt = newUpdatedAt;

      expect(playerAccount.updatedAt).toBe(newUpdatedAt);
    });

    it("should support Delete operation by marking as inactive", () => {
      const { createdAt, updatedAt } = generateTestDates();
      const playerAccount = new PlayerAccount({
        id: generateTestId(),
        shardId: generateTestNumber(),
        globalPlayerId: generateTestId(),
        createdAt,
        updatedAt,
      });

      // Simulate delete by clearing global player ID (soft delete)
      playerAccount.globalPlayerId = "";

      expect(playerAccount.globalPlayerId).toBe("");
      // Other properties should remain for audit purposes
      expect(playerAccount.id).toBeTruthy();
      expect(playerAccount.shardId).toBeGreaterThanOrEqual(0);
      expect(playerAccount.createdAt).toBe(createdAt);
      expect(playerAccount.updatedAt).toBe(updatedAt);
    });
  });

  describe("Shard Relationships", () => {
    it("should handle different shard IDs", () => {
      const { createdAt, updatedAt } = generateTestDates();
      const shardIds = [0, 1, 100, 999, Number.MAX_SAFE_INTEGER];

      shardIds.forEach((shardId) => {
        const playerAccount = new PlayerAccount({
          id: generateTestId(),
          shardId,
          globalPlayerId: generateTestId(),
          createdAt,
          updatedAt,
        });

        expect(playerAccount.shardId).toBe(shardId);
      });
    });

    it("should handle negative shard IDs", () => {
      const { createdAt, updatedAt } = generateTestDates();
      const playerAccount = new PlayerAccount({
        id: generateTestId(),
        shardId: -1,
        globalPlayerId: generateTestId(),
        createdAt,
        updatedAt,
      });

      expect(playerAccount.shardId).toBe(-1);
    });
  });

  describe("Global Player ID Handling", () => {
    it("should handle various global player ID formats", () => {
      const { createdAt, updatedAt } = generateTestDates();
      const globalPlayerIds = [
        "uuid-format-12345678-1234-1234-1234-123456789012",
        "simple-id",
        "player_123",
        "PLAYER-456",
        "player.789",
        "123456789",
        "global@player#id",
      ];

      globalPlayerIds.forEach((globalPlayerId) => {
        const playerAccount = new PlayerAccount({
          id: generateTestId(),
          shardId: generateTestNumber(),
          globalPlayerId,
          createdAt: generateTestDates().createdAt,
          updatedAt: generateTestDates().updatedAt,
        });

        expect(playerAccount.globalPlayerId).toBe(globalPlayerId);
      });
    });

    it("should handle empty global player ID", () => {
      const { createdAt, updatedAt } = generateTestDates();
      const playerAccount = new PlayerAccount({
        id: generateTestId(),
        shardId: generateTestNumber(),
        globalPlayerId: "",
        createdAt,
        updatedAt,
      });

      expect(playerAccount.globalPlayerId).toBe("");
    });

    it("should handle very long global player IDs", () => {
      const { createdAt, updatedAt } = generateTestDates();
      const veryLongId = "a".repeat(1000);
      const playerAccount = new PlayerAccount({
        id: generateTestId(),
        shardId: generateTestNumber(),
        globalPlayerId: veryLongId,
        createdAt,
        updatedAt,
      });

      expect(playerAccount.globalPlayerId).toBe(veryLongId);
    });
  });

  describe("Edge Cases", () => {
    it("should handle empty string IDs", () => {
      const { createdAt, updatedAt } = generateTestDates();
      const playerAccount = new PlayerAccount({
        id: "",
        shardId: 0,
        globalPlayerId: "",
        createdAt,
        updatedAt,
      });

      expect(playerAccount.id).toBe("");
      expect(playerAccount.shardId).toBe(0);
      expect(playerAccount.globalPlayerId).toBe("");
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
        const playerAccount = new PlayerAccount({
          id,
          shardId: generateTestNumber(),
          globalPlayerId: id,
          createdAt: generateTestDates().createdAt,
          updatedAt: generateTestDates().updatedAt,
        });

        expect(playerAccount.id).toBe(id);
        expect(playerAccount.globalPlayerId).toBe(id);
      });
    });

    it("should handle date edge cases", () => {
      const veryOldDate = new Date("1970-01-01");
      const futureDate = new Date("2099-12-31");

      const playerAccount = new PlayerAccount({
        id: generateTestId(),
        shardId: generateTestNumber(),
        globalPlayerId: generateTestId(),
        createdAt: veryOldDate,
        updatedAt: futureDate,
      });

      expect(playerAccount.createdAt).toBe(veryOldDate);
      expect(playerAccount.updatedAt).toBe(futureDate);
    });
  });

  describe("Data Integrity", () => {
    it("should maintain data integrity after multiple updates", () => {
      const { createdAt, updatedAt } = generateTestDates();
      const originalId = generateTestId();
      const originalShardId = generateTestNumber();
      const originalGlobalPlayerId = generateTestId();

      const playerAccount = new PlayerAccount({
        id: originalId,
        shardId: originalShardId,
        globalPlayerId: originalGlobalPlayerId,
        createdAt,
        updatedAt,
      });

      // Multiple updates (typically only updatedAt would change)
      const update1 = new Date();
      const update2 = new Date(update1.getTime() + 1000);
      const update3 = new Date(update2.getTime() + 1000);

      playerAccount.updatedAt = update1;
      playerAccount.updatedAt = update2;
      playerAccount.updatedAt = update3;

      // Core identifiers should not change
      expect(playerAccount.id).toBe(originalId);
      expect(playerAccount.shardId).toBe(originalShardId);
      expect(playerAccount.globalPlayerId).toBe(originalGlobalPlayerId);
      expect(playerAccount.updatedAt).toBe(update3);
      expect(playerAccount.createdAt).toBe(createdAt);
    });

    it("should handle concurrent-like updates", () => {
      const { createdAt, updatedAt } = generateTestDates();
      const playerAccount = new PlayerAccount({
        id: generateTestId(),
        shardId: generateTestNumber(),
        globalPlayerId: generateTestId(),
        createdAt,
        updatedAt,
      });

      const update1 = new Date();
      const update2 = new Date(update1.getTime() + 1000);

      playerAccount.updatedAt = update1;
      playerAccount.updatedAt = update2;

      expect(playerAccount.updatedAt).toBe(update2);
    });

    it("should preserve type safety for numeric fields", () => {
      const { createdAt, updatedAt } = generateTestDates();
      const playerAccount = new PlayerAccount({
        id: generateTestId(),
        shardId: 42,
        globalPlayerId: generateTestId(),
        createdAt,
        updatedAt,
      });

      expect(typeof playerAccount.shardId).toBe("number");
      expect(Number.isInteger(playerAccount.shardId)).toBe(true);
    });
  });

  describe("Business Logic", () => {
    it("should support account filtering by shard", () => {
      const { createdAt, updatedAt } = generateTestDates();
      const accounts = [
        new PlayerAccount({
          id: generateTestId(),
          shardId: 1,
          globalPlayerId: generateTestId(),
          createdAt,
          updatedAt,
        }),
        new PlayerAccount({
          id: generateTestId(),
          shardId: 2,
          globalPlayerId: generateTestId(),
          createdAt,
          updatedAt,
        }),
        new PlayerAccount({
          id: generateTestId(),
          shardId: 1,
          globalPlayerId: generateTestId(),
          createdAt,
          updatedAt,
        }),
      ];

      const shard1Accounts = accounts.filter((a) => a.shardId === 1);
      const shard2Accounts = accounts.filter((a) => a.shardId === 2);

      expect(shard1Accounts).toHaveLength(2);
      expect(shard2Accounts).toHaveLength(1);
    });

    it("should support account filtering by global player ID", () => {
      const { createdAt, updatedAt } = generateTestDates();
      const globalPlayerId = generateTestId();

      const accounts = [
        new PlayerAccount({
          id: generateTestId(),
          shardId: 1,
          globalPlayerId,
          createdAt,
          updatedAt,
        }),
        new PlayerAccount({
          id: generateTestId(),
          shardId: 2,
          globalPlayerId: generateTestId(),
          createdAt,
          updatedAt,
        }),
        new PlayerAccount({
          id: generateTestId(),
          shardId: 3,
          globalPlayerId,
          createdAt,
          updatedAt,
        }),
      ];

      const playerAccounts = accounts.filter(
        (a) => a.globalPlayerId === globalPlayerId
      );

      expect(playerAccounts).toHaveLength(2);
      expect(playerAccounts[0].shardId).toBe(1);
      expect(playerAccounts[1].shardId).toBe(3);
    });

    it("should support account uniqueness validation", () => {
      const { createdAt, updatedAt } = generateTestDates();
      const accounts = [
        new PlayerAccount({
          id: "account-1",
          shardId: 1,
          globalPlayerId: "global-1",
          createdAt,
          updatedAt,
        }),
        new PlayerAccount({
          id: "account-2",
          shardId: 2,
          globalPlayerId: "global-2",
          createdAt,
          updatedAt,
        }),
        new PlayerAccount({
          id: "account-3",
          shardId: 1,
          globalPlayerId: "global-3",
          createdAt,
          updatedAt,
        }),
      ];

      const ids = accounts.map((a) => a.id);
      const uniqueIds = [...new Set(ids)];
      const globalPlayerIds = accounts.map((a) => a.globalPlayerId);
      const uniqueGlobalPlayerIds = [...new Set(globalPlayerIds)];

      expect(ids).toHaveLength(3);
      expect(uniqueIds).toHaveLength(3);
      expect(globalPlayerIds).toHaveLength(3);
      expect(uniqueGlobalPlayerIds).toHaveLength(3);
    });

    it("should support shard-player mapping", () => {
      const { createdAt, updatedAt } = generateTestDates();
      const accounts = [
        new PlayerAccount({
          id: "1",
          shardId: 1,
          globalPlayerId: "global-1",
          createdAt,
          updatedAt,
        }),
        new PlayerAccount({
          id: "2",
          shardId: 1,
          globalPlayerId: "global-2",
          createdAt,
          updatedAt,
        }),
        new PlayerAccount({
          id: "3",
          shardId: 2,
          globalPlayerId: "global-1",
          createdAt,
          updatedAt,
        }),
      ];

      // Group by shard
      const shardGroups = accounts.reduce(
        (groups, account) => {
          const shard = account.shardId;
          if (!groups[shard]) groups[shard] = [];
          groups[shard].push(account);
          return groups;
        },
        {} as Record<number, PlayerAccount[]>
      );

      expect(shardGroups[1]).toHaveLength(2);
      expect(shardGroups[2]).toHaveLength(1);
    });

    it("should support cross-shard player detection", () => {
      const { createdAt, updatedAt } = generateTestDates();
      const globalPlayerId = "cross-shard-player";

      const accounts = [
        new PlayerAccount({
          id: "1",
          shardId: 1,
          globalPlayerId,
          createdAt,
          updatedAt,
        }),
        new PlayerAccount({
          id: "2",
          shardId: 2,
          globalPlayerId,
          createdAt,
          updatedAt,
        }),
        new PlayerAccount({
          id: "3",
          shardId: 3,
          globalPlayerId,
          createdAt,
          updatedAt,
        }),
      ];

      const crossShardAccounts = accounts.filter(
        (a) => a.globalPlayerId === globalPlayerId
      );
      const shards = crossShardAccounts.map((a) => a.shardId);

      expect(crossShardAccounts).toHaveLength(3);
      expect(shards).toEqual([1, 2, 3]);
    });

    it("should support account creation time sorting", () => {
      const baseDate = new Date();
      const date1 = new Date(baseDate.getTime() - 3000);
      const date2 = new Date(baseDate.getTime() - 2000);
      const date3 = new Date(baseDate.getTime() - 1000);

      const accounts = [
        new PlayerAccount({
          id: "2",
          shardId: 1,
          globalPlayerId: "global-2",
          createdAt: date2,
          updatedAt: date2,
        }),
        new PlayerAccount({
          id: "1",
          shardId: 1,
          globalPlayerId: "global-1",
          createdAt: date1,
          updatedAt: date1,
        }),
        new PlayerAccount({
          id: "3",
          shardId: 1,
          globalPlayerId: "global-3",
          createdAt: date3,
          updatedAt: date3,
        }),
      ];

      accounts.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());

      expect(accounts[0].id).toBe("1");
      expect(accounts[1].id).toBe("2");
      expect(accounts[2].id).toBe("3");
    });

    it("should support active account detection", () => {
      const { createdAt, updatedAt } = generateTestDates();
      const accounts = [
        new PlayerAccount({
          id: "1",
          shardId: 1,
          globalPlayerId: "active-1",
          createdAt,
          updatedAt,
        }),
        new PlayerAccount({
          id: "2",
          shardId: 1,
          globalPlayerId: "",
          createdAt,
          updatedAt,
        }), // Inactive
        new PlayerAccount({
          id: "3",
          shardId: 1,
          globalPlayerId: "active-3",
          createdAt,
          updatedAt,
        }),
      ];

      const activeAccounts = accounts.filter((a) => a.globalPlayerId !== "");
      const inactiveAccounts = accounts.filter((a) => a.globalPlayerId === "");

      expect(activeAccounts).toHaveLength(2);
      expect(inactiveAccounts).toHaveLength(1);
    });
  });
});
