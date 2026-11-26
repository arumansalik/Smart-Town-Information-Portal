
import type { Metadata, Viewport } from "next";
import "./globals.css";

import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";
import SiteShell from "@/components/SiteShell";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.nammatpr.in"),

  title: {
    default: "Namma TPR | Local Information Portal",
    template: "%s | Namma TPR",
  },

  description:
      "Discover everything about Tiruppattur in one place. Find local shops, jobs, hospitals, bus timings, tourism destinations and essential community information.",

  applicationName: "Namma TPR",

  keywords: [
    "Namma TPR",
    "Tiruppattur",
    "Tiruppattur local information",
    "Tiruppattur shops",
    "Jobs in Tiruppattur",
    "Tiruppattur hospitals",
    "Tiruppattur bus timings",
    "Tourist places near Tiruppattur",
    "Local businesses Tiruppattur",
  ],

  alternates: {
    canonical: "/",
  },

  openGraph: {
    title: "Namma TPR | Discover Your Town",
    description:
        "Explore local shops, jobs, hospitals, transportation and tourism in Tiruppattur.",
    url: "https://nammatpr.in",
    siteName: "Namma TPR",
    locale: "en_IN",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Namma TPR | Discover Your Town",
    description:
        "Your digital guide to local information and services in Tiruppattur.",
  },

  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#153d2c",
};

export default function RootLayout({
                                     children,
                                   }: {
  children: React.ReactNode;
}) {
  return (
      <html lang="en" className={cn("font-sans", geist.variable)}>
      <body className="bg-bg text-text pb-16">
      <SiteShell>{children}</SiteShell>
      </body>
      </html>
  );
}
