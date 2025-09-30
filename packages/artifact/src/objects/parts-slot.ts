import { robot_part_slot } from "@botking/db";

export class PartSlot {
  public robotId: string;
  public slotType: robot_part_slot;
  public itemInstId: string;
  public createdAt: Date;
  public updatedAt: Date;

  constructor(props: {
    robotId: string;
    slotType: robot_part_slot;
    itemInstId: string;
    createdAt: Date;
    updatedAt: Date;
  }) {
    this.robotId = props.robotId;
    this.slotType = props.slotType;
    this.itemInstId = props.itemInstId;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }
}
