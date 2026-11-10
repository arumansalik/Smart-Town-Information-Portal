"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Ambulance, ArrowRight, HeartPulse, MapPin, Phone, Search } from "lucide-react";

type HospitalRecord = {
  _id: string;
  name: string;
  type: string;
  photo?: string;
  address: string;
  phone: string;
  emergency?: boolean;
  description?: string;
  location?: { latitude?: number; longitude?: number };
};

function directionsUrl(hospital: HospitalRecord) {
  const latitude = Number(hospital.location?.latitude);
  const longitude = Number(hospital.location?.longitude);
  if (Number.isFinite(latitude) && Number.isFinite(longitude)) return `https://www.google.com/maps?q=${latitude},${longitude}`;
  return `https://www.google.com/maps?q=${encodeURIComponent(hospital.address || hospital.name)}`;
}

export default function HospitalsBoard() {
  const [hospitals, setHospitals] = useState<HospitalRecord[]>([]);
  const [search, setSearch] = useState("");
  const [emergencyOnly, setEmergencyOnly] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    let active = true;
    fetch("/api/hospitals", { cache: "no-store", signal: AbortSignal.timeout(9000) })
      .then((response) => {
        if (!response.ok) throw new Error("Hospital listings could not be loaded.");
        return response.json();
      })
      .then((data) => { if (active) setHospitals(Array.isArray(data) ? data : []); })
      .catch((reason) => { if (active) setError(reason instanceof Error ? reason.message : "Hospital listings could not be loaded."); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  const visibleHospitals = useMemo(() => {
    const term = search.trim().toLowerCase();
    return hospitals.filter((hospital) => {
      const matchesSearch = !term || `${hospital.name} ${hospital.type} ${hospital.address}`.toLowerCase().includes(term);
      return matchesSearch && (!emergencyOnly || hospital.emergency);
    }).sort((a, b) => Number(Boolean(b.emergency)) - Number(Boolean(a.emergency)) || a.name.localeCompare(b.name));
  }, [emergencyOnly, hospitals, search]);

  return <div className="hospitals-page">
    <section className="hospital-emergency-banner" aria-label="Emergency ambulance service">
      <div className="hospital-banner-copy"><span className="hospital-live-label"><span /> EMERGENCY SUPPORT</span><h1>Care close to home.</h1><a href="tel:108" className="hospital-call-108"><Phone size={16} /> Call ambulance · 108</a></div>
      <div className="ambulance-scene" aria-hidden="true"><span className="ambulance-track-line" /><span className="ambulance-stop stop-start" /><span className="ambulance-stop stop-end" /><span className="ambulance-vehicle" style={{ animationPlayState: reduceMotion ? "paused" : "running" }}><Ambulance size={37} strokeWidth={1.8} /></span></div>
    </section>

    <section className="hospital-directory">
      <div className="hospital-heading-row"><div><span className="hospital-eyebrow">THIRUPPATHUR · LOCAL CARE</span><h2>Hospitals</h2></div><span className="hospital-count">{loading ? "…" : visibleHospitals.length}</span></div>
      <div className="hospital-tools">
        <label className="hospital-search"><Search size={17} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search hospital or area" aria-label="Search hospitals or area" />{search && <button type="button" onClick={() => setSearch("")} aria-label="Clear search">×</button>}</label>
        <button type="button" aria-pressed={emergencyOnly} className={emergencyOnly ? "hospital-filter active" : "hospital-filter"} onClick={() => setEmergencyOnly(!emergencyOnly)}><HeartPulse size={15} />Emergency</button>
      </div>

      {error && <div className="hospital-error" role="alert">{error}<button type="button" onClick={() => window.location.reload()}>Retry</button></div>}
      {loading ? <div className="hospital-grid">{[1, 2, 3].map((item) => <div className="hospital-skeleton" key={item} />)}</div> : visibleHospitals.length ? <motion.div className="hospital-grid" layout>
        <AnimatePresence initial={false}>
          {visibleHospitals.map((hospital) => <motion.article key={hospital._id} layout className="hospital-card" initial={reduceMotion ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={reduceMotion ? undefined : { opacity: 0, scale: .98 }} transition={{ duration: reduceMotion ? 0 : .2 }}>
            <div className="hospital-card-image"><img src={hospital.photo || "/images/hospital.jpg"} alt={hospital.name} loading="lazy" />{hospital.emergency && <span className="hospital-emergency-tag"><HeartPulse size={12} /> Emergency care</span>}</div>
            <div className="hospital-card-body"><div className="hospital-card-title"><div><h3>{hospital.name}</h3><span>{hospital.type}</span></div></div>
              {hospital.description && <p className="hospital-description">{hospital.description}</p>}
              <p className="hospital-address"><MapPin size={14} />{hospital.address}</p>
              <div className="hospital-actions"><a href={`tel:${hospital.phone}`} className="hospital-call-button"><Phone size={15} />Call</a><a href={directionsUrl(hospital)} target="_blank" rel="noreferrer" className="hospital-directions-button">Directions <ArrowRight size={14} /></a></div>
            </div>
          </motion.article>)}
        </AnimatePresence>
      </motion.div> : <div className="hospital-empty"><HeartPulse size={23} /><strong>{hospitals.length ? "No hospitals match" : "No hospital listings yet"}</strong>{hospitals.length > 0 && <button type="button" onClick={() => { setSearch(""); setEmergencyOnly(false); }}>Clear filters</button>}</div>}
    </section>
  </div>;
}
