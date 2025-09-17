/**
 * Expansion Chip System - Modular expansion chip classes with effect-specific implementations
 *
 * This module provides:
 * - IExpansionChip interface for type safety
 * - BaseExpansionChip abstract class with shared functionality
 * - Concrete expansion chip classes for each effect type
 * - ExpansionChipFactory for creating and managing expansion chips
 */

// Export the interface and base class
export type {
  IExpansionChip,
  EffectApplication,
  ChipOptimization,
} from "./expansion-chip-interface";
export { BaseExpansionChip } from "./base-expansion-chip";

// Export implemented expansion chip classes
export { AttackBuffChip } from "./attack-buff-chip";
export { DefenseBuffChip } from "./defense-buff-chip";
export { SpeedBuffChip } from "./speed-buff-chip";
export { AIUpgradeChip } from "./ai-upgrade-chip";

// Export the factory
export { ExpansionChipFactory } from "./expansion-chip-factory";

// Import for type definition
import { AttackBuffChip } from "./attack-buff-chip";
import { DefenseBuffChip } from "./defense-buff-chip";
import { SpeedBuffChip } from "./speed-buff-chip";
import { AIUpgradeChip } from "./ai-upgrade-chip";

// Export convenience type for all implemented expansion chip classes
export type AnySpecializedExpansionChip =
  | AttackBuffChip
  | DefenseBuffChip
  | SpeedBuffChip
  | AIUpgradeChip;
