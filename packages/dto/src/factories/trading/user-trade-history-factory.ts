import { BaseDTOFactory } from "../base/base-factory";
import {
  UserTradeHistoryDTO,
  CreateUserTradeHistoryDTO,
  UpdateUserTradeHistoryDTO,
} from "../../interfaces/artifact-dto";
import { ValidationResult, ValidationError } from "../../interfaces/base-dto";

/**
 * User Trade History DTO Factory
 */
export class UserTradeHistoryDTOFactory extends BaseDTOFactory<UserTradeHistoryDTO> {
  public createDefault(
    overrides?: Partial<UserTradeHistoryDTO>
  ): UserTradeHistoryDTO {
    const now = this.getCurrentTimestamp().toISOString();
    return {
      id: this.generateId(),
      userId: "",
      tradingEventId: "",
      tradeOfferId: "",
      executedAt: now,
      itemsGiven: [],
      itemsReceived: [],
      userLevel: null,
      version: 1,
      source: undefined,
      metadata: undefined,
      ...overrides,
    };
  }

  public createFromData(data: any): UserTradeHistoryDTO {
    return {
      id: data.id || this.generateId(),
      userId: data.userId || "",
      tradingEventId: data.tradingEventId || "",
      tradeOfferId: data.tradeOfferId || "",
      executedAt: data.executedAt
        ? new Date(data.executedAt).toISOString()
        : this.getCurrentTimestamp().toISOString(),
      itemsGiven: data.itemsGiven || [],
      itemsReceived: data.itemsReceived || [],
      userLevel: data.userLevel ? Number(data.userLevel) : null,
      version: Number(data.version) || 1,
      source: data.source || undefined,
      metadata: data.metadata || undefined,
    };
  }

  public createFromCreateDTO(
    data: CreateUserTradeHistoryDTO
  ): UserTradeHistoryDTO {
    return {
      id: this.generateId(),
      userId: data.userId,
      tradingEventId: data.tradingEventId,
      tradeOfferId: data.tradeOfferId,
      executedAt: data.executedAt || this.getCurrentTimestamp().toISOString(),
      itemsGiven: data.itemsGiven,
      itemsReceived: data.itemsReceived,
      userLevel: data.userLevel || null,
      version: 1,
      source: undefined,
      metadata: data.metadata || undefined,
    };
  }

  public validate(dto: UserTradeHistoryDTO): ValidationResult {
    const errors: ValidationError[] = [];

    if (!dto.userId || dto.userId.trim().length === 0) {
      errors.push({
        field: "userId",
        message: "User ID is required",
        code: "REQUIRED",
      });
    }

    if (!dto.tradingEventId || dto.tradingEventId.trim().length === 0) {
      errors.push({
        field: "tradingEventId",
        message: "Trading event ID is required",
        code: "REQUIRED",
      });
    }

    if (!dto.tradeOfferId || dto.tradeOfferId.trim().length === 0) {
      errors.push({
        field: "tradeOfferId",
        message: "Trade offer ID is required",
        code: "REQUIRED",
      });
    }

    if (
      dto.userLevel !== null &&
      dto.userLevel !== undefined &&
      dto.userLevel < 1
    ) {
      errors.push({
        field: "userLevel",
        message: "User level must be 1 or greater",
        code: "INVALID_VALUE",
      });
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}
