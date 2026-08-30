'use client';

import React, { useEffect, useState } from 'react';
import { adminApiClient } from '../../lib/api-client';
import { AdminUserItem } from '../../types';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUserItem[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const data = await adminApiClient.listUsers(search || undefined, statusFilter || undefined);
      setUsers(data.users);
    } catch (err) {
      // Error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, [statusFilter]);

  const handleStatusChange = async (userId: number, newStatus: string) => {
    const reason = prompt(`Reason for changing account status to ${newStatus}:`, 'Admin operational review');
    if (!reason) return;

    try {
      await adminApiClient.updateUserStatus(userId, newStatus, reason);
      alert(`User status updated to ${newStatus}.`);
      await loadUsers();
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 pb-6 border-b border-stone-200">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">User Management</h1>
          <p className="text-xs text-stone-500">Search, filter, suspend, reactivate, or block platform accounts.</p>
        </div>

        {/* Search Bar */}
        <div className="flex gap-2 mt-4 md:mt-0">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search phone, email, name..."
            className="text-xs border border-stone-300 rounded-xl px-3.5 py-2 w-64 bg-white"
          />
          <button
            onClick={loadUsers}
            className="bg-stone-900 text-white text-xs font-semibold px-4 py-2 rounded-xl"
          >
            Search
          </button>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-xs">
        <table className="w-full text-left text-xs">
          <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 uppercase font-semibold">
            <tr>
              <th className="p-4">User</th>
              <th className="p-4">Mobile / Email</th>
              <th className="p-4">Role</th>
              <th className="p-4">Profile Status</th>
              <th className="p-4">Account Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {loading ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-stone-400">Loading user records...</td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-stone-400">No users found.</td>
              </tr>
            ) : (
              users.map((u) => (
                <tr key={u.id} className="hover:bg-stone-50/50">
                  <td className="p-4 font-bold text-stone-900">
                    {u.first_name ? `${u.first_name} ${u.last_name}` : `User #${u.id}`}
                  </td>
                  <td className="p-4 text-stone-600">
                    <div>{u.mobile_number}</div>
                    <div className="text-[11px] text-stone-400">{u.email}</div>
                  </td>
                  <td className="p-4 font-medium text-stone-700">{u.role}</td>
                  <td className="p-4">
                    <span className="bg-stone-100 text-stone-800 text-[10px] font-bold px-2 py-0.5 rounded">
                      {u.profile_status}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${u.account_status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-800' : u.account_status === 'SUSPENDED' ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'}`}>
                      {u.account_status}
                    </span>
                  </td>
                  <td className="p-4 text-right space-x-2">
                    {u.account_status === 'ACTIVE' ? (
                      <button
                        onClick={() => handleStatusChange(u.id, 'SUSPENDED')}
                        className="bg-amber-100 hover:bg-amber-200 text-amber-800 text-[10px] font-bold px-2.5 py-1 rounded"
                      >
                        Suspend
                      </button>
                    ) : (
                      <button
                        onClick={() => handleStatusChange(u.id, 'ACTIVE')}
                        className="bg-emerald-100 hover:bg-emerald-200 text-emerald-800 text-[10px] font-bold px-2.5 py-1 rounded"
                      >
                        Reactivate
                      </button>
                    )}
                    <button
                      onClick={() => handleStatusChange(u.id, 'BLOCKED')}
                      className="bg-red-100 hover:bg-red-200 text-red-800 text-[10px] font-bold px-2.5 py-1 rounded"
                    >
                      Block
                    </button>
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
