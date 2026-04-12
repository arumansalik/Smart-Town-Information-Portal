import "./globals.css";
import Navbar from "@/components/Navbar";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});


export default function RootLayout({
                                     children,
                                   }: {
  children: React.ReactNode;
}) {
  return (
      <html lang="en" className={cn("font-sans", geist.variable)}>
      <body>
      <Navbar />
      {children}
      </body>
      </html>
  );
}