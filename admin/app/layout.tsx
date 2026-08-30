import React from "react";
import "./globals.css";
import { AdminNavbar } from "../components/AdminNavbar";
import { ADMIN_CONFIG } from "../lib/config";

export const metadata = {
  title: `${ADMIN_CONFIG.portalName} | Management Console`,
  description: "Administrative console foundation for Christian Matrimony platform.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AdminNavbar />
        <main>{children}</main>
      </body>
    </html>
  );
}
