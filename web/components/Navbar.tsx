"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { APP_CONFIG } from "../lib/config";
import { apiClient } from "../lib/api-client";

export const Navbar: React.FC = () => {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;
    setIsAuthenticated(!!token);
  }, []);

  const handleLogout = async () => {
    await apiClient.logout();
    setIsAuthenticated(false);
    router.push("/login");
  };

  return (
    <header className="header">
      <div className="container">
        <nav className="nav">
          <Link href="/" className="logo">
            <span>✝</span>
            <span>{APP_CONFIG.appName}</span>
            <span className="badge">Bidar, Karnataka</span>
          </Link>

          <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
            {isAuthenticated ? (
              <>
                <Link
                  href="/profile/create"
                  style={{
                    fontSize: "0.9rem",
                    fontWeight: 600,
                    color: "var(--primary)",
                    padding: "8px 14px",
                    borderRadius: "6px",
                    background: "var(--primary-light)",
                  }}
                >
                  My Profile / Draft
                </Link>
                <button
                  onClick={handleLogout}
                  style={{
                    fontSize: "0.85rem",
                    fontWeight: 600,
                    color: "var(--text-muted)",
                    background: "none",
                    border: "1px solid var(--border)",
                    padding: "8px 14px",
                    borderRadius: "6px",
                    cursor: "pointer",
                  }}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  style={{
                    fontSize: "0.9rem",
                    fontWeight: 600,
                    color: "var(--text-main)",
                    padding: "8px 14px",
                  }}
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  style={{
                    fontSize: "0.9rem",
                    fontWeight: 600,
                    color: "#ffffff",
                    backgroundColor: "var(--primary)",
                    padding: "8px 16px",
                    borderRadius: "6px",
                  }}
                >
                  Register Free
                </Link>
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};
