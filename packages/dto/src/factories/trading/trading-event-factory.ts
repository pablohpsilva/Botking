import { BaseDTOFactory } from "../base/base-factory";
import {
  TradingEventDTO,
  CreateTradingEventDTO,
  UpdateTradingEventDTO,
  TradingEventStatusDTO,
} from "../../interfaces/artifact-dto";
import { ValidationResult, ValidationError } from "../../interfaces/base-dto";

/**
 * Trading Event DTO Factory
 */
export class TradingEventDTOFactory extends BaseDTOFactory<TradingEventDTO> {
  public createDefault(overrides?: Partial<TradingEventDTO>): TradingEventDTO {
    const now = this.getCurrentTimestamp().toISOString();
    return {
      id: this.generateId(),
      name: "",
      description: undefined,
      status: TradingEventStatusDTO.DRAFT,
      startDate: null,
      endDate: null,
      isRepeatable: false,
      maxTradesPerUser: null,
      priority: 0,
      tags: [],
      imageUrl: null,
      createdBy: null,
      isPublic: true,
      version: 1,
      source: undefined,
      metadata: undefined,
      createdAt: now,
      updatedAt: now,
      ...overrides,
    };
  }

  public createFromData(data: any): TradingEventDTO {
    return {
      id: data.id || this.generateId(),
      name: data.name || "",
      description: data.description || undefined,
      status: data.status || TradingEventStatusDTO.DRAFT,
      startDate: data.startDate ? new Date(data.startDate).toISOString() : null,
      endDate: data.endDate ? new Date(data.endDate).toISOString() : null,
      isRepeatable: Boolean(data.isRepeatable || false),
      maxTradesPerUser: data.maxTradesPerUser
        ? Number(data.maxTradesPerUser)
        : null,
      priority: Number(data.priority) || 0,
      tags: Array.isArray(data.tags) ? data.tags : [],
      imageUrl: data.imageUrl || null,
      createdBy: data.createdBy || null,
      isPublic: Boolean(data.isPublic !== undefined ? data.isPublic : true),
      version: Number(data.version) || 1,
      source: data.source || undefined,
      metadata: data.metadata || undefined,
      createdAt: data.createdAt
        ? new Date(data.createdAt).toISOString()
        : this.getCurrentTimestamp().toISOString(),
      updatedAt: data.updatedAt
        ? new Date(data.updatedAt).toISOString()
        : this.getCurrentTimestamp().toISOString(),
    };
  }

  public createFromCreateDTO(data: CreateTradingEventDTO): TradingEventDTO {
    const now = this.getCurrentTimestamp().toISOString();
    return {
      id: this.generateId(),
      name: data.name,
      description: data.description || undefined,
      status: data.status || TradingEventStatusDTO.DRAFT,
      startDate: data.startDate || null,
      endDate: data.endDate || null,
      isRepeatable: data.isRepeatable || false,
      maxTradesPerUser: data.maxTradesPerUser || null,
      priority: data.priority || 0,
      tags: data.tags || [],
      imageUrl: data.imageUrl || null,
      createdBy: data.createdBy || null,
      isPublic: data.isPublic !== undefined ? data.isPublic : true,
      version: 1,
      source: undefined,
      metadata: data.metadata || undefined,
      createdAt: now,
      updatedAt: now,
    };
  }

  public validate(dto: TradingEventDTO): ValidationResult {
    const errors: ValidationError[] = [];

    if (!dto.name || dto.name.trim().length === 0) {
      errors.push({
        field: "name",
        message: "Trading event name is required",
        code: "REQUIRED",
      });
    }

    if (dto.name && dto.name.length > 100) {
      errors.push({
        field: "name",
        message: "Trading event name cannot exceed 100 characters",
        code: "INVALID_LENGTH",
      });
    }

    if (dto.startDate && dto.endDate) {
      const start = new Date(dto.startDate);
      const end = new Date(dto.endDate);
      if (start >= end) {
        errors.push({
          field: "endDate",
          message: "End date must be after start date",
          code: "INVALID_VALUE",
        });
      }
    }

    if (
      dto.maxTradesPerUser !== null &&
      dto.maxTradesPerUser !== undefined &&
      dto.maxTradesPerUser <= 0
    ) {
      errors.push({
        field: "maxTradesPerUser",
        message: "Max trades per user must be positive",
        code: "INVALID_VALUE",
      });
    }

    if (dto.priority < 0) {
      errors.push({
        field: "priority",
        message: "Priority cannot be negative",
        code: "INVALID_VALUE",
      });
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}
