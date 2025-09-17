import { ItemCategory } from "../types";
import type { ItemEffect } from "../types";
import { BaseItem } from "./base-item";
import type {
  IItem,
  ItemUsageResult,
  TradeableItemConfiguration,
} from "./item-interface";

/**
 * Tradeable Item - Consumable items that can be traded between players
 */
export class TradeableItem extends BaseItem {
  private _tradeHistory: TradeRecord[];

  constructor(config: TradeableItemConfiguration) {
    super({
      ...config,
      category: ItemCategory.TRADEABLE,
      consumable: true, // Tradeable items are consumable
      tradeable: true, // Always tradeable
    });

    this._tradeHistory = [];
  }

  get tradeHistory(): ReadonlyArray<TradeRecord> {
    return [...this._tradeHistory];
  }

  get tradeable(): true {
    return true;
  }

  canUse(context?: { playerId?: string; tradeContext?: any }): boolean {
    // Basic usage validation
    const reqCheck = this._checkRequirements(context);
    return reqCheck.valid;
  }

  use(context?: {
    playerId?: string;
    effectContext?: any;
    onEffectApplied?: (effect: ItemEffect) => void;
  }): ItemUsageResult {
    if (!this.canUse(context)) {
      return {
        success: false,
        effects: [],
        message: "Cannot use tradeable item - requirements not met",
        errors: ["Requirements not met"],
      };
    }

    const appliedEffects: ItemEffect[] = [];
    const messages: string[] = [];

    // Apply all effects from this tradeable item
    for (const effect of this._effects) {
      appliedEffects.push(effect);
      messages.push(effect.description);

      if (context?.onEffectApplied) {
        context.onEffectApplied(effect);
      }
    }

    // Record usage
    if (context?.playerId) {
      this._addUsageRecord(context.playerId);
    }

    this._updateLastModified();

    return {
      success: true,
      effects: appliedEffects,
      message:
        messages.length > 0
          ? messages.join(", ")
          : "Tradeable item used successfully",
      cooldownUntil:
        this._cooldownTime > 0
          ? new Date(Date.now() + this._cooldownTime * 1000)
          : undefined,
    };
  }

  /**
   * Execute a trade of this item between players
   */
  trade(
    fromPlayerId: string,
    toPlayerId: string,
    quantity: number = 1
  ): TradeResult {
    if (!this.tradeable) {
      return {
        success: false,
        message: "This item is not tradeable",
        errors: ["Item not tradeable"],
      };
    }

    if (quantity <= 0) {
      return {
        success: false,
        message: "Trade quantity must be positive",
        errors: ["Invalid quantity"],
      };
    }

    if (fromPlayerId === toPlayerId) {
      return {
        success: false,
        message: "Cannot trade with yourself",
        errors: ["Invalid trade participants"],
      };
    }

    // Record the trade
    const tradeRecord: TradeRecord = {
      id: `trade_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      fromPlayerId,
      toPlayerId,
      quantity,
      timestamp: new Date(),
      value: this._value * quantity,
    };

    this._tradeHistory.push(tradeRecord);
    this._updateLastModified();

    return {
      success: true,
      message: `Successfully traded ${quantity} ${this._name} from ${fromPlayerId} to ${toPlayerId}`,
      tradeRecord,
    };
  }

  protected _createClone(config: any): IItem {
    const clone = new TradeableItem({
      ...config,
      effects: this._effects,
    });
    // Don't copy trade history to clones
    return clone;
  }

  private _addUsageRecord(playerId: string): void {
    const usageRecord: TradeRecord = {
      id: `usage_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      fromPlayerId: playerId,
      toPlayerId: "consumed", // Special marker for consumption
      quantity: 1,
      timestamp: new Date(),
      value: 0, // No value exchange for consumption
    };

    this._tradeHistory.push(usageRecord);
  }

  /**
   * Get trade statistics
   */
  getTradeStats(): TradeStats {
    const actualTrades = this._tradeHistory.filter(
      (record) => record.toPlayerId !== "consumed"
    );
    const usages = this._tradeHistory.filter(
      (record) => record.toPlayerId === "consumed"
    );

    return {
      totalTrades: actualTrades.length,
      totalUsages: usages.length,
      totalValue: actualTrades.reduce((sum, record) => sum + record.value, 0),
      uniqueTraders: [
        ...new Set([
          ...actualTrades.map((r) => r.fromPlayerId),
          ...actualTrades.map((r) => r.toPlayerId),
        ]),
      ].filter((id) => id !== "consumed").length,
      lastTradeDate:
        actualTrades.length > 0
          ? actualTrades[actualTrades.length - 1].timestamp
          : undefined,
    };
  }
}

/**
 * Trade record interface
 */
export interface TradeRecord {
  id: string;
  fromPlayerId: string;
  toPlayerId: string; // "consumed" for usage records
  quantity: number;
  timestamp: Date;
  value: number;
}

/**
 * Trade result interface
 */
export interface TradeResult {
  success: boolean;
  message: string;
  tradeRecord?: TradeRecord;
  errors?: string[];
}

/**
 * Trade statistics interface
 */
export interface TradeStats {
  totalTrades: number;
  totalUsages: number;
  totalValue: number;
  uniqueTraders: number;
  lastTradeDate?: Date;
}
