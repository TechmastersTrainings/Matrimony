"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { apiClient } from "../../lib/api-client";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    profile_created_by: "SELF",
    first_name: "",
    last_name: "",
    gender: "MALE",
    mobile_number: "",
    email: "",
    password: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const res = await apiClient.register({
        ...formData,
        role: formData.profile_created_by === "SELF" ? "CANDIDATE" : "MANAGER",
      });

      // Save target in session and redirect to OTP verification
      sessionStorage.setItem("verify_target", formData.mobile_number);
      sessionStorage.setItem("verify_email", formData.email);
      if (res.debug_otp) {
        sessionStorage.setItem("debug_otp", res.debug_otp);
      }

      router.push(`/verify?target=${encodeURIComponent(formData.mobile_number)}&type=REGISTRATION`);
    } catch (err: any) {
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container" style={{ padding: "50px 0", maxWidth: "600px" }}>
      <div className="card" style={{ padding: "36px" }}>
        <div style={{ textAlign: "center", marginBottom: "28px" }}>
          <span className="badge" style={{ marginBottom: "8px", display: "inline-block" }}>
            Bidar Christian Matrimony
          </span>
          <h1 style={{ fontSize: "1.85rem", fontWeight: 800, color: "var(--text-main)" }}>
            Create Your Account
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: "0.95rem", marginTop: "6px" }}>
            Begin your journey towards a blessed Christian marriage.
          </p>
        </div>

        {error && (
          <div
            style={{
              padding: "12px 16px",
              backgroundColor: "#fee2e2",
              border: "1px solid #f87171",
              borderRadius: "8px",
              color: "#b91c1c",
              fontSize: "0.9rem",
              marginBottom: "20px",
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "18px" }}>
            <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, marginBottom: "6px" }}>
              Profile Created By
            </label>
            <select
              name="profile_created_by"
              value={formData.profile_created_by}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: "10px 12px",
                borderRadius: "8px",
                border: "1px solid var(--border)",
                fontSize: "0.95rem",
                backgroundColor: "#fff",
              }}
            >
              <option value="SELF">Self (Candidate)</option>
              <option value="PARENT">Parent</option>
              <option value="SIBLING">Sibling</option>
              <option value="RELATIVE">Relative</option>
              <option value="FRIEND">Friend</option>
              <option value="GUARDIAN">Guardian</option>
            </select>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "18px" }}>
            <div>
              <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, marginBottom: "6px" }}>
                First Name
              </label>
              <input
                type="text"
                name="first_name"
                required
                value={formData.first_name}
                onChange={handleChange}
                placeholder="Joshua"
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  borderRadius: "8px",
                  border: "1px solid var(--border)",
                  fontSize: "0.95rem",
                }}
              />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, marginBottom: "6px" }}>
                Last Name
              </label>
              <input
                type="text"
                name="last_name"
                required
                value={formData.last_name}
                onChange={handleChange}
                placeholder="Fernandes"
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  borderRadius: "8px",
                  border: "1px solid var(--border)",
                  fontSize: "0.95rem",
                }}
              />
            </div>
          </div>

          <div style={{ marginBottom: "18px" }}>
            <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, marginBottom: "6px" }}>
              Gender
            </label>
            <div style={{ display: "flex", gap: "24px", padding: "6px 0" }}>
              <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                <input
                  type="radio"
                  name="gender"
                  value="MALE"
                  checked={formData.gender === "MALE"}
                  onChange={handleChange}
                />
                <span>Male (Groom)</span>
              </label>
              <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                <input
                  type="radio"
                  name="gender"
                  value="FEMALE"
                  checked={formData.gender === "FEMALE"}
                  onChange={handleChange}
                />
                <span>Female (Bride)</span>
              </label>
            </div>
          </div>

          <div style={{ marginBottom: "18px" }}>
            <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, marginBottom: "6px" }}>
              Mobile Number (10 Digits)
            </label>
            <input
              type="tel"
              name="mobile_number"
              required
              value={formData.mobile_number}
              onChange={handleChange}
              placeholder="9876543210"
              style={{
                width: "100%",
                padding: "10px 12px",
                borderRadius: "8px",
                border: "1px solid var(--border)",
                fontSize: "0.95rem",
              }}
            />
          </div>

          <div style={{ marginBottom: "18px" }}>
            <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, marginBottom: "6px" }}>
              Email Address
            </label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="joshua@example.com"
              style={{
                width: "100%",
                padding: "10px 12px",
                borderRadius: "8px",
                border: "1px solid var(--border)",
                fontSize: "0.95rem",
              }}
            />
          </div>

          <div style={{ marginBottom: "24px" }}>
            <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, marginBottom: "6px" }}>
              Password (Optional for OTP-only login)
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              style={{
                width: "100%",
                padding: "10px 12px",
                borderRadius: "8px",
                border: "1px solid var(--border)",
                fontSize: "0.95rem",
              }}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: "100%",
              padding: "12px",
              backgroundColor: "var(--primary)",
              color: "#ffffff",
              border: "none",
              borderRadius: "8px",
              fontSize: "1rem",
              fontWeight: 700,
              cursor: isLoading ? "not-allowed" : "pointer",
              opacity: isLoading ? 0.7 : 1,
            }}
          >
            {isLoading ? "Sending OTP..." : "Continue to OTP Verification"}
          </button>
        </form>

        <div style={{ marginTop: "24px", textAlign: "center", fontSize: "0.9rem", color: "var(--text-muted)" }}>
          Already have an account?{" "}
          <Link href="/login" style={{ color: "var(--primary)", fontWeight: 600 }}>
            Login here
          </Link>
        </div>
      </div>
    </div>
  );
}
