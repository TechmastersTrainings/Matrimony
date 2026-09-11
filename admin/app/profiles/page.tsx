'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { adminApiClient } from '../../lib/api-client';
import { AdminProfileItem } from '../../types';
import { getPhotoUrl } from '../../lib/utils';

function AdminProfilesContent() {
  const searchParams = useSearchParams();
  const queryParamStatus = searchParams?.get('status_filter');

  const [profiles, setProfiles] = useState<AdminProfileItem[]>([]);
  const [selectedProfile, setSelectedProfile] = useState<AdminProfileItem | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Initialize status filter once on mount
  useEffect(() => {
    if (queryParamStatus) {
      setStatusFilter(queryParamStatus.toUpperCase());
    } else if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('admin_profile_filter');
      if (saved) {
        setStatusFilter(saved);
      }
    }
  }, [queryParamStatus]);

  // Dialog states
  const [rejectReason, setRejectReason] = useState('');
  const [changesNotes, setChangesNotes] = useState('');
  const [deleteReason, setDeleteReason] = useState('Candidate found match / requested decommission');
  const [actionType, setActionType] = useState<'REJECT' | 'CHANGES' | 'DELETE' | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 6000);
  };

  const loadProfiles = async (targetFilter?: string, preserveSelectedId?: number) => {
    setLoading(true);
    const activeFilter = targetFilter !== undefined ? targetFilter : statusFilter;
    try {
      const data = await adminApiClient.listProfiles(activeFilter === 'ALL' ? undefined : activeFilter);
      setProfiles(data.profiles);

      if (data.profiles.length > 0) {
        const targetId = preserveSelectedId || (selectedProfile ? selectedProfile.id : null);
        const match = data.profiles.find((p) => p.id === targetId);
        setSelectedProfile(match || data.profiles[0]);
      } else {
        setSelectedProfile(null);
      }
    } catch (err: any) {
      showToast(`Failed to load profiles: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfiles(statusFilter);
  }, [statusFilter]);

  const handleApprove = async (profileId: number) => {
    if (!confirm(`Approve Profile CN-${profileId}? This candidate will immediately become searchable on Discovery search.`)) return;
    setActionLoading(true);
    try {
      await adminApiClient.approveProfile(profileId);
      showToast(`✓ Profile CN-${profileId} approved successfully and published.`);

      setProfiles((prev) =>
        prev.map((p) =>
          p.id === profileId
            ? { ...p, status: 'APPROVED', approved_at: new Date().toISOString() }
            : p
        )
      );

      if (selectedProfile && selectedProfile.id === profileId) {
        setSelectedProfile({
          ...selectedProfile,
          status: 'APPROVED',
          approved_at: new Date().toISOString(),
        });
      }

      await loadProfiles(statusFilter, profileId);
    } catch (err: any) {
      showToast(`Approval Error: ${err.message}`);
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    if (!selectedProfile || !rejectReason.trim()) return;
    const pId = selectedProfile.id;
    setActionLoading(true);
    try {
      await adminApiClient.rejectProfile(pId, rejectReason.trim());
      showToast(`Profile CN-${pId} rejected.`);
      setActionType(null);
      setRejectReason('');

      setSelectedProfile({
        ...selectedProfile,
        status: 'REJECTED',
        rejection_reason: rejectReason.trim(),
      });

      setStatusFilter('REJECTED');
      await loadProfiles('REJECTED', pId);
    } catch (err: any) {
      showToast(`Rejection Error: ${err.message}`);
    } finally {
      setActionLoading(false);
    }
  };

  const handleRequestChanges = async () => {
    if (!selectedProfile || !changesNotes.trim()) return;
    const pId = selectedProfile.id;
    setActionLoading(true);
    try {
      await adminApiClient.requestChanges(pId, changesNotes.trim());
      showToast(`✓ Changes requested from candidate for Profile CN-${pId}.`);
      setActionType(null);
      setChangesNotes('');

      setSelectedProfile({
        ...selectedProfile,
        status: 'CHANGES_REQUIRED',
        changes_requested_notes: changesNotes.trim(),
      });

      setStatusFilter('CHANGES_REQUIRED');
      await loadProfiles('CHANGES_REQUIRED', pId);
    } catch (err: any) {
      showToast(`Request Changes Error: ${err.message}`);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteProfile = async () => {
    if (!selectedProfile) return;
    const pId = selectedProfile.id;
    const pName = selectedProfile.name;
    setActionLoading(true);
    try {
      await adminApiClient.deleteProfile(pId, deleteReason.trim());
      showToast(`✓ Profile CN-${pId} (${pName}) permanently purged.`);
      setActionType(null);
      setDeleteReason('Candidate found match / requested decommission');
      setSelectedProfile(null);
      await loadProfiles(statusFilter);
    } catch (err: any) {
      showToast(`Delete Error: ${err.message}`);
    } finally {
      setActionLoading(false);
    }
  };

  const webUrl = (process.env.NEXT_PUBLIC_WEB_URL || 'https://covenantnest.techmaster.space').replace(/\/+$/, '');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 text-[#1e1b18] font-sans">
      {/* Toast Banner */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 p-4 rounded-2xl bg-emerald-600 text-white font-bold text-xs shadow-2xl border border-emerald-400 flex items-center gap-3">
          <span>{toastMessage}</span>
          <a
            href={`${webUrl}/discover`}
            target="_blank"
            rel="noreferrer"
            className="px-3 py-1 bg-white text-emerald-900 rounded-lg text-[10px] font-bold hover:bg-emerald-50"
          >
            Check Discovery ↗
          </a>
          <button onClick={() => setToastMessage(null)} className="ml-2 text-white/80 hover:text-white font-bold">
            ✕
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8 pb-6 border-b border-charcoal-200/80">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-50 border border-cyan-200 text-cyan-950 text-xs font-bold uppercase tracking-wider shadow-2xs mb-2">
            <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
            <span>CovenantNest Moderation Suite</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight font-brand">
            Candidate Moderation Queue
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Review Christian faith credentials, church details, unmasked contacts, and approve profiles for Discovery search.
          </p>
        </div>

        {/* Status Filters */}
        <div className="flex flex-wrap gap-1.5">
          {['ALL', 'SUBMITTED', 'UNDER_REVIEW', 'CHANGES_REQUIRED', 'APPROVED', 'REJECTED'].map((st) => (
            <button
              key={st}
              onClick={() => {
                setStatusFilter(st);
                if (typeof window !== 'undefined') {
                  localStorage.setItem('admin_profile_filter', st);
                }
              }}
              className={`text-xs font-bold px-3 py-1.5 rounded-xl transition-all border ${
                statusFilter === st
                  ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {st === 'ALL' ? 'All Profiles' : st.replace(/_/g, ' ')}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Profiles List */}
        <div className="bg-white border border-[#ece2d1] rounded-3xl p-4 shadow-sm h-[750px] overflow-y-auto space-y-3">
          <div className="flex items-center justify-between px-2 pb-2 border-b border-[#ece2d1] text-xs font-bold text-slate-500 uppercase">
            <span>Profiles ({profiles.length})</span>
            <button onClick={() => loadProfiles()} className="text-cyan-700 hover:underline">
              🔄 Refresh List
            </button>
          </div>

          {loading ? (
            <div className="p-8 text-center text-xs text-slate-400 animate-pulse">Loading candidate profiles...</div>
          ) : profiles.length === 0 ? (
            <div className="p-12 text-center text-xs text-slate-500">No profiles found under filter &quot;{statusFilter}&quot;.</div>
          ) : (
            profiles.map((p) => {
              const isSelected = selectedProfile?.id === p.id;
              const photoUrl = getPhotoUrl(
                p.photos?.find((ph: any) => ph.is_primary)?.url || p.photos?.[0]?.url
              );
              const candidateCode = `CN-${p.id}`;

              return (
                <div
                  key={p.id}
                  onClick={() => setSelectedProfile(p)}
                  className={`p-3.5 rounded-2xl cursor-pointer border transition-all ${
                    isSelected
                      ? 'bg-cyan-50/70 border-cyan-500 shadow-sm ring-1 ring-cyan-500/20'
                      : 'bg-white border-slate-200/80 hover:border-cyan-300'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {/* Circular Avatar with bottom Verified Badge */}
                    <div className="relative shrink-0 flex flex-col items-center">
                      <div className="w-14 h-14 rounded-full ring-2 ring-cyan-400/30 shadow-xs overflow-hidden bg-gradient-to-tr from-[#0f172a] to-[#1e293b] relative flex items-center justify-center">
                        {photoUrl ? (
                          <img
                            src={photoUrl}
                            alt={p.name}
                            className="w-full h-full object-cover object-top"
                          />
                        ) : (
                          <span className="font-mono font-black text-xs text-amber-400">
                            {candidateCode}
                          </span>
                        )}
                      </div>
                      <div className="absolute -bottom-1 inset-x-0 flex justify-center pointer-events-none">
                        <span className="bg-emerald-600 text-white text-[9px] font-black px-1.5 rounded-full shadow-2xs">
                          ✓
                        </span>
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <h3 className="font-bold text-sm text-slate-900 truncate">{p.name}</h3>
                        <span
                          className={`text-[9px] font-extrabold px-2 py-0.5 rounded-md uppercase border shrink-0 ${
                            p.status === 'APPROVED'
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                              : p.status === 'REJECTED'
                              ? 'bg-rose-50 text-rose-800 border-rose-200'
                              : p.status === 'CHANGES_REQUIRED'
                              ? 'bg-amber-50 text-amber-800 border-amber-200'
                              : 'bg-cyan-50 text-cyan-800 border-cyan-200'
                          }`}
                        >
                          {p.status}
                        </span>
                      </div>

                      <p className="text-xs text-slate-500 mt-0.5">
                        {p.gender === 'FEMALE' ? 'Bride' : 'Groom'} • {p.age ? `${p.age} yrs` : 'Age N/A'}
                      </p>
                      <p className="text-[11px] text-cyan-900 font-semibold truncate mt-0.5">
                        {p.denomination || 'Christian'} • {p.church_name || 'Church pending'}
                      </p>
                    </div>
                  </div>

                  <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                    <span>{p.photos_count || 0} Photos</span>
                    <span>{candidateCode}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right Detail & Action Inspector */}
        <div className="lg:col-span-2">
          {selectedProfile ? (
            <div className="bg-white border border-[#ece2d1] rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
              {/* Header Banner */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-[#ece2d1]">
                <div>
                  <div className="flex items-center gap-3">
                    <h2 className="text-2xl font-extrabold text-slate-900 font-brand">{selectedProfile.name}</h2>
                    <span
                      className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-md uppercase border ${
                        selectedProfile.status === 'APPROVED'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : selectedProfile.status === 'REJECTED'
                          ? 'bg-rose-50 text-rose-800 border-rose-200'
                          : selectedProfile.status === 'CHANGES_REQUIRED'
                          ? 'bg-amber-50 text-amber-800 border-amber-200'
                          : 'bg-cyan-50 text-cyan-800 border-cyan-200'
                      }`}
                    >
                      {selectedProfile.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1 font-mono">
                    Candidate Code: CN-{selectedProfile.id} • User ID: #{selectedProfile.user_id}
                  </p>
                </div>

                {/* Moderation Actions */}
                <div className="flex flex-wrap items-center gap-2">
                  {selectedProfile.status !== 'APPROVED' ? (
                    <button
                      disabled={actionLoading}
                      onClick={() => handleApprove(selectedProfile.id)}
                      className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-xs shadow-xs transition-all flex items-center gap-1.5"
                    >
                      {actionLoading ? 'Approving...' : '✓ Approve & Publish'}
                    </button>
                  ) : (
                    <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 font-extrabold text-xs">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      <span>✓ Approved &amp; Published</span>
                    </div>
                  )}

                  <button
                    disabled={actionLoading}
                    onClick={() => setActionType('CHANGES')}
                    className="px-4 py-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-950 font-bold text-xs border border-amber-200 transition-all"
                  >
                    Request Changes
                  </button>

                  <button
                    disabled={actionLoading}
                    onClick={() => setActionType('REJECT')}
                    className="px-4 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-950 font-bold text-xs border border-rose-200 transition-all"
                  >
                    Reject
                  </button>

                  <button
                    disabled={actionLoading}
                    onClick={() => {
                      setDeleteReason('Candidate found match / requested decommission');
                      setActionType('DELETE');
                    }}
                    className="px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs border border-slate-300 transition-all flex items-center gap-1.5"
                    title="Permanently remove candidate from server"
                  >
                    <span>🗑️</span>
                  </button>
                </div>
              </div>

              {/* Status Banner */}
              {selectedProfile.status === 'APPROVED' && (
                <div className="p-3.5 px-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 text-xs font-medium flex flex-wrap items-center justify-between gap-3">
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span>Active &amp; Publicly Searchable on CovenantNest Discovery</span>
                  </span>
                  <a
                    href={`${webUrl}/profile/${selectedProfile.id}`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3.5 py-1.5 rounded-xl bg-cyan-700 hover:bg-cyan-600 text-white font-bold text-xs shadow-xs transition-all shrink-0 flex items-center gap-1.5"
                  >
                    <span>View Public Profile CN-{selectedProfile.id} ↗</span>
                  </a>
                </div>
              )}

              {selectedProfile.rejection_reason && (
                <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 text-xs">
                  <strong>Rejection Reason:</strong> {selectedProfile.rejection_reason}
                </div>
              )}

              {selectedProfile.changes_requested_notes && (
                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs">
                  <strong>Changes Requested:</strong> {selectedProfile.changes_requested_notes}
                </div>
              )}

              {/* Photos Gallery */}
              <div>
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">
                  Uploaded Photos ({selectedProfile.photos?.length || 0})
                </h4>
                {selectedProfile.photos && selectedProfile.photos.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {selectedProfile.photos.map((ph) => (
                      <div key={ph.id} className="relative aspect-square rounded-2xl overflow-hidden bg-slate-100 border border-slate-200">
                        <img
                          src={getPhotoUrl(ph.url)}
                          alt="Candidate Photo"
                          className="w-full h-full object-cover"
                        />
                        {ph.is_primary && (
                          <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-cyan-700 text-white text-[10px] font-extrabold shadow-xs">
                            Primary DP
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-6 rounded-2xl bg-slate-50 text-center text-xs text-slate-500 border border-slate-200">
                    No photos uploaded yet for this draft.
                  </div>
                )}
              </div>

              {/* Comprehensive Details Section */}
              <div className="space-y-4">
                {/* 1. Contact & Trust Verification (Confidential Admin View) */}
                <div className="p-5 rounded-2xl bg-cyan-50/60 border border-cyan-200 shadow-2xs space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-cyan-200">
                    <div className="flex items-center gap-2">
                      <span className="text-base">🔐</span>
                      <span className="text-xs font-extrabold uppercase tracking-wider text-cyan-950">
                        Direct Contact &amp; Candidate Trust Verification
                      </span>
                    </div>
                    <span className="text-[10px] bg-cyan-100 text-cyan-900 font-bold px-2 py-0.5 rounded-md border border-cyan-300">
                      Unmasked Moderator View
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
                    <div>
                      <span className="text-slate-500 block mb-1">Registered Mobile Number</span>
                      <a
                        href={`tel:${selectedProfile.mobile_number}`}
                        className="text-cyan-950 font-mono font-bold text-sm hover:underline flex items-center gap-1.5 transition-colors"
                      >
                        <span>📞 +91 {selectedProfile.mobile_number || 'Not provided'}</span>
                      </a>
                    </div>

                    <div>
                      <span className="text-slate-500 block mb-1">Registered Email Address</span>
                      <a
                        href={`mailto:${selectedProfile.email}`}
                        className="text-cyan-950 font-mono font-bold text-sm hover:underline flex items-center gap-1.5 transition-colors truncate"
                      >
                        <span>✉️ {selectedProfile.email || 'Not provided'}</span>
                      </a>
                    </div>

                    <div>
                      <span className="text-slate-500 block mb-1">Profile Created By</span>
                      <span className="font-bold text-slate-800">
                        {selectedProfile.profile_created_by || 'SELF'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 2. Faith & Church Credentials */}
                <div className="p-5 rounded-2xl bg-white border border-[#ece2d1] space-y-3">
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-800 pb-2 border-b border-slate-100 flex items-center gap-2">
                    <span>⛪</span>
                    <span>Church &amp; Spiritual Background</span>
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                    <div>
                      <span className="text-slate-500 block">Denomination</span>
                      <span className="font-bold text-slate-900">{selectedProfile.denomination || '—'}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Sub-Denomination</span>
                      <span className="font-bold text-slate-900">{selectedProfile.sub_denomination || '—'}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Church / Parish Name</span>
                      <span className="font-bold text-slate-900">{selectedProfile.church_name || '—'}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Pastor / Parish Priest</span>
                      <span className="font-bold text-slate-900">{selectedProfile.parish_or_pastor || '—'}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Water Baptism</span>
                      <span className="font-bold text-slate-900">{selectedProfile.is_baptized ? 'Yes' : 'No'}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Born Again Experience</span>
                      <span className="font-bold text-slate-900">{selectedProfile.is_born_again ? 'Yes' : 'No'}</span>
                    </div>
                  </div>
                </div>

                {/* 3. Education & Profession */}
                <div className="p-5 rounded-2xl bg-white border border-[#ece2d1] space-y-3">
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-800 pb-2 border-b border-slate-100 flex items-center gap-2">
                    <span>🎓</span>
                    <span>Education &amp; Profession</span>
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                    <div>
                      <span className="text-slate-500 block">Highest Degree</span>
                      <span className="font-bold text-slate-900">{selectedProfile.highest_education || '—'}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Occupation Title</span>
                      <span className="font-bold text-slate-900">{selectedProfile.occupation_title || '—'}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Employed In</span>
                      <span className="font-bold text-slate-900">{selectedProfile.employed_in || '—'}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Work Location</span>
                      <span className="font-bold text-slate-900">{selectedProfile.work_location || '—'}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Annual Income</span>
                      <span className="font-bold text-slate-900">
                        {selectedProfile.annual_income_min
                          ? `₹${selectedProfile.annual_income_min.toLocaleString()}/yr`
                          : 'Not disclosed'}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Location</span>
                      <span className="font-bold text-slate-900">
                        {selectedProfile.district || 'Bidar'}, {selectedProfile.state || 'Karnataka'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white border border-[#ece2d1] rounded-3xl p-12 text-center text-slate-500 space-y-3">
              <div className="text-3xl">👈</div>
              <h3 className="font-bold text-base text-slate-800">Select a candidate to inspect details</h3>
              <p className="text-xs text-slate-500">
                Choose any candidate profile from the queue on the left to verify credentials.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AdminProfilesPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#fdfbf7] text-slate-800">
          Loading Candidate Queue...
        </div>
      }
    >
      <AdminProfilesContent />
    </Suspense>
  );
}
