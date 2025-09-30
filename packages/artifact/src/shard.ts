export class Shard {
  public shardId: number;
  public createdAt: Date;
  public updatedAt: Date;

  constructor(props: { shardId: number; createdAt: Date; updatedAt: Date }) {
    this.shardId = props.shardId ?? 0;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }
}
