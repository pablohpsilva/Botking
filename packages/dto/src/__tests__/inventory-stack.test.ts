import { describe, it, expect, beforeEach, vi } from "vitest";
import { InventoryStackDto } from "../inventory-stack";
import {
  mockClient,
  createMockInventoryStack,
  createMockTemplate,
  createMockPlayerAccount,
  resetAllMocks,
} from "./setup";

describe("InventoryStackDto", () => {
  beforeEach(() => {
    resetAllMocks();
  });

  describe("Constructor", () => {
    it("should create an empty DTO when no props provided", () => {
      const dto = new InventoryStackDto();
      expect(dto.inventoryStack).toBeUndefined();
      expect(dto.template).toBeUndefined();
      expect(dto.account).toBeUndefined();
    });

    it("should create DTO with InventoryStack when props provided", () => {
      const props = createMockInventoryStack();
      const dto = new InventoryStackDto(props);

      expect(dto.inventoryStack).toBeDefined();
      expect(dto.inventoryStack?.id).toBe(props.id);
      expect(dto.inventoryStack?.templateId).toBe(props.templateId);
      expect(dto.inventoryStack?.quantity).toBe(BigInt(props.quantity));
      expect(dto.inventoryStack?.playerId).toBe(BigInt(props.playerId));
    });
  });

  describe("READ Operations", () => {
    describe("findById", () => {
      it("should find inventory stack by ID without relationships by default", async () => {
        const mockStack = createMockInventoryStack();
        mockClient.inventory_stack.findUnique.mockResolvedValue(mockStack);

        const dto = new InventoryStackDto();
        const result = await dto.findById("stack-123");

        expect(mockClient.inventory_stack.findUnique).toHaveBeenCalledWith({
          where: { id: "stack-123" },
          include: undefined,
        });
        expect(result).toBe(dto);
        expect(dto.inventoryStack?.id).toBe(mockStack.id);
        expect(dto.template).toBeUndefined();
        expect(dto.account).toBeUndefined();
      });

      it("should find inventory stack by ID with template when specified", async () => {
        const mockStack = createMockInventoryStack();
        const mockTemplate = createMockTemplate();
        const mockDbResult = { ...mockStack, template: mockTemplate };

        mockClient.inventory_stack.findUnique.mockResolvedValue(mockDbResult);

        const dto = new InventoryStackDto();
        const result = await dto.findById("stack-123", {
          includeTemplate: true,
        });

        expect(mockClient.inventory_stack.findUnique).toHaveBeenCalledWith({
          where: { id: "stack-123" },
          include: { template: true },
        });
        expect(result).toBe(dto);
        expect(dto.template?.template).toEqual(mockTemplate);
      });

      it("should find inventory stack by ID with account when specified", async () => {
        const mockStack = createMockInventoryStack();
        const mockAccount = {
          ...createMockPlayerAccount(),
          shard: { shardId: 1 },
        };
        const mockDbResult = { ...mockStack, account: mockAccount };

        mockClient.inventory_stack.findUnique.mockResolvedValue(mockDbResult);

        const dto = new InventoryStackDto();
        const result = await dto.findById("stack-123", {
          includeAccount: true,
        });

        expect(mockClient.inventory_stack.findUnique).toHaveBeenCalledWith({
          where: { id: "stack-123" },
          include: { account: { include: { shard: true } } },
        });
        expect(result).toBe(dto);
        expect(dto.account?.playerAccount).toEqual(mockAccount);
      });

      it("should handle not found case", async () => {
        mockClient.inventory_stack.findUnique.mockResolvedValue(null);

        const dto = new InventoryStackDto();
        const result = await dto.findById("nonexistent");

        expect(result).toBe(dto);
        expect(dto.inventoryStack).toBeUndefined();
      });
    });

    describe("Convenience methods", () => {
      it("should find inventory stack without relationships using findByIdBasic", async () => {
        const mockStack = createMockInventoryStack();
        mockClient.inventory_stack.findUnique.mockResolvedValue(mockStack);

        const dto = new InventoryStackDto();
        const result = await dto.findByIdBasic("stack-123");

        expect(mockClient.inventory_stack.findUnique).toHaveBeenCalledWith({
          where: { id: "stack-123" },
          include: undefined,
        });
        expect(result).toBe(dto);
      });

      it("should find inventory stack with template using findByIdWithTemplate", async () => {
        const mockStack = createMockInventoryStack();
        const mockTemplate = createMockTemplate();
        const mockDbResult = { ...mockStack, template: mockTemplate };

        mockClient.inventory_stack.findUnique.mockResolvedValue(mockDbResult);

        const dto = new InventoryStackDto();
        const result = await dto.findByIdWithTemplate("stack-123");

        expect(mockClient.inventory_stack.findUnique).toHaveBeenCalledWith({
          where: { id: "stack-123" },
          include: { template: true },
        });
        expect(result).toBe(dto);
        expect(dto.template?.template).toEqual(mockTemplate);
      });

      it("should find inventory stack for display using findByIdForDisplay", async () => {
        const mockStack = createMockInventoryStack();
        const mockTemplate = createMockTemplate();
        const mockAccount = {
          ...createMockPlayerAccount(),
          shard: { shardId: 1 },
        };
        const mockDbResult = {
          ...mockStack,
          template: mockTemplate,
          account: mockAccount,
        };

        mockClient.inventory_stack.findUnique.mockResolvedValue(mockDbResult);

        const dto = new InventoryStackDto();
        const result = await dto.findByIdForDisplay("stack-123");

        expect(mockClient.inventory_stack.findUnique).toHaveBeenCalledWith({
          where: { id: "stack-123" },
          include: {
            template: true,
            account: { include: { shard: true } },
          },
        });
        expect(result).toBe(dto);
        expect(dto.template?.template).toEqual(mockTemplate);
        expect(dto.account?.playerAccount).toEqual(mockAccount);
      });
    });

    describe("Lazy loading methods", () => {
      it("should lazy load template when inventory stack has templateId", async () => {
        const mockStack = createMockInventoryStack();
        const mockTemplate = createMockTemplate();

        const dto = new InventoryStackDto(mockStack);
        mockClient.template.findUnique.mockResolvedValue(mockTemplate);

        await dto.loadTemplate();

        expect(mockClient.template.findUnique).toHaveBeenCalledWith({
          where: { id: mockStack.templateId },
        });
        expect(dto.template?.template).toEqual(mockTemplate);
      });

      it("should not load template when already loaded", async () => {
        const mockStack = createMockInventoryStack();
        const dto = new InventoryStackDto(mockStack);
        dto.template = { template: createMockTemplate() } as any;

        await dto.loadTemplate();

        expect(mockClient.template.findUnique).not.toHaveBeenCalled();
      });

      it("should lazy load account when inventory stack has playerId", async () => {
        const mockStack = createMockInventoryStack();
        const mockAccount = {
          ...createMockPlayerAccount(),
          shard: { shardId: 1 },
        };

        const dto = new InventoryStackDto(mockStack);
        mockClient.player_account.findUnique.mockResolvedValue(mockAccount);

        await dto.loadAccount();

        expect(mockClient.player_account.findUnique).toHaveBeenCalledWith({
          where: { globalPlayerId: mockStack.playerId.toString() },
          include: { shard: true },
        });
        expect(dto.account?.playerAccount).toEqual(mockAccount);
      });
    });

    describe("findManyWithOptions", () => {
      it("should find multiple inventory stacks with relationships", async () => {
        const mockStacks = [
          {
            ...createMockInventoryStack({ id: "stack-1" }),
            template: createMockTemplate({ id: "template-1" }),
            account: {
              ...createMockPlayerAccount({ id: "account-1" }),
              shard: { shardId: 1 },
            },
          },
        ];

        mockClient.inventory_stack.findMany.mockResolvedValue(mockStacks);

        const results = await InventoryStackDto.findManyWithOptions(
          { shardId: 1 },
          { includeTemplate: true, includeAccount: true }
        );

        expect(mockClient.inventory_stack.findMany).toHaveBeenCalledWith({
          where: { shardId: 1 },
          include: {
            template: true,
            account: { include: { shard: true } },
          },
          skip: undefined,
          take: undefined,
        });
        expect(results).toHaveLength(1);
        expect(results[0].inventoryStack?.id).toBe("stack-1");
        expect(results[0].template?.template?.id).toBe("template-1");
        expect(results[0].account?.playerAccount.id).toBe("account-1");
      });

      it("should find multiple inventory stacks with pagination", async () => {
        const mockStacks = [createMockInventoryStack()];
        mockClient.inventory_stack.findMany.mockResolvedValue(mockStacks);

        const results = await InventoryStackDto.findManyWithOptions(
          { playerId: "12345" },
          {},
          { skip: 10, take: 5 }
        );

        expect(mockClient.inventory_stack.findMany).toHaveBeenCalledWith({
          where: { playerId: "12345" },
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
      it("should create new inventory stack successfully", async () => {
        const props = createMockInventoryStack();
        const dto = new InventoryStackDto(props);

        const expectedDbData = {
          id: props.id,
          shardId: props.shardId,
          playerId: props.playerId.toString(),
          templateId: props.templateId,
          quantity: BigInt(props.quantity),
          createdAt: props.createdAt,
          updatedAt: props.updatedAt,
        };

        mockClient.inventory_stack.upsert.mockResolvedValue(expectedDbData);

        const result = await dto.upsert();

        expect(mockClient.inventory_stack.upsert).toHaveBeenCalledWith({
          where: { id: props.id },
          update: expectedDbData,
          create: expectedDbData,
        });
        expect(result).toBe(dto);
      });

      it("should update existing inventory stack successfully", async () => {
        const props = createMockInventoryStack({ quantity: "25" });
        const dto = new InventoryStackDto(props);

        const expectedDbData = {
          id: props.id,
          shardId: props.shardId,
          playerId: props.playerId.toString(),
          templateId: props.templateId,
          quantity: BigInt(props.quantity),
          createdAt: props.createdAt,
          updatedAt: props.updatedAt,
        };

        mockClient.inventory_stack.upsert.mockResolvedValue(expectedDbData);

        const result = await dto.upsert();

        expect(mockClient.inventory_stack.upsert).toHaveBeenCalledWith({
          where: { id: props.id },
          update: expectedDbData,
          create: expectedDbData,
        });
        expect(result).toBe(dto);
      });

      it("should throw error when inventory stack is not set", async () => {
        const dto = new InventoryStackDto();

        await expect(dto.upsert()).rejects.toThrow(
          "Inventory stack is not allowed to be set"
        );
        expect(mockClient.inventory_stack.upsert).not.toHaveBeenCalled();
      });

      it("should handle database errors during upsert", async () => {
        const props = createMockInventoryStack();
        const dto = new InventoryStackDto(props);

        const error = new Error("Foreign key constraint violation");
        mockClient.inventory_stack.upsert.mockRejectedValue(error);

        await expect(dto.upsert()).rejects.toThrow(
          "Foreign key constraint violation"
        );
      });
    });
  });

  describe("Validation", () => {
    it("should validate successfully with valid data", () => {
      const props = createMockInventoryStack();
      const dto = new InventoryStackDto(props);

      const result = dto.validate();
      expect(result).toBe(dto);
    });

    it("should throw error when validation fails", () => {
      const { validateData } = require("@botking/validator");
      validateData.mockReturnValue({
        success: false,
        error: "Invalid inventory stack data",
      });

      const props = createMockInventoryStack();
      const dto = new InventoryStackDto(props);

      expect(() => dto.validate()).toThrow("Invalid inventory stack data");
    });
  });

  describe("Integration Tests", () => {
    it("should perform complete CRUD cycle with relationships", async () => {
      // Create inventory stack
      const createProps = createMockInventoryStack();
      const createDto = new InventoryStackDto(createProps);

      const expectedDbData = {
        id: createProps.id,
        shardId: createProps.shardId,
        playerId: createProps.playerId.toString(),
        templateId: createProps.templateId,
        quantity: BigInt(createProps.quantity),
        createdAt: createProps.createdAt,
        updatedAt: createProps.updatedAt,
      };

      mockClient.inventory_stack.upsert.mockResolvedValue(expectedDbData);
      await createDto.upsert();

      // Read inventory stack with all relationships
      const mockTemplate = createMockTemplate();
      const mockAccount = {
        ...createMockPlayerAccount(),
        shard: { shardId: 1 },
      };
      const mockDbResult = {
        ...createProps,
        template: mockTemplate,
        account: mockAccount,
      };
      mockClient.inventory_stack.findUnique.mockResolvedValue(mockDbResult);

      const readDto = new InventoryStackDto();
      await readDto.findByIdForDisplay(createProps.id);

      expect(readDto.inventoryStack?.id).toBe(createProps.id);
      expect(readDto.template?.template).toEqual(mockTemplate);
      expect(readDto.account?.playerAccount).toEqual(mockAccount);

      // Update inventory stack
      const updateProps = { ...createProps, quantity: "50" };
      const updateDto = new InventoryStackDto(updateProps);
      const updatedDbData = { ...expectedDbData, quantity: BigInt("50") };
      mockClient.inventory_stack.upsert.mockResolvedValue(updatedDbData);

      await updateDto.upsert();
      expect(mockClient.inventory_stack.upsert).toHaveBeenCalledTimes(2);
    });

    it("should handle lazy loading of template and account", async () => {
      const stackProps = createMockInventoryStack();
      const templateProps = createMockTemplate();
      const accountProps = {
        ...createMockPlayerAccount(),
        shard: { shardId: 1 },
      };

      const dto = new InventoryStackDto(stackProps);

      // Lazy load template
      mockClient.template.findUnique.mockResolvedValue(templateProps);
      await dto.loadTemplate();
      expect(dto.template?.template).toEqual(templateProps);

      // Lazy load account
      mockClient.player_account.findUnique.mockResolvedValue(accountProps);
      await dto.loadAccount();
      expect(dto.account?.playerAccount).toEqual(accountProps);
    });
  });

  describe("Edge Cases", () => {
    it("should handle zero quantity", () => {
      const props = createMockInventoryStack({ quantity: "0" });
      const dto = new InventoryStackDto(props);

      expect(dto.inventoryStack?.quantity).toBe(BigInt(0));
    });

    it("should handle large quantity values", () => {
      const largeQuantity = "9223372036854775807"; // Max BigInt value
      const props = createMockInventoryStack({ quantity: largeQuantity });
      const dto = new InventoryStackDto(props);

      expect(dto.inventoryStack?.quantity).toBe(BigInt(largeQuantity));
    });

    it("should handle large player ID values", () => {
      const largePlayerId = "9223372036854775807"; // Max BigInt value
      const props = createMockInventoryStack({ playerId: largePlayerId });
      const dto = new InventoryStackDto(props);

      expect(dto.inventoryStack?.playerId).toBe(BigInt(largePlayerId));
    });

    it("should handle different shard IDs", () => {
      const stack1 = new InventoryStackDto(
        createMockInventoryStack({ shardId: 1 })
      );
      const stack2 = new InventoryStackDto(
        createMockInventoryStack({ shardId: 999 })
      );

      expect(stack1.inventoryStack?.shardId).toBe(1);
      expect(stack2.inventoryStack?.shardId).toBe(999);
    });

    it("should handle inventory stack with no template relationship", async () => {
      const mockStack = createMockInventoryStack();
      const mockDbResult = { ...mockStack, template: null };

      mockClient.inventory_stack.findUnique.mockResolvedValue(mockDbResult);

      const dto = new InventoryStackDto();
      await dto.findByIdWithTemplate("stack-123");

      expect(dto.inventoryStack?.id).toBe(mockStack.id);
      expect(dto.template).toBeUndefined();
    });

    it("should handle inventory stack with no account relationship", async () => {
      const mockStack = createMockInventoryStack();
      const mockDbResult = { ...mockStack, account: null };

      mockClient.inventory_stack.findUnique.mockResolvedValue(mockDbResult);

      const dto = new InventoryStackDto();
      await dto.findByIdForDisplay("stack-123");

      expect(dto.inventoryStack?.id).toBe(mockStack.id);
      expect(dto.account).toBeUndefined();
    });

    it("should handle undefined ID in constructor", () => {
      const props = createMockInventoryStack();
      delete props.id;

      const dto = new InventoryStackDto(props);
      expect(dto.inventoryStack?.id).toBeUndefined();
    });
  });
});
