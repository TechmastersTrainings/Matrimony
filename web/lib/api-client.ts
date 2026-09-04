import {
  CandidateCard,
  ChatMessageItem,
  HealthCheckResponse,
  InterestItem,
  ProfilePhotoItem,
  SubscriptionPlanItem,
  VerificationStatusResponse,
} from '../types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

class ApiClient {
  private getHeaders(isFormData = false): HeadersInit {
    const headers: Record<string, string> = {};
    if (!isFormData) {
      headers['Content-Type'] = 'application/json';
    }
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('access_token');
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }
    return headers;
  }

  async getHealth(): Promise<HealthCheckResponse> {
    const res = await fetch(`${API_BASE_URL}/health`);
    if (!res.ok) throw new Error('Health check failed');
    return res.json();
  }

  // ------------------ AUTH & REGISTRATION ------------------
  async register(data: any): Promise<any> {
    const res = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });
    const resData = await res.json();
    if (!res.ok) throw new Error(resData.error?.message || 'Registration failed');
    return resData;
  }

  async sendOtp(target: string, otpType = 'REGISTRATION'): Promise<any> {
    const res = await fetch(`${API_BASE_URL}/auth/send-otp`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ target, otp_type: otpType }),
    });
    const resData = await res.json();
    if (!res.ok) throw new Error(resData.error?.message || 'Failed to send OTP');
    return resData;
  }

  async verifyOtp(target: string, otpCode: string, otpType = 'REGISTRATION'): Promise<any> {
    const res = await fetch(`${API_BASE_URL}/auth/verify-otp`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ target, otp_code: otpCode, otp_type: otpType }),
    });
    const resData = await res.json();
    if (!res.ok) throw new Error(resData.error?.message || 'Verification failed');
    if (typeof window !== 'undefined' && resData.access_token) {
      localStorage.setItem('access_token', resData.access_token);
      if (resData.refresh_token) localStorage.setItem('refresh_token', resData.refresh_token);
    }
    return resData;
  }

  async login(payload: any): Promise<any> {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(payload),
    });
    const resData = await res.json();
    if (!res.ok) throw new Error(resData.error?.message || 'Login failed');
    if (typeof window !== 'undefined' && resData.access_token) {
      localStorage.setItem('access_token', resData.access_token);
      if (resData.refresh_token) localStorage.setItem('refresh_token', resData.refresh_token);
      if (resData.role) localStorage.setItem('user_role', resData.role);
    }
    return resData;
  }

  async logout(): Promise<void> {
    try {
      if (typeof window !== 'undefined') {
        const refresh = localStorage.getItem('refresh_token');
        if (refresh) {
          await fetch(`${API_BASE_URL}/auth/logout`, {
            method: 'POST',
            headers: this.getHeaders(),
            body: JSON.stringify({ refresh_token: refresh }),
          });
        }
      }
    } catch {
      // Ignored
    } finally {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
      }
    }
  }

  async getMe(): Promise<any> {
    const res = await fetch(`${API_BASE_URL}/registration/me`, {
      headers: this.getHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch user state');
    return res.json();
  }

  async getRegistrationMe(): Promise<any> {
    return this.getMe();
  }

  async getDraft(): Promise<any> {
    const res = await fetch(`${API_BASE_URL}/profile/draft`, {
      headers: this.getHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch draft');
    return res.json();
  }

  async saveDraft(step: number, draftData: Record<string, any>): Promise<any> {
    const res = await fetch(`${API_BASE_URL}/profile/draft`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify({ current_step: step, draft_data: draftData }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error?.message || 'Failed to save draft');
    return data;
  }

  async submitProfile(confirmed = true): Promise<any> {
    const res = await fetch(`${API_BASE_URL}/registration/submit`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ confirmed }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error?.message || 'Failed to submit profile');
    return data;
  }

  async submitRegistration(confirmed = true): Promise<any> {
    return this.submitProfile(confirmed);
  }

  // ------------------ PHOTOS ------------------
  async uploadPhoto(file: File, isPrimary = false): Promise<ProfilePhotoItem> {
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch(`${API_BASE_URL}/photos/upload?is_primary=${isPrimary}`, {
      method: 'POST',
      headers: this.getHeaders(true),
      body: formData,
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error?.message || 'Photo upload failed');
    return data;
  }

  async getMyPhotos(): Promise<{ photos: ProfilePhotoItem[]; count: number; has_min_5: boolean }> {
    const res = await fetch(`${API_BASE_URL}/photos/my`, {
      headers: this.getHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch photos');
    return res.json();
  }

  async setPrimaryPhoto(photoId: number): Promise<void> {
    const res = await fetch(`${API_BASE_URL}/photos/${photoId}/primary`, {
      method: 'PUT',
      headers: this.getHeaders(),
    });
    if (!res.ok) throw new Error('Failed to set primary photo');
  }

  async deletePhoto(photoId: number): Promise<void> {
    const res = await fetch(`${API_BASE_URL}/photos/${photoId}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });
    if (!res.ok) throw new Error('Failed to delete photo');
  }

  // ------------------ VERIFICATION ------------------
  async getVerificationStatus(): Promise<VerificationStatusResponse> {
    const res = await fetch(`${API_BASE_URL}/verification/status`, {
      headers: this.getHeaders(),
    });
    if (!res.ok) throw new Error('Failed to get verification status');
    return res.json();
  }

  // ------------------ DISCOVERY ------------------
  async searchProfiles(params: Record<string, any> = {}): Promise<{ total: number; profiles: CandidateCard[] }> {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '') {
        searchParams.append(key, String(val));
      }
    });
    const res = await fetch(`${API_BASE_URL}/discovery/search?${searchParams.toString()}`, {
      headers: this.getHeaders(),
    });
    if (!res.ok) throw new Error('Failed to search profiles');
    return res.json();
  }

  async getCandidateProfile(id: number): Promise<CandidateCard & Record<string, any>> {
    const res = await fetch(`${API_BASE_URL}/discovery/profiles/${id}`, {
      headers: this.getHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch candidate profile');
    return res.json();
  }

  // ------------------ INTERESTS ------------------
  async sendInterest(targetUserId: number, message?: string): Promise<any> {
    const res = await fetch(`${API_BASE_URL}/interests/send`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ target_user_id: targetUserId, message }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error?.message || 'Failed to send interest');
    return data;
  }

  async respondInterest(interestId: number, accept: boolean): Promise<any> {
    const res = await fetch(`${API_BASE_URL}/interests/${interestId}/respond`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ accept }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error?.message || 'Failed to respond to interest');
    return data;
  }

  async getInterests(tab: 'received' | 'sent' | 'matches'): Promise<{ items: InterestItem[]; count: number }> {
    const res = await fetch(`${API_BASE_URL}/interests?tab=${tab}`, {
      headers: this.getHeaders(),
    });
    if (!res.ok) throw new Error('Failed to get interests');
    return res.json();
  }

  // ------------------ CHAT ------------------
  async getConversations(): Promise<any[]> {
    const res = await fetch(`${API_BASE_URL}/chat/conversations`, {
      headers: this.getHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch conversations');
    const data = await res.json();
    return data.conversations;
  }

  async getChatHistory(otherUserId: number): Promise<ChatMessageItem[]> {
    const res = await fetch(`${API_BASE_URL}/chat/${otherUserId}`, {
      headers: this.getHeaders(),
    });
    if (!res.ok) throw new Error('Failed to get chat messages');
    const data = await res.json();
    return data.messages;
  }

  async sendMessage(otherUserId: number, text: string): Promise<ChatMessageItem> {
    const res = await fetch(`${API_BASE_URL}/chat/${otherUserId}`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ message_text: text }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error?.message || 'Failed to send message');
    return data;
  }

  // ------------------ SUBSCRIPTIONS & PAYMENTS ------------------
  async getPlans(): Promise<SubscriptionPlanItem[]> {
    const res = await fetch(`${API_BASE_URL}/subscriptions/plans`);
    if (!res.ok) throw new Error('Failed to fetch plans');
    const data = await res.json();
    return data.plans;
  }

  async createSubscriptionOrder(planId: number): Promise<any> {
    const res = await fetch(`${API_BASE_URL}/subscriptions/create-order`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ plan_id: planId }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error?.message || 'Failed to create order');
    return data;
  }

  async verifyPayment(orderId: string, paymentId: string, signature: string): Promise<any> {
    const res = await fetch(`${API_BASE_URL}/subscriptions/verify-payment`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({
        order_id: orderId,
        razorpay_order_id: orderId,
        gateway_payment_id: paymentId,
        razorpay_payment_id: paymentId,
        gateway_signature: signature,
        razorpay_signature: signature,
      }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error?.message || data.detail || 'Payment verification failed');
    return data;
  }

  // ------------------ CONTACT REVEAL ------------------
  async requestContactReveal(targetUserId: number): Promise<any> {
    const res = await fetch(`${API_BASE_URL}/contact-reveal/request/${targetUserId}`, {
      method: 'POST',
      headers: this.getHeaders(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error?.message || 'Failed to request contact reveal');
    return data;
  }

  async getContactDetails(targetUserId: number): Promise<any> {
    const res = await fetch(`${API_BASE_URL}/contact-reveal/${targetUserId}`, {
      headers: this.getHeaders(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error?.message || 'Contact reveal not completed or paid');
    return data;
  }
}

export const apiClient = new ApiClient();
