"use client";

import { useState } from "react";
import { Search } from "lucide-react";

function SearchOverlay({ onClose }: { onClose: () => void }) {
    const [query, setQuery] = useState("");
    const [filter, setFilter] = useState("all");

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-start justify-center pt-20">

            <div className="bg-white w-[90%] max-w-2xl rounded-2xl shadow-xl p-6 animate-slideDown">

                {/* HEADER */}
                <div className="flex justify-between items-center mb-4">
                    <h2 className="font-semibold text-lg">Search SmartTown</h2>
                    <button onClick={onClose} className="text-gray-500">✕</button>
                </div>

                {/* SEARCH INPUT */}
                <input
                    type="text"
                    placeholder="Search shops, jobs, buses..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="w-full border px-4 py-3 rounded-lg mb-4 outline-none focus:ring-2 focus:ring-blue-500"
                />

                {/* FILTERS */}
                <div className="flex gap-2 mb-4 flex-wrap">
                    {["all", "shops", "jobs", "bus", "hospital"].map((item) => (
                        <button
                            key={item}
                            onClick={() => setFilter(item)}
                            className={`px-4 py-1 rounded-full text-sm ${
                                filter === item
                                    ? "bg-blue-600 text-white"
                                    : "bg-gray-100"
                            }`}
                        >
                            {item}
                        </button>
                    ))}
                </div>

                {/* RESULTS */}
                <div className="max-h-[300px] overflow-y-auto space-y-2">
                    {/* Example result */}
                    <div className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                        Sample Result ({filter})
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function Navbar() {
    const [openSearch, setOpenSearch] = useState(false);

    return (
        <>
            <nav className="w-full bg-white shadow-md px-6 py-3 flex items-center justify-between sticky top-0 z-50">

                {/* LEFT - LOGO */}
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg"></div>
                    <h1 className="font-bold text-lg">SmartTown</h1>
                </div>

                {/* CENTER - LINKS */}
                <div className="hidden md:flex gap-6 font-medium">
                    <a href="/">Home</a>
                    <a href="/shops">Shops</a>
                    <a href="/jobs">Jobs</a>
                    <a href="/bus">Bus</a>
                    <a href="/hospital">Hospital</a>
                </div>

                {/* RIGHT - SEARCH */}
                <div
                    onClick={() => setOpenSearch(true)}
                    className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-xl cursor-pointer hover:bg-gray-200"
                >
                    <Search size={18} />
                    <span className="text-sm text-gray-500">Search...</span>
                </div>
            </nav>

            {/* SEARCH OVERLAY */}
            {openSearch && <SearchOverlay onClose={() => setOpenSearch(false)} />}
        </>
    );
}