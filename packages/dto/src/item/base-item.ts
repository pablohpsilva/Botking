import type { Rarity, ItemCategory, ItemEffect } from "../types";
import type {
  IItem,
  ItemConfiguration,
  ItemUsageResult,
} from "./item-interface";

/**
 * Abstract base class for all Item artifacts
 * Provides common functionality for all item types
 */
export abstract class BaseItem implements IItem {
  protected _id: string;
  protected _name: string;
  protected _category: ItemCategory;
  protected _rarity: Rarity;
  protected _description: string;
  protected _consumable: boolean;
  protected _tradeable: boolean;
  protected _stackable: boolean;
  protected _maxStackSize: number;
  protected _value: number;
  protected _effects: ItemEffect[];
  protected _cooldownTime: number;
  protected _requirements: string[];
  protected _source: string;
  protected _tags: string[];
  protected _metadata: Record<string, any>;
  protected _version: string;
  protected _createdAt: Date;
  protected _lastModified: Date;

  constructor(config: ItemConfiguration) {
    this._id =
      config.id ||
      `item_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    this._name = config.name;
    this._category = config.category;
    this._rarity = config.rarity;
    this._description = config.description;
    this._consumable = config.consumable ?? true; // Items are consumable by default
    this._tradeable = config.tradeable ?? false; // Items are not tradeable by default
    this._stackable = config.stackable ?? true; // Items are stackable by default
    this._maxStackSize = config.maxStackSize ?? 99; // Default stack size
    this._value = config.value ?? 1;
    this._effects = config.effects || [];
    this._cooldownTime = config.cooldownTime ?? 0;
    this._requirements = config.requirements || [];
    this._source = config.source || "unknown";
    this._tags = config.tags || [];
    this._metadata = config.metadata || {};
    this._version = "1.0.0";
    this._createdAt = new Date();
    this._lastModified = new Date();

    this._validateConfiguration();
  }

  // Getters
  get id(): string {
    return this._id;
  }
  get name(): string {
    return this._name;
  }
  get category(): ItemCategory {
    return this._category;
  }
  get rarity(): Rarity {
    return this._rarity;
  }
  get description(): string {
    return this._description;
  }
  get consumable(): boolean {
    return this._consumable;
  }
  get tradeable(): boolean {
    return this._tradeable;
  }
  get stackable(): boolean {
    return this._stackable;
  }
  get maxStackSize(): number {
    return this._maxStackSize;
  }
  get value(): number {
    return this._value;
  }
  get effects(): ReadonlyArray<ItemEffect> {
    return [...this._effects];
  }
  get cooldownTime(): number {
    return this._cooldownTime;
  }
  get requirements(): ReadonlyArray<string> {
    return [...this._requirements];
  }
  get source(): string {
    return this._source;
  }
  get tags(): ReadonlyArray<string> {
    return [...this._tags];
  }
  get metadata(): Record<string, any> {
    return { ...this._metadata };
  }
  get version(): string {
    return this._version;
  }
  get createdAt(): Date {
    return new Date(this._createdAt.getTime());
  }
  get lastModified(): Date {
    return new Date(this._lastModified.getTime());
  }

  // Abstract methods that must be implemented by subclasses
  abstract canUse(context?: any): boolean;
  abstract use(context?: any): ItemUsageResult;

  // Common methods
  getEffectDescription(): string {
    return this._effects.map((effect) => effect.description).join(", ");
  }

  clone(): IItem {
    const config: ItemConfiguration = {
      id: `${this._id}_clone_${Date.now()}`,
      name: this._name,
      category: this._category,
      rarity: this._rarity,
      description: this._description,
      consumable: this._consumable,
      tradeable: this._tradeable,
      stackable: this._stackable,
      maxStackSize: this._maxStackSize,
      value: this._value,
      effects: [...this._effects],
      cooldownTime: this._cooldownTime,
      requirements: [...this._requirements],
      source: this._source,
      tags: [...this._tags],
      metadata: { ...this._metadata },
    };

    // This will need to be overridden in concrete classes to return the correct type
    return this._createClone(config);
  }

  protected abstract _createClone(config: ItemConfiguration): IItem;

  toJSON(): Record<string, any> {
    return {
      id: this._id,
      name: this._name,
      category: this._category,
      rarity: this._rarity,
      description: this._description,
      consumable: this._consumable,
      tradeable: this._tradeable,
      stackable: this._stackable,
      maxStackSize: this._maxStackSize,
      value: this._value,
      effects: [...this._effects],
      cooldownTime: this._cooldownTime,
      requirements: [...this._requirements],
      source: this._source,
      tags: [...this._tags],
      metadata: { ...this._metadata },
      version: this._version,
      createdAt: this._createdAt.toISOString(),
      lastModified: this._lastModified.toISOString(),
    };
  }

  // Validation
  protected _validateConfiguration(): void {
    const errors: string[] = [];

    if (!this._name || this._name.trim().length === 0) {
      errors.push("Item name is required");
    }

    if (!this._description || this._description.trim().length === 0) {
      errors.push("Item description is required");
    }

    if (this._maxStackSize < 1) {
      errors.push("Max stack size must be at least 1");
    }

    if (this._value < 0) {
      errors.push("Item value cannot be negative");
    }

    if (this._cooldownTime < 0) {
      errors.push("Cooldown time cannot be negative");
    }

    if (errors.length > 0) {
      throw new Error(`Item validation failed: ${errors.join(", ")}`);
    }
  }

  // Utility methods
  protected _updateLastModified(): void {
    this._lastModified = new Date();
  }

  protected _checkRequirements(context?: any): {
    valid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    // Basic requirement checking - can be extended by subclasses
    if (this._requirements.length > 0 && !context) {
      errors.push("Context required to validate item usage requirements");
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }
}
