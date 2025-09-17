import { BaseDTOFactory } from "../base/base-factory";
import { BotStateDTO } from "../../interfaces/artifact-dto";
import { ValidationResult, ValidationError } from "../../interfaces/base-dto";

/**
 * BotState DTO Factory
 */
export class BotStateDTOFactory extends BaseDTOFactory<BotStateDTO> {
  public createDefault(overrides?: Partial<BotStateDTO>): BotStateDTO {
    const now = this.getCurrentTimestamp();
    return {
      id: this.generateId(),
      userId: "",
      name: "",
      stateType: "worker",
      energyLevel: 100,
      maintenanceLevel: 100,
      currentLocation: "storage" as any,
      experience: 0,
      statusEffects: [],
      customizations: {},
      // Legacy fields
      energy: 100,
      maxEnergy: 100,
      health: 100,
      maxHealth: 100,
      location: "storage" as any,
      level: 1,
      missionStats: {
        missionsCompleted: 0,
        successRate: 0,
        totalCombatTime: 0,
        damageDealt: 0,
        damageTaken: 0,
      },
      lastActiveAt: now,
      version: 1,
      source: undefined,
      tags: [],
      description: undefined,
      metadata: undefined,
      createdAt: now,
      updatedAt: now,
      ...overrides,
    } as BotStateDTO;
  }

  public createFromData(data: any): BotStateDTO {
    return {
      id: data.id || this.generateId(),
      userId: data.userId || "",
      name: data.name || "",
      stateType: data.stateType || "worker",
      energyLevel: Number(data.energyLevel) || 100,
      maintenanceLevel: Number(data.maintenanceLevel) || 100,
      currentLocation: data.currentLocation || "storage",
      experience: Number(data.experience) || 0,
      statusEffects: Array.isArray(data.statusEffects)
        ? data.statusEffects
        : [],
      customizations: data.customizations || {},
      // Legacy fields
      energy: Number(data.energy || data.energyLevel) || 100,
      maxEnergy: Number(data.maxEnergy) || 100,
      health: Number(data.health || data.maintenanceLevel) || 100,
      maxHealth: Number(data.maxHealth) || 100,
      location: data.location || data.currentLocation || "storage",
      level: Number(data.level) || 1,
      missionStats: data.missionStats || {
        missionsCompleted: 0,
        successRate: 0,
        totalCombatTime: 0,
        damageDealt: 0,
        damageTaken: 0,
      },
      lastActiveAt: data.lastActiveAt
        ? new Date(data.lastActiveAt)
        : new Date(),
      version: Number(data.version) || 1,
      source: data.source || undefined,
      tags: Array.isArray(data.tags) ? data.tags : [],
      description: data.description || undefined,
      metadata: data.metadata || undefined,
      createdAt: data.createdAt ? new Date(data.createdAt) : new Date(),
      updatedAt: data.updatedAt ? new Date(data.updatedAt) : new Date(),
    } as BotStateDTO;
  }

  public validate(dto: BotStateDTO): ValidationResult {
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
        message: "Bot state name is required",
        code: "REQUIRED",
      });
    }

    if (dto.energyLevel < 0 || dto.energyLevel > 100) {
      errors.push({
        field: "energyLevel",
        message: "Energy level must be between 0 and 100",
        code: "INVALID_VALUE",
      });
    }

    if (dto.maintenanceLevel < 0 || dto.maintenanceLevel > 100) {
      errors.push({
        field: "maintenanceLevel",
        message: "Maintenance level must be between 0 and 100",
        code: "INVALID_VALUE",
      });
    }

    if (dto.experience < 0) {
      errors.push({
        field: "experience",
        message: "Experience cannot be negative",
        code: "INVALID_VALUE",
      });
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}
