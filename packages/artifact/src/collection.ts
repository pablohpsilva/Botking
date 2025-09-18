/**
 * Collection artifact implementation based on schema.prisma Collection model
 */

import type {
  CollectionType,
  Collection as PrismaCollection,
} from "@botking/db";
import { IGenericArtifact } from "./types";

export interface ICollection
  extends PrismaCollection,
    IGenericArtifact<ICollection, Record<string, any>> {}

export abstract class BaseCollection {
  public readonly name: string;
  public readonly id: string;
  public readonly userId: string;
  public readonly description: string | null;
  public readonly type: CollectionType;
  public readonly itemIds: string[];
  public readonly isPublic: boolean;
  public readonly shareCode: string | null;
  public readonly version: number;
  public readonly source: string | null;
  public readonly tags: string[];
  public readonly metadata: Record<string, any> | null;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  constructor(prismaCollection: PrismaCollection) {
    this.name = prismaCollection.name;
    this.id = prismaCollection.id;
    this.userId = prismaCollection.userId;
    this.description = prismaCollection.description;
    this.type = prismaCollection.type;
    this.itemIds = prismaCollection.itemIds;
    this.isPublic = prismaCollection.isPublic;
    this.shareCode = prismaCollection.shareCode;
    this.version = prismaCollection.version;
    this.source = prismaCollection.source;
    this.tags = prismaCollection.tags;
    this.metadata = prismaCollection.metadata as Record<string, any> | null;
    this.createdAt = prismaCollection.createdAt;
    this.updatedAt = prismaCollection.updatedAt;
  }
}

/**
 * Collection artifact implementation - directly based on database schema
 */
export class Collection extends BaseCollection implements ICollection {
  constructor(prismaCollection: PrismaCollection) {
    super(prismaCollection);
  }

  // Serialization
  toJSON(): Record<string, any> {
    return {
      id: this.id,
      userId: this.userId,
      name: this.name,
      description: this.description,
      type: this.type,
      itemIds: this.itemIds,
      isPublic: this.isPublic,
      shareCode: this.shareCode,
      version: this.version,
      source: this.source,
      tags: this.tags,
      metadata: this.metadata,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
    };
  }

  serialize(): string {
    return JSON.stringify(this.toJSON());
  }

  clone(): ICollection {
    const prismaCollectionData: PrismaCollection = {
      id: this.id,
      userId: this.userId,
      name: this.name,
      description: this.description,
      type: this.type,
      itemIds: this.itemIds,
      isPublic: this.isPublic,
      shareCode: this.shareCode,
      version: this.version,
      source: this.source,
      tags: this.tags,
      metadata: this.metadata,
      createdAt: new Date(this.createdAt),
      updatedAt: new Date(this.updatedAt),
    };

    return new Collection(prismaCollectionData);
  }
}
