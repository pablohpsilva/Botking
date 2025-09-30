/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `template` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `slug` to the `template` table without a default value. This is not possible if the table is not empty.

*/
-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "asset";

-- CreateEnum
CREATE TYPE "asset"."kind" AS ENUM ('ICON', 'CARD', 'SPRITE', 'THREE_D');

-- AlterTable
ALTER TABLE "item"."template" ADD COLUMN     "slug" TEXT NOT NULL;

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

    CONSTRAINT "asset_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "asset"."pack" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "version" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "pack_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "asset"."template_asset" (
    "id" TEXT NOT NULL,
    "item_tpl_id" TEXT NOT NULL,
    "asset_id" TEXT NOT NULL,
    "primary" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "template_asset_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "pack_version_key" ON "asset"."pack"("version");

-- CreateIndex
CREATE INDEX "template_asset_item_tpl_id_primary_idx" ON "asset"."template_asset"("item_tpl_id", "primary");

-- CreateIndex
CREATE UNIQUE INDEX "template_asset_item_tpl_id_asset_id_key" ON "asset"."template_asset"("item_tpl_id", "asset_id");

-- CreateIndex
CREATE UNIQUE INDEX "template_slug_key" ON "item"."template"("slug");

-- AddForeignKey
ALTER TABLE "asset"."asset" ADD CONSTRAINT "asset_packId_fkey" FOREIGN KEY ("packId") REFERENCES "asset"."pack"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "asset"."template_asset" ADD CONSTRAINT "template_asset_item_tpl_id_fkey" FOREIGN KEY ("item_tpl_id") REFERENCES "item"."template"("item_tpl_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "asset"."template_asset" ADD CONSTRAINT "template_asset_asset_id_fkey" FOREIGN KEY ("asset_id") REFERENCES "asset"."asset"("id") ON DELETE CASCADE ON UPDATE CASCADE;
