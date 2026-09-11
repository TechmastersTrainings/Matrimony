'use client';

import React, { useEffect, useState } from 'react';
import { adminApiClient } from '../../lib/api-client';
import { AdminUserItem } from '../../types';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUserItem[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const loadUsers = async () => {
    setLoading(true);
    try {
      const data = await adminApiClient.listUsers(search || undefined, statusFilter || undefined);
      setUsers(data.users);
    } catch (err: any) {
      showToast(`Failed to load users: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, [statusFilter]);

  const handleStatusChange = async (userId: number, newStatus: string) => {
    const reason = prompt(`Reason for setting User #${userId} to ${newStatus}:`, 'Admin compliance review');
    if (!reason) return;

    try {
      await adminApiClient.updateUserStatus(userId, newStatus, reason);
      showToast(`✓ User #${userId} status updated to ${newStatus}.`);
      await loadUsers();
    } catch (err: any) {
      showToast(`Error: ${err.message}`);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 text-[#1e1b18] font-sans">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 p-4 rounded-2xl bg-cyan-800 text-white font-bold text-xs shadow-2xl">
          {toastMessage}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8 pb-6 border-b border-charcoal-200/80">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-50 border border-cyan-200 text-cyan-950 text-xs font-bold uppercase tracking-wider shadow-2xs mb-2">
            <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
            <span>CovenantNest Directory</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight font-brand">
            User Account Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Search registered users, monitor verification statuses, and execute suspension or reactivations.
          </p>
        </div>

        {/* Search Bar & Filter */}
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && loadUsers()}
            placeholder="Search phone, email, name..."
            className="text-xs border border-slate-200 rounded-xl px-4 py-2.5 w-64 bg-white text-slate-900 focus:outline-none focus:border-cyan-600 shadow-2xs"
          />
          <button
            onClick={loadUsers}
            className="bg-cyan-700 hover:bg-cyan-600 text-white text-xs font-extrabold px-4 py-2.5 rounded-xl shadow-xs transition-all"
          >
            Search
          </button>
        </div>
      </div>

      {/* Status Pill Filters */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
        {['', 'ACTIVE', 'PENDING_VERIFICATION', 'SUSPENDED', 'BLOCKED'].map((st) => (
          <button
            key={st}
            onClick={() => setStatusFilter(st)}
            className={`text-xs font-bold px-3.5 py-1.5 rounded-xl border transition-all whitespace-nowrap ${
              statusFilter === st
                ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            {st ? st.replace(/_/g, ' ') : 'ALL USERS'}
          </button>
        ))}
      </div>

      {/* Users Table */}
      <div className="bg-white border border-[#ece2d1] rounded-3xl overflow-hidden shadow-sm">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#faf6ee] border-b border-[#ece2d1] text-slate-600 uppercase font-bold text-[10px] tracking-wider">
            <tr>
              <th className="p-4">Member Name</th>
              <th className="p-4">Contact (Phone / Email)</th>
              <th className="p-4">Role</th>
              <th className="p-4">Profile Status</th>
              <th className="p-4">Account Status</th>
              <th className="p-4 text-right">Moderation Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-slate-400 animate-pulse">Loading user records...</td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-12 text-center text-slate-500">No user accounts found matching your query.</td>
              </tr>
            ) : (
              users.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-4 font-bold text-slate-900">
                    {u.first_name ? `${u.first_name} ${u.last_name}` : `User #${u.id}`}
                    <span className="block text-[11px] text-slate-500 font-normal">
                      {u.denomination || 'Christian'} • {u.city || 'Karnataka'}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="font-mono font-bold text-cyan-900">+91 {u.mobile_number}</div>
                    <div className="text-[11px] text-slate-500">{u.email}</div>
                  </td>
                  <td className="p-4 font-bold text-slate-700">
                    <span className="bg-slate-100 px-2 py-0.5 rounded text-[11px] font-mono">
                      {u.role}
                    </span>
                  </td>
                  <td className="p-4">
                    <span
                      className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase border ${
                        u.profile_status === 'APPROVED'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : u.profile_status === 'REJECTED'
                          ? 'bg-rose-50 text-rose-800 border-rose-200'
                          : 'bg-cyan-50 text-cyan-800 border-cyan-200'
                      }`}
                    >
                      {u.profile_status}
                    </span>
                  </td>
                  <td className="p-4">
                    <span
                      className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase border ${
                        u.account_status === 'ACTIVE'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : u.account_status === 'BLOCKED' || u.account_status === 'SUSPENDED'
                          ? 'bg-rose-50 text-rose-800 border-rose-200'
                          : 'bg-amber-50 text-amber-800 border-amber-200'
                      }`}
                    >
                      {u.account_status}
                    </span>
                  </td>
                  <td className="p-4 text-right space-x-2">
                    {u.account_status !== 'ACTIVE' && (
                      <button
                        onClick={() => handleStatusChange(u.id, 'ACTIVE')}
                        className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold text-[11px] transition-all"
                      >
                        ✓ Reactivate
                      </button>
                    )}

                    {u.account_status !== 'SUSPENDED' && (
                      <button
                        onClick={() => handleStatusChange(u.id, 'SUSPENDED')}
                        className="px-2.5 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 font-bold text-[11px] transition-all"
                      >
                        ⏸ Suspend
                      </button>
                    )}

                    {u.account_status !== 'BLOCKED' && (
                      <button
                        onClick={() => handleStatusChange(u.id, 'BLOCKED')}
                        className="px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-900 border border-rose-300 font-bold text-[11px] transition-all"
                      >
                        🚫 Block
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
