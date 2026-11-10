"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight, Heart, LocateFixed, MapPin, Phone, Search, Store, Truck, Wrench, ShoppingCart, Landmark, Hotel, Utensils, Stethoscope, Sparkles } from "lucide-react";

type Shop = {
  _id: string;
  name: string;
  category: string;
  address: string;
  phone: string;
  photo?: string;
  location?: { latitude?: number; longitude?: number };
  createdAt?: string;
};

const FAVORITES_KEY = "namma-ooru:saved-shops";
const categoryIcons: Record<string, typeof Store> = {
  "ac mechanics": Wrench,
  "super market": ShoppingCart,
  courier: Truck,
  atm: Landmark,
  hotels: Hotel,
  restaurant: Utensils,
  restaurants: Utensils,
  pharmacy: Stethoscope,
  salon: Sparkles,
};
const categoryColors: Record<string, string> = {
  "ac mechanics": "mint",
  "super market": "sage",
  courier: "blue",
  atm: "lilac",
  hotels: "sand",
  restaurant: "peach",
  restaurants: "peach",
  pharmacy: "rose",
  salon: "lilac",
};
const starterCategories = ["AC Mechanics", "Super Market", "Courier", "ATM", "Hotels"];
const categoryDescriptions: Record<string, string> = {
  "ac mechanics": "Repairs & cooling",
  "super market": "Groceries & daily needs",
  courier: "Parcel pickup & delivery",
  atm: "Cash & banking nearby",
  hotels: "Stay & accommodation",
  restaurant: "Meals & local food",
  restaurants: "Meals & local food",
  pharmacy: "Medicines & health needs",
  salon: "Hair & personal care",
};

function slugify(value: string) {
  return value.toLowerCase().trim().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function titleCase(value: string) {
  return value.replace(/-/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase()).replace(/\bAc\b/g, "AC").replace(/\bAtm\b/g, "ATM");
}

function mapsUrl(shop: Shop) {
  const latitude = Number(shop.location?.latitude);
  const longitude = Number(shop.location?.longitude);
  if (Number.isFinite(latitude) && Number.isFinite(longitude)) return `https://www.google.com/maps?q=${latitude},${longitude}`;
  return `https://www.google.com/maps?q=${encodeURIComponent(shop.address || shop.name)}`;
}

type Coordinates = { latitude: number; longitude: number };

function distanceKm(shop: Shop, from: Coordinates) {
  const latitude = Number(shop.location?.latitude);
  const longitude = Number(shop.location?.longitude);
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude) || Math.abs(latitude) > 90 || Math.abs(longitude) > 180) return null;
  const radians = (degrees: number) => degrees * Math.PI / 180;
  const latitudeDelta = radians(latitude - from.latitude);
  const longitudeDelta = radians(longitude - from.longitude);
  const arc = Math.sin(latitudeDelta / 2) ** 2 + Math.cos(radians(from.latitude)) * Math.cos(radians(latitude)) * Math.sin(longitudeDelta / 2) ** 2;
  return 6371 * 2 * Math.atan2(Math.sqrt(arc), Math.sqrt(1 - arc));
}

function formatDistance(distance: number) {
  return distance < 0.1 ? "<0.1 km" : `${distance.toFixed(1)} km`;
}

export default function ShopBrowser({ categorySlug }: { categorySlug?: string }) {
  const [shops, setShops] = useState<Shop[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [showSaved, setShowSaved] = useState(false);
  const [nearby, setNearby] = useState(false);
  const [userCoordinates, setUserCoordinates] = useState<Coordinates | null>(null);
  const [locating, setLocating] = useState(false);
  const [locationMessage, setLocationMessage] = useState("");
  const [availableOnly, setAvailableOnly] = useState(false);
  const [sort, setSort] = useState<"recent" | "az">("recent");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    let active = true;
    fetch("/api/shops", { cache: "no-store", signal: AbortSignal.timeout(9000) })
      .then((response) => {
        if (!response.ok) throw new Error("Shops could not be loaded right now.");
        return response.json();
      })
      .then((data) => { if (active) setShops(Array.isArray(data) ? data : []); })
      .catch((reason) => { if (active) setError(reason instanceof Error ? reason.message : "Shops could not be loaded right now."); })
      .finally(() => { if (active) setLoading(false); });
    try {
      const saved: unknown = JSON.parse(localStorage.getItem(FAVORITES_KEY) || "[]");
      if (Array.isArray(saved)) setFavorites(saved.filter((id): id is string => typeof id === "string"));
    } catch { /* Saved shops are optional. */ }
    return () => { active = false; };
  }, []);

  const categoryName = categorySlug ? titleCase(categorySlug) : "";
  const categoryRecords = useMemo(() => {
    const found = shops.map((shop) => shop.category?.trim()).filter((name): name is string => Boolean(name));
    const bySlug = new Map<string, string>();
    [...starterCategories, ...found].forEach((name) => { if (!bySlug.has(slugify(name))) bySlug.set(slugify(name), name); });
    return [...bySlug.values()]
      .map((name) => {
        const matches = shops.filter((shop) => slugify(shop.category || "") === slugify(name));
        return {
          name,
          slug: slugify(name),
          count: matches.length,
          description: categoryDescriptions[name.toLowerCase()] || "Local shops and services",
          example: matches[0]?.name || "",
        };
      })
      .sort((a, b) => {
        const aIndex = starterCategories.indexOf(a.name);
        const bIndex = starterCategories.indexOf(b.name);
        if (aIndex >= 0 && bIndex >= 0) return aIndex - bIndex;
        if (aIndex >= 0) return -1;
        if (bIndex >= 0) return 1;
        return a.name.localeCompare(b.name);
      });
  }, [shops]);

  const visibleCategories = categoryRecords.filter((category) => {
    const term = search.trim().toLowerCase();
    const matchesSearch = !term || `${category.name} ${category.description} ${category.example}`.toLowerCase().includes(term);
    return matchesSearch && (!availableOnly || category.count > 0);
  });

  const visibleShops = useMemo(() => {
    const searchTerm = search.trim().toLowerCase();
    const categoryKey = categorySlug ? slugify(categorySlug) : "";
    const filtered = shops.filter((shop) => {
      const categoryMatches = !categoryKey || slugify(shop.category || "") === categoryKey;
      const searchMatches = !searchTerm || `${shop.name} ${shop.category} ${shop.address}`.toLowerCase().includes(searchTerm);
      const savedMatches = !showSaved || favorites.includes(shop._id);
      return categoryMatches && searchMatches && savedMatches;
    });
    return filtered.sort((a, b) => {
      if (nearby && userCoordinates) {
        const distanceDifference = (distanceKm(a, userCoordinates) ?? Number.POSITIVE_INFINITY) - (distanceKm(b, userCoordinates) ?? Number.POSITIVE_INFINITY);
        return distanceDifference || new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
      }
      return sort === "az"
        ? a.name.localeCompare(b.name)
        : new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
    });
  }, [categorySlug, favorites, nearby, search, shops, showSaved, sort, userCoordinates]);

  function toggleNearby() {
    if (nearby) { setNearby(false); setLocationMessage(""); return; }
    if (!navigator.geolocation) { setLocationMessage("Location is not available in this browser."); return; }
    setLocating(true);
    setLocationMessage("");
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => { setUserCoordinates({ latitude: coords.latitude, longitude: coords.longitude }); setNearby(true); setLocating(false); setLocationMessage("Sorted nearest first · calculated on this device."); },
      (error) => {
        setLocating(false);
        setLocationMessage(error.code === error.PERMISSION_DENIED ? "Allow location access to sort by distance." : "Could not get your location. Try again.");
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 60_000 },
    );
  }

  function toggleFavorite(id: string) {
    const next = favorites.includes(id) ? favorites.filter((saved) => saved !== id) : [...favorites, id];
    setFavorites(next);
    try { localStorage.setItem(FAVORITES_KEY, JSON.stringify(next)); } catch { /* Keep saved state for this visit. */ }
  }

  return <div className="shop-browser">
    <div className="shop-page-heading">
      <div>
        {categorySlug && <Link href="/shops" className="shop-back-link"><ArrowLeft size={14} /> All shops & services</Link>}
        <span className="shop-eyebrow">LOCAL DIRECTORY · THIRUPPATHUR</span>
        <h1>{categorySlug ? categoryName : "Shops & services"}</h1>
        <p>{categorySlug ? `Find ${categoryName.toLowerCase()} around town.` : "Find the people and places that make your town work."}</p>
      </div>
      <div className="shop-count"><Store size={16} /><strong>{loading ? "…" : visibleShops.length}</strong><span>{categorySlug ? "in this category" : "local listings"}</span></div>
    </div>

    <div className="shop-tools">
      <label className="shop-search"><Search size={17} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder={categorySlug ? `Search ${categoryName.toLowerCase()}…` : "Search shops, services or locations"} aria-label="Search local shops and services" />{search && <button type="button" onClick={() => setSearch("")} aria-label="Clear search">×</button>}</label>
      <button type="button" className={showSaved ? "shop-saved-toggle active" : "shop-saved-toggle"} aria-pressed={showSaved} onClick={() => setShowSaved(!showSaved)}><Heart size={16} fill={showSaved ? "currentColor" : "none"} /> Saved <span>{favorites.length}</span></button>
      <button type="button" className={nearby ? "shop-nearby-toggle active" : "shop-nearby-toggle"} aria-pressed={nearby} onClick={toggleNearby} disabled={locating}><LocateFixed size={15} />{locating ? "Finding…" : nearby ? "Nearby on" : "Nearby"}</button>
      <button type="button" className="shop-sort-toggle" onClick={() => setSort(sort === "recent" ? "az" : "recent")} title="Change sort order">{sort === "recent" ? "Recently added" : "Name A–Z"}</button>
    </div>
    {locationMessage && <p className="shop-location-message" role="status">{locationMessage}</p>}

    {!categorySlug && <section className="shop-category-section" aria-label="Browse by category">
      <div className="shop-section-title"><div><span className="shop-eyebrow">BROWSE BY NEED</span><h2>Services around you</h2></div><button type="button" className={availableOnly ? "shop-available-toggle active" : "shop-available-toggle"} aria-pressed={availableOnly} onClick={() => setAvailableOnly(!availableOnly)}>{availableOnly ? "Showing listed" : "Only show listed"}</button></div>
      <div className="shop-category-grid">{visibleCategories.map(({ name, slug, count, description, example }) => {
        const Icon = categoryIcons[name.toLowerCase()] || Store;
        return <Link key={slug} href={`/shops/${slug}`} className="shop-category-card">
          <span className="shop-category-card-head"><span className={`shop-category-icon ${categoryColors[name.toLowerCase()] || "sage"}`}><Icon size={20} /></span><span className="shop-category-count">{count} {count === 1 ? "listing" : "listings"}</span></span>
          <span className="shop-category-copy"><strong>{name}</strong><small>{description}</small></span>
          {example && <span className="shop-category-example"><span>Example</span><strong>{example}</strong></span>}
          <span className="shop-category-browse">Browse category <ArrowRight size={14} /></span>
        </Link>;
      })}{visibleCategories.length === 0 && <div className="shop-category-empty">No service categories match this search.</div>}</div>
    </section>}

    <section className="shop-listing-section" aria-label="Shop listings">
      <div className="shop-section-title"><div><span className="shop-eyebrow">NEARBY FINDS</span><h2>{categorySlug ? `${categoryName} listings` : "Local listings"}</h2></div><span>{visibleShops.length} found</span></div>
      {error && <div className="shop-error" role="alert">{error} <button onClick={() => window.location.reload()}>Retry</button></div>}
      {loading ? <div className="shop-listing-grid" aria-label="Loading shops">{[1, 2, 3].map((item) => <div className="shop-skeleton" key={item} />)}</div> : visibleShops.length ? <motion.div className="shop-listing-grid" layout>
        <AnimatePresence initial={false}>
          {visibleShops.map((shop) => {
            const saved = favorites.includes(shop._id);
            const distance = nearby && userCoordinates ? distanceKm(shop, userCoordinates) : null;
            return <motion.article key={shop._id} layout className="shop-listing-card" initial={reduceMotion ? false : { opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={reduceMotion ? undefined : { opacity: 0, scale: .97 }} transition={{ duration: reduceMotion ? 0 : .22 }}>
              <div className="shop-listing-photo"><img src={shop.photo || "/images/shop.jpg"} alt={shop.name} loading="lazy" /><span className="shop-listing-category">{shop.category || "Local business"}</span>{nearby && userCoordinates && <span className="shop-distance-tag">{distance === null ? "No map pin" : formatDistance(distance)}</span>}<button type="button" className={saved ? "shop-heart saved" : "shop-heart"} aria-label={saved ? `Remove ${shop.name} from saved shops` : `Save ${shop.name}`} onClick={() => toggleFavorite(shop._id)}><Heart size={17} fill={saved ? "currentColor" : "none"} /></button></div>
              <div className="shop-listing-body"><h3>{shop.name}</h3><p className="shop-listing-address"><MapPin size={14} />{shop.address || "Address available on request"}</p><div className="shop-listing-actions"><a href={`tel:${shop.phone}`} className="shop-call-action"><Phone size={15} />Call</a><a href={mapsUrl(shop)} target="_blank" rel="noreferrer" className="shop-map-action"><MapPin size={15} />Directions</a></div></div>
            </motion.article>;
          })}
        </AnimatePresence>
      </motion.div> : <div className="shop-empty"><span className="shop-empty-icon"><Store size={22} /></span><strong>{showSaved ? "No saved shops yet" : search ? "No matches found" : categorySlug ? "No listings in this category yet" : "No shop listings yet"}</strong><p>{showSaved ? "Tap the heart on a shop to keep it here." : search ? "Try a different shop name, category or area." : "Local shops and services will show up here when added."}</p>{(search || showSaved) && <button type="button" onClick={() => { setSearch(""); setShowSaved(false); }}>Show all listings</button>}</div>}
    </section>
  </div>;
}
