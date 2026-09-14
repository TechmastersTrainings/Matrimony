import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'Terms of Service | CovenantNest — Christian Matrimony',
  description: 'Terms of service and code of conduct for CovenantNest Christian Matrimony platform.',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#fdfbf7] text-[#1e1b18] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white border border-[#ece2d1] rounded-3xl p-6 sm:p-10 shadow-sm space-y-8">
        <div className="border-b border-charcoal-100 pb-6 space-y-2 text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-cyan-800">
            Legal &amp; Community Guidelines
          </span>
          <h1 className="font-brand text-3xl sm:text-4xl font-extrabold text-slate-900">
            Terms of Service
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Last Updated: September 2026 • CovenantNest Christian Matrimony
          </p>
        </div>

        {/* Section 1 */}
        <div className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 font-brand">
            1. Sacred Matrimonial Purpose
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            CovenantNest is exclusively intended for Christian brides, bridegrooms, and their families seeking honorable, God-ordained holy matrimony. The platform strictly prohibits casual dating, unsolicited solicitation, commercial advertising, or fraudulent representation.
          </p>
        </div>

        {/* Section 2 */}
        <div className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 font-brand">
            2. Strict Mutual Consent Privacy Policy
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            In accordance with our strict privacy framework, contact phone numbers and email addresses are <strong>never</strong> revealed or sold to any user simply upon purchasing a subscription. Contact information remains encrypted and locked until <strong>both</strong> candidates mutually accept matrimonial interest and provide explicit consent to exchange contact details.
          </p>
        </div>

        {/* Section 3 */}
        <div className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 font-brand">
            3. Genuine Candidate Verification
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Users agree to submit truthful, accurate personal, educational, church fellowship, and familial information. Any attempt to create fictitious, impersonated, or misleading profiles will result in immediate termination of account access without refund.
          </p>
        </div>

        {/* Section 4 */}
        <div className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 font-brand">
            4. Payments and Subscription Plans
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            All subscription payments (Basic, Standard, and Premium) are processed securely through certified bank-grade gateways (Cashfree Payments). Memberships grant access to in-app messaging, verified profile details, and mutual interest requests for the designated duration.
          </p>
        </div>

        {/* Section 5 */}
        <div className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 font-brand">
            5. Platform Governance &amp; Headquarters
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            CovenantNest is engineered, owned, and operated by <strong>Techmasters Innovations Private Limited</strong>, Mailoor Road, Bidar, Karnataka - 585403. For inquiries, please contact <a href="mailto:info@techmastersinnovations.in" className="text-cyan-900 underline font-semibold">info@techmastersinnovations.in</a>.
          </p>
        </div>

        <div className="pt-6 border-t border-charcoal-100 flex justify-between items-center text-xs">
          <Link href="/" className="text-cyan-900 hover:underline font-bold">
            ← Return to Home
          </Link>
          <Link href="/privacy" className="text-cyan-900 hover:underline font-bold">
            View Privacy Policy →
          </Link>
        </div>
      </div>
    </div>
  );
}
