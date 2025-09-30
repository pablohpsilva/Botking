export class ExpansionSlot {
  public robotId: string;
  public itemInstId: string;
  public slotIx: number;
  public createdAt: Date;
  public updatedAt: Date;

  constructor(props: {
    robotId: string;
    slotIx: number;
    itemInstId: string;
    createdAt: Date;
    updatedAt: Date;
  }) {
    this.robotId = props.robotId;
    this.slotIx = props.slotIx;
    this.itemInstId = props.itemInstId;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }
}
