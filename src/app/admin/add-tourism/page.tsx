"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddTourism() {
    const router = useRouter();

    const [form, setForm] = useState<any>({
        title: "",
        description: "",
        place: "",
        latitude: "",
        longitude: "",
    });

    const [imageFile, setImageFile] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if (!form.title || !form.description) {
            alert("Please fill required fields");
            return;
        }

        setLoading(true);

        let imageUrl = "";

        // 🔥 Upload Image to Cloudinary
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

        // 🔥 Send Data to API
        await fetch("/api/tourism", {
            method: "POST",
            body: JSON.stringify({
                title: form.title,
                description: form.description,
                image: imageUrl,
                place: form.place,
                location: {
                    latitude: Number(form.latitude),
                    longitude: Number(form.longitude),
                },
            }),
        });

        setLoading(false);

        alert("Tourism place added ✅");

        router.push("/admin/dashboard");
    };

    return (
        <div className="p-5 space-y-5">

            {/* HEADER */}
            <h1 className="text-2xl font-bold">
                🌍 Add Tourism Place
            </h1>

            {/* IMAGE PREVIEW */}
            {imageFile && (
                <img
                    src={URL.createObjectURL(imageFile)}
                    className="w-full h-48 object-cover rounded-xl"
                />
            )}

            {/* IMAGE INPUT */}
            <input
                type="file"
                onChange={(e) => setImageFile(e.target.files?.[0])}
                className="w-full p-3 border rounded-xl"
            />

            {/* TITLE */}
            <input
                placeholder="Place Title"
                value={form.title}
                onChange={(e) =>
                    setForm({ ...form, title: e.target.value })
                }
                className="w-full p-3 border rounded-xl"
            />

            {/* DESCRIPTION */}
            <textarea
                placeholder="Description"
                value={form.description}
                onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                }
                className="w-full p-3 border rounded-xl"
            />

            {/* PLACE */}
            <input
                placeholder="Location Name (e.g., Near Karaikudi)"
                value={form.place}
                onChange={(e) =>
                    setForm({ ...form, place: e.target.value })
                }
                className="w-full p-3 border rounded-xl"
            />

            {/* LAT + LNG */}
            <div className="grid grid-cols-2 gap-4">
                <input
                    placeholder="Latitude"
                    value={form.latitude}
                    onChange={(e) =>
                        setForm({ ...form, latitude: e.target.value })
                    }
                    className="w-full p-3 border rounded-xl"
                />

                <input
                    placeholder="Longitude"
                    value={form.longitude}
                    onChange={(e) =>
                        setForm({ ...form, longitude: e.target.value })
                    }
                    className="w-full p-3 border rounded-xl"
                />
            </div>

            {/* SUBMIT */}
            <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full bg-primary text-white py-3 rounded-xl font-bold"
            >
                {loading ? "Adding..." : "Add Tourism Place"}
            </button>

        </div>
    );
}