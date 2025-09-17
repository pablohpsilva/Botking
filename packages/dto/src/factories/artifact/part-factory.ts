import { BaseDTOFactory } from "../base/base-factory";
import {
  PartDTO,
  RarityDTO,
  PartCategoryDTO,
} from "../../interfaces/artifact-dto";
import { ValidationResult, ValidationError } from "../../interfaces/base-dto";

/**
 * Part DTO Factory
 */
export class PartDTOFactory extends BaseDTOFactory<PartDTO> {
  public createDefault(overrides?: Partial<PartDTO>): PartDTO {
    const defaults: PartDTO = {
      id: this.generateId(),
      userId: "",
      name: "Basic Part",
      category: PartCategoryDTO.ARM,
      rarity: RarityDTO.COMMON,
      stats: {
        attack: 10,
        defense: 10,
        speed: 10,
        perception: 10,
        energyConsumption: 5,
      },
      abilities: [],
      upgradeLevel: 0,
      currentDurability: 100,
      maxDurability: 100,
      version: 1,
      createdAt: this.getCurrentTimestamp(),
      updatedAt: this.getCurrentTimestamp(),
    };

    return this.mergeDefaults(defaults, overrides);
  }

  public createFromData(data: any): PartDTO {
    return {
      id: data.id || this.generateId(),
      userId: data.userId || "",
      name: data.name || "Unnamed Part",
      category: data.category || PartCategoryDTO.ARM,
      rarity: data.rarity || RarityDTO.COMMON,
      stats: {
        attack: data.stats?.attack || 10,
        defense: data.stats?.defense || 10,
        speed: data.stats?.speed || 10,
        perception: data.stats?.perception || 10,
        energyConsumption: data.stats?.energyConsumption || 5,
      },
      abilities: data.abilities || [],
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

  public validate(dto: PartDTO): ValidationResult {
    const errors: ValidationError[] = [];

    // Required fields
    errors.push(
      ...this.validateRequired(dto, [
        "id",
        "userId",
        "name",
        "category",
        "rarity",
        "stats",
      ])
    );

    // String validations
    if (dto.name) {
      errors.push(...this.validateStringLength(dto.name, "name", 1, 100));
    }

    // Enum validations
    errors.push(
      ...this.validateEnum(
        dto.category,
        "category",
        Object.values(PartCategoryDTO)
      )
    );
    errors.push(
      ...this.validateEnum(dto.rarity, "rarity", Object.values(RarityDTO))
    );

    // Stats validation
    if (dto.stats) {
      errors.push(
        ...this.validateNumberRange(dto.stats.attack, "stats.attack", 0)
      );
      errors.push(
        ...this.validateNumberRange(dto.stats.defense, "stats.defense", 0)
      );
      errors.push(
        ...this.validateNumberRange(dto.stats.speed, "stats.speed", 0)
      );
      errors.push(
        ...this.validateNumberRange(dto.stats.perception, "stats.perception", 0)
      );
      errors.push(
        ...this.validateNumberRange(
          dto.stats.energyConsumption,
          "stats.energyConsumption",
          0
        )
      );
    }

    // Other validations
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
