
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { getWeather, getForecast } from "@/lib/weather";
import { motion } from "framer-motion";
import WeatherCard from "@/components/WeatherCard";
import HomeBusSection from "@/components/HomeBusSection";
import HomeShopSection from "@/components/HomeShopSection";
import HomeJobsSection from "@/components/HomeJobsSection";
import HomeEmergencySection from "@/components/HomeEmergencySection";
import TourismSection from "@/components/TourismSection";

function formatForecast(data: any) {
    if (!data?.list) return [];

    return data.list
        .filter((_: any, i: number) => i % 8 === 0)
        .slice(1, 4)
        .map((item: any) => ({
            day: new Date(item.dt * 1000).toLocaleDateString("en-IN", {
                weekday: "short",
            }),
            temp: Math.round(item.main.temp),
            condition: item.weather[0].main,
        }));
}

export default async function Home() {
    const weather = await getWeather();
    const forecastRaw = await getForecast();
    const forecast = formatForecast(forecastRaw);



    return (
        <div className="p-4 space-y-6">

            {/* 🌦️ MASSIVE WEATHER CARD */}
            <div>
                <WeatherCard data={weather} forecast={forecast} />
            </div>

            {/* 🚌 BUS SECTION */}
            <HomeBusSection />

            {/* 🛍️ SHOP CATEGORIES */}
            <HomeShopSection />

            <TourismSection />

            <HomeJobsSection />

            {/* 🚨 EMERGENCY HOSPITALS */}
            <HomeEmergencySection />

        </div>
    );
}