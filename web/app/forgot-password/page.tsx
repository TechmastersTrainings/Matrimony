"use client";

import React, { useState } from "react";
import Link from "next/link";
import { apiClient } from "../../lib/api-client";

export default function ForgotPasswordPage() {
  const [identifier, setIdentifier] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [debugOtp, setDebugOtp] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim()) return;
    setIsLoading(true);
    setError(null);

    try {
      const res = await apiClient.sendOtp(identifier.trim(), "PASSWORD_RESET");
      setOtpSent(true);
      if (res.debug_otp) setDebugOtp(res.debug_otp);
    } catch (err: any) {
      setError(err.message || "Failed to send password reset OTP.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Authenticate with OTP first
      await apiClient.login({
        identifier: identifier.trim(),
        otp_code: otpCode.trim(),
        login_type: "otp",
      });
      setIsSuccess(true);
    } catch (err: any) {
      setError(err.message || "Invalid OTP code.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container" style={{ padding: "60px 0", maxWidth: "480px" }}>
      <div className="card" style={{ padding: "36px" }}>
        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          <h1 style={{ fontSize: "1.75rem", fontWeight: 800, color: "var(--text-main)" }}>
            Reset Password
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", marginTop: "6px" }}>
            Verify your identity using OTP to reset your account password.
          </p>
        </div>

        {error && (
          <div
            style={{
              padding: "10px 14px",
              backgroundColor: "#fee2e2",
              border: "1px solid #f87171",
              borderRadius: "8px",
              color: "#b91c1c",
              fontSize: "0.85rem",
              marginBottom: "20px",
            }}
          >
            {error}
          </div>
        )}

        {debugOtp && (
          <div
            style={{
              padding: "10px 14px",
              backgroundColor: "#fef9c3",
              border: "1px dashed #ca8a04",
              borderRadius: "8px",
              color: "#854d0e",
              fontSize: "0.85rem",
              marginBottom: "20px",
            }}
          >
            ⚡ Test Mode OTP: <strong>{debugOtp}</strong>
          </div>
        )}

        {isSuccess ? (
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                padding: "16px",
                backgroundColor: "#dcfce7",
                borderRadius: "8px",
                color: "#166534",
                marginBottom: "20px",
              }}
            >
              ✓ Identity verified successfully! You are now logged in.
            </div>
            <Link
              href="/profile/create"
              style={{
                display: "inline-block",
                padding: "12px 24px",
                backgroundColor: "var(--primary)",
                color: "#ffffff",
                borderRadius: "8px",
                fontWeight: 700,
              }}
            >
              Go to Profile
            </Link>
          </div>
        ) : !otpSent ? (
          <form onSubmit={handleSendOtp}>
            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, marginBottom: "6px" }}>
                Mobile Number or Email
              </label>
              <input
                type="text"
                required
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="e.g. 9876543210"
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  borderRadius: "8px",
                  border: "1px solid var(--border)",
                  fontSize: "0.95rem",
                  color: "#000000",
                  backgroundColor: "#ffffff",
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
                cursor: "pointer",
              }}
            >
              {isLoading ? "Sending..." : "Send Verification OTP"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleResetPassword}>
            <div style={{ marginBottom: "18px" }}>
              <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, marginBottom: "6px" }}>
                Enter 6-Digit OTP
              </label>
              <input
                type="text"
                maxLength={6}
                required
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ""))}
                placeholder="123456"
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  borderRadius: "8px",
                  border: "1px solid var(--border)",
                  fontSize: "1.2rem",
                  letterSpacing: "4px",
                  textAlign: "center",
                  fontWeight: 700,
                  color: "#000000",
                  backgroundColor: "#ffffff",
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
                cursor: "pointer",
              }}
            >
              {isLoading ? "Verifying..." : "Verify & Sign In"}
            </button>
          </form>
        )}

        <div style={{ marginTop: "24px", textAlign: "center", fontSize: "0.9rem" }}>
          <Link href="/login" style={{ color: "var(--primary)", fontWeight: 600 }}>
            ← Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}
