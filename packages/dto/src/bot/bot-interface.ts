import type { SoulChip } from "../soul-chip";
import type { ISkeleton } from "../skeleton";
import type { IPart } from "../part";
import type { IExpansionChip } from "../expansion-chip";
import type {
  CombatStats,
  Ability,
  BotType,
  CombatRole,
  UtilitySpecialization,
  GovernmentType,
} from "../types";
import type { IBotState } from "../bot-state/bot-state-interface";
import type {
  SlotIdentifier,
  ISkeletonSlotConfiguration,
} from "@botking/domain";

/**
 * Interface for a complete Bot artifact
 * Represents the fully assembled robot with all components
 */
export interface IBot {
  // Core identification
  readonly id: string;
  readonly name: string;
  readonly botType: BotType;
  readonly userId: string | null; // Can be null for autonomous bots
  readonly combatRole: CombatRole | null; // Combat specialization (null for non-combat bots)
  readonly utilitySpec: UtilitySpecialization | null; // Utility specialization (null for non-utility bots)
  readonly governmentType: GovernmentType | null; // Government type (null for non-government bots)
  readonly version: string;

  // Core components
  readonly soulChip: SoulChip | null; // Optional - Worker bots don't need soul chips
  readonly skeleton: ISkeleton;
  readonly parts: ReadonlyArray<IPart>;
  readonly expansionChips: ReadonlyArray<IExpansionChip>;
  readonly state: IBotState;

  // Assembly metadata
  readonly assemblyDate: Date;
  readonly lastModified: Date;
  readonly assemblyVersion: number;

  // Slot assignment tracking
  readonly slotConfiguration: ISkeletonSlotConfiguration;
  readonly slotAssignments: ReadonlyMap<SlotIdentifier, any>;

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

  // Assembly operations - Slot-aware methods
  installPart(
    part: IPart,
    preferredSlot?: SlotIdentifier
  ): { success: boolean; assignedSlot?: SlotIdentifier; message: string };
  removePart(partId: string): {
    success: boolean;
    removedFromSlot?: SlotIdentifier;
    message: string;
  };
  installExpansionChip(
    chip: IExpansionChip,
    preferredSlot?: SlotIdentifier
  ): { success: boolean; assignedSlot?: SlotIdentifier; message: string };
  removeExpansionChip(chipId: string): {
    success: boolean;
    removedFromSlot?: SlotIdentifier;
    message: string;
  };

  // State management
  updateState(newState: Partial<IBotState>): void;
  activate(): boolean;
  deactivate(): void;
  reset(): void;

  // User management
  canBeOwned(): boolean;
  requiresUser(): boolean;

  // Slot assignment operations
  swapParts(
    slotA: SlotIdentifier,
    slotB: SlotIdentifier
  ): { success: boolean; message: string };
  movePart(
    fromSlot: SlotIdentifier,
    toSlot: SlotIdentifier
  ): { success: boolean; message: string };
  getSlotAssignmentForVisualization(): {
    skeletonType: string;
    slots: Array<{
      slotId: string;
      category: string;
      position: string;
      visualPosition: { x: number; y: number; z: number };
      isOccupied: boolean;
      partData?: {
        id: string;
        name: string;
        category: string;
      };
    }>;
  };

  // Validation
  validateAssembly(): {
    valid: boolean;
    errors: string[];
    warnings: string[];
  };
  validateSlotAssignments(): {
    isValid: boolean;
    errors: string[];
    warnings: string[];
    conflictingSlots: string[];
    unassignedRequiredSlots: string[];
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
  userId?: string | null; // Optional for creation, validated based on bot type
  combatRole?: CombatRole | null; // Combat specialization (optional for creation)
  utilitySpec?: UtilitySpecialization | null; // Utility specialization (optional for creation)
  governmentType?: GovernmentType | null; // Government type (optional for creation)
  soulChip?: SoulChip | null; // Optional - Worker bots don't need soul chips
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
