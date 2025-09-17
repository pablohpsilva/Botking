import { ItemCategory, SpeedUpTarget } from "../types";
import type { SpeedUpEffect } from "../types";
import { BaseItem } from "./base-item";
import type {
  IItem,
  ItemUsageResult,
  SpeedUpItemConfiguration,
} from "./item-interface";

/**
 * Speed Up Item - Consumable items that accelerate time-based processes
 */
export class SpeedUpItem extends BaseItem {
  private _speedUpEffects: SpeedUpEffect[];

  constructor(config: SpeedUpItemConfiguration) {
    super({
      ...config,
      category: ItemCategory.SPEED_UP,
      consumable: true, // Speed up items are always consumable
      tradeable: config.tradeable ?? false,
    });

    this._speedUpEffects = config.effects.filter(
      (effect): effect is SpeedUpEffect => effect.type === "speed_up"
    );

    if (this._speedUpEffects.length === 0) {
      throw new Error("Speed up items must have at least one speed up effect");
    }
  }

  get speedUpEffects(): ReadonlyArray<SpeedUpEffect> {
    return [...this._speedUpEffects];
  }

  canUse(context?: { target?: SpeedUpTarget; processTime?: number }): boolean {
    if (!context) {
      return false;
    }

    // Check if there's a speed up effect for the target
    const hasValidEffect = this._speedUpEffects.some(
      (effect) => effect.speedUpTarget === context.target
    );

    if (!hasValidEffect) {
      return false;
    }

    // Check basic requirements
    const reqCheck = this._checkRequirements(context);
    return reqCheck.valid;
  }

  use(context?: {
    target?: SpeedUpTarget;
    processTime?: number;
    onComplete?: (result: ItemUsageResult) => void;
  }): ItemUsageResult {
    if (!this.canUse(context)) {
      return {
        success: false,
        effects: [],
        message:
          "Cannot use speed up item - invalid context or requirements not met",
        errors: ["Invalid usage context"],
      };
    }

    const applicableEffects = this._speedUpEffects.filter(
      (effect) => effect.speedUpTarget === context!.target
    );

    if (applicableEffects.length === 0) {
      return {
        success: false,
        effects: [],
        message: `No speed up effect available for target: ${context!.target}`,
        errors: [`No effect for target: ${context!.target}`],
      };
    }

    // Apply the first applicable effect (could be enhanced to choose best effect)
    const effect = applicableEffects[0];
    const originalTime = context!.processTime || 0;
    const newTime = Math.max(
      0,
      originalTime / effect.speedMultiplier - effect.timeReduction
    );
    const timeSaved = originalTime - newTime;

    this._updateLastModified();

    const result: ItemUsageResult = {
      success: true,
      effects: [effect],
      message: `Process accelerated! Time reduced by ${timeSaved} seconds (${effect.speedMultiplier}x speed)`,
      cooldownUntil:
        this._cooldownTime > 0
          ? new Date(Date.now() + this._cooldownTime * 1000)
          : undefined,
    };

    // Call completion callback if provided
    if (context?.onComplete) {
      context.onComplete(result);
    }

    return result;
  }

  protected _createClone(config: any): IItem {
    return new SpeedUpItem({
      ...config,
      effects: this._speedUpEffects,
    });
  }

  getTargets(): SpeedUpTarget[] {
    return [
      ...new Set(this._speedUpEffects.map((effect) => effect.speedUpTarget)),
    ];
  }

  getMaxSpeedMultiplier(): number {
    return Math.max(
      ...this._speedUpEffects.map((effect) => effect.speedMultiplier)
    );
  }

  getMaxTimeReduction(): number {
    return Math.max(
      ...this._speedUpEffects.map((effect) => effect.timeReduction)
    );
  }
}
