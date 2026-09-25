'use client';

import React, { Suspense, useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { apiClient } from '../../lib/api-client';
import { ChatMessageItem, ChatSuggestionsResponse } from '../../types';
import { getPhotoUrl, DEFAULT_AVATAR_SVG } from '../../lib/utils';

function ChatContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const targetUserIdParam = searchParams.get('other_user_id') || searchParams.get('user_id');

  const [conversations, setConversations] = useState<any[]>([]);
  const [activeUser, setActiveUser] = useState<any>(null);
  const [partnerProfile, setPartnerProfile] = useState<any>(null);
  const [showProfileCard, setShowProfileCard] = useState<boolean>(true);
  const [messages, setMessages] = useState<ChatMessageItem[]>([]);
  const [inputText, setInputText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [uploadingAttachment, setUploadingAttachment] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showAiDrawer, setShowAiDrawer] = useState(false);
  const [aiLang, setAiLang] = useState<'en' | 'kn' | 'hi'>('en');
  const [aiCategory, setAiCategory] = useState<string>('all');
  const [suggestions, setSuggestions] = useState<ChatSuggestionsResponse | null>(null);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [alertBannerVisible, setAlertBannerVisible] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sampleEmojis = ['❤️', '🙏', '😊', '👍', '🌹', '✨', '✝️', '🕊️', '💐', '🤝'];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // 1. Initial Load of Matched Conversations
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('access_token');
      if (!token) {
        alert('Need to login: Please log in to access your matrimonial chats.');
        window.location.href = '/login?redirect=/chat';
        return;
      }
    }

    const loadConversations = async () => {
      try {
        const list = await apiClient.getConversations();
        setConversations(list || []);

        // If targetUserIdParam was passed in URL (e.g. /chat?other_user_id=12)
        if (targetUserIdParam) {
          const targetId = Number(targetUserIdParam);
          const found = (list || []).find(
            (c: any) => c.other_user_id === targetId || c.other_user?.id === targetId
          );

          if (found) {
            setActiveUser(found.other_user || {
              id: found.other_user_id,
              first_name: found.name?.split(' ')[0] || 'Member',
              last_name: found.name?.split(' ')[1] || '',
              denomination: found.denomination,
              primary_photo: found.primary_photo,
            });
          } else {
            // Newly accepted connection not yet in conversations list, load candidate profile directly
            try {
              const prof = await apiClient.getPartnerProfile(targetId);
              if (prof) {
                const newConv = {
                  other_user_id: prof.id,
                  name: `${prof.first_name} ${prof.last_name}`,
                  denomination: prof.denomination || 'Christian',
                  primary_photo: prof.primary_photo,
                  last_message: 'Mutual Match Active - Start Conversation',
                  last_message_at: new Date().toISOString(),
                  unread_count: 0,
                  other_user: prof,
                };
                setConversations((prev) => [newConv, ...prev]);
                setActiveUser(prof);
              }
            } catch (pErr) {
              console.warn('Could not load target partner profile directly', pErr);
            }
          }
        } else if (list && list.length > 0) {
          // Default to first matched conversation
          setActiveUser(list[0].other_user || {
            id: list[0].other_user_id,
            first_name: list[0].name?.split(' ')[0] || 'Member',
            last_name: list[0].name?.split(' ')[1] || '',
            denomination: list[0].denomination,
            primary_photo: list[0].primary_photo,
          });
        }
      } catch (err: any) {
        console.error('Failed to load conversations', err);
      } finally {
        setLoading(false);
      }
    };

    loadConversations();
  }, [targetUserIdParam]);

  // 2. Fetch full partner profile for the Chatbox whenever activeUser changes
  useEffect(() => {
    if (!activeUser?.id) {
      setPartnerProfile(null);
      return;
    }

    // If activeUser already has rich profile fields (e.g. occupation_title, about_me, height_cm)
    if (activeUser.occupation_title || activeUser.about_me || activeUser.height_cm) {
      setPartnerProfile(activeUser);
    } else {
      // Fetch full candidate profile for chatbox display
      const fetchProfile = async () => {
        try {
          const prof = await apiClient.getPartnerProfile(activeUser.id);
          setPartnerProfile(prof);
        } catch (err) {
          console.warn('Partner profile fetch notice:', err);
          setPartnerProfile(activeUser);
        }
      };
      fetchProfile();
    }
  }, [activeUser]);

  // 3. Poll chat messages strictly within 4-hour window
  useEffect(() => {
    const loadChat = async () => {
      if (!activeUser?.id) return;
      try {
        const history = await apiClient.getChatHistory(activeUser.id);
        setMessages(history || []);
        setTimeout(scrollToBottom, 100);
      } catch (err: any) {
        console.error('Failed to load chat history', err);
      }
    };

    loadChat();
    const interval = setInterval(loadChat, 4000);
    return () => clearInterval(interval);
  }, [activeUser]);

  // 4. Load AI conversation suggestions
  useEffect(() => {
    if (!activeUser?.id) return;
    const fetchSuggestions = async () => {
      setLoadingSuggestions(true);
      try {
        const data = await apiClient.getChatSuggestions(activeUser.id, aiLang);
        setSuggestions(data);
      } catch (err) {
        console.warn('Could not load suggestions', err);
      } finally {
        setLoadingSuggestions(false);
      }
    };
    fetchSuggestions();
  }, [activeUser, aiLang]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || !activeUser || sending) return;

    setInputText('');
    setSending(true);

    try {
      const msg = await apiClient.sendMessage(activeUser.id, text);
      setMessages((prev) => [...prev, { ...msg, is_me: true }]);
      setTimeout(scrollToBottom, 100);
    } catch (err: any) {
      if (err.message?.includes('subscription') || err.message?.includes('plan') || err.status === 402) {
        const upgrade = window.confirm(
          'An active subscription plan is required to send messages to candidates. Would you like to view our plans?'
        );
        if (upgrade) router.push('/subscriptions');
      } else {
        alert(`Message Policy Notice: ${err.message || 'Failed to send message.'}`);
      }
      if (!textToSend) setInputText(text);
    } finally {
      setSending(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !activeUser) return;

    setUploadingAttachment(true);
    try {
      const uploadRes = await apiClient.uploadChatAttachment(file);
      const msg = await apiClient.sendMessage(
        activeUser.id,
        'Shared an image attachment',
        uploadRes.attachment_url,
        uploadRes.attachment_type || 'image',
      );
      setMessages((prev) => [...prev, { ...msg, is_me: true }]);
      setTimeout(scrollToBottom, 100);
    } catch (err: any) {
      alert(`Attachment Notice: ${err.message || 'Image contains prohibited contact details or external numbers.'}`);
    } finally {
      setUploadingAttachment(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleEmojiClick = (emoji: string) => {
    setInputText((prev) => prev + emoji);
    setShowEmojiPicker(false);
  };

  const filteredConversations = conversations.filter((c) => {
    const name = `${c.name || c.other_user?.first_name || ''} ${c.other_user?.last_name || ''}`.toLowerCase();
    return name.includes(searchQuery.toLowerCase());
  });

  const activePrompts = React.useMemo(() => {
    if (!suggestions?.categories) return [];
    if (aiCategory === 'all') {
      return [
        ...(suggestions.categories.greetings || []),
        ...(suggestions.categories.faith_and_church || []),
        ...(suggestions.categories.dating_and_meeting || []),
        ...(suggestions.categories.family_values || []),
        ...(suggestions.categories.career_and_life || []),
      ];
    }
    return (suggestions.categories as any)[aiCategory] || [];
  }, [suggestions, aiCategory]);

  return (
    <div className="relative min-h-[calc(100vh-80px)] py-4 px-2 sm:px-6 lg:px-8 bg-[#fdfbf7] text-charcoal-900 font-sans overflow-hidden">
      {/* Ambient Lighting Glows */}
      <div className="absolute top-10 left-1/4 w-96 h-96 bg-gold-400/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-burgundy-600/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10 space-y-3">
        {/* TOP SAFETY & 4-HOUR AUTO-PURGE NOTICE BANNER */}
        {alertBannerVisible && (
          <div className="relative overflow-hidden bg-gradient-to-r from-burgundy-950 via-burgundy-900 to-amber-950 border border-gold-500/30 rounded-2xl p-3 sm:p-4 text-white shadow-md">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-gold-500/20 border border-gold-400/40 text-gold-300 font-bold flex items-center justify-center shrink-0 text-base">
                  🛡️
                </div>
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-serif font-extrabold text-gold-300 text-xs sm:text-sm tracking-wide">
                      Christian Matrimony Safety & Ephemeral Privacy Shield
                    </span>
                    <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[10px] font-bold px-2 py-0.5 rounded-full">
                      ⏱️ 4-Hour Auto-Purge Active
                    </span>
                    <span className="bg-rose-500/20 text-rose-300 border border-rose-400/30 text-[10px] font-bold px-2 py-0.5 rounded-full">
                      Zero-Tolerance Contact Shield
                    </span>
                  </div>
                  <p className="text-[11px] text-gold-100/90 leading-relaxed max-w-4xl">
                    For family peace of mind, all messages permanently self-purge after <strong>4 hours</strong> with zero archives retained.
                    Exchanging phone numbers, disguised digits (*e.g. NINE EIGHT...*), emails, or off-platform handles before mutual contact reveal is strictly prohibited and results in immediate account restriction.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setAlertBannerVisible(false)}
                className="text-gold-200/70 hover:text-white text-xs px-2 py-1 rounded-lg hover:bg-white/10 shrink-0 self-end sm:self-center"
                title="Dismiss banner"
              >
                ✕ Dismiss
              </button>
            </div>
          </div>
        )}

        {/* Main Messenger Panel */}
        <div className="bg-white border border-[#ece2d1] rounded-3xl shadow-lg overflow-hidden grid grid-cols-1 md:grid-cols-12 h-[calc(100vh-170px)] min-h-[660px]">

          {/* LEFT SIDEBAR: Matched Conversations List */}
          <div className="md:col-span-4 lg:col-span-4 border-r border-[#ece2d1] flex flex-col bg-[#faf6ee]">
            {/* Sidebar Header */}
            <div className="p-4 border-b border-[#ece2d1] space-y-3 bg-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-burgundy-700 to-burgundy-900 text-gold-300 font-bold flex items-center justify-center text-xs shadow-xs border border-gold-400/30">
                    💬
                  </div>
                  <div>
                    <h2 className="text-sm font-serif font-extrabold text-charcoal-900">Matrimonial Messages</h2>
                    <p className="text-[10px] text-charcoal-500">Mutually Accepted Connections</p>
                  </div>
                </div>
                <span className="bg-gold-50 border border-gold-200 text-gold-900 font-mono text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {conversations.length} Active
                </span>
              </div>

              {/* Search Bar */}
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search matches by name..."
                  className="w-full text-xs bg-[#faf6ee] border border-[#ded0ba] rounded-xl pl-8 pr-3 py-2 text-charcoal-900 placeholder:text-charcoal-400 focus:outline-none focus:border-burgundy-600 focus:bg-white transition-all"
                />
                <span className="absolute left-2.5 top-2.5 text-charcoal-400 text-xs">🔍</span>
              </div>
            </div>

            {/* Conversations Scroll Area */}
            <div className="flex-1 overflow-y-auto divide-y divide-[#ece2d1]">
              {loading ? (
                <div className="p-8 text-center text-xs text-charcoal-400 animate-pulse">
                  Loading accepted matches...
                </div>
              ) : filteredConversations.length === 0 ? (
                <div className="p-8 text-center space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-white border border-[#ece2d1] text-gold-700 flex items-center justify-center mx-auto text-xl shadow-xs">
                    💌
                  </div>
                  <p className="text-xs font-serif font-extrabold text-charcoal-900">No Matched Conversations</p>
                  <p className="text-[11px] text-charcoal-500 leading-relaxed">
                    Direct chat unlocks when candidates mutually accept connection requests.
                  </p>
                  <Link
                    href="/interests?tab=received"
                    className="inline-block px-4 py-2 rounded-xl bg-gradient-to-r from-burgundy-700 to-burgundy-800 hover:from-burgundy-600 hover:to-burgundy-700 text-white text-xs font-extrabold shadow-sm transition-all"
                  >
                    View Received Interests ➔
                  </Link>
                </div>
              ) : (
                filteredConversations.map((conv) => {
                  const otherId = conv.other_user_id || conv.other_user?.id;
                  const isSelected = activeUser?.id === otherId;
                  const photo = conv.primary_photo || conv.other_user?.primary_photo;
                  const name = conv.name || `${conv.other_user?.first_name || ''} ${conv.other_user?.last_name || ''}`;

                  return (
                    <button
                      key={otherId}
                      onClick={() =>
                        setActiveUser(
                          conv.other_user || {
                            id: otherId,
                            first_name: name.split(' ')[0],
                            last_name: name.split(' ')[1] || '',
                            denomination: conv.denomination,
                            primary_photo: photo,
                          }
                        )
                      }
                      className={`w-full text-left p-3.5 flex items-center gap-3 transition-all relative ${
                        isSelected
                          ? 'bg-gradient-to-r from-burgundy-100/60 to-white border-l-4 border-burgundy-700'
                          : 'hover:bg-white/80'
                      }`}
                    >
                      {/* Avatar */}
                      <div className="relative w-11 h-11 rounded-2xl bg-white border border-[#ece2d1] overflow-hidden shrink-0 shadow-xs">
                        <img
                          src={getPhotoUrl(photo) || DEFAULT_AVATAR_SVG}
                          alt="Avatar"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = DEFAULT_AVATAR_SVG;
                          }}
                        />
                        <span className="absolute bottom-0.5 right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
                      </div>

                      {/* Content */}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between mb-0.5">
                          <h4 className="text-xs font-serif font-extrabold text-charcoal-900 truncate">
                            {name}
                          </h4>
                          <span className="text-[9px] text-charcoal-400 font-mono">
                            {conv.last_message_at
                              ? new Date(conv.last_message_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                              : ''}
                          </span>
                        </div>
                        <p className="text-[11px] text-charcoal-500 truncate">
                          {conv.last_message || 'Mutual Match Active'}
                        </p>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* RIGHT CHAT WINDOW WITH INTEGRATED CANDIDATE PROFILE */}
          <div className="md:col-span-8 lg:col-span-8 flex flex-col bg-[#fdfbf7] relative">
            {activeUser ? (
              <>
                {/* 1. CHAT TOP BAR */}
                <div className="p-3.5 sm:p-4 border-b border-[#ece2d1] flex items-center justify-between bg-white shadow-xs">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="relative w-11 h-11 rounded-xl bg-[#faf6ee] border border-gold-300 overflow-hidden shrink-0 shadow-xs">
                      <img
                        src={getPhotoUrl(partnerProfile?.primary_photo || activeUser.primary_photo) || DEFAULT_AVATAR_SVG}
                        alt="User"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = DEFAULT_AVATAR_SVG;
                        }}
                      />
                      <span className="absolute bottom-0.5 right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="text-xs sm:text-sm font-serif font-extrabold text-charcoal-900 truncate">
                          {partnerProfile?.first_name || activeUser.first_name} {partnerProfile?.last_name || activeUser.last_name}
                        </h3>
                        <span className="bg-emerald-50 text-emerald-800 border border-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shrink-0">
                          <span>✝️</span>
                          <span>Verified {partnerProfile?.gender === 'FEMALE' ? 'Bride' : partnerProfile?.gender === 'MALE' ? 'Groom' : 'Match'}</span>
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 text-[10px] mt-0.5 text-charcoal-600 truncate">
                        {partnerProfile?.age && (
                          <>
                            <span className="font-bold text-charcoal-800">{partnerProfile.age} Yrs</span>
                            <span>•</span>
                          </>
                        )}
                        {partnerProfile?.height_cm && (
                          <>
                            <span>{partnerProfile.height_cm} cm</span>
                            <span>•</span>
                          </>
                        )}
                        <span className="text-gold-900 font-semibold">{partnerProfile?.denomination || activeUser.denomination || 'Christian'}</span>
                        {partnerProfile?.district && (
                          <>
                            <span>•</span>
                            <span className="truncate">{partnerProfile.district}, {partnerProfile.state || 'Karnataka'}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Top Bar Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    {/* Toggle Candidate Profile Details */}
                    <button
                      type="button"
                      onClick={() => setShowProfileCard(!showProfileCard)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 ${
                        showProfileCard
                          ? 'bg-gold-50 text-gold-900 border-gold-300 shadow-2xs'
                          : 'bg-[#faf6ee] text-charcoal-700 border-[#ded0ba] hover:bg-gold-50'
                      }`}
                      title="Toggle Full Candidate Bio Details in Chatbox"
                    >
                      <span>👤</span>
                      <span className="hidden sm:inline">Profile</span>
                      <span className="text-[10px]">{showProfileCard ? '▲' : '▼'}</span>
                    </button>

                    {/* AI Courtship Assistant Toggle */}
                    <button
                      type="button"
                      onClick={() => setShowAiDrawer(!showAiDrawer)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 ${
                        showAiDrawer
                          ? 'bg-burgundy-700 text-gold-200 border-burgundy-800 shadow-2xs'
                          : 'bg-[#faf6ee] text-charcoal-700 border-[#ded0ba] hover:bg-gold-50'
                      }`}
                      title="AI Conversation Suggestions"
                    >
                      <span>✨</span>
                      <span className="hidden sm:inline">AI Helper</span>
                    </button>
                  </div>
                </div>

                {/* 2. INTEGRATED CANDIDATE PROFILE CARD (INSIDE CHATBOX) */}
                {showProfileCard && partnerProfile && (
                  <div className="bg-gradient-to-r from-[#faf6ee] via-white to-[#faf6ee] border-b border-[#ece2d1] p-4 sm:p-5 shadow-xs transition-all animate-fadeIn">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                      {/* Photo Thumbnail */}
                      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white border-2 border-gold-400/50 overflow-hidden shrink-0 shadow-sm relative">
                        <img
                          src={getPhotoUrl(partnerProfile.primary_photo) || DEFAULT_AVATAR_SVG}
                          alt={partnerProfile.first_name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = DEFAULT_AVATAR_SVG;
                          }}
                        />
                        <span className="absolute bottom-1 right-1 bg-gold-500 text-white text-[9px] font-bold px-1 rounded-sm">
                          ✝
                        </span>
                      </div>

                      {/* Bio Details Grid */}
                      <div className="flex-1 min-w-0 space-y-1.5">
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                          <h4 className="font-serif font-extrabold text-sm sm:text-base text-charcoal-900">
                            {partnerProfile.first_name} {partnerProfile.last_name}
                          </h4>
                          {partnerProfile.marital_status && (
                            <span className="bg-[#faf6ee] border border-[#ded0ba] text-charcoal-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                              {partnerProfile.marital_status.replace(/_/g, ' ')}
                            </span>
                          )}
                          <span className="text-[11px] text-emerald-700 font-bold flex items-center gap-1">
                            <span>🤝</span>
                            <span>Mutual Match Confirmed</span>
                          </span>
                        </div>

                        {/* Credentials Pills */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px] text-charcoal-700 pt-1">
                          <div className="bg-white p-2 rounded-xl border border-[#ece2d1]">
                            <strong className="block text-[10px] uppercase tracking-wider text-charcoal-400">Faith &amp; Church</strong>
                            <span className="font-semibold text-charcoal-900 truncate block">
                              {partnerProfile.denomination || 'Christian'}
                              {partnerProfile.church_name ? ` (${partnerProfile.church_name})` : ''}
                            </span>
                          </div>

                          <div className="bg-white p-2 rounded-xl border border-[#ece2d1]">
                            <strong className="block text-[10px] uppercase tracking-wider text-charcoal-400">Education &amp; Work</strong>
                            <span className="font-semibold text-charcoal-900 truncate block">
                              {partnerProfile.occupation_title || partnerProfile.highest_education || 'Professional'}
                            </span>
                          </div>

                          <div className="bg-white p-2 rounded-xl border border-[#ece2d1] col-span-2 sm:col-span-1">
                            <strong className="block text-[10px] uppercase tracking-wider text-charcoal-400">Native Location</strong>
                            <span className="font-semibold text-charcoal-900 truncate block">
                              {partnerProfile.district || 'Bidar'}, {partnerProfile.state || 'Karnataka'}
                            </span>
                          </div>
                        </div>

                        {/* Bio Statement Quote */}
                        {partnerProfile.about_me && (
                          <p className="text-[11px] text-charcoal-600 italic bg-white/70 p-2 rounded-xl border border-[#ece2d1]/60 line-clamp-2">
                            &quot;{partnerProfile.about_me}&quot;
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* 3. MESSAGES BODY (WITH 4-HOUR AUTO-PURGE) */}
                <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-3.5 bg-[#fdfbf7] bg-[radial-gradient(#ded0ba_1px,transparent_1px)] [background-size:16px_16px]">
                  {messages.length === 0 ? (
                    <div className="max-w-md mx-auto my-8 p-6 rounded-3xl bg-white border border-[#ece2d1] text-center space-y-3 shadow-sm">
                      <div className="w-12 h-12 rounded-2xl bg-gold-50 text-gold-800 font-black flex items-center justify-center mx-auto text-xl border border-gold-200">
                        ✝
                      </div>
                      <h4 className="text-xs font-serif font-extrabold text-charcoal-900">
                        Start Your Blessed Conversation with {activeUser.first_name}
                      </h4>
                      <p className="text-[11px] text-charcoal-600 leading-relaxed">
                        Say hello and introduce yourself. Both of you have mutually accepted each other&apos;s matrimonial profile. All messages are confidential and automatically cleared after 4 hours for total family privacy.
                      </p>
                      <div className="pt-2 flex flex-wrap justify-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleSendMessage(`Praise the Lord! Hello ${activeUser.first_name}, blessed to connect with your profile.`)}
                          className="px-3.5 py-2 rounded-xl bg-gold-50 hover:bg-gold-100 text-gold-900 text-xs font-bold border border-gold-300 transition-all shadow-xs"
                        >
                          &quot;Praise the Lord! Blessed to connect...&quot; ✨
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSendMessage(`Greetings in Christ Jesus! How is your day going?`)}
                          className="px-3.5 py-2 rounded-xl bg-[#faf6ee] hover:bg-white text-charcoal-800 text-xs font-bold border border-[#ded0ba] transition-all"
                        >
                          &quot;Greetings in Christ Jesus!&quot; 🕊️
                        </button>
                      </div>
                    </div>
                  ) : (
                    messages.map((m, idx) => {
                      const isMe = m.is_me;
                      const timeStr = m.created_at
                        ? new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                        : '';
                      const isRedacted = m.is_redacted || m.message_text?.includes('[CONTACT INFORMATION HIDDEN]');

                      return (
                        <div
                          key={m.id || idx}
                          className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                        >
                          <div
                            className={`max-w-xs sm:max-w-md px-4 py-2.5 rounded-2xl text-xs leading-relaxed shadow-xs relative group ${
                              isRedacted
                                ? 'bg-amber-50 text-amber-950 border border-amber-300 rounded-bl-xs'
                                : isMe
                                ? 'bg-gradient-to-r from-burgundy-700 to-burgundy-800 text-white font-medium rounded-br-xs shadow-burgundy-950/20'
                                : 'bg-white text-charcoal-900 border border-[#ece2d1] rounded-bl-xs'
                            }`}
                          >
                            {/* Attachment Rendering */}
                            {m.attachment_url && (
                              <div className="mb-2 rounded-xl overflow-hidden border border-black/10 max-w-sm">
                                <img
                                  src={m.attachment_url}
                                  alt="Chat Attachment"
                                  className="w-full h-auto max-h-60 object-cover"
                                />
                              </div>
                            )}

                            {/* Text Content */}
                            {isRedacted ? (
                              <div className="space-y-1.5">
                                <div className="flex items-center gap-1.5 font-bold text-amber-900 text-[11px]">
                                  <span>🛡️</span>
                                  <span>[CONTACT INFORMATION HIDDEN]</span>
                                </div>
                                <p className="text-[11px] text-amber-800 leading-normal">
                                  A phone number, email, or off-platform handle was blocked by the safety engine. Both parties must submit mutual Contact Reveal requests to share contacts safely.
                                </p>
                              </div>
                            ) : (
                              <p className="whitespace-pre-wrap break-words">{m.message_text}</p>
                            )}

                            <div
                              className={`flex items-center justify-end gap-1 mt-1 text-[9px] ${
                                isMe ? 'text-gold-200/90 font-bold' : 'text-charcoal-400'
                              }`}
                            >
                              <span>{timeStr}</span>
                              {isMe && <span className="text-[11px]">✓✓</span>}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* 4. AI CONVERSATION ASSISTANT TRAY */}
                {showAiDrawer && (
                  <div className="border-t border-[#ece2d1] bg-gradient-to-b from-[#faf6ee] to-white p-3 space-y-2.5 shadow-inner">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-serif font-extrabold text-burgundy-900 flex items-center gap-1">
                          <span>✨</span> AI Courtship Assistant:
                        </span>
                        {/* Language Selector */}
                        <div className="flex items-center bg-white border border-[#ded0ba] rounded-lg p-0.5 text-[10px] font-bold">
                          <button
                            type="button"
                            onClick={() => setAiLang('en')}
                            className={`px-2 py-0.5 rounded-md transition-all ${
                              aiLang === 'en' ? 'bg-burgundy-700 text-white' : 'text-charcoal-600 hover:text-burgundy-800'
                            }`}
                          >
                            English
                          </button>
                          <button
                            type="button"
                            onClick={() => setAiLang('kn')}
                            className={`px-2 py-0.5 rounded-md transition-all ${
                              aiLang === 'kn' ? 'bg-burgundy-700 text-white' : 'text-charcoal-600 hover:text-burgundy-800'
                            }`}
                          >
                            ಕನ್ನಡ
                          </button>
                          <button
                            type="button"
                            onClick={() => setAiLang('hi')}
                            className={`px-2 py-0.5 rounded-md transition-all ${
                              aiLang === 'hi' ? 'bg-burgundy-700 text-white' : 'text-charcoal-600 hover:text-burgundy-800'
                            }`}
                          >
                            हिन्दी
                          </button>
                        </div>
                      </div>

                      {/* Category Switcher */}
                      <div className="flex items-center gap-1 text-[10px] overflow-x-auto">
                        {[
                          { id: 'all', label: 'All' },
                          { id: 'faith_and_church', label: '⛪ Faith & Church' },
                          { id: 'greetings', label: '🕊️ Greetings' },
                          { id: 'family_values', label: '👨‍👩‍👧 Family' },
                          { id: 'dating_and_meeting', label: '☕ Dating & Meeting' },
                          { id: 'career_and_life', label: '💼 Career' },
                        ].map((cat) => (
                          <button
                            key={cat.id}
                            type="button"
                            onClick={() => setAiCategory(cat.id)}
                            className={`px-2.5 py-1 rounded-lg font-bold transition-all shrink-0 ${
                              aiCategory === cat.id
                                ? 'bg-gold-500/20 text-gold-950 border border-gold-400'
                                : 'text-charcoal-600 hover:bg-white border border-transparent'
                            }`}
                          >
                            {cat.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Suggestions Horizontal Chips */}
                    <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
                      {loadingSuggestions ? (
                        <div className="text-[11px] text-charcoal-400 py-1 italic animate-pulse">
                          Generating respectful conversation prompts...
                        </div>
                      ) : activePrompts.length === 0 ? (
                        <div className="text-[11px] text-charcoal-400 py-1">No prompts available for this category.</div>
                      ) : (
                        activePrompts.map((p: any) => (
                          <button
                            key={p.id}
                            type="button"
                            onClick={() => setInputText(p.text)}
                            className="text-[11px] font-medium px-3 py-1.5 bg-white hover:bg-gold-50 text-charcoal-800 hover:text-burgundy-900 border border-[#ded0ba] hover:border-gold-400 rounded-xl transition-all shadow-xs whitespace-nowrap shrink-0 group flex items-center gap-1.5"
                          >
                            <span>{p.text}</span>
                            <span className="text-gold-600 group-hover:translate-x-0.5 transition-transform text-xs">➔</span>
                          </button>
                        ))
                      )}
                    </div>
                  </div>
                )}

                {/* 5. EMOJI PICKER POPUP */}
                {showEmojiPicker && (
                  <div className="px-4 py-2 bg-white border-t border-[#ece2d1] flex items-center gap-2 overflow-x-auto">
                    {sampleEmojis.map((emoji, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => handleEmojiClick(emoji)}
                        className="text-base p-1.5 rounded-xl hover:bg-[#faf6ee] transition-colors"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                )}

                {/* 6. BOTTOM INPUT BAR */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendMessage();
                  }}
                  className="p-3 sm:p-4 border-t border-[#ece2d1] bg-white flex items-center gap-2 sm:gap-3"
                >
                  {/* File Upload Hidden Input */}
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    accept="image/jpeg,image/png,image/webp"
                    className="hidden"
                  />

                  {/* Attachment Button */}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadingAttachment}
                    className="p-2.5 rounded-xl bg-[#faf6ee] hover:bg-gold-50 text-gold-900 border border-[#ded0ba] text-sm transition-all shrink-0"
                    title="Share photo (Safety engine screens for contact numbers)"
                  >
                    {uploadingAttachment ? '⌛' : '📎'}
                  </button>

                  {/* Emoji Button */}
                  <button
                    type="button"
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    className="p-2.5 rounded-xl bg-[#faf6ee] hover:bg-gold-50 text-gold-900 border border-[#ded0ba] text-sm transition-all shrink-0"
                    title="Insert Emoji"
                  >
                    😊
                  </button>

                  {/* Input Field */}
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      placeholder={`Message ${activeUser.first_name} (Phone numbers & off-platform contacts strictly blocked)...`}
                      className="w-full text-xs font-medium bg-[#faf6ee] border border-[#ded0ba] rounded-2xl px-4 py-3 text-charcoal-900 placeholder:text-charcoal-400 focus:outline-none focus:border-burgundy-600 focus:bg-white transition-all"
                    />
                  </div>

                  {/* PROMINENT GRADIENT SEND BUTTON */}
                  <button
                    type="submit"
                    disabled={sending || !inputText.trim()}
                    className={`px-5 sm:px-6 py-3 rounded-2xl text-xs font-extrabold transition-all shadow-md flex items-center gap-2 shrink-0 ${
                      inputText.trim()
                        ? 'bg-gradient-to-r from-burgundy-700 to-burgundy-800 hover:from-burgundy-600 hover:to-burgundy-700 text-white transform hover:-translate-y-0.5'
                        : 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
                    }`}
                  >
                    <span>{sending ? 'Sending...' : 'Send'}</span>
                    <span className="text-sm">➤</span>
                  </button>
                </form>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-4">
                <div className="w-16 h-16 rounded-3xl bg-white border border-[#ece2d1] text-gold-700 font-black flex items-center justify-center text-2xl shadow-sm">
                  💬
                </div>
                <div className="space-y-1 max-w-sm">
                  <h3 className="text-sm font-serif font-extrabold text-charcoal-900">Select a Matrimonial Match</h3>
                  <p className="text-xs text-charcoal-500 leading-relaxed">
                    Choose a conversation from the left sidebar to start messaging your mutual match with full profile visibility.
                  </p>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

export default function ChatPage() {
  return (
    <Suspense
      fallback={
        <div className="bg-[#fdfbf7] min-h-screen py-16 text-center text-xs text-charcoal-500 animate-pulse">
          Loading Matrimonial Messenger...
        </div>
      }
    >
      <ChatContent />
    </Suspense>
  );
}
