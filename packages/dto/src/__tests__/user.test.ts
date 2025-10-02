import { describe, it, expect, beforeEach, vi } from "vitest";
import { UserDto } from "../user";
import {
  mockClient,
  mockValidateData,
  createMockUser,
  createMockIdentityLink,
  resetAllMocks,
} from "./setup";

describe("UserDto", () => {
  beforeEach(() => {
    resetAllMocks();
  });

  describe("Constructor", () => {
    it("should create an empty DTO when no props provided", () => {
      const dto = new UserDto();
      expect(dto.user).toBeUndefined();
      expect(dto.identityLinks).toBeUndefined();
    });

    it("should create DTO with User when props provided", () => {
      const props = createMockUser();
      const dto = new UserDto(props);

      expect(dto.user).toBeDefined();
      expect(dto.user?.id).toBe(props.id);
      expect(dto.user?.name).toBe(props.name);
      expect(dto.user?.email).toBe(props.email);
    });
  });

  describe("READ Operations", () => {
    describe("findById", () => {
      it("should find user by ID without relationships by default", async () => {
        const mockUser = createMockUser();
        mockClient.user.findUnique.mockResolvedValue(mockUser);

        const dto = new UserDto();
        const result = await dto.findById("user-123");

        expect(mockClient.user.findUnique).toHaveBeenCalledWith({
          where: { id: "user-123" },
          include: undefined,
        });
        expect(result).toBe(dto);
        expect(dto.user?.id).toBe(mockUser.id);
        expect(dto.identityLinks).toBeUndefined();
      });

      it("should find user by ID with identity links when specified", async () => {
        const mockUser = createMockUser();
        const mockLinks = [createMockIdentityLink()];
        const mockDbResult = { ...mockUser, links: mockLinks };

        mockClient.user.findUnique.mockResolvedValue(mockDbResult);

        const dto = new UserDto();
        const result = await dto.findById("user-123", {
          includeIdentityLinks: true,
        });

        expect(mockClient.user.findUnique).toHaveBeenCalledWith({
          where: { id: "user-123" },
          include: { links: true },
        });
        expect(result).toBe(dto);
        expect(dto.user?.id).toBe(mockUser.id);
        expect(dto.identityLinks).toHaveLength(1);
        expect(dto.identityLinks?.[0].identityLink?.id).toBe(mockLinks[0].id);
      });

      it("should handle not found case", async () => {
        mockClient.user.findUnique.mockResolvedValue(null);

        const dto = new UserDto();
        const result = await dto.findById("nonexistent");

        expect(result).toBe(dto);
        expect(dto.user).toBeUndefined();
      });
    });

    describe("findByIdBasic", () => {
      it("should find user without relationships", async () => {
        const mockUser = createMockUser();
        mockClient.user.findUnique.mockResolvedValue(mockUser);

        const dto = new UserDto();
        const result = await dto.findByIdBasic("user-123");

        expect(mockClient.user.findUnique).toHaveBeenCalledWith({
          where: { id: "user-123" },
          include: undefined,
        });
        expect(result).toBe(dto);
      });
    });

    describe("findByIdWithLinks", () => {
      it("should find user with identity links", async () => {
        const mockUser = createMockUser();
        const mockLinks = [createMockIdentityLink()];
        const mockDbResult = { ...mockUser, links: mockLinks };

        mockClient.user.findUnique.mockResolvedValue(mockDbResult);

        const dto = new UserDto();
        const result = await dto.findByIdWithLinks("user-123");

        expect(mockClient.user.findUnique).toHaveBeenCalledWith({
          where: { id: "user-123" },
          include: { links: true },
        });
        expect(result).toBe(dto);
        expect(dto.identityLinks).toHaveLength(1);
      });
    });

    describe("loadIdentityLinks", () => {
      it("should lazy load identity links when user has ID", async () => {
        const mockUser = createMockUser();
        const mockLinks = [createMockIdentityLink()];

        const dto = new UserDto(mockUser);
        mockClient.identity_link.findMany.mockResolvedValue(mockLinks);

        await dto.loadIdentityLinks();

        expect(mockClient.identity_link.findMany).toHaveBeenCalledWith({
          where: { userId: mockUser.id },
        });
        expect(dto.identityLinks).toHaveLength(1);
        expect(dto.identityLinks?.[0].identityLink?.id).toBe(mockLinks[0].id);
      });

      it("should not load identity links when already loaded", async () => {
        const mockUser = createMockUser();
        const dto = new UserDto(mockUser);
        dto.identityLinks = [];

        await dto.loadIdentityLinks();

        expect(mockClient.identity_link.findMany).not.toHaveBeenCalled();
      });

      it("should not load identity links when user has no ID", async () => {
        const dto = new UserDto();

        await dto.loadIdentityLinks();

        expect(mockClient.identity_link.findMany).not.toHaveBeenCalled();
      });
    });

    describe("findManyWithOptions", () => {
      it("should find multiple users with identity links", async () => {
        const mockUsers = [
          {
            ...createMockUser({ id: "user-1" }),
            links: [createMockIdentityLink({ id: "link-1" })],
          },
          {
            ...createMockUser({ id: "user-2" }),
            links: [createMockIdentityLink({ id: "link-2" })],
          },
        ];

        mockClient.user.findMany.mockResolvedValue(mockUsers);

        const results = await UserDto.findManyWithOptions(
          { name: { contains: "Test" } },
          { includeIdentityLinks: true }
        );

        expect(mockClient.user.findMany).toHaveBeenCalledWith({
          where: { name: { contains: "Test" } },
          include: { links: true },
          skip: undefined,
          take: undefined,
        });
        expect(results).toHaveLength(2);
        expect(results[0].user?.id).toBe("user-1");
        expect(results[0].identityLinks).toHaveLength(1);
      });

      it("should find multiple users with pagination", async () => {
        const mockUsers = [createMockUser()];
        mockClient.user.findMany.mockResolvedValue(mockUsers);

        const results = await UserDto.findManyWithOptions(
          { email: { endsWith: "@example.com" } },
          {},
          { skip: 10, take: 5 }
        );

        expect(mockClient.user.findMany).toHaveBeenCalledWith({
          where: { email: { endsWith: "@example.com" } },
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
      it("should create new user successfully", async () => {
        const props = createMockUser();
        const dto = new UserDto(props);

        mockClient.user.upsert.mockResolvedValue(props);

        const result = await dto.upsert();

        expect(mockClient.user.upsert).toHaveBeenCalledWith({
          where: { id: props.id },
          update: dto.user,
          create: dto.user,
        });
        expect(result).toBe(dto);
      });

      it("should update existing user successfully", async () => {
        const props = createMockUser({ name: "Updated User" });
        const dto = new UserDto(props);

        mockClient.user.upsert.mockResolvedValue(props);

        const result = await dto.upsert();

        expect(mockClient.user.upsert).toHaveBeenCalledWith({
          where: { id: props.id },
          update: dto.user,
          create: dto.user,
        });
        expect(result).toBe(dto);
      });

      it("should throw error when user is not set", async () => {
        const dto = new UserDto();

        await expect(dto.upsert()).rejects.toThrow(
          "User pack is not allowed to be set"
        );
        expect(mockClient.user.upsert).not.toHaveBeenCalled();
      });

      it("should handle database errors during upsert", async () => {
        const props = createMockUser();
        const dto = new UserDto(props);

        const error = new Error("Email already exists");
        mockClient.user.upsert.mockRejectedValue(error);

        await expect(dto.upsert()).rejects.toThrow("Email already exists");
      });
    });
  });

  describe("Validation", () => {
    it("should validate successfully with valid data", () => {
      const props = createMockUser();
      const dto = new UserDto(props);

      const result = dto.validate();
      expect(result).toBe(dto);
    });

    it("should throw error when validation fails", () => {
      mockValidateData.mockReturnValue({
        success: false,
        error: "Invalid email format",
      });

      const props = createMockUser();
      const dto = new UserDto(props);

      expect(() => dto.validate()).toThrow("Invalid email format");
    });
  });

  describe("Integration Tests", () => {
    it("should perform complete CRUD cycle with relationships", async () => {
      // Create user
      const createProps = createMockUser();
      const createDto = new UserDto(createProps);
      mockClient.user.upsert.mockResolvedValue(createProps);

      await createDto.upsert();

      // Read user with identity links
      const mockLinks = [createMockIdentityLink()];
      const mockDbResult = { ...createProps, links: mockLinks };
      mockClient.user.findUnique.mockResolvedValue(mockDbResult);

      const readDto = new UserDto();
      await readDto.findByIdWithLinks(createProps.id!);

      expect(readDto.user?.id).toBe(createProps.id);
      expect(readDto.identityLinks).toHaveLength(1);

      // Update user
      const updateProps = { ...createProps, name: "Updated User Name" };
      const updateDto = new UserDto(updateProps);
      mockClient.user.upsert.mockResolvedValue(updateProps);

      await updateDto.upsert();
      expect(mockClient.user.upsert).toHaveBeenCalledTimes(2);
    });

    it("should handle lazy loading of identity links", async () => {
      const userProps = createMockUser();
      const linkProps = [createMockIdentityLink()];

      const dto = new UserDto(userProps);
      mockClient.identity_link.findMany.mockResolvedValue(linkProps);

      await dto.loadIdentityLinks();
      expect(dto.identityLinks).toHaveLength(1);
      expect(dto.identityLinks?.[0].identityLink?.id).toBe(linkProps[0].id);
    });
  });

  describe("Edge Cases", () => {
    it("should handle empty name and email", () => {
      const props = createMockUser({ name: "", email: "" });
      const dto = new UserDto(props);

      expect(dto.user?.name).toBe("");
      expect(dto.user?.email).toBe("");
    });

    it("should handle special characters in name and email", () => {
      const props = createMockUser({
        name: "José María O'Connor-Smith",
        email: "test+tag@sub.domain.co.uk",
      });
      const dto = new UserDto(props);

      expect(dto.user?.name).toBe("José María O'Connor-Smith");
      expect(dto.user?.email).toBe("test+tag@sub.domain.co.uk");
    });

    it("should handle user with no identity links", async () => {
      const mockUser = createMockUser();
      const mockDbResult = { ...mockUser, links: [] };

      mockClient.user.findUnique.mockResolvedValue(mockDbResult);

      const dto = new UserDto();
      await dto.findByIdWithLinks("user-123");

      expect(dto.identityLinks).toHaveLength(0);
    });

    it("should handle user with multiple identity links", async () => {
      const mockUser = createMockUser();
      const mockLinks = [
        createMockIdentityLink({ id: "link-1", globalPlayerId: "player-1" }),
        createMockIdentityLink({ id: "link-2", globalPlayerId: "player-2" }),
        createMockIdentityLink({ id: "link-3", globalPlayerId: "player-3" }),
      ];
      const mockDbResult = { ...mockUser, links: mockLinks };

      mockClient.user.findUnique.mockResolvedValue(mockDbResult);

      const dto = new UserDto();
      await dto.findByIdWithLinks("user-123");

      expect(dto.identityLinks).toHaveLength(3);
      expect(
        dto.identityLinks?.map((link) => link.identityLink?.globalPlayerId)
      ).toEqual(["player-1", "player-2", "player-3"]);
    });

    it("should handle undefined ID in constructor", () => {
      const dto = new UserDto();
      expect(dto.user).toBeUndefined();
    });
  });
});
