import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "CareerForge AI — Your Career Operating System",
    template: "%s | CareerForge AI",
  },
  description:
    "AI-powered career platform for students and professionals. Analyze resumes, practice interviews, identify skill gaps, and get personalized career mentoring.",
  keywords: [
    "AI career platform",
    "resume analyzer",
    "interview practice",
    "skill gap analysis",
    "career mentor",
    "job matching",
    "learning roadmap",
  ],
  authors: [{ name: "CareerForge AI" }],
  creator: "CareerForge AI",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://careerforge.ai",
    siteName: "CareerForge AI",
    title: "CareerForge AI — Your Career Operating System",
    description: "AI-powered career platform for the next generation of engineers.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "CareerForge AI" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "CareerForge AI",
    description: "AI-powered career platform for the next generation of engineers.",
    images: ["/og-image.png"],
  },
  robots: { index: true, follow: true },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0d0f1a" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased`}>
        {children}
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: "hsl(215 27.9% 16.9%)",
              border: "1px solid hsl(215 27.9% 22%)",
              color: "hsl(210 20% 98%)",
            },
          }}
        />
      </body>
    </html>
  );
}
