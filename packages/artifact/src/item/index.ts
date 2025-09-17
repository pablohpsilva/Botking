// Export interfaces and types
export type {
  IItem,
  ItemConfiguration,
  ItemUsageResult,
  SpeedUpItemConfiguration,
  ResourceItemConfiguration,
  TradeableItemConfiguration,
  GemItemConfiguration,
} from "./item-interface";

export type { TradeRecord, TradeResult, TradeStats } from "./tradeable-item";

// Export base class
export { BaseItem } from "./base-item";

// Export concrete implementations
export { SpeedUpItem } from "./speed-up-item";
export { ResourceItem } from "./resource-item";
export { TradeableItem } from "./tradeable-item";
export { GemItem } from "./gem-item";

// Export factory
export { ItemFactory } from "./item-factory";

// Import interfaces for type aliases
import type { IItem } from "./item-interface";
import type { SpeedUpItem } from "./speed-up-item";
import type { ResourceItem } from "./resource-item";
import type { TradeableItem } from "./tradeable-item";
import type { GemItem } from "./gem-item";

// Type aliases for convenience
export type AnyItem = IItem;
export type SpeedUpItemType = SpeedUpItem;
export type ResourceItemType = ResourceItem;
export type TradeableItemType = TradeableItem;
export type GemItemType = GemItem;
