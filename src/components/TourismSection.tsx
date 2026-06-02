"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function TourismSection() {
    const [data, setData] = useState<any[]>([]);
    const [index, setIndex] = useState(0);

    useEffect(() => {
        fetch("/api/tourism")
            .then((res) => res.json())
            .then((d) => {
                console.log("TOURISM DATA:", d); // 👈 IMPORTANT
                setData(Array.isArray(d) ? d.slice(0, 5) : []);
            })
            .catch((err) => console.log("Fetch Error:", err));
    }, []);

    // 🔥 AUTO SLIDE
    useEffect(() => {
        if (!data.length) return;

        const interval = setInterval(() => {
            setIndex((prev) => (prev + 1) % data.length);
        }, 3500); // 3.5 sec

        return () => clearInterval(interval);
    }, [data]);

    if (!data || data.length == 0) {
        return (
            <div className="bg-white rounded-3xl p-4 shadow-md">
                <h2 className="text-xl font-bold mb-2">
                    🌍 Explore Your Town More Than Before
                </h2>
                <div className="h-56 bg-gray-200 rounded-2xl animate-pulse" />
            </div>
        );
    }

    return (
        <div className="bg-white rounded-3xl p-2 shadow-md space-y-5">

            {/* HEADER */}
            <div className="flex justify-between items-center px-1">
                <h2 className="text-xl font-bold">🌍 Explore Your Town</h2>

                <Link href="/tourism" className="text-primary text-sm">
                    View All →
                </Link>
            </div>

            {/* 🔥 SLIDER */}
            <div className="relative h-56 rounded-3xl overflow-hidden shadow-lg">

                {data.map((item, i) => (
                    <Link key={item._id} href="/tourism">
                        <div
                            className={`absolute inset-0 transition-all duration-700 ${
                                i === index
                                    ? "opacity-100 scale-100"
                                    : "opacity-0 scale-105"
                            }`}
                        >
                            {/* IMAGE */}
                            <img
                                src={item.image}
                                className="w-full h-56 object-cover"
                            />

                            {/* GRADIENT */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />

                            {/* TEXT */}
                            <div className="absolute bottom-4 left-4 text-white">
                                <h3 className="text-lg font-bold">
                                    {item.title}
                                </h3>
                                <p className="text-xs opacity-80">
                                    Discover this beautiful place
                                </p>
                            </div>
                        </div>
                    </Link>
                ))}

                {/* 🔥 DOTS */}
                <div className="absolute bottom-2 w-full flex justify-center gap-2">
                    {data.map((_, i) => (
                        <div
                            key={i}
                            className={`w-2 h-2 rounded-full transition ${
                                i === index ? "bg-white scale-125" : "bg-white/40"
                            }`}
                        />
                    ))}
                </div>

            </div>

        </div>
    );
}