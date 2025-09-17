/**
 * Trading Factory
 *
 * Factory for creating trading events and trade offers
 */

import { TradingEventStatus, TradeOfferStatus } from "@botking/db";
import { TradingEvent, type TradingEventConfiguration } from "./trading-event";
import { TradeOffer, type TradeOfferConfiguration } from "./trade-offer";
import type { ITradingEvent } from "./trading-event-interface";
import type { ITradeOffer } from "./trade-offer-interface";
import type { TradeRequirement, TradeReward } from "./trading-types";

export class TradingFactory {
  /**
   * Create a simple trading event
   */
  static createBasicEvent(
    name: string,
    description?: string,
    options?: {
      startDate?: Date;
      endDate?: Date;
      maxTradesPerUser?: number;
      isRepeatable?: boolean;
      createdBy?: string;
    }
  ): ITradingEvent {
    const config: TradingEventConfiguration = {
      name,
      description,
      status: "DRAFT",
      startDate: options?.startDate,
      endDate: options?.endDate,
      maxTradesPerUser: options?.maxTradesPerUser,
      isRepeatable: options?.isRepeatable || false,
      createdBy: options?.createdBy,
    };

    return new TradingEvent(config);
  }

  /**
   * Create a limited-time event
   */
  static createLimitedTimeEvent(
    name: string,
    description: string,
    startDate: Date,
    endDate: Date,
    options?: {
      maxTradesPerUser?: number;
      priority?: number;
      imageUrl?: string;
      createdBy?: string;
    }
  ): ITradingEvent {
    const config: TradingEventConfiguration = {
      name,
      description,
      status: "DRAFT",
      startDate,
      endDate,
      maxTradesPerUser: options?.maxTradesPerUser,
      priority: options?.priority || 1,
      imageUrl: options?.imageUrl,
      createdBy: options?.createdBy,
      tags: ["limited-time"],
    };

    return new TradingEvent(config);
  }

  /**
   * Create a seasonal event
   */
  static createSeasonalEvent(
    season: "spring" | "summer" | "autumn" | "winter",
    year: number,
    options?: {
      maxTradesPerUser?: number;
      createdBy?: string;
    }
  ): ITradingEvent {
    const seasonNames = {
      spring: "Spring",
      summer: "Summer",
      autumn: "Autumn",
      winter: "Winter",
    };

    const config: TradingEventConfiguration = {
      name: `${seasonNames[season]} Trading ${year}`,
      description: `Special ${season} trading event with seasonal items and rewards`,
      status: "DRAFT",
      maxTradesPerUser: options?.maxTradesPerUser,
      priority: 2,
      createdBy: options?.createdBy,
      tags: ["seasonal", season, year.toString()],
    };

    return new TradingEvent(config);
  }

  /**
   * Create a simple item-for-item trade offer
   */
  static createSimpleTradeOffer(
    tradingEventId: string,
    name: string,
    requiredItem: { itemId: string; itemName: string; quantity: number },
    rewardItem: { itemId: string; itemName: string; quantity: number },
    options?: {
      description?: string;
      maxTotalTrades?: number;
      maxPerUser?: number;
      minLevel?: number;
    }
  ): ITradeOffer {
    const requiredItems: TradeRequirement[] = [
      {
        itemId: requiredItem.itemId,
        itemName: requiredItem.itemName,
        quantity: requiredItem.quantity,
        minLevel: options?.minLevel,
      },
    ];

    const rewardItems: TradeReward[] = [
      {
        itemId: rewardItem.itemId,
        itemName: rewardItem.itemName,
        quantity: rewardItem.quantity,
      },
    ];

    const config: TradeOfferConfiguration = {
      tradingEventId,
      name,
      description: options?.description,
      maxTotalTrades: options?.maxTotalTrades,
      maxPerUser: options?.maxPerUser,
      requiredItems,
      rewardItems,
    };

    return new TradeOffer(config);
  }

  /**
   * Create a gem exchange offer
   */
  static createGemExchange(
    tradingEventId: string,
    fromGemType: string,
    fromQuantity: number,
    toGemType: string,
    toQuantity: number,
    options?: {
      maxTotalTrades?: number;
      maxPerUser?: number;
      isHighlighted?: boolean;
    }
  ): ITradeOffer {
    const config: TradeOfferConfiguration = {
      tradingEventId,
      name: `${fromQuantity}x ${fromGemType} → ${toQuantity}x ${toGemType}`,
      description: `Exchange ${fromQuantity} ${fromGemType} gems for ${toQuantity} ${toGemType} gems`,
      maxTotalTrades: options?.maxTotalTrades,
      maxPerUser: options?.maxPerUser,
      isHighlighted: options?.isHighlighted || false,
      tags: ["gems", "exchange"],
      requiredItems: [
        {
          itemId: `gem_${fromGemType.toLowerCase()}`,
          itemName: `${fromGemType} Gem`,
          quantity: fromQuantity,
        },
      ],
      rewardItems: [
        {
          itemId: `gem_${toGemType.toLowerCase()}`,
          itemName: `${toGemType} Gem`,
          quantity: toQuantity,
        },
      ],
    };

    return new TradeOffer(config);
  }

  /**
   * Create a bundle trade offer (multiple items for multiple items)
   */
  static createBundleTradeOffer(
    tradingEventId: string,
    name: string,
    requiredItems: Array<{
      itemId: string;
      itemName: string;
      quantity: number;
      minLevel?: number;
    }>,
    rewardItems: Array<{ itemId: string; itemName: string; quantity: number }>,
    options?: {
      description?: string;
      maxTotalTrades?: number;
      maxPerUser?: number;
      isHighlighted?: boolean;
    }
  ): ITradeOffer {
    const requirements: TradeRequirement[] = requiredItems.map((item) => ({
      itemId: item.itemId,
      itemName: item.itemName,
      quantity: item.quantity,
      minLevel: item.minLevel,
    }));

    const rewards: TradeReward[] = rewardItems.map((item) => ({
      itemId: item.itemId,
      itemName: item.itemName,
      quantity: item.quantity,
    }));

    const config: TradeOfferConfiguration = {
      tradingEventId,
      name,
      description: options?.description,
      maxTotalTrades: options?.maxTotalTrades,
      maxPerUser: options?.maxPerUser,
      isHighlighted: options?.isHighlighted || false,
      tags: ["bundle"],
      requiredItems: requirements,
      rewardItems: rewards,
    };

    return new TradeOffer(config);
  }

  /**
   * Create a daily special offer
   */
  static createDailySpecial(
    tradingEventId: string,
    requiredItem: { itemId: string; itemName: string; quantity: number },
    rewardItem: { itemId: string; itemName: string; quantity: number },
    date: Date = new Date()
  ): ITradeOffer {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const config: TradeOfferConfiguration = {
      tradingEventId,
      name: `Daily Special: ${rewardItem.itemName}`,
      description: `Limited time offer - today only!`,
      startDate: startOfDay,
      endDate: endOfDay,
      maxPerUser: 1,
      isHighlighted: true,
      tags: ["daily", "special", "limited"],
      requiredItems: [
        {
          itemId: requiredItem.itemId,
          itemName: requiredItem.itemName,
          quantity: requiredItem.quantity,
        },
      ],
      rewardItems: [
        {
          itemId: rewardItem.itemId,
          itemName: rewardItem.itemName,
          quantity: rewardItem.quantity,
        },
      ],
    };

    return new TradeOffer(config);
  }
}
