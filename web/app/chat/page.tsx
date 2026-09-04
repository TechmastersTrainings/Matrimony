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
    <div className="relative min-h-[calc(100vh-80px)] py-6 px-3 sm:px-6 lg:px-8 bg-slate-950 text-white font-sans overflow-hidden">
      {/* Ambient Lighting Glows */}
      <div className="absolute top-10 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Main Messenger Glass Panel */}
        <div className="bg-slate-900/90 backdrop-blur-2xl border border-slate-800 rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-12 h-[calc(100vh-140px)] min-h-[600px]">

          {/* LEFT SIDEBAR: Conversations List */}
          <div className="md:col-span-4 lg:col-span-4 border-r border-slate-800/80 flex flex-col bg-slate-950/60">
            {/* Sidebar Header */}
            <div className="p-4 border-b border-slate-800/80 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black flex items-center justify-center text-xs shadow-md">
                    💬
                  </div>
                  <div>
                    <h2 className="text-sm font-extrabold text-white">Matrimonial Messages</h2>
                    <p className="text-[10px] text-slate-400">Mutual Matched Members</p>
                  </div>
                </div>
                <span className="bg-slate-900 border border-slate-800 text-amber-400 font-mono text-[10px] font-bold px-2 py-0.5 rounded-full">
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
                  className="w-full text-xs bg-slate-900/90 border border-slate-800 rounded-xl pl-8 pr-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 transition-all"
                />
                <span className="absolute left-2.5 top-2.5 text-slate-500 text-xs">🔍</span>
              </div>
            </div>

            {/* Conversations Scroll Area */}
            <div className="flex-1 overflow-y-auto divide-y divide-slate-800/40">
              {loading ? (
                <div className="p-8 text-center text-xs text-slate-400 animate-pulse">
                  Loading matched conversations...
                </div>
              ) : filteredConversations.length === 0 ? (
                <div className="p-8 text-center space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 text-amber-400 flex items-center justify-center mx-auto text-xl">
                    💌
                  </div>
                  <p className="text-xs font-bold text-white">No Mutual Matches Yet</p>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Direct chat activates when candidate interests are mutually accepted.
                  </p>
                  <Link
                    href="/discover"
                    className="inline-block px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-extrabold shadow-md transition-all"
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
                          ? 'bg-gradient-to-r from-amber-500/15 via-slate-900 to-slate-900 border-l-4 border-amber-400'
                          : 'hover:bg-slate-900/60'
                      }`}
                    >
                      {/* Avatar */}
                      <div className="relative w-11 h-11 rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shrink-0">
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
                          <div className="w-full h-full flex items-center justify-center text-amber-400 font-extrabold text-xs">
                            {conv.other_user?.first_name?.[0]}
                          </div>
                        )}
                        <span className="absolute bottom-0.5 right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-slate-950" />
                      </div>

                      {/* Content */}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between mb-0.5">
                          <h4 className="text-xs font-extrabold text-white truncate">
                            {conv.other_user?.first_name} {conv.other_user?.last_name}
                          </h4>
                          <span className="text-[9px] text-slate-500 font-mono">
                            {conv.last_message_time ? new Date(conv.last_message_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 truncate">
                          {conv.last_message || 'Mutual Match Active'}
                        </p>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* RIGHT CHAT WINDOW (WhatsApp / Telegram Styled) */}
          <div className="md:col-span-8 lg:col-span-8 flex flex-col bg-slate-900/50">
            {activeUser ? (
              <>
                {/* Chat Top Bar */}
                <div className="p-3.5 sm:p-4 border-b border-slate-800/80 flex items-center justify-between bg-slate-950/80 backdrop-blur-md">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="relative w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 overflow-hidden shrink-0">
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
                        <div className="w-full h-full flex items-center justify-center text-amber-400 font-bold text-xs">
                          {activeUser.first_name?.[0]}
                        </div>
                      )}
                      <span className="absolute bottom-0.5 right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-slate-950" />
                    </div>

                    <div className="min-w-0">
                      <h3 className="text-xs sm:text-sm font-extrabold text-white truncate">
                        {activeUser.first_name} {activeUser.last_name}
                      </h3>
                      <div className="flex items-center gap-1.5 text-[10px]">
                        <span className="text-emerald-400 font-bold flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          Online
                        </span>
                        <span className="text-slate-600">•</span>
                        <span className="text-slate-400">Verified Matrimonial Match</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions Header Buttons */}
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/profile/${activeUser.id}`}
                      className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 text-xs font-bold border border-slate-700 transition-all flex items-center gap-1"
                    >
                      <span>View Bio</span>
                      <span>➔</span>
                    </Link>
                  </div>
                </div>

                {/* Messages Body */}
                <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-3.5 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px]">
                  {messages.length === 0 ? (
                    <div className="max-w-md mx-auto my-12 p-6 rounded-3xl bg-slate-950/80 border border-slate-800 text-center space-y-3 shadow-xl">
                      <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 font-black flex items-center justify-center mx-auto text-xl border border-amber-500/30">
                        ✝️
                      </div>
                      <h4 className="text-xs font-extrabold text-white">Start Your Respectful Conversation</h4>
                      <p className="text-[11px] text-slate-400 leading-relaxed">
                        Say hello and introduce yourself to {activeUser.first_name}. All messages are confidential and encrypted.
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
                            className={`max-w-xs sm:max-w-md px-4 py-2.5 rounded-2xl text-xs leading-relaxed shadow-lg relative group ${
                              isMe
                                ? 'bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 text-slate-950 font-medium rounded-br-xs shadow-amber-950/30'
                                : 'bg-slate-800 text-slate-100 border border-slate-700/80 rounded-bl-xs shadow-slate-950/40'
                            }`}
                          >
                            <p className="whitespace-pre-wrap break-words">{m.message_text}</p>

                            <div
                              className={`flex items-center justify-end gap-1 mt-1 text-[9px] ${
                                isMe ? 'text-slate-900/80 font-bold' : 'text-slate-400'
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
                  <div className="px-4 py-2 bg-slate-950 border-t border-slate-800 flex items-center gap-2 overflow-x-auto">
                    {sampleEmojis.map((emoji, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => handleEmojiClick(emoji)}
                        className="text-base p-1.5 rounded-xl hover:bg-slate-800 transition-colors"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                )}

                {/* BOTTOM INPUT BAR */}
                <form
                  onSubmit={handleSendMessage}
                  className="p-3 sm:p-4 border-t border-slate-800/80 bg-slate-950/90 backdrop-blur-md flex items-center gap-2 sm:gap-3"
                >
                  {/* Emoji Button */}
                  <button
                    type="button"
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-400 border border-slate-800 text-sm transition-all shrink-0"
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
                      className="w-full text-xs font-medium bg-slate-900 border border-slate-800 rounded-2xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 transition-all"
                    />
                  </div>

                  {/* PROMINENT GRADIENT SEND BUTTON */}
                  <button
                    type="submit"
                    disabled={sending || !inputText.trim()}
                    className={`px-5 sm:px-6 py-3 rounded-2xl text-xs font-extrabold transition-all shadow-xl flex items-center gap-2 shrink-0 ${
                      inputText.trim()
                        ? 'bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-amber-950/50 transform hover:-translate-y-0.5'
                        : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
                    }`}
                  >
                    <span>{sending ? 'Sending...' : 'Send'}</span>
                    <span className="text-sm">➤</span>
                  </button>
                </form>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-4">
                <div className="w-16 h-16 rounded-3xl bg-slate-900 border border-slate-800 text-amber-400 font-black flex items-center justify-center text-2xl shadow-xl">
                  💬
                </div>
                <div className="space-y-1 max-w-sm">
                  <h3 className="text-sm font-extrabold text-white">Select a Matrimonial Match</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
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
