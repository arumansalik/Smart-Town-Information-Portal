'use client';

import "./globals.css";
import Navbar from "@/components/Navbar";
import BottomNav from "@/components/BottomNav";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { Poppins } from "next/font/google";

const geist = Geist({
    subsets: ['latin'],
    variable: '--font-sans',
});

// 🔥 ADD POPPINS
const poppins = Poppins({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"],
    variable: "--font-poppins",
});

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {

    const pathname = usePathname();

    const isAdmin = pathname.startsWith("/admin");

    return (
        <html lang="en" className={cn(geist.variable, poppins.variable)}>
        <body className="bg-bg text-text">

        {/* 🔥 Hide in admin */}
        {!isAdmin && <Navbar />}

        <main className={!isAdmin ? "pb-20 px-4" : "p-5"}>
            {children}
        </main>

        {!isAdmin && <BottomNav />}

        </body>
        </html>
    );
}