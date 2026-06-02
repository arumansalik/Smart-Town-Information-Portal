"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function EditBus() {
    const { id } = useParams();
    const router = useRouter();

    const [form, setForm] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        fetch(`/api/buses/${id}`)
            .then((res) => res.json())
            .then((data) => setForm(data));
    }, [id]);

    if (!form) return <div className="p-5">Loading...</div>;

    const handleUpdate = async () => {
        setLoading(true);

        await fetch(`/api/buses/${id}`, {
            method: "PUT",
            body: JSON.stringify(form),
        });

        setLoading(false);
        setSuccess(true);

        setTimeout(() => {
            router.push("/admin/buses");
        }, 1500);
    };

    return (
        <div className="p-5 space-y-5">

            <h1 className="text-2xl font-bold">Edit Bus</h1>

            {success && (
                <div className="bg-green-100 text-green-700 p-3 rounded">
                    ✅ Updated successfully
                </div>
            )}

            {/* TIME */}
            <input
                value={form.time || ""}
                onChange={(e) => setForm({ ...form, time: e.target.value })}
                className="w-full p-3 border rounded"
                placeholder="Time"
            />

            {/* ROUTE */}
            <input
                value={form.route || ""}
                onChange={(e) => setForm({ ...form, route: e.target.value })}
                className="w-full p-3 border rounded"
                placeholder="Route"
            />

            {/* NAME */}
            <input
                value={form.busName || ""}
                onChange={(e) => setForm({ ...form, busName: e.target.value })}
                className="w-full p-3 border rounded"
                placeholder="Bus Name"
            />

            {/* TYPE */}
            <select
                value={form.type || ""}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                className="w-full p-3 border rounded"
            >
                <option value="">Select Type</option>
                <option value="Government">Government</option>
                <option value="Private">Private</option>
            </select>

            <button
                onClick={handleUpdate}
                className="w-full bg-primary text-white py-3 rounded"
            >
                {loading ? "Updating..." : "Update Bus"}
            </button>

        </div>
    );
}