export class PlayerAccount {
  public shardId: number;
  public playerId: bigint;
  public globalPlayerId: string;
  public createdAt: Date;
  public updatedAt: Date;

  constructor(props: {
    shardId: number;
    playerId: bigint;
    globalPlayerId: string;
    createdAt: Date;
    updatedAt: Date;
  }) {
    this.shardId = props.shardId;
    this.playerId = props.playerId;
    this.globalPlayerId = props.globalPlayerId;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }
}
