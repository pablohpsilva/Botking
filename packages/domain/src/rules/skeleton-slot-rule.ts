/**
 * Skeleton slot validation rules
 */

import { SkeletonType, PartCategory } from "@botking/db";
import {
  IDomainRule,
  IValidationResult,
  ValidationSeverity,
} from "../types/validation";
import {
  ISkeletonSlots,
  IPartSlotUsage,
  ISlotValidationResult,
  ISlotValidationResults,
} from "../types/skeleton-slots";
import { getSkeletonSlotConstraints } from "./skeleton-slot-config";

/**
 * Bot configuration for slot validation
 */
export interface IBotSlotConfiguration {
  skeletonType: SkeletonType;
  skeletonSlots: ISkeletonSlots;
  partUsage: IPartSlotUsage;
}

/**
 * Rule to validate skeleton slot constraints
 */
export class SkeletonSlotRule implements IDomainRule<IBotSlotConfiguration> {
  getRuleName(): string {
    return "SkeletonSlotRule";
  }

  getDescription(): string {
    return "Validates that parts fit within skeleton slot constraints";
  }

  isRequired(): boolean {
    return true;
  }

  validate(config: IBotSlotConfiguration): IValidationResult {
    try {
      const slotResults = this.validateSlotConstraints(
        config.skeletonType,
        config.skeletonSlots,
        config.partUsage
      );

      return {
        isValid: slotResults.isValid,
        severity: slotResults.isValid
          ? ValidationSeverity.INFO
          : ValidationSeverity.ERROR,
        ruleName: this.getRuleName(),
        message: slotResults.isValid
          ? "All parts fit within skeleton slot constraints"
          : `Slot constraint violations: ${slotResults.errors.join(", ")}`,
        details: {
          slotResults,
          skeletonType: config.skeletonType,
          slotConfiguration: config.skeletonSlots,
          partUsage: config.partUsage,
        },
      };
    } catch (error) {
      return {
        isValid: false,
        severity: ValidationSeverity.ERROR,
        ruleName: this.getRuleName(),
        message: `Slot validation failed: ${error instanceof Error ? error.message : "Unknown error"}`,
        details: { error: error instanceof Error ? error.message : error },
      };
    }
  }

  /**
   * Validate slot constraints for a specific skeleton configuration
   */
  validateSlotConstraints(
    skeletonType: SkeletonType,
    skeletonSlots: ISkeletonSlots,
    partUsage: IPartSlotUsage
  ): ISlotValidationResults {
    const constraints = getSkeletonSlotConstraints(skeletonType);
    const results: ISlotValidationResult[] = [];
    const errors: string[] = [];
    const warnings: string[] = [];

    // Validate each part category
    const validations: Array<{
      category: PartCategory | 'expansionChips' | 'soulChips';
      current: number;
      available: number;
      constraints: { min: number; max: number | null; default: number };
    }> = [
      {
        category: PartCategory.HEAD,
        current: partUsage[PartCategory.HEAD],
        available: skeletonSlots.headSlots,
        constraints: constraints[PartCategory.HEAD],
      },
      {
        category: PartCategory.TORSO,
        current: partUsage[PartCategory.TORSO],
        available: skeletonSlots.torsoSlots,
        constraints: constraints[PartCategory.TORSO],
      },
      {
        category: PartCategory.ARM,
        current: partUsage[PartCategory.ARM],
        available: skeletonSlots.armSlots,
        constraints: constraints[PartCategory.ARM],
      },
      {
        category: PartCategory.LEG,
        current: partUsage[PartCategory.LEG],
        available: skeletonSlots.legSlots,
        constraints: constraints[PartCategory.LEG],
      },
      {
        category: PartCategory.ACCESSORY,
        current: partUsage[PartCategory.ACCESSORY],
        available: skeletonSlots.accessorySlots,
        constraints: constraints[PartCategory.ACCESSORY],
      },
      {
        category: "expansionChips",
        current: partUsage.expansionChips,
        available: skeletonSlots.expansionSlots,
        constraints: constraints.expansionChips,
      },
      {
        category: "soulChips",
        current: partUsage.soulChips,
        available: skeletonSlots.soulChipSlots,
        constraints: constraints.soulChips,
      },
    ];

    for (const validation of validations) {
      const result = this.validateSlotCategory(validation);
      results.push(result);

      if (!result.isValid) {
        errors.push(
          result.message || `${validation.category} slot constraint violation`
        );
      }

      // Check for warnings (using more slots than default but within limits)
      if (
        result.isValid &&
        validation.current > validation.constraints.default
      ) {
        warnings.push(
          `${validation.category}: using ${validation.current} slots (more than default ${validation.constraints.default})`
        );
      }
    }

    return {
      isValid: results.every((r) => r.isValid),
      results,
      errors,
      warnings,
    };
  }

  /**
   * Validate a specific slot category
   */
  private validateSlotCategory(validation: {
    category: PartCategory | "expansionChips" | "soulChips";
    current: number;
    available: number;
    constraints: { min: number; max: number | null; default: number };
  }): ISlotValidationResult {
    const { category, current, available, constraints } = validation;

    // Check if current usage exceeds available slots
    if (current > available) {
      return {
        category,
        isValid: false,
        currentCount: current,
        maxAllowed: available,
        minRequired: constraints.min,
        message: `${category}: trying to use ${current} parts but only ${available} slots available`,
      };
    }

    // Check if current usage is below minimum required
    if (current < constraints.min) {
      return {
        category,
        isValid: false,
        currentCount: current,
        maxAllowed: available,
        minRequired: constraints.min,
        message: `${category}: using ${current} parts but minimum ${constraints.min} required`,
      };
    }

    // Check if current usage exceeds maximum allowed (if set)
    if (constraints.max !== null && current > constraints.max) {
      return {
        category,
        isValid: false,
        currentCount: current,
        maxAllowed: constraints.max,
        minRequired: constraints.min,
        message: `${category}: using ${current} parts but maximum ${constraints.max} allowed`,
      };
    }

    // Check if skeleton has enough slots configured
    if (available < constraints.min) {
      return {
        category,
        isValid: false,
        currentCount: current,
        maxAllowed: available,
        minRequired: constraints.min,
        message: `${category}: skeleton only has ${available} slots but minimum ${constraints.min} required for this skeleton type`,
      };
    }

    return {
      category,
      isValid: true,
      currentCount: current,
      maxAllowed: constraints.max || available,
      minRequired: constraints.min,
    };
  }
}
