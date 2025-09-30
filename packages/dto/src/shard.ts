import { Shard } from "@botking/artifact";
import { validateData, ShardSchema } from "@botking/validator";
import { connectionManager } from "@botking/db";

export class ShardDto {
  public shard?: Shard;

  constructor(props?: { shardId: number; createdAt: Date; updatedAt: Date }) {
    if (props) {
      this.shard = new Shard(props);
    }
  }

  public async findById(id: number): Promise<ShardDto> {
    this.shard = (await connectionManager.getClient().shard.findUnique({
      where: { shardId: id },
    })) as Shard;
    return this;
  }

  public validate(): ShardDto {
    const result = validateData(ShardSchema, this.shard);

    if (!result.success) {
      throw new Error(result.error);
    }

    return this;
  }

  public async upsert(): Promise<ShardDto> {
    this.validate();

    if (!this.shard) {
      throw new Error("Shard pack is not allowed to be set");
    }

    await connectionManager.getClient().shard.upsert({
      where: { shardId: this.shard.shardId },
      update: this.shard,
      create: this.shard,
    });

    return this;
  }
}
