-- CreateEnum
CREATE TYPE "Rarity" AS ENUM ('COMMON', 'UNCOMMON', 'RARE', 'EPIC', 'LEGENDARY', 'ULTRA_RARE', 'PROTOTYPE');

-- CreateEnum
CREATE TYPE "SkeletonType" AS ENUM ('LIGHT', 'BALANCED', 'HEAVY', 'FLYING', 'MODULAR');

-- CreateEnum
CREATE TYPE "MobilityType" AS ENUM ('WHEELED', 'BIPEDAL', 'WINGED', 'TRACKED', 'HYBRID');

-- CreateEnum
CREATE TYPE "PartCategory" AS ENUM ('ARM', 'LEG', 'TORSO', 'HEAD', 'ACCESSORY');

-- CreateEnum
CREATE TYPE "ExpansionChipEffect" AS ENUM ('ATTACK_BUFF', 'DEFENSE_BUFF', 'SPEED_BUFF', 'AI_UPGRADE', 'ENERGY_EFFICIENCY', 'SPECIAL_ABILITY', 'STAT_BOOST', 'RESISTANCE');

-- CreateEnum
CREATE TYPE "BotLocation" AS ENUM ('STORAGE', 'TRAINING', 'MISSION', 'MAINTENANCE', 'COMBAT');

-- CreateEnum
CREATE TYPE "BotType" AS ENUM ('WORKER', 'PLAYABLE', 'KING', 'ROGUE', 'GOVBOT');

-- CreateEnum
CREATE TYPE "CollectionType" AS ENUM ('BOTS', 'PARTS', 'CHIPS', 'SKELETONS', 'MIXED');

-- CreateEnum
CREATE TYPE "CombatRole" AS ENUM ('ASSAULT', 'TANK', 'SNIPER', 'SCOUT');

-- CreateEnum
CREATE TYPE "UtilitySpecialization" AS ENUM ('CONSTRUCTION', 'MINING', 'REPAIR', 'TRANSPORT');

-- CreateEnum
CREATE TYPE "GovernmentType" AS ENUM ('SECURITY', 'ADMIN', 'MAINTENANCE');

-- CreateEnum
CREATE TYPE "ItemCategory" AS ENUM ('SPEED_UP', 'RESOURCE', 'TRADEABLE', 'GEMS');

-- CreateEnum
CREATE TYPE "ResourceType" AS ENUM ('ENERGY', 'SCRAP_PARTS', 'MICROCHIPS', 'STAMINA', 'PARTS_ENHANCER', 'BOT_ENHANCER', 'SKELETON_ENHANCER', 'EXPANSION_CHIP_ENHANCER');

-- CreateEnum
CREATE TYPE "EnhancementDuration" AS ENUM ('TEMPORARY', 'PERMANENT');

-- CreateEnum
CREATE TYPE "SpeedUpTarget" AS ENUM ('BOT_CONSTRUCTION', 'PART_MANUFACTURING', 'TRAINING', 'MISSION', 'RESEARCH', 'REPAIR');

-- CreateEnum
CREATE TYPE "GemType" AS ENUM ('COMMON', 'RARE', 'EPIC', 'LEGENDARY');

-- CreateEnum
CREATE TYPE "TradingEventStatus" AS ENUM ('DRAFT', 'ACTIVE', 'PAUSED', 'ENDED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "TradeOfferStatus" AS ENUM ('ACTIVE', 'PAUSED', 'SOLD_OUT', 'EXPIRED');

-- CreateEnum
CREATE TYPE "TradeItemType" AS ENUM ('REQUIRED', 'REWARD');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "name" TEXT,
    "image" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sessions" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "accounts" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "password" TEXT,
    "accessToken" TEXT,
    "refreshToken" TEXT,
    "idToken" TEXT,
    "accessTokenExpiresAt" TIMESTAMP(3),
    "refreshTokenExpiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "verifications" (
    "id" TEXT NOT NULL,
    "identifier" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "verifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "soul_chips" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "personality" VARCHAR(200) NOT NULL,
    "rarity" "Rarity" NOT NULL,
    "intelligence" INTEGER NOT NULL DEFAULT 50,
    "resilience" INTEGER NOT NULL DEFAULT 50,
    "adaptability" INTEGER NOT NULL DEFAULT 50,
    "specialTrait" TEXT NOT NULL,
    "experiences" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "learningRate" DOUBLE PRECISION NOT NULL DEFAULT 0.5,
    "version" INTEGER NOT NULL DEFAULT 1,
    "source" TEXT,
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "description" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "soul_chips_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "skeletons" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "type" "SkeletonType" NOT NULL,
    "rarity" "Rarity" NOT NULL,
    "slots" INTEGER NOT NULL DEFAULT 4,
    "baseDurability" INTEGER NOT NULL DEFAULT 100,
    "currentDurability" INTEGER NOT NULL DEFAULT 100,
    "maxDurability" INTEGER NOT NULL DEFAULT 100,
    "mobilityType" "MobilityType" NOT NULL,
    "upgradeLevel" INTEGER NOT NULL DEFAULT 0,
    "specialAbilities" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "version" INTEGER NOT NULL DEFAULT 1,
    "source" TEXT,
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "description" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "skeletons_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "parts" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "category" "PartCategory" NOT NULL,
    "rarity" "Rarity" NOT NULL,
    "attack" INTEGER NOT NULL DEFAULT 0,
    "defense" INTEGER NOT NULL DEFAULT 0,
    "speed" INTEGER NOT NULL DEFAULT 0,
    "perception" INTEGER NOT NULL DEFAULT 0,
    "energyConsumption" INTEGER NOT NULL DEFAULT 5,
    "upgradeLevel" INTEGER NOT NULL DEFAULT 0,
    "currentDurability" INTEGER NOT NULL DEFAULT 100,
    "maxDurability" INTEGER NOT NULL DEFAULT 100,
    "abilities" JSONB[] DEFAULT ARRAY[]::JSONB[],
    "version" INTEGER NOT NULL DEFAULT 1,
    "source" TEXT,
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "description" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "parts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "expansion_chips" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "effect" "ExpansionChipEffect" NOT NULL,
    "rarity" "Rarity" NOT NULL,
    "upgradeLevel" INTEGER NOT NULL DEFAULT 0,
    "effectMagnitude" DOUBLE PRECISION NOT NULL DEFAULT 1.0,
    "energyCost" INTEGER NOT NULL DEFAULT 5,
    "version" INTEGER NOT NULL DEFAULT 1,
    "source" TEXT,
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "description" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "expansion_chips_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bot_states" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "stateType" TEXT NOT NULL DEFAULT 'worker',
    "energyLevel" INTEGER NOT NULL DEFAULT 100,
    "maintenanceLevel" INTEGER NOT NULL DEFAULT 100,
    "currentLocation" "BotLocation" NOT NULL DEFAULT 'STORAGE',
    "experience" INTEGER NOT NULL DEFAULT 0,
    "statusEffects" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "customizations" JSONB DEFAULT '{}',
    "bondLevel" INTEGER,
    "lastActivity" TIMESTAMP(3),
    "battlesWon" INTEGER DEFAULT 0,
    "battlesLost" INTEGER DEFAULT 0,
    "totalBattles" INTEGER DEFAULT 0,
    "energy" INTEGER NOT NULL DEFAULT 100,
    "maxEnergy" INTEGER NOT NULL DEFAULT 100,
    "health" INTEGER NOT NULL DEFAULT 100,
    "maxHealth" INTEGER NOT NULL DEFAULT 100,
    "level" INTEGER NOT NULL DEFAULT 1,
    "missionsCompleted" INTEGER NOT NULL DEFAULT 0,
    "successRate" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "totalCombatTime" INTEGER NOT NULL DEFAULT 0,
    "damageDealt" INTEGER NOT NULL DEFAULT 0,
    "damageTaken" INTEGER NOT NULL DEFAULT 0,
    "lastActiveAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "version" INTEGER NOT NULL DEFAULT 1,
    "source" TEXT,
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "description" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "bot_states_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bots" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "name" VARCHAR(100) NOT NULL,
    "botType" "BotType" NOT NULL DEFAULT 'WORKER',
    "combatRole" "CombatRole",
    "utilitySpec" "UtilitySpecialization",
    "governmentType" "GovernmentType",
    "soulChipId" TEXT,
    "skeletonId" TEXT NOT NULL,
    "stateId" TEXT NOT NULL,
    "overallRating" DOUBLE PRECISION,
    "buildType" TEXT,
    "version" INTEGER NOT NULL DEFAULT 1,
    "assemblyVersion" INTEGER NOT NULL DEFAULT 1,
    "assemblyDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastModified" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "source" TEXT,
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "description" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "bots_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "slot_assignments" (
    "id" TEXT NOT NULL,
    "slotId" TEXT NOT NULL,
    "partId" TEXT NOT NULL,
    "partName" VARCHAR(100) NOT NULL,
    "partCategory" TEXT NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "metadata" JSONB,
    "configurationId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "slot_assignments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "skeleton_slot_configurations" (
    "id" TEXT NOT NULL,
    "botId" TEXT NOT NULL,
    "skeletonType" "SkeletonType" NOT NULL,
    "lastModified" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "skeleton_slot_configurations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "slot_assignment_history" (
    "id" TEXT NOT NULL,
    "botId" TEXT NOT NULL,
    "operation" TEXT NOT NULL,
    "slotId" TEXT NOT NULL,
    "partId" TEXT,
    "targetSlotId" TEXT,
    "swapWithSlotId" TEXT,
    "previousState" JSONB,
    "newState" JSONB,
    "userId" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "slot_assignment_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "items" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "name" VARCHAR(100) NOT NULL,
    "category" "ItemCategory" NOT NULL,
    "rarity" "Rarity" NOT NULL DEFAULT 'COMMON',
    "description" TEXT NOT NULL,
    "consumable" BOOLEAN NOT NULL DEFAULT true,
    "tradeable" BOOLEAN NOT NULL DEFAULT false,
    "stackable" BOOLEAN NOT NULL DEFAULT true,
    "maxStackSize" INTEGER NOT NULL DEFAULT 999999999,
    "value" INTEGER NOT NULL DEFAULT 1,
    "cooldownTime" INTEGER NOT NULL DEFAULT 0,
    "requirements" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "source" TEXT,
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "effects" JSONB DEFAULT '[]',
    "isProtected" BOOLEAN DEFAULT false,
    "speedUpTarget" "SpeedUpTarget",
    "speedMultiplier" DOUBLE PRECISION,
    "timeReduction" INTEGER,
    "resourceType" "ResourceType",
    "resourceAmount" INTEGER,
    "enhancementType" "ResourceType",
    "enhancementDuration" "EnhancementDuration",
    "statModifiers" JSONB,
    "gemType" "GemType",
    "gemValue" INTEGER,
    "tradeHistory" JSONB DEFAULT '[]',
    "version" INTEGER NOT NULL DEFAULT 1,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_inventory" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "itemId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "acquiredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3),
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_inventory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bot_parts" (
    "id" TEXT NOT NULL,
    "botId" TEXT NOT NULL,
    "partId" TEXT NOT NULL,
    "slotIndex" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "bot_parts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bot_expansion_chips" (
    "id" TEXT NOT NULL,
    "botId" TEXT NOT NULL,
    "expansionChipId" TEXT NOT NULL,
    "slotIndex" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "bot_expansion_chips_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "collections" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "type" "CollectionType" NOT NULL,
    "itemIds" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "shareCode" TEXT,
    "version" INTEGER NOT NULL DEFAULT 1,
    "source" TEXT,
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "collections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "trading_events" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "status" "TradingEventStatus" NOT NULL DEFAULT 'DRAFT',
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "isRepeatable" BOOLEAN NOT NULL DEFAULT false,
    "maxTradesPerUser" INTEGER,
    "priority" INTEGER NOT NULL DEFAULT 0,
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "imageUrl" TEXT,
    "createdBy" TEXT,
    "isPublic" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "trading_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "trade_offers" (
    "id" TEXT NOT NULL,
    "tradingEventId" TEXT NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "status" "TradeOfferStatus" NOT NULL DEFAULT 'ACTIVE',
    "maxTotalTrades" INTEGER,
    "currentTrades" INTEGER NOT NULL DEFAULT 0,
    "maxPerUser" INTEGER,
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "isHighlighted" BOOLEAN NOT NULL DEFAULT false,
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "trade_offers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "trade_offer_items" (
    "id" TEXT NOT NULL,
    "tradeOfferId" TEXT NOT NULL,
    "itemId" TEXT NOT NULL,
    "itemType" "TradeItemType" NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "minLevel" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "trade_offer_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_trade_history" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "tradingEventId" TEXT NOT NULL,
    "tradeOfferId" TEXT NOT NULL,
    "executedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "itemsGiven" JSONB NOT NULL,
    "itemsReceived" JSONB NOT NULL,
    "userLevel" INTEGER,
    "metadata" JSONB,

    CONSTRAINT "user_trade_history_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "sessions_token_key" ON "sessions"("token");

-- CreateIndex
CREATE UNIQUE INDEX "accounts_providerId_accountId_key" ON "accounts"("providerId", "accountId");

-- CreateIndex
CREATE UNIQUE INDEX "verifications_identifier_value_key" ON "verifications"("identifier", "value");

-- CreateIndex
CREATE UNIQUE INDEX "bots_stateId_key" ON "bots"("stateId");

-- CreateIndex
CREATE UNIQUE INDEX "slot_assignments_configurationId_slotId_key" ON "slot_assignments"("configurationId", "slotId");

-- CreateIndex
CREATE UNIQUE INDEX "skeleton_slot_configurations_botId_key" ON "skeleton_slot_configurations"("botId");

-- CreateIndex
CREATE UNIQUE INDEX "user_inventory_userId_itemId_key" ON "user_inventory"("userId", "itemId");

-- CreateIndex
CREATE UNIQUE INDEX "bot_parts_botId_partId_key" ON "bot_parts"("botId", "partId");

-- CreateIndex
CREATE UNIQUE INDEX "bot_parts_botId_slotIndex_key" ON "bot_parts"("botId", "slotIndex");

-- CreateIndex
CREATE UNIQUE INDEX "bot_expansion_chips_botId_expansionChipId_key" ON "bot_expansion_chips"("botId", "expansionChipId");

-- CreateIndex
CREATE UNIQUE INDEX "bot_expansion_chips_botId_slotIndex_key" ON "bot_expansion_chips"("botId", "slotIndex");

-- CreateIndex
CREATE UNIQUE INDEX "collections_shareCode_key" ON "collections"("shareCode");

-- CreateIndex
CREATE UNIQUE INDEX "trade_offer_items_tradeOfferId_itemId_itemType_key" ON "trade_offer_items"("tradeOfferId", "itemId", "itemType");

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "soul_chips" ADD CONSTRAINT "soul_chips_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "skeletons" ADD CONSTRAINT "skeletons_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "parts" ADD CONSTRAINT "parts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "expansion_chips" ADD CONSTRAINT "expansion_chips_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bot_states" ADD CONSTRAINT "bot_states_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bots" ADD CONSTRAINT "bots_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bots" ADD CONSTRAINT "bots_soulChipId_fkey" FOREIGN KEY ("soulChipId") REFERENCES "soul_chips"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bots" ADD CONSTRAINT "bots_skeletonId_fkey" FOREIGN KEY ("skeletonId") REFERENCES "skeletons"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bots" ADD CONSTRAINT "bots_stateId_fkey" FOREIGN KEY ("stateId") REFERENCES "bot_states"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "slot_assignments" ADD CONSTRAINT "slot_assignments_configurationId_fkey" FOREIGN KEY ("configurationId") REFERENCES "skeleton_slot_configurations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "skeleton_slot_configurations" ADD CONSTRAINT "skeleton_slot_configurations_botId_fkey" FOREIGN KEY ("botId") REFERENCES "bots"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "slot_assignment_history" ADD CONSTRAINT "slot_assignment_history_botId_fkey" FOREIGN KEY ("botId") REFERENCES "bots"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "slot_assignment_history" ADD CONSTRAINT "slot_assignment_history_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "items" ADD CONSTRAINT "items_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_inventory" ADD CONSTRAINT "user_inventory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_inventory" ADD CONSTRAINT "user_inventory_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "items"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bot_parts" ADD CONSTRAINT "bot_parts_botId_fkey" FOREIGN KEY ("botId") REFERENCES "bots"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bot_parts" ADD CONSTRAINT "bot_parts_partId_fkey" FOREIGN KEY ("partId") REFERENCES "parts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bot_expansion_chips" ADD CONSTRAINT "bot_expansion_chips_botId_fkey" FOREIGN KEY ("botId") REFERENCES "bots"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bot_expansion_chips" ADD CONSTRAINT "bot_expansion_chips_expansionChipId_fkey" FOREIGN KEY ("expansionChipId") REFERENCES "expansion_chips"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "collections" ADD CONSTRAINT "collections_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trade_offers" ADD CONSTRAINT "trade_offers_tradingEventId_fkey" FOREIGN KEY ("tradingEventId") REFERENCES "trading_events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trade_offer_items" ADD CONSTRAINT "trade_offer_items_tradeOfferId_fkey" FOREIGN KEY ("tradeOfferId") REFERENCES "trade_offers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trade_offer_items" ADD CONSTRAINT "trade_offer_items_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "items"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_trade_history" ADD CONSTRAINT "user_trade_history_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_trade_history" ADD CONSTRAINT "user_trade_history_tradingEventId_fkey" FOREIGN KEY ("tradingEventId") REFERENCES "trading_events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_trade_history" ADD CONSTRAINT "user_trade_history_tradeOfferId_fkey" FOREIGN KEY ("tradeOfferId") REFERENCES "trade_offers"("id") ON DELETE CASCADE ON UPDATE CASCADE;
