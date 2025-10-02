import { describe, it, expect } from "vitest";
import { InventoryStack } from "../inventory-stack";
import {
  generateTestId,
  generateTestNumber,
  generateTestBigInt,
  generateTestDates,
} from "./test-utils";

describe("InventoryStack", () => {
  describe("Constructor", () => {
    it("should create an InventoryStack instance with all required properties", () => {
      const { createdAt, updatedAt } = generateTestDates();
      const props = {
        shardId: generateTestNumber(),
        playerId: generateTestBigInt(),
        templateId: generateTestId(),
        quantity: generateTestBigInt(),
        createdAt,
        updatedAt,
      };

      const inventoryStack = new InventoryStack(props);

      expect(inventoryStack.shardId).toBe(props.shardId);
      expect(inventoryStack.playerId).toBe(props.playerId);
      expect(inventoryStack.templateId).toBe(props.templateId);
      expect(inventoryStack.quantity).toBe(props.quantity);
      expect(inventoryStack.createdAt).toBe(props.createdAt);
      expect(inventoryStack.updatedAt).toBe(props.updatedAt);
      expect(inventoryStack.id).toBe(""); // Default empty string when not provided
    });

    it("should create an InventoryStack instance with provided id", () => {
      const { createdAt, updatedAt } = generateTestDates();
      const id = generateTestId();
      const props = {
        id,
        shardId: generateTestNumber(),
        playerId: generateTestBigInt(),
        templateId: generateTestId(),
        quantity: generateTestBigInt(),
        createdAt,
        updatedAt,
      };

      const inventoryStack = new InventoryStack(props);

      expect(inventoryStack.id).toBe(id);
      expect(inventoryStack.shardId).toBe(props.shardId);
      expect(inventoryStack.playerId).toBe(props.playerId);
      expect(inventoryStack.templateId).toBe(props.templateId);
      expect(inventoryStack.quantity).toBe(props.quantity);
    });
  });

  describe("CRUD Operations", () => {
    it("should support Create operation", () => {
      const { createdAt, updatedAt } = generateTestDates();
      const stackData = {
        shardId: generateTestNumber(),
        playerId: generateTestBigInt(),
        templateId: generateTestId(),
        quantity: 100n,
        createdAt,
        updatedAt,
      };

      const inventoryStack = new InventoryStack(stackData);

      expect(inventoryStack).toBeInstanceOf(InventoryStack);
      expect(inventoryStack.shardId).toBe(stackData.shardId);
      expect(inventoryStack.playerId).toBe(stackData.playerId);
      expect(inventoryStack.templateId).toBe(stackData.templateId);
      expect(inventoryStack.quantity).toBe(stackData.quantity);
    });

    it("should support Read operation by accessing properties", () => {
      const { createdAt, updatedAt } = generateTestDates();
      const id = generateTestId();
      const shardId = generateTestNumber();
      const playerId = generateTestBigInt();
      const templateId = generateTestId();
      const quantity = 50n;

      const inventoryStack = new InventoryStack({
        id,
        shardId,
        playerId,
        templateId,
        quantity,
        createdAt,
        updatedAt,
      });

      // Read operations
      expect(inventoryStack.id).toBe(id);
      expect(inventoryStack.shardId).toBe(shardId);
      expect(inventoryStack.playerId).toBe(playerId);
      expect(inventoryStack.templateId).toBe(templateId);
      expect(inventoryStack.quantity).toBe(quantity);
      expect(inventoryStack.createdAt).toBe(createdAt);
      expect(inventoryStack.updatedAt).toBe(updatedAt);
    });

    it("should support Update operation by modifying properties", () => {
      const { createdAt, updatedAt } = generateTestDates();
      const inventoryStack = new InventoryStack({
        id: generateTestId(),
        shardId: generateTestNumber(),
        playerId: generateTestBigInt(),
        templateId: generateTestId(),
        quantity: 10n,
        createdAt,
        updatedAt,
      });

      // Update operations
      const newQuantity = 25n;
      const newUpdatedAt = new Date();

      inventoryStack.quantity = newQuantity;
      inventoryStack.updatedAt = newUpdatedAt;

      expect(inventoryStack.quantity).toBe(newQuantity);
      expect(inventoryStack.updatedAt).toBe(newUpdatedAt);
    });

    it("should support Delete operation by setting quantity to zero", () => {
      const { createdAt, updatedAt } = generateTestDates();
      const inventoryStack = new InventoryStack({
        id: generateTestId(),
        shardId: generateTestNumber(),
        playerId: generateTestBigInt(),
        templateId: generateTestId(),
        quantity: 100n,
        createdAt,
        updatedAt,
      });

      // Simulate delete by setting quantity to zero
      inventoryStack.quantity = 0n;

      expect(inventoryStack.quantity).toBe(0n);
      // Other properties should remain for audit purposes
      expect(inventoryStack.id).toBeTruthy();
      expect(inventoryStack.shardId).toBeGreaterThanOrEqual(0);
      expect(inventoryStack.playerId).toBeGreaterThanOrEqual(0n);
      expect(inventoryStack.templateId).toBeTruthy();
      expect(inventoryStack.createdAt).toBe(createdAt);
      expect(inventoryStack.updatedAt).toBe(updatedAt);
    });
  });

  describe("Quantity Management", () => {
    it("should handle various quantity values", () => {
      const { createdAt, updatedAt } = generateTestDates();
      const quantities = [
        0n,
        1n,
        10n,
        100n,
        1000n,
        999999999999n,
        BigInt(Number.MAX_SAFE_INTEGER),
      ];

      quantities.forEach((quantity) => {
        const inventoryStack = new InventoryStack({
          shardId: generateTestNumber(),
          playerId: generateTestBigInt(),
          templateId: generateTestId(),
          quantity,
          createdAt,
          updatedAt,
        });

        expect(inventoryStack.quantity).toBe(quantity);
        expect(typeof inventoryStack.quantity).toBe("bigint");
      });
    });

    it("should handle quantity arithmetic operations", () => {
      const { createdAt, updatedAt } = generateTestDates();
      const inventoryStack = new InventoryStack({
        shardId: generateTestNumber(),
        playerId: generateTestBigInt(),
        templateId: generateTestId(),
        quantity: 100n,
        createdAt,
        updatedAt,
      });

      // Add items
      inventoryStack.quantity += 50n;
      expect(inventoryStack.quantity).toBe(150n);

      // Remove items
      inventoryStack.quantity -= 25n;
      expect(inventoryStack.quantity).toBe(125n);

      // Multiply (e.g., bonus)
      inventoryStack.quantity *= 2n;
      expect(inventoryStack.quantity).toBe(250n);

      // Divide (e.g., split stack)
      inventoryStack.quantity /= 5n;
      expect(inventoryStack.quantity).toBe(50n);
    });

    it("should handle very large quantities", () => {
      const { createdAt, updatedAt } = generateTestDates();
      const veryLargeQuantity = BigInt("999999999999999999999999999999");
      const inventoryStack = new InventoryStack({
        shardId: generateTestNumber(),
        playerId: generateTestBigInt(),
        templateId: generateTestId(),
        quantity: veryLargeQuantity,
        createdAt,
        updatedAt,
      });

      expect(inventoryStack.quantity).toBe(veryLargeQuantity);
      expect(typeof inventoryStack.quantity).toBe("bigint");
    });
  });

  describe("Player and Shard Relationships", () => {
    it("should handle different shard IDs", () => {
      const { createdAt, updatedAt } = generateTestDates();
      const shardIds = [0, 1, 100, 999, Number.MAX_SAFE_INTEGER];

      shardIds.forEach((shardId) => {
        const inventoryStack = new InventoryStack({
          shardId,
          playerId: generateTestBigInt(),
          templateId: generateTestId(),
          quantity: generateTestBigInt(),
          createdAt,
          updatedAt,
        });

        expect(inventoryStack.shardId).toBe(shardId);
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
        const inventoryStack = new InventoryStack({
          shardId: generateTestNumber(),
          playerId,
          templateId: generateTestId(),
          quantity: generateTestBigInt(),
          createdAt,
          updatedAt,
        });

        expect(inventoryStack.playerId).toBe(playerId);
      });
    });

    it("should handle negative shard IDs", () => {
      const { createdAt, updatedAt } = generateTestDates();
      const inventoryStack = new InventoryStack({
        shardId: -1,
        playerId: generateTestBigInt(),
        templateId: generateTestId(),
        quantity: generateTestBigInt(),
        createdAt,
        updatedAt,
      });

      expect(inventoryStack.shardId).toBe(-1);
    });
  });

  describe("Edge Cases", () => {
    it("should handle zero values", () => {
      const { createdAt, updatedAt } = generateTestDates();
      const inventoryStack = new InventoryStack({
        shardId: 0,
        playerId: 0n,
        templateId: "",
        quantity: 0n,
        createdAt,
        updatedAt,
      });

      expect(inventoryStack.shardId).toBe(0);
      expect(inventoryStack.playerId).toBe(0n);
      expect(inventoryStack.templateId).toBe("");
      expect(inventoryStack.quantity).toBe(0n);
    });

    it("should handle empty template ID", () => {
      const { createdAt, updatedAt } = generateTestDates();
      const inventoryStack = new InventoryStack({
        shardId: generateTestNumber(),
        playerId: generateTestBigInt(),
        templateId: "",
        quantity: generateTestBigInt(),
        createdAt,
        updatedAt,
      });

      expect(inventoryStack.templateId).toBe("");
    });

    it("should handle special character template IDs", () => {
      const { createdAt, updatedAt } = generateTestDates();
      const specialIds = [
        "template-with-dashes",
        "template_with_underscores",
        "template.with.dots",
        "template123with456numbers",
        "TEMPLATE-WITH-CAPS",
        "template with spaces",
        "template@with#special$chars",
      ];

      specialIds.forEach((templateId) => {
        const inventoryStack = new InventoryStack({
          shardId: generateTestNumber(),
          playerId: generateTestBigInt(),
          templateId,
          quantity: generateTestBigInt(),
          createdAt: generateTestDates().createdAt,
          updatedAt: generateTestDates().updatedAt,
        });

        expect(inventoryStack.templateId).toBe(templateId);
      });
    });
  });

  describe("Data Integrity", () => {
    it("should maintain data integrity after multiple updates", () => {
      const { createdAt, updatedAt } = generateTestDates();
      const originalId = generateTestId();
      const originalShardId = generateTestNumber();
      const originalPlayerId = generateTestBigInt();
      const originalTemplateId = generateTestId();

      const inventoryStack = new InventoryStack({
        id: originalId,
        shardId: originalShardId,
        playerId: originalPlayerId,
        templateId: originalTemplateId,
        quantity: 100n,
        createdAt,
        updatedAt,
      });

      // Multiple updates
      inventoryStack.quantity = 150n;
      inventoryStack.quantity = 200n;
      inventoryStack.quantity = 75n;

      // Core identifiers should not change
      expect(inventoryStack.id).toBe(originalId);
      expect(inventoryStack.shardId).toBe(originalShardId);
      expect(inventoryStack.playerId).toBe(originalPlayerId);
      expect(inventoryStack.templateId).toBe(originalTemplateId);
      expect(inventoryStack.quantity).toBe(75n);
      expect(inventoryStack.createdAt).toBe(createdAt);
    });

    it("should handle concurrent-like quantity changes", () => {
      const { createdAt, updatedAt } = generateTestDates();
      const inventoryStack = new InventoryStack({
        shardId: generateTestNumber(),
        playerId: generateTestBigInt(),
        templateId: generateTestId(),
        quantity: 100n,
        createdAt,
        updatedAt,
      });

      const update1 = new Date();
      const update2 = new Date(update1.getTime() + 1000);

      inventoryStack.updatedAt = update1;
      inventoryStack.quantity = 150n;

      inventoryStack.updatedAt = update2;
      inventoryStack.quantity = 200n;

      expect(inventoryStack.quantity).toBe(200n);
      expect(inventoryStack.updatedAt).toBe(update2);
    });
  });

  describe("Business Logic", () => {
    it("should support stack filtering by player", () => {
      const { createdAt, updatedAt } = generateTestDates();
      const player1Id = generateTestBigInt();
      const player2Id = generateTestBigInt();

      const stacks = [
        new InventoryStack({
          shardId: 1,
          playerId: player1Id,
          templateId: generateTestId(),
          quantity: 10n,
          createdAt,
          updatedAt,
        }),
        new InventoryStack({
          shardId: 1,
          playerId: player2Id,
          templateId: generateTestId(),
          quantity: 20n,
          createdAt,
          updatedAt,
        }),
        new InventoryStack({
          shardId: 1,
          playerId: player1Id,
          templateId: generateTestId(),
          quantity: 30n,
          createdAt,
          updatedAt,
        }),
      ];

      const player1Stacks = stacks.filter((s) => s.playerId === player1Id);
      const player2Stacks = stacks.filter((s) => s.playerId === player2Id);

      expect(player1Stacks).toHaveLength(2);
      expect(player2Stacks).toHaveLength(1);
    });

    it("should support stack filtering by shard", () => {
      const { createdAt, updatedAt } = generateTestDates();
      const stacks = [
        new InventoryStack({
          shardId: 1,
          playerId: generateTestBigInt(),
          templateId: generateTestId(),
          quantity: 10n,
          createdAt,
          updatedAt,
        }),
        new InventoryStack({
          shardId: 2,
          playerId: generateTestBigInt(),
          templateId: generateTestId(),
          quantity: 20n,
          createdAt,
          updatedAt,
        }),
        new InventoryStack({
          shardId: 1,
          playerId: generateTestBigInt(),
          templateId: generateTestId(),
          quantity: 30n,
          createdAt,
          updatedAt,
        }),
      ];

      const shard1Stacks = stacks.filter((s) => s.shardId === 1);
      const shard2Stacks = stacks.filter((s) => s.shardId === 2);

      expect(shard1Stacks).toHaveLength(2);
      expect(shard2Stacks).toHaveLength(1);
    });

    it("should support stack filtering by template", () => {
      const { createdAt, updatedAt } = generateTestDates();
      const template1Id = generateTestId();
      const template2Id = generateTestId();

      const stacks = [
        new InventoryStack({
          shardId: 1,
          playerId: generateTestBigInt(),
          templateId: template1Id,
          quantity: 10n,
          createdAt,
          updatedAt,
        }),
        new InventoryStack({
          shardId: 1,
          playerId: generateTestBigInt(),
          templateId: template2Id,
          quantity: 20n,
          createdAt,
          updatedAt,
        }),
        new InventoryStack({
          shardId: 1,
          playerId: generateTestBigInt(),
          templateId: template1Id,
          quantity: 30n,
          createdAt,
          updatedAt,
        }),
      ];

      const template1Stacks = stacks.filter(
        (s) => s.templateId === template1Id
      );
      const template2Stacks = stacks.filter(
        (s) => s.templateId === template2Id
      );

      expect(template1Stacks).toHaveLength(2);
      expect(template2Stacks).toHaveLength(1);
    });

    it("should support quantity-based queries", () => {
      const { createdAt, updatedAt } = generateTestDates();
      const stacks = [
        new InventoryStack({
          shardId: 1,
          playerId: generateTestBigInt(),
          templateId: generateTestId(),
          quantity: 5n,
          createdAt,
          updatedAt,
        }),
        new InventoryStack({
          shardId: 1,
          playerId: generateTestBigInt(),
          templateId: generateTestId(),
          quantity: 50n,
          createdAt,
          updatedAt,
        }),
        new InventoryStack({
          shardId: 1,
          playerId: generateTestBigInt(),
          templateId: generateTestId(),
          quantity: 500n,
          createdAt,
          updatedAt,
        }),
        new InventoryStack({
          shardId: 1,
          playerId: generateTestBigInt(),
          templateId: generateTestId(),
          quantity: 0n,
          createdAt,
          updatedAt,
        }),
      ];

      const lowQuantityStacks = stacks.filter((s) => s.quantity < 10n);
      const mediumQuantityStacks = stacks.filter(
        (s) => s.quantity >= 10n && s.quantity < 100n
      );
      const highQuantityStacks = stacks.filter((s) => s.quantity >= 100n);
      const emptyStacks = stacks.filter((s) => s.quantity === 0n);

      expect(lowQuantityStacks).toHaveLength(2); // 5 and 0
      expect(mediumQuantityStacks).toHaveLength(1); // 50
      expect(highQuantityStacks).toHaveLength(1); // 500
      expect(emptyStacks).toHaveLength(1); // 0
    });

    it("should support total quantity calculations", () => {
      const { createdAt, updatedAt } = generateTestDates();
      const playerId = generateTestBigInt();

      const stacks = [
        new InventoryStack({
          shardId: 1,
          playerId,
          templateId: generateTestId(),
          quantity: 10n,
          createdAt,
          updatedAt,
        }),
        new InventoryStack({
          shardId: 1,
          playerId,
          templateId: generateTestId(),
          quantity: 20n,
          createdAt,
          updatedAt,
        }),
        new InventoryStack({
          shardId: 1,
          playerId,
          templateId: generateTestId(),
          quantity: 30n,
          createdAt,
          updatedAt,
        }),
        new InventoryStack({
          shardId: 1,
          playerId: generateTestBigInt(),
          templateId: generateTestId(),
          quantity: 100n,
          createdAt,
          updatedAt,
        }), // Different player
      ];

      const playerStacks = stacks.filter((s) => s.playerId === playerId);
      const totalQuantity = playerStacks.reduce(
        (sum, stack) => sum + stack.quantity,
        0n
      );

      expect(totalQuantity).toBe(60n);
    });

    it("should support stack consolidation logic", () => {
      const { createdAt, updatedAt } = generateTestDates();
      const playerId = generateTestBigInt();
      const templateId = generateTestId();

      const stacks = [
        new InventoryStack({
          shardId: 1,
          playerId,
          templateId,
          quantity: 10n,
          createdAt,
          updatedAt,
        }),
        new InventoryStack({
          shardId: 1,
          playerId,
          templateId,
          quantity: 20n,
          createdAt,
          updatedAt,
        }),
        new InventoryStack({
          shardId: 1,
          playerId,
          templateId: generateTestId(),
          quantity: 30n,
          createdAt,
          updatedAt,
        }), // Different template
      ];

      const sameTemplateStacks = stacks.filter(
        (s) => s.playerId === playerId && s.templateId === templateId
      );
      const consolidatedQuantity = sameTemplateStacks.reduce(
        (sum, stack) => sum + stack.quantity,
        0n
      );

      expect(sameTemplateStacks).toHaveLength(2);
      expect(consolidatedQuantity).toBe(30n);
    });

    it("should support inventory value calculations", () => {
      const { createdAt, updatedAt } = generateTestDates();
      const stacks = [
        new InventoryStack({
          shardId: 1,
          playerId: generateTestBigInt(),
          templateId: generateTestId(),
          quantity: 10n,
          createdAt,
          updatedAt,
        }),
        new InventoryStack({
          shardId: 1,
          playerId: generateTestBigInt(),
          templateId: generateTestId(),
          quantity: 5n,
          createdAt,
          updatedAt,
        }),
        new InventoryStack({
          shardId: 1,
          playerId: generateTestBigInt(),
          templateId: generateTestId(),
          quantity: 0n,
          createdAt,
          updatedAt,
        }),
      ];

      // Simulate value calculation (quantity * unit_price)
      const unitPrice = 100n;
      const totalValue = stacks.reduce(
        (sum, stack) => sum + stack.quantity * unitPrice,
        0n
      );

      expect(totalValue).toBe(1500n); // (10 + 5 + 0) * 100
    });
  });
});
