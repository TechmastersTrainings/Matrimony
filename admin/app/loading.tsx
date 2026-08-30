import React from "react";

export default function AdminLoading() {
  return (
    <div className="admin-container" style={{ padding: "100px 0", textAlign: "center" }}>
      <div style={{ fontSize: "2rem", marginBottom: "16px" }}>⚙️</div>
      <h2 style={{ fontSize: "1.2rem", color: "var(--admin-muted)" }}>Loading Admin Console...</h2>
    </div>
  );
}
