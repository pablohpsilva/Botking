-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "auth";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "core";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "item";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "robot";

-- CreateEnum
CREATE TYPE "core"."owner_type" AS ENUM ('PLAYER');

-- CreateEnum
CREATE TYPE "item"."item_class" AS ENUM ('SOUL_CHIP', 'SKELETON', 'PART', 'EXPANSION_CHIP', 'MISC');

-- CreateEnum
CREATE TYPE "robot"."robot_part_slot" AS ENUM ('TORSO', 'ARM_R', 'ARM_L', 'LEGS');

-- CreateEnum
CREATE TYPE "item"."instance_state" AS ENUM ('NEW', 'USED', 'EQUIPPED');

-- CreateTable
CREATE TABLE "auth"."user" (
    "auth_user_id" TEXT NOT NULL,
    "email" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_pkey" PRIMARY KEY ("auth_user_id")
);

-- CreateTable
CREATE TABLE "auth"."identity_link" (
    "id" TEXT NOT NULL,
    "auth_user_id" TEXT NOT NULL,
    "global_player_id" TEXT NOT NULL,
    "linked_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "identity_link_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "core"."shard" (
    "shard_id" INTEGER NOT NULL,

    CONSTRAINT "shard_pkey" PRIMARY KEY ("shard_id")
);

-- CreateTable
CREATE TABLE "core"."player_account" (
    "shard_id" INTEGER NOT NULL,
    "player_id" BIGINT NOT NULL,
    "global_player_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "player_account_pkey" PRIMARY KEY ("shard_id","player_id")
);

-- CreateTable
CREATE TABLE "item"."template" (
    "item_tpl_id" TEXT NOT NULL,
    "class" "item"."item_class" NOT NULL,
    "name" TEXT NOT NULL,
    "meta" JSONB,

    CONSTRAINT "template_pkey" PRIMARY KEY ("item_tpl_id")
);

-- CreateTable
CREATE TABLE "item"."instance" (
    "item_inst_id" TEXT NOT NULL,
    "shard_id" INTEGER NOT NULL,
    "player_id" BIGINT NOT NULL,
    "item_tpl_id" TEXT NOT NULL,
    "state" "item"."instance_state" NOT NULL,
    "bound_to_player" TEXT,

    CONSTRAINT "instance_pkey" PRIMARY KEY ("item_inst_id")
);

-- CreateTable
CREATE TABLE "item"."inventory_stack" (
    "stack_id" TEXT NOT NULL,
    "shard_id" INTEGER NOT NULL,
    "player_id" BIGINT NOT NULL,
    "item_tpl_id" TEXT NOT NULL,
    "qty" BIGINT NOT NULL,

    CONSTRAINT "inventory_stack_pkey" PRIMARY KEY ("stack_id")
);

-- CreateTable
CREATE TABLE "robot"."robot" (
    "robot_id" TEXT NOT NULL,
    "shard_id" INTEGER NOT NULL,
    "player_id" BIGINT NOT NULL,
    "nickname" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "robot_pkey" PRIMARY KEY ("robot_id")
);

-- CreateTable
CREATE TABLE "robot"."soul_chip_slot" (
    "robot_id" TEXT NOT NULL,
    "item_inst_id" TEXT NOT NULL,

    CONSTRAINT "soul_chip_slot_pkey" PRIMARY KEY ("robot_id")
);

-- CreateTable
CREATE TABLE "robot"."skeleton_slot" (
    "robot_id" TEXT NOT NULL,
    "item_inst_id" TEXT NOT NULL,

    CONSTRAINT "skeleton_slot_pkey" PRIMARY KEY ("robot_id")
);

-- CreateTable
CREATE TABLE "robot"."part_slots" (
    "robot_id" TEXT NOT NULL,
    "slot_type" "robot"."robot_part_slot" NOT NULL,
    "item_inst_id" TEXT NOT NULL,

    CONSTRAINT "part_slots_pkey" PRIMARY KEY ("robot_id","slot_type")
);

-- CreateTable
CREATE TABLE "robot"."expansion_slot" (
    "robot_id" TEXT NOT NULL,
    "slot_ix" INTEGER NOT NULL,
    "item_inst_id" TEXT NOT NULL,

    CONSTRAINT "expansion_slot_pkey" PRIMARY KEY ("robot_id","slot_ix")
);

-- CreateIndex
CREATE UNIQUE INDEX "identity_link_auth_user_id_global_player_id_key" ON "auth"."identity_link"("auth_user_id", "global_player_id");

-- CreateIndex
CREATE UNIQUE INDEX "player_account_global_player_id_shard_id_key" ON "core"."player_account"("global_player_id", "shard_id");

-- CreateIndex
CREATE INDEX "ix_iteminst_player" ON "item"."instance"("shard_id", "player_id");

-- CreateIndex
CREATE INDEX "ix_iteminst_tpl" ON "item"."instance"("item_tpl_id");

-- CreateIndex
CREATE INDEX "ix_stack_player" ON "item"."inventory_stack"("shard_id", "player_id");

-- CreateIndex
CREATE UNIQUE INDEX "inventory_stack_shard_id_player_id_item_tpl_id_key" ON "item"."inventory_stack"("shard_id", "player_id", "item_tpl_id");

-- CreateIndex
CREATE INDEX "ix_robot_player" ON "robot"."robot"("shard_id", "player_id");

-- CreateIndex
CREATE UNIQUE INDEX "soul_chip_slot_item_inst_id_key" ON "robot"."soul_chip_slot"("item_inst_id");

-- CreateIndex
CREATE UNIQUE INDEX "skeleton_slot_item_inst_id_key" ON "robot"."skeleton_slot"("item_inst_id");

-- CreateIndex
CREATE UNIQUE INDEX "part_slots_item_inst_id_key" ON "robot"."part_slots"("item_inst_id");

-- CreateIndex
CREATE INDEX "ix_partslot_item" ON "robot"."part_slots"("item_inst_id");

-- CreateIndex
CREATE UNIQUE INDEX "expansion_slot_item_inst_id_key" ON "robot"."expansion_slot"("item_inst_id");

-- CreateIndex
CREATE INDEX "ix_expslot_item" ON "robot"."expansion_slot"("item_inst_id");

-- AddForeignKey
ALTER TABLE "auth"."identity_link" ADD CONSTRAINT "identity_link_auth_user_id_fkey" FOREIGN KEY ("auth_user_id") REFERENCES "auth"."user"("auth_user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "core"."player_account" ADD CONSTRAINT "player_account_shard_id_fkey" FOREIGN KEY ("shard_id") REFERENCES "core"."shard"("shard_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "item"."instance" ADD CONSTRAINT "instance_shard_id_player_id_fkey" FOREIGN KEY ("shard_id", "player_id") REFERENCES "core"."player_account"("shard_id", "player_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "item"."instance" ADD CONSTRAINT "instance_item_tpl_id_fkey" FOREIGN KEY ("item_tpl_id") REFERENCES "item"."template"("item_tpl_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "item"."inventory_stack" ADD CONSTRAINT "inventory_stack_shard_id_player_id_fkey" FOREIGN KEY ("shard_id", "player_id") REFERENCES "core"."player_account"("shard_id", "player_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "item"."inventory_stack" ADD CONSTRAINT "inventory_stack_item_tpl_id_fkey" FOREIGN KEY ("item_tpl_id") REFERENCES "item"."template"("item_tpl_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "robot"."robot" ADD CONSTRAINT "robot_shard_id_player_id_fkey" FOREIGN KEY ("shard_id", "player_id") REFERENCES "core"."player_account"("shard_id", "player_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "robot"."soul_chip_slot" ADD CONSTRAINT "soul_chip_slot_robot_id_fkey" FOREIGN KEY ("robot_id") REFERENCES "robot"."robot"("robot_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "robot"."soul_chip_slot" ADD CONSTRAINT "soul_chip_slot_item_inst_id_fkey" FOREIGN KEY ("item_inst_id") REFERENCES "item"."instance"("item_inst_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "robot"."skeleton_slot" ADD CONSTRAINT "skeleton_slot_robot_id_fkey" FOREIGN KEY ("robot_id") REFERENCES "robot"."robot"("robot_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "robot"."skeleton_slot" ADD CONSTRAINT "skeleton_slot_item_inst_id_fkey" FOREIGN KEY ("item_inst_id") REFERENCES "item"."instance"("item_inst_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "robot"."part_slots" ADD CONSTRAINT "part_slots_robot_id_fkey" FOREIGN KEY ("robot_id") REFERENCES "robot"."robot"("robot_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "robot"."part_slots" ADD CONSTRAINT "part_slots_item_inst_id_fkey" FOREIGN KEY ("item_inst_id") REFERENCES "item"."instance"("item_inst_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "robot"."expansion_slot" ADD CONSTRAINT "expansion_slot_robot_id_fkey" FOREIGN KEY ("robot_id") REFERENCES "robot"."robot"("robot_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "robot"."expansion_slot" ADD CONSTRAINT "expansion_slot_item_inst_id_fkey" FOREIGN KEY ("item_inst_id") REFERENCES "item"."instance"("item_inst_id") ON DELETE RESTRICT ON UPDATE CASCADE;
