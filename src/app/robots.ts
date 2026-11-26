
import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: "*",
            allow: "/",
            disallow: [
                "/admin/",
                "/api/",
                "/business/dashboard/",
            ],
        },

        sitemap: "https://nammatpr.in/sitemap.xml",
        host: "https://nammatpr.in",
    };
}
