/**
 * Artifact-First DTO Usage Example
 *
 * This example demonstrates the new architecture where:
 * 1. Artifacts are the primary objects (from @botking/artifact)
 * 2. DTOs are only used for database persistence
 * 3. All business logic operates on artifacts
 * 4. Consistent artifact-first approach throughout
 */

import { PrismaClient } from "@botking/db";
import { AutoSyncDTOFactory } from "@botking/dto";
import { BotDTOFactory, ItemDTOFactory } from "@botking/dto";
import {
  BotType,
  SkeletonType,
  ItemCategory,
  Rarity,
  GemType,
} from "@botking/artifact";

// Initialize services
const prisma = new PrismaClient();
const autoSync = new AutoSyncDTOFactory(prisma);
const botFactory = new BotDTOFactory();
const itemFactory = new ItemDTOFactory();

export class ArtifactFirstExample {
  /**
   * Example 1: Create and persist a worker bot
   */
  static async createWorkerBot() {
    console.log("🤖 Creating Worker Bot (Artifact-First)...");

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

    // 3. Convert to DTO and persist to database
    const savedBot = await autoSync.saveBotArtifact(workerBot);

    console.log("✅ Worker bot created and saved:", {
      artifactId: workerBot.id,
      dbId: savedBot.id,
      name: workerBot.name,
      type: workerBot.botType,
      hasSoulChip: !!workerBot.soulChip, // Should be false for workers
    });

    return { artifact: workerBot, dto: savedBot };
  }

  /**
   * Example 2: Create and persist a playable bot
   */
  static async createPlayableBot() {
    console.log("🎮 Creating Playable Bot (Artifact-First)...");

    // 1. Create artifact with specific configuration
    const playableBot = botFactory.createPlayableArtifact(
      "Combat Bot Beta",
      "user123",
      SkeletonType.LIGHT
    );

    // 2. Validate assembly
    const assemblyValidation = botFactory.validateArtifact(playableBot);
    if (!assemblyValidation.isValid) {
      throw new Error(
        `Bot assembly failed: ${assemblyValidation.errors?.map((e) => e.message).join(", ")}`
      );
    }

    // 3. Save to database
    const savedBot = await autoSync.saveBotArtifact(playableBot);

    console.log("✅ Playable bot created and saved:", {
      artifactId: playableBot.id,
      dbId: savedBot.id,
      name: playableBot.name,
      type: playableBot.botType,
      hasSoulChip: !!playableBot.soulChip, // Should be true for playable
      skeletonType: playableBot.skeleton.skeletonType,
      totalParts: playableBot.parts.length,
    });

    return { artifact: playableBot, dto: savedBot };
  }

  /**
   * Example 3: Create and persist various items
   */
  static async createItems() {
    console.log("💎 Creating Items (Artifact-First)...");

    const items = [];

    // 1. Create different types of item artifacts
    const commonGem = itemFactory.createGemArtifact(
      "Common Ruby",
      GemType.ATTACK,
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
      "BOT_CONSTRUCTION",
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

    // 3. Batch save to database
    const savedItems = await Promise.all(
      itemArtifacts.map((item) => autoSync.saveItemArtifact(item))
    );

    console.log(
      "✅ Items created and saved:",
      savedItems.map((item) => ({
        name: item.name,
        category: item.category,
        rarity: item.rarity,
        value: item.value,
      }))
    );

    return itemArtifacts.map((artifact, index) => ({
      artifact,
      dto: savedItems[index],
    }));
  }

  /**
   * Example 4: Batch operations with validation
   */
  static async batchOperations() {
    console.log("📦 Batch Operations (Artifact-First)...");

    // 1. Batch create bot artifacts with different configurations
    const botConfigs = [
      { name: "Worker 1", userId: "user123", botType: BotType.WORKER },
      { name: "Worker 2", userId: "user123", botType: BotType.WORKER },
      { name: "Player Bot", userId: "user123", botType: BotType.PLAYABLE },
      { name: "King Bot", userId: "user123", botType: BotType.KING },
    ];

    const { artifacts: bots, failures } =
      botFactory.batchCreateArtifacts(botConfigs);

    console.log("📊 Batch creation results:", {
      successful: bots.length,
      failed: failures.length,
      failures: failures.map((f) => ({ name: f.config.name, error: f.error })),
    });

    // 2. Batch validate and convert to DTOs
    const validBots = [];
    const validationFailures = [];

    for (const bot of bots) {
      const result = botFactory.artifactToDTOPipeline(bot);
      if (result.dto && result.validation.isValid) {
        validBots.push({ artifact: bot, dto: result.dto });
      } else {
        validationFailures.push({
          botName: bot.name,
          errors: result.validation.errors?.map((e) => e.message) || [],
        });
      }
    }

    // 3. Batch save valid bots
    if (validBots.length > 0) {
      const savedBots = await autoSync.saveArtifactBatch({
        bots: validBots.map((b) => b.artifact),
      });

      console.log("✅ Batch save completed:", {
        saved: savedBots.bots.length,
        validationFailures: validationFailures.length,
      });
    }

    return { validBots, validationFailures };
  }

  /**
   * Example 5: Load artifacts from database and work with them
   */
  static async loadAndModifyBot(botId: string) {
    console.log("🔄 Loading and Modifying Bot (Artifact-First)...");

    // 1. Load bot artifact from database
    const botArtifact = await autoSync.loadBotArtifact(botId);

    if (!botArtifact) {
      throw new Error(`Bot with ID ${botId} not found`);
    }

    // 2. Work with the artifact (business logic)
    console.log("📋 Bot Details:", {
      name: botArtifact.name,
      type: botArtifact.botType,
      energy: botArtifact.botState?.energy,
      totalAttack: botArtifact.totalAttack,
      isAssembled: botArtifact.isAssembled,
    });

    // 3. Modify bot (example: upgrade parts)
    // ... business logic operations on artifact ...

    // 4. Save changes back to database
    const updatedBot = await autoSync.updateBotArtifact(botArtifact);

    console.log("✅ Bot updated successfully");

    return { artifact: botArtifact, dto: updatedBot };
  }

  /**
   * Example 6: Factory statistics and monitoring
   */
  static getFactoryStatistics() {
    console.log("📊 Factory Statistics:");

    const botStats = botFactory.getFactoryStats();
    const itemStats = itemFactory.getFactoryStats();

    console.log("Bot Factory:", botStats);
    console.log("Item Factory:", itemStats);

    return { botStats, itemStats };
  }
}

// Usage examples
async function runExamples() {
  try {
    console.log("🚀 Starting Artifact-First DTO Examples...\n");

    // Run all examples
    await ArtifactFirstExample.createWorkerBot();
    console.log();

    await ArtifactFirstExample.createPlayableBot();
    console.log();

    await ArtifactFirstExample.createItems();
    console.log();

    await ArtifactFirstExample.batchOperations();
    console.log();

    ArtifactFirstExample.getFactoryStatistics();
    console.log();

    console.log("✅ All examples completed successfully!");
  } catch (error) {
    console.error("❌ Example failed:", error.message);
  } finally {
    await prisma.$disconnect();
  }
}

// Run examples if this file is executed directly
if (require.main === module) {
  runExamples();
}

export { runExamples };
