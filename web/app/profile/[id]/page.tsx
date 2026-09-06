'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { apiClient } from '../../../lib/api-client';
import { getPhotoUrl, DEFAULT_AVATAR_SVG } from '../../../lib/utils';

export default function CandidateProfileDetailPage() {
  const params = useParams();
  const router = useRouter();
  const profileId = params.id ? parseInt(String(params.id)) : 0;

  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'faith' | 'career' | 'family' | 'lifestyle' | 'preferences'>('faith');
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

        {/* Free Member Preview Notice Banner */}
        {isLocked && !profile.is_admin_override && (
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-blue-600/10 border border-amber-500/30 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🔒</span>
              <div>
                <h4 className="font-extrabold text-amber-300 text-sm">Free Member Preview Mode</h4>
                <p className="text-slate-300 text-xs mt-0.5">
                  You are viewing a summary preview. An active subscription plan is required to unlock complete pastoral testimony, family background, and connect with this candidate.
                </p>
              </div>
            </div>
            <Link
              href="/subscriptions"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold text-xs text-center shrink-0 shadow-md transition-all flex items-center justify-center gap-1.5"
            >
              <span>Upgrade Subscription</span>
              <span>→</span>
            </Link>
          </div>
        )}

        {/* TOP HERO PROFILE HEADER CARD (Basic Preview) */}
        <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-2xl flex flex-col md:flex-row items-stretch gap-6">
          {/* Candidate Photo */}
          <div className="w-full md:w-56 shrink-0 flex flex-col gap-2">
            <div className="w-full h-64 md:h-60 rounded-2xl bg-slate-950 overflow-hidden relative border border-slate-800">
              <img
                src={photos[activePhotoIdx] || DEFAULT_AVATAR_SVG}
                alt={profile.first_name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = DEFAULT_AVATAR_SVG;
                }}
              />

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
                    <img
                      src={img}
                      alt="Thumbnail"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = DEFAULT_AVATAR_SVG;
                      }}
                    />
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
                  {isLocked ? (
                    <span className="inline-flex items-center gap-1 text-amber-400/90 text-[11px] font-semibold bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">
                      <span>🔒</span>
                      <span>Church Info Locked</span>
                    </span>
                  ) : (
                    <span className="text-white font-medium truncate">{profile.church_name || 'Local Fellowship'}</span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-slate-400 font-semibold w-24 shrink-0">Education:</span>
                  <span className="text-white font-medium truncate">{profile.highest_education || 'Graduate'}</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-slate-400 font-semibold w-24 shrink-0">Profession:</span>
                  {isLocked ? (
                    <span className="inline-flex items-center gap-1 text-amber-400/90 text-[11px] font-semibold bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">
                      <span>🔒</span>
                      <span>Profession Locked</span>
                    </span>
                  ) : (
                    <span className="text-white font-medium truncate">{profile.occupation_title || 'Professional'}</span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-slate-400 font-semibold w-24 shrink-0">Location:</span>
                  {isLocked ? (
                    <span className="inline-flex items-center gap-1 text-amber-400/90 text-[11px] font-semibold bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">
                      <span>🔒</span>
                      <span>Location Locked</span>
                    </span>
                  ) : (
                    <span className="text-amber-400/90 font-medium truncate">📍 {profile.district || 'Bidar'}, {profile.state || 'Karnataka'}</span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-slate-400 font-semibold w-24 shrink-0">Annual Income:</span>
                  {isLocked ? (
                    <span className="inline-flex items-center gap-1 text-amber-400/90 text-[11px] font-semibold bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">
                      <span>🔒</span>
                      <span>Package Info Locked</span>
                    </span>
                  ) : (
                    <span className="text-emerald-400 font-medium truncate">
                      {profile.annual_income_min ? (profile.annual_income_min >= 100000 ? `₹${(profile.annual_income_min / 100000).toFixed(1)} LPA+` : `₹${profile.annual_income_min.toLocaleString('en-IN')}`) : 'Confidential'}
                    </span>
                  )}
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
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border shrink-0 ${
                  activeTab === 'faith'
                    ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                }`}
              >
                Church &amp; Faith Testimony
              </button>

              <button
                onClick={() => setActiveTab('career')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border shrink-0 ${
                  activeTab === 'career'
                    ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                }`}
              >
                Education &amp; Career
              </button>

              <button
                onClick={() => setActiveTab('family')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border shrink-0 ${
                  activeTab === 'family'
                    ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                }`}
              >
                Family Background &amp; Roots
              </button>

              <button
                onClick={() => setActiveTab('lifestyle')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border shrink-0 ${
                  activeTab === 'lifestyle'
                    ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                }`}
              >
                Lifestyle &amp; Demographics
              </button>

              <button
                onClick={() => setActiveTab('preferences')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border shrink-0 ${
                  activeTab === 'preferences'
                    ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                }`}
              >
                Partner Preferences
              </button>
            </div>

            {/* Tab Panel Content */}
            <div className="pt-2">
              {/* 1. FAITH & CHURCH TAB */}
              {activeTab === 'faith' && (
                <div className="space-y-4 text-xs">
                  <div>
                    <h4 className="font-bold text-amber-400 text-xs mb-1">Personal Bio:</h4>
                    <p className="text-slate-300 leading-relaxed bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                      {profile.bio || 'Candidate has not added bio statement yet.'}
                    </p>
                  </div>

                  <div>
                    <h4 className="font-bold text-amber-400 text-xs mb-1">Faith &amp; Spiritual Testimony:</h4>
                    <p className="text-slate-300 leading-relaxed bg-slate-950/60 p-3 rounded-xl border border-slate-800 italic">
                      &ldquo;{profile.faith_testimony || 'Baptized and actively serving in our local church fellowship.'}&rdquo;
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
                    <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                      <span className="text-[10px] text-slate-400 font-bold uppercase">Denomination</span>
                      <p className="text-white font-bold">{profile.denomination || 'METHODIST'}</p>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                      <span className="text-[10px] text-slate-400 font-bold uppercase">Sub-Denomination</span>
                      <p className="text-white font-bold">{profile.sub_denomination || 'None'}</p>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                      <span className="text-[10px] text-slate-400 font-bold uppercase">Church / Parish Name</span>
                      <p className="text-white font-bold">{profile.church_name || 'Centenary Methodist Church'}</p>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                      <span className="text-[10px] text-slate-400 font-bold uppercase">Pastor / Priest In-Charge</span>
                      <p className="text-white font-bold">{profile.parish_or_pastor || 'Pastor In-Charge'}</p>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                      <span className="text-[10px] text-slate-400 font-bold uppercase">Baptism Status</span>
                      <p className="text-emerald-400 font-bold">{profile.is_baptized ? '✓ Baptized Christian' : 'Not Baptized'}</p>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                      <span className="text-[10px] text-slate-400 font-bold uppercase">Born Again Experience</span>
                      <p className="text-white font-bold">{profile.is_born_again ? '✓ Yes, Born Again' : 'Traditional Upbringing'}</p>
                    </div>

                    {profile.church_activity && (
                      <div className="sm:col-span-2 lg:col-span-3 p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                        <span className="text-[10px] text-slate-400 font-bold uppercase">Church Involvement &amp; Ministries</span>
                        <p className="text-white font-medium">{profile.church_activity}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* 2. CAREER & EDUCATION TAB */}
              {activeTab === 'career' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Highest Qualification</span>
                    <p className="text-white font-bold">{profile.highest_education || 'Graduate'}</p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Education Field</span>
                    <p className="text-white font-bold">{profile.education_field || 'Computer Science & Engineering'}</p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                    <span className="text-[10px] text-slate-400 font-bold uppercase">College / Institution</span>
                    <p className="text-white font-bold">{profile.institution || 'Recognized University'}</p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Occupation Title</span>
                    <p className="text-white font-bold">{profile.occupation_title || 'Software Engineer'}</p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Employment Sector</span>
                    <p className="text-white font-bold">{profile.employed_in || 'Private Sector'}</p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Work Location</span>
                    <p className="text-white font-bold">{profile.work_location || `${profile.district || 'Bidar'}, ${profile.state || 'Karnataka'}`}</p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1 sm:col-span-2">
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Annual Income Package</span>
                    <p className="text-emerald-400 font-extrabold text-sm">
                      {profile.annual_income_min
                        ? (profile.annual_income_min >= 100000
                            ? `₹${(profile.annual_income_min / 100000).toFixed(1)} LPA+ (${profile.annual_income_currency || 'INR'})`
                            : `₹${profile.annual_income_min.toLocaleString('en-IN')} PA`)
                        : 'Confidential / Disclosed on request'}
                    </p>
                  </div>
                </div>
              )}

              {/* 3. FAMILY TAB */}
              {activeTab === 'family' && (
                <div className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                      <span className="text-[10px] text-slate-400 font-bold uppercase">Father&apos;s Name</span>
                      <p className="text-white font-bold">{profile.father_name || 'Mr. Family Head'}</p>
                      <span className="text-[11px] text-slate-400 block">{profile.father_occupation || 'Retired / Employed'}</span>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                      <span className="text-[10px] text-slate-400 font-bold uppercase">Mother&apos;s Name</span>
                      <p className="text-white font-bold">{profile.mother_name || 'Mrs. Family Matron'}</p>
                      <span className="text-[11px] text-slate-400 block">{profile.mother_occupation || 'Homemaker'}</span>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                      <span className="text-[10px] text-slate-400 font-bold uppercase">Family Standing</span>
                      <p className="text-white font-bold">{profile.family_status ? profile.family_status.replace('_', ' ') : 'UPPER MIDDLE CLASS'}</p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                      <span className="text-[10px] text-slate-400 font-bold uppercase">Family Values</span>
                      <p className="text-white font-bold">{profile.family_values || 'MODERATE / TRADITIONAL'}</p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                      <span className="text-[10px] text-slate-400 font-bold uppercase">Brothers</span>
                      <p className="text-white font-bold">
                        {profile.brothers_count ?? 0} {profile.married_brothers_count ? `(${profile.married_brothers_count} Married)` : '(None Married)'}
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                      <span className="text-[10px] text-slate-400 font-bold uppercase">Sisters</span>
                      <p className="text-white font-bold">
                        {profile.sisters_count ?? 0} {profile.married_sisters_count ? `(${profile.married_sisters_count} Married)` : '(None Married)'}
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                      <span className="text-[10px] text-slate-400 font-bold uppercase">Native Place</span>
                      <p className="text-white font-bold">{profile.native_place || profile.district || 'Bidar'}</p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                      <span className="text-[10px] text-slate-400 font-bold uppercase">Residence Type</span>
                      <p className="text-white font-bold">{profile.residence_type || 'Own House'}</p>
                    </div>
                  </div>

                  {profile.about_family && (
                    <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                      <span className="text-[10px] text-amber-400 font-bold uppercase">About Family:</span>
                      <p className="text-slate-300 leading-relaxed">{profile.about_family}</p>
                    </div>
                  )}
                </div>
              )}

              {/* 4. LIFESTYLE & DEMOGRAPHICS TAB */}
              {activeTab === 'lifestyle' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Mother Tongue</span>
                    <p className="text-white font-bold">{profile.mother_tongue || 'Kannada'}</p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Dietary Habits</span>
                    <p className="text-white font-bold">{profile.diet ? profile.diet.replace('_', ' ') : 'NON VEGETARIAN'}</p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Smoking</span>
                    <p className="text-white font-bold">{profile.smoking || 'NO'}</p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Drinking</span>
                    <p className="text-white font-bold">{profile.drinking || 'NO'}</p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Physical Status</span>
                    <p className="text-white font-bold">{profile.physical_status || 'NORMAL'}</p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Height &amp; Weight</span>
                    <p className="text-white font-bold">
                      {profile.height_cm ? `${profile.height_cm} cm (${Math.floor(profile.height_cm / 30.48)}'${Math.round((profile.height_cm % 30.48) / 2.54)}")` : '165 cm'} • {profile.weight_kg ? `${profile.weight_kg} kg` : 'Weight not disclosed'}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Citizenship</span>
                    <p className="text-white font-bold">{profile.citizenship || 'Indian'}</p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Hobbies &amp; Interests</span>
                    <p className="text-white font-bold">{profile.hobbies || 'Church Choir, Reading, Traveling'}</p>
                  </div>
                </div>
              )}

              {/* 5. PARTNER PREFERENCES TAB */}
              {activeTab === 'preferences' && (
                <div className="space-y-3 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                      <span className="text-[10px] text-slate-400 font-bold uppercase">Preferred Age Range</span>
                      <p className="text-amber-400 font-bold">
                        {profile.partner_preferences?.age_min || 21} – {profile.partner_preferences?.age_max || 32} Years
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                      <span className="text-[10px] text-slate-400 font-bold uppercase">Preferred Height</span>
                      <p className="text-white font-bold">
                        {profile.partner_preferences?.height_min_cm || 150} cm – {profile.partner_preferences?.height_max_cm || 185} cm
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1 sm:col-span-2 lg:col-span-1">
                      <span className="text-[10px] text-slate-400 font-bold uppercase">Preferred Denominations</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {(profile.partner_preferences?.denomination || ['METHODIST', 'CSI', 'CATHOLIC', 'BAPTIST']).map((d: string) => (
                          <span key={d} className="px-2 py-0.5 rounded-md bg-blue-950 text-blue-300 border border-blue-800 text-[10px] font-bold">
                            {d}
                          </span>
                        ))}
                      </div>
                    </div>
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
