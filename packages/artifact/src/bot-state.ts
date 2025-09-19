import { type BotLocation, type BotState as PrismaBotState } from "@botking/db";
import {
  CreateBotStateSchema,
  UpdateBotStateSchema,
  ZodSchema,
} from "@botking/validator";

import { IGenericArtifact } from "./types";

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

  protected _shalowClone(): PrismaBotState {
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
      createdAt: new Date(this.createdAt),
      updatedAt: new Date(this.updatedAt),
    };
  }

  protected _validate(
    createSchema: ZodSchema,
    updateSchema: ZodSchema
  ): boolean {
    return (
      createSchema.safeParse(this._shalowClone()).success ||
      updateSchema.safeParse(this._shalowClone()).success
    );
  }

  protected _validateCreation(createSchema: ZodSchema): void {
    const validation = createSchema.safeParse(this._shalowClone());

    if (!validation.success) {
      throw new Error(validation.error.issues.join(", "));
    }
  }

  protected _validateUpdate(updateSchema: ZodSchema): void {
    const validation = updateSchema.safeParse(this._shalowClone());

    if (!validation.success) {
      throw new Error(validation.error.issues.join(", "));
    }
  }

  // Serialization
  toJSON(): Record<string, any> {
    return {
      ...this._shalowClone(),
      //
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
    };
  }

  serialize(): string {
    return JSON.stringify(this.toJSON());
  }

  clone(): IBotState {
    return new BotState(this._shalowClone());
  }
}

/**
 * User artifact implementation - directly based on database schema
 */
export class BotState extends BaseBotState implements IBotState {
  constructor(prismaBotState: PrismaBotState) {
    super(prismaBotState);
  }

  validate(): boolean {
    return this._validate(CreateBotStateSchema, UpdateBotStateSchema);
  }

  validateCreation(): void {
    this._validateCreation(CreateBotStateSchema);
  }

  validateUpdate(): void {
    this._validateUpdate(UpdateBotStateSchema);
  }
}
