/**
 * Trade Offer Implementation
 */

import { TradeOfferStatus } from "@botking/db";
import type { ITradeOffer } from "./trade-offer-interface";
import type {
  TradeRequirement,
  TradeReward,
  TradeValidationResult,
  TradeExecutionResult,
  UserTradeEligibility,
} from "./trading-types";
import { LoggerFactory } from "@botking/logger";

/**
 * Configuration for creating a Trade Offer
 */
export interface TradeOfferConfiguration {
  id?: string;
  tradingEventId: string;
  name: string;
  description?: string | null;
  status?: TradeOfferStatus;
  maxTotalTrades?: number | null;
  currentTrades?: number;
  maxPerUser?: number | null;
  startDate?: Date | null;
  endDate?: Date | null;
  displayOrder?: number;
  isHighlighted?: boolean;
  tags?: string[];
  requiredItems?: TradeRequirement[];
  rewardItems?: TradeReward[];
}

/**
 * Trade Offer implementation
 */
export class TradeOffer implements ITradeOffer {
  private static logger = LoggerFactory.createPackageLogger("artifact");

  private readonly _id: string;
  private readonly _tradingEventId: string;
  private readonly _name: string;
  private readonly _description: string | null;
  private _status: TradeOfferStatus;
  private readonly _maxTotalTrades: number | null;
  private _currentTrades: number;
  private readonly _maxPerUser: number | null;
  private readonly _startDate: Date | null;
  private readonly _endDate: Date | null;
  private readonly _displayOrder: number;
  private readonly _isHighlighted: boolean;
  private readonly _tags: string[];
  private readonly _requiredItems: TradeRequirement[];
  private readonly _rewardItems: TradeReward[];
  private readonly _createdAt: Date;
  private _updatedAt: Date;

  // Trade tracking
  private readonly _userTradeCounts: Map<string, number>;

  constructor(config: TradeOfferConfiguration) {
    this._id =
      config.id ||
      `trade_offer_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    this._tradingEventId = config.tradingEventId;
    this._name = config.name;
    this._description = config.description || null;
    this._status = config.status || "ACTIVE";
    this._maxTotalTrades = config.maxTotalTrades || null;
    this._currentTrades = config.currentTrades || 0;
    this._maxPerUser = config.maxPerUser || null;
    this._startDate = config.startDate || null;
    this._endDate = config.endDate || null;
    this._displayOrder = config.displayOrder || 0;
    this._isHighlighted = config.isHighlighted || false;
    this._tags = config.tags || [];
    this._requiredItems = config.requiredItems || [];
    this._rewardItems = config.rewardItems || [];
    this._createdAt = new Date();
    this._updatedAt = new Date();

    this._userTradeCounts = new Map();

    this._validateConfiguration();
  }

  // Getters
  get id(): string {
    return this._id;
  }
  get tradingEventId(): string {
    return this._tradingEventId;
  }
  get name(): string {
    return this._name;
  }
  get description(): string | null {
    return this._description;
  }
  get status(): TradeOfferStatus {
    return this._status;
  }
  get maxTotalTrades(): number | null {
    return this._maxTotalTrades;
  }
  get currentTrades(): number {
    return this._currentTrades;
  }
  get maxPerUser(): number | null {
    return this._maxPerUser;
  }
  get startDate(): Date | null {
    return this._startDate;
  }
  get endDate(): Date | null {
    return this._endDate;
  }
  get displayOrder(): number {
    return this._displayOrder;
  }
  get isHighlighted(): boolean {
    return this._isHighlighted;
  }
  get tags(): ReadonlyArray<string> {
    return this._tags;
  }
  get requiredItems(): ReadonlyArray<TradeRequirement> {
    return this._requiredItems;
  }
  get rewardItems(): ReadonlyArray<TradeReward> {
    return this._rewardItems;
  }
  get createdAt(): Date {
    return this._createdAt;
  }
  get updatedAt(): Date {
    return this._updatedAt;
  }

  // Computed properties
  get isAvailable(): boolean {
    if (
      this._status === "PAUSED" ||
      this._status === "SOLD_OUT" ||
      this._status === "EXPIRED"
    ) {
      return false;
    }

    // Check if sold out
    if (this.isSoldOut) return false;

    // Check if expired
    if (this.isExpired) return false;

    // Check if started
    const now = new Date();
    if (this._startDate && now < this._startDate) return false;

    return true;
  }

  get isExpired(): boolean {
    if (!this._endDate) return false;
    return new Date() > this._endDate;
  }

  get isSoldOut(): boolean {
    if (this._maxTotalTrades === null) return false;
    return this._currentTrades >= this._maxTotalTrades;
  }

  get remainingTrades(): number | null {
    if (this._maxTotalTrades === null) return null;
    return Math.max(0, this._maxTotalTrades - this._currentTrades);
  }

  get totalValue(): number {
    // Calculate value based on reward items (simplified)
    return this._rewardItems.reduce(
      (total, reward) => total + reward.quantity,
      0
    );
  }

  // Methods
  canUserTrade(userId: string, userLevel?: number): UserTradeEligibility {
    const reasons: string[] = [];
    let canTrade = true;

    // Check if offer is available
    if (!this.isAvailable) {
      canTrade = false;
      if (this._status === "PAUSED")
        reasons.push("Trade offer is temporarily paused");
      if (this._status === "SOLD_OUT" || this.isSoldOut)
        reasons.push("Trade offer is sold out");
      if (this._status === "EXPIRED" || this.isExpired)
        reasons.push("Trade offer has expired");
      if (this._startDate && new Date() < this._startDate) {
        reasons.push("Trade offer has not started yet");
      }
    }

    // Check user trade limits
    if (this._maxPerUser !== null) {
      const userTradeCount = this.getUserTradeCount(userId);
      if (userTradeCount >= this._maxPerUser) {
        canTrade = false;
        reasons.push(`Maximum trades per user reached (${this._maxPerUser})`);
      }
    }

    // Check level requirements
    const minLevel = Math.max(
      ...this._requiredItems.map((item) => item.minLevel || 0)
    );
    if (minLevel > 0 && userLevel !== undefined && userLevel < minLevel) {
      canTrade = false;
      reasons.push(
        `Minimum level ${minLevel} required (current: ${userLevel})`
      );
    }

    return {
      canTrade,
      reasons,
      remainingTrades:
        this._maxPerUser !== null
          ? Math.max(0, this._maxPerUser - this.getUserTradeCount(userId))
          : undefined,
      nextAvailableAt:
        this._startDate && new Date() < this._startDate
          ? this._startDate
          : undefined,
      requiredLevel: minLevel > 0 ? minLevel : undefined,
      userLevel,
    };
  }

  validateTrade(userInventory: Map<string, number>): TradeValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    const missingItems: TradeRequirement[] = [];
    const insufficientQuantities: TradeRequirement[] = [];

    // Check if user has all required items with sufficient quantities
    for (const requirement of this._requiredItems) {
      const userQuantity = userInventory.get(requirement.itemId) || 0;

      if (userQuantity === 0) {
        missingItems.push(requirement);
        errors.push(`Missing required item: ${requirement.itemName}`);
      } else if (userQuantity < requirement.quantity) {
        insufficientQuantities.push(requirement);
        errors.push(
          `Insufficient ${requirement.itemName}: need ${requirement.quantity}, have ${userQuantity}`
        );
      }
    }

    // Check if there are any reward items
    if (this._rewardItems.length === 0) {
      warnings.push("This trade has no reward items");
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      missingItems: missingItems.length > 0 ? missingItems : undefined,
      insufficientQuantities:
        insufficientQuantities.length > 0 ? insufficientQuantities : undefined,
    };
  }

  executeTrade(
    userId: string,
    userInventory: Map<string, number>
  ): TradeExecutionResult {
    const timestamp = new Date();

    // Validate the trade first
    const validation = this.validateTrade(userInventory);
    if (!validation.isValid) {
      return {
        success: false,
        message: `Trade validation failed: ${validation.errors.join(", ")}`,
        itemsGiven: [],
        itemsReceived: [],
        timestamp,
      };
    }

    // Check if user can trade
    const eligibility = this.canUserTrade(userId);
    if (!eligibility.canTrade) {
      return {
        success: false,
        message: `Trade not allowed: ${eligibility.reasons.join(", ")}`,
        itemsGiven: [],
        itemsReceived: [],
        timestamp,
      };
    }

    // Execute the trade (in a real implementation, this would update the database)
    try {
      // Record the trade
      this._currentTrades++;
      const currentUserTrades = this._userTradeCounts.get(userId) || 0;
      this._userTradeCounts.set(userId, currentUserTrades + 1);
      this._updatedAt = new Date();

      // Update status if sold out
      if (this.isSoldOut) {
        this._status = "SOLD_OUT";
      }

      const transactionId = `trade_${this._id}_${userId}_${timestamp.getTime()}`;

      TradeOffer.logger.info("Trade executed successfully", {
        tradeOfferId: this._id,
        tradeOfferName: this._name,
        userId,
        transactionId,
        itemsGiven: this._requiredItems,
        itemsReceived: this._rewardItems,
        action: "execute_trade",
      });

      return {
        success: true,
        message: "Trade executed successfully",
        transactionId,
        itemsGiven: [...this._requiredItems],
        itemsReceived: [...this._rewardItems],
        timestamp,
      };
    } catch (error) {
      TradeOffer.logger.error("Trade execution failed", {
        tradeOfferId: this._id,
        userId,
        error: error instanceof Error ? error.message : String(error),
        action: "execute_trade_error",
      });

      return {
        success: false,
        message: `Trade execution failed: ${error instanceof Error ? error.message : "Unknown error"}`,
        itemsGiven: [],
        itemsReceived: [],
        timestamp,
      };
    }
  }

  getUserTradeCount(userId: string): number {
    return this._userTradeCounts.get(userId) || 0;
  }

  /**
   * Update offer status
   */
  updateStatus(newStatus: TradeOfferStatus): void {
    const oldStatus = this._status;
    this._status = newStatus;
    this._updatedAt = new Date();

    TradeOffer.logger.info("Trade offer status updated", {
      tradeOfferId: this._id,
      tradeOfferName: this._name,
      oldStatus,
      newStatus,
      action: "update_status",
    });
  }

  private _validateConfiguration(): void {
    const errors: string[] = [];

    if (!this._name || this._name.trim().length === 0) {
      errors.push("Trade offer name cannot be empty");
    }

    if (!this._tradingEventId || this._tradingEventId.trim().length === 0) {
      errors.push("Trading event ID is required");
    }

    if (this._startDate && this._endDate && this._startDate >= this._endDate) {
      errors.push("Start date must be before end date");
    }

    if (this._maxTotalTrades !== null && this._maxTotalTrades <= 0) {
      errors.push("Max total trades must be positive");
    }

    if (this._maxPerUser !== null && this._maxPerUser <= 0) {
      errors.push("Max trades per user must be positive");
    }

    if (this._requiredItems.length === 0) {
      errors.push("Trade offer must have at least one required item");
    }

    if (this._rewardItems.length === 0) {
      errors.push("Trade offer must have at least one reward item");
    }

    if (errors.length > 0) {
      throw new Error(`Trade offer validation failed: ${errors.join(", ")}`);
    }
  }

  // Serialization
  toJSON(): any {
    return {
      id: this._id,
      tradingEventId: this._tradingEventId,
      name: this._name,
      description: this._description,
      status: this._status,
      maxTotalTrades: this._maxTotalTrades,
      currentTrades: this._currentTrades,
      maxPerUser: this._maxPerUser,
      startDate: this._startDate?.toISOString() || null,
      endDate: this._endDate?.toISOString() || null,
      displayOrder: this._displayOrder,
      isHighlighted: this._isHighlighted,
      tags: this._tags,
      requiredItems: this._requiredItems,
      rewardItems: this._rewardItems,
      isAvailable: this.isAvailable,
      isExpired: this.isExpired,
      isSoldOut: this.isSoldOut,
      remainingTrades: this.remainingTrades,
      totalValue: this.totalValue,
      createdAt: this._createdAt.toISOString(),
      updatedAt: this._updatedAt.toISOString(),
    };
  }

  serialize(): string {
    return JSON.stringify(this.toJSON());
  }
}
