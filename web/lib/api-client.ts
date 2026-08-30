import { APP_CONFIG } from "./config";
import { HealthCheckResponse, MessageResponse, ProfileDraftData, ProfileRegistrationMeResponse, TokenResponse } from "../types";

class ApiClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = APP_CONFIG.apiBaseUrl;
  }

  private getToken(): string | null {
    if (typeof window !== "undefined") {
      return localStorage.getItem("access_token");
    }
    return null;
  }

  public setTokens(access_token: string, refresh_token?: string) {
    if (typeof window !== "undefined") {
      localStorage.setItem("access_token", access_token);
      if (refresh_token) {
        localStorage.setItem("refresh_token", refresh_token);
      }
    }
  }

  public clearTokens() {
    if (typeof window !== "undefined") {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
    }
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = this.getToken();
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(options.headers as Record<string, string> || {}),
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      const errorMsg = data?.error?.message || data?.detail || `API request failed with status ${response.status}`;
      throw new Error(errorMsg);
    }

    return data as T;
  }

  async getHealth(): Promise<HealthCheckResponse> {
    try {
      return await this.request<HealthCheckResponse>("/health");
    } catch {
      return {
        status: "degraded",
        app_name: APP_CONFIG.appName,
        environment: "offline/local",
        version: "1.0.0",
        services: {
          database: { status: "not_configured", message: "API server unreachable" },
          redis: { status: "not_configured", message: "API server unreachable" },
          storage: { status: "not_configured", message: "API server unreachable" },
        },
      };
    }
  }

  // Auth Endpoints
  async register(payload: {
    mobile_number: string;
    email: string;
    password?: string;
    role?: string;
    profile_created_by: string;
    first_name: string;
    last_name: string;
    gender: string;
  }): Promise<MessageResponse> {
    return await this.request<MessageResponse>("/auth/register", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  }

  async sendOtp(target: string, otp_type: string = "REGISTRATION"): Promise<MessageResponse> {
    return await this.request<MessageResponse>("/auth/send-otp", {
      method: "POST",
      body: JSON.stringify({ target, otp_type }),
    });
  }

  async verifyOtp(target: string, otp_code: string, otp_type: string = "REGISTRATION"): Promise<TokenResponse> {
    const data = await this.request<TokenResponse>("/auth/verify-otp", {
      method: "POST",
      body: JSON.stringify({ target, otp_code, otp_type }),
    });
    this.setTokens(data.access_token, data.refresh_token);
    return data;
  }

  async login(payload: { identifier: string; password?: string; otp_code?: string; login_type: string }): Promise<TokenResponse> {
    const data = await this.request<TokenResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    this.setTokens(data.access_token, data.refresh_token);
    return data;
  }

  async logout(): Promise<MessageResponse> {
    try {
      const res = await this.request<MessageResponse>("/auth/logout", { method: "POST" });
      this.clearTokens();
      return res;
    } catch {
      this.clearTokens();
      return { success: true, message: "Logged out locally" };
    }
  }

  // Registration & Profile Draft Endpoints
  async getRegistrationMe(): Promise<ProfileRegistrationMeResponse> {
    return await this.request<ProfileRegistrationMeResponse>("/registration/me");
  }

  async getDraft(): Promise<{ user_id: number; current_step: number; draft_data: ProfileDraftData; last_saved_at: string }> {
    return await this.request("/profile/draft");
  }

  async saveDraft(current_step: number, draft_data: ProfileDraftData): Promise<{ current_step: number; draft_data: ProfileDraftData }> {
    return await this.request("/profile/draft", {
      method: "PUT",
      body: JSON.stringify({ current_step, draft_data }),
    });
  }

  async submitRegistration(confirmed: boolean = true): Promise<any> {
    return await this.request("/registration/submit", {
      method: "POST",
      body: JSON.stringify({ confirmed }),
    });
  }
}

export const apiClient = new ApiClient();
