import { describe, it, expect } from "vitest";
import { Robot } from "../robot";
import {
  generateTestId,
  generateTestNumber,
  generateTestBigInt,
  generateTestDates,
} from "./test-utils";

describe("Robot", () => {
  describe("Constructor", () => {
    it("should create a Robot instance with all required properties", () => {
      const { createdAt, updatedAt } = generateTestDates();
      const props = {
        id: generateTestId(),
        shardId: generateTestNumber(),
        playerId: generateTestBigInt(),
        nickname: "TestBot",
        createdAt,
        updatedAt,
      };

      const robot = new Robot(props);

      expect(robot.id).toBe(props.id);
      expect(robot.shardId).toBe(props.shardId);
      expect(robot.playerId).toBe(props.playerId);
      expect(robot.nickname).toBe(props.nickname);
      expect(robot.createdAt).toBe(props.createdAt);
      expect(robot.updatedAt).toBe(props.updatedAt);
    });

    it("should handle empty nickname", () => {
      const { createdAt, updatedAt } = generateTestDates();
      const props = {
        id: generateTestId(),
        shardId: generateTestNumber(),
        playerId: generateTestBigInt(),
        nickname: "",
        createdAt,
        updatedAt,
      };

      const robot = new Robot(props);

      expect(robot.nickname).toBe("");
    });
  });

  describe("CRUD Operations", () => {
    it("should support Create operation", () => {
      const { createdAt, updatedAt } = generateTestDates();
      const robotData = {
        id: generateTestId(),
        shardId: generateTestNumber(),
        playerId: generateTestBigInt(),
        nickname: "NewBot",
        createdAt,
        updatedAt,
      };

      const robot = new Robot(robotData);

      expect(robot).toBeInstanceOf(Robot);
      expect(robot.id).toBe(robotData.id);
      expect(robot.shardId).toBe(robotData.shardId);
      expect(robot.playerId).toBe(robotData.playerId);
      expect(robot.nickname).toBe(robotData.nickname);
    });

    it("should support Read operation by accessing properties", () => {
      const { createdAt, updatedAt } = generateTestDates();
      const id = generateTestId();
      const shardId = generateTestNumber();
      const playerId = generateTestBigInt();
      const nickname = "ReadBot";

      const robot = new Robot({
        id,
        shardId,
        playerId,
        nickname,
        createdAt,
        updatedAt,
      });

      // Read operations
      expect(robot.id).toBe(id);
      expect(robot.shardId).toBe(shardId);
      expect(robot.playerId).toBe(playerId);
      expect(robot.nickname).toBe(nickname);
      expect(robot.createdAt).toBe(createdAt);
      expect(robot.updatedAt).toBe(updatedAt);
    });

    it("should support Update operation by modifying properties", () => {
      const { createdAt, updatedAt } = generateTestDates();
      const robot = new Robot({
        id: generateTestId(),
        shardId: generateTestNumber(),
        playerId: generateTestBigInt(),
        nickname: "OriginalBot",
        createdAt,
        updatedAt,
      });

      // Update operations
      const newNickname = "UpdatedBot";
      const newUpdatedAt = new Date();

      robot.nickname = newNickname;
      robot.updatedAt = newUpdatedAt;

      expect(robot.nickname).toBe(newNickname);
      expect(robot.updatedAt).toBe(newUpdatedAt);
    });

    it("should support Delete operation by clearing nickname", () => {
      const { createdAt, updatedAt } = generateTestDates();
      const robot = new Robot({
        id: generateTestId(),
        shardId: generateTestNumber(),
        playerId: generateTestBigInt(),
        nickname: "ToBeDeleted",
        createdAt,
        updatedAt,
      });

      // Simulate delete by clearing nickname (soft delete)
      robot.nickname = "";

      expect(robot.nickname).toBe("");
      // ID and other properties should remain for audit purposes
      expect(robot.id).toBeTruthy();
      expect(robot.shardId).toBeGreaterThanOrEqual(0);
      expect(robot.playerId).toBeGreaterThanOrEqual(0n);
      expect(robot.createdAt).toBe(createdAt);
      expect(robot.updatedAt).toBe(updatedAt);
    });
  });

  describe("Nickname Handling", () => {
    it("should handle various nickname formats", () => {
      const { createdAt, updatedAt } = generateTestDates();
      const nicknames = [
        "SimpleBot",
        "Bot123",
        "My-Robot",
        "Bot_With_Underscores",
        "Bot.With.Dots",
        "Bot With Spaces",
        "BotWithVeryLongNicknameThatExceedsNormalLength",
        "🤖RobotEmoji",
        "Bot™",
        "ボット", // Japanese
        "Бот", // Russian
      ];

      nicknames.forEach((nickname) => {
        const robot = new Robot({
          id: generateTestId(),
          shardId: generateTestNumber(),
          playerId: generateTestBigInt(),
          nickname,
          createdAt,
          updatedAt,
        });

        expect(robot.nickname).toBe(nickname);
      });
    });

    it("should handle special character nicknames", () => {
      const { createdAt, updatedAt } = generateTestDates();
      const specialNicknames = [
        "!@#$%^&*()",
        "<script>alert('xss')</script>",
        "DROP TABLE robots;",
        "' OR 1=1 --",
        "\n\t\r",
        "   ", // Only spaces
      ];

      specialNicknames.forEach((nickname) => {
        const robot = new Robot({
          id: generateTestId(),
          shardId: generateTestNumber(),
          playerId: generateTestBigInt(),
          nickname,
          createdAt,
          updatedAt,
        });

        expect(robot.nickname).toBe(nickname);
      });
    });
  });

  describe("Player and Shard Relationships", () => {
    it("should handle different shard IDs", () => {
      const { createdAt, updatedAt } = generateTestDates();
      const shardIds = [0, 1, 100, 999, Number.MAX_SAFE_INTEGER];

      shardIds.forEach((shardId) => {
        const robot = new Robot({
          id: generateTestId(),
          shardId,
          playerId: generateTestBigInt(),
          nickname: `Bot-Shard-${shardId}`,
          createdAt,
          updatedAt,
        });

        expect(robot.shardId).toBe(shardId);
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
        const robot = new Robot({
          id: generateTestId(),
          shardId: generateTestNumber(),
          playerId,
          nickname: `Bot-Player-${playerId}`,
          createdAt,
          updatedAt,
        });

        expect(robot.playerId).toBe(playerId);
      });
    });

    it("should handle negative shard IDs", () => {
      const { createdAt, updatedAt } = generateTestDates();
      const robot = new Robot({
        id: generateTestId(),
        shardId: -1,
        playerId: generateTestBigInt(),
        nickname: "NegativeShardBot",
        createdAt,
        updatedAt,
      });

      expect(robot.shardId).toBe(-1);
    });
  });

  describe("Edge Cases", () => {
    it("should handle zero values", () => {
      const { createdAt, updatedAt } = generateTestDates();
      const robot = new Robot({
        id: "",
        shardId: 0,
        playerId: 0n,
        nickname: "",
        createdAt,
        updatedAt,
      });

      expect(robot.id).toBe("");
      expect(robot.shardId).toBe(0);
      expect(robot.playerId).toBe(0n);
      expect(robot.nickname).toBe("");
    });

    it("should handle very large BigInt player IDs", () => {
      const { createdAt, updatedAt } = generateTestDates();
      const veryLargePlayerId = BigInt("999999999999999999999999999999");
      const robot = new Robot({
        id: generateTestId(),
        shardId: generateTestNumber(),
        playerId: veryLargePlayerId,
        nickname: "BigPlayerBot",
        createdAt,
        updatedAt,
      });

      expect(robot.playerId).toBe(veryLargePlayerId);
      expect(typeof robot.playerId).toBe("bigint");
    });

    it("should handle date edge cases", () => {
      const veryOldDate = new Date("1970-01-01");
      const futureDate = new Date("2099-12-31");

      const robot = new Robot({
        id: generateTestId(),
        shardId: generateTestNumber(),
        playerId: generateTestBigInt(),
        nickname: "TimeTravelBot",
        createdAt: veryOldDate,
        updatedAt: futureDate,
      });

      expect(robot.createdAt).toBe(veryOldDate);
      expect(robot.updatedAt).toBe(futureDate);
    });
  });

  describe("Data Integrity", () => {
    it("should maintain data integrity after multiple updates", () => {
      const { createdAt, updatedAt } = generateTestDates();
      const originalId = generateTestId();
      const originalShardId = generateTestNumber();
      const originalPlayerId = generateTestBigInt();

      const robot = new Robot({
        id: originalId,
        shardId: originalShardId,
        playerId: originalPlayerId,
        nickname: "Original",
        createdAt,
        updatedAt,
      });

      // Multiple updates
      robot.nickname = "First Update";
      robot.nickname = "Second Update";
      robot.nickname = "Final Update";

      // Core identifiers should not change
      expect(robot.id).toBe(originalId);
      expect(robot.shardId).toBe(originalShardId);
      expect(robot.playerId).toBe(originalPlayerId);
      expect(robot.nickname).toBe("Final Update");
      expect(robot.createdAt).toBe(createdAt);
    });

    it("should handle concurrent-like updates", () => {
      const { createdAt, updatedAt } = generateTestDates();
      const robot = new Robot({
        id: generateTestId(),
        shardId: generateTestNumber(),
        playerId: generateTestBigInt(),
        nickname: "ConcurrentTest",
        createdAt,
        updatedAt,
      });

      const update1 = new Date();
      const update2 = new Date(update1.getTime() + 1000);

      robot.updatedAt = update1;
      robot.nickname = "Update 1";

      robot.updatedAt = update2;
      robot.nickname = "Update 2";

      expect(robot.nickname).toBe("Update 2");
      expect(robot.updatedAt).toBe(update2);
    });

    it("should preserve type safety for numeric fields", () => {
      const { createdAt, updatedAt } = generateTestDates();
      const robot = new Robot({
        id: generateTestId(),
        shardId: 42,
        playerId: 123456789n,
        nickname: "TypeSafeBot",
        createdAt,
        updatedAt,
      });

      expect(typeof robot.shardId).toBe("number");
      expect(typeof robot.playerId).toBe("bigint");
      expect(Number.isInteger(robot.shardId)).toBe(true);
    });
  });

  describe("Business Logic", () => {
    it("should support robot filtering by player", () => {
      const { createdAt, updatedAt } = generateTestDates();
      const player1Id = generateTestBigInt();
      const player2Id = generateTestBigInt();

      const robots = [
        new Robot({
          id: generateTestId(),
          shardId: 1,
          playerId: player1Id,
          nickname: "Player1Bot1",
          createdAt,
          updatedAt,
        }),
        new Robot({
          id: generateTestId(),
          shardId: 1,
          playerId: player2Id,
          nickname: "Player2Bot1",
          createdAt,
          updatedAt,
        }),
        new Robot({
          id: generateTestId(),
          shardId: 1,
          playerId: player1Id,
          nickname: "Player1Bot2",
          createdAt,
          updatedAt,
        }),
      ];

      const player1Robots = robots.filter((r) => r.playerId === player1Id);
      const player2Robots = robots.filter((r) => r.playerId === player2Id);

      expect(player1Robots).toHaveLength(2);
      expect(player2Robots).toHaveLength(1);
    });

    it("should support robot filtering by shard", () => {
      const { createdAt, updatedAt } = generateTestDates();
      const robots = [
        new Robot({
          id: generateTestId(),
          shardId: 1,
          playerId: generateTestBigInt(),
          nickname: "Shard1Bot1",
          createdAt,
          updatedAt,
        }),
        new Robot({
          id: generateTestId(),
          shardId: 2,
          playerId: generateTestBigInt(),
          nickname: "Shard2Bot1",
          createdAt,
          updatedAt,
        }),
        new Robot({
          id: generateTestId(),
          shardId: 1,
          playerId: generateTestBigInt(),
          nickname: "Shard1Bot2",
          createdAt,
          updatedAt,
        }),
      ];

      const shard1Robots = robots.filter((r) => r.shardId === 1);
      const shard2Robots = robots.filter((r) => r.shardId === 2);

      expect(shard1Robots).toHaveLength(2);
      expect(shard2Robots).toHaveLength(1);
    });

    it("should support robot search by nickname", () => {
      const { createdAt, updatedAt } = generateTestDates();
      const robots = [
        new Robot({
          id: generateTestId(),
          shardId: 1,
          playerId: generateTestBigInt(),
          nickname: "FireBot",
          createdAt,
          updatedAt,
        }),
        new Robot({
          id: generateTestId(),
          shardId: 1,
          playerId: generateTestBigInt(),
          nickname: "IceBot",
          createdAt,
          updatedAt,
        }),
        new Robot({
          id: generateTestId(),
          shardId: 1,
          playerId: generateTestBigInt(),
          nickname: "Lightning FireBot",
          createdAt,
          updatedAt,
        }),
      ];

      const fireRobots = robots.filter((r) =>
        r.nickname.toLowerCase().includes("fire")
      );
      const iceRobots = robots.filter((r) =>
        r.nickname.toLowerCase().includes("ice")
      );

      expect(fireRobots).toHaveLength(2);
      expect(iceRobots).toHaveLength(1);
      expect(fireRobots.map((r) => r.nickname)).toContain("FireBot");
      expect(fireRobots.map((r) => r.nickname)).toContain("Lightning FireBot");
    });

    it("should support robot sorting by creation date", () => {
      const baseDate = new Date();
      const date1 = new Date(baseDate.getTime() - 3000);
      const date2 = new Date(baseDate.getTime() - 2000);
      const date3 = new Date(baseDate.getTime() - 1000);

      const robots = [
        new Robot({
          id: generateTestId(),
          shardId: 1,
          playerId: generateTestBigInt(),
          nickname: "Bot2",
          createdAt: date2,
          updatedAt: date2,
        }),
        new Robot({
          id: generateTestId(),
          shardId: 1,
          playerId: generateTestBigInt(),
          nickname: "Bot1",
          createdAt: date1,
          updatedAt: date1,
        }),
        new Robot({
          id: generateTestId(),
          shardId: 1,
          playerId: generateTestBigInt(),
          nickname: "Bot3",
          createdAt: date3,
          updatedAt: date3,
        }),
      ];

      robots.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());

      expect(robots[0].nickname).toBe("Bot1");
      expect(robots[1].nickname).toBe("Bot2");
      expect(robots[2].nickname).toBe("Bot3");
    });

    it("should support robot uniqueness by ID", () => {
      const { createdAt, updatedAt } = generateTestDates();
      const robots = [
        new Robot({
          id: "robot-1",
          shardId: 1,
          playerId: generateTestBigInt(),
          nickname: "Bot1",
          createdAt,
          updatedAt,
        }),
        new Robot({
          id: "robot-2",
          shardId: 1,
          playerId: generateTestBigInt(),
          nickname: "Bot2",
          createdAt,
          updatedAt,
        }),
        new Robot({
          id: "robot-3",
          shardId: 1,
          playerId: generateTestBigInt(),
          nickname: "Bot3",
          createdAt,
          updatedAt,
        }),
      ];

      const ids = robots.map((r) => r.id);
      const uniqueIds = [...new Set(ids)];

      expect(ids).toHaveLength(3);
      expect(uniqueIds).toHaveLength(3);
      expect(ids).toEqual(uniqueIds);
    });

    it("should support player robot count queries", () => {
      const { createdAt, updatedAt } = generateTestDates();
      const playerId = generateTestBigInt();

      const robots = [
        new Robot({
          id: generateTestId(),
          shardId: 1,
          playerId,
          nickname: "Bot1",
          createdAt,
          updatedAt,
        }),
        new Robot({
          id: generateTestId(),
          shardId: 1,
          playerId,
          nickname: "Bot2",
          createdAt,
          updatedAt,
        }),
        new Robot({
          id: generateTestId(),
          shardId: 1,
          playerId: generateTestBigInt(),
          nickname: "OtherBot",
          createdAt,
          updatedAt,
        }),
      ];

      const playerRobotCount = robots.filter(
        (r) => r.playerId === playerId
      ).length;

      expect(playerRobotCount).toBe(2);
    });
  });
});
