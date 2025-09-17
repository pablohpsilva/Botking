import { BaseDTOFactory } from "../base/base-factory";
import {
  TradeOfferItemDTO,
  CreateTradeOfferItemDTO,
  TradeItemTypeDTO,
} from "../../interfaces/artifact-dto";
import { ValidationResult, ValidationError } from "../../interfaces/base-dto";

/**
 * Trade Offer Item DTO Factory
 */
export class TradeOfferItemDTOFactory extends BaseDTOFactory<TradeOfferItemDTO> {
  public createDefault(
    overrides?: Partial<TradeOfferItemDTO>
  ): TradeOfferItemDTO {
    const now = this.getCurrentTimestamp().toISOString();
    return {
      id: this.generateId(),
      tradeOfferId: "",
      itemId: "",
      itemType: TradeItemTypeDTO.REQUIRED,
      quantity: 1,
      minLevel: null,
      version: 1,
      source: undefined,
      metadata: undefined,
      createdAt: now,
      updatedAt: now,
      ...overrides,
    };
  }

  public createFromData(data: any): TradeOfferItemDTO {
    return {
      id: data.id || this.generateId(),
      tradeOfferId: data.tradeOfferId || "",
      itemId: data.itemId || "",
      itemType: data.itemType || TradeItemTypeDTO.REQUIRED,
      quantity: Number(data.quantity) || 1,
      minLevel: data.minLevel ? Number(data.minLevel) : null,
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

  public createFromCreateDTO(data: CreateTradeOfferItemDTO): TradeOfferItemDTO {
    const now = this.getCurrentTimestamp().toISOString();
    return {
      id: this.generateId(),
      tradeOfferId: data.tradeOfferId,
      itemId: data.itemId,
      itemType: data.itemType,
      quantity: data.quantity,
      minLevel: data.minLevel || null,
      version: 1,
      source: undefined,
      metadata: data.metadata || undefined,
      createdAt: now,
      updatedAt: now,
    };
  }

  public validate(dto: TradeOfferItemDTO): ValidationResult {
    const errors: ValidationError[] = [];

    if (!dto.tradeOfferId || dto.tradeOfferId.trim().length === 0) {
      errors.push({
        field: "tradeOfferId",
        message: "Trade offer ID is required",
        code: "REQUIRED",
      });
    }

    if (!dto.itemId || dto.itemId.trim().length === 0) {
      errors.push({
        field: "itemId",
        message: "Item ID is required",
        code: "REQUIRED",
      });
    }

    if (dto.quantity <= 0) {
      errors.push({
        field: "quantity",
        message: "Quantity must be positive",
        code: "INVALID_VALUE",
      });
    }

    if (
      dto.minLevel !== null &&
      dto.minLevel !== undefined &&
      dto.minLevel < 1
    ) {
      errors.push({
        field: "minLevel",
        message: "Minimum level must be 1 or greater",
        code: "INVALID_VALUE",
      });
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}
