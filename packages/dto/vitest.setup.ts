import { vi } from "vitest";

// Mock the Prisma client methods
const mockClient = {
  asset_pack: {
    findUnique: vi.fn(),
    upsert: vi.fn(),
  },
  asset: {
    findUnique: vi.fn(),
    findMany: vi.fn(),
    upsert: vi.fn(),
  },
  user: {
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
    upsert: vi.fn(),
  },
  shard: {
    findUnique: vi.fn(),
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
    upsert: vi.fn(),
  },
  part_slots: {
    findUnique: vi.fn(),
    findMany: vi.fn(),
    upsert: vi.fn(),
  },
  player_account: {
    findUnique: vi.fn(),
    upsert: vi.fn(),
  },
  skeleton_slot: {
    findUnique: vi.fn(),
    upsert: vi.fn(),
  },
  soul_chip_slot: {
    findUnique: vi.fn(),
    upsert: vi.fn(),
  },
};

// Mock the validate function
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
    HEAD: "HEAD",
    TORSO: "TORSO",
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
