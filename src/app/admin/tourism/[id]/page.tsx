"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function EditTourism() {
    const { id } = useParams();
    const router = useRouter();

    const [form, setForm] = useState<any>(null);
    const [imageFile, setImageFile] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    // 🔥 Fetch existing data
    useEffect(() => {
        fetch(`/api/tourism/${id}`)
            .then((res) => res.json())
            .then((data) => setForm(data));
    }, [id]);

    if (!form) {
        return <div className="p-5">Loading...</div>;
    }

    // 🔥 UPDATE FUNCTION
    const handleUpdate = async () => {
        setLoading(true);

        let imageUrl = form.image;

        // upload new image if selected
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

        await fetch(`/api/tourism/${id}`, {
            method: "PUT",
            body: JSON.stringify({
                ...form,
                image: imageUrl,
                location: {
                    latitude: Number(form.location?.latitude),
                    longitude: Number(form.location?.longitude),
                },
            }),
        });

        setLoading(false);
        setSuccess(true);

        // redirect after success
        setTimeout(() => {
            router.push("/admin/tourism");
        }, 1500);
    };

    return (
        <div className="p-5 space-y-5">

            {/* HEADER */}
            <h1 className="text-2xl font-bold">
                ✏️ Edit Tourism Place
            </h1>

            {/* SUCCESS */}
            {success && (
                <div className="bg-green-100 text-green-700 p-3 rounded">
                    ✅ Updated successfully
                </div>
            )}

            {/* IMAGE */}
            <img
                src={form.image || "/images/default.jpg"}
                className="w-full h-48 object-cover rounded-xl"
            />

            {/* IMAGE INPUT */}
            <input
                type="file"
                onChange={(e) => setImageFile(e.target.files?.[0])}
                className="w-full p-3 border rounded-xl"
            />

            {/* TITLE */}
            <input
                value={form.title || ""}
                onChange={(e) =>
                    setForm({ ...form, title: e.target.value })
                }
                className="w-full p-3 border rounded-xl"
                placeholder="Title"
            />

            {/* DESCRIPTION */}
            <textarea
                value={form.description || ""}
                onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                }
                className="w-full p-3 border rounded-xl"
                placeholder="Description"
            />

            {/* PLACE */}
            <input
                value={form.place || ""}
                onChange={(e) =>
                    setForm({ ...form, place: e.target.value })
                }
                className="w-full p-3 border rounded-xl"
                placeholder="Place"
            />

            {/* LAT + LNG */}
            <div className="grid grid-cols-2 gap-4">

                <input
                    value={form.location?.latitude || ""}
                    onChange={(e) =>
                        setForm({
                            ...form,
                            location: {
                                ...form.location,
                                latitude: e.target.value,
                            },
                        })
                    }
                    className="w-full p-3 border rounded-xl"
                    placeholder="Latitude"
                />

                <input
                    value={form.location?.longitude || ""}
                    onChange={(e) =>
                        setForm({
                            ...form,
                            location: {
                                ...form.location,
                                longitude: e.target.value,
                            },
                        })
                    }
                    className="w-full p-3 border rounded-xl"
                    placeholder="Longitude"
                />

            </div>

            {/* BUTTON */}
            <button
                onClick={handleUpdate}
                disabled={loading}
                className="w-full bg-primary text-white py-3 rounded-xl font-bold"
            >
                {loading ? "Updating..." : "Update Tourism"}
            </button>

        </div>
    );
}