import { Rarity, SkeletonType, MobilityType } from "../types";
import { BaseSkeleton } from "./base-skeleton";

/**
 * Heavy Skeleton - Tanky and powerful, built for defense and heavy combat
 */
export class HeavySkeleton extends BaseSkeleton {
  constructor(
    id: string,
    rarity: Rarity,
    slots: number,
    baseDurability: number,
    mobilityType: MobilityType
  ) {
    super(id, SkeletonType.HEAVY, rarity, slots, baseDurability, mobilityType);
  }

  public getTypeCharacteristics(): {
    speedModifier: number;
    defenseModifier: number;
    energyEfficiency: number;
    specialAbilities: string[];
  } {
    return {
      speedModifier: 0.7,
      defenseModifier: 1.5,
      energyEfficiency: 0.8,
      specialAbilities: ["heavy_armor", "siege_mode"],
    };
  }

  public getUniqueAbilities(): string[] {
    return [
      "siege_deployment",
      "heavy_weaponry_mastery",
      "fortress_mode",
      "intimidation_presence",
      "devastating_charge",
    ];
  }

  public getCombatBonuses(): { [key: string]: number } {
    return {
      damageReduction: 0.25, // 25% damage reduction
      heavyWeaponBonus: 0.3, // 30% bonus with heavy weapons
      siegeEffectiveness: 0.4, // 40% more effective in siege mode
      intimidationFactor: 0.2, // 20% chance to intimidate enemies
      structuralStability: 0.35, // 35% resistance to knockdown/displacement
    };
  }

  public getSpecialMechanics(): { [key: string]: any } {
    return {
      canEnterSiegeMode: true,
      hasFortressMode: true,
      resistsKnockback: true,
      heavyWeaponSlots: 2, // Additional slots for heavy weapons
      siegeModeSetupTime: 5, // Time to enter siege mode in seconds
      fortressModeSetupTime: 10, // Time to enter fortress mode in seconds
      maxWeightCapacity: 2.0, // Can carry 2x normal weight
      chargeDistance: 15, // Maximum charge distance in meters
      intimidationRadius: 10, // Intimidation effect radius in meters
      armorThickness: 3, // Armor effectiveness multiplier
    };
  }

  public isCompatibleWithPart(partCategory: string): boolean {
    // Heavy skeletons prefer heavy parts but can use others with penalties
    if (partCategory.includes("light")) {
      return true; // Allow but may have reduced effectiveness
    }
    
    // Perfect compatibility with heavy parts
    if (partCategory.includes("heavy") || partCategory === "siege") {
      return true;
    }
    
    return super.isCompatibleWithPart(partCategory);
  }

  public getEnergyEfficiencyModifier(): number {
    // Heavy skeletons consume more energy but can store more
    const baseEfficiency = super.getEnergyEfficiencyModifier();
    return baseEfficiency * 0.9; // 10% less efficient
  }

  /**
   * Calculate optimal loadout suggestions for heavy skeleton
   */
  public getOptimalLoadout(): {
    recommendedParts: string[];
    avoidParts: string[];
    playstyle: string;
  } {
    return {
      recommendedParts: [
        "heavy_armor_plating",
        "siege_weapons",
        "defensive_systems",
        "power_amplifiers",
        "structural_reinforcement",
      ],
      avoidParts: [
        "stealth_modules",
        "speed_enhancers",
        "lightweight_components",
      ],
      playstyle: "fortress_siege",
    };
  }

  /**
   * Enter siege mode for enhanced combat effectiveness
   */
  public enterSiegeMode(): {
    bonuses: { [key: string]: number };
    penalties: { [key: string]: number };
    duration: number;
  } {
    return {
      bonuses: {
        attackPower: 0.4, // 40% increased attack power
        defenseRating: 0.3, // 30% increased defense
        accuracy: 0.25, // 25% increased accuracy
        damageReduction: 0.2, // Additional 20% damage reduction
      },
      penalties: {
        movementSpeed: -0.8, // 80% reduced movement (nearly immobile)
        evasion: -0.5, // 50% reduced evasion
        energyConsumption: 0.3, // 30% increased energy consumption
      },
      duration: 30, // Siege mode lasts 30 seconds
    };
  }

  /**
   * Enter fortress mode for maximum defensive capability
   */
  public enterFortressMode(): {
    bonuses: { [key: string]: number };
    penalties: { [key: string]: number };
    duration: number;
  } {
    return {
      bonuses: {
        defenseRating: 0.6, // 60% increased defense
        damageReduction: 0.4, // 40% damage reduction
        counterAttackChance: 0.3, // 30% chance to counter-attack
        areaOfEffect: 0.25, // 25% increased AOE for defensive abilities
      },
      penalties: {
        movementSpeed: -1.0, // Cannot move
        evasion: -0.7, // 70% reduced evasion
        energyConsumption: 0.5, // 50% increased energy consumption
      },
      duration: 60, // Fortress mode lasts 60 seconds
    };
  }

  /**
   * Perform a devastating charge attack
   */
  public performDevastatingCharge(
    distance: number,
    targetWeight: number
  ): {
    damage: number;
    knockbackDistance: number;
    energyCost: number;
    success: boolean;
  } {
    const maxDistance = this.getSpecialMechanics().chargeDistance;
    const actualDistance = Math.min(distance, maxDistance);
    
    if (actualDistance < 3) {
      return { damage: 0, knockbackDistance: 0, energyCost: 0, success: false };
    }

    const baseDamage = 100;
    const distanceMultiplier = actualDistance / maxDistance;
    const weightMultiplier = Math.max(0.5, 2.0 - targetWeight); // Less effective against heavy targets
    
    const damage = Math.floor(baseDamage * distanceMultiplier * weightMultiplier);
    const knockbackDistance = Math.floor(actualDistance * 0.5 * weightMultiplier);
    const energyCost = Math.floor(30 + (actualDistance * 2));

    return {
      damage,
      knockbackDistance,
      energyCost,
      success: true,
    };
  }

  /**
   * Calculate intimidation effect on nearby enemies
   */
  public calculateIntimidationEffect(
    enemyCount: number,
    averageEnemyMorale: number
  ): {
    affectedEnemies: number;
    moraleReduction: number;
    duration: number;
  } {
    const intimidationFactor = this.getCombatBonuses().intimidationFactor;
    const radius = this.getSpecialMechanics().intimidationRadius;
    
    const affectedEnemies = Math.min(enemyCount, Math.floor(radius / 2));
    const moraleReduction = Math.floor(intimidationFactor * 100 * (1 - averageEnemyMorale / 100));
    const duration = 15; // Intimidation lasts 15 seconds

    return {
      affectedEnemies,
      moraleReduction,
      duration,
    };
  }

  /**
   * Check if skeleton can support additional heavy equipment
   */
  public canSupportHeavyEquipment(currentWeight: number, additionalWeight: number): boolean {
    const maxCapacity = this.getSpecialMechanics().maxWeightCapacity * this.baseDurability;
    return (currentWeight + additionalWeight) <= maxCapacity;
  }

  /**
   * Calculate structural integrity under load
   */
  public calculateStructuralIntegrity(currentLoad: number): {
    integrityPercentage: number;
    performancePenalty: number;
    warningLevel: "safe" | "caution" | "danger" | "critical";
  } {
    const maxCapacity = this.getSpecialMechanics().maxWeightCapacity * this.baseDurability;
    const loadPercentage = currentLoad / maxCapacity;
    
    let integrityPercentage = 100;
    let performancePenalty = 0;
    let warningLevel: "safe" | "caution" | "danger" | "critical" = "safe";

    if (loadPercentage > 0.8) {
      integrityPercentage = Math.floor(100 - ((loadPercentage - 0.8) * 100));
      performancePenalty = (loadPercentage - 0.8) * 0.5;
      warningLevel = loadPercentage > 1.0 ? "critical" : loadPercentage > 0.95 ? "danger" : "caution";
    }

    return {
      integrityPercentage: Math.max(0, integrityPercentage),
      performancePenalty: Math.min(0.8, performancePenalty),
      warningLevel,
    };
  }
}
