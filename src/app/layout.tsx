
import "./globals.css";
import { Geist, Poppins } from "next/font/google";
import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import AppChrome from "@/components/AppChrome";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://nammatpr.in"),

  title: {
    default:
        "Namma TPR – Jobs, Shops & Local Services in Tiruppattur",
    template: "%s | Namma TPR",
  },

  description:
      "Discover Tiruppattur with Namma TPR. Find local jobs, shops, businesses, hospitals, bus timings, tourism and essential community information.",

  applicationName: "Namma TPR",

  keywords: [
    "Namma TPR",
    "Tiruppattur",
    "Tiruppattur local information",
    "Jobs in Tiruppattur",
    "Tiruppattur shops",
    "Local businesses in Tiruppattur",
    "Tiruppattur hospitals",
    "Tiruppattur bus timings",
    "Tourist places near Tiruppattur",
  ],

  icons: {
    icon: [
      { url: "/favicon.ico" },
    ],
  },

  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: "Namma TPR",
    title:
        "Namma TPR – Jobs, Shops & Local Services in Tiruppattur",
    description:
        "Find local jobs, shops, businesses, hospitals, bus timings and tourism information in Tiruppattur, Tamil Nadu.",
    url: "https://nammatpr.in/",
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

  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Namma TPR",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#153d2c",
};

export default function RootLayout({
                                     children,
                                   }: Readonly<{
  children: ReactNode;
}>) {
  return (
      <html lang="en" className={`${geist.variable} ${poppins.variable}`}>
      <body>
      <AppChrome>{children}</AppChrome>
      </body>
      </html>
  );
}
