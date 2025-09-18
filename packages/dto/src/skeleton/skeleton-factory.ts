import { Rarity, SkeletonType, MobilityType } from "../types";
import { ISkeleton } from "./skeleton-interface";
import { LightSkeleton } from "./light-skeleton";
import { BalancedSkeleton } from "./balanced-skeleton";
import { HeavySkeleton } from "./heavy-skeleton";
import { FlyingSkeleton } from "./flying-skeleton";
import { ModularSkeleton } from "./modular-skeleton";

/**
 * Factory class for creating different types of skeletons
 */
export class SkeletonFactory {
  /**
   * Create a skeleton of the specified type
   */
  public static createSkeleton(
    type: SkeletonType,
    id: string,
    rarity: Rarity,
    slots: number,
    baseDurability: number,
    mobilityType: MobilityType
  ): ISkeleton {
    switch (type) {
      case SkeletonType.LIGHT:
        return new LightSkeleton(id, rarity, slots, baseDurability, mobilityType);
      
      case SkeletonType.BALANCED:
        return new BalancedSkeleton(id, rarity, slots, baseDurability, mobilityType);
      
      case SkeletonType.HEAVY:
        return new HeavySkeleton(id, rarity, slots, baseDurability, mobilityType);
      
      case SkeletonType.FLYING:
        return new FlyingSkeleton(id, rarity, slots, baseDurability, mobilityType);
      
      case SkeletonType.MODULAR:
        return new ModularSkeleton(id, rarity, slots, baseDurability, mobilityType);
      
      default:
        throw new Error(`Unknown skeleton type: ${type}`);
    }
  }

  /**
   * Create a skeleton from JSON data
   */
  public static fromJSON(data: any): ISkeleton {
    const type = data.type as SkeletonType;
    
    switch (type) {
      case SkeletonType.LIGHT:
        return new LightSkeleton(data.id, data.rarity, data.slots, data.baseDurability, data.mobilityType);
      
      case SkeletonType.BALANCED:
        return new BalancedSkeleton(data.id, data.rarity, data.slots, data.baseDurability, data.mobilityType);
      
      case SkeletonType.HEAVY:
        return new HeavySkeleton(data.id, data.rarity, data.slots, data.baseDurability, data.mobilityType);
      
      case SkeletonType.FLYING:
        return new FlyingSkeleton(data.id, data.rarity, data.slots, data.baseDurability, data.mobilityType);
      
      case SkeletonType.MODULAR:
        return ModularSkeleton.fromJSON(data);
      
      default:
        throw new Error(`Unknown skeleton type: ${type}`);
    }
  }

  /**
   * Create a default skeleton of each type for testing/examples
   */
  public static createDefaultSkeletons(): { [key: string]: ISkeleton } {
    const baseId = Date.now().toString();
    
    return {
      light: SkeletonFactory.createSkeleton(
        SkeletonType.LIGHT,
        `light_${baseId}`,
        Rarity.COMMON,
        3,
        80,
        MobilityType.BIPEDAL
      ),
      
      balanced: SkeletonFactory.createSkeleton(
        SkeletonType.BALANCED,
        `balanced_${baseId}`,
        Rarity.COMMON,
        4,
        100,
        MobilityType.BIPEDAL
      ),
      
      heavy: SkeletonFactory.createSkeleton(
        SkeletonType.HEAVY,
        `heavy_${baseId}`,
        Rarity.COMMON,
        5,
        150,
        MobilityType.TRACKED
      ),
      
      flying: SkeletonFactory.createSkeleton(
        SkeletonType.FLYING,
        `flying_${baseId}`,
        Rarity.UNCOMMON,
        4,
        90,
        MobilityType.WINGED
      ),
      
      modular: SkeletonFactory.createSkeleton(
        SkeletonType.MODULAR,
        `modular_${baseId}`,
        Rarity.RARE,
        6,
        110,
        MobilityType.HYBRID
      ),
    };
  }

  /**
   * Get recommended skeleton type for specific playstyles
   */
  public static getRecommendedSkeletonType(
    playstyle: "aggressive" | "defensive" | "balanced" | "stealth" | "aerial" | "adaptable"
  ): {
    primaryType: SkeletonType;
    alternativeTypes: SkeletonType[];
    reasoning: string;
  } {
    const recommendations = {
      aggressive: {
        primaryType: SkeletonType.LIGHT,
        alternativeTypes: [SkeletonType.BALANCED],
        reasoning: "Light skeletons excel at hit-and-run tactics and high-speed aggressive maneuvers",
      },
      
      defensive: {
        primaryType: SkeletonType.HEAVY,
        alternativeTypes: [SkeletonType.BALANCED],
        reasoning: "Heavy skeletons provide maximum durability and defensive capabilities",
      },
      
      balanced: {
        primaryType: SkeletonType.BALANCED,
        alternativeTypes: [SkeletonType.MODULAR],
        reasoning: "Balanced skeletons offer versatility and adaptability for any situation",
      },
      
      stealth: {
        primaryType: SkeletonType.LIGHT,
        alternativeTypes: [SkeletonType.MODULAR],
        reasoning: "Light skeletons have built-in stealth capabilities and low detection profiles",
      },
      
      aerial: {
        primaryType: SkeletonType.FLYING,
        alternativeTypes: [SkeletonType.LIGHT],
        reasoning: "Flying skeletons dominate vertical space and provide unique tactical advantages",
      },
      
      adaptable: {
        primaryType: SkeletonType.MODULAR,
        alternativeTypes: [SkeletonType.BALANCED],
        reasoning: "Modular skeletons can be reconfigured for any situation or playstyle",
      },
    };

    return recommendations[playstyle];
  }

  /**
   * Create optimized skeletons for specific roles
   */
  public static createRoleOptimizedSkeleton(
    role: "scout" | "tank" | "striker" | "support" | "sniper",
    rarity: Rarity = Rarity.COMMON
  ): ISkeleton {
    const baseId = `${role}_${Date.now()}`;
    
    switch (role) {
      case "scout":
        return SkeletonFactory.createSkeleton(
          SkeletonType.LIGHT,
          baseId,
          rarity,
          3,
          70,
          MobilityType.BIPEDAL
        );
      
      case "tank":
        return SkeletonFactory.createSkeleton(
          SkeletonType.HEAVY,
          baseId,
          rarity,
          5,
          180,
          MobilityType.TRACKED
        );
      
      case "striker":
        return SkeletonFactory.createSkeleton(
          SkeletonType.FLYING,
          baseId,
          rarity,
          4,
          85,
          MobilityType.WINGED
        );
      
      case "support":
        return SkeletonFactory.createSkeleton(
          SkeletonType.MODULAR,
          baseId,
          rarity,
          6,
          120,
          MobilityType.HYBRID
        );
      
      case "sniper":
        return SkeletonFactory.createSkeleton(
          SkeletonType.BALANCED,
          baseId,
          rarity,
          4,
          95,
          MobilityType.BIPEDAL
        );
      
      default:
        throw new Error(`Unknown role: ${role}`);
    }
  }

  /**
   * Validate skeleton configuration for balance
   */
  public static validateSkeletonBalance(skeleton: ISkeleton): {
    isBalanced: boolean;
    issues: string[];
    suggestions: string[];
    balanceScore: number;
  } {
    const characteristics = skeleton.getTypeCharacteristics();
    const issues: string[] = [];
    const suggestions: string[] = [];
    
    // Calculate balance score
    const statSum = characteristics.speedModifier + 
                   characteristics.defenseModifier + 
                   characteristics.energyEfficiency;
    const statVariance = Math.abs(characteristics.speedModifier - 1) +
                        Math.abs(characteristics.defenseModifier - 1) +
                        Math.abs(characteristics.energyEfficiency - 1);
    
    const balanceScore = Math.max(0, 100 - (statVariance * 50));
    
    // Check for extreme values
    if (characteristics.speedModifier > 1.5) {
      issues.push("Speed modifier is extremely high, may cause balance issues");
      suggestions.push("Consider reducing speed or adding energy consumption penalty");
    }
    
    if (characteristics.defenseModifier > 1.6) {
      issues.push("Defense modifier is extremely high, may make skeleton overpowered");
      suggestions.push("Consider adding mobility or energy efficiency penalties");
    }
    
    if (characteristics.energyEfficiency < 0.6) {
      issues.push("Energy efficiency is very low, may make skeleton unusable");
      suggestions.push("Consider improving energy efficiency or adding energy-related bonuses");
    }
    
    // Check slot count balance
    const totalSlots = skeleton.getTotalSlots();
    if (totalSlots > 8) {
      issues.push("Too many slots may allow overpowered configurations");
      suggestions.push("Consider reducing base slots or rarity slot bonuses");
    }
    
    if (totalSlots < 2) {
      issues.push("Too few slots may limit customization options");
      suggestions.push("Consider increasing base slots");
    }

    return {
      isBalanced: issues.length === 0 && balanceScore >= 70,
      issues,
      suggestions,
      balanceScore: Math.round(balanceScore),
    };
  }

  /**
   * Get type-specific upgrade recommendations
   */
  public static getUpgradeRecommendations(skeleton: ISkeleton): {
    priorityUpgrades: string[];
    compatibleParts: string[];
    avoidParts: string[];
    nextRarityBenefits: string[];
  } {
    const type = skeleton.type;
    
    const typeRecommendations = {
      [SkeletonType.LIGHT]: {
        priorityUpgrades: ["speed_enhancers", "stealth_modules", "energy_efficiency"],
        compatibleParts: ["light_armor", "precision_weapons", "mobility_systems"],
        avoidParts: ["heavy_weapons", "bulk_armor", "static_systems"],
        nextRarityBenefits: ["Increased stealth effectiveness", "Better energy conservation", "Enhanced agility"],
      },
      
      [SkeletonType.BALANCED]: {
        priorityUpgrades: ["adaptive_systems", "multi_purpose_tools", "tactical_modules"],
        compatibleParts: ["universal_parts", "balanced_weapons", "adaptive_armor"],
        avoidParts: ["highly_specialized_parts"],
        nextRarityBenefits: ["Better adaptation speed", "Improved learning rate", "Enhanced versatility"],
      },
      
      [SkeletonType.HEAVY]: {
        priorityUpgrades: ["armor_plating", "heavy_weapons", "power_systems"],
        compatibleParts: ["siege_equipment", "defensive_systems", "high_capacity_storage"],
        avoidParts: ["stealth_modules", "light_components", "speed_enhancers"],
        nextRarityBenefits: ["Increased durability", "Better siege capabilities", "Enhanced intimidation"],
      },
      
      [SkeletonType.FLYING]: {
        priorityUpgrades: ["flight_systems", "aerial_weapons", "navigation_equipment"],
        compatibleParts: ["aerodynamic_parts", "altitude_gear", "reconnaissance_systems"],
        avoidParts: ["heavy_ground_equipment", "non_aerodynamic_parts"],
        nextRarityBenefits: ["Higher altitude capability", "Better maneuverability", "Enhanced reconnaissance"],
      },
      
      [SkeletonType.MODULAR]: {
        priorityUpgrades: ["reconfiguration_systems", "universal_adapters", "quick_swap_mechanisms"],
        compatibleParts: ["modular_components", "adaptive_interfaces", "universal_connectors"],
        avoidParts: ["fixed_configuration_parts", "non_modular_systems"],
        nextRarityBenefits: ["Faster reconfiguration", "More configurations", "Better part synergy"],
      },
    };

    return typeRecommendations[type] || {
      priorityUpgrades: [],
      compatibleParts: [],
      avoidParts: [],
      nextRarityBenefits: [],
    };
  }
}
