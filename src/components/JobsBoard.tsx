
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

    const jobsStructuredData = {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "@id": "https://nammatpr.in/jobs#webpage",
      name: "Jobs in Tiruppattur",
      description:
          "Explore local job vacancies in Tiruppattur. Find full-time and part-time opportunities, company details and application information.",
      url: "https://nammatpr.in/jobs",
      isPartOf: {
        "@id": "https://nammatpr.in/#website",
      },
      mainEntity: {
        "@type": "ItemList",
        name: "Available Jobs in Tiruppattur",
        numberOfItems: formattedJobs.length,
        itemListElement: formattedJobs.map((job, index) => ({
          "@type": "ListItem",
          position: index + 1,
          item: {
            "@type": "Thing",
            name: `${job.role} at ${job.companyName}`,
            description: job.description,
          },
        })),
      },
    };

    return (
        <>
          <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{
                __html: JSON.stringify(jobsStructuredData).replace(
                    /</g,
                    "\\u003c"
                ),
              }}
          />

          <JobsBoardClient initialJobs={formattedJobs} />
        </>
    );
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
