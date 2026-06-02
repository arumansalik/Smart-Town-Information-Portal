"use client";

import { useForm } from "react-hook-form";
import { useState } from "react";

export default function AddShop() {
    const { register, handleSubmit } = useForm();
    const [loading, setLoading] = useState(false);

    const onSubmit = async (data: any) => {
        setLoading(true);

        // 🔥 UPLOAD IMAGE FIRST
        const formData = new FormData();
        formData.append("file", data.image[0]);

        const uploadRes = await fetch("/api/upload", {
            method: "POST",
            body: formData,
        });

        const uploadData = await uploadRes.json();

        // 🔥 SAVE SHOP
        await fetch("/api/shops", {
            method: "POST",
            body: JSON.stringify({
                name: data.name,
                category: data.category.toLowerCase(),
                address: data.address,
                phone: data.phone,
                photo: uploadData.url,
                location: {
                    latitude: Number(data.latitude),
                    longitude: Number(data.longitude),
                },
            }),
        });

        setLoading(false);
        alert("Shop Added Successfully 🔥");
    };

    return (
        <div className="p-5 space-y-6">

            <h1 className="text-2xl font-bold">Add Shop</h1>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

                {/* NAME */}
                <input
                    {...register("name")}
                    placeholder="Shop Name"
                    className="w-full p-4 border rounded-xl"
                />

                {/* CATEGORY */}
                <input
                    {...register("category")}
                    placeholder="Category (atm, super market...)"
                    className="w-full p-4 border rounded-xl"
                />

                {/* ADDRESS */}
                <input
                    {...register("address")}
                    placeholder="Address"
                    className="w-full p-4 border rounded-xl"
                />

                {/* PHONE */}
                <input
                    {...register("phone")}
                    placeholder="Phone Number"
                    className="w-full p-4 border rounded-xl"
                />

                {/* LAT */}
                <input
                    {...register("latitude")}
                    placeholder="Latitude"
                    className="w-full p-4 border rounded-xl"
                />

                {/* LNG */}
                <input
                    {...register("longitude")}
                    placeholder="Longitude"
                    className="w-full p-4 border rounded-xl"
                />

                {/* IMAGE */}
                <input
                    type="file"
                    {...register("image")}
                    className="w-full p-4 border rounded-xl"
                />

                {/* BUTTON */}
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-primary text-white py-4 rounded-xl font-bold"
                >
                    {loading ? "Uploading..." : "Add Shop"}
                </button>

            </form>

        </div>
    );
}