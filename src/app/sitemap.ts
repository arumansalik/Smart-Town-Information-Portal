
import type { MetadataRoute } from "next";
import { connectDB } from "@/lib/db";
import Job from "@/models/Job";
import Shop from "@/models/Shop";

const BASE_URL = "https://nammatpr.in";

export const revalidate = 3600;

function slugify(value: string) {
    return value
        .toLowerCase()
        .trim()
        .replace(/&/g, "and")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const staticPages: MetadataRoute.Sitemap = [
        {
            url: BASE_URL,
            changeFrequency: "daily",
            priority: 1,
        },
        {
            url: `${BASE_URL}/shops`,
            changeFrequency: "weekly",
            priority: 0.9,
        },
        {
            url: `${BASE_URL}/jobs`,
            changeFrequency: "daily",
            priority: 0.9,
        },
        {
            url: `${BASE_URL}/buses`,
            changeFrequency: "weekly",
            priority: 0.8,
        },
        {
            url: `${BASE_URL}/hospitals`,
            changeFrequency: "monthly",
            priority: 0.8,
        },
        {
            url: `${BASE_URL}/tourism`,
            changeFrequency: "weekly",
            priority: 0.9,
        },
    ];

    try {
        await connectDB();

        // Fetch approved jobs
        const jobs = await Job.find({ status: "approved" })
            .select("_id updatedAt createdAt")
            .sort({ createdAt: -1 })
            .lean();

        const jobPages: MetadataRoute.Sitemap = jobs.map((job) => ({
            url: `${BASE_URL}/jobs/${job._id.toString()}`,
            lastModified: job.updatedAt || job.createdAt || new Date(),
            changeFrequency: "weekly",
            priority: 0.8,
        }));

        // Fetch shops
        const shops = await Shop.find({})
            .select("_id name category updatedAt createdAt")
            .sort({ createdAt: -1 })
            .lean();

        // Generate unique category pages
        const categories = new Map<
            string,
            { lastModified: Date }
        >();

        for (const shop of shops) {
            if (!shop.category) continue;

            const categorySlug = slugify(shop.category);

            if (!categorySlug) continue;

            const modified =
                shop.updatedAt || shop.createdAt || new Date();

            const existing = categories.get(categorySlug);

            if (
                !existing ||
                modified.getTime() > existing.lastModified.getTime()
            ) {
                categories.set(categorySlug, {
                    lastModified: modified,
                });
            }
        }

        const categoryPages: MetadataRoute.Sitemap = Array.from(
            categories.entries()
        ).map(([categorySlug, data]) => ({
            url: `${BASE_URL}/shops/${categorySlug}`,
            lastModified: data.lastModified,
            changeFrequency: "weekly",
            priority: 0.8,
        }));

        // Generate individual shop detail pages
        const shopPages: MetadataRoute.Sitemap = shops
            .filter((shop) => shop.category && slugify(shop.category))
            .map((shop) => ({
                url: `${BASE_URL}/shops/${slugify(shop.category)}/${shop._id.toString()}`,
                lastModified:
                    shop.updatedAt || shop.createdAt || new Date(),
                changeFrequency: "weekly",
                priority: 0.7,
            }));

        return [
            ...staticPages,
            ...jobPages,
            ...categoryPages,
            ...shopPages,
        ];
    } catch (error) {
        console.error("Sitemap generation failed:", error);

        return staticPages;
    }
}
