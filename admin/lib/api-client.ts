import { ADMIN_CONFIG } from "./config";
import { AdminUsersListResponse, HealthCheckResponse } from "../types";

class AdminApiClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = ADMIN_CONFIG.apiBaseUrl;
  }

  async getHealth(): Promise<HealthCheckResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/health`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
      });
      if (!response.ok) {
        throw new Error(`API responded with status: ${response.status}`);
      }
      return await response.json();
    } catch {
      return {
        status: "degraded",
        app_name: ADMIN_CONFIG.portalName,
        environment: "offline/local",
        version: "1.0.0",
        services: {
          database: { status: "not_configured", message: "API server offline" },
          redis: { status: "not_configured", message: "API server offline" },
          storage: { status: "not_configured", message: "API server offline" },
        },
      };
    }
  }

  async getUsers(skip: number = 0, limit: number = 50): Promise<AdminUsersListResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/admin/users?skip=${skip}&limit=${limit}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
      });
      if (!response.ok) {
        throw new Error(`Failed to fetch users: ${response.status}`);
      }
      return await response.json();
    } catch {
      return {
        total: 0,
        skip: 0,
        limit: 50,
        users: [],
      };
    }
  }
}

export const adminApiClient = new AdminApiClient();
