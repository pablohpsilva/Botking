import {
  SoulChipDTO,
  SkeletonDTO,
  PartDTO,
  ExpansionChipDTO,
  BotStateDTO,
  BotDTO,
  BotTemplateDTO,
  CollectionDTO,
  RarityDTO,
  SkeletonTypeDTO,
  MobilityTypeDTO,
  PartCategoryDTO,
  ExpansionChipEffectDTO,
  BotLocationDTO,
  CombatStatsDTO,
  AbilityDTO,
} from "../interfaces/artifact-dto";
import { ValidationResult, ValidationError } from "../interfaces/base-dto";

/**
 * Base factory class for creating DTOs
 */
export abstract class BaseDTOFactory<T> {
  /**
   * Create a new DTO with default values
   */
  public abstract createDefault(overrides?: Partial<T>): T;

  /**
   * Create a DTO from existing data
   */
  public abstract createFromData(data: any): T;

  /**
   * Validate a DTO
   */
  public abstract validate(dto: T): ValidationResult;

  /**
   * Generate a unique ID
   */
  protected generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Get current timestamp
   */
  protected getCurrentTimestamp(): Date {
    return new Date();
  }

  /**
   * Merge data with defaults
   */
  protected mergeDefaults<U>(defaults: U, overrides?: Partial<U>): U {
    return { ...defaults, ...overrides };
  }

  /**
   * Validate required fields
   */
  protected validateRequired(
    data: any,
    requiredFields: string[]
  ): ValidationError[] {
    const errors: ValidationError[] = [];

    requiredFields.forEach((field) => {
      if (
        data[field] === undefined ||
        data[field] === null ||
        data[field] === ""
      ) {
        errors.push({
          field,
          message: `${field} is required`,
          code: "REQUIRED_FIELD",
          value: data[field],
        });
      }
    });

    return errors;
  }

  /**
   * Validate string length
   */
  protected validateStringLength(
    value: string,
    field: string,
    min?: number,
    max?: number
  ): ValidationError[] {
    const errors: ValidationError[] = [];

    if (min !== undefined && value.length < min) {
      errors.push({
        field,
        message: `${field} must be at least ${min} characters`,
        code: "MIN_LENGTH",
        value,
      });
    }

    if (max !== undefined && value.length > max) {
      errors.push({
        field,
        message: `${field} must be no more than ${max} characters`,
        code: "MAX_LENGTH",
        value,
      });
    }

    return errors;
  }

  /**
   * Validate number range
   */
  protected validateNumberRange(
    value: number,
    field: string,
    min?: number,
    max?: number
  ): ValidationError[] {
    const errors: ValidationError[] = [];

    if (min !== undefined && value < min) {
      errors.push({
        field,
        message: `${field} must be at least ${min}`,
        code: "MIN_VALUE",
        value,
      });
    }

    if (max !== undefined && value > max) {
      errors.push({
        field,
        message: `${field} must be no more than ${max}`,
        code: "MAX_VALUE",
        value,
      });
    }

    return errors;
  }

  /**
   * Validate enum value
   */
  protected validateEnum(
    value: any,
    field: string,
    enumValues: any[]
  ): ValidationError[] {
    const errors: ValidationError[] = [];

    if (!enumValues.includes(value)) {
      errors.push({
        field,
        message: `${field} must be one of: ${enumValues.join(", ")}`,
        code: "INVALID_ENUM",
        value,
      });
    }

    return errors;
  }
}

/**
 * Soul Chip DTO Factory
 */
export class SoulChipDTOFactory extends BaseDTOFactory<SoulChipDTO> {
  public createDefault(overrides?: Partial<SoulChipDTO>): SoulChipDTO {
    const defaults: SoulChipDTO = {
      id: this.generateId(),
      userId: "",
      name: "Default Soul Chip",
      personality: "balanced",
      rarity: RarityDTO.COMMON,
      baseStats: {
        intelligence: 50,
        resilience: 50,
        adaptability: 50,
      },
      specialTrait: "versatile",
      experiences: [],
      learningRate: 0.5,
      version: 1,
      createdAt: this.getCurrentTimestamp(),
      updatedAt: this.getCurrentTimestamp(),
    };

    return this.mergeDefaults(defaults, overrides);
  }

  public createFromData(data: any): SoulChipDTO {
    return {
      id: data.id || this.generateId(),
      userId: data.userId || "",
      name: data.name || "Unnamed Soul Chip",
      personality: data.personality || "balanced",
      rarity: data.rarity || RarityDTO.COMMON,
      baseStats: {
        intelligence: data.baseStats?.intelligence || 50,
        resilience: data.baseStats?.resilience || 50,
        adaptability: data.baseStats?.adaptability || 50,
      },
      specialTrait: data.specialTrait || "versatile",
      experiences: data.experiences || [],
      learningRate: data.learningRate || 0.5,
      version: data.version || 1,
      description: data.description,
      source: data.source,
      tags: data.tags,
      metadata: data.metadata,
      createdAt: data.createdAt || this.getCurrentTimestamp(),
      updatedAt: data.updatedAt || this.getCurrentTimestamp(),
    };
  }

  public validate(dto: SoulChipDTO): ValidationResult {
    const errors: ValidationError[] = [];

    // Required fields
    errors.push(
      ...this.validateRequired(dto, [
        "id",
        "userId",
        "name",
        "personality",
        "rarity",
      ])
    );

    // String validations
    if (dto.name) {
      errors.push(...this.validateStringLength(dto.name, "name", 1, 100));
    }

    if (dto.personality) {
      errors.push(
        ...this.validateStringLength(dto.personality, "personality", 1, 200)
      );
    }

    // Enum validations
    errors.push(
      ...this.validateEnum(dto.rarity, "rarity", Object.values(RarityDTO))
    );

    // Base stats validation
    if (dto.baseStats) {
      errors.push(
        ...this.validateNumberRange(
          dto.baseStats.intelligence,
          "baseStats.intelligence",
          0,
          100
        )
      );
      errors.push(
        ...this.validateNumberRange(
          dto.baseStats.resilience,
          "baseStats.resilience",
          0,
          100
        )
      );
      errors.push(
        ...this.validateNumberRange(
          dto.baseStats.adaptability,
          "baseStats.adaptability",
          0,
          100
        )
      );
    }

    // Learning rate validation
    errors.push(
      ...this.validateNumberRange(dto.learningRate, "learningRate", 0, 1)
    );

    return { isValid: errors.length === 0, errors };
  }
}

/**
 * Skeleton DTO Factory
 */
export class SkeletonDTOFactory extends BaseDTOFactory<SkeletonDTO> {
  public createDefault(overrides?: Partial<SkeletonDTO>): SkeletonDTO {
    const defaults: SkeletonDTO = {
      id: this.generateId(),
      userId: "",
      name: "Basic Skeleton",
      type: SkeletonTypeDTO.BALANCED,
      rarity: RarityDTO.COMMON,
      slots: 4,
      baseDurability: 100,
      mobilityType: MobilityTypeDTO.BIPEDAL,
      specialAbilities: [],
      upgradeLevel: 0,
      currentDurability: 100,
      maxDurability: 100,
      version: 1,
      createdAt: this.getCurrentTimestamp(),
      updatedAt: this.getCurrentTimestamp(),
    };

    return this.mergeDefaults(defaults, overrides);
  }

  public createFromData(data: any): SkeletonDTO {
    return {
      id: data.id || this.generateId(),
      userId: data.userId || "",
      name: data.name || "Unnamed Skeleton",
      type: data.type || SkeletonTypeDTO.BALANCED,
      rarity: data.rarity || RarityDTO.COMMON,
      slots: data.slots || 4,
      baseDurability: data.baseDurability || 100,
      mobilityType: data.mobilityType || MobilityTypeDTO.BIPEDAL,
      specialAbilities: data.specialAbilities || [],
      upgradeLevel: data.upgradeLevel || 0,
      currentDurability: data.currentDurability || 100,
      maxDurability: data.maxDurability || 100,
      version: data.version || 1,
      description: data.description,
      source: data.source,
      tags: data.tags,
      metadata: data.metadata,
      createdAt: data.createdAt || this.getCurrentTimestamp(),
      updatedAt: data.updatedAt || this.getCurrentTimestamp(),
    };
  }

  public validate(dto: SkeletonDTO): ValidationResult {
    const errors: ValidationError[] = [];

    // Required fields
    errors.push(
      ...this.validateRequired(dto, ["id", "userId", "name", "type", "rarity"])
    );

    // String validations
    if (dto.name) {
      errors.push(...this.validateStringLength(dto.name, "name", 1, 100));
    }

    // Enum validations
    errors.push(
      ...this.validateEnum(dto.type, "type", Object.values(SkeletonTypeDTO))
    );
    errors.push(
      ...this.validateEnum(dto.rarity, "rarity", Object.values(RarityDTO))
    );
    errors.push(
      ...this.validateEnum(
        dto.mobilityType,
        "mobilityType",
        Object.values(MobilityTypeDTO)
      )
    );

    // Number validations
    errors.push(...this.validateNumberRange(dto.slots, "slots", 1, 20));
    errors.push(
      ...this.validateNumberRange(dto.baseDurability, "baseDurability", 1)
    );
    errors.push(
      ...this.validateNumberRange(dto.upgradeLevel, "upgradeLevel", 0, 25)
    );
    errors.push(
      ...this.validateNumberRange(
        dto.currentDurability,
        "currentDurability",
        0,
        dto.maxDurability
      )
    );

    return { isValid: errors.length === 0, errors };
  }
}

/**
 * Part DTO Factory
 */
export class PartDTOFactory extends BaseDTOFactory<PartDTO> {
  public createDefault(overrides?: Partial<PartDTO>): PartDTO {
    const defaults: PartDTO = {
      id: this.generateId(),
      userId: "",
      name: "Basic Part",
      category: PartCategoryDTO.ARM,
      rarity: RarityDTO.COMMON,
      stats: {
        attack: 10,
        defense: 10,
        speed: 10,
        perception: 10,
        energyConsumption: 5,
      },
      abilities: [],
      upgradeLevel: 0,
      currentDurability: 100,
      maxDurability: 100,
      version: 1,
      createdAt: this.getCurrentTimestamp(),
      updatedAt: this.getCurrentTimestamp(),
    };

    return this.mergeDefaults(defaults, overrides);
  }

  public createFromData(data: any): PartDTO {
    return {
      id: data.id || this.generateId(),
      userId: data.userId || "",
      name: data.name || "Unnamed Part",
      category: data.category || PartCategoryDTO.ARM,
      rarity: data.rarity || RarityDTO.COMMON,
      stats: {
        attack: data.stats?.attack || 10,
        defense: data.stats?.defense || 10,
        speed: data.stats?.speed || 10,
        perception: data.stats?.perception || 10,
        energyConsumption: data.stats?.energyConsumption || 5,
      },
      abilities: data.abilities || [],
      upgradeLevel: data.upgradeLevel || 0,
      currentDurability: data.currentDurability || 100,
      maxDurability: data.maxDurability || 100,
      version: data.version || 1,
      description: data.description,
      source: data.source,
      tags: data.tags,
      metadata: data.metadata,
      createdAt: data.createdAt || this.getCurrentTimestamp(),
      updatedAt: data.updatedAt || this.getCurrentTimestamp(),
    };
  }

  public validate(dto: PartDTO): ValidationResult {
    const errors: ValidationError[] = [];

    // Required fields
    errors.push(
      ...this.validateRequired(dto, [
        "id",
        "userId",
        "name",
        "category",
        "rarity",
        "stats",
      ])
    );

    // String validations
    if (dto.name) {
      errors.push(...this.validateStringLength(dto.name, "name", 1, 100));
    }

    // Enum validations
    errors.push(
      ...this.validateEnum(
        dto.category,
        "category",
        Object.values(PartCategoryDTO)
      )
    );
    errors.push(
      ...this.validateEnum(dto.rarity, "rarity", Object.values(RarityDTO))
    );

    // Stats validation
    if (dto.stats) {
      errors.push(
        ...this.validateNumberRange(dto.stats.attack, "stats.attack", 0)
      );
      errors.push(
        ...this.validateNumberRange(dto.stats.defense, "stats.defense", 0)
      );
      errors.push(
        ...this.validateNumberRange(dto.stats.speed, "stats.speed", 0)
      );
      errors.push(
        ...this.validateNumberRange(dto.stats.perception, "stats.perception", 0)
      );
      errors.push(
        ...this.validateNumberRange(
          dto.stats.energyConsumption,
          "stats.energyConsumption",
          0
        )
      );
    }

    // Other validations
    errors.push(
      ...this.validateNumberRange(dto.upgradeLevel, "upgradeLevel", 0, 25)
    );
    errors.push(
      ...this.validateNumberRange(
        dto.currentDurability,
        "currentDurability",
        0,
        dto.maxDurability
      )
    );

    return { isValid: errors.length === 0, errors };
  }
}

/**
 * Bot DTO Factory
 */
export class BotDTOFactory extends BaseDTOFactory<BotDTO> {
  public createDefault(overrides?: Partial<BotDTO>): BotDTO {
    const defaults: BotDTO = {
      id: this.generateId(),
      name: "Default Bot",
      botType: "WORKER" as any, // Default bot type
      userId: "",
      soulChipId: "",
      skeletonId: "",
      partIds: [],
      expansionChipIds: [],
      stateId: "",
      assemblyVersion: 1,
      assemblyDate: this.getCurrentTimestamp(),
      lastModified: this.getCurrentTimestamp(),
      version: 1,
      createdAt: this.getCurrentTimestamp(),
      updatedAt: this.getCurrentTimestamp(),
    };

    return this.mergeDefaults(defaults, overrides);
  }

  public createFromData(data: any): BotDTO {
    return {
      id: data.id || this.generateId(),
      name: data.name || "Unnamed Bot",
      botType: data.botType || "WORKER",
      userId: data.userId || "",
      soulChipId: data.soulChipId || "",
      skeletonId: data.skeletonId || "",
      partIds: data.partIds || [],
      expansionChipIds: data.expansionChipIds || [],
      stateId: data.stateId || "",
      assemblyVersion: data.assemblyVersion || 1,
      assemblyDate: data.assemblyDate || this.getCurrentTimestamp(),
      lastModified: data.lastModified || this.getCurrentTimestamp(),
      soulChip: data.soulChip,
      skeleton: data.skeleton,
      parts: data.parts,
      expansionChips: data.expansionChips,
      state: data.state,
      totalStats: data.totalStats,
      overallRating: data.overallRating,
      buildType: data.buildType,
      version: data.version || 1,
      description: data.description,
      source: data.source,
      tags: data.tags,
      metadata: data.metadata,
      createdAt: data.createdAt || this.getCurrentTimestamp(),
      updatedAt: data.updatedAt || this.getCurrentTimestamp(),
    };
  }

  public validate(dto: BotDTO): ValidationResult {
    const errors: ValidationError[] = [];

    // Required fields
    errors.push(
      ...this.validateRequired(dto, [
        "id",
        "userId",
        "name",
        "soulChipId",
        "skeletonId",
        "stateId",
      ])
    );

    // String validations
    if (dto.name) {
      errors.push(...this.validateStringLength(dto.name, "name", 1, 100));
    }

    // Array validations
    if (dto.partIds && dto.partIds.length > 20) {
      errors.push({
        field: "partIds",
        message: "Bot cannot have more than 20 parts",
        code: "MAX_PARTS",
        value: dto.partIds.length,
      });
    }

    if (dto.expansionChipIds && dto.expansionChipIds.length > 10) {
      errors.push({
        field: "expansionChipIds",
        message: "Bot cannot have more than 10 expansion chips",
        code: "MAX_CHIPS",
        value: dto.expansionChipIds.length,
      });
    }

    return { isValid: errors.length === 0, errors };
  }
}

/**
 * DTO Factory registry
 */
export class DTOFactoryRegistry {
  private static factories = new Map<string, BaseDTOFactory<any>>();

  public static register<T>(key: string, factory: BaseDTOFactory<T>): void {
    this.factories.set(key, factory);
  }

  public static get<T>(key: string): BaseDTOFactory<T> | undefined {
    return this.factories.get(key);
  }

  public static initialize(): void {
    this.register("soulChip", new SoulChipDTOFactory());
    this.register("skeleton", new SkeletonDTOFactory());
    this.register("part", new PartDTOFactory());
    this.register("bot", new BotDTOFactory());
  }
}
