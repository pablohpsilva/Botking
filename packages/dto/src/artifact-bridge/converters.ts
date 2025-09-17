/**
 * Artifact-DTO Conversion Utilities
 *
 * Functions to convert between artifact domain objects and database DTOs
 */

import { createPackageLogger } from "@botking/logger";
import type {
  IBot,
  IItem,
  ITradingEvent,
  ITradeOffer,
} from "@botking/artifact";

const logger = createPackageLogger("dto", { service: "artifact-converters" });

/**
 * Bot artifact to database conversion
 */
export class BotConverter {
  /**
   * Convert Bot artifact to database create data
   */
  static toCreateData(bot: IBot) {
    logger.debug("Converting Bot artifact to create data", {
      botId: bot.id,
      botName: bot.name,
    });

    return {
      id: bot.id,
      name: bot.name,
      userId: bot.userId,
      botType: bot.botType,

      // Handle optional soul chip
      soulChipId: bot.soulChip?.id || null,

      // Required components
      skeletonId: bot.skeleton.id,

      // Convert arrays to ID arrays
      partIds: bot.parts.map((part) => part.id),
      expansionChipIds: bot.expansionChips.map((chip) => chip.id),

      // Bot state reference
      stateId: bot.state?.id || null,

      // Combat and utility specializations
      combatRole: bot.combatRole,
      utilitySpec: bot.utilitySpec,
      governmentType: bot.governmentType,
    };
  }

  /**
   * Convert Bot artifact to database update data
   */
  static toUpdateData(bot: IBot) {
    logger.debug("Converting Bot artifact to update data", { botId: bot.id });

    return {
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
  }
}

/**
 * Item artifact to database conversion
 */
export class ItemConverter {
  /**
   * Convert Item artifact to database create data
   */
  static toCreateData(item: IItem) {
    logger.debug("Converting Item artifact to create data", {
      itemId: item.id,
      itemName: item.name,
    });

    return {
      id: item.id,
      name: item.name,
      description: item.description,
      category: item.category,
      rarity: item.rarity,
      value: item.value,
      isProtected: false, // Default value - artifacts don't have this property
    };
  }

  /**
   * Convert Item artifact to database update data
   */
  static toUpdateData(item: IItem) {
    logger.debug("Converting Item artifact to update data", {
      itemId: item.id,
    });

    return {
      name: item.name,
      description: item.description,
      category: item.category,
      rarity: item.rarity,
      value: item.value,
      isProtected: false, // Default value - artifacts don't have this property
    };
  }
}

/**
 * Trading Event artifact to database conversion
 */
export class TradingEventConverter {
  /**
   * Convert TradingEvent artifact to database create data
   */
  static toCreateData(event: ITradingEvent) {
    logger.debug("Converting TradingEvent artifact to create data", {
      eventId: event.id,
      eventName: event.name,
    });

    return {
      id: event.id,
      name: event.name,
      description: event.description,
      status: event.status,
      startDate: event.startDate,
      endDate: event.endDate,
      isRepeatable: event.isRepeatable,
      maxTradesPerUser: event.maxTradesPerUser,
      priority: event.priority,
      tags: [...event.tags], // Convert from readonly array
      imageUrl: event.imageUrl,
      createdBy: event.createdBy,
      isPublic: event.isPublic,
    };
  }

  /**
   * Convert TradingEvent artifact to database update data
   */
  static toUpdateData(event: ITradingEvent) {
    logger.debug("Converting TradingEvent artifact to update data", {
      eventId: event.id,
    });

    return {
      name: event.name,
      description: event.description,
      status: event.status,
      startDate: event.startDate,
      endDate: event.endDate,
      isRepeatable: event.isRepeatable,
      maxTradesPerUser: event.maxTradesPerUser,
      priority: event.priority,
      tags: [...event.tags],
      imageUrl: event.imageUrl,
      createdBy: event.createdBy,
      isPublic: event.isPublic,
    };
  }
}

/**
 * Trade Offer artifact to database conversion
 */
export class TradeOfferConverter {
  /**
   * Convert TradeOffer artifact to database create data
   */
  static toCreateData(offer: ITradeOffer) {
    logger.debug("Converting TradeOffer artifact to create data", {
      offerId: offer.id,
      offerName: offer.name,
    });

    return {
      id: offer.id,
      tradingEventId: offer.tradingEventId,
      name: offer.name,
      description: offer.description,
      status: offer.status,
      maxTotalTrades: offer.maxTotalTrades,
      currentTrades: offer.currentTrades,
      maxPerUser: offer.maxPerUser,
      startDate: offer.startDate,
      endDate: offer.endDate,
      displayOrder: offer.displayOrder,
      isHighlighted: offer.isHighlighted,
      tags: [...offer.tags],
    };
  }

  /**
   * Convert TradeOffer artifact to database update data
   */
  static toUpdateData(offer: ITradeOffer) {
    logger.debug("Converting TradeOffer artifact to update data", {
      offerId: offer.id,
    });

    return {
      tradingEventId: offer.tradingEventId,
      name: offer.name,
      description: offer.description,
      status: offer.status,
      maxTotalTrades: offer.maxTotalTrades,
      currentTrades: offer.currentTrades,
      maxPerUser: offer.maxPerUser,
      startDate: offer.startDate,
      endDate: offer.endDate,
      displayOrder: offer.displayOrder,
      isHighlighted: offer.isHighlighted,
      tags: [...offer.tags],
    };
  }
}

/**
 * Generic artifact converter utility
 */
export class ArtifactConverter {
  /**
   * Batch convert multiple artifacts
   */
  static batchConvert<T>(
    artifacts: any[],
    converterFn: (artifact: any) => T
  ): T[] {
    logger.debug("Batch converting artifacts", { count: artifacts.length });

    return artifacts.map((artifact) => {
      try {
        return converterFn(artifact);
      } catch (error) {
        logger.error("Failed to convert artifact", {
          artifactId: artifact.id,
          error: (error as Error).message,
        });
        throw error;
      }
    });
  }

  /**
   * Validate artifact before conversion
   */
  static validateArtifact(artifact: any, requiredFields: string[]): boolean {
    const missing = requiredFields.filter((field) => !artifact[field]);

    if (missing.length > 0) {
      logger.warn("Artifact missing required fields", {
        artifactId: artifact.id,
        missingFields: missing,
      });
      return false;
    }

    return true;
  }
}

/**
 * Conversion result with metadata
 */
export interface ConversionResult<T> {
  data: T;
  metadata: {
    convertedAt: Date;
    artifactId: string;
    artifactType: string;
  };
}

/**
 * Enhanced converter with metadata
 */
export class EnhancedConverter {
  /**
   * Convert with metadata tracking
   */
  static convertWithMetadata<T>(
    artifact: any,
    converterFn: (artifact: any) => T,
    artifactType: string
  ): ConversionResult<T> {
    const data = converterFn(artifact);

    return {
      data,
      metadata: {
        convertedAt: new Date(),
        artifactId: artifact.id,
        artifactType,
      },
    };
  }
}
