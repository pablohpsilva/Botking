/**
 * Domain validation types and interfaces
 */

/**
 * Severity levels for validation results
 */
export enum ValidationSeverity {
  ERROR = 'error',
  WARNING = 'warning',
  INFO = 'info',
}

/**
 * Validation rule result
 */
export interface IValidationResult {
  /** Whether the validation passed */
  isValid: boolean;
  /** Validation severity */
  severity: ValidationSeverity;
  /** Rule that was validated */
  ruleName: string;
  /** Human-readable message */
  message: string;
  /** Technical details or context */
  details?: Record<string, any>;
  /** Field or property that failed validation */
  field?: string;
  /** Error code for programmatic handling */
  code?: string;
}

/**
 * Aggregated validation results
 */
export interface IValidationResults {
  /** Whether all validations passed */
  isValid: boolean;
  /** Individual validation results */
  results: IValidationResult[];
  /** All error messages */
  errors: string[];
  /** All warning messages */
  warnings: string[];
  /** All info messages */
  info: string[];
  /** Summary of validation counts */
  summary: {
    total: number;
    passed: number;
    failed: number;
    warnings: number;
  };
}

/**
 * Base interface for domain validation rules
 */
export interface IDomainRule<T = any> {
  /** Unique rule identifier */
  getRuleName(): string;
  /** Rule description */
  getDescription(): string;
  /** Validate the given entity */
  validate(entity: T): IValidationResult;
  /** Whether this rule is required or optional */
  isRequired(): boolean;
}

/**
 * Validation context for providing additional information to rules
 */
export interface IValidationContext {
  /** User ID performing the action */
  userId?: string;
  /** Action being performed */
  action?: string;
  /** Additional context data */
  metadata?: Record<string, any>;
}

/**
 * Rule execution options
 */
export interface IRuleExecutionOptions {
  /** Stop on first error */
  stopOnFirstError?: boolean;
  /** Include warnings in results */
  includeWarnings?: boolean;
  /** Include info messages in results */
  includeInfo?: boolean;
  /** Skip optional rules */
  skipOptionalRules?: boolean;
}

/**
 * Domain entity interface for validation
 */
export interface IDomainEntity {
  /** Entity ID */
  id: string;
  /** Entity type for rule selection */
  getEntityType(): string;
  /** Entity version for compatibility */
  getVersion(): number;
}
