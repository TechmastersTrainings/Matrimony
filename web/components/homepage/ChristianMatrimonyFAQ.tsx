'use client';

import React, { useState } from 'react';

export function ChristianMatrimonyFAQ() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    {
      q: 'Can parents, elders, or guardians register on behalf of a bride or groom?',
      a: 'Yes, absolutely. Christian marriage is a sacred union of two families. Parents and guardians can easily create and manage profiles, with dedicated tags indicating that the profile is managed with parental care and pastoral oversight.',
    },
    {
      q: 'How are candidate phone numbers and family privacy protected?',
      a: 'Your sensitive contact details and full biodata are never exposed to public internet crawlers or unregistered visitors. Phone numbers and location details are strictly locked until there is mutual consent: both families must accept matrimonial interest before direct contact is exchanged.',
    },
    {
      q: 'What does the "Till You Marry" commitment mean?',
      a: 'Unlike generic matrimonial portals that force rigid 30-day deadlines and push recurring renewals, our philosophy recognizes that finding God’s ordained partner takes prayerful discernment. Our subscriptions are designed with extended validity and continuous support until holy matrimony.',
    },
    {
      q: 'Why are there daily contact view limits on profiles?',
      a: 'Daily contact caps are an essential anti-harassment and anti-scraping safeguard. They prevent commercial brokers, automated bots, and casual daters from harvesting phone numbers in bulk. This protects the dignity and peace of mind of our Christian brides and grooms.',
    },
    {
      q: 'Which Christian denominations and churches are supported on Covenant Nest?',
      a: 'We proudly support faithful families across the Methodist Church in India (MCI), Church of South India (CSI), Roman Catholic (RC), Baptist Church, Pentecostal / Assemblies of God / Born-Again, Mar Thoma, and all Bible-believing Protestant and independent fellowships.',
    },
    {
      q: 'Is registration completely free?',
      a: 'Yes, 100% free. You can register your profile, upload photos, list your church parish and educational background, and browse verified candidate cards without paying any registration fee.',
    },
  ];

  return (
    <section className="py-12 sm:py-16 bg-[#fdfbf7] text-[#1e1b18] border-b border-charcoal-100/70">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-50 border border-cyan-200 text-xs font-bold text-cyan-950">
            <span>❓</span>
            <span>Frequently Asked Questions</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-brand">
            Everything Families Ask About Covenant Nest
          </h2>
          <p className="text-xs sm:text-base text-slate-600">
            Answers to common questions regarding privacy, church denominations, and our sacred matrimonial process.
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-charcoal-200 overflow-hidden transition-all shadow-2xs"
              >
                <button
                  type="button"
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-4 hover:bg-slate-50/70 transition-colors"
                >
                  <span className="font-brand font-bold text-sm sm:text-base text-slate-900 flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-xs flex items-center justify-center font-mono font-bold shrink-0">
                      {idx + 1}
                    </span>
                    <span>{faq.q}</span>
                  </span>
                  <span
                    className={`w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 text-sm font-bold shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 bg-orange-100 text-orange-800' : ''
                    }`}
                  >
                    ↓
                  </span>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/40">
                    <p>{faq.a}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default ChristianMatrimonyFAQ;
