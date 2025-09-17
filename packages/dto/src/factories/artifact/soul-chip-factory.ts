import { BaseDTOFactory } from "../base/base-factory";
import { SoulChipDTO, RarityDTO } from "../../interfaces/artifact-dto";
import { ValidationResult, ValidationError } from "../../interfaces/base-dto";

/**
 * Soul Chip DTO Factory
 */
export class SoulChipDTOFactory extends BaseDTOFactory<SoulChipDTO> {
  public createDefault(overrides?: Partial<SoulChipDTO>): SoulChipDTO {
    const defaults: SoulChipDTO = {
      id: this.generateId(),
      userId: "",
      name: "Default Soul Chip",
      personality: "balanced",
      rarity: RarityDTO.COMMON,
      baseStats: {
        intelligence: 50,
        resilience: 50,
        adaptability: 50,
      },
      specialTrait: "versatile",
      experiences: [],
      learningRate: 0.5,
      version: 1,
      createdAt: this.getCurrentTimestamp(),
      updatedAt: this.getCurrentTimestamp(),
    };

    return this.mergeDefaults(defaults, overrides);
  }

  public createFromData(data: any): SoulChipDTO {
    return {
      id: data.id || this.generateId(),
      userId: data.userId || "",
      name: data.name || "Unnamed Soul Chip",
      personality: data.personality || "balanced",
      rarity: data.rarity || RarityDTO.COMMON,
      baseStats: {
        intelligence: data.baseStats?.intelligence || 50,
        resilience: data.baseStats?.resilience || 50,
        adaptability: data.baseStats?.adaptability || 50,
      },
      specialTrait: data.specialTrait || "versatile",
      experiences: data.experiences || [],
      learningRate: data.learningRate || 0.5,
      version: data.version || 1,
      description: data.description,
      source: data.source,
      tags: data.tags,
      metadata: data.metadata,
      createdAt: data.createdAt || this.getCurrentTimestamp(),
      updatedAt: data.updatedAt || this.getCurrentTimestamp(),
    };
  }

  public validate(dto: SoulChipDTO): ValidationResult {
    const errors: ValidationError[] = [];

    // Required fields
    errors.push(
      ...this.validateRequired(dto, [
        "id",
        "userId",
        "name",
        "personality",
        "rarity",
      ])
    );

    // String validations
    if (dto.name) {
      errors.push(...this.validateStringLength(dto.name, "name", 1, 100));
    }

    if (dto.personality) {
      errors.push(
        ...this.validateStringLength(dto.personality, "personality", 1, 200)
      );
    }

    // Enum validations
    errors.push(
      ...this.validateEnum(dto.rarity, "rarity", Object.values(RarityDTO))
    );

    // Base stats validation
    if (dto.baseStats) {
      errors.push(
        ...this.validateNumberRange(
          dto.baseStats.intelligence,
          "baseStats.intelligence",
          0,
          100
        )
      );
      errors.push(
        ...this.validateNumberRange(
          dto.baseStats.resilience,
          "baseStats.resilience",
          0,
          100
        )
      );
      errors.push(
        ...this.validateNumberRange(
          dto.baseStats.adaptability,
          "baseStats.adaptability",
          0,
          100
        )
      );
    }

    // Learning rate validation
    errors.push(
      ...this.validateNumberRange(dto.learningRate, "learningRate", 0, 1)
    );

    return { isValid: errors.length === 0, errors };
  }
}
