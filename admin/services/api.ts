import { adminApiClient } from "../lib/api-client";
import { HealthCheckResponse } from "../types";

export const AdminSystemService = {
  checkHealth: async (): Promise<HealthCheckResponse> => {
    return await adminApiClient.getHealth();
  },
};
