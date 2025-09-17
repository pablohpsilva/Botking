/**
 * Auto-sync DTO Factory using Prisma + Zod schemas
 * This factory is always in sync with the database schema
 */

import { z } from "zod";
import { createPackageLogger } from "@botking/logger";
import type { PrismaClient } from "@botking/db";
import type {
  IBot,
  IItem,
  ITradingEvent,
  ITradeOffer,
} from "@botking/artifact";
// Direct conversion - no need for separate converters
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
  private db: PrismaClient;
  private logger: ReturnType<typeof createPackageLogger>;

  constructor(prismaClient: PrismaClient) {
    this.db = prismaClient;
    this.logger = createPackageLogger("dto", { service: "auto-sync-factory" });
    this.logger.info(
      "AutoSyncDTOFactory initialized with artifact integration"
    );
  }
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
            code: "INVALID_FIELD",
          });
        }

        if ("battlesWon" in validated && validated.battlesWon !== undefined) {
          errors.push({
            field: "battlesWon",
            message: "Worker bots cannot have battle statistics",
            code: "INVALID_FIELD",
          });
        }

        if ("battlesLost" in validated && validated.battlesLost !== undefined) {
          errors.push({
            field: "battlesLost",
            message: "Worker bots cannot have battle statistics",
            code: "INVALID_FIELD",
          });
        }

        if (
          "totalBattles" in validated &&
          validated.totalBattles !== undefined
        ) {
          errors.push({
            field: "totalBattles",
            message: "Worker bots cannot have battle statistics",
            code: "INVALID_FIELD",
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
              code: "INVALID_CALCULATION",
            });
          }
        }

        // Bond level validation for non-worker bots
        if ("bondLevel" in validated && validated.bondLevel !== undefined) {
          if (validated.bondLevel < 0 || validated.bondLevel > 100) {
            errors.push({
              field: "bondLevel",
              message: "Bond level must be between 0 and 100",
              code: "INVALID_RANGE",
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
            code: "INVALID_RANGE",
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
            code: "INVALID_RANGE",
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

  // ==========================================
  // ARTIFACT INTEGRATION METHODS
  // ==========================================

  /**
   * Save Bot artifact to database
   */
  async saveBotArtifact(bot: IBot) {
    this.logger.info("Saving Bot artifact to database", {
      botId: bot.id,
      botName: bot.name,
    });

    // Direct conversion without separate converter
    const createData = {
      id: bot.id,
      name: bot.name,
      userId: bot.userId || "unknown",
      botType: bot.botType,
      soulChipId: bot.soulChip?.id || null,
      skeletonId: bot.skeleton.id,
      partIds: bot.parts.map((part) => part.id),
      expansionChipIds: bot.expansionChips.map((chip) => chip.id),
      stateId: bot.state?.id || null,
      combatRole: bot.combatRole,
      utilitySpec: bot.utilitySpec,
      governmentType: bot.governmentType,
    };

    // Validate against Zod schema
    const validation = CreateBotSchema.safeParse(createData);
    if (!validation.success) {
      this.logger.error("Bot artifact validation failed", {
        botId: bot.id,
        errors: validation.error.issues,
      });
      throw new Error(`Bot validation failed: ${validation.error.message}`);
    }

    return this.db.bot.create({
      data: validation.data,
    });
  }

  /**
   * Update Bot artifact in database
   */
  async updateBotArtifact(bot: IBot) {
    this.logger.info("Updating Bot artifact in database", {
      botId: bot.id,
      botName: bot.name,
    });

    // Direct conversion without separate converter
    const updateData = {
      name: bot.name,
      botType: bot.botType,
      soulChipId: bot.soulChip?.id || null,
      skeletonId: bot.skeleton.id,
      partIds: bot.parts.map((part) => part.id),
      expansionChipIds: bot.expansionChips.map((chip) => chip.id),
      stateId: bot.state?.id || null,
      combatRole: bot.combatRole,
      utilitySpec: bot.utilitySpec,
      governmentType: bot.governmentType,
    };

    // Validate against Zod schema
    const validation = UpdateBotSchema.safeParse(updateData);
    if (!validation.success) {
      this.logger.error("Bot artifact update validation failed", {
        botId: bot.id,
        errors: validation.error.issues,
      });
      throw new Error(
        `Bot update validation failed: ${validation.error.message}`
      );
    }

    return this.db.bot.update({
      where: { id: bot.id },
      data: validation.data,
    });
  }

  /**
   * Save Item artifact to database
   */
  async saveItemArtifact(item: IItem) {
    this.logger.info("Saving Item artifact to database", {
      itemId: item.id,
      itemName: item.name,
    });

    // Direct conversion without separate converter
    const createData = {
      id: item.id,
      name: item.name,
      description: item.description,
      category: item.category,
      rarity: item.rarity,
      value: item.value,
      isProtected: false, // Default value
    };

    // Skip validation for now until proper schema is available
    // TODO: Use proper ItemSchema when available

    return this.db.item.create({
      data: createData as any, // Type assertion until proper types are available
    });
  }

  // Trading artifacts removed for lean architecture
  // Use direct database operations if needed

  /**
   * Load Bot artifact from database with full composition
   */
  async loadBotArtifact(id: string): Promise<IBot | null> {
    this.logger.info("Loading Bot artifact from database", { botId: id });

    const botData = await this.db.bot.findUnique({
      where: { id },
      include: {
        soulChip: true,
        skeleton: true,
        parts: true,
        expansionChips: true,
        // botState: true, // TODO: Add when BotState is properly defined in schema
      },
    });

    if (!botData) {
      this.logger.warn("Bot not found in database", { botId: id });
      return null;
    }

    // TODO: Convert database data back to Bot artifact
    // This would require implementing the reverse conversion
    this.logger.info("Bot data loaded from database", {
      botId: botData.id,
      componentsLoaded: {
        soulChip: !!botData.soulChip,
        skeleton: !!botData.skeleton,
        parts: botData.parts.length,
        expansionChips: botData.expansionChips.length,
        // botState: !!botData.botState, // TODO: Add when available
      },
    });

    // For now, return null until we implement the reverse conversion
    return null;
  }

  /**
   * Batch save multiple artifacts
   */
  async saveArtifactBatch(artifacts: {
    bots?: IBot[];
    items?: IItem[];
    tradingEvents?: ITradingEvent[];
    tradeOffers?: ITradeOffer[];
  }) {
    this.logger.info("Starting batch artifact save", {
      botCount: artifacts.bots?.length || 0,
      itemCount: artifacts.items?.length || 0,
      tradingEventCount: artifacts.tradingEvents?.length || 0,
      tradeOfferCount: artifacts.tradeOffers?.length || 0,
    });

    const results = {
      bots: artifacts.bots
        ? await Promise.all(
            artifacts.bots.map((bot) => this.saveBotArtifact(bot))
          )
        : [],
      items: artifacts.items
        ? await Promise.all(
            artifacts.items.map((item) => this.saveItemArtifact(item))
          )
        : [],
      // Trading artifacts removed for lean architecture
    };

    this.logger.info("Batch artifact save completed", {
      totalSaved: Object.values(results).reduce(
        (sum, arr) => sum + arr.length,
        0
      ),
    });

    return results;
  }

  /**
   * Validate artifact before persistence
   */
  validateArtifact(artifact: any, type: string): boolean {
    const requiredFields = ["id", "name"];
    const missing = requiredFields.filter((field) => !artifact[field]);

    if (missing.length > 0) {
      this.logger.warn("Artifact validation failed", {
        artifactType: type,
        artifactId: artifact.id,
        missingFields: missing,
      });
      return false;
    }

    return true;
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
