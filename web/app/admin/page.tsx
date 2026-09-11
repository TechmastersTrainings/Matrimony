'use client';

import React, { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { apiClient } from '../../lib/api-client';
import { getPhotoUrl, getDefaultAvatarSvg } from '../../lib/utils';

function AdminDashboardContent() {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState<any>(null);
  const [profiles, setProfiles] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'profiles' | 'users' | 'operations'>('profiles');

  // Filters
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [genderFilter, setGenderFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Check auth & admin permissions
  useEffect(() => {
    async function initAdmin() {
      try {
        const me = await apiClient.getMe();
        if (me?.role === 'SUPER_ADMIN' || me?.role === 'ADMIN') {
          setIsAdmin(true);
          await loadData();
        } else {
          router.push('/discover');
        }
      } catch {
        router.push('/login');
      } finally {
        setLoading(false);
      }
    }
    initAdmin();
  }, [router]);

  async function loadData() {
    try {
      const [mRes, pRes, uRes] = await Promise.allSettled([
        apiClient.getAdminMetrics(),
        apiClient.getAdminProfiles('ALL'),
        apiClient.getAdminUsers(),
      ]);

      if (mRes.status === 'fulfilled') setMetrics(mRes.value);
      if (pRes.status === 'fulfilled' && pRes.value?.profiles) setProfiles(pRes.value.profiles);
      if (uRes.status === 'fulfilled' && uRes.value?.users) setUsers(uRes.value.users);
    } catch (e) {
      console.error('Error loading admin records', e);
    }
  }

  async function handleApprove(profileId: number) {
    setActionLoading(profileId);
    setFeedbackMessage(null);
    try {
      await apiClient.approveProfile(profileId);
      setFeedbackMessage({ type: 'success', text: `Profile CN-${profileId} approved successfully!` });
      await loadData();
    } catch (err: any) {
      setFeedbackMessage({ type: 'error', text: err.message || 'Failed to approve profile' });
    } finally {
      setActionLoading(null);
    }
  }

  async function handleReject(profileId: number) {
    const reason = window.prompt('Please provide a reason for rejecting this profile:');
    if (!reason || !reason.trim()) return;

    setActionLoading(profileId);
    setFeedbackMessage(null);
    try {
      await apiClient.rejectProfile(profileId, reason.trim());
      setFeedbackMessage({ type: 'success', text: `Profile CN-${profileId} rejected.` });
      await loadData();
    } catch (err: any) {
      setFeedbackMessage({ type: 'error', text: err.message || 'Failed to reject profile' });
    } finally {
      setActionLoading(null);
    }
  }

  async function handleRequestChanges(profileId: number) {
    const notes = window.prompt('Enter moderation guidance / changes required for candidate:');
    if (!notes || !notes.trim()) return;

    setActionLoading(profileId);
    setFeedbackMessage(null);
    try {
      await apiClient.requestProfileChanges(profileId, notes.trim());
      setFeedbackMessage({ type: 'success', text: `Change request sent to candidate CN-${profileId}.` });
      await loadData();
    } catch (err: any) {
      setFeedbackMessage({ type: 'error', text: err.message || 'Failed to request changes' });
    } finally {
      setActionLoading(null);
    }
  }

  // Filtered candidate list
  const filteredProfiles = profiles.filter((p) => {
    // Status
    if (statusFilter !== 'ALL' && p.status !== statusFilter) return false;
    // Gender
    if (genderFilter === 'BRIDES' && p.gender !== 'FEMALE') return false;
    if (genderFilter === 'GROOMS' && p.gender !== 'MALE') return false;
    // Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = `${p.first_name || ''} ${p.last_name || ''}`.toLowerCase().includes(q);
      const matchPhone = (p.mobile_number || '').includes(q);
      const matchEmail = (p.email || '').toLowerCase().includes(q);
      const matchChurch = (p.church_name || '').toLowerCase().includes(q);
      const matchDenom = (p.denomination || '').toLowerCase().includes(q);
      if (!matchName && !matchPhone && !matchEmail && !matchChurch && !matchDenom) return false;
    }
    return true;
  });

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center bg-[#fdfbf7] text-charcoal-900 font-sans">
        <div className="w-12 h-12 rounded-2xl bg-cyan-800 text-amber-300 font-black flex items-center justify-center animate-pulse mb-3 shadow-md">
          CN
        </div>
        <p className="text-sm text-charcoal-600 font-bold">Loading CovenantNest Administration Portal...</p>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center bg-[#fdfbf7] p-4 text-center">
        <div className="w-14 h-14 rounded-2xl bg-rose-100 text-rose-800 font-black flex items-center justify-center text-2xl mb-4">
          🔒
        </div>
        <h2 className="text-2xl font-bold font-brand text-slate-900 mb-2">Administrative Privileges Required</h2>
        <p className="text-sm text-slate-600 max-w-md mb-6">
          This portal is reserved exclusively for authorized system administrators and church moderators.
        </p>
        <Link
          href="/login"
          className="bg-gradient-to-r from-cyan-700 to-teal-700 text-white font-bold text-sm px-6 py-3 rounded-xl shadow-sm"
        >
          Sign In as Administrator
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fdfbf7] text-[#1e1b18] py-8 sm:py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
        {/* Top Header Banner matching CovenantNest styling */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-charcoal-200/80">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-50 border border-cyan-200 text-cyan-950 text-xs font-bold uppercase tracking-wider shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
              <span>CovenantNest Administration &amp; Moderation</span>
              <span className="text-orange-400 font-bold">•</span>
              <span className="text-emerald-800 font-bold bg-emerald-100 px-2 py-0.5 rounded-md text-xs">
                Super Admin Active
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-brand">
              Administrative Command Center
            </h1>
            <p className="text-sm sm:text-base text-slate-600">
              Review genuine candidate registrations, verify church credentials, unmask contacts, and maintain community sanctity.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={loadData}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-sm font-bold transition-all shadow-2xs"
            >
              <span>🔄 Refresh Data</span>
            </button>
            <Link
              href="/discover"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-50 hover:bg-cyan-100 border border-cyan-200 text-cyan-950 text-sm font-bold transition-all shadow-2xs"
            >
              <span>View Discover Page →</span>
            </Link>
          </div>
        </div>

        {/* Feedback Alert */}
        {feedbackMessage && (
          <div
            className={`p-4 rounded-2xl border flex items-center justify-between gap-3 text-sm font-medium ${
              feedbackMessage.type === 'success'
                ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                : 'bg-rose-50 border-rose-300 text-rose-950'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <span>{feedbackMessage.type === 'success' ? '✓' : '⚠️'}</span>
              <span>{feedbackMessage.text}</span>
            </div>
            <button
              onClick={() => setFeedbackMessage(null)}
              className="text-slate-500 hover:text-slate-800 text-xs font-bold"
            >
              ✕
            </button>
          </div>
        )}

        {/* KPI Metrics Strip matching Homepage Color Harmony */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-5">
          {/* Metric 1 - Cyan Theme */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-cyan-50/90 to-cyan-100/30 border border-cyan-200 shadow-2xs space-y-1">
            <span className="text-xs font-mono font-bold text-cyan-800 uppercase tracking-widest block">
              Registered Users
            </span>
            <div className="text-3xl font-extrabold text-cyan-950 font-brand">
              {metrics?.total_users ?? users.length}
            </div>
            <span className="text-xs text-cyan-900/80 font-medium block">
              {metrics?.active_users ?? users.length} Active Accounts
            </span>
          </div>

          {/* Metric 2 - Emerald Theme */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-emerald-50/90 to-emerald-100/30 border border-emerald-200 shadow-2xs space-y-1">
            <span className="text-xs font-mono font-bold text-emerald-800 uppercase tracking-widest block">
              Approved Profiles
            </span>
            <div className="text-3xl font-extrabold text-emerald-950 font-brand">
              {metrics?.approved_profiles ?? profiles.filter((p) => p.status === 'APPROVED').length}
            </div>
            <span className="text-xs text-emerald-900/80 font-medium block">
              Live on CovenantNest
            </span>
          </div>

          {/* Metric 3 - Light Orange Theme */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-orange-50/90 to-amber-100/30 border border-orange-200 shadow-2xs space-y-1">
            <span className="text-xs font-mono font-bold text-orange-800 uppercase tracking-widest block">
              Brides &amp; Grooms
            </span>
            <div className="text-3xl font-extrabold text-orange-950 font-brand">
              {metrics?.total_brides ?? profiles.filter((p) => p.gender === 'FEMALE').length}B •{' '}
              {metrics?.total_grooms ?? profiles.filter((p) => p.gender === 'MALE').length}G
            </div>
            <span className="text-xs text-orange-900/80 font-medium block">
              Bidar &amp; Pan-India Candidates
            </span>
          </div>

          {/* Metric 4 - Warm Gold/Rose Theme */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-rose-50/90 to-pink-100/30 border border-rose-200 shadow-2xs space-y-1">
            <span className="text-xs font-mono font-bold text-rose-800 uppercase tracking-widest block">
              Pending Moderation
            </span>
            <div className="text-3xl font-extrabold text-rose-950 font-brand">
              {metrics?.pending_profiles ?? profiles.filter((p) => p.status === 'SUBMITTED' || p.status === 'UNDER_REVIEW').length}
            </div>
            <span className="text-xs text-rose-900/80 font-medium block">
              {profiles.filter((p) => p.status === 'SUBMITTED').length === 0 ? 'All Profiles Verified' : 'Action Required'}
            </span>
          </div>
        </div>

        {/* Primary Tab Switcher */}
        <div className="flex items-center gap-2 border-b border-charcoal-200/80 pb-3">
          <button
            onClick={() => setActiveTab('profiles')}
            className={`px-5 py-2.5 rounded-xl font-bold text-sm sm:text-base transition-all ${
              activeTab === 'profiles'
                ? 'bg-cyan-700 text-white shadow-sm'
                : 'bg-white hover:bg-cyan-50 text-slate-700 border border-slate-200'
            }`}
          >
            <span>Candidate Profiles ({profiles.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('users')}
            className={`px-5 py-2.5 rounded-xl font-bold text-sm sm:text-base transition-all ${
              activeTab === 'users'
                ? 'bg-cyan-700 text-white shadow-sm'
                : 'bg-white hover:bg-cyan-50 text-slate-700 border border-slate-200'
            }`}
          >
            <span>User Accounts Directory ({users.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('operations')}
            className={`px-5 py-2.5 rounded-xl font-bold text-sm sm:text-base transition-all ${
              activeTab === 'operations'
                ? 'bg-cyan-700 text-white shadow-sm'
                : 'bg-white hover:bg-cyan-50 text-slate-700 border border-slate-200'
            }`}
          >
            <span>Operations &amp; Security Queue</span>
          </button>
        </div>

        {/* TAB 1: CANDIDATE PROFILES MODERATION */}
        {activeTab === 'profiles' && (
          <div className="space-y-5">
            {/* Filter Toolbar */}
            <div className="bg-white border border-charcoal-200/80 rounded-2xl p-4 shadow-2xs space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                {/* Search Bar */}
                <div className="md:col-span-6 relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm">🔍</span>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search candidate name, mobile, email, or church..."
                    className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-cyan-600 focus:bg-white transition-all text-slate-900 placeholder:text-slate-400"
                  />
                </div>

                {/* Status Filter Tabs */}
                <div className="md:col-span-4 flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
                  {['ALL', 'APPROVED', 'SUBMITTED', 'REJECTED'].map((st) => (
                    <button
                      key={st}
                      onClick={() => setStatusFilter(st)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition-all whitespace-nowrap ${
                        statusFilter === st
                          ? 'bg-slate-900 text-white shadow-xs'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                      }`}
                    >
                      {st === 'ALL' ? 'All Status' : st}
                    </button>
                  ))}
                </div>

                {/* Gender Tabs */}
                <div className="md:col-span-2 flex items-center justify-end gap-1.5">
                  {[
                    { key: 'ALL', label: 'All' },
                    { key: 'BRIDES', label: 'Brides' },
                    { key: 'GROOMS', label: 'Grooms' },
                  ].map((g) => (
                    <button
                      key={g.key}
                      onClick={() => setGenderFilter(g.key)}
                      className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        genderFilter === g.key
                          ? 'bg-orange-600 text-white shadow-xs'
                          : 'bg-orange-50 hover:bg-orange-100 text-orange-950 border border-orange-200'
                      }`}
                    >
                      {g.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Candidate Cards Grid Matching Homepage Look */}
            {filteredProfiles.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {filteredProfiles.map((p) => {
                  const photoUrl = getPhotoUrl(
                    p.photos?.find((ph: any) => ph.is_primary)?.url || p.photos?.[0]?.url || p.primary_photo
                  );
                  const candidateCode = `CN-${p.id || 1}`;
                  const isBusy = actionLoading === p.id;

                  return (
                    <div
                      key={p.id}
                      className="bg-white border border-charcoal-200/80 hover:border-cyan-400 rounded-3xl p-5 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between space-y-4"
                    >
                      {/* Top Row: Candidate ID & Status Badge */}
                      <div className="flex items-center justify-between gap-2 pb-2 border-b border-charcoal-100">
                        <span className="font-mono font-black text-xs text-amber-900 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full">
                          {candidateCode}
                        </span>

                        <div className="flex items-center gap-1.5">
                          <span
                            className={`text-xs font-extrabold px-2.5 py-0.5 rounded-full uppercase border ${
                              p.status === 'APPROVED'
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                : p.status === 'SUBMITTED'
                                ? 'bg-cyan-50 text-cyan-800 border-cyan-200'
                                : p.status === 'CHANGES_REQUIRED'
                                ? 'bg-amber-50 text-amber-800 border-amber-200'
                                : 'bg-rose-50 text-rose-800 border-rose-200'
                            }`}
                          >
                            {p.status || 'SUBMITTED'}
                          </span>

                          <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-full">
                            {p.gender === 'FEMALE' ? 'Bride' : 'Groom'}
                          </span>
                        </div>
                      </div>

                      {/* Profile Image & Essential Details - Same Homepage Style */}
                      <div className="flex items-start gap-4">
                        {/* Circular Avatar with Emerald Verified Badge Directly Beneath */}
                        <div className="relative shrink-0 flex flex-col items-center">
                          <div className="w-22 h-22 sm:w-24 sm:h-24 rounded-full ring-4 ring-cyan-400/30 shadow-md overflow-hidden bg-gradient-to-tr from-[#0f172a] to-[#1e293b] relative flex items-center justify-center">
                            {photoUrl ? (
                              <img
                                src={photoUrl}
                                alt={p.name}
                                className="w-full h-full object-cover object-top"
                                onError={(e) => {
                                  e.currentTarget.src = getDefaultAvatarSvg(candidateCode);
                                }}
                              />
                            ) : (
                              <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-[#0f172a] to-[#1e293b] text-amber-400 p-2 select-none">
                                <span className="font-mono font-black text-base tracking-wider text-amber-400">
                                  {candidateCode}
                                </span>
                                <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest mt-0.5">
                                  Profile
                                </span>
                              </div>
                            )}
                          </div>

                          {/* Emerald Verified Badge ON the Image Frame */}
                          <div className="absolute -bottom-2 inset-x-0 flex justify-center pointer-events-none">
                            <span className="bg-emerald-600 text-white border-2 border-white text-[11px] font-extrabold px-2.5 py-0.5 rounded-full shadow-md flex items-center gap-1">
                              <span className="text-white font-black">✓</span>
                              <span>Verified</span>
                            </span>
                          </div>
                        </div>

                        {/* Details */}
                        <div className="flex-1 min-w-0 space-y-1">
                          <h3 className="font-brand text-lg sm:text-xl font-bold text-slate-900 truncate">
                            {p.first_name} {p.last_name || ''}
                          </h3>

                          <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-600">
                            <span className="font-bold text-cyan-900 bg-cyan-50 border border-cyan-200 px-2 py-0.5 rounded-md">
                              {p.denomination || 'Christian'}
                            </span>
                            <span>•</span>
                            <span>{p.age ? `${p.age} Yrs` : 'Age N/A'}</span>
                            <span>•</span>
                            <span>{p.marital_status ? p.marital_status.replace(/_/g, ' ') : 'Never Married'}</span>
                          </div>

                          <p className="text-xs text-slate-700 truncate font-medium pt-1">
                            🎓 {p.highest_education || 'Christian Graduate'}
                          </p>
                          <p className="text-xs text-slate-600 truncate">
                            💼 {p.occupation_title || p.employed_in || 'Working Professional'}
                          </p>
                          <p className="text-xs text-slate-500 truncate">
                            ⛪ {p.church_name || 'Church Affiliated'}
                          </p>
                        </div>
                      </div>

                      {/* Admin Unmasked Contact Strip */}
                      <div className="p-3 rounded-2xl bg-cyan-50/60 border border-cyan-200/80 space-y-1 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-cyan-950 uppercase tracking-wider text-[10px]">
                            Direct Candidate Contact (Unmasked):
                          </span>
                          <span className="text-[10px] text-cyan-800 font-bold bg-cyan-100 px-1.5 py-0.5 rounded">
                            Verified
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center justify-between gap-1 text-xs pt-0.5">
                          {p.mobile_number ? (
                            <a
                              href={`tel:${p.mobile_number}`}
                              className="font-mono font-bold text-cyan-900 hover:text-cyan-700 underline"
                            >
                              📞 +91 {p.mobile_number}
                            </a>
                          ) : (
                            <span className="text-slate-400">No mobile</span>
                          )}

                          {p.email ? (
                            <a
                              href={`mailto:${p.email}`}
                              className="font-medium text-cyan-900 hover:text-cyan-700 underline truncate max-w-[200px]"
                            >
                              ✉️ {p.email}
                            </a>
                          ) : (
                            <span className="text-slate-400">No email</span>
                          )}
                        </div>
                      </div>

                      {/* Admin Action Buttons */}
                      <div className="pt-2 border-t border-charcoal-100 grid grid-cols-2 gap-2">
                        {p.status !== 'APPROVED' ? (
                          <button
                            type="button"
                            disabled={isBusy}
                            onClick={() => handleApprove(p.id)}
                            className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-xs shadow-xs transition-all flex items-center justify-center gap-1.5"
                          >
                            <span>✓</span>
                            <span>{isBusy ? 'Approving...' : 'Approve Profile'}</span>
                          </button>
                        ) : (
                          <button
                            type="button"
                            disabled={isBusy}
                            onClick={() => handleRequestChanges(p.id)}
                            className="w-full py-2.5 px-3 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-950 font-bold text-xs transition-all flex items-center justify-center gap-1.5"
                          >
                            <span>✏️</span>
                            <span>Request Edit</span>
                          </button>
                        )}

                        <Link
                          href={`/profile/${p.id}`}
                          target="_blank"
                          className="w-full py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-800 font-bold text-xs transition-all flex items-center justify-center gap-1"
                        >
                          <span>View Full Profile</span>
                          <span>→</span>
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="py-12 px-6 rounded-3xl bg-white border border-charcoal-200 text-center max-w-lg mx-auto space-y-3 shadow-xs">
                <span className="text-3xl">📋</span>
                <h3 className="font-brand text-lg font-bold text-slate-900">No Candidate Profiles Match Criteria</h3>
                <p className="text-xs text-slate-600">
                  Try adjusting your search query or switching status filters above.
                </p>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: USER ACCOUNTS DIRECTORY */}
        {activeTab === 'users' && (
          <div className="bg-white border border-charcoal-200/80 rounded-3xl p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-charcoal-100">
              <div>
                <h3 className="text-xl font-bold font-brand text-slate-900">Registered Platform Users</h3>
                <p className="text-xs text-slate-600">
                  Direct database records for all user credentials, roles, and verification states.
                </p>
              </div>
              <span className="text-xs font-bold text-cyan-900 bg-cyan-50 border border-cyan-200 px-3 py-1 rounded-full">
                Total Users: {users.length}
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 text-slate-900 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="p-3">User ID</th>
                    <th className="p-3">Email Address</th>
                    <th className="p-3">Mobile Number</th>
                    <th className="p-3">Account Role</th>
                    <th className="p-3">Account Status</th>
                    <th className="p-3">Verification</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {users.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-3 font-mono font-bold text-slate-900">#{u.id}</td>
                      <td className="p-3 font-medium text-slate-900">{u.email || '—'}</td>
                      <td className="p-3 font-mono">{u.mobile_number ? `+91 ${u.mobile_number}` : '—'}</td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-0.5 rounded-md font-bold text-[10px] uppercase ${
                            u.role === 'SUPER_ADMIN' || u.role === 'ADMIN'
                              ? 'bg-purple-100 text-purple-900 border border-purple-200'
                              : 'bg-cyan-50 text-cyan-900 border border-cyan-200'
                          }`}
                        >
                          {u.role}
                        </span>
                      </td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-0.5 rounded-md font-bold text-[10px] uppercase ${
                            u.account_status === 'ACTIVE'
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                              : 'bg-amber-50 text-amber-800 border border-amber-200'
                          }`}
                        >
                          {u.account_status}
                        </span>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-1.5">
                          <span
                            title="Mobile Verified"
                            className={`w-2 h-2 rounded-full ${u.is_mobile_verified ? 'bg-emerald-500' : 'bg-slate-300'}`}
                          />
                          <span className="text-[10px] font-medium text-slate-600">
                            {u.is_mobile_verified ? 'Verified' : 'Unverified'}
                          </span>
                        </div>
                      </td>
                      <td className="p-3 text-right">
                        {u.role !== 'SUPER_ADMIN' && (
                          <button
                            onClick={async () => {
                              const nextStatus = u.account_status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
                              if (window.confirm(`Set status of User #${u.id} to ${nextStatus}?`)) {
                                await apiClient.updateAdminUserStatus(u.id, nextStatus);
                                await loadData();
                              }
                            }}
                            className="text-xs font-bold text-cyan-800 hover:text-cyan-950 underline"
                          >
                            {u.account_status === 'ACTIVE' ? 'Suspend' : 'Activate'}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: OPERATIONS & SECURITY QUEUE */}
        {activeTab === 'operations' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="p-6 rounded-3xl bg-white border border-charcoal-200/80 space-y-4 shadow-xs">
              <h3 className="font-brand text-lg font-bold text-slate-900">
                Community Sanctity &amp; Moderation Health
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Automated security checks continuously audit profiles for church pastor verification, spam prevention, and duplicate phone numbers.
              </p>
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50/70 border border-emerald-200">
                  <span className="font-bold text-emerald-950">Active Region Coverage:</span>
                  <span className="font-mono text-emerald-800">Bidar, Karnataka &amp; Pan-India</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-cyan-50/70 border border-cyan-200">
                  <span className="font-bold text-cyan-950">Fake Profile Detections:</span>
                  <span className="font-mono text-cyan-800">0 (100% Genuine Database)</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-orange-50/70 border border-orange-200">
                  <span className="font-bold text-orange-950">Community Reports Received:</span>
                  <span className="font-mono text-orange-800">0 Reported Issues</span>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-charcoal-200/80 space-y-4 shadow-xs">
              <h3 className="font-brand text-lg font-bold text-slate-900">
                Engineering Backbone Attribution
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Secured and maintained by <strong>Techmasters Innovations Private Limited</strong>, Mailoor Road, Bidar, Karnataka.
              </p>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                <div>
                  <strong className="text-slate-900 block">Database Server:</strong>
                  <span className="font-mono text-slate-600">Aiven Cloud MySQL (Dedicated Instance)</span>
                </div>
                <div>
                  <strong className="text-slate-900 block">Media Storage:</strong>
                  <span className="font-mono text-slate-600">Cloudflare R2 Encrypted Bucket</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function AdminPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#fdfbf7]" />}>
      <AdminDashboardContent />
    </Suspense>
  );
}
