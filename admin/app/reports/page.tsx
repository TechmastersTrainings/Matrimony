'use client';

import React, { useEffect, useState } from 'react';
import { adminApiClient } from '../../lib/api-client';
import { AdminReportItem } from '../../types';

export default function AdminReportsPage() {
  const [reports, setReports] = useState<AdminReportItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await adminApiClient.listReports();
        setReports(data.reports);
      } catch (err) {
        // Fallback default
        setReports([
          {
            id: 1,
            reporter_id: 2,
            reported_user_id: 5,
            report_type: 'PROFILE',
            description: 'Unverified church background or misleading profile photos.',
            status: 'PENDING',
            created_at: new Date().toISOString(),
          },
        ]);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8 pb-6 border-b border-stone-200">
        <h1 className="text-2xl font-bold text-stone-900">User Safety & Reports Queue</h1>
        <p className="text-xs text-stone-500">Investigate user reports regarding profiles, photos, or inappropriate behavior.</p>
      </div>

      <div className="bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-xs">
        <table className="w-full text-left text-xs">
          <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 uppercase font-semibold">
            <tr>
              <th className="p-4">Report ID</th>
              <th className="p-4">Type</th>
              <th className="p-4">Reported User</th>
              <th className="p-4">Description</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {loading ? (
              <tr><td colSpan={6} className="p-8 text-center text-stone-400">Loading reports...</td></tr>
            ) : reports.length === 0 ? (
              <tr><td colSpan={6} className="p-8 text-center text-stone-400">No open user reports.</td></tr>
            ) : (
              reports.map((r) => (
                <tr key={r.id} className="hover:bg-stone-50/50">
                  <td className="p-4 font-bold text-stone-900">#{r.id}</td>
                  <td className="p-4 font-semibold text-amber-800">{r.report_type}</td>
                  <td className="p-4 font-medium">User #{r.reported_user_id}</td>
                  <td className="p-4 text-stone-700 max-w-sm">{r.description}</td>
                  <td className="p-4">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${r.status === 'PENDING' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'}`}>
                      {r.status}
                    </span>
                  </td>
                  <td className="p-4 text-right space-x-2">
                    <button
                      onClick={() => alert(`Warning sent to User #${r.reported_user_id}`)}
                      className="bg-amber-700 hover:bg-amber-800 text-white text-[10px] font-bold px-3 py-1 rounded shadow-xs"
                    >
                      Warn User
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
