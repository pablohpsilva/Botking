/**
 * Trading System Exports
 *
 * Main exports for the trading system artifacts
 */

// Interfaces
export type { ITradingEvent } from "./trading-event-interface";
export type { ITradeOffer } from "./trade-offer-interface";

// Types
export type {
  TradeRequirement,
  TradeReward,
  TradeValidationResult,
  TradeExecutionResult,
  TradeStatistics,
  UserTradeEligibility,
} from "./trading-types";

// Classes
export { TradingEvent, type TradingEventConfiguration } from "./trading-event";
export { TradeOffer, type TradeOfferConfiguration } from "./trade-offer";

// Factory
export { TradingFactory } from "./trading-factory";

// Re-export database enums for convenience
export type {
  TradingEventStatus,
  TradeOfferStatus,
  TradeItemType,
} from "@botking/db";
