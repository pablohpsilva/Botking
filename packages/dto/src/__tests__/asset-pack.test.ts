import { describe, it, expect, beforeEach, vi } from "vitest";
import { AssetPackDto } from "../asset-pack";
import {
  mockClient,
  mockValidateData,
  createMockAssetPack,
  resetAllMocks,
} from "./setup";

describe("AssetPackDto", () => {
  beforeEach(() => {
    resetAllMocks();
  });

  describe("Constructor", () => {
    it("should create an empty DTO when no props provided", () => {
      const dto = new AssetPackDto();
      expect(dto.assetPack).toBeUndefined();
    });

    it("should create DTO with AssetPack when props provided", () => {
      const props = createMockAssetPack();
      const dto = new AssetPackDto(props);

      expect(dto.assetPack).toBeDefined();
      expect(dto.assetPack?.id).toBe(props.id);
      expect(dto.assetPack?.name).toBe(props.name);
      expect(dto.assetPack?.version).toBe(props.version);
    });
  });

  describe("READ Operations", () => {
    describe("findById", () => {
      it("should find asset pack by ID successfully", async () => {
        const mockData = createMockAssetPack();
        mockClient.asset_pack.findUnique.mockResolvedValue(mockData);

        const dto = new AssetPackDto();
        const result = await dto.findById("pack-123");

        expect(mockClient.asset_pack.findUnique).toHaveBeenCalledWith({
          where: { id: "pack-123" },
        });
        expect(result).toBe(dto);
        expect(dto.assetPack).toEqual(mockData);
      });

      it("should handle not found case", async () => {
        mockClient.asset_pack.findUnique.mockResolvedValue(null);

        const dto = new AssetPackDto();
        const result = await dto.findById("nonexistent");

        expect(mockClient.asset_pack.findUnique).toHaveBeenCalledWith({
          where: { id: "nonexistent" },
        });
        expect(result).toBe(dto);
        expect(dto.assetPack).toBeNull();
      });

      it("should handle database errors", async () => {
        const error = new Error("Database connection failed");
        mockClient.asset_pack.findUnique.mockRejectedValue(error);

        const dto = new AssetPackDto();

        await expect(dto.findById("pack-123")).rejects.toThrow(
          "Database connection failed"
        );
      });
    });
  });

  describe("CREATE/UPDATE Operations", () => {
    describe("upsert", () => {
      it("should create new asset pack successfully", async () => {
        const props = createMockAssetPack();
        const dto = new AssetPackDto(props);

        mockClient.asset_pack.upsert.mockResolvedValue(props);

        const result = await dto.upsert();

        expect(mockClient.asset_pack.upsert).toHaveBeenCalledWith({
          where: { id: props.id },
          update: dto.assetPack,
          create: dto.assetPack,
        });
        expect(result).toBe(dto);
      });

      it("should update existing asset pack successfully", async () => {
        const props = createMockAssetPack({ name: "Updated Pack" });
        const dto = new AssetPackDto(props);

        mockClient.asset_pack.upsert.mockResolvedValue(props);

        const result = await dto.upsert();

        expect(mockClient.asset_pack.upsert).toHaveBeenCalledWith({
          where: { id: props.id },
          update: dto.assetPack,
          create: dto.assetPack,
        });
        expect(result).toBe(dto);
      });

      it("should throw error when asset pack is not set", async () => {
        const dto = new AssetPackDto();

        await expect(dto.upsert()).rejects.toThrow(
          "Asset pack is not allowed to be set"
        );
        expect(mockClient.asset_pack.upsert).not.toHaveBeenCalled();
      });

      it("should handle database errors during upsert", async () => {
        const props = createMockAssetPack();
        const dto = new AssetPackDto(props);

        const error = new Error("Unique constraint violation");
        mockClient.asset_pack.upsert.mockRejectedValue(error);

        await expect(dto.upsert()).rejects.toThrow(
          "Unique constraint violation"
        );
      });
    });
  });

  describe("Validation", () => {
    it("should validate successfully with valid data", () => {
      const props = createMockAssetPack();
      const dto = new AssetPackDto(props);

      const result = dto.validate();
      expect(result).toBe(dto);
    });

    it("should throw error when validation fails", () => {
      mockValidateData.mockReturnValue({
        success: false,
        error: "Invalid data",
      });

      const props = createMockAssetPack();
      const dto = new AssetPackDto(props);

      expect(() => dto.validate()).toThrow("Invalid data");
    });
  });

  describe("Integration Tests", () => {
    it("should perform complete CRUD cycle", async () => {
      // Create
      const createProps = createMockAssetPack();
      const createDto = new AssetPackDto(createProps);
      mockClient.asset_pack.upsert.mockResolvedValue(createProps);

      await createDto.upsert();
      expect(mockClient.asset_pack.upsert).toHaveBeenCalledTimes(1);

      // Read
      const readDto = new AssetPackDto();
      mockClient.asset_pack.findUnique.mockResolvedValue(createProps);

      await readDto.findById(createProps.id!);
      expect(readDto.assetPack).toEqual(createProps);

      // Update
      const updateProps = { ...createProps, name: "Updated Pack Name" };
      const updateDto = new AssetPackDto(updateProps);
      mockClient.asset_pack.upsert.mockResolvedValue(updateProps);

      await updateDto.upsert();
      expect(mockClient.asset_pack.upsert).toHaveBeenCalledTimes(2);

      // Verify final state
      mockClient.asset_pack.findUnique.mockResolvedValue(updateProps);
      const finalDto = new AssetPackDto();
      await finalDto.findById(createProps.id!);
      expect(finalDto.assetPack?.name).toBe("Updated Pack Name");
    });

    it("should handle validation in upsert flow", async () => {
      mockValidateData.mockReturnValue({
        success: false,
        error: "Name is required",
      });

      const props = createMockAssetPack({ name: "" });
      const dto = new AssetPackDto(props);

      await expect(dto.upsert()).rejects.toThrow("Name is required");
      expect(mockClient.asset_pack.upsert).not.toHaveBeenCalled();
    });
  });

  describe("Edge Cases", () => {
    it("should handle undefined ID in constructor", () => {
      const props = createMockAssetPack();
      delete props.id;

      const dto = new AssetPackDto(props);
      expect(dto.assetPack?.id).toBeUndefined();
    });

    it("should handle empty string values", () => {
      const props = createMockAssetPack({ name: "", version: "" });
      const dto = new AssetPackDto(props);

      expect(dto.assetPack?.name).toBe("");
      expect(dto.assetPack?.version).toBe("");
    });

    it("should handle special characters in name and version", () => {
      const props = createMockAssetPack({
        name: 'Pack with "quotes" & symbols!',
        version: "1.0.0-beta+build.123",
      });
      const dto = new AssetPackDto(props);

      expect(dto.assetPack?.name).toBe('Pack with "quotes" & symbols!');
      expect(dto.assetPack?.version).toBe("1.0.0-beta+build.123");
    });
  });
});
