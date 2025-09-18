import { Rarity, SkeletonType, MobilityType } from "../types";
import { BaseSkeleton } from "./base-skeleton";

/**
 * Flying Skeleton - Aerial superiority and mobility, dominates vertical space
 */
export class FlyingSkeleton extends BaseSkeleton {
  constructor(
    id: string,
    rarity: Rarity,
    slots: number,
    baseDurability: number,
    mobilityType: MobilityType
  ) {
    super(id, SkeletonType.FLYING, rarity, slots, baseDurability, mobilityType);
  }

  public getTypeCharacteristics(): {
    speedModifier: number;
    defenseModifier: number;
    energyEfficiency: number;
    specialAbilities: string[];
  } {
    return {
      speedModifier: 1.4,
      defenseModifier: 0.9,
      energyEfficiency: 0.7,
      specialAbilities: ["aerial_movement", "dive_attack"],
    };
  }

  public getUniqueAbilities(): string[] {
    return [
      "three_dimensional_movement",
      "aerial_supremacy",
      "dive_bombing",
      "altitude_advantage",
      "vertical_escape",
    ];
  }

  public getCombatBonuses(): { [key: string]: number } {
    return {
      aerialAdvantage: 0.3, // 30% bonus when attacking from above
      diveAttackDamage: 0.4, // 40% bonus damage on dive attacks
      verticalMobility: 0.5, // 50% bonus to vertical movement speed
      evasionInAir: 0.25, // 25% increased evasion while airborne
      reconnaissance: 0.35, // 35% better reconnaissance capabilities
    };
  }

  public getSpecialMechanics(): { [key: string]: any } {
    return {
      canFly: true,
      hasVerticalMovement: true,
      requiresAirspace: true,
      maxAltitude: 1000, // Maximum flying altitude in meters
      flightSpeed: 150, // Flight speed in km/h
      diveBombRange: 50, // Dive bomb effective range in meters
      energyPerSecondFlight: 5, // Energy consumption per second while flying
      landingTime: 2, // Time required to land in seconds
      takeoffTime: 3, // Time required to take off in seconds
      windResistance: 0.8, // Resistance to wind effects (0-1)
      altitudeZones: ["ground", "low", "medium", "high"], // Available altitude zones
    };
  }

  public isCompatibleWithPart(partCategory: string): boolean {
    // Flying skeletons can't use ground-based leg parts
    if (partCategory === "leg" && !partCategory.includes("landing_gear")) {
      return false;
    }

    // Weight restrictions for flight capability
    if (
      partCategory.includes("heavy") &&
      !partCategory.includes("flight_rated")
    ) {
      return false;
    }

    // Prefer aerodynamic and lightweight components
    return super.isCompatibleWithPart(partCategory);
  }

  public getEnergyEfficiencyModifier(): number {
    // Flying consumes more energy but can be very efficient in certain conditions
    const baseEfficiency = super.getEnergyEfficiencyModifier();
    return baseEfficiency * 0.85; // 15% less efficient due to flight energy costs
  }

  /**
   * Calculate optimal loadout suggestions for flying skeleton
   */
  public getOptimalLoadout(): {
    recommendedParts: string[];
    avoidParts: string[];
    playstyle: string;
  } {
    return {
      recommendedParts: [
        "lightweight_armor",
        "aerial_weapons",
        "flight_stabilizers",
        "reconnaissance_systems",
        "aerodynamic_components",
      ],
      avoidParts: [
        "heavy_armor",
        "ground_based_systems",
        "static_defenses",
        "melee_weapons",
      ],
      playstyle: "aerial_strike",
    };
  }

  /**
   * Calculate flight performance based on current load and conditions
   */
  public calculateFlightPerformance(
    currentWeight: number,
    weather: { windSpeed: number; visibility: number; turbulence: number },
    altitude: number
  ): {
    flightEfficiency: number;
    maxSpeed: number;
    energyConsumption: number;
    stabilityRating: number;
  } {
    const baseWeight = this.baseDurability;
    const weightRatio = currentWeight / baseWeight;
    const altitudeFactor = Math.max(
      0.5,
      1 - (altitude / this.getSpecialMechanics().maxAltitude) * 0.3
    );

    // Calculate efficiency penalties
    const weightPenalty = Math.max(0, (weightRatio - 1) * 0.5);
    const windPenalty = weather.windSpeed / 100;
    const turbulencePenalty = weather.turbulence * 0.3;

    const flightEfficiency = Math.max(
      0.2,
      1 - weightPenalty - windPenalty - turbulencePenalty
    );
    const maxSpeed = Math.floor(
      this.getSpecialMechanics().flightSpeed * flightEfficiency * altitudeFactor
    );
    const energyConsumption = Math.ceil(
      this.getSpecialMechanics().energyPerSecondFlight * (2 - flightEfficiency)
    );
    const stabilityRating = Math.floor(
      this.getSpecialMechanics().windResistance *
        weather.visibility *
        (1 - weather.turbulence) *
        100
    );

    return {
      flightEfficiency: Math.round(flightEfficiency * 100) / 100,
      maxSpeed,
      energyConsumption,
      stabilityRating,
    };
  }

  /**
   * Perform a dive attack with altitude advantage
   */
  public performDiveAttack(
    currentAltitude: number,
    targetDistance: number,
    targetType: "ground" | "air"
  ): {
    damage: number;
    accuracy: number;
    energyCost: number;
    success: boolean;
  } {
    const maxRange = this.getSpecialMechanics().diveBombRange;
    const minAltitude = targetType === "ground" ? 20 : 10;

    if (currentAltitude < minAltitude || targetDistance > maxRange) {
      return { damage: 0, accuracy: 0, energyCost: 0, success: false };
    }

    const altitudeBonus = Math.min(2.0, currentAltitude / 50); // Max 2x bonus at 50m+
    const distancePenalty = targetDistance / maxRange;
    const targetTypeMultiplier = targetType === "ground" ? 1.2 : 0.8;

    const baseDamage = 120;
    const damage = Math.floor(
      baseDamage *
        altitudeBonus *
        (1 - distancePenalty * 0.3) *
        targetTypeMultiplier
    );
    const accuracy = Math.floor(90 * (1 - distancePenalty * 0.4));
    const energyCost = Math.floor(25 + currentAltitude * 0.5);

    return {
      damage,
      accuracy,
      energyCost,
      success: true,
    };
  }

  /**
   * Calculate aerial reconnaissance effectiveness
   */
  public performReconnaissance(
    altitude: number,
    weather: { visibility: number; cloudCover: number },
    scanRadius: number
  ): {
    detectionRange: number;
    accuracyRating: number;
    detectedTargets: number;
    energyCost: number;
  } {
    const reconBonus = this.getCombatBonuses().reconnaissance;
    const altitudeFactor = Math.min(2.0, altitude / 100);
    const visibilityFactor = weather.visibility;
    const cloudPenalty = weather.cloudCover * 0.3;

    const effectiveRange = Math.floor(
      scanRadius * altitudeFactor * visibilityFactor * (1 - cloudPenalty)
    );
    const accuracyRating = Math.floor(
      85 * (1 + reconBonus) * visibilityFactor * (1 - cloudPenalty)
    );
    const detectedTargets = Math.floor(effectiveRange / 50); // Rough estimate
    const energyCost = Math.floor(15 + effectiveRange * 0.1);

    return {
      detectionRange: effectiveRange,
      accuracyRating: Math.min(100, accuracyRating),
      detectedTargets,
      energyCost,
    };
  }

  /**
   * Calculate landing requirements and safety
   */
  public calculateLandingRequirements(
    landingZone: {
      size: number;
      obstacles: number;
      surface: "hard" | "soft" | "water";
    },
    currentSpeed: number,
    weather: { windSpeed: number; visibility: number }
  ): {
    canLand: boolean;
    landingDifficulty: "easy" | "moderate" | "difficult" | "impossible";
    requiredDistance: number;
    safetyRating: number;
  } {
    const minLandingSize = 20; // Minimum landing zone size in meters
    const maxSafeSpeed = 80; // Maximum safe landing speed in km/h

    const speedPenalty = Math.max(
      0,
      (currentSpeed - maxSafeSpeed) / maxSafeSpeed
    );
    const obstaclePenalty = landingZone.obstacles * 0.2;
    const weatherPenalty =
      weather.windSpeed / 50 + (1 - weather.visibility) * 0.5;
    const surfaceBonus =
      landingZone.surface === "hard"
        ? 0
        : landingZone.surface === "soft"
          ? 0.1
          : -0.3;

    const difficultyScore =
      speedPenalty + obstaclePenalty + weatherPenalty - surfaceBonus;
    const requiredDistance = Math.ceil(
      30 + currentSpeed * 0.5 + difficultyScore * 20
    );
    const safetyRating = Math.max(0, Math.floor(100 - difficultyScore * 50));

    let landingDifficulty: "easy" | "moderate" | "difficult" | "impossible";
    if (difficultyScore < 0.3) landingDifficulty = "easy";
    else if (difficultyScore < 0.6) landingDifficulty = "moderate";
    else if (difficultyScore < 1.0) landingDifficulty = "difficult";
    else landingDifficulty = "impossible";

    const canLand =
      landingZone.size >= requiredDistance && difficultyScore < 1.0;

    return {
      canLand,
      landingDifficulty,
      requiredDistance,
      safetyRating,
    };
  }

  /**
   * Get optimal altitude for different combat scenarios
   */
  public getOptimalAltitude(
    scenario:
      | "reconnaissance"
      | "dive_attack"
      | "evasion"
      | "energy_conservation"
  ): {
    recommendedAltitude: number;
    reasoning: string;
    energyImpact: string;
  } {
    const altitudeRecommendations = {
      reconnaissance: {
        recommendedAltitude: 200,
        reasoning:
          "High altitude provides maximum visibility and detection range",
        energyImpact: "High energy consumption but maximum effectiveness",
      },
      dive_attack: {
        recommendedAltitude: 100,
        reasoning:
          "Optimal altitude for dive bomb attacks with good damage and accuracy",
        energyImpact: "Moderate energy consumption for positioning",
      },
      evasion: {
        recommendedAltitude: 300,
        reasoning:
          "High altitude makes targeting difficult for ground-based threats",
        energyImpact: "High energy consumption but maximum safety",
      },
      energy_conservation: {
        recommendedAltitude: 50,
        reasoning:
          "Low altitude reduces energy consumption while maintaining flight capability",
        energyImpact: "Minimal energy consumption for sustained operations",
      },
    };

    return altitudeRecommendations[scenario];
  }
}
