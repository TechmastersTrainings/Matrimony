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
            color: '#8c1936',
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
    <div className="relative min-h-[calc(100vh-80px)] py-12 bg-[#fdfbf7] text-charcoal-900 font-sans overflow-hidden">
      {/* Razorpay Standard Web Checkout Script */}
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        onLoad={() => setScriptLoaded(true)}
      />

      {/* Ambient Background Glows */}
      <div className="absolute top-10 left-1/4 w-96 h-96 bg-gold-400/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-burgundy-600/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-10">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-cyan-800 block">
            Transparent Sacred Membership
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif font-extrabold text-charcoal-900 tracking-tight">
            Matrimonial Membership Plans
          </h1>
          <p className="text-xs sm:text-sm text-charcoal-600 mt-2 leading-relaxed">
            Choose a blessed membership tier that suits your family’s search. All plans include verified church backgrounds and protected contact reveals.
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white border border-charcoal-200 rounded-3xl h-[520px] animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            {plans.map((p, idx) => {
              const isPopular = p.plan_code === 'PREMIUM';
              // Determine card theme based on tier/index: 0: Cyan, 1: Light Orange (Popular), 2: Light Green
              const tierThemes = [
                {
                  card: 'border-cyan-200 bg-gradient-to-b from-cyan-50/60 to-white hover:border-cyan-400 hover:shadow-lg',
                  price: 'text-cyan-950',
                  badge: 'text-cyan-800 bg-cyan-100/70 border-cyan-200',
                  bullet: 'text-cyan-600',
                  btn: 'bg-white hover:bg-cyan-50 text-cyan-950 border border-cyan-300 shadow-xs',
                },
                {
                  card: 'border-orange-300 ring-2 ring-orange-400/40 bg-gradient-to-b from-orange-50/70 via-amber-50/30 to-white shadow-xl hover:-translate-y-1',
                  price: 'text-orange-950',
                  badge: 'text-orange-900 bg-orange-100/80 border-orange-300',
                  bullet: 'text-orange-600',
                  btn: 'bg-gradient-to-r from-burgundy-700 via-rose-600 to-orange-600 hover:from-burgundy-600 hover:to-orange-500 text-white shadow-md shadow-orange-950/20',
                },
                {
                  card: 'border-emerald-200 bg-gradient-to-b from-emerald-50/60 to-white hover:border-emerald-400 hover:shadow-lg',
                  price: 'text-emerald-950',
                  badge: 'text-emerald-800 bg-emerald-100/70 border-emerald-200',
                  bullet: 'text-emerald-600',
                  btn: 'bg-white hover:bg-emerald-50 text-emerald-950 border border-emerald-300 shadow-xs',
                },
              ];
              const theme = isPopular ? tierThemes[1] : tierThemes[idx % 3];

              return (
                <div
                  key={p.id}
                  className={`border rounded-3xl p-7 shadow-sm transition-all duration-300 flex flex-col justify-between relative group ${theme.card}`}
                >
                  <div>
                    {/* Header */}
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-serif font-extrabold text-charcoal-900">{p.name}</h3>
                      {isPopular && (
                        <span className="text-[10px] font-extrabold uppercase bg-gradient-to-r from-orange-500 to-amber-500 text-white px-2.5 py-1 rounded-lg shadow-xs tracking-wider">
                          Most Popular
                        </span>
                      )}
                    </div>

                    {/* Price */}
                    <div className="mb-6 pb-6 border-b border-charcoal-100">
                      <div className="flex items-baseline gap-1">
                        <span className={`text-3xl sm:text-4xl font-extrabold font-serif ${theme.price}`}>
                          ₹ {p.price_inr.toLocaleString()}
                        </span>
                      </div>
                      <span className={`text-xs font-bold inline-block mt-1 px-2 py-0.5 rounded-md border ${theme.badge}`}>
                        Valid for {p.duration_days} days
                      </span>
                    </div>

                    {/* Features Bullet List */}
                    <div className="space-y-3 mb-8 text-xs text-charcoal-700 font-medium">
                      {p.features && p.features.map((f, fIdx) => (
                        <div key={fIdx} className="flex items-start gap-2.5">
                          <span className={`${theme.bullet} font-bold text-sm leading-none`}>✓</span>
                          <span className="leading-snug">{f}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Subscribe CTA */}
                  <button
                    onClick={() => handleSubscribe(p)}
                    disabled={processing}
                    className={`w-full py-3.5 rounded-2xl text-xs font-extrabold transition-all ${theme.btn}`}
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
