import React from 'react';

export function CommunitySection() {
  const pillars = [
    { title: 'Faith', desc: 'Christ-centered relationships grounded in prayer and church life.' },
    { title: 'Family', desc: 'Honoring parents and involving loved ones with respect and grace.' },
    { title: 'Values', desc: 'Shared lifestyle standards, moral integrity, and lifelong devotion.' },
    { title: 'Commitment', desc: 'Honest matrimonial intentions dedicated to sacred covenant marriage.' },
    { title: 'Community', desc: 'Uniting Christian denominations across Bidar, Karnataka, and India.' },
  ];

  return (
    <section className="py-20 bg-white border-t border-[#E2E8F0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-widest text-[#C9A227]">
            Shared Identity
          </span>
          <h2 className="font-serif-heading text-3xl sm:text-4xl font-bold text-[#172554] mt-2 tracking-tight">
            Built for Christian Families and Individuals
          </h2>
          <p className="text-sm text-[#64748B] mt-2">
            Upholding traditional Biblical values in a modern, secure, and respectful digital space.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {pillars.map((p, idx) => (
            <div
              key={idx}
              className="bg-[#FAF9F6] border border-[#E2E8F0] rounded-2xl p-5 text-center flex flex-col justify-between hover:border-[#C9A227]/50 transition-colors"
            >
              <div>
                <span className="w-8 h-8 rounded-full bg-[#172554] text-[#C9A227] flex items-center justify-center text-xs font-bold mx-auto mb-3">
                  ✝
                </span>
                <h3 className="font-serif-heading text-base font-bold text-[#172554] mb-1.5">
                  {p.title}
                </h3>
                <p className="text-[11px] text-[#64748B] leading-relaxed">
                  {p.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
