import { describe, it, expect, beforeEach, vi } from "vitest";
import { AssetDto } from "../asset";
import {
  mockClient,
  mockValidateData,
  createMockAsset,
  createMockAssetPack,
  resetAllMocks,
} from "./setup";

describe("AssetDto", () => {
  beforeEach(() => {
    resetAllMocks();
  });

  describe("Constructor", () => {
    it("should create an empty DTO when no props provided", () => {
      const dto = new AssetDto();
      expect(dto.asset).toBeUndefined();
      expect(dto.pack).toBeUndefined();
    });

    it("should create DTO with Asset when props provided", () => {
      const props = createMockAsset();
      const dto = new AssetDto(props);

      expect(dto.asset).toBeDefined();
      expect(dto.asset?.id).toBe(props.id);
      expect(dto.asset?.packId).toBe(props.packId);
      expect(dto.asset?.kind).toBe(props.kind);
      expect(dto.asset?.url).toBe(props.url);
    });
  });

  describe("READ Operations", () => {
    describe("findById", () => {
      it("should find asset by ID with pack included by default", async () => {
        const mockAsset = createMockAsset();
        const mockPack = createMockAssetPack();
        const mockDbResult = { ...mockAsset, pack: mockPack };

        mockClient.asset.findUnique.mockResolvedValue(mockDbResult);

        const dto = new AssetDto();
        const result = await dto.findById("asset-123");

        expect(mockClient.asset.findUnique).toHaveBeenCalledWith({
          where: { id: "asset-123" },
          include: { pack: true },
        });
        expect(result).toBe(dto);
        expect(dto.asset?.id).toBe(mockAsset.id);
        expect(dto.pack?.assetPack?.id).toBe(mockPack.id);
      });

      it("should find asset by ID without pack when specified", async () => {
        const mockAsset = createMockAsset();
        mockClient.asset.findUnique.mockResolvedValue(mockAsset);

        const dto = new AssetDto();
        const result = await dto.findById("asset-123", { includePack: false });

        expect(mockClient.asset.findUnique).toHaveBeenCalledWith({
          where: { id: "asset-123" },
          include: undefined,
        });
        expect(result).toBe(dto);
        expect(dto.asset?.id).toBe(mockAsset.id);
        expect(dto.pack).toBeUndefined();
      });

      it("should handle not found case", async () => {
        mockClient.asset.findUnique.mockResolvedValue(null);

        const dto = new AssetDto();
        const result = await dto.findById("nonexistent");

        expect(result).toBe(dto);
        expect(dto.asset).toBeUndefined();
      });
    });

    describe("findByIdBasic", () => {
      it("should find asset without pack", async () => {
        const mockAsset = createMockAsset();
        mockClient.asset.findUnique.mockResolvedValue(mockAsset);

        const dto = new AssetDto();
        const result = await dto.findByIdBasic("asset-123");

        expect(mockClient.asset.findUnique).toHaveBeenCalledWith({
          where: { id: "asset-123" },
          include: undefined,
        });
        expect(result).toBe(dto);
      });
    });

    describe("findByIdWithPack", () => {
      it("should find asset with pack", async () => {
        const mockAsset = createMockAsset();
        const mockPack = createMockAssetPack();
        const mockDbResult = { ...mockAsset, pack: mockPack };

        mockClient.asset.findUnique.mockResolvedValue(mockDbResult);

        const dto = new AssetDto();
        const result = await dto.findByIdWithPack("asset-123");

        expect(mockClient.asset.findUnique).toHaveBeenCalledWith({
          where: { id: "asset-123" },
          include: { pack: true },
        });
        expect(result).toBe(dto);
        expect(dto.pack?.assetPack?.id).toBe(mockPack.id);
      });
    });

    describe("loadPack", () => {
      it("should lazy load pack when asset has packId", async () => {
        const mockAsset = createMockAsset();
        const mockPack = createMockAssetPack();

        const dto = new AssetDto(mockAsset);

        // Mock the AssetPackDto findById method
        mockClient.asset_pack.findUnique.mockResolvedValue(mockPack);

        const result = await dto.loadPack();

        expect(result).toBe(dto);
        expect(dto.pack?.assetPack).toEqual(mockPack);
      });

      it("should not load pack when already loaded", async () => {
        const mockAsset = createMockAsset();
        const dto = new AssetDto(mockAsset);
        dto.pack = { assetPack: createMockAssetPack() } as any;

        const result = await dto.loadPack();

        expect(result).toBe(dto);
        expect(mockClient.asset_pack.findUnique).not.toHaveBeenCalled();
      });

      it("should not load pack when asset has no packId", async () => {
        const dto = new AssetDto();

        const result = await dto.loadPack();

        expect(result).toBe(dto);
        expect(mockClient.asset_pack.findUnique).not.toHaveBeenCalled();
      });
    });

    describe("findManyWithOptions", () => {
      it("should find multiple assets with pack included", async () => {
        const mockAssets = [
          {
            ...createMockAsset({ id: "asset-1" }),
            pack: createMockAssetPack({ id: "pack-1" }),
          },
          {
            ...createMockAsset({ id: "asset-2" }),
            pack: createMockAssetPack({ id: "pack-2" }),
          },
        ];

        mockClient.asset.findMany.mockResolvedValue(mockAssets);

        const results = await AssetDto.findManyWithOptions({
          packId: "pack-123",
        });

        expect(mockClient.asset.findMany).toHaveBeenCalledWith({
          where: { packId: "pack-123" },
          include: { pack: true },
          skip: undefined,
          take: undefined,
        });
        expect(results).toHaveLength(2);
        expect(results[0].asset?.id).toBe("asset-1");
        expect(results[0].pack?.assetPack?.id).toBe("pack-1");
      });

      it("should find multiple assets with pagination", async () => {
        const mockAssets = [createMockAsset()];
        mockClient.asset.findMany.mockResolvedValue(mockAssets);

        const results = await AssetDto.findManyWithOptions(
          { packId: "pack-123" },
          { includePack: false },
          { skip: 10, take: 5 }
        );

        expect(mockClient.asset.findMany).toHaveBeenCalledWith({
          where: { packId: "pack-123" },
          include: undefined,
          skip: 10,
          take: 5,
        });
        expect(results).toHaveLength(1);
      });
    });
  });

  describe("CREATE/UPDATE Operations", () => {
    describe("upsert", () => {
      it("should create new asset successfully", async () => {
        const props = createMockAsset();
        const dto = new AssetDto(props);

        mockClient.asset.upsert.mockResolvedValue(props);

        const result = await dto.upsert();

        expect(mockClient.asset.upsert).toHaveBeenCalledWith({
          where: { id: props.id },
          update: dto.asset,
          create: dto.asset,
        });
        expect(result).toBe(dto);
      });

      it("should update existing asset successfully", async () => {
        const props = createMockAsset({
          url: "https://example.com/updated.png",
        });
        const dto = new AssetDto(props);

        mockClient.asset.upsert.mockResolvedValue(props);

        const result = await dto.upsert();

        expect(mockClient.asset.upsert).toHaveBeenCalledWith({
          where: { id: props.id },
          update: dto.asset,
          create: dto.asset,
        });
        expect(result).toBe(dto);
      });

      it("should throw error when asset is not set", async () => {
        const dto = new AssetDto();

        await expect(dto.upsert()).rejects.toThrow(
          "Pack is not allowed to be set"
        );
        expect(mockClient.asset.upsert).not.toHaveBeenCalled();
      });

      it("should handle database errors during upsert", async () => {
        const props = createMockAsset();
        const dto = new AssetDto(props);

        const error = new Error("Foreign key constraint violation");
        mockClient.asset.upsert.mockRejectedValue(error);

        await expect(dto.upsert()).rejects.toThrow(
          "Foreign key constraint violation"
        );
      });
    });
  });

  describe("Validation", () => {
    it("should validate successfully with valid data", () => {
      const props = createMockAsset();
      const dto = new AssetDto(props);

      const result = dto.validate();
      expect(result).toBe(dto);
    });

     it("should throw error when validation fails", () => {
       mockValidateData.mockReturnValue({
         success: false,
         error: "Invalid asset data",
       });

       const props = createMockAsset();
       const dto = new AssetDto(props);

       expect(() => dto.validate()).toThrow("Invalid asset data");
     });
  });

  describe("Integration Tests", () => {
    it("should perform complete CRUD cycle with relationships", async () => {
      // Create asset
      const createProps = createMockAsset();
      const createDto = new AssetDto(createProps);
      mockClient.asset.upsert.mockResolvedValue(createProps);

      await createDto.upsert();

      // Read asset with pack
      const mockPack = createMockAssetPack();
      const mockDbResult = { ...createProps, pack: mockPack };
      mockClient.asset.findUnique.mockResolvedValue(mockDbResult);

      const readDto = new AssetDto();
      await readDto.findByIdWithPack(createProps.id!);

      expect(readDto.asset?.id).toBe(createProps.id);
      expect(readDto.pack?.assetPack?.id).toBe(mockPack.id);

      // Update asset
      const updateProps = {
        ...createProps,
        url: "https://example.com/updated.png",
      };
      const updateDto = new AssetDto(updateProps);
      mockClient.asset.upsert.mockResolvedValue(updateProps);

      await updateDto.upsert();
      expect(mockClient.asset.upsert).toHaveBeenCalledTimes(2);
    });

    it("should handle lazy loading of pack", async () => {
      const assetProps = createMockAsset();
      const packProps = createMockAssetPack();

      const dto = new AssetDto(assetProps);
      mockClient.asset_pack.findUnique.mockResolvedValue(packProps);

      await dto.loadPack();
      expect(dto.pack?.assetPack).toEqual(packProps);
    });
  });

  describe("Edge Cases", () => {
    it("should handle missing optional fields", () => {
      const props = createMockAsset();
      delete props.variant;
      delete props.meta;

      const dto = new AssetDto(props);
      expect(dto.asset?.variant).toBeUndefined();
      expect(dto.asset?.meta).toBeUndefined();
    });

    it("should handle zero dimensions", () => {
      const props = createMockAsset({ width: 0, height: 0 });
      const dto = new AssetDto(props);

      expect(dto.asset?.width).toBe(0);
      expect(dto.asset?.height).toBe(0);
    });

    it("should handle complex meta object", () => {
      const complexMeta = {
        tags: ["sprite", "character"],
        animations: { idle: { frames: 4, duration: 1000 } },
        nested: { deep: { value: "test" } },
      };

      const props = createMockAsset({ meta: complexMeta });
      const dto = new AssetDto(props);

      expect(dto.asset?.meta).toEqual(complexMeta);
    });

    it("should handle different asset kinds", () => {
      const imageAsset = new AssetDto(createMockAsset({ kind: "IMAGE" }));
      const audioAsset = new AssetDto(createMockAsset({ kind: "AUDIO" }));
      const videoAsset = new AssetDto(createMockAsset({ kind: "VIDEO" }));

      expect(imageAsset.asset?.kind).toBe("IMAGE");
      expect(audioAsset.asset?.kind).toBe("AUDIO");
      expect(videoAsset.asset?.kind).toBe("VIDEO");
    });
  });
});
