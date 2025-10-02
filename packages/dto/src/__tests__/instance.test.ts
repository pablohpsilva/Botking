import { describe, it, expect, beforeEach, vi } from "vitest";
import { InstanceDto } from "../instance";
import {
  mockClient,
  createMockInstance,
  createMockTemplate,
  createMockPlayerAccount,
  resetAllMocks,
} from "./setup";

describe("InstanceDto", () => {
  beforeEach(() => {
    resetAllMocks();
  });

  describe("Constructor", () => {
    it("should create an empty DTO when no props provided", () => {
      const dto = new InstanceDto();
      expect(dto.instance).toBeUndefined();
      expect(dto.template).toBeUndefined();
      expect(dto.account).toBeUndefined();
      expect(dto.slots).toBeUndefined();
    });

    it("should create DTO with Instance when props provided", () => {
      const props = createMockInstance();
      const dto = new InstanceDto(props);

      expect(dto.instance).toBeDefined();
      expect(dto.instance?.id).toBe(props.id);
      expect(dto.instance?.templateId).toBe(props.templateId);
      expect(dto.instance?.state).toBe(props.state);
      expect(dto.instance?.playerId).toBe(BigInt(props.playerId));
    });
  });

  describe("READ Operations", () => {
    describe("findById", () => {
      it("should find instance by ID without relationships by default", async () => {
        const mockInstance = createMockInstance();
        mockClient.instance.findUnique.mockResolvedValue(mockInstance);

        const dto = new InstanceDto();
        const result = await dto.findById("instance-123");

        expect(mockClient.instance.findUnique).toHaveBeenCalledWith({
          where: { id: "instance-123" },
          include: undefined,
        });
        expect(result).toBe(dto);
        expect(dto.instance?.id).toBe(mockInstance.id);
        expect(dto.template).toBeUndefined();
        expect(dto.account).toBeUndefined();
        expect(dto.slots).toBeUndefined();
      });

      it("should find instance by ID with template when specified", async () => {
        const mockInstance = createMockInstance();
        const mockTemplate = createMockTemplate();
        const mockDbResult = { ...mockInstance, template: mockTemplate };

        mockClient.instance.findUnique.mockResolvedValue(mockDbResult);

        const dto = new InstanceDto();
        const result = await dto.findById("instance-123", {
          includeTemplate: true,
        });

        expect(mockClient.instance.findUnique).toHaveBeenCalledWith({
          where: { id: "instance-123" },
          include: { template: true },
        });
        expect(result).toBe(dto);
        expect(dto.instance?.id).toBe(mockInstance.id);
        expect(dto.template?.template).toEqual(mockTemplate);
      });

      it("should find instance by ID with account when specified", async () => {
        const mockInstance = createMockInstance();
        const mockAccount = {
          ...createMockPlayerAccount(),
          shard: { shardId: 1 },
        };
        const mockDbResult = { ...mockInstance, account: mockAccount };

        mockClient.instance.findUnique.mockResolvedValue(mockDbResult);

        const dto = new InstanceDto();
        const result = await dto.findById("instance-123", {
          includeAccount: true,
        });

        expect(mockClient.instance.findUnique).toHaveBeenCalledWith({
          where: { id: "instance-123" },
          include: { account: { include: { shard: true } } },
        });
        expect(result).toBe(dto);
        expect(dto.account?.playerAccount).toEqual(mockAccount);
      });

      it("should find instance by ID with slots when specified", async () => {
        const mockInstance = createMockInstance();
        const mockSlots = {
          soul_chip_slot: { id: "soul-123" },
          skeleton_slot: { id: "skeleton-123" },
          part_slot: [{ id: "part-1" }],
          expansion_slot: [{ id: "exp-1" }],
        };
        const mockDbResult = { ...mockInstance, ...mockSlots };

        mockClient.instance.findUnique.mockResolvedValue(mockDbResult);

        const dto = new InstanceDto();
        const result = await dto.findById("instance-123", {
          includeSlots: true,
        });

        expect(mockClient.instance.findUnique).toHaveBeenCalledWith({
          where: { id: "instance-123" },
          include: {
            soul_chip_slot: true,
            skeleton_slot: true,
            part_slot: true,
            expansion_slot: true,
          },
        });
        expect(result).toBe(dto);
        expect(dto.slots?.soulChip).toEqual(mockSlots.soul_chip_slot);
        expect(dto.slots?.skeleton).toEqual(mockSlots.skeleton_slot);
        expect(dto.slots?.parts).toEqual(mockSlots.part_slot);
        expect(dto.slots?.expansions).toEqual(mockSlots.expansion_slot);
      });

      it("should handle not found case", async () => {
        mockClient.instance.findUnique.mockResolvedValue(null);

        const dto = new InstanceDto();
        const result = await dto.findById("nonexistent");

        expect(result).toBe(dto);
        expect(dto.instance).toBeUndefined();
      });
    });

    describe("Convenience methods", () => {
      it("should find instance without relationships using findByIdBasic", async () => {
        const mockInstance = createMockInstance();
        mockClient.instance.findUnique.mockResolvedValue(mockInstance);

        const dto = new InstanceDto();
        const result = await dto.findByIdBasic("instance-123");

        expect(mockClient.instance.findUnique).toHaveBeenCalledWith({
          where: { id: "instance-123" },
          include: undefined,
        });
        expect(result).toBe(dto);
      });

      it("should find instance with template using findByIdWithTemplate", async () => {
        const mockInstance = createMockInstance();
        const mockTemplate = createMockTemplate();
        const mockDbResult = { ...mockInstance, template: mockTemplate };

        mockClient.instance.findUnique.mockResolvedValue(mockDbResult);

        const dto = new InstanceDto();
        const result = await dto.findByIdWithTemplate("instance-123");

        expect(mockClient.instance.findUnique).toHaveBeenCalledWith({
          where: { id: "instance-123" },
          include: { template: true },
        });
        expect(result).toBe(dto);
        expect(dto.template?.template).toEqual(mockTemplate);
      });

      it("should find instance for inventory using findByIdForInventory", async () => {
        const mockInstance = createMockInstance();
        const mockTemplate = createMockTemplate();
        const mockAccount = {
          ...createMockPlayerAccount(),
          shard: { shardId: 1 },
        };
        const mockDbResult = {
          ...mockInstance,
          template: mockTemplate,
          account: mockAccount,
        };

        mockClient.instance.findUnique.mockResolvedValue(mockDbResult);

        const dto = new InstanceDto();
        const result = await dto.findByIdForInventory("instance-123");

        expect(mockClient.instance.findUnique).toHaveBeenCalledWith({
          where: { id: "instance-123" },
          include: {
            template: true,
            account: { include: { shard: true } },
          },
        });
        expect(result).toBe(dto);
        expect(dto.template?.template).toEqual(mockTemplate);
        expect(dto.account?.playerAccount).toEqual(mockAccount);
      });

      it("should find instance for robot using findByIdForRobot", async () => {
        const mockInstance = createMockInstance();
        const mockTemplate = createMockTemplate();
        const mockSlots = {
          soul_chip_slot: { id: "soul-123" },
          skeleton_slot: { id: "skeleton-123" },
          part_slot: [],
          expansion_slot: [],
        };
        const mockDbResult = {
          ...mockInstance,
          template: mockTemplate,
          ...mockSlots,
        };

        mockClient.instance.findUnique.mockResolvedValue(mockDbResult);

        const dto = new InstanceDto();
        const result = await dto.findByIdForRobot("instance-123");

        expect(mockClient.instance.findUnique).toHaveBeenCalledWith({
          where: { id: "instance-123" },
          include: {
            template: true,
            soul_chip_slot: true,
            skeleton_slot: true,
            part_slot: true,
            expansion_slot: true,
          },
        });
        expect(result).toBe(dto);
        expect(dto.template?.template).toEqual(mockTemplate);
        expect(dto.slots).toBeDefined();
      });

      it("should find complete instance using findByIdComplete", async () => {
        const mockInstance = createMockInstance();
        const mockTemplate = createMockTemplate();
        const mockAccount = {
          ...createMockPlayerAccount(),
          shard: { shardId: 1 },
        };
        const mockSlots = {
          soul_chip_slot: { id: "soul-123" },
          skeleton_slot: { id: "skeleton-123" },
          part_slot: [],
          expansion_slot: [],
        };
        const mockDbResult = {
          ...mockInstance,
          template: mockTemplate,
          account: mockAccount,
          ...mockSlots,
        };

        mockClient.instance.findUnique.mockResolvedValue(mockDbResult);

        const dto = new InstanceDto();
        const result = await dto.findByIdComplete("instance-123");

        expect(mockClient.instance.findUnique).toHaveBeenCalledWith({
          where: { id: "instance-123" },
          include: {
            template: true,
            account: { include: { shard: true } },
            soul_chip_slot: true,
            skeleton_slot: true,
            part_slot: true,
            expansion_slot: true,
          },
        });
        expect(result).toBe(dto);
        expect(dto.template?.template).toEqual(mockTemplate);
        expect(dto.account?.playerAccount).toEqual(mockAccount);
        expect(dto.slots).toBeDefined();
      });
    });

    describe("Lazy loading methods", () => {
      it("should lazy load template when instance has templateId", async () => {
        const mockInstance = createMockInstance();
        const mockTemplate = createMockTemplate();

        const dto = new InstanceDto(mockInstance);
        mockClient.template.findUnique.mockResolvedValue(mockTemplate);

        await dto.loadTemplate();

        expect(mockClient.template.findUnique).toHaveBeenCalledWith({
          where: { id: mockInstance.templateId },
        });
        expect(dto.template?.template).toEqual(mockTemplate);
      });

      it("should not load template when already loaded", async () => {
        const mockInstance = createMockInstance();
        const dto = new InstanceDto(mockInstance);
        dto.template = { template: createMockTemplate() } as any;

        await dto.loadTemplate();

        expect(mockClient.template.findUnique).not.toHaveBeenCalled();
      });

      it("should lazy load account when instance has playerId", async () => {
        const mockInstance = createMockInstance();
        const mockAccount = {
          ...createMockPlayerAccount(),
          shard: { shardId: 1 },
        };

        const dto = new InstanceDto(mockInstance);
        mockClient.player_account.findUnique.mockResolvedValue(mockAccount);

        await dto.loadAccount();

        expect(mockClient.player_account.findUnique).toHaveBeenCalledWith({
          where: { globalPlayerId: mockInstance.playerId.toString() },
          include: { shard: true },
        });
        expect(dto.account?.playerAccount).toEqual(mockAccount);
      });

      it("should lazy load slots when instance has ID", async () => {
        const mockInstance = createMockInstance();
        const mockSoulChip = { id: "soul-123" };
        const mockSkeleton = { id: "skeleton-123" };
        const mockParts = [{ id: "part-1" }];
        const mockExpansions = [{ id: "exp-1" }];

        const dto = new InstanceDto(mockInstance);
        mockClient.soul_chip_slot.findUnique.mockResolvedValue(mockSoulChip);
        mockClient.skeleton_slot.findUnique.mockResolvedValue(mockSkeleton);
        mockClient.part_slots.findMany.mockResolvedValue(mockParts);
        mockClient.expansion_slot.findMany.mockResolvedValue(mockExpansions);

        await dto.loadSlots();

        expect(mockClient.soul_chip_slot.findUnique).toHaveBeenCalledWith({
          where: { itemInstId: mockInstance.id },
        });
        expect(mockClient.skeleton_slot.findUnique).toHaveBeenCalledWith({
          where: { itemInstId: mockInstance.id },
        });
        expect(mockClient.part_slots.findMany).toHaveBeenCalledWith({
          where: { itemInstId: mockInstance.id },
        });
        expect(mockClient.expansion_slot.findMany).toHaveBeenCalledWith({
          where: { itemInstId: mockInstance.id },
        });

        expect(dto.slots?.soulChip).toEqual(mockSoulChip);
        expect(dto.slots?.skeleton).toEqual(mockSkeleton);
        expect(dto.slots?.parts).toEqual(mockParts);
        expect(dto.slots?.expansions).toEqual(mockExpansions);
      });
    });

    describe("findManyWithOptions", () => {
      it("should find multiple instances with all relationships", async () => {
        const mockInstances = [
          {
            ...createMockInstance({ id: "instance-1" }),
            template: createMockTemplate({ id: "template-1" }),
            account: {
              ...createMockPlayerAccount({ id: "account-1" }),
              shard: { shardId: 1 },
            },
            soul_chip_slot: { id: "soul-1" },
            skeleton_slot: { id: "skeleton-1" },
            part_slot: [],
            expansion_slot: [],
          },
        ];

        mockClient.instance.findMany.mockResolvedValue(mockInstances);

        const results = await InstanceDto.findManyWithOptions(
          { shardId: 1 },
          { includeTemplate: true, includeAccount: true, includeSlots: true }
        );

        expect(mockClient.instance.findMany).toHaveBeenCalledWith({
          where: { shardId: 1 },
          include: {
            template: true,
            account: { include: { shard: true } },
            soul_chip_slot: true,
            skeleton_slot: true,
            part_slot: true,
            expansion_slot: true,
          },
          skip: undefined,
          take: undefined,
        });
        expect(results).toHaveLength(1);
        expect(results[0].instance?.id).toBe("instance-1");
        expect(results[0].template?.template?.id).toBe("template-1");
        expect(results[0].account?.playerAccount.id).toBe("account-1");
        expect(results[0].slots).toBeDefined();
      });
    });
  });

  describe("CREATE/UPDATE Operations", () => {
    describe("upsert", () => {
      it("should create new instance successfully", async () => {
        const props = createMockInstance();
        const dto = new InstanceDto(props);

        const expectedDbData = {
          id: props.id,
          shardId: props.shardId,
          playerId: props.playerId.toString(),
          templateId: props.templateId,
          state: props.state,
          boundToPlayer: props.boundToPlayer,
          createdAt: props.createdAt,
          updatedAt: props.updatedAt,
        };

        mockClient.instance.upsert.mockResolvedValue(expectedDbData);

        const result = await dto.upsert();

        expect(mockClient.instance.upsert).toHaveBeenCalledWith({
          where: { id: props.id },
          update: expectedDbData,
          create: expectedDbData,
        });
        expect(result).toBe(dto);
      });

      it("should throw error when instance is not set", async () => {
        const dto = new InstanceDto();

        await expect(dto.upsert()).rejects.toThrow(
          "Instance is not allowed to be set"
        );
        expect(mockClient.instance.upsert).not.toHaveBeenCalled();
      });
    });
  });

  describe("Validation", () => {
    it("should validate successfully with valid data", () => {
      const props = createMockInstance();
      const dto = new InstanceDto(props);

      const result = dto.validate();
      expect(result).toBe(dto);
    });

    it("should throw error when validation fails", () => {
      const { validateData } = require("@botking/validator");
      validateData.mockReturnValue({
        success: false,
        error: "Invalid instance data",
      });

      const props = createMockInstance();
      const dto = new InstanceDto(props);

      expect(() => dto.validate()).toThrow("Invalid instance data");
    });
  });

  describe("Edge Cases", () => {
    it("should handle different instance states", () => {
      const activeInstance = new InstanceDto(
        createMockInstance({ state: "ACTIVE" })
      );
      const inactiveInstance = new InstanceDto(
        createMockInstance({ state: "INACTIVE" })
      );
      const destroyedInstance = new InstanceDto(
        createMockInstance({ state: "DESTROYED" })
      );

      expect(activeInstance.instance?.state).toBe("ACTIVE");
      expect(inactiveInstance.instance?.state).toBe("INACTIVE");
      expect(destroyedInstance.instance?.state).toBe("DESTROYED");
    });

    it("should handle empty boundToPlayer", () => {
      const props = createMockInstance({ boundToPlayer: "" });
      const dto = new InstanceDto(props);

      expect(dto.instance?.boundToPlayer).toBe("");
    });

    it("should handle large player ID values", () => {
      const largePlayerId = "9223372036854775807"; // Max BigInt value
      const props = createMockInstance({ playerId: largePlayerId });
      const dto = new InstanceDto(props);

      expect(dto.instance?.playerId).toBe(BigInt(largePlayerId));
    });

    it("should handle instance with no slots", async () => {
      const mockInstance = createMockInstance();
      const mockDbResult = {
        ...mockInstance,
        soul_chip_slot: null,
        skeleton_slot: null,
        part_slot: [],
        expansion_slot: [],
      };

      mockClient.instance.findUnique.mockResolvedValue(mockDbResult);

      const dto = new InstanceDto();
      await dto.findByIdForRobot("instance-123");

      expect(dto.slots?.soulChip).toBeNull();
      expect(dto.slots?.skeleton).toBeNull();
      expect(dto.slots?.parts).toHaveLength(0);
      expect(dto.slots?.expansions).toHaveLength(0);
    });
  });
});
