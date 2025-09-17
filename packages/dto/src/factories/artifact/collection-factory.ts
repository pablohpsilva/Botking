import { BaseDTOFactory } from "../base/base-factory";
import { CollectionDTO } from "../../interfaces/artifact-dto";
import { ValidationResult, ValidationError } from "../../interfaces/base-dto";

/**
 * Collection DTO Factory
 */
export class CollectionDTOFactory extends BaseDTOFactory<CollectionDTO> {
  public createDefault(overrides?: Partial<CollectionDTO>): CollectionDTO {
    const now = this.getCurrentTimestamp();
    return {
      id: this.generateId(),
      userId: "",
      name: "",
      description: "",
      type: "mixed",
      itemIds: [],
      isPublic: false,
      shareCode: undefined,
      version: 1,
      source: undefined,
      tags: [],
      metadata: undefined,
      createdAt: now,
      updatedAt: now,
      ...overrides,
    };
  }

  public createFromData(data: any): CollectionDTO {
    return {
      id: data.id || this.generateId(),
      userId: data.userId || "",
      name: data.name || "",
      description: data.description || "",
      type: data.type || "mixed",
      itemIds: Array.isArray(data.itemIds) ? data.itemIds : [],
      isPublic: Boolean(data.isPublic),
      shareCode: data.shareCode || undefined,
      version: Number(data.version) || 1,
      source: data.source || undefined,
      tags: Array.isArray(data.tags) ? data.tags : [],
      metadata: data.metadata || undefined,
      createdAt: data.createdAt ? new Date(data.createdAt) : new Date(),
      updatedAt: data.updatedAt ? new Date(data.updatedAt) : new Date(),
    };
  }

  public validate(dto: CollectionDTO): ValidationResult {
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
        message: "Collection name is required",
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
        message: "Collection description is required",
        code: "REQUIRED",
      });
    }

    const validTypes = ["bots", "parts", "chips", "skeletons", "mixed"];
    if (!validTypes.includes(dto.type)) {
      errors.push({
        field: "type",
        message: "Collection type must be one of: " + validTypes.join(", "),
        code: "INVALID_VALUE",
      });
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}
