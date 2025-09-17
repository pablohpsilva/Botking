import { BaseDTOFactory } from "../base/base-factory";
import {
  UserInventoryDTO,
  CreateUserInventoryDTO,
  UpdateUserInventoryDTO,
} from "../../interfaces/artifact-dto";
import { ValidationResult, ValidationError } from "../../interfaces/base-dto";

/**
 * UserInventory DTO Factory
 */
export class UserInventoryDTOFactory extends BaseDTOFactory<UserInventoryDTO> {
  public createDefault(
    overrides?: Partial<UserInventoryDTO>
  ): UserInventoryDTO {
    const now = this.getCurrentTimestamp();
    return {
      id: this.generateId(),
      userId: "",
      itemId: "",
      quantity: 1,
      acquiredAt: now,
      expiresAt: null,
      metadata: null,
      createdAt: now,
      updatedAt: now,
      ...overrides,
    };
  }

  public createFromData(data: any): UserInventoryDTO {
    return {
      id: data.id || this.generateId(),
      userId: data.userId || "",
      itemId: data.itemId || "",
      quantity: Number(data.quantity) || 1,
      acquiredAt: data.acquiredAt ? new Date(data.acquiredAt) : new Date(),
      expiresAt: data.expiresAt ? new Date(data.expiresAt) : null,
      metadata: data.metadata || undefined,
      createdAt: data.createdAt ? new Date(data.createdAt) : new Date(),
      updatedAt: data.updatedAt ? new Date(data.updatedAt) : new Date(),
    };
  }

  public createFromCreateDTO(data: CreateUserInventoryDTO): UserInventoryDTO {
    const now = this.getCurrentTimestamp();
    return {
      id: this.generateId(),
      userId: data.userId,
      itemId: data.itemId,
      quantity: data.quantity || 1,
      acquiredAt: now,
      expiresAt: data.expiresAt || null,
      metadata: data.metadata || undefined,
      createdAt: now,
      updatedAt: now,
    };
  }

  public updateFromDTO(
    existing: UserInventoryDTO,
    data: UpdateUserInventoryDTO
  ): UserInventoryDTO {
    return {
      ...existing,
      quantity: data.quantity !== undefined ? data.quantity : existing.quantity,
      expiresAt:
        data.expiresAt !== undefined ? data.expiresAt : existing.expiresAt,
      metadata: data.metadata !== undefined ? data.metadata : existing.metadata,
      updatedAt: this.getCurrentTimestamp(),
    };
  }

  public validate(dto: UserInventoryDTO): ValidationResult {
    const errors: ValidationError[] = [];

    if (!dto.userId || dto.userId.trim().length === 0) {
      errors.push({
        field: "userId",
        message: "User ID is required",
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

    if (dto.quantity < 0) {
      errors.push({
        field: "quantity",
        message: "Quantity must be non-negative",
        code: "INVALID_VALUE",
      });
    }

    if (dto.quantity > 999999) {
      errors.push({
        field: "quantity",
        message: "Quantity cannot exceed 999,999",
        code: "INVALID_VALUE",
      });
    }

    if (dto.expiresAt && dto.expiresAt <= new Date()) {
      errors.push({
        field: "expiresAt",
        message: "Expiration date must be in the future",
        code: "INVALID_VALUE",
      });
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}
