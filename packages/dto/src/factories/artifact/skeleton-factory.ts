import { BaseDTOFactory } from "../base/base-factory";
import {
  SkeletonDTO,
  RarityDTO,
  SkeletonTypeDTO,
  MobilityTypeDTO,
} from "../../interfaces/artifact-dto";
import { ValidationResult, ValidationError } from "../../interfaces/base-dto";

/**
 * Skeleton DTO Factory
 */
export class SkeletonDTOFactory extends BaseDTOFactory<SkeletonDTO> {
  public createDefault(overrides?: Partial<SkeletonDTO>): SkeletonDTO {
    const defaults: SkeletonDTO = {
      id: this.generateId(),
      userId: "",
      name: "Basic Skeleton",
      type: SkeletonTypeDTO.BALANCED,
      rarity: RarityDTO.COMMON,
      slots: 4,
      baseDurability: 100,
      mobilityType: MobilityTypeDTO.BIPEDAL,
      specialAbilities: [],
      upgradeLevel: 0,
      currentDurability: 100,
      maxDurability: 100,
      version: 1,
      createdAt: this.getCurrentTimestamp(),
      updatedAt: this.getCurrentTimestamp(),
    };

    return this.mergeDefaults(defaults, overrides);
  }

  public createFromData(data: any): SkeletonDTO {
    return {
      id: data.id || this.generateId(),
      userId: data.userId || "",
      name: data.name || "Unnamed Skeleton",
      type: data.type || SkeletonTypeDTO.BALANCED,
      rarity: data.rarity || RarityDTO.COMMON,
      slots: data.slots || 4,
      baseDurability: data.baseDurability || 100,
      mobilityType: data.mobilityType || MobilityTypeDTO.BIPEDAL,
      specialAbilities: data.specialAbilities || [],
      upgradeLevel: data.upgradeLevel || 0,
      currentDurability: data.currentDurability || 100,
      maxDurability: data.maxDurability || 100,
      version: data.version || 1,
      description: data.description,
      source: data.source,
      tags: data.tags,
      metadata: data.metadata,
      createdAt: data.createdAt || this.getCurrentTimestamp(),
      updatedAt: data.updatedAt || this.getCurrentTimestamp(),
    };
  }

  public validate(dto: SkeletonDTO): ValidationResult {
    const errors: ValidationError[] = [];

    // Required fields
    errors.push(
      ...this.validateRequired(dto, ["id", "userId", "name", "type", "rarity"])
    );

    // String validations
    if (dto.name) {
      errors.push(...this.validateStringLength(dto.name, "name", 1, 100));
    }

    // Enum validations
    errors.push(
      ...this.validateEnum(dto.type, "type", Object.values(SkeletonTypeDTO))
    );
    errors.push(
      ...this.validateEnum(dto.rarity, "rarity", Object.values(RarityDTO))
    );
    errors.push(
      ...this.validateEnum(
        dto.mobilityType,
        "mobilityType",
        Object.values(MobilityTypeDTO)
      )
    );

    // Number validations
    errors.push(...this.validateNumberRange(dto.slots, "slots", 1, 20));
    errors.push(
      ...this.validateNumberRange(dto.baseDurability, "baseDurability", 1)
    );
    errors.push(
      ...this.validateNumberRange(dto.upgradeLevel, "upgradeLevel", 0, 25)
    );
    errors.push(
      ...this.validateNumberRange(
        dto.currentDurability,
        "currentDurability",
        0,
        dto.maxDurability
      )
    );

    return { isValid: errors.length === 0, errors };
  }
}
