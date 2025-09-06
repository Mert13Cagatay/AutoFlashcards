import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ClerkProvider } from '@clerk/nextjs';
import { ThemeProvider } from '@/components/layout/theme-provider';
import { AuthProvider } from '@/components/layout/auth-provider';
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AI Flashcards - Transform Your Study Notes with AI",
  description: "Upload your notes and let AI create personalized flashcards that adapt to your learning style. Study smarter with spaced repetition and intelligent progress tracking.",
  keywords: ["AI flashcards", "study notes", "spaced repetition", "learning", "education", "AI-powered", "study tools"],
  authors: [{ name: "AI Flashcards Team" }],
  creator: "AI Flashcards",
  publisher: "AI Flashcards",
  metadataBase: new URL("https://your-app-name.vercel.app"),
  openGraph: {
    title: "AI Flashcards - Transform Your Study Notes with AI",
    description: "Upload your notes and let AI create personalized flashcards that adapt to your learning style.",
    url: "https://your-app-name.vercel.app",
    siteName: "AI Flashcards",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "AI Flashcards - Smart Study Platform",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Flashcards - Transform Your Study Notes with AI",
    description: "Upload your notes and let AI create personalized flashcards that adapt to your learning style.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#4285F4" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ClerkProvider>
          <AuthProvider>
            <ThemeProvider>{children}</ThemeProvider>
          </AuthProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
