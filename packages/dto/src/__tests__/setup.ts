/**
 * Test setup file for DTO tests
 * Provides mock implementations and test utilities
 */

import { vi } from "vitest";

// Create mock client with all database operations
const mockClient = {
  user: {
    findUnique: vi.fn(),
    findMany: vi.fn(),
    upsert: vi.fn(),
  },
  asset_pack: {
    findUnique: vi.fn(),
    findMany: vi.fn(),
    upsert: vi.fn(),
  },
  asset: {
    findUnique: vi.fn(),
    findMany: vi.fn(),
    upsert: vi.fn(),
  },
  robot: {
    findUnique: vi.fn(),
    findMany: vi.fn(),
    upsert: vi.fn(),
  },
  template: {
    findUnique: vi.fn(),
    findMany: vi.fn(),
    upsert: vi.fn(),
  },
  shard: {
    findUnique: vi.fn(),
    findMany: vi.fn(),
    upsert: vi.fn(),
  },
  identity_link: {
    findUnique: vi.fn(),
    findMany: vi.fn(),
    upsert: vi.fn(),
  },
  instance: {
    findUnique: vi.fn(),
    findMany: vi.fn(),
    upsert: vi.fn(),
  },
  expansion_slot: {
    findUnique: vi.fn(),
    findMany: vi.fn(),
    upsert: vi.fn(),
  },
  inventory_stack: {
    findUnique: vi.fn(),
    findMany: vi.fn(),
    upsert: vi.fn(),
  },
  item_template_asset: {
    findUnique: vi.fn(),
    findMany: vi.fn(),
    upsert: vi.fn(),
  },
  part_slots: {
    findUnique: vi.fn(),
    findMany: vi.fn(),
    upsert: vi.fn(),
  },
  player_account: {
    findUnique: vi.fn(),
    findMany: vi.fn(),
    upsert: vi.fn(),
  },
  skeleton_slot: {
    findUnique: vi.fn(),
    findMany: vi.fn(),
    upsert: vi.fn(),
  },
  soul_chip_slot: {
    findUnique: vi.fn(),
    findMany: vi.fn(),
    upsert: vi.fn(),
  },
};

// Create mock validate function
const mockValidateData = vi.fn(() => ({ success: true }));

// Mock the connection manager module
vi.mock("@botking/db", () => ({
  connectionManager: {
    getClient: vi.fn(() => mockClient),
  },
  asset_kind: {
    IMAGE: "IMAGE",
    AUDIO: "AUDIO",
    VIDEO: "VIDEO",
  },
  item_class: {
    SOUL_CHIP: "SOUL_CHIP",
    SKELETON: "SKELETON",
    PART: "PART",
    EXPANSION: "EXPANSION",
  },
  instance_state: {
    ACTIVE: "ACTIVE",
    INACTIVE: "INACTIVE",
    DESTROYED: "DESTROYED",
  },
  robot_part_slot: {
    LEFT_ARM: "LEFT_ARM",
    RIGHT_ARM: "RIGHT_ARM",
    LEFT_LEG: "LEFT_LEG",
    RIGHT_LEG: "RIGHT_LEG",
  },
}));

// Mock the validator module
vi.mock("@botking/validator", () => ({
  validateData: mockValidateData,
  UserSchema: {},
  AssetPackSchema: {},
  AssetSchema: {},
  RobotSchema: {},
  TemplateSchema: {},
  ShardSchema: {},
  IdentityLinkSchema: {},
  InstanceSchema: {},
  ExpansionSlotSchema: {},
  InventoryStackSchema: {},
  ItemTemplateAssetSchema: {},
  PartsSlotSchema: {},
  PlayerAccountSchema: {},
  SkeletonSlotSchema: {},
  SoulChipSlotSchema: {},
}));

// Export mock client and validate function for use in tests
export { mockClient, mockValidateData };

// Test data factories
export const createMockUser = (overrides = {}) => ({
  id: "user-123",
  name: "Test User",
  email: "test@example.com",
  createdAt: new Date("2023-01-01"),
  updatedAt: new Date("2023-01-01"),
  ...overrides,
});

export const createMockAssetPack = (overrides = {}) => ({
  id: "pack-123",
  name: "Test Pack",
  version: "1.0.0",
  createdAt: new Date("2023-01-01"),
  updatedAt: new Date("2023-01-01"),
  ...overrides,
});

export const createMockAsset = (overrides = {}) => ({
  id: "asset-123",
  packId: "pack-123",
  kind: "IMAGE",
  url: "https://example.com/image.png",
  width: 100,
  height: 100,
  variant: "default",
  meta: {},
  createdAt: new Date("2023-01-01"),
  updatedAt: new Date("2023-01-01"),
  ...overrides,
});

export const createMockRobot = (overrides = {}) => ({
  id: "robot-123",
  shardId: 1,
  playerId: "12345",
  nickname: "Test Robot",
  createdAt: new Date("2023-01-01"),
  updatedAt: new Date("2023-01-01"),
  ...overrides,
});

export const createMockTemplate = (overrides = {}) => ({
  id: "template-123",
  itemClass: "SOUL_CHIP",
  name: "Test Template",
  slug: "test-template",
  meta: {},
  createdAt: new Date("2023-01-01"),
  updatedAt: new Date("2023-01-01"),
  ...overrides,
});

export const createMockShard = (overrides = {}) => ({
  shardId: 1,
  createdAt: new Date("2023-01-01"),
  updatedAt: new Date("2023-01-01"),
  ...overrides,
});

export const createMockIdentityLink = (overrides = {}) => ({
  id: "link-123",
  userId: "user-123",
  globalPlayerId: "player-123",
  linkedAt: new Date("2023-01-01"),
  createdAt: new Date("2023-01-01"),
  updatedAt: new Date("2023-01-01"),
  ...overrides,
});

export const createMockInstance = (overrides = {}) => ({
  id: "instance-123",
  shardId: 1,
  playerId: "12345",
  templateId: "template-123",
  state: "ACTIVE",
  boundToPlayer: "player-123",
  createdAt: new Date("2023-01-01"),
  updatedAt: new Date("2023-01-01"),
  ...overrides,
});

export const createMockExpansionSlot = (overrides = {}) => ({
  robotId: "robot-123",
  itemInstId: "instance-123",
  slotIx: 0,
  createdAt: new Date("2023-01-01"),
  updatedAt: new Date("2023-01-01"),
  ...overrides,
});

export const createMockInventoryStack = (overrides = {}) => ({
  id: "stack-123",
  shardId: 1,
  playerId: "12345",
  templateId: "template-123",
  quantity: "10",
  createdAt: new Date("2023-01-01"),
  updatedAt: new Date("2023-01-01"),
  ...overrides,
});

export const createMockPlayerAccount = (overrides = {}) => ({
  id: "account-123",
  shardId: 1,
  globalPlayerId: "player-123",
  createdAt: new Date("2023-01-01"),
  updatedAt: new Date("2023-01-01"),
  ...overrides,
});

export const createMockPartsSlot = (overrides = {}) => ({
  robotId: "robot-123",
  slotType: "LEFT_ARM",
  itemInstId: "instance-123",
  createdAt: new Date("2023-01-01"),
  updatedAt: new Date("2023-01-01"),
  ...overrides,
});

export const createMockSkeletonSlot = (overrides = {}) => ({
  robotId: "robot-123",
  itemInstId: "instance-123",
  createdAt: new Date("2023-01-01"),
  updatedAt: new Date("2023-01-01"),
  ...overrides,
});

export const createMockSoulChipSlot = (overrides = {}) => ({
  robotId: "robot-123",
  itemInstId: "instance-123",
  createdAt: new Date("2023-01-01"),
  updatedAt: new Date("2023-01-01"),
  ...overrides,
});

export const createMockItemTemplateAsset = (overrides = {}) => ({
  templateId: "template-123",
  assetId: "asset-123",
  createdAt: new Date("2023-01-01"),
  updatedAt: new Date("2023-01-01"),
  ...overrides,
});

// Helper to reset all mocks
export const resetAllMocks = () => {
  Object.values(mockClient).forEach((table) => {
    Object.values(table).forEach((method) => {
      if (typeof method === "function" && "mockReset" in method) {
        method.mockReset();
      }
    });
  });
  mockValidateData.mockReset();
  mockValidateData.mockReturnValue({ success: true });
};
