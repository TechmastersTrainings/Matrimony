import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'Privacy Policy | Shalom — Christian Matrimony',
  description: 'Official Privacy Policy and DPDP Act 2023 compliance guidelines for Shalom Christian Matrimony.',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#fdfbf7] text-[#1e1b18] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white border border-[#ece2d1] rounded-3xl p-6 sm:p-10 shadow-sm space-y-8">
        {/* Header */}
        <div className="border-b border-charcoal-100 pb-6 space-y-2 text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-800">
            DPDP Act 2023 &amp; IT Act 2000 Compliance
          </span>
          <h1 className="font-brand text-3xl sm:text-4xl font-extrabold text-slate-900">
            Privacy Policy
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Last Updated: September 2026 • Shalom Christian Matrimony
          </p>
        </div>

        {/* 1. Introduction */}
        <div className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 font-brand">
            1. Introduction
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Welcome to Shalom (<a href="https://covenantnest.techmaster.space" className="text-cyan-900 underline font-semibold">covenantnest.techmaster.space</a>), a faith-based matrimonial platform operated by <strong>Techmasters Innovations Private Limited</strong>, headquartered in Bidar, Karnataka. We are committed to protecting your privacy and handling your personal data with the highest level of sacred reverence and security, in compliance with the Information Technology Act, 2000, and the Digital Personal Data Protection (DPDP) Act, 2023.
          </p>
        </div>

        {/* 2. Information We Collect */}
        <div className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 font-brand">
            2. Information We Collect
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            To ensure a safe and genuine community, we collect:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
            <li>
              <strong>Personal Information:</strong> Name, age, gender, denomination, parish/church details, education, and career information.
            </li>
            <li>
              <strong>Contact Information:</strong> Phone number and email address (kept strictly encrypted and hidden until mutual consent).
            </li>
            <li>
              <strong>Verification Documents:</strong> Government-issued ID (Aadhaar/PAN) and faith credentials (Baptism certificate or Pastor&apos;s recommendation) solely for identity and profile verification.
            </li>
            <li>
              <strong>Technical Data:</strong> IP address, device type, and browser information for security and anti-fraud monitoring.
            </li>
          </ul>
        </div>

        {/* 3. How We Use Your Information */}
        <div className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 font-brand">
            3. How We Use Your Information
          </h2>
          <ul className="list-disc pl-5 space-y-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
            <li>To create and manage your sacred matrimonial profile.</li>
            <li>To facilitate prayerful, denomination-based matching with other verified members.</li>
            <li>To verify your identity and prevent fake profiles or fraudulent activities.</li>
            <li>To communicate important updates regarding your account or platform security.</li>
          </ul>
        </div>

        {/* 4. Our Strict "No-Sharing" Guarantee */}
        <div className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 font-brand">
            4. Our Strict &ldquo;No-Sharing&rdquo; Guarantee
          </h2>
          <ul className="list-disc pl-5 space-y-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
            <li>
              We <strong>DO NOT</strong> sell, rent, or trade your personal data to any third party, advertiser, or external agency.
            </li>
            <li>
              Your phone number, family address, and confidential biodata are never visible to other users unless both parties explicitly grant mutual consent through the platform.
            </li>
            <li>
              We do not allow public search engine crawling or indexing of our members&apos; profiles.
            </li>
          </ul>
        </div>

        {/* 5. Data Security */}
        <div className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 font-brand">
            5. Data Security
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            We employ enterprise-grade encryption, secure servers, and daily anti-scraping measures to protect your data from unauthorized access, loss, or misuse.
          </p>
        </div>

        {/* 6. Your Rights */}
        <div className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 font-brand">
            6. Your Rights
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Under the Digital Personal Data Protection (DPDP) Act, 2023, you have the right to access, correct, or request the deletion of your personal data. To do so, please contact our Grievance Officer.
          </p>
        </div>

        {/* 7. Contact Us & Governance */}
        <div className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 font-brand">
            7. Contact Us &amp; Grievance Redressal
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            For any privacy concerns, data deletion requests, or grievances, contact our designated officer:
          </p>
          <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 text-xs sm:text-sm text-slate-800 space-y-1">
            <p className="font-bold text-slate-900">
              Grievance Officer: Mr. Sachin Anil Themgyale (Managing Director)
            </p>
            <p>Director: Mrs. Rekha Sachin Themgyale</p>
            <p>
              Email:{' '}
              <a href="mailto:grievance@techmastersinnovations.in" className="text-cyan-900 underline font-semibold">
                grievance@techmastersinnovations.in
              </a>
            </p>
            <p>
              General Contact:{' '}
              <a href="mailto:info@techmastersinnovations.in" className="text-cyan-900 underline font-semibold">
                info@techmastersinnovations.in
              </a>{' '}
              |{' '}
              <a href="mailto:techmastersinnovations@gmail.com" className="text-cyan-900 underline font-semibold">
                techmastersinnovations@gmail.com
              </a>
            </p>
            <p>
              Platform Support:{' '}
              <a href="mailto:support@techmastersinnovations.in" className="text-cyan-900 underline font-semibold">
                support@techmastersinnovations.in
              </a>
            </p>
            <p>
              Registered Address: Techmasters Innovations Pvt. Ltd., Mailoor Road, Bidar, Karnataka - 585403, India.
            </p>
          </div>
        </div>

        {/* Links */}
        <div className="pt-6 border-t border-charcoal-100 flex flex-wrap justify-between items-center gap-4 text-xs">
          <Link href="/" className="text-cyan-900 hover:underline font-bold">
            ← Return to Home
          </Link>
          <div className="flex gap-4">
            <Link href="/terms" className="text-cyan-900 hover:underline font-bold">
              Terms of Service
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
