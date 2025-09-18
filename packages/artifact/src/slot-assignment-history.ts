/**
 * SlotAssignmentHistory artifact implementation based on schema.prisma SlotAssignmentHistory model
 */

import type { SlotAssignmentHistory as PrismaSlotAssignmentHistory } from "@botking/db";
import { IGenericArtifact } from "./types";

export interface ISlotAssignmentHistory
  extends PrismaSlotAssignmentHistory,
    IGenericArtifact<ISlotAssignmentHistory, Record<string, any>> {}

export abstract class BaseSlotAssignmentHistory {
  public readonly id: string;
  public readonly botId: string;
  public readonly operation: string;
  public readonly slotId: string;
  public readonly partId: string | null;
  public readonly targetSlotId: string | null;
  public readonly swapWithSlotId: string | null;
  public readonly previousState: Record<string, any> | null;
  public readonly newState: Record<string, any> | null;
  public readonly userId: string;
  public readonly timestamp: Date;
  public readonly metadata: Record<string, any> | null;
  public readonly createdAt: Date;

  constructor(prismaSlotAssignmentHistory: PrismaSlotAssignmentHistory) {
    this.id = prismaSlotAssignmentHistory.id;
    this.botId = prismaSlotAssignmentHistory.botId;
    this.operation = prismaSlotAssignmentHistory.operation;
    this.slotId = prismaSlotAssignmentHistory.slotId;
    this.partId = prismaSlotAssignmentHistory.partId;
    this.targetSlotId = prismaSlotAssignmentHistory.targetSlotId;
    this.swapWithSlotId = prismaSlotAssignmentHistory.swapWithSlotId;
    this.previousState = prismaSlotAssignmentHistory.previousState as Record<
      string,
      any
    > | null;
    this.newState = prismaSlotAssignmentHistory.newState as Record<
      string,
      any
    > | null;
    this.userId = prismaSlotAssignmentHistory.userId;
    this.timestamp = prismaSlotAssignmentHistory.timestamp;
    this.metadata = prismaSlotAssignmentHistory.metadata as Record<
      string,
      any
    > | null;
    this.createdAt = prismaSlotAssignmentHistory.createdAt;
  }
}

/**
 * SlotAssignmentHistory artifact implementation - directly based on database schema
 */
export class SlotAssignmentHistory
  extends BaseSlotAssignmentHistory
  implements ISlotAssignmentHistory
{
  constructor(prismaSlotAssignmentHistory: PrismaSlotAssignmentHistory) {
    super(prismaSlotAssignmentHistory);
  }

  // Serialization
  toJSON(): Record<string, any> {
    return {
      id: this.id,
      botId: this.botId,
      operation: this.operation,
      slotId: this.slotId,
      partId: this.partId,
      targetSlotId: this.targetSlotId,
      swapWithSlotId: this.swapWithSlotId,
      previousState: this.previousState,
      newState: this.newState,
      userId: this.userId,
      timestamp: this.timestamp.toISOString(),
      metadata: this.metadata,
      createdAt: this.createdAt.toISOString(),
    };
  }

  serialize(): string {
    return JSON.stringify(this.toJSON());
  }

  clone(): ISlotAssignmentHistory {
    const prismaSlotAssignmentHistoryData: PrismaSlotAssignmentHistory = {
      id: this.id,
      botId: this.botId,
      operation: this.operation,
      slotId: this.slotId,
      partId: this.partId,
      targetSlotId: this.targetSlotId,
      swapWithSlotId: this.swapWithSlotId,
      previousState: this.previousState,
      newState: this.newState,
      userId: this.userId,
      timestamp: this.timestamp,
      metadata: this.metadata,
      createdAt: this.createdAt,
    };

    return new SlotAssignmentHistory(prismaSlotAssignmentHistoryData);
  }
}
