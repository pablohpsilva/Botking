/**
 * Bot Factory - Artifact-First Approach
 *
 * This factory creates Bot artifacts and provides methods to convert them to DTOs
 * for database persistence. Artifacts are the primary objects, DTOs are for persistence.
 */

import { ArtifactDTOFactory } from "../base/artifact-dto-factory";
import { BotDTO } from "../../interfaces/artifact-dto";
import { ValidationResult } from "../../interfaces/base-dto";
import { BotConverter } from "../../artifact-bridge/converters";
import {
  Bot,
  BotFactory as ArtifactBotFactory,
  type IBot,
  BotType,
  SkeletonType,
} from "@botking/artifact";

/**
 * Bot DTO Factory - Works with artifacts as primary objects
 */
export class BotDTOFactory extends ArtifactDTOFactory<IBot, BotDTO> {
  constructor() {
    super("bot-factory");
  }
  // ==========================================
  // ARTIFACT CREATION METHODS (Primary)
  // ==========================================

  /**
   * Create a default Bot artifact
   */
  public createArtifact(overrides?: {
    name?: string;
    userId?: string;
    botType?: BotType;
    skeletonType?: SkeletonType;
  }): IBot {
    this.logger.debug("Creating default Bot artifact", overrides);

    const config = {
      name: overrides?.name || "Default Bot",
      userId: overrides?.userId || "default-user",
      botType: overrides?.botType || BotType.WORKER,
      skeletonType: overrides?.skeletonType || SkeletonType.BALANCED,
    };

    return ArtifactBotFactory.createBasicBot(
      config.name,
      config.userId,
      config.skeletonType,
      config.botType
    );
  }

  /**
   * Create a worker Bot artifact
   */
  public createWorkerArtifact(
    name: string,
    userId: string,
    specialization?: string
  ): IBot {
    this.logger.debug("Creating Worker Bot artifact", {
      name,
      userId,
      specialization,
    });

    if (specialization) {
      return ArtifactBotFactory.createUtilityBot(
        name,
        userId,
        specialization as any,
        BotType.WORKER
      );
    }

    return ArtifactBotFactory.createBasicBot(
      name,
      userId,
      SkeletonType.HEAVY, // Workers typically use heavy skeletons
      BotType.WORKER
    );
  }

  /**
   * Create a playable Bot artifact
   */
  public createPlayableArtifact(
    name: string,
    userId: string,
    skeletonType: SkeletonType = SkeletonType.BALANCED
  ): IBot {
    this.logger.debug("Creating Playable Bot artifact", {
      name,
      userId,
      skeletonType,
    });

    return ArtifactBotFactory.createBasicBot(
      name,
      userId,
      skeletonType,
      BotType.PLAYABLE
    );
  }

  /**
   * Create a King Bot artifact
   */
  public createKingArtifact(name: string, userId: string): IBot {
    this.logger.debug("Creating King Bot artifact", { name, userId });

    return ArtifactBotFactory.createBasicBot(
      name,
      userId,
      SkeletonType.HEAVY, // Kings use heavy skeletons
      BotType.KING
    );
  }

  // ==========================================
  // ARTIFACT-TO-DTO CONVERSION METHODS
  // ==========================================

  /**
   * Convert Bot artifact to DTO for database persistence
   */
  public artifactToDTO(bot: IBot): BotDTO {
    this.logger.debug("Converting Bot artifact to DTO", {
      botId: bot.id,
      botName: bot.name,
    });

    const dbData = BotConverter.toCreateData(bot);

    // Add DTO-specific metadata
    return {
      ...dbData,
      createdAt: new Date(),
      updatedAt: new Date(),
      version: 1,
      source: "artifact-factory",
      metadata: {
        createdVia: "BotDTOFactory",
        artifactVersion: "1.0.0",
      },
    } as BotDTO;
  }

  /**
   * Batch convert multiple Bot artifacts to DTOs
   */
  public batchArtifactsToDTO(bots: IBot[]): BotDTO[] {
    this.logger.debug("Batch converting Bot artifacts to DTOs", {
      count: bots.length,
    });

    return bots.map((bot) => this.artifactToDTO(bot));
  }

  // ==========================================
  // ARTIFACT ASSEMBLY & VALIDATION
  // ==========================================

  /**
   * Validate Bot artifact assembly
   */
  public validateArtifact(bot: IBot): ValidationResult {
    this.logger.debug("Validating Bot artifact", { botId: bot.id });

    try {
      const assemblyResult = bot.validateAssembly();

      return {
        isValid: assemblyResult.valid,
        errors: assemblyResult.errors.map((error) => ({
          field: "assembly",
          message: error,
          code: "ASSEMBLY_ERROR",
        })),
      };
    } catch (error) {
      this.logger.error("Bot artifact validation failed", {
        botId: bot.id,
        error: (error as Error).message,
      });

      return {
        isValid: false,
        errors: [
          {
            field: "assembly",
            message: `Validation error: ${(error as Error).message}`,
            code: "VALIDATION_EXCEPTION",
          },
        ],
      };
    }
  }

  /**
   * Assemble Bot from component artifacts
   */
  public assembleFromComponents(config: {
    name: string;
    userId: string;
    botType: BotType;
    soulChip?: any;
    skeleton: any;
    parts: any[];
    expansionChips: any[];
    botState?: any;
  }): IBot {
    this.logger.debug("Assembling Bot from components", {
      name: config.name,
      componentsProvided: {
        soulChip: !!config.soulChip,
        skeleton: !!config.skeleton,
        parts: config.parts.length,
        expansionChips: config.expansionChips.length,
        botState: !!config.botState,
      },
    });

    // Use artifact factory to create assembled bot
    const botConfig = {
      name: config.name,
      userId: config.userId,
      botType: config.botType,
      soulChip: config.soulChip,
      skeleton: config.skeleton,
      parts: config.parts,
      expansionChips: config.expansionChips,
      botState: config.botState,
    };

    return new Bot(botConfig);
  }

  // ==========================================
  // REQUIRED IMPLEMENTATIONS (BaseDTOFactory)
  // ==========================================

  /**
   * Create default DTO (required by base class)
   */
  public createDefault(overrides?: Partial<BotDTO>): BotDTO {
    // Create artifact first, then convert to DTO
    const artifact = this.createArtifact({
      name: overrides?.name || undefined,
      userId: overrides?.userId || undefined,
      botType: (overrides?.botType as BotType) || undefined,
    });

    const dto = this.artifactToDTO(artifact);
    return this.mergeDefaults(dto, overrides);
  }

  /**
   * Create DTO from data (required by base class)
   */
  public createFromData(data: any): BotDTO {
    // If data looks like an artifact, use it
    if (data.skeleton && data.parts && data.expansionChips) {
      return this.artifactToDTO(data as IBot);
    }

    // Otherwise, create artifact from basic data
    const artifact = this.createArtifact({
      name: data.name,
      userId: data.userId,
      botType: data.botType,
    });

    return this.artifactToDTO(artifact);
  }

  /**
   * Validate DTO (required by base class)
   */
  public validate(dto: BotDTO): ValidationResult {
    const errors: string[] = [];

    // Basic validation
    if (!dto.id) errors.push("Bot ID is required");
    if (!dto.name) errors.push("Bot name is required");
    if (!dto.userId) errors.push("User ID is required");
    if (!dto.botType) errors.push("Bot type is required");
    if (!dto.skeletonId) errors.push("Skeleton ID is required");

    // Bot type specific validation
    if (dto.botType === BotType.WORKER && dto.soulChipId) {
      errors.push("Worker bots cannot have soul chips");
    }

    if (dto.botType !== BotType.WORKER && !dto.soulChipId) {
      errors.push("Non-worker bots must have soul chips");
    }

    return {
      isValid: errors.length === 0,
      errors: errors.map((error) => ({
        field: "general",
        message: error,
        code: "VALIDATION_ERROR",
      })),
    };
  }
}
