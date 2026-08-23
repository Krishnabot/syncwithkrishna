import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const siteUrl = process.env.SITE_URL || "https://www.syncwithkrishna.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "SYNC://KRISHNA — Interactive Developer Terminal",
  description: "Don't browse Krishna's portfolio. Ask it. Explore Krishna's skills, projects, services, experience, interests, and contact details through an interactive developer terminal.",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website", url: "/", siteName: "Sync With Krishna",
    title: "SYNC://KRISHNA — Interactive Developer Terminal",
    description: "Connect to Krishna's interactive digital interface and ask about his work, skills, and interests.",
  },
  twitter: {
    card: "summary_large_image", title: "SYNC://KRISHNA",
    description: "Don't browse my portfolio. Ask it.",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#030907", colorScheme: "dark" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body className={`${geistSans.variable} ${geistMono.variable}`}>{children}</body></html>;
}
