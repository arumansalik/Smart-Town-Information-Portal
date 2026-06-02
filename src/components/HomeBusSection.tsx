import Link from "next/link";
import { Bus } from "lucide-react";

async function getBuses() {
    const res = await fetch("http://localhost:3000/api/buses", {
        cache: "no-store",
    });
    return res.json();
}

export default async function HomeBusSection() {
    const buses = await getBuses();

    if (!buses || buses.length === 0) return null;

    const topBuses = buses.slice(0, 6);

    return (
        <div className="bg-slate-50 rounded-3xl p-6 shadow-md space-y-5">

            {/* 🔥 HEADER */}
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <Bus className="text-primary" />
                    <h2 className="text-xl font-bold text-slate-800">
                        Bus Timings
                    </h2>
                </div>

                <Link
                    href="/buses"
                    className="text-sm text-primary font-medium hover:underline"
                >
                    View all →
                </Link>
            </div>

            {/* 🚍 SCROLLABLE ROW */}
            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">

                {topBuses.map((bus: any) => {
                    const isGovt = bus.type === "Government";

                    return (
                        <div
                            key={bus._id}
                            className="min-w-[240px] rounded-2xl p-5
              bg-white border border-slate-200
              shadow-sm hover:shadow-xl
              transition duration-300"
                        >

                            {/* TIME */}
                            <h1 className="text-2xl font-bold text-primary">
                                {bus.time}
                            </h1>

                            {/* ROUTE */}
                            <p className="text-sm mt-2 font-semibold text-slate-800">
                                {bus.route}
                            </p>

                            {/* BUS NAME */}
                            <p className="text-xs text-slate-500 mt-1">
                                {bus.busName}
                            </p>

                            {/* TYPE + CTA */}
                            <div className="mt-4 flex justify-between items-center">

                <span
                    className={`text-xs font-medium px-3 py-1 rounded-full
                  ${
                        isGovt
                            ? "bg-indigo-100 text-indigo-700"
                            : "bg-orange-100 text-orange-700"
                    }`}
                >
                  {isGovt ? "Government" : "Private"}
                </span>

                                <span className="text-xs text-primary font-medium">
                  Track →
                </span>

                            </div>
                        </div>
                    );
                })}

            </div>
        </div>
    );
}