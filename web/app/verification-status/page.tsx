'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { apiClient } from '../../lib/api-client';
import { VerificationStatusResponse } from '../../types';

export default function VerificationStatusPage() {
  const [verif, setVerif] = useState<VerificationStatusResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await apiClient.getVerificationStatus();
        setVerif(data);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch verification status');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="max-w-xl mx-auto py-16 px-4 text-center">
        <div className="animate-spin h-8 w-8 border-4 border-amber-700 border-t-transparent rounded-full mx-auto mb-4" />
        <p className="text-stone-600 text-sm">Checking verification pipeline status...</p>
      </div>
    );
  }

  if (error || !verif) {
    return (
      <div className="max-w-xl mx-auto py-16 px-4 text-center">
        <div className="p-6 bg-red-50 border border-red-200 rounded-2xl text-red-700">
          <h2 className="text-lg font-bold mb-2">Unable to Load Verification</h2>
          <p className="text-sm">{error || 'Please register or log in first.'}</p>
          <Link href="/login" className="inline-block mt-4 text-xs font-semibold bg-red-700 text-white px-4 py-2 rounded-lg">
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full">APPROVED & ACTIVE</span>;
      case 'UNDER_REVIEW':
      case 'SUBMITTED':
        return <span className="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full">UNDER REVIEW</span>;
      case 'CHANGES_REQUIRED':
        return <span className="bg-amber-100 text-amber-800 text-xs font-bold px-3 py-1 rounded-full">CHANGES REQUIRED</span>;
      case 'REJECTED':
        return <span className="bg-red-100 text-red-800 text-xs font-bold px-3 py-1 rounded-full">REJECTED</span>;
      default:
        return <span className="bg-stone-100 text-stone-800 text-xs font-bold px-3 py-1 rounded-full">DRAFT IN PROGRESS</span>;
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="bg-white border border-stone-200 rounded-3xl p-8 shadow-sm">
        <div className="flex items-center justify-between border-b border-stone-100 pb-6 mb-6">
          <div>
            <span className="text-xs text-stone-500 font-medium">Profile #{verif.profile_id}</span>
            <h1 className="text-2xl font-bold text-stone-900 mt-1">Verification Status</h1>
          </div>
          <div>{getStatusBadge(verif.status)}</div>
        </div>

        {/* Status Messaging */}
        {verif.status === 'APPROVED' && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl mb-6">
            <h3 className="font-bold text-emerald-900 text-sm">🎉 Congratulations! Your Profile is Approved</h3>
            <p className="text-xs text-emerald-800 mt-1">
              Your profile is verified and visible to genuine Christian matches across Bidar & Karnataka.
            </p>
            <div className="mt-4">
              <Link href="/discover" className="bg-emerald-700 text-white text-xs font-semibold px-4 py-2 rounded-lg hover:bg-emerald-800">
                Explore Matches →
              </Link>
            </div>
          </div>
        )}

        {(verif.status === 'UNDER_REVIEW' || verif.status === 'SUBMITTED') && (
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-2xl mb-6">
            <h3 className="font-bold text-blue-900 text-sm">⏳ Profile Under Pastoral & Admin Review</h3>
            <p className="text-xs text-blue-800 mt-1">
              Our moderation team is reviewing your church details, denomination, and 5+ uploaded photos. This usually takes 2-6 hours.
            </p>
          </div>
        )}

        {verif.status === 'CHANGES_REQUIRED' && (
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl mb-6">
            <h3 className="font-bold text-amber-900 text-sm">⚠ Changes Requested by Moderator</h3>
            <p className="text-xs text-amber-800 mt-1 font-medium">
              Note: &quot;{verif.changes_requested_notes || 'Please update your photos or details.'}&quot;
            </p>
            <div className="mt-4 flex gap-3">
              <Link href="/profile/photos" className="bg-amber-700 text-white text-xs font-semibold px-4 py-2 rounded-lg hover:bg-amber-800">
                Manage Photos
              </Link>
              <Link href="/profile/edit" className="bg-stone-200 text-stone-800 text-xs font-semibold px-4 py-2 rounded-lg hover:bg-stone-300">
                Edit Details
              </Link>
            </div>
          </div>
        )}

        {/* Automated Checks Breakdown */}
        <h3 className="text-sm font-bold text-stone-900 mb-3">Verification Pipeline Checks</h3>
        <div className="space-y-2 mb-6">
          <div className="flex items-center justify-between p-3 bg-stone-50 rounded-xl text-xs">
            <span className="font-medium text-stone-700">Minimum 5 Photos Uploaded</span>
            <span className={verif.has_min_5_photos ? 'text-emerald-700 font-bold' : 'text-red-700 font-bold'}>
              {verif.has_min_5_photos ? `✓ (${verif.photos_count} Photos)` : `✕ (${verif.photos_count} / 5 Photos)`}
            </span>
          </div>

          <div className="flex items-center justify-between p-3 bg-stone-50 rounded-xl text-xs">
            <span className="font-medium text-stone-700">Automated Integrity & Content Checks</span>
            <span className={verif.automated_checks_passed ? 'text-emerald-700 font-bold' : 'text-amber-700 font-bold'}>
              {verif.automated_checks_passed ? '✓ Passed' : 'Pending / Flagged'}
            </span>
          </div>
        </div>

        {verif.flagged_reasons.length > 0 && (
          <div className="p-4 bg-stone-50 border border-stone-200 rounded-xl mb-6">
            <h4 className="text-xs font-bold text-stone-800 mb-2">Automated Check Notices:</h4>
            <ul className="list-disc list-inside text-xs text-stone-600 space-y-1">
              {verif.flagged_reasons.map((f, i) => (
                <li key={i}>{f}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex justify-between items-center border-t border-stone-100 pt-6">
          <Link href="/profile/photos" className="text-xs font-semibold text-amber-700 hover:text-amber-800">
            ← Manage Photos ({verif.photos_count})
          </Link>
          <Link href="/" className="text-xs font-semibold text-stone-600 hover:text-stone-900">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
