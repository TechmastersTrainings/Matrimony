import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'Terms of Service | CovenantNest — Christian Matrimony',
  description: 'Official Terms of Service and user conduct agreement for CovenantNest Christian Matrimony.',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#fdfbf7] text-[#1e1b18] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white border border-[#ece2d1] rounded-3xl p-6 sm:p-10 shadow-sm space-y-8">
        {/* Header */}
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

        {/* 1. Acceptance of Terms */}
        <div className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 font-brand">
            1. Acceptance of Terms
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            By registering on Covenant Nest (<a href="https://covenantnest.techmaster.space" className="text-cyan-900 underline font-semibold">covenantnest.techmaster.space</a>), you agree to these Terms of Service. If you do not agree, please do not use this platform.
          </p>
        </div>

        {/* 2. Eligibility */}
        <div className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 font-brand">
            2. Eligibility
          </h2>
          <ul className="list-disc pl-5 space-y-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
            <li>You must be at least 18 years of age.</li>
            <li>You must be a practicing Christian seeking holy matrimony in accordance with your faith and family values.</li>
            <li>You agree to provide truthful, accurate, and complete information during registration.</li>
          </ul>
        </div>

        {/* 3. User Conduct & Sacred Covenant */}
        <div className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 font-brand">
            3. User Conduct &amp; Sacred Covenant
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            You agree <strong>NOT</strong> to:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
            <li>Create fake, duplicate, or misleading profiles.</li>
            <li>Use the platform for commercial purposes, spam, or data harvesting.</li>
            <li>Harass, abuse, or send inappropriate messages to other members.</li>
            <li>Share financial information or request money from other members.</li>
          </ul>
        </div>

        {/* 4. Verification & Account Termination */}
        <div className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 font-brand">
            4. Verification &amp; Account Termination
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Covenant Nest reserves the right to request additional verification documents at any time. We reserve the right to suspend or permanently terminate any account that violates these terms, engages in fraudulent behavior, or disrespects the dignity of the community, without prior notice.
          </p>
        </div>

        {/* 5. Limitation of Liability */}
        <div className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 font-brand">
            5. Limitation of Liability
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            While we strive to verify all profiles, Covenant Nest and Techmasters Innovations Pvt. Ltd. act only as a facilitator. We are not liable for the actions, intentions, or outcomes of interactions between members. Users are strongly advised to involve their families and pastoral guides before proceeding to any physical meetings or financial commitments.
          </p>
        </div>

        {/* 6. Modifications */}
        <div className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 font-brand">
            6. Modifications
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            We may update these terms periodically. Continued use of the platform constitutes acceptance of the revised terms.
          </p>
        </div>

        {/* Corporate Governance */}
        <div className="p-4 rounded-xl bg-cyan-50/70 border border-cyan-200 text-xs sm:text-sm text-slate-800 space-y-1">
          <p className="font-bold text-slate-900">Corporate Governance:</p>
          <p>Techmasters Innovations Private Limited</p>
          <p>Managing Director: Mr. Sachin Anil Themgyale | Director: Mrs. Rekha Sachin Themgyale</p>
          <p>Mailoor Road, Bidar, Karnataka - 585403, India.</p>
          <p>
            Contact:{' '}
            <a href="mailto:info@techmastersinnovations.in" className="text-cyan-900 underline font-semibold">
              info@techmastersinnovations.in
            </a>{' '}
            |{' '}
            <a href="mailto:support@techmastersinnovations.in" className="text-cyan-900 underline font-semibold">
              support@techmastersinnovations.in
            </a>
          </p>
        </div>

        {/* Links */}
        <div className="pt-6 border-t border-charcoal-100 flex flex-wrap justify-between items-center gap-4 text-xs">
          <Link href="/" className="text-cyan-900 hover:underline font-bold">
            ← Return to Home
          </Link>
          <div className="flex gap-4">
            <Link href="/privacy" className="text-cyan-900 hover:underline font-bold">
              Privacy Policy
            </Link>
            <span className="text-slate-300">•</span>
            <Link href="/refund-policy" className="text-cyan-900 hover:underline font-bold">
              Refund &amp; Cancellation Policy
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
