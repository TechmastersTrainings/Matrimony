import React from "react";
import { APP_CONFIG } from "../lib/config";

export const Navbar: React.FC = () => {
  return (
    <header className="header">
      <div className="container">
        <nav className="nav">
          <div className="logo">
            <span>✝</span>
            <span>{APP_CONFIG.appName}</span>
            <span className="badge">Bidar, Karnataka</span>
          </div>
          <div>
            <span className="badge" style={{ background: "#e0f2fe", color: "#0369a1", borderColor: "#bae6fd" }}>
              {APP_CONFIG.phase}
            </span>
          </div>
        </nav>
      </div>
    </header>
  );
};
