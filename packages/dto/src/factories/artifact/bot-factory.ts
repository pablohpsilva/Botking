import { BaseDTOFactory } from "../base/base-factory";
import { BotDTO } from "../../interfaces/artifact-dto";
import { ValidationResult, ValidationError } from "../../interfaces/base-dto";

/**
 * Bot DTO Factory
 */
export class BotDTOFactory extends BaseDTOFactory<BotDTO> {
  public createDefault(overrides?: Partial<BotDTO>): BotDTO {
    const defaults: BotDTO = {
      id: this.generateId(),
      name: "Default Bot",
      botType: "WORKER" as any, // Default bot type
      userId: "",
      combatRole: null,
      utilitySpec: null,
      governmentType: null,
      soulChipId: "",
      skeletonId: "",
      partIds: [],
      expansionChipIds: [],
      stateId: "",
      assemblyVersion: 1,
      assemblyDate: this.getCurrentTimestamp(),
      lastModified: this.getCurrentTimestamp(),
      version: 1,
      createdAt: this.getCurrentTimestamp(),
      updatedAt: this.getCurrentTimestamp(),
    };

    return this.mergeDefaults(defaults, overrides);
  }

  public createFromData(data: any): BotDTO {
    return {
      id: data.id || this.generateId(),
      name: data.name || "Unnamed Bot",
      botType: data.botType || "WORKER",
      userId: data.userId || "",
      combatRole: data.combatRole || null,
      utilitySpec: data.utilitySpec || null,
      governmentType: data.governmentType || null,
      soulChipId: data.soulChipId || "",
      skeletonId: data.skeletonId || "",
      partIds: data.partIds || [],
      expansionChipIds: data.expansionChipIds || [],
      stateId: data.stateId || "",
      assemblyVersion: data.assemblyVersion || 1,
      assemblyDate: data.assemblyDate || this.getCurrentTimestamp(),
      lastModified: data.lastModified || this.getCurrentTimestamp(),
      soulChip: data.soulChip,
      skeleton: data.skeleton,
      parts: data.parts,
      expansionChips: data.expansionChips,
      state: data.state,
      totalStats: data.totalStats,
      overallRating: data.overallRating,
      buildType: data.buildType,
      version: data.version || 1,
      description: data.description,
      source: data.source,
      tags: data.tags,
      metadata: data.metadata,
      createdAt: data.createdAt || this.getCurrentTimestamp(),
      updatedAt: data.updatedAt || this.getCurrentTimestamp(),
    };
  }

  public validate(dto: BotDTO): ValidationResult {
    const errors: ValidationError[] = [];

    // Required fields
    errors.push(
      ...this.validateRequired(dto, [
        "id",
        "userId",
        "name",
        "soulChipId",
        "skeletonId",
        "stateId",
      ])
    );

    // String validations
    if (dto.name) {
      errors.push(...this.validateStringLength(dto.name, "name", 1, 100));
    }

    // Array validations
    if (dto.partIds && dto.partIds.length > 20) {
      errors.push({
        field: "partIds",
        message: "Bot cannot have more than 20 parts",
        code: "MAX_PARTS",
        value: dto.partIds.length,
      });
    }

    if (dto.expansionChipIds && dto.expansionChipIds.length > 10) {
      errors.push({
        field: "expansionChipIds",
        message: "Bot cannot have more than 10 expansion chips",
        code: "MAX_CHIPS",
        value: dto.expansionChipIds.length,
      });
    }

    return { isValid: errors.length === 0, errors };
  }
}
