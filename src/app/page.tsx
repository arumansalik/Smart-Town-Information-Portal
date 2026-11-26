
import type { Metadata } from "next";
import HomeDashboard from "@/components/HomeDashboard";
import StructuredData from "@/components/StructuredData";
import { getWeather } from "@/lib/weather";

export const metadata: Metadata = {
  title: {
    absolute:
        "Namma TPR – Jobs, Shops & Local Services in Tiruppattur",
  },

  description:
      "Find local jobs, shops, businesses, hospitals, bus timings and tourism information in Tiruppattur, Tamil Nadu. Explore your town with Namma TPR.",

  alternates: {
    canonical: "/",
  },

  openGraph: {
    title:
        "Namma TPR – Jobs, Shops & Local Services in Tiruppattur",
    description:
        "Find local jobs, shops, businesses, hospitals, bus timings and tourism information in Tiruppattur, Tamil Nadu.",
    url: "https://nammatpr.in/",
    siteName: "Namma TPR",
    locale: "en_IN",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title:
        "Namma TPR – Jobs, Shops & Local Services in Tiruppattur",
    description:
        "Find local jobs, shops, businesses, hospitals, bus timings and tourism information in Tiruppattur, Tamil Nadu.",
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default async function Home() {
  let weather = null;

  try {
    weather = await getWeather();
  } catch {
    // Keep the dashboard available if weather is unavailable.
  }

  return (
      <>
        <StructuredData />
        <HomeDashboard weather={weather} />
      </>
  );
}
