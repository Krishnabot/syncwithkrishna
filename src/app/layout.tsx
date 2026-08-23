import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.SITE_URL || "https://syncwithkrishna.com"),
  title: "Sync with Krishna — Web & Game Development Studio",
  description: "Independent digital studio creating memorable websites, applications, games, and interactive experiences.",
  openGraph: { title: "Sync with Krishna", description: "Web, product, and game development for ambitious ideas.", url: "/", siteName: "Sync with Krishna", type: "website" },
  twitter: { card: "summary_large_image", title: "Sync with Krishna", description: "Web, product, and game development for ambitious ideas." },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en"><body>{children}</body></html>; }
