import { ItemCategory, ResourceType, EnhancementDuration } from "../types";
import type { ResourceEffect, EnhancementEffect } from "../types";
import { BaseItem } from "./base-item";
import type {
  IItem,
  ItemUsageResult,
  ResourceItemConfiguration,
} from "./item-interface";

/**
 * Resource Item - Consumable items that provide resources or enhancements
 */
export class ResourceItem extends BaseItem {
  private _resourceEffects: ResourceEffect[];
  private _enhancementEffects: EnhancementEffect[];

  constructor(config: ResourceItemConfiguration) {
    super({
      ...config,
      category: ItemCategory.RESOURCE,
      consumable: true, // Resource items are always consumable
      tradeable: config.tradeable ?? false,
    });

    this._resourceEffects = config.effects.filter(
      (effect): effect is ResourceEffect => effect.type === "resource"
    );

    this._enhancementEffects = config.effects.filter(
      (effect): effect is EnhancementEffect => effect.type === "enhancement"
    );

    if (
      this._resourceEffects.length === 0 &&
      this._enhancementEffects.length === 0
    ) {
      throw new Error(
        "Resource items must have at least one resource or enhancement effect"
      );
    }
  }

  get resourceEffects(): ReadonlyArray<ResourceEffect> {
    return [...this._resourceEffects];
  }

  get enhancementEffects(): ReadonlyArray<EnhancementEffect> {
    return [...this._enhancementEffects];
  }

  canUse(context?: {
    target?: string; // Bot, Part, Skeleton, etc. ID
    playerResources?: Record<ResourceType, number>;
  }): boolean {
    // Resource items can generally be used unless specific requirements are not met
    const reqCheck = this._checkRequirements(context);
    return reqCheck.valid;
  }

  use(context?: {
    target?: string;
    playerResources?: Record<ResourceType, number>;
    onResourceGained?: (type: ResourceType, amount: number) => void;
    onEnhancementApplied?: (effect: EnhancementEffect) => void;
  }): ItemUsageResult {
    if (!this.canUse(context)) {
      return {
        success: false,
        effects: [],
        message: "Cannot use resource item - requirements not met",
        errors: ["Requirements not met"],
      };
    }

    const appliedEffects: (ResourceEffect | EnhancementEffect)[] = [];
    const messages: string[] = [];

    // Apply resource effects
    for (const effect of this._resourceEffects) {
      appliedEffects.push(effect);
      messages.push(
        `Gained ${effect.amount} ${effect.resourceType.replace("_", " ")}`
      );

      if (context?.onResourceGained) {
        context.onResourceGained(effect.resourceType, effect.amount);
      }
    }

    // Apply enhancement effects
    for (const effect of this._enhancementEffects) {
      appliedEffects.push(effect);
      const durationType =
        effect.duration === EnhancementDuration.PERMANENT
          ? "permanently"
          : "temporarily";
      messages.push(
        `Applied ${effect.enhancementType.replace("_", " ")} enhancement ${durationType}`
      );

      if (context?.onEnhancementApplied) {
        context.onEnhancementApplied(effect);
      }
    }

    this._updateLastModified();

    return {
      success: true,
      effects: appliedEffects,
      message: messages.join(", "),
      cooldownUntil:
        this._cooldownTime > 0
          ? new Date(Date.now() + this._cooldownTime * 1000)
          : undefined,
    };
  }

  protected _createClone(config: any): IItem {
    return new ResourceItem({
      ...config,
      effects: [...this._resourceEffects, ...this._enhancementEffects],
    });
  }

  getResourceTypes(): ResourceType[] {
    return [
      ...new Set(this._resourceEffects.map((effect) => effect.resourceType)),
    ];
  }

  getEnhancementTypes(): ResourceType[] {
    return [
      ...new Set(
        this._enhancementEffects.map((effect) => effect.enhancementType)
      ),
    ];
  }

  getTotalResourceAmount(type: ResourceType): number {
    return this._resourceEffects
      .filter((effect) => effect.resourceType === type)
      .reduce((total, effect) => total + effect.amount, 0);
  }

  hasEnhancement(type: ResourceType): boolean {
    return this._enhancementEffects.some(
      (effect) => effect.enhancementType === type
    );
  }

  getEnhancement(type: ResourceType): EnhancementEffect | undefined {
    return this._enhancementEffects.find(
      (effect) => effect.enhancementType === type
    );
  }
}
