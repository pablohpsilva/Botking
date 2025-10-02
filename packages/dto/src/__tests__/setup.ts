/**
 * Test setup file for DTO tests
 * Provides mock implementations and test utilities
 */

import { vi } from "vitest";
import { connectionManager } from "@botking/db";
import { validateData } from "@botking/validator";

// Export the mocked functions for use in tests
export const mockClient = vi.mocked(connectionManager.getClient());
export const mockValidateData = vi.mocked(validateData);

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
  playerId: BigInt("12345"),
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
  authUserId: "user-123",
  globalPlayerId: "player-123",
  linkedAt: new Date("2023-01-01"),
  createdAt: new Date("2023-01-01"),
  updatedAt: new Date("2023-01-01"),
  ...overrides,
});

export const createMockInstance = (overrides = {}) => ({
  id: "instance-123",
  shardId: 1,
  playerId: BigInt("12345"),
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
  playerId: BigInt("12345"),
  templateId: "template-123",
  quantity: BigInt("10"),
  createdAt: new Date("2023-01-01"),
  updatedAt: new Date("2023-01-01"),
  ...overrides,
});

export const createMockPlayerAccount = (overrides = {}) => ({
  id: "account-123",
  shardId: 1,
  globalPlayerId: "player-123",
  playerId: BigInt("12345"),
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
