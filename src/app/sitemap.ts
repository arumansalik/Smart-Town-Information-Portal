
import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = "https://www.nammatpr.in";

    return [
        {
            url: baseUrl,
            changeFrequency: "daily",
            priority: 1,
        },
        {
            url: `${baseUrl}/shops`,
            changeFrequency: "weekly",
            priority: 0.9,
        },
        {
            url: `${baseUrl}/jobs`,
            changeFrequency: "daily",
            priority: 0.9,
        },
        {
            url: `${baseUrl}/buses`,
            changeFrequency: "weekly",
            priority: 0.8,
        },
        {
            url: `${baseUrl}/hospitals`,
            changeFrequency: "monthly",
            priority: 0.8,
        },
        {
            url: `${baseUrl}/tourism`,
            changeFrequency: "weekly",
            priority: 0.9,
        },
    ];
}
