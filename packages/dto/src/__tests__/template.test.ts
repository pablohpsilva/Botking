import { describe, it, expect, beforeEach, vi } from "vitest";
import { TemplateDto } from "../template";
import { mockClient, createMockTemplate, resetAllMocks } from "./setup";

describe("TemplateDto", () => {
  beforeEach(() => {
    resetAllMocks();
  });

  describe("Constructor", () => {
    it("should create an empty DTO when no props provided", () => {
      const dto = new TemplateDto();
      expect(dto.template).toBeUndefined();
    });

    it("should create DTO with Template when props provided", () => {
      const props = createMockTemplate();
      const dto = new TemplateDto(props);

      expect(dto.template).toBeDefined();
      expect(dto.template?.id).toBe(props.id);
      expect(dto.template?.name).toBe(props.name);
      expect(dto.template?.slug).toBe(props.slug);
      expect(dto.template?.itemClass).toBe(props.itemClass);
    });
  });

  describe("READ Operations", () => {
    describe("findById", () => {
      it("should find template by ID successfully", async () => {
        const mockData = createMockTemplate();
        mockClient.template.findUnique.mockResolvedValue(mockData);

        const dto = new TemplateDto();
        const result = await dto.findById("template-123");

        expect(mockClient.template.findUnique).toHaveBeenCalledWith({
          where: { id: "template-123" },
        });
        expect(result).toBe(dto);
        expect(dto.template).toEqual(mockData);
      });

      it("should handle not found case", async () => {
        mockClient.template.findUnique.mockResolvedValue(null);

        const dto = new TemplateDto();
        const result = await dto.findById("nonexistent");

        expect(mockClient.template.findUnique).toHaveBeenCalledWith({
          where: { id: "nonexistent" },
        });
        expect(result).toBe(dto);
        expect(dto.template).toBeNull();
      });

      it("should handle database errors", async () => {
        const error = new Error("Database connection failed");
        mockClient.template.findUnique.mockRejectedValue(error);

        const dto = new TemplateDto();

        await expect(dto.findById("template-123")).rejects.toThrow(
          "Database connection failed"
        );
      });
    });
  });

  describe("CREATE/UPDATE Operations", () => {
    describe("upsert", () => {
      it("should create new template successfully", async () => {
        const props = createMockTemplate();
        const dto = new TemplateDto(props);

        mockClient.template.upsert.mockResolvedValue(props);

        const result = await dto.upsert();

        expect(mockClient.template.upsert).toHaveBeenCalledWith({
          where: { id: props.id },
          update: dto.template,
          create: dto.template,
        });
        expect(result).toBe(dto);
      });

      it("should update existing template successfully", async () => {
        const props = createMockTemplate({ name: "Updated Template" });
        const dto = new TemplateDto(props);

        mockClient.template.upsert.mockResolvedValue(props);

        const result = await dto.upsert();

        expect(mockClient.template.upsert).toHaveBeenCalledWith({
          where: { id: props.id },
          update: dto.template,
          create: dto.template,
        });
        expect(result).toBe(dto);
      });

      it("should throw error when template is not set", async () => {
        const dto = new TemplateDto();

        await expect(dto.upsert()).rejects.toThrow(
          "Template pack is not allowed to be set"
        );
        expect(mockClient.template.upsert).not.toHaveBeenCalled();
      });

      it("should handle database errors during upsert", async () => {
        const props = createMockTemplate();
        const dto = new TemplateDto(props);

        const error = new Error("Unique constraint violation");
        mockClient.template.upsert.mockRejectedValue(error);

        await expect(dto.upsert()).rejects.toThrow(
          "Unique constraint violation"
        );
      });
    });
  });

  describe("Validation", () => {
    it("should validate successfully with valid data", () => {
      const props = createMockTemplate();
      const dto = new TemplateDto(props);

      const result = dto.validate();
      expect(result).toBe(dto);
    });

    it("should throw error when validation fails", () => {
      const { validateData } = require("@botking/validator");
      validateData.mockReturnValue({
        success: false,
        error: "Invalid template data",
      });

      const props = createMockTemplate();
      const dto = new TemplateDto(props);

      expect(() => dto.validate()).toThrow("Invalid template data");
    });
  });

  describe("Integration Tests", () => {
    it("should perform complete CRUD cycle", async () => {
      // Create
      const createProps = createMockTemplate();
      const createDto = new TemplateDto(createProps);
      mockClient.template.upsert.mockResolvedValue(createProps);

      await createDto.upsert();
      expect(mockClient.template.upsert).toHaveBeenCalledTimes(1);

      // Read
      const readDto = new TemplateDto();
      mockClient.template.findUnique.mockResolvedValue(createProps);

      await readDto.findById(createProps.id!);
      expect(readDto.template).toEqual(createProps);

      // Update
      const updateProps = { ...createProps, name: "Updated Template Name" };
      const updateDto = new TemplateDto(updateProps);
      mockClient.template.upsert.mockResolvedValue(updateProps);

      await updateDto.upsert();
      expect(mockClient.template.upsert).toHaveBeenCalledTimes(2);

      // Verify final state
      mockClient.template.findUnique.mockResolvedValue(updateProps);
      const finalDto = new TemplateDto();
      await finalDto.findById(createProps.id!);
      expect(finalDto.template?.name).toBe("Updated Template Name");
    });

    it("should handle validation in upsert flow", async () => {
      const { validateData } = require("@botking/validator");
      validateData.mockReturnValue({
        success: false,
        error: "Name is required",
      });

      const props = createMockTemplate({ name: "" });
      const dto = new TemplateDto(props);

      await expect(dto.upsert()).rejects.toThrow("Name is required");
      expect(mockClient.template.upsert).not.toHaveBeenCalled();
    });
  });

  describe("Edge Cases", () => {
    it("should handle undefined ID in constructor", () => {
      const props = createMockTemplate();
      delete props.id;

      const dto = new TemplateDto(props);
      expect(dto.template?.id).toBeUndefined();
    });

    it("should handle empty string values", () => {
      const props = createMockTemplate({ name: "", slug: "" });
      const dto = new TemplateDto(props);

      expect(dto.template?.name).toBe("");
      expect(dto.template?.slug).toBe("");
    });

    it("should handle different item classes", () => {
      const soulChipTemplate = new TemplateDto(
        createMockTemplate({ itemClass: "SOUL_CHIP" })
      );
      const skeletonTemplate = new TemplateDto(
        createMockTemplate({ itemClass: "SKELETON" })
      );
      const partTemplate = new TemplateDto(
        createMockTemplate({ itemClass: "PART" })
      );
      const expansionTemplate = new TemplateDto(
        createMockTemplate({ itemClass: "EXPANSION" })
      );

      expect(soulChipTemplate.template?.itemClass).toBe("SOUL_CHIP");
      expect(skeletonTemplate.template?.itemClass).toBe("SKELETON");
      expect(partTemplate.template?.itemClass).toBe("PART");
      expect(expansionTemplate.template?.itemClass).toBe("EXPANSION");
    });

    it("should handle complex meta object", () => {
      const complexMeta = {
        stats: { health: 100, damage: 25 },
        abilities: ["laser", "shield"],
        rarity: "legendary",
        nested: { deep: { value: "test" } },
      };

      const props = createMockTemplate({ meta: complexMeta });
      const dto = new TemplateDto(props);

      expect(dto.template?.meta).toEqual(complexMeta);
    });

    it("should handle special characters in name and slug", () => {
      const props = createMockTemplate({
        name: 'Template with "quotes" & symbols!',
        slug: "template-with-special-chars_123",
      });
      const dto = new TemplateDto(props);

      expect(dto.template?.name).toBe('Template with "quotes" & symbols!');
      expect(dto.template?.slug).toBe("template-with-special-chars_123");
    });

    it("should handle empty meta object", () => {
      const props = createMockTemplate({ meta: {} });
      const dto = new TemplateDto(props);

      expect(dto.template?.meta).toEqual({});
    });

    it("should handle null meta object", () => {
      const props = createMockTemplate({ meta: null as any });
      const dto = new TemplateDto(props);

      expect(dto.template?.meta).toBeNull();
    });
  });
});
