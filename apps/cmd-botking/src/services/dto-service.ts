/**
 * DTO Service - Proper integration with @botking/dto
 * This service initializes and provides access to DTO factories and repositories
 */

import { AutoSyncDTOFactory } from "@botking/dto";

class DTOService {
  private static instance: DTOService;
  private autoSyncFactory: AutoSyncDTOFactory | null = null;
  private prisma: any | null = null;

  private constructor() {}

  static getInstance(): DTOService {
    if (!DTOService.instance) {
      DTOService.instance = new DTOService();
    }
    return DTOService.instance;
  }

  async initialize() {
    if (this.autoSyncFactory) {
      return; // Already initialized
    }

    // @ts-ignore - Dynamic import for development
    const { PrismaClient } = await import("@prisma/client");
    this.prisma = new PrismaClient();
    await this.prisma.$connect();

    this.autoSyncFactory = new AutoSyncDTOFactory(this.prisma);
  }

  getAutoSyncFactory(): AutoSyncDTOFactory {
    if (!this.autoSyncFactory) {
      throw new Error("DTOService not initialized. Call initialize() first.");
    }
    return this.autoSyncFactory;
  }

  getPrismaClient(): any {
    if (!this.prisma) {
      throw new Error("DTOService not initialized. Call initialize() first.");
    }
    return this.prisma;
  }

  async getHealthStatus() {
    try {
      await this.initialize();
      if (this.prisma) {
        await this.prisma.$queryRaw`SELECT 1`;
      }
      return {
        isHealthy: true,
        message: "DTO service is healthy",
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        isHealthy: false,
        message: "DTO service is unhealthy",
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      };
    }
  }
}

export const dtoService = DTOService.getInstance();
