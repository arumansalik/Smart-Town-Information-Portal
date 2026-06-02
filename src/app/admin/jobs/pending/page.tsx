"use client";

import { useEffect, useState } from "react";

export default function PendingJobs() {
    const [jobs, setJobs] = useState<any[]>([]);

    const fetchJobs = () => {
        fetch("/api/jobs?status=pending")
            .then((res) => res.json())
            .then(setJobs);
    };

    useEffect(() => {
        fetchJobs();
    }, []);

    const approve = async (id: string) => {
        await fetch(`/api/jobs/${id}`, {
            method: "PUT",
            body: JSON.stringify({ status: "approved" }),
        });
        fetchJobs();
    };

    const reject = async (id: string) => {
        await fetch(`/api/jobs/${id}`, {
            method: "DELETE",
        });
        fetchJobs();
    };

    return (
        <div className="p-5 space-y-4">

            <h1 className="text-2xl font-bold">Pending Jobs</h1>

            {jobs.map((job) => (
                <div key={job._id} className="bg-white p-4 rounded shadow">

                    <h2 className="font-bold">{job.role}</h2>
                    <p className="text-sm">{job.companyName}</p>

                    <div className="flex gap-3 mt-3">
                        <button
                            onClick={() => approve(job._id)}
                            className="bg-green-500 text-white px-3 py-1 rounded"
                        >
                            Approve
                        </button>

                        <button
                            onClick={() => reject(job._id)}
                            className="bg-red-500 text-white px-3 py-1 rounded"
                        >
                            Reject
                        </button>
                    </div>

                </div>
            ))}

        </div>
    );
}