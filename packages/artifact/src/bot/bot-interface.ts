import type { SoulChip } from "../soul-chip";
import type { ISkeleton } from "../skeleton";
import type { IPart } from "../part";
import type { IExpansionChip } from "../expansion-chip";
import type { CombatStats, Ability, BotType } from "../types";
import type { IBotState } from "../bot-state/bot-state-interface";

/**
 * Interface for a complete Bot artifact
 * Represents the fully assembled robot with all components
 */
export interface IBot {
  // Core identification
  readonly id: string;
  readonly name: string;
  readonly botType: BotType;
  readonly ownerId: string | null; // Can be null for bots that don't belong to players
  readonly playerId: string | null; // Currently assigned player (for playable control)
  readonly version: string;

  // Core components
  readonly soulChip: SoulChip;
  readonly skeleton: ISkeleton;
  readonly parts: ReadonlyArray<IPart>;
  readonly expansionChips: ReadonlyArray<IExpansionChip>;
  readonly state: IBotState;

  // Assembly metadata
  readonly assemblyDate: Date;
  readonly lastModified: Date;
  readonly assemblyVersion: number;

  // Computed properties
  readonly isAssembled: boolean;
  readonly isOperational: boolean;
  readonly totalSlots: number;
  readonly usedSlots: number;
  readonly availableSlots: number;

  // Stats aggregation
  readonly aggregatedStats: CombatStats;
  readonly totalWeight: number;
  readonly powerRequirement: number;
  readonly maxEnergy: number;

  // Abilities and effects
  readonly availableAbilities: ReadonlyArray<Ability>;
  readonly activeEffects: ReadonlyArray<string>;

  // Assembly operations
  installPart(part: IPart): boolean;
  removePart(partId: string): boolean;
  installExpansionChip(chip: IExpansionChip): boolean;
  removeExpansionChip(chipId: string): boolean;

  // State management
  updateState(newState: Partial<IBotState>): void;
  activate(): boolean;
  deactivate(): void;
  reset(): void;

  // Player assignment management
  assignPlayer(playerId: string): boolean;
  unassignPlayer(): boolean;
  canAssignPlayer(): boolean;
  requiresPlayer(): boolean;
  canBeUnassigned(): boolean;

  // Validation
  validateAssembly(): {
    valid: boolean;
    errors: string[];
    warnings: string[];
  };

  // Combat readiness
  calculateCombatPower(): number;
  isReadyForCombat(): boolean;
  getOptimalLoadout(): {
    parts: IPart[];
    chips: IExpansionChip[];
    reasoning: string;
  };

  // Persistence
  toJSON(): Record<string, any>;
  serialize(): string;
  clone(): IBot;

  // Upgrade and maintenance
  canUpgrade(
    component: "skeleton" | "part" | "chip",
    componentId: string
  ): boolean;
  upgrade(
    component: "skeleton" | "part" | "chip",
    componentId: string
  ): boolean;
  getMaintenance(): {
    required: boolean;
    urgency: "low" | "medium" | "high" | "critical";
    estimatedCost: number;
    issues: string[];
  };

  // Performance metrics
  getPerformanceMetrics(): {
    efficiency: number;
    reliability: number;
    versatility: number;
    specialization: number;
  };
}

/**
 * Bot configuration for creation
 */
export interface BotConfiguration {
  id?: string;
  name: string;
  botType: BotType;
  ownerId?: string | null; // Optional for creation, validated based on bot type
  playerId?: string | null; // Optional initial player assignment
  soulChip: SoulChip;
  skeleton: ISkeleton;
  parts?: IPart[];
  expansionChips?: IExpansionChip[];
  initialState?: Partial<IBotState>;
  metadata?: Record<string, any>;
}

/**
 * Bot assembly result
 */
export interface BotAssemblyResult {
  success: boolean;
  bot?: IBot;
  errors: string[];
  warnings: string[];
  metrics: {
    assemblyTime: number;
    compatibilityScore: number;
    optimizationLevel: number;
  };
}

/**
 * Bot upgrade result
 */
export interface BotUpgradeResult {
  success: boolean;
  previousVersion: number;
  newVersion: number;
  changes: string[];
  rollbackData?: Record<string, any>;
}
