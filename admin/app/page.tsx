import React from "react";
import Link from "next/link";
import { ADMIN_CONFIG } from "../lib/config";
import { AdminSystemService } from "../services/api";

export const dynamic = "force-dynamic";

export default async function AdminHomePage() {
  const health = await AdminSystemService.checkHealth();

  return (
    <div className="admin-container" style={{ padding: "60px 0" }}>
      <div style={{ textAlign: "center", marginBottom: "40px" }}>
        <span className="admin-badge">Admin Portal Foundation</span>
        <h1 style={{ fontSize: "2.5rem", fontWeight: 800, marginTop: "16px", color: "#ffffff" }}>
          {ADMIN_CONFIG.portalName}
        </h1>
        <p style={{ color: "var(--admin-muted)", maxWidth: "600px", margin: "12px auto 24px" }}>
          Administrative management interface serving Bidar, Karnataka. Phase 1 route placeholders initialized.
        </p>

        <div style={{ display: "flex", gap: "16px", justifyContent: "center" }}>
          <Link href="/login" className="admin-btn">
            Go to Login Route
          </Link>
          <Link
            href="/dashboard"
            style={{
              border: "1px solid var(--admin-border)",
              padding: "8px 16px",
              borderRadius: "6px",
              color: "#ffffff",
              fontWeight: 600,
            }}
          >
            Go to Dashboard Route
          </Link>
        </div>
      </div>

      <div className="admin-card">
        <h3 style={{ fontSize: "1.1rem", marginBottom: "12px" }}>System Status Bridge</h3>
        <p style={{ color: "var(--admin-muted)", fontSize: "0.9rem" }}>
          API Connection: <strong style={{ color: "#38bdf8" }}>{health.status.toUpperCase()}</strong> (Environment: {health.environment})
        </p>
      </div>
    </div>
  );
}
