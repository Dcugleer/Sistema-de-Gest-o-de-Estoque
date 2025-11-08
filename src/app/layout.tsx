import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { QueryProvider } from "@/components/providers/QueryProvider";
import { ToastContainer } from "@/shared/components/Toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sistema-de-Gestão-de-Estoque - Dashboard",
  description: "Sistema empresarial Gestão de Estoque",
  keywords: ["Gestão de Estoque", "Dashboard", "Next.js", "TypeScript", "Tailwind CSS", "shadcn/ui", "React"],
  authors: [{ name: "Dcugleer" }],
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "Sistema-de-Gestão-de-Estoque",
    description: "Dashboard empresarial para gestão de estoque",
    url: "https://github.com/Dcugleer/Sistema-de-Gest-o-de-Estoque",
    siteName: "Sistema-de-Gestão-de-Estoque",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sistema-de-Gestão-de-Estoque",
    description: "Dashboard empresarial para gestão de estoque",
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <QueryProvider>
          {children}
          <Toaster />
          <ToastContainer />
        </QueryProvider>
      </body>
    </html>
  );
}
