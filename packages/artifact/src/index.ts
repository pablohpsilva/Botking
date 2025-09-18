/**
 * Botking Artifact System - Enhanced Object-Oriented Architecture
 *
 * A comprehensive OOP system for managing bot components including:
 * - Soul Chips: Core personality and AI traits
 * - Skeletons: Structural frames with slots and mobility
 * - Parts: Modular equipment for combat roles
 * - Expansion Chips: Slot-based enhancers
 * - Bot State: Dynamic runtime state management
 * - Items: Consumable objects for game mechanics
 * - Trading: Event-based item exchange system
 *
 * Enhanced OOP features:
 * - ArtifactManager: Centralized artifact lifecycle management
 * - Builder Patterns: Fluent interfaces for complex artifact creation
 * - Template Method: Structured validation with extensible rules
 * - Strategy Pattern: Flexible assembly strategies for different bot types
 * - Validation Framework: Comprehensive artifact validation with scoring
 */

// Main OOP Management Classes
export { ArtifactManager, artifactManager } from "./artifact-manager";
export type { ArtifactStats, ArtifactRegistry } from "./artifact-manager";

// Builder Patterns
export { BotBuilder, createBotBuilder } from "./bot/bot-builder";
export type {
  BuilderValidationResult,
  IBotBuildingStep,
} from "./bot/bot-builder";
export {
  ItemBuilder,
  createSpeedUpItemBuilder,
  createResourceItemBuilder,
  createTradeableItemBuilder,
  createGemItemBuilder,
} from "./item/item-builder";
export type { ItemBuilderValidationResult } from "./item/item-builder";

// Validation Framework (Template Method Pattern)
export {
  ArtifactValidator,
  ValidationSeverity,
  ValidationRuleFactory,
} from "./validation/artifact-validator";
export type {
  ValidationIssue,
  ValidationResult,
  ValidationContext,
  ValidationRule,
} from "./validation/artifact-validator";
export { BotValidator } from "./validation/bot-validator";

// Assembly Framework (Strategy Pattern)
export {
  AssemblyStrategy,
  BalancedAssemblyStrategy,
  PerformanceAssemblyStrategy,
  AssemblyStrategyFactory,
} from "./assembly/assembly-strategy";
export type {
  AssemblyResult,
  AssemblyContext,
  PartAssignmentResult,
  AssemblyPlan,
  AssemblyStep,
  CompatibilityCheck,
} from "./assembly/assembly-strategy";

// Export all types and enums
export * from "./types";

// Export all artifact classes
export * from "./bot";
export * from "./bot-state";
export * from "./expansion-chip";
export * from "./item";
export * from "./part";
export * from "./skeleton";
export * from "./soul-chip";
export * from "./trading";
