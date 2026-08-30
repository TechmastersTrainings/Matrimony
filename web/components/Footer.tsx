import React from "react";
import { APP_CONFIG } from "../lib/config";

export const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="container">
        <p>© 2026 {APP_CONFIG.appName}. Dedicated to Christian families initially in {APP_CONFIG.defaultRegion}.</p>
        <p style={{ marginTop: "6px", fontSize: "0.8rem", color: "#a8a29e" }}>
          Production-Ready Architecture • Monorepo Foundation Active
        </p>
      </div>
    </footer>
  );
};
