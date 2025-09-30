-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "asset";

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

-- CreateEnum
CREATE TYPE "asset"."kind" AS ENUM ('ICON', 'CARD', 'SPRITE', 'THREE_D');

-- CreateTable
CREATE TABLE "auth"."user" (
    "authUserId" TEXT NOT NULL,
    "email" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("authUserId")
);

-- CreateTable
CREATE TABLE "auth"."identity_link" (
    "id" TEXT NOT NULL,
    "authUserId" TEXT NOT NULL,
    "globalPlayerId" TEXT NOT NULL,
    "linkedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "identity_link_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "core"."shard" (
    "shardId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "shard_pkey" PRIMARY KEY ("shardId")
);

-- CreateTable
CREATE TABLE "core"."player_account" (
    "shardId" INTEGER NOT NULL,
    "playerId" BIGINT NOT NULL,
    "globalPlayerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "player_account_pkey" PRIMARY KEY ("shardId","playerId")
);

-- CreateTable
CREATE TABLE "item"."template" (
    "id" TEXT NOT NULL,
    "itemClass" "item"."item_class" NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "meta" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "template_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "item"."instance" (
    "id" TEXT NOT NULL,
    "shardId" INTEGER NOT NULL,
    "playerId" BIGINT NOT NULL,
    "templateId" TEXT NOT NULL,
    "state" "item"."instance_state" NOT NULL,
    "boundToPlayer" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "instance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "item"."inventory_stack" (
    "id" TEXT NOT NULL,
    "shardId" INTEGER NOT NULL,
    "playerId" BIGINT NOT NULL,
    "templateId" TEXT NOT NULL,
    "quantity" BIGINT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "inventory_stack_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "robot"."robot" (
    "id" TEXT NOT NULL,
    "shardId" INTEGER NOT NULL,
    "playerId" BIGINT NOT NULL,
    "nickname" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "robot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "robot"."soul_chip_slot" (
    "robotId" TEXT NOT NULL,
    "itemInstId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "soul_chip_slot_pkey" PRIMARY KEY ("robotId")
);

-- CreateTable
CREATE TABLE "robot"."skeleton_slot" (
    "robotId" TEXT NOT NULL,
    "itemInstId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "skeleton_slot_pkey" PRIMARY KEY ("robotId")
);

-- CreateTable
CREATE TABLE "robot"."part_slots" (
    "robotId" TEXT NOT NULL,
    "slotType" "robot"."robot_part_slot" NOT NULL,
    "itemInstId" TEXT NOT NULL,

    CONSTRAINT "part_slots_pkey" PRIMARY KEY ("robotId","slotType")
);

-- CreateTable
CREATE TABLE "robot"."expansion_slot" (
    "robotId" TEXT NOT NULL,
    "slotIx" INTEGER NOT NULL,
    "itemInstId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "expansion_slot_pkey" PRIMARY KEY ("robotId","slotIx")
);

-- CreateTable
CREATE TABLE "asset"."asset" (
    "id" TEXT NOT NULL,
    "packId" TEXT NOT NULL,
    "kind" "asset"."kind" NOT NULL,
    "url" TEXT NOT NULL,
    "width" INTEGER,
    "height" INTEGER,
    "variant" TEXT,
    "meta" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "asset_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "asset"."pack" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "version" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pack_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "asset"."template_asset" (
    "id" TEXT NOT NULL,
    "itemTplId" TEXT NOT NULL,
    "assetId" TEXT NOT NULL,
    "primary" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "template_asset_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "identity_link_globalPlayerId_key" ON "auth"."identity_link"("globalPlayerId");

-- CreateIndex
CREATE UNIQUE INDEX "identity_link_authUserId_globalPlayerId_key" ON "auth"."identity_link"("authUserId", "globalPlayerId");

-- CreateIndex
CREATE UNIQUE INDEX "player_account_globalPlayerId_shardId_key" ON "core"."player_account"("globalPlayerId", "shardId");

-- CreateIndex
CREATE UNIQUE INDEX "template_slug_key" ON "item"."template"("slug");

-- CreateIndex
CREATE INDEX "ix_iteminst_player" ON "item"."instance"("shardId", "playerId");

-- CreateIndex
CREATE INDEX "ix_iteminst_tpl" ON "item"."instance"("templateId");

-- CreateIndex
CREATE INDEX "ix_stack_player" ON "item"."inventory_stack"("shardId", "playerId");

-- CreateIndex
CREATE UNIQUE INDEX "inventory_stack_shardId_playerId_templateId_key" ON "item"."inventory_stack"("shardId", "playerId", "templateId");

-- CreateIndex
CREATE INDEX "ix_robot_player" ON "robot"."robot"("shardId", "playerId");

-- CreateIndex
CREATE UNIQUE INDEX "soul_chip_slot_itemInstId_key" ON "robot"."soul_chip_slot"("itemInstId");

-- CreateIndex
CREATE UNIQUE INDEX "skeleton_slot_itemInstId_key" ON "robot"."skeleton_slot"("itemInstId");

-- CreateIndex
CREATE UNIQUE INDEX "part_slots_itemInstId_key" ON "robot"."part_slots"("itemInstId");

-- CreateIndex
CREATE INDEX "ix_partslot_item" ON "robot"."part_slots"("itemInstId");

-- CreateIndex
CREATE UNIQUE INDEX "expansion_slot_itemInstId_key" ON "robot"."expansion_slot"("itemInstId");

-- CreateIndex
CREATE INDEX "ix_expslot_item" ON "robot"."expansion_slot"("itemInstId");

-- CreateIndex
CREATE UNIQUE INDEX "pack_version_key" ON "asset"."pack"("version");

-- CreateIndex
CREATE INDEX "template_asset_itemTplId_primary_idx" ON "asset"."template_asset"("itemTplId", "primary");

-- CreateIndex
CREATE UNIQUE INDEX "template_asset_itemTplId_assetId_key" ON "asset"."template_asset"("itemTplId", "assetId");

-- AddForeignKey
ALTER TABLE "auth"."identity_link" ADD CONSTRAINT "identity_link_authUserId_fkey" FOREIGN KEY ("authUserId") REFERENCES "auth"."user"("authUserId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "core"."player_account" ADD CONSTRAINT "player_account_shardId_fkey" FOREIGN KEY ("shardId") REFERENCES "core"."shard"("shardId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "item"."instance" ADD CONSTRAINT "instance_shardId_playerId_fkey" FOREIGN KEY ("shardId", "playerId") REFERENCES "core"."player_account"("shardId", "playerId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "item"."instance" ADD CONSTRAINT "instance_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "item"."template"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "item"."inventory_stack" ADD CONSTRAINT "inventory_stack_shardId_playerId_fkey" FOREIGN KEY ("shardId", "playerId") REFERENCES "core"."player_account"("shardId", "playerId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "item"."inventory_stack" ADD CONSTRAINT "inventory_stack_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "item"."template"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "robot"."robot" ADD CONSTRAINT "robot_shardId_playerId_fkey" FOREIGN KEY ("shardId", "playerId") REFERENCES "core"."player_account"("shardId", "playerId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "robot"."soul_chip_slot" ADD CONSTRAINT "soul_chip_slot_robotId_fkey" FOREIGN KEY ("robotId") REFERENCES "robot"."robot"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "robot"."soul_chip_slot" ADD CONSTRAINT "soul_chip_slot_itemInstId_fkey" FOREIGN KEY ("itemInstId") REFERENCES "item"."instance"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "robot"."skeleton_slot" ADD CONSTRAINT "skeleton_slot_robotId_fkey" FOREIGN KEY ("robotId") REFERENCES "robot"."robot"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "robot"."skeleton_slot" ADD CONSTRAINT "skeleton_slot_itemInstId_fkey" FOREIGN KEY ("itemInstId") REFERENCES "item"."instance"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "robot"."part_slots" ADD CONSTRAINT "part_slots_robotId_fkey" FOREIGN KEY ("robotId") REFERENCES "robot"."robot"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "robot"."part_slots" ADD CONSTRAINT "part_slots_itemInstId_fkey" FOREIGN KEY ("itemInstId") REFERENCES "item"."instance"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "robot"."expansion_slot" ADD CONSTRAINT "expansion_slot_robotId_fkey" FOREIGN KEY ("robotId") REFERENCES "robot"."robot"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "robot"."expansion_slot" ADD CONSTRAINT "expansion_slot_itemInstId_fkey" FOREIGN KEY ("itemInstId") REFERENCES "item"."instance"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "asset"."asset" ADD CONSTRAINT "asset_packId_fkey" FOREIGN KEY ("packId") REFERENCES "asset"."pack"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "asset"."template_asset" ADD CONSTRAINT "template_asset_itemTplId_fkey" FOREIGN KEY ("itemTplId") REFERENCES "item"."template"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "asset"."template_asset" ADD CONSTRAINT "template_asset_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "asset"."asset"("id") ON DELETE CASCADE ON UPDATE CASCADE;
