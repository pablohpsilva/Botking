/**
 * Auto-sync DTO Factory using Prisma + Zod schemas
 * This factory is always in sync with the database schema
 */

import { z } from "zod";
import {
  // Import create schemas from DB package (auto-generated)
  CreateSoulChipSchema,
  CreateSkeletonSchema,
  CreatePartSchema,
  CreateExpansionChipSchema,
  CreateBotStateSchema,
  CreateBotSchema,
  CreateCollectionSchema,

  // Import update schemas
  UpdateSoulChipSchema,
  UpdateSkeletonSchema,
  UpdatePartSchema,
  UpdateExpansionChipSchema,
  UpdateBotStateSchema,
  UpdateBotSchema,
  UpdateCollectionSchema,

  // Import types
  type CreateSoulChipDTO,
  type CreateSkeletonDTO,
  type CreatePartDTO,
  type CreateExpansionChipDTO,
  type CreateBotStateDTO,
  type CreateBotDTO,
  type CreateCollectionDTO,
  type UpdateSoulChipDTO,
  type UpdateSkeletonDTO,
  type UpdatePartDTO,
  type UpdateExpansionChipDTO,
  type UpdateBotStateDTO,
  type UpdateBotDTO,
  type UpdateCollectionDTO,

  // Business validation schemas
  SoulChipStatsSchema,
  PartStatsSchema,
  BotAssemblySchema,
  BotTypeValidationSchema,
  type BotAssemblyDTO,
  type BotTypeValidationDTO,

  // Enum schemas
  RaritySchema,
  SkeletonTypeSchema,
  BotTypeSchema,
  PartCategorySchema,
  ExpansionChipEffectSchema,
  BotLocationSchema,
} from "@botking/db";

export interface ValidationResult<T = any> {
  success: boolean;
  data?: T;
  errors?: ValidationError[];
}

export interface ValidationError {
  field: string;
  message: string;
  code: string;
}

// Re-export types for easy access
export type { BotTypeValidationDTO };

/**
 * Auto-sync DTO Factory that leverages Prisma + Zod schemas
 * Always stays in sync with database schema changes
 */
export class AutoSyncDTOFactory {
  /**
   * Validate and create a SoulChip DTO
   */
  static createSoulChip(data: unknown): ValidationResult<CreateSoulChipDTO> {
    try {
      const validated = CreateSoulChipSchema.parse(data);

      // Additional business validation
      const statsResult = SoulChipStatsSchema.safeParse({
        intelligence: validated.intelligence,
        resilience: validated.resilience,
        adaptability: validated.adaptability,
      });

      if (!statsResult.success) {
        return {
          success: false,
          errors: statsResult.error.issues.map((err: any) => ({
            field: err.path.join("."),
            message: err.message,
            code: "BUSINESS_RULE_VIOLATION",
          })),
        };
      }

      return { success: true, data: validated };
    } catch (error) {
      if (error instanceof z.ZodError) {
        return {
          success: false,
          errors: error.issues.map((err: any) => ({
            field: err.path.join("."),
            message: err.message,
            code: err.code,
          })),
        };
      }
      throw error;
    }
  }

  /**
   * Validate and create a Skeleton DTO
   */
  static createSkeleton(data: unknown): ValidationResult<CreateSkeletonDTO> {
    try {
      const validated = CreateSkeletonSchema.parse(data);
      return { success: true, data: validated };
    } catch (error) {
      if (error instanceof z.ZodError) {
        return {
          success: false,
          errors: error.issues.map((err: any) => ({
            field: err.path.join("."),
            message: err.message,
            code: err.code,
          })),
        };
      }
      throw error;
    }
  }

  /**
   * Validate and create a Part DTO
   */
  static createPart(data: unknown): ValidationResult<CreatePartDTO> {
    try {
      const validated = CreatePartSchema.parse(data);

      // Additional business validation for part stats
      const statsResult = PartStatsSchema.safeParse({
        attack: validated.attack,
        defense: validated.defense,
        speed: validated.speed,
        perception: validated.perception,
      });

      if (!statsResult.success) {
        return {
          success: false,
          errors: statsResult.error.issues.map((err: any) => ({
            field: err.path.join("."),
            message: err.message,
            code: "BUSINESS_RULE_VIOLATION",
          })),
        };
      }

      return { success: true, data: validated };
    } catch (error) {
      if (error instanceof z.ZodError) {
        return {
          success: false,
          errors: error.issues.map((err: any) => ({
            field: err.path.join("."),
            message: err.message,
            code: err.code,
          })),
        };
      }
      throw error;
    }
  }

  /**
   * Validate and create an ExpansionChip DTO
   */
  static createExpansionChip(
    data: unknown
  ): ValidationResult<CreateExpansionChipDTO> {
    try {
      const validated = CreateExpansionChipSchema.parse(data);
      return { success: true, data: validated };
    } catch (error) {
      if (error instanceof z.ZodError) {
        return {
          success: false,
          errors: error.issues.map((err: any) => ({
            field: err.path.join("."),
            message: err.message,
            code: err.code,
          })),
        };
      }
      throw error;
    }
  }

  /**
   * Validate and create a BotState DTO
   */
  static createBotState(data: unknown): ValidationResult<CreateBotStateDTO> {
    // Use the validateBotState method for consistency
    return this.validateBotState(data);
  }

  /**
   * Validate and create a Bot DTO
   */
  static createBot(data: unknown): ValidationResult<CreateBotDTO> {
    try {
      const validated = CreateBotSchema.parse(data);
      return { success: true, data: validated };
    } catch (error) {
      if (error instanceof z.ZodError) {
        return {
          success: false,
          errors: error.issues.map((err: any) => ({
            field: err.path.join("."),
            message: err.message,
            code: err.code,
          })),
        };
      }
      throw error;
    }
  }

  /**
   * Validate and create a Collection DTO
   */
  static createCollection(
    data: unknown
  ): ValidationResult<CreateCollectionDTO> {
    try {
      const validated = CreateCollectionSchema.parse(data);
      return { success: true, data: validated };
    } catch (error) {
      if (error instanceof z.ZodError) {
        return {
          success: false,
          errors: error.issues.map((err: any) => ({
            field: err.path.join("."),
            message: err.message,
            code: err.code,
          })),
        };
      }
      throw error;
    }
  }

  /**
   * Validate a complete bot assembly (advanced business logic)
   */
  static validateBotAssembly(data: unknown): ValidationResult<BotAssemblyDTO> {
    try {
      const validated = BotAssemblySchema.parse(data);
      return { success: true, data: validated };
    } catch (error) {
      if (error instanceof z.ZodError) {
        return {
          success: false,
          errors: error.issues.map((err: any) => ({
            field: err.path.join("."),
            message: err.message,
            code: err.code,
          })),
        };
      }
      throw error;
    }
  }

  /**
   * Validate bot type rules (ownership and player assignment constraints)
   */
  static validateBotType(
    data: unknown
  ): ValidationResult<BotTypeValidationDTO> {
    try {
      const validated = BotTypeValidationSchema.parse(data);
      return { success: true, data: validated };
    } catch (error) {
      if (error instanceof z.ZodError) {
        return {
          success: false,
          errors: error.issues.map((err: any) => ({
            field: err.path.join("."),
            message: err.message,
            code: err.code,
          })),
        };
      }
      throw error;
    }
  }

  /**
   * Update validation methods
   */
  static updateSoulChip(data: unknown): ValidationResult<UpdateSoulChipDTO> {
    try {
      const validated = UpdateSoulChipSchema.parse(data);
      return { success: true, data: validated };
    } catch (error) {
      if (error instanceof z.ZodError) {
        return {
          success: false,
          errors: error.issues.map((err: any) => ({
            field: err.path.join("."),
            message: err.message,
            code: err.code,
          })),
        };
      }
      throw error;
    }
  }

  static updateSkeleton(data: unknown): ValidationResult<UpdateSkeletonDTO> {
    try {
      const validated = UpdateSkeletonSchema.parse(data);
      return { success: true, data: validated };
    } catch (error) {
      if (error instanceof z.ZodError) {
        return {
          success: false,
          errors: error.issues.map((err: any) => ({
            field: err.path.join("."),
            message: err.message,
            code: err.code,
          })),
        };
      }
      throw error;
    }
  }

  static updatePart(data: unknown): ValidationResult<UpdatePartDTO> {
    try {
      const validated = UpdatePartSchema.parse(data);
      return { success: true, data: validated };
    } catch (error) {
      if (error instanceof z.ZodError) {
        return {
          success: false,
          errors: error.issues.map((err: any) => ({
            field: err.path.join("."),
            message: err.message,
            code: err.code,
          })),
        };
      }
      throw error;
    }
  }

  static updateExpansionChip(
    data: unknown
  ): ValidationResult<UpdateExpansionChipDTO> {
    try {
      const validated = UpdateExpansionChipSchema.parse(data);
      return { success: true, data: validated };
    } catch (error) {
      if (error instanceof z.ZodError) {
        return {
          success: false,
          errors: error.issues.map((err: any) => ({
            field: err.path.join("."),
            message: err.message,
            code: err.code,
          })),
        };
      }
      throw error;
    }
  }

  static updateBotState(data: unknown): ValidationResult<UpdateBotStateDTO> {
    try {
      const validated = UpdateBotStateSchema.parse(data);
      return { success: true, data: validated };
    } catch (error) {
      if (error instanceof z.ZodError) {
        return {
          success: false,
          errors: error.issues.map((err: any) => ({
            field: err.path.join("."),
            message: err.message,
            code: err.code,
          })),
        };
      }
      throw error;
    }
  }

  /**
   * Validate bot state with business rules
   */
  static validateBotState(data: unknown): ValidationResult<any> {
    try {
      // First, validate basic schema
      const validated = CreateBotStateSchema.parse(data);

      // Apply business rules based on state type
      const errors: ValidationError[] = [];

      if (validated.stateType === "worker") {
        // Worker bots cannot have certain non-worker fields
        if ("bondLevel" in validated && validated.bondLevel !== undefined) {
          errors.push({
            field: "bondLevel",
            message: "Worker bots cannot have bond level",
          });
        }

        if ("battlesWon" in validated && validated.battlesWon !== undefined) {
          errors.push({
            field: "battlesWon",
            message: "Worker bots cannot have battle statistics",
          });
        }

        if ("battlesLost" in validated && validated.battlesLost !== undefined) {
          errors.push({
            field: "battlesLost",
            message: "Worker bots cannot have battle statistics",
          });
        }

        if (
          "totalBattles" in validated &&
          validated.totalBattles !== undefined
        ) {
          errors.push({
            field: "totalBattles",
            message: "Worker bots cannot have battle statistics",
          });
        }
      }

      if (validated.stateType === "non-worker") {
        // Non-worker bots battle statistics validation
        if (
          "battlesWon" in validated &&
          "battlesLost" in validated &&
          "totalBattles" in validated
        ) {
          const won = validated.battlesWon || 0;
          const lost = validated.battlesLost || 0;
          const total = validated.totalBattles || 0;

          if (total < won + lost) {
            errors.push({
              field: "totalBattles",
              message:
                "Total battles must be greater than or equal to won + lost battles",
            });
          }
        }

        // Bond level validation for non-worker bots
        if ("bondLevel" in validated && validated.bondLevel !== undefined) {
          if (validated.bondLevel < 0 || validated.bondLevel > 100) {
            errors.push({
              field: "bondLevel",
              message: "Bond level must be between 0 and 100",
            });
          }
        }
      }

      // Energy level validation
      if ("energyLevel" in validated && validated.energyLevel !== undefined) {
        if (validated.energyLevel < 0 || validated.energyLevel > 100) {
          errors.push({
            field: "energyLevel",
            message: "Energy level must be between 0 and 100",
          });
        }
      }

      // Maintenance level validation
      if (
        "maintenanceLevel" in validated &&
        validated.maintenanceLevel !== undefined
      ) {
        if (
          validated.maintenanceLevel < 0 ||
          validated.maintenanceLevel > 100
        ) {
          errors.push({
            field: "maintenanceLevel",
            message: "Maintenance level must be between 0 and 100",
          });
        }
      }

      if (errors.length > 0) {
        return {
          success: false,
          errors,
        };
      }

      return { success: true, data: validated };
    } catch (error) {
      if (error instanceof z.ZodError) {
        return {
          success: false,
          errors: error.issues.map((err: any) => ({
            field: err.path.join("."),
            message: err.message,
            code: err.code,
          })),
        };
      }
      throw error;
    }
  }

  static updateBot(data: unknown): ValidationResult<UpdateBotDTO> {
    try {
      const validated = UpdateBotSchema.parse(data);
      return { success: true, data: validated };
    } catch (error) {
      if (error instanceof z.ZodError) {
        return {
          success: false,
          errors: error.issues.map((err: any) => ({
            field: err.path.join("."),
            message: err.message,
            code: err.code,
          })),
        };
      }
      throw error;
    }
  }

  static updateCollection(
    data: unknown
  ): ValidationResult<UpdateCollectionDTO> {
    try {
      const validated = UpdateCollectionSchema.parse(data);
      return { success: true, data: validated };
    } catch (error) {
      if (error instanceof z.ZodError) {
        return {
          success: false,
          errors: error.issues.map((err: any) => ({
            field: err.path.join("."),
            message: err.message,
            code: err.code,
          })),
        };
      }
      throw error;
    }
  }

  /**
   * Enum validation helpers
   */
  static validateRarity(value: unknown): ValidationResult<string> {
    try {
      const validated = RaritySchema.parse(value);
      return { success: true, data: validated };
    } catch (error) {
      if (error instanceof z.ZodError) {
        return {
          success: false,
          errors: error.issues.map((err: any) => ({
            field: err.path.join("."),
            message: err.message,
            code: err.code,
          })),
        };
      }
      throw error;
    }
  }

  static validateSkeletonType(value: unknown): ValidationResult<string> {
    try {
      const validated = SkeletonTypeSchema.parse(value);
      return { success: true, data: validated };
    } catch (error) {
      if (error instanceof z.ZodError) {
        return {
          success: false,
          errors: error.issues.map((err: any) => ({
            field: err.path.join("."),
            message: err.message,
            code: err.code,
          })),
        };
      }
      throw error;
    }
  }

  static validatePartCategory(value: unknown): ValidationResult<string> {
    try {
      const validated = PartCategorySchema.parse(value);
      return { success: true, data: validated };
    } catch (error) {
      if (error instanceof z.ZodError) {
        return {
          success: false,
          errors: error.issues.map((err: any) => ({
            field: err.path.join("."),
            message: err.message,
            code: err.code,
          })),
        };
      }
      throw error;
    }
  }

  static validateExpansionChipEffect(value: unknown): ValidationResult<string> {
    try {
      const validated = ExpansionChipEffectSchema.parse(value);
      return { success: true, data: validated };
    } catch (error) {
      if (error instanceof z.ZodError) {
        return {
          success: false,
          errors: error.issues.map((err: any) => ({
            field: err.path.join("."),
            message: err.message,
            code: err.code,
          })),
        };
      }
      throw error;
    }
  }

  static validateBotLocation(value: unknown): ValidationResult<string> {
    try {
      const validated = BotLocationSchema.parse(value);
      return { success: true, data: validated };
    } catch (error) {
      if (error instanceof z.ZodError) {
        return {
          success: false,
          errors: error.issues.map((err: any) => ({
            field: err.path.join("."),
            message: err.message,
            code: err.code,
          })),
        };
      }
      throw error;
    }
  }
}

// Export types for convenience
export type {
  CreateSoulChipDTO,
  CreateSkeletonDTO,
  CreatePartDTO,
  CreateExpansionChipDTO,
  CreateBotStateDTO,
  CreateBotDTO,
  CreateCollectionDTO,
  UpdateSoulChipDTO,
  UpdateSkeletonDTO,
  UpdatePartDTO,
  UpdateExpansionChipDTO,
  UpdateBotStateDTO,
  UpdateBotDTO,
  UpdateCollectionDTO,
  BotAssemblyDTO,
};
