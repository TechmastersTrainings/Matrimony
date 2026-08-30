import React from "react";
import Link from "next/link";
import { ADMIN_CONFIG } from "../lib/config";

export const AdminNavbar: React.FC = () => {
  return (
    <header className="admin-header">
      <div className="admin-container">
        <div className="admin-nav">
          <Link href="/" className="admin-logo">
            <span>🛡️</span>
            <span>{ADMIN_CONFIG.portalName}</span>
          </Link>
          <div className="admin-links">
            <Link href="/dashboard" className="admin-link">
              Dashboard
            </Link>
            <Link href="/login" className="admin-link admin-btn">
              Login (Placeholder)
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};
