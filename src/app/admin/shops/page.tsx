"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function AdminShops() {
    const [shops, setShops] = useState<any[]>([]);
    const [selectedId, setSelectedId] = useState<string | null>(null);

    // 🔥 Fetch shops
    const fetchShops = () => {
        fetch("/api/shops")
            .then((res) => res.json())
            .then((data) => setShops(data));
    };

    useEffect(() => {
        fetchShops();
    }, []);

    // 🔥 DELETE FUNCTION
    const handleDelete = async () => {
        if (!selectedId) return;

        await fetch(`/api/shops/${selectedId}`, {
            method: "DELETE",
        });

        setSelectedId(null);
        fetchShops(); // refresh list
    };

    return (
        <div className="p-5 space-y-5">

            <h1 className="text-2xl font-bold">Manage Shops</h1>

            <div className="space-y-4">

                {shops.map((shop) => (
                    <div
                        key={shop._id}
                        className="bg-white p-4 rounded-2xl shadow space-y-3"
                    >

                        {/* INFO */}
                        <div>
                            <h2 className="font-semibold">{shop.name}</h2>
                            <p className="text-sm text-gray-500">{shop.category}</p>
                        </div>

                        {/* ACTIONS */}
                        <div className="flex gap-3">

                            {/* EDIT */}
                            <Link
                                href={`/admin/shops/${shop._id}`}
                                className="flex-1 text-center bg-primary text-white py-2 rounded-lg"
                            >
                                Edit
                            </Link>

                            {/* DELETE */}
                            <button
                                onClick={() => setSelectedId(shop._id)}
                                className="flex-1 bg-red-500 text-white py-2 rounded-lg"
                            >
                                Delete
                            </button>

                        </div>

                    </div>
                ))}

            </div>

            {/* 🔥 DELETE MODAL */}
            {selectedId && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

                    <div className="bg-white p-6 rounded-2xl w-[90%] max-w-sm space-y-4">

                        <h2 className="text-lg font-semibold">
                            Delete this shop?
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