
"use client";

import Navbar from "@/components/Navbar";
import BottomNav from "@/components/BottomNav";
import { usePathname } from "next/navigation";

export default function SiteShell({
                                      children,
                                  }: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();

    const isAdmin = pathname.startsWith("/admin");
    const isBusiness = pathname.startsWith("/business");

    return (
        <>
            {!isAdmin && !isBusiness && <Navbar />}

            {children}

            {!isAdmin && !isBusiness && <BottomNav />}
        </>
    );
}
