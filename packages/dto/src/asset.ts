import { Asset, AssetPack } from "@botking/artifact";
import { validateData, AssetSchema } from "@botking/validator";
import { asset_kind, connectionManager } from "@botking/db";
import { AssetPackDto } from "./asset-pack";

// Define loading options type
type AssetLoadOptions = {
  includePack?: boolean;
};

export class AssetDto {
  public asset?: Asset;
  public pack?: AssetPackDto;

  constructor(props?: {
    id?: string;
    pack?: AssetPack;
    packId: string;
    kind: asset_kind;
    url: string;
    width: number;
    height: number;
    variant: string;
    meta: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
  }) {
    if (props) {
      this.asset = new Asset(props);
    }
  }

  /**
   * Find asset by ID with optional relationship loading
   * @param id Asset ID
   * @param options Loading options for relationships
   */
  public async findById(
    id: string,
    options: AssetLoadOptions = { includePack: true }
  ): Promise<AssetDto> {
    // Build include object dynamically
    const include: any = {};

    if (options.includePack) {
      include.pack = true;
    }

    const dbResult = await connectionManager.getClient().asset.findUnique({
      where: { id },
      include: Object.keys(include).length > 0 ? include : undefined,
    });

    if (dbResult) {
      // Populate main asset
      this.asset = new Asset({
        id: dbResult.id,
        packId: dbResult.packId,
        kind: dbResult.kind,
        url: dbResult.url,
        width: dbResult.width || 0,
        height: dbResult.height || 0,
        variant: dbResult.variant || "",
        meta: dbResult.meta as Record<string, any>,
        createdAt: dbResult.createdAt,
        updatedAt: dbResult.updatedAt,
      });

      // Populate pack if included
      if (options.includePack && dbResult.pack) {
        const packData = dbResult.pack as any;
        this.pack = new AssetPackDto({
          id: packData.id,
          name: packData.name,
          version: packData.version,
          createdAt: packData.createdAt,
          updatedAt: packData.updatedAt,
        });
      }
    }

    return this;
  }

  /**
   * Convenience methods for common use cases
   */
  public async findByIdBasic(id: string): Promise<AssetDto> {
    return this.findById(id, { includePack: false });
  }

  public async findByIdWithPack(id: string): Promise<AssetDto> {
    return this.findById(id, { includePack: true });
  }

  /**
   * Lazy loading method for pack relationship
   */
  public async loadPack(): Promise<AssetDto> {
    if (!this.asset?.packId || this.pack) {
      return this;
    }

    this.pack = await new AssetPackDto().findById(this.asset.packId);

    return this;
  }

  /**
   * Static method for batch loading with relationships
   */
  public static async findManyWithOptions(
    where: any,
    options: AssetLoadOptions = { includePack: true },
    pagination?: { skip?: number; take?: number }
  ): Promise<AssetDto[]> {
    const include: any = {};

    if (options.includePack) include.pack = true;

    const dbResults = await connectionManager.getClient().asset.findMany({
      where,
      include: Object.keys(include).length > 0 ? include : undefined,
      skip: pagination?.skip,
      take: pagination?.take,
    });

    return dbResults.map((dbResult) => {
      const dto = new AssetDto();

      dto.asset = new Asset({
        id: dbResult.id,
        packId: dbResult.packId,
        kind: dbResult.kind,
        url: dbResult.url,
        width: dbResult.width || 0,
        height: dbResult.height || 0,
        variant: dbResult.variant || "",
        meta: dbResult.meta as Record<string, any>,
        createdAt: dbResult.createdAt,
        updatedAt: dbResult.updatedAt,
      });

      // Populate pack if included
      if (options.includePack && dbResult.pack) {
        const packData = dbResult.pack as any;
        dto.pack = new AssetPackDto({
          id: packData.id,
          name: packData.name,
          version: packData.version,
          createdAt: packData.createdAt,
          updatedAt: packData.updatedAt,
        });
      }

      return dto;
    });
  }

  public validate(): AssetDto {
    const result = validateData(AssetSchema, this.asset);

    if (!result.success) {
      throw new Error(result.error);
    }

    return this;
  }

  public async upsert(): Promise<AssetDto> {
    this.validate();

    if (!this.asset) {
      throw new Error("Pack is not allowed to be set");
    }

    await connectionManager.getClient().asset.upsert({
      where: { id: this.asset.id },
      update: this.asset,
      create: this.asset,
    });

    return this;
  }
}
