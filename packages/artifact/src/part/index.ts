/**
 * Part System - Modular part classes with category-specific implementations
 *
 * This module provides:
 * - IPart interface for type safety
 * - BasePart abstract class with shared functionality
 * - Concrete part classes for each category type
 * - PartFactory for creating and managing parts
 */

// Export the interface and base class
export type {
  IPart,
  PartInstallation,
  PartOptimization,
  CombatEffectiveness,
} from "./part-interface";
export { BasePart } from "./base-part";

// Export implemented part classes
export { ArmPart } from "./arm-part";
export { LegPart } from "./leg-part";
export { TorsoPart } from "./torso-part";
export { HeadPart } from "./head-part";

// Export the factory
export { PartFactory } from "./part-factory";

// Import for type definition
import { ArmPart } from "./arm-part";
import { LegPart } from "./leg-part";
import { TorsoPart } from "./torso-part";
import { HeadPart } from "./head-part";

// Export convenience type for all implemented part classes
export type AnySpecializedPart = ArmPart | LegPart | TorsoPart | HeadPart;
