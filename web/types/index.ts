export interface ServiceHealth {
  status: "healthy" | "degraded" | "not_configured";
  message: string;
}

export interface HealthCheckResponse {
  status: "healthy" | "degraded";
  app_name: string;
  environment: string;
  version: string;
  services: {
    database: ServiceHealth;
    redis: ServiceHealth;
    storage: ServiceHealth;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    type: string;
    details: Record<string, unknown>;
  };
}
