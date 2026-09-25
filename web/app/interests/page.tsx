'use client';

import React, { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { apiClient } from '../../lib/api-client';
import { InterestItem } from '../../types';
import { getPhotoUrl, DEFAULT_AVATAR_SVG } from '../../lib/utils';

function InterestsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTab = (searchParams.get('tab') as 'received' | 'sent' | 'matches') || 'received';

  const [tab, setTab] = useState<'received' | 'sent' | 'matches'>(
    ['received', 'sent', 'matches'].includes(initialTab) ? initialTab : 'received'
  );
  const [items, setItems] = useState<InterestItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [respondingId, setRespondingId] = useState<number | null>(null);
  const [acceptedPartner, setAcceptedPartner] = useState<{ id: number; name: string; userId: number } | null>(null);

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
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('access_token');
      if (!token) {
        alert('Need to login: Please log in to view your matrimonial interests.');
        window.location.href = '/login?redirect=/interests';
        return;
      }
    }
    loadInterests(tab);
  }, [tab]);

  // Sync tab if query param changes
  useEffect(() => {
    const qTab = searchParams.get('tab') as 'received' | 'sent' | 'matches';
    if (qTab && ['received', 'sent', 'matches'].includes(qTab) && qTab !== tab) {
      setTab(qTab);
    }
  }, [searchParams]);

  const handleRespond = async (interest: InterestItem, accept: boolean) => {
    if (!accept) {
      const confirmed = window.confirm(
        `Are you sure you want to decline the interest request from ${interest.other_user?.first_name || 'this member'}?`
      );
      if (!confirmed) return;
    }

    setRespondingId(interest.id);
    try {
      const res = await apiClient.respondInterest(interest.id, accept);
      if (accept) {
        const otherUserId = res.other_user_id || interest.other_user?.user_id || interest.other_user?.id;
        const otherName = interest.other_user?.first_name || 'Member';
        setAcceptedPartner({ id: interest.id, name: otherName, userId: otherUserId });
        // Also reload list to update statuses
        await loadInterests(tab);
      } else {
        alert('Matrimonial interest has been declined.');
        await loadInterests(tab);
      }
    } catch (err: any) {
      if (err.status === 402 || err.message?.includes('subscription') || err.message?.includes('plan')) {
        const upgrade = window.confirm(
          'An active subscription plan is required to accept matches and initiate communication. Would you like to view our affordable membership plans?'
        );
        if (upgrade) {
          router.push('/subscriptions');
        }
      } else {
        alert(`Notice: ${err.message || 'Failed to update interest status.'}`);
      }
    } finally {
      setRespondingId(null);
    }
  };

  return (
    <div className="bg-[#fdfbf7] min-h-screen py-8 text-charcoal-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Header */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#ece2d1] shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-widest text-cyan-800 block mb-1">
              Shalom Christian Matrimony
            </span>
            <h1 className="text-2xl sm:text-3xl font-serif font-extrabold text-charcoal-900">
              Interests &amp; Mutual Matches
            </h1>
            <p className="text-xs sm:text-sm text-charcoal-600 mt-1">
              Review received interests, accept or decline connections with dignity, and converse with mutually matched Christian candidates.
            </p>
          </div>
          <Link
            href="/chat"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-burgundy-700 to-burgundy-800 hover:from-burgundy-600 hover:to-burgundy-700 text-white text-xs font-extrabold px-5 py-3 rounded-xl shadow-md self-start sm:self-auto transition-all"
          >
            <span>Open In-App Chat</span>
            <span>💬</span>
          </Link>
        </div>

        {/* Accepted Connection Celebration Banner */}
        {acceptedPartner && (
          <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 border border-emerald-400/40 rounded-3xl p-6 text-white shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4 animate-fadeIn">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-2xl flex items-center justify-center shrink-0">
                🎉
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-serif font-bold text-emerald-200">
                  Mutual Match Established!
                </h3>
                <p className="text-xs text-emerald-100/90 leading-relaxed">
                  You and <strong>{acceptedPartner.name}</strong> are now mutually connected. Both parties have verified credentials and can now talk freely via in-app chat.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Link
                href={`/chat?other_user_id=${acceptedPartner.userId}`}
                className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-extrabold px-5 py-2.5 rounded-xl shadow-md transition-all flex items-center gap-1.5"
              >
                <span>Start Chat with {acceptedPartner.name}</span>
                <span>💬</span>
              </Link>
              <button
                onClick={() => setAcceptedPartner(null)}
                className="text-emerald-200/70 hover:text-white text-xs px-3 py-2 rounded-lg"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex border-b border-[#ece2d1] bg-white rounded-t-2xl px-4 pt-2 shadow-xs">
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
            Mutual Matches (Chat Enabled 💬)
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
              {tab === 'received' && 'You have not received any new candidate interests yet. Keep your candidate profile up to date.'}
              {tab === 'sent' && 'You have not sent any matrimonial interests yet. Browse active profiles to discover compatible candidates.'}
              {tab === 'matches' && 'Mutual matches occur when both candidate profiles accept each other. Once accepted, chat unlocks automatically.'}
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
            {items.map((item) => {
              const otherUserId = item.other_user?.user_id || item.other_user?.id;
              const isResponding = respondingId === item.id;
              const isLocked = item.is_locked || item.requires_subscription;

              return (
                <div
                  key={item.id}
                  className="bg-white border border-[#ece2d1] rounded-2xl p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-gold-300 transition-all"
                >
                  <div className="flex items-center gap-4 min-w-0">
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

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-serif font-extrabold text-charcoal-900 truncate">
                          {item.other_user?.first_name} {item.other_user?.last_name}
                          {item.other_user?.age ? `, ${item.other_user.age} Yrs` : ''}
                        </h3>
                        {item.status === 'ACCEPTED' && (
                          <span className="bg-emerald-50 text-emerald-800 border border-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                            <span>✓</span> Mutual Match
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-charcoal-600 mt-0.5">
                        {item.other_user?.denomination || 'Christian'} • {item.other_user?.district || 'Karnataka'}
                        {item.other_user?.occupation_title ? ` • ${item.other_user.occupation_title}` : ''}
                      </p>
                      {item.message && (
                        <p className="text-xs text-charcoal-700 italic mt-1.5 bg-[#faf6ee] p-2.5 rounded-xl border border-[#ece2d1]">
                          &quot;{item.message}&quot;
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                    {/* Action buttons for Pending Received Interests */}
                    {tab === 'received' && item.status === 'PENDING' && (
                      <>
                        <button
                          onClick={() => handleRespond(item, true)}
                          disabled={isResponding}
                          className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-extrabold transition-all shadow-xs flex items-center gap-1.5 disabled:opacity-50"
                        >
                          {isResponding ? 'Processing...' : 'Accept ✓'}
                        </button>
                        <button
                          onClick={() => handleRespond(item, false)}
                          disabled={isResponding}
                          className="px-4 py-2 rounded-xl bg-[#faf6ee] text-charcoal-700 text-xs font-bold hover:bg-rose-50 hover:text-rose-700 hover:border-rose-300 transition-all border border-[#ded0ba] disabled:opacity-50"
                        >
                          Decline ✕
                        </button>
                      </>
                    )}

                    {/* Chat Action for Mutually Accepted Connections */}
                    {(tab === 'matches' || item.status === 'ACCEPTED') && otherUserId && (
                      <Link
                        href={`/chat?other_user_id=${otherUserId}`}
                        className="px-4 py-2 rounded-xl bg-gradient-to-r from-burgundy-700 to-burgundy-800 text-white text-xs font-extrabold hover:from-burgundy-600 hover:to-burgundy-700 transition-all shadow-sm flex items-center gap-1.5"
                      >
                        <span>Chat Now</span>
                        <span>💬</span>
                      </Link>
                    )}

                    {/* Status Pill */}
                    <span
                      className={`text-[11px] font-bold px-3 py-1 rounded-lg border ${
                        item.status === 'ACCEPTED'
                          ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
                          : item.status === 'DECLINED'
                          ? 'bg-slate-50 text-slate-600 border-slate-200'
                          : 'bg-gold-50 text-gold-900 border-gold-200'
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default function InterestsPage() {
  return (
    <Suspense
      fallback={
        <div className="bg-[#fdfbf7] min-h-screen py-16 text-center text-xs text-charcoal-500 animate-pulse">
          Loading Christian Matrimonial Connections...
        </div>
      }
    >
      <InterestsContent />
    </Suspense>
  );
}
