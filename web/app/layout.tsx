import React from "react";
import "./globals.css";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { APP_CONFIG } from "../lib/config";

export const metadata = {
  title: `${APP_CONFIG.appName} | Bidar, Karnataka`,
  description: "Trusted Christian Matrimony platform serving Christian families in Bidar, Karnataka, India.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
