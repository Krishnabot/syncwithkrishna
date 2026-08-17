import type { Metadata } from "next";
import YouTubeRedirectGuide from "@/components/YouTubeRedirectGuide";

export const metadata: Metadata = {
  title: "Open in Browser",
  description: "Instructions for opening The Nepali Book Worm in your browser.",
  robots: { index: false, follow: false },
};

export default function YouTubeRedirectionPage() {
  return <YouTubeRedirectGuide />;
}
