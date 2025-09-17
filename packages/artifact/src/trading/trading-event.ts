/**
 * Trading Event Implementation
 */

import { TradingEventStatus } from "@botking/db";
import type { ITradingEvent } from "./trading-event-interface";
import type { ITradeOffer } from "./trade-offer-interface";
import { createPackageLogger } from "@botking/logger";

/**
 * Configuration for creating a Trading Event
 */
export interface TradingEventConfiguration {
  id?: string;
  name: string;
  description?: string | null;
  status?: TradingEventStatus;
  startDate?: Date | null;
  endDate?: Date | null;
  isRepeatable?: boolean;
  maxTradesPerUser?: number | null;
  priority?: number;
  tags?: string[];
  imageUrl?: string | null;
  createdBy?: string | null;
  isPublic?: boolean;
  tradeOffers?: ITradeOffer[];
}

/**
 * Trading Event implementation
 */
export class TradingEvent implements ITradingEvent {
  private static logger = createPackageLogger("artifact");

  private readonly _id: string;
  private readonly _name: string;
  private readonly _description: string | null;
  private _status: TradingEventStatus;
  private readonly _startDate: Date | null;
  private readonly _endDate: Date | null;
  private readonly _isRepeatable: boolean;
  private readonly _maxTradesPerUser: number | null;
  private readonly _priority: number;
  private readonly _tags: string[];
  private readonly _imageUrl: string | null;
  private readonly _createdBy: string | null;
  private readonly _isPublic: boolean;
  private readonly _tradeOffers: Map<string, ITradeOffer>;
  private readonly _createdAt: Date;
  private _updatedAt: Date;

  // Trade tracking
  private readonly _userTradeCounts: Map<string, number>;

  constructor(config: TradingEventConfiguration) {
    this._id =
      config.id ||
      `trading_event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    this._name = config.name;
    this._description = config.description || null;
    this._status = config.status || TradingEventStatus.DRAFT;
    this._startDate = config.startDate || null;
    this._endDate = config.endDate || null;
    this._isRepeatable = config.isRepeatable || false;
    this._maxTradesPerUser = config.maxTradesPerUser || null;
    this._priority = config.priority || 0;
    this._tags = config.tags || [];
    this._imageUrl = config.imageUrl || null;
    this._createdBy = config.createdBy || null;
    this._isPublic = config.isPublic !== false; // Default to true
    this._createdAt = new Date();
    this._updatedAt = new Date();

    this._tradeOffers = new Map();
    this._userTradeCounts = new Map();

    // Initialize trade offers if provided
    if (config.tradeOffers) {
      config.tradeOffers.forEach((offer) => {
        this._tradeOffers.set(offer.id, offer);
      });
    }

    this._validateConfiguration();
  }

  // Getters
  get id(): string {
    return this._id;
  }
  get name(): string {
    return this._name;
  }
  get description(): string | null {
    return this._description;
  }
  get status(): TradingEventStatus {
    return this._status;
  }
  get startDate(): Date | null {
    return this._startDate;
  }
  get endDate(): Date | null {
    return this._endDate;
  }
  get isRepeatable(): boolean {
    return this._isRepeatable;
  }
  get maxTradesPerUser(): number | null {
    return this._maxTradesPerUser;
  }
  get priority(): number {
    return this._priority;
  }
  get tags(): ReadonlyArray<string> {
    return this._tags;
  }
  get imageUrl(): string | null {
    return this._imageUrl;
  }
  get createdBy(): string | null {
    return this._createdBy;
  }
  get isPublic(): boolean {
    return this._isPublic;
  }
  get tradeOffers(): ReadonlyArray<ITradeOffer> {
    return Array.from(this._tradeOffers.values());
  }
  get createdAt(): Date {
    return this._createdAt;
  }
  get updatedAt(): Date {
    return this._updatedAt;
  }

  // Computed properties
  get isActive(): boolean {
    if (this._status !== TradingEventStatus.ACTIVE) return false;

    const now = new Date();

    // Check if event has started
    if (this._startDate && now < this._startDate) return false;

    // Check if event has ended
    if (this._endDate && now > this._endDate) return false;

    return true;
  }

  get isExpired(): boolean {
    if (!this._endDate) return false;
    return new Date() > this._endDate;
  }

  get isUpcoming(): boolean {
    if (!this._startDate) return false;
    return new Date() < this._startDate;
  }

  get totalOffers(): number {
    return this._tradeOffers.size;
  }

  get totalTrades(): number {
    return Array.from(this._userTradeCounts.values()).reduce(
      (sum, count) => sum + count,
      0
    );
  }

  // Methods
  canUserTrade(userId: string): boolean {
    if (!this.isActive) return false;

    if (this._maxTradesPerUser === null) return true;

    const userTradeCount = this.getUserTradeCount(userId);
    return userTradeCount < this._maxTradesPerUser;
  }

  getUserTradeCount(userId: string): number {
    return this._userTradeCounts.get(userId) || 0;
  }

  isOfferAvailable(offerId: string): boolean {
    const offer = this._tradeOffers.get(offerId);
    return offer ? offer.isAvailable : false;
  }

  getAvailableOffers(): ReadonlyArray<ITradeOffer> {
    return Array.from(this._tradeOffers.values()).filter(
      (offer) => offer.isAvailable
    );
  }

  getTradeOffer(offerId: string): ITradeOffer | undefined {
    return this._tradeOffers.get(offerId);
  }

  getOfferById(offerId: string): ITradeOffer | null {
    return this._tradeOffers.get(offerId) || null;
  }

  /**
   * Add a trade offer to this event
   */
  addTradeOffer(offer: ITradeOffer): void {
    if (offer.tradingEventId !== this._id) {
      throw new Error("Trade offer does not belong to this trading event");
    }

    this._tradeOffers.set(offer.id, offer);
    this._updatedAt = new Date();

    TradingEvent.logger.info("Trade offer added to event", {
      eventId: this._id,
      eventName: this._name,
      offerId: offer.id,
      offerName: offer.name,
      action: "add_trade_offer",
    });
  }

  /**
   * Remove a trade offer from this event
   */
  removeTradeOffer(offerId: string): boolean {
    const removed = this._tradeOffers.delete(offerId);
    if (removed) {
      this._updatedAt = new Date();

      TradingEvent.logger.info("Trade offer removed from event", {
        eventId: this._id,
        eventName: this._name,
        offerId,
        action: "remove_trade_offer",
      });
    }
    return removed;
  }

  /**
   * Update event status
   */
  updateStatus(newStatus: TradingEventStatus): void {
    const oldStatus = this._status;
    this._status = newStatus;
    this._updatedAt = new Date();

    TradingEvent.logger.info("Trading event status updated", {
      eventId: this._id,
      eventName: this._name,
      oldStatus,
      newStatus,
      action: "update_status",
    });
  }

  /**
   * Record a user trade (for tracking purposes)
   */
  recordUserTrade(userId: string, offerId: string): void {
    const currentCount = this._userTradeCounts.get(userId) || 0;
    this._userTradeCounts.set(userId, currentCount + 1);

    TradingEvent.logger.info("User trade recorded", {
      eventId: this._id,
      eventName: this._name,
      userId,
      offerId,
      newTradeCount: currentCount + 1,
      action: "record_trade",
    });
  }

  private _validateConfiguration(): void {
    const errors: string[] = [];

    if (!this._name || this._name.trim().length === 0) {
      errors.push("Trading event name cannot be empty");
    }

    if (this._startDate && this._endDate && this._startDate >= this._endDate) {
      errors.push("Start date must be before end date");
    }

    if (this._maxTradesPerUser !== null && this._maxTradesPerUser <= 0) {
      errors.push("Max trades per user must be positive");
    }

    if (errors.length > 0) {
      throw new Error(`Trading event validation failed: ${errors.join(", ")}`);
    }
  }

  // Serialization
  toJSON(): any {
    return {
      id: this._id,
      name: this._name,
      description: this._description,
      status: this._status,
      startDate: this._startDate?.toISOString() || null,
      endDate: this._endDate?.toISOString() || null,
      isRepeatable: this._isRepeatable,
      maxTradesPerUser: this._maxTradesPerUser,
      priority: this._priority,
      tags: this._tags,
      imageUrl: this._imageUrl,
      createdBy: this._createdBy,
      isPublic: this._isPublic,
      tradeOffers: Array.from(this._tradeOffers.values()).map((offer) =>
        offer.toJSON()
      ),
      totalOffers: this.totalOffers,
      totalTrades: this.totalTrades,
      isActive: this.isActive,
      isExpired: this.isExpired,
      isUpcoming: this.isUpcoming,
      createdAt: this._createdAt.toISOString(),
      updatedAt: this._updatedAt.toISOString(),
    };
  }

  serialize(): string {
    return JSON.stringify(this.toJSON());
  }
}
