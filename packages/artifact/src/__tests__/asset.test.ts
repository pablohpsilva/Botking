import { describe, it, expect } from "vitest";
import { Asset } from "../asset";
import {
  generateTestId,
  generateTestUrl,
  generateTestMeta,
  generateTestDates,
  TEST_ENUMS,
  getRandomEnumValue,
} from "./test-utils";

describe("Asset", () => {
  describe("Constructor", () => {
    it("should create an Asset instance with all required properties", () => {
      const { createdAt, updatedAt } = generateTestDates();
      const props = {
        packId: generateTestId(),
        kind: TEST_ENUMS.asset_kind.ICON,
        url: generateTestUrl(),
        width: 64,
        height: 64,
        variant: "default",
        meta: generateTestMeta(),
        createdAt,
        updatedAt,
      };

      const asset = new Asset(props);

      expect(asset.packId).toBe(props.packId);
      expect(asset.kind).toBe(props.kind);
      expect(asset.url).toBe(props.url);
      expect(asset.width).toBe(props.width);
      expect(asset.height).toBe(props.height);
      expect(asset.variant).toBe(props.variant);
      expect(asset.meta).toBe(props.meta);
      expect(asset.createdAt).toBe(props.createdAt);
      expect(asset.updatedAt).toBe(props.updatedAt);
      expect(asset.id).toBe(""); // Default empty string when not provided
    });

    it("should create an Asset instance with provided id", () => {
      const { createdAt, updatedAt } = generateTestDates();
      const id = generateTestId();
      const props = {
        id,
        packId: generateTestId(),
        kind: TEST_ENUMS.asset_kind.SPRITE,
        url: generateTestUrl(),
        width: 128,
        height: 128,
        variant: "night",
        meta: generateTestMeta(),
        createdAt,
        updatedAt,
      };

      const asset = new Asset(props);

      expect(asset.id).toBe(id);
      expect(asset.packId).toBe(props.packId);
      expect(asset.kind).toBe(props.kind);
    });
  });

  describe("CRUD Operations", () => {
    it("should support Create operation", () => {
      const { createdAt, updatedAt } = generateTestDates();
      const assetData = {
        packId: generateTestId(),
        kind: TEST_ENUMS.asset_kind.CARD,
        url: generateTestUrl(),
        width: 256,
        height: 256,
        variant: "gold",
        meta: generateTestMeta(),
        createdAt,
        updatedAt,
      };

      const asset = new Asset(assetData);

      expect(asset).toBeInstanceOf(Asset);
      expect(asset.packId).toBe(assetData.packId);
      expect(asset.kind).toBe(assetData.kind);
      expect(asset.url).toBe(assetData.url);
    });

    it("should support Read operation by accessing properties", () => {
      const { createdAt, updatedAt } = generateTestDates();
      const id = generateTestId();
      const packId = generateTestId();
      const asset = new Asset({
        id,
        packId,
        kind: TEST_ENUMS.asset_kind.THREE_D,
        url: generateTestUrl(),
        width: 512,
        height: 512,
        variant: "default",
        meta: generateTestMeta(),
        createdAt,
        updatedAt,
      });

      // Read operations
      expect(asset.id).toBe(id);
      expect(asset.packId).toBe(packId);
      expect(asset.kind).toBe(TEST_ENUMS.asset_kind.THREE_D);
      expect(asset.width).toBe(512);
      expect(asset.height).toBe(512);
      expect(asset.variant).toBe("default");
      expect(asset.createdAt).toBe(createdAt);
      expect(asset.updatedAt).toBe(updatedAt);
    });

    it("should support Update operation by modifying properties", () => {
      const { createdAt, updatedAt } = generateTestDates();
      const asset = new Asset({
        id: generateTestId(),
        packId: generateTestId(),
        kind: TEST_ENUMS.asset_kind.ICON,
        url: generateTestUrl(),
        width: 32,
        height: 32,
        variant: "default",
        meta: generateTestMeta(),
        createdAt,
        updatedAt,
      });

      // Update operations
      const newKind = TEST_ENUMS.asset_kind.SPRITE;
      const newUrl = generateTestUrl();
      const newWidth = 64;
      const newHeight = 64;
      const newVariant = "night";
      const newMeta = generateTestMeta();
      const newUpdatedAt = new Date();

      asset.kind = newKind;
      asset.url = newUrl;
      asset.width = newWidth;
      asset.height = newHeight;
      asset.variant = newVariant;
      asset.meta = newMeta;
      asset.updatedAt = newUpdatedAt;

      expect(asset.kind).toBe(newKind);
      expect(asset.url).toBe(newUrl);
      expect(asset.width).toBe(newWidth);
      expect(asset.height).toBe(newHeight);
      expect(asset.variant).toBe(newVariant);
      expect(asset.meta).toBe(newMeta);
      expect(asset.updatedAt).toBe(newUpdatedAt);
    });

    it("should support Delete operation by nullifying properties", () => {
      const { createdAt, updatedAt } = generateTestDates();
      const asset = new Asset({
        id: generateTestId(),
        packId: generateTestId(),
        kind: TEST_ENUMS.asset_kind.CARD,
        url: generateTestUrl(),
        width: 128,
        height: 128,
        variant: "default",
        meta: generateTestMeta(),
        createdAt,
        updatedAt,
      });

      // Simulate delete by clearing properties (soft delete)
      asset.url = "";
      asset.width = 0;
      asset.height = 0;
      asset.variant = "";
      asset.meta = {};

      expect(asset.url).toBe("");
      expect(asset.width).toBe(0);
      expect(asset.height).toBe(0);
      expect(asset.variant).toBe("");
      expect(asset.meta).toEqual({});
      // ID, packId, kind, and timestamps should remain for audit purposes
      expect(asset.id).toBeTruthy();
      expect(asset.packId).toBeTruthy();
      expect(asset.kind).toBe(TEST_ENUMS.asset_kind.CARD);
      expect(asset.createdAt).toBe(createdAt);
      expect(asset.updatedAt).toBe(updatedAt);
    });
  });

  describe("Asset Kind Enum", () => {
    it("should support all asset_kind enum values", () => {
      const { createdAt, updatedAt } = generateTestDates();
      const baseProps = {
        packId: generateTestId(),
        url: generateTestUrl(),
        width: 64,
        height: 64,
        variant: "default",
        meta: generateTestMeta(),
        createdAt,
        updatedAt,
      };

      Object.values(TEST_ENUMS.asset_kind).forEach((kind) => {
        const asset = new Asset({ ...baseProps, kind });
        expect(asset.kind).toBe(kind);
      });
    });

    it("should handle asset kind transitions", () => {
      const { createdAt, updatedAt } = generateTestDates();
      const asset = new Asset({
        packId: generateTestId(),
        kind: TEST_ENUMS.asset_kind.ICON,
        url: generateTestUrl(),
        width: 32,
        height: 32,
        variant: "default",
        meta: generateTestMeta(),
        createdAt,
        updatedAt,
      });

      // Transition through different kinds
      asset.kind = TEST_ENUMS.asset_kind.CARD;
      expect(asset.kind).toBe(TEST_ENUMS.asset_kind.CARD);

      asset.kind = TEST_ENUMS.asset_kind.SPRITE;
      expect(asset.kind).toBe(TEST_ENUMS.asset_kind.SPRITE);

      asset.kind = TEST_ENUMS.asset_kind.THREE_D;
      expect(asset.kind).toBe(TEST_ENUMS.asset_kind.THREE_D);
    });
  });

  describe("Edge Cases", () => {
    it("should handle zero dimensions", () => {
      const { createdAt, updatedAt } = generateTestDates();
      const asset = new Asset({
        packId: generateTestId(),
        kind: TEST_ENUMS.asset_kind.ICON,
        url: generateTestUrl(),
        width: 0,
        height: 0,
        variant: "default",
        meta: {},
        createdAt,
        updatedAt,
      });

      expect(asset.width).toBe(0);
      expect(asset.height).toBe(0);
    });

    it("should handle very large dimensions", () => {
      const { createdAt, updatedAt } = generateTestDates();
      const asset = new Asset({
        packId: generateTestId(),
        kind: TEST_ENUMS.asset_kind.THREE_D,
        url: generateTestUrl(),
        width: 4096,
        height: 4096,
        variant: "ultra-hd",
        meta: generateTestMeta(),
        createdAt,
        updatedAt,
      });

      expect(asset.width).toBe(4096);
      expect(asset.height).toBe(4096);
    });

    it("should handle negative dimensions", () => {
      const { createdAt, updatedAt } = generateTestDates();
      const asset = new Asset({
        packId: generateTestId(),
        kind: TEST_ENUMS.asset_kind.SPRITE,
        url: generateTestUrl(),
        width: -1,
        height: -1,
        variant: "invalid",
        meta: generateTestMeta(),
        createdAt,
        updatedAt,
      });

      expect(asset.width).toBe(-1);
      expect(asset.height).toBe(-1);
    });

    it("should handle empty and special variant strings", () => {
      const { createdAt, updatedAt } = generateTestDates();
      const variants = [
        "",
        "default",
        "night",
        "gold",
        "special-edition",
        "variant_with_underscore",
        "123numeric",
      ];

      variants.forEach((variant) => {
        const asset = new Asset({
          packId: generateTestId(),
          kind: getRandomEnumValue(TEST_ENUMS.asset_kind),
          url: generateTestUrl(),
          width: 64,
          height: 64,
          variant,
          meta: generateTestMeta(),
          createdAt,
          updatedAt,
        });

        expect(asset.variant).toBe(variant);
      });
    });

    it("should handle complex meta objects", () => {
      const { createdAt, updatedAt } = generateTestDates();
      const complexMeta = {
        tags: ["ui", "button", "interactive"],
        properties: {
          clickable: true,
          animated: false,
          duration: 1000,
        },
        nested: {
          deep: {
            value: "test",
          },
        },
        nullValue: null,
        undefinedValue: undefined,
      };

      const asset = new Asset({
        packId: generateTestId(),
        kind: TEST_ENUMS.asset_kind.SPRITE,
        url: generateTestUrl(),
        width: 128,
        height: 128,
        variant: "interactive",
        meta: complexMeta,
        createdAt,
        updatedAt,
      });

      expect(asset.meta).toBe(complexMeta);
      expect(asset.meta.tags).toEqual(["ui", "button", "interactive"]);
      expect(asset.meta.properties.clickable).toBe(true);
      expect(asset.meta.nested.deep.value).toBe("test");
    });
  });

  describe("Data Integrity", () => {
    it("should maintain data integrity after multiple updates", () => {
      const { createdAt, updatedAt } = generateTestDates();
      const originalId = generateTestId();
      const originalPackId = generateTestId();
      const asset = new Asset({
        id: originalId,
        packId: originalPackId,
        kind: TEST_ENUMS.asset_kind.ICON,
        url: generateTestUrl(),
        width: 32,
        height: 32,
        variant: "default",
        meta: generateTestMeta(),
        createdAt,
        updatedAt,
      });

      // Multiple updates
      asset.kind = TEST_ENUMS.asset_kind.CARD;
      asset.width = 64;
      asset.height = 64;
      asset.variant = "gold";

      expect(asset.id).toBe(originalId); // ID should not change
      expect(asset.packId).toBe(originalPackId); // PackId should not change typically
      expect(asset.kind).toBe(TEST_ENUMS.asset_kind.CARD);
      expect(asset.width).toBe(64);
      expect(asset.height).toBe(64);
      expect(asset.variant).toBe("gold");
      expect(asset.createdAt).toBe(createdAt); // Created date should not change
    });

    it("should handle meta object mutations", () => {
      const { createdAt, updatedAt } = generateTestDates();
      const asset = new Asset({
        packId: generateTestId(),
        kind: TEST_ENUMS.asset_kind.SPRITE,
        url: generateTestUrl(),
        width: 128,
        height: 128,
        variant: "default",
        meta: { version: 1, tags: ["original"] },
        createdAt,
        updatedAt,
      });

      // Mutate meta object
      asset.meta.version = 2;
      asset.meta.tags.push("updated");
      asset.meta.newProperty = "added";

      expect(asset.meta.version).toBe(2);
      expect(asset.meta.tags).toContain("original");
      expect(asset.meta.tags).toContain("updated");
      expect(asset.meta.newProperty).toBe("added");
    });
  });

  describe("Business Logic", () => {
    it("should support asset filtering by kind", () => {
      const { createdAt, updatedAt } = generateTestDates();
      const assets = [
        new Asset({
          packId: generateTestId(),
          kind: TEST_ENUMS.asset_kind.ICON,
          url: generateTestUrl(),
          width: 32,
          height: 32,
          variant: "default",
          meta: {},
          createdAt,
          updatedAt,
        }),
        new Asset({
          packId: generateTestId(),
          kind: TEST_ENUMS.asset_kind.SPRITE,
          url: generateTestUrl(),
          width: 64,
          height: 64,
          variant: "default",
          meta: {},
          createdAt,
          updatedAt,
        }),
        new Asset({
          packId: generateTestId(),
          kind: TEST_ENUMS.asset_kind.ICON,
          url: generateTestUrl(),
          width: 48,
          height: 48,
          variant: "large",
          meta: {},
          createdAt,
          updatedAt,
        }),
      ];

      const icons = assets.filter(
        (asset) => asset.kind === TEST_ENUMS.asset_kind.ICON
      );
      const sprites = assets.filter(
        (asset) => asset.kind === TEST_ENUMS.asset_kind.SPRITE
      );

      expect(icons).toHaveLength(2);
      expect(sprites).toHaveLength(1);
    });

    it("should support asset grouping by pack", () => {
      const { createdAt, updatedAt } = generateTestDates();
      const packId1 = generateTestId();
      const packId2 = generateTestId();

      const assets = [
        new Asset({
          packId: packId1,
          kind: TEST_ENUMS.asset_kind.ICON,
          url: generateTestUrl(),
          width: 32,
          height: 32,
          variant: "default",
          meta: {},
          createdAt,
          updatedAt,
        }),
        new Asset({
          packId: packId2,
          kind: TEST_ENUMS.asset_kind.SPRITE,
          url: generateTestUrl(),
          width: 64,
          height: 64,
          variant: "default",
          meta: {},
          createdAt,
          updatedAt,
        }),
        new Asset({
          packId: packId1,
          kind: TEST_ENUMS.asset_kind.CARD,
          url: generateTestUrl(),
          width: 128,
          height: 128,
          variant: "default",
          meta: {},
          createdAt,
          updatedAt,
        }),
      ];

      const pack1Assets = assets.filter((asset) => asset.packId === packId1);
      const pack2Assets = assets.filter((asset) => asset.packId === packId2);

      expect(pack1Assets).toHaveLength(2);
      expect(pack2Assets).toHaveLength(1);
    });

    it("should support dimension-based queries", () => {
      const { createdAt, updatedAt } = generateTestDates();
      const assets = [
        new Asset({
          packId: generateTestId(),
          kind: TEST_ENUMS.asset_kind.ICON,
          url: generateTestUrl(),
          width: 32,
          height: 32,
          variant: "small",
          meta: {},
          createdAt,
          updatedAt,
        }),
        new Asset({
          packId: generateTestId(),
          kind: TEST_ENUMS.asset_kind.ICON,
          url: generateTestUrl(),
          width: 64,
          height: 64,
          variant: "medium",
          meta: {},
          createdAt,
          updatedAt,
        }),
        new Asset({
          packId: generateTestId(),
          kind: TEST_ENUMS.asset_kind.ICON,
          url: generateTestUrl(),
          width: 128,
          height: 128,
          variant: "large",
          meta: {},
          createdAt,
          updatedAt,
        }),
      ];

      const smallAssets = assets.filter(
        (asset) => asset.width <= 32 && asset.height <= 32
      );
      const largeAssets = assets.filter(
        (asset) => asset.width >= 128 || asset.height >= 128
      );
      const squareAssets = assets.filter(
        (asset) => asset.width === asset.height
      );

      expect(smallAssets).toHaveLength(1);
      expect(largeAssets).toHaveLength(1);
      expect(squareAssets).toHaveLength(3); // All are square in this test
    });
  });
});
