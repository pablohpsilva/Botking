import { Rarity, BaseStats, PersonalityTraits } from "./types";

/**
 * Soul Chip - The core of the bot that defines individuality and emotional connection
 */
export class SoulChip {
  public readonly id: string;
  public readonly name: string;
  public readonly rarity: Rarity;
  public readonly personality: PersonalityTraits;
  public readonly baseStats: BaseStats;
  public readonly specialTrait: string;

  constructor(
    id: string,
    name: string,
    rarity: Rarity,
    personality: PersonalityTraits,
    baseStats: BaseStats,
    specialTrait: string
  ) {
    this.id = id;
    this.name = name;
    this.rarity = rarity;
    this.personality = personality;
    this.baseStats = baseStats;
    this.specialTrait = specialTrait;
  }

  /**
   * Get the total stat bonus based on rarity
   */
  public getRarityBonus(): number {
    switch (this.rarity) {
      case Rarity.UNCOMMON:
        return 1.1;
      case Rarity.RARE:
        return 1.25;
      case Rarity.EPIC:
        return 1.5;
      case Rarity.LEGENDARY:
        return 2.0;
      case Rarity.ULTRA_RARE:
        return 2.5;
      case Rarity.PROTOTYPE:
        return 3.0;
      case Rarity.COMMON:
      default:
        return 1.0;
    }
  }

  /**
   * Get modified base stats with rarity bonus applied
   */
  public getModifiedStats(): BaseStats {
    const bonus = this.getRarityBonus();
    return {
      intelligence: Math.floor(this.baseStats.intelligence * bonus),
      resilience: Math.floor(this.baseStats.resilience * bonus),
      adaptability: Math.floor(this.baseStats.adaptability * bonus),
    };
  }

  /**
   * Generate dialogue based on personality traits
   */
  public generateDialogue(context: string): string {
    const { aggressiveness, curiosity, loyalty, empathy, dialogueStyle } =
      this.personality;

    // Simple dialogue generation based on personality
    let dialogue = "";

    switch (dialogueStyle) {
      case "formal":
        dialogue = "I acknowledge your request, ";
        break;
      case "casual":
        dialogue = "Hey there! ";
        break;
      case "quirky":
        dialogue = "Oh my circuits! ";
        break;
      case "stoic":
        dialogue = "...";
        break;
      default:
        dialogue = "Hello, ";
    }

    // Modify based on traits
    if (curiosity > 70) {
      dialogue += "I'm curious about this situation. ";
    }
    if (loyalty > 80) {
      dialogue += "I'm here to help you! ";
    }
    if (empathy > 60) {
      dialogue += "I understand how you feel. ";
    }
    if (aggressiveness > 70) {
      dialogue += "Let's get this done quickly! ";
    }

    return dialogue + context;
  }

  /**
   * Check if this soul chip has a specific special trait
   */
  public hasSpecialTrait(trait: string): boolean {
    return this.specialTrait.toLowerCase().includes(trait.toLowerCase());
  }

  /**
   * Serialize the soul chip to JSON
   */
  public toJSON(): object {
    return {
      id: this.id,
      name: this.name,
      rarity: this.rarity,
      personality: this.personality,
      baseStats: this.baseStats,
      specialTrait: this.specialTrait,
    };
  }

  /**
   * Create a SoulChip from JSON data
   */
  public static fromJSON(data: any): SoulChip {
    return new SoulChip(
      data.id,
      data.name,
      data.rarity,
      data.personality,
      data.baseStats,
      data.specialTrait
    );
  }
}
