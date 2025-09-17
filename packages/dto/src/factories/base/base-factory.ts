import { ValidationResult, ValidationError } from "../../interfaces/base-dto";

/**
 * Base factory class for creating DTOs
 */
export abstract class BaseDTOFactory<T> {
  /**
   * Create a new DTO with default values
   */
  public abstract createDefault(overrides?: Partial<T>): T;

  /**
   * Create a DTO from existing data
   */
  public abstract createFromData(data: any): T;

  /**
   * Validate a DTO
   */
  public abstract validate(dto: T): ValidationResult;

  /**
   * Generate a unique ID
   */
  protected generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Get current timestamp
   */
  protected getCurrentTimestamp(): Date {
    return new Date();
  }

  /**
   * Merge data with defaults
   */
  protected mergeDefaults<U>(defaults: U, overrides?: Partial<U>): U {
    return { ...defaults, ...overrides };
  }

  /**
   * Validate required fields
   */
  protected validateRequired(
    data: any,
    requiredFields: string[]
  ): ValidationError[] {
    const errors: ValidationError[] = [];

    requiredFields.forEach((field) => {
      if (
        data[field] === undefined ||
        data[field] === null ||
        data[field] === ""
      ) {
        errors.push({
          field,
          message: `${field} is required`,
          code: "REQUIRED_FIELD",
          value: data[field],
        });
      }
    });

    return errors;
  }

  /**
   * Validate string length
   */
  protected validateStringLength(
    value: string,
    field: string,
    min?: number,
    max?: number
  ): ValidationError[] {
    const errors: ValidationError[] = [];

    if (min !== undefined && value.length < min) {
      errors.push({
        field,
        message: `${field} must be at least ${min} characters`,
        code: "MIN_LENGTH",
        value,
      });
    }

    if (max !== undefined && value.length > max) {
      errors.push({
        field,
        message: `${field} must be no more than ${max} characters`,
        code: "MAX_LENGTH",
        value,
      });
    }

    return errors;
  }

  /**
   * Validate number range
   */
  protected validateNumberRange(
    value: number,
    field: string,
    min?: number,
    max?: number
  ): ValidationError[] {
    const errors: ValidationError[] = [];

    if (min !== undefined && value < min) {
      errors.push({
        field,
        message: `${field} must be at least ${min}`,
        code: "MIN_VALUE",
        value,
      });
    }

    if (max !== undefined && value > max) {
      errors.push({
        field,
        message: `${field} must be no more than ${max}`,
        code: "MAX_VALUE",
        value,
      });
    }

    return errors;
  }

  /**
   * Validate enum value
   */
  protected validateEnum(
    value: any,
    field: string,
    enumValues: any[]
  ): ValidationError[] {
    const errors: ValidationError[] = [];

    if (!enumValues.includes(value)) {
      errors.push({
        field,
        message: `${field} must be one of: ${enumValues.join(", ")}`,
        code: "INVALID_ENUM",
        value,
      });
    }

    return errors;
  }
}
