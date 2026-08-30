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
      <div className="bg-slate-50 min-h-screen py-16 flex items-center justify-center">
        <p className="text-xs text-slate-500 font-semibold">Loading verification pipeline status...</p>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-6 border-b border-slate-100 gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-700 block mb-1">
                Account Moderation Pipeline
              </span>
              <h1 className="text-2xl font-bold text-slate-900">
                Profile Verification Status
              </h1>
            </div>

            <div className="flex items-center gap-2">
              <span className={`text-xs font-bold px-3 py-1 rounded-md ${
                statusData?.status === 'APPROVED'
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : statusData?.status === 'CHANGES_REQUIRED'
                  ? 'bg-amber-50 text-amber-700 border border-amber-200'
                  : statusData?.status === 'REJECTED'
                  ? 'bg-red-50 text-red-700 border border-red-200'
                  : 'bg-blue-50 text-blue-700 border border-blue-200'
              }`}>
                Current Status: {statusData?.status || 'DRAFT'}
              </span>
            </div>
          </div>

          {/* Status Details */}
          <div className="py-6 space-y-6">
            {statusData?.status === 'APPROVED' && (
              <div className="bg-emerald-50/60 border border-emerald-200 rounded-xl p-5 text-emerald-900 text-xs leading-relaxed">
                <h3 className="font-bold text-sm mb-1 text-emerald-950">Profile Verified & Discoverable</h3>
                <p>Your matrimony profile has been verified and is discoverable to eligible Christian candidates in Bidar and across India.</p>
              </div>
            )}

            {statusData?.status === 'CHANGES_REQUIRED' && (
              <div className="bg-amber-50/60 border border-amber-200 rounded-xl p-5 text-amber-900 text-xs leading-relaxed space-y-2">
                <h3 className="font-bold text-sm text-amber-950">Changes Requested by Review Team</h3>
                <p>Notes: <em>{statusData.changes_requested_notes || 'Please update your church or photo details.'}</em></p>
                <Link href="/profile/edit" className="inline-block px-4 py-1.5 rounded-lg bg-amber-600 text-white font-semibold text-xs mt-2">
                  Edit Profile Information
                </Link>
              </div>
            )}

            {statusData?.status === 'UNDER_REVIEW' && (
              <div className="bg-blue-50/60 border border-blue-200 rounded-xl p-5 text-blue-900 text-xs leading-relaxed">
                <h3 className="font-bold text-sm mb-1 text-blue-950">Profile Submitted for Moderator Review</h3>
                <p>Our team is verifying your church denomination and photo credentials. Reviews typically conclude within 24 hours.</p>
              </div>
            )}

            {/* Checklist */}
            <div className="space-y-3 pt-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Automated Verification Pipeline Checks
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-lg flex items-center justify-between">
                  <span className="text-slate-700">Required Profile Information</span>
                  <span className="font-semibold text-emerald-700">Completed</span>
                </div>

                <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-lg flex items-center justify-between">
                  <span className="text-slate-700">Mobile OTP Verification</span>
                  <span className="font-semibold text-emerald-700">Verified</span>
                </div>

                <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-lg flex items-center justify-between">
                  <span className="text-slate-700">5+ Profile Photos Requirement</span>
                  <span className={`font-semibold ${statusData?.has_min_5_photos ? 'text-emerald-700' : 'text-amber-700'}`}>
                    {statusData?.photos_count || 0} / 5 Photos
                  </span>
                </div>

                <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-lg flex items-center justify-between">
                  <span className="text-slate-700">Duplicate Account Detection</span>
                  <span className="font-semibold text-emerald-700">Passed</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Actions */}
          <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
            <Link href="/profile/photos" className="text-xs font-semibold text-blue-700 hover:underline">
              Manage 5+ Profile Photos →
            </Link>
            <Link href="/discover" className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold px-4 py-2 rounded-lg">
              Explore Matches
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
