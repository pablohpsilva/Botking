import { PlayerAccount } from "@botking/artifact";
import { validateData, PlayerAccountSchema } from "@botking/validator";
// import { connectionManager } from "@botking/db";

export class PlayerAccountDto {
  public playerAccount?: PlayerAccount;

  constructor(props?: {
    id: string;
    shardId: number;
    globalPlayerId: string;
    createdAt: Date;
    updatedAt: Date;
  }) {
    if (props) {
      this.playerAccount = new PlayerAccount(props);
    }
  }

  // public async findById(id: string): Promise<PlayerAccountDto> {
  //   const x = await connectionManager.getClient().player_account.findUnique({
  //     where: { id },
  //   });
  //   // this.playerAccount = (await connectionManager
  //   //   .getClient()
  //   //   .player_account.findUnique()) as PlayerAccount;

  //   return this;
  // }

  public validate(): PlayerAccountDto {
    const result = validateData(PlayerAccountSchema, this.playerAccount);

    if (!result.success) {
      throw new Error(result.error);
    }

    return this;
  }

  // public async upsert(): Promise<PlayerAccountDto> {
  //   this.validate();

  //   if (!this.playerAccount) {
  //     throw new Error("PlayerAccount pack is not allowed to be set");
  //   }

  //   await connectionManager.getClient().player_account.upsert({
  //     where: { shardId: this.playerAccount.shardId, id: this.playerAccount.id },
  //     update: this.playerAccount,
  //     create: this.playerAccount,
  //   });

  //   return this;
  // }
}
