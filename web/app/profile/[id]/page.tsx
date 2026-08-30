'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { apiClient } from '../../../lib/api-client';

export default function CandidateProfileDetailPage() {
  const params = useParams();
  const profileId = params.id ? parseInt(String(params.id)) : 0;

  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [revealData, setRevealData] = useState<any>(null);
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await apiClient.getCandidateProfile(profileId);
        setProfile(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    }
    if (profileId) loadData();
  }, [profileId]);

  const handleSendInterest = async () => {
    if (!profile) return;
    try {
      await apiClient.sendInterest(profile.user_id);
      alert('Matrimonial interest sent successfully.');
    } catch (err: any) {
      alert(`Notice: ${err.message}`);
    }
  };

  const handleRequestReveal = async () => {
    if (!profile) return;
    try {
      const res = await apiClient.requestContactReveal(profile.user_id);
      alert(res.message || 'Contact reveal request sent.');
    } catch (err: any) {
      alert(`Notice: ${err.message}`);
    }
  };

  if (loading) {
    return (
      <div className="bg-slate-50 min-h-screen py-16 flex items-center justify-center">
        <p className="text-xs font-semibold text-slate-500">Loading candidate profile...</p>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="bg-slate-50 min-h-screen py-16 text-center">
        <div className="bg-white border border-slate-200 rounded-xl p-8 max-w-md mx-auto">
          <h2 className="text-lg font-bold text-slate-900 mb-2">Profile Not Available</h2>
          <p className="text-xs text-slate-600 mb-4">{error || 'This profile is currently under review.'}</p>
          <Link href="/discover" className="inline-block bg-blue-700 text-white text-xs font-semibold px-4 py-2 rounded-lg">
            Browse All Profiles
          </Link>
        </div>
      </div>
    );
  }

  const photos: string[] = profile.photos && profile.photos.length > 0
    ? profile.photos.map((p: any) => p.r2_url || p.url || p)
    : [profile.primary_photo || ''];

  return (
    <div className="bg-slate-50 min-h-screen py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation Breadcrumb */}
        <div className="mb-6 flex items-center justify-between">
          <Link href="/discover" className="text-xs font-semibold text-blue-700 hover:underline flex items-center gap-1">
            <span>←</span> Back to Search Profiles
          </Link>
          <span className="text-xs text-slate-500 font-medium">Profile ID: CM-{profile.id}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Photo Gallery & Quick CTAs */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
              {/* Main Photo */}
              <div className="aspect-4/5 rounded-xl bg-slate-100 overflow-hidden relative">
                {photos[activePhotoIdx] ? (
                  <img
                    src={photos[activePhotoIdx]}
                    alt={profile.first_name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs font-medium">
                    Protected Photo
                  </div>
                )}
                <div className="absolute top-3 left-3 bg-slate-900/90 text-white text-[10px] font-semibold px-2 py-0.5 rounded-md">
                  {profile.denomination}
                </div>
                <div className="absolute top-3 right-3 bg-emerald-600 text-white text-[10px] font-semibold px-2 py-0.5 rounded-md">
                  Verified Member
                </div>
              </div>

              {/* Thumbnail strip */}
              {photos.length > 1 && (
                <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
                  {photos.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActivePhotoIdx(idx)}
                      className={`w-14 h-14 rounded-lg overflow-hidden border-2 shrink-0 transition-all ${
                        activePhotoIdx === idx ? 'border-blue-600 ring-2 ring-blue-100' : 'border-slate-200'
                      }`}
                    >
                      <img src={img} alt="thumb" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}

              {/* Action Buttons */}
              <div className="mt-5 space-y-2.5">
                <button
                  onClick={handleSendInterest}
                  className="w-full py-2.5 rounded-lg bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold transition-all shadow-xs"
                >
                  Express Matrimonial Interest
                </button>
                <button
                  onClick={handleRequestReveal}
                  className="w-full py-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold border border-slate-300 transition-all"
                >
                  Request Contact Details (Phone / Email)
                </button>
              </div>
            </div>

            {/* Privacy Notice Box */}
            <div className="bg-blue-50/60 border border-blue-200 rounded-xl p-4 text-xs text-blue-900 space-y-1">
              <p className="font-semibold">Privacy & Controlled Reveal</p>
              <p className="text-[11px] text-blue-800 leading-relaxed">
                Contact information is released only when both candidates/families mutually agree to the request.
              </p>
            </div>
          </div>

          {/* Right Column: Detailed Profile Information */}
          <div className="lg:col-span-7 space-y-6">
            {/* Header Card */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-slate-900">
                    {profile.first_name} {profile.last_name}
                  </h1>
                  <p className="text-xs text-slate-600 mt-1">
                    {profile.age || '—'} Yrs • {profile.height_cm ? `${profile.height_cm} cm` : '—'} • {profile.marital_status || 'Never Married'}
                  </p>
                  <p className="text-xs text-blue-700 font-semibold mt-0.5">
                    {profile.district}, {profile.state}
                  </p>
                </div>
                <span className="text-xs font-bold text-blue-800 bg-blue-50 border border-blue-200 px-3 py-1 rounded-lg">
                  {profile.denomination}
                </span>
              </div>
            </div>

            {/* About & Faith Testimony */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider pb-2 border-b border-slate-100">
                About & Faith Testimony
              </h2>
              <div className="space-y-3 text-xs text-slate-700 leading-relaxed">
                <div>
                  <h3 className="font-semibold text-slate-900 mb-1">About Me:</h3>
                  <p className="text-slate-600">{profile.bio || 'Candidate has not added bio details yet.'}</p>
                </div>
                {profile.faith_testimony && (
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-1">Faith & Church Testimony:</h3>
                    <p className="text-slate-600">{profile.faith_testimony}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Church & Denominational Background */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider pb-2 border-b border-slate-100">
                Church & Denominational Background
              </h2>
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-slate-500 block">Denomination</span>
                  <span className="font-semibold text-slate-900">{profile.denomination || '—'}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Sub-Denomination</span>
                  <span className="font-semibold text-slate-900">{profile.sub_denomination || '—'}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Church / Parish</span>
                  <span className="font-semibold text-slate-900">{profile.church_name || '—'}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Pastor / Parish In-Charge</span>
                  <span className="font-semibold text-slate-900">{profile.parish_or_pastor || '—'}</span>
                </div>
              </div>
            </div>

            {/* Education & Career */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider pb-2 border-b border-slate-100">
                Education & Career
              </h2>
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-slate-500 block">Highest Education</span>
                  <span className="font-semibold text-slate-900">{profile.highest_education || '—'}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Education Field</span>
                  <span className="font-semibold text-slate-900">{profile.education_field || '—'}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Occupation</span>
                  <span className="font-semibold text-slate-900">{profile.occupation_title || '—'}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Employment Sector</span>
                  <span className="font-semibold text-slate-900">{profile.employed_in || '—'}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Work Location</span>
                  <span className="font-semibold text-slate-900">{profile.work_location || `${profile.district}, ${profile.state}`}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Annual Income</span>
                  <span className="font-semibold text-slate-900">{profile.annual_income_min ? `₹ ${profile.annual_income_min.toLocaleString()} PA` : 'Confidential'}</span>
                </div>
              </div>
            </div>

            {/* Family Details */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider pb-2 border-b border-slate-100">
                Family Background
              </h2>
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-slate-500 block">Father&apos;s Occupation</span>
                  <span className="font-semibold text-slate-900">{profile.father_occupation || '—'}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Mother&apos;s Occupation</span>
                  <span className="font-semibold text-slate-900">{profile.mother_occupation || '—'}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Family Values</span>
                  <span className="font-semibold text-slate-900">{profile.family_values || 'Moderate / Traditional'}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Native Place</span>
                  <span className="font-semibold text-slate-900">{profile.native_place || profile.district || '—'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
