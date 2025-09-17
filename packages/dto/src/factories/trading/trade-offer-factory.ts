import { BaseDTOFactory } from "../base/base-factory";
import {
  TradeOfferDTO,
  CreateTradeOfferDTO,
  TradeOfferStatusDTO,
} from "../../interfaces/artifact-dto";
import { ValidationResult, ValidationError } from "../../interfaces/base-dto";

/**
 * Trade Offer DTO Factory
 */
export class TradeOfferDTOFactory extends BaseDTOFactory<TradeOfferDTO> {
  public createDefault(overrides?: Partial<TradeOfferDTO>): TradeOfferDTO {
    const now = this.getCurrentTimestamp().toISOString();
    return {
      id: this.generateId(),
      tradingEventId: "",
      name: "",
      description: undefined,
      status: TradeOfferStatusDTO.ACTIVE,
      maxTotalTrades: null,
      currentTrades: 0,
      maxPerUser: null,
      startDate: null,
      endDate: null,
      displayOrder: 0,
      isHighlighted: false,
      tags: [],
      version: 1,
      source: undefined,
      metadata: undefined,
      createdAt: now,
      updatedAt: now,
      ...overrides,
    };
  }

  public createFromData(data: any): TradeOfferDTO {
    return {
      id: data.id || this.generateId(),
      tradingEventId: data.tradingEventId || "",
      name: data.name || "",
      description: data.description || undefined,
      status: data.status || TradeOfferStatusDTO.ACTIVE,
      maxTotalTrades: data.maxTotalTrades ? Number(data.maxTotalTrades) : null,
      currentTrades: Number(data.currentTrades) || 0,
      maxPerUser: data.maxPerUser ? Number(data.maxPerUser) : null,
      startDate: data.startDate ? new Date(data.startDate).toISOString() : null,
      endDate: data.endDate ? new Date(data.endDate).toISOString() : null,
      displayOrder: Number(data.displayOrder) || 0,
      isHighlighted: Boolean(data.isHighlighted || false),
      tags: Array.isArray(data.tags) ? data.tags : [],
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

  public createFromCreateDTO(data: CreateTradeOfferDTO): TradeOfferDTO {
    const now = this.getCurrentTimestamp().toISOString();
    return {
      id: this.generateId(),
      tradingEventId: data.tradingEventId,
      name: data.name,
      description: data.description || undefined,
      status: data.status || TradeOfferStatusDTO.ACTIVE,
      maxTotalTrades: data.maxTotalTrades || null,
      currentTrades: data.currentTrades || 0,
      maxPerUser: data.maxPerUser || null,
      startDate: data.startDate || null,
      endDate: data.endDate || null,
      displayOrder: data.displayOrder || 0,
      isHighlighted: data.isHighlighted || false,
      tags: data.tags || [],
      version: 1,
      source: undefined,
      metadata: data.metadata || undefined,
      createdAt: now,
      updatedAt: now,
    };
  }

  public validate(dto: TradeOfferDTO): ValidationResult {
    const errors: ValidationError[] = [];

    if (!dto.tradingEventId || dto.tradingEventId.trim().length === 0) {
      errors.push({
        field: "tradingEventId",
        message: "Trading event ID is required",
        code: "REQUIRED",
      });
    }

    if (!dto.name || dto.name.trim().length === 0) {
      errors.push({
        field: "name",
        message: "Trade offer name is required",
        code: "REQUIRED",
      });
    }

    if (dto.name && dto.name.length > 100) {
      errors.push({
        field: "name",
        message: "Trade offer name cannot exceed 100 characters",
        code: "INVALID_LENGTH",
      });
    }

    if (
      dto.maxTotalTrades !== null &&
      dto.maxTotalTrades !== undefined &&
      dto.maxTotalTrades <= 0
    ) {
      errors.push({
        field: "maxTotalTrades",
        message: "Max total trades must be positive",
        code: "INVALID_VALUE",
      });
    }

    if (
      dto.maxPerUser !== null &&
      dto.maxPerUser !== undefined &&
      dto.maxPerUser <= 0
    ) {
      errors.push({
        field: "maxPerUser",
        message: "Max trades per user must be positive",
        code: "INVALID_VALUE",
      });
    }

    if (dto.currentTrades < 0) {
      errors.push({
        field: "currentTrades",
        message: "Current trades cannot be negative",
        code: "INVALID_VALUE",
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

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}
