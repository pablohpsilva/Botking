export class Robot {
  public id: string;
  public shardId: number;
  public playerId: bigint;
  public nickname: string;
  public createdAt: Date;
  public updatedAt: Date;

  constructor(props: {
    id: string;
    shardId: number;
    playerId: bigint;
    nickname: string;
    createdAt: Date;
    updatedAt: Date;
  }) {
    this.id = props.id ?? "";
    this.shardId = props.shardId;
    this.playerId = props.playerId;
    this.nickname = props.nickname;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }
}
