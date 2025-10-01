import { SkeletonSlot, Robot, Instance } from "@botking/artifact";
import { validateData, SkeletonSlotSchema } from "@botking/validator";
import { connectionManager } from "@botking/db";
import { RobotDto } from "./robot";
import { InstanceDto } from "./instance";

// Define loading options type
type SkeletonSlotLoadOptions = {
  includeRobot?: boolean;
  includeInstance?: boolean;
};

export class SkeletonSlotDto {
  public skeletonSlot?: SkeletonSlot;
  public robot?: RobotDto;
  public instance?: InstanceDto;

  constructor(props?: {
    robotId: string;
    itemInstId: string;
    createdAt: Date;
    updatedAt: Date;
  }) {
    if (props) {
      this.skeletonSlot = new SkeletonSlot(props);
    }
  }

  /**
   * Find skeleton slot by robot ID with optional relationship loading
   * @param robotId Robot ID
   * @param options Loading options for relationships
   */
  public async findByRobotId(
    robotId: string,
    options: SkeletonSlotLoadOptions = {}
  ): Promise<SkeletonSlotDto> {
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

    const dbResult = await connectionManager
      .getClient()
      .skeleton_slot.findUnique({
        where: { robotId },
        include: Object.keys(include).length > 0 ? include : undefined,
      });

    if (dbResult) {
      this.skeletonSlot = new SkeletonSlot({
        robotId: dbResult.robotId,
        itemInstId: dbResult.itemInstId,
        createdAt: dbResult.createdAt,
        updatedAt: dbResult.updatedAt,
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
  public async findByRobotIdBasic(robotId: string): Promise<SkeletonSlotDto> {
    return this.findByRobotId(robotId, {});
  }

  public async findByRobotIdWithInstance(
    robotId: string
  ): Promise<SkeletonSlotDto> {
    return this.findByRobotId(robotId, { includeInstance: true });
  }

  /**
   * Lazy loading methods for optional relationships
   */
  public async loadRobot(): Promise<void> {
    if (!this.skeletonSlot?.robotId || this.robot) return;

    this.robot = await new RobotDto().findByIdBasic(this.skeletonSlot.robotId);
  }

  public async loadInstance(): Promise<void> {
    if (!this.skeletonSlot?.itemInstId || this.instance) return;

    this.instance = await new InstanceDto().findByIdWithTemplate(
      this.skeletonSlot.itemInstId
    );
  }

  public validate(): SkeletonSlotDto {
    const result = validateData(SkeletonSlotSchema, this.skeletonSlot);

    if (!result.success) {
      throw new Error(result.error);
    }

    return this;
  }

  public async upsert(): Promise<SkeletonSlotDto> {
    this.validate();

    if (!this.skeletonSlot) {
      throw new Error("Skeleton slot is not allowed to be set");
    }

    await connectionManager.getClient().skeleton_slot.upsert({
      where: { robotId: this.skeletonSlot.robotId },
      update: this.skeletonSlot,
      create: this.skeletonSlot,
    });

    return this;
  }
}
