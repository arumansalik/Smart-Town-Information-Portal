import { connectDB } from "@/lib/db";
import Job from "@/models/Job";
import Link from "next/link";

export default async function JobsPage() {
    await connectDB();

    // 🔥 ONLY APPROVED JOBS
    const jobs = await Job.find({
        status: "approved",
    }).sort({ createdAt: -1 });

    return (
        <div className="p-4 space-y-6">

            {/* HEADER */}
            <h1 className="text-3xl font-bold p-3 ">💼 Jobs</h1>

            <Link href="/post-job">
                <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-4 rounded-2xl text-center font-semibold shadow hover:scale-105 transition">
                    💼 Want to post a job? Click here →
                </div>
            </Link>

            <div className="space-y-6">

                {jobs.map((job: any) => (
                    <div
                        key={job._id}
                        className="bg-white rounded-3xl shadow-lg p-6 space-y-4 border border-gray-100"
                    >

                        <div className="flex justify-between items-center">
                            <span className="bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full font-medium">
                                {job.jobType}
                            </span>

                            <span className="bg-primary text-white text-xs px-3 py-1 rounded-full font-medium">
                                ₹ {job.salary}/month
                            </span>
                        </div>

                        <h2 className="text-2xl font-bold">
                            {job.role}
                        </h2>

                        <p className="text-gray-600 font-medium">
                            {job.company}
                        </p>

                        <p className="text-sm text-gray-500 line-clamp-2">
                            {job.description}
                        </p>

                        <p className="text-sm text-gray-400">
                            📍 {job.address}
                        </p>

                        <a
                            href={job.applyLink}
                            target="_blank"
                            className="block text-center bg-primary text-white py-3 rounded-xl font-semibold mt-3"
                        >
                            Apply Now →
                        </a>

                    </div>
                ))}

            </div>

        </div>
    );
}