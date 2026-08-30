import React from 'react';

export function IndianTrustSection() {
  const trustCards = [
    {
      icon: '🛡️',
      title: '100% Church & Mobile Verified',
      desc: 'Every profile is authenticated via mobile OTP and manual review of church and denomination details.',
    },
    {
      icon: '🔒',
      title: 'Controlled Contact Privacy',
      desc: 'Your phone number and WhatsApp are NEVER displayed publicly. Contact details are revealed only when both parties mutually consent.',
    },
    {
      icon: '👨‍👩‍👧‍👦',
      title: 'Family & Parent Managed',
      desc: 'Support for parents, siblings, and guardians to create and manage profiles with full respect to Christian traditions.',
    },
    {
      icon: '📍',
      title: 'Bidar & Karnataka Focus',
      desc: 'Specialized for Christian communities in Bidar, Bengaluru, Kalaburagi, Hyderabad and across South India.',
    },
  ];

  return (
    <section className="py-16 bg-white border-t border-rose-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-extrabold uppercase tracking-widest text-amber-700 bg-amber-100 px-3.5 py-1 rounded-full">
            Safe • Respectful • Sacred
          </span>
          <h2 className="font-playfair text-3xl sm:text-4xl font-extrabold text-red-950 mt-3 tracking-tight">
            Built for Serious Christian Alliances
          </h2>
          <p className="text-sm text-slate-600 mt-2 font-medium">
            Unlike dating apps, we provide a secure, family-honoring platform dedicated solely to lifelong Christian marriage.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {trustCards.map((c, idx) => (
            <div
              key={idx}
              className="bg-gradient-to-b from-white to-rose-50/40 border border-rose-200 rounded-3xl p-6 shadow-xs hover:shadow-xl transition-all duration-300 card-hover-indian flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-white border border-rose-200 flex items-center justify-center text-2xl mb-4 shadow-xs">
                  {c.icon}
                </div>
                <h3 className="font-playfair text-base font-bold text-red-950 mb-2">
                  {c.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  {c.desc}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-rose-100 flex items-center gap-1 text-[11px] font-bold text-emerald-700">
                <span>✓ Verified Feature</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
