export class InventoryStack {
  public id: string;
  public shardId: number;
  public playerId: bigint;
  public templateId: string;
  public quantity: bigint;
  public createdAt: Date;
  public updatedAt: Date;

  constructor(props: {
    id?: string;
    shardId: number;
    playerId: bigint;
    templateId: string;
    quantity: bigint;
    createdAt: Date;
    updatedAt: Date;
  }) {
    this.id = props.id ?? "";
    this.shardId = props.shardId;
    this.playerId = props.playerId;
    this.templateId = props.templateId;
    this.quantity = props.quantity;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }
}
