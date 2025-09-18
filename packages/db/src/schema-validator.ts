import { z } from "zod";
import { LoggerFactory } from "@botking/logger";
import * as schemas from "./schemas";

/**
 * Validation result interface
 */
export interface ValidationResult<T = any> {
  isValid: boolean;
  data?: T;
  errors: ValidationError[];
  warnings: ValidationWarning[];
}

/**
 * Validation error interface
 */
export interface ValidationError {
  field: string;
  message: string;
  code: string;
  value?: any;
}

/**
 * Validation warning interface
 */
export interface ValidationWarning {
  field: string;
  message: string;
  value?: any;
}

/**
 * SchemaValidator - Centralized validation using Zod schemas
 * Provides type-safe validation for all database entities
 */
export class SchemaValidator {
  private logger: ReturnType<typeof LoggerFactory.createPackageLogger>;
  private validationCache: Map<string, ValidationResult> = new Map();
  private cacheEnabled: boolean = false;

  constructor() {
    this.logger = LoggerFactory.createPackageLogger("db", {
      service: "schema-validator",
    });
  }

  /**
   * Enable or disable validation caching
   */
  public setCacheEnabled(enabled: boolean): void {
    this.cacheEnabled = enabled;
    if (!enabled) {
      this.clearCache();
    }
    this.logger.debug(`Validation caching ${enabled ? "enabled" : "disabled"}`);
  }

  /**
   * Clear validation cache
   */
  public clearCache(): void {
    this.validationCache.clear();
    this.logger.debug("Validation cache cleared");
  }

  // ===== BOT VALIDATION =====

  /**
   * Validate bot creation data
   */
  public validateCreateBot(data: any): ValidationResult<schemas.CreateBotDTO> {
    return this.validateWithSchema(schemas.CreateBotSchema, data, "CreateBot");
  }

  /**
   * Validate bot update data
   */
  public validateUpdateBot(data: any): ValidationResult<schemas.UpdateBotDTO> {
    return this.validateWithSchema(schemas.UpdateBotSchema, data, "UpdateBot");
  }

  /**
   * Validate bot type configuration
   */
  public validateBotType(
    data: any
  ): ValidationResult<schemas.BotTypeValidationDTO> {
    return this.validateWithSchema(
      schemas.BotTypeValidationSchema,
      data,
      "BotType"
    );
  }

  /**
   * Validate bot assembly configuration
   */
  public validateBotAssembly(
    data: any
  ): ValidationResult<schemas.BotAssemblyDTO> {
    return this.validateWithSchema(
      schemas.BotAssemblySchema,
      data,
      "BotAssembly"
    );
  }

  // ===== ITEM VALIDATION =====

  /**
   * Validate item creation data
   */
  public validateCreateItem(
    data: any
  ): ValidationResult<schemas.CreateItemDTO> {
    return this.validateWithSchema(
      schemas.CreateItemSchema,
      data,
      "CreateItem"
    );
  }

  // ===== SOUL CHIP VALIDATION =====

  /**
   * Validate soul chip creation data
   */
  public validateCreateSoulChip(
    data: any
  ): ValidationResult<schemas.CreateSoulChipDTO> {
    return this.validateWithSchema(
      schemas.CreateSoulChipSchema,
      data,
      "CreateSoulChip"
    );
  }

  /**
   * Validate soul chip update data
   */
  public validateUpdateSoulChip(
    data: any
  ): ValidationResult<schemas.UpdateSoulChipDTO> {
    return this.validateWithSchema(
      schemas.UpdateSoulChipSchema,
      data,
      "UpdateSoulChip"
    );
  }

  /**
   * Validate soul chip stats
   */
  public validateSoulChipStats(data: any): ValidationResult {
    return this.validateWithSchema(
      schemas.SoulChipStatsSchema,
      data,
      "SoulChipStats"
    );
  }

  // ===== SKELETON VALIDATION =====

  /**
   * Validate skeleton creation data
   */
  public validateCreateSkeleton(
    data: any
  ): ValidationResult<schemas.CreateSkeletonDTO> {
    return this.validateWithSchema(
      schemas.CreateSkeletonSchema,
      data,
      "CreateSkeleton"
    );
  }

  /**
   * Validate skeleton update data
   */
  public validateUpdateSkeleton(
    data: any
  ): ValidationResult<schemas.UpdateSkeletonDTO> {
    return this.validateWithSchema(
      schemas.UpdateSkeletonSchema,
      data,
      "UpdateSkeleton"
    );
  }

  // ===== PART VALIDATION =====

  /**
   * Validate part creation data
   */
  public validateCreatePart(
    data: any
  ): ValidationResult<schemas.CreatePartDTO> {
    return this.validateWithSchema(
      schemas.CreatePartSchema,
      data,
      "CreatePart"
    );
  }

  /**
   * Validate part update data
   */
  public validateUpdatePart(
    data: any
  ): ValidationResult<schemas.UpdatePartDTO> {
    return this.validateWithSchema(
      schemas.UpdatePartSchema,
      data,
      "UpdatePart"
    );
  }

  /**
   * Validate part stats
   */
  public validatePartStats(data: any): ValidationResult {
    return this.validateWithSchema(schemas.PartStatsSchema, data, "PartStats");
  }

  // ===== EXPANSION CHIP VALIDATION =====

  /**
   * Validate expansion chip creation data
   */
  public validateCreateExpansionChip(
    data: any
  ): ValidationResult<schemas.CreateExpansionChipDTO> {
    return this.validateWithSchema(
      schemas.CreateExpansionChipSchema,
      data,
      "CreateExpansionChip"
    );
  }

  /**
   * Validate expansion chip update data
   */
  public validateUpdateExpansionChip(
    data: any
  ): ValidationResult<schemas.UpdateExpansionChipDTO> {
    return this.validateWithSchema(
      schemas.UpdateExpansionChipSchema,
      data,
      "UpdateExpansionChip"
    );
  }

  // ===== BOT STATE VALIDATION =====

  /**
   * Validate bot state creation data
   */
  public validateCreateBotState(
    data: any
  ): ValidationResult<schemas.CreateBotStateDTO> {
    return this.validateWithSchema(
      schemas.CreateBotStateSchema,
      data,
      "CreateBotState"
    );
  }

  /**
   * Validate bot state update data
   */
  public validateUpdateBotState(
    data: any
  ): ValidationResult<schemas.UpdateBotStateDTO> {
    return this.validateWithSchema(
      schemas.UpdateBotStateSchema,
      data,
      "UpdateBotState"
    );
  }

  /**
   * Validate bot state type configuration
   */
  public validateBotStateType(
    data: any
  ): ValidationResult<schemas.BotStateTypeValidationDTO> {
    return this.validateWithSchema(
      schemas.BotStateTypeValidationSchema,
      data,
      "BotStateType"
    );
  }

  // ===== COLLECTION VALIDATION =====

  /**
   * Validate collection creation data
   */
  public validateCreateCollection(
    data: any
  ): ValidationResult<schemas.CreateCollectionDTO> {
    return this.validateWithSchema(
      schemas.CreateCollectionSchema,
      data,
      "CreateCollection"
    );
  }

  /**
   * Validate collection update data
   */
  public validateUpdateCollection(
    data: any
  ): ValidationResult<schemas.UpdateCollectionDTO> {
    return this.validateWithSchema(
      schemas.UpdateCollectionSchema,
      data,
      "UpdateCollection"
    );
  }

  // ===== ENUM VALIDATION =====

  /**
   * Validate rarity enum
   */
  public validateRarity(value: any): ValidationResult {
    return this.validateWithSchema(schemas.RaritySchema, value, "Rarity");
  }

  /**
   * Validate skeleton type enum
   */
  public validateSkeletonType(value: any): ValidationResult {
    return this.validateWithSchema(
      schemas.SkeletonTypeSchema,
      value,
      "SkeletonType"
    );
  }

  /**
   * Validate part category enum
   */
  public validatePartCategory(value: any): ValidationResult {
    return this.validateWithSchema(
      schemas.PartCategorySchema,
      value,
      "PartCategory"
    );
  }

  /**
   * Validate expansion chip effect enum
   */
  public validateExpansionChipEffect(value: any): ValidationResult {
    return this.validateWithSchema(
      schemas.ExpansionChipEffectSchema,
      value,
      "ExpansionChipEffect"
    );
  }

  /**
   * Validate bot location enum
   */
  public validateBotLocation(value: any): ValidationResult {
    return this.validateWithSchema(
      schemas.BotLocationSchema,
      value,
      "BotLocation"
    );
  }

  // ===== GENERIC VALIDATION METHODS =====

  /**
   * Validate data against any Zod schema
   */
  public validateWithSchema<T>(
    schema: z.ZodSchema<T>,
    data: any,
    schemaName: string
  ): ValidationResult<T> {
    const cacheKey = `${schemaName}:${JSON.stringify(data)}`;

    // Check cache if enabled
    if (this.cacheEnabled && this.validationCache.has(cacheKey)) {
      this.logger.debug(`Using cached validation result for ${schemaName}`);
      return this.validationCache.get(cacheKey)!;
    }

    try {
      this.logger.debug(`Validating ${schemaName}`, {
        dataKeys: Object.keys(data || {}),
      });

      const result = schema.safeParse(data);

      if (result.success) {
        const validationResult: ValidationResult<T> = {
          isValid: true,
          data: result.data,
          errors: [],
          warnings: [],
        };

        // Cache successful validation
        if (this.cacheEnabled) {
          this.validationCache.set(cacheKey, validationResult);
        }

        this.logger.debug(`Validation successful for ${schemaName}`);
        return validationResult;
      } else {
        const errors = this.formatZodErrors(result.error);
        const validationResult: ValidationResult<T> = {
          isValid: false,
          errors,
          warnings: [],
        };

        this.logger.warn(`Validation failed for ${schemaName}`, { errors });
        return validationResult;
      }
    } catch (error) {
      const validationResult: ValidationResult<T> = {
        isValid: false,
        errors: [
          {
            field: "unknown",
            message: `Validation error: ${(error as Error).message}`,
            code: "VALIDATION_ERROR",
            value: data,
          },
        ],
        warnings: [],
      };

      this.logger.error(`Validation exception for ${schemaName}`, { error });
      return validationResult;
    }
  }

  /**
   * Batch validate multiple items
   */
  public validateBatch<T>(
    schema: z.ZodSchema<T>,
    items: any[],
    schemaName: string
  ): { valid: ValidationResult<T>[]; invalid: ValidationResult<T>[] } {
    const valid: ValidationResult<T>[] = [];
    const invalid: ValidationResult<T>[] = [];

    for (const item of items) {
      const result = this.validateWithSchema(schema, item, schemaName);
      if (result.isValid) {
        valid.push(result);
      } else {
        invalid.push(result);
      }
    }

    this.logger.debug(`Batch validation completed for ${schemaName}`, {
      total: items.length,
      valid: valid.length,
      invalid: invalid.length,
    });

    return { valid, invalid };
  }

  /**
   * Format Zod errors into our ValidationError format
   */
  private formatZodErrors(zodError: z.ZodError): ValidationError[] {
    return zodError.issues.map((issue) => ({
      field: issue.path.join(".") || "root",
      message: issue.message,
      code: issue.code,
      value: (issue as any).received || undefined,
    }));
  }

  /**
   * Get validation statistics
   */
  public getValidationStats(): {
    cacheEnabled: boolean;
    cacheSize: number;
    totalValidations: number;
  } {
    return {
      cacheEnabled: this.cacheEnabled,
      cacheSize: this.validationCache.size,
      totalValidations: this.validationCache.size, // Approximate
    };
  }
}

// Export singleton instance for convenience
export const schemaValidator = new SchemaValidator();
