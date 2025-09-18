import { createPackageLogger } from "@botking/logger";
import type { IBot } from "../bot/bot-interface";
import type { IItem } from "../item/item-interface";
import type { ISkeleton } from "../skeleton/skeleton-interface";
import type { IPart } from "../part/part-interface";
import type { IExpansionChip } from "../expansion-chip/expansion-chip-interface";
import { Rarity } from "../types";

/**
 * Validation severity levels
 */
export enum ValidationSeverity {
  INFO = "info",
  WARNING = "warning",
  ERROR = "error",
  CRITICAL = "critical",
}

/**
 * Validation issue interface
 */
export interface ValidationIssue {
  severity: ValidationSeverity;
  code: string;
  message: string;
  field?: string;
  suggestion?: string;
  metadata?: Record<string, any>;
}

/**
 * Validation result interface
 */
export interface ValidationResult {
  isValid: boolean;
  issues: ValidationIssue[];
  score: number; // 0-100 quality score
  summary: {
    errors: number;
    warnings: number;
    infos: number;
    criticals: number;
  };
}

/**
 * Validation context interface
 */
export interface ValidationContext {
  strict: boolean;
  checkPerformance: boolean;
  checkCompatibility: boolean;
  customRules?: ValidationRule[];
}

/**
 * Custom validation rule interface
 */
export interface ValidationRule {
  name: string;
  apply: (artifact: any, context: ValidationContext) => ValidationIssue[];
}

/**
 * Abstract base class for artifact validation using Template Method pattern
 * Defines the validation algorithm structure while allowing specific implementations
 */
export abstract class ArtifactValidator<T> {
  protected logger: ReturnType<typeof createPackageLogger>;
  protected context: ValidationContext;

  constructor(
    context: ValidationContext = {
      strict: false,
      checkPerformance: true,
      checkCompatibility: true,
    }
  ) {
    this.logger = createPackageLogger("artifact", { service: "validator" });
    this.context = context;
  }

  /**
   * Template method - defines the validation algorithm
   */
  public validate(artifact: T): ValidationResult {
    this.logger.debug("Starting artifact validation", {
      type: this.getArtifactType(),
    });

    const issues: ValidationIssue[] = [];
    const startTime = Date.now();

    try {
      // Step 1: Basic validation (implemented by subclasses)
      issues.push(...this.validateBasicStructure(artifact));

      // Step 2: Required fields validation (implemented by subclasses)
      issues.push(...this.validateRequiredFields(artifact));

      // Step 3: Business rules validation (implemented by subclasses)
      issues.push(...this.validateBusinessRules(artifact));

      // Step 4: Performance validation (optional)
      if (this.context.checkPerformance) {
        issues.push(...this.validatePerformance(artifact));
      }

      // Step 5: Compatibility validation (optional)
      if (this.context.checkCompatibility) {
        issues.push(...this.validateCompatibility(artifact));
      }

      // Step 6: Custom rules validation
      if (this.context.customRules) {
        for (const rule of this.context.customRules) {
          issues.push(...rule.apply(artifact, this.context));
        }
      }

      // Step 7: Final validation (implemented by subclasses)
      issues.push(...this.validateFinal(artifact));
    } catch (error) {
      this.logger.error("Validation failed with exception", { error });
      issues.push({
        severity: ValidationSeverity.CRITICAL,
        code: "VALIDATION_EXCEPTION",
        message: `Validation failed: ${(error as Error).message}`,
      });
    }

    const endTime = Date.now();
    const result = this.buildValidationResult(issues, endTime - startTime);

    this.logger.info("Validation completed", {
      type: this.getArtifactType(),
      isValid: result.isValid,
      issueCount: issues.length,
      score: result.score,
      duration: endTime - startTime,
    });

    return result;
  }

  /**
   * Validate multiple artifacts of the same type
   */
  public validateBatch(artifacts: T[]): ValidationResult[] {
    this.logger.info("Starting batch validation", { count: artifacts.length });
    return artifacts.map((artifact) => this.validate(artifact));
  }

  /**
   * Get aggregate validation results for a batch
   */
  public validateBatchAggregate(artifacts: T[]): {
    overall: ValidationResult;
    individual: ValidationResult[];
    statistics: {
      totalArtifacts: number;
      validArtifacts: number;
      invalidArtifacts: number;
      averageScore: number;
      commonIssues: Array<{ code: string; count: number }>;
    };
  } {
    const individual = this.validateBatch(artifacts);
    const validArtifacts = individual.filter((r) => r.isValid).length;
    const averageScore =
      individual.reduce((sum, r) => sum + r.score, 0) / individual.length;

    // Aggregate all issues
    const allIssues: ValidationIssue[] = [];
    individual.forEach((result) => allIssues.push(...result.issues));

    // Find common issues
    const issueMap = new Map<string, number>();
    allIssues.forEach((issue) => {
      issueMap.set(issue.code, (issueMap.get(issue.code) || 0) + 1);
    });

    const commonIssues = Array.from(issueMap.entries())
      .map(([code, count]) => ({ code, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10); // Top 10 common issues

    return {
      overall: this.buildValidationResult(allIssues, 0),
      individual,
      statistics: {
        totalArtifacts: artifacts.length,
        validArtifacts,
        invalidArtifacts: artifacts.length - validArtifacts,
        averageScore,
        commonIssues,
      },
    };
  }

  // Abstract methods to be implemented by concrete validators

  /**
   * Get the artifact type name
   */
  protected abstract getArtifactType(): string;

  /**
   * Validate basic structure and data types
   */
  protected abstract validateBasicStructure(artifact: T): ValidationIssue[];

  /**
   * Validate required fields are present and valid
   */
  protected abstract validateRequiredFields(artifact: T): ValidationIssue[];

  /**
   * Validate business-specific rules
   */
  protected abstract validateBusinessRules(artifact: T): ValidationIssue[];

  /**
   * Validate performance characteristics (optional, default implementation)
   */
  protected validatePerformance(artifact: T): ValidationIssue[] {
    // Default implementation - can be overridden
    return [];
  }

  /**
   * Validate compatibility with other artifacts (optional, default implementation)
   */
  protected validateCompatibility(artifact: T): ValidationIssue[] {
    // Default implementation - can be overridden
    return [];
  }

  /**
   * Final validation step (optional, default implementation)
   */
  protected validateFinal(artifact: T): ValidationIssue[] {
    // Default implementation - can be overridden
    return [];
  }

  // Helper methods

  /**
   * Create validation issue
   */
  protected createIssue(
    severity: ValidationSeverity,
    code: string,
    message: string,
    field?: string,
    suggestion?: string,
    metadata?: Record<string, any>
  ): ValidationIssue {
    return {
      severity,
      code,
      message,
      field,
      suggestion,
      metadata,
    };
  }

  /**
   * Validate rarity value
   */
  protected validateRarity(
    rarity: any,
    fieldName: string = "rarity"
  ): ValidationIssue[] {
    const issues: ValidationIssue[] = [];

    if (rarity === undefined || rarity === null) {
      issues.push(
        this.createIssue(
          ValidationSeverity.ERROR,
          "MISSING_RARITY",
          `${fieldName} is required`,
          fieldName,
          "Set a valid rarity value"
        )
      );
    } else if (!Object.values(Rarity).includes(rarity)) {
      issues.push(
        this.createIssue(
          ValidationSeverity.ERROR,
          "INVALID_RARITY",
          `Invalid ${fieldName}: ${rarity}`,
          fieldName,
          `Use one of: ${Object.values(Rarity).join(", ")}`
        )
      );
    }

    return issues;
  }

  /**
   * Validate string field
   */
  protected validateStringField(
    value: any,
    fieldName: string,
    minLength: number = 1,
    maxLength?: number
  ): ValidationIssue[] {
    const issues: ValidationIssue[] = [];

    if (!value || typeof value !== "string") {
      issues.push(
        this.createIssue(
          ValidationSeverity.ERROR,
          "INVALID_STRING_FIELD",
          `${fieldName} must be a non-empty string`,
          fieldName
        )
      );
      return issues;
    }

    if (value.length < minLength) {
      issues.push(
        this.createIssue(
          ValidationSeverity.ERROR,
          "STRING_TOO_SHORT",
          `${fieldName} must be at least ${minLength} characters`,
          fieldName
        )
      );
    }

    if (maxLength && value.length > maxLength) {
      issues.push(
        this.createIssue(
          ValidationSeverity.WARNING,
          "STRING_TOO_LONG",
          `${fieldName} is very long (${value.length} characters)`,
          fieldName,
          `Consider keeping it under ${maxLength} characters`
        )
      );
    }

    return issues;
  }

  /**
   * Validate numeric field
   */
  protected validateNumericField(
    value: any,
    fieldName: string,
    min?: number,
    max?: number
  ): ValidationIssue[] {
    const issues: ValidationIssue[] = [];

    if (typeof value !== "number" || isNaN(value)) {
      issues.push(
        this.createIssue(
          ValidationSeverity.ERROR,
          "INVALID_NUMERIC_FIELD",
          `${fieldName} must be a valid number`,
          fieldName
        )
      );
      return issues;
    }

    if (min !== undefined && value < min) {
      issues.push(
        this.createIssue(
          ValidationSeverity.ERROR,
          "NUMBER_TOO_SMALL",
          `${fieldName} must be at least ${min}`,
          fieldName
        )
      );
    }

    if (max !== undefined && value > max) {
      issues.push(
        this.createIssue(
          ValidationSeverity.WARNING,
          "NUMBER_TOO_LARGE",
          `${fieldName} is very large (${value})`,
          fieldName,
          `Consider keeping it under ${max}`
        )
      );
    }

    return issues;
  }

  /**
   * Validate array field
   */
  protected validateArrayField(
    value: any,
    fieldName: string,
    minLength?: number,
    maxLength?: number
  ): ValidationIssue[] {
    const issues: ValidationIssue[] = [];

    if (!Array.isArray(value)) {
      issues.push(
        this.createIssue(
          ValidationSeverity.ERROR,
          "INVALID_ARRAY_FIELD",
          `${fieldName} must be an array`,
          fieldName
        )
      );
      return issues;
    }

    if (minLength !== undefined && value.length < minLength) {
      issues.push(
        this.createIssue(
          ValidationSeverity.ERROR,
          "ARRAY_TOO_SHORT",
          `${fieldName} must have at least ${minLength} items`,
          fieldName
        )
      );
    }

    if (maxLength !== undefined && value.length > maxLength) {
      issues.push(
        this.createIssue(
          ValidationSeverity.WARNING,
          "ARRAY_TOO_LONG",
          `${fieldName} has many items (${value.length})`,
          fieldName,
          `Consider keeping it under ${maxLength} items`
        )
      );
    }

    return issues;
  }

  /**
   * Build final validation result
   */
  private buildValidationResult(
    issues: ValidationIssue[],
    duration: number
  ): ValidationResult {
    const summary = {
      errors: issues.filter((i) => i.severity === ValidationSeverity.ERROR)
        .length,
      warnings: issues.filter((i) => i.severity === ValidationSeverity.WARNING)
        .length,
      infos: issues.filter((i) => i.severity === ValidationSeverity.INFO)
        .length,
      criticals: issues.filter(
        (i) => i.severity === ValidationSeverity.CRITICAL
      ).length,
    };

    const isValid = summary.errors === 0 && summary.criticals === 0;

    // Calculate quality score (0-100)
    let score = 100;
    score -= summary.criticals * 40; // Critical issues heavily penalize
    score -= summary.errors * 15; // Error issues significantly penalize
    score -= summary.warnings * 5; // Warning issues moderately penalize
    score -= summary.infos * 1; // Info issues slightly penalize
    score = Math.max(0, Math.min(100, score));

    return {
      isValid,
      issues,
      score,
      summary,
    };
  }
}

/**
 * Validation rule factory for common rules
 */
export class ValidationRuleFactory {
  /**
   * Create a rule that checks for duplicate IDs
   */
  static createUniqueIdRule(artifacts: any[]): ValidationRule {
    return {
      name: "unique-id",
      apply: (artifact: any) => {
        const issues: ValidationIssue[] = [];
        const duplicates = artifacts.filter((a) => a.id === artifact.id);

        if (duplicates.length > 1) {
          issues.push({
            severity: ValidationSeverity.ERROR,
            code: "DUPLICATE_ID",
            message: `Duplicate ID found: ${artifact.id}`,
            field: "id",
            suggestion: "Ensure all artifact IDs are unique",
          });
        }

        return issues;
      },
    };
  }

  /**
   * Create a rule that checks name length
   */
  static createNameLengthRule(
    minLength: number = 3,
    maxLength: number = 50
  ): ValidationRule {
    return {
      name: "name-length",
      apply: (artifact: any) => {
        const issues: ValidationIssue[] = [];

        if (artifact.name && artifact.name.length > maxLength) {
          issues.push({
            severity: ValidationSeverity.WARNING,
            code: "NAME_TOO_LONG",
            message: `Name is very long (${artifact.name.length} characters)`,
            field: "name",
            suggestion: `Consider keeping names under ${maxLength} characters`,
          });
        }

        return issues;
      },
    };
  }

  /**
   * Create a rule that checks for profanity (placeholder implementation)
   */
  static createProfanityRule(): ValidationRule {
    return {
      name: "profanity-check",
      apply: (artifact: any) => {
        const issues: ValidationIssue[] = [];

        // Simple profanity check (in real implementation, use a proper library)
        const badWords = ["badword1", "badword2"]; // placeholder
        const text =
          `${artifact.name} ${artifact.description || ""}`.toLowerCase();

        for (const word of badWords) {
          if (text.includes(word)) {
            issues.push({
              severity: ValidationSeverity.ERROR,
              code: "PROFANITY_DETECTED",
              message: "Inappropriate content detected",
              suggestion: "Remove inappropriate language",
            });
            break;
          }
        }

        return issues;
      },
    };
  }
}
