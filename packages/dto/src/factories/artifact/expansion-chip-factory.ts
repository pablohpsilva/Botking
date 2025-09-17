import { BaseDTOFactory } from "../base/base-factory";
import {
  ExpansionChipDTO,
  RarityDTO,
  ExpansionChipEffectDTO,
} from "../../interfaces/artifact-dto";
import { ValidationResult, ValidationError } from "../../interfaces/base-dto";

/**
 * ExpansionChip DTO Factory
 */
export class ExpansionChipDTOFactory extends BaseDTOFactory<ExpansionChipDTO> {
  public createDefault(
    overrides?: Partial<ExpansionChipDTO>
  ): ExpansionChipDTO {
    const now = this.getCurrentTimestamp();
    return {
      id: this.generateId(),
      userId: "",
      name: "",
      effect: ExpansionChipEffectDTO.STAT_BOOST,
      rarity: RarityDTO.COMMON,
      upgradeLevel: 0,
      effectMagnitude: 1.0,
      energyCost: 5,
      version: 1,
      source: undefined,
      tags: [],
      description: undefined,
      metadata: undefined,
      createdAt: now,
      updatedAt: now,
      ...overrides,
    };
  }

  public createFromData(data: any): ExpansionChipDTO {
    return {
      id: data.id || this.generateId(),
      userId: data.userId || "",
      name: data.name || "",
      effect: data.effect || ExpansionChipEffectDTO.STAT_BOOST,
      rarity: data.rarity || RarityDTO.COMMON,
      upgradeLevel: Number(data.upgradeLevel) || 0,
      effectMagnitude: Number(data.effectMagnitude) || 1.0,
      energyCost: Number(data.energyCost) || 5,
      version: Number(data.version) || 1,
      source: data.source || undefined,
      tags: Array.isArray(data.tags) ? data.tags : [],
      description: data.description || undefined,
      metadata: data.metadata || undefined,
      createdAt: data.createdAt ? new Date(data.createdAt) : new Date(),
      updatedAt: data.updatedAt ? new Date(data.updatedAt) : new Date(),
    };
  }

  public validate(dto: ExpansionChipDTO): ValidationResult {
    const errors: ValidationError[] = [];

    if (!dto.userId || dto.userId.trim().length === 0) {
      errors.push({
        field: "userId",
        message: "Owner ID is required",
        code: "REQUIRED",
      });
    }

    if (!dto.name || dto.name.trim().length === 0) {
      errors.push({
        field: "name",
        message: "Expansion chip name is required",
        code: "REQUIRED",
      });
    }

    if (dto.name && dto.name.length > 100) {
      errors.push({
        field: "name",
        message: "Name cannot exceed 100 characters",
        code: "INVALID_VALUE",
      });
    }

    if (dto.upgradeLevel < 0) {
      errors.push({
        field: "upgradeLevel",
        message: "Upgrade level cannot be negative",
        code: "INVALID_VALUE",
      });
    }

    if (dto.upgradeLevel > 10) {
      errors.push({
        field: "upgradeLevel",
        message: "Upgrade level cannot exceed 10",
        code: "INVALID_VALUE",
      });
    }

    if (dto.effectMagnitude <= 0) {
      errors.push({
        field: "effectMagnitude",
        message: "Effect magnitude must be greater than 0",
        code: "INVALID_VALUE",
      });
    }

    if (dto.energyCost < 0) {
      errors.push({
        field: "energyCost",
        message: "Energy cost cannot be negative",
        code: "INVALID_VALUE",
      });
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}
