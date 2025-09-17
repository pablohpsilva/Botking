/**
 * Example showing how to integrate @botking/logger with other packages
 */

import { createPackageLogger, MonitoringEventType, LogContext } from "../src";

// Simulate different package integrations

// Example 1: Artifact package integration
console.log("=== Artifact Package Integration ===");

class BotArtifact {
  private logger = createPackageLogger("artifact");

  constructor(
    private id: string,
    private name: string
  ) {
    this.logger.info("Bot artifact created", {
      botId: this.id,
      botName: this.name,
      action: "create",
    });
  }

  assemblePart(partId: string): void {
    const context: LogContext = {
      botId: this.id,
      partId,
      action: "assemble_part",
    };

    this.logger.info("Starting part assembly", context);

    try {
      // Simulate assembly process
      const timer = this.logger.startTimer("part_assembly", context);

      // Simulate work
      setTimeout(() => {
        timer();
        this.logger.info("Part assembly completed", context);

        this.logger.trackEvent({
          type: MonitoringEventType.BUSINESS,
          name: "part_assembled",
          data: { botId: this.id, partId },
          timestamp: new Date(),
          severity: "medium",
        });
      }, 50);
    } catch (error) {
      this.logger.error("Part assembly failed", context, error as Error);
      throw error;
    }
  }

  validateBot(): boolean {
    const context: LogContext = {
      botId: this.id,
      action: "validate",
    };

    this.logger.debug("Starting bot validation", context);

    // Simulate validation
    const isValid = Math.random() > 0.2; // 80% success rate

    if (isValid) {
      this.logger.info("Bot validation successful", context);

      this.logger.trackEvent({
        type: MonitoringEventType.BUSINESS,
        name: "bot_validated",
        data: { botId: this.id, result: "valid" },
        timestamp: new Date(),
        severity: "low",
      });
    } else {
      this.logger.error(
        "Bot validation failed",
        context,
        new Error("Validation constraints not met")
      );

      this.logger.trackEvent({
        type: MonitoringEventType.ERROR,
        name: "bot_validation_failed",
        data: { botId: this.id, reason: "constraints_not_met" },
        timestamp: new Date(),
        severity: "high",
      });
    }

    return isValid;
  }
}

// Example 2: Domain package integration
console.log("\n=== Domain Package Integration ===");

class BotAssemblyService {
  private logger = createPackageLogger("domain");

  async validateSlotAssignment(
    botId: string,
    slotId: string,
    partId: string
  ): Promise<boolean> {
    const context: LogContext = {
      botId,
      slotId,
      partId,
      action: "validate_slot_assignment",
    };

    this.logger.debug("Validating slot assignment", context);

    return this.logger.timeAsync(
      "slot_validation",
      async () => {
        // Simulate async validation
        await new Promise((resolve) => setTimeout(resolve, 30));

        const isValid = Math.random() > 0.1; // 90% success rate

        if (!isValid) {
          this.logger.warn("Slot assignment validation failed", {
            ...context,
            reason: "incompatible_part_category",
          });
        } else {
          this.logger.debug("Slot assignment validation passed", context);
        }

        this.logger.trackPerformance({
          operation: "slot_validation",
          duration: 30,
          success: isValid,
          timestamp: new Date(),
          metadata: context,
        });

        return isValid;
      },
      context
    );
  }

  executeSlotAssignment(botId: string, slotId: string, partId: string): void {
    const context: LogContext = {
      botId,
      slotId,
      partId,
      action: "execute_slot_assignment",
    };

    this.logger.info("Executing slot assignment", context);

    try {
      // Simulate assignment logic
      this.logger.verbose("Updating bot configuration", context);
      this.logger.verbose("Recalculating bot stats", context);

      this.logger.info("Slot assignment completed successfully", context);

      this.logger.trackEvent({
        type: MonitoringEventType.BUSINESS,
        name: "slot_assigned",
        data: { botId, slotId, partId },
        timestamp: new Date(),
        severity: "low",
      });
    } catch (error) {
      this.logger.error(
        "Slot assignment execution failed",
        context,
        error as Error
      );
      throw error;
    }
  }
}

// Example 3: DTO package integration
console.log("\n=== DTO Package Integration ===");

class DTOFactory {
  private logger = createPackageLogger("dto");

  createBotDTO(botData: any): any {
    const context: LogContext = {
      botId: botData.id,
      action: "create_bot_dto",
    };

    this.logger.debug("Creating bot DTO", context);

    try {
      // Simulate DTO creation with validation
      this.validateBotData(botData, context);

      const dto = {
        ...botData,
        createdAt: new Date().toISOString(),
      };

      this.logger.info("Bot DTO created successfully", {
        ...context,
        dtoSize: JSON.stringify(dto).length,
      });

      return dto;
    } catch (error) {
      this.logger.error("Bot DTO creation failed", context, error as Error);
      throw error;
    }
  }

  private validateBotData(botData: any, context: LogContext): void {
    this.logger.debug("Validating bot data", context);

    const requiredFields = ["id", "name", "type"];
    const missingFields = requiredFields.filter((field) => !botData[field]);

    if (missingFields.length > 0) {
      this.logger.warn("Bot data validation failed - missing fields", {
        ...context,
        missingFields,
      });

      throw new Error(`Missing required fields: ${missingFields.join(", ")}`);
    }

    this.logger.debug("Bot data validation passed", context);
  }
}

// Example 4: Database package integration
console.log("\n=== Database Package Integration ===");

class DatabaseService {
  private logger = createPackageLogger("db");

  async saveBot(botData: any): Promise<void> {
    const context: LogContext = {
      botId: botData.id,
      action: "save_bot",
    };

    this.logger.info("Saving bot to database", context);

    return this.logger.timeAsync(
      "database_save",
      async () => {
        try {
          // Simulate database operation
          await new Promise((resolve) => setTimeout(resolve, 100));

          // Simulate occasional failures
          if (Math.random() < 0.05) {
            // 5% failure rate
            throw new Error("Database connection timeout");
          }

          this.logger.info("Bot saved successfully", context);

          this.logger.trackEvent({
            type: MonitoringEventType.SYSTEM,
            name: "bot_saved",
            data: {
              botId: botData.id,
              database: "postgres",
              table: "bots",
            },
            timestamp: new Date(),
            severity: "low",
          });
        } catch (error) {
          this.logger.error("Database save failed", context, error as Error);

          this.logger.trackEvent({
            type: MonitoringEventType.ERROR,
            name: "database_save_failed",
            data: {
              botId: botData.id,
              error: (error as Error).message,
            },
            timestamp: new Date(),
            severity: "high",
          });

          throw error;
        }
      },
      context
    );
  }

  async queryBots(filters: any): Promise<any[]> {
    const context: LogContext = {
      action: "query_bots",
      filterCount: Object.keys(filters).length,
    };

    this.logger.debug("Querying bots from database", context);

    return this.logger.timeAsync(
      "database_query",
      async () => {
        // Simulate query
        await new Promise((resolve) => setTimeout(resolve, 75));

        const results = Array.from({ length: 5 }, (_, i) => ({
          id: `bot_${i}`,
          name: `Bot ${i}`,
          type: "WORKER",
        }));

        this.logger.info("Bot query completed", {
          ...context,
          resultCount: results.length,
        });

        return results;
      },
      context
    );
  }
}

// Example usage demonstration
async function demonstrateIntegration() {
  console.log("\n=== Integration Demonstration ===");

  // Create instances
  const botArtifact = new BotArtifact("bot_123", "Test Bot");
  const assemblyService = new BotAssemblyService();
  const dtoFactory = new DTOFactory();
  const dbService = new DatabaseService();

  // Simulate a complete workflow
  try {
    // 1. Assemble parts
    botArtifact.assemblePart("part_456");

    // 2. Validate slot assignment
    const isSlotValid = await assemblyService.validateSlotAssignment(
      "bot_123",
      "ARM_LEFT",
      "part_456"
    );

    if (isSlotValid) {
      // 3. Execute slot assignment
      assemblyService.executeSlotAssignment("bot_123", "ARM_LEFT", "part_456");

      // 4. Validate bot
      const isBotValid = botArtifact.validateBot();

      if (isBotValid) {
        // 5. Create DTO
        const botDTO = dtoFactory.createBotDTO({
          id: "bot_123",
          name: "Test Bot",
          type: "WORKER",
        });

        // 6. Save to database
        await dbService.saveBot(botDTO);

        console.log("Complete workflow successful!");
      }
    }

    // 7. Query some bots
    const bots = await dbService.queryBots({ type: "WORKER" });
    console.log(`Found ${bots.length} bots`);
  } catch (error) {
    console.error("Workflow failed:", error);
  }
}

// Run the demonstration
demonstrateIntegration();

console.log("\n=== Package Integration Examples completed ===");
