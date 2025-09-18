/**
 * User validator for User artifacts based on schema.prisma User model
 */

import type { IUser } from "./user-interface";
import { LoggerFactory } from "@botking/logger";

/**
 * Validation issue interface
 */
export interface UserValidationIssue {
  code: string;
  field: string;
  message: string;
  severity: "error" | "warning" | "suggestion";
  currentValue?: any;
  expectedValue?: any;
  recommendation?: string;
}

/**
 * Validation result interface
 */
export interface UserValidationResult {
  isValid: boolean;
  errors: UserValidationIssue[];
  warnings: UserValidationIssue[];
  suggestions: UserValidationIssue[];
  summary: UserValidationSummary;
}

/**
 * User validation summary interface
 */
export interface UserValidationSummary {
  totalIssues: number;
  errors: number;
  warnings: number;
  suggestions: number;
  validationLevel: "excellent" | "good" | "fair" | "poor" | "critical";
  completeness: number; // 0-100 profile completeness
  recommendations: string[];
}

/**
 * Validator for User artifacts
 */
export class UserValidator {
  private static logger = LoggerFactory.createPackageLogger("artifact", {
    service: "user-validator",
  });

  /**
   * Validate a User artifact
   */
  static validate(user: IUser, strict: boolean = false): UserValidationResult {
    const errors: UserValidationIssue[] = [];
    const warnings: UserValidationIssue[] = [];
    const suggestions: UserValidationIssue[] = [];

    // Core field validation
    this.validateCoreFields(user, errors, warnings, suggestions);

    // Profile completeness validation
    this.validateProfileCompleteness(user, warnings, suggestions);

    // Strict mode additional validations
    if (strict) {
      this.validateStrict(user, errors);
    }

    // Calculate validation score
    const score = this.calculateValidationScore(errors, warnings, suggestions);

    // Generate summary
    const summary = this.generateSummary(
      user,
      errors,
      warnings,
      suggestions,
      score
    );

    const result: UserValidationResult = {
      isValid: errors.length === 0,
      errors,
      warnings,
      suggestions,
      summary,
    };

    UserValidator.logger.debug("User validation completed", {
      userId: user.id,
      isValid: result.isValid,
      totalIssues: summary.totalIssues,
    });

    return result;
  }

  /**
   * Validate core database fields
   */
  private static validateCoreFields(
    user: IUser,
    errors: UserValidationIssue[],
    warnings: UserValidationIssue[],
    suggestions: UserValidationIssue[]
  ): void {
    // ID validation
    if (!user.id || user.id.trim().length === 0) {
      errors.push({
        code: "INVALID_ID",
        field: "id",
        message: "User ID is required",
        severity: "error",
        currentValue: user.id,
      });
    }

    // Email validation
    if (!user.email || user.email.trim().length === 0) {
      errors.push({
        code: "MISSING_EMAIL",
        field: "email",
        message: "Email address is required",
        severity: "error",
        currentValue: user.email,
      });
    } else if (!this.isValidEmail(user.email)) {
      errors.push({
        code: "INVALID_EMAIL",
        field: "email",
        message: "Invalid email format",
        severity: "error",
        currentValue: user.email,
      });
    }

    // Name validation (optional but recommended)
    if (!user.name || user.name.trim().length === 0) {
      suggestions.push({
        code: "MISSING_NAME",
        field: "name",
        message: "Consider adding a display name",
        severity: "suggestion",
        recommendation: "A display name improves user experience",
      });
    } else if (user.name.length > 100) {
      errors.push({
        code: "NAME_TOO_LONG",
        field: "name",
        message: "Name cannot exceed 100 characters",
        severity: "error",
        currentValue: user.name.length,
        expectedValue: 100,
      });
    }

    // Date validation
    if (!(user.createdAt instanceof Date) || isNaN(user.createdAt.getTime())) {
      errors.push({
        code: "INVALID_CREATED_DATE",
        field: "createdAt",
        message: "Invalid creation date",
        severity: "error",
        currentValue: user.createdAt,
      });
    }

    if (!(user.updatedAt instanceof Date) || isNaN(user.updatedAt.getTime())) {
      errors.push({
        code: "INVALID_UPDATED_DATE",
        field: "updatedAt",
        message: "Invalid update date",
        severity: "error",
        currentValue: user.updatedAt,
      });
    }

    // Date order validation
    if (user.createdAt && user.updatedAt && user.updatedAt < user.createdAt) {
      errors.push({
        code: "INVALID_DATE_ORDER",
        field: "updatedAt",
        message: "Update date cannot be before creation date",
        severity: "error",
        currentValue: { createdAt: user.createdAt, updatedAt: user.updatedAt },
      });
    }

    // Email verification warning
    if (!user.emailVerified) {
      warnings.push({
        code: "UNVERIFIED_EMAIL",
        field: "emailVerified",
        message: "Email address is not verified",
        severity: "warning",
        recommendation: "Verify email to enable all features",
      });
    }
  }

  /**
   * Validate profile completeness
   */
  private static validateProfileCompleteness(
    user: IUser,
    warnings: UserValidationIssue[],
    suggestions: UserValidationIssue[]
  ): void {
    const completeness = this.calculateCompleteness(user);

    if (completeness < 50) {
      warnings.push({
        code: "LOW_PROFILE_COMPLETENESS",
        field: "profile",
        message: "Profile is incomplete",
        severity: "warning",
        currentValue: completeness,
        recommendation: "Complete your profile for better experience",
      });
    } else if (completeness < 80) {
      suggestions.push({
        code: "PARTIAL_PROFILE_COMPLETENESS",
        field: "profile",
        message: "Profile could be more complete",
        severity: "suggestion",
        currentValue: completeness,
        recommendation: "Add more information to your profile",
      });
    }

    // Specific missing fields
    if (!user.name) {
      suggestions.push({
        code: "MISSING_DISPLAY_NAME",
        field: "name",
        message: "No display name set",
        severity: "suggestion",
        recommendation: "Add a display name",
      });
    }

    if (!user.image) {
      suggestions.push({
        code: "MISSING_PROFILE_IMAGE",
        field: "image",
        message: "No profile image set",
        severity: "suggestion",
        recommendation: "Add a profile image",
      });
    }
  }

  /**
   * Additional validations for strict mode
   */
  private static validateStrict(
    user: IUser,
    errors: UserValidationIssue[]
  ): void {
    if (!user.emailVerified) {
      errors.push({
        code: "STRICT_UNVERIFIED_EMAIL",
        field: "emailVerified",
        message: "Email verification required in strict mode",
        severity: "error",
      });
    }

    if (!user.name) {
      errors.push({
        code: "STRICT_MISSING_NAME",
        field: "name",
        message: "Display name required in strict mode",
        severity: "error",
      });
    }
  }

  /**
   * Calculate profile completeness percentage
   */
  private static calculateCompleteness(user: IUser): number {
    let completeness = 0;

    // Required fields (50 points)
    if (user.id) completeness += 15;
    if (user.email) completeness += 25;
    if (user.emailVerified) completeness += 10;

    // Optional fields (50 points)
    if (user.name) completeness += 30;
    if (user.image) completeness += 20;

    return Math.min(100, completeness);
  }

  /**
   * Calculate validation score
   */
  private static calculateValidationScore(
    errors: UserValidationIssue[],
    warnings: UserValidationIssue[],
    suggestions: UserValidationIssue[]
  ): number {
    const errorPenalty = errors.length * 25;
    const warningPenalty = warnings.length * 10;
    const suggestionPenalty = suggestions.length * 2;

    return Math.max(0, 100 - errorPenalty - warningPenalty - suggestionPenalty);
  }

  /**
   * Generate validation summary
   */
  private static generateSummary(
    user: IUser,
    errors: UserValidationIssue[],
    warnings: UserValidationIssue[],
    suggestions: UserValidationIssue[],
    score: number
  ): UserValidationSummary {
    const totalIssues = errors.length + warnings.length + suggestions.length;

    let validationLevel: UserValidationSummary["validationLevel"];
    if (score >= 90) validationLevel = "excellent";
    else if (score >= 75) validationLevel = "good";
    else if (score >= 60) validationLevel = "fair";
    else if (score >= 40) validationLevel = "poor";
    else validationLevel = "critical";

    const completeness = this.calculateCompleteness(user);

    const recommendations: string[] = [];
    if (!user.emailVerified) recommendations.push("Verify your email address");
    if (!user.name) recommendations.push("Add a display name");
    if (!user.image) recommendations.push("Add a profile image");

    return {
      totalIssues,
      errors: errors.length,
      warnings: warnings.length,
      suggestions: suggestions.length,
      validationLevel,
      completeness,
      recommendations,
    };
  }

  /**
   * Email validation helper
   */
  private static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}
