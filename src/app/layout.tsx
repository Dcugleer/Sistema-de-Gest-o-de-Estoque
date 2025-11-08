import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { QueryProvider } from "@/components/providers/QueryProvider";
import { ToastContainer } from "@/shared/components/Toast";

// TODO: Separar providers em camada de infraestrutura futuramente
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Função para validar variáveis de ambiente
function getEnvVar(key: string, fallback: string): string {
  const value = process.env[key];
  if (!value) {
    // TODO: Adicionar logging para variáveis ausentes
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
  // TODO: Adicionar suporte a internacionalização (i18n)
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {/* Providers devem ser desacoplados da UI principal */}
        <QueryProvider>
          {children}
          <Toaster />
          <ToastContainer />
        </QueryProvider>
      </body>
    </html>
  );
}
