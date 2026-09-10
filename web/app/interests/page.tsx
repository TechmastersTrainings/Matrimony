'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { apiClient } from '../../lib/api-client';
import { InterestItem } from '../../types';
import { getPhotoUrl, DEFAULT_AVATAR_SVG } from '../../lib/utils';

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
    <div className="bg-[#fdfbf7] min-h-screen py-8 text-charcoal-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#ece2d1] shadow-sm mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-widest text-cyan-800 block mb-1">
              CovenantNest Connections
            </span>
            <h1 className="text-2xl sm:text-3xl font-serif font-extrabold text-charcoal-900">
              Interests &amp; Mutual Matches
            </h1>
            <p className="text-xs sm:text-sm text-charcoal-600 mt-1">
              Manage member connection requests, sent interests, and mutual matrimonial matches with dignity.
            </p>
          </div>
          <Link
            href="/chat"
            className="bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 text-white text-xs font-extrabold px-5 py-3 rounded-xl shadow-md self-start sm:self-auto transition-all"
          >
            Open Messages 💬
          </Link>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-[#ece2d1] mb-6 bg-white rounded-t-2xl px-4 pt-2 shadow-xs">
          <button
            onClick={() => setTab('received')}
            className={`py-3 px-6 text-xs font-bold border-b-2 transition-all ${
              tab === 'received'
                ? 'border-burgundy-700 text-burgundy-800 font-extrabold'
                : 'border-transparent text-charcoal-500 hover:text-charcoal-900'
            }`}
          >
            Received Interests
          </button>
          <button
            onClick={() => setTab('sent')}
            className={`py-3 px-6 text-xs font-bold border-b-2 transition-all ${
              tab === 'sent'
                ? 'border-burgundy-700 text-burgundy-800 font-extrabold'
                : 'border-transparent text-charcoal-500 hover:text-charcoal-900'
            }`}
          >
            Sent Interests
          </button>
          <button
            onClick={() => setTab('matches')}
            className={`py-3 px-6 text-xs font-bold border-b-2 transition-all ${
              tab === 'matches'
                ? 'border-burgundy-700 text-burgundy-800 font-extrabold'
                : 'border-transparent text-charcoal-500 hover:text-charcoal-900'
            }`}
          >
            Mutual Matches (Chat Enabled)
          </button>
        </div>

        {/* Content list */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-2xl border border-[#ece2d1] h-28 animate-pulse shadow-xs" />
            ))}
          </div>
        ) : error ? (
          <div className="bg-white border border-red-200 rounded-2xl p-8 text-center text-xs text-red-600 shadow-xs">
            {error}
          </div>
        ) : items.length === 0 ? (
          <div className="bg-white border border-[#ece2d1] rounded-3xl p-12 text-center shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-gold-50 border border-gold-200 text-gold-800 font-bold flex items-center justify-center text-lg mx-auto mb-3">
              ✝
            </div>
            <h3 className="text-base font-serif font-extrabold text-charcoal-900 mb-1">
              No items in this tab
            </h3>
            <p className="text-xs text-charcoal-600 mb-5 max-w-md mx-auto">
              {tab === 'received' && 'You have not received any new candidate interests yet.'}
              {tab === 'sent' && 'You have not sent any connection interests yet.'}
              {tab === 'matches' && 'Mutual matches occur when both candidate profiles accept each other.'}
            </p>
            <Link
              href="/discover"
              className="inline-block bg-gradient-to-r from-burgundy-700 to-burgundy-800 hover:from-burgundy-600 hover:to-burgundy-700 text-white text-xs font-extrabold px-6 py-3 rounded-xl shadow-md transition-all"
            >
              Browse Candidate Profiles →
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-white border border-[#ece2d1] rounded-2xl p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-gold-300 transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-[#faf6ee] overflow-hidden border border-[#ece2d1] shrink-0">
                    <img
                      src={getPhotoUrl(item.other_user?.primary_photo) || DEFAULT_AVATAR_SVG}
                      alt="Profile"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = DEFAULT_AVATAR_SVG;
                      }}
                    />
                  </div>

                  <div>
                    <h3 className="text-sm font-serif font-extrabold text-charcoal-900">
                      {item.other_user?.first_name} {item.other_user?.last_name}
                      {item.other_user?.age ? `, ${item.other_user.age} Yrs` : ''}
                    </h3>
                    <p className="text-xs text-charcoal-600 mt-0.5">
                      {item.other_user?.denomination || '—'} • {item.other_user?.district || '—'}
                    </p>
                    {item.message && (
                      <p className="text-xs text-charcoal-700 italic mt-1.5 bg-[#faf6ee] p-2.5 rounded-xl border border-[#ece2d1]">
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
                        className="px-4 py-2 rounded-xl bg-gradient-to-r from-burgundy-700 to-burgundy-800 text-white text-xs font-bold hover:from-burgundy-600 hover:to-burgundy-700 transition-all shadow-xs"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => handleRespond(item.id, false)}
                        className="px-4 py-2 rounded-xl bg-[#faf6ee] text-charcoal-700 text-xs font-bold hover:bg-[#ece2d1] transition-all border border-[#ded0ba]"
                      >
                        Decline
                      </button>
                    </>
                  )}

                  {tab === 'matches' && (
                    <Link
                      href={`/chat`}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-burgundy-700 to-burgundy-800 text-white text-xs font-extrabold hover:from-burgundy-600 hover:to-burgundy-700 transition-all shadow-sm"
                    >
                      Message Now
                    </Link>
                  )}

                  <span className="text-[11px] font-bold text-gold-900 bg-gold-50 border border-gold-200 px-3 py-1 rounded-lg">
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
