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

export interface AdminUserItem {
  id: number;
  mobile_number: string;
  email: string;
  account_status: "PENDING_VERIFICATION" | "ACTIVE" | "SUSPENDED" | "DEACTIVATED";
  role: "CANDIDATE" | "MANAGER" | "ADMIN" | "SUPERADMIN";
  is_mobile_verified: boolean;
  is_email_verified: boolean;
  first_name: string;
  last_name: string;
  profile_status: "DRAFT" | "SUBMITTED" | "VERIFIED" | "APPROVED" | "REJECTED";
  completion_percentage: number;
  denomination?: string;
  city?: string;
  created_at: string;
  last_login_at?: string;
}

export interface AdminUsersListResponse {
  total: number;
  skip: number;
  limit: number;
  users: AdminUserItem[];
}
