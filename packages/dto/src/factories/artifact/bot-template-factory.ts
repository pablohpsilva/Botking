import { BaseDTOFactory } from "../base/base-factory";
import { BotTemplateDTO } from "../../interfaces/artifact-dto";
import { ValidationResult, ValidationError } from "../../interfaces/base-dto";

/**
 * BotTemplate DTO Factory
 */
export class BotTemplateDTOFactory extends BaseDTOFactory<BotTemplateDTO> {
  public createDefault(overrides?: Partial<BotTemplateDTO>): BotTemplateDTO {
    const now = this.getCurrentTimestamp();
    return {
      id: this.generateId(),
      userId: "",
      name: "",
      description: "",
      buildType: "worker",
      templateData: {
        soulChipTemplate: {},
        skeletonTemplate: {},
        partTemplates: [],
        expansionChipTemplates: [],
      },
      rating: 0,
      downloads: 0,
      isPublic: false,
      version: 1,
      source: undefined,
      tags: [],
      metadata: undefined,
      createdAt: now,
      updatedAt: now,
      ...overrides,
    };
  }

  public createFromData(data: any): BotTemplateDTO {
    return {
      id: data.id || this.generateId(),
      userId: data.userId || "",
      name: data.name || "",
      description: data.description || "",
      buildType: data.buildType || "worker",
      templateData: data.templateData || {
        soulChipTemplate: data.soulChipTemplate || {},
        skeletonTemplate: data.skeletonTemplate || {},
        partTemplates: Array.isArray(data.partTemplates)
          ? data.partTemplates
          : [],
        expansionChipTemplates: Array.isArray(data.expansionChipTemplates)
          ? data.expansionChipTemplates
          : [],
      },
      rating: Number(data.rating) || 0,
      downloads: Number(data.downloads) || 0,
      isPublic: Boolean(data.isPublic),
      version: Number(data.version) || 1,
      source: data.source || undefined,
      tags: Array.isArray(data.tags) ? data.tags : [],
      metadata: data.metadata || undefined,
      createdAt: data.createdAt ? new Date(data.createdAt) : new Date(),
      updatedAt: data.updatedAt ? new Date(data.updatedAt) : new Date(),
    };
  }

  public validate(dto: BotTemplateDTO): ValidationResult {
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
        message: "Bot template name is required",
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

    if (!dto.description || dto.description.trim().length === 0) {
      errors.push({
        field: "description",
        message: "Bot template description is required",
        code: "REQUIRED",
      });
    }

    if (dto.rating < 0 || dto.rating > 5) {
      errors.push({
        field: "rating",
        message: "Rating must be between 0 and 5",
        code: "INVALID_VALUE",
      });
    }

    if (dto.downloads < 0) {
      errors.push({
        field: "downloads",
        message: "Downloads cannot be negative",
        code: "INVALID_VALUE",
      });
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}
