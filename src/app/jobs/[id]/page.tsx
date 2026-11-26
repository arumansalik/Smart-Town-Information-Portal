
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import mongoose from "mongoose";

import connectDB from "@/lib/mongodb";
import Job from "@/models/Job";

type JobData = {
    id: string;
    role: string;
    companyName: string;
    description: string;
    address: string;
    salary?: string;
    jobType?: string;
    applyLink?: string;
    createdAt?: string;
};

type Props = {
    params: Promise<{ id: string }>;
};

const SITE_URL = "https://nammatpr.in";

async function getJob(id: string): Promise<JobData | null> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return null;
    }

    try {
        await connectDB();

        const job = await Job.findOne({
            _id: id,
            status: "approved",
        }).lean();

        if (!job) {
            return null;
        }

        return {
            id: job._id.toString(),
            role: job.role,
            companyName: job.companyName,
            description: job.description,
            address: job.address,
            salary: job.salary || "",
            jobType: job.jobType || "",
            applyLink: job.applyLink || "",
            createdAt: job.createdAt
                ? new Date(job.createdAt).toISOString()
                : "",
        };
    } catch (error) {
        console.error("Error fetching job:", error);
        return null;
    }
}

// Supports normal URLs and Markdown links stored in MongoDB.
function getSafeApplyUrl(value?: string): string {
    if (!value) return "";

    let link = value.trim();

    // Extract URL from: [label](https://example.com)
    const markdownMatch = link.match(
        /^\[[^\]]*\]\((https?:\/\/[^)\s]+)\)$/i
    );

    if (markdownMatch) {
        link = markdownMatch[1];
    }

    if (/^www\./i.test(link)) {
        link = `https://${link}`;
    }

    try {
        const parsedUrl = new URL(link);

        if (
            parsedUrl.protocol === "https:" ||
            parsedUrl.protocol === "http:"
        ) {
            return parsedUrl.toString();
        }
    } catch {
        // Invalid URL
    }

    if (/^(mailto:|tel:)/i.test(link)) {
        return link;
    }

    return "";
}

// Escape text before converting it into HTML for JobPosting JSON-LD.
function escapeHtml(value: string): string {
    return value
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function descriptionToHtml(description: string): string {
    return description
        .trim()
        .split(/\r?\n/)
        .map((line) => `<p>${escapeHtml(line)}</p>`)
        .join("");
}

function safeJsonLd(data: object): string {
    return JSON.stringify(data).replace(/</g, "\\u003c");
}

export async function generateMetadata({
                                           params,
                                       }: Props): Promise<Metadata> {
    const { id } = await params;
    const job = await getJob(id);

    if (!job) {
        return {
            title: "Job Not Found | Namma TPR",
            description: "This job vacancy is unavailable.",
            robots: {
                index: false,
                follow: true,
            },
        };
    }

    const title = `${job.role} at ${job.companyName} | Namma TPR`;

    const description =
        job.description.replace(/\s+/g, " ").trim().slice(0, 155) ||
        `Explore the ${job.role} vacancy at ${job.companyName}.`;

    const jobUrl = `${SITE_URL}/jobs/${job.id}`;

    return {
        title,
        description,
        alternates: {
            canonical: `/jobs/${job.id}`,
        },
        robots: {
            index: true,
            follow: true,
        },
        openGraph: {
            title,
            description,
            url: jobUrl,
            siteName: "Namma TPR",
            type: "article",
        },
        twitter: {
            card: "summary",
            title,
            description,
        },
    };
}

export default async function JobDetailsPage({ params }: Props) {
    const { id } = await params;
    const job = await getJob(id);

    if (!job) {
        notFound();
    }

    const jobUrl = `${SITE_URL}/jobs/${job.id}`;
    const applyUrl = getSafeApplyUrl(job.applyLink);

    const postedDate = job.createdAt
        ? new Date(job.createdAt).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "long",
            year: "numeric",
        })
        : "";

    const employmentType =
        job.jobType === "Full-Time"
            ? "FULL_TIME"
            : job.jobType === "Part-Time"
                ? "PART_TIME"
                : undefined;

    // The stored address is the actual locality supplied for this vacancy.
    const jobPosting = {
        "@context": "https://schema.org",
        "@type": "JobPosting",
        title: job.role,
        description: descriptionToHtml(job.description),
        identifier: {
            "@type": "PropertyValue",
            name: job.companyName,
            value: job.id,
        },
        datePosted: job.createdAt,
        employmentType,
        hiringOrganization: {
            "@type": "Organization",
            name: job.companyName,
        },
        jobLocation: {
            "@type": "Place",
            address: {
                "@type": "PostalAddress",
                addressLocality: job.address,
                addressRegion: "Tamil Nadu",
                addressCountry: "IN",
            },
        },
        url: jobUrl,
    };

    return (
        <main className="min-h-screen bg-gray-50 px-4 py-10">
            <div className="mx-auto max-w-4xl">

                <a
                    href="/jobs"
                    className="mb-6 inline-flex items-center text-sm font-medium text-blue-600 hover:underline"
                >
                    ← Back to all jobs
                </a>

                <article className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">

                    <header className="border-b border-gray-100 pb-6">
                        <p className="mb-2 text-sm font-medium text-blue-600">
                            Job Opportunity
                        </p>

                        <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                            {job.role}
                        </h1>

                        <p className="mt-2 text-lg font-medium text-gray-700">
                            {job.companyName}
                        </p>

                        {postedDate && (
                            <p className="mt-3 text-sm text-gray-500">
                                Posted on {postedDate}
                            </p>
                        )}
                    </header>

                    <section className="grid gap-4 border-b border-gray-100 py-6 sm:grid-cols-2">

                        <div>
                            <p className="text-sm text-gray-500">
                                Location
                            </p>
                            <p className="mt-1 font-medium text-gray-900">
                                {job.address}, Tamil Nadu, India
                            </p>
                        </div>

                        {job.jobType && (
                            <div>
                                <p className="text-sm text-gray-500">
                                    Employment Type
                                </p>
                                <p className="mt-1 font-medium text-gray-900">
                                    {job.jobType}
                                </p>
                            </div>
                        )}

                        {job.salary && (
                            <div>
                                <p className="text-sm text-gray-500">
                                    Salary
                                </p>
                                <p className="mt-1 font-medium text-gray-900">
                                    {job.salary}
                                </p>
                            </div>
                        )}

                        <div>
                            <p className="text-sm text-gray-500">
                                Company
                            </p>
                            <p className="mt-1 font-medium text-gray-900">
                                {job.companyName}
                            </p>
                        </div>

                    </section>

                    <section className="py-6">
                        <h2 className="mb-4 text-xl font-semibold text-gray-900">
                            Job Description
                        </h2>

                        <div className="whitespace-pre-line leading-7 text-gray-700">
                            {job.description}
                        </div>
                    </section>

                    {applyUrl && (
                        <div className="border-t border-gray-100 pt-6">
                            <a
                                href={applyUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
                            >
                                Apply Now
                            </a>
                        </div>
                    )}

                </article>
            </div>

            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: safeJsonLd(jobPosting),
                }}
            />
        </main>
    );
}
