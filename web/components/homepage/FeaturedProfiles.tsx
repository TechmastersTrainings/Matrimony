'use client';

import React from 'react';
import Link from 'next/link';

export function FeaturedProfiles() {
  const sampleProfiles = [
    {
      id: 1,
      name: 'Sarah',
      age: 26,
      city: 'Bidar',
      state: 'Karnataka',
      profession: 'Software Engineer (B.Tech)',
      denomination: 'Methodist',
      church: 'Centenary Methodist Church',
      photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80',
    },
    {
      id: 2,
      name: 'Joshua',
      age: 29,
      city: 'Bengaluru',
      state: 'Karnataka',
      profession: 'Senior Product Manager (MBA)',
      denomination: 'CSI',
      church: "St. Mark's Cathedral",
      photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=80',
    },
    {
      id: 3,
      name: 'Rebecca',
      age: 25,
      city: 'Bidar',
      state: 'Karnataka',
      profession: 'Medical Doctor (MBBS)',
      denomination: 'Roman Catholic',
      church: 'St. Joseph Church',
      photo: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600&auto=format&fit=crop&q=80',
    },
    {
      id: 4,
      name: 'David',
      age: 28,
      city: 'Hyderabad',
      state: 'Telangana',
      profession: 'Civil Engineer (M.Tech)',
      denomination: 'Baptist',
      church: 'Centenary Baptist Church',
      photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&auto=format&fit=crop&q=80',
    },
  ];

  return (
    <section className="py-20 bg-white border-t border-[#E2E8F0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#C9A227]">
              Curated Profiles
            </span>
            <h2 className="font-serif-heading text-3xl sm:text-4xl font-bold text-[#172554] mt-2 tracking-tight">
              Meet People Who Share Your Values
            </h2>
            <p className="text-sm text-[#64748B] mt-2">
              Browse genuine, church-verified Christian brides and grooms with spiritual and family alignment.
            </p>
          </div>

          <div className="mt-6 md:mt-0">
            <Link
              href="/discover"
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#172554] hover:text-[#1D4ED8] group bg-[#FAF9F6] border border-[#E2E8F0] px-5 py-2.5 rounded-full shadow-2xs hover:bg-white transition-all"
            >
              <span>View All Profiles</span>
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </div>
        </div>

        {/* Profile Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {sampleProfiles.map((p) => (
            <div
              key={p.id}
              className="bg-white border border-[#E2E8F0] rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1.5"
            >
              {/* Photo Area */}
              <div className="relative aspect-4/5 bg-stone-100 overflow-hidden">
                <img
                  src={p.photo}
                  alt={`${p.name}, ${p.profession}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#172554]/80 via-transparent to-transparent opacity-80" />

                {/* Badges */}
                <div className="absolute top-3 left-3 flex gap-2">
                  <span className="bg-white/95 backdrop-blur-xs text-[#172554] text-[10px] font-bold px-2.5 py-1 rounded-full shadow-xs border border-white/40">
                    {p.denomination}
                  </span>
                </div>

                <div className="absolute top-3 right-3">
                  <span className="bg-emerald-600/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs flex items-center gap-1">
                    <span>✓</span>
                    <span>Verified</span>
                  </span>
                </div>

                {/* Text inside overlay */}
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <h3 className="font-serif-heading text-lg font-bold text-white">
                    {p.name}, {p.age}
                  </h3>
                  <p className="text-[11px] text-stone-200 truncate">
                    📍 {p.city}, {p.state}
                  </p>
                </div>
              </div>

              {/* Card Footer Details */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-1.5 text-xs text-[#64748B]">
                  <p className="font-medium text-[#17202A] truncate">
                    💼 {p.profession}
                  </p>
                  <p className="text-[11px] truncate">
                    ⛪ {p.church}
                  </p>
                </div>

                <Link
                  href="/discover"
                  className="w-full text-center py-2.5 rounded-xl bg-[#FAF9F6] hover:bg-[#172554] text-[#172554] hover:text-white border border-[#E2E8F0] text-xs font-semibold transition-colors block"
                >
                  View Profile Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
