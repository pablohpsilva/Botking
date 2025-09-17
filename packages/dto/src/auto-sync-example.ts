/**
 * Auto-sync DTO Example
 * Demonstrates the power of Prisma + Zod integration
 */

import { AutoSyncDTOFactory } from "./auto-sync-dto-factory";
import type {
  CreateSoulChipDTO,
  CreateSkeletonDTO,
  CreatePartDTO,
  CreateBotStateDTO,
  CreateBotDTO,
  BotAssemblyDTO,
  BotTypeValidationDTO,
} from "./auto-sync-dto-factory";

export class AutoSyncExample {
  /**
   * Demonstrate creating a SoulChip with validation
   */
  static createExampleSoulChip(): void {
    console.log("🧠 Creating SoulChip with auto-sync validation...");

    // Valid SoulChip data
    const validSoulChipData = {
      userId: "user_123",
      name: "Wisdom Core Alpha",
      personality:
        "Analytical and strategic, with strong problem-solving capabilities",
      rarity: "EPIC",
      intelligence: 85,
      resilience: 70,
      adaptability: 75,
      specialTrait: "Quantum Processing",
      experiences: ["combat_simulation", "strategic_planning"],
      learningRate: 0.8,
      tags: ["strategy", "combat"],
      description: "High-performance AI core designed for tactical operations",
    };

    const validResult = AutoSyncDTOFactory.createSoulChip(validSoulChipData);
    if (validResult.success) {
      console.log("✅ Valid SoulChip created:", validResult.data?.name);
      console.log(
        "   Total stats:",
        (validResult.data?.intelligence || 0) +
          (validResult.data?.resilience || 0) +
          (validResult.data?.adaptability || 0)
      );
    }

    // Invalid SoulChip data (stats too high)
    const invalidSoulChipData = {
      userId: "user_123",
      name: "Overpowered Core",
      personality: "Too strong",
      rarity: "LEGENDARY",
      intelligence: 100,
      resilience: 100,
      adaptability: 101, // This will exceed the 300 total limit
      specialTrait: "Overpowered",
    };

    const invalidResult =
      AutoSyncDTOFactory.createSoulChip(invalidSoulChipData);
    if (!invalidResult.success) {
      console.log("❌ Invalid SoulChip rejected:");
      invalidResult.errors?.forEach((error) => {
        console.log(`   ${error.field}: ${error.message}`);
      });
    }

    console.log("");
  }

  /**
   * Demonstrate creating a Skeleton
   */
  static createExampleSkeleton(): void {
    console.log("🦴 Creating Skeleton with auto-sync validation...");

    const skeletonData = {
      userId: "user_123",
      name: "Titanium Warlord Frame",
      type: "HEAVY",
      rarity: "RARE",
      slots: 8,
      baseDurability: 150,
      currentDurability: 150,
      maxDurability: 150,
      mobilityType: "TRACKED",
      upgradeLevel: 2,
      specialAbilities: ["heavy_armor", "siege_mode"],
      tags: ["tank", "siege"],
      description: "Heavy-duty frame designed for frontline combat",
    };

    const result = AutoSyncDTOFactory.createSkeleton(skeletonData);
    if (result.success) {
      console.log("✅ Valid Skeleton created:", result.data?.name);
      console.log(
        `   Type: ${result.data?.type}, Slots: ${result.data?.slots}`
      );
    }

    console.log("");
  }

  /**
   * Demonstrate creating a Part with stat validation
   */
  static createExamplePart(): void {
    console.log("⚙️ Creating Part with auto-sync validation...");

    // Valid part
    const validPartData = {
      userId: "user_123",
      name: "Plasma Cannon Mk-VII",
      category: "ARM",
      rarity: "EPIC",
      attack: 120,
      defense: 30,
      speed: 40,
      perception: 60,
      energyConsumption: 25,
      upgradeLevel: 3,
      abilities: [
        { name: "Plasma Burst", damage: 150, cooldown: 5 },
        { name: "Overcharge", multiplier: 1.5, energyCost: 50 },
      ],
      tags: ["energy", "ranged"],
      description: "High-energy plasma weapon with overcharge capability",
    };

    const validResult = AutoSyncDTOFactory.createPart(validPartData);
    if (validResult.success) {
      console.log("✅ Valid Part created:", validResult.data?.name);
      console.log(
        "   Total stats:",
        (validResult.data?.attack || 0) +
          (validResult.data?.defense || 0) +
          (validResult.data?.speed || 0) +
          (validResult.data?.perception || 0)
      );
    }

    // Invalid part (stats too high)
    const invalidPartData = {
      userId: "user_123",
      name: "Overpowered Weapon",
      category: "ARM",
      rarity: "PROTOTYPE",
      attack: 500,
      defense: 200,
      speed: 200,
      perception: 150, // Total = 1050, exceeds 1000 limit
      energyConsumption: 10,
    };

    const invalidResult = AutoSyncDTOFactory.createPart(invalidPartData);
    if (!invalidResult.success) {
      console.log("❌ Invalid Part rejected:");
      invalidResult.errors?.forEach((error) => {
        console.log(`   ${error.field}: ${error.message}`);
      });
    }

    console.log("");
  }

  /**
   * Demonstrate creating a BotState
   */
  static createExampleBotState(): void {
    console.log("🔋 Creating BotState with auto-sync validation...");

    const botStateData = {
      userId: "user_123",
      name: "Alpha Combat State",
      location: "TRAINING",
      energy: 95,
      maxEnergy: 120,
      health: 100,
      maxHealth: 100,
      experience: 2500,
      level: 5,
      missionsCompleted: 12,
      successRate: 0.85,
      totalCombatTime: 4800, // seconds
      damageDealt: 15000,
      damageTaken: 3200,
      statusEffects: ["combat_ready", "enhanced_targeting"],
      tags: ["veteran", "elite"],
    };

    const result = AutoSyncDTOFactory.createBotState(botStateData);
    if (result.success) {
      console.log("✅ Valid BotState created:", result.data?.name);
      console.log(
        `   Level: ${result.data?.level}, Success Rate: ${(result.data?.successRate! * 100).toFixed(1)}%`
      );
    }

    console.log("");
  }

  /**
   * Demonstrate advanced bot assembly validation
   */
  static demonstrateBotAssembly(): void {
    console.log("🤖 Demonstrating Bot Assembly validation...");

    // Create components
    const soulChip = {
      userId: "user_123",
      name: "Alpha AI Core",
      personality: "Tactical combat specialist",
      rarity: "LEGENDARY",
      intelligence: 90,
      resilience: 80,
      adaptability: 70,
      specialTrait: "Combat Prediction",
      experiences: ["urban_warfare", "siege_tactics"],
      learningRate: 0.9,
    };

    const skeleton = {
      userId: "user_123",
      name: "Assault Frame Delta",
      type: "BALANCED",
      rarity: "EPIC",
      slots: 6,
      baseDurability: 120,
      currentDurability: 120,
      maxDurability: 120,
      mobilityType: "BIPEDAL",
      upgradeLevel: 3,
      specialAbilities: ["quick_dash", "armor_pierce"],
    };

    const state = {
      userId: "user_123",
      name: "Combat Ready State",
      location: "STORAGE",
      energy: 100,
      maxEnergy: 100,
      health: 100,
      maxHealth: 100,
      experience: 5000,
      level: 8,
      missionsCompleted: 25,
      successRate: 0.92,
    };

    const parts = [
      {
        userId: "user_123",
        name: "Assault Rifle",
        category: "ARM",
        rarity: "RARE",
        attack: 80,
        defense: 20,
        speed: 30,
        perception: 40,
        energyConsumption: 15,
      },
      {
        userId: "user_123",
        name: "Combat Legs",
        category: "LEG",
        rarity: "EPIC",
        attack: 40,
        defense: 60,
        speed: 70,
        perception: 30,
        energyConsumption: 20,
      },
      {
        userId: "user_123",
        name: "Armor Plating",
        category: "TORSO",
        rarity: "RARE",
        attack: 10,
        defense: 90,
        speed: 20,
        perception: 30,
        energyConsumption: 25,
      },
      // Only 3 parts for a 6-slot skeleton - valid
    ];

    const botAssembly = {
      soulChip,
      skeleton,
      state,
      parts,
    };

    const result = AutoSyncDTOFactory.validateBotAssembly(botAssembly);
    if (result.success) {
      console.log("✅ Valid Bot Assembly created!");
      console.log(
        `   Parts: ${result.data?.parts.length}/${result.data?.skeleton.slots} slots used`
      );
      console.log(`   SoulChip: ${result.data?.soulChip.name}`);
      console.log(`   Skeleton: ${result.data?.skeleton.name}`);
    } else {
      console.log("❌ Invalid Bot Assembly:");
      result.errors?.forEach((error) => {
        console.log(`   ${error.field}: ${error.message}`);
      });
    }

    console.log("");
  }

  /**
   * Demonstrate bot type validation (ownership and player assignment rules)
   */
  static demonstrateBotTypeValidation(): void {
    console.log("🤖 Demonstrating Bot Type validation...");

    // Valid bot type configurations
    console.log("\n✅ Valid configurations:");

    // Worker bot - can have optional owner and player
    const validWorker = AutoSyncDTOFactory.validateBotType({
      botType: "WORKER",
      userId: "owner_123",
    });
    console.log("Worker with owner and player:", validWorker.success);

    // Playable bot - must have owner
    const validPlayable = AutoSyncDTOFactory.validateBotType({
      botType: "PLAYABLE",
      userId: "owner_123",
    });
    console.log("Playable with owner:", validPlayable.success);

    // King bot - must have owner
    const validKing = AutoSyncDTOFactory.validateBotType({
      botType: "KING",
      userId: "owner_123",
    });
    console.log("King with owner and player:", validKing.success);

    // Rogue bot - autonomous, no owner or player
    const validRogue = AutoSyncDTOFactory.validateBotType({
      botType: "ROGUE",
      userId: null,
    });
    console.log("Rogue autonomous:", validRogue.success);

    // GovBot - system controlled, no owner or player
    const validGovBot = AutoSyncDTOFactory.validateBotType({
      botType: "GOVBOT",
      userId: null,
    });
    console.log("GovBot system controlled:", validGovBot.success);

    console.log("\n❌ Invalid configurations:");

    // King without owner (should fail)
    const invalidKing = AutoSyncDTOFactory.validateBotType({
      botType: "KING",
      userId: null,
    });
    if (!invalidKing.success) {
      console.log(
        "King without owner rejected:",
        invalidKing.errors?.[0]?.message || "Validation failed"
      );
    }

    // Rogue with owner (should fail)
    const invalidRogue = AutoSyncDTOFactory.validateBotType({
      botType: "ROGUE",
      userId: "owner_123",
    });
    if (!invalidRogue.success) {
      console.log(
        "Rogue with owner rejected:",
        invalidRogue.errors?.[0]?.message || "Validation failed"
      );
    }

    // Worker with player but no owner (should fail)
    const invalidWorker = AutoSyncDTOFactory.validateBotType({
      botType: "WORKER",
      userId: null,
    });
    if (!invalidWorker.success) {
      console.log(
        "Worker with player but no owner rejected:",
        invalidWorker.errors?.[0]?.message || "Validation failed"
      );
    }

    console.log("");
  }

  /**
   * Demonstrate enum validation
   */
  static demonstrateEnumValidation(): void {
    console.log("📋 Demonstrating Enum validation...");

    // Valid enum values
    const validRarity = AutoSyncDTOFactory.validateRarity("LEGENDARY");
    console.log("✅ Valid Rarity:", validRarity.data);

    const validSkeletonType = AutoSyncDTOFactory.validateSkeletonType("FLYING");
    console.log("✅ Valid SkeletonType:", validSkeletonType.data);

    const validBotType = AutoSyncDTOFactory.validateBotType({
      botType: "WORKER",
      userId: "owner_123",
    });
    console.log("✅ Valid BotType:", validBotType.data?.botType);

    // Invalid enum values
    const invalidRarity = AutoSyncDTOFactory.validateRarity("SUPER_RARE");
    if (!invalidRarity.success) {
      console.log("❌ Invalid Rarity rejected");
    }

    const invalidLocation =
      AutoSyncDTOFactory.validateBotLocation("UNKNOWN_PLACE");
    if (!invalidLocation.success) {
      console.log("❌ Invalid BotLocation rejected");
    }

    console.log("");
  }

  /**
   * Run all examples
   */
  static runAllExamples(): void {
    console.log("🚀 Auto-sync DTO Example - Prisma + Zod Integration\n");
    console.log(
      "This demonstrates how DTOs stay automatically in sync with database schema changes!\n"
    );

    this.createExampleSoulChip();
    this.createExampleSkeleton();
    this.createExamplePart();
    this.createExampleBotState();
    this.demonstrateBotAssembly();
    this.demonstrateBotTypeValidation();
    this.demonstrateEnumValidation();

    console.log("🎉 All examples completed!");
    console.log("\n💡 Key Benefits:");
    console.log("   - ✅ Always in sync with database schema");
    console.log("   - ✅ Runtime validation with Zod");
    console.log("   - ✅ TypeScript type safety");
    console.log("   - ✅ Business logic validation");
    console.log("   - ✅ Zero manual maintenance");
  }
}
