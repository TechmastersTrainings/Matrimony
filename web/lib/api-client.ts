import { APP_CONFIG } from "./config";
import { HealthCheckResponse } from "../types";

class ApiClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = APP_CONFIG.apiBaseUrl;
  }

  async getHealth(): Promise<HealthCheckResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/health`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error(`API responded with status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.warn("Could not fetch API health status:", error);
      return {
        status: "degraded",
        app_name: APP_CONFIG.appName,
        environment: "offline/local",
        version: "1.0.0",
        services: {
          database: { status: "not_configured", message: "API server offline or unreachable" },
          redis: { status: "not_configured", message: "API server offline or unreachable" },
          storage: { status: "not_configured", message: "API server offline or unreachable" },
        },
      };
    }
  }
}

export const apiClient = new ApiClient();
