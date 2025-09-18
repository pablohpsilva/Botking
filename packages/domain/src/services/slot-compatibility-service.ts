import { PartCategory, SkeletonType } from "@botking/db";
import { createPackageLogger } from "@botking/logger";
import { ISlotInfo, ISlotCompatibility, SlotIdentifier } from "../types";
import { skeletonConfigurationService } from "./skeleton-configuration-service";

/**
 * Part compatibility result interface
 */
export interface PartCompatibilityResult {
  isCompatible: boolean;
  compatibleSlots: SlotIdentifier[];
  incompatibleSlots: SlotIdentifier[];
  reasons: string[];
  recommendations: string[];
}

/**
 * Skeleton compatibility analysis interface
 */
export interface SkeletonCompatibilityAnalysis {
  skeletonType: SkeletonType;
  partCategory: PartCategory;
  totalSlots: number;
  compatibleSlots: number;
  compatibilityPercentage: number;
  availableSlots: ISlotInfo[];
  compatibleSlotDetails: Array<{
    slot: ISlotInfo;
    compatibility: ISlotCompatibility;
  }>;
}

/**
 * SlotCompatibilityService - OOP service for slot compatibility management
 * Provides advanced compatibility checking and analysis
 */
export class SlotCompatibilityService {
  private static instance: SlotCompatibilityService;
  private logger: ReturnType<typeof createPackageLogger>;
  private compatibilityCache: Map<string, PartCompatibilityResult> = new Map();

  private constructor() {
    this.logger = createPackageLogger("domain", {
      service: "slot-compatibility",
    });
  }

  /**
   * Get singleton instance
   */
  public static getInstance(): SlotCompatibilityService {
    if (!SlotCompatibilityService.instance) {
      SlotCompatibilityService.instance = new SlotCompatibilityService();
    }
    return SlotCompatibilityService.instance;
  }

  /**
   * Check if a part is compatible with a specific slot
   */
  public isPartCompatibleWithSlot(
    slotId: SlotIdentifier,
    partCategory: PartCategory
  ): boolean {
    try {
      return skeletonConfigurationService.isPartCompatibleWithSlot(
        slotId,
        partCategory
      );
    } catch (error) {
      this.logger.error(`Compatibility check failed`, {
        slotId,
        partCategory,
        error,
      });
      return false;
    }
  }

  /**
   * Get all compatible slots for a part category
   */
  public getCompatibleSlots(partCategory: PartCategory): SlotIdentifier[] {
    const allSlots = skeletonConfigurationService.getAllSlotIdentifiers();
    return allSlots.filter((slotId) =>
      this.isPartCompatibleWithSlot(slotId, partCategory)
    );
  }

  /**
   * Get comprehensive part compatibility analysis
   */
  public analyzePartCompatibility(
    partCategory: PartCategory,
    targetSlots?: SlotIdentifier[]
  ): PartCompatibilityResult {
    const cacheKey = `${partCategory}-${targetSlots?.join(",") || "all"}`;

    // Check cache first
    const cached = this.compatibilityCache.get(cacheKey);
    if (cached) {
      this.logger.debug(`Cache hit for part compatibility: ${cacheKey}`);
      return cached;
    }

    this.logger.debug(`Analyzing part compatibility`, {
      partCategory,
      targetSlots,
    });

    try {
      const slotsToCheck =
        targetSlots || skeletonConfigurationService.getAllSlotIdentifiers();
      const compatibleSlots: SlotIdentifier[] = [];
      const incompatibleSlots: SlotIdentifier[] = [];
      const reasons: string[] = [];
      const recommendations: string[] = [];

      for (const slotId of slotsToCheck) {
        if (this.isPartCompatibleWithSlot(slotId, partCategory)) {
          compatibleSlots.push(slotId);
        } else {
          incompatibleSlots.push(slotId);

          try {
            const compatibility =
              skeletonConfigurationService.getSlotCompatibility(slotId);
            reasons.push(
              `${slotId} only accepts: ${compatibility.compatibleCategories.join(", ")}`
            );
          } catch (error) {
            reasons.push(`${slotId}: compatibility rules not found`);
          }
        }
      }

      // Generate recommendations
      if (compatibleSlots.length === 0) {
        recommendations.push(
          `No compatible slots found for ${partCategory} parts`
        );
        recommendations.push(`Consider using a different part category`);
      } else if (compatibleSlots.length < slotsToCheck.length / 2) {
        recommendations.push(
          `Limited compatibility: only ${compatibleSlots.length}/${slotsToCheck.length} slots accept ${partCategory} parts`
        );
        recommendations.push(
          `Consider specialized skeleton types for better compatibility`
        );
      } else {
        recommendations.push(
          `Good compatibility: ${compatibleSlots.length}/${slotsToCheck.length} slots accept ${partCategory} parts`
        );
      }

      const result: PartCompatibilityResult = {
        isCompatible: compatibleSlots.length > 0,
        compatibleSlots,
        incompatibleSlots,
        reasons,
        recommendations,
      };

      // Cache the result
      this.compatibilityCache.set(cacheKey, result);

      this.logger.info(`Part compatibility analysis completed`, {
        partCategory,
        compatible: compatibleSlots.length,
        incompatible: incompatibleSlots.length,
        isCompatible: result.isCompatible,
      });

      return result;
    } catch (error) {
      this.logger.error(`Part compatibility analysis failed`, {
        partCategory,
        error,
      });

      return {
        isCompatible: false,
        compatibleSlots: [],
        incompatibleSlots: targetSlots || [],
        reasons: [`Analysis failed: ${(error as Error).message}`],
        recommendations: ["Please check part category and try again"],
      };
    }
  }

  /**
   * Analyze skeleton compatibility for a specific part category
   */
  public analyzeSkeletonCompatibility(
    skeletonType: SkeletonType,
    partCategory: PartCategory
  ): SkeletonCompatibilityAnalysis {
    this.logger.debug(`Analyzing skeleton compatibility`, {
      skeletonType,
      partCategory,
    });

    try {
      const availableSlots =
        skeletonConfigurationService.getAvailableSlots(skeletonType);
      const compatibleSlotDetails: Array<{
        slot: ISlotInfo;
        compatibility: ISlotCompatibility;
      }> = [];

      for (const slot of availableSlots) {
        if (this.isPartCompatibleWithSlot(slot.slotId, partCategory)) {
          const compatibility =
            skeletonConfigurationService.getSlotCompatibility(slot.slotId);
          compatibleSlotDetails.push({ slot, compatibility });
        }
      }

      const compatibleSlots = compatibleSlotDetails.length;
      const totalSlots = availableSlots.length;
      const compatibilityPercentage =
        totalSlots > 0 ? (compatibleSlots / totalSlots) * 100 : 0;

      const analysis: SkeletonCompatibilityAnalysis = {
        skeletonType,
        partCategory,
        totalSlots,
        compatibleSlots,
        compatibilityPercentage,
        availableSlots,
        compatibleSlotDetails,
      };

      this.logger.info(`Skeleton compatibility analysis completed`, {
        skeletonType,
        partCategory,
        compatibilityPercentage: Math.round(compatibilityPercentage),
        compatibleSlots,
        totalSlots,
      });

      return analysis;
    } catch (error) {
      this.logger.error(`Skeleton compatibility analysis failed`, {
        skeletonType,
        partCategory,
        error,
      });

      return {
        skeletonType,
        partCategory,
        totalSlots: 0,
        compatibleSlots: 0,
        compatibilityPercentage: 0,
        availableSlots: [],
        compatibleSlotDetails: [],
      };
    }
  }

  /**
   * Find the best skeleton type for a set of part categories
   */
  public findBestSkeletonForParts(partCategories: PartCategory[]): Array<{
    skeletonType: SkeletonType;
    overallCompatibility: number;
    categoryAnalysis: Record<PartCategory, SkeletonCompatibilityAnalysis>;
    score: number;
  }> {
    this.logger.debug(`Finding best skeleton for parts`, { partCategories });

    const skeletonTypes =
      skeletonConfigurationService.getSupportedSkeletonTypes();
    const results: Array<{
      skeletonType: SkeletonType;
      overallCompatibility: number;
      categoryAnalysis: Record<PartCategory, SkeletonCompatibilityAnalysis>;
      score: number;
    }> = [];

    for (const skeletonType of skeletonTypes) {
      const categoryAnalysis: Record<
        PartCategory,
        SkeletonCompatibilityAnalysis
      > = {} as any;
      let totalCompatibility = 0;

      for (const partCategory of partCategories) {
        const analysis = this.analyzeSkeletonCompatibility(
          skeletonType,
          partCategory
        );
        categoryAnalysis[partCategory] = analysis;
        totalCompatibility += analysis.compatibilityPercentage;
      }

      const overallCompatibility =
        partCategories.length > 0
          ? totalCompatibility / partCategories.length
          : 0;

      // Calculate score (weighted by number of compatible slots)
      const totalCompatibleSlots = Object.values(categoryAnalysis).reduce(
        (sum, analysis) => sum + analysis.compatibleSlots,
        0
      );
      const score = overallCompatibility + totalCompatibleSlots * 2; // Bonus for more slots

      results.push({
        skeletonType,
        overallCompatibility,
        categoryAnalysis,
        score,
      });
    }

    // Sort by score (descending)
    results.sort((a, b) => b.score - a.score);

    this.logger.info(`Best skeleton analysis completed`, {
      partCategories,
      topSkeleton: results[0]?.skeletonType,
      topScore: results[0]?.score,
    });

    return results;
  }

  /**
   * Validate part assignment to slots
   */
  public validatePartAssignment(
    assignments: Array<{ slotId: SlotIdentifier; partCategory: PartCategory }>
  ): {
    isValid: boolean;
    validAssignments: Array<{
      slotId: SlotIdentifier;
      partCategory: PartCategory;
    }>;
    invalidAssignments: Array<{
      slotId: SlotIdentifier;
      partCategory: PartCategory;
      reason: string;
    }>;
    summary: {
      total: number;
      valid: number;
      invalid: number;
      validityPercentage: number;
    };
  } {
    this.logger.debug(`Validating part assignments`, {
      count: assignments.length,
    });

    const validAssignments: Array<{
      slotId: SlotIdentifier;
      partCategory: PartCategory;
    }> = [];
    const invalidAssignments: Array<{
      slotId: SlotIdentifier;
      partCategory: PartCategory;
      reason: string;
    }> = [];

    for (const assignment of assignments) {
      if (
        this.isPartCompatibleWithSlot(
          assignment.slotId,
          assignment.partCategory
        )
      ) {
        validAssignments.push(assignment);
      } else {
        try {
          const compatibility =
            skeletonConfigurationService.getSlotCompatibility(
              assignment.slotId
            );
          invalidAssignments.push({
            ...assignment,
            reason: `Slot accepts: ${compatibility.compatibleCategories.join(", ")}, but got: ${assignment.partCategory}`,
          });
        } catch (error) {
          invalidAssignments.push({
            ...assignment,
            reason: `Slot compatibility rules not found`,
          });
        }
      }
    }

    const total = assignments.length;
    const valid = validAssignments.length;
    const invalid = invalidAssignments.length;
    const validityPercentage = total > 0 ? (valid / total) * 100 : 0;

    const result = {
      isValid: invalid === 0,
      validAssignments,
      invalidAssignments,
      summary: {
        total,
        valid,
        invalid,
        validityPercentage,
      },
    };

    this.logger.info(`Part assignment validation completed`, {
      total,
      valid,
      invalid,
      validityPercentage: Math.round(validityPercentage),
    });

    return result;
  }

  /**
   * Get service statistics
   */
  public getStats(): {
    cacheSize: number;
    supportedCategories: PartCategory[];
    totalSlotTypes: number;
  } {
    return {
      cacheSize: this.compatibilityCache.size,
      supportedCategories: Object.values(PartCategory),
      totalSlotTypes:
        skeletonConfigurationService.getAllSlotIdentifiers().length,
    };
  }

  /**
   * Clear compatibility cache
   */
  public clearCache(): void {
    this.compatibilityCache.clear();
    this.logger.info("Compatibility cache cleared");
  }

  /**
   * Reset service state
   */
  public reset(): void {
    this.clearCache();
    this.logger.info("Service reset completed");
  }
}

// Export singleton instance for convenience
export const slotCompatibilityService = SlotCompatibilityService.getInstance();
