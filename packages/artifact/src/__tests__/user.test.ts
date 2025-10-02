import { describe, it, expect } from "vitest";
import { User } from "../user";
import {
  generateTestId,
  generateTestEmail,
  generateTestDates,
} from "./test-utils";

describe("User", () => {
  describe("Constructor", () => {
    it("should create a User instance with all required properties", () => {
      const { createdAt, updatedAt } = generateTestDates();
      const props = {
        name: "John Doe",
        email: generateTestEmail(),
        createdAt,
        updatedAt,
      };

      const user = new User(props);

      expect(user.name).toBe(props.name);
      expect(user.email).toBe(props.email);
      expect(user.createdAt).toBe(props.createdAt);
      expect(user.updatedAt).toBe(props.updatedAt);
      expect(user.id).toBe(""); // Default empty string when not provided
    });

    it("should create a User instance with provided id", () => {
      const { createdAt, updatedAt } = generateTestDates();
      const id = generateTestId();
      const props = {
        id,
        name: "Jane Doe",
        email: generateTestEmail(),
        createdAt,
        updatedAt,
      };

      const user = new User(props);

      expect(user.id).toBe(id);
      expect(user.name).toBe(props.name);
      expect(user.email).toBe(props.email);
      expect(user.createdAt).toBe(props.createdAt);
      expect(user.updatedAt).toBe(props.updatedAt);
    });
  });

  describe("CRUD Operations", () => {
    it("should support Create operation", () => {
      const { createdAt, updatedAt } = generateTestDates();
      const userData = {
        name: "New User",
        email: generateTestEmail(),
        createdAt,
        updatedAt,
      };

      const user = new User(userData);

      expect(user).toBeInstanceOf(User);
      expect(user.name).toBe(userData.name);
      expect(user.email).toBe(userData.email);
    });

    it("should support Read operation by accessing properties", () => {
      const { createdAt, updatedAt } = generateTestDates();
      const id = generateTestId();
      const user = new User({
        id,
        name: "Read User",
        email: generateTestEmail(),
        createdAt,
        updatedAt,
      });

      // Read operations
      expect(user.id).toBe(id);
      expect(user.name).toBe("Read User");
      expect(user.email).toContain("@example.com");
      expect(user.createdAt).toBe(createdAt);
      expect(user.updatedAt).toBe(updatedAt);
    });

    it("should support Update operation by modifying properties", () => {
      const { createdAt, updatedAt } = generateTestDates();
      const user = new User({
        id: generateTestId(),
        name: "Original Name",
        email: generateTestEmail(),
        createdAt,
        updatedAt,
      });

      // Update operations
      const newName = "Updated Name";
      const newEmail = generateTestEmail();
      const newUpdatedAt = new Date();

      user.name = newName;
      user.email = newEmail;
      user.updatedAt = newUpdatedAt;

      expect(user.name).toBe(newName);
      expect(user.email).toBe(newEmail);
      expect(user.updatedAt).toBe(newUpdatedAt);
    });

    it("should support Delete operation by nullifying properties", () => {
      const { createdAt, updatedAt } = generateTestDates();
      const user = new User({
        id: generateTestId(),
        name: "To Be Deleted",
        email: generateTestEmail(),
        createdAt,
        updatedAt,
      });

      // Simulate delete by clearing properties (soft delete)
      user.name = "";
      user.email = "";

      expect(user.name).toBe("");
      expect(user.email).toBe("");
      // ID and timestamps should remain for audit purposes
      expect(user.id).toBeTruthy();
      expect(user.createdAt).toBe(createdAt);
      expect(user.updatedAt).toBe(updatedAt);
    });
  });

  describe("Edge Cases", () => {
    it("should handle empty strings", () => {
      const { createdAt, updatedAt } = generateTestDates();
      const user = new User({
        name: "",
        email: "",
        createdAt,
        updatedAt,
      });

      expect(user.name).toBe("");
      expect(user.email).toBe("");
    });

    it("should handle special characters in name and email", () => {
      const { createdAt, updatedAt } = generateTestDates();
      const user = new User({
        name: "José María O'Connor-Smith",
        email: "test+tag@sub-domain.co.uk",
        createdAt,
        updatedAt,
      });

      expect(user.name).toBe("José María O'Connor-Smith");
      expect(user.email).toBe("test+tag@sub-domain.co.uk");
    });

    it("should handle date edge cases", () => {
      const veryOldDate = new Date("1970-01-01");
      const futureDate = new Date("2099-12-31");

      const user = new User({
        name: "Time Traveler",
        email: generateTestEmail(),
        createdAt: veryOldDate,
        updatedAt: futureDate,
      });

      expect(user.createdAt).toBe(veryOldDate);
      expect(user.updatedAt).toBe(futureDate);
    });
  });

  describe("Data Integrity", () => {
    it("should maintain data integrity after multiple updates", () => {
      const { createdAt, updatedAt } = generateTestDates();
      const originalId = generateTestId();
      const user = new User({
        id: originalId,
        name: "Original",
        email: generateTestEmail(),
        createdAt,
        updatedAt,
      });

      // Multiple updates
      user.name = "First Update";
      user.name = "Second Update";
      user.name = "Final Update";

      expect(user.id).toBe(originalId); // ID should not change
      expect(user.name).toBe("Final Update");
      expect(user.createdAt).toBe(createdAt); // Created date should not change
    });

    it("should handle concurrent-like updates", () => {
      const { createdAt, updatedAt } = generateTestDates();
      const user = new User({
        id: generateTestId(),
        name: "Concurrent Test",
        email: generateTestEmail(),
        createdAt,
        updatedAt,
      });

      const update1 = new Date();
      const update2 = new Date(update1.getTime() + 1000);

      user.updatedAt = update1;
      user.name = "Update 1";

      user.updatedAt = update2;
      user.name = "Update 2";

      expect(user.name).toBe("Update 2");
      expect(user.updatedAt).toBe(update2);
    });
  });
});
