import { Rarity, PartCategory, CombatStats, Ability } from "../types";
import { BasePart } from "./base-part";
import { IPart } from "./part-interface";

/**
 * TorsoPart - Specialized for defense, energy capacity, and core system management
 */
export class TorsoPart extends BasePart {
  constructor(
    id: string,
    rarity: Rarity,
    name: string,
    stats: CombatStats,
    abilities: Ability[] = [],
    upgradeLevel: number = 0
  ) {
    super(id, PartCategory.TORSO, rarity, name, stats, abilities, upgradeLevel);
  }

  public getCategoryBonuses(): { [key: string]: number } {
    return {
      defenseBonus: 1.4,
      energyCapacityBonus: 1.2,
      durabilityBonus: 1.3,
      coreStability: 1.25,
      thermalRegulation: 1.15,
    };
  }

  public getSpecializedCapabilities(): { [key: string]: any } {
    const bonuses = this.getCategoryBonuses();
    const upgradeLevel = this.upgradeLevel;

    return {
      defensiveSystems: {
        armorRating: this.stats.defense * bonuses.defenseBonus,
        damageReduction: 0.1 + upgradeLevel * 0.02,
        shieldCapacity: this.stats.defense * 2 + upgradeLevel * 10,
        shieldRegenRate: 1 + upgradeLevel * 0.1,
      },

      energyManagement: {
        maxCapacity:
          100 + this.stats.energyConsumption * bonuses.energyCapacityBonus,
        rechargeRate: 1 + upgradeLevel * 0.05,
        efficiency: 1 + upgradeLevel * 0.03,
        emergencyReserve: 20 + upgradeLevel * 2,
      },

      coreStability: {
        structuralIntegrity: bonuses.coreStability + upgradeLevel * 0.04,
        supportCapacity: 1 + upgradeLevel * 0.05,
        vibrationDampening: 0.8 + upgradeLevel * 0.02,
        loadDistribution: 1 + upgradeLevel * 0.03,
      },

      thermalSystems: {
        heatDissipation: bonuses.thermalRegulation + upgradeLevel * 0.03,
        coolingEfficiency: 1 + upgradeLevel * 0.04,
        overheatingThreshold: 100 + upgradeLevel * 5,
        thermalShielding: 0.7 + upgradeLevel * 0.02,
      },

      reactiveArmor:
        upgradeLevel >= 8
          ? {
              enabled: true,
              explosiveResistance: 0.6,
              adaptivePlating: true,
              reactionTime: 0.1,
              energyCost: 5,
            }
          : { enabled: false },

      energyOverload:
        upgradeLevel >= 11
          ? {
              enabled: true,
              damageBonus: 1.5,
              aoeRadius: 4,
              energyDrain: 50,
              cooldown: 90,
            }
          : { enabled: false },
    };
  }

  public getOptimalUsageScenarios(): string[] {
    const scenarios = [
      "tank_builds",
      "defensive_operations",
      "energy_intensive_tasks",
      "prolonged_combat",
      "support_roles",
    ];

    if (this.upgradeLevel >= 5) {
      scenarios.push("heavy_combat", "shield_tanking");
    }

    if (this.upgradeLevel >= 8) {
      scenarios.push("explosive_resistance", "adaptive_defense");
    }

    if (this.upgradeLevel >= 11) {
      scenarios.push("energy_overload_tactics", "area_denial");
    }

    if (this.rarity >= Rarity.LEGENDARY) {
      scenarios.push("fortress_operations", "energy_nexus_control");
    }

    return scenarios;
  }

  public getCompatibleSkeletonTypes(): string[] {
    return ["balanced", "heavy", "modular"]; // Core component, less suitable for light/flying
  }

  public getSynergyBonus(otherPart: IPart): number {
    // Torso provides stability and support for all other parts
    if (otherPart.category === PartCategory.ARM) {
      return 0.15; // 15% synergy bonus for arm stability
    }

    if (otherPart.category === PartCategory.LEG) {
      return 0.12; // 12% synergy bonus for core support
    }

    if (otherPart.category === PartCategory.HEAD) {
      return 0.18; // 18% synergy bonus for central processing support
    }

    // Minor synergy with accessories for integration
    if (otherPart.category === PartCategory.ACCESSORY) {
      return 0.08; // 8% synergy bonus for accessory mounting
    }

    return super.getSynergyBonus(otherPart);
  }

  public getPerformanceMetrics(): { [key: string]: number } {
    const baseMetrics = super.getPerformanceMetrics();
    const capabilities = this.getSpecializedCapabilities();

    return {
      ...baseMetrics,
      defensiveRating: capabilities.defensiveSystems.armorRating / 100,
      energyEfficiency: capabilities.energyManagement.efficiency,
      stabilityRating: capabilities.coreStability.structuralIntegrity,
      thermalManagement: capabilities.thermalSystems.heatDissipation,
    };
  }

  /**
   * Calculate damage mitigation for different damage types
   */
  public calculateDamageMitigation(
    damageType: "physical" | "energy" | "explosive" | "thermal"
  ): {
    reduction: number;
    absorption: number;
    reflection: number;
  } {
    const capabilities = this.getSpecializedCapabilities();
    const defense = capabilities.defensiveSystems;

    switch (damageType) {
      case "physical":
        return {
          reduction: defense.damageReduction,
          absorption: defense.armorRating / 100,
          reflection: 0.05,
        };

      case "energy":
        return {
          reduction: defense.damageReduction * 0.8,
          absorption: defense.shieldCapacity / 200,
          reflection: 0.1,
        };

      case "explosive":
        const reactiveBonus = capabilities.reactiveArmor.enabled ? 0.6 : 0;
        return {
          reduction: defense.damageReduction + reactiveBonus,
          absorption: defense.armorRating / 150,
          reflection: reactiveBonus * 0.2,
        };

      case "thermal":
        return {
          reduction: capabilities.thermalSystems.thermalShielding,
          absorption: capabilities.thermalSystems.heatDissipation / 2,
          reflection: 0.03,
        };

      default:
        return {
          reduction: defense.damageReduction,
          absorption: 0.5,
          reflection: 0,
        };
    }
  }

  /**
   * Manage energy distribution
   */
  public manageEnergyDistribution(demands: {
    weapons: number;
    shields: number;
    movement: number;
    systems: number;
  }): {
    allocation: { [key: string]: number };
    efficiency: number;
    overload: boolean;
    recommendations: string[];
  } {
    const capabilities = this.getSpecializedCapabilities();
    const energy = capabilities.energyManagement;

    const totalDemand = Object.values(demands).reduce(
      (sum, val) => sum + val,
      0
    );
    const available = energy.maxCapacity * energy.efficiency;

    const allocation: { [key: string]: number } = {};
    const recommendations: string[] = [];

    if (totalDemand <= available) {
      // Can meet all demands
      allocation.weapons = demands.weapons;
      allocation.shields = demands.shields;
      allocation.movement = demands.movement;
      allocation.systems = demands.systems;
    } else {
      // Need to prioritize
      const ratio = available / totalDemand;
      allocation.weapons = demands.weapons * ratio;
      allocation.shields = demands.shields * ratio;
      allocation.movement = demands.movement * ratio;
      allocation.systems = demands.systems * ratio;

      recommendations.push("Consider reducing energy demands");
      if (demands.weapons > available * 0.4) {
        recommendations.push("Weapon energy usage is high");
      }
    }

    const efficiency = Math.min(1.0, available / totalDemand);
    const overload = totalDemand > available * 1.2;

    if (overload) {
      recommendations.push(
        "Critical overload risk - emergency protocols recommended"
      );
    }

    return { allocation, efficiency, overload, recommendations };
  }

  /**
   * Check if reactive armor can activate
   */
  public canActivateReactiveArmor(incomingDamage: {
    type: string;
    amount: number;
  }): {
    willActivate: boolean;
    effectiveness: number;
    energyCost: number;
  } {
    const capabilities = this.getSpecializedCapabilities();
    const reactive = capabilities.reactiveArmor;

    if (!reactive.enabled) {
      return { willActivate: false, effectiveness: 0, energyCost: 0 };
    }

    const shouldActivate =
      incomingDamage.amount > 20 && incomingDamage.type.includes("explosive");

    const effectiveness = shouldActivate ? reactive.explosiveResistance : 0;

    return {
      willActivate: shouldActivate,
      effectiveness,
      energyCost: reactive.energyCost,
    };
  }

  /**
   * Perform energy overload attack
   */
  public performEnergyOverload(): {
    damage: number;
    aoeRadius: number;
    energyDrained: number;
    coolingTime: number;
    selfDamage: number;
  } {
    const capabilities = this.getSpecializedCapabilities();
    const overload = capabilities.energyOverload;

    if (!overload.enabled) {
      return {
        damage: 0,
        aoeRadius: 0,
        energyDrained: 0,
        coolingTime: 0,
        selfDamage: 0,
      };
    }

    const currentEnergy = capabilities.energyManagement.maxCapacity;
    const damage = Math.floor(currentEnergy * 0.8 * overload.damageBonus);
    const selfDamage = Math.floor(this.getCurrentDurability() * 0.1);

    return {
      damage,
      aoeRadius: overload.aoeRadius,
      energyDrained: overload.energyDrain,
      coolingTime: overload.cooldown,
      selfDamage,
    };
  }

  /**
   * Calculate thermal management efficiency
   */
  public calculateThermalEfficiency(heatSources: {
    weapons: number;
    shields: number;
    movement: number;
    ambient: number;
  }): {
    totalHeat: number;
    coolingCapacity: number;
    overheatingRisk: number;
    shutdownThreshold: number;
  } {
    const capabilities = this.getSpecializedCapabilities();
    const thermal = capabilities.thermalSystems;

    const totalHeat = Object.values(heatSources).reduce(
      (sum, val) => sum + val,
      0
    );
    const coolingCapacity =
      thermal.heatDissipation * thermal.coolingEfficiency * 10;

    const overheatingRisk = Math.max(
      0,
      (totalHeat - coolingCapacity) / thermal.overheatingThreshold
    );
    const shutdownThreshold = thermal.overheatingThreshold * 1.2;

    return {
      totalHeat,
      coolingCapacity,
      overheatingRisk: Math.min(1.0, overheatingRisk),
      shutdownThreshold,
    };
  }

  /**
   * Get recommended defensive equipment
   */
  public getRecommendedEquipment(): {
    primary: string[];
    secondary: string[];
    avoid: string[];
  } {
    const capabilities = this.getSpecializedCapabilities();

    const recommendations = {
      primary: ["heavy_armor_plating", "energy_shields", "thermal_regulators"],
      secondary: ["shock_absorbers", "power_cells", "cooling_systems"],
      avoid: ["lightweight_armor", "energy_draining_equipment"],
    };

    if (capabilities.defensiveSystems.armorRating > 200) {
      recommendations.primary.push("ablative_armor", "composite_plating");
    }

    if (capabilities.energyManagement.maxCapacity > 200) {
      recommendations.primary.push("fusion_cores", "energy_distributors");
    }

    if (capabilities.reactiveArmor.enabled) {
      recommendations.primary.push(
        "explosive_reactive_armor",
        "adaptive_plating"
      );
    }

    if (this.rarity >= Rarity.LEGENDARY) {
      recommendations.primary.push("quantum_armor", "zero_point_energy_cores");
    }

    return recommendations;
  }

  /**
   * Calculate optimal upgrade path for torso specialization
   */
  public getOptimalUpgradePath(): {
    nextUpgrade: number;
    reasoning: string;
    expectedImprovement: string;
  } {
    if (this.upgradeLevel < 8) {
      return {
        nextUpgrade: 8,
        reasoning: "Unlock reactive armor for explosive protection",
        expectedImprovement:
          "60% explosive resistance with adaptive plating systems",
      };
    }

    if (this.upgradeLevel < 11) {
      return {
        nextUpgrade: 11,
        reasoning: "Unlock energy overload for area attacks",
        expectedImprovement: "Powerful AOE energy blast for crowd control",
      };
    }

    if (this.upgradeLevel < this.getMaxUpgradeLevel()) {
      return {
        nextUpgrade: Math.min(this.upgradeLevel + 2, this.getMaxUpgradeLevel()),
        reasoning: "Enhance defense and energy capacity",
        expectedImprovement: `${((this.upgradeLevel + 2) * 0.02 * 100).toFixed(1)}% additional damage reduction`,
      };
    }

    return {
      nextUpgrade: this.upgradeLevel,
      reasoning: "Already at maximum upgrade level",
      expectedImprovement:
        "Consider fortress-grade armor or dimensional shielding",
    };
  }
}
