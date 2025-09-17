/**
 * Slot assignment DTO factory
 */

import { PartCategory } from "@botking/db";
import { BaseDTOFactory } from "./dto-factory";
import {
  SlotAssignmentDTO,
  CreateSlotAssignmentDTO,
  UpdateSlotAssignmentDTO,
  SkeletonSlotConfigurationDTO,
  CreateSkeletonSlotConfigurationDTO,
  UpdateSkeletonSlotConfigurationDTO,
  SlotInfoDTO,
  SlotAssignmentValidationDTO,
  SlotAssignmentResultsDTO,
  SlotAssignmentCommandDTO,
  SlotAssignmentHistoryDTO,
  BotVisualizationDTO,
} from "../interfaces/slot-assignment-dto";

/**
 * Factory for creating slot assignment DTOs
 */
export class SlotAssignmentDTOFactory {
  /**
   * Create a default slot assignment DTO
   */
  static createDefaultSlotAssignment(): SlotAssignmentDTO {
    return {
      id: SlotAssignmentDTOFactory.generateId(),
      slotId: "",
      partId: "",
      partName: "",
      partCategory: PartCategory.HEAD,
      assignedAt: new Date(),
      metadata: {},
    };
  }

  /**
   * Create slot assignment DTO from data
   */
  static createSlotAssignmentFromData(
    data: Partial<SlotAssignmentDTO>
  ): SlotAssignmentDTO {
    return {
      ...this.createDefaultSlotAssignment(),
      ...data,
      id: data.id || SlotAssignmentDTOFactory.generateId(),
      assignedAt: data.assignedAt ? new Date(data.assignedAt) : new Date(),
    };
  }

  /**
   * Create slot assignment DTO for creation
   */
  static createSlotAssignmentForCreation(
    data: CreateSlotAssignmentDTO
  ): CreateSlotAssignmentDTO {
    return {
      slotId: data.slotId,
      partId: data.partId,
      partName: data.partName,
      partCategory: data.partCategory,
      metadata: data.metadata || {},
    };
  }

  /**
   * Create slot assignment DTO for update
   */
  static createSlotAssignmentForUpdate(
    data: UpdateSlotAssignmentDTO
  ): UpdateSlotAssignmentDTO {
    const updateData: UpdateSlotAssignmentDTO = {};

    if (data.slotId !== undefined) updateData.slotId = data.slotId;
    if (data.partId !== undefined) updateData.partId = data.partId;
    if (data.partName !== undefined) updateData.partName = data.partName;
    if (data.partCategory !== undefined)
      updateData.partCategory = data.partCategory;
    if (data.metadata !== undefined) updateData.metadata = data.metadata;

    return updateData;
  }

  /**
   * Create default skeleton slot configuration DTO
   */
  static createDefaultSkeletonSlotConfiguration(): SkeletonSlotConfigurationDTO {
    return {
      id: SlotAssignmentDTOFactory.generateId(),
      botId: "",
      skeletonType: "balanced",
      slotAssignments: [],
      lastModified: new Date(),
      createdAt: new Date(),
    };
  }

  /**
   * Create skeleton slot configuration DTO from data
   */
  static createSkeletonSlotConfigurationFromData(
    data: Partial<SkeletonSlotConfigurationDTO>
  ): SkeletonSlotConfigurationDTO {
    return {
      ...this.createDefaultSkeletonSlotConfiguration(),
      ...data,
      id: data.id || SlotAssignmentDTOFactory.generateId(),
      slotAssignments: data.slotAssignments || [],
      lastModified: data.lastModified
        ? new Date(data.lastModified)
        : new Date(),
      createdAt: data.createdAt ? new Date(data.createdAt) : new Date(),
    };
  }

  /**
   * Create skeleton slot configuration DTO for creation
   */
  static createSkeletonSlotConfigurationForCreation(
    data: CreateSkeletonSlotConfigurationDTO
  ): CreateSkeletonSlotConfigurationDTO {
    return {
      botId: data.botId,
      skeletonType: data.skeletonType,
      slotAssignments: data.slotAssignments || [],
    };
  }

  /**
   * Create skeleton slot configuration DTO for update
   */
  static createSkeletonSlotConfigurationForUpdate(
    data: UpdateSkeletonSlotConfigurationDTO
  ): UpdateSkeletonSlotConfigurationDTO {
    const updateData: UpdateSkeletonSlotConfigurationDTO = {};

    if (data.skeletonType !== undefined)
      updateData.skeletonType = data.skeletonType;
    if (data.slotAssignments !== undefined)
      updateData.slotAssignments = data.slotAssignments;

    return updateData;
  }

  /**
   * Create default slot info DTO
   */
  static createDefaultSlotInfo(): SlotInfoDTO {
    return {
      slotId: "",
      category: PartCategory.HEAD,
      position: "primary",
      index: 1,
      isRequired: false,
      visualPosition: { x: 0, y: 0, z: 0 },
      compatiblePartTypes: [],
    };
  }

  /**
   * Create slot info DTO from data
   */
  static createSlotInfoFromData(data: Partial<SlotInfoDTO>): SlotInfoDTO {
    return {
      ...this.createDefaultSlotInfo(),
      ...data,
      visualPosition: data.visualPosition || { x: 0, y: 0, z: 0 },
      compatiblePartTypes: data.compatiblePartTypes || [],
    };
  }

  /**
   * Create slot assignment validation DTO
   */
  static createSlotAssignmentValidation(
    data: Partial<SlotAssignmentValidationDTO>
  ): SlotAssignmentValidationDTO {
    return {
      isValid: data.isValid ?? false,
      slotId: data.slotId || "",
      partId: data.partId,
      errors: data.errors || [],
      warnings: data.warnings || [],
      suggestions: data.suggestions || [],
    };
  }

  /**
   * Create slot assignment results DTO
   */
  static createSlotAssignmentResults(
    data: Partial<SlotAssignmentResultsDTO>
  ): SlotAssignmentResultsDTO {
    return {
      isValid: data.isValid ?? false,
      assignments: data.assignments || [],
      conflictingSlots: data.conflictingSlots || [],
      unassignedRequiredSlots: data.unassignedRequiredSlots || [],
      summary: data.summary || {
        totalSlots: 0,
        assignedSlots: 0,
        requiredSlots: 0,
        optionalSlots: 0,
        conflicts: 0,
      },
    };
  }

  /**
   * Create slot assignment command DTO
   */
  static createSlotAssignmentCommand(
    data: Partial<SlotAssignmentCommandDTO>
  ): SlotAssignmentCommandDTO {
    return {
      operation: data.operation || "assign",
      slotId: data.slotId || "",
      partId: data.partId,
      targetSlotId: data.targetSlotId,
      swapWithSlotId: data.swapWithSlotId,
      metadata: data.metadata || {},
    };
  }

  /**
   * Create slot assignment history DTO
   */
  static createSlotAssignmentHistory(
    data: Partial<SlotAssignmentHistoryDTO>
  ): SlotAssignmentHistoryDTO {
    return {
      id: data.id || SlotAssignmentDTOFactory.generateId(),
      botId: data.botId || "",
      timestamp: data.timestamp ? new Date(data.timestamp) : new Date(),
      operation: data.operation || "assign",
      previousState: data.previousState,
      newState: data.newState,
      userId: data.userId || "",
    };
  }

  /**
   * Create default bot visualization DTO
   */
  static createDefaultBotVisualization(): BotVisualizationDTO {
    return {
      botId: "",
      skeletonType: "balanced",
      slots: [],
      lastModified: new Date(),
    };
  }

  /**
   * Create bot visualization DTO from data
   */
  static createBotVisualizationFromData(
    data: Partial<BotVisualizationDTO>
  ): BotVisualizationDTO {
    return {
      ...this.createDefaultBotVisualization(),
      ...data,
      slots: data.slots || [],
      lastModified: data.lastModified
        ? new Date(data.lastModified)
        : new Date(),
    };
  }

  /**
   * Convert domain slot assignment to DTO
   */
  static fromDomainSlotAssignment(domainAssignment: any): SlotAssignmentDTO {
    return this.createSlotAssignmentFromData({
      id: SlotAssignmentDTOFactory.generateId(),
      slotId: domainAssignment.slotId,
      partId: domainAssignment.partId,
      partName: domainAssignment.partName,
      partCategory: domainAssignment.partCategory,
      assignedAt: domainAssignment.assignedAt,
      metadata: domainAssignment.metadata,
    });
  }

  /**
   * Convert domain slot configuration to DTO
   */
  static fromDomainSlotConfiguration(
    botId: string,
    domainConfig: any
  ): SkeletonSlotConfigurationDTO {
    const slotAssignments: SlotAssignmentDTO[] = [];

    for (const [slotId, assignment] of domainConfig.assignments) {
      slotAssignments.push(this.fromDomainSlotAssignment(assignment));
    }

    return this.createSkeletonSlotConfigurationFromData({
      id: SlotAssignmentDTOFactory.generateId(),
      botId,
      skeletonType: domainConfig.skeletonType,
      slotAssignments,
      lastModified: domainConfig.lastModified,
      createdAt: new Date(),
    });
  }

  /**
   * Convert domain validation results to DTO
   */
  static fromDomainValidationResults(
    domainResults: any
  ): SlotAssignmentResultsDTO {
    const assignments = domainResults.assignments.map((assignment: any) =>
      this.createSlotAssignmentValidation({
        isValid: assignment.isValid,
        slotId: assignment.slotId,
        partId: assignment.partId,
        errors: assignment.errors,
        warnings: assignment.warnings,
        suggestions: assignment.suggestions,
      })
    );

    return this.createSlotAssignmentResults({
      isValid: domainResults.isValid,
      assignments,
      conflictingSlots: domainResults.conflictingSlots,
      unassignedRequiredSlots: domainResults.unassignedRequiredSlots,
      summary: domainResults.summary,
    });
  }

  /**
   * Convert domain visualization to DTO
   */
  static fromDomainVisualization(
    botId: string,
    domainVisualization: any
  ): BotVisualizationDTO {
    return this.createBotVisualizationFromData({
      botId,
      skeletonType: domainVisualization.skeletonType,
      slots: domainVisualization.slots,
      lastModified: new Date(),
    });
  }

  /**
   * Validate slot assignment DTO
   */
  static validateSlotAssignment(dto: SlotAssignmentDTO): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    if (!dto.id) errors.push("Slot assignment ID is required");
    if (!dto.slotId) errors.push("Slot ID is required");
    if (!dto.partId) errors.push("Part ID is required");
    if (!dto.partName) errors.push("Part name is required");
    if (!dto.partCategory) errors.push("Part category is required");
    if (!dto.assignedAt) errors.push("Assigned date is required");

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Validate skeleton slot configuration DTO
   */
  static validateSkeletonSlotConfiguration(dto: SkeletonSlotConfigurationDTO): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    if (!dto.id) errors.push("Configuration ID is required");
    if (!dto.botId) errors.push("Bot ID is required");
    if (!dto.skeletonType) errors.push("Skeleton type is required");
    if (!Array.isArray(dto.slotAssignments))
      errors.push("Slot assignments must be an array");

    // Validate each slot assignment
    dto.slotAssignments.forEach((assignment, index) => {
      const validation = this.validateSlotAssignment(assignment);
      if (!validation.isValid) {
        errors.push(
          `Slot assignment ${index}: ${validation.errors.join(", ")}`
        );
      }
    });

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Generate a unique ID
   */
  private static generateId(): string {
    return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}
