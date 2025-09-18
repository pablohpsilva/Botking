/**
 * User artifact tests
 * Tests for user artifact creation, validation, and operations
 */

import { describe, it, expect, beforeEach } from "vitest";
import {
  User,
  UserFactory,
  UserValidator,
  UserPermission,
  UserRank,
} from "../user";
import type { UserConfiguration } from "../user";

describe("User Artifact", () => {
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
        email: "invalid-email",
        name: "Test User",
      };

      const result = UserFactory.createUser(config);

      expect(result.success).toBe(false);
      expect(result.errors).toContain("Valid email address is required");
    });

    it("should create user with default preferences", () => {
      const config: UserConfiguration = {
        email: "test@example.com",
      };

      const result = UserFactory.createUser(config);

      expect(result.success).toBe(true);
      expect(result.user!.preferences.theme).toBe("auto");
      expect(result.user!.preferences.language).toBe("en");
      expect(result.user!.settings.security.twoFactorEnabled).toBe(false);
    });

    it("should create demo user", () => {
      const result = UserFactory.createDemoUser("test123");

      expect(result.success).toBe(true);
      expect(result.user!.email).toContain("demo_test123@demo.botking.dev");
      expect(result.user!.preferences.privacy.profileVisibility).toBe(
        "private"
      );
      expect(result.user!.settings.communication.allowFriendRequests).toBe(
        false
      );
    });

    it("should create admin user with enhanced security", () => {
      const result = UserFactory.createAdminUser(
        "admin@example.com",
        "Admin User"
      );

      expect(result.success).toBe(true);
      expect(result.user!.settings.security.twoFactorEnabled).toBe(true);
      expect(result.user!.settings.security.sessionTimeout).toBe(240);
      expect(result.user!.preferences.theme).toBe("dark");
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
      expect(user.level).toBe(1);
      expect(user.experience).toBe(0);
      expect(user.isActive).toBe(false); // No login recorded yet
    });

    it("should update profile successfully", async () => {
      const success = await user.updateProfile({
        name: "Updated Name",
        email: "updated@example.com",
      });

      expect(success).toBe(true);
      expect(user.name).toBe("Updated Name");
      expect(user.email).toBe("updated@example.com");
      expect(user.emailVerified).toBe(false); // Reset on email change
    });

    it("should record login activity", () => {
      const initialLogins = user.totalLogins;

      user.recordLogin();

      expect(user.totalLogins).toBe(initialLogins + 1);
      expect(user.lastLoginAt).toBeDefined();
      expect(user.isActive).toBe(true);
    });

    it("should handle experience and leveling", () => {
      const result = user.addExperience(150);

      expect(result.leveledUp).toBe(true);
      expect(result.newLevel).toBe(2);
      expect(user.level).toBe(2);
      expect(user.experience).toBe(150);
    });

    it("should calculate experience to next level", () => {
      user.addExperience(50);

      const toNext = user.experienceToNextLevel;

      expect(toNext).toBe(50); // Level 1 (0 exp) + 50 exp = 50 exp needed for level 2 (100 total)
    });

    it("should check permissions correctly", () => {
      expect(user.hasPermission(UserPermission.READ_PROFILE)).toBe(true);
      expect(user.hasPermission(UserPermission.WRITE_PROFILE)).toBe(true);
      expect(user.hasPermission(UserPermission.ADMIN_ACCESS)).toBe(false);
    });

    it("should serialize and deserialize correctly", () => {
      const json = user.toJSON();
      const serialized = user.serialize();

      expect(json.email).toBe(user.email);
      expect(json.name).toBe(user.name);
      expect(typeof serialized).toBe("string");

      const parsed = JSON.parse(serialized);
      expect(parsed.email).toBe(user.email);
    });

    it("should clone correctly", () => {
      user.addExperience(100);
      user.recordLogin();

      const clone = user.clone();

      expect(clone.id).toBe(user.id);
      expect(clone.email).toBe(user.email);
      expect(clone.level).toBe(user.level);
      expect(clone.totalLogins).toBe(user.totalLogins);
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
      expect(validation.score).toBeGreaterThan(70);
      expect(validation.errors).toHaveLength(0);
    });

    it("should detect unverified email", () => {
      const config: UserConfiguration = {
        email: "test@example.com",
        name: "Test User",
        emailVerified: false,
      };
      const result = UserFactory.createUser(config);
      const unverifiedUser = result.user as User;

      const validation = UserValidator.validate(unverifiedUser);

      const hasUnverifiedWarning = validation.warnings.some(
        (w) => w.code === "UNVERIFIED_EMAIL"
      );
      expect(hasUnverifiedWarning).toBe(true);
    });

    it("should perform quick validation", () => {
      expect(UserValidator.quickValidate(user)).toBe(true);
    });

    it("should validate for specific operations", () => {
      const loginCheck = UserValidator.validateForOperation(user, "login");
      expect(loginCheck.canProceed).toBe(true);

      const tradeCheck = UserValidator.validateForOperation(user, "trade");
      expect(tradeCheck.canProceed).toBe(false); // Level too low
      expect(tradeCheck.blockers).toContain(
        "Minimum level 5 required for trading"
      );
    });

    it("should calculate completeness score", () => {
      const validation = UserValidator.validate(user);

      expect(validation.summary.completeness).toBeGreaterThan(0);
      expect(validation.summary.completeness).toBeLessThanOrEqual(100);
    });

    it("should provide security score", () => {
      const validation = UserValidator.validate(user);

      expect(validation.summary.security).toBeGreaterThan(0);
      expect(validation.summary.security).toBeLessThanOrEqual(100);
    });

    it("should generate helpful recommendations", () => {
      const config: UserConfiguration = {
        email: "test@example.com",
        emailVerified: false,
      };
      const result = UserFactory.createUser(config);
      const incompleteUser = result.user as User;

      const validation = UserValidator.validate(incompleteUser);

      expect(validation.summary.recommendations).toContain(
        "Verify your email address"
      );
      expect(validation.summary.recommendations).toContain(
        "Add a display name"
      );
    });
  });

  describe("User Statistics and Metrics", () => {
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

    it("should track activity correctly", () => {
      user.recordLogin();
      user.addPlayTime(30);

      const stats = user.getStatistics();

      expect(stats.totalLogins).toBe(1);
      expect(stats.totalPlayTime).toBe(30);
      expect(stats.averageSessionLength).toBe(30);
    });

    it("should calculate user rank based on level", () => {
      expect(user.rank).toBe(UserRank.NOVICE);

      user.addExperience(1000); // Should reach level 6 (1000 exp = level 6)
      expect(user.rank).toBe(UserRank.APPRENTICE); // Level 5+ is apprentice
    });

    it("should track registration age", () => {
      expect(user.registrationAge).toBe(0); // Created today
    });

    it("should provide activity summary", () => {
      const summary = user.getActivitySummary(7);

      expect(summary.totalSessions).toBeDefined();
      expect(summary.totalPlayTime).toBeDefined();
      expect(summary.experienceGained).toBeDefined();
    });
  });
});
