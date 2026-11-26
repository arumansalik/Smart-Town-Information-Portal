
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import Shop from "@/models/Shop";
import Link from "next/link";
import { MapPin, Phone, ArrowLeft } from "lucide-react";

type Props = {
    params: Promise<{
        category: string;
        id: string;
    }>;
};

type ShopData = {
    _id: string;
    name: string;
    category: string;
    address: string;
    phone: string;
    photo?: string;
    location?: {
        latitude?: number;
        longitude?: number;
    };
};

function slugify(value: string) {
    return value
        .toLowerCase()
        .trim()
        .replace(/&/g, "and")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
}

async function getShop(
    id: string,
    category: string
): Promise<ShopData | null> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return null;
    }

    await connectDB();

    const shop: any = await Shop.findOne({
        _id: id,
    }).lean();

    if (!shop || slugify(shop.category || "") !== category) {
        return null;
    }

    return {
        _id: shop._id.toString(),
        name: shop.name,
        category: shop.category,
        address: shop.address,
        phone: shop.phone,
        photo: shop.photo || "",
        location: {
            latitude: shop.location?.latitude,
            longitude: shop.location?.longitude,
        },
    };
}

export async function generateMetadata({
                                           params,
                                       }: Props): Promise<Metadata> {
    const { category, id } = await params;

    try {
        const shop = await getShop(id, category);

        if (!shop) {
            return {
                title: "Shop not found | Namma TPR",
                robots: {
                    index: false,
                    follow: true,
                },
            };
        }

        const title = `${shop.name} in Tiruppattur | Namma TPR`;
        const description = `Find ${shop.name}, a ${shop.category.toLowerCase()} in Tiruppattur. View its address, contact number and directions on Namma TPR.`;

        const url = `https://nammatpr.in/shops/${category}/${id}`;

        return {
            title,
            description,
            alternates: {
                canonical: `/shops/${category}/${id}`,
            },
            robots: {
                index: true,
                follow: true,
            },
            openGraph: {
                title,
                description,
                url,
                siteName: "Namma TPR",
                type: "website",
                ...(shop.photo ? { images: [shop.photo] } : {}),
            },
        };
    } catch (error) {
        console.error("Shop metadata error:", error);

        return {
            title: "Shop details | Namma TPR",
            robots: {
                index: false,
                follow: true,
            },
        };
    }
}

export const revalidate = 3600;

export default async function ShopDetailPage({
                                                 params,
                                             }: Props) {
    const { category, id } = await params;

    let shop: ShopData | null;

    try {
        shop = await getShop(id, category);
    } catch (error) {
        console.error("Failed to load shop:", error);
        throw error;
    }

    if (!shop) {
        notFound();
    }

    const pageUrl =
        `https://nammatpr.in/shops/${category}/${id}`;

    const latitude = shop.location?.latitude;
    const longitude = shop.location?.longitude;

    const hasCoordinates =
        typeof latitude === "number" &&
        typeof longitude === "number" &&
        Number.isFinite(latitude) &&
        Number.isFinite(longitude) &&
        Math.abs(latitude) <= 90 &&
        Math.abs(longitude) <= 180;

    const mapsUrl = hasCoordinates
        ? `https://www.google.com/maps?q=${latitude},${longitude}`
        : `https://www.google.com/maps?q=${encodeURIComponent(
            shop.address || shop.name
        )}`;

    const structuredData = {
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        "@id": `${pageUrl}#business`,
        name: shop.name,
        description: `${shop.category} in Tiruppattur, Tamil Nadu.`,
        url: pageUrl,
        telephone: shop.phone,
        address: {
            "@type": "PostalAddress",
            streetAddress: shop.address,
            addressLocality: "Tiruppattur",
            addressRegion: "Tamil Nadu",
            addressCountry: "IN",
        },
        ...(shop.photo ? { image: shop.photo } : {}),
        ...(hasCoordinates
            ? {
                geo: {
                    "@type": "GeoCoordinates",
                    latitude,
                    longitude,
                },
            }
            : {}),
        hasMap: mapsUrl,
    };

    const breadcrumbData = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
            {
                "@type": "ListItem",
                position: 1,
                name: "Home",
                item: "https://nammatpr.in",
            },
            {
                "@type": "ListItem",
                position: 2,
                name: "Shops",
                item: "https://nammatpr.in/shops",
            },
            {
                "@type": "ListItem",
                position: 3,
                name: shop.category,
                item: `https://nammatpr.in/shops/${category}`,
            },
            {
                "@type": "ListItem",
                position: 4,
                name: shop.name,
                item: pageUrl,
            },
        ],
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(structuredData).replace(
                        /</g,
                        "\\u003c"
                    ),
                }}
            />

            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(breadcrumbData).replace(
                        /</g,
                        "\\u003c"
                    ),
                }}
            />

            <main className="mx-auto w-full max-w-4xl px-4 py-10">
                <Link
                    href={`/shops/${category}`}
                    className="mb-6 inline-flex items-center gap-2 text-sm text-gray-600 hover:text-black"
                >
                    <ArrowLeft size={16} />
                    Back to {shop.category}
                </Link>

                <article className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                    {shop.photo && (
                        <div className="aspect-video w-full overflow-hidden bg-gray-100">
                            <img
                                src={shop.photo}
                                alt={shop.name}
                                className="h-full w-full object-cover"
                            />
                        </div>
                    )}

                    <div className="p-6 sm:p-8">
            <span className="inline-block rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700">
              {shop.category}
            </span>

                        <h1 className="mt-4 text-3xl font-bold text-gray-900">
                            {shop.name}
                        </h1>

                        <p className="mt-2 text-gray-600">
                            Local {shop.category.toLowerCase()} in Tiruppattur,
                            Tamil Nadu.
                        </p>

                        <div className="mt-8 space-y-5">
                            <div className="flex items-start gap-3">
                                <MapPin
                                    size={20}
                                    className="mt-1 shrink-0 text-gray-500"
                                />
                                <div>
                                    <h2 className="font-semibold text-gray-900">
                                        Address
                                    </h2>
                                    <p className="mt-1 text-gray-600">
                                        {shop.address}, Tiruppattur, Tamil Nadu, India
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <Phone
                                    size={20}
                                    className="mt-1 shrink-0 text-gray-500"
                                />
                                <div>
                                    <h2 className="font-semibold text-gray-900">
                                        Contact number
                                    </h2>
                                    <a
                                        href={`tel:${shop.phone}`}
                                        className="mt-1 inline-block text-blue-600 hover:underline"
                                    >
                                        {shop.phone}
                                    </a>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 flex flex-wrap gap-3">
                            <a
                                href={`tel:${shop.phone}`}
                                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-3 font-medium text-white hover:bg-blue-700"
                            >
                                <Phone size={17} />
                                Call shop
                            </a>

                            <a
                                href={mapsUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-5 py-3 font-medium text-gray-800 hover:bg-gray-50"
                            >
                                <MapPin size={17} />
                                Get directions
                            </a>
                        </div>
                    </div>
                </article>
            </main>
        </>
    );
}
