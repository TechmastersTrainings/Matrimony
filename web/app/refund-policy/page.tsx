import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'Refund & Cancellation Policy | CovenantNest — Christian Matrimony',
  description: 'Official Refund & Cancellation Policy for CovenantNest, operated by Techmasters Innovations Private Limited.',
};

export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen bg-[#fdfbf7] text-[#1e1b18] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white border border-[#ece2d1] rounded-3xl p-6 sm:p-10 shadow-sm space-y-8">
        {/* Header */}
        <div className="border-b border-charcoal-100 pb-6 space-y-2 text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-800">
            Fairness, Transparency &amp; Trust
          </span>
          <h1 className="font-brand text-3xl sm:text-4xl font-extrabold text-slate-900">
            Refund &amp; Cancellation Policy
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Last Updated: September 2026 • CovenantNest Christian Matrimony
          </p>
        </div>

        {/* Section 1 */}
        <div className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 font-brand">
            1. Free Registration
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Creating a profile, browsing verified matches, and expressing holy interest on CovenantNest is completely free of charge. No mandatory registration fees or initial consultation charges are levied on Christian brides, grooms, or families.
          </p>
        </div>

        {/* Section 2 */}
        <div className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 font-brand">
            2. Cancellation of Account
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            You may delete your account and all associated personal data at any time by navigating to your Profile Settings or by emailing{' '}
            <a href="mailto:support@techmastersinnovations.in" className="text-cyan-900 underline font-semibold">
              support@techmastersinnovations.in
            </a>
            . Upon deletion, your profile will be permanently removed from our active matching database within 7 days.
          </p>
        </div>

        {/* Section 3 */}
        <div className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 font-brand">
            3. Refund Policy for Future Premium Features
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            If CovenantNest introduces optional premium features (e.g., priority matching or featured profiles), please note:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
            <li>
              All payments made for digital services are non-refundable once the service has been rendered (e.g., once contact details have been unlocked or a premium badge has been activated).
            </li>
            <li>
              In the rare event of a technical failure on our end that prevents a paid service from being delivered, a full refund will be processed to the original payment method within 5–7 business days.
            </li>
          </ul>
        </div>

        {/* Section 4 */}
        <div className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 font-brand">
            4. Disputes &amp; Grievance Redressal
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Any disputes regarding payments, cancellations, or service delivery will be handled by our designated Grievance Officer, whose decision shall be final and binding.
          </p>
          <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 text-xs sm:text-sm text-slate-800 space-y-1">
            <p className="font-bold text-slate-900">Grievance Officer:</p>
            <p>Mr. Sachin Anil Themgyale (Managing Director)</p>
            <p>
              Email:{' '}
              <a href="mailto:grievance@techmastersinnovations.in" className="text-cyan-900 underline font-semibold">
                grievance@techmastersinnovations.in
              </a>
            </p>
            <p>
              Support:{' '}
              <a href="mailto:support@techmastersinnovations.in" className="text-cyan-900 underline font-semibold">
                support@techmastersinnovations.in
              </a>
            </p>
            <p>Techmasters Innovations Pvt. Ltd., Mailoor Road, Bidar, Karnataka - 585403, India.</p>
          </div>
        </div>

        {/* Corporate Footer Links */}
        <div className="pt-6 border-t border-charcoal-100 flex flex-wrap justify-between items-center gap-4 text-xs">
          <Link href="/" className="text-cyan-900 hover:underline font-bold">
            ← Return to Home
          </Link>
          <div className="flex gap-4">
            <Link href="/privacy" className="text-cyan-900 hover:underline font-bold">
              Privacy Policy
            </Link>
            <span className="text-slate-300">•</span>
            <Link href="/terms" className="text-cyan-900 hover:underline font-bold">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
