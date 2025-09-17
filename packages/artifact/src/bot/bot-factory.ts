import { Bot } from "./bot";
import type {
  IBot,
  BotConfiguration,
  BotAssemblyResult,
} from "./bot-interface";
import { SoulChip } from "../soul-chip";
import { SkeletonFactory, ISkeleton } from "../skeleton";
import { PartFactory, IPart } from "../part";
import { ExpansionChipFactory, IExpansionChip } from "../expansion-chip";
import { BotStateFactory } from "../bot-state";
import {
  Rarity,
  SkeletonType,
  MobilityType,
  PartCategory,
  ExpansionChipEffect,
  BotLocation,
  BotType,
} from "../types";

/**
 * Factory for creating and assembling Bot artifacts
 * Provides various methods for bot creation with different configurations
 */
export class BotFactory {
  /**
   * Create a basic bot with minimal configuration
   */
  static createBasicBot(
    name: string,
    userId: string,
    skeletonType: SkeletonType = SkeletonType.BALANCED,
    botType: BotType = BotType.WORKER
  ): IBot {
    const config: BotConfiguration = {
      name,
      botType,
      userId,
      soulChip: BotFactory.createBasicSoulChip(name),
      skeleton: BotFactory.createBasicSkeleton(skeletonType),
      parts: [BotFactory.createBasicArmPart(), BotFactory.createBasicLegPart()],
      expansionChips: [],
      initialState: {
        energyLevel: 100,
        maintenanceLevel: 100,
        currentLocation: BotLocation.FACTORY,
        experience: 0,
      } as any,
    };

    return new Bot(config);
  }

  /**
   * Create a combat-focused bot
   */
  static createCombatBot(
    name: string,
    userId: string,
    combatRole: "assault" | "tank" | "sniper" | "scout" = "assault",
    botType: BotType = BotType.PLAYABLE
  ): IBot {
    let skeletonType: SkeletonType;
    let parts: IPart[];
    let chips: IExpansionChip[];

    switch (combatRole) {
      case "tank":
        skeletonType = SkeletonType.HEAVY;
        parts = [
          BotFactory.createCombatArmPart("heavy", 120, 40),
          BotFactory.createCombatLegPart("heavy", 60, 80),
          BotFactory.createArmorTorsoPart(),
          BotFactory.createTacticalHeadPart(),
        ];
        chips = [
          BotFactory.createExpansionChip(ExpansionChipEffect.DEFENSE_BUFF),
          BotFactory.createExpansionChip(ExpansionChipEffect.RESISTANCE),
        ];
        break;

      case "sniper":
        skeletonType = SkeletonType.LIGHT;
        parts = [
          BotFactory.createCombatArmPart("precision", 100, 20),
          BotFactory.createCombatLegPart("light", 80, 40),
          BotFactory.createSensorHeadPart(),
        ];
        chips = [
          BotFactory.createExpansionChip(ExpansionChipEffect.ATTACK_BUFF),
          BotFactory.createExpansionChip(ExpansionChipEffect.AI_UPGRADE),
        ];
        break;

      case "scout":
        skeletonType = SkeletonType.LIGHT; // Use light instead of flying for better compatibility
        parts = [
          BotFactory.createCombatArmPart("light", 60, 30),
          BotFactory.createCombatLegPart("light", 100, 30),
          BotFactory.createSensorHeadPart(),
        ];
        chips = [
          BotFactory.createExpansionChip(ExpansionChipEffect.SPEED_BUFF),
          BotFactory.createExpansionChip(ExpansionChipEffect.ENERGY_EFFICIENCY),
        ];
        break;

      default: // assault
        skeletonType = SkeletonType.BALANCED;
        parts = [
          BotFactory.createCombatArmPart("balanced", 90, 30),
          BotFactory.createCombatLegPart("balanced", 70, 50),
          BotFactory.createTacticalHeadPart(),
        ];
        chips = [
          BotFactory.createExpansionChip(ExpansionChipEffect.ATTACK_BUFF),
          BotFactory.createExpansionChip(ExpansionChipEffect.STAT_BOOST),
        ];
    }

    const config: BotConfiguration = {
      name,
      botType,
      userId,
      soulChip: BotFactory.createCombatSoulChip(name, combatRole),
      skeleton: BotFactory.createSkeleton(skeletonType, Rarity.RARE, 8),
      parts,
      expansionChips: chips,
      initialState: {
        energyLevel: 100,
        maintenanceLevel: 100,
        currentLocation: BotLocation.TRAINING,
        experience: 1000,
      } as any,
    };

    return new Bot(config);
  }

  /**
   * Create a utility/work bot
   */
  static createUtilityBot(
    name: string,
    userId: string,
    specialization:
      | "construction"
      | "mining"
      | "repair"
      | "transport" = "construction",
    botType: BotType = BotType.WORKER
  ): IBot {
    let parts: IPart[];
    let chips: IExpansionChip[];

    switch (specialization) {
      case "mining":
        parts = [
          BotFactory.createUtilityArmPart("drill", 40, 60),
          BotFactory.createCombatLegPart("heavy", 40, 80),
          BotFactory.createUtilityTorsoPart("storage"),
        ];
        chips = [
          BotFactory.createExpansionChip(ExpansionChipEffect.ENERGY_EFFICIENCY),
          BotFactory.createExpansionChip(ExpansionChipEffect.RESISTANCE),
        ];
        break;

      case "repair":
        parts = [
          BotFactory.createUtilityArmPart("manipulator", 20, 40),
          BotFactory.createCombatLegPart("balanced", 60, 50),
          BotFactory.createSensorHeadPart(),
        ];
        chips = [
          BotFactory.createExpansionChip(ExpansionChipEffect.AI_UPGRADE),
          BotFactory.createExpansionChip(ExpansionChipEffect.SPECIAL_ABILITY),
        ];
        break;

      case "transport":
        parts = [
          BotFactory.createUtilityArmPart("lifter", 30, 20),
          BotFactory.createCombatLegPart("heavy", 80, 60),
          BotFactory.createUtilityTorsoPart("cargo"),
        ];
        chips = [
          BotFactory.createExpansionChip(ExpansionChipEffect.SPEED_BUFF),
          BotFactory.createExpansionChip(ExpansionChipEffect.ENERGY_EFFICIENCY),
        ];
        break;

      default: // construction
        parts = [
          BotFactory.createUtilityArmPart("builder", 50, 40),
          BotFactory.createCombatLegPart("balanced", 60, 60),
          BotFactory.createTacticalHeadPart(),
        ];
        chips = [
          BotFactory.createExpansionChip(ExpansionChipEffect.STAT_BOOST),
          BotFactory.createExpansionChip(ExpansionChipEffect.SPECIAL_ABILITY),
        ];
    }

    const config: BotConfiguration = {
      name,
      botType,
      userId,
      soulChip: BotFactory.createUtilitySoulChip(name, specialization),
      skeleton: BotFactory.createSkeleton(
        SkeletonType.HEAVY,
        Rarity.UNCOMMON,
        6
      ),
      parts,
      expansionChips: chips,
      initialState: {
        energyLevel: 100,
        maintenanceLevel: 100,
        currentLocation: BotLocation.FACTORY,
        experience: 500,
      } as any,
    };

    return new Bot(config);
  }

  /**
   * Assemble a bot from existing components with validation
   */
  static assembleBot(config: BotConfiguration): BotAssemblyResult {
    const startTime = Date.now();
    const errors: string[] = [];
    const warnings: string[] = [];

    try {
      // Pre-assembly validation
      if (!config.name || config.name.trim().length === 0) {
        errors.push("Bot name is required");
      }

      if (!config.userId || config.userId.trim().length === 0) {
        errors.push("User ID is required");
      }

      if (!config.soulChip) {
        errors.push("Soul chip is required");
      }

      if (!config.skeleton) {
        errors.push("Skeleton is required");
      }

      // Check component compatibility
      if (config.parts && config.skeleton) {
        config.parts.forEach((part) => {
          if (!config.skeleton!.isCompatibleWithPart(part.category)) {
            errors.push(
              `Part ${part.name} (${part.category}) is incompatible with skeleton ${config.skeleton!.type}`
            );
          }
        });
      }

      // Check slot limits
      if (config.parts && config.expansionChips && config.skeleton) {
        const totalComponents =
          config.parts.length + config.expansionChips.length;
        if (totalComponents > config.skeleton.getTotalSlots()) {
          errors.push(
            `Too many components (${totalComponents}) for available slots (${config.skeleton.getTotalSlots()})`
          );
        }
      }

      if (errors.length > 0) {
        return {
          success: false,
          errors,
          warnings,
          metrics: {
            assemblyTime: Date.now() - startTime,
            compatibilityScore: 0,
            optimizationLevel: 0,
          },
        };
      }

      // Create the bot
      const bot = new Bot(config);
      const assemblyTime = Date.now() - startTime;

      // Calculate metrics
      const validation = bot.validateAssembly();
      warnings.push(...validation.warnings);

      const compatibilityScore = BotFactory.calculateCompatibilityScore(bot);
      const optimizationLevel = BotFactory.calculateOptimizationLevel(bot);

      return {
        success: true,
        bot,
        errors: [],
        warnings,
        metrics: {
          assemblyTime,
          compatibilityScore,
          optimizationLevel,
        },
      };
    } catch (error) {
      return {
        success: false,
        errors: [
          `Assembly failed: ${error instanceof Error ? error.message : String(error)}`,
        ],
        warnings,
        metrics: {
          assemblyTime: Date.now() - startTime,
          compatibilityScore: 0,
          optimizationLevel: 0,
        },
      };
    }
  }

  /**
   * Create a bot from JSON data
   */
  static fromJSON(data: any): IBot {
    // This would require implementing fromJSON methods for all components
    // For now, return a basic implementation
    const config: BotConfiguration = {
      id: data.id,
      name: data.name,
      botType: data.botType || BotType.WORKER, // Default to worker if not specified
      userId: data.userId,
      soulChip: new SoulChip(
        data.soulChip.id,
        data.soulChip.name,
        data.soulChip.rarity,
        data.soulChip.personality,
        data.soulChip.baseStats,
        data.soulChip.specialTrait
      ),
      skeleton: SkeletonFactory.createSkeleton(
        data.skeleton.type,
        data.skeleton.id,
        data.skeleton.rarity,
        data.skeleton.slots,
        data.skeleton.durability,
        data.skeleton.mobilityType
      ),
      // Parts and chips would need their own fromJSON implementations
      parts: data.parts
        ? data.parts.map((p: any) => PartFactory.fromJSON(p))
        : [],
      expansionChips: data.expansionChips
        ? data.expansionChips.map((c: any) => ExpansionChipFactory.fromJSON(c))
        : [],
      initialState: data.state,
      metadata: data.metadata,
    };

    return new Bot(config);
  }

  /**
   * Create a King bot - always requires an owner and player
   */
  static createKingBot(name: string, userId: string): IBot {
    const config: BotConfiguration = {
      name,
      botType: BotType.KING,
      userId,
      soulChip: BotFactory.createKingSoulChip(name),
      skeleton: BotFactory.createSkeleton(
        SkeletonType.MODULAR,
        Rarity.LEGENDARY,
        10
      ),
      parts: [
        BotFactory.createCombatArmPart("balanced", 100, 60),
        BotFactory.createCombatLegPart("balanced", 80, 70),
        BotFactory.createArmorTorsoPart(),
        BotFactory.createTacticalHeadPart(),
      ],
      expansionChips: [
        BotFactory.createExpansionChip(ExpansionChipEffect.AI_UPGRADE),
        BotFactory.createExpansionChip(ExpansionChipEffect.STAT_BOOST),
        BotFactory.createExpansionChip(ExpansionChipEffect.RESISTANCE),
      ],
      initialState: {
        energyLevel: 100,
        maintenanceLevel: 100,
        currentLocation: BotLocation.ARENA,
        experience: 10000,
      } as any,
    };

    return new Bot(config);
  }

  /**
   * Create a Rogue bot - never assigned to players
   */
  static createRogueBot(name: string): IBot {
    const config: BotConfiguration = {
      name,
      botType: BotType.ROGUE,
      userId: null,
      soulChip: BotFactory.createRogueSoulChip(name),
      skeleton: BotFactory.createSkeleton(SkeletonType.LIGHT, Rarity.RARE, 6),
      parts: [
        BotFactory.createCombatArmPart("light", 80, 30),
        BotFactory.createCombatLegPart("light", 90, 40),
        BotFactory.createSensorHeadPart(),
      ],
      expansionChips: [
        BotFactory.createExpansionChip(ExpansionChipEffect.SPEED_BUFF),
        BotFactory.createExpansionChip(ExpansionChipEffect.ENERGY_EFFICIENCY),
      ],
      initialState: {
        energyLevel: 100,
        maintenanceLevel: 100,
        currentLocation: BotLocation.IDLE,
        experience: 2000,
      } as any,
    };

    return new Bot(config);
  }

  /**
   * Create a GovBot - government/system bot, never assigned to players
   */
  static createGovBot(
    name: string,
    govType: "security" | "admin" | "maintenance" = "admin"
  ): IBot {
    const config: BotConfiguration = {
      name,
      botType: BotType.GOVBOT,
      userId: null,
      soulChip: BotFactory.createGovSoulChip(name, govType),
      skeleton: BotFactory.createSkeleton(
        SkeletonType.BALANCED,
        Rarity.EPIC,
        8
      ),
      parts: [
        BotFactory.createUtilityArmPart("manipulator", 50, 50),
        BotFactory.createCombatLegPart("balanced", 60, 60),
        BotFactory.createTacticalHeadPart(),
        BotFactory.createUtilityTorsoPart("storage"),
      ],
      expansionChips: [
        BotFactory.createExpansionChip(ExpansionChipEffect.AI_UPGRADE),
        BotFactory.createExpansionChip(ExpansionChipEffect.SPECIAL_ABILITY),
      ],
      initialState: {
        energyLevel: 100,
        maintenanceLevel: 100,
        currentLocation: BotLocation.FACTORY,
        experience: 5000,
      } as any,
    };

    return new Bot(config);
  }

  // Helper methods for creating specific components

  private static createBasicSoulChip(name: string): SoulChip {
    return new SoulChip(
      `soul_${Date.now()}`,
      `${name} AI Core`,
      Rarity.COMMON,
      {
        aggressiveness: 50,
        curiosity: 60,
        loyalty: 70,
        independence: 40,
        empathy: 50,
        dialogueStyle: "casual",
      },
      {
        intelligence: 15,
        resilience: 10,
        adaptability: 15,
      },
      "Basic Learning"
    );
  }

  private static createCombatSoulChip(name: string, role: string): SoulChip {
    const personalities = {
      assault: {
        aggressiveness: 80,
        curiosity: 40,
        loyalty: 90,
        independence: 60,
        empathy: 30,
        dialogueStyle: "direct",
      },
      tank: {
        aggressiveness: 60,
        curiosity: 30,
        loyalty: 95,
        independence: 40,
        empathy: 50,
        dialogueStyle: "stoic",
      },
      sniper: {
        aggressiveness: 40,
        curiosity: 80,
        loyalty: 85,
        independence: 90,
        empathy: 20,
        dialogueStyle: "analytical",
      },
      scout: {
        aggressiveness: 30,
        curiosity: 95,
        loyalty: 70,
        independence: 85,
        empathy: 40,
        dialogueStyle: "quick",
      },
    };

    return new SoulChip(
      `soul_${Date.now()}`,
      `${name} Combat AI`,
      Rarity.RARE,
      personalities[role as keyof typeof personalities] ||
        personalities.assault,
      {
        intelligence: 20,
        resilience: 18,
        adaptability: 22,
      },
      `Combat ${role} specialization`
    );
  }

  private static createUtilitySoulChip(
    name: string,
    specialization: string
  ): SoulChip {
    return new SoulChip(
      `soul_${Date.now()}`,
      `${name} Utility AI`,
      Rarity.UNCOMMON,
      {
        aggressiveness: 20,
        curiosity: 80,
        loyalty: 85,
        independence: 70,
        empathy: 60,
        dialogueStyle: "helpful",
      },
      {
        intelligence: 25,
        resilience: 15,
        adaptability: 20,
      },
      `${specialization} optimization`
    );
  }

  private static createBasicSkeleton(type: SkeletonType): ISkeleton {
    return SkeletonFactory.createSkeleton(
      type,
      `skeleton_${Date.now()}`,
      Rarity.COMMON,
      4,
      100,
      MobilityType.BIPEDAL
    );
  }

  private static createKingSoulChip(name: string): SoulChip {
    return new SoulChip(
      `soul_${Date.now()}`,
      `${name} Royal AI`,
      Rarity.LEGENDARY,
      {
        aggressiveness: 70,
        curiosity: 85,
        loyalty: 100,
        independence: 95,
        empathy: 80,
        dialogueStyle: "regal",
      },
      {
        intelligence: 35,
        resilience: 30,
        adaptability: 35,
      },
      "Divine Authority"
    );
  }

  private static createRogueSoulChip(name: string): SoulChip {
    return new SoulChip(
      `soul_${Date.now()}`,
      `${name} Rogue AI`,
      Rarity.RARE,
      {
        aggressiveness: 90,
        curiosity: 70,
        loyalty: 20,
        independence: 95,
        empathy: 15,
        dialogueStyle: "rebellious",
      },
      {
        intelligence: 25,
        resilience: 20,
        adaptability: 30,
      },
      "Unpredictable Behavior"
    );
  }

  private static createGovSoulChip(name: string, govType: string): SoulChip {
    const personalities = {
      security: {
        aggressiveness: 60,
        curiosity: 40,
        loyalty: 100,
        independence: 30,
        empathy: 25,
        dialogueStyle: "authoritative",
      },
      admin: {
        aggressiveness: 20,
        curiosity: 70,
        loyalty: 95,
        independence: 40,
        empathy: 60,
        dialogueStyle: "professional",
      },
      maintenance: {
        aggressiveness: 10,
        curiosity: 80,
        loyalty: 90,
        independence: 50,
        empathy: 70,
        dialogueStyle: "helpful",
      },
    };

    return new SoulChip(
      `soul_${Date.now()}`,
      `${name} Gov AI`,
      Rarity.EPIC,
      personalities[govType as keyof typeof personalities] ||
        personalities.admin,
      {
        intelligence: 30,
        resilience: 25,
        adaptability: 20,
      },
      `Government ${govType} protocols`
    );
  }

  private static createSkeleton(
    type: SkeletonType,
    rarity: Rarity,
    slots: number
  ): ISkeleton {
    const mobilityMap = {
      [SkeletonType.LIGHT]: MobilityType.BIPEDAL,
      [SkeletonType.BALANCED]: MobilityType.BIPEDAL,
      [SkeletonType.HEAVY]: MobilityType.TRACKED,
      [SkeletonType.FLYING]: MobilityType.WINGED,
      [SkeletonType.MODULAR]: MobilityType.HYBRID,
    };

    const durabilityMap = {
      [SkeletonType.LIGHT]: 80,
      [SkeletonType.BALANCED]: 100,
      [SkeletonType.HEAVY]: 150,
      [SkeletonType.FLYING]: 70,
      [SkeletonType.MODULAR]: 120,
    };

    return SkeletonFactory.createSkeleton(
      type,
      `skeleton_${Date.now()}`,
      rarity,
      slots,
      durabilityMap[type],
      mobilityMap[type]
    );
  }

  private static createBasicArmPart(): IPart {
    return PartFactory.createPart(
      PartCategory.ARM,
      `arm_${Date.now()}`,
      Rarity.COMMON,
      "Basic Manipulator",
      {
        attack: 20,
        defense: 10,
        speed: 15,
        perception: 10,
        energyConsumption: 8,
      },
      [],
      0
    );
  }

  private static createBasicLegPart(): IPart {
    return PartFactory.createPart(
      PartCategory.LEG,
      `leg_${Date.now()}`,
      Rarity.COMMON,
      "Basic Locomotion",
      {
        attack: 10,
        defense: 15,
        speed: 25,
        perception: 5,
        energyConsumption: 12,
      },
      [],
      0
    );
  }

  private static createCombatArmPart(
    type: string,
    attack: number,
    defense: number
  ): IPart {
    const names = {
      heavy: "Heavy Assault Cannon",
      precision: "Precision Rifle",
      light: "Light Plasma Gun",
      balanced: "Combat Rifle",
    };

    return PartFactory.createPart(
      PartCategory.ARM,
      `arm_${Date.now()}`,
      Rarity.RARE,
      names[type as keyof typeof names] || "Combat Weapon",
      {
        attack,
        defense,
        speed: Math.max(10, 50 - attack / 2),
        perception: Math.max(10, attack / 2),
        energyConsumption: Math.max(8, attack / 4),
      },
      [
        {
          id: `ability_${Date.now()}`,
          name: "Combat Strike",
          description: "Powerful combat strike",
          cooldown: 3,
          energyCost: 10,
          effect: JSON.stringify({ damage: attack * 1.2 }),
        },
      ],
      1
    );
  }

  private static createCombatLegPart(
    type: string,
    speed: number,
    defense: number
  ): IPart {
    const names = {
      heavy: "Armored Tracks",
      light: "Sprint Legs",
      balanced: "Combat Legs",
    };

    return PartFactory.createPart(
      PartCategory.LEG,
      `leg_${Date.now()}`,
      Rarity.RARE,
      names[type as keyof typeof names] || "Combat Mobility",
      {
        attack: Math.max(5, speed / 3),
        defense,
        speed,
        perception: Math.max(5, speed / 4),
        energyConsumption: Math.max(10, speed / 3),
      },
      type === "heavy"
        ? [
            {
              id: `ability_${Date.now()}`,
              name: "Ground Slam",
              description: "Area ground slam attack",
              cooldown: 5,
              energyCost: 15,
              effect: JSON.stringify({ damage: 60, aoe: true }),
            },
          ]
        : [],
      1
    );
  }

  private static createArmorTorsoPart(): IPart {
    return PartFactory.createPart(
      PartCategory.TORSO,
      `torso_${Date.now()}`,
      Rarity.RARE,
      "Heavy Armor Plating",
      {
        attack: 5,
        defense: 80,
        speed: -10,
        perception: 10,
        energyConsumption: 15,
      },
      [
        {
          id: `ability_${Date.now()}`,
          name: "Damage Reduction",
          description: "Reduces incoming damage",
          cooldown: 0,
          energyCost: 0,
          effect: JSON.stringify({ reduction: 0.2 }),
        },
      ],
      1
    );
  }

  private static createTacticalHeadPart(): IPart {
    return PartFactory.createPart(
      PartCategory.HEAD,
      `head_${Date.now()}`,
      Rarity.RARE,
      "Tactical Sensor Array",
      {
        attack: 10,
        defense: 20,
        speed: 5,
        perception: 50,
        energyConsumption: 10,
      },
      [
        {
          id: `ability_${Date.now()}`,
          name: "Target Analysis",
          description: "Improves targeting accuracy",
          cooldown: 3,
          energyCost: 5,
          effect: JSON.stringify({ accuracy: 1.3 }),
        },
      ],
      1
    );
  }

  private static createSensorHeadPart(): IPart {
    return PartFactory.createPart(
      PartCategory.HEAD,
      `head_${Date.now()}`,
      Rarity.EPIC,
      "Advanced Sensor Suite",
      {
        attack: 5,
        defense: 15,
        speed: 0,
        perception: 80,
        energyConsumption: 12,
      },
      [
        {
          id: `ability_${Date.now()}`,
          name: "Long Range Scan",
          description: "Extended sensor range",
          cooldown: 8,
          energyCost: 12,
          effect: JSON.stringify({ range: 2.0 }),
        },
      ],
      2
    );
  }

  private static createUtilityArmPart(
    type: string,
    attack: number,
    defense: number
  ): IPart {
    const names = {
      drill: "Mining Drill Array",
      manipulator: "Precision Manipulator",
      lifter: "Heavy Lifter Arm",
      builder: "Construction Tool Set",
    };

    return PartFactory.createPart(
      PartCategory.ARM,
      `arm_${Date.now()}`,
      Rarity.UNCOMMON,
      names[type as keyof typeof names] || "Utility Tool",
      {
        attack,
        defense,
        speed: Math.max(5, 30 - defense / 2),
        perception: Math.max(15, attack + 10),
        energyConsumption: Math.max(8, attack / 2),
      },
      [
        {
          id: `ability_${Date.now()}`,
          name: `${type} Operation`,
          description: `Specialized ${type} operation`,
          cooldown: 2,
          energyCost: 8,
          effect: JSON.stringify({ efficiency: 1.5 }),
        },
      ],
      0
    );
  }

  private static createUtilityTorsoPart(type: string): IPart {
    const names = {
      storage: "Expanded Storage Bay",
      cargo: "Heavy Cargo Container",
    };

    return PartFactory.createPart(
      PartCategory.TORSO,
      `torso_${Date.now()}`,
      Rarity.UNCOMMON,
      names[type as keyof typeof names] || "Utility Chassis",
      {
        attack: 0,
        defense: 40,
        speed: -5,
        perception: 5,
        energyConsumption: 8,
      },
      [
        {
          id: `ability_${Date.now()}`,
          name: `${type} Capacity`,
          description: `Enhanced ${type} capacity`,
          cooldown: 0,
          energyCost: 0,
          effect: JSON.stringify({ capacity: 2.0 }),
        },
      ],
      0
    );
  }

  private static createExpansionChip(
    effect: ExpansionChipEffect
  ): IExpansionChip {
    return ExpansionChipFactory.createExpansionChip(
      effect,
      `chip_${Date.now()}`,
      `${effect} Enhancer`,
      Rarity.UNCOMMON,
      `Provides ${effect} enhancement`,
      1
    );
  }

  // Utility methods for metrics calculation

  private static calculateCompatibilityScore(bot: IBot): number {
    const validation = bot.validateAssembly();
    if (!validation.valid) {
      return 0;
    }

    let score = 100;

    // Penalty for warnings
    score -= validation.warnings.length * 10;

    // Bonus for optimal slot usage
    const slotUsage = bot.usedSlots / bot.totalSlots;
    if (slotUsage >= 0.8) {
      score += 20;
    } else if (slotUsage >= 0.6) {
      score += 10;
    }

    // Bonus for balanced stats
    const stats = bot.aggregatedStats;
    const maxStat = Math.max(
      stats.attack,
      stats.defense,
      stats.speed,
      stats.perception
    );
    const minStat = Math.min(
      stats.attack,
      stats.defense,
      stats.speed,
      stats.perception
    );
    const balance = 1 - (maxStat - minStat) / maxStat;
    score += balance * 30;

    return Math.max(0, Math.min(100, Math.round(score)));
  }

  private static calculateOptimizationLevel(bot: IBot): number {
    const metrics = bot.getPerformanceMetrics();
    return Math.round(
      (metrics.efficiency + metrics.reliability + metrics.versatility) / 3
    );
  }
}
