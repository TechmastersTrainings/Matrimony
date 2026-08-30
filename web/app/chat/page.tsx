'use client';

import React, { useEffect, useState } from 'react';
import { apiClient } from '../../lib/api-client';
import { ChatMessageItem } from '../../types';

export default function ChatPage() {
  const [conversations, setConversations] = useState<any[]>([]);
  const [activePartner, setActivePartner] = useState<any | null>(null);
  const [messages, setMessages] = useState<ChatMessageItem[]>([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    async function loadConversations() {
      try {
        const convs = await apiClient.getConversations();
        setConversations(convs);
        if (convs.length > 0) {
          setActivePartner(convs[0]);
        }
      } catch (err) {
        // Not logged in / empty
      } finally {
        setLoading(false);
      }
    }
    loadConversations();
  }, []);

  useEffect(() => {
    if (!activePartner) return;
    async function loadMessages() {
      try {
        const msgs = await apiClient.getChatHistory(activePartner.other_user_id);
        setMessages(msgs);
      } catch (err) {
        // Error
      }
    }
    loadMessages();
    const interval = setInterval(loadMessages, 5000); // 5s poll
    return () => clearInterval(interval);
  }, [activePartner]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activePartner || sending) return;

    setSending(true);
    try {
      const newMsg = await apiClient.sendMessage(activePartner.other_user_id, inputText.trim());
      setMessages((prev) => [...prev, newMsg]);
      setInputText('');
    } catch (err: any) {
      alert(`Could not send message: ${err.message}`);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="bg-white border border-stone-200 rounded-3xl overflow-hidden shadow-sm flex h-[650px]">
        {/* Left: Conversations list */}
        <div className="w-80 border-r border-stone-200 flex flex-col bg-stone-50/50">
          <div className="p-4 border-b border-stone-200 bg-white">
            <h2 className="font-bold text-stone-900 text-base">Messages</h2>
            <p className="text-[11px] text-stone-500">Mutual Christian Matches</p>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-stone-100">
            {loading ? (
              <div className="p-4 text-center text-xs text-stone-500">Loading matches...</div>
            ) : conversations.length === 0 ? (
              <div className="p-6 text-center text-xs text-stone-500">
                No active conversations yet. Match with a candidate to start chatting!
              </div>
            ) : (
              conversations.map((c) => (
                <button
                  key={c.other_user_id}
                  onClick={() => setActivePartner(c)}
                  className={`w-full text-left p-3.5 flex items-center gap-3 transition-colors ${activePartner?.other_user_id === c.other_user_id ? 'bg-amber-50/80 border-l-4 border-amber-700' : 'hover:bg-stone-100/60'}`}
                >
                  <div className="w-10 h-10 rounded-full bg-stone-200 overflow-hidden shrink-0">
                    <img
                      src={c.primary_photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80'}
                      alt={c.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-xs text-stone-900 truncate">{c.name}</h4>
                      {c.unread_count > 0 && (
                        <span className="bg-amber-700 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                          {c.unread_count}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-stone-500 truncate mt-0.5">
                      {c.last_message || `Matched via ${c.denomination}`}
                    </p>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Right: Active Chat Area */}
        <div className="flex-1 flex flex-col bg-white">
          {activePartner ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-stone-200 flex items-center justify-between bg-stone-50/30">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-stone-200 overflow-hidden">
                    <img
                      src={activePartner.primary_photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80'}
                      alt={activePartner.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-stone-900">{activePartner.name}</h3>
                    <p className="text-[10px] text-emerald-700 font-medium">Verified Believer • {activePartner.denomination}</p>
                  </div>
                </div>
              </div>

              {/* Messages History */}
              <div className="flex-1 p-6 overflow-y-auto space-y-3 bg-stone-50/30">
                {messages.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-xs text-stone-400">
                    Say Praise the Lord to start the conversation!
                  </div>
                ) : (
                  messages.map((m) => (
                    <div key={m.id} className={`flex ${m.is_me ? 'justify-end' : 'justify-start'}`}>
                      <div
                        className={`max-w-md px-4 py-2.5 rounded-2xl text-xs leading-relaxed ${m.is_me ? 'bg-amber-700 text-white rounded-br-none' : 'bg-white border border-stone-200 text-stone-800 rounded-bl-none shadow-2xs'}`}
                      >
                        {m.message_text}
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Message Input */}
              <form onSubmit={handleSend} className="p-3 border-t border-stone-200 flex gap-2 bg-white">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Type a faith-centered message..."
                  className="flex-1 text-xs rounded-xl border border-stone-300 px-4 py-2.5 bg-stone-50 focus:outline-hidden focus:border-amber-700"
                />
                <button
                  type="submit"
                  disabled={sending || !inputText.trim()}
                  className="bg-amber-700 hover:bg-amber-800 disabled:opacity-50 text-white text-xs font-semibold px-5 py-2.5 rounded-xl shadow-xs"
                >
                  Send
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-xs text-stone-400">
              Select a matched conversation from the left to start chatting.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
