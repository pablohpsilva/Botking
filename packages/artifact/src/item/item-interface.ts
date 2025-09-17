import type {
  Rarity,
  ItemCategory,
  ItemEffect,
  EnhancementEffect,
  SpeedUpEffect,
  ResourceEffect,
  GemEffect,
} from "../types";

/**
 * Interface for an Item artifact
 * Items are consumable objects that provide various effects
 */
export interface IItem {
  // Core identification
  readonly id: string;
  readonly name: string;
  readonly category: ItemCategory;
  readonly rarity: Rarity;
  readonly description: string;

  // Item properties
  readonly consumable: boolean;
  readonly tradeable: boolean;
  readonly stackable: boolean;
  readonly maxStackSize: number;
  readonly value: number; // Base value for trading/selling

  // Effects and usage
  readonly effects: ReadonlyArray<ItemEffect>;
  readonly cooldownTime: number; // Time before item can be used again (in seconds)
  readonly requirements: ReadonlyArray<string>; // Requirements to use this item

  // Metadata
  readonly source: string; // How this item was obtained
  readonly tags: ReadonlyArray<string>;
  readonly metadata: Record<string, any>;
  readonly version: string;
  readonly createdAt: Date;
  readonly lastModified: Date;

  // Methods
  canUse(context?: any): boolean;
  use(context?: any): ItemUsageResult;
  getEffectDescription(): string;
  clone(): IItem;
  toJSON(): Record<string, any>;
}

/**
 * Item usage result
 */
export interface ItemUsageResult {
  success: boolean;
  effects: ItemEffect[];
  message: string;
  cooldownUntil?: Date;
  errors?: string[];
}

/**
 * Item configuration for creation
 */
export interface ItemConfiguration {
  id?: string;
  name: string;
  category: ItemCategory;
  rarity: Rarity;
  description: string;
  consumable?: boolean;
  tradeable?: boolean;
  stackable?: boolean;
  maxStackSize?: number;
  value?: number;
  effects?: ItemEffect[];
  cooldownTime?: number;
  requirements?: string[];
  source?: string;
  tags?: string[];
  metadata?: Record<string, any>;
}

/**
 * Specific item type configurations
 */
export interface SpeedUpItemConfiguration extends ItemConfiguration {
  category: "SPEED_UP";
  effects: SpeedUpEffect[];
}

export interface ResourceItemConfiguration extends ItemConfiguration {
  category: "RESOURCE";
  effects: (ResourceEffect | EnhancementEffect)[];
}

export interface TradeableItemConfiguration extends ItemConfiguration {
  category: "TRADEABLE";
  tradeable: true;
}

export interface GemItemConfiguration extends ItemConfiguration {
  category: "GEMS";
  effects: GemEffect[];
}
