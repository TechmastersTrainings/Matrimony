import React from 'react';
import Link from 'next/link';

export function ContactRevealSection() {
  const steps = [
    {
      step: '1',
      title: 'Mutual Match',
      desc: 'Both parties express genuine interest.',
      icon: '✝',
    },
    {
      step: '2',
      title: 'Private In-App Chat',
      desc: 'Get to know each other with complete privacy.',
      icon: '💬',
    },
    {
      step: '3',
      title: 'Contact Request',
      desc: 'Send a request when you feel spiritually ready.',
      icon: '📩',
    },
    {
      step: '4',
      title: 'Mutual Agreement',
      desc: 'Both candidate/family explicitly accept.',
      icon: '🤝',
    },
    {
      step: '5',
      title: 'Secure Contact Reveal',
      desc: 'Verified phone & email unlocked safely.',
      icon: '🔓',
    },
  ];

  return (
    <section className="py-20 bg-white border-t border-[#E2E8F0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#172554] rounded-3xl p-8 sm:p-12 lg:p-16 text-white relative overflow-hidden shadow-2xl">
          {/* Subtle gold glow background */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#C9A227]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="text-center max-w-2xl mx-auto mb-14 relative z-10">
            <span className="text-xs font-bold uppercase tracking-widest text-[#C9A227] px-3 py-1 rounded-full bg-white/10 border border-white/10 inline-block mb-3">
              🔒 Controlled Privacy & Consent
            </span>
            <h2 className="font-serif-heading text-3xl sm:text-4xl font-bold text-white tracking-tight">
              Connect First. Share Contact When You&apos;re Both Ready.
            </h2>
            <p className="text-sm text-stone-300 mt-3">
              Your safety is our sacred priority. Nobody&apos;s phone number or personal contact details are ever revealed without mutual consent.
            </p>
          </div>

          {/* Visual Step Flow */}
          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-4 relative z-10 mb-10">
            {steps.map((s, idx) => (
              <div
                key={idx}
                className="bg-white/5 border border-white/10 rounded-2xl p-5 text-center flex flex-col items-center justify-between hover:bg-white/10 transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-[#C9A227] text-[#172554] font-bold flex items-center justify-center text-sm mb-3 shadow">
                  {s.icon}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white mb-1">{s.title}</h4>
                  <p className="text-[11px] text-stone-300 leading-snug">{s.desc}</p>
                </div>
                <span className="text-[10px] text-[#C9A227] font-semibold mt-3 block">
                  Step {s.step}
                </span>
              </div>
            ))}
          </div>

          {/* Guarantee Pill */}
          <div className="bg-white/10 border border-white/15 rounded-2xl p-4 max-w-xl mx-auto text-center relative z-10">
            <p className="text-xs text-stone-200">
              🛡️ <strong>Zero Spam Guarantee:</strong> Profiles can never view your phone number, WhatsApp, or email address without your permission.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
