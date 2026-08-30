import React from "react";
import Link from "next/link";
import { ADMIN_CONFIG } from "../../lib/config";

export default function AdminLoginPage() {
  return (
    <div className="admin-container" style={{ padding: "80px 0", maxWidth: "480px" }}>
      <div className="admin-card" style={{ textAlign: "center" }}>
        <span className="admin-badge">Placeholder Route</span>
        <h2 style={{ fontSize: "1.75rem", fontWeight: 700, margin: "16px 0 8px", color: "#ffffff" }}>
          Admin Login
        </h2>
        <p style={{ color: "var(--admin-muted)", fontSize: "0.9rem", marginBottom: "24px" }}>
          Authentication functionality is scheduled for subsequent phases according to Phase 1 strict scope rules.
        </p>

        <div style={{ padding: "20px", background: "#0f172a", borderRadius: "8px", border: "1px dashed #475569", marginBottom: "24px" }}>
          <p style={{ color: "#94a3b8", fontSize: "0.85rem" }}>
            🔒 Route: <code>/login</code> is ready for auth integration.
          </p>
        </div>

        <Link href="/" className="admin-btn" style={{ display: "inline-block", width: "100%" }}>
          Back to Admin Overview
        </Link>
      </div>
    </div>
  );
}
