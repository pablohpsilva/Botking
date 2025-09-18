import { createPackageLogger } from "@botking/logger";
import { BotFactory } from "./bot/bot-factory";
import { ItemFactory } from "./item/item-factory";
import { SkeletonFactory } from "./skeleton/skeleton-factory";
import { PartFactory } from "./part/part-factory";
import { ExpansionChipFactory } from "./expansion-chip/expansion-chip-factory";
import { BotStateFactory } from "./bot-state/bot-state-factory";
import { TradingFactory } from "./trading/trading-factory";
import type { IBot } from "./bot/bot-interface";
import type { IItem } from "./item/item-interface";
import type { ISkeleton } from "./skeleton/skeleton-interface";
import type { IPart } from "./part/part-interface";
import type { IExpansionChip } from "./expansion-chip/expansion-chip-interface";
import type { IBotState } from "./bot-state/bot-state-interface";
import type { ITradingEvent, ITradeOffer } from "./trading";

/**
 * Artifact creation statistics
 */
export interface ArtifactStats {
  totalCreated: number;
  createdByType: Record<string, number>;
  createdByRarity: Record<string, number>;
  creationHistory: Array<{
    type: string;
    timestamp: Date;
    id: string;
  }>;
}

/**
 * Artifact registry for tracking and management
 */
export interface ArtifactRegistry {
  bots: Map<string, IBot>;
  items: Map<string, IItem>;
  skeletons: Map<string, ISkeleton>;
  parts: Map<string, IPart>;
  expansionChips: Map<string, IExpansionChip>;
  botStates: Map<string, IBotState>;
  tradingEvents: Map<string, ITradingEvent>;
  tradeOffers: Map<string, ITradeOffer>;
}

/**
 * ArtifactManager - Centralized OOP management for all artifacts
 * Provides unified interface for artifact creation, tracking, and lifecycle management
 */
export class ArtifactManager {
  private static instance: ArtifactManager;
  private logger: ReturnType<typeof createPackageLogger>;
  private registry: ArtifactRegistry;
  private stats: ArtifactStats;
  private factories: {
    bot: typeof BotFactory;
    item: typeof ItemFactory;
    skeleton: typeof SkeletonFactory;
    part: typeof PartFactory;
    expansionChip: typeof ExpansionChipFactory;
    botState: typeof BotStateFactory;
    trading: typeof TradingFactory;
  };

  private constructor() {
    this.logger = createPackageLogger("artifact", {
      service: "artifact-manager",
    });

    // Initialize registry
    this.registry = {
      bots: new Map(),
      items: new Map(),
      skeletons: new Map(),
      parts: new Map(),
      expansionChips: new Map(),
      botStates: new Map(),
      tradingEvents: new Map(),
      tradeOffers: new Map(),
    };

    // Initialize statistics
    this.stats = {
      totalCreated: 0,
      createdByType: {},
      createdByRarity: {},
      creationHistory: [],
    };

    // Register factories
    this.factories = {
      bot: BotFactory,
      item: ItemFactory,
      skeleton: SkeletonFactory,
      part: PartFactory,
      expansionChip: ExpansionChipFactory,
      botState: BotStateFactory,
      trading: TradingFactory,
    };

    this.logger.info("ArtifactManager initialized");
  }

  /**
   * Get singleton instance
   */
  public static getInstance(): ArtifactManager {
    if (!ArtifactManager.instance) {
      ArtifactManager.instance = new ArtifactManager();
    }
    return ArtifactManager.instance;
  }

  /**
   * Register an artifact in the registry
   */
  public registerArtifact<T extends { id: string }>(
    type: keyof ArtifactRegistry,
    artifact: T
  ): void {
    const registry = this.registry[type] as unknown as Map<string, T>;
    registry.set(artifact.id, artifact);

    // Update statistics
    this.updateStats(type, artifact);

    this.logger.debug(`Artifact registered`, {
      type,
      id: artifact.id,
      registrySize: registry.size,
    });
  }

  /**
   * Get artifact by ID and type
   */
  public getArtifact<T>(
    type: keyof ArtifactRegistry,
    id: string
  ): T | undefined {
    const registry = this.registry[type] as Map<string, T>;
    return registry.get(id);
  }

  /**
   * Get all artifacts of a specific type
   */
  public getAllArtifacts<T>(type: keyof ArtifactRegistry): T[] {
    const registry = this.registry[type] as Map<string, T>;
    return Array.from(registry.values());
  }

  /**
   * Remove artifact from registry
   */
  public removeArtifact(type: keyof ArtifactRegistry, id: string): boolean {
    const registry = this.registry[type];
    const removed = registry.delete(id);

    if (removed) {
      this.logger.debug(`Artifact removed`, { type, id });
    }

    return removed;
  }

  /**
   * Check if artifact exists
   */
  public hasArtifact(type: keyof ArtifactRegistry, id: string): boolean {
    return this.registry[type].has(id);
  }

  /**
   * Get artifact factory by type
   */
  public getFactory(type: keyof typeof this.factories) {
    return this.factories[type];
  }

  /**
   * Create and register a bot
   */
  public createBot(name: string, userId: string, config?: any): IBot {
    const bot = this.factories.bot.createBasicBot(
      name,
      userId,
      config?.skeletonType,
      config?.botType
    );
    this.registerArtifact("bots", bot);
    return bot;
  }

  /**
   * Create and register an item
   */
  public createItem(type: string, name: string, config?: any): IItem {
    let item: IItem;

    switch (type) {
      case "speedUp":
        item = this.factories.item.createSpeedUpItem(
          name,
          config?.target,
          config?.speedMultiplier,
          config?.timeReduction,
          config?.rarity
        );
        break;
      case "resource":
        item = this.factories.item.createResourceItem(
          name,
          config?.resourceType,
          config?.rarity
        );
        break;
      case "gem":
        // Create a simple gem item using base factory
        item = this.factories.item.createSpeedUpItem(
          name,
          "BUILDING" as any,
          1,
          1,
          config?.rarity
        );
        break;
      case "tradeable":
        item = this.factories.item.createTradeableItem(
          name,
          config?.rarity,
          config?.baseValue || 1
        );
        break;
      default:
        throw new Error(`Unknown item type: ${type}`);
    }

    this.registerArtifact("items", item);
    return item;
  }

  /**
   * Create and register a skeleton
   */
  public createSkeleton(type: string, config?: any): ISkeleton {
    const skeleton = this.factories.skeleton.createSkeleton(
      type as any,
      `skel_${Date.now()}`,
      config?.rarity || "COMMON",
      config?.slots || 6,
      config?.durability || 100,
      config?.mobilityType || "LAND"
    );
    this.registerArtifact("skeletons", skeleton);
    return skeleton;
  }

  /**
   * Create and register a part
   */
  public createPart(category: string, config?: any): IPart {
    const part = this.factories.part.createPart(
      category as any,
      `part_${Date.now()}`,
      config?.rarity || "COMMON",
      config?.durability || 100,
      config?.stats || {
        attack: 10,
        defense: 10,
        speed: 10,
        perception: 10,
        energyConsumption: 5,
      }
    );
    this.registerArtifact("parts", part);
    return part;
  }

  /**
   * Create and register an expansion chip
   */
  public createExpansionChip(effect: string, config?: any): IExpansionChip {
    const chip = this.factories.expansionChip.createExpansionChip(
      effect as any,
      `chip_${Date.now()}`,
      config?.rarity || "COMMON",
      config?.level || 1,
      config?.stats || "default_stats"
    );
    this.registerArtifact("expansionChips", chip);
    return chip;
  }

  /**
   * Create and register a bot state
   */
  public createBotState(type: string, config?: any): IBotState {
    const state = this.factories.botState.createState(type as any, config);
    this.registerArtifact("botStates", state);
    return state;
  }

  /**
   * Search artifacts by criteria
   */
  public searchArtifacts<T>(
    type: keyof ArtifactRegistry,
    criteria: (artifact: T) => boolean
  ): T[] {
    const registry = this.registry[type] as Map<string, T>;
    return Array.from(registry.values()).filter(criteria);
  }

  /**
   * Get artifacts by rarity
   */
  public getArtifactsByRarity<T extends { rarity: any }>(
    type: keyof ArtifactRegistry,
    rarity: any
  ): T[] {
    return this.searchArtifacts<T>(
      type,
      (artifact) => artifact.rarity === rarity
    );
  }

  /**
   * Get registry statistics
   */
  public getRegistryStats(): {
    totalArtifacts: number;
    artifactsByType: Record<string, number>;
    registrySizes: Record<string, number>;
  } {
    let totalArtifacts = 0;
    const registrySizes: Record<string, number> = {};

    for (const [type, registry] of Object.entries(this.registry)) {
      const size = registry.size;
      registrySizes[type] = size;
      totalArtifacts += size;
    }

    return {
      totalArtifacts,
      artifactsByType: registrySizes,
      registrySizes,
    };
  }

  /**
   * Get creation statistics
   */
  public getCreationStats(): ArtifactStats {
    return { ...this.stats };
  }

  /**
   * Export all artifacts (for persistence)
   */
  public exportArtifacts(): {
    bots: IBot[];
    items: IItem[];
    skeletons: ISkeleton[];
    parts: IPart[];
    expansionChips: IExpansionChip[];
    botStates: IBotState[];
    tradingEvents: ITradingEvent[];
    tradeOffers: ITradeOffer[];
  } {
    return {
      bots: this.getAllArtifacts<IBot>("bots"),
      items: this.getAllArtifacts<IItem>("items"),
      skeletons: this.getAllArtifacts<ISkeleton>("skeletons"),
      parts: this.getAllArtifacts<IPart>("parts"),
      expansionChips: this.getAllArtifacts<IExpansionChip>("expansionChips"),
      botStates: this.getAllArtifacts<IBotState>("botStates"),
      tradingEvents: this.getAllArtifacts<ITradingEvent>("tradingEvents"),
      tradeOffers: this.getAllArtifacts<ITradeOffer>("tradeOffers"),
    };
  }

  /**
   * Clear all registries
   */
  public clearAll(): void {
    for (const registry of Object.values(this.registry)) {
      registry.clear();
    }

    this.stats = {
      totalCreated: 0,
      createdByType: {},
      createdByRarity: {},
      creationHistory: [],
    };

    this.logger.info("All artifact registries cleared");
  }

  /**
   * Clear specific registry
   */
  public clearRegistry(type: keyof ArtifactRegistry): void {
    this.registry[type].clear();
    this.logger.info(`${type} registry cleared`);
  }

  /**
   * Get manager health status
   */
  public getHealthStatus(): {
    isHealthy: boolean;
    registryStatus: Record<string, { size: number; isHealthy: boolean }>;
    lastActivity: Date;
  } {
    const registryStatus: Record<string, { size: number; isHealthy: boolean }> =
      {};
    let isHealthy = true;

    for (const [type, registry] of Object.entries(this.registry)) {
      const size = registry.size;
      const registryHealthy = size < 10000; // Arbitrary limit for health check
      registryStatus[type] = { size, isHealthy: registryHealthy };

      if (!registryHealthy) {
        isHealthy = false;
      }
    }

    return {
      isHealthy,
      registryStatus,
      lastActivity: new Date(),
    };
  }

  /**
   * Update statistics when artifact is created
   */
  private updateStats(type: string, artifact: any): void {
    this.stats.totalCreated++;

    // Update type statistics
    this.stats.createdByType[type] = (this.stats.createdByType[type] || 0) + 1;

    // Update rarity statistics if artifact has rarity
    if (artifact.rarity) {
      this.stats.createdByRarity[artifact.rarity] =
        (this.stats.createdByRarity[artifact.rarity] || 0) + 1;
    }

    // Add to creation history (keep last 1000 entries)
    this.stats.creationHistory.push({
      type,
      timestamp: new Date(),
      id: artifact.id,
    });

    if (this.stats.creationHistory.length > 1000) {
      this.stats.creationHistory.shift();
    }
  }
}

// Export singleton instance for convenience
export const artifactManager = ArtifactManager.getInstance();
