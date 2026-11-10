"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import BottomNav from "@/components/BottomNav";

export default function AppChrome({ children }: { children: ReactNode }) {
  const isAdmin = usePathname().startsWith("/admin");

  return <>
    {!isAdmin && <Navbar />}
    <main className={isAdmin ? "admin-main" : "site-main"}>{children}</main>
    {!isAdmin && <BottomNav />}
  </>;
}
