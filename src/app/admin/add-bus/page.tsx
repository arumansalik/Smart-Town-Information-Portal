"use client";

import { useForm } from "react-hook-form";
import { useState } from "react";

export default function AddBus() {
    const { register, handleSubmit } = useForm();
    const [loading, setLoading] = useState(false);


    const onSubmit = async (data: any) => {
        setLoading(true);
        const formattedTime = `${data.hours}:${data.minutes} ${data.period}`;
        await fetch("/api/buses", {
            method: "POST",
            body: JSON.stringify({
                time: formattedTime,
                route: data.route,
                busName: data.busName,
                type: data.type,
            }),
        });

        setLoading(false);
        alert("Bus Added Successfully 🚌");
    };

    return (
        <div className="p-5 space-y-6">

            {/* HEADER */}
            <h1 className="text-2xl font-bold">Add Bus</h1>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

                {/* TIME */}
                <div className="flex gap-2">

                    {/* HOURS */}
                    <input
                        {...register("hours")}
                        placeholder="HH"
                        className="w-1/3 p-4 border rounded-xl text-center"
                        maxLength={2}
                    />

                    {/* MINUTES */}
                    <input
                        {...register("minutes")}
                        placeholder="MM"
                        className="w-1/3 p-4 border rounded-xl text-center"
                        maxLength={2}
                    />

                    {/* AM / PM */}
                    <select
                        {...register("period")}
                        className="w-1/3 p-4 border rounded-xl"
                    >
                        <option value="AM">AM</option>
                        <option value="PM">PM</option>
                    </select>

                </div>

                {/* ROUTE */}
                <input
                    {...register("route")}
                    placeholder="Route (Thiruppathur → Madurai)"
                    className="w-full p-4 border rounded-xl"
                />

                {/* BUS NAME */}
                <input
                    {...register("busName")}
                    placeholder="Bus Name (TNSTC / Private)"
                    className="w-full p-4 border rounded-xl"
                />

                {/* TYPE */}
                <select
                    {...register("type")}
                    className="w-full p-4 border rounded-xl"
                >
                    <option value="">Select Type</option>
                    <option value="Government">Government</option>
                    <option value="Private">Private</option>
                </select>

                {/* SUBMIT */}
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-primary text-white py-4 rounded-xl font-bold"
                >
                    {loading ? "Adding..." : "Add Bus"}
                </button>

            </form>

        </div>
    );
}