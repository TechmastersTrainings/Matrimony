"use client";

import React, { useEffect } from "react";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Admin Application Error:", error);
  }, [error]);

  return (
    <div className="admin-container" style={{ padding: "80px 0", textAlign: "center" }}>
      <h2 style={{ fontSize: "1.5rem", color: "#f87171", marginBottom: "12px" }}>
        Admin Portal Error
      </h2>
      <p style={{ color: "var(--admin-muted)", marginBottom: "24px" }}>
        {error.message || "An unexpected error occurred in the administrative interface."}
      </p>
      <button onClick={() => reset()} className="admin-btn">
        Retry
      </button>
    </div>
  );
}
