/**
 * Item Factory - Artifact-First Approach
 *
 * This factory creates Item artifacts and provides methods to convert them to DTOs
 * for database persistence. Artifacts are the primary objects, DTOs are for persistence.
 */

import { ArtifactDTOFactory } from "../base/artifact-dto-factory";
import {
  ItemDTO,
  CreateItemDTO,
  UpdateItemDTO,
} from "../../interfaces/artifact-dto";
import { ValidationResult } from "../../interfaces/base-dto";
// Direct conversion - no need for separate converter
import {
  ItemFactory as ArtifactItemFactory,
  type IItem,
  ItemCategory,
  Rarity,
  GemType,
  ResourceType,
} from "@botking/artifact";

/**
 * Item DTO Factory - Works with artifacts as primary objects
 */
export class ItemDTOFactory extends ArtifactDTOFactory<IItem, ItemDTO> {
  constructor() {
    super("item-factory");
  }
  // ==========================================
  // ARTIFACT CREATION METHODS (Primary)
  // ==========================================

  /**
   * Create a default Item artifact
   */
  public createArtifact(overrides?: {
    name?: string;
    description?: string;
    category?: ItemCategory;
    rarity?: Rarity;
    value?: number;
    isProtected?: boolean;
  }): IItem {
    this.logger.debug("Creating default Item artifact", overrides);

    return ArtifactItemFactory.createResourceItem(
      overrides?.name || "Default Item",
      ResourceType.ENERGY, // Default resource type
      overrides?.value || 10,
      overrides?.rarity || Rarity.COMMON
    );
  }

  /**
   * Create a Gem artifact
   */
  public createGemArtifact(
    name: string,
    gemType: GemType,
    rarity: Rarity = Rarity.COMMON,
    value?: number
  ): IItem {
    this.logger.debug("Creating Gem artifact", { name, gemType, rarity });

    return ArtifactItemFactory.createGems(gemType, value || 100, rarity);
  }

  /**
   * Create a Resource artifact
   */
  public createResourceArtifact(
    name: string,
    description: string,
    resourceAmount: number,
    rarity: Rarity = Rarity.COMMON
  ): IItem {
    this.logger.debug("Creating Resource artifact", {
      name,
      resourceAmount,
      rarity,
    });

    return ArtifactItemFactory.createResourceItem(
      name,
      ResourceType.ENERGY, // Default to energy
      resourceAmount,
      rarity
    );
  }

  /**
   * Create a Speed Up artifact
   */
  public createSpeedUpArtifact(
    name: string,
    target: string,
    speedMultiplier: number,
    duration: number
  ): IItem {
    this.logger.debug("Creating Speed Up artifact", {
      name,
      target,
      speedMultiplier,
    });

    return ArtifactItemFactory.createSpeedUpItem(
      name,
      target as any, // Will need proper typing
      speedMultiplier,
      duration
    );
  }

  /**
   * Create a Tradeable artifact
   */
  public createTradeableArtifact(
    name: string,
    description: string,
    rarity: Rarity,
    baseValue: number
  ): IItem {
    this.logger.debug("Creating Tradeable artifact", {
      name,
      rarity,
      baseValue,
    });

    return ArtifactItemFactory.createTradeableItem(
      name,
      description,
      [], // effects array (empty by default)
      baseValue,
      rarity
    );
  }

  // ==========================================
  // ARTIFACT-TO-DTO CONVERSION METHODS
  // ==========================================

  /**
   * Convert Item artifact to DTO for database persistence
   */
  public artifactToDTO(item: IItem): ItemDTO {
    this.logger.debug("Converting Item artifact to DTO", {
      itemId: item.id,
      itemName: item.name,
    });

    // Direct conversion without separate converter
    return {
      id: item.id,
      name: item.name,
      description: item.description,
      category: item.category,
      rarity: item.rarity,
      value: item.value,
      isProtected: false, // Default value - artifacts don't have this property
      createdAt: new Date(),
      updatedAt: new Date(),
    } as ItemDTO;
  }

  /**
   * Convert Item artifact to CreateItemDTO
   */
  public artifactToCreateDTO(item: IItem): CreateItemDTO {
    this.logger.debug("Converting Item artifact to CreateDTO", {
      itemId: item.id,
    });

    return {
      name: item.name,
      description: item.description,
      category: item.category,
      rarity: item.rarity,
      value: item.value,
      isProtected: false, // Default value - artifacts don't have this property
    };
  }

  /**
   * Batch convert multiple Item artifacts to DTOs
   */
  public batchArtifactsToDTO(items: IItem[]): ItemDTO[] {
    this.logger.debug("Batch converting Item artifacts to DTOs", {
      count: items.length,
    });

    return items.map((item) => this.artifactToDTO(item));
  }

  // ==========================================
  // ARTIFACT VALIDATION
  // ==========================================

  /**
   * Validate Item artifact
   */
  public validateArtifact(item: IItem): ValidationResult {
    this.logger.debug("Validating Item artifact", { itemId: item.id });

    const errors: string[] = [];

    try {
      // Basic artifact validation
      if (!item.id) errors.push("Item ID is required");
      if (!item.name) errors.push("Item name is required");
      if (!item.description) errors.push("Item description is required");
      if (!item.category) errors.push("Item category is required");
      if (!item.rarity) errors.push("Item rarity is required");
      if (typeof item.value !== "number" || item.value < 0) {
        errors.push("Item value must be a non-negative number");
      }

      // Use artifact's own validation if available
      if (typeof (item as any).validate === "function") {
        const artifactValidation = (item as any).validate();
        if (!artifactValidation.isValid) {
          errors.push(...artifactValidation.errors);
        }
      }

      return {
        isValid: errors.length === 0,
        errors: errors.map((error) => ({
          field: "artifact",
          message: error,
          code: "ARTIFACT_VALIDATION_ERROR",
        })),
      };
    } catch (error) {
      this.logger.error("Item artifact validation failed", {
        itemId: item.id,
        error: (error as Error).message,
      });

      return {
        isValid: false,
        errors: [
          {
            field: "artifact",
            message: `Validation error: ${(error as Error).message}`,
            code: "VALIDATION_EXCEPTION",
          },
        ],
      };
    }
  }

  /**
   * Enhance Item artifact with additional properties
   */
  public enhanceArtifact(
    item: IItem,
    enhancements: {
      rarity?: Rarity;
      value?: number;
      isProtected?: boolean;
    }
  ): IItem {
    this.logger.debug("Enhancing Item artifact", {
      itemId: item.id,
      enhancements,
    });

    // Create enhanced item with new properties
    return ArtifactItemFactory.createResourceItem(
      item.name,
      ResourceType.ENERGY, // Default to energy since we don't have isProtected
      enhancements.value || item.value,
      enhancements.rarity || item.rarity
    );
  }

  // ==========================================
  // REQUIRED IMPLEMENTATIONS (BaseDTOFactory)
  // ==========================================

  /**
   * Create default DTO (required by base class)
   */
  public createDefault(overrides?: Partial<ItemDTO>): ItemDTO {
    // Create artifact first, then convert to DTO
    const artifact = this.createArtifact({
      name: overrides?.name || undefined,
      description: overrides?.description || undefined,
      category: overrides?.category || undefined,
      rarity: overrides?.rarity || undefined,
      value: overrides?.value || undefined,
    });

    const dto = this.artifactToDTO(artifact);
    return this.mergeDefaults(dto, overrides);
  }

  /**
   * Create DTO from data (required by base class)
   */
  public createFromData(data: any): ItemDTO {
    // If data looks like an artifact, use it
    if (data.category && data.rarity && typeof data.value === "number") {
      return this.artifactToDTO(data as IItem);
    }

    // Otherwise, create artifact from basic data
    const artifact = this.createArtifact({
      name: data.name,
      description: data.description,
      category: data.category,
      rarity: data.rarity,
      value: data.value,
    });

    return this.artifactToDTO(artifact);
  }

  /**
   * Validate DTO (required by base class)
   */
  public validate(dto: ItemDTO): ValidationResult {
    const errors: string[] = [];

    // Basic validation
    if (!dto.id) errors.push("Item ID is required");
    if (!dto.name) errors.push("Item name is required");
    if (!dto.description) errors.push("Item description is required");
    if (!dto.category) errors.push("Item category is required");
    if (!dto.rarity) errors.push("Item rarity is required");
    if (typeof dto.value !== "number" || dto.value < 0) {
      errors.push("Item value must be a non-negative number");
    }

    // Category-specific validation
    if (dto.category === ItemCategory.GEMS && dto.value <= 0) {
      errors.push("Gems must have a positive value");
    }

    return {
      isValid: errors.length === 0,
      errors: errors.map((error) => ({
        field: "general",
        message: error,
        code: "VALIDATION_ERROR",
      })),
    };
  }
}
