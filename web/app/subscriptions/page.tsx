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

const DEFAULT_PLANS: SubscriptionPlanItem[] = [
  {
    id: 1,
    plan_code: 'BASIC',
    name: 'Basic Christian Plan',
    price_inr: 499,
    duration_days: 30,
    contact_reveals_limit: 5,
    features: [
      'Browse verified profiles & full candidate bios',
      'Express 5 matrimonial interests',
      '5 Photo uploads',
      '5 In-App Messaging with Matches',
      'Verified Profile Badge',
      'Mutual Contact Exchange upon Accepted Interest (Up to 5 Matches)',
      'Strict Privacy: Contact numbers locked until mutual consent',
    ],
  },
  {
    id: 2,
    plan_code: 'STANDARD',
    name: 'Standard Christian Plan',
    price_inr: 799,
    duration_days: 70,
    contact_reveals_limit: 15,
    features: [
      'Send unlimited interests',
      'Priority Christian matching',
      'Bidar Parish support',
      'Unlimited In-App Messaging with Matches',
      'Verified Profile Badge',
      'Mutual Contact Sharing (Unlocked only after mutual acceptance)',
    ],
  },
  {
    id: 3,
    plan_code: 'PREMIUM',
    name: 'Premium Blessed Matrimony',
    price_inr: 999,
    duration_days: 100,
    contact_reveals_limit: 40,
    features: [
      'Send unlimited interests',
      'Unlimited In-App Messaging with Matches',
      'Featured profile placement',
      'Personal relationship manager',
      'Verified Profile Badge',
      'Mutual Contact Sharing (Unlocked only after mutual acceptance)',
      'Zero Unsolicited Contact Reveals Guarantee',
    ],
  },
];

export default function SubscriptionsPage() {
  const [plans, setPlans] = useState<SubscriptionPlanItem[]>(DEFAULT_PLANS);
  const [loading, setLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlanItem | null>(null);
  const [processing, setProcessing] = useState(false);
  const [scriptLoaded, setScriptLoaded] = useState(false);

  useEffect(() => {
    async function loadPlans() {
      try {
        const data = await apiClient.getPlans();
        if (data && data.length > 0) {
          // Merge with custom clean user features to ensure no raw reveals are shown
          const sanitized = data.map((d: any) => {
            if (d.plan_code === 'BASIC' || d.price_inr === 499) {
              return {
                ...d,
                price_inr: 499,
                duration_days: 30,
                features: DEFAULT_PLANS[0].features,
              };
            }
            if (d.plan_code === 'STANDARD' || d.price_inr === 799 || d.price_inr === 1499) {
              return {
                ...d,
                price_inr: 799,
                duration_days: 70,
                features: DEFAULT_PLANS[1].features,
              };
            }
            if (d.plan_code === 'PREMIUM' || d.price_inr === 999 || d.price_inr === 2999) {
              return {
                ...d,
                price_inr: 999,
                duration_days: 100,
                features: DEFAULT_PLANS[2].features,
              };
            }
            return d;
          });
          setPlans(sanitized);
        }
      } catch (err: any) {
        console.error('Failed to load plans, using default plans:', err);
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
          amount: order.amount || plan.price_inr * 100,
          currency: order.currency || 'INR',
          name: 'CovenantNest Christian Matrimony',
          description: `${plan.name} (${plan.duration_days} Days)`,
          order_id: order.order_id || order.id,
          handler: async function (response: any) {
            try {
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
            name: 'CovenantNest Member',
            email: 'member@covenantnest.com',
            contact: '9999999999',
          },
          theme: {
            color: '#0891b2',
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
    <div className="relative min-h-[calc(100vh-80px)] py-10 sm:py-14 bg-[#fdfbf7] text-charcoal-900 font-sans overflow-hidden">
      {/* Razorpay Standard Web Checkout Script */}
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        onLoad={() => setScriptLoaded(true)}
      />

      {/* Ambient Background Glows */}
      <div className="absolute top-10 left-1/4 w-96 h-96 bg-cyan-400/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-orange-400/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-8 sm:space-y-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-2.5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-50 border border-cyan-200 text-cyan-950 text-xs font-bold uppercase tracking-wider shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
            <span>Transparent Christian Membership Plans</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-extrabold text-charcoal-900 tracking-tight">
            Blessed Matrimony Plans
          </h1>
          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Honorable, verified memberships for Christian brides, grooms, and prayerful families.
          </p>
        </div>

        {/* Sacred Mutual Consent & Anti-Breach Policy Banner */}
        <div className="p-5 sm:p-7 rounded-3xl bg-gradient-to-br from-cyan-50/90 via-emerald-50/40 to-white border-2 border-cyan-300 shadow-sm flex flex-col md:flex-row items-start md:items-center gap-5">
          <div className="w-14 h-14 rounded-2xl bg-cyan-100/80 border border-cyan-300 text-cyan-900 flex items-center justify-center text-3xl shrink-0 shadow-2xs">
            🔒
          </div>
          <div className="space-y-1.5 flex-1">
            <div className="flex flex-wrap items-center gap-2.5">
              <h3 className="font-brand font-extrabold text-base sm:text-lg text-slate-900">
                Sacred Privacy Policy: Zero Unsolicited Contact Reveals
              </h3>
              <span className="text-[10px] sm:text-[11px] font-black uppercase bg-emerald-100 text-emerald-950 border border-emerald-300 px-2.5 py-0.5 rounded-full shadow-2xs">
                Mutual Consent Protected
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
              At CovenantNest, contact phone numbers and email addresses are <strong className="text-slate-950 font-bold">never revealed or sold to anyone</strong> simply by purchasing a plan. Contact details remain strictly locked and private until <strong className="text-slate-950 font-bold">BOTH candidates accept interest and give mutual consent to exchange contacts</strong>. No unwanted calls, zero personal policy breach, and total peace of mind for your family.
            </p>
          </div>
        </div>

        {/* 3 Restructured Subscription Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-7 items-stretch">
          {plans.map((p) => {
            const isPopular = p.plan_code === 'PREMIUM' || p.price_inr === 999;
            const isStandard = p.plan_code === 'STANDARD' || p.price_inr === 799;

            // Card Themes
            // Basic: Cyan Theme
            // Standard: Balanced Blue/Slate Theme
            // Premium: Warm Orange / Gold Theme (Most Popular)
            let theme = {
              card: 'border-cyan-200 bg-gradient-to-b from-cyan-50/60 via-white to-white hover:border-cyan-400 hover:shadow-lg',
              price: 'text-cyan-950',
              badge: 'text-cyan-800 bg-cyan-100/70 border-cyan-200',
              bullet: 'text-cyan-700',
              btn: 'bg-cyan-50 hover:bg-cyan-100 text-cyan-950 border border-cyan-300 shadow-2xs',
            };

            if (isStandard) {
              theme = {
                card: 'border-slate-300 bg-gradient-to-b from-slate-50/80 via-white to-white hover:border-cyan-400 hover:shadow-lg',
                price: 'text-slate-900',
                badge: 'text-slate-800 bg-slate-100 border-slate-300',
                bullet: 'text-emerald-700',
                btn: 'bg-gradient-to-r from-cyan-700 to-teal-700 hover:from-cyan-600 hover:to-teal-600 text-white shadow-xs',
              };
            }

            if (isPopular) {
              theme = {
                card: 'border-orange-300 ring-2 ring-orange-400/50 bg-gradient-to-b from-orange-50/80 via-amber-50/30 to-white shadow-xl hover:-translate-y-1',
                price: 'text-orange-950',
                badge: 'text-orange-900 bg-orange-100/90 border-orange-300',
                bullet: 'text-orange-600',
                btn: 'bg-gradient-to-r from-burgundy-700 via-rose-600 to-orange-600 hover:from-burgundy-600 hover:to-orange-500 text-white shadow-md shadow-orange-950/20',
              };
            }

            return (
              <div
                key={p.id}
                className={`border rounded-3xl p-7 sm:p-8 shadow-sm transition-all duration-300 flex flex-col justify-between relative group ${theme.card}`}
              >
                <div>
                  {/* Header */}
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xl font-brand font-bold text-slate-900">{p.name}</h3>
                    {isPopular && (
                      <span className="text-[11px] font-black uppercase bg-gradient-to-r from-orange-500 to-amber-500 text-white px-3 py-1 rounded-xl shadow-xs tracking-wider">
                        Most Popular
                      </span>
                    )}
                  </div>

                  {/* Price */}
                  <div className="mb-6 pb-6 border-b border-charcoal-100">
                    <div className="flex items-baseline gap-1">
                      <span className={`text-4xl sm:text-5xl font-extrabold font-serif ${theme.price}`}>
                        ₹ {p.price_inr.toLocaleString()}
                      </span>
                    </div>
                    <span className={`text-xs font-bold inline-block mt-2 px-3 py-1 rounded-lg border ${theme.badge}`}>
                      Valid for {p.duration_days} days
                    </span>
                  </div>

                  {/* Features Bullet List */}
                  <div className="space-y-3.5 mb-8 text-xs sm:text-sm text-slate-700 font-medium">
                    {p.features &&
                      p.features.map((f, fIdx) => (
                        <div key={fIdx} className="flex items-start gap-3">
                          <span className={`${theme.bullet} font-black text-sm leading-none shrink-0 mt-0.5`}>
                            ✓
                          </span>
                          <span className="leading-snug">{f}</span>
                        </div>
                      ))}
                  </div>
                </div>

                {/* Subscribe CTA */}
                <button
                  type="button"
                  onClick={() => handleSubscribe(p)}
                  disabled={processing}
                  className={`w-full py-3.5 rounded-2xl text-xs sm:text-sm font-extrabold transition-all duration-200 ${theme.btn}`}
                >
                  {processing && selectedPlan?.id === p.id
                    ? 'Opening Razorpay Checkout...'
                    : `Choose ${p.name}`}
                </button>
              </div>
            );
          })}
        </div>

        {/* Mutual Contact Sharing Explainer */}
        <div className="p-8 rounded-3xl bg-white border border-[#ece2d1] shadow-2xs space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-1.5">
            <h3 className="font-brand text-2xl font-bold text-slate-900">
              How Mutual Contact Exchange Works
            </h3>
            <p className="text-xs sm:text-sm text-slate-500">
              Preserving dignity, honor, and family comfort at every step of your matrimonial journey.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
            <div className="p-5 rounded-2xl bg-cyan-50/50 border border-cyan-200/80 space-y-2 text-center">
              <div className="w-10 h-10 rounded-xl bg-cyan-100 text-cyan-900 font-extrabold text-sm flex items-center justify-center mx-auto shadow-2xs">
                1
              </div>
              <h4 className="font-bold text-sm text-slate-900">Express Matrimonial Interest</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Review verified profiles and send interest or personalized prayerful messages within the platform.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-orange-50/50 border border-orange-200/80 space-y-2 text-center">
              <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-900 font-extrabold text-sm flex items-center justify-center mx-auto shadow-2xs">
                2
              </div>
              <h4 className="font-bold text-sm text-slate-900">Mutual Acceptance</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Both candidates and families review church, education, and testimony details before accepting interest.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-emerald-50/50 border border-emerald-200/80 space-y-2 text-center">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-900 font-extrabold text-sm flex items-center justify-center mx-auto shadow-2xs">
                3
              </div>
              <h4 className="font-bold text-sm text-slate-900">Safe Contact Sharing</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Once both members consent, phone numbers and emails are unlocked for direct family coordination.
              </p>
            </div>
          </div>
        </div>

        {/* Security & Trust Footer */}
        <div className="p-6 rounded-2xl bg-[#faf6ee] border border-[#ece2d1] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-600">
          <div className="flex items-center gap-3">
            <span className="text-xl">🛡️</span>
            <span>
              <strong>100% Secure Payments</strong> via Razorpay • 128-bit Bank Encryption • Verified Christian Community
            </span>
          </div>
          <div className="flex items-center gap-2 text-cyan-900 font-bold">
            <span>Official Techmasters Innovations Product</span>
          </div>
        </div>
      </div>
    </div>
  );
}
