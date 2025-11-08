import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { QueryProvider } from "@/components/providers/QueryProvider";
import { ToastContainer } from "@/shared/components/Toast";

// TODO: Move providers to infrastructure layer in future refactor
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Utility to validate environment variables with optional logging
function getEnvVar(key: string, fallback: string, logInProd = false): string {
  const value = process.env[key];
  if (!value) {
    if (process.env.NODE_ENV === "development" || logInProd) {
      // Log missing env variable (never expose sensitive info in production)
      console.warn(`[Env Warning] Environment variable '${key}' not set. Using fallback: '${fallback}'`);
    }
    return fallback;
  }
  return value;
}

export const metadata: Metadata = {
  title: "Inventory Management System - Dashboard",
  description: "Enterprise Inventory Management System",
  keywords: [
    "Inventory Management",
    "Dashboard",
    "Next.js",
    "TypeScript",
    "Tailwind CSS",
    "shadcn/ui",
    "React",
  ],
  authors: [{ name: "Dcugleer" }],
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: getEnvVar("NEXT_PUBLIC_OG_TITLE", "Inventory Management System"),
    description: getEnvVar("NEXT_PUBLIC_OG_DESCRIPTION", "Enterprise inventory dashboard"),
    url: getEnvVar("NEXT_PUBLIC_OG_URL", "https://github.com/Dcugleer/Sistema-de-Gest-o-de-Estoque"),
    siteName: getEnvVar("NEXT_PUBLIC_OG_SITE_NAME", "Inventory Management System"),
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: getEnvVar("NEXT_PUBLIC_TWITTER_TITLE", "Inventory Management System"),
    description: getEnvVar("NEXT_PUBLIC_TWITTER_DESCRIPTION", "Enterprise inventory dashboard"),
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // TODO: Add i18n support (Next Intl or similar)
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {/* Providers should be decoupled from main UI */}
        <QueryProvider>
          {children}
          <Toaster />
          <ToastContainer />
        </QueryProvider>
      </body>
    </html>
  );
}
