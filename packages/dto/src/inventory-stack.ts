import { InventoryStack, Template, PlayerAccount } from "@botking/artifact";
import { validateData, InventoryStackSchema } from "@botking/validator";
import { connectionManager } from "@botking/db";
import { TemplateDto } from "./template";
import { PlayerAccountDto } from "./player-account";

// Define loading options type
type InventoryStackLoadOptions = {
  includeTemplate?: boolean;
  includeAccount?: boolean;
};

export class InventoryStackDto {
  public inventoryStack?: InventoryStack;
  public template?: TemplateDto;
  public account?: PlayerAccountDto;

  constructor(props?: {
    id?: string;
    shardId: number;
    playerId: bigint;
    templateId: string;
    quantity: bigint;
    createdAt: Date;
    updatedAt: Date;
  }) {
    if (props) {
      this.inventoryStack = new InventoryStack(props);
    }
  }

  /**
   * Find inventory stack by ID with optional relationship loading
   * @param id Inventory Stack ID
   * @param options Loading options for relationships
   */
  public async findById(
    id: string,
    options: InventoryStackLoadOptions = {}
  ): Promise<InventoryStackDto> {
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

    const dbResult = await connectionManager
      .getClient()
      .inventory_stack.findUnique({
        where: { id },
        include: Object.keys(include).length > 0 ? include : undefined,
      });

    if (dbResult) {
      // Populate main inventory stack
      this.inventoryStack = new InventoryStack({
        id: dbResult.id,
        shardId: dbResult.shardId,
        playerId: BigInt(dbResult.playerId),
        templateId: dbResult.templateId,
        quantity: BigInt(dbResult.quantity),
        createdAt: dbResult.createdAt,
        updatedAt: dbResult.updatedAt,
      });

      // Populate relationships if included
      if (options.includeTemplate && dbResult.template) {
        this.template = new TemplateDto();
        this.template.template = dbResult.template as Template;
      }

      if (options.includeAccount && dbResult.account) {
        this.account = new PlayerAccountDto();
        this.account.playerAccount = dbResult.account as PlayerAccount;
      }
    }
    return this;
  }

  /**
   * Convenience methods for common use cases
   */
  public async findByIdBasic(id: string): Promise<InventoryStackDto> {
    return this.findById(id, {});
  }

  public async findByIdWithTemplate(id: string): Promise<InventoryStackDto> {
    return this.findById(id, { includeTemplate: true });
  }

  public async findByIdForDisplay(id: string): Promise<InventoryStackDto> {
    return this.findById(id, {
      includeTemplate: true,
      includeAccount: true,
    });
  }

  /**
   * Lazy loading methods for optional relationships
   */
  public async loadTemplate(): Promise<void> {
    if (!this.inventoryStack?.templateId || this.template) return;

    this.template = await new TemplateDto().findById(
      this.inventoryStack.templateId
    );
  }

  public async loadAccount(): Promise<void> {
    if (!this.inventoryStack || this.account) return;

    const account = await connectionManager
      .getClient()
      .player_account.findUnique({
        where: {
          globalPlayerId: this.inventoryStack.playerId.toString(),
        },
        include: { shard: true },
      });

    if (account) {
      this.account = new PlayerAccountDto();
      this.account.playerAccount = account as PlayerAccount;
    }
  }

  /**
   * Static method for batch loading with relationships
   */
  public static async findManyWithOptions(
    where: any,
    options: InventoryStackLoadOptions = {},
    pagination?: { skip?: number; take?: number }
  ): Promise<InventoryStackDto[]> {
    const include: any = {};

    if (options.includeTemplate) include.template = true;
    if (options.includeAccount) include.account = { include: { shard: true } };

    const dbResults = await connectionManager
      .getClient()
      .inventory_stack.findMany({
        where,
        include: Object.keys(include).length > 0 ? include : undefined,
        skip: pagination?.skip,
        take: pagination?.take,
      });

    return dbResults.map((dbResult) => {
      const dto = new InventoryStackDto();

      dto.inventoryStack = new InventoryStack({
        id: dbResult.id,
        shardId: dbResult.shardId,
        playerId: BigInt(dbResult.playerId),
        templateId: dbResult.templateId,
        quantity: BigInt(dbResult.quantity),
        createdAt: dbResult.createdAt,
        updatedAt: dbResult.updatedAt,
      });

      // Populate relationships
      if (options.includeTemplate && dbResult.template) {
        dto.template = new TemplateDto();
        dto.template.template = dbResult.template as Template;
      }
      if (options.includeAccount && dbResult.account) {
        dto.account = new PlayerAccountDto();
        dto.account.playerAccount = dbResult.account as PlayerAccount;
      }

      return dto;
    });
  }

  public validate(): InventoryStackDto {
    const result = validateData(InventoryStackSchema, this.inventoryStack);

    if (!result.success) {
      throw new Error(result.error);
    }

    return this;
  }

  public async upsert(): Promise<InventoryStackDto> {
    this.validate();

    if (!this.inventoryStack) {
      throw new Error("Inventory stack is not allowed to be set");
    }

    const dbData = {
      id: this.inventoryStack.id,
      shardId: this.inventoryStack.shardId,
      playerId: this.inventoryStack.playerId.toString(),
      templateId: this.inventoryStack.templateId,
      quantity: this.inventoryStack.quantity,
      createdAt: this.inventoryStack.createdAt,
      updatedAt: this.inventoryStack.updatedAt,
    };

    await connectionManager.getClient().inventory_stack.upsert({
      where: { id: this.inventoryStack.id },
      update: dbData,
      create: dbData,
    });

    return this;
  }
}
