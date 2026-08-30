"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { apiClient } from "../../lib/api-client";

export default function VerifyOtpPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const targetParam = searchParams.get("target") || "";
  const typeParam = searchParams.get("type") || "REGISTRATION";

  const [target, setTarget] = useState(targetParam);
  const [otpCode, setOtpCode] = useState("");
  const [debugOtp, setDebugOtp] = useState<string | null>(null);
  const [timer, setTimer] = useState(60);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [infoMsg, setInfoMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!target) {
      const savedTarget = sessionStorage.getItem("verify_target");
      if (savedTarget) setTarget(savedTarget);
    }
    const savedDebug = sessionStorage.getItem("debug_otp");
    if (savedDebug) setDebugOtp(savedDebug);
  }, [target]);

  useEffect(() => {
    if (timer <= 0) return;
    const interval = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const res = await apiClient.verifyOtp(target, otpCode, typeParam);
      // If user has not completed draft, go to profile creation wizard
      router.push("/profile/create");
    } catch (err: any) {
      setError(err.message || "OTP verification failed. Please check the code.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (timer > 0) return;
    setIsLoading(true);
    setError(null);
    setInfoMsg(null);

    try {
      const res = await apiClient.sendOtp(target, typeParam);
      setTimer(60);
      setInfoMsg(res.message);
      if (res.debug_otp) {
        setDebugOtp(res.debug_otp);
      }
    } catch (err: any) {
      setError(err.message || "Failed to resend OTP.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container" style={{ padding: "60px 0", maxWidth: "480px" }}>
      <div className="card" style={{ padding: "36px", textAlign: "center" }}>
        <div
          style={{
            width: "56px",
            height: "56px",
            borderRadius: "50%",
            background: "var(--primary-light)",
            color: "var(--primary)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 16px",
            fontSize: "1.5rem",
          }}
        >
          📱
        </div>

        <h1 style={{ fontSize: "1.75rem", fontWeight: 800, color: "var(--text-main)" }}>
          Verify Your Mobile / Email
        </h1>
        <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", marginTop: "8px" }}>
          We have sent a 6-digit verification code to: <br />
          <strong style={{ color: "var(--text-main)" }}>{target || "your mobile/email"}</strong>
        </p>

        {debugOtp && (
          <div
            style={{
              marginTop: "16px",
              padding: "10px",
              backgroundColor: "#fef9c3",
              border: "1px dashed #ca8a04",
              borderRadius: "6px",
              fontSize: "0.85rem",
              color: "#854d0e",
            }}
          >
            ⚡ Test Mode OTP: <strong>{debugOtp}</strong>
          </div>
        )}

        {error && (
          <div
            style={{
              marginTop: "16px",
              padding: "10px",
              backgroundColor: "#fee2e2",
              border: "1px solid #f87171",
              borderRadius: "6px",
              color: "#b91c1c",
              fontSize: "0.85rem",
            }}
          >
            {error}
          </div>
        )}

        {infoMsg && (
          <div
            style={{
              marginTop: "16px",
              padding: "10px",
              backgroundColor: "#dcfce7",
              border: "1px solid #86efac",
              borderRadius: "6px",
              color: "#166534",
              fontSize: "0.85rem",
            }}
          >
            {infoMsg}
          </div>
        )}

        <form onSubmit={handleVerify} style={{ marginTop: "24px" }}>
          <div style={{ marginBottom: "20px" }}>
            <input
              type="text"
              maxLength={6}
              value={otpCode}
              onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ""))}
              placeholder="123456"
              required
              autoFocus
              style={{
                width: "100%",
                padding: "14px",
                fontSize: "1.5rem",
                letterSpacing: "8px",
                textAlign: "center",
                fontWeight: 700,
                borderRadius: "8px",
                border: "2px solid var(--primary)",
                outline: "none",
              }}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || otpCode.length < 4}
            style={{
              width: "100%",
              padding: "12px",
              backgroundColor: "var(--primary)",
              color: "#ffffff",
              border: "none",
              borderRadius: "8px",
              fontSize: "1rem",
              fontWeight: 700,
              cursor: isLoading || otpCode.length < 4 ? "not-allowed" : "pointer",
              opacity: isLoading || otpCode.length < 4 ? 0.7 : 1,
            }}
          >
            {isLoading ? "Verifying..." : "Verify & Continue"}
          </button>
        </form>

        <div style={{ marginTop: "24px", fontSize: "0.9rem", color: "var(--text-muted)" }}>
          {timer > 0 ? (
            <span>Resend OTP in <strong>{timer}s</strong></span>
          ) : (
            <button
              onClick={handleResend}
              style={{
                background: "none",
                border: "none",
                color: "var(--primary)",
                fontWeight: 700,
                cursor: "pointer",
                textDecoration: "underline",
              }}
            >
              Resend OTP Now
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
