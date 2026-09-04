'use client';

import React, { useEffect, useState } from 'react';
import { adminApiClient } from '../../lib/api-client';
import { AdminProfileItem } from '../../types';
import { getPhotoUrl } from '../../lib/utils';

export default function AdminProfilesPage() {
  const [profiles, setProfiles] = useState<AdminProfileItem[]>([]);
  const [selectedProfile, setSelectedProfile] = useState<AdminProfileItem | null>(null);
  const [statusFilter, setStatusFilter] = useState('SUBMITTED');
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

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
    if (!confirm(`Approve Profile #${profileId}? This candidate will immediately become searchable on Discovery search.`)) return;
    setActionLoading(true);
    try {
      const res = await adminApiClient.approveProfile(profileId);
      showToast(`✓ Profile #${profileId} approved successfully and published to Discovery.`);

      // Optimistically update selected profile status in state
      if (selectedProfile && selectedProfile.id === profileId) {
        setSelectedProfile({
          ...selectedProfile,
          status: 'APPROVED',
        });
      }

      // Switch to APPROVED or ALL filter so the item stays in view
      setStatusFilter('APPROVED');
      await loadProfiles('APPROVED', profileId);
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
      showToast(`Profile #${pId} rejected.`);
      setActionType(null);
      setRejectReason('');

      // Update state
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
      showToast(`✓ Changes requested from candidate for Profile #${pId}.`);
      setActionType(null);
      setChangesNotes('');

      // Update state
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
      showToast(`✓ Profile #${pId} (${pName}) permanently purged from server.`);
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

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 text-white font-sans">
      {/* Persistent Toast Banner */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 p-4 rounded-2xl bg-emerald-500 text-slate-950 font-extrabold text-xs shadow-2xl border border-emerald-400 flex items-center gap-3">
          <span>{toastMessage}</span>
          <a
            href="http://localhost:3000/discover"
            target="_blank"
            rel="noreferrer"
            className="px-3 py-1 bg-slate-950 text-white rounded-lg text-[10px] font-mono hover:bg-slate-900"
          >
            Check Discovery Search ↗
          </a>
          <button onClick={() => setToastMessage(null)} className="ml-2 text-slate-950 hover:text-white font-bold">
            ✕
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8 pb-6 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Profile Moderation Queue</h1>
          <p className="text-xs text-slate-400 mt-1">Review Christian faith credentials, church details, photos, and approve profiles for Discovery.</p>
        </div>

        {/* Status Filters */}
        <div className="flex flex-wrap gap-2">
          {['SUBMITTED', 'UNDER_REVIEW', 'CHANGES_REQUIRED', 'APPROVED', 'REJECTED', 'ALL'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`text-xs font-bold px-3 py-1.5 rounded-xl transition-all border ${
                statusFilter === st
                  ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md'
                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
              }`}
            >
              {st.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Profiles List */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 shadow-xl h-[700px] overflow-y-auto space-y-3">
          <div className="flex items-center justify-between px-2 pb-2 border-b border-slate-800 text-xs font-bold text-slate-400 uppercase">
            <span>Profiles ({profiles.length})</span>
            <button onClick={() => loadProfiles()} className="text-amber-400 hover:underline">
              Refresh List
            </button>
          </div>

          {loading ? (
            <div className="p-8 text-center text-xs text-slate-500 animate-pulse">Loading candidate profiles...</div>
          ) : profiles.length === 0 ? (
            <div className="p-12 text-center text-xs text-slate-500">No profiles found under filter &quot;{statusFilter}&quot;.</div>
          ) : (
            profiles.map((p) => {
              const isSelected = selectedProfile?.id === p.id;
              return (
                <div
                  key={p.id}
                  onClick={() => setSelectedProfile(p)}
                  className={`p-4 rounded-2xl cursor-pointer border transition-all ${
                    isSelected
                      ? 'bg-slate-800 border-amber-500 shadow-lg ring-1 ring-amber-500/20'
                      : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-extrabold text-sm text-white">{p.name}</h3>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {p.gender || 'Member'} • {p.age ? `${p.age} yrs` : 'Age pending'}
                      </p>
                      <p className="text-[11px] text-amber-400 font-medium mt-1">
                        {p.denomination || 'Christian'} • {p.church_name || 'Church not set'}
                      </p>
                    </div>
                    <span
                      className={`text-[9px] font-extrabold px-2 py-0.5 rounded-md uppercase border ${
                        p.status === 'APPROVED'
                          ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                          : p.status === 'REJECTED'
                          ? 'bg-red-950 text-red-300 border-red-800'
                          : p.status === 'CHANGES_REQUIRED'
                          ? 'bg-amber-950 text-amber-300 border-amber-800'
                          : 'bg-blue-950 text-blue-300 border-blue-800'
                      }`}
                    >
                      {p.status}
                    </span>
                  </div>

                  <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-500">
                    <span>{p.photos_count || 0} Photos</span>
                    <span>{p.submitted_at ? new Date(p.submitted_at).toLocaleDateString() : 'Draft'}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right Detail & Action Inspector */}
        <div className="lg:col-span-2">
          {selectedProfile ? (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6">
              {/* Header Banner */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-800">
                <div>
                  <div className="flex items-center gap-3">
                    <h2 className="text-xl font-extrabold text-white">{selectedProfile.name}</h2>
                    <span
                      className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-md uppercase border ${
                        selectedProfile.status === 'APPROVED'
                          ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                          : selectedProfile.status === 'REJECTED'
                          ? 'bg-red-950 text-red-300 border-red-800'
                          : selectedProfile.status === 'CHANGES_REQUIRED'
                          ? 'bg-amber-950 text-amber-300 border-amber-800'
                          : 'bg-blue-950 text-blue-300 border-blue-800'
                      }`}
                    >
                      {selectedProfile.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    Profile ID: CM-{selectedProfile.id} • User ID: {selectedProfile.user_id}
                  </p>
                </div>

                {/* Moderation Actions */}
                <div className="flex items-center gap-2">
                  {selectedProfile.status !== 'APPROVED' && (
                    <button
                      disabled={actionLoading}
                      onClick={() => handleApprove(selectedProfile.id)}
                      className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 font-extrabold text-xs shadow-lg transition-all"
                    >
                      {actionLoading ? 'Approving...' : '✓ Approve & Publish'}
                    </button>
                  )}

                  <button
                    disabled={actionLoading}
                    onClick={() => setActionType('CHANGES')}
                    className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 font-bold text-xs border border-slate-700 transition-all"
                  >
                    Request Changes
                  </button>

                  <button
                    disabled={actionLoading}
                    onClick={() => setActionType('REJECT')}
                    className="px-4 py-2.5 rounded-xl bg-red-950/60 hover:bg-red-900 text-red-300 font-bold text-xs border border-red-800 transition-all"
                  >
                    Reject
                  </button>

                  <button
                    disabled={actionLoading}
                    onClick={() => {
                      setDeleteReason('Candidate found match / requested decommission');
                      setActionType('DELETE');
                    }}
                    className="px-4 py-2.5 rounded-xl bg-rose-950/60 hover:bg-rose-900 text-rose-300 font-bold text-xs border border-rose-800 transition-all flex items-center gap-1.5"
                    title="Permanently remove candidate from server (Match found / Account closed)"
                  >
                    <span>🗑️</span>
                    <span>Delete Profile</span>
                  </button>
                </div>
              </div>

              {/* Status Banner */}
              {selectedProfile.status === 'APPROVED' && (
                <div className="p-3.5 px-4 rounded-2xl bg-emerald-950/50 border border-emerald-800/80 text-emerald-200 text-xs font-medium flex items-center justify-between gap-3">
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Active on Discovery search</span>
                  </span>
                  <button
                    onClick={() => {
                      const token = typeof window !== 'undefined' ? localStorage.getItem('token') || '' : '';
                      window.open(`http://localhost:3000/discover?admin_token=${encodeURIComponent(token)}`, '_blank');
                    }}
                    className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition-all shrink-0 flex items-center gap-1.5"
                  >
                    <span>Test Discovery View</span>
                    <span>→</span>
                  </button>
                </div>
              )}

              {selectedProfile.rejection_reason && (
                <div className="p-4 rounded-2xl bg-red-950/70 border border-red-800 text-red-200 text-xs">
                  <strong>Rejection Reason:</strong> {selectedProfile.rejection_reason}
                </div>
              )}

              {selectedProfile.changes_requested_notes && (
                <div className="p-4 rounded-2xl bg-amber-950/70 border border-amber-800 text-amber-200 text-xs">
                  <strong>Changes Requested:</strong> {selectedProfile.changes_requested_notes}
                </div>
              )}

              {/* Photos Gallery */}
              <div>
                <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-3">
                  Uploaded Photos ({selectedProfile.photos?.length || 0})
                </h4>
                {selectedProfile.photos && selectedProfile.photos.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {selectedProfile.photos.map((ph) => (
                      <div key={ph.id} className="relative aspect-square rounded-2xl overflow-hidden bg-slate-950 border border-slate-800">
                        <img
                          src={getPhotoUrl(ph.url)}
                          alt="Candidate Photo"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100%25' height='100%25' viewBox='0 0 100 100'%3E%3Crect width='100%25' height='100%25' fill='%230f172a'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%23f59e0b' font-family='sans-serif' font-weight='bold' font-size='16'%3ECM%3C/text%3E%3C/svg%3E";
                          }}
                        />
                        {ph.is_primary && (
                          <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-amber-500 text-slate-950 text-[10px] font-extrabold shadow-md">
                            Primary DP
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-6 rounded-2xl bg-slate-950 text-center text-xs text-slate-500 border border-slate-800">
                    No photos uploaded yet for this draft.
                  </div>
                )}
              </div>

              {/* Comprehensive Details Section */}
              <div className="space-y-4">
                {/* 1. Contact & Trust Verification (Confidential Admin View) */}
                <div className="p-5 rounded-2xl bg-slate-950 border-2 border-amber-500/40 shadow-lg space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                    <div className="flex items-center gap-2">
                      <span className="text-base">🔐</span>
                      <span className="text-xs font-extrabold uppercase tracking-wider text-amber-400">
                        Direct Contact &amp; Candidate Trust Verification
                      </span>
                    </div>
                    <span className="text-[10px] bg-amber-500/10 text-amber-300 font-bold px-2 py-0.5 rounded-md border border-amber-500/20">
                      Confidential Admin Access
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
                    <div>
                      <span className="text-slate-400 block mb-1">Registered Mobile Number</span>
                      <a
                        href={`tel:${selectedProfile.mobile_number}`}
                        className="text-white font-mono font-bold text-sm hover:text-amber-400 flex items-center gap-1.5 transition-colors"
                      >
                        <span>📱 +91 {selectedProfile.mobile_number || 'Not provided'}</span>
                      </a>
                    </div>

                    <div>
                      <span className="text-slate-400 block mb-1">Registered Email Address</span>
                      <a
                        href={`mailto:${selectedProfile.email}`}
                        className="text-white font-bold text-sm hover:text-amber-400 flex items-center gap-1.5 transition-colors"
                      >
                        <span>✉️ {selectedProfile.email || 'Not provided'}</span>
                      </a>
                    </div>

                    <div>
                      <span className="text-slate-400 block mb-1">Submission Date &amp; Time</span>
                      <span className="text-slate-300 font-mono text-xs">
                        {selectedProfile.submitted_at
                          ? new Date(selectedProfile.submitted_at).toLocaleString()
                          : 'In Draft Mode'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 2. Christian Faith & Church Endorsement */}
                <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                  <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
                    <span className="text-base">✝️</span>
                    <span className="text-xs font-extrabold uppercase tracking-wider text-white">
                      Christian Faith &amp; Church Credentials
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                    <div>
                      <span className="text-slate-400 block mb-0.5">Denomination</span>
                      <strong className="text-white font-bold">{selectedProfile.denomination || 'N/A'}</strong>
                    </div>

                    <div>
                      <span className="text-slate-400 block mb-0.5">Sub-Denomination</span>
                      <strong className="text-white font-bold">{selectedProfile.sub_denomination || 'None'}</strong>
                    </div>

                    <div>
                      <span className="text-slate-400 block mb-0.5">Church / Parish Name</span>
                      <strong className="text-white font-bold">{selectedProfile.church_name || 'N/A'}</strong>
                    </div>

                    <div>
                      <span className="text-slate-400 block mb-0.5">Pastor / Presbyter</span>
                      <strong className="text-white font-bold">{selectedProfile.parish_or_pastor || 'N/A'}</strong>
                    </div>

                    <div>
                      <span className="text-slate-400 block mb-0.5">Baptism Status</span>
                      <strong className="text-emerald-400 font-bold">
                        {selectedProfile.is_baptized ? '✓ Baptized' : 'Not Baptized'}
                      </strong>
                    </div>

                    <div className="sm:col-span-3">
                      <span className="text-slate-400 block mb-0.5">Faith Testimony &amp; Church Involvement</span>
                      <p className="text-slate-300 text-xs italic bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                        &ldquo;{selectedProfile.faith_testimony || 'No testimony statement provided.'}&rdquo;
                      </p>
                    </div>
                  </div>
                </div>

                {/* 3. Education & Professional Career */}
                <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                  <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
                    <span className="text-base">💼</span>
                    <span className="text-xs font-extrabold uppercase tracking-wider text-white">
                      Education, Career &amp; Income
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                    <div>
                      <span className="text-slate-400 block mb-0.5">Highest Qualification</span>
                      <strong className="text-white font-bold">{selectedProfile.highest_education || 'N/A'}</strong>
                    </div>

                    <div>
                      <span className="text-slate-400 block mb-0.5">Occupation Title</span>
                      <strong className="text-white font-bold">{selectedProfile.occupation_title || 'N/A'}</strong>
                    </div>

                    <div>
                      <span className="text-slate-400 block mb-0.5">Employment Sector</span>
                      <strong className="text-white font-bold">{selectedProfile.employed_in || 'N/A'}</strong>
                    </div>

                    <div>
                      <span className="text-slate-400 block mb-0.5">Work Location</span>
                      <strong className="text-white font-bold">{selectedProfile.work_location || 'N/A'}</strong>
                    </div>

                    <div className="sm:col-span-2">
                      <span className="text-slate-400 block mb-0.5">Annual Income (INR)</span>
                      <strong className="text-amber-400 font-extrabold text-sm">
                        {selectedProfile.annual_income_min
                          ? `₹${selectedProfile.annual_income_min.toLocaleString('en-IN')} / year`
                          : 'Not disclosed'}
                      </strong>
                    </div>
                  </div>
                </div>

                {/* 4. Demographics & Family Background */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Demographics */}
                  <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                    <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
                      <span className="text-base">👤</span>
                      <span className="text-xs font-extrabold uppercase tracking-wider text-white">
                        Demographics &amp; Habits
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <span className="text-slate-400 block mb-0.5">Gender</span>
                        <strong className="text-white font-bold">{selectedProfile.gender || 'N/A'}</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 block mb-0.5">Age &amp; DOB</span>
                        <strong className="text-white font-bold">
                          {selectedProfile.age || '—'} Yrs ({selectedProfile.dob || 'DOB N/A'})
                        </strong>
                      </div>
                      <div>
                        <span className="text-slate-400 block mb-0.5">Marital Status</span>
                        <strong className="text-white font-bold">{selectedProfile.marital_status || 'NEVER_MARRIED'}</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 block mb-0.5">Height</span>
                        <strong className="text-white font-bold">{selectedProfile.height_cm ? `${selectedProfile.height_cm} cm` : 'N/A'}</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 block mb-0.5">Mother Tongue</span>
                        <strong className="text-white font-bold">{selectedProfile.mother_tongue || 'N/A'}</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 block mb-0.5">Physical Status</span>
                        <strong className="text-white font-bold">{selectedProfile.physical_status || 'NORMAL'}</strong>
                      </div>
                    </div>
                  </div>

                  {/* Family Roots */}
                  <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                    <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
                      <span className="text-base">🏡</span>
                      <span className="text-xs font-extrabold uppercase tracking-wider text-white">
                        Family Roots &amp; Location
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <span className="text-slate-400 block mb-0.5">Father&apos;s Details</span>
                        <strong className="text-white font-bold block">{selectedProfile.father_name || 'N/A'}</strong>
                        <span className="text-[11px] text-slate-400">{selectedProfile.father_occupation || ''}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block mb-0.5">Mother&apos;s Details</span>
                        <strong className="text-white font-bold block">{selectedProfile.mother_name || 'N/A'}</strong>
                        <span className="text-[11px] text-slate-400">{selectedProfile.mother_occupation || ''}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block mb-0.5">Family Standing</span>
                        <strong className="text-white font-bold">{selectedProfile.family_status || 'UPPER_MIDDLE_CLASS'}</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 block mb-0.5">Family Values</span>
                        <strong className="text-white font-bold">{selectedProfile.family_values || 'MODERATE'}</strong>
                      </div>
                      <div className="col-span-2">
                        <span className="text-slate-400 block mb-0.5">Native Place &amp; Address</span>
                        <strong className="text-white font-bold">
                          {selectedProfile.native_place || 'N/A'}, {selectedProfile.district || 'Bidar'}, {selectedProfile.state || 'Karnataka'} ({selectedProfile.pincode || '585401'})
                        </strong>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 5. Bio & Partner Preferences */}
                <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                  <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
                    <span className="text-base">💍</span>
                    <span className="text-xs font-extrabold uppercase tracking-wider text-white">
                      Candidate Bio &amp; Partner Preferences
                    </span>
                  </div>

                  <div className="space-y-3 text-xs">
                    <div>
                      <span className="text-slate-400 block mb-1 font-semibold">About Candidate (Personal Bio):</span>
                      <p className="text-slate-300 bg-slate-900 p-3 rounded-xl border border-slate-800 leading-relaxed">
                        {selectedProfile.bio || 'No personal bio submitted.'}
                      </p>
                    </div>

                    {selectedProfile.partner_preferences && (
                      <div>
                        <span className="text-slate-400 block mb-1 font-semibold">Expected Partner Preferences:</span>
                        <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 flex flex-wrap gap-4">
                          <span>Age: <strong className="text-white">{selectedProfile.partner_preferences.age_min || 20} - {selectedProfile.partner_preferences.age_max || 35} yrs</strong></span>
                          <span>•</span>
                          <span>Height: <strong className="text-white">{selectedProfile.partner_preferences.height_min_cm || 150} - {selectedProfile.partner_preferences.height_max_cm || 190} cm</strong></span>
                          <span>•</span>
                          <span>Denominations: <strong className="text-amber-400">{Array.isArray(selectedProfile.partner_preferences.denomination) ? selectedProfile.partner_preferences.denomination.join(', ') : 'Any'}</strong></span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center text-xs text-slate-500">
              Select a candidate profile from the left moderation queue to inspect credentials and moderate.
            </div>
          )}
        </div>
      </div>

      {/* Reject Modal */}
      {actionType === 'REJECT' && selectedProfile && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <h3 className="text-lg font-extrabold text-white">Reject Profile #{selectedProfile.id}</h3>
            <textarea
              rows={3}
              placeholder="State clear rejection reasons..."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="w-full text-xs font-medium rounded-xl border border-slate-800 p-3 bg-slate-950 text-white focus:outline-none focus:border-red-500"
            />
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setActionType(null)}
                className="px-4 py-2 text-xs font-bold text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                disabled={actionLoading || !rejectReason.trim()}
                onClick={handleReject}
                className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Request Changes Modal */}
      {actionType === 'CHANGES' && selectedProfile && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <h3 className="text-lg font-extrabold text-white">Request Changes for Profile #{selectedProfile.id}</h3>
            <textarea
              rows={3}
              placeholder="Detail required updates (e.g. upload 5 clear photos, update pastor name)..."
              value={changesNotes}
              onChange={(e) => setChangesNotes(e.target.value)}
              className="w-full text-xs font-medium rounded-xl border border-slate-800 p-3 bg-slate-950 text-white focus:outline-none focus:border-amber-400"
            />
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setActionType(null)}
                className="px-4 py-2 text-xs font-bold text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                disabled={actionLoading || !changesNotes.trim()}
                onClick={handleRequestChanges}
                className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold"
              >
                Send Change Request
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {actionType === 'DELETE' && selectedProfile && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-rose-800/70 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex items-center gap-3 text-rose-400">
              <span className="text-2xl">⚠️</span>
              <h3 className="text-lg font-extrabold text-white">Permanently Delete Profile #{selectedProfile.id}</h3>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Are you sure you want to permanently purge <strong className="text-white">{selectedProfile.name}</strong> from the database? This removes photos, verification data, and candidate records to keep servers lean.
            </p>

            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                Reason for Permanent Deletion:
              </label>
              <input
                type="text"
                value={deleteReason}
                onChange={(e) => setDeleteReason(e.target.value)}
                placeholder="e.g. Candidate found match / decommissioned"
                className="w-full text-xs font-medium rounded-xl border border-slate-800 p-3 bg-slate-950 text-white focus:outline-none focus:border-rose-500"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setActionType(null)}
                className="px-4 py-2 text-xs font-bold text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                disabled={actionLoading}
                onClick={handleDeleteProfile}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-red-700 hover:from-rose-500 hover:to-red-600 text-white text-xs font-extrabold shadow-lg transition-all flex items-center gap-1.5"
              >
                <span>🗑️</span>
                <span>{actionLoading ? 'Purging...' : 'Confirm Permanent Deletion'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
