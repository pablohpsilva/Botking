import { describe, it, expect } from "vitest";
import { AssetPack } from "../asset-pack";
import { generateTestId, generateTestDates } from "./test-utils";

describe("AssetPack", () => {
  describe("Constructor", () => {
    it("should create an AssetPack instance with all required properties", () => {
      const { createdAt, updatedAt } = generateTestDates();
      const props = {
        name: "Test Asset Pack",
        version: "1.0.0",
        createdAt,
        updatedAt,
      };

      const assetPack = new AssetPack(props);

      expect(assetPack.name).toBe(props.name);
      expect(assetPack.version).toBe(props.version);
      expect(assetPack.createdAt).toBe(props.createdAt);
      expect(assetPack.updatedAt).toBe(props.updatedAt);
      expect(assetPack.id).toBe(""); // Default empty string when not provided
    });

    it("should create an AssetPack instance with provided id", () => {
      const { createdAt, updatedAt } = generateTestDates();
      const id = generateTestId();
      const props = {
        id,
        name: "Test Asset Pack with ID",
        version: "2.0.0",
        createdAt,
        updatedAt,
      };

      const assetPack = new AssetPack(props);

      expect(assetPack.id).toBe(id);
      expect(assetPack.name).toBe(props.name);
      expect(assetPack.version).toBe(props.version);
      expect(assetPack.createdAt).toBe(props.createdAt);
      expect(assetPack.updatedAt).toBe(props.updatedAt);
    });
  });

  describe("CRUD Operations", () => {
    it("should support Create operation", () => {
      const { createdAt, updatedAt } = generateTestDates();
      const assetPackData = {
        name: "New Asset Pack",
        version: "1.0.0",
        createdAt,
        updatedAt,
      };

      const assetPack = new AssetPack(assetPackData);

      expect(assetPack).toBeInstanceOf(AssetPack);
      expect(assetPack.name).toBe(assetPackData.name);
      expect(assetPack.version).toBe(assetPackData.version);
    });

    it("should support Read operation by accessing properties", () => {
      const { createdAt, updatedAt } = generateTestDates();
      const id = generateTestId();
      const assetPack = new AssetPack({
        id,
        name: "Read Asset Pack",
        version: "3.1.4",
        createdAt,
        updatedAt,
      });

      // Read operations
      expect(assetPack.id).toBe(id);
      expect(assetPack.name).toBe("Read Asset Pack");
      expect(assetPack.version).toBe("3.1.4");
      expect(assetPack.createdAt).toBe(createdAt);
      expect(assetPack.updatedAt).toBe(updatedAt);
    });

    it("should support Update operation by modifying properties", () => {
      const { createdAt, updatedAt } = generateTestDates();
      const assetPack = new AssetPack({
        id: generateTestId(),
        name: "Original Pack",
        version: "1.0.0",
        createdAt,
        updatedAt,
      });

      // Update operations
      const newName = "Updated Pack";
      const newVersion = "2.0.0";
      const newUpdatedAt = new Date();

      assetPack.name = newName;
      assetPack.version = newVersion;
      assetPack.updatedAt = newUpdatedAt;

      expect(assetPack.name).toBe(newName);
      expect(assetPack.version).toBe(newVersion);
      expect(assetPack.updatedAt).toBe(newUpdatedAt);
    });

    it("should support Delete operation by nullifying properties", () => {
      const { createdAt, updatedAt } = generateTestDates();
      const assetPack = new AssetPack({
        id: generateTestId(),
        name: "To Be Deleted",
        version: "1.0.0",
        createdAt,
        updatedAt,
      });

      // Simulate delete by clearing properties (soft delete)
      assetPack.name = "";
      assetPack.version = "";

      expect(assetPack.name).toBe("");
      expect(assetPack.version).toBe("");
      // ID and timestamps should remain for audit purposes
      expect(assetPack.id).toBeTruthy();
      expect(assetPack.createdAt).toBe(createdAt);
      expect(assetPack.updatedAt).toBe(updatedAt);
    });
  });

  describe("Edge Cases", () => {
    it("should handle empty strings", () => {
      const { createdAt, updatedAt } = generateTestDates();
      const assetPack = new AssetPack({
        name: "",
        version: "",
        createdAt,
        updatedAt,
      });

      expect(assetPack.name).toBe("");
      expect(assetPack.version).toBe("");
    });

    it("should handle special characters in name", () => {
      const { createdAt, updatedAt } = generateTestDates();
      const assetPack = new AssetPack({
        name: "Asset Pack™ v2.0 (Special Edition) - 日本語",
        version: "2.0.0-beta.1+build.123",
        createdAt,
        updatedAt,
      });

      expect(assetPack.name).toBe(
        "Asset Pack™ v2.0 (Special Edition) - 日本語"
      );
      expect(assetPack.version).toBe("2.0.0-beta.1+build.123");
    });

    it("should handle various version formats", () => {
      const { createdAt, updatedAt } = generateTestDates();
      const versions = [
        "1.0.0",
        "v2.1.3",
        "1.0.0-alpha",
        "2.0.0-beta.1",
        "1.0.0-rc.1+build.1",
        "0.0.1",
        "10.20.30",
      ];

      versions.forEach((version) => {
        const assetPack = new AssetPack({
          name: `Pack for ${version}`,
          version,
          createdAt,
          updatedAt,
        });

        expect(assetPack.version).toBe(version);
      });
    });

    it("should handle date edge cases", () => {
      const veryOldDate = new Date("1970-01-01");
      const futureDate = new Date("2099-12-31");

      const assetPack = new AssetPack({
        name: "Time Traveler Pack",
        version: "1.0.0",
        createdAt: veryOldDate,
        updatedAt: futureDate,
      });

      expect(assetPack.createdAt).toBe(veryOldDate);
      expect(assetPack.updatedAt).toBe(futureDate);
    });
  });

  describe("Data Integrity", () => {
    it("should maintain data integrity after multiple updates", () => {
      const { createdAt, updatedAt } = generateTestDates();
      const originalId = generateTestId();
      const assetPack = new AssetPack({
        id: originalId,
        name: "Original",
        version: "1.0.0",
        createdAt,
        updatedAt,
      });

      // Multiple updates
      assetPack.name = "First Update";
      assetPack.version = "1.1.0";
      assetPack.name = "Second Update";
      assetPack.version = "1.2.0";
      assetPack.name = "Final Update";
      assetPack.version = "2.0.0";

      expect(assetPack.id).toBe(originalId); // ID should not change
      expect(assetPack.name).toBe("Final Update");
      expect(assetPack.version).toBe("2.0.0");
      expect(assetPack.createdAt).toBe(createdAt); // Created date should not change
    });

    it("should handle concurrent-like updates", () => {
      const { createdAt, updatedAt } = generateTestDates();
      const assetPack = new AssetPack({
        id: generateTestId(),
        name: "Concurrent Test",
        version: "1.0.0",
        createdAt,
        updatedAt,
      });

      const update1 = new Date();
      const update2 = new Date(update1.getTime() + 1000);

      assetPack.updatedAt = update1;
      assetPack.name = "Update 1";
      assetPack.version = "1.1.0";

      assetPack.updatedAt = update2;
      assetPack.name = "Update 2";
      assetPack.version = "1.2.0";

      expect(assetPack.name).toBe("Update 2");
      expect(assetPack.version).toBe("1.2.0");
      expect(assetPack.updatedAt).toBe(update2);
    });
  });

  describe("Business Logic", () => {
    it("should support version comparison logic", () => {
      const { createdAt, updatedAt } = generateTestDates();
      const pack1 = new AssetPack({
        name: "Pack",
        version: "1.0.0",
        createdAt,
        updatedAt,
      });
      const pack2 = new AssetPack({
        name: "Pack",
        version: "2.0.0",
        createdAt,
        updatedAt,
      });
      const pack3 = new AssetPack({
        name: "Pack",
        version: "1.0.0",
        createdAt,
        updatedAt,
      });

      expect(pack1.version).toBe("1.0.0");
      expect(pack2.version).toBe("2.0.0");
      expect(pack1.version).toBe(pack3.version);
    });

    it("should support pack identification by name and version", () => {
      const { createdAt, updatedAt } = generateTestDates();
      const pack1 = new AssetPack({
        name: "UI Pack",
        version: "1.0.0",
        createdAt,
        updatedAt,
      });
      const pack2 = new AssetPack({
        name: "UI Pack",
        version: "2.0.0",
        createdAt,
        updatedAt,
      });
      const pack3 = new AssetPack({
        name: "Sound Pack",
        version: "1.0.0",
        createdAt,
        updatedAt,
      });

      expect(pack1.name).toBe(pack2.name);
      expect(pack1.version).not.toBe(pack2.version);
      expect(pack1.name).not.toBe(pack3.name);
      expect(pack1.version).toBe(pack3.version);
    });

    it("should handle pack naming conventions", () => {
      const { createdAt, updatedAt } = generateTestDates();
      const namingConventions = [
        "ui-pack",
        "UI_PACK",
        "UiPack",
        "ui.pack",
        "ui pack",
        "UI Pack v2",
      ];

      namingConventions.forEach((name) => {
        const pack = new AssetPack({
          name,
          version: "1.0.0",
          createdAt,
          updatedAt,
        });

        expect(pack.name).toBe(name);
      });
    });
  });
});
