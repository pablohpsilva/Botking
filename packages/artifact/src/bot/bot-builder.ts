import { Bot } from "./bot";
import type {
  IBot,
  BotConfiguration,
  BotAssemblyResult,
} from "./bot-interface";
import type { SoulChip } from "../soul-chip";
import type { ISkeleton } from "../skeleton";
import type { IPart } from "../part";
import type { IExpansionChip } from "../expansion-chip";
import type { IBotState } from "../bot-state/bot-state-interface";
import {
  BotType,
  CombatRole,
  UtilitySpecialization,
  GovernmentType,
  SkeletonType,
  PartCategory,
  ExpansionChipEffect,
  Rarity,
} from "../types";
import { SkeletonFactory } from "../skeleton/skeleton-factory";
import { PartFactory } from "../part/part-factory";
import { ExpansionChipFactory } from "../expansion-chip/expansion-chip-factory";
import { BotStateFactory } from "../bot-state/bot-state-factory";
import { SoulChip as SoulChipClass } from "../soul-chip";
import { LoggerFactory } from "@botking/logger";

/**
 * Builder validation result
 */
export interface BuilderValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  recommendations: string[];
}

/**
 * Bot building step interface
 */
export interface IBotBuildingStep {
  stepName: string;
  isRequired: boolean;
  isCompleted: boolean;
  validate(): BuilderValidationResult;
  getDescription(): string;
}

/**
 * BotBuilder - Fluent interface for building complex Bot artifacts
 * Implements Builder pattern with validation and step-by-step guidance
 */
export class BotBuilder {
  private logger: ReturnType<typeof LoggerFactory.createPackageLogger>;
  private config: Partial<BotConfiguration> = {};
  private buildSteps: IBotBuildingStep[] = [];
  private currentStep: number = 0;

  constructor(name: string, userId?: string) {
    this.logger = LoggerFactory.createPackageLogger("artifact", {
      service: "bot-builder",
    });
    this.config.name = name;
    this.config.userId = userId;
    this.initializeBuildSteps();
  }

  /**
   * Set bot type and configure appropriate specializations
   */
  public withBotType(botType: BotType): this {
    this.config.botType = botType;

    // Auto-configure based on bot type
    switch (botType) {
      case BotType.WORKER:
        // Workers don't get soul chips
        this.config.soulChip = null;
        break;
      case BotType.PLAYABLE:
      case BotType.KING:
        // These require soul chips and users
        if (!this.config.soulChip) {
          this.withBasicSoulChip();
        }
        break;
      case BotType.ROGUE:
      case BotType.GOVBOT:
        // Autonomous bots
        this.config.userId = undefined;
        break;
    }

    this.logger.debug(`Bot type set to ${botType}`);
    return this;
  }

  /**
   * Set combat role (for combat bots)
   */
  public withCombatRole(role: CombatRole): this {
    this.config.combatRole = role;
    this.logger.debug(`Combat role set to ${role}`);
    return this;
  }

  /**
   * Set utility specialization (for worker bots)
   */
  public withUtilitySpecialization(spec: UtilitySpecialization): this {
    this.config.utilitySpec = spec;
    this.logger.debug(`Utility specialization set to ${spec}`);
    return this;
  }

  /**
   * Set government type (for government bots)
   */
  public withGovernmentType(type: GovernmentType): this {
    this.config.governmentType = type;
    this.logger.debug(`Government type set to ${type}`);
    return this;
  }

  /**
   * Add soul chip
   */
  public withSoulChip(soulChip: SoulChip): this {
    this.config.soulChip = soulChip;
    this.logger.debug(`Soul chip added: ${soulChip.name}`);
    return this;
  }

  /**
   * Add basic soul chip with random traits
   */
  public withBasicSoulChip(rarity: Rarity = Rarity.COMMON): this {
    const soulChip = new SoulChipClass(
      `sc_${Date.now()}`,
      `${this.config.name} Soul`,
      rarity,
      {
        aggressiveness: Math.floor(Math.random() * 100),
        curiosity: Math.floor(Math.random() * 100),
        loyalty: Math.floor(Math.random() * 100),
        empathy: Math.floor(Math.random() * 100),
        independence: Math.floor(Math.random() * 100),
        dialogueStyle: ["formal", "casual", "quirky", "stoic"][
          Math.floor(Math.random() * 4)
        ] as any,
      },
      {
        intelligence: Math.floor(Math.random() * 100),
        resilience: Math.floor(Math.random() * 100),
        adaptability: Math.floor(Math.random() * 100),
      },
      `Random trait for ${this.config.name}`
    );

    return this.withSoulChip(soulChip);
  }

  /**
   * Set skeleton
   */
  public withSkeleton(skeleton: ISkeleton): this {
    this.config.skeleton = skeleton;
    this.logger.debug(`Skeleton set: ${skeleton.type}`);
    return this;
  }

  /**
   * Create skeleton of specified type
   */
  public withSkeletonType(
    type: SkeletonType,
    rarity: Rarity = Rarity.COMMON
  ): this {
    const skeleton = SkeletonFactory.createSkeleton(
      type,
      `skel_${Date.now()}`,
      rarity,
      6, // Default slots
      100, // Default durability
      "LAND" as any // Default mobility
    );
    return this.withSkeleton(skeleton);
  }

  /**
   * Add a part
   */
  public withPart(part: IPart): this {
    if (!this.config.parts) {
      this.config.parts = [];
    }
    this.config.parts.push(part);
    this.logger.debug(`Part added: ${part.category}`);
    return this;
  }

  /**
   * Add parts by category
   */
  public withParts(
    categories: PartCategory[],
    rarity: Rarity = Rarity.COMMON
  ): this {
    for (const category of categories) {
      const part = PartFactory.createPart(
        category,
        `part_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        rarity,
        "100", // Default durability
        {
          attack: 10,
          defense: 10,
          speed: 10,
          perception: 10,
          energyConsumption: 5,
        } // Default stats
      );
      this.withPart(part);
    }
    return this;
  }

  /**
   * Add basic parts set (head, torso, arms, legs)
   */
  public withBasicParts(rarity: Rarity = Rarity.COMMON): this {
    return this.withParts(
      [
        PartCategory.HEAD,
        PartCategory.TORSO,
        PartCategory.ARM,
        PartCategory.ARM, // Two arms
        PartCategory.LEG,
        PartCategory.LEG, // Two legs
      ],
      rarity
    );
  }

  /**
   * Add expansion chip
   */
  public withExpansionChip(chip: IExpansionChip): this {
    if (!this.config.expansionChips) {
      this.config.expansionChips = [];
    }
    this.config.expansionChips.push(chip);
    this.logger.debug(`Expansion chip added: ${chip.effect}`);
    return this;
  }

  /**
   * Add expansion chips by effect
   */
  public withExpansionChips(
    effects: ExpansionChipEffect[],
    rarity: Rarity = Rarity.COMMON
  ): this {
    for (const effect of effects) {
      const chip = ExpansionChipFactory.createExpansionChip(
        effect,
        `chip_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        rarity,
        rarity, // Use provided rarity
        "default_stats" // Default stats identifier
      );
      this.withExpansionChip(chip);
    }
    return this;
  }

  /**
   * Set initial bot state
   */
  public withBotState(state: IBotState): this {
    this.config.initialState = state;
    this.logger.debug(`Bot state set`);
    return this;
  }

  /**
   * Create basic bot state
   */
  public withBasicBotState(): this {
    const stateType =
      this.config.botType === BotType.WORKER
        ? BotType.WORKER
        : BotType.PLAYABLE;
    const state = BotStateFactory.createState(stateType);
    return this.withBotState(state);
  }

  /**
   * Set overall rating
   */
  public withRating(rating: number): this {
    (this.config as any).overallRating = Math.max(0, Math.min(100, rating));
    return this;
  }

  /**
   * Auto-configure bot based on type and preferences
   */
  public autoConfig(preferences?: {
    preferredRarity?: Rarity;
    includeExpansionChips?: boolean;
    skeletonType?: SkeletonType;
  }): this {
    const rarity = preferences?.preferredRarity || Rarity.COMMON;
    const skeletonType = preferences?.skeletonType || SkeletonType.BALANCED;

    // Set skeleton if not already set
    if (!this.config.skeleton) {
      this.withSkeletonType(skeletonType, rarity);
    }

    // Add basic parts if not already set
    if (!this.config.parts || this.config.parts.length === 0) {
      this.withBasicParts(rarity);
    }

    // Add expansion chips if requested
    if (
      preferences?.includeExpansionChips &&
      (!this.config.expansionChips || this.config.expansionChips.length === 0)
    ) {
      this.withExpansionChips([ExpansionChipEffect.STAT_BOOST], rarity);
    }

    // Add bot state if not set
    if (!this.config.initialState) {
      this.withBasicBotState();
    }

    this.logger.info("Auto-configuration completed", { preferences });
    return this;
  }

  /**
   * Validate current configuration
   */
  public validate(): BuilderValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    const recommendations: string[] = [];

    // Required fields validation
    if (!this.config.name) {
      errors.push("Bot name is required");
    }

    if (!this.config.skeleton) {
      errors.push("Skeleton is required");
    }

    if (!this.config.parts || this.config.parts.length === 0) {
      errors.push("At least one part is required");
    }

    // Bot type specific validation
    if (this.config.botType) {
      switch (this.config.botType) {
        case BotType.WORKER:
          if (this.config.soulChip) {
            warnings.push("Worker bots typically don't have soul chips");
          }
          if (!(this.config as any).utilitySpecialization) {
            recommendations.push(
              "Consider adding utility specialization for worker bots"
            );
          }
          break;

        case BotType.PLAYABLE:
        case BotType.KING:
          if (!this.config.userId) {
            errors.push(
              `${this.config.botType} bots must have a user assigned`
            );
          }
          if (!this.config.soulChip) {
            warnings.push(`${this.config.botType} bots should have soul chips`);
          }
          if (!this.config.combatRole) {
            recommendations.push("Consider adding combat role for combat bots");
          }
          break;

        case BotType.ROGUE:
        case BotType.GOVBOT:
          if (this.config.userId) {
            warnings.push(
              `${this.config.botType} bots are autonomous and shouldn't have users`
            );
          }
          break;
      }
    }

    // Parts validation
    if (this.config.parts && this.config.skeleton) {
      const slots = this.config.skeleton.slots;
      if (this.config.parts.length > slots) {
        warnings.push(
          `Too many parts (${this.config.parts.length}) for skeleton slots (${slots})`
        );
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      recommendations,
    };
  }

  /**
   * Get current configuration
   */
  public getConfiguration(): Partial<BotConfiguration> {
    return { ...this.config };
  }

  /**
   * Get build progress
   */
  public getBuildProgress(): {
    currentStep: number;
    totalSteps: number;
    completedSteps: number;
    nextStep?: IBotBuildingStep;
    progress: number;
  } {
    const completedSteps = this.buildSteps.filter(
      (step) => step.isCompleted
    ).length;
    const totalSteps = this.buildSteps.length;
    const progress = totalSteps > 0 ? (completedSteps / totalSteps) * 100 : 0;

    return {
      currentStep: this.currentStep,
      totalSteps,
      completedSteps,
      nextStep: this.buildSteps[this.currentStep],
      progress,
    };
  }

  /**
   * Get build steps
   */
  public getBuildSteps(): IBotBuildingStep[] {
    return [...this.buildSteps];
  }

  /**
   * Build the final Bot artifact
   */
  public build(): BotAssemblyResult {
    this.logger.info("Building Bot artifact", { name: this.config.name });

    // Final validation
    const validation = this.validate();
    if (!validation.isValid) {
      this.logger.error("Build validation failed", {
        errors: validation.errors,
      });
      return {
        success: false,
        bot: undefined,
        errors: validation.errors,
        warnings: validation.warnings,
        metrics: {
          assemblyTime: 0,
          compatibilityScore: 0,
          optimizationLevel: 0,
        },
      };
    }

    // Create the bot
    try {
      const startTime = Date.now();
      const bot = new Bot(this.config as BotConfiguration);
      const endTime = Date.now();

      const result: BotAssemblyResult = {
        success: true,
        bot,
        errors: [],
        warnings: validation.warnings,
        metrics: {
          assemblyTime: endTime - startTime,
          compatibilityScore: 85, // Default compatibility score
          optimizationLevel: 75, // Default optimization level
        },
      };

      this.logger.info("Bot built successfully", {
        name: this.config.name,
        assemblyTime: endTime - startTime,
      });

      return result;
    } catch (error) {
      this.logger.error("Bot build failed", { error });
      return {
        success: false,
        bot: undefined,
        errors: [`Build error: ${(error as Error).message}`],
        warnings: validation.warnings,
        metrics: {
          assemblyTime: 0,
          compatibilityScore: 0,
          optimizationLevel: 0,
        },
      };
    }
  }

  /**
   * Reset builder to initial state
   */
  public reset(): this {
    const name = this.config.name;
    const userId = this.config.userId;
    this.config = { name, userId };
    this.currentStep = 0;
    this.initializeBuildSteps();
    this.logger.debug("Builder reset");
    return this;
  }

  /**
   * Clone builder with current configuration
   */
  public clone(): BotBuilder {
    const clone = new BotBuilder(
      this.config.name || "Clone",
      this.config.userId || undefined
    );
    clone.config = { ...this.config };
    clone.currentStep = this.currentStep;
    return clone;
  }

  /**
   * Initialize build steps
   */
  private initializeBuildSteps(): void {
    this.buildSteps = [
      {
        stepName: "Set Bot Type",
        isRequired: true,
        isCompleted: false,
        validate: () => ({
          isValid: !!this.config.botType,
          errors: [],
          warnings: [],
          recommendations: [],
        }),
        getDescription: () =>
          "Choose the type of bot (Worker, Playable, King, Rogue, GovBot)",
      },
      {
        stepName: "Add Skeleton",
        isRequired: true,
        isCompleted: false,
        validate: () => ({
          isValid: !!this.config.skeleton,
          errors: [],
          warnings: [],
          recommendations: [],
        }),
        getDescription: () => "Select and configure the bot's skeleton",
      },
      {
        stepName: "Add Parts",
        isRequired: true,
        isCompleted: false,
        validate: () => ({
          isValid: !!this.config.parts && this.config.parts.length > 0,
          errors: [],
          warnings: [],
          recommendations: [],
        }),
        getDescription: () => "Add essential parts (head, torso, arms, legs)",
      },
      {
        stepName: "Configure Specializations",
        isRequired: false,
        isCompleted: false,
        validate: () => ({
          isValid: true,
          errors: [],
          warnings: [],
          recommendations: [],
        }),
        getDescription: () =>
          "Set combat roles, utility specializations, or government types",
      },
      {
        stepName: "Add Soul Chip",
        isRequired: false,
        isCompleted: false,
        validate: () => ({
          isValid: true,
          errors: [],
          warnings: [],
          recommendations: [],
        }),
        getDescription: () =>
          "Add soul chip for personality and AI traits (not for worker bots)",
      },
      {
        stepName: "Add Expansion Chips",
        isRequired: false,
        isCompleted: false,
        validate: () => ({
          isValid: true,
          errors: [],
          warnings: [],
          recommendations: [],
        }),
        getDescription: () => "Add expansion chips for enhanced capabilities",
      },
      {
        stepName: "Set Initial State",
        isRequired: true,
        isCompleted: false,
        validate: () => ({
          isValid: !!this.config.initialState,
          errors: [],
          warnings: [],
          recommendations: [],
        }),
        getDescription: () =>
          "Configure the bot's initial state and statistics",
      },
    ];
  }
}

/**
 * Factory method for creating BotBuilder
 */
export function createBotBuilder(name: string, userId?: string): BotBuilder {
  return new BotBuilder(name, userId);
}
