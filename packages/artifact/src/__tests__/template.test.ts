import { describe, it, expect } from "vitest";
import { Template } from "../template";
import {
  generateTestId,
  generateTestMeta,
  generateTestDates,
  TEST_ENUMS,
  getRandomEnumValue,
} from "./test-utils";

describe("Template", () => {
  describe("Constructor", () => {
    it("should create a Template instance with all required properties", () => {
      const { createdAt, updatedAt } = generateTestDates();
      const props = {
        itemClass: TEST_ENUMS.item_class.SOUL_CHIP,
        name: "Test Soul Chip",
        slug: "test-soul-chip",
        meta: generateTestMeta(),
        createdAt,
        updatedAt,
      };

      const template = new Template(props);

      expect(template.itemClass).toBe(props.itemClass);
      expect(template.name).toBe(props.name);
      expect(template.slug).toBe(props.slug);
      expect(template.meta).toBe(props.meta);
      expect(template.createdAt).toBe(props.createdAt);
      expect(template.updatedAt).toBe(props.updatedAt);
      expect(template.id).toBe(""); // Default empty string when not provided
    });

    it("should create a Template instance with provided id", () => {
      const { createdAt, updatedAt } = generateTestDates();
      const id = generateTestId();
      const props = {
        id,
        itemClass: TEST_ENUMS.item_class.SKELETON,
        name: "Test Skeleton",
        slug: "test-skeleton",
        meta: generateTestMeta(),
        createdAt,
        updatedAt,
      };

      const template = new Template(props);

      expect(template.id).toBe(id);
      expect(template.itemClass).toBe(props.itemClass);
      expect(template.name).toBe(props.name);
      expect(template.slug).toBe(props.slug);
    });
  });

  describe("CRUD Operations", () => {
    it("should support Create operation", () => {
      const { createdAt, updatedAt } = generateTestDates();
      const templateData = {
        itemClass: TEST_ENUMS.item_class.PART,
        name: "New Robot Part",
        slug: "new-robot-part",
        meta: generateTestMeta(),
        createdAt,
        updatedAt,
      };

      const template = new Template(templateData);

      expect(template).toBeInstanceOf(Template);
      expect(template.itemClass).toBe(templateData.itemClass);
      expect(template.name).toBe(templateData.name);
      expect(template.slug).toBe(templateData.slug);
    });

    it("should support Read operation by accessing properties", () => {
      const { createdAt, updatedAt } = generateTestDates();
      const id = generateTestId();
      const template = new Template({
        id,
        itemClass: TEST_ENUMS.item_class.EXPANSION_CHIP,
        name: "Read Expansion Chip",
        slug: "read-expansion-chip",
        meta: generateTestMeta(),
        createdAt,
        updatedAt,
      });

      // Read operations
      expect(template.id).toBe(id);
      expect(template.itemClass).toBe(TEST_ENUMS.item_class.EXPANSION_CHIP);
      expect(template.name).toBe("Read Expansion Chip");
      expect(template.slug).toBe("read-expansion-chip");
      expect(template.createdAt).toBe(createdAt);
      expect(template.updatedAt).toBe(updatedAt);
    });

    it("should support Update operation by modifying properties", () => {
      const { createdAt, updatedAt } = generateTestDates();
      const template = new Template({
        id: generateTestId(),
        itemClass: TEST_ENUMS.item_class.MISC,
        name: "Original Item",
        slug: "original-item",
        meta: generateTestMeta(),
        createdAt,
        updatedAt,
      });

      // Update operations
      const newItemClass = TEST_ENUMS.item_class.PART;
      const newName = "Updated Item";
      const newSlug = "updated-item";
      const newMeta = generateTestMeta();
      const newUpdatedAt = new Date();

      template.itemClass = newItemClass;
      template.name = newName;
      template.slug = newSlug;
      template.meta = newMeta;
      template.updatedAt = newUpdatedAt;

      expect(template.itemClass).toBe(newItemClass);
      expect(template.name).toBe(newName);
      expect(template.slug).toBe(newSlug);
      expect(template.meta).toBe(newMeta);
      expect(template.updatedAt).toBe(newUpdatedAt);
    });

    it("should support Delete operation by nullifying properties", () => {
      const { createdAt, updatedAt } = generateTestDates();
      const template = new Template({
        id: generateTestId(),
        itemClass: TEST_ENUMS.item_class.SOUL_CHIP,
        name: "To Be Deleted",
        slug: "to-be-deleted",
        meta: generateTestMeta(),
        createdAt,
        updatedAt,
      });

      // Simulate delete by clearing properties (soft delete)
      template.name = "";
      template.slug = "";
      template.meta = {};

      expect(template.name).toBe("");
      expect(template.slug).toBe("");
      expect(template.meta).toEqual({});
      // ID, itemClass, and timestamps should remain for audit purposes
      expect(template.id).toBeTruthy();
      expect(template.itemClass).toBe(TEST_ENUMS.item_class.SOUL_CHIP);
      expect(template.createdAt).toBe(createdAt);
      expect(template.updatedAt).toBe(updatedAt);
    });
  });

  describe("Item Class Enum", () => {
    it("should support all item_class enum values", () => {
      const { createdAt, updatedAt } = generateTestDates();
      const baseProps = {
        name: "Test Item",
        slug: "test-item",
        meta: generateTestMeta(),
        createdAt,
        updatedAt,
      };

      Object.values(TEST_ENUMS.item_class).forEach((itemClass) => {
        const template = new Template({ ...baseProps, itemClass });
        expect(template.itemClass).toBe(itemClass);
      });
    });

    it("should handle item class transitions", () => {
      const { createdAt, updatedAt } = generateTestDates();
      const template = new Template({
        itemClass: TEST_ENUMS.item_class.SOUL_CHIP,
        name: "Transforming Item",
        slug: "transforming-item",
        meta: generateTestMeta(),
        createdAt,
        updatedAt,
      });

      // Transition through different classes
      template.itemClass = TEST_ENUMS.item_class.SKELETON;
      expect(template.itemClass).toBe(TEST_ENUMS.item_class.SKELETON);

      template.itemClass = TEST_ENUMS.item_class.PART;
      expect(template.itemClass).toBe(TEST_ENUMS.item_class.PART);

      template.itemClass = TEST_ENUMS.item_class.EXPANSION_CHIP;
      expect(template.itemClass).toBe(TEST_ENUMS.item_class.EXPANSION_CHIP);

      template.itemClass = TEST_ENUMS.item_class.MISC;
      expect(template.itemClass).toBe(TEST_ENUMS.item_class.MISC);
    });
  });

  describe("Slug Validation", () => {
    it("should handle various slug formats", () => {
      const { createdAt, updatedAt } = generateTestDates();
      const slugFormats = [
        "simple-slug",
        "slug_with_underscores",
        "slug-with-numbers-123",
        "UPPERCASE-SLUG",
        "mixed-Case_Slug",
        "slug.with.dots",
        "very-long-slug-with-many-words-and-dashes",
      ];

      slugFormats.forEach((slug) => {
        const template = new Template({
          itemClass: getRandomEnumValue(TEST_ENUMS.item_class),
          name: `Item for ${slug}`,
          slug,
          meta: generateTestMeta(),
          createdAt,
          updatedAt,
        });

        expect(template.slug).toBe(slug);
      });
    });

    it("should handle empty and special slug cases", () => {
      const { createdAt, updatedAt } = generateTestDates();
      const specialSlugs = [
        "",
        "a",
        "123",
        "-",
        "_",
        ".",
        "slug-",
        "-slug",
        "slug_",
      ];

      specialSlugs.forEach((slug) => {
        const template = new Template({
          itemClass: TEST_ENUMS.item_class.MISC,
          name: "Special Slug Test",
          slug,
          meta: generateTestMeta(),
          createdAt,
          updatedAt,
        });

        expect(template.slug).toBe(slug);
      });
    });
  });

  describe("Edge Cases", () => {
    it("should handle empty strings", () => {
      const { createdAt, updatedAt } = generateTestDates();
      const template = new Template({
        itemClass: TEST_ENUMS.item_class.MISC,
        name: "",
        slug: "",
        meta: {},
        createdAt,
        updatedAt,
      });

      expect(template.name).toBe("");
      expect(template.slug).toBe("");
      expect(template.meta).toEqual({});
    });

    it("should handle special characters in name", () => {
      const { createdAt, updatedAt } = generateTestDates();
      const template = new Template({
        itemClass: TEST_ENUMS.item_class.PART,
        name: "Robot Arm™ v2.0 (Special Edition) - 日本語",
        slug: "robot-arm-v2-special-edition",
        meta: generateTestMeta(),
        createdAt,
        updatedAt,
      });

      expect(template.name).toBe("Robot Arm™ v2.0 (Special Edition) - 日本語");
      expect(template.slug).toBe("robot-arm-v2-special-edition");
    });

    it("should handle complex meta objects", () => {
      const { createdAt, updatedAt } = generateTestDates();
      const complexMeta = {
        stats: {
          attack: 100,
          defense: 80,
          speed: 60,
        },
        rarity: "legendary",
        effects: ["fire_damage", "critical_hit"],
        requirements: {
          level: 10,
          class: "warrior",
        },
        crafting: {
          materials: [
            { id: "iron", quantity: 5 },
            { id: "crystal", quantity: 2 },
          ],
          time: 3600,
        },
      };

      const template = new Template({
        itemClass: TEST_ENUMS.item_class.PART,
        name: "Legendary Robot Arm",
        slug: "legendary-robot-arm",
        meta: complexMeta,
        createdAt,
        updatedAt,
      });

      expect(template.meta).toBe(complexMeta);
      expect(template.meta.stats.attack).toBe(100);
      expect(template.meta.effects).toContain("fire_damage");
      expect(template.meta.crafting.materials).toHaveLength(2);
    });
  });

  describe("Data Integrity", () => {
    it("should maintain data integrity after multiple updates", () => {
      const { createdAt, updatedAt } = generateTestDates();
      const originalId = generateTestId();
      const template = new Template({
        id: originalId,
        itemClass: TEST_ENUMS.item_class.SOUL_CHIP,
        name: "Original",
        slug: "original",
        meta: generateTestMeta(),
        createdAt,
        updatedAt,
      });

      // Multiple updates
      template.name = "First Update";
      template.slug = "first-update";
      template.itemClass = TEST_ENUMS.item_class.SKELETON;
      template.name = "Second Update";
      template.slug = "second-update";
      template.name = "Final Update";
      template.slug = "final-update";

      expect(template.id).toBe(originalId); // ID should not change
      expect(template.name).toBe("Final Update");
      expect(template.slug).toBe("final-update");
      expect(template.itemClass).toBe(TEST_ENUMS.item_class.SKELETON);
      expect(template.createdAt).toBe(createdAt); // Created date should not change
    });

    it("should handle meta object mutations", () => {
      const { createdAt, updatedAt } = generateTestDates();
      const template = new Template({
        itemClass: TEST_ENUMS.item_class.PART,
        name: "Mutable Item",
        slug: "mutable-item",
        meta: { version: 1, tags: ["original"] },
        createdAt,
        updatedAt,
      });

      // Mutate meta object
      template.meta.version = 2;
      template.meta.tags.push("updated");
      template.meta.newProperty = "added";

      expect(template.meta.version).toBe(2);
      expect(template.meta.tags).toContain("original");
      expect(template.meta.tags).toContain("updated");
      expect(template.meta.newProperty).toBe("added");
    });
  });

  describe("Business Logic", () => {
    it("should support template filtering by item class", () => {
      const { createdAt, updatedAt } = generateTestDates();
      const templates = [
        new Template({
          itemClass: TEST_ENUMS.item_class.SOUL_CHIP,
          name: "Soul Chip 1",
          slug: "soul-chip-1",
          meta: {},
          createdAt,
          updatedAt,
        }),
        new Template({
          itemClass: TEST_ENUMS.item_class.PART,
          name: "Robot Arm",
          slug: "robot-arm",
          meta: {},
          createdAt,
          updatedAt,
        }),
        new Template({
          itemClass: TEST_ENUMS.item_class.SOUL_CHIP,
          name: "Soul Chip 2",
          slug: "soul-chip-2",
          meta: {},
          createdAt,
          updatedAt,
        }),
        new Template({
          itemClass: TEST_ENUMS.item_class.SKELETON,
          name: "Basic Skeleton",
          slug: "basic-skeleton",
          meta: {},
          createdAt,
          updatedAt,
        }),
      ];

      const soulChips = templates.filter(
        (t) => t.itemClass === TEST_ENUMS.item_class.SOUL_CHIP
      );
      const parts = templates.filter(
        (t) => t.itemClass === TEST_ENUMS.item_class.PART
      );
      const skeletons = templates.filter(
        (t) => t.itemClass === TEST_ENUMS.item_class.SKELETON
      );

      expect(soulChips).toHaveLength(2);
      expect(parts).toHaveLength(1);
      expect(skeletons).toHaveLength(1);
    });

    it("should support template search by name and slug", () => {
      const { createdAt, updatedAt } = generateTestDates();
      const templates = [
        new Template({
          itemClass: TEST_ENUMS.item_class.PART,
          name: "Fire Sword",
          slug: "fire-sword",
          meta: {},
          createdAt,
          updatedAt,
        }),
        new Template({
          itemClass: TEST_ENUMS.item_class.PART,
          name: "Ice Shield",
          slug: "ice-shield",
          meta: {},
          createdAt,
          updatedAt,
        }),
        new Template({
          itemClass: TEST_ENUMS.item_class.PART,
          name: "Lightning Boots",
          slug: "lightning-boots",
          meta: {},
          createdAt,
          updatedAt,
        }),
      ];

      const fireItems = templates.filter(
        (t) => t.name.toLowerCase().includes("fire") || t.slug.includes("fire")
      );
      const iceItems = templates.filter(
        (t) => t.name.toLowerCase().includes("ice") || t.slug.includes("ice")
      );

      expect(fireItems).toHaveLength(1);
      expect(iceItems).toHaveLength(1);
      expect(fireItems[0].name).toBe("Fire Sword");
      expect(iceItems[0].name).toBe("Ice Shield");
    });

    it("should support template categorization", () => {
      const { createdAt, updatedAt } = generateTestDates();
      const templates = [
        new Template({
          itemClass: TEST_ENUMS.item_class.SOUL_CHIP,
          name: "AI Core",
          slug: "ai-core",
          meta: { category: "intelligence" },
          createdAt,
          updatedAt,
        }),
        new Template({
          itemClass: TEST_ENUMS.item_class.SKELETON,
          name: "Titanium Frame",
          slug: "titanium-frame",
          meta: { category: "structure" },
          createdAt,
          updatedAt,
        }),
        new Template({
          itemClass: TEST_ENUMS.item_class.PART,
          name: "Plasma Cannon",
          slug: "plasma-cannon",
          meta: { category: "weapon" },
          createdAt,
          updatedAt,
        }),
        new Template({
          itemClass: TEST_ENUMS.item_class.EXPANSION_CHIP,
          name: "Shield Generator",
          slug: "shield-generator",
          meta: { category: "defense" },
          createdAt,
          updatedAt,
        }),
      ];

      const weaponTemplates = templates.filter(
        (t) => t.meta.category === "weapon"
      );
      const defenseTemplates = templates.filter(
        (t) => t.meta.category === "defense"
      );
      const structureTemplates = templates.filter(
        (t) => t.meta.category === "structure"
      );

      expect(weaponTemplates).toHaveLength(1);
      expect(defenseTemplates).toHaveLength(1);
      expect(structureTemplates).toHaveLength(1);
    });

    it("should support slug uniqueness validation", () => {
      const { createdAt, updatedAt } = generateTestDates();
      const templates = [
        new Template({
          itemClass: TEST_ENUMS.item_class.PART,
          name: "Item 1",
          slug: "unique-slug-1",
          meta: {},
          createdAt,
          updatedAt,
        }),
        new Template({
          itemClass: TEST_ENUMS.item_class.PART,
          name: "Item 2",
          slug: "unique-slug-2",
          meta: {},
          createdAt,
          updatedAt,
        }),
        new Template({
          itemClass: TEST_ENUMS.item_class.PART,
          name: "Item 3",
          slug: "unique-slug-3",
          meta: {},
          createdAt,
          updatedAt,
        }),
      ];

      const slugs = templates.map((t) => t.slug);
      const uniqueSlugs = [...new Set(slugs)];

      expect(slugs).toHaveLength(3);
      expect(uniqueSlugs).toHaveLength(3);
      expect(slugs).toEqual(uniqueSlugs);
    });
  });
});
