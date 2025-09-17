/**
 * Slot assignment DTO interfaces
 */

import { PartCategory } from "@botking/db";

/**
 * Slot assignment DTO for database persistence
 */
export interface SlotAssignmentDTO {
  id: string;
  slotId: string;
  partId: string;
  partName: string;
  partCategory: PartCategory | "expansionChip" | "soulChip";
  assignedAt: Date;
  metadata?: Record<string, any>;
}

/**
 * Slot assignment creation DTO
 */
export interface CreateSlotAssignmentDTO {
  slotId: string;
  partId: string;
  partName: string;
  partCategory: PartCategory | "expansionChip" | "soulChip";
  metadata?: Record<string, any>;
}

/**
 * Slot assignment update DTO
 */
export interface UpdateSlotAssignmentDTO {
  slotId?: string;
  partId?: string;
  partName?: string;
  partCategory?: PartCategory | "expansionChip" | "soulChip";
  metadata?: Record<string, any>;
}

/**
 * Skeleton slot configuration DTO
 */
export interface SkeletonSlotConfigurationDTO {
  id: string;
  botId: string;
  skeletonType: string;
  slotAssignments: SlotAssignmentDTO[];
  lastModified: Date;
  createdAt: Date;
}

/**
 * Slot configuration creation DTO
 */
export interface CreateSkeletonSlotConfigurationDTO {
  botId: string;
  skeletonType: string;
  slotAssignments?: CreateSlotAssignmentDTO[];
}

/**
 * Slot configuration update DTO
 */
export interface UpdateSkeletonSlotConfigurationDTO {
  skeletonType?: string;
  slotAssignments?: (CreateSlotAssignmentDTO | UpdateSlotAssignmentDTO)[];
}

/**
 * Slot info DTO for visualization
 */
export interface SlotInfoDTO {
  slotId: string;
  category: PartCategory | "expansionChip" | "soulChip";
  position: string;
  index: number;
  isRequired: boolean;
  visualPosition?: {
    x: number;
    y: number;
    z: number;
  };
  maxPartSize?: string;
  compatiblePartTypes?: string[];
}

/**
 * Slot assignment validation DTO
 */
export interface SlotAssignmentValidationDTO {
  isValid: boolean;
  slotId: string;
  partId?: string;
  errors: string[];
  warnings: string[];
  suggestions?: string[];
}

/**
 * Complete slot assignment results DTO
 */
export interface SlotAssignmentResultsDTO {
  isValid: boolean;
  assignments: SlotAssignmentValidationDTO[];
  conflictingSlots: string[];
  unassignedRequiredSlots: string[];
  summary: {
    totalSlots: number;
    assignedSlots: number;
    requiredSlots: number;
    optionalSlots: number;
    conflicts: number;
  };
}

/**
 * Slot assignment command DTO
 */
export interface SlotAssignmentCommandDTO {
  operation: "assign" | "unassign" | "swap" | "move";
  slotId: string;
  partId?: string;
  targetSlotId?: string;
  swapWithSlotId?: string;
  metadata?: Record<string, any>;
}

/**
 * Slot assignment history DTO
 */
export interface SlotAssignmentHistoryDTO {
  id: string;
  botId: string;
  timestamp: Date;
  operation: "assign" | "unassign" | "swap" | "move";
  previousState?: SlotAssignmentDTO;
  newState?: SlotAssignmentDTO;
  userId: string;
}

/**
 * Bot visualization DTO
 */
export interface BotVisualizationDTO {
  botId: string;
  skeletonType: string;
  slots: Array<{
    slotId: string;
    category: string;
    position: string;
    visualPosition: { x: number; y: number; z: number };
    isOccupied: boolean;
    partData?: {
      id: string;
      name: string;
      category: string;
      visualMetadata?: any;
    };
  }>;
  lastModified: Date;
}
