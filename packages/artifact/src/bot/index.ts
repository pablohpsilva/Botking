/**
 * Bot Artifact System
 *
 * Complete bot artifact implementation including:
 * - IBot interface for bot contracts
 * - Bot class for complete robot entities
 * - BotFactory for creation and assembly
 * - Configuration and result types
 */

// Import types for re-export
import type {
  IBot,
  BotConfiguration,
  BotAssemblyResult,
  BotUpgradeResult,
} from "./bot-interface";

// Export interfaces and types
export type { IBot, BotConfiguration, BotAssemblyResult, BotUpgradeResult };

// Export main bot class
export { Bot } from "./bot";

// Export factory
export { BotFactory } from "./bot-factory";

// Type alias for any bot implementation
export type AnyBot = IBot;
