"use client";

import React, { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Web Application Error:", error);
  }, [error]);

  return (
    <div className="container" style={{ padding: "80px 0", textAlign: "center" }}>
      <h2 style={{ fontSize: "1.5rem", color: "#b91c1c", marginBottom: "12px" }}>
        Something went wrong
      </h2>
      <p style={{ color: "#78716c", marginBottom: "24px" }}>
        {error.message || "An unexpected error occurred while loading this page."}
      </p>
      <button
        onClick={() => reset()}
        style={{
          backgroundColor: "#9b2c2c",
          color: "#ffffff",
          border: "none",
          padding: "10px 20px",
          borderRadius: "8px",
          cursor: "pointer",
          fontWeight: 600,
        }}
      >
        Try Again
      </button>
    </div>
  );
}
