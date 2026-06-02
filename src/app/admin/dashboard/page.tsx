"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
    Store,
    Briefcase,
    Bus,
    Hospital,
    Plus,
    ArrowRight,
    AlertCircle,
    Map
} from "lucide-react";

export default function Dashboard() {
    const [stats, setStats] = useState<any>({});
    const [recentShops, setRecentShops] = useState<any[]>([]);

    useEffect(() => {
        // 🔥 stats
        fetch("/api/admin-stats")
            .then((res) => res.json())
            .then((data) => setStats(data));

        // 🔥 recent shops (for quick edit)
        fetch("/api/shops")
            .then((res) => res.json())
            .then((data) => setRecentShops(data.slice(0, 3)));
    }, []);

    return (
        <div className="p-5 space-y-6">

            {/* HEADER */}
            <div>
                <h1 className="text-3xl font-bold">Dashboard</h1>
                <p className="text-gray-500 text-sm">
                    Manage your town system
                </p>
            </div>

            {/* 🔥 STATS */}
            <div className="grid grid-cols-2 gap-4">

                <Link href="/admin/shops">
                    <div
                        className="bg-gradient-to-br from-blue-100 to-blue-200 p-5 rounded-2xl shadow hover:scale-105 transition">
                        <Store/>
                        <p className="text-sm mt-2">Shops</p>
                        <h2 className="text-2xl font-bold">{stats.shops || 0}</h2>
                    </div>
                </Link>

                <Link href="/admin/jobs">
                    <div
                        className="bg-gradient-to-br from-green-100 to-green-200 p-5 rounded-2xl shadow hover:scale-105 transition">
                        <Briefcase/>
                        <p className="text-sm mt-2">Jobs</p>
                        <h2 className="text-2xl font-bold">{stats.jobs || 0}</h2>
                    </div>
                </Link>

                <Link href="/admin/buses">
                    <div
                        className="bg-gradient-to-br from-yellow-100 to-yellow-200 p-5 rounded-2xl shadow hover:scale-105 transition">
                        <Bus/>
                        <p className="text-sm mt-2">Buses</p>
                        <h2 className="text-2xl font-bold">{stats.buses || 0}</h2>
                    </div>
                </Link>

                <Link href="/admin/hospitals">
                    <div
                        className="bg-gradient-to-br from-red-100 to-red-200 p-5 rounded-2xl shadow hover:scale-105 transition">
                        <Hospital/>
                        <p className="text-sm mt-2">Hospitals</p>
                        <h2 className="text-2xl font-bold">{stats.hospitals || 0}</h2>
                    </div>
                </Link>

                <Link href="/admin/tourism">
                    <div className="bg-gradient-to-br from-purple-100 to-indigo-200 p-5 rounded-2xl shadow hover:scale-105 transition">
                        <Map />
                        <p className="text-sm mt-2">Tourism</p>
                        <h2 className="text-2xl font-bold">
                            {stats.tourism || 0}
                        </h2>
                    </div>
                </Link>
                <Link href="/admin/jobs/pending">
                    <div className="bg-gradient-to-br from-red-100 to-red-200 p-5 rounded-2xl shadow hover:scale-105 transition">

                        <AlertCircle className="text-red-600" />

                        <p className="text-sm mt-2">Pending Jobs</p>

                        <h2 className="text-2xl font-bold text-red-600">
                            {stats.pendingJobs || 0}
                        </h2>

                    </div>
                </Link>

            </div>

            {/* ⚡ QUICK ACTIONS */}
            <div>
                <h2 className="text-lg font-semibold mb-3">Quick Add</h2>

                <div className="grid grid-cols-2 gap-4">

                    <Link href="/admin/add-shop">
                        <div
                            className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white p-6 rounded-3xl shadow-lg flex flex-col gap-3 hover:scale-105 transition">
                            <span className="text-2xl">🏬</span>
                            <h3 className="font-bold text-lg">Add Shop</h3>
                            <p className="text-xs opacity-80">Add new local shop</p>
                        </div>
                    </Link>

                    <Link href="/admin/add-job">
                        <div
                            className="bg-gradient-to-br from-green-500 to-emerald-600 text-white p-6 rounded-3xl shadow-lg flex flex-col gap-3 hover:scale-105 transition">
                            <span className="text-2xl">💼</span>
                            <h3 className="font-bold text-lg">Add Job</h3>
                            <p className="text-xs opacity-80">Post job openings</p>
                        </div>
                    </Link>

                    <Link href="/admin/add-bus">
                        <div
                            className="bg-gradient-to-br from-yellow-500 to-orange-500 text-white p-6 rounded-3xl shadow-lg flex flex-col gap-3 hover:scale-105 transition">
                            <span className="text-2xl">🚌</span>
                            <h3 className="font-bold text-lg">Add Bus</h3>
                            <p className="text-xs opacity-80">Add bus timing</p>
                        </div>
                    </Link>

                    <Link href="/admin/add-hospital">
                        <div
                            className="bg-gradient-to-br from-red-500 to-pink-600 text-white p-6 rounded-3xl shadow-lg flex flex-col gap-3 hover:scale-105 transition">
                            <span className="text-2xl">🏥</span>
                            <h3 className="font-bold text-lg">Add Hospital</h3>
                            <p className="text-xs opacity-80">Emergency services</p>
                        </div>
                    </Link>

                    <Link href="/admin/add-tourism">
                        <div
                            className="bg-gradient-to-br from-purple-500 to-indigo-600 text-white p-6 rounded-3xl shadow-lg flex flex-col gap-3 hover:scale-105 transition">
                            <span className="text-2xl">🌍</span>
                            <h3 className="font-bold text-lg">Add Tourism</h3>
                            <p className="text-xs opacity-80">Add tourist places & history</p>
                        </div>
                    </Link>

                </div>
            </div>


            <div className="bg-white p-5 rounded-3xl shadow space-y-3">
                <h2 className="font-semibold text-lg">System Status</h2>

                <div className="space-y-2 text-sm">

                    <div className="flex justify-between">
                        <span>Database</span>
                        <span className="text-green-600 font-medium">● Connected</span>
                    </div>

                    <div className="flex justify-between">
                        <span>API</span>
                        <span className="text-green-600 font-medium">● Running</span>
                    </div>

                    <div className="flex justify-between">
                        <span>Images</span>
                        <span className="text-green-600 font-medium">● Cloudinary OK</span>
                    </div>

                </div>
            </div>



            <div className="bg-white p-5 rounded-3xl shadow space-y-3">
                <h2 className="font-semibold text-lg">Insights</h2>

                <div className="text-sm text-gray-600 space-y-2">

                    <p>
                        🏬 Shops dominate your platform with <b>{stats.shops}</b> entries
                    </p>

                    <p>
                        💼 Jobs available: <b>{stats.jobs}</b>
                    </p>

                    <p>
                        🚌 Bus routes active: <b>{stats.buses}</b>
                    </p>

                    <p>
                        🚨 Emergency services: <b>{stats.hospitals}</b>
                    </p>

                </div>
            </div>


            <div className="bg-white p-5 rounded-3xl shadow">
                <h2 className="font-semibold mb-2">Admin Tips</h2>

                <ul className="text-sm text-gray-500 space-y-2">
                    <li>✔ Keep shop data updated</li>
                    <li>✔ Add bus timings daily</li>
                    <li>✔ Update job listings regularly</li>
                    <li>✔ Ensure hospital contacts are correct</li>
                </ul>
            </div>

        </div>
    );
}