'use client';

import React, { useEffect, useState } from 'react';
import { apiClient } from '../../lib/api-client';
import { SubscriptionPlanItem } from '../../types';

export default function SubscriptionsPage() {
  const [plans, setPlans] = useState<SubscriptionPlanItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlanItem | null>(null);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    async function loadPlans() {
      try {
        const data = await apiClient.getPlans();
        setPlans(data || []);
      } catch (err: any) {
        console.error('Failed to load plans', err);
      } finally {
        setLoading(false);
      }
    }
    loadPlans();
  }, []);

  const handleSubscribe = async (plan: SubscriptionPlanItem) => {
    setSelectedPlan(plan);
    setProcessing(true);
    try {
      const order = await apiClient.createSubscriptionOrder(plan.id);
      // Simulate verified UPI payment verification
      const verify = await apiClient.verifyPayment(
        order.order_id,
        `pay_sim_${Date.now()}`,
        'sim_sig_verified_2026'
      );
      alert(verify.message || 'Subscription successfully activated!');
    } catch (err: any) {
      alert(`Payment Notice: ${err.message}`);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-700 block mb-1">
            Transparent Pricing
          </span>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
            Matrimonial Membership Plans
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-2">
            Choose a plan that fits your search requirements. All plans include church-verified profiles and confidential contact reveals.
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white border border-slate-200 rounded-2xl h-96 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((p) => (
              <div
                key={p.id}
                className={`bg-white border rounded-2xl p-7 shadow-xs hover:shadow-md transition-all flex flex-col justify-between ${
                  p.plan_code === 'PREMIUM'
                    ? 'border-blue-600 ring-2 ring-blue-600/10'
                    : 'border-slate-200'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-slate-900">{p.name}</h3>
                    {p.plan_code === 'PREMIUM' && (
                      <span className="text-[10px] font-bold uppercase bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded-md">
                        Most Popular
                      </span>
                    )}
                  </div>

                  <div className="mb-6 pb-6 border-b border-slate-100">
                    <span className="text-3xl font-extrabold text-slate-900">
                      ₹ {p.price_inr.toLocaleString()}
                    </span>
                    <span className="text-xs text-slate-500 block mt-1">
                      Valid for {p.duration_days} days
                    </span>
                  </div>

                  <div className="space-y-3 mb-8 text-xs text-slate-700">
                    <div className="flex items-center gap-2">
                      <span className="text-blue-700 font-bold">•</span>
                      <span>{p.contact_reveals_limit} Contact Phone/Email Reveals</span>
                    </div>
                    {p.features && p.features.map((f, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <span className="text-blue-700 font-bold">•</span>
                        <span>{f}</span>
                      </div>
                    ))}
                    <div className="flex items-center gap-2">
                      <span className="text-blue-700 font-bold">•</span>
                      <span>Unlimited In-App Messaging with Matches</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-blue-700 font-bold">•</span>
                      <span>Verified Profile Badge</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleSubscribe(p)}
                  disabled={processing}
                  className={`w-full py-2.5 rounded-lg text-xs font-semibold transition-all shadow-xs ${
                    p.plan_code === 'PREMIUM'
                      ? 'bg-blue-700 hover:bg-blue-800 text-white'
                      : 'bg-slate-900 hover:bg-slate-800 text-white'
                  }`}
                >
                  {processing && selectedPlan?.id === p.id ? 'Processing Order...' : `Choose ${p.name}`}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
