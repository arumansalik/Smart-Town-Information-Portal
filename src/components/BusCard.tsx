"use client";

import { Bus } from "lucide-react";

export default function BusCard({ bus }: any) {
    const isGovt = bus.type === "Government";

    return (
        <div className="bg-white rounded-3xl p-5 shadow-md hover:shadow-lg transition">

            {/* 🕒 TIME (MAIN HERO) */}
            <h1 className="text-4xl font-extrabold text-primary">
                {bus.time}
            </h1>

            {/* ROUTE */}
            <p className="text-lg font-semibold mt-2">
                {bus.route}
            </p>

            {/* BUS NAME */}
            <p className="text-sm text-gray-500 mt-1">
                {bus.busName}
            </p>

            {/* FOOTER */}
            <div className="flex justify-between items-center mt-4">

                {/* TYPE BADGE */}
                <div
                    className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium
          ${isGovt
                        ? "bg-green-100 text-green-700"
                        : "bg-blue-100 text-blue-700"
                    }`}
                >
                    <Bus size={16} />
                    {isGovt ? "Government" : "Private"}
                </div>

                {/* ACTION */}
                <button className="text-sm text-primary font-medium">
                    Details →
                </button>

            </div>

        </div>
    );
}