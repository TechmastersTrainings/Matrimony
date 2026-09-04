export type UserRole = 'CANDIDATE' | 'MANAGER' | 'MODERATOR' | 'ADMIN' | 'SUPER_ADMIN';
export type AccountStatus = 'PENDING_VERIFICATION' | 'ACTIVE' | 'SUSPENDED' | 'DEACTIVATED' | 'BLOCKED';
export type ProfileStatus = 'DRAFT' | 'SUBMITTED' | 'UNDER_REVIEW' | 'APPROVED' | 'CHANGES_REQUIRED' | 'REJECTED' | 'SUSPENDED';
export type Gender = 'MALE' | 'FEMALE';
export type Denomination = 'METHODIST' | 'CSI' | 'CATHOLIC' | 'BAPTIST' | 'PENTECOSTAL' | 'PROTESTANT' | 'MAR_THOMA' | 'ORTHODOX' | 'OTHER';

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

  denomination?: string;
  sub_denomination?: string;
  church_name?: string;
  parish_or_pastor?: string;
  is_baptized?: boolean;
  is_born_again?: boolean;
  church_activity?: string;

  state?: string;
  district?: string;
  city?: string;
  pincode?: string;
  native_place?: string;
  citizenship?: string;
  residence_type?: string;

  highest_education?: string;
  education_field?: string;
  institution?: string;
  occupation_type?: string;
  occupation_title?: string;
  employed_in?: string;
  annual_income_min?: number;
  annual_income_max?: number;
  annual_income_currency?: string;
  work_location?: string;

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

  diet?: string;
  smoking?: string;
  drinking?: string;
  hobbies?: string;
  bio?: string;
  faith_testimony?: string;
  partner_preferences?: Record<string, any>;
  [key: string]: any;
}

export interface User {
  id: number;
  mobile_number: string;
  email: string;
  role: UserRole;
  account_status: AccountStatus;
  is_mobile_verified: boolean;
  is_email_verified: boolean;
  profile_status?: ProfileStatus;
  created_at: string;
}

export interface ProfilePhotoItem {
  id: number;
  r2_url: string;
  thumbnail_url?: string;
  is_primary: boolean;
  order_index: number;
  status: string;
}

export interface CandidateCard {
  id: number;
  user_id: number;
  first_name: string;
  last_name: string;
  gender: string;
  age?: number;
  dob?: string;
  height_cm?: number;
  marital_status: string;
  denomination: string;
  church_name?: string;
  district: string;
  state: string;
  highest_education?: string;
  occupation_title?: string;
  annual_income_min?: number;
  bio?: string;
  faith_testimony?: string;
  primary_photo?: string;
  mobile_number?: string;
  email?: string;
  status?: string;
  photos_count: number;
  match_score?: number;
}

export interface InterestItem {
  id: number;
  status: 'PENDING' | 'ACCEPTED' | 'DECLINED' | 'CANCELLED';
  message?: string;
  created_at: string;
  responded_at?: string;
  is_sender: boolean;
  other_user: {
    id: number;
    first_name: string;
    last_name: string;
    age?: number;
    denomination: string;
    district: string;
    primary_photo?: string;
  };
}

export interface ChatMessageItem {
  id: number;
  sender_id: number;
  receiver_id: number;
  message_text: string;
  is_read: boolean;
  created_at: string;
  is_me: boolean;
}

export interface SubscriptionPlanItem {
  id: number;
  plan_code: string;
  name: string;
  price_inr: number;
  duration_days: number;
  contact_reveals_limit: number;
  features: string[];
}

export interface VerificationStatusResponse {
  profile_id: number;
  status: ProfileStatus;
  submitted_at?: string;
  approved_at?: string;
  rejection_reason?: string;
  changes_requested_notes?: string;
  photos_count: number;
  has_min_5_photos: boolean;
  automated_checks_passed: boolean;
  flagged_reasons: string[];
  checks_detail: Record<string, boolean>;
}
