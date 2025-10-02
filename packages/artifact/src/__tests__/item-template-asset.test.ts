import { describe, it, expect } from "vitest";
import { ItemTemplateAsset } from "../item-template-asset";
import { generateTestId, generateTestDates } from "./test-utils";

describe("ItemTemplateAsset", () => {
  describe("Constructor", () => {
    it("should create an ItemTemplateAsset instance with all required properties", () => {
      const { createdAt, updatedAt } = generateTestDates();
      const props = {
        id: generateTestId(),
        itemTplId: generateTestId(),
        assetId: generateTestId(),
        primary: true,
        createdAt,
        updatedAt,
      };

      const itemTemplateAsset = new ItemTemplateAsset(props);

      expect(itemTemplateAsset.id).toBe(props.id);
      expect(itemTemplateAsset.itemTplId).toBe(props.itemTplId);
      expect(itemTemplateAsset.assetId).toBe(props.assetId);
      expect(itemTemplateAsset.primary).toBe(props.primary);
      expect(itemTemplateAsset.createdAt).toBe(props.createdAt);
      expect(itemTemplateAsset.updatedAt).toBe(props.updatedAt);
    });
  });

  describe("CRUD Operations", () => {
    it("should support Create operation", () => {
      const { createdAt, updatedAt } = generateTestDates();
      const itemTemplateAssetData = {
        id: generateTestId(),
        itemTplId: generateTestId(),
        assetId: generateTestId(),
        primary: false,
        createdAt,
        updatedAt,
      };

      const itemTemplateAsset = new ItemTemplateAsset(itemTemplateAssetData);

      expect(itemTemplateAsset).toBeInstanceOf(ItemTemplateAsset);
      expect(itemTemplateAsset.id).toBe(itemTemplateAssetData.id);
      expect(itemTemplateAsset.itemTplId).toBe(itemTemplateAssetData.itemTplId);
      expect(itemTemplateAsset.assetId).toBe(itemTemplateAssetData.assetId);
      expect(itemTemplateAsset.primary).toBe(itemTemplateAssetData.primary);
    });

    it("should support Read operation by accessing properties", () => {
      const { createdAt, updatedAt } = generateTestDates();
      const id = generateTestId();
      const itemTplId = generateTestId();
      const assetId = generateTestId();
      const primary = true;

      const itemTemplateAsset = new ItemTemplateAsset({
        id,
        itemTplId,
        assetId,
        primary,
        createdAt,
        updatedAt,
      });

      // Read operations
      expect(itemTemplateAsset.id).toBe(id);
      expect(itemTemplateAsset.itemTplId).toBe(itemTplId);
      expect(itemTemplateAsset.assetId).toBe(assetId);
      expect(itemTemplateAsset.primary).toBe(primary);
      expect(itemTemplateAsset.createdAt).toBe(createdAt);
      expect(itemTemplateAsset.updatedAt).toBe(updatedAt);
    });

    it("should support Update operation by modifying properties", () => {
      const { createdAt, updatedAt } = generateTestDates();
      const itemTemplateAsset = new ItemTemplateAsset({
        id: generateTestId(),
        itemTplId: generateTestId(),
        assetId: generateTestId(),
        primary: false,
        createdAt,
        updatedAt,
      });

      // Update operations
      const newAssetId = generateTestId();
      const newPrimary = true;
      const newUpdatedAt = new Date();

      itemTemplateAsset.assetId = newAssetId;
      itemTemplateAsset.primary = newPrimary;
      itemTemplateAsset.updatedAt = newUpdatedAt;

      expect(itemTemplateAsset.assetId).toBe(newAssetId);
      expect(itemTemplateAsset.primary).toBe(newPrimary);
      expect(itemTemplateAsset.updatedAt).toBe(newUpdatedAt);
    });

    it("should support Delete operation by clearing IDs", () => {
      const { createdAt, updatedAt } = generateTestDates();
      const itemTemplateAsset = new ItemTemplateAsset({
        id: generateTestId(),
        itemTplId: generateTestId(),
        assetId: generateTestId(),
        primary: true,
        createdAt,
        updatedAt,
      });

      // Simulate delete by clearing asset ID (soft delete)
      itemTemplateAsset.assetId = "";

      expect(itemTemplateAsset.assetId).toBe("");
      // Other properties should remain for audit purposes
      expect(itemTemplateAsset.id).toBeTruthy();
      expect(itemTemplateAsset.itemTplId).toBeTruthy();
      expect(itemTemplateAsset.primary).toBe(true);
      expect(itemTemplateAsset.createdAt).toBe(createdAt);
      expect(itemTemplateAsset.updatedAt).toBe(updatedAt);
    });
  });

  describe("Primary Flag Handling", () => {
    it("should handle primary flag values", () => {
      const { createdAt, updatedAt } = generateTestDates();
      const primaryValues = [true, false];

      primaryValues.forEach((primary) => {
        const itemTemplateAsset = new ItemTemplateAsset({
          id: generateTestId(),
          itemTplId: generateTestId(),
          assetId: generateTestId(),
          primary,
          createdAt,
          updatedAt,
        });

        expect(itemTemplateAsset.primary).toBe(primary);
        expect(typeof itemTemplateAsset.primary).toBe("boolean");
      });
    });

    it("should handle primary flag transitions", () => {
      const { createdAt, updatedAt } = generateTestDates();
      const itemTemplateAsset = new ItemTemplateAsset({
        id: generateTestId(),
        itemTplId: generateTestId(),
        assetId: generateTestId(),
        primary: false,
        createdAt,
        updatedAt,
      });

      expect(itemTemplateAsset.primary).toBe(false);

      // Change to primary
      itemTemplateAsset.primary = true;
      expect(itemTemplateAsset.primary).toBe(true);

      // Change back to non-primary
      itemTemplateAsset.primary = false;
      expect(itemTemplateAsset.primary).toBe(false);
    });
  });

  describe("ID Handling", () => {
    it("should handle various ID formats", () => {
      const { createdAt, updatedAt } = generateTestDates();
      const idFormats = [
        "uuid-format-12345678-1234-1234-1234-123456789012",
        "simple-id",
        "template_123",
        "TEMPLATE-456",
        "template.789",
        "123456789",
        "template@asset#id",
      ];

      idFormats.forEach((id) => {
        const itemTemplateAsset = new ItemTemplateAsset({
          id,
          itemTplId: id,
          assetId: id,
          primary: false,
          createdAt,
          updatedAt,
        });

        expect(itemTemplateAsset.id).toBe(id);
        expect(itemTemplateAsset.itemTplId).toBe(id);
        expect(itemTemplateAsset.assetId).toBe(id);
      });
    });

    it("should handle empty string IDs", () => {
      const { createdAt, updatedAt } = generateTestDates();
      const itemTemplateAsset = new ItemTemplateAsset({
        id: "",
        itemTplId: "",
        assetId: "",
        primary: false,
        createdAt,
        updatedAt,
      });

      expect(itemTemplateAsset.id).toBe("");
      expect(itemTemplateAsset.itemTplId).toBe("");
      expect(itemTemplateAsset.assetId).toBe("");
    });

    it("should handle very long IDs", () => {
      const { createdAt, updatedAt } = generateTestDates();
      const veryLongId = "a".repeat(1000);
      const itemTemplateAsset = new ItemTemplateAsset({
        id: veryLongId,
        itemTplId: veryLongId,
        assetId: veryLongId,
        primary: true,
        createdAt,
        updatedAt,
      });

      expect(itemTemplateAsset.id).toBe(veryLongId);
      expect(itemTemplateAsset.itemTplId).toBe(veryLongId);
      expect(itemTemplateAsset.assetId).toBe(veryLongId);
    });

    it("should handle special character IDs", () => {
      const { createdAt, updatedAt } = generateTestDates();
      const specialIds = [
        "id-with-dashes",
        "id_with_underscores",
        "id.with.dots",
        "id123with456numbers",
        "ID-WITH-CAPS",
        "id with spaces",
        "id@with#special$chars",
      ];

      specialIds.forEach((id) => {
        const itemTemplateAsset = new ItemTemplateAsset({
          id,
          itemTplId: id,
          assetId: id,
          primary: false,
          createdAt: generateTestDates().createdAt,
          updatedAt: generateTestDates().updatedAt,
        });

        expect(itemTemplateAsset.id).toBe(id);
        expect(itemTemplateAsset.itemTplId).toBe(id);
        expect(itemTemplateAsset.assetId).toBe(id);
      });
    });
  });

  describe("Data Integrity", () => {
    it("should maintain data integrity after multiple updates", () => {
      const { createdAt, updatedAt } = generateTestDates();
      const originalId = generateTestId();
      const originalItemTplId = generateTestId();

      const itemTemplateAsset = new ItemTemplateAsset({
        id: originalId,
        itemTplId: originalItemTplId,
        assetId: generateTestId(),
        primary: false,
        createdAt,
        updatedAt,
      });

      // Multiple updates
      itemTemplateAsset.assetId = generateTestId();
      itemTemplateAsset.primary = true;
      itemTemplateAsset.assetId = generateTestId();
      itemTemplateAsset.primary = false;
      const finalAssetId = generateTestId();
      itemTemplateAsset.assetId = finalAssetId;

      // Core identifiers should typically not change
      expect(itemTemplateAsset.id).toBe(originalId);
      expect(itemTemplateAsset.itemTplId).toBe(originalItemTplId);
      expect(itemTemplateAsset.assetId).toBe(finalAssetId);
      expect(itemTemplateAsset.primary).toBe(false);
      expect(itemTemplateAsset.createdAt).toBe(createdAt);
    });

    it("should handle concurrent-like updates", () => {
      const { createdAt, updatedAt } = generateTestDates();
      const itemTemplateAsset = new ItemTemplateAsset({
        id: generateTestId(),
        itemTplId: generateTestId(),
        assetId: generateTestId(),
        primary: false,
        createdAt,
        updatedAt,
      });

      const update1 = new Date();
      const update2 = new Date(update1.getTime() + 1000);
      const asset1 = generateTestId();
      const asset2 = generateTestId();

      itemTemplateAsset.updatedAt = update1;
      itemTemplateAsset.assetId = asset1;
      itemTemplateAsset.primary = true;

      itemTemplateAsset.updatedAt = update2;
      itemTemplateAsset.assetId = asset2;
      itemTemplateAsset.primary = false;

      expect(itemTemplateAsset.assetId).toBe(asset2);
      expect(itemTemplateAsset.primary).toBe(false);
      expect(itemTemplateAsset.updatedAt).toBe(update2);
    });
  });

  describe("Business Logic", () => {
    it("should support link filtering by template", () => {
      const { createdAt, updatedAt } = generateTestDates();
      const templateId = generateTestId();

      const links = [
        new ItemTemplateAsset({
          id: generateTestId(),
          itemTplId: templateId,
          assetId: generateTestId(),
          primary: true,
          createdAt,
          updatedAt,
        }),
        new ItemTemplateAsset({
          id: generateTestId(),
          itemTplId: generateTestId(),
          assetId: generateTestId(),
          primary: false,
          createdAt,
          updatedAt,
        }),
        new ItemTemplateAsset({
          id: generateTestId(),
          itemTplId: templateId,
          assetId: generateTestId(),
          primary: false,
          createdAt,
          updatedAt,
        }),
      ];

      const templateLinks = links.filter((l) => l.itemTplId === templateId);

      expect(templateLinks).toHaveLength(2);
    });

    it("should support link filtering by asset", () => {
      const { createdAt, updatedAt } = generateTestDates();
      const assetId = generateTestId();

      const links = [
        new ItemTemplateAsset({
          id: generateTestId(),
          itemTplId: generateTestId(),
          assetId,
          primary: true,
          createdAt,
          updatedAt,
        }),
        new ItemTemplateAsset({
          id: generateTestId(),
          itemTplId: generateTestId(),
          assetId: generateTestId(),
          primary: false,
          createdAt,
          updatedAt,
        }),
        new ItemTemplateAsset({
          id: generateTestId(),
          itemTplId: generateTestId(),
          assetId,
          primary: false,
          createdAt,
          updatedAt,
        }),
      ];

      const assetLinks = links.filter((l) => l.assetId === assetId);

      expect(assetLinks).toHaveLength(2);
    });

    it("should support primary asset detection", () => {
      const { createdAt, updatedAt } = generateTestDates();
      const templateId = generateTestId();

      const links = [
        new ItemTemplateAsset({
          id: generateTestId(),
          itemTplId: templateId,
          assetId: generateTestId(),
          primary: true,
          createdAt,
          updatedAt,
        }),
        new ItemTemplateAsset({
          id: generateTestId(),
          itemTplId: templateId,
          assetId: generateTestId(),
          primary: false,
          createdAt,
          updatedAt,
        }),
        new ItemTemplateAsset({
          id: generateTestId(),
          itemTplId: templateId,
          assetId: generateTestId(),
          primary: false,
          createdAt,
          updatedAt,
        }),
      ];

      const templateLinks = links.filter((l) => l.itemTplId === templateId);
      const primaryAssets = templateLinks.filter((l) => l.primary);
      const secondaryAssets = templateLinks.filter((l) => !l.primary);

      expect(templateLinks).toHaveLength(3);
      expect(primaryAssets).toHaveLength(1);
      expect(secondaryAssets).toHaveLength(2);
    });

    it("should support link uniqueness validation", () => {
      const { createdAt, updatedAt } = generateTestDates();
      const links = [
        new ItemTemplateAsset({
          id: "link-1",
          itemTplId: "template-1",
          assetId: "asset-1",
          primary: true,
          createdAt,
          updatedAt,
        }),
        new ItemTemplateAsset({
          id: "link-2",
          itemTplId: "template-1",
          assetId: "asset-2",
          primary: false,
          createdAt,
          updatedAt,
        }),
        new ItemTemplateAsset({
          id: "link-3",
          itemTplId: "template-2",
          assetId: "asset-1",
          primary: true,
          createdAt,
          updatedAt,
        }),
      ];

      const ids = links.map((l) => l.id);
      const uniqueIds = [...new Set(ids)];
      const templateAssetPairs = links.map(
        (l) => `${l.itemTplId}-${l.assetId}`
      );
      const uniquePairs = [...new Set(templateAssetPairs)];

      expect(ids).toHaveLength(3);
      expect(uniqueIds).toHaveLength(3);
      expect(templateAssetPairs).toHaveLength(3);
      expect(uniquePairs).toHaveLength(3);
    });

    it("should support template asset mapping", () => {
      const { createdAt, updatedAt } = generateTestDates();
      const links = [
        new ItemTemplateAsset({
          id: generateTestId(),
          itemTplId: "template-1",
          assetId: "asset-1",
          primary: true,
          createdAt,
          updatedAt,
        }),
        new ItemTemplateAsset({
          id: generateTestId(),
          itemTplId: "template-1",
          assetId: "asset-2",
          primary: false,
          createdAt,
          updatedAt,
        }),
        new ItemTemplateAsset({
          id: generateTestId(),
          itemTplId: "template-2",
          assetId: "asset-3",
          primary: true,
          createdAt,
          updatedAt,
        }),
      ];

      // Group by template
      const templateGroups = links.reduce(
        (groups, link) => {
          const template = link.itemTplId;
          if (!groups[template]) groups[template] = [];
          groups[template].push(link);
          return groups;
        },
        {} as Record<string, ItemTemplateAsset[]>
      );

      expect(templateGroups["template-1"]).toHaveLength(2);
      expect(templateGroups["template-2"]).toHaveLength(1);
    });

    it("should support asset template mapping", () => {
      const { createdAt, updatedAt } = generateTestDates();
      const links = [
        new ItemTemplateAsset({
          id: generateTestId(),
          itemTplId: "template-1",
          assetId: "asset-1",
          primary: true,
          createdAt,
          updatedAt,
        }),
        new ItemTemplateAsset({
          id: generateTestId(),
          itemTplId: "template-2",
          assetId: "asset-1",
          primary: false,
          createdAt,
          updatedAt,
        }),
        new ItemTemplateAsset({
          id: generateTestId(),
          itemTplId: "template-3",
          assetId: "asset-2",
          primary: true,
          createdAt,
          updatedAt,
        }),
      ];

      // Group by asset
      const assetGroups = links.reduce(
        (groups, link) => {
          const asset = link.assetId;
          if (!groups[asset]) groups[asset] = [];
          groups[asset].push(link);
          return groups;
        },
        {} as Record<string, ItemTemplateAsset[]>
      );

      expect(assetGroups["asset-1"]).toHaveLength(2);
      expect(assetGroups["asset-2"]).toHaveLength(1);
    });

    it("should support primary asset switching", () => {
      const { createdAt, updatedAt } = generateTestDates();
      const templateId = generateTestId();

      const links = [
        new ItemTemplateAsset({
          id: "link-1",
          itemTplId: templateId,
          assetId: "asset-1",
          primary: true,
          createdAt,
          updatedAt,
        }),
        new ItemTemplateAsset({
          id: "link-2",
          itemTplId: templateId,
          assetId: "asset-2",
          primary: false,
          createdAt,
          updatedAt,
        }),
      ];

      // Switch primary asset
      links[0].primary = false;
      links[1].primary = true;

      const primaryAssets = links.filter((l) => l.primary);
      const secondaryAssets = links.filter((l) => !l.primary);

      expect(primaryAssets).toHaveLength(1);
      expect(secondaryAssets).toHaveLength(1);
      expect(primaryAssets[0].assetId).toBe("asset-2");
      expect(secondaryAssets[0].assetId).toBe("asset-1");
    });

    it("should support asset removal from template", () => {
      const { createdAt, updatedAt } = generateTestDates();
      const templateId = generateTestId();

      const links = [
        new ItemTemplateAsset({
          id: generateTestId(),
          itemTplId: templateId,
          assetId: "asset-1",
          primary: true,
          createdAt,
          updatedAt,
        }),
        new ItemTemplateAsset({
          id: generateTestId(),
          itemTplId: templateId,
          assetId: "asset-2",
          primary: false,
          createdAt,
          updatedAt,
        }),
        new ItemTemplateAsset({
          id: generateTestId(),
          itemTplId: templateId,
          assetId: "asset-3",
          primary: false,
          createdAt,
          updatedAt,
        }),
      ];

      // Remove asset by clearing asset ID
      links[1].assetId = "";

      const activeLinks = links.filter((l) => l.assetId !== "");
      const removedLinks = links.filter((l) => l.assetId === "");

      expect(activeLinks).toHaveLength(2);
      expect(removedLinks).toHaveLength(1);
    });

    it("should support template asset count queries", () => {
      const { createdAt, updatedAt } = generateTestDates();
      const templateId = generateTestId();

      const links = [
        new ItemTemplateAsset({
          id: generateTestId(),
          itemTplId: templateId,
          assetId: generateTestId(),
          primary: true,
          createdAt,
          updatedAt,
        }),
        new ItemTemplateAsset({
          id: generateTestId(),
          itemTplId: templateId,
          assetId: generateTestId(),
          primary: false,
          createdAt,
          updatedAt,
        }),
        new ItemTemplateAsset({
          id: generateTestId(),
          itemTplId: generateTestId(),
          assetId: generateTestId(),
          primary: true,
          createdAt,
          updatedAt,
        }),
      ];

      const templateAssetCount = links.filter(
        (l) => l.itemTplId === templateId
      ).length;

      expect(templateAssetCount).toBe(2);
    });
  });
});
