import { Rarity, SkeletonType, MobilityType } from "../types";

/**
 * Interface defining the contract for all skeleton implementations
 */
export interface ISkeleton {
  readonly id: string;
  readonly type: SkeletonType;
  readonly rarity: Rarity;
  readonly slots: number;
  readonly baseDurability: number;
  readonly mobilityType: MobilityType;

  // Rarity-based calculations
  getRarityDurabilityBonus(): number;
  getRaritySlotBonus(): number;
  getEffectiveDurability(): number;
  getTotalSlots(): number;

  // Type-specific characteristics
  getTypeCharacteristics(): {
    speedModifier: number;
    defenseModifier: number;
    energyEfficiency: number;
    specialAbilities: string[];
  };

  // Mobility advantages
  getMobilityAdvantages(): string[];

  // Compatibility checks
  isCompatibleWithPart(partCategory: string): boolean;

  // Type-specific methods that each skeleton type can override
  getUniqueAbilities(): string[];
  getCombatBonuses(): { [key: string]: number };
  getEnergyEfficiencyModifier(): number;
  getSpecialMechanics(): { [key: string]: any };

  // Serialization
  toJSON(): object;
}

/**
 * Type-specific characteristics interface
 */
export interface SkeletonCharacteristics {
  speedModifier: number;
  defenseModifier: number;
  energyEfficiency: number;
  specialAbilities: string[];
  uniqueAbilities: string[];
  combatBonuses: { [key: string]: number };
  specialMechanics: { [key: string]: any };
}
