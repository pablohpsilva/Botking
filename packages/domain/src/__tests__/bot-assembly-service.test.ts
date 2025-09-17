/**
 * Bot Assembly Service Tests
 */

import { describe, it, expect, beforeEach } from "vitest";
import { SkeletonType, PartCategory } from "@botking/db";
import {
  BotAssemblyService,
  IBotAssemblyConfig,
} from "../services/bot-assembly-service";

describe("BotAssemblyService", () => {
  let service: BotAssemblyService;

  beforeEach(() => {
    service = new BotAssemblyService();
  });

  describe("Basic Assembly Validation", () => {
    it("should validate a basic light skeleton assembly", () => {
      const config: IBotAssemblyConfig = {
        skeletonType: SkeletonType.LIGHT,
        parts: [
          { id: "1", category: PartCategory.HEAD, name: "Basic Helmet" },
          { id: "2", category: PartCategory.TORSO, name: "Light Armor" },
          { id: "3", category: PartCategory.ARM, name: "Left Arm" },
          { id: "4", category: PartCategory.ARM, name: "Right Arm" },
          { id: "5", category: PartCategory.LEG, name: "Left Leg" },
          { id: "6", category: PartCategory.LEG, name: "Right Leg" },
        ],
        expansionChips: [{ id: "7", name: "Speed Chip" }],
        soulChips: [{ id: "8", name: "AI Core" }],
      };

      const result = service.validateAssembly(config);

      expect(result.canAssemble).toBe(true);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it("should reject assembly with too many head parts for light skeleton", () => {
      const config: IBotAssemblyConfig = {
        skeletonType: SkeletonType.LIGHT,
        parts: [
          { id: "1", category: PartCategory.HEAD, name: "Helmet 1" },
          { id: "2", category: PartCategory.HEAD, name: "Helmet 2" }, // Too many heads
          { id: "3", category: PartCategory.TORSO, name: "Light Armor" },
        ],
        expansionChips: [],
        soulChips: [{ id: "4", name: "AI Core" }],
      };

      const result = service.validateAssembly(config);

      expect(result.canAssemble).toBe(false);
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.recommendations).toBeDefined();
    });

    it("should reject assembly without soul chip", () => {
      const config: IBotAssemblyConfig = {
        skeletonType: SkeletonType.LIGHT,
        parts: [
          { id: "1", category: PartCategory.HEAD, name: "Basic Helmet" },
          { id: "2", category: PartCategory.TORSO, name: "Light Armor" },
        ],
        expansionChips: [],
        soulChips: [], // Missing soul chip
      };

      const result = service.validateAssembly(config);

      expect(result.canAssemble).toBe(false);
      expect(result.isValid).toBe(false);
      expect(result.recommendations).toContain(
        "Add 1 soul chip - required for all bots"
      );
    });
  });

  describe("Heavy Skeleton Validation", () => {
    it("should validate heavy skeleton with minimum required parts", () => {
      const config: IBotAssemblyConfig = {
        skeletonType: SkeletonType.HEAVY,
        parts: [
          { id: "1", category: PartCategory.HEAD, name: "Heavy Helmet" },
          { id: "2", category: PartCategory.TORSO, name: "Heavy Armor" },
          { id: "3", category: PartCategory.ARM, name: "Heavy Arm 1" },
          { id: "4", category: PartCategory.ARM, name: "Heavy Arm 2" },
          { id: "5", category: PartCategory.LEG, name: "Heavy Leg 1" },
          { id: "6", category: PartCategory.LEG, name: "Heavy Leg 2" },
        ],
        expansionChips: [],
        soulChips: [{ id: "7", name: "AI Core" }],
      };

      const result = service.validateAssembly(config);

      expect(result.canAssemble).toBe(true);
      expect(result.isValid).toBe(true);
    });

    it("should reject heavy skeleton with insufficient arms", () => {
      const config: IBotAssemblyConfig = {
        skeletonType: SkeletonType.HEAVY,
        parts: [
          { id: "1", category: PartCategory.HEAD, name: "Heavy Helmet" },
          { id: "2", category: PartCategory.TORSO, name: "Heavy Armor" },
          { id: "3", category: PartCategory.ARM, name: "Heavy Arm 1" }, // Only 1 arm, need 2
          { id: "4", category: PartCategory.LEG, name: "Heavy Leg 1" },
          { id: "5", category: PartCategory.LEG, name: "Heavy Leg 2" },
        ],
        expansionChips: [],
        soulChips: [{ id: "6", name: "AI Core" }],
      };

      const result = service.validateAssembly(config);

      expect(result.canAssemble).toBe(false);
      expect(result.recommendations).toContain(
        "Heavy skeletons require at least 2 arm parts"
      );
    });
  });

  describe("Flying Skeleton Validation", () => {
    it("should validate flying skeleton with default slots", () => {
      const config: IBotAssemblyConfig = {
        skeletonType: SkeletonType.FLYING,
        parts: [
          { id: "1", category: PartCategory.HEAD, name: "Head 1" },
          { id: "2", category: PartCategory.TORSO, name: "Light Torso" },
          { id: "3", category: PartCategory.LEG, name: "Flying Leg" },
        ],
        expansionChips: [],
        soulChips: [{ id: "4", name: "AI Core" }],
      };

      const result = service.validateAssembly(config);

      expect(result.canAssemble).toBe(true);
      expect(result.isValid).toBe(true);
    });

    it("should allow multiple heads for flying skeleton with custom slots", () => {
      const config: IBotAssemblyConfig = {
        skeletonType: SkeletonType.FLYING,
        // Provide custom skeleton slots that allow multiple heads (1..n)
        skeletonSlots: {
          headSlots: 3, // Allow 3 heads
          torsoSlots: 1,
          armSlots: 2,
          legSlots: 2,
          accessorySlots: 0,
          expansionSlots: 1,
          soulChipSlots: 1,
        },
        parts: [
          { id: "1", category: PartCategory.HEAD, name: "Head 1" },
          { id: "2", category: PartCategory.HEAD, name: "Head 2" },
          { id: "3", category: PartCategory.HEAD, name: "Head 3" }, // Multiple heads allowed
          { id: "4", category: PartCategory.TORSO, name: "Light Torso" },
          { id: "5", category: PartCategory.LEG, name: "Flying Leg" },
        ],
        expansionChips: [],
        soulChips: [{ id: "6", name: "AI Core" }],
      };

      const result = service.validateAssembly(config);

      expect(result.canAssemble).toBe(true);
      expect(result.isValid).toBe(true);
    });

    it("should validate all part categories including accessories", () => {
      const config: IBotAssemblyConfig = {
        skeletonType: SkeletonType.MODULAR,
        // Modular skeletons support all part types
        skeletonSlots: {
          headSlots: 2,
          torsoSlots: 1,
          armSlots: 2,
          legSlots: 2,
          accessorySlots: 2, // Allow accessories
          expansionSlots: 2,
          soulChipSlots: 1,
        },
        parts: [
          { id: "1", category: PartCategory.HEAD, name: "Head 1" },
          { id: "2", category: PartCategory.TORSO, name: "Torso" },
          { id: "3", category: PartCategory.ARM, name: "Left Arm" },
          { id: "4", category: PartCategory.ARM, name: "Right Arm" },
          { id: "5", category: PartCategory.LEG, name: "Left Leg" },
          { id: "6", category: PartCategory.LEG, name: "Right Leg" },
          { id: "7", category: PartCategory.ACCESSORY, name: "Shield" },
          { id: "8", category: PartCategory.ACCESSORY, name: "Sensor Pack" },
        ],
        expansionChips: [
          { id: "9", name: "Speed Chip" },
          { id: "10", name: "Attack Chip" },
        ],
        soulChips: [{ id: "11", name: "AI Core" }],
      };

      const result = service.validateAssembly(config);

      expect(result.canAssemble).toBe(true);
      expect(result.isValid).toBe(true);
      expect(result.partUsage.ACCESSORY).toBe(2);
      expect(result.partUsage.expansionChips).toBe(2);
    });
  });

  describe("Utility Methods", () => {
    it("should get minimum required parts for each skeleton type", () => {
      const lightMin = service.getMinimumRequiredParts(SkeletonType.LIGHT);
      expect(lightMin.heads).toBe(1);
      expect(lightMin.torsos).toBe(1);
      expect(lightMin.arms).toBe(0);
      expect(lightMin.legs).toBe(1);
      expect(lightMin.accessories).toBe(0);
      expect(lightMin.soulChips).toBe(1);

      const heavyMin = service.getMinimumRequiredParts(SkeletonType.HEAVY);
      expect(heavyMin.arms).toBe(2);
      expect(heavyMin.legs).toBe(2);
      expect(heavyMin.accessories).toBe(0);
    });

    it("should get maximum allowed parts for skeleton configuration", () => {
      const config = { skeletonType: SkeletonType.LIGHT };
      const max = service.getMaximumAllowedParts(config);

      expect(max.heads).toBe(1);
      expect(max.torsos).toBe(1);
      expect(max.accessories).toBe(0); // Light skeleton default accessory slots
      expect(max.soulChips).toBe(1);
    });

    it("should provide shorthand validation method", () => {
      const validConfig: IBotAssemblyConfig = {
        skeletonType: SkeletonType.LIGHT,
        parts: [
          { id: "1", category: PartCategory.HEAD, name: "Helmet" },
          { id: "2", category: PartCategory.TORSO, name: "Armor" },
          { id: "3", category: PartCategory.LEG, name: "Leg Part" }, // Add required leg part
        ],
        expansionChips: [],
        soulChips: [{ id: "4", name: "AI Core" }],
      };

      expect(service.isValidAssembly(validConfig)).toBe(true);
    });
  });
});
