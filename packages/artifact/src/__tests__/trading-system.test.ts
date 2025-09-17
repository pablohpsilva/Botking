/**
 * Trading System Tests
 *
 * Comprehensive tests for the trading system including events, offers, and validation
 */

import { describe, it, expect, beforeEach } from "vitest";
import {
  TradingFactory,
  type ITradingEvent,
  type ITradeOffer,
} from "../trading";
import { TradingEventStatus, TradeOfferStatus } from "@botking/db";

describe("Trading System", () => {
  let tradingEvent: ITradingEvent;
  let gemExchange: ITradeOffer;
  let dailySpecial: ITradeOffer;

  beforeEach(() => {
    // Create a summer trading event
    tradingEvent = TradingFactory.createSeasonalEvent("summer", 2024, {
      maxTradesPerUser: 10,
      createdBy: "admin_user",
    });

    // Create a gem exchange offer
    gemExchange = TradingFactory.createGemExchange(
      tradingEvent.id,
      "Common",
      10,
      "Rare",
      1,
      {
        maxTotalTrades: 100,
        maxPerUser: 5,
        isHighlighted: true,
      }
    );

    // Create a daily special offer
    dailySpecial = TradingFactory.createDailySpecial(
      tradingEvent.id,
      { itemId: "gems_epic", itemName: "Epic Gem", quantity: 5 },
      {
        itemId: "part_legendary_arm",
        itemName: "Legendary Arm Part",
        quantity: 1,
      }
    );
  });

  describe("TradingEvent", () => {
    it("should create a trading event with correct properties", () => {
      expect(tradingEvent.name).toBe("Summer Trading 2024");
      expect(tradingEvent.status).toBe(TradingEventStatus.DRAFT);
      expect(tradingEvent.maxTradesPerUser).toBe(10);
      expect(tradingEvent.isRepeatable).toBe(false);
      expect(tradingEvent.tags).toContain("seasonal");
      expect(tradingEvent.tags).toContain("summer");
      expect(tradingEvent.tags).toContain("2024");
      expect(tradingEvent.createdBy).toBe("admin_user");
    });

    it("should start as inactive and become active when status changes", () => {
      expect(tradingEvent.isActive).toBe(false);

      tradingEvent.updateStatus(TradingEventStatus.ACTIVE);
      expect(tradingEvent.status).toBe(TradingEventStatus.ACTIVE);
      expect(tradingEvent.isActive).toBe(true);
    });

    it("should manage trade offers", () => {
      expect(tradingEvent.totalOffers).toBe(0);

      tradingEvent.addTradeOffer(gemExchange);
      expect(tradingEvent.totalOffers).toBe(1);
      expect(tradingEvent.getTradeOffer(gemExchange.id)).toBe(gemExchange);

      tradingEvent.addTradeOffer(dailySpecial);
      expect(tradingEvent.totalOffers).toBe(2);

      const availableOffers = tradingEvent.getAvailableOffers();
      expect(availableOffers).toHaveLength(2);
    });

    it("should track user trades", () => {
      const userId = "user123";

      expect(tradingEvent.canUserTrade(userId)).toBe(false); // Event not active

      tradingEvent.updateStatus(TradingEventStatus.ACTIVE);
      expect(tradingEvent.canUserTrade(userId)).toBe(true);

      // Simulate multiple trades
      for (let i = 0; i < 5; i++) {
        tradingEvent.recordUserTrade(userId, "offer_" + i);
      }

      expect(tradingEvent.getUserTradeCount(userId)).toBe(5);
      expect(tradingEvent.totalTrades).toBe(5);
      expect(tradingEvent.canUserTrade(userId)).toBe(true); // Still under limit of 10

      // Reach the limit
      for (let i = 5; i < 10; i++) {
        tradingEvent.recordUserTrade(userId, "offer_" + i);
      }

      expect(tradingEvent.getUserTradeCount(userId)).toBe(10);
      expect(tradingEvent.canUserTrade(userId)).toBe(false); // Reached limit
    });

    it("should validate time constraints", () => {
      const now = new Date();
      const future = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24 hours later
      const past = new Date(now.getTime() - 24 * 60 * 60 * 1000); // 24 hours ago

      const limitedEvent = TradingFactory.createLimitedTimeEvent(
        "Flash Sale",
        "24-hour only event",
        now,
        future
      );

      limitedEvent.updateStatus(TradingEventStatus.ACTIVE);
      expect(limitedEvent.isActive).toBe(true);
      expect(limitedEvent.isExpired).toBe(false);

      // Test expired event
      const farPast = new Date(now.getTime() - 48 * 60 * 60 * 1000); // 48 hours ago
      const expiredEvent = TradingFactory.createLimitedTimeEvent(
        "Past Event",
        "This event has ended",
        farPast,
        past
      );

      expiredEvent.updateStatus(TradingEventStatus.ACTIVE);
      expect(expiredEvent.isActive).toBe(false); // Expired
      expect(expiredEvent.isExpired).toBe(true);
    });

    it("should serialize and deserialize correctly", () => {
      const serialized = tradingEvent.serialize();
      expect(serialized).toContain(tradingEvent.name);
      expect(serialized).toContain("Summer Trading 2024");

      const json = tradingEvent.toJSON();
      expect(json.name).toBe(tradingEvent.name);
      expect(json.status).toBe(tradingEvent.status);
      expect(json.totalOffers).toBe(tradingEvent.totalOffers);
      expect(json.totalTrades).toBe(tradingEvent.totalTrades);
    });
  });

  describe("TradeOffer", () => {
    it("should create a gem exchange with correct properties", () => {
      expect(gemExchange.name).toBe("10x Common → 1x Rare");
      expect(gemExchange.tradingEventId).toBe(tradingEvent.id);
      expect(gemExchange.status).toBe(TradeOfferStatus.ACTIVE);
      expect(gemExchange.maxTotalTrades).toBe(100);
      expect(gemExchange.maxPerUser).toBe(5);
      expect(gemExchange.isHighlighted).toBe(true);
      expect(gemExchange.tags).toContain("gems");
      expect(gemExchange.tags).toContain("exchange");
    });

    it("should track availability correctly", () => {
      expect(gemExchange.isAvailable).toBe(true);
      expect(gemExchange.isSoldOut).toBe(false);
      expect(gemExchange.remainingTrades).toBe(100);

      // Update status to sold out
      gemExchange.updateStatus(TradeOfferStatus.SOLD_OUT);
      expect(gemExchange.isAvailable).toBe(false);
      expect(gemExchange.status).toBe(TradeOfferStatus.SOLD_OUT);
    });

    it("should validate user eligibility", () => {
      const userId = "user456";
      const userLevel = 10;

      const eligibility = gemExchange.canUserTrade(userId, userLevel);
      expect(eligibility.canTrade).toBe(true);
      expect(eligibility.remainingTrades).toBe(5); // maxPerUser
      expect(eligibility.reasons).toHaveLength(0);

      // Test after user has made trades
      for (let i = 0; i < 3; i++) {
        // Simulate trades (this would normally update the trade count)
        const userInventory = new Map([["gem_common", 20]]);
        gemExchange.executeTrade(userId, userInventory);
      }

      const newEligibility = gemExchange.canUserTrade(userId, userLevel);
      expect(newEligibility.remainingTrades).toBe(2); // 5 - 3 = 2
    });

    it("should validate trade requirements", () => {
      const userInventory = new Map([
        ["gem_common", 15], // Has enough
        ["gem_rare", 2],
      ]);

      const validation = gemExchange.validateTrade(userInventory);
      expect(validation.isValid).toBe(true);
      expect(validation.errors).toHaveLength(0);

      // Test insufficient inventory
      const insufficientInventory = new Map([
        ["gem_common", 5], // Not enough (needs 10)
      ]);

      const invalidValidation = gemExchange.validateTrade(
        insufficientInventory
      );
      expect(invalidValidation.isValid).toBe(false);
      expect(invalidValidation.errors.length).toBeGreaterThan(0);
      expect(invalidValidation.insufficientQuantities).toBeDefined();

      // Test missing items
      const emptyInventory = new Map();
      const missingValidation = gemExchange.validateTrade(emptyInventory);
      expect(missingValidation.isValid).toBe(false);
      expect(missingValidation.missingItems).toBeDefined();
    });

    it("should execute trades successfully", () => {
      const userId = "user789";
      const userInventory = new Map([["gem_common", 50]]);

      const initialTrades = gemExchange.currentTrades;
      const result = gemExchange.executeTrade(userId, userInventory);

      expect(result.success).toBe(true);
      expect(result.transactionId).toBeDefined();
      expect(result.itemsGiven).toHaveLength(1);
      expect(result.itemsReceived).toHaveLength(1);
      expect(gemExchange.currentTrades).toBe(initialTrades + 1);
      expect(gemExchange.getUserTradeCount(userId)).toBe(1);
    });

    it("should handle daily special constraints", () => {
      expect(dailySpecial.name).toBe("Daily Special: Legendary Arm Part");
      expect(dailySpecial.maxPerUser).toBe(1);
      expect(dailySpecial.isHighlighted).toBe(true);
      expect(dailySpecial.tags).toContain("daily");
      expect(dailySpecial.tags).toContain("special");
      expect(dailySpecial.tags).toContain("limited");

      // Check time constraints exist
      expect(dailySpecial.startDate).toBeDefined();
      expect(dailySpecial.endDate).toBeDefined();
    });

    it("should calculate total value correctly", () => {
      expect(gemExchange.totalValue).toBe(1); // 1 rare gem
      expect(dailySpecial.totalValue).toBe(1); // 1 legendary part
    });

    it("should serialize correctly", () => {
      const json = gemExchange.toJSON();
      expect(json.name).toBe(gemExchange.name);
      expect(json.tradingEventId).toBe(gemExchange.tradingEventId);
      expect(json.requiredItems).toHaveLength(1);
      expect(json.rewardItems).toHaveLength(1);
      expect(json.isAvailable).toBe(gemExchange.isAvailable);
      expect(json.totalValue).toBe(gemExchange.totalValue);
    });
  });

  describe("TradingFactory", () => {
    it("should create basic events", () => {
      const basicEvent = TradingFactory.createBasicEvent(
        "Test Event",
        "A test trading event"
      );

      expect(basicEvent.name).toBe("Test Event");
      expect(basicEvent.description).toBe("A test trading event");
      expect(basicEvent.status).toBe(TradingEventStatus.DRAFT);
    });

    it("should create simple trade offers", () => {
      const simpleOffer = TradingFactory.createSimpleTradeOffer(
        "event123",
        "Simple Trade",
        { itemId: "item_a", itemName: "Item A", quantity: 1 },
        { itemId: "item_b", itemName: "Item B", quantity: 2 },
        {
          description: "Trade 1 Item A for 2 Item B",
          maxTotalTrades: 50,
          minLevel: 5,
        }
      );

      expect(simpleOffer.name).toBe("Simple Trade");
      expect(simpleOffer.requiredItems).toHaveLength(1);
      expect(simpleOffer.rewardItems).toHaveLength(1);
      expect(simpleOffer.requiredItems[0].minLevel).toBe(5);
    });

    it("should create bundle trades", () => {
      const bundleOffer = TradingFactory.createBundleTradeOffer(
        "event456",
        "Bundle Deal",
        [
          { itemId: "gem1", itemName: "Common Gem", quantity: 5 },
          { itemId: "gem2", itemName: "Uncommon Gem", quantity: 2 },
        ],
        [
          { itemId: "part1", itemName: "Rare Part", quantity: 1 },
          { itemId: "chip1", itemName: "Epic Chip", quantity: 1 },
        ],
        {
          description: "Bundle trade for rare items",
          isHighlighted: true,
        }
      );

      expect(bundleOffer.name).toBe("Bundle Deal");
      expect(bundleOffer.requiredItems).toHaveLength(2);
      expect(bundleOffer.rewardItems).toHaveLength(2);
      expect(bundleOffer.isHighlighted).toBe(true);
      expect(bundleOffer.tags).toContain("bundle");
    });
  });

  describe("Integration Tests", () => {
    it("should handle complete trading workflow", () => {
      // 1. Activate trading event
      tradingEvent.updateStatus(TradingEventStatus.ACTIVE);
      tradingEvent.addTradeOffer(gemExchange);

      // 2. User checks eligibility
      const userId = "integration_user";
      const userLevel = 15;

      expect(tradingEvent.canUserTrade(userId)).toBe(true);

      const eligibility = gemExchange.canUserTrade(userId, userLevel);
      expect(eligibility.canTrade).toBe(true);

      // 3. User validates their inventory
      const userInventory = new Map([
        ["gem_common", 25],
        ["gem_uncommon", 5],
      ]);

      const validation = gemExchange.validateTrade(userInventory);
      expect(validation.isValid).toBe(true);

      // 4. Execute the trade
      const tradeResult = gemExchange.executeTrade(userId, userInventory);
      expect(tradeResult.success).toBe(true);

      // 5. Verify state changes
      expect(gemExchange.currentTrades).toBe(1);
      expect(gemExchange.getUserTradeCount(userId)).toBe(1);

      // 6. Record in trading event
      tradingEvent.recordUserTrade(userId, gemExchange.id);
      expect(tradingEvent.getUserTradeCount(userId)).toBe(1);
      expect(tradingEvent.totalTrades).toBe(1);
    });

    it("should handle multiple users and trade limits", () => {
      tradingEvent.updateStatus(TradingEventStatus.ACTIVE);
      tradingEvent.addTradeOffer(gemExchange);

      const users = ["user1", "user2", "user3"];
      const userInventory = new Map([["gem_common", 100]]);

      // Each user makes the maximum allowed trades
      users.forEach((userId) => {
        for (let i = 0; i < 5; i++) {
          // maxPerUser = 5
          const result = gemExchange.executeTrade(userId, userInventory);
          expect(result.success).toBe(true);
          tradingEvent.recordUserTrade(userId, gemExchange.id);
        }

        expect(gemExchange.getUserTradeCount(userId)).toBe(5);
        expect(tradingEvent.getUserTradeCount(userId)).toBe(5);

        // Try to trade again (should fail)
        const eligibility = gemExchange.canUserTrade(userId);
        expect(eligibility.canTrade).toBe(false);
        expect(eligibility.reasons).toContain(
          "Maximum trades per user reached (5)"
        );
      });

      expect(gemExchange.currentTrades).toBe(15); // 3 users × 5 trades
      expect(tradingEvent.totalTrades).toBe(15);
    });

    it("should handle event expiration and limits", () => {
      const now = new Date();
      const farPast = new Date(now.getTime() - 2000); // 2 seconds ago
      const past = new Date(now.getTime() - 1000); // 1 second ago

      const expiredEvent = TradingFactory.createLimitedTimeEvent(
        "Expired Event",
        "This event should be expired",
        farPast,
        past
      );

      expiredEvent.updateStatus(TradingEventStatus.ACTIVE);
      expect(expiredEvent.isActive).toBe(false);
      expect(expiredEvent.isExpired).toBe(true);

      const expiredOffer = TradingFactory.createSimpleTradeOffer(
        expiredEvent.id,
        "Expired Offer",
        { itemId: "item1", itemName: "Item 1", quantity: 1 },
        { itemId: "item2", itemName: "Item 2", quantity: 1 }
      );

      expect(expiredOffer.isAvailable).toBe(true); // Offer itself is not time-constrained

      // But the event eligibility should fail
      expect(expiredEvent.canUserTrade("user123")).toBe(false);
    });
  });
});
