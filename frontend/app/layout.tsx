import type { Metadata } from "next";
import { InviteFromHashRedirect } from "@/components/auth/invite-from-hash-redirect";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";
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
  icons: {
    icon: "/css-logo.png",
    shortcut: "/css-logo.png",
    apple: "/css-logo.png",
  },
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
        {/* Suppress Next.js 15 dev-only "params are being enumerated" warning from internal tooling */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var f=function(msg){return msg&&String(msg).includes("params are being enumerated");};var e=console.error,w=console.warn;console.error=function(){if(f(arguments[0]))return;e.apply(console,arguments);};console.warn=function(){if(f(arguments[0]))return;w.apply(console,arguments);};})();`,
          }}
        />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <InviteFromHashRedirect />
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
