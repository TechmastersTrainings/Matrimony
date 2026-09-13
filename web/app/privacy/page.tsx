import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'Privacy Policy | CovenantNest — Christian Matrimony',
  description: 'Privacy Policy and data protection guidelines for CovenantNest Christian Matrimony.',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#fdfbf7] text-[#1e1b18] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white border border-[#ece2d1] rounded-3xl p-6 sm:p-10 shadow-sm space-y-8">
        <div className="border-b border-charcoal-100 pb-6 space-y-2 text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-800">
            Confidentiality &amp; Data Security
          </span>
          <h1 className="font-brand text-3xl sm:text-4xl font-extrabold text-slate-900">
            Privacy Policy
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Last Updated: September 2026 • CovenantNest Christian Matrimony
          </p>
        </div>

        {/* Section 1 */}
        <div className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 font-brand">
            1. Zero Unsolicited Contact Reveals Guarantee
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            At CovenantNest, protecting member confidentiality is our highest priority. Phone numbers and email addresses are <strong>never sold, leased, or disclosed</strong> to any user simply by paying for a plan. Contact sharing requires both members to mutually accept interest and confirm their explicit consent.
          </p>
        </div>

        {/* Section 2 */}
        <div className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 font-brand">
            2. Photo and Identity Privacy
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Profile photos uploaded by verified candidates are protected from unauthorized scraping, public search indexing, or external syndication. Members retain full control over their uploaded photos through their personal dashboard.
          </p>
        </div>

        {/* Section 3 */}
        <div className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 font-brand">
            3. Information We Collect
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            We collect basic contact details (phone number and email for verification), matrimonial profile details (date of birth, education, profession, church denomination, parish), and optional family background information solely to facilitate safe, faith-aligned matrimonial matching.
          </p>
        </div>

        {/* Section 4 */}
        <div className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 font-brand">
            4. Enterprise Security Standards
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            All user authentication is safeguarded using industry-standard JWT encryption and bcrypt password hashing. Financial transactions are conducted over 128-bit SSL encrypted channels via RBI-authorized payment processors (Razorpay).
          </p>
        </div>

        {/* Section 5 */}
        <div className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 font-brand">
            5. Data Protection Officer &amp; Inquiries
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            For questions regarding personal data privacy, account deactivation, or information updates, contact our Data Protection Team at <a href="mailto:info@techmastersinnovations.in" className="text-cyan-900 underline font-semibold">info@techmastersinnovations.in</a>, Techmasters Innovations Private Limited, Mailoor Road, Bidar, Karnataka - 585403.
          </p>
        </div>

        <div className="pt-6 border-t border-charcoal-100 flex justify-between items-center text-xs">
          <Link href="/" className="text-cyan-900 hover:underline font-bold">
            ← Return to Home
          </Link>
          <Link href="/terms" className="text-cyan-900 hover:underline font-bold">
            View Terms of Service →
          </Link>
        </div>
      </div>
    </div>
  );
}
