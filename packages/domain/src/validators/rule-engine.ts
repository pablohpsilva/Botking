/**
 * Domain validation rule engine
 */

import {
  IDomainRule,
  IValidationResult,
  IValidationResults,
  IValidationContext,
  IRuleExecutionOptions,
  ValidationSeverity,
} from "../types/validation";

/**
 * Rule engine for executing domain validation rules
 */
export class RuleEngine {
  private rules: Map<string, IDomainRule[]> = new Map();

  /**
   * Register a rule for a specific entity type
   */
  registerRule<T>(entityType: string, rule: IDomainRule<T>): void {
    if (!this.rules.has(entityType)) {
      this.rules.set(entityType, []);
    }

    const entityRules = this.rules.get(entityType)!;

    // Check if rule already exists
    const existingRule = entityRules.find(
      (r) => r.getRuleName() === rule.getRuleName()
    );
    if (existingRule) {
      throw new Error(
        `Rule '${rule.getRuleName()}' already registered for entity type '${entityType}'`
      );
    }

    entityRules.push(rule);
  }

  /**
   * Unregister a rule for a specific entity type
   */
  unregisterRule(entityType: string, ruleName: string): boolean {
    const entityRules = this.rules.get(entityType);
    if (!entityRules) {
      return false;
    }

    const ruleIndex = entityRules.findIndex(
      (r) => r.getRuleName() === ruleName
    );
    if (ruleIndex === -1) {
      return false;
    }

    entityRules.splice(ruleIndex, 1);

    // Clean up empty entity type
    if (entityRules.length === 0) {
      this.rules.delete(entityType);
    }

    return true;
  }

  /**
   * Get all rules for a specific entity type
   */
  getRulesForEntity(entityType: string): IDomainRule[] {
    return this.rules.get(entityType) || [];
  }

  /**
   * Get all registered entity types
   */
  getRegisteredEntityTypes(): string[] {
    return Array.from(this.rules.keys());
  }

  /**
   * Validate an entity using all registered rules for its type
   */
  validateEntity<T>(
    entityType: string,
    entity: T,
    context?: IValidationContext,
    options?: IRuleExecutionOptions
  ): IValidationResults {
    const entityRules = this.getRulesForEntity(entityType);

    if (entityRules.length === 0) {
      return this.createEmptyValidationResults(
        `No rules registered for entity type '${entityType}'`
      );
    }

    return this.executeRules(entityRules, entity, context, options);
  }

  /**
   * Validate an entity using specific rules
   */
  validateWithRules<T>(
    rules: IDomainRule<T>[],
    entity: T,
    context?: IValidationContext,
    options?: IRuleExecutionOptions
  ): IValidationResults {
    return this.executeRules(rules, entity, context, options);
  }

  /**
   * Execute a set of rules against an entity
   */
  private executeRules<T>(
    rules: IDomainRule<T>[],
    entity: T,
    context?: IValidationContext,
    options: IRuleExecutionOptions = {}
  ): IValidationResults {
    const {
      stopOnFirstError = false,
      includeWarnings = true,
      includeInfo = true,
      skipOptionalRules = false,
    } = options;

    const results: IValidationResult[] = [];
    const errors: string[] = [];
    const warnings: string[] = [];
    const info: string[] = [];

    for (const rule of rules) {
      // Skip optional rules if requested
      if (skipOptionalRules && !rule.isRequired()) {
        continue;
      }

      try {
        const result = rule.validate(entity);
        results.push(result);

        // Categorize results
        switch (result.severity) {
          case ValidationSeverity.ERROR:
            errors.push(result.message);
            if (stopOnFirstError) {
              break;
            }
            break;
          case ValidationSeverity.WARNING:
            if (includeWarnings) {
              warnings.push(result.message);
            }
            break;
          case ValidationSeverity.INFO:
            if (includeInfo) {
              info.push(result.message);
            }
            break;
        }

        // Stop on first error if requested
        if (stopOnFirstError && !result.isValid) {
          break;
        }
      } catch (error) {
        const errorResult: IValidationResult = {
          isValid: false,
          severity: ValidationSeverity.ERROR,
          ruleName: rule.getRuleName(),
          message: `Rule execution failed: ${error instanceof Error ? error.message : "Unknown error"}`,
          details: {
            error: error instanceof Error ? error.message : error,
            context,
          },
        };

        results.push(errorResult);
        errors.push(errorResult.message);

        if (stopOnFirstError) {
          break;
        }
      }
    }

    const isValid = results.every((r) => r.isValid);

    return {
      isValid,
      results,
      errors,
      warnings,
      info,
      summary: {
        total: results.length,
        passed: results.filter((r) => r.isValid).length,
        failed: results.filter((r) => !r.isValid).length,
        warnings: warnings.length,
      },
    };
  }

  /**
   * Create empty validation results for when no rules are found
   */
  private createEmptyValidationResults(message: string): IValidationResults {
    return {
      isValid: true,
      results: [],
      errors: [],
      warnings: [message],
      info: [],
      summary: {
        total: 0,
        passed: 0,
        failed: 0,
        warnings: 1,
      },
    };
  }

  /**
   * Clear all registered rules
   */
  clearAllRules(): void {
    this.rules.clear();
  }

  /**
   * Get total number of registered rules across all entity types
   */
  getTotalRuleCount(): number {
    return Array.from(this.rules.values()).reduce(
      (total, rules) => total + rules.length,
      0
    );
  }

  /**
   * Get rule statistics
   */
  getRuleStatistics(): {
    entityTypes: number;
    totalRules: number;
    rulesByType: Record<string, number>;
  } {
    const rulesByType: Record<string, number> = {};

    for (const [entityType, rules] of this.rules.entries()) {
      rulesByType[entityType] = rules.length;
    }

    return {
      entityTypes: this.rules.size,
      totalRules: this.getTotalRuleCount(),
      rulesByType,
    };
  }
}
