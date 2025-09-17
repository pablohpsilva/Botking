import { BaseDTOFactory } from "./base/base-factory";

// Import all factories
import { SoulChipDTOFactory } from "./artifact/soul-chip-factory";
import { SkeletonDTOFactory } from "./artifact/skeleton-factory";
import { PartDTOFactory } from "./artifact/part-factory";
import { ExpansionChipDTOFactory } from "./artifact/expansion-chip-factory";
import { BotStateDTOFactory } from "./artifact/bot-state-factory";
import { BotDTOFactory } from "./artifact/bot-factory";
import { BotTemplateDTOFactory } from "./artifact/bot-template-factory";
import { CollectionDTOFactory } from "./artifact/collection-factory";

import { UserInventoryDTOFactory } from "./inventory/user-inventory-factory";
import { ItemDTOFactory } from "./inventory/item-factory";

import { TradingEventDTOFactory } from "./trading/trading-event-factory";
import { TradeOfferDTOFactory } from "./trading/trade-offer-factory";
import { TradeOfferItemDTOFactory } from "./trading/trade-offer-item-factory";
import { UserTradeHistoryDTOFactory } from "./trading/user-trade-history-factory";

/**
 * DTO Factory registry
 */
export class DTOFactoryRegistry {
  private static factories = new Map<string, BaseDTOFactory<any>>();

  public static register<T>(key: string, factory: BaseDTOFactory<T>): void {
    this.factories.set(key, factory);
  }

  public static get<T>(key: string): BaseDTOFactory<T> | undefined {
    return this.factories.get(key);
  }

  public static initialize(): void {
    // Register artifact factories
    this.register("soulChip", new SoulChipDTOFactory());
    this.register("skeleton", new SkeletonDTOFactory());
    this.register("part", new PartDTOFactory());
    this.register("expansionChip", new ExpansionChipDTOFactory());
    this.register("botState", new BotStateDTOFactory());
    this.register("bot", new BotDTOFactory());
    this.register("botTemplate", new BotTemplateDTOFactory());
    this.register("collection", new CollectionDTOFactory());

    // Register inventory factories
    this.register("userInventory", new UserInventoryDTOFactory());
    this.register("item", new ItemDTOFactory());

    // Register trading factories
    this.register("tradingEvent", new TradingEventDTOFactory());
    this.register("tradeOffer", new TradeOfferDTOFactory());
    this.register("tradeOfferItem", new TradeOfferItemDTOFactory());
    this.register("userTradeHistory", new UserTradeHistoryDTOFactory());
  }

  /**
   * Get all available factory keys
   */
  public static getAvailableKeys(): string[] {
    return Array.from(this.factories.keys());
  }

  /**
   * Check if a factory is registered
   */
  public static hasFactory(key: string): boolean {
    return this.factories.has(key);
  }

  /**
   * Clear all registered factories (mainly for testing)
   */
  public static clear(): void {
    this.factories.clear();
  }

  /**
   * Get factory count
   */
  public static getFactoryCount(): number {
    return this.factories.size;
  }
}
