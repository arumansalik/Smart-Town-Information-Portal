"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function PostJob() {
    const router = useRouter();

    const [form, setForm] = useState<any>({
        role: "",
        companyName: "",
        salary: "",
        address: "",
        description: "",
        jobType: "Full-Time",
        applyLink: "",
    });

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async () => {
        if (!form.role || !form.companyName || !form.address) {
            alert("Please fill required fields");
            return;
        }

        setLoading(true);

        await fetch("/api/jobs", {
            method: "POST",
            body: JSON.stringify({
                ...form,
                status: "pending",
            }),
        });

        setLoading(false);
        setSuccess(true);

        setTimeout(() => {
            router.push("/jobs");
        }, 1500);
    };

    return (
        <div className="p-5 space-y-6">

            {/* 🔥 HEADER */}
            <div className="space-y-1">
                <h1 className="text-3xl font-bold">
                    💼 Post a Job
                </h1>

                <p className="text-gray-500 text-sm">
                    Reach local talent quickly. Fill the details below to publish your job.
                </p>
            </div>

            {/* SUCCESS MESSAGE */}
            {success && (
                <div className="bg-green-100 text-green-700 p-3 rounded-xl text-sm">
                    ✅ Job submitted! Waiting for admin approval.
                </div>
            )}

            {/* FORM */}
            <div className="bg-white p-5 rounded-3xl shadow space-y-4">

                {/* ROLE */}
                <input
                    placeholder="Job Role (e.g., Video Editor)"
                    value={form.role}
                    onChange={(e) =>
                        setForm({ ...form, role: e.target.value })
                    }
                    className="w-full p-4 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary"
                />

                {/* COMPANY */}
                <input
                    placeholder="Company Name"
                    value={form.companyName}
                    onChange={(e) =>
                        setForm({ ...form, companyName: e.target.value })
                    }
                    className="w-full p-4 border rounded-2xl focus:ring-2 focus:ring-primary"
                />

                {/* ADDRESS */}
                <input
                    placeholder="Location / Address"
                    value={form.address}
                    onChange={(e) =>
                        setForm({ ...form, address: e.target.value })
                    }
                    className="w-full p-4 border rounded-2xl focus:ring-2 focus:ring-primary"
                />

                {/* SALARY + JOB TYPE */}
                <div className="grid grid-cols-2 gap-4">

                    <input
                        placeholder="Salary (₹ / month)"
                        value={form.salary}
                        onChange={(e) =>
                            setForm({ ...form, salary: e.target.value })
                        }
                        className="w-full p-4 border rounded-2xl focus:ring-2 focus:ring-primary"
                    />

                    {/* 🔥 JOB TYPE SELECT */}
                    <select
                        value={form.jobType}
                        onChange={(e) =>
                            setForm({ ...form, jobType: e.target.value })
                        }
                        className="w-full p-4 border rounded-2xl bg-white focus:ring-2 focus:ring-primary"
                    >
                        <option>Full-Time</option>
                        <option>Part-Time</option>
                    </select>

                </div>

                {/* APPLY LINK */}
                <input
                    placeholder="Apply Link (WhatsApp / Website)"
                    value={form.applyLink}
                    onChange={(e) =>
                        setForm({ ...form, applyLink: e.target.value })
                    }
                    className="w-full p-4 border rounded-2xl focus:ring-2 focus:ring-primary"
                />

                {/* DESCRIPTION */}
                <textarea
                    placeholder="Job Description (roles, requirements...)"
                    value={form.description}
                    onChange={(e) =>
                        setForm({ ...form, description: e.target.value })
                    }
                    className="w-full p-4 border rounded-2xl h-32 focus:ring-2 focus:ring-primary"
                />

                {/* SUBMIT BUTTON */}
                <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="w-full bg-primary text-white py-4 rounded-2xl font-bold text-lg hover:opacity-90 transition"
                >
                    {loading ? "Submitting..." : "Submit Job"}
                </button>

            </div>

        </div>
    );
}