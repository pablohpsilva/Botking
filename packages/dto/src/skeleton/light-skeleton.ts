import { Rarity, SkeletonType, MobilityType } from "../types";
import { BaseSkeleton } from "./base-skeleton";

/**
 * Light Skeleton - Fast and agile, optimized for speed and stealth
 */
export class LightSkeleton extends BaseSkeleton {
  constructor(
    id: string,
    rarity: Rarity,
    slots: number,
    baseDurability: number,
    mobilityType: MobilityType
  ) {
    super(id, SkeletonType.LIGHT, rarity, slots, baseDurability, mobilityType);
  }

  public getTypeCharacteristics(): {
    speedModifier: number;
    defenseModifier: number;
    energyEfficiency: number;
    specialAbilities: string[];
  } {
    return {
      speedModifier: 1.3,
      defenseModifier: 0.8,
      energyEfficiency: 1.2,
      specialAbilities: ["quick_dodge", "stealth_mode"],
    };
  }

  public getUniqueAbilities(): string[] {
    return [
      "evasive_maneuvers",
      "silent_movement",
      "speed_burst",
      "energy_conservation",
      "light_weight_advantage",
    ];
  }

  public getCombatBonuses(): { [key: string]: number } {
    return {
      dodgeChance: 0.15, // 15% increased dodge chance
      criticalHitChance: 0.1, // 10% increased critical hit chance
      movementSpeed: 0.3, // 30% increased movement speed
      energyRegeneration: 0.2, // 20% faster energy regeneration
      stealthEffectiveness: 0.25, // 25% better stealth
    };
  }

  public getSpecialMechanics(): { [key: string]: any } {
    return {
      canDoubleJump: true,
      hasStealthMode: true,
      energyRegenWhileIdle: 1.5, // 1.5x energy regen when not in combat
      weightLimit: 0.7, // Can only carry 70% of normal weight
      speedBoostDuration: 10, // Speed boost lasts 10 seconds
      stealthCooldown: 30, // Stealth ability cooldown in seconds
      evasionWindow: 0.5, // Time window for perfect evasion in seconds
    };
  }

  public isCompatibleWithPart(partCategory: string): boolean {
    // Light skeletons can't use heavy parts
    if (partCategory.includes("heavy")) {
      return false;
    }

    // Light skeletons prefer lightweight parts
    if (partCategory === "torso" && !partCategory.includes("light")) {
      return true; // Allow but with penalties
    }

    return super.isCompatibleWithPart(partCategory);
  }

  public getEnergyEfficiencyModifier(): number {
    // Light skeletons are more energy efficient
    const baseEfficiency = super.getEnergyEfficiencyModifier();
    return baseEfficiency * 1.1; // 10% more efficient
  }

  /**
   * Calculate optimal loadout suggestions for light skeleton
   */
  public getOptimalLoadout(): {
    recommendedParts: string[];
    avoidParts: string[];
    playstyle: string;
  } {
    return {
      recommendedParts: [
        "light_armor",
        "precision_weapons",
        "mobility_enhancers",
        "stealth_modules",
        "energy_cells",
      ],
      avoidParts: [
        "heavy_armor",
        "siege_weapons",
        "static_defenses",
        "bulk_storage",
      ],
      playstyle: "hit_and_run",
    };
  }

  /**
   * Check if the skeleton can perform a speed burst
   */
  public canPerformSpeedBurst(currentEnergy: number): boolean {
    const requiredEnergy = 20;
    return currentEnergy >= requiredEnergy;
  }

  /**
   * Calculate stealth effectiveness based on current conditions
   */
  public calculateStealthEffectiveness(environmentalFactors: {
    lighting: number;
    cover: number;
    noise: number;
  }): number {
    const baseEffectiveness = this.getCombatBonuses().stealthEffectiveness;
    const lightingBonus = (1 - environmentalFactors.lighting) * 0.2;
    const coverBonus = environmentalFactors.cover * 0.3;
    const noiseBonus = (1 - environmentalFactors.noise) * 0.1;

    return Math.min(
      1.0,
      baseEffectiveness + lightingBonus + coverBonus + noiseBonus
    );
  }
}
