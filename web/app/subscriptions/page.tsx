'use client';

import React, { useEffect, useState } from 'react';
import Script from 'next/script';
import Link from 'next/link';
import { apiClient } from '../../lib/api-client';
import { SubscriptionPlanItem } from '../../types';

declare global {
  interface Window {
    Razorpay?: any;
  }
}

const DEFAULT_PLANS: SubscriptionPlanItem[] = [
  {
    id: 1,
    plan_code: 'BASIC',
    name: 'Basic Christian Plan',
    price_inr: 299,
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
    price_inr: 349,
    duration_days: 70,
    contact_reveals_limit: 50,
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
    price_inr: 549,
    duration_days: 100,
    contact_reveals_limit: 999,
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
  const [activeSubscription, setActiveSubscription] = useState<any>(null);
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlanItem | null>(null);
  const [processing, setProcessing] = useState(false);
  const [, setScriptLoaded] = useState(false);

  useEffect(() => {
    async function loadPlans() {
      try {
        const data = await apiClient.getPlans();
        if (data && data.length > 0) {
          const sanitized = data.map((d: any) => {
            if (d.plan_code === 'BASIC' || d.price_inr === 299 || d.price_inr === 499) {
              return {
                ...d,
                price_inr: 299,
                duration_days: 30,
                name: 'Basic Christian Plan',
                features: DEFAULT_PLANS[0].features,
              };
            }
            if (d.plan_code === 'STANDARD' || d.price_inr === 349 || d.price_inr === 799 || d.price_inr === 1499) {
              return {
                ...d,
                price_inr: 349,
                duration_days: 70,
                name: 'Standard Christian Plan',
                features: DEFAULT_PLANS[1].features,
              };
            }
            if (d.plan_code === 'PREMIUM' || d.price_inr === 549 || d.price_inr === 999 || d.price_inr === 2999) {
              return {
                ...d,
                price_inr: 549,
                duration_days: 100,
                name: 'Premium Blessed Matrimony',
                features: DEFAULT_PLANS[2].features,
              };
            }
            return d;
          });
          setPlans(sanitized);
        }
      } catch (err: any) {
        console.error('Failed to load plans from server, using default plans:', err);
      }
    }

    async function loadActiveSubscription() {
      const token = typeof window !== 'undefined' ? (localStorage.getItem('access_token') || localStorage.getItem('token')) : null;
      if (!token) return;
      try {
        const subData = await apiClient.getMySubscription();
        if (subData && subData.has_active_subscription) {
          setActiveSubscription(subData);
        }
      } catch (e) {
        // Optional active subscription check
      }
    }

    loadPlans();
    loadActiveSubscription();
  }, []);

  const handleSubscribe = async (plan: SubscriptionPlanItem) => {
    const token = typeof window !== 'undefined' ? (localStorage.getItem('access_token') || localStorage.getItem('token')) : null;
    if (!token) {
      alert('Need to login: Please log in to your account to choose a Blessed Matrimony plan.');
      window.location.href = `/login?redirect=/subscriptions`;
      return;
    }

    setSelectedPlan(plan);
    setProcessing(true);

    try {
      // Step 1: Create Razorpay Order via Backend API
      const order = await apiClient.createSubscriptionOrder(plan.id);
      const razorpayKey = order.key_id || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_MatrimonyKey2026';

      // Step 2: Open Razorpay Standard Checkout Modal
      if (typeof window !== 'undefined' && window.Razorpay) {
        const userEmail = localStorage.getItem('user_email') || '';
        const userMobile = localStorage.getItem('user_mobile') || '';
        const userName = localStorage.getItem('user_name') || 'CovenantNest Member';

        const options = {
          key: razorpayKey,
          amount: order.amount || plan.price_inr * 100,
          currency: order.currency || 'INR',
          name: 'CovenantNest Christian Matrimony',
          description: `${plan.name} (${plan.duration_days} Days)`,
          order_id: order.order_id,
          handler: async function (response: any) {
            try {
              const verifyRes = await apiClient.verifyPayment(
                response.razorpay_order_id || order.order_id,
                response.razorpay_payment_id,
                response.razorpay_signature
              );
              alert(verifyRes.message || `Payment Verified & ${plan.name} Activated Successfully! Full church details and candidate bios are now unlocked.`);
              window.location.href = '/discover';
            } catch (vErr: any) {
              alert(`Payment Verification Error: ${vErr.message}`);
            } finally {
              setProcessing(false);
            }
          },
          prefill: {
            name: userName,
            email: userEmail,
            contact: userMobile,
          },
          theme: {
            color: '#0e7490',
          },
          modal: {
            ondismiss: function () {
              setProcessing(false);
              console.log('Razorpay payment modal closed by user.');
            },
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.on('payment.failed', function (resp: any) {
          alert(`Payment Required: Transaction could not be completed (${resp.error?.description || 'Declined'}). Please try again.`);
          setProcessing(false);
        });
        rzp.open();
      } else {
        // Fallback simulation for local/testing environments without external CDN
        const verify = await apiClient.verifyPayment(
          order.order_id,
          `pay_rzp_sim_${Date.now()}`,
          'sim_sig_verified_2026'
        );
        alert(verify.message || `${plan.name} successfully activated!`);
        window.location.href = '/discover';
        setProcessing(false);
      }
    } catch (err: any) {
      alert(`Payment Notice: ${err.message}`);
      setProcessing(false);
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-80px)] py-10 sm:py-16 bg-[#fdfbf7] text-charcoal-900 font-sans overflow-hidden">
      {/* Razorpay Standard Web Checkout Script */}
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        onLoad={() => setScriptLoaded(true)}
      />

      {/* Ambient Warm Sanctuary Glows */}
      <div className="absolute top-8 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-8 sm:space-y-12">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-extrabold text-charcoal-900 tracking-tight">
            Blessed Matrimony Plans
          </h1>
          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Honorable, verified memberships for Christian brides, grooms, and prayerful families.
          </p>
        </div>

        {/* Current Active Subscription Banner (if member has one) */}
        {activeSubscription && (
          <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50/90 border border-emerald-300 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center gap-3">
              <span className="text-xl">✨</span>
              <div className="text-xs sm:text-sm text-emerald-950 font-medium">
                You have an active <strong className="font-bold">{activeSubscription.plan_name}</strong> membership valid until{' '}
                <strong className="font-bold">
                  {new Date(activeSubscription.end_date).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </strong>.
              </div>
            </div>
            <Link
              href="/discover"
              className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shrink-0 transition-colors"
            >
              Browse Candidate Profiles →
            </Link>
          </div>
        )}

        {/* Sacred Mutual Consent & Anti-Breach Policy Banner */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-cyan-50/90 via-emerald-50/40 to-white border-2 border-cyan-300 shadow-sm flex flex-col md:flex-row items-start md:items-center gap-5">
          <div className="w-14 h-14 rounded-2xl bg-cyan-100/90 border border-cyan-300 text-cyan-900 flex items-center justify-center text-3xl shrink-0 shadow-2xs">
            🔒
          </div>
          <div className="space-y-2 flex-1">
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
            const isPopular = p.plan_code === 'PREMIUM' || p.price_inr === 549;
            const isStandard = p.plan_code === 'STANDARD' || p.price_inr === 349;

            // Tailored aesthetic themes
            let theme = {
              card: 'border-cyan-200 bg-gradient-to-b from-cyan-50/50 via-white to-white hover:border-cyan-400 hover:shadow-lg',
              price: 'text-cyan-950',
              badge: 'text-cyan-800 bg-cyan-100/70 border-cyan-200',
              bullet: 'text-emerald-700',
              btn: 'bg-cyan-900 hover:bg-cyan-800 text-white shadow-xs',
            };

            if (isStandard) {
              theme = {
                card: 'border-teal-300 bg-gradient-to-b from-teal-50/60 via-white to-white hover:border-teal-400 hover:shadow-lg',
                price: 'text-teal-950',
                badge: 'text-teal-800 bg-teal-100 border-teal-300',
                bullet: 'text-emerald-700',
                btn: 'bg-teal-800 hover:bg-teal-700 text-white shadow-xs',
              };
            }

            if (isPopular) {
              theme = {
                card: 'border-orange-300 ring-2 ring-orange-400/60 bg-gradient-to-b from-orange-50/80 via-amber-50/30 to-white shadow-xl hover:-translate-y-1',
                price: 'text-orange-950',
                badge: 'text-orange-900 bg-orange-100/90 border-orange-300',
                bullet: 'text-orange-600',
                btn: 'bg-gradient-to-r from-burgundy-700 via-rose-600 to-orange-600 hover:from-burgundy-600 hover:to-orange-500 text-white shadow-md shadow-orange-950/20',
              };
            }

            return (
              <div
                key={p.id}
                className={`border rounded-3xl p-6 sm:p-7 shadow-sm transition-all duration-300 flex flex-col justify-between relative group ${theme.card}`}
              >
                <div>
                  {/* Header */}
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-brand font-bold text-slate-900">{p.name}</h3>
                    {isPopular && (
                      <span className="text-[10px] font-extrabold uppercase bg-gradient-to-r from-orange-500 to-amber-500 text-white px-2.5 py-1 rounded-lg shadow-xs tracking-wider">
                        Most Popular
                      </span>
                    )}
                  </div>

                  {/* Price */}
                  <div className="mb-5 pb-5 border-b border-[#ece2d1]">
                    <div className="flex items-baseline gap-1">
                      <span className={`text-3xl sm:text-4xl font-extrabold font-serif ${theme.price}`}>
                        ₹ {p.price_inr.toLocaleString()}/-
                      </span>
                    </div>
                    <span className={`text-xs font-semibold inline-block mt-2 px-2.5 py-0.5 rounded-md border ${theme.badge}`}>
                      Valid for {p.duration_days} days
                    </span>
                  </div>

                  {/* Features Bullet List */}
                  <div className="space-y-3 mb-8 text-xs sm:text-[13px] text-slate-700 font-medium leading-relaxed">
                    {p.features &&
                      p.features.map((f, fIdx) => (
                        <div key={fIdx} className="flex items-start gap-2.5">
                          <span className={`${theme.bullet} font-extrabold text-sm leading-none shrink-0 mt-0.5`}>
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
                  className={`w-full py-3.5 rounded-2xl text-xs font-extrabold transition-all duration-200 cursor-pointer ${theme.btn}`}
                >
                  {processing && selectedPlan?.id === p.id
                    ? 'Opening Checkout...'
                    : `Choose ${p.name}`}
                </button>
              </div>
            );
          })}
        </div>

        {/* Mutual Contact Sharing Explainer */}
        <div className="p-8 sm:p-10 rounded-3xl bg-white border border-[#ece2d1] shadow-2xs space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h3 className="font-brand text-2xl sm:text-3xl font-bold text-slate-900">
              How Mutual Contact Exchange Works
            </h3>
            <p className="text-xs sm:text-sm text-slate-600">
              Preserving dignity, honor, and family comfort at every step of your matrimonial journey.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
            <div className="p-6 rounded-2xl bg-cyan-50/60 border border-cyan-200/80 space-y-3 text-center">
              <div className="w-11 h-11 rounded-2xl bg-cyan-100 text-cyan-900 font-extrabold text-base flex items-center justify-center mx-auto shadow-2xs">
                1
              </div>
              <h4 className="font-bold text-sm text-slate-900">Express Matrimonial Interest</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Review verified profiles and send interest or personalized prayerful messages within the platform.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-orange-50/60 border border-orange-200/80 space-y-3 text-center">
              <div className="w-11 h-11 rounded-2xl bg-orange-100 text-orange-900 font-extrabold text-base flex items-center justify-center mx-auto shadow-2xs">
                2
              </div>
              <h4 className="font-bold text-sm text-slate-900">Mutual Acceptance</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Both candidates and families review church, education, and testimony details before accepting interest.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-emerald-50/60 border border-emerald-200/80 space-y-3 text-center">
              <div className="w-11 h-11 rounded-2xl bg-emerald-100 text-emerald-900 font-extrabold text-base flex items-center justify-center mx-auto shadow-2xs">
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
        <div className="p-6 sm:p-7 rounded-2xl bg-[#faf6ee] border border-[#ece2d1] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-700">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🛡️</span>
            <span>
              <strong className="text-slate-900 font-bold">100% Secure Payments</strong> via Razorpay • 128-bit Bank Encryption • Verified Christian Community
            </span>
          </div>
          <div className="flex items-center gap-2 text-cyan-950 font-bold">
            <span>Official Techmasters Innovations Product</span>
          </div>
        </div>
      </div>
    </div>
  );
}
