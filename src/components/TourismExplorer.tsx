"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Bookmark, Check, Compass, Heart, LocateFixed, MapPin, Navigation, Search, Sparkles, Trees, X } from "lucide-react";

type Place = {
  _id: string;
  title: string;
  description?: string;
  image?: string;
  place?: string;
  location?: { latitude?: number; longitude?: number };
};
type Coordinates = { latitude: number; longitude: number };
const SAVED_KEY = "namma-ooru:saved-places";
const categories = ["All places", "Heritage", "Nature", "Spiritual", "Family spots"] as const;
type Category = typeof categories[number];

function placeCategory(place: Place): Exclude<Category, "All places"> {
  const text = `${place.title} ${place.description || ""} ${place.place || ""}`.toLowerCase();
  if (/temple|church|mosque|shrine|pilgrim|spiritual|kovil/.test(text)) return "Spiritual";
  if (/dam|falls|waterfall|lake|forest|hill|nature|park|river|wildlife/.test(text)) return "Nature";
  if (/family|children|kids|picnic|playground/.test(text)) return "Family spots";
  return "Heritage";
}

function distanceKm(place: Place, from: Coordinates) {
  const lat = Number(place.location?.latitude);
  const lon = Number(place.location?.longitude);
  if (!Number.isFinite(lat) || !Number.isFinite(lon) || Math.abs(lat) > 90 || Math.abs(lon) > 180) return null;
  const rad = (degrees: number) => degrees * Math.PI / 180;
  const dLat = rad(lat - from.latitude);
  const dLon = rad(lon - from.longitude);
  const arc = Math.sin(dLat / 2) ** 2 + Math.cos(rad(from.latitude)) * Math.cos(rad(lat)) * Math.sin(dLon / 2) ** 2;
  return 6371 * 2 * Math.atan2(Math.sqrt(arc), Math.sqrt(1 - arc));
}

function formatDistance(distance: number) { return distance < .1 ? "<0.1 km" : `${distance.toFixed(1)} km`; }
function directionsUrl(place: Place) {
  const lat = Number(place.location?.latitude);
  const lon = Number(place.location?.longitude);
  return Number.isFinite(lat) && Number.isFinite(lon)
    ? `https://www.google.com/maps/dir/?api=1&destination=${lat},${lon}`
    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${place.title} ${place.place || "South Tamil Nadu"}`)}`;
}

export default function TourismExplorer() {
  const [places, setPlaces] = useState<Place[]>([]);
  const [heroIndex, setHeroIndex] = useState(0);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<Category>("All places");
  const [saved, setSaved] = useState<string[]>([]);
  const [savedOnly, setSavedOnly] = useState(false);
  const [nearby, setNearby] = useState(false);
  const [coordinates, setCoordinates] = useState<Coordinates | null>(null);
  const [locating, setLocating] = useState(false);
  const [locationMessage, setLocationMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    let active = true;
    fetch("/api/tourism", { cache: "no-store", signal: AbortSignal.timeout(9000) })
      .then((response) => { if (!response.ok) throw new Error("Places could not be loaded right now."); return response.json(); })
      .then((data) => { if (active) setPlaces(Array.isArray(data) ? data : []); })
      .catch((reason) => { if (active) setError(reason instanceof Error ? reason.message : "Places could not be loaded right now."); })
      .finally(() => { if (active) setLoading(false); });
    try {
      const value: unknown = JSON.parse(localStorage.getItem(SAVED_KEY) || "[]");
      if (Array.isArray(value)) setSaved(value.filter((id): id is string => typeof id === "string"));
    } catch { /* Saved places are optional. */ }
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (places.length < 2) return;
    const timer = window.setInterval(() => setHeroIndex((index) => (index + 1) % places.length), 5000);
    return () => window.clearInterval(timer);
  }, [places]);

  const visiblePlaces = useMemo(() => {
    const term = query.trim().toLowerCase();
    return places.filter((place) => {
      const matchesText = !term || `${place.title} ${place.description || ""} ${place.place || ""}`.toLowerCase().includes(term);
      return matchesText && (category === "All places" || placeCategory(place) === category) && (!savedOnly || saved.includes(place._id));
    }).sort((a, b) => {
      if (nearby && coordinates) return (distanceKm(a, coordinates) ?? Infinity) - (distanceKm(b, coordinates) ?? Infinity);
      return a.title.localeCompare(b.title);
    });
  }, [category, coordinates, nearby, places, query, saved, savedOnly]);

  function toggleNearby() {
    if (nearby) { setNearby(false); setLocationMessage(""); return; }
    if (!navigator.geolocation) { setLocationMessage("Location is unavailable in this browser."); return; }
    setLocating(true); setLocationMessage("");
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => { setCoordinates({ latitude: coords.latitude, longitude: coords.longitude }); setNearby(true); setLocating(false); setLocationMessage("Nearest places are shown first. Distances are calculated on your device."); },
      (reason) => { setLocating(false); setLocationMessage(reason.code === reason.PERMISSION_DENIED ? "Allow location access to sort places by distance." : "Could not get your location. Try again."); },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 60000 },
    );
  }

  function toggleSaved(id: string) {
    const next = saved.includes(id) ? saved.filter((item) => item !== id) : [...saved, id];
    setSaved(next);
    try { localStorage.setItem(SAVED_KEY, JSON.stringify(next)); } catch { /* Keep saved state for this visit. */ }
  }

  const featured = places.length ? places[heroIndex % places.length] : undefined;
  return <main className="tourism-explorer">
    <motion.section className="tourism-hero" initial={reduceMotion ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reduceMotion ? 0 : .35 }}>
      <AnimatePresence initial={false}>
        {featured?.image && <motion.img key={featured._id} className="tourism-hero-image" src={featured.image} alt="" initial={reduceMotion ? false : { opacity: 0, scale: 1.025 }} animate={{ opacity: 1, scale: 1 }} exit={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: .99 }} transition={{ duration: reduceMotion ? .25 : .8 }} />}
      </AnimatePresence>
      <div className="tourism-hero-shade" />
      <div className="tourism-hero-copy">
        <span className="tourism-eyebrow"><Compass size={14} /> YOUR NEXT LOCAL ESCAPE</span>
        <h1 className="tourism-hero-title" style={{ fontSize: featured?.title ? (featured.title.length > 32 ? "clamp(24px, 3.8vw, 40px)" : featured.title.length > 21 ? "clamp(29px, 4.7vw, 50px)" : "clamp(36px, 6vw, 60px)") : undefined }}>{featured?.title || <>Take the scenic<br />route.</>}</h1>
        <p>Find the heritage, nature and hidden gems around your ooru.</p>
        <a className="tourism-hero-link" href="#discover-places">Explore places <Navigation size={16} /></a>
      </div>
      <span className="tourism-hero-stamp"><Sparkles size={15} /> South Tamil Nadu</span>
    </motion.section>

    <section className="tourism-discovery" id="discover-places">
      <header className="tourism-heading">
        <div><span className="tourism-section-kicker">GO SOMEWHERE GOOD</span><h2>Places to explore</h2><p>Plan a quick outing or a day of discovery.</p></div>
        <span className="tourism-total"><strong>{loading ? "…" : places.length}</strong><small>local places</small></span>
      </header>

      <div className="tourism-toolbar">
        <label className="tourism-search"><Search size={17} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search places or areas" aria-label="Search places or areas" />{query && <button type="button" onClick={() => setQuery("")} aria-label="Clear search"><X size={16} /></button>}</label>
        <button type="button" className={nearby ? "tourism-nearby active" : "tourism-nearby"} onClick={toggleNearby} disabled={locating} aria-pressed={nearby}><LocateFixed size={16} />{locating ? "Finding…" : nearby ? "Nearby on" : "Nearby"}</button>
        <button type="button" className={savedOnly ? "tourism-saved active" : "tourism-saved"} onClick={() => setSavedOnly(!savedOnly)} aria-pressed={savedOnly}><Bookmark size={16} fill={savedOnly ? "currentColor" : "none"} />Saved <span>{saved.length}</span></button>
      </div>
      {locationMessage && <p className="tourism-location-message" role="status">{locationMessage}</p>}

      <div className="tourism-categories" role="group" aria-label="Filter by place type">
        {categories.map((item) => <button type="button" key={item} className={category === item ? "active" : ""} onClick={() => setCategory(item)}>{item === "Nature" ? <Trees size={14} /> : item === "All places" ? <Compass size={14} /> : null}{item}</button>)}
      </div>

      {error && <div className="tourism-error" role="alert">{error}<button type="button" onClick={() => window.location.reload()}>Retry</button></div>}
      {loading ? <div className="tourism-place-grid">{[1, 2, 3].map((item) => <div className="tourism-place-skeleton" key={item} />)}</div> : visiblePlaces.length ? <motion.div className="tourism-place-grid" layout>
        <AnimatePresence initial={false}>
          {visiblePlaces.map((place, index) => {
            const distance = nearby && coordinates ? distanceKm(place, coordinates) : null;
            const isSaved = saved.includes(place._id);
            return <motion.article key={place._id} className="tourism-place-card" layout initial={reduceMotion ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={reduceMotion ? undefined : { opacity: 0, scale: .97 }} transition={{ duration: reduceMotion ? 0 : .22, delay: reduceMotion ? 0 : Math.min(index * .035, .18) }}>
              <div className="tourism-place-image">{place.image ? <img src={place.image} alt={place.title} loading="lazy" /> : <div className="tourism-image-placeholder"><Trees size={30} /><span>Discover South Tamil Nadu</span></div>}<span className="tourism-place-kind">{placeCategory(place)}</span>{nearby && coordinates && <span className="tourism-distance">{distance === null ? "No map pin" : formatDistance(distance)}</span>}<button type="button" className={isSaved ? "tourism-save saved" : "tourism-save"} aria-label={isSaved ? `Remove ${place.title} from saved places` : `Save ${place.title}`} onClick={() => toggleSaved(place._id)}><Heart size={18} fill={isSaved ? "currentColor" : "none"} /></button></div>
              <div className="tourism-place-content"><div className="tourism-place-title"><h3>{place.title}</h3>{isSaved && <Check size={15} />}</div><p className="tourism-place-location"><MapPin size={14} />{place.place || "South Tamil Nadu"}</p><p className="tourism-place-description">{place.description || "A local place to discover and enjoy."}</p><a className="tourism-directions" href={directionsUrl(place)} target="_blank" rel="noreferrer"><Navigation size={15} />Get directions</a></div>
            </motion.article>;
          })}
        </AnimatePresence>
      </motion.div> : <div className="tourism-empty"><span><Compass size={22} /></span><strong>{savedOnly ? "No saved places yet" : query || category !== "All places" ? "No places match this search" : "Your next destination is on its way"}</strong><p>{savedOnly ? "Tap the heart on a place to keep it here." : "Try another category or search for a nearby area."}</p>{(savedOnly || query || category !== "All places") && <button type="button" onClick={() => { setSavedOnly(false); setQuery(""); setCategory("All places"); }}>Show all places</button>}</div>}
      <footer className="tourism-local-note"><span><Sparkles size={16} /></span><p>Know a place people should visit? Local gems grow when the community shares them.</p></footer>
    </section>
  </main>;
}
