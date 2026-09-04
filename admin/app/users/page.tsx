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
    <div className="max-w-7xl mx-auto px-4 py-8 text-white">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 p-4 rounded-2xl bg-amber-500 text-slate-950 font-bold text-xs shadow-2xl animate-bounce">
          {toastMessage}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8 pb-6 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-extrabold text-white">User &amp; Account Management</h1>
          <p className="text-xs text-slate-400">Search, monitor activity, suspend, reactivate, or block platform accounts.</p>
        </div>

        {/* Search Bar & Filter */}
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && loadUsers()}
            placeholder="Search phone, email, name..."
            className="text-xs border border-slate-800 rounded-xl px-3.5 py-2.5 w-64 bg-slate-900 text-white focus:outline-none focus:border-amber-400"
          />
          <button
            onClick={loadUsers}
            className="bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-extrabold px-4 py-2.5 rounded-xl shadow-md transition-all"
          >
            Search
          </button>
        </div>
      </div>

      {/* Status Pill Filters */}
      <div className="flex gap-2 mb-6">
        {['', 'ACTIVE', 'PENDING_VERIFICATION', 'SUSPENDED', 'BLOCKED'].map((st) => (
          <button
            key={st}
            onClick={() => setStatusFilter(st)}
            className={`text-xs font-bold px-3 py-1.5 rounded-xl border transition-colors ${
              statusFilter === st
                ? 'bg-amber-500 text-slate-950 border-amber-400'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
            }`}
          >
            {st ? st.replace('_', ' ') : 'ALL USERS'}
          </button>
        ))}
      </div>

      {/* Users Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-950 border-b border-slate-800 text-slate-400 uppercase font-bold text-[10px] tracking-wider">
            <tr>
              <th className="p-4">Member Name</th>
              <th className="p-4">Contact (Phone / Email)</th>
              <th className="p-4">Role</th>
              <th className="p-4">Profile Status</th>
              <th className="p-4">Account Status</th>
              <th className="p-4 text-right">Moderation Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80">
            {loading ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-slate-500 animate-pulse">Loading user records...</td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-12 text-center text-slate-500">No user accounts found matching your query.</td>
              </tr>
            ) : (
              users.map((u) => (
                <tr key={u.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-4 font-bold text-white">
                    {u.first_name ? `${u.first_name} ${u.last_name}` : `User #${u.id}`}
                    <span className="block text-[11px] text-slate-400 font-normal">
                      {u.denomination || 'Christian'} • {u.city || 'Karnataka'}
                    </span>
                  </td>
                  <td className="p-4 text-slate-300">
                    <div className="font-mono text-amber-400">{u.mobile_number}</div>
                    <div className="text-[11px] text-slate-400">{u.email}</div>
                  </td>
                  <td className="p-4 font-bold text-slate-300">{u.role}</td>
                  <td className="p-4">
                    <span
                      className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase ${
                        u.profile_status === 'APPROVED'
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          : u.profile_status === 'REJECTED'
                          ? 'bg-red-950 text-red-300 border border-red-800'
                          : 'bg-blue-950 text-blue-300 border border-blue-800'
                      }`}
                    >
                      {u.profile_status}
                    </span>
                  </td>
                  <td className="p-4">
                    <span
                      className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase ${
                        u.account_status === 'ACTIVE'
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          : u.account_status === 'BLOCKED' || u.account_status === 'SUSPENDED'
                          ? 'bg-red-950 text-red-300 border border-red-800'
                          : 'bg-amber-950 text-amber-300 border border-amber-800'
                      }`}
                    >
                      {u.account_status}
                    </span>
                  </td>
                  <td className="p-4 text-right space-x-2">
                    {u.account_status !== 'ACTIVE' && (
                      <button
                        onClick={() => handleStatusChange(u.id, 'ACTIVE')}
                        className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] shadow-sm transition-all"
                      >
                        ✓ Reactivate
                      </button>
                    )}

                    {u.account_status !== 'SUSPENDED' && (
                      <button
                        onClick={() => handleStatusChange(u.id, 'SUSPENDED')}
                        className="px-2.5 py-1 rounded-lg bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold text-[11px] shadow-sm transition-all"
                      >
                        ⏸ Suspend
                      </button>
                    )}

                    {u.account_status !== 'BLOCKED' && (
                      <button
                        onClick={() => handleStatusChange(u.id, 'BLOCKED')}
                        className="px-2.5 py-1 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold text-[11px] shadow-sm transition-all"
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
