import React from "react";
import "./globals.css";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";

export const metadata = {
  title: "Christian Matrimony | Find Someone Who Shares Your Faith",
  description:
    "A trusted Christian matrimonial platform for meaningful connections built on faith, values and commitment. Serving Bidar, Karnataka and Christian communities across India.",
  keywords: [
    "Christian Matrimony",
    "Bidar Christian Matrimony",
    "Karnataka Christian Brides",
    "Methodist Matrimony",
    "CSI Matrimony",
    "Catholic Matrimony",
    "Christian Matchmaking",
    "Faith Centered Matrimony",
  ],
  openGraph: {
    title: "Christian Matrimony | Find Someone Who Shares Your Faith",
    description:
      "A trusted Christian matrimonial platform for meaningful connections built on faith, values and commitment.",
    url: "https://christianmatrimony.app",
    siteName: "Christian Matrimony",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Christian Matrimony | Find Someone Who Shares Your Faith",
    description:
      "A trusted Christian matrimonial platform for meaningful connections built on faith, values and commitment.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400;1,600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[#FAF9F6] text-[#17202A] font-sans antialiased selection:bg-[#C9A227]/20 selection:text-[#172554]">
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
