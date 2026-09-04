import React from 'react';

export function SuccessStories() {
  const testimonies = [
    {
      denomination: 'Methodist Church',
      quote:
        'Finding a life partner who shares not just our faith and church values, but our vision for family and ministry is a true blessing.',
      tag: 'Blessed Union',
    },
    {
      denomination: 'CSI Fellowship',
      quote:
        'A faith-first platform where families can connect with complete peace of mind, privacy, and spiritual alignment.',
      tag: 'Verified Community',
    },
    {
      denomination: 'Roman Catholic',
      quote:
        'The controlled contact reveal policy gave us complete privacy and safety at every step of our journey.',
      tag: 'Family Centered',
    },
  ];

  return (
    <section id="success-stories" className="py-20 bg-slate-950 border-t border-slate-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
            Community Pillars & Values
          </span>
          <h2 className="font-brand text-3xl sm:text-4xl font-bold text-white mt-2 tracking-tight">
            Built on Faith, Integrity & Trust
          </h2>
          <p className="text-sm text-slate-400 mt-2">
            Connecting Christian families across Bidar, Karnataka and Pan-India with verified credentials.
          </p>
        </div>

        {/* Stories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonies.map((s, idx) => (
            <div
              key={idx}
              className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1.5"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-lg">
                    ✝️
                  </span>
                  <span className="bg-slate-800 text-amber-400 text-[10px] font-bold px-3 py-1 rounded-full border border-amber-500/30">
                    {s.tag}
                  </span>
                </div>
                
                <h3 className="font-brand text-lg font-bold text-white">
                  {s.denomination}
                </h3>
                
                <p className="text-xs text-slate-300 italic leading-relaxed">
                  &ldquo;{s.quote}&rdquo;
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                <span>Verified Guidelines</span>
                <span className="text-emerald-400 font-semibold">100% Genuine</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default SuccessStories;
