/**
 * SoulChip Factory - Artifact-First Approach
 *
 * This factory creates SoulChip artifacts and provides methods to convert them to DTOs
 * for database persistence. Artifacts are the primary objects, DTOs are for persistence.
 */

import { ArtifactDTOFactory } from "../base/artifact-dto-factory";
import { SoulChipDTO } from "../../interfaces/artifact-dto";
import { ValidationResult } from "../../interfaces/base-dto";
import {
  SoulChip,
  Rarity,
  PersonalityTraits,
  BaseStats,
} from "@botking/artifact";

/**
 * SoulChip DTO Factory - Works with artifacts as primary objects
 */
export class SoulChipDTOFactory extends ArtifactDTOFactory<
  SoulChip,
  SoulChipDTO
> {
  constructor() {
    super("soul-chip-factory");
  }

  // ==========================================
  // ARTIFACT CREATION METHODS (Primary)
  // ==========================================

  /**
   * Create a default SoulChip artifact
   */
  public createArtifact(overrides?: {
    name?: string;
    rarity?: Rarity;
    personality?: Partial<PersonalityTraits>;
    baseStats?: Partial<BaseStats>;
    specialTrait?: string;
  }): SoulChip {
    this.logger.debug("Creating default SoulChip artifact", overrides);

    const defaultPersonality: PersonalityTraits = {
      aggressiveness: 50,
      curiosity: 60,
      loyalty: 70,
      empathy: 55,
      independence: 45,
      dialogueStyle: "casual",
      ...overrides?.personality,
    };

    const defaultStats: BaseStats = {
      intelligence: 75,
      resilience: 65,
      adaptability: 70,
      ...overrides?.baseStats,
    };

    return new SoulChip(
      `soul_${Date.now()}`,
      overrides?.name || "Default Soul",
      overrides?.rarity || Rarity.COMMON,
      defaultPersonality,
      defaultStats,
      overrides?.specialTrait || "Basic AI personality"
    );
  }

  /**
   * Create a SoulChip from user data
   */
  public createFromData(data: any): SoulChipDTO {
    this.logger.debug("Creating SoulChip from data", { name: data.name });

    const soulChip = new SoulChip(
      `soul_${Date.now()}`,
      data.name,
      data.rarity,
      data.personality,
      data.baseStats,
      data.specialTrait
    );

    return this.artifactToDTO(soulChip);
  }

  /**
   * Create a high-intelligence SoulChip
   */
  public createHighIntelligenceArtifact(
    name: string,
    rarity: Rarity = Rarity.RARE
  ): SoulChip {
    return this.createArtifact({
      name,
      rarity,
      baseStats: {
        intelligence: 95,
        resilience: 70,
        adaptability: 85,
      },
      personality: {
        aggressiveness: 25,
        curiosity: 90,
        loyalty: 75,
        empathy: 65,
        independence: 80,
        dialogueStyle: "formal",
      },
      specialTrait: "Enhanced analytical capabilities",
    });
  }

  /**
   * Create an empathetic SoulChip
   */
  public createEmpatheticArtifact(
    name: string,
    rarity: Rarity = Rarity.UNCOMMON
  ): SoulChip {
    return this.createArtifact({
      name,
      rarity,
      personality: {
        aggressiveness: 15,
        curiosity: 70,
        loyalty: 90,
        empathy: 95,
        independence: 40,
        dialogueStyle: "casual",
      },
      specialTrait: "Deep emotional understanding",
    });
  }

  /**
   * Create a loyal companion SoulChip
   */
  public createLoyalCompanionArtifact(
    name: string,
    rarity: Rarity = Rarity.COMMON
  ): SoulChip {
    return this.createArtifact({
      name,
      rarity,
      personality: {
        aggressiveness: 30,
        curiosity: 50,
        loyalty: 95,
        empathy: 80,
        independence: 20,
        dialogueStyle: "casual",
      },
      baseStats: {
        intelligence: 65,
        resilience: 85,
        adaptability: 60,
      },
      specialTrait: "Unwavering loyalty and dedication",
    });
  }

  // ==========================================
  // VALIDATION METHODS
  // ==========================================

  public validate(dto: SoulChipDTO): ValidationResult {
    const errors: any[] = [];
    const warnings: any[] = [];

    // Validate name
    if (!dto.name || dto.name.trim().length === 0) {
      errors.push({ message: "SoulChip name cannot be empty" });
    }
    if (dto.name && dto.name.length > 100) {
      warnings.push({ message: "SoulChip name is very long" });
    }

    // Validate special trait
    if (!dto.specialTrait || dto.specialTrait.trim().length === 0) {
      warnings.push({ message: "SoulChip should have a special trait" });
    }

    // Basic validation for serialized fields
    try {
      JSON.parse(dto.personality);
      JSON.parse(dto.baseStats);
    } catch (e) {
      errors.push({ message: "Invalid JSON in personality or baseStats" });
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  }

  public validateArtifact(artifact: SoulChip): ValidationResult {
    const dto = this.artifactToDTO(artifact);
    return this.validate(dto);
  }

  // ==========================================
  // CONVERSION METHODS
  // ==========================================

  public artifactToDTO(artifact: SoulChip): SoulChipDTO {
    return {
      id: artifact.id,
      name: artifact.name,
      userId: "system", // Will be overridden when saving
      personality: JSON.stringify(artifact.personality),
      rarity: artifact.rarity,
      baseStats: JSON.stringify(artifact.baseStats),
      specialTrait: artifact.specialTrait,
      createdAt: new Date(),
      updatedAt: new Date(),
      version: 1,
      source: "artifact-factory",
      metadata: {},
    };
  }

  public dtoToArtifact(dto: SoulChipDTO): SoulChip {
    return new SoulChip(
      dto.id,
      dto.name,
      dto.rarity,
      JSON.parse(dto.personality),
      JSON.parse(dto.baseStats),
      dto.specialTrait
    );
  }

  public batchArtifactsToDTO(artifacts: SoulChip[]): SoulChipDTO[] {
    return artifacts.map((artifact) => this.artifactToDTO(artifact));
  }

  public batchDTOsToArtifacts(dtos: SoulChipDTO[]): SoulChip[] {
    return dtos.map((dto) => this.dtoToArtifact(dto));
  }
}
