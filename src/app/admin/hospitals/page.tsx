"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function AdminHospitals() {
    const [data, setData] = useState<any[]>([]);
    const [selectedId, setSelectedId] = useState<string | null>(null);

    const fetchData = () => {
        fetch("/api/hospitals")
            .then((res) => res.json())
            .then((d) => setData(d));
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleDelete = async () => {
        await fetch(`/api/hospitals/${selectedId}`, { method: "DELETE" });
        setSelectedId(null);
        fetchData();
    };

    return (
        <div className="p-5 space-y-5">

            <h1 className="text-2xl font-bold">Manage Hospitals</h1>

            {data.map((h) => (
                <div key={h._id} className="bg-white p-4 rounded-xl shadow space-y-2">

                    <p className="font-semibold">{h.name}</p>
                    <p className="text-sm text-gray-500">{h.type}</p>

                    <div className="flex gap-3">
                        <Link href={`/admin/hospitals/${h._id}`} className="flex-1 bg-primary text-white py-2 rounded text-center">
                            Edit
                        </Link>

                        <button
                            onClick={() => setSelectedId(h._id)}
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
                        <p>Delete this hospital?</p>
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