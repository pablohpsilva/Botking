import { Rarity, ExpansionChipEffect } from "../types";
import { BaseExpansionChip } from "./base-expansion-chip";
import { EffectApplication, IExpansionChip } from "./expansion-chip-interface";

/**
 * AIUpgradeChip - Enhances AI processing capabilities and decision-making
 */
export class AIUpgradeChip extends BaseExpansionChip {
  constructor(
    id: string,
    name: string,
    rarity: Rarity,
    description: string,
    upgradeLevel: number = 0
  ) {
    super(
      id,
      name,
      ExpansionChipEffect.AI_UPGRADE,
      rarity,
      description,
      upgradeLevel
    );
  }

  public getEffectDetails(): {
    type: string;
    magnitude: number;
    description: string;
    applicableStats: string[];
  } {
    const magnitude = this.getEffectMagnitude();
    return {
      type: "additive",
      magnitude,
      description: `Enhances AI processing capabilities by ${(magnitude * 100).toFixed(1)}%`,
      applicableStats: ["intelligence", "adaptability"],
    };
  }

  public getAdvancedEffects(): { [key: string]: any } {
    const magnitude = this.getEffectMagnitude();
    return {
      learningRate: magnitude * 1.2, // 120% faster learning
      patternRecognition: magnitude * 1.5, // 150% better pattern recognition
      predictiveAnalysis: magnitude * 0.8, // 80% bonus to prediction accuracy
      multitasking: magnitude * 0.6, // 60% improvement in parallel processing
      decisionSpeed: magnitude * 1.3, // 130% faster decision making
      adaptiveMemory: magnitude * 0.9, // 90% better memory optimization
      neuralOverclock:
        this.upgradeLevel >= 7
          ? {
              enabled: true,
              processingBoost: 3.0, // 300% processing speed increase
              duration: 10,
              cooldown: 60,
              energyDrain: 2.5,
            }
          : { enabled: false },
    };
  }

  public getOptimalUsageScenarios(): string[] {
    const scenarios = [
      "strategic_planning",
      "tactical_analysis",
      "learning_intensive_tasks",
      "complex_problem_solving",
      "adaptive_combat",
    ];

    if (this.upgradeLevel >= 4) {
      scenarios.push("real_time_optimization", "predictive_modeling");
    }

    if (this.upgradeLevel >= 7) {
      scenarios.push("neural_overclock_operations", "superhuman_processing");
    }

    if (this.rarity === Rarity.LEGENDARY || this.rarity === Rarity.PROTOTYPE) {
      scenarios.push("quantum_ai_processing", "consciousness_simulation");
    }

    return scenarios;
  }

  public getCompatibleSkeletonTypes(): string[] {
    return ["light", "balanced", "flying", "modular"]; // All types benefit, especially adaptive ones
  }

  public getSynergyBonus(otherChip: IExpansionChip): number {
    // AI upgrades synergize with all other chips by optimizing their usage
    if (otherChip.effect === ExpansionChipEffect.SPEED_BUFF) {
      return 0.12; // 12% synergy - better reaction time
    }

    if (otherChip.effect === ExpansionChipEffect.ATTACK_BUFF) {
      return 0.1; // 10% synergy - better targeting
    }

    if (otherChip.effect === ExpansionChipEffect.DEFENSE_BUFF) {
      return 0.08; // 8% synergy - tactical positioning
    }

    if (otherChip.effect === ExpansionChipEffect.ENERGY_EFFICIENCY) {
      return 0.15; // 15% synergy - intelligent power management
    }

    return super.getSynergyBonus(otherChip);
  }

  public getPerformanceMetrics(): { [key: string]: number } {
    const baseMetrics = super.getPerformanceMetrics();
    const magnitude = this.getEffectMagnitude();

    return {
      ...baseMetrics,
      intelligence: magnitude * 1.5,
      adaptability: magnitude * 1.4,
      learning_speed: magnitude * 1.3,
      decision_quality: magnitude * 1.2,
    };
  }

  /**
   * Apply AI upgrade effect to a target
   */
  public applyEffect(
    target: any,
    duration: number = 60,
    conditions: { [key: string]: any } = {}
  ): EffectApplication {
    const magnitude = this.getEffectMagnitude();
    const energyCost = this.getEnergyCost();
    const advancedEffects = this.getAdvancedEffects();

    // Check if neural overclock is triggered
    const isOverclock =
      conditions.criticalThinking && advancedEffects.neuralOverclock.enabled;
    const finalMagnitude = isOverclock
      ? magnitude * advancedEffects.neuralOverclock.processingBoost
      : magnitude;

    const sideEffects: string[] = [];
    if (isOverclock) {
      sideEffects.push("neural_overclock_active", "enhanced_cognition");
    }

    return {
      success: true,
      appliedMagnitude: finalMagnitude,
      duration: isOverclock
        ? advancedEffects.neuralOverclock.duration
        : duration,
      energyCost: isOverclock
        ? energyCost * advancedEffects.neuralOverclock.energyDrain
        : energyCost,
      side_effects: sideEffects,
    };
  }

  /**
   * Calculate learning efficiency for different subjects
   */
  public calculateLearningBonus(
    subject: "combat" | "technical" | "social" | "environmental"
  ): number {
    const magnitude = this.getEffectMagnitude();
    const advancedEffects = this.getAdvancedEffects();
    const learningRate = advancedEffects.learningRate;

    switch (subject) {
      case "combat":
        return learningRate * 1.1; // 10% bonus for combat learning
      case "technical":
        return learningRate * 1.3; // 30% bonus for technical subjects
      case "social":
        return learningRate * 0.8; // 20% penalty for social learning (harder for AI)
      case "environmental":
        return learningRate * 1.2; // 20% bonus for environmental adaptation
      default:
        return learningRate;
    }
  }

  /**
   * Check if neural overclock can be activated
   */
  public canActivateNeuralOverclock(currentStress: number): boolean {
    const advancedEffects = this.getAdvancedEffects();
    return advancedEffects.neuralOverclock.enabled && currentStress >= 0.7; // Requires high stress
  }

  /**
   * Get decision-making recommendations for complex scenarios
   */
  public analyzeScenario(scenario: {
    complexity: number; // 0-1
    timeConstraint: number; // seconds available
    availableData: number; // 0-1
    stakesLevel: number; // 0-1
  }): {
    recommendedApproach: string;
    confidenceLevel: number;
    processingTime: number;
    alternativeOptions: string[];
  } {
    const advancedEffects = this.getAdvancedEffects();
    const analysisBonus = advancedEffects.predictiveAnalysis;

    const complexityFactor = 1 - scenario.complexity;
    const dataFactor = scenario.availableData;
    const timeFactor = Math.min(1, scenario.timeConstraint / 30); // 30 seconds for optimal analysis

    const confidenceLevel =
      ((complexityFactor + dataFactor + timeFactor) / 3) * (1 + analysisBonus);
    const processingTime = Math.max(
      1,
      (10 * scenario.complexity) / (1 + advancedEffects.decisionSpeed)
    );

    let recommendedApproach: string;
    if (confidenceLevel > 0.8) {
      recommendedApproach = "optimal_strategy";
    } else if (confidenceLevel > 0.6) {
      recommendedApproach = "balanced_approach";
    } else if (confidenceLevel > 0.4) {
      recommendedApproach = "conservative_strategy";
    } else {
      recommendedApproach = "defensive_fallback";
    }

    const alternativeOptions = [
      "aggressive_tactic",
      "defensive_maneuver",
      "adaptive_response",
      "fallback_protocol",
    ].filter((option) => Math.random() < confidenceLevel);

    return {
      recommendedApproach,
      confidenceLevel: Math.min(1, confidenceLevel),
      processingTime,
      alternativeOptions,
    };
  }

  /**
   * Calculate pattern recognition effectiveness
   */
  public recognizePatterns(
    dataPoints: number,
    complexity: number
  ): {
    patternsFound: number;
    accuracy: number;
    processingTime: number;
  } {
    const advancedEffects = this.getAdvancedEffects();
    const recognition = advancedEffects.patternRecognition;

    const basePatterns = Math.floor(Math.sqrt(dataPoints) * recognition);
    const accuracy = Math.min(0.95, 0.6 + recognition * 0.3 - complexity * 0.2);
    const processingTime = Math.max(1, dataPoints / (100 * (1 + recognition)));

    return {
      patternsFound: Math.max(0, basePatterns),
      accuracy: Math.max(0.1, accuracy),
      processingTime,
    };
  }

  /**
   * Get optimal upgrade path for AI specialization
   */
  public getOptimalUpgradePath(): {
    nextUpgrade: number;
    reasoning: string;
    expectedImprovement: string;
  } {
    if (this.upgradeLevel < 7) {
      return {
        nextUpgrade: 7,
        reasoning: "Unlock neural overclock for extreme processing scenarios",
        expectedImprovement:
          "300% processing boost for critical thinking situations",
      };
    }

    if (this.upgradeLevel < this.getMaxUpgradeLevel()) {
      return {
        nextUpgrade: Math.min(this.upgradeLevel + 2, this.getMaxUpgradeLevel()),
        reasoning: "Enhance learning rate and decision-making speed",
        expectedImprovement: `${((this.upgradeLevel + 2) * 0.02 * 100).toFixed(1)}% additional AI processing bonus`,
      };
    }

    return {
      nextUpgrade: this.upgradeLevel,
      reasoning: "Already at maximum upgrade level",
      expectedImprovement:
        "Consider quantum processing upgrades or consciousness expansion",
    };
  }
}
