"use client";

import { useForm } from "react-hook-form";
import { useState } from "react";

export default function AddJob() {
    const { register, handleSubmit } = useForm();
    const [loading, setLoading] = useState(false);

    const onSubmit = async (data: any) => {
        setLoading(true);

        await fetch("/api/jobs", {
            method: "POST",
            body: JSON.stringify({
                role: data.role,
                companyName: data.company,
                description: data.description,
                address: data.address,
                salary: data.salary,
                type: data.type,
                applyLink: data.applyLink,
            }),
        });

        setLoading(false);
        alert("Job Added Successfully 🔥");
    };

    return (
        <div className="p-5 space-y-6">

            {/* HEADER */}
            <h1 className="text-2xl font-bold">Add Job</h1>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

                {/* ROLE */}
                <input
                    {...register("role")}
                    placeholder="Job Role (e.g. Sales Executive)"
                    className="w-full p-4 border rounded-xl"
                />

                {/* COMPANY */}
                <input
                    {...register("company")}
                    placeholder="Company Name"
                    className="w-full p-4 border rounded-xl"
                />

                {/* DESCRIPTION */}
                <textarea
                    {...register("description")}
                    placeholder="Job Description"
                    className="w-full p-4 border rounded-xl h-28"
                />

                {/* ADDRESS */}
                <input
                    {...register("address")}
                    placeholder="Job Location / Address"
                    className="w-full p-4 border rounded-xl"
                />

                {/* SALARY */}
                <input
                    {...register("salary")}
                    placeholder="Salary (e.g. 15000)"
                    className="w-full p-4 border rounded-xl"
                />

                {/* TYPE */}
                <select
                    {...register("type")}
                    className="w-full p-4 border rounded-xl"
                >
                    <option value="">Select Job Type</option>
                    <option value="Full Time">Full Time</option>
                    <option value="Part Time">Part Time</option>
                </select>

                {/* APPLY LINK */}
                <input
                    {...register("applyLink")}
                    placeholder="Apply Link (URL)"
                    className="w-full p-4 border rounded-xl"
                />

                {/* SUBMIT */}
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-primary text-white py-4 rounded-xl font-bold"
                >
                    {loading ? "Adding..." : "Add Job"}
                </button>

            </form>

        </div>
    );
}