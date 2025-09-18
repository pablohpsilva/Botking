import { Rarity, PartCategory, CombatStats, Ability } from "../types";
import { BasePart } from "./base-part";
import { IPart } from "./part-interface";

/**
 * HeadPart - Specialized for perception, AI processing, and sensor capabilities
 */
export class HeadPart extends BasePart {
  constructor(
    id: string,
    rarity: Rarity,
    name: string,
    stats: CombatStats,
    abilities: Ability[] = [],
    upgradeLevel: number = 0
  ) {
    super(id, PartCategory.HEAD, rarity, name, stats, abilities, upgradeLevel);
  }

  public getCategoryBonuses(): { [key: string]: number } {
    return {
      perceptionBonus: 1.5,
      aiProcessingBonus: 1.2,
      sensorRangeBonus: 1.3,
      communicationBonus: 1.25,
      targetingBonus: 1.4,
    };
  }

  public getSpecializedCapabilities(): { [key: string]: any } {
    const bonuses = this.getCategoryBonuses();
    const upgradeLevel = this.upgradeLevel;

    return {
      sensorSuite: {
        visualRange:
          this.stats.perception * bonuses.sensorRangeBonus + upgradeLevel * 10,
        nightVision: 0.6 + upgradeLevel * 0.04,
        thermalImaging: upgradeLevel >= 4,
        motionDetection: 0.8 + upgradeLevel * 0.02,
        threatAssessment: bonuses.perceptionBonus + upgradeLevel * 0.05,
      },

      aiProcessing: {
        computationSpeed: bonuses.aiProcessingBonus + upgradeLevel * 0.1,
        patternRecognition: 0.7 + upgradeLevel * 0.03,
        decisionLatency: Math.max(0.1, 1 - upgradeLevel * 0.08),
        multitasking: 1 + upgradeLevel * 0.06,
        learningRate: 0.5 + upgradeLevel * 0.04,
      },

      targetingSystems: {
        accuracy: bonuses.targetingBonus + upgradeLevel * 0.05,
        trackingSpeed: 1 + upgradeLevel * 0.04,
        multiTargeting: Math.floor(1 + upgradeLevel / 3),
        predictionAlgorithm: 0.6 + upgradeLevel * 0.03,
        lockOnTime: Math.max(0.5, 2 - upgradeLevel * 0.1),
      },

      communication: {
        broadcastRange: bonuses.communicationBonus * 100 + upgradeLevel * 20,
        encryptionLevel: upgradeLevel * 2,
        channelCapacity: 2 + Math.floor(upgradeLevel / 2),
        interferenceResistance: 0.7 + upgradeLevel * 0.02,
        translationAccuracy: 0.8 + upgradeLevel * 0.015,
      },

      battleAnalysis:
        upgradeLevel >= 9
          ? {
              enabled: true,
              tacticsSuggestions: true,
              weaknessDetection: 0.8,
              combatPrediction: 0.7,
              strategicOverview: true,
            }
          : { enabled: false },

      mindLink:
        upgradeLevel >= 13
          ? {
              enabled: true,
              networkRange: 500,
              sharedProcessing: true,
              collectiveIntelligence: 1.5,
              coordinationBonus: 0.3,
            }
          : { enabled: false },
    };
  }

  public getOptimalUsageScenarios(): string[] {
    const scenarios = [
      "reconnaissance_missions",
      "sniper_operations",
      "tactical_coordination",
      "threat_detection",
      "ai_intensive_tasks",
    ];

    if (this.upgradeLevel >= 5) {
      scenarios.push("advanced_targeting", "multi_threat_tracking");
    }

    if (this.upgradeLevel >= 9) {
      scenarios.push("battle_analysis", "tactical_command");
    }

    if (this.upgradeLevel >= 13) {
      scenarios.push("mind_link_operations", "collective_consciousness");
    }

    if (this.rarity >= Rarity.LEGENDARY) {
      scenarios.push("precognitive_analysis", "quantum_processing");
    }

    return scenarios;
  }

  public getCompatibleSkeletonTypes(): string[] {
    return ["light", "balanced", "flying", "modular"]; // Intelligence-focused builds
  }

  public getSynergyBonus(otherPart: IPart): number {
    // Head provides coordination and targeting for all other parts
    if (otherPart.category === PartCategory.ARM) {
      return 0.12; // 12% synergy bonus for hand-eye coordination
    }

    if (otherPart.category === PartCategory.LEG) {
      return 0.08; // 8% synergy bonus for spatial awareness
    }

    if (otherPart.category === PartCategory.TORSO) {
      return 0.18; // 18% synergy bonus for central processing support
    }

    // Excellent synergy with accessories for enhanced systems
    if (otherPart.category === PartCategory.ACCESSORY) {
      return 0.15; // 15% synergy bonus for sensor integration
    }

    return super.getSynergyBonus(otherPart);
  }

  public getPerformanceMetrics(): { [key: string]: number } {
    const baseMetrics = super.getPerformanceMetrics();
    const capabilities = this.getSpecializedCapabilities();

    return {
      ...baseMetrics,
      perceptionRating: capabilities.sensorSuite.visualRange / 100,
      processingPower: capabilities.aiProcessing.computationSpeed,
      targetingAccuracy: capabilities.targetingSystems.accuracy,
      communicationRange: capabilities.communication.broadcastRange / 1000,
    };
  }

  /**
   * Perform threat assessment scan
   */
  public performThreatAssessment(
    targets: Array<{
      distance: number;
      size: string;
      movement: string;
      armor: string;
    }>
  ): Array<{
    threatLevel: number;
    priority: number;
    recommendations: string[];
    estimatedTime: number;
  }> {
    const capabilities = this.getSpecializedCapabilities();
    const sensors = capabilities.sensorSuite;

    return targets.map((target, index) => {
      let threatLevel = 0.5; // Base threat

      // Distance factor
      if (target.distance < 50) threatLevel += 0.3;
      else if (target.distance < 100) threatLevel += 0.1;

      // Size factor
      if (target.size === "large") threatLevel += 0.2;
      else if (target.size === "small") threatLevel -= 0.1;

      // Movement factor
      if (target.movement === "fast") threatLevel += 0.15;
      else if (target.movement === "erratic") threatLevel += 0.25;

      // Armor factor
      if (target.armor === "heavy") threatLevel += 0.2;
      else if (target.armor === "none") threatLevel -= 0.1;

      // Apply sensor capability
      threatLevel *= sensors.threatAssessment;

      const priority = Math.floor(threatLevel * 10);
      const recommendations: string[] = [];

      if (threatLevel > 0.8) {
        recommendations.push("Immediate engagement recommended");
      } else if (threatLevel > 0.6) {
        recommendations.push("High priority target");
      } else if (threatLevel > 0.4) {
        recommendations.push("Monitor closely");
      } else {
        recommendations.push("Low priority");
      }

      return {
        threatLevel: Math.min(1.0, threatLevel),
        priority,
        recommendations,
        estimatedTime: Math.ceil(10 / sensors.threatAssessment),
      };
    });
  }

  /**
   * Calculate targeting solution
   */
  public calculateTargetingSolution(target: {
    distance: number;
    velocity: { x: number; y: number; z: number };
    size: number;
    evasion: number;
  }): {
    accuracy: number;
    leadTime: number;
    lockTime: number;
    trackingDifficulty: number;
  } {
    const capabilities = this.getSpecializedCapabilities();
    const targeting = capabilities.targetingSystems;

    const distance = target.distance;
    const speed = Math.sqrt(
      target.velocity.x ** 2 + target.velocity.y ** 2 + target.velocity.z ** 2
    );

    // Base accuracy calculation
    let accuracy = targeting.accuracy;

    // Distance penalty
    accuracy *= Math.max(0.3, 1 - distance / 1000);

    // Speed penalty
    accuracy *= Math.max(0.4, 1 - speed / 100);

    // Size bonus/penalty
    accuracy *= 1 + (target.size - 1) * 0.2;

    // Evasion penalty
    accuracy *= Math.max(0.2, 1 - target.evasion);

    const leadTime = distance / 300 + speed * 0.01; // Simplified physics
    const lockTime = targeting.lockOnTime * (1 + target.evasion);
    const trackingDifficulty = (speed + target.evasion) / 2;

    return {
      accuracy: Math.min(0.95, Math.max(0.1, accuracy)),
      leadTime,
      lockTime,
      trackingDifficulty: Math.min(1.0, trackingDifficulty),
    };
  }

  /**
   * Analyze battle situation
   */
  public analyzeBattleSituation(battlefield: {
    allies: number;
    enemies: number;
    terrain: string;
    objectives: string[];
    timeRemaining: number;
  }): {
    tacticalAdvantage: number;
    recommendations: string[];
    riskAssessment: string;
    optimalStrategy: string;
  } {
    const capabilities = this.getSpecializedCapabilities();
    const analysis = capabilities.battleAnalysis;

    if (!analysis.enabled) {
      return {
        tacticalAdvantage: 0.5,
        recommendations: ["Upgrade required for battle analysis"],
        riskAssessment: "unknown",
        optimalStrategy: "basic_engagement",
      };
    }

    let advantage = 0.5;
    const recommendations: string[] = [];

    // Force ratio analysis
    const forceRatio = battlefield.allies / (battlefield.enemies || 1);
    if (forceRatio > 1.5) {
      advantage += 0.2;
      recommendations.push(
        "Numerical superiority - consider aggressive tactics"
      );
    } else if (forceRatio < 0.7) {
      advantage -= 0.2;
      recommendations.push("Outnumbered - consider defensive positioning");
    }

    // Terrain analysis
    if (battlefield.terrain === "advantageous") {
      advantage += 0.15;
      recommendations.push("Leverage terrain advantages");
    } else if (battlefield.terrain === "disadvantageous") {
      advantage -= 0.15;
      recommendations.push("Minimize terrain disadvantages");
    }

    // Time pressure
    if (battlefield.timeRemaining < 300) {
      // 5 minutes
      recommendations.push("Time critical - prioritize objectives");
    }

    let riskAssessment: string;
    if (advantage > 0.7) riskAssessment = "low";
    else if (advantage > 0.4) riskAssessment = "moderate";
    else riskAssessment = "high";

    let optimalStrategy: string;
    if (advantage > 0.6) optimalStrategy = "aggressive_advance";
    else if (advantage > 0.4) optimalStrategy = "balanced_approach";
    else optimalStrategy = "defensive_fallback";

    return {
      tacticalAdvantage: Math.min(1.0, Math.max(0.0, advantage)),
      recommendations,
      riskAssessment,
      optimalStrategy,
    };
  }

  /**
   * Check if mind link can be established
   */
  public canEstablishMindLink(targets: IPart[]): {
    capable: boolean;
    maxConnections: number;
    range: number;
    processingBoost: number;
  } {
    const capabilities = this.getSpecializedCapabilities();
    const mindLink = capabilities.mindLink;

    if (!mindLink.enabled) {
      return {
        capable: false,
        maxConnections: 0,
        range: 0,
        processingBoost: 0,
      };
    }

    const compatibleTargets = targets.filter(
      (target) =>
        target.category === PartCategory.HEAD &&
        (target as HeadPart).upgradeLevel >= 13
    );

    return {
      capable: true,
      maxConnections: Math.min(compatibleTargets.length, 5),
      range: mindLink.networkRange,
      processingBoost: mindLink.collectiveIntelligence,
    };
  }

  /**
   * Calculate sensor detection range for different conditions
   */
  public calculateDetectionRange(conditions: {
    weather: "clear" | "cloudy" | "stormy";
    timeOfDay: "day" | "night" | "dawn" | "dusk";
    interference: number; // 0-1
  }): {
    visualRange: number;
    thermalRange: number;
    motionRange: number;
    overallEffectiveness: number;
  } {
    const capabilities = this.getSpecializedCapabilities();
    const sensors = capabilities.sensorSuite;

    let baseRange = sensors.visualRange;
    let thermalMultiplier = 1.0;
    let motionMultiplier = 1.0;

    // Weather effects
    switch (conditions.weather) {
      case "clear":
        // No penalties
        break;
      case "cloudy":
        baseRange *= 0.8;
        thermalMultiplier *= 1.1; // Thermal works better
        break;
      case "stormy":
        baseRange *= 0.5;
        thermalMultiplier *= 0.7;
        motionMultiplier *= 1.3; // Motion detection less affected
        break;
    }

    // Time of day effects
    switch (conditions.timeOfDay) {
      case "day":
        // Optimal visual conditions
        break;
      case "night":
        baseRange *= sensors.nightVision;
        thermalMultiplier *= 1.5;
        break;
      case "dawn":
      case "dusk":
        baseRange *= 0.9;
        thermalMultiplier *= 1.2;
        break;
    }

    // Interference effects
    const interferenceReduction =
      1 -
      conditions.interference *
        (1 - capabilities.communication.interferenceResistance);
    baseRange *= interferenceReduction;

    const visualRange = Math.floor(baseRange);
    const thermalRange = sensors.thermalImaging
      ? Math.floor(baseRange * 0.7 * thermalMultiplier)
      : 0;
    const motionRange = Math.floor(baseRange * 1.2 * motionMultiplier);

    const overallEffectiveness =
      (visualRange + thermalRange + motionRange) / (baseRange * 2.9);

    return {
      visualRange,
      thermalRange,
      motionRange,
      overallEffectiveness: Math.min(1.0, overallEffectiveness),
    };
  }

  /**
   * Get recommended sensor equipment
   */
  public getRecommendedEquipment(): {
    primary: string[];
    secondary: string[];
    avoid: string[];
  } {
    const capabilities = this.getSpecializedCapabilities();

    const recommendations = {
      primary: ["advanced_optics", "ai_processors", "sensor_arrays"],
      secondary: [
        "communication_boosters",
        "data_storage",
        "targeting_computers",
      ],
      avoid: ["heavy_armor_head", "signal_jammers"],
    };

    if (capabilities.sensorSuite.visualRange > 200) {
      recommendations.primary.push("long_range_sensors", "telescopic_lenses");
    }

    if (capabilities.aiProcessing.computationSpeed > 2.0) {
      recommendations.primary.push("quantum_processors", "neural_networks");
    }

    if (capabilities.battleAnalysis.enabled) {
      recommendations.primary.push("tactical_computers", "strategy_modules");
    }

    if (capabilities.mindLink.enabled) {
      recommendations.primary.push(
        "network_interfaces",
        "consciousness_bridges"
      );
    }

    return recommendations;
  }

  /**
   * Calculate optimal upgrade path for head specialization
   */
  public getOptimalUpgradePath(): {
    nextUpgrade: number;
    reasoning: string;
    expectedImprovement: string;
  } {
    if (this.upgradeLevel < 9) {
      return {
        nextUpgrade: 9,
        reasoning: "Unlock battle analysis for tactical superiority",
        expectedImprovement:
          "Advanced tactical suggestions and combat prediction",
      };
    }

    if (this.upgradeLevel < 13) {
      return {
        nextUpgrade: 13,
        reasoning: "Unlock mind link for collective intelligence",
        expectedImprovement: "Network consciousness with 50% processing boost",
      };
    }

    if (this.upgradeLevel < this.getMaxUpgradeLevel()) {
      return {
        nextUpgrade: Math.min(this.upgradeLevel + 2, this.getMaxUpgradeLevel()),
        reasoning: "Enhance perception and processing capabilities",
        expectedImprovement: `${((this.upgradeLevel + 2) * 0.05 * 100).toFixed(1)}% additional targeting accuracy`,
      };
    }

    return {
      nextUpgrade: this.upgradeLevel,
      reasoning: "Already at maximum upgrade level",
      expectedImprovement:
        "Consider consciousness transcendence or quantum awareness modules",
    };
  }
}
