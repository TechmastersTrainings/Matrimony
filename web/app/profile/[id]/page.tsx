'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { apiClient } from '../../../lib/api-client';
import { getPhotoUrl } from '../../../lib/utils';

export default function CandidateProfileDetailPage() {
  const params = useParams();
  const router = useRouter();
  const profileId = params.id ? parseInt(String(params.id)) : 0;

  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'faith' | 'career' | 'family'>('faith');
  const [shortlisted, setShortlisted] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await apiClient.getCandidateProfile(profileId);
        setProfile(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load candidate profile.');
      } finally {
        setLoading(false);
      }
    }
    if (profileId) loadData();
  }, [profileId]);

  const handleSendInterest = async () => {
    if (!profile) return;
    if (isLocked) {
      router.push('/subscriptions');
      return;
    }
    try {
      await apiClient.sendInterest(profile.user_id);
      setActionMessage('✓ Matrimonial interest sent successfully. You will be notified when they respond.');
    } catch (err: any) {
      if (err.message?.includes('subscription') || err.status === 402) {
        router.push('/subscriptions');
      } else {
        setActionMessage(`Notice: ${err.message}`);
      }
    }
  };

  const handleRequestReveal = async () => {
    if (!profile) return;
    if (isLocked) {
      router.push('/subscriptions');
      return;
    }
    try {
      const res = await apiClient.requestContactReveal(profile.user_id);
      setActionMessage(res.message || '✓ Contact reveal request submitted. Once accepted, mutual verification unlocks phone and email.');
    } catch (err: any) {
      if (err.message?.includes('subscription') || err.status === 402) {
        router.push('/subscriptions');
      } else {
        setActionMessage(`Notice: ${err.message}`);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-slate-950 text-white">
        <div className="w-9 h-9 rounded-xl bg-amber-500 text-slate-950 font-black flex items-center justify-center animate-pulse mb-3 text-xs">
          CM
        </div>
        <p className="text-xs text-slate-400 font-bold">Loading Candidate Details...</p>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center py-12 px-4 bg-slate-950 text-white">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md mx-auto text-center space-y-4 shadow-2xl">
          <div className="w-10 h-10 rounded-full bg-red-950 text-red-400 border border-red-800 flex items-center justify-center mx-auto text-sm font-bold">
            !
          </div>
          <h2 className="text-base font-bold text-white">Candidate Profile Protected</h2>
          <p className="text-xs text-slate-400">{error || 'This profile is currently under review or private.'}</p>
          <Link
            href="/discover"
            className="inline-block bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-extrabold px-5 py-2 rounded-xl shadow-lg transition-all"
          >
            Back to Search Profiles
          </Link>
        </div>
      </div>
    );
  }

  const isLocked = profile.is_locked || profile.requires_subscription;

  const photos: string[] = profile.photos && profile.photos.length > 0
    ? profile.photos.map((p: any) => getPhotoUrl(p.r2_url || p.url || p))
    : [getPhotoUrl(profile.primary_photo || '')].filter(Boolean);

  return (
    <div className="relative min-h-[calc(100vh-80px)] py-8 px-4 sm:px-6 lg:px-8 bg-slate-950 text-white font-sans overflow-hidden">
      {/* Ambient Glows */}
      <div className="absolute top-10 left-1/4 w-72 h-72 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10 space-y-5">
        {/* Navigation Breadcrumb & Code */}
        <div className="flex items-center justify-between text-xs">
          <Link
            href="/discover"
            className="font-bold text-amber-400 hover:underline flex items-center gap-1"
          >
            <span>←</span> Back to Search Profiles
          </Link>
          <span className="font-mono text-[11px] text-slate-400 bg-slate-900 border border-slate-800 px-2.5 py-1 rounded-lg">
            Profile Code: CM-{profile.id}
          </span>
        </div>

        {profile.is_admin_override && (
          <div className="p-3.5 rounded-2xl bg-amber-500/15 border border-amber-500/40 text-amber-300 text-xs font-bold flex flex-wrap items-center justify-between gap-2 shadow-lg">
            <span className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-black text-xs">👑</span>
              <span>Admin Full Access Override — Active Subscription Not Required</span>
            </span>
            <span className="text-[11px] text-slate-300 font-mono">ROLE: ADMIN</span>
          </div>
        )}

        {actionMessage && (
          <div className="p-3 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-semibold">
            {actionMessage}
          </div>
        )}

        {/* TOP HERO PROFILE HEADER CARD (Basic Preview) */}
        <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-2xl flex flex-col md:flex-row items-stretch gap-6">
          {/* Candidate Photo */}
          <div className="w-full md:w-56 shrink-0 flex flex-col gap-2">
            <div className="w-full h-64 md:h-60 rounded-2xl bg-slate-950 overflow-hidden relative border border-slate-800">
              {photos[activePhotoIdx] ? (
                <img
                  src={photos[activePhotoIdx]}
                  alt={profile.first_name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-slate-500 text-xs gap-1.5">
                  <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-amber-400 font-bold">
                    CM
                  </div>
                  <span>Photo Protected</span>
                </div>
              )}

              <div className="absolute top-2.5 left-2.5 bg-emerald-950/90 backdrop-blur-md text-emerald-300 text-[10px] font-extrabold px-2 py-0.5 rounded-md border border-emerald-800/80">
                ✓ Verified
              </div>

              <div className="absolute top-2.5 right-2.5 bg-slate-950/80 backdrop-blur-md text-amber-400 text-[10px] font-bold px-2 py-0.5 rounded-md border border-slate-800">
                {profile.denomination || 'Christian'}
              </div>
            </div>

            {/* Thumbnail Gallery (Paid Subscribers / Admin Only) */}
            {!isLocked && photos.length > 1 && (
              <div className="flex gap-1.5 overflow-x-auto pb-0.5">
                {photos.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActivePhotoIdx(idx)}
                    className={`w-11 h-11 rounded-lg overflow-hidden border-2 shrink-0 transition-all ${
                      activePhotoIdx === idx ? 'border-amber-400 ring-1 ring-amber-500/20' : 'border-slate-800 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Preview Attributes Grid */}
          <div className="flex-1 flex flex-col justify-between space-y-4">
            <div>
              {/* Header Line */}
              <div className="flex flex-wrap items-start justify-between gap-3 pb-3 border-b border-slate-800">
                <div>
                  <h1 className="text-xl sm:text-2xl font-extrabold text-white">
                    {profile.first_name} {profile.last_name}
                  </h1>
                  <p className="text-xs text-amber-400 font-semibold mt-0.5">
                    {profile.age ? `${profile.age} Yrs` : '—'}, {profile.height_cm ? `${Math.floor(profile.height_cm / 30.48)}'${Math.round((profile.height_cm % 30.48) / 2.54)}"` : 'Height N/A'} • {profile.marital_status ? profile.marital_status.replace('_', ' ') : 'Never Married'}
                  </p>
                </div>

                <button
                  onClick={() => setShortlisted(!shortlisted)}
                  className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 ${
                    shortlisted
                      ? 'bg-rose-950/80 border-rose-700 text-rose-400'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-rose-400'
                  }`}
                >
                  <span>{shortlisted ? '♥ Shortlisted' : '♡ Save'}</span>
                </button>
              </div>

              {/* High-Density Preview Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-xs pt-3">
                <div className="flex items-center gap-2">
                  <span className="text-slate-400 font-semibold w-24 shrink-0">Denomination:</span>
                  <span className="text-white font-medium truncate">{profile.denomination || 'Christian'}</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-slate-400 font-semibold w-24 shrink-0">Church:</span>
                  <span className="text-white font-medium truncate">{isLocked ? '🔒 Protected' : (profile.church_name || 'Local Fellowship')}</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-slate-400 font-semibold w-24 shrink-0">Education:</span>
                  <span className="text-white font-medium truncate">{profile.highest_education || 'Graduate'}</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-slate-400 font-semibold w-24 shrink-0">Profession:</span>
                  <span className="text-white font-medium truncate">{profile.occupation_title || 'Professional'}</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-slate-400 font-semibold w-24 shrink-0">Location:</span>
                  <span className="text-amber-400/90 font-medium truncate">📍 {profile.district || 'Bidar'}, {profile.state || 'Karnataka'}</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-slate-400 font-semibold w-24 shrink-0">Annual Income:</span>
                  <span className="text-emerald-400 font-medium truncate">
                    {isLocked ? '🔒 Protected' : (profile.annual_income_min ? `₹${(profile.annual_income_min / 100000).toFixed(1)} LPA+` : 'Confidential')}
                  </span>
                </div>
              </div>
            </div>

            {/* Pastoral Verification Banner */}
            <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-[11px] text-slate-300 flex flex-wrap items-center gap-3">
              <span className="text-emerald-400 font-extrabold flex items-center gap-1">
                <span>✓</span> Pastoral Verified
              </span>
              <span className="text-slate-700">•</span>
              <span>Church Membership Active</span>
              <span className="text-slate-700">•</span>
              <span>Controlled Contact Reveal</span>
            </div>

            {/* Admin Unlocked Direct Contact Info Box */}
            {profile.is_admin_override && (profile.mobile_number || profile.email) && (
              <div className="p-4 rounded-2xl bg-slate-950/90 border border-amber-500/40 text-xs space-y-2">
                <div className="flex items-center justify-between text-amber-400 font-bold uppercase tracking-wider text-[10px]">
                  <span>👑 Admin Direct Candidate Contact</span>
                  <span>UNLOCKED</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 font-medium text-slate-200">
                  {profile.mobile_number && (
                    <div className="flex items-center gap-2">
                      <span className="text-amber-400">📞 Phone:</span>
                      <a href={`tel:${profile.mobile_number}`} className="underline hover:text-white font-mono">
                        {profile.mobile_number}
                      </a>
                    </div>
                  )}
                  {profile.email && (
                    <div className="flex items-center gap-2">
                      <span className="text-amber-400">✉️ Email:</span>
                      <a href={`mailto:${profile.email}`} className="underline hover:text-white font-mono">
                        {profile.email}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* CTAs Bar */}
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <button
                type="button"
                onClick={handleSendInterest}
                className="w-full sm:flex-1 py-3 px-5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold text-xs text-center transition-all shadow-md shadow-amber-950/30 flex items-center justify-center gap-1.5"
              >
                <span>Express Interest</span>
                <span>➔</span>
              </button>

              <button
                type="button"
                onClick={handleRequestReveal}
                className="w-full sm:flex-1 py-3 px-5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold text-center border border-slate-700 transition-all flex items-center justify-center gap-1.5"
              >
                <span>Request Contact Reveal</span>
              </button>
            </div>
          </div>
        </div>

        {/* DETAILS SECTION (Protected Gate or Full Details) */}
        {isLocked ? (
          /* Locked Subscription Gate Banner */
          <div className="bg-slate-900/90 backdrop-blur-xl border border-amber-500/40 rounded-3xl p-8 shadow-2xl text-center space-y-5">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/20 text-amber-400 font-black flex items-center justify-center mx-auto text-2xl shadow-lg border border-amber-500/30">
              🔒
            </div>

            <div className="space-y-2 max-w-md mx-auto">
              <h3 className="text-lg font-extrabold text-white">
                Protected Matrimonial Information
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Subscribe to an active membership plan to unlock full bio, church credentials, pastor name, and family background.
              </p>
            </div>

            <div>
              <Link
                href="/subscriptions"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold text-xs shadow-xl shadow-amber-950/40 transition-all transform hover:-translate-y-0.5"
              >
                <span>Upgrade to Active Subscription Plan →</span>
              </Link>
            </div>
          </div>
        ) : (
          /* Full Details Tab Inspector (Active Paid Subscriber OR Admin) */
          <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-2xl space-y-4">
            {/* Tabs Bar */}
            <div className="flex items-center gap-2 pb-3 border-b border-slate-800 overflow-x-auto">
              <button
                onClick={() => setActiveTab('faith')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                  activeTab === 'faith'
                    ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                }`}
              >
                Church &amp; Faith Testimony
              </button>

              <button
                onClick={() => setActiveTab('career')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                  activeTab === 'career'
                    ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                }`}
              >
                Education &amp; Career
              </button>

              <button
                onClick={() => setActiveTab('family')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                  activeTab === 'family'
                    ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                }`}
              >
                Family &amp; Demographics
              </button>
            </div>

            {/* Tab Panel Content */}
            <div className="pt-2">
              {activeTab === 'faith' && (
                <div className="space-y-4 text-xs">
                  <div>
                    <h4 className="font-bold text-amber-400 text-xs mb-1">Personal Bio:</h4>
                    <p className="text-slate-300 leading-relaxed">{profile.bio || 'Candidate has not added bio details yet.'}</p>
                  </div>

                  {profile.faith_testimony && (
                    <div>
                      <h4 className="font-bold text-amber-400 text-xs mb-1">Faith &amp; Spiritual Testimony:</h4>
                      <p className="text-slate-300 leading-relaxed">{profile.faith_testimony}</p>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                      <span className="text-[10px] text-slate-400 font-bold uppercase">Church / Parish Name</span>
                      <p className="text-white font-bold">{profile.church_name || '—'}</p>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                      <span className="text-[10px] text-slate-400 font-bold uppercase">Pastor / Priest In-Charge</span>
                      <p className="text-white font-bold">{profile.parish_or_pastor || '—'}</p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'career' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Highest Education</span>
                    <p className="text-white font-bold">{profile.highest_education || '—'}</p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Education Field</span>
                    <p className="text-white font-bold">{profile.education_field || '—'}</p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Occupation Title</span>
                    <p className="text-white font-bold">{profile.occupation_title || '—'}</p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Employment Sector</span>
                    <p className="text-white font-bold">{profile.employed_in || '—'}</p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Work Location</span>
                    <p className="text-white font-bold">{profile.work_location || `${profile.district}, ${profile.state}`}</p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Annual Income</span>
                    <p className="text-emerald-400 font-bold">
                      {profile.annual_income_min ? `₹${profile.annual_income_min.toLocaleString()} PA` : 'Confidential'}
                    </p>
                  </div>
                </div>
              )}

              {activeTab === 'family' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Father&apos;s Occupation</span>
                    <p className="text-white font-bold">{profile.father_occupation || '—'}</p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Mother&apos;s Occupation</span>
                    <p className="text-white font-bold">{profile.mother_occupation || '—'}</p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Family Values</span>
                    <p className="text-white font-bold">{profile.family_values || 'Moderate / Traditional'}</p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Native Place</span>
                    <p className="text-white font-bold">{profile.native_place || profile.district || '—'}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
