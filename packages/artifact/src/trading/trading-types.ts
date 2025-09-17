/**
 * Trading System Business Logic Types
 *
 * These are artifact-specific interfaces that extend database models
 * with business logic. Database enums are imported from @botking/db.
 */

/**
 * Trading requirement for items in a trade offer
 */
export interface TradeRequirement {
  itemId: string;
  itemName: string;
  quantity: number;
  minLevel?: number;
}

/**
 * Trading reward for items in a trade offer
 */
export interface TradeReward {
  itemId: string;
  itemName: string;
  quantity: number;
}

/**
 * Result of a trade validation
 */
export interface TradeValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  missingItems?: TradeRequirement[];
  insufficientQuantities?: TradeRequirement[];
}

/**
 * Result of a trade execution
 */
export interface TradeExecutionResult {
  success: boolean;
  message: string;
  transactionId?: string;
  itemsGiven: TradeRequirement[];
  itemsReceived: TradeReward[];
  timestamp: Date;
}

/**
 * Trade statistics for events and offers
 */
export interface TradeStatistics {
  totalTrades: number;
  totalValue: number;
  popularItems: Array<{
    itemId: string;
    itemName: string;
    timesTraded: number;
  }>;
  averageTradesPerUser: number;
}

/**
 * User's trade eligibility for a specific offer
 */
export interface UserTradeEligibility {
  canTrade: boolean;
  reasons: string[];
  remainingTrades?: number;
  nextAvailableAt?: Date;
  requiredLevel?: number;
  userLevel?: number;
}
