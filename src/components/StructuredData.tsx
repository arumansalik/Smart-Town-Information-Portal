
const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": "https://nammatpr.in/#organization",
    name: "Namma TPR",
    url: "https://nammatpr.in/",
    description:
        "A local information platform for Tiruppattur, featuring businesses, jobs, shops, hospitals, transportation and tourism information.",
    areaServed: {
        "@type": "City",
        name: "Tiruppattur",
        containedInPlace: {
            "@type": "State",
            name: "Tamil Nadu",
        },
    },
};

const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": "https://nammatpr.in/#website",
    name: "Namma TPR",
    url: "https://nammatpr.in/",
    description:
        "Discover local businesses, jobs, shops, hospitals, bus timings and tourism information in Tiruppattur.",
    publisher: {
        "@id": "https://nammatpr.in/#organization",
    },
};

export default function StructuredData() {
    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(organizationSchema).replace(/</g, "\\u003c"),
                }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(websiteSchema).replace(/</g, "\\u003c"),
                }}
            />
        </>
    );
}
