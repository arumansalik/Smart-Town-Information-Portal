"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function EditHospital() {
    const { id } = useParams();
    const router = useRouter();

    const [form, setForm] = useState<any>(null);
    const [imageFile, setImageFile] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetch(`/api/hospitals/${id}`)
            .then((res) => res.json())
            .then((data) => setForm(data));
    }, [id]);

    if (!form) return <div className="p-5">Loading...</div>;

    const handleUpdate = async () => {
        setLoading(true);

        let imageUrl = form.photo;

        if (imageFile) {
            const fd = new FormData();
            fd.append("file", imageFile);

            const res = await fetch("/api/upload", {
                method: "POST",
                body: fd,
            });

            const data = await res.json();
            imageUrl = data.url;
        }

        await fetch(`/api/hospitals/${id}`, {
            method: "PUT",
            body: JSON.stringify({
                ...form,
                photo: imageUrl,
            }),
        });

        router.push("/admin/hospitals");
    };

    return (
        <div className="p-5 space-y-4">

            <h1 className="text-xl font-bold">Edit Hospital</h1>

            <img src={form.photo} className="w-full h-40 object-cover rounded" />

            <input type="file" onChange={(e) => setImageFile(e.target.files?.[0])} />

            <input value={form.name || ""} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full p-3 border rounded" />

            <input value={form.type || ""} onChange={(e) => setForm({ ...form, type: e.target.value })} className="w-full p-3 border rounded" />

            <button onClick={handleUpdate} className="w-full bg-red-500 text-white py-3 rounded">
                {loading ? "Updating..." : "Update Hospital"}
            </button>

        </div>
    );
}