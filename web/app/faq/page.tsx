'use client';

import React, { useState } from 'react';
import Link from 'next/link';

interface FAQItem {
  id: number;
  question: string;
  answer: string;
  category: string;
}

const faqList: FAQItem[] = [
  {
    id: 1,
    category: 'Family & Registration',
    question: 'Can parents, elders, or guardians register on behalf of a bride or groom?',
    answer:
      'Yes, absolutely. Christian marriage is a sacred union of two families, not just two individuals. Parents, elder siblings, and legal guardians can easily create, verify, and manage profiles on behalf of their son, daughter, brother, or sister. Each candidate profile displays a clear badge indicating who manages the profile (e.g., "Managed by Parent" or "Managed by Self"), ensuring complete transparency and pastoral honor.',
  },
  {
    id: 2,
    category: 'Privacy & Security',
    question: 'How are candidate phone numbers and family privacy protected?',
    answer:
      'Your sensitive contact details and full biodata are strictly protected and never exposed to public search crawlers, commercial brokers, or unregistered visitors. Phone numbers and private family contacts are locked by default. They are only exchanged when both families grant mutual consent: Family A expresses interest, and Family B prayerfully reviews and accepts. Only then are contact details unlocked for honorable, family-to-family communication.',
  },
  {
    id: 3,
    category: 'Commitment & Plans',
    question: 'What does the "Till You Marry" commitment mean?',
    answer:
      'Unlike generic matrimonial portals that force arbitrary 30-day deadlines and push high-pressure renewal charges, our philosophy recognizes that finding God’s ordained life partner takes prayerful discernment and patience. Our "Till You Marry" subscription philosophy offers extended validity and dedicated agency support until holy matrimony, so parents and candidates never feel rushed by expiring countdowns.',
  },
  {
    id: 4,
    category: 'Safety Safeguards',
    question: 'Why are there daily contact view limits on profiles?',
    answer:
      'Daily contact viewing caps are an intentional anti-harassment and anti-scraping safety standard. They prevent commercial third-party brokers, automated scraping bots, and casual daters from harvesting phone numbers in bulk. This strict limit ensures that every profile view is intentional, serious, and respectful of our Christian brides and grooms.',
  },
  {
    id: 5,
    category: 'Church Denominations',
    question: 'Which Christian denominations and churches are supported on Covenant Nest?',
    answer:
      'We proudly support devout Christian families across all major fellowships in Karnataka, Telangana, and Pan-India: Methodist Church in India (MCI), Church of South India (CSI), Roman Catholic (RC), Baptist Church, Pentecostal / Assemblies of God / Born-Again, Mar Thoma, and all Bible-believing Protestant and independent fellowships.',
  },
  {
    id: 6,
    category: 'Pricing & Registration',
    question: 'Is registration completely free?',
    answer:
      'Yes, 100% free. You can create your matrimonial profile, upload verified photos, list your church denomination and parish affiliation, detail your education and profession, and browse verified candidate cards across fellowships without paying any registration fee.',
  },
];

export default function FAQPage() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'Family & Registration', 'Privacy & Security', 'Commitment & Plans', 'Church Denominations'];

  const filteredFaqs =
    selectedCategory === 'All'
      ? faqList
      : faqList.filter((item) => item.category === selectedCategory);

  return (
    <div className="min-h-screen bg-[#fdfbf7] text-slate-900 font-sans pt-24 pb-20">
      
      {/* 1. Header Hero Banner */}
      <section className="relative overflow-hidden py-12 sm:py-16 bg-gradient-to-b from-[#faf6ee] via-rose-50/20 to-[#fdfbf7] border-b border-[#ece2d1]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          
          {/* Breadcrumb */}
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 mb-2">
            <Link href="/" className="hover:text-orange-700 transition-colors">
              Home
            </Link>
            <span>/</span>
            <span className="text-slate-900 font-bold">Frequently Asked Questions</span>
          </div>

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-amber-200 text-xs font-bold text-amber-900 shadow-2xs">
            <span className="text-orange-600 font-bold">❓</span>
            <span>Family Help &amp; Matrimonial Guidance</span>
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 font-brand tracking-tight">
            Everything Families Ask About Covenant Nest
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Clear, transparent answers regarding privacy, church denominations, parental registration, and our sacred matrimonial process.
          </p>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-4">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => {
                  setSelectedCategory(cat);
                  setOpenIdx(null);
                }}
                className={`text-xs font-bold px-4 py-2 rounded-full transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-gradient-to-r from-burgundy-700 to-orange-600 text-white shadow-xs'
                    : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

        </div>
      </section>

      {/* 2. Interactive FAQ Accordion Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="space-y-4">
          {filteredFaqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={faq.id}
                className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden transition-all duration-200 hover:border-orange-300"
              >
                <button
                  type="button"
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  className="w-full text-left p-5 sm:p-6 flex items-start justify-between gap-4 cursor-pointer hover:bg-slate-50/60 transition-colors"
                >
                  <div className="flex items-start gap-3.5">
                    <span className="w-7 h-7 rounded-xl bg-orange-50 border border-orange-200 text-orange-900 text-xs flex items-center justify-center font-mono font-black shrink-0 mt-0.5">
                      {faq.id}
                    </span>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-orange-700 bg-orange-50 px-2 py-0.5 rounded-md mb-1 inline-block">
                        {faq.category}
                      </span>
                      <h3 className="font-brand font-bold text-base sm:text-lg text-slate-900 leading-snug">
                        {faq.question}
                      </h3>
                    </div>
                  </div>

                  <span
                    className={`w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 text-sm font-bold shrink-0 transition-transform duration-200 mt-1 ${
                      isOpen ? 'rotate-180 bg-orange-100 text-orange-900' : ''
                    }`}
                  >
                    ↓
                  </span>
                </button>

                {isOpen && (
                  <div className="px-6 pb-6 pt-2 text-sm sm:text-base text-slate-700 leading-relaxed border-t border-slate-100 bg-slate-50/40">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* 3. Help / Support Contact Card */}
        <div className="mt-14 p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-amber-50/80 via-orange-50/60 to-rose-50/60 border border-orange-200 shadow-md text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-white text-orange-700 flex items-center justify-center text-2xl mx-auto shadow-xs border border-orange-100">
            ⛪
          </div>
          <h3 className="text-xl sm:text-2xl font-serif font-extrabold text-slate-900">
            Have Questions About Pastoral Verification or Denominations?
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto leading-relaxed">
            Our team is here to walk beside your family with reverence, privacy, and Christian integrity.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <Link
              href="/register"
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-burgundy-700 via-rose-600 to-orange-600 hover:from-burgundy-600 hover:to-orange-500 text-white font-bold text-xs sm:text-sm shadow-md transition-all"
            >
              Create Free Profile →
            </Link>
            <Link
              href="/about"
              className="px-6 py-3 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs sm:text-sm border border-slate-300 shadow-xs transition-all"
            >
              About Our Ministry &amp; Team
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
