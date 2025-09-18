/**
 * Bot State System
 *
 * Specialized bot states based on bot types:
 * - Worker bots: Simple state for utility and work functions
 * - Non-worker bots: Extended state with social and combat features
 */

// Export interfaces and types
export type {
  IBotState,
  IWorkerBotState,
  INonWorkerBotState,
  BotStateConfig,
  BotStateFactory as IBotStateFactory,
} from "./bot-state-interface";

// Export base class
export { BaseBotState } from "./base-bot-state";

// Export concrete implementations
export { WorkerBotState } from "./worker-bot-state";
export { NonWorkerBotState } from "./non-worker-bot-state";

// Export factory
export { BotStateFactory } from "./bot-state-factory";

// Import interfaces for type aliases
import type {
  IBotState,
  IWorkerBotState,
  INonWorkerBotState,
} from "./bot-state-interface";

// Type aliases for convenience
export type AnyBotState = IBotState;
export type WorkerState = IWorkerBotState;
export type NonWorkerState = INonWorkerBotState;
