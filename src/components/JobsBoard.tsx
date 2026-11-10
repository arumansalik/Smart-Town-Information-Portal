"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, BriefcaseBusiness, Building2, CalendarDays, ChevronDown, Clock3, MapPin, Search, SlidersHorizontal, Star, Wallet } from "lucide-react";

type Job = {
  _id: string;
  role: string;
  companyName?: string;
  company?: string;
  description?: string;
  address?: string;
  salary?: string;
  jobType?: "Full-Time" | "Part-Time";
  applyLink?: string;
  createdAt?: string;
};
type JobTypeFilter = "All jobs" | "Full-Time" | "Part-Time" | "Saved";
const SAVED_JOBS_KEY = "namma-ooru:saved-jobs";

function safeApplyUrl(value?: string) {
  const link = value?.trim();
  if (!link) return "";
  if (/^(https?:|mailto:|tel:)/i.test(link)) return link;
  if (/^www\./i.test(link)) return `https://${link}`;
  return "";
}

function postedLabel(createdAt?: string) {
  if (!createdAt) return "Recently posted";
  const days = Math.floor((Date.now() - new Date(createdAt).getTime()) / 86_400_000);
  if (!Number.isFinite(days) || days < 1) return "Posted today";
  if (days === 1) return "Posted yesterday";
  if (days < 7) return `Posted ${days} days ago`;
  return new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short" }).format(new Date(createdAt));
}

function companyInitial(company: string) {
  return company.trim().split(/\s+/).slice(0, 2).map((part) => part[0]?.toUpperCase() || "").join("");
}

export default function JobsBoard() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [keywords, setKeywords] = useState("");
  const [location, setLocation] = useState("");
  const [typeFilter, setTypeFilter] = useState<JobTypeFilter>("All jobs");
  const [sort, setSort] = useState<"newest" | "salary">("newest");
  const [expandedId, setExpandedId] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const reduceMotion = useReducedMotion();

  async function loadJobs() {
    setLoading(true);
    try {
      const response = await fetch("/api/jobs?status=approved", { cache: "no-store", signal: AbortSignal.timeout(9000) });
      if (!response.ok) throw new Error("Job listings could not be loaded.");
      const data = await response.json();
      setJobs(Array.isArray(data) ? data : []);
      setError("");
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Job listings could not be loaded.");
    } finally { setLoading(false); }
  }

  useEffect(() => {
    void loadJobs();
    try {
      const stored: unknown = JSON.parse(localStorage.getItem(SAVED_JOBS_KEY) || "[]");
      if (Array.isArray(stored)) setSavedIds(stored.filter((id): id is string => typeof id === "string"));
    } catch { /* Saved jobs are optional. */ }
  }, []);

  const visibleJobs = useMemo(() => {
    const term = keywords.trim().toLowerCase();
    const area = location.trim().toLowerCase();
    const filtered = jobs.filter((job) => {
      const textMatch = !term || `${job.role} ${job.companyName || job.company || ""} ${job.description || ""}`.toLowerCase().includes(term);
      const locationMatch = !area || (job.address || "").toLowerCase().includes(area);
      const typeMatch = typeFilter === "All jobs" || (typeFilter === "Saved" ? savedIds.includes(job._id) : job.jobType === typeFilter);
      return textMatch && locationMatch && typeMatch;
    });
    return filtered.sort((a, b) => {
      if (sort === "salary") {
        const salaryA = Number((a.salary || "").replace(/[^\d.]/g, "")) || 0;
        const salaryB = Number((b.salary || "").replace(/[^\d.]/g, "")) || 0;
        return salaryB - salaryA;
      }
      return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
    });
  }, [jobs, keywords, location, savedIds, sort, typeFilter]);

  function toggleSaved(id: string) {
    const next = savedIds.includes(id) ? savedIds.filter((saved) => saved !== id) : [...savedIds, id];
    setSavedIds(next);
    try { localStorage.setItem(SAVED_JOBS_KEY, JSON.stringify(next)); } catch { /* Keep saved state for this visit. */ }
  }

  function clearFilters() {
    setKeywords("");
    setLocation("");
    setTypeFilter("All jobs");
  }

  const filters: JobTypeFilter[] = ["All jobs", "Full-Time", "Part-Time", "Saved"];
  return <div className="jobs-board">
    <section className="jobs-heading">
      <div><h1>Jobs near you</h1></div>
      <Link href="/post-job" className="jobs-post-link"><BriefcaseBusiness size={16} /> Post a job <ArrowRight size={15} /></Link>
    </section>

    <section className="jobs-search-panel" aria-label="Search jobs">
      <label className="jobs-search-field"><Search size={18} /><input value={keywords} onChange={(event) => setKeywords(event.target.value)} placeholder="Job title or company" aria-label="Job title or company" /></label>
      <span className="jobs-search-divider" />
      <label className="jobs-search-field"><MapPin size={18} /><input value={location} onChange={(event) => setLocation(event.target.value)} placeholder="Town or area" aria-label="Town or area" /></label>
      <button type="button" className="jobs-search-button" onClick={() => document.getElementById("job-results")?.scrollIntoView({ behavior: "smooth", block: "start" })}>Search</button>
    </section>

    <div className="jobs-layout" id="job-results">
      <main className="jobs-results">
        <div className="jobs-results-heading"><div><h2>Job listings</h2><span>{visibleJobs.length} {visibleJobs.length === 1 ? "result" : "results"}</span></div><label className="jobs-sort"><SlidersHorizontal size={14} /><select aria-label="Sort jobs" value={sort} onChange={(event) => setSort(event.target.value as "newest" | "salary")}><option value="newest">Newest first</option><option value="salary">Salary: high to low</option></select><ChevronDown size={13} /></label></div>

        <div className="jobs-filter-row" aria-label="Filter jobs">
          {filters.map((filter) => <button key={filter} type="button" aria-pressed={typeFilter === filter} onClick={() => setTypeFilter(filter)} className={typeFilter === filter ? "jobs-filter active" : "jobs-filter"}>{filter}{filter === "Saved" && savedIds.length > 0 ? ` · ${savedIds.length}` : ""}</button>)}
          {(keywords || location || typeFilter !== "All jobs") && <button type="button" className="jobs-clear-filter" onClick={clearFilters}>Clear filters</button>}
        </div>

        {error && <div className="jobs-error" role="alert">{error}<button type="button" onClick={() => void loadJobs()}>Try again</button></div>}
        {loading ? <div className="jobs-list">{[1, 2, 3].map((item) => <div className="job-skeleton" key={item} />)}</div> : visibleJobs.length ? <motion.div className="jobs-list" layout>
          <AnimatePresence initial={false}>
            {visibleJobs.map((job) => {
              const company = job.companyName || job.company || "Local employer";
              const saved = savedIds.includes(job._id);
              const expanded = expandedId === job._id;
              const applyUrl = safeApplyUrl(job.applyLink);
              return <motion.article key={job._id} layout className="job-result-card" initial={reduceMotion ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={reduceMotion ? undefined : { opacity: 0, y: -5 }} transition={{ duration: reduceMotion ? 0 : .2 }}>
                <div className="job-card-top">
                  <span className="job-company-mark">{companyInitial(company) || <Building2 size={18} />}</span>
                  <div className="job-card-title"><h3>{job.role}</h3><span>{company}</span></div>
                  <button type="button" className={saved ? "job-save saved" : "job-save"} onClick={() => toggleSaved(job._id)} aria-label={saved ? `Remove ${job.role} from saved jobs` : `Save ${job.role}`}><Star size={18} fill={saved ? "currentColor" : "none"} /></button>
                </div>
                <div className="job-meta-row"><span><MapPin size={14} />{job.address || "Location not listed"}</span><span><Wallet size={14} />{job.salary ? `₹ ${job.salary}` : "Salary not listed"}</span><span><Clock3 size={14} />{job.jobType || "Full-Time"}</span></div>
                {!expanded && job.description && <p className="job-preview">{job.description}</p>}
                <div className="job-card-footer"><span className="job-posted"><CalendarDays size={13} />{postedLabel(job.createdAt)}</span><div><button type="button" className="job-details-button" onClick={() => setExpandedId(expanded ? "" : job._id)}>{expanded ? "Hide details" : "View details"}</button>{applyUrl && <a href={applyUrl} target="_blank" rel="noreferrer" className="job-apply-button">Apply now <ArrowRight size={14} /></a>}</div></div>
                {expanded && <div className="job-description">{job.description || "No additional description provided."}</div>}
              </motion.article>;
            })}
          </AnimatePresence>
        </motion.div> : <div className="jobs-empty"><span className="jobs-empty-icon"><Search size={20} /></span><strong>{jobs.length ? "No jobs match these filters" : "No open jobs listed yet"}</strong><p>{jobs.length ? "Try another title, area or job type." : "New approved local opportunities will appear here."}</p>{(keywords || location || typeFilter !== "All jobs") && <button type="button" onClick={clearFilters}>Clear search and filters</button>}</div>}
      </main>
    </div>
  </div>;
}
