/**
 * Tests for User and Account DTO packages
 */

import { describe, it, expect, beforeEach, vi } from "vitest";
import type { User as PrismaUser, Account as PrismaAccount } from "@botking/db";
import { UserDTOFactory, UserRepository, UserService } from "../user-dto";
import {
  AccountDTOFactory,
  AccountRepository,
  AccountService,
} from "../account-dto";

// Mock Prisma client
const mockPrismaClient = {
  user: {
    findUnique: vi.fn(),
    findMany: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    count: vi.fn(),
  },
  account: {
    findUnique: vi.fn(),
    findMany: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    count: vi.fn(),
  },
};

describe("User DTO Package", () => {
  let mockPrismaUser: PrismaUser;
  let userRepository: UserRepository;
  let userService: UserService;

  beforeEach(() => {
    vi.clearAllMocks();

    mockPrismaUser = {
      id: "user_123",
      email: "test@example.com",
      emailVerified: true,
      name: "Test User",
      image: "https://example.com/avatar.jpg",
      createdAt: new Date("2023-01-01"),
      updatedAt: new Date("2023-01-02"),
    };

    userRepository = new UserRepository(mockPrismaClient);
    userService = new UserService(userRepository);
  });

  describe("UserDTOFactory", () => {
    it("should convert Prisma User to artifact", () => {
      const userArtifact = UserDTOFactory.fromPrismaUser(mockPrismaUser);

      expect(userArtifact.id).toBe("user_123");
      expect(userArtifact.email).toBe("test@example.com");
      expect(userArtifact.emailVerified).toBe(true);
      expect(userArtifact.name).toBe("Test User");
    });

    it("should convert artifact back to Prisma User", () => {
      const userArtifact = UserDTOFactory.fromPrismaUser(mockPrismaUser);
      const backToPrisma = UserDTOFactory.toPrismaUser(userArtifact);

      expect(backToPrisma.id).toBe(mockPrismaUser.id);
      expect(backToPrisma.email).toBe(mockPrismaUser.email);
      expect(backToPrisma.emailVerified).toBe(mockPrismaUser.emailVerified);
      expect(backToPrisma.name).toBe(mockPrismaUser.name);
    });

    it("should batch convert Prisma Users to artifacts", () => {
      const prismaUsers = [
        mockPrismaUser,
        { ...mockPrismaUser, id: "user_456", email: "test2@example.com" },
      ];
      const artifacts = UserDTOFactory.fromPrismaUsers(prismaUsers);

      expect(artifacts).toHaveLength(2);
      expect(artifacts[0].id).toBe("user_123");
      expect(artifacts[1].id).toBe("user_456");
    });

    it("should create demo user", () => {
      const demoUser = UserDTOFactory.createDemoUser("test123");

      expect(demoUser.email).toContain("demo_test123@demo.botking.dev");
      expect(demoUser.emailVerified).toBe(false);
    });

    it("should handle safe conversion failures", () => {
      const invalidUser = { ...mockPrismaUser, email: "" };
      const result = UserDTOFactory.safeFromPrismaUser(invalidUser);

      expect(result.success).toBe(false);
      expect(result.error).toContain("email");
    });
  });

  describe("UserRepository", () => {
    it("should find user by ID", async () => {
      mockPrismaClient.user.findUnique.mockResolvedValue(mockPrismaUser);

      const user = await userRepository.findById("user_123");

      expect(user).not.toBeNull();
      expect(user!.id).toBe("user_123");
      expect(mockPrismaClient.user.findUnique).toHaveBeenCalledWith({
        where: { id: "user_123" },
      });
    });

    it("should return null when user not found", async () => {
      mockPrismaClient.user.findUnique.mockResolvedValue(null);

      const user = await userRepository.findById("nonexistent");

      expect(user).toBeNull();
    });

    it("should find user by email", async () => {
      mockPrismaClient.user.findUnique.mockResolvedValue(mockPrismaUser);

      const user = await userRepository.findByEmail("test@example.com");

      expect(user).not.toBeNull();
      expect(user!.email).toBe("test@example.com");
    });

    it("should create user", async () => {
      const newUserData = {
        email: "new@example.com",
        name: "New User",
        emailVerified: false,
      };

      mockPrismaClient.user.create.mockResolvedValue({
        ...mockPrismaUser,
        email: newUserData.email,
        name: newUserData.name,
        emailVerified: newUserData.emailVerified,
      });

      const user = await userRepository.create(newUserData);

      expect(user.email).toBe("new@example.com");
      expect(user.name).toBe("New User");
      expect(mockPrismaClient.user.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          email: "new@example.com",
          name: "New User",
          emailVerified: false,
        }),
      });
    });

    it("should update user profile", async () => {
      const updateData = { name: "Updated Name" };
      mockPrismaClient.user.update.mockResolvedValue({
        ...mockPrismaUser,
        name: "Updated Name",
        updatedAt: new Date(),
      });

      const user = await userRepository.updateProfile("user_123", updateData);

      expect(user).not.toBeNull();
      expect(user!.name).toBe("Updated Name");
      expect(mockPrismaClient.user.update).toHaveBeenCalledWith({
        where: { id: "user_123" },
        data: expect.objectContaining({
          name: "Updated Name",
        }),
      });
    });

    it("should verify email", async () => {
      mockPrismaClient.user.update.mockResolvedValue({
        ...mockPrismaUser,
        emailVerified: true,
      });

      const user = await userRepository.verifyEmail("user_123");

      expect(user).not.toBeNull();
      expect(user!.emailVerified).toBe(true);
    });

    it("should find verified users", async () => {
      mockPrismaClient.user.findMany.mockResolvedValue([mockPrismaUser]);

      const users = await userRepository.findVerifiedUsers();

      expect(users).toHaveLength(1);
      expect(mockPrismaClient.user.findMany).toHaveBeenCalledWith({
        where: { emailVerified: true },
        orderBy: { createdAt: "desc" },
      });
    });
  });

  describe("UserService", () => {
    it("should create user with validation", async () => {
      const createData = {
        email: "service@example.com",
        name: "Service User",
        emailVerified: false,
      };

      mockPrismaClient.user.create.mockResolvedValue({
        ...mockPrismaUser,
        email: createData.email,
        name: createData.name,
        emailVerified: createData.emailVerified,
      });

      const result = await userService.createUser(createData);

      expect(result.success).toBe(true);
      expect(result.user).toBeDefined();
      expect(result.user!.email).toBe("service@example.com");
      expect(result.errors).toEqual(expect.any(Array));
      expect(result.warnings).toEqual(expect.any(Array));
    });

    it("should get user with insights", async () => {
      mockPrismaClient.user.findUnique.mockResolvedValue(mockPrismaUser);

      const result = await userService.getUserInsights("user_123");

      expect(result.success).toBe(true);
      expect(result.insights).toBeDefined();
      expect(result.insights!.user.id).toBe("user_123");
      expect(result.insights!.validation).toBeDefined();
      expect(result.insights!.recommendations).toEqual(expect.any(Array));
    });

    it("should search users with pagination", async () => {
      mockPrismaClient.user.findMany.mockResolvedValue([mockPrismaUser]);
      mockPrismaClient.user.count.mockResolvedValue(1);

      const result = await userService.searchUsers({
        query: "test",
        page: 1,
        limit: 10,
      });

      expect(result.success).toBe(true);
      expect(result.users).toHaveLength(1);
      expect(result.pagination).toEqual({
        page: 1,
        limit: 10,
        total: 1,
        totalPages: 1,
      });
    });
  });
});

describe("Account DTO Package", () => {
  let mockPrismaAccount: PrismaAccount;
  let accountRepository: AccountRepository;
  let accountService: AccountService;

  beforeEach(() => {
    vi.clearAllMocks();

    mockPrismaAccount = {
      id: "account_123",
      userId: "user_123",
      providerId: "google",
      accountId: "google_user_456",
      password: null,
      accessToken: "access_token_123",
      refreshToken: "refresh_token_123",
      idToken: null,
      accessTokenExpiresAt: new Date(Date.now() + 3600000), // 1 hour from now
      refreshTokenExpiresAt: new Date(Date.now() + 86400000), // 1 day from now
      createdAt: new Date("2023-01-01"),
      updatedAt: new Date("2023-01-02"),
    };

    accountRepository = new AccountRepository(mockPrismaClient);
    accountService = new AccountService(accountRepository);
  });

  describe("AccountDTOFactory", () => {
    it("should convert Prisma Account to artifact", () => {
      const accountArtifact =
        AccountDTOFactory.fromPrismaAccount(mockPrismaAccount);

      expect(accountArtifact.id).toBe("account_123");
      expect(accountArtifact.userId).toBe("user_123");
      expect(accountArtifact.providerId).toBe("google");
      expect(accountArtifact.accessToken).toBe("access_token_123");
    });

    it("should create OAuth account", () => {
      const oauthAccount = AccountDTOFactory.createOAuthAccount(
        "user_123",
        "github",
        "github_user_789",
        { accessToken: "token_123" }
      );

      expect(oauthAccount.providerId).toBe("github");
      expect(oauthAccount.accessToken).toBe("token_123");
    });

    it("should create password account", () => {
      const passwordAccount = AccountDTOFactory.createPasswordAccount(
        "user_123",
        "credentials",
        "user@example.com",
        "hashed_password"
      );

      expect(passwordAccount.providerId).toBe("credentials");
      expect(passwordAccount.password).toBe("hashed_password");
    });

    it("should get safe log data (redacted)", () => {
      const safeData = AccountDTOFactory.getSafeLogData(mockPrismaAccount);

      expect(safeData.id).toBe("account_123");
      expect(safeData.hasAccessToken).toBe(true);
      expect(safeData.hasRefreshToken).toBe(true);
      expect(safeData.accessToken).toBeUndefined(); // Should be redacted
    });
  });

  describe("AccountRepository", () => {
    it("should find account by ID", async () => {
      mockPrismaClient.account.findUnique.mockResolvedValue(mockPrismaAccount);

      const account = await accountRepository.findById("account_123");

      expect(account).not.toBeNull();
      expect(account!.id).toBe("account_123");
    });

    it("should find accounts by user ID", async () => {
      mockPrismaClient.account.findMany.mockResolvedValue([mockPrismaAccount]);

      const accounts = await accountRepository.findByUserId("user_123");

      expect(accounts).toHaveLength(1);
      expect(accounts[0].userId).toBe("user_123");
    });

    it("should find account by provider and account ID", async () => {
      mockPrismaClient.account.findUnique.mockResolvedValue(mockPrismaAccount);

      const account = await accountRepository.findByProviderAccount(
        "google",
        "google_user_456"
      );

      expect(account).not.toBeNull();
      expect(account!.providerId).toBe("google");
      expect(account!.accountId).toBe("google_user_456");
    });

    it("should create account", async () => {
      const newAccountData = {
        userId: "user_123",
        providerId: "facebook",
        accountId: "fb_user_789",
        accessToken: "fb_token_123",
      };

      mockPrismaClient.account.create.mockResolvedValue({
        ...mockPrismaAccount,
        providerId: "facebook",
        accountId: "fb_user_789",
        accessToken: "fb_token_123",
      });

      const account = await accountRepository.create(newAccountData);

      expect(account.providerId).toBe("facebook");
      expect(account.accessToken).toBe("fb_token_123");
    });

    it("should update tokens", async () => {
      const tokens = {
        accessToken: "new_access_token",
        accessTokenExpiresAt: new Date(Date.now() + 7200000), // 2 hours
      };

      mockPrismaClient.account.update.mockResolvedValue({
        ...mockPrismaAccount,
        accessToken: "new_access_token",
        accessTokenExpiresAt: tokens.accessTokenExpiresAt,
      });

      const account = await accountRepository.updateTokens(
        "account_123",
        tokens
      );

      expect(account).not.toBeNull();
      expect(account!.accessToken).toBe("new_access_token");
    });

    it("should find expired tokens", async () => {
      const expiredAccount = {
        ...mockPrismaAccount,
        accessTokenExpiresAt: new Date(Date.now() - 3600000), // 1 hour ago
      };

      mockPrismaClient.account.findMany.mockResolvedValue([expiredAccount]);

      const accounts = await accountRepository.findExpiredTokens("access");

      expect(accounts).toHaveLength(1);
      expect(mockPrismaClient.account.findMany).toHaveBeenCalledWith({
        where: { accessTokenExpiresAt: { lte: expect.any(Date) } },
        orderBy: { createdAt: "desc" },
      });
    });
  });

  describe("AccountService", () => {
    it("should create OAuth account via service", async () => {
      // Mock check for existing account
      mockPrismaClient.account.findUnique.mockResolvedValue(null);

      // Mock account creation
      mockPrismaClient.account.create.mockResolvedValue({
        ...mockPrismaAccount,
        providerId: "twitter",
        accountId: "twitter_user_123",
      });

      const result = await accountService.createOAuthAccount(
        "user_123",
        "twitter",
        "twitter_user_123",
        { accessToken: "twitter_token" }
      );

      expect(result.success).toBe(true);
      expect(result.account).toBeDefined();
      expect(result.account!.providerId).toBe("twitter");
    });

    it("should get user accounts with summary", async () => {
      const accounts = [
        mockPrismaAccount,
        { ...mockPrismaAccount, id: "account_456", providerId: "github" },
      ];

      mockPrismaClient.account.findMany.mockResolvedValue(accounts);

      const result = await accountService.getUserAccounts("user_123");

      expect(result.success).toBe(true);
      expect(result.accounts).toHaveLength(2);
      expect(result.summary).toEqual({
        total: 2,
        byProvider: { google: 1, github: 1 },
        expired: 0,
        needsRefresh: 0,
      });
    });

    it("should prevent duplicate credential accounts", async () => {
      // Mock existing credential account
      mockPrismaClient.account.findMany.mockResolvedValue([
        {
          ...mockPrismaAccount,
          providerId: "credentials",
        },
      ]);

      const result = await accountService.createCredentialAccount(
        "user_123",
        "user@example.com",
        "password"
      );

      expect(result.success).toBe(false);
      expect(result.errors).toContain("User already has a credential account");
    });

    it("should find expired tokens with summary", async () => {
      const expiredAccounts = [
        {
          ...mockPrismaAccount,
          accessTokenExpiresAt: new Date(Date.now() - 3600000),
        },
      ];

      mockPrismaClient.account.findMany.mockResolvedValue(expiredAccounts);

      const result = await accountService.findExpiredTokenAccounts("access");

      expect(result.success).toBe(true);
      expect(result.accounts).toHaveLength(1);
      expect(result.summary).toEqual({
        total: 1,
        byProvider: { google: 1 },
      });
    });
  });
});
