/**
 * Bot artifact implementation based on schema.prisma Bot model
 */

import {
  type BotType,
  type CombatRole,
  type GovernmentType,
  type Bot as PrismaBot,
  type UtilitySpecialization,
} from "@botking/db";
import { CreateBotSchema, UpdateBotSchema } from "@botking/validator";
import { IGenericArtifact } from "../types";
export interface IBot
  extends PrismaBot,
    IGenericArtifact<IBot, Record<string, any>> {}

export abstract class BaseBot {
  public readonly id: string;
  public readonly userId: string | null;
  public readonly soulChipId: string | null;
  public readonly skeletonId: string;
  public readonly stateId: string;
  public readonly name: string;
  public readonly botType: BotType;
  public readonly combatRole: CombatRole | null;
  public readonly utilitySpec: UtilitySpecialization | null;
  public readonly governmentType: GovernmentType | null;
  public readonly description: string | null;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  constructor(prismaBot: PrismaBot) {
    this.id = prismaBot.id;
    this.userId = prismaBot.userId;
    this.soulChipId = prismaBot.soulChipId;
    this.skeletonId = prismaBot.skeletonId;
    this.stateId = prismaBot.stateId;
    this.name = prismaBot.name;
    this.botType = prismaBot.botType;
    this.combatRole = prismaBot.combatRole;
    this.utilitySpec = prismaBot.utilitySpec;
    this.governmentType = prismaBot.governmentType;
    this.description = prismaBot.description;
    this.createdAt = prismaBot.createdAt;
    this.updatedAt = prismaBot.updatedAt;
  }
}

/**
 * Bot artifact implementation - directly based on database schema
 */
export class Bot extends BaseBot implements IBot {
  constructor(prismaBot: PrismaBot) {
    super(prismaBot);
  }

  // Serialization
  toJSON(): Record<string, any> {
    return {
      id: this.id,
      userId: this.userId,
      soulChipId: this.soulChipId,
      skeletonId: this.skeletonId,
      stateId: this.stateId,
      // Non-ID fields
      name: this.name,
      botType: this.botType,
      combatRole: this.combatRole,
      utilitySpec: this.utilitySpec,
      governmentType: this.governmentType,
      description: this.description,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
    };
  }

  serialize(): string {
    return JSON.stringify(this.toJSON());
  }

  clone(): IBot {
    const prismaBotData: PrismaBot = {
      id: this.id,
      userId: this.userId,
      soulChipId: this.soulChipId,
      skeletonId: this.skeletonId,
      stateId: this.stateId,
      name: this.name,
      botType: this.botType,
      description: this.description,
      combatRole: this.combatRole,
      utilitySpec: this.utilitySpec,
      governmentType: this.governmentType,
      createdAt: new Date(this.createdAt),
      updatedAt: new Date(this.updatedAt),
    };

    return new Bot(prismaBotData);
  }

  validate(_prismaBot: PrismaBot | Bot): boolean {
    return true;
  }

  validateCreation(prismaBot: PrismaBot | Bot): boolean {
    return CreateBotSchema.safeParse(prismaBot).success;
  }

  validateUpdate(prismaBot: PrismaBot | Bot): boolean {
    return UpdateBotSchema.safeParse(prismaBot).success;
  }
}
