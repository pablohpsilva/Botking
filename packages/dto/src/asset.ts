import { Asset, AssetPack } from "@botking/artifact";
import { validateData, AssetSchema } from "@botking/validator";
import { asset_kind, connectionManager } from "@botking/db";
import { AssetPackDto } from "./asset-pack";

type AssetWithPack = Asset & { pack?: AssetPackDto };
type AssetWithPackRaw = Asset & { pack: AssetPack };

export class AssetDto {
  public asset?: AssetWithPack;

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

  public async findById(id: string): Promise<AssetDto> {
    const asset = (await connectionManager.getClient().asset.findUnique({
      where: { id },
      include: { pack: true },
    })) as AssetWithPackRaw;

    const pack = await new AssetPackDto().findById(asset.packId);

    this.asset = {
      ...asset,
      pack,
    };

    return this;
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

    const { pack, ...asset } = this.asset;
    await connectionManager.getClient().asset.upsert({
      where: { id: asset.id },
      update: asset,
      create: asset,
    });

    return this;
  }
}
