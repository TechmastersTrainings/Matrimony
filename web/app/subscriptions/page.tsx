'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { apiClient } from '../../lib/api-client';
import { SubscriptionPlanItem } from '../../types';

export default function SubscriptionsPage() {
  const [plans, setPlans] = useState<SubscriptionPlanItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState<number | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await apiClient.getPlans();
        setPlans(data);
      } catch (err) {
        // Fallback default plans
        setPlans([
          {
            id: 1,
            plan_code: 'FREE',
            name: 'Free Membership',
            price_inr: 0,
            duration_days: 365,
            contact_reveals_limit: 0,
            features: ['Browse verified profiles', 'Receive matching requests', '5 Photo uploads'],
          },
          {
            id: 2,
            plan_code: 'STANDARD',
            name: 'Standard Christian Plan',
            price_inr: 1499,
            duration_days: 90,
            contact_reveals_limit: 15,
            features: ['Send unlimited interests', '15 Direct contact reveals', 'Priority Christian matching', 'Bidar Parish support'],
          },
          {
            id: 3,
            plan_code: 'PREMIUM',
            name: 'Premium Blessed Matrimony',
            price_inr: 2999,
            duration_days: 180,
            contact_reveals_limit: 40,
            features: ['Unlimited direct messaging', '40 Contact reveals', 'Featured profile placement', 'Personal relationship manager'],
          },
        ]);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleSubscribe = async (plan: SubscriptionPlanItem) => {
    if (plan.price_inr === 0) {
      alert('You are already enrolled in Free Membership.');
      return;
    }

    setPaying(plan.id);
    try {
      const order = await apiClient.createSubscriptionOrder(plan.id);
      // Simulate successful UPI Gateway Callback
      await apiClient.verifyPayment(order.order_id, `pay_mock_${Date.now()}`, 'sig_mock_verified');
      alert(`🎉 Congratulations! You have successfully upgraded to ${plan.name}.`);
    } catch (err: any) {
      alert(`Payment error: ${err.message}`);
    } finally {
      setPaying(null);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="text-center max-w-xl mx-auto mb-12">
        <span className="text-xs font-bold text-amber-700 uppercase tracking-widest">Blessed Matrimony Membership</span>
        <h1 className="text-3xl font-extrabold text-stone-900 mt-2">Transparent, Faithful Plans</h1>
        <p className="text-sm text-stone-600 mt-2">
          Connect directly with verified Christian families across Bidar and Karnataka.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan) => {
          const isFeatured = plan.plan_code === 'STANDARD';
          return (
            <div
              key={plan.id}
              className={`rounded-3xl p-8 flex flex-col justify-between transition-all ${isFeatured ? 'bg-stone-900 text-white shadow-xl scale-105 border-2 border-amber-600 relative' : 'bg-white border border-stone-200 shadow-sm text-stone-900'}`}
            >
              {isFeatured && (
                <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-amber-600 text-white text-[10px] uppercase font-bold tracking-widest px-3 py-1 rounded-full shadow">
                  Most Popular
                </span>
              )}

              <div>
                <h3 className="text-lg font-bold">{plan.name}</h3>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-3xl font-extrabold">₹{plan.price_inr}</span>
                  <span className={`text-xs ${isFeatured ? 'text-stone-400' : 'text-stone-500'}`}>
                    / {plan.duration_days} days
                  </span>
                </div>
                <p className={`text-xs mt-2 ${isFeatured ? 'text-stone-300' : 'text-stone-600'}`}>
                  Includes {plan.contact_reveals_limit} verified phone & email reveals.
                </p>

                <div className="my-6 border-t border-stone-200/20 pt-6">
                  <ul className="space-y-3 text-xs">
                    {plan.features.map((f, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <span className="text-amber-500 font-bold">✓</span>
                        <span className={isFeatured ? 'text-stone-200' : 'text-stone-700'}>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <button
                onClick={() => handleSubscribe(plan)}
                disabled={paying === plan.id}
                className={`w-full py-3 rounded-xl text-xs font-bold transition-colors shadow-xs ${isFeatured ? 'bg-amber-600 hover:bg-amber-500 text-white' : 'bg-stone-900 hover:bg-stone-800 text-white'}`}
              >
                {paying === plan.id ? 'Processing UPI...' : plan.price_inr === 0 ? 'Current Plan' : `Upgrade for ₹${plan.price_inr}`}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
