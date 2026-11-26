
import type { Metadata } from "next";
import HomeDashboard from "@/components/HomeDashboard";
import StructuredData from "@/components/StructuredData";
import { getWeather } from "@/lib/weather";

export const metadata: Metadata = {
  title: "Local Jobs, Shops & Services in Tiruppattur",
  description:
      "Discover Tiruppattur with Namma TPR. Find local businesses, shops, jobs, hospitals, bus timings, tourist places and essential town information.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Namma TPR – Local Jobs, Shops & Services in Tiruppattur",
    description:
        "Your local guide to businesses, jobs, shops, hospitals, transport and tourism in Tiruppattur.",
    url: "https://nammatpr.in/",
    type: "website",
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
    // Keep the town dashboard useful when the weather service is unavailable.
  }

  return (
      <>
        <StructuredData />
        <HomeDashboard weather={weather} />
      </>
  );
}
