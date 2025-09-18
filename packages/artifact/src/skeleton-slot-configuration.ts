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

  // Serialization
  toJSON(): Record<string, any> {
    return {
      id: this.id,
      botId: this.botId,
      skeletonType: this.skeletonType,
      lastModified: this.lastModified.toISOString(),
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
    };
  }

  serialize(): string {
    return JSON.stringify(this.toJSON());
  }

  clone(): ISkeletonSlotConfiguration {
    const prismaSkeletonSlotConfigurationData: PrismaSkeletonSlotConfiguration =
      {
        id: this.id,
        botId: this.botId,
        skeletonType: this.skeletonType,
        lastModified: this.lastModified,
        createdAt: this.createdAt,
        updatedAt: this.updatedAt,
      };

    return new SkeletonSlotConfiguration(prismaSkeletonSlotConfigurationData);
  }
}
