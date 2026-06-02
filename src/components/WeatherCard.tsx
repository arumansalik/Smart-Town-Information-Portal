'use client';

import { motion } from "framer-motion";
import { getForecast } from "@/lib/weather";

function getIcon(condition: string) {
    if (condition.includes("Rain")) return "🌧️";
    if (condition.includes("Cloud")) return "☁️";
    if (condition.includes("Clear")) return "☀️";
    return "🌤️";
}

function formatForecast(data: any) {
    const daily = data.list.filter((_: any, i: number) => i % 8 === 0);

    return daily.slice(0, 4).map((item: any) => ({
        day: new Date(item.dt * 1000).toLocaleDateString("en-IN", {
            weekday: "short",
        }),
        temp: Math.round(item.main.temp),
        condition: item.weather[0].main,
    }));
}

// ✅ Dynamic background based on weather
function getBackground(condition: string, isNight: boolean) {
    if (condition.includes("Rain")) {
        return "bg-gradient-to-br from-gray-700 to-gray-900 animate-pulse";
    }

    if (isNight) {
        return "bg-gradient-to-br from-indigo-900 to-black";
    }

    return "bg-gradient-to-br from-sky-400 via-blue-500 to-cyan-400";
}

export default function WeatherCard({ data, forecast }: any) {
    // ✅ Safe data extraction
    const temp = Math.round(data?.main?.temp || 0);
    const condition = data?.weather?.[0]?.main || "Clear";
    const humidity = data?.main?.humidity || 0;
    const wind = data?.wind?.speed || 0;
    const forecastData = forecast || [];

    const bg = condition === "Rain" ? "bg-gradient-to-r from-blue-500 to-indigo-600" : condition === "Clouds" ? "bg-gradient-to-r from-gray-500 to-gray-700" : "bg-gradient-to-r from-blue-600 to-indigo-700";

    return (
        <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className={`relative rounded-3xl p-6 shadow-xl text-white ${bg}`}
        >

            {/* GLASS EFFECT */}
            <div className="absolute inset-0 bg-white/10 backdrop-blur-xl rounded-3xl" />

            <div className="relative z-10">

                {/* Location + Date */}
                <div className="mb-3">
                    <p className="text-sm opacity-80">Thiruppathur</p>
                    <p className="text-xs opacity-70">
                        {new Date().toLocaleDateString("en-IN", {
                            weekday: "long",
                            day: "numeric",
                            month: "short",
                        })}
                    </p>
                </div>

                {/* MAIN LAYOUT */}
                <div className="flex justify-between items-center">

                    {/* LEFT: TEMP */}
                    <div>
                        <h1 className="text-[60px] font-extrabold leading-none">
                            {temp}°
                        </h1>
                        <p className="text-lg mt-1">
                            {getIcon(condition)} {condition}
                        </p>
                    </div>

                    {/* RIGHT: FORECAST */}
                    <div className="flex flex-col gap-3 text-right">
                        {forecast.map((item: any, i: number) => (
                            <div key={i} className="flex items-center gap-3 justify-end">
                                <span>{getIcon(item.condition)}</span>
                                <span className="text-xs opacity-70">{item.day}</span>
                                <span className="font-semibold">{item.temp}°</span>
                            </div>
                        ))}
                    </div>

                </div>

                {/* EXTRA INFO */}


            </div>
        </motion.div>
    );
}