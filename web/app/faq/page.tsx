'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';

interface FAQItem {
  id: number;
  question: string;
  answer: string;
  category: string;
  tag: string;
}

const faqList: FAQItem[] = [
  {
    id: 1,
    category: 'Family & Registration',
    tag: 'Parental Registration',
    question: 'Can parents, elders, or guardians register on behalf of a bride or groom?',
    answer:
      'Yes, absolutely. Christian marriage is a sacred covenant uniting two families. Parents, elder siblings, or guardians can easily register and manage profiles for their son, daughter, or sibling. Every profile clearly displays a "Managed by Parent" or "Self Managed" badge for transparency and honor.',
  },
  {
    id: 2,
    category: 'Privacy & Safety',
    tag: 'Strict Privacy',
    question: 'How are candidate phone numbers and family privacy protected?',
    answer:
      'Contact numbers and private addresses are never exposed to public web crawlers, brokers, or unregistered visitors. Numbers remain securely locked until both families grant mutual consent — Family A sends an interest request, and Family B reviews and accepts. Only then are contact details unlocked for honorable family communication.',
  },
  {
    id: 3,
    category: 'Commitment & Plans',
    tag: 'Till You Marry',
    question: 'What does the "Till You Marry" commitment mean?',
    answer:
      'Unlike conventional portals that impose stressful 30-day renewal deadlines, our "Till You Marry" philosophy offers extended validity and dedicated pastoral agency support until holy matrimony. Families and candidates never feel rushed or pressured by expiring countdowns.',
  },
  {
    id: 4,
    category: 'Privacy & Safety',
    tag: 'Anti-Harassment',
    question: 'Why are there daily contact view limits on profiles?',
    answer:
      'Daily contact viewing limits prevent commercial brokers, data-scraping bots, and casual browsing. This ensures that every view is intentional, serious, and respectful of our Christian brides, grooms, and prayerful families.',
  },
  {
    id: 5,
    category: 'Church Fellowships',
    tag: 'All Fellowships',
    question: 'Which Christian denominations and churches are supported on Covenant Nest?',
    answer:
      'We proudly support devout Christian families across all major denominations in Bidar, Karnataka, Telangana, and beyond — including Methodist Church in India (MCI), Church of South India (CSI), Roman Catholic (RC), Baptist, Pentecostal / Assemblies of God / Born-Again, Mar Thoma, and Bible-believing Protestant and independent fellowships.',
  },
  {
    id: 6,
    category: 'Family & Registration',
    tag: '100% Free Join',
    question: 'Is registration completely free?',
    answer:
      'Yes, 100% free. You can create your matrimonial profile, upload verified photos, declare your church affiliation and parish, describe education and profession, and receive genuine match recommendations without paying any registration fee.',
  },
  {
    id: 7,
    category: 'Church Fellowships',
    tag: 'Pastor Validation',
    question: 'How does pastoral and church verification work?',
    answer:
      'Families can provide church parish details or reference letters from their local pastor or presbyter. Our verification desk cross-verifies church affiliation to maintain a sanctuary of genuine, devout believers.',
  },
  {
    id: 8,
    category: 'Commitment & Plans',
    tag: 'Flexible Plans',
    question: 'Can I upgrade my plan or request personalized matrimonial assistance?',
    answer:
      'Yes. While browsing and registering are free, families desiring direct phone unlocks, relationship manager matchmaking, and highlighted profile placement can upgrade anytime under our affordable membership plans.',
  },
];

const categories = [
  'All',
  'Family & Registration',
  'Privacy & Safety',
  'Commitment & Plans',
  'Church Fellowships',
];

export default function FAQPage() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredFaqs = useMemo(() => {
    return faqList.filter((item) => {
      const matchesCategory =
        selectedCategory === 'All' || item.category === selectedCategory;
      const matchesSearch =
        searchQuery.trim() === '' ||
        item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.tag.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <div className="min-h-screen bg-[#fdfbf7] text-[#1e1b18] font-sans">
      {/* Compact Hero Header */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#f8f3eb] via-[#fbf7f0] to-[#fdfbf7] border-b border-[#ebdcc8] py-7 sm:py-9">
        {/* Subtle Ambient Gold Accents */}
        <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-96 h-40 bg-gradient-to-r from-amber-200/30 via-rose-200/20 to-amber-200/30 blur-2xl pointer-events-none" />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-3">
          {/* Heading */}
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#1e1b18] font-brand tracking-tight">
            Frequently Asked <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8c1936] to-[#b82d4f]">Questions</span>
          </h1>

          <p className="text-xs sm:text-sm text-stone-600 max-w-xl mx-auto leading-normal">
            Transparent answers on privacy, church denominations, parental registration, and our sacred matrimonial journey.
          </p>

          {/* Compact Live Search Bar */}
          <div className="pt-2 max-w-md mx-auto">
            <div className="relative flex items-center">
              <span className="absolute left-3.5 text-[#8c1936]">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setOpenIdx(0);
                }}
                placeholder="Search questions (e.g. privacy, plans, parents)..."
                className="w-full text-xs sm:text-sm pl-10 pr-9 py-2 rounded-full bg-white border border-[#e2d5c3] text-[#1e1b18] placeholder-stone-400 focus:outline-none focus:border-[#8c1936] focus:ring-2 focus:ring-[#8c1936]/10 shadow-xs transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 text-stone-400 hover:text-stone-600 text-xs font-bold p-1"
                  aria-label="Clear search"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Compact Category Pills */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 pt-2">
            {categories.map((cat) => {
              const active = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => {
                    setSelectedCategory(cat);
                    setOpenIdx(0);
                  }}
                  className={`text-xs font-semibold px-3.5 py-1.5 rounded-full transition-all duration-150 cursor-pointer ${
                    active
                      ? 'bg-gradient-to-r from-[#8c1936] to-[#a31d40] text-white shadow-xs font-bold'
                      : 'bg-white text-stone-700 hover:text-[#8c1936] hover:bg-stone-50 border border-[#e5d8c7] shadow-2xs'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Compact FAQ Accordion List */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {filteredFaqs.length === 0 ? (
          <div className="bg-white rounded-2xl border border-[#e5d8c7] p-8 text-center space-y-3">
            <span className="text-2xl">🔍</span>
            <p className="text-sm font-bold text-stone-800">No questions found matching &ldquo;{searchQuery}&rdquo;</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
              }}
              className="text-xs font-bold text-[#8c1936] hover:underline"
            >
              Reset filters &amp; view all FAQs
            </button>
          </div>
        ) : (
          <div className="space-y-2.5">
            {filteredFaqs.map((faq, idx) => {
              const isOpen = openIdx === idx;
              return (
                <div
                  key={faq.id}
                  className={`rounded-xl border transition-all duration-200 overflow-hidden ${
                    isOpen
                      ? 'bg-white border-[#c59b27]/70 shadow-sm ring-1 ring-[#c59b27]/20'
                      : 'bg-white/90 border-[#e5d8c7] hover:border-[#c59b27]/50 shadow-2xs'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setOpenIdx(isOpen ? null : idx)}
                    className="w-full text-left p-3.5 sm:p-4 flex items-center justify-between gap-3.5 cursor-pointer hover:bg-stone-50/50 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {/* Refined Number Badge */}
                      <span
                        className={`w-6 h-6 rounded-lg text-xs flex items-center justify-center font-bold shrink-0 transition-colors ${
                          isOpen
                            ? 'bg-[#8c1936] text-white'
                            : 'bg-stone-100 text-stone-600 border border-stone-200'
                        }`}
                      >
                        {faq.id}
                      </span>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#8c1936] bg-[#8c1936]/8 px-2 py-0.5 rounded">
                            {faq.tag}
                          </span>
                        </div>
                        <h3 className="font-semibold text-sm sm:text-base text-stone-900 leading-snug">
                          {faq.question}
                        </h3>
                      </div>
                    </div>

                    {/* Smooth Chevron Indicator */}
                    <span
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-transform duration-200 ${
                        isOpen
                          ? 'bg-[#8c1936] text-white rotate-180'
                          : 'bg-stone-100 text-stone-500 hover:bg-stone-200'
                      }`}
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                      </svg>
                    </span>
                  </button>

                  {isOpen && (
                    <div className="px-4 pb-3.5 pt-1 text-xs sm:text-[13.5px] text-stone-700 leading-relaxed border-t border-[#f0e6d6] bg-gradient-to-b from-[#fbf8f2]/60 to-white pl-12">
                      <p>{faq.answer}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Compact Help & Support Banner */}
        <div className="mt-7 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-50/90 via-[#fdfbf7] to-rose-50/80 border border-[#e5d8c7] shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-center sm:text-left">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#8c1936] to-[#b82d4f] text-white flex items-center justify-center shrink-0 shadow-xs">
              <svg className="w-5 h-5 text-amber-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <div>
              <h4 className="text-sm font-bold text-stone-900">
                Have more questions or need family assistance?
              </h4>
              <p className="text-xs text-stone-600">
                Our matrimonial team walks beside your family with pastoral reverence and strict confidentiality.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Link
              href="/register"
              className="px-4 py-2 rounded-full bg-[#8c1936] hover:bg-[#771932] text-white text-xs font-bold shadow-xs transition-all"
            >
              Join Free →
            </Link>
            <Link
              href="/about"
              className="px-4 py-2 rounded-full bg-white hover:bg-stone-50 text-stone-800 text-xs font-semibold border border-[#d8cabb] shadow-2xs transition-all"
            >
              About Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
