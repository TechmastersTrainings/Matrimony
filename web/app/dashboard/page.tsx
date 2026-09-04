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
      <div className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center bg-slate-950 text-white font-sans">
        <div className="w-12 h-12 rounded-2xl bg-amber-500 text-slate-950 font-black flex items-center justify-center animate-pulse mb-3 shadow-xl">
          CM
        </div>
        <p className="text-xs text-slate-400 font-bold">Loading Your Matrimonial Dashboard...</p>
      </div>
    );
  }

  // Extract Profile and Draft fallback data
  const profile = userData?.profile;
  const draftData = userData?.draft?.draft_data || {};
  const isSubscriber = userData?.is_active_subscriber;
  const profileStatus = userData?.profile_status || profile?.status || 'DRAFT';
  const completionPercentage = userData?.completion_percentage || profile?.completion_percentage || 15;

  const rawPrimaryUrl = photos.find((p) => p.is_primary)?.r2_url || photos[0]?.r2_url || profile?.primary_photo;
  const primaryPhoto = getPhotoUrl(rawPrimaryUrl);

  // Field helpers combining profile model & draft inputs
  const firstName = profile?.first_name || draftData?.first_name || 'Member';
  const lastName = profile?.last_name || draftData?.last_name || '';
  const fullName = `${firstName} ${lastName}`.trim();
  const gender = profile?.gender || draftData?.gender || 'MALE';
  const age = profile?.age || draftData?.age || '34';
  const dob = profile?.dob || draftData?.dob || '1993-10-25';
  const heightCm = profile?.height_cm || draftData?.height_cm || 165;
  const motherTongue = profile?.mother_tongue || draftData?.mother_tongue || 'Kannada';
  const maritalStatus = (profile?.marital_status || draftData?.marital_status || 'NEVER_MARRIED').replace(/_/g, ' ');
  const physicalStatus = (profile?.physical_status || draftData?.physical_status || 'NORMAL').replace(/_/g, ' ');

  // Faith
  const denomination = (profile?.denomination || draftData?.denomination || 'METHODIST').replace(/_/g, ' ');
  const churchName = profile?.church_name || draftData?.church_name || 'Elrohi';
  const pastor = profile?.parish_or_pastor || draftData?.parish_or_pastor || 'Rev. Philip Babu';
  const isBaptized = profile?.is_baptized ?? draftData?.is_baptized ?? true;
  const faithTestimony = profile?.faith_testimony || draftData?.faith_testimony || 'Baptized and raised in faith, actively serving in our local church community.';

  // Career & Education
  const education = profile?.highest_education || draftData?.highest_education || 'B.Tech Computer Science';
  const occupation = profile?.occupation_title || draftData?.occupation_title || 'Software Engineer';
  const employedIn = profile?.employed_in || draftData?.employed_in || 'Private Sector';
  const workLocation = profile?.work_location || draftData?.work_location || 'Hyderabad';
  const income = profile?.annual_income_min ? `₹${profile.annual_income_min.toLocaleString('en-IN')}` : '₹21,00,000';

  // Location & Contact
  const mobileNumber = userData?.mobile_number || draftData?.mobile_number || '9880768222';
  const email = userData?.email || draftData?.email || 'sachin.anil@email.com';
  const district = profile?.district || draftData?.district || 'Bidar';
  const state = profile?.state || draftData?.state || 'Karnataka';
  const nativePlace = profile?.native_place || draftData?.native_place || 'Bidar';
  const pincode = profile?.pincode || draftData?.pincode || '585401';

  // Family
  const fatherName = profile?.father_name || draftData?.father_name || 'Anilraj Themgyale';
  const fatherOccupation = profile?.father_occupation || draftData?.father_occupation || 'Retired Govt Official';
  const motherName = profile?.mother_name || draftData?.mother_name || 'Mangala devi Themgyale';
  const motherOccupation = profile?.mother_occupation || draftData?.mother_occupation || 'Retired Govt Official';
  const familyStatus = (profile?.family_status || draftData?.family_status || 'UPPER_MIDDLE_CLASS').replace(/_/g, ' ');
  const familyValues = (profile?.family_values || draftData?.family_values || 'MODERATE').replace(/_/g, ' ');

  // Bio & Preferences
  const bio = profile?.bio || draftData?.bio || 'I am a committed Christian looking for a life partner with strong faith values.';
  const partnerPreferences = profile?.partner_preferences || draftData?.partner_preferences || {
    age_min: 22,
    age_max: 30,
    height_min_cm: 155,
    height_max_cm: 185,
    denomination: ['METHODIST', 'CSI', 'CATHOLIC', 'BAPTIST'],
  };

  return (
    <div className="relative min-h-[calc(100vh-80px)] py-10 px-4 sm:px-6 lg:px-8 bg-slate-950 text-white font-sans overflow-hidden">
      {/* Ambient Lighting Glows */}
      <div className="absolute top-10 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10 space-y-8">
        {/* Top: Received Interests, Sent Interests, Mutual Matches Activity Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          <Link
            href="/interests?tab=received"
            className="bg-slate-900/90 backdrop-blur-xl border border-slate-800 hover:border-amber-500/50 rounded-3xl p-5 sm:p-6 shadow-xl space-y-2 group transition-all"
          >
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Received Interests
            </span>
            <div className="text-3xl font-extrabold text-amber-400 group-hover:translate-x-1 transition-transform">
              {interestsCount.received}
            </div>
            <span className="text-xs text-slate-400 block group-hover:text-amber-300 transition-colors">
              {isSubscriber ? 'View candidates who liked you →' : '🔒 Upgrade to view member details →'}
            </span>
          </Link>

          <Link
            href="/interests?tab=sent"
            className="bg-slate-900/90 backdrop-blur-xl border border-slate-800 hover:border-amber-500/50 rounded-3xl p-5 sm:p-6 shadow-xl space-y-2 group transition-all"
          >
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Sent Interests
            </span>
            <div className="text-3xl font-extrabold text-white group-hover:translate-x-1 transition-transform">
              {interestsCount.sent}
            </div>
            <span className="text-xs text-slate-400 block group-hover:text-amber-300 transition-colors">
              Check pending responses →
            </span>
          </Link>

          <Link
            href="/interests?tab=matches"
            className="bg-slate-900/90 backdrop-blur-xl border border-slate-800 hover:border-emerald-500/50 rounded-3xl p-5 sm:p-6 shadow-xl space-y-2 group transition-all"
          >
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
              Mutual Matches
            </span>
            <div className="text-3xl font-extrabold text-emerald-400 group-hover:translate-x-1 transition-transform">
              {interestsCount.matches}
            </div>
            <span className="text-xs text-slate-400 block group-hover:text-emerald-300 transition-colors">
              Open In-App Chat →
            </span>
          </Link>
        </div>

        {/* 1. Header Profile Banner Card */}
        <div className="bg-slate-900/90 backdrop-blur-2xl border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="flex items-center gap-5">
              {/* Avatar / Primary Photo */}
              <div className="relative w-24 h-24 rounded-2xl overflow-hidden bg-slate-950 border-2 border-amber-500/60 shrink-0 shadow-lg shadow-amber-950/40">
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
                  <div className="w-full h-full flex items-center justify-center font-extrabold text-2xl text-amber-400 bg-slate-900">
                    {firstName[0]}
                  </div>
                )}
              </div>

              {/* Name, Status & Core Info */}
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                    {fullName}
                  </h1>
                  <span
                    className={`text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider border ${
                      profileStatus === 'APPROVED'
                        ? 'bg-emerald-950 text-emerald-300 border-emerald-700 shadow-xs'
                        : profileStatus === 'SUBMITTED'
                        ? 'bg-blue-950 text-blue-300 border-blue-700 shadow-xs'
                        : profileStatus === 'CHANGES_REQUIRED'
                        ? 'bg-amber-950 text-amber-300 border-amber-700 shadow-xs'
                        : 'bg-slate-800 text-slate-300 border-slate-700'
                    }`}
                  >
                    {profileStatus === 'APPROVED'
                      ? '✓ Verified & Approved'
                      : profileStatus === 'SUBMITTED'
                      ? '⏳ SUBMITTED (Pastoral Review)'
                      : profileStatus.replace('_', ' ')}
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-amber-300 font-semibold">
                  {gender} • {age} yrs • {denomination} • {district}
                </p>

                <p className="text-xs text-slate-400 flex flex-wrap items-center gap-3 pt-0.5">
                  <span>📱 Phone: <strong className="text-white font-mono">{mobileNumber}</strong></span>
                  <span>•</span>
                  <span>✉️ Email: <strong className="text-white">{email}</strong></span>
                </p>
              </div>
            </div>

            {/* Plan Status & Actions */}
            <div className="flex flex-col sm:items-end gap-2.5">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-slate-950 border border-slate-800 shadow-md">
                <span className={`w-2.5 h-2.5 rounded-full ${isSubscriber ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
                <span className="text-xs font-bold text-white">
                  {isSubscriber ? `Active: ${userData?.active_plan_name || 'VIP Membership'}` : 'Basic Registration Account'}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Link
                  href="/profile/photos"
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold text-white transition-all"
                >
                  📸 Photos ({photos.length})
                </Link>
                <Link
                  href="/profile/create"
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold text-xs shadow-lg shadow-amber-950/40 transition-all transform hover:-translate-y-0.5"
                >
                  Edit Profile ✍️
                </Link>
              </div>
            </div>
          </div>

          {/* Verification / Progress Indicator */}
          <div className="mt-8 pt-6 border-t border-slate-800/80 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-slate-400 uppercase tracking-wider text-[11px]">
                Profile Integrity &amp; Verification Progress
              </span>
              <span className="text-amber-400 font-mono">{completionPercentage}% Completed</span>
            </div>
            <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
              <div
                className="h-full bg-gradient-to-r from-blue-600 via-amber-400 to-amber-500 transition-all duration-500"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
          </div>
        </div>

        {/* 2. Photo Gallery Preview Card */}
        <div className="bg-slate-900/90 backdrop-blur-2xl border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-lg">📸</span>
              <h2 className="text-base font-extrabold text-white">
                My Uploaded Photos ({photos.length})
              </h2>
            </div>
            <Link
              href="/profile/photos"
              className="text-xs font-bold text-amber-400 hover:text-amber-300 transition-colors"
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
                    className={`relative aspect-square rounded-2xl overflow-hidden border-2 bg-slate-950 shadow-md ${
                      p.is_primary ? 'border-amber-400 ring-2 ring-amber-400/20' : 'border-slate-800'
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
                      <span className="absolute top-1.5 left-1.5 bg-amber-500 text-slate-950 text-[9px] font-extrabold px-2 py-0.5 rounded-md shadow-md">
                        Primary
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-6 rounded-2xl bg-slate-950/60 border border-slate-800 text-center space-y-2">
              <p className="text-xs text-slate-400">No photos uploaded yet.</p>
              <Link
                href="/profile/photos"
                className="inline-block text-xs font-bold text-amber-400 hover:underline"
              >
                Upload your first verified photo now →
              </Link>
            </div>
          )}
        </div>

        {/* 3. Detailed Registered Personal Information Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Section A: Faith & Christian Fellowship */}
          <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
              <span className="text-lg">✝️</span>
              <h3 className="text-base font-extrabold text-white">
                Christian Faith &amp; Church
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-slate-400 block mb-0.5">Denomination</span>
                <strong className="text-white font-bold">{denomination}</strong>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">Baptism Status</span>
                <strong className="text-emerald-400 font-bold">{isBaptized ? '✓ Baptized' : 'Not Baptized'}</strong>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">Church / Parish</span>
                <strong className="text-white font-bold">{churchName}</strong>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">Pastor / Presbyter</span>
                <strong className="text-white font-bold">{pastor}</strong>
              </div>
            </div>

            {faithTestimony && (
              <div className="pt-3 border-t border-slate-800/80">
                <span className="text-slate-400 text-xs block mb-1">Faith Testimony &amp; Service</span>
                <p className="text-xs text-slate-300 italic bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                  &ldquo;{faithTestimony}&rdquo;
                </p>
              </div>
            )}
          </div>

          {/* Section B: Education & Professional Career */}
          <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
              <span className="text-lg">💼</span>
              <h3 className="text-base font-extrabold text-white">
                Education &amp; Occupation
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-slate-400 block mb-0.5">Highest Qualification</span>
                <strong className="text-white font-bold">{education}</strong>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">Occupation Title</span>
                <strong className="text-white font-bold">{occupation}</strong>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">Employment Sector</span>
                <strong className="text-white font-bold">{employedIn}</strong>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">Work Location</span>
                <strong className="text-white font-bold">{workLocation}</strong>
              </div>
              <div className="col-span-2">
                <span className="text-slate-400 block mb-0.5">Annual Income (INR)</span>
                <strong className="text-amber-400 font-extrabold text-sm">{income} per annum</strong>
              </div>
            </div>
          </div>

          {/* Section C: Personal Lifestyle & Attributes */}
          <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
              <span className="text-lg">👤</span>
              <h3 className="text-base font-extrabold text-white">
                Personal Identity &amp; Habits
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-slate-400 block mb-0.5">Marital Status</span>
                <strong className="text-white font-bold">{maritalStatus}</strong>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">Date of Birth</span>
                <strong className="text-white font-bold">{dob} ({age} yrs)</strong>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">Height</span>
                <strong className="text-white font-bold">{heightCm} cm (~5&apos;5&quot;)</strong>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">Physical Status</span>
                <strong className="text-white font-bold">{physicalStatus}</strong>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">Mother Tongue</span>
                <strong className="text-white font-bold">{motherTongue}</strong>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">Diet &amp; Habits</span>
                <strong className="text-white font-bold">Non-Vegetarian • Non-Smoker</strong>
              </div>
            </div>

            {bio && (
              <div className="pt-3 border-t border-slate-800/80">
                <span className="text-slate-400 text-xs block mb-1">About Me (Bio)</span>
                <p className="text-xs text-slate-300 bg-slate-950/60 p-3 rounded-xl border border-slate-800/80 leading-relaxed">
                  {bio}
                </p>
              </div>
            )}
          </div>

          {/* Section D: Family Background & Location */}
          <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
              <span className="text-lg">🏡</span>
              <h3 className="text-base font-extrabold text-white">
                Family Background &amp; Location
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-slate-400 block mb-0.5">Father&apos;s Name</span>
                <strong className="text-white font-bold">{fatherName}</strong>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">Father&apos;s Occupation</span>
                <strong className="text-white font-bold">{fatherOccupation}</strong>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">Mother&apos;s Name</span>
                <strong className="text-white font-bold">{motherName}</strong>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">Mother&apos;s Occupation</span>
                <strong className="text-white font-bold">{motherOccupation}</strong>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">Family Status</span>
                <strong className="text-white font-bold">{familyStatus}</strong>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">Family Values</span>
                <strong className="text-white font-bold">{familyValues}</strong>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">Native Place</span>
                <strong className="text-white font-bold">{nativePlace}</strong>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">District &amp; State</span>
                <strong className="text-white font-bold">{district}, {state} ({pincode})</strong>
              </div>
            </div>
          </div>
        </div>

        {/* 4. Partner Preferences Card */}
        <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <span className="text-lg">💍</span>
              <h3 className="text-base font-extrabold text-white">
                Expected Partner Preferences
              </h3>
            </div>
            <Link href="/profile/create" className="text-xs font-bold text-amber-400 hover:underline">
              Edit Preferences →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80">
              <span className="text-slate-400 block mb-1">Age Preference</span>
              <strong className="text-white font-bold text-sm">
                {partnerPreferences.age_min || 22} to {partnerPreferences.age_max || 30} years
              </strong>
            </div>

            <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80">
              <span className="text-slate-400 block mb-1">Height Preference</span>
              <strong className="text-white font-bold text-sm">
                {partnerPreferences.height_min_cm || 155} cm to {partnerPreferences.height_max_cm || 185} cm
              </strong>
            </div>

            <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80">
              <span className="text-slate-400 block mb-1">Preferred Denominations</span>
              <strong className="text-amber-400 font-bold text-sm">
                {Array.isArray(partnerPreferences.denomination)
                  ? partnerPreferences.denomination.join(', ')
                  : 'Methodist, CSI, Catholic, Baptist'}
              </strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
