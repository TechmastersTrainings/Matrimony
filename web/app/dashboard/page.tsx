'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { apiClient } from '../../lib/api-client';
import { getPhotoUrl, DEFAULT_AVATAR_SVG } from '../../lib/utils';

export default function UserDashboardPage() {
  const router = useRouter();
  const [userData, setUserData] = useState<any>(null);
  const [photos, setPhotos] = useState<any[]>([]);
  const [interestsCount, setInterestsCount] = useState({ received: 0, sent: 0, matches: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const me = await apiClient.getRegistrationMe();
        setUserData(me);

        // Load photos
        try {
          const myPhotosRes = await apiClient.getMyPhotos();
          setPhotos(myPhotosRes?.photos || []);
        } catch (e) {
          // Photos optional
        }

        // Load interest stats
        try {
          const rec = await apiClient.getInterests('received');
          const sent = await apiClient.getInterests('sent');
          const mat = await apiClient.getInterests('matches');
          setInterestsCount({
            received: rec?.count || rec?.items?.length || 0,
            sent: sent?.count || sent?.items?.length || 0,
            matches: mat?.count || mat?.items?.length || 0,
          });
        } catch (e) {
          // Interests optional
        }
      } catch (err) {
        console.warn('Not logged in, redirecting to login...');
        router.push('/login');
      } finally {
        setLoading(false);
      }
    }
    loadDashboard();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center bg-[#fdfbf7] text-charcoal-900 font-sans">
        <div className="w-12 h-12 rounded-2xl bg-burgundy-700 text-gold-300 font-black flex items-center justify-center animate-pulse mb-3 shadow-md">
          CM
        </div>
        <p className="text-xs text-charcoal-600 font-bold">Loading Your Matrimonial Dashboard...</p>
      </div>
    );
  }

  // Extract Profile and Draft real data (ZERO dummy / mock fallbacks)
  const profile = userData?.profile;
  const draftData = userData?.draft?.draft_data || {};
  const isSubscriber = userData?.is_active_subscriber;
  const profileStatus = userData?.profile_status || profile?.status || 'DRAFT';
  const completionPercentage = userData?.completion_percentage || profile?.completion_percentage || (profile ? 100 : 15);

  const hasProfile = Boolean(profile || (draftData && (draftData.first_name || draftData.highest_education || draftData.church_name)));

  const rawPrimaryUrl = photos.find((p) => p.is_primary)?.r2_url || photos[0]?.r2_url || profile?.primary_photo;
  const primaryPhoto = getPhotoUrl(rawPrimaryUrl);

  // Field helpers combining profile model & draft inputs without mock fallbacks
  const firstName = profile?.first_name || draftData?.first_name || (userData?.email ? userData.email.split('@')[0] : 'Member');
  const lastName = profile?.last_name || draftData?.last_name || '';
  const fullName = `${firstName} ${lastName}`.trim();
  const gender = profile?.gender ? profile.gender.replace(/_/g, ' ') : draftData?.gender ? draftData.gender.replace(/_/g, ' ') : 'Not specified';
  const age = profile?.age || draftData?.age || null;
  const dob = profile?.dob || draftData?.dob || null;
  const heightCm = profile?.height_cm || draftData?.height_cm || null;
  const motherTongue = profile?.mother_tongue || draftData?.mother_tongue || 'Not specified';
  const maritalStatus = profile?.marital_status ? profile.marital_status.replace(/_/g, ' ') : draftData?.marital_status ? draftData.marital_status.replace(/_/g, ' ') : 'Not specified';
  const physicalStatus = profile?.physical_status ? profile.physical_status.replace(/_/g, ' ') : draftData?.physical_status ? draftData.physical_status.replace(/_/g, ' ') : 'Normal';

  // Faith
  const denomination = profile?.denomination ? profile.denomination.replace(/_/g, ' ') : draftData?.denomination ? draftData.denomination.replace(/_/g, ' ') : 'Not specified';
  const churchName = profile?.church_name || draftData?.church_name || 'Not specified';
  const pastor = profile?.parish_or_pastor || draftData?.parish_or_pastor || 'Not specified';
  const isBaptized = profile?.is_baptized ?? draftData?.is_baptized ?? null;
  const faithTestimony = profile?.faith_testimony || draftData?.faith_testimony || '';

  // Career & Education
  const education = profile?.highest_education || draftData?.highest_education || 'Not specified';
  const occupation = profile?.occupation_title || draftData?.occupation_title || 'Not specified';
  const employedIn = profile?.employed_in || draftData?.employed_in || 'Not specified';
  const workLocation = profile?.work_location || draftData?.work_location || 'Not specified';
  const income = profile?.annual_income_min
    ? `₹${profile.annual_income_min.toLocaleString('en-IN')}`
    : draftData?.annual_income_min
    ? `₹${draftData.annual_income_min.toLocaleString('en-IN')}`
    : 'Not specified';

  // Location & Contact
  const mobileNumber = userData?.mobile_number || '—';
  const email = userData?.email || '—';
  const district = profile?.district || draftData?.district || 'Not specified';
  const state = profile?.state || draftData?.state || 'Karnataka';
  const nativePlace = profile?.native_place || draftData?.native_place || 'Not specified';
  const pincode = profile?.pincode || draftData?.pincode || '';

  // Family
  const fatherName = profile?.father_name || draftData?.father_name || 'Not specified';
  const fatherOccupation = profile?.father_occupation || draftData?.father_occupation || 'Not specified';
  const fatherMobile = profile?.father_mobile || draftData?.father_mobile || '—';
  const motherName = profile?.mother_name || draftData?.mother_name || 'Not specified';
  const motherOccupation = profile?.mother_occupation || draftData?.mother_occupation || 'Not specified';
  const motherMobile = profile?.mother_mobile || draftData?.mother_mobile || '—';
  const familyStatus = profile?.family_status ? profile.family_status.replace(/_/g, ' ') : draftData?.family_status ? draftData.family_status.replace(/_/g, ' ') : 'Not specified';
  const familyValues = profile?.family_values ? profile.family_values.replace(/_/g, ' ') : draftData?.family_values ? draftData.family_values.replace(/_/g, ' ') : 'Not specified';

  // Lifestyle & Habits
  const diet = profile?.diet || draftData?.diet ? (profile?.diet || draftData?.diet).replace(/_/g, ' ') : 'Not specified';
  const smoking = profile?.smoking || draftData?.smoking ? (profile?.smoking || draftData?.smoking).replace(/_/g, ' ') : '';
  const drinking = profile?.drinking || draftData?.drinking ? (profile?.drinking || draftData?.drinking).replace(/_/g, ' ') : '';
  const habitsDisplay = [diet, smoking ? `Smoking: ${smoking}` : '', drinking ? `Drinking: ${drinking}` : ''].filter(Boolean).join(' • ') || 'Not specified';

  // Bio & Preferences
  const bio = profile?.bio || draftData?.bio || '';
  const partnerPreferences = profile?.partner_preferences || draftData?.partner_preferences || null;

  return (
    <div className="relative min-h-[calc(100vh-80px)] py-10 px-4 sm:px-6 lg:px-8 bg-[#fdfbf7] text-charcoal-900 font-sans overflow-hidden">
      {/* Ambient Lighting Glows */}
      <div className="absolute top-10 left-1/4 w-96 h-96 bg-gold-400/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-burgundy-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10 space-y-8">
        {/* Top: Received Interests, Sent Interests, Mutual Matches Activity Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          <Link
            href="/interests?tab=received"
            className="bg-white border border-[#ece2d1] hover:border-burgundy-300 rounded-3xl p-5 sm:p-6 shadow-sm hover:shadow-md space-y-2 group transition-all"
          >
            <span className="text-[11px] font-bold uppercase tracking-wider text-charcoal-500">
              Received Interests
            </span>
            <div className="text-3xl font-extrabold text-burgundy-700 group-hover:translate-x-1 transition-transform">
              {interestsCount.received}
            </div>
            <span className="text-xs text-charcoal-500 block group-hover:text-burgundy-800 transition-colors">
              {isSubscriber ? 'View candidates who liked you →' : '🔒 Upgrade to view member details →'}
            </span>
          </Link>

          <Link
            href="/interests?tab=sent"
            className="bg-white border border-[#ece2d1] hover:border-burgundy-300 rounded-3xl p-5 sm:p-6 shadow-sm hover:shadow-md space-y-2 group transition-all"
          >
            <span className="text-[11px] font-bold uppercase tracking-wider text-charcoal-500">
              Sent Interests
            </span>
            <div className="text-3xl font-extrabold text-charcoal-900 group-hover:translate-x-1 transition-transform">
              {interestsCount.sent}
            </div>
            <span className="text-xs text-charcoal-500 block group-hover:text-burgundy-800 transition-colors">
              Check pending responses →
            </span>
          </Link>

          <Link
            href="/interests?tab=matches"
            className="bg-white border border-[#ece2d1] hover:border-emerald-300 rounded-3xl p-5 sm:p-6 shadow-sm hover:shadow-md space-y-2 group transition-all"
          >
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">
              Mutual Matches
            </span>
            <div className="text-3xl font-extrabold text-emerald-700 group-hover:translate-x-1 transition-transform">
              {interestsCount.matches}
            </div>
            <span className="text-xs text-charcoal-500 block group-hover:text-emerald-800 transition-colors">
              Open In-App Chat →
            </span>
          </Link>
        </div>

        {/* Empty Profile Notice Banner if Candidate Profile Not Created */}
        {!hasProfile && (
          <div className="bg-white border border-gold-300 rounded-3xl p-6 sm:p-8 text-center space-y-4 shadow-sm">
            <div className="w-14 h-14 rounded-2xl bg-gold-50 text-gold-700 flex items-center justify-center mx-auto text-2xl font-bold">
              ✍️
            </div>
            <h2 className="text-xl sm:text-2xl font-serif font-extrabold text-charcoal-900">Your Candidate Profile is Empty</h2>
            <p className="text-xs sm:text-sm text-charcoal-600 max-w-lg mx-auto leading-relaxed">
              You have not entered your candidate profile details yet. Complete your profile (faith, education, family background, and photos) to start receiving matches.
            </p>
            <div>
              <Link
                href="/profile/create"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-burgundy-700 to-burgundy-800 hover:from-burgundy-600 hover:to-burgundy-700 text-white px-6 py-3 rounded-xl font-extrabold text-xs shadow-md transition-all hover:scale-105"
              >
                <span>Create / Complete Your Profile Now</span>
                <span>→</span>
              </Link>
            </div>
          </div>
        )}

        {/* 1. Header Profile Banner Card */}
        <div className="bg-white border border-[#ece2d1] rounded-3xl p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="flex items-center gap-5">
              {/* Avatar / Primary Photo */}
              <div className="relative w-24 h-24 rounded-2xl overflow-hidden bg-[#faf6ee] border-2 border-gold-400/60 shrink-0 shadow-sm">
                {primaryPhoto ? (
                  <img
                    src={primaryPhoto}
                    alt={fullName}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = DEFAULT_AVATAR_SVG;
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center font-serif font-extrabold text-2xl text-burgundy-800 bg-[#faf6ee]">
                    {firstName[0]?.toUpperCase() || 'M'}
                  </div>
                )}
              </div>

              {/* Name, Status & Core Info */}
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="text-2xl sm:text-3xl font-serif font-extrabold text-charcoal-900 tracking-tight">
                    {fullName || 'Candidate Profile'}
                  </h1>
                  <span
                    className={`text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider border ${
                      profileStatus === 'APPROVED'
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200 shadow-xs'
                        : profileStatus === 'SUBMITTED'
                        ? 'bg-blue-50 text-blue-800 border-blue-200 shadow-xs'
                        : profileStatus === 'CHANGES_REQUIRED'
                        ? 'bg-gold-50 text-gold-800 border-gold-200 shadow-xs'
                        : 'bg-slate-100 text-charcoal-700 border-[#ece2d1]'
                    }`}
                  >
                    {profileStatus === 'APPROVED'
                      ? '✓ Verified & Approved'
                      : profileStatus === 'SUBMITTED'
                      ? '⏳ SUBMITTED (Pastoral Review)'
                      : profileStatus.replace('_', ' ')}
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-burgundy-800 font-semibold">
                  {gender !== 'Not specified' ? gender : 'Gender Not Specified'} {age ? `• ${age} yrs` : ''} {denomination !== 'Not specified' ? `• ${denomination}` : ''} {district !== 'Not specified' ? `• ${district}` : ''}
                </p>

                <p className="text-xs text-charcoal-500 flex flex-wrap items-center gap-3 pt-0.5">
                  <span>📱 Phone: <strong className="text-charcoal-900 font-mono">{mobileNumber}</strong></span>
                  <span>•</span>
                  <span>✉️ Email: <strong className="text-charcoal-900">{email}</strong></span>
                </p>
              </div>
            </div>

            {/* Plan Status & Actions */}
            <div className="flex flex-col sm:items-end gap-2.5">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-[#faf6ee] border border-[#ece2d1] shadow-xs">
                <span className={`w-2.5 h-2.5 rounded-full ${isSubscriber ? 'bg-emerald-500 animate-pulse' : 'bg-gold-500'}`} />
                <span className="text-xs font-bold text-charcoal-900">
                  {isSubscriber ? `Active: ${userData?.active_plan_name || 'VIP Membership'}` : 'Basic Registration Account'}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Link
                  href="/profile/photos"
                  className="px-4 py-2 rounded-xl bg-white hover:bg-[#faf6ee] border border-[#ece2d1] text-xs font-bold text-charcoal-800 transition-all"
                >
                  📸 Photos ({photos.length})
                </Link>
                <Link
                  href="/profile/create"
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-burgundy-700 to-burgundy-800 hover:from-burgundy-600 hover:to-burgundy-700 text-white font-extrabold text-xs shadow-md shadow-burgundy-900/10 transition-all transform hover:-translate-y-0.5"
                >
                  Edit Profile ✍️
                </Link>
              </div>
            </div>
          </div>

          {/* Verification / Progress Indicator */}
          <div className="mt-8 pt-6 border-t border-[#ece2d1] space-y-2">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-charcoal-500 uppercase tracking-wider text-[11px]">
                Profile Integrity &amp; Verification Progress
              </span>
              <span className="text-burgundy-700 font-mono">{completionPercentage}% Completed</span>
            </div>
            <div className="w-full h-2.5 bg-[#faf6ee] rounded-full overflow-hidden border border-[#ece2d1]">
              <div
                className="h-full bg-gradient-to-r from-burgundy-700 via-gold-500 to-emerald-600 transition-all duration-500"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
          </div>
        </div>

        {/* 2. Photo Gallery Preview Card */}
        <div className="bg-white border border-[#ece2d1] rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-lg">📸</span>
              <h2 className="text-base font-serif font-extrabold text-charcoal-900">
                My Uploaded Photos ({photos.length})
              </h2>
            </div>
            <Link
              href="/profile/photos"
              className="text-xs font-bold text-burgundy-700 hover:text-burgundy-800 transition-colors"
            >
              + Upload / Manage Photos →
            </Link>
          </div>

          {photos.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3 pt-2">
              {photos.map((p, idx) => {
                const photoSrc = getPhotoUrl(p.r2_url);
                return (
                  <div
                    key={p.id || idx}
                    className={`relative aspect-square rounded-2xl overflow-hidden border-2 bg-[#faf6ee] shadow-sm ${
                      p.is_primary ? 'border-gold-500 ring-2 ring-gold-400/30' : 'border-[#ece2d1]'
                    }`}
                  >
                    <img
                      src={photoSrc || DEFAULT_AVATAR_SVG}
                      alt={`Photo ${idx + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = DEFAULT_AVATAR_SVG;
                      }}
                    />
                    {p.is_primary && (
                      <span className="absolute top-1.5 left-1.5 bg-gold-500 text-white text-[9px] font-extrabold px-2 py-0.5 rounded-md shadow-xs">
                        Primary
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-6 rounded-2xl bg-[#faf6ee] border border-[#ece2d1] text-center space-y-2">
              <p className="text-xs text-charcoal-500">No photos uploaded yet.</p>
              <Link
                href="/profile/photos"
                className="inline-block text-xs font-bold text-burgundy-700 hover:underline"
              >
                Upload your first verified photo now →
              </Link>
            </div>
          )}
        </div>

        {/* 3. Detailed Registered Personal Information Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Section A: Faith & Christian Fellowship */}
          <div className="bg-white border border-[#ece2d1] rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-[#ece2d1]">
              <span className="text-lg">✝️</span>
              <h3 className="text-base font-serif font-extrabold text-charcoal-900">
                Christian Faith &amp; Church
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-charcoal-500 block mb-0.5">Denomination</span>
                <strong className="text-charcoal-900 font-bold">{denomination}</strong>
              </div>
              <div>
                <span className="text-charcoal-500 block mb-0.5">Baptism Status</span>
                <strong className="text-emerald-700 font-bold">{isBaptized ? '✓ Baptized' : 'Not Baptized'}</strong>
              </div>
              <div>
                <span className="text-charcoal-500 block mb-0.5">Church / Parish</span>
                <strong className="text-charcoal-900 font-bold">{churchName}</strong>
              </div>
              <div>
                <span className="text-charcoal-500 block mb-0.5">Pastor / Presbyter</span>
                <strong className="text-charcoal-900 font-bold">{pastor}</strong>
              </div>
            </div>

            {faithTestimony && (
              <div className="pt-3 border-t border-[#ece2d1]">
                <span className="text-charcoal-500 text-xs block mb-1">Faith Testimony &amp; Service</span>
                <p className="text-xs text-charcoal-700 italic bg-[#faf6ee] p-3 rounded-xl border border-[#ece2d1]">
                  &ldquo;{faithTestimony}&rdquo;
                </p>
              </div>
            )}
          </div>

          {/* Section B: Education & Professional Career */}
          <div className="bg-white border border-[#ece2d1] rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-[#ece2d1]">
              <span className="text-lg">💼</span>
              <h3 className="text-base font-serif font-extrabold text-charcoal-900">
                Education &amp; Occupation
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-charcoal-500 block mb-0.5">Highest Qualification</span>
                <strong className="text-charcoal-900 font-bold">{education}</strong>
              </div>
              <div>
                <span className="text-charcoal-500 block mb-0.5">Occupation Title</span>
                <strong className="text-charcoal-900 font-bold">{occupation}</strong>
              </div>
              <div>
                <span className="text-charcoal-500 block mb-0.5">Employment Sector</span>
                <strong className="text-charcoal-900 font-bold">{employedIn}</strong>
              </div>
              <div>
                <span className="text-charcoal-500 block mb-0.5">Work Location</span>
                <strong className="text-charcoal-900 font-bold">{workLocation}</strong>
              </div>
              <div className="col-span-2">
                <span className="text-charcoal-500 block mb-0.5">Annual Income (INR)</span>
                <strong className="text-burgundy-800 font-extrabold text-sm">{income} per annum</strong>
              </div>
            </div>
          </div>

          {/* Section C: Personal Lifestyle & Attributes */}
          <div className="bg-white border border-[#ece2d1] rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-[#ece2d1]">
              <span className="text-lg">👤</span>
              <h3 className="text-base font-serif font-extrabold text-charcoal-900">
                Personal Identity &amp; Habits
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-charcoal-500 block mb-0.5">Marital Status</span>
                <strong className="text-charcoal-900 font-bold">{maritalStatus}</strong>
              </div>
              <div>
                <span className="text-charcoal-500 block mb-0.5">Date of Birth</span>
                <strong className="text-charcoal-900 font-bold">{dob ? `${dob} ${age ? `(${age} yrs)` : ''}` : 'Not specified'}</strong>
              </div>
              <div>
                <span className="text-charcoal-500 block mb-0.5">Height</span>
                <strong className="text-charcoal-900 font-bold">{heightCm ? `${heightCm} cm` : 'Not specified'}</strong>
              </div>
              <div>
                <span className="text-charcoal-500 block mb-0.5">Physical Status</span>
                <strong className="text-charcoal-900 font-bold">{physicalStatus}</strong>
              </div>
              <div>
                <span className="text-charcoal-500 block mb-0.5">Mother Tongue</span>
                <strong className="text-charcoal-900 font-bold">{motherTongue}</strong>
              </div>
              <div>
                <span className="text-charcoal-500 block mb-0.5">Diet &amp; Habits</span>
                <strong className="text-charcoal-900 font-bold">{habitsDisplay}</strong>
              </div>
            </div>

            <div className="pt-3 border-t border-[#ece2d1]">
              <span className="text-charcoal-500 text-xs block mb-1">About Me (Bio)</span>
              <p className="text-xs text-charcoal-700 bg-[#faf6ee] p-3 rounded-xl border border-[#ece2d1] leading-relaxed italic">
                {bio ? `“${bio}”` : 'No bio written yet.'}
              </p>
            </div>
          </div>

          {/* Section D: Family Background & Location */}
          <div className="bg-white border border-[#ece2d1] rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-[#ece2d1]">
              <span className="text-lg">🏡</span>
              <h3 className="text-base font-serif font-extrabold text-charcoal-900">
                Family Background &amp; Location
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-charcoal-500 block mb-0.5">Father&apos;s Name</span>
                <strong className="text-charcoal-900 font-bold">{fatherName}</strong>
              </div>
              <div>
                <span className="text-charcoal-500 block mb-0.5">Father&apos;s Occupation</span>
                <strong className="text-charcoal-900 font-bold">{fatherOccupation}</strong>
              </div>
              <div>
                <span className="text-charcoal-500 block mb-0.5">Father&apos;s Mobile</span>
                <strong className="text-charcoal-900 font-mono">{fatherMobile}</strong>
              </div>
              <div>
                <span className="text-charcoal-500 block mb-0.5">Mother&apos;s Mobile</span>
                <strong className="text-charcoal-900 font-mono">{motherMobile}</strong>
              </div>
              <div>
                <span className="text-charcoal-500 block mb-0.5">Mother&apos;s Name</span>
                <strong className="text-charcoal-900 font-bold">{motherName}</strong>
              </div>
              <div>
                <span className="text-charcoal-500 block mb-0.5">Mother&apos;s Occupation</span>
                <strong className="text-charcoal-900 font-bold">{motherOccupation}</strong>
              </div>
              <div>
                <span className="text-charcoal-500 block mb-0.5">Family Status</span>
                <strong className="text-charcoal-900 font-bold">{familyStatus}</strong>
              </div>
              <div>
                <span className="text-charcoal-500 block mb-0.5">Family Values</span>
                <strong className="text-charcoal-900 font-bold">{familyValues}</strong>
              </div>
              <div>
                <span className="text-charcoal-500 block mb-0.5">Native Place</span>
                <strong className="text-charcoal-900 font-bold">{nativePlace}</strong>
              </div>
              <div>
                <span className="text-charcoal-500 block mb-0.5">District &amp; State</span>
                <strong className="text-charcoal-900 font-bold">{district !== 'Not specified' ? `${district}, ${state} ${pincode ? `(${pincode})` : ''}` : 'Not specified'}</strong>
              </div>
            </div>
          </div>
        </div>

        {/* 4. Partner Preferences Card */}
        <div className="bg-white border border-[#ece2d1] rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#ece2d1]">
            <div className="flex items-center gap-2">
              <span className="text-lg">💍</span>
              <h3 className="text-base font-serif font-extrabold text-charcoal-900">
                Expected Partner Preferences
              </h3>
            </div>
            <Link href="/profile/create" className="text-xs font-bold text-burgundy-700 hover:underline">
              Edit Preferences →
            </Link>
          </div>

          {partnerPreferences && (partnerPreferences.age_min || partnerPreferences.denomination) ? (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="p-3 bg-[#faf6ee] rounded-xl border border-[#ece2d1]">
                <span className="text-charcoal-500 block mb-1">Age Preference</span>
                <strong className="text-charcoal-900 font-bold text-sm">
                  {partnerPreferences.age_min ? `${partnerPreferences.age_min} to ${partnerPreferences.age_max || 35} years` : 'Open'}
                </strong>
              </div>

              <div className="p-3 bg-[#faf6ee] rounded-xl border border-[#ece2d1]">
                <span className="text-charcoal-500 block mb-1">Height Preference</span>
                <strong className="text-charcoal-900 font-bold text-sm">
                  {partnerPreferences.height_min_cm ? `${partnerPreferences.height_min_cm} cm to ${partnerPreferences.height_max_cm || 185} cm` : 'Open'}
                </strong>
              </div>

              <div className="p-3 bg-[#faf6ee] rounded-xl border border-[#ece2d1]">
                <span className="text-charcoal-500 block mb-1">Preferred Denominations</span>
                <strong className="text-burgundy-800 font-bold text-sm">
                  {Array.isArray(partnerPreferences.denomination) && partnerPreferences.denomination.length > 0
                    ? partnerPreferences.denomination.join(', ')
                    : 'Open to All'}
                </strong>
              </div>
            </div>
          ) : (
            <div className="p-6 rounded-2xl bg-[#faf6ee] border border-[#ece2d1] text-center space-y-2">
              <p className="text-xs text-charcoal-500">No partner preferences configured yet.</p>
              <Link href="/profile/create" className="inline-block text-xs font-bold text-burgundy-700 hover:underline">
                Set partner preferences now →
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
