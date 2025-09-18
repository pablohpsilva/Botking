import { LoggerFactory } from "@botking/logger";
import type { IBot } from "../bot/bot-interface";
import type { ISkeleton } from "../skeleton/skeleton-interface";
import type { IPart } from "../part/part-interface";
import type { IExpansionChip } from "../expansion-chip/expansion-chip-interface";
import { SkeletonType, PartCategory, BotType } from "../types";

/**
 * Assembly result interface
 */
export interface AssemblyResult {
  success: boolean;
  bot?: IBot;
  errors: string[];
  warnings: string[];
  recommendations: string[];
  assemblyTime: number;
  optimizations: string[];
}

/**
 * Assembly context interface
 */
export interface AssemblyContext {
  optimizeForPerformance: boolean;
  optimizeForCost: boolean;
  strictCompatibility: boolean;
  allowPartSubstitution: boolean;
  maxAssemblyTime?: number;
}

/**
 * Part assignment result
 */
export interface PartAssignmentResult {
  assigned: IPart[];
  unassigned: IPart[];
  substitutions: Array<{
    original: IPart;
    substitute: IPart;
    reason: string;
  }>;
}

/**
 * Abstract strategy for bot assembly
 * Implements Strategy pattern for different assembly approaches
 */
export abstract class AssemblyStrategy {
  protected logger: ReturnType<typeof LoggerFactory.createPackageLogger>;
  protected context: AssemblyContext;

  constructor(context: AssemblyContext) {
    this.logger = LoggerFactory.createPackageLogger("artifact", {
      service: "assembly-strategy",
    });
    this.context = context;
  }

  /**
   * Main assembly method - template for strategy execution
   */
  public async assemble(
    skeleton: ISkeleton,
    parts: IPart[],
    expansionChips: IExpansionChip[] = []
  ): Promise<AssemblyResult> {
    const startTime = Date.now();
    this.logger.info("Starting bot assembly", {
      strategy: this.getStrategyName(),
      skeletonType: skeleton.type,
      partCount: parts.length,
      chipCount: expansionChips.length,
    });

    try {
      // Step 1: Validate inputs
      const validationResult = await this.validateInputs(
        skeleton,
        parts,
        expansionChips
      );
      if (!validationResult.isValid) {
        return this.createFailureResult(validationResult.errors, startTime);
      }

      // Step 2: Plan assembly
      const assemblyPlan = await this.planAssembly(
        skeleton,
        parts,
        expansionChips
      );

      // Step 3: Execute assembly strategy
      const assemblyResult = await this.executeAssembly(assemblyPlan);

      // Step 4: Optimize if needed
      if (this.context.optimizeForPerformance || this.context.optimizeForCost) {
        await this.optimizeAssembly(assemblyResult);
      }

      // Step 5: Finalize assembly
      const finalResult = await this.finalizeAssembly(
        assemblyResult,
        startTime
      );

      this.logger.info("Assembly completed", {
        strategy: this.getStrategyName(),
        success: finalResult.success,
        assemblyTime: finalResult.assemblyTime,
      });

      return finalResult;
    } catch (error) {
      this.logger.error("Assembly failed with exception", { error });
      return this.createFailureResult(
        [`Assembly failed: ${(error as Error).message}`],
        startTime
      );
    }
  }

  // Abstract methods to be implemented by concrete strategies

  /**
   * Get strategy name
   */
  protected abstract getStrategyName(): string;

  /**
   * Plan the assembly process
   */
  protected abstract planAssembly(
    skeleton: ISkeleton,
    parts: IPart[],
    expansionChips: IExpansionChip[]
  ): Promise<AssemblyPlan>;

  /**
   * Execute the assembly strategy
   */
  protected abstract executeAssembly(
    plan: AssemblyPlan
  ): Promise<Partial<IBot>>;

  // Common methods with default implementations

  /**
   * Validate assembly inputs
   */
  protected async validateInputs(
    skeleton: ISkeleton,
    parts: IPart[],
    expansionChips: IExpansionChip[]
  ): Promise<{ isValid: boolean; errors: string[] }> {
    const errors: string[] = [];

    if (!skeleton) {
      errors.push("Skeleton is required for assembly");
    }

    if (!parts || parts.length === 0) {
      errors.push("At least one part is required for assembly");
    }

    // Check part-skeleton compatibility
    if (skeleton && parts) {
      if (parts.length > skeleton.slots) {
        if (!this.context.allowPartSubstitution) {
          errors.push(
            `Too many parts (${parts.length}) for skeleton slots (${skeleton.slots})`
          );
        }
      }
    }

    return { isValid: errors.length === 0, errors };
  }

  /**
   * Optimize assembled bot
   */
  protected async optimizeAssembly(bot: Partial<IBot>): Promise<void> {
    if (this.context.optimizeForPerformance) {
      await this.optimizeForPerformance(bot);
    }

    if (this.context.optimizeForCost) {
      await this.optimizeForCost(bot);
    }
  }

  /**
   * Finalize assembly process
   */
  protected async finalizeAssembly(
    bot: Partial<IBot>,
    startTime: number
  ): Promise<AssemblyResult> {
    const assemblyTime = Date.now() - startTime;

    // Final validation
    const warnings: string[] = [];
    const recommendations: string[] = [];
    const optimizations: string[] = [];

    // Check assembly quality
    if ((bot as any).overallRating && (bot as any).overallRating < 50) {
      warnings.push("Bot has low overall rating");
      recommendations.push("Consider upgrading parts or skeleton");
    }

    return {
      success: true,
      bot: bot as IBot,
      errors: [],
      warnings,
      recommendations,
      assemblyTime,
      optimizations,
    };
  }

  /**
   * Optimize for performance
   */
  protected async optimizeForPerformance(bot: Partial<IBot>): Promise<void> {
    // Remove redundant or low-impact parts
    if (bot.parts && bot.parts.length > 10) {
      (bot as any).parts = bot.parts.slice(0, 10); // Limit parts for performance
    }
  }

  /**
   * Optimize for cost
   */
  protected async optimizeForCost(bot: Partial<IBot>): Promise<void> {
    // Replace expensive parts with cheaper alternatives
    if (bot.parts) {
      const optimizedParts = bot.parts.map((part) => {
        // Simplified cost optimization - replace LEGENDARY with RARE
        if (part.rarity === "LEGENDARY") {
          return { ...part, rarity: "RARE" } as IPart;
        }
        return part;
      });
      (bot as any).parts = optimizedParts;
    }
  }

  /**
   * Create failure result
   */
  protected createFailureResult(
    errors: string[],
    startTime: number
  ): AssemblyResult {
    return {
      success: false,
      errors,
      warnings: [],
      recommendations: [],
      assemblyTime: Date.now() - startTime,
      optimizations: [],
    };
  }
}

/**
 * Assembly plan interface
 */
export interface AssemblyPlan {
  skeleton: ISkeleton;
  partAssignments: PartAssignmentResult;
  expansionChipPlacements: IExpansionChip[];
  assemblySteps: AssemblyStep[];
  estimatedTime: number;
  compatibilityChecks: CompatibilityCheck[];
}

/**
 * Assembly step interface
 */
export interface AssemblyStep {
  stepNumber: number;
  description: string;
  component: "skeleton" | "part" | "chip" | "validation";
  requiredTime: number;
  dependencies: number[]; // Step numbers this step depends on
}

/**
 * Compatibility check interface
 */
export interface CompatibilityCheck {
  type: "skeleton-part" | "part-part" | "chip-skeleton";
  components: string[];
  isCompatible: boolean;
  reason?: string;
}

/**
 * Balanced Assembly Strategy - Default strategy for general-purpose bots
 */
export class BalancedAssemblyStrategy extends AssemblyStrategy {
  protected getStrategyName(): string {
    return "Balanced";
  }

  protected async planAssembly(
    skeleton: ISkeleton,
    parts: IPart[],
    expansionChips: IExpansionChip[]
  ): Promise<AssemblyPlan> {
    // Assign parts based on priority: essential parts first
    const partAssignments = this.assignPartsBalanced(skeleton, parts);

    // Plan assembly steps
    const assemblySteps: AssemblyStep[] = [
      {
        stepNumber: 1,
        description: "Mount skeleton frame",
        component: "skeleton",
        requiredTime: 100,
        dependencies: [],
      },
      {
        stepNumber: 2,
        description: "Install core parts (head, torso)",
        component: "part",
        requiredTime: 200,
        dependencies: [1],
      },
      {
        stepNumber: 3,
        description: "Install limb parts (arms, legs)",
        component: "part",
        requiredTime: 300,
        dependencies: [2],
      },
      {
        stepNumber: 4,
        description: "Install accessory parts",
        component: "part",
        requiredTime: 150,
        dependencies: [3],
      },
      {
        stepNumber: 5,
        description: "Install expansion chips",
        component: "chip",
        requiredTime: 100,
        dependencies: [4],
      },
      {
        stepNumber: 6,
        description: "Final validation and calibration",
        component: "validation",
        requiredTime: 50,
        dependencies: [5],
      },
    ];

    const estimatedTime = assemblySteps.reduce(
      (sum, step) => sum + step.requiredTime,
      0
    );

    return {
      skeleton,
      partAssignments,
      expansionChipPlacements: expansionChips,
      assemblySteps,
      estimatedTime,
      compatibilityChecks: [],
    };
  }

  protected async executeAssembly(plan: AssemblyPlan): Promise<Partial<IBot>> {
    const { skeleton, partAssignments, expansionChipPlacements } = plan;

    return {
      skeleton,
      parts: partAssignments.assigned,
      expansionChips: expansionChipPlacements,
    } as Partial<IBot>;
  }

  private assignPartsBalanced(
    skeleton: ISkeleton,
    parts: IPart[]
  ): PartAssignmentResult {
    const availableSlots = skeleton.slots;
    const assigned: IPart[] = [];
    const unassigned: IPart[] = [];

    // Priority order for part categories
    const priorityOrder = [
      PartCategory.HEAD,
      PartCategory.TORSO,
      PartCategory.ARM,
      PartCategory.LEG,
      PartCategory.ACCESSORY,
    ];

    // Sort parts by priority
    const sortedParts = [...parts].sort((a, b) => {
      const priorityA = priorityOrder.indexOf(a.category);
      const priorityB = priorityOrder.indexOf(b.category);
      return priorityA - priorityB;
    });

    // Assign parts up to skeleton capacity
    for (const part of sortedParts) {
      if (assigned.length < availableSlots) {
        assigned.push(part);
      } else {
        unassigned.push(part);
      }
    }

    return {
      assigned,
      unassigned,
      substitutions: [],
    };
  }

  private calculateOverallRating(
    skeleton: ISkeleton,
    parts: IPart[],
    expansionChips: IExpansionChip[]
  ): number {
    let rating = 50; // Base rating

    // Skeleton contribution (30%)
    rating += this.getRarityBonus(skeleton.rarity) * 0.3;

    // Parts contribution (50%)
    if (parts.length > 0) {
      const avgPartRating =
        parts.reduce((sum, part) => sum + this.getRarityBonus(part.rarity), 0) /
        parts.length;
      rating += avgPartRating * 0.5;
    }

    // Expansion chips contribution (20%)
    if (expansionChips.length > 0) {
      const avgChipRating =
        expansionChips.reduce(
          (sum, chip) => sum + this.getRarityBonus(chip.rarity),
          0
        ) / expansionChips.length;
      rating += avgChipRating * 0.2;
    }

    return Math.min(100, Math.max(0, Math.round(rating)));
  }

  private getRarityBonus(rarity: string): number {
    switch (rarity) {
      case "COMMON":
        return 10;
      case "UNCOMMON":
        return 20;
      case "RARE":
        return 30;
      case "EPIC":
        return 40;
      case "LEGENDARY":
        return 50;
      case "ULTRA_RARE":
        return 60;
      case "PROTOTYPE":
        return 70;
      default:
        return 10;
    }
  }
}

/**
 * Performance Assembly Strategy - Optimized for high-performance bots
 */
export class PerformanceAssemblyStrategy extends AssemblyStrategy {
  protected getStrategyName(): string {
    return "Performance";
  }

  protected async planAssembly(
    skeleton: ISkeleton,
    parts: IPart[],
    expansionChips: IExpansionChip[]
  ): Promise<AssemblyPlan> {
    // Select highest quality parts only
    const highQualityParts = parts
      .filter((part) => part.rarity !== "COMMON")
      .sort(
        (a, b) => this.getRarityScore(b.rarity) - this.getRarityScore(a.rarity)
      );

    const partAssignments = this.assignPartsForPerformance(
      skeleton,
      highQualityParts
    );

    // Optimize assembly steps for speed
    const assemblySteps: AssemblyStep[] = [
      {
        stepNumber: 1,
        description: "Rapid skeleton mounting",
        component: "skeleton",
        requiredTime: 50, // Faster than balanced
        dependencies: [],
      },
      {
        stepNumber: 2,
        description: "Parallel part installation",
        component: "part",
        requiredTime: 150, // Parallel installation
        dependencies: [1],
      },
      {
        stepNumber: 3,
        description: "High-speed chip integration",
        component: "chip",
        requiredTime: 75,
        dependencies: [2],
      },
      {
        stepNumber: 4,
        description: "Performance validation",
        component: "validation",
        requiredTime: 25,
        dependencies: [3],
      },
    ];

    const estimatedTime = assemblySteps.reduce(
      (sum, step) => sum + step.requiredTime,
      0
    );

    return {
      skeleton,
      partAssignments,
      expansionChipPlacements: expansionChips,
      assemblySteps,
      estimatedTime,
      compatibilityChecks: [],
    };
  }

  protected async executeAssembly(plan: AssemblyPlan): Promise<Partial<IBot>> {
    const { skeleton, partAssignments, expansionChipPlacements } = plan;

    return {
      skeleton,
      parts: partAssignments.assigned,
      expansionChips: expansionChipPlacements,
    } as Partial<IBot>;
  }

  private assignPartsForPerformance(
    skeleton: ISkeleton,
    parts: IPart[]
  ): PartAssignmentResult {
    const availableSlots = skeleton.slots;
    const assigned: IPart[] = [];
    const unassigned: IPart[] = [];

    // Take only the highest quality parts
    for (let i = 0; i < Math.min(availableSlots, parts.length); i++) {
      assigned.push(parts[i]);
    }

    for (let i = assigned.length; i < parts.length; i++) {
      unassigned.push(parts[i]);
    }

    return {
      assigned,
      unassigned,
      substitutions: [],
    };
  }

  private calculatePerformanceRating(
    skeleton: ISkeleton,
    parts: IPart[],
    expansionChips: IExpansionChip[]
  ): number {
    let rating = 60; // Higher base for performance strategy

    // Heavy weighting on high-quality components
    rating += this.getRarityScore(skeleton.rarity) * 0.4;

    if (parts.length > 0) {
      const avgPartRating =
        parts.reduce((sum, part) => sum + this.getRarityScore(part.rarity), 0) /
        parts.length;
      rating += avgPartRating * 0.4;
    }

    if (expansionChips.length > 0) {
      const avgChipRating =
        expansionChips.reduce(
          (sum, chip) => sum + this.getRarityScore(chip.rarity),
          0
        ) / expansionChips.length;
      rating += avgChipRating * 0.2;
    }

    return Math.min(100, Math.max(0, Math.round(rating)));
  }

  private getRarityScore(rarity: string): number {
    switch (rarity) {
      case "COMMON":
        return 5;
      case "UNCOMMON":
        return 15;
      case "RARE":
        return 25;
      case "EPIC":
        return 40;
      case "LEGENDARY":
        return 60;
      case "ULTRA_RARE":
        return 80;
      case "PROTOTYPE":
        return 100;
      default:
        return 5;
    }
  }
}

/**
 * Assembly Strategy Factory
 */
export class AssemblyStrategyFactory {
  /**
   * Create assembly strategy based on bot type and context
   */
  static createStrategy(
    botType: BotType,
    context: AssemblyContext
  ): AssemblyStrategy {
    switch (botType) {
      case BotType.KING:
      case BotType.ROGUE:
        return new PerformanceAssemblyStrategy(context);

      case BotType.WORKER:
      case BotType.PLAYABLE:
      case BotType.GOVBOT:
      default:
        return new BalancedAssemblyStrategy(context);
    }
  }

  /**
   * Create strategy based on skeleton type
   */
  static createStrategyForSkeleton(
    skeletonType: SkeletonType,
    context: AssemblyContext
  ): AssemblyStrategy {
    switch (skeletonType) {
      case SkeletonType.LIGHT:
      case SkeletonType.FLYING:
        return new PerformanceAssemblyStrategy(context);

      case SkeletonType.HEAVY:
      case SkeletonType.BALANCED:
      default:
        return new BalancedAssemblyStrategy(context);
    }
  }
}
