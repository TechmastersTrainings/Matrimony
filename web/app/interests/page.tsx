'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { apiClient } from '../../lib/api-client';
import { InterestItem } from '../../types';

export default function InterestsPage() {
  const [tab, setTab] = useState<'received' | 'sent' | 'matches'>('received');
  const [interests, setInterests] = useState<InterestItem[]>([]);
  const [loading, setLoading] = useState(true);

  const loadInterests = async () => {
    setLoading(true);
    try {
      const data = await apiClient.getInterests(tab);
      setInterests(data.items);
    } catch (err) {
      // Offline / error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInterests();
  }, [tab]);

  const handleRespond = async (interestId: number, accept: boolean) => {
    try {
      await apiClient.respondInterest(interestId, accept);
      alert(`Interest ${accept ? 'Accepted! You are now matched' : 'Declined'}.`);
      await loadInterests();
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8 pb-6 border-b border-stone-200">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">Interests & Matches</h1>
          <p className="text-xs text-stone-600">Track and respond to matrimonial connections.</p>
        </div>
        <Link href="/discover" className="text-xs font-semibold bg-amber-700 text-white px-4 py-2.5 rounded-xl hover:bg-amber-800">
          Find More Matches →
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-stone-200 pb-px mb-6">
        <button
          onClick={() => setTab('received')}
          className={`text-xs font-semibold px-4 py-2.5 border-b-2 transition-colors ${tab === 'received' ? 'border-amber-700 text-amber-800 font-bold' : 'border-transparent text-stone-500 hover:text-stone-900'}`}
        >
          Received Requests
        </button>
        <button
          onClick={() => setTab('sent')}
          className={`text-xs font-semibold px-4 py-2.5 border-b-2 transition-colors ${tab === 'sent' ? 'border-amber-700 text-amber-800 font-bold' : 'border-transparent text-stone-500 hover:text-stone-900'}`}
        >
          Sent Interests
        </button>
        <button
          onClick={() => setTab('matches')}
          className={`text-xs font-semibold px-4 py-2.5 border-b-2 transition-colors ${tab === 'matches' ? 'border-amber-700 text-amber-800 font-bold' : 'border-transparent text-stone-500 hover:text-stone-900'}`}
        >
          ✨ Mutual Matches & Chat
        </button>
      </div>

      {loading ? (
        <div className="py-16 text-center text-stone-500 text-xs">Loading connections...</div>
      ) : interests.length === 0 ? (
        <div className="py-16 text-center bg-stone-50 rounded-2xl border border-stone-200">
          <p className="text-xs text-stone-500">No {tab} interests found.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {interests.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-stone-200 rounded-2xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full overflow-hidden bg-stone-100 shrink-0">
                  <img
                    src={item.other_user.primary_photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80'}
                    alt="Photo"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-bold text-stone-900 text-sm">
                    {item.other_user.first_name} {item.other_user.last_name}
                    {item.other_user.age && <span className="font-normal text-stone-500 text-xs ml-1">({item.other_user.age} yrs)</span>}
                  </h3>
                  <p className="text-xs text-stone-500">
                    {item.other_user.denomination} • {item.other_user.district}
                  </p>
                  {item.message && (
                    <p className="text-xs text-amber-900/80 italic mt-1 bg-amber-50/60 px-2 py-0.5 rounded">
                      &quot;{item.message}&quot;
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                {tab === 'received' && item.status === 'PENDING' && (
                  <>
                    <button
                      onClick={() => handleRespond(item.id, true)}
                      className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold px-4 py-2 rounded-xl"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => handleRespond(item.id, false)}
                      className="bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold px-4 py-2 rounded-xl"
                    >
                      Decline
                    </button>
                  </>
                )}

                {item.status === 'ACCEPTED' && (
                  <Link
                    href={`/chat`}
                    className="bg-amber-700 hover:bg-amber-800 text-white text-xs font-semibold px-4 py-2 rounded-xl"
                  >
                    💬 Message Match
                  </Link>
                )}

                {tab === 'sent' && (
                  <span className="text-xs font-medium bg-stone-100 text-stone-600 px-3 py-1.5 rounded-full">
                    Status: {item.status}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
