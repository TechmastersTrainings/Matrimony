'use client';

import React, { Suspense } from 'react';
import { CreateProfileWizard } from '../../../components/profile/CreateProfileWizard';

export default function CreateProfilePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center bg-[#fdfbf7] text-charcoal-900">
          <div className="w-12 h-12 rounded-2xl bg-burgundy-700 text-gold-300 flex items-center justify-center font-bold animate-pulse mb-4 shadow-md">
            CM
          </div>
          <h2 className="text-base font-serif font-bold text-charcoal-700">Loading Profile Setup...</h2>
        </div>
      }
    >
      <CreateProfileWizard />
    </Suspense>
  );
}
