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

export interface TodaysOperationsMetrics {
  new_registrations: number;
  auto_approved: number;
  need_verification: number;
  high_risk: number;
  reports_received: number;
  pending_investigations: number;
  fake_profiles_detected: number;
  profiles_suspended: number;
  photo_verification_queue: number;
  id_verification_queue: number;
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
  todays_operations?: TodaysOperationsMetrics;
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
  first_name?: string;
  last_name?: string;
  mobile_number: string;
  email: string;
  gender: string;
  dob?: string;
  age?: number;
  marital_status?: string;
  height_cm?: number;
  physical_status?: string;
  mother_tongue?: string;
  denomination?: string;
  sub_denomination?: string;
  church_name?: string;
  parish_or_pastor?: string;
  is_baptized?: boolean;
  faith_testimony?: string;
  highest_education?: string;
  occupation_title?: string;
  employed_in?: string;
  annual_income_min?: number;
  work_location?: string;
  father_name?: string;
  father_occupation?: string;
  mother_name?: string;
  mother_occupation?: string;
  family_status?: string;
  family_values?: string;
  native_place?: string;
  district?: string;
  state?: string;
  pincode?: string;
  bio?: string;
  partner_preferences?: any;
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
