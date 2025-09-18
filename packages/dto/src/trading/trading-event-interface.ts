/**
 * Trading Event Interface
 */

import type { TradingEventStatus } from "@botking/db";
import type { ITradeOffer } from "./trade-offer-interface";

/**
 * Core interface for Trading Events
 */
export interface ITradingEvent {
  // Core properties
  readonly id: string;
  readonly name: string;
  readonly description: string | null;
  readonly status: TradingEventStatus;

  // Time constraints
  readonly startDate: Date | null;
  readonly endDate: Date | null;

  // Event settings
  readonly isRepeatable: boolean;
  readonly maxTradesPerUser: number | null;
  readonly priority: number;

  // Event metadata
  readonly tags: ReadonlyArray<string>;
  readonly imageUrl: string | null;

  // Admin fields
  readonly createdBy: string | null;
  readonly isPublic: boolean;

  // Relations
  readonly tradeOffers: ReadonlyArray<ITradeOffer>;

  // Timestamps
  readonly createdAt: Date;
  readonly updatedAt: Date;

  // Computed properties
  readonly isActive: boolean;
  readonly isExpired: boolean;
  readonly isUpcoming: boolean;
  readonly totalOffers: number;
  readonly totalTrades: number;

  // Methods
  canUserTrade(userId: string): boolean;
  getUserTradeCount(userId: string): number;
  isOfferAvailable(offerId: string): boolean;
  getAvailableOffers(): ReadonlyArray<ITradeOffer>;
  getOfferById(offerId: string): ITradeOffer | null;

  // Serialization
  toJSON(): any;
  serialize(): string;
}
