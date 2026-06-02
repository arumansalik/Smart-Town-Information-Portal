"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function AdminBuses() {
    const [buses, setBuses] = useState<any[]>([]);
    const [selectedId, setSelectedId] = useState<string | null>(null);

    const fetchData = () => {
        fetch("/api/buses")
            .then((res) => res.json())
            .then((data) => setBuses(data));
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleDelete = async () => {
        await fetch(`/api/buses/${selectedId}`, { method: "DELETE" });
        setSelectedId(null);
        fetchData();
    };

    return (
        <div className="p-5 space-y-5">

            <h1 className="text-2xl font-bold">Manage Buses</h1>

            {buses.map((bus) => (
                <div key={bus._id} className="bg-white p-4 rounded-xl shadow space-y-2">

                    <p className="font-semibold">{bus.time}</p>
                    <p className="text-sm text-gray-500">{bus.route}</p>

                    <div className="flex gap-3">
                        <Link href={`/admin/buses/${bus._id}`} className="flex-1 bg-primary text-white py-2 rounded text-center">
                            Edit
                        </Link>

                        <button
                            onClick={() => setSelectedId(bus._id)}
                            className="flex-1 bg-red-500 text-white py-2 rounded"
                        >
                            Delete
                        </button>
                    </div>

                </div>
            ))}

            {/* MODAL */}
            {selectedId && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
                    <div className="bg-white p-5 rounded-xl space-y-3">
                        <p>Delete this bus?</p>
                        <div className="flex gap-3">
                            <button onClick={() => setSelectedId(null)} className="border px-4 py-2 rounded">
                                Cancel
                            </button>
                            <button onClick={handleDelete} className="bg-red-500 text-white px-4 py-2 rounded">
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}