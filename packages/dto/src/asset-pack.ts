import { AssetPack } from "@botking/artifact";
import { validateData, AssetPackSchema } from "@botking/validator";
import { connectionManager } from "@botking/db";

export class AssetPackDto {
  public assetPack?: AssetPack;

  constructor(props?: {
    id?: string;
    name: string;
    version: string;
    createdAt: Date;
    updatedAt: Date;
  }) {
    if (props) {
      this.assetPack = new AssetPack(props);
    }
  }

  public async findById(id: string): Promise<AssetPackDto> {
    this.assetPack = (await connectionManager
      .getClient()
      .asset_pack.findUnique({
        where: { id },
      })) as AssetPack;
    return this;
  }

  public validate(): AssetPackDto {
    const result = validateData(AssetPackSchema, this.assetPack);

    if (!result.success) {
      throw new Error(result.error);
    }

    return this;
  }

  public async upsert(): Promise<AssetPackDto> {
    this.validate();

    if (!this.assetPack) {
      throw new Error("Asset pack is not allowed to be set");
    }

    await connectionManager.getClient().asset_pack.upsert({
      where: { id: this.assetPack.id },
      update: this.assetPack,
      create: this.assetPack,
    });

    return this;
  }
}
