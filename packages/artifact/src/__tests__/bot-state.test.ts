import { describe, it, expect, beforeEach } from "vitest";

import { BotStateFactory } from "../bot-state/bot-state-factory";
import { WorkerBotState } from "../bot-state/worker-bot-state";
import { NonWorkerBotState } from "../bot-state/non-worker-bot-state";
import type {
  IWorkerBotState,
  INonWorkerBotState,
  BotStateConfig,
} from "../bot-state/bot-state-interface";
import { BotType, StatusEffect } from "../types";

describe("Bot State System", () => {
  describe("BotStateFactory", () => {
    it("should create worker state for WORKER bot type", () => {
      const state = BotStateFactory.createState(BotType.WORKER);
      expect(state).toBeInstanceOf(WorkerBotState);
      expect(state.getStateType()).toBe("worker");
    });

    it("should create non-worker state for PLAYABLE bot type", () => {
      const state = BotStateFactory.createState(BotType.PLAYABLE);
      expect(state).toBeInstanceOf(NonWorkerBotState);
      expect(state.getStateType()).toBe("non-worker");
    });

    it("should create non-worker state for KING bot type", () => {
      const state = BotStateFactory.createState(BotType.KING);
      expect(state).toBeInstanceOf(NonWorkerBotState);
      expect(state.getStateType()).toBe("non-worker");
    });

    it("should create non-worker state for ROGUE bot type", () => {
      const state = BotStateFactory.createState(BotType.ROGUE);
      expect(state).toBeInstanceOf(NonWorkerBotState);
      expect(state.getStateType()).toBe("non-worker");
    });

    it("should create non-worker state for GOVBOT bot type", () => {
      const state = BotStateFactory.createState(BotType.GOVBOT);
      expect(state).toBeInstanceOf(NonWorkerBotState);
      expect(state.getStateType()).toBe("non-worker");
    });

    it("should throw error for unknown bot type", () => {
      expect(() => {
        BotStateFactory.createState("UNKNOWN" as BotType);
      }).toThrow("Unknown bot type: UNKNOWN");
    });

    it("should create default states with appropriate defaults", () => {
      const workerState = BotStateFactory.createDefaultState(BotType.WORKER);
      expect(workerState.energyLevel).toBe(100);
      expect(workerState.maintenanceLevel).toBe(100);
      expect(workerState.currentLocation).toBe("STORAGE");

      const playableState = BotStateFactory.createDefaultState(
        BotType.PLAYABLE
      );
      expect((playableState as INonWorkerBotState).bondLevel).toBe(20);
      expect(playableState.currentLocation).toBe("TRAINING");

      const kingState = BotStateFactory.createDefaultState(BotType.KING);
      expect((kingState as INonWorkerBotState).bondLevel).toBe(100);
      expect((kingState as INonWorkerBotState).battlesWon).toBe(10);
      expect(kingState.experience).toBe(5000);
    });

    it("should validate state types correctly", () => {
      const workerState = BotStateFactory.createState(BotType.WORKER);
      const validation = BotStateFactory.validateStateForBotType(
        workerState,
        BotType.WORKER
      );
      expect(validation.valid).toBe(true);
      expect(validation.errors).toHaveLength(0);

      // Test invalid combination
      const invalidValidation = BotStateFactory.validateStateForBotType(
        workerState,
        BotType.PLAYABLE
      );
      expect(invalidValidation.valid).toBe(false);
      expect(invalidValidation.errors).toContain(
        "Non-worker bot type requires non-worker state, got worker"
      );
    });
  });

  describe("WorkerBotState", () => {
    let workerState: IWorkerBotState;

    beforeEach(() => {
      workerState = new WorkerBotState({
        energyLevel: 100,
        maintenanceLevel: 100,
        experience: 0,
      });
    });

    it("should initialize with correct default values", () => {
      expect(workerState.energyLevel).toBe(100);
      expect(workerState.maintenanceLevel).toBe(100);
      expect(workerState.experience).toBe(0);
      expect(workerState.getStateType()).toBe("worker");
      expect(workerState.isOperational()).toBe(true);
    });

    it("should calculate work efficiency correctly", () => {
      const efficiency = (
        workerState as WorkerBotState
      ).calculateWorkEfficiency();
      expect(efficiency).toBe(1.0); // 100% efficiency at full energy and maintenance

      // Test with reduced maintenance
      workerState.maintenanceLevel = 25;
      const reducedEfficiency = (
        workerState as WorkerBotState
      ).calculateWorkEfficiency();
      expect(reducedEfficiency).toBe(0.5); // 50% efficiency
    });

    it("should perform work and update state", () => {
      const workResult = (workerState as WorkerBotState).performWork(1.0, 1);

      expect(workResult.success).toBe(true);
      expect(workResult.experienceGained).toBeGreaterThan(0);
      expect(workResult.energyConsumed).toBeGreaterThan(0);
      expect(workerState.energyLevel).toBeLessThan(100);
      expect(workerState.experience).toBeGreaterThan(0);
    });

    it("should add fatigue effect during intensive work", () => {
      const workResult = (workerState as WorkerBotState).performWork(2.0, 1); // High intensity

      expect(workResult.success).toBe(true);
      const statusEffects = workerState.statusEffects;
      const hasFatigue = statusEffects.some(
        (effect) => effect.effect === StatusEffect.FATIGUE
      );
      expect(hasFatigue).toBe(true);
    });

    it("should restore energy during rest", () => {
      // Reduce energy first
      workerState.updateEnergy(-50);
      expect(workerState.energyLevel).toBe(50);

      const restResult = (workerState as WorkerBotState).rest(1);

      expect(restResult.energyRestored).toBeGreaterThan(0);
      expect(workerState.energyLevel).toBeGreaterThan(50);
    });

    it("should handle status effects correctly", () => {
      workerState.addStatusEffect({
        id: "test_boost",
        effect: StatusEffect.PRODUCTIVITY_BOOST,
        magnitude: 20,
        duration: 3600,
        source: "test",
      });

      const effects = workerState.getActiveEffectsByType(
        StatusEffect.PRODUCTIVITY_BOOST
      );
      expect(effects).toHaveLength(1);
      expect(effects[0].magnitude).toBe(20);

      workerState.removeStatusEffect("test_boost");
      const remainingEffects = workerState.getActiveEffectsByType(
        StatusEffect.PRODUCTIVITY_BOOST
      );
      expect(remainingEffects).toHaveLength(0);
    });

    it("should calculate effective energy with status effects", () => {
      const baseEnergy = workerState.calculateEffectiveEnergy();
      expect(baseEnergy).toBe(100);

      workerState.addStatusEffect({
        id: "energy_drain",
        effect: StatusEffect.ENERGY_DRAIN,
        magnitude: 20,
        duration: 3600,
        source: "test",
      });

      const drainedEnergy = workerState.calculateEffectiveEnergy();
      expect(drainedEnergy).toBe(80);
    });

    it("should serialize and deserialize correctly", () => {
      const json = workerState.toJSON();
      expect(json.stateType).toBe("worker");
      expect(json.energyLevel).toBe(100);
      expect(json.workEfficiency).toBeDefined();

      const serialized = workerState.serialize();
      expect(typeof serialized).toBe("string");
      const parsed = JSON.parse(serialized);
      expect(parsed.stateType).toBe("worker");
    });
  });

  describe("NonWorkerBotState", () => {
    let nonWorkerState: INonWorkerBotState;

    beforeEach(() => {
      nonWorkerState = new NonWorkerBotState({
        energyLevel: 100,
        maintenanceLevel: 100,
        bondLevel: 50,
        battlesWon: 0,
        battlesLost: 0,
        totalBattles: 0,
      });
    });

    it("should initialize with correct default values", () => {
      expect(nonWorkerState.energyLevel).toBe(100);
      expect(nonWorkerState.bondLevel).toBe(50);
      expect(nonWorkerState.getStateType()).toBe("non-worker");
      expect(nonWorkerState.battlesWon).toBe(0);
      expect(nonWorkerState.battlesLost).toBe(0);
      expect(nonWorkerState.totalBattles).toBe(0);
    });

    it("should update bond level correctly", () => {
      nonWorkerState.updateBondLevel(20);
      expect(nonWorkerState.bondLevel).toBe(70);

      nonWorkerState.updateBondLevel(-30);
      expect(nonWorkerState.bondLevel).toBe(40);

      // Test bounds
      nonWorkerState.updateBondLevel(-50);
      expect(nonWorkerState.bondLevel).toBe(0);

      nonWorkerState.updateBondLevel(150);
      expect(nonWorkerState.bondLevel).toBe(100);
    });

    it("should record battle results correctly", () => {
      const initialExperience = nonWorkerState.experience;
      const initialBond = nonWorkerState.bondLevel;

      // Record a win
      nonWorkerState.recordBattleResult(true);
      expect(nonWorkerState.battlesWon).toBe(1);
      expect(nonWorkerState.totalBattles).toBe(1);
      expect(nonWorkerState.experience).toBeGreaterThan(initialExperience);
      expect(nonWorkerState.bondLevel).toBeGreaterThan(initialBond);

      // Record a loss
      nonWorkerState.recordBattleResult(false);
      expect(nonWorkerState.battlesLost).toBe(1);
      expect(nonWorkerState.totalBattles).toBe(2);
    });

    it("should calculate battle stats correctly", () => {
      nonWorkerState.recordBattleResult(true);
      nonWorkerState.recordBattleResult(true);
      nonWorkerState.recordBattleResult(false);

      const stats = nonWorkerState.getBattleStats();
      expect(stats.won).toBe(2);
      expect(stats.lost).toBe(1);
      expect(stats.total).toBe(3);
      expect(stats.winRate).toBe(66.67);
    });

    it("should calculate social status correctly", () => {
      const socialStatus = nonWorkerState.calculateSocialStatus();
      expect(socialStatus.bondLevel).toBe(50);
      expect(socialStatus.activityLevel).toBe("Very Active"); // Just created
      expect(socialStatus.combatRating).toBe("Untested"); // No battles
    });

    it("should calculate combat readiness", () => {
      const readiness = (
        nonWorkerState as NonWorkerBotState
      ).calculateCombatReadiness();

      expect(readiness.readiness).toBeGreaterThan(0);
      expect(readiness.factors).toHaveProperty("energy");
      expect(readiness.factors).toHaveProperty("maintenance");
      expect(readiness.factors).toHaveProperty("bond");
      expect(readiness.status).toBeDefined();
      expect(Array.isArray(readiness.recommendations)).toBe(true);
    });

    it("should simulate training correctly", () => {
      const initialExperience = nonWorkerState.experience;
      const initialBond = nonWorkerState.bondLevel;
      const initialEnergy = nonWorkerState.energyLevel;

      const trainingResult = (nonWorkerState as NonWorkerBotState).train(
        1.0,
        1
      );

      expect(trainingResult.success).toBe(true);
      expect(trainingResult.experienceGained).toBeGreaterThan(0);
      expect(trainingResult.bondIncrease).toBeGreaterThan(0);
      expect(nonWorkerState.experience).toBeGreaterThan(initialExperience);
      expect(nonWorkerState.bondLevel).toBeGreaterThan(initialBond);
      expect(nonWorkerState.energyLevel).toBeLessThan(initialEnergy);
    });

    it("should handle status effects for morale", () => {
      nonWorkerState.addStatusEffect({
        id: "victory_boost",
        effect: StatusEffect.MORALE_BOOST,
        magnitude: 15,
        duration: 1800,
        source: "battle_victory",
      });

      const morale = (nonWorkerState as NonWorkerBotState)["calculateMorale"]();
      expect(morale).toBeGreaterThan(50); // Base bond + morale boost
    });

    it("should update last activity", async () => {
      const beforeUpdate = nonWorkerState.lastActivity;

      // Add a small delay to ensure different timestamps
      await new Promise((resolve) => setTimeout(resolve, 1));

      nonWorkerState.updateLastActivity();
      const afterUpdate = nonWorkerState.lastActivity;

      expect(afterUpdate.getTime()).toBeGreaterThan(beforeUpdate.getTime());
    });

    it("should serialize with non-worker specific data", () => {
      const json = nonWorkerState.toJSON();
      expect(json.stateType).toBe("non-worker");
      expect(json.bondLevel).toBe(50);
      expect(json.battleStats).toBeDefined();
      expect(json.socialStatus).toBeDefined();
      expect(json.combatReadiness).toBeDefined();
    });
  });

  describe("State Configuration", () => {
    it("should accept custom configurations", () => {
      const config: BotStateConfig = {
        id: "custom_state_123",
        energyLevel: 75,
        maintenanceLevel: 80,
        experience: 1000,
        bondLevel: 30,
        battlesWon: 5,
        battlesLost: 2,
        totalBattles: 7,
      };

      const state = new NonWorkerBotState(config);
      expect(state.id).toBe("custom_state_123");
      expect(state.energyLevel).toBe(75);
      expect(state.maintenanceLevel).toBe(80);
      expect(state.experience).toBe(1000);
      expect(state.bondLevel).toBe(30);
      expect(state.battlesWon).toBe(5);
      expect(state.battlesLost).toBe(2);
      expect(state.totalBattles).toBe(7);
    });

    it("should validate battle statistics consistency", () => {
      const config: BotStateConfig = {
        battlesWon: 10,
        battlesLost: 5,
        totalBattles: 12, // Inconsistent: should be at least 15
      };

      const state = new NonWorkerBotState(config);
      // The state should automatically fix inconsistency
      expect(state.totalBattles).toBe(15); // Should be corrected to won + lost
    });

    it("should handle customizations", () => {
      const customizations = new Map([
        ["color", "red"],
        ["pattern", "stripes"],
        ["weapon_preference", "plasma"],
      ]);

      const config: BotStateConfig = {
        customizations,
      };

      const state = new WorkerBotState(config);
      expect(state.getCustomization("color")).toBe("red");
      expect(state.getCustomization("pattern")).toBe("stripes");
      expect(state.getCustomization("weapon_preference")).toBe("plasma");

      state.setCustomization("color", "blue");
      expect(state.getCustomization("color")).toBe("blue");

      state.removeCustomization("pattern");
      expect(state.getCustomization("pattern")).toBeUndefined();
    });
  });
});
