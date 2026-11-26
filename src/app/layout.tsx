
import "./globals.css";
import { Geist, Poppins } from "next/font/google";
import type { Metadata, Viewport } from "next";
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
  children: React.ReactNode;
}>) {
  return (
      <html
          lang="en"
          className={`${geist.variable} ${poppins.variable}`}
      >
      <body>
      <AppChrome>{children}</AppChrome>
      </body>
      </html>
  );
}
