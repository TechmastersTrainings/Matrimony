export interface HealthCheckResponse {
  status: string;
  app: string;
  environment: string;
  version: string;
  timestamp: string;
  database?: { status: string; message: string };
  redis?: { status: string; message: string };
  storage?: { status: string; message: string };
  [key: string]: any;
}

export interface DashboardMetrics {
  total_users: number;
  active_users: number;
  pending_profiles: number;
  approved_profiles: number;
  rejected_profiles: number;
  active_subscriptions: number;
  total_revenue_inr: number;
  pending_reports: number;
  target_region: string;
}

export interface AdminUserItem {
  id: number;
  mobile_number: string;
  email: string;
  account_status: string;
  role: string;
  first_name: string;
  last_name: string;
  profile_status: string;
  completion_percentage: number;
  denomination?: string;
  city: string;
  created_at: string;
  last_login_at?: string;
}

export interface AdminProfileItem {
  id: number;
  user_id: number;
  name: string;
  gender: string;
  age?: number;
  denomination?: string;
  church_name?: string;
  status: string;
  photos_count: number;
  photos: { id: number; url: string; is_primary: boolean }[];
  submitted_at?: string;
  rejection_reason?: string;
  changes_requested_notes?: string;
}

export interface AdminReportItem {
  id: number;
  reporter_id: number;
  reported_user_id: number;
  report_type: string;
  description: string;
  status: string;
  created_at: string;
}

export interface AuditLogItem {
  id: number;
  admin_user_id?: number;
  action: string;
  target_entity: string;
  target_id: number;
  old_value?: any;
  new_value?: any;
  reason?: string;
  created_at: string;
}

export interface PlatformSettingItem {
  id: number;
  key: string;
  value: any;
  description?: string;
  category: string;
}
