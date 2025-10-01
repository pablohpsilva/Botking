import { ItemTemplateAsset, Template, Asset } from "@botking/artifact";
import { validateData, ItemTemplateAssetSchema } from "@botking/validator";
import { connectionManager } from "@botking/db";
import { TemplateDto } from "./template";
import { AssetDto } from "./asset";

// Define loading options type
type ItemTemplateAssetLoadOptions = {
  includeTemplate?: boolean;
  includeAsset?: boolean;
};

export class ItemTemplateAssetDto {
  public itemTemplateAsset?: ItemTemplateAsset;
  public template?: TemplateDto;
  public asset?: AssetDto;

  constructor(props?: {
    id: string;
    itemTplId: string;
    assetId: string;
    primary: boolean;
    createdAt: Date;
    updatedAt: Date;
  }) {
    if (props) {
      this.itemTemplateAsset = new ItemTemplateAsset(props);
    }
  }

  /**
   * Find item template asset by ID with optional relationship loading
   * @param id Item Template Asset ID
   * @param options Loading options for relationships
   */
  public async findById(
    id: string,
    options: ItemTemplateAssetLoadOptions = {}
  ): Promise<ItemTemplateAssetDto> {
    // Build include object dynamically
    const include: any = {};

    if (options.includeTemplate) {
      include.template = true;
    }

    if (options.includeAsset) {
      include.asset = {
        include: {
          pack: true, // Always include pack when loading asset
        },
      };
    }

    const dbResult = await connectionManager
      .getClient()
      .item_template_asset.findUnique({
        where: { id },
        include: Object.keys(include).length > 0 ? include : undefined,
      });

    if (dbResult) {
      // Populate main item template asset
      this.itemTemplateAsset = new ItemTemplateAsset({
        id: dbResult.id,
        itemTplId: dbResult.itemTplId,
        assetId: dbResult.assetId,
        primary: dbResult.primary,
        createdAt: dbResult.createdAt,
        updatedAt: dbResult.updatedAt,
      });

      // Populate relationships if included
      if (options.includeTemplate && dbResult.template) {
        this.template = new TemplateDto();
        this.template.template = dbResult.template as Template;
      }

      if (options.includeAsset && dbResult.asset) {
        this.asset = new AssetDto();
        this.asset.asset = dbResult.asset as Asset;
        // Also populate the pack if it was included
        if ((dbResult.asset as any).pack) {
          const AssetPackDto = (await import("./asset-pack")).AssetPackDto;
          const packData = (dbResult.asset as any).pack;
          this.asset.pack = new AssetPackDto({
            id: packData.id,
            name: packData.name,
            version: packData.version,
            createdAt: packData.createdAt,
            updatedAt: packData.updatedAt,
          });
        }
      }
    }
    return this;
  }

  /**
   * Convenience methods for common use cases
   */
  public async findByIdBasic(id: string): Promise<ItemTemplateAssetDto> {
    return this.findById(id, {});
  }

  public async findByIdWithTemplate(id: string): Promise<ItemTemplateAssetDto> {
    return this.findById(id, { includeTemplate: true });
  }

  public async findByIdWithAsset(id: string): Promise<ItemTemplateAssetDto> {
    return this.findById(id, { includeAsset: true });
  }

  public async findByIdComplete(id: string): Promise<ItemTemplateAssetDto> {
    return this.findById(id, {
      includeTemplate: true,
      includeAsset: true,
    });
  }

  /**
   * Lazy loading methods for optional relationships
   */
  public async loadTemplate(): Promise<void> {
    if (!this.itemTemplateAsset?.itemTplId || this.template) return;

    this.template = await new TemplateDto().findById(
      this.itemTemplateAsset.itemTplId
    );
  }

  public async loadAsset(): Promise<void> {
    if (!this.itemTemplateAsset?.assetId || this.asset) return;

    this.asset = await new AssetDto().findByIdWithPack(
      this.itemTemplateAsset.assetId
    );
  }

  /**
   * Static method for batch loading with relationships
   */
  public static async findManyWithOptions(
    where: any,
    options: ItemTemplateAssetLoadOptions = {},
    pagination?: { skip?: number; take?: number }
  ): Promise<ItemTemplateAssetDto[]> {
    const include: any = {};

    if (options.includeTemplate) include.template = true;
    if (options.includeAsset) include.asset = { include: { pack: true } };

    const dbResults = await connectionManager
      .getClient()
      .item_template_asset.findMany({
        where,
        include: Object.keys(include).length > 0 ? include : undefined,
        skip: pagination?.skip,
        take: pagination?.take,
      });

    return dbResults.map((dbResult) => {
      const dto = new ItemTemplateAssetDto();

      dto.itemTemplateAsset = new ItemTemplateAsset({
        id: dbResult.id,
        itemTplId: dbResult.itemTplId,
        assetId: dbResult.assetId,
        primary: dbResult.primary,
        createdAt: dbResult.createdAt,
        updatedAt: dbResult.updatedAt,
      });

      // Populate relationships
      if (options.includeTemplate && dbResult.template) {
        dto.template = new TemplateDto();
        dto.template.template = dbResult.template as Template;
      }
      if (options.includeAsset && dbResult.asset) {
        dto.asset = new AssetDto();
        dto.asset.asset = dbResult.asset as Asset;
        if ((dbResult.asset as any).pack) {
          const { AssetPackDto } = require("./asset-pack");
          if (dto.asset) {
            const packData = (dbResult.asset as any).pack;
            dto.asset.pack = new AssetPackDto({
              id: packData.id,
              name: packData.name,
              version: packData.version,
              createdAt: packData.createdAt,
              updatedAt: packData.updatedAt,
            });
          }
        }
      }

      return dto;
    });
  }

  public validate(): ItemTemplateAssetDto {
    const result = validateData(
      ItemTemplateAssetSchema,
      this.itemTemplateAsset
    );

    if (!result.success) {
      throw new Error(result.error);
    }

    return this;
  }

  public async upsert(): Promise<ItemTemplateAssetDto> {
    this.validate();

    if (!this.itemTemplateAsset) {
      throw new Error("Item template asset is not allowed to be set");
    }

    await connectionManager.getClient().item_template_asset.upsert({
      where: { id: this.itemTemplateAsset.id },
      update: this.itemTemplateAsset,
      create: this.itemTemplateAsset,
    });

    return this;
  }
}
