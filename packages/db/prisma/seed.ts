/**
 * Beta seed: builds a Metabots-inspired robot (Metabee-like)
 * Requires Prisma 5.x, Node 18+.
 *
 * Models/enums expected (from your simple-beta schema):
 *  - Schemas: auth, core, item, robot
 *  - Enums: item_class, robot_part_slot
 *  - Tables: user, identity_link, shard, player_account, template, instance,
 *            robot, soul_chip_slot, skeleton_slot, part_slots, expansion_slot
 */

import {
  PrismaClient,
  instance_state,
  item_class,
  robot_part_slot,
} from "@prisma/client";

const db = new PrismaClient();

// Convenience: BigInt literal
const P1 = BigInt(1);

async function main() {
  // 0) Create a dev shard & a test player identity
  const shard = await db.shard.upsert({
    where: { shard_id: 1 },
    update: {},
    create: { shard_id: 1 },
  });

  // Create an auth user and link to a global player id
  const globalPlayerId = crypto.randomUUID();
  const auth = await db.user.create({
    data: {
      email: "ikki@example.com", // Ikki Tenryou vibes
    },
  });
  await db.identity_link.create({
    data: {
      auth_user_id: auth.auth_user_id,
      global_player_id: globalPlayerId,
    },
  });

  // Player account scoped to shard 1
  const player = await db.player_account.upsert({
    where: { shard_id_player_id: { shard_id: shard.shard_id, player_id: P1 } },
    update: {},
    create: {
      shard_id: shard.shard_id,
      player_id: P1,
      global_player_id: globalPlayerId,
    },
  });

  // 1) Item templates (Metabots-inspired naming; no IP assets included)
  // Soul-chip (Medal), Skeleton (Frame), Parts (Torso/Arms/Legs), Expansion chips (modules)
  const [
    tplSoulBeetle,
    tplFrameKBT,
    tplTorsoMetabee,
    tplArmRevolver,
    tplArmShield,
    tplLegsBiped,
    tplExpTargeting,
    tplExpCooling,
  ] = await Promise.all([
    db.template.create({
      data: {
        class: item_class.SOUL_CHIP,
        name: "Beetle Medal (Common)",
        slug: "beetle-medal-common",
        meta: { base: { atk: 12, def: 8, spd: 10, lethality: 6 } },
      },
    }),
    db.template.create({
      data: {
        class: item_class.SKELETON,
        name: "KBT Frame",
        slug: "kbt-frame",
        meta: { base: { atk: 20, def: 20, spd: 12, chassis: "KBT" } },
      },
    }),
    db.template.create({
      data: {
        class: item_class.PART,
        name: "Metabee Torso",
        slug: "metabee-torso",
        meta: { slot: "TORSO", modifiers: { atkPct: 0.1, defPct: 0.05 } },
      },
    }),
    db.template.create({
      data: {
        class: item_class.PART,
        name: "Right Arm — Revolver",
        slug: "right-arm-revolver",
        meta: { slot: "ARM_R", tags: ["ranged"], modifiers: { atkPct: 0.15 } },
      },
    }),
    db.template.create({
      data: {
        class: item_class.PART,
        name: "Left Arm — Shield",
        slug: "left-arm-shield",
        meta: { slot: "ARM_L", tags: ["guard"], modifiers: { defPct: 0.15 } },
      },
    }),
    db.template.create({
      data: {
        class: item_class.PART,
        name: "Legs — Biped Runner",
        slug: "legs-biped-runner",
        meta: { slot: "LEGS", tags: ["ground"], modifiers: { spdPct: 0.12 } },
      },
    }),
    db.template.create({
      data: {
        class: item_class.EXPANSION_CHIP,
        name: "Expansion — Targeting Module",
        slug: "expansion-targeting-module",
        meta: { mods: { critRatePct: 0.05 } },
      },
    }),
    db.template.create({
      data: {
        class: item_class.EXPANSION_CHIP,
        name: "Expansion — Cooling Module",
        slug: "expansion-cooling-module",
        meta: { mods: { overheatResistPct: 0.2 } },
      },
    }),
  ]);

  // 2) Mint instances for player (free prototype: no costs, straight grants)
  const mint = (tplId: string) =>
    db.instance.create({
      data: {
        shard_id: shard.shard_id,
        player_id: P1,
        item_tpl_id: tplId,
        state: instance_state.NEW,
      },
    });

  const [
    instSoul,
    instFrame,
    instTorso,
    instArmR,
    instArmL,
    instLegs,
    instExpA,
    instExpB,
  ] = await Promise.all([
    mint(tplSoulBeetle.item_tpl_id),
    mint(tplFrameKBT.item_tpl_id),
    mint(tplTorsoMetabee.item_tpl_id),
    mint(tplArmRevolver.item_tpl_id),
    mint(tplArmShield.item_tpl_id),
    mint(tplLegsBiped.item_tpl_id),
    mint(tplExpTargeting.item_tpl_id),
    mint(tplExpCooling.item_tpl_id),
  ]);

  // 3) Create the robot & equip everything
  const bot = await db.robot.create({
    data: {
      shard_id: shard.shard_id,
      player_id: P1,
      nickname: "Metabee-Proto",
    },
  });

  await db.$transaction([
    // core slots
    db.soul_chip_slot.create({
      data: { robot_id: bot.robot_id, item_inst_id: instSoul.item_inst_id },
    }),
    db.skeleton_slot.create({
      data: { robot_id: bot.robot_id, item_inst_id: instFrame.item_inst_id },
    }),

    // parts
    db.part_slots.create({
      data: {
        robot_id: bot.robot_id,
        slot_type: robot_part_slot.TORSO,
        item_inst_id: instTorso.item_inst_id,
      },
    }),
    db.part_slots.create({
      data: {
        robot_id: bot.robot_id,
        slot_type: robot_part_slot.ARM_R,
        item_inst_id: instArmR.item_inst_id,
      },
    }),
    db.part_slots.create({
      data: {
        robot_id: bot.robot_id,
        slot_type: robot_part_slot.ARM_L,
        item_inst_id: instArmL.item_inst_id,
      },
    }),
    db.part_slots.create({
      data: {
        robot_id: bot.robot_id,
        slot_type: robot_part_slot.LEGS,
        item_inst_id: instLegs.item_inst_id,
      },
    }),

    // expansions (two open slots 0..1 for prototype)
    db.expansion_slot.create({
      data: {
        robot_id: bot.robot_id,
        slot_ix: 0,
        item_inst_id: instExpA.item_inst_id,
      },
    }),
    db.expansion_slot.create({
      data: {
        robot_id: bot.robot_id,
        slot_ix: 1,
        item_inst_id: instExpB.item_inst_id,
      },
    }),

    // mark instances as EQUIPPED for quick UI filtering
    db.instance.update({
      where: { item_inst_id: instSoul.item_inst_id },
      data: { state: instance_state.EQUIPPED },
    }),
    db.instance.update({
      where: { item_inst_id: instFrame.item_inst_id },
      data: { state: instance_state.EQUIPPED },
    }),
    db.instance.update({
      where: { item_inst_id: instTorso.item_inst_id },
      data: { state: instance_state.EQUIPPED },
    }),
    db.instance.update({
      where: { item_inst_id: instArmR.item_inst_id },
      data: { state: instance_state.EQUIPPED },
    }),
    db.instance.update({
      where: { item_inst_id: instArmL.item_inst_id },
      data: { state: instance_state.EQUIPPED },
    }),
    db.instance.update({
      where: { item_inst_id: instLegs.item_inst_id },
      data: { state: instance_state.EQUIPPED },
    }),
    db.instance.update({
      where: { item_inst_id: instExpA.item_inst_id },
      data: { state: instance_state.EQUIPPED },
    }),
    db.instance.update({
      where: { item_inst_id: instExpB.item_inst_id },
      data: { state: instance_state.EQUIPPED },
    }),
  ]);

  console.log(
    "✅ Seeded Metabots-inspired robot build for player #1 on shard #1"
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
