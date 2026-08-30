"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { apiClient } from "../../lib/api-client";

export default function LoginPage() {
  const router = useRouter();
  const [loginType, setLoginType] = useState<"password" | "otp">("password");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [debugOtp, setDebugOtp] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSendOtp = async () => {
    if (!identifier.trim()) {
      setError("Please enter your mobile number or email address.");
      return;
    }
    setIsLoading(true);
    setError(null);

    try {
      const res = await apiClient.sendOtp(identifier.trim(), "LOGIN");
      setOtpSent(true);
      if (res.debug_otp) setDebugOtp(res.debug_otp);
    } catch (err: any) {
      setError(err.message || "Failed to send OTP.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await apiClient.login({
        identifier: identifier.trim(),
        password: loginType === "password" ? password : undefined,
        otp_code: loginType === "otp" ? otpCode : undefined,
        login_type: loginType,
      });

      router.push("/profile/create");
    } catch (err: any) {
      setError(err.message || "Login failed. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container" style={{ padding: "60px 0", maxWidth: "480px" }}>
      <div className="card" style={{ padding: "36px" }}>
        <div style={{ textAlign: "center", marginBottom: "28px" }}>
          <h1 style={{ fontSize: "1.85rem", fontWeight: 800, color: "var(--text-main)" }}>
            Welcome Back
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", marginTop: "6px" }}>
            Login to your Christian Matrimony account
          </p>
        </div>

        {/* Tab Toggle */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "8px",
            backgroundColor: "var(--bg-main)",
            padding: "4px",
            borderRadius: "8px",
            marginBottom: "24px",
          }}
        >
          <button
            type="button"
            onClick={() => {
              setLoginType("password");
              setError(null);
            }}
            style={{
              padding: "8px 12px",
              border: "none",
              borderRadius: "6px",
              fontWeight: 600,
              fontSize: "0.85rem",
              backgroundColor: loginType === "password" ? "#ffffff" : "transparent",
              color: loginType === "password" ? "var(--primary)" : "var(--text-muted)",
              boxShadow: loginType === "password" ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
              cursor: "pointer",
            }}
          >
            Password Login
          </button>
          <button
            type="button"
            onClick={() => {
              setLoginType("otp");
              setError(null);
            }}
            style={{
              padding: "8px 12px",
              border: "none",
              borderRadius: "6px",
              fontWeight: 600,
              fontSize: "0.85rem",
              backgroundColor: loginType === "otp" ? "#ffffff" : "transparent",
              color: loginType === "otp" ? "var(--primary)" : "var(--text-muted)",
              boxShadow: loginType === "otp" ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
              cursor: "pointer",
            }}
          >
            OTP Login
          </button>
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

        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: "18px" }}>
            <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, marginBottom: "6px" }}>
              Mobile Number or Email
            </label>
            <input
              type="text"
              required
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="e.g. 9876543210 or user@example.com"
              style={{
                width: "100%",
                padding: "10px 12px",
                borderRadius: "8px",
                border: "1px solid var(--border)",
                fontSize: "0.95rem",
              }}
            />
          </div>

          {loginType === "password" ? (
            <div style={{ marginBottom: "20px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                <label style={{ fontSize: "0.85rem", fontWeight: 600 }}>Password</label>
                <Link
                  href="/forgot-password"
                  style={{ fontSize: "0.8rem", color: "var(--primary)", fontWeight: 600 }}
                >
                  Forgot Password?
                </Link>
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
          ) : (
            <div style={{ marginBottom: "20px" }}>
              <div style={{ display: "flex", gap: "8px", marginBottom: "8px" }}>
                <input
                  type="text"
                  maxLength={6}
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ""))}
                  placeholder="Enter 6-digit OTP"
                  style={{
                    flex: 1,
                    padding: "10px 12px",
                    borderRadius: "8px",
                    border: "1px solid var(--border)",
                    fontSize: "0.95rem",
                    textAlign: "center",
                    letterSpacing: "4px",
                    fontWeight: 700,
                  }}
                />
                <button
                  type="button"
                  onClick={handleSendOtp}
                  disabled={isLoading}
                  style={{
                    padding: "10px 14px",
                    backgroundColor: "var(--primary-light)",
                    color: "var(--primary)",
                    border: "1px solid var(--primary)",
                    borderRadius: "8px",
                    fontSize: "0.85rem",
                    fontWeight: 600,
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                  }}
                >
                  {otpSent ? "Resend OTP" : "Send OTP"}
                </button>
              </div>
            </div>
          )}

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
            {isLoading ? "Signing in..." : "Login"}
          </button>
        </form>

        <div style={{ marginTop: "24px", textAlign: "center", fontSize: "0.9rem", color: "var(--text-muted)" }}>
          Don&apos;t have an account?{" "}
          <Link href="/register" style={{ color: "var(--primary)", fontWeight: 600 }}>
            Register Free
          </Link>
        </div>
      </div>
    </div>
  );
}
