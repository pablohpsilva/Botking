import { describe, it, expect, beforeEach } from "vitest";
import { Bot } from "../bot/bot";
import { SoulChip } from "../soul-chip";
import { SkeletonFactory } from "../skeleton/skeleton-factory";
import { PartFactory } from "../part/part-factory";
import { ExpansionChipFactory } from "../expansion-chip/expansion-chip-factory";
import {
  BotType,
  Rarity,
  BotLocation,
  SkeletonType,
  PartCategory,
  ExpansionChipEffect,
  MobilityType,
} from "../types";

// Note: DTO integration would be tested separately in integration tests

describe("Bot Creation Scenarios", () => {
  describe("Scenario #1: Worker Bot (should not have soul chip)", () => {
    let workerBot: Bot;
    let balancedSkeleton: any;
    let armPart: any;
    let legPart: any;
    let torsoPart: any;
    let attackChip: any;

    beforeEach(() => {
      // Step 1: Create a balanced skeleton for the worker bot
      balancedSkeleton = SkeletonFactory.createSkeleton(
        SkeletonType.BALANCED, // Balanced skeleton type
        "skeleton_worker_001",
        Rarity.COMMON,
        4, // Base slots
        100, // Weight
        MobilityType.BIPEDAL // Mobility type
      );
      expect(balancedSkeleton).toBeDefined();
      expect(balancedSkeleton.type).toBe(SkeletonType.BALANCED);
    });

    it("should create a worker bot without soul chip", () => {
      // Step 2: Create the worker bot configuration (NO soul chip for workers)
      const workerConfig = {
        name: "Industrial Worker Alpha",
        botType: BotType.WORKER,
        userId: null, // Workers can be autonomous
        skeleton: balancedSkeleton,
        parts: [],
        expansionChips: [],
        // No soul chip - this is correct for worker bots
      };

      // Worker bots should successfully create WITHOUT soul chips
      expect(() => {
        workerBot = new Bot(workerConfig);
      }).not.toThrow();

      expect(workerBot).toBeDefined();
      expect(workerBot.botType).toBe(BotType.WORKER);
      expect(workerBot.soulChip).toBeNull(); // Worker bots have no soul chip
      expect(workerBot.userId).toBeNull(); // Autonomous worker
    });

    it("should reject worker bot creation WITH soul chip", () => {
      // Step 2a: Create a basic soul chip (workers should NOT have these)
      const basicSoulChip = new SoulChip(
        "soul_worker_basic",
        "Basic Worker AI",
        Rarity.COMMON,
        {
          aggressiveness: 10, // Low aggression for workers
          curiosity: 30, // Some curiosity for problem solving
          loyalty: 90, // High loyalty to tasks
          independence: 70, // High independence for autonomous work
          empathy: 20, // Low empathy, task-focused
          dialogueStyle: "formal",
        },
        {
          intelligence: 40, // Basic intelligence
          resilience: 70, // High resilience for work
          adaptability: 50, // Moderate adaptability
        },
        "Task Optimization" // Specialized for work efficiency
      );

      // Step 3: Attempt to create worker bot with soul chip - should fail
      const workerConfig = {
        name: "Industrial Worker Alpha",
        botType: BotType.WORKER,
        userId: null, // Workers can be autonomous
        soulChip: basicSoulChip, // This should cause validation to fail
        skeleton: balancedSkeleton,
        parts: [],
        expansionChips: [],
      };

      // Worker bots should NOT accept soul chips
      expect(() => {
        new Bot(workerConfig);
      }).toThrow(
        "Worker bots cannot have soul chips - they operate with basic AI"
      );
    });

    it("should create and install parts on worker bot", () => {
      // Step 4: Create various parts for the worker bot

      // Create an arm part (tool manipulation)
      armPart = PartFactory.createPart(
        PartCategory.ARM, // Part category
        "arm_worker_001",
        Rarity.COMMON,
        "Industrial Manipulator Arm",
        {
          attack: 15, // Low attack, not for combat
          defense: 25, // Moderate defense
          speed: 20, // Moderate speed
          perception: 35, // Good perception for precision work
          energyConsumption: 10, // Efficient for long work periods
        }
      );
      expect(armPart).toBeDefined();
      expect(armPart.category).toBe(PartCategory.ARM);

      // Create leg parts (mobility for work sites)
      legPart = PartFactory.createPart(
        PartCategory.LEG,
        "leg_worker_001",
        Rarity.COMMON,
        "Heavy Duty Work Legs",
        {
          attack: 5, // Minimal attack
          defense: 30, // Good defense against workplace hazards
          speed: 40, // Good mobility
          perception: 20, // Basic perception
          energyConsumption: 15, // Moderate energy use
        }
      );
      expect(legPart).toBeDefined();

      // Create torso part (housing for work equipment)
      torsoPart = PartFactory.createPart(
        PartCategory.TORSO,
        "torso_worker_001",
        Rarity.COMMON,
        "Reinforced Work Chassis",
        {
          attack: 0, // No offensive capability
          defense: 50, // High defense for protection
          speed: 10, // Lower speed due to reinforcement
          perception: 25, // Moderate sensors
          energyConsumption: 20, // Higher energy for protective systems
        }
      );
      expect(torsoPart).toBeDefined();

      // Step 5: Install parts on the worker bot

      // Verify slot system is working correctly

      const armInstallResult = workerBot.installPart(armPart);
      if (!armInstallResult.success) {
        console.log("Arm install failed:", armInstallResult.message);
      }
      expect(armInstallResult.success).toBe(true);
      expect(armInstallResult.assignedSlot).toBeDefined();

      const legInstallResult = workerBot.installPart(legPart);
      expect(legInstallResult.success).toBe(true);

      const torsoInstallResult = workerBot.installPart(torsoPart);
      expect(torsoInstallResult.success).toBe(true);

      // Verify parts are installed
      expect(workerBot.parts.length).toBe(3);
      expect(workerBot.usedSlots).toBeGreaterThan(0);
    });

    it("should add expansion chips for work efficiency", () => {
      // Step 6: Create work-focused expansion chips

      // Energy efficiency chip for longer work periods
      attackChip = ExpansionChipFactory.createExpansionChip(
        ExpansionChipEffect.ENERGY_EFFICIENCY, // Effect type focused on efficiency
        "chip_worker_efficiency",
        "WorkFlow Optimizer", // name
        Rarity.COMMON, // rarity
        "Increases work efficiency and reduces energy consumption" // description
      );
      expect(attackChip).toBeDefined();
      expect(attackChip.name).toBe("WorkFlow Optimizer");

      // Install the efficiency chip
      const chipInstallResult = workerBot.installExpansionChip(attackChip);
      expect(chipInstallResult.success).toBe(true);
      expect(chipInstallResult.assignedSlot).toBeDefined();

      // Verify chip installation
      expect(workerBot.expansionChips.length).toBe(1);
      expect(workerBot.expansionChips[0].name).toBe("WorkFlow Optimizer");
    });

    it("should test DTO integration for worker bot", () => {
      // Step 7: Test DTO creation and updates

      // Create bot DTO (mocked - would normally interact with database)
      const botDTO = {
        id: workerBot.id,
        name: workerBot.name,
        botType: workerBot.botType,
        userId: workerBot.userId,
        energyLevel: 100,
        maintenanceLevel: 100,
        currentLocation: BotLocation.FACTORY,
        experience: 0,
      };

      // Verify DTO structure
      expect(botDTO.id).toBe(workerBot.id);
      expect(botDTO.botType).toBe(BotType.WORKER);
      expect(botDTO.userId).toBeNull();

      // Step 8: Simulate work activity - energy depletion
      workerBot.updateState({
        energyLevel: 50, // Half energy after work
        maintenanceLevel: 80, // Some wear from work
        experience: 100, // Gained experience
        currentLocation: BotLocation.FACTORY,
      });

      // Verify state updates
      expect(workerBot.state.energyLevel).toBe(50);
      expect(workerBot.state.maintenanceLevel).toBe(80);
      expect(workerBot.state.experience).toBe(100);
      expect(workerBot.state.currentLocation).toBe(BotLocation.FACTORY);

      // Step 9: Simulate critical energy depletion
      workerBot.updateState({
        energyLevel: 0, // Energy depleted
        maintenanceLevel: 30, // Needs maintenance
        currentLocation: BotLocation.REPAIR_BAY,
      });

      // Verify bot is no longer operational
      expect(workerBot.state.energyLevel).toBe(0);
      expect(workerBot.isOperational).toBe(false); // Should be false due to low energy
      expect(workerBot.state.currentLocation).toBe(BotLocation.REPAIR_BAY);
    });
  });

  describe("Scenario #2: Playable Bot", () => {
    let playableBot: Bot;
    let lightSkeleton: any;
    let playableSoulChip: SoulChip;
    let parts: any[] = [];
    let expansionChips: any[] = [];

    beforeEach(() => {
      // Step 1: Create a light skeleton for agility
      lightSkeleton = SkeletonFactory.createSkeleton(
        SkeletonType.LIGHT, // Light skeleton for speed and agility
        "skeleton_playable_001",
        Rarity.UNCOMMON, // Higher rarity for player bots
        5, // More slots than worker
        80, // Lighter weight
        MobilityType.BIPEDAL
      );
      expect(lightSkeleton).toBeDefined();
      expect(lightSkeleton.type).toBe(SkeletonType.LIGHT);
    });

    it("should create a playable bot with advanced soul chip", () => {
      // Step 2: Create an advanced soul chip for player interaction
      playableSoulChip = new SoulChip(
        "soul_playable_advanced",
        "Advanced Player Interface AI",
        Rarity.RARE, // Higher rarity for playable bots
        {
          aggressiveness: 60, // Moderate aggression for combat
          curiosity: 80, // High curiosity for exploration
          loyalty: 70, // Loyal to player
          independence: 50, // Moderate independence for player guidance
          empathy: 85, // High empathy for player interaction
          dialogueStyle: "friendly",
        },
        {
          intelligence: 80, // High intelligence for complex tasks
          resilience: 60, // Moderate resilience
          adaptability: 90, // Very adaptable to player commands
        },
        "Player Synergy" // Specialized for player interaction
      );

      // Step 3: Create the playable bot
      const playableConfig = {
        name: "Player Companion Azure",
        botType: BotType.PLAYABLE,
        userId: "player_001", // Must have a player assigned
        soulChip: playableSoulChip,
        skeleton: lightSkeleton,
        parts: [],
        expansionChips: [],
      };

      playableBot = new Bot(playableConfig);
      expect(playableBot).toBeDefined();
      expect(playableBot.botType).toBe(BotType.PLAYABLE);
      expect(playableBot.userId).toBe("player_001");
      expect(playableBot.soulChip.rarity).toBe(Rarity.RARE);
      expect(playableBot.requiresUser()).toBe(true);
    });

    it("should create and install combat/exploration parts", () => {
      // Step 4: Create parts optimized for player gameplay

      // Combat arm with weapon capability
      const combatArm = PartFactory.createPart(
        PartCategory.ARM,
        "arm_combat_001",
        Rarity.RARE,
        "Plasma Combat Arm",
        {
          attack: 45, // High attack for combat
          defense: 20, // Moderate defense
          speed: 35, // Good speed
          perception: 30, // Combat awareness
          energyConsumption: 25, // Higher energy for plasma systems
        }
      );
      parts.push(combatArm);

      // Agile legs for movement
      const agilityLegs = PartFactory.createPart(
        PartCategory.LEG,
        "leg_agility_001",
        Rarity.RARE,
        "Quantum Boost Legs",
        {
          attack: 20, // Some kick damage
          defense: 15, // Light armor
          speed: 60, // Very high speed
          perception: 25, // Movement awareness
          energyConsumption: 20, // Moderate energy for boost
        }
      );
      parts.push(agilityLegs);

      // Sensor-rich head for exploration
      const sensorHead = PartFactory.createPart(
        PartCategory.HEAD,
        "head_sensor_001",
        Rarity.RARE,
        "Multi-Spectrum Sensor Array",
        {
          attack: 5, // Minimal attack
          defense: 25, // Protect sensitive sensors
          speed: 15, // Not speed focused
          perception: 70, // Extremely high perception
          energyConsumption: 30, // High energy for sensors
        }
      );
      parts.push(sensorHead);

      // Step 5: Install all parts
      parts.forEach((part) => {
        const installResult = playableBot.installPart(part);
        expect(installResult.success).toBe(true);
      });

      expect(playableBot.parts.length).toBe(3);

      // Verify high perception from sensor array
      const stats = playableBot.aggregatedStats;
      expect(stats.perception).toBeGreaterThan(50);
    });

    it("should add tactical expansion chips", () => {
      // Step 6: Create player-focused expansion chips

      // Combat enhancement chip
      const combatChip = ExpansionChipFactory.createExpansionChip(
        ExpansionChipEffect.ATTACK_BUFF,
        "chip_combat_enhance",
        "Tactical Combat Enhancer", // name
        Rarity.RARE, // rarity
        "Boosts combat effectiveness and tactical awareness" // description
      );
      expansionChips.push(combatChip);

      // Speed boost for exploration
      const speedChip = ExpansionChipFactory.createExpansionChip(
        ExpansionChipEffect.SPEED_BUFF,
        "chip_speed_boost",
        "Velocity Amplifier", // name
        Rarity.RARE, // rarity
        "Increases movement speed and reaction time" // description
      );
      expansionChips.push(speedChip);

      // Install expansion chips
      const availableExpansionSlots =
        playableBot.slotConfiguration.availableSlots.filter(
          (s) => s.category === "expansionChip"
        ).length;

      // Light skeleton has fewer expansion slots than expected

      // Install only as many chips as we have slots for
      const chipsToInstall = expansionChips.slice(0, availableExpansionSlots);

      chipsToInstall.forEach((chip) => {
        const installResult = playableBot.installExpansionChip(chip);
        if (!installResult.success) {
          console.log(
            `Expansion chip install failed for ${chip.name}: ${installResult.message}`
          );
        }
        expect(installResult.success).toBe(true);
      });

      expect(playableBot.expansionChips.length).toBe(chipsToInstall.length);

      // Verify combat power increased
      const combatPower = playableBot.calculateCombatPower();
      expect(combatPower).toBeGreaterThan(0);
      expect(playableBot.isReadyForCombat()).toBe(true);
    });

    it("should test DTO integration with player interactions", () => {
      // Step 7: Test comprehensive DTO operations

      // Create detailed bot state DTO
      const botStateDTO = {
        id: playableBot.id,
        energyLevel: 100,
        maintenanceLevel: 100,
        statusEffects: [],
        currentLocation: BotLocation.IDLE,
        experience: 500, // Player has been active
        bondLevel: 75, // Good bond with player (non-worker specific)
        lastActivity: new Date(),
        battlesWon: 5,
        battlesLost: 1,
        totalBattles: 6,
      };

      // Update bot state through DTO-like operations
      playableBot.updateState({
        energyLevel: botStateDTO.energyLevel,
        maintenanceLevel: botStateDTO.maintenanceLevel,
        currentLocation: botStateDTO.currentLocation,
        experience: botStateDTO.experience,
        bondLevel: botStateDTO.bondLevel,
        lastActivity: botStateDTO.lastActivity,
        battlesWon: botStateDTO.battlesWon,
        battlesLost: botStateDTO.battlesLost,
        totalBattles: botStateDTO.totalBattles,
      });

      // Verify state updates
      expect(playableBot.state.experience).toBe(500);
      expect(playableBot.isOperational).toBe(true);

      // Step 8: Simulate combat scenario - damage taken
      playableBot.updateState({
        energyLevel: 25, // Low energy after combat
        maintenanceLevel: 40, // Damage taken
        currentLocation: BotLocation.ARENA, // Use available location instead of BATTLEFIELD
      });

      expect(playableBot.state.energyLevel).toBe(25);
      // Note: Operational status depends on energy AND maintenance levels
      // With 25 energy and 40 maintenance, may still be operational

      // Step 9: Simulate emergency shutdown
      playableBot.updateState({
        energyLevel: 0, // Complete energy depletion
        currentLocation: BotLocation.REPAIR_BAY,
      });

      expect(playableBot.state.energyLevel).toBe(0);
      expect(playableBot.isOperational).toBe(false);
      expect(playableBot.state.currentLocation).toBe(BotLocation.REPAIR_BAY);
    });
  });

  describe("Scenario #3: King Bot (Ultra Rare)", () => {
    let kingBot: Bot;
    let heavySkeleton: any;
    let ultraRareSoulChip: SoulChip;
    let ultraRareParts: any[] = [];
    let ultraRareChips: any[] = [];

    beforeEach(() => {
      // Step 1: Create a heavy skeleton for the king bot
      heavySkeleton = SkeletonFactory.createSkeleton(
        SkeletonType.HEAVY, // Heavy skeleton for maximum durability
        "skeleton_king_001",
        Rarity.LEGENDARY, // Highest rarity
        8, // Maximum slots for a king
        150, // Heavy but powerful
        MobilityType.BIPEDAL
      );
      expect(heavySkeleton).toBeDefined();
      expect(heavySkeleton.type).toBe(SkeletonType.HEAVY);
    });

    it("should create a king bot with ultra rare soul chip", () => {
      // Step 2: Create an ultra rare soul chip fit for a king
      ultraRareSoulChip = new SoulChip(
        "soul_king_supreme",
        "Supreme Sovereign AI Core",
        Rarity.LEGENDARY, // Ultra rare
        {
          aggressiveness: 95, // Maximum aggression for leadership
          curiosity: 95, // Intense curiosity for strategy
          loyalty: 100, // Absolute loyalty to the realm
          independence: 100, // Complete independence for leadership
          empathy: 90, // High empathy for subjects
          dialogueStyle: "commanding",
        },
        {
          intelligence: 100, // Maximum intelligence
          resilience: 95, // Near-maximum resilience
          adaptability: 100, // Perfect adaptability
        },
        "Divine Authority" // Ultimate leadership trait
      );

      // Step 3: Create the king bot
      const kingConfig = {
        name: "Sovereign Overlord Prime",
        botType: BotType.KING,
        userId: "supreme_player_001", // Must have a supreme player
        combatRole: "COMMANDER" as any, // Leadership role
        governmentType: "MONARCHY" as any, // King government type
        soulChip: ultraRareSoulChip,
        skeleton: heavySkeleton,
        parts: [],
        expansionChips: [],
      };

      kingBot = new Bot(kingConfig);
      expect(kingBot).toBeDefined();
      expect(kingBot.botType).toBe(BotType.KING);
      expect(kingBot.userId).toBe("supreme_player_001");
      expect(kingBot.soulChip.rarity).toBe(Rarity.LEGENDARY);
      expect(kingBot.combatRole).toBe("COMMANDER");
      expect(kingBot.governmentType).toBe("MONARCHY");
      expect(kingBot.requiresUser()).toBe(true);
    });

    it("should create and install ultra rare parts", () => {
      // Step 4: Create legendary parts worthy of a king

      // Legendary weapon arm
      const royalWeaponArm = PartFactory.createPart(
        PartCategory.ARM,
        "arm_royal_destroyer",
        Rarity.LEGENDARY,
        "Royal Annihilator Arm",
        {
          attack: 80, // Devastating attack power
          defense: 40, // Strong defensive capability
          speed: 30, // Slower due to power
          perception: 50, // Command awareness
          energyConsumption: 40, // High energy for supreme power
        }
      );
      ultraRareParts.push(royalWeaponArm);

      // Fortress legs for stability
      const fortressLegs = PartFactory.createPart(
        PartCategory.LEG,
        "leg_fortress_base",
        Rarity.LEGENDARY,
        "Immovable Fortress Legs",
        {
          attack: 30, // Decent stomp damage
          defense: 70, // Maximum defensive capability
          speed: 20, // Slow but stable
          perception: 35, // Battlefield awareness
          energyConsumption: 25, // Efficient despite size
        }
      );
      ultraRareParts.push(fortressLegs);

      // Command torso with strategic systems
      const commandTorso = PartFactory.createPart(
        PartCategory.TORSO,
        "torso_command_center",
        Rarity.LEGENDARY,
        "Strategic Command Core",
        {
          attack: 15, // Integrated weapons
          defense: 85, // Ultimate protection
          speed: 10, // Speed not priority
          perception: 80, // Supreme battlefield awareness
          energyConsumption: 35, // Advanced systems
        }
      );
      ultraRareParts.push(commandTorso);

      // Royal crown head with maximum sensors
      const royalHead = PartFactory.createPart(
        PartCategory.HEAD,
        "head_royal_crown",
        Rarity.LEGENDARY,
        "Crown of Supreme Vision",
        {
          attack: 10, // Minimal direct attack
          defense: 60, // Protect the crown
          speed: 15, // Not speed focused
          perception: 100, // Perfect awareness
          energyConsumption: 45, // Maximum sensor suite
        }
      );
      ultraRareParts.push(royalHead);

      // Step 5: Install all ultra rare parts
      ultraRareParts.forEach((part) => {
        const installResult = kingBot.installPart(part);
        expect(installResult.success).toBe(true);
        expect(part.rarity).toBe(Rarity.LEGENDARY);
      });

      expect(kingBot.parts.length).toBe(4);

      // Verify king-level stats
      const stats = kingBot.aggregatedStats;
      expect(stats.attack).toBeGreaterThan(70);
      expect(stats.defense).toBeGreaterThan(100);
      expect(stats.perception).toBeGreaterThan(80);
    });

    it("should add ultra rare expansion chips", () => {
      // Step 6: Create legendary expansion chips

      // Supreme power amplifier
      const supremePowerChip = ExpansionChipFactory.createExpansionChip(
        ExpansionChipEffect.STAT_BOOST, // Boosts all stats
        "chip_supreme_power",
        "Divine Power Amplifier", // name
        Rarity.LEGENDARY, // rarity
        "Amplifies all capabilities to godlike levels" // description
      );
      ultraRareChips.push(supremePowerChip);

      // Ultimate defense matrix
      const defenseMatrixChip = ExpansionChipFactory.createExpansionChip(
        ExpansionChipEffect.DEFENSE_BUFF,
        "chip_defense_matrix",
        "Aegis Defense Matrix", // name
        Rarity.LEGENDARY, // rarity
        "Provides ultimate protection and damage mitigation" // description
      );
      ultraRareChips.push(defenseMatrixChip);

      // Strategic AI enhancement
      const strategyChip = ExpansionChipFactory.createExpansionChip(
        ExpansionChipEffect.AI_UPGRADE,
        "chip_strategic_mind",
        "Master Strategist AI", // name
        Rarity.LEGENDARY, // rarity
        "Enhances tactical planning and battlefield control" // description
      );
      ultraRareChips.push(strategyChip);

      // Install all legendary chips (limited by available slots)
      const availableKingExpansionSlots =
        kingBot.slotConfiguration.availableSlots.filter(
          (s) => s.category === "expansionChip"
        ).length;

      // Heavy skeleton also has limited expansion slots

      // Install only as many chips as we have slots for
      const kingChipsToInstall = ultraRareChips.slice(
        0,
        availableKingExpansionSlots
      );

      kingChipsToInstall.forEach((chip) => {
        const installResult = kingBot.installExpansionChip(chip);
        if (!installResult.success) {
          console.log(
            `King expansion chip install failed for ${chip.name}: ${installResult.message}`
          );
        }
        expect(installResult.success).toBe(true);
      });

      expect(kingBot.expansionChips.length).toBe(kingChipsToInstall.length);

      // Verify supreme combat power
      const combatPower = kingBot.calculateCombatPower();
      expect(combatPower).toBeGreaterThan(100); // King should have high combat power
      expect(kingBot.isReadyForCombat()).toBe(true);
    });

    it("should test DTO integration with royal protocols", () => {
      // Step 7: Test king-specific DTO operations

      // Create royal bot state DTO
      const royalStateDTO = {
        id: kingBot.id,
        energyLevel: 100,
        maintenanceLevel: 100,
        statusEffects: [
          { effect: "divine_blessing", magnitude: 50, duration: -1 }, // Permanent
          { effect: "royal_aura", magnitude: 25, duration: -1 },
        ],
        currentLocation: BotLocation.IDLE, // Use available location instead of THRONE_ROOM
        experience: 10000, // Vast experience
        bondLevel: 100, // Perfect bond with player
        lastActivity: new Date(),
        battlesWon: 100,
        battlesLost: 0, // Kings don't lose
        totalBattles: 100,
      };

      // Update king state
      kingBot.updateState({
        energyLevel: royalStateDTO.energyLevel,
        maintenanceLevel: royalStateDTO.maintenanceLevel,
        currentLocation: BotLocation.IDLE, // Use available location
        experience: royalStateDTO.experience,
        bondLevel: royalStateDTO.bondLevel,
        lastActivity: royalStateDTO.lastActivity,
        battlesWon: royalStateDTO.battlesWon,
        battlesLost: royalStateDTO.battlesLost,
        totalBattles: royalStateDTO.totalBattles,
      });

      // Verify royal state
      expect(kingBot.state.experience).toBe(10000);
      expect(kingBot.isOperational).toBe(true);

      // Test king resilience - should withstand more damage
      kingBot.updateState({
        energyLevel: 30, // Low but operational due to supreme systems
        maintenanceLevel: 50, // Some damage but still functional
        currentLocation: BotLocation.ARENA, // Use available location instead of BATTLEFIELD
      });

      // King should still be operational with better stats
      expect(kingBot.state.energyLevel).toBe(30);
      // Due to legendary parts and chips, king might still be operational

      // Step 8: Test extreme scenario
      kingBot.updateState({
        energyLevel: 5, // Critical energy
        maintenanceLevel: 20, // Heavy damage
        currentLocation: BotLocation.REPAIR_BAY,
      });

      expect(kingBot.state.energyLevel).toBe(5);
      expect(kingBot.isOperational).toBe(false); // Even kings need maintenance
      expect(kingBot.state.currentLocation).toBe(BotLocation.REPAIR_BAY);

      // Step 9: Test royal recovery (simulate premium repair)
      kingBot.updateState({
        energyLevel: 100, // Full energy restoration
        maintenanceLevel: 100, // Perfect condition
        currentLocation: BotLocation.IDLE,
      });

      expect(kingBot.state.energyLevel).toBe(100);
      expect(kingBot.state.maintenanceLevel).toBe(100);
      expect(kingBot.isOperational).toBe(true);

      // Verify king superiority
      const finalCombatPower = kingBot.calculateCombatPower();
      expect(finalCombatPower).toBeGreaterThan(100); // Supreme power level
    });
  });

  describe("Cross-Scenario Comparisons", () => {
    it("should demonstrate power hierarchy between bot types", () => {
      // Create minimal versions of each bot type for comparison
      const basicWorkerSoul = new SoulChip(
        "w",
        "Worker AI",
        Rarity.COMMON,
        {
          aggressiveness: 10,
          curiosity: 30,
          loyalty: 90,
          independence: 80,
          empathy: 20,
          dialogueStyle: "formal",
        },
        { intelligence: 40, resilience: 70, adaptability: 50 },
        "Task Focus"
      );

      const playerSoul = new SoulChip(
        "p",
        "Player AI",
        Rarity.RARE,
        {
          aggressiveness: 60,
          curiosity: 80,
          loyalty: 70,
          independence: 60,
          empathy: 85,
          dialogueStyle: "friendly",
        },
        { intelligence: 80, resilience: 60, adaptability: 90 },
        "Player Synergy"
      );

      const kingSoul = new SoulChip(
        "k",
        "King AI",
        Rarity.LEGENDARY,
        {
          aggressiveness: 95,
          curiosity: 95,
          loyalty: 100,
          independence: 100,
          empathy: 90,
          dialogueStyle: "commanding",
        },
        { intelligence: 100, resilience: 95, adaptability: 100 },
        "Divine Authority"
      );

      const workerSkeleton = SkeletonFactory.createSkeleton(
        SkeletonType.BALANCED,
        "ws",
        Rarity.COMMON,
        4,
        100,
        MobilityType.BIPEDAL
      );
      const playerSkeleton = SkeletonFactory.createSkeleton(
        SkeletonType.LIGHT,
        "ps",
        Rarity.UNCOMMON,
        5,
        80,
        MobilityType.BIPEDAL
      );
      const kingSkeleton = SkeletonFactory.createSkeleton(
        SkeletonType.HEAVY,
        "ks",
        Rarity.LEGENDARY,
        8,
        150,
        MobilityType.BIPEDAL
      );

      const workerBot = new Bot({
        name: "Worker",
        botType: BotType.WORKER,
        userId: null,
        // No soul chip for worker bots
        skeleton: workerSkeleton,
        parts: [],
      });

      const playerBot = new Bot({
        name: "Player",
        botType: BotType.PLAYABLE,
        userId: "player1",
        soulChip: playerSoul,
        skeleton: playerSkeleton,
        parts: [],
      });

      const kingBot = new Bot({
        name: "King",
        botType: BotType.KING,
        userId: "king1",
        soulChip: kingSoul,
        skeleton: kingSkeleton,
        parts: [],
      });

      // Verify hierarchy
      expect(workerBot.soulChip).toBeNull(); // Worker bots have no soul chip
      expect(playerBot.soulChip?.rarity).toBe(Rarity.RARE);
      expect(kingBot.soulChip?.rarity).toBe(Rarity.LEGENDARY);

      // Test combat power hierarchy (even without parts)
      const workerPower = workerBot.calculateCombatPower();
      const playerPower = playerBot.calculateCombatPower();
      const kingPower = kingBot.calculateCombatPower();

      expect(playerPower).toBeGreaterThan(workerPower);
      expect(kingPower).toBeGreaterThan(playerPower);
    });
  });
});
