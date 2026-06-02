import Link from "next/link";

async function getJobs() {
    const res = await fetch("http://localhost:3000/api/jobs", {
        cache: "no-store",
    });
    return res.json();
}

export default async function HomeJobsSection() {
    const jobs = await getJobs();

    const topJobs = jobs.slice(0, 4);

    return (
        <div className="bg-white rounded-3xl p-5 shadow-md space-y-5">

            {/* HEADER */}
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">💼 Jobs</h2>

                <Link href="/jobs" className="text-sm text-primary font-medium">
                    View all →
                </Link>
            </div>

            {/* GRID */}
            <div className="grid grid-cols-2 gap-4">

                {topJobs.map((job: any) => (
                    <div
                        key={job._id}
                        className="bg-bg p-4 rounded-2xl shadow-sm space-y-2"
                    >

                        <h3 className="font-semibold text-sm leading-tight">
                            {job.role}
                        </h3>

                        <p className="text-xs text-gray-500">
                            {job.company}
                        </p>

                        <div className="flex justify-between items-center pt-1">

              <span className="text-primary font-bold text-sm">
                {job.salary}
              </span>

                            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                {job.jobType}
              </span>

                        </div>

                    </div>
                ))}

            </div>

        </div>
    );
}