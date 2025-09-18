import type { IItem, ItemConfiguration } from "./item-interface";
import { SpeedUpItem } from "./speed-up-item";
import { ResourceItem } from "./resource-item";
import { TradeableItem } from "./tradeable-item";
import { GemItem } from "./gem-item";
import {
  Rarity,
  ItemCategory,
  ResourceType,
  EnhancementDuration,
  SpeedUpTarget,
  GemType,
  ItemEffect,
} from "../types";
import { createPackageLogger } from "@botking/logger";

/**
 * Item builder validation result
 */
export interface ItemBuilderValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  suggestions: string[];
}

/**
 * ItemBuilder - Fluent interface for building complex Item artifacts
 * Implements Builder pattern with category-specific configurations
 */
export class ItemBuilder {
  private logger: ReturnType<typeof createPackageLogger>;
  private config: Partial<ItemConfiguration> = {};
  private effects: ItemEffect[] = [];

  constructor(name: string, category: ItemCategory) {
    this.logger = createPackageLogger("artifact", { service: "item-builder" });
    this.config.name = name;
    this.config.category = category;
    this.config.effects = [];
    this.initializeDefaults();
  }

  /**
   * Set item description
   */
  public withDescription(description: string): this {
    this.config.description = description;
    return this;
  }

  /**
   * Set item rarity
   */
  public withRarity(rarity: Rarity): this {
    this.config.rarity = rarity;
    return this;
  }

  /**
   * Set item value
   */
  public withValue(value: number): this {
    this.config.value = Math.max(0, value);
    return this;
  }

  /**
   * Set if item is consumable
   */
  public asConsumable(consumable: boolean = true): this {
    this.config.consumable = consumable;
    return this;
  }

  /**
   * Set if item is tradeable
   */
  public asTradeable(tradeable: boolean = true): this {
    this.config.tradeable = tradeable;
    return this;
  }

  /**
   * Set if item is stackable
   */
  public asStackable(stackable: boolean = true, maxStackSize?: number): this {
    this.config.stackable = stackable;
    if (maxStackSize !== undefined) {
      this.config.maxStackSize = maxStackSize;
    }
    return this;
  }

  /**
   * Set cooldown time
   */
  public withCooldown(cooldownTime: number): this {
    this.config.cooldownTime = Math.max(0, cooldownTime);
    return this;
  }

  /**
   * Add requirements
   */
  public withRequirements(requirements: string[]): this {
    this.config.requirements = [...requirements];
    return this;
  }

  /**
   * Add a single requirement
   */
  public withRequirement(requirement: string): this {
    if (!this.config.requirements) {
      this.config.requirements = [];
    }
    this.config.requirements.push(requirement);
    return this;
  }

  /**
   * Add tags
   */
  public withTags(tags: string[]): this {
    this.config.tags = [...tags];
    return this;
  }

  /**
   * Add a single tag
   */
  public withTag(tag: string): this {
    if (!this.config.tags) {
      this.config.tags = [];
    }
    this.config.tags.push(tag);
    return this;
  }

  /**
   * Add metadata
   */
  public withMetadata(metadata: Record<string, any>): this {
    this.config.metadata = { ...metadata };
    return this;
  }

  /**
   * Add an effect
   */
  public withEffect(effect: ItemEffect): this {
    this.effects.push(effect);
    return this;
  }

  /**
   * Add multiple effects
   */
  public withEffects(effects: ItemEffect[]): this {
    this.effects.push(...effects);
    return this;
  }

  // === Speed Up Item Specific Methods ===

  /**
   * Configure as speed up item
   */
  public asSpeedUpItem(
    target: SpeedUpTarget,
    speedMultiplier: number = 2.0,
    timeReduction: number = 300
  ): this {
    if (this.config.category !== ItemCategory.SPEED_UP) {
      throw new Error(
        "Item must be of SPEED_UP category to use speed up configuration"
      );
    }

    // Add speed up effect
    this.withEffect({
      id: `speedup_${Date.now()}`,
      type: "speed_up",
      magnitude: speedMultiplier,
      duration: timeReduction,
      description: `${speedMultiplier}x speed for ${target.replace("_", " ")}`,
      target: target,
    });

    this.withTag("speed-up").withTag(target.toLowerCase());

    if (!this.config.description) {
      this.config.description = `Speeds up ${target.replace("_", " ")} by ${speedMultiplier}x for ${timeReduction} seconds`;
    }

    return this;
  }

  // === Resource Item Specific Methods ===

  /**
   * Configure as resource item
   */
  public asResourceItem(
    resourceType: ResourceType,
    resourceAmount: number = 1,
    duration: EnhancementDuration = EnhancementDuration.PERMANENT
  ): this {
    if (this.config.category !== ItemCategory.RESOURCE) {
      throw new Error(
        "Item must be of RESOURCE category to use resource configuration"
      );
    }

    // Add resource effect
    this.withEffect({
      id: `resource_${Date.now()}`,
      type: "resource",
      magnitude: resourceAmount,
      description: `Provides ${resourceAmount} ${resourceType.replace("_", " ")}`,
      target: resourceType,
      duration: duration === EnhancementDuration.PERMANENT ? undefined : 3600, // 1 hour for temporary
    });

    this.withTag("resource").withTag(resourceType.toLowerCase());

    if (!this.config.description) {
      this.config.description = `Provides ${resourceAmount} ${resourceType.replace("_", " ")}`;
    }

    return this;
  }

  // === Gem Item Specific Methods ===

  /**
   * Configure as gem item
   */
  public asGemItem(gemType: GemType, gemValue?: number): this {
    if (this.config.category !== ItemCategory.GEMS) {
      throw new Error("Item must be of GEMS category to use gem configuration");
    }

    // Calculate gem value based on type and rarity if not provided
    if (gemValue === undefined) {
      const baseValue = this.getGemBaseValue(gemType);
      const rarityMultiplier = this.getRarityMultiplier(
        this.config.rarity || Rarity.COMMON
      );
      gemValue = baseValue * rarityMultiplier;
    }

    this.withValue(gemValue);

    // Add gem effect
    this.withEffect({
      id: `gem_${Date.now()}`,
      type: "gem",
      magnitude: gemValue,
      description: `${gemType} gem worth ${gemValue} coins`,
      target: "currency",
    });

    this.withTag("gem").withTag(gemType.toLowerCase());
    this.asTradeable(true).asStackable(true, 999);

    if (!this.config.description) {
      this.config.description = `A precious ${gemType.toLowerCase()} gem`;
    }

    return this;
  }

  // === Tradeable Item Specific Methods ===

  /**
   * Configure as tradeable item
   */
  public asTradeableItem(
    baseValue: number,
    marketMultiplier: number = 1.0
  ): this {
    if (this.config.category !== ItemCategory.TRADEABLE) {
      throw new Error(
        "Item must be of TRADEABLE category to use tradeable configuration"
      );
    }

    const tradeValue = Math.floor(baseValue * marketMultiplier);
    this.withValue(tradeValue);

    // Add trade effect
    this.withEffect({
      id: `trade_${Date.now()}`,
      type: "trade",
      magnitude: tradeValue,
      description: `Market value: ${tradeValue} coins`,
      target: "market",
    });

    this.asTradeable(true).withTag("tradeable");

    if (!this.config.description) {
      this.config.description = `A valuable tradeable item worth ${tradeValue} coins`;
    }

    return this;
  }

  /**
   * Add market fluctuation effect
   */
  public withMarketFluctuation(
    minMultiplier: number = 0.8,
    maxMultiplier: number = 1.2
  ): this {
    if (this.config.category !== ItemCategory.TRADEABLE) {
      throw new Error(
        "Market fluctuation can only be added to tradeable items"
      );
    }

    this.withMetadata({
      ...this.config.metadata,
      marketFluctuation: {
        minMultiplier,
        maxMultiplier,
        lastUpdate: new Date(),
      },
    });

    return this;
  }

  /**
   * Validate current configuration
   */
  public validate(): ItemBuilderValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    const suggestions: string[] = [];

    // Required field validation
    if (!this.config.name) {
      errors.push("Item name is required");
    }

    if (!this.config.category) {
      errors.push("Item category is required");
    }

    if (!this.config.description) {
      warnings.push("Item description is recommended");
    }

    // Category-specific validation
    if (this.config.category) {
      switch (this.config.category) {
        case ItemCategory.SPEED_UP:
          if (
            this.effects.length === 0 ||
            !this.effects.some((e) => e.type === "speed_up")
          ) {
            warnings.push("Speed up items should have speed up effects");
          }
          break;

        case ItemCategory.RESOURCE:
          if (
            this.effects.length === 0 ||
            !this.effects.some((e) => e.type === "resource")
          ) {
            warnings.push("Resource items should have resource effects");
          }
          break;

        case ItemCategory.GEMS:
          if (!this.config.tradeable) {
            suggestions.push("Gems are typically tradeable");
          }
          if (!this.config.stackable) {
            suggestions.push("Gems are typically stackable");
          }
          break;

        case ItemCategory.TRADEABLE:
          if (!this.config.tradeable) {
            warnings.push("Tradeable items should be marked as tradeable");
          }
          if (!this.config.value || this.config.value <= 0) {
            warnings.push("Tradeable items should have a positive value");
          }
          break;
      }
    }

    // Value validation
    if (this.config.value !== undefined && this.config.value < 0) {
      errors.push("Item value cannot be negative");
    }

    // Stack size validation
    if (
      this.config.stackable &&
      this.config.maxStackSize !== undefined &&
      this.config.maxStackSize <= 0
    ) {
      errors.push("Max stack size must be positive if item is stackable");
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      suggestions,
    };
  }

  /**
   * Get current configuration
   */
  public getConfiguration(): Partial<ItemConfiguration> {
    return {
      ...this.config,
      effects: [...this.effects],
    };
  }

  /**
   * Build the final Item artifact
   */
  public build(): IItem {
    this.logger.info("Building Item artifact", {
      name: this.config.name,
      category: this.config.category,
    });

    // Final validation
    const validation = this.validate();
    if (!validation.isValid) {
      this.logger.error("Item build validation failed", {
        errors: validation.errors,
      });
      throw new Error(
        `Item validation failed: ${validation.errors.join(", ")}`
      );
    }

    // Apply effects to configuration
    this.config.effects = [...this.effects];

    // Create appropriate item type
    try {
      let item: IItem;

      switch (this.config.category) {
        case ItemCategory.SPEED_UP:
          item = new SpeedUpItem(this.config as any);
          break;
        case ItemCategory.RESOURCE:
          item = new ResourceItem(this.config as any);
          break;
        case ItemCategory.TRADEABLE:
          item = new TradeableItem(this.config as any);
          break;
        case ItemCategory.GEMS:
          item = new GemItem(this.config as any);
          break;
        default:
          throw new Error(`Unknown item category: ${this.config.category}`);
      }

      this.logger.info("Item built successfully", {
        name: this.config.name,
        category: this.config.category,
        effectCount: this.effects.length,
      });

      return item;
    } catch (error) {
      this.logger.error("Item build failed", { error });
      throw error;
    }
  }

  /**
   * Reset builder to initial state
   */
  public reset(): this {
    const name = this.config.name;
    const category = this.config.category;
    this.config = { name, category };
    this.effects = [];
    this.initializeDefaults();
    this.logger.debug("Item builder reset");
    return this;
  }

  /**
   * Clone builder with current configuration
   */
  public clone(): ItemBuilder {
    const clone = new ItemBuilder(
      this.config.name || "Clone",
      this.config.category || ItemCategory.TRADEABLE
    );
    clone.config = { ...this.config };
    clone.effects = [...this.effects];
    return clone;
  }

  /**
   * Initialize default configuration
   */
  private initializeDefaults(): void {
    this.config.rarity = this.config.rarity || Rarity.COMMON;
    this.config.value = this.config.value || 1;
    this.config.consumable =
      this.config.consumable !== undefined ? this.config.consumable : true;
    this.config.tradeable =
      this.config.tradeable !== undefined ? this.config.tradeable : false;
    this.config.stackable =
      this.config.stackable !== undefined ? this.config.stackable : true;
    this.config.maxStackSize = this.config.maxStackSize || 99;
    this.config.cooldownTime = this.config.cooldownTime || 0;
    this.config.requirements = this.config.requirements || [];
    this.config.source = this.config.source || "item-builder";
    this.config.tags = this.config.tags || [];
    this.config.metadata = this.config.metadata || {};
  }

  /**
   * Get base value for gem types
   */
  private getGemBaseValue(gemType: GemType): number {
    switch (gemType) {
      case GemType.COMMON:
        return 10;
      case GemType.RARE:
        return 50;
      case GemType.EPIC:
        return 200;
      case GemType.LEGENDARY:
        return 1000;
      default:
        return 10;
    }
  }

  /**
   * Get multiplier based on rarity
   */
  private getRarityMultiplier(rarity: Rarity): number {
    switch (rarity) {
      case Rarity.COMMON:
        return 1;
      case Rarity.UNCOMMON:
        return 1.5;
      case Rarity.RARE:
        return 2;
      case Rarity.EPIC:
        return 3;
      case Rarity.LEGENDARY:
        return 5;
      case Rarity.ULTRA_RARE:
        return 8;
      case Rarity.PROTOTYPE:
        return 12;
      default:
        return 1;
    }
  }
}

/**
 * Factory methods for creating ItemBuilder instances
 */
export function createSpeedUpItemBuilder(name: string): ItemBuilder {
  return new ItemBuilder(name, ItemCategory.SPEED_UP);
}

export function createResourceItemBuilder(name: string): ItemBuilder {
  return new ItemBuilder(name, ItemCategory.RESOURCE);
}

export function createTradeableItemBuilder(name: string): ItemBuilder {
  return new ItemBuilder(name, ItemCategory.TRADEABLE);
}

export function createGemItemBuilder(name: string): ItemBuilder {
  return new ItemBuilder(name, ItemCategory.GEMS);
}
