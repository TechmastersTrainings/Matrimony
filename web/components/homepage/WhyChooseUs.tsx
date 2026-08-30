import React from 'react';

export function WhyChooseUs() {
  const features = [
    {
      icon: '🛡️',
      title: 'Verified Profiles',
      description:
        'Every profile undergoes manual verification of denomination, church background, and 5+ photos before becoming active.',
    },
    {
      icon: '🔒',
      title: 'Privacy First',
      description:
        'Personal contact numbers and email addresses remain 100% private until both individuals give explicit mutual consent.',
    },
    {
      icon: '✨',
      title: 'Meaningful Connections',
      description:
        'Discover candidates based on spiritual alignment, Christian lifestyle, family values, and partner preferences.',
    },
    {
      icon: '🤝',
      title: 'Safe & Respectful',
      description:
        'A dedicated Christian community free from dating-app clutter, with robust moderation, reporting, and instant blocking.',
    },
  ];

  return (
    <section className="py-20 bg-[#FAF9F6] border-t border-[#E2E8F0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-[#C9A227]">
            Trust & Excellence
          </span>
          <h2 className="font-serif-heading text-3xl sm:text-4xl font-bold text-[#172554] mt-2 tracking-tight">
            Why Christian Families Trust Us
          </h2>
          <p className="text-sm text-[#64748B] mt-2">
            Built with uncompromising standards for privacy, authenticity, and Christian family values.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((f, idx) => (
            <div
              key={idx}
              className="bg-white border border-[#E2E8F0] rounded-3xl p-8 shadow-xs hover:shadow-lg transition-all duration-300 group hover:-translate-y-1"
            >
              <div className="w-12 h-12 rounded-2xl bg-[#FAF9F6] border border-[#E2E8F0] flex items-center justify-center text-xl mb-6 shadow-2xs group-hover:scale-110 transition-transform">
                {f.icon}
              </div>

              <h3 className="font-serif-heading text-lg font-bold text-[#172554] mb-3">
                {f.title}
              </h3>

              <p className="text-xs text-[#64748B] leading-relaxed">
                {f.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
