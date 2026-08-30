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

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
  user_id: number;
  role: string;
  account_status: string;
  is_mobile_verified: boolean;
  is_email_verified: boolean;
  profile_status: string;
}

export interface MessageResponse {
  success: boolean;
  message: string;
  debug_otp?: string;
}

export interface ProfileDraftData {
  first_name?: string;
  last_name?: string;
  gender?: string;
  dob?: string;
  age?: number;
  marital_status?: string;
  height_cm?: number;
  weight_kg?: number;
  physical_status?: string;
  mother_tongue?: string;

  // Faith
  denomination?: string;
  sub_denomination?: string;
  church_name?: string;
  parish_or_pastor?: string;
  is_baptized?: boolean;
  is_born_again?: boolean;
  church_activity?: string;

  // Location
  state?: string;
  district?: string;
  city?: string;
  pincode?: string;
  native_place?: string;

  // Education & Career
  highest_education?: string;
  education_field?: string;
  institution?: string;
  occupation_type?: string;
  occupation_title?: string;
  employed_in?: string;
  annual_income_min?: number;
  annual_income_max?: number;
  work_location?: string;

  // Family
  father_name?: string;
  father_occupation?: string;
  mother_name?: string;
  mother_occupation?: string;
  family_status?: string;
  family_values?: string;
  brothers_count?: number;
  married_brothers_count?: number;
  sisters_count?: number;
  married_sisters_count?: number;
  about_family?: string;

  // Lifestyle & About
  diet?: string;
  smoking?: string;
  drinking?: string;
  hobbies?: string;
  bio?: string;
  faith_testimony?: string;

  // Partner Preferences
  partner_preferences?: {
    age_min?: number;
    age_max?: number;
    height_min_cm?: number;
    height_max_cm?: number;
    denomination?: string[];
    marital_status?: string[];
    education?: string[];
    occupation?: string[];
  };
}

export interface ProfileRegistrationMeResponse {
  user_id: number;
  mobile_number: string;
  email: string;
  account_status: string;
  role: string;
  is_mobile_verified: boolean;
  is_email_verified: boolean;
  current_step: number;
  completion_percentage: number;
  profile_status: string;
  draft?: {
    user_id: number;
    current_step: number;
    draft_data: ProfileDraftData;
    last_saved_at: string;
  };
}
