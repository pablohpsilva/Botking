/**
 * Account validator for Account artifacts based on schema.prisma Account model
 */

import type { IAccount } from "./account-interface";
import { LoggerFactory } from "@botking/logger";

/**
 * Validation issue interface
 */
export interface AccountValidationIssue {
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
export interface AccountValidationResult {
  isValid: boolean;
  errors: AccountValidationIssue[];
  warnings: AccountValidationIssue[];
  suggestions: AccountValidationIssue[];
  summary: AccountValidationSummary;
}

/**
 * Account validation summary interface
 */
export interface AccountValidationSummary {
  totalIssues: number;
  errors: number;
  warnings: number;
  suggestions: number;
  validationLevel: "excellent" | "good" | "fair" | "poor" | "critical";
  security: number; // 0-100 security score
  recommendations: string[];
}

/**
 * Validator for Account artifacts
 */
export class AccountValidator {
  private static logger = LoggerFactory.createPackageLogger("artifact", {
    service: "account-validator",
  });

  /**
   * Validate an Account artifact
   */
  static validate(
    account: IAccount,
    strict: boolean = false
  ): AccountValidationResult {
    const errors: AccountValidationIssue[] = [];
    const warnings: AccountValidationIssue[] = [];
    const suggestions: AccountValidationIssue[] = [];

    // Core field validation
    this.validateCoreFields(account, errors, warnings, suggestions);

    // Token validation
    this.validateTokens(account, warnings, suggestions);

    // Security validation
    this.validateSecurity(account, warnings, suggestions);

    // Strict mode additional validations
    if (strict) {
      this.validateStrict(account, errors);
    }

    // Calculate validation score
    const score = this.calculateValidationScore(errors, warnings, suggestions);

    // Generate summary
    const summary = this.generateSummary(
      account,
      errors,
      warnings,
      suggestions,
      score
    );

    const result: AccountValidationResult = {
      isValid: errors.length === 0,
      errors,
      warnings,
      suggestions,
      summary,
    };

    AccountValidator.logger.debug("Account validation completed", {
      accountId: account.id,
      userId: account.userId,
      isValid: result.isValid,
      totalIssues: summary.totalIssues,
    });

    return result;
  }

  /**
   * Validate core database fields
   */
  private static validateCoreFields(
    account: IAccount,
    errors: AccountValidationIssue[],
    warnings: AccountValidationIssue[],
    suggestions: AccountValidationIssue[]
  ): void {
    // ID validation
    if (!account.id || account.id.trim().length === 0) {
      errors.push({
        code: "INVALID_ID",
        field: "id",
        message: "Account ID is required",
        severity: "error",
        currentValue: account.id,
      });
    }

    // User ID validation
    if (!account.userId || account.userId.trim().length === 0) {
      errors.push({
        code: "MISSING_USER_ID",
        field: "userId",
        message: "User ID is required",
        severity: "error",
        currentValue: account.userId,
      });
    }

    // Provider ID validation
    if (!account.providerId || account.providerId.trim().length === 0) {
      errors.push({
        code: "MISSING_PROVIDER_ID",
        field: "providerId",
        message: "Provider ID is required",
        severity: "error",
        currentValue: account.providerId,
      });
    }

    // Account ID validation
    if (!account.accountId || account.accountId.trim().length === 0) {
      errors.push({
        code: "MISSING_ACCOUNT_ID",
        field: "accountId",
        message: "Account ID is required",
        severity: "error",
        currentValue: account.accountId,
      });
    }

    // Date validation
    if (
      !(account.createdAt instanceof Date) ||
      isNaN(account.createdAt.getTime())
    ) {
      errors.push({
        code: "INVALID_CREATED_DATE",
        field: "createdAt",
        message: "Invalid creation date",
        severity: "error",
        currentValue: account.createdAt,
      });
    }

    if (
      !(account.updatedAt instanceof Date) ||
      isNaN(account.updatedAt.getTime())
    ) {
      errors.push({
        code: "INVALID_UPDATED_DATE",
        field: "updatedAt",
        message: "Invalid update date",
        severity: "error",
        currentValue: account.updatedAt,
      });
    }

    // Date order validation
    if (
      account.createdAt &&
      account.updatedAt &&
      account.updatedAt < account.createdAt
    ) {
      errors.push({
        code: "INVALID_DATE_ORDER",
        field: "updatedAt",
        message: "Update date cannot be before creation date",
        severity: "error",
        currentValue: {
          createdAt: account.createdAt,
          updatedAt: account.updatedAt,
        },
      });
    }
  }

  /**
   * Validate tokens
   */
  private static validateTokens(
    account: IAccount,
    warnings: AccountValidationIssue[],
    suggestions: AccountValidationIssue[]
  ): void {
    // Check for expired tokens
    if (account.isTokenExpired("access")) {
      warnings.push({
        code: "EXPIRED_ACCESS_TOKEN",
        field: "accessTokenExpiresAt",
        message: "Access token has expired",
        severity: "warning",
        recommendation: "Refresh the access token",
      });
    }

    if (account.isTokenExpired("refresh")) {
      warnings.push({
        code: "EXPIRED_REFRESH_TOKEN",
        field: "refreshTokenExpiresAt",
        message: "Refresh token has expired",
        severity: "warning",
        recommendation: "Re-authenticate the user",
      });
    }

    // Check for missing tokens for OAuth accounts
    if (account.providerId !== "credentials") {
      if (!account.accessToken) {
        suggestions.push({
          code: "MISSING_ACCESS_TOKEN",
          field: "accessToken",
          message: "OAuth account missing access token",
          severity: "suggestion",
          recommendation: "Ensure access token is properly stored",
        });
      }
    }

    // Check for missing password for credential accounts
    if (account.providerId === "credentials" && !account.password) {
      warnings.push({
        code: "MISSING_PASSWORD",
        field: "password",
        message: "Credential account requires password",
        severity: "warning",
        recommendation: "Set password for credential authentication",
      });
    }
  }

  /**
   * Validate security aspects
   */
  private static validateSecurity(
    account: IAccount,
    warnings: AccountValidationIssue[],
    suggestions: AccountValidationIssue[]
  ): void {
    // Token expiration timing
    const now = new Date();

    if (account.accessTokenExpiresAt) {
      const timeToExpiry =
        account.accessTokenExpiresAt.getTime() - now.getTime();
      const hoursToExpiry = timeToExpiry / (1000 * 60 * 60);

      if (hoursToExpiry < 1 && hoursToExpiry > 0) {
        warnings.push({
          code: "ACCESS_TOKEN_EXPIRING_SOON",
          field: "accessTokenExpiresAt",
          message: "Access token expires within 1 hour",
          severity: "warning",
          recommendation: "Consider refreshing the token proactively",
        });
      }
    }

    // Check for very old accounts without recent token updates
    if (account.updatedAt) {
      const daysSinceUpdate =
        (now.getTime() - account.updatedAt.getTime()) / (1000 * 60 * 60 * 24);

      if (daysSinceUpdate > 90) {
        suggestions.push({
          code: "STALE_ACCOUNT",
          field: "updatedAt",
          message: "Account hasn't been updated in over 90 days",
          severity: "suggestion",
          recommendation: "Consider checking if account is still active",
        });
      }
    }
  }

  /**
   * Additional validations for strict mode
   */
  private static validateStrict(
    account: IAccount,
    errors: AccountValidationIssue[]
  ): void {
    // In strict mode, OAuth accounts must have tokens
    if (account.providerId !== "credentials") {
      if (!account.accessToken) {
        errors.push({
          code: "STRICT_MISSING_ACCESS_TOKEN",
          field: "accessToken",
          message: "OAuth account must have access token in strict mode",
          severity: "error",
        });
      }
    }

    // In strict mode, tokens must not be expired
    if (account.isTokenExpired("access")) {
      errors.push({
        code: "STRICT_EXPIRED_ACCESS_TOKEN",
        field: "accessTokenExpiresAt",
        message: "Access token must not be expired in strict mode",
        severity: "error",
      });
    }
  }

  /**
   * Calculate security score
   */
  private static calculateSecurityScore(account: IAccount): number {
    let score = 0;

    // Basic validation (40 points)
    if (account.id && account.userId && account.providerId && account.accountId)
      score += 40;

    // Token management (30 points)
    if (account.providerId === "credentials") {
      if (account.password) score += 30;
    } else {
      if (account.accessToken) score += 15;
      if (account.refreshToken) score += 15;
    }

    // Token expiration (20 points)
    if (!account.isTokenExpired("access")) score += 10;
    if (!account.isTokenExpired("refresh")) score += 10;

    // Recent activity (10 points)
    if (account.updatedAt) {
      const daysSinceUpdate =
        (Date.now() - account.updatedAt.getTime()) / (1000 * 60 * 60 * 24);
      if (daysSinceUpdate <= 30) score += 10;
    }

    return Math.min(100, score);
  }

  /**
   * Calculate validation score
   */
  private static calculateValidationScore(
    errors: AccountValidationIssue[],
    warnings: AccountValidationIssue[],
    suggestions: AccountValidationIssue[]
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
    account: IAccount,
    errors: AccountValidationIssue[],
    warnings: AccountValidationIssue[],
    suggestions: AccountValidationIssue[],
    score: number
  ): AccountValidationSummary {
    const totalIssues = errors.length + warnings.length + suggestions.length;

    let validationLevel: AccountValidationSummary["validationLevel"];
    if (score >= 90) validationLevel = "excellent";
    else if (score >= 75) validationLevel = "good";
    else if (score >= 60) validationLevel = "fair";
    else if (score >= 40) validationLevel = "poor";
    else validationLevel = "critical";

    const security = this.calculateSecurityScore(account);

    const recommendations: string[] = [];
    if (account.isTokenExpired("access")) {
      recommendations.push("Refresh expired access token");
    }
    if (account.isTokenExpired("refresh")) {
      recommendations.push("Re-authenticate user (refresh token expired)");
    }
    if (account.providerId === "credentials" && !account.password) {
      recommendations.push("Set password for credential account");
    }

    return {
      totalIssues,
      errors: errors.length,
      warnings: warnings.length,
      suggestions: suggestions.length,
      validationLevel,
      security,
      recommendations,
    };
  }
}
