import { describe, it, expect, beforeEach } from "vitest";

import { BotFactory, BotType } from "../index";
import type { IBot } from "../bot";
import type { IWorkerBotState, INonWorkerBotState } from "../bot-state";
import { BotLocation, SkeletonType, StatusEffect } from "../types";

describe("Bot Integration with Specialized States", () => {
  describe("Worker Bot Integration", () => {
    let workerBot: IBot;

    beforeEach(() => {
      workerBot = BotFactory.createBasicBot(
        "Integration-Worker",
        "factory_001",
        SkeletonType.BALANCED,
        BotType.WORKER
      );
    });

    it("should create worker bot with worker state", () => {
      expect(workerBot.botType).toBe(BotType.WORKER);
      expect(workerBot.state.getStateType()).toBe("worker");
      expect(workerBot.name).toBe("Integration-Worker");
      expect(workerBot.ownerId).toBe("factory_001");
    });

    it("should have worker-specific state properties", () => {
      const state = workerBot.state as IWorkerBotState;
      expect(state.energyLevel).toBe(100);
      expect(state.maintenanceLevel).toBe(100);
      expect(state.experience).toBe(0);
      expect(state.isOperational()).toBe(true);
    });

    it("should perform work and update state", () => {
      const workerState = workerBot.state as any; // Cast to access worker-specific methods

      if (typeof workerState.performWork === "function") {
        const workResult = workerState.performWork(1.0, 1);
        expect(workResult.success).toBe(true);
        expect(workResult.experienceGained).toBeGreaterThan(0);
        expect(workerBot.state.energyLevel).toBeLessThan(100);
        expect(workerBot.state.experience).toBeGreaterThan(0);
      }
    });

    it("should calculate work efficiency", () => {
      const workerState = workerBot.state as any;

      if (typeof workerState.calculateWorkEfficiency === "function") {
        const efficiency = workerState.calculateWorkEfficiency();
        expect(efficiency).toBeGreaterThan(0);
        expect(efficiency).toBeLessThanOrEqual(2.0);
      }
    });

    it("should update state through bot interface", () => {
      const initialEnergy = workerBot.state.energyLevel;

      workerBot.updateState({
        energyLevel: 75,
        experience: 100,
      });

      expect(workerBot.state.energyLevel).toBe(75);
      expect(workerBot.state.experience).toBe(100);
    });

    it("should validate assembly correctly", () => {
      const validation = workerBot.validateAssembly();
      expect(validation.valid).toBe(true);
      expect(validation.errors).toHaveLength(0);
    });

    it("should handle activation and deactivation", () => {
      expect(workerBot.isOperational).toBe(true);

      const activationResult = workerBot.activate();
      expect(activationResult).toBe(true);
      expect(workerBot.state.currentLocation).toBe(BotLocation.IDLE);

      workerBot.deactivate();
      expect(workerBot.state.currentLocation).toBe(BotLocation.STORAGE);
    });

    it("should clone correctly with worker state", () => {
      workerBot.state.updateEnergy(-25);
      workerBot.state.addExperience(500);

      const clonedBot = workerBot.clone();
      expect(clonedBot.state.getStateType()).toBe("worker");
      expect(clonedBot.state.energyLevel).toBe(workerBot.state.energyLevel);
      expect(clonedBot.state.experience).toBe(workerBot.state.experience);
      expect(clonedBot.id).not.toBe(workerBot.id); // Should have different ID
    });
  });

  describe("Non-Worker Bot Integration", () => {
    let playableBot: IBot;
    let kingBot: IBot;
    let rogueBot: IBot;

    beforeEach(() => {
      playableBot = BotFactory.createCombatBot(
        "Integration-Fighter",
        "player_001",
        "assault",
        BotType.PLAYABLE
      );
      kingBot = BotFactory.createKingBot(
        "Integration-King",
        "kingdom_001",
        "ruler_001"
      );
      rogueBot = BotFactory.createRogueBot("Integration-Rogue");
    });

    it("should create non-worker bots with correct states", () => {
      expect(playableBot.botType).toBe(BotType.PLAYABLE);
      expect(playableBot.state.getStateType()).toBe("non-worker");

      expect(kingBot.botType).toBe(BotType.KING);
      expect(kingBot.state.getStateType()).toBe("non-worker");

      expect(rogueBot.botType).toBe(BotType.ROGUE);
      expect(rogueBot.state.getStateType()).toBe("non-worker");
    });

    it("should have different initial bond levels based on bot type", () => {
      const playableState = playableBot.state as INonWorkerBotState;
      const kingState = kingBot.state as INonWorkerBotState;
      const rogueState = rogueBot.state as INonWorkerBotState;

      expect(playableState.bondLevel).toBe(20); // Default for playable
      expect(kingState.bondLevel).toBe(100); // Maximum for king
      expect(rogueState.bondLevel).toBe(0); // Minimum for rogue
    });

    it("should have different battle experience based on bot type", () => {
      const playableState = playableBot.state as INonWorkerBotState;
      const kingState = kingBot.state as INonWorkerBotState;
      const rogueState = rogueBot.state as INonWorkerBotState;

      expect(playableState.totalBattles).toBe(0); // New playable bot
      expect(kingState.totalBattles).toBe(11); // King has experience
      expect(rogueState.totalBattles).toBe(20); // Rogue has extensive experience
    });

    it("should record battle results correctly", () => {
      const state = playableBot.state as INonWorkerBotState;
      const initialBattles = state.totalBattles;
      const initialBond = state.bondLevel;

      state.recordBattleResult(true); // Win
      expect(state.battlesWon).toBe(1);
      expect(state.totalBattles).toBe(initialBattles + 1);
      expect(state.bondLevel).toBeGreaterThan(initialBond);

      state.recordBattleResult(false); // Loss
      expect(state.battlesLost).toBe(1);
      expect(state.totalBattles).toBe(initialBattles + 2);
    });

    it("should calculate battle statistics", () => {
      const state = playableBot.state as INonWorkerBotState;

      // Add some battle history
      state.recordBattleResult(true);
      state.recordBattleResult(true);
      state.recordBattleResult(false);

      const stats = state.getBattleStats();
      expect(stats.won).toBe(2);
      expect(stats.lost).toBe(1);
      expect(stats.total).toBe(3);
      expect(stats.winRate).toBe(66.67);
    });

    it("should calculate social status", () => {
      const state = playableBot.state as INonWorkerBotState;
      const socialStatus = state.calculateSocialStatus();

      expect(socialStatus.bondLevel).toBeDefined();
      expect(socialStatus.activityLevel).toBeDefined();
      expect(socialStatus.combatRating).toBeDefined();
      expect(typeof socialStatus.activityLevel).toBe("string");
      expect(typeof socialStatus.combatRating).toBe("string");
    });

    it("should simulate training with state updates", () => {
      const state = playableBot.state as any;

      if (typeof state.train === "function") {
        const initialExperience = state.experience;
        const initialBond = state.bondLevel;
        const initialEnergy = state.energyLevel;

        const trainingResult = state.train(1.0, 1);
        expect(trainingResult.success).toBe(true);
        expect(state.experience).toBeGreaterThan(initialExperience);
        expect(state.bondLevel).toBeGreaterThan(initialBond);
        expect(state.energyLevel).toBeLessThan(initialEnergy);
      }
    });

    it("should handle player assignment rules", () => {
      // Playable bot should allow player assignment
      expect(playableBot.canAssignPlayer()).toBe(true);
      expect(playableBot.assignPlayer("new_player_123")).toBe(true);
      expect(playableBot.playerId).toBe("new_player_123");

      // King should already have player and require one
      expect(kingBot.requiresPlayer()).toBe(true);
      expect(kingBot.playerId).toBe("ruler_001");

      // Rogue should not allow player assignment
      expect(rogueBot.canAssignPlayer()).toBe(false);
      expect(rogueBot.assignPlayer("hacker_123")).toBe(false);
      expect(rogueBot.playerId).toBeNull();
    });

    it("should update non-worker specific state through bot interface", () => {
      const state = playableBot.state as INonWorkerBotState;
      const newDate = new Date();

      playableBot.updateState({
        bondLevel: 75,
        battlesWon: 5,
        battlesLost: 2,
        totalBattles: 7,
      });

      expect(state.bondLevel).toBe(75);
      expect(state.battlesWon).toBe(5);
      expect(state.battlesLost).toBe(2);
      expect(state.totalBattles).toBe(7);
    });

    it("should clone correctly with non-worker state", () => {
      const state = playableBot.state as INonWorkerBotState;
      state.updateBondLevel(25);
      state.recordBattleResult(true);

      const clonedBot = playableBot.clone();
      const clonedState = clonedBot.state as INonWorkerBotState;

      expect(clonedState.getStateType()).toBe("non-worker");
      expect(clonedState.bondLevel).toBe(state.bondLevel);
      expect(clonedState.battlesWon).toBe(state.battlesWon);
      expect(clonedBot.id).not.toBe(playableBot.id);
    });
  });

  describe("State Reset and Recovery", () => {
    let testBot: IBot;

    beforeEach(() => {
      testBot = BotFactory.createCombatBot(
        "Reset-Test-Bot",
        "player_001",
        "tank",
        BotType.PLAYABLE
      );
    });

    it("should reset bot while preserving certain values", () => {
      const state = testBot.state as INonWorkerBotState;

      // Modify state
      state.updateEnergy(-50);
      state.updateMaintenance(-30);
      state.updateBondLevel(25);
      state.addExperience(1000);
      state.recordBattleResult(true);

      const preservedBond = state.bondLevel;
      const preservedExperience = state.experience;

      // Reset bot
      testBot.reset();

      // Check that energy and maintenance are restored
      expect(testBot.state.energyLevel).toBe(testBot.maxEnergy);
      expect(testBot.state.maintenanceLevel).toBe(100);

      // Check that bond and experience are preserved
      expect((testBot.state as INonWorkerBotState).bondLevel).toBe(
        preservedBond
      );
      expect(testBot.state.experience).toBe(preservedExperience);
    });
  });

  describe("Status Effects Integration", () => {
    let testBot: IBot;

    beforeEach(() => {
      testBot = BotFactory.createBasicBot(
        "Status-Test-Bot",
        "owner_001",
        SkeletonType.LIGHT,
        BotType.WORKER
      );
    });

    it("should handle status effects through bot state", () => {
      const state = testBot.state;

      state.addStatusEffect({
        id: "energy_boost_test",
        effect: StatusEffect.ENERGY_BOOST,
        magnitude: 20,
        duration: 3600,
        source: "test_simulation",
      });

      const effects = state.getActiveEffectsByType(StatusEffect.ENERGY_BOOST);
      expect(effects).toHaveLength(1);
      expect(effects[0].magnitude).toBe(20);

      const effectiveEnergy = state.calculateEffectiveEnergy();
      expect(effectiveEnergy).toBeGreaterThan(state.energyLevel);

      state.removeStatusEffect("energy_boost_test");
      const remainingEffects = state.getActiveEffectsByType(
        StatusEffect.ENERGY_BOOST
      );
      expect(remainingEffects).toHaveLength(0);
    });
  });

  describe("Customizations Integration", () => {
    let testBot: IBot;

    beforeEach(() => {
      testBot = BotFactory.createUtilityBot(
        "Custom-Test-Bot",
        "owner_001",
        "repair",
        BotType.WORKER
      );
    });

    it("should handle customizations through bot state", () => {
      const state = testBot.state;

      state.setCustomization("paint_job", "metallic_blue");
      state.setCustomization("efficiency_mod", 1.15);
      state.setCustomization("work_schedule", ["day", "evening"]);

      expect(state.getCustomization("paint_job")).toBe("metallic_blue");
      expect(state.getCustomization("efficiency_mod")).toBe(1.15);
      expect(state.getCustomization("work_schedule")).toEqual([
        "day",
        "evening",
      ]);

      state.removeCustomization("efficiency_mod");
      expect(state.getCustomization("efficiency_mod")).toBeUndefined();

      const customizations = state.customizations;
      expect(customizations.has("paint_job")).toBe(true);
      expect(customizations.has("work_schedule")).toBe(true);
      expect(customizations.has("efficiency_mod")).toBe(false);
    });
  });

  describe("Bot Type Specific Behaviors", () => {
    it("should demonstrate different behaviors for different bot types", () => {
      const workerBot = BotFactory.createBasicBot(
        "Worker",
        "company_001",
        SkeletonType.BALANCED,
        BotType.WORKER
      );
      const playableBot = BotFactory.createCombatBot(
        "Fighter",
        "player_001",
        "assault",
        BotType.PLAYABLE
      );
      const kingBot = BotFactory.createKingBot(
        "King",
        "kingdom_001",
        "ruler_001"
      );
      const rogueBot = BotFactory.createRogueBot("Rogue");
      const govBot = BotFactory.createGovBot("GovBot", "security");

      // Verify state types
      expect(workerBot.state.getStateType()).toBe("worker");
      expect(playableBot.state.getStateType()).toBe("non-worker");
      expect(kingBot.state.getStateType()).toBe("non-worker");
      expect(rogueBot.state.getStateType()).toBe("non-worker");
      expect(govBot.state.getStateType()).toBe("non-worker");

      // Verify ownership rules
      expect(workerBot.ownerId).toBe("company_001");
      expect(playableBot.ownerId).toBe("player_001");
      expect(kingBot.ownerId).toBe("kingdom_001");
      expect(rogueBot.ownerId).toBeNull();
      expect(govBot.ownerId).toBeNull();

      // Verify player assignment rules
      expect(workerBot.canAssignPlayer()).toBe(true);
      expect(playableBot.requiresPlayer()).toBe(true);
      expect(kingBot.requiresPlayer()).toBe(true);
      expect(rogueBot.canAssignPlayer()).toBe(false);
      expect(govBot.canAssignPlayer()).toBe(false);

      // Verify initial experience levels
      expect(workerBot.state.experience).toBe(0);
      expect(playableBot.state.experience).toBe(1000);
      expect(kingBot.state.experience).toBe(10000);
      expect(rogueBot.state.experience).toBe(2000);
      expect(govBot.state.experience).toBe(5000);
    });
  });
});
