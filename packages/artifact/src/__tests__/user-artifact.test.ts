/**
 * User artifact tests - Database-first approach
 * Tests for user artifact creation, validation, and operations based on schema.prisma
 */

import { describe, it, expect, beforeEach } from "vitest";
import { User, UserFactory, UserValidator } from "../user";
import type { UserConfiguration } from "../user";

describe("User Artifact - Database First", () => {
  describe("UserFactory", () => {
    it("should create a basic user", () => {
      const config: UserConfiguration = {
        email: "test@example.com",
        name: "Test User",
        emailVerified: true,
      };

      const result = UserFactory.createUser(config);

      expect(result.success).toBe(true);
      expect(result.user).toBeDefined();
      expect(result.user!.email).toBe("test@example.com");
      expect(result.user!.name).toBe("Test User");
      expect(result.user!.emailVerified).toBe(true);
    });

    it("should reject invalid email", () => {
      const config: UserConfiguration = {
        email: "",
        name: "Test User",
      };

      const result = UserFactory.createUser(config);

      expect(result.success).toBe(false);
      expect(result.errors).toContain("Email is required");
    });

    it("should create user with minimal data", () => {
      const config: UserConfiguration = {
        email: "minimal@example.com",
      };

      const result = UserFactory.createUser(config);

      expect(result.success).toBe(true);
      expect(result.user!.email).toBe("minimal@example.com");
      expect(result.user!.name).toBe(null);
      expect(result.user!.emailVerified).toBe(false);
    });

    it("should create demo user", () => {
      const result = UserFactory.createDemoUser("test123");

      expect(result.success).toBe(true);
      expect(result.user!.email).toContain("demo_test123@demo.botking.dev");
      expect(result.user!.emailVerified).toBe(false);
    });

    it("should create user from Prisma data", () => {
      const prismaUser = {
        id: "user_123",
        email: "prisma@example.com",
        emailVerified: true,
        name: "Prisma User",
        image: "https://example.com/avatar.jpg",
        createdAt: new Date("2023-01-01"),
        updatedAt: new Date("2023-01-02"),
      };

      const result = UserFactory.fromPrismaUser(prismaUser);

      expect(result.success).toBe(true);
      expect(result.user!.id).toBe("user_123");
      expect(result.user!.email).toBe("prisma@example.com");
      expect(result.user!.name).toBe("Prisma User");
    });
  });

  describe("User Class", () => {
    let user: User;

    beforeEach(() => {
      const config: UserConfiguration = {
        email: "test@example.com",
        name: "Test User",
        emailVerified: true,
      };
      const result = UserFactory.createUser(config);
      user = result.user as User;
    });

    it("should have correct initial values", () => {
      expect(user.email).toBe("test@example.com");
      expect(user.name).toBe("Test User");
      expect(user.emailVerified).toBe(true);
      expect(user.id).toBeDefined();
      expect(user.createdAt).toBeDefined();
      expect(user.updatedAt).toBeDefined();
    });

    it("should update profile successfully", async () => {
      const success = await user.updateProfile({
        name: "Updated Name",
      });

      expect(success).toBe(true);
      // Note: The actual name change would be handled by the repository layer
    });

    it("should update email successfully", async () => {
      const success = await user.updateEmail("updated@example.com");

      expect(success).toBe(true);
      // Note: The actual email change would be handled by the repository layer
    });

    it("should verify email successfully", async () => {
      const success = await user.verifyEmail();

      expect(success).toBe(true);
      // Note: The actual verification would be handled by the repository layer
    });

    it("should serialize correctly", () => {
      const json = user.toJSON();

      expect(json.email).toBe(user.email);
      expect(json.name).toBe(user.name);
      expect(json.emailVerified).toBe(user.emailVerified);
    });

    it("should clone correctly", () => {
      const clone = user.clone();

      expect(clone.id).toBe(user.id);
      expect(clone.email).toBe(user.email);
      expect(clone.name).toBe(user.name);
      expect(clone).not.toBe(user); // Different object reference
    });
  });

  describe("UserValidator", () => {
    let user: User;

    beforeEach(() => {
      const config: UserConfiguration = {
        email: "test@example.com",
        name: "Test User",
        emailVerified: true,
      };
      const result = UserFactory.createUser(config);
      user = result.user as User;
    });

    it("should validate a good user", () => {
      const validation = UserValidator.validate(user);

      expect(validation.isValid).toBe(true);
      expect(validation.errors).toHaveLength(0);
      // Note: May have suggestions for profile improvements (image, etc.)
      expect(validation.summary.totalIssues).toBeGreaterThanOrEqual(0);
    });

    it("should detect invalid email", () => {
      const invalidUser = new User({
        id: "test_id",
        email: "",
        emailVerified: false,
        name: "Test User",
        image: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const validation = UserValidator.validate(invalidUser);

      expect(validation.isValid).toBe(false);
      expect(validation.errors.some((e) => e.code === "MISSING_EMAIL")).toBe(
        true
      );
    });

    it("should detect unverified email", () => {
      const unverifiedUser = new User({
        id: "test_id",
        email: "test@example.com",
        emailVerified: false,
        name: "Test User",
        image: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const validation = UserValidator.validate(unverifiedUser);

      expect(validation.isValid).toBe(true); // Not an error, just a warning
      expect(
        validation.warnings.some((w) => w.code === "UNVERIFIED_EMAIL")
      ).toBe(true);
    });

    it("should suggest profile improvements", () => {
      const incompleteUser = new User({
        id: "test_id",
        email: "test@example.com",
        emailVerified: true,
        name: null,
        image: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const validation = UserValidator.validate(incompleteUser);

      expect(
        validation.suggestions.some((s) => s.code === "MISSING_DISPLAY_NAME")
      ).toBe(true);
      expect(
        validation.suggestions.some((s) => s.code === "MISSING_PROFILE_IMAGE")
      ).toBe(true);
    });

    it("should provide validation summary", () => {
      const validation = UserValidator.validate(user);

      expect(validation.summary).toBeDefined();
      expect(validation.summary.validationLevel).toBe("excellent");
      expect(validation.summary.completeness).toBeGreaterThan(0);
      expect(validation.summary.recommendations).toBeDefined();
    });

    it("should handle strict validation", () => {
      const validation = UserValidator.validate(user, true);

      expect(validation.isValid).toBe(true);
      // Strict mode might have different requirements
    });
  });

  describe("User Creation Edge Cases", () => {
    it("should handle missing email", () => {
      const config = {
        name: "Test User",
      } as UserConfiguration;

      const result = UserFactory.createUser(config);

      expect(result.success).toBe(false);
      expect(result.errors).toContain("Email is required");
    });

    it("should generate unique IDs", () => {
      const config: UserConfiguration = {
        email: "test1@example.com",
      };

      const result1 = UserFactory.createUser(config);
      const result2 = UserFactory.createUser({
        email: "test2@example.com",
      });

      expect(result1.user!.id).not.toBe(result2.user!.id);
    });

    it("should handle JSON serialization and deserialization", () => {
      const config: UserConfiguration = {
        email: "json@example.com",
        name: "JSON User",
        emailVerified: true,
      };

      const result = UserFactory.createUser(config);
      const user = result.user!;

      const serialized = user.serialize();
      const parsed = JSON.parse(serialized);

      expect(parsed.email).toBe(user.email);
      expect(parsed.name).toBe(user.name);
      expect(parsed.emailVerified).toBe(user.emailVerified);
    });

    it("should handle safe creation from JSON", () => {
      const jsonData = {
        email: "fromjson@example.com",
        name: "From JSON",
        emailVerified: true,
      };

      const result = UserFactory.fromJSON(jsonData);

      expect(result.success).toBe(true);
      expect(result.user!.email).toBe("fromjson@example.com");
    });

    it("should handle invalid JSON gracefully", () => {
      const invalidJson = "invalid json string";

      const result = UserFactory.fromJSON(invalidJson);

      expect(result.success).toBe(false);
      expect(result.errors).toBeDefined();
    });
  });
});
