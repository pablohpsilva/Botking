import { BaseDTOFactory } from "../base/base-factory";
import {
  ItemDTO,
  CreateItemDTO,
  UpdateItemDTO,
  ItemCategoryDTO,
  RarityDTO,
} from "../../interfaces/artifact-dto";
import { ValidationResult, ValidationError } from "../../interfaces/base-dto";

/**
 * Item DTO Factory
 */
export class ItemDTOFactory extends BaseDTOFactory<ItemDTO> {
  public createDefault(overrides?: Partial<ItemDTO>): ItemDTO {
    const now = this.getCurrentTimestamp();
    return {
      id: this.generateId(),
      userId: null,
      name: "",
      category: ItemCategoryDTO.RESOURCE,
      rarity: RarityDTO.COMMON,
      description: "",
      consumable: true,
      tradeable: false,
      stackable: true,
      maxStackSize: 99,
      value: 1,
      cooldownTime: 0,
      requirements: [],
      source: null,
      tags: [],
      effects: null,
      isProtected: false,
      speedUpTarget: null,
      speedMultiplier: null,
      timeReduction: null,
      resourceType: null,
      resourceAmount: null,
      enhancementType: null,
      enhancementDuration: null,
      statModifiers: null,
      gemType: null,
      gemValue: null,
      tradeHistory: null,
      version: 1,
      metadata: null,
      createdAt: now,
      updatedAt: now,
      ...overrides,
    };
  }

  public createFromData(data: any): ItemDTO {
    return {
      id: data.id || this.generateId(),
      userId: data.userId || null,
      name: data.name || "",
      category: data.category || ItemCategoryDTO.RESOURCE,
      rarity: data.rarity || RarityDTO.COMMON,
      description: data.description || "",
      consumable: Boolean(
        data.consumable !== undefined ? data.consumable : true
      ),
      tradeable: Boolean(data.tradeable || false),
      stackable: Boolean(data.stackable !== undefined ? data.stackable : true),
      maxStackSize: Number(data.maxStackSize) || 99,
      value: Number(data.value) || 1,
      cooldownTime: Number(data.cooldownTime) || 0,
      requirements: Array.isArray(data.requirements) ? data.requirements : [],
      source: data.source || undefined,
      tags: Array.isArray(data.tags) ? data.tags : [],
      effects: data.effects || null,
      isProtected: Boolean(data.isProtected || false),
      speedUpTarget: data.speedUpTarget || null,
      speedMultiplier: data.speedMultiplier
        ? Number(data.speedMultiplier)
        : null,
      timeReduction: data.timeReduction ? Number(data.timeReduction) : null,
      resourceType: data.resourceType || null,
      resourceAmount: data.resourceAmount ? Number(data.resourceAmount) : null,
      enhancementType: data.enhancementType || null,
      enhancementDuration: data.enhancementDuration || null,
      statModifiers: data.statModifiers || null,
      gemType: data.gemType || null,
      gemValue: data.gemValue ? Number(data.gemValue) : null,
      tradeHistory: data.tradeHistory || null,
      version: Number(data.version) || 1,
      metadata: data.metadata || undefined,
      createdAt: data.createdAt ? new Date(data.createdAt) : new Date(),
      updatedAt: data.updatedAt ? new Date(data.updatedAt) : new Date(),
    };
  }

  public createFromCreateDTO(data: CreateItemDTO): ItemDTO {
    const now = this.getCurrentTimestamp();
    return {
      id: this.generateId(),
      userId: data.userId || null,
      name: data.name,
      category: data.category,
      rarity: data.rarity || RarityDTO.COMMON,
      description: data.description,
      consumable: data.consumable !== undefined ? data.consumable : true,
      tradeable: data.tradeable || false,
      stackable: data.stackable !== undefined ? data.stackable : true,
      maxStackSize: data.maxStackSize || 99,
      value: data.value || 1,
      cooldownTime: data.cooldownTime || 0,
      requirements: data.requirements || [],
      source: data.source || undefined,
      tags: data.tags || [],
      effects: data.effects || null,
      isProtected: data.isProtected || false,
      speedUpTarget: data.speedUpTarget || null,
      speedMultiplier: data.speedMultiplier || null,
      timeReduction: data.timeReduction || null,
      resourceType: data.resourceType || null,
      resourceAmount: data.resourceAmount || null,
      enhancementType: data.enhancementType || null,
      enhancementDuration: data.enhancementDuration || null,
      statModifiers: data.statModifiers || null,
      gemType: data.gemType || null,
      gemValue: data.gemValue || null,
      tradeHistory: null,
      version: 1,
      metadata: data.metadata || undefined,
      createdAt: now,
      updatedAt: now,
    };
  }

  public updateFromDTO(existing: ItemDTO, data: UpdateItemDTO): ItemDTO {
    return {
      ...existing,
      name: data.name !== undefined ? data.name : existing.name,
      description:
        data.description !== undefined
          ? data.description
          : existing.description,
      consumable:
        data.consumable !== undefined ? data.consumable : existing.consumable,
      tradeable:
        data.tradeable !== undefined ? data.tradeable : existing.tradeable,
      stackable:
        data.stackable !== undefined ? data.stackable : existing.stackable,
      maxStackSize:
        data.maxStackSize !== undefined
          ? data.maxStackSize
          : existing.maxStackSize,
      value: data.value !== undefined ? data.value : existing.value,
      cooldownTime:
        data.cooldownTime !== undefined
          ? data.cooldownTime
          : existing.cooldownTime,
      requirements:
        data.requirements !== undefined
          ? data.requirements
          : existing.requirements,
      source: data.source !== undefined ? data.source : existing.source,
      tags: data.tags !== undefined ? data.tags : existing.tags,
      effects: data.effects !== undefined ? data.effects : existing.effects,
      speedUpTarget:
        data.speedUpTarget !== undefined
          ? data.speedUpTarget
          : existing.speedUpTarget,
      speedMultiplier:
        data.speedMultiplier !== undefined
          ? data.speedMultiplier
          : existing.speedMultiplier,
      timeReduction:
        data.timeReduction !== undefined
          ? data.timeReduction
          : existing.timeReduction,
      resourceType:
        data.resourceType !== undefined
          ? data.resourceType
          : existing.resourceType,
      resourceAmount:
        data.resourceAmount !== undefined
          ? data.resourceAmount
          : existing.resourceAmount,
      enhancementType:
        data.enhancementType !== undefined
          ? data.enhancementType
          : existing.enhancementType,
      enhancementDuration:
        data.enhancementDuration !== undefined
          ? data.enhancementDuration
          : existing.enhancementDuration,
      statModifiers:
        data.statModifiers !== undefined
          ? data.statModifiers
          : existing.statModifiers,
      gemType: data.gemType !== undefined ? data.gemType : existing.gemType,
      gemValue: data.gemValue !== undefined ? data.gemValue : existing.gemValue,
      tradeHistory:
        data.tradeHistory !== undefined
          ? data.tradeHistory
          : existing.tradeHistory,
      metadata: data.metadata !== undefined ? data.metadata : existing.metadata,
      updatedAt: this.getCurrentTimestamp(),
    };
  }

  public validate(dto: ItemDTO): ValidationResult {
    const errors: ValidationError[] = [];

    if (!dto.name || dto.name.trim().length === 0) {
      errors.push({
        field: "name",
        message: "Item name is required",
        code: "REQUIRED",
      });
    }

    if (dto.name && dto.name.length > 100) {
      errors.push({
        field: "name",
        message: "Item name cannot exceed 100 characters",
        code: "INVALID_VALUE",
      });
    }

    if (!dto.description || dto.description.trim().length === 0) {
      errors.push({
        field: "description",
        message: "Item description is required",
        code: "REQUIRED",
      });
    }

    if (dto.maxStackSize < 1) {
      errors.push({
        field: "maxStackSize",
        message: "Max stack size must be at least 1",
        code: "INVALID_VALUE",
      });
    }

    if (dto.value < 0) {
      errors.push({
        field: "value",
        message: "Item value cannot be negative",
        code: "INVALID_VALUE",
      });
    }

    if (dto.cooldownTime < 0) {
      errors.push({
        field: "cooldownTime",
        message: "Cooldown time cannot be negative",
        code: "INVALID_VALUE",
      });
    }

    // Category-specific validation
    if (dto.category === ItemCategoryDTO.SPEED_UP) {
      if (!dto.speedUpTarget) {
        errors.push({
          field: "speedUpTarget",
          message: "Speed up target is required for speed up items",
          code: "REQUIRED",
        });
      }
      if (!dto.speedMultiplier || dto.speedMultiplier <= 0) {
        errors.push({
          field: "speedMultiplier",
          message: "Speed multiplier must be greater than 0 for speed up items",
          code: "INVALID_VALUE",
        });
      }
    }

    if (dto.category === ItemCategoryDTO.RESOURCE) {
      if (!dto.resourceType) {
        errors.push({
          field: "resourceType",
          message: "Resource type is required for resource items",
          code: "REQUIRED",
        });
      }
      if (!dto.resourceAmount || dto.resourceAmount <= 0) {
        errors.push({
          field: "resourceAmount",
          message: "Resource amount must be greater than 0 for resource items",
          code: "INVALID_VALUE",
        });
      }
    }

    if (dto.category === ItemCategoryDTO.GEMS) {
      if (!dto.gemType) {
        errors.push({
          field: "gemType",
          message: "Gem type is required for gem items",
          code: "REQUIRED",
        });
      }
      if (!dto.gemValue || dto.gemValue <= 0) {
        errors.push({
          field: "gemValue",
          message: "Gem value must be greater than 0 for gem items",
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
