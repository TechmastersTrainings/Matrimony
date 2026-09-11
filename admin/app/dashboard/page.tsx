'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { adminApiClient } from '../../lib/api-client';
import { DashboardMetrics } from '../../types';

export default function AdminDashboardPage() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string>('');

  const loadMetrics = async () => {
    try {
      setRefreshing(true);
      const data = await adminApiClient.getDashboardMetrics();
      setMetrics(data);
      setLastUpdated(new Date().toLocaleTimeString());
    } catch (err) {
      console.error('Failed to load live database metrics:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadMetrics();
  }, []);

  const ops = metrics?.todays_operations || {
    new_registrations: 0,
    auto_approved: 0,
    need_verification: 0,
    high_risk: 0,
    reports_received: 0,
    pending_investigations: 0,
    fake_profiles_detected: 0,
    profiles_suspended: 0,
    photo_verification_queue: 0,
    id_verification_queue: 0,
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 text-[#1e1b18] space-y-8 font-sans">
      {/* 1. Header & Live Telemetry Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-charcoal-200/80">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-50 border border-cyan-200 text-cyan-950 text-xs font-bold uppercase tracking-wider shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
            <span>CovenantNest Administration &amp; Operations</span>
            <span className="text-orange-400 font-bold">•</span>
            <span className="text-emerald-800 font-bold bg-emerald-100 px-2 py-0.5 rounded-md text-[11px]">
              Super Admin Active
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-brand">
            Today&apos;s Operations Command
          </h1>
          <p className="text-sm sm:text-base text-slate-600">
            Real-time candidate registrations, church moderation queues, and safety metrics from live database.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={loadMetrics}
            disabled={refreshing}
            className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold border border-slate-200 transition-all shadow-2xs flex items-center gap-2"
          >
            <span className={refreshing ? 'animate-spin' : ''}>🔄</span>
            <span>{refreshing ? 'Refreshing...' : 'Refresh Database'}</span>
            {lastUpdated && <span className="text-[10px] text-slate-500">({lastUpdated})</span>}
          </button>

          <Link
            href="/profiles?status_filter=SUBMITTED"
            className="bg-gradient-to-r from-cyan-700 to-teal-700 hover:from-cyan-600 hover:to-teal-600 text-white text-xs font-extrabold px-5 py-2.5 rounded-xl shadow-sm transition-all transform hover:-translate-y-0.5 flex items-center gap-2"
          >
            <span>Review Pending Moderation</span>
            <span className="bg-white/20 px-2 py-0.5 rounded-md font-mono text-[11px]">
              {ops.need_verification}
            </span>
          </Link>
        </div>
      </div>

      {/* 2. Compact Primary KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-5">
        {/* KPI 1 - Cyan Theme */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-cyan-50/90 to-cyan-100/30 border border-cyan-200 shadow-2xs space-y-1">
          <span className="text-xs font-mono font-bold text-cyan-800 uppercase tracking-widest block">
            Registered Users
          </span>
          <div className="text-3xl font-extrabold text-cyan-950 font-brand">
            {loading ? '...' : metrics?.total_users ?? 0}
          </div>
          <span className="text-xs text-cyan-900/80 font-medium block">
            {metrics?.active_users ?? 0} Active Member Accounts
          </span>
        </div>

        {/* KPI 2 - Emerald Theme */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-50/90 to-emerald-100/30 border border-emerald-200 shadow-2xs space-y-1">
          <span className="text-xs font-mono font-bold text-emerald-800 uppercase tracking-widest block">
            Approved Profiles
          </span>
          <div className="text-3xl font-extrabold text-emerald-950 font-brand">
            {loading ? '...' : metrics?.approved_profiles ?? 0}
          </div>
          <span className="text-xs text-emerald-900/80 font-medium block">
            Published Live on Discovery
          </span>
        </div>

        {/* KPI 3 - Light Orange Theme */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-orange-50/90 to-amber-100/30 border border-orange-200 shadow-2xs space-y-1">
          <span className="text-xs font-mono font-bold text-orange-800 uppercase tracking-widest block">
            Active Subscriptions
          </span>
          <div className="text-3xl font-extrabold text-orange-950 font-brand">
            {loading ? '...' : metrics?.active_subscriptions ?? 0}
          </div>
          <span className="text-xs text-orange-900/80 font-medium block">
            ₹{loading ? '...' : (metrics?.total_revenue_inr?.toLocaleString() ?? '0')} Platform Revenue
          </span>
        </div>

        {/* KPI 4 - Rose Theme */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-rose-50/90 to-pink-100/30 border border-rose-200 shadow-2xs space-y-1">
          <span className="text-xs font-mono font-bold text-rose-800 uppercase tracking-widest block">
            Pending Moderation
          </span>
          <div className="text-3xl font-extrabold text-rose-950 font-brand">
            {loading ? '...' : metrics?.pending_profiles ?? ops.need_verification}
          </div>
          <span className="text-xs text-rose-900/80 font-medium block">
            {ops.need_verification === 0 ? 'All Profiles Verified' : 'Action Required'}
          </span>
        </div>
      </div>

      {/* 3. TODAY'S OPERATIONS: 3 Pure Database Operational Panels */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h2 className="text-xl font-bold font-brand text-slate-900 tracking-tight">
              Operational Statistics (Live Database)
            </h2>
            <p className="text-xs text-slate-500">
              Direct count of member accounts, verification stages, and open moderation tickets.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Panel A: Registration & Verification Flow */}
          <div className="bg-white border border-[#ece2d1] hover:border-cyan-400 rounded-3xl p-6 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#ece2d1]">
                <span className="text-xs font-extrabold text-cyan-900 uppercase tracking-wider flex items-center gap-1.5">
                  <span>📋</span>
                  <span>Registration &amp; Verification</span>
                </span>
                <span className="text-[10px] font-mono font-bold text-cyan-800 bg-cyan-50 border border-cyan-200 px-2 py-0.5 rounded-full">
                  Live
                </span>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs py-1 border-b border-slate-100">
                  <span className="text-slate-600 font-medium">New registrations</span>
                  <span className="text-base font-extrabold text-slate-900 font-mono">
                    {loading ? '...' : ops.new_registrations.toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs py-1 border-b border-slate-100">
                  <span className="text-slate-600 font-medium">Auto-approved</span>
                  <span className="text-base font-extrabold text-emerald-700 font-mono">
                    {loading ? '...' : ops.auto_approved.toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs py-1 border-b border-slate-100">
                  <span className="text-slate-600 font-medium">Need verification</span>
                  <span className="text-base font-extrabold text-orange-600 font-mono">
                    {loading ? '...' : ops.need_verification.toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs py-1">
                  <span className="text-slate-600 font-medium">High-risk profiles</span>
                  <span className="text-base font-extrabold text-rose-600 font-mono">
                    {loading ? '...' : ops.high_risk.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-[#ece2d1]">
              <Link
                href="/profiles?status_filter=SUBMITTED"
                className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl bg-cyan-50 hover:bg-cyan-100 text-cyan-950 border border-cyan-200 text-xs font-bold transition-all shadow-2xs"
              >
                <span>Inspect Verification Queue</span>
                <span>→</span>
              </Link>
            </div>
          </div>

          {/* Panel B: Safety & Investigations */}
          <div className="bg-white border border-[#ece2d1] hover:border-rose-400 rounded-3xl p-6 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#ece2d1]">
                <span className="text-xs font-extrabold text-rose-900 uppercase tracking-wider flex items-center gap-1.5">
                  <span>🛡️</span>
                  <span>Safety &amp; Investigations</span>
                </span>
                <span className="text-[10px] font-mono font-bold text-rose-800 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-full">
                  Live
                </span>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs py-1 border-b border-slate-100">
                  <span className="text-slate-600 font-medium">Reports received</span>
                  <span className="text-base font-extrabold text-slate-900 font-mono">
                    {loading ? '...' : ops.reports_received.toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs py-1 border-b border-slate-100">
                  <span className="text-slate-600 font-medium">Pending investigations</span>
                  <span className="text-base font-extrabold text-orange-600 font-mono">
                    {loading ? '...' : ops.pending_investigations.toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs py-1 border-b border-slate-100">
                  <span className="text-slate-600 font-medium">Fake profiles detected</span>
                  <span className="text-base font-extrabold text-rose-600 font-mono">
                    {loading ? '...' : ops.fake_profiles_detected.toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs py-1">
                  <span className="text-slate-600 font-medium">Profiles suspended</span>
                  <span className="text-base font-extrabold text-slate-700 font-mono">
                    {loading ? '...' : ops.profiles_suspended.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-[#ece2d1]">
              <Link
                href="/reports"
                className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-950 border border-rose-200 text-xs font-bold transition-all shadow-2xs"
              >
                <span>Manage Safety Reports</span>
                <span>→</span>
              </Link>
            </div>
          </div>

          {/* Panel C: Verification Queues */}
          <div className="bg-white border border-[#ece2d1] hover:border-emerald-400 rounded-3xl p-6 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#ece2d1]">
                <span className="text-xs font-extrabold text-emerald-900 uppercase tracking-wider flex items-center gap-1.5">
                  <span>⛪</span>
                  <span>Church &amp; Photo Queues</span>
                </span>
                <span className="text-[10px] font-mono font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                  Live
                </span>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs py-1 border-b border-slate-100">
                  <span className="text-slate-600 font-medium">Photo verification queue</span>
                  <span className="text-base font-extrabold text-orange-600 font-mono">
                    {loading ? '...' : ops.photo_verification_queue.toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs py-1 border-b border-slate-100">
                  <span className="text-slate-600 font-medium">ID verification queue</span>
                  <span className="text-base font-extrabold text-cyan-700 font-mono">
                    {loading ? '...' : ops.id_verification_queue.toLocaleString()}
                  </span>
                </div>

                <div className="p-3 rounded-2xl bg-[#faf6ee] border border-[#ece2d1] text-[11px] text-slate-600 leading-relaxed">
                  Church membership records, pastoral endorsements, and candidate documents awaiting review.
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-[#ece2d1]">
              <Link
                href="/profiles?status_filter=UNDER_REVIEW"
                className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-950 border border-emerald-200 text-xs font-bold transition-all shadow-2xs"
              >
                <span>Review ID &amp; Photo Queues</span>
                <span>→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* 4. QUICK WORKFLOW CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          href="/profiles"
          className="bg-white border border-[#ece2d1] hover:border-cyan-400 rounded-3xl p-6 shadow-2xs hover:shadow-md group transition-all"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-50 border border-cyan-200 text-cyan-900 flex items-center justify-center text-lg font-bold">
              👤
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900 group-hover:text-cyan-800 transition-colors">
                Candidate Moderation →
              </h3>
              <p className="text-[11px] text-slate-500">
                Inspect baptism, parish &amp; family details
              </p>
            </div>
          </div>
          <p className="text-xs text-slate-600 mt-3 leading-relaxed">
            Inspect submitted matrimonial credentials, baptism details, and approve candidate cards for live Discovery search.
          </p>
        </Link>

        <Link
          href="/users"
          className="bg-white border border-[#ece2d1] hover:border-cyan-400 rounded-3xl p-6 shadow-2xs hover:shadow-md group transition-all"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-200 text-orange-900 flex items-center justify-center text-lg font-bold">
              👥
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900 group-hover:text-cyan-800 transition-colors">
                User Account Management →
              </h3>
              <p className="text-[11px] text-slate-500">
                Search, suspend or reactivate members
              </p>
            </div>
          </div>
          <p className="text-xs text-slate-600 mt-3 leading-relaxed">
            Search registered users, monitor verification statuses, and execute suspension, reactivation, or account blocking.
          </p>
        </Link>

        <Link
          href="/reports"
          className="bg-white border border-[#ece2d1] hover:border-cyan-400 rounded-3xl p-6 shadow-2xs hover:shadow-md group transition-all"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 flex items-center justify-center text-lg font-bold">
              🛡️
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900 group-hover:text-cyan-800 transition-colors">
                Safety &amp; Abuse Investigations →
              </h3>
              <p className="text-[11px] text-slate-500">
                {ops.pending_investigations} pending investigations
              </p>
            </div>
          </div>
          <p className="text-xs text-slate-600 mt-3 leading-relaxed">
            Review user flags, investigate suspicious candidate activities, and enforce Christian community code of conduct.
          </p>
        </Link>
      </div>
    </div>
  );
}
