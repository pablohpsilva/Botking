export class Shard {
  public id: number;
  public createdAt: Date;
  public updatedAt: Date;

  constructor(props: { id: number; createdAt: Date; updatedAt: Date }) {
    this.id = props.id ?? 0;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }
}
