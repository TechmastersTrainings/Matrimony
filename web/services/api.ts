import { apiClient } from "../lib/api-client";
import { HealthCheckResponse } from "../types";

export const SystemService = {
  checkHealth: async (): Promise<HealthCheckResponse> => {
    return await apiClient.getHealth();
  },
};
