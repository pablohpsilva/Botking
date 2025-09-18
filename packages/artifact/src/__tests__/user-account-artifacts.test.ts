/**
 * Tests for database-first User and Account artifacts
 */

import { describe, it, expect } from "vitest";
import { User, UserFactory, UserValidator } from "../user";
import { Account, AccountFactory, AccountValidator } from "../account";
import type {
  User as PrismaUser,
  Account as PrismaAccount,
} from "@prisma/client";

describe("Database-First User Artifact", () => {
  let mockPrismaUser: PrismaUser;

  beforeEach(() => {
    mockPrismaUser = {
      id: "user_123",
      email: "test@example.com",
      emailVerified: true,
      name: "Test User",
      image: "https://example.com/avatar.jpg",
      createdAt: new Date("2023-01-01"),
      updatedAt: new Date("2023-01-02"),
    };
  });

  describe("User Class", () => {
    it("should create user from Prisma data", () => {
      const user = new User(mockPrismaUser);

      expect(user.id).toBe("user_123");
      expect(user.email).toBe("test@example.com");
      expect(user.emailVerified).toBe(true);
      expect(user.name).toBe("Test User");
      expect(user.image).toBe("https://example.com/avatar.jpg");
    });

    it("should serialize and clone correctly", () => {
      const user = new User(mockPrismaUser);

      const json = user.toJSON();
      expect(json.email).toBe(user.email);
      expect(json.name).toBe(user.name);

      const serialized = user.serialize();
      expect(typeof serialized).toBe("string");

      const clone = user.clone();
      expect(clone.id).toBe(user.id);
      expect(clone.email).toBe(user.email);
      expect(clone.name).toBe(user.name);
    });

    it("should handle profile updates", async () => {
      const user = new User(mockPrismaUser);

      const result = await user.updateProfile({ name: "Updated Name" });
      expect(result).toBe(true);
    });
  });

  describe("UserFactory", () => {
    it("should create user from configuration", () => {
      const result = UserFactory.createUser({
        email: "new@example.com",
        name: "New User",
        emailVerified: false,
      });

      expect(result.success).toBe(true);
      expect(result.user!.email).toBe("new@example.com");
      expect(result.user!.name).toBe("New User");
      expect(result.user!.emailVerified).toBe(false);
    });

    it("should create user from Prisma data", () => {
      const result = UserFactory.fromPrismaUser(mockPrismaUser);

      expect(result.success).toBe(true);
      expect(result.user!.id).toBe("user_123");
      expect(result.user!.email).toBe("test@example.com");
    });

    it("should create demo user", () => {
      const result = UserFactory.createDemoUser("test123");

      expect(result.success).toBe(true);
      expect(result.user!.email).toContain("demo_test123@demo.botking.dev");
      expect(result.user!.emailVerified).toBe(false);
    });

    it("should validate required fields", () => {
      const result = UserFactory.createUser({
        email: "", // Invalid email
      });

      expect(result.success).toBe(false);
      expect(result.errors).toContain("Email is required");
    });
  });

  describe("UserValidator", () => {
    it("should validate valid user", () => {
      const user = new User(mockPrismaUser);
      const validation = UserValidator.validate(user);

      expect(validation.isValid).toBe(true);
      expect(validation.errors).toHaveLength(0);
    });

    it("should detect invalid email", () => {
      const invalidUser = new User({
        ...mockPrismaUser,
        email: "invalid-email",
      });

      const validation = UserValidator.validate(invalidUser);

      expect(validation.isValid).toBe(false);
      expect(validation.errors.some((e) => e.code === "INVALID_EMAIL")).toBe(
        true
      );
    });

    it("should provide suggestions for incomplete profile", () => {
      const incompleteUser = new User({
        ...mockPrismaUser,
        name: null,
        image: null,
      });

      const validation = UserValidator.validate(incompleteUser);

      expect(
        validation.suggestions.some((s) => s.code === "MISSING_DISPLAY_NAME")
      ).toBe(true);
      expect(
        validation.suggestions.some((s) => s.code === "MISSING_PROFILE_IMAGE")
      ).toBe(true);
    });
  });
});

describe("Database-First Account Artifact", () => {
  let mockPrismaAccount: PrismaAccount;

  beforeEach(() => {
    mockPrismaAccount = {
      id: "account_123",
      userId: "user_123",
      providerId: "google",
      accountId: "google_user_456",
      password: null,
      accessToken: "access_token_123",
      refreshToken: "refresh_token_123",
      idToken: null,
      accessTokenExpiresAt: new Date(Date.now() + 3600000), // 1 hour from now
      refreshTokenExpiresAt: new Date(Date.now() + 86400000), // 1 day from now
      createdAt: new Date("2023-01-01"),
      updatedAt: new Date("2023-01-02"),
    };
  });

  describe("Account Class", () => {
    it("should create account from Prisma data", () => {
      const account = new Account(mockPrismaAccount);

      expect(account.id).toBe("account_123");
      expect(account.userId).toBe("user_123");
      expect(account.providerId).toBe("google");
      expect(account.accountId).toBe("google_user_456");
      expect(account.accessToken).toBe("access_token_123");
    });

    it("should check token expiration", () => {
      const account = new Account(mockPrismaAccount);

      expect(account.isTokenExpired("access")).toBe(false);
      expect(account.isTokenExpired("refresh")).toBe(false);

      // Test with expired token
      const expiredAccount = new Account({
        ...mockPrismaAccount,
        accessTokenExpiresAt: new Date(Date.now() - 3600000), // 1 hour ago
      });

      expect(expiredAccount.isTokenExpired("access")).toBe(true);
    });

    it("should redact sensitive data in JSON", () => {
      const account = new Account(mockPrismaAccount);
      const json = account.toJSON();

      expect(json.accessToken).toBe("[REDACTED]");
      expect(json.refreshToken).toBe("[REDACTED]");
      expect(json.providerId).toBe("google"); // Non-sensitive data preserved
    });

    it("should handle token updates", async () => {
      const account = new Account(mockPrismaAccount);

      const result = await account.updateTokens({
        accessToken: "new_access_token",
        accessTokenExpiresAt: new Date(Date.now() + 3600000),
      });

      expect(result).toBe(true);
    });
  });

  describe("AccountFactory", () => {
    it("should create OAuth account", () => {
      const result = AccountFactory.createOAuthAccount(
        "user_123",
        "google",
        "google_user_456",
        {
          accessToken: "access_token",
          refreshToken: "refresh_token",
        }
      );

      expect(result.success).toBe(true);
      expect(result.account!.providerId).toBe("google");
      expect(result.account!.accessToken).toBe("access_token");
    });

    it("should create password account", () => {
      const result = AccountFactory.createPasswordAccount(
        "user_123",
        "credentials",
        "user@example.com",
        "hashed_password"
      );

      expect(result.success).toBe(true);
      expect(result.account!.providerId).toBe("credentials");
      expect(result.account!.password).toBe("hashed_password");
    });

    it("should validate required fields", () => {
      const result = AccountFactory.createAccount({
        userId: "",
        providerId: "google",
        accountId: "test",
      });

      expect(result.success).toBe(false);
      expect(result.errors).toContain("User ID is required");
    });
  });

  describe("AccountValidator", () => {
    it("should validate valid account", () => {
      const account = new Account(mockPrismaAccount);
      const validation = AccountValidator.validate(account);

      expect(validation.isValid).toBe(true);
      expect(validation.errors).toHaveLength(0);
    });

    it("should detect expired tokens", () => {
      const expiredAccount = new Account({
        ...mockPrismaAccount,
        accessTokenExpiresAt: new Date(Date.now() - 3600000), // Expired
      });

      const validation = AccountValidator.validate(expiredAccount);

      expect(
        validation.warnings.some((w) => w.code === "EXPIRED_ACCESS_TOKEN")
      ).toBe(true);
    });

    it("should warn about missing password for credential accounts", () => {
      const credentialAccount = new Account({
        ...mockPrismaAccount,
        providerId: "credentials",
        password: null,
      });

      const validation = AccountValidator.validate(credentialAccount);

      expect(validation.isValid).toBe(true); // It's a warning, not an error
      expect(
        validation.warnings.some((w) => w.code === "MISSING_PASSWORD")
      ).toBe(true);
    });
  });
});
