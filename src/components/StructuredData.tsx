
export default function StructuredData() {
    const structuredData = [
        {
            "@context": "https://schema.org",
            "@type": "Organization",
            "@id": "https://nammatpr.in/#organization",
            name: "Namma TPR",
            url: "https://nammatpr.in/",
            description:
                "Discover local jobs, shops and services in Tiruppattur, Tamil Nadu.",
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
            url: "https://nammatpr.in/",
            description:
                "Your town. All in one place. Find local jobs, shops and services in Tiruppattur.",
            publisher: {
                "@id": "https://nammatpr.in/#organization",
            },
            inLanguage: "en-IN",
        },
    ];

    return (
        <>
            {structuredData.map((data, index) => (
                <script
                    key={index}
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify(data).replace(
                            /</g,
                            "\\u003c"
                        ),
                    }}
                />
            ))}
        </>
    );
}
