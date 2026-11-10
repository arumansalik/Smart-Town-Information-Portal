"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BriefcaseBusiness, Compass, House, Menu, Store } from "lucide-react";

const items = [
  { label: "Home", href: "/", Icon: House },
  { label: "Explore", href: "/tourism", Icon: Compass },
  { label: "Shops", href: "/shops", Icon: Store },
  { label: "Jobs", href: "/jobs", Icon: BriefcaseBusiness },
  { label: "More", href: "/buses", Icon: Menu },
];

export default function BottomNav() {
  const pathname = usePathname();

  return <nav className="mobile-nav" aria-label="Quick navigation">
    {items.map(({ label, href, Icon }) => {
      const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
      return <Link key={href} href={href} className={active ? "mobile-nav-link active" : "mobile-nav-link"}>
        <Icon size={20} strokeWidth={active ? 2.4 : 1.9} />
        <span>{label}</span>
      </Link>;
    })}
  </nav>;
}
