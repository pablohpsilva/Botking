/**
 * Simple example showing the lean artifact-first DTO architecture
 * This demonstrates creating artifacts and converting to DTOs for persistence
 */

import { BotDTO, ItemDTO, SoulChipDTO } from "./interfaces/artifact-dto";
import { BotDTOFactory, ItemDTOFactory, SoulChipDTOFactory } from "./factories";
import {
  BotType,
  SkeletonType,
  ItemCategory,
  Rarity,
  GemType,
  SpeedUpTarget,
} from "@botking/artifact";

/**
 * Example usage of the lean DTO system
 */
export class DTOExample {
  /**
   * Create a worker bot using artifact-first approach
   */
  public static createWorkerBot(): BotDTO {
    const botFactory = new BotDTOFactory();

    // 1. Create artifact (primary object)
    const workerBot = botFactory.createWorkerArtifact(
      "Mining Bot Alpha",
      "user123",
      "MINING"
    );

    // 2. Validate artifact using domain rules
    const validation = botFactory.validateArtifact(workerBot);
    if (!validation.isValid) {
      throw new Error(
        `Bot validation failed: ${validation.errors?.map((e) => e.message).join(", ")}`
      );
    }

    // 3. Convert to DTO for persistence
    return botFactory.artifactToDTO(workerBot);
  }

  /**
   * Create a playable bot using artifact-first approach
   */
  public static createPlayableBot(): BotDTO {
    const botFactory = new BotDTOFactory();

    // 1. Create artifact with specific configuration
    const playableBot = botFactory.createPlayableArtifact(
      "Combat Bot Beta",
      "user123",
      SkeletonType.LIGHT
    );

    // 2. Validate assembly
    const validation = botFactory.validateArtifact(playableBot);
    if (!validation.isValid) {
      throw new Error(
        `Bot assembly failed: ${validation.errors?.map((e) => e.message).join(", ")}`
      );
    }

    // 3. Convert to DTO for persistence
    return botFactory.artifactToDTO(playableBot);
  }

  /**
   * Create various items using artifact-first approach
   */
  public static createItems(): ItemDTO[] {
    const itemFactory = new ItemDTOFactory();

    // 1. Create different types of item artifacts
    const commonGem = itemFactory.createGemArtifact(
      "Common Ruby",
      GemType.COMMON,
      Rarity.COMMON,
      10
    );

    const rareResource = itemFactory.createResourceArtifact(
      "Refined Steel",
      "High-quality material for bot construction",
      100,
      Rarity.RARE
    );

    const speedBooster = itemFactory.createSpeedUpArtifact(
      "Construction Accelerator",
      SpeedUpTarget.BOT_CONSTRUCTION,
      2.0,
      3600 // 1 hour
    );

    const tradeableItem = itemFactory.createTradeableArtifact(
      "Ancient Artifact",
      "A mysterious relic from the old world",
      Rarity.LEGENDARY,
      1000
    );

    // 2. Validate all artifacts
    const itemArtifacts = [
      commonGem,
      rareResource,
      speedBooster,
      tradeableItem,
    ];

    for (const item of itemArtifacts) {
      const validation = itemFactory.validateArtifact(item);
      if (!validation.isValid) {
        throw new Error(
          `Item validation failed: ${validation.errors?.map((e) => e.message).join(", ")}`
        );
      }
    }

    // 3. Convert to DTOs for persistence
    return itemFactory.batchArtifactsToDTO(itemArtifacts);
  }

  /**
   * Create SoulChip artifacts using new factory
   */
  public static createSoulChipComponents(): {
    soulChip: SoulChipDTO;
  } {
    // Create SoulChip artifact
    const soulChipFactory = new SoulChipDTOFactory();
    const soulChip = soulChipFactory.createEmpatheticArtifact(
      "Companion Soul",
      Rarity.UNCOMMON
    );

    // Validate artifacts
    console.log("🔍 Validating SoulChip artifact...");

    const soulChipValidation = soulChipFactory.validateArtifact(soulChip);

    if (!soulChipValidation.isValid) {
      console.warn("⚠️ SoulChip validation issues:", soulChipValidation.errors);
    }

    // Convert to DTOs for persistence
    return {
      soulChip: soulChipFactory.artifactToDTO(soulChip),
    };
  }

  /**
   * Demonstrate the complete workflow
   */
  public static demonstrateWorkflow(): void {
    console.log("🚀 Artifact-First DTO Example");

    try {
      // Create SoulChip components
      const components = this.createSoulChipComponents();

      console.log("✅ SoulChip artifact created:", {
        soulChip: {
          name: components.soulChip.specialTrait,
          rarity: components.soulChip.rarity,
        },
      });

      // Create complete bots
      const workerBot = this.createWorkerBot();
      const playableBot = this.createPlayableBot();

      console.log("✅ Complete bots created:", {
        worker: { name: workerBot.name, type: workerBot.botType },
        playable: { name: playableBot.name, type: playableBot.botType },
      });

      // Create items
      const items = this.createItems();

      console.log(
        "✅ Items created:",
        items.map((item) => ({
          name: item.name,
          category: item.category,
          rarity: item.rarity,
        }))
      );

      console.log(
        "🎯 Artifact-first architecture working with core components!"
      );
      console.log(
        "📊 Bot, Item, and SoulChip objects created through packages/artifacts!"
      );
    } catch (error) {
      console.error("❌ Example failed:", (error as Error).message);
    }
  }
}

// Export for use in other modules
export default DTOExample;
