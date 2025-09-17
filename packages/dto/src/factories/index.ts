/**
 * DTO Factories Index
 *
 * Centralized exports for all DTO factories and related utilities.
 * This modular approach replaces the monolithic dto-factory.ts file.
 */

// Base factory
export { BaseDTOFactory } from "./base/base-factory";

// Artifact factories
export { SoulChipDTOFactory } from "./artifact/soul-chip-factory";
export { SkeletonDTOFactory } from "./artifact/skeleton-factory";
export { PartDTOFactory } from "./artifact/part-factory";
export { ExpansionChipDTOFactory } from "./artifact/expansion-chip-factory";
export { BotStateDTOFactory } from "./artifact/bot-state-factory";
export { BotDTOFactory } from "./artifact/bot-factory";
export { BotTemplateDTOFactory } from "./artifact/bot-template-factory";
export { CollectionDTOFactory } from "./artifact/collection-factory";

// Inventory factories
export { UserInventoryDTOFactory } from "./inventory/user-inventory-factory";
export { ItemDTOFactory } from "./inventory/item-factory";

// Trading factories
export { TradingEventDTOFactory } from "./trading/trading-event-factory";
export { TradeOfferDTOFactory } from "./trading/trade-offer-factory";
export { TradeOfferItemDTOFactory } from "./trading/trade-offer-item-factory";
export { UserTradeHistoryDTOFactory } from "./trading/user-trade-history-factory";

// Registry system
export { DTOFactoryRegistry } from "./registry";

// Initialize the registry by default
import { DTOFactoryRegistry } from "./registry";
DTOFactoryRegistry.initialize();
