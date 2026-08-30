import React from "react";
import Link from "next/link";
import { ADMIN_CONFIG } from "../../lib/config";

export default function AdminDashboardPage() {
  return (
    <div className="admin-container" style={{ padding: "60px 0" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px" }}>
        <div>
          <span className="admin-badge">Placeholder Route</span>
          <h1 style={{ fontSize: "2rem", fontWeight: 700, marginTop: "8px", color: "#ffffff" }}>
            Admin Dashboard
          </h1>
          <p style={{ color: "var(--admin-muted)", fontSize: "0.95rem" }}>
            Operational overview for Bidar, Karnataka matrimony administration.
          </p>
        </div>
        <Link href="/" className="admin-btn">
          Back to Overview
        </Link>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "20px" }}>
        <div className="admin-card">
          <div style={{ fontSize: "0.85rem", color: "var(--admin-muted)" }}>Total Registrations (Phase 2+)</div>
          <div style={{ fontSize: "2rem", fontWeight: 800, marginTop: "8px", color: "#ffffff" }}>--</div>
        </div>

        <div className="admin-card">
          <div style={{ fontSize: "0.85rem", color: "var(--admin-muted)" }}>Pending Approvals (Phase 2+)</div>
          <div style={{ fontSize: "2rem", fontWeight: 800, marginTop: "8px", color: "#ffffff" }}>--</div>
        </div>

        <div className="admin-card">
          <div style={{ fontSize: "0.85rem", color: "var(--admin-muted)" }}>Target Region</div>
          <div style={{ fontSize: "1.25rem", fontWeight: 700, marginTop: "12px", color: "#38bdf8" }}>Bidar, Karnataka</div>
        </div>
      </div>

      <div className="admin-card" style={{ marginTop: "32px" }}>
        <h3 style={{ fontSize: "1.1rem", marginBottom: "12px" }}>Phase 1 Status</h3>
        <p style={{ color: "var(--admin-muted)", fontSize: "0.9rem" }}>
          Admin panel routing foundation configured. Ready for approval queues, church/denomination managers, and subscription monitoring in later phases.
        </p>
      </div>
    </div>
  );
}
