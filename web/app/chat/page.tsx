'use client';

import React, { useEffect, useState } from 'react';
import { apiClient } from '../../lib/api-client';
import { ChatMessageItem } from '../../types';

export default function ChatPage() {
  const [conversations, setConversations] = useState<any[]>([]);
  const [activeUser, setActiveUser] = useState<any>(null);
  const [messages, setMessages] = useState<ChatMessageItem[]>([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(true);

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
      } catch (err: any) {
        console.error('Failed to load chat history', err);
      }
    }
    loadChat();
  }, [activeUser]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activeUser) return;
    try {
      const msg = await apiClient.sendMessage(activeUser.id, inputText.trim());
      setMessages((prev) => [...prev, msg]);
      setInputText('');
    } catch (err: any) {
      alert(`Could not send message: ${err.message}`);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[600px]">
          {/* Left Sidebar: Conversations */}
          <div className="md:col-span-4 border-r border-slate-200 flex flex-col">
            <div className="p-4 border-b border-slate-200 bg-slate-50">
              <h2 className="text-sm font-bold text-slate-900">
                Matched Member Messages
              </h2>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Chat is enabled only between mutual matrimonial matches.
              </p>
            </div>

            <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
              {loading ? (
                <div className="p-4 text-xs text-slate-400">Loading conversations...</div>
              ) : conversations.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-500">
                  <p className="font-semibold text-slate-800">No active conversations</p>
                  <p className="mt-1 text-[11px]">Accept an interest or send an interest to start messaging.</p>
                </div>
              ) : (
                conversations.map((conv) => (
                  <button
                    key={conv.other_user?.id}
                    onClick={() => setActiveUser(conv.other_user)}
                    className={`w-full text-left p-4 flex items-center gap-3 transition-colors ${
                      activeUser?.id === conv.other_user?.id
                        ? 'bg-blue-50/70 border-l-4 border-blue-700'
                        : 'hover:bg-slate-50'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden shrink-0">
                      {conv.other_user?.primary_photo ? (
                        <img
                          src={conv.other_user.primary_photo}
                          alt="avatar"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-500 text-xs font-bold">
                          {conv.other_user?.first_name?.[0]}
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="text-xs font-bold text-slate-900 truncate">
                        {conv.other_user?.first_name} {conv.other_user?.last_name}
                      </h4>
                      <p className="text-[11px] text-slate-500 truncate mt-0.5">
                        {conv.last_message || 'Conversation active'}
                      </p>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Right Area: Active Chat Window */}
          <div className="md:col-span-8 flex flex-col bg-white">
            {activeUser ? (
              <>
                {/* Chat Top Bar */}
                <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-900 font-bold flex items-center justify-center text-xs">
                      {activeUser.first_name?.[0]}
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-slate-900">
                        {activeUser.first_name} {activeUser.last_name}
                      </h3>
                      <span className="text-[10px] text-emerald-600 font-semibold block">
                        Verified Mutual Match
                      </span>
                    </div>
                  </div>
                </div>

                {/* Messages Body */}
                <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-slate-50/50">
                  {messages.length === 0 ? (
                    <div className="text-center py-16 text-xs text-slate-400">
                      No messages yet. Send a respectful greeting to begin your conversation.
                    </div>
                  ) : (
                    messages.map((m) => (
                      <div
                        key={m.id}
                        className={`flex flex-col ${m.is_me ? 'items-end' : 'items-start'}`}
                      >
                        <div
                          className={`max-w-md px-4 py-2.5 rounded-xl text-xs leading-relaxed ${
                            m.is_me
                              ? 'bg-blue-700 text-white rounded-br-none'
                              : 'bg-white border border-slate-200 text-slate-800 rounded-bl-none shadow-2xs'
                          }`}
                        >
                          {m.message_text}
                        </div>
                        <span className="text-[9px] text-slate-400 mt-1">
                          {new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    ))
                  )}
                </div>

                {/* Input Area */}
                <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-200 bg-white flex gap-3">
                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 text-xs border border-slate-300 rounded-lg px-4 py-2.5 focus:outline-none focus:border-blue-600"
                  />
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-lg bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold transition-all shadow-xs"
                  >
                    Send
                  </button>
                </form>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-xs text-slate-400 p-8 text-center">
                Select a mutual match to open the conversation window.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
