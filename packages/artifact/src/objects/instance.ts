import { instance_state } from "@botking/db";

export class Instance {
  public id: string;
  public shardId: number;
  public playerId: bigint;
  public templateId: string;
  public state: instance_state;
  public boundToPlayer: string;
  public createdAt: Date;
  public updatedAt: Date;

  constructor(props: {
    id?: string;
    shardId: number;
    playerId: bigint;
    templateId: string;
    state: instance_state;
    boundToPlayer: string;
    createdAt: Date;
    updatedAt: Date;
  }) {
    this.id = props.id ?? "";
    this.shardId = props.shardId;
    this.playerId = props.playerId;
    this.templateId = props.templateId;
    this.state = props.state;
    this.boundToPlayer = props.boundToPlayer;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }
}
