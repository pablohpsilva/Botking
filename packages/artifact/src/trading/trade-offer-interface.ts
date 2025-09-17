/**
 * Trade Offer Interface
 */

import type { TradeOfferStatus } from "@botking/db";
import type {
  TradeRequirement,
  TradeReward,
  TradeValidationResult,
  TradeExecutionResult,
  UserTradeEligibility,
} from "./trading-types";

/**
 * Core interface for Trade Offers
 */
export interface ITradeOffer {
  // Core properties
  readonly id: string;
  readonly tradingEventId: string;
  readonly name: string;
  readonly description: string | null;
  readonly status: TradeOfferStatus;

  // Availability limits
  readonly maxTotalTrades: number | null;
  readonly currentTrades: number;
  readonly maxPerUser: number | null;

  // Time constraints
  readonly startDate: Date | null;
  readonly endDate: Date | null;

  // Display settings
  readonly displayOrder: number;
  readonly isHighlighted: boolean;

  // Trade metadata
  readonly tags: ReadonlyArray<string>;

  // Trade details
  readonly requiredItems: ReadonlyArray<TradeRequirement>;
  readonly rewardItems: ReadonlyArray<TradeReward>;

  // Timestamps
  readonly createdAt: Date;
  readonly updatedAt: Date;

  // Computed properties
  readonly isAvailable: boolean;
  readonly isExpired: boolean;
  readonly isSoldOut: boolean;
  readonly remainingTrades: number | null;
  readonly totalValue: number;

  // Methods
  canUserTrade(userId: string, userLevel?: number): UserTradeEligibility;
  validateTrade(userInventory: Map<string, number>): TradeValidationResult;
  executeTrade(
    userId: string,
    userInventory: Map<string, number>
  ): TradeExecutionResult;
  getUserTradeCount(userId: string): number;

  // Serialization
  toJSON(): any;
  serialize(): string;
}
