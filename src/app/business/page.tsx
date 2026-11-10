"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { ArrowRight, BadgeCheck, BriefcaseBusiness, LocateFixed, MapPin, Store } from "lucide-react";

type ListingForm = { name: string; category: string; address: string; phone: string; photo: string; latitude: string; longitude: string };
const initialForm: ListingForm = { name: "", category: "", address: "", phone: "", photo: "", latitude: "", longitude: "" };

export default function BusinessPage() {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [locating, setLocating] = useState(false);

  function useMyLocation() {
    if (!navigator.geolocation) { setStatus("Location is unavailable in this browser. Enter map coordinates below."); return; }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => { setForm((current) => ({ ...current, latitude: coords.latitude.toString(), longitude: coords.longitude.toString() })); setLocating(false); setStatus("Location added. Review it before publishing."); },
      () => { setLocating(false); setStatus("We could not access your location. You can enter coordinates manually."); },
      { enableHighAccuracy: false, timeout: 10000 },
    );
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setStatus(""); setSubmitting(true);
    try {
      const response = await fetch("/api/shops", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: form.name, category: form.category.toLowerCase().trim(), address: form.address, phone: form.phone, photo: form.photo, location: { latitude: Number(form.latitude), longitude: Number(form.longitude) } }) });
      if (!response.ok) throw new Error("We could not publish this listing. Please check the details and try again.");
      setStatus("Your business is now listed. Neighbours can find it in local shops."); setForm(initialForm);
    } catch (error) { setStatus(error instanceof Error ? error.message : "Something went wrong. Please try again."); }
    finally { setSubmitting(false); }
  }

  const field = "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100";

  return <div className="mx-auto max-w-[1080px] space-y-8 py-8 sm:py-12">
    <section className="grid overflow-hidden rounded-[28px] bg-[#153d2c] text-white md:grid-cols-[1.15fr_.85fr]">
      <div className="p-7 sm:p-11"><div className="eyebrow !text-emerald-200">Local business, local reach</div><h1 className="mt-3 max-w-xl text-4xl font-semibold tracking-tight sm:text-5xl">Good things grow when neighbours find them.</h1><p className="mt-4 max-w-lg text-sm leading-7 text-emerald-50/80">Put your shop or service on the town map. Help people nearby discover what you do, and bring more support to local businesses.</p><a href="#add-listing" className="mt-7 inline-flex min-h-12 items-center gap-2 rounded-xl bg-[#e9ad57] px-5 text-sm font-bold text-[#2e2619]">Add a free listing <ArrowRight size={16} /></a></div>
      <div className="relative hidden min-h-[320px] items-center justify-center overflow-hidden bg-[radial-gradient(ellipse_at_center,rgba(144,184,135,.3),transparent_65%)] md:flex"><div className="absolute h-64 w-64 rounded-full border border-white/10 shadow-[0_0_0_35px_rgba(255,255,255,.025),0_0_0_75px_rgba(255,255,255,.02)]"/><div className="relative grid h-36 w-36 place-items-center rounded-full bg-[#e9ad57] text-emerald-950 shadow-2xl"><Store size={45} /></div><span className="absolute bottom-14 right-14 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs backdrop-blur">Keep it close. Keep it local.</span></div>
    </section>

    <section className="grid gap-8 lg:grid-cols-[.8fr_1.2fr]" id="add-listing">
      <div className="space-y-5">
        <div><div className="eyebrow">Made for our people</div><h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">A little more local in every search.</h2><p className="mt-2 text-sm leading-6 text-slate-500">Namma Ooru helps residents find the shops, services and opportunities already around them.</p></div>
        <div className="space-y-3">
          <div className="flex gap-3 rounded-2xl border border-slate-200 bg-white p-4"><span className="quick-icon h-10 w-10 shrink-0 bg-emerald-50 text-emerald-800"><MapPin size={18} /></span><div><strong className="text-sm text-slate-800">Be easier to find</strong><p className="mb-0 mt-1 text-xs leading-5 text-slate-500">Add your location so neighbours can get directions to your door.</p></div></div>
          <div className="flex gap-3 rounded-2xl border border-slate-200 bg-white p-4"><span className="quick-icon h-10 w-10 shrink-0 bg-amber-50 text-amber-800"><BadgeCheck size={18} /></span><div><strong className="text-sm text-slate-800">Share what you offer</strong><p className="mb-0 mt-1 text-xs leading-5 text-slate-500">Show your category, contact number and a photo of your place.</p></div></div>
          <div className="flex gap-3 rounded-2xl border border-slate-200 bg-white p-4"><span className="quick-icon h-10 w-10 shrink-0 bg-blue-50 text-blue-800"><BriefcaseBusiness size={18} /></span><div><strong className="text-sm text-slate-800">Find local talent</strong><p className="mb-0 mt-1 text-xs leading-5 text-slate-500">Have a vacancy? Share it with people looking for work nearby.</p></div></div>
        </div>
        <Link href="/post-job" className="inline-flex items-center gap-2 text-sm font-bold text-emerald-800">Post a local job <ArrowRight size={15} /></Link>
      </div>

      <form onSubmit={submit} className="space-y-4 rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
        <div><div className="eyebrow">Free business listing</div><h2 className="mt-1 text-xl font-bold text-slate-900">Tell your town about you</h2><p className="mt-1 text-xs text-slate-500">Fields marked * are required. Your phone number will be visible to customers.</p></div>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="space-y-1.5 text-xs font-semibold text-slate-600 sm:col-span-2">Business name *<input className={field} required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Lakshmi Tailors" /></label>
          <label className="space-y-1.5 text-xs font-semibold text-slate-600">Category *<input className={field} required value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="e.g. tailor, groceries" /></label>
          <label className="space-y-1.5 text-xs font-semibold text-slate-600">Phone number *<input className={field} required type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="A number customers can call" /></label>
          <label className="space-y-1.5 text-xs font-semibold text-slate-600 sm:col-span-2">Address *<input className={field} required value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} placeholder="Street, area, town" /></label>
          <label className="space-y-1.5 text-xs font-semibold text-slate-600 sm:col-span-2">Photo URL <input className={field} type="url" value={form.photo} onChange={(e) => setForm({ ...form, photo: e.target.value })} placeholder="https://… (optional)" /></label>
        </div>
        <div className="rounded-2xl bg-slate-50 p-4">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2"><div><strong className="block text-xs text-slate-800">Map location *</strong><span className="text-[11px] text-slate-500">Used to show directions to your business.</span></div><button type="button" onClick={useMyLocation} disabled={locating} className="inline-flex min-h-9 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 text-[11px] font-semibold text-emerald-800 disabled:opacity-50"><LocateFixed size={14} />{locating ? "Finding…" : "Use my location"}</button></div>
          <div className="grid grid-cols-2 gap-3"><label className="space-y-1 text-[11px] font-medium text-slate-500">Latitude<input className={field} required type="number" step="any" value={form.latitude} onChange={(e) => setForm({ ...form, latitude: e.target.value })} placeholder="10.0000" /></label><label className="space-y-1 text-[11px] font-medium text-slate-500">Longitude<input className={field} required type="number" step="any" value={form.longitude} onChange={(e) => setForm({ ...form, longitude: e.target.value })} placeholder="78.0000" /></label></div>
        </div>
        {status && <p aria-live="polite" className={`rounded-xl p-3 text-xs ${status.startsWith("Your business") ? "bg-emerald-50 text-emerald-800" : "bg-amber-50 text-amber-900"}`}>{status}</p>}
        <button disabled={submitting} type="submit" className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-emerald-800 px-5 text-sm font-bold text-white transition hover:bg-emerald-900 disabled:opacity-60">{submitting ? "Publishing…" : "Publish business listing"}<ArrowRight size={16} /></button>
      </form>
    </section>
  </div>;
}
