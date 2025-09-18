import { ItemCategory, GemType } from "../types";
import type { GemEffect } from "../types";
import { BaseItem } from "./base-item";
import type {
  IItem,
  ItemUsageResult,
  GemItemConfiguration,
} from "./item-interface";

/**
 * Gem Item - Consumable currency items used to acquire other items
 */
export class GemItem extends BaseItem {
  private _gemEffects: GemEffect[];
  private _gemType: GemType;

  constructor(config: GemItemConfiguration) {
    super({
      ...config,
      category: ItemCategory.GEMS,
      consumable: true, // Gems are consumable when spent
      tradeable: config.tradeable ?? true, // Gems are usually tradeable
      stackable: true, // Gems are always stackable
      maxStackSize: config.maxStackSize ?? 9999, // Large stack size for currency
    });

    this._gemEffects = config.effects.filter(
      (effect): effect is GemEffect => effect.type === "gem"
    );

    if (this._gemEffects.length === 0) {
      throw new Error("Gem items must have at least one gem effect");
    }

    // Determine gem type from effects (assuming all effects are the same gem type)
    this._gemType = this._gemEffects[0].gemType;

    // Validate all effects are the same gem type
    const allSameType = this._gemEffects.every(
      (effect) => effect.gemType === this._gemType
    );
    if (!allSameType) {
      throw new Error("All gem effects must be of the same gem type");
    }
  }

  get gemEffects(): ReadonlyArray<GemEffect> {
    return [...this._gemEffects];
  }

  get gemType(): GemType {
    return this._gemType;
  }

  canUse(context?: {
    purchaseTarget?: string;
    cost?: number;
    transactionType?: "purchase" | "exchange" | "upgrade";
  }): boolean {
    if (!context) {
      return false;
    }

    // Check if gem has enough value for the transaction
    const totalValue = this.getTotalValue();
    if (context.cost && totalValue < context.cost) {
      return false;
    }

    // Check basic requirements
    const reqCheck = this._checkRequirements(context);
    return reqCheck.valid;
  }

  use(context?: {
    purchaseTarget?: string;
    cost?: number;
    transactionType?: "purchase" | "exchange" | "upgrade";
    onTransaction?: (result: ItemUsageResult) => void;
  }): ItemUsageResult {
    if (!this.canUse(context)) {
      return {
        success: false,
        effects: [],
        message: "Cannot use gem - insufficient value or requirements not met",
        errors: ["Insufficient value or invalid requirements"],
      };
    }

    const totalValue = this.getTotalValue();
    const cost = context!.cost || 0;
    const transactionType = context!.transactionType || "purchase";
    const target = context!.purchaseTarget || "unknown item";

    if (cost > totalValue) {
      return {
        success: false,
        effects: [],
        message: `Insufficient gem value. Required: ${cost}, Available: ${totalValue}`,
        errors: [`Insufficient value: ${totalValue}/${cost}`],
      };
    }

    // Calculate change if any
    const change = totalValue - cost;

    this._updateLastModified();

    const result: ItemUsageResult = {
      success: true,
      effects: this._gemEffects,
      message:
        `${transactionType} completed: ${target} for ${cost} ${this._gemType} gems` +
        (change > 0 ? ` (change: ${change})` : ""),
      cooldownUntil:
        this._cooldownTime > 0
          ? new Date(Date.now() + this._cooldownTime * 1000)
          : undefined,
    };

    // Call transaction callback if provided
    if (context?.onTransaction) {
      context.onTransaction(result);
    }

    return result;
  }

  protected _createClone(config: any): IItem {
    return new GemItem({
      ...config,
      effects: this._gemEffects,
    });
  }

  /**
   * Get total gem value from all effects
   */
  getTotalValue(): number {
    return this._gemEffects.reduce((total, effect) => total + effect.value, 0);
  }

  /**
   * Check if this gem can afford a cost
   */
  canAfford(cost: number): boolean {
    return this.getTotalValue() >= cost;
  }

  /**
   * Split gems into smaller denominations (if applicable)
   */
  split(amount: number): {
    success: boolean;
    gems?: GemItem[];
    error?: string;
  } {
    if (amount <= 0) {
      return { success: false, error: "Split amount must be positive" };
    }

    const totalValue = this.getTotalValue();
    if (amount > totalValue) {
      return {
        success: false,
        error: "Cannot split more value than available",
      };
    }

    if (amount === totalValue) {
      // Return a clone of this gem
      return { success: true, gems: [this.clone() as GemItem] };
    }

    // Create two gems: one with the requested amount, one with the remainder
    const splitGem = new GemItem({
      name: this._name,
      category: ItemCategory.GEMS,
      rarity: this._rarity,
      description: this._description,
      effects: [
        {
          id: `gem_${Date.now()}_split`,
          type: "gem",
          magnitude: amount,
          description: `${amount} ${this._gemType} gems`,
          gemType: this._gemType,
          value: amount,
        },
      ],
      tradeable: this._tradeable,
      stackable: this._stackable,
      maxStackSize: this._maxStackSize,
      source: `split_from_${this._id}`,
    });

    const remainderGem = new GemItem({
      name: this._name,
      category: ItemCategory.GEMS,
      rarity: this._rarity,
      description: this._description,
      effects: [
        {
          id: `gem_${Date.now()}_remainder`,
          type: "gem",
          magnitude: totalValue - amount,
          description: `${totalValue - amount} ${this._gemType} gems`,
          gemType: this._gemType,
          value: totalValue - amount,
        },
      ],
      tradeable: this._tradeable,
      stackable: this._stackable,
      maxStackSize: this._maxStackSize,
      source: `split_from_${this._id}`,
    });

    return { success: true, gems: [splitGem, remainderGem] };
  }

  /**
   * Combine with another gem of the same type
   */
  combine(otherGem: GemItem): {
    success: boolean;
    combinedGem?: GemItem;
    error?: string;
  } {
    if (otherGem.gemType !== this._gemType) {
      return {
        success: false,
        error: "Cannot combine gems of different types",
      };
    }

    const totalValue = this.getTotalValue() + otherGem.getTotalValue();

    const combinedGem = new GemItem({
      name: this._name,
      category: ItemCategory.GEMS,
      rarity: this._rarity, // Could be enhanced to determine best rarity
      description: this._description,
      effects: [
        {
          id: `gem_${Date.now()}_combined`,
          type: "gem",
          magnitude: totalValue,
          description: `${totalValue} ${this._gemType} gems`,
          gemType: this._gemType,
          value: totalValue,
        },
      ],
      tradeable: this._tradeable && otherGem.tradeable,
      stackable: this._stackable,
      maxStackSize: Math.max(this._maxStackSize, otherGem.maxStackSize),
      source: `combined_from_${this._id}_and_${otherGem.id}`,
    });

    return { success: true, combinedGem };
  }
}
