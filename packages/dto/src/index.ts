/**
 * Botking DTO System - Data Transfer Objects for CRUD Operations
 *
 * A comprehensive DTO system for managing database operations on bot components including:
 * - Asset Packs: Collections of game assets
 * - Assets: Individual game resources
 * - Expansion Slots: Robot expansion capabilities
 * - Identity Links: User authentication connections
 * - Instances: Item instances in the game
 * - Inventory Stacks: Player inventory management
 * - Item Template Assets: Asset-template relationships
 * - Parts Slots: Robot part attachments
 * - Player Accounts: Player data per shard
 * - Robots: Bot entities
 * - Shards: Game server instances
 * - Skeleton Slots: Robot skeleton attachments
 * - Soul Chip Slots: Robot AI chip attachments
 * - Templates: Item templates
 * - Users: User accounts
 *
 * Each DTO provides:
 * - CRUD operations (Create, Read, Update, Delete)
 * - Validation using Zod schemas
 * - Database connection management
 */

// Export all DTO classes
export * from "./asset-pack";
export * from "./asset";
export * from "./expansion-slot";
export * from "./identity-link";
export * from "./instance";
export * from "./inventory-stack";
export * from "./item-template-asset";
export * from "./parts-slot";
export * from "./player-account";
export * from "./robot";
export * from "./shard";
export * from "./skeleton-slot";
export * from "./soul-chip-slot";
export * from "./template";
export * from "./user";
