'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { apiClient } from '../../lib/api-client';
import { InterestItem } from '../../types';

export default function InterestsPage() {
  const [tab, setTab] = useState<'received' | 'sent' | 'matches'>('received');
  const [items, setItems] = useState<InterestItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadInterests = async (currentTab: 'received' | 'sent' | 'matches') => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiClient.getInterests(currentTab);
      setItems(data.items || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load interests');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInterests(tab);
  }, [tab]);

  const handleRespond = async (interestId: number, accept: boolean) => {
    try {
      await apiClient.respondInterest(interestId, accept);
      alert(accept ? 'Interest accepted! You can now chat in Messages.' : 'Interest declined.');
      loadInterests(tab);
    } catch (err: any) {
      alert(`Notice: ${err.message}`);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Interests & Mutual Matches
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Manage member connection requests, sent interests, and mutual matrimonial matches.
            </p>
          </div>
          <Link
            href="/chat"
            className="bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold px-4 py-2.5 rounded-lg shadow-xs self-start sm:self-auto transition-colors"
          >
            Open Messages
          </Link>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 mb-6 bg-white rounded-t-xl px-4 pt-2">
          <button
            onClick={() => setTab('received')}
            className={`py-3 px-6 text-xs font-bold border-b-2 transition-all ${
              tab === 'received'
                ? 'border-blue-700 text-blue-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Received Interests
          </button>
          <button
            onClick={() => setTab('sent')}
            className={`py-3 px-6 text-xs font-bold border-b-2 transition-all ${
              tab === 'sent'
                ? 'border-blue-700 text-blue-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Sent Interests
          </button>
          <button
            onClick={() => setTab('matches')}
            className={`py-3 px-6 text-xs font-bold border-b-2 transition-all ${
              tab === 'matches'
                ? 'border-blue-700 text-blue-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Mutual Matches (Chat Enabled)
          </button>
        </div>

        {/* Content list */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-xl border border-slate-200 h-28 animate-pulse" />
            ))}
          </div>
        ) : error ? (
          <div className="bg-white border border-red-200 rounded-xl p-8 text-center text-xs text-red-600">
            {error}
          </div>
        ) : items.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-xl p-12 text-center">
            <h3 className="text-base font-bold text-slate-900 mb-1">
              No items in this tab
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              {tab === 'received' && 'You have not received any new interests yet.'}
              {tab === 'sent' && 'You have not sent any connection interests yet.'}
              {tab === 'matches' && 'Mutual matches occur when both candidate profiles accept each other.'}
            </p>
            <Link
              href="/discover"
              className="inline-block bg-blue-700 text-white text-xs font-semibold px-4 py-2 rounded-lg"
            >
              Browse Candidate Profiles
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-lg bg-slate-100 overflow-hidden border border-slate-200 shrink-0">
                    {item.other_user?.primary_photo ? (
                      <img
                        src={item.other_user.primary_photo}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[10px] text-slate-400 font-semibold">
                        Photo
                      </div>
                    )}
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-slate-900">
                      {item.other_user?.first_name} {item.other_user?.last_name}
                      {item.other_user?.age && `, ${item.other_user.age} Yrs`}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {item.other_user?.denomination} • {item.other_user?.district}
                    </p>
                    {item.message && (
                      <p className="text-xs text-slate-700 italic mt-1 bg-slate-50 p-2 rounded-md border border-slate-100">
                        &quot;{item.message}&quot;
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto">
                  {tab === 'received' && item.status === 'PENDING' && (
                    <>
                      <button
                        onClick={() => handleRespond(item.id, true)}
                        className="px-3.5 py-1.5 rounded-lg bg-blue-700 text-white text-xs font-semibold hover:bg-blue-800 transition-colors"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => handleRespond(item.id, false)}
                        className="px-3.5 py-1.5 rounded-lg bg-slate-100 text-slate-700 text-xs font-semibold hover:bg-slate-200 transition-colors border border-slate-200"
                      >
                        Decline
                      </button>
                    </>
                  )}

                  {tab === 'matches' && (
                    <Link
                      href={`/chat`}
                      className="px-4 py-2 rounded-lg bg-blue-700 text-white text-xs font-semibold hover:bg-blue-800 transition-colors shadow-2xs"
                    >
                      Message Now
                    </Link>
                  )}

                  <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md">
                    Status: {item.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
