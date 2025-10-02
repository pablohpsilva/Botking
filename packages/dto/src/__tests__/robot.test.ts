import { describe, it, expect, beforeEach, vi } from "vitest";
import { RobotDto } from "../robot";
import { mockClient, createMockRobot, resetAllMocks } from "./setup";

describe("RobotDto", () => {
  beforeEach(() => {
    resetAllMocks();
  });

  describe("Constructor", () => {
    it("should create an empty DTO when no props provided", () => {
      const dto = new RobotDto();
      expect(dto.robot).toBeUndefined();
      expect(dto.account).toBeUndefined();
      expect(dto.slots).toBeUndefined();
    });

    it("should create DTO with Robot when props provided", () => {
      const props = createMockRobot();
      const dto = new RobotDto(props);

      expect(dto.robot).toBeDefined();
      expect(dto.robot?.id).toBe(props.id);
      expect(dto.robot?.nickname).toBe(props.nickname);
      expect(dto.robot?.shardId).toBe(props.shardId);
      expect(dto.robot?.playerId).toBe(BigInt(props.playerId));
    });
  });

  describe("READ Operations", () => {
    describe("findById", () => {
      it("should find robot by ID without relationships by default", async () => {
        const mockRobot = createMockRobot();
        mockClient.robot.findUnique.mockResolvedValue(mockRobot);

        const dto = new RobotDto();
        const result = await dto.findById("robot-123");

        expect(mockClient.robot.findUnique).toHaveBeenCalledWith({
          where: { id: "robot-123" },
          include: undefined,
        });
        expect(result).toBe(dto);
        expect(dto.robot?.id).toBe(mockRobot.id);
        expect(dto.account).toBeUndefined();
        expect(dto.slots).toBeUndefined();
      });

      it("should find robot by ID with account when specified", async () => {
        const mockRobot = createMockRobot();
        const mockAccount = { id: "account-123", shard: { shardId: 1 } };
        const mockDbResult = { ...mockRobot, account: mockAccount };

        mockClient.robot.findUnique.mockResolvedValue(mockDbResult);

        const dto = new RobotDto();
        const result = await dto.findById("robot-123", {
          includeAccount: true,
        });

        expect(mockClient.robot.findUnique).toHaveBeenCalledWith({
          where: { id: "robot-123" },
          include: { account: { include: { shard: true } } },
        });
        expect(result).toBe(dto);
        expect(dto.robot?.id).toBe(mockRobot.id);
        expect(dto.account?.playerAccount).toEqual(mockAccount);
      });

      it("should find robot by ID with slots when specified", async () => {
        const mockRobot = createMockRobot();
        const mockSlots = {
          soul_chip: { id: "soul-123" },
          skeleton: { id: "skeleton-123" },
          parts: [{ id: "part-1" }, { id: "part-2" }],
          expansions: [{ id: "exp-1" }],
        };
        const mockDbResult = { ...mockRobot, ...mockSlots };

        mockClient.robot.findUnique.mockResolvedValue(mockDbResult);

        const dto = new RobotDto();
        const result = await dto.findById("robot-123", { includeSlots: true });

        expect(mockClient.robot.findUnique).toHaveBeenCalledWith({
          where: { id: "robot-123" },
          include: {
            soul_chip: true,
            skeleton: true,
            parts: true,
            expansions: true,
          },
        });
        expect(result).toBe(dto);
        expect(dto.slots?.soulChip).toEqual(mockSlots.soul_chip);
        expect(dto.slots?.skeleton).toEqual(mockSlots.skeleton);
        expect(dto.slots?.parts).toHaveLength(2);
        expect(dto.slots?.expansions).toHaveLength(1);
      });

      it("should handle not found case", async () => {
        mockClient.robot.findUnique.mockResolvedValue(null);

        const dto = new RobotDto();
        const result = await dto.findById("nonexistent");

        expect(result).toBe(dto);
        expect(dto.robot).toBeUndefined();
      });
    });

    describe("Convenience methods", () => {
      it("should find robot without relationships using findByIdBasic", async () => {
        const mockRobot = createMockRobot();
        mockClient.robot.findUnique.mockResolvedValue(mockRobot);

        const dto = new RobotDto();
        const result = await dto.findByIdBasic("robot-123");

        expect(mockClient.robot.findUnique).toHaveBeenCalledWith({
          where: { id: "robot-123" },
          include: undefined,
        });
        expect(result).toBe(dto);
      });

      it("should find robot with account using findByIdWithAccount", async () => {
        const mockRobot = createMockRobot();
        const mockAccount = { id: "account-123", shard: { shardId: 1 } };
        const mockDbResult = { ...mockRobot, account: mockAccount };

        mockClient.robot.findUnique.mockResolvedValue(mockDbResult);

        const dto = new RobotDto();
        const result = await dto.findByIdWithAccount("robot-123");

        expect(mockClient.robot.findUnique).toHaveBeenCalledWith({
          where: { id: "robot-123" },
          include: { account: { include: { shard: true } } },
        });
        expect(result).toBe(dto);
        expect(dto.account?.playerAccount).toEqual(mockAccount);
      });

      it("should find robot with slots using findByIdWithSlots", async () => {
        const mockRobot = createMockRobot();
        const mockSlots = {
          soul_chip: { id: "soul-123" },
          skeleton: { id: "skeleton-123" },
          parts: [],
          expansions: [],
        };
        const mockDbResult = { ...mockRobot, ...mockSlots };

        mockClient.robot.findUnique.mockResolvedValue(mockDbResult);

        const dto = new RobotDto();
        const result = await dto.findByIdWithSlots("robot-123");

        expect(mockClient.robot.findUnique).toHaveBeenCalledWith({
          where: { id: "robot-123" },
          include: {
            soul_chip: true,
            skeleton: true,
            parts: true,
            expansions: true,
          },
        });
        expect(result).toBe(dto);
        expect(dto.slots).toBeDefined();
      });

      it("should find robot with all relationships using findByIdComplete", async () => {
        const mockRobot = createMockRobot();
        const mockAccount = { id: "account-123", shard: { shardId: 1 } };
        const mockSlots = {
          soul_chip: { id: "soul-123" },
          skeleton: { id: "skeleton-123" },
          parts: [],
          expansions: [],
        };
        const mockDbResult = {
          ...mockRobot,
          account: mockAccount,
          ...mockSlots,
        };

        mockClient.robot.findUnique.mockResolvedValue(mockDbResult);

        const dto = new RobotDto();
        const result = await dto.findByIdComplete("robot-123");

        expect(mockClient.robot.findUnique).toHaveBeenCalledWith({
          where: { id: "robot-123" },
          include: {
            account: { include: { shard: true } },
            soul_chip: true,
            skeleton: true,
            parts: true,
            expansions: true,
          },
        });
        expect(result).toBe(dto);
        expect(dto.account?.playerAccount).toEqual(mockAccount);
        expect(dto.slots).toBeDefined();
      });
    });

    describe("Lazy loading methods", () => {
      it("should lazy load account when robot has playerId", async () => {
        const mockRobot = createMockRobot();
        const mockAccount = { id: "account-123", shard: { shardId: 1 } };

        const dto = new RobotDto(mockRobot);
        mockClient.player_account.findUnique.mockResolvedValue(mockAccount);

        await dto.loadAccount();

        expect(mockClient.player_account.findUnique).toHaveBeenCalledWith({
          where: { globalPlayerId: mockRobot.playerId.toString() },
          include: { shard: true },
        });
        expect(dto.account?.playerAccount).toEqual(mockAccount);
      });

      it("should not load account when already loaded", async () => {
        const mockRobot = createMockRobot();
        const dto = new RobotDto(mockRobot);
        dto.account = { playerAccount: {} } as any;

        await dto.loadAccount();

        expect(mockClient.player_account.findUnique).not.toHaveBeenCalled();
      });

      it("should lazy load slots when robot has ID", async () => {
        const mockRobot = createMockRobot();
        const mockSoulChip = { id: "soul-123" };
        const mockSkeleton = { id: "skeleton-123" };
        const mockParts = [{ id: "part-1" }];
        const mockExpansions = [{ id: "exp-1" }];

        const dto = new RobotDto(mockRobot);
        mockClient.soul_chip_slot.findUnique.mockResolvedValue(mockSoulChip);
        mockClient.skeleton_slot.findUnique.mockResolvedValue(mockSkeleton);
        mockClient.part_slots.findMany.mockResolvedValue(mockParts);
        mockClient.expansion_slot.findMany.mockResolvedValue(mockExpansions);

        await dto.loadSlots();

        expect(mockClient.soul_chip_slot.findUnique).toHaveBeenCalledWith({
          where: { robotId: mockRobot.id },
        });
        expect(mockClient.skeleton_slot.findUnique).toHaveBeenCalledWith({
          where: { robotId: mockRobot.id },
        });
        expect(mockClient.part_slots.findMany).toHaveBeenCalledWith({
          where: { robotId: mockRobot.id },
        });
        expect(mockClient.expansion_slot.findMany).toHaveBeenCalledWith({
          where: { robotId: mockRobot.id },
        });

        expect(dto.slots?.soulChip).toEqual(mockSoulChip);
        expect(dto.slots?.skeleton).toEqual(mockSkeleton);
        expect(dto.slots?.parts).toEqual(mockParts);
        expect(dto.slots?.expansions).toEqual(mockExpansions);
      });

      it("should not load slots when already loaded", async () => {
        const mockRobot = createMockRobot();
        const dto = new RobotDto(mockRobot);
        dto.slots = {};

        await dto.loadSlots();

        expect(mockClient.soul_chip_slot.findUnique).not.toHaveBeenCalled();
        expect(mockClient.skeleton_slot.findUnique).not.toHaveBeenCalled();
        expect(mockClient.part_slots.findMany).not.toHaveBeenCalled();
        expect(mockClient.expansion_slot.findMany).not.toHaveBeenCalled();
      });
    });

    describe("findManyWithOptions", () => {
      it("should find multiple robots with account and slots", async () => {
        const mockRobots = [
          {
            ...createMockRobot({ id: "robot-1" }),
            account: { id: "account-1", shard: { shardId: 1 } },
            soul_chip: { id: "soul-1" },
            skeleton: { id: "skeleton-1" },
            parts: [],
            expansions: [],
          },
          {
            ...createMockRobot({ id: "robot-2" }),
            account: { id: "account-2", shard: { shardId: 1 } },
            soul_chip: { id: "soul-2" },
            skeleton: { id: "skeleton-2" },
            parts: [],
            expansions: [],
          },
        ];

        mockClient.robot.findMany.mockResolvedValue(mockRobots);

        const results = await RobotDto.findManyWithOptions(
          { shardId: 1 },
          { includeAccount: true, includeSlots: true }
        );

        expect(mockClient.robot.findMany).toHaveBeenCalledWith({
          where: { shardId: 1 },
          include: {
            account: { include: { shard: true } },
            soul_chip: true,
            skeleton: true,
            parts: true,
            expansions: true,
          },
          skip: undefined,
          take: undefined,
        });
        expect(results).toHaveLength(2);
        expect(results[0].robot?.id).toBe("robot-1");
        expect(results[0].account?.playerAccount.id).toBe("account-1");
        expect(results[0].slots?.soulChip.id).toBe("soul-1");
      });

      it("should find multiple robots with pagination", async () => {
        const mockRobots = [createMockRobot()];
        mockClient.robot.findMany.mockResolvedValue(mockRobots);

        const results = await RobotDto.findManyWithOptions(
          { nickname: { contains: "Test" } },
          {},
          { skip: 10, take: 5 }
        );

        expect(mockClient.robot.findMany).toHaveBeenCalledWith({
          where: { nickname: { contains: "Test" } },
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
      it("should create new robot successfully", async () => {
        const props = createMockRobot();
        const dto = new RobotDto(props);

        const expectedDbData = {
          id: props.id,
          shardId: props.shardId,
          playerId: props.playerId.toString(),
          nickname: props.nickname,
          createdAt: props.createdAt,
          updatedAt: props.updatedAt,
        };

        mockClient.robot.upsert.mockResolvedValue(expectedDbData);

        const result = await dto.upsert();

        expect(mockClient.robot.upsert).toHaveBeenCalledWith({
          where: { id: props.id },
          update: expectedDbData,
          create: expectedDbData,
        });
        expect(result).toBe(dto);
      });

      it("should update existing robot successfully", async () => {
        const props = createMockRobot({ nickname: "Updated Robot" });
        const dto = new RobotDto(props);

        const expectedDbData = {
          id: props.id,
          shardId: props.shardId,
          playerId: props.playerId.toString(),
          nickname: props.nickname,
          createdAt: props.createdAt,
          updatedAt: props.updatedAt,
        };

        mockClient.robot.upsert.mockResolvedValue(expectedDbData);

        const result = await dto.upsert();

        expect(mockClient.robot.upsert).toHaveBeenCalledWith({
          where: { id: props.id },
          update: expectedDbData,
          create: expectedDbData,
        });
        expect(result).toBe(dto);
      });

      it("should throw error when robot is not set", async () => {
        const dto = new RobotDto();

        await expect(dto.upsert()).rejects.toThrow(
          "Robot is not allowed to be set"
        );
        expect(mockClient.robot.upsert).not.toHaveBeenCalled();
      });

      it("should handle database errors during upsert", async () => {
        const props = createMockRobot();
        const dto = new RobotDto(props);

        const error = new Error("Foreign key constraint violation");
        mockClient.robot.upsert.mockRejectedValue(error);

        await expect(dto.upsert()).rejects.toThrow(
          "Foreign key constraint violation"
        );
      });
    });
  });

  describe("Validation", () => {
    it("should validate successfully with valid data", () => {
      const props = createMockRobot();
      const dto = new RobotDto(props);

      const result = dto.validate();
      expect(result).toBe(dto);
    });

    it("should throw error when validation fails", () => {
      const { validateData } = require("@botking/validator");
      validateData.mockReturnValue({
        success: false,
        error: "Invalid robot data",
      });

      const props = createMockRobot();
      const dto = new RobotDto(props);

      expect(() => dto.validate()).toThrow("Invalid robot data");
    });
  });

  describe("Integration Tests", () => {
    it("should perform complete CRUD cycle with relationships", async () => {
      // Create robot
      const createProps = createMockRobot();
      const createDto = new RobotDto(createProps);

      const expectedDbData = {
        id: createProps.id,
        shardId: createProps.shardId,
        playerId: createProps.playerId.toString(),
        nickname: createProps.nickname,
        createdAt: createProps.createdAt,
        updatedAt: createProps.updatedAt,
      };

      mockClient.robot.upsert.mockResolvedValue(expectedDbData);
      await createDto.upsert();

      // Read robot with all relationships
      const mockAccount = { id: "account-123", shard: { shardId: 1 } };
      const mockSlots = {
        soul_chip: { id: "soul-123" },
        skeleton: { id: "skeleton-123" },
        parts: [{ id: "part-1" }],
        expansions: [{ id: "exp-1" }],
      };
      const mockDbResult = {
        ...createProps,
        account: mockAccount,
        ...mockSlots,
      };
      mockClient.robot.findUnique.mockResolvedValue(mockDbResult);

      const readDto = new RobotDto();
      await readDto.findByIdComplete(createProps.id);

      expect(readDto.robot?.id).toBe(createProps.id);
      expect(readDto.account?.playerAccount).toEqual(mockAccount);
      expect(readDto.slots?.soulChip).toEqual(mockSlots.soul_chip);

      // Update robot
      const updateProps = { ...createProps, nickname: "Updated Robot Name" };
      const updateDto = new RobotDto(updateProps);
      const updatedDbData = {
        ...expectedDbData,
        nickname: "Updated Robot Name",
      };
      mockClient.robot.upsert.mockResolvedValue(updatedDbData);

      await updateDto.upsert();
      expect(mockClient.robot.upsert).toHaveBeenCalledTimes(2);
    });

    it("should handle lazy loading of account and slots", async () => {
      const robotProps = createMockRobot();
      const accountProps = { id: "account-123", shard: { shardId: 1 } };
      const slotsProps = {
        soulChip: { id: "soul-123" },
        skeleton: { id: "skeleton-123" },
        parts: [{ id: "part-1" }],
        expansions: [{ id: "exp-1" }],
      };

      const dto = new RobotDto(robotProps);

      // Lazy load account
      mockClient.player_account.findUnique.mockResolvedValue(accountProps);
      await dto.loadAccount();
      expect(dto.account?.playerAccount).toEqual(accountProps);

      // Lazy load slots
      mockClient.soul_chip_slot.findUnique.mockResolvedValue(
        slotsProps.soulChip
      );
      mockClient.skeleton_slot.findUnique.mockResolvedValue(
        slotsProps.skeleton
      );
      mockClient.part_slots.findMany.mockResolvedValue(slotsProps.parts);
      mockClient.expansion_slot.findMany.mockResolvedValue(
        slotsProps.expansions
      );

      await dto.loadSlots();
      expect(dto.slots?.soulChip).toEqual(slotsProps.soulChip);
      expect(dto.slots?.skeleton).toEqual(slotsProps.skeleton);
      expect(dto.slots?.parts).toEqual(slotsProps.parts);
      expect(dto.slots?.expansions).toEqual(slotsProps.expansions);
    });
  });

  describe("Edge Cases", () => {
    it("should handle empty nickname", () => {
      const props = createMockRobot({ nickname: "" });
      const dto = new RobotDto(props);

      expect(dto.robot?.nickname).toBe("");
    });

    it("should handle special characters in nickname", () => {
      const props = createMockRobot({ nickname: 'Röböt-123 "The Destroyer"!' });
      const dto = new RobotDto(props);

      expect(dto.robot?.nickname).toBe('Röböt-123 "The Destroyer"!');
    });

    it("should handle large player ID values", () => {
      const largePlayerId = "9223372036854775807"; // Max BigInt value
      const props = createMockRobot({ playerId: largePlayerId });
      const dto = new RobotDto(props);

      expect(dto.robot?.playerId).toBe(BigInt(largePlayerId));
    });

    it("should handle robot with no slots", async () => {
      const mockRobot = createMockRobot();
      const mockDbResult = {
        ...mockRobot,
        soul_chip: null,
        skeleton: null,
        parts: [],
        expansions: [],
      };

      mockClient.robot.findUnique.mockResolvedValue(mockDbResult);

      const dto = new RobotDto();
      await dto.findByIdWithSlots("robot-123");

      expect(dto.slots?.soulChip).toBeNull();
      expect(dto.slots?.skeleton).toBeNull();
      expect(dto.slots?.parts).toHaveLength(0);
      expect(dto.slots?.expansions).toHaveLength(0);
    });

    it("should handle different shard IDs", () => {
      const robot1 = new RobotDto(createMockRobot({ shardId: 1 }));
      const robot2 = new RobotDto(createMockRobot({ shardId: 999 }));

      expect(robot1.robot?.shardId).toBe(1);
      expect(robot2.robot?.shardId).toBe(999);
    });
  });
});
