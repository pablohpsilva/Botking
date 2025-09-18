/**
 * Application Service - Mock implementation for application health
 */

export class ApplicationService {
  static async getHealthStatus() {
    return {
      isHealthy: true,
      message: "Application is running",
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      version: "1.0.0",
    };
  }
}
