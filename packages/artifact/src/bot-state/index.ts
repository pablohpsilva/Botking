/**
 * User artifact implementation based on schema.prisma User model
 */

import { type BotLocation, type BotState as PrismaBotState } from "@botking/db";
import { BotStateCreateInputObjectSchema } from "@botking/db/src/generated/zod/schemas/objects/BotStateCreateInput.schema";
import { BotStateUpdateInputObjectSchema } from "@botking/db/src/generated/zod/schemas/objects/BotStateUpdateInput.schema";
import { IGenericArtifact } from "../types";

export interface IBotState
  extends PrismaBotState,
    IGenericArtifact<IBotState, Record<string, any>> {}

export abstract class BaseBotState {
  public readonly id: string;
  public readonly userId: string;
  public readonly botId: string;
  public readonly energyLevel: number;
  public readonly healthLevel: number;
  public readonly currentLocation: BotLocation;
  public readonly experience: number;
  public readonly bondLevel: number | null;
  public readonly energy: number;
  public readonly maxEnergy: number;
  public readonly health: number;
  public readonly maxHealth: number;
  public readonly level: number;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  constructor(prismaBotState: PrismaBotState) {
    this.id = prismaBotState.id;
    this.userId = prismaBotState.userId;
    this.botId = prismaBotState.botId;
    //
    this.energyLevel = prismaBotState.energyLevel;
    this.healthLevel = prismaBotState.healthLevel;
    this.currentLocation = prismaBotState.currentLocation;
    this.experience = prismaBotState.experience;
    this.bondLevel = prismaBotState.bondLevel;
    this.level = prismaBotState.level;
    //
    this.energy = prismaBotState.energy;
    this.maxEnergy = prismaBotState.maxEnergy;
    this.health = prismaBotState.health;
    this.maxHealth = prismaBotState.maxHealth;
    //
    this.createdAt = prismaBotState.createdAt;
    this.updatedAt = prismaBotState.updatedAt;
  }
}

/**
 * User artifact implementation - directly based on database schema
 */
export class BotState extends BaseBotState implements IBotState {
  constructor(prismaBotState: PrismaBotState) {
    super(prismaBotState);
  }

  // Serialization
  toJSON(): Record<string, any> {
    return {
      id: this.id,
      userId: this.userId,
      botId: this.botId,
      //
      energyLevel: this.energyLevel,
      healthLevel: this.healthLevel,
      currentLocation: this.currentLocation,
      experience: this.experience,
      bondLevel: this.bondLevel,
      level: this.level,
      //
      energy: this.energy,
      maxEnergy: this.maxEnergy,
      health: this.health,
      maxHealth: this.maxHealth,
      //
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
    };
  }

  serialize(): string {
    return JSON.stringify(this.toJSON());
  }

  clone(): IBotState {
    const prismaBotStateData: PrismaBotState = {
      id: this.id,
      userId: this.userId,
      botId: this.botId,
      //
      energyLevel: this.energyLevel,
      healthLevel: this.healthLevel,
      currentLocation: this.currentLocation,
      experience: this.experience,
      bondLevel: this.bondLevel,
      level: this.level,
      //
      energy: this.energy,
      maxEnergy: this.maxEnergy,
      health: this.health,
      maxHealth: this.maxHealth,
      //
      createdAt: new Date(this.createdAt),
      updatedAt: new Date(this.updatedAt),
    };

    return new BotState(prismaBotStateData);
  }

  validate(): boolean {
    return true;
  }

  validateCreation(prismaBotState: PrismaBotState | BotState): boolean {
    return BotStateCreateInputObjectSchema.safeParse(prismaBotState).success;
  }

  validateUpdate(prismaBotState: PrismaBotState | BotState): boolean {
    return BotStateUpdateInputObjectSchema.safeParse(prismaBotState).success;
  }
}
