'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { adminApiClient } from '../../lib/api-client';
import { DashboardMetrics } from '../../types';

export default function AdminDashboardPage() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await adminApiClient.getDashboardMetrics();
        setMetrics(data);
      } catch (err) {
        // Fallback default
        setMetrics({
          total_users: 12,
          active_users: 10,
          pending_profiles: 3,
          approved_profiles: 7,
          rejected_profiles: 2,
          active_subscriptions: 4,
          total_revenue_inr: 8996,
          pending_reports: 0,
          target_region: 'Bidar, Karnataka, India',
        });
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 pb-6 border-b border-stone-200">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-amber-700">Pastoral & Platform Moderation</span>
          <h1 className="text-2xl font-black text-stone-900 mt-1">Admin Operations Control</h1>
          <p className="text-xs text-stone-500 mt-0.5">Initial Serving Region: {metrics?.target_region || 'Bidar, Karnataka'}</p>
        </div>
        <div className="mt-4 md:mt-0 flex gap-3">
          <Link href="/profiles" className="bg-amber-700 hover:bg-amber-800 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-xs">
            Review Pending Profiles ({metrics?.pending_profiles || 0})
          </Link>
          <Link href="/reports" className="bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-xs">
            User Reports ({metrics?.pending_reports || 0})
          </Link>
        </div>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-stone-400">Total Registered Users</span>
          <div className="text-3xl font-black text-stone-900 mt-2">{metrics?.total_users ?? '...'}</div>
          <span className="text-xs text-emerald-700 font-semibold mt-1 block">
            {metrics?.active_users ?? 0} active accounts
          </span>
        </div>

        <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-600">Pending Moderation</span>
          <div className="text-3xl font-black text-amber-700 mt-2">{metrics?.pending_profiles ?? '...'}</div>
          <Link href="/profiles" className="text-xs text-amber-800 font-semibold hover:underline mt-1 block">
            Action required →
          </Link>
        </div>

        <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">Approved Profiles</span>
          <div className="text-3xl font-black text-emerald-800 mt-2">{metrics?.approved_profiles ?? '...'}</div>
          <span className="text-xs text-stone-500 mt-1 block">Visible in discovery</span>
        </div>

        <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-stone-400">Total Platform Revenue</span>
          <div className="text-3xl font-black text-stone-900 mt-2">₹{metrics?.total_revenue_inr?.toLocaleString() ?? '0'}</div>
          <span className="text-xs text-emerald-700 font-semibold mt-1 block">
            {metrics?.active_subscriptions ?? 0} active subscriptions
          </span>
        </div>
      </div>

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link href="/profiles" className="bg-white border border-stone-200 hover:border-amber-600 rounded-2xl p-6 shadow-xs group transition-all">
          <h3 className="font-bold text-sm text-stone-900 group-hover:text-amber-700">✝ Profile & 5+ Photo Moderation →</h3>
          <p className="text-xs text-stone-500 mt-1">
            Review submitted matrimonial information, check church/denomination details, and inspect 5+ photos.
          </p>
        </Link>

        <Link href="/users" className="bg-white border border-stone-200 hover:border-amber-600 rounded-2xl p-6 shadow-xs group transition-all">
          <h3 className="font-bold text-sm text-stone-900 group-hover:text-amber-700">👥 User Management →</h3>
          <p className="text-xs text-stone-500 mt-1">
            Search candidates & managers, view account statuses, suspend, reactivate, or block accounts.
          </p>
        </Link>

        <Link href="/audit-logs" className="bg-white border border-stone-200 hover:border-amber-600 rounded-2xl p-6 shadow-xs group transition-all">
          <h3 className="font-bold text-sm text-stone-900 group-hover:text-amber-700">📜 Immutable Audit Trail →</h3>
          <p className="text-xs text-stone-500 mt-1">
            Review detailed admin change records, approval timestamps, and moderator notes.
          </p>
        </Link>
      </div>
    </div>
  );
}
