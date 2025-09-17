/**
 * Artifact DTO Factory Base Class
 *
 * Base class for factories that work with artifacts as primary objects
 * and convert them to DTOs for database persistence.
 */

import { BaseDTOFactory } from "./base-factory";
import { ValidationResult } from "../../interfaces/base-dto";
import { createPackageLogger } from "@botking/logger";

/**
 * Base class for artifact-first DTO factories
 */
export abstract class ArtifactDTOFactory<
  TArtifact,
  TDTO,
> extends BaseDTOFactory<TDTO> {
  protected logger: ReturnType<typeof createPackageLogger>;

  constructor(factoryName: string) {
    super();
    this.logger = createPackageLogger("dto", { service: factoryName });
  }

  // ==========================================
  // ABSTRACT METHODS (Must be implemented by subclasses)
  // ==========================================

  /**
   * Create a default artifact
   */
  public abstract createArtifact(overrides?: Partial<any>): TArtifact;

  /**
   * Convert artifact to DTO for database persistence
   */
  public abstract artifactToDTO(artifact: TArtifact): TDTO;

  /**
   * Validate artifact using domain rules (override in subclasses)
   */
  public validateArtifact(artifact: TArtifact): ValidationResult {
    // Default implementation - override in subclasses for specific validation
    return {
      isValid: true,
      errors: [],
    };
  }

  // ==========================================
  // COMMON METHODS (Available to all subclasses)
  // ==========================================

  /**
   * Batch convert multiple artifacts to DTOs
   */
  public batchArtifactsToDTO(artifacts: TArtifact[]): TDTO[] {
    this.logger.debug("Batch converting artifacts to DTOs", {
      count: artifacts.length,
    });

    return artifacts.map((artifact) => {
      try {
        return this.artifactToDTO(artifact);
      } catch (error) {
        this.logger.error("Failed to convert artifact to DTO", {
          error: (error as Error).message,
        });
        throw error;
      }
    });
  }

  /**
   * Create and validate artifact
   */
  public createValidatedArtifact(config?: Partial<any>): {
    artifact: TArtifact | null;
    validation: ValidationResult;
  } {
    this.logger.debug("Creating and validating artifact", config);

    try {
      const artifact = this.createArtifact(config);
      const validation = this.validateArtifact(artifact);

      return {
        artifact: validation.isValid ? artifact : null,
        validation,
      };
    } catch (error) {
      this.logger.error("Failed to create artifact", {
        error: (error as Error).message,
      });

      return {
        artifact: null,
        validation: {
          isValid: false,
          errors: [
            {
              field: "creation",
              message: `Creation failed: ${(error as Error).message}`,
              code: "CREATION_ERROR",
            },
          ],
        },
      };
    }
  }

  /**
   * Artifact-to-DTO pipeline with validation
   */
  public artifactToDTOPipeline(artifact: TArtifact): {
    dto: TDTO | null;
    validation: ValidationResult;
  } {
    this.logger.debug("Running artifact-to-DTO pipeline");

    // First validate the artifact
    const validation = this.validateArtifact(artifact);

    if (!validation.isValid) {
      this.logger.warn("Artifact validation failed in pipeline", {
        errors: validation.errors,
      });
      return {
        dto: null,
        validation,
      };
    }

    // Convert to DTO
    try {
      const dto = this.artifactToDTO(artifact);
      return {
        dto,
        validation,
      };
    } catch (error) {
      this.logger.error("DTO conversion failed in pipeline", {
        error: (error as Error).message,
      });

      return {
        dto: null,
        validation: {
          isValid: false,
          errors: [
            {
              field: "conversion",
              message: `DTO conversion failed: ${(error as Error).message}`,
              code: "CONVERSION_ERROR",
            },
          ],
        },
      };
    }
  }

  /**
   * Batch create artifacts with validation
   */
  public batchCreateArtifacts(configs: Partial<any>[]): {
    artifacts: TArtifact[];
    failures: Array<{ config: Partial<any>; error: string }>;
  } {
    this.logger.debug("Batch creating artifacts", { count: configs.length });

    const artifacts: TArtifact[] = [];
    const failures: Array<{ config: Partial<any>; error: string }> = [];

    for (const config of configs) {
      try {
        const result = this.createValidatedArtifact(config);

        if (result.artifact && result.validation.isValid) {
          artifacts.push(result.artifact);
        } else {
          failures.push({
            config,
            error:
              result.validation.errors?.map((e: any) => e.message).join(", ") ||
              "Unknown error",
          });
        }
      } catch (error) {
        failures.push({
          config,
          error: (error as Error).message,
        });
      }
    }

    this.logger.debug("Batch creation completed", {
      successCount: artifacts.length,
      failureCount: failures.length,
    });

    return { artifacts, failures };
  }

  // ==========================================
  // LEGACY SUPPORT METHODS
  // ==========================================

  /**
   * Create default DTO (LEGACY - creates artifact first)
   * Override this in subclasses to provide legacy DTO creation
   */
  public createDefault(overrides?: Partial<TDTO>): TDTO {
    this.logger.debug("Creating default DTO via legacy method");

    // Create artifact first
    const artifact = this.createArtifact(overrides as any);

    // Convert to DTO
    const dto = this.artifactToDTO(artifact);

    // Apply any DTO-specific overrides
    return this.mergeDefaults(dto, overrides);
  }

  /**
   * Create DTO from data (LEGACY - creates artifact first)
   * Override this in subclasses to handle different data formats
   */
  public createFromData(data: any): TDTO {
    this.logger.debug("Creating DTO from data via legacy method");

    // Try to detect if data is already an artifact
    if (this.isArtifact(data)) {
      return this.artifactToDTO(data as TArtifact);
    }

    // Otherwise create artifact from data
    const artifact = this.createArtifact(data);
    return this.artifactToDTO(artifact);
  }

  /**
   * Determine if data is an artifact (override in subclasses)
   */
  protected isArtifact(data: any): boolean {
    // Basic heuristic - override in subclasses for specific detection
    return (
      data &&
      typeof data === "object" &&
      "id" in data &&
      "name" in data &&
      typeof data.validate === "function"
    );
  }

  // ==========================================
  // UTILITY METHODS
  // ==========================================

  /**
   * Get artifact factory statistics
   */
  public getFactoryStats(): {
    factoryName: string;
    artifactsCreated: number;
    dtosConverted: number;
    validationErrors: number;
  } {
    // This could be enhanced with actual counters if needed
    return {
      factoryName: this.constructor.name,
      artifactsCreated: 0, // Could be tracked
      dtosConverted: 0, // Could be tracked
      validationErrors: 0, // Could be tracked
    };
  }
}
