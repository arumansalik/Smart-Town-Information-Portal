"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { BusFront, Clock3, RefreshCw, Search, Star } from "lucide-react";

type BusRecord = { _id: string; route: string; time: string; busName: string; type: "Government" | "Private" };
type Filter = "all" | "upcoming" | "government" | "private" | "saved";
const STORAGE_KEY = "namma-ooru:favourite-bus-routes";

function parseTime(value: string) {
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

function untilDeparture(bus: BusRecord, now: Date) {
  const minutes = parseTime(bus.time);
  return minutes === null ? null : minutes - (now.getHours() * 60 + now.getMinutes());
}

function departureText(minutes: number | null) {
  if (minutes === null) return "Time unavailable";
  if (minutes < 0) return "Passed";
  if (minutes === 0) return "Now";
  if (minutes < 60) return `In ${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return rest ? `In ${hours}h ${rest}m` : `In ${hours}h`;
}

export default function BusPage() {
  const [buses, setBuses] = useState<BusRecord[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [now, setNow] = useState<Date | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const reduceMotion = useReducedMotion();

  const refresh = useCallback(async (quiet = false) => {
    if (quiet) setRefreshing(true);
    else setLoading(true);
    try {
      const response = await fetch("/api/buses", { cache: "no-store", signal: AbortSignal.timeout(9000) });
      if (!response.ok) throw new Error("Could not load bus times.");
      const data = await response.json();
      setBuses(Array.isArray(data) ? data : []);
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load bus times.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    setNow(new Date());
    try {
      const stored: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      if (Array.isArray(stored)) setFavorites(stored.filter((id): id is string => typeof id === "string"));
    } catch { /* Saved routes are optional. */ }
    void refresh();
    const timer = window.setInterval(() => { setNow(new Date()); void refresh(true); }, 60_000);
    return () => window.clearInterval(timer);
  }, [refresh]);

  const currentTime = now || new Date(0);
  const visibleBuses = useMemo(() => {
    const query = search.trim().toLowerCase();
    return buses.filter((bus) => {
      const matchesSearch = !query || `${bus.route} ${bus.busName} ${bus.time} ${bus.type}`.toLowerCase().includes(query);
      const diff = untilDeparture(bus, currentTime);
      const matchesFilter = filter === "all" ||
        (filter === "upcoming" && diff !== null && diff >= 0) ||
        (filter === "government" && bus.type === "Government") ||
        (filter === "private" && bus.type === "Private") ||
        (filter === "saved" && favorites.includes(bus._id));
      return matchesSearch && matchesFilter;
    }).sort((a, b) => {
      const aDiff = untilDeparture(a, currentTime);
      const bDiff = untilDeparture(b, currentTime);
      if (aDiff === null && bDiff !== null) return 1;
      if (bDiff === null && aDiff !== null) return -1;
      if (aDiff === null || bDiff === null) return a.route.localeCompare(b.route);
      if ((aDiff >= 0) !== (bDiff >= 0)) return aDiff >= 0 ? -1 : 1;
      return aDiff >= 0 ? aDiff - bDiff : bDiff - aDiff;
    });
  }, [buses, currentTime, favorites, filter, search]);
  const departurePool = buses.filter((bus) => {
    const query = search.trim().toLowerCase();
    const matchesSearch = !query || `${bus.route} ${bus.busName} ${bus.time} ${bus.type}`.toLowerCase().includes(query);
    const matchesSelection = filter === "all" || filter === "upcoming" ||
      (filter === "government" && bus.type === "Government") ||
      (filter === "private" && bus.type === "Private") ||
      (filter === "saved" && favorites.includes(bus._id));
    return matchesSearch && matchesSelection;
  });
  const nextBusId = visibleBuses.find((bus) => {
    const diff = untilDeparture(bus, currentTime);
    return diff !== null && diff >= 0;
  })?._id;
  const todaysDepartures = departurePool
    .filter((bus) => {
      const diff = untilDeparture(bus, currentTime);
      return diff !== null && diff >= 0;
    })
    .slice(0, 3);
  const nextDayDepartures = departurePool
    .filter((bus) => untilDeparture(bus, currentTime) !== null && (untilDeparture(bus, currentTime) as number) < 0)
    .sort((a, b) => (parseTime(a.time) ?? Infinity) - (parseTime(b.time) ?? Infinity))
    .slice(0, 3);
  const nextDepartures = todaysDepartures.length ? todaysDepartures : nextDayDepartures;
  const displayBuses = filter === "upcoming" && visibleBuses.length === 0 ? nextDepartures : visibleBuses;
  const displayNextBusId = nextBusId || (filter === "upcoming" ? nextDepartures[0]?._id : undefined);

  function toggleFavorite(id: string) {
    const next = favorites.includes(id) ? favorites.filter((saved) => saved !== id) : [...favorites, id];
    setFavorites(next);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch { /* Keep the change for this visit. */ }
  }

  const filters: { key: Filter; label: string }[] = [
    { key: "all", label: "All" }, { key: "upcoming", label: "Upcoming" },
    { key: "government", label: "Government" }, { key: "private", label: "Private" },
    { key: "saved", label: `Saved · ${favorites.length}` },
  ];

  return <div className="bus-page bus-page-simple">
    <div className="bus-simple-heading">
      <div><span className="bus-section-kicker">LOCAL ROUTES</span><h1>Bus timings</h1></div>
      <button type="button" className="bus-refresh" onClick={() => void refresh(true)} disabled={refreshing} aria-label="Refresh bus times"><RefreshCw size={16} className={refreshing ? "spin" : ""} /></button>
    </div>

    <label className="bus-search bus-search-light"><Search size={17} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search route, bus or time" aria-label="Search bus routes" />{search && <button type="button" onClick={() => setSearch("")} aria-label="Clear search">×</button>}</label>

    <div className="bus-filter-row bus-filter-simple" aria-label="Filter bus times">
      {filters.map(({ key, label }) => <button type="button" key={key} aria-pressed={filter === key} onClick={() => setFilter(key)} className={`bus-filter-chip ${filter === key ? "selected" : ""}`}>{label}</button>)}
    </div>

    {!loading && nextDepartures.length > 0 && <section className="bus-next-board" aria-label="Next bus departures">
      <div className="bus-next-board-heading"><div><span className="bus-section-kicker">BASED ON CURRENT TIME</span><h2>Next departures</h2></div><span className="bus-current-time">{currentTime.toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit" })}</span></div>
      <div className="bus-next-board-grid">{nextDepartures.map((bus, index) => {
        const diff = untilDeparture(bus, currentTime);
        const tomorrow = diff !== null && diff < 0;
        return <article className={index === 0 ? "bus-next-board-card featured" : "bus-next-board-card"} key={bus._id}>
          <div className="bus-next-board-time"><Clock3 size={15} /><strong>{bus.time || "—"}</strong><span>{tomorrow ? "Tomorrow · " : ""}{departureText(tomorrow && diff !== null ? diff + 1440 : diff)}</span></div>
          <div className="bus-next-board-route"><strong>{bus.route || "Route details unavailable"}</strong><span>{bus.busName || "Local bus"} · {bus.type || "Bus"}</span></div>
          {index === 0 && <span className="bus-next-board-badge">NEXT</span>}
        </article>;
      })}</div>
    </section>}

    {error && <div role="alert" className="bus-error"><span>{error}</span><button type="button" onClick={() => void refresh()}>Retry</button></div>}

    {loading && buses.length === 0 ? <div className="bus-simple-grid" aria-label="Loading bus times"><span className="bus-simple-skeleton" /><span className="bus-simple-skeleton" /><span className="bus-simple-skeleton" /></div> : displayBuses.length ? <motion.div className="bus-simple-grid" layout>
      <AnimatePresence initial={false}>
        {displayBuses.map((bus) => {
          const diff = untilDeparture(bus, currentTime);
          const tomorrow = filter === "upcoming" && todaysDepartures.length === 0 && diff !== null && diff < 0;
          const upcoming = (diff !== null && diff >= 0) || tomorrow;
          const saved = favorites.includes(bus._id);
          return <motion.article key={bus._id} layout className="bus-simple-card" initial={reduceMotion ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={reduceMotion ? undefined : { opacity: 0, y: -6 }} transition={{ duration: reduceMotion ? 0 : .22 }}>
            <div className="bus-card-top"><span className="bus-card-time">{bus.time || "—"}</span><button type="button" className={saved ? "bus-save saved" : "bus-save"} onClick={() => toggleFavorite(bus._id)} aria-label={saved ? "Remove saved route" : "Save route"}><Star size={17} fill={saved ? "currentColor" : "none"} /></button></div>
            <h2>{bus.route || "Route details unavailable"}</h2>
            <div className="bus-card-bottom"><span className="bus-card-name"><BusFront size={15} />{bus.busName || "Local bus"}</span><span className={bus.type === "Government" ? "bus-card-type govt" : "bus-card-type private"}>{bus.type || "Bus"}</span></div>
            <div className={upcoming ? "bus-card-status upcoming" : "bus-card-status"}><Clock3 size={13} />{tomorrow ? `Tomorrow · ${departureText((diff || 0) + 1440)}` : departureText(diff)}{bus._id === displayNextBusId && <span className="bus-next-tag">NEXT</span>}</div>
          </motion.article>;
        })}
      </AnimatePresence>
    </motion.div> : <div className="bus-simple-empty"><BusFront size={24} /><strong>{buses.length ? "No matching buses" : "No bus times available yet"}</strong>{buses.length > 0 && <button type="button" onClick={() => { setSearch(""); setFilter("all"); }}>Clear filters</button>}</div>}
  </div>;
}
