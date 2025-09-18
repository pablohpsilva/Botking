import { Rarity, SkeletonType, MobilityType } from "../types";
import { BaseSkeleton } from "./base-skeleton";

/**
 * Modular Skeleton - Highly customizable and reconfigurable for any situation
 */
export class ModularSkeleton extends BaseSkeleton {
  private currentConfiguration: string = "default";
  private availableConfigurations: Map<string, any> = new Map();
  private quickSwapSlots: number = 2;

  constructor(
    id: string,
    rarity: Rarity,
    slots: number,
    baseDurability: number,
    mobilityType: MobilityType
  ) {
    super(id, SkeletonType.MODULAR, rarity, slots, baseDurability, mobilityType);
    this.initializeConfigurations();
  }

  public getTypeCharacteristics(): {
    speedModifier: number;
    defenseModifier: number;
    energyEfficiency: number;
    specialAbilities: string[];
  } {
    return {
      speedModifier: 1.0,
      defenseModifier: 1.0,
      energyEfficiency: 0.9,
      specialAbilities: ["part_swap", "configuration_change"],
    };
  }

  public getUniqueAbilities(): string[] {
    return [
      "rapid_reconfiguration",
      "hot_swap_parts",
      "adaptive_architecture",
      "multi_mode_operation",
      "field_customization",
    ];
  }

  public getCombatBonuses(): { [key: string]: number } {
    return {
      adaptabilityBonus: 0.25, // 25% bonus to adapting to new situations
      configurationEfficiency: 0.2, // 20% faster configuration changes
      partSynergyBonus: 0.15, // 15% bonus when parts work well together
      modularityAdvantage: 0.1, // 10% general bonus due to modular design
      quickSwapBonus: 0.3, // 30% faster for quick-swap operations
    };
  }

  public getSpecialMechanics(): { [key: string]: any } {
    return {
      canReconfigure: true,
      hasQuickSwapSlots: true,
      supportsHotSwap: true,
      maxConfigurations: 10, // Can store up to 10 different configurations
      reconfigurationTime: 30, // Time to fully reconfigure in seconds
      quickSwapTime: 3, // Time for quick part swap in seconds
      configurationMemory: true, // Can remember and restore configurations
      fieldModificationAllowed: true,
      partCompatibilityCheck: true,
      modularSlotTypes: ["universal", "specialized", "quick_swap"],
      energyPenaltyPerConfig: 0.05, // 5% energy penalty per active configuration
    };
  }

  public isCompatibleWithPart(partCategory: string): boolean {
    // Modular skeletons can adapt to use any part type
    return true;
  }

  public getEnergyEfficiencyModifier(): number {
    // Efficiency depends on current configuration complexity
    const baseEfficiency = super.getEnergyEfficiencyModifier();
    const configurationPenalty = this.availableConfigurations.size * 
      this.getSpecialMechanics().energyPenaltyPerConfig;
    return baseEfficiency * (1 - configurationPenalty);
  }

  /**
   * Initialize default configurations
   */
  private initializeConfigurations(): void {
    this.availableConfigurations.set("assault", {
      focus: "offensive",
      bonuses: { attack: 0.2, speed: 0.1 },
      penalties: { defense: -0.1 },
    });

    this.availableConfigurations.set("defensive", {
      focus: "defensive",
      bonuses: { defense: 0.25, durability: 0.15 },
      penalties: { speed: -0.15 },
    });

    this.availableConfigurations.set("reconnaissance", {
      focus: "stealth",
      bonuses: { stealth: 0.3, detection: 0.2 },
      penalties: { attack: -0.1 },
    });

    this.availableConfigurations.set("support", {
      focus: "utility",
      bonuses: { repair: 0.25, resourceEfficiency: 0.2 },
      penalties: { combat: -0.1 },
    });
  }

  /**
   * Calculate optimal loadout suggestions for modular skeleton
   */
  public getOptimalLoadout(): {
    recommendedParts: string[];
    avoidParts: string[];
    playstyle: string;
  } {
    return {
      recommendedParts: [
        "modular_components",
        "quick_swap_systems",
        "universal_adapters",
        "reconfigurable_armor",
        "adaptive_weapons",
      ],
      avoidParts: [
        "fixed_configuration_parts",
        "non_modular_systems",
      ],
      playstyle: "adaptive_modular",
    };
  }

  /**
   * Change to a different configuration
   */
  public changeConfiguration(
    configurationName: string,
    quickSwap: boolean = false
  ): {
    success: boolean;
    timeRequired: number;
    energyCost: number;
    newBonuses: { [key: string]: number };
    newPenalties: { [key: string]: number };
  } {
    if (!this.availableConfigurations.has(configurationName)) {
      return {
        success: false,
        timeRequired: 0,
        energyCost: 0,
        newBonuses: {},
        newPenalties: {},
      };
    }

    const config = this.availableConfigurations.get(configurationName)!;
    const timeRequired = quickSwap ? 
      this.getSpecialMechanics().quickSwapTime : 
      this.getSpecialMechanics().reconfigurationTime;
    const energyCost = quickSwap ? 10 : 25;

    this.currentConfiguration = configurationName;

    return {
      success: true,
      timeRequired,
      energyCost,
      newBonuses: config.bonuses,
      newPenalties: config.penalties,
    };
  }

  /**
   * Create a new custom configuration
   */
  public createCustomConfiguration(
    name: string,
    configuration: {
      focus: string;
      bonuses: { [key: string]: number };
      penalties: { [key: string]: number };
    }
  ): {
    success: boolean;
    error?: string;
  } {
    if (this.availableConfigurations.size >= this.getSpecialMechanics().maxConfigurations) {
      return {
        success: false,
        error: "Maximum number of configurations reached",
      };
    }

    if (this.availableConfigurations.has(name)) {
      return {
        success: false,
        error: "Configuration name already exists",
      };
    }

    // Validate configuration balance
    const totalBonuses = Object.values(configuration.bonuses).reduce((sum, val) => sum + val, 0);
    const totalPenalties = Object.values(configuration.penalties).reduce((sum, val) => sum + Math.abs(val), 0);
    
    if (totalBonuses > totalPenalties + 0.1) {
      return {
        success: false,
        error: "Configuration must be balanced (bonuses should not exceed penalties by more than 10%)",
      };
    }

    this.availableConfigurations.set(name, configuration);
    return { success: true };
  }

  /**
   * Perform hot swap of parts in quick-swap slots
   */
  public performHotSwap(
    slotIndex: number,
    newPartId: string
  ): {
    success: boolean;
    timeRequired: number;
    energyCost: number;
    oldPartId?: string;
  } {
    if (slotIndex >= this.quickSwapSlots) {
      return {
        success: false,
        timeRequired: 0,
        energyCost: 0,
      };
    }

    const timeRequired = this.getSpecialMechanics().quickSwapTime;
    const energyCost = 5;

    return {
      success: true,
      timeRequired,
      energyCost,
      oldPartId: `slot_${slotIndex}_part`, // Placeholder for actual part tracking
    };
  }

  /**
   * Analyze part synergies in current configuration
   */
  public analyzePartSynergies(partIds: string[]): {
    synergyRating: number;
    compatibilityIssues: string[];
    recommendations: string[];
    bonuses: { [key: string]: number };
  } {
    const synergyBonus = this.getCombatBonuses().partSynergyBonus;
    let synergyRating = 0.5; // Base synergy
    const compatibilityIssues: string[] = [];
    const recommendations: string[] = [];
    const bonuses: { [key: string]: number } = {};

    // Analyze part combinations (simplified logic)
    const partTypes = new Set(partIds.map(id => id.split('_')[0]));
    
    // Check for complementary part types
    if (partTypes.has('armor') && partTypes.has('shield')) {
      synergyRating += 0.2;
      bonuses.defense = 0.15;
      recommendations.push("Armor and shield combination provides excellent defense synergy");
    }

    if (partTypes.has('weapon') && partTypes.has('targeting')) {
      synergyRating += 0.15;
      bonuses.accuracy = 0.1;
      recommendations.push("Weapon and targeting system synergy improves accuracy");
    }

    if (partTypes.has('mobility') && partTypes.has('stealth')) {
      synergyRating += 0.1;
      bonuses.evasion = 0.08;
      recommendations.push("Mobility and stealth combination enhances evasive capabilities");
    }

    // Check for conflicts
    if (partTypes.has('heavy') && partTypes.has('stealth')) {
      synergyRating -= 0.15;
      compatibilityIssues.push("Heavy parts reduce stealth effectiveness");
    }

    // Apply synergy bonus
    Object.keys(bonuses).forEach(key => {
      bonuses[key] *= (1 + synergyBonus);
    });

    return {
      synergyRating: Math.max(0, Math.min(1, synergyRating)),
      compatibilityIssues,
      recommendations,
      bonuses,
    };
  }

  /**
   * Get configuration optimization suggestions
   */
  public getConfigurationOptimizations(
    currentParts: string[],
    desiredRole: "assault" | "defense" | "stealth" | "support" | "balanced"
  ): {
    recommendedConfiguration: string;
    suggestedPartSwaps: { remove: string; add: string; reason: string }[];
    expectedImprovement: { [key: string]: number };
  } {
    const roleConfigurations = {
      assault: "assault",
      defense: "defensive", 
      stealth: "reconnaissance",
      support: "support",
      balanced: "default",
    };

    const recommendedConfiguration = roleConfigurations[desiredRole];
    const suggestedPartSwaps: { remove: string; add: string; reason: string }[] = [];
    const expectedImprovement: { [key: string]: number } = {};

    // Analyze current parts and suggest improvements
    if (desiredRole === "assault") {
      suggestedPartSwaps.push({
        remove: "defensive_parts",
        add: "assault_weapons",
        reason: "Increase offensive capability for assault role",
      });
      expectedImprovement.attackPower = 0.25;
    }

    if (desiredRole === "stealth") {
      suggestedPartSwaps.push({
        remove: "heavy_armor",
        add: "stealth_coating",
        reason: "Reduce weight and improve stealth for reconnaissance",
      });
      expectedImprovement.stealthRating = 0.3;
    }

    return {
      recommendedConfiguration,
      suggestedPartSwaps,
      expectedImprovement,
    };
  }

  /**
   * Calculate reconfiguration cost and time
   */
  public calculateReconfigurationCost(
    fromConfiguration: string,
    toConfiguration: string,
    partChanges: number
  ): {
    timeCost: number;
    energyCost: number;
    resourceCost: number;
    complexity: "simple" | "moderate" | "complex" | "extreme";
  } {
    const baseTime = this.getSpecialMechanics().reconfigurationTime;
    const baseEnergy = 25;
    const baseResource = 50;

    const configComplexity = Math.abs(fromConfiguration.length - toConfiguration.length) / 10;
    const partComplexity = partChanges / this.getTotalSlots();
    const totalComplexity = configComplexity + partComplexity;

    let complexity: "simple" | "moderate" | "complex" | "extreme";
    if (totalComplexity < 0.3) complexity = "simple";
    else if (totalComplexity < 0.6) complexity = "moderate";
    else if (totalComplexity < 0.9) complexity = "complex";
    else complexity = "extreme";

    const complexityMultiplier = {
      simple: 1.0,
      moderate: 1.5,
      complex: 2.0,
      extreme: 3.0,
    };

    const multiplier = complexityMultiplier[complexity];

    return {
      timeCost: Math.floor(baseTime * multiplier),
      energyCost: Math.floor(baseEnergy * multiplier),
      resourceCost: Math.floor(baseResource * multiplier),
      complexity,
    };
  }

  /**
   * Get current configuration details
   */
  public getCurrentConfiguration(): {
    name: string;
    details: any;
    activeBonuses: { [key: string]: number };
    activePenalties: { [key: string]: number };
  } {
    const config = this.availableConfigurations.get(this.currentConfiguration);
    return {
      name: this.currentConfiguration,
      details: config || {},
      activeBonuses: config?.bonuses || {},
      activePenalties: config?.penalties || {},
    };
  }

  /**
   * Override toJSON to include configuration data
   */
  public toJSON(): object {
    return {
      ...super.toJSON(),
      currentConfiguration: this.currentConfiguration,
      availableConfigurations: Object.fromEntries(this.availableConfigurations),
      quickSwapSlots: this.quickSwapSlots,
    };
  }

  /**
   * Create a ModularSkeleton from JSON data
   */
  public static fromJSON(data: any): ModularSkeleton {
    const skeleton = new ModularSkeleton(
      data.id,
      data.rarity,
      data.slots,
      data.baseDurability,
      data.mobilityType
    );
    
    if (data.currentConfiguration) {
      skeleton.currentConfiguration = data.currentConfiguration;
    }
    
    if (data.availableConfigurations) {
      skeleton.availableConfigurations = new Map(Object.entries(data.availableConfigurations));
    }
    
    if (data.quickSwapSlots) {
      skeleton.quickSwapSlots = data.quickSwapSlots;
    }
    
    return skeleton;
  }
}
