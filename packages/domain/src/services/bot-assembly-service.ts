/**
 * Bot assembly validation service
 */

import { SkeletonType, PartCategory } from "@botking/db";
import { RuleEngine } from "../validators/rule-engine";
import {
  SkeletonSlotRule,
  IBotSlotConfiguration,
} from "../rules/skeleton-slot-rule";
import { getDefaultSlotsForSkeleton } from "../rules/skeleton-slot-config";
import { ISkeletonSlots, IPartSlotUsage } from "../types/skeleton-slots";
import {
  IValidationResults,
  IValidationContext,
  IRuleExecutionOptions,
} from "../types/validation";

/**
 * Represents a part for assembly validation
 */
export interface IAssemblyPart {
  id: string;
  category: PartCategory;
  name: string;
}

/**
 * Represents an expansion chip for assembly validation
 */
export interface IAssemblyExpansionChip {
  id: string;
  name: string;
}

/**
 * Represents a soul chip for assembly validation
 */
export interface IAssemblySoulChip {
  id: string;
  name: string;
}

/**
 * Bot assembly configuration for validation
 */
export interface IBotAssemblyConfig {
  skeletonType: SkeletonType;
  skeletonSlots?: ISkeletonSlots; // Optional, will use defaults if not provided
  parts: IAssemblyPart[];
  expansionChips: IAssemblyExpansionChip[];
  soulChips: IAssemblySoulChip[];
}

/**
 * Bot assembly validation results with detailed breakdown
 */
export interface IBotAssemblyValidationResults extends IValidationResults {
  assemblyConfig: IBotAssemblyConfig;
  resolvedSlotConfiguration: ISkeletonSlots;
  partUsage: IPartSlotUsage;
  canAssemble: boolean;
  recommendations?: string[];
}

/**
 * Service for validating bot assembly configurations
 */
export class BotAssemblyService {
  private ruleEngine: RuleEngine;

  constructor() {
    this.ruleEngine = new RuleEngine();
    this.initializeRules();
  }

  /**
   * Initialize default validation rules
   */
  private initializeRules(): void {
    this.ruleEngine.registerRule("bot-assembly", new SkeletonSlotRule());
  }

  /**
   * Validate a bot assembly configuration
   */
  validateAssembly(
    config: IBotAssemblyConfig,
    context?: IValidationContext,
    options?: IRuleExecutionOptions
  ): IBotAssemblyValidationResults {
    // Resolve skeleton slots (use provided or defaults)
    const resolvedSlots =
      config.skeletonSlots || getDefaultSlotsForSkeleton(config.skeletonType);

    // Calculate part usage
    const partUsage = this.calculatePartUsage(config);

    // Create slot configuration for validation
    const slotConfig: IBotSlotConfiguration = {
      skeletonType: config.skeletonType,
      skeletonSlots: resolvedSlots,
      partUsage,
    };

    // Validate using rule engine
    const validationResults = this.ruleEngine.validateEntity(
      "bot-assembly",
      slotConfig,
      context,
      options
    );

    // Generate recommendations if validation failed
    const recommendations = validationResults.isValid
      ? undefined
      : this.generateRecommendations(config, resolvedSlots, partUsage);

    return {
      ...validationResults,
      assemblyConfig: config,
      resolvedSlotConfiguration: resolvedSlots,
      partUsage,
      canAssemble: validationResults.isValid,
      recommendations,
    };
  }

  /**
   * Calculate part usage from assembly configuration
   */
  private calculatePartUsage(config: IBotAssemblyConfig): IPartSlotUsage {
    const usage: IPartSlotUsage = {
      [PartCategory.HEAD]: 0,
      [PartCategory.TORSO]: 0,
      [PartCategory.ARM]: 0,
      [PartCategory.LEG]: 0,
      [PartCategory.ACCESSORY]: 0,
      expansionChips: config.expansionChips.length,
      soulChips: config.soulChips.length,
    };

    // Count parts by category
    for (const part of config.parts) {
      usage[part.category]++;
    }

    return usage;
  }

  /**
   * Generate recommendations for fixing assembly issues
   */
  private generateRecommendations(
    config: IBotAssemblyConfig,
    slots: ISkeletonSlots,
    usage: IPartSlotUsage
  ): string[] {
    const recommendations: string[] = [];

    // Check each category for issues and suggest fixes
    if (usage[PartCategory.HEAD] > slots.headSlots) {
      recommendations.push(
        `Remove ${usage[PartCategory.HEAD] - slots.headSlots} head part(s) - skeleton only supports ${slots.headSlots} head slot(s)`
      );
    } else if (usage[PartCategory.HEAD] === 0) {
      recommendations.push(
        "Add at least 1 head part - required for all skeletons"
      );
    }

    if (usage[PartCategory.TORSO] > slots.torsoSlots) {
      recommendations.push(
        `Remove ${usage[PartCategory.TORSO] - slots.torsoSlots} torso part(s) - skeleton only supports ${slots.torsoSlots} torso slot(s)`
      );
    } else if (usage[PartCategory.TORSO] === 0) {
      recommendations.push("Add 1 torso part - required for all skeletons");
    }

    if (usage[PartCategory.ARM] > slots.armSlots) {
      recommendations.push(
        `Remove ${usage[PartCategory.ARM] - slots.armSlots} arm part(s) - skeleton only supports ${slots.armSlots} arm slot(s)`
      );
    }

    if (usage[PartCategory.LEG] > slots.legSlots) {
      recommendations.push(
        `Remove ${usage[PartCategory.LEG] - slots.legSlots} leg part(s) - skeleton only supports ${slots.legSlots} leg slot(s)`
      );
    }

    if (usage.expansionChips > slots.expansionSlots) {
      recommendations.push(
        `Remove ${usage.expansionChips - slots.expansionSlots} expansion chip(s) - skeleton only supports ${slots.expansionSlots} expansion slot(s)`
      );
    }

    if (usage.soulChips > slots.soulChipSlots) {
      recommendations.push(
        `Remove ${usage.soulChips - slots.soulChipSlots} soul chip(s) - skeleton only supports ${slots.soulChipSlots} soul chip slot(s)`
      );
    } else if (usage.soulChips === 0) {
      recommendations.push("Add 1 soul chip - required for all bots");
    }

    // Add skeleton-specific recommendations
    if (config.skeletonType === SkeletonType.HEAVY) {
      if (usage[PartCategory.LEG] < 2) {
        recommendations.push("Heavy skeletons require at least 2 leg parts");
      }
      if (usage[PartCategory.ARM] < 2) {
        recommendations.push("Heavy skeletons require at least 2 arm parts");
      }
    }

    if (
      config.skeletonType === SkeletonType.LIGHT &&
      usage[PartCategory.LEG] > 2
    ) {
      recommendations.push("Light skeletons support maximum 2 leg parts");
    }

    return recommendations;
  }

  /**
   * Check if a bot assembly is valid (shorthand method)
   */
  isValidAssembly(config: IBotAssemblyConfig): boolean {
    return this.validateAssembly(config).canAssemble;
  }

  /**
   * Get the rule engine instance for advanced usage
   */
  getRuleEngine(): RuleEngine {
    return this.ruleEngine;
  }

  /**
   * Add a custom rule to the bot assembly validation
   */
  addCustomRule(rule: any): void {
    this.ruleEngine.registerRule("bot-assembly", rule);
  }

  /**
   * Calculate minimum required parts for a skeleton type
   */
  getMinimumRequiredParts(skeletonType: SkeletonType): {
    heads: number;
    torsos: number;
    arms: number;
    legs: number;
    accessories: number;
    expansionChips: number;
    soulChips: number;
  } {
    return {
      heads: 1, // Always need at least 1 head
      torsos: 1, // Always need exactly 1 torso
      arms: skeletonType === SkeletonType.HEAVY ? 2 : 0, // Heavy requires 2, others optional
      legs: skeletonType === SkeletonType.HEAVY ? 2 : 1, // Heavy requires 2, others at least 1
      accessories: 0, // Always optional
      expansionChips: 0, // Always optional
      soulChips: 1, // Always required exactly 1
    };
  }

  /**
   * Get maximum allowed parts for a skeleton configuration
   */
  getMaximumAllowedParts(
    config: Pick<IBotAssemblyConfig, "skeletonType" | "skeletonSlots">
  ): {
    heads: number;
    torsos: number;
    arms: number;
    legs: number;
    accessories: number;
    expansionChips: number;
    soulChips: number;
  } {
    const slots =
      config.skeletonSlots || getDefaultSlotsForSkeleton(config.skeletonType);

    return {
      heads: slots.headSlots,
      torsos: slots.torsoSlots,
      arms: slots.armSlots,
      legs: slots.legSlots,
      accessories: slots.accessorySlots,
      expansionChips: slots.expansionSlots,
      soulChips: slots.soulChipSlots,
    };
  }
}
