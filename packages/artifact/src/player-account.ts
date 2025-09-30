export class PlayerAccount {
  public shardId: number;
  public id: string;
  public globalPlayerId: string;
  public createdAt: Date;
  public updatedAt: Date;

  constructor(props: {
    id: string;
    shardId: number;
    globalPlayerId: string;
    createdAt: Date;
    updatedAt: Date;
  }) {
    this.id = props.id;
    this.shardId = props.shardId;
    this.globalPlayerId = props.globalPlayerId;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }
}
