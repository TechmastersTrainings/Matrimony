import React from 'react';

export function SuccessStories() {
  const stories = [
    {
      names: 'Daniel & Priya',
      location: 'Bidar & Hyderabad',
      denomination: 'Methodist Church',
      testimonial:
        'We found someone who shared not just our faith and church values, but our vision for family and ministry. The profile verification gave our parents complete peace of mind.',
      photo: 'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?w=600&auto=format&fit=crop&q=80',
    },
    {
      names: 'Ebenezer & Sharon',
      location: 'Bengaluru & Bidar',
      denomination: 'CSI Fellowship',
      testimonial:
        'Our conversations started with private in-app chat where we connected over scripture and career goals. Today we are blessed to build a God-fearing home together.',
      photo: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=600&auto=format&fit=crop&q=80',
    },
    {
      names: 'Mathew & Grace',
      location: 'Bidar & Mumbai',
      denomination: 'Roman Catholic',
      testimonial:
        'The controlled contact reveal was wonderful. We felt safe, respected, and supported at every stage. We thank God for leading us to this platform.',
      photo: 'https://images.unsplash.com/photo-1529634806980-85c3dd6d34ac?w=600&auto=format&fit=crop&q=80',
    },
  ];

  return (
    <section id="success-stories" className="py-20 bg-[#FAF9F6] border-t border-[#E2E8F0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-[#C9A227]">
            Real Testimonies
          </span>
          <h2 className="font-serif-heading text-3xl sm:text-4xl font-bold text-[#172554] mt-2 tracking-tight">
            Stories That Began With Faith
          </h2>
          <p className="text-sm text-[#64748B] mt-2">
            Celebrating Christian couples who trusted God&apos;s guidance and found their lifelong companions.
          </p>
        </div>

        {/* Stories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stories.map((s, idx) => (
            <div
              key={idx}
              className="bg-white border border-[#E2E8F0] rounded-3xl overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1.5"
            >
              <div className="aspect-4/3 overflow-hidden bg-stone-100 relative">
                <img
                  src={s.photo}
                  alt={s.names}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-4 right-4 text-white">
                  <h3 className="font-serif-heading text-lg font-bold">{s.names}</h3>
                  <p className="text-[11px] text-stone-200">
                    {s.denomination} • {s.location}
                  </p>
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between">
                <p className="text-xs text-[#17202A]/80 italic leading-relaxed">
                  &quot;{s.testimonial}&quot;
                </p>

                <div className="mt-6 pt-4 border-t border-[#E2E8F0] flex items-center justify-between text-[11px] text-[#64748B]">
                  <span className="font-semibold text-[#172554]">✝ Married with Praise</span>
                  <span className="text-[#C9A227] font-bold">★★★★★</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
