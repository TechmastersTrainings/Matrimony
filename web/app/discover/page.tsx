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
    <div className="relative min-h-[calc(100vh-80px)] py-10 bg-slate-950 text-white font-sans overflow-hidden">
      {/* Ambient Background Glows */}
      <div className="absolute top-10 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Floating Action Notification Toast */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 p-4 rounded-2xl bg-slate-900/95 border border-amber-500/40 text-amber-300 text-xs font-bold shadow-2xl backdrop-blur-xl animate-fade-in flex items-center gap-3">
          <span>{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="text-slate-400 hover:text-white">
            ✕
          </button>
        </div>
      )}

      {/* Interactive Subscription Modal */}
      {subscriptionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-lg bg-slate-900 border border-amber-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-blue-950/50 space-y-6">
            {/* Close Button */}
            <button
              onClick={() => setSubscriptionModalOpen(false)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center text-sm font-bold transition-all"
            >
              ✕
            </button>

            {/* Modal Header */}
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500/20 to-blue-600/20 border border-amber-500/40 text-amber-400 flex items-center justify-center mx-auto text-xl shadow-lg">
                🔒
              </div>
              <h3 className="text-xl sm:text-2xl font-extrabold text-white">
                {modalActionType === 'interest'
                  ? 'Active Subscription Required'
                  : 'Full Candidate Profile Protected'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 max-w-sm mx-auto leading-relaxed">
                {modalActionType === 'interest'
                  ? 'To express matrimonial interest and connect directly with verified candidates, an active membership plan is required.'
                  : 'Detailed family background, parish endorsements, and direct phone reveals are reserved for active Christian Matrimony members.'}
              </p>
            </div>

            {/* Candidate Summary Card Preview inside Modal */}
            {selectedCandidate && (
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-900 border border-slate-800 shrink-0">
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
                  <h4 className="text-xs font-bold text-white truncate">
                    {selectedCandidate.first_name} {selectedCandidate.last_name}
                  </h4>
                  <p className="text-[11px] text-amber-400 font-semibold truncate">
                    {selectedCandidate.denomination || 'Christian'} • {!isSubscribed && !isAdmin ? '🔒 Location Locked' : `${selectedCandidate.district || 'Bidar'}, ${selectedCandidate.state || 'Karnataka'}`}
                  </p>
                  <p className="text-[10px] text-slate-400 truncate">
                    🎓 {selectedCandidate.highest_education || 'Graduate'} • {!isSubscribed && !isAdmin ? '🔒 Profession & Package Locked' : (selectedCandidate.occupation_title || 'Professional')}
                  </p>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-950 text-emerald-300 border border-emerald-800 shrink-0">
                  Verified
                </span>
              </div>
            )}

            {/* Value Highlights */}
            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-2 text-xs">
              <p className="font-extrabold text-amber-400 uppercase text-[10px] tracking-wider">
                Membership Plan Benefits:
              </p>
              <ul className="space-y-1.5 text-slate-300 text-[11px]">
                <li className="flex items-center gap-2">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span>Express unlimited matrimonial interests to Christian brides &amp; grooms.</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span>Request verified direct phone number and WhatsApp reveals.</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span>Unlock complete pastoral recommendations &amp; spiritual testimonies.</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span>Direct candidate messaging once interest is mutually accepted.</span>
                </li>
              </ul>
            </div>

            {/* Modal Actions */}
            <div className="space-y-2.5 pt-1">
              <Link
                href="/subscriptions"
                onClick={() => setSubscriptionModalOpen(false)}
                className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold text-xs text-center shadow-xl shadow-amber-950/40 transition-all flex items-center justify-center gap-2"
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
                  className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-all text-center border border-slate-700"
                >
                  Continue with Summary Preview Only →
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
        <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-900/40 border border-blue-700/50 text-blue-300 text-[11px] font-bold uppercase tracking-wider mb-2">
              {myGender === 'FEMALE'
                ? 'Groom Matches for Christian Brides'
                : myGender === 'MALE'
                ? 'Bride Matches for Christian Grooms'
                : 'Verified Matrimonial Search'}
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {myGender === 'FEMALE' ? (
                <>
                  Recommended <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-500">Christian Grooms</span>
                </>
              ) : myGender === 'MALE' ? (
                <>
                  Recommended <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-500">Christian Brides</span>
                </>
              ) : (
                <>
                  Discover <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-500">Verified Christian Candidates</span>
                </>
              )}
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
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
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold px-5 py-3 rounded-xl border border-slate-700 transition-all"
            >
              My Interests &amp; Matches
            </Link>
            <Link
              href="/chat"
              className="bg-gradient-to-r from-blue-700 to-blue-900 hover:from-blue-600 hover:to-blue-800 text-white text-xs font-bold px-5 py-3 rounded-xl shadow-lg shadow-blue-950 border border-blue-600/50 transition-all transform hover:-translate-y-0.5"
            >
              Messages
            </Link>
          </div>
        </div>

        {/* Super Admin Access Banner */}
        {isAdmin && (
          <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/15 to-blue-600/15 border-2 border-amber-500/40 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="px-2.5 py-1 rounded-xl bg-amber-500 text-slate-950 font-black text-xs shadow-md">
                Admin
              </div>
              <div>
                <h4 className="text-xs font-extrabold text-white">
                  Super Admin / Moderator Access Active
                </h4>
                <p className="text-[11px] text-amber-300">
                  Viewing all profiles (Grooms &amp; Brides, Submitted &amp; Approved) • Subscription check bypassed • Confidential contacts unmasked.
                </p>
              </div>
            </div>
            <a
              href={`${(process.env.NEXT_PUBLIC_ADMIN_URL || 'http://localhost:3001').replace(/\/+$/, '')}/profiles`}
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs text-center shadow-md transition-all shrink-0 flex items-center gap-1.5"
            >
              <span>Open Admin Review Console</span>
              <span>→</span>
            </a>
          </div>
        )}

        {/* Free Member Informational Notice Banner (Shown when not subscribed and not admin) */}
        {!isSubscribed && !isAdmin && (
          <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-blue-600/10 border border-amber-500/30 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start sm:items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 text-amber-400 font-bold flex items-center justify-center shrink-0 text-base shadow-sm">
                🔒
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-extrabold text-white">Free Member Preview Mode</h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    Active Plan Needed
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
                  You are viewing candidate summaries. An active subscription plan is required to express matrimonial interest and unlock full verified profiles (pastoral testimony, family background, and verified contact reveals).
                </p>
              </div>
            </div>
            <Link
              href="/subscriptions"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold text-xs text-center shadow-lg shadow-amber-950/30 transition-all shrink-0 flex items-center justify-center gap-1.5"
            >
              <span>Explore Subscription Plans</span>
              <span>→</span>
            </Link>
          </div>
        )}

        {/* Subscribed Active Member Status Bar */}
        {isSubscribed && !isAdmin && (
          <div className="p-3.5 rounded-2xl bg-emerald-950/40 border border-emerald-800/60 text-xs flex items-center justify-between gap-3 text-emerald-300">
            <div className="flex items-center gap-2 font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Active Membership Active ({planName || 'Subscribed Member'})</span>
              <span className="text-slate-400 font-normal">• Express Interest &amp; Full Profiles Unlocked</span>
            </div>
            <Link href="/subscriptions" className="text-[11px] underline hover:text-white font-semibold">
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
              className="w-full text-xs font-medium rounded-2xl border border-slate-800 p-4 bg-slate-900/90 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 shadow-xl"
            />
          </div>
          <button
            type="submit"
            className="px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold text-xs shadow-lg transition-all"
          >
            Search Candidates
          </button>
        </form>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Filter Sidebar */}
          <div className="lg:col-span-1 bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 shadow-2xl h-fit space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h2 className="font-extrabold text-white text-sm uppercase tracking-wider">
                Filter Search
              </h2>
              <button
                type="button"
                onClick={handleResetFilters}
                className="text-xs text-amber-400 font-bold hover:underline"
              >
                Reset All
              </button>
            </div>

            <div className="space-y-4">
              {/* Looking for */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  Looking For
                </label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full text-xs font-medium rounded-xl border border-slate-800 p-3 bg-slate-950 text-white focus:outline-none focus:border-amber-400"
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
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  Denomination
                </label>
                <select
                  value={denomination}
                  onChange={(e) => setDenomination(e.target.value)}
                  className="w-full text-xs font-medium rounded-xl border border-slate-800 p-3 bg-slate-950 text-white focus:outline-none focus:border-amber-400"
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
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  Location / District
                </label>
                <select
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full text-xs font-medium rounded-xl border border-slate-800 p-3 bg-slate-950 text-white focus:outline-none focus:border-amber-400"
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
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  Age Range
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    placeholder="Min (18)"
                    value={ageMin}
                    onChange={(e) => setAgeMin(e.target.value)}
                    className="w-1/2 text-xs font-medium rounded-xl border border-slate-800 p-2.5 bg-slate-950 text-white focus:outline-none focus:border-amber-400"
                  />
                  <span className="text-slate-600 text-xs">-</span>
                  <input
                    type="number"
                    placeholder="Max (60)"
                    value={ageMax}
                    onChange={(e) => setAgeMax(e.target.value)}
                    className="w-1/2 text-xs font-medium rounded-xl border border-slate-800 p-2.5 bg-slate-950 text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={fetchProfiles}
                className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition-all"
              >
                Apply Filters
              </button>
            </div>
          </div>

          {/* Right Candidate Stream */}
          <div className="lg:col-span-3 space-y-5">
            {/* Header Controls: Count + Horizontal/Grid Toggle + Gender Tabs */}
            <div className="flex flex-col md:flex-row md:items-center justify-between bg-slate-900/60 border border-slate-800/80 px-5 py-3.5 rounded-2xl gap-3">
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Showing <strong className="text-amber-400">{candidates.length}</strong> of {total} Matches
                </span>
                {/* Quick Gender Toggle Tabs */}
                <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-[11px]">
                  {myGender && (
                    <button
                      type="button"
                      onClick={() => setGender(myGender === 'FEMALE' ? 'MALE' : 'FEMALE')}
                      className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                        (myGender === 'FEMALE' && gender === 'MALE') || (myGender === 'MALE' && gender === 'FEMALE')
                          ? 'bg-amber-500 text-slate-950 shadow-sm'
                          : 'text-slate-400 hover:text-white'
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
                        ? 'bg-amber-500 text-slate-950 shadow-sm'
                        : gender === 'FEMALE' && myGender === 'MALE'
                        ? 'bg-amber-500 text-slate-950 shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Brides
                  </button>
                  <button
                    type="button"
                    onClick={() => setGender('MALE')}
                    className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                      gender === 'MALE' && (!myGender || myGender !== 'FEMALE')
                        ? 'bg-amber-500 text-slate-950 shadow-sm'
                        : gender === 'MALE' && myGender === 'FEMALE'
                        ? 'bg-amber-500 text-slate-950 shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Grooms
                  </button>
                  <button
                    type="button"
                    onClick={() => setGender('ALL')}
                    className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                      gender === 'ALL' || (!myGender && !gender)
                        ? 'bg-slate-800 text-white'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    All
                  </button>
                </div>
              </div>

              {/* View Layout Switcher */}
              <div className="flex items-center gap-2 bg-slate-950 p-1 rounded-xl border border-slate-800 shrink-0">
                <button
                  onClick={() => setViewMode('horizontal')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    viewMode === 'horizontal'
                      ? 'bg-amber-500 text-slate-950 shadow-md'
                      : 'text-slate-400 hover:text-white'
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
                      ? 'bg-amber-500 text-slate-950 shadow-md'
                      : 'text-slate-400 hover:text-white'
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
                  <div key={i} className="h-56 bg-slate-900 border border-slate-800 rounded-3xl animate-pulse" />
                ))}
              </div>
            ) : isAuthRequired ? (
              <div className="p-10 sm:p-14 rounded-3xl bg-slate-900/90 border border-slate-800 text-center space-y-6 shadow-2xl">
                <div className="w-12 h-12 rounded-full bg-blue-900/40 border border-blue-700/50 text-blue-400 flex items-center justify-center mx-auto text-xs font-mono font-bold shadow-lg shadow-blue-950">
                  Auth
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl sm:text-2xl font-extrabold text-white">
                    Member Sign-In Required
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
                    To safeguard candidate privacy and family dignity, full candidate discovery is exclusively accessible to verified Christian members.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                  <Link
                    href="/login?redirect=/discover"
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-700 to-blue-900 hover:from-blue-600 hover:to-blue-800 text-white font-extrabold text-xs shadow-lg shadow-blue-950 transition-all"
                  >
                    Sign In to View Matches →
                  </Link>
                  <Link
                    href="/register"
                    className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700 transition-all"
                  >
                    Register Free Account
                  </Link>
                </div>
              </div>
            ) : error ? (
              <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 text-center text-xs text-red-400">
                {error}
              </div>
            ) : candidates.length === 0 ? (
              <div className="p-12 rounded-3xl bg-slate-900 border border-slate-800 text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center mx-auto text-xs font-mono">
                  Search
                </div>
                <h3 className="text-sm font-bold text-white">No Profiles Found</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Try adjusting your filters or resetting location to &quot;All Locations&quot; to view all verified candidates.
                </p>
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="px-6 py-2.5 rounded-xl bg-amber-500 text-slate-950 text-xs font-bold"
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
                      className="bg-slate-900/90 backdrop-blur-xl border border-slate-800 hover:border-amber-500/50 rounded-3xl p-5 md:p-6 shadow-2xl transition-all duration-300 group flex flex-col md:flex-row items-stretch gap-6"
                    >
                      {/* Left: Photo & Badges Container */}
                      <div className="w-full md:w-56 h-64 md:h-auto rounded-2xl relative overflow-hidden shrink-0 bg-slate-950 border border-slate-800/80">
                        <img
                          src={photoSrc}
                          alt={c.first_name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          onError={(e) => {
                            e.currentTarget.src = DEFAULT_AVATAR_SVG;
                          }}
                        />

                        {/* Top Overlay Badges */}
                        <div className="absolute top-3 left-3 bg-emerald-950/90 backdrop-blur-md text-emerald-300 text-[10px] font-extrabold px-2.5 py-1 rounded-lg border border-emerald-800/80 shadow-md">
                          Verified
                        </div>

                        <div className="absolute top-3 right-3 bg-slate-950/80 backdrop-blur-md text-amber-400 text-[10px] font-bold px-2.5 py-1 rounded-lg border border-slate-800">
                          CM-{c.id}
                        </div>

                        <div className="absolute bottom-3 left-3 right-3 bg-slate-950/80 backdrop-blur-md text-slate-300 text-[10px] font-semibold px-2 py-1 rounded-lg border border-slate-800 text-center">
                          Christian Matrimony Profile
                        </div>
                      </div>

                      {/* Right Main Container (Full Width Stack) */}
                      <div className="flex-1 flex flex-col justify-between space-y-4">
                        {/* 1. Candidate Header */}
                        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-800/80">
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-extrabold text-xl text-white group-hover:text-amber-400 transition-colors">
                                {c.first_name} {c.last_name}
                              </h3>
                              {c.status && (
                                <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md uppercase border ${
                                  c.status === 'APPROVED' ? 'bg-emerald-950 text-emerald-300 border-emerald-800' : 'bg-blue-950 text-blue-300 border-blue-800'
                                }`}>
                                  {c.status}
                                </span>
                              )}
                              {!isSubscribed && !isAdmin && (
                                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                                  <span>🔒</span>
                                  <span>Preview</span>
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-amber-400 font-semibold mt-0.5">
                              {c.age ? `${c.age} Yrs` : '—'}, {c.height_cm ? `${Math.floor(c.height_cm / 30.48)}'${Math.round((c.height_cm % 30.48) / 2.54)}"` : 'Height N/A'} • {c.marital_status ? c.marital_status.replace('_', ' ') : 'Never Married'}
                            </p>

                            {/* Admin Unmasked Contact Strip */}
                            {isAdmin && (c.mobile_number || c.email) && (
                              <div className="mt-2 py-1 px-2.5 rounded-lg bg-amber-500/10 border border-amber-500/30 flex flex-wrap items-center gap-3 text-xs">
                                {c.mobile_number && (
                                  <a href={`tel:${c.mobile_number}`} className="text-white font-mono font-bold hover:text-amber-400 transition-colors">
                                    Phone: +91 {c.mobile_number}
                                  </a>
                                )}
                                {c.email && (
                                  <a href={`mailto:${c.email}`} className="text-slate-300 font-medium hover:text-amber-400 transition-colors">
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
                                ? 'bg-rose-950/80 border-rose-700 text-rose-400'
                                : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-rose-400 hover:border-slate-700'
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
                            <span className="text-slate-400 font-semibold w-24 shrink-0">Denomination:</span>
                            <span className="text-white font-medium truncate">{c.denomination || 'Christian'}</span>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="text-slate-400 font-semibold w-24 shrink-0">Church:</span>
                            {!isSubscribed && !isAdmin ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/30 text-amber-300 font-semibold text-[11px]">
                                <span>🔒</span>
                                <span>Church Info Locked</span>
                              </span>
                            ) : (
                              <span className="text-white font-medium truncate">{c.church_name || 'Centenary Methodist Church'}</span>
                            )}
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="text-slate-400 font-semibold w-24 shrink-0">Education:</span>
                            <span className="text-white font-medium truncate">{c.highest_education || 'Graduate'}</span>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="text-slate-400 font-semibold w-24 shrink-0">Profession:</span>
                            {!isSubscribed && !isAdmin ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/30 text-amber-300 font-semibold text-[11px]">
                                <span>🔒</span>
                                <span>Profession Locked</span>
                              </span>
                            ) : (
                              <span className="text-white font-medium truncate">{c.occupation_title || 'Employed Professional'}</span>
                            )}
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="text-slate-400 font-semibold w-24 shrink-0">Location:</span>
                            {!isSubscribed && !isAdmin ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/30 text-amber-300 font-semibold text-[11px]">
                                <span>🔒</span>
                                <span>Location Locked</span>
                              </span>
                            ) : (
                              <span className="text-amber-400/90 font-medium truncate">📍 {c.district || 'Bidar'}, {c.state || 'Karnataka'}</span>
                            )}
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="text-slate-400 font-semibold w-24 shrink-0">Annual Income:</span>
                            {!isSubscribed && !isAdmin ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/30 text-amber-300 font-semibold text-[11px]">
                                <span>🔒</span>
                                <span>Package Info Locked</span>
                              </span>
                            ) : (
                              <span className="text-emerald-400 font-medium truncate">
                                {c.annual_income_min ? (c.annual_income_min >= 100000 ? `₹${(c.annual_income_min / 100000).toFixed(1)} LPA+` : `₹${c.annual_income_min.toLocaleString('en-IN')}`) : 'Confidential'}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* 3. Faith & Pastoral Verification Footer Banner */}
                        <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 text-[11px] text-slate-300 flex flex-wrap items-center gap-3">
                          <span className="text-emerald-400 font-extrabold flex items-center gap-1">
                            Pastoral Verified
                          </span>
                          <span className="text-slate-700">•</span>
                          <span className="font-semibold text-slate-300">Church Membership Active</span>
                          <span className="text-slate-700">•</span>
                          <span className="font-semibold text-slate-300">Controlled Contact Reveal</span>
                        </div>

                        {/* 4. Action Buttons Bar DIRECTLY BELOW Pastoral Banner */}
                        <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                          <button
                            type="button"
                            onClick={() => handleExpressInterestClick(c)}
                            className="w-full sm:flex-1 py-3 px-6 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold text-xs text-center transition-all shadow-lg shadow-amber-950/30 flex items-center justify-center gap-2"
                          >
                            <span>Express Interest</span>
                            <span>→</span>
                          </button>

                          <button
                            type="button"
                            onClick={(e) => handleViewProfileClick(e, c)}
                            className="w-full sm:flex-1 py-3 px-6 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold text-center border border-slate-700 transition-all flex items-center justify-center gap-1.5"
                          >
                            <span>View Full Profile</span>
                            {!isSubscribed && !isAdmin && <span className="text-[10px] text-amber-400">🔒</span>}
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
                      className="bg-slate-900/90 backdrop-blur-xl border border-slate-800 hover:border-amber-500/50 rounded-3xl p-6 shadow-xl hover:shadow-2xl group transition-all duration-300 flex flex-col justify-between"
                    >
                      <div>
                        {/* Top Badges Row */}
                        <div className="flex items-center justify-between gap-2 pb-1">
                          <span className="bg-amber-500/10 text-amber-300 border border-amber-500/30 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider truncate max-w-[130px]">
                            {c.denomination || 'Christian'}
                          </span>

                          <span className="bg-emerald-950/80 text-emerald-300 border border-emerald-800/80 text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 shrink-0">
                            <span>✓</span>
                            <span>Verified</span>
                          </span>
                        </div>

                        {/* Circular Photo Header */}
                        <div className="my-5 flex justify-center">
                          <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full ring-4 ring-amber-400/20 group-hover:ring-amber-400/60 shadow-xl overflow-hidden bg-slate-950 transition-all duration-300 relative flex items-center justify-center shrink-0">
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
                        <div className="space-y-2 pt-2 border-t border-slate-800/80">
                          <div className="flex items-center justify-between">
                            <h3 className="font-extrabold text-base text-white group-hover:text-amber-400 transition-colors">
                              {c.first_name} {c.last_name}
                            </h3>
                            <span className="text-xs text-slate-400 font-medium">
                              {c.age || '—'} Yrs
                            </span>
                          </div>

                          {/* Education: Always shown */}
                          <p className="text-xs text-slate-300 font-medium truncate">
                            🎓 {c.highest_education || 'Graduate'}
                          </p>

                          {/* Profession & Package: Locked for unpaid */}
                          <p className="text-xs font-medium truncate">
                            {!isSubscribed && !isAdmin ? (
                              <span className="inline-flex items-center gap-1 text-amber-400/90 text-[11px] font-semibold bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">
                                <span>🔒</span>
                                <span>Profession &amp; Package Locked</span>
                              </span>
                            ) : (
                              <span className="text-slate-300">
                                💼 {c.occupation_title || 'Employed Professional'} {c.annual_income_min ? `(₹${(c.annual_income_min / 100000).toFixed(1)} LPA+)` : ''}
                              </span>
                            )}
                          </p>

                          {/* Location: Locked for unpaid */}
                          <p className="text-[11px] font-semibold truncate">
                            {!isSubscribed && !isAdmin ? (
                              <span className="inline-flex items-center gap-1 text-amber-400/90 text-[11px] font-semibold bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">
                                <span>🔒</span>
                                <span>Location Locked</span>
                              </span>
                            ) : (
                              <span className="text-amber-400/90">📍 {c.district || 'Bidar'}, {c.state || 'Karnataka'}</span>
                            )}
                          </p>

                          {/* Admin Unmasked Contact Strip */}
                          {isAdmin && (c.mobile_number || c.email) && (
                            <div className="pt-2 border-t border-slate-800/80 text-[11px] text-amber-300 font-mono space-y-0.5">
                              {c.mobile_number && <div>Phone: +91 {c.mobile_number}</div>}
                              {c.email && <div className="truncate text-slate-300">Email: {c.email}</div>}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* CTAs */}
                      <div className="mt-5 pt-1 grid grid-cols-2 gap-2.5">
                        <button
                          type="button"
                          onClick={(e) => handleViewProfileClick(e, c)}
                          className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold text-center border border-slate-700 transition-all flex items-center justify-center gap-1"
                        >
                          <span>View Bio</span>
                          {!isSubscribed && !isAdmin && <span className="text-[10px] text-amber-400">🔒</span>}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleExpressInterestClick(c)}
                          className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-extrabold text-center transition-all shadow-md"
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
