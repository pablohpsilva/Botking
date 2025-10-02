import { describe, it, expect, beforeEach, vi } from "vitest";
import { IdentityLinkDto } from "../identity-link";
import {
  mockClient,
  createMockIdentityLink,
  createMockUser,
  resetAllMocks,
} from "./setup";

describe("IdentityLinkDto", () => {
  beforeEach(() => {
    resetAllMocks();
  });

  describe("Constructor", () => {
    it("should create an empty DTO when no props provided", () => {
      const dto = new IdentityLinkDto();
      expect(dto.identityLink).toBeUndefined();
      expect(dto.user).toBeUndefined();
    });

    it("should create DTO with IdentityLink when props provided", () => {
      const props = createMockIdentityLink();
      const dto = new IdentityLinkDto(props);

      expect(dto.identityLink).toBeDefined();
      expect(dto.identityLink?.id).toBe(props.id);
      expect(dto.identityLink?.authUserId).toBe(props.userId);
      expect(dto.identityLink?.globalPlayerId).toBe(props.globalPlayerId);
    });
  });

  describe("READ Operations", () => {
    describe("findById", () => {
      it("should find identity link by ID without user by default", async () => {
        const mockLink = createMockIdentityLink();
        mockClient.identity_link.findUnique.mockResolvedValue(mockLink);

        const dto = new IdentityLinkDto();
        const result = await dto.findById("link-123");

        expect(mockClient.identity_link.findUnique).toHaveBeenCalledWith({
          where: { id: "link-123" },
          include: undefined,
        });
        expect(result).toBe(dto);
        expect(dto.identityLink?.id).toBe(mockLink.id);
        expect(dto.user).toBeUndefined();
      });

      it("should find identity link by ID with user when specified", async () => {
        const mockLink = createMockIdentityLink();
        const mockUser = createMockUser();
        const mockDbResult = { ...mockLink, user: mockUser };

        mockClient.identity_link.findUnique.mockResolvedValue(mockDbResult);

        const dto = new IdentityLinkDto();
        const result = await dto.findById("link-123", { includeUser: true });

        expect(mockClient.identity_link.findUnique).toHaveBeenCalledWith({
          where: { id: "link-123" },
          include: { user: true },
        });
        expect(result).toBe(dto);
        expect(dto.identityLink?.id).toBe(mockLink.id);
        expect(dto.user?.user).toEqual(mockUser);
      });

      it("should handle not found case", async () => {
        mockClient.identity_link.findUnique.mockResolvedValue(null);

        const dto = new IdentityLinkDto();
        const result = await dto.findById("nonexistent");

        expect(result).toBe(dto);
        expect(dto.identityLink).toBeUndefined();
      });
    });

    describe("findByIdBasic", () => {
      it("should find identity link without user", async () => {
        const mockLink = createMockIdentityLink();
        mockClient.identity_link.findUnique.mockResolvedValue(mockLink);

        const dto = new IdentityLinkDto();
        const result = await dto.findByIdBasic("link-123");

        expect(mockClient.identity_link.findUnique).toHaveBeenCalledWith({
          where: { id: "link-123" },
          include: undefined,
        });
        expect(result).toBe(dto);
      });
    });

    describe("findByIdWithUser", () => {
      it("should find identity link with user", async () => {
        const mockLink = createMockIdentityLink();
        const mockUser = createMockUser();
        const mockDbResult = { ...mockLink, user: mockUser };

        mockClient.identity_link.findUnique.mockResolvedValue(mockDbResult);

        const dto = new IdentityLinkDto();
        const result = await dto.findByIdWithUser("link-123");

        expect(mockClient.identity_link.findUnique).toHaveBeenCalledWith({
          where: { id: "link-123" },
          include: { user: true },
        });
        expect(result).toBe(dto);
        expect(dto.user?.user).toEqual(mockUser);
      });
    });

    describe("loadUser", () => {
      it("should lazy load user when identity link has authUserId", async () => {
        const mockLink = createMockIdentityLink();
        const mockUser = createMockUser();

        const dto = new IdentityLinkDto(mockLink);
        mockClient.user.findUnique.mockResolvedValue(mockUser);

        await dto.loadUser();

        expect(mockClient.user.findUnique).toHaveBeenCalledWith({
          where: { id: mockLink.userId },
          include: undefined,
        });
        expect(dto.user?.user).toEqual(mockUser);
      });

      it("should not load user when already loaded", async () => {
        const mockLink = createMockIdentityLink();
        const dto = new IdentityLinkDto(mockLink);
        dto.user = { user: createMockUser() } as any;

        await dto.loadUser();

        expect(mockClient.user.findUnique).not.toHaveBeenCalled();
      });

      it("should not load user when identity link has no authUserId", async () => {
        const dto = new IdentityLinkDto();

        await dto.loadUser();

        expect(mockClient.user.findUnique).not.toHaveBeenCalled();
      });
    });

    describe("findManyWithOptions", () => {
      it("should find multiple identity links with users", async () => {
        const mockLinks = [
          {
            ...createMockIdentityLink({ id: "link-1" }),
            user: createMockUser({ id: "user-1" }),
          },
          {
            ...createMockIdentityLink({ id: "link-2" }),
            user: createMockUser({ id: "user-2" }),
          },
        ];

        mockClient.identity_link.findMany.mockResolvedValue(mockLinks);

        const results = await IdentityLinkDto.findManyWithOptions(
          { globalPlayerId: "player-123" },
          { includeUser: true }
        );

        expect(mockClient.identity_link.findMany).toHaveBeenCalledWith({
          where: { globalPlayerId: "player-123" },
          include: { user: true },
          skip: undefined,
          take: undefined,
        });
        expect(results).toHaveLength(2);
        expect(results[0].identityLink?.id).toBe("link-1");
        expect(results[0].user?.user?.id).toBe("user-1");
      });

      it("should find multiple identity links with pagination", async () => {
        const mockLinks = [createMockIdentityLink()];
        mockClient.identity_link.findMany.mockResolvedValue(mockLinks);

        const results = await IdentityLinkDto.findManyWithOptions(
          { userId: "user-123" },
          {},
          { skip: 10, take: 5 }
        );

        expect(mockClient.identity_link.findMany).toHaveBeenCalledWith({
          where: { userId: "user-123" },
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
      it("should create new identity link successfully", async () => {
        const props = createMockIdentityLink();
        const dto = new IdentityLinkDto(props);

        const expectedDbData = {
          id: props.id,
          userId: props.userId,
          globalPlayerId: props.globalPlayerId,
          linkedAt: props.linkedAt,
          createdAt: props.createdAt,
          updatedAt: props.updatedAt,
        };

        mockClient.identity_link.upsert.mockResolvedValue(expectedDbData);

        const result = await dto.upsert();

        expect(mockClient.identity_link.upsert).toHaveBeenCalledWith({
          where: { id: props.id },
          update: expectedDbData,
          create: expectedDbData,
        });
        expect(result).toBe(dto);
      });

      it("should update existing identity link successfully", async () => {
        const props = createMockIdentityLink({
          globalPlayerId: "updated-player-123",
        });
        const dto = new IdentityLinkDto(props);

        const expectedDbData = {
          id: props.id,
          userId: props.userId,
          globalPlayerId: props.globalPlayerId,
          linkedAt: props.linkedAt,
          createdAt: props.createdAt,
          updatedAt: props.updatedAt,
        };

        mockClient.identity_link.upsert.mockResolvedValue(expectedDbData);

        const result = await dto.upsert();

        expect(mockClient.identity_link.upsert).toHaveBeenCalledWith({
          where: { id: props.id },
          update: expectedDbData,
          create: expectedDbData,
        });
        expect(result).toBe(dto);
      });

      it("should throw error when identity link is not set", async () => {
        const dto = new IdentityLinkDto();

        await expect(dto.upsert()).rejects.toThrow(
          "Identity link is not allowed to be set"
        );
        expect(mockClient.identity_link.upsert).not.toHaveBeenCalled();
      });

      it("should handle database errors during upsert", async () => {
        const props = createMockIdentityLink();
        const dto = new IdentityLinkDto(props);

        const error = new Error("Foreign key constraint violation");
        mockClient.identity_link.upsert.mockRejectedValue(error);

        await expect(dto.upsert()).rejects.toThrow(
          "Foreign key constraint violation"
        );
      });
    });
  });

  describe("Validation", () => {
    it("should validate successfully with valid data", () => {
      const props = createMockIdentityLink();
      const dto = new IdentityLinkDto(props);

      const result = dto.validate();
      expect(result).toBe(dto);
    });

    it("should throw error when validation fails", () => {
      const { validateData } = require("@botking/validator");
      validateData.mockReturnValue({
        success: false,
        error: "Invalid identity link data",
      });

      const props = createMockIdentityLink();
      const dto = new IdentityLinkDto(props);

      expect(() => dto.validate()).toThrow("Invalid identity link data");
    });
  });

  describe("Integration Tests", () => {
    it("should perform complete CRUD cycle with relationships", async () => {
      // Create identity link
      const createProps = createMockIdentityLink();
      const createDto = new IdentityLinkDto(createProps);

      const expectedDbData = {
        id: createProps.id,
        userId: createProps.userId,
        globalPlayerId: createProps.globalPlayerId,
        linkedAt: createProps.linkedAt,
        createdAt: createProps.createdAt,
        updatedAt: createProps.updatedAt,
      };

      mockClient.identity_link.upsert.mockResolvedValue(expectedDbData);
      await createDto.upsert();

      // Read identity link with user
      const mockUser = createMockUser();
      const mockDbResult = { ...createProps, user: mockUser };
      mockClient.identity_link.findUnique.mockResolvedValue(mockDbResult);

      const readDto = new IdentityLinkDto();
      await readDto.findByIdWithUser(createProps.id!);

      expect(readDto.identityLink?.id).toBe(createProps.id);
      expect(readDto.user?.user).toEqual(mockUser);

      // Update identity link
      const updateProps = {
        ...createProps,
        globalPlayerId: "updated-player-456",
      };
      const updateDto = new IdentityLinkDto(updateProps);
      const updatedDbData = {
        ...expectedDbData,
        globalPlayerId: "updated-player-456",
      };
      mockClient.identity_link.upsert.mockResolvedValue(updatedDbData);

      await updateDto.upsert();
      expect(mockClient.identity_link.upsert).toHaveBeenCalledTimes(2);
    });

    it("should handle lazy loading of user", async () => {
      const linkProps = createMockIdentityLink();
      const userProps = createMockUser();

      const dto = new IdentityLinkDto(linkProps);
      mockClient.user.findUnique.mockResolvedValue(userProps);

      await dto.loadUser();
      expect(dto.user?.user).toEqual(userProps);
    });
  });

  describe("Edge Cases", () => {
    it("should handle undefined ID in constructor", () => {
      const props = createMockIdentityLink();
      delete props.id;

      const dto = new IdentityLinkDto(props);
      expect(dto.identityLink?.id).toBeUndefined();
    });

    it("should handle empty string values", () => {
      const props = createMockIdentityLink({
        userId: "",
        globalPlayerId: "",
      });
      const dto = new IdentityLinkDto(props);

      expect(dto.identityLink?.authUserId).toBe("");
      expect(dto.identityLink?.globalPlayerId).toBe("");
    });

    it("should handle different date formats for linkedAt", () => {
      const linkedDate = new Date("2023-06-15T10:30:00.000Z");
      const props = createMockIdentityLink({ linkedAt: linkedDate });
      const dto = new IdentityLinkDto(props);

      expect(dto.identityLink?.linkedAt).toBe(linkedDate);
    });

    it("should handle identity link with no user relationship", async () => {
      const mockLink = createMockIdentityLink();
      const mockDbResult = { ...mockLink, user: null };

      mockClient.identity_link.findUnique.mockResolvedValue(mockDbResult);

      const dto = new IdentityLinkDto();
      await dto.findByIdWithUser("link-123");

      expect(dto.identityLink?.id).toBe(mockLink.id);
      expect(dto.user).toBeUndefined();
    });

    it("should handle multiple identity links for same user", async () => {
      const userId = "user-123";
      const mockLinks = [
        {
          ...createMockIdentityLink({
            id: "link-1",
            userId,
            globalPlayerId: "player-1",
          }),
          user: createMockUser({ id: userId }),
        },
        {
          ...createMockIdentityLink({
            id: "link-2",
            userId,
            globalPlayerId: "player-2",
          }),
          user: createMockUser({ id: userId }),
        },
        {
          ...createMockIdentityLink({
            id: "link-3",
            userId,
            globalPlayerId: "player-3",
          }),
          user: createMockUser({ id: userId }),
        },
      ];

      mockClient.identity_link.findMany.mockResolvedValue(mockLinks);

      const results = await IdentityLinkDto.findManyWithOptions(
        { userId },
        { includeUser: true }
      );

      expect(results).toHaveLength(3);
      expect(results.map((link) => link.identityLink?.globalPlayerId)).toEqual([
        "player-1",
        "player-2",
        "player-3",
      ]);
      expect(results.every((link) => link.user?.user?.id === userId)).toBe(
        true
      );
    });

    it("should handle special characters in globalPlayerId", () => {
      const props = createMockIdentityLink({
        globalPlayerId: "player_123-test@domain.com",
      });
      const dto = new IdentityLinkDto(props);

      expect(dto.identityLink?.globalPlayerId).toBe(
        "player_123-test@domain.com"
      );
    });
  });
});
