/**
 * Botking Domain Package
 * 
 * Pure business logic and domain rules for the Botking game.
 * This package contains validation rules, domain services, and business logic
 * without any infrastructure dependencies.
 */

// Export all types
export * from './types';

// Export all rules
export * from './rules';

// Export all validators
export * from './validators';

// Export all services
export * from './services';

// Main domain package class for easy initialization
export class DomainPackage {
  private static instance: DomainPackage | null = null;

  /**
   * Get singleton instance of the domain package
   */
  public static getInstance(): DomainPackage {
    if (!DomainPackage.instance) {
      DomainPackage.instance = new DomainPackage();
    }
    return DomainPackage.instance;
  }

  /**
   * Package version
   */
  public readonly version = "1.0.0";

  /**
   * Package name
   */
  public readonly name = "@botking/domain";

  /**
   * Package description
   */
  public readonly description = "Domain logic and business rules for the Botking game";

  /**
   * Available domain services
   */
  public readonly services = {
    botAssembly: "BotAssemblyService - Validates bot assembly configurations",
  };

  /**
   * Available validation rules
   */
  public readonly rules = {
    skeletonSlot: "SkeletonSlotRule - Validates skeleton slot constraints",
  };

  /**
   * Available validators
   */
  public readonly validators = {
    ruleEngine: "RuleEngine - Executes domain validation rules",
  };

  /**
   * Get package information
   */
  public getInfo(): {
    name: string;
    version: string;
    description: string;
    features: string[];
  } {
    return {
      name: this.name,
      version: this.version,
      description: this.description,
      features: [
        "Skeleton slot validation",
        "Bot assembly validation",
        "Domain rule engine",
        "Business logic validation",
        "Type-safe domain rules"
      ]
    };
  }
}
