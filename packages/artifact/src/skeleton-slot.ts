export class SkeletonSlot {
  public robotId: string;
  public itemInstId: string;
  public createdAt: Date;
  public updatedAt: Date;

  constructor(props: {
    robotId: string;
    itemInstId: string;
    createdAt: Date;
    updatedAt: Date;
  }) {
    this.robotId = props.robotId;
    this.itemInstId = props.itemInstId;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }
}
