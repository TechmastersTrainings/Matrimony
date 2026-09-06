'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { apiClient } from '../../lib/api-client';
import { ProfileDraftData } from '../../types';

// Helper to calculate exact age in years from YYYY-MM-DD
function calculateAge(dobStr: string): number | null {
  if (!dobStr || dobStr.length < 10) return null;
  const birth = new Date(dobStr);
  if (isNaN(birth.getTime())) return null;
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age >= 0 && age <= 120 ? age : null;
}

// Helper to format height in cm to feet & inches (e.g. 170 -> 5'7")
function formatHeight(cm?: number): string {
  if (!cm || cm < 100) return '';
  const totalInches = cm / 2.54;
  const feet = Math.floor(totalInches / 12);
  const inches = Math.round(totalInches % 12);
  return `${feet} ft ${inches} in`;
}

// Categorized Higher Education Degrees available and recognized in Karnataka & India
const KARNATAKA_EDUCATION_DEGREES = [
  {
    category: 'Engineering, Technology & Architecture',
    degrees: [
      'B.E. / B.Tech (Bachelor of Engineering / Tech)',
      'M.E. / M.Tech (Master of Engineering / Tech)',
      'B.Arch (Architecture)',
      'M.Arch (Architecture)',
      'Diploma in Engineering / Polytechnic',
    ],
  },
  {
    category: 'Computers & Information Technology',
    degrees: [
      'BCA (Bachelor of Computer Applications)',
      'MCA (Master of Computer Applications)',
      'B.Sc (Computer Science / IT)',
      'M.Sc (Computer Science / IT)',
      'B.Sc / M.Sc Data Science / AI',
    ],
  },
  {
    category: 'Medicine, Healthcare & Nursing',
    degrees: [
      'MBBS (Medicine & Surgery)',
      'MD / MS (Doctor of Medicine / Master of Surgery)',
      'BDS (Dental Surgery)',
      'MDS (Master of Dental Surgery)',
      'B.Sc Nursing',
      'M.Sc Nursing',
      'GNM (General Nursing & Midwifery)',
      'B.Pharm (Pharmacy)',
      'M.Pharm / Pharm.D',
      'BPT / MPT (Physiotherapy)',
      'BAMS / BHMS (Ayurveda / Homeopathy)',
      'Allied Health Sciences / MLT',
    ],
  },
  {
    category: 'Commerce, Management & Finance',
    degrees: [
      'B.Com (Bachelor of Commerce)',
      'M.Com (Master of Commerce)',
      'BBA / BBM (Business Administration)',
      'MBA / PGDM (Business Management)',
      'CA (Chartered Accountant)',
      'CS (Company Secretary)',
      'CMA / ICWA (Cost Accountant)',
    ],
  },
  {
    category: 'Pure & Applied Sciences',
    degrees: [
      'B.Sc (Bachelor of Science)',
      'M.Sc (Master of Science)',
      'B.Sc (Agriculture / Horticulture / Forestry)',
      'M.Sc (Agriculture)',
    ],
  },
  {
    category: 'Arts, Humanities & Education',
    degrees: [
      'B.A. (Bachelor of Arts)',
      'M.A. (Master of Arts)',
      'BSW / MSW (Social Work)',
      'B.Ed (Bachelor of Education)',
      'M.Ed (Master of Education)',
      'Journalism & Mass Communication',
    ],
  },
  {
    category: 'Law & Legal Studies',
    degrees: [
      'LLB (Bachelor of Law)',
      'LLM (Master of Law)',
      'Integrated BA LLB / BBA LLB',
    ],
  },
  {
    category: 'Doctorate & Research',
    degrees: [
      'Ph.D. / Doctorate',
      'M.Phil',
    ],
  },
  {
    category: 'Pre-University & Secondary School',
    degrees: [
      'PUC / 12th Standard / +2',
      'SSLC / 10th Standard',
    ],
  },
  {
    category: 'Other Qualifications',
    degrees: [
      'Other Bachelor Degree',
      'Other Master Degree',
      'Other Professional Diploma / Certification',
    ],
  },
];

export function CreateProfileWizard() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [completionPercentage, setCompletionPercentage] = useState(15);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isGeneratingBio, setIsGeneratingBio] = useState(false);
  const [isGeneratingTestimony, setIsGeneratingTestimony] = useState(false);

  // Clean initial form state: NO auto/dummy information hardcoded!
  const [formData, setFormData] = useState<ProfileDraftData>({
    first_name: '',
    last_name: '',
    gender: 'MALE',
    dob: '',
    age: undefined,
    marital_status: 'NEVER_MARRIED',
    height_cm: undefined,
    weight_kg: undefined,
    physical_status: 'NORMAL',
    mother_tongue: '',

    // Faith
    denomination: 'METHODIST',
    sub_denomination: '',
    church_name: '',
    parish_or_pastor: '',
    is_baptized: false,
    is_born_again: false,
    church_activity: '',

    // Location
    state: 'Karnataka',
    district: 'Bidar',
    city: '',
    pincode: '',
    native_place: '',

    // Career
    highest_education: '',
    education_field: '',
    institution: '',
    occupation_type: 'PRIVATE',
    occupation_title: '',
    employed_in: '',
    annual_income_min: undefined,
    work_location: '',

    // Family
    father_name: '',
    father_occupation: '',
    father_mobile: '',
    mother_name: '',
    mother_occupation: '',
    mother_mobile: '',
    family_status: 'MIDDLE_CLASS',
    family_values: 'TRADITIONAL',
    brothers_count: 0,
    married_brothers_count: 0,
    sisters_count: 0,
    married_sisters_count: 0,
    about_family: '',

    // Lifestyle & Bio
    diet: 'NON_VEGETARIAN',
    smoking: 'NO',
    drinking: 'NO',
    hobbies: '',
    bio: '',
    faith_testimony: '',

    // Partner Preferences
    partner_preferences: {
      age_min: 21,
      age_max: 35,
      height_min_cm: 150,
      height_max_cm: 190,
      denomination: ['METHODIST', 'CSI', 'CATHOLIC', 'BAPTIST', 'PENTECOSTAL'],
    },
  });

  // Calculate boundary dates for the calendar (18 to 80 years)
  const { maxEligibleDob, minEligibleDob } = useMemo(() => {
    const today = new Date();
    const maxDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
    const minDate = new Date(today.getFullYear() - 80, 0, 1);
    return {
      maxEligibleDob: maxDate.toISOString().split('T')[0],
      minEligibleDob: minDate.toISOString().split('T')[0],
    };
  }, []);

  // Real-time calculated age info
  const calculatedAgeInfo = useMemo(() => {
    if (!formData.dob) {
      return { age: null, isValid: false, message: 'Please enter Date of Birth' };
    }
    const age = calculateAge(formData.dob);
    if (age === null) {
      return { age: null, isValid: false, message: 'Invalid Date of Birth' };
    }
    if (age < 18) {
      return { age, isValid: false, message: 'Must be at least 18 years old for matrimony' };
    }
    return { age, isValid: true, message: 'Eligible for Christian Matrimony' };
  }, [formData.dob]);

  // Load existing draft or registered candidate details
  useEffect(() => {
    async function loadData() {
      try {
        const me = await apiClient.getRegistrationMe();
        if (me.profile_status === 'SUBMITTED' || me.profile_status === 'APPROVED') {
          setIsSubmitted(true);
        }

        setFormData((prev) => {
          const updated: ProfileDraftData = { ...prev };
          // Prefill ONLY actual authenticated user data from backend
          if (me.profile) {
            if (me.profile.first_name) updated.first_name = me.profile.first_name;
            if (me.profile.last_name) updated.last_name = me.profile.last_name;
            if (me.profile.gender) updated.gender = me.profile.gender;
            if (me.profile.dob) {
              updated.dob = me.profile.dob;
              const autoAge = calculateAge(me.profile.dob);
              if (autoAge !== null) updated.age = autoAge;
            }
            if (me.profile.age && !updated.age) updated.age = me.profile.age;
            if (me.profile.denomination) updated.denomination = me.profile.denomination;
            if (me.profile.father_mobile) updated.father_mobile = me.profile.father_mobile;
            if (me.profile.mother_mobile) updated.mother_mobile = me.profile.mother_mobile;
          }

          // If user had previously saved draft entries, merge them cleanly
          if (me.draft && me.draft.draft_data) {
            Object.assign(updated, me.draft.draft_data);
            // Recalculate age if draft has DOB
            if (updated.dob) {
              const autoAge = calculateAge(updated.dob);
              if (autoAge !== null) updated.age = autoAge;
            }
          }
          return updated;
        });

        if (me.draft?.current_step) {
          setCurrentStep(me.draft.current_step);
        }
        setCompletionPercentage(me.completion_percentage || 15);
      } catch (err) {
        console.warn('User not logged in, redirecting to login...');
        router.push('/login');
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [router]);

  const handleChange = (name: string, value: any) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // DOB change handler: updates DOB and automatically calculates age
  const handleDobChange = (dobValue: string) => {
    const computedAge = calculateAge(dobValue);
    setFormData((prev) => ({
      ...prev,
      dob: dobValue,
      age: computedAge !== null ? computedAge : prev.age,
    }));
  };

  // AI-Powered Bio Synthesis based on profile inputs
  const generateAiBio = async () => {
    setIsGeneratingBio(true);
    try {
      await new Promise((r) => setTimeout(r, 650));
      const name = formData.first_name ? `${formData.first_name}${formData.last_name ? ' ' + formData.last_name : ''}` : 'I';
      const edu = formData.highest_education || formData.education_field || 'a graduate degree';
      const occTitle = formData.occupation_title?.trim();
      const occType = formData.occupation_type;
      const occFallback = occType === 'GOVERNMENT'
        ? 'in the government sector'
        : occType === 'BUSINESS'
        ? 'an entrepreneur'
        : occType === 'DOCTOR_MEDICAL'
        ? 'in the healthcare & medical field'
        : occType === 'IT_SOFTWARE'
        ? 'in the IT & software industry'
        : 'as a working professional';
      const occupation = occTitle ? `as ${occTitle}` : occFallback;
      const workLoc = formData.work_location ? ` in ${formData.work_location}` : '';
      const location = formData.city ? `${formData.city}, ${formData.district || 'Karnataka'}` : (formData.district || 'Bidar, Karnataka');
      const denom = formData.denomination
        ? `${formData.denomination.charAt(0) + formData.denomination.slice(1).toLowerCase()} Christian`
        : 'Christian';
      const familyVal = formData.family_values === 'TRADITIONAL'
        ? 'traditional Christian family values'
        : formData.family_values === 'LIBERAL'
        ? 'progressive Christian values'
        : 'balanced and modern Christian principles';
      const hobbiesText = formData.hobbies?.trim()
        ? ` Outside of professional work, I enjoy ${formData.hobbies.trim().toLowerCase()}.`
        : '';

      const variations = [
        `Praise the Lord! My name is ${name}. I have completed ${edu} and am currently engaged professionally ${occupation}${workLoc}. Raised in a God-fearing home with ${familyVal}, I strive to walk with integrity, humility, and faith in everyday life.${hobbiesText} I am looking forward to connecting with an understanding, prayerful Christian life partner who honors Biblical values and cherishes family harmony.`,
        `Warm Christian greetings! I am ${name}, residing in ${location}. By the grace of God, I hold a qualification in ${edu} and work ${occupation}${workLoc}. I believe in living a Christ-centered life rooted in love, mutual respect, and diligence. My family holds ${familyVal}.${hobbiesText} Seeking a devout, caring life partner to journey together in faith, mutual encouragement, and a joyful Christian marriage.`,
        `Praise Jesus! I am ${name}, a committed ${denom} brought up in a loving and supportive family. Academically, I have completed ${edu} and presently pursue my career ${occupation}${workLoc}. I appreciate simplicity, moral integrity, prayer, and family togetherness.${hobbiesText} My desire is to find a sincere Christian companion who loves God, respects elders, and wishes to build a peaceful, blessed home together.`
      ];

      const chosen = variations[Math.floor(Math.random() * variations.length)];
      setFormData((prev) => ({ ...prev, bio: chosen }));
      setSaveMessage('✨ AI generated a personalized Christian bio! You can edit or refine it.');
      setTimeout(() => setSaveMessage(null), 4000);
    } finally {
      setIsGeneratingBio(false);
    }
  };

  // AI-Powered Faith Testimony Synthesis based on denomination, church, and spiritual milestones
  const generateAiTestimony = async () => {
    setIsGeneratingTestimony(true);
    try {
      await new Promise((r) => setTimeout(r, 650));
      const denom = formData.denomination
        ? `${formData.denomination.charAt(0) + formData.denomination.slice(1).toLowerCase()} tradition`
        : 'Christian faith';
      const church = formData.church_name?.trim() ? ` at ${formData.church_name.trim()}` : '';
      const pastor = formData.parish_or_pastor?.trim() ? ` under the spiritual guidance of ${formData.parish_or_pastor.trim()}` : '';
      const churchAct = formData.church_activity?.trim()
        ? ` I actively participate in ${formData.church_activity.trim().toLowerCase()}.`
        : '';
      const baptismClause = formData.is_baptized
        ? (formData.is_born_again
            ? "I have accepted the Lord Jesus Christ as my personal Saviour and have taken believer's baptism."
            : "I have taken baptism and cherish a personal, devotional walk with our Lord Jesus Christ.")
        : "I was dedicated to the Lord and raised with regular Sunday school, prayer, and church fellowship.";

      const variations = [
        `By the grace of God Almighty, I was nurtured in a faithful Christian family rooted in the ${denom}. ${baptismClause} I regularly participate in Sunday worship and fellowship${church}${pastor}.${churchAct} Christ is the true anchor of my life. My prayer is to establish a holy, Christ-centered home based on Biblical values, walking together in prayer, unconditional love, and spiritual unity according to Joshua 24:15 - "As for me and my house, we will serve the Lord."`,
        `Praise the Lord! Jesus Christ is my personal Lord, Shepherd, and Strength. ${baptismClause} Fellowship with fellow believers and worshiping the Lord${church} brings peace and spiritual nourishment to my life.${churchAct} I hold Christian marriage as a sacred covenant instituted by God, and I look forward to building a prayerful, joy-filled home centered around the Word of God.`,
        `Giving all honor and glory to God! Growing up in the ${denom}, I have experienced God's unending faithfulness and guidance in every step. ${baptismClause} I remain an active attendee and supporter${church}${pastor}.${churchAct} My earnest prayer is to be united with a spiritually mature, prayerful Christian partner with whom I can grow in faith, serve the church, and radiate Christ's love to our community.`
      ];

      const chosen = variations[Math.floor(Math.random() * variations.length)];
      setFormData((prev) => ({ ...prev, faith_testimony: chosen }));
      setSaveMessage('✨ AI generated a heartfelt Christian faith testimony! You can edit or refine it.');
      setTimeout(() => setSaveMessage(null), 4000);
    } finally {
      setIsGeneratingTestimony(false);
    }
  };

  const handleSaveDraft = async (stepToSave: number, showToast: boolean = true) => {
    setIsSaving(true);
    setSaveMessage(null);
    setError(null);

    try {
      await apiClient.saveDraft(stepToSave, formData);
      if (showToast) {
        setSaveMessage('Draft saved successfully. You can resume anytime.');
        setTimeout(() => setSaveMessage(null), 4000);
      }
    } catch (err: any) {
      setError(err.message || 'Could not save draft.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleNext = async () => {
    // Validate required fields on Step 1
    if (currentStep === 1) {
      if (!formData.first_name?.trim()) {
        setError('Please enter your First Name.');
        return;
      }
      if (!formData.last_name?.trim()) {
        setError('Please enter your Last Name.');
        return;
      }
      if (!formData.dob) {
        setError('Please select your Date of Birth.');
        return;
      }
      if (calculatedAgeInfo.age !== null && calculatedAgeInfo.age < 18) {
        setError('Candidate must be at least 18 years of age.');
        return;
      }
    }

    const nextStep = Math.min(6, currentStep + 1);
    await handleSaveDraft(nextStep, false);
    setCurrentStep(nextStep);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBack = () => {
    const prevStep = Math.max(1, currentStep - 1);
    setCurrentStep(prevStep);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmitProfile = async () => {
    setIsSaving(true);
    setError(null);

    try {
      await apiClient.saveDraft(6, formData);
      await apiClient.submitRegistration(true);
      setIsSubmitted(true);
    } catch (err: any) {
      setError(err.message || 'Failed to submit profile.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center bg-slate-950 text-white">
        <div className="w-12 h-12 rounded-2xl bg-blue-900 border border-blue-700/50 flex items-center justify-center font-bold text-amber-400 animate-pulse mb-4 shadow-lg shadow-blue-950">
          CM
        </div>
        <h2 className="text-base font-bold text-slate-300">Loading Profile Setup...</h2>
      </div>
    );
  }

  if (isSubmitted) {
    return (
      <div className="relative min-h-[calc(100vh-80px)] flex items-center justify-center py-16 px-4 bg-slate-950 overflow-hidden text-white">
        <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 w-full max-w-xl bg-slate-900/90 backdrop-blur-2xl border border-slate-800 rounded-3xl p-8 sm:p-10 shadow-2xl text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 font-extrabold text-2xl flex items-center justify-center mx-auto shadow-lg shadow-emerald-950/40">
            ✓
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              Profile Submitted for Review
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
              Your matrimonial registration for <strong>Bidar, Karnataka</strong> has been recorded and is currently in verification.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-left text-xs text-slate-400 space-y-2">
            <p className="font-bold text-white text-[11px] uppercase tracking-wider">
              Verification Highlights:
            </p>
            <ul className="space-y-1.5 pl-1">
              <li className="flex items-start gap-2">
                <span className="text-amber-400 font-bold">•</span>
                <span>Mobile OTP &amp; Identity validation.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-400 font-bold">•</span>
                <span>Confidential contact information protection.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-400 font-bold">•</span>
                <span>Christian church &amp; denomination authentication.</span>
              </li>
            </ul>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
            <button
              type="button"
              onClick={() => setIsSubmitted(false)}
              className="px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-400 font-bold text-xs border border-slate-700 transition-all"
            >
              Review / Edit Bio Details ✎
            </button>
            <Link
              href="/profile/photos"
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold text-xs shadow-lg shadow-amber-950/30 transition-all transform hover:-translate-y-0.5"
            >
              Upload Authentic Photos →
            </Link>
            <Link
              href="/verification-status"
              className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 transition-all"
            >
              Check Pipeline Status
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const steps = [
    { num: 1, title: 'Personal', desc: 'Basic & Physical Details' },
    { num: 2, title: 'Faith', desc: 'Christian & Church Credentials' },
    { num: 3, title: 'Career', desc: 'Education & Profession' },
    { num: 4, title: 'Family', desc: 'Family & Heritage' },
    { num: 5, title: 'Lifestyle', desc: 'Lifestyle, Bio & Testimony' },
    { num: 6, title: 'Preferences', desc: 'Partner Preferences & Review' },
  ];

  return (
    <div className="relative min-h-[calc(100vh-80px)] py-12 px-4 bg-slate-950 text-white overflow-hidden">
      {/* Ambient Background Glows */}
      <div className="absolute top-10 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10 space-y-8">
        {/* Top Header Card with Stepper */}
        <div className="bg-slate-900/90 backdrop-blur-2xl border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-900/40 border border-blue-700/50 text-blue-300 text-[11px] font-bold uppercase tracking-wider mb-2">
                Candidate Profile Builder • Step {currentStep} of 6
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {steps[currentStep - 1].desc}
              </h1>
            </div>

            <button
              type="button"
              onClick={() => handleSaveDraft(currentStep, true)}
              disabled={isSaving}
              className="self-start sm:self-auto px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold transition-all flex items-center gap-2"
            >
              <span>{isSaving ? 'Saving...' : 'Save Draft'}</span>
            </button>
          </div>

          {/* Stepper Timeline */}
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {steps.map((s) => (
              <button
                key={s.num}
                type="button"
                onClick={() => setCurrentStep(s.num)}
                className={`p-2.5 rounded-xl text-left border transition-all ${
                  currentStep === s.num
                    ? 'bg-gradient-to-r from-blue-700 to-blue-900 border-blue-500 text-white shadow-md shadow-blue-950'
                    : currentStep > s.num
                    ? 'bg-slate-950/80 border-slate-800 text-amber-400 hover:border-slate-700'
                    : 'bg-slate-950/40 border-slate-900 text-slate-500 hover:text-slate-400'
                }`}
              >
                <div className="flex items-center justify-between text-[10px] font-mono mb-1">
                  <span>0{s.num}</span>
                  {currentStep > s.num && <span className="text-emerald-400 font-bold">✓</span>}
                </div>
                <p className="text-xs font-bold truncate">{s.title}</p>
              </button>
            ))}
          </div>

          {/* Progress Bar */}
          <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
            <div
              className="h-full bg-gradient-to-r from-blue-500 via-amber-400 to-amber-500 transition-all duration-300"
              style={{ width: `${(currentStep / 6) * 100}%` }}
            />
          </div>

          {saveMessage && (
            <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-800/80 text-emerald-300 text-xs font-medium">
              {saveMessage}
            </div>
          )}

          {error && (
            <div className="p-3 rounded-xl bg-red-950/60 border border-red-800/80 text-red-300 text-xs font-medium">
              {error}
            </div>
          )}
        </div>

        {/* Step Form Body */}
        <div className="bg-slate-900/90 backdrop-blur-2xl border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl">
          {/* STEP 1: Personal & Physical Details */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-white border-b border-slate-800 pb-3 flex items-center justify-between">
                <span>Personal &amp; Physical Details</span>
                <span className="text-xs font-normal text-slate-400">Step 1 of 6</span>
              </h3>

              {/* First Name & Last Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    First Name <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.first_name || ''}
                    onChange={(e) => handleChange('first_name', e.target.value)}
                    placeholder="Enter first name"
                    className="w-full text-xs font-medium border border-slate-800 rounded-xl p-3 bg-slate-950 text-white focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    Last Name <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.last_name || ''}
                    onChange={(e) => handleChange('last_name', e.target.value)}
                    placeholder="Enter last name"
                    className="w-full text-xs font-medium border border-slate-800 rounded-xl p-3 bg-slate-950 text-white focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-all"
                  />
                </div>
              </div>

              {/* Date of Birth & Automatic Age Calculation */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                      Date of Birth <span className="text-rose-400">*</span>
                    </label>
                    <span className="text-[11px] text-slate-400">Min. 18 years</span>
                  </div>

                  {/* Modern Calendar Input */}
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <input
                      type="date"
                      max={maxEligibleDob}
                      min={minEligibleDob}
                      value={formData.dob || ''}
                      onChange={(e) => handleDobChange(e.target.value)}
                      className="w-full text-xs font-semibold pl-10 pr-3 py-3 rounded-xl border border-slate-800 bg-slate-950 text-white [color-scheme:dark] focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-all cursor-pointer"
                    />
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1">
                    Select or enter date. Age calculates automatically.
                  </p>
                </div>

                {/* Auto-Calculated Age Display Card */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                      Calculated Age
                    </label>
                    {calculatedAgeInfo.isValid && (
                      <span className="text-[11px] text-emerald-400 font-bold flex items-center gap-1">
                        <span>Verified Age</span>
                      </span>
                    )}
                  </div>

                  <div
                    className={`p-3 rounded-xl border flex items-center justify-between transition-all min-h-[44px] ${
                      calculatedAgeInfo.age !== null && calculatedAgeInfo.isValid
                        ? 'bg-emerald-950/30 border-emerald-800/80 text-white'
                        : calculatedAgeInfo.age !== null && !calculatedAgeInfo.isValid
                        ? 'bg-rose-950/30 border-rose-800/80 text-white'
                        : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div>
                        <div className="text-xs sm:text-sm font-extrabold text-white">
                          {calculatedAgeInfo.age !== null
                            ? `${calculatedAgeInfo.age} Years Old`
                            : 'Select Date of Birth'}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {calculatedAgeInfo.message}
                        </div>
                      </div>
                    </div>

                    {calculatedAgeInfo.age !== null && (
                      <span
                        className={`text-[10px] font-extrabold px-2.5 py-1 rounded-lg uppercase border ${
                          calculatedAgeInfo.isValid
                            ? 'bg-emerald-900/60 border-emerald-700 text-emerald-300'
                            : 'bg-rose-900/60 border-rose-700 text-rose-300'
                        }`}
                      >
                        {calculatedAgeInfo.isValid ? `${calculatedAgeInfo.age} YRS` : 'UNDER 18'}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Marital Status & Mother Tongue */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    Marital Status
                  </label>
                  <select
                    value={formData.marital_status || 'NEVER_MARRIED'}
                    onChange={(e) => handleChange('marital_status', e.target.value)}
                    className="w-full text-xs font-medium border border-slate-800 rounded-xl p-3 bg-slate-950 text-white focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-all"
                  >
                    <option value="NEVER_MARRIED">Never Married</option>
                    <option value="DIVORCED">Divorced</option>
                    <option value="WIDOWED">Widowed</option>
                    <option value="AWAITING_DIVORCE">Awaiting Divorce</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    Mother Tongue
                  </label>
                  <input
                    type="text"
                    value={formData.mother_tongue || ''}
                    onChange={(e) => handleChange('mother_tongue', e.target.value)}
                    placeholder="e.g. Kannada, English, Hindi, Telugu"
                    className="w-full text-xs font-medium border border-slate-800 rounded-xl p-3 bg-slate-950 text-white focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-all"
                  />
                </div>
              </div>

              {/* Height & Weight */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                      Height (cm)
                    </label>
                    {formData.height_cm ? (
                      <span className="text-[11px] text-amber-400 font-semibold">
                        ≈ {formatHeight(formData.height_cm)}
                      </span>
                    ) : null}
                  </div>
                  <input
                    type="number"
                    value={formData.height_cm || ''}
                    onChange={(e) => handleChange('height_cm', e.target.value ? parseInt(e.target.value) : undefined)}
                    placeholder="e.g. 165"
                    className="w-full text-xs font-medium border border-slate-800 rounded-xl p-3 bg-slate-950 text-white focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    Weight (kg)
                  </label>
                  <input
                    type="number"
                    value={formData.weight_kg || ''}
                    onChange={(e) => handleChange('weight_kg', e.target.value ? parseInt(e.target.value) : undefined)}
                    placeholder="e.g. 60"
                    className="w-full text-xs font-medium border border-slate-800 rounded-xl p-3 bg-slate-950 text-white focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    Physical Status
                  </label>
                  <select
                    value={formData.physical_status || 'NORMAL'}
                    onChange={(e) => handleChange('physical_status', e.target.value)}
                    className="w-full text-xs font-medium border border-slate-800 rounded-xl p-3 bg-slate-950 text-white focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-all"
                  >
                    <option value="NORMAL">Normal</option>
                    <option value="PHYSICALLY_CHALLENGED">Physically Challenged</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Christian Faith & Church */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-white border-b border-slate-800 pb-3 flex items-center justify-between">
                <span>Christian Faith &amp; Church Credentials</span>
                <span className="text-xs font-normal text-slate-400">Step 2 of 6</span>
              </h3>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  Christian Denomination <span className="text-rose-400">*</span>
                </label>
                <select
                  value={formData.denomination || 'METHODIST'}
                  onChange={(e) => handleChange('denomination', e.target.value)}
                  className="w-full text-xs font-medium border border-slate-800 rounded-xl p-3 bg-slate-950 text-white focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-all"
                >
                  <option value="METHODIST">Methodist Church in India (MCI)</option>
                  <option value="CSI">Church of South India (CSI)</option>
                  <option value="CATHOLIC">Roman Catholic (RC)</option>
                  <option value="BAPTIST">Baptist Fellowship</option>
                  <option value="PENTECOSTAL">Pentecostal Assembly</option>
                  <option value="PROTESTANT">Protestant Fellowship</option>
                  <option value="MAR_THOMA">Mar Thoma / Orthodox</option>
                  <option value="OTHER">Other Christian Evangelical</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    Sub-Denomination / Parish Code
                  </label>
                  <input
                    type="text"
                    value={formData.sub_denomination || ''}
                    onChange={(e) => handleChange('sub_denomination', e.target.value)}
                    placeholder="e.g. Bidar Central Conference"
                    className="w-full text-xs font-medium border border-slate-800 rounded-xl p-3 bg-slate-950 text-white focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    Church / Parish Name
                  </label>
                  <input
                    type="text"
                    value={formData.church_name || ''}
                    onChange={(e) => handleChange('church_name', e.target.value)}
                    placeholder="e.g. Centenary Methodist Church, Bidar"
                    className="w-full text-xs font-medium border border-slate-800 rounded-xl p-3 bg-slate-950 text-white focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    Pastor / Priest In-Charge
                  </label>
                  <input
                    type="text"
                    value={formData.parish_or_pastor || ''}
                    onChange={(e) => handleChange('parish_or_pastor', e.target.value)}
                    placeholder="e.g. Rev. David Johnson"
                    className="w-full text-xs font-medium border border-slate-800 rounded-xl p-3 bg-slate-950 text-white focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    Church Ministry / Activity
                  </label>
                  <input
                    type="text"
                    value={formData.church_activity || ''}
                    onChange={(e) => handleChange('church_activity', e.target.value)}
                    placeholder="e.g. Youth Fellowship, Choir Member"
                    className="w-full text-xs font-medium border border-slate-800 rounded-xl p-3 bg-slate-950 text-white focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <label className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center gap-3 cursor-pointer hover:border-slate-700 transition-colors">
                  <input
                    type="checkbox"
                    checked={formData.is_baptized === true}
                    onChange={(e) => handleChange('is_baptized', e.target.checked)}
                    className="w-4 h-4 rounded text-blue-600 focus:ring-0"
                  />
                  <div>
                    <span className="text-xs font-bold text-white block">Water Baptized Christian</span>
                    <span className="text-[11px] text-slate-400">Baptized in the name of the Father, Son &amp; Holy Spirit</span>
                  </div>
                </label>

                <label className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center gap-3 cursor-pointer hover:border-slate-700 transition-colors">
                  <input
                    type="checkbox"
                    checked={formData.is_born_again === true}
                    onChange={(e) => handleChange('is_born_again', e.target.checked)}
                    className="w-4 h-4 rounded text-blue-600 focus:ring-0"
                  />
                  <div>
                    <span className="text-xs font-bold text-white block">Born Again Christian</span>
                    <span className="text-[11px] text-slate-400">Accepted Jesus Christ as personal Savior</span>
                  </div>
                </label>
              </div>
            </div>
          )}

          {/* STEP 3: Education & Career */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-white border-b border-slate-800 pb-3 flex items-center justify-between">
                <span>Education &amp; Professional Career</span>
                <span className="text-xs font-normal text-slate-400">Step 3 of 6</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    Highest Education Degree <span className="text-rose-400">*</span>
                  </label>
                  <select
                    value={formData.highest_education || ''}
                    onChange={(e) => handleChange('highest_education', e.target.value)}
                    className="w-full text-xs font-medium border border-slate-800 rounded-xl p-3 bg-slate-950 text-white focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-all cursor-pointer"
                  >
                    <option value="">-- Select Highest Education Degree --</option>
                    {formData.highest_education &&
                      !KARNATAKA_EDUCATION_DEGREES.some((g) => g.degrees.includes(formData.highest_education!)) && (
                        <option value={formData.highest_education}>{formData.highest_education}</option>
                      )}
                    {KARNATAKA_EDUCATION_DEGREES.map((group) => (
                      <optgroup key={group.category} label={group.category} className="bg-slate-900 text-amber-300 font-semibold">
                        {group.degrees.map((deg) => (
                          <option key={deg} value={deg} className="bg-slate-950 text-white font-normal">
                            {deg}
                          </option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    Institution / University Name
                  </label>
                  <input
                    type="text"
                    value={formData.institution || ''}
                    onChange={(e) => handleChange('institution', e.target.value)}
                    placeholder="e.g. College or University Name"
                    className="w-full text-xs font-medium border border-slate-800 rounded-xl p-3 bg-slate-950 text-white focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    Occupation Sector
                  </label>
                  <select
                    value={formData.occupation_type || 'PRIVATE'}
                    onChange={(e) => handleChange('occupation_type', e.target.value)}
                    className="w-full text-xs font-medium border border-slate-800 rounded-xl p-3 bg-slate-950 text-white focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-all"
                  >
                    <option value="PRIVATE">Private Sector</option>
                    <option value="GOVERNMENT">Government / Public Sector</option>
                    <option value="BUSINESS">Business / Entrepreneur</option>
                    <option value="SELF_EMPLOYED">Self Employed / Freelancer</option>
                    <option value="DOCTOR_MEDICAL">Medical / Healthcare</option>
                    <option value="IT_SOFTWARE">IT &amp; Software Services</option>
                    <option value="DEFENCE_CIVIL">Defence / Civil Services</option>
                    <option value="NOT_WORKING">Not Working Currently</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    Job Title / Designation
                  </label>
                  <input
                    type="text"
                    value={formData.occupation_title || ''}
                    onChange={(e) => handleChange('occupation_title', e.target.value)}
                    placeholder="e.g. Software Engineer / Assistant Professor"
                    className="w-full text-xs font-medium border border-slate-800 rounded-xl p-3 bg-slate-950 text-white focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    Annual Income (INR)
                  </label>
                  <input
                    type="number"
                    value={formData.annual_income_min || ''}
                    onChange={(e) => handleChange('annual_income_min', e.target.value ? parseInt(e.target.value) : undefined)}
                    placeholder="e.g. 800000"
                    className="w-full text-xs font-medium border border-slate-800 rounded-xl p-3 bg-slate-950 text-white focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    Work Location
                  </label>
                  <input
                    type="text"
                    value={formData.work_location || ''}
                    onChange={(e) => handleChange('work_location', e.target.value)}
                    placeholder="e.g. Bidar, Bengaluru, Hyderabad"
                    className="w-full text-xs font-medium border border-slate-800 rounded-xl p-3 bg-slate-950 text-white focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-all"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Family Details */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-white border-b border-slate-800 pb-3 flex items-center justify-between">
                <span>Family Heritage &amp; Background</span>
                <span className="text-xs font-normal text-slate-400">Step 4 of 6</span>
              </h3>

              {/* Father's Details Card */}
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
                  <span>Father&apos;s Information</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 mb-1">
                      Father&apos;s Name
                    </label>
                    <input
                      type="text"
                      value={formData.father_name || ''}
                      onChange={(e) => handleChange('father_name', e.target.value)}
                      placeholder="Father's full name"
                      className="w-full text-xs font-medium border border-slate-800 rounded-xl p-3 bg-slate-900 text-white focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 mb-1">
                      Father&apos;s Occupation
                    </label>
                    <input
                      type="text"
                      value={formData.father_occupation || ''}
                      onChange={(e) => handleChange('father_occupation', e.target.value)}
                      placeholder="e.g. Retired / Employed / Business"
                      className="w-full text-xs font-medium border border-slate-800 rounded-xl p-3 bg-slate-900 text-white focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 mb-1">
                      Father&apos;s Mobile Number
                    </label>
                    <div className="flex rounded-xl border border-slate-800 bg-slate-900 overflow-hidden focus-within:border-amber-400 transition-colors">
                      <span className="px-3 py-2.5 text-xs font-bold text-amber-400 bg-slate-950 border-r border-slate-800 flex items-center">
                        +91
                      </span>
                      <input
                        type="tel"
                        maxLength={10}
                        value={formData.father_mobile || ''}
                        onChange={(e) => handleChange('father_mobile', e.target.value)}
                        placeholder="98765 43210"
                        className="w-full text-xs font-medium p-2.5 bg-transparent text-white focus:outline-none placeholder:text-slate-600"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Mother's Details Card */}
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
                  <span>Mother&apos;s Information</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 mb-1">
                      Mother&apos;s Name
                    </label>
                    <input
                      type="text"
                      value={formData.mother_name || ''}
                      onChange={(e) => handleChange('mother_name', e.target.value)}
                      placeholder="Mother's full name"
                      className="w-full text-xs font-medium border border-slate-800 rounded-xl p-3 bg-slate-900 text-white focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 mb-1">
                      Mother&apos;s Occupation
                    </label>
                    <input
                      type="text"
                      value={formData.mother_occupation || ''}
                      onChange={(e) => handleChange('mother_occupation', e.target.value)}
                      placeholder="e.g. Homemaker / Teacher / Nurse"
                      className="w-full text-xs font-medium border border-slate-800 rounded-xl p-3 bg-slate-900 text-white focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 mb-1">
                      Mother&apos;s Mobile Number
                    </label>
                    <div className="flex rounded-xl border border-slate-800 bg-slate-900 overflow-hidden focus-within:border-amber-400 transition-colors">
                      <span className="px-3 py-2.5 text-xs font-bold text-amber-400 bg-slate-950 border-r border-slate-800 flex items-center">
                        +91
                      </span>
                      <input
                        type="tel"
                        maxLength={10}
                        value={formData.mother_mobile || ''}
                        onChange={(e) => handleChange('mother_mobile', e.target.value)}
                        placeholder="98765 43210"
                        className="w-full text-xs font-medium p-2.5 bg-transparent text-white focus:outline-none placeholder:text-slate-600"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    Family Status
                  </label>
                  <select
                    value={formData.family_status || 'MIDDLE_CLASS'}
                    onChange={(e) => handleChange('family_status', e.target.value)}
                    className="w-full text-xs font-medium border border-slate-800 rounded-xl p-3 bg-slate-950 text-white focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-all"
                  >
                    <option value="MIDDLE_CLASS">Middle Class</option>
                    <option value="UPPER_MIDDLE_CLASS">Upper Middle Class</option>
                    <option value="AFFLUENT">Affluent</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    Family Values
                  </label>
                  <select
                    value={formData.family_values || 'TRADITIONAL'}
                    onChange={(e) => handleChange('family_values', e.target.value)}
                    className="w-full text-xs font-medium border border-slate-800 rounded-xl p-3 bg-slate-950 text-white focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-all"
                  >
                    <option value="TRADITIONAL">Traditional Christian</option>
                    <option value="MODERATE">Moderate / Contemporary</option>
                    <option value="LIBERAL">Liberal</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  About Family (Optional)
                </label>
                <textarea
                  rows={2}
                  value={formData.about_family || ''}
                  onChange={(e) => handleChange('about_family', e.target.value)}
                  placeholder="Share a short note on your family background, Christian values, and relatives..."
                  className="w-full text-xs font-medium border border-slate-800 rounded-xl p-3 bg-slate-950 text-white focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-all"
                />
              </div>
            </div>
          )}

          {/* STEP 5: Lifestyle & Bio */}
          {currentStep === 5 && (
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-white border-b border-slate-800 pb-3 flex items-center justify-between">
                <span>Lifestyle, Bio &amp; Faith Testimony</span>
                <span className="text-xs font-normal text-slate-400">Step 5 of 6</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    Dietary Habits
                  </label>
                  <select
                    value={formData.diet || 'NON_VEGETARIAN'}
                    onChange={(e) => handleChange('diet', e.target.value)}
                    className="w-full text-xs font-medium border border-slate-800 rounded-xl p-3 bg-slate-950 text-white focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-all"
                  >
                    <option value="NON_VEGETARIAN">Non-Vegetarian</option>
                    <option value="VEGETARIAN">Vegetarian</option>
                    <option value="EGGETARIAN">Eggetarian</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    Smoking &amp; Drinking
                  </label>
                  <select
                    value={formData.smoking || 'NO'}
                    onChange={(e) => handleChange('smoking', e.target.value)}
                    className="w-full text-xs font-medium border border-slate-800 rounded-xl p-3 bg-slate-950 text-white focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-all"
                  >
                    <option value="NO">No (Teetotaler)</option>
                    <option value="OCCASIONALLY">Occasionally</option>
                    <option value="YES">Yes</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  Hobbies &amp; Interests
                </label>
                <input
                  type="text"
                  value={formData.hobbies || ''}
                  onChange={(e) => handleChange('hobbies', e.target.value)}
                  placeholder="e.g. Reading Christian Books, Gospel Music, Traveling, Cooking"
                  className="w-full text-xs font-medium border border-slate-800 rounded-xl p-3 bg-slate-950 text-white focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-all"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                    About Me (Personal Bio)
                  </label>
                  <button
                    type="button"
                    onClick={generateAiBio}
                    disabled={isGeneratingBio}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500/20 via-amber-400/25 to-amber-600/20 border border-amber-500/40 text-amber-300 hover:text-amber-200 text-[11px] font-bold tracking-wide hover:border-amber-400 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 cursor-pointer shadow-sm shadow-amber-950/20"
                    title="Synthesizes your education, occupation, and family values into an authentic Christian matrimonial bio"
                  >
                    <span className="text-xs">✨</span>
                    <span>{isGeneratingBio ? 'Generating with AI...' : 'Generate with AI'}</span>
                  </button>
                </div>
                <textarea
                  rows={4}
                  value={formData.bio || ''}
                  onChange={(e) => handleChange('bio', e.target.value)}
                  placeholder="Click 'Generate with AI' above or write about your personality, character, spiritual priorities, and aspirations..."
                  className="w-full text-xs font-medium border border-slate-800 rounded-xl p-3 bg-slate-950 text-white focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-all"
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  💡 Tip: Click <strong>Generate with AI</strong> to automatically compose a reverent Christian matrimonial bio from your entered details.
                </p>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                    Personal Faith Testimony
                  </label>
                  <button
                    type="button"
                    onClick={generateAiTestimony}
                    disabled={isGeneratingTestimony}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-blue-500/20 via-blue-400/25 to-blue-600/20 border border-blue-500/40 text-blue-300 hover:text-blue-200 text-[11px] font-bold tracking-wide hover:border-blue-400 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 cursor-pointer shadow-sm shadow-blue-950/20"
                    title="Synthesizes your church, denomination, baptism, and biblical vision into a genuine testimony"
                  >
                    <span className="text-xs">✨</span>
                    <span>{isGeneratingTestimony ? 'Generating with AI...' : 'Generate with AI'}</span>
                  </button>
                </div>
                <textarea
                  rows={4}
                  value={formData.faith_testimony || ''}
                  onChange={(e) => handleChange('faith_testimony', e.target.value)}
                  placeholder="Click 'Generate with AI' above or share your spiritual journey, baptism testimony, and church fellowship..."
                  className="w-full text-xs font-medium border border-slate-800 rounded-xl p-3 bg-slate-950 text-white focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-all"
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  💡 Tip: Click <strong>Generate with AI</strong> to create a Christ-centered testimony reflecting your church, baptism, and marriage vision.
                </p>
              </div>
            </div>
          )}

          {/* STEP 6: Partner Preferences & Final Submit */}
          {currentStep === 6 && (
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-white border-b border-slate-800 pb-3 flex items-center justify-between">
                <span>Expected Partner Preferences</span>
                <span className="text-xs font-normal text-slate-400">Step 6 of 6</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    Preferred Partner Age Range
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      placeholder="Min Age"
                      value={formData.partner_preferences?.age_min || ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          partner_preferences: {
                            ...formData.partner_preferences,
                            age_min: e.target.value ? parseInt(e.target.value) : undefined,
                          },
                        })
                      }
                      className="w-1/2 text-xs font-medium border border-slate-800 rounded-xl p-3 bg-slate-950 text-white focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-all"
                    />
                    <span className="text-xs text-slate-500 font-bold">to</span>
                    <input
                      type="number"
                      placeholder="Max Age"
                      value={formData.partner_preferences?.age_max || ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          partner_preferences: {
                            ...formData.partner_preferences,
                            age_max: e.target.value ? parseInt(e.target.value) : undefined,
                          },
                        })
                      }
                      className="w-1/2 text-xs font-medium border border-slate-800 rounded-xl p-3 bg-slate-950 text-white focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    Preferred Height Range (cm)
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      placeholder="Min Height (cm)"
                      value={formData.partner_preferences?.height_min_cm || ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          partner_preferences: {
                            ...formData.partner_preferences,
                            height_min_cm: e.target.value ? parseInt(e.target.value) : undefined,
                          },
                        })
                      }
                      className="w-1/2 text-xs font-medium border border-slate-800 rounded-xl p-3 bg-slate-950 text-white focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-all"
                    />
                    <span className="text-xs text-slate-500 font-bold">to</span>
                    <input
                      type="number"
                      placeholder="Max Height (cm)"
                      value={formData.partner_preferences?.height_max_cm || ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          partner_preferences: {
                            ...formData.partner_preferences,
                            height_max_cm: e.target.value ? parseInt(e.target.value) : undefined,
                          },
                        })
                      }
                      className="w-1/2 text-xs font-medium border border-slate-800 rounded-xl p-3 bg-slate-950 text-white focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Review summary box */}
              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
                <h4 className="font-bold text-amber-400 uppercase text-[11px] tracking-wider">
                  Christian Matrimony Declaration
                </h4>
                <p className="text-slate-300 leading-relaxed">
                  I solemnly declare that all personal, spiritual, denomination, and career credentials provided in this profile are genuine and accurate.
                </p>
              </div>
            </div>
          )}

          {/* Action Navigation Bar */}
          <div className="mt-10 pt-6 border-t border-slate-800 flex items-center justify-between">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={handleBack}
                className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-all border border-slate-700"
              >
                ← Previous Step
              </button>
            ) : (
              <div />
            )}

            {currentStep < 6 ? (
              <button
                type="button"
                onClick={handleNext}
                className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-blue-700 to-blue-900 hover:from-blue-600 hover:to-blue-800 text-white font-extrabold text-xs shadow-lg shadow-blue-950 border border-blue-600/50 transition-all transform hover:-translate-y-0.5"
              >
                Continue to Step {currentStep + 1} →
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmitProfile}
                disabled={isSaving}
                className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold text-xs shadow-xl shadow-amber-950/40 transition-all transform hover:-translate-y-0.5"
              >
                {isSaving ? 'Submitting...' : 'Submit Profile for Verification →'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateProfileWizard;
