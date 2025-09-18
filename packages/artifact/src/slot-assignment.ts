/**
 * SlotAssignment artifact implementation based on schema.prisma SlotAssignment model
 */

import type { SlotAssignment as PrismaSlotAssignment } from "@botking/db";
import { IGenericArtifact } from "./types";

export interface ISlotAssignment
  extends PrismaSlotAssignment,
    IGenericArtifact<ISlotAssignment, Record<string, any>> {}

export abstract class BaseSlotAssignment {
  public readonly id: string;
  public readonly slotId: string;
  public readonly partId: string;
  public readonly partName: string;
  public readonly partCategory: string;
  public readonly assignedAt: Date;
  public readonly metadata: Record<string, any> | null;
  public readonly configurationId: string;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  constructor(prismaSlotAssignment: PrismaSlotAssignment) {
    this.id = prismaSlotAssignment.id;
    this.slotId = prismaSlotAssignment.slotId;
    this.partId = prismaSlotAssignment.partId;
    this.partName = prismaSlotAssignment.partName;
    this.partCategory = prismaSlotAssignment.partCategory;
    this.assignedAt = prismaSlotAssignment.assignedAt;
    this.metadata = prismaSlotAssignment.metadata as Record<string, any> | null;
    this.configurationId = prismaSlotAssignment.configurationId;
    this.createdAt = prismaSlotAssignment.createdAt;
    this.updatedAt = prismaSlotAssignment.updatedAt;
  }
}

/**
 * SlotAssignment artifact implementation - directly based on database schema
 */
export class SlotAssignment
  extends BaseSlotAssignment
  implements ISlotAssignment
{
  constructor(prismaSlotAssignment: PrismaSlotAssignment) {
    super(prismaSlotAssignment);
  }

  // Serialization
  toJSON(): Record<string, any> {
    return {
      id: this.id,
      slotId: this.slotId,
      partId: this.partId,
      partName: this.partName,
      partCategory: this.partCategory,
      assignedAt: this.assignedAt.toISOString(),
      metadata: this.metadata,
      configurationId: this.configurationId,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
    };
  }

  serialize(): string {
    return JSON.stringify(this.toJSON());
  }

  clone(): ISlotAssignment {
    const prismaSlotAssignmentData: PrismaSlotAssignment = {
      id: this.id,
      slotId: this.slotId,
      partId: this.partId,
      partName: this.partName,
      partCategory: this.partCategory,
      assignedAt: this.assignedAt,
      metadata: this.metadata,
      configurationId: this.configurationId,
      createdAt: new Date(this.createdAt),
      updatedAt: new Date(this.updatedAt),
    };

    return new SlotAssignment(prismaSlotAssignmentData);
  }
}
