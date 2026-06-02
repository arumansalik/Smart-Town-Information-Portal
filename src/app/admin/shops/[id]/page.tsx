"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function EditShop() {
    const { id } = useParams();
    const router = useRouter();

    const [form, setForm] = useState<any>(null);
    const [imageFile, setImageFile] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    // 🔥 Fetch existing shop data
    useEffect(() => {
        fetch(`/api/shops/${id}`)
            .then((res) => res.json())
            .then((data) => setForm(data));
    }, [id]);

    // ✅ Loading UI
    if (!form) {
        return <div className="p-5">Loading...</div>;
    }

    // 🔥 UPDATE FUNCTION
    const handleUpdate = async () => {
        setLoading(true);

        let imageUrl = form.photo;

        // ✅ Upload new image if selected
        if (imageFile) {
            const formData = new FormData();
            formData.append("file", imageFile);

            const uploadRes = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });

            const uploadData = await uploadRes.json();
            imageUrl = uploadData.url;
        }

        // ✅ Update shop
        await fetch(`/api/shops/${id}`, {
            method: "PUT",
            body: JSON.stringify({
                ...form,
                photo: imageUrl,
            }),
        });

        setLoading(false);
        setSuccess(true);

        // 🔥 Redirect after success
        setTimeout(() => {
            router.push("/admin/shops");
        }, 1500);
    };

    return (
        <div className="p-5 space-y-5">

            {/* HEADER */}
            <h1 className="text-2xl font-bold">Edit Shop</h1>

            {/* SUCCESS MESSAGE */}
            {success && (
                <div className="bg-green-100 text-green-700 p-3 rounded-lg text-sm">
                    ✅ Shop updated successfully
                </div>
            )}

            {/* IMAGE PREVIEW */}
            <img
                src={form.photo || "/images/shop.jpg"}
                className="w-full h-48 object-cover rounded-xl"
            />

            {/* IMAGE INPUT */}
            <input
                type="file"
                onChange={(e) => setImageFile(e.target.files?.[0])}
                className="w-full p-3 border rounded"
            />

            {/* NAME */}
            <input
                value={form.name || ""}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full p-3 border rounded"
                placeholder="Name"
            />

            {/* CATEGORY */}
            <input
                value={form.category || ""}
                onChange={(e) =>
                    setForm({ ...form, category: e.target.value.toLowerCase() })
                }
                className="w-full p-3 border rounded"
                placeholder="Category"
            />

            {/* ADDRESS */}
            <input
                value={form.address || ""}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                className="w-full p-3 border rounded"
                placeholder="Address"
            />

            {/* PHONE */}
            <input
                value={form.phone || ""}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full p-3 border rounded"
                placeholder="Phone"
            />

            {/* LATITUDE */}
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
                className="w-full p-3 border rounded"
                placeholder="Latitude"
            />

            {/* LONGITUDE */}
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
                className="w-full p-3 border rounded"
                placeholder="Longitude"
            />

            {/* UPDATE BUTTON */}
            <button
                onClick={handleUpdate}
                disabled={loading}
                className="w-full bg-primary text-white py-3 rounded-xl font-bold"
            >
                {loading ? "Updating..." : "Update Shop"}
            </button>

        </div>
    );
}