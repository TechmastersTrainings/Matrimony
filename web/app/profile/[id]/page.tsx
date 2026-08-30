'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { apiClient } from '../../../lib/api-client';

export default function CandidateDetailPage() {
  const params = useParams();
  const router = useRouter();
  const profileId = params?.id ? parseInt(String(params.id)) : null;

  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      if (!profileId) return;
      try {
        const data = await apiClient.getCandidateProfile(profileId);
        setProfile(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [profileId]);

  const handleSendInterest = async () => {
    if (!profile) return;
    try {
      await apiClient.sendInterest(profile.user_id);
      alert('✓ Matrimonial interest sent successfully!');
    } catch (err: any) {
      alert(`Notice: ${err.message}`);
    }
  };

  const handleContactReveal = async () => {
    if (!profile) return;
    try {
      await apiClient.requestContactReveal(profile.user_id);
      alert('✓ Contact reveal request submitted. You will be notified upon mutual confirmation.');
    } catch (err: any) {
      alert(`Notice: ${err.message}`);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-20 px-4 text-center">
        <div className="animate-spin h-8 w-8 border-4 border-amber-700 border-t-transparent rounded-full mx-auto mb-3" />
        <p className="text-stone-500 text-sm">Loading verified profile...</p>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="max-w-md mx-auto py-16 px-4 text-center">
        <div className="p-6 bg-red-50 border border-red-200 rounded-2xl text-red-700">
          <h3 className="font-bold mb-1">Profile Unavailable</h3>
          <p className="text-xs">{error || 'This profile is not active or under review.'}</p>
          <Link href="/discover" className="inline-block mt-4 text-xs font-semibold bg-stone-900 text-white px-4 py-2 rounded-lg">
            Back to Discover
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Top Banner */}
      <div className="bg-white border border-stone-200 rounded-3xl p-6 md:p-8 shadow-sm mb-8">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          {/* Photo Gallery */}
          <div className="w-full md:w-80 shrink-0">
            <div className="aspect-3/4 rounded-2xl overflow-hidden bg-stone-100 mb-3 shadow">
              <img
                src={profile.photos?.[0]?.r2_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80'}
                alt={profile.first_name}
                className="w-full h-full object-cover"
              />
            </div>
            {profile.photos && profile.photos.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {profile.photos.slice(1, 5).map((p: any) => (
                  <div key={p.id} className="aspect-square rounded-lg overflow-hidden bg-stone-100">
                    <img src={p.thumbnail_url || p.r2_url} alt="Photo" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Core Info & Actions */}
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-amber-800 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full">
                  {profile.denomination} • {profile.district}
                </span>
                <h1 className="text-3xl font-extrabold text-stone-900 mt-2">
                  {profile.first_name} {profile.last_name}
                </h1>
                <p className="text-sm text-stone-600 mt-1">
                  {profile.age} Years • {profile.height_cm ? `${profile.height_cm} cm` : ''} • {profile.marital_status?.replace('_', ' ')}
                </p>
              </div>

              {profile.match_score && (
                <div className="text-right">
                  <span className="text-2xl font-black text-emerald-700">{profile.match_score}%</span>
                  <p className="text-[10px] text-stone-500 uppercase font-semibold">Match Score</p>
                </div>
              )}
            </div>

            {/* Quick Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 my-6">
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-100 text-xs">
                <span className="text-stone-400 block text-[10px] font-semibold uppercase">Church / Parish</span>
                <span className="font-bold text-stone-800">{profile.church_name || 'Christian Church'}</span>
              </div>
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-100 text-xs">
                <span className="text-stone-400 block text-[10px] font-semibold uppercase">Profession</span>
                <span className="font-bold text-stone-800">{profile.occupation_title || 'Professional'}</span>
              </div>
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-100 text-xs">
                <span className="text-stone-400 block text-[10px] font-semibold uppercase">Education</span>
                <span className="font-bold text-stone-800">{profile.highest_education || 'Degree'}</span>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleSendInterest}
                className="bg-amber-700 hover:bg-amber-800 text-white text-xs font-semibold px-6 py-3 rounded-xl shadow-xs"
              >
                Send Matrimonial Interest
              </button>
              <button
                onClick={handleContactReveal}
                className="bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold px-6 py-3 rounded-xl shadow-xs"
              >
                Request Contact Reveal
              </button>
              <Link
                href="/chat"
                className="bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold px-6 py-3 rounded-xl"
              >
                Chat
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Sections: Faith, Family, Lifestyle, Preferences */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white border border-stone-200 rounded-3xl p-6 shadow-sm">
          <h2 className="text-base font-bold text-stone-900 mb-4 flex items-center gap-2">
            <span>✝</span> Christian Faith & Testimony
          </h2>
          <div className="space-y-3 text-xs text-stone-700">
            <p><strong>Denomination:</strong> {profile.denomination}</p>
            <p><strong>Church Name:</strong> {profile.church_name || 'N/A'}</p>
            <p><strong>Pastor / Parish:</strong> {profile.parish_or_pastor || 'N/A'}</p>
            <p><strong>Baptized:</strong> {profile.is_baptized ? 'Yes (Baptized Believer)' : 'No'}</p>
            {profile.faith_testimony && (
              <div className="mt-4 p-3 bg-amber-50/50 border border-amber-100 rounded-xl italic">
                &quot;{profile.faith_testimony}&quot;
              </div>
            )}
          </div>
        </div>

        <div className="bg-white border border-stone-200 rounded-3xl p-6 shadow-sm">
          <h2 className="text-base font-bold text-stone-900 mb-4 flex items-center gap-2">
            <span>👨‍👩‍👧‍👦</span> Family & Background
          </h2>
          <div className="space-y-3 text-xs text-stone-700">
            <p><strong>Father&apos;s Name:</strong> {profile.father_name || 'N/A'}</p>
            <p><strong>Father&apos;s Profession:</strong> {profile.father_occupation || 'N/A'}</p>
            <p><strong>Mother&apos;s Name:</strong> {profile.mother_name || 'N/A'}</p>
            <p><strong>Mother&apos;s Profession:</strong> {profile.mother_occupation || 'N/A'}</p>
            <p><strong>Family Values:</strong> {profile.family_values || 'Traditional'}</p>
            {profile.about_family && (
              <div className="mt-4 p-3 bg-stone-50 rounded-xl">
                {profile.about_family}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
