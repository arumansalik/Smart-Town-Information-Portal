"use client";

import { Home, Store, Bus, Briefcase, Hospital } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function BottomNav() {
    const pathname = usePathname();

    const getClass = (path: string) =>
        pathname === path ? "text-primary" : "text-text";

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around py-2 z-50">

            <Link href="/" className={`flex flex-col items-center text-xs ${getClass("/")}`}>
                <Home size={20} />
                Home
            </Link>

            <Link href="/shops" className={`flex flex-col items-center text-xs ${getClass("/shops")}`}>
                <Store size={20} />
                Shops
            </Link>

            <Link href="/buses" className={`flex flex-col items-center text-xs ${getClass("/buses")}`}>
                <Bus size={20} />
                Buses
            </Link>

            <Link href="/jobs" className={`flex flex-col items-center text-xs ${getClass("/jobs")}`}>
                <Briefcase size={20} />
                Jobs
            </Link>

            <Link href="/hospitals" className={`flex flex-col items-center text-xs ${getClass("/hospitals")}`}>
                <Hospital size={20} />
                Hospital
            </Link>

        </div>
    );
}