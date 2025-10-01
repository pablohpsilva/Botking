import { Robot, PlayerAccount } from "@botking/artifact";
import { validateData, RobotSchema } from "@botking/validator";
import { connectionManager } from "@botking/db";
import { PlayerAccountDto } from "./player-account";

// Define loading options type
type RobotLoadOptions = {
  includeAccount?: boolean;
  includeSlots?: boolean;
};

export class RobotDto {
  public robot?: Robot;
  public account?: PlayerAccountDto;
  public slots?: {
    soulChip?: any;
    skeleton?: any;
    parts?: any[];
    expansions?: any[];
  };

  constructor(props?: {
    id: string;
    shardId: number;
    playerId: bigint;
    nickname: string;
    createdAt: Date;
    updatedAt: Date;
  }) {
    if (props) {
      this.robot = new Robot(props);
    }
  }

  /**
   * Find robot by ID with optional relationship loading
   * @param id Robot ID
   * @param options Loading options for relationships
   */
  public async findById(
    id: string,
    options: RobotLoadOptions = {}
  ): Promise<RobotDto> {
    // Build include object dynamically
    const include: any = {};

    if (options.includeAccount) {
      include.account = {
        include: {
          shard: true, // Always include shard when loading account
        },
      };
    }

    if (options.includeSlots) {
      include.soul_chip = true;
      include.skeleton = true;
      include.parts = true;
      include.expansions = true;
    }

    const dbResult = await connectionManager.getClient().robot.findUnique({
      where: { id },
      include: Object.keys(include).length > 0 ? include : undefined,
    });

    if (dbResult) {
      // Populate main robot
      this.robot = new Robot({
        id: dbResult.id,
        shardId: dbResult.shardId,
        playerId: BigInt(dbResult.playerId),
        nickname: dbResult.nickname || "",
        createdAt: dbResult.createdAt,
        updatedAt: dbResult.updatedAt,
      });

      // Populate relationships if included
      if (options.includeAccount && dbResult.account) {
        this.account = new PlayerAccountDto();
        this.account.playerAccount = dbResult.account as any;
      }

      if (options.includeSlots) {
        this.slots = {
          soulChip: dbResult.soul_chip,
          skeleton: dbResult.skeleton,
          parts: dbResult.parts,
          expansions: dbResult.expansions,
        };
      }
    }

    return this;
  }

  /**
   * Convenience methods for common use cases
   */
  public async findByIdBasic(id: string): Promise<RobotDto> {
    return this.findById(id, {});
  }

  public async findByIdWithAccount(id: string): Promise<RobotDto> {
    return this.findById(id, { includeAccount: true });
  }

  public async findByIdWithSlots(id: string): Promise<RobotDto> {
    return this.findById(id, { includeSlots: true });
  }

  public async findByIdComplete(id: string): Promise<RobotDto> {
    return this.findById(id, {
      includeAccount: true,
      includeSlots: true,
    });
  }

  /**
   * Lazy loading methods for optional relationships
   */
  public async loadAccount(): Promise<void> {
    if (!this.robot || this.account) return;

    const account = await connectionManager
      .getClient()
      .player_account.findUnique({
        where: {
          globalPlayerId: this.robot.playerId.toString(),
        },
        include: { shard: true },
      });

    if (account) {
      this.account = new PlayerAccountDto();
      this.account.playerAccount = account as PlayerAccount;
    }
  }

  public async loadSlots(): Promise<void> {
    if (!this.robot?.id || this.slots) return;

    const [soulChip, skeleton, parts, expansions] = await Promise.all([
      connectionManager.getClient().soul_chip_slot.findUnique({
        where: { robotId: this.robot.id },
      }),
      connectionManager.getClient().skeleton_slot.findUnique({
        where: { robotId: this.robot.id },
      }),
      connectionManager.getClient().part_slots.findMany({
        where: { robotId: this.robot.id },
      }),
      connectionManager.getClient().expansion_slot.findMany({
        where: { robotId: this.robot.id },
      }),
    ]);

    this.slots = {
      soulChip,
      skeleton,
      parts,
      expansions,
    };
  }

  /**
   * Static method for batch loading with relationships
   */
  public static async findManyWithOptions(
    where: any,
    options: RobotLoadOptions = {},
    pagination?: { skip?: number; take?: number }
  ): Promise<RobotDto[]> {
    const include: any = {};

    if (options.includeAccount) include.account = { include: { shard: true } };
    if (options.includeSlots) {
      include.soul_chip = true;
      include.skeleton = true;
      include.parts = true;
      include.expansions = true;
    }

    const dbResults = await connectionManager.getClient().robot.findMany({
      where,
      include: Object.keys(include).length > 0 ? include : undefined,
      skip: pagination?.skip,
      take: pagination?.take,
    });

    return dbResults.map((dbResult) => {
      const dto = new RobotDto();

      dto.robot = new Robot({
        id: dbResult.id,
        shardId: dbResult.shardId,
        playerId: BigInt(dbResult.playerId),
        nickname: dbResult.nickname || "",
        createdAt: dbResult.createdAt,
        updatedAt: dbResult.updatedAt,
      });

      // Populate relationships
      if (options.includeAccount && dbResult.account) {
        dto.account = new PlayerAccountDto();
        dto.account.playerAccount = dbResult.account as any;
      }
      if (options.includeSlots) {
        dto.slots = {
          soulChip: dbResult.soul_chip,
          skeleton: dbResult.skeleton,
          parts: dbResult.parts,
          expansions: dbResult.expansions,
        };
      }

      return dto;
    });
  }

  public validate(): RobotDto {
    const result = validateData(RobotSchema, this.robot);

    if (!result.success) {
      throw new Error(result.error);
    }

    return this;
  }

  public async upsert(): Promise<RobotDto> {
    this.validate();

    if (!this.robot) {
      throw new Error("Robot is not allowed to be set");
    }

    const dbData = {
      id: this.robot.id,
      shardId: this.robot.shardId,
      playerId: this.robot.playerId.toString(),
      nickname: this.robot.nickname,
      createdAt: this.robot.createdAt,
      updatedAt: this.robot.updatedAt,
    };

    await connectionManager.getClient().robot.upsert({
      where: { id: this.robot.id },
      update: dbData,
      create: dbData,
    });

    return this;
  }
}
