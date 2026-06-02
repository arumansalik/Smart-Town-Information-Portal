"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function SearchPage() {
    const searchParams = useSearchParams();
    const q = searchParams.get("q");

    const [data, setData] = useState<any>({
        shops: [],
        jobs: [],
        buses: [],
    });

    useEffect(() => {
        if (!q) return;

        fetch(`/api/search?q=${q}`)
            .then((res) => res.json())
            .then((d) => setData(d));
    }, [q]);

    return (
        <div className="p-4 space-y-6">

            <h1 className="text-xl font-bold">
                Results for "{q}"
            </h1>

            {/* 🏬 SHOPS */}
            {data.shops.length > 0 && (
                <div>
                    <h2 className="font-semibold mb-2">Shops</h2>

                    {data.shops.map((s: any) => (
                        <Link key={s._id} href={`/shops/${s.category}`}>
                            <div className="bg-white p-3 rounded-xl shadow mb-2">
                                {s.name}
                            </div>
                        </Link>
                    ))}
                </div>
            )}

            {/* 💼 JOBS */}
            {data.jobs.length > 0 && (
                <div>
                    <h2 className="font-semibold mb-2">Jobs</h2>

                    {data.jobs.map((j: any) => (
                        <div key={j._id} className="bg-white p-3 rounded-xl shadow mb-2">
                            {j.role} - {j.companyName}
                        </div>
                    ))}
                </div>
            )}

            {/* 🚌 BUSES */}
            {data.buses.length > 0 && (
                <div>
                    <h2 className="font-semibold mb-2">Buses</h2>

                    {data.buses.map((b: any) => (
                        <div key={b._id} className="bg-white p-3 rounded-xl shadow mb-2">
                            {b.route} - {b.time}
                        </div>
                    ))}
                </div>
            )}

            {/* ❌ EMPTY */}
            {data.shops.length === 0 &&
                data.jobs.length === 0 &&
                data.buses.length === 0 && (
                    <p className="text-gray-500">No results found</p>
                )}
        </div>
    );
}