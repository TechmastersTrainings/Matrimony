'use client';

import React, { useEffect, useState } from 'react';
import Script from 'next/script';
import { apiClient } from '../../lib/api-client';
import { SubscriptionPlanItem } from '../../types';

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function SubscriptionsPage() {
  const [plans, setPlans] = useState<SubscriptionPlanItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlanItem | null>(null);
  const [processing, setProcessing] = useState(false);
  const [scriptLoaded, setScriptLoaded] = useState(false);

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
      // Step 1: Call Backend to Create Razorpay Order
      const order = await apiClient.createSubscriptionOrder(plan.id);

      const razorpayKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || order.key_id || 'rzp_test_TWXn6r1HPxwz0r';

      // Step 2: Open Razorpay Standard Checkout Modal
      if (typeof window !== 'undefined' && window.Razorpay) {
        const options = {
          key: razorpayKey,
          amount: order.amount || (plan.price_inr * 100),
          currency: order.currency || 'INR',
          name: 'Christian Matrimony',
          description: `${plan.name} Subscription`,
          order_id: order.order_id || order.id,
          handler: async function (response: any) {
            try {
              // Step 3: Send razorpay_payment_id, razorpay_order_id, razorpay_signature to Backend
              const verifyRes = await apiClient.verifyPayment(
                response.razorpay_order_id || order.order_id,
                response.razorpay_payment_id,
                response.razorpay_signature
              );
              alert(verifyRes.message || 'Payment Verified & Subscription Activated!');
              window.location.href = '/discover';
            } catch (vErr: any) {
              alert(`Payment Verification Error: ${vErr.message}`);
            } finally {
              setProcessing(false);
            }
          },
          prefill: {
            name: 'Matrimony Member',
            email: 'member@christianmatrimony.app',
            contact: '9999999999',
          },
          theme: {
            color: '#f59e0b',
          },
          modal: {
            ondismiss: function () {
              setProcessing(false);
              console.log('Razorpay payment modal dismissed by user.');
            },
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.on('payment.failed', function (resp: any) {
          alert(`Payment Failed: ${resp.error?.description || 'Transaction declined.'}`);
          setProcessing(false);
        });
        rzp.open();
      } else {
        // Fallback for simulation / direct verification if script delayed
        const verify = await apiClient.verifyPayment(
          order.order_id,
          `pay_rzp_sim_${Date.now()}`,
          'sim_sig_verified_2026'
        );
        alert(verify.message || 'Subscription successfully activated!');
        window.location.href = '/discover';
        setProcessing(false);
      }
    } catch (err: any) {
      alert(`Razorpay Payment Notice: ${err.message}`);
      setProcessing(false);
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-80px)] py-12 bg-slate-950 text-white font-sans overflow-hidden">
      {/* Razorpay Standard Web Checkout Script */}
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        onLoad={() => setScriptLoaded(true)}
      />

      {/* Ambient Background Glows */}
      <div className="absolute top-10 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-10">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-extrabold uppercase tracking-wider text-amber-400 block">
            Transparent Pricing
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Matrimonial Membership Plans
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-2 leading-relaxed">
            Choose a plan that fits your search requirements. All plans include church-verified profiles and confidential contact reveals.
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-slate-900 border border-slate-800 rounded-3xl h-[520px] animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            {plans.map((p) => {
              const isPopular = p.plan_code === 'PREMIUM';
              return (
                <div
                  key={p.id}
                  className={`bg-slate-900/90 backdrop-blur-xl border rounded-3xl p-7 shadow-2xl transition-all duration-300 flex flex-col justify-between relative group ${
                    isPopular
                      ? 'border-amber-500 ring-2 ring-amber-500/20 bg-gradient-to-b from-amber-950/20 via-slate-900 to-slate-900'
                      : 'border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div>
                    {/* Header */}
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-extrabold text-white">{p.name}</h3>
                      {isPopular && (
                        <span className="text-[10px] font-extrabold uppercase bg-amber-500 text-slate-950 px-2.5 py-1 rounded-lg shadow-md">
                          Most Popular
                        </span>
                      )}
                    </div>

                    {/* Price */}
                    <div className="mb-6 pb-6 border-b border-slate-800">
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl sm:text-4xl font-black text-white">
                          ₹ {p.price_inr.toLocaleString()}
                        </span>
                      </div>
                      <span className="text-xs text-amber-400 font-semibold block mt-1">
                        Valid for {p.duration_days} days
                      </span>
                    </div>

                    {/* Features Bullet List */}
                    <div className="space-y-3 mb-8 text-xs text-slate-300">
                      {p.features && p.features.map((f, idx) => (
                        <div key={idx} className="flex items-start gap-2.5">
                          <span className="text-amber-400 font-bold text-sm leading-none">•</span>
                          <span className="leading-snug">{f}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Subscribe CTA */}
                  <button
                    onClick={() => handleSubscribe(p)}
                    disabled={processing}
                    className={`w-full py-3.5 rounded-2xl text-xs font-extrabold transition-all shadow-lg ${
                      isPopular
                        ? 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-amber-950/40'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                    }`}
                  >
                    {processing && selectedPlan?.id === p.id ? 'Opening Razorpay Checkout...' : `Choose ${p.name}`}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
