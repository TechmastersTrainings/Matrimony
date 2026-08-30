'use client';

import React, { useEffect, useState } from 'react';
import { adminApiClient } from '../../lib/api-client';
import { AdminProfileItem } from '../../types';

export default function AdminProfilesPage() {
  const [profiles, setProfiles] = useState<AdminProfileItem[]>([]);
  const [selectedProfile, setSelectedProfile] = useState<AdminProfileItem | null>(null);
  const [statusFilter, setStatusFilter] = useState('SUBMITTED');
  const [loading, setLoading] = useState(true);

  // Dialog actions
  const [rejectReason, setRejectReason] = useState('');
  const [changesNotes, setChangesNotes] = useState('');
  const [actionType, setActionType] = useState<'REJECT' | 'CHANGES' | null>(null);

  const loadProfiles = async () => {
    setLoading(true);
    try {
      const data = await adminApiClient.listProfiles(statusFilter || undefined);
      setProfiles(data.profiles);
      if (data.profiles.length > 0 && !selectedProfile) {
        setSelectedProfile(data.profiles[0]);
      }
    } catch (err) {
      // Error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfiles();
  }, [statusFilter]);

  const handleApprove = async (profileId: number) => {
    if (!confirm('Approve this Christian matrimonial profile? It will become publicly visible.')) return;
    try {
      await adminApiClient.approveProfile(profileId);
      alert('✓ Profile approved successfully.');
      await loadProfiles();
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    }
  };

  const handleReject = async () => {
    if (!selectedProfile || !rejectReason.trim()) return;
    try {
      await adminApiClient.rejectProfile(selectedProfile.id, rejectReason.trim());
      alert('Profile rejected.');
      setActionType(null);
      setRejectReason('');
      await loadProfiles();
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    }
  };

  const handleRequestChanges = async () => {
    if (!selectedProfile || !changesNotes.trim()) return;
    try {
      await adminApiClient.requestChanges(selectedProfile.id, changesNotes.trim());
      alert('Changes requested from candidate.');
      setActionType(null);
      setChangesNotes('');
      await loadProfiles();
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 pb-6 border-b border-stone-200">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">Profile & Photo Moderation</h1>
          <p className="text-xs text-stone-500">Review complete candidate details, denomination, and 5+ photos.</p>
        </div>

        {/* Filter */}
        <div className="flex gap-2 mt-4 md:mt-0">
          {['SUBMITTED', 'UNDER_REVIEW', 'CHANGES_REQUIRED', 'APPROVED', 'REJECTED'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors ${statusFilter === st ? 'bg-amber-700 text-white' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'}`}
            >
              {st.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Profiles List */}
        <div className="bg-white border border-stone-200 rounded-2xl p-4 shadow-xs h-[650px] overflow-y-auto divide-y divide-stone-100">
          {loading ? (
            <div className="p-8 text-center text-xs text-stone-500">Loading queue...</div>
          ) : profiles.length === 0 ? (
            <div className="p-8 text-center text-xs text-stone-500">No profiles in {statusFilter} state.</div>
          ) : (
            profiles.map((p) => (
              <button
                key={p.id}
                onClick={() => setSelectedProfile(p)}
                className={`w-full text-left p-3.5 rounded-xl transition-all ${selectedProfile?.id === p.id ? 'bg-amber-50/80 border border-amber-300' : 'hover:bg-stone-50'}`}
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-xs text-stone-900">{p.name}</h4>
                  <span className="text-[10px] bg-stone-100 font-semibold px-2 py-0.5 rounded">
                    {p.photos_count} photos
                  </span>
                </div>
                <p className="text-[11px] text-stone-500 mt-0.5">
                  {p.gender} • {p.age} yrs • {p.denomination}
                </p>
                <p className="text-[10px] text-stone-400 mt-0.5">⛪ {p.church_name || 'Christian Church'}</p>
              </button>
            ))
          )}
        </div>

        {/* Right: Detailed Inspection & Actions */}
        <div className="lg:col-span-2 bg-white border border-stone-200 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
          {selectedProfile ? (
            <div>
              <div className="flex items-center justify-between border-b border-stone-100 pb-4 mb-6">
                <div>
                  <h2 className="text-xl font-bold text-stone-900">{selectedProfile.name}</h2>
                  <p className="text-xs text-stone-500">
                    Profile #{selectedProfile.id} • User #{selectedProfile.user_id} • Status: {selectedProfile.status}
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleApprove(selectedProfile.id)}
                    className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold px-4 py-2 rounded-xl shadow-xs"
                  >
                    ✓ Approve Profile
                  </button>
                  <button
                    onClick={() => setActionType('CHANGES')}
                    className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold px-3 py-2 rounded-xl shadow-xs"
                  >
                    Request Changes
                  </button>
                  <button
                    onClick={() => setActionType('REJECT')}
                    className="bg-red-600 hover:bg-red-700 text-white text-xs font-semibold px-3 py-2 rounded-xl shadow-xs"
                  >
                    Reject
                  </button>
                </div>
              </div>

              {/* Photos Gallery */}
              <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wider mb-3">
                Uploaded Photos ({selectedProfile.photos.length} / 5 Min)
              </h3>
              <div className="grid grid-cols-5 gap-3 mb-6">
                {selectedProfile.photos.map((ph, idx) => (
                  <div key={ph.id} className="aspect-square rounded-xl overflow-hidden bg-stone-100 border border-stone-200 relative group">
                    <img src={ph.url} alt="Candidate photo" className="w-full h-full object-cover" />
                    {ph.is_primary && (
                      <span className="absolute bottom-1 left-1 bg-amber-700 text-white text-[9px] font-bold px-1 rounded">
                        Main
                      </span>
                    )}
                  </div>
                ))}
              </div>

              {/* Details table */}
              <div className="grid grid-cols-2 gap-4 text-xs bg-stone-50 p-4 rounded-xl border border-stone-100">
                <div>
                  <span className="text-stone-400 block font-medium">Denomination & Church</span>
                  <span className="font-bold text-stone-800">{selectedProfile.denomination} • {selectedProfile.church_name || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-stone-400 block font-medium">Gender & Age</span>
                  <span className="font-bold text-stone-800">{selectedProfile.gender}, {selectedProfile.age} Years</span>
                </div>
              </div>

              {/* Action Modals */}
              {actionType === 'REJECT' && (
                <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                  <h4 className="text-xs font-bold text-red-900 mb-2">Mandatory Reason for Rejection:</h4>
                  <textarea
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    placeholder="Enter explicit reason for rejecting this profile..."
                    className="w-full text-xs p-2.5 rounded-lg border border-red-300 bg-white"
                    rows={3}
                  />
                  <div className="mt-3 flex justify-end gap-2">
                    <button onClick={() => setActionType(null)} className="text-xs px-3 py-1.5 bg-stone-200 text-stone-800 rounded-lg">Cancel</button>
                    <button onClick={handleReject} className="text-xs px-4 py-1.5 bg-red-700 text-white font-semibold rounded-lg">Confirm Rejection</button>
                  </div>
                </div>
              )}

              {actionType === 'CHANGES' && (
                <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-xl">
                  <h4 className="text-xs font-bold text-amber-900 mb-2">Instructions for Candidate:</h4>
                  <textarea
                    value={changesNotes}
                    onChange={(e) => setChangesNotes(e.target.value)}
                    placeholder="e.g. Please upload clear face photos or update church parish details..."
                    className="w-full text-xs p-2.5 rounded-lg border border-amber-300 bg-white"
                    rows={3}
                  />
                  <div className="mt-3 flex justify-end gap-2">
                    <button onClick={() => setActionType(null)} className="text-xs px-3 py-1.5 bg-stone-200 text-stone-800 rounded-lg">Cancel</button>
                    <button onClick={handleRequestChanges} className="text-xs px-4 py-1.5 bg-amber-700 text-white font-semibold rounded-lg">Send Changes Request</button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-20 text-xs text-stone-400">Select a profile from the left queue.</div>
          )}
        </div>
      </div>
    </div>
  );
}
