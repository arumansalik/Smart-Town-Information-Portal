"use client";

import { useEffect, useState } from "react";

// 🧠 Convert time → minutes
function convertToMinutes(time: string) {
    const [hourMin, period] = time.split(" ");
    let [hours, minutes] = hourMin.split(":").map(Number);

    if (period === "PM" && hours !== 12) hours += 12;
    if (period === "AM" && hours === 12) hours = 0;

    return hours * 60 + minutes;
}

// 🧠 Sort buses (NEXT BUS FIRST)
function sortBuses(buses: any[]) {
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    return buses.sort((a, b) => {
        const aTime = convertToMinutes(a.time);
        const bTime = convertToMinutes(b.time);

        const aDiff = aTime - currentMinutes;
        const bDiff = bTime - currentMinutes;

        // both future → nearest first
        if (aDiff >= 0 && bDiff >= 0) return aDiff - bDiff;

        // both past → earlier first
        if (aDiff < 0 && bDiff < 0) return aTime - bTime;

        // future always before past
        return aDiff >= 0 ? -1 : 1;
    });
}

// 🧠 Filter by city
function filterBuses(buses: any[], city: string) {
    if (!city) return buses;

    return buses.filter((bus) =>
        bus.route.toLowerCase().includes(city.toLowerCase())
    );
}

export default function BusPage() {
    const [buses, setBuses] = useState<any[]>([]);
    const [selectedCity, setSelectedCity] = useState("");

    // 🔥 Fetch buses
    useEffect(() => {
        fetch("/api/buses")
            .then((res) => res.json())
            .then((data) => setBuses(data));
    }, []);

    // 🔥 Apply filter + sort
    let filtered = filterBuses(buses, selectedCity);
    let sortedBuses = sortBuses(filtered);

    // 🧠 current time for highlight
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    return (
        <div className="p-4 space-y-5">

            {/* 🔥 HEADER */}
            <h1 className="text-2xl font-bold">🚌 Bus Timings</h1>

            {/* 🔥 FILTER BUTTONS */}
            <div className="flex gap-2 overflow-x-auto pb-2">

                {["All", "Madurai", "Karaikudi"].map((city) => (
                    <button
                        key={city}
                        onClick={() => setSelectedCity(city === "All" ? "" : city)}
                        className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap
              ${
                            selectedCity === city || (city === "All" && !selectedCity)
                                ? "bg-primary text-white"
                                : "bg-gray-100"
                        }`}
                    >
                        {city}
                    </button>
                ))}

            </div>

            {/* 🧱 GRID */}
            <div className="grid grid-cols-1 gap-4">

                {sortedBuses.map((bus, i) => {
                    const busTime = convertToMinutes(bus.time);
                    const isNext = busTime >= currentMinutes && i === 0;

                    return (
                        <div
                            key={bus._id}
                            className={`rounded-3xl p-5 shadow-md transition
                ${
                                isNext
                                    ? "bg-green-100 border-2 border-green-500"
                                    : "bg-white"
                            }`}
                        >

                            {/* 🔥 NEXT TAG */}
                            {isNext && (
                                <span className="text-xs bg-green-500 text-white px-2 py-1 rounded-full">
                  Next Bus
                </span>
                            )}

                            {/* TIME */}
                            <h1 className="text-3xl font-bold mt-2 text-primary">
                                {bus.time}
                            </h1>

                            {/* ROUTE */}
                            <p className="text-lg font-semibold mt-1">
                                {bus.route}
                            </p>

                            {/* NAME */}
                            <p className="text-sm text-gray-500 mt-1">
                                {bus.busName}
                            </p>

                            {/* TYPE */}
                            <span
                                className={`inline-block mt-3 text-xs px-3 py-1 rounded-full
                  ${
                                    bus.type === "Government"
                                        ? "bg-green-100 text-green-700"
                                        : "bg-blue-100 text-blue-700"
                                }`}
                            >
                {bus.type}
              </span>

                        </div>
                    );
                })}

            </div>

        </div>
    );
}