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
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-[#fdfbf7] text-charcoal-900">
        <div className="w-10 h-10 rounded-xl bg-burgundy-700 text-gold-300 font-black flex items-center justify-center animate-pulse mb-3 text-xs shadow-md">
          CM
        </div>
        <p className="text-xs text-charcoal-600 font-bold">Loading Candidate Details...</p>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center py-12 px-4 bg-[#fdfbf7] text-charcoal-900">
        <div className="bg-white border border-[#ece2d1] rounded-2xl p-6 max-w-md mx-auto text-center space-y-4 shadow-sm">
          <div className="w-10 h-10 rounded-full bg-rose-50 text-rose-700 border border-rose-200 flex items-center justify-center mx-auto text-sm font-bold">
            !
          </div>
          <h2 className="text-base font-serif font-bold text-charcoal-900">Candidate Profile Protected</h2>
          <p className="text-xs text-charcoal-600">{error || 'This profile is currently under review or private.'}</p>
          <Link
            href="/discover"
            className="inline-block bg-gradient-to-r from-burgundy-700 to-burgundy-800 hover:from-burgundy-600 hover:to-burgundy-700 text-white text-xs font-extrabold px-5 py-2 rounded-xl shadow-md transition-all"
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
    <div className="relative min-h-[calc(100vh-80px)] py-8 px-4 sm:px-6 lg:px-8 bg-[#fdfbf7] text-charcoal-900 font-sans overflow-hidden">
      {/* Ambient Glows */}
      <div className="absolute top-10 left-1/4 w-72 h-72 bg-gold-400/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-72 h-72 bg-burgundy-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10 space-y-5">
        {/* Navigation Breadcrumb & Code */}
        <div className="flex items-center justify-between text-xs">
          <Link
            href="/discover"
            className="font-bold text-burgundy-700 hover:underline flex items-center gap-1"
          >
            <span>←</span> Back to Search Profiles
          </Link>
          <span className="font-mono text-[11px] text-charcoal-600 bg-white border border-[#ece2d1] px-2.5 py-1 rounded-lg shadow-xs">
            Profile Code: CM-{profile.id}
          </span>
        </div>

        {profile.is_admin_override && (
          <div className="p-3.5 rounded-2xl bg-gold-50 border border-gold-200 text-gold-900 text-xs font-bold flex flex-wrap items-center justify-between gap-2 shadow-xs">
            <span className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-gold-500 text-white flex items-center justify-center font-black text-xs">👑</span>
              <span>Admin Full Access Override — Active Subscription Not Required</span>
            </span>
            <span className="text-[11px] text-charcoal-600 font-mono">ROLE: ADMIN</span>
          </div>
        )}

        {actionMessage && (
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
            {actionMessage}
          </div>
        )}

        {/* Free Member Preview Notice Banner */}
        {isLocked && !profile.is_admin_override && (
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-gold-50 via-[#faf6ee] to-rose-50 border border-gold-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🔒</span>
              <div>
                <h4 className="font-serif font-extrabold text-burgundy-900 text-sm">Free Member Preview Mode</h4>
                <p className="text-charcoal-600 text-xs mt-0.5">
                  You are viewing a summary preview. An active subscription plan is required to unlock complete pastoral testimony, family background, and connect with this candidate.
                </p>
              </div>
            </div>
            <Link
              href="/subscriptions"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-burgundy-700 to-burgundy-800 hover:from-burgundy-600 hover:to-burgundy-700 text-white font-extrabold text-xs text-center shrink-0 shadow-md transition-all flex items-center justify-center gap-1.5"
            >
              <span>Upgrade Subscription</span>
              <span>→</span>
            </Link>
          </div>
        )}

        {/* TOP HERO PROFILE HEADER CARD (Basic Preview) */}
        <div className="bg-white border border-[#ece2d1] rounded-3xl p-5 sm:p-6 shadow-sm flex flex-col md:flex-row items-stretch gap-6">
          {/* Candidate Photo */}
          <div className="w-full md:w-56 shrink-0 flex flex-col gap-2">
            <div className="w-full h-64 md:h-60 rounded-2xl bg-[#faf6ee] overflow-hidden relative border border-[#ece2d1]">
              <img
                src={photos[activePhotoIdx] || DEFAULT_AVATAR_SVG}
                alt={profile.first_name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = DEFAULT_AVATAR_SVG;
                }}
              />

              <div className="absolute top-2.5 left-2.5 bg-emerald-50/95 backdrop-blur-md text-emerald-800 text-[10px] font-extrabold px-2 py-0.5 rounded-md border border-emerald-200 shadow-xs">
                ✓ Verified
              </div>

              <div className="absolute top-2.5 right-2.5 bg-white/95 backdrop-blur-md text-burgundy-800 text-[10px] font-bold px-2 py-0.5 rounded-md border border-[#ece2d1] shadow-xs">
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
                      activePhotoIdx === idx ? 'border-burgundy-700 ring-1 ring-burgundy-700/20' : 'border-[#ece2d1] opacity-70 hover:opacity-100'
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
              <div className="flex flex-wrap items-start justify-between gap-3 pb-3 border-b border-[#ece2d1]">
                <div>
                  <h1 className="text-xl sm:text-2xl font-serif font-extrabold text-charcoal-900">
                    {profile.first_name} {profile.last_name}
                  </h1>
                  <p className="text-xs text-charcoal-600 font-semibold mt-0.5">
                    {profile.age ? `${profile.age} Yrs` : '—'}, {profile.height_cm ? `${Math.floor(profile.height_cm / 30.48)}'${Math.round((profile.height_cm % 30.48) / 2.54)}"` : 'Height N/A'} • {profile.marital_status ? profile.marital_status.replace('_', ' ') : 'Never Married'}
                  </p>
                </div>

                <button
                  onClick={() => setShortlisted(!shortlisted)}
                  className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 ${
                    shortlisted
                      ? 'bg-rose-50 border-rose-300 text-rose-600'
                      : 'bg-white border-[#ece2d1] text-charcoal-600 hover:text-rose-600 hover:border-rose-200'
                  }`}
                >
                  <span>{shortlisted ? '♥ Shortlisted' : '♡ Save'}</span>
                </button>
              </div>

              {/* High-Density Preview Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-xs pt-3">
                <div className="flex items-center gap-2">
                  <span className="text-charcoal-500 font-semibold w-24 shrink-0">Denomination:</span>
                  <span className="text-charcoal-900 font-medium truncate">{profile.denomination || '—'}</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-charcoal-500 font-semibold w-24 shrink-0">Church:</span>
                  {isLocked ? (
                    <span className="inline-flex items-center gap-1 text-gold-800 text-[11px] font-semibold bg-gold-50 px-2 py-0.5 rounded-md border border-gold-200">
                      <span>🔒</span>
                      <span>Church Info Locked</span>
                    </span>
                  ) : (
                    <span className="text-charcoal-900 font-medium truncate">{profile.church_name || '—'}</span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-charcoal-500 font-semibold w-24 shrink-0">Education:</span>
                  <span className="text-charcoal-900 font-medium truncate">{profile.highest_education || '—'}</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-charcoal-500 font-semibold w-24 shrink-0">Profession:</span>
                  {isLocked ? (
                    <span className="inline-flex items-center gap-1 text-gold-800 text-[11px] font-semibold bg-gold-50 px-2 py-0.5 rounded-md border border-gold-200">
                      <span>🔒</span>
                      <span>Profession Locked</span>
                    </span>
                  ) : (
                    <span className="text-charcoal-900 font-medium truncate">{profile.occupation_title || '—'}</span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-charcoal-500 font-semibold w-24 shrink-0">Location:</span>
                  {isLocked ? (
                    <span className="inline-flex items-center gap-1 text-gold-800 text-[11px] font-semibold bg-gold-50 px-2 py-0.5 rounded-md border border-gold-200">
                      <span>🔒</span>
                      <span>Location Locked</span>
                    </span>
                  ) : (
                    <span className="text-charcoal-800 font-medium truncate">📍 {profile.district || '—'}{profile.state ? `, ${profile.state}` : ''}</span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-charcoal-500 font-semibold w-24 shrink-0">Annual Income:</span>
                  {isLocked ? (
                    <span className="inline-flex items-center gap-1 text-gold-800 text-[11px] font-semibold bg-gold-50 px-2 py-0.5 rounded-md border border-gold-200">
                      <span>🔒</span>
                      <span>Package Info Locked</span>
                    </span>
                  ) : (
                    <span className="text-emerald-700 font-medium truncate">
                      {profile.annual_income_min ? (profile.annual_income_min >= 100000 ? `₹${(profile.annual_income_min / 100000).toFixed(1)} LPA+` : `₹${profile.annual_income_min.toLocaleString('en-IN')}`) : 'Confidential'}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Pastoral Verification Banner */}
            <div className="p-2.5 rounded-xl bg-[#faf6ee] border border-[#ece2d1] text-[11px] text-charcoal-700 flex flex-wrap items-center gap-3">
              <span className="text-emerald-700 font-extrabold flex items-center gap-1">
                <span>✓</span> Pastoral Verified
              </span>
              <span className="text-charcoal-300">•</span>
              <span>Church Membership Active</span>
              <span className="text-charcoal-300">•</span>
              <span>Controlled Contact Reveal</span>
            </div>

            {/* Admin Unlocked Direct Contact Info Box */}
            {profile.is_admin_override && (profile.mobile_number || profile.email) && (
              <div className="p-4 rounded-2xl bg-gold-50 border border-gold-200 text-xs space-y-2">
                <div className="flex items-center justify-between text-burgundy-800 font-bold uppercase tracking-wider text-[10px]">
                  <span>👑 Admin Direct Candidate Contact</span>
                  <span>UNLOCKED</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 font-medium text-charcoal-800">
                  {profile.mobile_number && (
                    <div className="flex items-center gap-2">
                      <span className="text-burgundy-700">📞 Phone:</span>
                      <a href={`tel:${profile.mobile_number}`} className="underline hover:text-burgundy-900 font-mono">
                        {profile.mobile_number}
                      </a>
                    </div>
                  )}
                  {profile.email && (
                    <div className="flex items-center gap-2">
                      <span className="text-burgundy-700">✉️ Email:</span>
                      <a href={`mailto:${profile.email}`} className="underline hover:text-burgundy-900 font-mono">
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
                className="w-full sm:flex-1 py-3 px-5 rounded-xl bg-gradient-to-r from-burgundy-700 to-burgundy-800 hover:from-burgundy-600 hover:to-burgundy-700 text-white font-extrabold text-xs text-center transition-all shadow-md shadow-burgundy-900/10 flex items-center justify-center gap-1.5"
              >
                <span>Express Interest</span>
                <span>➔</span>
              </button>

              <button
                type="button"
                onClick={handleRequestReveal}
                className="w-full sm:flex-1 py-3 px-5 rounded-xl bg-white hover:bg-[#faf6ee] text-charcoal-800 text-xs font-bold text-center border border-[#ece2d1] transition-all flex items-center justify-center gap-1.5"
              >
                <span>Request Contact Reveal</span>
              </button>
            </div>
          </div>
        </div>

        {/* DETAILS SECTION (Protected Gate or Full Details) */}
        {isLocked ? (
          /* Locked Subscription Gate Banner */
          <div className="bg-white border border-gold-300 rounded-3xl p-8 shadow-sm text-center space-y-5">
            <div className="w-14 h-14 rounded-2xl bg-gold-50 text-gold-700 font-black flex items-center justify-center mx-auto text-2xl shadow-xs border border-gold-200">
              🔒
            </div>

            <div className="space-y-2 max-w-md mx-auto">
              <h3 className="text-lg font-serif font-extrabold text-charcoal-900">
                Protected Matrimonial Information
              </h3>
              <p className="text-xs text-charcoal-600 leading-relaxed">
                Subscribe to an active membership plan to unlock full bio, church credentials, pastor name, and family background.
              </p>
            </div>

            <div>
              <Link
                href="/subscriptions"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-burgundy-700 to-burgundy-800 hover:from-burgundy-600 hover:to-burgundy-700 text-white font-extrabold text-xs shadow-md transition-all transform hover:-translate-y-0.5"
              >
                <span>Upgrade to Active Subscription Plan →</span>
              </Link>
            </div>
          </div>
        ) : (
          /* Full Details Tab Inspector (Active Paid Subscriber OR Admin) */
          <div className="bg-white border border-[#ece2d1] rounded-3xl p-5 sm:p-6 shadow-sm space-y-4">
            {/* Tabs Bar */}
            <div className="flex items-center gap-2 pb-3 border-b border-[#ece2d1] overflow-x-auto">
              <button
                onClick={() => setActiveTab('faith')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border shrink-0 ${
                  activeTab === 'faith'
                    ? 'bg-burgundy-700 text-white border-burgundy-700 shadow-sm'
                    : 'bg-[#faf6ee] text-charcoal-600 border-[#ece2d1] hover:text-burgundy-800'
                }`}
              >
                Church &amp; Faith Testimony
              </button>

              <button
                onClick={() => setActiveTab('career')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border shrink-0 ${
                  activeTab === 'career'
                    ? 'bg-burgundy-700 text-white border-burgundy-700 shadow-sm'
                    : 'bg-[#faf6ee] text-charcoal-600 border-[#ece2d1] hover:text-burgundy-800'
                }`}
              >
                Education &amp; Career
              </button>

              <button
                onClick={() => setActiveTab('family')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border shrink-0 ${
                  activeTab === 'family'
                    ? 'bg-burgundy-700 text-white border-burgundy-700 shadow-sm'
                    : 'bg-[#faf6ee] text-charcoal-600 border-[#ece2d1] hover:text-burgundy-800'
                }`}
              >
                Family Background &amp; Roots
              </button>

              <button
                onClick={() => setActiveTab('lifestyle')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border shrink-0 ${
                  activeTab === 'lifestyle'
                    ? 'bg-burgundy-700 text-white border-burgundy-700 shadow-sm'
                    : 'bg-[#faf6ee] text-charcoal-600 border-[#ece2d1] hover:text-burgundy-800'
                }`}
              >
                Lifestyle &amp; Demographics
              </button>

              <button
                onClick={() => setActiveTab('preferences')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border shrink-0 ${
                  activeTab === 'preferences'
                    ? 'bg-burgundy-700 text-white border-burgundy-700 shadow-sm'
                    : 'bg-[#faf6ee] text-charcoal-600 border-[#ece2d1] hover:text-burgundy-800'
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
                    <h4 className="font-serif font-bold text-burgundy-800 text-xs mb-1">Personal Bio:</h4>
                    <p className="text-charcoal-700 leading-relaxed bg-[#faf6ee] p-3 rounded-xl border border-[#ece2d1]">
                      {profile.bio || 'Candidate has not added bio statement yet.'}
                    </p>
                  </div>

                  <div>
                    <h4 className="font-serif font-bold text-burgundy-800 text-xs mb-1">Faith &amp; Spiritual Testimony:</h4>
                    <p className="text-charcoal-700 leading-relaxed bg-[#faf6ee] p-3 rounded-xl border border-[#ece2d1] italic">
                      {profile.faith_testimony ? `“${profile.faith_testimony}”` : 'No faith testimony added yet.'}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
                    <div className="p-3 rounded-xl bg-[#faf6ee] border border-[#ece2d1] space-y-1">
                      <span className="text-[10px] text-charcoal-500 font-bold uppercase">Denomination</span>
                      <p className="text-charcoal-900 font-bold">{profile.denomination || '—'}</p>
                    </div>

                    <div className="p-3 rounded-xl bg-[#faf6ee] border border-[#ece2d1] space-y-1">
                      <span className="text-[10px] text-charcoal-500 font-bold uppercase">Sub-Denomination</span>
                      <p className="text-charcoal-900 font-bold">{profile.sub_denomination || '—'}</p>
                    </div>

                    <div className="p-3 rounded-xl bg-[#faf6ee] border border-[#ece2d1] space-y-1">
                      <span className="text-[10px] text-charcoal-500 font-bold uppercase">Church / Parish Name</span>
                      <p className="text-charcoal-900 font-bold">{profile.church_name || '—'}</p>
                    </div>

                    <div className="p-3 rounded-xl bg-[#faf6ee] border border-[#ece2d1] space-y-1">
                      <span className="text-[10px] text-charcoal-500 font-bold uppercase">Pastor / Priest In-Charge</span>
                      <p className="text-charcoal-900 font-bold">{profile.parish_or_pastor || '—'}</p>
                    </div>

                    <div className="p-3 rounded-xl bg-[#faf6ee] border border-[#ece2d1] space-y-1">
                      <span className="text-[10px] text-charcoal-500 font-bold uppercase">Baptism Status</span>
                      <p className="text-emerald-700 font-bold">{profile.is_baptized ? '✓ Baptized Christian' : 'Not Baptized'}</p>
                    </div>

                    <div className="p-3 rounded-xl bg-[#faf6ee] border border-[#ece2d1] space-y-1">
                      <span className="text-[10px] text-charcoal-500 font-bold uppercase">Born Again Experience</span>
                      <p className="text-charcoal-900 font-bold">{profile.is_born_again ? '✓ Yes, Born Again' : 'Traditional Upbringing'}</p>
                    </div>

                    {profile.church_activity && (
                      <div className="sm:col-span-2 lg:col-span-3 p-3 rounded-xl bg-[#faf6ee] border border-[#ece2d1] space-y-1">
                        <span className="text-[10px] text-charcoal-500 font-bold uppercase">Church Involvement &amp; Ministries</span>
                        <p className="text-charcoal-900 font-medium">{profile.church_activity}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* 2. CAREER & EDUCATION TAB */}
              {activeTab === 'career' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
                  <div className="p-3.5 rounded-xl bg-[#faf6ee] border border-[#ece2d1] space-y-1">
                    <span className="text-[10px] text-charcoal-500 font-bold uppercase">Highest Qualification</span>
                    <p className="text-charcoal-900 font-bold">{profile.highest_education || '—'}</p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#faf6ee] border border-[#ece2d1] space-y-1">
                    <span className="text-[10px] text-charcoal-500 font-bold uppercase">Education Field</span>
                    <p className="text-charcoal-900 font-bold">{profile.education_field || '—'}</p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#faf6ee] border border-[#ece2d1] space-y-1">
                    <span className="text-[10px] text-charcoal-500 font-bold uppercase">College / Institution</span>
                    <p className="text-charcoal-900 font-bold">{profile.institution || '—'}</p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#faf6ee] border border-[#ece2d1] space-y-1">
                    <span className="text-[10px] text-charcoal-500 font-bold uppercase">Occupation Title</span>
                    <p className="text-charcoal-900 font-bold">{profile.occupation_title || '—'}</p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#faf6ee] border border-[#ece2d1] space-y-1">
                    <span className="text-[10px] text-charcoal-500 font-bold uppercase">Employment Sector</span>
                    <p className="text-charcoal-900 font-bold">{profile.employed_in || '—'}</p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#faf6ee] border border-[#ece2d1] space-y-1">
                    <span className="text-[10px] text-charcoal-500 font-bold uppercase">Work Location</span>
                    <p className="text-charcoal-900 font-bold">{profile.work_location || (profile.district ? `${profile.district}${profile.state ? `, ${profile.state}` : ''}` : '—')}</p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#faf6ee] border border-[#ece2d1] space-y-1 sm:col-span-2">
                    <span className="text-[10px] text-charcoal-500 font-bold uppercase">Annual Income Package</span>
                    <p className="text-emerald-700 font-extrabold text-sm">
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
                    <div className="p-3.5 rounded-xl bg-[#faf6ee] border border-[#ece2d1] space-y-1">
                      <span className="text-[10px] text-charcoal-500 font-bold uppercase">Father&apos;s Name</span>
                      <p className="text-charcoal-900 font-bold">{profile.father_name || '—'}</p>
                      {profile.father_occupation && <span className="text-[11px] text-charcoal-600 block">{profile.father_occupation}</span>}
                    </div>

                    <div className="p-3.5 rounded-xl bg-[#faf6ee] border border-[#ece2d1] space-y-1">
                      <span className="text-[10px] text-charcoal-500 font-bold uppercase">Mother&apos;s Name</span>
                      <p className="text-charcoal-900 font-bold">{profile.mother_name || '—'}</p>
                      {profile.mother_occupation && <span className="text-[11px] text-charcoal-600 block">{profile.mother_occupation}</span>}
                    </div>

                    <div className="p-3.5 rounded-xl bg-[#faf6ee] border border-[#ece2d1] space-y-1">
                      <span className="text-[10px] text-charcoal-500 font-bold uppercase">Family Standing</span>
                      <p className="text-charcoal-900 font-bold">{profile.family_status ? profile.family_status.replace('_', ' ') : '—'}</p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-[#faf6ee] border border-[#ece2d1] space-y-1">
                      <span className="text-[10px] text-charcoal-500 font-bold uppercase">Family Values</span>
                      <p className="text-charcoal-900 font-bold">{profile.family_values || '—'}</p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-[#faf6ee] border border-[#ece2d1] space-y-1">
                      <span className="text-[10px] text-charcoal-500 font-bold uppercase">Brothers</span>
                      <p className="text-charcoal-900 font-bold">
                        {profile.brothers_count ?? 0} {profile.married_brothers_count ? `(${profile.married_brothers_count} Married)` : '(None Married)'}
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-[#faf6ee] border border-[#ece2d1] space-y-1">
                      <span className="text-[10px] text-charcoal-500 font-bold uppercase">Sisters</span>
                      <p className="text-charcoal-900 font-bold">
                        {profile.sisters_count ?? 0} {profile.married_sisters_count ? `(${profile.married_sisters_count} Married)` : '(None Married)'}
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-[#faf6ee] border border-[#ece2d1] space-y-1">
                      <span className="text-[10px] text-charcoal-500 font-bold uppercase">Native Place</span>
                      <p className="text-charcoal-900 font-bold">{profile.native_place || profile.district || '—'}</p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-[#faf6ee] border border-[#ece2d1] space-y-1">
                      <span className="text-[10px] text-charcoal-500 font-bold uppercase">Residence Type</span>
                      <p className="text-charcoal-900 font-bold">{profile.residence_type || '—'}</p>
                    </div>
                  </div>

                  {profile.about_family && (
                    <div className="p-3.5 rounded-xl bg-[#faf6ee] border border-[#ece2d1] space-y-1">
                      <span className="text-[10px] text-burgundy-800 font-bold uppercase font-serif">About Family:</span>
                      <p className="text-charcoal-700 leading-relaxed">{profile.about_family}</p>
                    </div>
                  )}
                </div>
              )}

              {/* 4. LIFESTYLE & DEMOGRAPHICS TAB */}
              {activeTab === 'lifestyle' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                  <div className="p-3.5 rounded-xl bg-[#faf6ee] border border-[#ece2d1] space-y-1">
                    <span className="text-[10px] text-charcoal-500 font-bold uppercase">Mother Tongue</span>
                    <p className="text-charcoal-900 font-bold">{profile.mother_tongue || '—'}</p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#faf6ee] border border-[#ece2d1] space-y-1">
                    <span className="text-[10px] text-charcoal-500 font-bold uppercase">Dietary Habits</span>
                    <p className="text-charcoal-900 font-bold">{profile.diet ? profile.diet.replace('_', ' ') : '—'}</p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#faf6ee] border border-[#ece2d1] space-y-1">
                    <span className="text-[10px] text-charcoal-500 font-bold uppercase">Smoking</span>
                    <p className="text-charcoal-900 font-bold">{profile.smoking || '—'}</p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#faf6ee] border border-[#ece2d1] space-y-1">
                    <span className="text-[10px] text-charcoal-500 font-bold uppercase">Drinking</span>
                    <p className="text-charcoal-900 font-bold">{profile.drinking || '—'}</p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#faf6ee] border border-[#ece2d1] space-y-1">
                    <span className="text-[10px] text-charcoal-500 font-bold uppercase">Physical Status</span>
                    <p className="text-charcoal-900 font-bold">{profile.physical_status || '—'}</p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#faf6ee] border border-[#ece2d1] space-y-1">
                    <span className="text-[10px] text-charcoal-500 font-bold uppercase">Height &amp; Weight</span>
                    <p className="text-charcoal-900 font-bold">
                      {profile.height_cm ? `${profile.height_cm} cm (${Math.floor(profile.height_cm / 30.48)}'${Math.round((profile.height_cm % 30.48) / 2.54)}")` : '—'} {profile.weight_kg ? `• ${profile.weight_kg} kg` : ''}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#faf6ee] border border-[#ece2d1] space-y-1">
                    <span className="text-[10px] text-charcoal-500 font-bold uppercase">Citizenship</span>
                    <p className="text-charcoal-900 font-bold">{profile.citizenship || '—'}</p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#faf6ee] border border-[#ece2d1] space-y-1">
                    <span className="text-[10px] text-charcoal-500 font-bold uppercase">Hobbies &amp; Interests</span>
                    <p className="text-charcoal-900 font-bold">{profile.hobbies || '—'}</p>
                  </div>
                </div>
              )}

              {/* 5. PARTNER PREFERENCES TAB */}
              {activeTab === 'preferences' && (
                <div className="space-y-3 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    <div className="p-3.5 rounded-xl bg-[#faf6ee] border border-[#ece2d1] space-y-1">
                      <span className="text-[10px] text-charcoal-500 font-bold uppercase">Preferred Age Range</span>
                      <p className="text-burgundy-800 font-bold">
                        {profile.partner_preferences?.age_min || 21} – {profile.partner_preferences?.age_max || 32} Years
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-[#faf6ee] border border-[#ece2d1] space-y-1">
                      <span className="text-[10px] text-charcoal-500 font-bold uppercase">Preferred Height</span>
                      <p className="text-charcoal-900 font-bold">
                        {profile.partner_preferences?.height_min_cm || 150} cm – {profile.partner_preferences?.height_max_cm || 185} cm
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-[#faf6ee] border border-[#ece2d1] space-y-1 sm:col-span-2 lg:col-span-1">
                      <span className="text-[10px] text-charcoal-500 font-bold uppercase">Preferred Denominations</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {(profile.partner_preferences?.denomination || ['METHODIST', 'CSI', 'CATHOLIC', 'BAPTIST']).map((d: string) => (
                          <span key={d} className="px-2 py-0.5 rounded-md bg-burgundy-50 text-burgundy-800 border border-burgundy-200 text-[10px] font-bold">
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
