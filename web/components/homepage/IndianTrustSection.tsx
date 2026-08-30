import React from 'react';

export function IndianTrustSection() {
  const trustCards = [
    {
      title: 'Church & Contact Verification',
      desc: 'Profiles undergo mobile OTP authentication and verification of church denomination details.',
    },
    {
      title: 'Confidential Contact Reveal',
      desc: 'Phone numbers and emails are never displayed publicly. Contact information is disclosed solely upon mutual consent.',
    },
    {
      title: 'Family & Candidate Accounts',
      desc: 'Parents, siblings, and guardians can manage profiles with complete transparency and respect.',
    },
    {
      title: 'Regional Focus in Karnataka',
      desc: 'Specialized for Christian communities across Bidar, Bengaluru, Kalaburagi, and Hyderabad.',
    },
  ];

  return (
    <section className="py-14 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-700 block mb-1">
            Platform Security & Trust
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Built for Serious Matrimonial Connections
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            A secure and respectful environment dedicated exclusively to Christian marriage.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {trustCards.map((c, idx) => (
            <div
              key={idx}
              className="bg-slate-50 border border-slate-200 rounded-xl p-5 shadow-2xs hover:shadow-md transition-all duration-200 card-hover-pro flex flex-col justify-between"
            >
              <div>
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-900 flex items-center justify-center text-xs font-bold mb-3">
                  0{idx + 1}
                </div>
                <h3 className="text-sm font-bold text-slate-900 mb-1.5">
                  {c.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {c.desc}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-200 flex items-center text-[11px] font-semibold text-blue-700">
                <span>Verified Standard</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
