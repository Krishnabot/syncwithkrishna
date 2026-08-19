import type { Metadata, Viewport } from "next";
import YouTubeRedirectGuide from "@/components/YouTubeRedirectGuide";

export const metadata: Metadata = {
  title: "Redirecting to YouTube | The Nepali BookWorm",
  description: "Redirecting to The Nepali BookWorm on YouTube.",
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function YouTubeRedirectionPage() {
  return <YouTubeRedirectGuide />;
}
