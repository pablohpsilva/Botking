import { PartSlot, Robot, Instance } from "@botking/artifact";
import { validateData, PartSlotSchema } from "@botking/validator";
import { connectionManager, robot_part_slot } from "@botking/db";
import { RobotDto } from "./robot";
import { InstanceDto } from "./instance";

// Define loading options type
type PartsSlotLoadOptions = {
  includeRobot?: boolean;
  includeInstance?: boolean;
};

export class PartsSlotDto {
  public partsSlot?: PartSlot;
  public robot?: RobotDto;
  public instance?: InstanceDto;

  constructor(props?: {
    robotId: string;
    slotType: robot_part_slot;
    itemInstId: string;
    createdAt: Date;
    updatedAt: Date;
  }) {
    if (props) {
      this.partsSlot = new PartSlot(props);
    }
  }

  /**
   * Find parts slot by composite key with optional relationship loading
   * @param robotId Robot ID
   * @param slotType Slot type
   * @param options Loading options for relationships
   */
  public async findByCompositeKey(
    robotId: string,
    slotType: robot_part_slot,
    options: PartsSlotLoadOptions = {}
  ): Promise<PartsSlotDto> {
    // Build include object dynamically
    const include: any = {};

    if (options.includeRobot) {
      include.robot = true;
    }

    if (options.includeInstance) {
      include.instance = {
        include: {
          template: true, // Always include template when loading instance
        },
      };
    }

    const dbResult = await connectionManager.getClient().part_slots.findUnique({
      where: {
        robotId_slotType: {
          robotId,
          slotType,
        },
      },
      include: Object.keys(include).length > 0 ? include : undefined,
    });

    if (dbResult) {
      // Database doesn't have timestamps, so we use current time
      const now = new Date();
      this.partsSlot = new PartSlot({
        robotId: dbResult.robotId,
        slotType: dbResult.slotType,
        itemInstId: dbResult.itemInstId,
        createdAt: now,
        updatedAt: now,
      });

      // Populate relationships if included
      if (options.includeRobot && dbResult.robot) {
        this.robot = new RobotDto();
        this.robot.robot = dbResult.robot as Robot;
      }

      if (options.includeInstance && dbResult.instance) {
        this.instance = new InstanceDto();
        this.instance.instance = dbResult.instance as Instance;
        if ((dbResult.instance as any).template) {
          const { TemplateDto } = await import("./template");
          this.instance.template = new TemplateDto();
          this.instance.template.template = (dbResult.instance as any).template;
        }
      }
    }
    return this;
  }

  /**
   * Convenience methods for common use cases
   */
  public async findByCompositeKeyBasic(
    robotId: string,
    slotType: robot_part_slot
  ): Promise<PartsSlotDto> {
    return this.findByCompositeKey(robotId, slotType, {});
  }

  public async findByCompositeKeyWithRobot(
    robotId: string,
    slotType: robot_part_slot
  ): Promise<PartsSlotDto> {
    return this.findByCompositeKey(robotId, slotType, { includeRobot: true });
  }

  public async findByCompositeKeyWithInstance(
    robotId: string,
    slotType: robot_part_slot
  ): Promise<PartsSlotDto> {
    return this.findByCompositeKey(robotId, slotType, {
      includeInstance: true,
    });
  }

  public async findByCompositeKeyComplete(
    robotId: string,
    slotType: robot_part_slot
  ): Promise<PartsSlotDto> {
    return this.findByCompositeKey(robotId, slotType, {
      includeRobot: true,
      includeInstance: true,
    });
  }

  /**
   * Lazy loading methods for optional relationships
   */
  public async loadRobot(): Promise<void> {
    if (!this.partsSlot?.robotId || this.robot) return;

    this.robot = await new RobotDto().findByIdBasic(this.partsSlot.robotId);
  }

  public async loadInstance(): Promise<void> {
    if (!this.partsSlot?.itemInstId || this.instance) return;

    this.instance = await new InstanceDto().findByIdWithTemplate(
      this.partsSlot.itemInstId
    );
  }

  public validate(): PartsSlotDto {
    const result = validateData(PartSlotSchema, this.partsSlot);

    if (!result.success) {
      throw new Error(result.error);
    }

    return this;
  }

  public async upsert(): Promise<PartsSlotDto> {
    this.validate();

    if (!this.partsSlot) {
      throw new Error("Parts slot is not allowed to be set");
    }

    // Database doesn't have timestamps, so we only send the fields it expects
    const dbData = {
      robotId: this.partsSlot.robotId,
      slotType: this.partsSlot.slotType,
      itemInstId: this.partsSlot.itemInstId,
    };

    await connectionManager.getClient().part_slots.upsert({
      where: {
        robotId_slotType: {
          robotId: this.partsSlot.robotId,
          slotType: this.partsSlot.slotType,
        },
      },
      update: dbData,
      create: dbData,
    });

    return this;
  }
}
