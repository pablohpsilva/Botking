import { describe, it, expect, beforeEach, vi } from "vitest";
import { ShardDto } from "../shard";
import { mockClient, mockValidateData, createMockShard, resetAllMocks } from "./setup";

describe("ShardDto", () => {
  beforeEach(() => {
    resetAllMocks();
  });

  describe("Constructor", () => {
    it("should create an empty DTO when no props provided", () => {
      const dto = new ShardDto();
      expect(dto.shard).toBeUndefined();
    });

    it("should create DTO with Shard when props provided", () => {
      const props = createMockShard();
      const dto = new ShardDto(props);

      expect(dto.shard).toBeDefined();
      expect(dto.shard?.shardId).toBe(props.shardId);
      expect(dto.shard?.createdAt).toBe(props.createdAt);
      expect(dto.shard?.updatedAt).toBe(props.updatedAt);
    });
  });

  describe("READ Operations", () => {
    describe("findById", () => {
      it("should find shard by ID successfully", async () => {
        const mockData = createMockShard();
        mockClient.shard.findUnique.mockResolvedValue(mockData);

        const dto = new ShardDto();
        const result = await dto.findById(1);

        expect(mockClient.shard.findUnique).toHaveBeenCalledWith({
          where: { shardId: 1 },
        });
        expect(result).toBe(dto);
        expect(dto.shard).toEqual(mockData);
      });

      it("should handle not found case", async () => {
        mockClient.shard.findUnique.mockResolvedValue(null);

        const dto = new ShardDto();
        const result = await dto.findById(999);

        expect(mockClient.shard.findUnique).toHaveBeenCalledWith({
          where: { shardId: 999 },
        });
        expect(result).toBe(dto);
        expect(dto.shard).toBeNull();
      });

      it("should handle database errors", async () => {
        const error = new Error("Database connection failed");
        mockClient.shard.findUnique.mockRejectedValue(error);

        const dto = new ShardDto();

        await expect(dto.findById(1)).rejects.toThrow(
          "Database connection failed"
        );
      });

      it("should handle different shard ID types", async () => {
        const mockData = createMockShard({ shardId: 42 });
        mockClient.shard.findUnique.mockResolvedValue(mockData);

        const dto = new ShardDto();
        const result = await dto.findById(42);

        expect(mockClient.shard.findUnique).toHaveBeenCalledWith({
          where: { shardId: 42 },
        });
        expect(result).toBe(dto);
        expect(dto.shard?.shardId).toBe(42);
      });
    });
  });

  describe("CREATE/UPDATE Operations", () => {
    describe("upsert", () => {
      it("should create new shard successfully", async () => {
        const props = createMockShard();
        const dto = new ShardDto(props);

        mockClient.shard.upsert.mockResolvedValue(props);

        const result = await dto.upsert();

        expect(mockClient.shard.upsert).toHaveBeenCalledWith({
          where: { shardId: props.shardId },
          update: dto.shard,
          create: dto.shard,
        });
        expect(result).toBe(dto);
      });

      it("should update existing shard successfully", async () => {
        const props = createMockShard({ shardId: 2 });
        const dto = new ShardDto(props);

        mockClient.shard.upsert.mockResolvedValue(props);

        const result = await dto.upsert();

        expect(mockClient.shard.upsert).toHaveBeenCalledWith({
          where: { shardId: props.shardId },
          update: dto.shard,
          create: dto.shard,
        });
        expect(result).toBe(dto);
      });

      it("should throw error when shard is not set", async () => {
        const dto = new ShardDto();

        await expect(dto.upsert()).rejects.toThrow(
          "Shard pack is not allowed to be set"
        );
        expect(mockClient.shard.upsert).not.toHaveBeenCalled();
      });

      it("should handle database errors during upsert", async () => {
        const props = createMockShard();
        const dto = new ShardDto(props);

        const error = new Error("Unique constraint violation");
        mockClient.shard.upsert.mockRejectedValue(error);

        await expect(dto.upsert()).rejects.toThrow(
          "Unique constraint violation"
        );
      });
    });
  });

  describe("Validation", () => {
    it("should validate successfully with valid data", () => {
      const props = createMockShard();
      const dto = new ShardDto(props);

      const result = dto.validate();
      expect(result).toBe(dto);
    });

     it("should throw error when validation fails", () => {
       mockValidateData.mockReturnValue({
         success: false,
         error: "Invalid shard data",
       });

       const props = createMockShard();
       const dto = new ShardDto(props);

       expect(() => dto.validate()).toThrow("Invalid shard data");
     });
  });

  describe("Integration Tests", () => {
    it("should perform complete CRUD cycle", async () => {
      // Create
      const createProps = createMockShard();
      const createDto = new ShardDto(createProps);
      mockClient.shard.upsert.mockResolvedValue(createProps);

      await createDto.upsert();
      expect(mockClient.shard.upsert).toHaveBeenCalledTimes(1);

      // Read
      const readDto = new ShardDto();
      mockClient.shard.findUnique.mockResolvedValue(createProps);

      await readDto.findById(createProps.shardId);
      expect(readDto.shard).toEqual(createProps);

      // Update (shards typically don't change much, but timestamps might)
      const updateProps = { ...createProps, updatedAt: new Date("2023-12-31") };
      const updateDto = new ShardDto(updateProps);
      mockClient.shard.upsert.mockResolvedValue(updateProps);

      await updateDto.upsert();
      expect(mockClient.shard.upsert).toHaveBeenCalledTimes(2);

      // Verify final state
      mockClient.shard.findUnique.mockResolvedValue(updateProps);
      const finalDto = new ShardDto();
      await finalDto.findById(createProps.shardId);
      expect(finalDto.shard?.updatedAt).toEqual(new Date("2023-12-31"));
    });

     it("should handle validation in upsert flow", async () => {
       mockValidateData.mockReturnValue({
         success: false,
         error: "Shard ID is required",
       });

       const props = createMockShard({ shardId: null as any });
       const dto = new ShardDto(props);

       await expect(dto.upsert()).rejects.toThrow("Shard ID is required");
       expect(mockClient.shard.upsert).not.toHaveBeenCalled();
     });
  });

  describe("Edge Cases", () => {
    it("should handle zero shard ID", () => {
      const props = createMockShard({ shardId: 0 });
      const dto = new ShardDto(props);

      expect(dto.shard?.shardId).toBe(0);
    });

    it("should handle negative shard ID", () => {
      const props = createMockShard({ shardId: -1 });
      const dto = new ShardDto(props);

      expect(dto.shard?.shardId).toBe(-1);
    });

    it("should handle large shard ID values", () => {
      const largeShardId = 2147483647; // Max 32-bit integer
      const props = createMockShard({ shardId: largeShardId });
      const dto = new ShardDto(props);

      expect(dto.shard?.shardId).toBe(largeShardId);
    });

    it("should handle same createdAt and updatedAt timestamps", () => {
      const timestamp = new Date("2023-01-01T00:00:00.000Z");
      const props = createMockShard({
        createdAt: timestamp,
        updatedAt: timestamp,
      });
      const dto = new ShardDto(props);

      expect(dto.shard?.createdAt).toBe(timestamp);
      expect(dto.shard?.updatedAt).toBe(timestamp);
    });

    it("should handle future timestamps", () => {
      const futureDate = new Date("2030-01-01T00:00:00.000Z");
      const props = createMockShard({
        createdAt: futureDate,
        updatedAt: futureDate,
      });
      const dto = new ShardDto(props);

      expect(dto.shard?.createdAt).toBe(futureDate);
      expect(dto.shard?.updatedAt).toBe(futureDate);
    });

    it("should handle multiple shards with different IDs", async () => {
      const shard1Props = createMockShard({ shardId: 1 });
      const shard2Props = createMockShard({ shardId: 2 });
      const shard3Props = createMockShard({ shardId: 100 });

      const dto1 = new ShardDto(shard1Props);
      const dto2 = new ShardDto(shard2Props);
      const dto3 = new ShardDto(shard3Props);

      expect(dto1.shard?.shardId).toBe(1);
      expect(dto2.shard?.shardId).toBe(2);
      expect(dto3.shard?.shardId).toBe(100);
    });

    it("should handle upsert with different where clause than other DTOs", async () => {
      // Shard uses shardId as the unique identifier, not id
      const props = createMockShard({ shardId: 42 });
      const dto = new ShardDto(props);

      mockClient.shard.upsert.mockResolvedValue(props);
      await dto.upsert();

      expect(mockClient.shard.upsert).toHaveBeenCalledWith({
        where: { shardId: 42 }, // Note: shardId, not id
        update: dto.shard,
        create: dto.shard,
      });
    });
  });
});
