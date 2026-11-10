"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowRight, BriefcaseBusiness, BusFront, Search, Store } from "lucide-react";

type Results = { shops: any[]; jobs: any[]; buses: any[] };
const empty: Results = { shops: [], jobs: [], buses: [] };

export default function SearchPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const q = searchParams.get("q") || "";
  const [input, setInput] = useState(q);
  const [data, setData] = useState<Results>(empty);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setInput(q);
    if (!q.trim()) { setData(empty); setLoading(false); return; }
    let cancelled = false;
    setLoading(true);
    fetch(`/api/search?q=${encodeURIComponent(q)}`, { signal: AbortSignal.timeout(8000) })
      .then((res) => res.ok ? res.json() : empty)
      .then((result) => { if (!cancelled) setData({ ...empty, ...result }); })
      .catch(() => { if (!cancelled) setData(empty); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [q]);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const query = input.trim();
    router.push(query ? `/search?q=${encodeURIComponent(query)}` : "/search");
  }

  const groups = [
    { label: "Local shops", Icon: Store, rows: data.shops, getTitle: (row: any) => row.name, getDetail: (row: any) => row.category || row.address, href: (row: any) => `/shops/${row.category || ""}` },
    { label: "Jobs", Icon: BriefcaseBusiness, rows: data.jobs, getTitle: (row: any) => row.role, getDetail: (row: any) => row.company || row.companyName, href: () => "/jobs" },
    { label: "Bus routes", Icon: BusFront, rows: data.buses, getTitle: (row: any) => row.route, getDetail: (row: any) => `${row.busName || "Local bus"} · ${row.time || "Timings"}`, href: () => "/buses" },
  ];
  const total = data.shops.length + data.jobs.length + data.buses.length;

  return <div className="mx-auto max-w-[920px] space-y-6 py-8 sm:py-12">
    <div><div className="eyebrow">Search your town</div><h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Find your next local thing.</h1><p className="mt-2 text-sm text-slate-500">Search nearby shops, work and bus routes.</p></div>
    <form onSubmit={submit} className="flex gap-2 rounded-2xl border border-slate-200 bg-white p-2 shadow-sm">
      <Search className="ml-2 self-center text-slate-400" size={19} /><input autoFocus value={input} onChange={(event) => setInput(event.target.value)} placeholder="Try “tailor”, “Madurai” or “designer”…" className="min-w-0 flex-1 border-0 bg-transparent px-2 text-sm outline-none" aria-label="Search shops, jobs and bus routes" />
      <button className="flex min-h-11 items-center gap-2 rounded-xl bg-emerald-800 px-4 text-sm font-semibold text-white">Search <ArrowRight size={15} /></button>
    </form>

    {q && <div className="flex items-center justify-between text-sm"><p className="text-slate-500">{loading ? "Looking around…" : `${total} ${total === 1 ? "result" : "results"} for`} {!loading && <strong className="text-slate-800">“{q}”</strong>}</p><Link href="/search" className="font-semibold text-emerald-800">Clear</Link></div>}
    {!q && <div className="rounded-2xl bg-emerald-50 p-5 text-sm text-emerald-900"><strong>Start with a place, service or skill.</strong><p className="mb-0 mt-1 text-emerald-800/80">Your search looks across local shops, job listings and bus routes.</p></div>}

    {groups.map(({ label, Icon, rows, getTitle, getDetail, href }) => rows.length > 0 && <section key={label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-3 flex items-center gap-2 text-sm font-bold text-slate-800"><Icon size={17} className="text-emerald-700" />{label}<span className="ml-auto rounded-full bg-slate-100 px-2 py-1 text-[10px] text-slate-500">{rows.length}</span></div>
      <div className="divide-y divide-slate-100">{rows.map((row: any) => <Link key={row._id} href={href(row)} className="flex items-center justify-between gap-4 py-3 text-sm first:pt-1 last:pb-1">
        <span className="min-w-0"><strong className="block truncate text-slate-800">{getTitle(row) || label}</strong><span className="mt-1 block truncate text-xs text-slate-500">{getDetail(row) || "Local listing"}</span></span><ArrowRight size={15} className="shrink-0 text-slate-400" />
      </Link>)}</div>
    </section>)}

    {!!q && !loading && total === 0 && <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center"><Search size={23} className="mx-auto text-slate-400" /><h2 className="mt-3 text-lg font-bold text-slate-800">Nothing found yet</h2><p className="mx-auto mt-1 max-w-md text-sm text-slate-500">Try another word, or browse shops, jobs and travel information directly.</p><div className="mt-5 flex flex-wrap justify-center gap-2"><Link className="rounded-full bg-emerald-50 px-4 py-2 text-xs font-semibold text-emerald-800" href="/shops">Browse shops</Link><Link className="rounded-full bg-emerald-50 px-4 py-2 text-xs font-semibold text-emerald-800" href="/jobs">Browse jobs</Link><Link className="rounded-full bg-emerald-50 px-4 py-2 text-xs font-semibold text-emerald-800" href="/buses">Bus timings</Link></div></div>}
  </div>;
}
