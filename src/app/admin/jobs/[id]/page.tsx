"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function EditJob() {
    const { id } = useParams();
    const router = useRouter();

    const [form, setForm] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        fetch(`/api/jobs/${id}`)
            .then((res) => res.json())
            .then((data) => setForm(data));
    }, [id]);

    if (!form) return <div className="p-5">Loading...</div>;

    const handleUpdate = async () => {
        setLoading(true);

        await fetch(`/api/jobs/${id}`, {
            method: "PUT",
            body: JSON.stringify(form),
        });

        setLoading(false);
        setSuccess(true);

        setTimeout(() => {
            router.push("/admin/jobs");
        }, 1500);
    };

    return (
        <div className="p-5 space-y-4">

            <h1 className="text-xl font-bold">Edit Job</h1>

            {success && <div className="text-green-600">Updated ✅</div>}

            <input value={form.role || ""} onChange={(e) => setForm({ ...form, role: e.target.value })} className="w-full p-3 border rounded" />
            <input value={form.companyName || ""} onChange={(e) => setForm({ ...form, companyName: e.target.value })} className="w-full p-3 border rounded" />
            <input value={form.salary || ""} onChange={(e) => setForm({ ...form, salary: e.target.value })} className="w-full p-3 border rounded" />

            <textarea value={form.description || ""} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full p-3 border rounded" />

            <button onClick={handleUpdate} className="w-full bg-primary text-white py-3 rounded">
                {loading ? "Updating..." : "Update Job"}
            </button>

        </div>
    );
}