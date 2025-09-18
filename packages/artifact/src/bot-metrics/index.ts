/**
 * User artifact implementation based on schema.prisma User model
 */

import {
  CreateBotMetricSchema,
  UpdateBotMetricSchema,
  type BotMetric as PrismaBotMetric,
} from "@botking/db";
import { IGenericArtifact } from "../types";

export interface IBotMetric
  extends PrismaBotMetric,
    IGenericArtifact<IBotMetric, Record<string, any>> {}

export abstract class BaseBotMetric {
  public readonly id: string;
  public readonly userId: string;
  public readonly botId: string;
  public readonly battlesWon: number | null;
  public readonly battlesLost: number | null;
  public readonly totalBattles: number | null;
  public readonly missionsCompleted: number;
  public readonly successRate: number;
  public readonly totalCombatTime: number;
  public readonly damageDealt: number;
  public readonly damageTaken: number;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  constructor(prismaBotMetrics: PrismaBotMetric) {
    this.id = prismaBotMetrics.id;
    this.userId = prismaBotMetrics.userId;
    this.botId = prismaBotMetrics.botId;
    //
    this.battlesWon = prismaBotMetrics.battlesWon;
    this.battlesLost = prismaBotMetrics.battlesLost;
    this.totalBattles = prismaBotMetrics.totalBattles;
    //
    this.missionsCompleted = prismaBotMetrics.missionsCompleted;
    this.successRate = prismaBotMetrics.successRate;
    this.totalCombatTime = prismaBotMetrics.totalCombatTime;
    this.damageDealt = prismaBotMetrics.damageDealt;
    this.damageTaken = prismaBotMetrics.damageTaken;
    //
    this.createdAt = prismaBotMetrics.createdAt;
    this.updatedAt = prismaBotMetrics.updatedAt;
  }
}

/**
 * User artifact implementation - directly based on database schema
 */
export class BotMetric extends BaseBotMetric implements IBotMetric {
  constructor(prismaBotMetrics: PrismaBotMetric) {
    super(prismaBotMetrics);
  }

  // Serialization
  toJSON(): Record<string, any> {
    return {
      id: this.id,
      userId: this.userId,
      botId: this.botId,
      //
      battlesWon: this.battlesWon,
      battlesLost: this.battlesLost,
      totalBattles: this.totalBattles,
      //
      missionsCompleted: this.missionsCompleted,
      successRate: this.successRate,
      totalCombatTime: this.totalCombatTime,
      damageDealt: this.damageDealt,
      damageTaken: this.damageTaken,
      //
      //
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
    };
  }

  serialize(): string {
    return JSON.stringify(this.toJSON());
  }

  clone(): IBotMetric {
    const prismaBotMetricsData: PrismaBotMetric = {
      id: this.id,
      userId: this.userId,
      botId: this.botId,
      //
      battlesWon: this.battlesWon,
      battlesLost: this.battlesLost,
      totalBattles: this.totalBattles,
      //
      missionsCompleted: this.missionsCompleted,
      successRate: this.successRate,
      totalCombatTime: this.totalCombatTime,
      damageDealt: this.damageDealt,
      damageTaken: this.damageTaken,
      //
      createdAt: new Date(this.createdAt),
      updatedAt: new Date(this.updatedAt),
    };

    return new BotMetric(prismaBotMetricsData);
  }

  validate(): boolean {
    return true;
  }

  validateCreation(prismaBotMetrics: PrismaBotMetric | BotMetric): boolean {
    return CreateBotMetricSchema.safeParse(prismaBotMetrics).success;
  }

  validateUpdate(prismaBotMetrics: PrismaBotMetric | BotMetric): boolean {
    return UpdateBotMetricSchema.safeParse(prismaBotMetrics).success;
  }
}
