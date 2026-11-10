"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, MapPin, Search, Store } from "lucide-react";

const links = [
  ["Home", "/"],
  ["Explore", "/tourism"],
  ["Local shops", "/shops"],
  ["Find work", "/jobs"],
  ["Bus times", "/buses"],
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-[#f8faf8]/90 backdrop-blur-xl">
      <div className="mx-auto flex h-[68px] max-w-[1440px] items-center justify-between px-4 sm:px-6 lg:px-10">
        <Link href="/" className="flex min-w-0 items-center gap-3" aria-label="Namma Ooru home">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-emerald-800 text-lg font-bold text-white shadow-sm">ந</span>
          <span className="min-w-0">
            <span className="block truncate text-[15px] font-extrabold tracking-tight text-slate-900">namma ooru</span>
            <span className="hidden text-[10px] font-semibold uppercase tracking-[.18em] text-slate-500 sm:block">your town, together</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Main navigation">
          {links.map(([label, href]) => {
            const active = href === "/" ? pathname === href : pathname.startsWith(href);
            return <Link key={href} href={href} className={`rounded-full px-4 py-2 text-[13px] font-semibold transition ${active ? "bg-emerald-50 text-emerald-900" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"}`}>{label}</Link>;
          })}
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          <span className="hidden items-center gap-1.5 rounded-full bg-white px-3 py-2 text-xs font-semibold text-slate-600 ring-1 ring-slate-200 sm:flex"><MapPin size={14} className="text-emerald-700" />Thiruppathur</span>
          <Link href="/search" aria-label="Search" className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-slate-700 ring-1 ring-slate-200 transition hover:bg-slate-50"><Search size={18} /></Link>
          <Link href="/business" aria-label="For local businesses" className="hidden h-10 w-10 items-center justify-center rounded-full bg-emerald-800 text-white transition hover:bg-emerald-900 sm:flex"><Store size={18} /></Link>
          <Link href="/hospitals" aria-label="Emergency services" className="flex h-10 w-10 items-center justify-center rounded-full bg-rose-50 text-rose-700 ring-1 ring-rose-100 transition hover:bg-rose-100"><Bell size={18} /></Link>
        </div>
      </div>
    </header>
  );
}
