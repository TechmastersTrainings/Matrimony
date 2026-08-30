import React from "react";
import Link from "next/link";
import { ADMIN_CONFIG } from "../../lib/config";
import { adminApiClient } from "../../lib/api-client";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const [health, usersData] = await Promise.all([
    adminApiClient.getHealth(),
    adminApiClient.getUsers(0, 50),
  ]);

  const totalUsers = usersData.total;
  const activeAccounts = usersData.users.filter((u) => u.account_status === "ACTIVE").length;
  const submittedProfiles = usersData.users.filter((u) => u.profile_status === "SUBMITTED").length;

  return (
    <div className="admin-container" style={{ padding: "40px 0" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px" }}>
        <div>
          <span className="admin-badge">Phase 3 — Auth & Registration Monitor</span>
          <h1 style={{ fontSize: "2rem", fontWeight: 800, marginTop: "8px", color: "#ffffff" }}>
            Admin Dashboard
          </h1>
          <p style={{ color: "var(--admin-muted)", fontSize: "0.95rem" }}>
            Realtime view of registered candidates, profile managers, and registration statuses for {ADMIN_CONFIG.region}.
          </p>
        </div>
        <Link href="/" className="admin-btn">
          Back to Overview
        </Link>
      </div>

      {/* KPI Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "20px", marginBottom: "36px" }}>
        <div className="admin-card">
          <div style={{ fontSize: "0.85rem", color: "var(--admin-muted)" }}>Total Users Registered</div>
          <div style={{ fontSize: "2.25rem", fontWeight: 800, marginTop: "8px", color: "#38bdf8" }}>{totalUsers}</div>
        </div>

        <div className="admin-card">
          <div style={{ fontSize: "0.85rem", color: "var(--admin-muted)" }}>Active Accounts</div>
          <div style={{ fontSize: "2.25rem", fontWeight: 800, marginTop: "8px", color: "#4ade80" }}>{activeAccounts}</div>
        </div>

        <div className="admin-card">
          <div style={{ fontSize: "0.85rem", color: "var(--admin-muted)" }}>Submitted Profiles (Pending Phase 4)</div>
          <div style={{ fontSize: "2.25rem", fontWeight: 800, marginTop: "8px", color: "#facc15" }}>{submittedProfiles}</div>
        </div>

        <div className="admin-card">
          <div style={{ fontSize: "0.85rem", color: "var(--admin-muted)" }}>API Backend Health</div>
          <div style={{ fontSize: "1.25rem", fontWeight: 700, marginTop: "12px", color: health.status === "healthy" ? "#4ade80" : "#f87171" }}>
            {health.status.toUpperCase()}
          </div>
        </div>
      </div>

      {/* Users & Registration Status Table */}
      <div className="admin-card">
        <h3 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: "16px", color: "#ffffff" }}>
          Registered Accounts & Statuses
        </h3>

        {usersData.users.length === 0 ? (
          <div style={{ padding: "30px", textAlign: "center", color: "var(--admin-muted)" }}>
            No registered users found yet. Complete registration on the website to view user statuses here.
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.9rem" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--admin-border)", color: "var(--admin-muted)" }}>
                  <th style={{ padding: "12px 8px" }}>ID</th>
                  <th style={{ padding: "12px 8px" }}>Name</th>
                  <th style={{ padding: "12px 8px" }}>Mobile / Email</th>
                  <th style={{ padding: "12px 8px" }}>Role</th>
                  <th style={{ padding: "12px 8px" }}>Account Status</th>
                  <th style={{ padding: "12px 8px" }}>Profile Status</th>
                  <th style={{ padding: "12px 8px" }}>Progress</th>
                </tr>
              </thead>
              <tbody>
                {usersData.users.map((user) => (
                  <tr key={user.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                    <td style={{ padding: "12px 8px", color: "var(--admin-muted)" }}>#{user.id}</td>
                    <td style={{ padding: "12px 8px", fontWeight: 600, color: "#ffffff" }}>
                      {user.first_name} {user.last_name}
                    </td>
                    <td style={{ padding: "12px 8px" }}>
                      <div>{user.mobile_number}</div>
                      <div style={{ fontSize: "0.8rem", color: "var(--admin-muted)" }}>{user.email}</div>
                    </td>
                    <td style={{ padding: "12px 8px" }}>
                      <span className="admin-badge">{user.role}</span>
                    </td>
                    <td style={{ padding: "12px 8px" }}>
                      <span
                        style={{
                          fontSize: "0.8rem",
                          fontWeight: 700,
                          color: user.account_status === "ACTIVE" ? "#4ade80" : "#facc15",
                        }}
                      >
                        {user.account_status}
                      </span>
                    </td>
                    <td style={{ padding: "12px 8px" }}>
                      <span
                        style={{
                          fontSize: "0.8rem",
                          fontWeight: 700,
                          color: user.profile_status === "SUBMITTED" ? "#38bdf8" : "#94a3b8",
                        }}
                      >
                        {user.profile_status}
                      </span>
                    </td>
                    <td style={{ padding: "12px 8px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <div
                          style={{
                            flex: 1,
                            height: "6px",
                            background: "#334155",
                            borderRadius: "4px",
                            overflow: "hidden",
                            minWidth: "60px",
                          }}
                        >
                          <div
                            style={{
                              width: `${user.completion_percentage}%`,
                              height: "100%",
                              background: "#38bdf8",
                            }}
                          />
                        </div>
                        <span style={{ fontSize: "0.8rem", color: "var(--admin-muted)" }}>
                          {user.completion_percentage}%
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
