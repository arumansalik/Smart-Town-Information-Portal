"use client";

import { useForm } from "react-hook-form";
import { useState } from "react";

export default function AddHospital() {
    const { register, handleSubmit } = useForm();
    const [loading, setLoading] = useState(false);

    const onSubmit = async (data: any) => {
        setLoading(true);

        // 🔥 Upload image to Cloudinary
        const formData = new FormData();
        formData.append("file", data.image[0]);

        const uploadRes = await fetch("/api/upload", {
            method: "POST",
            body: formData,
        });

        const uploadData = await uploadRes.json();

        // 🔥 Save hospital
        await fetch("/api/hospitals", {
            method: "POST",
            body: JSON.stringify({
                name: data.name,
                type: data.type,
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
        alert("Hospital Added Successfully 🚨");
    };

    return (
        <div className="p-5 space-y-6">

            {/* HEADER */}
            <h1 className="text-2xl font-bold text-red-600">
                Add Hospital
            </h1>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

                {/* NAME */}
                <input
                    {...register("name")}
                    placeholder="Hospital Name"
                    className="w-full p-4 border rounded-xl"
                />

                {/* TYPE */}
                <select
                    {...register("type")}
                    className="w-full p-4 border rounded-xl"
                >
                    <option value="">Select Type</option>
                    <option value="General">General</option>
                    <option value="ENT">ENT</option>
                    <option value="Skin">Skin</option>
                    <option value="24x7">24x7</option>
                </select>

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

                {/* SUBMIT */}
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-red-600 text-white py-4 rounded-xl font-bold"
                >
                    {loading ? "Adding..." : "Add Hospital"}
                </button>

            </form>

        </div>
    );
}