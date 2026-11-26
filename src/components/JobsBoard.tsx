import { connectDB } from "@/lib/db";
import Job from "@/models/Job";
import JobsBoardClient from "@/components/JobsBoardClient";

export default async function JobsBoard() {
  try {
    await connectDB();

    const jobs = await Job.find({ status: "approved" })
        .sort({ createdAt: -1 })
        .lean();

    const formattedJobs = jobs.map((job) => ({
      _id: job._id.toString(),
      role: job.role,
      companyName: job.companyName,
      description: job.description,
      address: job.address,
      salary: job.salary || "",
      jobType: job.jobType || "Full-Time",
      applyLink: job.applyLink || "",
      createdAt: job.createdAt
          ? new Date(job.createdAt).toISOString()
          : "",
    }));

    return <JobsBoardClient initialJobs={formattedJobs} />;
  } catch (error) {
    console.error("Jobs server rendering error:", error);

    return (
        <section className="jobs-board">
          <h1>Jobs in Tiruppattur</h1>
          <p>
            Job listings are temporarily unavailable. Please visit again shortly.
          </p>
        </section>
    );
  }
}