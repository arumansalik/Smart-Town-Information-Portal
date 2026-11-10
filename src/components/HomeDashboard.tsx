"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight, ArrowUpRight, Activity, BookOpen, BriefcaseBusiness, BusFront,
  Cloud, CloudFog, CloudLightning, CloudRain, Compass, HeartPulse, Landmark, ShieldCheck,
  LocateFixed, MapPin, Navigation, Phone, Search, Share2, ShoppingBasket, Store, Sun, Thermometer, Wind,
} from "lucide-react";

type TownData = { buses: any[]; jobs: any[]; shops: any[]; hospitals: any[]; places: any[] };
type WeatherData = { main?: { temp?: number; humidity?: number }; weather?: { main?: string; description?: string }[]; wind?: { speed?: number } } | null;
type Coordinates = { latitude: number; longitude: number };

const dailyEssentials = [
  { label: "Groceries", href: "/shops/super-market", matches: ["super market", "supermarket", "grocery", "groceries"] },
  { label: "Pharmacy", href: "/shops/pharmacy", matches: ["pharmacy", "medical", "medical shop"] },
  { label: "ATM", href: "/shops/atm", matches: ["atm", "bank"] },
];

function shopDistanceKm(shop: any, from: Coordinates) {
  const latitude = Number(shop.location?.latitude);
  const longitude = Number(shop.location?.longitude);
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude) || Math.abs(latitude) > 90 || Math.abs(longitude) > 180) return null;
  const radians = (degrees: number) => degrees * Math.PI / 180;
  const latitudeDelta = radians(latitude - from.latitude);
  const longitudeDelta = radians(longitude - from.longitude);
  const arc = Math.sin(latitudeDelta / 2) ** 2 + Math.cos(radians(from.latitude)) * Math.cos(radians(latitude)) * Math.sin(longitudeDelta / 2) ** 2;
  return 6371 * 2 * Math.atan2(Math.sqrt(arc), Math.sqrt(1 - arc));
}

function parseDepartureTime(value: string) {
  const match = value?.trim().toLowerCase().match(/^(\d{1,2})(?::(\d{2}))?\s*(am|pm)?$/);
  if (!match) return null;
  let hour = Number(match[1]);
  const minute = Number(match[2] || 0);
  if (minute > 59) return null;
  if (match[3]) {
    if (hour < 1 || hour > 12) return null;
    if (match[3] === "am" && hour === 12) hour = 0;
    if (match[3] === "pm" && hour !== 12) hour += 12;
  } else if (hour > 23) return null;
  return hour * 60 + minute;
}

function minutesToDeparture(time: string, currentMinute: number | null) {
  const departure = parseDepartureTime(time);
  return departure === null || currentMinute === null ? null : (departure - currentMinute + 1440) % 1440;
}

function departureLabel(minutes: number | null) {
  if (minutes === null) return "Check schedule";
  if (minutes === 0) return "Departing now";
  if (minutes < 60) return `In ${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const remaining = minutes % 60;
  return remaining ? `In ${hours}h ${remaining}m` : `In ${hours}h`;
}

const quickLinks = [
  { label: "Shops & services", href: "/shops", Icon: Store, color: "#e9f3eb", ink: "#2d7046" },
  { label: "Jobs nearby", href: "/jobs", Icon: BriefcaseBusiness, color: "#f6eee1", ink: "#a86d22" },
  { label: "Bus timings", href: "/buses", Icon: BusFront, color: "#e9eef6", ink: "#4a6894" },
  { label: "Hospitals", href: "/hospitals", Icon: HeartPulse, color: "#faeae8", ink: "#b9534a" },
  { label: "Places to visit", href: "/tourism", Icon: Compass, color: "#f1eafa", ink: "#7654a4" },
  { label: "List your business", href: "/business", Icon: Landmark, color: "#e8f1f2", ink: "#3f7479" },
];

async function getList(path: string) {
  try {
    const response = await fetch(path, { signal: AbortSignal.timeout(6500), cache: "no-store" });
    if (!response.ok) return [];
    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch { return []; }
}

export default function HomeDashboard({ weather }: { weather: WeatherData }) {
  const [town, setTown] = useState<TownData>({ buses: [], jobs: [], shops: [], hospitals: [], places: [] });
  const [today, setToday] = useState("");
  const [lastUpdated, setLastUpdated] = useState("");
  const [shareMessage, setShareMessage] = useState("");
  const [loaded, setLoaded] = useState(false);
  const [currentMinute, setCurrentMinute] = useState<number | null>(null);
  const [homeCoordinates, setHomeCoordinates] = useState<Coordinates | null>(null);
  const [findingEssentials, setFindingEssentials] = useState(false);
  const [essentialsMessage, setEssentialsMessage] = useState("");

  useEffect(() => {
    setToday(new Intl.DateTimeFormat("en-IN", { weekday: "long", day: "numeric", month: "long" }).format(new Date()));
    const setClock = () => { const now = new Date(); setCurrentMinute(now.getHours() * 60 + now.getMinutes()); };
    setClock();
    const clock = window.setInterval(setClock, 30_000);
    const refreshTown = () => Promise.all([
      getList("/api/buses"), getList("/api/jobs?status=approved"), getList("/api/shops"),
      getList("/api/hospitals"), getList("/api/tourism"),
    ]).then(([buses, jobs, shops, hospitals, places]) => {
      setTown({ buses, jobs, shops, hospitals, places });
      setLastUpdated(new Intl.DateTimeFormat("en-IN", { hour: "numeric", minute: "2-digit" }).format(new Date()));
      setLoaded(true);
    });
    void refreshTown();
    const timer = window.setInterval(refreshTown, 60_000);
    return () => { window.clearInterval(timer); window.clearInterval(clock); };
  }, []);

  const busSchedule = [...town.buses].sort((a: any, b: any) => {
    const aMinutes = minutesToDeparture(a.time || "", currentMinute);
    const bMinutes = minutesToDeparture(b.time || "", currentMinute);
    return (aMinutes ?? Infinity) - (bMinutes ?? Infinity);
  });
  const nextBus = busSchedule[0];
  const nextBusMinutes = nextBus ? minutesToDeparture(nextBus.time || "", currentMinute) : null;
  const nearbyEssentials = homeCoordinates ? dailyEssentials.map((essential) => {
    const candidates = town.shops
      .filter((shop: any) => essential.matches.includes(String(shop.category || "").trim().toLowerCase()))
      .map((shop: any) => ({ shop, distance: shopDistanceKm(shop, homeCoordinates) }))
      .filter((item: { shop: any; distance: number | null }): item is { shop: any; distance: number } => item.distance !== null)
      .sort((a: { distance: number }, b: { distance: number }) => a.distance - b.distance);
    return { ...essential, nearest: candidates[0] || null };
  }) : [];

  const temp = typeof weather?.main?.temp === "number" ? Math.round(weather.main.temp) : null;
  const condition = weather?.weather?.[0]?.description || "Local weather";
  const weatherMain = weather?.weather?.[0]?.main || "";
  const conditionKey = weatherMain.toLowerCase();
  const weatherKind = !conditionKey ? "unknown" : /thunder/.test(conditionKey) ? "stormy" : /rain|drizzle/.test(conditionKey) ? "rainy" : /cloud/.test(conditionKey) ? "cloudy" : /mist|fog|haze|smoke/.test(conditionKey) ? "misty" : "sunny";
  const WeatherScene = weatherKind === "stormy" ? CloudLightning : weatherKind === "rainy" ? CloudRain : weatherKind === "cloudy" ? Cloud : weatherKind === "misty" ? CloudFog : weatherKind === "unknown" ? Cloud : Sun;
  const popularTerms = [...new Set([
    ...town.shops.slice(0, 2).map((shop: any) => shop.category),
    town.jobs[0]?.role,
    town.buses[0]?.route,
  ].filter((term): term is string => typeof term === "string" && term.trim().length > 0))].slice(0, 5);

  async function shareTown() {
    const shareData = { title: "Namma Ooru", text: "Find local shops, jobs, bus timings and places in our town.", url: window.location.origin };
    try {
      if (navigator.share) await navigator.share(shareData);
      else { await navigator.clipboard.writeText(shareData.url); setShareMessage("Town link copied"); window.setTimeout(() => setShareMessage(""), 2200); }
    } catch { setShareMessage("Share unavailable"); window.setTimeout(() => setShareMessage(""), 2200); }
  }

  function findDailyEssentials() {
    if (!navigator.geolocation) { setEssentialsMessage("Location is not available in this browser."); return; }
    setFindingEssentials(true);
    setEssentialsMessage("");
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => { setHomeCoordinates({ latitude: coords.latitude, longitude: coords.longitude }); setFindingEssentials(false); },
      (error) => { setFindingEssentials(false); setEssentialsMessage(error.code === error.PERMISSION_DENIED ? "Allow location access to sort essentials by distance." : "Could not find your location. Try again."); },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 60000 },
    );
  }

  return <div className="home-wrap">
    <section className="home-hero" aria-labelledby="home-title">
      <div className="home-hero-copy">
        <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[.15em] text-[#b8d2c1]"><MapPin size={14} /> Thiruppathur · Tamil Nadu</div>
        <h1 id="home-title">Your town.<br />All in one place.</h1>
        <p>Find what you need nearby, support local people, and stay in the loop with what’s happening in your ooru.</p>
        <form action="/search" className="hero-search">
          <Search size={18} className="ml-2 self-center text-[#89968e]" />
          <input name="q" aria-label="Search your town" placeholder="Shops, jobs, bus routes…" />
          <button type="submit">Search <ArrowRight size={15} /></button>
        </form>
        <div className="hero-actions">
          <Link href="/buses" className="hero-action"><BusFront size={15} /> Find a bus</Link>
          <Link href="/jobs" className="hero-action"><BriefcaseBusiness size={15} /> Find work</Link>
          <button type="button" onClick={shareTown} className="hero-action"><Share2 size={15} /> {shareMessage || "Share town"}</button>
        </div>
      </div>
      <div className="hero-art" aria-hidden="true"><span className="hero-pin"><MapPin size={19} /></span><span className="hero-art-label">Our town, our community</span></div>
    </section>

    

    <section aria-labelledby="quick-title">
      <div className="section-heading"><div><div className="eyebrow">Made for everyday</div><h2 id="quick-title">What do you need today?</h2></div><span className="hidden text-xs text-slate-400 sm:block">{today}</span></div>
      <div className="quick-grid">
        {quickLinks.map(({ label, href, Icon, color, ink }) => <Link key={href} href={href} className="quick-link">
          <span className="quick-icon" style={{ background: color, color: ink }}><Icon size={20} /></span>
          <span>{label}</span>
        </Link>)}
      </div>
      {popularTerms.length > 0 && <div className="popular-searches"><span>Popular nearby:</span>{popularTerms.map((term) => <Link key={term} href={`/search?q=${encodeURIComponent(term)}`}>{term}</Link>)}</div>}
    </section>

    <section className="surface home-bus-board" aria-labelledby="home-bus-board-title">
      <div className="home-bus-board-heading"><div><span className="eyebrow">GETTING AROUND TOWN</span><h2 id="home-bus-board-title">Next buses</h2><p>Upcoming departures sorted from the current time.</p></div><div className="home-bus-board-actions"><span className="home-bus-clock">{currentMinute === null ? "Checking time…" : `Now · ${new Date().toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit" })}`}</span><Link href="/buses">Full timetable <ArrowUpRight size={15} /></Link></div></div>
      {busSchedule.length ? <div className="home-bus-board-body">
        {nextBus && <Link href="/buses" className="home-bus-featured"><span className="home-bus-featured-icon"><BusFront size={24} /></span><span className="home-bus-featured-copy"><small>NEXT SCHEDULED DEPARTURE</small><strong>{nextBus.route || "Local bus route"}</strong><span>{nextBus.busName || "Local bus"} · {nextBus.type || "Bus"}</span></span><span className="home-bus-featured-time"><strong>{nextBus.time || "—"}</strong><span>{nextBusMinutes !== null && currentMinute !== null && nextBusMinutes >= 1440 - currentMinute ? "Tomorrow · " : ""}{departureLabel(nextBusMinutes)}</span></span><ArrowRight size={18} className="home-bus-featured-arrow" /></Link>}
        <div className="home-next-list">{busSchedule.slice(nextBus ? 1 : 0, nextBus ? 5 : 4).map((bus: any) => {
          const wait = minutesToDeparture(bus.time || "", currentMinute);
          return <Link className="home-next-item" key={bus._id} href="/buses"><span className="home-next-item-time">{bus.time || "—"}</span><span className="home-next-item-copy"><strong>{bus.route || "Local route"}</strong><small>{bus.busName || bus.type || "Local bus"}</small></span><span className="home-next-item-wait">{wait !== null && currentMinute !== null && wait >= 1440 - currentMinute ? "Tomorrow · " : ""}{departureLabel(wait)}</span></Link>;
        })}</div>
      </div> : <div className="home-bus-empty"><BusFront size={22} /><strong>No bus times listed yet</strong><span>Check the timetable for updates from local operators.</span></div>}
    </section>

    <div className="home-grid">
      <div className="home-stack">
        <section className="surface" aria-labelledby="jobs-title">
          <div className="section-heading"><div><div className="eyebrow">Work close to home</div><h2 id="jobs-title">New local opportunities</h2></div><Link href="/jobs">Browse jobs <ArrowUpRight size={14} className="inline" /></Link></div>
          {town.jobs.length ? <div className="data-list">{town.jobs.slice(0, 4).map((job: any) => <Link className="data-row" key={job._id} href="/jobs">
            <span className="data-avatar"><BriefcaseBusiness size={19} /></span><span className="data-copy"><strong>{job.role || "Local opportunity"}</strong><span>{job.companyName || job.company || "Local employer"}</span></span><span className="data-meta">{job.salary ? `₹${job.salary}` : job.jobType || "View details"}</span>
          </Link>)}</div> : <div className="empty-state">Discover work shared by businesses in your community, or <Link className="font-semibold text-emerald-800" href="/post-job">post an opportunity →</Link></div>}
        </section>

        <section className="surface" aria-labelledby="places-title">
          <div className="section-heading"><div><div className="eyebrow">Roots & routes</div><h2 id="places-title">Explore our region</h2></div><Link href="/tourism">All places <ArrowUpRight size={14} className="inline" /></Link></div>
          {town.places.length ? <div className="tourism-grid">{town.places.slice(0, 3).map((place: any) => <Link href="/tourism" className="tourism-card" key={place._id}>
            <img src={place.image || "/images/market.jpg"} alt="" loading="lazy" /><div><strong>{place.title || place.place || "A place to discover"}</strong><span>{place.place || "Culture · Heritage · Nature"}</span></div>
          </Link>)}</div> : <div className="empty-state">Local heritage, landmarks and visitor spots will be featured here. <Link className="font-semibold text-emerald-800" href="/tourism">Discover the region →</Link></div>}
        </section>

        <section className="daily-essentials" aria-labelledby="daily-essentials-title">
          <div className="daily-essentials-top">
            <span className="daily-essentials-mark"><LocateFixed size={19} /></span>
            <div className="daily-essentials-title"><span className="eyebrow">RIGHT AROUND YOU</span><h2 id="daily-essentials-title">Everyday essentials</h2><p>Find the closest grocery, pharmacy or ATM.</p></div>
            {!homeCoordinates && <button className="daily-essentials-locate" type="button" onClick={findDailyEssentials} disabled={findingEssentials}><LocateFixed size={15} />{findingEssentials ? "Finding…" : "Find nearby"}</button>}
          </div>
          {homeCoordinates ? <div className="daily-essentials-list">
            {nearbyEssentials.map(({ label, href, nearest }) => <div className="daily-essential-row" key={label}>
              <span className={`daily-essential-icon essential-${label.toLowerCase()}`}>{label === "Groceries" ? <ShoppingBasket size={17} /> : label === "Pharmacy" ? <HeartPulse size={17} /> : <Landmark size={17} />}</span>
              <div className="daily-essential-info"><strong>{nearest?.shop.name || `Find ${label.toLowerCase()}`}</strong><span>{nearest ? `${label} · ${nearest.distance < .1 ? "<0.1" : nearest.distance.toFixed(1)} km away` : `No mapped ${label.toLowerCase()} listed`}</span></div>
              <span className="daily-essential-actions">
                {nearest?.shop.phone && <a className="daily-essential-action" href={`tel:${nearest.shop.phone}`} aria-label={`Call ${nearest.shop.name}`}><Phone size={14} /></a>}
                <a className="daily-essential-action" href={nearest ? `https://www.google.com/maps?q=${nearest.shop.location.latitude},${nearest.shop.location.longitude}` : href} target={nearest ? "_blank" : undefined} rel={nearest ? "noreferrer" : undefined} aria-label={nearest ? `Map ${nearest.shop.name}` : `Browse ${label.toLowerCase()}`}><Navigation size={14} /></a>
              </span>
            </div>)}
          </div> : <div className="daily-essentials-preview">
            <span><ShoppingBasket size={16} /> Groceries</span><i /><span><HeartPulse size={16} /> Pharmacy</span><i /><span><Landmark size={16} /> ATM</span>
          </div>}
          {essentialsMessage && <p className="daily-essentials-message" role="status">{essentialsMessage}</p>}
          {homeCoordinates && <button className="daily-essentials-refresh" type="button" onClick={findDailyEssentials} disabled={findingEssentials}>{findingEssentials ? "Updating location…" : "Refresh my location"}</button>}
        </section>

        <Link href="/learn" className="home-learn-card">
          <span className="home-learn-glow" aria-hidden="true" />
          <span className="home-learn-icon"><ShieldCheck size={23} /></span>
          <span className="home-learn-copy"><small>FREE · ENGLISH + தமிழ்</small><strong>Learn at your pace</strong><span>Simple digital safety lessons to spot scams, protect payments and stay confident online.</span><span className="home-learn-topics">UPI safety <i /> Fake links <i /> Scam calls</span></span>
          <span className="home-learn-action">Start learning <ArrowRight size={15} /></span>
        </Link>
      </div>

      <aside className="home-stack home-sidebar" aria-label="Local updates and services">
        <section className={`surface weather-panel weather-${weatherKind}`} aria-labelledby="weather-title">
          <div className="weather-scene" aria-hidden="true"><WeatherScene size={118} strokeWidth={1.15} /></div>
          <div className="weather-content">
            <div className="weather-topline"><div><div className="eyebrow">Around town · Thiruppathur</div><h2 id="weather-title">Today’s weather</h2></div><span className="weather-live"><span /> Current</span></div>
            <div className="weather-reading"><div className="weather-temp">{temp === null ? "—" : `${temp}°`}</div><div className="weather-summary"><strong className="capitalize">{weatherMain || "Weather"}</strong><span className="capitalize">{condition}</span></div></div>
            <div className="weather-detail"><span><Wind size={14} />Wind {weather?.wind?.speed ?? "—"} m/s</span><span><Activity size={14} />Humidity {weather?.main?.humidity ?? "—"}%</span></div>
            {temp === null && <p className="weather-unavailable">Weather updates appear when available.</p>}
          </div>
        </section>

        <section className="emergency-panel" aria-labelledby="emergency-title">
          <div className="eyebrow !text-rose-700">Here when it matters</div><h3 id="emergency-title">Emergency help</h3>
          <p>Quick access to ambulance services and nearby hospitals.</p>
          <a className="call-108" href="tel:108"><HeartPulse size={17} /> Call ambulance · 108</a>
          <Link href="/hospitals" className="mt-3 flex items-center justify-center gap-1 py-2 text-xs font-bold text-rose-800">Nearby hospitals <ArrowRight size={13} /></Link>
        </section>

        <section className="surface" aria-labelledby="shops-title">
          <div className="section-heading"><div><div className="eyebrow">Keep it local</div><h2 id="shops-title">Around the corner</h2></div><Link href="/shops">All shops <ArrowUpRight size={14} className="inline" /></Link></div>
          {town.shops.length ? <div className="data-list">{town.shops.slice(0, 3).map((shop: any) => <Link className="data-row" key={shop._id} href={`/shops/${shop.category || ""}`}>
            <span className="data-avatar"><ShoppingBasket size={18} /></span><span className="data-copy"><strong>{shop.name || "Local business"}</strong><span>{shop.category || shop.address || "Shop · Service · More"}</span></span><ArrowUpRight size={15} className="text-slate-400" />
          </Link>)}</div> : <div className="empty-state">Find independent shops, everyday services and food spots nearby. <Link className="font-semibold text-emerald-800" href="/shops">Browse local shops →</Link></div>}
        </section>

        {town.hospitals.length > 0 && <section className="surface">
          <div className="section-heading"><div><div className="eyebrow">Care nearby</div><h2>Hospitals</h2></div><Link href="/hospitals">View all <ArrowUpRight size={14} className="inline" /></Link></div>
          <div className="data-list">{town.hospitals.slice(0, 2).map((hospital: any) => <div className="data-row" key={hospital._id}>
            <span className="data-avatar !bg-rose-50 !text-rose-700"><HeartPulse size={18} /></span><span className="data-copy"><strong>{hospital.name}</strong><span>{hospital.type || hospital.address}</span></span>{hospital.phone && <a className="data-meta" href={`tel:${hospital.phone}`}>Call</a>}
          </div>)}</div>
        </section>}

        <section className="service-shortcuts" aria-label="Helpful town links">
          <div className="eyebrow">Quick links</div>
          <Link href="/post-job"><BriefcaseBusiness size={16} />Post a job for your business<ArrowRight size={14} /></Link>
          <Link href="/tourism"><Compass size={16} />Plan a local day out<ArrowRight size={14} /></Link>
          <Link href="/hospitals"><HeartPulse size={16} />Find care and directions<ArrowRight size={14} /></Link>
        </section>
      </aside>
    </div>

    <Link href="/history" className="home-history-card">
      <span className="home-history-mark"><BookOpen size={22} /></span>
      <span className="home-history-copy"><small>HERITAGE · STORIES · PLACES</small><strong>Discover Thiruppathur’s history</strong><span>Explore the animated timeline, Marudhu legacy and landmarks around town.</span></span>
      <span className="home-history-action">Open history <ArrowRight size={16} /></span>
      <span className="home-history-watermark" aria-hidden="true">TH</span>
    </Link>

    <section className="business-banner"><div><h3>Are you a local business owner?</h3><p>Help neighbours find your shop, service or next job opening.</p></div><Link href="/business">Grow with Namma Ooru <ArrowRight size={15} /></Link></section>
    <footer className="flex flex-col items-center justify-between gap-2 py-2 text-center text-[10px] text-slate-400 sm:flex-row sm:text-left"><span>Made for our town, by our community.</span><span>Services · People · Places</span></footer>
  </div>;
}
