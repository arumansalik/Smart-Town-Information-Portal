import "./globals.css";
import { Geist, Poppins } from "next/font/google";
import type { Viewport } from "next";
import AppChrome from "@/components/AppChrome";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });
const poppins = Poppins({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-poppins" });

export const metadata = {
  title: "Namma Ooru — your town, together",
  description: "Local updates, shops, jobs, buses, emergency services and places to explore in your town.",
  applicationName: "Namma Ooru",
  appleWebApp: { capable: true, statusBarStyle: "default", title: "Namma Ooru" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#153d2c",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" className={`${geist.variable} ${poppins.variable}`}>
    <body><AppChrome>{children}</AppChrome></body>
  </html>;
}
