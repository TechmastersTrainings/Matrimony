"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { apiClient } from "../../../lib/api-client";
import { ProfileDraftData } from "../../../types";

export default function CreateProfileWizard() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [completionPercentage, setCompletionPercentage] = useState(15);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<ProfileDraftData>({
    first_name: "",
    last_name: "",
    gender: "MALE",
    dob: "1998-05-15",
    age: 28,
    marital_status: "NEVER_MARRIED",
    height_cm: 175,
    weight_kg: 70,
    physical_status: "NORMAL",
    mother_tongue: "Kannada",

    // Faith
    denomination: "METHODIST",
    sub_denomination: "",
    church_name: "Centenary Methodist Church",
    parish_or_pastor: "Rev. Johnson",
    is_baptized: true,
    is_born_again: true,
    church_activity: "Active in Youth Choir",

    // Location
    state: "Karnataka",
    district: "Bidar",
    city: "Bidar",
    pincode: "585401",
    native_place: "Bidar",

    // Career
    highest_education: "B.Tech Computer Science",
    education_field: "Engineering",
    institution: "GNDEC Bidar",
    occupation_type: "IT_SOFTWARE",
    occupation_title: "Software Engineer",
    employed_in: "Private Sector",
    annual_income_min: 1200000,
    work_location: "Bangalore",

    // Family
    father_name: "Paul Fernandes",
    father_occupation: "Retired Govt Official",
    mother_name: "Mary Fernandes",
    mother_occupation: "Homemaker",
    family_status: "MIDDLE_CLASS",
    family_values: "TRADITIONAL",
    brothers_count: 1,
    married_brothers_count: 0,
    sisters_count: 1,
    married_sisters_count: 1,
    about_family: "God-fearing and close-knit family rooted in Christian values.",

    // Lifestyle & Bio
    diet: "NON_VEGETARIAN",
    smoking: "NO",
    drinking: "NO",
    hobbies: "Reading Christian Literature, Music, Travel",
    bio: "I am a committed Christian looking for a life partner with strong faith values.",
    faith_testimony: "Baptized and raised in faith, actively serving in our local church community.",

    // Partner Preferences
    partner_preferences: {
      age_min: 22,
      age_max: 27,
      height_min_cm: 155,
      height_max_cm: 175,
      denomination: ["METHODIST", "CSI", "CATHOLIC", "BAPTIST"],
    },
  });

  // Load existing draft
  useEffect(() => {
    async function loadData() {
      try {
        const me = await apiClient.getRegistrationMe();
        if (me.profile_status === "SUBMITTED") {
          setIsSubmitted(true);
        }
        if (me.draft && me.draft.draft_data) {
          setFormData((prev) => ({ ...prev, ...me.draft?.draft_data }));
          setCurrentStep(me.draft.current_step || 1);
        }
        setCompletionPercentage(me.completion_percentage || 15);
      } catch (err) {
        console.warn("User not logged in, redirecting to login...");
        router.push("/login");
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [router]);

  const handleChange = (name: string, value: any) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveDraft = async (stepToSave: number, showToast: boolean = true) => {
    setIsSaving(true);
    setSaveMessage(null);
    setError(null);

    try {
      const res = await apiClient.saveDraft(stepToSave, formData);
      if (showToast) {
        setSaveMessage("✓ Draft saved successfully. You can resume anytime!");
        setTimeout(() => setSaveMessage(null), 4000);
      }
    } catch (err: any) {
      setError(err.message || "Could not save draft.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleNext = async () => {
    const nextStep = Math.min(6, currentStep + 1);
    await handleSaveDraft(nextStep, false);
    setCurrentStep(nextStep);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBack = () => {
    const prevStep = Math.max(1, currentStep - 1);
    setCurrentStep(prevStep);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmitProfile = async () => {
    setIsSaving(true);
    setError(null);

    try {
      // First save latest draft data
      await apiClient.saveDraft(6, formData);
      // Submit registration
      await apiClient.submitRegistration(true);
      setIsSubmitted(true);
    } catch (err: any) {
      setError(err.message || "Failed to submit profile.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container" style={{ padding: "100px 0", textAlign: "center" }}>
        <div style={{ fontSize: "2rem", marginBottom: "16px" }}>📖</div>
        <h2>Loading Profile Draft...</h2>
      </div>
    );
  }

  if (isSubmitted) {
    return (
      <div className="container" style={{ padding: "60px 0", maxWidth: "680px" }}>
        <div className="card" style={{ padding: "40px", textAlign: "center" }}>
          <div
            style={{
              width: "72px",
              height: "72px",
              borderRadius: "50%",
              backgroundColor: "#dcfce7",
              color: "#166534",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "2.5rem",
              margin: "0 auto 20px",
            }}
          >
            ✓
          </div>
          <h1 style={{ fontSize: "2rem", fontWeight: 800, color: "var(--text-main)", marginBottom: "12px" }}>
            Profile Submitted Successfully!
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: "1.05rem", lineHeight: 1.6, marginBottom: "24px" }}>
            Thank you for completing your matrimonial registration for <strong>Bidar, Karnataka</strong>. Your profile draft has been locked and submitted.
          </p>

          <div
            style={{
              padding: "20px",
              backgroundColor: "var(--bg-main)",
              borderRadius: "12px",
              border: "1px solid var(--border)",
              textAlign: "left",
              marginBottom: "32px",
            }}
          >
            <h4 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "8px", color: "var(--primary)" }}>
              Next Steps in Phase 4:
            </h4>
            <ul style={{ paddingLeft: "20px", color: "var(--text-muted)", fontSize: "0.95rem", lineHeight: 1.8 }}>
              <li>Upload 5 verified matrimonial profile photos</li>
              <li>Automated contact & document verification</li>
              <li>Admin pastoral verification & approval</li>
            </ul>
          </div>

          <Link
            href="/"
            style={{
              display: "inline-block",
              padding: "12px 28px",
              backgroundColor: "var(--primary)",
              color: "#ffffff",
              borderRadius: "8px",
              fontWeight: 700,
            }}
          >
            Return to Homepage
          </Link>
        </div>
      </div>
    );
  }

  const stepTitles = [
    "Basic & Physical Details",
    "Christian Faith & Church",
    "Location & Career",
    "Family Background",
    "Lifestyle & Bio",
    "Partner Preferences & Review",
  ];

  return (
    <div className="container" style={{ padding: "40px 0", maxWidth: "800px" }}>
      {/* Top Progress Card */}
      <div className="card" style={{ padding: "24px", marginBottom: "24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
          <div>
            <span className="badge" style={{ marginBottom: "4px", display: "inline-block" }}>
              Step {currentStep} of 6
            </span>
            <h2 style={{ fontSize: "1.25rem", fontWeight: 700 }}>{stepTitles[currentStep - 1]}</h2>
          </div>
          <button
            type="button"
            onClick={() => handleSaveDraft(currentStep, true)}
            disabled={isSaving}
            style={{
              padding: "8px 16px",
              backgroundColor: "var(--bg-main)",
              border: "1px solid var(--border)",
              borderRadius: "6px",
              fontSize: "0.85rem",
              fontWeight: 600,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            💾 {isSaving ? "Saving..." : "Save Draft"}
          </button>
        </div>

        {/* Progress Bar */}
        <div style={{ width: "100%", height: "8px", backgroundColor: "#e7e5e4", borderRadius: "9999px", overflow: "hidden" }}>
          <div
            style={{
              width: `${((currentStep) / 6) * 100}%`,
              height: "100%",
              backgroundColor: "var(--primary)",
              transition: "width 0.3s ease",
            }}
          />
        </div>

        {saveMessage && (
          <div style={{ marginTop: "12px", color: "#166534", fontSize: "0.85rem", fontWeight: 600 }}>
            {saveMessage}
          </div>
        )}
        {error && (
          <div style={{ marginTop: "12px", color: "#b91c1c", fontSize: "0.85rem", fontWeight: 600 }}>
            {error}
          </div>
        )}
      </div>

      {/* Step Form Card */}
      <div className="card" style={{ padding: "36px" }}>
        {/* STEP 1: Basic Details */}
        {currentStep === 1 && (
          <div>
            <h3 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "20px" }}>
              Personal & Physical Information
            </h3>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "18px" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, marginBottom: "6px" }}>
                  Date of Birth
                </label>
                <input
                  type="date"
                  value={formData.dob || ""}
                  onChange={(e) => handleChange("dob", e.target.value)}
                  style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid var(--border)" }}
                />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, marginBottom: "6px" }}>
                  Age
                </label>
                <input
                  type="number"
                  value={formData.age || 26}
                  onChange={(e) => handleChange("age", parseInt(e.target.value) || 0)}
                  style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid var(--border)" }}
                />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "18px" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, marginBottom: "6px" }}>
                  Marital Status
                </label>
                <select
                  value={formData.marital_status || "NEVER_MARRIED"}
                  onChange={(e) => handleChange("marital_status", e.target.value)}
                  style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid var(--border)", background: "#fff" }}
                >
                  <option value="NEVER_MARRIED">Never Married</option>
                  <option value="DIVORCED">Divorced</option>
                  <option value="WIDOWED">Widowed</option>
                  <option value="AWAITING_DIVORCE">Awaiting Divorce</option>
                </select>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, marginBottom: "6px" }}>
                  Mother Tongue
                </label>
                <input
                  type="text"
                  value={formData.mother_tongue || "Kannada"}
                  onChange={(e) => handleChange("mother_tongue", e.target.value)}
                  style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid var(--border)" }}
                />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "18px" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, marginBottom: "6px" }}>
                  Height (cm)
                </label>
                <input
                  type="number"
                  value={formData.height_cm || 170}
                  onChange={(e) => handleChange("height_cm", parseInt(e.target.value) || 0)}
                  placeholder="175"
                  style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid var(--border)" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, marginBottom: "6px" }}>
                  Physical Status
                </label>
                <select
                  value={formData.physical_status || "NORMAL"}
                  onChange={(e) => handleChange("physical_status", e.target.value)}
                  style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid var(--border)", background: "#fff" }}
                >
                  <option value="NORMAL">Normal</option>
                  <option value="PHYSICALLY_CHALLENGED">Physically Challenged</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Christian Faith */}
        {currentStep === 2 && (
          <div>
            <h3 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "20px" }}>
              Christian & Church Information
            </h3>

            <div style={{ marginBottom: "18px" }}>
              <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, marginBottom: "6px" }}>
                Denomination
              </label>
              <select
                value={formData.denomination || "METHODIST"}
                onChange={(e) => handleChange("denomination", e.target.value)}
                style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid var(--border)", background: "#fff" }}
              >
                <option value="METHODIST">Methodist</option>
                <option value="CSI">Church of South India (CSI)</option>
                <option value="CATHOLIC">Roman Catholic</option>
                <option value="BAPTIST">Baptist</option>
                <option value="PENTECOSTAL">Pentecostal</option>
                <option value="PROTESTANT">Protestant</option>
                <option value="MAR_THOMA">Mar Thoma</option>
                <option value="ORTHODOX">Orthodox</option>
                <option value="SYRIAN_CATHOLIC">Syrian Catholic</option>
                <option value="SEVENTH_DAY_ADVENTIST">Seventh-day Adventist</option>
                <option value="LUTHERAN">Lutheran</option>
                <option value="OTHER">Other Christian</option>
              </select>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "18px" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, marginBottom: "6px" }}>
                  Church / Parish Name
                </label>
                <input
                  type="text"
                  value={formData.church_name || ""}
                  onChange={(e) => handleChange("church_name", e.target.value)}
                  placeholder="e.g. Centenary Methodist Church"
                  style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid var(--border)" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, marginBottom: "6px" }}>
                  Parish Pastor / Priest Name
                </label>
                <input
                  type="text"
                  value={formData.parish_or_pastor || ""}
                  onChange={(e) => handleChange("parish_or_pastor", e.target.value)}
                  placeholder="e.g. Rev. Johnson"
                  style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid var(--border)" }}
                />
              </div>
            </div>

            <div style={{ display: "flex", gap: "32px", padding: "12px 0", marginBottom: "18px" }}>
              <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                <input
                  type="checkbox"
                  checked={formData.is_baptized !== false}
                  onChange={(e) => handleChange("is_baptized", e.target.checked)}
                />
                <span style={{ fontWeight: 600 }}>Baptized Christian</span>
              </label>

              <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                <input
                  type="checkbox"
                  checked={formData.is_born_again === true}
                  onChange={(e) => handleChange("is_born_again", e.target.checked)}
                />
                <span style={{ fontWeight: 600 }}>Born Again Christian</span>
              </label>
            </div>
          </div>
        )}

        {/* STEP 3: Education & Career */}
        {currentStep === 3 && (
          <div>
            <h3 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "20px" }}>
              Education & Professional Career
            </h3>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "18px" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, marginBottom: "6px" }}>
                  Highest Education Degree
                </label>
                <input
                  type="text"
                  value={formData.highest_education || ""}
                  onChange={(e) => handleChange("highest_education", e.target.value)}
                  placeholder="e.g. B.Tech / MBA / MBBS"
                  style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid var(--border)" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, marginBottom: "6px" }}>
                  Institution / College
                </label>
                <input
                  type="text"
                  value={formData.institution || ""}
                  onChange={(e) => handleChange("institution", e.target.value)}
                  placeholder="College or University"
                  style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid var(--border)" }}
                />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "18px" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, marginBottom: "6px" }}>
                  Occupation Sector
                </label>
                <select
                  value={formData.occupation_type || "PRIVATE"}
                  onChange={(e) => handleChange("occupation_type", e.target.value)}
                  style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid var(--border)", background: "#fff" }}
                >
                  <option value="PRIVATE">Private Sector</option>
                  <option value="GOVERNMENT">Government / Public Sector</option>
                  <option value="BUSINESS">Business / Entrepreneur</option>
                  <option value="SELF_EMPLOYED">Self Employed</option>
                  <option value="DOCTOR_MEDICAL">Medical / Healthcare</option>
                  <option value="IT_SOFTWARE">IT & Software</option>
                  <option value="NOT_WORKING">Not Working</option>
                </select>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, marginBottom: "6px" }}>
                  Job Title / Designation
                </label>
                <input
                  type="text"
                  value={formData.occupation_title || ""}
                  onChange={(e) => handleChange("occupation_title", e.target.value)}
                  placeholder="e.g. Senior Software Engineer"
                  style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid var(--border)" }}
                />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "18px" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, marginBottom: "6px" }}>
                  Annual Income (INR)
                </label>
                <input
                  type="number"
                  value={formData.annual_income_min || 800000}
                  onChange={(e) => handleChange("annual_income_min", parseInt(e.target.value) || 0)}
                  placeholder="e.g. 1000000"
                  style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid var(--border)" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, marginBottom: "6px" }}>
                  Work Location
                </label>
                <input
                  type="text"
                  value={formData.work_location || "Bidar"}
                  onChange={(e) => handleChange("work_location", e.target.value)}
                  placeholder="Bidar / Bangalore / Hyderabad"
                  style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid var(--border)" }}
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: Family Details */}
        {currentStep === 4 && (
          <div>
            <h3 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "20px" }}>
              Family Information
            </h3>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "18px" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, marginBottom: "6px" }}>
                  Father&apos;s Name
                </label>
                <input
                  type="text"
                  value={formData.father_name || ""}
                  onChange={(e) => handleChange("father_name", e.target.value)}
                  placeholder="Father's full name"
                  style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid var(--border)" }}
                />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, marginBottom: "6px" }}>
                  Father&apos;s Occupation
                </label>
                <input
                  type="text"
                  value={formData.father_occupation || ""}
                  onChange={(e) => handleChange("father_occupation", e.target.value)}
                  placeholder="Occupation"
                  style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid var(--border)" }}
                />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "18px" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, marginBottom: "6px" }}>
                  Mother&apos;s Name
                </label>
                <input
                  type="text"
                  value={formData.mother_name || ""}
                  onChange={(e) => handleChange("mother_name", e.target.value)}
                  placeholder="Mother's full name"
                  style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid var(--border)" }}
                />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, marginBottom: "6px" }}>
                  Mother&apos;s Occupation
                </label>
                <input
                  type="text"
                  value={formData.mother_occupation || ""}
                  onChange={(e) => handleChange("mother_occupation", e.target.value)}
                  placeholder="Occupation"
                  style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid var(--border)" }}
                />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "18px" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, marginBottom: "6px" }}>
                  Family Status
                </label>
                <select
                  value={formData.family_status || "MIDDLE_CLASS"}
                  onChange={(e) => handleChange("family_status", e.target.value)}
                  style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid var(--border)", background: "#fff" }}
                >
                  <option value="MIDDLE_CLASS">Middle Class</option>
                  <option value="UPPER_MIDDLE_CLASS">Upper Middle Class</option>
                  <option value="AFFLUENT">Affluent</option>
                </select>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, marginBottom: "6px" }}>
                  Family Values
                </label>
                <select
                  value={formData.family_values || "TRADITIONAL"}
                  onChange={(e) => handleChange("family_values", e.target.value)}
                  style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid var(--border)", background: "#fff" }}
                >
                  <option value="TRADITIONAL">Traditional</option>
                  <option value="MODERATE">Moderate</option>
                  <option value="LIBERAL">Liberal</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* STEP 5: Lifestyle & Bio */}
        {currentStep === 5 && (
          <div>
            <h3 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "20px" }}>
              Lifestyle, Personal Bio & Faith Testimony
            </h3>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "18px" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, marginBottom: "6px" }}>
                  Dietary Habit
                </label>
                <select
                  value={formData.diet || "NON_VEGETARIAN"}
                  onChange={(e) => handleChange("diet", e.target.value)}
                  style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid var(--border)", background: "#fff" }}
                >
                  <option value="NON_VEGETARIAN">Non-Vegetarian</option>
                  <option value="VEGETARIAN">Vegetarian</option>
                  <option value="EGGETARIAN">Eggetarian</option>
                </select>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, marginBottom: "6px" }}>
                  Smoking & Drinking Habits
                </label>
                <select
                  value={formData.smoking || "NO"}
                  onChange={(e) => handleChange("smoking", e.target.value)}
                  style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid var(--border)", background: "#fff" }}
                >
                  <option value="NO">No (Teetotaler)</option>
                  <option value="OCCASIONALLY">Occasionally</option>
                  <option value="YES">Yes</option>
                </select>
              </div>
            </div>

            <div style={{ marginBottom: "18px" }}>
              <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, marginBottom: "6px" }}>
                About Me (Personal Bio)
              </label>
              <textarea
                rows={3}
                value={formData.bio || ""}
                onChange={(e) => handleChange("bio", e.target.value)}
                placeholder="Share a brief overview of yourself, your character, and aspirations..."
                style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid var(--border)" }}
              />
            </div>

            <div style={{ marginBottom: "18px" }}>
              <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, marginBottom: "6px" }}>
                Personal Faith Testimony
              </label>
              <textarea
                rows={3}
                value={formData.faith_testimony || ""}
                onChange={(e) => handleChange("faith_testimony", e.target.value)}
                placeholder="Describe your faith in Jesus Christ, spiritual journey, and church involvement..."
                style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid var(--border)" }}
              />
            </div>
          </div>
        )}

        {/* STEP 6: Partner Preferences & Review */}
        {currentStep === 6 && (
          <div>
            <h3 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "20px" }}>
              Partner Preferences & Final Review
            </h3>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "20px" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, marginBottom: "6px" }}>
                  Preferred Age Range
                </label>
                <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                  <input
                    type="number"
                    value={formData.partner_preferences?.age_min || 21}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        partner_preferences: {
                          ...formData.partner_preferences,
                          age_min: parseInt(e.target.value) || 21,
                        },
                      })
                    }
                    style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid var(--border)" }}
                  />
                  <span>to</span>
                  <input
                    type="number"
                    value={formData.partner_preferences?.age_max || 30}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        partner_preferences: {
                          ...formData.partner_preferences,
                          age_max: parseInt(e.target.value) || 30,
                        },
                      })
                    }
                    style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid var(--border)" }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, marginBottom: "6px" }}>
                  Target Region
                </label>
                <input
                  type="text"
                  disabled
                  value="Bidar, Karnataka, India"
                  style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid var(--border)", backgroundColor: "var(--bg-main)" }}
                />
              </div>
            </div>

            <div
              style={{
                padding: "20px",
                backgroundColor: "var(--primary-light)",
                borderRadius: "10px",
                border: "1px solid rgba(155, 44, 44, 0.2)",
                marginBottom: "24px",
              }}
            >
              <h4 style={{ color: "var(--primary)", fontWeight: 700, marginBottom: "8px" }}>
                Ready to Submit Your Registration?
              </h4>
              <p style={{ color: "var(--text-main)", fontSize: "0.9rem", lineHeight: 1.5 }}>
                Submitting your profile will send it for verification in Phase 4. You can also save as draft and resume anytime later.
              </p>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "32px", borderTop: "1px solid var(--border)", paddingTop: "20px" }}>
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={handleBack}
              style={{
                padding: "10px 20px",
                border: "1px solid var(--border)",
                background: "#ffffff",
                borderRadius: "8px",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              ← Back
            </button>
          ) : (
            <div />
          )}

          <div style={{ display: "flex", gap: "12px" }}>
            {currentStep < 6 ? (
              <button
                type="button"
                onClick={handleNext}
                style={{
                  padding: "10px 24px",
                  backgroundColor: "var(--primary)",
                  color: "#ffffff",
                  border: "none",
                  borderRadius: "8px",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                Save & Continue →
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmitProfile}
                disabled={isSaving}
                style={{
                  padding: "12px 28px",
                  backgroundColor: "#16a34a",
                  color: "#ffffff",
                  border: "none",
                  borderRadius: "8px",
                  fontWeight: 700,
                  fontSize: "1rem",
                  cursor: isSaving ? "not-allowed" : "pointer",
                }}
              >
                {isSaving ? "Submitting..." : "Submit Profile Draft"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
