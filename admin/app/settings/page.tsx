'use client';

import React, { useEffect, useState } from 'react';
import { adminApiClient } from '../../lib/api-client';
import { PlatformSettingItem } from '../../types';

export default function AdminSettingsPage() {
  const [settingsList, setSettingsList] = useState<PlatformSettingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingKey, setSavingKey] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await adminApiClient.listSettings();
        setSettingsList(data.settings);
      } catch (err) {
        // Fallback defaults
        setSettingsList([
          {
            id: 1,
            key: 'supported_denominations',
            value: ['METHODIST', 'CSI', 'CATHOLIC', 'BAPTIST', 'PENTECOSTAL', 'PROTESTANT'],
            description: 'List of officially supported denominations in Bidar & Karnataka',
            category: 'MATRIMONY',
          },
          {
            id: 2,
            key: 'contact_reveal_fee_inr',
            value: 499,
            description: 'Base fee charged per user for mutual contact unlock',
            category: 'FINANCIAL',
          },
        ]);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleSave = async (key: string, value: any, desc?: string) => {
    setSavingKey(key);
    try {
      await adminApiClient.saveSetting(key, value, desc);
      alert(`Setting '${key}' saved successfully.`);
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    } finally {
      setSavingKey(null);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8 pb-6 border-b border-stone-200">
        <h1 className="text-2xl font-bold text-stone-900">Dynamic Platform Settings</h1>
        <p className="text-xs text-stone-500">Configure denominations, matching parameters, and pricing without code changes.</p>
      </div>

      <div className="space-y-6">
        {settingsList.map((s) => (
          <div key={s.id} className="bg-white border border-stone-200 rounded-2xl p-6 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-sm text-stone-900">{s.key}</h3>
              <span className="text-[10px] bg-stone-100 font-bold px-2 py-0.5 rounded text-stone-600">
                {s.category}
              </span>
            </div>
            <p className="text-xs text-stone-500 mb-4">{s.description}</p>

            <textarea
              defaultValue={typeof s.value === 'object' ? JSON.stringify(s.value, null, 2) : String(s.value)}
              id={`setting_${s.key}`}
              className="w-full text-xs font-mono p-3 rounded-xl border border-stone-300 bg-stone-50 mb-3"
              rows={typeof s.value === 'object' ? 4 : 2}
            />

            <button
              onClick={() => {
                const el = document.getElementById(`setting_${s.key}`) as HTMLTextAreaElement;
                let parsedVal = el.value;
                try {
                  parsedVal = JSON.parse(el.value);
                } catch {
                  // string
                }
                handleSave(s.key, parsedVal, s.description);
              }}
              disabled={savingKey === s.key}
              className="bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold px-4 py-2 rounded-xl"
            >
              {savingKey === s.key ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
