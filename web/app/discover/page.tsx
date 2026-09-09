'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { apiClient } from '../../lib/api-client';
import { CandidateCard } from '../../types';
import { getPhotoUrl, DEFAULT_AVATAR_SVG } from '../../lib/utils';

export default function DiscoverPage() {
  const router = useRouter();
  const [candidates, setCandidates] = useState<CandidateCard[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [planName, setPlanName] = useState<string | null>(null);

  // View Mode: 'horizontal' (detailed card) vs 'grid'
  const [viewMode, setViewMode] = useState<'horizontal' | 'grid'>('horizontal');

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [gender, setGender] = useState('');
  const [myGender, setMyGender] = useState<'MALE' | 'FEMALE' | null>(null);
  const [denomination, setDenomination] = useState('');
  const [district, setDistrict] = useState('');
  const [ageMin, setAgeMin] = useState('');
  const [ageMax, setAgeMax] = useState('');

  // Shortlisted IDs
  const [shortlisted, setShortlisted] = useState<number[]>([]);
  const [isAuthRequired, setIsAuthRequired] = useState(false);

  // Subscription Modal State
  const [subscriptionModalOpen, setSubscriptionModalOpen] = useState(false);
  const [modalActionType, setModalActionType] = useState<'interest' | 'view_profile'>('interest');
  const [selectedCandidate, setSelectedCandidate] = useState<CandidateCard | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const fetchProfiles = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiClient.searchProfiles({
        q: searchQuery || undefined,
        gender: gender || undefined,
        denominations: denomination ? [denomination] : undefined,
        district: district === 'ALL' || !district ? undefined : district,
        age_min: ageMin ? parseInt(ageMin) : undefined,
        age_max: ageMax ? parseInt(ageMax) : undefined,
      });
      setCandidates(data.profiles || []);
      setTotal(data.total || 0);
      setIsAuthRequired(false);
    } catch (err: any) {
      const msg = err.message || '';
      if (typeof window !== 'undefined' && !localStorage.getItem('access_token') && !localStorage.getItem('token')) {
        setIsAuthRequired(true);
      } else {
        setError(msg || 'Failed to load profiles');
      }
    } finally {
      setLoading(false);
    }
  };

  // Check user role, active subscription, and candidate gender
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const adminToken = urlParams.get('admin_token');
      if (adminToken) {
        localStorage.setItem('access_token', adminToken);
        localStorage.setItem('token', adminToken);
        localStorage.setItem('user_role', 'SUPER_ADMIN');
        setIsAdmin(true);
        setIsSubscribed(true);
        setIsAuthRequired(false);
        window.history.replaceState({}, document.title, window.location.pathname);
      } else {
        const token = localStorage.getItem('access_token') || localStorage.getItem('token');
        if (!token) {
          setIsAuthRequired(true);
          setLoading(false);
          return;
        }
        const role = localStorage.getItem('user_role');
        const adminFlag = role === 'ADMIN' || role === 'SUPER_ADMIN';
        setIsAdmin(adminFlag);
        if (adminFlag) {
          setIsSubscribed(true);
        } else {
          // Check user subscription status
          apiClient
            .getMySubscription()
            .then((sub) => {
              setIsSubscribed(!!sub.has_active_subscription);
              if (sub.plan_name) setPlanName(sub.plan_name);
            })
            .catch(() => setIsSubscribed(false));

          // Check user profile gender to automatically show opposite gender (Groom for Bride, Bride for Groom)
          apiClient
            .getRegistrationMe()
            .then((res) => {
              const g = res.profile?.gender || res.draft?.draft_data?.gender;
              if (g) {
                const uGen = String(g).toUpperCase() as 'MALE' | 'FEMALE';
                setMyGender(uGen);
                const targetOpposite = uGen === 'FEMALE' ? 'MALE' : 'FEMALE';
                setGender((prev) => (prev ? prev : targetOpposite));
              }
            })
            .catch(() => {});
        }
      }
    }
    fetchProfiles();
  }, [gender, denomination, district]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchProfiles();
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setGender(myGender === 'FEMALE' ? 'MALE' : myGender === 'MALE' ? 'FEMALE' : '');
    setDenomination('');
    setDistrict('');
    setAgeMin('');
    setAgeMax('');
    apiClient
      .searchProfiles({})
      .then((data) => {
        setCandidates(data.profiles || []);
        setTotal(data.total || 0);
      })
      .catch((err) => setError(err.message));
  };

  const handleSendInterest = async (userId: number) => {
    try {
      await apiClient.sendInterest(userId);
      setToastMessage('✓ Matrimonial interest sent successfully. You will be notified when they respond.');
      setTimeout(() => setToastMessage(null), 5000);
    } catch (err: any) {
      if (err.status === 402 || err.message?.toLowerCase().includes('subscription')) {
        const candidate = candidates.find((c) => c.user_id === userId) || null;
        setSelectedCandidate(candidate);
        setModalActionType('interest');
        setSubscriptionModalOpen(true);
      } else {
        setToastMessage(`Notice: ${err.message}`);
        setTimeout(() => setToastMessage(null), 5000);
      }
    }
  };

  const handleExpressInterestClick = (candidate: CandidateCard) => {
    if (!isSubscribed && !isAdmin) {
      setSelectedCandidate(candidate);
      setModalActionType('interest');
      setSubscriptionModalOpen(true);
      return;
    }
    handleSendInterest(candidate.user_id);
  };

  const handleViewProfileClick = (e: React.MouseEvent, candidate: CandidateCard) => {
    if (!isSubscribed && !isAdmin) {
      e.preventDefault();
      setSelectedCandidate(candidate);
      setModalActionType('view_profile');
      setSubscriptionModalOpen(true);
      return;
    }
    router.push(`/profile/${candidate.id}`);
  };

  const toggleShortlist = (id: number) => {
    if (shortlisted.includes(id)) {
      setShortlisted(shortlisted.filter((item) => item !== id));
    } else {
      setShortlisted([...shortlisted, id]);
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-80px)] py-10 bg-[#fdfbf7] text-[#1e1b18] font-sans overflow-hidden">
      {/* Subtle Warm Ambient Glows */}
      <div className="absolute top-10 right-1/4 w-96 h-96 bg-amber-100/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-1/4 w-96 h-96 bg-rose-100/30 rounded-full blur-3xl pointer-events-none" />

      {/* Floating Action Notification Toast */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 p-4 rounded-2xl bg-white border border-burgundy-300 text-burgundy-900 text-xs font-bold shadow-xl animate-fade-in flex items-center gap-3">
          <span>{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="text-slate-400 hover:text-slate-700">
            ✕
          </button>
        </div>
      )}

      {/* Interactive Subscription Modal */}
      {subscriptionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal-950/60 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-lg bg-white border border-[#ece2d1] rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 text-[#1e1b18]">
            {/* Close Button */}
            <button
              onClick={() => setSubscriptionModalOpen(false)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-charcoal-700 flex items-center justify-center text-sm font-bold transition-all"
            >
              ✕
            </button>

            {/* Modal Header */}
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-burgundy-200 text-burgundy-800 flex items-center justify-center mx-auto text-xl shadow-xs">
                🔒
              </div>
              <h3 className="text-xl sm:text-2xl font-serif font-extrabold text-charcoal-900">
                {modalActionType === 'interest'
                  ? 'Active Subscription Required'
                  : 'Full Candidate Profile Protected'}
              </h3>
              <p className="text-xs sm:text-sm text-charcoal-600 max-w-sm mx-auto leading-relaxed">
                {modalActionType === 'interest'
                  ? 'To express matrimonial interest and connect directly with verified candidates, an active membership plan is required.'
                  : 'Detailed family background, parish endorsements, and direct phone reveals are reserved for active Christian Matrimony members.'}
              </p>
            </div>

            {/* Candidate Summary Card Preview inside Modal */}
            {selectedCandidate && (
              <div className="p-3.5 rounded-2xl bg-[#faf6ee] border border-[#ece2d1] flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-xl overflow-hidden bg-white border border-[#ece2d1] shrink-0">
                  <img
                    src={getPhotoUrl(selectedCandidate.primary_photo) || DEFAULT_AVATAR_SVG}
                    alt={selectedCandidate.first_name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = DEFAULT_AVATAR_SVG;
                    }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-charcoal-900 truncate">
                    {selectedCandidate.first_name} {selectedCandidate.last_name}
                  </h4>
                  <p className="text-[11px] text-burgundy-700 font-semibold truncate">
                    {selectedCandidate.denomination || 'Christian'} • {!isSubscribed && !isAdmin ? '🔒 Location Locked' : `${selectedCandidate.district || 'Bidar'}, ${selectedCandidate.state || 'Karnataka'}`}
                  </p>
                  <p className="text-[10px] text-charcoal-600 truncate">
                    🎓 {selectedCandidate.highest_education || '—'} • {!isSubscribed && !isAdmin ? '🔒 Profession & Package Locked' : (selectedCandidate.occupation_title || '—')}
                  </p>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 shrink-0">
                  Verified
                </span>
              </div>
            )}

            {/* Value Highlights */}
            <div className="p-4 rounded-2xl bg-[#faf6ee] border border-[#ece2d1] space-y-2 text-xs">
              <p className="font-extrabold text-burgundy-800 uppercase text-[10px] tracking-wider">
                Membership Plan Benefits:
              </p>
              <ul className="space-y-1.5 text-charcoal-700 text-[11px]">
                <li className="flex items-center gap-2">
                  <span className="text-emerald-700 font-bold">✓</span>
                  <span>Express unlimited matrimonial interests to Christian brides &amp; grooms.</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-emerald-700 font-bold">✓</span>
                  <span>Request verified direct phone number and WhatsApp reveals.</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-emerald-700 font-bold">✓</span>
                  <span>Unlock complete pastoral recommendations &amp; spiritual testimonies.</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-emerald-700 font-bold">✓</span>
                  <span>Direct candidate messaging once interest is mutually accepted.</span>
                </li>
              </ul>
            </div>

            {/* Modal Actions */}
            <div className="space-y-2.5 pt-1">
              <Link
                href="/subscriptions"
                onClick={() => setSubscriptionModalOpen(false)}
                className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-burgundy-700 to-burgundy-800 hover:from-burgundy-600 hover:to-burgundy-700 text-white font-extrabold text-xs text-center shadow-md transition-all flex items-center justify-center gap-2"
              >
                <span>View Subscription Plans &amp; Activate</span>
                <span>→</span>
              </Link>

              {modalActionType === 'view_profile' && selectedCandidate && (
                <button
                  type="button"
                  onClick={() => {
                    setSubscriptionModalOpen(false);
                    router.push(`/profile/${selectedCandidate.id}`);
                  }}
                  className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-[#faf6ee] text-charcoal-700 text-xs font-semibold text-center border border-[#ece2d1] transition-all"
                >
                  Continue Browsing Limited Summary
                </button>
              )}

              <button
                type="button"
                onClick={() => setSubscriptionModalOpen(false)}
                className="w-full py-2 text-center text-xs text-slate-400 hover:text-white transition-colors"
              >
                Maybe Later
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-6">
        {/* Top Header Card */}
        <div className="bg-white border border-[#ece2d1] rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 border border-burgundy-200 text-burgundy-800 text-[11px] font-bold uppercase tracking-wider mb-2">
              {myGender === 'FEMALE'
                ? 'Groom Matches for Christian Brides'
                : myGender === 'MALE'
                ? 'Bride Matches for Christian Grooms'
                : 'Verified Matrimonial Search'}
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-brand">
              {myGender === 'FEMALE' ? (
                <>
                  Recommended <span className="text-transparent bg-clip-text bg-gradient-to-r from-burgundy-800 to-rose-700">Christian Grooms</span>
                </>
              ) : myGender === 'MALE' ? (
                <>
                  Recommended <span className="text-transparent bg-clip-text bg-gradient-to-r from-burgundy-800 to-rose-700">Christian Brides</span>
                </>
              ) : (
                <>
                  Discover <span className="text-transparent bg-clip-text bg-gradient-to-r from-burgundy-800 to-rose-700">Verified Christian Candidates</span>
                </>
              )}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              {myGender === 'FEMALE'
                ? 'Showing verified Christian grooms matching your spiritual fellowship, parish, and family alignment.'
                : myGender === 'MALE'
                ? 'Showing verified Christian brides matching your spiritual fellowship, parish, and family alignment.'
                : 'High-density candidate profiles across Methodist, CSI, Catholic, Baptist, Pentecostal & Protestant fellowships.'}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/interests"
              className="bg-white hover:bg-rose-50 text-burgundy-900 text-xs font-bold px-5 py-3 rounded-xl border border-[#ded0ba] transition-all shadow-xs"
            >
              My Interests &amp; Matches
            </Link>
            <Link
              href="/chat"
              className="bg-gradient-to-r from-burgundy-700 to-burgundy-800 hover:from-burgundy-600 hover:to-burgundy-700 text-white text-xs font-bold px-5 py-3 rounded-xl shadow-md shadow-burgundy-950/20 border border-burgundy-600 transition-all transform hover:-translate-y-0.5"
            >
              Messages
            </Link>
          </div>
        </div>

        {/* Super Admin Access Banner */}
        {isAdmin && (
          <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-50 to-rose-50 border-2 border-amber-300 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="px-2.5 py-1 rounded-xl bg-amber-400 text-[#430917] font-black text-xs shadow-xs">
                Admin
              </div>
              <div>
                <h4 className="text-xs font-extrabold text-slate-900">
                  Super Admin / Moderator Access Active
                </h4>
                <p className="text-[11px] text-amber-800 font-medium">
                  Viewing all profiles (Grooms &amp; Brides, Submitted &amp; Approved) • Subscription check bypassed • Confidential contacts unmasked.
                </p>
              </div>
            </div>
            <a
              href={`${(process.env.NEXT_PUBLIC_ADMIN_URL || 'http://localhost:3001').replace(/\/+$/, '')}/profiles`}
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-burgundy-700 to-burgundy-800 hover:from-burgundy-600 hover:to-burgundy-700 text-white font-extrabold text-xs text-center shadow-xs transition-all shrink-0 flex items-center gap-1.5"
            >
              <span>Open Admin Review Console</span>
              <span>→</span>
            </a>
          </div>
        )}

        {/* Free Member Informational Notice Banner (Shown when not subscribed and not admin) */}
        {!isSubscribed && !isAdmin && (
          <div className="p-5 rounded-2xl bg-gradient-to-r from-rose-50 via-amber-50/50 to-rose-50 border border-burgundy-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start sm:items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-rose-100 border border-burgundy-200 text-burgundy-800 font-bold flex items-center justify-center shrink-0 text-base shadow-xs">
                🔒
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-extrabold text-slate-900">Free Member Preview Mode</h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-rose-100 text-burgundy-800 border border-burgundy-200">
                    Active Plan Needed
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                  You are viewing candidate summaries. An active subscription plan is required to express matrimonial interest and unlock full verified profiles (pastoral testimony, family background, and verified contact reveals).
                </p>
              </div>
            </div>
            <Link
              href="/subscriptions"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-burgundy-700 to-burgundy-800 hover:from-burgundy-600 hover:to-burgundy-700 text-white font-extrabold text-xs text-center shadow-md shadow-burgundy-950/20 transition-all shrink-0 flex items-center justify-center gap-1.5"
            >
              <span>Explore Subscription Plans</span>
              <span>→</span>
            </Link>
          </div>
        )}

        {/* Subscribed Active Member Status Bar */}
        {isSubscribed && !isAdmin && (
          <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs flex items-center justify-between gap-3 text-emerald-900 shadow-xs">
            <div className="flex items-center gap-2 font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Active Membership Active ({planName || 'Subscribed Member'})</span>
              <span className="text-slate-600 font-normal">• Express Interest &amp; Full Profiles Unlocked</span>
            </div>
            <Link href="/subscriptions" className="text-[11px] underline hover:text-burgundy-800 font-semibold">
              Manage Plan
            </Link>
          </div>
        )}

        {/* Free Text Search Bar */}
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search candidate name, church, occupation, education, or district..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs font-medium rounded-2xl border border-[#ece2d1] p-4 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:border-burgundy-600 shadow-xs"
            />
          </div>
          <button
            type="submit"
            className="px-8 py-4 rounded-2xl bg-gradient-to-r from-burgundy-700 to-burgundy-800 hover:from-burgundy-600 hover:to-burgundy-700 text-white font-extrabold text-xs shadow-md shadow-burgundy-950/20 transition-all"
          >
            Search Candidates
          </button>
        </form>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Filter Sidebar */}
          <div className="lg:col-span-1 bg-white border border-[#ece2d1] rounded-3xl p-6 shadow-sm h-fit space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#ece2d1]">
              <h2 className="font-extrabold text-slate-900 text-sm uppercase tracking-wider font-brand">
                Filter Search
              </h2>
              <button
                type="button"
                onClick={handleResetFilters}
                className="text-xs text-burgundy-700 font-bold hover:underline"
              >
                Reset All
              </button>
            </div>

            <div className="space-y-4">
              {/* Looking for */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Looking For
                </label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full text-xs font-medium rounded-xl border border-[#ded0ba] p-3 bg-white text-slate-900 focus:outline-none focus:border-burgundy-600 shadow-xs"
                >
                  {myGender === 'FEMALE' ? (
                    <>
                      <option value="MALE">Grooms / Male (Recommended for you)</option>
                      <option value="ALL">All Profiles (Bride &amp; Groom)</option>
                      <option value="FEMALE">Brides / Female</option>
                    </>
                  ) : myGender === 'MALE' ? (
                    <>
                      <option value="FEMALE">Brides / Female (Recommended for you)</option>
                      <option value="ALL">All Profiles (Bride &amp; Groom)</option>
                      <option value="MALE">Grooms / Male</option>
                    </>
                  ) : (
                    <>
                      <option value="ALL">All Profiles (Bride &amp; Groom)</option>
                      <option value="FEMALE">Female (Bride)</option>
                      <option value="MALE">Male (Groom)</option>
                    </>
                  )}
                </select>
              </div>

              {/* Denomination */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Denomination
                </label>
                <select
                  value={denomination}
                  onChange={(e) => setDenomination(e.target.value)}
                  className="w-full text-xs font-medium rounded-xl border border-[#ded0ba] p-3 bg-white text-slate-900 focus:outline-none focus:border-burgundy-600 shadow-xs"
                >
                  <option value="">All Denominations</option>
                  <option value="METHODIST">Methodist (MCI)</option>
                  <option value="CSI">Church of South India (CSI)</option>
                  <option value="CATHOLIC">Roman Catholic (RC)</option>
                  <option value="BAPTIST">Baptist</option>
                  <option value="PENTECOSTAL">Pentecostal</option>
                  <option value="PROTESTANT">Protestant</option>
                  <option value="MAR_THOMA">Mar Thoma / Orthodox</option>
                </select>
              </div>

              {/* Location / District */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Location / District
                </label>
                <select
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full text-xs font-medium rounded-xl border border-[#ded0ba] p-3 bg-white text-slate-900 focus:outline-none focus:border-burgundy-600 shadow-xs"
                >
                  <option value="">All Locations (Pan-India)</option>
                  <option value="Bidar">Bidar (Karnataka)</option>
                  <option value="Bengaluru">Bengaluru</option>
                  <option value="Kalaburagi">Kalaburagi / Gulbarga</option>
                  <option value="Hyderabad">Hyderabad</option>
                </select>
              </div>

              {/* Age Range */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Age Range
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    placeholder="Min (18)"
                    value={ageMin}
                    onChange={(e) => setAgeMin(e.target.value)}
                    className="w-1/2 text-xs font-medium rounded-xl border border-[#ded0ba] p-2.5 bg-white text-slate-900 focus:outline-none focus:border-burgundy-600 shadow-xs"
                  />
                  <span className="text-slate-400 text-xs">-</span>
                  <input
                    type="number"
                    placeholder="Max (60)"
                    value={ageMax}
                    onChange={(e) => setAgeMax(e.target.value)}
                    className="w-1/2 text-xs font-medium rounded-xl border border-[#ded0ba] p-2.5 bg-white text-slate-900 focus:outline-none focus:border-burgundy-600 shadow-xs"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={fetchProfiles}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-burgundy-700 to-burgundy-800 hover:from-burgundy-600 hover:to-burgundy-700 text-white text-xs font-extrabold shadow-sm transition-all"
              >
                Apply Filters
              </button>
            </div>
          </div>

          {/* Right Candidate Stream */}
          <div className="lg:col-span-3 space-y-5">
            {/* Header Controls: Count + Horizontal/Grid Toggle + Gender Tabs */}
            <div className="flex flex-col md:flex-row md:items-center justify-between bg-white border border-[#ece2d1] px-5 py-3.5 rounded-2xl gap-3 shadow-xs">
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Showing <strong className="text-burgundy-800 font-extrabold">{candidates.length}</strong> of {total} Matches
                </span>
                {/* Quick Gender Toggle Tabs */}
                <div className="flex items-center gap-1 bg-[#faf6ee] p-1 rounded-xl border border-[#ece2d1] text-[11px]">
                  {myGender && (
                    <button
                      type="button"
                      onClick={() => setGender(myGender === 'FEMALE' ? 'MALE' : 'FEMALE')}
                      className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                        (myGender === 'FEMALE' && gender === 'MALE') || (myGender === 'MALE' && gender === 'FEMALE')
                          ? 'bg-burgundy-700 text-white shadow-xs'
                          : 'text-slate-600 hover:text-burgundy-800'
                      }`}
                    >
                      ✨ Recommended ({myGender === 'FEMALE' ? 'Grooms' : 'Brides'})
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setGender('FEMALE')}
                    className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                      gender === 'FEMALE' && (!myGender || myGender !== 'MALE')
                        ? 'bg-burgundy-700 text-white shadow-xs'
                        : gender === 'FEMALE' && myGender === 'MALE'
                        ? 'bg-burgundy-700 text-white shadow-xs'
                        : 'text-slate-600 hover:text-burgundy-800'
                    }`}
                  >
                    Brides
                  </button>
                  <button
                    type="button"
                    onClick={() => setGender('MALE')}
                    className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                      gender === 'MALE' && (!myGender || myGender !== 'FEMALE')
                        ? 'bg-burgundy-700 text-white shadow-xs'
                        : gender === 'MALE' && myGender === 'FEMALE'
                        ? 'bg-burgundy-700 text-white shadow-xs'
                        : 'text-slate-600 hover:text-burgundy-800'
                    }`}
                  >
                    Grooms
                  </button>
                  <button
                    type="button"
                    onClick={() => setGender('ALL')}
                    className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                      gender === 'ALL' || (!myGender && !gender)
                        ? 'bg-white text-slate-900 shadow-xs border border-[#ded0ba]'
                        : 'text-slate-600 hover:text-burgundy-800'
                    }`}
                  >
                    All
                  </button>
                </div>
              </div>

              {/* View Layout Switcher */}
              <div className="flex items-center gap-2 bg-[#faf6ee] p-1 rounded-xl border border-[#ece2d1] shrink-0">
                <button
                  onClick={() => setViewMode('horizontal')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    viewMode === 'horizontal'
                      ? 'bg-burgundy-700 text-white shadow-sm'
                      : 'text-charcoal-600 hover:text-burgundy-800'
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                  <span>Detailed View</span>
                </button>

                <button
                  onClick={() => setViewMode('grid')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    viewMode === 'grid'
                      ? 'bg-burgundy-700 text-white shadow-sm'
                      : 'text-charcoal-600 hover:text-burgundy-800'
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                  <span>Grid</span>
                </button>
              </div>
            </div>

            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-56 bg-white border border-[#ece2d1] rounded-3xl animate-pulse" />
                ))}
              </div>
            ) : isAuthRequired ? (
              <div className="p-10 sm:p-14 rounded-3xl bg-white border border-[#ece2d1] text-center space-y-6 shadow-sm">
                <div className="w-12 h-12 rounded-full bg-rose-50 border border-burgundy-200 text-burgundy-800 flex items-center justify-center mx-auto text-xs font-mono font-bold shadow-xs">
                  Auth
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl sm:text-2xl font-serif font-extrabold text-charcoal-900">
                    Member Sign-In Required
                  </h3>
                  <p className="text-xs sm:text-sm text-charcoal-600 max-w-md mx-auto leading-relaxed">
                    To safeguard candidate privacy and family dignity, full candidate discovery is exclusively accessible to verified Christian members.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                  <Link
                    href="/login?redirect=/discover"
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-burgundy-700 to-burgundy-800 hover:from-burgundy-600 hover:to-burgundy-700 text-white font-extrabold text-xs shadow-md transition-all"
                  >
                    Sign In to View Matches →
                  </Link>
                  <Link
                    href="/register"
                    className="px-6 py-3 rounded-xl bg-white hover:bg-[#faf6ee] text-charcoal-800 font-bold text-xs border border-[#ece2d1] transition-all"
                  >
                    Register Free Account
                  </Link>
                </div>
              </div>
            ) : error ? (
              <div className="p-8 rounded-3xl bg-rose-50 border border-rose-200 text-center text-xs text-rose-800">
                {error}
              </div>
            ) : candidates.length === 0 ? (
              <div className="p-12 rounded-3xl bg-white border border-[#ece2d1] text-center space-y-3 shadow-xs">
                <div className="w-12 h-12 rounded-2xl bg-gold-50 border border-gold-200 text-gold-800 font-bold flex items-center justify-center mx-auto text-xs font-mono">
                  Search
                </div>
                <h3 className="text-base font-serif font-bold text-charcoal-900">No Profiles Found</h3>
                <p className="text-xs text-charcoal-600 max-w-sm mx-auto">
                  Try adjusting your filters or resetting location to &quot;All Locations&quot; to view all verified candidates.
                </p>
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-burgundy-700 to-burgundy-800 hover:from-burgundy-600 hover:to-burgundy-700 text-white text-xs font-bold shadow-sm transition-all"
                >
                  Reset Filters &amp; Show All
                </button>
              </div>
            ) : viewMode === 'horizontal' ? (
              /* DETAILED HORIZONTAL CARD LAYOUT */
              <div className="space-y-5">
                {candidates.map((c) => {
                  const isSaved = shortlisted.includes(c.id);
                  const photoSrc = getPhotoUrl(c.primary_photo) || DEFAULT_AVATAR_SVG;
                  return (
                    <div
                      key={c.id}
                      className="bg-white border border-[#ece2d1] hover:border-burgundy-300 rounded-3xl p-5 md:p-6 shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col md:flex-row items-stretch gap-6"
                    >
                      {/* Left: Photo & Badges Container */}
                      <div className="w-full md:w-56 h-64 md:h-auto rounded-2xl relative overflow-hidden shrink-0 bg-[#faf6ee] border border-[#ece2d1]">
                        <img
                          src={photoSrc}
                          alt={c.first_name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          onError={(e) => {
                            e.currentTarget.src = DEFAULT_AVATAR_SVG;
                          }}
                        />

                        {/* Top Overlay Badges */}
                        <div className="absolute top-3 left-3 bg-emerald-50/95 backdrop-blur-md text-emerald-800 text-[10px] font-extrabold px-2.5 py-1 rounded-lg border border-emerald-200 shadow-sm">
                          Verified
                        </div>

                        <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-md text-charcoal-700 text-[10px] font-bold px-2.5 py-1 rounded-lg border border-[#ece2d1] shadow-sm">
                          CM-{c.id}
                        </div>

                        <div className="absolute bottom-3 left-3 right-3 bg-white/95 backdrop-blur-md text-charcoal-600 text-[10px] font-semibold px-2 py-1 rounded-lg border border-[#ece2d1] text-center shadow-sm">
                          Christian Matrimony Profile
                        </div>
                      </div>

                      {/* Right Main Container (Full Width Stack) */}
                      <div className="flex-1 flex flex-col justify-between space-y-4">
                        {/* 1. Candidate Header */}
                        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#ece2d1]">
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-serif font-extrabold text-xl text-charcoal-900 group-hover:text-burgundy-700 transition-colors">
                                {c.first_name} {c.last_name}
                              </h3>
                              {c.status && (
                                <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md uppercase border ${
                                  c.status === 'APPROVED' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-burgundy-50 text-burgundy-800 border-burgundy-200'
                                }`}>
                                  {c.status}
                                </span>
                              )}
                              {!isSubscribed && !isAdmin && (
                                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-gold-50 text-gold-800 border border-gold-200 flex items-center gap-1">
                                  <span>🔒</span>
                                  <span>Preview</span>
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-charcoal-600 font-semibold mt-0.5">
                              {c.age ? `${c.age} Yrs` : '—'}, {c.height_cm ? `${Math.floor(c.height_cm / 30.48)}'${Math.round((c.height_cm % 30.48) / 2.54)}"` : 'Height N/A'} • {c.marital_status ? c.marital_status.replace('_', ' ') : 'Never Married'}
                            </p>

                            {/* Admin Unmasked Contact Strip */}
                            {isAdmin && (c.mobile_number || c.email) && (
                              <div className="mt-2 py-1 px-2.5 rounded-lg bg-burgundy-50 border border-burgundy-200 flex flex-wrap items-center gap-3 text-xs">
                                {c.mobile_number && (
                                  <a href={`tel:${c.mobile_number}`} className="text-burgundy-900 font-mono font-bold hover:text-burgundy-700 transition-colors">
                                    Phone: +91 {c.mobile_number}
                                  </a>
                                )}
                                {c.email && (
                                  <a href={`mailto:${c.email}`} className="text-charcoal-700 font-medium hover:text-burgundy-700 transition-colors">
                                    Email: {c.email}
                                  </a>
                                )}
                              </div>
                            )}
                          </div>

                          {/* Shortlist Heart Button */}
                          <button
                            onClick={() => toggleShortlist(c.id)}
                            className={`p-2.5 rounded-xl border transition-all flex items-center gap-1.5 text-xs font-bold ${
                              isSaved
                                ? 'bg-rose-50 border-rose-300 text-rose-600'
                                : 'bg-white border-[#ece2d1] text-charcoal-500 hover:text-rose-600 hover:border-rose-200'
                            }`}
                            title={isSaved ? 'Shortlisted' : 'Save to Shortlist'}
                          >
                            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                            </svg>
                            <span>{isSaved ? 'Shortlisted' : 'Save'}</span>
                          </button>
                        </div>

                        {/* 2. Key Attributes Grid (2-Column Format) */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2.5 text-xs">
                          <div className="flex items-center gap-2">
                            <span className="text-charcoal-500 font-semibold w-24 shrink-0">Denomination:</span>
                            <span className="text-charcoal-900 font-medium truncate">{c.denomination || 'Christian'}</span>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="text-charcoal-500 font-semibold w-24 shrink-0">Church:</span>
                            {!isSubscribed && !isAdmin ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-gold-50 border border-gold-200 text-gold-800 font-semibold text-[11px]">
                                <span>🔒</span>
                                <span>Church Info Locked</span>
                              </span>
                            ) : (
                              <span className="text-charcoal-900 font-medium truncate">{c.church_name || '—'}</span>
                            )}
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="text-charcoal-500 font-semibold w-24 shrink-0">Education:</span>
                            <span className="text-charcoal-900 font-medium truncate">{c.highest_education || '—'}</span>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="text-charcoal-500 font-semibold w-24 shrink-0">Profession:</span>
                            {!isSubscribed && !isAdmin ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-gold-50 border border-gold-200 text-gold-800 font-semibold text-[11px]">
                                <span>🔒</span>
                                <span>Profession Locked</span>
                              </span>
                            ) : (
                              <span className="text-charcoal-900 font-medium truncate">{c.occupation_title || '—'}</span>
                            )}
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="text-charcoal-500 font-semibold w-24 shrink-0">Location:</span>
                            {!isSubscribed && !isAdmin ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-gold-50 border border-gold-200 text-gold-800 font-semibold text-[11px]">
                                <span>🔒</span>
                                <span>Location Locked</span>
                              </span>
                            ) : (
                              <span className="text-charcoal-800 font-medium truncate">📍 {c.district || 'Bidar'}, {c.state || 'Karnataka'}</span>
                            )}
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="text-charcoal-500 font-semibold w-24 shrink-0">Annual Income:</span>
                            {!isSubscribed && !isAdmin ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-gold-50 border border-gold-200 text-gold-800 font-semibold text-[11px]">
                                <span>🔒</span>
                                <span>Package Info Locked</span>
                              </span>
                            ) : (
                              <span className="text-emerald-700 font-medium truncate">
                                {c.annual_income_min ? (c.annual_income_min >= 100000 ? `₹${(c.annual_income_min / 100000).toFixed(1)} LPA+` : `₹${c.annual_income_min.toLocaleString('en-IN')}`) : 'Confidential'}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* 3. Faith & Pastoral Verification Footer Banner */}
                        <div className="p-3 rounded-xl bg-[#faf6ee] border border-[#ece2d1] text-[11px] text-charcoal-700 flex flex-wrap items-center gap-3">
                          <span className="text-emerald-700 font-extrabold flex items-center gap-1">
                            Pastoral Verified
                          </span>
                          <span className="text-charcoal-300">•</span>
                          <span className="font-semibold text-charcoal-700">Church Membership Active</span>
                          <span className="text-charcoal-300">•</span>
                          <span className="font-semibold text-charcoal-700">Controlled Contact Reveal</span>
                        </div>

                        {/* 4. Action Buttons Bar DIRECTLY BELOW Pastoral Banner */}
                        <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                          <button
                            type="button"
                            onClick={() => handleExpressInterestClick(c)}
                            className="w-full sm:flex-1 py-3 px-6 rounded-xl bg-gradient-to-r from-burgundy-700 to-burgundy-800 hover:from-burgundy-600 hover:to-burgundy-700 text-white font-extrabold text-xs text-center transition-all shadow-md shadow-burgundy-900/10 flex items-center justify-center gap-2"
                          >
                            <span>Express Interest</span>
                            <span>→</span>
                          </button>

                          <button
                            type="button"
                            onClick={(e) => handleViewProfileClick(e, c)}
                            className="w-full sm:flex-1 py-3 px-6 rounded-xl bg-white hover:bg-[#faf6ee] text-charcoal-800 text-xs font-bold text-center border border-[#ece2d1] transition-all flex items-center justify-center gap-1.5"
                          >
                            <span>View Full Profile</span>
                            {!isSubscribed && !isAdmin && <span className="text-[10px] text-gold-700">🔒</span>}
                            <span>→</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              /* GRID VIEW FALLBACK */
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {candidates.map((c) => {
                  const photoSrc = getPhotoUrl(c.primary_photo) || DEFAULT_AVATAR_SVG;
                  return (
                    <div
                      key={c.id}
                      className="bg-white border border-[#ece2d1] hover:border-burgundy-300 rounded-3xl p-6 shadow-sm hover:shadow-xl group transition-all duration-300 flex flex-col justify-between"
                    >
                      <div>
                        {/* Top Badges Row */}
                        <div className="flex items-center justify-between gap-2 pb-1">
                          <span className="bg-burgundy-50 text-burgundy-800 border border-burgundy-200 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider truncate max-w-[130px]">
                            {c.denomination || 'Christian'}
                          </span>

                          <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 shrink-0">
                            <span>✓</span>
                            <span>Verified</span>
                          </span>
                        </div>

                        {/* Circular Photo Header */}
                        <div className="my-5 flex justify-center">
                          <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full ring-4 ring-gold-400/30 group-hover:ring-gold-500/60 shadow-md overflow-hidden bg-[#faf6ee] transition-all duration-300 relative flex items-center justify-center shrink-0">
                            <img
                              src={photoSrc}
                              alt={c.first_name}
                              className="w-full h-full object-cover object-top group-hover:scale-110 transition-transform duration-500"
                              onError={(e) => {
                                e.currentTarget.src = DEFAULT_AVATAR_SVG;
                              }}
                            />
                          </div>
                        </div>

                        {/* Content Info */}
                        <div className="space-y-2 pt-2 border-t border-[#ece2d1]">
                          <div className="flex items-center justify-between">
                            <h3 className="font-serif font-extrabold text-base text-charcoal-900 group-hover:text-burgundy-700 transition-colors">
                              {c.first_name} {c.last_name}
                            </h3>
                            <span className="text-xs text-charcoal-500 font-medium">
                              {c.age || '—'} Yrs
                            </span>
                          </div>

                          {/* Education: Always shown */}
                          <p className="text-xs text-charcoal-600 font-medium truncate">
                            🎓 {c.highest_education || '—'}
                          </p>

                          {/* Profession & Package: Locked for unpaid */}
                          <p className="text-xs font-medium truncate">
                            {!isSubscribed && !isAdmin ? (
                              <span className="inline-flex items-center gap-1 text-gold-800 text-[11px] font-semibold bg-gold-50 px-2 py-0.5 rounded-md border border-gold-200">
                                <span>🔒</span>
                                <span>Profession &amp; Package Locked</span>
                              </span>
                            ) : (
                              <span className="text-charcoal-700">
                                💼 {c.occupation_title || '—'} {c.annual_income_min ? `(₹${(c.annual_income_min / 100000).toFixed(1)} LPA+)` : ''}
                              </span>
                            )}
                          </p>

                          {/* Location: Locked for unpaid */}
                          <p className="text-[11px] font-semibold truncate">
                            {!isSubscribed && !isAdmin ? (
                              <span className="inline-flex items-center gap-1 text-gold-800 text-[11px] font-semibold bg-gold-50 px-2 py-0.5 rounded-md border border-gold-200">
                                <span>🔒</span>
                                <span>Location Locked</span>
                              </span>
                            ) : (
                              <span className="text-charcoal-800">📍 {c.district || 'Bidar'}, {c.state || 'Karnataka'}</span>
                            )}
                          </p>

                          {/* Admin Unmasked Contact Strip */}
                          {isAdmin && (c.mobile_number || c.email) && (
                            <div className="pt-2 border-t border-[#ece2d1] text-[11px] text-burgundy-900 font-mono space-y-0.5">
                              {c.mobile_number && <div>Phone: +91 {c.mobile_number}</div>}
                              {c.email && <div className="truncate text-charcoal-700">Email: {c.email}</div>}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* CTAs */}
                      <div className="mt-5 pt-1 grid grid-cols-2 gap-2.5">
                        <button
                          type="button"
                          onClick={(e) => handleViewProfileClick(e, c)}
                          className="w-full py-2.5 rounded-xl bg-white hover:bg-[#faf6ee] text-charcoal-800 text-xs font-bold text-center border border-[#ece2d1] transition-all flex items-center justify-center gap-1"
                        >
                          <span>View Bio</span>
                          {!isSubscribed && !isAdmin && <span className="text-[10px] text-gold-700">🔒</span>}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleExpressInterestClick(c)}
                          className="w-full py-2.5 rounded-xl bg-gradient-to-r from-burgundy-700 to-burgundy-800 hover:from-burgundy-600 hover:to-burgundy-700 text-white text-xs font-extrabold text-center transition-all shadow-sm"
                        >
                          Express Interest
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
