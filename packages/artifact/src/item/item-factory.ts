import { SpeedUpItem } from "./speed-up-item";
import { ResourceItem } from "./resource-item";
import { TradeableItem } from "./tradeable-item";
import { GemItem } from "./gem-item";
import type { IItem } from "./item-interface";
import {
  Rarity,
  ItemCategory,
  ResourceType,
  EnhancementDuration,
  SpeedUpTarget,
  GemType,
} from "../types";

/**
 * Factory for creating Item artifacts
 * Provides methods for creating different types of items with pre-configured settings
 */
export class ItemFactory {
  /**
   * Create a speed up item
   */
  static createSpeedUpItem(
    name: string,
    target: SpeedUpTarget,
    speedMultiplier: number = 2.0,
    timeReduction: number = 300, // 5 minutes in seconds
    rarity: Rarity = Rarity.COMMON
  ): SpeedUpItem {
    return new SpeedUpItem({
      name,
      category: ItemCategory.SPEED_UP,
      rarity,
      description: `Speeds up ${target.replace("_", " ")} by ${speedMultiplier}x and reduces time by ${timeReduction} seconds`,
      effects: [
        {
          id: `speedup_${Date.now()}`,
          type: "speed_up",
          magnitude: speedMultiplier,
          description: `${speedMultiplier}x speed for ${target.replace("_", " ")}`,
          speedUpTarget: target,
          speedMultiplier,
          timeReduction,
        },
      ],
      value: this._calculateSpeedUpValue(
        speedMultiplier,
        timeReduction,
        rarity
      ),
      source: "factory_created",
      tags: ["speed_up", target],
    });
  }

  /**
   * Create a resource item that gives resources
   */
  static createResourceItem(
    name: string,
    resourceType: ResourceType,
    amount: number,
    rarity: Rarity = Rarity.COMMON
  ): ResourceItem {
    return new ResourceItem({
      name,
      category: ItemCategory.RESOURCE,
      rarity,
      description: `Provides ${amount} ${resourceType.replace("_", " ")}`,
      effects: [
        {
          id: `resource_${Date.now()}`,
          type: "resource",
          magnitude: amount,
          description: `+${amount} ${resourceType.replace("_", " ")}`,
          resourceType,
          amount,
        },
      ],
      value: this._calculateResourceValue(resourceType, amount, rarity),
      source: "factory_created",
      tags: ["resource", resourceType],
    });
  }

  /**
   * Create an enhancement item that improves stats
   */
  static createEnhancementItem(
    name: string,
    enhancementType: ResourceType,
    statModifiers: Record<string, number>,
    duration: EnhancementDuration = EnhancementDuration.TEMPORARY,
    rarity: Rarity = Rarity.UNCOMMON
  ): ResourceItem {
    const totalModifier = Object.values(statModifiers).reduce(
      (sum, mod) => sum + Math.abs(mod),
      0
    );

    return new ResourceItem({
      name,
      category: ItemCategory.RESOURCE,
      rarity,
      description: `${duration === EnhancementDuration.PERMANENT ? "Permanently" : "Temporarily"} enhances ${enhancementType.replace("_", " ")}`,
      effects: [
        {
          id: `enhancement_${Date.now()}`,
          type: "enhancement",
          magnitude: totalModifier,
          description: `${duration} ${enhancementType.replace("_", " ")} enhancement`,
          enhancementType,
          duration,
          statModifiers,
        },
      ],
      value: this._calculateEnhancementValue(
        enhancementType,
        totalModifier,
        duration,
        rarity
      ),
      source: "factory_created",
      tags: ["enhancement", enhancementType, duration],
    });
  }

  /**
   * Create a tradeable item with custom effects
   */
  static createTradeableItem(
    name: string,
    description: string,
    effects: any[] = [],
    value: number = 10,
    rarity: Rarity = Rarity.COMMON
  ): TradeableItem {
    return new TradeableItem({
      name,
      category: ItemCategory.TRADEABLE,
      rarity,
      description,
      effects,
      value,
      tradeable: true,
      source: "factory_created",
      tags: ["tradeable"],
    });
  }

  /**
   * Create gems of a specific type and value
   */
  static createGems(gemType: GemType, value: number, rarity?: Rarity): GemItem {
    const inferredRarity = rarity || this._inferGemRarity(gemType, value);

    return new GemItem({
      name: `${gemType.charAt(0).toUpperCase() + gemType.slice(1)} Gems`,
      category: ItemCategory.GEMS,
      rarity: inferredRarity,
      description: `${value} ${gemType} gems - universal currency`,
      effects: [
        {
          id: `gem_${Date.now()}`,
          type: "gem",
          magnitude: value,
          description: `${value} ${gemType} gems`,
          gemType,
          value,
        },
      ],
      value,
      tradeable: true,
      stackable: true,
      maxStackSize: 9999,
      source: "factory_created",
      tags: ["gems", gemType],
    });
  }

  /**
   * Create preset speed up items
   */
  static createQuickBuildTool(): SpeedUpItem {
    return this.createSpeedUpItem(
      "Quick Build Tool",
      SpeedUpTarget.BOT_CONSTRUCTION,
      3.0,
      1800, // 30 minutes
      Rarity.UNCOMMON
    );
  }

  static createTurboTrainer(): SpeedUpItem {
    return this.createSpeedUpItem(
      "Turbo Trainer",
      SpeedUpTarget.TRAINING,
      2.5,
      900, // 15 minutes
      Rarity.RARE
    );
  }

  static createInstantRepair(): SpeedUpItem {
    return this.createSpeedUpItem(
      "Instant Repair Kit",
      SpeedUpTarget.REPAIR,
      10.0,
      0, // Instant
      Rarity.EPIC
    );
  }

  /**
   * Create preset resource items
   */
  static createEnergyCell(amount: number = 100): ResourceItem {
    return this.createResourceItem(
      "Energy Cell",
      ResourceType.ENERGY,
      amount,
      amount > 500 ? Rarity.RARE : Rarity.COMMON
    );
  }

  static createScrapMetal(amount: number = 50): ResourceItem {
    return this.createResourceItem(
      "Scrap Metal",
      ResourceType.SCRAP_PARTS,
      amount,
      amount > 200 ? Rarity.UNCOMMON : Rarity.COMMON
    );
  }

  static createMicrochipPack(amount: number = 10): ResourceItem {
    return this.createResourceItem(
      "Microchip Pack",
      ResourceType.MICROCHIPS,
      amount,
      amount > 50 ? Rarity.RARE : Rarity.UNCOMMON
    );
  }

  /**
   * Create preset enhancement items
   */
  static createTemporaryBotBooster(): ResourceItem {
    return this.createEnhancementItem(
      "Temporary Bot Booster",
      ResourceType.BOT_ENHANCER,
      { attack: 10, defense: 10, speed: 5 },
      EnhancementDuration.TEMPORARY,
      Rarity.UNCOMMON
    );
  }

  static createPermanentPartUpgrade(): ResourceItem {
    return this.createEnhancementItem(
      "Permanent Part Upgrade",
      ResourceType.PARTS_ENHANCER,
      { attack: 5, defense: 5 },
      EnhancementDuration.PERMANENT,
      Rarity.EPIC
    );
  }

  /**
   * Create preset gem items
   */
  static createCommonGems(amount: number = 100): GemItem {
    return this.createGems(GemType.COMMON, amount);
  }

  static createRareGems(amount: number = 50): GemItem {
    return this.createGems(GemType.RARE, amount);
  }

  static createEpicGems(amount: number = 25): GemItem {
    return this.createGems(GemType.EPIC, amount);
  }

  static createLegendaryGems(amount: number = 10): GemItem {
    return this.createGems(GemType.LEGENDARY, amount);
  }

  /**
   * Create items from JSON data
   */
  static fromJSON(data: any): IItem {
    const category = data.category as ItemCategory;

    switch (category) {
      case ItemCategory.SPEED_UP:
        return new SpeedUpItem(data);
      case ItemCategory.RESOURCE:
        return new ResourceItem(data);
      case ItemCategory.TRADEABLE:
        return new TradeableItem(data);
      case ItemCategory.GEMS:
        return new GemItem(data);
      default:
        throw new Error(`Unknown item category: ${category}`);
    }
  }

  // Private helper methods
  private static _calculateSpeedUpValue(
    speedMultiplier: number,
    timeReduction: number,
    rarity: Rarity
  ): number {
    const baseValue = (speedMultiplier - 1) * 10 + timeReduction / 60; // Base calculation
    return Math.round(baseValue * this._getRarityMultiplier(rarity));
  }

  private static _calculateResourceValue(
    resourceType: ResourceType,
    amount: number,
    rarity: Rarity
  ): number {
    const typeMultipliers = {
      [ResourceType.ENERGY]: 0.1,
      [ResourceType.SCRAP_PARTS]: 0.2,
      [ResourceType.MICROCHIPS]: 1.0,
      [ResourceType.STAMINA]: 0.15,
      [ResourceType.PARTS_ENHANCER]: 5.0,
      [ResourceType.BOT_ENHANCER]: 10.0,
      [ResourceType.SKELETON_ENHANCER]: 15.0,
      [ResourceType.EXPANSION_CHIP_ENHANCER]: 8.0,
    };

    const baseValue = amount * (typeMultipliers[resourceType] || 1.0);
    return Math.round(baseValue * this._getRarityMultiplier(rarity));
  }

  private static _calculateEnhancementValue(
    enhancementType: ResourceType,
    totalModifier: number,
    duration: EnhancementDuration,
    rarity: Rarity
  ): number {
    const baseValue = totalModifier * 2;
    const durationMultiplier =
      duration === EnhancementDuration.PERMANENT ? 5.0 : 1.0;
    return Math.round(
      baseValue * durationMultiplier * this._getRarityMultiplier(rarity)
    );
  }

  private static _getRarityMultiplier(rarity: Rarity): number {
    const multipliers = {
      [Rarity.COMMON]: 1.0,
      [Rarity.UNCOMMON]: 1.5,
      [Rarity.RARE]: 2.5,
      [Rarity.EPIC]: 4.0,
      [Rarity.LEGENDARY]: 6.0,
      [Rarity.ULTRA_RARE]: 8.0,
      [Rarity.PROTOTYPE]: 10.0,
    };
    return multipliers[rarity] || 1.0;
  }

  private static _inferGemRarity(gemType: GemType, value: number): Rarity {
    if (gemType === GemType.LEGENDARY || value >= 1000) {
      return Rarity.LEGENDARY;
    } else if (gemType === GemType.EPIC || value >= 500) {
      return Rarity.EPIC;
    } else if (gemType === GemType.RARE || value >= 100) {
      return Rarity.RARE;
    } else {
      return Rarity.COMMON;
    }
  }
}
