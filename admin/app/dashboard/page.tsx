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
    <div className="max-w-7xl mx-auto px-4 py-8 text-white space-y-10 font-sans">
      {/* 1. Header & Live Telemetry Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-6 border-b border-slate-800">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[11px] font-bold uppercase tracking-wider">
            Super Admin Operations
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Today&apos;s Operations
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Real-time candidate registrations, moderation queues, and safety metrics retrieved directly from database.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={loadMetrics}
            disabled={refreshing}
            className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-bold border border-slate-800 transition-all flex items-center gap-2"
          >
            <span className={refreshing ? 'animate-spin' : ''}>↻</span>
            <span>{refreshing ? 'Refreshing...' : 'Refresh Database'}</span>
            {lastUpdated && <span className="text-[10px] text-slate-500">({lastUpdated})</span>}
          </button>

          <Link
            href="/profiles"
            className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-extrabold px-5 py-2.5 rounded-xl shadow-lg shadow-amber-950/40 transition-all transform hover:-translate-y-0.5"
          >
            Review Pending Profiles ({ops.need_verification})
          </Link>
        </div>
      </div>

      {/* 2. TODAY'S OPERATIONS: 3 Pure Database Operational Panels */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h2 className="text-lg font-extrabold text-white tracking-tight">
              Operational Statistics (Live Database)
            </h2>
            <p className="text-xs text-slate-400">
              Direct count of member accounts, verification stages, and open moderation tickets.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Panel A: Registration & Verification Flow */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col justify-between space-y-6 hover:border-slate-700 transition-colors">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <span className="text-xs font-extrabold text-blue-400 uppercase tracking-wider">
                  Registration &amp; Verification
                </span>
                <span className="text-[10px] font-mono text-slate-500">Database Live</span>
              </div>

              <div className="space-y-3.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300 font-medium">New registrations</span>
                  <span className="text-base font-extrabold text-white font-mono">
                    {loading ? '...' : ops.new_registrations.toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300 font-medium">Auto-approved</span>
                  <span className="text-base font-extrabold text-emerald-400 font-mono">
                    {loading ? '...' : ops.auto_approved.toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300 font-medium">Need verification</span>
                  <span className="text-base font-extrabold text-amber-400 font-mono">
                    {loading ? '...' : ops.need_verification.toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300 font-medium">High-risk</span>
                  <span className="text-base font-extrabold text-rose-400 font-mono">
                    {loading ? '...' : ops.high_risk.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800/80">
              <Link
                href="/profiles?status_filter=SUBMITTED"
                className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all"
              >
                <span>Inspect Verification Queue</span>
                <span>→</span>
              </Link>
            </div>
          </div>

          {/* Panel B: Safety & Investigations */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col justify-between space-y-6 hover:border-slate-700 transition-colors">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <span className="text-xs font-extrabold text-rose-400 uppercase tracking-wider">
                  Safety &amp; Investigations
                </span>
                <span className="text-[10px] font-mono text-slate-500">Database Live</span>
              </div>

              <div className="space-y-3.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300 font-medium">Reports received</span>
                  <span className="text-base font-extrabold text-white font-mono">
                    {loading ? '...' : ops.reports_received.toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300 font-medium">Pending investigations</span>
                  <span className="text-base font-extrabold text-amber-400 font-mono">
                    {loading ? '...' : ops.pending_investigations.toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300 font-medium">Fake profiles detected</span>
                  <span className="text-base font-extrabold text-rose-400 font-mono">
                    {loading ? '...' : ops.fake_profiles_detected.toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300 font-medium">Profiles suspended</span>
                  <span className="text-base font-extrabold text-slate-300 font-mono">
                    {loading ? '...' : ops.profiles_suspended.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800/80">
              <Link
                href="/reports"
                className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all"
              >
                <span>Manage Safety Reports</span>
                <span>→</span>
              </Link>
            </div>
          </div>

          {/* Panel C: Verification Queues */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col justify-between space-y-6 hover:border-slate-700 transition-colors">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <span className="text-xs font-extrabold text-emerald-400 uppercase tracking-wider">
                  Verification Queues
                </span>
                <span className="text-[10px] font-mono text-slate-500">Database Live</span>
              </div>

              <div className="space-y-3.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300 font-medium">Photo verification queue</span>
                  <span className="text-base font-extrabold text-amber-400 font-mono">
                    {loading ? '...' : ops.photo_verification_queue.toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300 font-medium">ID verification queue</span>
                  <span className="text-base font-extrabold text-blue-400 font-mono">
                    {loading ? '...' : ops.id_verification_queue.toLocaleString()}
                  </span>
                </div>

                <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 text-[11px] text-slate-400 leading-relaxed">
                  Church membership records, pastoral endorsements, and candidate documents awaiting review.
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800/80">
              <Link
                href="/profiles?status_filter=UNDER_REVIEW"
                className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all"
              >
                <span>Review ID &amp; Photo Queues</span>
                <span>→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* 3. PLATFORM OVERVIEW & REVENUE (Live Database Records) */}
      <div className="space-y-4">
        <h2 className="text-lg font-extrabold text-white tracking-tight">Platform Overview</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Total Registered Users
            </span>
            <div className="text-3xl font-extrabold text-white">
              {loading ? '...' : metrics?.total_users ?? 0}
            </div>
            <span className="text-xs text-emerald-400 font-semibold block">
              {metrics?.active_users ?? 0} active member accounts
            </span>
          </div>

          <div className="bg-slate-900 border border-amber-500/30 rounded-3xl p-6 shadow-xl space-y-2 bg-gradient-to-b from-amber-950/20 to-slate-900">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400">
              Pending Manual Review
            </span>
            <div className="text-3xl font-extrabold text-amber-400">
              {loading ? '...' : metrics?.pending_profiles ?? 0}
            </div>
            <Link href="/profiles" className="text-xs text-amber-300 font-semibold hover:underline block">
              Inspect &amp; Approve →
            </Link>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
              Approved Live Profiles
            </span>
            <div className="text-3xl font-extrabold text-emerald-400">
              {loading ? '...' : metrics?.approved_profiles ?? 0}
            </div>
            <span className="text-xs text-slate-400 block">Published live on /discover</span>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Platform Revenue
            </span>
            <div className="text-3xl font-extrabold text-white">
              ₹{loading ? '...' : (metrics?.total_revenue_inr?.toLocaleString() ?? '0')}
            </div>
            <span className="text-xs text-emerald-400 font-semibold block">
              {metrics?.active_subscriptions ?? 0} active paid subscribers
            </span>
          </div>
        </div>
      </div>

      {/* 4. QUICK WORKFLOW CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          href="/profiles"
          className="bg-slate-900 border border-slate-800 hover:border-amber-500 rounded-3xl p-6 shadow-xl group transition-all"
        >
          <h3 className="font-bold text-sm text-white group-hover:text-amber-400 transition-colors">
            Candidate &amp; Photo Moderation →
          </h3>
          <p className="text-xs text-slate-400 mt-2 leading-relaxed">
            Inspect submitted matrimonial credentials, baptism details, and approve candidate cards for Discovery search.
          </p>
        </Link>

        <Link
          href="/users"
          className="bg-slate-900 border border-slate-800 hover:border-amber-500 rounded-3xl p-6 shadow-xl group transition-all"
        >
          <h3 className="font-bold text-sm text-white group-hover:text-amber-400 transition-colors">
            User Account Management →
          </h3>
          <p className="text-xs text-slate-400 mt-2 leading-relaxed">
            Search registered users, monitor verification statuses, and execute suspension, reactivation, or account blocking.
          </p>
        </Link>

        <Link
          href="/reports"
          className="bg-slate-900 border border-slate-800 hover:border-amber-500 rounded-3xl p-6 shadow-xl group transition-all"
        >
          <h3 className="font-bold text-sm text-white group-hover:text-amber-400 transition-colors">
            Safety &amp; Abuse Investigations ({ops.pending_investigations}) →
          </h3>
          <p className="text-xs text-slate-400 mt-2 leading-relaxed">
            Review user flags, investigate suspicious candidate activities, and enforce Christian community code of conduct.
          </p>
        </Link>
      </div>
    </div>
  );
}
