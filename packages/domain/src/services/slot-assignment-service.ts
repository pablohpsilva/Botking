/**
 * Slot assignment validation and management service
 */

import { SkeletonType, PartCategory } from "@botking/db";
import {
  SlotIdentifier,
  ISlotAssignment,
  ISkeletonSlotConfiguration,
  ISlotAssignmentCommand,
  ISlotAssignmentValidation,
  ISlotAssignmentResults,
  SlotAssignmentOperation,
  ISlotAssignmentHistory,
} from "../types/slot-assignment";
import {
  getAvailableSlotsForSkeleton,
  getSlotInfo,
  isPartCompatibleWithSlot,
} from "../rules/slot-configuration";
import { ValidationSeverity, IValidationResult } from "../types/validation";

/**
 * Service for managing slot assignments and validation
 */
export class SlotAssignmentService {
  private assignmentHistory: Map<string, ISlotAssignmentHistory[]> = new Map();

  /**
   * Create a new skeleton slot configuration
   */
  createSkeletonSlotConfiguration(
    skeletonType: SkeletonType
  ): ISkeletonSlotConfiguration {
    const availableSlots = getAvailableSlotsForSkeleton(skeletonType);

    return {
      skeletonType,
      availableSlots,
      assignments: new Map(),
      lastModified: new Date(),
    };
  }

  /**
   * Validate a single slot assignment
   */
  validateSlotAssignment(
    config: ISkeletonSlotConfiguration,
    slotId: SlotIdentifier,
    partId: string,
    partCategory: PartCategory | "expansionChip" | "soulChip"
  ): ISlotAssignmentValidation {
    const errors: string[] = [];
    const warnings: string[] = [];
    const suggestions: string[] = [];

    // Check if slot exists in this skeleton configuration
    const slotInfo = config.availableSlots.find(
      (slot) => slot.slotId === slotId
    );
    if (!slotInfo) {
      errors.push(
        `Slot ${slotId} is not available for ${config.skeletonType} skeleton`
      );
      return {
        isValid: false,
        slotId,
        partId,
        errors,
        warnings,
        suggestions,
      };
    }

    // Check if slot is already occupied
    const existingAssignment = config.assignments.get(slotId);
    if (existingAssignment) {
      warnings.push(
        `Slot ${slotId} is already occupied by part ${existingAssignment.partId}. This will replace the existing assignment.`
      );
      suggestions.push(
        `Consider using swap operation to exchange parts safely.`
      );
    }

    // Check part category compatibility
    if (!isPartCompatibleWithSlot(slotId, partCategory)) {
      errors.push(
        `Part category ${partCategory} is not compatible with slot ${slotId} (accepts: ${slotInfo.category})`
      );
    }

    // Check if part is already assigned to another slot
    const existingPartAssignment = Array.from(config.assignments.values()).find(
      (assignment) => assignment.partId === partId
    );
    if (existingPartAssignment) {
      warnings.push(
        `Part ${partId} is already assigned to slot ${existingPartAssignment.slotId}. This will move the part.`
      );
    }

    return {
      isValid: errors.length === 0,
      slotId,
      partId,
      errors,
      warnings,
      suggestions,
    };
  }

  /**
   * Validate complete slot configuration
   */
  validateSlotConfiguration(
    config: ISkeletonSlotConfiguration
  ): ISlotAssignmentResults {
    const assignments: ISlotAssignmentValidation[] = [];
    const conflictingSlots: SlotIdentifier[] = [];
    const unassignedRequiredSlots: SlotIdentifier[] = [];

    // Validate each assignment
    for (const [slotId, assignment] of config.assignments) {
      const validation = this.validateSlotAssignment(
        config,
        slotId,
        assignment.partId,
        assignment.partCategory as PartCategory | "expansionChip" | "soulChip"
      );
      assignments.push(validation);

      if (!validation.isValid) {
        conflictingSlots.push(slotId);
      }
    }

    // Check for unassigned required slots
    for (const slotInfo of config.availableSlots) {
      if (slotInfo.isRequired && !config.assignments.has(slotInfo.slotId)) {
        unassignedRequiredSlots.push(slotInfo.slotId);
      }
    }

    const totalSlots = config.availableSlots.length;
    const assignedSlots = config.assignments.size;
    const requiredSlots = config.availableSlots.filter(
      (slot) => slot.isRequired
    ).length;
    const optionalSlots = totalSlots - requiredSlots;

    return {
      isValid:
        conflictingSlots.length === 0 && unassignedRequiredSlots.length === 0,
      assignments,
      conflictingSlots,
      unassignedRequiredSlots,
      summary: {
        totalSlots,
        assignedSlots,
        requiredSlots,
        optionalSlots,
        conflicts: conflictingSlots.length,
      },
    };
  }

  /**
   * Execute a slot assignment command
   */
  executeSlotAssignment(
    config: ISkeletonSlotConfiguration,
    command: ISlotAssignmentCommand,
    userId: string
  ): IValidationResult {
    try {
      const historyId = `${config.skeletonType}-${Date.now()}`;

      switch (command.operation) {
        case SlotAssignmentOperation.ASSIGN:
          return this.executeAssign(config, command, userId, historyId);

        case SlotAssignmentOperation.UNASSIGN:
          return this.executeUnassign(config, command, userId, historyId);

        case SlotAssignmentOperation.SWAP:
          return this.executeSwap(config, command, userId, historyId);

        case SlotAssignmentOperation.MOVE:
          return this.executeMove(config, command, userId, historyId);

        default:
          return {
            isValid: false,
            severity: ValidationSeverity.ERROR,
            ruleName: "SlotAssignmentOperation",
            message: `Unknown operation: ${command.operation}`,
          };
      }
    } catch (error) {
      return {
        isValid: false,
        severity: ValidationSeverity.ERROR,
        ruleName: "SlotAssignmentExecution",
        message: `Failed to execute slot assignment: ${error instanceof Error ? error.message : "Unknown error"}`,
      };
    }
  }

  /**
   * Execute assign operation
   */
  private executeAssign(
    config: ISkeletonSlotConfiguration,
    command: ISlotAssignmentCommand,
    userId: string,
    historyId: string
  ): IValidationResult {
    if (!command.partId) {
      return {
        isValid: false,
        severity: ValidationSeverity.ERROR,
        ruleName: "SlotAssignmentAssign",
        message: "Part ID is required for assign operation",
      };
    }

    // Get slot info to determine part category
    const slotInfo = getSlotInfo(command.slotId);
    const partCategory = slotInfo.category as
      | PartCategory
      | "expansionChip"
      | "soulChip";

    // Validate the assignment
    const validation = this.validateSlotAssignment(
      config,
      command.slotId,
      command.partId,
      partCategory
    );

    if (!validation.isValid) {
      return {
        isValid: false,
        severity: ValidationSeverity.ERROR,
        ruleName: "SlotAssignmentValidation",
        message: `Assignment validation failed: ${validation.errors.join(", ")}`,
        details: { validation },
      };
    }

    // Record previous state for history
    const previousAssignment = config.assignments.get(command.slotId) || null;

    // Create new assignment
    const newAssignment: ISlotAssignment = {
      slotId: command.slotId,
      partId: command.partId,
      partName: `Part ${command.partId}`, // This would come from part data in real implementation
      partCategory: partCategory as PartCategory,
      assignedAt: new Date(),
      metadata: command.metadata,
    };

    // Apply the assignment
    config.assignments.set(command.slotId, newAssignment);
    config.lastModified = new Date();

    // Record history
    this.recordHistory(historyId, {
      id: `${historyId}-assign`,
      timestamp: new Date(),
      operation: SlotAssignmentOperation.ASSIGN,
      previousState: previousAssignment,
      newState: newAssignment,
      userId,
    });

    return {
      isValid: true,
      severity: ValidationSeverity.INFO,
      ruleName: "SlotAssignmentAssign",
      message: `Successfully assigned part ${command.partId} to slot ${command.slotId}`,
      details: { assignment: newAssignment, validation },
    };
  }

  /**
   * Execute unassign operation
   */
  private executeUnassign(
    config: ISkeletonSlotConfiguration,
    command: ISlotAssignmentCommand,
    userId: string,
    historyId: string
  ): IValidationResult {
    const existingAssignment = config.assignments.get(command.slotId);

    if (!existingAssignment) {
      return {
        isValid: false,
        severity: ValidationSeverity.WARNING,
        ruleName: "SlotAssignmentUnassign",
        message: `Slot ${command.slotId} is not currently assigned`,
      };
    }

    // Check if this is a required slot
    const slotInfo = getSlotInfo(command.slotId);
    if (slotInfo.isRequired) {
      return {
        isValid: false,
        severity: ValidationSeverity.ERROR,
        ruleName: "SlotAssignmentUnassign",
        message: `Cannot unassign required slot ${command.slotId}`,
      };
    }

    // Remove the assignment
    config.assignments.delete(command.slotId);
    config.lastModified = new Date();

    // Record history
    this.recordHistory(historyId, {
      id: `${historyId}-unassign`,
      timestamp: new Date(),
      operation: SlotAssignmentOperation.UNASSIGN,
      previousState: existingAssignment,
      newState: null,
      userId,
    });

    return {
      isValid: true,
      severity: ValidationSeverity.INFO,
      ruleName: "SlotAssignmentUnassign",
      message: `Successfully unassigned part from slot ${command.slotId}`,
      details: { previousAssignment: existingAssignment },
    };
  }

  /**
   * Execute swap operation
   */
  private executeSwap(
    config: ISkeletonSlotConfiguration,
    command: ISlotAssignmentCommand,
    userId: string,
    historyId: string
  ): IValidationResult {
    if (!command.swapWithSlotId) {
      return {
        isValid: false,
        severity: ValidationSeverity.ERROR,
        ruleName: "SlotAssignmentSwap",
        message: "Swap target slot ID is required for swap operation",
      };
    }

    const assignment1 = config.assignments.get(command.slotId);
    const assignment2 = config.assignments.get(command.swapWithSlotId);

    if (!assignment1 || !assignment2) {
      return {
        isValid: false,
        severity: ValidationSeverity.ERROR,
        ruleName: "SlotAssignmentSwap",
        message: "Both slots must be assigned to perform swap operation",
      };
    }

    // Validate compatibility after swap
    const validation1 = this.validateSlotAssignment(
      config,
      command.slotId,
      assignment2.partId,
      assignment2.partCategory as PartCategory | "expansionChip" | "soulChip"
    );

    const validation2 = this.validateSlotAssignment(
      config,
      command.swapWithSlotId,
      assignment1.partId,
      assignment1.partCategory as PartCategory | "expansionChip" | "soulChip"
    );

    if (!validation1.isValid || !validation2.isValid) {
      return {
        isValid: false,
        severity: ValidationSeverity.ERROR,
        ruleName: "SlotAssignmentSwap",
        message: "Swap would result in incompatible part assignments",
        details: { validation1, validation2 },
      };
    }

    // Perform the swap
    const swappedAssignment1: ISlotAssignment = {
      ...assignment2,
      slotId: command.slotId,
      assignedAt: new Date(),
    };

    const swappedAssignment2: ISlotAssignment = {
      ...assignment1,
      slotId: command.swapWithSlotId,
      assignedAt: new Date(),
    };

    config.assignments.set(command.slotId, swappedAssignment1);
    config.assignments.set(command.swapWithSlotId, swappedAssignment2);
    config.lastModified = new Date();

    // Record history for both slots
    this.recordHistory(historyId, {
      id: `${historyId}-swap-1`,
      timestamp: new Date(),
      operation: SlotAssignmentOperation.SWAP,
      previousState: assignment1,
      newState: swappedAssignment1,
      userId,
    });

    this.recordHistory(historyId, {
      id: `${historyId}-swap-2`,
      timestamp: new Date(),
      operation: SlotAssignmentOperation.SWAP,
      previousState: assignment2,
      newState: swappedAssignment2,
      userId,
    });

    return {
      isValid: true,
      severity: ValidationSeverity.INFO,
      ruleName: "SlotAssignmentSwap",
      message: `Successfully swapped parts between slots ${command.slotId} and ${command.swapWithSlotId}`,
      details: {
        newAssignment1: swappedAssignment1,
        newAssignment2: swappedAssignment2,
      },
    };
  }

  /**
   * Execute move operation
   */
  private executeMove(
    config: ISkeletonSlotConfiguration,
    command: ISlotAssignmentCommand,
    userId: string,
    historyId: string
  ): IValidationResult {
    if (!command.targetSlotId) {
      return {
        isValid: false,
        severity: ValidationSeverity.ERROR,
        ruleName: "SlotAssignmentMove",
        message: "Target slot ID is required for move operation",
      };
    }

    const sourceAssignment = config.assignments.get(command.slotId);
    if (!sourceAssignment) {
      return {
        isValid: false,
        severity: ValidationSeverity.ERROR,
        ruleName: "SlotAssignmentMove",
        message: `No part assigned to source slot ${command.slotId}`,
      };
    }

    // Validate move to target slot
    const validation = this.validateSlotAssignment(
      config,
      command.targetSlotId,
      sourceAssignment.partId,
      sourceAssignment.partCategory as
        | PartCategory
        | "expansionChip"
        | "soulChip"
    );

    if (!validation.isValid) {
      return {
        isValid: false,
        severity: ValidationSeverity.ERROR,
        ruleName: "SlotAssignmentMove",
        message: `Cannot move part to target slot: ${validation.errors.join(", ")}`,
        details: { validation },
      };
    }

    // Check if source slot is required
    const sourceSlotInfo = getSlotInfo(command.slotId);
    if (sourceSlotInfo.isRequired) {
      return {
        isValid: false,
        severity: ValidationSeverity.ERROR,
        ruleName: "SlotAssignmentMove",
        message: `Cannot move part from required slot ${command.slotId}`,
      };
    }

    const targetAssignment = config.assignments.get(command.targetSlotId);

    // Create moved assignment
    const movedAssignment: ISlotAssignment = {
      ...sourceAssignment,
      slotId: command.targetSlotId,
      assignedAt: new Date(),
      metadata: { ...sourceAssignment.metadata, ...command.metadata },
    };

    // Apply the move
    config.assignments.delete(command.slotId);
    config.assignments.set(command.targetSlotId, movedAssignment);
    config.lastModified = new Date();

    // Record history
    this.recordHistory(historyId, {
      id: `${historyId}-move-source`,
      timestamp: new Date(),
      operation: SlotAssignmentOperation.MOVE,
      previousState: sourceAssignment,
      newState: null,
      userId,
    });

    this.recordHistory(historyId, {
      id: `${historyId}-move-target`,
      timestamp: new Date(),
      operation: SlotAssignmentOperation.MOVE,
      previousState: targetAssignment || null,
      newState: movedAssignment,
      userId,
    });

    return {
      isValid: true,
      severity: ValidationSeverity.INFO,
      ruleName: "SlotAssignmentMove",
      message: `Successfully moved part from slot ${command.slotId} to ${command.targetSlotId}`,
      details: {
        movedAssignment,
        replacedAssignment: targetAssignment,
      },
    };
  }

  /**
   * Record assignment history
   */
  private recordHistory(
    configId: string,
    historyEntry: ISlotAssignmentHistory
  ): void {
    if (!this.assignmentHistory.has(configId)) {
      this.assignmentHistory.set(configId, []);
    }

    const history = this.assignmentHistory.get(configId)!;
    history.push(historyEntry);

    // Keep only last 100 entries to prevent memory bloat
    if (history.length > 100) {
      history.shift();
    }
  }

  /**
   * Get assignment history for a configuration
   */
  getAssignmentHistory(configId: string): ISlotAssignmentHistory[] {
    return this.assignmentHistory.get(configId) || [];
  }

  /**
   * Get visual representation data for 3D rendering
   */
  getVisualRepresentation(config: ISkeletonSlotConfiguration): {
    skeleton: {
      type: SkeletonType;
      slots: Array<{
        slotId: SlotIdentifier;
        position: { x: number; y: number; z: number };
        isOccupied: boolean;
        partData?: {
          partId: string;
          partName: string;
          category: PartCategory;
          visualMetadata?: any;
        };
      }>;
    };
  } {
    return {
      skeleton: {
        type: config.skeletonType,
        slots: config.availableSlots.map((slotInfo) => {
          const assignment = config.assignments.get(slotInfo.slotId);
          return {
            slotId: slotInfo.slotId,
            position: slotInfo.constraints?.visualPosition || {
              x: 0,
              y: 0,
              z: 0,
            },
            isOccupied: !!assignment,
            partData: assignment
              ? {
                  partId: assignment.partId,
                  partName: assignment.partName,
                  category: assignment.partCategory,
                  visualMetadata: assignment.metadata,
                }
              : undefined,
          };
        }),
      },
    };
  }
}
