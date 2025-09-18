import {
  ArtifactValidator,
  ValidationIssue,
  ValidationSeverity,
} from "./artifact-validator";
import type { IBot } from "../bot/bot-interface";
import { BotType, SkeletonType, PartCategory } from "../types";

/**
 * BotValidator - Concrete implementation of ArtifactValidator for Bot artifacts
 * Validates bot structure, configuration, and business rules
 */
export class BotValidator extends ArtifactValidator<IBot> {
  protected getArtifactType(): string {
    return "Bot";
  }

  protected validateBasicStructure(bot: IBot): ValidationIssue[] {
    const issues: ValidationIssue[] = [];

    // Validate basic properties exist
    if (!bot.id) {
      issues.push(
        this.createIssue(
          ValidationSeverity.ERROR,
          "MISSING_BOT_ID",
          "Bot ID is required",
          "id"
        )
      );
    }

    // Validate bot is an object
    if (typeof bot !== "object" || bot === null) {
      issues.push(
        this.createIssue(
          ValidationSeverity.CRITICAL,
          "INVALID_BOT_STRUCTURE",
          "Bot must be a valid object",
          "bot"
        )
      );
      return issues; // Can't continue validation
    }

    return issues;
  }

  protected validateRequiredFields(bot: IBot): ValidationIssue[] {
    const issues: ValidationIssue[] = [];

    // Validate name
    issues.push(...this.validateStringField(bot.name, "name", 3, 50));

    // Validate bot type
    if (!bot.botType) {
      issues.push(
        this.createIssue(
          ValidationSeverity.ERROR,
          "MISSING_BOT_TYPE",
          "Bot type is required",
          "botType",
          `Choose from: ${Object.values(BotType).join(", ")}`
        )
      );
    } else if (!Object.values(BotType).includes(bot.botType)) {
      issues.push(
        this.createIssue(
          ValidationSeverity.ERROR,
          "INVALID_BOT_TYPE",
          `Invalid bot type: ${bot.botType}`,
          "botType",
          `Use one of: ${Object.values(BotType).join(", ")}`
        )
      );
    }

    // Validate skeleton
    if (!bot.skeleton) {
      issues.push(
        this.createIssue(
          ValidationSeverity.ERROR,
          "MISSING_SKELETON",
          "Bot must have a skeleton",
          "skeleton",
          "Add a skeleton using SkeletonFactory"
        )
      );
    }

    // Validate parts
    if (!bot.parts || !Array.isArray(bot.parts)) {
      issues.push(
        this.createIssue(
          ValidationSeverity.ERROR,
          "MISSING_PARTS",
          "Bot must have parts array",
          "parts",
          "Add parts using PartFactory"
        )
      );
    } else if (bot.parts.length === 0) {
      issues.push(
        this.createIssue(
          ValidationSeverity.WARNING,
          "NO_PARTS",
          "Bot has no parts",
          "parts",
          "Consider adding essential parts (head, torso, arms, legs)"
        )
      );
    }

    // Validate bot state
    if (!bot.state) {
      issues.push(
        this.createIssue(
          ValidationSeverity.ERROR,
          "MISSING_BOT_STATE",
          "Bot must have a state",
          "state",
          "Initialize bot state using BotStateFactory"
        )
      );
    }

    return issues;
  }

  protected validateBusinessRules(bot: IBot): ValidationIssue[] {
    const issues: ValidationIssue[] = [];

    // Validate bot type specific rules
    if (bot.botType) {
      switch (bot.botType) {
        case BotType.WORKER:
          issues.push(...this.validateWorkerBot(bot));
          break;
        case BotType.PLAYABLE:
          issues.push(...this.validatePlayableBot(bot));
          break;
        case BotType.KING:
          issues.push(...this.validateKingBot(bot));
          break;
        case BotType.ROGUE:
          issues.push(...this.validateRogueBot(bot));
          break;
        case BotType.GOVBOT:
          issues.push(...this.validateGovBot(bot));
          break;
      }
    }

    // Validate skeleton-part compatibility
    if (bot.skeleton && bot.parts) {
      issues.push(...this.validateSkeletonPartCompatibility(bot));
    }

    // Validate overall bot assembly
    issues.push(...this.validateBotAssembly(bot));

    return issues;
  }

  protected validatePerformance(bot: IBot): ValidationIssue[] {
    const issues: ValidationIssue[] = [];

    // Check part count vs skeleton capacity
    if (bot.skeleton && bot.parts) {
      if (bot.parts.length > bot.skeleton.slots) {
        issues.push(
          this.createIssue(
            ValidationSeverity.WARNING,
            "TOO_MANY_PARTS",
            `Bot has ${bot.parts.length} parts but skeleton only has ${bot.skeleton.slots} slots`,
            "parts",
            "Reduce parts or use a skeleton with more slots",
            { partCount: bot.parts.length, skeletonSlots: bot.skeleton.slots }
          )
        );
      }
    }

    // Check expansion chip limits
    if (bot.expansionChips && bot.expansionChips.length > 10) {
      issues.push(
        this.createIssue(
          ValidationSeverity.WARNING,
          "MANY_EXPANSION_CHIPS",
          `Bot has ${bot.expansionChips.length} expansion chips`,
          "expansionChips",
          "Consider reducing expansion chips for better performance"
        )
      );
    }

    // Check overall rating
    if ((bot as any).overallRating !== undefined) {
      if ((bot as any).overallRating > 95) {
        issues.push(
          this.createIssue(
            ValidationSeverity.INFO,
            "VERY_HIGH_RATING",
            `Bot has very high rating: ${(bot as any).overallRating}`,
            "overallRating",
            "Ensure rating is balanced for gameplay"
          )
        );
      }
    }

    return issues;
  }

  protected validateCompatibility(bot: IBot): ValidationIssue[] {
    const issues: ValidationIssue[] = [];

    // Validate soul chip compatibility with bot type
    if (bot.soulChip && bot.botType === BotType.WORKER) {
      issues.push(
        this.createIssue(
          ValidationSeverity.WARNING,
          "SOUL_CHIP_ON_WORKER",
          "Worker bots typically don't have soul chips",
          "soulChip",
          "Consider removing soul chip or changing bot type"
        )
      );
    }

    if (
      !bot.soulChip &&
      (bot.botType === BotType.PLAYABLE || bot.botType === BotType.KING)
    ) {
      issues.push(
        this.createIssue(
          ValidationSeverity.WARNING,
          "MISSING_SOUL_CHIP",
          `${bot.botType} bots should have soul chips`,
          "soulChip",
          "Add a soul chip for personality traits"
        )
      );
    }

    // Validate user assignment
    if (
      bot.userId &&
      (bot.botType === BotType.ROGUE || bot.botType === BotType.GOVBOT)
    ) {
      issues.push(
        this.createIssue(
          ValidationSeverity.WARNING,
          "USER_ON_AUTONOMOUS_BOT",
          `${bot.botType} bots are autonomous and shouldn't have users`,
          "userId",
          "Remove user assignment or change bot type"
        )
      );
    }

    if (
      !bot.userId &&
      (bot.botType === BotType.PLAYABLE || bot.botType === BotType.KING)
    ) {
      issues.push(
        this.createIssue(
          ValidationSeverity.ERROR,
          "MISSING_USER",
          `${bot.botType} bots must have a user assigned`,
          "userId",
          "Assign a user ID"
        )
      );
    }

    return issues;
  }

  // Bot type specific validation methods

  private validateWorkerBot(bot: IBot): ValidationIssue[] {
    const issues: ValidationIssue[] = [];

    // Workers should have utility specialization
    if (!bot.utilitySpec) {
      issues.push(
        this.createIssue(
          ValidationSeverity.INFO,
          "WORKER_NO_SPECIALIZATION",
          "Worker bot has no utility specialization",
          "utilitySpec",
          "Consider adding utility specialization for better functionality"
        )
      );
    }

    // Workers should not have combat roles
    if (bot.combatRole) {
      issues.push(
        this.createIssue(
          ValidationSeverity.WARNING,
          "WORKER_WITH_COMBAT_ROLE",
          "Worker bot has combat role",
          "combatRole",
          "Workers typically don't need combat roles"
        )
      );
    }

    return issues;
  }

  private validatePlayableBot(bot: IBot): ValidationIssue[] {
    const issues: ValidationIssue[] = [];

    // Playable bots should have combat roles
    if (!bot.combatRole) {
      issues.push(
        this.createIssue(
          ValidationSeverity.INFO,
          "PLAYABLE_NO_COMBAT_ROLE",
          "Playable bot has no combat role",
          "combatRole",
          "Consider adding combat role for battle mechanics"
        )
      );
    }

    return issues;
  }

  private validateKingBot(bot: IBot): ValidationIssue[] {
    const issues: ValidationIssue[] = [];

    // King bots should have high rarity components
    if (bot.skeleton && bot.skeleton.rarity === "COMMON") {
      issues.push(
        this.createIssue(
          ValidationSeverity.WARNING,
          "KING_COMMON_SKELETON",
          "King bot has common skeleton",
          "skeleton",
          "Consider using higher rarity skeleton for king bots"
        )
      );
    }

    if (bot.soulChip && bot.soulChip.rarity === "COMMON") {
      issues.push(
        this.createIssue(
          ValidationSeverity.WARNING,
          "KING_COMMON_SOUL_CHIP",
          "King bot has common soul chip",
          "soulChip",
          "Consider using higher rarity soul chip for king bots"
        )
      );
    }

    return issues;
  }

  private validateRogueBot(bot: IBot): ValidationIssue[] {
    const issues: ValidationIssue[] = [];

    // Rogue bots should have combat capabilities
    if (!bot.combatRole && (!bot.parts || bot.parts.length === 0)) {
      issues.push(
        this.createIssue(
          ValidationSeverity.WARNING,
          "ROGUE_NO_COMBAT",
          "Rogue bot has no combat capabilities",
          "combatRole",
          "Add combat role or combat parts for rogue functionality"
        )
      );
    }

    return issues;
  }

  private validateGovBot(bot: IBot): ValidationIssue[] {
    const issues: ValidationIssue[] = [];

    // Government bots should have government type
    if (!bot.governmentType) {
      issues.push(
        this.createIssue(
          ValidationSeverity.WARNING,
          "GOVBOT_NO_TYPE",
          "Government bot has no government type",
          "governmentType",
          "Add government type for proper functionality"
        )
      );
    }

    return issues;
  }

  private validateSkeletonPartCompatibility(bot: IBot): ValidationIssue[] {
    const issues: ValidationIssue[] = [];

    if (!bot.skeleton || !bot.parts) return issues;

    // Check if skeleton can support all parts
    const totalParts = bot.parts.length;
    const availableSlots = bot.skeleton.slots;

    if (totalParts > availableSlots) {
      issues.push(
        this.createIssue(
          ValidationSeverity.ERROR,
          "INSUFFICIENT_SKELETON_SLOTS",
          `Skeleton has ${availableSlots} slots but bot has ${totalParts} parts`,
          "skeleton",
          "Use skeleton with more slots or reduce parts"
        )
      );
    }

    // Check part category distribution
    const partCounts = new Map<PartCategory, number>();
    bot.parts.forEach((part) => {
      partCounts.set(part.category, (partCounts.get(part.category) || 0) + 1);
    });

    // Validate essential parts
    if (!partCounts.has(PartCategory.HEAD)) {
      issues.push(
        this.createIssue(
          ValidationSeverity.WARNING,
          "MISSING_HEAD_PART",
          "Bot has no head part",
          "parts",
          "Consider adding a head part"
        )
      );
    }

    if (!partCounts.has(PartCategory.TORSO)) {
      issues.push(
        this.createIssue(
          ValidationSeverity.WARNING,
          "MISSING_TORSO_PART",
          "Bot has no torso part",
          "parts",
          "Consider adding a torso part"
        )
      );
    }

    return issues;
  }

  private validateBotAssembly(bot: IBot): ValidationIssue[] {
    const issues: ValidationIssue[] = [];

    // Check overall assembly coherence
    if (bot.skeleton && bot.parts && bot.soulChip) {
      // Check rarity consistency
      const skeletonRarity = bot.skeleton.rarity;
      const soulChipRarity = bot.soulChip.rarity;

      // High rarity soul chips should have high rarity skeletons
      if (soulChipRarity === "LEGENDARY" && skeletonRarity === "COMMON") {
        issues.push(
          this.createIssue(
            ValidationSeverity.INFO,
            "RARITY_MISMATCH",
            "Legendary soul chip with common skeleton",
            "assembly",
            "Consider upgrading skeleton to match soul chip quality"
          )
        );
      }
    }

    // Check bot state consistency
    if (bot.state && bot.botType) {
      if (
        bot.botType === BotType.WORKER &&
        (bot.state as any).bondLevel !== undefined
      ) {
        issues.push(
          this.createIssue(
            ValidationSeverity.WARNING,
            "WORKER_BOND_LEVEL",
            "Worker bot has bond level (non-worker trait)",
            "state",
            "Use appropriate state for worker bots"
          )
        );
      }
    }

    return issues;
  }
}
