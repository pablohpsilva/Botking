export class IdentityLink {
  public id: string;
  public authUserId: string;
  public globalPlayerId: string;
  public linkedAt: Date;
  public createdAt: Date;
  public updatedAt: Date;

  constructor(props: {
    authUserId: string;
    globalPlayerId: string;
    linkedAt: Date;
    createdAt: Date;
    updatedAt: Date;
    id?: string;
  }) {
    this.id = props.id ?? "";
    this.authUserId = props.authUserId;
    this.globalPlayerId = props.globalPlayerId;
    this.linkedAt = props.linkedAt;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }
}
