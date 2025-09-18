/**
 * DTO Factories Index
 *
 * Centralized exports for all DTO factories and related utilities.
 * LEAN ARCHITECTURE: Artifact-First Approach
 *
 * - Factories create artifacts (domain objects) as primary objects
 * - Artifacts are converted to DTOs only for database persistence
 * - Removed legacy factories with property mismatches
 * - Clean, modern, artifact-first approach
 */

// Base factories
export { BaseDTOFactory } from "./base/base-factory";
export { ArtifactDTOFactory } from "./base/artifact-dto-factory";

// Core artifact factories (lean, artifact-first approach)
export { BotDTOFactory } from "./artifact/bot-factory";
export { SoulChipDTOFactory } from "./artifact/soul-chip-factory";

// Inventory factories
export { ItemDTOFactory } from "./inventory/item-factory";

// Utility factories
export { SlotAssignmentDTOFactory } from "./slot-assignment-dto-factory";

// Registry system (simplified)
export { DTOFactoryRegistry } from "./registry";
