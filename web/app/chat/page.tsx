'use client';

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { apiClient } from '../../lib/api-client';
import { ChatMessageItem } from '../../types';
import { getPhotoUrl, DEFAULT_AVATAR_SVG } from '../../lib/utils';

export default function ChatPage() {
  const [conversations, setConversations] = useState<any[]>([]);
  const [activeUser, setActiveUser] = useState<any>(null);
  const [messages, setMessages] = useState<ChatMessageItem[]>([]);
  const [inputText, setInputText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const sampleEmojis = ['❤️', '🙏', '😊', '👍', '🌹', '✨', '✝️', '🕊️', '💐', '🤝'];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    async function loadConversations() {
      try {
        const list = await apiClient.getConversations();
        setConversations(list || []);
        if (list && list.length > 0) {
          setActiveUser(list[0].other_user);
        }
      } catch (err: any) {
        console.error('Failed to load conversations', err);
      } finally {
        setLoading(false);
      }
    }
    loadConversations();
  }, []);

  useEffect(() => {
    async function loadChat() {
      if (!activeUser) return;
      try {
        const history = await apiClient.getChatHistory(activeUser.id);
        setMessages(history || []);
        setTimeout(scrollToBottom, 100);
      } catch (err: any) {
        console.error('Failed to load chat history', err);
      }
    }
    loadChat();

    // Polling interval every 5s for real-time update simulation
    const interval = setInterval(loadChat, 5000);
    return () => clearInterval(interval);
  }, [activeUser]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || !activeUser || sending) return;

    const textToSend = inputText.trim();
    setInputText('');
    setSending(true);

    try {
      const msg = await apiClient.sendMessage(activeUser.id, textToSend);
      setMessages((prev) => [...prev, msg]);
      setTimeout(scrollToBottom, 100);
    } catch (err: any) {
      alert(`Could not send message: ${err.message}`);
      setInputText(textToSend);
    } finally {
      setSending(false);
    }
  };

  const handleEmojiClick = (emoji: string) => {
    setInputText((prev) => prev + emoji);
    setShowEmojiPicker(false);
  };

  const filteredConversations = conversations.filter((c) => {
    const name = `${c.other_user?.first_name || ''} ${c.other_user?.last_name || ''}`.toLowerCase();
    return name.includes(searchQuery.toLowerCase());
  });

  return (
    <div className="relative min-h-[calc(100vh-80px)] py-6 px-3 sm:px-6 lg:px-8 bg-[#fdfbf7] text-charcoal-900 font-sans overflow-hidden">
      {/* Ambient Lighting Glows */}
      <div className="absolute top-10 left-1/4 w-96 h-96 bg-gold-400/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-burgundy-600/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Main Messenger Panel */}
        <div className="bg-white border border-[#ece2d1] rounded-3xl shadow-lg overflow-hidden grid grid-cols-1 md:grid-cols-12 h-[calc(100vh-140px)] min-h-[600px]">

          {/* LEFT SIDEBAR: Conversations List */}
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
                    <p className="text-[10px] text-charcoal-500">Mutual Matched Members</p>
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
                  Loading matched conversations...
                </div>
              ) : filteredConversations.length === 0 ? (
                <div className="p-8 text-center space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-white border border-[#ece2d1] text-gold-700 flex items-center justify-center mx-auto text-xl shadow-xs">
                    💌
                  </div>
                  <p className="text-xs font-serif font-extrabold text-charcoal-900">No Mutual Matches Yet</p>
                  <p className="text-[11px] text-charcoal-500 leading-relaxed">
                    Direct chat activates when candidate interests are mutually accepted.
                  </p>
                  <Link
                    href="/discover"
                    className="inline-block px-4 py-2 rounded-xl bg-gradient-to-r from-burgundy-700 to-burgundy-800 hover:from-burgundy-600 hover:to-burgundy-700 text-white text-xs font-extrabold shadow-sm transition-all"
                  >
                    Browse Profiles ➔
                  </Link>
                </div>
              ) : (
                filteredConversations.map((conv) => {
                  const isSelected = activeUser?.id === conv.other_user?.id;
                  const photo = conv.other_user?.primary_photo;

                  return (
                    <button
                      key={conv.other_user?.id}
                      onClick={() => setActiveUser(conv.other_user)}
                      className={`w-full text-left p-3.5 flex items-center gap-3 transition-all relative ${
                        isSelected
                          ? 'bg-gradient-to-r from-burgundy-100/60 to-white border-l-4 border-burgundy-700'
                          : 'hover:bg-white/80'
                      }`}
                    >
                      {/* Avatar */}
                      <div className="relative w-11 h-11 rounded-2xl bg-white border border-[#ece2d1] overflow-hidden shrink-0 shadow-xs">
                        {photo ? (
                          <img
                            src={getPhotoUrl(photo) || DEFAULT_AVATAR_SVG}
                            alt="Avatar"
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.src = DEFAULT_AVATAR_SVG;
                            }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-burgundy-700 font-extrabold text-xs">
                            {conv.other_user?.first_name?.[0]}
                          </div>
                        )}
                        <span className="absolute bottom-0.5 right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
                      </div>

                      {/* Content */}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between mb-0.5">
                          <h4 className="text-xs font-serif font-extrabold text-charcoal-900 truncate">
                            {conv.other_user?.first_name} {conv.other_user?.last_name}
                          </h4>
                          <span className="text-[9px] text-charcoal-400 font-mono">
                            {conv.last_message_time ? new Date(conv.last_message_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
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

          {/* RIGHT CHAT WINDOW */}
          <div className="md:col-span-8 lg:col-span-8 flex flex-col bg-[#fdfbf7]">
            {activeUser ? (
              <>
                {/* Chat Top Bar */}
                <div className="p-3.5 sm:p-4 border-b border-[#ece2d1] flex items-center justify-between bg-white shadow-xs">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="relative w-10 h-10 rounded-xl bg-[#faf6ee] border border-[#ece2d1] overflow-hidden shrink-0 shadow-xs">
                      {activeUser.primary_photo ? (
                        <img
                          src={getPhotoUrl(activeUser.primary_photo) || DEFAULT_AVATAR_SVG}
                          alt="User"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = DEFAULT_AVATAR_SVG;
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-burgundy-700 font-bold text-xs">
                          {activeUser.first_name?.[0]}
                        </div>
                      )}
                      <span className="absolute bottom-0.5 right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
                    </div>

                    <div className="min-w-0">
                      <h3 className="text-xs sm:text-sm font-serif font-extrabold text-charcoal-900 truncate">
                        {activeUser.first_name} {activeUser.last_name}
                      </h3>
                      <div className="flex items-center gap-1.5 text-[10px]">
                        <span className="text-emerald-700 font-bold flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          Online
                        </span>
                        <span className="text-charcoal-300">•</span>
                        <span className="text-charcoal-500 font-medium">Verified Matrimonial Match</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions Header Buttons */}
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/profile/${activeUser.id}`}
                      className="px-3.5 py-1.5 rounded-xl bg-[#faf6ee] hover:bg-gold-50 text-burgundy-800 text-xs font-bold border border-[#ded0ba] transition-all flex items-center gap-1"
                    >
                      <span>View Bio</span>
                      <span>➔</span>
                    </Link>
                  </div>
                </div>

                {/* Messages Body */}
                <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-3.5 bg-[#fdfbf7] bg-[radial-gradient(#ded0ba_1px,transparent_1px)] [background-size:16px_16px]">
                  {messages.length === 0 ? (
                    <div className="max-w-md mx-auto my-12 p-6 rounded-3xl bg-white border border-[#ece2d1] text-center space-y-3 shadow-sm">
                      <div className="w-12 h-12 rounded-2xl bg-gold-50 text-gold-800 font-black flex items-center justify-center mx-auto text-xl border border-gold-200">
                        ✝
                      </div>
                      <h4 className="text-xs font-serif font-extrabold text-charcoal-900">Start Your Respectful Conversation</h4>
                      <p className="text-[11px] text-charcoal-600 leading-relaxed">
                        Say hello and introduce yourself to {activeUser.first_name}. All messages are confidential and respectful.
                      </p>
                    </div>
                  ) : (
                    messages.map((m, idx) => {
                      const isMe = m.is_me;
                      const timeStr = new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                      return (
                        <div
                          key={m.id || idx}
                          className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                        >
                          <div
                            className={`max-w-xs sm:max-w-md px-4 py-2.5 rounded-2xl text-xs leading-relaxed shadow-xs relative group ${
                              isMe
                                ? 'bg-gradient-to-r from-burgundy-700 to-burgundy-800 text-white font-medium rounded-br-xs shadow-burgundy-950/20'
                                : 'bg-white text-charcoal-900 border border-[#ece2d1] rounded-bl-xs'
                            }`}
                          >
                            <p className="whitespace-pre-wrap break-words">{m.message_text}</p>

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

                {/* EMOJI PICKER POPUP */}
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

                {/* BOTTOM INPUT BAR */}
                <form
                  onSubmit={handleSendMessage}
                  className="p-3 sm:p-4 border-t border-[#ece2d1] bg-white flex items-center gap-2 sm:gap-3"
                >
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
                      placeholder={`Write a message to ${activeUser.first_name}...`}
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
                    Choose a conversation from the left sidebar to start messaging your mutual match.
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
