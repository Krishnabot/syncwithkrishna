import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { cookies } from "next/headers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.SITE_URL || 'http://localhost:3000'),
  title: {
    default: 'Personal Blog',
    template: '%s · Personal Blog',
  },
  description: 'Journals, essays, poems — a personal writing space',
  openGraph: {
    type: 'website',
    title: 'Personal Blog',
    description: 'Journals, essays, poems — a personal writing space',
    url: '/',
    siteName: 'Personal Blog',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Personal Blog',
    description: 'Journals, essays, poems — a personal writing space',
  },
  alternates: { canonical: '/' },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const theme = cookieStore.get("theme")?.value;
  return (
    <html lang="en" className={theme === "dark" ? "dark" : undefined} suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Header />
        <main className="max-w-5xl mx-auto px-4 py-8">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
