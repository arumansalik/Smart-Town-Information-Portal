"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function AdminTourism() {
    const [data, setData] = useState<any[]>([]);
    const [selectedId, setSelectedId] = useState<string | null>(null);

    // 🔥 Fetch tourism data
    const fetchData = () => {
        fetch("/api/tourism")
            .then((res) => res.json())
            .then((d) => setData(d));
    };

    useEffect(() => {
        fetchData();
    }, []);

    // 🔥 DELETE FUNCTION
    const handleDelete = async () => {
        if (!selectedId) return;

        await fetch(`/api/tourism/${selectedId}`, {
            method: "DELETE",
        });

        setSelectedId(null);
        fetchData(); // refresh
    };

    return (
        <div className="p-5 space-y-5">

            {/* HEADER */}
            <h1 className="text-2xl font-bold">
                🌍 Manage Tourism
            </h1>

            {/* EMPTY STATE */}
            {data.length === 0 && (
                <p className="text-gray-500">No tourism places found</p>
            )}

            {/* LIST */}
            <div className="space-y-4">

                {data.map((item) => (
                    <div
                        key={item._id}
                        className="bg-white rounded-2xl shadow overflow-hidden"
                    >

                        {/* IMAGE */}
                        <img
                            src={item.image || "/images/default.jpg"}
                            className="w-full h-40 object-cover"
                        />

                        {/* CONTENT */}
                        <div className="p-4 space-y-2">

                            <h2 className="font-semibold text-lg">
                                {item.title}
                            </h2>

                            <p className="text-sm text-gray-500 line-clamp-2">
                                {item.description}
                            </p>

                            <p className="text-xs text-gray-400">
                                📍 {item.place}
                            </p>

                            {/* ACTIONS */}
                            <div className="flex gap-3 pt-2">

                                {/* EDIT */}
                                <Link
                                    href={`/admin/tourism/${item._id}`}
                                    className="flex-1 bg-primary text-white py-2 rounded-lg text-center"
                                >
                                    Edit
                                </Link>

                                {/* DELETE */}
                                <button
                                    onClick={() => setSelectedId(item._id)}
                                    className="flex-1 bg-red-500 text-white py-2 rounded-lg"
                                >
                                    Delete
                                </button>

                            </div>

                        </div>

                    </div>
                ))}

            </div>

            {/* 🔥 DELETE MODAL */}
            {selectedId && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

                    <div className="bg-white p-6 rounded-2xl w-[90%] max-w-sm space-y-4">

                        <h2 className="text-lg font-semibold">
                            Delete this place?
                        </h2>

                        <p className="text-sm text-gray-500">
                            This action cannot be undone.
                        </p>

                        <div className="flex gap-3">

                            <button
                                onClick={() => setSelectedId(null)}
                                className="flex-1 border py-2 rounded-lg"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={handleDelete}
                                className="flex-1 bg-red-500 text-white py-2 rounded-lg"
                            >
                                Delete
                            </button>

                        </div>

                    </div>

                </div>
            )}

        </div>
    );
}