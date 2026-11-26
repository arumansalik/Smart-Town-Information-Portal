
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
    default: "Namma TPR – Local Information Portal",
    template: "%s | Namma TPR",
  },

  icons: {
    icon: [
      { url: "/favicon.ico" },
      // { url: "/icon.png", type: "image/png" },
    ],
    // apple: [
    //   { url: "/apple-icon.png", type: "image/png" },
    // ],
  },

  description:
      "Discover Tiruppattur with Namma TPR. Explore local shops, businesses, jobs, hospitals, bus timings, tourism and essential community information.",

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
    "Local businesses in Tiruppattur",
  ],


  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: "Namma TPR",
    title: "Namma TPR | Your Town. All in One Place.",
    description:
        "Discover local jobs, shops and services in Tiruppattur, Tamil Nadu.",
    url: "https://nammatpr.in",
  },

  twitter: {
    card: "summary_large_image",
    title: "Namma TPR | Your Town. All in One Place.",
    description:
        "Discover local jobs, shops and services in Tiruppattur, Tamil Nadu.",
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
      <html lang="en" className={`${geist.variable} ${poppins.variable}`}>
      <body>
      <AppChrome>{children}</AppChrome>
      </body>
      </html>
  );
}
