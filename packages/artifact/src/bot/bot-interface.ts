import type { SoulChip } from "../soul-chip";
import type { ISkeleton } from "../skeleton";
import type { IPart } from "../part";
import type { IExpansionChip } from "../expansion-chip";
import type { BotState } from "../bot-state";
import type { CombatStats, Ability } from "../types";

/**
 * Interface for a complete Bot artifact
 * Represents the fully assembled robot with all components
 */
export interface IBot {
  // Core identification
  readonly id: string;
  readonly name: string;
  readonly ownerId: string;
  readonly version: string;

  // Core components
  readonly soulChip: SoulChip;
  readonly skeleton: ISkeleton;
  readonly parts: ReadonlyArray<IPart>;
  readonly expansionChips: ReadonlyArray<IExpansionChip>;
  readonly state: BotState;

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
  updateState(newState: Partial<BotState>): void;
  activate(): boolean;
  deactivate(): void;
  reset(): void;

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
  canUpgrade(component: "skeleton" | "part" | "chip", componentId: string): boolean;
  upgrade(component: "skeleton" | "part" | "chip", componentId: string): boolean;
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
  ownerId: string;
  soulChip: SoulChip;
  skeleton: ISkeleton;
  parts?: IPart[];
  expansionChips?: IExpansionChip[];
  initialState?: Partial<BotState>;
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
