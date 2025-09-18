import { SkeletonType, PartCategory } from "@botking/db";
import { createPackageLogger } from "@botking/logger";
import {
  ISlotInfo,
  ISlotCompatibility,
  ISkeletonTypeConstraints,
  SlotIdentifier,
} from "../types";
import {
  SKELETON_SLOT_LAYOUTS,
  SLOT_INFO_REGISTRY,
  SLOT_COMPATIBILITY,
} from "../rules/slot-configuration";
import { SKELETON_SLOT_CONFIG } from "../rules/skeleton-slot-config";

/**
 * Skeleton configuration result interface
 */
export interface SkeletonConfigurationResult {
  skeletonType: SkeletonType;
  availableSlots: ISlotInfo[];
  slotConstraints: ISkeletonTypeConstraints;
  totalSlots: number;
  slotsByCategory: Record<PartCategory, ISlotInfo[]>;
}

/**
 * Slot validation result interface
 */
export interface SlotValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  slotInfo?: ISlotInfo;
  compatibility?: ISlotCompatibility;
}

/**
 * SkeletonConfigurationService - OOP service for skeleton slot management
 * Replaces utility functions with proper class-based service
 */
export class SkeletonConfigurationService {
  private static instance: SkeletonConfigurationService;
  private logger: ReturnType<typeof createPackageLogger>;
  private configCache: Map<SkeletonType, SkeletonConfigurationResult> =
    new Map();
  private slotInfoCache: Map<SlotIdentifier, ISlotInfo> = new Map();
  private compatibilityCache: Map<SlotIdentifier, ISlotCompatibility> =
    new Map();

  private constructor() {
    this.logger = createPackageLogger("domain", {
      service: "skeleton-configuration",
    });
    this.preloadCaches();
  }

  /**
   * Get singleton instance
   */
  public static getInstance(): SkeletonConfigurationService {
    if (!SkeletonConfigurationService.instance) {
      SkeletonConfigurationService.instance =
        new SkeletonConfigurationService();
    }
    return SkeletonConfigurationService.instance;
  }

  /**
   * Get comprehensive skeleton configuration
   */
  public getSkeletonConfiguration(
    skeletonType: SkeletonType
  ): SkeletonConfigurationResult {
    // Check cache first
    const cached = this.configCache.get(skeletonType);
    if (cached) {
      this.logger.debug(
        `Cache hit for skeleton configuration: ${skeletonType}`
      );
      return cached;
    }

    this.logger.debug(`Building skeleton configuration for: ${skeletonType}`);

    try {
      const availableSlots = this.getAvailableSlots(skeletonType);
      const slotConstraints = this.getSlotConstraints(skeletonType);

      // Group slots by category
      const slotsByCategory = this.groupSlotsByCategory(availableSlots);

      const result: SkeletonConfigurationResult = {
        skeletonType,
        availableSlots,
        slotConstraints,
        totalSlots: availableSlots.length,
        slotsByCategory,
      };

      // Cache the result
      this.configCache.set(skeletonType, result);

      this.logger.info(`Skeleton configuration built successfully`, {
        skeletonType,
        totalSlots: result.totalSlots,
      });

      return result;
    } catch (error) {
      this.logger.error(`Failed to build skeleton configuration`, {
        skeletonType,
        error,
      });
      throw error;
    }
  }

  /**
   * Get available slots for a skeleton type (replaces utility function)
   */
  public getAvailableSlots(skeletonType: SkeletonType): ISlotInfo[] {
    try {
      const slotIds = SKELETON_SLOT_LAYOUTS[skeletonType];
      if (!slotIds) {
        throw new Error(
          `No slot layout found for skeleton type: ${skeletonType}`
        );
      }

      return slotIds.map((slotId) => this.getSlotInfo(slotId));
    } catch (error) {
      this.logger.error(`Failed to get available slots`, {
        skeletonType,
        error,
      });
      throw error;
    }
  }

  /**
   * Get slot information by slot ID (replaces utility function)
   */
  public getSlotInfo(slotId: SlotIdentifier): ISlotInfo {
    // Check cache first
    const cached = this.slotInfoCache.get(slotId);
    if (cached) {
      return cached;
    }

    const info = SLOT_INFO_REGISTRY[slotId];
    if (!info) {
      const error = new Error(`Unknown slot identifier: ${slotId}`);
      this.logger.error("Slot info not found", { slotId });
      throw error;
    }

    // Cache the result
    this.slotInfoCache.set(slotId, info);
    return info;
  }

  /**
   * Get slot compatibility rules (replaces utility function)
   */
  public getSlotCompatibility(slotId: SlotIdentifier): ISlotCompatibility {
    // Check cache first
    const cached = this.compatibilityCache.get(slotId);
    if (cached) {
      return cached;
    }

    const compatibility = SLOT_COMPATIBILITY[slotId];
    if (!compatibility) {
      const error = new Error(
        `No compatibility rules found for slot: ${slotId}`
      );
      this.logger.error("Slot compatibility not found", { slotId });
      throw error;
    }

    // Cache the result
    this.compatibilityCache.set(slotId, compatibility);
    return compatibility;
  }

  /**
   * Get slot constraints for a skeleton type (replaces utility function)
   */
  public getSlotConstraints(
    skeletonType: SkeletonType
  ): ISkeletonTypeConstraints {
    const config = SKELETON_SLOT_CONFIG[skeletonType];
    if (!config) {
      const error = new Error(`Unknown skeleton type: ${skeletonType}`);
      this.logger.error("Skeleton slot config not found", { skeletonType });
      throw error;
    }
    return config;
  }

  /**
   * Get default slots for a skeleton type (replaces utility function)
   */
  public getDefaultSlots(skeletonType: SkeletonType): {
    headSlots: number;
    torsoSlots: number;
    armSlots: number;
    legSlots: number;
    accessorySlots: number;
  } {
    try {
      const constraints = this.getSlotConstraints(skeletonType);
      return {
        headSlots: constraints[PartCategory.HEAD].default,
        torsoSlots: constraints[PartCategory.TORSO].default,
        armSlots: constraints[PartCategory.ARM].default,
        legSlots: constraints[PartCategory.LEG].default,
        accessorySlots: constraints[PartCategory.ACCESSORY].default,
      };
    } catch (error) {
      this.logger.error(`Failed to get default slots`, { skeletonType, error });
      throw error;
    }
  }

  /**
   * Check if a part category is compatible with a slot (replaces utility function)
   */
  public isPartCompatibleWithSlot(
    slotId: SlotIdentifier,
    partCategory: PartCategory
  ): boolean {
    try {
      const compatibility = this.getSlotCompatibility(slotId);
      return compatibility.compatibleCategories.includes(partCategory);
    } catch (error) {
      this.logger.warn(`Compatibility check failed, defaulting to false`, {
        slotId,
        partCategory,
        error,
      });
      return false;
    }
  }

  /**
   * Validate slot configuration for a skeleton
   */
  public validateSlotConfiguration(
    skeletonType: SkeletonType,
    slotAssignments: Record<SlotIdentifier, PartCategory>
  ): SlotValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    try {
      const availableSlots = this.getAvailableSlots(skeletonType);
      const availableSlotIds = availableSlots.map((slot) => slot.slotId);

      // Check if all assigned slots are valid for this skeleton
      for (const slotId of Object.keys(slotAssignments) as SlotIdentifier[]) {
        if (!availableSlotIds.includes(slotId)) {
          errors.push(
            `Slot ${slotId} is not available for skeleton type ${skeletonType}`
          );
          continue;
        }

        const partCategory = slotAssignments[slotId];
        if (!this.isPartCompatibleWithSlot(slotId, partCategory)) {
          errors.push(
            `Part category ${partCategory} is not compatible with slot ${slotId}`
          );
        }
      }

      // Check for required slots
      const constraints = this.getSlotConstraints(skeletonType);
      for (const [category, constraint] of Object.entries(constraints)) {
        const assignedCount = Object.values(slotAssignments).filter(
          (cat) => cat === category
        ).length;

        if (assignedCount < constraint.minimum) {
          errors.push(
            `Insufficient ${category} parts: ${assignedCount}/${constraint.minimum} minimum required`
          );
        }

        if (assignedCount > constraint.maximum) {
          errors.push(
            `Too many ${category} parts: ${assignedCount}/${constraint.maximum} maximum allowed`
          );
        }

        if (assignedCount < constraint.default) {
          warnings.push(
            `Below recommended ${category} parts: ${assignedCount}/${constraint.default} recommended`
          );
        }
      }

      const result: SlotValidationResult = {
        isValid: errors.length === 0,
        errors,
        warnings,
      };

      this.logger.debug(`Slot configuration validation completed`, {
        skeletonType,
        isValid: result.isValid,
        errorCount: errors.length,
        warningCount: warnings.length,
      });

      return result;
    } catch (error) {
      this.logger.error(`Slot configuration validation failed`, {
        skeletonType,
        error,
      });

      return {
        isValid: false,
        errors: [`Validation failed: ${(error as Error).message}`],
        warnings: [],
      };
    }
  }

  /**
   * Get all supported skeleton types
   */
  public getSupportedSkeletonTypes(): SkeletonType[] {
    return Object.keys(SKELETON_SLOT_LAYOUTS) as SkeletonType[];
  }

  /**
   * Get all available slot identifiers
   */
  public getAllSlotIdentifiers(): SlotIdentifier[] {
    return Object.keys(SLOT_INFO_REGISTRY) as SlotIdentifier[];
  }

  /**
   * Get service statistics
   */
  public getStats(): {
    supportedSkeletonTypes: number;
    totalSlotTypes: number;
    cacheHits: {
      configurations: number;
      slotInfo: number;
      compatibility: number;
    };
  } {
    return {
      supportedSkeletonTypes: this.getSupportedSkeletonTypes().length,
      totalSlotTypes: this.getAllSlotIdentifiers().length,
      cacheHits: {
        configurations: this.configCache.size,
        slotInfo: this.slotInfoCache.size,
        compatibility: this.compatibilityCache.size,
      },
    };
  }

  /**
   * Clear all caches
   */
  public clearCaches(): void {
    this.configCache.clear();
    this.slotInfoCache.clear();
    this.compatibilityCache.clear();
    this.logger.info("All caches cleared");
  }

  /**
   * Reset service state
   */
  public reset(): void {
    this.clearCaches();
    this.preloadCaches();
    this.logger.info("Service reset completed");
  }

  /**
   * Group slots by part category
   */
  private groupSlotsByCategory(
    slots: ISlotInfo[]
  ): Record<PartCategory, ISlotInfo[]> {
    const grouped: Record<PartCategory, ISlotInfo[]> = {
      [PartCategory.HEAD]: [],
      [PartCategory.TORSO]: [],
      [PartCategory.ARM]: [],
      [PartCategory.LEG]: [],
      [PartCategory.ACCESSORY]: [],
    };

    for (const slot of slots) {
      const compatibility = this.getSlotCompatibility(slot.slotId);
      for (const category of compatibility.compatibleCategories) {
        // Only group standard part categories
        if (Object.values(PartCategory).includes(category as PartCategory)) {
          grouped[category as PartCategory].push(slot);
        }
      }
    }

    return grouped;
  }

  /**
   * Preload frequently used data into caches
   */
  private preloadCaches(): void {
    this.logger.debug("Preloading caches...");

    // Preload all slot info
    for (const slotId of this.getAllSlotIdentifiers()) {
      this.getSlotInfo(slotId);
      this.getSlotCompatibility(slotId);
    }

    this.logger.info("Caches preloaded successfully", {
      slotInfoCached: this.slotInfoCache.size,
      compatibilityCached: this.compatibilityCache.size,
    });
  }
}

// Export singleton instance for convenience
export const skeletonConfigurationService =
  SkeletonConfigurationService.getInstance();
