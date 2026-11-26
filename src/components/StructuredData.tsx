
export default function StructuredData() {
    const structuredData = [
        {
            "@context": "https://schema.org",
            "@type": "Organization",
            "@id": "https://nammatpr.in/#organization",
            name: "Namma TPR",
            url: "https://nammatpr.in/",
            description:
                "Namma TPR is a local information portal for jobs, shops, businesses and services in Tiruppattur, Tamil Nadu.",
            areaServed: {
                "@type": "City",
                name: "Tiruppattur",
                containedInPlace: {
                    "@type": "State",
                    name: "Tamil Nadu",
                },
            },
        },

        {
            "@context": "https://schema.org",
            "@type": "WebSite",
            "@id": "https://nammatpr.in/#website",
            name: "Namma TPR",
            alternateName: "nammatpr.in",
            url: "https://nammatpr.in/",
            description:
                "Namma TPR is the local information portal for Tiruppattur, Tamil Nadu. Find jobs, shops, businesses and essential town services.",
            publisher: {
                "@id": "https://nammatpr.in/#organization",
            },
            inLanguage: "en-IN",
        }
    ];

    return (
        <>
            {structuredData.map((data, index) => (
                <script
                    key={index}
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
                    }}
                />
            ))}
        </>
    );
}
