import { Rarity, SkeletonType, MobilityType } from "../types";
import { ISkeleton, SkeletonCharacteristics } from "./skeleton-interface";

/**
 * Abstract base class providing common skeleton functionality
 */
export abstract class BaseSkeleton implements ISkeleton {
  public readonly id: string;
  public readonly type: SkeletonType;
  public readonly rarity: Rarity;
  public readonly slots: number;
  public readonly baseDurability: number;
  public readonly mobilityType: MobilityType;

  constructor(
    id: string,
    type: SkeletonType,
    rarity: Rarity,
    slots: number,
    baseDurability: number,
    mobilityType: MobilityType
  ) {
    this.id = id;
    this.type = type;
    this.rarity = rarity;
    this.slots = slots;
    this.baseDurability = baseDurability;
    this.mobilityType = mobilityType;
  }

  /**
   * Get durability bonus based on rarity
   */
  public getRarityDurabilityBonus(): number {
    switch (this.rarity) {
      case Rarity.UNCOMMON:
        return 1.15;
      case Rarity.RARE:
        return 1.3;
      case Rarity.EPIC:
        return 1.5;
      case Rarity.LEGENDARY:
        return 1.8;
      case Rarity.ULTRA_RARE:
        return 2.2;
      case Rarity.PROTOTYPE:
        return 2.5;
      case Rarity.COMMON:
      default:
        return 1.0;
    }
  }

  /**
   * Get additional slots based on rarity
   */
  public getRaritySlotBonus(): number {
    switch (this.rarity) {
      case Rarity.UNCOMMON:
        return 0;
      case Rarity.RARE:
        return 1;
      case Rarity.EPIC:
        return 1;
      case Rarity.LEGENDARY:
        return 2;
      case Rarity.ULTRA_RARE:
        return 2;
      case Rarity.PROTOTYPE:
        return 3;
      case Rarity.COMMON:
      default:
        return 0;
    }
  }

  /**
   * Get the total effective durability
   */
  public getEffectiveDurability(): number {
    return Math.floor(this.baseDurability * this.getRarityDurabilityBonus());
  }

  /**
   * Get the total number of slots available
   */
  public getTotalSlots(): number {
    return this.slots + this.getRaritySlotBonus();
  }

  /**
   * Get mobility-specific advantages
   */
  public getMobilityAdvantages(): string[] {
    switch (this.mobilityType) {
      case MobilityType.WHEELED:
        return ["high_speed_travel", "efficient_energy_use", "smooth_surfaces"];
      case MobilityType.BIPEDAL:
        return ["versatile_movement", "climbing_ability", "tool_usage"];
      case MobilityType.WINGED:
        return ["flight", "aerial_maneuvers", "high_ground_advantage"];
      case MobilityType.TRACKED:
        return ["all_terrain", "stability", "heavy_load_capacity"];
      case MobilityType.HYBRID:
        return [
          "adaptive_movement",
          "multi_environment",
          "configuration_flexibility",
        ];
      default:
        return [];
    }
  }

  /**
   * Basic compatibility check - can be overridden by specific skeleton types
   */
  public isCompatibleWithPart(partCategory: string): boolean {
    // Default compatibility - specific skeletons can override this
    return true;
  }

  /**
   * Get energy efficiency modifier - can be overridden for fine-tuning
   */
  public getEnergyEfficiencyModifier(): number {
    return this.getTypeCharacteristics().energyEfficiency;
  }

  /**
   * Serialize the skeleton to JSON
   */
  public toJSON(): object {
    return {
      id: this.id,
      type: this.type,
      rarity: this.rarity,
      slots: this.slots,
      baseDurability: this.baseDurability,
      mobilityType: this.mobilityType,
      className: this.constructor.name,
    };
  }

  // Abstract methods that must be implemented by concrete skeleton classes

  /**
   * Get type-specific characteristics - must be implemented by each skeleton type
   */
  public abstract getTypeCharacteristics(): {
    speedModifier: number;
    defenseModifier: number;
    energyEfficiency: number;
    specialAbilities: string[];
  };

  /**
   * Get unique abilities specific to this skeleton type
   */
  public abstract getUniqueAbilities(): string[];

  /**
   * Get combat bonuses specific to this skeleton type
   */
  public abstract getCombatBonuses(): { [key: string]: number };

  /**
   * Get special mechanics unique to this skeleton type
   */
  public abstract getSpecialMechanics(): { [key: string]: any };

  /**
   * Get complete characteristics including unique elements
   */
  public getCompleteCharacteristics(): SkeletonCharacteristics {
    const baseCharacteristics = this.getTypeCharacteristics();
    return {
      ...baseCharacteristics,
      uniqueAbilities: this.getUniqueAbilities(),
      combatBonuses: this.getCombatBonuses(),
      specialMechanics: this.getSpecialMechanics(),
    };
  }
}
