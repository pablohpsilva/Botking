/**
 * Simple example showing how the DTO package would work
 * This demonstrates the architecture without complex implementations
 */

import {
  SoulChipDTO,
  SkeletonDTO,
  PartDTO,
  BotDTO,
  RarityDTO,
  SkeletonTypeDTO,
  PartCategoryDTO,
} from "./interfaces/artifact-dto";
import {
  SoulChipDTOFactory,
  SkeletonDTOFactory,
  PartDTOFactory,
  BotDTOFactory,
} from "./factories/dto-factory";

/**
 * Example usage of the DTO system
 */
export class DTOExample {
  /**
   * Create a complete bot using DTOs
   */
  public static createExampleBot(): BotDTO {
    const soulChipFactory = new SoulChipDTOFactory();
    const skeletonFactory = new SkeletonDTOFactory();
    const partFactory = new PartDTOFactory();
    const botFactory = new BotDTOFactory();

    // Create soul chip
    const soulChip = soulChipFactory.createDefault({
      userId: "user123",
      name: "Advanced AI Core",
      personality: "strategic",
      rarity: RarityDTO.EPIC,
      baseStats: {
        intelligence: 85,
        resilience: 70,
        adaptability: 90,
      },
      specialTrait: "tactical_genius",
      learningRate: 0.8,
    });

    // Validate soul chip
    const soulChipValidation = soulChipFactory.validate(soulChip);

    // Create skeleton
    const skeleton = skeletonFactory.createDefault({
      userId: "user123",
      name: "Heavy Combat Frame",
      type: SkeletonTypeDTO.HEAVY,
      rarity: RarityDTO.RARE,
      slots: 6,
      baseDurability: 200,
    });

    // Validate skeleton
    const skeletonValidation = skeletonFactory.validate(skeleton);

    // Create parts
    const armPart = partFactory.createDefault({
      userId: "user123",
      name: "Combat Manipulator",
      category: PartCategoryDTO.ARM,
      rarity: RarityDTO.RARE,
      stats: {
        attack: 80,
        defense: 30,
        speed: 40,
        perception: 35,
        energyConsumption: 8,
      },
    });

    const legPart = partFactory.createDefault({
      userId: "user123",
      name: "Heavy Mobility System",
      category: PartCategoryDTO.LEG,
      rarity: RarityDTO.RARE,
      stats: {
        attack: 25,
        defense: 60,
        speed: 50,
        perception: 20,
        energyConsumption: 12,
      },
    });

    // Create bot
    const bot = botFactory.createDefault({
      ownerId: "user123",
      name: "Tactical Destroyer",
      botType: "PLAYABLE" as any,
      soulChipId: soulChip.id,
      skeletonId: skeleton.id,
      partIds: [armPart.id, legPart.id],
      expansionChipIds: [],
      stateId: "state123",
    });

    // Validate bot
    const botValidation = botFactory.validate(bot);

    return bot;
  }

  /**
   * Demonstrate DTO validation
   */
  public static demonstrateValidation(): { valid: any; invalid: any } {
    const factory = new SoulChipDTOFactory();

    // Valid DTO
    const validSoulChip = factory.createDefault({
      name: "Test Chip",
      userId: "user123",
    });

    const validResult = factory.validate(validSoulChip);

    // Invalid DTO
    const invalidSoulChip = factory.createFromData({
      name: "", // Invalid: empty name
      userId: "user123",
      learningRate: 1.5, // Invalid: > 1
      baseStats: {
        intelligence: 150, // Invalid: > 100
        resilience: -10, // Invalid: < 0
        adaptability: 50,
      },
    });

    const invalidResult = factory.validate(invalidSoulChip);

    return {
      valid: validResult,
      invalid: invalidResult,
    };
  }
}
