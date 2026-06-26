/**
 * @file layout.tsx
 * @module frontend/app
 *
 * Root Next.js layout — wraps the entire application.
 * Registers global fonts (Geist, Geist_Mono), sets default metadata,
 * mounts the Toaster notification system, Vercel Analytics, and the
 * InviteFromHashRedirect handler for magic-link email invites.
 *
 * ## What belongs here
 * - App-wide providers, fonts, and metadata
 * - Components that must wrap every page (Toaster, Analytics)
 *
 * ## What does NOT belong here
 * - Page-specific layout (use route-specific layout.tsx files)
 * - Auth guards (those go in each protected page)
 */
import type { Metadata } from "next";
import { InviteFromHashRedirect } from "@/components/auth/invite-from-hash-redirect";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: "CSS Atlas",
  description: "View your engagement metrics and stats in one place",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <InviteFromHashRedirect />
        {children}
        <Toaster />
      </body>
    </html>
  );
}
