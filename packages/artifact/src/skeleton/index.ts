/**
 * Skeleton System - Modular skeleton classes with type-specific implementations
 *
 * This module provides:
 * - ISkeleton interface for type safety
 * - BaseSkeleton abstract class with shared functionality
 * - Concrete skeleton classes for each type (Light, Balanced, Heavy, Flying, Modular)
 * - SkeletonFactory for creating and managing skeletons
 */

// Export the interface and base class
export type { ISkeleton, SkeletonCharacteristics } from "./skeleton-interface";
export { BaseSkeleton } from "./base-skeleton";

// Export all concrete skeleton classes
export { LightSkeleton } from "./light-skeleton";
export { BalancedSkeleton } from "./balanced-skeleton";
export { HeavySkeleton } from "./heavy-skeleton";
export { FlyingSkeleton } from "./flying-skeleton";
export { ModularSkeleton } from "./modular-skeleton";

// Export the factory
export { SkeletonFactory } from "./skeleton-factory";

// Import for type definition
import { LightSkeleton } from "./light-skeleton";
import { BalancedSkeleton } from "./balanced-skeleton";
import { HeavySkeleton } from "./heavy-skeleton";
import { FlyingSkeleton } from "./flying-skeleton";
import { ModularSkeleton } from "./modular-skeleton";

// Export convenience type for all skeleton classes
export type AnySkeleton =
  | LightSkeleton
  | BalancedSkeleton
  | HeavySkeleton
  | FlyingSkeleton
  | ModularSkeleton;
