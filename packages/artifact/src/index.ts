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
export * from "./artifact-manager";

// Builder Patterns
export * from "./bot/bot-builder";
export * from "./item/item-builder";

// Validation Framework (Template Method Pattern)
export * from "./validation/artifact-validator";
export * from "./validation/bot-validator";

// Assembly Framework (Strategy Pattern)
export * from "./assembly/assembly-strategy";

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
export * from "./user";
export * from "./account";
