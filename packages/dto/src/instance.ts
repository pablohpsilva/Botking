import { Instance, Template, PlayerAccount } from "@botking/artifact";
import { validateData, InstanceSchema } from "@botking/validator";
import { connectionManager, instance_state } from "@botking/db";
import { TemplateDto } from "./template";
import { PlayerAccountDto } from "./player-account";

// Define loading options type
type InstanceLoadOptions = {
  includeTemplate?: boolean;
  includeAccount?: boolean;
  includeSlots?: boolean;
};

export class InstanceDto {
  public instance?: Instance;
  public template?: TemplateDto;
  public account?: PlayerAccountDto;
  public slots?: {
    soulChip?: any;
    skeleton?: any;
    parts?: any[];
    expansions?: any[];
  };

  constructor(props?: {
    id?: string;
    shardId: number;
    playerId: bigint;
    templateId: string;
    state: instance_state;
    boundToPlayer: string;
    createdAt: Date;
    updatedAt: Date;
  }) {
    if (props) {
      this.instance = new Instance(props);
    }
  }

  /**
   * Find instance by ID with optional relationship loading
   * @param id Instance ID
   * @param options Loading options for relationships
   */
  public async findById(
    id: string,
    options: InstanceLoadOptions = {}
  ): Promise<InstanceDto> {
    // Build include object dynamically
    const include: any = {};

    if (options.includeTemplate) {
      include.template = true;
    }

    if (options.includeAccount) {
      include.account = {
        include: {
          shard: true, // Always include shard when loading account
        },
      };
    }

    if (options.includeSlots) {
      include.soul_chip_slot = true;
      include.skeleton_slot = true;
      include.part_slot = true;
      include.expansion_slot = true;
    }

    const dbResult = await connectionManager.getClient().instance.findUnique({
      where: { id },
      include: Object.keys(include).length > 0 ? include : undefined,
    });

    if (dbResult) {
      // Populate main instance
      this.instance = new Instance({
        id: dbResult.id,
        shardId: dbResult.shardId,
        playerId: BigInt(dbResult.playerId),
        templateId: dbResult.templateId,
        state: dbResult.state,
        boundToPlayer: dbResult.boundToPlayer || "",
        createdAt: dbResult.createdAt,
        updatedAt: dbResult.updatedAt,
      });

      // Populate relationships if included
      if (options.includeTemplate && dbResult.template) {
        this.template = new TemplateDto();
        this.template.template = dbResult.template as any;
      }

      if (options.includeAccount && dbResult.account) {
        this.account = new PlayerAccountDto();
        this.account.playerAccount = dbResult.account as any;
      }

      if (options.includeSlots) {
        this.slots = {
          soulChip: dbResult.soul_chip_slot,
          skeleton: dbResult.skeleton_slot,
          parts: dbResult.part_slot,
          expansions: dbResult.expansion_slot,
        };
      }
    }

    return this;
  }

  /**
   * Convenience methods for common use cases
   */
  public async findByIdBasic(id: string): Promise<InstanceDto> {
    return this.findById(id, {});
  }

  public async findByIdWithTemplate(id: string): Promise<InstanceDto> {
    return this.findById(id, { includeTemplate: true });
  }

  public async findByIdForInventory(id: string): Promise<InstanceDto> {
    return this.findById(id, {
      includeTemplate: true,
      includeAccount: true,
    });
  }

  public async findByIdForRobot(id: string): Promise<InstanceDto> {
    return this.findById(id, {
      includeTemplate: true,
      includeSlots: true,
    });
  }

  public async findByIdComplete(id: string): Promise<InstanceDto> {
    return this.findById(id, {
      includeTemplate: true,
      includeAccount: true,
      includeSlots: true,
    });
  }

  /**
   * Lazy loading methods for optional relationships
   */
  public async loadTemplate(): Promise<void> {
    if (!this.instance?.templateId || this.template) return;

    this.template = await new TemplateDto().findById(this.instance.templateId);
  }

  public async loadAccount(): Promise<void> {
    if (!this.instance || this.account) return;

    const account = await connectionManager
      .getClient()
      .player_account.findUnique({
        where: {
          globalPlayerId: this.instance.playerId.toString(),
        },
        include: { shard: true },
      });

    if (account) {
      this.account = new PlayerAccountDto();
      this.account.playerAccount = account as PlayerAccount;
    }
  }

  public async loadSlots(): Promise<void> {
    if (!this.instance?.id || this.slots) return;

    const [soulChip, skeleton, parts, expansions] = await Promise.all([
      connectionManager.getClient().soul_chip_slot.findUnique({
        where: { itemInstId: this.instance.id },
      }),
      connectionManager.getClient().skeleton_slot.findUnique({
        where: { itemInstId: this.instance.id },
      }),
      connectionManager.getClient().part_slots.findMany({
        where: { itemInstId: this.instance.id },
      }),
      connectionManager.getClient().expansion_slot.findMany({
        where: { itemInstId: this.instance.id },
      }),
    ]);

    this.slots = {
      soulChip,
      skeleton,
      parts,
      expansions,
    };
  }

  /**
   * Static method for batch loading with relationships
   */
  public static async findManyWithOptions(
    where: any,
    options: InstanceLoadOptions = {},
    pagination?: { skip?: number; take?: number }
  ): Promise<InstanceDto[]> {
    const include: any = {};

    if (options.includeTemplate) include.template = true;
    if (options.includeAccount) include.account = { include: { shard: true } };
    if (options.includeSlots) {
      include.soul_chip_slot = true;
      include.skeleton_slot = true;
      include.part_slot = true;
      include.expansion_slot = true;
    }

    const dbResults = await connectionManager.getClient().instance.findMany({
      where,
      include: Object.keys(include).length > 0 ? include : undefined,
      skip: pagination?.skip,
      take: pagination?.take,
    });

    return dbResults.map((dbResult) => {
      const dto = new InstanceDto();

      dto.instance = new Instance({
        id: dbResult.id,
        shardId: dbResult.shardId,
        playerId: BigInt(dbResult.playerId),
        templateId: dbResult.templateId,
        state: dbResult.state,
        boundToPlayer: dbResult.boundToPlayer || "",
        createdAt: dbResult.createdAt,
        updatedAt: dbResult.updatedAt,
      });

      // Populate relationships
      if (options.includeTemplate && dbResult.template) {
        dto.template = new TemplateDto();
        dto.template.template = dbResult.template as any;
      }
      if (options.includeAccount && dbResult.account) {
        dto.account = new PlayerAccountDto();
        dto.account.playerAccount = dbResult.account as any;
      }
      if (options.includeSlots) {
        dto.slots = {
          soulChip: dbResult.soul_chip_slot,
          skeleton: dbResult.skeleton_slot,
          parts: dbResult.part_slot,
          expansions: dbResult.expansion_slot,
        };
      }

      return dto;
    });
  }

  public validate(): InstanceDto {
    const result = validateData(InstanceSchema, this.instance);

    if (!result.success) {
      throw new Error(result.error);
    }

    return this;
  }

  public async upsert(): Promise<InstanceDto> {
    this.validate();

    if (!this.instance) {
      throw new Error("Instance is not allowed to be set");
    }

    const dbData = {
      id: this.instance.id,
      shardId: this.instance.shardId,
      playerId: this.instance.playerId.toString(),
      templateId: this.instance.templateId,
      state: this.instance.state,
      boundToPlayer: this.instance.boundToPlayer,
      createdAt: this.instance.createdAt,
      updatedAt: this.instance.updatedAt,
    };

    await connectionManager.getClient().instance.upsert({
      where: { id: this.instance.id },
      update: dbData,
      create: dbData,
    });

    return this;
  }
}
