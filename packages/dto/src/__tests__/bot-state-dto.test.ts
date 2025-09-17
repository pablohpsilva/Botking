import { describe, it, expect } from "vitest";
import { AutoSyncDTOFactory } from "../auto-sync-dto-factory";

describe("Bot State DTO System", () => {
  describe("Worker Bot State DTO", () => {
    it("should validate valid worker bot state", () => {
      const validWorkerData = {
        userId: "company_001",
        name: "Assembly Worker",
        stateType: "worker" as const,
        energyLevel: 85,
        maintenanceLevel: 90,
        currentLocation: "STORAGE",
        experience: 500,
        statusEffects: ["productivity_boost"],
        customizations: {
          paint_job: "yellow",
          work_shift: "day",
        },
      };

      const result = AutoSyncDTOFactory.createBotState(validWorkerData);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.stateType).toBe("worker");
        expect(result.data.energyLevel).toBe(85);
        expect(result.data.name).toBe("Assembly Worker");
      }
    });

    it("should reject worker bot state with non-worker properties", () => {
      const invalidWorkerData = {
        userId: "company_001",
        name: "Invalid Worker",
        stateType: "worker" as const,
        energyLevel: 100,
        maintenanceLevel: 100,
        bondLevel: 50, // This should be invalid for worker
        battlesWon: 5, // This should be invalid for worker
      };

      const result = AutoSyncDTOFactory.createBotState(invalidWorkerData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.errors?.length).toBeGreaterThan(0);
      }
    });

    it("should validate worker state type rules", () => {
      const workerTypeData = {
        stateType: "worker" as const,
        bondLevel: 30, // Invalid for worker
      };

      const validation = AutoSyncDTOFactory.validateBotState(workerTypeData);
      expect(validation.success).toBe(false);
      if (!validation.success) {
        const hasWorkerBondError = validation.errors?.some((error) =>
          error.message.includes("Worker bots cannot have bond level")
        );
        expect(hasWorkerBondError).toBe(true);
      }
    });

    it("should handle worker state with legacy fields", () => {
      const workerDataWithLegacy = {
        userId: "company_001",
        name: "Legacy Worker",
        stateType: "worker" as const,

        // New fields
        energyLevel: 80,
        maintenanceLevel: 95,
        currentLocation: "STORAGE",

        // Legacy fields (should be accepted)
        energy: 80,
        health: 95,
        location: "STORAGE",
        level: 3,
        experience: 1500,
      };

      const result = AutoSyncDTOFactory.createBotState(workerDataWithLegacy);
      expect(result.success).toBe(true);
    });
  });

  describe("Non-Worker Bot State DTO", () => {
    it("should validate valid non-worker bot state", () => {
      const validNonWorkerData = {
        userId: "player_001",
        name: "Combat Fighter",
        stateType: "non-worker" as const,
        energyLevel: 75,
        maintenanceLevel: 80,
        currentLocation: "TRAINING",
        experience: 2500,
        bondLevel: 65,
        lastActivity: new Date(),
        battlesWon: 8,
        battlesLost: 3,
        totalBattles: 11,
        statusEffects: ["morale_boost", "skill_improvement"],
        customizations: {
          combat_style: "aggressive",
          weapon_preference: "plasma",
        },
      };

      const result = AutoSyncDTOFactory.createBotState(validNonWorkerData);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.stateType).toBe("non-worker");
        expect(result.data.bondLevel).toBe(65);
        expect(result.data.battlesWon).toBe(8);
        expect(result.data.totalBattles).toBe(11);
      }
    });

    it("should validate battle statistics consistency", () => {
      const invalidBattleStats = {
        userId: "player_001",
        name: "Invalid Fighter",
        stateType: "non-worker" as const,
        energyLevel: 100,
        maintenanceLevel: 100,
        bondLevel: 50,
        battlesWon: 10,
        battlesLost: 5,
        totalBattles: 12, // Invalid: should be at least 15
      };

      const validation =
        AutoSyncDTOFactory.validateBotState(invalidBattleStats);
      expect(validation.success).toBe(false);
      if (!validation.success) {
        const hasBattleStatsError = validation.errors?.some((error) =>
          error.message.includes(
            "Total battles must be greater than or equal to won + lost battles"
          )
        );
        expect(hasBattleStatsError).toBe(true);
      }
    });

    it("should accept valid battle statistics", () => {
      const validBattleStats = {
        userId: "player_001",
        name: "Valid Fighter",
        stateType: "non-worker" as const,
        energyLevel: 100,
        maintenanceLevel: 100,
        bondLevel: 50,
        battlesWon: 10,
        battlesLost: 5,
        totalBattles: 15, // Valid: exactly won + lost
      };

      const validation = AutoSyncDTOFactory.validateBotState(validBattleStats);
      expect(validation.success).toBe(true);
    });

    it("should handle non-worker state with optional fields", () => {
      const minimalNonWorkerData = {
        userId: "player_001",
        name: "Minimal Fighter",
        stateType: "non-worker" as const,
        energyLevel: 100,
        maintenanceLevel: 100,
        bondLevel: 30,
      };

      const result = AutoSyncDTOFactory.createBotState(minimalNonWorkerData);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.stateType).toBe("non-worker");
        expect(result.data.bondLevel).toBe(30);
      }
    });

    it("should validate bond level bounds", () => {
      const invalidBondLevel = {
        userId: "player_001",
        name: "Invalid Bond Bot",
        stateType: "non-worker" as const,
        energyLevel: 100,
        maintenanceLevel: 100,
        bondLevel: 150, // Invalid: exceeds maximum of 100
      };

      const validation = AutoSyncDTOFactory.validateBotState(invalidBondLevel);
      expect(validation.success).toBe(false);
      if (!validation.success) {
        const hasBondError = validation.errors?.some((error) =>
          error.path?.includes("bondLevel")
        );
        expect(hasBondError).toBe(true);
      }
    });
  });

  describe("State Type Validation", () => {
    it("should validate state type enum values", () => {
      const validWorkerType = AutoSyncDTOFactory.validateBotState({
        stateType: "worker",
        energyLevel: 100,
      });
      expect(validWorkerType.success).toBe(true);

      const validNonWorkerType = AutoSyncDTOFactory.validateBotState({
        stateType: "non-worker",
        energyLevel: 100,
        bondLevel: 50,
      });
      expect(validNonWorkerType.success).toBe(true);

      const invalidStateType = AutoSyncDTOFactory.validateBotState({
        stateType: "invalid-type" as any,
        energyLevel: 100,
      });
      expect(invalidStateType.success).toBe(false);
    });

    it("should enforce state type specific rules", () => {
      // Worker cannot have battle stats
      const workerWithBattles = {
        stateType: "worker" as const,
        energyLevel: 100,
        battlesWon: 5,
        battlesLost: 2,
        totalBattles: 7,
      };

      const workerValidation =
        AutoSyncDTOFactory.validateBotState(workerWithBattles);
      expect(workerValidation.success).toBe(false);

      // Non-worker can have battle stats
      const nonWorkerWithBattles = {
        stateType: "non-worker" as const,
        energyLevel: 100,
        bondLevel: 50,
        battlesWon: 5,
        battlesLost: 2,
        totalBattles: 7,
      };

      const nonWorkerValidation =
        AutoSyncDTOFactory.validateBotState(nonWorkerWithBattles);
      expect(nonWorkerValidation.success).toBe(true);
    });
  });

  describe("Energy and Maintenance Validation", () => {
    it("should validate energy level bounds", () => {
      const invalidEnergyHigh = {
        userId: "test_user",
        name: "Test Bot",
        stateType: "worker" as const,
        energyLevel: 150, // Invalid: exceeds maximum
      };

      const validationHigh =
        AutoSyncDTOFactory.createBotState(invalidEnergyHigh);
      expect(validationHigh.success).toBe(false);

      const invalidEnergyLow = {
        userId: "test_user",
        name: "Test Bot",
        stateType: "worker" as const,
        energyLevel: -10, // Invalid: below minimum
      };

      const validationLow = AutoSyncDTOFactory.createBotState(invalidEnergyLow);
      expect(validationLow.success).toBe(false);

      const validEnergy = {
        userId: "test_user",
        name: "Test Bot",
        stateType: "worker" as const,
        energyLevel: 75, // Valid: within bounds
      };

      const validationValid = AutoSyncDTOFactory.createBotState(validEnergy);
      expect(validationValid.success).toBe(true);
    });

    it("should validate maintenance level bounds", () => {
      const validMaintenance = {
        userId: "test_user",
        name: "Test Bot",
        stateType: "worker" as const,
        maintenanceLevel: 80,
      };

      const validation = AutoSyncDTOFactory.createBotState(validMaintenance);
      expect(validation.success).toBe(true);
    });
  });

  describe("Location Validation", () => {
    it("should validate bot location enum", () => {
      const validLocations = [
        "STORAGE",
        "TRAINING",
        "MISSION",
        "MAINTENANCE",
        "COMBAT",
      ];

      for (const location of validLocations) {
        const data = {
          userId: "test_user",
          name: "Test Bot",
          stateType: "worker" as const,
          currentLocation: location,
        };

        const validation = AutoSyncDTOFactory.createBotState(data);
        expect(validation.success).toBe(true);
      }

      const invalidLocation = {
        userId: "test_user",
        name: "Test Bot",
        stateType: "worker" as const,
        currentLocation: "INVALID_LOCATION",
      };

      const invalidValidation =
        AutoSyncDTOFactory.createBotState(invalidLocation);
      expect(invalidValidation.success).toBe(false);
    });
  });

  describe("Customizations Validation", () => {
    it("should handle various customization types", () => {
      const complexCustomizations = {
        userId: "test_user",
        name: "Customized Bot",
        stateType: "non-worker" as const,
        bondLevel: 50,
        customizations: {
          string_value: "test",
          number_value: 42,
          boolean_value: true,
          array_value: [1, 2, 3],
          object_value: { nested: "value" },
        },
      };

      const validation = AutoSyncDTOFactory.createBotState(
        complexCustomizations
      );
      expect(validation.success).toBe(true);
      if (validation.success) {
        expect(validation.data.customizations).toEqual(
          complexCustomizations.customizations
        );
      }
    });
  });

  describe("Status Effects Validation", () => {
    it("should handle status effects arrays", () => {
      const withStatusEffects = {
        userId: "test_user",
        name: "Effect Bot",
        stateType: "worker" as const,
        statusEffects: [
          "productivity_boost",
          "energy_drain",
          "maintenance_penalty",
        ],
      };

      const validation = AutoSyncDTOFactory.createBotState(withStatusEffects);
      expect(validation.success).toBe(true);
      if (validation.success) {
        expect(validation.data.statusEffects).toEqual(
          withStatusEffects.statusEffects
        );
      }
    });

    it("should handle empty status effects", () => {
      const noEffects = {
        userId: "test_user",
        name: "Clean Bot",
        stateType: "worker" as const,
        statusEffects: [],
      };

      const validation = AutoSyncDTOFactory.createBotState(noEffects);
      expect(validation.success).toBe(true);
    });
  });

  describe("Legacy Field Compatibility", () => {
    it("should handle mixed new and legacy fields", () => {
      const mixedFields = {
        userId: "test_user",
        name: "Legacy Bot",
        stateType: "non-worker" as const,

        // New fields
        energyLevel: 85,
        maintenanceLevel: 90,
        currentLocation: "TRAINING",
        bondLevel: 60,

        // Legacy fields
        energy: 85, // Should match energyLevel
        health: 90, // Should match maintenanceLevel
        location: "TRAINING", // Should match currentLocation
        level: 5,
        missionsCompleted: 12,
        successRate: 0.85,
      };

      const validation = AutoSyncDTOFactory.createBotState(mixedFields);
      expect(validation.success).toBe(true);
      if (validation.success) {
        expect(validation.data.energyLevel).toBe(85);
        expect(validation.data.maintenanceLevel).toBe(90);
        expect(validation.data.bondLevel).toBe(60);
        expect(validation.data.level).toBe(5);
      }
    });
  });

  describe("Integration with Bot Types", () => {
    it("should demonstrate complete bot state DTO workflow", () => {
      // Simulate worker bot state creation
      const workerStateData = {
        userId: "company_001",
        name: "Production Worker #001",
        stateType: "worker" as const,
        energyLevel: 95,
        maintenanceLevel: 88,
        currentLocation: "STORAGE",
        experience: 750,
        statusEffects: ["productivity_boost"],
        customizations: {
          efficiency_modifier: 1.1,
          work_hours: "day_shift",
          specialization: "assembly",
        },
      };

      const workerResult = AutoSyncDTOFactory.createBotState(workerStateData);
      expect(workerResult.success).toBe(true);

      // Simulate combat bot state creation
      const combatStateData = {
        userId: "player_001",
        name: "Arena Champion",
        stateType: "non-worker" as const,
        energyLevel: 78,
        maintenanceLevel: 85,
        currentLocation: "TRAINING",
        experience: 5000,
        bondLevel: 85,
        lastActivity: new Date(),
        battlesWon: 23,
        battlesLost: 7,
        totalBattles: 30,
        statusEffects: ["morale_boost", "skill_improvement"],
        customizations: {
          combat_style: "berserker",
          preferred_weapons: ["plasma_rifle", "energy_sword"],
          training_routine: "intensive",
        },
      };

      const combatResult = AutoSyncDTOFactory.createBotState(combatStateData);
      expect(combatResult.success).toBe(true);

      if (combatResult.success) {
        expect(combatResult.data.stateType).toBe("non-worker");
        expect(combatResult.data.bondLevel).toBe(85);
        expect(combatResult.data.battlesWon).toBe(23);
        expect(combatResult.data.totalBattles).toBe(30);

        // Calculate win rate
        const winRate =
          (combatResult.data.battlesWon / combatResult.data.totalBattles) * 100;
        expect(winRate).toBeCloseTo(76.67, 2);
      }
    });
  });
});
