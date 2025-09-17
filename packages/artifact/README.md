# @botking/artifact

A comprehensive artifact system for the Botking game, providing classes and utilities for managing bot components.

## Overview

The artifact system consists of five main components that work together to create unique, customizable bots:

### 1. Soul Chip (Core)

The heart of the bot that defines personality, AI traits, and special abilities.

**Properties:**

- `id`: Unique identifier
- `name`: Display name (e.g., "Prototype Alpha")
- `rarity`: From common to legendary/prototype
- `personality`: AI traits, quirks, dialogue style
- `baseStats`: Intelligence, resilience, adaptability
- `specialTrait`: Unique ability tied to this chip

### 2. Skeleton System (Frame)

A modular skeleton system with specialized classes for each skeleton type, providing unique abilities and characteristics.

**Architecture:**

- `ISkeleton`: Interface defining the contract for all skeletons
- `BaseSkeleton`: Abstract base class with shared functionality
- Concrete classes: `LightSkeleton`, `BalancedSkeleton`, `HeavySkeleton`, `FlyingSkeleton`, `ModularSkeleton`
- `SkeletonFactory`: Factory for creating and managing skeletons

**Common Properties:**

- `id`: Unique identifier
- `type`: Light, balanced, heavy, flying, modular
- `rarity`: Affects durability and slot bonuses
- `slots`: Number of parts/expansion chips that can be installed
- `baseDurability`: HP modifier
- `mobilityType`: Wheeled, bipedal, winged, tracked, hybrid

**Type-Specific Features:**

- **Light Skeleton**: Speed burst, stealth mode, energy conservation
- **Balanced Skeleton**: Tactical adaptation, situation analysis, learning from combat
- **Heavy Skeleton**: Siege mode, fortress mode, devastating charge attacks
- **Flying Skeleton**: Aerial movement, dive attacks, reconnaissance
- **Modular Skeleton**: Hot-swappable parts, multiple configurations, field customization

### 3. Part System (Modular Equipment)

A modular part system with specialized classes for each part category, providing detailed mechanics and category-specific capabilities.

**Architecture:**

- `IPart`: Interface defining the contract for all parts
- `BasePart`: Abstract base class with shared functionality
- Specialized classes: `ArmPart`, `LegPart`, `TorsoPart`, `HeadPart`
- `PartFactory`: Factory for creating and managing parts

**Common Properties:**

- `id`: Unique identifier
- `category`: ARM, LEG, TORSO, HEAD, ACCESSORY
- `rarity`: Affects stat multipliers and upgrade limits
- `stats`: Attack, defense, speed, perception, energy consumption
- `abilities`: Special combat abilities
- `upgradeLevel`: Enhancement level (0-25 depending on rarity)
- `currentDurability`: Current condition of the part

**Specialized Features:**

- **Arm Part**: Dual wielding, power strikes, weapon mastery, tool operations
- **Leg Part**: Turbo boost, earth shaker, double jump, terrain traversal
- **Torso Part**: Reactive armor, energy overload, thermal management, fortress mode
- **Head Part**: Battle analysis, mind link, sensor arrays, targeting systems

### 4. Expansion Chip System (Enhancers)

A modular expansion chip system with specialized classes for each effect type, providing detailed mechanics and advanced capabilities.

**Architecture:**

- `IExpansionChip`: Interface defining the contract for all expansion chips
- `BaseExpansionChip`: Abstract base class with shared functionality
- Specialized classes: `AttackBuffChip`, `DefenseBuffChip`, `SpeedBuffChip`, `AIUpgradeChip`
- `ExpansionChipFactory`: Factory for creating and managing expansion chips

**Common Properties:**

- `id`: Unique identifier
- `effect`: Type of enhancement (attack buff, AI upgrade, etc.)
- `rarity`: Determines effect magnitude
- `upgradeLevel`: Scales the effect
- `name`: Display name for the chip
- `description`: Detailed description of the chip's function

**Specialized Features:**

- **Attack Buff Chip**: Berserker mode, weapon mastery, combo multipliers
- **Defense Buff Chip**: Fortress mode, damage reflection, adaptive armor
- **Speed Buff Chip**: Time dilation, evasion bonuses, movement optimization
- **AI Upgrade Chip**: Neural overclock, pattern recognition, decision analysis

### 5. Bot State (Dynamic Runtime)

Live state that makes bots feel alive during gameplay.

**Properties:**

- `energyLevel`: Needed for battles (0-100)
- `maintenanceLevel`: Wear & tear affecting performance (0-100)
- `statusEffects`: Temporary buffs/debuffs
- `bondLevel`: Player-bot relationship (0-100)
- `currentLocation`: Where the bot currently is
- `experience`: Total experience points
- Battle statistics and customizations

## Usage

### Basic Setup

```typescript
import {
  SoulChip,
  SkeletonFactory,
  LightSkeleton,
  HeavySkeleton,
  FlyingSkeleton,
  ModularSkeleton,
  PartFactory,
  ArmPart,
  LegPart,
  TorsoPart,
  HeadPart,
  ExpansionChipFactory,
  AttackBuffChip,
  DefenseBuffChip,
  SpeedBuffChip,
  AIUpgradeChip,
  BotState,
  ArtifactFactory,
  BotAssembler,
  Rarity,
  SkeletonType,
  PartCategory,
  ExpansionChipEffect,
} from "@botking/artifact";

// Create a basic bot
const basicBot = BotAssembler.createBasicBot("My First Bot");

// Or create components individually
const soulChip = new SoulChip(
  "soul_001",
  "Alpha Prototype",
  Rarity.LEGENDARY,
  {
    aggressiveness: 75,
    curiosity: 90,
    loyalty: 85,
    independence: 60,
    empathy: 70,
    dialogueStyle: "quirky",
  },
  {
    intelligence: 25,
    resilience: 20,
    adaptability: 30,
  },
  "Rapid Learning Protocol"
);

// Create specific skeleton types using the factory
const flyingSkeleton = SkeletonFactory.createSkeleton(
  SkeletonType.FLYING,
  "skel_001",
  Rarity.EPIC,
  6, // slots
  150, // durability
  MobilityType.WINGED
) as FlyingSkeleton;

// Or create directly
const lightSkeleton = new LightSkeleton(
  "light_001",
  Rarity.RARE,
  4,
  90,
  MobilityType.BIPEDAL
);
```

### Working with Parts

```typescript
// Create a powerful arm part
const plasmaCannon = new Part(
  "arm_plasma_001",
  PartCategory.ARM,
  Rarity.LEGENDARY,
  "Plasma Cannon Mk.III",
  {
    attack: 85,
    defense: 15,
    speed: 20,
    perception: 30,
    energyConsumption: 45,
  },
  [
    {
      id: "plasma_blast",
      name: "Plasma Blast",
      description: "High-energy plasma projectile",
      cooldown: 3,
      energyCost: 25,
      effect: JSON.stringify({ damage: 120, range: 50 }),
    },
  ]
);

// Upgrade the part
plasmaCannon.upgrade(); // Increases stats by 10%
```

### Managing Bot State

```typescript
const botState = new BotState();

// Simulate battle
botState.recordBattleResult(true, 150); // Won battle, gained 150 XP

// Check condition
const condition = botState.getConditionRating();
console.log(`Overall condition: ${condition.overall}%`);
console.log(`Bond level: ${botState.getBondTierName()}`);

// Perform maintenance
if (botState.needsMaintenance()) {
  const result = botState.performMaintenance(1.0); // High quality maintenance
  console.log(`Restored ${result.maintenanceRestored} maintenance points`);
}
```

### Advanced Skeleton Features

```typescript
// Heavy skeleton siege mode
const heavySkeleton = SkeletonFactory.createSkeleton(
  SkeletonType.HEAVY,
  "heavy_001",
  Rarity.LEGENDARY,
  5,
  200,
  MobilityType.TRACKED
) as HeavySkeleton;

const siegeMode = heavySkeleton.enterSiegeMode();
console.log("Siege bonuses:", siegeMode.bonuses);
console.log("Duration:", siegeMode.duration);

// Flying skeleton dive attack
const diveAttack = flyingSkeleton.performDiveAttack(100, 30, "ground");
console.log("Dive damage:", diveAttack.damage);

// Modular skeleton reconfiguration
const modularSkeleton = SkeletonFactory.createSkeleton(
  SkeletonType.MODULAR,
  "mod_001",
  Rarity.EPIC,
  6,
  120,
  MobilityType.HYBRID
) as ModularSkeleton;

const reconfig = modularSkeleton.changeConfiguration("assault");
if (reconfig.success) {
  console.log("New bonuses:", reconfig.newBonuses);
}

// Factory recommendations
const recommendations = SkeletonFactory.getRecommendedSkeletonType("stealth");
console.log("Recommended type:", recommendations.primaryType);
console.log("Reasoning:", recommendations.reasoning);
```

### Advanced Expansion Chip Features

```typescript
// Attack buff chip with berserker mode
const attackChip = ExpansionChipFactory.createExpansionChip(
  ExpansionChipEffect.ATTACK_BUFF,
  "attack_001",
  "Berserker Core",
  Rarity.LEGENDARY,
  "Ultimate offensive enhancement"
) as AttackBuffChip;

// Upgrade to unlock berserker mode
for (let i = 0; i < 5; i++) {
  attackChip.upgrade();
}

const canBerserk = attackChip.canActivateBerserkerMode(25, 100); // At 25% health
console.log("Berserker mode available:", canBerserk);

// Defense buff chip with fortress mode
const defenseChip = ExpansionChipFactory.createExpansionChip(
  ExpansionChipEffect.DEFENSE_BUFF,
  "defense_001",
  "Guardian Matrix",
  Rarity.EPIC,
  "Advanced defensive system"
) as DefenseBuffChip;

const fortressReady = defenseChip.canActivateFortressMode(75); // High incoming damage
console.log("Fortress mode ready:", fortressReady);

// AI upgrade chip with neural overclock
const aiChip = ExpansionChipFactory.createExpansionChip(
  ExpansionChipEffect.AI_UPGRADE,
  "ai_001",
  "Neural Core",
  Rarity.PROTOTYPE,
  "Quantum AI processing unit"
) as AIUpgradeChip;

// Upgrade to unlock neural overclock
for (let i = 0; i < 7; i++) {
  aiChip.upgrade();
}

const patterns = aiChip.recognizePatterns(1000, 0.5);
console.log("Patterns found:", patterns.patternsFound);

// Factory recommendations for builds
const chipRecs = ExpansionChipFactory.getRecommendedExpansionChip("aggressive");
console.log("Recommended chip for aggressive build:", chipRecs.primaryEffect);
```

### Advanced Part Features

```typescript
// Arm part with dual wielding
const armPart = PartFactory.createPart(
  PartCategory.ARM,
  "arm_001",
  "Combat Manipulator",
  Rarity.EPIC,
  { attack: 70, defense: 30, speed: 40, perception: 30, energyConsumption: 8 }
) as ArmPart;

// Upgrade to unlock dual wielding
for (let i = 0; i < 7; i++) {
  armPart.upgrade();
}

const canDualWield = armPart.canDualWield(armPart);
console.log("Dual wielding capable:", canDualWield.capable);

// Leg part with turbo boost
const legPart = PartFactory.createPart(
  PartCategory.LEG,
  "leg_001",
  "Speed System",
  Rarity.LEGENDARY,
  { attack: 25, defense: 35, speed: 80, perception: 20, energyConsumption: 10 }
) as LegPart;

// Upgrade to unlock turbo boost
for (let i = 0; i < 9; i++) {
  legPart.upgrade();
}

const turboCapable = legPart.canActivateTurboBoost();
console.log("Turbo boost available:", turboCapable.available);

// Head part with battle analysis
const headPart = PartFactory.createPart(
  PartCategory.HEAD,
  "head_001",
  "Tactical Processor",
  Rarity.PROTOTYPE,
  { attack: 15, defense: 40, speed: 25, perception: 95, energyConsumption: 12 }
) as HeadPart;

// Upgrade to unlock battle analysis
for (let i = 0; i < 9; i++) {
  headPart.upgrade();
}

const battleAnalysis = headPart.analyzeBattleSituation({
  allies: 3,
  enemies: 5,
  terrain: "advantageous",
  objectives: ["capture_point"],
  timeRemaining: 300,
});
console.log("Tactical advantage:", battleAnalysis.tacticalAdvantage);

// Part factory recommendations for builds
const sniperHead = PartFactory.getRecommendedPart(
  "sniper",
  PartCategory.HEAD,
  Rarity.EPIC
);
console.log("Recommended sniper head:", sniperHead.name);

// Part set validation
const partSet = PartFactory.createBasicPartSet(Rarity.RARE);
const validation = PartFactory.validatePartConfiguration(
  Object.values(partSet)
);
console.log("Part set overall rating:", validation.overallRating);
```

### Validation

```typescript
// Validate bot configuration
const validation = BotAssembler.validateConfiguration(
  flyingSkeleton,
  [plasmaCannon /* other parts */],
  [
    /* expansion chips */
  ]
);

if (!validation.valid) {
  console.error("Configuration errors:", validation.errors);
}

// Validate skeleton balance
const balanceCheck = SkeletonFactory.validateSkeletonBalance(heavySkeleton);
console.log("Balance score:", balanceCheck.balanceScore);
```

## Features

- **Type Safety**: Full TypeScript support with comprehensive type definitions
- **Rarity System**: Affects stats, upgrade limits, and special abilities
- **Upgrade System**: Parts and chips can be enhanced with diminishing returns
- **Status Effects**: Temporary modifications with duration tracking
- **Bond System**: Player-bot relationship affects responsiveness and morale
- **Experience System**: Bots gain experience and level up over time
- **Compatibility Checking**: Validates part-skeleton compatibility
- **Serialization**: All classes support JSON serialization for persistence
- **Factory Methods**: Easy creation of common configurations

## API Reference

### Classes

**Core Classes:**

- `SoulChip`: Core AI personality and traits
- `Part`: Modular equipment for combat roles
- `ExpansionChip`: Slot-based enhancers
- `BotState`: Dynamic runtime state

**Skeleton System:**

- `ISkeleton`: Interface for all skeleton types
- `BaseSkeleton`: Abstract base class with shared functionality
- `LightSkeleton`: Fast, agile skeletons with stealth capabilities
- `BalancedSkeleton`: Versatile skeletons good at everything
- `HeavySkeleton`: Tanky skeletons with siege capabilities
- `FlyingSkeleton`: Aerial skeletons with flight and dive attacks
- `ModularSkeleton`: Highly customizable skeletons with hot-swap capabilities
- `SkeletonFactory`: Factory for creating and managing skeletons

**Expansion Chip System:**

- `IExpansionChip`: Interface for all expansion chip types
- `BaseExpansionChip`: Abstract base class with shared functionality
- `AttackBuffChip`: Offensive enhancement with berserker mode capabilities
- `DefenseBuffChip`: Defensive enhancement with fortress mode capabilities
- `SpeedBuffChip`: Speed enhancement with time dilation capabilities
- `AIUpgradeChip`: AI enhancement with neural overclock capabilities
- `ExpansionChipFactory`: Factory for creating and managing expansion chips

### Utilities

- `ArtifactFactory`: Create basic artifacts
- `BotAssembler`: Assemble and validate complete bots

### Enums

- `Rarity`: Common to Prototype
- `SkeletonType`: Light, Balanced, Heavy, Flying, Modular
- `MobilityType`: Wheeled, Bipedal, Winged, Tracked, Hybrid
- `PartCategory`: Arm, Leg, Torso, Head, Accessory
- `StatusEffect`: Various temporary effects
- `BotLocation`: Arena, Factory, Idle, Repair Bay, etc.
- `ExpansionChipEffect`: Different enhancement types

## License

MIT
