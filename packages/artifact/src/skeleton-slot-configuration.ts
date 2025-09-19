/**
 * SkeletonSlotConfiguration artifact implementation based on schema.prisma SkeletonSlotConfiguration model
 */

import type {
  SkeletonSlotConfiguration as PrismaSkeletonSlotConfiguration,
  SkeletonType,
} from "@botking/db";
import { IGenericArtifact } from "./types";

export interface ISkeletonSlotConfiguration
  extends PrismaSkeletonSlotConfiguration,
    IGenericArtifact<ISkeletonSlotConfiguration, Record<string, any>> {}

export abstract class BaseSkeletonSlotConfiguration {
  public readonly id: string;
  public readonly botId: string;
  public readonly skeletonType: SkeletonType;
  public readonly lastModified: Date;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  constructor(
    prismaSkeletonSlotConfiguration: PrismaSkeletonSlotConfiguration
  ) {
    this.id = prismaSkeletonSlotConfiguration.id;
    this.botId = prismaSkeletonSlotConfiguration.botId;
    this.skeletonType = prismaSkeletonSlotConfiguration.skeletonType;
    this.lastModified = prismaSkeletonSlotConfiguration.lastModified;
    this.createdAt = prismaSkeletonSlotConfiguration.createdAt;
    this.updatedAt = prismaSkeletonSlotConfiguration.updatedAt;
  }

  protected _shalowClone(): PrismaSkeletonSlotConfiguration {
    return {
      id: this.id,
      botId: this.botId,
      skeletonType: this.skeletonType,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  // Serialization
  toJSON(): Record<string, any> {
    return {
      ...this._shalowClone(),
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
    };
  }

  serialize(): string {
    return JSON.stringify(this.toJSON());
  }

  clone(): ISkeletonSlotConfiguration {
    return new SkeletonSlotConfiguration(this._shalowClone());
  }
}

/**
 * SkeletonSlotConfiguration artifact implementation - directly based on database schema
 */
export class SkeletonSlotConfiguration
  extends BaseSkeletonSlotConfiguration
  implements ISkeletonSlotConfiguration
{
  constructor(
    prismaSkeletonSlotConfiguration: PrismaSkeletonSlotConfiguration
  ) {
    super(prismaSkeletonSlotConfiguration);
  }
}
