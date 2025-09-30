// import { ExpansionSlot, Robot } from "@botking/artifact";
// import { validateData, ExpansionSlotSchema } from "@botking/validator";
// import { connectionManager } from "@botking/db";

// // type ExpansionSlotWithPack = Robot & { pack?: AssetPackDto };
// // type ExpansionSlotWithPackRaw = Asset & { pack: AssetPack };

// export class ExpansionSlotDto {
//   public expansionSlot?: ExpansionSlot;

//   constructor(props?: {
//     robotId: string;
//     itemInstId: string;
//     slotIx: number;
//     createdAt: Date;
//     updatedAt: Date;
//   }) {
//     if (props) {
//       this.expansionSlot = new ExpansionSlot(props);
//     }
//   }

//   public async findById(id: string): Promise<ExpansionSlotDto> {
//     this.expansionSlot = (await connectionManager
//       .getClient()
//       .asset_pack.findUnique({
//         where: { id },
//       })) as ExpansionSlotDto;
//     return this;
//   }

//   public validate(): ExpansionSlotDto {
//     const result = validateData(ExpansionSlotSchema, this.expansionSlot);

//     if (!result.success) {
//       throw new Error(result.error);
//     }

//     return this;
//   }

//   public async upsert(): Promise<ExpansionSlotDto> {
//     this.validate();

//     if (!this.expansionSlot) {
//       throw new Error("Asset pack is not allowed to be set");
//     }

//     await connectionManager.getClient().asset_pack.upsert({
//       where: { id: this.expansionSlot.id },
//       update: this.expansionSlot,
//       create: this.expansionSlot,
//     });

//     return this;
//   }
// }
