import {
  AdminProfileItem,
  AdminReportItem,
  AdminUserItem,
  AuditLogItem,
  DashboardMetrics,
  HealthCheckResponse,
  PlatformSettingItem,
} from '../types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

class AdminApiClient {
  private getHeaders(): HeadersInit {
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('admin_access_token');
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }
    return headers;
  }

  async checkHealth(): Promise<HealthCheckResponse> {
    const res = await fetch(`${API_BASE_URL}/health`);
    if (!res.ok) throw new Error('Admin health check failed');
    return res.json();
  }

  async getHealth(): Promise<HealthCheckResponse> {
    return this.checkHealth();
  }

  async getDashboardMetrics(): Promise<DashboardMetrics> {
    const res = await fetch(`${API_BASE_URL}/admin/dashboard`, { headers: this.getHeaders() });
    if (!res.ok) throw new Error('Failed to load dashboard metrics');
    return res.json();
  }

  async listUsers(search?: string, statusFilter?: string): Promise<{ total: number; users: AdminUserItem[] }> {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (statusFilter) params.append('status_filter', statusFilter);
    const res = await fetch(`${API_BASE_URL}/admin/users?${params.toString()}`, { headers: this.getHeaders() });
    if (!res.ok) throw new Error('Failed to load users');
    return res.json();
  }

  async updateUserStatus(userId: number, status: string, reason: string): Promise<any> {
    const res = await fetch(`${API_BASE_URL}/admin/users/${userId}/status`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify({ status, reason }),
    });
    if (!res.ok) throw new Error('Failed to update user status');
    return res.json();
  }

  async listProfiles(statusFilter?: string): Promise<{ total: number; profiles: AdminProfileItem[] }> {
    const params = new URLSearchParams();
    if (statusFilter) params.append('status_filter', statusFilter);
    const res = await fetch(`${API_BASE_URL}/admin/profiles?${params.toString()}`, { headers: this.getHeaders() });
    if (!res.ok) throw new Error('Failed to load profiles');
    return res.json();
  }

  async approveProfile(profileId: number): Promise<any> {
    const res = await fetch(`${API_BASE_URL}/admin/profiles/${profileId}/approve`, {
      method: 'POST',
      headers: this.getHeaders(),
    });
    if (!res.ok) throw new Error('Failed to approve profile');
    return res.json();
  }

  async rejectProfile(profileId: number, reason: string): Promise<any> {
    const res = await fetch(`${API_BASE_URL}/admin/profiles/${profileId}/reject`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ reason }),
    });
    if (!res.ok) throw new Error('Failed to reject profile');
    return res.json();
  }

  async requestChanges(profileId: number, notes: string): Promise<any> {
    const res = await fetch(`${API_BASE_URL}/admin/profiles/${profileId}/request-changes`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ notes }),
    });
    if (!res.ok) throw new Error('Failed to request changes');
    return res.json();
  }

  async deleteProfile(profileId: number, reason?: string): Promise<any> {
    const res = await fetch(`${API_BASE_URL}/admin/profiles/${profileId}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
      body: JSON.stringify({ reason: reason || 'Candidate decommissioned (found match / requested deletion)', delete_user_account: true }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error?.message || err.detail || 'Failed to delete profile');
    }
    return res.json();
  }

  async listReports(): Promise<{ reports: AdminReportItem[] }> {
    const res = await fetch(`${API_BASE_URL}/admin/reports`, { headers: this.getHeaders() });
    if (!res.ok) throw new Error('Failed to load reports');
    return res.json();
  }

  async listAuditLogs(): Promise<{ total: number; logs: AuditLogItem[] }> {
    const res = await fetch(`${API_BASE_URL}/admin/audit-logs`, { headers: this.getHeaders() });
    if (!res.ok) throw new Error('Failed to load audit logs');
    return res.json();
  }

  async listSettings(): Promise<{ settings: PlatformSettingItem[] }> {
    const res = await fetch(`${API_BASE_URL}/admin/settings`, { headers: this.getHeaders() });
    if (!res.ok) throw new Error('Failed to load settings');
    return res.json();
  }

  async saveSetting(key: string, value: any, description?: string): Promise<any> {
    const res = await fetch(`${API_BASE_URL}/admin/settings`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ key, value, description }),
    });
    if (!res.ok) throw new Error('Failed to save setting');
    return res.json();
  }
}

export const adminApiClient = new AdminApiClient();
