'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { apiClient } from '../../lib/api-client';
import { VerificationStatusResponse } from '../../types';

export default function VerificationStatusPage() {
  const [statusData, setStatusData] = useState<VerificationStatusResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadStatus() {
      try {
        const data = await apiClient.getVerificationStatus();
        setStatusData(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load verification status');
      } finally {
        setLoading(false);
      }
    }
    loadStatus();
  }, []);

  if (loading) {
    return (
      <div className="bg-[#fdfbf7] min-h-screen py-16 flex items-center justify-center">
        <p className="text-xs text-charcoal-500 font-semibold">Loading verification pipeline status...</p>
      </div>
    );
  }

  return (
    <div className="bg-[#fdfbf7] min-h-screen py-10 text-charcoal-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white border border-[#ece2d1] rounded-3xl p-8 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-6 border-b border-[#ece2d1] gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-burgundy-700 block mb-1">
                Account Moderation Pipeline
              </span>
              <h1 className="text-2xl font-serif font-extrabold text-charcoal-900">
                Profile Verification Status
              </h1>
            </div>

            <div className="flex items-center gap-2">
              <span className={`text-xs font-bold px-3 py-1.5 rounded-xl border ${
                statusData?.status === 'APPROVED'
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  : statusData?.status === 'CHANGES_REQUIRED'
                  ? 'bg-gold-50 text-gold-900 border-gold-300'
                  : statusData?.status === 'REJECTED'
                  ? 'bg-red-50 text-red-700 border-red-200'
                  : 'bg-burgundy-50 text-burgundy-900 border-burgundy-200'
              }`}>
                Current Status: {statusData?.status || 'DRAFT'}
              </span>
            </div>
          </div>

          {/* Status Details */}
          <div className="py-6 space-y-6">
            {statusData?.status === 'APPROVED' && (
              <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-5 text-emerald-900 text-xs leading-relaxed">
                <h3 className="font-serif font-extrabold text-sm mb-1 text-emerald-950">Profile Verified &amp; Discoverable</h3>
                <p>Your matrimony profile has been verified and is discoverable to eligible Christian candidates in Bidar and across India.</p>
              </div>
            )}

            {statusData?.status === 'CHANGES_REQUIRED' && (
              <div className="bg-gold-50/70 border border-gold-300 rounded-2xl p-5 text-gold-950 text-xs leading-relaxed space-y-2">
                <h3 className="font-serif font-extrabold text-sm text-gold-950">Changes Requested by Review Team</h3>
                <p>Notes: <em>{statusData.changes_requested_notes || 'Please update your church or photo details.'}</em></p>
                <Link href="/profile/create" className="inline-block px-4 py-2 rounded-xl bg-burgundy-700 text-white font-bold text-xs mt-2 hover:bg-burgundy-800 transition-all">
                  Edit Profile Information
                </Link>
              </div>
            )}

            {statusData?.status === 'UNDER_REVIEW' && (
              <div className="bg-burgundy-50/60 border border-burgundy-200 rounded-2xl p-5 text-burgundy-900 text-xs leading-relaxed">
                <h3 className="font-serif font-extrabold text-sm mb-1 text-burgundy-950">Profile Submitted for Moderator Review</h3>
                <p>Our team is verifying your church denomination and pastoral credentials. Reviews typically conclude within 24 hours.</p>
              </div>
            )}

            {/* Checklist */}
            <div className="space-y-3 pt-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-charcoal-700">
                Automated Verification Pipeline Checks
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="bg-[#faf6ee] border border-[#ece2d1] p-3.5 rounded-xl flex items-center justify-between">
                  <span className="text-charcoal-700 font-medium">Required Profile Information</span>
                  <span className="font-bold text-emerald-700">Completed ✓</span>
                </div>

                <div className="bg-[#faf6ee] border border-[#ece2d1] p-3.5 rounded-xl flex items-center justify-between">
                  <span className="text-charcoal-700 font-medium">Mobile OTP Verification</span>
                  <span className="font-bold text-emerald-700">Verified ✓</span>
                </div>

                <div className="bg-[#faf6ee] border border-[#ece2d1] p-3.5 rounded-xl flex items-center justify-between">
                  <span className="text-charcoal-700 font-medium">5+ Profile Photos Requirement</span>
                  <span className={`font-bold ${statusData?.has_min_5_photos ? 'text-emerald-700' : 'text-gold-800'}`}>
                    {statusData?.photos_count || 0} / 5 Photos
                  </span>
                </div>

                <div className="bg-[#faf6ee] border border-[#ece2d1] p-3.5 rounded-xl flex items-center justify-between">
                  <span className="text-charcoal-700 font-medium">Duplicate Account Detection</span>
                  <span className="font-bold text-emerald-700">Passed ✓</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Actions */}
          <div className="pt-6 border-t border-[#ece2d1] flex items-center justify-between">
            <Link href="/profile/photos" className="text-xs font-bold text-burgundy-700 hover:underline">
              Manage 5+ Profile Photos →
            </Link>
            <Link href="/discover" className="bg-gradient-to-r from-burgundy-700 to-burgundy-800 hover:from-burgundy-600 hover:to-burgundy-700 text-white text-xs font-extrabold px-6 py-3 rounded-xl shadow-md transition-all">
              Explore Matches →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
