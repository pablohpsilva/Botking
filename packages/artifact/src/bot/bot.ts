import type { SoulChip } from "../soul-chip";
import type { ISkeleton } from "../skeleton";
import type { IPart } from "../part";
import type { IExpansionChip } from "../expansion-chip";
import type { CombatStats, Ability, BotType } from "../types";
import { BotLocation } from "../types";
import type { IBotState } from "../bot-state/bot-state-interface";
import { BotStateFactory } from "../bot-state/bot-state-factory";
import type {
  IBot,
  BotConfiguration,
  BotAssemblyResult,
  BotUpgradeResult,
} from "./bot-interface";

/**
 * Bot state interface for partial updates
 */
interface BotStateUpdate {
  energyLevel?: number;
  maintenanceLevel?: number;
  statusEffects?: any[];
  currentLocation?: BotLocation;
  experience?: number;
  customizations?: Map<string, any>;

  // Non-worker specific (will be ignored for worker bots)
  bondLevel?: number;
  lastActivity?: Date;
  battlesWon?: number;
  battlesLost?: number;
  totalBattles?: number;
}

/**
 * Complete Bot artifact implementation
 * Represents a fully assembled robot with all components
 */
export class Bot implements IBot {
  private _id: string;
  private _name: string;
  private _botType: BotType;
  private _ownerId: string | null;
  private _playerId: string | null;
  private _version: string;
  private _soulChip: SoulChip;
  private _skeleton: ISkeleton;
  private _parts: Map<string, IPart>;
  private _expansionChips: Map<string, IExpansionChip>;
  private _state: IBotState;
  private _assemblyDate: Date;
  private _lastModified: Date;
  private _assemblyVersion: number;
  private _metadata: Record<string, any>;

  constructor(config: BotConfiguration) {
    this._id =
      config.id ||
      `bot_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    this._name = config.name;
    this._botType = config.botType;
    this._ownerId = config.ownerId || null;
    this._playerId = config.playerId || null;
    this._version = "1.0.0";

    // Validate bot type and ownership rules
    this._validateBotTypeRules();
    this._soulChip = config.soulChip;
    this._skeleton = config.skeleton;
    this._parts = new Map();
    this._expansionChips = new Map();
    this._assemblyDate = new Date();
    this._lastModified = new Date();
    this._assemblyVersion = 1;
    this._metadata = config.metadata || {};

    // Initialize parts
    if (config.parts) {
      config.parts.forEach((part) => {
        this._parts.set(part.id, part);
      });
    }

    // Initialize expansion chips
    if (config.expansionChips) {
      config.expansionChips.forEach((chip) => {
        this._expansionChips.set(chip.id, chip);
      });
    }

    // Initialize state using the appropriate factory based on bot type
    this._state = BotStateFactory.createDefaultState(
      this._botType,
      config.initialState
    );

    // Validate assembly
    const validation = this.validateAssembly();
    if (!validation.valid) {
      throw new Error(
        `Bot assembly validation failed: ${validation.errors.join(", ")}`
      );
    }
  }

  // Getters for readonly properties
  get id(): string {
    return this._id;
  }
  get name(): string {
    return this._name;
  }
  get botType(): BotType {
    return this._botType;
  }
  get ownerId(): string | null {
    return this._ownerId;
  }
  get playerId(): string | null {
    return this._playerId;
  }
  get version(): string {
    return this._version;
  }
  get soulChip(): SoulChip {
    return this._soulChip;
  }
  get skeleton(): ISkeleton {
    return this._skeleton;
  }
  get parts(): ReadonlyArray<IPart> {
    return Array.from(this._parts.values());
  }
  get expansionChips(): ReadonlyArray<IExpansionChip> {
    return Array.from(this._expansionChips.values());
  }
  get state(): IBotState {
    return this._state;
  }
  get assemblyDate(): Date {
    return this._assemblyDate;
  }
  get lastModified(): Date {
    return this._lastModified;
  }
  get assemblyVersion(): number {
    return this._assemblyVersion;
  }

  // Computed properties
  get isAssembled(): boolean {
    return this._parts.size > 0 && !!this._soulChip && !!this._skeleton;
  }

  get isOperational(): boolean {
    return (
      this.isAssembled &&
      this._state.energyLevel > 0 &&
      this._state.maintenanceLevel > 20 &&
      this._state.currentLocation !== BotLocation.REPAIR_BAY
    );
  }

  get totalSlots(): number {
    return this._skeleton.getTotalSlots();
  }

  get usedSlots(): number {
    return this._parts.size + this._expansionChips.size;
  }

  get availableSlots(): number {
    return Math.max(0, this.totalSlots - this.usedSlots);
  }

  get aggregatedStats(): CombatStats {
    const baseStats: CombatStats = {
      attack: 0,
      defense: 0,
      speed: 0,
      perception: 0,
      energyConsumption: 0,
    };

    // Add skeleton base stats
    const skeletonCharacteristics = this._skeleton.getTypeCharacteristics();
    baseStats.defense += skeletonCharacteristics.defenseModifier || 0;
    baseStats.speed += skeletonCharacteristics.speedModifier || 0;
    baseStats.energyConsumption +=
      100 - skeletonCharacteristics.energyEfficiency || 10;

    // Add part stats
    this._parts.forEach((part) => {
      const effectiveStats = part.getEffectiveStats();
      baseStats.attack += effectiveStats.attack;
      baseStats.defense += effectiveStats.defense;
      baseStats.speed += effectiveStats.speed;
      baseStats.perception += effectiveStats.perception;
      baseStats.energyConsumption += effectiveStats.energyConsumption;
    });

    // Apply expansion chip effects
    this._expansionChips.forEach((chip) => {
      const magnitude = chip.getEffectMagnitude();
      // Simple stat boost application (can be expanded)
      switch (chip.effect) {
        case "attack_buff":
          baseStats.attack *= 1 + magnitude / 100;
          break;
        case "defense_buff":
          baseStats.defense *= 1 + magnitude / 100;
          break;
        case "speed_buff":
          baseStats.speed *= 1 + magnitude / 100;
          break;
        case "stat_boost":
          baseStats.attack *= 1 + magnitude / 200;
          baseStats.defense *= 1 + magnitude / 200;
          baseStats.speed *= 1 + magnitude / 200;
          baseStats.perception *= 1 + magnitude / 200;
          break;
      }
    });

    // Round all stats
    return {
      attack: Math.round(baseStats.attack),
      defense: Math.round(baseStats.defense),
      speed: Math.round(baseStats.speed),
      perception: Math.round(baseStats.perception),
      energyConsumption: Math.round(baseStats.energyConsumption),
    };
  }

  get totalWeight(): number {
    let weight = 100; // Base skeleton weight

    // Add skeleton weight based on type
    switch (this._skeleton.type) {
      case "heavy":
        weight += 50;
        break;
      case "light":
        weight -= 20;
        break;
      case "flying":
        weight -= 10;
        break;
      default:
        break; // balanced stays at base
    }

    this._parts.forEach((part) => {
      // Use part stats to estimate weight
      const stats = part.getEffectiveStats();
      weight += (stats.attack + stats.defense) / 5;
    });

    this._expansionChips.forEach((chip) => {
      // Chips are lightweight
      weight += 5;
    });

    return Math.round(weight);
  }

  get powerRequirement(): number {
    return this.aggregatedStats.energyConsumption;
  }

  get maxEnergy(): number {
    let baseEnergy = 100;

    // Soul chip intelligence affects energy capacity
    baseEnergy += this._soulChip.baseStats.intelligence * 0.5;

    // Skeleton may affect energy capacity
    if (this._skeleton.type === "light") {
      baseEnergy *= 0.8;
    } else if (this._skeleton.type === "heavy") {
      baseEnergy *= 1.2;
    }

    // Apply expansion chip effects
    this._expansionChips.forEach((chip) => {
      if (chip.effect === "energy_efficiency") {
        baseEnergy *= 1.1;
      }
    });

    return Math.round(baseEnergy);
  }

  get availableAbilities(): ReadonlyArray<Ability> {
    const abilities: Ability[] = [];

    // Soul chip abilities
    if (this._soulChip.specialTrait) {
      abilities.push({
        id: `soul_${this._soulChip.id}`,
        name: this._soulChip.specialTrait,
        description: `Special trait: ${this._soulChip.specialTrait}`,
        cooldown: 10,
        energyCost: 15,
        effect: JSON.stringify({
          type: "soul_trait",
          trait: this._soulChip.specialTrait,
        }),
      });
    }

    // Part abilities
    this._parts.forEach((part) => {
      const partAbilities = part.getAvailableAbilities();
      abilities.push(...partAbilities);
    });

    // Expansion chip abilities
    this._expansionChips.forEach((chip) => {
      abilities.push({
        id: `chip_${chip.id}`,
        name: `${chip.name} Effect`,
        description: chip.description,
        cooldown: 5,
        energyCost: chip.getEnergyCost(),
        effect: JSON.stringify({ type: "chip_effect", effect: chip.effect }),
      });
    });

    return abilities;
  }

  get activeEffects(): ReadonlyArray<string> {
    const effects: string[] = [];

    // State effects
    this._state.statusEffects.forEach((effect: any) => {
      effects.push(`${effect.effect}:${effect.magnitude}`);
    });

    // Expansion chip effects
    this._expansionChips.forEach((chip: IExpansionChip) => {
      effects.push(`${chip.effect}:${chip.upgradeLevel}`);
    });

    return effects;
  }

  // Assembly operations
  installPart(part: IPart): boolean {
    if (this.availableSlots <= 0) {
      return false;
    }

    if (!this._skeleton.isCompatibleWithPart(part.category)) {
      return false;
    }

    // Check for duplicate categories (optional business rule)
    const existingPart = Array.from(this._parts.values()).find(
      (p) => p.category === part.category
    );
    if (existingPart) {
      return false; // Only one part per category
    }

    this._parts.set(part.id, part);
    this._lastModified = new Date();
    this._assemblyVersion++;
    return true;
  }

  removePart(partId: string): boolean {
    if (!this._parts.has(partId)) {
      return false;
    }

    this._parts.delete(partId);
    this._lastModified = new Date();
    this._assemblyVersion++;
    return true;
  }

  installExpansionChip(chip: IExpansionChip): boolean {
    if (this.availableSlots <= 0) {
      return false;
    }

    this._expansionChips.set(chip.id, chip);
    this._lastModified = new Date();
    this._assemblyVersion++;
    return true;
  }

  removeExpansionChip(chipId: string): boolean {
    if (!this._expansionChips.has(chipId)) {
      return false;
    }

    this._expansionChips.delete(chipId);
    this._lastModified = new Date();
    this._assemblyVersion++;
    return true;
  }

  // State management
  updateState(newState: BotStateUpdate): void {
    // Update individual properties of existing state
    if (newState.energyLevel !== undefined) {
      this._state.energyLevel = newState.energyLevel;
    }
    if (newState.maintenanceLevel !== undefined) {
      this._state.maintenanceLevel = newState.maintenanceLevel;
    }
    if (newState.currentLocation !== undefined) {
      this._state.updateLocation(newState.currentLocation);
    }
    if (newState.experience !== undefined) {
      this._state.experience = newState.experience;
    }
    if (newState.customizations !== undefined) {
      newState.customizations.forEach((value, key) => {
        this._state.setCustomization(key, value);
      });
    }

    // Handle non-worker specific properties
    const nonWorkerState = this._state as any;
    if (
      newState.bondLevel !== undefined &&
      typeof nonWorkerState.updateBondLevel === "function"
    ) {
      const currentBond = nonWorkerState.bondLevel || 0;
      nonWorkerState.updateBondLevel(newState.bondLevel - currentBond);
    }
    if (
      newState.lastActivity !== undefined &&
      typeof nonWorkerState.updateLastActivity === "function"
    ) {
      nonWorkerState.lastActivity = newState.lastActivity;
    }
    if (
      newState.battlesWon !== undefined &&
      nonWorkerState.battlesWon !== undefined
    ) {
      nonWorkerState.battlesWon = newState.battlesWon;
    }
    if (
      newState.battlesLost !== undefined &&
      nonWorkerState.battlesLost !== undefined
    ) {
      nonWorkerState.battlesLost = newState.battlesLost;
    }
    if (
      newState.totalBattles !== undefined &&
      nonWorkerState.totalBattles !== undefined
    ) {
      nonWorkerState.totalBattles = newState.totalBattles;
    }

    this._lastModified = new Date();
  }

  activate(): boolean {
    if (!this.isOperational) {
      return false;
    }

    this._state.updateLocation(BotLocation.IDLE);
    this._lastModified = new Date();
    return true;
  }

  deactivate(): void {
    this._state.updateLocation(BotLocation.STORAGE);
    this._lastModified = new Date();
  }

  reset(): void {
    // Create a fresh state with some preserved values
    const preservedConfig = {
      experience: this._state.experience,
      customizations: this._state.customizations,
    };

    // Add non-worker specific preserved values if applicable
    if (this._state.getStateType() === "non-worker") {
      const nonWorkerState = this._state as any;
      (preservedConfig as any).bondLevel = nonWorkerState.bondLevel;
    }

    this._state = BotStateFactory.createDefaultState(this._botType, {
      ...preservedConfig,
      energyLevel: this.maxEnergy,
      maintenanceLevel: 100,
      currentLocation: BotLocation.FACTORY,
    });
    this._lastModified = new Date();
  }

  // Player assignment management
  assignPlayer(playerId: string): boolean {
    if (!this.canAssignPlayer()) {
      return false;
    }

    if (!playerId || playerId.trim().length === 0) {
      return false;
    }

    this._playerId = playerId;
    this._lastModified = new Date();
    return true;
  }

  unassignPlayer(): boolean {
    if (!this.canBeUnassigned()) {
      return false;
    }

    this._playerId = null;
    this._lastModified = new Date();
    return true;
  }

  canAssignPlayer(): boolean {
    // ROGUE and GOVBOT types can never be assigned to players
    if (this._botType === "rogue" || this._botType === "govbot") {
      return false;
    }

    // Already assigned to a player
    if (this._playerId !== null) {
      return false;
    }

    return true;
  }

  requiresPlayer(): boolean {
    // PLAYABLE and KING types must always have a player assigned
    return this._botType === "playable" || this._botType === "king";
  }

  canBeUnassigned(): boolean {
    // Types that require a player cannot be unassigned
    if (this.requiresPlayer()) {
      return false;
    }

    // If no player is assigned, can't unassign
    if (this._playerId === null) {
      return false;
    }

    return true;
  }

  // Private validation methods
  private _validateBotTypeRules(): void {
    const errors: string[] = [];

    switch (this._botType) {
      case "playable":
      case "king":
        // These types must have an owner
        if (!this._ownerId) {
          errors.push(`${this._botType} bots must have an owner assigned`);
        }
        break;

      case "rogue":
      case "govbot":
        // These types cannot have owners or players
        if (this._ownerId) {
          errors.push(`${this._botType} bots cannot have an owner assigned`);
        }
        if (this._playerId) {
          errors.push(`${this._botType} bots cannot have a player assigned`);
        }
        break;

      case "worker":
        // Workers can optionally have owners but must have one if they have a player
        if (this._playerId && !this._ownerId) {
          errors.push("Worker bots with a player must have an owner");
        }
        break;

      default:
        errors.push(`Unknown bot type: ${this._botType}`);
    }

    if (errors.length > 0) {
      throw new Error(`Bot type validation failed: ${errors.join(", ")}`);
    }
  }

  // Validation
  validateAssembly(): { valid: boolean; errors: string[]; warnings: string[] } {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Check basic requirements
    if (!this._soulChip) {
      errors.push("Bot must have a soul chip");
    }

    if (!this._skeleton) {
      errors.push("Bot must have a skeleton");
    }

    // Check bot type requirements
    if (this.requiresPlayer() && !this._playerId) {
      warnings.push(
        `${this._botType} bots should have a player assigned for optimal operation`
      );
    }

    if (
      (this._botType === "rogue" || this._botType === "govbot") &&
      this._playerId
    ) {
      errors.push(`${this._botType} bots cannot be assigned to players`);
    }

    // Check slot usage
    if (this.usedSlots > this.totalSlots) {
      errors.push(
        `Too many components: ${this.usedSlots}/${this.totalSlots} slots used`
      );
    }

    // Check part compatibility
    this._parts.forEach((part) => {
      if (!this._skeleton.isCompatibleWithPart(part.category)) {
        errors.push(
          `Part ${part.name} (${part.category}) incompatible with skeleton ${this._skeleton.type}`
        );
      }
    });

    // Check energy requirements
    if (this.powerRequirement > this.maxEnergy) {
      warnings.push(
        `High power consumption: ${this.powerRequirement}/${this.maxEnergy} energy`
      );
    }

    // Check for missing essential parts
    const hasArm = Array.from(this._parts.values()).some(
      (p) => p.category === "arm"
    );
    const hasLeg = Array.from(this._parts.values()).some(
      (p) => p.category === "leg"
    );

    if (!hasArm) {
      warnings.push("No arm parts installed - limited combat capability");
    }

    if (!hasLeg) {
      warnings.push("No leg parts installed - limited mobility");
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
    };
  }

  // Combat readiness
  calculateCombatPower(): number {
    const stats = this.aggregatedStats;
    const soulPower =
      (this._soulChip.baseStats.intelligence +
        this._soulChip.baseStats.resilience) /
      2;

    // Weighted combat power calculation
    const combatPower =
      stats.attack * 0.3 +
      stats.defense * 0.25 +
      stats.speed * 0.2 +
      stats.perception * 0.15 +
      soulPower * 0.1;

    // Apply operational penalties
    const energyPenalty = this._state.energyLevel < 50 ? 0.8 : 1.0;
    const maintenancePenalty = this._state.maintenanceLevel < 50 ? 0.7 : 1.0;

    return Math.round(combatPower * energyPenalty * maintenancePenalty);
  }

  isReadyForCombat(): boolean {
    const validation = this.validateAssembly();
    return (
      validation.valid &&
      this.isOperational &&
      this._state.energyLevel >= 30 &&
      this._state.maintenanceLevel >= 40 &&
      Array.from(this._parts.values()).some((p) => p.category === "arm")
    ); // Need weapon
  }

  getOptimalLoadout(): {
    parts: IPart[];
    chips: IExpansionChip[];
    reasoning: string;
  } {
    // Simple optimization - prioritize balance
    const currentParts = Array.from(this._parts.values());
    const currentChips = Array.from(this._expansionChips.values());

    let reasoning = "Current loadout analysis: ";

    if (currentParts.length < 3) {
      reasoning += "Consider adding more parts for better performance. ";
    }

    if (currentChips.length === 0) {
      reasoning +=
        "Consider adding expansion chips for enhanced capabilities. ";
    }

    const stats = this.aggregatedStats;
    if (stats.attack < stats.defense) {
      reasoning += "Loadout favors defense over offense. ";
    } else if (stats.attack > stats.defense * 1.5) {
      reasoning += "Loadout is offense-heavy, consider defensive options. ";
    }

    return {
      parts: currentParts,
      chips: currentChips,
      reasoning: reasoning || "Loadout appears balanced.",
    };
  }

  // Persistence
  toJSON(): Record<string, any> {
    return {
      id: this._id,
      name: this._name,
      botType: this._botType,
      ownerId: this._ownerId,
      playerId: this._playerId,
      version: this._version,
      soulChip: this._soulChip.toJSON(),
      skeleton: this._skeleton.toJSON(),
      parts: Array.from(this._parts.values()).map((p) => p.toJSON()),
      expansionChips: Array.from(this._expansionChips.values()).map((c) =>
        c.toJSON()
      ),
      state: this._state.toJSON(),
      assemblyDate: this._assemblyDate.toISOString(),
      lastModified: this._lastModified.toISOString(),
      assemblyVersion: this._assemblyVersion,
      metadata: this._metadata,
    };
  }

  serialize(): string {
    return JSON.stringify(this.toJSON());
  }

  clone(): IBot {
    const config: BotConfiguration = {
      id: `${this._id}_clone_${Date.now()}`,
      name: `${this._name} (Clone)`,
      botType: this._botType,
      ownerId: this._ownerId,
      playerId: this._playerId,
      soulChip: this._soulChip, // Note: This is a reference, might want deep clone
      skeleton: this._skeleton, // Note: This is a reference, might want deep clone
      parts: Array.from(this._parts.values()),
      expansionChips: Array.from(this._expansionChips.values()),
      initialState: {
        energyLevel: this._state.energyLevel,
        maintenanceLevel: this._state.maintenanceLevel,
        statusEffects: [...this._state.statusEffects],
        currentLocation: this._state.currentLocation,
        experience: this._state.experience,
        ...(this._state.getStateType() === "non-worker"
          ? {
              bondLevel: (this._state as any).bondLevel,
              lastActivity: (this._state as any).lastActivity,
              battlesWon: (this._state as any).battlesWon,
              battlesLost: (this._state as any).battlesLost,
              totalBattles: (this._state as any).totalBattles,
            }
          : {}),
      } as any,
      metadata: { ...this._metadata },
    };

    return new Bot(config);
  }

  // Upgrade and maintenance
  canUpgrade(
    component: "skeleton" | "part" | "chip",
    componentId: string
  ): boolean {
    switch (component) {
      case "skeleton":
        // Skeleton upgrades not implemented in current interface
        return false;
      case "part":
        const part = this._parts.get(componentId);
        return part !== undefined && part.canUpgrade();
      case "chip":
        const chip = this._expansionChips.get(componentId);
        return chip !== undefined && chip.canUpgrade();
      default:
        return false;
    }
  }

  upgrade(
    component: "skeleton" | "part" | "chip",
    componentId: string
  ): boolean {
    if (!this.canUpgrade(component, componentId)) {
      return false;
    }

    switch (component) {
      case "skeleton":
        // Skeleton upgrade logic would go here
        this._lastModified = new Date();
        this._assemblyVersion++;
        return true;
      case "part":
        const part = this._parts.get(componentId);
        if (part && part.canUpgrade()) {
          const success = part.upgrade();
          if (success) {
            this._lastModified = new Date();
            this._assemblyVersion++;
          }
          return success;
        }
        return false;
      case "chip":
        const chip = this._expansionChips.get(componentId);
        if (chip && chip.canUpgrade()) {
          const success = chip.upgrade();
          if (success) {
            this._lastModified = new Date();
            this._assemblyVersion++;
          }
          return success;
        }
        return false;
      default:
        return false;
    }
  }

  getMaintenance(): {
    required: boolean;
    urgency: "low" | "medium" | "high" | "critical";
    estimatedCost: number;
    issues: string[];
  } {
    const issues: string[] = [];
    let urgency: "low" | "medium" | "high" | "critical" = "low";
    let estimatedCost = 0;

    if (this._state.maintenanceLevel < 20) {
      issues.push("Critical maintenance required");
      urgency = "critical";
      estimatedCost += 1000;
    } else if (this._state.maintenanceLevel < 50) {
      issues.push("Regular maintenance needed");
      urgency = urgency === "low" ? "high" : urgency;
      estimatedCost += 500;
    } else if (this._state.maintenanceLevel < 80) {
      issues.push("Preventive maintenance recommended");
      urgency = urgency === "low" ? "medium" : urgency;
      estimatedCost += 200;
    }

    if (this._state.energyLevel < 20) {
      issues.push("Low energy - recharge required");
      estimatedCost += 50;
    }

    return {
      required: issues.length > 0,
      urgency,
      estimatedCost,
      issues,
    };
  }

  // Performance metrics
  getPerformanceMetrics(): {
    efficiency: number;
    reliability: number;
    versatility: number;
    specialization: number;
  } {
    const stats = this.aggregatedStats;
    const maxStat = Math.max(
      stats.attack,
      stats.defense,
      stats.speed,
      stats.perception
    );
    const minStat = Math.min(
      stats.attack,
      stats.defense,
      stats.speed,
      stats.perception
    );
    const avgStat =
      (stats.attack + stats.defense + stats.speed + stats.perception) / 4;

    return {
      efficiency: Math.round(
        (avgStat / Math.max(1, stats.energyConsumption)) * 100
      ),
      reliability: this._state.maintenanceLevel,
      versatility: Math.round(
        (1 - (maxStat - minStat) / Math.max(1, maxStat)) * 100
      ),
      specialization: Math.round((maxStat / Math.max(1, avgStat)) * 100),
    };
  }
}
